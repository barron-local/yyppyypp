const fs = require('fs');

const executionPhases = [
  {
    phase: 1,
    id: "phase-1",
    title: "Phase 1: โครงสร้างเครือข่ายกายภาพและสวิตช์ L3",
    timeAllotment: "09:00 - 10:15 (1 ชม. 15 นาที)",
    pts: 13,
    icon: "Network",
    summary: "ตั้งค่า Cisco Layer 3 Switch: VLAN 10 (server), 20 (dev), 30 (guest), Inter-VLAN Routing, DHCP, NAT ออกเครือข่ายกรรมการ, ACL และ Loop Protection"
  },
  {
    phase: 2,
    id: "phase-2",
    title: "Phase 2: เซิร์ฟเวอร์เสมือนและระบบปฏิบัติการหลัก",
    timeAllotment: "10:15 - 11:00 (45 นาที)",
    pts: 6,
    icon: "Server",
    summary: "ติดตั้ง Proxmox VE 8 / VMware Workstation Pro 17+, สร้าง VM devops-server (2 vCPU, RAM 4GB), On-Boot Autostart, ติดตั้ง Ubuntu Server, Netplan Static IP, Hostname"
  },
  {
    phase: 3,
    id: "phase-3",
    title: "Phase 3: ความปลอดภัยและการรีโมตเซิร์ฟเวอร์",
    timeAllotment: "11:00 - 11:30 (30 นาที)",
    pts: 5,
    icon: "ShieldCheck",
    summary: "เปิด OpenSSH Server, สร้าง Users (devops, auditor), ตั้งค่า SSH Port, UFW Firewall (เปิด 22, 80, 443, 53, 5000, 2222, 5380), Sudo NOPASSWD"
  },
  {
    phase: 4,
    id: "phase-4",
    title: "Phase 4: ระบบชื่อโดเมนภายใน (Technitium DNS & ACL)",
    timeAllotment: "11:30 - 12:00 (30 นาที)",
    pts: 2,
    icon: "Globe",
    summary: "ปลดล็อกพอร์ต 53 บน Ubuntu (systemd-resolved), รัน Technitium DNS บน Docker, สร้าง Primary Zone & A Records (gitlab, registry, app), กำหนด DNS ACL (Restricted)"
  },
  {
    phase: 5,
    id: "phase-5",
    title: "Phase 5: แพลตฟอร์ม DevOps & Git Central (Docker, GitLab & Registry)",
    timeAllotment: "12:00 - 13:00 (1 ชม.)",
    pts: 5,
    icon: "GitBranch",
    summary: "ติดตั้ง Docker Engine, Private Registry v2 + UI (5000/8080), Insecure Registry daemon.json, GitLab CE Compose, GitLab Runner (Docker executor), Caddy HTTPS Reverse Proxy (tls internal) & Root CA"
  },
  {
    phase: 6,
    id: "phase-6",
    title: "Phase 6: การออกแบบสถาปัตยกรรมระบบและ UI Wireframe",
    timeAllotment: "13:30 - 14:15 (45 นาที)",
    pts: 20,
    icon: "Layers",
    summary: "จัดทำ Flowchart 5 ผังด้วย Draw.io, ออกแบบฐานข้อมูล Relational อย่างน้อย 3 ตาราง & Class Diagram, วาด Wireframe Draw.io 5 หน้าจอ, ออกแบบ RESTful API Spec"
  },
  {
    phase: 7,
    id: "phase-7",
    title: "Phase 7: พัฒนาฐานข้อมูลและระบบหลังบ้าน (Database & Backend API)",
    timeAllotment: "14:15 - 15:15 (1 ชม.)",
    pts: 10,
    icon: "Database",
    summary: "สร้าง Database MySQL 8, เขียน Backend API (Node.js Express), ระบบ Login Authentication (JWT, bcrypt), CRUD APIs, RBAC 3 สิทธิ์ (Admin, Officer1, User2), Unit Tests"
  },
  {
    phase: 8,
    id: "phase-8",
    title: "Phase 8: พัฒนาระบบหน้าบ้านและการทดสอบ (Frontend UI & Testing)",
    timeAllotment: "15:15 - 16:00 (45 นาที)",
    pts: 16,
    icon: "Layout",
    summary: "พัฒนา Frontend UI (Vue/React/HTML) Responsive, หน้าจอ Login เชื่อมต่อ JWT, Dashboard สรุปข้อมูล, ตาราง CRUD, Git Branch Strategy, E2E Testing 2 ข้อ"
  },
  {
    phase: 9,
    id: "phase-9",
    title: "Phase 9: อัตโนมัติ CI/CD Pipeline และขึ้นสู่ Production",
    timeAllotment: "16:00 - 16:30 (30 นาที)",
    pts: 8,
    icon: "Rocket",
    summary: "เขียน Dockerfile Multi-stage, Docker Compose รวม App+DB บน Production, .gitlab-ci.yml 4 Stages (build, test, push, deploy), Git Push Auto Trigger, ตรวจสอบ Passed สีเขียวทั้ง 4 สเตจ และตรวจสอบ Image บน Registry"
  },
  {
    phase: 10,
    id: "phase-10",
    title: "Phase 10: ระบบ IoT (ถ้ามี) และเตรียมการนำเสนอส่งมอบ",
    timeAllotment: "16:30 - 17:00 (30 นาที)",
    pts: 10,
    icon: "Presentation",
    summary: "ตั้งค่า MQTT + Node-RED + ESP32 Dashboard (ถ้ามี), ตรวจสอบใบคะแนนตนเอง 100 คะแนนเต็ม, ซ้อมตอบคำถาม 3 ข้อ (Backend, Frontend, DevOps Troubleshooting 5 นาที), นำเสนอการทำงานร่วมกัน"
  }
];

console.log('Execution Phases count:', executionPhases.length);
