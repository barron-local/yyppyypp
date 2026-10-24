// ==============================================================================
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
    console.log(`DevOps Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;