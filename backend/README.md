# Fretron Backend (MySQL + Express)

## What this backend includes
- MySQL-based authentication backend
- Clean structure for future expansion
- Cookie-based JWT auth
- Minimal, flexible `users` table
- Ready endpoints for signup, login, current user, and logout

## Project structure
```\nfretron-backend/\n  init.sql\n  .env.example\n  package.json\n  src/\n    app.js\n    server.js\n    config/\n    controllers/\n    middleware/\n    routes/\n    services/\n    utils/\n```

## 1) Create database and table
Open MySQL Workbench and run:
```sql
SOURCE path/to/init.sql;
```
Or copy-paste the contents of `init.sql`.

## 2) Install dependencies
```bash
npm install
```

## 3) Configure environment
Create `.env` from `.env.example` and fill in your database password.

## 4) Start the backend
```bash
npm run dev
```

## API endpoints
### POST /api/auth/signup
Body:
```json
{
  "fullName": "Zaman Khan",
  "businessName": "ZK Traders",
  "email": "zaman@example.com",
  "phone": "03001234567",
  "password": "secret123"
}
```

### POST /api/auth/login
Body:
```json
{
  "email": "zaman@example.com",
  "password": "secret123"
}
```

### GET /api/auth/me
Reads the logged-in user from the auth cookie.

### POST /api/auth/logout
Clears the session cookie.

## Why this is flexible
- `role` is already present for future transporter/admin expansion
- `business_name` is optional and does not force business users too early
- auth logic is separated into route/controller/service layers
- easy to add `transporters`, `shipments`, `route_posts`, and `bookings` later without rewriting auth
