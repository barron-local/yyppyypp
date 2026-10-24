import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
});

export default function MermaidViewer({ chart, id }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart) return;
      try {
        setError(null);
        const uniqueId = `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Math.random().toString(36).substring(2, 7)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError('ไม่สามารถเรนเดอร์ Flowchart ได้ กรุณาดูแบบโค้ดแทน');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  if (error) {
    return (
      <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs">
        {error}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1e1e24] overflow-hidden shadow-xs space-y-0 ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col shadow-2xl ring-1 ring-black/20' : ''
    }`}>
      {/* Viewer Toolbar */}
      <div className="px-3 py-2 bg-stone-100 dark:bg-[#28282f] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 shrink-0">
        <span className="font-semibold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          ผังงานแสดงผลจริง (เห็นครบตั้งแต่เริ่มต้นจนสิ้นสุด)
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-stone-400 mr-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
            title="ย่อขนาด"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
            title="ขยายขนาด"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
            title="รีเซ็ตขนาดเดิม (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-0.5" />
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
            title={isFullscreen ? "ย่อหน้าจอปกติ" : "ขยายเต็มหน้าต่าง"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className={`p-6 overflow-x-auto overflow-y-auto bg-stone-50/60 dark:bg-[#16161a] ${
          isFullscreen ? 'flex-1 max-h-none' : 'max-h-[650px]'
        }`}
      >
        {svgContent ? (
          <div className="min-w-fit mx-auto flex flex-col items-center justify-start pt-2 pb-6">
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.12s ease-out' }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="mermaid-svg-container [&>svg]:max-w-none [&>svg]:h-auto [&>svg]:overflow-visible"
            />
          </div>
        ) : (
          <div className="py-16 text-center text-stone-400 text-xs font-mono animate-pulse">
            กำลังประมวลผลและวาดผังงาน Flowchart...
          </div>
        )}
      </div>
    </div>
  );
}
