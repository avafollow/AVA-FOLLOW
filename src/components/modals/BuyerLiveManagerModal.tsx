import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  Flame, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Heart, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Award,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Headphones,
  Coins,
  RefreshCw,
  Copy,
  Calendar,
  Layers,
  Check,
  Zap,
  Plus
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  LIVE_BUYER_PACKAGES_POLICY, 
  LIVE_SEEDING_TEMPLATES, 
  LIVE_METERING_POLICY,
  INITIAL_SCHEDULED_LIVES,
  ScheduledLiveSession
} from '../../data/livePolicyData';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';

export const BuyerLiveManagerModal: React.FC = () => {
  const { 
    isBuyerPortalOpen, 
    closeBuyerPortal, 
    user, 
    broadcastLiveSession, 
    activeBroadcastNotification,
    openLiveRunner,
    livestreamTasks,
    showToast,
    boostToMarquee,
    endMarqueeItem,
    marqueeTickerList,
    openMarqueeBoostModal
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'manage' | 'seeding' | 'metering' | 'schedule'>('manage');
  const [liveUrlInput, setLiveUrlInput] = useState<string>('https://tiktok.com/@thienvuaapp_official/live');
  const [roomTitleInput, setRoomTitleInput] = useState<string>('🔥 ĐẠI TIỆC XẢ KHO 99K TIKTOK SHOP - BÃO MẮT XEM CỘNG ĐỒNG');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    user.myOrders?.find(o => o.isLivePackage)?.id || user.myOrders?.[0]?.id || 'ord_live_vip_1'
  );
  const [includeMarqueeBoost, setIncludeMarqueeBoost] = useState<boolean>(false);

  // Seeding scripts state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('fashion');
  const [customComment, setCustomComment] = useState<string>('');
  const [activeScripts, setActiveScripts] = useState<string[]>([
    'Mẫu áo khoác nỉ này còn size L không shop ơi?',
    'Shop ơi ghim mã số 03 lên giỏ hàng giúp em với nha!',
    'Vừa nhận hàng hôm qua xong, form chuẩn xịn đẹp mê li luôn!',
    'Màu kem be này tôn da dã man, chốt luôn 2 chiếc ạ ❤️'
  ]);

  // Scheduled lives state
  const [scheduledList, setScheduledList] = useState<ScheduledLiveSession[]>(INITIAL_SCHEDULED_LIVES);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('20:00 Tối Nay');

  if (!isBuyerPortalOpen) return null;

  const liveOrders = user.myOrders?.filter(o => o.isLivePackage) || [];
  const selectedOrder = user.myOrders?.find(o => o.id === selectedOrderId);

  const handleStartBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrlInput.trim()) {
      showToast('Vui lòng nhập link phát Live TikTok của bạn!');
      return;
    }
    const success = broadcastLiveSession(selectedOrderId, liveUrlInput, roomTitleInput);
    if (success && includeMarqueeBoost) {
      boostToMarquee(selectedOrderId, 'livestream', {
        title: roomTitleInput,
        handle: '@' + (user.tiktokConnected || user.handle),
        url: liveUrlInput,
        targetQuantity: selectedOrder?.targetQuantity || 500,
        rewardText: '👁️ +1,200 Xu/phút | ❤️ +200 Xu | 💬 +300 Xu'
      });
    }
  };

  const handleOpenCurrentLive = () => {
    const liveTask = livestreamTasks.find(l => 
      l.id === `live_bcast_${selectedOrderId}` || 
      l.id === selectedOrderId || 
      l.targetUrl === liveUrlInput ||
      (activeBroadcastNotification && (l.id === `live_bcast_${activeBroadcastNotification.orderId}` || l.targetUrl === activeBroadcastNotification.targetLiveUrl))
    ) || livestreamTasks[0];
    if (liveTask) {
      closeBuyerPortal();
      openLiveRunner(liveTask);
    }
  };

  const handleAddCustomComment = () => {
    if (!customComment.trim()) return;
    setActiveScripts(prev => [customComment.trim(), ...prev]);
    setCustomComment('');
    showToast('✓ Đã nạp bình luận seeding mới vào kho phân phối cho người xem!');
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('✓ Đã sao chép kịch bản bình luận!');
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;
    const newSession: ScheduledLiveSession = {
      id: `sched_${Date.now()}`,
      shopName: user.name,
      shopHandle: user.tiktokConnected || user.handle,
      shopAvatar: user.avatar,
      roomTitle: newScheduleTitle,
      scheduledTime: newScheduleTime,
      category: 'Thời Trang & TikTok Shop',
      targetEyes: 500,
      rewardPerViewer: '+5,000 Xu / 10 phút',
      registeredCount: 1,
      isRegistered: true
    };
    setScheduledList(prev => [newSession, ...prev]);
    setNewScheduleTitle('');
    showToast('🎉 Đã lên lịch phát sóng live thành công! Sàn sẽ gửi thông báo trước 15 phút.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#090C16] border border-white/20 shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-purple-950/70 via-slate-900 to-rose-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-white text-base sm:text-lg tracking-tight">
                  Trung Tâm Điều Phối Mắt Live & Tương Tác TikTok Shop
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  ENTERPRISE LIVE
                </span>
                <FeatureGuideTooltip 
                  title="Trung Tâm Điều Phối Mắt Live"
                  description="Dành cho các Shop và Creator phát sóng livestream. Bạn dán link live, hệ thống lập tức bắn thông báo cho 154,200+ người xem vào giữ mắt, tap tim và seeding giỏ hàng."
                  steps={[
                    'Dán link live TikTok đang phát sóng và bấm Phát Động Phiên Live.',
                    'Cộng đồng người xem thật sẽ ùa vào trong 2-3 phút đầu để giữ mắt xem và tap tim liên tục.',
                    'Hệ thống đo đạc trừ token/tiền theo từng phút thực tế, tự động bù mắt nếu có người thoát sớm.',
                    'Nếu tắt live sớm, sàn tự động hoàn tiền các phút chưa phát sóng về ví.'
                  ]}
                  size="xs"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấp mắt thật tức thì • Giữ mắt cam kết • Seeding giỏ hàng chốt đơn • Khấu trừ theo phút minh bạch
              </p>
            </div>
          </div>

          <button
            onClick={closeBuyerPortal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-white/5 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-3 border-b-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>1. Phát Động & Giám Sát Live</span>
          </button>
          <button
            onClick={() => setActiveTab('seeding')}
            className={`pb-3 border-b-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'seeding'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>2. Kịch Bản Seeding Giỏ Hàng</span>
          </button>
          <button
            onClick={() => setActiveTab('metering')}
            className={`pb-3 border-b-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'metering'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>3. Trừ Token Theo Phút & Cam Kết</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 border-b-2 font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>4. Đặt Lịch Live Sắp Tới (RSVP)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: PHÁT ĐỘNG & GIÁM SÁT REALTIME */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              {/* Step 1: Select Live Package */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">
                    Bước 1: Chọn gói mắt xem Livestream bạn đang sở hữu
                  </label>
                  <span className="text-[11px] text-neonGold font-mono">
                    Token thanh toán: -10% giá gốc
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {liveOrders.length > 0 ? (
                    liveOrders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedOrderId === ord.id
                            ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-600/10'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate max-w-[200px]">{ord.packageTitle}</span>
                          <span className="text-[10px] font-mono text-neonGold font-black">{ord.price}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center justify-between">
                          <span>Đã cấp: {ord.deliveredEyes || 340} / {ord.targetQuantity} mắt xem</span>
                          <span className="text-purple-300">Giữ mắt: 60 - 180p</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 col-span-2 flex items-center justify-between">
                      <div>
                        <div className="font-bold">Bạn chưa kích hoạt gói mắt xem Live nào!</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Hệ thống đang mở phiên phát sóng Demo trải nghiệm với Gói 500 Mắt Xem Live.
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs font-mono">
                        DEMO VIP
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Form Input Live Link */}
              <form onSubmit={handleStartBroadcast} className="p-5 rounded-3xl bg-black/50 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase">
                    <Flame className="h-4 w-4" />
                    <span>Bước 2: Nhập Link Live TikTok & Tiêu Đề Phòng</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Gửi thông báo khẩn tới 154,200+ tài khoản
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[11px]">Đường link phòng Live TikTok của bạn:</label>
                  <input
                    type="url"
                    value={liveUrlInput}
                    onChange={(e) => setLiveUrlInput(e.target.value)}
                    placeholder="https://www.tiktok.com/@your_handle/live"
                    className="w-full bg-[#0D111E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-500">
                    Mẹo: Mở live trên app TikTok $\rightarrow$ Bấm nút Chia sẻ $\rightarrow$ Sao chép liên kết $\rightarrow$ Dán vào đây.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[11px]">Tiêu đề / Lời kêu gọi chốt đơn bùng nổ:</label>
                  <input
                    type="text"
                    value={roomTitleInput}
                    onChange={(e) => setRoomTitleInput(e.target.value)}
                    placeholder="Ví dụ: Đại Tiệc Xả Kho 99k - Bão Mắt Xem Trợ Giá"
                    className="w-full bg-[#0D111E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-sans"
                    required
                  />
                </div>

                {/* Checkbox Đẩy lên Bảng Điện LED */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-purple-950/40 border border-amber-500/40">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeMarqueeBoost}
                      onChange={(e) => setIncludeMarqueeBoost(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-black/40 border-amber-500/40 cursor-pointer"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        Đồng thời đẩy lên BẢNG ĐIỆN LED TOÀN SÀN (+100.000 Xu)
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">100.000 Xu</span>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>BẮT ĐẦU PHÁT ĐỘNG PHIÊN LIVE CHO TOÀN BỘ CỘNG ĐỒNG 🔴</span>
                </button>
              </form>

              {/* Active Broadcast Direct Connection Card */}
              {activeBroadcastNotification && (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/70 via-[#0D111E] to-purple-950/70 border border-rose-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3.5 w-3.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs font-display truncate">
                          {activeBroadcastNotification.roomTitle}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black font-mono uppercase">
                          ĐANG LIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5 truncate">
                        <span>Kênh: <strong className="text-cyan-300">{activeBroadcastNotification.buyerHandle}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{activeBroadcastNotification.targetEyes} mắt mục tiêu</span>
                        <span>•</span>
                        <span className="text-slate-400 truncate max-w-[180px]">{activeBroadcastNotification.targetLiveUrl}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleOpenCurrentLive}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-lg shadow-rose-500/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95 font-display cursor-pointer"
                    >
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      <span>Vào Xem Thử Phiên Live Này</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        endMarqueeItem(activeBroadcastNotification.id, 'livestream_ended');
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Kết thúc phiên live và chuyển sang lịch sử"
                    >
                      <span>⏹️ Kết Thúc Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(activeBroadcastNotification.targetLiveUrl, '_blank')}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Mở trên ứng dụng TikTok"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">TikTok App</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Realtime Delivery Progress Monitor */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                    <h4 className="font-bold text-white font-mono uppercase text-xs">
                      Bảng Giám Sát Mắt Live Thời Gian Thực (Live Retention Meter)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      GIỮ MẮT 96.8%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-black border border-rose-500/30 animate-pulse">
                      ĐANG TRUYỀN PHÁT
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[10px]">Mắt Thật Đang Xem</div>
                    <div className="text-xl font-black text-rose-400">
                      485 / 500
                    </div>
                    <div className="text-[9px] text-emerald-400">Độ lệch ổn định ±3%</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[10px]">Lượt Tim Tap-Tap</div>
                    <div className="text-xl font-black text-amber-400">
                      42,850
                    </div>
                    <div className="text-[9px] text-slate-400">+850 tim / phút</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[10px]">Comment Seeding</div>
                    <div className="text-xl font-black text-cyan-400">
                      168 Bình luận
                    </div>
                    <div className="text-[9px] text-slate-400">Hỏi giá & chốt đơn</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                    <div className="text-slate-400 text-[10px]">Thời Gian Giữ Chân TB</div>
                    <div className="text-xl font-black text-purple-400">
                      7.4 Phút
                    </div>
                    <div className="text-[9px] text-emerald-400">Đạt mốc FYP Explore</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Cam kết bù mắt tự động trong 15s nếu có người xem rớt mạng</span>
                  </div>
                  <button
                    onClick={handleOpenCurrentLive}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white transition-all font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Kiểm tra phòng live</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KỊCH BẢN SEEDING GIỎ HÀNG */}
          {activeTab === 'seeding' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold font-display">
                    <Sparkles className="h-4 w-4" />
                    <span>Kho Kịch Bản Seeding Giỏ Hàng Mồi Tăng Chuyển Đổi</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Tự động điều phối</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Người xem làm nhiệm vụ sẽ được hệ thống gợi ý ngẫu nhiên các câu bình luận bên dưới để comment vào phiên live của bạn. Điều này giúp kích thích tâm lý đám đông (FOMO), tạo hiệu ứng khách tranh nhau hỏi giá và chốt đơn nườm nượp!
                </p>
              </div>

              {/* Select Category */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {LIVE_SEEDING_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedIndustry(tmpl.industry);
                      setActiveScripts(tmpl.comments);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                      selectedIndustry === tmpl.industry
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tmpl.categoryName}
                  </button>
                ))}
              </div>

              {/* Custom Add Comment */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Nhập câu bình luận mồi riêng của shop bạn (Ví dụ: Chốt mã 05 nha shop ơi...)"
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
                <button
                  onClick={handleAddCustomComment}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm Kịch Bản</span>
                </button>
              </div>

              {/* List of Active Seeding Comments */}
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Danh sách {activeScripts.length} bình luận đang được phân phát cho người xem:</span>
                  <span className="text-emerald-400">+350 Xu thưởng / comment</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {activeScripts.map((cmt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">#{idx + 1}</span>
                        <span className="text-slate-200 text-xs font-sans">{cmt}</span>
                      </div>
                      <button
                        onClick={() => handleCopyScript(cmt)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors shrink-0"
                        title="Sao chép câu này"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRỪ TOKEN THEO PHÚT & CAM KẾT GIỮ MẮT */}
          {activeTab === 'metering' && (
            <div className="space-y-6">
              {/* Metering Calculation Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-black border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Cơ Chế Khấu Trừ Token Chuẩn Theo Phút Thực Tế (Live Metering)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Chúng tôi cam kết tính tiền <strong>chuẩn xác đến từng giây và từng phút phát sóng</strong>. Nếu người xem thoát sớm trước thời gian mốc, hệ thống lập tức bù mắt người khác. Nếu bạn tắt live sớm hơn gói đã mua, <strong>tiền của các phút chưa dùng sẽ được tự động hoàn trả 100% về ví ngay lập tức</strong>!
                </p>
              </div>

              {/* 4 Rules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {LIVE_METERING_POLICY.RULES.map((rule, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                    <div className="font-bold text-white text-xs font-display flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{rule.step}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                      {rule.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* 4 Packages Specs Comparison Table */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Bảng Thông Số 4 Gói Mắt Xem Live & Quy Đổi Xu</span>
                  <span className="text-neonGold text-[11px]">1 Xu = 1 VNĐ Tiền Mặt</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {LIVE_BUYER_PACKAGES_POLICY.map((pkg) => (
                    <div key={pkg.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{pkg.title}</span>
                          <span className="text-[9px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                            {pkg.eyesCount} Mắt / {pkg.durationMinutes}p
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {pkg.retentionCommitment}
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <div className="font-black text-neonGold text-sm">{pkg.priceVND}</div>
                        <div className="text-[10px] text-purple-400">
                          {pkg.tokenDiscountPrice} Token (-10%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ĐẶT LỊCH LIVE SẮP TỚI (RSVP) */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              {/* Form create scheduled live */}
              <form onSubmit={handleCreateSchedule} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-display">
                  <Calendar className="h-4 w-4" />
                  <span>Lên Lịch Phiên Live Sắp Tới & Thu Hút Người Xem Đăng Ký Trước (RSVP)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Lên lịch trước giúp hơn 154,200+ người làm nhiệm vụ bấm nhận thông báo nhắc nhở, đảm bảo khi bạn bật live là mắt xem ùa vào ngay lập tức!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-400 text-[10px] font-mono">Tiêu đề phiên live sắp phát sóng:</label>
                    <input
                      type="text"
                      value={newScheduleTitle}
                      onChange={(e) => setNewScheduleTitle(e.target.value)}
                      placeholder="Ví dụ: Mega Live 20h00 Xả Kho Áo Polo Siêu Giảm Giá"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px] font-mono">Khung giờ phát sóng:</label>
                    <input
                      type="text"
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      placeholder="Ví dụ: 19h30 Tối Nay"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs font-mono shadow-md hover:opacity-95 transition-all"
                >
                  Xác Nhận Lên Lịch & Gửi Thông Báo Sớm Cho Cộng Đồng 📅
                </button>
              </form>

              {/* List of Scheduled Lives */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white font-mono uppercase flex items-center justify-between">
                  <span>Các Phiên Live Đã Lên Lịch Sắp Diễn Ra</span>
                  <span className="text-[10px] text-amber-400 font-mono">Tự động nhắc lịch</span>
                </div>
                <div className="space-y-2.5">
                  {scheduledList.map((sched) => (
                    <div
                      key={sched.id}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sched.shopAvatar}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/40 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs line-clamp-1">{sched.roomTitle}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400 font-bold">{sched.scheduledTime}</span>
                            <span>•</span>
                            <span className="text-slate-300">{sched.shopHandle}</span>
                            <span>•</span>
                            <span className="text-emerald-400">{sched.rewardPerViewer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{sched.registeredCount} đã đăng ký</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Mắt xem 100% người dùng điện thoại thật • Hỗ trợ kỹ thuật 24/7</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeBuyerPortal}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold transition-all"
            >
              Đóng Cửa Sổ
            </button>
            <button
              onClick={handleOpenCurrentLive}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Vào Xem Live Trực Tiếp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
