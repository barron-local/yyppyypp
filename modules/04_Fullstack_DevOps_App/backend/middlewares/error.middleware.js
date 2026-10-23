// ==============================================================================
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
    message: `ไม่พบ Endpoint: ${req.method} ${req.originalUrl}`
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
};
