# IT BEAUTY Landing

Лендинг на React + Vite + Tailwind с серверной интеграцией в amoCRM.

## Что реализовано

- Одностраничный лендинг с блоками: hero, услуги, процесс, результат, AmoCRM, отзывы, FAQ, контакты
- Форма обратной связи с валидацией
- Backend endpoint `api/amo.js` для передачи заявки в amoCRM
- Создание контакта и сделки в amoCRM
- Добавление тега `Сайт IT BEAUTY`
- Конфигурация для деплоя на Vercel
- Без прямых amoCRM-токенов во frontend

## Установка

```bash
npm install
```

## Запуск в разработке

```bash
npm run dev
```

Открой `http://localhost:5173`.

## Сборка

```bash
npm run build
```

## Переменные окружения

Скопируйте файл `.env.example` в `.env` и заполните реальные значения:

- `VITE_API_URL` — endpoint для frontend (по умолчанию `/api/amo`)
- `VITE_FORM_SOURCE` — источник заявки (по умолчанию `landing_it_beauty`)
- `AMO_DOMAIN` — домен аккаунта amoCRM, например `your-account.amocrm.ru`
- `AMO_CLIENT_ID` — client_id для OAuth
- `AMO_CLIENT_SECRET` — client_secret для OAuth
- `AMO_REFRESH_TOKEN` — refresh token для amoCRM
- `AMO_PIPELINE_ID` — ID воронки для создания сделки
- `AMO_TAG` — тег для контакта и сделки

## Деплой на Vercel

1. Зарегистрируйте проект на Vercel.
2. В разделе "Environment Variables" задайте те же переменные, что в `.env`.
3. Убедитесь, что `Build Command` задан как `npm run build`, а `Output Directory` — `dist`.
4. Добавьте `vercel.json` в корень репозитория.

### Важное

- Токены amoCRM должны храниться только на backend / в Vercel secrets.
- В frontend передается только URL endpoint и источник заявки.

## Как работает backend

1. Форма отправляет POST на `api/amo`.
2. Backend получает access token через OAuth refresh token.
3. Пытается найти существующий контакт.
4. Если контакт не найден — создает новый.
5. Создает сделку в указанной воронке.
6. Добавляет тег и примечание с данными заявки.

## GitHub

Проект уже загружен в `https://github.com/Editas/IT-beauty-.git`.
