// ==============================================================================
// MIDDLEWARE: backend/middlewares/error.middleware.js
// เกณฑ์ข้อ 4.5: Exception Handling ตอบกลับเป็น JSON มี status, message สม่ำเสมอ
// ==============================================================================

function notFoundHandler(req, res, next) {
  res.status(404).json({ status: "error", message: `ไม่พบ Endpoint: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  const status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({ status: "error", message: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
}

module.exports = { notFoundHandler, errorHandler };