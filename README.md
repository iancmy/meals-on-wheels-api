# Meals on Wheels API

A professional-grade RESTful API built with Node.js, Express, and MongoDB to
streamline the operations of a "Meals on Wheels" service. This platform connects
members, caregivers, volunteers, and partners to ensure efficient meal delivery
and donor management.

## 🚀 Features

- **Multi-Role Authentication**: Secure JWT-based auth (Access & Refresh tokens)
  for five distinct roles: Admin, Member, Caregiver, Volunteer, and Partner.
- **Administrative Dashboard**: Full CRUD for user management, role-based
  permissions (Super, Admin, Logistics), and account validation.
- **Smart Scheduling & Logistics**: Manage weekly meal schedules and track
  deliveries with real-time status updates (Pending, Preparing, Completed,
  etc.).
- **Location Services**: Integrated geocoding via OpenCage API to calculate
  distances between partners and beneficiaries, ensuring efficient routing.
- **Secure Donations**: Public endpoint for donations with tracking for
  frequency, amount, and payment methods.
- **Comprehensive Reporting**: Dedicated analytics for donation totals,
  volunteer retention rates, and beneficiary demographics.

## Tech Stack

| Category         | Technology                                    |
| :--------------- | :-------------------------------------------- |
| **Backend**      | Node.js, Express.js                           |
| **Database**     | MongoDB, Mongoose (ODM)                       |
| **Security**     | JWT (jsonwebtoken), Bcrypt (password hashing) |
| **Integrations** | OpenCage API (Geocoding)                      |
| **Middleware**   | Cookie-Parser, CORS, Dotenv                   |

## 📋 Prerequisites

- **Node.js**: v18.x or higher (Recommended)
- **MongoDB**: A running MongoDB instance (Local or Atlas)
- **OpenCage API Key**: Required for location-based features

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/iancmy/meals-on-wheels-api.git](https://github.com/iancmy/meals-on-wheels-api.git)
   cd meals-on-wheels-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**: Create a `.env` file in the root directory and
   add the following variables:
   ```env
   PORT=3000
   DB_USER=your_mongodb_user
   DB_PWD=your_mongodb_password
   ACCESS_TOKEN_SECRET=your_long_random_string_access
   REFRESH_TOKEN_SECRET=your_long_random_string_refresh
   LOCATION_API_KEY=your_opencage_api_key
   ```

4. **Run the application**:
   ```bash
   # Development mode
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

## 🔑 Environment Variables Reference

| Variable               | Description                                            |
| :--------------------- | :----------------------------------------------------- |
| `DB_USER`              | Username for MongoDB Atlas/Local authentication.       |
| `DB_PWD`               | Password for MongoDB Atlas/Local authentication.       |
| `ACCESS_TOKEN_SECRET`  | Secret key for signing JWT access tokens (15m expiry). |
| `REFRESH_TOKEN_SECRET` | Secret key for signing JWT refresh tokens.             |
| `LOCATION_API_KEY`     | API Key for OpenCage geocoding services.               |

## 📁 API Documentation

- **Auth**: `POST /api/user/login`, `POST /api/user/refresh`
- **Members**: `POST /api/member/signup`, `PUT /api/member/update`
- **Admin**: `GET /api/admin/users`, `POST /api/admin/schedule`
- **Public**: `GET /api/public/nearby` (Locate partners within 10km)
