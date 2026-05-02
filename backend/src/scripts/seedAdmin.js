import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const email = process.argv[2] || 'admin@fretron.com';
const password = process.argv[3] || 'Admin@12345';
const fullName = process.argv[4] || 'Fretron Admin';
const phone = process.argv[5] || '03000000000';

async function run() {
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  if (existing[0]) {
    console.log('Admin already exists for this email.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.execute(
    `INSERT INTO users (full_name, email, phone, password_hash, role, account_status, is_active)
     VALUES (?, ?, ?, ?, 'admin', 'approved', 1)`,
    [fullName, email.toLowerCase(), phone, passwordHash]
  );

  console.log('Admin user created successfully.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
