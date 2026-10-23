// ==============================================================================
// ROUTES: item.routes.js
// ==============================================================================

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// ดึงรายการทั้งหมด (รองรับ Search, Filter, Pagination)
router.get('/', authenticateToken, itemController.getItems);

// ดูรายละเอียดรายการตาม ID
router.get('/:id', authenticateToken, itemController.getItemById);

// เพิ่มรายการใหม่ พร้อมอัปโหลดไฟล์ (เฉพาะ admin และ user1)
router.post('/', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.createItem);

// แก้ไขรายการ พร้อมเปลี่ยนไฟล์แนบ (เฉพาะ admin และ user1)
router.put('/:id', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.updateItem);

// ลบรายการ (เฉพาะ admin เท่านั้น)
router.delete('/:id', authenticateToken, requireRole('admin'), itemController.deleteItem);

module.exports = router;
