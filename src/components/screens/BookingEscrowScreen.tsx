import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Video, 
  ExternalLink, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  ShieldAlert,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck,
  FileText,
  BadgeCheck,
  Building2,
  Tv,
  Bot,
  User,
  Timer,
  MessageSquare,
  Send,
  X,
  Paperclip,
  MessageCircle,
  Info,
  Star,
  Camera,
  Award,
  Flame,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Share2,
  Handshake,
  Target,
  Briefcase,
  Zap
} from 'lucide-react';
import { EscrowStatus, BookingCategory, EscrowBookingContract, VideoCreatorType } from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { VERIFIED_KOC_PROFILES, KocProfile, KOC_INDUSTRY_CATEGORIES, KOC_PENALTY_TIERS } from '../../data/kocProfileData';
import { EscrowContractModal } from '../modals/EscrowContractModal';
import { ContractCompletionTimeline } from '../common/ContractCompletionTimeline';
import { EscrowExtensionModal } from '../modals/EscrowExtensionModal';
import { EscrowReviewModal } from '../modals/EscrowReviewModal';
import { EscrowIncidentModal } from '../modals/EscrowIncidentModal';
import { EscrowChatModal } from '../modals/EscrowChatModal';

interface ChatMessage {
  id: string;
  sender: 'client' | 'koc' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

const INITIAL_CONTRACT_CHATS: Record<string, ChatMessage[]> = {
  'default': [
    {
      id: 'm1',
      sender: 'system',
      senderName: 'Sàn AVA FOLLOW Escrow',
      text: '🛡️ Hệ thống Ký Quỹ Escrow đã kích hoạt hợp đồng và khóa an toàn 100% tiền cọc. Bên Thuê và KOC có thể tự do trao đổi brief, kịch bản, địa chỉ gửi mẫu và tiến độ tại đây.',
      timestamp: 'Hôm nay lúc 09:15'
    },
    {
      id: 'm2',
      sender: 'client',
      senderName: 'Bên Thuê (Brand)',
      text: 'Chào bạn, bên mình đã gửi brief sản phẩm và mong muốn video tập trung vào chất liệu và giỏ hàng nhé! Bạn check và báo thời gian dự kiến lên demo nha.',
      timestamp: 'Hôm nay lúc 09:20'
    },
    {
      id: 'm3',
      sender: 'koc',
      senderName: 'KOC / Studio Sáng Tạo',
      text: 'Dạ em chào shop! Em đã xem kỹ brief rồi ạ. Shop gửi mẫu về giúp em nhé. Dự kiến chiều mai em bấm máy và nộp link video demo cho shop duyệt trong 72h!',
      timestamp: 'Hôm nay lúc 09:35'
    }
  ]
};

export const BookingEscrowScreen: React.FC = () => {
  const { 
    escrowBookings, 
    openBookingModal, 
    openSubmitDemoModal, 
    acceptEscrowBooking, 
    approveEscrowDisburse, 
    disputeEscrow,
    user,
    requestContractExtension,
    respondToContractExtension,
    approveEscrowWithReview,
    freezeEscrowContract,
    requestVideoRevision,
    requestRefundEscrow,
    showToast
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'koc_directory' | 'all' | 'available_jobs' | 'my_bookings' | 'koc_value_pillars'>('koc_directory');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [creatorFilter, setCreatorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);

  const handleCopyContractLink = (contract: EscrowBookingContract) => {
    const url = `https://avalive.vn/escrow/${contract.contractCode}`;
    navigator.clipboard.writeText(url);
    setCopiedContractId(contract.id);
    showToast(`Đã sao chép link hợp đồng ${contract.contractCode}: ${url}`);
    setTimeout(() => setCopiedContractId(null), 2500);
  };

  // KOC Directory States
  const [selectedKocForModal, setSelectedKocForModal] = useState<KocProfile | null>(null);
  const [kocCategoryFilter, setKocCategoryFilter] = useState<string>('all');
  const [showPolicyDetails, setShowPolicyDetails] = useState<boolean>(true);

  // Contract Direct Communication Chat States
  const [chattingContract, setChattingContract] = useState<EscrowBookingContract | null>(null);
  const [viewingContractForModal, setViewingContractForModal] = useState<EscrowBookingContract | null>(null);
  const [extensionModalContract, setExtensionModalContract] = useState<EscrowBookingContract | null>(null);
  const [extensionModalMode, setExtensionModalMode] = useState<'request' | 'respond'>('request');
  const [reviewModalContract, setReviewModalContract] = useState<EscrowBookingContract | null>(null);
  const [incidentModalContract, setIncidentModalContract] = useState<EscrowBookingContract | null>(null);

  const sampleMasterContract: EscrowBookingContract = {
    id: 'master_sample',
    contractCode: 'ESC-2026-CHUN-PHAP-LY',
    clientName: 'Thương Hiệu ZenSkin Việt Nam (Bên Thuê)',
    clientAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120',
    kocName: 'Đặng Mai Phương (Phương Beauty KOC)',
    kocHandle: '@phuongbeauty_koc',
    kocAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
    title: 'Hợp Đồng Booking KOC Sáng Tạo Video Review Sản Phẩm & Ký Quỹ Escrow 3 Bên',
    category: 'review',
    creatorType: 'human',
    videoDuration: '3_min',
    videoQuantity: 3,
    totalEscrowAmount: '4,500,000đ',
    pricePerVideo: '1,500,000đ',
    productName: 'Serum B5 Hyaluronic Acid Căng Bóng Da 50ml',
    requirements: 'Quay video trải nghiệm thực tế trên da mặt, phân tích thành phần B5, gắn giỏ hàng TikTok Shop và cấp mã Spark Ads 30 ngày.',
    deadlineDays: 5,
    warrantyDays: 3,
    autoReleaseHoursLeft: 72,
    industrySector: 'Mỹ Phẩm & Chăm Sóc Da (Skincare)',
    deliverableType: 'Video Review Trải Nghiệm Thực Tế (Gắn Giỏ Hàng)',
    floorUnitPrice: 1500000,
    agreedUnitPrice: 1500000,
    deliveryDeadlineDate: '18:00 ngày 18/09/2026 (5 ngày kể từ ngày nhận mẫu nguyên seal)',
    status: 'in_progress',
    createdAt: '12/09/2026'
  };

  const filteredBookings = escrowBookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
    if (creatorFilter !== 'all' && b.creatorType !== creatorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchClient = b.clientName.toLowerCase().includes(q);
      const matchKoc = b.kocName.toLowerCase().includes(q) || b.kocHandle.toLowerCase().includes(q);
      const matchCode = b.contractCode.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchKoc && !matchCode) return false;
    }
    if (activeTab === 'available_jobs') {
      return b.status === 'escrow_locked';
    }
    if (activeTab === 'my_bookings') {
      return b.kocHandle === user.tiktokConnected || b.clientName === user.name;
    }
    return true;
  });

  const displayedKocs = VERIFIED_KOC_PROFILES.filter(koc => {
    // Lọc theo định dạng sản xuất
    if (kocCategoryFilter === 'real_human' && !koc.capabilities.realHumanVideo.available) return false;
    if (kocCategoryFilter === 'ai_video' && !koc.capabilities.aiVideo.available) return false;
    if (kocCategoryFilter === 'photo' && !koc.capabilities.photoGraphic.available) return false;

    // Lọc theo thứ tự lĩnh vực (Industry Category)
    if (kocCategoryFilter === 'beauty' && !koc.category.toLowerCase().includes('mỹ phẩm') && !koc.category.toLowerCase().includes('làm đẹp')) return false;
    if (kocCategoryFilter === 'fashion' && !koc.category.toLowerCase().includes('thời trang') && !koc.category.toLowerCase().includes('phụ kiện')) return false;
    if (kocCategoryFilter === 'tech' && !koc.category.toLowerCase().includes('công nghệ') && !koc.category.toLowerCase().includes('điện tử')) return false;
    if (kocCategoryFilter === 'food' && !koc.category.toLowerCase().includes('ẩm thực') && !koc.category.toLowerCase().includes('nhà hàng') && !koc.category.toLowerCase().includes('ăn')) return false;
    if (kocCategoryFilter === 'baby' && !koc.category.toLowerCase().includes('mẹ') && !koc.category.toLowerCase().includes('bé')) return false;
    if (kocCategoryFilter === 'health' && !koc.category.toLowerCase().includes('sức khỏe') && !koc.category.toLowerCase().includes('gym') && !koc.category.toLowerCase().includes('thể thao')) return false;
    if (kocCategoryFilter === 'ai_studio' && !koc.category.toLowerCase().includes('ai')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        koc.name.toLowerCase().includes(q) ||
        koc.handle.toLowerCase().includes(q) ||
        koc.category.toLowerCase().includes(q) ||
        koc.bio.toLowerCase().includes(q)
      );
    }
    return true;
  });


  const getStatusBadge = (status: EscrowStatus, hoursLeft?: number) => {
    switch (status) {
      case 'escrow_locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
            <Lock className="w-3 h-3" /> Đã Ký Quỹ Sàn (Chờ KOC Nhận)
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
            <Clock className="w-3 h-3 animate-spin" /> Đang Sản Xuất Video
          </span>
        );
      case 'demo_submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/40 font-mono animate-pulse">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Bảo Hành Nghiệm Thu 3 Ngày (Còn {hoursLeft || 72}h)
          </span>
        );
      case 'disbursed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            <CheckCircle2 className="w-3 h-3" /> Đã Giải Ngân Cho KOC
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
            <ShieldAlert className="w-3 h-3" /> Đang Tranh Chấp (Admin Trọng Tài)
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30 font-mono">
            Đã Hoàn Tiền Brand
          </span>
        );
      default:
        return null;
    }
  };

  const getDurationLabel = (dur?: string) => {
    switch (dur) {
      case '1_min': return '1 Phút';
      case '2_min': return '2 Phút';
      case '3_min': return '3 Phút';
      case '5_min': return '5 Phút';
      case '10_min': return '10 Phút';
      default: return '3 Phút';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Banner with Escrow Smart Vault Explainer & 3-Day Warranty */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>KẾT NỐI KOC & CHỦ DOANH NGHIỆP • KÝ QUỸ ESCROW 3 BÊN • BẢO HÀNH 3 NGÀY</span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Chi Phí Tiết Kiệm Hơn Thị Trường Rất Nhiều</span>
            </span>

            <FeatureGuideTooltip 
              title="Cơ Chế Kết Nối Người Thật & Sàn Ký Quỹ Escrow"
              description="Nền tảng kết nối trực tiếp chủ doanh nghiệp với hàng chục ngàn KOC/KOL và người dùng thật có đam mê kiếm tiền, thời gian và kinh nghiệm. Chi phí tối ưu rẻ hơn thị trường rất nhiều nhờ loại bỏ mọi khâu trung gian và nền tảng quảng cáo đắt đỏ."
              steps={[
                'Bước 1: Doanh nghiệp nạp ký quỹ và tạo hợp đồng (tiền được khóa an toàn 100% trong két Sàn).',
                'Bước 2: KOC uy tín đã xác minh CCCD nhận hợp đồng và sản xuất video/ảnh theo đúng brief.',
                'Bước 3: KOC nộp video demo lên Sàn -> Kích hoạt thời hạn Bảo Hành 3 Ngày (72 giờ).',
                'Bước 4: Doanh nghiệp kiểm tra video. Sau 3 ngày nếu không khiếu nại, tiền tự động giải ngân cho KOC.'
              ]}
              tips="Bảo đảm an toàn tuyệt đối cho cả 2 bên. 100% người thật tương tác, không lo bùng kèo hay quỵt tiền!"
              badge="Minh Bạch 100%"
              size="sm"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug font-display">
            Kết Nối KOC &amp; Doanh Nghiệp Review Sản Phẩm Siêu Chuyên Nghiệp <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Chi Phí Thấp Hơn Thị Trường Rất Nhiều — Tiếp Cận Đúng Tệp Khách Hàng Thật
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Nơi hội tụ <strong>hàng ngàn KOC/KOL tài năng</strong> và <strong>người dùng thật có cùng đam mê kiếm tiền</strong>, có thời gian, kiến thức và kinh nghiệm thực chiến. Doanh nghiệp tiếp cận đúng tệp khách hàng tiềm năng sẵn có trong hệ sinh thái mà <strong>không cần đốt tiền vào quảng cáo ngoài đắt đỏ kém hiệu quả</strong>.
          </p>

          {/* 3 Value Pillars Mini-Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display">Tệp Khách Hàng Thật Sẵn Có</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">Người trong nền tảng chính là khách hàng tiềm năng, tương tác thật &amp; mua hàng thật.</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display">Chi Phí Cực Thấp &amp; Rẻ Hơn Nhiều</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">Tiết kiệm 70-80% so với chạy ads thụ động và agency trung gian đắt đỏ bên ngoài.</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display">Ký Quỹ Escrow An Toàn Tuyệt Đối</div>
                <div className="text-[10px] text-slate-400 leading-snug mt-0.5">Bảo hành 3 ngày nghiệm thu, chống bùng kèo, hợp đồng chuẩn pháp lý bảo vệ cả 2 bên.</div>
              </div>
            </div>
          </div>

          {/* 4-Step Process Bar with 3-Day Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-purple-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 font-display">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[10px] font-mono">1</span>
                Doanh Nghiệp Ký Quỹ
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Khóa tiền cọc 100% trong két Sàn, chọn KOC người thật hoặc AI Studio.</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-indigo-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 font-display">
                <span className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] font-mono">2</span>
                Nhận Mẫu &amp; Bấm Máy
              </div>
              <p className="text-[11px] text-slate-400 mt-1">KOC an tâm quay vì tiền đã được sàn bảo chứng, không lo bùng cọc.</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-pink-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-300 font-display">
                <span className="w-5 h-5 rounded-full bg-pink-500/30 flex items-center justify-center text-[10px] font-mono">3</span>
                Nộp Demo &amp; Bảo Hành 3 Ngày
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Doanh nghiệp có 72 giờ đối soát kịch bản, âm thanh và gắn giỏ hàng.</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-emerald-800/40">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 font-display">
                <span className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] font-mono">4</span>
                Tự Động Giải Ngân
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Hết 3 ngày không khiếu nại &rarr; Tiền chuyển thẳng về ví KOC.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 font-display cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo Hợp Đồng Booking Ký Quỹ Ngay</span>
            </button>

            <button
              onClick={() => setViewingContractForModal(sampleMasterContract)}
              className="px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold font-display flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>📄 Mẫu Hợp Đồng KOC &amp; Escrow Chuẩn Pháp Lý (10 Điều Khoản)</span>
            </button>

            <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảo hành 3 ngày (72 giờ) trước khi giải quyết thanh toán</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('koc_directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 font-display shrink-0 ${
                activeTab === 'koc_directory' 
                  ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Hồ Sơ Năng Lực KOC ({VERIFIED_KOC_PROFILES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('koc_value_pillars')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 font-display shrink-0 ${
                activeTab === 'koc_value_pillars' 
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Handshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Giá Trị Cho Doanh Nghiệp</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                HOT
              </span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-display shrink-0 ${
                activeTab === 'all' 
                  ? 'bg-purple-600 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Tất Cả ({escrowBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('available_jobs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 font-display shrink-0 ${
                activeTab === 'available_jobs' 
                  ? 'bg-purple-600 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kèo Chờ KOC ({escrowBookings.filter(b => b.status === 'escrow_locked').length})</span>
            </button>
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-display shrink-0 ${
                activeTab === 'my_bookings' 
                  ? 'bg-purple-600 text-white shadow-md font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Hợp Đồng Của Tôi</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Tổng tiền ký quỹ hiện tại:</span>
            <span className="font-bold font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono-numbers">
              {escrowBookings
                .filter(b => b.status === 'pending_escrow' || b.status === 'escrow_locked' || b.status === 'demo_submitted')
                .reduce((sum, b) => sum + (parseInt(b.totalEscrowAmount.replace(/\D/g, ''), 10) || 0), 0)
                .toLocaleString()}đ
            </span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã hợp đồng, tên Brand, KOC, tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Creator Type Filter */}
          <div>
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-display"
            >
              <option value="all">Hình thức: Tất cả (Người & AI)</option>
              <option value="human">👤 KOC Người Thật</option>
              <option value="ai">🤖 AI Video Creator</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-display"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="escrow_locked">Đã Ký Quỹ (Chờ nhận)</option>
              <option value="in_progress">Đang Sản Xuất</option>
              <option value="demo_submitted">Bảo Hành Nghiệm Thu (3 Ngày)</option>
              <option value="disbursed">Đã Giải Ngân</option>
              <option value="disputed">Đang Tranh Chấp</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-display"
            >
              <option value="all">Hạng mục: Tất cả</option>
              <option value="review">Review Trải Nghiệm Sản Phẩm</option>
              <option value="normal_video">Video Sáng Tạo Thông Thường</option>
              <option value="viral_drama">Skit / Tiểu Phẩm Hài Viral</option>
              <option value="ugc_ads">Video UGC Chạy Spark Ads</option>
              <option value="checkin">Check-in Địa Điểm Thực Tế</option>
              <option value="livestream_cohost">Livestream Co-host Cùng Shop</option>
              <option value="ai_multilingual">Video AI Đa Ngôn Ngữ Global</option>
              <option value="bio_link">Gắn Bio Link / Affiliate</option>
            </select>
          </div>

        </div>
      </div>

      {/* Dynamic Tab Views: KOC Directory vs Contracts List */}
      {activeTab === 'koc_directory' ? (
        <div className="space-y-6">
          {/* Top Info Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border border-rose-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>DANH BẠ KOC / REVIEWER & STUDIO VIDEO AI ĐƯỢC KIỂM CHỨNG</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-2">
                  Hồ Sơ Năng Lực Sáng Tạo, Kinh Nghiệm Review & Báo Giá Niêm Yết
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  100% KOC và Studio sáng tạo đã hoàn thành xác minh CCCD, được kiểm chứng năng lực làm ảnh, video người thật và video AI. Toàn bộ tiền cọc được giữ an toàn trong két Sàn Smart Escrow — bảo hành nghiệm thu 3 ngày đảm bảo <strong>đôi bên cùng có lợi</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openBookingModal()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-black text-xs shadow-xl shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-display shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tạo Yêu Cầu Booking Mới</span>
                </button>
              </div>
            </div>

            {/* DANH SÁCH THEO THỨ TỰ LĨNH VỰC CHO ĐỐI TÁC THUÊ KOC DỄ DÀNG LỰA CHỌN */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-purple-400" />
                  <span>Lĩnh Vực Ngành Hàng (Xếp Theo Thứ Tự Ưu Tiên Thị Trường):</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Hiển thị {displayedKocs.length} KOC phù hợp
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {KOC_INDUSTRY_CATEGORIES.map((cat) => {
                  const isActive = kocCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setKocCategoryFilter(cat.id)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 aspect-auto ${
                        isActive
                          ? 'bg-gradient-to-b from-purple-600 to-indigo-700 text-white border-purple-400 shadow-lg shadow-purple-600/30 scale-102 ring-2 ring-purple-400/40'
                          : 'bg-[#0A0E1A] hover:bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[11px] font-bold leading-tight line-clamp-1">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lọc nhanh theo định dạng sản xuất */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Định dạng:</span>
                <button
                  onClick={() => setKocCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    kocCategoryFilter === 'all' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Tất Cả ({VERIFIED_KOC_PROFILES.length})</span>
                </button>
                <button
                  onClick={() => setKocCategoryFilter('real_human')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    kocCategoryFilter === 'real_human' 
                      ? 'bg-rose-600 text-white shadow-md' 
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <User className="w-3 h-3 text-rose-400" />
                  <span>Người Thật 100%</span>
                </button>
                <button
                  onClick={() => setKocCategoryFilter('ai_video')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    kocCategoryFilter === 'ai_video' 
                      ? 'bg-cyan-600 text-white shadow-md' 
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>Avatar AI Siêu Thực</span>
                </button>
                <button
                  onClick={() => setKocCategoryFilter('photo')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    kocCategoryFilter === 'photo' 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>Chụp Ảnh & Poster</span>
                </button>
              </div>
            </div>
          </div>

          {/* KOC Profiles Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-rose-400" />
              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Danh Sách Hồ Sơ Năng Lực KOC & Reviewer ({displayedKocs.length})
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                Xác Minh CCCD 100%
              </span>
            </div>
            {kocCategoryFilter !== 'all' && (
              <button
                onClick={() => setKocCategoryFilter('all')}
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer font-mono"
              >
                <span>✕ Xóa bộ lọc (Xem tất cả {VERIFIED_KOC_PROFILES.length} KOC)</span>
              </button>
            )}
          </div>

          {/* KOC Profiles Grid (EMPTY STATE or LIST) */}
          {displayedKocs.length === 0 ? (
            <div className="p-10 text-center bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Không tìm thấy KOC nào phù hợp với bộ lọc</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Hiện tại chưa có KOC thuộc danh mục hoặc từ khóa bạn đang tìm kiếm. Vui lòng bấm nút bên dưới để xem lại toàn bộ {VERIFIED_KOC_PROFILES.length} hồ sơ KOC.
                </p>
              </div>
              <button
                onClick={() => { setKocCategoryFilter('all'); setSearchQuery(''); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-display cursor-pointer inline-flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Xem Tất Cả {VERIFIED_KOC_PROFILES.length} KOC Đã Kiểm Chứng</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedKocs.map((koc) => (
                <div 
                  key={koc.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 space-y-5 shadow-xl flex flex-col justify-between transition-all touch-zoom-card group relative"
                >
                  <div className="space-y-4">
                    {/* Avatar & Header */}
                    <div className="flex items-start gap-3.5">
                      <div 
                        onClick={() => setSelectedKocForModal(koc)}
                        className="relative shrink-0 cursor-pointer group/avatar"
                        title="Nhấn để xem chi tiết hồ sơ & video demo"
                      >
                        <img 
                          src={koc.avatar} 
                          alt={koc.name} 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg group-hover/avatar:scale-105 transition-transform" 
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-md" title="Đã Xác Minh KYC">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 
                            onClick={() => setSelectedKocForModal(koc)}
                            className="text-base font-black text-white truncate font-display group-hover:text-purple-300 transition-colors cursor-pointer hover:underline"
                            title="Nhấn để xem chi tiết"
                          >
                            {koc.name}
                          </h3>
                        </div>
                        <a
                          href={`https://www.tiktok.com/@${koc.handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-pink-400 font-mono mt-0.5 hover:underline transition-colors"
                          title="Mở kênh TikTok chính thức"
                        >
                          <span>{koc.handle}</span>
                          <ExternalLink className="w-3 h-3 text-purple-400/70" />
                        </a>
                        
                        {/* Verification Badge */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold mt-1.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>ĐÃ KIỂM CHỨNG CCCD 100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust & Performance Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Đánh Giá</div>
                        <div className="text-xs font-black text-amber-400 font-mono flex items-center justify-center gap-0.5 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{koc.rating}</span>
                          <span className="text-[9px] text-slate-500">({koc.totalReviews})</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Đã Quay</div>
                        <div className="text-xs font-black text-white font-mono mt-0.5">
                          {koc.completedJobs}+ video
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Tín Nhiệm</div>
                        <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                          {koc.reputationScore}/100
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {koc.bio}
                    </p>

                    {/* Creative Capabilities Badges */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                        Năng Lực Sản Xuất:
                      </span>
                      <div className="space-y-1.5 text-xs">
                        {/* Real Human Video */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <User className="w-3.5 h-3.5 text-rose-400" />
                            <span>Video Người Thật 100%</span>
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            koc.capabilities.realHumanVideo.available 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {koc.capabilities.realHumanVideo.available ? '4K Studio' : 'Không'}
                          </span>
                        </div>

                        {/* AI Video */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Bot className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Video AI Siêu Thực</span>
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            koc.capabilities.aiVideo.available 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                              : 'bg-slate-800 text-slate-500'
                          }`}>
                            {koc.capabilities.aiVideo.available ? 'Voice Clone' : 'Không'}
                          </span>
                        </div>

                        {/* Photo / Poster */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Camera className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ảnh & Poster Sản Phẩm</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Cover 9:16
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Public Pricing Snippet */}
                    <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-800/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Báo giá sàn niêm yết:</span>
                        <span className="text-amber-400 font-mono font-bold">Từ {koc.pricingTiers?.[0]?.priceVnd || 'Liên hệ'} / 1p</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                        <span>Gói 2p: {koc.pricingTiers?.[1]?.priceVnd || 'Liên hệ'}</span>
                        <span>•</span>
                        <span>Gói 3p: {koc.pricingTiers?.[2]?.priceVnd || 'Liên hệ'}</span>
                      </div>
                    </div>

                    {/* Đánh Giá Review Chi Tiết Gần Nhất Từ Nhãn Hàng */}
                    {koc.reviews.length > 0 && (
                      <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>Review Gần Nhất Từ Shop:</span>
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">{koc.reviews[0].date}</span>
                        </div>
                        <div className="text-[11px] font-bold text-white flex items-center gap-1 truncate">
                          <span>🏢 {koc.reviews[0].brand}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            Hợp đồng {koc.reviews[0].contractCode}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 italic line-clamp-2 leading-relaxed">
                          "{koc.reviews[0].comment}"
                        </p>
                      </div>
                    )}

                    {/* Win-Win Guarantee Alert */}
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2 font-display">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Smart Escrow: Nghiệm thu 3 ngày mới giải ngân</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedKocForModal(koc)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 font-display cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Hồ Sơ & Review ({koc.reviews.length})</span>
                    </button>
                    <button
                      onClick={() => openBookingModal()}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 font-display cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Thuê Ngay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHÍNH SÁCH BẢO VỆ 2 BÊN & KHUNG CHẾ TÀI 4 CẤP ĐỘ (COLLAPSIBLE SECTION) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0D111E] to-slate-900 border border-purple-500/30 space-y-4 shadow-2xl">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowPolicyDetails(!showPolicyDetails)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black font-mono uppercase tracking-wider">
                      CHÍNH SÁCH AN TOÀN TUYỆT ĐỐI
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      Bảo Hiểm Smart Escrow 100% • Chống Bùng Hàng & Quỵt Tiền
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-1 font-display">
                    Chính Sách Bảo Mật Hợp Đồng & Khung Chế Tài Xử Phạt 4 Cấp Độ (Anti-Bypass Escrow)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Mọi thỏa thuận booking bắt buộc thực hiện qua Sàn. Nghiêm cấm "đi đêm" ngoài sàn. Sàn bảo lãnh 100% tài chính và sản phẩm mẫu.
                  </p>
                </div>
              </div>

              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0">
                {showPolicyDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showPolicyDetails && (
              <div className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                {/* Quy trình gửi mẫu & trả video review 4 bước */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-[10px]">1</span>
                      <span>Ký Quỹ Tiền Vào Sàn</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Brand ký quỹ 100% tiền cọc vào két Escrow sàn trước khi KOC nhận việc.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                      <span>Gửi Sản Phẩm Mẫu</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Brand gửi sản phẩm mẫu miễn phí đến KOC trong 48h kèm mã vận đơn đối soát.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-[10px]">3</span>
                      <span>Sản Xuất Video Review</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      KOC nhận mẫu, quay dựng video trong 3-5 ngày theo brief, gửi bản nháp duyệt.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px]">4</span>
                      <span>Đăng Video & Giải Ngân</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      KOC đăng TikTok gắn giỏ hàng. Sau 72h đối soát lượt xem, Sàn giải ngân cho KOC.
                    </p>
                  </div>
                </div>

                {/* 4-Tier Penalty Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {KOC_PENALTY_TIERS.map((tier) => (
                    <div 
                      key={tier.level}
                      className={`p-4 rounded-2xl border space-y-2.5 flex flex-col justify-between transition-all ${
                        tier.level === 4 
                          ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/40' 
                          : tier.level === 3 
                          ? 'bg-rose-950/30 border-rose-500/40' 
                          : tier.level === 2 
                          ? 'bg-orange-950/20 border-orange-500/30' 
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border font-mono ${tier.badgeColor}`}>
                            {tier.severity.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            CẤP {tier.level}
                          </span>
                        </div>

                        <h5 className="text-xs font-black text-white leading-tight font-display">
                          {tier.title}
                        </h5>

                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[10px]">
                          <span className="text-slate-400 block font-semibold">Hành vi vi phạm:</span>
                          <p className="text-slate-200 leading-normal">{tier.violationDescription}</p>
                        </div>

                        <div className="space-y-1.5 text-[10px] font-mono">
                          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-0.5">
                            <strong className="text-rose-300 block">💸 Chế tài tài chính:</strong>
                            <span>{tier.financialPenalty}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 space-y-0.5">
                            <strong className="text-amber-300 block">⚡ Xử lý tài khoản:</strong>
                            <span>{tier.accountConsequence}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 text-[9px] text-slate-400 italic">
                        Hội Đồng Trọng Tài Sàn phân xử tự động trong 24h.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'koc_value_pillars' ? (
        /* TAB: GIÁ TRỊ CỐT LÕI CHO DOANH NGHIỆP & CHỦ THƯƠNG HIỆU */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  <Handshake className="w-4 h-4 text-emerald-400" />
                  <span>KẾT NỐI NGƯỜI THẬT • CHI PHÍ CỰC THẤP • HIỆU QUẢ VƯỢT TRỘI</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white font-display">
                  Tại Sao Doanh Nghiệp Uy Tín Chọn AVA FOLLOW Thay Vì Chạy Quảng Cáo Đắt Đỏ?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Trong nền tảng AVA FOLLOW, <strong>100% là những con người thật</strong>: họ có thời gian, kiến thức, kinh nghiệm và cùng chung niềm đam mê kiếm tiền. Đây chính là <strong>tệp khách hàng tiềm năng chuẩn xác nhất</strong> của mọi doanh nghiệp — vừa là người tiêu dùng thực tế, vừa là người review lan tỏa thương hiệu với chi phí tối ưu nhất thị trường.
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => openBookingModal()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs font-display uppercase tracking-wider shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tạo Hợp Đồng Booking Ngay</span>
                </button>
                <span className="text-[10px] text-center font-mono text-emerald-400">Tiết kiệm 70% - 80% so với thị trường</span>
              </div>
            </div>
          </div>

          {/* 4 Trụ Cột Giá Trị Độc Bản Cho Doanh Nghiệp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cột 1 */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 hover:border-emerald-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">LỢI THẾ SỐ 1</span>
                <h3 className="text-base font-black text-white font-display mt-0.5">
                  100% Khách Hàng Tiềm Năng Thật — Đúng Tệp Mong Muốn
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khác biệt hoàn toàn với các nền tảng chứa bot ảo hay view rác, cộng đồng AVA FOLLOW gồm hàng trăm ngàn thành viên thực tế. Họ online mỗi ngày, xem video, tương tác và có nhu cầu mua sắm tiêu dùng thật. Doanh nghiệp kết nối trực tiếp với chính khách hàng của mình mà không cần đoán mò thuật toán.
              </p>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Người thật dùng thử sản phẩm &amp; để lại đánh giá chân thực</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Tỷ lệ chuyển đổi mua hàng cao gấp 4 - 6 lần quảng cáo thụ động</span>
                </div>
              </div>
            </div>

            {/* Cột 2 */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 hover:border-amber-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">LỢI THẾ SỐ 2</span>
                <h3 className="text-base font-black text-white font-display mt-0.5">
                  Chi Phí Cực Kỳ Thấp — Rẻ Hơn Thị Trường Rất Nhiều
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cắt bỏ hoàn toàn các tầng đại lý trung gian, phí môi giới booking đắt đỏ và chi phí quảng cáo đấu thầu (bidding) ngày càng leo thang. Mức giá niêm yết minh bạch từ giá sàn gốc giúp doanh nghiệp vừa và nhỏ (SME) hoặc nhãn hàng lớn đều tối ưu hóa ngân sách tối đa.
              </p>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Chỉ từ 160.000đ - 600.000đ cho 1 video review chuẩn chỉn chu</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Ưu đãi giảm giá combo 5% - 15% khi đặt theo chuỗi chiến dịch</span>
                </div>
              </div>
            </div>

            {/* Cột 3 */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 hover:border-purple-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider">LỢI THẾ SỐ 3</span>
                <h3 className="text-base font-black text-white font-display mt-0.5">
                  An Toàn Tuyệt Đối &amp; Minh Bạch Với Hợp Đồng Smart Escrow
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Không lo tình trạng "chuyển khoản cọc xong KOC mất tích" hay sản phẩm mẫu bị thất thoát. Tiền cọc được khóa an toàn trong két Sàn. Thời hạn bảo hành nghiệm thu 3 ngày (72 giờ) cho phép doanh nghiệp duyệt video kỹ càng trước khi tiền được chuyển đi.
              </p>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hợp đồng điện tử 10 điều khoản chuẩn hóa pháp lý bảo vệ cả 2 bên</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Khung chế tài 4 cấp độ nghiêm trị hành vi bùng kèo, quỵt hàng</span>
                </div>
              </div>
            </div>

            {/* Cột 4 */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 hover:border-cyan-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">LỢI THẾ SỐ 4</span>
                <h3 className="text-base font-black text-white font-display mt-0.5">
                  Mạng Lưới Hàng Ngàn KOC / KOL Đa Lĩnh Vực Đã KYC
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hội tụ đầy đủ KOC thuộc mọi ngành hàng: Mỹ phẩm, Thời trang, Công nghệ, Gia dụng, Ẩm thực, Mẹ &amp; Bé, Sức khỏe... Tất cả đều đã xác minh CCCD, có số liệu kênh thực tế, tỷ lệ giao hàng đúng hạn 100% và review công khai từ các nhãn hàng đi trước.
              </p>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Lựa chọn linh hoạt: KOC Người Thật 4K hoặc Video AI Avatar siêu tốc</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Trao đổi brief, kịch bản trực tiếp 1-1 không qua trung gian</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng so sánh trực quan: AVA FOLLOW vs Booking Ngoài / Chạy Ads Ngoài */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Bảng So Sánh Hiệu Quả: Nền Tảng AVA FOLLOW vs Chạy Ads &amp; Booking Ngoài
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                Tối Ưu 100% Cho Doanh Nghiệp
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="text-left py-3 px-3">Tiêu Chí Đánh Giá</th>
                    <th className="text-left py-3 px-3 text-emerald-400 bg-emerald-500/10 rounded-t-xl font-bold">
                      ⭐ Nền Tảng AVA FOLLOW Pro
                    </th>
                    <th className="text-left py-3 px-3 text-slate-400">Booking Tự Do Ngoài Sàn</th>
                    <th className="text-left py-3 px-3 text-slate-400">Chạy Quảng Cáo Ads Đấu Thầu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-semibold font-display">Chi phí thực tế</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-500/5">
                      ✓ Cực thấp, niêm yết giá sàn, không đội phí
                    </td>
                    <td className="py-3 px-3 text-slate-400">Đắt đỏ, hét giá vô tội vạ, qua nhiều cò</td>
                    <td className="py-3 px-3 text-slate-400">Đốt tiền liên tục, CPM tăng cao theo giờ</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-semibold font-display">Bản chất người tiếp cận</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-500/5">
                      ✓ 100% người thật, có nhu cầu kiếm tiền &amp; mua sắm
                    </td>
                    <td className="py-3 px-3 text-slate-400">Dễ dính view ảo, fan ảo, khó kiểm chứng</td>
                    <td className="py-3 px-3 text-slate-400">Click tặc, bot xem lướt qua không chuyển đổi</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-semibold font-display">Mức độ an toàn tài chính</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-500/5">
                      ✓ Két Smart Escrow giữ tiền, bảo hành 3 ngày
                    </td>
                    <td className="py-3 px-3 text-rose-400">Rủi ro cao bị bùng cọc, ôm mẫu chạy mất</td>
                    <td className="py-3 px-3 text-slate-400">Trừ tiền tự động dù không ra đơn</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-semibold font-display">Tính pháp lý &amp; Trọng tài</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-500/5">
                      ✓ Hợp đồng điện tử 10 điều khoản + Phân xử 24h
                    </td>
                    <td className="py-3 px-3 text-slate-400">Thỏa thuận miệng qua tin nhắn, không ai bảo vệ</td>
                    <td className="py-3 px-3 text-slate-400">Kháng nghị tài khoản tự động, không người hỗ trợ</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white font-semibold font-display">Tạo dựng thương hiệu dài lâu</td>
                    <td className="py-3 px-3 text-emerald-300 font-bold bg-emerald-500/5">
                      ✓ Video tồn tại vĩnh viễn, gắn giỏ hàng ra đơn đều
                    </td>
                    <td className="py-3 px-3 text-slate-400">KOC có thể tự ý ẩn video sau vài tuần</td>
                    <td className="py-3 px-3 text-slate-400">Hết tiền nạp là tắt quảng cáo, mất hết lượt hiển thị</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <span className="text-xs text-slate-400">
                Sẵn sàng nâng tầm thương hiệu và tối ưu chi phí ngay hôm nay?
              </span>
              <button
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer font-display"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Bắt Đầu Kết Nối KOC Cho Doanh Nghiệp</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Contracts List */
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-display">Không tìm thấy hợp đồng booking nào</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Thử thay đổi bộ lọc tìm kiếm hoặc tạo ngay một yêu cầu booking ký quỹ mới cho chiến dịch TikTok của bạn.
            </p>
            <button
              onClick={() => openBookingModal()}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white inline-flex items-center gap-2 font-display"
            >
              <PlusCircle className="w-4 h-4" /> Tạo Hợp Đồng Mới
            </button>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="p-5 bg-slate-900/90 border border-slate-800 hover:border-purple-800/50 rounded-2xl shadow-xl transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {booking.contractCode}
                  </span>

                  {/* Creator Type Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border font-display ${
                    booking.creatorType === 'ai'
                      ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}>
                    {booking.creatorType === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span>{booking.creatorType === 'ai' ? 'AI Creator' : 'KOC Người Thật'}</span>
                  </span>

                  {/* Duration Badge */}
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    <span>{getDurationLabel(booking.videoDuration)}</span>
                  </span>

                  {/* Industry & Deliverable Badges */}
                  {booking.industrySector && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {booking.industrySector}
                    </span>
                  )}

                  {booking.deliverableType && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {booking.deliverableType}
                    </span>
                  )}

                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {booking.productName}
                  </span>

                  <span className="text-xs text-slate-400">
                    {booking.createdAt}
                  </span>
                </div>

                <div>
                  {getStatusBadge(booking.status, booking.autoReleaseHoursLeft)}
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Contract Info */}
                <div className="lg:col-span-2 space-y-2">
                  <h3 className="text-base font-bold text-white font-display">{booking.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Yêu cầu nội dung:</strong> {booking.requirements}
                  </p>

                  {/* THANH THÔNG BÁO THỜI GIAN HOÀN THÀNH CHO TỪNG HỢP ĐỒNG */}
                  <ContractCompletionTimeline 
                    contract={booking} 
                    onOpenExtensionModal={(c) => {
                      setExtensionModalContract(c);
                      setExtensionModalMode(c.extensionStatus === 'pending' ? 'respond' : 'request');
                    }}
                    onOpenIncidentModal={(c) => setIncidentModalContract(c)}
                  />

                  {/* 3-Day Warranty Alert Banner when demo submitted */}
                  {booking.status === 'demo_submitted' && (
                    <div className="p-3.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/40 rounded-xl space-y-2 mt-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-display">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Giai Đoạn Bảo Hành & Nghiệm Thu 3 Ngày (72 Giờ)
                        </span>
                        {booking.autoReleaseHoursLeft && (
                          <span className="text-xs text-amber-300 flex items-center gap-1 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                            Tự động giải ngân sau: {booking.autoReleaseHoursLeft} giờ
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-300 leading-snug">
                        Bên Thuê có 3 ngày đối soát video demo. Nếu không yêu cầu sửa đổi hoặc khiếu nại, Sàn sẽ tự động chuyển <strong>{booking.totalEscrowAmount}</strong> vào ví của KOC.
                      </div>

                      {booking.demoVideoUrl && (
                        <div className="pt-1.5 border-t border-purple-800/30">
                          <a 
                            href={booking.demoVideoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 font-mono truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span>Link Video Demo: {booking.demoVideoUrl}</span>
                          </a>
                          {booking.demoNote && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">
                              "{booking.demoNote}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission details if not in demo_submitted but has demo URL */}
                  {booking.status !== 'demo_submitted' && booking.demoVideoUrl && (
                    <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-display">
                          <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                          Link Sản Phẩm Hoàn Tất:
                        </span>
                      </div>
                      <a 
                        href={booking.demoVideoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1 font-mono truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {booking.demoVideoUrl}
                      </a>
                    </div>
                  )}

                  {/* Dispute Banner if disputed */}
                  {booking.status === 'disputed' && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-400 font-display">
                        <AlertTriangle className="w-4 h-4" />
                        Khiếu nại đang được Hội đồng Trọng tài Sàn xử lý
                      </div>
                      <p className="text-[11px] text-rose-200/90">
                        Lý do: {booking.disputeReason || 'Bất đồng về chất lượng kịch bản và tiến độ đăng tải.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Parties & Escrow Amount Details */}
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    
                    {/* Brand */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" /> Bên Thuê:
                      </span>
                      <span className="text-white font-semibold font-display">{booking.clientName}</span>
                    </div>

                    {/* KOC */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> KOC / Studio:
                      </span>
                      <span className="text-emerald-400 font-semibold font-mono">
                        {booking.kocName} ({booking.kocHandle})
                      </span>
                    </div>

                    {/* Bundle Info */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/40">
                      <span className="text-slate-400">Gói số lượng:</span>
                      <span className="text-white font-bold">{booking.videoQuantity} Video</span>
                    </div>

                    {/* Escrow Locked Value */}
                    <div className="pt-2 border-t border-slate-700/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Tiền Ký Quỹ Sàn Giữ:</span>
                        <span className="text-base font-black text-amber-400 font-mono font-mono-numbers">
                          {booking.totalEscrowAmount}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-mono">
                        ({booking.pricePerVideo}/video)
                      </div>

                      {/* 80% KOC / 20% Platform Fee breakdown */}
                      {(() => {
                        const raw = parseInt(booking.totalEscrowAmount.replace(/\D/g, ''), 10) || 0;
                        const kocAmount = Math.round(raw * 0.8);
                        const platformFee = Math.round(raw * 0.2);
                        return (
                          <div className="mt-2 p-2 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[10px] font-mono">
                            <div className="flex items-center justify-between text-emerald-300 font-semibold">
                              <span>💵 KOC Thực Nhận (80%):</span>
                              <span className="font-mono-numbers">{kocAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex items-center justify-between text-purple-300">
                              <span>🛡️ Phí Sàn Ký Quỹ (20%):</span>
                              <span className="font-mono-numbers">{platformFee.toLocaleString('vi-VN')}đ</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Actions based on Status */}
                  <div className="pt-2 space-y-2">
                    
                    {/* View Full Legal Contract Button + Quick Share Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => setViewingContractForModal(booking)}
                        className="w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-display cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>Xem File Hợp Đồng</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold">
                          Chuẩn Pháp Lý
                        </span>
                      </button>

                      <button
                        onClick={() => handleCopyContractLink(booking)}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-display cursor-pointer ${
                          copiedContractId === booking.id
                            ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                            : 'bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 hover:text-white border-indigo-500/30'
                        }`}
                      >
                        {copiedContractId === booking.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Đã Copy Link HĐ!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-indigo-400" />
                            <span>Sao Chép Link HĐ</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct 2-Way Chat Button (Brand ↔ KOC) */}
                    <button
                      onClick={() => setChattingContract(booking)}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>Trao Đổi Với Đối Tác (Bên Thuê ↔ KOC)</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                        Trực tiếp
                      </span>
                    </button>

                    {/* Case 1: Open job waiting for KOC */}
                    {booking.status === 'escrow_locked' && (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => acceptEscrowBooking(booking.id)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all font-display cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Tôi Nhận Kèo Booking Này</span>
                        </button>
                        <div className="text-[10px] text-slate-400 text-center">
                          Tiền {booking.totalEscrowAmount} đã được khóa trong Smart Vault Sàn.
                        </div>
                      </div>
                    )}

                    {/* Case 2: In progress -> KOC submits demo or requests extension */}
                    {booking.status === 'in_progress' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => openSubmitDemoModal(booking)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 flex items-center justify-center gap-1.5 transition-all font-display cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Nộp Link Video Demo Duyệt (Kích Hoạt 3 Ngày Bảo Hành)</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          {booking.extensionStatus === 'pending' ? (
                            <button
                              onClick={() => {
                                setExtensionModalContract(booking);
                                setExtensionModalMode('respond');
                              }}
                              className="w-full py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer font-display animate-pulse"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Phản Hồi Gia Hạn</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setExtensionModalContract(booking);
                                setExtensionModalMode('request');
                              }}
                              className="w-full py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-amber-950/40 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer font-display"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Xin Gia Hạn Tiến Độ</span>
                            </button>
                          )}

                          <button
                            onClick={() => setIncidentModalContract(booking)}
                            className="w-full py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer font-display"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Sự Cố &amp; Niêm Phong</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Case 3: Submitted Demo -> Brand approves disbursement or dispute */}
                    {booking.status === 'demo_submitted' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => setReviewModalContract(booking)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all font-display cursor-pointer"
                        >
                          <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                          <span>Duyệt Nghiệm Thu &amp; Đánh Giá KOC (80%)</span>
                        </button>
                        
                        <button
                          onClick={() => setIncidentModalContract(booking)}
                          className="w-full py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer font-display"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Xử Lý Sự Cố / Yêu Cầu Sửa Đổi / Hoàn Cọc</span>
                        </button>
                      </div>
                    )}

                    {/* Case 4: Disbursed */}
                    {booking.status === 'disbursed' && (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5 font-display">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã chuyển {booking.totalEscrowAmount} vào ví KOC
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRỰC TIẾP TRAO ĐỔI KỊCH BẢN & KẾT NỐI ĐỐI TÁC (LƯU VĨNH VIỄN)     */}
      {/* ========================================================================= */}
      <EscrowChatModal
        contract={chattingContract}
        isOpen={!!chattingContract}
        onClose={() => setChattingContract(null)}
        onOpenExtensionModal={(c) => {
          setExtensionModalContract(c);
          setExtensionModalMode('request');
        }}
        onOpenIncidentModal={(c) => setIncidentModalContract(c)}
      />

      {/* ========================================================================= */}
      {/* MODAL: ĐỀ XUẤT XIN GIA HẠN / ĐỒNG THUẬN GIA HẠN THỜI GIAN BÀN GIAO       */}
      {/* ========================================================================= */}
      <EscrowExtensionModal
        contract={extensionModalContract}
        isOpen={!!extensionModalContract}
        onClose={() => setExtensionModalContract(null)}
        mode={extensionModalMode}
        onRequestExtension={requestContractExtension}
        onRespondExtension={respondToContractExtension}
      />

      {/* ========================================================================= */}
      {/* MODAL: BÊN THUÊ DUYỆT NGHIỆM THU & ĐÁNH GIÁ 1-5 SAO (GIẢI NGÂN 80% KOC)  */}
      {/* ========================================================================= */}
      <EscrowReviewModal
        contract={reviewModalContract}
        isOpen={!!reviewModalContract}
        onClose={() => setReviewModalContract(null)}
        onConfirmReview={approveEscrowWithReview}
      />

      {/* ========================================================================= */}
      {/* MODAL: TRUNG TÂM XỬ LÝ SỰ CỐ & NIÊM PHONG / YÊU CẦU SỬA / HOÀN CỌC 100% */}
      {/* ========================================================================= */}
      <EscrowIncidentModal
        contract={incidentModalContract}
        isOpen={!!incidentModalContract}
        onClose={() => setIncidentModalContract(null)}
        onRequestRevision={requestVideoRevision}
        onFreezeVault={freezeEscrowContract}
        onRequestRefund={requestRefundEscrow}
        onOpenExtension={(c) => {
          setExtensionModalContract(c);
          setExtensionModalMode('request');
        }}
      />

      {/* ========================================================================= */}
      {/* MODAL: XEM HỒ SƠ NĂNG LỰC KOC & VIDEO REVIEW MẪU CHI TIẾT                */}
      {/* ========================================================================= */}
      {selectedKocForModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedKocForModal(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-black flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <img 
                  src={selectedKocForModal.avatar} 
                  alt={selectedKocForModal.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl shrink-0" 
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white font-display">
                      {selectedKocForModal.name}
                    </h2>
                    <a
                      href={`https://www.tiktok.com/@${selectedKocForModal.handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-purple-400 hover:text-pink-400 hover:underline transition-colors"
                      title="Mở kênh TikTok chính thức"
                    >
                      <span>{selectedKocForModal.handle}</span>
                      <ExternalLink className="w-3 h-3 text-purple-400/70" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Đã Xác Minh KYC CCCD & Bản Quyền Nội Dung</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {selectedKocForModal.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {selectedKocForModal.bio}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedKocForModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* 4 Stats Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-400 font-mono">Đánh Giá Uy Tín</div>
                  <div className="text-sm font-black text-amber-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedKocForModal.rating}/5.0</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{selectedKocForModal.totalReviews} lượt đánh giá</div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-400 font-mono">Video Đã Hoàn Thành</div>
                  <div className="text-sm font-black text-white font-mono mt-0.5">
                    {selectedKocForModal.completedJobs}+ Video
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">{selectedKocForModal.onTimeDeliveryRate}</div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-400 font-mono">Kinh Nghiệm</div>
                  <div className="text-xs font-black text-purple-300 font-mono mt-1">
                    {selectedKocForModal.experienceYears}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] text-slate-400 font-mono">Tín Nhiệm Escrow</div>
                  <div className="text-sm font-black text-neonGold font-mono mt-0.5">
                    {selectedKocForModal.reputationScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-400">0 Lần Khiếu Nại</div>
                </div>
              </div>

              {/* Detailed Capabilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  Năng Lực Sản Xuất Chi Tiết (Ảnh & Video)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Real Human Video */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-display">
                        <User className="w-4 h-4 text-rose-400" />
                        {selectedKocForModal.capabilities.realHumanVideo.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        selectedKocForModal.capabilities.realHumanVideo.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {selectedKocForModal.capabilities.realHumanVideo.available ? 'Sẵn Sàng' : 'Không'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedKocForModal.capabilities.realHumanVideo.desc}
                    </p>
                    {selectedKocForModal.capabilities.realHumanVideo.specs.length > 0 && (
                      <ul className="space-y-1 pt-1 border-t border-white/5">
                        {selectedKocForModal.capabilities.realHumanVideo.specs.map((s, i) => (
                          <li key={i} className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-rose-400" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* AI Video */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-display">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        {selectedKocForModal.capabilities.aiVideo.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        selectedKocForModal.capabilities.aiVideo.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {selectedKocForModal.capabilities.aiVideo.available ? 'Sẵn Sàng' : 'Không'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedKocForModal.capabilities.aiVideo.desc}
                    </p>
                    {selectedKocForModal.capabilities.aiVideo.specs.length > 0 && (
                      <ul className="space-y-1 pt-1 border-t border-white/5">
                        {selectedKocForModal.capabilities.aiVideo.specs.map((s, i) => (
                          <li key={i} className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Tiers Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-neonGold" />
                  Bảng Báo Giá Niêm Yết Theo Thời Lượng (Ký Quỹ Escrow)
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Thời Lượng</th>
                        <th className="p-3">Giá Niêm Yết</th>
                        <th className="p-3">Huy Hiệu</th>
                        <th className="p-3">Mô Tả Gói</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {selectedKocForModal.pricingTiers.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold font-mono text-white">{tier.duration}</td>
                          <td className="p-3 font-bold font-mono text-amber-400">{tier.priceVnd}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                              {tier.badge}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] text-slate-400">{tier.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portfolio Showcase Videos */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  Video Mẫu Đã Lên Xu Hướng Triệu View
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedKocForModal.portfolioVideos.map((vid) => (
                    <div key={vid.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                      <img 
                        src={vid.thumbnail} 
                        alt={vid.title} 
                        className="w-20 h-24 rounded-xl object-cover shrink-0" 
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{vid.title}</div>
                        <div className="text-[10px] text-purple-300 font-mono">{vid.category}</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-2">
                          <span>{vid.views}</span>
                          <span>•</span>
                          <span>{vid.likes}</span>
                        </div>
                        <a 
                          href={vid.videoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono pt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem Video Thật</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Đánh Giá Thực Tế Từ Khách Thuê ({selectedKocForModal.reviews.length})
                </h4>

                <div className="space-y-2">
                  {selectedKocForModal.reviews.map((rev, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.brand}</span>
                          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                            {rev.contractCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: rev.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-2 font-display">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cam Kết Đôi Bên Cùng Có Lợi (Win - Win Escrow Guarantee):</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedKocForModal.escrowGuarantees.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KOC Penalty & Dispute Commitment */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-indigo-950/40 border border-rose-500/40 space-y-2">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-2 font-display">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Cam Kết Chế Tài Xử Phạt 4 Cấp Độ & Bảo Hộ Toàn Diện:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  KOC <strong>{selectedKocForModal.name}</strong> đã ký kết văn bản tuân thủ <strong>Khung Chế Tài 4 Cấp Độ</strong> của Sàn. Trường hợp video sơ sài, bùng kèo giao hàng mẫu hoặc cố tình giao dịch "đi đêm" ngoài sàn: Sàn cam kết đền bù 100% chi phí cho Bên Thuê, phong tỏa ví Xu và khóa tài khoản vi phạm vĩnh viễn.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedKocForModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>

              <button
                onClick={() => {
                  setSelectedKocForModal(null);
                  openBookingModal();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-purple-900/40 flex items-center gap-2 transition-all font-display cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>TẠO HỢP ĐỒNG KÝ QUỸ VỚI {selectedKocForModal.name.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Contract Modal Viewer */}
      <EscrowContractModal
        contract={viewingContractForModal}
        isOpen={!!viewingContractForModal}
        onClose={() => setViewingContractForModal(null)}
        onSignContract={(id) => {
          acceptEscrowBooking(id);
          if (viewingContractForModal && viewingContractForModal.id === id) {
            setViewingContractForModal(prev => prev ? { 
              ...prev, 
              status: 'in_progress', 
              kocSignedAt: new Date().toLocaleDateString('vi-VN') 
            } : null);
          }
        }}
        currentRole={user?.role === 'admin' ? 'admin' : (user?.role === 'kol' ? 'koc' : 'client')}
      />

    </div>
  );
};
