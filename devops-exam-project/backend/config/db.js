const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'data.json');

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const initialData = {
      users: [
        {
          id: 1,
          username: 'admin',
          password_hash: bcrypt.hashSync('Password123!', salt),
          full_name: 'ผู้ดูแลระบบ (Admin)',
          role: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          username: 'officer1',
          password_hash: bcrypt.hashSync('Password123!', salt),
          full_name: 'เจ้าหน้าที่บันทึกข้อมูล (Officer)',
          role: 'user1',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          username: 'user2',
          password_hash: bcrypt.hashSync('Password123!', salt),
          full_name: 'สมาชิกทั่วไป (Member)',
          role: 'user2',
          created_at: new Date().toISOString()
        }
      ],
      categories: [
        { id: 1, code: 'NET', name: 'อุปกรณ์เครือข่าย (Network)' },
        { id: 2, code: 'SRV', name: 'เครื่องแม่ข่าย (Server & Storage)' },
        { id: 3, code: 'IOT', name: 'อุปกรณ์ไอโอที (IoT & Sensor)' }
      ],
      items: [
        {
          id: 1,
          item_code: 'NET-001',
          category_id: 1,
          title: 'Cisco Catalyst 3850 Switch Layer 3',
          description: 'Gigabit Switch 24 Ports PoE สำหรับตั้งค่า VLAN 10, 20, 30 และ Inter-VLAN Routing',
          value_amount: 45000.00,
          attachment_path: null,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          item_code: 'SRV-001',
          category_id: 2,
          title: 'Dell PowerEdge R640 Server',
          description: 'โฮสต์สำหรับรัน Proxmox Virtualization, GitLab VM และ Production Docker',
          value_amount: 125000.00,
          attachment_path: null,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          item_code: 'IOT-001',
          category_id: 3,
          title: 'ESP32 IoT Node + BME280 Sensor',
          description: 'ไมโครคอนโทรลเลอร์ส่งค่า Sensor อุณหภูมิ/ความชื้นไปยัง MQTT Broker',
          value_amount: 450.00,
          attachment_path: null,
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('[OK] Database initialised (data.json)');
  }
}

function readDb() {
  if (!fs.existsSync(DB_FILE)) initDb();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { initDb, readDb, writeDb };
