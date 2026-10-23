# DevOps Skills Competition Preparation Workspace (รายการที่ 58)
**ทักษะเทคโนโลยีสารสนเทศด้านโปรแกรมและเครือข่ายด้วยกระบวนการ DevOps (ระดับ ปวส.)**

โปรเจกต์นี้ได้รับการจัดโครงสร้างอย่างเป็นระเบียบตามข้อกำหนด โดยแยกไฟล์ Vite React App ออกมาไว้ที่ Root เพื่อให้สั่งรันและพัฒนาได้ทันที และรวมโมดูลเอกสารและโค้ดฝึกซ้อม (01-06) ไว้ในโฟลเดอร์ `modules/`

---

## 1. การเปิดใช้งานเว็บไซต์คู่มือ (Notion-Style Vite Guidebook)

เว็บไซต์คู่มือสร้างขึ้นด้วย **Bun + Vite + React** มีระบบ Responsive รองรับทุกขนาดหน้าจอ และไม่มี Emoji:

- เข้าชมผ่าน Local Dev Server: [http://localhost:5173/](http://localhost:5173/)
- สั่งรันด้วยตนเองผ่าน Terminal:
  ```bash
  bun run dev
  ```
- ทดสอบ Build Production:
  ```bash
  bun run build
  ```

---

## 2. โครงสร้างโฟลเดอร์ที่เป็นระเบียบ (Workspace Structure)

```text
c:\Users\Woradech\Desktop\yypp\
├── index.html                  # ไฟล์เริ่มต้นของ Vite React Application
├── package.json                # Dependencies ของเว็บคู่มือ (React, Lucide, Vite)
├── vite.config.js              # การตั้งค่า Vite Server
├── src/                        # ซอร์สโค้ด React App (Notion-style, Responsive)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── modules/                    # คลังรวมเอกสารและโปรเจกต์ฝึกซ้อม (01 - 06)
│   ├── 01_System_Design/       # Flowcharts 5 รูป, Database Schema, API Spec README.md, Wireframes
│   ├── 02_Network_and_Security/# คำสั่ง Cisco L3 Switch (VLAN, SVI, DHCP, NAT, ACL, Loop Protection)
│   ├── 03_Linux_and_DevOps_Infra/# Ubuntu VM setup, Technitium DNS, Reverse Proxy, .gitlab-ci.yml
│   ├── 04_Fullstack_DevOps_App/# Full-Stack Express (JWT, Multer, Roles) + Automated Tests (Supertest)
│   ├── 05_IoT_MQTT_NodeRED/    # ESP32 Firmware, Mosquitto MQTT, Node-RED Dashboard
│   └── 06_Presentation_and_QA/ # สคริปต์นำเสนอ 30 นาที และแนวทางตอบคำถาม 3 ข้อ
├── devops_master_notion.html   # ไฟล์ HTML แบบ Standalone เปิดดูออฟไลน์ได้โดยตรง
└── รายการที่ 58 ทักษะเทคโนโลยีสารสนเทศด้านโปร.pdf # ไฟล์เกณฑ์การแข่งขันทางการ
```

---

## 3. การทดสอบ Full-Stack Application & Automated Tests

- รันเซิร์ฟเวอร์ Backend:
  ```bash
  node modules/04_Fullstack_DevOps_App/backend/server.js
  ```
  *(เข้าใช้งานผ่านเบราว์เซอร์ที่ http://localhost:3000)*

- รันชุดการทดสอบ Automated Unit & Integration Tests:
  ```bash
  cd modules/04_Fullstack_DevOps_App
  npm test
  ```
  *(ผลการทดสอบ: ผ่านครบ 5/5 Test Cases 100%)*
