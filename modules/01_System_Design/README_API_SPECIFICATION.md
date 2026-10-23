# 📡 RESTful API Specification (README.md)
**ระบบบริหารจัดการข้อมูลและเทคโนโลยีสารสนเทศ (DevOps Competition API)**  
*สอดคล้องเกณฑ์การให้คะแนนข้อ 4.4 (คะแนนเต็ม 5 คะแนน)*

เอกสารข้อกำหนด API นี้ถูกออกแบบตามมาตรฐาน RESTful Architecture รองรับการรักษาความปลอดภัยด้วย **JSON Web Token (JWT)** และการจัดการสถานะ HTTP Status Code สากล

---

## 🔒 1. นโยบายความปลอดภัยและการยืนยันตัวตน (Security & Authentication)

- **Authentication Scheme:** `Bearer Token` ผ่าน HTTP Header `Authorization`
- **Header Format:** `Authorization: Bearer <JWT_TOKEN>`
- **Token Payload:**
  ```json
  {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "iat": 1710000000,
    "exp": 1710086400
  }
  ```
- **Role-based Access Control (RBAC):**
  - `admin`: มีสิทธิ์ทุกฟังก์ชัน (CRUD ทั้งหมด, จัดการ User, จัดการ Category)
  - `user1` (Officer): มีสิทธิ์ดู, เพิ่ม, แก้ไขข้อมูล และอัปโหลดไฟล์
  - `user2` (Member): มีสิทธิ์ดูข้อมูล (GET) และค้นหาข้อมูลเท่านั้น

---

## 📦 2. โครงสร้าง Response Body มาตรฐาน (Standard Response Format)

ระบบกำหนดให้ทุก Response ส่งกลับมาในโครงสร้าง JSON แบบสม่ำเสมอ:

### 2.1 กรณีสำเร็จ (Success Response)
```json
{
  "status": "success",
  "message": "ดำเนินการสำเร็จ",
  "data": { ... }
}
```

### 2.2 กรณีผิดพลาด (Error Response)
```json
{
  "status": "error",
  "message": "คำอธิบายข้อผิดพลาดที่เข้าใจง่าย",
  "errors": [ ... ]
}
```

### 2.3 ตาราง HTTP Status Codes ที่รองรับ
| Status Code | ความหมาย | สถานการณ์ที่ใช้งาน |
|---|---|---|
| **200 OK** | สำเร็จ | ดึงข้อมูล (GET), อัปเดตข้อมูล (PUT/PATCH), ลบข้อมูล (DELETE) |
| **201 Created** | สร้างสำเร็จ | สร้างข้อมูลใหม่ (POST), อัปโหลดไฟล์สำเร็จ |
| **400 Bad Request** | ข้อมูลนำเข้าไม่ถูกต้อง | ข้อมูลใน Body ไม่ครบถ้วนหรือไม่ตรงตาม Validation |
| **401 Unauthorized** | ไม่ได้รับอนุญาต / ไม่ได้ Login | ไม่ส่ง Token หรือ Token ไม่ถูกต้อง / หมดอายุ |
| **403 Forbidden** | ไม่มีสิทธิ์เข้าถึงส่วนนี้ | Role ผู้ใช้งานไม่ตรงกับเงื่อนไขของ Endpoint |
| **404 Not Found** | ไม่พบข้อมูล | ค้นหา ID ที่ไม่มีอยู่ในฐานข้อมูล |
| **500 Internal Error**| เซิร์ฟเวอร์ขัดข้อง | เกิดข้อผิดพลาดของ Database หรือ Logic ในเซิร์ฟเวอร์ |

---

## 🛣️ 3. สรุป Endpoint ทั้งหมด (Endpoints Summary)

| Method | Endpoint | สิทธิ์เข้าถึง (Access) | คำอธิบาย |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | เข้าสู่ระบบ และรับ JWT Token |
| `GET` | `/api/auth/me` | Logged In | ตรวจสอบข้อมูลผู้ใช้ปัจจุบันจาก Token |
| `GET` | `/api/categories` | Logged In | ดึงรายการหมวดหมู่ทั้งหมด |
| `POST` | `/api/categories` | `admin` | เพิ่มหมวดหมู่ใหม่ |
| `GET` | `/api/items` | `admin`, `user1`, `user2` | ดึงรายการข้อมูล (รองรับ Search, Filter, Pagination) |
| `GET` | `/api/items/:id` | `admin`, `user1`, `user2` | ดูรายละเอียดรายการข้อมูลตาม ID |
| `POST` | `/api/items` | `admin`, `user1` | เพิ่มรายการใหม่ พร้อมรองรับอัปโหลดไฟล์ (Multipart) |
| `PUT` | `/api/items/:id` | `admin`, `user1` | แก้ไขข้อมูลและเปลี่ยนไฟล์แนบ |
| `DELETE` | `/api/items/:id` | `admin` | ลบรายการข้อมูล |

