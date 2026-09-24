# CampusIQ — Personalized Student Decision-Support Platform
## Complete Implementation Plan

---

## 1. Project Overview

**CampusIQ** is a modern, full-stack student platform built as an individual project. Unlike traditional college ERPs that passively display data, CampusIQ actively analyzes student data and converts it into actionable insights and recommendations.

**Core Principle:**
```
Student Data → Analysis → Insight → Recommended Action
```

The platform is built on a clean React + Node.js + MongoDB stack with JWT-based authentication and a SaaS-style UI.

---

## 2. Problem Statement

Traditional student portals are **data displays**, not **decision support systems**. A student who sees "Attendance: 72%" has no immediate understanding of:

- How many more classes they can safely skip
- How many consecutive classes they must attend to recover
- Which subjects need urgent attention right now
- What personalized actions to take today

CampusIQ bridges this gap. It turns raw academic data into **personalized, calculated, actionable intelligence**.

---

## 3. Goals

### Primary Goals
- Provide a **Smart Attendance Engine** with buffer, recovery, and what-if calculations
- Deliver a **personalized academic dashboard** based on real student data
- Implement a clean **JWT authentication system** with HttpOnly cookies
- Build an extensible, modular architecture that supports future features

### Secondary Goals
- Enable student subject prioritization (High/Medium/Low) for planning
- Surface academic deadlines, exam schedules, and assignment tracking
- Create foundations for Career Readiness, Opportunity Hub, and Project Hub modules

### Non-Goals (Explicit Exclusions)
- This is NOT a generic college ERP
- This is NOT a multi-tenant admin management system
- This does NOT include faculty/admin portals (student-facing only)

---

## 4. Functional Modules

| # | Module | Description | Priority |
|---|--------|-------------|----------|
| 1 | **Authentication** | Register, Login, JWT, Logout, /me | Phase 1 |
| 2 | **Student Profile** | Personal, academic, and preference data | Phase 2 |
| 3 | **Dashboard** | Personalized insight overview | Phase 3 |
| 4 | **Smart Attendance Engine** | Buffer, recovery, priority calculations | Phase 4 |
| 5 | **Attendance What-If Simulator** | Scenario-based projections | Phase 4 |
| 6 | **Attendance Recovery Calculator** | Minimum classes needed to recover | Phase 4 |
| 7 | **Timetable** | Weekly class schedule management | Phase 5 |
| 8 | **Assignments** | Deadlines, submission tracking | Phase 5 |
| 9 | **Exams** | Exam schedule, countdown | Phase 5 |
| 10 | **Academic Performance** | Marks, GPA tracking, Recharts visualizations | Phase 6 |
| 11 | **Smart Academic Planner** | Priority-aware study schedule | Phase 7 |
| 12 | **Career Readiness** | Skill gaps, internship readiness score | Phase 8 |
| 13 | **Opportunity Hub** | Internships, scholarships, competitions | Phase 8 |
| 14 | **Student Project Hub** | Showcase projects, request collaborators | Phase 9 |
| 15 | **Settings** | Preferences, notifications, password change | Phase 10 |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Security** | HttpOnly JWT cookies, bcrypt hashing, no password exposure in API |
| **Authentication** | Persistent login after refresh via `/api/auth/me` |
| **Authorization** | Every private data endpoint scoped to `req.user._id` |
| **Scalability** | Stateless REST API; MongoDB Atlas for horizontal scaling |
| **Responsiveness** | Mobile-first Tailwind CSS layout |
| **Maintainability** | Clear separation of concerns (MVC + service layer) |
| **Performance** | Lightweight Vite bundle; lazy-loaded React routes |
| **Data Integrity** | Every student's data must be isolated; no cross-user data access |

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                        │
│           React + Vite + Tailwind + React Router             │
│   Axios (with withCredentials) → HttpOnly Cookie on each req │
└───────────────────────┬────────────────┬────────────────────┘
                        │ REST API       │ Cookies
                        ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER (Node.js)                 │
