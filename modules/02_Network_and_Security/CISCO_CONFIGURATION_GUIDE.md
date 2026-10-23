# 🌐 คู่มือการตั้งค่าเครือข่าย Cisco Switch L3 & Router (ฉบับเต็ม 13 คะแนน)
**เกณฑ์ข้อ 3.5.1: Network ตั้งค่าพร้อมทั้งทดสอบอุปกรณ์เครือข่าย**

คู่มือนี้สรุปชุดคำสั่ง CLI มาตรฐานสำหรับ **Cisco Layer 3 Switch (เช่น Catalyst 3560/3750/3850)** และ **Cisco Router** ที่ใช้ในการแข่งขันจริง

---

## 🗺️ 1. แผนผังการจัดสรร IP Address (IP Addressing Scheme)

| VLAN ID | ชื่อ VLAN (ห้ามใช้ VLAN 1) | วง Network (Subnet) | Default Gateway (IP SVI) | คำอธิบาย |
|:---:|:---|:---|:---|:---|
| **10** | `server` | `192.168.10.0/24` | `192.168.10.1` | วงเซิร์ฟเวอร์ (VM, GitLab, DNS, Production) |
| **20** | `dev` | `192.168.20.0/24` | `192.168.20.1` | วงพัฒนาโปรแกรม (เครื่องคอมพิวเตอร์ผู้เข้าแข่งขัน) |
| **30** | `guest` | `192.168.30.0/24` | `192.168.30.1` | วงผู้ใช้งานทั่วไป / กรรมการทดสอบ |
| **99** | `mgmt` | `192.168.99.0/24` | `192.168.99.1` | Management VLAN สำหรับรีโมตจัดการอุปกรณ์ |

---

## ⚙️ 2. คำสั่งตั้งค่าบน Cisco Layer 3 Switch (Switch L3)

### 2.1 สร้าง VLAN (เกณฑ์ 1.1: มี server, dev, guest และไม่ใช่ Default VLAN)
```cisco
enable
configure terminal

vlan 10
 name server
exit

vlan 20
 name dev
exit

vlan 30
 name guest
exit

vlan 99
 name mgmt
exit
```

### 2.2 ตั้งค่า Inter-VLAN Routing (SVI) (เกณฑ์ 1.2: มี IP ครบทั้ง 3 วง และ Route ได้)
```cisco
ip routing

interface vlan 10
 description Gateway for Server VLAN
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit

interface vlan 20
 description Gateway for Dev VLAN
 ip address 192.168.20.1 255.255.255.0
 no shutdown
exit

interface vlan 30
 description Gateway for Guest VLAN
 ip address 192.168.30.1 255.255.255.0
 no shutdown
exit

interface vlan 99
 description Management Interface
 ip address 192.168.99.1 255.255.255.0
 no shutdown
exit
```

### 2.3 ตั้งค่า DHCP Server เครื่องเดียวแจก 3 วง (เกณฑ์ 1.3)
*(สามารถตั้งบน L3 Switch หรือบน Linux VM Server แล้วใช้ `ip helper-address 192.168.10.10` ก็ได้)*
**กรณีตั้งบน Switch L3 โดยตรง (ทำง่ายและเร็วที่สุดในห้องสอบ):**
```cisco
! Exclude IP ที่ใช้เป็น Gateway และ Server ที่ตั้งแบบ Static
ip dhcp excluded-address 192.168.10.1 192.168.10.50
ip dhcp excluded-address 192.168.20.1 192.168.20.20
ip dhcp excluded-address 192.168.30.1 192.168.30.20

! Pool สำหรับ VLAN Server
ip dhcp pool POOL_SERVER
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.10
 domain-name competition.lab
exit

! Pool สำหรับ VLAN Dev
ip dhcp pool POOL_DEV
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.10.10
 domain-name competition.lab
exit

! Pool สำหรับ VLAN Guest
ip dhcp pool POOL_GUEST
 network 192.168.30.0 255.255.255.0
 default-router 192.168.30.1
 dns-server 192.168.10.10
 domain-name competition.lab
exit
```

