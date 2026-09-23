import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Gavel, 
  Lock, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  Scale
} from 'lucide-react';

export interface FraudAlertData {
  isOpen: boolean;
  title?: string;
  reason: string;
  anomalyType?: string;
  penaltyPoints?: number;
  trustScoreAfter?: number;
  taskId?: string;
  channelHandle?: string;
}

interface ImmediateFraudAlertModalProps {
  data: FraudAlertData | null;
  onClose: () => void;
}

export const ImmediateFraudAlertModal: React.FC<ImmediateFraudAlertModalProps> = ({
  data,
  onClose
}) => {
  if (!data || !data.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-lg bg-[#0f070b] border-2 border-rose-500/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulsing Siren Icon Header */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center shadow-lg shadow-rose-600/50">
              <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0f070b] animate-ping" />
          </div>

          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-black uppercase tracking-wider">
              <span>HỆ THỐNG AN NINH CẤP CAO (AVA SENTINEL)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight text-rose-100">
              {data.title || "CẢNH BÁO GIAN LẬN THỜI GIAN THỰC"}
            </h3>
          </div>
        </div>

        {/* Warning Reason Box */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
          <div className="flex items-start gap-2.5 text-xs text-rose-200 leading-relaxed font-sans font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-1">Hành Vi Bất Thường Phát Hiện:</strong>
              {data.reason}
            </div>
          </div>

          {data.channelHandle && (
            <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Kênh mục tiêu:</span>
              <span className="text-amber-300 font-bold">{data.channelHandle}</span>
            </div>
          )}
        </div>

        {/* Penalty & Trust Score Box */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="p-3 rounded-2xl bg-black/60 border border-rose-500/30 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Phạt Điểm Uy Tín</span>
            <div className="text-lg font-black text-rose-400">
              -{data.penaltyPoints || 20} Điểm
            </div>
            <span className="text-[9px] text-slate-500">Giảm trực tiếp vào hồ sơ</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Chế Tài Thực Thi</span>
            <div className="text-sm font-black text-amber-400 truncate">
              Đóng Băng Két 7 Ngày
            </div>
            <span className="text-[9px] text-slate-500">Thu hồi toàn bộ Xu ảo</span>
          </div>
        </div>

        {/* Strict Legal Callout */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed font-sans">
          <Gavel className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Quy Định Nghiêm Ngặt:</strong>
            Mỗi nhiệm vụ và kênh chỉ được thực hiện và nhận thưởng duy nhất 1 lần. Mọi hành vi cố tình thoát ra vào lại mà không comment/like/follow thật sẽ bị khóa vĩnh viễn tài khoản và chuyển hồ sơ pháp chế theo Nghị định 15/2020/NĐ-CP.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg shadow-rose-600/40 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>TÔI ĐÃ HIỂU &amp; CAM KẾT KHÔNG GIAN LẬN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
