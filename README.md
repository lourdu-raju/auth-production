# Auth Project

Simple JWT authentication — **Express API** (for Postman testing + Docker) with a **React** frontend.

```
auth-project/
├── server.js                # Express JWT auth API
├── Dockerfile               # API image
├── docker-compose.yml       # API + frontend
├── postman_collection.json  # Import into Postman
└── frontend/                # React (Vite) app
```

## API endpoints

| Method | Path                 | Auth   | Body                  |
|--------|----------------------|--------|-----------------------|
| GET    | `/health`            | –      | –                     |
| POST   | `/api/auth/register` | –      | `{ email, password }` |
| POST   | `/api/auth/login`    | –      | `{ email, password }` |
| GET    | `/api/me`            | Bearer | –                     |

> Users are stored in memory and reset on restart. Swap for a real DB in production.

## Run with Docker (both services)

```bash
docker compose up --build
```

- Frontend → http://localhost:8080
- API      → http://localhost:3000

## Run locally (no Docker)

```bash
# Terminal 1 — API
npm install
npm start                 # http://localhost:3000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev               # http://localhost:5173 (proxies /api to :3000)
```

## Postman testing

1. Import `postman_collection.json`.
2. Run **Register** (or **Login**) — the token is captured into the `token` variable automatically.
3. Run **Me (protected)** — it sends `Authorization: Bearer {{token}}`.

Manual curl equivalent:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'

curl http://localhost:3000/api/me -H "Authorization: Bearer <TOKEN>"
```
