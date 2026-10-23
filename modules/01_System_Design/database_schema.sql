-- ==============================================================================
-- DATABASE SCHEMA: IT DEVOPS COMPETITION (รายการที่ 58)
-- สอดคล้องเกณฑ์ข้อ 4.2: มีอย่างน้อย 3 ตาราง, มีความสัมพันธ์ Relational, Data Type เหมาะสม,
-- ตั้งชื่อตารางและฟิลด์เป็นไปตามมาตรฐานการเขียนชื่อทางเทคนิค (snake_case)
-- ==============================================================================

-- ตารางที่ 1: ตารางผู้ใช้งาน (Users Table) พร้อมจัดเก็บ Role 3 ระดับ
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user1', 'user2') NOT NULL DEFAULT 'user2',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางที่ 2: ตารางหมวดหมู่ข้อมูล (Categories Table)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางที่ 3: ตารางรายการข้อมูลหลัก / อุปกรณ์ (Items / Equipment Table)
-- มี Foreign Key เชื่อมไปยัง users (created_by) และ categories (category_id)
-- มีฟิลด์ attachment_url สำหรับรองรับระบบแนบไฟล์ตามเกณฑ์
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    created_by INT NOT NULL,
    item_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    value_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('active', 'pending', 'archived') NOT NULL DEFAULT 'active',
    attachment_name VARCHAR(255) NULL,
    attachment_path VARCHAR(255) NULL,
    attachment_mimetype VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_item_creator FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_item_category (category_id),
    INDEX idx_item_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- ข้อมูลตั้งต้นสำหรับการทดสอบ (Initial Seed Data)
-- รหัสผ่าน default ทุกตัวคือ: Password123! (hash ด้วย bcrypt)
-- ==============================================================================

-- รหัสผ่าน hash สำหรับ 'Password123!'
-- $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi หรือใช้ bcryptjs
INSERT INTO users (id, username, password_hash, full_name, email, role) VALUES
(1, 'admin', '$2b$10$qV0tO2z41dEkm.d781P.Te9F0E1gY9pE4Jg0oDkK1T4mG5O0j1y6e', 'System Administrator', 'admin@competition.lab', 'admin'),
(2, 'officer1', '$2b$10$qV0tO2z41dEkm.d781P.Te9F0E1gY9pE4Jg0oDkK1T4mG5O0j1y6e', 'IT Officer (User Level 1)', 'officer@competition.lab', 'user1'),
(3, 'member1', '$2b$10$qV0tO2z41dEkm.d781P.Te9F0E1gY9pE4Jg0oDkK1T4mG5O0j1y6e', 'Standard Member (User Level 2)', 'member@competition.lab', 'user2')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO categories (id, code, name, description) VALUES
(1, 'NET', 'Network Equipment', 'อุปกรณ์เครือข่าย เราเตอร์ สวิตช์ และสายสัญญาณ'),
(2, 'SRV', 'Server & Storage', 'เครื่องแม่ข่าย ฮาร์ดดิสก์ และระบบสำรองข้อมูล'),
(3, 'IOT', 'IoT Devices & Sensors', 'บอร์ดไมโครคอนโทรลเลอร์ ESP32 และเซนเซอร์วัดค่า')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO items (id, category_id, created_by, item_code, title, description, value_amount, status, attachment_name) VALUES
(1, 1, 1, 'NET-001', 'Cisco Catalyst 3750 L3 Switch', 'สวิตช์ L3 สำหรับทำ Inter-VLAN และ DHCP Snooping', 15000.00, 'active', 'manual_cisco3750.pdf'),
(2, 2, 1, 'SRV-001', 'Dell PowerEdge Proxmox VM Server', 'เซิร์ฟเวอร์แม่ข่ายติดตั้ง Ubuntu Server และ GitLab', 45000.00, 'active', 'spec_server.pdf'),
(3, 3, 2, 'IOT-001', 'ESP32 NodeMCU + BME280', 'ชุดเซนเซอร์วัดอุณหภูมิและความชื้นเชื่อมต่อ MQTT', 650.00, 'active', 'circuit_diagram.png')
ON DUPLICATE KEY UPDATE id=id;
