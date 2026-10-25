const fs = require('fs');

const raw = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

const updatedC6_1_tabs = [
  {
    id: "virtualbox",
    label: "Oracle VirtualBox (ง่ายสุดบน Windows)",
    icon: "Box",
    explanation: "Oracle VirtualBox 7.x เป็น Type-2 Hypervisor ยอดนิยมสำหรับเครื่องคอมพิวเตอร์ทั่วไป ติดตั้งลงบนระบบปฏิบัติการ Windows ได้โดยตรง มีหน้าจอ GUI จัดการ VM, Storage และ Virtual Networks ครบถ้วน",
    steps: [
      "ดาวน์โหลดและติดตั้ง VirtualBox 7.x และ VirtualBox Extension Pack จาก virtualbox.org",
      "เปิดโปรแกรม Oracle VM VirtualBox Manager จากหน้า Desktop จะพบหน้าต่าง GUI ควบคุมระบบ",
      "ตรวจสอบเมนู Tools > Network ตรวจสอบว่ามี Host-Only Networks หรือ NAT Networks พร้อมใช้งาน",
      "หน้าต่างหลักพร้อมแสดงปุ่ม 'New' (สร้างเครื่องใหม่) และ 'Settings' (ตั้งค่า) แสดงสถานะ GUI สมบูรณ์ตามเกณฑ์"
    ],
    lang: "powershell",
    code: "# ตรวจสอบการติดตั้ง VirtualBox ผ่าน PowerShell บน Windows:\n& \"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe\" --version\n\n# ตรวจสอบรายการ Virtual Networks ในระบบ:\n& \"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe\" list hostonlyifs",
    verify: "เปิดโปรแกรม VirtualBox Manager หน้าต่าง GUI แสดงผลพร้อมปุ่ม New และเมนู Tools"
  },
  {
    id: "vmware",
    label: "VMware Workstation Pro (มาตรฐาน VECSkill BNCC)",
    icon: "Cpu",
    explanation: "VMware Workstation Pro 17+ เป็น Type-2 Hypervisor ระดับมืออาชีพที่ศูนย์ฝึกอบรม VECSkill BNCC ใช้งานจริง มีหน้าจอ GUI และ Virtual Network Editor สำหรับจำลอง Switch เสมือนแยกวงได้อิสระ",
    steps: [
      "ติดตั้ง VMware Workstation Pro 17.x บน Windows (ปัจจุบันเปิดให้ใช้งานฟรีสำหรับ Personal Use)",
      "เปิดโปรแกรม VMware Workstation Pro จากหน้า Desktop",
      "ไปที่เมนู Edit > Virtual Network Editor (คลิก Change Settings เพื่อขอสิทธิ์ Admin):",
      "  - VMnet0: Bridged เชื่อมต่อกับการ์ด LAN จริงที่ต่อสายเข้า Cisco Switch",
      "  - VMnet1: Host-Only Subnet 10.20.30.0/24 สำหรับวงภายใน Intranet",
      "  - VMnet8: NAT Subnet 172.16.3.0/24 สำหรับบริการหลังบ้าน",
      "หน้าต่าง Home Dashboard แสดงปุ่ม 'Create a New Virtual Machine' พร้อมใช้งาน"
    ],
    lang: "powershell",
    code: "# ตรวจสอบการทำงานของ VMware ผ่าน CLI:\n& \"C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe\" list",
    verify: "เปิดหน้าต่าง VMware Workstation Pro และตรวจสอบ Virtual Network Editor พบ Switch เสมือนครบถ้วน"
  },
  {
    id: "proxmox",
    label: "Proxmox VE (มาตรฐาน Bare-metal Server)",
    icon: "Server",
    explanation: "Proxmox VE 8.x เป็น Type-1 Bare-metal Hypervisor สำหรับติดตั้งบนเครื่อง Server โดยตรง ควบคุมและสั่งการผ่าน Web GUI ได้จากทุกเครื่องในเครือข่าย",
    steps: [
      "ต่อสาย LAN จากคอมพิวเตอร์เข้ากับพอร์ตสวิตช์ในวงเดียวกับ Server (เช่น 192.168.10.x)",
      "เปิดเว็บเบราว์เซอร์ไปที่ https://192.168.10.2:8006 (ต้องใส่ https:// และพอร์ต :8006 เสมอ)",
      "คลิก Advanced > Proceed to 192.168.10.2 (unsafe) เพื่อข้ามหน้าต่างแจ้งเตือน SSL Self-signed",
      "กรอก Username: root, Password: <รหัสผ่านที่ตั้งไว้>, Realm: Linux PAM standard authentication",
      "กด Login จะเข้าสู่หน้า Summary Dashboard แสดงผลกราฟ CPU, RAM และ Storage"
    ],
    lang: "bash",
    code: "# ตรวจสอบสถานะ Hypervisor Services บน Proxmox Shell:\npveversion -v\nsystemctl status pveproxy pvedaemon --no-pager",
    verify: "เข้าหน้าเว็บ Proxmox https://192.168.10.2:8006 แสดงแดชบอร์ดสีเขียว Online"
  }
];

console.log('Tabs data defined. Number of tabs:', updatedC6_1_tabs.length);
