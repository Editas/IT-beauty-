
import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Bot, BarChart3, Settings, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { API_URL, FORM_SOURCE } from "./config";

export default function LandingLayout() {
  const services = [
    {
      icon: Settings,
      title: "Экосистема YCLIENTS + WaHelp",
      text: "Соединяем CRM, записи, workflow и коммуникацию в единую beauty-tech систему без хаоса и дублирования.",
    },
    {
      icon: Bot,
      title: "Автоматизация возврата клиентов",
      text: "Система напоминает о визитах, догоняет после отмен и запускает повторные предложения в нужный момент.",
    },
    {
      icon: MessageCircle,
      title: "Digital-отдел на подписке",
      text: "Поддерживаем интеграции, адаптируем процессы и берём техническую часть на себя.",
    },
    {
      icon: BarChart3,
      title: "Контроль и прогнозируемость",
      text: "Бизнес получает прозрачную загрузку, понятные цифры и меньше ручной работы администратора.",
    },
  ];

  const steps = [
    "Анализируем процессы и точки потери клиентов",
    "Проектируем систему коммуникации и workflow",
    "Настраиваем CRM, автоматизацию и интеграции",
    "Сопровождаем, поддерживаем и адаптируем систему",
  ];

  const stats = [
    ["Возврат клиентов", "+20–30%", "к выручке"],
    ["Автотриггеры", "до 80%", "возвратов"],
    ["Ручная работа", "−50%", "нагрузки"],
  ];

  const faq = [
    {
      question: "Нужно ли менять YCLIENTS?",
      answer: "Нет, мы интегрируемся с вашей текущей системой и сохраняем все записи, заявки и расписание в единой логике.",
    },
    {
      question: "Сколько времени занимает настройка?",
      answer: "В среднем 2–3 недели: аудит, проектирование, настройка и тестирование. Быстрее, если процессы уже описаны.",
    },
    {
      question: "Будет ли работать без технической команды?",
      answer: "Да, мы берём поддержку на себя: администрируем, обновляем и адаптируем сценарии после запуска.",
    },
    {
      question: "Как считается эффективность?",
      answer: "По возврату клиентов, уменьшению ручной работы администратора и росту загруженности без увеличения рекламы.",
    },
  ];

  const proofPoints = [
    "+20–30% к выручке за счёт возврата клиентов",
    "До 80% клиентов возвращаются через триггеры",
    "До 50% меньше ручной работы администратора",
    "Стабильная загрузка без роста рекламного бюджета",
  ];

  const [formValues, setFormValues] = useState({ name: "", contact: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const companyInfo = {
    phone: "+7 (495) 210-30-40",
    email: "hello@itbeauty.ru",
    address: "125009, г. Москва, ул. Ленина, д. 10",
    legal: "ООО «IT BEAUTY», ИНН 7700000000, ОГРН 1027700000000",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusType("");

    const name = formValues.name.trim();
    const contact = formValues.contact.trim();
    const comment = formValues.comment.trim();

    if (!name) {
      setStatusType("error");
      setStatusMessage("Укажите ваше имя.");
      return;
    }

    if (!contact) {
      setStatusType("error");
      setStatusMessage("Укажите телефон или e-mail.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /\+?\d[\d\s\-()]{6,}\d/.test(contact);

    if (!isEmail && !isPhone) {
      setStatusType("error");
      setStatusMessage("Введите корректный телефон или e-mail.");
      return;
    }

    if (comment && comment.length < 5) {
      setStatusType("error");
      setStatusMessage("Комментарий должен содержать минимум 5 символов.");
      return;
    }

    setLoading(true);
    setStatusMessage("Отправка заявки...");
    setStatusType("info");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          comment,
          source: FORM_SOURCE,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Ошибка отправки заявки.");
      }

      setStatusType("success");
      setStatusMessage("Спасибо! Заявка принята и будет передана в AmoCRM.");
      setFormValues({ name: "", contact: "", comment: "" });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Произошла ошибка. Попробуйте снова позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const testimonials = [
    {
      author: "Ольга, владелец салона",
      role: "Beauty-директор",
      text: "Система соединила клиентские заявки, расписание и чат. Отмен стало меньше, команда администраторов работает спокойнее.",
    },
    {
      author: "Марина, собственник студии",
      role: "Сеть салонов",
      text: "Внедрение прошло чётко — записи перестали теряться, а возврат клиентов вырос уже в первый месяц.",
    },
    {
      author: "Игорь, управляющий",
      role: "CRM-проект",
      text: "Мы получили полный порядок в расписании и автоматические триггеры, которые сами возвращают клиентов.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#0B1020] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#4FD1C5]/20 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-[#8B5CF6]/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#4FD1C5]/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1020]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Sparkles className="h-5 w-5 text-[#4FD1C5]" />
            </div>
            <div>
              <p className="text-lg font-black tracking-[0.2em]">IT BEAUTY</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">workflow · crm · chat</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/65 md:flex">
            <a href="#services" className="hover:text-white">Экосистема</a>
            <a href="#process" className="hover:text-white">Процесс</a>
            <a href="#result" className="hover:text-white">Результат</a>
            <a href="#amo" className="hover:text-white">AmoCRM</a>
            <a href="#reviews" className="hover:text-white">Отзывы</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contact" className="hover:text-white">Контакт</a>
          </nav>

          <a href="#contact" className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0B1020] transition hover:bg-white/90">
            Подключить систему
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section id="hero" className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
                beauty-tech ecosystem
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Стабильность,<br />на которую можно положиться
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
                IT BEAUTY объединяет YCLIENTS, WaHelp и AmoCRM в единую работающую экосистему для beauty-бизнеса. Заявки клиента из формы попадают в CRM, а процессы остаются управляемыми и прозрачными.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#contact" className="inline-flex items-center justify-center rounded-2xl bg-[#8B5CF6] px-7 py-4 font-bold text-white transition hover:bg-[#7C3AED]">
                  Запросить внедрение <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a href="#services" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10">
                  Изучить экосистему
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1020] p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#4FD1C5]">IT BEAUTY SYSTEM</p>
                    <p className="mt-2 text-2xl font-black">workflow / crm / chat</p>
                  </div>
                  <div className="rounded-full border border-[#4FD1C5]/25 bg-[#4FD1C5]/10 px-3 py-1 text-sm text-[#4FD1C5]">online</div>
                </div>

                <div className="grid gap-4">
                  {stats.map(([label, value, tag]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div>
                        <p className="text-sm text-white/45">{label}</p>
                        <p className="mt-1 text-3xl font-black">{value}</p>
                      </div>
                      <span className="rounded-full bg-[#8B5CF6]/20 px-3 py-1 text-sm text-white/75">{tag}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#4FD1C5]/20 bg-[#4FD1C5]/10 p-4 text-sm leading-6 text-white/70">
                  система под контролем · владелец спокоен · бизнес предсказуем
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">Что делаем</p>
              <h2 className="text-4xl font-black md:text-5xl">Единая экосистема вместо хаоса</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/20">
                      <Icon className="h-6 w-6 text-[#4FD1C5]" />
                    </div>
                    <h3 className="mb-3 text-xl font-black">{item.title}</h3>
                    <p className="leading-7 text-white/60">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="overview" className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">Почему это работает</p>
              <h2 className="text-4xl font-black md:text-5xl">Больше продаж, меньше ручной работы, максимум контроля</h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Мы масштабируем beauty-бизнес через прозрачные процессы: от онлайн-записи до повторных продаж, сохраняя клиента в системе и снижая нагрузку администратора.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[#4FD1C5]">Управление</p>
                <p className="mt-3 text-xl font-black">Вся информация в одном дашборде</p>
                <p className="mt-3 text-white/65">CRM, записи и чаты работают как единый фронт — без потерь данных и двойного ввода.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[#4FD1C5]">Автоматизация</p>
                <p className="mt-3 text-xl font-black">Сценарии, которые сами догоняют клиента</p>
                <p className="mt-3 text-white/65">Триггеры, напоминания и цепочки сообщений работают вместо администратора, возвращая клиентов и формируя повторный поток.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">Процесс</p>
              <h2 className="text-4xl font-black md:text-5xl">Digital-поддержка, которая работает спокойно</h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Мы не создаём визуальный шум и не продаём сложность. Наша задача — дать владельцу ощущение, что система под контролем.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white font-black text-[#0B1020]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-black">{step}</p>
                    <p className="mt-1 text-white/55">Каждый этап строится вокруг стабильности процессов и прозрачной коммуникации.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="result" className="px-6 py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#4FD1C5]/20 bg-white/[0.06] p-8 md:p-12">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">После внедрения</p>
                <h2 className="text-4xl font-black md:text-5xl">Бизнес растёт, даже когда вы не думаете о маркетинге</h2>
                <p className="mt-5 text-lg leading-8 text-white/65">
                  Больше записей без увеличения рекламы, выше средний чек за счёт точечных предложений и меньше потерянных клиентов.
                </p>
              </div>

              <div className="grid gap-4">
                {proofPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[#4FD1C5]" />
                    <span className="font-semibold text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="amo" className="px-6 py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#4FD1C5]/20 bg-white/[0.06] p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">AmoCRM</p>
                <h2 className="text-4xl font-black md:text-5xl">Интеграция заявок напрямую в AmoCRM</h2>
                <p className="mt-5 text-lg leading-8 text-white/65">
                  После заполнения формы клиентские данные автоматически передаются в AmoCRM. Мы настраиваем входящие лиды, привязку к сделкам и автоматические сценарии, чтобы заявка сразу попала к менеджеру.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#4FD1C5]">Что подключаем</p>
                  <p className="mt-3 text-xl font-black">Приём лидов из формы</p>
                  <p className="mt-3 text-white/65">Вся информация клиента сразу поступает в AmoCRM, без ручного ввода и потерь.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-[#4FD1C5]">Как работает</p>
                  <p className="mt-3 text-xl font-black">Форма → AmoCRM → менеджер</p>
                  <p className="mt-3 text-white/65">Настраиваем вебхуки и интеграцию так, чтобы лиды появлялись в нужной воронке сразу после отправки.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">Отзывы</p>
              <h2 className="text-4xl font-black md:text-5xl">Что говорят клиенты</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.author} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-lg leading-8 text-white/70">“{item.text}”</p>
                  <div className="mt-6">
                    <p className="font-black">{item.author}</p>
                    <p className="text-sm text-white/50">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#4FD1C5]">Вопросы</p>
              <h2 className="text-4xl font-black md:text-5xl">Ответы на типичные вопросы</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.question} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-lg font-black">{item.question}</p>
                  <p className="mt-3 text-white/65">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <ShieldCheck className="mb-5 h-12 w-12 text-[#4FD1C5]" />
                <h2 className="text-4xl font-black md:text-5xl">IT BEAUTY — это когда система работает, а владелец спокоен</h2>
                <p className="mt-5 text-lg leading-8 text-white/65">
                  Подключаем CRM, workflow, коммуникации и автоматизацию в единую устойчивую систему для beauty-бизнеса.
                </p>
                <div className="mt-8 space-y-3 text-white/70">
                  <p>✓ Интеграция YCLIENTS + WaHelp</p>
                  <p>✓ Автотриггеры для возврата клиентов</p>
                  <p>✓ Передача заявок в AmoCRM</p>
                  <p>✓ Аналитика, контроль и прозрачность</p>
                </div>
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white/70">
                  <p className="font-semibold text-white">Контакты</p>
                  <p className="mt-3">Телефон: <a href="tel:+74952103040" className="text-white/80 hover:text-white">{companyInfo.phone}</a></p>
                  <p className="mt-2">E-mail: <a href="mailto:hello@itbeauty.ru" className="text-white/80 hover:text-white">{companyInfo.email}</a></p>
                  <p className="mt-2">Юр. адрес: {companyInfo.address}</p>
                  <p className="mt-2">{companyInfo.legal}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-[#0B1020]/80 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">Имя</label>
                  <input
                    name="name"
                    value={formValues.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#4FD1C5]"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">Телефон или e-mail</label>
                  <input
                    name="contact"
                    value={formValues.contact}
                    onChange={(event) => handleChange("contact", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#4FD1C5]"
                    placeholder="Например +7 900 000 00 00 или email@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/80">Комментарий</label>
                  <textarea
                    name="comment"
                    value={formValues.comment}
                    onChange={(event) => handleChange("comment", event.target.value)}
                    className="h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#4FD1C5]"
                    placeholder="Опишите задачу или цель"
                  />
                </div>
                <p className="text-sm text-white/50">Заявка может быть автоматически передана в AmoCRM для быстрого реагирования.</p>
                {statusMessage && (
                  <p className={`text-sm ${statusType === "error" ? "text-rose-400" : statusType === "success" ? "text-emerald-300" : "text-sky-300"}`}>
                    {statusMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#8B5CF6] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Отправка..." : "Оставить заявку"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <div>
            <p>© 2026 IT BEAUTY · workflow · crm · automation</p>
            <p>{companyInfo.legal}</p>
          </div>
          <div>
            <p>{companyInfo.address}</p>
            <p>Телефон: {companyInfo.phone} · E-mail: {companyInfo.email}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