│  Routes → Middleware (auth) → Controllers → Services         │
│  cookie-parser | cors | express-validator | morgan           │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                           │
│  Collections: Users, Subjects, Attendance, Timetable,        │
│  Assignments, Exams, Marks, Opportunities, Projects          │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Frontend Architecture

### 7.1 Technology
- **React 18** (functional components, hooks)
- **Vite** (dev server + build tool)
- **Tailwind CSS** (utility-first styling, custom design system)
- **React Router v6** (client-side routing with protected routes)
- **Axios** (HTTP client with `withCredentials: true`)
- **Recharts** (data visualization for attendance, performance)

### 7.2 Folder Structure
```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Primitives: Button, Card, Badge, Input, Modal
│   │   ├── layout/          # Sidebar, Topbar, PageWrapper
│   │   ├── attendance/      # AttendanceCard, BufferBadge, WhatIfForm
│   │   ├── charts/          # AttendanceChart, PerformanceChart
│   │   └── shared/          # Loader, EmptyState, Alert, Avatar
│   ├── pages/               # Route-level page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Attendance.jsx
│   │   ├── AttendanceSimulator.jsx
│   │   ├── Timetable.jsx
│   │   ├── Assignments.jsx
│   │   ├── Exams.jsx
│   │   ├── Performance.jsx
│   │   ├── Planner.jsx
│   │   ├── Career.jsx
│   │   ├── Opportunities.jsx
│   │   ├── Projects.jsx
│   │   └── Settings.jsx
│   ├── layouts/             # AppLayout (with sidebar), AuthLayout (centered)
│   │   ├── AppLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx  # user state, login(), logout(), loading
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useAttendance.js
│   │   └── useDebounce.js
│   ├── services/            # Axios API call wrappers
│   │   ├── api.js           # Axios instance (baseURL, withCredentials)
│   │   ├── authService.js
│   │   ├── attendanceService.js
│   │   ├── subjectService.js
│   │   ├── timetableService.js
│   │   ├── assignmentService.js
│   │   └── examService.js
│   ├── utils/               # Pure helper functions (client-side)
│   │   ├── attendanceCalc.js  # Mirror of backend engine for instant UI feedback
│   │   └── formatDate.js
│   ├── router/
│   │   ├── AppRouter.jsx    # Route definitions
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Tailwind directives + custom design tokens
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### 7.3 Routing Strategy
```
/                    → Landing (public)
/login               → Login (public, redirect if authenticated)
/register            → Register (public, redirect if authenticated)
/dashboard           → Dashboard (protected)
/profile             → Profile (protected)
/attendance          → Attendance (protected)
/attendance/simulate → What-If Simulator (protected)
/timetable           → Timetable (protected)
/assignments         → Assignments (protected)
/exams               → Exams (protected)
/performance         → Performance (protected)
/planner             → Smart Planner (protected)
/career              → Career Readiness (protected)
/opportunities       → Opportunity Hub (protected)
/projects            → Project Hub (protected)
/settings            → Settings (protected)
```

### 7.4 AuthContext
```javascript
// Provided globally via React Context
{
  user: null | { _id, name, email, college, branch, year, semester },
  loading: true | false,
  login: async (credentials) => {},   // POST /api/auth/login
  logout: async () => {},              // POST /api/auth/logout
  // On app load: GET /api/auth/me → sets user or null
}
```

### 7.5 ProtectedRoute
- Reads `user` from AuthContext
- If `loading`, shows a spinner
- If `user` is null, redirects to `/login`
- If authenticated, renders children

---

## 8. Backend Architecture

### 8.1 Technology
- **Node.js** with **Express.js**
- **Mongoose** ODM for MongoDB Atlas
- **bcryptjs** for password hashing
- **jsonwebtoken** for JWT generation and verification
- **cookie-parser** for reading HttpOnly cookies
- **cors** with credentials origin
- **express-validator** for input validation
- **morgan** for HTTP logging (dev)
- **dotenv** for environment configuration

### 8.2 Folder Structure
```
server/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB Atlas connection
│   │   └── jwt.js           # JWT sign/verify helpers
│   ├── controllers/         # Request handlers (thin)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── subjectController.js
│   │   ├── attendanceController.js
│   │   ├── timetableController.js
│   │   ├── assignmentController.js
│   │   ├── examController.js
│   │   ├── markController.js
│   │   ├── opportunityController.js
│   │   └── projectController.js
│   ├── routes/              # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── timetableRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── examRoutes.js
│   │   ├── markRoutes.js
│   │   ├── opportunityRoutes.js
│   │   └── projectRoutes.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Attendance.js
│   │   ├── Timetable.js
│   │   ├── Assignment.js
│   │   ├── Exam.js
│   │   ├── Mark.js
│   │   ├── Opportunity.js
│   │   ├── Project.js
│   │   └── ProjectRequest.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # verifyToken → attaches req.user
│   │   └── errorHandler.js    # Global error handler
│   ├── services/            # Business logic (thick)
│   │   ├── attendanceEngine.js  # Core Smart Attendance calculations
│   │   └── plannerService.js    # Academic priority planning (future)
│   └── utils/
│       └── responseHelper.js    # Standardized API response format
├── app.js                   # Express app setup
├── server.js                # Entry point, starts HTTP server
├── .env
├── .env.example
└── package.json
```

### 8.3 Response Format Standard
All API responses follow this consistent envelope:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null,
  "error": null | "Error detail (dev only)"
}
```

