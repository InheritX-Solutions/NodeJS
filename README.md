# Node.js Backend API — Production Ready

A production-ready Node.js backend built with Express.js and MongoDB using a scalable feature-based architecture.

**Version:** 2.0.0 | **Author:** Bansi | **Last Updated:** 2026-05-06

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Module Architecture](#module-architecture)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Configuration Reference](#configuration-reference)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Authentication & Authorization** — JWT access + refresh tokens, bcrypt password hashing, RBAC (admin/user/moderator), login attempt tracking, account locking, multi-device session management
- **User Management** — Registration, profile management, preferences (language, timezone, notifications), document upload, search & filtering
- **Email Management** — Template system with SendGrid integration, variable substitution, dynamic sending
- **CMS** — Full page CRUD, SEO meta tags, publishing workflow (draft → published → archived), slug generation, view tracking, category/tag support
- **Advanced** — Cron jobs, AWS S3 file uploads, global error handling, request validation, Morgan logging, Helmet security headers, Gzip compression, CORS, i18n (English + Hindi)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js (Latest LTS) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcryptjs |
| Email | SendGrid |
| File Storage | AWS S3 + Multer |
| Validation | express-validator |
| Logging | Morgan + Custom Logger |
| Security | Helmet |
| Scheduled Tasks | node-cron |
| DateTime | dayjs |
| Development | Nodemon |

---

## Prerequisites

- Node.js v14+
- MongoDB (local or Atlas cloud)
- npm or yarn

```bash
node --version  # Should be v14+
npm --version   # Should be v6+
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` — minimum required fields:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/nodejs-backend
# Cloud: mongodb+srv://username:password@cluster.mongodb.net/database

# JWT — generate strong random strings!
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# AWS S3 (optional — for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# SendGrid (optional — for email service)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Application
APP_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
MAX_FILE_SIZE=10485760
LOG_LEVEL=info
```

Generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Start the Server

```bash
npm run dev     # Development (auto-reload)
npm start       # Production
```

Server runs at `http://localhost:3000`

---

## Project Structure

```
NodeJS/
├── package.json
├── .env.example
│
├── src/
│   ├── config/
│   │   ├── env.js               # Environment variables loader
│   │   ├── db.js                # MongoDB connection
│   │   └── constants.js         # Application constants
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification & RBAC
│   │   ├── error.middleware.js  # Global error handler
│   │   ├── validate.middleware.js
│   │   └── upload.middleware.js # Multer config
│   │
│   ├── services/
│   │   ├── email.service.js     # SendGrid integration
│   │   ├── log.service.js       # Logging service
│   │   └── storage.service.js   # AWS S3 storage
│   │
│   ├── utils/
│   │   ├── response.js          # API response formatter
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   ├── date.js              # Date/time utilities
│   │   └── validators.js        # Input validators
│   │
│   ├── locales/
│   │   ├── en/                  # English messages
│   │   └── hn/                  # Hindi messages
│   │
│   ├── modules/
│   │   ├── auth/                # auth.{model,controller,service,repository,validation,route}.js
│   │   ├── user/                # user.{model,controller,service,repository,validation,route}.js
│   │   ├── email/               # email.{model,controller,service,repository,validation,route}.js
│   │   └── cms/                 # cms.{model,controller,service,repository,validation,route}.js
│   │
│   ├── routes/
│   │   └── index.js             # Main v1 API router
│   │
│   ├── jobs/
│   │   └── demo.job.js          # Cron jobs
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── uploads/                     # Local file uploads
└── logs/
    ├── info.log
    ├── error.log
    └── warn.log
```

---

## Module Architecture

Each module follows a strict layered pattern:

```
Request → Route → Validation Middleware → Auth Middleware
       → Controller → Service → Repository → Mongoose Model → MongoDB
       → Response Formatter → Client
```

**Naming conventions:**
- Files: `{entity}.{layer}.js` (e.g., `user.service.js`)
- Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_methodName()`

### Auth Module
Handles user authentication, JWT tokens, and password management. Key methods: `comparePassword()`, `isLocked()`, `getProfile()`.

### User Module
Extended user profiles, preferences (language, timezone, notification channels), document management, admin operations.

### Email Module
Template CRUD, SendGrid delivery, dynamic variable substitution into HTML templates.

### CMS Module
Full publishing lifecycle, SEO metadata, slug auto-generation, view tracking, full-text search.

---

## API Endpoints

### Authentication — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login & receive tokens | Public |
| POST | `/refresh-token` | Get new access token | Public |
| GET | `/profile` | Get current user profile | Bearer |
| PUT | `/profile` | Update profile | Bearer |
| POST | `/change-password` | Change password | Bearer |
| POST | `/logout` | Logout current device | Bearer |
| POST | `/logout-all` | Logout all devices | Bearer |

### Users — `/api/v1/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all users (paginated) | Admin/Mod |
| GET | `/:id` | Get user by ID | Bearer |
| GET | `/:id/profile` | Get full user profile | Bearer |
| PUT | `/:id` | Update user | Bearer |
| PUT | `/:id/preferences` | Update preferences | Bearer |
| DELETE | `/:id` | Delete user | Admin |
| GET | `/search?q=` | Search users | Bearer |

### Email — `/api/v1/email`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/send` | Send email via template | Bearer |
| GET | `/templates` | List all templates | Admin |
| POST | `/templates` | Create template | Admin |
| GET | `/templates/:id` | Get template | Admin |
| PUT | `/templates/:id` | Update template | Admin |
| DELETE | `/templates/:id` | Delete template | Admin |

### CMS — `/api/v1/cms`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/page/:slug` | Get published page | Public |
| GET | `/search?q=` | Search pages | Public |
| GET | `/` | List all pages | Admin |
| POST | `/` | Create page | Admin |
| GET | `/:id` | Get page by ID | Admin |
| PUT | `/:id` | Update page | Admin |
| POST | `/:id/publish` | Publish page | Admin |
| DELETE | `/:id` | Delete page | Admin |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server health status |

---

## API Documentation

All protected endpoints require:
```
Authorization: Bearer <accessToken>
```

### Register User

**POST** `/api/v1/auth/register`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

// Response 201
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "_id": "60d5ec4f9f1b5c001f8e4e1a",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "pending",
    "isEmailVerified": false,
    "createdAt": "2024-05-06T12:00:00.000Z"
  }
}
```

**Password rules:** min 8 chars, uppercase, lowercase, number, special character.

---

### Login

**POST** `/api/v1/auth/login`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "email": "...", "firstName": "John", "role": "user", "status": "active" },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": "1h"
  }
}
```

