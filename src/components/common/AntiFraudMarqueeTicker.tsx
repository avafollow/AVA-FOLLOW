import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Gavel, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';
import { AVA_20_ANTI_FRAUD_STRATEGIES } from '../../services/antiFraudEngine';

interface AntiFraudMarqueeTickerProps {
  onOpenLegalModal?: () => void;
  className?: string;
}

export const AntiFraudMarqueeTicker: React.FC<AntiFraudMarqueeTickerProps> = ({ 
  onOpenLegalModal,
  className = '' 
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const warnings = [
    "⚖️ CẢNH BÁO: Nghiêm cấm thoát trang, click ảo hoặc dùng bot để trục lợi Xu. Hệ thống tự động thu hồi Xu và khóa ví vi phạm theo NĐ 15/2020/NĐ-CP.",
    "🛡️ BẢO VỆ NGÂN SÁCH: Mỗi kênh TikTok chỉ nhận Xu Follow 1 lần duy nhất trong đời. Hoàn thành nhiệm vụ thật để được cộng Xu tức thì.",
    "💡 QUY TẮC NHẬN XU: Bắt buộc tương tác thật (xem đủ 15s / thả tim / bình luận) trên kênh TikTok chính chủ để bảo vệ tài khoản và tăng điểm tin cậy."
  ];

  return (
    <>
      {/* Running Marquee Bar (Gọn gàng, chạy từ từ ở đáy màn hình) */}
      <div 
        onClick={() => {
          if (onOpenLegalModal) onOpenLegalModal();
          else setShowDetailModal(true);
        }}
        className={`group relative overflow-hidden bg-gradient-to-r from-red-950/95 via-black to-slate-950/95 border-t border-red-500/40 text-white cursor-pointer select-none transition-all hover:border-red-400/80 shadow-2xl z-40 ${className}`}
      >
        <div className="flex items-center h-8 sm:h-9 px-2 sm:px-4 gap-2">
          {/* Badge Label */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 shrink-0 text-[10px] sm:text-[11px] font-black font-mono tracking-wider uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">CẢNH BÁO BẢO MẬT</span>
            <span className="sm:hidden">CẢNH BÁO</span>
          </div>

          {/* Marquee Content (Chạy từ từ, súc tích) */}
          <div className="flex-1 overflow-hidden relative whitespace-nowrap">
            <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] text-[11px] sm:text-xs font-medium text-red-100/90 tracking-wide font-sans">
              {warnings.map((w, i) => (
                <span key={i} className="mx-6 sm:mx-8 inline-flex items-center gap-2">
                  <span>{w}</span>
                  <span className="text-amber-400 font-mono font-bold">•</span>
                </span>
              ))}
              {/* Duplicate for infinite loop */}
              {warnings.map((w, i) => (
                <span key={`dup_${i}`} className="mx-6 sm:mx-8 inline-flex items-center gap-2">
                  <span>{w}</span>
                  <span className="text-amber-400 font-mono font-bold">•</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-1 shrink-0 text-[9px] sm:text-[10px] font-bold font-mono text-amber-300 group-hover:text-amber-200 bg-black/60 px-2 py-0.5 rounded-lg border border-white/15 shadow">
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Xem Quy Định</span>
            <span className="sm:hidden">Quy Định</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Detail Policies & Anti-Fraud Reference Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c101a] border border-red-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/70 via-slate-900 to-black border-b border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-mono font-black">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>QUY ĐỊNH BẢO MẬT &amp; CHỐNG GIAN LẬN</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  Chính Sách Chống Gian Lận &amp; Chế Tài Pháp Chế
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Bảo vệ công bằng cho nhà sáng tạo và người dùng chân chính. Hệ thống tự động phát hiện và xử lý nghiêm các hành vi trục lợi.
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)] text-xs leading-relaxed text-slate-300">
              {/* Legal Warning Banner */}
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <Gavel className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-1">Căn Cứ Pháp Lý &amp; Xử Lý Vi Phạm:</strong>
                  Căn cứ Nghị định 15/2020/NĐ-CP và Bộ luật Hình sự Việt Nam về hành vi gian lận trên mạng viễn thông. Mọi hành vi dùng bot, script giả mạo, hoặc thoát trang không tương tác để chiếm đoạt Xu sẽ bị khóa tài khoản vĩnh viễn, tịch thu toàn bộ số dư và chuyển hồ sơ kỹ thuật số sang bộ phận pháp chế.
                </div>
              </div>

              {/* 3 Core Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-rose-400 font-bold text-xs">1. Follow 1 Lần Duy Nhất</span>
                  <p className="text-[11px] text-slate-400">1 Kênh TikTok chỉ nhận thưởng Follow đúng 1 lần trong đời.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold text-xs">2. Bắt Buộc Tương Tác Thật</span>
                  <p className="text-[11px] text-slate-400">Xem đủ 15s FYP hoặc giữ mắt Live thật để được cộng Xu tự động.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold text-xs">3. 1 Gmail = 1 TikTok</span>
                  <p className="text-[11px] text-slate-400">Liên kết vĩnh viễn, không thể hủy để nhận lại thưởng chào mừng.</p>
                </div>
              </div>

              {/* Background Defense Architecture Details */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide flex items-center gap-1.5 font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hệ Thống Phòng Thủ Ngầm Đang Hoạt Động (20 Lớp AVA Sentinel)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {AVA_20_ANTI_FRAUD_STRATEGIES.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                      <span className="text-base shrink-0">{s.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white truncate">{s.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{s.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Action */}
              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Tôi Đã Hiểu &amp; Cam Kết Tuân Thủ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
