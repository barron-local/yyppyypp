// ==============================================================================
// EXACT RUBRIC & SOLUTIONS DATA (100 PTS) DIRECTLY FROM OFFICIAL PDF (ITEM 58)
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

export const examQuestionsAndSolutions = [
  // ==========================================================================
  // ส่วนที่ 1: Network (13 คะแนนเต็ม) - หน้า 9-10
  // ==========================================================================
  {
    id: 'c1',
    secId: 'sec1',
    qNum: 'ข้อ 1.1',
    pdfPage: 9,
    questionText: 'VLAN Configuration\n- มี VLAN server, dev, guest เท่านั้น และไม่ใช่ Default VLAN',
    pts: 1,
    note: 'VLAN ละ 0.33 คะแนน',
    explanation: 'สร้าง VLAN 3 วงตามชื่อที่กำหนดบน Cisco Layer 3 Switch โดยห้ามใช้ VLAN 1 (Default): VLAN 10 (server), VLAN 20 (dev), VLAN 30 (guest)',
    solutionType: 'code',
    lang: 'cisco',
    code: `enable
configure terminal

! สร้าง VLAN 3 วงตามเกณฑ์ทางการ
vlan 10
 name server
exit
vlan 20
 name dev
exit
vlan 30
 name guest
exit`,
    verify: 'show vlan brief'
  },
  {
    id: 'c2_1',
    secId: 'sec1',
    qNum: 'ข้อ 1.2',
    pdfPage: 9,
    questionText: 'Inter-VLAN Routing - การตั้งค่า IP Interface\n- มี IP ทั้ง VLAN server, dev, guest',
    pts: 2,
    note: 'ไม่ครบได้ 0 คะแนน',
    explanation: 'สร้าง Switch Virtual Interface (SVI) พร้อมกำหนด IP Address ให้เป็น Default Gateway ครบทั้ง 3 วง',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip routing

interface vlan 10
 description Gateway Server Network
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit

interface vlan 20
 description Gateway Dev Network
 ip address 192.168.20.1 255.255.255.0
 no shutdown
exit

interface vlan 30
 description Gateway Guest Network
 ip address 192.168.30.1 255.255.255.0
 no shutdown
exit`,
    verify: 'show ip interface brief'
  },
  {
    id: 'c2_2',
    secId: 'sec1',
    qNum: 'ข้อ 1.2',
    pdfPage: 9,
    questionText: 'Inter-VLAN Routing - การทำ Routing ระหว่าง VLAN\n- ทำ Routing ระหว่าง VLAN ได้ ครบทั้งสาม',
    pts: 1,
    note: 'ไม่ครบได้ 0 คะแนน',
    explanation: 'เมื่อเปิดคำสั่ง ip routing Switch L3 จะ Route ข้าม VLAN 10, 20, 30 อัตโนมัติ ตรวจสอบ Routing Table และทดสอบ Ping ข้าม VLAN',
    solutionType: 'code',
    lang: 'cisco',
    code: `! คำสั่งเปิด Routing บน Switch Layer 3
ip routing

! ตรวจสอบตาราง Routing จะพบเส้นทางแบบ Connected ครบทั้ง 3 วง
do show ip route connected
! C    192.168.10.0/24 is directly connected, Vlan10
! C    192.168.20.0/24 is directly connected, Vlan20
! C    192.168.30.0/24 is directly connected, Vlan30`,
    verify: 'ping 192.168.10.1 และ ping 192.168.20.1 และ ping 192.168.30.1'
  },
  {
    id: 'c3_1',
    secId: 'sec1',
    qNum: 'ข้อ 1.3',
    pdfPage: 9,
    questionText: 'DHCP ด้วย Server เครื่องเดียวที่รับผิดชอบ\n- แจก DHCP ได้ 1 VLAN (VLAN Dev หรือ Server)',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า DHCP Pool ให้แจก IP ในวง VLAN Server (หรือ Dev) โดยกำหนด Gateway และ DNS Server อย่างถูกต้อง',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip dhcp excluded-address 192.168.10.1 192.168.10.50

ip dhcp pool POOL_SERVER
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.10
exit`,
    verify: 'show ip dhcp binding'
  },
  {
    id: 'c3_2',
    secId: 'sec1',
    qNum: 'ข้อ 1.3',
    pdfPage: 9,
    questionText: 'DHCP ด้วย Server เครื่องเดียวที่รับผิดชอบ\n- แจก DHCP ได้ 2 VLAN (VLAN Dev และ Server)',
    pts: 1,
    note: '',
    explanation: 'สร้าง DHCP Pool เพิ่มให้ครอบคลุมทั้งวง Dev และ Guest (สามารถใส่ ip helper-address กรณีใช้ Linux DHCP Server ภายนอก)',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip dhcp excluded-address 192.168.20.1 192.168.20.20
ip dhcp excluded-address 192.168.30.1 192.168.30.20

ip dhcp pool POOL_DEV
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.10.10
exit

ip dhcp pool POOL_GUEST
 network 192.168.30.0 255.255.255.0
 default-router 192.168.30.1
 dns-server 192.168.10.10
exit`,
    verify: 'show ip dhcp pool'
  },
  {
    id: 'c3_3',
    secId: 'sec1',
    qNum: 'ข้อ 1.3',
    pdfPage: 9,
    questionText: 'DHCP Snooping & Trust Port\n- ให้ Switch ยอมรับการใช้งาน DHCP Server เฉพาะ Port ที่กำหนดได้',
    pts: 1,
    note: '',
    explanation: 'เปิดใช้งาน DHCP Snooping ป้องกัน Rogue DHCP Server และกำหนดให้ Port Fa0/1 ที่เชื่อมต่อ Server ตัวจริงเป็น Trust Port',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip dhcp snooping
ip dhcp snooping vlan 10,20,30
no ip dhcp snooping information option

! กำหนด Port Fa0/1 ที่ต่อกับเครื่อง Server ให้เป็น Trust Port
interface FastEthernet 0/1
 ip dhcp snooping trust
exit

! จำกัด Rate บน Port อื่นๆ เพื่อป้องกัน DHCP Starvation Attack
interface range FastEthernet 0/2 - 24
 ip dhcp snooping limit rate 15
exit`,
    verify: 'show ip dhcp snooping'
  },
  {
    id: 'c4',
    secId: 'sec1',
    qNum: 'ข้อ 1.4',
    pdfPage: 9,
    questionText: 'การทำ NAT เพื่อติดต่อกับเครื่องของกรรมการได้\nใช้ NAT เพื่อให้อุปกรณ์เชื่อมต่อเครือข่ายที่จัดเตรียมได้\n- NAT ได้ ทุก VLAN เพื่อใช้งานเครือข่ายภายนอก (กรณีที่ไม่แข่งขันด้าน IoT)',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า NAT Overload (PAT) บนเราเตอร์ขาออกนอก ให้อนุญาต Subnet ของทั้ง 3 VLAN ออกไปเชื่อมต่อกับเครือข่ายกรรมการหรืออินเทอร์เน็ตได้',
    solutionType: 'code',
    lang: 'cisco',
    code: `! ทำบน Cisco Router เชื่อมต่อภายนอก
configure terminal
access-list 1 permit 192.168.10.0 0.0.0.255
access-list 1 permit 192.168.20.0 0.0.0.255
access-list 1 permit 192.168.30.0 0.0.0.255

interface GigabitEthernet 0/0
 description Inside LAN
 ip nat inside
exit

interface GigabitEthernet 0/1
 description Outside to Judge / Internet
 ip nat outside
exit

ip nat inside source list 1 interface GigabitEthernet 0/1 overload`,
    verify: 'show ip nat translations'
  },
  {
    id: 'c5_1',
    secId: 'sec1',
    qNum: 'ข้อ 1.5',
    pdfPage: 10,
    questionText: 'การทำ ACL ควบคุมการสื่อสารภายในเครือข่าย\n- Standard ACL',
    pts: 1,
    note: 'Standard ACL',
    explanation: 'สร้าง Standard Access-List กรอง IP Address ต้นทาง เพื่อควบคุมสิทธิ์การสื่อสารภายในเครือข่าย',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
! Standard ACL อนุญาตเฉพาะวง dev (192.168.20.0/24)
access-list 10 permit 192.168.20.0 0.0.0.255
access-list 10 deny any`,
    verify: 'show access-lists 10'
  },
  {
    id: 'c5_2',
    secId: 'sec1',
    qNum: 'ข้อ 1.5',
    pdfPage: 10,
    questionText: 'การทำ ACL อนุญาตเฉพาะ Service ที่กำหนด\n- Extended ACL',
    pts: 1,
    note: 'Extended ACL',
    explanation: 'สร้าง Extended Access-List อนุญาตเฉพาะพอร์ตบริการที่ใช้งานจริง เช่น Web (80, 443) และ DNS (53)',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip access-list extended ACL_SERVICES
 permit tcp any any eq 80
 permit tcp any any eq 443
 permit udp any any eq 53
 permit tcp any any eq 53
 deny ip any any
exit`,
    verify: 'show access-lists ACL_SERVICES'
  },
  {
    id: 'c5_3',
    secId: 'sec1',
    qNum: 'ข้อ 1.5',
    pdfPage: 10,
    questionText: 'การทำ ACL ป้องกันการเข้าถึง Server',
    pts: 1,
    note: '',
    explanation: 'สร้าง Extended ACL กั้นไม่ให้วง Guest เข้าถึงเครื่องในวง Server ยกเว้นเฉพาะพอร์ตบริการเว็บและ DNS',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
ip access-list extended ACL_PROTECT_SERVER
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 80
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 443
 permit udp 192.168.30.0 0.0.0.255 host 192.168.10.10 eq 53
 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip 192.168.30.0 0.0.0.255 any
exit

interface vlan 30
 ip access-group ACL_PROTECT_SERVER in
exit`,
    verify: 'show ip access-lists ACL_PROTECT_SERVER'
  },
  {
    id: 'c5_4',
    secId: 'sec1',
    qNum: 'ข้อ 1.5',
    pdfPage: 10,
    questionText: 'การทำ ACL สำหรับ Management VLAN',
    pts: 1,
    note: '',
    explanation: 'นำ Standard ACL ไปผูกไว้ที่ line vty 0 4 เพื่อจำกัดให้เฉพาะเครื่องจากวง Dev เท่านั้นที่สามารถ Telnet/SSH เข้ามาบริหาร Switch ได้',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
line vty 0 4
 access-class 10 in
 transport input ssh
exit`,
    verify: 'show running-config | section line vty'
  },
  {
    id: 'c5_5',
    secId: 'sec1',
    qNum: 'ข้อ 1.5',
    pdfPage: 10,
    questionText: 'การตั้งค่าเพื่อป้องกัน Loop บน Switch',
    pts: 1,
    note: '',
    explanation: 'เปิดใช้งาน Spanning-Tree Rapid-PVST พร้อมตั้งค่า PortFast และ BPDU Guard เพื่อป้องกันการเกิด Switching Loop อย่างมีประสิทธิภาพ',
    solutionType: 'code',
    lang: 'cisco',
    code: `configure terminal
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default
end
write memory`,
    verify: 'show spanning-tree summary'
  },

  // ==========================================================================
  // ส่วนที่ 2: ตั้งค่าเครือข่ายตามผังระบบเครือข่าย และ DevOps Infra (24 คะแนนเต็ม)
  // ==========================================================================
  {
    id: 'c6_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.1',
    pdfPage: 10,
    questionText: 'ติดตั้งระบบ Virtualization เช่น Proxmox, VirtualBox, VMware\n- ติดตั้งระบบ Virtualization ได้ มี GUI ใช้งานได้',
    pts: 1,
    note: '',
    explanation: 'ติดตั้ง Proxmox VE (หรือ VMware ESXi / VirtualBox) และเปิดใช้งาน Web GUI ได้ที่ https://192.168.10.2:8006',
    solutionType: 'text',
    steps: [
      'เข้าเบราว์เซอร์เปิด Web GUI ของ Hypervisor: https://192.168.10.2:8006 (Proxmox)',
      'ล็อกอินด้วยผู้ใช้ root และรหัสผ่านที่ตั้งไว้',
      'ตรวจสอบสถานะ Node Summary และ CPU / RAM พร้อมใช้งาน'
    ]
  },
  {
    id: 'c6_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.1',
    pdfPage: 10,
    questionText: 'ติดตั้งระบบ Virtualization\n- สร้าง VM ได้ตามแผนผัง มีโครงสร้างตามโจทย์',
    pts: 1,
    note: '',
    explanation: 'สร้าง VM Ubuntu Server 22.04 LTS (VMID 100) กำหนด CPU 2 Cores, RAM 4096MB, Disk 32GB และผูกกับ Bridge vmbr0',
    solutionType: 'code',
    lang: 'bash',
    code: `# คำสั่งสร้าง VM บน Proxmox CLI (หรือคลิกผ่าน GUI):
qm create 100 --name ubuntu-server --memory 4096 --cores 2 --net0 virtio,bridge=vmbr0`,
    verify: 'qm list (หรือดูในหน้า Proxmox Web GUI)'
  },
  {
    id: 'c6_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.1',
    pdfPage: 10,
    questionText: 'ติดตั้งระบบ Virtualization\n- การตั้งค่า IP Address Virtualization ตามที่คณะกรรมการกำหนด',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า IP ให้กับตัว Hypervisor Host ตรงตามผัง เช่น 192.168.10.2/24 Gateway 192.168.10.1',
    solutionType: 'code',
    lang: 'bash',
    code: `# ตรวจสอบ /etc/network/interfaces บนโฮสต์ Proxmox:
auto vmbr0
iface vmbr0 inet static
    address 192.168.10.2/24
    gateway 192.168.10.1
    bridge-ports eth0
    bridge-stp off
    bridge-fd 0`,
    verify: 'ip addr show vmbr0'
  },
  {
    id: 'c7_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.2',
    pdfPage: 10,
    questionText: 'ติดตั้ง Linux Server บน VM โดย ISO ได้แก่ Ubuntu, Debian\n- ติดตั้งได้และบูตใช้งานได้ และเปิดอัตโนมัติเมื่อ Virtualization ดับแล้วเปิดขึ้นมาใหม่',
    pts: 1,
    note: '',
    explanation: 'เปิดตัวเลือก On-Boot Auto Start ให้กับ VM ใน Proxmox เพื่อให้ VM บูตขึ้นมาเองอัตโนมัติเมื่อเครื่องแม่ข่ายรีสตาร์ต',
    solutionType: 'code',
    lang: 'bash',
    code: `# บน Proxmox Host ตั้งค่า VM ให้เปิดอัตโนมัติ:
qm set 100 --onboot 1

# ตรวจสอบการตั้งค่า:
qm config 100 | grep onboot
# ผลลัพธ์: onboot: 1`,
    verify: 'qm config 100 | grep onboot'
  },
  {
    id: 'c7_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.2',
    pdfPage: 10,
    questionText: 'ติดตั้ง Linux Server บน VM\n- ตั้งค่า IP แบบ Static / DHCP ได้ถูกต้องตามผังที่กรรมการกำหนดให้',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า Static IP 192.168.10.10/24 Gateway 192.168.10.1 DNS 192.168.10.10 ผ่าน Netplan',
    solutionType: 'code',
    lang: 'yaml',
    code: `# แก้ไขไฟล์ /etc/netplan/00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 192.168.10.10/24
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses: [192.168.10.10, 8.8.8.8]

# นำการตั้งค่าไปใช้งาน:
sudo netplan apply`,
    verify: 'ip addr show && ip route show'
  },
  {
    id: 'c7_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.2',
    pdfPage: 10,
    questionText: 'ติดตั้ง Linux Server บน VM\n- ตั้งค่า hostname และ Domain name ตามที่คณะกรรมการกำหนด',
    pts: 1,
    note: '',
    explanation: 'ใช้คำสั่ง hostnamectl เพื่อตั้งชื่อ Hostname และ FQDN ให้ตรงตามโจทย์ เช่น server.competition.lab',
    solutionType: 'code',
    lang: 'bash',
    code: `sudo hostnamectl set-hostname server.competition.lab

# เพิ่มใน /etc/hosts:
echo "192.168.10.10 server.competition.lab server" | sudo tee -a /etc/hosts`,
    verify: 'hostnamectl status'
  },
  {
    id: 'c8_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.2',
    pdfPage: 11,
    questionText: 'การติดตั้งและใช้งาน DNS Server ใน Network ของตนเอง\n- มีการติดตั้งและใช้งาน DNS Server ใน Network ของตนเอง บน Docker หรือ Linux Server ตามชื่อที่กรรมการกำหนด โดยเครื่องลูกข่ายสามารถเรียกใช้งาน DNS Server ได้ (หมายเหตุ: ตั้งค่าบน Router หรือ Switch หรือ Hosts จะไม่ได้คะแนน)',
    pts: 1,
    note: 'ตั้งค่าบน Router/Switch/Hosts จะไม่ได้คะแนน',
    explanation: 'รัน Technitium DNS Server บน Docker พร้อมตั้ง Primary Zone และ Record ชี้ชื่อโดเมนไปยังเครื่อง Server',
    solutionType: 'code',
    lang: 'bash',
    code: `docker run -d \\
  --name technitium-dns \\
  --restart always \\
  -p 53:53/udp \\
  -p 53:53/tcp \\
  -p 5380:5380/tcp \\
  -e DNS_SERVER_ADMIN_PASSWORD=AdminPassword123! \\
  -v technitium_data:/etc/dns \\
  technitium/dns-server:latest`,
    verify: 'dig @192.168.10.10 gitlab.competition.lab หรือ nslookup gitlab.competition.lab 192.168.10.10'
  },
  {
    id: 'c8_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.2',
    pdfPage: 11,
    questionText: 'การควบคุมการเข้าถึง DNS Server (ACL)\n- กำหนดการเข้าถึง DNS Server ใน Network โดยใช้ IP Address ที่กำหนดเท่านั้น (ACL)',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า Access Control ในหน้าเว็บ Technitium DNS (Settings > Allowed Networks) ให้ยอมรับเฉพาะ IP ในวง 192.168.10.0/24 และ 192.168.20.0/24',
    solutionType: 'text',
    steps: [
      'เปิดเว็บ http://192.168.10.10:5380 แล้วล็อกอิน',
      'ไปที่เมนู Settings -> ส่วน DNS Server Settings',
      'ในหัวข้อ Allowed Networks / Access Control เลือก Restricted',
      'ระบุ Subnet ที่อนุญาต: 192.168.10.0/24, 192.168.20.0/24 แล้วกด Save'
    ]
  },
  {
    id: 'c9_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.3',
    pdfPage: 11,
    questionText: 'บริหารจัดการจากระยะไกล SSH / Remote Tools\n- เปิดบริการ SSH',
    pts: 1,
    note: '',
    explanation: 'ติดตั้งและสั่งเปิด OpenSSH Server ให้ทำงานอัตโนมัติ',
    solutionType: 'code',
    lang: 'bash',
    code: `sudo apt update && sudo apt install -y openssh-server
sudo systemctl enable --now ssh`,
    verify: 'sudo systemctl status ssh'
  },
  {
    id: 'c9_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.3',
    pdfPage: 11,
    questionText: 'บริหารจัดการจากระยะไกล SSH / Remote Tools\n- เพิ่ม User ตามที่กรรมการกำหนดได้ อย่างน้อย 2 User',
    pts: 1,
    note: 'อย่างน้อย 2 User',
    explanation: 'สร้างผู้ใช้งานอย่างน้อย 2 บัญชี พร้อมกำหนดรหัสผ่าน เช่น devops_admin และ app_deployer',
    solutionType: 'code',
    lang: 'bash',
    code: `sudo useradd -m -s /bin/bash devops_admin
sudo useradd -m -s /bin/bash app_deployer

echo "devops_admin:Password123!" | sudo chpasswd
echo "app_deployer:Password123!" | sudo chpasswd`,
    verify: 'cut -d: -f1 /etc/passwd | tail -n 2'
  },
  {
    id: 'c9_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.3',
    pdfPage: 11,
    questionText: 'บริหารจัดการจากระยะไกล SSH / Remote Tools\n- Remote จากเครื่องอื่นใน Network เข้ามาได้ด้วย user และ Port ที่กรรมการกำหนด',
    pts: 1,
    note: '',
    explanation: 'ทดสอบการเชื่อมต่อ SSH จากเครื่องอื่นในวงเครือข่ายเข้ามายัง Server',
    solutionType: 'code',
    lang: 'bash',
    code: `# ทดสอบรันจากเครื่อง Client หรือเครื่องกรรมการ:
ssh devops_admin@192.168.10.10 -p 22`,
    verify: 'ssh devops_admin@192.168.10.10'
  },
  {
    id: 'c9_4',
    secId: 'sec2',
    qNum: 'ข้อ 2.3',
    pdfPage: 11,
    questionText: 'บริหารจัดการจากระยะไกล SSH / Remote Tools\n- ตั้งค่า firewall (UFW / firewalld) เพื่อเปิดพอร์ตบริการได้ ตามที่กรรมการกำหนด',
    pts: 1,
    note: '',
    explanation: 'เปิดบริการ UFW โดยกำหนด Default Deny Incoming และเปิดเฉพาะพอร์ตที่ใช้งานจริง: 22 (SSH), 80/443 (HTTP/S), 53 (DNS), 5000 (Registry), 8080 (GitLab)',
    solutionType: 'code',
    lang: 'bash',
    code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 53
sudo ufw allow 5000/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable`,
    verify: 'sudo ufw status verbose'
  },
  {
    id: 'c9_5',
    secId: 'sec2',
    qNum: 'ข้อ 2.3',
    pdfPage: 11,
    questionText: 'บริหารจัดการจากระยะไกล SSH / Remote Tools\n- กำหนดให้ user ที่ Login เข้ามาสามารถใช้คำสั่ง sudo -i โดยไม่ต้องยืนยันรหัสผ่าน',
    pts: 1,
    note: '',
    explanation: 'เพิ่มสิทธิ์ NOPASSWD ให้กับ User ในไฟล์ /etc/sudoers.d/99-devops เพื่อให้สามารถสั่ง sudo -i ได้ทันทีโดยไม่ถูกถามรหัสผ่าน',
    solutionType: 'code',
    lang: 'bash',
    code: `sudo usermod -aG sudo devops_admin
sudo usermod -aG sudo app_deployer

echo "devops_admin ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/99-devops
echo "app_deployer ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers.d/99-devops
sudo chmod 0440 /etc/sudoers.d/99-devops`,
    verify: 'su - devops_admin -c "sudo -i whoami" (ต้องได้ผลลัพธ์เป็น root ทันที)'
  },
  {
    id: 'c10_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.4',
    pdfPage: 11,
    questionText: 'ติดตั้งเครื่องมือ DevOps ได้แก่ Docker + GitLab\n- ติดตั้ง Docker ได้และใช้งานได้ เช่น docker ps, run, exec',
    pts: 1,
    note: '',
    explanation: 'ติดตั้ง Docker Engine และ Docker Compose Plugin พร้อมเพิ่ม user เข้ากลุ่ม docker',
    solutionType: 'code',
    lang: 'bash',
    code: `curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker devops_admin
sudo systemctl enable --now docker`,
    verify: 'docker --version && docker ps'
  },
  {
    id: 'c10_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.4',
    pdfPage: 11,
    questionText: 'ติดตั้งเครื่องมือ DevOps\n- ติดตั้ง GitLab ได้ใน container หรือ VM โดยเข้าเว็บได้',
    pts: 1,
    note: '',
    explanation: 'ติดตั้ง GitLab Community Edition ผ่าน Docker Compose หรือ Omnibus Package ให้สามารถเปิดเข้าหน้า UI ได้',
    solutionType: 'code',
    lang: 'yaml',
    code: `# docker-compose.gitlab.yml
version: '3.8'
services:
  gitlab:
    image: gitlab/gitlab-ce:latest
    restart: always
    hostname: 'gitlab.competition.lab'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab.competition.lab:8080'
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
    ports:
      - '8080:8080'
      - '2222:22'
    volumes:
      - ./gitlab/config:/etc/gitlab
      - ./gitlab/logs:/var/log/gitlab
      - ./gitlab/data:/var/opt/gitlab`,
    verify: 'curl -I http://192.168.10.10:8080'
  },
  {
    id: 'c10_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.4',
    pdfPage: 11,
    questionText: 'ติดตั้งเครื่องมือ DevOps\n- สร้าง User ใน Gitlab และเข้าหน้า UI ได้',
    pts: 1,
    note: '',
    explanation: 'เข้าหน้า GitLab Web UI ด้วย root เพื่อตั้งรหัสผ่านใหม่ และสร้าง User สมาชิกทีม (เช่น dev1, dev2, devops) ล็อกอินเข้าใช้งานได้สมบูรณ์',
    solutionType: 'text',
    steps: [
      'ดึงรหัสผ่านเริ่มต้นของ root: sudo docker exec -it gitlab-gitlab-1 grep "Password:" /etc/gitlab/initial_root_password',
      'เข้าเว็บ http://192.168.10.10:8080 ล็อกอินเป็น root',
      'ไปที่ Admin Area -> Users -> New user เพื่อสร้างบัญชีนักพัฒนา',
      'ทดสอบออกจากระบบแล้วล็อกอินด้วย User ใหม่ที่สร้าง'
    ]
  },
  {
    id: 'c11_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.5',
    pdfPage: 12,
    questionText: 'เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนา ได้',
    pts: 1,
    note: '',
    explanation: 'เขียน Dockerfile สำหรับ Containerise แอปพลิเคชัน Node.js แบบ Multi-stage หรือ Production image ขนาดกะทัดรัด',
    solutionType: 'code',
    lang: 'dockerfile',
    code: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
    verify: 'docker build -t app:v1 .'
  },
  {
    id: 'c11_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.5',
    pdfPage: 12,
    questionText: 'เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ docker-compose.yaml สำหรับบริการ reverse proxy เพื่อใช้บริการ https (caddy, NPM)',
    pts: 1,
    note: '',
    explanation: 'ใช้งาน Nginx Proxy Manager (หรือ Caddy) ผ่าน docker-compose ให้บริการ Reverse Proxy รองรับ SSL HTTPS',
    solutionType: 'code',
    lang: 'yaml',
    code: `version: '3.8'
services:
  reverse-proxy:
    image: jc21/nginx-proxy-manager:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./npm_data:/data
      - ./letsencrypt:/etc/letsencrypt`,
    verify: 'docker compose up -d reverse-proxy'
  },
  {
    id: 'c11_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.5',
    pdfPage: 12,
    questionText: 'เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ reverse proxy กับ host และ domain ของระบบที่พัฒนาได้ registry, gitlab, frontend, backend เช่น https://gitlab.mydomain.lab',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า Proxy Host ใน Nginx Proxy Manager ชี้โดเมนไปยัง Container ภายใน พร้อมเปิด Self-Signed หรือ Custom SSL',
    solutionType: 'text',
    steps: [
      'เข้าหน้าบริหาร Nginx Proxy Manager: http://192.168.10.10:81',
      'เพิ่ม Proxy Host: Domain `gitlab.competition.lab` -> Forward Host `192.168.10.10`, Port `8080`',
      'เพิ่ม Proxy Host: Domain `app.competition.lab` -> Forward Host `192.168.10.10`, Port `3000`',
      'เปิดใช้งาน SSL Certificate และเปิด Block Common Exploits'
    ]
  },
  {
    id: 'c11_4',
    secId: 'sec2',
    qNum: 'ข้อ 2.5',
    pdfPage: 12,
    questionText: 'เขียน Dockerfile / docker-compose.yaml ใช้งานจริง\n- ใช้ docker-compose.yaml สำหรับบริการมากกว่า 1 (เช่น app + db) ใน 1 compose',
    pts: 1,
    note: '',
    explanation: 'รวมบริการ App และ Database (MariaDB/MySQL) หรือหลายเซอร์วิสไว้ในไฟล์ docker-compose.yml เดียวกัน',
    solutionType: 'code',
    lang: 'yaml',
    code: `version: '3.8'
services:
  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mariadb
      DB_NAME: competition_db
      DB_USER: root
      DB_PASS: RootPassword123!
    depends_on:
      - mariadb

  mariadb:
    image: mariadb:10.11
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword123!
      MYSQL_DATABASE: competition_db
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:`,
    verify: 'docker compose up -d && docker compose ps'
  },
  {
    id: 'c12_1',
    secId: 'sec2',
    qNum: 'ข้อ 2.6',
    pdfPage: 12,
    questionText: 'กำหนด CI/CD Pipeline\n- สร้าง .gitlab-ci.yml เชื่อมโยงกับการกำหนด State ครบทั้ง 4 ขั้นตอน Build, Test, Push ขึ้น Registry ของตนเอง, Deploy ไปยัง Server ของตนเอง (พิจารณาการเขียนคำสั่งได้ถูกต้อง)',
    pts: 1,
    note: 'พิจารณาการเขียนคำสั่งได้ถูกต้อง',
    explanation: 'เขียนไฟล์ .gitlab-ci.yml ที่มี stages ครบ 4 ขั้นตอน: build, test, push, deploy โดยคำสั่งในแต่ละ Job ถูกต้องตามหลักการ',
    solutionType: 'code',
    lang: 'yaml',
    code: `stages:
  - build
  - test
  - push
  - deploy

build_job:
  stage: build
  image: node:18-alpine
  script:
    - npm ci

test_job:
  stage: test
  image: node:18-alpine
  script:
    - npm test

push_job:
  stage: push
  image: docker:24-cli
  services:
    - docker:24-dind
  script:
    - docker build -t 192.168.10.10:5000/app:latest .
    - docker push 192.168.10.10:5000/app:latest

deploy_job:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying image to Production..."
    - echo "Deployed successfully"
  only:
    - main`,
    verify: 'cat .gitlab-ci.yml'
  },
  {
    id: 'c12_2',
    secId: 'sec2',
    qNum: 'ข้อ 2.7',
    pdfPage: 12,
    questionText: 'ทดสอบใช้งาน Pipeline\n- Push code แล้วเกิด Trigger ได้จริง',
    pts: 0.5,
    note: '',
    explanation: 'เมื่อ Push commit ขึ้นไปยัง GitLab Server หน้า CI/CD Pipelines จะเกิด Trigger และรัน Pipeline อัตโนมัติทันที',
    solutionType: 'code',
    lang: 'bash',
    code: `git add .
git commit -m "feat: trigger ci cd pipeline"
git push origin main`,
    verify: 'ดูสถานะในหน้า GitLab: CI/CD -> Pipelines (สถานะขึ้น Running)'
  },
  {
    id: 'c12_3',
    secId: 'sec2',
    qNum: 'ข้อ 2.7',
    pdfPage: 12,
    questionText: 'ทดสอบใช้งาน Pipeline\n- กำหนด Stage ครบ 4 ขั้นตอน (build, test, push ขึ้น registry, deploy) และทำงานได้จริงทุกขั้นตอน',
    pts: 2,
    note: 'ถ้าได้ย่างใดอย่างหนึ่งจะไม่ได้คะแนน ไม่มีการหารเฉลี่ย',
    explanation: 'Pipeline ต้องรันผ่านเครื่องหมายถูกสีเขียว (Passed) ครบทั้ง 4 stages โดยไม่มีข้อใดตกหล่น',
    solutionType: 'text',
    steps: [
      'ตรวจสอบในหน้า GitLab CI/CD -> Pipelines',
      'Stage 1: build -> Passed (สีเขียว)',
      'Stage 2: test -> Passed (สีเขียว)',
      'Stage 3: push -> Passed (สีเขียว นำอิมเมจขึ้น Private Registry)',
      'Stage 4: deploy -> Passed (สีเขียว Deploy ลง Production Server สำเร็จ)'
    ]
  },
  {
    id: 'c12_4',
    secId: 'sec2',
    qNum: 'ข้อ 2.7',
    pdfPage: 12,
    questionText: 'ทดสอบใช้งาน Pipeline\n- ระบบสามารถ build และสร้าง image ได้',
    pts: 0.5,
    note: '',
    explanation: 'ในขั้นตอน build / push สามารถคอมไพล์โค้ดและสร้าง Docker Image สำเร็จ ตรวจสอบด้วยคำสั่ง docker images',
    solutionType: 'code',
    lang: 'bash',
    code: `# ตรวจสอบบนโฮสต์หรือใน Registry:
curl -X GET http://192.168.10.10:5000/v2/_catalog
# ผลลัพธ์: {"repositories":["app"]}`,
    verify: 'curl http://192.168.10.10:5000/v2/app/tags/list'
  },

  // ==========================================================================
  // ส่วนที่ 4: ซอฟต์แวร์และการประยุกต์ (53 คะแนนเต็ม) - หน้า 13-18
  // ==========================================================================
  {
    id: 'c13_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.1',
    pdfPage: 13,
    questionText: 'การออกแบบผังงาน (Flowchart) ตามความต้องการของผู้ใช้ (Requirement)\n- จัดทำผังงานระบบการเข้าสู่ระบบ (Login Flow)',
    pts: 1,
    note: '',
    explanation: 'จัดทำ Flowchart แสดงกระบวนการเข้าสู่ระบบ: รับค่า Username/Password ตรวจสอบความครบถ้วน เช็ก User และรหัสผ่าน bcrypt ออก JWT Token และนำทางตามสิทธิ์',
    solutionType: 'mermaid',
    code: `flowchart TD
    Start([เริ่มต้น]) --> Input[/ผู้ใช้กรอก Username และ Password/]
    Input --> Validate{ข้อมูลครบถ้วน?}
    
    Validate -- ไม่ครบ --> ShowErr1[/แจ้งเตือน: กรุณากรอกข้อมูลให้ครบถ้วน/]
    ShowErr1 --> Input
    
    Validate -- ครบถ้วน --> SendReq[ประมวลผล POST /api/auth/login]
    SendReq --> CheckUser{พบชื่อผู้ใช้ในระบบ?}
    
    CheckUser -- ไม่พบ (401) --> ShowErr2[/แจ้งเตือน: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง/]
    ShowErr2 --> Input
    
    CheckUser -- พบ --> CheckPass{ตรวจสอบรหัสผ่าน bcrypt}
    CheckPass -- ไม่ถูกต้อง (401) --> ShowErr2
    
    CheckPass -- ถูกต้อง (200) --> GenJWT[สร้าง Signed JWT Token ระบุ Role]
    GenJWT --> SaveStorage[บันทึก Token ลงใน LocalStorage]
    SaveStorage --> CheckRole{ตรวจสอบสิทธิ์ Role}
    
    CheckRole -- admin --> GoAdmin[/นำทางไปหน้า Admin Management/]
    CheckRole -- user1 --> GoOfficer[/นำทางไปหน้า Officer Dashboard/]
    CheckRole -- user2 --> GoMember[/นำทางไปหน้า Member Catalog/]
    
    GoAdmin --> End([สิ้นสุด])
    GoOfficer --> End
    GoMember --> End`
  },
  {
    id: 'c13_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.1',
    pdfPage: 13,
    questionText: 'การออกแบบผังงาน (Flowchart)\n- จัดทำผังงานกระบวนการของผู้ดูแลระบบ',
    pts: 1,
    note: '',
    explanation: 'Flowchart กระบวนการของผู้ดูแลระบบ (Admin Process): ดูสถิติรวม จัดการผู้ใช้ เปลี่ยน Role และมี Modal ยืนยันการลบข้อมูล (ใช้สัญลักษณ์มาตรฐานสากล ANSI)',
    solutionType: 'mermaid',
    code: `flowchart TD
    StartAdmin([เริ่มต้น Admin Dashboard]) --> ViewSummary[/แสดงผลสถิติผู้ใช้ และรายการอุปกรณ์/]
    ViewSummary --> SelectAction{เลือกการทำงาน}
    
    SelectAction -- จัดการผู้ใช้งาน --> OpenUser[/เปิดหน้า User Management/]
    OpenUser --> UserAction{เลือกคำสั่ง}
    UserAction -- เพิ่มผู้ใช้ --> InputUser[/กรอกข้อมูลผู้ใช้ + กำหนด Role/] --> SaveUser[บันทึกข้อมูลเข้าสู่ฐานข้อมูล]
    UserAction -- แก้ไข Role --> EditRole[/เลือกเปลี่ยนสิทธิ์ผู้ใช้/] --> SaveUser
    UserAction -- ลบผู้ใช้ --> ShowModal[/แสดง Modal ยืนยันการลบ/] --> ConfirmDel{ยืนยันการลบ?}
    ConfirmDel -- ยืนยัน --> DelReq[ส่งคำสั่ง DELETE /api/users/:id] --> SaveUser
    ConfirmDel -- ยกเลิก --> OpenUser
    
    SelectAction -- จัดการหมวดหมู่ --> ManageCat[เพิ่ม / แก้ไข / ลบ หมวดหมู่ข้อมูล]
    
    SaveUser --> EndAdmin([สิ้นสุดการทำงาน])
    ManageCat --> EndAdmin`
  },
  {
    id: 'c13_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.1',
    pdfPage: 13,
    questionText: 'การออกแบบผังงาน (Flowchart)\n- จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 1',
    pts: 1,
    note: '',
    explanation: 'Flowchart สำหรับผู้ใช้งานระดับ 1 (Officer): ค้นหาข้อมูล แบ่งหน้า เพิ่มข้อมูลพร้อมแนบไฟล์ แก้ไขข้อมูลและไฟล์ (ไม่มีปุ่มลบ) ตามมาตรฐาน ANSI',
    solutionType: 'mermaid',
    code: `flowchart TD
    StartU1([เริ่มต้น Officer Dashboard]) --> FetchData[ประมวลผลดึงข้อมูล GET /api/items]
    FetchData --> ShowList[/แสดงตารางข้อมูลพร้อมระบบแบ่งหน้า/]
    ShowList --> UserAction{เลือกคำสั่ง}
    
    UserAction -- ค้นหา/กรองข้อมูล --> InputSearch[/กรอกคำค้นหา Keyword/] --> FilterList[ประมวลผลกรองข้อมูล] --> ShowList
    
    UserAction -- เพิ่มรายการใหม่ --> OpenAddModal[/เปิดฟอร์มเพิ่มข้อมูล/]
    OpenAddModal --> InputForm[/กรอกข้อมูล + แนบไฟล์เอกสาร/]
    InputForm --> ValidateClient{ตรวจสอบความถูกต้อง?}
    ValidateClient -- ไม่ผ่าน --> ShowErr[/แสดงข้อความแจ้งเตือนข้อผิดพลาด/] --> OpenAddModal
    ValidateClient -- ผ่าน --> SendPost[ส่งข้อมูล POST /api/items พร้อมไฟล์แนบ]
    SendPost --> ShowSuccess[/แสดงข้อความ: บันทึกข้อมูลสำเร็จ/] --> FetchData
    
    UserAction -- แก้ไขข้อมูล --> OpenEdit[/เปิดฟอร์มแก้ไข + เปลี่ยนไฟล์แนบ/]
    OpenEdit --> SendPut[ส่งข้อมูล PUT /api/items/:id] --> ShowUpdate[/แสดงข้อความ: อัปเดตข้อมูลสำเร็จ/] --> FetchData
    
    ShowSuccess --> EndU1([สิ้นสุด])
    ShowUpdate --> EndU1`
  },
  {
    id: 'c13_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.1',
    pdfPage: 13,
    questionText: 'การออกแบบผังงาน (Flowchart)\n- จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 2',
    pts: 1,
    note: '',
    explanation: 'Flowchart ผู้ใช้งานระดับ 2 (Member): สิทธิ์อ่านอย่างเดียว (Read-Only) ค้นหา ดูรายละเอียด และดาวน์โหลดไฟล์แนบ',
    solutionType: 'mermaid',
    code: `flowchart TD
    StartU2([เริ่มต้น Member Catalog]) --> ReadItems[ดึงรายการข้อมูลสถานะ Active]
    ReadItems --> ShowCatalog[/แสดงผลแคตตาล็อกรายการข้อมูล/]
    ShowCatalog --> ActionU2{เลือกการกระทำ}
    
    ActionU2 -- ค้นหาข้อมูล --> TypeSearch[/กรอกคำค้นหา หรือเลือกหมวดหมู่/] --> FilterProc[ประมวลผลตัวกรอง] --> ShowCatalog
    
    ActionU2 -- ดูรายละเอียด --> ClickDetail[/คลิกเลือกรายการที่สนใจ/]
    ClickDetail --> ShowDetailModal[/แสดงหน้าต่างรายละเอียดข้อมูล/]
    ShowDetailModal --> HasFile{มีไฟล์แนบหรือไม่?}
    HasFile -- มี --> DownloadFile[/ดาวน์โหลดหรือเปิดดูไฟล์แนบ/]
    HasFile -- ไม่มี --> CloseModal[ปิดหน้าต่างรายละเอียด]
    
    DownloadFile --> EndU2([สิ้นสุด])
    CloseModal --> EndU2`
  },
  {
    id: 'c13_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.1',
    pdfPage: 13,
    questionText: 'การออกแบบผังงาน (Flowchart)\n- จัดทำผังงานภาพรวมของระบบทั้งหมด (Usecase Diagram)',
    pts: 1,
    note: '',
    explanation: 'Use Case Diagram จำแนกบทบาท 3 ตัวละคร: Admin (จัดการผู้ใช้/ระบบเต็มรูปแบบ), User Level 1 (สร้าง/แก้ไข/แนบไฟล์), User Level 2 (ค้นหา/ดู/ดาวน์โหลดไฟล์)',
    solutionType: 'mermaid',
    code: `flowchart LR
    Admin(["ผู้ดูแลระบบ (Admin)"])
    Officer(["เจ้าหน้าที่ (User 1)"])
    Member(["สมาชิก (User 2)"])

    subgraph SystemScope ["ระบบ DevOps Application"]
        UC_Auth[1. ล็อกอินด้วย JWT]
        UC_ManageUsers[2. จัดการผู้ใช้งาน CRUD]
        UC_Items[3. เพิ่ม/แก้ไขข้อมูลและแนบไฟล์]
        UC_Delete[4. ลบข้อมูลและยืนยัน]
        UC_Search[5. ค้นหาและดูข้อมูล]
    end

    Admin --> UC_Auth
    Admin --> UC_ManageUsers
    Admin --> UC_Items
    Admin --> UC_Delete
    Admin --> UC_Search

    Officer --> UC_Auth
    Officer --> UC_Items
    Officer --> UC_Search

    Member --> UC_Auth
    Member --> UC_Search`
  },
  {
    id: 'c14_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.2',
    pdfPage: 13,
    questionText: 'การออกแบบฐานข้อมูล (Database Design) พร้อม Class Diagram\n- มีการสร้างฐานข้อมูลอย่างน้อย 3 ตาราง',
    pts: 1,
    note: 'อย่างน้อย 3 ตาราง',
    explanation: 'สร้างตารางฐานข้อมูล 3 ตาราง: users (ผู้ใช้และสิทธิ์), categories (หมวดหมู่ข้อมูล), items (รายการข้อมูลและไฟล์แนบ)',
    solutionType: 'code',
    lang: 'sql',
    code: `CREATE DATABASE IF NOT EXISTS competition_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE competition_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user1', 'user2') NOT NULL DEFAULT 'user2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    file_path VARCHAR(255),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    verify: 'SHOW TABLES;'
  },
  {
    id: 'c14_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.2',
    pdfPage: 13,
    questionText: 'การออกแบบฐานข้อมูล (Database Design)\n- ตารางฐานข้อมูลมีความสัมพันธ์กันอย่างเหมาะสม (Relational Design)',
    pts: 1,
    note: '',
    explanation: 'กำหนด Foreign Key ความสัมพันธ์ 1:N ระหว่าง categories -> items และ users -> items พร้อม ON DELETE RESTRICT / CASCADE',
    solutionType: 'code',
    lang: 'sql',
    code: `ALTER TABLE items
ADD CONSTRAINT fk_items_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE items
ADD CONSTRAINT fk_items_user
FOREIGN KEY (created_by) REFERENCES users(id)
ON UPDATE CASCADE ON DELETE RESTRICT;`,
    verify: 'SHOW CREATE TABLE items;'
  },
  {
    id: 'c14_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.2',
    pdfPage: 13,
    questionText: 'การออกแบบฐานข้อมูล (Database Design)\n- มีการเลือกใช้ประเภทข้อมูล (Data Type) ได้เหมาะสมกับชนิดของข้อมูล',
    pts: 1,
    note: '',
    explanation: 'เลือกใช้ Data Type สอดคล้อง: INT Auto Increment สำหรับ ID, VARCHAR สำหรับชื่อ, ENUM สำหรับ Role สิทธิ์, TEXT สำหรับคำอธิบายยาว, และ TIMESTAMP สำหรับบันทึกเวลา',
    solutionType: 'text',
    steps: [
      'id: INT AUTO_INCREMENT PRIMARY KEY (เหมาะสมกับการเป็นดัชนีตัวเลข)',
      'username: VARCHAR(50) UNIQUE NOT NULL (ความยาวเหมาะสมและป้องกันชื่อซ้ำ)',
      'password_hash: VARCHAR(255) (รองรับความยาวของสตริงแฮช bcrypt 60 ตัวอักษร)',
      'role: ENUM("admin", "user1", "user2") (จำกัดค่าสิทธิ์ได้แม่นยำ ไม่เปลืองพื้นที่)',
      'created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP (บันทึกเวลาอัตโนมัติ)'
    ]
  },
  {
    id: 'c14_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.2',
    pdfPage: 13,
    questionText: 'การออกแบบฐานข้อมูล (Database Design)\n- แสดง Class Diagram ที่สามารถอธิบายโครงสร้างได้อย่างถูกต้องและสมบูรณ์',
    pts: 1,
    note: '',
    explanation: 'จัดทำ Class Diagram แสดง Attributes, Methods, และ Relationship ระหว่าง Entity Classes',
    solutionType: 'mermaid',
    code: `classDiagram
    class User {
        +int id
        +string username
        +string passwordHash
        +string role
        +datetime createdAt
        +login(password) bool
        +hasPermission(action) bool
    }

    class Category {
        +int id
        +string name
        +string description
        +datetime createdAt
        +getItems() List~Item~
    }

    class Item {
        +int id
        +string title
        +string description
        +int categoryId
        +string filePath
        +int createdBy
        +datetime createdAt
        +update(data) bool
        +delete() bool
    }

    User "1" --> "0..*" Item : creates
    Category "1" --> "0..*" Item : categorizes`
  },
  {
    id: 'c14_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.2',
    pdfPage: 13,
    questionText: 'การออกแบบฐานข้อมูล (Database Design)\n- มีการตั้งชื่อตารางและฟิลด์สอดคล้องกับวัตถุประสงค์ของระบบ และเป็นไปตามมาตรฐานการเขียนชื่อทางเทคนิค',
    pts: 1,
    note: '',
    explanation: 'ตั้งชื่อตารางเป็นคำนามพหูพจน์ (users, categories, items) และตั้งชื่อฟิลด์แบบ snake_case มาตรฐาน เช่น password_hash, category_id, file_path, created_at',
    solutionType: 'text',
    steps: [
      'ใช้ชื่อตารางแบบ lowercase plural nouns: users, categories, items',
      'ใช้ snake_case สำหรับชื่อฟิลด์: password_hash, category_id, file_path, created_at',
      'ฟิลด์กุญแจหลักใช้ `id` และกุญแจร่วมใช้รูปแบบ `[table_singular]_id` เช่น `category_id`'
    ]
  },
  {
    id: 'c15_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.3',
    pdfPage: 14,
    questionText: 'การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (Draw.io)\n- มี Template Layout สำหรับหน้าจอผู้ดูแลระบบ',
    pts: 1,
    note: '',
    explanation: 'วาดผังหน้าจอ Admin Layout ใน Draw.io: Sidebar เมนูครบครัน, การจัดการผู้ใช้, ตารางกำหนดสิทธิ์ Role, และปุ่มลบข้อมูลพร้อม Modal ยืนยัน',
    solutionType: 'text',
    steps: [
      'Header: แสดง Admin Badge และปุ่ม Logout',
      'Sidebar: เมนู Overview, User Management, Category Management, Audit Logs',
      'Content: ตารางจัดการผู้ใช้ แสดงปุ่มแก้ไขสิทธิ์ และปุ่มลบสีแดงพร้อมยืนยัน Confirmation'
    ]
  },
  {
    id: 'c15_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.3',
    pdfPage: 14,
    questionText: 'การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (Draw.io)\n- มี Template Layout สำหรับหน้าจอผู้ใช้งานระดับ 1',
    pts: 1,
    note: '',
    explanation: 'วาดผังหน้าจอ Officer Layout (User 1): ฟอร์มเพิ่มข้อมูลพร้อมปุ่มแนบไฟล์ (Drag & Drop), ตารางแก้ไขรายการ, และตัวกรองข้อมูล',
    solutionType: 'text',
    steps: [
      'Header: แสดง Officer Badge และชื่อผู้ใช้งาน',
      'Action Bar: ปุ่ม "+ เพิ่มรายการใหม่" และช่องค้นหาข้อมูล',
      'Content: ฟอร์มกรอกข้อมูล + ปุ่ม File Upload และตารางแก้ไขข้อมูล (ไม่มีปุ่มลบ)'
    ]
  },
  {
    id: 'c15_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.3',
    pdfPage: 14,
    questionText: 'การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (Draw.io)\n- มี Template Layout สำหรับหน้าจอผู้ใช้งานระดับ 2',
    pts: 1,
    note: '',
    explanation: 'วาดผังหน้าจอ Member Layout (User 2): ตารางแบบ Read-Only, กล่องค้นหา/กรองหมวดหมู่, และปุ่มเปิดดู/ดาวน์โหลดไฟล์แนบ',
    solutionType: 'text',
    steps: [
      'Header: แสดง Member Badge',
      'Content: แคตตาล็อกรายการข้อมูล มีระบบแบ่งหน้า (Pagination)',
      'Item View: ปุ่มดาวน์โหลดไฟล์แนบและดูรายละเอียด (ไม่มีฟอร์มเพิ่ม/แก้ไข/ลบ)'
    ]
  },
  {
    id: 'c15_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.3',
    pdfPage: 14,
    questionText: 'การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (Draw.io)\n- มี Template Layout สำหรับหน้าจอหลักของระบบ (Dashboard/Overview)',
    pts: 1,
    note: '',
    explanation: 'วาดผังหน้าจอ Dashboard Overview: การ์ดแสดงผลสถิติตัวเลข (KPI Summary), กราฟสรุปปริมาณข้อมูล, และกิจกรรมล่าสุด',
    solutionType: 'text',
    steps: [
      'Metrics Cards: การ์ดนับจำนวนผู้ใช้ทั้งหมด, จำนวนรายการข้อมูล, จำนวนการอัปโหลดไฟล์',
      'Data Visualisation: กราฟหรือตารางสถิติสรุปตามหมวดหมู่',
      'Recent Activities: ฟีดประวัติการเพิ่มข้อมูลล่าสุดของระบบ'
    ]
  },
  {
    id: 'c15_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.3',
    pdfPage: 14,
    questionText: 'การออกแบบหน้าจอด้วยโปรแกรมสำเร็จรูป (Draw.io)\n- มี Template Layout สำหรับหน้าจอเข้าสู่ระบบ (Login Screen)',
    pts: 1,
    note: '',
    explanation: 'วาดผังหน้าจอ Login Screen: การ์ดตรงกลางหน้าจอ ช่องกรอก Username, Password, ปุ่ม Login, และกล่อง Alert แจ้งเตือนข้อผิดพลาด',
    solutionType: 'text',
    steps: [
      'Brand Header: โลโก้และชื่อระบบ "DevOps Management System"',
      'Form Fields: ช่อง Input Username และ Password (มีไอคอนปิด/เปิดรหัสผ่าน)',
      'Action Button: ปุ่มกด "เข้าสู่ระบบ (Login)"',
      'Error Box: แถบสีแดงแสดงข้อความเตือนเมื่อกรอกรหัสผ่านไม่ถูกต้อง'
    ]
  },
  {
    id: 'c16_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.4',
    pdfPage: 14,
    questionText: 'การออกแบบ RESTful API สำหรับใช้งานในระบบ (Design / README.md)\n- ออกแบบ API ตามหลัก RESTful (เช่น ใช้ GET, POST, PUT/Patch, DELETE อย่างเหมาะสม)',
    pts: 1,
    note: '',
    explanation: 'ออกแบบ HTTP Methods ตามมาตรฐานสากล: GET สำหรับดึงข้อมูล, POST สำหรับสร้างข้อมูลใหม่, PUT สำหรับแก้ไขปรับปรุง, และ DELETE สำหรับลบข้อมูล',
    solutionType: 'text',
    steps: [
      'GET /api/items -> ดึงรายการข้อมูลทั้งหมด',
      'GET /api/items/:id -> ดึงข้อมูลรายชิ้น',
      'POST /api/items -> สร้างข้อมูลใหม่พร้อมแนบไฟล์',
      'PUT /api/items/:id -> แก้ไขปรับปรุงข้อมูล',
      'DELETE /api/items/:id -> ลบข้อมูลออกจากระบบ'
    ]
  },
  {
    id: 'c16_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.4',
    pdfPage: 14,
    questionText: 'การออกแบบ RESTful API\n- ตั้งชื่อ Endpoint สื่อความหมาย และมีความสอดคล้องกัน เช่น /api/teachers, /api/scores/{id}',
    pts: 1,
    note: '',
    explanation: 'ใช้คำนามพหูพจน์ระบุ Resource เช่น /api/auth/login, /api/users, /api/items, /api/items/:id อย่างเป็นเอกภาพทั่วทั้งระบบ',
    solutionType: 'code',
    lang: 'markdown',
    code: `### รายการ Endpoint มาตรฐาน:
- POST   /api/auth/login       : ยืนยันตัวตนและขอรับ JWT Token
- GET    /api/items            : ค้นหาและดึงรายการ (รองรับ ?search= และ ?page=)
- GET    /api/items/:id        : ดึงรายละเอียดตาม ID
- POST   /api/items            : เพิ่มข้อมูลใหม่พร้อมไฟล์แนบ (multipart/form-data)
- PUT    /api/items/:id        : แก้ไขข้อมูลและไฟล์แนบ
- DELETE /api/items/:id        : ลบรายการข้อมูล (เฉพาะ Admin)`
  },
  {
    id: 'c16_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.4',
    pdfPage: 14,
    questionText: 'การออกแบบ RESTful API\n- มีตัวอย่างรูปแบบ Response Body ที่สอดคล้องกับ HTTP Status Code อย่างเหมาะสม',
    pts: 1,
    note: '',
    explanation: 'ระบุ JSON Response Structure มาตรฐาน: status, message, data สอดคล้องกับ 200 OK และ 201 Created',
    solutionType: 'code',
    lang: 'json',
    code: `// HTTP 200 OK หรือ 201 Created
{
  "status": "success",
  "message": "บันทึกข้อมูลสำเร็จ",
  "data": {
    "id": 1,
    "title": "โครงการนำร่อง",
    "file_path": "/uploads/report.pdf"
  }
}`
  },
  {
    id: 'c16_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.4',
    pdfPage: 14,
    questionText: 'การออกแบบ RESTful API\n- มีการออกแบบรองรับกรณีเกิด Error เช่น Unauthorized (401), Not Found (404)',
    pts: 1,
    note: '',
    explanation: 'ออกแบบ Error Response สำหรับ HTTP 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)',
    solutionType: 'code',
    lang: 'json',
    code: `// HTTP 401 Unauthorized หรือ 404 Not Found
{
  "status": "error",
  "message": "ไม่พบข้อมูลที่ระบุ หรือไม่มีสิทธิ์เข้าถึงระบบ",
  "code": 401
}`
  },
  {
    id: 'c16_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.4',
    pdfPage: 14,
    questionText: 'การออกแบบ RESTful API\n- มีแนวทางด้านความปลอดภัยของ API เช่น JWT Token หรือการตรวจสอบสิทธิ์การเข้าถึง',
    pts: 1,
    note: '',
    explanation: 'กำหนดกลไกการส่ง JWT Token ผ่าน Authorization: Bearer <token> Header และตรวจสอบความถูกต้องของ Digital Signature ทุก Request',
    solutionType: 'code',
    lang: 'markdown',
    code: `### นโยบายความปลอดภัยของ API (Security Specs):
1. ส่งผ่าน HTTP Header: \`Authorization: Bearer <JWT_TOKEN>\`
2. Digital Signature: ลงนามด้วยกุญแจลับอัลกอริทึม HMAC-SHA256
3. สิทธิ์การเข้าถึง (RBAC):
   - Admin: ดำเนินการได้ทุก Endpoint รวมถึง DELETE
   - User Level 1: ดำเนินการ GET, POST, PUT
   - User Level 2: ดำเนินการได้เฉพาะ GET (Read-Only)`
  },
  {
    id: 'c17_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- สร้าง API แบบ GET พร้อมรับค่า (Query หรือ Path Parameters)',
    pts: 1,
    note: '',
    explanation: 'สร้าง Route GET /api/items รองรับ Query Parameters เช่น req.query.search, req.query.page และ Path Parameter /api/items/:id',
    solutionType: 'code',
    lang: 'javascript',
    code: `// backend/controllers/items.controller.js
exports.getItems = async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  // คิวรีข้อมูลตามเงื่อนไขค้นหาและแบ่งหน้า
  const [rows] = await db.query(
    'SELECT * FROM items WHERE title LIKE ? LIMIT ? OFFSET ?',
    [\`%\${search || ''}%\`, parseInt(limit), parseInt(offset)]
  );
  res.status(200).json({ status: 'success', data: rows });
};`,
    verify: 'curl http://localhost:3000/api/items?search=test&page=1'
  },
  {
    id: 'c17_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- สร้าง API แบบ POST ที่รับข้อมูลจาก Body อย่างถูกต้อง',
    pts: 1,
    note: '',
    explanation: 'เปิดใช้งาน express.json() และดึงข้อมูลจาก req.body เพื่อนำไปบันทึกลงฐานข้อมูลอย่างถูกต้อง',
    solutionType: 'code',
    lang: 'javascript',
    code: `// backend/controllers/items.controller.js
exports.createItem = async (req, res) => {
  const { title, description, category_id } = req.body;
  if (!title) {
    return res.status(400).json({ status: 'error', message: 'กรุณากรอกชื่อเรื่อง' });
  }
  const [result] = await db.query(
    'INSERT INTO items (title, description, category_id, created_by) VALUES (?, ?, ?, ?)',
    [title, description, category_id, req.user.id]
  );
  res.status(201).json({ status: 'success', message: 'บันทึกข้อมูลสำเร็จ', data: { id: result.insertId } });
};`,
    verify: 'curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d \'{"title":"งานใหม่"}\''
  },
  {
    id: 'c17_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- สร้าง API สำหรับอัปโหลดไฟล์',
    pts: 1,
    note: '',
    explanation: 'ใช้งาน Multer Middleware เพื่อรับไฟล์แนบ ตรวจสอบชนิดไฟล์ และบันทึกลงในโฟลเดอร์ uploads/',
    solutionType: 'code',
    lang: 'javascript',
    code: `const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// นำไปใช้ใน Router:
router.post('/', upload.single('attachment'), itemsController.createItemWithFile);`,
    verify: 'curl -F "attachment=@test.pdf" http://localhost:3000/api/items'
  },
  {
    id: 'c17_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- สร้าง API Login โดยใช้ JWT Token (ซึ่งมีการลงนาม Signing เพื่อความปลอดภัย และใช้สำหรับตรวจสอบสิทธิ์ในการเข้าถึงระบบ)',
    pts: 1,
    note: '',
    explanation: 'ตรวจสอบรหัสผ่านด้วย bcrypt.compare และออก Signed JWT Token ด้วย jwt.sign พร้อมระบุ Payload id, username, role',
    solutionType: 'code',
    lang: 'javascript',
    code: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (!users.length || !(await bcrypt.compare(password, users[0].password_hash))) {
    return res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }
  const token = jwt.sign(
    { id: users[0].id, username: users[0].username, role: users[0].role },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '8h' }
  );
  res.status(200).json({ status: 'success', token, role: users[0].role });
};`,
    verify: 'curl -X POST http://localhost:3000/api/auth/login -d \'{"username":"admin","password":"password"}\''
  },
  {
    id: 'c17_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- มีการจัดการข้อผิดพลาด (Exception Handling) เช่น ตรวจสอบข้อมูลไม่ครบ, ไม่พบข้อมูล',
    pts: 1,
    note: '',
    explanation: 'ใช้ try/catch ครอบคำสั่ง และมี Centralized Error Handling Middleware ส่ง Status Code ที่ถูกต้อง ป้องกันเซิร์ฟเวอร์แครช',
    solutionType: 'code',
    lang: 'javascript',
    code: `// Global Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
  });
});`,
    verify: 'ทดสอบส่ง Request ผิดรูปแบบ ระบบต้องไม่ล่มและตอบ 400/500 JSON'
  },
  {
    id: 'c17_6',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- API ส่ง Response ที่เหมาะสม เช่น JSON มี status, message เพิ่มเติม, data อย่างเป็นระบบ',
    pts: 1,
    note: '',
    explanation: 'สร้าง Response Structure แบบมาตรฐานเดียวกันทุก Route: { status: "success"|"error", message: "...", data: ... }',
    solutionType: 'code',
    lang: 'javascript',
    code: `// Helper function ตอบกลับ
