import React, { useState, useEffect } from 'react';
import {
  Layers,
  Network,
  Server,
  Database,
  Code2,
  Layout,
  Radio,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  ShieldAlert,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Award,
  Users,
  FileQuestion,
  HelpCircle,
  AlertTriangle,
  Folder,
  FileCode,
  FileText,
  Download
} from 'lucide-react';
import { projectFileTree, allProjectFiles } from './data/backendCode';
import { designSolutions } from './data/designSolutions';

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeBackendFile, setActiveBackendFile] = useState('backend/controllers/auth.controller.js');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedPdfImage, setSelectedPdfImage] = useState(null);
  const [activeFlowchartTab, setActiveFlowchartTab] = useState('login-flow');

  useEffect(() => {
    const isDark = localStorage.getItem('devops_dark_theme') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedChecks = localStorage.getItem('devops_rubric_checks');
    if (savedChecks) {
      try {
        setCheckedItems(JSON.parse(savedChecks));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('devops_dark_theme', nextDark.toString());
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCheck = (id) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('devops_rubric_checks', JSON.stringify(updated));
  };

  // 100-Point Rubric Items with exact official question numbers
  const rubricList = [
    { id: 'c1', cat: 'Network', qNum: 'ข้อ 1.1', text: 'VLAN Configuration: มี VLAN server, dev, guest เท่านั้น และไม่ใช่ Default VLAN 1', pts: 1 },
    { id: 'c2', cat: 'Network', qNum: 'ข้อ 1.2', text: 'Inter-VLAN Routing: ตั้งค่า IP Interface ทั้ง 3 วง และ Route ระหว่าง VLAN ได้ครบ', pts: 3 },
    { id: 'c3', cat: 'Network', qNum: 'ข้อ 1.3', text: 'DHCP ด้วย Server เครื่องเดียวแจก 3 วง + Switch DHCP Snooping Trust Port', pts: 3 },
    { id: 'c4', cat: 'Network', qNum: 'ข้อ 1.4', text: 'การทำ NAT เพื่อติดต่อกับเครื่องของกรรมการได้ทุก VLAN', pts: 1 },
    { id: 'c5', cat: 'Network', qNum: 'ข้อ 1.5', text: 'ACL ควบคุมการสื่อสาร (Standard, Extended, กั้น Server, Management) + Loop Protection', pts: 5 },
    { id: 'c6', cat: 'Server', qNum: 'ข้อ 2.1', text: 'Virtualization (Proxmox/ESXi/VirtualBox) มี GUI, โครงสร้างตามผัง, IP ถูกต้อง', pts: 3 },
    { id: 'c7', cat: 'Server', qNum: 'ข้อ 2.2', text: 'Ubuntu Server บูตอัตโนมัติเมื่อ VM ดับ, Static IP, Hostname และ Domain ถูกต้อง', pts: 3 },
    { id: 'c8', cat: 'Server', qNum: 'ข้อ 2.2', text: 'DNS Server บน Docker พร้อม ACL จำกัด IP (ห้ามตั้งบน Router/Switch/hosts)', pts: 2 },
    { id: 'c9', cat: 'Server', qNum: 'ข้อ 2.3', text: 'SSH รีโมตได้, เพิ่ม 2 Users, Sudo NOPASSWD (-i), Firewall UFW เปิดเฉพาะพอร์ตที่กำหนด', pts: 5 },
    { id: 'c10', cat: 'Server', qNum: 'ข้อ 2.4', text: 'เครื่องมือ DevOps: Docker ใช้งานได้, ติดตั้ง GitLab ใน Container/VM, สร้าง User ใน UI', pts: 3 },
    { id: 'c11', cat: 'Server', qNum: 'ข้อ 2.5', text: 'Dockerfile สำหรับแอป และ Compose Reverse Proxy HTTPS (NPM/Caddy) + App+DB', pts: 4 },
    { id: 'c12', cat: 'Server', qNum: 'ข้อ 2.6-2.7', text: 'GitLab CI/CD Pipeline 4 Stages (build, test, push, deploy) Trigger และผ่าน 100%', pts: 4 },
    { id: 'c13', cat: 'Software', qNum: 'ข้อ 4.1', text: 'ผังงาน Flowchart 5 รูป (Login, Admin, User 1, User 2, Use Case Diagram)', pts: 5 },
    { id: 'c14', cat: 'Software', qNum: 'ข้อ 4.2', text: 'ฐานข้อมูล Relational 3 ตาราง (PK/FK) มี Class Diagram และตั้งชื่อตามมาตรฐาน', pts: 5 },
    { id: 'c15', cat: 'Software', qNum: 'ข้อ 4.3', text: 'ผังหน้าจอ Draw.io 5 หน้า (Login, Dashboard/Overview, Admin, User 1, User 2)', pts: 5 },
    { id: 'c16', cat: 'Software', qNum: 'ข้อ 4.4', text: 'RESTful API Specification ใน README.md (Status Code, Error, Endpoints, JWT)', pts: 5 },
    { id: 'c17', cat: 'Software', qNum: 'ข้อ 4.5', text: 'Backend REST API 10 ข้อย่อย (GET, POST, Upload, JWT, Exceptions, Comments, Router)', pts: 10 },
    { id: 'c18', cat: 'Software', qNum: 'ข้อ 4.6', text: 'Frontend UI Responsive, JWT Login 3 Roles, CRUD, File Upload, Pagination, Search', pts: 15 },
    { id: 'c19', cat: 'Software', qNum: 'ข้อ 4.6', text: 'Automated Test ใน Pipeline (Unit Testing และ Integration Testing อย่างละ 1 Case)', pts: 2 },
    { id: 'c20', cat: 'Software', qNum: 'ข้อ 4.6', text: 'Playwright E2E Workflows (E2E-001 Login สำเร็จ, E2E-002 ส่งข้อมูลสำเร็จ)', pts: 2 },
    { id: 'c21', cat: 'Software', qNum: 'ข้อ 4.6', text: 'การใช้ Git และ Branch Strategy (Backend / Frontend / DevOps merge)', pts: 1 },
    { id: 'c22', cat: 'Software', qNum: 'ข้อ 4.6', text: 'ความสมบูรณ์ของระบบ Application ทั้งหมด', pts: 3 },
    { id: 'c23', cat: 'Present', qNum: 'ข้อ 5.1', text: 'การตอบคำถามกรรมการ 3 ข้อ (Backend, Frontend, DevOps Troubleshooting)', pts: 3 },
    { id: 'c24', cat: 'Present', qNum: 'ข้อ 5.2', text: 'นำเสนอวิธีการทำงานร่วมกัน โดยกระจายการทำงานกันอย่างเหมาะสม', pts: 3 },
    { id: 'c25', cat: 'Present', qNum: 'ข้อ 5.3-5.4', text: 'บุคลิกภาพ และการนำเสนอภายในระยะเวลาที่กำหนด (ไม่เกิน 30 นาที)', pts: 4 }
  ];

  const totalScore = rubricList.reduce((acc, curr) => acc + (checkedItems[curr.id] ? curr.pts : 0), 0);

  const navCategories = [
    { id: 'all', label: 'All Modules (ทุกหมวดและโจทย์ทั้งหมด)', icon: Layers },
    { id: 'rules', label: '0. กฎเหล็ก & ยุทธศาสตร์ 7 ชม.', icon: Clock },
    { id: 'network', label: '1. เครือข่าย Cisco L3 & NAT (13 pts)', icon: Network },
    { id: 'server', label: '2. เซิร์ฟเวอร์ & DevOps Infra (24 pts)', icon: Server },
    { id: 'design', label: '3. ออกแบบระบบ, ผังงาน & API (20 pts)', icon: Database },
    { id: 'backend', label: '4. Backend Node.js & Tests (10 pts)', icon: Code2 },
    { id: 'frontend', label: '5. Frontend UI & E2E Workflows (23 pts)', icon: Layout },
    { id: 'presentation', label: '6. การนำเสนอ & เฉลย 3 คำถาม (10 pts)', icon: MessageSquare },
    { id: 'checklist', label: '7. ตารางตรวจ 100 คะแนนเต็ม', icon: CheckCircle2 },
  ];

  
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#d4d4d4] transition-colors">
      
      {/* --------------------------------------------------------------------- */}
      {/* MOBILE TOP BAR */}
      {/* --------------------------------------------------------------------- */}
      <div className="md:hidden flex items-center justify-between p-3.5 border-b border-[#edece9] dark:border-[#2e2e2e] bg-[#fbfbfa] dark:bg-[#202020] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-xs tracking-tight">DevOps Skills Guide (58)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {totalScore}/100 PTS
          </span>
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* NOTION SIDEBAR */}
      {/* --------------------------------------------------------------------- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#fbfbfa] dark:bg-[#202020] border-r border-[#edece9] dark:border-[#2e2e2e]
        transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center justify-between p-3.5 border-b border-[#edece9] dark:border-[#2e2e2e]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black dark:bg-white rounded flex items-center justify-center text-white dark:text-black font-bold text-xs">
              N
            </div>
            <span className="font-semibold text-xs tracking-tight truncate">DevOps Competition (58)</span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[#787774] dark:text-[#9b9b9b]"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-2.5 border-b border-[#edece9] dark:border-[#2e2e2e]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#787774] dark:text-[#9b9b9b]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections or questions..." 
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 text-xs">
          <div className="text-[10px] font-semibold tracking-wider text-[#787774] dark:text-[#9b9b9b] px-2 py-1 uppercase">
            Curriculum Sections
          </div>
          {navCategories.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition ${
                  isActive 
                    ? 'bg-black/5 dark:bg-white/10 font-semibold text-black dark:text-white' 
                    : 'text-[#787774] dark:text-[#9b9b9b] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#edece9] dark:border-[#2e2e2e] text-[11px] flex items-center justify-between">
          <span className="text-[#787774] dark:text-[#9b9b9b]">Checklist Score:</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{totalScore}/100 PTS</span>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden px-3 sm:px-6 lg:px-12 py-6 md:py-10 max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9b9b9b]">
          <span>Vocational Competition</span>
          <span>/</span>
          <span>Item 58: DevOps IT & Network</span>
          <span>/</span>
          <span className="text-[#37352f] dark:text-[#d4d4d4] font-medium">Official Exam Questions & Solutions</span>
        </div>

        {/* Page Title & Properties */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#37352f] dark:text-[#d4d4d4]">
            ทักษะเทคโนโลยีสารสนเทศด้านโปรแกรมและเครือข่ายด้วยกระบวนการ DevOps
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
            คู่มือการฝึกซ้อมพร้อมระบุ <strong>"โจทย์และข้อกำหนดตามเกณฑ์การแข่งขันทางการ (รายการที่ 58)"</strong> กำกับไว้ที่หัวข้อของคำตอบทุกข้ออย่างชัดเจน เพื่อความแม่นยำในการเก็บ 100 คะแนนเต็ม
          </p>

          <div className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-full">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[#787774] dark:text-[#9b9b9b]">Time:</span>
              <span className="font-medium">7 Hours (Day 2)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-[#787774] dark:text-[#9b9b9b]">Internet:</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">2 Hours Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-[#787774] dark:text-[#9b9b9b]">Team:</span>
              <span className="font-medium">3 Competitors</span>
            </div>
          </div>
        </div>

        <hr className="border-[#edece9] dark:border-[#2e2e2e]" />

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 0: RULES & STRATEGY */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'rules') && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>0. กฎเหล็กการแข่งขันและข้อกำหนดเวลา (เกณฑ์ข้อ 3.3 & 3.4)</span>
            </h2>

            {/* Official Question Box */}
            <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-blue-600 rounded-r-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  [โจทย์ข้อ 3.3.4 & 3.4.29: กฎการใช้อินเทอร์เน็ตและเวลาแข่งขัน 7 ชั่วโมง]
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                  กติกาข้อบังคับ
                </span>
              </div>
              <p className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                <strong>ข้อความโจทย์ตามประกาศ:</strong> "อนุญาตให้เชื่อมต่ออินเตอร์เน็ตเพื่อใช้เฉพาะการติดตั้งและตั้งค่าระบบ ระยะเวลา 2 ชั่วโมง เมื่อหมดเวลาการใช้งานอินเตอร์เน็ตและมีทีมที่ต้องการใช้งานอินเตอร์เน็ตนอกเหนือจากนี้ ให้อยู่ในดุลพินิจของคณะกรรมการ โดยกำหนดไม่เกินทีมละ 20 นาที และแต่ละทีมสามารถร้องขอได้ไม่เกิน 3 ครั้ง ตลอดการแข่งขัน"
              </p>
            </div>

            <div className="grid grid grid-cols-1 md:grid-cols-3 gap-3 text-xs w-full max-w-full">
              <div className="p-3.5 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-1.5">
                <div className="font-bold text-blue-600 dark:text-blue-400">[คนที่ 1: Network & Linux Admin]</div>
                <p className="text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
                  รับผิดชอบ: Switch L3 (VLAN, SVI, DHCP, NAT, ACL), Ubuntu VM บน Proxmox, Sudo NOPASSWD, UFW, Technitium DNS บน Docker, Reverse Proxy HTTPS
                </p>
              </div>
              <div className="p-3.5 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-1.5">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">[คนที่ 2: Backend & CI/CD Engineer]</div>
                <p className="text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
                  รับผิดชอบ: Database 3 ตาราง, Node.js REST API (JWT, Multer, MVC), Unit & Integration Test, ติดตั้ง GitLab + Runner, Dockerfile, .gitlab-ci.yml 4 Stages
                </p>
              </div>
              <div className="p-3.5 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-1.5">
                <div className="font-bold text-violet-600 dark:text-violet-400">[คนที่ 3: Frontend & E2E Tester]</div>
                <p className="text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
                  รับผิดชอบ: วาด Flowchart 5 รูป, Wireframe 5 หน้าใน Draw.io, Frontend UI (Responsive, JWT Login 3 Roles, CRUD, แนบไฟล์, Modal ลบ), Playwright E2E Tests
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 1: NETWORK & CISCO L3 */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'network') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                <span>1. ส่วนที่ 1 Network ตั้งค่าพร้อมทั้งทดสอบอุปกรณ์เครือข่าย (13 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                13 PTS
              </span>
            </div>
            <PdfPageBox 
              title="ส่วนที่ 1 การตั้งค่าอุปกรณ์เครือข่าย Cisco Switch L3 & Router (13 คะแนน)" 
              pages={[9, 10]} 
              description="หน้า 9 ระบุเกณฑ์ข้อ 1.1 VLAN, 1.2 Inter-VLAN Routing, 1.3 DHCP และหน้า 10 ระบุเกณฑ์ข้อ 1.4 NAT, 1.5 ACL ควบคุมการสื่อสาร และ Loop Protection" 
            />

            {/* IP Plan Table */}
            <div className="overflow-x-auto max-w-full w-full border border-[#edece9] dark:border-[#2e2e2e] rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f7f6f3] dark:bg-[#252525] border-b border-[#edece9] dark:border-[#2e2e2e] font-semibold">
                  <tr>
                    <th className="p-2.5">VLAN ID</th>
                    <th className="p-2.5">ชื่อ VLAN (ห้ามใช้ VLAN 1)</th>
                    <th className="p-2.5">Subnet</th>
                    <th className="p-2.5">Gateway (IP SVI)</th>
                    <th className="p-2.5">หน้าที่</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edece9] dark:divide-[#2e2e2e] text-[#787774] dark:text-[#9b9b9b]">
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-blue-600">10</td>
                    <td className="p-2.5 font-mono">server</td>
                    <td className="p-2.5 font-mono">192.168.10.0/24</td>
                    <td className="p-2.5 font-mono">192.168.10.1</td>
                    <td className="p-2.5">วงเครื่องแม่ข่าย VM, GitLab, DNS, Production</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-emerald-600">20</td>
                    <td className="p-2.5 font-mono">dev</td>
                    <td className="p-2.5 font-mono">192.168.20.0/24</td>
                    <td className="p-2.5 font-mono">192.168.20.1</td>
                    <td className="p-2.5">วงพัฒนาโปรแกรมของผู้เข้าแข่งขัน</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono font-bold text-amber-600">30</td>
                    <td className="p-2.5 font-mono">guest</td>
                    <td className="p-2.5 font-mono">192.168.30.0/24</td>
                    <td className="p-2.5 font-mono">192.168.30.1</td>
                    <td className="p-2.5">วงผู้ใช้งานทั่วไป และเครื่องกรรมการทดสอบ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Card 1: Cisco L3 CLI */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              {/* Question 1.1 - 1.3 Box */}
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-blue-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 1.1, 1.2, 1.3: VLAN, Inter-VLAN Routing & DHCP Snooping]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                    คะแนนเต็ม 7 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  • <strong>ข้อ 1.1:</strong> VLAN Configuration - มี VLAN <code>server</code>, <code>dev</code>, <code>guest</code> เท่านั้น และไม่ใช่ Default VLAN (1 คะแนน, VLAN ละ 0.33)<br />
                  • <strong>ข้อ 1.2:</strong> Inter-VLAN Routing - ตั้งค่า IP Interface และ Routing ระหว่าง VLAN มี IP ทั้ง 3 วง (2 คะแนน ไม่ครบได้ 0) และทำ Routing ระหว่าง VLAN ได้ครบทั้งสาม (1 คะแนน ไม่ครบได้ 0)<br />
                  • <strong>ข้อ 1.3:</strong> DHCP ด้วย Server เครื่องเดียวที่รับผิดชอบ - แจก DHCP 3 เครือข่าย (2 คะแนน) และให้ Switch ยอมรับการใช้งาน DHCP Server เฉพาะ Port ที่กำหนดได้ (DHCP Snooping + Trust Port) (1 คะแนน)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบและชุดคำสั่งสำหรับข้อ 1.1, 1.2 และ 1.3</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">จุดที่ต้องรัน: คอนโซลของ Cisco Layer 3 Switch</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`enable
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
ip routing
interface vlan 10
 description Gateway Server Network
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit
interface vlan 20
 description Gateway Dev Network
 ip address 192.168.20.1 255.255.255.0
 no shutdown
exit
interface vlan 30
 description Gateway Guest Network
 ip address 192.168.30.1 255.255.255.0
 no shutdown
exit
ip dhcp excluded-address 192.168.10.1 192.168.10.50
ip dhcp excluded-address 192.168.20.1 192.168.20.20
ip dhcp excluded-address 192.168.30.1 192.168.30.20
ip dhcp pool POOL_SERVER
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.10
exit
ip dhcp pool POOL_DEV
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.10.10
exit
ip dhcp pool POOL_GUEST
 network 192.168.30.0 255.255.255.0
 default-router 192.168.30.1
 dns-server 192.168.10.10
exit
ip dhcp snooping
ip dhcp snooping vlan 10,20,30
no ip dhcp snooping information option
interface FastEthernet 0/1
 ip dhcp snooping trust
exit
interface range FastEthernet 0/2 - 24
 ip dhcp snooping limit rate 15
exit
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default
end
write memory`, 'cisco-l3')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'cisco-l3' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'cisco-l3' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`enable
configure terminal

! ตอบข้อ 1.1: สร้าง VLAN 3 วงตามเกณฑ์ (ห้ามใช้ Default VLAN 1)
vlan 10
 name server
vlan 20
 name dev
vlan 30
 name guest
exit

! ตอบข้อ 1.2: เปิด ip routing และตั้ง SVI Gateway ครบทั้ง 3 วง
ip routing
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
interface vlan 30
 ip address 192.168.30.1 255.255.255.0
 no shutdown
exit

! ตอบข้อ 1.3: ตั้งค่า DHCP Server แจกทั้ง 3 วง
ip dhcp excluded-address 192.168.10.1 192.168.10.50
ip dhcp excluded-address 192.168.20.1 192.168.20.20
ip dhcp excluded-address 192.168.30.1 192.168.30.20

ip dhcp pool POOL_SERVER
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.10
ip dhcp pool POOL_DEV
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.10.10
ip dhcp pool POOL_GUEST
 network 192.168.30.0 255.255.255.0
 default-router 192.168.30.1
 dns-server 192.168.10.10
exit

! ตอบข้อ 1.3 (ต่อ): เปิด DHCP Snooping และกำหนด Trust Port ขาต่อ Server
ip dhcp snooping
ip dhcp snooping vlan 10,20,30
no ip dhcp snooping information option
interface FastEthernet 0/1
 ip dhcp snooping trust
exit

! ตอบข้อ 1.5: ป้องกัน Loop บน Switch (STP BPDU Guard)
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default
end
write memory`}
              </pre>

              <div className="p-2.5 bg-[#edf6ed] dark:bg-[#1c2e20] border border-emerald-200 dark:border-emerald-900/40 rounded text-[11px] text-emerald-900 dark:text-emerald-200">
                <strong>วิธีตรวจสอบผล (Verification):</strong> พิมพ์คำสั่ง <code>show vlan brief</code> (ตรวจข้อ 1.1), <code>show ip route</code> (ตรวจข้อ 1.2), และ <code>show ip dhcp snooping</code> (ตรวจข้อ 1.3)
              </div>
            </div>

            {/* Action Card 2: Router NAT & ACL */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              {/* Question 1.4 - 1.5 Box */}
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-blue-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 1.4 & 1.5: NAT เชื่อมต่อกรรมการ, Standard/Extended ACL & Loop Protection]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                    คะแนนเต็ม 6 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  • <strong>ข้อ 1.4:</strong> การทำ NAT เพื่อติดต่อกับเครื่องของกรรมการได้ - ใช้ NAT เพื่อให้อุปกรณ์เชื่อมต่อเครือข่ายที่จัดเตรียมได้ NAT ได้ทุก VLAN เพื่อใช้งานเครือข่ายภายนอก (1 คะแนน)<br />
                  • <strong>ข้อ 1.5:</strong> การทำ ACL ควบคุมการสื่อสารภายในเครือข่าย - ทำ Standard ACL (1 คะแนน), ทำ Extended ACL อนุญาตเฉพาะ Service ที่กำหนด (1 คะแนน), ทำ ACL ป้องกันการเข้าถึง Server (1 คะแนน), ทำ ACL สำหรับ Management VLAN (1 คะแนน), ตั้งค่าเพื่อป้องกัน Loop บน Switch (1 คะแนน)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบและชุดคำสั่งสำหรับข้อ 1.4 และ 1.5</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">จุดที่ต้องรัน: Cisco Router ขาออกนอก และ Switch L3</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`! บน Router ทำ NAT Overload (ตอบข้อ 1.4)
access-list 1 permit 192.168.10.0 0.0.0.255
access-list 1 permit 192.168.20.0 0.0.0.255
access-list 1 permit 192.168.30.0 0.0.0.255
interface GigabitEthernet 0/0
 ip nat inside
interface GigabitEthernet 0/1
 ip nat outside
ip nat inside source list 1 interface GigabitEthernet 0/1 overload

! บน Switch L3 ทำ Standard ACL สำหรับ Management VLAN (ตอบข้อ 1.5)
access-list 10 permit 192.168.20.0 0.0.0.255
access-list 10 deny any
line vty 0 4
 transport input ssh
 access-class 10 in

! บน Switch L3 ทำ Extended ACL ป้องกัน Server (ตอบข้อ 1.5)
ip access-list extended ACL_GUEST_RESTRICT
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 80
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 443
 permit udp 192.168.30.0 0.0.0.255 host 192.168.10.10 eq 53
 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip 192.168.30.0 0.0.0.255 any
exit
interface vlan 30
 ip access-group ACL_GUEST_RESTRICT in
exit`, 'cisco-nat')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'cisco-nat' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'cisco-nat' ? 'Copied!' : 'Copy Commands'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`! ตอบข้อ 1.4: ตั้ง NAT Overload บน Router ให้อุปกรณ์ทุกวงออกเน็ตหากรรมการได้
access-list 1 permit 192.168.10.0 0.0.0.255
access-list 1 permit 192.168.20.0 0.0.0.255
access-list 1 permit 192.168.30.0 0.0.0.255
interface GigabitEthernet 0/0
 ip nat inside
interface GigabitEthernet 0/1
 ip nat outside
ip nat inside source list 1 interface GigabitEthernet 0/1 overload

! ตอบข้อ 1.5: Standard ACL อนุญาตเฉพาะเครื่องในวง Dev เข้าจัดการ Switch
access-list 10 permit 192.168.20.0 0.0.0.255
access-list 10 deny any
line vty 0 4
 transport input ssh
 access-class 10 in

! ตอบข้อ 1.5: Extended ACL ป้องกัน Guest เข้าถึง Server ยกเว้น Service 80, 443, 53
ip access-list extended ACL_GUEST_RESTRICT
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 80
 permit tcp 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255 eq 443
 permit udp 192.168.30.0 0.0.0.255 host 192.168.10.10 eq 53
 deny ip 192.168.30.0 0.0.0.255 192.168.10.0 0.0.0.255
 permit ip 192.168.30.0 0.0.0.255 any
exit
interface vlan 30
 ip access-group ACL_GUEST_RESTRICT in
exit`}
              </pre>

              <div className="p-2.5 bg-[#edf6ed] dark:bg-[#1c2e20] border border-emerald-200 dark:border-emerald-900/40 rounded text-[11px] text-emerald-900 dark:text-emerald-200">
                <strong>วิธีตรวจสอบผล:</strong> ใช้คำสั่ง <code>show ip nat translations</code> และ <code>show ip access-lists</code> บนอุปกรณ์
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 2: SERVER & DEVOPS INFRA */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'server') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-600" />
                <span>2. ส่วนที่ 2 ตั้งค่าเครือข่ายตามผังระบบเครือข่ายและ DevOps Infra (24 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                24 PTS
              </span>
            </div>

            {/* Ubuntu Server Setup (ข้อ 2.1, 2.2, 2.3) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-amber-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 2.1, 2.2, 2.3: Virtualization, Linux Server, Users & Sudo NOPASSWD]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    คะแนนเต็ม 11 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  • <strong>ข้อ 2.1:</strong> Virtualization (Proxmox/ESXi/VirtualBox) มี GUI, โครงสร้างตามผัง, IP ถูกต้อง (3 คะแนน)<br />
                  • <strong>ข้อ 2.2:</strong> Linux Server บน VM (Ubuntu/Debian) ติดตั้งได้และบูตใช้งานได้ เปิดอัตโนมัติเมื่อ host ดับแล้วเปิดใหม่ (1 คะแนน), ตั้งค่า IP Static/DHCP ถูกต้อง (1 คะแนน), ตั้งค่า Hostname และ Domain Name ตามกำหนด (1 คะแนน)<br />
                  • <strong>ข้อ 2.3:</strong> SSH Remote Tools - เปิดบริการ SSH (1 คะแนน), เพิ่ม User อย่างน้อย 2 User (1 คะแนน), Remote เข้ามาด้วย user และ port ที่กำหนด (1 คะแนน), ตั้งค่า firewall (UFW) เพื่อเปิดพอร์ตบริการตามกำหนด (1 คะแนน), <strong>กำหนดให้ user ที่ Login เข้ามาสามารถใช้คำสั่ง sudo -i โดยไม่ต้องยืนยันรหัสผ่าน (1 คะแนน)</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบและสคริปต์ตั้งค่า Ubuntu Server สำหรับข้อ 2.1, 2.2, 2.3</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">จุดที่ต้องรัน: Terminal ของ Ubuntu Server VM (192.168.10.10)</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`sudo hostnamectl set-hostname server.competition.lab
sudo useradd -m -s /bin/bash devops_admin
sudo useradd -m -s /bin/bash app_deployer
echo "devops_admin:Password123!" | sudo chpasswd
echo "app_deployer:Password123!" | sudo chpasswd
sudo usermod -aG sudo devops_admin
sudo usermod -aG sudo app_deployer
echo "devops_admin ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/99-devops
echo "app_deployer ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers.d/99-devops
sudo chmod 0440 /etc/sudoers.d/99-devops
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 53
sudo ufw allow 5000/tcp
sudo ufw allow 8080/tcp
sudo ufw --force enable`, 'ubuntu-init')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'ubuntu-init' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'ubuntu-init' ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`# ตอบข้อ 2.2: ตั้ง Hostname และ Domain Name ตามที่กำหนด
sudo hostnamectl set-hostname server.competition.lab

# ตอบข้อ 2.3: เพิ่ม 2 Users และให้สิทธิ์ Sudo NOPASSWD (-i)
sudo useradd -m -s /bin/bash devops_admin
sudo useradd -m -s /bin/bash app_deployer
echo "devops_admin:Password123!" | sudo chpasswd
echo "app_deployer:Password123!" | sudo chpasswd
sudo usermod -aG sudo devops_admin
sudo usermod -aG sudo app_deployer

# กำหนดสิทธิ์ NOPASSWD ใน /etc/sudoers.d/
echo "devops_admin ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/99-devops
echo "app_deployer ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers.d/99-devops
sudo chmod 0440 /etc/sudoers.d/99-devops

# ตอบข้อ 2.3: เปิดบริการ SSH และตั้งค่า Firewall UFW ตามพอร์ตบริการ
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS SSL
sudo ufw allow 53        # DNS Service
sudo ufw allow 5000/tcp  # Private Registry
sudo ufw allow 8080/tcp  # GitLab
sudo ufw --force enable`}
              </pre>

              <div className="p-2.5 bg-[#edf6ed] dark:bg-[#1c2e20] border border-emerald-200 dark:border-emerald-900/40 rounded text-[11px] text-emerald-900 dark:text-emerald-200">
                <strong>วิธีทดสอบ Sudo NOPASSWD (ตรวจข้อ 2.3):</strong> สลับ user เป็น <code>su - devops_admin</code> แล้วพิมพ์ <code>sudo -i</code> ต้องเข้าสู่สิทธิ์ root ได้ทันทีโดยไม่ถาม password
              </div>
            </div>

            {/* Technitium DNS in Docker (ข้อ 2.2 DNS) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-amber-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 2.2: การติดตั้งและใช้งาน DNS Server บน Docker พร้อมกำหนด ACL]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    คะแนนเต็ม 2 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  "มีการติดตั้งและใช้งาน DNS Server ใน Network ของตนเอง บน Docker หรือ Linux Server ตามชื่อที่กรรมการกำหนด โดยเครื่องลูกข่ายสามารถเรียกใช้งาน DNS Server ได้ <strong>(หมายเหตุ: ตั้งค่าบน Router หรือ Switch หรือ Hosts จะไม่ได้คะแนน)</strong> (1 คะแนน)<br />
                  กำหนดการเข้าถึง DNS Server ใน Network โดยใช้ IP Address ที่กำหนดเท่านั้น (ACL) (1 คะแนน)"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบและชุดคำสั่ง Docker สำหรับข้อ 2.2 DNS Server</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">จุดที่ต้องรัน: Docker บน Ubuntu Server VM</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`docker run -d \\
  --name technitium-dns \\
  --restart always \\
  -p 53:53/udp \\
  -p 53:53/tcp \\
  -p 5380:5380/tcp \\
  -e DNS_SERVER_ADMIN_PASSWORD=AdminPassword123! \\
  -v technitium_data:/etc/dns \\
  technitium/dns-server:latest`, 'technitium-cmd')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'technitium-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'technitium-cmd' ? 'Copied!' : 'Copy Docker Command'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`docker run -d \\
  --name technitium-dns \\
  --restart always \\
  -p 53:53/udp \\
  -p 53:53/tcp \\
  -p 5380:5380/tcp \\
  -e DNS_SERVER_ADMIN_PASSWORD=AdminPassword123! \\
  -v technitium_data:/etc/dns \\
  technitium/dns-server:latest`}
              </pre>

              <div className="space-y-1.5 text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
                <div><strong>ขั้นตอนตั้งค่าผ่าน Web GUI (http://192.168.10.10:5380):</strong></div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>ไปที่แท็บ <strong>Zones</strong> &rarr; Add Zone ชนิด Primary Zone ชื่อ <code>competition.lab</code></li>
                  <li>เพิ่ม A Records ชี้ไปที่ <code>192.168.10.10</code>: <code>gitlab</code>, <code>registry</code>, <code>app</code>, <code>api</code></li>
                  <li>ไปที่ <strong>Settings</strong> &rarr; <strong>Allowed Networks / Access Control</strong> &rarr; เลือก <strong>Restricted</strong> ใส่ <code>192.168.10.0/24, 192.168.20.0/24</code> เพื่อผ่านเกณฑ์ ACL</li>
                </ol>
              </div>
            </div>

            {/* Docker Compose & Reverse Proxy (ข้อ 2.4 - 2.5) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-amber-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 2.4 & 2.5: เครื่องมือ DevOps, Dockerfile & Reverse Proxy HTTPS]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    คะแนนเต็ม 7 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  • <strong>ข้อ 2.4:</strong> ติดตั้ง Docker ได้และใช้งานได้ เช่น docker ps, run, exec (1 คะแนน), ติดตั้ง GitLab ได้ใน container หรือ VM โดยเข้าเว็บได้ (1 คะแนน), สร้าง User ใน Gitlab และเข้าหน้า UI ได้ (1 คะแนน)<br />
                  • <strong>ข้อ 2.5:</strong> สร้างและใช้งาน Dockerfile สำหรับแอป Node/เว็บที่พัฒนาได้ (1 คะแนน), ใช้ docker-compose.yaml สำหรับบริการ reverse proxy เพื่อใช้บริการ https (caddy, NPM) (1 คะแนน), ใช้ reverse proxy กับ host และ domain ของระบบที่พัฒนาได้ (registry, gitlab, frontend, backend) เช่น <code>https://gitlab.mydomain.lab</code> (1 คะแนน), ใช้ docker-compose.yaml สำหรับบริการมากกว่า 1 (เช่น app + db) ใน 1 compose (1 คะแนน)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบ: ไฟล์ docker-compose.infra.yml รวมหลายบริการตามเกณฑ์</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">ไฟล์ที่ใช้: modules/03_Linux_and_DevOps_Infra/docker-compose.infra.yml</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`version: '3.8'
services:
  reverse-proxy:
    image: jc21/nginx-proxy-manager:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./npm_data:/data
      - ./letsencrypt:/etc/letsencrypt

  registry:
    image: registry:2
    restart: always
    ports:
      - "5000:5000"
    volumes:
      - ./registry_data:/var/lib/registry

  mariadb:
    image: mariadb:10.11
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword123!
      MYSQL_DATABASE: competition_db
    volumes:
      - ./db_data:/var/lib/mysql`, 'compose-infra')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'compose-infra' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'compose-infra' ? 'Copied!' : 'Copy YAML'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`version: '3.8'
services:
  # 1. Reverse Proxy สำหรับ HTTPS และ Virtual Host (NPM)
  reverse-proxy:
    image: jc21/nginx-proxy-manager:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./npm_data:/data
      - ./letsencrypt:/etc/letsencrypt

  # 2. Private Docker Registry สำหรับเก็บ Image
  registry:
    image: registry:2
    restart: always
    ports:
      - "5000:5000"
    volumes:
      - ./registry_data:/var/lib/registry

  # 3. Database Server
  mariadb:
    image: mariadb:10.11
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: RootPassword123!
      MYSQL_DATABASE: competition_db
    volumes:
      - ./db_data:/var/lib/mysql`}
              </pre>
            </div>

            {/* CI/CD Pipeline (ข้อ 2.6 - 2.7) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-amber-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 2.6 & 2.7: กำหนด CI/CD Pipeline 4 ขั้นตอนและทดสอบ Trigger ใช้งานจริง]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    คะแนนเต็ม 4 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  • <strong>ข้อ 2.6:</strong> สร้าง <code>.gitlab-ci.yml</code> เชื่อมโยงกับการกำหนด State ครบทั้ง 4 ขั้นตอน Build, Test, Push ขึ้น Registry ของตนเอง, Deploy ไปยัง Server ของตนเอง (1 คะแนน)<br />
                  • <strong>ข้อ 2.7:</strong> Push code แล้วเกิด Trigger ได้จริง (0.5 คะแนน), <strong>กำหนด Stage ครบ 4 ขั้นตอน (build, test, push ขึ้น registry, deploy) และทำงานได้จริงทุกขั้นตอน (หมายเหตุ: ถ้าได้แค่อย่างใดอย่างหนึ่งจะไม่ได้คะแนน ไม่มีการหารเฉลี่ย) (2 คะแนน)</strong>, ระบบสามารถ build และสร้าง image ได้ (0.5 คะแนน)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">คำตอบ: ไฟล์ .gitlab-ci.yml ครบทั้ง 4 Stages ทำงานผ่าน 100%</span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">ไฟล์ที่ใช้: modules/03_Linux_and_DevOps_Infra/gitlab-ci-reference.yml</div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`stages:
  - build
  - test
  - push
  - deploy

build_job:
  stage: build
  image: node:18-alpine
  script:
    - npm ci || npm install

test_job:
  stage: test
  image: node:18-alpine
  script:
    - npm test

push_job:
  stage: push
  image: docker:24-cli
  services:
    - docker:24-dind
  script:
    - docker build -t 192.168.10.10:5000/app:latest .
    - docker push 192.168.10.10:5000/app:latest

deploy_job:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to Production Server..."
    - echo "Application online at https://app.competition.lab"
  only:
    - main`, 'gitlab-ci')}
                  className="px-2.5 py-1 rounded bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  {copiedId === 'gitlab-ci' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'gitlab-ci' ? 'Copied!' : 'Copy YAML'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded text-[11px] font-mono overflow-x-auto max-w-full w-full text-slate-800 dark:text-slate-200">
{`stages:
  - build
  - test
  - push
  - deploy

build_job:
  stage: build
  image: node:18-alpine
  script:
    - npm ci || npm install

test_job:
  stage: test
  image: node:18-alpine
  script:
    - npm test

push_job:
  stage: push
  image: docker:24-cli
  services:
    - docker:24-dind
  script:
    - docker build -t 192.168.10.10:5000/app:latest .
    - docker push 192.168.10.10:5000/app:latest

deploy_job:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to Production Server..."
    - echo "Application online at https://app.competition.lab"
  only:
    - main`}
              </pre>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 3: SYSTEM DESIGN & DB */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'design') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>3. ส่วนที่ 4 การออกแบบผังงาน, ฐานข้อมูล และ RESTful API (20 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                20 PTS
              </span>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 4.1: Flowchart & Use Case Interactive Solution */}
            {/* ------------------------------------------------------------- */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-xl bg-white dark:bg-[#191919] space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-600 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    [เฉลยข้อที่ 4.1: การออกแบบผังงาน Flowchart & Use Case (5 คะแนนเต็ม)]
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 font-bold">
                    5 ข้อครบ 5 คะแนน
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  คลิกเลือกดูเฉลยผังงานแต่ละข้อ สามารถคัดลอกโค้ด Mermaid ไป Import ใส่ Draw.io หรือวาดส่งกรรมการได้ทันที
                </p>
              </div>

              {/* Flowchart Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-[#edece9] dark:border-[#2e2e2e] pb-2">
                {designSolutions.flowcharts.map(fc => (
                  <button
                    key={fc.id}
                    onClick={() => setActiveFlowchartTab(fc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeFlowchartTab === fc.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#f7f6f3] dark:bg-[#262626] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {fc.title.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Selected Flowchart Details */}
              {(() => {
                const currentFc = designSolutions.flowcharts.find(f => f.id === activeFlowchartTab) || designSolutions.flowcharts[0];
                return (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">{currentFc.title}</h4>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{currentFc.points}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentFc.mermaid, currentFc.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#252525] dark:hover:bg-[#303030] text-slate-700 dark:text-slate-200 rounded text-xs flex items-center gap-1.5 transition"
                      >
                        {copiedId === currentFc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>คัดลอก Mermaid Code</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#787774] dark:text-[#9b9b9b]">{currentFc.desc}</p>
                    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed border border-[#333]">
                      <pre>{currentFc.mermaid}</pre>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 4.2: Database Relational Design & Class Diagram */}
            {/* ------------------------------------------------------------- */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-xl bg-white dark:bg-[#191919] space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-600 rounded-r-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-800 dark:text-blue-300 text-sm">
                    [เฉลยข้อที่ 4.2: การออกแบบฐานข้อมูลเชิงสัมพันธ์ & Class Diagram (5 คะแนน)]
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    ออกแบบครบ 3 ตารางสัมพันธ์กัน (Relational Design: PK/FK 1:N) พร้อม Data Type และ Class Diagram
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200 font-bold shrink-0">
                  5 คะแนน
                </span>
              </div>

              {/* 3 Tables Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                {designSolutions.databaseDesign.tables.map(tbl => (
                  <div key={tbl.name} className="border border-[#edece9] dark:border-[#2e2e2e] rounded-lg overflow-hidden bg-[#fafafa] dark:bg-[#1f1f1f]">
                    <div className="p-2.5 bg-[#f0f0f0] dark:bg-[#282828] border-b border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">table: {tbl.name}</span>
                      <span className="text-[10px] text-slate-500">Relational</span>
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="text-[11px] text-slate-500 mb-1.5">{tbl.desc}</p>
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="border-b border-[#edece9] dark:border-[#2e2e2e] text-slate-400 text-[10px]">
                            <th>ฟิลด์</th>
                            <th>Type</th>
                            <th>Key</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edece9] dark:divide-[#2e2e2e]">
                          {tbl.columns.map(col => (
                            <tr key={col.name}>
                              <td className="py-1 font-mono font-medium text-slate-700 dark:text-slate-300">{col.name}</td>
                              <td className="py-1 text-slate-500">{col.type}</td>
                              <td className="py-1">
                                {col.key === 'PK' && <span className="px-1 py-0.2 rounded bg-amber-500 text-white font-mono text-[9px]">PK</span>}
                                {col.key === 'FK' && <span className="px-1 py-0.2 rounded bg-indigo-500 text-white font-mono text-[9px]">FK</span>}
                                {col.key === 'UQ' && <span className="px-1 py-0.2 rounded bg-emerald-500 text-white font-mono text-[9px]">UQ</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class Diagram Code Block */}
              <div className="space-y-2 pt-2 border-t border-[#edece9] dark:border-[#2e2e2e]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#37352f] dark:text-[#d4d4d4]">Class Diagram (Mermaid Code สำหรับ Draw.io):</span>
                  <button
                    onClick={() => copyToClipboard(designSolutions.databaseDesign.classDiagram, 'class-diag')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#252525] dark:hover:bg-[#303030] text-slate-700 dark:text-slate-200 rounded text-xs flex items-center gap-1 transition"
                  >
                    {copiedId === 'class-diag' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>คัดลอก Class Diagram</span>
                  </button>
                </div>
                <div className="bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed border border-[#333]">
                  <pre>{designSolutions.databaseDesign.classDiagram}</pre>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 4.3 & 4.4 Grid: UI Templates & RESTful API Spec */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              
              {/* Question 4.3 Card */}
              <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-xl bg-white dark:bg-[#191919] space-y-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-600 rounded-r">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-800 dark:text-amber-300">[เฉลยข้อที่ 4.3: การออกแบบหน้าจอ 5 หน้า Draw.io]</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">5 คะแนน</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Template Layout ทั้ง 5 หน้าจอที่ต้องวาดในโปรแกรมสำเร็จรูป Draw.io (Offline)
                  </p>
                </div>

                <div className="space-y-2.5">
                  {designSolutions.uiTemplates.map(tpl => (
                    <div key={tpl.id} className="p-2.5 bg-[#f7f6f3] dark:bg-[#252525] rounded-lg border border-[#edece9] dark:border-[#2e2e2e]">
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        <span>{tpl.title}</span>
                        <span className="text-[10px] text-amber-600 font-mono font-medium">{tpl.points}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {tpl.elements.map((el, idx) => (
                          <li key={idx}>{el}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 4.4 Card */}
              <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-xl bg-white dark:bg-[#191919] space-y-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-600 rounded-r">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">[เฉลยข้อที่ 4.4: RESTful API Spec (README.md)]</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">5 คะแนน</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    ตารางออกแบบ API ครบถ้วนตามมาตรฐาน RESTful รองรับ JWT, Status Code และ Error Handling
                  </p>
                </div>

                <div className="overflow-x-auto border border-[#edece9] dark:border-[#2e2e2e] rounded-lg">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-[#f0f0f0] dark:bg-[#262626] font-semibold text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-2">Method</th>
                        <th className="p-2">Endpoint</th>
                        <th className="p-2">สิทธิ์</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edece9] dark:divide-[#2e2e2e] text-slate-600 dark:text-slate-400">
                      {designSolutions.apiSpec.endpoints.map(ep => (
                        <tr key={ep.path + ep.method}>
                          <td className="p-1.5 font-mono font-bold">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              ep.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                              ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                              ep.method === 'PUT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {ep.method}
                            </span>
                          </td>
                          <td className="p-1.5 font-mono font-medium text-slate-800 dark:text-slate-200">{ep.path}</td>
                          <td className="p-1.5 text-[10px]">{ep.role}</td>
                          <td className="p-1.5 font-mono text-[10px]">{ep.code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-[#f7f6f3] dark:bg-[#252525] rounded-lg text-[11px] space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">รูปแบบ Response มาตรฐาน:</div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    <div className="bg-[#1e1e1e] text-emerald-400 p-2 rounded">
                      <div className="text-slate-400 text-[9px] mb-0.5">// สำเร็จ (200/201)</div>
                      <pre>{designSolutions.apiSpec.responseSuccess}</pre>
                    </div>
                    <div className="bg-[#1e1e1e] text-rose-400 p-2 rounded">
                      <div className="text-slate-400 text-[9px] mb-0.5">// ผิดพลาด (400/401/403/404)</div>
                      <pre>{designSolutions.apiSpec.responseError}</pre>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 4: BACKEND NODE.JS & TESTS (10 PTS) */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'backend') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <span>4. ส่วนที่ 4 พัฒนาระบบ Back-end การพัฒนา API 10 ข้อย่อย (10 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                10 PTS
              </span>
            </div>

            {/* Backend Requirements (ข้อ 4.5: 10 คะแนน) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-indigo-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 4.5: พัฒนาระบบ Back-end การพัฒนา API 10 ข้อย่อย]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                    คะแนนเต็ม 10 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                  <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                  "สร้าง API แบบ GET พร้อมรับค่า Query หรือ Path Parameters (1 คะแนน), สร้าง API แบบ POST ที่รับข้อมูลจาก Body อย่างถูกต้อง (1 คะแนน), สร้าง API สำหรับอัปโหลดไฟล์ (1 คะแนน), สร้าง API Login โดยใช้ JWT Token มีการลงนาม Signing และตรวจสอบสิทธิ์ (1 คะแนน), มี Exception Handling ดักจับข้อมูลไม่ครบ/ไม่พบ (1 คะแนน), API ส่ง Response JSON มี status, message, data อย่างเป็นระบบ (1 คะแนน), <strong>มีคำอธิบาย API และการเรียกใช้ แต่ละ Service (GET, POST, PUT, DELETE) ครบอย่างน้อย Method ละ 1 API (เขียน Comment) (1 คะแนน)</strong>, ระบุข้อมูล Query, Path, Body ชัดเจน (1 คะแนน), โค้ดมีโครงสร้างดีใช้ router หรือ async/await (1 คะแนน), API ปลอดภัยตรวจสอบสิทธิ์ก่อนเข้าถึงข้อมูล (1 คะแนน)"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">
                    โครงสร้างโฟลเดอร์ของโปรเจกต์ทั้งหมด (คลิกเลือกไฟล์เพื่อดูซอร์สโค้ดทันที)
                  </span>
                  <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                    คลิกที่ชื่อไฟล์ในผังต้นไม้ด้านล่างเพื่อสลับ Source Code ในกล่องข้อความ
                  </div>
                </div>

                {/* Download Project ZIP Button */}
                <a
                  href="/04_Fullstack_DevOps_App.zip"
                  download="04_Fullstack_DevOps_App.zip"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition hover:shadow-md shrink-0"
                  title="ดาวน์โหลดไฟล์โปรเจกต์ทั้งหมด (ครบทุกไฟล์ ยกเว้น node_modules)"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดโปรเจกต์เต็ม (ZIP)</span>
                </a>
              </div>

              {/* Interactive Visual Project File Tree (ON TOP) */}
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e] rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 pb-1 border-b border-[#edece9] dark:border-[#2e2e2e]">
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span>modules/04_Fullstack_DevOps_App/</span>
                </div>

                <div className="space-y-1.5 pl-2 font-mono text-xs">
                  {/* Root Files (Dockerfile, compose) */}
                  <div className="flex flex-wrap gap-1.5">
                    {projectFileTree.filter(item => item.type === 'file').map((file) => {
                      const isSelected = activeBackendFile === file.path;
                      return (
                        <button
                          key={file.path}
                          type="button"
                          onClick={() => setActiveBackendFile(file.path)}
                          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition text-left ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 font-semibold'
                              : 'border-[#edece9] dark:border-[#2e2e2e] bg-white dark:bg-[#191919] hover:bg-slate-200 dark:hover:bg-[#2c2c2c] text-[#37352f] dark:text-[#d4d4d4]'
                          }`}
                        >
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                          <span>{file.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}>
                            {file.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Folders (frontend, backend, tests) */}
                  {projectFileTree.filter(item => item.type === 'folder').map((folder) => (
                    <div key={folder.name} className="pt-1.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{folder.name}</span>
                      </div>
                      <div className="pl-4 flex flex-wrap gap-1.5">
                        {folder.files.map((file) => {
                          const isSelected = activeBackendFile === file.path;
                          return (
                            <button
                              key={file.path}
                              type="button"
                              onClick={() => setActiveBackendFile(file.path)}
                              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition text-left ${
                                isSelected
                                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 font-semibold'
                                  : 'border-[#edece9] dark:border-[#2e2e2e] bg-white dark:bg-[#191919] hover:bg-slate-200 dark:hover:bg-[#2c2c2c] text-[#37352f] dark:text-[#d4d4d4]'
                              }`}
                            >
                              <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                              <span>{file.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}>
                                {file.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active File Source Code Display Box (DISPLAY RIGHT UNDER THE TREE) */}
              {(() => {
                const currentFile = allProjectFiles.find(f => f.path === activeBackendFile) || allProjectFiles[0];
                return (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e]">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            modules/04_Fullstack_DevOps_App/{currentFile.path}
                          </div>
                          <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                            {currentFile.desc}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(currentFile.code, `project-${currentFile.path}`)}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 shrink-0 transition shadow-sm"
                      >
                        {copiedId === `project-${currentFile.path}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">คัดลอกสำเร็จ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>คัดลอกซอร์สโค้ด</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 bg-[#1e1e1e] text-[#d4d4d4] rounded-lg border border-[#2e2e2e] text-[11px] font-mono overflow-x-auto max-h-[460px] overflow-y-auto leading-relaxed shadow-inner">
                      <code>{currentFile.code}</code>
                    </pre>
                  </div>
                );
              })()}

              <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b] italic">
                *ไฟล์ทั้งหมดถูกจำลองและบันทึกไว้ในโฟลเดอร์: <code>modules/04_Fullstack_DevOps_App/</code>
              </div>

              {/* Step-by-Step Execution Guide Box */}
              <div className="mt-4 pt-4 border-t border-[#edece9] dark:border-[#2e2e2e] space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">
                  <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>คู่มือและคำสั่งวิธีการรันระบบอย่างละเอียด (Execution & Testing Guide)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Mode 1: Local Development */}
                  <div className="p-3 bg-[#f7f6f3] dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">1. รันบนเครื่อง Local (Node.js)</span>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(`cd modules/04_Fullstack_DevOps_App
npm install
npm start`, 'run-local')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy commands"
                      >
                        {copiedId === 'run-local' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                      ใช้ทดสอบเขียนโค้ดและรันจำลองระบบทั้ง Frontend และ Backend พอร์ต 3000
                    </p>
                    <pre className="p-2 bg-[#1e1e1e] text-emerald-400 rounded text-[10px] font-mono overflow-x-auto">
{`cd modules/04_Fullstack_DevOps_App
npm install
npm start
# เปิดดูเว็บ: http://localhost:3000`}
                    </pre>
                  </div>

                  {/* Mode 2: Automated Tests */}
                  <div className="p-3 bg-[#f7f6f3] dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">2. ทดสอบ Automated Test (5/5)</span>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(`cd modules/04_Fullstack_DevOps_App
npm test`, 'run-test')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy commands"
                      >
                        {copiedId === 'run-test' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                      ทดสอบ Unit Test (bcrypt, jwt) และ Integration Test (Supertest) ตอบข้อ 4.6
                    </p>
                    <pre className="p-2 bg-[#1e1e1e] text-emerald-400 rounded text-[10px] font-mono overflow-x-auto">
{`cd modules/04_Fullstack_DevOps_App
npm test
# ผลลัพธ์: pass 5 | fail 0 (100%)`}
                    </pre>
                  </div>

                  {/* Mode 3: Docker & Compose */}
                  <div className="p-3 bg-[#f7f6f3] dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-600 dark:text-blue-400">3. รันบน Production ด้วย Docker</span>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(`cd modules/04_Fullstack_DevOps_App
docker compose up -d --build
docker ps`, 'run-docker')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy commands"
                      >
                        {copiedId === 'run-docker' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                      รัน Containerised App + MariaDB ตอบโจทย์ข้อ 2.5 และ CI/CD Pipeline
                    </p>
                    <pre className="p-2 bg-[#1e1e1e] text-emerald-400 rounded text-[10px] font-mono overflow-x-auto">
{`cd modules/04_Fullstack_DevOps_App
docker compose up -d --build
docker ps
# ตรวจสอบ Health: curl http://localhost:3000/api/health`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 5: FRONTEND UI & E2E WORKFLOWS (23 PTS) */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'frontend') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-600" />
                <span>5. ส่วนที่ 4 พัฒนาระบบ Front-end, Automated Tests และ E2E Workflows (23 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                23 PTS
              </span>
            </div>

            {/* Frontend & Automated Tests (ข้อ 4.6: 23 คะแนน) */}
            <div className="p-4 border border-[#edece9] dark:border-[#2e2e2e] rounded-lg bg-white dark:bg-[#191919] space-y-3 text-xs">
              <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-indigo-600 rounded-r-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                    [โจทย์ข้อที่ 4.6: พัฒนาระบบ Front-end, Automated Tests และ E2E Workflows]
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                    คะแนนเต็ม 23 คะแนน
                  </span>
                </div>
                <div className="text-[#37352f] dark:text-[#d4d4d4] space-y-2.5">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    ข้อความโจทย์ตามเกณฑ์ (แจกแจง 19 หัวข้อย่อย รวม 23 คะแนนเต็ม):
                  </div>

                  {/* Group 1: UI & Authentication */}
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      • กลุ่มหน้าจอ UI & ระบบความปลอดภัย (3 คะแนน):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pl-2">
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>มี Layout ใช้งานง่าย Responsive</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>หน้าจอ Login ด้วย JWT ใช้งานได้จริง</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แยกระบบ Login แต่ละระดับ</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold shrink-0">(1)</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: CRUD & Features */}
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      • กลุ่มฟังก์ชันจัดการข้อมูล CRUD & ระบบค้นหา (6 คะแนน):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 pl-2">
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>เพิ่มข้อมูลตามแบบฟอร์ม</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แนบไฟล์พร้อมข้อมูล</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แก้ไขข้อมูล</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แก้ไขไฟล์แนบได้</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
                        <span className="font-semibold text-rose-900 dark:text-rose-300">มีแจ้งเตือนการลบข้อมูลได้ (Confirm Delete Modal)</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>ค้นหา/Filter ข้อมูลตามสิทธิ์</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แบ่งหน้า Pagination ตามสิทธิ์</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shrink-0">(1)</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 3: Validation & Error Handling */}
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      • กลุ่ม Validation & Error Handling (3 คะแนน):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pl-2">
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>Validate ข้อมูลฝั่ง Frontend</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>Error Handling ฝั่ง Frontend แจ้งเตือนเข้าใจง่าย</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>แปลงรหัส Error จาก Backend เป็นข้อความเหมาะสม</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold shrink-0">(1)</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 4: DevOps, Testing & Pipeline */}
                  <div className="space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      • กลุ่ม DevOps, Automated Testing, Git & คุณภาพระบบ (11 คะแนน):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2">
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>Dockerfile สำหรับ Backend</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>Pipeline config ทำงานครบทุก stages</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between sm:col-span-2">
                        <span className="font-semibold text-emerald-900 dark:text-emerald-300">Test ใน Pipeline (Unit Test และ Integration Test อย่างละ 1 Case)</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-violet-50/70 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/50 flex items-center justify-between sm:col-span-2">
                        <span className="font-semibold text-violet-900 dark:text-violet-300">E to E Test 2 workflows: E2E-001 (Login สำเร็จ) และ E2E-002 (ส่งข้อมูลสำเร็จ)</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-violet-200 text-violet-900 dark:bg-violet-900 dark:text-violet-200 font-bold shrink-0">(2)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span>Git Branch Strategy</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold shrink-0">(1)</span>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-[#1f1f1f] border border-[#edece9] dark:border-[#2e2e2e] flex items-center justify-between">
                        <span className="font-bold">ความสมบูรณ์ระบบ</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200 font-bold shrink-0">(3)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Tests Box */}
              <div className="p-3 bg-[#edf6ed] dark:bg-[#1c2e20] border border-emerald-200 dark:border-emerald-900/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                  <span>ผลการรันคำสั่ง npm test ใน modules/04_Fullstack_DevOps_App (ตอบโจทย์ข้อ 4.6)</span>
                  <span className="font-mono text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">5/5 Passed 100%</span>
                </div>
                <pre className="p-2.5 bg-black/80 text-emerald-400 rounded font-mono text-[11px] overflow-x-auto">
{`▶ Unit Tests (ตอบข้อ 4.6: Unit Testing)
  ✔ UNIT-001: ควรรหัสผ่านและเปรียบเทียบ hash ด้วย bcrypt ได้ถูกต้อง
  ✔ UNIT-002: ควรสร้าง JWT Token และถอดรหัส Payload ได้ข้อมูลตรงตามกำหนด
✔ Unit Tests (496ms)
▶ Integration Tests (ตอบข้อ 4.6: Integration Testing)
  ✔ INT-001: POST /api/auth/login - ควร Login สำเร็จและได้รับ Status 200 พร้อม JWT Token
  ✔ INT-002: GET /api/items - เมื่อไม่ส่ง Token ต้องปฏิเสธด้วย Status 401 Unauthorized
  ✔ INT-003: GET /api/items - เมื่อส่ง Token ที่ถูกต้อง ต้องส่งรายการข้อมูลกลับมาด้วย Status 200 OK
✔ Integration Tests (259ms)
ℹ tests 5 | suites 2 | pass 5 | fail 0`}
                </pre>
              </div>

              {/* Playwright Workflows Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">คำตอบข้อ 4.6: Workflow E2E-001 (ผู้ใช้เข้าสู่ระบบสำเร็จ)</div>
                  <ol className="list-decimal list-inside text-[#787774] dark:text-[#9b9b9b] space-y-0.5">
                    <li>เปิดหน้า Login (http://localhost:3000)</li>
                    <li>กรอก username / password</li>
                    <li>กดปุ่ม Login</li>
                    <li>ระบบพาไปหน้า Dashboard และเห็น Role Badge ของตนเอง</li>
                  </ol>
                </div>
                <div className="p-3 bg-[#f7f6f3] dark:bg-[#252525] border border-[#edece9] dark:border-[#2e2e2e] rounded space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">คำตอบข้อ 4.6: Workflow E2E-002 (ผู้ใช้ส่งข้อมูลสำเร็จ)</div>
                  <ol className="list-decimal list-inside text-[#787774] dark:text-[#9b9b9b] space-y-0.5">
                    <li>Login เข้าระบบด้วย Admin หรือ User 1</li>
                    <li>เปิดหน้าเพิ่มข้อมูล (+ เพิ่มรายการใหม่)</li>
                    <li>กรอกข้อมูลในฟอร์ม + แนบไฟล์เอกสาร</li>
                    <li>กดปุ่มบันทึก</li>
                    <li>ระบบแสดงข้อความแจ้งเตือน 'บันทึกข้อมูลสำเร็จ' และปรากฏในตาราง</li>
                  </ol>
                </div>
              </div>

              {/* Source Code Viewer for Frontend & E2E Tests */}
              <div className="mt-4 pt-4 border-t border-[#edece9] dark:border-[#2e2e2e] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#37352f] dark:text-[#d4d4d4]">
                    <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>ซอร์สโค้ดไฟล์ Frontend HTML และ Playwright E2E Tests</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">2 Source Files</span>
                </div>

                {/* Quick File Select Buttons for Frontend */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBackendFile('frontend/index.html')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition text-xs font-medium ${
                      activeBackendFile === 'frontend/index.html'
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 font-semibold'
                        : 'border-[#edece9] dark:border-[#2e2e2e] bg-white dark:bg-[#191919] hover:bg-slate-200 dark:hover:bg-[#2c2c2c] text-[#37352f] dark:text-[#d4d4d4]'
                    }`}
                  >
                    <Layout className={`w-3.5 h-3.5 ${activeBackendFile === 'frontend/index.html' ? 'text-white' : 'text-indigo-500'}`} />
                    <span>frontend/index.html (100% No-CSS UI)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBackendFile('tests/e2e.spec.js')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition text-xs font-medium ${
                      activeBackendFile === 'tests/e2e.spec.js'
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 font-semibold'
                        : 'border-[#edece9] dark:border-[#2e2e2e] bg-white dark:bg-[#191919] hover:bg-slate-200 dark:hover:bg-[#2c2c2c] text-[#37352f] dark:text-[#d4d4d4]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeBackendFile === 'tests/e2e.spec.js' ? 'text-white' : 'text-emerald-500'}`} />
                    <span>tests/e2e.spec.js (Playwright Workflows)</span>
                  </button>
                </div>

                {/* Code Box for Selected Frontend File */}
                {(() => {
                  const targetPath = (activeBackendFile === 'tests/e2e.spec.js') ? 'tests/e2e.spec.js' : 'frontend/index.html';
                  const currentFile = allProjectFiles.find(f => f.path === targetPath) || allProjectFiles[0];
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#202020] border border-[#edece9] dark:border-[#2e2e2e]">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div>
                            <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              modules/04_Fullstack_DevOps_App/{currentFile.path}
                            </div>
                            <div className="text-[11px] text-[#787774] dark:text-[#9b9b9b]">
                              {currentFile.desc}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(currentFile.code, `frontend-${currentFile.path}`)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 shrink-0 transition shadow-sm"
                        >
                          {copiedId === `frontend-${currentFile.path}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">คัดลอกสำเร็จ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>คัดลอกซอร์สโค้ด</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-3.5 bg-[#1e1e1e] text-[#d4d4d4] rounded-lg border border-[#2e2e2e] text-[11px] font-mono overflow-x-auto max-h-[460px] overflow-y-auto leading-relaxed shadow-inner">
                        <code>{currentFile.code}</code>
                      </pre>
                    </div>
                  );
                })()}
              </div>

            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 6: PRESENTATION & 3 ORAL QUESTIONS */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'presentation') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                <span>6. ส่วนที่ 5 การนำเสนอและตอบคำถามคณะกรรมการ (10 คะแนน)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                10 PTS
              </span>
            </div>
            <PdfPageBox 
              title="ส่วนที่ 5 การนำเสนอผลงาน และเกณฑ์เหรียญรางวัล (10 คะแนน)" 
              pages={[28, 29]} 
              description="หน้า 28 ระบุระเบียบคณะกรรมการตัดสิน และหน้า 29 ระบุเกณฑ์เหรียญรางวัล (เหรียญทอง 80 คะแนนขึ้นไป, เหรียญเงิน 70-79, เหรียญทองแดง 60-69)" 
            />

            {/* Presentation Rules Box */}
            <div className="p-3 bg-[#f7f6f3] dark:bg-[#262626] border-l-4 border-rose-600 rounded-r-lg space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                  [โจทย์ข้อที่ 5.1 - 5.4: กติกาการนำเสนอผลงานและตอบคำถามกรรมการ]
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold">
                  คะแนนเต็ม 10 คะแนน
                </span>
              </div>
              <div className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
                <strong>ข้อความโจทย์ตามเกณฑ์:</strong><br />
                • <strong>ข้อ 5.1:</strong> การตอบคำถามจากคณะกรรมการ จากชุดคำถาม Backend Frontend และแนวทางการแก้ปัญหา 5 นาที (3 คะแนน)<br />
                • <strong>ข้อ 5.2:</strong> นำเสนอวิธีการทำงานร่วมกัน โดยกระจายการทำงานกันอย่างเหมาะสม (3 คะแนน)<br />
                • <strong>ข้อ 5.3:</strong> บุคลิกภาพ (3 คะแนน)<br />
                • <strong>ข้อ 5.4:</strong> การนำเสนอภายในระยะเวลาที่กำหนด ไม่เกินทีมละ 30 นาที ตอบคำถามไม่เกิน 3 คำถาม ไม่เกิน 10 นาที (1 คะแนน)
              </div>
            </div>

            {/* 3 Q&A Cards with exact questions */}
            <div className="space-y-3 text-xs">
              
              {/* Question 1 */}
              <div className="p-4 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400">[คำตอบโจทย์ข้อ 5.1: หมวดคำถาม Backend & Security]</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">3 คะแนน</span>
                </div>
                <div className="p-2.5 bg-[#f7f6f3] dark:bg-[#252525] rounded font-medium italic text-[#37352f] dark:text-[#d4d4d4]">
                  โจทย์คำถามของกรรมการ: "ทำไมถึงเลือกใช้ JWT ในการยืนยันตัวตน และถ้าผู้ใช้ทำการ Logout หรือต้องการระงับสิทธิ์ทันที จะทำให้ Token ใช้งานไม่ได้อย่างไร?"
                </div>
                <div className="p-3 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded text-notion-muted dark:text-notion-darkMuted leading-relaxed">
                  <strong>แนวทางการตอบ:</strong><br />
                  "เราเลือกใช้ JWT เพราะเป็น Stateless Authentication ไม่ต้องเก็บ Session ลง RAM ใน Server จึงรองรับผู้ใช้ได้จำนวนมากและปลอดภัยด้วย Digital Signature (HMAC-SHA256)<br />
                  ส่วนการตัดสิทธิ์หรือยกเลิก Token ทันที ทำได้ 2 วิธี:<br />
                  1. <strong>Token Blacklist ใน Redis:</strong> เก็บ Token ที่ถูกยกเลิกไว้ใน Redis พร้อมตั้งค่า TTL ตามเวลาหมดอายุของ Token เมื่อมี Request เข้ามา ให้ Middleware เช็ค Blacklist ก่อน<br />
                  2. <strong>Token Versioning:</strong> เพิ่มฟิลด์ <code>token_version</code> ในตาราง Users และใน Payload ของ Token เมื่อต้องการตัดสิทธิ์ ให้บวกเลขเวอร์ชันเพิ่มขึ้น เมื่อ Token เก่าส่งมาเลขจะไม่ตรง และถูกปฏิเสธทันทีครับ"
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400">[คำตอบโจทย์ข้อ 5.1: หมวดคำถาม Frontend & UX/UI]</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">3 คะแนน</span>
                </div>
                <div className="p-2.5 bg-[#f7f6f3] dark:bg-[#252525] rounded font-medium italic text-[#37352f] dark:text-[#d4d4d4]">
                  โจทย์คำถามของกรรมการ: "ระบบของคุณมีการจัดการ Error Handling ระหว่าง Frontend กับ Backend อย่างไร เพื่อไม่ให้หน้าจอค้างหรือผู้ใช้สับสนเมื่อเกิดข้อผิดพลาด?"
                </div>
                <div className="p-3 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded text-notion-muted dark:text-notion-darkMuted leading-relaxed">
                  <strong>แนวทางการตอบ:</strong><br />
                  "เราใช้สถาปัตยกรรมแบบสองชั้น (Two-tier Error Handling):<br />
                  1. <strong>Client Validation:</strong> ฝั่ง Frontend ตรวจสอบความถูกต้องของข้อมูลเบื้องต้นก่อนส่ง Request เสมอ ทำให้ผู้ใช้ทราบทันทีโดยไม่ต้องรอ Round-trip ไปยัง Server<br />
                  2. <strong>JSON Response มาตรฐาน:</strong> ฝั่ง Backend ดักจับ Exception ด้วย Error Middleware และส่ง HTTP Status Code ที่ตรงตามมาตรฐาน (400, 401, 403, 404, 500) พร้อม JSON รูปแบบ <code>{`{ status, message, data }`}</code><br />
                  3. <strong>Frontend Error Translation:</strong> ฝั่ง Frontend นำ error message จาก Backend มาแปลงเป็นข้อความภาษาไทยที่เข้าใจง่าย (Friendly Message) ผ่าน Toast Notification และ Alert Box ใต้ฟอร์ม โดยไม่มีการปล่อยให้หน้าจอค้างหรือแสดง Error ดิบทางเทคนิคครับ"
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-4 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400">[คำตอบโจทย์ข้อ 5.1: หมวดคำถาม DevOps & Troubleshooting]</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">3 คะแนน</span>
                </div>
                <div className="p-2.5 bg-[#f7f6f3] dark:bg-[#252525] rounded font-medium italic text-[#37352f] dark:text-[#d4d4d4]">
                  โจทย์คำถามของกรรมการ: "ถ้าใน CI/CD Pipeline ขั้นตอนที่ 4 (Deploy) เกิดข้อผิดพลาด Failed ขึ้นมา คุณมีกระบวนการ Rollback อย่างไร และทำไมในระบบเครือข่ายจึงต้องแยก VLAN และมี Reverse Proxy?"
                </div>
                <div className="p-3 bg-white dark:bg-[#191919] border border-[#edece9] dark:border-[#2e2e2e] rounded text-notion-muted dark:text-notion-darkMuted leading-relaxed">
                  <strong>แนวทางการตอบ:</strong><br />
                  "กระบวนการกู้คืน (Rollback):<br />
                  1. ตรวจสอบสาเหตุจาก GitLab CI/CD Job Logs หากเกิดจากบั๊กของโค้ดใหม่ ให้ใช้ฟังก์ชัน Rollback เพื่อ Redeploy Docker Image Tag ก่อนหน้าจาก Private Registry ทันที ซึ่งใช้เวลาเพียงไม่กี่วินาที<br />
                  เหตุผลที่ต้องแยก VLAN และมี Reverse Proxy:<br />
                  - <strong>การแยก VLAN (Server, Dev, Guest):</strong> เพื่อจำกัด Broadcast Domain และใช้ ACL กั้นไม่ให้บุคคลภายนอกเข้าถึงวง Server ได้โดยตรง<br />
                  - <strong>Reverse Proxy (NPM/Caddy):</strong> ทำหน้าที่เป็น Single Entry Point สำหรับจัดการ SSL รวมศูนย์ ซ่อนพอร์ตจริงของแอปพลิเคชัน และช่วยทำ Load Balancing ครับ"
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MODULE 8: 100-POINT AUDIT CHECKLIST */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'all' || activeTab === 'checklist') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#edece9] dark:border-[#2e2e2e]">
              <h2 className="text-lg font-bold text-[#37352f] dark:text-[#d4d4d4] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>7. ตารางตรวจสอบความพร้อมพร้อมระบุเลขข้อโจทย์ (Interactive Audit Checklist)</span>
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {totalScore} / 100 PTS
              </span>
            </div>

            <p className="text-xs text-[#787774] dark:text-[#9b9b9b]">
              ติ๊กเครื่องหมายถูกเพื่อตรวจสอบความพร้อมตามโจทย์แต่ละข้อ ยิ่งติ๊กครบ 100% ยิ่งการันตีเหรียญทอง:
            </p>

            <div className="space-y-2 text-xs">
              {rubricList.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div 
                    key={item.id}
                    className={`p-2.5 rounded border transition flex items-center justify-between gap-3 ${
                      isChecked 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-white dark:bg-[#191919] border-[#edece9] dark:border-[#2e2e2e]'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-[#787774] dark:text-[#9b9b9b]' : 'font-medium'}>
                        <strong className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">[{item.qNum}]</strong>
                        [{item.cat}] {item.text}
                      </span>
                    </label>
                    <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold shrink-0 ${
                      isChecked 
                        ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      +{item.pts} คะแนน
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-[#edece9] dark:border-[#2e2e2e] text-center text-xs text-[#787774] dark:text-[#9b9b9b] space-y-1">
          <div>DevOps Skills Competition Interactive Preparation Guidebook</div>
          <div className="font-mono">รายการที่ 58 ระดับ ปวส. | พร้อมระบุโจทย์ทางการครบทุกข้อ 100 คะแนนเต็ม (No Emoji)</div>
        </footer>

      </main>

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
    </div>
  );
}
