import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get current student's full profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }
    return sendSuccess(res, 200, 'Profile fetched successfully.', { user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current student's profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      branch,
      year,
      semester,
      rollNumber,
      avatar,
      targetRole,
      skills,
      interests,
      notificationPreferences,
      themePreference
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    if (name !== undefined) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (year !== undefined) user.year = Number(year);
    if (semester !== undefined) user.semester = Number(semester);
    if (rollNumber !== undefined) user.rollNumber = rollNumber.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();
    if (targetRole !== undefined) user.targetRole = targetRole.trim();
    if (skills !== undefined && Array.isArray(skills)) user.skills = skills.map((s) => s.trim()).filter(Boolean);
    if (interests !== undefined && Array.isArray(interests)) user.interests = interests.map((i) => i.trim()).filter(Boolean);
    if (notificationPreferences !== undefined && typeof notificationPreferences === 'object') {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }
    if (themePreference !== undefined && ['dark', 'system'].includes(themePreference)) {
      user.themePreference = themePreference;
    }

    await user.save();
    return sendSuccess(res, 200, 'Profile updated successfully.', { user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change current student's password
 * @route   PUT /api/user/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Please provide both current and new password.');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters long.');
    }

    // Explicitly load password hash
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password does not match.');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};
