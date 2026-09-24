import { sendError } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]:', err);

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 400, `An account with this ${field} already exists.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, 400, messages.join(', '));
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return sendError(res, statusCode, err.message || 'Internal Server Error');
};
