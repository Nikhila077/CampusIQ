import gamificationService from '../services/gamificationService.js';

export const getSummary = async (req, res, next) => {
  try {
    const summary = await gamificationService.getGamificationSummary(req.user._id);
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

export const logAction = async (req, res, next) => {
  try {
    const { xp, actionType, extraData } = req.body;
    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: 'actionType is required'
      });
    }

    // Default XP based on action type
    let xpAmount = Number(xp) || 5;
    if (actionType === 'planner_task') xpAmount = 5;
    if (actionType === 'assignment_complete') xpAmount = 15;
    if (actionType === 'study_session') xpAmount = 10;

    const result = await gamificationService.awardActionXP(
      req.user._id,
      xpAmount,
      actionType,
      extraData || {}
    );

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSummary,
  logAction
};
