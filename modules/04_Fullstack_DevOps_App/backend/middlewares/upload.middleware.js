// ==============================================================================
// MIDDLEWARE: upload.middleware.js
// เกณฑ์ข้อ 4.5: สร้าง API สำหรับอัปโหลดไฟล์ และจัดการประเภทไฟล์ที่อนุญาต
// ==============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// โฟลเดอร์สำหรับจัดเก็บไฟล์ที่อัปโหลด
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// กำหนดการบันทึกไฟล์ลงดิสก์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // ป้องกันชื่อไฟล์ซ้ำ โดยขึ้นต้นด้วย timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// ตรวจสอบชนิดไฟล์ (อนุญาต รูปภาพ และ เอกสาร PDF/Doc)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('ประเภทไฟล์ไม่ถูกต้อง! อนุญาตเฉพาะรูปภาพ (jpg, png) หรือเอกสาร (pdf, docx, zip) เท่านั้น'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาด 10 MB
  fileFilter: fileFilter
});

module.exports = upload;
