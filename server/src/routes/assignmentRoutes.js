import express from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  updateAssignmentStatus,
  deleteAssignment
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAssignments);
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.put('/:id/status', updateAssignmentStatus);
router.delete('/:id', deleteAssignment);

export default router;
