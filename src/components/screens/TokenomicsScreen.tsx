import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  Coins, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Building2,
  FileCode2,
  DollarSign,
  Wallet
} from 'lucide-react';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { ScreenId } from '../../types';

interface TokenomicsScreenProps {
  darkMode: boolean;
  onNavigate?: (screen: ScreenId) => void;
}

export const TokenomicsScreen: React.FC<TokenomicsScreenProps> = ({ darkMode, onNavigate }) => {
  const { 
    user, 
    openDeposit,
    openWithdraw,
    openKycModal,
    showToast 
  } = useTikTokApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Coins className="h-3.5 w-3.5 text-neonGold" />
              <span>HỆ THỐNG KINH TẾ XU • 1 XU = 1 VNĐ TIỀN MẶT CỐ ĐỊNH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Trung Tâm Ví Xu &amp; Quản Lý Số Dư Minh Bạch
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Toàn bộ hệ thống hoạt động thống nhất bằng <strong>Xu (1 Xu = 1 VNĐ)</strong>. Bạn tích lũy Xu từ việc làm nhiệm vụ và toàn quyền rút tiền mặt về ngân hàng theo kỳ hạch toán định kỳ hoặc tạo chiến dịch kéo tương tác cho kênh của mình.
            </p>
          </div>

          {/* Quick Rate & Balance Box */}
          <div className="p-5 rounded-2xl bg-black/70 border border-amber-500/40 text-center shrink-0 min-w-[220px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Tỷ Giá Quy Đổi Chuẩn</div>
            <div className="text-2xl font-black text-neonGold font-mono mt-1">
              1 XU = 1 VNĐ
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Rút tiền thật 100%</div>
          </div>
        </div>
      </div>

      {/* Main Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Coins */}
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-amber-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Số Dư Xu Khả Dụng</span>
            <Coins className="w-5 h-5 text-neonGold" />
          </div>
          <div className="text-3xl font-black text-neonGold font-mono">
            {(user.avaliveCoins || 0).toLocaleString()} <span className="text-sm font-normal text-white">Xu</span>
          </div>
          <div className="text-xs text-emerald-400 font-mono font-bold">
            ≈ {user.coinsValueVND} Tiền mặt
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={openDeposit}
              className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
            >
              + Nạp Xu
            </button>
            <button
              onClick={openWithdraw}
              className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Rút Tiền
            </button>
          </div>
        </div>

        {/* Earned from Tasks */}
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Nhiệm Vụ Đã Làm</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {user.completedTasksCount || 48} <span className="text-sm font-normal text-slate-400">lượt</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Tích lũy Xu trực tiếp vào ví cá nhân
          </div>
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={() => onNavigate && onNavigate('tasks')}
              className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors"
            >
              Xem Danh Sách Nhiệm Vụ →
            </button>
          </div>
        </div>

        {/* Campaigns Created */}
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Chiến Dịch Đang Chạy</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">
            {user.createdCampaignsCount || 3} <span className="text-sm font-normal text-slate-400">kênh</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Follow, Tim, Seeding, Mắt Live
          </div>
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={() => onNavigate && onNavigate('create_campaign')}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition-colors"
            >
              + Tạo Chiến Dịch Mới →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Use-cases for Xu */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white">Toàn Quyền Sử Dụng Xu Của Bạn</h3>
        <p className="text-xs text-slate-400">
          Xu trong tài khoản là tài sản thực tế của bạn, không bị ràng buộc hay khấu trừ vô lý:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">1</div>
            <div className="font-bold text-white text-xs">Rút Tiền Về Ngân Hàng</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Quy đổi 1 Xu = 1 VNĐ rút thẳng về số tài khoản ngân hàng chính chủ của bạn theo kỳ đối soát định kỳ.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">2</div>
            <div className="font-bold text-white text-xs">Tăng Follow Thật Cho Kênh</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dùng Xu khởi chạy chiến dịch kéo follower thật 100% người dùng hoạt động.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">3</div>
            <div className="font-bold text-white text-xs">Thả Tim &amp; Seeding Video</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dùng Xu để cộng đồng vào xem 15s, thả tim và comment kích nổ đề xuất For You Page.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">4</div>
            <div className="font-bold text-white text-xs">Kéo Mắt Xem Livestream</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dùng Xu để kéo hàng trăm mắt xem giữ live 3-5 phút, chốt đơn TikTok Shop bùng nổ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
