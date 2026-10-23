# 📐 แผนผังระบบ (Flowcharts, Use Case & Class Diagram)
**เกณฑ์ข้อ 4.1 และ 4.2 (คะแนนเต็ม 5 + 5 คะแนน)**

ไฟล์นี้รวบรวม Diagram ครบตามโจทย์ สามารถนำโค้ด Mermaid ด้านล่างไป Import หรือวาดลงใน **Draw.io (Offline)** ได้ทันทีในการแข่งขัน

---

## 1. Flowchart ระบบการเข้าสู่ระบบ (Login Flow)
*เกณฑ์: จัดทำผังงานระบบการเข้าสู่ระบบ (Login Flow)*

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> Input[ผู้ใช้กรอก Username และ Password]
    Input --> Validate{ตรวจสอบรูปแบบข้อมูลครบถ้วน?}
    Validate -- ไม่ครบ --> ShowErr1[แสดงข้อความ 'กรุณากรอกข้อมูลให้ครบถ้วน'] --> Input
    Validate -- ครบถ้วน --> SendReq[ส่ง Request POST /api/auth/login]
    SendReq --> CheckUser{พบชื่อผู้ใช้ในระบบ?}
    CheckUser -- ไม่พบ --> ShowErr2[ส่ง Response 401 Unauthorized<br>'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'] --> Input
    CheckUser -- พบ --> CheckPass{ตรวจสอบความถูกต้องของรหัสผ่าน<br>bcrypt.compare}
    CheckPass -- ไม่ถูกต้อง --> ShowErr2
    CheckPass -- ถูกต้อง --> GenJWT[สร้าง JWT Token<br>บรรจุ user_id และ role]
    GenJWT --> ReturnToken[ส่ง Response 200 OK พร้อม JWT Token]
    ReturnToken --> SaveStorage[Frontend บันทึก Token ลงใน LocalStorage/Cookie]
    SaveStorage --> CheckRole{ตรวจสอบ Role ผู้ใช้งาน}
    CheckRole -- admin --> GoAdmin[นำทางไปยังหน้า Admin Management]
    CheckRole -- user1 / officer --> GoOfficer[นำทางไปยังหน้า Officer Dashboard]
    CheckRole -- user2 / member --> GoMember[นำทางไปยังหน้า Member Overview]
    GoAdmin --> End([สิ้นสุด])
    GoOfficer --> End
    GoMember --> End
```

---

## 2. Flowchart กระบวนการของผู้ดูแลระบบ (Admin Process)
*เกณฑ์: จัดทำผังงานกระบวนการของผู้ดูแลระบบ (CRUD ผู้ใช้, หมวดหมู่, อนุมัติข้อมูล, ดู Audit Log)*

```mermaid
flowchart TD
    StartAdmin([เริ่มต้น Admin Dashboard]) --> ViewSummary[แสดงสถิติภาพรวมผู้ใช้ และรายการข้อมูลทั้งหมด]
    ViewSummary --> SelectAction{เลือกการทำงาน}
    
    SelectAction -- จัดการผู้ใช้งาน --> ManageUsers[เปิดหน้า User Management]
    ManageUsers --> UserCRUD{เลือกกระทำ}
    UserCRUD -- เพิ่มผู้ใช้ --> AddUser[กรอกข้อมูลผู้ใช้ + กำหนด Role + Submit] --> SaveUser[บันทึกเข้า DB] --> RefreshUser[อัปเดตตารางผู้ใช้]
    UserCRUD -- แก้ไข Role/สถานะ --> EditUser[แก้ไขข้อมูล + Submit] --> SaveUser
    UserCRUD -- ลบผู้ใช้ --> DelConfirm[แสดง Modal ยืนยันการลบ] --> ConfirmDelUser{ยืนยัน?}
    ConfirmDelUser -- ใช่ --> DeleteUser[ส่ง DELETE /api/users/:id] --> SaveUser
    ConfirmDelUser -- ไม่ใช่ --> CancelDel[ยกเลิก]
    
    SelectAction -- จัดการหมวดหมู่/ระบบ --> ManageCategory[เพิ่ม/แก้ไข/ลบ Categories]
    
    SelectAction -- ตรวจสอบประวัติการทำงาน --> ViewAudit[ดู System Logs / Status]
    
    RefreshUser --> EndAdmin([สิ้นสุดการทำงาน])
    ManageCategory --> EndAdmin
    ViewAudit --> EndAdmin
