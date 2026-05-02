import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadsRoot = path.resolve('uploads');
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });

function makeStorage(folderName) {
  const destinationDir = path.join(uploadsRoot, folderName);
  if (!fs.existsSync(destinationDir)) fs.mkdirSync(destinationDir, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destinationDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '');
      const safeBase = (path.basename(file.originalname || 'file', ext).replace(/[^a-zA-Z0-9-_]/g, '-') || 'file').slice(0, 40);
      cb(null, `${Date.now()}-${safeBase}${ext}`);
    }
  });
}

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, WEBP, and PDF files are allowed'));
  }
  cb(null, true);
};

export const driverUpload = multer({ storage: makeStorage('drivers'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const transporterUpload = multer({ storage: makeStorage('transporters'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
