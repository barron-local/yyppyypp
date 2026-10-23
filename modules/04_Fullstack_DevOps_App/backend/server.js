// ==============================================================================
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

// ให้บริการ Frontend UI
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

// เริ่มต้น Server เฉพาะเมื่อถูกสั่งรันตรงๆ (ไม่ใช่ตอนถูก require จากชุดการทดสอบ Test)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 DevOps Application Server is running!`);
    console.log(`📍 Local URL:     http://localhost:${PORT}`);
    console.log(`📡 API Base:      http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
