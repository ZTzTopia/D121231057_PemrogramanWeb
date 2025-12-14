# SaaS Subscription Management API Documentation

Base path: `/api`

Catatan singkat:

- Autentikasi menggunakan Bearer token (middleware `auth.middleware`).
- Validasi payload menggunakan middleware `validate.middleware` dan schema di folder `validators`.
- Error handling dan format respons dikelola oleh middleware error.

## Auth

- POST `/api/auth/register` — Daftar user baru
  - Body: `registerSchema` (lihat `validators/auth.validator.js`)
  - Password rules: minimum length is 8, must include at least one lowercase, one uppercase, one digit, and one special character
  - Response: 201 created atau error validasi

- POST `/api/auth/login` — Login dan dapatkan token
  - Body: `loginSchema`
  - Response: 200 { accessToken, refreshToken }

- POST `/api/auth/refresh` — Refresh token
  - Body: `refreshTokenSchema`
  - Response: 200 { accessToken }

- GET `/api/auth/me` — Dapatkan info user saat ini
  - Auth: required
  - Response: 200 { user }

## Product

Semua endpoint product membutuhkan autentikasi.

- GET `/api/product/` — Ambil semua product
  - Response: 200 [ products ]

- GET `/api/product/:id` — Ambil satu product
  - Response: 200 { product }

- POST `/api/product/` — Buat product baru
  - Body: `createSchema` (`validators/product.validator.js`)
  - Response: 201 { product }

- PUT `/api/product/:id` — Update product
  - Body: `updateSchema`
  - Response: 200 { product }

- DELETE `/api/product/:id` — Hapus product
  - Response: 204 No Content

## Subscription Plan

Semua endpoint subscription plan membutuhkan autentikasi.

- GET `/api/subscription-plan/` — Ambil semua subscription plan
- GET `/api/subscription-plan/:id` — Ambil satu plan
- POST `/api/subscription-plan/` — Buat plan baru (body: `createSchema`)
- PUT `/api/subscription-plan/:id` — Update plan (body: `updateSchema`)
- DELETE `/api/subscription-plan/:id` — Hapus plan

Responses umumnya: 200 (OK), 201 (Created), 204 (No Content), atau error sesuai middleware error.

## Subscription

Semua endpoint subscription membutuhkan autentikasi.

- GET `/api/subscription/` — Ambil semua subscription
- GET `/api/subscription/:id` — Ambil satu subscription
- POST `/api/subscription/` — Buat subscription (body: `createSchema`)
- PUT `/api/subscription/:id` — Update subscription (body: `updateSchema`)
- DELETE `/api/subscription/:id` — Hapus subscription

Responses umumnya: 200 (OK), 201 (Created), 204 (No Content), atau error sesuai middleware error.

## Health

- GET `/api/health` — Health check (no auth)
  - Response: 200 { status: 'ok', uptime, timestamp, pid, env }
