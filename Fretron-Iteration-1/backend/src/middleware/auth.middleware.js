import { env } from '../config/env.js';
import { findUserById } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  req.user = user;
  next();
});