### 2.4 ตั้งค่า DHCP Snooping ป้องกัน Rogue DHCP (เกณฑ์ 1.3: ยอมรับเฉพาะ Port ที่กำหนด)
```cisco
! เปิดระบบ DHCP Snooping ทั่วโลกและเจาะจง VLAN
ip dhcp snooping
ip dhcp snooping vlan 10,20,30
no ip dhcp snooping information option

! กำหนด Port ที่เชื่อมต่อไปยัง DHCP Server หรือ Uplink ให้เป็น Trusted Port
interface FastEthernet 0/1
 description Trusted DHCP Server Port / Uplink
 ip dhcp snooping trust
exit

! สำหรับ Port ปลายทางของลูกข่าย เป็น Untrusted โดยอัตโนมัติ พร้อมจำกัด Rate
interface range FastEthernet 0/2 - 24
 ip dhcp snooping limit rate 15
exit
```

### 2.5 ป้องกัน Loop บน Switch (เกณฑ์ 1.5: Loop Protection & Spanning-Tree)
```cisco
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default

interface range FastEthernet 0/2 - 24
 spanning-tree portfast
 spanning-tree bpduguard enable
exit
```

---

## 🛡️ 3. การทำ ACL ควบคุมความปลอดภัย (Access Control Lists) (เกณฑ์ 1.5)

### 3.1 Standard ACL (ควบคุมต้นทาง)
```cisco
! ตัวอย่าง: อนุญาตเฉพาะเครื่อง Dev (192.168.20.0/24) เข้าถึงวง Management
access-list 10 permit 192.168.20.0 0.0.0.255
access-list 10 deny any
```

### 3.2 Extended ACL (อนุญาตเฉพาะ Service ที่กำหนด & ป้องกันการเข้าถึง Server)
```cisco
! ป้องกัน Guest (VLAN 30) ไม่ให้เข้าถึง Server (VLAN 10) ยกเว้น Web (พอร์ต 80, 443)
ip access-list extended ACL_GUEST_RESTRICTION
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 80
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 443
 permit udp 192.168.30.0 0.0.0.255 host 192.168.10.10 eq 53
 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip 192.168.30.0 0.0.0.255 any
exit

! นำไปผูกกับ Interface VLAN 30 ขา Inbound
interface vlan 30
 ip access-group ACL_GUEST_RESTRICTION in
exit
```

### 3.3 ACL สำหรับ Management VLAN
```cisco
! อนุญาตเฉพาะ Admin IP (192.168.20.50) เท่านั้นที่ SSH/Telnet เข้าจัดการ Switch ได้
ip access-list standard ACL_ADMIN_TELNET
 permit host 192.168.20.50
 deny any
exit

line vty 0 4
 transport input ssh
 access-class ACL_ADMIN_TELNET in
exit
```

---

## 🌍 4. การตั้งค่า NAT บน Router (เกณฑ์ 1.4: ติดต่อเครื่องกรรมการและออกเครือข่าย)

```cisco
! บน Router ตัวหลักที่ต่อกับ Gateway กลางของกรรมการ (เช่น Fa0/0 ต่อ Switch ภายใน, Fa0/1 ต่อนอก)
interface GigabitEthernet 0/0
 description Inside Network (To L3 Switch)
 ip address 10.0.0.1 255.255.255.252
 ip nat inside
 no shutdown
exit

interface GigabitEthernet 0/1
 description Outside Network (To Central Judges Network)
 ip address 172.16.1.100 255.255.255.0
 ip nat outside
 no shutdown
exit

! Default Route ออกไปหากรรมการ
ip route 0.0.0.0 0.0.0.0 172.16.1.1

! กำหนดสิทธิ์ให้ทุกวงภายในสามารถ NAT ออกไปได้
access-list 1 permit 192.168.10.0 0.0.0.255
access-list 1 permit 192.168.20.0 0.0.0.255
access-list 1 permit 192.168.30.0 0.0.0.255

! ทำ NAT Overload (PAT)
ip nat inside source list 1 interface GigabitEthernet 0/1 overload
```

---

## 🔍 5. คำสั่งตรวจสอบผลการตั้งค่าสำหรับตรวจรับคะแนน (Verification Commands)

```cisco
show vlan brief
show ip interface brief
show ip route
show ip dhcp binding
show ip dhcp snooping
show ip dhcp snooping binding
show ip access-lists
show ip nat translations
show spanning-tree
```
