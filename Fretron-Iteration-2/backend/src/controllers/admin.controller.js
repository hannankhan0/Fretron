import { env } from '../config/env.js';
import {
  approveDriverRequest,
  approveTransporterRequest,
  getAllUsers,
  getApprovedDrivers,
  getApprovedTransporters,
  getDashboardStats,
  getDriverRequestDetail,
  getPendingDriverRequests,
  getPendingTransporterRequests,
  getTransporterRequestDetail,
  rejectDriverRequest,
  rejectTransporterRequest,
} from '../services/admin.service.js';
import { validateRoleLogin } from '../services/auth.service.js';
import { getCookieOptions } from '../utils/cookies.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';

function sendAuthResponse(res, message, user) {
  const token = signToken({ userId: user.id, role: user.role });
  res.cookie(env.cookieName, token, getCookieOptions());
  return res.status(200).json({ success: true, message, user });
}

export const adminLogin = asyncHandler(async (req, res) => {
  const user = await validateRoleLogin({ ...req.body, expectedRole: 'admin' });
  return sendAuthResponse(res, 'Admin login successful', user);
});

export const adminMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const adminLogout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName, getCookieOptions());
  res.status(200).json({ success: true, message: 'Admin logged out successfully' });
});

export const dashboard = asyncHandler(async (_req, res) => res.status(200).json({ success: true, ...(await getDashboardStats()) }));
export const listDriverRequests = asyncHandler(async (_req, res) => res.status(200).json({ success: true, requests: await getPendingDriverRequests() }));
export const listTransporterRequests = asyncHandler(async (_req, res) => res.status(200).json({ success: true, requests: await getPendingTransporterRequests() }));
export const driverRequestDetail = asyncHandler(async (req, res) => res.status(200).json({ success: true, request: await getDriverRequestDetail(req.params.id) }));
export const transporterRequestDetail = asyncHandler(async (req, res) => res.status(200).json({ success: true, request: await getTransporterRequestDetail(req.params.id) }));
export const approveDriver = asyncHandler(async (req, res) => { await approveDriverRequest(req.params.id, req.user.id); res.status(200).json({ success: true, message: 'Driver approved successfully' }); });
export const rejectDriver = asyncHandler(async (req, res) => { await rejectDriverRequest(req.params.id, req.user.id, req.body?.reason || null); res.status(200).json({ success: true, message: 'Driver rejected successfully' }); });
export const approveTransporter = asyncHandler(async (req, res) => { await approveTransporterRequest(req.params.id, req.user.id); res.status(200).json({ success: true, message: 'Business approved successfully' }); });
export const rejectTransporter = asyncHandler(async (req, res) => { await rejectTransporterRequest(req.params.id, req.user.id, req.body?.reason || null); res.status(200).json({ success: true, message: 'Business rejected successfully' }); });
export const listUsers = asyncHandler(async (_req, res) => res.status(200).json({ success: true, users: await getAllUsers() }));
export const listApprovedDrivers = asyncHandler(async (_req, res) => res.status(200).json({ success: true, drivers: await getApprovedDrivers() }));
export const listApprovedTransporters = asyncHandler(async (_req, res) => res.status(200).json({ success: true, transporters: await getApprovedTransporters() }));
