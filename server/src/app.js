import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import examRoutes from './routes/examRoutes.js';
import markRoutes from './routes/markRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import brainBoostRoutes from './routes/brainBoostRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust reverse proxy (needed for secure cookies on Render, Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Whitelisted origins for both local dev and production deployments
const defaultAllowedOrigins = [
  'https://studentlens.vercel.app',
  'https://student-lens.vercel.app',
  'https://campus-iq-tawny.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173'
];

const customOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...customOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server, health checks)
    if (!origin) return callback(null, true);

    const normalized = origin.trim().replace(/\/$/, '');

    // Allow explicitly whitelisted origins
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }

    // Allow all Vercel deployment preview and production URLs for StudentLens and CampusIQ
    if (/^https:\/\/(studentlens|student-lens|campus-iq|campusiq)[a-zA-Z0-9_-]*\.vercel\.app$/.test(normalized)) {
      return callback(null, true);
    }

    // In development mode, allow any local or staging origin
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Safely reject origin without throwing 500 error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsers & cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'StudentLens Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/brain-boost', brainBoostRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