---

### Refresh Token

**POST** `/api/v1/auth/refresh-token`

```json
// Request
{ "refreshToken": "eyJhbGci..." }

// Response 200
{
  "statusCode": 200,
  "success": true,
  "data": { "accessToken": "...", "refreshToken": "...", "expiresIn": "1h" }
}
```

---

### Get / Update Profile

**GET/PUT** `/api/v1/auth/profile`

```json
// PUT Request body
{ "firstName": "Jane", "lastName": "Smith", "phone": "+9876543210" }

// GET Response 200
{
  "data": {
    "_id": "...", "email": "...", "firstName": "John", "lastName": "Doe",
    "role": "user", "status": "active", "isEmailVerified": true,
    "lastLogin": "2024-05-06T12:00:00.000Z"
  }
}
```

---

### Change Password

**POST** `/api/v1/auth/change-password`

```json
// Request
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
// Response: { "message": "Password changed successfully. Please login again." }
```

---

### Update User Preferences

**PUT** `/api/v1/users/:id/preferences`

```json
// Request
{
  "preferences": {
    "language": "en",
    "timezone": "America/New_York",
    "notifications": { "email": true, "push": false, "sms": false }
  }
}
```

---

### Send Email

**POST** `/api/v1/email/send`

```json
// Request
{
  "to": "recipient@example.com",
  "templateName": "welcome",
  "variables": { "firstName": "John", "verificationLink": "https://example.com/verify/123" }
}
```

---

### Create Email Template

**POST** `/api/v1/email/templates`

```json
// Request
{
  "name": "welcome",
  "subject": "Welcome to {{appName}}",
  "template": "<html><body>Hello {{firstName}}</body></html>",
  "description": "Welcome email for new users",
  "variables": ["firstName", "appName"]
}
```

---

### Get Public CMS Page

**GET** `/api/v1/cms/page/:slug` — No auth required

```json
// Response 200
{
  "data": {
    "title": "About Us", "slug": "about-us", "content": "<html>...",
    "metaTitle": "About Our Company", "metaDescription": "...",
    "views": 1250, "publishedAt": "2024-05-06T12:00:00.000Z"
  }
}
```

---

### Create / Publish CMS Page

**POST** `/api/v1/cms` — Create (admin)

