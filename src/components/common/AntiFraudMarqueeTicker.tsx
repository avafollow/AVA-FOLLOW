import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Gavel, 
  Lock, 
  ChevronRight, 
  AlertTriangle, 
  X, 
  Layers, 
  Scale, 
  CheckCircle2, 
  Zap, 
  Eye,
  FileText
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
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

  const marqueeText = "⚖️ CẢNH BÁO PHÁP CHẾ & BẢO MẬT 20 LỚP: Tuyệt đối nghiêm cấm mọi hành vi thoát ra vào lại mà không tương tác thật để trục lợi Xu. Hệ thống AVA Sentinel 2026 tự động ghi nhận mã thiết bị, IP, telemetry và khóa ví vĩnh viễn. Mọi hành vi botting, hack script chiếm đoạt tiền quỹ sẽ được tự động trích xuất hồ sơ chuyển sang Bộ phận Pháp chế & Cơ quan Điều tra theo NĐ 15/2020/NĐ-CP.";

  return (
    <>
      {/* Running Marquee Bar */}
      <div 
        onClick={() => setShowDetailModal(true)}
        className={`group relative overflow-hidden bg-gradient-to-r from-rose-950/90 via-amber-950/80 to-slate-950/95 border-y sm:border border-rose-500/40 text-white cursor-pointer select-none transition-all hover:border-rose-400/70 shadow-lg shadow-rose-950/30 ${className}`}
      >
        <div className="flex items-center h-9 px-3 gap-2">
          {/* Badge Label */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0 text-[11px] font-black font-mono tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">20 LỚP CHỐNG GIAN LẬN</span>
            <span className="sm:hidden">ANTI-FRAUD</span>
          </div>

          {/* Marquee Content */}
          <div className="flex-1 overflow-hidden relative whitespace-nowrap">
            <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] text-xs font-semibold text-rose-100/90 tracking-wide font-sans">
              <span className="mx-4">{marqueeText}</span>
              <span className="mx-4 font-mono text-amber-300 font-bold">• [CHỐNG BOT 100%] • [ĐỐI SOÁT TELEMETRY] • [KHÓA VÍ TỰ ĐỘNG] •</span>
              <span className="mx-4">{marqueeText}</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold font-mono text-amber-400 group-hover:text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-white/10">
            <span>20 Chiến Lược</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 20 Anti-Fraud Strategies Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c101a] border border-rose-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-black">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>AVA SENTINEL 2026 - ZERO TRUST ANTI-FRAUD</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  20 Chiến Lược Phòng Thủ &amp; Chống Gian Lận Tuyệt Đối
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Ngăn chặn triệt để hành vi thoát ra vào lại nhằm cày xu ảo, bảo vệ công bằng cho nhà sáng tạo và cam kết pháp chế minh bạch.
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 20 Strategies Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
              {/* Alert Legal Callout */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <Gavel className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-200 leading-relaxed">
                  <strong className="text-white block mb-0.5">Quy Định Xử Lý Vi Phạm &amp; Chế Tài Pháp Chế:</strong>
                  Mọi tài khoản vi phạm (thoát ra vào lại không làm nhiệm vụ, script auto, proxy xoay) sẽ bị đóng băng số dư trong Két 7 ngày, hạ điểm uy tín về 0 và chuyển hồ sơ kỹ thuật số (IP, thiết bị, CCCD) sang Bộ phận Pháp chế để xử lý theo quy định pháp luật.
                </div>
              </div>

              {/* Grid 20 Strategies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {AVA_20_ANTI_FRAUD_STRATEGIES.map((strat) => (
                  <div
                    key={strat.id}
                    className={`p-4 rounded-2xl bg-black/40 border transition-all space-y-2.5 flex flex-col justify-between ${
                      selectedStrategy === strat.id 
                        ? 'border-rose-500 bg-rose-950/20' 
                        : 'border-white/10 hover:border-rose-500/40'
                    }`}
                    onClick={() => setSelectedStrategy(strat.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            #{strat.id < 10 ? `0${strat.id}` : strat.id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/5 border border-white/5">
                            {strat.layerCategory}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {strat.efficiencyRate}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white/5 border border-white/5">{strat.icon}</span>
                        <div>
                          <h4 className="text-xs font-black text-white font-display">
                            {strat.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {strat.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Mã: {strat.code}</span>
                      <span className={`font-bold uppercase ${
                        strat.autoAction === 'lock_account' ? 'text-rose-400' :
                        strat.autoAction === 'freeze_wallet' ? 'text-amber-400' :
                        strat.autoAction === 'legal_dossier' ? 'text-purple-400' :
                        'text-cyan-400'
                      }`}>
                        {strat.autoAction === 'lock_account' ? 'Khóa Acc' :
                         strat.autoAction === 'freeze_wallet' ? 'Đóng Băng Ví' :
                         strat.autoAction === 'legal_dossier' ? 'Chuyển Pháp Chế' : 'Phạt Điểm'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Cam kết minh bạch tuyệt đối &amp; Nhật ký bất biến lưu trên Supabase</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs font-mono transition-all shadow-lg shadow-rose-600/30"
                >
                  ĐÃ HIỂU &amp; CAM KẾT TUÂN THỦ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
