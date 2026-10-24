import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Network,
  Server,
  Code2,
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
  ChevronRight,
  ChevronDown,
  Clock,
  Award,
  Users,
  FileText,
  Download,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { sectionsMeta, examQuestionsAndSolutions } from './data/examQuestionsAndSolutions';
import MermaidViewer from './components/MermaidViewer';

export default function App() {
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedPdfImage, setSelectedPdfImage] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [showPdfPages, setShowPdfPages] = useState({});

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

  const toggleSolutionCollapse = (id) => {
    setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Score calculation
  const totalCompletedScore = useMemo(() => {
    return examQuestionsAndSolutions.reduce((sum, item) => {
      return sum + (checkedItems[item.id] ? item.pts : 0);
    }, 0);
  }, [checkedItems]);

  // Filter items based on activeSection & searchQuery
  const filteredItems = useMemo(() => {
    return examQuestionsAndSolutions.filter(item => {
      const matchSection = activeSection === 'all' || item.secId === activeSection;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchSection;

      const matchText = 
        item.qNum.toLowerCase().includes(q) ||
        item.questionText.toLowerCase().includes(q) ||
        (item.explanation && item.explanation.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.answerText && item.answerText.toLowerCase().includes(q));

      return matchSection && matchText;
    });
  }, [activeSection, searchQuery]);

  // Section icons helper
  const getSectionIcon = (secId) => {
    switch (secId) {
      case 'sec1': return <Network className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'sec2': return <Server className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'sec4': return <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'sec5': return <MessageSquare className="w-4 h-4 text-rose-500 shrink-0" />;
      default: return <Layers className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafaf9] dark:bg-[#121212] text-[#292524] dark:text-[#e7e5e4] transition-colors font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* --------------------------------------------------------------------- */}
      {/* MOBILE HEADER */}
      {/* --------------------------------------------------------------------- */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#18181b] border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="font-bold text-xs sm:text-sm tracking-tight">เฉลยข้อสอบ DevOps (58)</div>
            <div className="text-[10px] text-stone-500 font-mono">100 คะแนนเต็ม ตรงตาม PDF</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {totalCompletedScore.toFixed(2)}/100
          </span>
          <button 
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION */}
      {/* --------------------------------------------------------------------- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#18181b] border-r border-stone-200 dark:border-stone-800
        transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 flex flex-col shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              58
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900 dark:text-stone-100 leading-tight">เกณฑ์การแข่งขันรายการที่ 58</div>
              <div className="text-[10px] text-stone-500 font-medium">ทักษะ DevOps ปวส. (2569)</div>
            </div>
          </div>
          <button 
            type="button"
            onClick={toggleDarkMode}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>
        </div>

        {/* Score Progress Card */}
        <div className="p-3.5 m-3 rounded-xl bg-stone-50 dark:bg-[#202023] border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ความพร้อมของทีม
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {totalCompletedScore.toFixed(2)} / 100 PTS
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, totalCompletedScore)}%` }}
            />
          </div>
          <div className="text-[10px] text-stone-500 flex justify-between">
            <span>เกณฑ์เหรียญทอง: 80+ คะแนน</span>
            <span>{totalCompletedScore >= 80 ? 'ผ่านเกณฑ์ทอง' : `ขาดอีก ${(80 - totalCompletedScore).toFixed(1)}`}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input 
              type="text"
              placeholder="ค้นหาโจทย์, เลขข้อ, หรือคำสั่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-stone-100 dark:bg-[#242427] border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
            เลือกดูตามส่วนข้อสอบ (100 คะแนน)
          </div>

          <button
            type="button"
            onClick={() => { setActiveSection('all'); setSidebarOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
              activeSection === 'all'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500 shrink-0" />
              <span>แสดงทั้งหมดทุกข้อ</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
              100 PTS
            </span>
          </button>

          {sectionsMeta.map((sec) => {
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => { setActiveSection(sec.id); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  {getSectionIcon(sec.id)}
                  <span className="truncate">{sec.title.split(' ')[0]} {sec.title.split(' ')[1]}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold shrink-0">
                  {sec.totalPts} PTS
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>เวลาแข่ง 7 ชม. | เน็ต 2 ชม.</span>
          </div>
          <div className="text-[10px] text-stone-400">
            เอกสารทางการ PDF 29 หน้า (หน้า 9-18)
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-6 max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#18181b] border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span>เกณฑ์ กติกา การแข่งขันทักษะวิชาชีพ</span>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">รายการที่ 58</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                ระดับ ปวส. 100 คะแนนเต็ม
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              ทักษะเทคโนโลยีสารสนเทศด้านโปรแกรมและเครือข่ายด้วยกระบวนการ DevOps
            </h1>
            <a
              href="/devops-exam-project.zip"
              download="devops-exam-project.zip"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition shrink-0"
              title="ดาวน์โหลดซอร์สโค้ดโปรเจกต์เต็มพร้อมรันและส่งประกวด"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดโค้ดโปรเจกต์เต็ม (.ZIP)</span>
            </a>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            ระบบสรุป <strong>"คำถามตรงตามเกณฑ์ในเล่ม PDF ทางการเป๊ะๆ ทุกข้อ"</strong> พร้อมระบุจำนวนคะแนนเต็มของข้อนั้น และคำตอบวิธีปฏิบัติจริงที่ถูกต้องตามมาตรฐานอุตสาหกรรม เข้าใจง่าย เป็นลำดับขั้นตอน ไม่ซับซ้อน
          </p>

          {/* Test Users RBAC Banner */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1.5">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span></span>
              <span>บัญชีผู้ใช้งานสำหรับทดสอบระบบจริง (RBAC 3 ระดับ - รหัสผ่านทุกตัวคือ Password123!) :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-white dark:bg-[#1a1a1e] border border-amber-200/60 dark:border-amber-900/40">
                <span className="font-bold text-purple-700 dark:text-purple-300">1. Admin:</span> username: <b>admin</b>
                <div className="text-[10px] text-stone-500 font-sans mt-0.5">สิทธิ์เต็ม: ดู, เพิ่ม, แนบไฟล์, แก้ไข, ลบรายการ</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#1a1a1e] border border-amber-200/60 dark:border-amber-900/40">
                <span className="font-bold text-blue-700 dark:text-blue-300">2. User 1:</span> username: <b>officer1</b>
                <div className="text-[10px] text-stone-500 font-sans mt-0.5">เจ้าหน้าที่: ดู, เพิ่มข้อมูล, แนบไฟล์, แก้ไข (ห้ามลบ)</div>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#1a1a1e] border border-amber-200/60 dark:border-amber-900/40">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">3. User 2:</span> username: <b>user2</b>
                <div className="text-[10px] text-stone-500 font-sans mt-0.5">สมาชิก: ดูข้อมูล (Read-Only), ค้นหา, ดาวน์โหลดไฟล์แนบ</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#202023] border border-stone-200 dark:border-stone-800">
              <div className="text-[10px] text-stone-400">ส่วนที่ 1 Network</div>
              <div className="font-bold text-stone-800 dark:text-stone-200">13 คะแนน (Cisco L3)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#202023] border border-stone-200 dark:border-stone-800">
              <div className="text-[10px] text-stone-400">ส่วนที่ 2 Server</div>
              <div className="font-bold text-stone-800 dark:text-stone-200">24 คะแนน (Linux+CI/CD)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#202023] border border-stone-200 dark:border-stone-800">
              <div className="text-[10px] text-stone-400">ส่วนที่ 4 Software</div>
              <div className="font-bold text-stone-800 dark:text-stone-200">53 คะแนน (Full-Stack)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#202023] border border-stone-200 dark:border-stone-800">
              <div className="text-[10px] text-stone-400">ส่วนที่ 5 Presentation</div>
              <div className="font-bold text-stone-800 dark:text-stone-200">10 คะแนน (ตอบ 3 ข้อ)</div>
            </div>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'bg-white dark:bg-[#1c1c1f] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            ทั้งหมด (4 ส่วน รวม 100 คะแนน)
          </button>

          {sectionsMeta.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeSection === sec.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#1c1c1f] text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
              }`}
            >
              <span>{sec.title.split(' ')[0]} {sec.title.split(' ')[1]}</span>
              <span className="opacity-80 text-[10px] font-mono">({sec.totalPts} คะแนน)</span>
            </button>
          ))}
        </div>

        {/* Search Results Summary (if searching) */}
        {searchQuery && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
            <span>ผลการค้นหาคำว่า <strong>"{searchQuery}"</strong> พบทั้งหมด {filteredItems.length} ข้อ</span>
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* LIST OF EXAM QUESTIONS & SOLUTIONS (ORDERED ONE BY ONE) */}
        {/* --------------------------------------------------------------------- */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const isChecked = !!checkedItems[item.id];
            const isSolutionOpen = expandedSolutions[item.id] !== false; // Default expanded for easy reading

            return (
              <article 
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-[#18181b] overflow-hidden shadow-xs ${
                  isChecked 
                    ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-200 dark:ring-emerald-900/40' 
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* 1. QUESTION HEADER (คำถามตรงกับใน PDF เปะๆ + จำนวนคะแนน) */}
                <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-[#1c1c20]/50 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                        {item.qNum}
                      </span>
                      <span className="text-[11px] font-mono font-medium text-stone-500 dark:text-stone-400">
                        PDF หน้า {item.pdfPage}
                      </span>
                      {item.note && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {item.note}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Score Badge */}
                      <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        +{item.pts} คะแนน
                      </span>

                      {/* Ready Checkbox Button */}
                      <button
                        type="button"
                        onClick={() => toggleCheck(item.id)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                            : 'bg-white dark:bg-[#202024] border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                        }`}
                        title="ติ๊กเครื่องหมายเมื่อทำข้อนี้เสร็จสิ้น"
                      >
                        {isChecked ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>ผ่านแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span>เช็คข้อนี้</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Exact Question Text directly from PDF */}
                  <div className="pt-1">
                    <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      ข้อความคำถามตามเกณฑ์ทางการ:
                    </div>
                    <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 whitespace-pre-line leading-snug">
                      {item.questionText}
                    </div>
                  </div>
                </div>

                {/* 2. ANSWER SECTION (คำตอบวิธีที่ถูกต้องและที่เขาทำกัน ไม่เว่อร์) */}
                <div className="p-4 sm:p-5 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
                      <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>คำตอบและวิธีปฏิบัติ:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Copy Button if item has code */}
                      {item.code && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.code, item.id)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-medium flex items-center gap-1.5 transition"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{item.solutionType === 'mermaid' ? 'คัดลอกโค้ดผังงาน' : 'คัดลอกคำสั่ง'}</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* PDF Original Page Scan Viewer Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedPdfImage({
                          src: `/pdf_pages/page_${item.pdfPage}.png`,
                          title: `หน้า ${item.pdfPage} - ข้อ ${item.qNum} จาก PDF ทางการ`
                        })}
                        className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-[11px] flex items-center gap-1 transition"
                        title="ดูภาพสแกน PDF ต้นฉบับหน้านี้"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                        <span>เปิดภาพ PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Explanation summary */}
                  {item.explanation && (
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs sm:text-[13px]">
                      {item.explanation}
                    </p>
                  )}

                  {/* Render based on Solution Type */}
                  
                  {/* TYPE: FLOWCHART (REAL INTERACTIVE SVG DIAGRAM) */}
                  {item.solutionType === 'mermaid' && (
                    <div className="space-y-3">
                      {/* Real Flowchart Diagram Display */}
                      <MermaidViewer chart={item.code} id={item.id} />

                      {/* Mermaid Source Code (Collapsible) */}
                      <details className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#1a1a20] overflow-hidden text-xs">
                        <summary className="px-3.5 py-2 font-mono text-[11px] text-stone-600 dark:text-stone-300 cursor-pointer select-none hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between">
                          <span>ดู Mermaid Code / นำไป Import ใส่ Draw.io</span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400">คลิกเพื่อดูโค้ด</span>
                        </summary>
                        <pre className="p-3 bg-[#1e1e1e] text-stone-200 font-mono text-[11px] overflow-x-auto leading-relaxed border-t border-stone-700">
                          <code>{item.code}</code>
                        </pre>
                      </details>
                    </div>
                  )}

                  {/* TYPE: CODE / SCRIPT (NON-MERMAID) */}
                  {item.code && item.solutionType !== 'mermaid' && (
                    <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-[#1e1e1e]">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] text-stone-400 font-mono text-[10px] border-b border-stone-700">
                        <span>{item.lang ? item.lang.toUpperCase() : 'CODE'}</span>
                        <span>{item.verify ? `ตรวจสอบ: ${item.verify}` : 'คำสั่งพร้อมใช้งาน'}</span>
                      </div>
                      <pre className="p-3.5 text-stone-200 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
                        <code>{item.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* TYPE: STEP BY STEP LIST */}
                  {item.steps && (
                    <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f1f23] border border-stone-200 dark:border-stone-800 space-y-2">
                      <div className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                        ขั้นตอนการดำเนินการที่ถูกต้อง:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-stone-600 dark:text-stone-400 text-xs sm:text-[12px] leading-relaxed">
                        {item.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* TYPE: QUESTION & ANSWER (ORAL PRESENTATION) */}
                  {item.solutionType === 'qa' && (
                    <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2.5">
                      <div className="font-bold text-rose-800 dark:text-rose-300 text-xs">
                        ตัวอย่างคำถามที่คณะกรรมการถาม:
                      </div>
                      <div className="p-2.5 bg-white dark:bg-[#1a1a1c] border border-rose-100 dark:border-rose-900/50 rounded-lg font-medium text-stone-800 dark:text-stone-200 italic">
                        "{item.qSample}"
                      </div>
                      <div className="font-bold text-stone-800 dark:text-stone-200 text-xs pt-1">
                        คำตอบที่กระชับและถูกต้องตามหลักวิชาชีพ:
                      </div>
                      <div className="p-3 bg-white dark:bg-[#1a1a1c] border border-stone-200 dark:border-stone-800 rounded-lg text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                        {item.answerText}
                      </div>
                    </div>
                  )}

                  {/* Verification hint */}
                  {item.verify && (
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">วิธีตรวจผล:</span>
                      <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-stone-700 dark:text-stone-300 text-[10px]">
                        {item.verify}
                      </code>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-16 text-center text-xs text-stone-400 border-t border-stone-200 dark:border-stone-800 space-y-1.5">
          <div className="font-medium text-stone-600 dark:text-stone-400">
            ระบบเฉลยโจทย์การแข่งขัน DevOps ปวส. (รายการที่ 58) 100 คะแนนเต็ม
          </div>
          <div className="font-mono text-[10px]">
            โครงสร้างโจทย์และคำตอบเรียงตามลำดับเกณฑ์ทางการใน PDF ไม่รก เข้าใจง่าย รันได้จริง
          </div>
        </footer>

      </main>

      {/* --------------------------------------------------------------------- */}
      {/* ZOOM ORIGINAL PDF SCAN MODAL */}
      {/* --------------------------------------------------------------------- */}
      {selectedPdfImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
          onClick={() => setSelectedPdfImage(null)}
        >
          <div 
            className="w-full max-w-4xl bg-white dark:bg-[#1c1c1f] rounded-2xl overflow-hidden shadow-2xl border border-stone-300 dark:border-stone-700 flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-stone-100 dark:bg-[#18181b] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200 truncate">
                {selectedPdfImage.title}
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href={selectedPdfImage.src} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 transition"
                >
                  เปิดภาพในแท็บใหม่
                </a>
                <button 
                  type="button"
                  onClick={() => setSelectedPdfImage(null)}
                  className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-stone-900/5 dark:bg-black/30">
              <img 
                src={selectedPdfImage.src} 
                alt="PDF Page" 
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-sm border border-stone-200 dark:border-stone-800" 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