---

## 9. Database Architecture

### 9.1 Database: MongoDB Atlas
- Shared cluster for development
- Dedicated cluster for production
- All collections scoped per `userId` — no cross-user data access

### 9.2 Mongoose Models

#### `User`
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed, select: false),
  college: String,
  branch: String,
  year: Number,
  semester: Number,
  rollNumber: String,
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### `Subject`
```javascript
{
  userId: ObjectId → User (required, indexed),
  name: String (required),
  code: String,
  faculty: String,
  minAttendancePercent: Number (default: 75),
  priority: enum ['high', 'medium', 'low'] (default: 'medium'),
  semester: Number,
  credits: Number,
  isActive: Boolean (default: true),
  createdAt: Date
}
```

#### `Attendance`
```javascript
{
  userId: ObjectId → User (required, indexed),
  subjectId: ObjectId → Subject (required),
  date: Date (required),
  status: enum ['present', 'absent', 'cancelled', 'late'],
  classNumber: Number,
  remarks: String,
  createdAt: Date
}
// Compound index: { userId, subjectId, date }
```

#### `Timetable`
```javascript
{
  userId: ObjectId → User (required),
  subjectId: ObjectId → Subject (required),
  dayOfWeek: enum ['mon','tue','wed','thu','fri','sat'] (required),
  startTime: String (e.g., "09:00"),
  endTime: String (e.g., "10:00"),
  room: String,
  semester: Number,
  isActive: Boolean (default: true)
}
```

#### `Assignment`
```javascript
{
  userId: ObjectId → User (required, indexed),
  subjectId: ObjectId → Subject,
  title: String (required),
  description: String,
  dueDate: Date (required),
  status: enum ['pending', 'submitted', 'late', 'missed'],
  priority: enum ['high', 'medium', 'low'],
  submittedAt: Date,
  grade: String,
  createdAt: Date
}
```

#### `Exam`
```javascript
{
  userId: ObjectId → User (required, indexed),
  subjectId: ObjectId → Subject,
  examType: enum ['midterm', 'final', 'quiz', 'practical', 'viva'],
  date: Date (required),
  startTime: String,
  venue: String,
  syllabus: String,
  isCompleted: Boolean (default: false),
  createdAt: Date
}
```

