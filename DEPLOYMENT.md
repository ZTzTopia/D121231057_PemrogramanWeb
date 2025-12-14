# Deployment Guide

Dokumen ini menjelaskan **langkah lengkap deployment REST API ke AWS EC2** menggunakan Ubuntu Server 22.04, Node.js, Prisma, dan PM2.

## Informasi Umum

* **Repository GitHub**: <https://github.com/ZTzTopia/D121231057_PemrogramanWeb/tree/saas-subscription-management-api>
* **Production Base URL**: <http://98.92.248.39:3000/api>
* **Health Check URL**: `http://98.92.248.39:3000/api/health`

## Detail AWS EC2

* **Platform**: AWS Academy Learner Lab
* **Instance Type**: t3.micro
* **OS**: Ubuntu Server 24.04 LTS
* **Instance ID**: i-0aa12326d93bcedea
* **Region**: us-east-1f
* **Public IPv4 Address**: 98.92.248.39
* **Public DNS**: ip-172-31-73-243.ec2.internal

## Security Group Configuration

Inbound Rules:

* SSH (22) – My IP / 0.0.0.0/0
* HTTP (80) – 0.0.0.0/0
* Custom TCP (3000) – 0.0.0.0/0

Outbound Rules:

* Allow all traffic

## SSH Connection

### Set Permission Key

```bash
chmod 400 your-key.pem
```

### Connect to Server

```bash
ssh -i your-key.pem ubuntu@PUBLIC_IP
```

## Server Setup

### Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

### Install Node.js 18+

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.12.0".

# Verify npm version:
npm -v # Should print "11.6.2".
```

### Install PM2

```bash
sudo npm install -g pm2
```

## Clone Repository

```bash
git clone https://github.com/ZTzTopia/D121231057_PemrogramanWeb -b saas-subscription-management-api
cd D121231057_PemrogramanWeb
npm install
```

## Environment Configuration

Buat file `.env` di root project:

```bash
cp .env.example .env
nano .env
```

Isi variabel berikut:

```text
DATABASE_URL="prisma+postgres://localhost:51213/?api_key="

NODE_ENV=development

PORT=3000

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_this_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

> ⚠️ Pastikan secret production **berbeda** dari development.

## Database Setup

### Generate Prisma Client

```bash
npm x prisma generate
```

### Run Migration

```bash
npm x prisma migrate deploy
```

### Run Seeder (Opsional)

```bash
node prisma/seed.js
```

## Testing Manual

Jalankan aplikasi secara manual:

```bash
npm run start
```

Test endpoint:

* `GET /health`
* Authentication (register/login)
* CRUD resource

Hentikan aplikasi:

```bash
Ctrl + C
```

## Menjalankan Aplikasi dengan PM2

```bash
pm2 start src/index.js --name saas-subscription-management-api
pm2 save
pm2 startup
```

Cek status:

```bash
pm2 status
pm2 logs saas-subscription-management-api
```

## Maintenance & Update

### Update Aplikasi

```bash
git pull origin saas-subscription-management-api
npm install
npx prisma migrate deploy
pm2 restart saas-subscription-management-api
```

## Monitoring

* Status aplikasi: `pm2 status`
* Logs aplikasi: `pm2 logs saas-subscription-management-api`
* Monitor aplikasi: `pm2 monit`
* Resource server: `htop`, `free -h`, `df -h`

## Troubleshooting

### Port Tidak Bisa Diakses

* Periksa security group
* Pastikan aplikasi running
* Pastikan port sesuai `.env`

### Prisma Error

* Pastikan migration sudah dijalankan
* Pastikan `DATABASE_URL` benar

### App Crash

* Cek `pm2 logs`
* Pastikan environment variables lengkap

### Backup Strategy

#### Database Backup

* Jenis database: PostgreSQL
* Metode backup: Logical backup menggunakan `pg_dump`
* Jadwal backup: Manual / Mingguan
* Lokasi backup: Direktori terpisah atau cloud storage (S3 / local secure storage)

Command:

```bash
pg_dump -U <DB_USER> -h <DB_HOST> -p <DB_PORT> <DB_NAME> > backup/db-$(date +%F).sql
```

#### Environment Backup

* File yang dibackup: .env
* Lokasi penyimpanan: Lokal aman (tidak di repository)
* Akses terbatas hanya untuk administrator

### Restore Procedure

1. Restore database dari file backup:

    ```bash
    psql -U <DB_USER> -h <DB_HOST> -p <DB_PORT> <DB_NAME> < backup/db-YYYY-MM-DD.sql
    ```

2. Restore file `.env` ke direktori project.
3. Restart aplikasi dengan PM2:

    ```bash
    pm2 restart saas-subscription-management-api
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

## Verification Checklist

* Health check endpoint return 200 OK
* API dapat diakses publik
* Authentication & authorization berjalan
* Database terhubung
* PM2 auto-restart aktif
