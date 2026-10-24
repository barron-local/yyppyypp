// ==============================================================================
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

// GET /api/items/:id (ดึงข้อมูลรายการเดี่ยวตาม ID)
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const item = db.items.find(i => i.id === parseInt(id, 10));
    if (!item) {
      return res.status(404).json({ status: "error", message: "ไม่พบข้อมูลรายการ" });
    }
    return res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลรายการสำเร็จ",
      data: item
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
      attachment_path: req.file ? `/uploads/${req.file.filename}` : null,
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
    if (req.file) item.attachment_path = `/uploads/${req.file.filename}`;

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
};