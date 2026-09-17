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
  Play,
  Facebook,
  Tv,
  Music,
  Globe
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

  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'tiktok' | 'facebook' | 'youtube'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_1m' | '1m_3m' | '3m_7m' | '7m_10m'>('all');

  const PLATFORMS = [
    { id: 'all', label: 'TẤT CẢ NỀN TẢNG', icon: Globe, count: growthServices.length, color: 'from-amber-500 to-rose-500', desc: 'Đầy đủ giải pháp Viral đa kênh' },
    { id: 'tiktok', label: 'TIKTOK VIRAL', icon: Music, count: growthServices.filter(s => (s.platform || 'tiktok') === 'tiktok').length, color: 'from-rose-600 to-pink-600', desc: 'Mở Shop, Bật Live, Kéo FYP 2026' },
    { id: 'facebook', label: 'FACEBOOK PRO', icon: Facebook, count: growthServices.filter(s => s.platform === 'facebook').length, color: 'from-blue-600 to-indigo-600', desc: 'Fanpage Chuẩn SEO, Reels, Seeding' },
    { id: 'youtube', label: 'YOUTUBE PARTNER', icon: Tv, count: growthServices.filter(s => s.platform === 'youtube').length, color: 'from-red-600 to-rose-700', desc: '1k Sub, 4000h Xem Bật Kiếm Tiền' }
  ];

  const platformFiltered = (growthServices || []).filter(srv => {
    if (selectedPlatform === 'all') return true;
    const plat = srv.platform || 'tiktok';
    return plat === selectedPlatform;
  });

  const CATEGORIES = [
    { id: 'all', label: `Tất Cả Hạng Mục (${platformFiltered.length})`, icon: Sparkles },
    { id: 'follow', label: `Follow / Sub (${platformFiltered.filter(s => s.category === 'follow').length})`, icon: Users },
    { id: 'watch', label: `Xem Giữ Chân (${platformFiltered.filter(s => s.category === 'watch').length})`, icon: Play },
    { id: 'livestream', label: `Mắt Live (${platformFiltered.filter(s => s.category === 'livestream').length})`, icon: Radio },
    { id: 'combo', label: `Combo Bùng Nổ (${platformFiltered.filter(s => s.category === 'combo' || s.category === 'full_channel').length})`, icon: Layers },
    { id: 'engagement', label: `Thả Tim / Like (${platformFiltered.filter(s => s.category === 'engagement').length})`, icon: Heart },
    { id: 'comment', label: `Seeding Bình Luận (${platformFiltered.filter(s => s.category === 'comment').length})`, icon: MessageSquare },
    { id: 'share', label: `Chia Sẻ (${platformFiltered.filter(s => s.category === 'share').length})`, icon: Share2 }
  ];

  const filtered = platformFiltered.filter((srv) => {
    if (!srv) return false;
    if (activeCategory !== 'all') {
      if (activeCategory === 'combo') {
        if (srv.category !== 'combo' && srv.category !== 'full_channel') return false;
      } else if (srv.category !== activeCategory) {
        return false;
      }
    }
    if (priceFilter === 'under_1m' && (srv.priceNum || 0) > 1000000) return false;
    if (priceFilter === '1m_3m' && ((srv.priceNum || 0) <= 1000000 || (srv.priceNum || 0) > 3000000)) return false;
    if (priceFilter === '3m_7m' && ((srv.priceNum || 0) <= 3000000 || (srv.priceNum || 0) > 7000000)) return false;
    if (priceFilter === '7m_10m' && ((srv.priceNum || 0) <= 7000000 || (srv.priceNum || 0) > 10000000)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (srv.title || '').toLowerCase().includes(q) || 
             (srv.description || '').toLowerCase().includes(q) || 
             (srv.tag || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>🔥 SIÊU HỆ SINH THÁI 3 TRONG 1: TIKTOK • FACEBOOK • YOUTUBE</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                ✓ 100% Người Dùng Thật Việt Nam
              </span>
              <FeatureGuideTooltip
                title="Hệ Sinh Thái Tăng Trưởng Đa Nền Tảng"
                description="Hệ thống cung cấp trọn gói giải pháp xây dựng thương hiệu cá nhân, doanh nghiệp và bán hàng tự động trên cả 3 nền tảng lớn nhất hiện nay: TikTok Shop, Facebook Fanpage/Reels và Kênh YouTube Partner."
                steps={[
                  "TikTok: 1,000 Follow mở Shop & Live Studio, Giữ chân 40s-60s đẩy FYP.",
                  "Facebook: Like/Follow Fanpage chuẩn SEO, Follow cá nhân, View Reels 60s, Seeding chốt đơn.",
                  "YouTube: 1,000 Subs thật chống tụt, 4,000h xem bật kiếm tiền YPP, Lượt xem 1080p.",
                  "Bảo hành chống tụt 30 ngày tự động đền bù 100% cho mọi đơn hàng."
                ]}
                tips="Chọn đúng Tab nền tảng bạn muốn mua để xem các gói tối ưu nhất cho kênh."
                badge="ĐA NỀN TẢNG"
                placement="bottom"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-display">
              Kho Gói Tăng Trưởng Toàn Năng: TikTok • Facebook • YouTube
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tận dụng sức mạnh của hơn <strong>154,200+ người dùng thật</strong> để bùng nổ traffic, tăng tương tác tự nhiên, mở khóa kiếm tiền và gia tăng doanh số bán hàng vượt bậc trên mọi nền tảng mạng xã hội.
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
            </div>
            <div className="text-[11px] text-slate-400 text-center font-mono">
              Số dư ví: <strong className="text-amber-400">{(user?.avaliveCoins || 0).toLocaleString()} Xu</strong>
              <span className="text-slate-500 mx-1">≈</span>
              <strong className="text-emerald-400">{(user?.avaliveCoins || 0).toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 1. PLATFORM SWITCHER TABS (TIKTOK / FACEBOOK / YOUTUBE / ALL) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLATFORMS.map((plat) => {
          const Icon = plat.icon;
          const isSelected = selectedPlatform === plat.id;
          return (
            <button
              key={plat.id}
              type="button"
              onClick={() => {
                setSelectedPlatform(plat.id as any);
                setActiveCategory('all');
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-br ${plat.color} text-white border-white/30 shadow-xl shadow-purple-950/40 scale-[1.02] ring-2 ring-white/20`
                  : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {plat.count} Gói
                </span>
              </div>
              <div>
                <div className="text-sm font-black tracking-wide font-display">{plat.label}</div>
                <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{plat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4 Pillars of Store Benefits (Di chuyển ra ngoài trang bán hàng & bảo hành 15-30 ngày) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">154,200+ Người Dùng Thật</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Mạng lưới người dùng thật xem video, tương tác chéo tự nhiên trên TikTok, Facebook và YouTube.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Bảo Hành Chống Tụt 30 Ngày</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hệ thống tự động theo dõi số lượng tương tác. Cam kết bù đủ 100% nếu phát sinh hiện tượng tụt giảm.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
            <Headphones className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Cố Vấn Kỹ Thuật 1-1</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Đội ngũ chuyên gia Marketing đồng hành tư vấn chiến lược xây kênh, tối ưu SEO và chốt đơn chuyển đổi cao.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-display">Kích Hoạt Thuật Toán Đề Xuất</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Cơ chế Drip-feed nhịp độ tự nhiên giúp kênh đạt điểm tín nhiệm cao, dễ dàng được đẩy vào tab Đề Xuất.
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
          title="Hệ Thống Gói Tăng Trưởng Toàn Năng"
          description="Kho dịch vụ tăng trưởng đa nền tảng chuẩn thuật toán 2026, cung cấp đầy đủ các gói TikTok, Facebook và YouTube từ mức cá nhân đến doanh nghiệp."
          steps={[
            "TikTok: Follow mở shop, View FYP, Thả tim, Seeding, Mắt live 400 - 10k mắt.",
            "Facebook: Like/Follow Fanpage chuẩn SEO, Follow profile, View Reels 60s, Seeding chốt đơn.",
            "YouTube: 1,000 Subscribers thật, 4,000 giờ xem bật kiếm tiền YPP, View 1080p, Like, Comment.",
            "Bảo hành chống tụt: 30 ngày tự động đền bù 100%."
          ]}
          tips="Sử dụng các gói Combo để tiết kiệm từ 30% đến 40% chi phí xây dựng kênh."
          badge="Đa Nền Tảng"
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
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono shadow-md ${
                      srv.platform === 'youtube'
                        ? 'bg-red-600 text-white'
                        : srv.platform === 'facebook'
                        ? 'bg-blue-600 text-white'
                        : 'bg-black/90 text-rose-400 border border-rose-500/40'
                    }`}>
                      {srv.platform === 'youtube' ? '🔴 YouTube' : srv.platform === 'facebook' ? '📘 Facebook' : '🎵 TikTok'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 border border-amber-500/30">
                      {srv.badge || srv.tag}
                    </span>
                  </div>
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {srv.title}
                  </h3>
                </div>
                
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>

                {/* Key Metrics / Highlights Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {srv.retentionRate && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{srv.retentionRate}</span>
                    </span>
                  )}
                  {srv.weeklySlotBonus && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      <span>+{srv.weeklySlotBonus} Slot Tuần</span>
                    </span>
                  )}
                  {srv.watchDurationNote && (
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                      ⏱️ {srv.category === 'watch' ? 'Xem 40s-60s' : 'View Tự Nhiên'}
                    </span>
                  )}
                </div>

                {/* VIP Benefits & Rights */}
                {srv.benefits && srv.benefits.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" /> Đặc Quyền VIP & Lợi Ích:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {srv.benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features List */}
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  {(srv.features || []).slice(0, 2).map((feat, i) => (
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
