import BrainBoostQuestion from '../models/BrainBoostQuestion.js';
import DailyActivity from '../models/DailyActivity.js';
import User from '../models/User.js';
import gamificationService, { getTodayDateString } from './gamificationService.js';

/**
 * Returns today's Brain Boost question for the authenticated student
 */
export const getTodayQuestion = async (userId) => {
  const today = getTodayDateString();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Check if user already completed today's brain boost
  const todayActivity = await DailyActivity.findOne({ userId, date: today });
  const completedToday = todayActivity?.brainBoostCompleted || false;

  // Find candidate questions
  let filter = { isActive: true };
  if (user.targetRole) {
    // Check if we have role-specific questions
    const roleQuestionsCount = await BrainBoostQuestion.countDocuments({
      isActive: true,
      targetRoles: { $in: [user.targetRole] }
    });
    if (roleQuestionsCount > 0) {
      filter = { isActive: true, targetRoles: { $in: [user.targetRole] } };
    }
  }

  const allMatching = await BrainBoostQuestion.find(filter).sort({ createdAt: 1 });
  if (allMatching.length === 0) {
    // Fallback to any active question
    const fallback = await BrainBoostQuestion.find({ isActive: true }).sort({ createdAt: 1 });
    if (fallback.length === 0) {
      return { question: null, completedToday: false };
    }
    allMatching.push(...fallback);
  }

  // Deterministically select today's question using date hash
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const selectedIdx = dayOfYear % allMatching.length;
  const questionDoc = allMatching[selectedIdx];

  // If not completed yet, omit correctAnswer for security
  const questionPayload = {
    _id: questionDoc._id,
    question: questionDoc.question,
    category: questionDoc.category,
    difficulty: questionDoc.difficulty,
    options: questionDoc.options,
    targetRoles: questionDoc.targetRoles
  };

  if (completedToday) {
    questionPayload.correctAnswer = questionDoc.correctAnswer;
    questionPayload.explanation = questionDoc.explanation;
  }

  return {
    question: questionPayload,
    completedToday,
    userStreak: user.currentStreak || 0,
    userXp: user.xp || 0
  };
};

/**
 * Verifies answer submission, awards +10 XP if correct and updates streak
 */
export const submitAnswer = async (userId, questionId, selectedOption) => {
  const today = getTodayDateString();
  const question = await BrainBoostQuestion.findById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const todayActivity = await DailyActivity.findOne({ userId, date: today });
  if (todayActivity?.brainBoostCompleted) {
    return {
      alreadyCompleted: true,
      correct: selectedOption === question.correctAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      message: 'You have already completed today\'s Brain Boost!'
    };
  }

  const isCorrect = Number(selectedOption) === question.correctAnswer;

  let rewardResult = null;
  if (isCorrect) {
    rewardResult = await gamificationService.awardActionXP(userId, 10, 'brain_boost', {
      questionId: question._id
    });
  }

  const user = await User.findById(userId);

  return {
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    xpAwarded: isCorrect ? 10 : 0,
    newTotalXp: user?.xp || 0,
    newLevel: user?.level || 1,
    currentStreak: user?.currentStreak || 0,
    streakMaintained: isCorrect
  };
};

export default {
  getTodayQuestion,
  submitAnswer
};
