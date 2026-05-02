import { getAuth } from "@clerk/express";
import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireClerkUser = asyncHandler(async (req, res, next) => {
  const auth = getAuth(req, { acceptsToken: "any" });

  if (!auth?.isAuthenticated || !auth.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const [rows] = await pool.execute(
    `
    SELECT 
      id,
      clerk_id,
      auth_provider,
      full_name,
      business_name,
      email,
      phone,
      role,
      account_status,
      is_active
    FROM users
    WHERE clerk_id = ?
    LIMIT 1
    `,
    [auth.userId]
  );

  if (!rows.length) {
    throw new ApiError(404, "User not synced with Fretron database");
  }

  const user = rows[0];

  if (!user.is_active) {
    throw new ApiError(403, "Your account is inactive");
  }

  req.user = user;
  req.clerkUserId = auth.userId;

  next();
});
