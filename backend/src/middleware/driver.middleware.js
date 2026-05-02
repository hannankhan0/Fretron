import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireApprovedDriver = asyncHandler(async (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const [rows] = await pool.execute(
    `
    SELECT id, verification_status
    FROM driver_profiles
    WHERE user_id = ?
    LIMIT 1
    `,
    [req.user.id]
  );

  if (!rows.length) {
    throw new ApiError(403, "You have not applied as a driver yet");
  }

  if (rows[0].verification_status !== "approved") {
    throw new ApiError(403, "Your driver request is not approved yet");
  }

  req.driverProfile = rows[0];
  next();
});