# 🌐 การติดตั้งและตั้งค่า Technitium DNS Server บน Docker + ACL
**เกณฑ์ข้อ 2.2: DNS Server ใน Network ของตนเอง และกำหนด ACL การเข้าถึง (คะแนนเต็ม 2 คะแนน)**

> ⚠️ **คำเตือนจากเกณฑ์คะแนน:** หากตั้งค่า DNS บน Router หรือ Switch หรือแก้ไขไฟล์ `hosts` **จะไม่ได้คะแนน 0 คะแนนทันที** ต้องรันบน Docker หรือ Linux Server เท่านั้น!

---

## 🐳 1. คำสั่งรัน Technitium DNS ผ่าน Docker

รันคำสั่งนี้บนเครื่อง Linux VM Server (`192.168.10.10`):

```bash
docker run -d \
  --name technitium-dns \
  --restart always \
  -p 53:53/udp \
  -p 53:53/tcp \
  -p 5380:5380/tcp \
  -e DNS_SERVER_ADMIN_PASSWORD=AdminPassword123! \
  -v technitium_data:/etc/dns \
  technitium/dns-server:latest
```

*หมายเหตุ: พอร์ต 5380 คือหน้า Web GUI สำหรับตั้งค่า และพอร์ต 53 คือพอร์ตตอบรับ DNS Request*

---

## 🖥️ 2. ขั้นตอนการตั้งค่าผ่าน Web GUI (http://192.168.10.10:5380)

1. เข้าเบราว์เซอร์ไปที่: `http://192.168.10.10:5380`
2. เข้าสู่ระบบด้วย:
   - **User:** `admin`
   - **Password:** `AdminPassword123!` (หรือที่กำหนดไว้)

### 2.1 สร้าง Primary Zone (โดเมนภายใน)
1. ไปที่แท็บ **Zones** -> กดปุ่ม **Add Zone**
2. เลือก **Type:** `Primary Zone`
3. ใส่ **Zone Name:** `competition.lab` (หรือตามที่กรรมการระบุ เช่น `mydomain.lab`)
4. กด **Add**

### 2.2 เพิ่ม DNS Records (A Record ชี้ไปยัง Reverse Proxy 192.168.10.10)
ใน Zone ที่สร้างขึ้น ให้กดปุ่ม **Add Record** เพิ่มรายการดังนี้:

| Name (Host) | Type | IP Address | วัตถุประสงค์ |
|---|:---:|:---:|---|
| `@` (root) | `A` | `192.168.10.10` | โดเมนหลัก `competition.lab` |
| `gitlab` | `A` | `192.168.10.10` | สำหรับเข้า GitLab Server (`gitlab.competition.lab`) |
| `registry` | `A` | `192.168.10.10` | สำหรับ Docker Private Registry (`registry.competition.lab`) |
| `app` | `A` | `192.168.10.10` | สำหรับหน้า Frontend Web App (`app.competition.lab`) |
| `api` | `A` | `192.168.10.10` | สำหรับหน้า Backend API (`api.competition.lab`) |
| `npm` | `A` | `192.168.10.10` | สำหรับหน้า Nginx Proxy Manager GUI |

---

## 🛡️ 3. การกำหนด ACL ป้องกันการเข้าถึง DNS (เกณฑ์ข้อ 2.2: กำหนดการเข้าถึงโดยใช้ IP ที่กำหนดเท่านั้น)

1. ไปที่แท็บ **Settings** -> เลือกหัวข้อ **Allowed Networks / Access Control**
2. ในส่วน **Client Query Restriction**:
   - เลือกเป็น **Restricted (Allowlist)**
   - เพิ่ม IP Subnet ที่อนุญาตให้ใช้งาน DNS:
     - `192.168.10.0/24` (VLAN Server)
     - `192.168.20.0/24` (VLAN Dev)
     - `127.0.0.1/32` (Localhost)
   - ไม่อนุญาตวงอื่น (เช่น VLAN 30 Guest จะไม่สามารถเรียก DNS ได้ หรือตามเงื่อนไขที่โจทย์สั่ง)
3. กดปุ่ม **Save Settings** ด้านล่างสุด

---

## 🧪 4. การทดสอบว่า DNS ใช้งานได้จริงและ ACL ทำงาน

### 4.1 ทดสอบจากเครื่องในวงที่อนุญาต (VLAN 20 Dev):
```powershell
# บน Windows PowerShell
Resolve-DnsName app.competition.lab -Server 192.168.10.10
# หรือใช้คำสั่ง nslookup
nslookup gitlab.competition.lab 192.168.10.10
```
**ผลที่ถูกต้อง:** ต้องได้คำตอบเป็น `192.168.10.10`

### 4.2 ทดสอบจากวงที่ไม่อนุญาต (VLAN 30 Guest):
```bash
nslookup app.competition.lab 192.168.10.10
```
**ผลที่ถูกต้อง:** ต้องขึ้น `Query refused` หรือ `Request timed out` (แสดงว่า ACL ทำงานถูกต้อง)
