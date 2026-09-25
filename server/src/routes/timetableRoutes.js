import express from 'express';
import {
  getTimetable,
  getTodayClasses,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot
} from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getTimetable);
router.get('/today', getTodayClasses);
router.post('/', createTimetableSlot);
router.put('/:id', updateTimetableSlot);
router.delete('/:id', deleteTimetableSlot);

export default router;
