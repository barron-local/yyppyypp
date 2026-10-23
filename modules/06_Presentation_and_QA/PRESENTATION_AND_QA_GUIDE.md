# 🎤 คู่มือการนำเสนอผลงานและเฉลยแนวคำถามกรรมการ (10 คะแนนเต็ม)
**เกณฑ์ส่วนที่ 5: การนำเสนอและตอบคำถาม (เวลาไม่เกิน 30 นาที, ตอบคำถาม 3 ข้อ 10 นาที)**

---

## ⏱️ 1. โครงสร้างการแบ่งเวลานำเสนอ 30 นาที (Presentation Breakdown)

| ช่วงเวลา | หัวข้อ | ผู้รับผิดชอบหลัก | สิ่งที่ต้องเปิดให้กรรมการดู |
|:---:|---|:---:|---|
| **00:00 - 03:00 (3 นาที)** | **บทนำและภาพรวมระบบ** | หัวหน้าทีม (คนที่ 1) | สไลด์หน้า Use Case Diagram, โครงสร้างสถาปัตยกรรมรวม |
| **03:00 - 09:00 (6 นาที)** | **เครือข่าย & โครงสร้างพื้นฐาน** | คนที่ 1 (Network) | เปิด CLI L3 Switch (VLAN, DHCP Snooping, ACL), DNS Server และ Reverse Proxy HTTPS |
| **09:00 - 15:00 (6 นาที)** | **ฐานข้อมูลและ Backend API** | คนที่ 2 (Backend) | ER-Diagram 3 ตาราง, โค้ด Express (JWT, Multer), ผลการรัน Unit & Integration Test |
| **15:00 - 22:00 (7 นาที)** | **Frontend UI & สิทธิ์ผู้ใช้** | คนที่ 3 (Frontend) | สาธิต Login 3 Roles, CRUD, แนบไฟล์, ค้นหา, Pagination, Confirm Delete Modal |
| **22:00 - 27:00 (5 นาที)** | **DevOps & GitLab CI/CD Pipeline** | คนที่ 2 & 1 | แสดงหน้า GitLab CI/CD Pipeline 4 Stages ที่ผ่านเป็นสีเขียวทั้งหมด, Docker Private Registry |
| **27:00 - 30:00 (3 นาที)** | **สรุปวิธีการทำงานร่วมกันในทีม** | ทั้ง 3 คน | อธิบายการใช้ Git Branch Strategy (`backend`, `frontend`, `devops`, `main`) และ Board แบ่งงาน |

---

## 🤝 2. วิธีนำเสนอ "การทำงานร่วมกันในทีม" ให้ได้ 3 คะแนนเต็ม (เกณฑ์ 5.2)

กรรมการจะให้คะแนนเต็มในส่วนนี้เมื่อทีมแสดงให้เห็นว่า **ทุกคนมีบทบาทชัดเจนและประสานงานกันผ่านเครื่องมือสากล**:
1. **การใช้ Kanban Board / Project Management:**
   - *"ทีมเราใช้ Board ในการกระจายงาน โดยแบ่งงานออกเป็น Sprint ย่อยในช่วง 7 ชั่วโมง เพื่อให้ทุกคนเริ่มงานพร้อมกันได้โดยไม่ต้องรอส่วนอื่นเสร็จ"*
2. **การใช้ Git & Branch Strategy (เกณฑ์ข้อ 4.6):**
   - *"เราแบ่ง Branch ตามความเชี่ยวชาญ ได้แก่ `feature/network-infra`, `feature/backend-api`, `feature/frontend-ui`"*
   - *"ทั้งสองฝั่งทำงานคู่ขนานกันโดยยึด `API_SPECIFICATION.md` (README) เป็นสัญญา (Contract) ระหว่าง Frontend กับ Backend"*
   - *"เมื่อผ่าน Automated Test ในเครื่องตนเอง จึงส่ง Merge Request เข้าสู่ Branch `devops` เพื่อรัน Pipeline ตรวจสอบความถูกต้องก่อน Merge เข้า `main`"*

---

## 🧠 3. เจาะลึกแนวคำถามยอดฮิต 3 ข้อจากกรรมการ พร้อมแนวทางการตอบ (เกณฑ์ 5.1)

