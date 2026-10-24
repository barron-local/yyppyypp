const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { authenticateToken, requireRole } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', authenticateToken, itemController.getItems);
router.get('/:id', authenticateToken, itemController.getItemById);
router.post('/', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.createItem);
router.put('/:id', authenticateToken, requireRole('admin', 'user1'), upload.single('file'), itemController.updateItem);
router.delete('/:id', authenticateToken, requireRole('admin'), itemController.deleteItem);

module.exports = router;