#### `Mark`
```javascript
{
  userId: ObjectId → User (required, indexed),
  subjectId: ObjectId → Subject (required),
  examId: ObjectId → Exam,
  examType: String,
  marksObtained: Number (required),
  totalMarks: Number (required),
  percentage: Number (virtual),
  grade: String,
  semester: Number,
  remarks: String,
  createdAt: Date
}
```

#### `Opportunity`
```javascript
{
  title: String (required),
  type: enum ['internship', 'scholarship', 'competition', 'fellowship', 'hackathon'],
  provider: String,
  description: String,
  deadline: Date,
  eligibility: String,
  applyLink: String,
  tags: [String],
  postedBy: ObjectId → User,
  isVerified: Boolean (default: false),
  createdAt: Date
}
```

#### `Project`
```javascript
{
  userId: ObjectId → User (required),
  title: String (required),
  description: String,
  techStack: [String],
  repoUrl: String,
  liveUrl: String,
  status: enum ['planning', 'in-progress', 'completed', 'paused'],
  isLookingForCollaborators: Boolean (default: false),
  requiredSkills: [String],
  teamSize: Number,
  createdAt: Date
}
```

#### `ProjectRequest`
```javascript
{
  projectId: ObjectId → Project (required),
  requesterId: ObjectId → User (required),
  message: String,
  status: enum ['pending', 'accepted', 'rejected'] (default: 'pending'),
  createdAt: Date
}
```

---

## 10. Authentication Architecture

### 10.1 Registration Flow
```
POST /api/auth/register
  ↓
Input validation (express-validator)
  ↓
Check email uniqueness
  ↓
bcryptjs.hash(password, 12)
  ↓
Create User document (password stored as hash, never plaintext)
  ↓
jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' })
  ↓
res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7d })
  ↓
Return user object (password field excluded with select: false)
```

### 10.2 Login Flow
```
POST /api/auth/login
  ↓
Find user by email (explicitly select password)
  ↓
bcryptjs.compare(inputPassword, storedHash)
  ↓
On success: generate JWT
  ↓
Set HttpOnly cookie
  ↓
Return user object (no password)
```

### 10.3 Persistent Login Flow (App Load)
```
App loads → AuthContext mounts
  ↓
GET /api/auth/me (cookie sent automatically by browser)
  ↓
authMiddleware: extract token from cookie → jwt.verify()
  ↓
Attach req.user to request
  ↓
Return user object → AuthContext sets user state
  ↓
Protected routes render normally
```

### 10.4 Logout Flow
```
POST /api/auth/logout
  ↓
res.clearCookie('token')
  ↓
AuthContext sets user to null
  ↓
React Router redirects to /login
```

### 10.5 Auth Middleware
```javascript
// middleware/authMiddleware.js
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { _id, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};
```

### 10.6 Security Rules
- Passwords are **never** stored in plaintext
- Password hash **never** returned in any API response (`select: false`)
- All private data endpoints use `userId: req.user._id` as filter — users cannot access each other's data
- JWT stored in HttpOnly cookie — inaccessible to JavaScript (XSS protection)
- CORS configured with `credentials: true` and explicit allowed origin
- `sameSite: 'strict'` on cookie (CSRF protection)

---

## 11. API Route Plan

### Auth Routes (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new student |
| POST | `/login` | No | Login, set cookie |
| GET | `/me` | Yes | Get current user from token |
| POST | `/logout` | Yes | Clear cookie |

### User Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | Yes | Get student profile |
| PUT | `/profile` | Yes | Update profile |
| PUT | `/password` | Yes | Change password |

### Subject Routes (`/api/subjects`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List all subjects for user |
| POST | `/` | Yes | Create subject |
| PUT | `/:id` | Yes | Update subject |
| DELETE | `/:id` | Yes | Delete subject |
| PUT | `/:id/priority` | Yes | Set subject priority |

