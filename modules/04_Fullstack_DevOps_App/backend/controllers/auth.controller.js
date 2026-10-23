// ==============================================================================
// CONTROLLER: auth.controller.js
// เกณฑ์ข้อ 4.5:
// - Method POST สำหรับ Login ตรวจสอบ Password Hash และเซ็น JWT Signing
// - มี Comment คำอธิบาย API และการเรียกใช้อย่างชัดเจน
// - ตรวจสอบข้อมูลไม่ครบถ้วน และส่ง Response มาตรฐาน { status, message, data }
// ==============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb } = require('../config/db');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

/**
 * @api {POST} /api/auth/login เข้าสู่ระบบเพื่อรับ JWT Token
 * @apiDescription ตรวจสอบชื่อผู้ใช้และรหัสผ่าน แล้วออก Signed JWT Token สำหรับยืนยันตัวตน
 * @apiBody {String} username ชื่อผู้ใช้งาน (จำเป็น) เช่น 'admin', 'officer1', 'member1'
 * @apiBody {String} password รหัสผ่าน (จำเป็น) เช่น 'Password123!'
 * @apiSuccess (200 OK) {String} status "success"
 * @apiSuccess (200 OK) {String} message "เข้าสู่ระบบสำเร็จ"
 * @apiSuccess (200 OK) {Object} data ข้อมูล Token และ User Profile
 * @apiError (400 Bad Request) ข้อมูลไม่ครบถ้วน
 * @apiError (401 Unauthorized) ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลที่ส่งมาใน Body ว่าครบถ้วนหรือไม่
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "กรุณาระบุ username และ password ให้ครบถ้วน"
      });
    }

    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // ตรวจสอบรหัสผ่านที่แฮชไว้ด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // สร้าง JWT Token พร้อมระบุ Payload และเวลาหมดอายุ 24 ชั่วโมง
    const payload = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      status: "success",
      message: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ " + user.full_name,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {GET} /api/auth/me ตรวจสอบโปรไฟล์ของผู้ใช้ปัจจุบันจาก Token
 * @apiHeader {String} Authorization Bearer <JWT_TOKEN>
 */
exports.getMe = async (req, res, next) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      data: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
