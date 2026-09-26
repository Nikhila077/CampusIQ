# StudentLens — Personalized Student Decision-Support Platform

[![Full Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/Nikhila077/CampusIQ)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/Nikhila077/CampusIQ)

> **Core Principle:** `Student Data → Analysis → Insight → Recommended Action`

**StudentLens** (formerly CampusIQ) is a modern, full-stack student platform designed as an actionable decision-support platform. Unlike traditional college ERPs that passively display tables of raw numbers, StudentLens actively analyzes student data and converts it into personalized recommendations and next steps.

---

## 🚀 Platform Capabilities & Modules

- **Smart Attendance Engine (Core Differentiator):**
  - **Safe Absence Buffer:** Automatically calculates the exact number of future classes a student can safely miss while remaining at or above institutional minimums (e.g. 75%).
  - **Recovery Calculator:** Computes the minimum consecutive attendances required to regain compliance if attendance drops below the threshold.
  - **What-If Simulator (`/attendance/simulate`):** Real-time scenario projection modeling the exact statistical impact of missing or attending next $N$ classes.
  - **Transparent Rule-Based Insights:** Clearly explains *why* a status or alert is triggered without obscure heuristics.

- **Personalized Academic Dashboard (`/dashboard`):**
  - Answers the core question: *"What should I pay attention to today?"*
  - Live summaries of daily classes, attendance shortages, pending assignments, upcoming exams, and career skill coverage.

- **Student Profile & Subject Management (`/profile`):**
  - Manage personal and academic identity (college, branch, year, semester, roll number).
  - Curriculum subjects with custom minimum attendance thresholds and planning priority preferences (High/Medium/Low).

- **Timetable & Daily Schedule (`/timetable`):**
  - Weekly schedule grid with room numbers and today's classes spotlight.

- **Assignments & Deliverables (`/assignments`):**
  - Track coursework deadlines, overdue alerts, and submission states.

- **Exams & Countdown (`/exams`):**
  - Midterms, finals, quizzes, and practicals with preparation countdown timers.

- **Academic Performance Analytics (`/performance`):**
  - Visual mark distributions and assessment progression curves powered by **Recharts**.

- **Smart Academic Planner (`/planner`):**
  - Synthesizes attendance buffers, exams, deadlines, and grades into a prioritized daily action plan with clear deterministic explanations.

- **Career Readiness & Opportunity Hub (`/career` & `/opportunities`):**
  - Target role benchmarking (Software Engineer, Data Analyst, etc.) with skill gap analysis.
  - Opportunity feed matching internships, scholarships, and hackathons with student skills.

- **Student Project Hub (`/projects`):**
  - Collaborative project showcases, technical stack requirements, and join requests.

- **Authentication & Security:**
  - Secure student registration, login, and logout.
  - High-security password hashing with **bcryptjs** (12 salt rounds).
  - Stateless JSON Web Token (**JWT**) stored securely in **HttpOnly, SameSite cookies** to prevent XSS attacks.
  - Strict tenant data isolation: all queries scoped to `req.user._id`.

---

## 📁 Repository Structure