const successResponse = (res, data, message = 'ดำเนินการสำเร็จ', code = 200) => {
  return res.status(code).json({ status: 'success', message, data });
};`,
    verify: 'res.json() ต้องมีทั้ง status, message, data ครบถ้วน'
  },
  {
    id: 'c17_7',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- มีคำอธิบาย API และการเรียกใช้ แต่ละ Service (GET, POST, PUT/PATCH, DELETE) ครบอย่างน้อย Method ละ 1 API',
    pts: 1,
    note: 'ครบอย่างน้อย Method ละ 1 API',
    explanation: 'เขียน JSDoc / Code Comment กำกับหัวฟังก์ชันของทั้ง 4 Methods: GET, POST, PUT, DELETE อย่างชัดเจน',
    solutionType: 'code',
    lang: 'javascript',
    code: `/**
 * @method GET /api/items
 * @description ดึงรายการข้อมูลทั้งหมด รองรับ query: search, page
 */
router.get('/', itemsController.getItems);

/**
 * @method POST /api/items
 * @description เพิ่มข้อมูลใหม่พร้อมแนบไฟล์ body: { title, description }
 */
router.post('/', upload.single('file'), itemsController.createItem);

/**
 * @method PUT /api/items/:id
 * @description ปรับปรุงแก้ไขข้อมูลตาม ID
 */
