// ==============================================================================
// MIDDLEWARE: backend/middlewares/auth.middleware.js
// เกณฑ์ข้อ 4.5: ตรวจสอบความถูกต้องของ JWT Token และจำกัดสิทธิ์ตาม Role
// ==============================================================================

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'competition_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ status: "error", message: "ไม่ได้รับอนุญาต: กรุณาแนบ Token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ status: "error", message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    req.user = user;
    next();
  });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: "error", message: `สิทธิ์ไม่เพียงพอ (ต้องการ: ${allowedRoles.join(', ')})` });
    }
    next();
  };
}

module.exports = { JWT_SECRET, authenticateToken, requireRole };