// ==============================================================================
// ROUTES: category.routes.js
// ==============================================================================

const express = require('express');
const router = express.Router();
const { readDb } = require('../config/db');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, (req, res) => {
  const db = readDb();
  res.status(200).json({
    status: "success",
    message: "ดึงรายการหมวดหมู่สำเร็จ",
    data: db.categories
  });
});

module.exports = router;
