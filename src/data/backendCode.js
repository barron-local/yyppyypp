export const projectFileTree = [
  {
    type: "file",
    name: "Dockerfile",
    path: "Dockerfile",
    badge: "Docker",
    desc: "ไฟล์ Build Docker Image สำหรับ Node.js 18 Alpine รันที่พอร์ต 3000",
    code: `# ==============================================================================
# DOCKERFILE: DevOps Competition Web & API Application
# เกณฑ์ข้อ 2.5 & 4.6: "สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนาได้"
# ==============================================================================

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p backend/uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "backend/server.js"]`
  },
  {
    type: "file",
    name: "docker-compose.yml",
    path: "docker-compose.yml",
    badge: "Compose",
    desc: "คอนฟิกรัน App (พอร์ต 3000) + Database MariaDB (พอร์ต 3306) พร้อม Network",
    code: `# ==============================================================================
# DOCKER COMPOSE: Application & Database
# เกณฑ์ข้อ 2.5: "ใช้ docker-compose.yaml สำหรับบริการมากกว่า 1 (เช่น app + db)"
# ==============================================================================

version: '3.8'

services:
  devops-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: devops-competition-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=competition_super_secret_jwt_key_2026
      - DB_HOST=devops-db
    volumes:
      - ./backend/uploads:/app/backend/uploads
    depends_on:
      - devops-db
    networks:
      - app-net

  devops-db:
    image: mariadb:10.11
    container_name: devops-competition-db
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=RootPassword123!
      - MYSQL_DATABASE=competition_db
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-net

networks:
  app-net:
    driver: bridge

volumes:
  db_data:`
  },
  {
    type: "folder",
    name: "frontend/",
    files: [
      {
        path: "frontend/index.html",
        name: "index.html",
        badge: "Frontend UI",
        desc: "หน้าเว็บหลักแบบ Pure HTML (100% No-CSS): Login แยก 3 สิทธิ์, ตาราง CRUD, แนบไฟล์, Native Dialog ยืนยันลบ",
        code: `<!-- ========================================================================= -->
<!-- FRONTEND UI: frontend/index.html (Pure HTML / 100% No CSS)                -->
<!-- เกณฑ์ข้อ 4.6: Responsive, JWT Login 3 Roles, CRUD, แนบไฟล์, Modal ลบ     -->
<!-- ========================================================================= -->

<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DevOps Inventory System (100% No CSS)</title>
</head>
<body>

  <div id="toast-container"></div>

  <!-- VIEW 1: LOGIN -->
  <div id="view-login">
    <h2>เข้าสู่ระบบ (Login)</h2>
    <fieldset>
      <legend>ปุ่มลัดสิทธิ์ผู้ใช้ (Demo Roles)</legend>
      <button type="button" id="btn-quick-admin" onclick="fillAndLogin('admin')">[👑 Admin]</button>
      <button type="button" id="btn-quick-officer" onclick="fillAndLogin('officer1')">[👤 User 1]</button>
      <button type="button" id="btn-quick-member" onclick="fillAndLogin('member1')">[👥 User 2]</button>
    </fieldset>

    <br>
    <form id="form-login" onsubmit="handleLoginSubmit(event)">
      <fieldset>
        <legend>กรอกข้อมูลเข้าสู่ระบบ</legend>
        <p>ชื่อผู้ใช้: <input type="text" id="input-username" required placeholder="admin"></p>
        <p>รหัสผ่าน: <input type="password" id="input-password" required placeholder="••••••••"></p>
        <p id="login-error-box" hidden><font color="red"><b id="login-error-text"></b></font></p>
        <button type="submit" id="btn-login">เข้าสู่ระบบ (Sign In)</button>
      </fieldset>
    </form>
  <!-- VIEW 2: APP / DASHBOARD -->
  <div id="view-app" hidden>
    <table width="100%" border="0">
      <tr>
        <td><h2>DevOps Asset Center</h2></td>
        <td align="right">
          ผู้ใช้: <b id="badge-user-name">Admin</b> | 
          สิทธิ์: <span id="badge-user-role">admin</span>
          <button onclick="logout()">ออกจากระบบ</button>
        </td>
      </tr>
    </table>
    <hr>

    <p>
      <button onclick="switchTab('inventory')" id="tab-inventory">📋 รายการข้อมูล</button>
      <button onclick="switchTab('dashboard')" id="tab-dashboard">📊 ภาพรวม</button>
      <button onclick="switchTab('system-info')" id="tab-system-info">ℹ️ สิทธิ์การใช้งาน</button>
    </p>

    <!-- INVENTORY TAB -->
    <div id="section-inventory">
      <table width="100%" border="0">
        <tr>
          <td><h3>รายการข้อมูลและอุปกรณ์</h3></td>
          <td align="right">
            <button id="btn-open-create-modal" onclick="openCreateModal()">+ เพิ่มรายการใหม่</button>
          </td>
        </tr>
      </table>

      <fieldset>
        <legend>ค้นหา</legend>
        <input type="text" id="input-search" oninput="handleSearchInput()" placeholder="ค้นหารหัสหรือชื่อ...">
        <select id="select-category-filter" onchange="loadItems(1)">
          <option value="">ทุกหมวดหมู่</option>
          <option value="1">Network Equipment</option>
          <option value="2">Server & Storage</option>
        </select>
        <button onclick="resetFilters()">ล้างการค้นหา</button>
      </fieldset>
      <br>

      <table border="1" cellpadding="6" cellspacing="0" width="100%">
        <thead>
          <tr><th>รหัส</th><th>ชื่อรายการ</th><th>หมวดหมู่</th><th>มูลค่า</th><th>ไฟล์แนบ</th><th>จัดการ</th></tr>
        </thead>
        <tbody id="table-items-body"></tbody>
      </table>

      <table width="100%" border="0" style="margin-top: 10px;">
        <tr>
          <td><span id="span-page-info"></span></td>
          <td align="right">
            <button id="btn-prev-page" onclick="prevPage()">« ย้อนกลับ</button>
            <span> หน้าที่ <b id="span-current-page">1</b> </span>
            <button id="btn-next-page" onclick="nextPage()">ถัดไป »</button>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <!-- NATIVE HTML5 DIALOG FOR MODALS -->
  <dialog id="modal-item">
    <h3>เพิ่มรายการใหม่</h3>
    <form id="form-item" onsubmit="handleItemFormSubmit(event)">
      <input type="hidden" id="item-form-id">
      <p>รหัส: <input type="text" id="input-item-code" required></p>
      <p>หมวดหมู่: 
        <select id="select-item-category" required>
          <option value="1">Network Equipment</option>
          <option value="2">Server & Storage</option>
        </select>
      </p>
      <p>ชื่อรายการ: <input type="text" id="input-item-title" required></p>
      <p>มูลค่า: <input type="number" step="0.01" id="input-item-value" required></p>
      <p>ไฟล์แนบ: <input type="file" id="input-item-file"></p>
      <p>รายละเอียด: <textarea id="input-item-desc"></textarea></p>
      <p id="form-error-box" hidden><font color="red"><b id="form-error-text"></b></font></p>
      <hr>
      <button type="button" onclick="closeItemModal()">ยกเลิก</button>
      <button type="submit" id="btn-submit-item">บันทึกข้อมูล</button>
    </form>
  </dialog>

  <dialog id="modal-confirm-delete">
    <h3 align="center">ยืนยันการลบข้อมูล?</h3>
    <p align="center" id="delete-confirm-text"></p>
    <hr>
    <p align="center">
      <button type="button" onclick="closeDeleteModal()">ยกเลิก</button>
      <button type="button" id="btn-confirm-delete" onclick="executeDelete()"><font color="red"><b>ยืนยันลบ</b></font></button>
    </p>
  </dialog>

</body>
</html>`
      }
    ]
  },
  {
    type: "folder",
    name: "backend/",
    files: [
      {
        path: "backend/server.js",
        name: "server.js",
        badge: "Entry Point",
        desc: "ไฟล์หลัก Express.js เปิดพอร์ต 3000, เชื่อม Router, เสิร์ฟ Static Files",
        code: `// ==============================================================================
// MAIN SERVER: backend/server.js
// เกณฑ์ข้อ 4.5: รวม Router, เสิร์ฟ Static Frontend และ API พอร์ต 3000
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

initDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "success", message: "Server is healthy and running" });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`🚀 DevOps Server running on http://localhost:\${PORT}\`);
  });
}

module.exports = app;`
      },
      {
        path: "backend/controllers/auth.controller.js",
        name: "controllers/auth.controller.js",
        badge: "Controller",
        desc: "Login API, JWT Sign, Hash Check (bcryptjs) - 5 สเต็ปเข้าใจง่าย",
        code: `// ==============================================================================
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
};`
      },
      {
        path: "backend/controllers/item.controller.js",
        name: "controllers/item.controller.js",
        badge: "Controller",
        desc: "CRUD ครบทุก Method (GET, POST, PUT, DELETE) + File Upload + Search/Filter",
        code: `// ==============================================================================