router.put('/:id', itemsController.updateItem);

/**
 * @method DELETE /api/items/:id
 * @description ลบข้อมูลออกจากระบบ (เฉพาะผู้ดูแลระบบ)
 */
router.delete('/:id', itemsController.deleteItem);`,
    verify: 'ตรวจสอบ Comment ในไฟล์ backend/routes/items.routes.js'
  },
  {
    id: 'c17_8',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- ระบุข้อมูลที่ใช้ส่งในแต่ละ API เช่น query, path, body อย่างชัดเจน',
    pts: 1,
    note: '',
    explanation: 'กำหนดและตรวจสอบข้อมูล Request Parameters ผ่านตัวแปรอย่างชัดเจน: req.query, req.params.id, req.body',
    solutionType: 'code',
    lang: 'javascript',
    code: `exports.updateItem = async (req, res) => {
  const { id } = req.params;             // Path Parameter
  const { title, description } = req.body; // Body Data
  const { notify } = req.query;          // Query Parameter
  // ดำเนินการอัปเดตข้อมูล...
};`,
    verify: 'ตรวจสอบการอ่าน req.params, req.body, req.query ใน Controller'
  },
  {
    id: 'c17_9',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- โค้ด Back-end มีโครงสร้างดี อ่านง่าย โดยใช้ router หรือ async/await อย่างเหมาะสม',
    pts: 1,
    note: '',
    explanation: 'แยกโครงสร้าง MVC: โฟลเดอร์ routes/, controllers/, middleware/ และเขียนโค้ดด้วย async/await ไม่ใช้ callback ซ้อน',
    solutionType: 'code',
    lang: 'javascript',
    code: `// ใช้ express.Router() และ async/await อย่างถูกต้อง
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await itemService.findAll();
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);
  }
});`,
    verify: 'โครงสร้างไฟล์เป็นสัดส่วน มี routes และ controllers แยกกัน'
  },
  {
    id: 'c17_10',
    secId: 'sec4',
    qNum: 'ข้อ 4.5',
    pdfPage: 15,
    questionText: 'พัฒนาระบบ Back-end การพัฒนา API\n- API มีความปลอดภัย และมีระบบตรวจสอบสิทธิ์ก่อนเข้าถึงข้อมูล',
    pts: 1,
    note: '',
    explanation: 'สร้าง Authentication Middleware ตรวจสอบ JWT Token และ Authorization Middleware (RBAC) ตรวจสอบสิทธิ์ Role ก่อนให้เข้าถึงข้อมูล',
    solutionType: 'code',
    lang: 'javascript',
    code: `// backend/middleware/auth.middleware.js
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'error', message: 'กรุณาเข้าสู่ระบบ' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, user) => {
    if (err) return res.status(403).json({ status: 'error', message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    req.user = user;
    next();
  });
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ status: 'error', message: 'คุณไม่มีสิทธิ์ในการกระทำนี้' });
  }
  next();
};`,
    verify: 'curl http://localhost:3000/api/items (ไม่มี Token ต้องตอบ 401 Unauthorized)'
  },
  {
    id: 'c18_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มี Layout ใช้งานง่าย มี Responsive',
    pts: 1,
    note: '',
    explanation: 'พัฒนาหน้าจอแบบ Responsive รองรับทั้งจอมือถือ แท็บเล็ต และหน้าจอคอมพิวเตอร์เดสก์ท็อป โดยจัดวางองค์ประกอบให้ใช้งานสะดวก',
    solutionType: 'text',
    steps: [
      'ใช้ CSS Flexbox / Grid หรือ TailwindCSS breakpoint (sm, md, lg)',
      'บนจอมือถือ: ซ่อน Sidebar เป็น Drawer Menu อัตโนมัติ',
      'บนจอคอมพิวเตอร์: แสดง Sidebar และตารางข้อมูลเต็มความกว้าง'
    ]
  },
  {
    id: 'c18_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีหน้าจอ ระบบ Login หรือ Authentication ด้วย JWT ที่ใช้งานได้จริง',
    pts: 1,
    note: '',
    explanation: 'สร้างฟอร์ม Login ส่งค่า Username/Password ไปตรวจสอบที่ Backend และบันทึก JWT Token ลงใน LocalStorage',
    solutionType: 'code',
    lang: 'javascript',
    code: `async function handleLogin(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_role', data.role);
    window.location.href = '/dashboard';
  }
}`,
    verify: 'ทดสอบล็อกอินในหน้าเว็บ ตรวจดู LocalStorage จะพบ auth_token'
  },
  {
    id: 'c18_3',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- แยกระบบ Login ของกลุ่มผู้ใช้งานแต่ละระดับได้ ด้วย JWT',
    pts: 1,
    note: '',
    explanation: 'ตรวจสอบ Role ใน JWT Payload เมื่อผู้ใช้ล็อกอินสำเร็จ ให้นำทางไปยังหน้าจอเฉพาะสิทธิ์ (Admin, Officer, Member)',
    solutionType: 'code',
    lang: 'javascript',
    code: `const role = localStorage.getItem('auth_role');
