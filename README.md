# FitActive Presales — Starter (Frontend + Backend)

- Frontend: React + Vite + Tailwind
- Backend: Express + SQLite + Nodemailer
- Flux: NETOPIA (sandbox) → Factură SmartBill după confirmare → Email cu PDF

## Frontend
```
cd frontend
npm i
npm run dev
```
http://localhost:5173

## Backend
```
cd server
cp .env.example .env   # completează cheile tale
npm i
node server.js
```

### IPN (NETOPIA) în local
```
ngrok http 3001
```
Setează `NETOPIA_NOTIFY_URL` în `.env` cu URL-ul ngrok.

### Deploy
- Frontend: Vercel/Netlify
- Backend: Render/Fly/Railway (setează variabilele .env)
