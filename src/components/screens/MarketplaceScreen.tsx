import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Clock, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Filter,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Zap,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Radio,
  Layers,
  Award,
  PlusCircle,
  Headphones,
  TrendingUp,
  Play
} from 'lucide-react';
import { GrowthServiceItem } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { OrderServiceModal } from '../modals/OrderServiceModal';
import { KocRegistrationModal } from '../modals/KocRegistrationModal';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';

interface MarketplaceScreenProps {
  darkMode: boolean;
  onOrderService?: (service: GrowthServiceItem) => void;
  onNavigate?: (screen: any) => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  darkMode,
  onNavigate
}) => {
  const { 
    growthServices, 
    user, 
    openOrderModal, 
    openKocModal, 
    isOrderModalOpen, 
    selectedPackageForOrder, 
    closeOrderModal,
    isKocModalOpen,
    closeKocModal
  } = useTikTokApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_1m' | '1m_3m' | '3m_7m' | '7m_10m'>('all');

  const CATEGORIES = [
    { id: 'all', label: `Tất Cả Gói (${growthServices.length})`, icon: Sparkles },
    { id: 'livestream', label: `Mắt Xem Live (${growthServices.filter(s => s.category === 'livestream').length})`, icon: Radio },
    { id: 'combo', label: `Combo Kết Hợp (${growthServices.filter(s => s.category === 'combo' || s.category === 'full_channel').length})`, icon: Layers },
    { id: 'follow', label: `Tăng Follower Thật (${growthServices.filter(s => s.category === 'follow').length})`, icon: Users },
    { id: 'watch', label: `Xem Video 15s FYP (${growthServices.filter(s => s.category === 'watch').length})`, icon: Play },
    { id: 'engagement', label: `Thả Tim FYP (${growthServices.filter(s => s.category === 'engagement').length})`, icon: Heart },
    { id: 'comment', label: `Seeding Bình Luận (${growthServices.filter(s => s.category === 'comment').length})`, icon: MessageSquare },
    { id: 'share', label: `Chia Sẻ & Lan Tỏa (${growthServices.filter(s => s.category === 'share').length})`, icon: Share2 }
  ];

  const filtered = growthServices.filter((srv) => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'combo') {
        if (srv.category !== 'combo' && srv.category !== 'full_channel') return false;
      } else if (srv.category !== activeCategory) {
        return false;
      }
    }
    if (priceFilter === 'under_1m' && srv.priceNum > 1000000) return false;
    if (priceFilter === '1m_3m' && (srv.priceNum <= 1000000 || srv.priceNum > 3000000)) return false;
    if (priceFilter === '3m_7m' && (srv.priceNum <= 3000000 || srv.priceNum > 7000000)) return false;
    if (priceFilter === '7m_10m' && (srv.priceNum <= 7000000 || srv.priceNum > 10000000)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return srv.title.toLowerCase().includes(q) || srv.description.toLowerCase().includes(q) || srv.tag.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BỘ SIÊU PHẨM 24 GÓI TĂNG TRƯỞNG & XÂY KÊNH CHUẨN THUẬT TOÁN TIKTOK</span>
              </div>
              <FeatureGuideTooltip
                title="Cơ Chế Trả Gói Tự Động 24 Siêu Phẩm"
                description="Hệ thống phân phối gói đặt mua trực tiếp thành các nhiệm vụ vi mô cho hơn 154,200+ user thật thực hiện, bảo đảm kênh an toàn tuyệt đối và lên xu hướng tự nhiên."
                steps={[
                  "Bước 1: Chọn gói tăng trưởng phù hợp (Follower ngách, Tim FYP, Comment seeding, Mắt xem live, Combo)",
                  "Bước 2: Dán link TikTok kênh hoặc video cần đẩy tương tác",
                  "Bước 3: Xác nhận số lượng và trừ số dư Xu trong ví",
                  "Bước 4: Hệ thống tự động chia nhỏ và đẩy nhiệm vụ lên bảng tin Tasks cho người dùng thật click tương tác",
                  "Bước 5: Kiểm tra tiến độ hoàn thành theo thời gian thực và nhận bảo hành chống tụt 30 ngày"
                ]}
                tips="Nên đặt gói Combo kèm Mắt xem live vào khung giờ vàng (11h-13h hoặc 19h-22h) để thuật toán TikTok phân phối mạnh nhất vào trang FYP Dành Cho Bạn."
                badge="Thuật Toán TikTok 2026"
                placement="bottom"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Kho Dịch Vụ Tăng Tương Tác Người Thật & Trả Gói Tự Động
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mọi gói bạn đặt mua sẽ được hệ thống tự động đẩy sang hàng đợi cho hơn <strong>154,200+ người dùng</strong> đang lướt video trên ứng dụng thực hiện. Minh bạch, an toàn tuyệt đối cho kênh và có bảo hành chống tụt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={openKocModal}
                className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Đăng Ký Làm KOC Nhận Booking</span>
              </button>
              <FeatureGuideTooltip
                title="Chương Trình KOC Affiliate & Booking"
                description="Dành cho các nhà sáng tạo nội dung có từ 1,000 follower trở lên muốn nhận các hợp đồng review sản phẩm, gắn giỏ hàng TikTok Shop và nhận tiền hoa hồng cao."
                steps={[
                  "Bước 1: Bấm 'Đăng Ký Làm KOC Nhận Booking' và điền thông tin kênh TikTok",
                  "Bước 2: Hệ thống xét duyệt hồ sơ và gắn huy hiệu KOC Verified",
                  "Bước 3: Nhận các job booking từ Brand với hợp đồng ký quỹ Escrow bảo đảm tiền",
                  "Bước 4: Nộp video demo, nhận đánh giá trong vòng 3 ngày bảo hành và rút tiền về tài khoản ngân hàng"
                ]}
                tips="KOC có tỉ lệ hoàn thành nhiệm vụ và rating trên 4.8 sao sẽ được ưu tiên nhận các hợp đồng booking VIP giá từ 2,000,000đ - 10,000,000đ."
                badge="Thu Nhập KOC"
                placement="left"
              />
            </div>
            <div className="text-[11px] text-slate-400 text-center font-mono">
              Số dư ví: <strong className="text-amber-400">{user.avaliveCoins.toLocaleString()} Xu</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Store Benefits (Di chuyển ra ngoài trang bán hàng & bảo hành 15-30 ngày) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">154,200+ Người Dùng Thật</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nhiệm vụ được chia nhỏ và phân phối cho người dùng lướt TikTok thật, 0% bot giả lập, an toàn tuyệt đối cho kênh.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Bảo Hành Chống Tụt 15-30 Ngày</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hệ thống tự động theo dõi số lượng tương tác. Nếu có hiện tượng tụt giảm, hệ thống tự động bù lại đủ 100%.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Cố Vấn Kỹ Thuật 1-1</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Đội ngũ chuyên gia TikTok Pro đồng hành trực tiếp, tư vấn khung giờ vàng đăng bài và chiến lược chốt đơn giỏ hàng.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Kích Hoạt Thuật Toán FYP</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Cơ chế Drip-feed nhịp độ tự nhiên giúp tài khoản TikTok nhận điểm tín nhiệm cao, dễ dàng được đẩy vào tab Dành Cho Bạn.
          </p>
        </div>
      </div>

      {/* Category Nav Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
        <FeatureGuideTooltip
          title="Hệ Thống Gói Mắt Live & Combo Tăng Trưởng Toàn Năng"
          description="Kho dịch vụ tăng trưởng TikTok chuẩn thuật toán 2026, cung cấp đầy đủ các gói Mắt Xem Live và Combo Kết Hợp từ mức khởi nghiệp 499,000đ đến mức doanh nghiệp kim cương 10,000,000đ."
          steps={[
            "Mắt Xem Live (7 gói từ 499k - 10M): Giữ 400 đến 10,000 mắt thật suốt 90p - 6 tiếng, bù mắt tự động 15s.",
            "Combo Kết Hợp (7 gói từ 499k - 10M): Tích hợp Mắt Live + Follower thật + Tap Tim + Comment Seeding + Share.",
            "Tăng Follower Thật (4 gói): Mở khóa Livestream (1k follow) và TikTok Shop Affiliate.",
            "Thả Tim FYP & Comment Seeding (8 gói): Kích nổ thuật toán FYP và điều phối giỏ hàng chuyển đổi cao.",
            "Chiết khấu Token: Thanh toán bằng Token được giảm ngay 10% trên mọi gói dịch vụ."
          ]}
          tips="Gói Combo 499k rất phù hợp cho shop mới mở bán; còn các phiên Mega Live ngày đôi nên dùng Combo từ 1,990,000đ đến 10,000,000đ để chiếm Top 1 Trending."
          badge="Kho Gói 499K - 10M"
          placement="left"
        />
      </div>

      {/* Price Range Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 font-bold uppercase">
          Mức Giá:
        </span>
        {[
          { id: 'all', label: 'Tất Cả Mức Giá' },
          { id: 'under_1m', label: 'Dưới 1 Triệu (499K - 999K)' },
          { id: '1m_3m', label: '1 - 3 Triệu (Flash Sale)' },
          { id: '3m_7m', label: '3 - 7 Triệu (Chiến Thần Live)' },
          { id: '7m_10m', label: '7 - 10 Triệu (Diamond VIP)' }
        ].map((p) => {
          const isSelected = priceFilter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPriceFilter(p.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/20 text-neonGold border border-amber-500/50 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Grid of 24 Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl hover:-translate-y-1 duration-200"
          >
            <div>
              {/* Thumbnail banner */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={srv.thumbnail}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                    {srv.badge || srv.tag}
                  </span>
                  <FeatureGuideTooltip
                    title={`Chi Tiết: ${srv.title}`}
                    description={srv.description}
                    steps={[
                      `Giá niêm yết: ${srv.price} / ${srv.unit}`,
                      `Cam kết tiến độ: Chạy đến khi đạt đủ 100% chỉ tiêu`,
                      `Bảo hành chống tụt: 30 ngày đền bù 100%`,
                      `100% người dùng thật trong mạng lưới phân phối`
                    ]}
                    tips="Sàn không cam kết thời gian hoàn thành cố định mà cam kết phân phối liên tục đến khi đạt đủ 100% số lượng. Bạn có thể theo dõi thanh tiến độ trong mục Báo Cáo hoặc Bảng Tin."
                    badge={srv.category.toUpperCase()}
                    placement="left"
                  />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {srv.rating} ({srv.reviewCount})
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Đạt đủ 100% chỉ tiêu
                  </span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {srv.title}
                </h3>
                
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                  {srv.features.slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Order Action */}
            <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 space-y-3">
              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <span className="text-base font-black text-amber-400 font-mono">{srv.price}</span>
                  {srv.originalPrice && (
                    <span className="text-[10px] text-slate-500 line-through ml-2 font-mono">{srv.originalPrice}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">/ {srv.unit}</span>
              </div>

              <button
                onClick={() => openOrderModal(srv)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Kích Hoạt Gói Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Order Service Modal */}
      <OrderServiceModal
        packageItem={selectedPackageForOrder}
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        onNavigate={onNavigate}
      />

      {/* KOC Registration Modal */}
      <KocRegistrationModal
        isOpen={isKocModalOpen}
        onClose={closeKocModal}
      />

    </div>
  );
};
