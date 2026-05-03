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

/**
 * requireApprovedRole(...roles)
 *
 * Business rules:
 *  • Every Clerk-synced user has account_status = 'approved' and role = 'user'.
 *  • A user who applied for driver and was approved has an
 *    approved driver_profiles row.  users.role stays 'user' — driver status
 *    lives ONLY in driver_profiles.verification_status.
 *  • Drivers keep full access to all user-facing endpoints.
 *
 * Role semantics handled here:
 *  requireApprovedRole('user')         → any approved account (user OR driver)
 *  requireApprovedRole('driver')       → only approved drivers; sets req.user.role='driver'
 *  requireApprovedRole('user','driver')→ any approved account; sets role='driver' when
 *                                         X-Fretron-Mode: driver header present
 */
export function requireApprovedRole(...roles) {
  return async (req, _res, next) => {
    try {
      if (!req.user) return next(new ApiError(401, 'Authentication required'));

      // ── Account must be active and approved ───────────────────────────────
      if (req.user.account_status !== 'approved') {
        return next(new ApiError(403, 'Your account is not approved yet'));
      }

      // ── User-only endpoint: any approved account passes ───────────────────
      // Implements "a driver is always a user too" — no DB query needed.
      const needsDriverAccess = roles.includes('driver');
      if (!needsDriverAccess) {
        return next();
      }

      // ── Driver-required endpoint: check driver_profiles ───────────────────
      const [profiles] = await pool.execute(
        `SELECT id, verification_status FROM driver_profiles WHERE user_id = ? LIMIT 1`,
        [req.user.id]
      );
      const driverProfile = profiles[0] || null;
      const isApprovedDriver = driverProfile?.verification_status === 'approved';

      if (isApprovedDriver) {
        req.driverProfile = driverProfile;
      }

      const needsUserAccess  = roles.includes('user');
      const driverModeHeader = req.get('x-fretron-mode') === 'driver';

      if (needsDriverAccess && !needsUserAccess) {
        // Pure driver endpoint (e.g. GET /routes/my)
        if (!isApprovedDriver) {
          return next(new ApiError(403, 'You are not an approved driver'));
        }
        req.user = { ...req.user, role: 'driver' };
        return next();
      }

      // Mixed user+driver endpoint (e.g. POST /bookings)
      // Act as driver only when header present AND user is approved driver
      if (needsDriverAccess && needsUserAccess) {
        if (driverModeHeader && isApprovedDriver) {
          req.user = { ...req.user, role: 'driver' };
        }
        return next();
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
