import brainBoostService from '../services/brainBoostService.js';

export const getTodayQuestion = async (req, res, next) => {
  try {
    const result = await brainBoostService.getTodayQuestion(req.user._id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption } = req.body;
    if (!questionId || selectedOption === undefined) {
      return res.status(400).json({
        success: false,
        message: 'questionId and selectedOption are required'
      });
    }

    const result = await brainBoostService.submitAnswer(
      req.user._id,
      questionId,
      selectedOption
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
  getTodayQuestion,
  submitAnswer
};
