import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const getCookieOptions = (req) => {
  const isHttps = req ? (req.secure || req.headers?.['x-forwarded-proto'] === 'https') : false;
  const isProduction = process.env.NODE_ENV === 'production' || isHttps;
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const secure = sameSite === 'none' ? true : isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
};
