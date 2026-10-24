export const projectStructureTree = `📁 modules/04_Fullstack_DevOps_App/
│
├── 📄 Dockerfile                  # ตัว Build Container (Node 18 Alpine + เสิร์ฟพอร์ต 3000)
├── 📄 docker-compose.yml          # ตัวรัน Service (Web App + Reverse Proxy)
├── 📄 package.json                # ข้อมูลโปรเจกต์และ dependencies (express, jwt, bcryptjs ฯลฯ)
│
├── 📁 frontend/                   # 🖥️ ฝั่งหน้าบ้าน (UI & Client-Side HTML/CSS/JS)
│   ├── 📄 index.html              # หน้าเว็บหลัก (HTML + Tailwind CSS + Vanilla JS ในไฟล์เดียว)
│   │                              # ├── หน้าจอ Login (Admin, User 1, User 2)
│   │                              # ├── ตาราง CRUD รายการ + แนบไฟล์ + Modal ลบ
│   │                              # └── ค้นหา (Search) + กรอง (Filter) + แบ่งหน้า (Pagination)
│   └── 📄 guide.html              # คู่มือและเอกสารการใช้งานระบบ
│
├── 📁 backend/                    # ⚙️ ฝั่งหลังบ้าน (Node.js REST API Server)
│   ├── 📄 server.js               # จุดเริ่มต้น Server (Entry Point พอร์ต 3000 + รวมทุก Route)
│   │
│   ├── 📁 config/                 # การตั้งค่าระบบและฐานข้อมูล
│   │   ├── 📄 db.js               # ตัวอ่าน-เขียนไฟล์ JSON เสมือนฐานข้อมูลจริง
│   │   └── 📄 competition_data.json # ไฟล์เก็บข้อมูล 3 ตาราง (Users, Items, Categories)
│   │
│   ├── 📁 routes/                 # แยกลิ้งค์ URL (RESTful Endpoints)
│   │   ├── 📄 auth.routes.js      # /api/auth (Login, Me)
│   │   ├── 📄 item.routes.js      # /api/items (GET, POST, PUT, DELETE)
│   │   └── 📄 category.routes.js  # /api/categories (GET)
│   │
│   ├── 📁 controllers/            # สมองและตรรกะการทำงาน (Business Logic)
│   │   ├── 📄 auth.controller.js  # เช็ครหัสผ่าน bcrypt, ออก Signed JWT Token
│   │   └── 📄 item.controller.js  # ตรรกะ CRUD, อัปโหลดไฟล์, Search, Filter, Pagination
│   │
│   ├── 📁 middlewares/            # ตัวดักกรองความปลอดภัยและข้อผิดพลาด
│   │   ├── 📄 auth.middleware.js  # ตรวจ JWT Token & สิทธิ์ (RBAC: Admin, User 1, User 2)
│   │   ├── 📄 upload.middleware.js# ตั้งค่า Multer สำหรับบันทึกไฟล์อัปโหลด
│   │   └── 📄 error.middleware.js # ดักจับ 404 Not Found & Global Error JSON
│   │
│   ├── 📁 uploads/                # โฟลเดอร์เก็บไฟล์ที่ผู้ใช้แนบเข้ามา (รูปภาพ/เอกสาร)
│   │
│   └── 📁 tests/                  # การทดสอบ API อัตโนมัติ (Automated Testing)
│       └── 📄 api.test.js         # Unit Tests & Integration Tests (ผ่าน 100%)
│
└── 📁 tests/                      # 🤖 การทดสอบแบบเสมือนผู้ใช้จริง (End-to-End)
    └── 📄 e2e.spec.js             # Playwright E2E Workflows (E2E-001 Login, E2E-002 ส่งข้อมูล)`;

