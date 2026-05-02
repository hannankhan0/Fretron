import { asyncHandler } from '../utils/asyncHandler.js';
import { createDriverApplication, createTransporterApplication, getDriverApplicationStatus } from '../services/application.service.js';
import { pool } from "../config/db.js";

export const applyDriver = asyncHandler(async (req, res) => {
  const result = await createDriverApplication(req.user, req.body, req.files || {});
  res.status(201).json({ success: true, message: 'Driver application submitted. Fretron admin will review your details.', user: result });
});

export const driverStatus = asyncHandler(async (req, res) => {
  const driverProfile = await getDriverApplicationStatus(req.user.id);
  res.status(200).json({ success: true, driverProfile });
});

export const applyTransporter = asyncHandler(async (req, res) => {
  const result = await createTransporterApplication(req.body, req.files || {});
  res.status(201).json({ success: true, message: 'Transporter application submitted. Fretron admin will review your business details.', user: result });
});


export const getMyDriverStatus = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      id,
      verification_status,
      rejection_reason,
      reviewed_at
    FROM driver_profiles
    WHERE user_id = ?
    LIMIT 1
    `,
    [req.user.id]
  );

  if (!rows.length) {
    return res.status(200).json({
      success: true,
      hasApplied: false,
      status: "none",
      driverProfile: null,
    });
  }

  return res.status(200).json({
    success: true,
    hasApplied: true,
    status: rows[0].verification_status,
    driverProfile: rows[0],
  });
});