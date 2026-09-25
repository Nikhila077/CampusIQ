import express from 'express';
import gamificationController from '../controllers/gamificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', gamificationController.getSummary);
router.post('/action', gamificationController.logAction);

export default router;
