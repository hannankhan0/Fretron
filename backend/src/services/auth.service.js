import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, clerk_id, auth_provider, full_name, business_name, email, phone, password_hash, role, account_status, is_active, last_login_at, created_at, updated_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [normalizeEmail(email)]
  );
  return rows[0] ? { ...rows[0], accountStatus: rows[0].account_status } : null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    `SELECT id, clerk_id, auth_provider, full_name, business_name, email, phone, role, account_status, is_active, last_login_at, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] ? { ...rows[0], accountStatus: rows[0].account_status } : null;
}

async function recordLastLogin(userId) {
  await pool.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [userId]);
}

export async function createUser({ fullName, businessName, email, phone, password }) {
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = phone?.trim() || null;
  const existingUser = await findUserByEmail(cleanEmail);
  if (existingUser) throw new ApiError(409, 'Email is already registered');

  if (cleanPhone) {
    const [phoneRows] = await pool.execute('SELECT id FROM users WHERE phone = ? LIMIT 1', [cleanPhone]);
    if (phoneRows[0]) throw new ApiError(409, 'Phone number is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.execute(`INSERT INTO users (full_name, business_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)`, [fullName.trim(), businessName?.trim() || null, cleanEmail, cleanPhone, passwordHash]);
  return findUserById(result.insertId);
}

export async function validateLogin({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (user.auth_provider === 'clerk' || !user.password_hash) throw new ApiError(401, 'Please sign in with Clerk');
  if (!user.is_active) throw new ApiError(403, 'Your account is inactive');
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password');
  await recordLastLogin(user.id);
  return findUserById(user.id);
}

export async function validateRoleLogin({ email, password, expectedRole }) {
  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (user.auth_provider === 'clerk' || !user.password_hash) throw new ApiError(401, 'Please sign in with Clerk');
  if (user.role !== expectedRole) throw new ApiError(403, `This account is not registered as ${expectedRole}`);
  if (!user.is_active) throw new ApiError(403, 'Your account is inactive');
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password');
  await recordLastLogin(user.id);
  return findUserById(user.id);
}
