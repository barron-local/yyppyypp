// ==============================================================================
// DESIGN SOLUTIONS DATA: 4.1 Flowcharts, 4.2 DB & Class Diagram, 4.3 Wireframes, 4.4 API Spec
// ==============================================================================

export const designSolutions = {
  // 4.1 Flowcharts & Use Case Diagram
  flowcharts: [
    {
      id: "login-flow",
      title: "1. ผังงานระบบการเข้าสู่ระบบ (Login Flow)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.1.1)",
      desc: "แสดงกระบวนการรับข้อมูล ตรวจสอบความถูกต้อง ส่งต่อไปยัง Backend ออก JWT Token และนำทางตามสิทธิ์",
      mermaid: `flowchart TD
    Start([เริ่มต้น]) --> Input[ผู้ใช้กรอก Username และ Password]
    Input --> Validate{ข้อมูลครบถ้วน?}
    Validate -- ไม่ครบ --> ShowErr1[แจ้งเตือน: กรุณากรอกข้อมูลให้ครบถ้วน] --> Input
    Validate -- ครบถ้วน --> SendReq[ส่ง POST /api/auth/login]
    SendReq --> CheckUser{พบชื่อผู้ใช้ในระบบ?}
    CheckUser -- ไม่พบ (401) --> ShowErr2[แจ้งเตือน: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง] --> Input
    CheckUser -- พบ --> CheckPass{ตรวจสอบรหัสผ่าน bcrypt}
    CheckPass -- ไม่ถูกต้อง (401) --> ShowErr2
    CheckPass -- ถูกต้อง (200) --> GenJWT[สร้าง Signed JWT Token ระบุ Role]
    GenJWT --> SaveStorage[Frontend บันทึก Token ลงใน LocalStorage]
    SaveStorage --> CheckRole{ตรวจสอบ Role}
    CheckRole -- admin --> GoAdmin[เปิดหน้า Admin Management]
    CheckRole -- user1 --> GoOfficer[เปิดหน้า Officer Dashboard]
    CheckRole -- user2 --> GoMember[เปิดหน้า Member Catalog]
    GoAdmin --> End([สิ้นสุด])
    GoOfficer --> End
    GoMember --> End`
    },
    {
      id: "admin-flow",
      title: "2. ผังงานกระบวนการของผู้ดูแลระบบ (Admin Process)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.1.2)",
      desc: "แสดงการจัดการระบบแบบเต็มรูปแบบ: ดูภาพรวมสถิติ, จัดการสิทธิ์ผู้ใช้, จัดการหมวดหมู่, และลบข้อมูลพร้อมยืนยัน",
      mermaid: `flowchart TD
    StartAdmin([เริ่มต้น Admin Dashboard]) --> ViewSummary[แสดงภาพรวมสถิติผู้ใช้ และรายการอุปกรณ์ทั้งหมด]
    ViewSummary --> SelectAction{เลือกการทำงาน}
    
    SelectAction -- จัดการผู้ใช้งาน --> ManageUsers[เปิดหน้า User Management]
    ManageUsers --> UserAction{เลือกคำสั่ง}
    UserAction -- เพิ่มผู้ใช้ --> AddUser[กรอกฟอร์ม + กำหนด Role + Submit] --> SaveUser[บันทึกเข้า DB]
    UserAction -- แก้ไข Role --> EditUser[เปลี่ยนสิทธิ์ผู้ใช้ + Submit] --> SaveUser
    UserAction -- ลบผู้ใช้ --> DelConfirm[แสดง Modal ยืนยันการลบ] --> ConfirmDel{ยืนยัน?}
    ConfirmDel -- ยืนยัน --> DoDel[ส่ง DELETE /api/users/:id] --> SaveUser
    ConfirmDel -- ยกเลิก --> ManageUsers
    
    SelectAction -- จัดการหมวดหมู่ --> ManageCat[เพิ่ม / แก้ไข / ลบ หมวดหมู่ Categories]
    SelectAction -- ตรวจสอบประวัติ --> ViewLogs[ดู System Logs & Audit Trail]
    
    SaveUser --> EndAdmin([สิ้นสุดการทำงาน])
    ManageCat --> EndAdmin
    ViewLogs --> EndAdmin`
    },
    {
      id: "user1-flow",
      title: "3. ผังงานกระบวนการของผู้ใช้งานระดับ 1 (Officer Process)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.1.3)",
      desc: "แสดงการทำงานของเจ้าหน้าที่: ค้นหา, แบ่งหน้า, เพิ่มรายการพร้อมแนบไฟล์, แก้ไขข้อมูลและไฟล์ (ไม่มีสิทธิ์ลบ)",
      mermaid: `flowchart TD
    StartOfficer([เริ่มต้น Officer Panel]) --> ViewItems[แสดงตารางรายการข้อมูลและอุปกรณ์]
    ViewItems --> OfficerChoice{เลือกการทำงาน}
    
    OfficerChoice -- ค้นหา/กรองข้อมูล --> SearchData[กรอกคำค้นหา / เลือกหมวดหมู่] --> FilterList[แสดงผลลัพธ์แบบแบ่งหน้า Pagination]
    
    OfficerChoice -- เพิ่มข้อมูลใหม่ --> OpenForm[เปิดฟอร์มเพิ่มข้อมูล]
    OpenForm --> InputData[กรอกรหัส, ชื่อ, หมวดหมู่, มูลค่า]
    InputData --> AttachFile[เลือกไฟล์แนบเอกสารหรือรูปภาพ]
    AttachFile --> ValidateForm{ตรวจสอบความถูกต้องฟอร์ม?}
    ValidateForm -- ไม่ผ่าน --> ShowFormErr[แจ้งเตือนจุดที่กรอกผิด] --> InputData
    ValidateForm -- ผ่าน --> SubmitForm[ส่ง POST /api/items พร้อม Multipart File]
    SubmitForm --> ServerSave[Backend ตรวจสอบ Token + บันทึกไฟล์ + Insert DB]
    ServerSave --> NotifySuccess[แจ้งเตือน 'บันทึกข้อมูลสำเร็จ'] --> RefreshTable[รีเฟรชตารางข้อมูล]
    
    OfficerChoice -- แก้ไขข้อมูล/ไฟล์ --> EditItem[เลือกแก้ไขรายการ] --> ChangeFile{เปลี่ยนไฟล์แนบ?}
    ChangeFile -- ใช่ --> UploadNew[เลือกไฟล์ใหม่แทนที่ไฟล์เดิม] --> UpdateData[ส่ง PUT /api/items/:id]
    ChangeFile -- ไม่ใช่ --> UpdateData
    UpdateData --> NotifySuccess
    
    RefreshTable --> EndOfficer([สิ้นสุด])
    FilterList --> EndOfficer`
    },
    {
      id: "user2-flow",
      title: "4. ผังงานกระบวนการของผู้ใช้งานระดับ 2 (Member Process)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.1.4)",
      desc: "แสดงการทำงานของผู้ใช้ทั่วไปแบบ Read-Only: ค้นหาข้อมูล, กรองหมวดหมู่, และดาวน์โหลดไฟล์แนบ (ปุ่มเพิ่ม/แก้/ลบถูกซ่อน)",
      mermaid: `flowchart TD
    StartMember([เริ่มต้น Member Portal]) --> ViewPublic[แสดงรายการข้อมูลและอุปกรณ์ที่ได้รับอนุญาต]
    ViewPublic --> ActionMember{เลือกการกระทำ}
    
    ActionMember -- ค้นหาข้อมูล --> SearchItem[ค้นหาตามรหัส หรือชื่อรายการ]
    SearchItem --> ClickDetail[กดดูรายละเอียดข้อมูลใน Popup]
    ClickDetail --> CheckAttach{มีไฟล์แนบหรือไม่?}
    CheckAttach -- มีไฟล์แนบ --> DownloadFile[คลิกเปิดดูหรือดาวน์โหลดไฟล์แนบ]
    CheckAttach -- ไม่มีไฟล์แนบ --> CloseDetail[ปิดหน้าต่าง]
    
    ActionMember -- กรองหมวดหมู่ --> FilterCategory[เลือกหมวดหมู่ที่ต้องการสืบค้น]
    FilterCategory --> ClickDetail
    
    DownloadFile --> EndMember([สิ้นสุด])
    CloseDetail --> EndMember`
    },
    {
      id: "usecase-diagram",
      title: "5. ผังงานภาพรวมของระบบทั้งหมด (Use Case Diagram)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.1.5)",
      desc: "แสดงความสัมพันธ์ระหว่าง 3 Actors (Admin, User Level 1, User Level 2) กับ Use Cases ของระบบทั้งหมด",
      mermaid: `flowchart LR
    subgraph Users ["กลุ่มผู้ใช้งาน (Actors)"]
        Admin(("ผู้ดูแลระบบ<br/>(Admin)"))
        Officer(("ผู้ใช้งานระดับ 1<br/>(Officer)"))
        Member(("ผู้ใช้งานระดับ 2<br/>(Member)"))
    end

    subgraph System ["ระบบเทคโนโลยีสารสนเทศและการจัดการ (DevOps Application)"]
        UC1(["1. เข้าสู่ระบบด้วย JWT (Login)"])
        UC2(["2. ดูภาพรวมระบบ (Dashboard & KPIs)"])
        UC3(["3. จัดการผู้ใช้งานและสิทธิ์ (User Mgmt)"])
        UC4(["4. จัดการหมวดหมู่ข้อมูล (Category Mgmt)"])
        UC5(["5. ดูรายการและค้นหา (Search, Filter, Pagination)"])
        UC6(["6. เพิ่มรายการพร้อมแนบไฟล์ (Create with File)"])
        UC7(["7. แก้ไขข้อมูลและไฟล์แนบ (Update with File)"])
        UC8(["8. ลบข้อมูลถาวรพร้อม Modal ยืนยัน (Delete)"])
        UC9(["9. ดาวน์โหลดไฟล์แนบ (Download Attachment)"])
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9

    Officer --> UC1
    Officer --> UC2
    Officer --> UC5
    Officer --> UC6
    Officer --> UC7
    Officer --> UC9

    Member --> UC1
    Member --> UC2
    Member --> UC5
    Member --> UC9`
    }
  ],

  // 4.2 Database Relational Design & Class Diagram
  databaseDesign: {
    tables: [
      {
        name: "users",
        desc: "ตารางผู้ใช้งานและระดับสิทธิ์การเข้าถึงระบบ",
        columns: [
          { name: "id", type: "INT", key: "PK", desc: "Auto Increment รหัสผู้ใช้" },
          { name: "username", type: "VARCHAR(50)", key: "UQ", desc: "ชื่อผู้ใช้ เช่น admin, officer1" },
          { name: "password_hash", type: "VARCHAR(255)", key: "", desc: "รหัสผ่านที่เข้ารหัสด้วย bcrypt" },
          { name: "full_name", type: "VARCHAR(100)", key: "", desc: "ชื่อ-นามสกุลจริง" },
          { name: "role", type: "ENUM('admin','user1','user2')", key: "", desc: "ระดับสิทธิ์ของผู้ใช้" },
          { name: "created_at", type: "DATETIME", key: "", desc: "วันที่และเวลาที่สร้างบัญชี" }
        ]
      },
      {
        name: "categories",
        desc: "ตารางหมวดหมู่อุปกรณ์และทรัพยากรระบบ",
        columns: [
          { name: "id", type: "INT", key: "PK", desc: "Auto Increment รหัสหมวดหมู่" },
          { name: "code", type: "VARCHAR(20)", key: "UQ", desc: "รหัสย่อหมวดหมู่ เช่น NET, SRV, IOT" },
          { name: "name", type: "VARCHAR(100)", key: "", desc: "ชื่อเต็มหมวดหมู่" },
          { name: "description", type: "TEXT", key: "", desc: "คำอธิบายหมวดหมู่" }
        ]
      },
      {
        name: "items",
        desc: "ตารางรายการข้อมูล อุปกรณ์ และไฟล์แนบ (Relational Table)",
        columns: [
          { name: "id", type: "INT", key: "PK", desc: "Auto Increment รหัสรายการ" },
          { name: "item_code", type: "VARCHAR(50)", key: "UQ", desc: "รหัสอุปกรณ์ เช่น NET-001" },
          { name: "title", type: "VARCHAR(200)", key: "", desc: "ชื่อรายการอุปกรณ์" },
          { name: "category_id", type: "INT", key: "FK", desc: "เชื่อมโยงกับ categories.id (1:N)" },
          { name: "value_amount", type: "DECIMAL(12,2)", key: "", desc: "มูลค่าราคา (บาท)" },
          { name: "description", type: "TEXT", key: "", desc: "รายละเอียดหรือสถานที่จัดเก็บ" },
          { name: "attachment_name", type: "VARCHAR(255)", key: "", desc: "ชื่อไฟล์ต้นฉบับที่อัปโหลด" },
          { name: "attachment_path", type: "VARCHAR(255)", key: "", desc: "Path เก็บไฟล์ใน /uploads" },
          { name: "created_by", type: "INT", key: "FK", desc: "เชื่อมโยงกับ users.id (1:N)" },
          { name: "created_at", type: "DATETIME", key: "", desc: "เวลาที่สร้างรายการ" },
          { name: "updated_at", type: "DATETIME", key: "", desc: "เวลาที่แก้ไขล่าสุด" }
        ]
      }
    ],
    classDiagram: `classDiagram
    class User {
        +int id
        +string username
        +string password_hash
        +string full_name
        +string role
        +datetime created_at
        +login(username, password) bool
        +generateJWT() string
    }

    class Category {
        +int id
        +string code
        +string name
        +string description
        +getItems() List~Item~
    }

    class Item {
        +int id
        +string item_code
        +string title
        +int category_id
        +decimal value_amount
        +string description
        +string attachment_name
        +string attachment_path
        +int created_by
        +createWithFile(data, file) bool
        +updateWithFile(id, data, file) bool
        +deleteItem(id) bool
    }

    User "1" --> "*" Item : "creates (สร้างรายการ)"
    Category "1" --> "*" Item : "contains (สังกัดหมวดหมู่)"`
  },

  // 4.3 Template Layouts (Draw.io Mockups)
  uiTemplates: [
    {
      id: "tpl-login",
      title: "1. Template หน้าจอเข้าสู่ระบบ (Login Screen)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.3.5)",
      elements: [
        "Card กล่องกึ่งกลางหน้าจอ (Center Card)",
        "หัวข้อระบบ: 'IT DevOps Management System'",
        "ช่องกรอก Username (Icon ผู้ใช้)",
        "ช่องกรอก Password (Icon แม่กุญแจ)",
        "ปุ่มกด 'เข้าสู่ระบบ (Sign In)'",
        "กล่องแจ้งเตือน Error Alert สีแดงเมื่อกรอกรหัสผิด"
      ]
    },
    {
      id: "tpl-overview",
      title: "2. Template หน้าจอหลักของระบบ (Dashboard / Overview)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.3.4)",
      elements: [
        "Top Navigation Bar แสดงโลโก้, ชื่อระบบ และ Profile ผู้ใช้พร้อม Role",
        "Sidebar เมนู: Dashboard, Inventory, Categories, Users, Logout",
        "4 กล่องสถิติ KPI: Total Items, Active Items, Categories, Total Value",
        "กราฟสถิติภาพรวมอุปกรณ์ และตารางสรุปกิจกรรมล่าสุด"
      ]
    },
    {
      id: "tpl-admin",
      title: "3. Template หน้าจอผู้ดูแลระบบ (Admin Screen)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.3.1)",
      elements: [
        "ปุ่มควบคุม Admin: '+ เพิ่มผู้ใช้ใหม่' และ 'สำรองฐานข้อมูล'",
        "ตารางจัดการผู้ใช้: ID, Username, ชื่อ, สิทธิ์ (Role), สถานะ",
        "คอลัมน์การจัดการ: ปุ่ม '[แก้ไขสิทธิ์]' และปุ่ม '[ลบผู้ใช้]'",
        "Modal ยืนยันการลบข้อมูล (Delete Confirmation Modal)"
      ]
    },
    {
      id: "tpl-user1",
      title: "4. Template หน้าจอผู้ใช้งานระดับ 1 (Officer Screen)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.3.2)",
      elements: [
        "Search Toolbar: ช่องค้นหาแบบ Real-time และ Dropdown กรองหมวดหมู่",
        "ปุ่มเด่น: '+ เพิ่มรายการใหม่ (Add New Item)'",
        "ตารางรายการอุปกรณ์: รหัส, ชื่อ, หมวดหมู่, ราคา, ลิงก์ไฟล์แนบ",
        "คอลัมน์จัดการ: ปุ่ม '[แก้ไข]' แต่ไม่มีปุ่มลบ",
        "แถบแบ่งหน้า Pagination: 'หน้า 1 จาก 3' พร้อมปุ่มย้อนกลับ/ถัดไป"
      ]
    },
    {
      id: "tpl-user2",
      title: "5. Template หน้าจอผู้ใช้งานระดับ 2 (Member Screen)",
      points: "1 คะแนน (เกณฑ์ข้อ 4.3.3)",
      elements: [
        "หน้าจอแบบ Read-Only Catalog สำหรับสืบค้นข้อมูลเท่านั้น",
        "ช่องค้นหาชื่อและรหัสอุปกรณ์",
        "ตารางแสดงรายการข้อมูล พร้อมลิงก์ดาวน์โหลดไฟล์แนบ",
        "ไม่มีปุ่มเพิ่ม, ไม่มีปุ่มแก้ไข, และไม่มีปุ่มลบข้อมูล (ถูกซ่อนตามสิทธิ์)"
      ]
    }
  ],

  // 4.4 RESTful API Specification (README.md)
  apiSpec: {
    headers: "Authorization: Bearer <JWT_TOKEN>",
    responseSuccess: `{
  "status": "success",
  "message": "ดำเนินการสำเร็จ",
  "data": { ... }
}`,
    responseError: `{
  "status": "error",
  "message": "คำอธิบายข้อผิดพลาดที่เข้าใจง่าย"
}`,
    endpoints: [
      { method: "POST", path: "/api/auth/login", role: "Public", desc: "เข้าสู่ระบบและรับ Signed JWT Token", params: "Body: { username, password }", code: "200, 400, 401" },
      { method: "GET", path: "/api/auth/me", role: "All Logged In", desc: "ตรวจสอบโปรไฟล์ของตนเองจาก Token", params: "Header Token", code: "200, 401" },
      { method: "GET", path: "/api/items", role: "All Roles", desc: "ดึงรายการข้อมูลทั้งหมด รองรับค้นหาและแบ่งหน้า", params: "Query: ?search=&category_id=&page=&limit=", code: "200, 401" },
      { method: "GET", path: "/api/items/:id", role: "All Roles", desc: "ดูรายละเอียดรายการตาม ID", params: "Path: /:id", code: "200, 401, 404" },
      { method: "POST", path: "/api/items", role: "Admin, User 1", desc: "เพิ่มรายการใหม่ พร้อมอัปโหลดไฟล์แนบ", params: "Multipart Body: title, category_id, value, file", code: "201, 400, 403" },
      { method: "PUT", path: "/api/items/:id", role: "Admin, User 1", desc: "แก้ไขข้อมูลและเปลี่ยนไฟล์แนบ", params: "Path: /:id, Multipart Body: title, value, file", code: "200, 400, 403, 404" },
      { method: "DELETE", path: "/api/items/:id", role: "Admin เท่านั้น", desc: "ลบข้อมูลออกจากระบบ", params: "Path: /:id", code: "200, 403, 404" }
    ]
  }
};
