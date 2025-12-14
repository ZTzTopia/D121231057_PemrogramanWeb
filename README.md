# SaaS Subscription Management API

Project ini merupakan **REST API backend siap produksi** yang dibangun sebagai tugas akhir mata kuliah **Pemrograman Web**. Aplikasi menerapkan arsitektur **MVC**, autentikasi & otorisasi berbasis **JWT**, integrasi database menggunakan **Prisma ORM**, serta di-deploy ke **AWS EC2**.

Tema aplikasi:

> **SaaS Subscription Management API**

## Tech Stack

* **Runtime**: Node.js v18+
* **Framework**: Express.js
* **Database**: PostgreSQL (development & production)
* **ORM**: Prisma
* **Authentication**: JWT (Access & Refresh Token)
* **Password Hashing**: bcrypt
* **Validation**:  Zod
* **Process Manager**: PM2
* **Deployment**: AWS EC2 (Ubuntu 24.04)

## Struktur Folder

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── validators/
│   └── utils/
├── .env.example
├── package.json
├── README.md
├── API-DOCS.md
└── DEPLOYMENT.md
```

## Authentication & Authorization

* JWT Access Token (short-lived)
* JWT Refresh Token (long-lived)
* Role-based access control (RBAC)
  * USER
  * ADMIN
* Ownership validation pada update/delete resource

## Base URL (Production)

```text
http://44.200.117.194:3000/
```

## Test Credentials

### Admin Account

```text
Email    : admin@example.com
Password : AdminPass123!
Role     : ADMIN
```

### Regular User Account

```text
Email    : user0@example.com
Password : UserPass123!
Role     : USER
```

## Environment Variables

Template tersedia pada `.env.example`.

```text
DATABASE_URL="prisma+postgres://localhost:51213/?api_key="

NODE_ENV=development

PORT=3000

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_this_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

## Menjalankan Project (Development)

```bash
npm install
npm x prisma migrate dev
npm x prisma db seed
node src/index.js
```

## Dokumentasi Tambahan

* [API Documentation](API-DOCS.md)
* [Deployment Guide](DEPLOYMENT.md)