```text
CampusIQ/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind CSS v4)
│   ├── public/                 # Static assets, favicon, and SPA routing rules (_redirects)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Button, Input, Card, Badge, Modal)
│   │   ├── context/            # React AuthContext and state management
│   │   ├── hooks/              # Custom hooks (useAuth)
│   │   ├── layouts/            # App layout and navigation bar
│   │   ├── pages/              # Landing, Login, Register, and Dashboard pages
│   │   ├── router/             # App routing and ProtectedRoute wrapper
│   │   ├── services/           # Axios instance with credentials configuration
│   │   └── utils/              # Helper utilities
│   ├── package.json
│   ├── vercel.json             # Vercel SPA routing configuration
│   └── vite.config.js
│
├── server/                     # Backend API Application (Node.js + Express.js)
│   ├── src/
│   │   ├── config/             # MongoDB connection & JWT cookie settings
│   │   ├── controllers/        # Auth controller logic (register, login, logout, me)
│   │   ├── middleware/         # JWT verification & global error handler
│   │   ├── models/             # Mongoose User schema & password hashing methods
│   │   ├── routes/             # Express API route declarations
│   │   ├── utils/              # Standardized API response helpers
│   │   ├── app.js              # Express application setup, CORS, and middleware
│   │   ├── seed.js             # Seed script to populate demo student in MongoDB
│   │   └── server.js           # Server entry point
│   ├── package.json
│   ├── .env.example            # Backend environment variable template
│   └── .gitignore
│
├── IMPLEMENTATION_PLAN.md      # Comprehensive approved architectural specification
├── README.md                   # Project documentation and deployment guide
└── .gitignore                  # Root Git ignore rules (protects all sensitive secrets)
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Lucide React |
| **Backend** | Node.js, Express.js (ES Modules), jsonwebtoken, bcryptjs, cookie-parser, cors |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | HttpOnly Cookies, SameSite protection, Reverse-Proxy Trust, Strict Schema Validation |
| **Tooling** | Oxlint, Git, npm |

---

## ⚙️ Environment Variables

### 1. Backend (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cd server
cp .env.example .env
```

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string (Atlas or Local) | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/campusiq?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing authentication tokens | `your_super_secret_jwt_key_here` |
| `JWT_EXPIRES_IN`| Token lifespan | `7d` |
| `CLIENT_ORIGIN` | Allowed client origin(s) for CORS (comma-separated if multiple) | `http://localhost:5173` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `COOKIE_SAME_SITE` | Cookie SameSite policy (`lax`, `strict`, or `none`) | `lax` (dev) / `none` (cross-domain prod) |

### 2. Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```bash
cd client
cp .env.example .env
```

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base endpoint for the Express backend API | `http://localhost:5000/api` |

> 🔒 **Security Notice:** `.env` files are ignored by `.gitignore` and must never be committed to source control.

---

## 🚦 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance

### 1. Clone Repository
```bash
git clone https://github.com/Nikhila077/CampusIQ.git
cd CampusIQ
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file with MONGO_URI and JWT_SECRET
npm run seed     # Optional: Seed sample student account (student@campusiq.edu / password123)
npm run dev      # Starts server on http://localhost:5000 with nodemon
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev      # Starts Vite client on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 📡 API Reference

All API routes are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Health check endpoint | No |
| `POST` | `/api/auth/register` | Register a new student account and issue JWT cookie | No |
| `POST` | `/api/auth/login` | Authenticate credentials and issue JWT cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile from HttpOnly JWT | Yes |
| `POST` | `/api/auth/logout` | Clear authentication cookie | Yes |

---

## 🌐 Production Deployment Guide

### Option A: Frontend on Vercel
1. Set the Root Directory in Vercel to `client`.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-backend-domain>/api`
5. The included [`client/vercel.json`](file:///client/vercel.json) automatically handles SPA route rewrites.

### Option B: Frontend on Netlify
1. Base directory: `client`.
2. Build command: `npm run build`.
3. Publish directory: `client/dist`.
4. The included [`client/public/_redirects`](file:///client/public/_redirects) automatically resolves SPA client-side routing.

### Option C: Backend on Render or Railway
1. Set the Root Directory to `server`.
2. Build Command: `npm install`.
3. Start Command: `npm start` (or `node src/server.js`).
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by platform)
   - `MONGO_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A strong random 64-character secret
   - `CLIENT_ORIGIN`: Your production frontend URL (e.g. `https://student-lens-bay.vercel.app` or `http://localhost:5173`)
   - `COOKIE_SAME_SITE`: `none` (required when client and server run on different domains)

---

## 🗺️ Architectural Roadmap

CampusIQ follows the phases defined in [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md):

- [x] **Phase 1:** Foundation, Architecture, Full-Stack Auth, and Dashboard Skeleton
- [ ] **Phase 2:** Subject Architecture & Target Management
- [ ] **Phase 3:** Attendance Data Models & Tracking
- [ ] **Phase 4:** Core Smart Attendance Engine (Safe absence buffer, recovery class math, what-if simulator)
- [ ] **Phase 5:** Timetable & Class Schedule Integration
- [ ] **Phase 6:** Academic Milestones (Assignments, Exam Countdowns, Submissions)
- [ ] **Phase 7:** Visual Performance Analytics & SGPA/CGPA Projections
- [ ] **Phase 8:** Priority-Aware Smart Academic Planner
- [ ] **Phase 9:** Career Readiness, Opportunities & Project Hub

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
