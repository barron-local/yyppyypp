import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Sun, Moon, Copy, Check } from 'lucide-react';

export default function MermaidViewer({ chart, id, isDark }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // สถานะโหมดสี (Dark / Light)
  const [currentDark, setCurrentDark] = useState(() => {
    if (typeof isDark === 'boolean') return isDark;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // ซิงค์กับ prop isDark จาก Parent Component (App.jsx)
  useEffect(() => {
    if (typeof isDark === 'boolean') {
      setCurrentDark(isDark);
    }
  }, [isDark]);

  // ติดตามการเปลี่ยนแปลง class 'dark' บน <html> แบบ Real-time
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const isHtmlDark = document.documentElement.classList.contains('dark');
      setCurrentDark(isHtmlDark);
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  // ฟังก์ชันเรนเดอร์ Mermaid SVG ตามโหมดสี
  const renderChart = useCallback(async () => {
    if (!chart) return;
    try {
      setError(null);

      // กำหนดค่าคอนฟิกสีให้สอดคล้องกับ Light / Dark Mode
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'Sarabun, Inter, system-ui, -apple-system, sans-serif',
        theme: currentDark ? 'dark' : 'default',
        themeVariables: currentDark ? {
          darkMode: true,
          fontFamily: 'Sarabun, Inter, system-ui, sans-serif',
          fontSize: '13px',
          background: '#121217',
          primaryColor: '#1e293b',
          primaryTextColor: '#f8fafc',
          primaryBorderColor: '#818cf8',
          lineColor: '#cbd5e1',
          secondaryColor: '#0f172a',
          tertiaryColor: '#1e1e24',
          mainBkg: '#1e293b',
          nodeBorder: '#818cf8',
          nodeTextColor: '#f8fafc',
          edgeLabelBackground: '#0f172a',
          clusterBkg: '#181820',
          clusterBorder: '#475569',
          titleColor: '#f8fafc',
          actorBkg: '#1e293b',
          actorBorder: '#818cf8',
          actorTextColor: '#f8fafc',
          signalColor: '#cbd5e1',
          signalTextColor: '#f8fafc'
        } : {
          darkMode: false,
          fontFamily: 'Sarabun, Inter, system-ui, sans-serif',
          fontSize: '13px',
          background: '#ffffff',
          primaryColor: '#eef2ff',
          primaryTextColor: '#0f172a',
          primaryBorderColor: '#4f46e5',
          lineColor: '#475569',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#ffffff',
          mainBkg: '#f8fafc',
          nodeBorder: '#4f46e5',
          nodeTextColor: '#0f172a',
          edgeLabelBackground: '#ffffff',
          clusterBkg: '#f1f5f9',
          clusterBorder: '#94a3b8',
          titleColor: '#0f172a',
          actorBkg: '#eef2ff',
          actorBorder: '#4f46e5',
          actorTextColor: '#0f172a',
          signalColor: '#475569',
          signalTextColor: '#0f172a'
        }
      });

      // ตั้ง ID ไม่ซ้ำสำหรับแต่ละโหมดสี เพื่อบังคับ Mermaid สร้าง Element ใหม่
      const modeSuffix = currentDark ? 'dark' : 'light';
      const cleanId = (id || 'chart').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueId = `mermaid-${cleanId}-${modeSuffix}-${Math.random().toString(36).substring(2, 7)}`;

      const { svg } = await mermaid.render(uniqueId, chart);
      setSvgContent(svg);
    } catch (err) {
      console.error('Mermaid render error:', err);
      setError('ไม่สามารถเรนเดอร์ Flowchart ได้ กรุณาดูแบบโค้ดแทน');
    }
  }, [chart, id, currentDark]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      renderChart();
    }
    return () => {
      isMounted = false;
    };
  }, [renderChart]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // ปุ่มสลับโหมดเฉพาะกล่องผังงาน
  const toggleLocalTheme = () => {
    setCurrentDark(prev => !prev);
  };

  const handleCopyCode = () => {
    if (!chart) return;
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs border border-rose-200 dark:border-rose-900">
        {error}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border transition-colors duration-200 overflow-hidden shadow-xs space-y-0 ${
      currentDark 
        ? 'border-stone-800 bg-[#16161c] text-stone-200' 
        : 'border-stone-200 bg-white text-stone-800'
    } ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl ring-2 ring-indigo-500/30' : ''
    }`}>
      
      {/* Viewer Toolbar */}
      <div className={`px-3 py-2 border-b flex items-center justify-between text-[11px] shrink-0 transition-colors ${
        currentDark 
          ? 'bg-[#1f1f27] border-stone-800 text-stone-300' 
          : 'bg-stone-100 border-stone-200 text-stone-600'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentDark ? 'bg-indigo-400' : 'bg-emerald-500'}`} />
            <span>ผังงานแสดงผลจริง</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            currentDark 
              ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {currentDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1">
          {/* Zoom Level Indicator */}
          <span className="font-mono text-[10px] text-stone-400 mr-1 hidden sm:inline">
            {Math.round(zoomLevel * 100)}%
          </span>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className={`p-1.5 rounded-md transition ${
              currentDark ? 'hover:bg-stone-700/60 text-stone-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            title="ย่อขนาด"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className={`p-1.5 rounded-md transition ${
              currentDark ? 'hover:bg-stone-700/60 text-stone-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            title="ขยายขนาด"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetZoom}
            className={`p-1.5 rounded-md transition ${
              currentDark ? 'hover:bg-stone-700/60 text-stone-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            title="รีเซ็ตขนาดเดิม (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className={`h-4 w-px mx-0.5 ${currentDark ? 'bg-stone-700' : 'bg-stone-300'}`} />

          {/* Toggle Local Theme Button (สลับโหมดเฉพาะ Flowchart) */}
          <button
            type="button"
            onClick={toggleLocalTheme}
            className={`p-1.5 rounded-md transition flex items-center gap-1 text-[11px] font-medium ${
              currentDark 
                ? 'hover:bg-stone-700/60 text-amber-300 hover:text-amber-200' 
                : 'hover:bg-stone-200 text-indigo-600 hover:text-indigo-700'
            }`}
            title={currentDark ? "สลับเป็นโหมดสว่าง (Light)" : "สลับเป็นโหมดมืด (Dark)"}
          >
            {currentDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Mermaid Code */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`p-1.5 rounded-md transition ${
              currentDark ? 'hover:bg-stone-700/60 text-stone-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            title="คัดลอกโค้ด Mermaid"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-md transition ${
              currentDark ? 'hover:bg-stone-700/60 text-stone-300' : 'hover:bg-stone-200 text-stone-600'
            }`}
            title={isFullscreen ? "ย่อหน้าจอปกติ" : "ขยายเต็มหน้าต่าง"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className={`p-6 overflow-x-auto overflow-y-auto transition-colors duration-200 ${
          currentDark ? 'bg-[#101015]' : 'bg-slate-50/70'
        } ${
          isFullscreen ? 'flex-1 max-h-none' : 'max-h-[650px]'
        }`}
      >
        {svgContent ? (
          <div className="min-w-fit mx-auto flex flex-col items-center justify-start pt-2 pb-6">
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.12s ease-out' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className={`mermaid-svg-container [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:overflow-visible ${
                currentDark ? 'mermaid-dark-theme' : 'mermaid-light-theme'
              }`}
            />
          </div>
        ) : (
          <div className="py-16 text-center text-stone-400 text-xs font-mono animate-pulse">
            กำลังประมวลผลและวาดผังงาน Flowchart ({currentDark ? 'โหมดมืด' : 'โหมดสว่าง'})...
          </div>
        )}
      </div>

    </div>
  );
}