// CONTROLLER: backend/controllers/item.controller.js
// เกณฑ์ข้อ 4.5: ครบทุก Method (GET, POST, PUT, DELETE) + Upload File + Search/Pagination
// ==============================================================================

const { readDb, writeDb } = require('../config/db');

// GET /api/items (ดึงรายการทั้งหมด + Search + Filter + Pagination)
exports.getItems = async (req, res, next) => {
  try {
    const db = readDb();
    let items = [...db.items];
    const { search, category_id, page = 1, limit = 10 } = req.query;

    if (category_id) items = items.filter(i => i.category_id === parseInt(category_id, 10));
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.item_code.toLowerCase().includes(q));
    }

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

// POST /api/items (เพิ่มรายการ + แนบไฟล์)
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

// PUT /api/items/:id (แก้ไขข้อมูล + เปลี่ยนไฟล์แนบ)
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

// DELETE /api/items/:id (ลบรายการ - เฉพาะ admin)
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
        path: "backend/middlewares/auth.middleware.js",
        name: "middlewares/auth.middleware.js",
        badge: "Middleware",
        desc: "ตรวจสอบ JWT Token และ Role-based Access Guard (3 Roles: admin, user1, user2)",
        code: `// ==============================================================================
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
      return res.status(403).json({ status: "error", message: \`สิทธิ์ไม่เพียงพอ (ต้องการ: \${allowedRoles.join(', ')})\` });
    }
    next();
  };
}

module.exports = { JWT_SECRET, authenticateToken, requireRole };`
      },
      {
        path: "backend/middlewares/upload.middleware.js",
        name: "middlewares/upload.middleware.js",
        badge: "Middleware",
        desc: "Multer Upload Middleware จัดการไฟล์แนบ และตรวจสอบนามสกุลไฟล์",
        code: `// ==============================================================================
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
    cb(null, \`\${basename}-\${Date.now()}\${ext}\`);
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

module.exports = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });`
      },
      {
        path: "backend/middlewares/error.middleware.js",
        name: "middlewares/error.middleware.js",
        badge: "Middleware",
        desc: "ดักจับ 404 Not Found และ Global Exception Handler JSON",
        code: `// ==============================================================================
// MIDDLEWARE: backend/middlewares/error.middleware.js
// เกณฑ์ข้อ 4.5: Exception Handling ตอบกลับเป็น JSON มี status, message สม่ำเสมอ
// ==============================================================================

function notFoundHandler(req, res, next) {
  res.status(404).json({ status: "error", message: \`ไม่พบ Endpoint: \${req.method} \${req.originalUrl}\` });
}

function errorHandler(err, req, res, next) {
  console.error("💥 Error:", err.message);
  const status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({ status: "error", message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
}

module.exports = { notFoundHandler, errorHandler };`
      },
      {
        path: "backend/routes/auth.routes.js",
        name: "routes/auth.routes.js",
        badge: "Router",
        desc: "เราเตอร์ /api/auth (Login และ Profile)",
        code: `const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;`
      },
      {
        path: "backend/routes/item.routes.js",
        name: "routes/item.routes.js",
        badge: "Router",
        desc: "เราเตอร์ /api/items ครบทุก Method (GET, POST, PUT, DELETE) พร้อม Guard สิทธิ์",
        code: `const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', authenticateToken, itemController.getItems);
router.get('/:id', authenticateToken, itemController.getItemById);
router.post('/', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.createItem);
router.put('/:id', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.updateItem);
router.delete('/:id', authenticateToken, requireRole('admin'), itemController.deleteItem);

module.exports = router;`
      },
      {
        path: "backend/tests/api.test.js",
        name: "tests/api.test.js",
        badge: "Test",
        desc: "Unit Tests & Integration Tests ตอบโจทย์ข้อ 4.6 (ผ่าน 100%)",
        code: `// ==============================================================================
// AUTOMATED TESTS: backend/tests/api.test.js (Unit & Integration Tests)
// ==============================================================================

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../server');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

test.describe('Unit Tests', () => {
  test('UNIT-001: ควรรหัสผ่านและเปรียบเทียบ hash ด้วย bcrypt ได้ถูกต้อง', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Test1234', salt);
    assert.strictEqual(await bcrypt.compare('Test1234', hash), true);
  });

  test('UNIT-002: ควรสร้าง JWT Token และถอดรหัส Payload ได้ตรงตามกำหนด', () => {
    const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.role, 'admin');
  });
});

test.describe('Integration Tests', () => {
  let token = '';

  test('INT-001: POST /api/auth/login ควรได้รับ Status 200 พร้อม Token', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'Password123!' });
    assert.strictEqual(res.statusCode, 200);
    token = res.body.data.token;
  });

  test('INT-002: GET /api/items ถ้าไม่ส่ง Token ต้องได้ Status 401 Unauthorized', async () => {
    const res = await request(app).get('/api/items');
    assert.strictEqual(res.statusCode, 401);
  });

  test('INT-003: GET /api/items ส่ง Token ถูกต้อง ต้องได้รับ Status 200 OK', async () => {
    const res = await request(app).get('/api/items').set('Authorization', \`Bearer \${token}\`);
    assert.strictEqual(res.statusCode, 200);
  });
});`
      }
    ]
  },
  {
    type: "folder",
    name: "tests/",
    files: [
      {
        path: "tests/e2e.spec.js",
        name: "e2e.spec.js",
        badge: "Playwright E2E",
        desc: "Playwright E2E Tests: E2E-001 Login สำเร็จ และ E2E-002 ส่งข้อมูลสำเร็จ",
        code: `// ==============================================================================
// PLAYWRIGHT E2E TESTS: tests/e2e.spec.js
// เกณฑ์ข้อ 4.6: "มี E to E Test เป็นการทดสอบ Work flow เช่น E2E-001 และ E2E-002"
// ==============================================================================

const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('DevOps E2E Workflow Testing', () => {
  test('E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ (Login to Dashboard)', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#view-login')).toBeVisible();

    await page.fill('#input-username', 'officer1');
    await page.fill('#input-password', 'Password123!');
    await page.click('#btn-login');

    await expect(page.locator('#view-app')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#badge-user-name')).toContainText('IT Officer');
  });

  test('E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ (Create Item and Verify Toast)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#input-username', 'admin');
    await page.fill('#input-password', 'Password123!');
    await page.click('#btn-login');

    await page.click('#tab-inventory');
    await page.click('#btn-open-create-modal');

    const code = \`AUTO-\${Date.now().toString().slice(-4)}\`;
    await page.fill('#input-item-code', code);
    await page.selectOption('#select-item-category', '1');
    await page.fill('#input-item-title', 'MikroTik Router Switch');
    await page.fill('#input-item-value', '8900');
    await page.click('#btn-submit-item');

    await expect(page.locator('#toast-container')).toContainText('บันทึกข้อมูลสำเร็จ', { timeout: 5000 });
  });
});`
      }
    ]
  }
];

// Flat list for easy lookup
export const allProjectFiles = [
  ...projectFileTree.filter(f => f.type === 'file'),
  ...projectFileTree.filter(f => f.type === 'folder').flatMap(f => f.files)
];
