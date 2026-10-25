# คู่มือการติดตั้ง รันโปรเจกต์ และรันการทดสอบ (DevOps Asset Center - React & Node.js)
> เอกสารฉบับสมบูรณ์สำหรับผู้เข้าแข่งขันและคณะกรรมการตรวจผลงาน
> Frontend: React 18 (Vite, Tailwind CSS, Lucide Icons)
> Backend: Node.js Express (RESTful API, JWT, RBAC 3 Roles, File Upload)

---

## 1. ข้อมูลผู้ใช้งานสำหรับทดสอบสิทธิ์ (RBAC 3 ระดับ)
* **รหัสผ่านของทุก User:** `Password123!`

| ลำดับ | บทบาท (Role) | Username | รหัสผ่าน | ขอบเขตสิทธิ์การใช้งานจริง |
| :---: | :--- | :---: | :---: | :--- |
| 1 | **Admin** | `admin` | `Password123!` | สิทธิ์สูงสุด: ดูข้อมูล, เพิ่มข้อมูล, แนบไฟล์, แก้ไข, **ลบข้อมูล (มี Modal ยืนยัน)** |
| 2 | **User 1 (Officer)** | `officer1` | `Password123!` | เจ้าหน้าที่: ดูข้อมูล, **เพิ่มข้อมูลพร้อมแนบไฟล์**, **แก้ไขข้อมูล**, *(ไม่มีปุ่มลบ/ห้ามลบ)* |
| 3 | **User 2 (Member)** | `user2` | `Password123!` | สมาชิก: **ดูข้อมูล (Read-Only)**, ค้นหา, กรองหมวดหมู่, **ดาวน์โหลดไฟล์แนบ** |

---

## 2. วิธีการรันโปรเจกต์ (Step-by-Step)

### วิธีที่ 1: รันด้วย Docker Compose (แนะนำสำหรับเซิร์ฟเวอร์ DevOps)
วิธีนี้เป็นการรันระบบเต็มรูปแบบ (Containerized App + Database + Network) ตามเกณฑ์ข้อ 2.5:
```bash
# 1. เข้าไปที่โฟลเดอร์โปรเจกต์
cd devops-exam-project

# 2. สั่ง Build Image และรัน Container ทั้งหมดในโหมด Background
docker compose up -d --build

# 3. ตรวจสอบสถานะการทำงานของ Container
docker ps
```
* **เข้าใช้งานเว็บแอปพลิเคชัน:** `http://localhost:3000`
* **หากต้องการปิดระบบ:** `docker compose down`

---

### วิธีที่ 2: รันแยกทีละส่วน (Local Development Mode)

#### ขั้นตอนที่ 1: ติดตั้งและรัน Backend API (พอร์ต 3000)
เปิด Terminal หน้าต่างที่ 1:
```bash
cd devops-exam-project/backend

# ติดตั้ง Dependencies
npm install

# รันเซิร์ฟเวอร์ในโหมด Watch
npm run dev
```
* หน้าจอจะแสดง: `DevOps Server running on http://localhost:3000`
* ทดสอบ Health Check ผ่านเบราว์เซอร์: `http://localhost:3000/api/health`

#### ขั้นตอนที่ 2: ติดตั้งและรัน Frontend (พอร์ต 5173)
เปิด Terminal หน้าต่างที่ 2:
```bash
cd devops-exam-project/frontend

# ติดตั้ง Dependencies
npm install

# รัน Frontend Dev Server
npm run dev
```
* เปิดเบราว์เซอร์เข้าไปที่: `http://localhost:5173` (ระบบมี Reverse Proxy ส่ง Request ไปยัง Backend อัตโนมัติ)

---

## 3. วิธีการรันชุดทดสอบ (Automated Testing)

โปรเจกต์มีระบบ Automated Testing ครบทั้ง **Unit Tests**, **Integration Tests** และ **RBAC Security Tests** ตามเกณฑ์ข้อ 4.6 (หน้า 17 ใน PDF)

### คำสั่งรันเทส:
เปิด Terminal ในโฟลเดอร์ `backend`:
```bash
cd devops-exam-project/backend
npm test
```

### สิ่งที่ระบบจะทำการทดสอบอัตโนมัติ (10 Test Cases):
1. **Unit Tests:**
   - `UNIT-001`: ทดสอบการแฮชและเปรียบเทียบรหัสผ่านด้วย `bcryptjs`
   - `UNIT-002`: ทดสอบการสร้างและถอดรหัส Payload ใน `Signed JWT Token`
2. **Integration Tests:**
   - `INT-001`: ทดสอบ Login API (POST /api/auth/login) ส่งคืน Token สถานะ `200 OK`
   - `INT-002`: ทดสอบการป้องกัน Endpoint ถ้าไม่ส่ง Token ระบบต้องตอบ `401 Unauthorized`
   - `INT-003`: ทดสอบดึงรายการข้อมูล (GET /api/items) เมื่อแนบ Token ต้องตอบ `200 OK`
3. **RBAC Security Tests (ตรวจสิทธิ์ 3 ระดับ):**
   - `RBAC-001`: ทดสอบล็อกอินครบ 3 Roles และตรวจสอบ Payload ใน Token
   - `RBAC-002`: ทดสอบ Officer (User 1) สร้างข้อมูลใหม่ได้สำเร็จ (`201 Created`)
   - `RBAC-003`: ทดสอบ Member (User 2) แอบสร้างข้อมูล ระบบต้องบล็อกด้วยสถานะ `403 Forbidden`
   - `RBAC-004`: ทดสอบ User 1 และ User 2 พยายามลบข้อมูล ระบบต้องบล็อกด้วยสถานะ `403 Forbidden`
   - `RBAC-005`: ทดสอบ Admin ลบข้อมูล ระบบอนุญาตและตอบสถานะ `200 OK`

---

## 4. โครงสร้าง RESTful API สรุปสำหรับตรวจงาน
| Method | Endpoint | สิทธิ์เข้าถึง | คำอธิบาย |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | ทุกคน | เข้าสู่ระบบ ตรวจสอบ bcrypt และรับ JWT Token |
| `GET` | `/api/auth/me` | ทุกคนที่มี Token | ดูข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบัน |
| `GET` | `/api/categories` | ทุกคนที่มี Token | ดึงรายการหมวดหมู่อุปกรณ์ (3 หมวดหมู่) |
| `GET` | `/api/items` | ทุกคนที่มี Token | ดึงรายการข้อมูล (รองรับ Search, Filter, Pagination) |
| `GET` | `/api/items/:id` | ทุกคนที่มี Token | ดึงรายละเอียดข้อมูลเดี่ยวตาม ID |
| `POST` | `/api/items` | Admin, User 1 | เพิ่มรายการใหม่พร้อมอัปโหลดไฟล์แนบ (User 2 โดน 403) |
| `PUT` | `/api/items/:id` | Admin, User 1 | แก้ไขข้อมูลและเปลี่ยนไฟล์แนบ (User 2 โดน 403) |
| `DELETE` | `/api/items/:id` | Admin เท่านั้น | ลบรายการข้อมูลออกจากระบบ (User 1, User 2 โดน 403) |
