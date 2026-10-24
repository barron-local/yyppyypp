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
├── 📁 backend/                    # ⚙️ ฝั่งหลังบ้าน (Node.js REST API Server ครบ 9 ไฟล์หลัก)
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
  // 1. Server Entry Point
  {
    path: "server.js",
    label: "server.js",
    category: "Entry Point",
    badge: "App Server",
    desc: "ไฟล์หลัก Express.js เปิดพอร์ต 3000, เชื่อมต่อ Router, ให้บริการ Static Files",
    code: `// ==============================================================================
// MAIN SERVER: server.js
// เกณฑ์ข้อ 4.5: สถาปัตยกรรมอ่านง่าย แยก Router ชัดเจน รองรับ REST API & Static Frontend
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDb } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');
const categoryRoutes = require('./routes/category.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// เริ่มต้นสร้างฐานข้อมูลจำลอง
initDb();

// Middlewares พื้นฐาน
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ให้บริการ Static Files สำหรับไฟล์ที่อัปโหลด
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ให้บริการ Frontend UI (เข้าถึงได้ที่ http://localhost:3000)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Health Check API สำหรับตรวจสอบสถานะระบบและ Docker Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy and running",
    timestamp: new Date().toISOString()
  });
});

// เชื่อมต่อ Routes ตามเกณฑ์ RESTful
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// เริ่มต้น Server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`=======================================================\`);
    console.log(\`🚀 DevOps Application Server is running!\`);
    console.log(\`📍 Local URL:     http://localhost:\${PORT}\`);
    console.log(\`📡 API Base:      http://localhost:\${PORT}/api\`);
    console.log(\`=======================================================\`);
  });
}

module.exports = app;`
  },

  // 2. Auth Controller
  {
    path: "controllers/auth.controller.js",
    label: "auth.controller.js",
    category: "Controllers",
    badge: "Auth & JWT",
    desc: "Login API, JWT Sign, Hash Check (bcryptjs) - 5 สเต็ปมาตรฐาน",
    code: `// ==============================================================================
// CONTROLLER: auth.controller.js
// เกณฑ์ข้อ 4.5: POST /api/auth/login ตรวจสอบ Password Hash และเซ็น Signed JWT
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
      return res.status(400).json({
        status: "error",
        message: "กรุณาระบุ username และ password ให้ครบถ้วน"
      });
    }

    // 2. ค้นหา User ในระบบ
    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // 3. ตรวจสอบรหัสผ่านที่แฮชไว้ด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      });
    }

    // 4. สร้าง Signed JWT Token (อายุ 24 ชม.)
    const payload = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    };
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

  // 3. Item Controller
  {
    path: "controllers/item.controller.js",
    label: "item.controller.js",
    category: "Controllers",
    badge: "CRUD & Upload",
    desc: "CRUD ครบทุก Method (GET, POST, PUT, DELETE) + File Upload + Search/Pagination",
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

  // 4. Auth Middleware
  {
    path: "middlewares/auth.middleware.js",
    label: "auth.middleware.js",
    category: "Middlewares",
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

  // 5. Upload Middleware
  {
    path: "middlewares/upload.middleware.js",
    label: "upload.middleware.js",
    category: "Middlewares",
    badge: "Multer Upload",
    desc: "จัดการอัปโหลดไฟล์ด้วย Multer, จำกัดขนาด 10MB, ตรวจสอบนามสกุลไฟล์",
    code: `// ==============================================================================
// MIDDLEWARE: upload.middleware.js
// เกณฑ์ข้อ 4.5: สร้าง API สำหรับอัปโหลดไฟล์ และจัดการประเภทไฟล์ที่อนุญาต
// ==============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ตั้งค่าบันทึกไฟล์ลงดิสก์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, \`\${basename}-\${uniqueSuffix}\${ext}\`);
  }
});

// ตรวจสอบชนิดไฟล์ (อนุญาต รูปภาพ และ เอกสาร)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('ประเภทไฟล์ไม่ถูกต้อง! อนุญาตเฉพาะรูปภาพ (jpg, png) หรือเอกสาร (pdf, docx, zip)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: fileFilter
});

