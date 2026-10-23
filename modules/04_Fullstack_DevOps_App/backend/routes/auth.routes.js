// ==============================================================================
// ROUTES: auth.routes.js
// ==============================================================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Public route: เข้าสู่ระบบ
router.post('/login', authController.login);

// Protected route: ดูข้อมูลตนเอง
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
