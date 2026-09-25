import express from 'express';
import brainBoostController from '../controllers/brainBoostController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/today', brainBoostController.getTodayQuestion);
router.post('/answer', brainBoostController.submitAnswer);

export default router;
