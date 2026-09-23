import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  AlertTriangle, 
  Coins, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Lock,
  Scale
} from 'lucide-react';
import { MarqueeTickerItem } from '../../types';

interface MarqueeNoticeDetailModalProps {
  item: MarqueeTickerItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPolicy?: () => void;
}

export const MarqueeNoticeDetailModal: React.FC<MarqueeNoticeDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onNavigateToPolicy
}) => {
  if (!isOpen || !item) return null;

  const isWarning = item.type === 'security_warning';
  const isRank = item.type === 'rank_up';
  const isTransaction = item.type === 'transaction_alert';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 font-sans select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#111625] via-[#0B0F19] to-[#07090E] border border-white/20 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isWarning 
            ? 'bg-gradient-to-r from-red-950/80 via-rose-950/60 to-transparent border-red-500/30' 
            : isRank 
              ? 'bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-transparent border-amber-500/30'
              : 'bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-transparent border-emerald-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
              isWarning 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : isRank 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isWarning ? <Scale className="w-6 h-6" /> : isRank ? <Award className="w-6 h-6" /> : <Coins className="w-6 h-6" />}
            </div>
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                isWarning 
                  ? 'bg-red-500 text-white' 
                  : isRank 
                    ? 'bg-amber-400 text-black'
                    : 'bg-emerald-500 text-black'
              }`}>
                {item.badgeText || (isWarning ? '⚖️ CẢNH BÁO PHÁP LÝ' : isRank ? '👑 VINH DANH' : '📢 THÔNG BÁO')}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white font-display mt-1">
                {isWarning ? 'Thông Báo An Toàn & Tuân Thủ Pháp Luật' : isRank ? 'Bảng Vàng Danh Dự Toàn Sàn' : 'Thông Báo Giao Dịch'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Main Title Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed font-display">
              {item.title}
            </p>
          </div>

          {/* Detailed Content */}
          {item.detailedContent && (
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                Nội dung chi tiết:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.detailedContent}
              </p>
            </div>
          )}

          {/* Legal Reference if available */}
          {item.legalReference && (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-red-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-red-400" />
                Căn cứ pháp lý &amp; Chế tài xử lý:
              </span>
              <p className="text-xs text-red-200/90 leading-relaxed font-mono">
                {item.legalReference}
              </p>
            </div>
          )}

          {/* Anti-fraud / Security tips */}
          {item.tips && (
            <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Khuyến nghị an toàn:
              </span>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {item.tips}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          {onNavigateToPolicy && isWarning && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToPolicy();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Xem Toàn Bộ Quy Định</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold font-display shadow-lg shadow-rose-950/50 transition-all cursor-pointer text-center"
          >
            Tôi Đã Hiểu &amp; Đồng Ý
          </button>
        </div>
      </div>
    </div>
  );
};
