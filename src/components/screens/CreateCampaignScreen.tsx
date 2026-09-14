import React, { useState } from 'react';
import { 
  PlusCircle, 
  UserPlus, 
  Heart, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  Coins, 
  Flame,
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Eye, 
  MessageSquare, 
  Play, 
  Clock, 
  Info, 
  Zap, 
  Check,
  Layers,
  Calculator,
  Sliders,
  ExternalLink,
  Lock,
  Unlock,
  BarChart3,
  PieChart,
  Building2,
  ShoppingBag,
  Tag,
  Calendar,
  Megaphone,
  Target,
  Users,
  Rocket,
  Trash2
} from 'lucide-react';
import { CampaignItem, FLEXIBLE_LIVESTREAM_TIERS, MultiTargetConfig } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TikTokVideoPreviewPlayer } from '../common/TikTokVideoPreviewPlayer';
import { getTikTokAvatar } from '../../data/videoSources';

interface TargetOptionDef {
  id: 'follow' | 'watch' | 'like' | 'comment' | 'share' | 'livestream' | 'booking_review';
  label: string;
  icon: any;
  desc: string;
  unitPrice: number;
  minQuantity: number;
  defaultQty: number;
  unitLabel: string;
}

const TARGET_OPTIONS: TargetOptionDef[] = [
  { 
    id: 'follow', 
    label: 'Kết Nối Follow Người Thật', 
    icon: UserPlus, 
    desc: '500 Xu / follow thật', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Follower' 
  },
  { 
    id: 'watch', 
    label: 'Kết Nối Lượt Xem FYP 15s', 
    icon: Play, 
    desc: '500 Xu / view thật', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Lượt Xem' 
  },
  { 
    id: 'like', 
    label: 'Kết Nối Thả Tim Tương Tác', 
    icon: Heart, 
    desc: '250 Xu / tim thật', 
    unitPrice: 250, 
    minQuantity: 1, 
    defaultQty: 20, 
    unitLabel: 'Lượt Tim' 
  },
  { 
    id: 'comment', 
    label: 'Kết Nối Bình Luận Seeding', 
    icon: MessageSquare, 
    desc: '500 Xu / cmt chất lượng', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Bình Luận' 
  },
  { 
    id: 'share', 
    label: 'Kết Nối Chia Sẻ Lan Tỏa', 
    icon: Share2, 
    desc: '600 Xu / share thật', 
    unitPrice: 600, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Lượt Chia Sẻ' 
  },
  { 
    id: 'livestream', 
    label: 'Kết Nối Mắt Live Giữ Chân', 
    icon: Eye, 
    desc: 'Từ 350 Xu / mắt xem thật', 
    unitPrice: 350, 
    minQuantity: 1, 
    defaultQty: 15, 
    unitLabel: 'Mắt Live' 
  },
  { 
    id: 'booking_review', 
    label: 'Booking KOC Trải Nghiệm', 
    icon: Sparkles, 
    desc: '1.5M Xu / video', 
    unitPrice: 1500000, 
    minQuantity: 1, 
    defaultQty: 1, 
    unitLabel: 'Video Review' 
  }
];