```json
// Request
{
  "title": "About Us",
  "content": "<html>...",
  "metaTitle": "About Our Company",
  "metaDescription": "...",
  "metaKeywords": ["about", "company"],
  "category": "Pages",
  "tags": ["about", "company"],
  "image": "https://example.com/image.jpg"
}
// New pages start with status: "draft", isPublished: false
```

**POST** `/api/v1/cms/:id/publish` — Publish (admin)

```json
// Response
{ "data": { "status": "published", "isPublished": true, "publishedAt": "..." } }
```

---

## Authentication

**Token flow:**

```
Register/Login → accessToken + refreshToken
                       ↓
     Authorization: Bearer <accessToken>  (all protected routes)
                       ↓
         accessToken expires (1h) → POST /auth/refresh-token
                       ↓
              New accessToken + refreshToken
```

---

## Error Handling

All errors return a consistent structure:

```json
// 400 Validation Error
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}

// 401 Unauthorized
{ "statusCode": 401, "success": false, "message": "Invalid or expired token", "timestamp": "..." }

// 403 Forbidden
{ "statusCode": 403, "success": false, "message": "Access forbidden", "timestamp": "..." }

// 404 Not Found
{ "statusCode": 404, "success": false, "message": "User not found", "timestamp": "..." }

// 500 Server Error
{ "statusCode": 500, "success": false, "message": "Internal server error", "timestamp": "..." }
```

**Standard success response format:**
```json
{ "statusCode": 200, "success": true, "message": "...", "data": {}, "timestamp": "..." }
```

**Paginated response includes:**
```json
{ "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 } }
```

---

## Configuration Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `MONGO_URI` | Database connection | `mongodb://...` |
| `JWT_SECRET` | Access token signing key | 32+ char random hex |
| `JWT_REFRESH_SECRET` | Refresh token signing key | 32+ char random hex |
| `JWT_EXPIRE` | Access token TTL | `1h` |
| `JWT_REFRESH_EXPIRE` | Refresh token TTL | `7d` |
| `AWS_ACCESS_KEY_ID` | AWS credentials | Optional |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials | Optional |
| `AWS_REGION` | S3 region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | Optional |
| `SENDGRID_API_KEY` | Email service key | Optional |
| `EMAIL_FROM` | Sender address | `noreply@yourdomain.com` |
| `APP_BASE_URL` | Backend URL | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3001` |
| `MAX_FILE_SIZE` | Upload size limit in bytes | `10485760` (10MB) |
| `LOG_LEVEL` | Log verbosity | `info` / `debug` / `error` |

---

## Logging

Logs are written to:
- Console (development mode)
- `logs/info.log` — informational messages
- `logs/error.log` — errors
- `logs/warn.log` — warnings

```bash
tail -f logs/info.log
tail -f logs/error.log
```

Enable verbose logging: `LOG_LEVEL=debug`

---

## Useful Commands

```bash
npm run dev         # Development with auto-reload
npm start           # Production mode
npm run lint        # Lint code
npm run format      # Format with Prettier
npm test            # Run tests
npm audit           # Security audit

# View logs
tail -f logs/info.log
tail -f logs/error.log

# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Reset dependencies
rm -rf node_modules package-lock.json && npm install
```

---

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Replace all `.env` secrets with production values
- [ ] Use strong random JWT secrets (`openssl rand -hex 32`)
- [ ] Use MongoDB Atlas for managed database
- [ ] Configure SendGrid for email
- [ ] Configure AWS S3 for file storage
- [ ] Enable HTTPS
- [ ] Add rate limiting middleware
- [ ] Configure CORS for your frontend domain
- [ ] Whitelist server IP in MongoDB Atlas
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Monitor `logs/` for suspicious activity

### Production File Structure
```
NodeJS/
├── src/          # Production code
├── package.json
├── .env          # Production env vars (never commit)
├── logs/
└── uploads/      # If using local storage
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `EADDRINUSE` | Change PORT or run `lsof -ti:3000 \| xargs kill -9` |
| `MongoDB connection failed` | Check MongoDB is running; verify `MONGO_URI` |
| `Validation error` | Check request body matches documented format |
| `Invalid or expired token` | Use refresh token endpoint or log in again |
| `File upload failed` | Check file type (JPEG/PNG/GIF/PDF) and `MAX_FILE_SIZE` |
| `Email not sent` | Verify `SENDGRID_API_KEY` and `EMAIL_FROM` in `.env` |
| `Cannot find module` | Run `npm install` |
| Atlas IP error | Whitelist server IP in MongoDB Atlas network settings |

---

## Resources

- [Express.js](https://expressjs.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [SendGrid](https://sendgrid.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## License

ISC