### Attendance Routes (`/api/attendance`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get all attendance records |
| GET | `/subject/:subjectId` | Yes | Get attendance for one subject |
| POST | `/` | Yes | Log attendance record |
| PUT | `/:id` | Yes | Update attendance record |
| DELETE | `/:id` | Yes | Delete record |
| GET | `/summary` | Yes | Attendance summary with engine calculations |
| GET | `/insights` | Yes | Smart Attendance Engine insights |
| POST | `/simulate` | Yes | What-If simulation |

### Timetable Routes (`/api/timetable`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get full timetable |
| POST | `/` | Yes | Add slot |
| PUT | `/:id` | Yes | Update slot |
| DELETE | `/:id` | Yes | Remove slot |
| GET | `/today` | Yes | Today's classes |

### Assignment Routes (`/api/assignments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List assignments |
| POST | `/` | Yes | Create assignment |
| PUT | `/:id` | Yes | Update assignment |
| PUT | `/:id/status` | Yes | Mark submitted/missed |
| DELETE | `/:id` | Yes | Delete |

### Exam Routes (`/api/exams`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List exams |
| POST | `/` | Yes | Add exam |
| PUT | `/:id` | Yes | Update exam |
| DELETE | `/:id` | Yes | Remove |

### Marks Routes (`/api/marks`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | All marks |
| GET | `/subject/:subjectId` | Yes | Marks by subject |
| POST | `/` | Yes | Add mark entry |
| PUT | `/:id` | Yes | Update mark |

### Opportunity Routes (`/api/opportunities`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Browse opportunities |
| POST | `/` | Yes | Post opportunity |

### Project Routes (`/api/projects`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List projects |
| POST | `/` | Yes | Create project |
| PUT | `/:id` | Yes | Update project |
| POST | `/:id/request` | Yes | Request to join project |

---

## 12. Smart Attendance Engine Logic

This is the core differentiating feature. All logic lives in `server/src/services/attendanceEngine.js`.

### 12.1 Input Structure (per subject)
```javascript
const engineInput = {
  subjectId,
  conducted: 42,       // total classes held
  attended: 35,        // classes student attended
  minPercent: 75,      // minimum required attendance %
  priority: 'high'     // student preference
};
```

### 12.2 Core Calculations

#### Current Attendance Percentage
```javascript
const currentPercent = (attended / conducted) * 100;
```

#### Safe Absence Buffer
> Maximum future classes the student can miss while staying at or above `minPercent`

**Derivation:**
```
attended / (conducted + x) >= minPercent / 100
attended >= (minPercent / 100) * (conducted + x)
attended >= (minPercent / 100) * conducted + (minPercent / 100) * x
attended - (minPercent / 100) * conducted >= (minPercent / 100) * x
x <= (attended - (minPercent / 100) * conducted) / (minPercent / 100)
```

```javascript
const safeAbsences = Math.floor(
  (attended - (minPercent / 100) * conducted) / (minPercent / 100)
);
// If safeAbsences < 0, student is already below threshold
const buffer = Math.max(0, safeAbsences);
```

#### Recovery Calculation
> If below threshold, minimum consecutive classes to attend to reach `minPercent`

**Derivation:**
```
(attended + x) / (conducted + x) >= minPercent / 100
attended + x >= (minPercent / 100) * (conducted + x)
attended + x >= (minPercent / 100) * conducted + (minPercent / 100) * x
x - (minPercent / 100) * x >= (minPercent / 100) * conducted - attended
x * (1 - minPercent / 100) >= (minPercent / 100) * conducted - attended
x >= ((minPercent / 100) * conducted - attended) / (1 - minPercent / 100)
```

```javascript
const classesNeeded = Math.ceil(
  ((minPercent / 100) * conducted - attended) / (1 - minPercent / 100)
);
// Only applicable when currentPercent < minPercent
```

