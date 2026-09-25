import { generateAcademicPlan } from '../services/plannerService.js';
import { sendSuccess } from '../utils/responseHelper.js';

/**
 * @desc    Get prioritized daily/weekly academic plan
 * @route   GET /api/planner
 * @access  Private
 */
export const getPlan = async (req, res, next) => {
  try {
    const actionPlan = await generateAcademicPlan(req.user._id);

    return sendSuccess(res, 200, 'Academic action plan generated successfully.', {
      totalItems: actionPlan.length,
      actionPlan
    });
  } catch (error) {
    next(error);
  }
};
