import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state for zoom modal
# const [selectedPdfImage, setSelectedPdfImage] = useState(null);
code = code.replace(
    "const [checkedItems, setCheckedItems] = useState({});",
    "const [checkedItems, setCheckedItems] = useState({});\n  const [selectedPdfImage, setSelectedPdfImage] = useState(null);"
)

# 2. Add PdfViewerComponent before return (
pdf_component = '''
  // Sub-component to render PDF Original Page Viewer
  const PdfPageBox = ({ title, pages, description }) => (
    <div className="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 dark:from-indigo-950/20 dark:via-[#191919] dark:to-blue-950/10 space-y-3 mb-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-950/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
            ภาพแคปต้นฉบับจริงจาก PDF เกณฑ์ทางการ ({title})
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          เอกสาร: รายการที่ 58 (หน้า {pages.join(', ')}/29)
        </span>
      </div>
      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      <div className={pages.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "grid grid-cols-1 gap-3 max-w-xl mx-auto"}>
        {pages.map((p) => (
          <div key={p} className="relative group rounded-lg overflow-hidden border border-[#edece9] dark:border-[#2e2e2e] bg-slate-100 dark:bg-slate-900 shadow-sm transition hover:shadow-md">
            <div className="p-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm border-b border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">หน้า {p} จาก PDF เกณฑ์ทางการ</span>
              <button 
                type="button" 
                onClick={() => setSelectedPdfImage({ src: `/pdf_pages/page_${p}.png`, title: `หน้า ${p} - เกณฑ์การแข่งขันทางการ` })} 
                className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[10px] flex items-center gap-1 transition"
              >
                <Search className="w-3 h-3" />
                ขยายภาพเต็มจอ
              </button>
            </div>
            <img 
              src={`/pdf_pages/page_${p}.png`} 
              alt={`หน้า ${p} จาก PDF รายการที่ 58`} 
              className="w-full max-h-[360px] md:max-h-[440px] object-contain object-top cursor-pointer transition hover:opacity-95" 
              onClick={() => setSelectedPdfImage({ src: `/pdf_pages/page_${p}.png`, title: `หน้า ${p} - เกณฑ์การแข่งขันทางการ` })} 
              loading="lazy" 
            />
          </div>
        ))}
      </div>
    </div>
  );
'''

code = code.replace("return (\n    <div className=\"min-h-screen", pdf_component + "\n  return (\n    <div className=\"min-h-screen")

# 3. Add PDF boxes to sections in App.jsx

# Section 0: Rules
rules_box = '''
            <PdfPageBox 
              title="กติกา เวลาการแข่งขัน 7 ชม. & กฎการใช้อินเทอร์เน็ต" 
              pages={[1, 4]} 
              description="หน้า 1 แสดงวัตถุประสงค์และคุณสมบัติ และหน้า 4 ระบุกำหนดการ 4 วัน เวลาแข่ง 7 ชั่วโมง และการส่งเครื่องคอมพิวเตอร์" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'rules\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />\n                <span>0. กฎเหล็ก ยุทธศาสตร์เวลา และบทบาททีม 3 คน (7 ชั่วโมง 100 คะแนน)</span>\n              </h2>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'rules\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />\n                <span>0. กฎเหล็ก ยุทธศาสตร์เวลา และบทบาททีม 3 คน (7 ชั่วโมง 100 คะแนน)</span>\n              </h2>\n            </div>' + rules_box
)

# Section 1: Network
network_box = '''
            <PdfPageBox 
              title="ส่วนที่ 1 การตั้งค่าอุปกรณ์เครือข่าย Cisco Switch L3 & Router (13 คะแนน)" 
              pages={[9, 10]} 
              description="หน้า 9 ระบุเกณฑ์ข้อ 1.1 VLAN, 1.2 Inter-VLAN Routing, 1.3 DHCP และหน้า 10 ระบุเกณฑ์ข้อ 1.4 NAT, 1.5 ACL ควบคุมการสื่อสาร และ Loop Protection" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'network\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Network className="w-5 h-5 text-blue-600" />\n                <span>1. ส่วนที่ 1 Network ตั้งค่าพร้อมทั้งทดสอบอุปกรณ์เครือข่าย (13 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">\n                13 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'network\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Network className="w-5 h-5 text-blue-600" />\n                <span>1. ส่วนที่ 1 Network ตั้งค่าพร้อมทั้งทดสอบอุปกรณ์เครือข่าย (13 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">\n                13 PTS\n              </span>\n            </div>' + network_box
)

