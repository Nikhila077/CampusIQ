import User from '../models/User.js';
import { generateToken, getCookieOptions } from '../config/jwt.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, college, branch, year, semester, rollNumber } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required fields.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return sendError(res, 400, 'Please provide a valid email address.');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long.');
    }

    // Check duplicate user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      college: college ? college.trim() : '',
      branch: branch ? branch.trim() : '',
      year: year ? Number(year) : 1,
      semester: semester ? Number(semester) : 1,
      rollNumber: rollNumber ? rollNumber.trim() : ''
    });

    // Generate JWT & set cookie
    const token = generateToken(user._id);
    res.cookie('token', token, getCookieOptions(req));

    return sendSuccess(res, 201, 'Student account registered successfully.', {
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login student
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide both email and password.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user and explicitly select password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Compare password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Generate JWT & set cookie
    const token = generateToken(user._id);
    res.cookie('token', token, getCookieOptions(req));

    return sendSuccess(res, 200, 'Login successful.', {
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated student profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  return sendSuccess(res, 200, 'Current user profile fetched successfully.', {
    user: req.user.toJSON(),
    token: req.token
  });
};

/**
 * @desc    Logout student (clear HttpOnly cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  const cookieOptions = getCookieOptions(req);
  // Clear cookie with exact matching options
  res.clearCookie('token', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: '/'
  });

  return sendSuccess(res, 200, 'Logged out successfully.');
};
