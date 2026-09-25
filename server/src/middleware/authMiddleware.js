import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';
import { sendError } from '../utils/responseHelper.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Fall back to HttpOnly cookie if not in header
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 401, 'Unauthorized: Access token missing. Please log in.');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return sendError(res, 401, 'Unauthorized: Invalid or expired token.');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, 'Unauthorized: User associated with token no longer exists.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Unauthorized: Token is invalid or has expired.');
    }
    return sendError(res, 500, 'Server error verifying authentication token.', error.message);
  }
};
