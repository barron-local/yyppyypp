# 🎨 คู่มือการออกแบบหน้าจอ 5 หน้าด้วย Draw.io (Offline)
**เกณฑ์ข้อ 4.3: การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (คะแนนเต็ม 5 คะแนน)**

ในการแข่งขัน กรรมการจะเตรียมโปรแกรม **Draw.io แบบ Offline** ไว้ให้ โดยให้วาด Layout Template ทั้ง 5 หน้าให้เห็นสัดส่วนชัดเจน มี Header, Sidebar, Content, Table, Form, Modal และ Button

---

## 🖥️ 1. หน้าจอที่ 1: เข้าสู่ระบบ (Login Screen)
*องค์ประกอบสำคัญที่ต้องวาดใน Draw.io:*
- กล่อง Card กึ่งกลางหน้าจอ (Center Card Layout)
- โลโก้ และชื่อระบบ "IT DevOps Asset & Service Management"
- ช่องกรอก: Username (Input text with icon)
- ช่องกรอก: Password (Input password with eye toggle)
- ปุ่ม: "เข้าสู่ระบบ (Sign In)" (Primary Button)
- ข้อความแจ้งสิทธิ์สำหรับทดสอบ:
  - Admin: `admin / Password123!`
  - User 1: `officer1 / Password123!`
  - User 2: `member1 / Password123!`
- กล่องแสดงข้อความ Error Alert (จำลองเมื่อใส่รหัสผ่านผิด)

---

## 📊 2. หน้าจอที่ 2: หน้าจอหลักของระบบ (Dashboard / Overview)
*องค์ประกอบสำคัญที่ต้องวาดใน Draw.io:*
- **Top Navigation Bar:** โลโก้, ชื่อระบบ, Search Bar รวม, แจ้งเตือน Notification, รูปโปรไฟล์ผู้ใช้ + แสดง Role Badge
- **Sidebar Menu:** Dashboard, Manage Items, Categories, Users, System Logs, Settings, Logout
- **KPI Summary Cards (4 กล่องสถิติบนสุด):**
  - Card 1: จำนวนอุปกรณ์/รายการทั้งหมด (Total Items)
  - Card 2: รายการสถานะ Active
  - Card 3: รายการรอดำเนินการ (Pending)
  - Card 4: มูลค่าทรัพย์สินรวม (Total Value)
- **กราฟ / แผนภูมิ (Charts):**
  - กราฟแท่ง (Bar Chart): จำนวนอุปกรณ์แยกตามหมวดหมู่
  - กราฟวงกลม (Donut Chart): สัดส่วนสถานะการใช้งาน
- **ตาราง Recent Activities:** ประวัติ 5 รายการล่าสุดที่ถูกเพิ่มหรืออัปเดต

---

## 👑 3. หน้าจอที่ 3: หน้าจอผู้ดูแลระบบ (Admin Screen)
*องค์ประกอบสำคัญที่ต้องวาดใน Draw.io:*
- **Header & Breadcrumb:** หน้าหลัก > ผู้ดูแลระบบ > จัดการบัญชีผู้ใช้และระบบ
- **Admin Control Bar:**
  - ปุ่ม "+ เพิ่มผู้ใช้งานใหม่"
  - ปุ่ม "ส่งออกรายงาน (Export CSV/PDF)"
  - ปุ่ม "สำรองฐานข้อมูล (Backup DB)"
- **ตารางผู้ใช้งาน (Users Management Table):**
  - คอลัมน์: ID, Username, ชื่อ-นามสกุล, อีเมล, สิทธิ์ (Role: Admin / User 1 / User 2), สถานะ (Active / Inactive), จัดการ (แก้ไข / ลบ)
- **Modal Popup:** "กำหนดสิทธิ์ผู้ใช้งาน (Edit User Role)" พร้อม Dropdown เลือก Role
- **Modal Confirmation:** "ยืนยันการลบบัญชีผู้ใช้" (Delete Confirmation Modal พร้อมปุ่ม Cancel / Confirm)

---

## 💼 4. หน้าจอที่ 4: หน้าจอผู้ใช้งานระดับ 1 (User Level 1 / Officer Screen)
*องค์ประกอบสำคัญที่ต้องวาดใน Draw.io:*
- **Header:** รายการอุปกรณ์และครุภัณฑ์ (Asset & Item Inventory)
- **Action Toolbar (แถบเครื่องมือที่ต้องมีตามเกณฑ์):**
  - ช่อง Search Input ค้นหาข้อมูลแบบ Real-time
  - Dropdown Filter เลือกตามหมวดหมู่ (Category)
  - Dropdown Filter เลือกตามสถานะ (Status)
  - ปุ่มเด่นสีเขียว: "+ เพิ่มรายการใหม่ (Add New Item)"
- **ตารางข้อมูลหลัก (Data Table):**
  - คอลัมน์: รหัส, รูป/ไฟล์แนบ, ชื่อรายการ, หมวดหมู่, มูลค่า, สถานะ, วันที่บันทึก, การจัดการ (ปุ่ม Edit, ปุ่ม Delete)
- **Pagination Bar (ด้านล่างตาราง):** แสดง "หน้า 1 จาก 5 (ทั้งหมด 48 รายการ)" พร้อมปุ่ม Prev, 1, 2, 3, Next
- **Modal Form "เพิ่ม/แก้ไขรายการ":**
  - Input: รหัสอุปกรณ์, ชื่อรายการ, Dropdown หมวดหมู่, มูลค่า (ตัวเลข)
  - File Input: ช่องลากวางหรือกดเลือกไฟล์แนบ (Upload Attachment) พร้อม Preview
  - ปุ่ม "ยกเลิก" และปุ่ม "บันทึกข้อมูล (Submit)"

---

## 👥 5. หน้าจอที่ 5: หน้าจอผู้ใช้งานระดับ 2 (User Level 2 / Member Screen)
*องค์ประกอบสำคัญที่ต้องวาดใน Draw.io:*
- **Header:** คลังสืบค้นข้อมูลอุปกรณ์และเอกสาร (Member Knowledge & Catalog)
- **Search & Filter:** ค้นหาตามชื่อและหมวดหมู่
- **Layout แสดงผลแบบ Grid Cards หรือ Read-Only Table:**
  - แสดงการ์ดรายการข้อมูลที่เปิดเผยสิทธิ์
  - รูปภาพตัวอย่าง หรือไอคอนประเภทไฟล์แนบ
  - ชื่อรายการ, หมวดหมู่, รหัส
  - ปุ่ม "ดูรายละเอียด (View Details)"
  - ปุ่ม "ดาวน์โหลดไฟล์แนบ (Download Attachment)"
- **สิ่งที่ไม่มีในหน้านี้ (เพื่อแสดงการตัดสิทธิ์ตาม Role):**
  - *ไม่มี* ปุ่มลบ (Delete Button)
  - *ไม่มี* ปุ่มแก้ไขข้อมูลระบบ (Edit System)
  - เมนู Sidebar แสดงเฉพาะเมนูค้นหาและดูประวัติตนเอง
