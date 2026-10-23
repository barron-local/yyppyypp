import re

# Read original HTML
with open('devops_master_notion.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Helper function to generate PDF header box
def make_pdf_box(title, pages, description):
    images_html = ""
    for p in pages:
        images_html += f'''
        <div class="relative group rounded-lg overflow-hidden border border-notion-border dark:border-notion-darkBorder bg-slate-100 dark:bg-slate-900 shadow-sm transition hover:shadow-md">
          <div class="p-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm border-b border-notion-border dark:border-notion-darkBorder flex items-center justify-between text-[11px]">
            <span class="font-semibold text-slate-700 dark:text-slate-300">หน้า {p} จาก PDF เกณฑ์ทางการ</span>
            <button type="button" onclick="openPdfModal('pdf_pages/page_{p}.png', 'หน้า {p} - เกณฑ์การแข่งขันทางการ')" class="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[10px] flex items-center gap-1 transition">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              ขยายภาพเต็มจอ
            </button>
          </div>
          <img src="pdf_pages/page_{p}.png" alt="หน้า {p} จาก PDF รายการที่ 58" class="w-full max-h-[360px] md:max-h-[440px] object-contain object-top cursor-pointer transition hover:opacity-95" onclick="openPdfModal('pdf_pages/page_{p}.png', 'หน้า {p} - เกณฑ์การแข่งขันทางการ')" loading="lazy" />
        </div>'''

    col_class = "grid grid-cols-1 md:grid-cols-2 gap-3" if len(pages) > 1 else "grid grid-cols-1 gap-3 max-w-xl mx-auto"

    return f'''
      <!-- ================= PDF ORIGINAL PAGES VIEWER: {title} ================= -->
      <div class="p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 dark:from-indigo-950/20 dark:via-notion-darkBg dark:to-blue-950/10 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-950/60 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              ภาพแคปต้นฉบับจริงจาก PDF เกณฑ์ทางการ ({title})
            </span>
          </div>
          <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            เอกสาร: รายการที่ 58 (หน้า {", ".join(str(p) for p in pages)}/29)
          </span>
        </div>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
        <div class="{col_class}">
          {images_html}
        </div>
      </div>
'''

# 1. Add modal HTML & JS before </body>
modal_html = '''
  <!-- ========================================================================= -->
  <!-- FULLSCREEN IMAGE ZOOM MODAL -->
  <!-- ========================================================================= -->
  <div id="pdf-zoom-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm hidden flex-col items-center justify-center p-2 sm:p-4 transition-opacity duration-200" onclick="closePdfModal(event)">
    <div class="w-full max-w-5xl bg-white dark:bg-[#202020] rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[96vh]" onclick="event.stopPropagation()">
      <div class="px-4 py-3 bg-slate-100 dark:bg-[#191919] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span id="modal-title" class="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans">หน้าเอกสารจริงจาก PDF เกณฑ์ทางการ</span>
        </div>
        <div class="flex items-center gap-2">
          <a id="modal-download" href="#" target="_blank" class="px-2.5 py-1 text-xs rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition">
            เปิดแท็บใหม่
          </a>
          <button onclick="closePdfModalDirect()" class="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
      <div class="p-2 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-slate-900/10 dark:bg-black/40">
        <img id="modal-img" src="" alt="PDF Original Page" class="max-h-[82vh] w-auto object-contain rounded shadow-lg border border-slate-300 dark:border-slate-800" />
      </div>
    </div>
  </div>

  <script>
    function openPdfModal(imgSrc, title) {
      const modal = document.getElementById('pdf-zoom-modal');
      const img = document.getElementById('modal-img');
      const titleEl = document.getElementById('modal-title');
      const downloadLink = document.getElementById('modal-download');
      
      img.src = imgSrc;
      titleEl.innerText = title || 'ภาพแคปหน้าจริงจาก PDF เกณฑ์การแข่งขัน';
      downloadLink.href = imgSrc;
      
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closePdfModal(e) {
      if (e.target.id === 'pdf-zoom-modal') {
        closePdfModalDirect();
      }
    }

    function closePdfModalDirect() {
      const modal = document.getElementById('pdf-zoom-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePdfModalDirect();
    });
  </script>
'''

# Insert PDF Page Viewers into each section:

# Section 0: Overview (Pages 1, 4)
box_0 = make_pdf_box(
    "กติกา เวลาการแข่งขัน 7 ชม. & กฎการใช้อินเทอร์เน็ต", 
    [1, 4], 
    "หน้า 1 แสดงวัตถุประสงค์และคุณสมบัติ และหน้า 4 ระบุกำหนดการ 4 วัน เวลาแข่ง 7 ชั่วโมง และการส่งเครื่องคอมพิวเตอร์"
)
html = html.replace(
    '<section id="overview" class="space-y-4">\n      <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText flex items-center gap-2">\n        <span>0. กำหนดการและกฎเหล็กการแข่งขัน (Rules & Constraints)</span>\n      </h2>',
    '<section id="overview" class="space-y-4">\n      <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText flex items-center gap-2">\n        <span>0. กำหนดการและกฎเหล็กการแข่งขัน (Rules & Constraints)</span>\n      </h2>' + box_0
)

# Section 1: Network (Pages 9, 10)
box_1 = make_pdf_box(
    "ส่วนที่ 1 การตั้งค่าอุปกรณ์เครือข่าย Cisco Switch L3 & Router (13 คะแนน)", 
    [9, 10], 
    "หน้า 9 ระบุเกณฑ์ข้อ 1.1 VLAN, 1.2 Inter-VLAN Routing, 1.3 DHCP และหน้า 10 ระบุเกณฑ์ข้อ 1.4 NAT, 1.5 ACL ควบคุมการสื่อสาร และ Loop Protection"
)
html = html.replace(
    '<section id="sec-network" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          1. หมวดเครือข่าย Cisco Switch L3 & Router (เกณฑ์ข้อ 3.5.1: 13 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">13 คะแนนเต็ม</span>\n      </div>',
    '<section id="sec-network" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          1. หมวดเครือข่าย Cisco Switch L3 & Router (เกณฑ์ข้อ 3.5.1: 13 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">13 คะแนนเต็ม</span>\n      </div>' + box_1
)

# Section 2: Server (Pages 11, 12)
box_2 = make_pdf_box(
    "ส่วนที่ 2 เซิร์ฟเวอร์และระบบ DevOps Infrastructure (24 คะแนน)", 
    [11, 12], 
    "หน้า 11 ระบุเกณฑ์ข้อ 2.1 Virtualization, 2.2 Ubuntu Server & Technitium DNS บน Docker และหน้า 12 ระบุเกณฑ์ข้อ 2.3 SSH/UFW, 2.4 Docker+GitLab, 2.5 Reverse Proxy HTTPS, 2.6-2.7 CI/CD Pipeline 4 Stages"
)
html = html.replace(
    '<section id="sec-server" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          2. หมวดเซิร์ฟเวอร์และระบบ DevOps Infrastructure (เกณฑ์ข้อ 3.5.2: 24 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">24 คะแนนเต็ม</span>\n      </div>',
    '<section id="sec-server" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          2. หมวดเซิร์ฟเวอร์และระบบ DevOps Infrastructure (เกณฑ์ข้อ 3.5.2: 24 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">24 คะแนนเต็ม</span>\n      </div>' + box_2
)

# Section 3: Design & Wireframe (Pages 13, 14)
box_3 = make_pdf_box(
    "ส่วนที่ 4 ซอฟต์แวร์: ผังงาน Flowchart, Database, Wireframe Draw.io & API Spec (20 คะแนน)", 
    [13, 14], 
    "หน้า 13 ระบุเกณฑ์ข้อ 4.1 ผังงาน Flowchart 5 รูป, ข้อ 4.2 ฐานข้อมูลเชิงสัมพันธ์ 3 ตาราง และหน้า 14 ระบุเกณฑ์ข้อ 4.3 ผังหน้าจอ Draw.io 5 หน้า, ข้อ 4.4 RESTful API README.md"
)
html = html.replace(
    '<section id="sec-design" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          3. การออกแบบระบบ ผังงาน และ API Specification (เกณฑ์ข้อ 4.1 - 4.4: 20 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">20 คะแนนเต็ม</span>\n      </div>',
    '<section id="sec-design" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          3. การออกแบบระบบ ผังงาน และ API Specification (เกณฑ์ข้อ 4.1 - 4.4: 20 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">20 คะแนนเต็ม</span>\n      </div>' + box_3
)

# Section 4: Backend & Frontend (Pages 15, 16, 17, 18)
box_4 = make_pdf_box(
    "ส่วนที่ 4 ซอฟต์แวร์: Backend API Node.js, Frontend UI & Automated Test (33 คะแนน)", 
    [15, 16, 17, 18], 
    "หน้า 15 ระบุเกณฑ์ข้อ 4.5 Backend 10 ข้อย่อย, หน้า 16 ระบุเกณฑ์ข้อ 4.6 Frontend UI 3 Roles & CRUD, หน้า 17 ระบุ Auto Test Pipeline + Playwright E2E-001, หน้า 18 ระบุ E2E-002, Git Branching & ความสมบูรณ์ระบบ"
)
html = html.replace(
    '<section id="sec-backend" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          4. การพัฒนาระบบ Backend Node.js และ Frontend (เกณฑ์ 4.5 & 4.6: 33 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">33 คะแนนเต็ม</span>\n      </div>',
    '<section id="sec-backend" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          4. การพัฒนาระบบ Backend Node.js และ Frontend (เกณฑ์ 4.5 & 4.6: 33 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">33 คะแนนเต็ม</span>\n      </div>' + box_4
)

# Section 5: IoT & MQTT (Pages 22)
box_5 = make_pdf_box(
    "ส่วนที่ 3 หมวดระบบ IoT, Mosquitto MQTT & Node-RED Dashboard (10 คะแนน)", 
    [22], 
    "หน้า 22 ระบุเกณฑ์การติดตั้ง MQTT Server, ทดสอบ MQTT Client, เชื่อมต่อ ESP32 ส่งค่าเซนเซอร์ และทำ Dashboard แสดงผล 5 รูปแบบ"
)
html = html.replace(
    '<section id="sec-iot" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          5. หมวดระบบ IoT และ MQTT Broker (เกณฑ์ส่วนที่ 3: 10 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">10 คะแนน</span>\n      </div>',
    '<section id="sec-iot" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          5. หมวดระบบ IoT และ MQTT Broker (เกณฑ์ส่วนที่ 3: 10 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded">10 คะแนน</span>\n      </div>' + box_5
)

# Section 6: Presentation (Pages 28, 29)
box_6 = make_pdf_box(
    "ส่วนที่ 5 การนำเสนอผลงาน และเกณฑ์เหรียญรางวัล (10 คะแนน)", 
    [28, 29], 
    "หน้า 28 ระบุระเบียบคณะกรรมการตัดสิน และหน้า 29 ระบุเกณฑ์เหรียญรางวัล (เหรียญทอง 80 คะแนนขึ้นไป, เหรียญเงิน 70-79, เหรียญทองแดง 60-69)"
)
html = html.replace(
    '<section id="sec-presentation" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          6. การนำเสนอผลงานและเฉลยแนวคำถามกรรมการ 3 ข้อ (เกณฑ์ส่วนที่ 5: 10 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">10 คะแนนเต็ม</span>\n      </div>',
    '<section id="sec-presentation" class="space-y-4">\n      <div class="flex items-center justify-between pb-2 border-b border-notion-border dark:border-notion-darkBorder">\n        <h2 class="text-xl font-bold text-notion-text dark:text-notion-darkText">\n          6. การนำเสนอผลงานและเฉลยแนวคำถามกรรมการ 3 ข้อ (เกณฑ์ส่วนที่ 5: 10 คะแนน)\n        </h2>\n        <span class="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">10 คะแนนเต็ม</span>\n      </div>' + box_6
)

# Add modal before </body>
html = html.replace('</body>', modal_html + '\n</body>')

with open('devops_master_notion.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated devops_master_notion.html with PDF page boxes and zoom modal successfully!")