if (role === 'admin') {
  showAdminMenu();
} else if (role === 'user1') {
  showOfficerMenu();
} else {
  showMemberMenu();
}`,
    verify: 'ล็อกอินด้วย user ต่าง role หน้าจอและเมนูจะปรับเปลี่ยนตามสิทธิ์ทันที'
  },
  {
    id: 'c18_4',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการเพิ่มข้อมูลได้สมบูรณ์ตามแบบฟอร์มที่ออกแบบ',
    pts: 1,
    note: '',
    explanation: 'มีฟอร์มกรอกข้อมูลครบทุกฟิลด์ เมื่อกดยืนยัน ข้อมูลจะถูกส่งไปบันทึกลงฐานข้อมูลและตารางจะรีเฟรชแสดงข้อมูลใหม่',
    solutionType: 'text',
    steps: [
      'คลิกปุ่ม "+ เพิ่มรายการใหม่"',
      'กรอกชื่อเรื่อง คำอธิบาย และเลือกหมวดหมู่',
      'กดปุ่มบันทึก ข้อมูลใหม่จะปรากฏในตารางทันที'
    ]
  },
  {
    id: 'c18_5',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการแนบไฟล์พร้อมกับเพิ่มข้อมูลได้สมบูรณ์',
    pts: 1,
    note: '',
    explanation: 'ในฟอร์มเพิ่มข้อมูลมี input type="file" เมื่อเลือกไฟล์จะส่งข้อมูลผ่าน FormData ไปยังเซิร์ฟเวอร์สมบูรณ์',
    solutionType: 'code',
    lang: 'javascript',
    code: `const formData = new FormData();
