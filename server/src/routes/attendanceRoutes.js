import express from 'express';
import {
  getAllAttendance,
  getSubjectAttendance,
  logAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
  getAttendanceInsights,
  simulateAttendance
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllAttendance);
router.get('/summary', getAttendanceSummary);
router.get('/insights', getAttendanceInsights);
router.post('/simulate', simulateAttendance);
router.get('/subject/:subjectId', getSubjectAttendance);
router.post('/', logAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