export const backendCodeFiles = [
  {
    path: "controllers/auth.controller.js",
    label: "controllers/auth.controller.js",
    badge: "Auth & JWT",
    desc: "Login API, JWT Sign, Hash Check (bcryptjs) - แบบอ่านง่าย 5 สเต็ป",
    code: `// ==============================================================================
// CONTROLLER: auth.controller.js (แบบกระชับ อ่านเข้าใจง่าย สำหรับจำไปสอบ)
// เกณฑ์ข้อ 4.5:
// - POST /api/auth/login ตรวจรหัสผ่าน Hash (bcryptjs) และเซ็น Signed JWT Token
// - ส่ง Response JSON มาตรฐาน { status, message, data }
// ==============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'competition_super_secret_jwt_key_2026';

/**
 * 1. ฟังก์ชัน Login เข้าสู่ระบบ (POST /api/auth/login)
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // สเต็ป 1: เช็คว่าส่งข้อมูลมาครบหรือไม่
    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "กรุณาระบุ username และ password ให้ครบถ้วน"
      });
    }

    // สเต็ป 2: ค้นหาผู้ใช้ในฐานข้อมูล
    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // สเต็ป 3: ตรวจสอบรหัสผ่าน Hash ด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // สเต็ป 4: สร้าง JWT Token ลงนามด้วย Secret Key (อายุ 24 ชม.)
    const payload = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // สเต็ป 5: ส่ง JSON สำเร็จพร้อม Token และ Profile
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
 * 2. ฟังก์ชันตรวจสอบข้อมูลโปรไฟล์ตัวเอง (GET /api/auth/me)
 */
exports.getMe = async (req, res, next) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ status: "error", message: "ไม่พบข้อมูลผู้ใช้" });
    }

    return res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
      data: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};`
  },
  {
    path: "controllers/item.controller.js",
    label: "controllers/item.controller.js",
    badge: "CRUD & Upload",
    desc: "CRUD, Upload File, JSDoc Comments ทุก Method, Filter & Pagination",
    code: `// ==============================================================================
// CONTROLLER: item.controller.js
// เกณฑ์ข้อ 4.5: ครบทุก Method (GET, POST, PUT, DELETE) + Upload File + Search/Pagination
// ==============================================================================

const { readDb, writeDb } = require('../config/db');

/**
 * @api {GET} /api/items ดึงรายการข้อมูลทั้งหมด พร้อม Search, Filter, Pagination
 */
exports.getItems = async (req, res, next) => {
  try {
    const db = readDb();
    let items = [...db.items];
    const { search, category_id, page = 1, limit = 10 } = req.query;

    // กรองหมวดหมู่
    if (category_id) {
      items = items.filter(item => item.category_id === parseInt(category_id, 10));
    }
    // ค้นหาตามชื่อหรือรหัส
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.item_code.toLowerCase().includes(q));
    }

    // แบ่งหน้า Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const totalItems = items.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      status: "success",
      message: "ดึงรายการข้อมูลสำเร็จ",
      data: {
        items: paginatedItems,
        pagination: { currentPage: pageNum, totalPages: Math.ceil(totalItems / limitNum) || 1, totalItems, limit: limitNum }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {POST} /api/items สร้างรายการใหม่ พร้อมรองรับอัปโหลดไฟล์
 */
exports.createItem = async (req, res, next) => {
  try {
    const { item_code, category_id, title, description, value_amount } = req.body;
    if (!item_code || !title || !category_id) {
      return res.status(400).json({ status: "error", message: "กรุณากรอก item_code, title และ category_id" });
    }

    const db = readDb();
    if (db.items.some(i => i.item_code.toLowerCase() === item_code.trim().toLowerCase())) {
      return res.status(400).json({ status: "error", message: "รหัสรายการนี้มีอยู่ในระบบแล้ว" });
    }

    const newItem = {
      id: db.items.length > 0 ? Math.max(...db.items.map(i => i.id)) + 1 : 1,
      category_id: parseInt(category_id, 10),
      created_by: req.user.id,
      item_code: item_code.trim(),
      title: title.trim(),
      description: description || "",
      value_amount: parseFloat(value_amount) || 0,
      attachment_path: req.file ? \`/uploads/\${req.file.filename}\` : null,
      created_at: new Date().toISOString()
    };

    db.items.push(newItem);
    writeDb(db);
    return res.status(201).json({ status: "success", message: "บันทึกสำเร็จ", data: newItem });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {PUT} /api/items/:id แก้ไขข้อมูลรายการ และเปลี่ยนไฟล์แนบ
 */
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const idx = db.items.findIndex(i => i.id === parseInt(id, 10));
    if (idx === -1) return res.status(404).json({ status: "error", message: "ไม่พบข้อมูลรายการ" });

    const item = db.items[idx];
    const { title, category_id, description, value_amount } = req.body;
    if (title) item.title = title.trim();
    if (category_id) item.category_id = parseInt(category_id, 10);
    if (description !== undefined) item.description = description.trim();
    if (value_amount !== undefined) item.value_amount = parseFloat(value_amount) || 0;
    if (req.file) item.attachment_path = \`/uploads/\${req.file.filename}\`;

    writeDb(db);
    return res.status(200).json({ status: "success", message: "แก้ไขสำเร็จ", data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {DELETE} /api/items/:id ลบรายการออกจากระบบ
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const idx = db.items.findIndex(i => i.id === parseInt(id, 10));
    if (idx === -1) return res.status(404).json({ status: "error", message: "ไม่พบข้อมูลรายการ" });

    const deleted = db.items.splice(idx, 1)[0];
    writeDb(db);
    return res.status(200).json({ status: "success", message: "ลบสำเร็จ", data: deleted });
  } catch (error) {
    next(error);
  }
};`
  },
  {
    path: "middlewares/auth.middleware.js",
    label: "middlewares/auth.middleware.js",
    badge: "RBAC Guard",
    desc: "JWT Verification & Role-based Access Guard (3 Roles: admin, user1, user2)",
    code: `// ==============================================================================
// MIDDLEWARE: auth.middleware.js
// เกณฑ์ข้อ 4.5: ตรวจสอบความถูกต้องของ JWT Token และจำกัดสิทธิ์ตาม Role
// ==============================================================================

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'competition_super_secret_jwt_key_2026';

// 1. ตรวจสอบ JWT Token จาก Header: Authorization: Bearer <token>
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "ไม่ได้รับอนุญาต: กรุณาแนบ Token" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ status: "error", message: "Token ไม่ถูกต้องหรือหมดอายุ" });
    }
    req.user = user;
    next();
  });
}

// 2. จำกัดสิทธิ์ตาม Role เช่น requireRole('admin') หรือ requireRole('admin', 'user1')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: \`สิทธิ์ไม่เพียงพอ (ต้องการ: \${allowedRoles.join(', ')})\`
      });
    }
    next();
  };
}

module.exports = { JWT_SECRET, authenticateToken, requireRole };`
  },
  {
    path: "middlewares/error.middleware.js",
    label: "middlewares/error.middleware.js",
    badge: "Error Handler",
    desc: "404 Not Found & Global Exception Handler JSON",
    code: `// ==============================================================================
// MIDDLEWARE: error.middleware.js
// เกณฑ์ข้อ 4.5: Exception Handling ตอบกลับเป็น JSON มี status, message สม่ำเสมอ
// ==============================================================================

// ดักจับ Endpoint ที่ไม่มีอยู่จริง (404)
function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: "error",
    message: \`ไม่พบ Endpoint: \${req.method} \${req.originalUrl}\`
  });
}

// ดักจับ Error รวมทั้งหมดของระบบ (500 หรือ status code ตามข้อผิดพลาด)
function errorHandler(err, req, res, next) {
  console.error("💥 Error:", err.message);
  const status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({
    status: "error",
    message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
  });
}

module.exports = { notFoundHandler, errorHandler };`
  }
];
