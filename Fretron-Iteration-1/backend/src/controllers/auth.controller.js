import { env } from '../config/env.js';
import { createUser, validateLogin as validateLoginService, validateRoleLogin } from '../services/auth.service.js';
import { getCookieOptions } from '../utils/cookies.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';

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
