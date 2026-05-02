import { ApiError } from '../utils/ApiError.js';
import { pool } from '../config/db.js';

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
  return async (req, _res, next) => {
    try {
      if (!req.user) return next(new ApiError(401, 'Authentication required'));

      if (roles.includes('driver')) {
        const [profiles] = await pool.execute(
          `SELECT id, verification_status
           FROM driver_profiles
           WHERE user_id = ?
           LIMIT 1`,
          [req.user.id]
        );

        const driverProfile = profiles[0] || null;
        if (driverProfile?.verification_status === 'approved') {
          req.driverProfile = driverProfile;
          if ((roles.length === 1 && roles[0] === 'driver') || req.get('x-fretron-mode') === 'driver') {
            req.user = { ...req.user, role: 'driver' };
            return next();
          }
        }
      }

      if (!roles.includes(req.user.role)) {
        return next(new ApiError(403, 'You are not allowed to access this resource'));
      }
      if (req.user.account_status !== 'approved') {
        return next(new ApiError(403, 'Your account is not approved yet'));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
