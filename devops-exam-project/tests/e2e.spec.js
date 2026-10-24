// ==============================================================================
// PLAYWRIGHT E2E TESTS: tests/e2e.spec.js
// เกณฑ์ข้อ 4.6: "มี E to E Test เป็นการทดสอบ Work flow เช่น E2E-001 และ E2E-002"
// ==============================================================================

const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('DevOps E2E Workflow Testing', () => {
  test('E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ (Login to Dashboard)', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#view-login')).toBeVisible();

    await page.fill('#input-username', 'officer1');
    await page.fill('#input-password', 'Password123!');
    await page.click('#btn-login');

    await expect(page.locator('#view-app')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#badge-user-name')).toContainText('IT Officer');
  });

  test('E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ (Create Item and Verify Toast)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#input-username', 'admin');
    await page.fill('#input-password', 'Password123!');
    await page.click('#btn-login');

    await page.click('#tab-inventory');
    await page.click('#btn-open-create-modal');

    const code = `AUTO-${Date.now().toString().slice(-4)}`;
    await page.fill('#input-item-code', code);
    await page.selectOption('#select-item-category', '1');
    await page.fill('#input-item-title', 'MikroTik Router Switch');
    await page.fill('#input-item-value', '8900');
    await page.click('#btn-submit-item');

    await expect(page.locator('#toast-container')).toContainText('บันทึกข้อมูลสำเร็จ', { timeout: 5000 });
  });
});