const parseJsonBody = (req) => new Promise((resolve, reject) => {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    if (!body) return resolve({});
    try {
      resolve(JSON.parse(body));
    } catch (error) {
      reject(error);
    }
  });
  req.on("error", reject);
});

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const getIntegrationBaseUrl = () => {
  const rawDomain = process.env.INTEGRATION_DOMAIN?.trim() || process.env.AMO_DOMAIN?.trim();
  if (!rawDomain) {
    throw new Error("INTEGRATION_DOMAIN is not configured.");
  }
  return `https://${rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
};

const getAccessToken = async () => {
  const domain = getIntegrationBaseUrl();
  const clientId = process.env.AMO_CLIENT_ID;
  const clientSecret = process.env.AMO_CLIENT_SECRET;
  const refreshToken = process.env.AMO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("CRM OAuth credentials are not configured.");
  }

  const response = await fetch(`${domain}/oauth2/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: "https://example.com",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`CRM auth failed: ${errorBody}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("CRM auth returned no access token.");
  }

  return data.access_token;
};

const fetchCrm = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `CRM request failed with status ${response.status}`);
  }

  return response.json();
};

const findContact = async (token, domain, query) => {
  const url = `${domain}/api/v4/contacts?query=${encodeURIComponent(query)}`;
  const data = await fetchCrm(url, token);
  return data._embedded?.contacts?.[0] ?? null;
};

const createContact = async (token, domain, name, tag) => {
  const payload = [{
    name,
    tags: [{ name: tag }],
  }];

  const data = await fetchCrm(`${domain}/api/v4/contacts`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data._embedded?.contacts?.[0] ?? null;
};

const ensureContact = async (token, domain, name, contact, tag) => {
  const existing = await findContact(token, domain, contact || name);
  if (existing) {
    return existing;
  }
  return createContact(token, domain, name, tag);
};

const createLead = async (token, domain, name, contactId, tag) => {
  const payload = [{
    name: `Заявка с сайта: ${name}`,
    pipeline_id: Number(process.env.INTEGRATION_PIPELINE_ID || process.env.AMO_PIPELINE_ID),
    _embedded: { contacts: [{ id: contactId }] },
    tags: [{ name: tag }],
  }];

  const data = await fetchCrm(`${domain}/api/v4/leads`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data._embedded?.leads?.[0] ?? null;
};

const createNote = async (token, domain, elementId, text) => {
  const payload = [{
    element_id: elementId,
    element_type: 2,
    note_type: "common",
    text,
  }];

  await fetchCrm(`${domain}/api/v4/notes`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const { name, contact, phone, salonName, salon, city, comment, source } = body;
  const contactValue = (phone || contact || "").trim();
  if (!name || !contactValue) {
    sendJson(res, 400, { error: "Имя и телефон обязательны для отправки заявки." });
    return;
  }

  const tag = process.env.INTEGRATION_TAG || process.env.AMO_TAG || "Сайт IT BEAUTY";
  const pipelineId = process.env.INTEGRATION_PIPELINE_ID || process.env.AMO_PIPELINE_ID;
  if (!pipelineId) {
    sendJson(res, 500, { error: "INTEGRATION_PIPELINE_ID не настроен в окружении." });
    return;
  }

  try {
    const domain = getIntegrationBaseUrl();
    const token = await getAccessToken();

    const contactEntity = await ensureContact(token, domain, name, contactValue, tag);
    if (!contactEntity?.id) {
      throw new Error("Не удалось создать или найти контакт в интеграционной системе (YCLIENTS/WaHelp).");
    }

    const leadEntity = await createLead(token, domain, name, contactEntity.id, tag);
    if (!leadEntity?.id) {
      throw new Error("Не удалось создать сделку в интеграционной системе (YCLIENTS/WaHelp).");
    }
    const noteText = `Имя: ${name}\nТелефон: ${contactValue}\nСалон: ${salonName || salon || ""}\nГород: ${city || ""}\nКомментарий: ${comment || "без комментариев"}\nИсточник: ${source || "landing_it_beauty"}`;
    await createNote(token, domain, leadEntity.id, noteText);

    sendJson(res, 200, {
      success: true,
      leadId: leadEntity.id,
      contactId: contactEntity.id,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Ошибка при отправке заявки." });
  }
}
