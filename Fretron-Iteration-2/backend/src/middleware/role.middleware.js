import { ApiError } from '../utils/ApiError.js';

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not allowed to access this resource'));
    }
    next();
  };
}

export function requireApprovedRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not allowed to access this resource'));
    }
    if (req.user.account_status !== 'approved') {
      return next(new ApiError(403, 'Your account is not approved yet'));
    }
    next();
  };
}