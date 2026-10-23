# 📊 คู่มือการทำ Node-RED, MQTT และ Dashboard 5 รูปแบบ
**เกณฑ์ข้อ 3.4 และ 3.5 (คะแนนเต็มรวม 7 คะแนน)**

---

## 📥 1. การทำงานของ Node-RED ในการ Sub ข้อมูลลง Database (เกณฑ์ 3.4)

โฟลว์ใน Node-RED ทำหน้าที่:
1. โหนด `mqtt in`: Subscribe topic `sensors/competition/bme280`
2. โหนด `json`: แปลง string payload ให้เป็น JavaScript Object
3. โหนด `function`: เตรียมคำสั่ง SQL INSERT
   ```javascript
   msg.topic = "INSERT INTO sensor_logs (device_id, temperature, humidity, pressure, recorded_at) VALUES (?, ?, ?, ?, NOW())";
   msg.payload = [
       msg.payload.device_id,
       msg.payload.temperature,
       msg.payload.humidity,
       msg.payload.pressure
   ];
   return msg;
   ```
4. โหนด `mysql`: บันทึกข้อมูลลงตาราง `sensor_logs` ในฐานข้อมูล MariaDB/MySQL
5. โหนด `debug`: แสดงผลข้อมูลที่บันทึกสำเร็จ

---

## 📈 2. แดชบอร์ดแสดงผล 5 รูปแบบตามเกณฑ์ (Dashboard 5 Formats)

เกณฑ์ระบุชัดเจนว่า: *"มีการแสดงผลผ่านหน้า Web Application ในรูปแบบ Dashboard ไม่น้อยกว่า 5 รูปแบบที่แตกต่างกัน (กำหนดให้แสดงรูปแบบละ 1 หน้าเว็บ หรือแท็บที่แยกชัดเจน)"*

| รูปแบบที่ | ชนิดของ Dashboard | ตัวอย่างการแสดงผล | วัตถุประสงค์ |
|:---:|---|---|---|
| **1** | **Gauge / Dial Meter** | เข็มไมล์เกจวัดอุณหภูมิ (°C) และความชื้น (%RH) มีโซนสี เขียว-เหลือง-แดง | ดูค่าปัจจุบันแบบแวบเดียวเห็นทันที |
| **2** | **Real-time Line Chart** | กราฟเส้นแสดงแนวโน้มย้อนหลัง 30 นาที อัปเดตข้อมูลทุกวินาทีแบบสดๆ | ตรวจสอบความเปลี่ยนแปลงของอุณหภูมิต่อเนื่อง |
| **3** | **KPI Stat Summary Cards** | กล่องสรุปค่าเฉลี่ย (Avg), ค่าสูงสุด (Max), ค่าต่ำสุด (Min) ของวัน | สรุปภาพรวมเชิงสถิติสำหรับผู้บริหาร |
| **4** | **Status & Alert Indicator** | ไฟสถานะ LED (เขียว = ปกติ, แดง = เกินพิกัด) + กล่องประวัติ Alert Logs | แจ้งเตือนเมื่ออุณหภูมิเกินกำหนด (> 35°C) |
| **5** | **Historical Data Table & Export** | ตารางแสดงรายการบันทึกย้อนหลังพร้อม Timestamp และปุ่มดาวน์โหลด CSV | ตรวจสอบความถูกต้องของข้อมูลดิบใน Database |

---

## 🎛️ 3. Node-RED Flow Configuration (JSON Import)

สามารถคัดลอก JSON ด้านล่างไป Import ใน Node-RED (เมนูมุมขวาบน -> Import):

```json
[
  {
    "id": "mqtt_in_1",
    "type": "mqtt in",
    "z": "tab1",
    "name": "BME280 Sub",
    "topic": "sensors/competition/bme280",
    "qos": "0",
    "datatype": "json",
    "broker": "broker_local",
    "wires": [["temp_gauge", "hum_chart", "db_insert_func"]]
  },
  {
    "id": "temp_gauge",
    "type": "ui_gauge",
    "z": "tab1",
    "name": "Temperature Gauge",
    "group": "dashboard_group1",
    "order": 1,
    "width": 6,
    "height": 4,
    "gtype": "gage",
    "title": "อุณหภูมิปัจจุบัน (°C)",
    "label": "°C",
    "format": "{{msg.payload.temperature}}",
    "min": 0,
    "max": 50,
    "colors": ["#00B500", "#E6E600", "#CA3838"],
    "seg1": "25",
    "seg2": "35"
  }
]
```
