import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Sparkles, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export interface FeatureGuideProps {
  title: string;
  description: string;
  steps?: string[];
  tips?: string;
  badge?: string;
  size?: 'xs' | 'sm' | 'md';
  position?: 'top' | 'bottom' | 'left' | 'right';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const FeatureGuideTooltip: React.FC<FeatureGuideProps> = ({
  title,
  description,
  steps = [],
  tips,
  badge,
  size = 'sm',
  position = 'bottom',
  placement,
  className = ''
}) => {
  const effectivePosition = placement || position;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sizeClasses = {
    xs: 'w-3.5 h-3.5 p-0.5',
    sm: 'w-4 h-4 p-0.5',
    md: 'w-5 h-5 p-1'
  };

  // Absolute position classes — stays as a compact card anchored to button
  const popoverCls =
    effectivePosition === 'top'    ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' :
    effectivePosition === 'left'   ? 'right-full mr-2 top-0'                       :
    effectivePosition === 'right'  ? 'left-full ml-2 top-0'                        :
                                     'top-full mt-2 left-1/2 -translate-x-1/2';   // bottom

  return (
    <div className={`relative inline-flex items-center select-none ${className}`} ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(v => !v); }}
        className={`rounded-full flex items-center justify-center font-bold font-mono transition-all duration-200 border cursor-pointer ${
          isOpen
            ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-500/40 scale-110'
            : 'bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white border-white/10 hover:border-white/25 hover:scale-105'
        } ${sizeClasses[size]}`}
        title={`Hướng dẫn: ${title}`}
        aria-label={`Hướng dẫn ${title}`}
      >
        <HelpCircle className="w-full h-full" />
      </button>

      {/* Compact square popover — w-64, max-h-72 with scroll */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${popoverCls} z-[999] w-64 max-h-72 overflow-y-auto overscroll-contain rounded-xl bg-[#080B14] border border-rose-500/40 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-150`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Inner scroll container with padding */}
          <div className="p-3 space-y-2 text-left">

            {/* Header row */}
            <div className="flex items-start justify-between gap-1.5 border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 shrink-0">
                  <Info className="w-2.5 h-2.5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-[10px] leading-tight line-clamp-2">{title}</h4>
                  {badge && (
                    <span className="inline-block mt-0.5 px-1 py-px rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {badge}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-0.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Description */}
            <div>
              <span className="text-[9px] uppercase font-mono font-bold text-rose-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-2 h-2" /> Mục Đích
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed">{description}</p>
            </div>

            {/* Steps */}
            {steps.length > 0 && (
              <div className="pt-1.5 border-t border-white/5">
                <span className="text-[9px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1 mb-1">
                  <ChevronRight className="w-2 h-2" /> Hướng Dẫn
                </span>
                <ul className="space-y-1">
                  {steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-300 leading-snug">
                      <span className="w-3 h-3 rounded-full bg-white/10 font-mono text-[8px] flex items-center justify-center shrink-0 mt-0.5 font-bold text-slate-300">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {tips && (
              <div className="pt-1.5 border-t border-white/5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-1.5 leading-snug">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-emerald-300"><strong>Lưu ý:</strong> {tips}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