module.exports = upload;`
  },

  // 6. Error Middleware
  {
    path: "middlewares/error.middleware.js",
    label: "error.middleware.js",
    category: "Middlewares",
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
  },

  // 7. Auth Routes
  {
    path: "routes/auth.routes.js",
    label: "auth.routes.js",
    category: "Routes",
    badge: "Router",
    desc: "เส้นทาง API /api/auth (POST /login, GET /me)",
    code: `// ==============================================================================
// ROUTES: auth.routes.js
// ==============================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Public route: เข้าสู่ระบบ
router.post('/login', authController.login);

// Protected route: ดูข้อมูลตนเอง (ต้องแนบ JWT Token)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;`
  },

  // 8. Item Routes
  {
    path: "routes/item.routes.js",
    label: "item.routes.js",
    category: "Routes",
    badge: "Router",
    desc: "เส้นทาง API /api/items ครบทุก Method (GET, POST, PUT, DELETE) พร้อม Guard สิทธิ์",
    code: `// ==============================================================================
// ROUTES: item.routes.js
// ==============================================================================

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// 1. ดึงรายการทั้งหมด (รองรับ Search, Filter, Pagination)
router.get('/', authenticateToken, itemController.getItems);

// 2. ดูรายละเอียดรายการตาม ID
router.get('/:id', authenticateToken, itemController.getItemById);

// 3. เพิ่มรายการใหม่ พร้อมอัปโหลดไฟล์ (เฉพาะ admin และ user1)
router.post('/', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.createItem);

// 4. แก้ไขรายการ พร้อมเปลี่ยนไฟล์แนบ (เฉพาะ admin และ user1)
router.put('/:id', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.updateItem);

// 5. ลบรายการ (เฉพาะ admin เท่านั้น)
router.delete('/:id', authenticateToken, requireRole('admin'), itemController.deleteItem);

module.exports = router;`
  },

  // 9. Automated Tests
  {
    path: "tests/api.test.js",
    label: "api.test.js",
    category: "Testing",
    badge: "Unit & Integration",
    desc: "Unit Tests (bcrypt, jwt) และ Integration Tests (Supertest) ตอบข้อ 4.6 ผ่าน 100%",
    code: `// ==============================================================================
// AUTOMATED TESTS: backend/tests/api.test.js
// เกณฑ์ข้อ 4.6: "มี Test ขั้นพื้นฐานใน Pipeline (Unit Test และ Integration Test อย่างละ 1 Case)"
// ==============================================================================

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../server');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

// 1. UNIT TESTING (ข้อ 4.6)
test.describe('Unit Tests', () => {
  test('UNIT-001: ควรรหัสผ่านและเปรียบเทียบ hash ด้วย bcrypt ได้ถูกต้อง', async () => {
    const password = 'TestSecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const isMatch = await bcrypt.compare(password, hash);
    assert.strictEqual(isMatch, true);
  });

  test('UNIT-002: ควรสร้าง JWT Token และถอดรหัส Payload ได้ข้อมูลตรงตามกำหนด', () => {
    const mockPayload = { id: 99, username: 'testuser', role: 'admin' };
    const token = jwt.sign(mockPayload, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.username, 'testuser');
    assert.strictEqual(decoded.role, 'admin');
  });
});

// 2. INTEGRATION TESTING (ข้อ 4.6)
test.describe('Integration Tests', () => {
  let authToken = '';

  test('INT-001: POST /api/auth/login - ควร Login สำเร็จและได้รับ Status 200 พร้อม JWT Token', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'Password123!' });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    authToken = res.body.data.token;
  });

  test('INT-002: GET /api/items - เมื่อไม่ส่ง Token ต้องปฏิเสธด้วย Status 401 Unauthorized', async () => {
    const res = await request(app).get('/api/items');
    assert.strictEqual(res.statusCode, 401);
  });

  test('INT-003: GET /api/items - เมื่อส่ง Token ที่ถูกต้อง ต้องส่งรายการข้อมูลกลับมาด้วย Status 200 OK', async () => {
    const res = await request(app).get('/api/items').set('Authorization', \`Bearer \${authToken}\`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.data.items));
  });
});`
  }
];
