import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Trust reverse proxy (needed for secure cookies on Render, Railway, Heroku, etc.)
app.set('trust proxy', 1);

// Whitelisted origins for both local dev and production deployments
const defaultAllowedOrigins = [
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

    // Allow all Vercel deployment preview and production URLs for CampusIQ
    if (/^https:\/\/(campus-iq|campusiq)[a-zA-Z0-9_-]*\.vercel\.app$/.test(normalized)) {
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
    message: 'CampusIQ Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
