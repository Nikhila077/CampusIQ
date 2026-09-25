import express from 'express';
import {
  getMarks,
  getSubjectMarks,
  createMark,
  updateMark,
  deleteMark
} from '../controllers/markController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMarks);
router.get('/subject/:subjectId', getSubjectMarks);
router.post('/', createMark);
router.put('/:id', updateMark);
router.delete('/:id', deleteMark);

export default router;
