// ==============================================================================
// MIDDLEWARE: auth.middleware.js
// เกณฑ์ข้อ 4.5: สร้าง API Login โดยใช้ JWT Token มีการลงนาม Signing
// และใช้สำหรับตรวจสอบสิทธิ์ในการเข้าถึงระบบ (Role-Based Access Control)
// ==============================================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'competition_super_secret_jwt_key_2026';

/**
 * Middleware ตรวจสอบความถูกต้องของ JWT Token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // รูปแบบ: Bearer <TOKEN>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "ไม่ได้รับอนุญาต (Unauthorized): กรุณาเข้าสู่ระบบและแนบ Token"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Token ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
      });
    }

    // แนบข้อมูลผู้ใช้เข้าสู่ Request Object
    req.user = decodedUser;
    next();
  });
}

/**
 * Middleware ตรวจสอบสิทธิ์ตามระดับ Role (admin, user1, user2)
 * @param  {...string} allowedRoles รายชื่อ Role ที่อนุญาตให้เข้าถึง
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "กรุณายืนยันตัวตนก่อนเข้าใช้งาน"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้ (สิทธิ์ของคุณ: ${req.user.role}, สิทธิ์ที่ต้องการ: ${allowedRoles.join(', ')})`
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole
};
