import { env } from '../config/env.js';
import { findUserById } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/jwt.js';
import { getAuth } from '@clerk/express';
import { pool } from '../config/db.js';

async function findUserByClerkId(clerkId) {
  const [rows] = await pool.execute(
    `SELECT id, clerk_id, auth_provider, full_name, business_name, email, phone, role, account_status, is_active, last_login_at, created_at, updated_at
     FROM users
     WHERE clerk_id = ?
     LIMIT 1`,
    [clerkId]
  );
  return rows[0] ? { ...rows[0], accountStatus: rows[0].account_status } : null;
}

export const requireAuth = asyncHandler(async (req, _res, next) => {
  // ── 1. Clerk first (SPA / Clerk-based users send Bearer token) ───────────
  // Clerk MUST be checked before the JWT cookie so that a stale local-auth
  // cookie cannot shadow a valid Clerk session.
  const auth = getAuth(req, { acceptsToken: 'any' });
  if (auth?.userId) {
    const user = await findUserByClerkId(auth.userId);
    if (!user) {
      throw new ApiError(404, 'User not synced with Fretron database');
    }
    if (!user.is_active) {
      throw new ApiError(403, 'Your account is inactive');
    }
    req.user = user;
    req.clerkUserId = auth.userId;
    return next();
  }

  // ── 2. Fallback: JWT cookie (admin / legacy local-auth users) ────────────
  const token = req.cookies?.[env.cookieName];
  if (token) {
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
    return next();
  }

  throw new ApiError(401, 'Authentication required');
});
