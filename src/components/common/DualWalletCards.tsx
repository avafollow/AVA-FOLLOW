import React from 'react';
import { Coins, ArrowDownRight, ShoppingBag, RefreshCw, Sparkles, Lock } from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from './FeatureGuideTooltip';

interface DualWalletCardsProps {
  onOpenWithdraw?: () => void;
  onNavigateToMarketplace?: () => void;
  compact?: boolean;
}

export const DualWalletCards: React.FC<DualWalletCardsProps> = ({
  onOpenWithdraw,
  onNavigateToMarketplace,
  compact = false
}) => {
  const { user, openWithdraw } = useTikTokApp();

  const crossFollowCoins = user.crossFollowCoins ?? 0;
  const missionCoins = user.missionCoins ?? Math.max(0, (user.avaliveCoins || 0) - crossFollowCoins);
  const MIN_MISSION_WITHDRAW = 500000; // 500.000đ = 500.000 Xu
  const withdrawProgress = Math.min(100, Math.round((missionCoins / MIN_MISSION_WITHDRAW) * 100));
  const canWithdrawNow = missionCoins >= MIN_MISSION_WITHDRAW;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'gap-3' : 'gap-4'}`}>
      {/* Ô 1: VÍ XU LÀM NHIỆM VỤ & THƯỞNG (ĐƯỢC RÚT TIỀN MẶT TỪ 500.000đ + MUA GÓI) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-[#0C1324] to-[#080B14] border border-emerald-500/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-white font-display uppercase tracking-wide">
                  Ví Xu Làm Nhiệm Vụ
                </h4>
                <FeatureGuideTooltip
                  title="Ví Xu Làm Nhiệm Vụ (Chỉ Từ Làm Nhiệm Vụ Thật — Rút Tiền Mặt)"
                  description="Ví này CHỈ ghi nhận Xu bạn tự tay đi làm Nhiệm Vụ thật (TikTok, Facebook, YouTube, Livestream). Quy đổi 1 Xu = 1 VNĐ. Tuyệt đối KHÔNG cộng dồn 500.000 Xu quà tặng đăng ký hay Xu Follow chéo vào ví này."
                  steps={[
                    'Đủ tối thiểu 500.000 Xu (= 500.000đ tiền Việt) kiếm từ làm nhiệm vụ là được rút tiền mặt về Ngân hàng / MoMo.',
                    'Tiền rút được giải ngân định kỳ lúc 10:00 Sáng Thứ Hai hàng tuần.',
                    'Ngoài rút tiền mặt, bạn cũng có thể dùng Xu này để mua bất kỳ gói dịch vụ nào.'
                  ]}
                  tips="Hãy chăm chỉ làm nhiệm vụ thật hàng ngày để tích lũy Ví Xu Làm Nhiệm Vụ và rút tiền mặt!"
                  badge="RÚT TIỀN MIN 500K"
                  size="sm"
                />
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                ✓ Quy đổi rút tiền mặt • Min 500.000đ (500.000 Xu)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWithdraw || openWithdraw}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] font-mono flex items-center gap-1 shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Rút Tiền</span>
          </button>
        </div>

        <div className="flex items-baseline justify-between gap-2 relative z-10 pt-1">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono font-mono-numbers leading-none">
              {missionCoins.toLocaleString()} <span className="text-sm text-amber-300">Xu</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-1">
              Quy đổi tiền Việt: <strong className="text-white">{missionCoins.toLocaleString()}đ</strong> (1 Xu = 1đ)
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
            canWithdrawNow
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {canWithdrawNow ? 'Đủ điều kiện rút ✓' : `${withdrawProgress}% / 500K`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 relative z-10">
          <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${withdrawProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Chỉ tính Xu làm nhiệm vụ thật (Không gồm Xu tặng)</span>
            <span className="text-emerald-300">Trả 10:00 Sáng Thứ 2</span>
          </div>
        </div>
      </div>

      {/* Ô 2: VÍ XU FOLLOW CHÉO (CHỈ DÙNG MUA GÓI — KHÔNG QUY ĐỔI RÚT TIỀN) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-950/50 via-[#0E1124] to-[#080B14] border border-purple-500/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black text-white font-display uppercase tracking-wide">
                  Ví Xu Follow Chéo &amp; Quà Tặng
                </h4>
                <FeatureGuideTooltip
                  title="Ví Xu Follow Chéo & Quà Tặng 500.000 Xu (Chỉ Mua Gói — Không Rút Tiền)"
                  description="Ví này chứa phần quà tặng đăng ký lần đầu (+500.000 Xu — chỉ tặng 1 lần duy nhất) và toàn bộ số Xu kiếm từ đi Follow chéo / tương tác chéo. Tách riêng hoàn toàn với Ví Xu Làm Nhiệm Vụ!"
                  steps={[
                    '500.000 Xu quà tặng và Xu Follow Chéo KHÔNG được cộng dồn vào Ví Nhiệm Vụ và KHÔNG được rút thành tiền mặt.',
                    'Bạn được tự do dùng 100% số Xu trong ví này để MUA BẤT KỲ GÓI dịch vụ nào để người khác follow / tương tác cho kênh của bạn.',
                    'Khi mua gói bằng Xu, hệ thống tự ưu tiên trừ Ví Xu Follow Chéo này trước!'
                  ]}
                  tips="Muốn kiếm tiền rút về tài khoản ngân hàng (min 500.000đ), hãy đi làm Nhiệm Vụ chính thức để cộng vào Ví Xu Làm Nhiệm Vụ."
                  badge="CHỈ MUA GÓI • KHÔNG RÚT"
                  size="sm"
                />
              </div>
              <span className="text-[10px] font-mono text-purple-300 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Chỉ dùng mua gói • Không quy đổi rút tiền</span>
              </span>
            </div>
          </div>

          {onNavigateToMarketplace && (
            <button
              type="button"
              onClick={onNavigateToMarketplace}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:brightness-110 text-white font-black text-[11px] font-mono flex items-center gap-1 shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mua Gói</span>
            </button>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2 relative z-10 pt-1">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono font-mono-numbers leading-none">
              {crossFollowCoins.toLocaleString()} <span className="text-sm text-pink-300">Xu</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-1">
              Trạng thái: <strong className="text-amber-300">Mua được tất cả gói tăng trưởng</strong>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/35">
            Không rút tiền
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[10px] text-slate-300 font-mono flex items-center justify-between gap-2 relative z-10">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Tự động ưu tiên dùng Xu Follow Chéo khi mua gói</span>
          </span>
        </div>
      </div>
    </div>
  );
};
