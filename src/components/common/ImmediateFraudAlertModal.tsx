import React, { useState, useEffect } from 'react';
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
  Scale,
  Clock,
  Timer
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
  lockedUntil?: string;
  durationMinutes?: number;
  violationLevel?: number;
}

interface ImmediateFraudAlertModalProps {
  data: FraudAlertData | null;
  onClose: () => void;
}

export const ImmediateFraudAlertModal: React.FC<ImmediateFraudAlertModalProps> = ({
  data,
  onClose
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    if (!data?.lockedUntil) return 0;
    return Math.max(0, new Date(data.lockedUntil).getTime() - Date.now());
  });

  useEffect(() => {
    if (!data?.lockedUntil) return;
    const tick = () => {
      const diff = Math.max(0, new Date(data.lockedUntil!).getTime() - Date.now());
      setRemainingMs(diff);
      if (diff <= 0) {
        onClose();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [data?.lockedUntil, onClose]);

  if (!data || !data.isOpen) return null;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (days > 0) {
      return `${days} ngày ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const level = data.violationLevel || 1;
  const isPermanent = Boolean(data.violationLevel && data.violationLevel >= 4);
  const isLevel3 = level === 3;
  const isLevel2 = level === 2;

  let tierBadgeText = '⚠️ VI PHẠM LẦN 1: TẠM KHÓA NHIỆM VỤ 60 PHÚT';
  let tierPenaltySummary = 'Khóa Chuỗi 60 Phút';
  let penaltyPoints = data.penaltyPoints || 20;
  let fineCoinsText = 'Thu hồi Xu nhiệm vụ';

  if (level === 2) {
    tierBadgeText = '🚫 VI PHẠM LẦN 2 (TÁI PHẠM): KHÓA 24 GIỜ & PHẠT 10.000 XU';
    tierPenaltySummary = 'Khóa Toàn Diện 24h';
    penaltyPoints = data.penaltyPoints || 40;
    fineCoinsText = 'Phạt -10.000 Xu trực tiếp';
  } else if (level === 3) {
    tierBadgeText = '🛑 VI PHẠM LẦN 3: KHÓA 3 NGÀY + KHÓA RÚT TIỀN & PHẠT 50.000 XU';
    tierPenaltySummary = 'Khóa 3 Ngày + Khóa Rút';
    penaltyPoints = data.penaltyPoints || 60;
    fineCoinsText = 'Phạt -50.000 Xu & Khóa Rút Tiền';
  } else if (level >= 4) {
    tierBadgeText = '⛔ VI PHẠM LẦN 4: KHÓA VĨNH VIỄN TÀI KHOẢN';
    tierPenaltySummary = 'Khóa Vĩnh Viễn Toàn Sàn';
    penaltyPoints = 100;
    fineCoinsText = 'Tịch thu 100% số dư Xu';
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-lg bg-[#0f070b] border-2 border-rose-500/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
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

        {/* Real-time Countdown Timer Box */}
        {data.lockedUntil && remainingMs > 0 && !isPermanent && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-rose-950/80 to-purple-950/80 border-2 border-rose-500/60 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
            <span className="px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40 uppercase tracking-widest flex items-center gap-1.5 shadow">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{tierBadgeText}</span>
            </span>

            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-red-400 font-mono tracking-wider animate-pulse drop-shadow-md">
              {formatTime(remainingMs)}
            </div>

            <p className="text-[11px] text-slate-300 font-mono">
              Hệ thống sẽ tự động mở khóa hoàn toàn khi đồng hồ đếm ngược về 00:00:00
            </p>
          </div>
        )}

        {isPermanent && (
          <div className="p-4 rounded-2xl bg-red-950 border-2 border-red-600 flex flex-col items-center justify-center text-center space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[11px] font-black uppercase tracking-widest shadow">
              ⛔ TÀI KHOẢN ĐÃ BỊ KHÓA VĨNH VIỄN
            </span>
            <p className="text-xs text-rose-200">
              Tài khoản vi phạm nghiêm trọng quy chuẩn chống gian lận lần thứ 4. Toàn bộ số dư đã bị phong tỏa và chuyển hồ sơ pháp chế.
            </p>
          </div>
        )}

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
              -{penaltyPoints} Điểm
            </div>
            <span className="text-[9px] text-slate-500">Giảm trực tiếp vào hồ sơ</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Chế Tài Thực Thi</span>
            <div className="text-sm font-black text-amber-400 truncate">
              {tierPenaltySummary}
            </div>
            <span className="text-[9px] text-slate-400 truncate block">{fineCoinsText}</span>
          </div>
        </div>

        {/* Strict Legal Callout */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2.5 text-[11px] text-slate-300 leading-relaxed font-sans">
          <Gavel className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Quy Định 4 Cấp Độ Chế Tài:</strong>
            (1) Lần 1: Khóa 60p. (2) Lần 2: Khóa 24h & phạt 10k Xu. (3) Lần 3: Khóa 3 ngày + Khóa rút tiền & phạt 50k Xu. (4) Lần 4: Khóa vĩnh viễn tài khoản theo Nghị định 15/2020/NĐ-CP.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg shadow-rose-600/40 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>TÔI ĐÃ HIỂU &amp; CAM KẾT KHÔNG GIAN LẬN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

