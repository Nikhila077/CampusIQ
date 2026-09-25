import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  requestToJoin,
  getMyRequests,
  getProjectRequests,
  updateRequestStatus
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/my-requests', getMyRequests);
router.put('/requests/:requestId', updateRequestStatus);
router.get('/:id/requests', getProjectRequests);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/request', requestToJoin);

export default router;