#### What-If Simulation
```javascript
// Scenario: "What if I miss the next N classes?"
const whatIfMiss = (n) => {
  const newConducted = conducted + n;
  const newPercent = (attended / newConducted) * 100;
  const stillSafe = newPercent >= minPercent;
  return { newPercent, stillSafe, newBuffer: Math.max(0, ...) };
};

// Scenario: "What if I attend the next N classes?"
const whatIfAttend = (n) => {
  const newConducted = conducted + n;
  const newAttended = attended + n;
  const newPercent = (newAttended / newConducted) * 100;
  return { newPercent, recovered: newPercent >= minPercent };
};
```

### 12.3 Engine Output (per subject)
```javascript
{
  subjectId,
  subjectName,
  conducted,
  attended,
  currentPercent: 83.33,
  minPercent: 75,
  status: 'safe' | 'at-risk' | 'critical' | 'defaulter',
  buffer: 3,              // classes you can skip
  recoveryNeeded: null,   // classes to attend (null if already safe)
  priority: 'high',
  insights: [
    "You can safely skip 3 more classes",
    "You are 8.33% above the required minimum"
  ]
}
```

### 12.4 Status Thresholds
| Status | Condition |
|--------|-----------|
| `safe` | currentPercent >= minPercent + 5 |
| `at-risk` | minPercent <= currentPercent < minPercent + 5 |
| `critical` | currentPercent < minPercent |
| `defaulter` | currentPercent < minPercent - 10 |

### 12.5 Priority Rules
- Subject priority (`high/medium/low`) is a **student preference** for planning, not an objective importance label
- The engine **never suggests skipping a high-priority subject** as a preference
- Recovery plans **prioritize high-priority subjects** when recommending which classes to attend
- Priority **never overrides** actual attendance requirements

---

## 13. Feature Dependency Map

```
╔══════════════════════════════════════════════════════════════╗
║  Phase 1: Authentication Foundation                          ║
║  User Model → JWT → Register → Login → /me → Logout         ║
╚═════════════════════════╤════════════════════════════════════╝
                          │
                          ▼
╔══════════════════════════════════════════════════════════════╗
║  Phase 2: Student Profile                                    ║
║  (depends on: Authentication)                                ║
║  Profile CRUD → Preference storage                           ║
╚═════════════════════════╤════════════════════════════════════╝
                          │
               ┌──────────┴────────────┐
               ▼                       ▼
╔═════════════════════════╗  ╔══════════════════════════════╗
║  Phase 3: Dashboard     ║  ║  Phase 5: Timetable +        ║
║  (depends on: Profile,  ║  ║  Assignments + Exams         ║
║  Attendance Engine)     ║  ║  (depends on: Subjects)      ║
╚═════════════════════════╝  ╚══════════════════════════════╝
               ▲                       │
               │                       ▼
╔══════════════╧═══════════════════════════════════════════════╗
║  Phase 4: Attendance + Smart Attendance Engine               ║
║  (depends on: Subjects, Auth)                                ║
║  Subject CRUD → Attendance Logging → Engine Calculations     ║
║  → Buffer → Recovery → What-If Simulator                     ║
╚══════════════════════════════════════════════════════════════╝
               │
               ▼
╔══════════════════════════════════════════════════════════════╗
║  Phase 6: Academic Performance                               ║
║  (depends on: Subjects, Exams, Marks)                        ║
╚═════════════════════════╤════════════════════════════════════╝
                          │
                          ▼
╔══════════════════════════════════════════════════════════════╗
║  Phase 7: Smart Academic Planner                             ║
║  (depends on: Attendance Engine, Performance, Priority)      ║
╚══════════════════════════════════════════════════════════════╝

[Parallel track]
Phase 8: Career + Opportunities (independent, post-profile)
Phase 9: Project Hub (independent)
Phase 10: Settings (depends on: Auth, Profile)
```

---

## 14. Development Phases

### Phase 1 — Foundation + Auth (Tomorrow's Milestone)
**Goal:** Working full-stack skeleton with JWT authentication

