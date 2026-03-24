import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

function normalizeEmail(email) { return email.trim().toLowerCase(); }
function filePath(files, name) { return files?.[name]?.[0] ? `/uploads/${files[name][0].destination.split(/[\\/]/).pop()}/${files[name][0].filename}` : null; }

async function ensureUniqueEmailPhone(email, phone) {
  const [rows] = await pool.execute('SELECT id FROM users WHERE email = ? OR phone = ? LIMIT 1', [normalizeEmail(email), phone]);
  if (rows[0]) throw new ApiError(409, 'Email or phone is already registered');
}

export async function createDriverApplication(data, files) {
  await ensureUniqueEmailPhone(data.email, data.phone);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [userResult] = await connection.execute(
      `INSERT INTO users (full_name, email, phone, password_hash, role, account_status, is_active)
       VALUES (?, ?, ?, ?, 'driver', 'pending', 1)`,
      [data.fullName.trim(), normalizeEmail(data.email), data.phone.trim(), passwordHash]
    );
    await connection.execute(
      `INSERT INTO driver_profiles (
        user_id, cnic, city, address, license_number, license_expiry,
        vehicle_type, vehicle_model, vehicle_number, vehicle_capacity_kg,
        profile_picture_url, cnic_front_url, cnic_back_url, license_image_url, vehicle_document_url, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userResult.insertId,
        data.cnic.trim(), data.city.trim(), data.address.trim(), data.licenseNumber.trim(), data.licenseExpiry,
        data.vehicleType.trim(), data.vehicleModel.trim(), data.vehicleNumber.trim(), Number(data.vehicleCapacityKg),
        filePath(files, 'profilePicture'), filePath(files, 'cnicFront'), filePath(files, 'cnicBack'), filePath(files, 'licenseImage'), filePath(files, 'vehicleDocument')
      ]
    );
    await connection.commit();
    return { id: userResult.insertId, role: 'driver', accountStatus: 'pending' };
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'Some submitted driver information is already registered');
    throw error;
  } finally { connection.release(); }
}

export async function createTransporterApplication(data, files) {
  await ensureUniqueEmailPhone(data.email, data.phone);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [userResult] = await connection.execute(
      `INSERT INTO users (full_name, business_name, email, phone, password_hash, role, account_status, is_active)
       VALUES (?, ?, ?, ?, ?, 'transporter', 'pending', 1)`,
      [data.ownerName.trim(), data.businessName.trim(), normalizeEmail(data.email), data.phone.trim(), passwordHash]
    );
    await connection.execute(
      `INSERT INTO transporter_profiles (
        user_id, owner_name, registration_number, business_type, city, address, fleet_size, service_areas, has_own_drivers,
        company_logo_url, owner_cnic_front_url, owner_cnic_back_url, registration_document_url, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userResult.insertId,
        data.ownerName.trim(), data.registrationNumber.trim(), data.businessType.trim(), data.city.trim(), data.address.trim(),
        Number(data.fleetSize), data.serviceAreas.trim(), data.hasOwnDrivers === 'yes' ? 1 : 0,
        filePath(files, 'companyLogo'), filePath(files, 'ownerCnicFront'), filePath(files, 'ownerCnicBack'), filePath(files, 'registrationDocument')
      ]
    );
    await connection.commit();
    return { id: userResult.insertId, role: 'transporter', accountStatus: 'pending' };
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'Some submitted business information is already registered');
    throw error;
  } finally { connection.release(); }
}
