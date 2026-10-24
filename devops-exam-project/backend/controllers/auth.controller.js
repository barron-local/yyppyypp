// ==============================================================================
// CONTROLLER: backend/controllers/auth.controller.js
// เกณฑ์ข้อ 4.5: POST /api/auth/login ตรวจรหัสผ่าน Hash และเซ็น Signed JWT Token
// ==============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'competition_super_secret_jwt_key_2026';

/**
 * @api {POST} /api/auth/login เข้าสู่ระบบเพื่อรับ JWT Token
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. ตรวจสอบข้อมูลใน Body
    if (!username || !password) {
      return res.status(400).json({ status: "error", message: "กรุณาระบุ username และ password ให้ครบถ้วน" });
    }

    // 2. ค้นหา User ในระบบ
    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ status: "error", message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 3. ตรวจสอบรหัสผ่านที่แฮชไว้ด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 4. สร้าง Signed JWT Token (อายุ 24 ชม.)
    const payload = { id: user.id, username: user.username, full_name: user.full_name, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // 5. ส่ง Response JSON มาตรฐาน { status, message, data }
    return res.status(200).json({
      status: "success",
      message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ " + user.full_name,
      data: {
        token,
        user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @api {GET} /api/auth/me ดูโปรไฟล์ตัวเองจาก Token
 */
exports.getMe = async (req, res, next) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ status: "error", message: "ไม่พบข้อมูลผู้ใช้" });

    return res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      data: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};