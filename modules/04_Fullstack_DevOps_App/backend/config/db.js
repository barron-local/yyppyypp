// ==============================================================================
// DATABASE LAYER: config/db.js
// รองรับทั้ง Local Persistent File DB (สำหรับทดสอบทันทีโดยไม่ต้องลง DB server)
// และ MySQL/MariaDB สำหรับวันแข่งขันจริง
// ==============================================================================

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'competition_data.json');

// ข้อมูลเริ่มต้นสำหรับระบบ (Seed Data)
const initialData = {
  users: [
    {
      id: 1,
      username: "admin",
      // Password: Password123!
      password_hash: "$2a$10$X8aW4qDq6R5i44dO5n7YvODR26jR1N1TqK9hXb0O9aEfZzE7E7X7m",
      full_name: "System Administrator",
      email: "admin@competition.lab",
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      username: "officer1",
      password_hash: "$2a$10$X8aW4qDq6R5i44dO5n7YvODR26jR1N1TqK9hXb0O9aEfZzE7E7X7m",
      full_name: "IT Officer (Level 1)",
      email: "officer1@competition.lab",
      role: "user1",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      username: "member1",
      password_hash: "$2a$10$X8aW4qDq6R5i44dO5n7YvODR26jR1N1TqK9hXb0O9aEfZzE7E7X7m",
      full_name: "Standard Member (Level 2)",
      email: "member1@competition.lab",
      role: "user2",
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  categories: [
    { id: 1, code: "NET", name: "Network Equipment", description: "เราเตอร์ สวิตช์ และอุปกรณ์เครือข่าย" },
    { id: 2, code: "SRV", name: "Server & Infrastructure", description: "เครื่องแม่ข่าย และระบบ Cloud" },
    { id: 3, code: "IOT", name: "IoT Devices & Sensors", description: "บอร์ด ESP32 และเซนเซอร์วัดค่า" }
  ],
  items: [
    {
      id: 1,
      category_id: 1,
      created_by: 1,
      item_code: "NET-001",
      title: "Cisco Catalyst 3750 L3 Switch",
      description: "สวิตช์ L3 สำหรับจัดการ VLAN และ Routing ในการแข่งขัน",
      value_amount: 15000.00,
      status: "active",
      attachment_name: "cisco_manual.pdf",
      attachment_path: "/uploads/cisco_manual.pdf",
      attachment_mimetype: "application/pdf",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      category_id: 2,
      created_by: 1,
      item_code: "SRV-001",
      title: "Dell PowerEdge R740 VM Server",
      description: "เซิร์ฟเวอร์แม่ข่าย Proxmox สำหรับติดตั้ง GitLab และ Production",
      value_amount: 55000.00,
      status: "active",
      attachment_name: "server_spec.pdf",
      attachment_path: "/uploads/server_spec.pdf",
      attachment_mimetype: "application/pdf",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      category_id: 3,
      created_by: 2,
      item_code: "IOT-001",
      title: "ESP32 NodeMCU + BME280 Kit",
      description: "ชุดเซนเซอร์วัดอุณหภูมิและความชื้น เชื่อมต่อ MQTT Broker",
      value_amount: 650.00,
      status: "active",
      attachment_name: "circuit_diagram.png",
      attachment_path: "/uploads/circuit_diagram.png",
      attachment_mimetype: "image/png",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// ตรวจสอบและสร้างฐานข้อมูลเริ่มต้น
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Generate valid bcrypt hash for "Password123!"
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("Password123!", salt);
    initialData.users.forEach(u => u.password_hash = hash);
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log("📁 [DB] Initialized database with seed data at:", DB_FILE);
  }
}

function readDb() {
  initDb();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readDb,
  writeDb,
  initDb
};