formData.append('title', document.getElementById('title').value);
formData.append('file', document.getElementById('fileInput').files[0]);

fetch('/api/items', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token },
  body: formData
});`,
    verify: 'แนบไฟล์รูปภาพหรือ PDF เมื่อบันทึกแล้วสามารถคลิกดูไฟล์ได้'
  },
  {
    id: 'c18_6',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการแก้ไขและปรับปรุงข้อมูลได้',
    pts: 1,
    note: '',
    explanation: 'มีปุ่มแก้ไขในแต่ละแถว เมื่อคลิกจะโหลดข้อมูลเดิมขึ้นมาในฟอร์ม แก้ไขแล้วบันทึกส่ง PUT ไปอัปเดตข้อมูล',
    solutionType: 'text',
    steps: [
      'คลิกปุ่ม "แก้ไข" ที่รายการในตาราง',
      'แก้ไขข้อความในฟอร์ม แล้วกดบันทึก',
      'ข้อมูลในตารางจะอัปเดตตามที่แก้ไขทันที'
    ]
  },
  {
    id: 'c18_7',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการแก้ไขไฟล์แนบที่เกี่ยวข้องกับข้อมูลได้',
    pts: 1,
    note: '',
    explanation: 'ในฟอร์มแก้ไข ผู้ใช้สามารถเลือกไฟล์แนบอันใหม่เพื่ออัปโหลดแทนที่ไฟล์เดิมได้',
    solutionType: 'text',
    steps: [
      'ในหน้าแก้ไขรายการ สามารถกดเลือกไฟล์ใหม่เพื่อ Replace ไฟล์แนบเดิม',
      'เมื่อกดบันทึก ระบบจะลบหรือแทนที่พาธไฟล์ในฐานข้อมูล'
    ]
  },
  {
    id: 'c18_8',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีแจ้งเตือนการลบข้อมูลได้',
    pts: 1,
    note: '',
    explanation: 'เมื่อผู้ดูแลระบบกดปุ่มลบ จะมี Modal หรือ Dialog ป๊อปอัปขึ้นมาถามยืนยันก่อนเสมอเพื่อป้องกันการลบโดยไม่ตั้งใจ',
    solutionType: 'code',
    lang: 'javascript',
    code: `function confirmDelete(id) {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
    deleteItem(id);
  }
}`,
    verify: 'กดปุ่มลบ ต้องมีหน้าต่างถามยืนยันก่อนลบจริง'
  },
  {
    id: 'c18_9',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีระบบค้นหา/Filter ข้อมูลในหน้า UI ตามสิทธิ์ผู้ใช้งาน แต่ละระดับ',
    pts: 1,
    note: '',
    explanation: 'มีช่อง Search Box และ Dropdown ตัวกรองหมวดหมู่ ค้นหาข้อมูลได้แบบ Real-time หรือกดปุ่มค้นหา',
    solutionType: 'code',
    lang: 'javascript',
    code: `document.getElementById('searchInput').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allItems.filter(item => item.title.toLowerCase().includes(keyword));
  renderTable(filtered);
});`,
    verify: 'พิมพ์ค้นหาในช่อง ค้นหารายชื่อในตารางจะกรองตามทันที'
  },
  {
    id: 'c18_10',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีระบบการแบ่งหน้าแสดงข้อมูล ในหน้า UI ตามสิทธิ์ผู้ใช้งาน แต่ละระดับ',
    pts: 1,
    note: '',
    explanation: 'มีระบบแบ่งหน้า Pagination แสดงปุ่ม ก่อนหน้า (Previous), เลขหน้า 1 2 3, และ ถัดไป (Next)',
    solutionType: 'text',
    steps: [
      'จำกัดแสดงผลหน้าละ 5 หรือ 10 รายการ',
      'มีปุ่มเปลี่ยนหน้าด้านล่างตาราง กดหน้า 2 ข้อมูลจะเปลี่ยนอย่างถูกต้อง'
    ]
  },
  {
    id: 'c18_11',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการ Validate ข้อมูล ฝั่ง Frontend ก่อนส่งไปยัง Backend',
    pts: 1,
    note: '',
    explanation: 'ตรวจสอบฟอร์มก่อน Submit เช่น ชื่อเรื่องห้ามว่าง รหัสผ่านขั้นต่ำ 6 ตัวอักษร หากไม่ผ่านจะแจ้งเตือนใต้ช่อง Input ทันที',
    solutionType: 'code',
    lang: 'javascript',
    code: `if (!title.trim()) {
  document.getElementById('titleError').innerText = 'กรุณาระบุชื่อเรื่อง';
  return false;
}`,
    verify: 'ลองกดบันทึกโดยไม่กรอกข้อมูล ระบบจะแจ้งเตือนและไม่ส่ง Request'
  },
  {
    id: 'c18_12',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการเขียนโปรแกรมที่มีการทำ Error Handling ในฝั่ง Frontend (ข้อความแจ้งข้อผิดพลาดที่ผู้ใช้งานเข้าใจง่าย)',
    pts: 1,
    note: '',
    explanation: 'แสดงกล่องแจ้งเตือน (Toast Notification) หรือ Alert ข้อความภาษาไทยที่เข้าใจง่าย เช่น "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"',
    solutionType: 'code',
    lang: 'javascript',
    code: `catch (err) {
  showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง', 'error');
}`,
    verify: 'ทดสอบปิดเน็ตแล้วกดบันทึก จะมีแจ้งเตือนภาษาไทยเข้าใจง่าย'
  },
  {
    id: 'c18_13',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการเขียนโปรแกรมที่มีการแสดงข้อความผิดพลาด ที่เกิดจาก Error ฝั่ง Backend (การแปลงรหัสข้อผิดพลาดเป็นข้อความที่เหมาะสม)',
    pts: 1,
    note: '',
    explanation: 'แปลง HTTP Status Code จาก Backend เป็นข้อความที่เหมาะสม เช่น 401 แปลงเป็น "รหัสผ่านไม่ถูกต้อง", 403 แปลงเป็น "คุณไม่มีสิทธิ์ในการเข้าถึง"',
    solutionType: 'code',
    lang: 'javascript',
    code: `if (res.status === 401) {
  showError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
} else if (res.status === 403) {
  showError('คุณไม่มีสิทธิ์ในการกระทำรายการนี้');
} else if (res.status === 404) {
  showError('ไม่พบข้อมูลที่ต้องการ');
}`,
    verify: 'กรอกรหัสผ่านผิด หน้าจอจะแสดงข้อความ "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"'
  },
  {
    id: 'c18_14',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- มีการสร้าง Dockerfile สำหรับ Backend',
    pts: 1,
    note: '',
    explanation: 'สร้างไฟล์ Dockerfile ในโฟลเดอร์ Backend เพื่อใช้รันเซอร์วิสผ่าน Docker Container',
    solutionType: 'code',
    lang: 'dockerfile',
    code: `# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
    verify: 'cat modules/04_Fullstack_DevOps_App/Dockerfile'
  },
  {
    id: 'c18_15',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 16,
    questionText: 'พัฒนาระบบ Front-end\n- เขียน Pipeline config ประกอบด้วย stages build, test, push, deploy ทำงานได้ทุก stages',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า Pipeline ให้รันผ่านทั้ง 4 stages ครบถ้วนและไม่ติด Error',
    solutionType: 'code',
    lang: 'yaml',
    code: `stages:
  - build
  - test
  - push
  - deploy`,
    verify: 'ตรวจสอบหน้า GitLab CI/CD Pipeline ผ่านทุก Stage'
  },
  {
    id: 'c19_1',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 17,
    questionText: 'เขียน Pipeline ทำงานอัตโนมัติเมื่อมี Push ขึ้น Git Server (Auto Build/Test)',
    pts: 1,
    note: '',
    explanation: 'ตั้งค่า GitLab CI ให้สั่งรัน Pipeline อัตโนมัติทุกครั้งเมื่อมีการ git push commit',
    solutionType: 'text',
    steps: [
      'เมื่อผู้พัฒนาพิมพ์ git push origin main',
      'GitLab จะดัก Event Push และเรียก GitLab Runner มาเริ่มงาน Build & Test อัตโนมัติ'
    ]
  },
  {
    id: 'c19_2',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 17,
    questionText: 'มี Test ขั้นพื้นฐานใน Pipeline (Unit Testing / Integration Testing) อย่างละ 1 Test Case',
    pts: 1,
    note: 'อย่างละ 1 Test Case',
    explanation: 'เขียน Unit Test (ทดสอบแฮชรหัสผ่าน bcrypt และออก JWT) และ Integration Test (ทดสอบ API Login ด้วย Supertest) ผ่านฉลุย 100%',
    solutionType: 'code',
    lang: 'javascript',
    code: `// tests/api.test.js
const test = require('node:test');
const assert = require('node:assert');

// 1. Unit Testing: ตรวจสอบการออกและถอดรหัส JWT Token
test('UNIT-001: JWT Sign & Verify Payload', () => {
  const token = jwt.sign({ username: 'admin', role: 'admin' }, 'secret');
  const decoded = jwt.verify(token, 'secret');
  assert.strictEqual(decoded.role, 'admin');
});

// 2. Integration Testing: ทดสอบ API Login
test('INT-001: POST /api/auth/login 200 OK', async () => {
  const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'password' });
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body.token);
});`,
    verify: 'npm test (ผลลัพธ์ pass 5 | fail 0)'
  },
  {
    id: 'c20',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 17,
    questionText: 'มี E to E Test เป็นการทดสอบ Work flow ตั้งแต่เริ่มต้นจนจบ ตัวอย่างเช่น E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ, E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ (ผลที่คาดหวัง: ข้อมูลถูกบันทึก และแสดงข้อความ "บันทึกข้อมูลสำเร็จ")',
    pts: 2,
    note: 'กรรมการจัดการแข่งขันกำหนดเอง',
    explanation: 'เขียน Playwright E2E Test ครบทั้ง 2 Workflows: E2E-001 (เปิดหน้า Login -> กรอกข้อมูล -> กด Login -> พาไป Dashboard) และ E2E-002 (เปิดหน้าเพิ่มข้อมูล -> กรอกฟอร์ม -> กดบันทึก -> แสดงข้อความ "บันทึกข้อมูลสำเร็จ")',
    solutionType: 'code',
    lang: 'javascript',
    code: `// tests/e2e.spec.js
const { test, expect } = require('@playwright/test');

test('E2E-001: ผู้ใช้เข้าสู่ระบบสำเร็จ', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('#loginBtn');
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('#userRoleBadge')).toContainText('admin');
});

test('E2E-002: ผู้ใช้ส่งข้อมูลสำเร็จ', async ({ page }) => {
  await page.click('#openAddModalBtn');
  await page.fill('#itemTitle', 'รายการทดสอบ E2E');
  await page.click('#submitItemBtn');
  await expect(page.locator('#toastMessage')).toContainText('บันทึกข้อมูลสำเร็จ');
});`,
    verify: 'npx playwright test'
  },
  {
    id: 'c21',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 18,
    questionText: 'มีการใช้ Git และ Branch Strategy ในการกำหนดบทบาท Backend / Frontend / DevOps(merge)',
    pts: 1,
    note: '',
    explanation: 'แบ่ง Branch ตามบทบาทสมาชิกในทีม: branch frontend, branch backend, branch devops และทำ Merge Request รวมเข้าสู่ main branch',
    solutionType: 'code',
    lang: 'bash',
    code: `git checkout -b feature/backend-api
# พัฒนาโค้ด Backend...
git checkout -b feature/frontend-ui
# พัฒนาโค้ด Frontend...
git checkout main
git merge feature/backend-api
git merge feature/frontend-ui`,
    verify: 'git log --graph --oneline --all'
  },
  {
    id: 'c22',
    secId: 'sec4',
    qNum: 'ข้อ 4.6',
    pdfPage: 18,
    questionText: 'ความสมบูรณ์ของระบบทั้งหมด Application',
    pts: 3,
    note: '',
    explanation: 'ระบบแอปพลิเคชันทำงานเชื่อมโยงกันอย่างสมบูรณ์แบบตั้งแต่ Frontend, Backend REST API, Database MariaDB, จนถึง CI/CD Pipeline ไม่มี Error ตกค้าง',
    solutionType: 'text',
    steps: [
      'Frontend และ Backend คุยกันผ่าน RESTful API ด้วยสถานะ 200/201/401 สมบูรณ์',
      'Database มีข้อมูลสัมพันธ์กัน 3 ตาราง และบันทึกไฟล์แนบได้จริง',
      'CI/CD Pipeline ผ่านครบทุกขั้นตอน และระบบรันอยู่บน Docker Container'
    ]
  },

  // ==========================================================================
  // ส่วนที่ 5: การนำเสนอและตอบคำถามคณะกรรมการ (10 คะแนนเต็ม) - หน้า 18
  // ==========================================================================
  {
    id: 'c23_1',
    secId: 'sec5',
    qNum: 'ข้อ 5.1',
    pdfPage: 18,
    questionText: 'การตอบคำถามจากคณะกรรมการ จากชุดคำถาม Backend Frontend และแนวทางการแก้ปัญหา 5 นาที\n[คำถามที่ 1: ด้าน Backend & Security]',
    pts: 1,
    note: 'คำถามละ 1 คะแนน (รวม 3 คะแนน)',
    explanation: 'คำถามของกรรมการ: "ทำไมถึงเลือกใช้ JWT ในการยืนยันตัวตน และหากผู้ใช้ Logout หรือต้องการระงับสิทธิ์ทันที มีแนวทางจัดการอย่างไร?"',
    solutionType: 'qa',
    qSample: 'ทำไมถึงเลือกใช้ JWT ในการยืนยันตัวตน และหากผู้ใช้ Logout หรือต้องการระงับสิทธิ์ทันที มีแนวทางจัดการอย่างไร?',
    answerText: 'แนวทางการตอบที่ถูกต้องตามมาตรฐานสากล:\n1. เหตุผลที่ใช้ JWT: เป็น Stateless Authentication ไม่ต้องเก็บ Session ลง RAM ใน Server จึงรองรับผู้ใช้งานจำนวนมากได้ดี และมีความปลอดภัยด้วย Digital Signature (HMAC-SHA256)\n2. การยกเลิกสิทธิ์ทันที:\n   - วิธี Token Blacklist ใน Redis: เมื่อผู้ใช้ Logout ให้นำ JWT Token ไปบันทึกลง Redis พร้อมตั้ง TTL ตามเวลาหมดอายุของ Token หากมี Request เข้ามาให้ Middleware ตรวจสอบ Blacklist ก่อน\n   - วิธี Token Versioning: เพิ่มฟิลด์ token_version ในตาราง users เมื่อต้องการระงับสิทธิ์ ให้บวกเลขเวอร์ชันเพิ่มขึ้น Token เก่าจะถูกปฏิเสธทันทีครับ'
  },
  {
    id: 'c23_2',
    secId: 'sec5',
    qNum: 'ข้อ 5.1',
    pdfPage: 18,
    questionText: 'การตอบคำถามจากคณะกรรมการ จากชุดคำถาม Backend Frontend และแนวทางการแก้ปัญหา 5 นาที\n[คำถามที่ 2: ด้าน Frontend & UX/UI]',
    pts: 1,
    note: 'คำถามละ 1 คะแนน (รวม 3 คะแนน)',
    explanation: 'คำถามของกรรมการ: "ระบบของคุณมีการจัดการ Error Handling ระหว่าง Frontend กับ Backend อย่างไร เพื่อไม่ให้หน้าจอค้างหรือผู้ใช้สับสน?"',
    solutionType: 'qa',
    qSample: 'ระบบของคุณมีการจัดการ Error Handling ระหว่าง Frontend กับ Backend อย่างไร เพื่อไม่ให้หน้าจอค้างหรือผู้ใช้สับสน?',
    answerText: 'แนวทางการตอบที่ถูกต้องตามมาตรฐานสากล:\n1. ตรวจสอบข้อมูลฝั่ง Client ล่วงหน้า (Client-side Validation): เช็กความถูกต้องของข้อมูลก่อนส่ง Request เสมอ ทำให้ผู้ใช้ทราบข้อผิดพลาดทันทีโดยไม่ต้องรอเซิร์ฟเวอร์\n2. ส่ง HTTP Status Code ที่ชัดเจน: Backend ตอบกลับด้วย Status Code มาตรฐาน (เช่น 400 ข้อมูลไม่ครบ, 401 รหัสผ่านผิด, 404 ไม่พบข้อมูล) พร้อม JSON รูปแบบ { status, message, data }\n3. แปลงเป็นข้อความภาษาไทยที่เข้าใจง่าย: Frontend นำ error code หรือ message มาแปลงเป็นคำอธิบายที่สุภาพผ่าน Toast Notification และระบุช่องที่ผิดพลาดด้วยสีแดงอย่างชัดเจนครับ'
  },
  {
    id: 'c23_3',
    secId: 'sec5',
    qNum: 'ข้อ 5.1',
    pdfPage: 18,
    questionText: 'การตอบคำถามจากคณะกรรมการ จากชุดคำถาม Backend Frontend และแนวทางการแก้ปัญหา 5 นาที\n[คำถามที่ 3: ด้าน DevOps & Troubleshooting]',
    pts: 1,
    note: 'คำถามละ 1 คะแนน (รวม 3 คะแนน)',
    explanation: 'คำถามของกรรมการ: "หากใน CI/CD Pipeline ขั้นตอนที่ 4 Deploy เกิดข้อผิดพลาด Failed ขึ้นมา คุณมีกระบวนการแก้ไขและ Rollback อย่างไร?"',
    solutionType: 'qa',
    qSample: 'หากใน CI/CD Pipeline ขั้นตอนที่ 4 Deploy เกิดข้อผิดพลาด Failed ขึ้นมา คุณมีกระบวนการแก้ไขและ Rollback อย่างไร และทำไมในระบบเครือข่ายจึงต้องแยก VLAN?',
    answerText: 'แนวทางการตอบที่ถูกต้องตามมาตรฐานสากล:\n1. การกู้คืนระบบ (Rollback): ตรวจสอบสาเหตุจาก GitLab CI Job Logs ทันที และใช้คำสั่ง Redeploy Docker Image Tag เวอร์ชั่นก่อนหน้าจาก Private Registry ของตนเองกลับมาทำงานแทน ซึ่งใช้เวลาเพียงไม่กี่วินาที (Zero Downtime)\n2. เหตุผลที่ต้องแยก VLAN (Server, Dev, Guest): เพื่อจำกัด Broadcast Domain และความปลอดภัย โดยใช้ ACL กั้นไม่ให้บุคคลภายนอกเข้าถึงวง Server ได้โดยตรง\n3. Reverse Proxy: ทำหน้าที่รวมศูนย์การจัดการ SSL Certificate และซ่อนพอร์ตภายในของ Container ครับ'
  },
  {
    id: 'c24',
    secId: 'sec5',
    qNum: 'ข้อ 5.2',
    pdfPage: 18,
    questionText: 'นำเสนอวิธีการทำงานร่วมกัน โดยกระจายการทำงานกันอย่างเหมาะสม',
    pts: 3,
    note: '',
    explanation: 'อธิบายการแบ่งหน้าที่ 3 คนตามความเชี่ยวชาญ: คนที่ 1 ดูแล Network & Linux Server, คนที่ 2 ดูแล Backend API & CI/CD, คนที่ 3 ดูแล Frontend UI & Automated Test',
    solutionType: 'text',
    steps: [
      'คนที่ 1 (Network & Infrastructure): จัดการ Switch L3, VLAN, IP Gateway, DHCP, NAT, ACL และติดตั้ง Ubuntu บน Proxmox',
      'คนที่ 2 (Backend & DevOps): ออกแบบตารางฐานข้อมูล, พัฒนา REST API Node.js, เขียน .gitlab-ci.yml และทดสอบ Unit Test',
      'คนที่ 3 (Frontend & QA): วาดผังงาน Flowchart และ Draw.io, พัฒนาหน้าจอ Responsive UI, และเขียน Playwright E2E Tests'
    ]
  },
  {
    id: 'c25_1',
    secId: 'sec5',
    qNum: 'ข้อ 5.3',
    pdfPage: 18,
    questionText: 'บุคลิกภาพ',
    pts: 3,
    note: '',
    explanation: 'การแต่งกายด้วยชุดนักศึกษาถูกต้องตามระเบียบ กิริยาวาจาสุภาพ มั่นใจ ตอบคำถามอย่างชัดเจนและมีลำดับขั้นตอน',
    solutionType: 'text',
    steps: [
      'แต่งกายด้วยเครื่องแบบนักศึกษาของสถานศึกษาถูกต้อง เรียบร้อย',
      'มีสัมมาคารวะ ไหว้และกล่าวทักทายคณะกรรมการอย่างสุภาพ',
      'สบตาผู้ฟัง พูดจาฉะฉาน ชัดเจน และแสดงความมั่นใจในผลงานของทีม'
    ]
  },
  {
    id: 'c25_2',
    secId: 'sec5',
    qNum: 'ข้อ 5.4',
    pdfPage: 18,
    questionText: 'การนำเสนอภายในระยะเวลาที่กำหนด (ไม่เกิน 30 นาที ตอบคำถามไม่เกิน 10 นาที)',
    pts: 1,
    note: '',
    explanation: 'บริหารเวลาการนำเสนอไม่เกินทีมละ 30 นาที และตอบคำถามคณะกรรมการไม่เกิน 3 คำถาม ภายในเวลาไม่เกิน 10 นาที',
    solutionType: 'text',
    steps: [
      'ช่วงที่ 1 (15-20 นาที): บรรยายภาพรวมระบบ ผังเครือข่าย โครงสร้างฐานข้อมูล และสาธิตการทำงานจริงของเว็บและ CI/CD Pipeline',
      'ช่วงที่ 2 (5-10 นาที): ตอบคำถามจากคณะกรรมการ 3 ข้ออย่างกระชับ ตรงประเด็น และสรุปจบการนำเสนอตรงตามเวลา'
    ]
  }
];