```

---

## 3. Flowchart กระบวนการของผู้ใช้งานระดับ 1 (User Level 1 / Officer)
*เกณฑ์: จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 1 (เจ้าหน้าที่: เพิ่มรายการ, อัปโหลดไฟล์, แก้ไขข้อมูล)*

```mermaid
flowchart TD
    StartOfficer([เริ่มต้น Officer Panel]) --> ViewItems[แสดงตารางรายการข้อมูลตามสิทธิ์ Level 1]
    ViewItems --> OfficerChoice{เลือกการทำงาน}
    
    OfficerChoice -- ค้นหา/กรองข้อมูล --> SearchData[กรอก Keyword ใน Search/Filter] --> FilterList[แสดงผลลัพธ์ที่ตรงเงื่อนไขแบบแบ่งหน้า Pagination]
    
    OfficerChoice -- เพิ่มข้อมูลใหม่ --> OpenForm[เปิด Modal / หน้า Form เพิ่มข้อมูล]
    OpenForm --> InputData[กรอกฟอร์ม: ชื่อรายการ, หมวดหมู่, รายละเอียด]
    InputData --> AttachFile[เลือกไฟล์เอกสาร/รูปภาพแนบ]
    AttachFile --> ValidateForm{ตรวจสอบความถูกต้องของฟอร์ม<br>Frontend Validation}
    ValidateForm -- ไม่ผ่าน --> ShowFormErr[แจ้งเตือนจุดที่กรอกผิด] --> InputData
    ValidateForm -- ผ่าน --> SubmitForm[ส่งคำขอ POST /api/items พร้อม Multipart File]
    SubmitForm --> ServerSave[Backend ตรวจสอบ JWT + บันทึกไฟล์ + Insert DB]
    ServerSave --> NotifySuccess[แสดง Notification 'บันทึกข้อมูลสำเร็จ'] --> RefreshTable[รีเฟรชตารางข้อมูล]
    
    OfficerChoice -- แก้ไขข้อมูลและไฟล์ --> EditItem[เลือกแก้ไขรายการ] --> ChangeFile{ต้องการเปลี่ยนไฟล์แนบ?}
    ChangeFile -- ใช่ --> UploadNew[เลือกไฟล์ใหม่แทนที่ไฟล์เดิม] --> UpdateData[ส่ง PUT/PATCH /api/items/:id]
    ChangeFile -- ไม่ใช่ --> UpdateData
    UpdateData --> NotifySuccess
    
    RefreshTable --> EndOfficer([สิ้นสุด])
    FilterList --> EndOfficer
```

---

## 4. Flowchart กระบวนการของผู้ใช้งานระดับ 2 (User Level 2 / Member / General User)
*เกณฑ์: จัดทำผังงานกระบวนการของผู้ใช้งานระดับ 2 (ผู้ใช้งานทั่วไป: ดูข้อมูล, ค้นหา, ส่งคำขอ)*

```mermaid
flowchart TD
    StartMember([เริ่มต้น Member Portal]) --> ViewPublic[แสดงรายการข้อมูลที่ได้รับสิทธิ์ให้มองเห็น]
    ViewPublic --> ActionMember{เลือกกระทำ}
    
    ActionMember -- ค้นหาและดูรายละเอียด --> SearchItem[ค้นหาข้อมูลตาม Category/Keyword]
    SearchItem --> ClickDetail[กดดูรายละเอียดข้อมูล Popup/Detail Page]
    ClickDetail --> DownloadFile{มีไฟล์แนบหรือไม่?}
    DownloadFile -- มี --> Download[กดเปิดหรือดาวน์โหลดไฟล์แนบ]
    DownloadFile -- ไม่มี --> CloseDetail[ปิดหน้าต่าง]
    
    ActionMember -- ส่งคำร้อง/บันทึกรายการตนเอง --> CreateRequest[กรอกฟอร์มคำขอเบิก/ยืม/ส่งรายงาน]
    CreateRequest --> SubmitReq[กด Submit บันทึกข้อมูลสถานะ Pending]
    SubmitReq --> AlertMember[แสดงข้อความ 'ส่งข้อมูลสำเร็จ รอเจ้าหน้าที่ตรวจสอบ']
    
    Download --> EndMember([สิ้นสุด])
    CloseDetail --> EndMember
    AlertMember --> EndMember
