import React from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Coins, 
  Sparkles, 
  PlusCircle, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Gift, 
  Flame,
  TrendingUp,
  Globe,
  LogOut,
  Radio,
  X,
  Zap,
  History,
  Eye,
  Bell,
  ChevronDown,
  ShieldCheck,
  Wallet,
  Share2,
  Smartphone
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onNavigateToProfile: () => void;
  onNavigateToAdmin: () => void;
  onOpenCreateCampaign: () => void;
  onOpenPolicy?: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToAffiliate?: () => void;
  onNavigateToPolicyGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onNavigateToProfile,
  onNavigateToAdmin,
  onOpenCreateCampaign,
  onOpenPolicy,
  onNavigateToLanding,
  onNavigateToAffiliate,
  onNavigateToPolicyGuide
}) => {
  const { 
    user, 
    openPolicy, 
    openFeedRunner, 
    openLuckyWheel, 
    tokenomics,
    logout,
    activeBroadcastNotification,
    dismissBroadcastNotification,
    openBuyerPortal,
    openLiveRunner,
    livestreamTasks,
    marqueeTickerList,
    openMarqueeBoostModal,
    openMarqueeHistoryModal,
    endMarqueeItem,
    tasks,
    openRunner,
    userNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    openConnect,
    connectedAccountsOnIp,
    maxAccountsPerIp,
    openPwaModal
  } = useTikTokApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarqueeItemClick = (item: any) => {
    if (item.type === 'livestream') {
      const targetTask = livestreamTasks.find(t => 
        t.id === item.id || 
        t.id === item.orderId || 
        t.id === `live_bcast_${item.orderId}` || 
        t.targetUrl === item.targetUrl
      ) || livestreamTasks[0];
      if (targetTask) openLiveRunner(targetTask);
    } else {
      const targetTask = tasks.find(t => t.id === item.id || t.targetUrl === item.targetUrl) || tasks[0];
      if (targetTask) openRunner(targetTask);
      else openFeedRunner();
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${
      darkMode 
        ? 'bg-[#0B0F19]/95 border-white/10 text-white backdrop-blur-xl' 
        : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl shadow-sm'
    }`}>
      {/* BẢNG ĐIỆN LED CHẠY CHỮ TOÀN SÀN (Horizontal Smooth LED Marquee Ticker) */}
      {marqueeTickerList.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950 via-[#1A0B2E] to-slate-950 border-b border-rose-500/30 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs sm:text-sm select-none overflow-hidden relative shadow-inner min-h-[44px]">
          {/* Left badge */}
          <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 font-mono text-xs font-black uppercase shadow-sm z-10">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="hidden sm:inline">BẢNG ĐIỆN LED</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono text-[10px] shadow-sm shadow-rose-600/50 font-black">
              TOP {marqueeTickerList.length}
            </span>
          </div>

          {/* Marquee track running right to left */}
          <div className="relative flex-1 overflow-hidden min-w-0 py-1">
            <div className="animate-led-marquee flex items-center gap-8 cursor-pointer">
              {[...marqueeTickerList, ...marqueeTickerList].map((item, idx) => (
                <div 
                  key={`${item.id}_${idx}`}
                  onClick={() => handleMarqueeItemClick(item)}
                  className="flex items-center gap-3 shrink-0 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-rose-500/50 group/marquee"
                >
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black tracking-wider uppercase font-mono shrink-0 shadow-sm ${
                    item.type === 'livestream'
                      ? 'bg-rose-600 text-white shadow-rose-600/50'
                      : 'bg-indigo-600 text-white shadow-indigo-600/50'
                  }`}>
                    {item.badgeText || (item.type === 'livestream' ? '🔴 TRỰC TIẾP' : '🎬 HOT')}
                  </span>

                  <span className="font-bold text-white text-xs sm:text-sm font-display group-hover/marquee:text-amber-300 transition-colors truncate max-w-[280px] sm:max-w-none">
                    {item.title}
                  </span>

                  <span className="text-amber-300 font-mono text-xs font-bold shrink-0">
                    {item.channelHandle}
                  </span>

                  <span className="hidden md:inline text-rose-300 font-mono text-xs shrink-0">
                    ({item.targetQuantity ? `Mục tiêu: ${item.targetQuantity.toLocaleString()} • ` : ''}Thưởng: {item.rewardText})
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarqueeItemClick(item);
                    }}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 font-display transition-transform active:scale-95"
                  >
                    {item.type === 'livestream' ? <Radio className="w-3.5 h-3.5 animate-pulse" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{item.actionText || 'Tham Gia'}</span>
                  </button>

                  <button
                    type="button"
                    title="Kết thúc phiên & chuyển vào Lịch Sử"
                    onClick={(e) => {
                      e.stopPropagation();
                      endMarqueeItem(item.id, item.type === 'livestream' ? 'livestream_ended' : 'campaign_completed');
                    }}
                    className="text-xs text-slate-400 hover:text-rose-300 px-2 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 shrink-0 font-mono transition-colors"
                  >
                    ⏹️ Kết thúc
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 shrink-0 z-10">
            <button
              onClick={() => openMarqueeBoostModal()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-black text-xs tracking-wide uppercase shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95 font-mono"
              title="Đẩy phiên live hoặc chiến dịch của bạn lên Bảng Điện (100.000 Xu)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mua Bảng Điện</span>
              <span>100K Xu</span>
            </button>
            <button
              onClick={openMarqueeHistoryModal}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors font-mono"
              title="Xem Lịch Sử Các Phiên Bảng Điện Đã Kết Thúc"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Lịch Sử</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <BrandLogo
            size="sm"
            showSubtitle={false}
            onClick={() => { window.location.href = '/'; }}
          />
        </div>

        {/* Center: Live Token Ticker & Quick Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">

          {/* Lucky Wheel Quick Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={openLuckyWheel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:scale-105 transition-transform font-display"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Vòng Quay May Mắn</span>
            </button>
            <FeatureGuideTooltip 
              title="Vòng Quay May Mắn Tri Ân Thành Viên"
              description="Mỗi ngày đăng nhập hoặc hoàn thành nhiệm vụ xem video, người dùng được tặng lượt quay miễn phí trúng từ 500 Xu đến 100,000 Xu và Gói VIP."
              steps={[
                'Bấm vào nút Vòng Quay May Mắn.',
                'Nhấn QUAY NGAY để nhận phần thưởng ngẫu nhiên.',
                'Phần thưởng Xu hoặc Token sẽ cộng thẳng vào Ví Khả Dụng lập tức.'
              ]}
              size="xs"
            />
          </div>

          {/* Quick Create Campaign Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenCreateCampaign}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all font-display"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tạo Chiến Dịch Follow</span>
            </button>
            <FeatureGuideTooltip 
              title="Tạo Chiến Dịch Tăng Follow / Xây Kênh"
              description="Khởi tạo chiến dịch tùy biến số lượng follow, tim, comment hoặc share cho kênh TikTok của bạn. Hệ thống tự động phân bổ đến 154,200+ người dùng thật xem video."
              steps={[
                'Nhập link kênh TikTok hoặc link video.',
                'Chọn số lượng tương tác mong muốn và ngân sách.',
                'Sàn kiểm duyệt và phân bổ nhiệm vụ ngay lập tức.'
              ]}
              size="xs"
            />
          </div>

          {/* Buyer Live Portal Trigger Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={openBuyerPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/50 hover:border-rose-400 text-rose-300 text-xs font-bold transition-all shadow-sm group"
              title="Dành cho chủ shop / idol TikTok đã mua gói mắt xem live"
            >
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
              </div>
              <Radio className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold">Kích Hoạt Live (Chủ Shop)</span>
            </button>
            <FeatureGuideTooltip 
              title="Cổng Quản Trị & Kích Hoạt Live Dành Cho Chủ Shop"
              description="Dành riêng cho khách hàng đã mua gói mắt xem live. Khi bắt đầu phiên live thật trên TikTok, bạn dán link phòng live vào đây và bấm Bắt Đầu."
              steps={[
                'Dán link TikTok Live của bạn.',
                'Chọn gói mắt xem đã mua trong tài khoản.',
                'Bấm Kích Hoạt: Toàn bộ 154,200+ người dùng sẽ nhận thông báo đỏ vào đẩy mắt xem, thả tim và comment.'
              ]}
              tips="Cam kết 100% người thật, bảo hành giữ mắt xem 60 ngày không lo tụt."
              size="xs"
            />
          </div>
        </div>

        {/* Right: Search, Balance, Logout & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Global Search shortcut */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-xl border transition-all ${
              darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Kênh TikTok Đã Kết Nối (Duy trì tài khoản, chuyển đổi nhanh, tối đa 5 TK/IP) */}
          <div className="flex items-center gap-1">
            <button
              onClick={openConnect}
              className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm group border cursor-pointer ${
                user.tiktokConnected ? (
                  darkMode 
                    ? 'bg-black/60 hover:bg-white/10 border-rose-500/40 text-white hover:border-rose-400' 
                    : 'bg-rose-50/80 hover:bg-rose-100 border-rose-200 text-slate-900'
                ) : (
                  'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-90 text-white animate-pulse border-rose-400/50'
                )
              }`}
              title={
                user.tiktokConnected 
                  ? `Tài khoản TikTok đang kết nối: ${user.tiktokConnected} • IP: ${connectedAccountsOnIp.length}/${maxAccountsPerIp || 5} tài khoản (Bấm để đổi kênh)` 
                  : 'Bấm để kết nối kênh TikTok nhận ngay 1.000 Xu'
              }
            >
              {/* TikTok mini badge */}
              <div className="w-5 h-5 rounded-lg bg-black flex items-center justify-center text-rose-500 text-[10px] font-black shrink-0 shadow-sm ring-1 ring-white/10">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.28 8.28 0 0 0 4.91 1.6v-3.46a4.8 4.8 0 0 1-1-.5z"/>
                </svg>
              </div>

              {user.tiktokConnected ? (
                <div className="flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-black text-xs text-white max-w-[85px] sm:max-w-[130px] truncate group-hover:text-rose-400 transition-colors">
                      {user.tiktokConnected}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span className="hidden sm:inline text-emerald-300">Đã kết nối</span>
                    <span className="text-purple-300 font-bold">({connectedAccountsOnIp.length}/{maxAccountsPerIp || 5} IP)</span>
                  </div>
                </div>
              ) : (
                <span className="whitespace-nowrap font-display text-[11px] sm:text-xs">
                  + Kết Nối TikTok (+1K Xu)
                </span>
              )}
            </button>
            <FeatureGuideTooltip 
              title="Kênh TikTok Đã Kết Nối & Giới Hạn 5 Tài Khoản / IP"
              description="Kênh TikTok đã kết nối được lưu trữ vĩnh viễn trên thiết bị để đối soát nhận Xu tự động khi lướt video hoặc làm nhiệm vụ. Mỗi địa chỉ IP được liên kết tối đa 5 tài khoản theo chuẩn bảo mật 7 lớp."
              steps={[
                'Hệ thống tự động ghi nhớ tài khoản TikTok bạn đã liên kết.',
                'Bấm vào để đổi kênh hoặc gỡ bớt tài khoản (tối đa 5 tài khoản / IP).',
                'Hoàn toàn độc lập, an toàn và chống bot 100%.'
              ]}
              size="xs"
            />
          </div>

          {/* Coin Balance Pill with Guide */}
          <div className="flex items-center gap-1">
            <div 
              onClick={onNavigateToProfile}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-[10px] font-black text-black">
                X
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-black text-amber-400 leading-none font-mono-numbers">
                  {user.avaliveCoins.toLocaleString()} Xu
                </div>
                <div className="text-[9px] text-slate-400 -mt-0.5 font-mono-numbers">
                  ≈ {user.coinsValueVND}
                </div>
              </div>
            </div>
            <FeatureGuideTooltip 
              title="Ví Xu & Quy Đổi VNĐ Rút Tiền Ngân Hàng"
              description="Số dư Xu trong ví của bạn quy đổi trực tiếp 1 Xu = 1 VNĐ. Bạn có thể rút tiền mặt về thẻ ngân hàng MB, Vietcombank, Techcombank theo kỳ giải ngân định kỳ."
              steps={[
                'Kiếm Xu bằng cách Follow, thả tim, comment hoặc xem livestream.',
                'Bấm vào số dư để vào mục Rút Tiền Ngân Hàng.',
                'Nhập số Xu cần rút (tối thiểu 200,000 Xu = 200,000đ) và hoàn tất lệnh rút.'
              ]}
              tips="Lệnh rút tiền được tổng hợp và giải ngân vào 10:00 Sáng Thứ Hai hàng tuần (xử lý trong 24h)."
              size="xs"
            />
          </div>

          {/* Install PWA App Button */}
          <button
            onClick={openPwaModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all shadow-sm group shrink-0"
            title="Cài đặt AVA FOLLOW làm icon App trên màn hình điện thoại (iOS / Android)"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-display">Cài App</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-amber-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notification Button next to Avatar */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all cursor-pointer shadow-md flex items-center justify-center shrink-0"
              title="Xem thông báo chiến dịch Hot & Đẩy Top"
            >
              <Bell className="h-4 w-4 text-rose-400 animate-bounce" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black bg-rose-600 text-white rounded-full min-w-[16px] shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu: Định vị chính xác, không tràn viền, có nút tắt đầy đủ */}
            {isNotificationsOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-[340px] sm:w-[390px] max-w-[92vw] bg-[#0D111E] border border-rose-500/50 rounded-3xl p-4 shadow-2xl shadow-black/90 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Title and Prominent Close Button */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Bell className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white font-display">Thông Báo Hệ Thống</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Cập nhật Xu & chiến dịch Hot</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {userNotifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        Đọc tất cả
                      </button>
                    )}
                    {/* Nút X tắt thông báo */}
                    <button 
                      onClick={() => setIsNotificationsOpen(false)} 
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                      title="Tắt thông báo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List with scroll */}
                <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                  {userNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-mono">
                      Chưa có thông báo mới nào.
                    </div>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          notif.isRead 
                            ? 'bg-black/30 border-white/5 opacity-75 hover:opacity-100 hover:border-white/20' 
                            : 'bg-rose-950/25 border-rose-500/35 hover:border-rose-400 shadow-md shadow-rose-950/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-bold text-white leading-tight">{notif.title}</div>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{notif.message}</p>
                        <span className="text-[9px] font-mono text-slate-400 block">{notif.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Action: Nút Tắt Bảng Thông Báo */}
                <div className="pt-2 border-t border-white/10 shrink-0">
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Đóng Bảng Thông Báo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown Menu */}
          <div ref={profileMenuRef} className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="cursor-pointer flex items-center gap-2 pl-1 sm:pl-2 py-1 pr-1.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              title="Menu tài khoản Google"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-rose-500"
                />
                {user.isTikTokVerified && (
                  <CheckCircle2 className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-cyan-400 bg-black rounded-full" />
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <div className="text-xs font-black text-white leading-tight flex items-center gap-1 max-w-[120px] truncate">
                  {user.name || user.handle}
                  {user.email === 'quocthiencr90@gmail.com' && (
                    <span className="px-1 py-0.2 text-[8px] font-mono font-black bg-rose-500 text-white rounded">ADMIN</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono leading-tight max-w-[120px] truncate">
                  {user.email || 'user@gmail.com'}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-rose-400' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0E1322] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                {/* User Info Header */}
                <div className="p-3 mb-1 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-rose-500" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{user.email || 'user@gmail.com'}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-slate-400">Cấp: <strong className="text-amber-400">{user.rankLevel}</strong></span>
                    <span className="text-slate-400">Số dư: <strong className="text-emerald-400">{(user.avaliveCoins || 0).toLocaleString('vi-VN')} Xu</strong></span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-0.5 text-xs font-medium">
                  {/* Hồ sơ cá nhân */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigateToProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Hồ Sơ Cá Nhân & Ví Xu</span>
                  </button>

                  {/* Kênh TikTok kết nối (Tối đa 5 TK/IP) */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      openConnect();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-[9px] font-black shrink-0">
                        ♪
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">
                          {user.tiktokConnected ? user.tiktokConnected : 'Chưa nối TikTok'}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          {user.tiktokConnected ? `Đã kết nối (${connectedAccountsOnIp.length}/5 IP)` : '+ Nối nhận 1K Xu'}
                        </div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 rounded font-mono shrink-0">
                      {user.tiktokConnected ? 'ĐỔI' : 'NỐI'}
                    </span>
                  </button>

                  {/* Tiếp thị liên kết */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onNavigateToAffiliate) onNavigateToAffiliate();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tiếp Thị Liên Kết</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 rounded font-mono">35%</span>
                  </button>

                  {/* Chính sách cấp bậc */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onNavigateToPolicyGuide) onNavigateToPolicyGuide();
                      else if (onOpenPolicy) onOpenPolicy();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Chính Sách Cấp Bậc</span>
                  </button>

                  {/* Quản trị Admin - CHỈ HIỂN THỊ KHI LÀ quocthiencr90@gmail.com */}
                  {user.email === 'quocthiencr90@gmail.com' && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigateToAdmin();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all text-left font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Quản Trị Hệ Thống</span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[9px] font-black bg-rose-600 text-white rounded font-mono">ADMIN</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-white/5" />

                  {/* Đăng xuất */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
