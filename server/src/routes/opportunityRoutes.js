import express from 'express';
import { getOpportunities, createOpportunity } from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getOpportunities);
router.post('/', createOpportunity);

export default router;
