const fs = require('fs');

async function buildDataset() {
  const mod = await import('../src/data/examQuestionsAndSolutions.js');
  const oldItems = mod.examQuestionsAndSolutions;

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

  // Section 3 (IoT Items)
  const iotItems = [
    {
      id: "c_iot_1",
      secId: "sec3",
      qNum: "ข้อ 3.1",
      pdfPage: 22,
      questionText: "ติดตั้งและตั้งค่า MQTT Server + Node-RED\n- ติดตั้ง MQTT Server และ ตั้งค่าการเข้าถึง (ACL/Auth) ได้",
      pts: 1,
      note: "เฉพาะกรณีโหมดมี IoT",
      explanation: "ติดตั้ง MQTT Broker (เช่น EMQX หรือ Eclipse Mosquitto) บน Docker พร้อมเปิดพอร์ต 1883 (MQTT) และ 18083 (Web Dashboard) กำหนด Username/Password Authentication และ Access Control List (ACL) ให้ยอมรับเฉพาะอุปกรณ์และ Node-RED ที่ได้รับอนุญาต",
      solutionType: "code",
      lang: "bash",
      code: `# ==============================================================================
# รัน EMQX MQTT Broker Container:
# ==============================================================================
docker run -d \\
  --name emqx \\
  --restart always \\
  --network app_net \\
  -p 1883:1883 \\
  -p 8083:8083 \\
  -p 8084:8084 \\
  -p 8883:8883 \\
  -p 18083:18083 \\
  emqx/emqx:5.8.0

# ตรวจสอบการเข้าถึง Web Dashboard:
# http://192.168.10.10:18083 (User: admin / Pass: public)`,
      steps: [
        "รันคอนเทนเนอร์ EMQX ด้วย Docker บน network app_net",
        "เปิดเว็บเบราว์เซอร์เข้าสู่ http://192.168.10.10:18083 ล็อกอิน admin / public",
        "ไปที่เมนู Access Control > Authentication สร้าง User: esp32_client และ node_red_client",
        "ไปที่เมนู Authorization (ACL) กำหนดสิทธิ์ให้อ่านและเขียนเฉพาะ Topic sensors/#"
      ],
      verify: "mosquitto_sub -h 192.168.10.10 -u node_red_client -P <password> -t 'sensors/#' สามารถเชื่อมต่อสำเร็จ",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 93,
      execOrderDesc: "ติดตั้ง MQTT Broker รองรับการเชื่อมต่อจาก ESP32 และ Node-RED"
    },
    {
      id: "c_iot_2",
      secId: "sec3",
      qNum: "ข้อ 3.2",
      pdfPage: 22,
      questionText: "ทดสอบ MQTT Client ได้ (เช่น MQTT Explorer หรือ Node-RED MQTT In/Out)\n- Pub/Sub สำเร็จตาม Topic ที่กำหนด",
      pts: 1,
      note: "เฉพาะกรณีโหมดมี IoT",
      explanation: "ทดสอบการรับส่งข้อความ (Publish / Subscribe) ระหว่าง MQTT Broker และ MQTT Client (เช่น Node-RED mqtt in / mqtt out node หรือ MQTT Explorer) ตาม Topic ที่กรรมการกำหนด เช่น sensors/environment/data",
      solutionType: "code",
      lang: "bash",
      code: `# 1. Subscribe รอรับข้อมูลบน Topic:
mosquitto_sub -h 192.168.10.10 -t "sensors/environment/data" -v

# 2. Publish ข้อความ JSON ทดสอบจากอีก Terminal:
mosquitto_pub -h 192.168.10.10 -t "sensors/environment/data" -m '{"temperature": 28.5, "humidity": 65.0, "status": "normal"}'`,
      steps: [
        "เปิด Node-RED Web UI (http://192.168.10.10:1880)",
        "ลากโหนด 'mqtt in' และตั้งค่า Server: 192.168.10.10:1883, Topic: sensors/environment/data",
        "ต่อเข้ากับโหนด 'debug' เพื่อดู Payload ข้อมูล",
        "กด Deploy และทดสอบส่งข้อมูล ตรวจสอบแถบ Debug ต้องได้รับข้อความ JSON ตรงตามที่ส่ง"
      ],
      verify: "หน้าต่าง Debug ใน Node-RED ได้รับ payload JSON จาก Topic ที่ส่งสำเร็จ 100%",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 94,
      execOrderDesc: "ทดสอบการส่งและรับข้อมูล Pub/Sub ผ่าน MQTT Topic"
    },
    {
      id: "c_iot_3",
      secId: "sec3",
      qNum: "ข้อ 3.3",
      pdfPage: 22,
      questionText: "Hardware Integration (ESP32 + Sensor)\n- Hardware Pub ค่า payload ไปยัง Topic ที่กำหนด และ Hardware Sub ค่าเพื่อตอบสนองคำสั่งจาก Server",
      pts: 1,
      note: "เฉพาะกรณีโหมดมี IoT",
      explanation: "เขียนโปรแกรมบนบอร์ดไมโครคอนโทรลเลอร์ ESP32 ด้วย Arduino IDE เชื่อมต่อเครือข่าย WiFi (VLAN dev/guest) อ่านค่าจาก Sensor จริง (เช่น DHT22 อุณหภูมิ/ความชื้น) แล้ว Publish ขึ้น MQTT Broker พร้อมทั้ง Subscribe คำสั่งควบคุม (เช่น สั่งเปิด/ปิด Relay LED) จาก Server",
      solutionType: "code",
      lang: "c",
      code: `// โค้ด ESP32 (Arduino C++) สำหรับส่งค่า Sensor และรับคำสั่ง Relay
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "Competition_WiFi";
const char* password = "WiFiPassword123";
const char* mqtt_server = "192.168.10.10";

WiFiClient espClient;
PubSubClient client(espClient);
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
#define RELAY_PIN 2

void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (int i = 0; i < length; i++) msg += (char)payload[i];
  if (msg == "ON") digitalWrite(RELAY_PIN, HIGH);
  else if (msg == "OFF") digitalWrite(RELAY_PIN, LOW);
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    while (!client.connected()) {
      if (client.connect("ESP32_Device", "esp32_client", "password123")) {
        client.subscribe("commands/relay");
      } else delay(2000);
    }
  }
  client.loop();
  
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  char payload[100];
  snprintf(payload, sizeof(payload), "{\\"temp\\":%.2f,\\"hum\\":%.2f}", t, h);
  client.publish("sensors/environment/data", payload);
  delay(5000);
}`,
      steps: [
        "ต่อวงจร ESP32 เข้ากับ Sensor DHT22 (ขา Data เข้า GPIO 4) และ Relay (ขา Control เข้า GPIO 2)",
        "เปิดโปรแกรม Arduino IDE คอมไพล์และอัปโหลดโค้ดลงบอร์ด ESP32",
        "เปิด Serial Monitor ตรวจสอบการเชื่อมต่อ WiFi และ MQTT Broker สำเร็จ",
        "ส่งคำสั่ง 'ON' เข้า Topic 'commands/relay' สังเกตว่าหลอดไฟ Relay สว่างขึ้นตอบสนองคำสั่งทันที"
      ],
      verify: "ESP32 ส่งข้อมูลอุณหภูมิขึ้น Topic สม่ำเสมอ และตอบสนองต่อคำสั่งเปิด/ปิด Relay ได้จริง",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 95,
      execOrderDesc: "เบิร์นโค้ดลง ESP32 เชื่อมโยง Sensor และ Relay กับ MQTT Broker"
    },
    {
      id: "c_iot_4",
      secId: "sec3",
      qNum: "ข้อ 3.4",
      pdfPage: 22,
      questionText: "Software Interaction & Database Logging\n- Software (Node-RED หรือ Script) Sub ข้อมูลจาก Topic โดยบันทึกข้อมูลลงฐานข้อมูล (เช่น MySQL, MariaDB, SQLite)",
      pts: 1,
      note: "เฉพาะกรณีโหมดมี IoT",
      explanation: "สร้าง Flow การทำงานบน Node-RED (หรือเขียน Background Script) รับข้อมูล (Subscribe) จาก MQTT Topic แปลงค่า JSON และบันทึกข้อมูล Sensor ลงในตาราง iot_logs บนฐานข้อมูล MySQL/MariaDB โดยอัตโนมัติ",
      solutionType: "code",
      lang: "json",
      code: `// ตัวอย่าง Function Node ใน Node-RED สำหรับเตรียม SQL Insert
msg.topic = "INSERT INTO iot_logs (temperature, humidity, device_id, recorded_at) VALUES (?, ?, ?, NOW())";
msg.payload = [
    msg.payload.temp,
    msg.payload.hum,
    "ESP32-ROOM1"
];
return msg;`,
      steps: [
        "ติดตั้งพาเล็ต 'node-red-node-mysql' บน Node-RED",
        "ลากโหนด 'mqtt in' เชื่อมต่อไปยังโหนด 'json' เพื่อแปลง payload เป็น JavaScript Object",
        "ต่อเข้ากับโหนด 'function' เตรียม SQL Statement บันทึกข้อมูล",
        "ต่อเข้ากับโหนด 'mysql' ตั้งค่าเชื่อมต่อไปยัง competition-db พอร์ต 3306",
        "เปิดดูข้อมูลใน phpMyAdmin ตาราง iot_logs ตรวจสอบว่ามีแถวข้อมูลใหม่ถูกเพิ่มทุกๆ 5 วินาที"
      ],
      verify: "SELECT * FROM iot_logs ORDER BY id DESC LIMIT 5; แสดงประวัติข้อมูล Sensor ล่าสุด",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 96,
      execOrderDesc: "บันทึกข้อมูล Sensor จาก MQTT Topic ลงตารางฐานข้อมูล MySQL อัตโนมัติ"
    },
    {
      id: "c_iot_5",
      secId: "sec3",
      qNum: "ข้อ 3.5",
      pdfPage: 22,
      questionText: "การแสดงผลบน Dashboard\n- มีใช้ Node-RED Dashboard แสดงข้อมูลแบบเรียลไทม์ โดยมีการแจ้งเตือน/แสดงผลเมื่อ Hardware ตอบสนอง",
      pts: 1,
      note: "เฉพาะกรณีโหมดมี IoT",
      explanation: "สร้างหน้า Dashboard บน Node-RED ด้วย @flowfuse/node-red-dashboard หรือ node-red-dashboard แสดงผลข้อมูล Sensor แบบ Real-time เช่น Gauge วัดอุณหภูมิ, Chart แสดงความชื้น, ปุ่ม Switch สั่งงาน Relay และไฟสถานะแจ้งเตือน",
      solutionType: "code",
      lang: "bash",
      code: `# เข้าสู่ Node-RED Dashboard ผ่านเว็บเบราว์เซอร์:
# URL: http://192.168.10.10:1880/dashboard (หรือ /ui)`,
      steps: [
        "ติดตั้ง Node-RED Dashboard พาเล็ตใน Node-RED",
        "สร้าง UI Gauge สำหรับแสดงค่า Temperature (0 - 50 °C) มีสีเขียว-เหลือง-แดง",
        "สร้าง UI Chart สำหรับพล็อตเส้นแนวโน้มความชื้นย้อนหลัง",
        "สร้าง UI Switch สำหรับส่งค่า ON/OFF ไปควบคุม Relay บนบอร์ด ESP32",
        "เปิดหน้า http://192.168.10.10:1880/ui ตรวจสอบเข็มวัดและกราฟขยับตามค่า Sensor จริง"
      ],
      verify: "หน้าเว็บ Node-RED Dashboard แสดงผล Gauge, กราฟเส้น Real-time และปุ่มสั่งงานได้จริง",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 97,
      execOrderDesc: "สร้าง Dashboard บน Node-RED แสดงข้อมูลและควบคุมอุปกรณ์แบบ Real-time"
    },
    {
      id: "c_iot_6",
      secId: "sec3",
      qNum: "ข้อ 3.5",
      pdfPage: 22,
      questionText: "การแสดงผลบน Dashboard\n- มีการแสดงผลผ่านหน้า Web Application ในรูปแบบ Dashboard ไม่น้อยกว่า 5 รูปแบบที่แตกต่างกัน (กำหนดให้แสดงรูปแบบละ 1 หน้าเว็บ) ตามที่กรรมการกำหนด",
      pts: 5,
      note: "เฉพาะกรณีโหมดมี IoT - 5 รูปแบบ รูปแบบละ 1 คะแนน",
      explanation: "พัฒนาหน้าจอ Dashboard บน Web Application หลักครบถ้วนไม่น้อยกว่า 5 รูปแบบที่แตกต่างกัน (หน้าละ 1 รูปแบบ) ได้แก่ 1) KPI Card Stat Widgets, 2) Real-time Time-series Line Chart, 3) Distribution Donut/Bar Chart, 4) Real-time Data Table with Live Stream, 5) Device Control Panel with Interactive Toggles",
      solutionType: "code",
      lang: "javascript",
      code: `// 5 รูปแบบ Dashboard บน Web Application:
// 1. KPI Metric Summary Cards (/dashboard/summary)
// 2. Real-time Environmental Line Chart (/dashboard/charts)
// 3. Status Distribution Donut Chart (/dashboard/distribution)
// 4. Live Sensor Data Stream Table (/dashboard/table)
// 5. Hardware Interactive Control Panel (/dashboard/controls)`,
      steps: [
        "สร้างหน้า Dashboard 1: การ์ดตัวเลขสรุป (KPI Cards: อุณหภูมิเฉลี่ย, สูงสุด, ต่ำสุด, จำนวนอุปกรณ์)",
        "สร้างหน้า Dashboard 2: กราฟเส้นแนวโน้มสภาพแวดล้อม (Time-series Line Chart) อัปเดตทุกวินาที",
        "สร้างหน้า Dashboard 3: แผนภูมิแท่ง/วงกลม สัดส่วนการทำงานของอุปกรณ์ (Distribution Chart)",
        "สร้างหน้า Dashboard 4: ตารางแสดง Log ข้อมูลล่าสุดแบบ Real-time พร้อมแถบสีสถานะ",
        "สร้างหน้า Dashboard 5: แผงควบคุมสวิตช์เปิด-ปิด Relay และสไลเดอร์ปรับค่าแบบ Interactive"
      ],
      verify: "เปิดเข้าดูหน้า Web Application มีเมนู Dashboard ครบ 5 รูปแบบที่แตกต่างกันอย่างชัดเจน",
      executionPhase: 10,
      phaseName: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
      executionStep: 98,
      execOrderDesc: "พัฒนา Web Dashboard 5 รูปแบบบนเว็บแอปพลิเคชันหลัก"
    }
  ];

  // Enrich existing 92 items
  const enrichedItems = oldItems.map(item => {
    const map = stepMapping[item.id];
    if (map) {
      return {
        ...item,
        executionPhase: map.phase,
        phaseName: phaseMeta[map.phase].name,
        executionStep: map.step,
        execOrderDesc: map.desc
      };
    }
    return item;
  });

  // Combine with IoT items
  const allItems = [...enrichedItems, ...iotItems];

  // Sort by executionStep
  allItems.sort((a, b) => a.executionStep - b.executionStep);

  console.log('Total items after enrichment & IoT:', allItems.length);

  // Write out as JS file
  const fileContent = `// ==============================================================================
// EXACT RUBRIC & SOLUTIONS DATA DIRECTLY FROM OFFICIAL PDF (ITEM 58)
// ทักษะเทคโนโลยีสารสนเทศด้านโปรแกรมและเครือข่ายด้วยกระบวนการ DevOps ระดับ ปวส.
// ปีการศึกษา 2568 - 2572 (100 คะแนนเต็ม พร้อมระบบลำดับการปฏิบัติงานจริง 10 ขั้น)
// ==============================================================================

export const sectionsMeta = [
  {
    id: 'sec1',
    title: 'ส่วนที่ 1 Network ตั้งค่าพร้อมทั้งทดสอบอุปกรณ์เครือข่าย',
    totalPts: 13,
    pdfPages: [9, 10],
    desc: 'VLAN, Inter-VLAN Routing, DHCP Server & Snooping, NAT เชื่อมต่อกรรมการ, Standard & Extended ACL, Loop Protection'
  },
  {
    id: 'sec2',
    title: 'ส่วนที่ 2 ตั้งค่าเครือข่ายตามผังระบบเครือข่าย และ DevOps Infra',
    totalPts: 24,
    pdfPages: [10, 11, 12],
    desc: 'Virtualization, Linux Server (Ubuntu), DNS Server บน Docker, SSH 2 Users, Sudo NOPASSWD, UFW Firewall, Docker & GitLab, Compose HTTPS Reverse Proxy, GitLab CI/CD Pipeline 4 Stages'
  },
  {
    id: 'sec3',
    title: 'ส่วนที่ 3 ติดตั้งและทดสอบ MQTT Server, Node-RED, Hardware, Dashboard (โหมดมี IoT 10 คะแนน)',
    totalPts: 10,
    pdfPages: [13, 22],
    desc: 'ติดตั้ง MQTT Server (EMQX/Mosquitto) พร้อม ACL, Node-RED, เชื่อมต่อ ESP32 + Sensor, Database Logging ลง MySQL, Node-RED Dashboard และ Web Dashboard 5 รูปแบบ'
  },
  {
    id: 'sec4',
    title: 'ส่วนที่ 4 ซอฟต์แวร์และการประยุกต์',
    totalPts: 53,
    pdfPages: [13, 14, 15, 16, 17, 18],
    desc: '4.1 ผังงาน Flowchart (5), 4.2 ฐานข้อมูลเชิงสัมพันธ์ & Class Diagram (5), 4.3 หน้าจอ Draw.io 5 หน้า (5), 4.4 RESTful API Spec (5), 4.5 Backend Node.js 10 ข้อ (10), 4.6 Frontend UI, Tests, Git Branch & ความสมบูรณ์ (23)'
  },
  {
    id: 'sec5',
    title: 'ส่วนที่ 5 การนำเสนอและตอบคำถามคณะกรรมการ',
    totalPts: 10,
    pdfPages: [18, 28, 29],
    desc: 'ตอบคำถาม 3 ข้อ Backend, Frontend, DevOps Troubleshooting (3), วิธีทำงานร่วมกัน (3), บุคลิกภาพ (3), เวลาไม่เกิน 30 นาที (1)'
  }
];

export const executionPhases = [
  {
    phase: 1,
    id: 'phase-1',
    title: 'Phase 1: โครงสร้างเครือข่ายกายภาพและสวิตช์ L3',
    shortTitle: '1. เครือข่าย & สวิตช์ L3',
    timeAllotment: '09:00 - 10:15 (1.25 ชม.)',
    pts: 13,
    itemCount: 12,
    icon: 'Network',
    color: 'blue',
    summary: 'เริ่มทำก่อนอันดับแรก: ตั้งค่า Cisco Layer 3 Switch: VLAN 10, 20, 30, Inter-VLAN Routing, DHCP Server, DHCP Snooping, NAT ออกเน็ตกรรมการ, ACL และ STP Loop Guard'
  },
  {
    phase: 2,
    id: 'phase-2',
    title: 'Phase 2: เซิร์ฟเวอร์เสมือนและระบบปฏิบัติการหลัก',
    shortTitle: '2. Hypervisor & Ubuntu OS',
    timeAllotment: '10:15 - 11:00 (45 นาที)',
    pts: 6,
    itemCount: 6,
    icon: 'Server',
    color: 'emerald',
    summary: 'ติดตั้ง Proxmox VE 8 / VMware Workstation Pro 17+, สร้าง VM devops-server (2 vCPU, RAM 4GB), On-Boot Autostart, ติดตั้ง Ubuntu Server, Netplan Static IP, Hostname'
  },
  {
    phase: 3,
    id: 'phase-3',
    title: 'Phase 3: ความปลอดภัยและการรีโมตเซิร์ฟเวอร์',
    shortTitle: '3. SSH, Users & Firewall',
    timeAllotment: '11:00 - 11:30 (30 นาที)',
    pts: 5,
    itemCount: 5,
    icon: 'ShieldCheck',
    color: 'amber',
    summary: 'เปิด OpenSSH Server, สร้าง Users (devops, auditor), ตั้งค่า SSH Port, UFW Firewall (เปิด 22, 80, 443, 53, 5000, 2222, 5380), Sudo NOPASSWD'
  },
  {
    phase: 4,
    id: 'phase-4',
    title: 'Phase 4: ระบบชื่อโดเมนภายใน (Technitium DNS & ACL)',
    shortTitle: '4. DNS Server & ACL',
    timeAllotment: '11:30 - 12:00 (30 นาที)',
    pts: 2,
    itemCount: 2,
    icon: 'Globe',
    color: 'teal',
    summary: 'ปลดล็อกพอร์ต 53 บน Ubuntu (systemd-resolved), รัน Technitium DNS บน Docker, สร้าง Primary Zone & A Records (gitlab, registry, app), กำหนด DNS ACL (Restricted)'
  },
  {
    phase: 5,
    id: 'phase-5',
    title: 'Phase 5: แพลตฟอร์ม DevOps & Git Central (Docker, GitLab & Registry)',
    shortTitle: '5. Docker, GitLab & Registry',
    timeAllotment: '12:00 - 13:00 (1 ชม.)',
    pts: 5,
    itemCount: 5,
    icon: 'GitBranch',
    color: 'indigo',
    summary: 'ติดตั้ง Docker Engine, Private Registry v2 + UI (5000/8080), Insecure Registry daemon.json, GitLab CE Compose, GitLab Runner (Docker executor), Caddy HTTPS Reverse Proxy (tls internal) & Root CA'
  },
  {
    phase: 6,
    id: 'phase-6',
    title: 'Phase 6: การออกแบบสถาปัตยกรรมระบบและ UI Wireframe',
    shortTitle: '6. ออกแบบระบบ & Wireframe',
    timeAllotment: '13:30 - 14:15 (45 นาที)',
    pts: 20,
    itemCount: 20,
    icon: 'Layers',
    color: 'purple',
    summary: 'จัดทำ Flowchart 5 ผังด้วย Draw.io, ออกแบบฐานข้อมูล Relational อย่างน้อย 3 ตาราง & Class Diagram, วาด Wireframe Draw.io 5 หน้าจอ, ออกแบบ RESTful API Spec'
  },
  {
    phase: 7,
    id: 'phase-7',
    title: 'Phase 7: พัฒนาฐานข้อมูลและระบบหลังบ้าน (Database & Backend API)',
    shortTitle: '7. Database & Backend API',
    timeAllotment: '14:15 - 15:15 (1 ชม.)',
    pts: 10,
    itemCount: 10,
    icon: 'Database',
    color: 'cyan',
    summary: 'สร้าง Database MySQL 8, เขียน Backend API (Node.js Express), ระบบ Login Authentication (JWT, bcrypt), CRUD APIs, RBAC 3 สิทธิ์ (Admin, Officer1, User2), Unit Tests'
  },
  {
    phase: 8,
    id: 'phase-8',
    title: 'Phase 8: พัฒนาระบบหน้าบ้านและการทดสอบ (Frontend UI & Testing)',
    shortTitle: '8. Frontend UI & Tests',
    timeAllotment: '15:15 - 16:00 (45 นาที)',
    pts: 16,
    itemCount: 16,
    icon: 'Layout',
    color: 'pink',
    summary: 'พัฒนา Frontend UI (Vue/React/HTML) Responsive, หน้าจอ Login เชื่อมต่อ JWT, Dashboard สรุปข้อมูล, ตาราง CRUD, Git Branch Strategy, E2E Testing 2 ข้อ'
  },
  {
    phase: 9,
    id: 'phase-9',
    title: 'Phase 9: อัตโนมัติ CI/CD Pipeline และขึ้นสู่ Production',
    shortTitle: '9. CI/CD & Production Deploy',
    timeAllotment: '16:00 - 16:30 (30 นาที)',
    pts: 8,
    itemCount: 10,
    icon: 'Rocket',
    color: 'rose',
    summary: 'เขียน Dockerfile Multi-stage, Docker Compose รวม App+DB บน Production, .gitlab-ci.yml 4 Stages (build, test, push, deploy), Git Push Auto Trigger, ตรวจสอบ Passed สีเขียวทั้ง 4 สเตจ และตรวจสอบ Image บน Registry'
  },
  {
    phase: 10,
    id: 'phase-10',
    title: 'Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ',
    shortTitle: '10. IoT & นำเสนอส่งมอบ',
    timeAllotment: '16:30 - 17:00 (30 นาที)',
    pts: 10,
    itemCount: 12,
    icon: 'Presentation',
    color: 'orange',
    summary: 'ตั้งค่า MQTT + Node-RED + ESP32 Dashboard (ถ้ามี), ตรวจสอบใบคะแนนตนเอง 100 คะแนนเต็ม, ซ้อมตอบคำถาม 3 ข้อ (Backend, Frontend, DevOps Troubleshooting 5 นาที), นำเสนอการทำงานร่วมกัน'
  }
];

export const examQuestionsAndSolutions = ${JSON.stringify(allItems, null, 2)};
`;

  fs.writeFileSync('src/data/examQuestionsAndSolutions.js', fileContent, 'utf8');
  console.log('Successfully written updated dataset to src/data/examQuestionsAndSolutions.js!');
}

buildDataset();