---

## 📝 4. รายละเอียด Endpoint และตัวอย่าง Request / Response

### 4.1 เข้าสู่ระบบ (POST /api/auth/login)
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Request Body (JSON):**
  ```json
  {
    "username": "officer1",
    "password": "Password123!"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "เข้าสู่ระบบสำเร็จ",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 2,
        "username": "officer1",
        "full_name": "IT Officer",
        "role": "user1"
      }
    }
  }
  ```
- **Response Error (401 Unauthorized):**
  ```json
  {
    "status": "error",
    "message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
  }
  ```

---

### 4.2 ดึงรายการข้อมูล พร้อม Search, Filter, Pagination (GET /api/items)
- **Method:** `GET`
- **URL:** `/api/items?search=cisco&category_id=1&page=1&limit=10`
- **Query Parameters:**
  - `search` *(optional)*: คำค้นหา (รหัส หรือ ชื่อรายการ)
  - `category_id` *(optional)*: กรองตามรหัสหมวดหมู่
  - `page` *(optional, default: 1)*: ลำดับหน้า
  - `limit` *(optional, default: 10)*: จำนวนรายการต่อหน้า
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "ดึงข้อมูลสำเร็จ",
    "data": {
      "items": [
        {
          "id": 1,
          "category_id": 1,
          "category_name": "Network Equipment",
          "item_code": "NET-001",
          "title": "Cisco Catalyst 3750 L3 Switch",
          "value_amount": 15000.00,
          "status": "active",
          "attachment_name": "manual_cisco3750.pdf",
          "created_at": "2026-10-22T10:00:00.000Z"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 1,
        "totalItems": 1,
        "limit": 10
      }
    }
  }
  ```

---

### 4.3 ดูรายละเอียดรายการเดี่ยว (GET /api/items/:id)
- **Method:** `GET`
- **URL:** `/api/items/1`
- **Response Success (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "item_code": "NET-001",
      "title": "Cisco Catalyst 3750 L3 Switch",
      "description": "สวิตช์ L3 สำหรับทำ Inter-VLAN",
      "value_amount": 15000.00,
      "attachment_name": "manual_cisco3750.pdf",
      "attachment_url": "/uploads/manual_cisco3750.pdf"
    }
  }
  ```
- **Response Error (404 Not Found):**
  ```json
  {
    "status": "error",
    "message": "ไม่พบข้อมูลรายการที่ระบุ (ID: 999)"
  }
  ```

---

### 4.4 สร้างรายการใหม่พร้อมอัปโหลดไฟล์ (POST /api/items)
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Form Data Fields:**
  - `item_code`: `SRV-002` (string, required)
  - `category_id`: `2` (number, required)
  - `title`: `Storage Server NAS 8TB` (string, required)
  - `description`: `เซิร์ฟเวอร์เก็บข้อมูลสำรอง` (string, optional)
  - `value_amount`: `32000.00` (number, required)
  - `file`: `[binary data]` (file, optional)
- **Response Success (201 Created):**
  ```json
  {
    "status": "success",
    "message": "บันทึกข้อมูลสำเร็จ",
    "data": {
      "id": 4,
      "item_code": "SRV-002",
      "title": "Storage Server NAS 8TB",
      "attachment_name": "spec_nas.pdf"
    }
  }
  ```
- **Response Error (400 Bad Request):**
  ```json
  {
    "status": "error",
    "message": "ข้อมูลไม่ครบถ้วน กรุณากรอก item_code และ title"
  }
  ```

---

### 4.5 แก้ไขข้อมูลและเปลี่ยนไฟล์แนบ (PUT /api/items/:id)
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` หรือ `application/json`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "ปรับปรุงข้อมูลสำเร็จ",
    "data": {
      "id": 1,
      "title": "Cisco Catalyst 3750-X Updated",
      "attachment_name": "updated_manual.pdf"
    }
  }
  ```

---

### 4.6 ลบข้อมูล (DELETE /api/items/:id)
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <TOKEN>` (ต้องเป็น `admin`)
- **Response Success (200 OK):**
  ```json
  {
    "status": "success",
    "message": "ลบข้อมูลรหัส NET-001 สำเร็จ"
  }
  ```
- **Response Error (403 Forbidden):**
  ```json
  {
    "status": "error",
    "message": "คุณไม่มีสิทธิ์ในการลบข้อมูล (เฉพาะ Admin เท่านั้น)"
  }
  ```
