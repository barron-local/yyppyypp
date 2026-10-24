export const backendCodeFiles = [
  {
    path: "controllers/auth.controller.js",
    label: "controllers/auth.controller.js",
    badge: "Auth & JWT",
    desc: "Login API, JWT Sign, Hash Check (bcryptjs), Profile getMe",
    code: `// ==============================================================================
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
};`
  },
  {
    path: "controllers/item.controller.js",
    label: "controllers/item.controller.js",
    badge: "CRUD & Upload",
    desc: "CRUD, Upload File, JSDoc Comments ทุก Method, Filter & Pagination",
    code: `// ==============================================================================
// CONTROLLER: item.controller.js
// เกณฑ์ข้อ 4.5:
// - ครบทุก Method: GET (Query & Path), POST (Body & File Upload), PUT (Update & Change File), DELETE
// - มีคำอธิบาย API และการเรียกใช้ครบทุก Method (JSDoc Comments)
// - ระบุข้อมูล Query, Path, Body ชัดเจน
// - โครงสร้าง async/await สะอาด อ่านง่าย
// - มี Exception Handling & Format JSON { status, message, data }
// ==============================================================================

const { readDb, writeDb } = require('../config/db');

/**
 * @api {GET} /api/items ดึงรายการข้อมูลทั้งหมด พร้อมระบบ Search, Filter และ Pagination
 * @apiDescription รองรับการค้นหาตามคำสำคัญ กรองตามหมวดหมู่ และแบ่งหน้าแสดงผล
 * @apiQuery {String} [search] คำค้นหา (รหัส หรือ ชื่อรายการ)
 * @apiQuery {Number} [category_id] รหัสหมวดหมู่ที่ต้องการกรอง
 * @apiQuery {Number} [page=1] ลำดับหน้าที่ต้องการแสดง
 * @apiQuery {Number} [limit=10] จำนวนรายการต่อหน้า
 * @apiSuccess (200 OK) {Array} items รายการข้อมูล
 * @apiSuccess (200 OK) {Object} pagination ข้อมูลการแบ่งหน้า
 */
exports.getItems = async (req, res, next) => {
  try {
    const db = readDb();
    let items = [...db.items];

    const { search, category_id, page = 1, limit = 10 } = req.query;

    // 1. Filter: ตามหมวดหมู่ (ถ้ามีการส่ง category_id มา)
    if (category_id) {
      items = items.filter(item => item.category_id === parseInt(category_id, 10));
    }

    // 2. Search: ค้นหาจากชื่อรายการ หรือ รหัสอุปกรณ์ (Case-insensitive)
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.item_code.toLowerCase().includes(q)
      );
    }

    // ผูกชื่อ Category ให้กับแต่ละ Item เพื่อให้ Frontend นำไปแสดงผลได้ทันที
    const categoryMap = new Map(db.categories.map(c => [c.id, c.name]));
    const enrichedItems = items.map(item => ({
      ...item,
      category_name: categoryMap.get(item.category_id) || "ทั่วไป"
    }));

    // 3. Pagination: การแบ่งหน้า
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const totalItems = enrichedItems.length;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = enrichedItems.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      status: "success",
      message: "ดึงรายการข้อมูลสำเร็จ",
      data: {
        items: paginatedItems,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalItems: totalItems,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {GET} /api/items/:id ดึงรายละเอียดของรายการข้อมูลเดี่ยวตาม ID
 * @apiPathParam {Number} id รหัสไอดีของรายการ (เช่น /api/items/1)
 * @apiSuccess (200 OK) {Object} data ข้อมูลรายการ
 * @apiError (404 Not Found) ไม่พบข้อมูล
 */
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const item = db.items.find(i => i.id === parseInt(id, 10));

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: \`ไม่พบข้อมูลรายการ ID: \${id}\`
      });
    }

    const category = db.categories.find(c => c.id === item.category_id);

    return res.status(200).json({
      status: "success",
      message: "ดึงรายละเอียดสำเร็จ",
      data: {
        ...item,
        category_name: category ? category.name : "ทั่วไป"
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {POST} /api/items สร้างรายการใหม่ พร้อมรองรับการอัปโหลดไฟล์แนบ
 * @apiHeader {String} Authorization Bearer <JWT_TOKEN>
 * @apiBody {String} item_code รหัสอุปกรณ์ (จำเป็นและห้ามซ้ำ)
 * @apiBody {Number} category_id รหัสหมวดหมู่ (จำเป็น)
 * @apiBody {String} title ชื่อรายการ (จำเป็น)
 * @apiBody {String} [description] รายละเอียดเพิ่มเติม
 * @apiBody {Number} value_amount มูลค่าหรือราคา
 * @apiFile {File} [file] ไฟล์เอกสารหรือรูปภาพแนบ
 * @apiSuccess (201 Created) {Object} data รายการที่ถูกสร้างขึ้น
 */
exports.createItem = async (req, res, next) => {
  try {
    const { item_code, category_id, title, description, value_amount } = req.body;

    // ตรวจสอบความครบถ้วนของข้อมูล (Validation)
    if (!item_code || !title || !category_id) {
      return res.status(400).json({
        status: "error",
        message: "ข้อมูลไม่ครบถ้วน! กรุณากรอก item_code, title และเลือกหมวดหมู่ category_id"
      });
    }

    const db = readDb();

    // ตรวจสอบว่า item_code ซ้ำหรือไม่
    const existing = db.items.find(i => i.item_code.toLowerCase() === item_code.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({
        status: "error",
        message: \`รหัสรายการ '\${item_code}' นี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น\`
      });
    }

    const newId = db.items.length > 0 ? Math.max(...db.items.map(i => i.id)) + 1 : 1;

    const newItem = {
      id: newId,
      category_id: parseInt(category_id, 10),
      created_by: req.user.id,
      item_code: item_code.trim(),
      title: title.trim(),
      description: description ? description.trim() : "",
      value_amount: parseFloat(value_amount) || 0.00,
      status: "active",
      attachment_name: req.file ? req.file.originalname : null,
      attachment_path: req.file ? \`/uploads/\${req.file.filename}\` : null,
      attachment_mimetype: req.file ? req.file.mimetype : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.items.push(newItem);
    writeDb(db);

    return res.status(201).json({
      status: "success",
      message: "บันทึกข้อมูลสำเร็จ",
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {PUT} /api/items/:id แก้ไขข้อมูลรายการ และเปลี่ยนไฟล์แนบ
 * @apiPathParam {Number} id รหัสไอดีของรายการ
 * @apiBody {String} [title] ชื่อรายการใหม่
 * @apiBody {Number} [category_id] รหัสหมวดหมู่ใหม่
 * @apiBody {String} [description] รายละเอียดใหม่
 * @apiBody {Number} [value_amount] มูลค่าใหม่
 * @apiFile {File} [file] ไฟล์แนบใหม่ที่ต้องการอัปเดตแทนที่ไฟล์เดิม
 * @apiSuccess (200 OK) {Object} data รายการที่ถูกอัปเดต
 */
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const itemIndex = db.items.findIndex(i => i.id === parseInt(id, 10));

    if (itemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: \`ไม่พบข้อมูลรายการ ID: \${id} ที่ต้องการแก้ไข\`
      });
    }

    const currentItem = db.items[itemIndex];
    const { title, category_id, description, value_amount, status } = req.body;

    if (title) currentItem.title = title.trim();
    if (category_id) currentItem.category_id = parseInt(category_id, 10);
    if (description !== undefined) currentItem.description = description.trim();
    if (value_amount !== undefined) currentItem.value_amount = parseFloat(value_amount) || 0;
    if (status) currentItem.status = status;

    // ถ้ามีการอัปโหลดไฟล์ใหม่ ให้เปลี่ยนข้อมูลไฟล์แนบ
    if (req.file) {
      currentItem.attachment_name = req.file.originalname;
      currentItem.attachment_path = \`/uploads/\${req.file.filename}\`;
      currentItem.attachment_mimetype = req.file.mimetype;
    }

    currentItem.updated_at = new Date().toISOString();

    db.items[itemIndex] = currentItem;
    writeDb(db);

    return res.status(200).json({
      status: "success",
      message: "ปรับปรุงข้อมูลสำเร็จ",
      data: currentItem
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @api {DELETE} /api/items/:id ลบรายการข้อมูลออกจากระบบ
 * @apiPathParam {Number} id รหัสไอดีของรายการที่ต้องการลบ
 * @apiHeader {String} Authorization Bearer <JWT_TOKEN> (สิทธิ์ admin เท่านั้น)
 * @apiSuccess (200 OK) {String} message ยืนยันการลบข้อมูลสำเร็จ
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const itemIndex = db.items.findIndex(i => i.id === parseInt(id, 10));

    if (itemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: \`ไม่พบข้อมูลรายการ ID: \${id} ที่ต้องการลบ\`
      });
    }

    const deletedItem = db.items.splice(itemIndex, 1)[0];
    writeDb(db);

    return res.status(200).json({
      status: "success",
      message: \`ลบข้อมูลรหัส '\${deletedItem.item_code}' เรียบร้อยแล้ว\`,
      data: { id: deletedItem.id, item_code: deletedItem.item_code }
    });
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
        message: \`คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้ (สิทธิ์ของคุณ: \${req.user.role}, สิทธิ์ที่ต้องการ: \${allowedRoles.join(', ')})\`
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole
};`
  },
  {
    path: "middlewares/error.middleware.js",
    label: "middlewares/error.middleware.js",
    badge: "Error Handler",
    desc: "404 Not Found & Global Exception Handler JSON { status, message, error_details }",
    code: `// ==============================================================================
// MIDDLEWARE: error.middleware.js
// เกณฑ์ข้อ 4.5: มีการจัดการข้อผิดพลาด (Exception Handling) 
// และส่ง Response JSON มี status, message, data อย่างเป็นระบบ
// ==============================================================================

/**
 * ดักจับกรณีเรียก Endpoint ที่ไม่มีในระบบ (404 Not Found)
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: "error",
    message: \`ไม่พบ Endpoint: \${req.method} \${req.originalUrl}\`
  });
}

/**
 * Global Error Handler สำหรับดักจับ Exception ทั้งหมด
 */
function errorHandler(err, req, res, next) {
  console.error("💥 [Error Handler]:", err.message || err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    status: "error",
    message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
    error_details: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};`
  }
];
