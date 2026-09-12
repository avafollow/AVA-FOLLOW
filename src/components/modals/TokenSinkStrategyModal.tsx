import React from 'react';
import { 
  X, 
  Flame, 
  ShieldCheck, 
  TrendingDown, 
  Coins, 
  ArrowRight, 
  Zap, 
  RefreshCw,
  Award,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { TOKEN_SINK_STRATEGIES } from '../../data/crossFollowData';

interface TokenSinkStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenSinkStrategyModal: React.FC<TokenSinkStrategyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0B0F19] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/60 via-[#1A0B2E] to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  TOKEN SINK &amp; DEFLATION ENGINE
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">✓ Bảo Chứng 1:1</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display mt-0.5">
                Cơ Chế Triệt Tiêu &amp; Tái Hấp Thụ Xu (Chống Lủng Hệ Thống)
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NGUYÊN LÝ VẬN HÀNH BẢO VỆ TỶ GIÁ 1 XU = 1 VNĐ</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Để dự án phát triển lâu dài và bền vững, hệ thống áp dụng thuật toán <strong>Triệt Tiêu Xu (Token Burn &amp; Recycling)</strong> khép kín. Người dùng kiếm được Xu sẽ được khuyến khích tái sử dụng Xu cho chính nhu cầu phát triển kênh TikTok của họ, hoặc chi trả cho các tính năng VIP. Lượng Xu lưu thông luôn được cân bằng với quỹ tiền thực nạp từ Doanh nghiệp, loại bỏ hoàn toàn rủi ro lạm phát hoặc thâm hụt tiền mặt khi rút.
            </p>
          </div>

          {/* 8 Strategies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {TOKEN_SINK_STRATEGIES.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{st.icon}</span>
                  {st.burnRatePercentage ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Đốt Triệt Tiêu {st.burnRatePercentage}%
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Tiêu Hao {st.burnCostXu?.toLocaleString()} Xu
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs font-display">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1 text-[10px] font-mono">
                  <div className="text-emerald-400">
                    <strong>✓ Lợi ích Người Dùng:</strong> {st.benefitForUser}
                  </div>
                  <div className="text-cyan-300">
                    <strong>⚡ Tác động Sàn:</strong> {st.benefitForPlatform}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Nền tảng vận hành tự động minh bạch 100%.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