export const CreateCampaignScreen: React.FC<{
  darkMode: boolean;
  onCreateCampaign?: (campaign: CampaignItem) => void;
}> = ({ darkMode }) => {
  const { 
    user, 
    createCampaign, 
    deleteCampaign,
    unlockCampaignAnalytics,
    boostCampaignToTop,
    openDeposit, 
    campaigns, 
    showToast,
    boostToMarquee,
    endMarqueeItem,
    marqueeTickerList,
    openFeedRunner,
    openLiveRunner,
    livestreamTasks
  } = useTikTokApp();

  // Tab: Standard vs Mega Live & Product Launch
  const [activeMainTab, setActiveMainTab] = useState<'standard' | 'mega_launch'>('standard');

  // Mega Live & Launch Form States
  const [megaType, setMegaType] = useState<'mega_live' | 'product_launch'>('mega_live');
  const [megaProductName, setMegaProductName] = useState('');
  const [megaProductCategory, setMegaProductCategory] = useState('Mỹ Phẩm & Làm Đẹp');
  const [megaProductPrice, setMegaProductPrice] = useState('299.000đ');
  const [megaVoucher, setMegaVoucher] = useState('Mã MGG50 - Giảm 50% Cho Người Xem Live');
  const [megaLiveDateTime, setMegaLiveDateTime] = useState('20:00 Tối Nay');
  const [megaLiveGoal, setMegaLiveGoal] = useState<number>(10000);
  const [megaLiveDuration, setMegaLiveDuration] = useState<number>(60);
  const [megaPushNotification, setMegaPushNotification] = useState<boolean>(true);

  // Add-on: Đẩy lên Bảng Điện LED Toàn Sàn (100.000 Xu)
  const [includeMarqueeBoost, setIncludeMarqueeBoost] = useState(false);
  const MARQUEE_FEE = 100000;

  // Multi-target selection state (User can select multiple targets to run concurrently)
  const [selectedTargets, setSelectedTargets] = useState<Record<string, boolean>>({
    follow: true,
    watch: false,
    like: false,
    comment: false,
    share: false,
    livestream: false,
    booking_review: false
  });

  // Quantities per target (Tùy biến tự do từ 10 follow/tim/view, chỉ cần tổng ngân sách tối thiểu 5.000 Xu)
  const [targetQuantities, setTargetQuantities] = useState<Record<string, number>>({
    follow: 10,
    watch: 10,
    like: 20,
    comment: 10,
    share: 10,
    livestream: 15,
    booking_review: 1
  });

  const [title, setTitle] = useState('');
  const userHandle = user.tiktokHandle || user.tiktokConnected || '@thienvuaapp';
  const [channelHandle, setChannelHandle] = useState(userHandle);
  const [targetUrl, setTargetUrl] = useState(`https://www.tiktok.com/@${userHandle.replace('@', '')}`);
  const [speed, setSpeed] = useState<'natural' | 'turbo'>('natural');
  const [instructions, setInstructions] = useState('Yêu cầu người dùng thật 100%, xem video 15s tự nhiên trước khi tương tác, bảo đảm không bị tụt.');
  
  // Xử lý thông minh khi người dùng dán link video TikTok, live hoặc ID kênh
  const handleTargetUrlChange = (inputVal: string) => {
    setTargetUrl(inputVal);
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Trích xuất @handle từ URL nếu có
    const match = trimmed.match(/@([a-zA-Z0-9_.-]+)/);
    if (match && match[1]) {
      setChannelHandle(`@${match[1]}`);
    } else if (trimmed.startsWith('@')) {
      setChannelHandle(trimmed);
    } else if (!trimmed.includes('http') && !trimmed.includes('/') && trimmed.length > 2) {
      setChannelHandle(`@${trimmed}`);
    }
  };

  // Flexible Livestream Duration state (minutes: 1, 3, 10, 30, 60)
  const [livestreamMinutes, setLivestreamMinutes] = useState<number>(3);
  const activeLiveTier = FLEXIBLE_LIVESTREAM_TIERS.find(t => t.minutes === livestreamMinutes) || FLEXIBLE_LIVESTREAM_TIERS[1];

  // Targeted Audience Delivery State (2 lựa chọn: Phủ cả thị trường vs Đúng ngách thị trường)
  const [deliveryMode, setDeliveryMode] = useState<'mass_broad' | 'niche_targeted'>('mass_broad');
  const [targetGender, setTargetGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>(['18-24', '25-34']);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Mỹ Phẩm & Làm Đẹp', 'Thời Trang']);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(['Reviewer TikTok Shop (Có Giỏ Hàng)']);

  // Active targets list
  const activeTargetsList = TARGET_OPTIONS.filter(t => selectedTargets[t.id]);
  const isMultiTarget = activeTargetsList.length > 1;

  // Toggle selection for a target
  const handleToggleTarget = (targetId: string) => {
    setSelectedTargets(prev => {
      const isCurrentlyActive = prev[targetId];
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (isCurrentlyActive && activeCount <= 1) {
        showToast('⚠️ Bạn phải chọn ít nhất 1 mục tiêu chiến dịch!');
        return prev;
      }
      const newState = { ...prev, [targetId]: !isCurrentlyActive };
      return newState;
    });
  };

  // Update quantity for a specific target (Cho phép nhập bất kỳ số lượng nào từ 1)
  const handleUpdateQuantity = (targetId: string, val: number) => {
    const targetDef = TARGET_OPTIONS.find(t => t.id === targetId);
    const min = targetDef ? targetDef.minQuantity : 1;
    setTargetQuantities(prev => ({
      ...prev,
      [targetId]: Math.max(min, val)
    }));
  };

  // Get price per unit for a target
  const getTargetUnitPrice = (targetId: string): number => {
    if (targetId === 'livestream') return activeLiveTier.buyerPricePerEye;
    const opt = TARGET_OPTIONS.find(t => t.id === targetId);
    return opt ? opt.unitPrice : 500;
  };

  // Subtotal Xu for a target
  const getTargetSubtotal = (targetId: string): number => {
    const qty = targetQuantities[targetId] || 10;
    const unitPrice = getTargetUnitPrice(targetId);
    return qty * unitPrice;
  };

  // Total aggregated cost in Xu & VND
  const baseCostXu = activeTargetsList.reduce((sum, t) => sum + getTargetSubtotal(t.id), 0);
  const totalCostXu = baseCostXu + (includeMarqueeBoost ? MARQUEE_FEE : 0);
  const totalCostVND = totalCostXu.toLocaleString('vi-VN') + 'đ';
  const MIN_CAMPAIGN_BUDGET_XU = 5000;
  const isAboveMinBudget = baseCostXu >= MIN_CAMPAIGN_BUDGET_XU;
  const hasEnoughCoins = (user.avaliveCoins || 0) >= totalCostXu;

  const handleSelectLiveDuration = (mins: number) => {
    setLivestreamMinutes(mins);
    const tier = FLEXIBLE_LIVESTREAM_TIERS.find(t => t.minutes === mins);
    showToast(`⏱️ Đã chọn gói Live ${mins} phút (${tier?.buyerPricePerEye.toLocaleString()} Xu/mắt)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTargetsList.length === 0) {
      alert('Vui lòng chọn ít nhất 1 mục tiêu chiến dịch!');
      return;
    }

    if (!isAboveMinBudget) {
      showToast(`⚠️ Ngân sách chiến dịch tối thiểu phải từ ${MIN_CAMPAIGN_BUDGET_XU.toLocaleString()} Xu trở lên (Hiện tại: ${baseCostXu.toLocaleString()} Xu). Hãy tăng số lượng tương tác!`);
      return;
    }

    if (!hasEnoughCoins) {
      showToast(`❌ Số dư Xu không đủ! Bạn cần ${totalCostXu.toLocaleString()} Xu để kích hoạt.`);
      openDeposit();
      return;
    }

    // Prepare multiTargets config
    const multiTargetsPayload: MultiTargetConfig[] = activeTargetsList.map(t => ({
      type: t.id === 'booking_review' ? 'watch' : t.id,
      label: t.label,
      targetQuantity: targetQuantities[t.id] || 1000,
      completedQuantity: 0,
      unitPriceXu: getTargetUnitPrice(t.id),
      totalXu: getTargetSubtotal(t.id),
      livestreamMinutes: t.id === 'livestream' ? livestreamMinutes : undefined
    }));

    // Auto-generate title if empty
    let finalTitle = title.trim();
    if (!finalTitle) {
      if (isMultiTarget) {
        finalTitle = `Chiến Dịch Combo ${activeTargetsList.length} Mục Tiêu cho ${channelHandle}`;
      } else {
        const single = activeTargetsList[0];
        finalTitle = `Tăng ${(targetQuantities[single.id] || 10).toLocaleString()} ${single.unitLabel} cho ${channelHandle}`;
      }
    }

    const primaryType = isMultiTarget 
      ? ('multi_target' as const) 
      : activeTargetsList[0].id;

    const success = createCampaign({
      title: finalTitle,
      type: primaryType,
      channelHandle,
      targetUrl,
      targetQuantity: activeTargetsList.reduce((sum, t) => sum + (targetQuantities[t.id] || 10), 0),
      budgetTotal: `${totalCostXu.toLocaleString()} Xu (${totalCostVND})`,
      budgetCoins: totalCostXu,
      pricePerAction: isMultiTarget ? 'Đa mục tiêu' : `${getTargetUnitPrice(activeTargetsList[0].id).toLocaleString('vi-VN')} Xu`,
      instructions,
      livestreamMinutes: selectedTargets.livestream ? livestreamMinutes : undefined,
      multiTargets: multiTargetsPayload,
      audienceTargeting: {
        mode: deliveryMode,
        gender: targetGender,
        ageRanges: selectedAgeRanges,
        regions: [selectedRegion],
        interests: selectedInterests,
        viewingHabits: selectedHabits,
        targetCriteriaSummary: deliveryMode === 'mass_broad' 
          ? 'Phủ toàn bộ người dùng' 
          : `Tệp ${targetGender === 'all' ? 'Nam & Nữ' : targetGender === 'male' ? 'Nam' : 'Nữ'} (${selectedAgeRanges.join(', ')}) • ${selectedRegion === 'all' ? 'Toàn quốc' : selectedRegion} • Ngành: ${selectedInterests.join(', ')}`,
        estimatedAudienceSize: deliveryMode === 'mass_broad' ? 128500 : 28400
      }
    });

    if (success) {
      if (includeMarqueeBoost) {
        boostToMarquee(`camp_${Date.now()}`, 'campaign', {
          title: finalTitle,
          handle: channelHandle,
          url: targetUrl,
          targetQuantity: activeTargetsList.reduce((sum, t) => sum + (targetQuantities[t.id] || 10), 0),
          rewardText: isMultiTarget ? 'Combo đa mục tiêu' : `${getTargetUnitPrice(activeTargetsList[0].id).toLocaleString('vi-VN')} Xu`
        });
      }
      showToast(`🎉 Đã kích hoạt chiến dịch thành công! Chuyển ngay đến ô Lướt Video Kiếm Tiền.`);
      setTitle('');
      setIncludeMarqueeBoost(false);

      // Tự động chuyển toàn bộ video/livestream hiển thị ngay tại ô Lướt Video Kiếm Tiền
      if (selectedTargets.livestream || targetUrl.includes('/live')) {
        openLiveRunner();
      } else {
        openFeedRunner(0);
      }
    }
  };

  // Handler for Mega Live & Product Launch Campaign
  const handleMegaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isMegaLive = megaType === 'mega_live';
    const basePricePerUnit = isMegaLive ? 1000 : 500;
    const megaCostXu = (megaLiveGoal * basePricePerUnit) + (includeMarqueeBoost ? MARQUEE_FEE : 0);
    const megaCostVND = megaCostXu.toLocaleString('vi-VN') + 'đ';

    if ((user.avaliveCoins || 0) < megaCostXu) {
      showToast(`⚠️ Bạn cần tối thiểu ${megaCostXu.toLocaleString()} Xu (${megaCostVND}) để kích hoạt gói VIP Doanh Nghiệp này!`);
      openDeposit();
      return;
    }

    const campaignTitle = isMegaLive
      ? `Đại Tiệc Mega Live: ${megaProductName || 'Sản Phẩm Mới'} (@${channelHandle.replace('@', '')})`
      : `Chiến Dịch Tung Sản Phẩm: ${megaProductName || 'Sản Phẩm Mới'} (@${channelHandle.replace('@', '')})`;

    const success = createCampaign({
      title: campaignTitle,
      type: megaType,
      channelHandle: channelHandle.startsWith('@') ? channelHandle : `@${channelHandle}`,
      targetUrl,
      targetQuantity: megaLiveGoal,
      budgetTotal: `${megaCostXu.toLocaleString()} Xu (${megaCostVND})`,
      budgetCoins: megaCostXu,
      pricePerAction: `${basePricePerUnit.toLocaleString('vi-VN')} Xu`,
      instructions: isMegaLive
        ? `Xem phiên Mega Live tối thiểu ${megaLiveDuration} phút, thả tim, bình luận và nhận mã ưu đãi ${megaVoucher}.`
        : `Xem video review ${megaProductName}, tương tác tự nhiên và khám phá sản phẩm mới.`,
      livestreamMinutes: isMegaLive ? megaLiveDuration : undefined,
      audienceTargeting: {
        mode: 'niche_targeted',
        gender: targetGender,
        ageRanges: selectedAgeRanges,
        regions: [selectedRegion],
        interests: [megaProductCategory, ...selectedInterests],
        productName: megaProductName || 'Sản phẩm cao cấp',
        productPrice: megaProductPrice,
        scheduledBroadcastTime: megaLiveDateTime,
        pinnedOffer: megaVoucher,
        targetCriteriaSummary: `Nhắm tệp ${megaProductCategory} • ${targetGender === 'all' ? 'Nam & Nữ' : targetGender === 'male' ? 'Nam' : 'Nữ'} (${selectedAgeRanges.join(', ')}) • ${selectedRegion === 'all' ? 'Toàn quốc' : selectedRegion}`,
        estimatedAudienceSize: 154200
      }
    });

    if (success) {
      if (includeMarqueeBoost) {
        boostToMarquee(`camp_mega_${Date.now()}`, 'campaign', {
          title: campaignTitle,
          handle: channelHandle,
          url: targetUrl,
          targetQuantity: megaLiveGoal,
          rewardText: isMegaLive ? 'Mega Live VIP' : 'Launch Viral'
        });
      }
      showToast(`🚀 Đã khởi tạo thành công chiến dịch ${isMegaLive ? 'Mega Live' : 'Tung Sản Phẩm'} cho ${channelHandle}! Chuyển ngay đến ô Lướt Video Kiếm Tiền.`);
      setMegaProductName('');
      setIncludeMarqueeBoost(false);

      if (isMegaLive) {
        openLiveRunner();
      } else {
        openFeedRunner(0);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-pink-300 text-xs font-mono mb-2 border border-pink-500/30">
          <Sparkles className="h-3.5 w-3.5 text-pink-400" />
          <span className="font-bold">KẾT NỐI TƯƠNG TÁC THẬT • 100% NGƯỜI DÙNG XÁC MINH KYC</span>
        </div>
        <div className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-pink-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Tạo Chiến Dịch Tăng Trưởng &amp; Kết Nối Tệp Khách Hàng Thật</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Hệ thống kết nối người dùng thật, kết nối follow, kết nối view và mắt livestream chất lượng cao đúng tệp khách hàng tiềm năng.
        </p>
      </div>

      {/* Main Mode Tabs Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-[#0D111E] rounded-3xl border border-white/10 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveMainTab('standard')}
          className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'standard'
              ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4 text-pink-300" />
          <span>Chiến Dịch Tăng Trưởng Tiêu Chuẩn</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('mega_launch')}
          className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black font-mono transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${
            activeMainTab === 'mega_launch'
              ? 'bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Rocket className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span>Chiến Dịch Tung Sản Phẩm &amp; Mega Live</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
            VIP GÓI LỚN
          </span>
        </button>
      </div>

      {/* Wallet Balance & Instant Recharge */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neonGold/10 border border-neonGold/30 text-neonGold">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="text-zinc-400 text-[11px] font-medium">Số dư Xu khả dụng để chạy chiến dịch:</div>
            <div className="text-base font-black text-white font-mono flex items-center gap-2">
              <span className="text-neonGold">{(user.avaliveCoins || 0).toLocaleString()} Xu</span>
              <span className="text-zinc-400 font-normal text-xs">≈</span>
              <span className="text-emerald-400 font-bold">{(user.avaliveCoins || 0).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDeposit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-95 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            + Nạp Thêm Xu VietQR
          </button>
        </div>
      </div>

      {/* Main Campaign Form */}
      {activeMainTab === 'standard' && (
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#0D111E] border border-white/10 space-y-6 text-xs shadow-2xl">
        
        {/* 1. Multi-Target Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-zinc-300 font-mono font-black uppercase text-[11px]">
              1. Chọn các mục tiêu chiến dịch (Hỗ trợ chọn nhiều mục cùng lúc):
            </label>
            <span className="text-[10px] text-emerald-400 font-bold">● 100% Người Thật • Chống Tụt 15-30 Ngày</span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              💡 <strong>Linh hoạt kết hợp:</strong> Bạn có thể tick chọn 2, 3, 4 hoặc toàn bộ các mục tiêu. Hệ thống sẽ tự động cộng dồn số Xu và trừ 1 lần duy nhất từ ví.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {TARGET_OPTIONS.map((t) => {
              const Icon = t.icon;
              const isSelected = !!selectedTargets[t.id];
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => handleToggleTarget(t.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 cursor-pointer relative ${
                    isSelected
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/20 ring-2 ring-rose-500'
                      : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`} />
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      isSelected 
                        ? 'bg-rose-500 border-rose-400 text-white' 
                        : 'border-white/20 bg-black/40 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs leading-snug">{t.label}</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

          {/* 2. Target Quantities Config (Tùy biến tự do từ 10 follow/tim/view, tối thiểu tổng 5.000 Xu) */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <label className="text-zinc-200 font-mono font-bold uppercase text-[11px]">
                2. Cấu hình số lượng từng mục tiêu (Tùy chọn tự do từ 10 tương tác • Tối thiểu 5.000 Xu/chiến dịch):
              </label>
            </div>
            <span className="text-[10px] text-neonGold font-mono font-bold">
              Đang chọn: {activeTargetsList.length} mục tiêu
            </span>
          </div>

          {/* Flexible Livestream Duration Picker (Appears when livestream is selected) */}
          {selectedTargets.livestream && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white uppercase font-mono text-[11px]">
                    Thời lượng mắt xem Live cam kết (Bắt buộc xem đủ mới tính)
                  </span>
                </div>
                <span className="text-[10px] text-purple-300 font-mono">
                  {activeLiveTier.buyerPricePerEye.toLocaleString()} Xu/mắt
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FLEXIBLE_LIVESTREAM_TIERS.map((tier) => {
                  const isPicked = livestreamMinutes === tier.minutes;
                  return (
                    <button
                      type="button"
                      key={tier.minutes}
                      onClick={() => handleSelectLiveDuration(tier.minutes)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isPicked
                          ? 'bg-purple-500/30 border-purple-400 text-white shadow-md shadow-purple-500/20'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black font-mono">{tier.label}</div>
                      <div className="text-[10px] text-neonGold font-mono font-bold mt-0.5">
                        {tier.buyerPricePerEye.toLocaleString()} Xu
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Inputs per Active Target */}
          <div className="space-y-3">
            {activeTargetsList.map((targetDef) => {
              const currentQty = targetQuantities[targetDef.id] || targetDef.minQuantity;
              const unitPrice = getTargetUnitPrice(targetDef.id);
              const subtotal = currentQty * unitPrice;
              const isBooking = targetDef.id === 'booking_review';

              return (
                <div 
                  key={targetDef.id} 
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-[200px]">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                      <targetDef.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{targetDef.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Đơn giá: {unitPrice.toLocaleString()} Xu / {targetDef.unitLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-mono">Số lượng:</span>
                      <input
                        type="number"
                        min={targetDef.minQuantity}
                        step={1}
                        value={currentQty}
                        onChange={(e) => handleUpdateQuantity(targetDef.id, parseInt(e.target.value) || targetDef.minQuantity)}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-rose-500 text-center"
                      />
                    </div>

                    {!isBooking && (
                      <div className="flex items-center gap-1">
                        {[10, 50, 100, 500, 1000].map((q) => (
                          <button
                            type="button"
                            key={q}
                            onClick={() => handleUpdateQuantity(targetDef.id, q)}
                            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                              currentQty === q 
                                ? 'bg-rose-500 text-white font-bold' 
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {q >= 1000 ? `${q / 1000}k` : q}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="min-w-[120px] text-right">
                      <div className="text-xs font-black text-neonGold font-mono">
                        {subtotal.toLocaleString()} Xu
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        ≈ {subtotal.toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. TikTok Channel Handle & URL - NỔI BẬT, TO RÕ, DỄ NHÌN THEO ẢNH SỐ 2 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0F172A]/90 via-[#0B0F1E] to-[#1E112A]/90 border-2 border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.25)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CỘT 1: NHẬP LINK CHÍNH THỨC (NỔI BẬT NHẤT) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-rose-400 font-mono font-black uppercase text-xs sm:text-sm tracking-wide">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span>2. ĐƯỜNG DẪN VIDEO / PHIÊN LIVE:</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-black animate-pulse">
                  🔥 DÁN LINK TẠI ĐÂY
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => handleTargetUrlChange(e.target.value)}
                  placeholder="👉 Dán link video TikTok, YouTube, Facebook hoặc phiên Live chính thức..."
                  className="w-full bg-black/80 border-2 border-rose-500/70 hover:border-rose-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20 rounded-2xl px-4 py-3.5 sm:py-4 text-white placeholder-slate-400 font-mono text-xs sm:text-sm font-bold transition-all shadow-inner"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold">Dán nhanh:</span>
                <button
                  type="button"
                  onClick={() => handleTargetUrlChange('https://www.tiktok.com/@hoaa.hanassii/video/7234567890123456789')}
                  className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40 cursor-pointer transition-all active:scale-95"
                >
                  🎬 Video TikTok
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetUrlChange('https://www.tiktok.com/@vtv24news/live')}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/40 cursor-pointer transition-all active:scale-95"
                >
                  🔴 Live TikTok
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetUrlChange('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                  className="px-2.5 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 text-[10px] font-mono font-bold border border-red-500/40 cursor-pointer transition-all active:scale-95"
                >
                  ▶️ YouTube
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetUrlChange('https://www.facebook.com/reel/123456789')}
                  className="px-2.5 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/40 cursor-pointer transition-all active:scale-95"
                >
                  🌐 Facebook
                </button>
              </div>
            </div>

            {/* CỘT 2: TIKTOK CHANNEL HANDLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-cyan-300 font-mono font-black uppercase text-xs sm:text-sm tracking-wide">
                  3. TIKTOK CHANNEL HANDLE (@):
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  ✓ Tự động điền kênh
                </span>
              </div>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="@username_chinh_thuc"
                className="w-full bg-black/80 border-2 border-cyan-500/50 hover:border-cyan-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 rounded-2xl px-4 py-3.5 sm:py-4 text-white placeholder-slate-400 font-mono text-xs sm:text-sm font-bold transition-all shadow-inner"
                required
              />
              <p className="text-[10px] text-slate-400 font-mono">
                Kênh TikTok sẽ nhận tương tác & hiển thị huy hiệu xác thực.
              </p>
            </div>
          </div>
        </div>

        {/* Ô KẾT NỐI MEDIA TIKTOK: Hiển thị ngay lập tức video / phiên live cho người dùng */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0B0F19] to-[#121727] border border-rose-500/40 space-y-3.5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                {selectedTargets.livestream || targetUrl.includes('/live') 
                  ? '🔴 XEM TRƯỚC PHIÊN LIVE TIKTOK (ĐỒNG BỘ TRỰC TIẾP)' 
                  : '🎬 XEM TRƯỚC VIDEO / KÊNH TIKTOK CHIẾN DỊCH THẬT'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Kết nối tức thì
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 bg-black/90 p-5 sm:p-6 rounded-3xl border border-white/15 shadow-2xl">
            {/* Khung phát video to đúng kích thước chuẩn TikTok 9:16 */}
            <div className="w-full max-w-[340px] sm:w-[340px] h-[580px] sm:h-[620px] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-500/40 relative bg-black">
              <TikTokVideoPreviewPlayer
                url={targetUrl}
                channelHandle={channelHandle}
                isLive={Boolean(selectedTargets.livestream || targetUrl.includes('/live'))}
                className="w-full h-full"
                badgeText={selectedTargets.livestream || targetUrl.includes('/live') ? 'LIVE' : 'FYP'}
                autoPlay={true}
                muted={false}
                fullSize={true}
              />
            </div>

            {/* Chi tiết tài khoản & Điều hướng trực tiếp đến TikTok */}
            <div className="flex-1 space-y-3.5 text-xs w-full min-w-0">
              {/* Thẻ Kênh TikTok */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 p-0.5 shrink-0 shadow-lg overflow-hidden">
                    <img
                      src={getTikTokAvatar(channelHandle)}
                      alt={channelHandle}
                      onError={(e) => {
                        const clean = (channelHandle || '').replace(/^@+/, '');
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(clean || 'TikTok')}&background=E11D48&color=fff&bold=true`;
                      }}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-black text-base flex items-center gap-1.5">
                      <span className="truncate">{channelHandle}</span>
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5 max-w-[260px] sm:max-w-md">
                      Link: {targetUrl}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] font-mono border border-emerald-500/30">
                    Đã Khóa Link
                  </span>
                </div>
              </div>

              {/* Thông tin trạng thái kỹ thuật */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-white">Mục tiêu:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {activeTargetsList.map(t => t.label).join(' • ') || 'Follow Kênh'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-white">Chế độ xem:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedTargets.watch ? "Bắt buộc xem đủ 15s" : "Lướt tự do (Không ép xem)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-white">Trạng thái phát:</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Toàn khung hình • Đã kết nối link
                  </span>
                </div>
              </div>

              {/* Nút thao tác nhanh */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={targetUrl.startsWith('http') ? targetUrl : `https://www.tiktok.com/${channelHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15 shadow-md text-center"
                >
                  <span>Xem Trên TikTok Của Bạn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const isLiveMode = selectedTargets.livestream || targetUrl.includes('/live') || targetUrl.toLowerCase().includes('live');
                    if (isLiveMode) {
                      openLiveRunner({
                        id: `preview_live_${Date.now()}`,
                        channelName: channelHandle,
                        channelHandle: channelHandle,
                        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                        roomTitle: title || `Phiên Live TikTok: ${channelHandle}`,
                        currentViewers: 1420,
                        targetMinutes: livestreamMinutes || 3,
                        rewardPerMinute: 400,
                        milestoneBonusCoins: 1200,
                        totalRewardCoins: 1200,
                        targetUrl: targetUrl,
                        status: 'live',
                        category: 'TikTok Live Stream',
                        hostFollowers: '100K+ Followers',
                        requiredRank: 'Đồng',
                        isLocked: false,
                        dailyTierLevel: 1,
                        tags: ['Mắt Xem Thật', 'Xem Thử']
                      });
                    } else {
                      openFeedRunner(targetUrl || channelHandle);
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600/30 to-purple-600/30 hover:from-rose-600/50 hover:to-purple-600/50 text-rose-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-500/50 shadow-md text-center"
                  title="Chế độ xem thử mô phỏng hiển thị trên Feed / Live (Chưa trừ Xu, bấm kích hoạt bên dưới để chạy chính thức)"
                >
                  <Play className="w-3.5 h-3.5 fill-rose-400" />
                  <span>Xem Thử Hiển Thị Trên Feed (Test)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Campaign Title & Speed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
              5. Tên chiến dịch chính thức:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Chiến dịch tăng trưởng kênh ${channelHandle}`}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
              6. Thuật toán phân phối:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSpeed('natural')}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  speed === 'natural'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400'
                }`}
              >
                <div className="text-[11px]">Tự Nhiên</div>
                <div className="text-[9px] text-emerald-400 font-mono">Giãn cách 3-5s</div>
              </button>
              <button
                type="button"
                onClick={() => setSpeed('turbo')}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                  speed === 'turbo'
                    ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                    : 'bg-white/[0.02] border-white/10 text-zinc-400'
                }`}
              >
                <div className="text-[11px]">Turbo</div>
                <div className="text-[9px] text-rose-400 font-mono">Ưu tiên đẩy</div>
              </button>
            </div>
          </div>
        </div>

        {/* Cam kết phân phối theo chỉ tiêu */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Cam kết phân phối từ Sàn:</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">CHẠY ĐẾN KHI ĐỦ 100% CHỈ TIÊU</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hệ thống <strong className="text-white">không cam kết thời gian hoàn thành cố định</strong> (nhanh hay chậm tùy thuộc vào chế độ đẩy Tự Nhiên / Turbo và dung lượng người dùng thực tế trên thị trường). Sàn cam kết chạy liên tục và chỉ dừng lại khi đã đạt đúng <strong className="text-emerald-400">100% số lượng mục tiêu</strong> bạn đã đăng ký.
            </p>
          </div>
        </div>

        {/* 7. Detailed Instructions */}
        <div className="space-y-1.5">
          <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
            7. Yêu cầu &amp; Hướng dẫn cho người thực hiện:
          </label>
          <textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs font-sans"
          />
        </div>

        {/* 8. ĐỊNH VỊ TỆP KHÁCH HÀNG MỤC TIÊU (2 LỰA CHỌN PHÂN PHỐI CHIẾN DỊCH) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-black border-2 border-indigo-500/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <label className="font-bold text-white uppercase font-mono text-xs block">
                  8. Phương Thức Tiếp Cận &amp; Định Vị Tệp Người Dùng:
                </label>
                <p className="text-[10px] text-slate-400 font-mono">
                  Định vị theo dữ liệu hồ sơ KYC, độ tuổi, giới tính, khu vực và lịch sử xem/thích video thực tế
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {deliveryMode === 'mass_broad' ? '🌐 Phủ Toàn Sàn (128K+ Users)' : '🎯 Nhắm Đúng Tệp Ngách'}
            </span>
          </div>

          {/* 2 Lựa chọn chính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lựa chọn 1 */}
            <button
              type="button"
              onClick={() => setDeliveryMode('mass_broad')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                deliveryMode === 'mass_broad'
                  ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/40'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
                    deliveryMode === 'mass_broad' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    🌐
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Lựa Chọn 1: Phủ Cả Thị Trường</div>
                    <div className="text-[10px] text-blue-300 font-mono">Mass Community Delivery</div>
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                  deliveryMode === 'mass_broad' ? 'border-blue-400 bg-blue-500 text-white' : 'border-white/20'
                }`}>
                  {deliveryMode === 'mass_broad' && '✓'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Đẩy chiến dịch đến toàn bộ cộng đồng người làm nhiệm vụ không giới hạn tiêu chí. Tốc độ cắn tương tác nhanh nhất, độ phủ tối đa.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                ⚡ Tốc độ hoàn thành: Siêu tốc (30 - 60 phút)
              </div>
            </button>

            {/* Lựa chọn 2 */}
            <button
              type="button"
              onClick={() => setDeliveryMode('niche_targeted')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                deliveryMode === 'niche_targeted'
                  ? 'bg-gradient-to-br from-rose-600/20 to-purple-600/20 border-pink-400 text-white shadow-lg ring-2 ring-pink-500/40'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
                    deliveryMode === 'niche_targeted' ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    🎯
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Lựa Chọn 2: Định Vị Đúng Ngách Tệp</div>
                    <div className="text-[10px] text-pink-300 font-mono">Niche Targeted Matching</div>
                  </div>
                </div>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                  deliveryMode === 'niche_targeted' ? 'border-pink-400 bg-pink-500 text-white' : 'border-white/20'
                }`}>
                  {deliveryMode === 'niche_targeted' && '✓'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Chỉ hiển thị chiến dịch cho người dùng khớp chính xác: Độ tuổi, Giới tính, Tỉnh thành, Sản phẩm quan tâm và Hành vi hay xem video.
              </p>
              <div className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                💎 Tỷ lệ chuyển đổi: Gấp 4.5 lần so với chạy đại trà
              </div>
            </button>
          </div>

          {/* Chi tiết tiêu chí ngách (Hiển thị khi chọn niche_targeted) */}
          {deliveryMode === 'niche_targeted' && (
            <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="font-bold text-white font-mono uppercase flex items-center gap-1.5">
                  <span>⚙️ Cấu Hình Tiêu Chí Lọc Tệp Người Dùng:</span>
                </span>
                <span className="text-amber-400 font-mono text-[10px]">
                  🎯 Ước tính quy mô: <strong>~28,400 người dùng thật phù hợp</strong>
                </span>
              </div>

              {/* Giới tính & Độ tuổi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Giới tính */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                    Giới Tính Người Nhận Nhiệm Vụ:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'Tất Cả' },
                      { id: 'female', label: 'Chỉ Nữ 👩' },
                      { id: 'male', label: 'Chỉ Nam 👨' }
                    ].map(g => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setTargetGender(g.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          targetGender === g.id
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Độ tuổi */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                    Độ Tuổi Mục Tiêu:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['18-24', '25-34', '35-44', '45+'].map(age => {
                      const isChecked = selectedAgeRanges.includes(age);
                      return (
                        <button
                          type="button"
                          key={age}
                          onClick={() => {
                            if (isChecked) {
                              if (selectedAgeRanges.length > 1) setSelectedAgeRanges(selectedAgeRanges.filter(a => a !== age));
                            } else {
                              setSelectedAgeRanges([...selectedAgeRanges, age]);
                            }
                          }}
                          className={`py-2 px-1 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                            isChecked
                              ? 'bg-rose-600 text-white border-rose-400'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {age} tuổi
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Khu vực địa lý */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                  Khu Vực Địa Lý (Từ Hồ Sơ KYC Tỉnh/Thành):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Toàn Quốc (63 Tỉnh)' },
                    { id: 'mien_bac', label: 'Miền Bắc (Hà Nội, HP...)' },
                    { id: 'mien_trung', label: 'Miền Trung (Đà Nẵng...)' },
                    { id: 'mien_nam', label: 'Miền Nam (TP.HCM, Cần Thơ)' }
                  ].map(r => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setSelectedRegion(r.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border text-left ${
                        selectedRegion === r.id
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loại sản phẩm & Ngành hàng quan tâm */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                  Ngành Hàng / Sở Thích Người Dùng Thường Quan Tâm:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Mỹ Phẩm & Làm Đẹp',
                    'Thời Trang & OOTD',
                    'Công Nghệ & Điện Tử',
                    'Đồ Gia Dụng',
                    'Ẩm Thực & Quán Ăn',
                    'Mẹ & Bé',
                    'Sức Khỏe & Thể Thao',
                    'Sách & Khóa Học'
                  ].map(cat => {
                    const isPicked = selectedInterests.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (isPicked) {
                            if (selectedInterests.length > 1) setSelectedInterests(selectedInterests.filter(c => c !== cat));
                          } else {
                            setSelectedInterests([...selectedInterests, cat]);
                          }
                        }}
                        className={`p-2 rounded-xl text-[11px] font-mono font-bold transition-all border text-left flex items-center justify-between ${
                          isPicked
                            ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isPicked && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hành vi xem video thực tế */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                  Hành Vi &amp; Thói Quen Xem Video (Dựa Trên Lịch Sử Xem, Tim, Comment Thật):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Reviewer TikTok Shop (Có Giỏ Hàng Mua Sắm)',
                    'Xem Livestream Bán Hàng & Săn Deal Buổi Tối',
                    'Thích Xem ASMR Ăn Uống & Mukbang Đồ Ăn',
                    'Thích Xem Phối Đồ, Biến Hình & Phong Cách Sống'
                  ].map(habit => {
                    const isChecked = selectedHabits.includes(habit);
                    return (
                      <div
                        key={habit}
                        onClick={() => {
                          if (isChecked) {
                            if (selectedHabits.length > 1) setSelectedHabits(selectedHabits.filter(h => h !== habit));
                          } else {
                            setSelectedHabits([...selectedHabits, habit]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-pink-600/20 border-pink-400 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-[11px] font-mono leading-tight">{habit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 9. Aggregated Budget Table & Instant Submission */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-black to-[#0D111E] border border-rose-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-400" />
              <span className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                Bảng Kê Chi Phí Chiến Dịch Cộng Dồn ({activeTargetsList.length} Mục Tiêu)
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              ● 100% Xu Trừ Upfront Vào Két Sàn
            </span>
          </div>

          {/* Table Breakdown */}
          <div className="divide-y divide-white/5 space-y-2 pt-1 text-xs">
            {activeTargetsList.map((t) => {
              const qty = targetQuantities[t.id] || t.minQuantity;
              const price = getTargetUnitPrice(t.id);
              const subtotal = qty * price;
              return (
                <div key={t.id} className="pt-2 first:pt-0 flex items-center justify-between font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{t.label}: {qty.toLocaleString()} {t.unitLabel} × {price.toLocaleString()} Xu</span>
                  </span>
                  <span className="font-bold text-white">
                    {subtotal.toLocaleString()} Xu <span className="text-slate-400 font-normal">({subtotal.toLocaleString()}đ)</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Add-on: Đẩy lên Bảng Điện LED Toàn Sàn (+100.000 Xu) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-purple-950/40 border border-amber-500/40 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeMarqueeBoost}
                onChange={(e) => setIncludeMarqueeBoost(e.target.checked)}
                className="w-5 h-5 rounded-md border-amber-500/50 text-amber-500 focus:ring-amber-500 bg-black/40 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black text-amber-300 text-xs sm:text-sm font-display flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                    ĐẨY LÊN BẢNG ĐIỆN LED TOÀN SÀN (+100.000 Xu)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    VIP BOOST ĐẦU TRANG
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Chiến dịch sẽ hiển thị và chạy chữ từ phải qua trái liên tục 24/7 trên dải Bảng Điện LED toàn sàn, tiếp cận tức thì 128.000+ thành viên online cho đến khi hoàn thành chỉ tiêu!
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-amber-400">+100.000 Xu</span>
                <span className="block text-[10px] text-slate-400 font-mono">(100.000đ)</span>
              </div>
            </label>
          </div>

          {/* Total Row */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-zinc-400 text-xs">Tổng số Xu cộng dồn cần thanh toán:</div>
              <div className="text-2xl font-black text-neonGold font-mono mt-0.5 flex items-baseline gap-2">
                <span>{totalCostXu.toLocaleString()} Xu</span>
                <span className="text-xs text-emerald-400 font-bold">≈ {totalCostVND}</span>
              </div>
              <div className="text-[11px] font-mono mt-0.5 flex items-center gap-1.5">
                {isAboveMinBudget ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>✓ Đạt mức tối thiểu (Từ 5.000 Xu). Phân phối liên tục đến khi đạt đúng 100% chỉ tiêu (không cam kết mốc giờ).</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>⚠️ Chiến dịch tối thiểu từ 5.000 Xu (Hiện tại thiếu {(MIN_CAMPAIGN_BUDGET_XU - totalCostXu).toLocaleString()} Xu). Hãy tăng thêm số lượng!</span>
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isAboveMinBudget}
              className={`py-3.5 px-8 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all ${
                isAboveMinBudget
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-90 text-white shadow-rose-600/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/10'
              }`}
            >
              {isMultiTarget 
                ? `KÍCH HOẠT COMBO ${activeTargetsList.length} MỤC TIÊU (-${totalCostXu.toLocaleString()} XU)`
                : `KÍCH HOẠT CHIẾN DỊCH (-${totalCostXu.toLocaleString()} XU)`}
            </button>
          </div>
        </div>
      </form>
      )}

      {/* Mega Live & Product Launch Campaign Form */}
      {activeMainTab === 'mega_launch' && (
        <form onSubmit={handleMegaSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#0D111E] border border-amber-500/30 space-y-6 text-xs shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* 1. Mega Type Switcher */}
          <div className="space-y-2">
            <label className="block text-zinc-300 font-mono font-black uppercase text-[11px]">
              1. Chọn Loại Hình Chiến Dịch Đặc Biệt:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMegaType('mega_live')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  megaType === 'mega_live'
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500 text-white shadow-lg shadow-rose-900/30'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                    Mega Live Hot
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-bold text-white text-sm">🔴 Phiên Đại Tiệc Mega Live</div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Kéo hàng ngàn mắt xem thật, giữ mắt liên tục 30-120 phút, kích hoạt đề xuất tab Live và đẩy doanh số chốt đơn thần tốc.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMegaType('product_launch')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  megaType === 'product_launch'
                    ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Megaphone className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    Product Launch
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-bold text-white text-sm">🚀 Chiến Dịch Tung &amp; Ra Mắt Sản Phẩm Mới</div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Phủ sóng video viral ra mắt sản phẩm mới, kéo tương tác bình luận seeding giỏ hàng, phủ sóng thị trường đúng tệp khách.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Product Details & Deal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                🏷️ Tên Sản Phẩm / Bộ Sưu Tập Chính:
              </label>
              <input
                type="text"
                value={megaProductName}
                onChange={(e) => setMegaProductName(e.target.value)}
                placeholder="Tên sản phẩm / thương hiệu chính thức"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                📦 Ngành Hàng / Ngách Sản Phẩm:
              </label>
              <select
                value={megaProductCategory}
                onChange={(e) => setMegaProductCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Mỹ Phẩm & Làm Đẹp">Mỹ Phẩm &amp; Làm Đẹp</option>
                <option value="Thời Trang & Phụ Kiện">Thời Trang &amp; Phụ Kiện</option>
                <option value="Công Nghệ & Điện Tử">Công Nghệ &amp; Điện Tử</option>
                <option value="Gia Dụng & Đời Sống">Gia Dụng &amp; Đời Sống</option>
                <option value="Ẩm Thực & F&B">Ẩm Thực &amp; F&amp;B</option>
                <option value="Mẹ & Bé">Mẹ &amp; Bé</option>
                <option value="Sức Khỏe & Thể Thao">Sức Khỏe &amp; Thể Thao</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                💰 Giá Bán Niêm Yết / Khuyến Mãi:
              </label>
              <input
                type="text"
                value={megaProductPrice}
                onChange={(e) => setMegaProductPrice(e.target.value)}
                placeholder="Giá niêm yết chính thức"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                🎁 Deal Độc Quyền / Voucher Ghim Live:
              </label>
              <input
                type="text"
                value={megaVoucher}
                onChange={(e) => setMegaVoucher(e.target.value)}
                placeholder="Ưu đãi đính kèm phiên live chính thức"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Link Video / Live & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                🔗 Link Video / Phiên Live TikTok:
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => handleTargetUrlChange(e.target.value)}
                placeholder="https://www.tiktok.com/@username/live hoặc video"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                👤 Kênh TikTok / Chủ Phòng Live:
              </label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="@username"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-rose-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Ô XEM TRƯỚC PHIÊN LIVE / VIDEO MEGA */}
          <div className="p-5 sm:p-6 rounded-3xl bg-black/80 border border-amber-500/40 flex flex-col lg:flex-row items-center lg:items-start gap-6 shadow-2xl">
            <div className="w-full max-w-[340px] sm:w-[340px] h-[540px] sm:h-[580px] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-black">
              <TikTokVideoPreviewPlayer
                url={targetUrl}
                channelHandle={channelHandle}
                isLive={true}
                className="w-full h-full"
                badgeText="MEGA LIVE"
                autoPlay={true}
                muted={false}
                fullSize={true}
              />
            </div>
            <div className="flex-1 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-white uppercase text-sm font-mono">
                  🔴 KẾT NỐI PHIÊN LIVE / MEGA LAUNCH TỨC THÌ
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Đồng bộ kênh <strong className="text-rose-400 font-mono">{channelHandle}</strong> vào hệ thống kéo mắt xem thật 100% người dùng thật từ mạng lưới KOC/Creator.
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1 text-amber-300 text-[11px] font-mono">
                <div>• Độ nét: 1080p Ultra HD Live Stream</div>
                <div>• Luồng phân phối: Tự động đưa vào phiên phát trực tiếp toàn sàn</div>
                <div>• Tỷ lệ giữ chân người xem: Tối thiểu 3 - 30 phút theo gói</div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sẵn sàng phát sóng trên toàn bộ Feed lướt & Hệ thống đẩy view VIP</span>
              </div>
              <div className="pt-1">
                <a
                  href={targetUrl.startsWith('http') ? targetUrl : `https://www.tiktok.com/${channelHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 font-mono font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer w-fit"
                >
                  <span>Mở Xem Kênh TikTok Này</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Target Scale & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                🎯 Chỉ Tiêu Mắt Xem / Tương Tác:
              </label>
              <select
                value={megaLiveGoal}
                onChange={(e) => setMegaLiveGoal(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value={2000}>2,000 Người Xem Thật</option>
                <option value={5000}>5,000 Người Xem Thật (Khuyên Dùng)</option>
                <option value={10000}>10,000 Người Xem Thật (Mega Live VIP)</option>
                <option value={20000}>20,000 Người Xem Thật (Sự Kiện Toàn Quốc)</option>
                <option value={50000}>50,000 Người Xem Thật (Đại Tiệc Triệu View)</option>
              </select>
            </div>

            {megaType === 'mega_live' ? (
              <div className="space-y-1.5">
                <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                  ⏱️ Thời Lượng Giữ Chân Khán Giả:
                </label>
                <select
                  value={megaLiveDuration}
                  onChange={(e) => setMegaLiveDuration(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value={15}>15 Phút Khởi Động</option>
                  <option value={30}>30 Phút Giờ Vàng</option>
                  <option value={60}>60 Phút Trọn Ca Live (Bán Chạy Nhất)</option>
                  <option value={120}>120 Phút Toàn Bộ Sự Kiện Mega</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-zinc-300 font-mono font-bold text-[11px]">
                  📅 Lịch Trình Phát Sóng / Tung Clip:
                </label>
                <input
                  type="text"
                  value={megaLiveDateTime}
                  onChange={(e) => setMegaLiveDateTime(e.target.value)}
                  placeholder="20:00 Tối Nay"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* 5. Deep Audience Targeting */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs font-mono uppercase">
                Nhắm Đúng Tệp Khán Giả Tiềm Năng (Targeting Tự Động)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] font-mono mb-1">Giới Tính:</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'female', label: 'Nữ' },
                    { id: 'male', label: 'Nam' }
                  ].map(g => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setTargetGender(g.id as any)}
                      className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        targetGender === g.id
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-mono mb-1">Khu Vực Địa Lý:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                >
                  <option value="all">Toàn Quốc (63 Tỉnh Thành)</option>
                  <option value="north">Miền Bắc (Hà Nội, Hải Phòng...)</option>
                  <option value="central">Miền Trung (Đà Nẵng, Huế...)</option>
                  <option value="south">Miền Nam (TP.HCM, Cần Thơ...)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-mono mb-1">Độ Tuổi Chủ Đạo:</label>
                <div className="flex items-center gap-1">
                  {['18-24', '25-34', '35-44'].map(age => {
                    const isChecked = selectedAgeRanges.includes(age);
                    return (
                      <button
                        type="button"
                        key={age}
                        onClick={() => {
                          setSelectedAgeRanges(prev => 
                            isChecked ? prev.filter(a => a !== age) : [...prev, age]
                          );
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          isChecked
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Push Notification & LED Add-on */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/30 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={megaPushNotification}
                onChange={(e) => setMegaPushNotification(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-black/40 border-white/20"
              />
              <div className="flex-1">
                <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Gửi Thông Báo Đẩy (Push Notification) Tới 128.000+ Thành Viên Trước Giờ G (Miễn Phí)
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Hệ thống tự động thông báo trước 15 phút tới toàn bộ thành viên đang online để tập trung vào xem.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-rose-950/30 border border-amber-500/30 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeMarqueeBoost}
                onChange={(e) => setIncludeMarqueeBoost(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-black/40 border-white/20"
              />
              <div className="flex-1">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  ĐẨY LÊN BẢNG ĐIỆN LED TOÀN SÀN (+100.000 Xu)
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Chạy chữ nổi bật liên tục 24/7 đầu ứng dụng để tối đa hóa lượt tiếp cận.
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-amber-400">+100.000 Xu</span>
              </div>
            </label>
          </div>

          {/* 7. Cost & Submission */}
          {(() => {
            const isMegaLive = megaType === 'mega_live';
            const basePrice = isMegaLive ? 1000 : 500;
            const megaTotalXu = (megaLiveGoal * basePrice) + (includeMarqueeBoost ? MARQUEE_FEE : 0);
            return (
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-slate-400 text-xs font-mono">Tổng ngân sách chiến dịch VIP:</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-0.5 flex items-baseline gap-2">
                    <span>{megaTotalXu.toLocaleString()} Xu</span>
                    <span className="text-xs text-emerald-400 font-bold">≈ {megaTotalXu.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ● Đã bao gồm phí phân phối 100% người thật KYC và hệ thống chống tụt.
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3.5 px-8 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:opacity-95 text-white shadow-xl shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  🚀 KÍCH HOẠT GÓI {isMegaLive ? 'MEGA LIVE' : 'TUNG SẢN PHẨM'} (-{megaTotalXu.toLocaleString()} XU)
                </button>
              </div>
            );
          })()}
        </form>
      )}

      {/* Active campaigns list with progress tracking */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Flame className="h-4 w-4 text-rose-500" />
          <span>Chiến Dịch Đang Chạy Trong Hệ Thống ({campaigns.length})</span>
        </h3>
        <div className="space-y-2.5">
          {campaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.completedQuantity / Math.max(1, camp.targetQuantity)) * 100));
            const isLive = camp.type === 'livestream' || camp.type === 'livestream_viewers';
            const isMulti = camp.type === 'multi_target' || (camp.multiTargets && camp.multiTargets.length > 0);

            return (
              <div
                key={camp.id}
                className="p-4 rounded-2xl bg-[#0D111E] border border-white/10 space-y-3 text-xs shadow-md"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3.5">
                  {/* Realtime Video Stream of this Campaign */}
                  <div 
                    onClick={() => {
                      if (isLive) {
                        const matchedLive = livestreamTasks.find(l => l.targetUrl === camp.targetUrl || l.channelHandle === camp.channelHandle);
                        if (matchedLive) {
                          openLiveRunner(matchedLive);
                        } else {
                          openLiveRunner({
                            id: `live_${camp.id}`,
                            channelName: camp.channelHandle,
                            channelHandle: camp.channelHandle,
                            channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                            roomTitle: camp.title,
                            currentViewers: 120,
                            targetMinutes: camp.livestreamMinutes || 3,
                            rewardPerMinute: 400,
                            milestoneBonusCoins: 1200,
                            totalRewardCoins: 1200,
                            targetUrl: camp.targetUrl,
                            status: 'live',
                            category: 'TikTok Shop Flash Sale',
                            hostFollowers: '100K+ Followers',
                            requiredRank: 'Đồng',
                            isLocked: false,
                            dailyTierLevel: 1,
                            tags: ['Mắt Xem Thật', 'Đang Chạy']
                          });
                        }
                      } else {
                        openFeedRunner(camp.id);
                      }
                    }}
                    className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg relative bg-black cursor-pointer group hover:border-rose-500/60 transition-colors"
                    title={isLive ? "Bấm để mở phòng Live trực tiếp" : "Bấm để mở video chiến dịch này trong Feed"}
                  >
                    <TikTokVideoPreviewPlayer
                      url={camp.targetUrl}
                      channelHandle={camp.channelHandle}
                      isLive={Boolean(isLive)}
                      className="w-full h-full"
                      autoPlay={true}
                      muted={true}
                      showControls={false}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{camp.title}</span>
                        {isMulti && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                            🔥 Combo Đa Mục Tiêu
                          </span>
                        )}
                        {isLive && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                            🔴 Live {camp.livestreamMinutes || 3} phút
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            if (isLive) {
                              const matchedLive = livestreamTasks.find(l => l.targetUrl === camp.targetUrl || l.channelHandle === camp.channelHandle);
                              if (matchedLive) {
                                openLiveRunner(matchedLive);
                              } else {
                                openLiveRunner({
                                  id: `live_${camp.id}`,
                                  channelName: camp.channelHandle,
                                  channelHandle: camp.channelHandle,
                                  channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                                  roomTitle: camp.title,
                                  currentViewers: 120,
                                  targetMinutes: camp.livestreamMinutes || 3,
                                  rewardPerMinute: 400,
                                  milestoneBonusCoins: 1200,
                                  totalRewardCoins: 1200,
                                  targetUrl: camp.targetUrl,
                                  status: 'live',
                                  category: 'TikTok Shop Flash Sale',
                                  hostFollowers: '100K+ Followers',
                                  requiredRank: 'Đồng',
                                  isLocked: false,
                                  dailyTierLevel: 1,
                                  tags: ['Mắt Xem Thật', 'Đang Chạy']
                                });
                              }
                            } else {
                              openFeedRunner(camp.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title={isLive ? "Xem phiên Live trực tiếp" : "Xem chiến dịch phát sóng trong Feed lướt video"}
                        >
                          <Play className="w-3 h-3 fill-rose-400" />
                          <span>{isLive ? 'Xem Phiên Live' : 'Xem trên Feed'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Bạn có chắc chắn muốn xóa chiến dịch "${camp.title}" không?`)) {
                              deleteCampaign(camp.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Xóa chiến dịch này"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          {camp.status === 'running' ? 'Đang phân phối' : camp.status}
                        </span>
                        <span className="font-mono font-bold text-neonGold text-xs">{camp.budgetTotal}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 flex-wrap">
                      <span className="text-rose-400 font-bold">{camp.channelHandle}</span>
                      <span>•</span>
                      <span>Mục tiêu: {camp.targetQuantity.toLocaleString()} {isLive ? 'mắt' : 'lượt'}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Đã đạt: {camp.completedQuantity.toLocaleString()} ({percent}%)</span>
                      <span>•</span>
                      <span className="text-cyan-300">Chạy liên tục đến khi đạt 100%</span>
                    </div>
                  </div>
                </div>

                {/* Sub-targets tags if available */}
                {camp.multiTargets && camp.multiTargets.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-slate-400">Gồm:</span>
                    {camp.multiTargets.map((st, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                        {st.label}: {st.targetQuantity.toLocaleString()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Báo Cáo Đo Lường Dữ Liệu Tệp Khán Giả (Demographics Report) */}
                {(() => {
                  const isAdmin = user.isAdmin || user.email === 'quocthiencr90@gmail.com' || user.email === 'thienvuaapp@gmail.com';
                  const isUnlocked = camp.isAnalyticsUnlocked || isAdmin;
                  const audienceReport = camp.demographicsReport;
                  const femalePct = audienceReport?.genderDistribution?.female ?? 58;
                  const malePct = audienceReport?.genderDistribution?.male ?? 42;
                  const realScore = audienceReport?.realUserScore ?? 99.2;
                  const peakViewers = audienceReport?.peakLiveViewers || (camp.targetQuantity ? Math.round(camp.targetQuantity * 1.25) : 8500);
                  const gmv = audienceReport?.generatedRevenueEstimateVND || '45.000.000đ - 120.000.000đ';
                  const ageList = audienceReport?.ageGroups ? [
                    { range: '18-24 tuổi', percent: audienceReport.ageGroups['18-24'] || 46 },
                    { range: '25-34 tuổi', percent: audienceReport.ageGroups['25-34'] || 38 },
                    { range: '35-44 tuổi', percent: audienceReport.ageGroups['35-44'] || 12 },
                    { range: '45+ tuổi', percent: audienceReport.ageGroups['45+'] || 4 },
                  ] : [
                    { range: '18-24 tuổi', percent: 46 },
                    { range: '25-34 tuổi', percent: 38 },
                    { range: '35-44 tuổi', percent: 12 },
                    { range: 'Khác', percent: 4 },
                  ];
                  const locList = audienceReport?.topLocations?.map(l => `${l.province} (${l.percentage}%)`) || [
                    'TP. Hồ Chí Minh (42%)', 'Hà Nội (31%)', 'Đà Nẵng (12%)', 'Hải Phòng (9%)', 'Cần Thơ (6%)'
                  ];

                  return (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black font-display text-white">
                          <BarChart3 className="w-4 h-4 text-cyan-400" />
                          <span>Báo Cáo Đo Lường Tệp Khán Giả Thực Tế</span>
                        </div>
                        {isUnlocked ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Unlock className="w-3 h-3 text-emerald-400" />
                            {isAdmin ? '👑 Admin Toàn Quyền' : 'Đã Mở Khóa Real-Time'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            Báo Cáo Khóa (200.000 Xu)
                          </span>
                        )}
                      </div>

                      {isUnlocked ? (
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-cyan-500/30 space-y-3">
                          {/* Key Metrics Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                              <div className="text-[10px] text-slate-400 font-mono">Điểm Người Thật KYC</div>
                              <div className="text-sm font-black text-emerald-400 font-mono">{realScore}% ✓</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                              <div className="text-[10px] text-slate-400 font-mono">Tỷ Lệ Giới Tính</div>
                              <div className="text-xs font-bold text-pink-300 font-mono">{femalePct}% Nữ / {malePct}% Nam</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                              <div className="text-[10px] text-slate-400 font-mono">Mắt Xem Đỉnh Điểm</div>
                              <div className="text-sm font-black text-amber-400 font-mono">{peakViewers.toLocaleString()}</div>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                              <div className="text-[10px] text-slate-400 font-mono">Ước Tính Doanh Thu GMV</div>
                              <div className="text-[11px] font-bold text-cyan-300 font-mono">{gmv}</div>
                            </div>
                          </div>

                          {/* Age and Region Breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1.5">
                              <div className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                                <Users className="w-3 h-3 text-indigo-400" /> Phân Bố Độ Tuổi
                              </div>
                              {ageList.map((ag, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-slate-300">{ag.range}</span>
                                  <div className="flex items-center gap-2 flex-1 max-w-[120px] ml-2">
                                    <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${ag.percent}%` }} />
                                    </div>
                                    <span className="text-white font-bold w-7 text-right">{ag.percent}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                              <div className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-pink-400" /> Top Tỉnh Thành Tiếp Cận
                              </div>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {locList.map((prov, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                                    {prov}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="text-white font-bold text-xs flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              Mở Khóa Toàn Bộ Dữ Liệu Tệp Khán Giả &amp; Phân Tích Chuyên Sâu
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Xem chi tiết độ tuổi, giới tính, tỉnh thành tiếp cận, điểm uy tín 99.2% người thật và ước tính doanh thu GMV của chiến dịch này.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              unlockCampaignAnalytics(camp.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs font-mono shadow-md shadow-amber-500/20 shrink-0 cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 justify-center"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Mở Khóa Báo Cáo (200.000 Xu)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Marquee Ticker Controls for Campaign */}
                {(() => {
                  const isMarqueeActive = marqueeTickerList.some(m => m.id === camp.id || m.title === camp.title || m.targetUrl === camp.targetUrl);
                  return (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5 justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        {camp.isBoosted ? (
                          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-mono text-[10px] font-black flex items-center gap-1 shadow-md shadow-rose-600/30 animate-pulse">
                            🔥 ĐANG Ở TOP 1 TOÀN SÀN
                          </span>
                        ) : null}

                        {isMarqueeActive ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                            BẢNG ĐIỆN LED (TOP SÀN)
                          </span>
                        ) : null}

                        {!camp.isBoosted && !isMarqueeActive && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Thứ tự thường (Theo thời gian tạo)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Nút Đẩy Lên TOP 1 Sàn (100.000 Xu) */}
                        <button
                          type="button"
                          onClick={() => boostCampaignToTop(camp.id)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[10px] font-mono flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer ${
                            camp.isBoosted
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                              : "bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-rose-600/30 ring-1 ring-white/20"
                          }`}
                          title="Bỏ ra 100.000 Xu để đưa chiến dịch lên Top đầu, ưu tiên hiển thị trước và hoàn thành sớm nhất"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current text-amber-300" />
                          <span>{camp.isBoosted ? "🚀 Đã Đẩy Top (Đẩy Tiếp 100K Xu)" : "🚀 Đẩy Lên TOP (100.000 Xu)"}</span>
                        </button>

                        {isMarqueeActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              const mItem = marqueeTickerList.find(m => m.id === camp.id || m.title === camp.title || m.targetUrl === camp.targetUrl);
                              if (mItem) endMarqueeItem(mItem.id, 'campaign_completed');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] font-mono transition-colors"
                          >
                            ⏹️ Kết Thúc LED
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => boostToMarquee(camp.id, 'campaign')}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-black text-[10px] font-mono flex items-center gap-1 transition-transform active:scale-95"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Đẩy LED (100K Xu)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

