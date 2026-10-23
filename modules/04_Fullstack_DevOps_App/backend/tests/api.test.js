// ==============================================================================
// AUTOMATED TESTS: backend/tests/api.test.js
// เกณฑ์ข้อ 4.6 (หน้า 17 & 26):
// "มี Test ขั้นพื้นฐานใน Pipeline (Unit Testing / Integration Testing) อย่างละ 1 Test Case"
// ==============================================================================

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../server');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

// ------------------------------------------------------------------------------
// 1. UNIT TESTING: ทดสอบฟังก์ชันย่อยเดี่ยวๆ (JWT Signing & Password Validation)
// ------------------------------------------------------------------------------
test.describe('Unit Tests', () => {
  test('UNIT-001: ควรรหัสผ่านและเปรียบเทียบ hash ด้วย bcrypt ได้ถูกต้อง', async () => {
    const password = 'TestSecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const isMatch = await bcrypt.compare(password, hash);
    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);

    assert.strictEqual(isMatch, true, 'รหัสผ่านที่ถูกต้องต้องยืนยันผ่าน');
    assert.strictEqual(isWrongMatch, false, 'รหัสผ่านที่ผิดต้องไม่ผ่าน');
  });

  test('UNIT-002: ควรสร้าง JWT Token และถอดรหัส Payload ได้ข้อมูลตรงตามกำหนด', () => {
    const mockPayload = { id: 99, username: 'testuser', role: 'admin' };
    const token = jwt.sign(mockPayload, JWT_SECRET, { expiresIn: '1h' });

    assert.ok(token, 'ต้องได้รับ token ที่มีค่า');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.username, 'testuser');
    assert.strictEqual(decoded.role, 'admin');
  });
});

// ------------------------------------------------------------------------------
// 2. INTEGRATION TESTING: ทดสอบการทำงานร่วมกันระหว่าง API, Middleware และ Database
// ------------------------------------------------------------------------------
test.describe('Integration Tests', () => {
  let authToken = '';

  test('INT-001: POST /api/auth/login - ควร Login สำเร็จและได้รับ Status 200 พร้อม JWT Token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'Password123!'
      });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(res.body.data.token, 'ต้องมี token ส่งกลับมา');
    assert.strictEqual(res.body.data.user.role, 'admin');

    authToken = res.body.data.token;
  });

  test('INT-002: GET /api/items - เมื่อไม่ส่ง Token ต้องปฏิเสธด้วย Status 401 Unauthorized', async () => {
    const res = await request(app).get('/api/items');
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.status, 'error');
  });

  test('INT-003: GET /api/items - เมื่อส่ง Token ที่ถูกต้อง ต้องส่งรายการข้อมูลกลับมาด้วย Status 200 OK', async () => {
    const res = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
    assert.ok(Array.isArray(res.body.data.items), 'items ต้องเป็น Array');
    assert.ok(res.body.data.pagination, 'ต้องมี pagination ข้อมูลการแบ่งหน้า');
  });
});
