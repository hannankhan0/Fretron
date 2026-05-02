import { env } from '../config/env.js';
import { createUser, validateLogin as validateLoginService, validateRoleLogin } from '../services/auth.service.js';
import { getCookieOptions } from '../utils/cookies.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';
import { getAuth } from "@clerk/express";
import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
function sendAuthResponse(res, message, user) {
  const token = signToken({ userId: user.id, role: user.role });

  res.cookie(env.cookieName, token, getCookieOptions());

  return res.status(200).json({
    success: true,
    message,
    user
  });
}

export const signup = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);
  return sendAuthResponse(res, 'Account created successfully', user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await validateLoginService(req.body);
  return sendAuthResponse(res, 'Login successful', user);
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export const driverLogin = asyncHandler(async (req, res) => {
  const user = await validateRoleLogin({ ...req.body, expectedRole: 'driver' });
  return sendAuthResponse(res, 'Driver login successful', user);
});

export const transporterLogin = asyncHandler(async (req, res) => {
  const user = await validateRoleLogin({ ...req.body, expectedRole: 'transporter' });
  return sendAuthResponse(res, 'Transporter login successful', user);
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName, getCookieOptions());
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});


export const syncClerkUser = asyncHandler(async (req, res) => {
  const auth = getAuth(req, { acceptsToken: "any" });

  if (!auth?.isAuthenticated || !auth.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const clerkId = auth.userId;

  const {
    fullName,
    email,
    phone,
    businessName,
  } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const safeFullName = fullName || "Fretron User";
  const safePhone = phone || null;
  const safeBusinessName = businessName || null;

  const [existingByClerk] = await pool.execute(
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
    [clerkId]
  );

  if (existingByClerk.length) {
    await pool.execute(
      `
      UPDATE users
      SET 
        full_name = ?,
        email = ?,
        phone = ?,
        business_name = ?,
        last_login_at = NOW()
      WHERE clerk_id = ?
      `,
      [safeFullName, email, safePhone, safeBusinessName, clerkId]
    );

    const [updatedRows] = await pool.execute(
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
      [clerkId]
    );

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      user: updatedRows[0],
    });
  }

  const [existingByEmail] = await pool.execute(
    `
    SELECT id, clerk_id, auth_provider, role
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  if (existingByEmail.length && existingByEmail[0].clerk_id) {
    throw new ApiError(409, "Email is already linked with another Clerk account");
  }

  if (existingByEmail.length && existingByEmail[0].auth_provider === 'local') {
    throw new ApiError(409, "This email belongs to a local Fretron account");
  }

  if (existingByEmail.length && !existingByEmail[0].clerk_id) {
    await pool.execute(
      `
      UPDATE users
      SET
        clerk_id = ?,
        auth_provider = 'clerk',
        full_name = ?,
        phone = ?,
        business_name = ?,
        password_hash = NULL,
        role = 'user',
        account_status = 'approved',
        last_login_at = NOW()
      WHERE email = ?
      `,
      [clerkId, safeFullName, safePhone, safeBusinessName, email]
    );
  } else {
    await pool.execute(
      `
      INSERT INTO users (
        clerk_id,
        auth_provider,
        full_name,
        business_name,
        email,
        phone,
        password_hash,
        role,
        account_status,
        is_active,
        last_login_at
      )
      VALUES (?, 'clerk', ?, ?, ?, ?, NULL, 'user', 'approved', 1, NOW())
      `,
      [clerkId, safeFullName, safeBusinessName, email, safePhone]
    );
  }

  const [newUserRows] = await pool.execute(
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
    [clerkId]
  );

  return res.status(201).json({
    success: true,
    message: "User synced successfully",
    user: newUserRows[0],
  });
});
