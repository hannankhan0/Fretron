import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function getDashboardStats() {
  const [[stats]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM driver_profiles WHERE verification_status = 'pending') AS pendingDrivers,
      (SELECT COUNT(*) FROM transporter_profiles WHERE verification_status = 'pending') AS pendingTransporters,
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM driver_profiles WHERE verification_status = 'approved') AS activeDrivers,
      (SELECT COUNT(*) FROM transporter_profiles WHERE verification_status = 'approved') AS activeTransporters
  `);

  const [pendingDrivers] = await pool.query(`
    SELECT dp.id, u.full_name, dp.city, dp.vehicle_type, dp.created_at
    FROM driver_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    WHERE dp.verification_status = 'pending'
    ORDER BY dp.created_at DESC
    LIMIT 5
  `);

  const [pendingTransporters] = await pool.query(`
    SELECT tp.id, u.business_name, tp.city, tp.business_type, tp.created_at
    FROM transporter_profiles tp
    INNER JOIN users u ON u.id = tp.user_id
    WHERE tp.verification_status = 'pending'
    ORDER BY tp.created_at DESC
    LIMIT 5
  `);

  return { stats, pendingDrivers, pendingTransporters };
}

export async function getPendingDriverRequests() {
  const [rows] = await pool.query(`
    SELECT dp.id, dp.user_id, u.full_name, u.email, u.phone, dp.city, dp.vehicle_type, dp.vehicle_number, dp.created_at, dp.verification_status
    FROM driver_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    WHERE dp.verification_status = 'pending'
    ORDER BY dp.created_at DESC
  `);
  return rows;
}

export async function getPendingTransporterRequests() {
  const [rows] = await pool.query(`
    SELECT tp.id, tp.user_id, u.business_name, tp.owner_name, u.email, u.phone, tp.city, tp.fleet_size, tp.created_at, tp.business_type, tp.verification_status
    FROM transporter_profiles tp
    INNER JOIN users u ON u.id = tp.user_id
    WHERE tp.verification_status = 'pending'
    ORDER BY tp.created_at DESC
  `);
  return rows;
}

export async function getDriverRequestDetail(id) {
  const [rows] = await pool.execute(`
    SELECT dp.*, u.full_name, u.email, u.phone, u.account_status, u.last_login_at
    FROM driver_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    WHERE dp.id = ?
    LIMIT 1
  `, [id]);
  if (!rows[0]) throw new ApiError(404, 'Driver request not found');
  return rows[0];
}

export async function getTransporterRequestDetail(id) {
  const [rows] = await pool.execute(`
    SELECT tp.*, u.business_name, u.email, u.phone, u.account_status, u.last_login_at
    FROM transporter_profiles tp
    INNER JOIN users u ON u.id = tp.user_id
    WHERE tp.id = ?
    LIMIT 1
  `, [id]);
  if (!rows[0]) throw new ApiError(404, 'Business request not found');
  return rows[0];
}

async function setDriverStatus(id, status, adminUserId, reason = null) {
  const detail = await getDriverRequestDetail(id);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(`UPDATE driver_profiles SET verification_status = ?, reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ? WHERE id = ?`, [status, adminUserId, reason || null, id]);
    await connection.execute(`UPDATE users SET account_status = ? WHERE id = ?`, [status, detail.user_id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function setTransporterStatus(id, status, adminUserId, reason = null) {
  const detail = await getTransporterRequestDetail(id);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(`UPDATE transporter_profiles SET verification_status = ?, reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ? WHERE id = ?`, [status, adminUserId, reason || null, id]);
    await connection.execute(`UPDATE users SET account_status = ? WHERE id = ?`, [status, detail.user_id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export function approveDriverRequest(id, adminUserId) { return setDriverStatus(id, 'approved', adminUserId); }
export function rejectDriverRequest(id, adminUserId, reason) { return setDriverStatus(id, 'rejected', adminUserId, reason); }
export function approveTransporterRequest(id, adminUserId) { return setTransporterStatus(id, 'approved', adminUserId); }
export function rejectTransporterRequest(id, adminUserId, reason) { return setTransporterStatus(id, 'rejected', adminUserId, reason); }

export async function getAllUsers() {
  const [rows] = await pool.query(`SELECT id, full_name, business_name, email, phone, role, account_status, is_active, created_at, updated_at, last_login_at FROM users ORDER BY created_at DESC`);
  return rows;
}

export async function getApprovedDrivers() {
  const [rows] = await pool.query(`
    SELECT dp.id, u.full_name, u.last_login_at, dp.cnic, dp.city, dp.vehicle_type, dp.vehicle_number, dp.reviewed_at
    FROM driver_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    WHERE dp.verification_status = 'approved'
    ORDER BY dp.reviewed_at DESC, dp.created_at DESC
  `);
  return rows;
}

export async function getApprovedTransporters() {
  const [rows] = await pool.query(`
    SELECT tp.id, u.business_name, u.last_login_at, tp.owner_name, tp.city, tp.fleet_size, tp.reviewed_at
    FROM transporter_profiles tp
    INNER JOIN users u ON u.id = tp.user_id
    WHERE tp.verification_status = 'approved'
    ORDER BY tp.reviewed_at DESC, tp.created_at DESC
  `);
  return rows;
}
