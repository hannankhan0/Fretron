import { ApiError } from '../utils/ApiError.js';

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (req.user.role !== 'admin') return next(new ApiError(403, 'Admin access required'));
  next();
}
