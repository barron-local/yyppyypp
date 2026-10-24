// ==============================================================================
// AUTOMATED TESTS: backend/tests/api.test.js (Unit, Integration & RBAC Tests)
// เกณฑ์ข้อ 4.6: Unit Test, Integration Test และตรวจสิทธิ์ 3 Roles
// ==============================================================================

const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = require('../server');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

test.describe('1. Unit Tests (ทดสอบฟังก์ชันระดับหน่วย)', () => {
  test('UNIT-001: ควรรหัสผ่านและเปรียบเทียบ hash ด้วย bcrypt ได้ถูกต้อง', async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Test1234', salt);
    assert.strictEqual(await bcrypt.compare('Test1234', hash), true);
  });

  test('UNIT-002: ควรสร้าง JWT Token และถอดรหัส Payload ระบุ Role ได้ตรงตามกำหนด', () => {
    const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.role, 'admin');
  });
});

test.describe('2. Integration Tests (ทดสอบ API Endpoints พื้นฐาน)', () => {
  let adminToken = '';

  test('INT-001: POST /api/auth/login ควรได้รับ Status 200 พร้อม Token', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'Password123!' });
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.data.token, 'ต้องมี Token ส่งกลับมา');
    adminToken = res.body.data.token;
  });

  test('INT-002: GET /api/items ถ้าไม่ส่ง Token ต้องถูกบล็อก Status 401 Unauthorized', async () => {
    const res = await request(app).get('/api/items');
    assert.strictEqual(res.statusCode, 401);
  });

  test('INT-003: GET /api/items ส่ง Token ถูกต้อง ต้องได้รับ Status 200 OK พร้อมข้อมูล', async () => {
    const res = await request(app).get('/api/items').set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.data.items), 'items ต้องเป็น Array');
  });
});

test.describe('3. RBAC Security Tests (ทดสอบสิทธิ์ผู้ใช้งาน 3 ระดับตามเกณฑ์)', () => {
  let adminToken = '';
  let officerToken = '';
  let memberToken = '';

  test('RBAC-001: ล็อกอินครบ 3 บทบาท และได้ Token ระบุ Role ถูกต้อง', async () => {
    const resAdmin = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'Password123!' });
    assert.strictEqual(resAdmin.statusCode, 200);
    assert.strictEqual(resAdmin.body.data.user.role, 'admin');
    adminToken = resAdmin.body.data.token;

    const resOfficer = await request(app).post('/api/auth/login').send({ username: 'officer1', password: 'Password123!' });
    assert.strictEqual(resOfficer.statusCode, 200);
    assert.strictEqual(resOfficer.body.data.user.role, 'user1');
    officerToken = resOfficer.body.data.token;

    const resMember = await request(app).post('/api/auth/login').send({ username: 'user2', password: 'Password123!' });
    assert.strictEqual(resMember.statusCode, 200);
    assert.strictEqual(resMember.body.data.user.role, 'user2');
    memberToken = resMember.body.data.token;
  });

  test('RBAC-002: User 1 (Officer) สามารถสร้างข้อมูลได้ (201 Created)', async () => {
    const randomCode = 'UNIT-' + Date.now().toString().slice(-4);
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        item_code: randomCode,
        category_id: 1,
        title: 'Router Cisco ISR 4331',
        value_amount: 32000
      });
    assert.strictEqual(res.statusCode, 201);
  });

  test('RBAC-003: User 2 (Member) ต้องถูกห้ามสร้างข้อมูล (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        item_code: 'UNIT-HACK-01',
        category_id: 1,
        title: 'Unauthorized Item',
        value_amount: 1000
      });
    assert.strictEqual(res.statusCode, 403);
  });

  test('RBAC-004: User 1 และ User 2 ต้องถูกห้ามลบข้อมูล (403 Forbidden)', async () => {
    const resOff = await request(app).delete('/api/items/1').set('Authorization', `Bearer ${officerToken}`);
    assert.strictEqual(resOff.statusCode, 403);

    const resMem = await request(app).delete('/api/items/1').set('Authorization', `Bearer ${memberToken}`);
    assert.strictEqual(resMem.statusCode, 403);
  });

  test('RBAC-005: Admin สามารถลบข้อมูลได้ตามสิทธิ์ (200 OK)', async () => {
    // 1. ดึงรายการข้อมูลปัจจุบันเพื่อหา ID ที่มีอยู่จริง
    const listRes = await request(app).get('/api/items').set('Authorization', `Bearer ${adminToken}`);
    const items = listRes.body.data.items;
    assert.ok(items.length > 0, 'ต้องมีข้อมูลอย่างน้อย 1 รายการเพื่อทดสอบลบ');
    const targetId = items[0].id;

    // 2. สั่งลบด้วยสิทธิ์ Admin
    const res = await request(app).delete(`/api/items/${targetId}`).set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'success');
  });
});