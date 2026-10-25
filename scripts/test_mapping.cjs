const fs = require('fs');

async function main() {
  const mod = await import('../src/data/examQuestionsAndSolutions.js');
  const items = mod.examQuestionsAndSolutions;
  console.log('Original items:', items.length);

  // Mapping dictionary for executionPhase, phaseName, executionStep, execOrderDesc
  const phaseMeta = {
    1: { id: 'phase-1', name: 'Phase 1: โครงสร้างเครือข่ายกายภาพและสวิตช์ L3' },
    2: { id: 'phase-2', name: 'Phase 2: เซิร์ฟเวอร์เสมือนและระบบปฏิบัติการหลัก' },
    3: { id: 'phase-3', name: 'Phase 3: ความปลอดภัยและการรีโมตเซิร์ฟเวอร์' },
    4: { id: 'phase-4', name: 'Phase 4: ระบบชื่อโดเมนภายใน (Technitium DNS & ACL)' },
    5: { id: 'phase-5', name: 'Phase 5: แพลตฟอร์ม DevOps & Git Central (Docker, GitLab & Registry)' },
    6: { id: 'phase-6', name: 'Phase 6: การออกแบบสถาปัตยกรรมระบบและ UI Wireframe' },
    7: { id: 'phase-7', name: 'Phase 7: พัฒนาฐานข้อมูลและระบบหลังบ้าน (Database & Backend API)' },
    8: { id: 'phase-8', name: 'Phase 8: พัฒนาระบบหน้าบ้านและการทดสอบ (Frontend UI & Testing)' },
    9: { id: 'phase-9', name: 'Phase 9: อัตโนมัติ CI/CD Pipeline และขึ้นสู่ Production' },
    10: { id: 'phase-10', name: 'Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ' }
  };

  const stepMapping = {
    // Phase 1: Network & Switch L3
    'c1': { step: 1, phase: 1, desc: 'เริ่มทำก่อนอันดับแรก: สร้าง VLAN 10 (server), 20 (dev), 30 (guest) บน Cisco Switch' },
    'c2_1': { step: 2, phase: 1, desc: 'กำหนด SVI IP Interface เป็น Default Gateway ให้แต่ละ VLAN' },
    'c2_2': { step: 3, phase: 1, desc: 'เปิดคำสั่ง ip routing เพื่อให้แต่ละ VLAN สื่อสารข้ามวงกันได้' },
    'c3_1': { step: 4, phase: 1, desc: 'สร้าง DHCP Pool แจก IP ให้กับ VLAN Dev หรือ Server' },
    'c3_2': { step: 5, phase: 1, desc: 'สร้าง DHCP Pool แจก IP ให้ครบทั้ง 2 VLAN (Dev และ Server)' },
    'c3_3': { step: 6, phase: 1, desc: 'เปิด DHCP Snooping และกำหนด Trust Port เพื่อป้องกัน Rogue DHCP' },
    'c4': { step: 7, phase: 1, desc: 'ตั้งค่า NAT เพื่อให้ทุก VLAN ออกสู่เครือข่ายภายนอก/เครือข่ายกรรมการได้' },
    'c5_1': { step: 8, phase: 1, desc: 'สร้าง Standard ACL ควบคุมทราฟฟิกเครือข่ายพื้นฐาน' },
    'c5_2': { step: 9, phase: 1, desc: 'สร้าง Extended ACL อนุญาตเฉพาะ Service ที่กำหนด (SSH, HTTP, DNS)' },
    'c5_3': { step: 10, phase: 1, desc: 'นำ ACL ไป Apply ผูกกับ Interface เพื่อป้องกันการเข้าถึง Server โดยไม่ได้รับอนุญาต' },
    'c5_4': { step: 11, phase: 1, desc: 'ตั้งค่า ACL จำกัดการเข้าถึง Management VLAN เฉพาะเครื่องผู้ดูแล' },
    'c5_5': { step: 12, phase: 1, desc: 'ตั้งค่า Spanning Tree (PortFast / BPDU Guard) ป้องกันการเกิด Loop บน Switch' },

    // Phase 2: Virtualization & Base OS
    'c6_1': { step: 13, phase: 2, desc: 'เปิดใช้งาน Hypervisor (Proxmox VE / VMware) เข้าสู่หน้าต่าง Web/GUI' },
    'c6_2': { step: 14, phase: 2, desc: 'สร้างเครื่องเสมือน VM (devops-server) สเปก 2 vCPU, RAM 4GB, Disk 32GB' },
    'c6_3': { step: 15, phase: 2, desc: 'กำหนด IP Address ของ Hypervisor โฮสต์ให้ถูกต้องตามผัง' },
    'c7_1': { step: 16, phase: 2, desc: 'ติดตั้ง Ubuntu Server และตั้งค่า On-Boot Autostart ให้ VM บูตอัตโนมัติ' },
    'c7_2': { step: 17, phase: 2, desc: 'กำหนด Static IP ให้ Ubuntu Server ด้วย Netplan (192.168.10.10/24)' },
    'c7_3': { step: 18, phase: 2, desc: 'ตั้งค่า Hostname (devops-server) และแก้ไขแมปชื่อใน /etc/hosts' },

    // Phase 3: Remote Management & Hardening
    'c9_1': { step: 19, phase: 3, desc: 'ติดตั้งและเปิดบริการ OpenSSH Server บนระบบ' },
    'c9_2': { step: 20, phase: 3, desc: 'เพิ่มผู้ใช้ 2 คนในระบบ (devops และ auditor) พร้อมสร้าง Home Directory' },
    'c9_3': { step: 21, phase: 3, desc: 'กำหนดพอร์ต SSH และทดสอบ Remote เชื่อมต่อเข้ามาจากเครื่อง Client' },
    'c9_4': { step: 22, phase: 3, desc: 'ตั้งค่า UFW Firewall เปิดเฉพาะพอร์ตที่จำเป็น (22, 80, 443, 53, 5000, 2222, 5380)' },
    'c9_5': { step: 23, phase: 3, desc: 'กำหนดสิทธิ์ Sudoers ให้ผู้ใช้ devops สามารถ sudo -i โดยไม่ต้องถามรหัสผ่าน' },

    // Phase 4: DNS Server & ACL Control
    'c8_1': { step: 24, phase: 4, desc: 'ปลดล็อกพอร์ต 53 บน Ubuntu และรัน Technitium DNS Container พร้อมสร้าง Zone และ A Records' },
    'c8_2': { step: 25, phase: 4, desc: 'ตั้งค่า DNS ACL (Restricted) ให้ยอมรับ Query เฉพาะ Subnet ที่ได้รับอนุญาตเท่านั้น' },

    // Phase 5: DevOps Platform (Docker, GitLab & Registry)
    'c10_1': { step: 26, phase: 5, desc: 'ติดตั้ง Docker Engine และ Docker Compose Plugin พร้อมเพิ่ม user เข้า docker group' },
    'c10_2': { step: 27, phase: 5, desc: 'รัน GitLab Community Edition (CE) Container และตรวจสอบการเข้าถึงหน้าเว็บ' },
    'c10_3': { step: 28, phase: 5, desc: 'ดึงรหัสผ่านเริ่มต้นของ root และสร้างผู้ใช้ใหม่ใน GitLab Admin Area' },
    'c11_2': { step: 29, phase: 5, desc: 'ติดตั้ง Caddy Reverse Proxy ด้วย tls internal และ Export Root CA ไปติดตั้งบนเครื่อง Client' },
    'c11_3': { step: 30, phase: 5, desc: 'คอนฟิก Caddyfile กระจาย HTTPS ไปยังแต่ละบริการ (gitlab, registry, dns, app, api)' },

    // Phase 6: System Architecture & UI Wireframe
    'c13_1': { step: 31, phase: 6, desc: 'จัดทำผังงาน (Flowchart) ระบบเข้าสู่ระบบ (Login Flow)' },
    'c13_2': { step: 32, phase: 6, desc: 'จัดทำผังงานกระบวนการทำงานของผู้ดูแลระบบ (Admin Flow)' },
    'c13_3': { step: 33, phase: 6, desc: 'จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 1 (Officer Flow)' },
    'c13_4': { step: 34, phase: 6, desc: 'จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 2 (User Read-Only Flow)' },
    'c13_5': { step: 35, phase: 6, desc: 'จัดทำภาพรวมผังงานระบบทั้งหมด (Overview Usecase Diagram)' },
    'c14_1': { step: 36, phase: 6, desc: 'ออกแบบฐานข้อมูลสร้างตารางอย่างน้อย 3 ตาราง (users, roles, items/documents)' },
    'c14_2': { step: 37, phase: 6, desc: 'ออกแบบความสัมพันธ์ระหว่างตาราง (Relational Design: Foreign Keys, 1:M)' },
    'c14_3': { step: 38, phase: 6, desc: 'เลือกใช้ชนิดข้อมูล (Data Types: VARCHAR, INT, TIMESTAMP) ได้ถูกต้องเหมาะสม' },
    'c14_4': { step: 39, phase: 6, desc: 'จัดทำ Class Diagram แสดง Entity, Attributes และ Methods ของระบบ' },
    'c14_5': { step: 40, phase: 6, desc: 'ตั้งชื่อตารางและฟิลด์ตามมาตรฐานทางเทคนิค (snake_case, สื่อความหมาย)' },
    'c15_1': { step: 41, phase: 6, desc: 'ออกแบบ Wireframe หน้าจอผู้ดูแลระบบด้วย Draw.io' },
    'c15_2': { step: 42, phase: 6, desc: 'ออกแบบ Wireframe หน้าจอผู้ใช้งานระดับ 1 ด้วย Draw.io' },
    'c15_3': { step: 43, phase: 6, desc: 'ออกแบบ Wireframe หน้าจอผู้ใช้งานระดับ 2 ด้วย Draw.io' },
    'c15_4': { step: 44, phase: 6, desc: 'ออกแบบ Wireframe หน้าจอหลักของระบบ (Dashboard / Overview) ด้วย Draw.io' },
    'c15_5': { step: 45, phase: 6, desc: 'ออกแบบ Wireframe หน้าจอเข้าสู่ระบบ (Login Screen) ด้วย Draw.io' },
    'c16_1': { step: 46, phase: 6, desc: 'ออกแบบ RESTful API Spec ใช้ HTTP Methods (GET, POST, PUT, DELETE) ถูกต้อง' },
    'c16_2': { step: 47, phase: 6, desc: 'ตั้งชื่อ Endpoint สื่อความหมายและสอดคล้องตามมาตรฐาน REST' },
    'c16_3': { step: 48, phase: 6, desc: 'ระบุตัวอย่าง Response Body JSON สอดคล้องกับ HTTP Status Code' },
    'c16_4': { step: 49, phase: 6, desc: 'ออกแบบ Error Response รูปแบบมาตรฐาน (400, 401, 403, 404, 500)' },
    'c16_5': { step: 50, phase: 6, desc: 'จัดทำเอกสารข้อกำหนด API (API Spec / README.md) ครบถ้วนชัดเจน' },

    // Phase 7: Database & Backend API
    'c17_1': { step: 51, phase: 7, desc: 'สร้างฐานข้อมูลจริงและเขียนโค้ด Backend เชื่อมต่อ Database MySQL/MariaDB สำเร็จ' },
    'c17_2': { step: 52, phase: 7, desc: 'พัฒนาระบบ Authentication: Hash รหัสผ่านด้วย bcrypt และออก JWT Token' },
    'c17_3': { step: 53, phase: 7, desc: 'พัฒนา CRUD APIs จัดการข้อมูลหลัก (เพิ่ม, ดู, แก้ไข, ลบรายการ)' },
    'c17_4': { step: 54, phase: 7, desc: 'พัฒนาระบบอัปโหลดและแนบไฟล์ (Multer file upload) ตรวจสอบชนิดไฟล์' },
    'c17_5': { step: 55, phase: 7, desc: 'พัฒนาระบบตรวจสอบสิทธิ์ Role-Based Access Control (RBAC 3 สิทธิ์)' },
    'c17_6': { step: 56, phase: 7, desc: 'พัฒนา API สำหรับค้นหาและกรองข้อมูล (Search & Filter Queries)' },
    'c17_7': { step: 57, phase: 7, desc: 'พัฒนา API สำหรับแบ่งหน้า (Pagination) และจัดเรียงข้อมูล (Sorting)' },
    'c17_8': { step: 58, phase: 7, desc: 'เขียน Data Validation ฝั่ง Backend และจัดการ Error อย่างเป็นระบบ' },
    'c17_9': { step: 59, phase: 7, desc: 'จัดโครงสร้างโค้ด Backend แบบ Modular Router แยก Controllers และ Services' },
    'c17_10': { step: 60, phase: 7, desc: 'ติดตั้ง Middleware ความปลอดภัย (Helmet, CORS, Rate Limit) ป้องกันการโจมตี' },

    // Phase 8: Frontend UI & Testing
    'c18_1': { step: 61, phase: 8, desc: 'พัฒนา Frontend UI Responsive รองรับทั้งจอ Desktop และ Mobile' },
    'c18_2': { step: 62, phase: 8, desc: 'พัฒนาหน้าจอ Login ฟอร์มเชื่อมต่อ API และจัดเก็บ JWT Token' },
    'c18_3': { step: 63, phase: 8, desc: 'ควบคุมการแสดงผลและเส้นทาง (Routing) แยกตาม Role สิทธิ์ของผู้ใช้งาน' },
    'c18_4': { step: 64, phase: 8, desc: 'พัฒนาฟอร์มเพิ่มข้อมูลครบถ้วนตาม Schema ที่ออกแบบไว้' },
    'c18_5': { step: 65, phase: 8, desc: 'พัฒนาฟังก์ชันแนบไฟล์ประกอบการบันทึกข้อมูล' },
    'c18_6': { step: 66, phase: 8, desc: 'พัฒนาฟอร์ม Modal สำหรับแก้ไขและปรับปรุงข้อมูล' },
    'c18_7': { step: 67, phase: 8, desc: 'พัฒนาฟังก์ชันแก้ไขและอัปเดตไฟล์แนบ' },
    'c18_8': { step: 68, phase: 8, desc: 'พัฒนากล่องยืนยันการลบข้อมูล (Confirmation Dialog) เพื่อความปลอดภัย' },
    'c18_9': { step: 69, phase: 8, desc: 'พัฒนาช่องค้นหาและกรองข้อมูลบนตาราง UI แบบ Real-time' },
    'c18_10': { step: 70, phase: 8, desc: 'พัฒนาปุ่มเปลี่ยนหน้า Pagination บนตาราง UI' },
    'c18_11': { step: 71, phase: 8, desc: 'เขียน Form Validation ฝั่ง Frontend ป้องกันการส่งข้อมูลผิดพลาด' },
    'c18_12': { step: 72, phase: 8, desc: 'เขียน Error Handling แสดง Notification แจ้งผู้ใช้งานอย่างสุภาพ' },
    'c18_13': { step: 73, phase: 8, desc: 'เขียนฟังก์ชันแปลง Error จาก Backend เป็นข้อความที่ผู้ใช้เข้าใจง่าย' },
    'c21': { step: 74, phase: 8, desc: 'จัดการ Git Branch Strategy: แยก main, backend, frontend, devops อย่างเป็นระบบ' },
    'c20': { step: 75, phase: 8, desc: 'เขียนและทดสอบ E2E Tests: E2E-001 (Login สำเร็จ) และ E2E-002 (บันทึกข้อมูลสำเร็จ)' },
    'c22': { step: 76, phase: 8, desc: 'ตรวจสอบความสมบูรณ์ ความถูกต้อง และความลื่นไหลของระบบ Application ทั้งหมด' },

    // Phase 9: CI/CD Pipeline & Production Deployment
    'c11_1': { step: 77, phase: 9, desc: 'เขียน Dockerfile แบบ Multi-stage build สำหรับแอปพลิเคชันเพื่อลดขนาดอิมเมจ' },
    'c18_14': { step: 78, phase: 9, desc: 'เขียน Dockerfile สำหรับ Backend Service ให้พร้อมสำหรับรันบนคอนเทนเนอร์' },
    'c11_4': { step: 79, phase: 9, desc: 'เขียน docker-compose.yaml รวม services (app, db, phpmyadmin, registry) บน Production' },
    'c12_1': { step: 80, phase: 9, desc: 'เขียน .gitlab-ci.yml กำหนด 4 Stages ครบถ้วน: build, test, push, deploy' },
    'c18_15': { step: 81, phase: 9, desc: 'ทดสอบ Pipeline config ทั้ง 4 stages ให้ทำงานเชื่อมโยงกันอย่างสมบูรณ์' },
    'c19_1': { step: 82, phase: 9, desc: 'ตั้งค่า Auto Trigger ให้ Pipeline เริ่มทำงานอัตโนมัติเมื่อมีการ Git Push' },
    'c12_2': { step: 83, phase: 9, desc: 'ทดสอบ Git Push โค้ดขึ้น GitLab แล้วตรวจสอบว่าเกิด Trigger ทำงานทันที' },
    'c19_2': { step: 84, phase: 9, desc: 'รัน Automated Unit & Integration Tests ใน Pipeline ให้ผ่าน 100%' },
    'c12_3': { step: 85, phase: 9, desc: 'เฝ้าดูและตรวจสอบผล Pipeline ให้แสดงผล Passed สีเขียวครบทั้ง 4 Stages!' },
    'c12_4': { step: 86, phase: 9, desc: 'ตรวจสอบ Docker Image ที่ถูกสร้างขึ้นใน Private Registry ผ่าน API curl /v2/_catalog' },

    // Phase 10: IoT (ถ้ามี) & Presentation
    'c23_1': { step: 87, phase: 10, desc: 'ซ้อมตอบคำถามกรรมการชุดที่ 1 ด้าน Backend Architecture & Logic (ไม่เกิน 5 นาที)' },
    'c23_2': { step: 88, phase: 10, desc: 'ซ้อมตอบคำถามกรรมการชุดที่ 2 ด้าน Frontend State & Security (ไม่เกิน 5 นาที)' },
    'c23_3': { step: 89, phase: 10, desc: 'ซ้อมตอบคำถามกรรมการชุดที่ 3 ด้าน DevOps Troubleshooting & Recovery (ไม่เกิน 5 นาที)' },
    'c24': { step: 90, phase: 10, desc: 'ซ้อมนำเสนอการทำงานร่วมกันเป็นทีม และการแบ่งหน้าที่ความรับผิดชอบ' },
    'c25_1': { step: 91, phase: 10, desc: 'รักษาบุคลิกภาพที่ดี มีความมั่นใจ และตอบคำถามอย่างมืออาชีพ' },
    'c25_2': { step: 92, phase: 10, desc: 'บริหารเวลาการนำเสนอและสาธิตระบบให้อยู่ในกรอบ 30 นาทีตามเกณฑ์' }
  };

  let unmapped = 0;
  items.forEach(it => {
    if (!stepMapping[it.id]) {
      console.log('Unmapped item:', it.id, it.qNum);
      unmapped++;
    }
  });

  console.log('Unmapped items count:', unmapped);
}

main();
