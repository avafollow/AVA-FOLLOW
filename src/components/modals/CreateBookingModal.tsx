import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  Video, 
  HelpCircle,
  Clock,
  Bot,
  User,
  Film,
  AlertCircle,
  TrendingUp,
  Tag,
  FileText,
  Calendar,
  DollarSign,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  BookingCategory, 
  VideoCreatorType, 
  VideoDuration 
} from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { 
  KOC_INDUSTRY_SECTORS, 
  KOC_DELIVERABLE_TYPES, 
  DURATION_FACTORS, 
  calculateKocFloorPrice, 
  validateKocDealPrice 
} from '../../data/kocPricingAndContract';
import { EscrowContractModal } from './EscrowContractModal';

export const CreateBookingModal: React.FC = () => {
  const { isBookingModalOpen, closeBookingModal, createEscrowBooking, user, openDeposit } = useTikTokApp();

  // Form selections
  const [creatorType, setCreatorType] = useState<VideoCreatorType>('human');
  const [industryId, setIndustryId] = useState<string>('beauty');
  const [deliverableId, setDeliverableId] = useState<string>('review');
  const [duration, setDuration] = useState<VideoDuration>('3_min');
  const [videoQuantity, setVideoQuantity] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [kocHandle, setKocHandle] = useState<string>('@phuongbeauty_koc');
  const [requirements, setRequirements] = useState<string>('Quay video trải nghiệm thực tế trên tay, nêu rõ ưu điểm nổi bật, gắn giỏ hàng TikTok Shop và kèm hashtag thương hiệu.');
  const [deadlineDays, setDeadlineDays] = useState<number>(5);
  const [isCustomDays, setIsCustomDays] = useState<boolean>(false);

  // Custom inputs for "Other" selections and annex
  const [customIndustryName, setCustomIndustryName] = useState<string>('');
  const [customDeliverableName, setCustomDeliverableName] = useState<string>('');
  const [customAnnexTerms, setCustomAnnexTerms] = useState<string>('');
  const [customDeliveryNotes, setCustomDeliveryNotes] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [sampleReturnAddress, setSampleReturnAddress] = useState<string>('');

  const durationLabel = duration === '1_min' ? '1 Phút' : duration === '2_min' ? '2 Phút' : duration === '3_min' ? '3 Phút' : duration === '5_min' ? '5 Phút' : '10 Phút';

  // Contract Preview Modal State
  const [isContractPreviewOpen, setIsContractPreviewOpen] = useState<boolean>(false);

  // Compute market floor price dynamically
  const currentFloorPrice = calculateKocFloorPrice({
    deliverableId,
    industryId,
    duration,
    creatorType
  });

  // State for negotiated deal price (default to floor price)
  const [dealPrice, setDealPrice] = useState<number>(currentFloorPrice);

  // Keep dealPrice synced with floorPrice if user hasn't negotiated higher
  useEffect(() => {
    setDealPrice(prev => (prev < currentFloorPrice ? currentFloorPrice : prev));
  }, [currentFloorPrice]);

  if (!isBookingModalOpen) return null;

  // Validation
  const validation = validateKocDealPrice(dealPrice, currentFloorPrice);

  // Combo volume discounts: 3 videos (5% off), 5 videos (10% off), 10 videos (15% off)
  let discountRate = 0;
  if (videoQuantity >= 10) discountRate = 0.15;
  else if (videoQuantity >= 5) discountRate = 0.10;
  else if (videoQuantity >= 3) discountRate = 0.05;

  const rawTotal = Math.round(dealPrice * videoQuantity * (1 - discountRate));
  const totalEscrowAmount = `${rawTotal.toLocaleString('vi-VN')}đ`;
  const pricePerVideo = `${Math.round(rawTotal / videoQuantity).toLocaleString('vi-VN')}đ`;

  const hasEnoughCoins = user.avaliveCoins >= rawTotal;

  // Compute specific deadline date string
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
  const formattedDeadline = `18:00 ngày ${deadlineDate.toLocaleDateString('vi-VN')} (${deadlineDays} ngày kể từ ngày nhận mẫu)`;

  const selectedIndustry = KOC_INDUSTRY_SECTORS.find(i => i.id === industryId) || KOC_INDUSTRY_SECTORS[0];
  const selectedDeliverable = KOC_DELIVERABLE_TYPES.find(d => d.id === deliverableId) || KOC_DELIVERABLE_TYPES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      alert(validation.errorMessage || 'Mức giá deal không được dưới giá sàn!');
      return;
    }

    if (!title.trim() || !productName.trim() || !kocHandle.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề, tên sản phẩm và kênh KOC cần book!');
      return;
    }

    const effectiveIndustryName = industryId === 'other' && customIndustryName.trim() 
      ? `Khác: ${customIndustryName.trim()}` 
      : selectedIndustry.name;

    const effectiveDeliverableName = deliverableId === 'other' && customDeliverableName.trim()
      ? `Khác: ${customDeliverableName.trim()}`
      : selectedDeliverable.name;

    const success = createEscrowBooking({
      clientName: user.name,
      clientAvatar: user.avatar,
      clientPhone: clientPhone.trim() || undefined,
      clientAddress: clientAddress.trim() || undefined,
      sampleReturnAddress: sampleReturnAddress.trim() || undefined,
      kocName: creatorType === 'ai' ? 'AI Video Creator Studio' : kocHandle.replace('@', ''),
      kocHandle: kocHandle.startsWith('@') ? kocHandle : `@${kocHandle}`,
      kocAvatar: creatorType === 'ai' 
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      title,
      category: (deliverableId === 'photo_poster' ? 'photo_graphic' : deliverableId === 'livestream_session' ? 'livestream_cohost' : 'review') as BookingCategory,
      creatorType,
      videoDuration: duration,
      videoQuantity,
      totalEscrowAmount,
      pricePerVideo,
      productName,
      requirements,
      deadlineDays,
      warrantyDays: 3,
      autoReleaseHoursLeft: 72,
      industrySector: effectiveIndustryName,
      deliverableType: effectiveDeliverableName,
      floorUnitPrice: currentFloorPrice,
      agreedUnitPrice: dealPrice,
      deliveryDeadlineDate: formattedDeadline,
      customIndustryName: customIndustryName.trim() || undefined,
      customDeliverableName: customDeliverableName.trim() || undefined,
      customAnnexTerms: customAnnexTerms.trim() || undefined,
      customDeliveryNotes: customDeliveryNotes.trim() || undefined,
      clientSignedAt: 'Vừa xong'
    });

    if (success) {
      closeBookingModal();
    }
  };

  // Prepare dummy contract for preview
  const previewContractObj = {
    id: 'preview_draft',
    contractCode: `ESC-2026-PREVIEW`,
    clientName: user.name || 'Thương Hiệu / Bên Thuê',
    clientAvatar: user.avatar,
    clientPhone: clientPhone.trim() || undefined,
    clientAddress: clientAddress.trim() || undefined,
    sampleReturnAddress: sampleReturnAddress.trim() || undefined,
    kocName: creatorType === 'ai' ? 'AI Video Creator Studio' : kocHandle.replace('@', ''),
    kocHandle: kocHandle.startsWith('@') ? kocHandle : `@${kocHandle}`,
    kocAvatar: '',
    title: title || `Booking ${videoQuantity} ${deliverableId === 'other' && customDeliverableName ? customDeliverableName : selectedDeliverable.name} cho ${productName || 'Sản phẩm'}`,
    category: 'review' as BookingCategory,
    creatorType,
    videoDuration: duration,
    videoQuantity,
    totalEscrowAmount,
    pricePerVideo,
    productName: productName || 'Sản Phẩm Chưa Đặt Tên',
    requirements,
    deadlineDays,
    warrantyDays: 3,
    autoReleaseHoursLeft: 72,
    industrySector: industryId === 'other' && customIndustryName ? `Khác: ${customIndustryName}` : selectedIndustry.name,
    deliverableType: deliverableId === 'other' && customDeliverableName ? `Khác: ${customDeliverableName}` : selectedDeliverable.name,
    floorUnitPrice: currentFloorPrice,
    agreedUnitPrice: dealPrice,
    deliveryDeadlineDate: formattedDeadline,
    customIndustryName: customIndustryName.trim() || undefined,
    customDeliverableName: customDeliverableName.trim() || undefined,
    customAnnexTerms: customAnnexTerms.trim() || undefined,
    customDeliveryNotes: customDeliveryNotes.trim() || undefined,
    status: 'escrow_locked' as const,
    createdAt: 'Hôm nay'
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
        <div 
          className="w-full max-w-4xl max-h-[94vh] rounded-3xl bg-[#0D111E] border border-white/15 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold mb-0.5 border border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3" /> 
                  <span>KÝ QUỸ ESCROW TRUNG GIAN • BẢO HÀNH 3 NGÀY (72H)</span>
                  <FeatureGuideTooltip 
                    title="Chính Sách Bảo Hành 3 Ngày & Ký Quỹ Escrow"
                    description="Tiền của Bên Thuê được khóa 100% trong két Sàn. Khi KOC nộp video, hai bên có đúng 3 ngày (72 giờ) bảo hành để đối soát chất lượng trước khi giải ngân."
                    steps={[
                      'Bên thuê nạp tiền ký quỹ vào Sàn (KOC an tâm nhận việc, không lo bùng tiền).',
                      'Hai bên thỏa thuận giá theo sản phẩm nhưng TUYỆT ĐỐI KHÔNG DƯỚI GIÁ SÀN THỊ TRƯỜNG.',
                      'KOC quay dựng video đúng kịch bản và nộp demo lên sàn.',
                      'Kích hoạt 3 ngày bảo hành: Bên thuê kiểm tra video (đúng thời lượng, âm thanh, gắn giỏ hàng).',
                      'Sau 3 ngày không có khiếu nại -> Tiền tự động giải ngân thẳng về ví KOC.'
                    ]}
                    tips="Cả hai bên đều được bảo vệ 100%. Nếu có tranh chấp, Sàn sẽ đứng ra làm trọng tài phán quyết công bằng."
                    size="xs"
                  />
                </div>
                <h2 className="text-base sm:text-lg font-black text-white font-display">
                  Tạo Hợp Đồng Booking KOC / AI Video & Khóa Ký Quỹ Sàn
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsContractPreviewOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold font-display flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem Mẫu Hợp Đồng</span>
              </button>

              <button 
                type="button"
                onClick={closeBookingModal} 
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">

            {/* Banner Cam Kết Giá Trị Cho Doanh Nghiệp */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0D111E] to-purple-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[9px] uppercase">
                    KẾT NỐI NGƯỜI THẬT • CHI PHÍ CỰC THẤP
                  </span>
                  <span className="text-white font-bold text-xs font-display">
                    Rẻ Hơn Thị Trường Rất Nhiều — Tiếp Cận Đúng Tệp Khách Hàng
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hệ sinh thái gồm hàng chục ngàn KOC/KOL và người dùng thật có thời gian, kiến thức, đam mê kiếm tiền. Đây chính là khách hàng tiềm năng chuẩn nhất của thương hiệu!
                </p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 shrink-0 bg-black/40 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ký Quỹ Escrow • Bảo Hành 3 Ngày</span>
              </div>
            </div>
            
            {/* 1. Chọn Hình Thức Sáng Tạo: Người Thật vs AI */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <span>1. Chọn Hình Thức Sáng Tạo:</span>
                  <FeatureGuideTooltip 
                    title="KOC Người Thật vs AI Video Creator"
                    description="Phân loại rõ ràng giữa video do KOC người thật đóng hay do trí tuệ nhân tạo (AI) tạo ra để có mức giá sàn thị trường chuẩn xác nhất."
                    steps={[
                      'KOC Người Thật: Cầm sản phẩm trên tay, gương mặt thật, độ tin cậy và chuyển đổi cao nhất.',
                      'AI Video Creator: MC ảo, clone giọng triệu view, bàn giao nhanh trong 2-6h, chi phí tiết kiệm.'
                    ]}
                    size="xs"
                  />
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {creatorType === 'human' ? 'Gương mặt thật • Trải nghiệm thật' : 'AI MC ảo • Bàn giao siêu tốc'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCreatorType('human')}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    creatorType === 'human'
                      ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                      : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${creatorType === 'human' ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs text-white font-display flex items-center gap-1">
                      <span>👤 KOC Người Thật</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">Cao Cấp</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Trải nghiệm trên tay, mặt thật, giọng thật, uy tín cá nhân mạnh mẽ
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCreatorType('ai')}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    creatorType === 'ai'
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${creatorType === 'ai' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs text-white font-display flex items-center gap-1">
                      <span>🤖 AI Video Creator</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Tiết Kiệm</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Kịch bản AI, giọng clone triệu view, MC ảo, giao nhanh 2-6 giờ
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Chọn Lĩnh Vực Sản Phẩm / Ngành Hàng (Ảnh hưởng đến độ khó kịch bản & Giá Sàn) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <span>2. Lĩnh Vực Sản Phẩm / Ngành Hàng (Ảnh Hưởng Giá Sàn Thị Trường):</span>
                </label>
                <span className="text-[10px] text-purple-300 font-mono">
                  Hệ số ngành: x{selectedIndustry.rateMultiplier}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {KOC_INDUSTRY_SECTORS.map((sec) => (
                  <button
                    type="button"
                    key={sec.id}
                    onClick={() => setIndustryId(sec.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      industryId === sec.id
                        ? 'bg-purple-600/25 border-purple-400 text-white shadow-md font-bold'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{sec.icon}</span>
                      <span className="font-bold text-[11px] font-display truncate">{sec.name.split('(')[0]}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono truncate mt-0.5">{sec.description}</div>
                  </button>
                ))}
              </div>

              {/* Ô BỔ SUNG NẾU CHỌN NGÀNH HÀNG KHÁC */}
              {industryId === 'other' && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-purple-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nhập Tên Lĩnh Vực / Ngành Hàng Riêng Của Bạn:</span>
                  </label>
                  <input
                    type="text"
                    value={customIndustryName}
                    onChange={(e) => setCustomIndustryName(e.target.value)}
                    placeholder="VD: Bất Động Sản, Dịch Vụ Nha Khoa, Phần Mềm SaaS, Du Lịch..."
                    className="w-full bg-black/60 border border-purple-500/50 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs font-mono"
                    required
                  />
                  <p className="text-[9px] text-slate-400 font-mono">
                    Hệ thống sẽ cập nhật tên ngành hàng này vào văn bản hợp đồng chính thức để KOC đối soát.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Chọn Thể Loại Sản Phẩm Bàn Giao (Deliverables) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <span>3. Thể Loại Sản Phẩm Bàn Giao:</span>
                  <FeatureGuideTooltip 
                    title="Thể Loại Sản Phẩm Bàn Giao Đa Dạng"
                    description="KOC có thể cung cấp video review, unboxing, brand story, skit kịch, ảnh chụp lookbook, hoặc livestream theo nhu cầu nhãn hàng."
                    steps={[
                      'Video Review: Trải nghiệm thực tế, phân tích công dụng, gắn giỏ hàng TikTok Shop.',
                      'Đánh Giá / Unboxing: Bóc hộp cận cảnh, kiểm tra độ bền, so sánh chất lượng.',
                      'Giới Thiệu Sản Phẩm: Nhận diện thương hiệu, tính năng USP, hình ảnh đẹp.',
                      'Bộ Ảnh & Poster: Cung cấp file ảnh độ nét cao làm banner shop.'
                    ]}
                    size="xs"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KOC_DELIVERABLE_TYPES.map((deliv) => (
                  <button
                    type="button"
                    key={deliv.id}
                    onClick={() => setDeliverableId(deliv.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      deliverableId === deliv.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md font-bold'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[11px] leading-snug font-display flex items-center gap-1 truncate">
                        <span>{deliv.icon}</span>
                        <span className="truncate">{deliv.name}</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5 line-clamp-1">{deliv.description}</div>
                  </button>
                ))}
              </div>

              {/* Ô BỔ SUNG NẾU CHỌN THỂ LOẠI KHÁC */}
              {deliverableId === 'other' && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-emerald-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mô Tả Thể Loại Sản Phẩm Bàn Giao Riêng (Theo Yêu Cầu Doanh Nghiệp):</span>
                  </label>
                  <input
                    type="text"
                    value={customDeliverableName}
                    onChange={(e) => setCustomDeliverableName(e.target.value)}
                    placeholder="VD: Quay chuỗi Series 3 tập lồng ghép, Check-in sự kiện ra mắt, Phỏng vấn đường phố..."
                    className="w-full bg-black/60 border border-emerald-500/50 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-xs font-mono"
                    required
                  />
                  <p className="text-[9px] text-slate-400 font-mono">
                    Thể loại tùy chỉnh sẽ được đưa vào Điều 1 và Phụ lục của hợp đồng.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Chọn Thời Lượng Video Cụ Thể (1, 2, 3, 5, 10 Phút) */}
            {deliverableId !== 'photo_poster' && deliverableId !== 'livestream_session' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <span>4. Thời Lượng Video Tiêu Chuẩn:</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    Giá sàn: {currentFloorPrice.toLocaleString('vi-VN')}đ / video
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(DURATION_FACTORS) as VideoDuration[]).map((dur) => {
                    const item = DURATION_FACTORS[dur];
                    const floorForThis = calculateKocFloorPrice({
                      deliverableId,
                      industryId,
                      duration: dur,
                      creatorType
                    });
                    return (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          duration === dur
                            ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-md'
                            : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs font-display text-white">{item.label}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
                          {floorForThis.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-[8px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. CƠ CHẾ DEAL GIÁ THỎA THUẬN VỚI KOC (QUY ĐỊNH CỨNG: KHÔNG ĐƯỢC DƯỚI GIÁ SÀN) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-black to-[#0D111E] border-2 border-indigo-500/40 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-neonGold" />
                  <div>
                    <label className="font-bold text-white text-xs uppercase font-mono block">
                      5. Thỏa Thuận Giá (Deal Giá Giữa Chủ Doanh Nghiệp & KOC):
                    </label>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Quy tắc sàn: Hai bên có quyền thương lượng giá cao hơn nhưng <strong className="text-rose-400">TUYỆT ĐỐI KHÔNG ĐƯỢC DƯỚI GIÁ SÀN</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Giá Sàn Niêm Yết: {currentFloorPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Deal Price Input & Validation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <label className="text-slate-300 font-mono text-[10px] uppercase font-bold">
                    Đơn Giá Thỏa Thuận Mỗi Video / Sản Phẩm (VNĐ):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={10000}
                      value={dealPrice}
                      onChange={(e) => setDealPrice(parseInt(e.target.value) || 0)}
                      className={`w-full bg-black/60 border rounded-xl px-4 py-2.5 text-white font-mono font-bold text-base focus:outline-none transition-all ${
                        !validation.isValid 
                          ? 'border-rose-500 text-rose-300 focus:border-rose-400' 
                          : 'border-emerald-500 text-emerald-300 focus:border-emerald-400'
                      }`}
                    />
                    <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-mono font-bold">VNĐ</span>
                  </div>
                </div>

                {/* Quick adjustments buttons */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">Deal nhanh với KOC:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setDealPrice(currentFloorPrice)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono border border-white/10"
                    >
                      Bằng Giá Sàn
                    </button>
                    <button
                      type="button"
                      onClick={() => setDealPrice(prev => Math.max(currentFloorPrice, prev + 100000))}
                      className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-bold"
                    >
                      +100,000đ
                    </button>
                    <button
                      type="button"
                      onClick={() => setDealPrice(prev => Math.max(currentFloorPrice, prev + 300000))}
                      className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-[10px] font-mono border border-purple-500/30 font-bold"
                    >
                      +300,000đ
                    </button>
                    <button
                      type="button"
                      onClick={() => setDealPrice(prev => Math.max(currentFloorPrice, prev + 500000))}
                      className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[10px] font-mono border border-rose-500/30 font-bold"
                    >
                      +500,000đ
                    </button>
                  </div>
                </div>
              </div>

              {/* Realtime Alert Banner */}
              {!validation.isValid ? (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[11px] flex items-start gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>LỖI: MỨC GIÁ THẤP HƠN GIÁ SÀN THỊ TRƯỜNG!</strong>
                    <p className="mt-0.5 text-[10px] text-rose-200">
                      Giá sàn tối thiểu cho {selectedIndustry.name} ({durationLabel}) là <strong>{currentFloorPrice.toLocaleString('vi-VN')}đ</strong>. Bạn chỉ có thể thỏa thuận bằng hoặc cao hơn để đảm bảo thu nhập chính đáng cho Creator!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✓ Mức giá deal hợp lệ (≥ Giá sàn niêm yết). Được tự động cập nhật vào hợp đồng điện tử.</span>
                  </div>
                  {dealPrice > currentFloorPrice && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      +{((dealPrice - currentFloorPrice)).toLocaleString('vi-VN')}đ so với sàn
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 6. Số Lượng Video & Chiết Khấu Combo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  6. Số Lượng Video / Buổi Trong Hợp Đồng:
                </label>
                {discountRate > 0 && (
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">
                    🎉 Chiết khấu Combo: Giảm {discountRate * 100}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 10].map((qty) => (
                  <button
                    type="button"
                    key={qty}
                    onClick={() => setVideoQuantity(qty)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all font-mono font-bold text-xs ${
                      videoQuantity === qty
                        ? 'bg-emerald-500 text-black border-emerald-400 shadow-md font-black'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {qty} {deliverableId === 'photo_poster' ? 'Bộ Ảnh' : deliverableId === 'livestream_session' ? 'Phiên Live' : 'Video'}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Tiêu Đề & Tên Sản Phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">7. Tiêu Đề Hợp Đồng</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Booking 3 Video Review Serum B5 Căng Bóng"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-display"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">8. Tên Sản Phẩm / Dịch Vụ Cần Review</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="VD: Serum Dưỡng Ẩm ZenSkin 50ml"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* 8. KOC Handle & Setup Ngày Giờ Bàn Giao Thỏa Thuận Linh Hoạt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                  9. Kênh TikTok KOC / Studio Nhận Đơn (@)
                </label>
                <input
                  type="text"
                  value={kocHandle}
                  onChange={(e) => setKocHandle(e.target.value)}
                  placeholder="@koc_handle hoặc để trống để Sàn chỉ định"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                    10. Thời Hạn & Ngày Giờ Bàn Giao Thỏa Thuận:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomDays(!isCustomDays)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline font-bold"
                  >
                    {isCustomDays ? '← Chọn gói gợi ý' : '+ Tùy chỉnh số ngày'}
                  </button>
                </div>

                {!isCustomDays ? (
                  <select
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value={2} className="bg-slate-900">Hỏa Tốc: 2 Ngày (Kể từ ngày nhận mẫu)</option>
                    <option value={3} className="bg-slate-900">Nhanh: 3 Ngày (Kể từ ngày nhận mẫu)</option>
                    <option value={5} className="bg-slate-900">Tiêu Chuẩn: 5 Ngày (Kể từ ngày nhận mẫu)</option>
                    <option value={7} className="bg-slate-900">Chuyên Nghiệp: 7 Ngày</option>
                    <option value={10} className="bg-slate-900">Kịch Bản Phức Tạp: 10 Ngày</option>
                    <option value={14} className="bg-slate-900">Gói Tháng / Dài Hạn: 14 Ngày</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={deadlineDays}
                      onChange={(e) => setDeadlineDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-black/40 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                      placeholder="Nhập số ngày thỏa thuận..."
                    />
                    <span className="text-xs font-mono text-cyan-300 shrink-0 font-bold">Ngày kể từ khi nhận mẫu</span>
                  </div>
                )}
                <div className="text-[10px] text-amber-400 font-mono font-bold pt-0.5">
                  ✓ Dự kiến bàn giao: {formattedDeadline}
                </div>
              </div>
            </div>

            {/* 9. Yêu Cầu Kịch Bản & Gắn Giỏ Hàng */}
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">11. Yêu Cầu Kịch Bản Tiêu Chuẩn & Gắn Giỏ Hàng / Link Bio</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* 10. BỔ SUNG THÔNG TIN ĐỐI TÁC & PHỤ LỤC HỢP ĐỒNG RIÊNG THEO THỎA THUẬN 2 BÊN */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-[#0D111E] border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-indigo-300 font-display flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>12. Bổ Sung Thông Tin & Phụ Lục Hợp Đồng Riêng (Tùy Chỉnh Theo Từng Khách Hàng)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Phụ Lục 01 Pháp Lý
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Các điều khoản mẫu của Sàn được giữ nguyên để bảo vệ an toàn. Bạn có thể bổ sung thêm các thỏa thuận riêng, địa chỉ và thông tin liên lạc đối soát dưới đây:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 text-[10px] uppercase font-bold">Số Điện Thoại / Zalo Đối Soát Khẩn Cấp:</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="VD: 0912.345.678 (Chủ Shop / Quản lý)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 text-[10px] uppercase font-bold">Địa Chỉ Gửi Sản Phẩm Mẫu (Từ Bên Thuê):</label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="VD: Kho hàng ZenSkin, Số 88 Cầu Giấy, Hà Nội"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-300 text-[10px] uppercase font-bold">
                  Địa Chỉ KOC Nhận Hàng Mẫu / Trả Hàng (Nếu đã trao đổi trước):
                </label>
                <input
                  type="text"
                  value={sampleReturnAddress}
                  onChange={(e) => setSampleReturnAddress(e.target.value)}
                  placeholder="VD: Chung cư Vinhome Central Park, P.22, Bình Thạnh, TP.HCM (hoặc KOC cập nhật sau khi nhận kèo)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-300 text-[10px] uppercase font-bold">
                  Yêu Cầu Riêng Về Kịch Bản, Trang Phục, Góc Máy &amp; Bàn Giao:
                </label>
                <textarea
                  rows={2}
                  value={customDeliveryNotes}
                  onChange={(e) => setCustomDeliveryNotes(e.target.value)}
                  placeholder="VD: KOC mặc áo sáng màu, quay cận cảnh chất kem mỏng nhẹ, bắt buộc có cảnh test nước tẩy trang, không chèn nhạc quá to..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-300 text-[10px] uppercase font-bold">
                  Điều Khoản Bổ Sung Khác Do 2 Bên Thống Nhất (Tự Động Đưa Vào Phụ Lục 01):
                </label>
                <textarea
                  rows={2}
                  value={customAnnexTerms}
                  onChange={(e) => setCustomAnnexTerms(e.target.value)}
                  placeholder="VD: Bên B cam kết giữ video trên kênh tối thiểu 60 ngày. Bên A được phép dùng video làm tư liệu chạy Livestream TikTok Shop..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                />
              </div>
            </div>

            {/* Quy Định Gửi Mẫu & Trả Video (Chuẩn TikTok Creator Marketplace Pro) */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 font-display flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Quy Trình Gửi Mẫu & Bàn Giao Video (Được Khóa Trong Điều 3 Hợp Đồng)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  Bảo Vệ Đôi Bên
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <strong className="text-white block">📦 Bên Thuê (Brand):</strong>
                  <p className="text-[10px] text-slate-400">
                    Gửi mẫu nguyên seal miễn phí trong <strong>48 giờ</strong> sau khi ký hợp đồng, cập nhật mã vận đơn lên Sàn. Mốc deadline tính từ khi KOC nhận hàng.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <strong className="text-white block">🎬 KOC / Creator:</strong>
                  <p className="text-[10px] text-slate-400">
                    Bàn giao bản demo duyệt trước deadline 24-48h. Kích hoạt <strong>3 ngày (72h) bảo hành</strong>, sửa tối đa 2 lần miễn phí theo brief.
                  </p>
                </div>
              </div>
            </div>

            {/* Điều Khoản Chống Đi Đêm */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-display">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ĐIỀU KHOẢN CHỐNG GIAO DỊCH NGOÀI SÀN (ANTI-BYPASS)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                100% thanh toán và đối soát phải qua Két Escrow Sàn. Mọi hành vi giao dịch ngầm ngoài sàn sẽ bị hủy bảo hiểm rủi ro tài chính và khóa vĩnh viễn tài khoản.
              </p>
            </div>

            {/* Financial Summary & Action */}
            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-slate-400 text-xs">Tổng Tiền Ký Quỹ Escrow Khóa An Toàn 100%:</div>
                <div className="text-2xl font-black text-neonGold font-mono font-mono-numbers mt-0.5">
                  {totalEscrowAmount}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Đơn giá deal: <strong className="text-white">{pricePerVideo}</strong> / sản phẩm • {selectedIndustry.name}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono">
                  <span className="text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                    💵 KOC Thực Nhận (80%): {(Math.round(rawTotal * 0.8)).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30 font-semibold">
                    🛡️ Phí Sàn Ký Quỹ & Bảo Chứng (20%): {(Math.round(rawTotal * 0.2)).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsContractPreviewOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Dự Thảo Hợp Đồng</span>
                </button>

                {!hasEnoughCoins ? (
                  <button
                    type="button"
                    onClick={() => { closeBookingModal(); openDeposit(); }}
                    className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md font-display text-center"
                  >
                    Nạp Thêm Xu VietQR
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!validation.isValid}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all font-display flex items-center justify-center gap-2 ${
                      validation.isValid
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white shadow-emerald-600/30 cursor-pointer'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/10'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Khóa Ký Quỹ & Ký Hợp Đồng</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Contract Preview Modal */}
      <EscrowContractModal
        contract={previewContractObj as any}
        isOpen={isContractPreviewOpen}
        onClose={() => setIsContractPreviewOpen(false)}
        isDraftPreview={true}
      />
    </>
  );
};
