const fs = require('fs');

const sec2Items = [
  // --------------------------------------------------------------------------
  // ข้อ 2.1 (หน้า 10): ระบบ Virtualization
  // --------------------------------------------------------------------------
  {
    id: "c6_1",
    secId: "sec2",
    qNum: "ข้อ 2.1",
    pdfPage: 10,
    questionText: "ติดตั้งระบบ Virtualization เช่น Proxmox, VirtualBox, VMware\n- ติดตั้งระบบ Virtualization ได้ มี GUI ใช้งานได้",
    pts: 1,
    note: "",
    explanation: "ติดตั้งและเปิดใช้งานระบบ Hypervisor สำหรับจัดการ Virtual Machine โดยคณะกรรมการรองรับทั้ง Bare-metal (Proxmox VE 8.x) และ Type-2 Hypervisor บน Windows (VMware Workstation Pro 17+ ตามแนวทางศูนย์ฝึก VECSkill BNCC หรือ Oracle VirtualBox) พร้อมเข้าถึงหน้าจอบริหารจัดการ GUI ได้สมบูรณ์",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# ทางเลือกที่ 1: Proxmox VE (มาตรฐาน Bare-metal Type-1 Hypervisor)
# ==============================================================================
# เข้าสู่หน้า Web Management Interface ผ่านเว็บเบราว์เซอร์:
# URL: https://192.168.10.2:8006 (หรือ IP โฮสต์ที่กรรมการกำหนด)
# User: root | Realm: Linux PAM standard authentication | Password: <รหัสผ่านตอนติดตั้ง>

# ตรวจสอบสถานะการทำงานของ Hypervisor Service บน Shell:
pveversion -v
systemctl status pveproxy pvedaemon --no-pager

# ==============================================================================
# ทางเลือกที่ 2: VMware Workstation Pro 17+ (มาตรฐานศูนย์ฝึก VECSkill BNCC)
# ==============================================================================
# 1. เปิดโปรแกรม VMware Workstation Pro จาก Desktop
# 2. ไปที่เมนู Edit > Virtual Network Editor เพื่อตรวจสอบ Virtual Switches:
#    - VMnet0: Bridged (เชื่อมกับการ์ด LAN ภายนอก/อินเทอร์เน็ต)
#    - VMnet1: Host-Only Subnet 10.20.30.0/24 (สำหรับวง Intranet ภายใน)
#    - VMnet8: NAT Subnet 172.16.3.0/24 (สำหรับวง Service หลังบ้าน)

# ==============================================================================
# ทางเลือกที่ 3: Oracle VirtualBox (กรณีทดสอบบน Windows)
# ==============================================================================
VBoxManage --version
VBoxManage list vms`,
    steps: [
      "กรณี Proxmox: เปิดเบราว์เซอร์ไปยัง https://192.168.10.2:8006 ข้ามหน้าต่างเตือน SSL Self-signed เข้าสู่ระบบด้วยผู้ใช้ root (Realm: Linux PAM)",
      "กรณี VMware Workstation: เปิดโปรแกรม VMware Workstation Pro จากหน้า Desktop ตรวจสอบหน้าต่างหลักพร้อมใช้งาน",
      "ตรวจสอบแท็บสรุปทรัพยากร (Summary Dashboard) ให้แสดงสถานะ CPU Cores, RAM, และ Local Storage พร้อมสำหรับสร้าง VM"
    ],
    verify: "เข้าหน้าเว็บ Proxmox https://192.168.10.2:8006 แสดงแดชบอร์ดสีเขียว หรือเปิดหน้าต่าง VMware Workstation Pro / VirtualBox GUI พร้อมสร้าง VM"
  },
  {
    id: "c6_2",
    secId: "sec2",
    qNum: "ข้อ 2.1",
    pdfPage: 10,
    questionText: "ติดตั้งระบบ Virtualization\n- สร้าง VM ได้ตามแผนผัง มีโครงสร้างตามโจทย์",
    pts: 1,
    note: "",
    explanation: "สร้าง Virtual Machine สำหรับรัน Ubuntu Server 24.04/22.04 LTS กำหนดสเปกฮาร์ดแวร์ตามเกณฑ์การแข่งขันระดับ ปวส.: 2-4 vCPUs, RAM 4096MB (4GB) ขึ้นไป, Disk 32GB-50GB และเชื่อมต่อการ์ดเครือข่าย Virtual Network ให้ถูกต้องตามผัง",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# วิธีที่ 1: สร้าง VM ด้วย Proxmox CLI (VMID: 100)
# ==============================================================================
qm create 100 \\
  --name devops-server \\
  --ostype l26 \\
  --memory 4096 \\
  --cores 2 \\
  --cpu host \\
  --scsihw virtio-scsi-single \\
  --scsi0 local-lvm:32 \\
  --net0 virtio,bridge=vmbr0,firewall=1 \\
  --boot order=scsi0 \\
  --agent enabled=1

# ตรวจสอบการตั้งค่าสเปกของ VM:
qm config 100

# ==============================================================================
# วิธีที่ 2: สร้าง VM บน VMware Workstation (ตามคู่มือ VECSkill BNCC)
# ==============================================================================
# 1. คลิก File > New Virtual Machine > Custom (advanced)
# 2. Hardware Compatibility: Workstation 17.x
# 3. Guest OS: Linux > Version: Ubuntu 64-bit
# 4. VM Name: devops-server
# 5. Processors: Number of processors: 1, Number of cores per processor: 2 (รวม 2 Cores)
# 6. Memory: 4096 MB (4 GB)
# 7. Network: Custom (VMnet0 Bridged หรือ VMnet8 NAT ตามผัง)
# 8. Disk: Create a new virtual disk ขนาด 32 GB - 50 GB`,
    steps: [
      "บน Proxmox GUI: คลิก 'Create VM' ที่มุมขวาบน ระบุ VM ID: 100, Name: devops-server",
      "ในแท็บ OS: เลือก ISO Image ของ Ubuntu Server 24.04 หรือ 22.04 LTS",
      "ในแท็บ System/Disks: กำหนดขนาด Disk 32GB (VirtIO Block หรือ SCSI VirtIO)",
      "ในแท็บ CPU/Memory: กำหนด Cores = 2, Memory = 4096 MB",
      "ในแท็บ Network: เลือก Bridge vmbr0 และ Model: VirtIO (paravirtualized)",
      "กด Finish แล้วตรวจสอบรายชื่อ VM ในแถบเมนูด้านซ้ายว่ามีสถานะ '100 (devops-server)'"
    ],
    verify: "qm list หรือ VMware แสดง VM ชื่อ devops-server สเปก 2 vCPU, RAM 4GB, Disk 32GB"
  },
  {
    id: "c6_3",
    secId: "sec2",
    qNum: "ข้อ 2.1",
    pdfPage: 10,
    questionText: "ติดตั้งระบบ Virtualization\n- การตั้งค่า IP Address Virtualization ตามที่คณะกรรมการกำหนด",
    pts: 1,
    note: "",
    explanation: "กำหนด IP Address บนระบบ Virtualization โฮสต์ให้ถูกต้องตามที่คณะกรรมการกำหนด เช่น วงบริหารจัดการ 192.168.10.2/24 Gateway 192.168.10.1 หรือตามโครงสร้างเครือข่ายของศูนย์แข่งขัน",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# การตั้งค่า IP บน Proxmox โฮสต์ (/etc/network/interfaces):
# ==============================================================================
# sudo nano /etc/network/interfaces

auto lo
iface lo inet loopback

iface eno1 inet manual
# eno1 คือการ์ดแลนจริงบนเครื่องแม่ข่าย

auto vmbr0
iface vmbr0 inet static
    address 192.168.10.2/24
    gateway 192.168.10.1
    bridge-ports eno1
    bridge-stp off
    bridge-fd 0

# สั่ง Apply การตั้งค่าเครือข่ายใหม่ทันที:
ifreload -a

# ตรวจสอบสถานะการเชื่อมต่อ:
ip a show vmbr0
ping -c 3 192.168.10.1`,
    steps: [
      "เข้าสู่ Proxmox Shell (หรือต่อจอตรงเข้าเครื่องแม่ข่าย)",
      "แก้ไขไฟล์ /etc/network/interfaces กำหนด IP Address และ Subnet ของ vmbr0 ตามที่โจทย์ระบุ",
      "สั่ง ifreload -a หรือ systemctl restart networking เพื่อให้การตั้งค่ามีผล",
      "ทดสอบ ping ไปยัง Default Gateway ของวงเครือข่ายเพื่อยืนยันการเชื่อมต่อ"
    ],
    verify: "ip a show vmbr0 แสดง inet 192.168.10.2/24 และ ping เกตเวย์สำเร็จ 0% packet loss"
  },

  // --------------------------------------------------------------------------
  // ข้อ 2.2 (หน้า 10-11): ติดตั้ง Linux Server, Netplan, Hostname, DNS & ACL
  // --------------------------------------------------------------------------
  {
    id: "c7_1",
    secId: "sec2",
    qNum: "ข้อ 2.2",
    pdfPage: 10,
    questionText: "ติดตั้ง Linux Server บน VM โดย ISO ได้แก่ Ubuntu, Debian\n- ติดตั้งได้และบูตใช้งานได้ และเปิดอัตโนมัติเมื่อ Virtualization ดับแล้วเปิดขึ้นมาใหม่",
    pts: 1,
    note: "",
    explanation: "ติดตั้งระบบปฏิบัติการ Ubuntu Server 24.04/22.04 LTS บน VM ให้พร้อมบูตใช้งาน และเปิดคุณสมบัติ On-Boot Auto Start ให้เครื่อง VM สตาร์ตทำงานอัตโนมัติทันทีที่เครื่องแม่ข่าย Hypervisor บูตหรือไฟฟ้าดับแล้วเปิดขึ้นมาใหม่",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# วิธีที่ 1: กำหนด Auto-Start ผ่าน Proxmox CLI:
# ==============================================================================
# ตั้งค่า onboot=1 และกำหนดลำดับบูต Startup Order=1 หน่วงเวลา 30 วินาที:
qm set 100 --onboot 1 --startup order=1,up=30

# ตรวจสอบคอนฟิก:
qm config 100 | grep -E "onboot|startup"
# ผลลัพธ์ที่ถูกต้อง:
# onboot: 1
# startup: order=1,up=30

# ==============================================================================
# วิธีที่ 2: ตั้งค่าผ่าน Proxmox Web GUI:
# ==============================================================================
# 1. คลิกเลือก VM 100 (devops-server) จากเมนูด้านซ้าย
# 2. ไปที่เมนู "Options" ตรงกลางจอ
# 3. ดับเบิลคลิกที่หัวข้อ "Start at boot"
# 4. ติ๊กถูกที่ช่อง [x] Start at boot แล้วกด OK`,
    steps: [
      "บูต VM ติดตั้ง Ubuntu Server ผ่านหน้าจอ Proxmox Console จนเสร็จสมบูรณ์ และสั่งรีบูต 1 ครั้ง",
      "บน Proxmox Web GUI: คลิก VM 100 > เลือกเมนู Options > ดับเบิลคลิก 'Start at boot' > ติ๊กถูก [x] Enabled > กด OK",
      "หรือรันคำสั่ง qm set 100 --onboot 1 บน Proxmox Shell",
      "ตรวจสอบโดยการสั่ง qm config 100 จะต้องพบบรรทัด onboot: 1"
    ],
    verify: "qm config 100 | grep \"onboot: 1\" แสดง onboot: 1 อย่างชัดเจน"
  },
  {
    id: "c7_2",
    secId: "sec2",
    qNum: "ข้อ 2.2",
    pdfPage: 10,
    questionText: "ติดตั้ง Linux Server บน VM\n- ตั้งค่า IP แบบ Static / DHCP ได้ถูกต้องตามผังที่กรรมการกำหนดให้",
    pts: 1,
    note: "",
    explanation: "กำหนด Static IP Address ให้กับ Ubuntu Server ผ่าน Netplan ตามมาตรฐานทางการของศูนย์ฝึก VECSkill BNCC โดยระบุ IP Address, Gateway และ DNS Nameservers ให้ถูกต้องตามแผนผังเครือข่าย",
    solutionType: "code",
    lang: "yaml",
    code: `# 1. สำรองไฟล์คอนฟิก Netplan เดิมก่อนแก้ไข:
# sudo cp /etc/netplan/50-cloud-init.yaml /etc/netplan/50-cloud-init.yaml.bak (หรือ 00-installer-config.yaml)

# 2. แก้ไขไฟล์คอนฟิก (สำคัญ: ห้ามใช้ TAB ให้ใช้ Space 2 ช่องในการย่อหน้า):
# sudo nano /etc/netplan/50-cloud-init.yaml

network:
  version: 2
  renderer: networkd
  ethernets:
    ens33: # หรือ eth0 / ens18 (ตรวจสอบชื่อการ์ดด้วยคำสั่ง ip link)
      dhcp4: false
      addresses:
        - 192.168.10.10/24
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses:
          - 192.168.10.10   # ชี้เข้า Technitium DNS ของตนเอง
          - 8.8.8.8          # สำรองออกภายนอก
        search:
          - competition.lab # หรือ vecskill.ovec

# 3. สั่ง Apply การตั้งค่า Netplan:
# sudo chmod 600 /etc/netplan/50-cloud-init.yaml
# sudo netplan apply

# 4. ตรวจสอบผลลัพธ์:
# ip a show ens33
# ip route show`,
    steps: [
      "รันคำสั่ง ip link เพื่อดูชื่อ Interface การ์ดแลนจริงของเครื่อง (เช่น ens18 หรือ ens33)",
      "แก้ไขไฟล์คอนฟิก Netplan ใน /etc/netplan/ ด้วย sudo nano ระบุ static IP 192.168.10.10/24 และ gateway 192.168.10.1",
      "รักษาระยะย่อหน้า (Indentation) ในไฟล์ YAML ให้เป็น Space คู่ ห้ามใช้ Tab เด็ดขาด",
      "สั่ง sudo netplan apply แล้วตรวจสอบด้วยคำสั่ง ip a และ ip route show"
    ],
    verify: "ip a คืนค่า inet 192.168.10.10/24 และ ip route คืนค่า default via 192.168.10.1"
  },
  {
    id: "c7_3",
    secId: "sec2",
    qNum: "ข้อ 2.2",
    pdfPage: 10,
    questionText: "ติดตั้ง Linux Server บน VM\n- ตั้งค่า hostname และ Domain name ตามที่คณะกรรมการกำหนด",
    pts: 1,
    note: "",
    explanation: "ตั้งชื่อ Hostname และ Full Domain Name ให้กับ Server ตามที่กรรมการกำหนด (เช่น devops-server.competition.lab หรือ devops-server.vecskill.ovec) และอัปเดตไฟล์ /etc/hosts เพื่อให้ระบบและ Docker อ้างอิงชื่อเครื่องได้ถูกต้องโดยไม่ติด Loopback error",
    solutionType: "code",
    lang: "bash",
    code: `# 1. ตั้งค่า Hostname ของระบบผ่าน hostnamectl:
sudo hostnamectl set-hostname devops-server

# 2. แก้ไขไฟล์ /etc/hosts ให้ผูก IP เข้ากับ Hostname และ FQDN:
# sudo nano /etc/hosts
# เพิ่ม/แก้ไขบรรทัด 127.0.1.1:
# 127.0.0.1   localhost
# 127.0.1.1   devops-server.competition.lab devops-server

# 3. ตรวจสอบการตั้งชื่อเครื่อง:
hostname
hostname -f
cat /etc/hostname`,
    steps: [
      "รันคำสั่ง sudo hostnamectl set-hostname devops-server (หรือชื่อตามโจทย์)",
      "เปิดไฟล์ /etc/hosts ด้วย sudo nano แล้วปรับแก้บรรทัด 127.0.1.1 ให้มีชื่อโฮสต์และโดเมนตามโจทย์",
      "ทดสอบรันคำสั่ง hostname และ hostname -f ตรวจสอบว่าแสดงชื่อตรงตามที่กรรมการระบุ"
    ],
    verify: "hostname แสดง devops-server และ hostname -f แสดง devops-server.competition.lab"
  },
  {
    id: "c8_1",
    secId: "sec2",
    qNum: "ข้อ 2.2",
    pdfPage: 11,
    questionText: "การติดตั้งและใช้งาน DNS Server ใน Network ของตนเอง\n- มีการติดตั้งและใช้งาน DNS Server ใน Network ของตนเอง บน Docker หรือ Linux Server ตามชื่อที่กรรมการกำหนด โดยเครื่องลูกข่ายสามารถเรียกใช้งาน DNS Server ได้ (หมายเหตุ: ตั้งค่าบน Router หรือ Switch หรือ Hosts จะไม่ได้คะแนน)",
    pts: 1,
    note: "ตั้งค่าบน Router หรือ Switch หรือ Hosts จะไม่ได้คะแนน",
    explanation: "ติดตั้ง Technitium DNS Server ผ่าน Docker บนพอร์ต 53 (DNS) และ 5380 (Web UI) พร้อมปิด systemd-resolved DNSStubListener เพื่อแก้ปัญหาพอร์ต 53 ชน และสร้าง Primary Zone พร้อม A Records ชี้ชื่อบริการทั้งหมดไปยัง IP Server เพื่อให้เครื่องลูกข่าย Resolve ได้จริง",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# ขั้นตอนที่ 1: ปลดล็อกพอร์ต 53 จาก systemd-resolved (เทคนิคทางการจาก VECSkill BNCC)
# บน Ubuntu Server ค่าเริ่มต้น systemd-resolved จะจองพอร์ต 53 ไว้ ทำให้รัน DNS Container ไม่ได้
# ==============================================================================
sudo sed -i 's/^#\\?DNSStubListener=.*/DNSStubListener=no/' /etc/systemd/resolved.conf
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
sudo systemctl restart systemd-resolved

# ==============================================================================
# ขั้นตอนที่ 2: รัน Technitium DNS Server Container
# ==============================================================================
docker volume create dns_config

docker run -d \\
  --name technitium-dns \\
  --hostname dns-server \\
  --restart unless-stopped \\
  -p 53:53/udp \\
  -p 53:53/tcp \\
  -p 5380:5380/tcp \\
  -e DNS_SERVER_ADMIN_PASSWORD=AdminPassword123! \\
  --cap-add=NET_ADMIN \\
  -v dns_config:/etc/dns \\
  technitium/dns-server:latest

# ==============================================================================
# ขั้นตอนที่ 3: เพิ่ม Primary Zone และ A Records ใน Technitium Web GUI (http://192.168.10.10:5380)
# ==============================================================================
# 1. เข้าสู่หน้าเว็บ: http://192.168.10.10:5380 (User: admin / Pass: AdminPassword123!)
# 2. ไปที่เมนู "Zones" > คลิกปุ่ม "Add Zone":
#    - Zone Type: Primary
#    - Zone Name: competition.lab (หรือ vecskill.ovec ตามโจทย์) > คลิก "Add"
# 3. คลิกเข้าไปที่ Zone ที่เพิ่งสร้าง > คลิกปุ่ม "Add Record":
#    - Type: A | Name: @        | IP Address: 192.168.10.10
#    - Type: A | Name: gitlab   | IP Address: 192.168.10.10
#    - Type: A | Name: registry | IP Address: 192.168.10.10
#    - Type: A | Name: app      | IP Address: 192.168.10.10
#    - Type: A | Name: dns      | IP Address: 192.168.10.10

# ==============================================================================
# ขั้นตอนที่ 4: ตรวจสอบการทำงานจากเครื่อง Client ด้วยคำสั่ง dig หรือ nslookup
# ==============================================================================
dig @192.168.10.10 gitlab.competition.lab +short
# หรือบน Windows:
nslookup gitlab.competition.lab 192.168.10.10`,
    steps: [
      "แก้ปัญหา Ubuntu จองพอร์ต 53 ด้วยการแก้ไข /etc/systemd/resolved.conf ให้ DNSStubListener=no แล้ว restart systemd-resolved",
      "รัน Docker Container ของ Technitium DNS ด้วย image technitium/dns-server:latest พร้อมเปิดพอร์ต 53 และ 5380",
      "เปิดเว็บเบราว์เซอร์เข้าสู่ http://192.168.10.10:5380 ล็อกอินด้วย admin / AdminPassword123!",
      "ไปที่เมนู Zones > Add Zone > เลือก Primary Zone ชื่อ competition.lab (หรือชื่อตามโจทย์)",
      "เพิ่ม A Record ชี้ gitlab, registry, app ไปที่ IP ของเซิร์ฟเวอร์ (192.168.10.10)",
      "ทดสอบ Query จากเครื่อง Client ด้วยคำสั่ง nslookup gitlab.competition.lab 192.168.10.10 ต้องได้คำตอบ 192.168.10.10"
    ],
    verify: "nslookup gitlab.competition.lab 192.168.10.10 คืนค่า Address: 192.168.10.10"
  },
  {
    id: "c8_2",
    secId: "sec2",
    qNum: "ข้อ 2.2",
    pdfPage: 11,
    questionText: "การควบคุมการเข้าถึง DNS Server (ACL)\n- กำหนดการเข้าถึง DNS Server ใน Network โดยใช้ IP Address ที่กำหนดเท่านั้น (ACL)",
    pts: 1,
    note: "",
    explanation: "กำหนด Access Control List (ACL) บน Technitium DNS เพื่อจำกัดสิทธิ์การ Query ให้เฉพาะ Subnet ใน Network ที่ได้รับอนุญาตเท่านั้น (เช่น 192.168.10.0/24, 192.168.20.0/24) ส่วน Subnet อื่นจะถูกปฏิเสธ (Refused/Denied) ตามเกณฑ์ข้อสอบ",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# ขั้นตอนการตั้งค่า DNS ACL บนหน้าเว็บ Technitium DNS GUI:
# ==============================================================================
# 1. เข้าสู่หน้าเว็บ: http://192.168.10.10:5380 แล้วล็อกอิน
# 2. ไปที่เมนู "Settings" ด้านบน > เลือกหัวข้อ "DNS Server Settings"
# 3. ในส่วน "DNS Client Access" (หรือ Allowed Networks):
#    - เปลี่ยนจาก "Allow Any" เป็น "Restricted" (หรือ "Allow List")
#    - ใส่ Subnet ที่กรรมการอนุญาต (คั่นด้วยเครื่องหมายจุลภาค):
#      192.168.10.0/24, 192.168.20.0/24, 192.168.30.0/24, 127.0.0.1/32
# 4. เลื่อนลงล่างสุดแล้วกดปุ่ม "Save Settings"

# ==============================================================================
# การทดสอบตรวจผล (Verification):
# ==============================================================================
# 1. ทดสอบส่ง Query จาก IP ที่อยู่ในวงที่อนุญาต (เช่น 192.168.20.x):
dig @192.168.10.10 gitlab.competition.lab
# ผลลัพธ์: status: NOERROR พร้อมแสดงคำตอบ A Record 192.168.10.10

# 2. ทดสอบส่ง Query จาก IP นอกวงที่อนุญาต (เช่น IP ทดสอบ 10.0.0.99):
dig @192.168.10.10 gitlab.competition.lab
# ผลลัพธ์: status: REFUSED หรือ Connection Refused`,
    steps: [
      "เปิดหน้าต่างเบราว์เซอร์เข้า Technitium DNS http://192.168.10.10:5380",
      "ไปที่เมนู Settings > DNS Server Settings",
      "ในหัวข้อ DNS Client Access / Allowed Networks เลือกตัวเลือก 'Restricted'",
      "พิมพ์ระบุ Subnets ที่กรรมการอนุญาต เช่น 192.168.10.0/24, 192.168.20.0/24 แล้วกด Save Settings",
      "ทดสอบ Query จากเครื่องใน Subnet ที่อนุญาต จะได้ผลลัพธ์ปกติ (NOERROR)",
      "ทดสอบ Query จาก IP อื่นนอกกลุ่มที่ระบุ ผลลัพธ์จะถูกปฏิเสธ (REFUSED)"
    ],
    verify: "dig @192.168.10.10 จาก IP ในวงอนุญาตคืนค่า NOERROR และจาก IP นอกวงคืนค่า REFUSED"
  },

  // --------------------------------------------------------------------------
  // ข้อ 2.3 (หน้า 11): Remote SSH, Users, Firewall, Sudo NOPASSWD
  // --------------------------------------------------------------------------
  {
    id: "c9_1",
    secId: "sec2",
    qNum: "ข้อ 2.3",
    pdfPage: 11,
    questionText: "บริหารจัดการจากระยะไกล SSH / Remote Tools\n- เปิดบริการ SSH",
    pts: 1,
    note: "",
    explanation: "เปิดใช้งาน OpenSSH Server บน Linux Server ให้บริการเริ่มทำงานโดยอัตโนมัติเมื่อบูตระบบ พร้อมเปิดพอร์ตรับการเชื่อมต่อจากระยะไกล",
    solutionType: "code",
    lang: "bash",
    code: `# 1. ติดตั้งและเปิดบริการ SSH:
sudo apt update && sudo apt install -y openssh-server

# 2. เปิดใช้งาน Service และสั่งให้รันอัตโนมัติตอนบูต:
sudo systemctl enable --now ssh

# 3. ตรวจสอบสถานะการทำงาน:
sudo systemctl status ssh --no-pager`,
    steps: [
      "รันคำสั่ง sudo apt install -y openssh-server",
      "สั่ง sudo systemctl enable --now ssh เพื่อเปิดบริการทันทีและผูก Autostart ตอนบูต",
      "ตรวจสอบสถานะด้วย sudo systemctl status ssh ให้แสดง Active: active (running)"
    ],
    verify: "systemctl is-active ssh คืนค่า 'active'"
  },
  {
    id: "c9_2",
    secId: "sec2",
    qNum: "ข้อ 2.3",
    pdfPage: 11,
    questionText: "บริหารจัดการจากระยะไกล SSH / Remote Tools\n- เพิ่ม User ตามที่กรรมการกำหนดได้ อย่างน้อย 2 User",
    pts: 1,
    note: "",
    explanation: "สร้างผู้ใช้งาน (Users) ในระบบ Linux ตามชื่อที่กรรมการกำหนดอย่างน้อย 2 บัญชี พร้อมกำหนดรหัสผ่านและสร้าง Home Directory ให้เรียบร้อย",
    solutionType: "code",
    lang: "bash",
    code: `# 1. สร้างผู้ใช้คนที่ 1 (เช่น devops หรือ examuser1):
sudo useradd -m -s /bin/bash devops
echo "devops:VECSki11@0vec2025" | sudo chpasswd
sudo usermod -aG sudo devops

# 2. สร้างผู้ใช้คนที่ 2 (เช่น auditor หรือ examuser2):
sudo useradd -m -s /bin/bash auditor
echo "auditor:AuditorPass123!" | sudo chpasswd

# 3. ตรวจสอบรายชื่อผู้ใช้ที่สร้างในระบบ:
getent passwd devops auditor`,
    steps: [
      "รันคำสั่ง sudo useradd -m -s /bin/bash devops เพื่อสร้างผู้ใช้พร้อมไดเรกทอรี /home/devops",
      "ตั้งรหัสผ่านด้วยคำสั่ง chpasswd",
      "สร้างผู้ใช้คนที่สอง (เช่น auditor) ด้วยขั้นตอนเดียวกัน",
      "ตรวจสอบใน /etc/passwd หรือด้วย getent passwd ว่าพบผู้ใช้ทั้งสองคน"
    ],
    verify: "getent passwd devops auditor แสดงข้อมูลทั้ง 2 ผู้ใช้พร้อม home directory"
  },
  {
    id: "c9_3",
    secId: "sec2",
    qNum: "ข้อ 2.3",
    pdfPage: 11,
    questionText: "บริหารจัดการจากระยะไกล SSH / Remote Tools\n- Remote จากเครื่องอื่นใน Network เข้ามาได้ด้วย user และ Port ที่กรรมการกำหนด",
    pts: 1,
    note: "",
    explanation: "ปรับแต่งพอร์ต SSH ในไฟล์คอนฟิก /etc/ssh/sshd_config ตามที่กรรมการกำหนด (เช่น พอร์ต 22 หรือพอร์ตพิเศษ เช่น 2222) และทดสอบ Remote SSH เข้ามาจากเครื่องอื่นใน Network ได้สำเร็จ",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# บน Server: กำหนดพอร์ต SSH ใน /etc/ssh/sshd_config
# ==============================================================================
# sudo nano /etc/ssh/sshd_config
# แก้ไข/เพิ่มบรรทัด:
# Port 22
# PermitRootLogin no
# PasswordAuthentication yes

# รีสตาร์ต SSH Daemon:
sudo systemctl restart sshd

# ==============================================================================
# บนเครื่องลูกข่าย (Client Terminal / PowerShell / PuTTY):
# ==============================================================================
ssh -p 22 devops@192.168.10.10
# หรือ
ssh -p 22 auditor@192.168.10.10`,
    steps: [
      "ตรวจสอบไฟล์ /etc/ssh/sshd_config ให้แน่ใจว่า Port ตรงตามที่โจทย์ระบุ และ PermitRootLogin no",
      "สั่ง sudo systemctl restart sshd เพื่อโหลดคอนฟิกใหม่",
      "เปิด Terminal หรือ PowerShell จากเครื่องคอมพิวเตอร์ Client ใน Network",
      "พิมพ์คำสั่ง ssh -p <port> <user>@192.168.10.10 แล้วใส่รหัสผ่านเพื่อเข้าสู่ระบบ"
    ],
    verify: "สามารถ Login เข้าสู่ Bash Shell ของ Server จากเครื่อง Client ผ่าน SSH ได้สำเร็จ"
  },
  {
    id: "c9_4",
    secId: "sec2",
    qNum: "ข้อ 2.3",
    pdfPage: 11,
    questionText: "บริหารจัดการจากระยะไกล SSH / Remote Tools\n- ตั้งค่า firewall (UFW / firewalld) เพื่อเปิดพอร์ตบริการได้ ตามที่กรรมการกำหนด",
    pts: 1,
    note: "",
    explanation: "เปิดใช้งานระบบไฟร์วอลล์ UFW (Uncomplicated Firewall) บน Ubuntu Server กำหนดนโยบาย Default Deny และเปิดเฉพาะพอร์ตบริการที่กรรมการกำหนดและจำเป็นต่อระบบ DevOps ครบถ้วนตามมาตรฐาน VECSkill",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# การตั้งค่า UFW Firewall ตามมาตรฐานศูนย์สอบ DevOps VECSkill BNCC
# ==============================================================================
# 1. กำหนดนโยบายเริ่มต้น: ปิดกั้นขาเข้าทั้งหมด และอนุญาตขาออก
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 2. เปิดพอร์ตบริการตามมาตรฐานการแข่งขัน:
sudo ufw allow 22/tcp comment 'SSH Remote Access'
sudo ufw allow 80/tcp comment 'HTTP Web Traffic'
sudo ufw allow 443/tcp comment 'HTTPS Caddy Traffic'
sudo ufw allow 53/tcp comment 'DNS TCP'
sudo ufw allow 53/udp comment 'DNS UDP'
sudo ufw allow 5380/tcp comment 'Technitium DNS Web UI'
sudo ufw allow 5000/tcp comment 'Docker Private Registry'
sudo ufw allow 8080/tcp comment 'Registry UI / Web App'
sudo ufw allow 2222/tcp comment 'GitLab SSH'
sudo ufw allow 9443/tcp comment 'Portainer HTTPS'

# 3. เปิดใช้งาน Firewall และตรวจสอบสถานะ:
sudo ufw --force enable
sudo ufw status verbose`,
    steps: [
      "กำหนด Default Policy: sudo ufw default deny incoming และ sudo ufw default allow outgoing",
      "อนุญาตพอร์ตที่จำเป็น: 22 (SSH), 80/443 (Web/Proxy), 53 (DNS), 5380 (DNS GUI), 5000 (Registry), 2222 (GitLab SSH)",
      "สั่งเปิดใช้งาน: sudo ufw enable แล้วกด 'y' ยืนยัน",
      "ตรวจสอบสถานะด้วย sudo ufw status verbose ให้แสดง Status: active พร้อมรายการพอร์ตที่อนุญาต"
    ],
    verify: "sudo ufw status verbose แสดง Status: active และเปิดพอร์ต 22, 80, 443, 53, 5000 ครบถ้วน"
  },
  {
    id: "c9_5",
    secId: "sec2",
    qNum: "ข้อ 2.3",
    pdfPage: 11,
    questionText: "บริหารจัดการจากระยะไกล SSH / Remote Tools\n- กำหนดให้ user ที่ Login เข้ามาสามารถใช้คำสั่ง sudo -i โดยไม่ต้องยืนยันรหัสผ่าน",
    pts: 1,
    note: "",
    explanation: "กำหนดสิทธิ์ Sudoers ให้กับผู้ใช้ที่กำหนด (เช่น devops) ในไฟล์ /etc/sudoers.d/ ให้สามารถยกระดับสิทธิ์เป็น Root ด้วยคำสั่ง sudo -i หรือคำสั่ง sudo ใดๆ โดยไม่ต้องถามรหัสผ่าน (NOPASSWD)",
    solutionType: "code",
    lang: "bash",
    code: `# 1. สร้างไฟล์สิทธิ์ Sudoers แบบ NOPASSWD ใน /etc/sudoers.d/ (วิธีที่ปลอดภัยตามมาตรฐาน):
echo "devops ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/devops-nopasswd

# 2. ปรับสิทธิ์ความปลอดภัยของไฟล์ให้เป็น 0440 (Read-only by root):
sudo chmod 0440 /etc/sudoers.d/devops-nopasswd

# 3. ตรวจสอบไวยากรณ์ของไฟล์คอนฟิก sudoers ด้วย visudo:
sudo visudo -c -f /etc/sudoers.d/devops-nopasswd

# 4. ทดสอบใช้งานจากผู้ใช้ devops:
sudo -u devops sudo -i -n whoami
# ผลลัพธ์: root (เข้าได้ทันทีโดยไม่ถามรหัสผ่าน)`,
    steps: [
      "สร้างไฟล์คอนฟิกยกระดับสิทธิ์: echo \"devops ALL=(ALL) NOPASSWD: ALL\" | sudo tee /etc/sudoers.d/devops-nopasswd",
      "กำหนด Permission ไฟล์เป็น 0440 ด้วยคำสั่ง sudo chmod 0440 /etc/sudoers.d/devops-nopasswd",
      "ตรวจสอบความถูกต้องของไฟล์ด้วยคำสั่ง sudo visudo -c",
      "ทดสอบสลับเป็น root ด้วย sudo -i จาก user devops จะต้องเข้าสู่ prompt root@devops-server ทันทีโดยไม่ต้องพิมพ์ Password"
    ],
    verify: "รัน sudo -i จาก user devops เข้าสู่ prompt root# ได้ทันทีโดยไม่ถามรหัสผ่าน"
  },

  // --------------------------------------------------------------------------
  // ข้อ 2.4 (หน้า 11): Docker Engine & GitLab CE
  // --------------------------------------------------------------------------
  {
    id: "c10_1",
    secId: "sec2",
    qNum: "ข้อ 2.4",
    pdfPage: 11,
    questionText: "ติดตั้งเครื่องมือ DevOps ได้แก่ Docker + GitLab\n- ติดตั้ง Docker ได้และใช้งานได้ เช่น docker ps, run, exec",
    pts: 1,
    note: "",
    explanation: "ติดตั้ง Docker Engine (Community Edition) และ Docker Compose Plugin บน Ubuntu Server พร้อมเพิ่มผู้ใช้เข้าสู่ docker group เพื่อให้สามารถใช้งานคำสั่ง docker ps, run, exec ได้โดยไม่ต้องใช้ sudo",
    solutionType: "code",
    lang: "bash",
    code: `# 1. ถอดถอนแพ็กเกจรุ่นเก่าออก:
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove -y $pkg; done

# 2. ติดตั้ง Docker Engine จาก Official Repository:
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \\
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. เพิ่ม User เข้า docker group เพื่อรันคำสั่งโดยไม่ต้อง sudo:
sudo usermod -aG docker $USER
sudo usermod -aG docker devops

# 4. ทดสอบคำสั่ง Docker พื้นฐาน:
docker --version
docker run --rm hello-world
docker ps -a`,
    steps: [
      "ติดตั้ง Docker Engine และ Docker Compose ผ่าน Official APT Repository ของ Docker",
      "เพิ่มสิทธิ์ให้ user ปัจจุบันและ devops เข้ากลุ่ม docker: sudo usermod -aG docker devops",
      "ทดสอบคำสั่ง docker --version และ docker run --rm hello-world",
      "ตรวจสอบสถานะ container ด้วย docker ps -a ต้องทำงานได้สมบูรณ์"
    ],
    verify: "docker ps และ docker run --rm hello-world ทำงานสำเร็จโดยไม่ติด permission denied"
  },
  {
    id: "c10_2",
    secId: "sec2",
    qNum: "ข้อ 2.4",
    pdfPage: 11,
    questionText: "ติดตั้งเครื่องมือ DevOps\n- ติดตั้ง GitLab ได้ใน container หรือ VM โดยเข้าเว็บได้",
    pts: 1,
    note: "",
    explanation: "ติดตั้ง GitLab Community Edition (CE) ผ่าน Docker Compose โดยกำหนด GITLAB_OMNIBUS_CONFIG ให้ listen พอร์ต 80 ภายใน และส่งต่อผ่าน Reverse Proxy (Caddy) เพื่อให้บริการ HTTPS ภายนอก พร้อมดึงรหัสผ่านเริ่มต้นของ root",
    solutionType: "code",
    lang: "yaml",
    code: `# 1. สร้าง Docker Network ส่วนกลาง (ทำครั้งเดียว):
# sudo docker network create app_net

# 2. สร้างไฟล์ docker-compose.yml สำหรับ GitLab CE:
# sudo nano /srv/gitlab/docker-compose.yml

version: '3.8'

services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: gitlab
    restart: always
    hostname: 'gitlab.competition.lab' # หรือ gitlab.vecskill.ovec
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.competition.lab'
        nginx['listen_port'] = 80
        nginx['listen_https'] = false
        letsencrypt['enable'] = false
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        prometheus_monitoring['enable'] = false
        nginx['real_ip_header'] = 'X-Forwarded-For'
        nginx['real_ip_recursive'] = 'on'
        nginx['real_ip_trusted_addresses'] = ['172.16.0.0/12','192.168.0.0/16','10.0.0.0/8']
    ports:
      - '2222:22' # พอร์ต SSH สำหรับ Git Clone
    shm_size: "1g"
    volumes:
      - 'gitlab_config:/etc/gitlab'
      - 'gitlab_logs:/var/log/gitlab'
      - 'gitlab_data:/var/opt/gitlab'
    networks:
      - app_net

networks:
  app_net:
    external: true

volumes:
  gitlab_config:
  gitlab_logs:
  gitlab_data:

# 3. รันคอนเทนเนอร์:
# docker compose up -d

# 4. ค้นหารหัสผ่านเริ่มต้นของ root (รอประมาณ 2-5 นาทีให้ระบบบูตเสร็จ):
# sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password`,
    steps: [
      "สร้าง shared network: docker network create app_net",
      "สร้างโฟลเดอร์และไฟล์ docker-compose.yml สำหรับ gitlab-ce ตามคอนฟิกข้างต้น",
      "สั่ง docker compose up -d แล้วรอ 3-5 นาทีให้ GitLab Healthcheck ขึ้นสถานะ healthy",
      "ดึงรหัสผ่านเริ่มต้นของ root ด้วยคำสั่ง: sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password",
      "เปิดเว็บเบราว์เซอร์เข้าสู่ https://gitlab.competition.lab (หรือผ่าน IP) ล็อกอินด้วย root และรหัสผ่านที่ได้"
    ],
    verify: "เปิดเบราว์เซอร์เข้าหน้าเว็บ GitLab แสดงหน้าล็อกอิน และสามารถล็อกอินด้วย root ได้สำเร็จ"
  },
  {
    id: "c10_3",
    secId: "sec2",
    qNum: "ข้อ 2.4",
    pdfPage: 11,
    questionText: "ติดตั้งเครื่องมือ DevOps\n- สร้าง User ใน Gitlab และเข้าหน้า UI ได้",
    pts: 1,
    note: "",
    explanation: "สร้างบัญชีผู้ใช้งานใหม่ใน GitLab ผ่านหน้าจอ Admin Area UI หรือ Rails Console พร้อมกำหนดสิทธิ์ สมาชิกกลุ่ม และทดสอบล็อกอินเข้าสู่ GitLab Dashboard ด้วยผู้ใช้ใหม่ได้จริง",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# วิธีที่ 1: สร้างผ่าน GitLab Web Admin UI (วิธีมาตรฐานในการสอบ):
# ==============================================================================
# 1. ล็อกอินเข้า GitLab ด้วยบัญชี root
# 2. คลิกไอคอน "Admin Area" (รูปประแจ หรือเมนู Admin มุมซ้ายล่าง/บน)
# 3. ไปที่เมนู Overview > Users > คลิกปุ่ม "New user"
# 4. กรอกข้อมูล:
#    - Name: DevOps Candidate
#    - Username: devops
#    - Email: devops@competition.lab
#    - Access level: Regular (หรือ Administrator)
# 5. คลิก "Create user" แล้วไปที่แท็บ "Password" กำหนดรหัสผ่านใหม่ เช่น VECSki11@0vec2025
# 6. ออกจากระบบ (Sign Out) แล้วทดสอบล็อกอินด้วย user: devops

# ==============================================================================
# วิธีที่ 2: สร้างผ่าน GitLab Rails Console CLI (รวดเร็วทันใจ):
# ==============================================================================
docker exec -it gitlab gitlab-rails runner "
user = User.new(name: 'DevOps User', username: 'devops', email: 'devops@competition.lab')
user.password = 'VECSki11@0vec2025'
user.password_confirmation = 'VECSki11@0vec2025'
user.skip_confirmation!
user.save!
puts 'User devops created successfully!'
"`,
    steps: [
      "ล็อกอินเข้า GitLab Web UI ด้วยบัญชี root",
      "เข้าสู่ Admin Area > เมนู Users > คลิกปุ่ม 'New user'",
      "กรอก Username: devops, Email: devops@competition.lab และกำหนดรหัสผ่าน",
      "กด Sign out ออกจากบัญชี root",
      "ทดสอบ Sign in ด้วย Username: devops และรหัสผ่านที่ตั้งไว้ ตรวจสอบว่าเข้าหน้า Dashboard ของตนเองได้สมบูรณ์"
    ],
    verify: "สามารถล็อกอินเข้าสู่ GitLab UI ด้วย user ใหม่ (devops) และแสดงหน้าแดชบอร์ดโครงการได้"
  },

  // --------------------------------------------------------------------------
  // ข้อ 2.5 (หน้า 12): Dockerfile, Caddy Internal CA, Reverse Proxy, Compose
  // --------------------------------------------------------------------------
  {
    id: "c11_1",
    secId: "sec2",
    qNum: "ข้อ 2.5",
    pdfPage: 12,
    questionText: "เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนา ได้",
    pts: 1,
    note: "",
    explanation: "เขียน Dockerfile สำหรับแอปพลิเคชัน Node.js / Express หรือ Frontend ที่พัฒนาขึ้น โดยใช้เทคนิค Multi-stage Build ตามมาตรฐานทางการของ VECSkill เพื่อลดขนาดอิมเมจ และจัดการสิทธิ์ความปลอดภัย",
    solutionType: "code",
    lang: "dockerfile",
    code: `# ==============================================================================
# Production-ready Dockerfile สำหรับ Node.js Application (Multi-stage Build)
# ==============================================================================
# Stage 1: Build Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# คัดลอก package.json เพื่อทำ Docker Layer Cache
COPY package*.json ./
RUN npm ci || npm install

# คัดลอก Source Code ทั้งหมดและทำการ Build
COPY . .
# RUN npm run build (หากเป็น TypeScript / Frontend framework)

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# คัดลอกเฉพาะไฟล์ที่จำเป็นสำหรับ Runtime จาก builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
# COPY --from=builder /app/dist ./dist (ถ้ามี)

# ใช้งานผู้ใช้ node (Non-root user เพื่อความปลอดภัยตามเกณฑ์)
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]`,
    steps: [
      "สร้างไฟล์ Dockerfile ภายในไดเรกทอรีโปรเจกต์ของระบบที่พัฒนา",
      "เขียนคำสั่ง Multi-stage build โดยใช้ Base image node:20-alpine เพื่อประหยัดพื้นที่",
      "คัดลอก package.json สั่ง npm ci และคัดลอกโค้ดต้นฉบับ",
      "ทดสอบ Build อิมเมจด้วยคำสั่ง: docker build -t competition-app:v1 .",
      "ทดสอบรันด้วยคำสั่ง: docker run -d -p 3000:3000 --name test-app competition-app:v1 และตรวจสอบผล"
    ],
    verify: "docker build -t competition-app:v1 . ผ่านสำเร็จ 100% และ docker run รันคอนเทนเนอร์ได้"
  },
  {
    id: "c11_2",
    secId: "sec2",
    qNum: "ข้อ 2.5",
    pdfPage: 12,
    questionText: "เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ docker-compose.yaml สำหรับบริการ reverse proxy เพื่อใช้บริการ https (caddy, NPM)",
    pts: 1,
    note: "",
    explanation: "ติดตั้ง Caddy Reverse Proxy ผ่าน docker-compose.yaml โดยใช้เทคนิค 'tls internal' (Internal CA) ตามแนวทางทางการของศูนย์ฝึก VECSkill BNCC เพื่อให้ระบบออกใบรับรอง SSL HTTPS ภายใน Local Network ได้อย่างสมบูรณ์แบบโดยไม่ต้องต่ออินเทอร์เน็ต และนำ Root CA ไปติดตั้งบนเครื่อง Client เพื่อให้เบราว์เซอร์แสดงกุญแจเขียวปลอดภัย",
    solutionType: "code",
    lang: "yaml",
    code: `# ==============================================================================
# ไฟล์ docker-compose.yml สำหรับ Caddy Reverse Proxy & Internal CA:
# ==============================================================================
version: '3.8'

services:
  caddy:
    image: caddy:latest
    container_name: caddy-proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - app_net

networks:
  app_net:
    external: true

volumes:
  caddy_data:
  caddy_config:

# ==============================================================================
# การส่งออก Root CA เพื่อให้เครื่อง Client ยอมรับ HTTPS เป็นสีเขียว:
# ==============================================================================
# 1. คัดลอกใบรับรอง Root CA จาก Caddy Container ออกมาที่โฮสต์:
# docker cp caddy-proxy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
#
# 2. นำไปติดตั้งบน Windows Client:
#    - ดับเบิลคลิกไฟล์ caddy-root.crt > Install Certificate...
#    - เลือก "Local Machine" > Next
#    - เลือก "Place all certificates in the following store" > Browse...
#    - เลือกโฟลเดอร์ "Trusted Root Certification Authorities" > OK > Next > Finish`,
    steps: [
      "สร้างไฟล์ Caddyfile และ docker-compose.yml สำหรับ Caddy Reverse Proxy",
      "สั่ง docker compose up -d บน network app_net",
      "ดึงไฟล์ root.crt ของ Caddy ออกมา: docker cp caddy-proxy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt",
      "นำไฟล์ caddy-root.crt ไป Install ลงใน Trusted Root Certification Authorities บนเครื่อง Client",
      "ทดสอบเข้าเว็บผ่าน https:// ด้วยเบราว์เซอร์ จะขึ้นแม่กุญแจปลอดภัยสีเขียว (Secure Connection)"
    ],
    verify: "curl -k -I https://localhost คืนค่า HTTP/2 200 หรือเข้าเว็บผ่านเบราว์เซอร์แสดงแม่กุญแจปลอดภัย"
  },
  {
    id: "c11_3",
    secId: "sec2",
    qNum: "ข้อ 2.5",
    pdfPage: 12,
    questionText: "เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ reverse proxy กับ host และ domain ของระบบที่พัฒนาได้ registry, gitlab, frontend, backend เช่น https://gitlab.mydomain.lab",
    pts: 1,
    note: "",
    explanation: "กำหนดคอนฟิก Caddyfile ให้กระจายคำขอ HTTPS Reverse Proxy ไปยังโดเมนเนมของบริการต่างๆ ครบถ้วน ได้แก่ gitlab, registry, registry-ui, dns, frontend และ backend พร้อมเข้ารหัส tls internal",
    solutionType: "code",
    lang: "caddyfile",
    code: `# ==============================================================================
# ไฟล์ Caddyfile มาตรฐานศูนย์สอบ DevOps VECSkill BNCC
# ==============================================================================
{
    cert_issuer internal
}

# 1. GitLab Web Service
gitlab.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://gitlab:80
}

# 2. Docker Private Registry API
registry.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://registry:5000
}

# 3. Docker Registry Web UI
registry-ui.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://registry-ui:80
}

# 4. Technitium DNS Server Web Admin
dns.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://technitium-dns:5380
}

# 5. Application Frontend Web
app.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://app:3000
}

# 6. Application Backend API
api.competition.lab {
    tls internal
    encode zstd gzip
    reverse_proxy http://api:7000
}`,
    steps: [
      "เขียนไฟล์ Caddyfile กำหนดบล็อกเสมือนสำหรับแต่ละโดเมน (gitlab, registry, dns, app, api)",
      "ระบุคำสั่ง tls internal ในทุกบล็อกเพื่อให้ Caddy ออก SSL อัตโนมัติ",
      "รีโหลดคอนฟิก Caddy: docker exec -w /etc/caddy caddy-proxy caddy reload",
      "ทดสอบเรียกเปิด https://gitlab.competition.lab และ https://dns.competition.lab จากเครื่อง Client ตรวจสอบการเข้าถึงแต่ละระบบได้ถูกต้อง"
    ],
    verify: "เปิดเข้า https://gitlab.competition.lab และ https://dns.competition.lab ได้ถูกต้องผ่าน Caddy HTTPS"
  },
  {
    id: "c11_4",
    secId: "sec2",
    qNum: "ข้อ 2.5",
    pdfPage: 12,
    questionText: "เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ docker-compose.yaml สำหรับบริการมากกว่า 1 (เช่น app + db) ใน 1 compose",
    pts: 1,
    note: "",
    explanation: "สร้าง docker-compose.yaml รวบรวมบริการมากกว่า 1 บริการขึ้นไปในไฟล์เดียว ประกอบด้วย Backend API, ฐานข้อมูล MySQL 8 / MariaDB, phpMyAdmin และ Docker Registry พร้อมกำหนด Volume ข้อมูลถาวร และ Healthcheck ให้บริการสตาร์ตตามลำดับอย่างถูกต้อง",
    solutionType: "code",
    lang: "yaml",
    code: `# ==============================================================================
# ไฟล์ docker-compose.yaml (App + DB + phpMyAdmin + Registry)
# ==============================================================================
version: "3.9"

services:
  # 1. บริการฐานข้อมูล MySQL / MariaDB
  db:
    image: mysql:8.0
    container_name: competition-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword123!
      MYSQL_DATABASE: competition_db
      MYSQL_USER: devops
      MYSQL_PASSWORD: UserPassword123!
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-pRootPassword123!"]
      interval: 10s
      timeout: 5s
      retries: 10
    networks:
      - app_net

  # 2. บริการ phpMyAdmin สำหรับบริหารจัดการฐานข้อมูล
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: competition-pma
    restart: always
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: RootPassword123!
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_net

  # 3. บริการแอปพลิเคชันหลัก (Backend API)
  api:
    image: 192.168.10.10:5000/competition-app:latest
    container_name: competition-api
    restart: always
    ports:
      - "7000:7000"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_NAME: competition_db
      DB_USER: devops
      DB_PASSWORD: UserPassword123!
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_net

  # 4. บริการ Docker Private Registry v2
  registry:
    image: registry:2
    container_name: registry
    restart: always
    ports:
      - "5000:5000"
    environment:
      REGISTRY_STORAGE_DELETE_ENABLED: "true"
    volumes:
      - registry_data:/var/lib/registry
    networks:
      - app_net

volumes:
  db_data:
  registry_data:

networks:
  app_net:
    external: true`,
    steps: [
      "เขียนไฟล์ docker-compose.yaml รวม services: db, phpmyadmin, api และ registry",
      "กำหนด healthcheck ให้กับ db เพื่อให้ api รอจนกว่าฐานข้อมูลจะพร้อมใช้งานจริง (condition: service_healthy)",
      "รันคำสั่ง docker compose up -d เพื่อเปิดใช้งานทุกเซอร์วิสพร้อมกัน",
      "ตรวจสอบสถานะด้วย docker compose ps ให้แสดงสถานะ Up หรือ healthy ครบทุกตัว"
    ],
    verify: "docker compose ps แสดงสถานะ running/healthy ครบทั้ง 4 คอนเทนเนอร์ (db, phpmyadmin, api, registry)"
  },

  // --------------------------------------------------------------------------
  // ข้อ 2.6 & 2.7 (หน้า 12): GitLab CI/CD Pipeline 4 Stages, Runner, Deploy
  // --------------------------------------------------------------------------
  {
    id: "c12_1",
    secId: "sec2",
    qNum: "ข้อ 2.6",
    pdfPage: 12,
    questionText: "กำหนด CI/CD Pipeline\n- สร้าง .gitlab-ci.yml เชื่อมโยงกับการกำหนด State ครบทั้ง 4 ขั้นตอน Build, Test, Push ขึ้น Registry ของตนเอง, Deploy ไปยัง Server ของตนเอง (พิจารณาการเขียนคำสั่งได้ถูกต้อง)",
    pts: 1,
    note: "พิจารณาการเขียนคำสั่งได้ถูกต้อง",
    explanation: "เขียนไฟล์ .gitlab-ci.yml กำหนดลำดับ stages ครบถ้วน 4 ขั้นตอน: build, test, push (นำอิมเมจขึ้น Local Private Registry), deploy (นำคอนเทนเนอร์ขึ้นรันบน Production Server ผ่าน SSH) ตามมาตรฐานทางการของศูนย์ฝึก VECSkill BNCC",
    solutionType: "code",
    lang: "yaml",
    code: `# ==============================================================================
# ไฟล์ .gitlab-ci.yml (4 ขั้นตอนครบถ้วนตามเกณฑ์ทางการ: build, test, push, deploy)
# อ้างอิงตามคู่มือทางการ VECSkill BNCC (Node.js + Docker + SSH Deploy)
# ==============================================================================
stages:
  - build
  - test
  - push
  - deploy

variables:
  REGISTRY_HOST: "192.168.10.10:5000"
  IMAGE_NAME: "competition-app"
  PRODUCTION_IP: "192.168.10.10"
  PRODUCTION_USER: "devops"
  DOCKER_TLS_CERTDIR: ""

# ------------------------------------------------------------------------------
# 1. STAGE: BUILD (ติดตั้ง Dependencies และคอมไพล์โค้ด)
# ------------------------------------------------------------------------------
build-job:
  stage: build
  image: node:20-alpine
  tags:
    - docker
  script:
    - echo "=== [Stage 1: Build] ตรวจสอบ Dependencies และเตรียมแพ็กเกจ ==="
    - npm ci || npm install
    - echo "Build completed successfully."
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

# ------------------------------------------------------------------------------
# 2. STAGE: TEST (รัน Automated Unit Tests)
# ------------------------------------------------------------------------------
test-job:
  stage: test
  image: node:20-alpine
  tags:
    - docker
  dependencies:
    - build-job
  script:
    - echo "=== [Stage 2: Test] รัน Automated Unit & Integration Tests ==="
    - npm test || npm run test:unit
    - echo "All tests passed successfully!"
  allow_failure: false

# ------------------------------------------------------------------------------
# 3. STAGE: PUSH (สร้าง Docker Image และ Push ขึ้น Private Registry)
# ------------------------------------------------------------------------------
push-job:
  stage: push
  image: docker:24
  tags:
    - docker
  script:
    - echo "=== [Stage 3: Push] สร้างและพุช Docker Image ไปยัง Private Registry ==="
    - docker build -t "$REGISTRY_HOST/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA" .
    - docker tag "$REGISTRY_HOST/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA" "$REGISTRY_HOST/$IMAGE_NAME:latest"
    - docker push "$REGISTRY_HOST/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA"
    - docker push "$REGISTRY_HOST/$IMAGE_NAME:latest"
    - echo "Image pushed to $REGISTRY_HOST/$IMAGE_NAME:latest"
  only:
    - main
    - master

# ------------------------------------------------------------------------------
# 4. STAGE: DEPLOY (เชื่อมต่อไปยัง Production Server ผ่าน SSH และ Deploy คอนเทนเนอร์)
# ------------------------------------------------------------------------------
deploy-job:
  stage: deploy
  image: alpine:3.20
  tags:
    - docker
  before_script:
    - echo "=== ติดตั้ง SSH Client และเตรียม SSH Key สำหรับ Remote ==="
    - apk add --no-cache openssh-client
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_ed25519
    - chmod 600 ~/.ssh/id_ed25519
    - ssh-keyscan -H $PRODUCTION_IP >> ~/.ssh/known_hosts 2>/dev/null || true
  script:
    - echo "=== [Stage 4: Deploy] Remote SSH สั่ง Pull และ Restart Container บน Production ==="
    - |
      ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_ed25519 $PRODUCTION_USER@$PRODUCTION_IP "
        cd /srv/app &&
        docker compose pull api &&
        docker compose up -d api &&
        echo 'Production Deployment Completed Successfully!'
      "
  only:
    - main
    - master`,
    steps: [
      "สร้างไฟล์ .gitlab-ci.yml ไว้ที่ Root Directory ของ Repository ในโปรเจกต์",
      "ระบุคำสั่ง stages ครบถ้วน 4 รายการ: build, test, push, deploy",
      "ในแต่ละ Job ผูก stage ให้ตรง และใช้แท็ก 'docker' เพื่อให้ GitLab Runner รับงานไปประมวลผล",
      "ตรวจสอบไวยากรณ์ด้วย CI Lint บนหน้าเว็บ GitLab (CI/CD > Pipelines > CI Lint)"
    ],
    verify: "cat .gitlab-ci.yml แสดง stages ครบ 4 รายการ (build, test, push, deploy) อย่างสมบูรณ์"
  },
  {
    id: "c12_2",
    secId: "sec2",
    qNum: "ข้อ 2.7",
    pdfPage: 12,
    questionText: "ทดสอบใช้งาน Pipeline\n- Push code แล้วเกิด Trigger ได้จริง",
    pts: 0.5,
    note: "",
    explanation: "เมื่อทำการเพิ่ม/แก้ไขโค้ด สร้าง Commit และรันคำสั่ง git push ขึ้นไปยัง GitLab Server หน้า CI/CD Pipelines จะตรวจจับ Push Event และทำการ Trigger รัน Pipeline อัตโนมัติทันที",
    solutionType: "code",
    lang: "bash",
    code: `# 1. ผูก Git Remote ไปยัง GitLab Repository ของตนเอง:
git remote set-url origin http://gitlab.competition.lab/devops/competition-project.git

# 2. เพิ่มไฟล์และสร้าง Commit:
git add .
git commit -m "feat: setup full 4-stage ci/cd pipeline"

# 3. สั่ง Push โค้ดขึ้น Branch main:
git push origin main

# 4. ตรวจสอบการ Trigger บนหน้าเว็บ GitLab:
# ไปที่เมนู CI/CD > Pipelines จะเห็น Pipeline ใหม่ถูกสร้างขึ้นและมีสถานะเป็น "running" ทันที`,
    steps: [
      "รันคำสั่ง git add . และ git commit -m 'feat: trigger ci cd'",
      "รันคำสั่ง git push origin main ส่งขึ้นสู่ GitLab Server",
      "เปิดหน้าเว็บ GitLab เข้าไปที่เมนู CI/CD > Pipelines ในโปรเจกต์",
      "สังเกตว่ามี Pipeline ใหม่โผล่ขึ้นมาทันที และแสดงสถานะ 'running' (สีฟ้า) หมุนทำงาน"
    ],
    verify: "หน้า GitLab CI/CD > Pipelines แสดง Pipeline สถานะ 'running' หรือ 'passed' ที่ทริกเกอร์จาก Commit ล่าสุด"
  },
  {
    id: "c12_3",
    secId: "sec2",
    qNum: "ข้อ 2.7",
    pdfPage: 12,
    questionText: "ทดสอบใช้งาน Pipeline\n- กำหนด Stage ครบ 4 ขั้นตอน (build, test, push ขึ้น registry, deploy) และทำงานได้จริงทุกขั้นตอน (หมายเหตุ: ถ้าได้ข้อใดข้อหนึ่งจะไม่ได้คะแนน ไม่มีการหารเฉลี่ย)",
    pts: 2,
    note: "ถ้าได้ข้อใดข้อหนึ่งจะไม่ได้คะแนน ไม่มีการหารเฉลี่ย",
    explanation: "Pipeline ต้องประมวลผลผ่านครบทุกขั้นตอนโดยไม่มีข้อผิดพลาด (Passed สีเขียวทั้ง 4 Stages) ได้แก่ Stage 1: build, Stage 2: test, Stage 3: push, Stage 4: deploy โดยมีเทคนิคการลงทะเบียน Runner และแก้ปัญหา SSL/Registry ตามคู่มือทางการของ VECSkill BNCC",
    solutionType: "code",
    lang: "bash",
    code: `# ==============================================================================
# 1. ติดตั้งและ Register GitLab Runner (Docker Executor Mode)
# ==============================================================================
# รัน Runner Container พร้อมเชื่อมต่อ Docker Socket:
docker run -d \\
  --name gitlab-runner \\
  --restart always \\
  --network app_net \\
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  gitlab/gitlab-runner:latest

# ลงทะเบียน Runner (ดึง Token จาก GitLab Admin Area > CI/CD > Runners):
docker exec -it gitlab-runner gitlab-runner register \\
  --non-interactive \\
  --url "http://gitlab:80" \\
  --registration-token "<YOUR_REGISTRATION_TOKEN>" \\
  --executor "docker" \\
  --docker-image "node:20-alpine" \\
  --description "competition-runner" \\
  --tag-list "docker" \\
  --run-untagged="true" \\
  --locked="false"

# ==============================================================================
# 2. ปรับแต่งไฟล์ /srv/gitlab-runner/config/config.toml (เทคนิคสำคัญ VECSkill BNCC):
# เพื่อให้ Runner สามารถ Clone ผ่านเครือข่ายภายใน และแชร์ Docker Socket ได้
# ==============================================================================
# [runners.docker]
#   network_mode = "app_net"
#   volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
#   clone_url = "http://gitlab"   # ป้องกันปัญหา SSL Handshake เมื่อ Clone

# รีสตาร์ต Runner:
docker restart gitlab-runner

# ==============================================================================
# 3. ตั้งค่า Insecure Registry ใน /etc/docker/daemon.json บนเซิร์ฟเวอร์:
# ==============================================================================
# sudo nano /etc/docker/daemon.json
# {
#   "insecure-registries": ["192.168.10.10:5000", "registry.competition.lab:5000"]
# }
# sudo systemctl restart docker

# ==============================================================================
# 4. ตรวจสอบผลการทำงานบนหน้า GitLab Pipelines:
# Stage 1: build-job   -> [✓ Passed] (เขียว)
# Stage 2: test-job    -> [✓ Passed] (เขียว)
# Stage 3: push-job    -> [✓ Passed] (เขียว - นำ Image ขึ้น Registry)
# Stage 4: deploy-job  -> [✓ Passed] (เขียว - Remote Deploy สำเร็จ)
# ==============================================================================`,
    steps: [
      "ลงทะเบียน GitLab Runner ในโหมด Docker Executor และแมป /var/run/docker.sock เข้าไป",
      "ปรับแต่ง config.toml ให้ network_mode = 'app_net' และ clone_url = 'http://gitlab'",
      "ตั้งค่า Insecure Registry ใน /etc/docker/daemon.json ให้ชี้ไปยังพอร์ต 5000 และ restart docker",
      "ใส่ตัวแปร SSH_PRIVATE_KEY ใน GitLab Project Settings > CI/CD > Variables (เลือก Masked)",
      "รัน Pipeline และเฝ้าดูหน้า Pipelines จนกระทั่งขึ้นเครื่องหมายถูกสีเขียว (Passed) ครบทั้ง 4 Stages"
    ],
    verify: "หน้าจอ GitLab CI/CD > Pipelines แสดงแถบสถานะ 'passed' สีเขียวครบทั้ง 4 ขั้นตอน (build, test, push, deploy)"
  },
  {
    id: "c12_4",
    secId: "sec2",
    qNum: "ข้อ 2.7",
    pdfPage: 12,
    questionText: "ทดสอบใช้งาน Pipeline\n- ระบบสามารถ build และสร้าง image ได้",
    pts: 0.5,
    note: "",
    explanation: "ในระหว่างที่ Pipeline ทำงานใน Stage push ระบบสามารถคอมไพล์โค้ด สร้างเป็น Docker Image และอัปโหลดไปยัง Docker Private Registry สำเร็จ สามารถเรียกตรวจสอบรายชื่ออิมเมจผ่าน Registry HTTP API และหน้าเว็บ Registry UI ได้จริง",
    solutionType: "code",
    lang: "bash",
    code: `# 1. ตรวจสอบรายการ Repositories ทั้งหมดบน Local Registry ผ่าน REST API:
curl -s http://192.168.10.10:5000/v2/_catalog
# ผลลัพธ์: {"repositories":["competition-app"]}

# 2. ตรวจสอบ Tags ของ Image ที่ถูก Push ขึ้นไปล่าสุด:
curl -s http://192.168.10.10:5000/v2/competition-app/tags/list
# ผลลัพธ์: {"name":"competition-app","tags":["latest","a1b2c3d"]}

# 3. ทดสอบ Pull Image ที่สร้างขึ้นจากเครื่องอื่นในวง Network:
docker pull 192.168.10.10:5000/competition-app:latest

# 4. หรือเปิดดูผ่าน Docker Registry Web UI:
# URL: http://192.168.10.10:8080 หรือ https://registry-ui.competition.lab`,
    steps: [
      "รันคำสั่ง curl -s http://192.168.10.10:5000/v2/_catalog เพื่อดูรายชื่อ Repository ใน Private Registry",
      "รันคำสั่ง curl -s http://192.168.10.10:5000/v2/competition-app/tags/list ตรวจสอบแท็ก latest",
      "ทดสอบคำสั่ง docker pull 192.168.10.10:5000/competition-app:latest เพื่อยืนยันว่าดึงอิมเมจมาใช้งานได้จริง",
      "เปิดหน้าเว็บ Docker Registry UI http://192.168.10.10:8080 ตรวจสอบว่ามีชื่ออิมเมจแสดงบนหน้าเว็บ"
    ],
    verify: "curl http://192.168.10.10:5000/v2/_catalog คืนค่า JSON แสดงชื่ออิมเมจ ['competition-app'] อย่างถูกต้อง"
  }
];

module.exports = { sec2Items };