### ❓ คำถามที่ 1: ด้าน Backend & Security
> **คำถาม:** "ทำไมถึงเลือกใช้ JWT ในการยืนยันตัวตน และถ้าผู้ใช้ทำการ Logout หรือโดนแบนสิทธิ์ จะทำให้ Token นั้นใช้งานไม่ได้ทันทีได้อย่างไร?"
- **แนวทางการตอบอย่างเซียน:**  
  *"เราเลือกใช้ JWT เนื่องจากเป็น Stateless Authentication เหมาะกับระบบ Microservices และ Web Application ยุคใหม่ ไม่ต้องเก็บ Session ลง RAM ใน Server ทำให้รองรับโหลดได้สูงและปลอดภัยด้วย Digital Signature (HMAC-SHA256)*  
  *กรณีต้องการ Revoke หรือยกเลิก Token ทันทีเมื่อผู้ใช้ Logout หรือถูกระงับสิทธิ์ สามารถทำได้โดย:  
  1. ใช้ Token Blacklist / Denylist เก็บ Token ที่ถูกยกเลิกไว้ใน Redis (พร้อมตั้งค่า TTL ให้ลบอัตโนมัติตาม Expire Time ของ Token)  
  2. หรือใช้วิธี 'Token Version' โดยเก็บคอลัมน์ `token_version` ไว้ที่ตาราง Users เมื่อต้องการตัดสิทธิ์ ให้บวกเลข version เพิ่มขึ้น เมื่อ Token เก่าส่งมา version จะไม่ตรง และถูกปฏิเสธทันทีครับ"*

---

### ❓ คำถามที่ 2: ด้าน Frontend & User Experience (UX/UI)
> **คำถาม:** "ระบบของคุณมีการจัดการ Error Handling ระหว่าง Frontend กับ Backend อย่างไร เพื่อไม่ให้หน้าเว็บค้าง หรือทำให้ผู้ใช้งานสับสนเมื่อเกิดข้อผิดพลาด?"
- **แนวทางการตอบอย่างเซียน:**  
  *"เราออกแบบการสื่อสารผ่าน JSON Response Format ที่มีโครงสร้างชัดเจน `{ status, message, data }`  
  - ฝั่ง Backend จะดักจับ Exception ด้วย Error Middleware แล้วส่ง HTTP Status Code ที่ตรงตามมาตรฐานสากล เช่น 400 ข้อมูลไม่ครบ, 401 ไม่ได้ Login, 403 สิทธิ์ไม่ถึง, 404 ไม่พบข้อมูล  
  - ฝั่ง Frontend เรามีการทำ Client-side Validation ดักข้อมูลเบื้องต้นก่อนส่ง Request  
  - เมื่อเกิด Error จาก Backend ฝั่ง Frontend จะนำ error code หรือ message มาแปลงเป็นภาษาไทยที่เข้าใจง่าย (User-friendly message) ผ่าน Toast Notification และ Error Box ใต้ฟอร์ม โดยไม่มีการปล่อยให้เว็บหมุนค้าง หรือแสดงข้อความดิบทางเทคนิคที่ทำให้ผู้ใช้งานตกใจครับ"*

---

### ❓ คำถามที่ 3: ด้าน DevOps, Network & Troubleshooting
> **คำถาม:** "ถ้าในขั้นตอน CI/CD Pipeline ขั้นตอนที่ 4 (Deploy) เกิดข้อผิดพลาด Failed ขึ้นมา คุณมีกระบวนการตรวจสอบและกู้คืนระบบ (Rollback) อย่างไร และทำไมในระบบเครือข่ายจึงต้องแยก VLAN และมี Reverse Proxy?"
- **แนวทางการตอบอย่างเซียน:**  
  *"กระบวนการตรวจสอบและกู้คืน (Rollback):  
  1. เข้าไปตรวจสอบที่ GitLab CI/CD Pipeline Job Logs เพื่อดูข้อความ Error (เช่น ปัญหา Port Conflict, Database Migration พัง หรือ Container Healthcheck ไม่ผ่าน)  
  2. หากเป็นความผิดพลาดของโค้ดใหม่ เราใช้ฟังก์ชัน Rollback ของ GitLab เพื่อ Redeploy Docker Image Tag ก่อนหน้าจาก Private Registry ซึ่งใช้เวลาเพียงไม่กี่วินาที ระบบก็กลับมาทำงานได้ทันที  
  
  เหตุผลที่ต้องแยก VLAN และมี Reverse Proxy:  
  - การแยก VLAN (Server, Dev, Guest) เป็นการจำกัด Broadcast Domain และเพิ่มความปลอดภัย โดยใช้ ACL ควบคุม ไม่ให้วงภายนอกหรือผู้ใช้ทั่วไปสามารถเข้าถึงเครื่อง Database หรือ Server Management โดยตรงได้  
  - การใช้ Reverse Proxy (NPM/Caddy) ช่วยทำหน้าที่เป็น Single Entry Point สำหรับจัดการ SSL/HTTPS รวมศูนย์, ทำ URL Rewriting, ซ่อนพอร์ตจริงของแอปพลิเคชันภายใน และช่วยทำ Load Balancing เมื่อมีผู้ใช้งานจำนวนมากครับ"*
