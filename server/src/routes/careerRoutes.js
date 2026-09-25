import express from 'express';
import { getReadiness, updateTarget } from '../controllers/careerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/readiness', getReadiness);
router.put('/target', updateTarget);

export default router;