**Deliverables:**
- [ ] `client/` — React + Vite + Tailwind project initialized
- [ ] `server/` — Express + Mongoose project initialized
- [ ] MongoDB Atlas cluster connected
- [ ] `User` Mongoose model created
- [ ] `POST /api/auth/register` — working, bcrypt hashed
- [ ] `POST /api/auth/login` — working, JWT in HttpOnly cookie
- [ ] `GET /api/auth/me` — working, protected
- [ ] `POST /api/auth/logout` — clears cookie
- [ ] `authMiddleware.js` — verifyToken
- [ ] `AuthContext.jsx` — persistent login on app load
- [ ] `ProtectedRoute.jsx` — redirect if not authenticated
- [ ] Landing Page — modern SaaS design, CTA to register/login
- [ ] Register Page — form with validation
- [ ] Login Page — form with error handling
- [ ] Dashboard placeholder page — protected, shows "Welcome, {name}"
- [ ] AppLayout — sidebar skeleton + topbar
- [ ] `.env.example` — documented environment variables

**NOT in Phase 1:**
- No subjects, attendance, or academic data
- No full dashboard with charts
- No other modules

---

### Phase 2 — Student Profile
- Profile view and edit page
- Avatar upload support (optional: Cloudinary or local)
- Subject CRUD — add/edit/delete subjects with priority and min%
- API: `GET/PUT /api/user/profile`, `CRUD /api/subjects`

