Task Management Backend (NestJS)

Real-Time Collaborative Task Management System using NestJS, TypeORM (PostgreSQL), Mongoose (MongoDB), and WebSockets.

Features
- JWT auth with access + refresh tokens in HTTP-only cookies
- Role-based access control (Admin, User)
- REST APIs for users and tasks
- Real-time task updates via Socket.IO gateway
- Event logging to MongoDB for every emitted task event

Tech
- NestJS 10, TypeORM 0.3, PostgreSQL, Mongoose 8 (MongoDB), Socket.IO

Getting Started
1. Copy env
```bash
cp .env.example .env
```

2. Start databases (adjust if needed)
- Postgres: `postgresql://postgres:postgres@localhost:5432/tasks_db`
- MongoDB: `mongodb://localhost:27017/tasks_events`

3. Install deps
```bash
npm install
```

4. Run dev
```bash
npm run start:dev
```

The server listens on `http://localhost:4000`.

CORS & Cookies
- Set `CORS_ORIGIN` to your frontend origins (comma-separated). Cookies require `credentials: true` and `withCredentials` on the client.
- Cookies are `httpOnly`. In production, `secure` is enabled and `sameSite` defaults to `none`.

Auth Endpoints
- POST `/auth/register` { name, email, password }
- POST `/auth/login` { email, password } → sets cookies
- POST `/auth/logout` → clears cookies
- POST `/auth/refresh` → uses refresh cookie

Users
- GET `/users/me`
- PUT `/users/:id` (Admin only)

Tasks
- POST `/tasks`
- GET `/tasks`
- GET `/tasks/:id`
- PUT `/tasks/:id`
- DELETE `/tasks/:id` (Admin only)
- PUT `/tasks/:id/assign` (Admin only) { userId }

WebSocket
- Connect to Socket.IO at the same host. Events:
  - `task.created`, `task.updated`, `task.assigned`

Notes
- TypeORM `synchronize` is on for local dev. Disable in production and use migrations.
- JWT cookie names can be configured via `ACCESS_TOKEN_COOKIE` and `REFRESH_TOKEN_COOKIE`.

Example .env
```
PORT=4000
CORS_ORIGIN=http://localhost:3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tasks_db

MONGODB_URI=mongodb://localhost:27017/tasks_events

JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
JWT_REFRESH_EXPIRES=7d

COOKIE_DOMAIN=localhost
NODE_ENV=development
```

