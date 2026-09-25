import User from '../models/User.js';
import DailyActivity from '../models/DailyActivity.js';

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

/**
 * Awards XP and maintains streak for meaningful actions
 * @param {string} userId
 * @param {number} xpAmount
 * @param {string} actionType - 'brain_boost', 'planner_task', 'assignment_complete', etc.
 * @param {object} extraData - optional extra tracking metadata
 */
export const awardActionXP = async (userId, xpAmount, actionType, extraData = {}) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Find or create DailyActivity record for today
  let activity = await DailyActivity.findOne({ userId, date: today });
  if (!activity) {
    activity = new DailyActivity({
      userId,
      date: today,
      completedActions: [],
      dailyGoal: 3,
      xpEarned: 0
    });
  }

  // Prevent duplicate awards for single-instance actions
  if (actionType === 'brain_boost' && activity.brainBoostCompleted) {
    return {
      awarded: false,
      message: 'Daily Brain Boost already completed today',
      user,
      activity
    };
  }

  // Add action and update XP
  activity.completedActions.push(actionType);
  activity.xpEarned += xpAmount;

  if (actionType === 'brain_boost') {
    activity.brainBoostCompleted = true;
    if (extraData.questionId) {
      activity.brainBoostQuestionId = extraData.questionId;
    }
  }

  if (actionType === 'planner_task' && activity.completedActions.filter(a => a === 'planner_task').length >= 3) {
    activity.plannerCompleted = true;
  }

  await activity.save();

  // Update user XP & Level
  user.xp = (user.xp || 0) + xpAmount;
  user.level = Math.floor(user.xp / 100) + 1;

  // Streak logic based on meaningful actions
  if (user.lastActiveDate === yesterday) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else if (user.lastActiveDate === today) {
    // Already active today; streak stays maintained
    if (!user.currentStreak) user.currentStreak = 1;
  } else {
    // More than 1 day lapsed or first time
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  user.lastActiveDate = today;

  await user.save();

  return {
    awarded: true,
    xpAwarded: xpAmount,
    newTotalXp: user.xp,
    newLevel: user.level,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    activity
  };
};

/**
 * Returns streak, level, XP and today's meaningful progress summary
 */
export const getGamificationSummary = async (userId) => {
  const today = getTodayDateString();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const activity = await DailyActivity.findOne({ userId, date: today });

  const completedCount = activity ? activity.completedActions.length : 0;
  const dailyGoal = activity ? activity.dailyGoal : 3;
  const xpEarnedToday = activity ? activity.xpEarned : 0;
  const brainBoostDone = activity ? activity.brainBoostCompleted : false;

  const currentLevel = user.level || Math.floor((user.xp || 0) / 100) + 1;
  const levelBaseXp = (currentLevel - 1) * 100;
  const nextLevelXp = currentLevel * 100;
  const currentLevelProgress = Math.max(0, Math.min(100, ((user.xp - levelBaseXp) / 100) * 100));

  return {
    xp: user.xp || 0,
    level: currentLevel,
    currentStreak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    todayProgress: {
      date: today,
      completedCount,
      dailyGoal,
      percent: Math.min(100, Math.round((completedCount / dailyGoal) * 100)),
      xpEarnedToday,
      brainBoostDone,
      completedActions: activity ? activity.completedActions : []
    },
    levelProgress: {
      levelBaseXp,
      nextLevelXp,
      percent: Math.round(currentLevelProgress)
    }
  };
};

export default {
  awardActionXP,
  getGamificationSummary,
  getTodayDateString,
  getYesterdayDateString
};
