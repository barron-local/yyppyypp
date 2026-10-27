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
  Square,
  ShieldCheck,
  Globe,
  GitBranch,
  Database,
  Layout,
  Rocket,
  ArrowRight,
  PlayCircle,
  Cpu,
  Box,
  Lock,
  KeyRound,
  LogOut
} from 'lucide-react';
import { sectionsMeta, executionPhases, examQuestionsAndSolutions } from './data/examQuestionsAndSolutions';
import MermaidViewer from './components/MermaidViewer';

export default function App() {
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap' | 'sections'
  const [activePhase, setActivePhase] = useState('all'); // 'all' | 1..10
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'sec1'..'sec5'
  const [includeIot, setIncludeIot] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedPdfImage, setSelectedPdfImage] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [activeCardTabs, setActiveCardTabs] = useState({});
  const [selectedHypervisor, setSelectedHypervisor] = useState('virtualbox');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('devops_auth') === '2548';
  });
  const [pinCode, setPinCode] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (pinCode.trim() === '2548') {
      sessionStorage.setItem('devops_auth', '2548');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('devops_auth');
    setIsAuthenticated(false);
    setPinCode('');
  };

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

  // Score calculation
  const totalCompletedScore = useMemo(() => {
    return examQuestionsAndSolutions.reduce((sum, item) => {
      // If item is IoT and includeIot is false, don't count towards standard 100
      if (item.secId === 'sec3' && !includeIot) return sum;
      return sum + (checkedItems[item.id] ? item.pts : 0);
    }, 0);
  }, [checkedItems, includeIot]);

  // Filter items based on viewMode, activePhase / activeSection & searchQuery
  const filteredItems = useMemo(() => {
    return examQuestionsAndSolutions.filter(item => {
      // Filter out IoT if not in IoT mode and not searching IoT specifically
      if (item.secId === 'sec3' && !includeIot && activeSection !== 'sec3') {
        return false;
      }

      // View Mode filtering
      let matchCategory = true;
      if (viewMode === 'roadmap') {
        matchCategory = activePhase === 'all' || item.executionPhase === activePhase;
      } else {
        matchCategory = activeSection === 'all' || item.secId === activeSection;
      }

      // Search query filtering
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText = 
        item.qNum.toLowerCase().includes(q) ||
        item.questionText.toLowerCase().includes(q) ||
        (item.phaseName && item.phaseName.toLowerCase().includes(q)) ||
        (item.execOrderDesc && item.execOrderDesc.toLowerCase().includes(q)) ||
        (item.explanation && item.explanation.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.answerText && item.answerText.toLowerCase().includes(q));

      return matchCategory && matchText;
    }).sort((a, b) => {
      if (viewMode === 'roadmap') {
        return a.executionStep - b.executionStep;
      }
      return 0; // maintain original section array order
    });
  }, [viewMode, activePhase, activeSection, includeIot, searchQuery]);

  // Section icons helper
  const getSectionIcon = (secId) => {
    switch (secId) {
      case 'sec1': return <Network className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'sec2': return <Server className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'sec3': return <Cpu className="w-4 h-4 text-orange-500 shrink-0" />;
      case 'sec4': return <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'sec5': return <MessageSquare className="w-4 h-4 text-rose-500 shrink-0" />;
      default: return <Layers className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  // Phase icons helper
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 1: return <Network className="w-4 h-4 text-blue-500 shrink-0" />;
      case 2: return <Server className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 3: return <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />;
      case 4: return <Globe className="w-4 h-4 text-teal-500 shrink-0" />;
      case 5: return <GitBranch className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 6: return <Layers className="w-4 h-4 text-purple-500 shrink-0" />;
      case 7: return <Database className="w-4 h-4 text-cyan-500 shrink-0" />;
      case 8: return <Layout className="w-4 h-4 text-pink-500 shrink-0" />;
      case 9: return <Rocket className="w-4 h-4 text-rose-500 shrink-0" />;
      case 10: return <Award className="w-4 h-4 text-orange-500 shrink-0" />;
      default: return <Clock className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-sm bg-[#18181b] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Security Access Required</h2>
              <p className="text-xs text-stone-400 mt-1">กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={10}
                  autoFocus
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 bg-stone-900 border rounded-xl text-center text-sm font-mono tracking-widest text-white placeholder:tracking-normal placeholder:text-xs placeholder:text-stone-500 focus:outline-none focus:ring-2 transition ${
                    authError
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-stone-700 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                />
              </div>
              {authError && (
                <p className="text-[11px] text-red-400 text-center font-medium">
                  ⚠️ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-bold transition shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

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
            <div className="text-[10px] text-stone-500 font-mono">ลำดับปฏิบัติการจริง 10 ขั้น</div>
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
        fixed inset-y-0 left-0 z-50 w-76 bg-white dark:bg-[#18181b] border-r border-stone-200 dark:border-stone-800
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
              <div className="text-[10px] text-stone-500 font-medium">ทักษะ DevOps ปวส. (2568 - 2572)</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <button 
              type="button"
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-stone-400 hover:text-red-500 transition"
              title="ออกจากระบบ / ล็อกหน้าจอ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
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

        {/* View Mode Tabs in Sidebar */}
        <div className="px-3 py-1 flex items-center gap-1 bg-stone-100 dark:bg-[#222226] mx-3 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('roadmap')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold transition text-center ${
              viewMode === 'roadmap'
                ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            🚀 ลำดับขั้นตอนจริง
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sections')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold transition text-center ${
              viewMode === 'sections'
                ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            📋 หมวดใน PDF
          </button>
        </div>

        {/* Navigation List based on ViewMode */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1 py-2">
          {viewMode === 'roadmap' ? (
            <>
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 uppercase flex items-center justify-between">
                <span>ลำดับปฏิบัติการจริง 10 ขั้น (1 ➔ 10)</span>
                <span className="font-mono text-[9px] text-blue-500">7 ชั่วโมง</span>
              </div>

              <button
                type="button"
                onClick={() => { setActivePhase('all'); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  activePhase === 'all'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>ทุกขั้นตอน (1 - 10)</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                  100 PTS
                </span>
              </button>

              {executionPhases.map((ph) => {
                const isSelected = activePhase === ph.phase;
                return (
                  <button
                    key={ph.id}
                    type="button"
                    onClick={() => { setActivePhase(ph.phase); setSidebarOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      {getPhaseIcon(ph.phase)}
                      <span className="truncate">{ph.shortTitle}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold shrink-0">
                      {ph.pts} PTS
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 uppercase flex items-center justify-between">
                <span>หมวดข้อสอบตามเล่ม PDF</span>
                <span className="font-mono text-[9px] text-blue-500">หน้า 9-18</span>
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
                  <span>แสดงทั้งหมดทุกหมวด</span>
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

              {/* IoT Mode Toggle Button */}
              <div className="pt-2 px-2">
                <button
                  type="button"
                  onClick={() => setIncludeIot(!includeIot)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-medium border transition flex items-center justify-between ${
                    includeIot
                      ? 'bg-orange-50 border-orange-300 text-orange-900 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-200'
                      : 'border-dashed border-stone-300 dark:border-stone-700 text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-orange-500" />
                    <span>{includeIot ? 'เปิดโหมดสอบ IoT (10 Pts)' : '+ แสดงหมวดเสริม IoT'}</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold">
                    {includeIot ? 'เปิดอยู่' : 'ปิด'}
                  </span>
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>เวลาแข่ง 7 ชม. | เน็ต 2 ชม.</span>
          </div>
          <div className="text-[10px] text-stone-400">
            เอกสารทางการ PDF 29 หน้า (หน้า 9-18, 22)
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
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            ระบบสรุป <strong>"คำถามตรงตามเกณฑ์ในเล่ม PDF ทางการเป๊ะๆ ทุกข้อ"</strong> พร้อมเรียบเรียง <strong>"ลำดับการปฏิบัติงานจริงอย่างเป็นขั้นตอน (Execution Roadmap 1 ➔ 10)"</strong> ช่วยให้ทราบว่าต้องเริ่มทำอะไรจากไหนไปไหนในเวลา 7 ชั่วโมง
          </p>

          {/* Test Users RBAC Banner */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-1.5">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>🔑</span>
              <span>บัญชีผู้ใช้งานสำหรับทดสอบระบบจริง (RBAC 3 ระดับ - รหัสผ่านคือ Password123!) :</span>
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
                <div className="text-[10px] text-stone-500 font-sans mt-0.5">สมาชิก: ดูข้อมูล (Read-Only), ค้นหา, ดาวน์โหลดไฟล์</div>
              </div>
            </div>
          </div>

          {/* View Mode Switcher Header */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 dark:border-stone-800">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <span>โหมดการแสดงผล:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('roadmap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'roadmap'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                <span>🚀 เรียงตามลำดับปฏิบัติงานจริง (1 ➔ 10)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sections')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'sections'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                <span>📋 เรียงตามหมวดเล่ม PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* ROADMAP EXECUTION STEPPER (WHEN IN ROADMAP MODE) */}
        {/* --------------------------------------------------------------------- */}
        {viewMode === 'roadmap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-blue-600" />
                <span>แผนผังลำดับขั้นตอนการปฏิบัติงาน 10 ขั้น (ทำอะไรก่อน - ไปหลัง):</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePhase('all')}
                className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                  activePhase === 'all'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold'
                    : 'text-blue-600 hover:underline'
                }`}
              >
                แสดงทั้งหมด (Phase 1-10)
              </button>
            </div>

            {/* Stepper Phase Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {executionPhases.map((ph) => {
                const isActive = activePhase === ph.phase;
                return (
                  <button
                    key={ph.id}
                    type="button"
                    onClick={() => setActivePhase(ph.phase)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                      isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/60 dark:border-blue-400 dark:text-blue-200 ring-2 ring-blue-400/40'
                        : 'bg-white dark:bg-[#18181b] border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        ขั้นที่ {ph.phase}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {ph.pts} PTS
                      </span>
                    </div>
                    <div className="font-bold text-[11px] leading-tight line-clamp-1">
                      {ph.shortTitle.split('. ')[1]}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      ⏱ {ph.timeAllotment.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Phase Details Banner if specific phase selected */}
            {activePhase !== 'all' && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-blue-900 dark:text-blue-200 text-sm">
                    {executionPhases.find(p => p.phase === activePhase)?.title}
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                    ⏱ {executionPhases.find(p => p.phase === activePhase)?.timeAllotment}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  {executionPhases.find(p => p.phase === activePhase)?.summary}
                </p>

                {/* Quick Hypervisor Switcher for Phase 2 */}
                {activePhase === 2 && (
                  <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-blue-950 dark:text-blue-200 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>สลับแพลตฟอร์ม Virtualization ทั้งหมด:</span>
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHypervisor('virtualbox');
                          setActiveCardTabs(prev => ({ ...prev, c6_1: 'virtualbox', c6_2: 'virtualbox', c6_3: 'virtualbox', c7_1: 'virtualbox' }));
                        }}
                        className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1.5 transition ${
                          selectedHypervisor === 'virtualbox'
                            ? 'bg-amber-500 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Box className="w-3 h-3" />
                        <span>📦 Oracle VirtualBox</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHypervisor('vmware');
                          setActiveCardTabs(prev => ({ ...prev, c6_1: 'vmware', c6_2: 'vmware', c6_3: 'vmware', c7_1: 'vmware' }));
                        }}
                        className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1.5 transition ${
                          selectedHypervisor === 'vmware'
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Cpu className="w-3 h-3" />
                        <span>⚡ VMware Workstation Pro</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHypervisor('proxmox');
                          setActiveCardTabs(prev => ({ ...prev, c6_1: 'proxmox', c6_2: 'proxmox', c6_3: 'proxmox', c7_1: 'proxmox' }));
                        }}
                        className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1.5 transition ${
                          selectedHypervisor === 'proxmox'
                            ? 'bg-emerald-600 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Server className="w-3 h-3" />
                        <span>🛡️ Proxmox VE</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* SECTION FILTER PILLS (WHEN IN SECTIONS MODE) */}
        {/* --------------------------------------------------------------------- */}
        {viewMode === 'sections' && (
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
              ทั้งหมดทุกหมวด (100 คะแนน)
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
        )}

        {/* Search Results Summary */}
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
        {/* LIST OF EXAM QUESTIONS & SOLUTIONS (CHRONOLOGICALLY ORDERED) */}
        {/* --------------------------------------------------------------------- */}
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <article 
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-[#18181b] overflow-hidden shadow-xs ${
                  isChecked 
                    ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-200 dark:ring-emerald-900/40' 
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* 1. QUESTION HEADER WITH CHRONOLOGICAL EXECUTION STEP BADGE */}
                <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-[#1c1c20]/50 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Execution Sequence & PDF Mapping Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Step Number in Workflow */}
                      <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                        ลำดับที่ {item.executionStep}
                      </span>

                      {/* Phase Name */}
                      <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 bg-stone-200/80 dark:bg-stone-800 px-2.5 py-0.5 rounded-md">
                        {item.phaseName ? item.phaseName.split(': ')[1] : item.secId}
                      </span>

                      {/* Official Question Number & PDF Page */}
                      <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                        {item.qNum} (PDF หน้า {item.pdfPage})
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

                  {/* Why this step is executed here (Chronological Execution Context) */}
                  {item.execOrderDesc && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300">
                      <span className="font-bold shrink-0">📍 ลำดับการทำ:</span>
                      <span>{item.execOrderDesc}</span>
                    </div>
                  )}

                  {/* Exact Question Text directly from PDF */}
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      ข้อความคำถามตามเกณฑ์ทางการ:
                    </div>
                    <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 whitespace-pre-line leading-snug">
                      {item.questionText}
                    </div>
                  </div>
                </div>

                {/* 2. ANSWER SECTION (คำตอบวิธีที่ถูกต้องและที่เขาทำกัน) */}
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
                      <MermaidViewer chart={item.code} id={item.id} isDark={darkMode} />

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

                  {/* TYPE: MULTI-PLATFORM TABS (VIRTUALBOX / VMWARE / PROXMOX) */}
                  {item.tabs && item.tabs.length > 0 && (() => {
                    const currentTabId = activeCardTabs[item.id] || selectedHypervisor || item.tabs[0].id;
                    const currentTab = item.tabs.find(t => t.id === currentTabId) || item.tabs[0];

                    return (
                      <div className="space-y-3 pt-1">
                        {/* Tab Switcher Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 dark:bg-[#1a1a20] rounded-xl border border-stone-200 dark:border-stone-800">
                          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 px-2 flex items-center gap-1 shrink-0">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            <span>เลือกแพลตฟอร์ม:</span>
                          </span>
                          {item.tabs.map(tab => {
                            const isActive = tab.id === currentTab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  setActiveCardTabs(prev => ({ ...prev, [item.id]: tab.id }));
                                  setSelectedHypervisor(tab.id);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                                  isActive
                                    ? 'bg-white dark:bg-[#282832] text-indigo-600 dark:text-indigo-400 border border-stone-300 dark:border-stone-700 shadow-sm'
                                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/50 dark:hover:bg-stone-800/50'
                                }`}
                              >
                                {tab.icon === 'Box' && <Box className="w-3.5 h-3.5 text-amber-500" />}
                                {tab.icon === 'Cpu' && <Cpu className="w-3.5 h-3.5 text-blue-500" />}
                                {tab.icon === 'Server' && <Server className="w-3.5 h-3.5 text-emerald-500" />}
                                <span>{tab.label}</span>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-0.5" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Tab Explanation */}
                        {currentTab.explanation && (
                          <div className="p-3 bg-stone-50 dark:bg-[#16161c] rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>{currentTab.explanation}</div>
                          </div>
                        )}

                        {/* Active Tab Steps */}
                        {currentTab.steps && currentTab.steps.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#1f1f23] border border-stone-200 dark:border-stone-800 space-y-2">
                            <div className="font-semibold text-stone-800 dark:text-stone-200 text-xs flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span>ขั้นตอนการตั้งค่าบน {currentTab.label}:</span>
                              </span>
                              <span className="text-[10px] text-stone-400 font-normal">
                                {currentTab.steps.length} ขั้นตอนละเอียด
                              </span>
                            </div>
                            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 dark:text-stone-400 text-xs sm:text-[12px] leading-relaxed">
                              {currentTab.steps.map((st, i) => (
                                <li key={i} className="pl-1">{st}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Active Tab Code / Commands */}
                        {currentTab.code && (
                          <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-[#1e1e1e]">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] text-stone-400 font-mono text-[10px] border-b border-stone-700">
                              <span>{currentTab.lang ? currentTab.lang.toUpperCase() : 'COMMANDS'}</span>
                              <div className="flex items-center gap-2">
                                <span>{currentTab.verify ? `ตรวจสอบ: ${currentTab.verify}` : 'คำสั่งพร้อมใช้งาน'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(currentTab.code, `${item.id}-${currentTab.id}`)}
                                  className="p-1 hover:text-white rounded transition"
                                  title="คัดลอกคำสั่ง"
                                >
                                  {copiedId === `${item.id}-${currentTab.id}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <pre className="p-3.5 text-stone-200 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
                              <code>{currentTab.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* TYPE: CODE / SCRIPT (NON-MERMAID, NON-TAB) */}
                  {!item.tabs && item.code && item.solutionType !== 'mermaid' && (
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

                  {/* TYPE: STEP BY STEP LIST (NON-TAB) */}
                  {!item.tabs && item.steps && (
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
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* ORIGINAL PDF PAGE SCAN VIEWER MODAL */}
      {/* --------------------------------------------------------------------- */}
      {selectedPdfImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
          onClick={() => setSelectedPdfImage(null)}
        >
          <div 
            className="bg-white dark:bg-[#18181b] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-[#202024]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                  {selectedPdfImage.title}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedPdfImage(null)}
                className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-stone-100 dark:bg-black/40 flex justify-center items-start">
              <img 
                src={selectedPdfImage.src} 
                alt={selectedPdfImage.title}
                className="max-w-full h-auto rounded-lg shadow-md border border-stone-200 dark:border-stone-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }} className="p-8 text-center text-stone-400 text-xs">
                ไม่พบไฟล์ภาพสแกน PDF หน้านี้ ({selectedPdfImage.src})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
