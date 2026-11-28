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
  RefreshCw,
  Mail,
  Globe,
  Key
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { ScreenId } from '../../types';
import { KocRegistrationModal } from '../modals/KocRegistrationModal';
import { BrandLogo } from '../common/BrandLogo';
import { SmartMediaThumbnail } from '../common/SmartMediaThumbnail';
import { DualWalletCards } from '../common/DualWalletCards';
import { getTikTokAvatar, getPlatformAvatar, detectPlatform } from '../../data/videoSources';

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
    campaigns,
    growthServices, 
    openRunner, 
    openFeedRunner, 
    openLiveRunner, 
    openLuckyWheel, 
    openPolicy,
    openShareModal,
    openConnect,
    refreshAllData,
    userCompletedActions,
    isChannelFollowed
  } = useTikTokApp();

  const [isKocModalOpen, setIsKocModalOpen] = useState(false);

  // Dynamic real metrics (Không dùng số ảo)
  const completedTasksCount = user.dailyTasksCompleted || 0;
  const totalDailyTarget = Math.max(10, tasks.length);
  const progressPercent = Math.min(100, Math.round((completedTasksCount / totalDailyTarget) * 100));
  const remainingForBonus = Math.max(0, 5 - (completedTasksCount % 5));

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Center / Left Main Column */}
      <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
        {/* ========================================================================= */}
        {/* THANH KẾT NỐI 1-CHẠM 3 NỀN TẢNG (HIỂN THỊ ĐÚNG TÊN, LOGO & SỐ FOLLOW THẬT) */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0F1426] via-[#0B1020] to-[#120C22] border border-white/15 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] sm:text-xs font-black text-white font-display uppercase tracking-wide">
                Tài Khoản Thực Hiện Nhiệm Vụ (TikTok • YouTube • Facebook)
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-mono font-bold">
              🎁 Tặng +500.000 Xu lần đầu kết nối (1 lần duy nhất)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* TikTok Chip */}
            <button
              type="button"
              onClick={() => {
                try { localStorage.setItem('ava_oauth_reopen_tab', 'tiktok'); } catch {}
                openConnect();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 min-w-0 ${
                user.isTikTokVerified && user.tiktokConnected
                  ? 'bg-emerald-950/35 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-black/60 border-rose-500/40 hover:border-rose-400'
              }`}
            >
              {user.isTikTokVerified && user.tiktokConnected ? (
                <img
                  src={user.tiktokAvatar || getTikTokAvatar(user.tiktokConnected.replace(/^@+/, ''))}
                  alt="TikTok"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.tiktokNickname || user.tiktokConnected || 'TT')}&background=010101&color=fff&bold=true`;
                  }}
                  className="w-9 h-9 rounded-xl object-cover border border-rose-400/50 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-black border border-white/15 flex items-center justify-center text-[#25F4EE] shrink-0 text-sm font-black">
                  ♪
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white truncate">
                  {user.isTikTokVerified && user.tiktokConnected
                    ? (user.tiktokNickname || user.tiktokConnected)
                    : 'TikTok'}
                </div>
                <div className={`text-[10px] font-mono truncate ${
                  user.isTikTokVerified && user.tiktokConnected ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {user.isTikTokVerified && user.tiktokConnected
                    ? `${user.tiktokConnected} • ${(user.tiktokFollowers || 0).toLocaleString()} FL`
                    : '⚡ Kết nối 1-chạm để làm NV TikTok'}
                </div>
              </div>
            </button>

            {/* YouTube Chip */}
            <button
              type="button"
              onClick={() => {
                try { localStorage.setItem('ava_oauth_reopen_tab', 'youtube'); } catch {}
                openConnect();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 min-w-0 ${
                user.isYoutubeVerified && user.youtubeConnected
                  ? 'bg-emerald-950/35 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-red-950/30 border-red-500/40 hover:border-red-400'
              }`}
            >
              {user.isYoutubeVerified && user.youtubeConnected ? (
                <img
                  src={user.youtubeAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.youtubeChannelTitle || user.youtubeConnected)}&background=FF0000&color=fff&bold=true`}
                  alt="YouTube"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.youtubeChannelTitle || 'YT')}&background=FF0000&color=fff&bold=true`;
                  }}
                  className="w-9 h-9 rounded-xl object-cover border border-red-400/50 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 text-xs font-black">
                  ▶
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white truncate">
                  {user.isYoutubeVerified && user.youtubeConnected
                    ? (user.youtubeChannelTitle || user.youtubeConnected)
                    : 'YouTube'}
                </div>
                <div className={`text-[10px] font-mono truncate ${
                  user.isYoutubeVerified && user.youtubeConnected ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {user.isYoutubeVerified && user.youtubeConnected
                    ? `${user.youtubeConnected} • ${(user.youtubeSubscribers || 0).toLocaleString()} Sub`
                    : '⚡ Kết nối 1-chạm để làm NV YouTube'}
                </div>
              </div>
            </button>

            {/* Facebook Chip */}
            <button
              type="button"
              onClick={() => {
                try { localStorage.setItem('ava_oauth_reopen_tab', 'facebook'); } catch {}
                openConnect();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2.5 min-w-0 ${
                user.isFacebookVerified && user.facebookConnected
                  ? 'bg-emerald-950/35 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-blue-950/30 border-blue-500/40 hover:border-blue-400'
              }`}
            >
              {user.isFacebookVerified && user.facebookConnected ? (
                <img
                  src={user.facebookAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.facebookName || user.facebookConnected)}&background=1877F2&color=fff&bold=true`}
                  alt="Facebook"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.facebookName || 'FB')}&background=1877F2&color=fff&bold=true`;
                  }}
                  className="w-9 h-9 rounded-xl object-cover border border-blue-400/50 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 text-sm font-black">
                  f
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white truncate">
                  {user.isFacebookVerified && user.facebookConnected
                    ? (user.facebookName || user.facebookConnected)
                    : 'Facebook'}
                </div>
                <div className={`text-[10px] font-mono truncate ${
                  user.isFacebookVerified && user.facebookConnected ? 'text-emerald-300' : 'text-blue-300'
                }`}>
                  {user.isFacebookVerified && user.facebookConnected
                    ? `fb.com/${user.facebookConnected} • ${(user.facebookFollowers || 0).toLocaleString()} FL`
                    : '⚡ Kết nối 1-chạm để làm NV Facebook'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2 Ô VÍ XU TÁCH BIỆT (VÍ XU LÀM NHIỆM VỤ RÚT MIN 500K & VÍ XU FOLLOW CHÉO) */}
        {/* ========================================================================= */}
        <DualWalletCards
          onOpenWithdraw={onOpenWithdraw}
          onNavigateToMarketplace={() => onNavigate('marketplace')}
          compact
        />

        {/* ========================================================================= */}
        {/* HERO BANNER ULTRA-PREMIUM: CỖ MÁY KIẾM TIỀN TẠI NHÀ & BỨT PHÁ TÀI CHÍNH */}
        {/* ========================================================================= */}
        <div className={`relative overflow-hidden rounded-3xl p-4 sm:p-8 lg:p-10 border-2 shadow-2xl transition-all ${
          darkMode 
            ? 'bg-gradient-to-br from-[#1E0916] via-[#120824] to-[#080B1A] border-rose-500/40 shadow-[0_0_60px_rgba(255,0,80,0.22)]' 
            : 'bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 border-rose-300 shadow-xl'
        }`}>
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* 1. TIÊU ĐỀ CHÍNH */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-display">
                NỀN TẢNG KẾT NỐI TƯƠNG TÁC{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0050] via-[#FF5E00] to-[#00F2FE] drop-shadow-[0_0_35px_rgba(255,0,80,0.45)]">
                  NGƯỜI THẬT &amp; KOC HÀNG ĐẦU
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-3xl leading-relaxed">
                Kết nối kênh TikTok, xem video FYP, follow chéo người thật, chia sẻ lan tỏa và nhận Xu tích lũy rút tiền mặt về tài khoản ngân hàng uy tín, nhanh chóng và an toàn!
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
                    <div className="text-[10px] text-pink-300 font-mono font-bold mt-0.5">Booking &amp; Review</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Ký quỹ Escrow &amp; AI Studio</div>
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

        {/* ====================================================================== */}
        {/* 🔥 CTA KHUYẾN KHÍCH TẠO CHIẾN DỊCH — LUÔN ĐẬP VÀO MẮT NGƯỜI DÙNG   */}
        {/* Vị trí: Ngay dưới lưới tác vụ chính — nơi người dùng nhìn nhiều nhất */}
        {/* ====================================================================== */}
        {(() => {
          const coinBalance = user.avaliveCoins || 0;
          const activeCampaigns = campaigns.filter(c => c.status === 'running' || c.status === 'pending').length;
          const msgs = [
            { icon: '📣', highlight: 'Dùng Xu tạo chiến dịch Follow', body: 'Thu hút hàng trăm người thật follow kênh TikTok của bạn ngay hôm nay!' },
            { icon: '🎬', highlight: 'Tăng lượt xem video bằng Xu', body: 'Video được xem bởi người thật → Tăng reach tự nhiên, viral nhanh hơn!' },
            { icon: '❤️‍🔥', highlight: 'Chiến dịch Like giá cực rẻ', body: 'Mỗi lượt tương tác từ người thật chỉ tốn vài Xu — hiệu quả gấp 10x!' },
            { icon: '📡', highlight: 'Live nhiều viewer hơn với Xu', body: 'Kéo người thật vào xem livestream — TikTok đẩy phòng live của bạn lên Top!' },
            { icon: '🛍️', highlight: 'Chiến dịch bán hàng — đúng tệp', body: 'Tiếp cận đúng khách hàng mục tiêu, tăng đơn hàng thực tế từ cộng đồng!' },
            { icon: '🤝', highlight: 'Cộng đồng cùng nhau phát triển', body: 'Bạn lên chiến dịch → mọi người có việc làm → cả hai cùng win!' },
          ];
          const msgIdx = Math.floor(Date.now() / 12000) % msgs.length;
          const msg = msgs[msgIdx];
          return (
            <div 
              onClick={onOpenCreateCampaign || (() => onNavigate('create_campaign'))}
              className="relative overflow-hidden rounded-2xl border-2 border-pink-500/60 bg-gradient-to-r from-[#1a0a1e] via-[#120824] to-[#0d1226] shadow-xl shadow-pink-950/30 cursor-pointer hover:border-pink-400 hover:shadow-pink-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              {/* Animated glow bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/8 via-purple-600/5 to-cyan-600/8 animate-pulse pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 p-3.5 sm:p-4">
                {/* Left: Icon + xu balance */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-pink-950/40 group-hover:scale-110 transition-transform">
                    {msg.icon}
                  </div>
                  {coinBalance > 0 && (
                    <div className="text-[9px] font-mono font-black text-pink-400 bg-pink-500/10 border border-pink-500/30 rounded-lg px-1.5 py-0.5 text-center whitespace-nowrap">
                      {coinBalance >= 1000000 
                        ? `${(coinBalance/1000000).toFixed(1)}M Xu`
                        : coinBalance >= 1000 
                          ? `${Math.floor(coinBalance/1000)}K Xu`
                          : `${coinBalance} Xu`}
                    </div>
                  )}
                </div>
                {/* Center: Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-wider bg-pink-500/15 border border-pink-500/30 rounded px-1.5 py-0.5">
                      💡 Dùng Xu của bạn
                    </span>
                    {activeCampaigns > 0 && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5">
                        {activeCampaigns} chiến dịch đang chạy
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-black text-white font-display group-hover:text-pink-200 transition-colors leading-tight">
                    {msg.highlight}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">{msg.body}</p>
                </div>
                {/* Right: CTA arrow */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlusCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] font-mono font-black text-pink-400 uppercase">Tạo ngay</span>
                </div>
              </div>
            </div>
          );
        })()}

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

          {(() => {
            // TÍNH TOÁN 100% CON SỐ THẬT VÀ CHI TIẾT TỪ HÀNH ĐỘNG CỦA NGƯỜI DÙNG
            const actionsList = Object.values(userCompletedActions || {});

            // 1. Follow Kênh
            const completedFollowList = actionsList.filter(a => a.followed || tasks.some(t => t.id === a.taskId && t.type === 'follow'));
            const followEarnedFromActions = completedFollowList.reduce((sum, a) => sum + (a.totalCoinsEarned || 200), 0);
            const followEarnedFromTx = (user.transactions || []).filter(tx => tx.missionType === 'follow' && tx.isPositive).reduce((sum, tx) => {
              const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
              return sum + num;
            }, 0);
            const followEarned = Math.max(followEarnedFromActions, followEarnedFromTx);
            const followCount = completedFollowList.length;

            // 2. Xem Video FYP
            const completedWatchList = actionsList.filter(a => a.viewed && !a.followed);
            const watchEarnedFromActions = completedWatchList.reduce((sum, a) => sum + (a.totalCoinsEarned || 200), 0);
            const watchEarnedFromTx = (user.transactions || []).filter(tx => tx.missionType === 'watch' && tx.isPositive).reduce((sum, tx) => {
              const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
              return sum + num;
            }, 0);
            const watchEarned = Math.max(watchEarnedFromActions, watchEarnedFromTx);
            const watchCount = completedWatchList.length;

            // 3. Booking KOC & Escrow
            const completedKocList = actionsList.filter(a => a.taskId?.startsWith('booking_') || a.taskId?.startsWith('koc_'));
            const kocEarnedFromActions = completedKocList.reduce((sum, a) => sum + (a.totalCoinsEarned || 50000), 0);
            const kocEarnedFromTx = (user.transactions || []).filter(tx => (tx.missionType === 'koc' || tx.missionType === 'review' || tx.method?.includes('Booking')) && tx.isPositive).reduce((sum, tx) => {
              const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
              return sum + num;
            }, 0);
            const kocEarned = Math.max(kocEarnedFromActions, kocEarnedFromTx);
            const kocCount = completedKocList.length;

            // 4. Mắt Live & Nhiệm Vụ Khác (Like, Comment, Share, Livestreams)
            const completedLiveList = actionsList.filter(a => 
              a.taskId?.startsWith('live_') || 
              (!completedFollowList.includes(a) && !completedWatchList.includes(a) && !completedKocList.includes(a))
            );
            const liveEarnedFromActions = completedLiveList.reduce((sum, a) => sum + (a.totalCoinsEarned || 400), 0);
            const liveEarnedFromTx = (user.transactions || []).filter(tx => (tx.missionType === 'live' || tx.missionType === 'livestream' || tx.missionType === 'like' || tx.missionType === 'comment' || tx.missionType === 'share' || tx.method?.includes('Live')) && tx.isPositive).reduce((sum, tx) => {
              const num = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
              return sum + num;
            }, 0);
            const liveEarned = Math.max(liveEarnedFromActions, liveEarnedFromTx);
            const liveCount = completedLiveList.length;

            const totalEarnedFromTasks = followEarned + watchEarned + kocEarned + liveEarned;

            // Tỷ lệ % chuẩn xác
            const followPct = totalEarnedFromTasks > 0 ? Math.round((followEarned / totalEarnedFromTasks) * 100) : 0;
            const watchPct = totalEarnedFromTasks > 0 ? Math.round((watchEarned / totalEarnedFromTasks) * 100) : 0;
            const kocPct = totalEarnedFromTasks > 0 ? Math.round((kocEarned / totalEarnedFromTasks) * 100) : 0;
            const livePct = totalEarnedFromTasks > 0 ? Math.max(0, 100 - followPct - watchPct - kocPct) : 0;

            const circ = 238.76;
            const dashFollow = (followPct / 100) * circ;
            const dashWatch = (watchPct / 100) * circ;
            const dashKoc = (kocPct / 100) * circ;
            const dashLive = (livePct / 100) * circ;

            const offsetFollow = 0;
            const offsetWatch = -dashFollow;
            const offsetKoc = -(dashFollow + dashWatch);
            const offsetLive = -(dashFollow + dashWatch + dashKoc);

            // Tiến độ nhiệm vụ hôm nay chính xác
            const totalRealTasksCompleted = Math.max(user.dailyTasksCompleted || 0, user.completedTasksCount || 0, actionsList.length);
            const dailyTarget = Math.max(10, tasks.length);
            const realProgressPercent = Math.min(100, Math.round((totalRealTasksCompleted / dailyTarget) * 100));
            const realRemainingForBonus = Math.max(0, 5 - (totalRealTasksCompleted % 5));

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* SVG DONUT CHART */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-4 bg-black/40 rounded-3xl border border-white/5">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      {totalEarnedFromTasks === 0 ? (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#1E293B"
                          strokeWidth="11"
                          strokeDasharray="238.76 238.76"
                        />
                      ) : (
                        <>
                          {/* Segment 1: Follow Kênh (Rose) */}
                          {followPct > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#FF0050"
                              strokeWidth="11"
                              strokeDasharray={`${dashFollow} ${circ}`}
                              strokeDashoffset={offsetFollow}
                              className="transition-all duration-700"
                            />
                          )}
                          {/* Segment 2: Xem Video FYP (Amber) */}
                          {watchPct > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#F59E0B"
                              strokeWidth="11"
                              strokeDasharray={`${dashWatch} ${circ}`}
                              strokeDashoffset={offsetWatch}
                              className="transition-all duration-700"
                            />
                          )}
                          {/* Segment 3: KOC Review & Escrow (Purple) */}
                          {kocPct > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#8B5CF6"
                              strokeWidth="11"
                              strokeDasharray={`${dashKoc} ${circ}`}
                              strokeDashoffset={offsetKoc}
                              className="transition-all duration-700"
                            />
                          )}
                          {/* Segment 4: Xem Livestream & Khác (Cyan) */}
                          {livePct > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#00F2FE"
                              strokeWidth="11"
                              strokeDasharray={`${dashLive} ${circ}`}
                              strokeDashoffset={offsetLive}
                              className="transition-all duration-700"
                            />
                          )}
                        </>
                      )}
                    </svg>

                    {/* Inner Center Stats */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Tổng Thu Nhập Thật</span>
                      <span className="text-lg sm:text-xl font-black text-neonGold font-mono">
                        {totalEarnedFromTasks.toLocaleString()} Xu
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">
                        ≈ {totalEarnedFromTasks.toLocaleString('vi-VN')}đ
                      </span>
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
                        <span className="text-slate-400 text-[10px]">Follow Kênh ({followPct}%)</span>
                        <span className="w-2 h-2 rounded-full bg-[#FF0050]" />
                      </div>
                      <div className="text-sm font-black text-rose-300 mt-1">
                        {followEarned.toLocaleString()} Xu
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{followCount} nhiệm vụ đã xong</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px]">Xem Video FYP ({watchPct}%)</span>
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      </div>
                      <div className="text-sm font-black text-amber-300 mt-1">
                        {watchEarned.toLocaleString()} Xu
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{watchCount} video đã xem</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px]">Booking KOC ({kocPct}%)</span>
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                      </div>
                      <div className="text-sm font-black text-purple-300 mt-1">
                        {kocEarned.toLocaleString()} Xu
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{kocCount} đơn hoàn thành</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px]">Mắt Live &amp; NV ({livePct}%)</span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                      <div className="text-sm font-black text-cyan-300 mt-1">
                        {liveEarned.toLocaleString()} Xu
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{liveCount} phiên đã xem</div>
                    </div>
                  </div>

                  {/* Progress Tracker Strip */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300 font-bold">Tiến Độ Nhiệm Vụ Hôm Nay:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {totalRealTasksCompleted}/{dailyTarget} Hoàn Thành ({realProgressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-rose-500 rounded-full transition-all duration-500" 
                        style={{ width: `${realProgressPercent}%` }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span>
                        {realRemainingForBonus > 0 
                          ? `Còn ${realRemainingForBonus} nhiệm vụ để nhận thêm lượt Quay May Mắn` 
                          : 'Đã hoàn thành xuất sắc chỉ tiêu hôm nay!'}
                      </span>
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
            );
          })()}
        </div>

        {/* ========================================================================= */}
        {/* PHÒNG LIVE STREAM TIKTOK THẬT & CHIẾN DỊCH VIDEO ĐANG PHÁT (ĐỒNG BỘ MOBILE) */}
        {/* ========================================================================= */}
        {(() => {
          // Hàm kiểm tra chiến dịch / nhiệm vụ đã hoàn thành hay chưa (Chống trùng lặp & Tự động ẩn hoàn toàn)
          const isItemCompletedByUser = (itemId: string, handle?: string, url?: string) => {
            if (userCompletedActions?.[itemId]) return true;
            if (handle && isChannelFollowed(handle)) return true;
            const clean = (handle || '').toLowerCase().replace(/^@+/, '');
            return Object.values(userCompletedActions || {}).some(a => {
              if (a.taskId === itemId) return true;
              if (clean && a.channelHandle && a.channelHandle.toLowerCase().replace(/^@+/, '') === clean) return true;
              if (url && a.taskId && url.includes(a.taskId)) return true;
              return false;
            });
          };

          // 1. Genuine Active Campaigns (Tự động ẩn 100% khi đã làm xong hoặc hết ngân sách)
          const activeCampaigns = (campaigns || []).filter(c => {
            if (c.status === 'completed' || c.status === 'paused') return false;
            if ((c.completedQuantity || 0) >= (c.targetQuantity || 100)) return false;
            if (isItemCompletedByUser(c.id, c.channelHandle, c.targetUrl)) return false;
            return true;
          });

          const activeVideoCampaigns = activeCampaigns.filter(c => {
            const isMulti = c.type === 'multi_target' || (c.title || '').toLowerCase().includes('combo');
            if (isMulti) return true;
            const isLive = c.type === 'livestream' || c.type === 'livestream_viewers' || c.type === 'mega_live' || ((c.targetUrl || '').includes('tiktok.com/@') && (c.targetUrl || '').includes('/live'));
            return !isLive;
          });

          const uncompletedTasks = tasks.filter(t => {
            if (t.status === 'completed') return false;
            if (t.remainingSlots !== undefined && t.remainingSlots <= 0) return false;
            if (isItemCompletedByUser(t.id, t.channelHandle, t.targetUrl)) return false;
            return t.type === 'watch' || t.videoPreviewUrl || t.campaignCategory === 'partner' || t.type === 'follow';
          });

          const displayedVideoItems = activeVideoCampaigns.length > 0
            ? activeVideoCampaigns.map(c => ({
                id: c.id,
                title: c.title,
                channelName: c.channelName || c.channelHandle,
                channelHandle: c.channelHandle,
                channelAvatar: c.channelAvatar || getPlatformAvatar(c.platform || detectPlatform(c.targetUrl), c.channelHandle),
                targetUrl: c.targetUrl,
                videoPreviewUrl: c.videoPreviewUrl,
                rewardCoins: 200,
                isBoosted: c.isBoosted,
                remainingSlots: Math.max(1, (c.targetQuantity || 100) - (c.completedQuantity || 0))
              }))
            : uncompletedTasks.slice(0, 6).map(t => ({
                id: t.id,
                title: t.title,
                channelName: t.channelName,
                channelHandle: t.channelHandle,
                channelAvatar: (t.channelAvatar && !t.channelAvatar.includes('unsplash.com') ? t.channelAvatar : null) || getPlatformAvatar(t.platform || detectPlatform(t.targetUrl), t.channelHandle),
                targetUrl: t.targetUrl,
                videoPreviewUrl: t.videoPreviewUrl,
                rewardCoins: t.rewardCoins || 200,
                isBoosted: t.isUrgent,
                remainingSlots: t.remainingSlots || 50
              }));

          // 2. Genuine Active Live Rooms (Tự động ẩn phòng live đã xem / hoàn thành)
          const activeLiveCampaigns = activeCampaigns.filter(c => {
            const isMulti = c.type === 'multi_target' || (c.title || '').toLowerCase().includes('combo');
            if (isMulti) return false;
            return c.type === 'livestream' || c.type === 'livestream_viewers' || c.type === 'mega_live' || ((c.targetUrl || '').includes('tiktok.com/@') && (c.targetUrl || '').includes('/live'));
          });

          const uncompletedLiveTasks = livestreamTasks.filter(l => 
            l.status === 'live' && 
            (l.remainingSlots === undefined || l.remainingSlots > 0) && 
            !isItemCompletedByUser(l.id, l.channelHandle, l.targetUrl)
          );

          const allActiveLiveRooms = [
            ...activeLiveCampaigns.map(c => ({
              id: c.id,
              channelName: c.channelName || c.channelHandle,
              channelHandle: c.channelHandle,
              channelAvatar: c.channelAvatar || getPlatformAvatar(c.platform || detectPlatform(c.targetUrl), c.channelHandle),
              roomTitle: c.title,
              targetUrl: c.targetUrl,
              rewardPerMinute: 400,
              currentViewers: 850,
              status: 'live' as const
            })),
            ...uncompletedLiveTasks
          ];

          const seenLive = new Set<string>();
          const deduplicatedLiveRooms: typeof allActiveLiveRooms = [];
          for (const item of allActiveLiveRooms) {
            const key = ((item.channelHandle || '') + (item.targetUrl || '')).toLowerCase() || item.id;
            if (!seenLive.has(key)) {
              seenLive.add(key);
              deduplicatedLiveRooms.push(item);
            }
          }

          return (
            <div className="space-y-6">
              {/* 1. KHỐI CHIẾN DỊCH VIDEO FYP & TIKTOK ĐANG PHÁT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wide font-display">
                      Chiến Dịch Video TikTok Đang Phát ({displayedVideoItems.length} Video)
                    </h3>
                  </div>
                  <button 
                    onClick={() => openFeedRunner('all')}
                    className="text-xs text-cyan-400 hover:underline font-bold font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Bật Trình Lướt</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {displayedVideoItems.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-200">Bạn Đã Hoàn Thành Tất Cả Chiến Dịch Video Hiện Có!</div>
                    <p className="text-[10px] text-slate-400 font-mono">Các video bạn đã tương tác thành công được tự động ẩn để giao diện luôn gọn gàng và tinh gọn. Hãy quay lại sau khi có chiến dịch mới!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayedVideoItems.slice(0, 6).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => openFeedRunner(task.id)}
                        className="cursor-pointer p-3 rounded-2xl bg-[#0D111E] border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center gap-3 shadow-lg group hover:scale-[1.01]"
                      >
                        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10 group-hover:border-cyan-400/60 transition-colors shadow-md">
                          <SmartMediaThumbnail
                            targetUrl={task.targetUrl}
                            videoPreviewUrl={task.videoPreviewUrl}
                            channelAvatar={task.channelAvatar}
                            channelHandle={task.channelHandle}
                            badgeText="15 GIÂY"
                            isBoosted={task.isBoosted}
                            className="w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between h-20 sm:h-24 py-0.5">
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {task.channelName}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-mono truncate">{task.channelHandle}</div>
                            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{task.title}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[10px] font-mono font-black text-amber-400">
                              +{task.rewardCoins || 200} Xu
                            </span>
                            <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              Lướt ngay →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. KHỐI PHÒNG LIVE STREAM ĐANG CẦN MẮT XEM (ĐỒNG BỘ PHÒNG THẬT) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wide font-display">
                      Phòng Live TikTok Đang Phát Trực Tiếp ({deduplicatedLiveRooms.length} Phòng)
                    </h3>
                  </div>
                  <button 
                    onClick={() => onNavigate('tasks')}
                    className="text-xs text-rose-400 hover:underline font-bold font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem Tất Cả</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {deduplicatedLiveRooms.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center space-y-2">
                    <Radio className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-300">Hiện Không Có Phiên Live Nào Đang Phát</div>
                    <p className="text-[10px] text-slate-500 font-mono">Tất cả phiên livestream trước đã kết thúc và được lưu trữ vào lịch sử hệ thống.</p>
                    <button
                      onClick={() => onNavigate('create_campaign')}
                      className="mt-2 px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tạo Chiến Dịch Mắt Live Mới</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {deduplicatedLiveRooms.slice(0, 6).map((live) => (
                      <div
                        key={live.id}
                        onClick={() => openLiveRunner(live as any)}
                        className="cursor-pointer p-3 rounded-2xl bg-[#0D111E] border border-rose-500/30 hover:border-rose-400 transition-all flex items-center justify-between gap-3 shadow-lg group hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-14 h-16 sm:w-16 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-rose-500/40 group-hover:border-rose-400 transition-colors shadow-md">
                            <SmartMediaThumbnail
                              targetUrl={live.targetUrl}
                              channelAvatar={live.channelAvatar}
                              channelHandle={live.channelHandle}
                              isLive={true}
                              viewersCount={live.currentViewers || 580}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-xs truncate group-hover:text-rose-300 transition-colors">
                              {live.channelName}
                            </div>
                            <div className="text-[10px] text-rose-400 font-mono truncate">{live.channelHandle}</div>
                            <div className="text-[9px] text-slate-400 truncate max-w-[130px]">{live.roomTitle}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col justify-between items-end h-16 sm:h-18 py-0.5">
                          <div className="text-xs font-black text-amber-400 font-mono">+{live.rewardPerMinute} Xu/p</div>
                          <span className="mt-1 px-2 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold group-hover:bg-rose-600 group-hover:text-white transition-all">
                            Vào Xem Live
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
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

          {/* Connected Accounts & Multi-Channel Sync */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Kênh Đã Kết Nối
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                ● Đồng bộ chuẩn
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              {/* Google */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Google Auth</div>
                    <div className="text-white font-bold text-[10px] truncate">{user.email || `${user.name || 'Người dùng'} (Đang hoạt động)`}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>

              {/* TikTok */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-rose-400 font-bold shrink-0">♪</span>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Kênh TikTok</div>
                    <div className="text-rose-300 font-bold text-[10px] truncate">{user.tiktokConnected || 'Chưa kết nối'}</div>
                  </div>
                </div>
                {user.tiktokConnected ? (
                  <span className="text-[9px] text-emerald-400 font-bold shrink-0">
                    {(user.tiktokFollowers || 0).toLocaleString()} fl
                  </span>
                ) : (
                  <button
                    onClick={() => openConnect()}
                    className="text-[9px] text-cyan-400 hover:underline font-bold shrink-0"
                  >
                    + Nối ngay
                  </button>
                )}
              </div>

              {/* YouTube */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-rose-500 font-bold shrink-0">▶</span>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Kênh YouTube</div>
                    <div className="text-white font-bold text-[10px] truncate">{user.youtubeConnected || 'Chưa kết nối'}</div>
                  </div>
                </div>
                {user.youtubeConnected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => openConnect()}
                    className="text-[9px] text-cyan-400 hover:underline font-bold shrink-0"
                  >
                    + Nối ngay
                  </button>
                )}
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-blue-400 font-bold shrink-0">f</span>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Tài Khoản Facebook</div>
                    <div className="text-white font-bold text-[10px] truncate">{user.facebookConnected || 'Chưa kết nối'}</div>
                  </div>
                </div>
                {user.facebookConnected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => openConnect()}
                    className="text-[9px] text-cyan-400 hover:underline font-bold shrink-0"
                  >
                    + Nối ngay
                  </button>
                )}
              </div>
            </div>

            {/* Sync Now Button */}
            <button
              onClick={() => refreshAllData()}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin-slow" />
              <span>Đồng Bộ Dữ Liệu Với Quản Trị</span>
            </button>
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
            <span className="text-[10px] text-amber-300 font-mono font-bold">Cơ Hội Hợp Tác</span>
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
