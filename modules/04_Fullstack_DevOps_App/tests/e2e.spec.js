// ==============================================================================
// PLAYWRIGHT END-TO-END (E2E) TESTS: e2e.spec.js
// เกณฑ์ข้อ 4.6 (หน้า 17 & 26-27):
// "มี E to E Test เป็นการทดสอบ Work flow ตั้งแต่เริ่มต้นจนจบ ตัวอย่างเช่น E2E-001 และ E2E-002"
// ==============================================================================

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('DevOps Competition E2E Workflow Testing', () => {

  // ----------------------------------------------------------------------------
  // E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ
  // ขั้นตอน:
  // 1. เปิดหน้า Login
  // 2. กรอก username/password
  // 3. กดปุ่ม Login
  // 4. ระบบพาไปหน้า Dashboard
  // ผลที่คาดหวัง: ผู้ใช้เข้าสู่ระบบได้ และเห็นหน้า Dashboard
  // ----------------------------------------------------------------------------
  test('E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ (Login to Dashboard)', async ({ page }) => {
    // 1. เปิดหน้า Login
    await page.goto(BASE_URL);

    // ตรวจสอบว่าอยู่หน้า Login
    await expect(page.locator('#view-login')).toBeVisible();

    // 2. กรอก username/password
    await page.fill('#input-username', 'officer1');
    await page.fill('#input-password', 'Password123!');

    // 3. กดปุ่ม Login
    await page.click('#btn-login');

    // 4. ระบบพาไปหน้า Dashboard / App
    await expect(page.locator('#view-app')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#view-login')).toBeHidden();

    // ผลที่คาดหวัง: ผู้ใช้เข้าสู่ระบบได้ และเห็นชื่อและบทบาทตนเองบน Dashboard
    await expect(page.locator('#badge-user-name')).toContainText('IT Officer');
    await expect(page.locator('#badge-user-role')).toContainText('USER1');
  });

  // ----------------------------------------------------------------------------
  // E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ
  // ขั้นตอน:
  // 1. Login เข้าระบบ
  // 2. เปิดหน้าเพิ่มข้อมูล
  // 3. กรอกข้อมูลในฟอร์ม
  // 4. กดปุ่มบันทึก
  // 5. ระบบแสดงข้อความสำเร็จ
  // ผลที่คาดหวัง: ข้อมูลถูกบันทึก และแสดงข้อความ "บันทึกข้อมูลสำเร็จ"
  // ----------------------------------------------------------------------------
  test('E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ (Create Item and Verify Success)', async ({ page }) => {
    // 1. Login เข้าระบบก่อน
    await page.goto(BASE_URL);
    await page.fill('#input-username', 'admin');
    await page.fill('#input-password', 'Password123!');
    await page.click('#btn-login');
    await expect(page.locator('#view-app')).toBeVisible();

    // ไปที่แท็บตารางรายการ
    await page.click('#tab-inventory');

    // 2. เปิดหน้า/Modal เพิ่มข้อมูล
    await page.click('#btn-open-create-modal');
    await expect(page.locator('#modal-item')).toBeVisible();

    // 3. กรอกข้อมูลในฟอร์ม
    const uniqueCode = `AUTO-${Date.now().toString().slice(-4)}`;
    await page.fill('#input-item-code', uniqueCode);
    await page.selectOption('#select-item-category', '1');
    await page.fill('#input-item-title', 'MikroTik Cloud Router Switch 326');
    await page.fill('#input-item-value', '8900.00');
    await page.fill('#input-item-desc', 'อุปกรณ์สำหรับทดสอบระบบ E2E Automated Test');

    // 4. กดปุ่มบันทึก
    await page.click('#btn-submit-item');

    // 5. ระบบแสดงข้อความสำเร็จ
    // ผลที่คาดหวัง: ตรวจสอบ Toast Notification ว่ามีข้อความ "บันทึกข้อมูลสำเร็จ"
    const toast = page.locator('#toast-container');
    await expect(toast).toContainText('บันทึกข้อมูลสำเร็จ', { timeout: 5000 });

    // ตรวจสอบว่า Modal ปิดลง และพบรหัสรายการในตาราง
    await expect(page.locator('#modal-item')).toBeHidden();
    await expect(page.locator('#table-items-body')).toContainText(uniqueCode);
  });

});