```

---

## 5. ผังงานภาพรวมของระบบทั้งหมด (Use Case Diagram)
*เกณฑ์: จัดทำผังงานภาพรวมของระบบทั้งหมด (Usecase Diagram)*

```mermaid
flowchart LR
    subgraph Users ["กลุ่มผู้ใช้งาน (Actors)"]
        Admin(("👑 ผู้ดูแลระบบ<br>(Admin)"))
        Officer(("👤 ผู้ใช้งานระดับ 1<br>(Officer / Staff)"))
        Member(("👥 ผู้ใช้งานระดับ 2<br>(Member / Client)"))
    end

    subgraph System ["ระบบเทคโนโลยีสารสนเทศและการจัดการ (DevOps Application)"]
        UC_Login(["1. เข้าสู่ระบบ (Authentication & JWT)"])
        UC_Profile(["2. จัดการข้อมูลส่วนตัว (Profile)"])
        UC_Dashboard(["3. ดูแดชบอร์ดสรุปสถิติ (Overview Dashboard)"])
        
        UC_UserMgmt(["4. จัดการบัญชีผู้ใช้และกำหนดสิทธิ์ (User Management)"])
        UC_CategoryMgmt(["5. จัดการหมวดหมู่ข้อมูล (Category Management)"])
        
        UC_ItemView(["6. ดูรายการและค้นหาข้อมูล (Search, Filter, Pagination)"])
        UC_ItemCreate(["7. เพิ่มข้อมูลและแนบไฟล์ (Create with File Upload)"])
        UC_ItemEdit(["8. แก้ไขข้อมูลและเปลี่ยนไฟล์แนบ (Update with Attachment)"])
        UC_ItemDelete(["9. ลบข้อมูลพร้อม Modal ยืนยัน (Delete with Confirmation)"])
        
        UC_Export(["10. รายงานผลและบันทึกประวัติ (Audit/Logs)"])
    end

    Admin --> UC_Login
    Admin --> UC_Dashboard
    Admin --> UC_UserMgmt
    Admin --> UC_CategoryMgmt
    Admin --> UC_ItemView
    Admin --> UC_ItemCreate
    Admin --> UC_ItemEdit
    Admin --> UC_ItemDelete
    Admin --> UC_Export

    Officer --> UC_Login
    Officer --> UC_Dashboard
    Officer --> UC_ItemView
    Officer --> UC_ItemCreate
    Officer --> UC_ItemEdit
    Officer --> UC_ItemDelete

    Member --> UC_Login
    Member --> UC_Dashboard
    Member --> UC_ItemView
```

---

## 6. โครงสร้างฐานข้อมูลเชิงสัมพันธ์และ Class Diagram
*เกณฑ์: ออกแบบฐานข้อมูลอย่างน้อย 3 ตาราง, มีความสัมพันธ์ Relational, Data Type เหมาะสม, Class Diagram สมบูรณ์*

```mermaid
classDiagram
    class User {
        +int id PK
        +string username
        +string password_hash
        +string full_name
        +string role [admin | user1 | user2]
        +string email
        +datetime created_at
        +login(username, password)
        +generateToken()
    }

    class Category {
        +int id PK
        +string code
        +string name
        +string description
        +datetime created_at
        +getItems()
    }

    class Item {
        +int id PK
        +int category_id FK
        +int created_by FK
        +string code
        +string title
        +text description
        +float price_or_value
        +string status [active | pending | archived]
        +string attachment_url
        +datetime created_at
        +datetime updated_at
        +createWithFile(data, file)
        +updateWithFile(id, data, file)
        +deleteItem(id)
    }

    User "1" --> "0..*" Item : "created_by (เป็นผู้สร้างรายการ)"
    Category "1" --> "0..*" Item : "belongs_to (สังกัดในหมวดหมู่)"
```