# Section 2: Server
server_box = '''
            <PdfPageBox 
              title="ส่วนที่ 2 เซิร์ฟเวอร์และระบบ DevOps Infrastructure (24 คะแนน)" 
              pages={[11, 12]} 
              description="หน้า 11 ระบุเกณฑ์ข้อ 2.1 Virtualization, 2.2 Ubuntu Server & Technitium DNS บน Docker และหน้า 12 ระบุเกณฑ์ข้อ 2.3 SSH/UFW, 2.4 Docker+GitLab, 2.5 Reverse Proxy HTTPS, 2.6-2.7 CI/CD Pipeline 4 Stages" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'server\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Server className="w-5 h-5 text-amber-600" />\n                <span>2. ส่วนที่ 2 ตั้งค่าเครือข่ายตามผังระบบเครือข่าย & DevOps Infra (24 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">\n                24 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'server\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Server className="w-5 h-5 text-amber-600" />\n                <span>2. ส่วนที่ 2 ตั้งค่าเครือข่ายตามผังระบบเครือข่าย & DevOps Infra (24 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">\n                24 PTS\n              </span>\n            </div>' + server_box
)

# Section 3: Design
design_box = '''
            <PdfPageBox 
              title="ส่วนที่ 4 ซอฟต์แวร์: ผังงาน Flowchart, Database, Wireframe Draw.io & API Spec (20 คะแนน)" 
              pages={[13, 14]} 
              description="หน้า 13 ระบุเกณฑ์ข้อ 4.1 ผังงาน Flowchart 5 รูป, ข้อ 4.2 ฐานข้อมูลเชิงสัมพันธ์ 3 ตาราง และหน้า 14 ระบุเกณฑ์ข้อ 4.3 ผังหน้าจอ Draw.io 5 หน้า, ข้อ 4.4 RESTful API README.md" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'design\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Database className="w-5 h-5 text-emerald-600" />\n                <span>3. ส่วนที่ 4 การออกแบบระบบ: ผังงาน, ฐานข้อมูล, หน้าจอ & API Spec (20 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">\n                20 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'design\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Database className="w-5 h-5 text-emerald-600" />\n                <span>3. ส่วนที่ 4 การออกแบบระบบ: ผังงาน, ฐานข้อมูล, หน้าจอ & API Spec (20 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">\n                20 PTS\n              </span>\n            </div>' + design_box
)

# Section 4: Backend
backend_box = '''
            <PdfPageBox 
              title="ส่วนที่ 4 ซอฟต์แวร์: Backend API Node.js, JWT, Multer Upload & Validation (10 คะแนน)" 
              pages={[14, 15]} 
              description="หน้า 14 ข้อ 4.5 API GET/POST/Upload และหน้า 15 ข้อ 4.5 API Login JWT, Exception Handling, JSON Response, CRUD ครบ 4 เมธอด, JSDoc Comment" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'backend\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Code2 className="w-5 h-5 text-indigo-600" />\n                <span>4. ส่วนที่ 4 พัฒนาระบบ Back-end API ด้วย Node.js (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">\n                10 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'backend\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Code2 className="w-5 h-5 text-indigo-600" />\n                <span>4. ส่วนที่ 4 พัฒนาระบบ Back-end API ด้วย Node.js (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">\n                10 PTS\n              </span>\n            </div>' + backend_box
)

# Section 5: Frontend
frontend_box = '''
            <PdfPageBox 
              title="ส่วนที่ 4 ซอฟต์แวร์: Frontend UI 3 Roles, Automated Tests & Playwright E2E (23 คะแนน)" 
              pages={[16, 17, 18]} 
              description="หน้า 16 Frontend UI Responsive, JWT 3 Roles, CRUD, Search/Filter, Pagination, หน้า 17 Auto Test Pipeline, Playwright E2E-001, หน้า 18 E2E-002, Git Branch Strategy" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'frontend\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Layout className="w-5 h-5 text-violet-600" />\n                <span>5. ส่วนที่ 4 พัฒนาระบบ Front-end, Automated Tests & E2E Workflows (23 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">\n                23 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'frontend\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Layout className="w-5 h-5 text-violet-600" />\n                <span>5. ส่วนที่ 4 พัฒนาระบบ Front-end, Automated Tests & E2E Workflows (23 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">\n                23 PTS\n              </span>\n            </div>' + frontend_box
)