### Phase 3 — Dashboard
- Summary cards (today's classes, pending assignments, attendance alerts)
- Quick attendance overview per subject
- Recharts: overall attendance donut chart
- Upcoming deadlines widget
- Requires: Attendance Engine data to populate cards

### Phase 4 — Smart Attendance Engine
- Full attendance logging UI
- Subject-level attendance summary with calculated percentages
- Buffer display: "You can miss X more classes"
- Recovery display: "Attend X consecutive classes to recover"
- What-If Simulator UI with real-time calculation
- API: `/api/attendance/summary`, `/api/attendance/insights`, `/api/attendance/simulate`

### Phase 5 — Timetable + Assignments + Exams
- Weekly timetable grid UI
- Assignment list with status tracking
- Exam countdown with days remaining
- Deadline alerts integration with Dashboard

### Phase 6 — Academic Performance
- Marks input per exam per subject
- Performance charts (Recharts): bar, line
- Semester GPA/percentage summary
- Subject comparison view

### Phase 7 — Smart Academic Planner
- Priority-aware study schedule generator
- Integrates attendance buffer, upcoming exams, assignment deadlines
- Personalized daily/weekly plan view

### Phase 8 — Career Readiness + Opportunity Hub
- Skills list, internship readiness score
- Browse opportunities (internships, scholarships, competitions)
- Post and share opportunities

### Phase 9 — Student Project Hub
- Create and showcase projects
- Request to join collaboration
- Project status tracking

### Phase 10 — Settings + Polish
- Password change
- Notification preferences
- Theme preferences
- Final responsive audit
- Performance optimization

---

## 15. Testing Strategy

### Backend
- **Unit tests:** `attendanceEngine.js` service functions (Jest)
  - Test buffer calculation with edge cases (0%, 100%, exactly at threshold)
  - Test recovery calculation
  - Test what-if scenarios
- **Integration tests:** Auth flow (register → login → /me → logout)
- **Manual API tests:** Postman/Thunder Client collection

### Frontend
- **Manual UI testing** for all user flows
- **Component-level checks** using browser DevTools
- **Auth persistence test:** Refresh page → user should remain logged in
- **Protected route test:** Navigate to `/dashboard` while logged out → redirect

### Edge Cases for Attendance Engine
```
- attended = 0, conducted = 0
- attended = conducted (100%)
- attended = 0, conducted > 0 (0%)
- minPercent = 0 (always safe)
- minPercent = 100 (must attend every class)
- currently exactly at minPercent (buffer = 0)
- currently 1 class below threshold
```

---

## 16. Security Considerations

| Threat | Mitigation |
|--------|------------|
| XSS stealing JWT | HttpOnly cookie — JS cannot read it |
| CSRF attacks | `sameSite: 'strict'` on cookie |
| Password breach | bcryptjs with salt rounds 12 |
| Password exposure in API | `select: false` on password field |
| Unauthorized data access | All queries filtered by `userId: req.user._id` |
| JWT tampering | `jwt.verify()` with secret; invalid tokens rejected |
| Injection attacks | Mongoose parameterized queries (no raw MongoDB) |
| Brute force login | (Future: rate limiting with express-rate-limit) |
| CORS misconfiguration | Explicit allowed origin, `credentials: true` |

---

## 17. Deployment Considerations (Future)

### Frontend
- **Netlify** or **Vercel** — static React/Vite build
- Environment variable: `VITE_API_BASE_URL`
- Cookie domain must match API domain

### Backend
- **Railway** or **Render** — Node.js server
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`
- HTTPS required for `secure: true` cookie in production

### Database
- **MongoDB Atlas** — M0 free tier for development, M10+ for production
- Connection string stored in `.env`, never in source code
- Enable Atlas IP whitelist for server's outbound IP

### Environment Variables Required
```env
# Server
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

# Client
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 18. Recommended Implementation Order

```
Day 1 (Tomorrow — Phase 1)
├── Project scaffolding (client + server)
├── Environment setup + MongoDB Atlas connection
├── User model + auth routes + authMiddleware
├── Landing Page + Register + Login (UI + API)
├── AuthContext + ProtectedRoute
└── Dashboard placeholder

Day 2-3 (Phase 2)
├── Subject model + CRUD API
├── Subject management UI
└── Student Profile page

Day 4-6 (Phase 4 — Smart Attendance Engine first, before dashboard)
├── Attendance model + logging API
├── attendanceEngine.js service
├── Attendance summary API with engine output
├── Attendance UI with buffer/recovery display
└── What-If Simulator

Day 7-8 (Phase 3 — Dashboard, now with real data)
├── Dashboard with attendance summary cards
├── Recharts integration
└── Upcoming deadlines widget

Day 9-10 (Phase 5)
├── Timetable grid
├── Assignments tracker
└── Exams + countdowns

Continue → Phases 6-10 sequentially
```

> **Note:** Phase 4 (Smart Attendance Engine) is scheduled **before** the full Dashboard intentionally. The Dashboard's value depends on real attendance engine data. Building the engine first means the Dashboard is immediately useful when built.

---

## 19. Summary

### ✅ What Will Be Built Tomorrow (Phase 1)

| Item | Status |
|------|--------|
| React + Vite + Tailwind CSS client | Tomorrow |
| Express + Mongoose server | Tomorrow |
| MongoDB Atlas connection | Tomorrow |
| User model with bcrypt | Tomorrow |
| Register API + UI | Tomorrow |
| Login API + UI | Tomorrow |
| JWT in HttpOnly cookie | Tomorrow |
| `/api/auth/me` (persistent login) | Tomorrow |
| Logout API | Tomorrow |
| AuthContext (global auth state) | Tomorrow |
| ProtectedRoute component | Tomorrow |
| Landing page (SaaS-style) | Tomorrow |
| AppLayout (sidebar + topbar skeleton) | Tomorrow |
| Dashboard placeholder (protected) | Tomorrow |

### 🔜 What Will Be Built Later (Phases 2–10)

| Phase | Features |
|-------|---------|
| Phase 2 | Student Profile, Subject Management |
| Phase 3 | Dashboard (with real data + charts) |
| Phase 4 | **Smart Attendance Engine** — Buffer, Recovery, What-If Simulator |
| Phase 5 | Timetable, Assignments, Exams |
| Phase 6 | Academic Performance + Recharts |
| Phase 7 | Smart Academic Planner |
| Phase 8 | Career Readiness + Opportunity Hub |
| Phase 9 | Student Project Hub |
| Phase 10 | Settings + Final Polish + Deployment |

---

*Document version: 1.0 | Created: 2026-09-23 | CampusIQ Architecture Planning*
