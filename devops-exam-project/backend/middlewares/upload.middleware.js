// ==============================================================================
// MIDDLEWARE: backend/middlewares/upload.middleware.js
// เกณฑ์ข้อ 4.5: สร้าง API สำหรับอัปโหลดไฟล์ และจัดการประเภทไฟล์ที่อนุญาต
// ==============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|zip/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('ประเภทไฟล์ไม่ถูกต้อง! อนุญาตเฉพาะรูปภาพและเอกสาร'));
  }
};

module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });