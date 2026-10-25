const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'data', 'examQuestionsAndSolutions.js');
let content = fs.readFileSync(filePath, 'utf8');

// Parse items
const startStr = 'export const examQuestionsAndSolutions = ';
const startIdx = content.indexOf(startStr);
const endIdx = content.lastIndexOf('];');

if (startIdx === -1 || endIdx === -1) {
  console.error('Cannot locate examQuestionsAndSolutions in file');
  process.exit(1);
}

const prefix = content.substring(0, startIdx + startStr.length);
const jsonText = content.substring(startIdx + startStr.length, endIdx + 1);
const suffix = content.substring(endIdx + 1);

const items = eval(jsonText);
console.log('Total items parsed:', items.length);

// 1. C6_1: ติดตั้งระบบ Virtualization แล้วมี GUI จัดการระบบ
const c6_1 = items.find(x => x.id === 'c6_1');
if (c6_1) {
  c6_1.tabs = [
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
}

// 2. C6_2: สร้าง VM ได้ตามแผนผัง สเปก 2 vCPU, RAM 4GB, Disk 32-40GB
const c6_2 = items.find(x => x.id === 'c6_2');
if (c6_2) {
  c6_2.tabs = [
    {
      id: "virtualbox",
      label: "Oracle VirtualBox",
      icon: "Box",
      explanation: "สร้าง Virtual Machine บน VirtualBox กำหนดสเปก 2 vCPUs, RAM 4096 MB, Disk 40 GB และการ์ดแลนแบบ Bridged Adapter เพื่อเชื่อมตรงเข้ากับพอร์ตสวิตช์จริง",
      steps: [
        "คลิกปุ่ม 'New' (หรือกด Ctrl+N) บนหน้าต่าง VirtualBox",
        "Name: devops-server | Type: Linux | Version: Ubuntu (64-bit)",
        "เลือก ISO Image: ubuntu-24.04-live-server-amd64.iso (ติ๊กถูก 'Skip Unattended Installation' เพื่อคอนฟิกเอง)",
        "Hardware: กำหนด Base Memory = 4096 MB (4 GB), Processors = 2 CPUs",
        "Harddisk: Create a Virtual Hard Disk Now, ขนาด 40.00 GB (VDI, Dynamically allocated)",
        "ตั้งค่า Network (สำคัญ): คลิกขวาที่ VM > Settings > Network > Adapter 1 เลือก 'Bridged Adapter' ชี้ไปยังการ์ด LAN จริงที่ต่อสายเข้า Cisco Switch",
        "กด OK และคลิก Start เพื่อเริ่มติดตั้ง Ubuntu Server"
      ],
      lang: "powershell",
      code: "# คำสั่งสร้าง VM ผ่าน VBoxManage CLI บน Windows PowerShell:\n$VBOX = \"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe\"\n\n# 1. สร้าง VM และลงทะเบียน\n& $VBOX createvm --name \"devops-server\" --ostype \"Ubuntu_64\" --register\n\n# 2. ปรับแต่งสเปก CPU 2 Cores, RAM 4096 MB\n& $VBOX modifyvm \"devops-server\" --cpus 2 --memory 4096 --vram 16\n\n# 3. ตั้งการ์ดเครือข่ายเป็น Bridged Adapter\n& $VBOX modifyvm \"devops-server\" --nic1 bridged --bridgeadapter1 \"Ethernet\"\n\n# 4. สร้างและแนบดิสก์เสมือน 40 GB\n& $VBOX createhd --filename \"devops-server.vdi\" --size 40960 --format VDI\n& $VBOX storagectl \"devops-server\" --name \"SATA Controller\" --add sata --controller IntelAhci\n& $VBOX storageattach \"devops-server\" --storagectl \"SATA Controller\" --port 0 --device 0 --type hdd --medium \"devops-server.vdi\"",
      verify: "& 'C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe' showvminfo 'devops-server' | Select-String 'Memory size|Number of CPUs'"
    },
    {
      id: "vmware",
      label: "VMware Workstation Pro",
      icon: "Cpu",
      explanation: "สร้าง VM บน VMware Workstation Pro ตามคู่มือมาตรฐาน VECSkill กำหนด 2 vCPUs, RAM 4096 MB, Disk 40 GB และการ์ดเครือข่าย VMnet0 (Bridged)",
      steps: [
        "คลิก File > New Virtual Machine... > เลือก Custom (advanced) > Next",
        "Hardware Compatibility: Workstation 17.x",
        "Guest OS Installation: เลือก 'I will install the operating system later'",
        "Guest OS: Linux > Version: Ubuntu 64-bit",
        "VM Name: devops-server",
        "Processors: Number of processors: 1, Number of cores per processor: 2 (รวม 2 Cores)",
        "Memory: 4096 MB (4 GB)",
        "Network: Use bridged networking (หรือ Custom VMnet0)",
        "Disk: Create a new virtual disk ขนาด 40.0 GB (Store as single file)",
        "คลิก Customize Hardware... > CD/DVD > เลือก Use ISO image ชี้ไปที่ไฟล์ Ubuntu Server ISO > Close > Finish"
      ],
      lang: "powershell",
      code: "# ตรวจสอบสเปกไฟล์คอนฟิก .vmx บน VMware:\nGet-Content \"C:\\VMs\\devops-server\\devops-server.vmx\" | Select-String \"memsize|numvcpus|ethernet0.connectionType\"",
      verify: "เปิด VMware Workstation ตรวจดูแท็บ Summary ของ devops-server แสดง Memory 4GB, 2 CPUs"
    },
    {
      id: "proxmox",
      label: "Proxmox VE",
      icon: "Server",
      explanation: "สร้าง KVM Virtual Machine บน Proxmox ผ่าน Web GUI หรือ Shell CLI ระบุ VM ID 100, 2 vCPUs, RAM 4GB, Disk 40GB, Bridge vmbr0",
      steps: [
        "คลิกปุ่ม 'Create VM' สีฟ้ามุมขวาบนของหน้าเว็บ Proxmox",
        "General: VM ID: 100, Name: devops-server",
        "OS: เลือก Storage local:iso/ubuntu-24.04-live-server-amd64.iso",
        "System: SCSI Controller: VirtIO SCSI single, Qemu Agent: [x] Enabled",
        "Disks: Storage: local-lvm, Disk size: 40 GiB, Bus: SCSI (scsi0)",
        "CPU: Sockets: 1, Cores: 2, Type: host",
        "Memory: 4096 MiB",
        "Network: Bridge: vmbr0, Model: VirtIO (paravirtualized)",
        "กด Finish แล้วตรวจสอบรายชื่อ VM ในแถบเมนูด้านซ้าย"
      ],
      lang: "bash",
      code: "# คำสั่งสร้าง VM ด้วย Proxmox CLI:\nqm create 100 \\\n  --name devops-server \\\n  --ostype l26 \\\n  --memory 4096 \\\n  --cores 2 \\\n  --cpu host \\\n  --scsihw virtio-scsi-single \\\n  --scsi0 local-lvm:40 \\\n  --net0 virtio,bridge=vmbr0,firewall=1 \\\n  --boot order=scsi0 \\\n  --agent enabled=1\n\n# ตรวจสอบคอนฟิก:\nqm config 100",
      verify: "qm list หรือหน้าเว็บ Proxmox แสดง 100 (devops-server) สเปก 2 Cores, RAM 4GB, Disk 40GB"
    }
  ];
}

// 3. C6_3: การตั้งค่า IP Address Virtualization ตามที่กรรมการกำหนด
const c6_3 = items.find(x => x.id === 'c6_3');
if (c6_3) {
  c6_3.tabs = [
    {
      id: "virtualbox",
      label: "Oracle VirtualBox",
      icon: "Box",
      explanation: "การตั้งค่า IP Address บนโฮสต์และ VirtualBox Virtual Network Manager เพื่อให้โฮสต์และ VM สื่อสารกันได้ตามวง Subnet ที่กรรมการกำหนด",
      steps: [
        "เปิด VirtualBox > ไปที่เมนู Tools > Network > แท็บ Host-only Networks",
        "คลิก Create เพื่อสร้าง Adapter เสมือน (เช่น VirtualBox Host-Only Ethernet Adapter)",
        "กำหนด Adapter IPv4 Address: 192.168.10.2 / IPv4 Network Mask: 255.255.255.0",
        "ในแท็บ DHCP Server: สามารถเลือกปิดใช้งาน (Disable) เพื่อใช้ DHCP จาก Cisco Switch หรือตั้งแจก IP ตามที่โจทย์ระบุ",
        "กด Apply แล้วตรวจสอบการเชื่อมต่อบน Windows"
      ],
      lang: "powershell",
      code: "# กำหนด IP ให้ Host-Only Adapter ของ VirtualBox ผ่าน CLI:\n$VBOX = \"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe\"\n& $VBOX hostonlyif ipconfig \"VirtualBox Host-Only Ethernet Adapter\" --ip 192.168.10.2 --netmask 255.255.255.0\n\n# ตรวจสอบ IP บน Windows:\nGet-NetIPAddress -InterfaceAlias \"*VirtualBox*\" | Select-Object IPAddress, InterfaceAlias",
      verify: "Get-NetIPAddress แสดง IP 192.168.10.2 บน VirtualBox Interface"
    },
    {
      id: "vmware",
      label: "VMware Workstation Pro",
      icon: "Cpu",
      explanation: "การกำหนด IP Address บน Virtual Network Editor ของ VMware ให้สอดคล้องกับผังเครือข่าย",
      steps: [
        "เปิด VMware Workstation > เมนู Edit > Virtual Network Editor",
        "คลิก Change Settings (มุมขวาล่าง) เพื่อเข้าสู่สิทธิ์ Administrator",
        "เลือก VMnet0: ติ๊ก 'Bridged to' แล้วเลือกชื่อการ์ดแลนจริงที่ต่อสายไปหาสวิตช์",
        "หากใช้ VMnet1 (Host-Only): กำหนด Subnet IP: 10.20.30.0 / Subnet mask: 255.255.255.0",
        "หากใช้ VMnet8 (NAT): กำหนด Subnet IP: 172.16.3.0 / Subnet mask: 255.255.255.0",
        "คลิกปุ่ม Apply แล้วกด OK"
      ],
      lang: "powershell",
      code: "# ตรวจสอบการตั้งค่า IP ของ VMware Adapters บน Windows:\nGet-NetIPAddress -InterfaceAlias \"*VMware*\" | Select-Object IPAddress, InterfaceAlias",
      verify: "หน้าต่าง Virtual Network Editor แสดง Subnet IP ตรงตามผังเครือข่าย"
    },
    {
      id: "proxmox",
      label: "Proxmox VE",
      icon: "Server",
      explanation: "กำหนด Static IP บน Linux Bridge (vmbr0) ของ Proxmox Host ให้เป็น IP ประจำเครื่องแม่ข่ายตามที่กรรมการกำหนด เช่น 192.168.10.2/24",
      steps: [
        "เข้าสู่ Proxmox Shell หรือเปิดหน้า Web GUI เมนู System > Network",
        "ดับเบิลคลิกที่ Linux Bridge 'vmbr0' ระบุ IPv4/CIDR: 192.168.10.2/24 และ Gateway: 192.168.10.1",
        "หรือแก้ไขไฟล์ /etc/network/interfaces โดยตรง",
        "สั่ง ifreload -a เพื่ออัปเดตการตั้งค่าเครือข่ายทันที",
        "ทดสอบ ping ไปยัง Default Gateway ของวงเครือข่าย"
      ],
      lang: "bash",
      code: "# คอนฟิกใน /etc/network/interfaces:\nauto vmbr0\niface vmbr0 inet static\n    address 192.168.10.2/24\n    gateway 192.168.10.1\n    bridge-ports eno1\n    bridge-stp off\n    bridge-fd 0\n\n# สั่ง Apply คอนฟิกเครือข่าย:\nifreload -a\n\n# ตรวจสอบการเชื่อมต่อ:\nip a show vmbr0\nping -c 3 192.168.10.1",
      verify: "ip a show vmbr0 แสดง inet 192.168.10.2/24 และ ping 192.168.10.1 สำเร็จ"
    }
  ];
}

// 4. C7_1: ติดตั้งได้และบูตใช้งานได้ และเปิดอัตโนมัติเมื่อเปิดเครื่อง (On-Boot Autostart)
const c7_1 = items.find(x => x.id === 'c7_1');
if (c7_1) {
  c7_1.tabs = [
    {
      id: "virtualbox",
      label: "Oracle VirtualBox",
      icon: "Box",
      explanation: "ตั้งค่าให้ VM devops-server บูตทำงานอัตโนมัติทันทีเมื่อเปิดเครื่องคอมพิวเตอร์ (Headless Autostart)",
      steps: [
        "วิธีที่ 1 (สะดวกที่สุดบน Windows): ใช้คำสั่ง VBoxManage สตาร์ต VM แบบ Headless (ทำงานเบื้องหลังไม่เปิดหน้าต่าง)",
        "วิธีที่ 2: สร้าง Task ใน Windows Task Scheduler ให้รันสคริปต์สตาร์ต VM อัตโนมัติเมื่อ 'At system startup'",
        "วิธีที่ 3: ใช้ VirtualBox Autostart Service บน Host (เปิด autostart-enabled บน VM)"
      ],
      lang: "powershell",
      code: "# คำสั่งสตาร์ต VM แบบ Headless บน Windows:\n$VBOX = \"C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe\"\n& $VBOX startvm \"devops-server\" --type headless\n\n# เปิดฟังก์ชัน Autostart ของ VirtualBox:\n& $VBOX modifyvm \"devops-server\" --autostart-enabled on\n\n# ตรวจสอบสถานะ VM ที่กำลังรันอยู่:\n& $VBOX list runningvms",
      verify: "& 'C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe' list runningvms แสดง devops-server รันอยู่"
    },
    {
      id: "vmware",
      label: "VMware Workstation Pro",
      icon: "Cpu",
      explanation: "ตั้งค่า Autostart ให้ VM ทำงานอัตโนมัติเมื่อเปิดเครื่องผ่านเมนู Shared VMs หรือคำสั่ง vmrun",
      steps: [
        "ใน VMware Workstation 17 Pro: คลิกขวาที่ VM > Manage > Share...",
        "ย้าย VM ไปยังโฟลเดอร์ Shared VMs",
        "คลิกที่หัวข้อ 'Shared VMs' ในแถบเมนูด้านซ้าย > คลิกแท็บ 'Manage Auto Start VMs'",
        "ติ๊กถูกเลือก devops-server กำหนดให้บูตทำงานอัตโนมัติทันทีที่เปิดเครื่องคอมพิวเตอร์",
        "หรือใช้คำสั่ง vmrun -T ws start ... nogui ในสคริปต์ Startup ของระบบ"
      ],
      lang: "powershell",
      code: "# คำสั่งสตาร์ต VM เบื้องหลังผ่าน vmrun CLI:\n& \"C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe\" -T ws start \"C:\\VMs\\devops-server\\devops-server.vmx\" nogui\n\n# ตรวจสอบสถานะ VM ที่เปิดอยู่:\n& \"C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe\" list",
      verify: "vmrun list แสดง devops-server.vmx ในรายการ Running VMs"
    },
    {
      id: "proxmox",
      label: "Proxmox VE",
      icon: "Server",
      explanation: "ตั้งค่า On-Boot Autostart บน Proxmox เพื่อให้ VM บูตขึ้นมาอัตโนมัติทันทีที่ Server เปิดหรือไฟดับแล้วติดใหม่",
      steps: [
        "บนหน้า Proxmox Web GUI: คลิก VM 100 (devops-server) จากเมนูด้านซ้าย",
        "เลือกเมนู 'Options' ตรงกลางจอ > ดับเบิลคลิกที่ 'Start at boot'",
        "ติ๊กถูก [x] Enabled แล้วกด OK",
        "หรือรันคำสั่ง qm set 100 --onboot 1 บน Proxmox Shell",
        "ตรวจสอบค่า onboot: 1 ในไฟล์คอนฟิกของ VM"
      ],
      lang: "bash",
      code: "# คำสั่งตั้ง On-Boot ผ่าน Proxmox CLI:\nqm set 100 --onboot 1 --startup order=1,up=30\n\n# ตรวจสอบการตั้งค่า:\nqm config 100 | grep -E \"onboot|startup\"",
      verify: "qm config 100 แสดงบรรทัด onboot: 1 ชัดเจน"
    }
  ];
}

// Re-serialize
const newJson = JSON.stringify(items, null, 2);
fs.writeFileSync(filePath, prefix + newJson + suffix, 'utf8');
console.log('Successfully injected multi-hypervisor tabs into examQuestionsAndSolutions.js!');