# Section 6: IoT
iot_box = '''
            <PdfPageBox 
              title="ส่วนที่ 3 หมวดระบบ IoT, Mosquitto MQTT & Node-RED Dashboard (10 คะแนน)" 
              pages={[22]} 
              description="หน้า 22 ระบุเกณฑ์การติดตั้ง MQTT Server, ทดสอบ MQTT Client, เชื่อมต่อ ESP32 ส่งค่าเซนเซอร์ และทำ Dashboard แสดงผล 5 รูปแบบ" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'iot\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Radio className="w-5 h-5 text-sky-600" />\n                <span>6. ส่วนที่ 3 ติดตั้งและทดสอบ MQTT Server, Node-RED, เชื่อมต่อ Hardware (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">\n                10 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'iot\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <Radio className="w-5 h-5 text-sky-600" />\n                <span>6. ส่วนที่ 3 ติดตั้งและทดสอบ MQTT Server, Node-RED, เชื่อมต่อ Hardware (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">\n                10 PTS\n              </span>\n            </div>' + iot_box
)

# Section 7: Presentation
pres_box = '''
            <PdfPageBox 
              title="ส่วนที่ 5 การนำเสนอผลงาน และเกณฑ์เหรียญรางวัล (10 คะแนน)" 
              pages={[28, 29]} 
              description="หน้า 28 ระบุระเบียบคณะกรรมการตัดสิน และหน้า 29 ระบุเกณฑ์เหรียญรางวัล (เหรียญทอง 80 คะแนนขึ้นไป, เหรียญเงิน 70-79, เหรียญทองแดง 60-69)" 
            />'''
code = code.replace(
    '{(activeTab === \'all\' || activeTab === \'presentation\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <MessageSquare className="w-5 h-5 text-rose-600" />\n                <span>7. ส่วนที่ 5 การนำเสนอผลงานและเฉลยแนวคำถามกรรมการ 3 ข้อ (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">\n                10 PTS\n              </span>\n            </div>',
    '{(activeTab === \'all\' || activeTab === \'presentation\') && (\n          <section className="space-y-5">\n            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">\n              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">\n                <MessageSquare className="w-5 h-5 text-rose-600" />\n                <span>7. ส่วนที่ 5 การนำเสนอผลงานและเฉลยแนวคำถามกรรมการ 3 ข้อ (10 คะแนน)</span>\n              </h2>\n              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">\n                10 PTS\n              </span>\n            </div>' + pres_box
)

# 4. Add modal rendering before final </div> of return
zoom_modal = '''
      {/* Zoom Modal */}
      {selectedPdfImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedPdfImage(null)}
        >
          <div 
            className="w-full max-w-5xl bg-white dark:bg-[#202020] rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[96vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-slate-100 dark:bg-[#191919] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {selectedPdfImage.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={selectedPdfImage.src} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-2.5 py-1 text-xs rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  เปิดแท็บใหม่
                </a>
                <button 
                  onClick={() => setSelectedPdfImage(null)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-2 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-slate-900/10 dark:bg-black/40">
              <img 
                src={selectedPdfImage.src} 
                alt="PDF Fullscreen Page" 
                className="max-h-[82vh] w-auto object-contain rounded shadow-lg border border-slate-300 dark:border-slate-800" 
              />
            </div>
          </div>
        </div>
      )}
'''

code = code.replace(
    '</main>\n    </div>\n  );\n}',
    '</main>\n' + zoom_modal + '    </div>\n  );\n}'
)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated src/App.jsx successfully!")
