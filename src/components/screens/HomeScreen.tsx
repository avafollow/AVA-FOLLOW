import React, { useState } from 'react';
import { 
  Play, 
  Flame, 
  Sparkles, 
  UserPlus, 
  Heart, 
  Radio, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Gift, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Users, 
  Video, 
  Eye, 
  MessageSquare,
  Building2,
  Cpu,
  BarChart3,
  Share2,
  Award,
  Lock,
  BadgeCheck,
  ShieldAlert,
  Clock,
  Target,
  ChevronRight,
  Star,
  Smartphone,
  Briefcase,
  GraduationCap,
  Store,
  LineChart,
  Banknote,
  LayoutGrid,
  UserCheck,
  PlusCircle,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { ScreenId } from '../../types';
import { KocRegistrationModal } from '../modals/KocRegistrationModal';
import { BrandLogo } from '../common/BrandLogo';

export const HomeScreen: React.FC<{
  darkMode: boolean;
  onNavigate: (screen: ScreenId) => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenCreateCampaign?: () => void;
}> = ({ darkMode, onNavigate, onOpenDeposit, onOpenWithdraw, onOpenCreateCampaign }) => {
  const { 
    user, 
    tasks, 
    livestreamTasks, 
    growthServices, 
    openRunner, 
    openFeedRunner, 
    openLiveRunner, 
    openLuckyWheel, 
    openPolicy,
    openShareModal
  } = useTikTokApp();

  const [isKocModalOpen, setIsKocModalOpen] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Center / Left Main Column */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* ========================================================================= */}
        {/* HERO BANNER ULTRA-PREMIUM: CỖ MÁY KIẾM TIỀN TẠI NHÀ & BỨT PHÁ TÀI CHÍNH */}
        {/* ========================================================================= */}
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border-2 shadow-2xl transition-all ${
          darkMode 
            ? 'bg-gradient-to-br from-[#1E0916] via-[#120824] to-[#080B1A] border-rose-500/40 shadow-[0_0_60px_rgba(255,0,80,0.22)]' 
            : 'bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 border-rose-300 shadow-xl'
        }`}>
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">

            {/* 2. TIÊU ĐỀ CHÍNH & CÂU HÚT CHỐT SALE */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-display">
                NỀN TẢNG KẾT NỐI TƯƠNG TÁC{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0050] via-[#FF5E00] to-[#00F2FE] drop-shadow-[0_0_35px_rgba(255,0,80,0.45)]">
                  NGƯỜI THẬT &amp; KOC HÀNG ĐẦU
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-3xl leading-relaxed">
                Đừng để thời gian lướt TikTok trôi qua vô nghĩa! Tạo ngay nguồn thu nhập{' '}
                <span className="font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  200.000đ - 5.000.000đ+ / NGÀY
                </span>{' '}
                hoàn toàn <span className="font-black px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">KHÔNG CẦN VỐN</span>, không ôm hàng, nhận tiền mặt về tài khoản ngân hàng chỉ trong{' '}
                <span className="font-black text-amber-300">5 PHÚT</span>!
              </p>
            </div>

            {/* 3. LƯỚI CÁC TAB CHỨC NĂNG TÁC VỤ CHÍNH (QUICK ACTION GRID) */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-300 font-mono flex items-center gap-1.5 uppercase">
                  <LayoutGrid className="w-4 h-4 text-neonGold" /> TRUNG TÂM TÁC VỤ &amp; KIẾM TIỀN CHỦ LỰC
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Bấm vào ô để truy cập nhanh</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {/* Tab 1: Follow Chéo Cộng Đồng Creator & Xem Video */}
                <button
                  type="button"
                  onClick={() => openFeedRunner('cross_follow')}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-950/50 via-black to-[#0D111E] border border-emerald-500/50 hover:border-emerald-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg shadow-emerald-950/30 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">CHÉO</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-emerald-300 transition-colors">
                      Follow Chéo
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono font-bold mt-0.5">Kiếm xu ngay</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Lướt video &amp; tương tác chéo</div>
                  </div>
                </button>

                {/* Tab 2: Nhiệm Vụ Follow & Tim */}
                <button
                  type="button"
                  onClick={() => onNavigate('tasks')}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-black to-[#0D111E] border border-cyan-500/40 hover:border-cyan-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">{tasks.length} NV</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-cyan-300 transition-colors">
                      Làm Nhiệm Vụ
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono font-bold mt-0.5">Nhận Xu ngay</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Follow, like &amp; seeding</div>
                  </div>
                </button>

                {/* Tab 4: Tạo Chiến Dịch Doanh Nghiệp */}
                <button
                  type="button"
                  onClick={onOpenCreateCampaign || (() => onNavigate('create_campaign'))}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-black to-[#0D111E] border border-purple-500/40 hover:border-purple-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold">Xây Kênh</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-purple-300 transition-colors">
                      Tạo Chiến Dịch
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono font-bold mt-0.5">Kéo Follow Thật</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Bùng nổ tương tác kênh</div>
                  </div>
                </button>

                {/* Tab 5: Kết Nối KOC & Escrow */}
                <button
                  type="button"
                  onClick={() => onNavigate('booking_escrow')}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-950/40 via-black to-[#0D111E] border border-pink-500/40 hover:border-pink-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px] font-mono font-bold">Escrow</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-pink-300 transition-colors">
                      Kết Nối KOC
                    </div>
                    <div className="text-[10px] text-pink-300 font-mono font-bold mt-0.5">500K - 5M / Job</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Booking review &amp; AI Studio</div>
                  </div>
                </button>

                {/* Tab 6: Mắt Xem Livestream */}
                <button
                  type="button"
                  onClick={() => openFeedRunner('live')}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black to-[#0D111E] border border-amber-500/40 hover:border-amber-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                      <Radio className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">Trực Tiếp</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-amber-300 transition-colors">
                      Xem Livestream
                    </div>
                    <div className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">+{livestreamTasks.length} Phòng Live</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Giữ mắt xem kiếm Xu</div>
                  </div>
                </button>

                {/* Tab 7: Vòng Quay May Mắn */}
                <button
                  type="button"
                  onClick={openLuckyWheel}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black to-[#0D111E] border border-emerald-500/40 hover:border-emerald-400 hover:scale-[1.03] active:scale-[0.98] transition-all text-left flex flex-col justify-between space-y-2 shadow-lg group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">100% Trúng</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white font-display group-hover:text-emerald-300 transition-colors">
                      Vòng Quay
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono font-bold mt-0.5">Nổ Quà Tự Động</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Nhận Xu &amp; Follow free</div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* BIỂU ĐỒ HÌNH TRÒN: CƠ CẤU THU NHẬP, XU, FOLLOW & NHIỆM VỤ THỜI GIAN THỰC */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0D111E] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-wide">
                  BÁO CÁO THU NHẬP • BIỂU ĐỒ TRÒN &amp; CHỈ SỐ HOẠT ĐỘNG
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Thống kê chi tiết tỷ trọng nguồn thu nhập từ Xu, Follow, Xem video và nhiệm vụ trên tài khoản.
              </p>
            </div>

            <button
              onClick={() => onNavigate('analytics')}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition-all self-start sm:self-center cursor-pointer"
            >
              <span>Xem Báo Cáo Đầy Đủ</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG DONUT CHART */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-4 bg-black/40 rounded-3xl border border-white/5">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Segment 1: Follow Kênh (40%) - Rose */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#FF0050"
                    strokeWidth="11"
                    strokeDasharray="100.5 138.2"
                    strokeDashoffset="0"
                    className="transition-all duration-700"
                  />
                  {/* Segment 2: Xem Video FYP (25%) - Amber */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="11"
                    strokeDasharray="59.7 179"
                    strokeDashoffset="-100.5"
                    className="transition-all duration-700"
                  />
                  {/* Segment 3: KOC Review & Escrow (20%) - Purple */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#8B5CF6"
                    strokeWidth="11"
                    strokeDasharray="47.7 191"
                    strokeDashoffset="-160.2"
                    className="transition-all duration-700"
                  />
                  {/* Segment 4: Xem Livestream (15%) - Cyan */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#00F2FE"
                    strokeWidth="11"
                    strokeDasharray="35.8 202.9"
                    strokeDashoffset="-207.9"
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Inner Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Tổng Thu Nhập</span>
                  <span className="text-lg sm:text-xl font-black text-neonGold font-mono">
                    {(user.avaliveCoins || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">≈ {user.coinsValueVND}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono mt-2">
                * Tỷ giá trực tiếp 1 Xu = 1 VNĐ rút tiền về ATM
              </div>
            </div>

            {/* BREAKDOWN METRICS & PROGRESS BARS */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Follow Kênh (40%)</span>
                    <span className="w-2 h-2 rounded-full bg-[#FF0050]" />
                  </div>
                  <div className="text-sm font-black text-rose-300 mt-1">
                    {Math.round((user.avaliveCoins || 0) * 0.4).toLocaleString()} Xu
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">128 lượt follow thành công</div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Xem Video FYP (25%)</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="text-sm font-black text-amber-300 mt-1">
                    {Math.round((user.avaliveCoins || 0) * 0.25).toLocaleString()} Xu
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Xem 15s đếm ngược tự động</div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Booking KOC (20%)</span>
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                  </div>
                  <div className="text-sm font-black text-purple-300 mt-1">
                    {Math.round((user.avaliveCoins || 0) * 0.2).toLocaleString()} Xu
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Ký quỹ Escrow bảo hành 3 ngày</div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Mắt Live &amp; NV (15%)</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <div className="text-sm font-black text-cyan-300 mt-1">
                    {Math.round((user.avaliveCoins || 0) * 0.15).toLocaleString()} Xu
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Giữ mắt live &amp; like seeding</div>
                </div>
              </div>

              {/* Progress Tracker Strip */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300 font-bold">Chỉ Tiêu Nhiệm Vụ Hôm Nay:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {user.dailyTasksCompleted || 12}/15 Hoàn Thành (80%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-rose-500 rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>Còn 3 nhiệm vụ để nhận 1 lượt Quay May Mắn Free</span>
                  <button
                    onClick={() => onNavigate('tasks')}
                    className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                  >
                    Làm ngay →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live streams preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Phòng Live Cần Mắt Xem ({livestreamTasks.length} Phòng)</span>
            </h3>
            <button 
              onClick={() => onNavigate('tasks')}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {livestreamTasks.slice(0, 2).map((live) => (
              <div
                key={live.id}
                onClick={() => openLiveRunner(live)}
                className="cursor-pointer p-4 rounded-2xl bg-[#0D111E] border border-white/10 hover:border-rose-500/40 transition-all flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={live.channelAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/50"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs truncate">{live.roomTitle}</div>
                    <div className="text-[10px] text-rose-400 font-mono truncate">{live.channelHandle}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-neonGold font-mono">+{live.rewardPerMinute} Xu/p</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Xem {live.targetMinutes}m</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-80 shrink-0 space-y-4">
        {/* User Profile & Balance Box */}
        <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt=""
              className="h-11 w-11 rounded-full object-cover ring-2 ring-rose-500"
            />
            <div className="min-w-0 flex-1">
              <div className="font-black text-white text-xs truncate">{user.name}</div>
              <div className="text-[11px] text-rose-400 font-mono truncate">{user.tiktokHandle || user.tiktokConnected || '@creator'}</div>
              <div className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-white/5 text-[9px] font-mono text-neonGold font-bold">
                Hạng {user.rankLevel}
              </div>
            </div>
          </div>

          {/* Wallet Balance Display: 100% Xu */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-purple-950/30 to-black border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Số dư Xu trong ví:</span>
              <Coins className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {(user.avaliveCoins || 0).toLocaleString()} <span className="text-xs text-white font-normal">Xu</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold">
              ≈ {user.coinsValueVND} (Tỷ giá 1 Xu = 1 VNĐ)
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <button
                onClick={onOpenDeposit}
                className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-colors"
              >
                + Nạp Xu
              </button>
              <button
                onClick={onOpenWithdraw}
                className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors"
              >
                Rút Tiền
              </button>
            </div>
          </div>
        </div>

        {/* Quick KOC Recruitment Banner (Ảnh 1) */}
        <div 
          onClick={() => setIsKocModalOpen(true)}
          className="cursor-pointer p-4 rounded-3xl bg-gradient-to-r from-[#8B15FF]/30 via-[#E11D74]/20 to-[#7928CA]/30 border border-pink-500/40 hover:border-pink-400 transition-all space-y-2.5 shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black font-mono uppercase tracking-wider">
              DÀNH CHO CREATOR
            </span>
            <span className="text-[10px] text-amber-300 font-mono font-bold">Thu Nhập 500k-5M</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white font-display group-hover:text-pink-300 transition-colors">
                Đăng Ký Làm KOC Nhận Booking
              </h4>
              <p className="text-[10px] text-slate-300">Nhận mẫu miễn phí • Ký quỹ sàn an toàn 100%</p>
            </div>
          </div>
          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-[#8B15FF] via-[#E11D74] to-[#7928CA] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md group-hover:brightness-110 cursor-pointer font-display">
            <span>Đăng Ký Ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Shortcut: Cộng Đồng Creator & Nhận 5.000 Xu Song Phương */}
        <div 
          onClick={() => onNavigate('affiliate')}
          className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-[#0D111E] border-2 border-amber-500/40 hover:border-amber-400 transition-all space-y-2 shadow-xl group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>CỘNG ĐỒNG CREATOR TIÊN PHONG</span>
            </span>
            <span className="text-[10px] font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-400 px-2 py-0.5 rounded-full font-mono shadow">
              🎁 NHẬN 5.000 XU ĐÔI
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-snug">
            Rủ bạn bè gia nhập: <strong className="text-amber-300">Cả 2 cùng nhận +5.000 Xu</strong> để follow chéo, đẩy view thật xây kênh &amp; hưởng hoa hồng đại lý lên đến 35% an toàn trong ví!
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
            <span className="text-emerald-400 font-bold">✓ Ai đi trước hưởng quyền lợi trước</span>
            <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              <span>Mời bạn bè ngay</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Quick Shortcut: Báo Cáo Thu Nhập */}
        <div 
          onClick={() => onNavigate('analytics')}
          className="cursor-pointer p-4 rounded-2xl bg-[#0D111E] border border-white/10 hover:border-white/20 transition-all space-y-1.5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Báo Cáo Thu Nhập</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Biểu đồ doanh thu theo ngày, số phút xem video và hiệu suất làm nhiệm vụ.
          </p>
        </div>
      </div>

      {/* Modal: Đăng Ký Làm KOC Nhận Booking */}
      <KocRegistrationModal 
        isOpen={isKocModalOpen} 
        onClose={() => setIsKocModalOpen(false)} 
      />
    </div>
  );
};
