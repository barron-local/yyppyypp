const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, categoryController.getCategories);

module.exports = router;
