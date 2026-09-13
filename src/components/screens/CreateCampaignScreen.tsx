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
  ExternalLink
} from 'lucide-react';
import { CampaignItem, FLEXIBLE_LIVESTREAM_TIERS, MultiTargetConfig } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';

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
    label: 'Follow Kênh Thật', 
    icon: UserPlus, 
    desc: '500 Xu / follow', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Follower' 
  },
  { 
    id: 'watch', 
    label: 'Xem Video FYP 15s', 
    icon: Play, 
    desc: '500 Xu / lượt', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Lượt Xem' 
  },
  { 
    id: 'like', 
    label: 'Thả Tim Video', 
    icon: Heart, 
    desc: '250 Xu / tim', 
    unitPrice: 250, 
    minQuantity: 1, 
    defaultQty: 20, 
    unitLabel: 'Lượt Tim' 
  },
  { 
    id: 'comment', 
    label: 'Bình Luận Seeding', 
    icon: MessageSquare, 
    desc: '500 Xu / cmt', 
    unitPrice: 500, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Bình Luận' 
  },
  { 
    id: 'share', 
    label: 'Chia Sẻ Video', 
    icon: Share2, 
    desc: '600 Xu / share', 
    unitPrice: 600, 
    minQuantity: 1, 
    defaultQty: 10, 
    unitLabel: 'Lượt Chia Sẻ' 
  },
  { 
    id: 'livestream', 
    label: 'Mắt Live Linh Hoạt', 
    icon: Eye, 
    desc: 'Từ 350 Xu / mắt', 
    unitPrice: 350, 
    minQuantity: 1, 
    defaultQty: 15, 
    unitLabel: 'Mắt Live' 
  },
  { 
    id: 'booking_review', 
    label: 'Booking KOC / Review', 
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
    openDeposit, 
    campaigns, 
    showToast,
    boostToMarquee,
    endMarqueeItem,
    marqueeTickerList
  } = useTikTokApp();

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
      showToast(`🎉 Đã kích hoạt chiến dịch thành công! Đã trừ ${totalCostXu.toLocaleString()} Xu từ tài khoản.`);
      setTitle('');
      setIncludeMarqueeBoost(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 text-pink-300 text-xs font-mono mb-2 border border-pink-500/30">
          <Sparkles className="h-3.5 w-3.5 text-pink-400" />
          <span className="font-bold">TỰ DO KHỞI CHẠY CHIẾN DỊCH • CHỈ CẦN TỪ 5.000 XU TRỞ LÊN</span>
        </div>
        <div className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-pink-500" />
          <h2 className="text-xl sm:text-2xl font-black text-white">Tạo Chiến Dịch Tăng Trưởng &amp; Tương Tác TikTok</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Chỉ cần có Xu trong ví, bạn có thể chạy bất kỳ số lượng tương tác nào (10 follow, 20 tim, 50 view, mắt live...). Ngân sách tối thiểu mỗi chiến dịch là <strong>5.000 Xu</strong>.
        </p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Tùy chọn kết hợp nhiều mục tiêu cùng lúc: Follow, Xem Video FYP, Thả Tim, Bình Luận, Chia Sẻ hoặc Mắt Live. Hệ thống sẽ cộng dồn số Xu và trừ một lần từ ví để chạy đồng thời!
        </p>
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
              <span className="text-emerald-400 font-bold">{user.coinsValueVND}</span>
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

        {/* 3. TikTok Channel Handle & URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
                3. TikTok Channel Handle (@):
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">Tự động điền kênh kết nối</span>
            </div>
            <input
              type="text"
              value={channelHandle}
              onChange={(e) => {
                const val = e.target.value;
                setChannelHandle(val.startsWith('@') || !val ? val : `@${val}`);
              }}
              placeholder="@kenhcua_ban"
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
                4. Link Kênh, Video hoặc Phiên Live TikTok:
              </label>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">Dán link hiển thị ngay</span>
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => handleTargetUrlChange(e.target.value)}
              placeholder="https://www.tiktok.com/@... hoặc dán link video / live"
              className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-xs"
              required
            />
          </div>
        </div>

        {/* Ô KẾT NỐI MEDIA TIKTOK: Hiển thị ngay lập tức video / phiên live cho người dùng */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-rose-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase text-white">
                {selectedTargets.livestream || targetUrl.includes('/live') 
                  ? '🔴 XEM TRƯỚC PHIÊN LIVE TIKTOK (HIỂN THỊ TRỰC TIẾP)' 
                  : '🎬 XEM TRƯỚC VIDEO / KÊNH TIKTOK CHO 154.200+ CREATOR'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Kết nối tức thì
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-3.5 rounded-xl border border-white/5">
            {/* Simulated mini TikTok player */}
            <div className="relative w-28 h-40 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-white/10 shadow-lg group">
              <video
                src={selectedTargets.livestream || targetUrl.includes('/live') 
                  ? "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42318-large.mp4"
                  : "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4"}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-rose-600 text-white text-[8px] font-black uppercase font-mono">
                {selectedTargets.livestream || targetUrl.includes('/live') ? 'LIVE' : 'FYP'}
              </div>
              <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] text-white font-bold truncate">
                {channelHandle}
              </div>
            </div>

            {/* Preview meta and explanations */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black text-xs">
                  {channelHandle.replace('@', '').charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-bold flex items-center gap-1">
                    <span>{channelHandle}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[280px]">
                    {targetUrl}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Mục tiêu phân phối:</span>
                  <span className="text-neonGold font-mono font-bold">
                    {activeTargetsList.map(t => t.label).join(' • ') || 'Follow Kênh'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Khống chế xem 15s:</span>
                  <span className={selectedTargets.watch ? "text-amber-400 font-mono font-bold" : "text-emerald-400 font-mono font-bold"}>
                    {selectedTargets.watch ? "Bắt buộc xem đủ 15s" : "Không ép xem 15s (Tự do lướt tiếp)"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={targetUrl.startsWith('http') ? targetUrl : `https://www.tiktok.com/${channelHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Mở kiểm tra trên TikTok</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-slate-400">
                  Video / live sẽ xuất hiện ngay trong feed lướt của toàn bộ cộng đồng!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Campaign Title & Speed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-zinc-300 font-mono font-bold uppercase text-[10px]">
              5. Tên chiến dịch:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`VD: Combo Tăng Trưởng Toàn Diện cho ${channelHandle}`}
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
                className="p-4 rounded-2xl bg-[#0D111E] border border-white/10 space-y-2.5 text-xs shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
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
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400 flex-wrap">
                      <span className="text-rose-400">{camp.channelHandle}</span>
                      <span>•</span>
                      <span>Mục tiêu: {camp.targetQuantity.toLocaleString()} {isLive ? 'mắt' : 'lượt'}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Đã đạt: {camp.completedQuantity.toLocaleString()} ({percent}%)</span>
                      <span>•</span>
                      <span className="text-cyan-300">Chạy liên tục đến khi đạt 100%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {camp.status === 'running' ? 'Đang phân phối' : camp.status}
                    </span>
                    <span className="font-mono font-bold text-neonGold text-xs">{camp.budgetTotal}</span>
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

                {/* Marquee Ticker Controls for Campaign */}
                {(() => {
                  const isMarqueeActive = marqueeTickerList.some(m => m.id === camp.id || m.title === camp.title || m.targetUrl === camp.targetUrl);
                  return (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5 justify-between">
                      <div className="flex items-center gap-2">
                        {isMarqueeActive ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                            BẢNG ĐIỆN LED ĐANG CHẠY (TOP TOÀN SÀN)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Chưa lên Bảng Điện LED
                          </span>
                        )}
                      </div>
                      <div>
                        {isMarqueeActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              const mItem = marqueeTickerList.find(m => m.id === camp.id || m.title === camp.title || m.targetUrl === camp.targetUrl);
                              if (mItem) endMarqueeItem(mItem.id, 'campaign_completed');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] font-mono transition-colors"
                          >
                            ⏹️ Kết Thúc & Lưu Lịch Sử
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => boostToMarquee(camp.id, 'campaign')}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-[10px] font-mono flex items-center gap-1 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Đẩy Bảng Điện LED (100.000 Xu)</span>
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

