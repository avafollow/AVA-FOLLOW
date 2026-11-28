import React, { useState, useEffect } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Users,
  Video,
  Award,
  Lock,
  Zap,
  ChevronDown,
  Layers,
  Globe,
  Radio,
  ShieldAlert,
  ExternalLink,
  Scale,
  Gavel,
  Mail,
  PhoneCall,
  Cpu,
  BarChart3,
  Check,
  Sparkle
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { VietnameseLegalPolicyModal } from '../modals/VietnameseLegalPolicyModal';
import { VIETNAMESE_LEGAL_OVERVIEW } from '../../data/vietnameseLegalPolicies';

const NAV_TABS = [
  { id: 'hero', label: 'Giới Thiệu App', icon: Sparkles },
  { id: 'services', label: 'Dịch Vụ Cốt Lõi', icon: Layers },
  { id: 'platforms', label: 'Đa Nền Tảng', icon: Globe },
  { id: 'escrow', label: 'Ký Quỹ Escrow', icon: Lock },
  { id: 'legal-footer', label: 'Pháp Lý & Bảo Mật', icon: Scale }
] as const;

const LandingPageCore: React.FC = () => {
  const { openAuthModal } = useTikTokApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [selectedLegalPolicyId, setSelectedLegalPolicyId] = useState<string>('intellectual-property');
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');

  const openLegalPolicy = (policyId: string = 'intellectual-property') => {
    setSelectedLegalPolicyId(policyId);
    setIsLegalModalOpen(true);
  };

  useEffect(() => {
    const sectionIds = NAV_TABS.map(t => t.id);

    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveNavSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 1024;
      const headerOffset = isMobile ? 110 : 88;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveNavSection(sectionId);
    }
  };

  const coreServices = [
    {
      icon: Users,
      badge: '100% NGƯỜI THẬT',
      title: 'Mạng Lưới Tương Tác Người Thật',
      desc: 'Kết nối cộng đồng người dùng thật hoạt động hàng ngày. Nói KHÔNG với bot, tool hay tài khoản ảo, bảo vệ kênh an toàn tuyệt đối trước thuật toán.',
      gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderHover: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
      iconColor: 'text-rose-400',
      highlights: ['Follow & Subscribe tự nhiên', 'Thả tim, bình luận đúng ngữ cảnh', 'Tỷ lệ giữ chân Retention chuẩn']
    },
    {
      icon: Radio,
      badge: 'LIVE ENGINE 2026',
      title: 'Đẩy Mắt Livestream Giữ Chân',
      desc: 'Cung cấp mắt xem Livestream người thật ổn định cho TikTok Live, YouTube Live và Facebook Live, tạo hiệu ứng đám đông bùng nổ phiên phát sóng.',
      gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      borderHover: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
      iconColor: 'text-purple-400',
      highlights: ['Phát trực tiếp mượt mà đa thiết bị', 'Heartbeat theo dõi thời gian xem thực', 'Tương thích chuẩn âm thanh & khung hình']
    },
    {
      icon: ShieldCheck,
      badge: 'ANTI-FRAUD AI',
      title: 'Xác Thực OAuth & Chống Gian Lận',
      desc: 'Tích hợp đối soát trực tiếp qua Google/YouTube API, Meta Graph API & TikTok OAuth, tự động phát hiện hành vi gian lận và xác minh chính chủ.',
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderHover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/20',
      iconColor: 'text-cyan-400',
      highlights: ['Nhận diện đúng tên kênh & logo thật', 'Khóa gian lận bỏ ngang tự động', 'Sổ cái đối soát minh bạch từng lượt']
    },
    {
      icon: BarChart3,
      badge: 'REALTIME CLOUD',
      title: 'Quản Trị Chiến Dịch & Báo Cáo Tức Thì',
      desc: 'Theo dõi tiến độ chiến dịch, số lượng hoàn thành, đối soát ví Xu và lịch sử tương tác thời gian thực trên nền tảng Cloud hiệu năng cao.',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
      iconColor: 'text-emerald-400',
      highlights: ['Tốc độ tải siêu mượt chuẩn App', 'Đồng bộ Cloud tự động 24/7', 'Đẩy Top chiến dịch & thống kê chi tiết']
    }
  ];

  const platforms = [
    {
      name: 'TikTok',
      tag: 'Video & TikTok Live',
      accent: 'from-[#FF0050] to-[#00F2FE]',
      border: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      symbol: '♪',
      features: [
        'Follow kênh chính chủ & thả tim video FYP',
        'Xem giữ chân video & mắt xem TikTok Live',
        'Tự động nhận diện link chia sẻ di động & logo kênh thật'
      ]
    },
    {
      name: 'YouTube',
      tag: 'Shorts, Video & Live',
      accent: 'from-red-600 to-amber-500',
      border: 'hover:border-red-500/50 hover:shadow-red-500/20',
      badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30',
      symbol: '▶',
      features: [
        'Đăng ký kênh (Subscribe) xác thực qua YouTube Data API',
        'Thích video, bình luận thật & xem giữ chân chuẩn 1080p',
        'Đồng bộ chính xác tên kênh & ảnh đại diện YouTube thật'
      ]
    },
    {
      name: 'Facebook',
      tag: 'Reels, Fanpage & Live',
      accent: 'from-blue-600 to-cyan-400',
      border: 'hover:border-blue-500/50 hover:shadow-blue-500/20',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      symbol: 'f',
      features: [
        'Theo dõi Fanpage, trang cá nhân & tương tác Reels',
        'Phát Video & Livestream Facebook rõ nét kèm âm thanh chuẩn',
        'Kết nối tài khoản Facebook OAuth & xác minh Meta Webhook'
      ]
    }
  ];

  const faqs = [
    {
      q: 'AVA FOLLOW hoạt động dựa trên cơ chế nào để đảm bảo 100% Người Thật?',
      a: 'Ứng dụng vận hành theo mô hình kết nối người dùng thật (Human-to-Human) kết hợp xác thực OAuth chính chủ trên TikTok, YouTube và Facebook. Mọi tương tác đều phải vượt qua bộ lọc thời gian thực, kiểm tra nhận diện tài khoản và chống gian lận AI, hoàn toàn không sử dụng bot hay công cụ ảo.'
    },
    {
      q: 'App có tự động nhận diện đúng kênh khi dán link video không?',
      a: 'Có. Khi bạn dán bất kỳ đường link Video, Shorts, Reels hay Livestream từ YouTube, Facebook hoặc TikTok, hệ thống sẽ tự động phân giải và hiển thị chính xác tên kênh, handle và logo đại diện chính chủ của kênh đó.'
    },
    {
      q: 'Cơ chế Két Ký Quỹ Smart Escrow 3 bên bảo vệ người dùng ra sao?',
      a: 'Toàn bộ giao dịch hợp tác booking KOC và chiến dịch đều được bảo vệ qua Két Ký Quỹ Escrow độc lập. Ngân sách chỉ được giải ngân sau khi hệ thống đối soát và hai bên xác nhận nghiệm thu đúng cam kết.'
    },
    {
      q: 'Nền tảng tuân thủ quy định pháp luật và bảo mật dữ liệu như thế nào?',
      a: 'AVA FOLLOW áp dụng chuẩn mã hóa SSL/TLS 256-bit, tuân thủ nghiêm ngặt Luật Sở hữu trí tuệ 2022, Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân và Luật An ninh mạng Việt Nam. Bạn có thể tra cứu đầy đủ 9 văn bản chính sách ngay tại chân trang.'
    }
  ];

  return (
    <div className="min-h-[100dvh] max-w-full bg-[#06080F] text-slate-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden fast-scroll">
      {/* 1. LUXURY STICKY NAVBAR (TINH GỌN 5 CHỨC NĂNG CỐT LÕI + HIỆU ỨNG CAO CẤP) */}
      <header className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] bg-[#06080F]/85 backdrop-blur-2xl border-b border-white/10 transition-all shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, 'hero')}
            className="flex items-center gap-2.5 shrink-0 group transition-transform duration-300 hover:scale-[1.03]"
          >
            <BrandLogo size="md" showText={true} showSubtitle={false} />
          </a>

          {/* 5 Core Animated Navigation Pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeNavSection === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => scrollToSection(e, tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF0050] via-purple-600 to-cyan-500 text-white shadow-lg shadow-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => openAuthModal()}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => openAuthModal()}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#FF0050] via-rose-600 to-purple-600 hover:brightness-110 shadow-lg shadow-rose-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span>Vào Ứng Dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Compact 5-Tab Bar */}
        <div className="lg:hidden border-t border-white/5 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNavSection === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => scrollToSection(e, tab.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF0050] to-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </header>

      {/* 2. HERO SECTION — GIỚI THIỆU APP AVA FOLLOW */}
      <section id="hero" className="relative pt-14 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Luxury Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[420px] bg-gradient-to-r from-[#FF0050]/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wide text-slate-200">
              NỀN TẢNG KẾT NỐI TƯƠNG TÁC NGƯỜI THẬT ĐA NỀN TẢNG 2026
            </span>
            <Sparkle className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Main Headline */}
          <div className="space-y-5 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.12] text-white">
              Hệ Sinh Thái{' '}
              <span className="bg-gradient-to-r from-[#FF0050] via-purple-400 to-[#00F2FE] bg-clip-text text-transparent">
                AVA FOLLOW
              </span>
              <br />
              Tăng Trưởng Kênh Thật &amp; Minh Bạch
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
              Ứng dụng kết nối cộng đồng người dùng thật trên{' '}
              <strong className="text-white">TikTok, YouTube &amp; Facebook</strong> — tích hợp xác thực OAuth chính chủ, chống gian lận AI thời gian thực và két ký quỹ bảo vệ Smart Escrow 3 bên.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => openAuthModal()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF0050] via-rose-600 to-purple-600 hover:brightness-110 text-white font-black text-sm font-display tracking-wide shadow-2xl shadow-rose-600/35 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-white/25"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Khởi Động Ứng Dụng Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, 'services')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-sm border border-white/15 hover:border-cyan-400/40 backdrop-blur-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Khám Phá Dịch Vụ Cốt Lõi</span>
            </a>
          </div>

          {/* 4 Live Animated Platform Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 pt-8">
            {[
              { value: '100%', label: 'Người Dùng Thật', sub: '0% Bot / Tool ảo', color: 'text-rose-400', glow: 'hover:border-rose-500/40 hover:shadow-rose-500/15' },
              { value: '3 Nền Tảng', label: 'TikTok • YouTube • FB', sub: 'Đồng bộ đa kênh 24/7', color: 'text-cyan-400', glow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/15' },
              { value: 'OAuth API', label: 'Xác Thực Chính Chủ', sub: 'Chống gian lận thời gian thực', color: 'text-purple-400', glow: 'hover:border-purple-500/40 hover:shadow-purple-500/15' },
              { value: 'Escrow 3 Bên', label: 'Két Ký Quỹ An Toàn', sub: 'Nghiệm thu minh bạch', color: 'text-emerald-400', glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/15' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-left transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1.5 hover:bg-white/[0.06] hover:shadow-2xl ${stat.glow} group`}
              >
                <div className={`text-xl sm:text-2xl font-black font-display ${stat.color} group-hover:scale-105 origin-left transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">{stat.label}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DỊCH VỤ CỐT LÕI CỦA ỨNG DỤNG */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Công Nghệ &amp; Dịch Vụ Cốt Lõi
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              Tối Ưu Mọi Chỉ Số Tăng Trưởng Trên Một Ứng Dụng Duy Nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Tập trung vào hiệu năng siêu mượt, độ chính xác tuyệt đối và khả năng vận hành tự động cho Creator &amp; Doanh nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {coreServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className={`relative p-6 sm:p-8 rounded-3xl bg-[#0B101B]/90 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1.5 hover:shadow-2xl ${srv.borderHover} group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${srv.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Icon className={`w-6 h-6 ${srv.iconColor}`} />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-300 tracking-wider">
                        {srv.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-black font-display text-white group-hover:text-cyan-200 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-white/10">
                      {srv.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <Check className={`w-4 h-4 shrink-0 ${srv.iconColor}`} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HỆ SINH THÁI ĐA NỀN TẢNG (TIKTOK • YOUTUBE • FACEBOOK) */}
      <section id="platforms" className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-white/5 bg-gradient-to-b from-[#080C15] to-[#06080F]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Kết Nối 3 Nền Tảng Lớn Nhất
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              Nhận Diện Kênh Chính Chủ &amp; Phát Trực Tiếp Siêu Mượt
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Dán link bất kỳ từ TikTok, YouTube hoặc Facebook — hệ thống tự động đồng bộ đúng tên kênh, logo đại diện thật và mở trình phát chuyên biệt.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platforms.map((plat, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl bg-[#0B101B]/95 border border-white/10 flex flex-col justify-between gap-6 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl ${plat.border} group`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${plat.accent} flex items-center justify-center text-white text-xl font-black shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {plat.symbol}
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold ${plat.badgeClass}`}>
                      {plat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black font-display text-white">{plat.name}</h3>
                    <div className="h-0.5 w-12 mt-2 rounded-full bg-gradient-to-r from-white/40 to-transparent group-hover:w-24 transition-all duration-300" />
                  </div>

                  <ul className="space-y-3">
                    {plat.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openAuthModal()}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white text-xs font-bold font-display flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>Kết Nối {plat.name} Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CƠ CHẾ KÝ QUỸ SMART ESCROW & QUY TRÌNH 3 BƯỚC */}
      <section id="escrow" className="py-16 sm:py-24 px-4 sm:px-6 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              An Toàn Tuyệt Đối Với Smart Escrow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              Quy Trình Vận Hành Minh Bạch Chỉ Với 3 Bước
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                step: '01',
                icon: Cpu,
                title: 'Kết Nối Tài Khoản Chính Chủ',
                desc: 'Đăng nhập nhanh chóng bằng Google, Facebook hoặc TikTok OAuth để đồng bộ hồ sơ và xác minh chính chủ an toàn.',
                color: 'from-cyan-500 to-blue-600'
              },
              {
                step: '02',
                icon: Video,
                title: 'Khởi Tạo Chiến Dịch & Ký Quỹ',
                desc: 'Dán đường link Video hoặc Livestream cần tăng trưởng, hệ thống tự động nhận diện kênh thật và bảo vệ ngân sách trong két Escrow.',
                color: 'from-rose-500 to-purple-600'
              },
              {
                step: '03',
                icon: ShieldCheck,
                title: 'Nghiệm Thu Tự Động & Bảo Hành',
                desc: 'Hệ thống kiểm duyệt 100% tương tác người thật qua API nền tảng, cập nhật tiến độ tức thì và bảo hành minh bạch.',
                color: 'from-emerald-500 to-teal-600'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-[#0B101B] border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-2xl space-y-4 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-3xl font-black font-mono text-white/10 group-hover:text-white/25 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-display text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Concise FAQ Accordion */}
          <div className="pt-8 max-w-4xl mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-black font-display text-white text-center mb-6">
              Câu Hỏi Thường Gặp Về Ứng Dụng
            </h3>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#0E1422] border-rose-500/40 shadow-lg shadow-rose-950/20'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-rose-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Clean CTA Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#FF0050]/15 via-purple-600/15 to-cyan-500/15 border border-white/15 text-center space-y-5 shadow-2xl hover:border-white/25 transition-all duration-300">
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              Sẵn Sàng Trải Nghiệm AVA FOLLOW?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Đăng nhập ngay để kết nối kênh TikTok, YouTube, Facebook chính chủ và bắt đầu vận hành chiến dịch người thật siêu mượt.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openAuthModal()}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0050] via-rose-600 to-purple-600 hover:brightness-110 text-white font-black text-xs sm:text-sm font-display shadow-xl shadow-rose-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Bắt Đầu Miễn Phí Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuthModal()}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Đăng Nhập Tài Khoản
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TOÀN BỘ 9 CHÍNH SÁCH PHÁP LUẬT VIỆT NAM, BẢN QUYỀN & LUXURY FOOTER */}
      <footer id="legal-footer" className="bg-[#04060A] border-t border-white/10 pt-16 pb-12 text-xs text-slate-400 font-mono relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">

          {/* BANNER QUỐC GIA: TUÂN THỦ PHÁP LUẬT NƯỚC CHXHCN VIỆT NAM & SỞ HỮU TRÍ TUỆ */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-red-950/30 via-slate-900/60 to-blue-950/30 border border-white/15 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-xl shadow-red-900/40 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#080B12] rounded-[14px] flex items-center justify-center">
                  <Scale className="w-7 h-7 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                    LUẬT SHTT SỐ 07/2022/QH15
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Khung Pháp Lý, Bản Quyền &amp; Chính Sách Tuân Thủ Nền Tảng 2026
                </h3>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed max-w-3xl">
                  Nền tảng AVA FOLLOW thiết lập và thực thi nghiêm ngặt 100% quy chuẩn pháp lý theo Bộ luật Dân sự, Luật Sở hữu trí tuệ 2022, Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân, Luật An ninh mạng 2018 và Luật Thương mại điện tử Việt Nam.
                </p>
              </div>
            </div>

            <button
              onClick={() => openLegalPolicy('intellectual-property')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs font-mono shadow-xl shadow-red-950/50 flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all border border-amber-400/30 font-display"
            >
              <Gavel className="w-4 h-4 text-amber-300" />
              <span>Tra Cứu Toàn Bộ 9 Văn Bản Chính Sách</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* DẢI HUY HIỆU TUÂN THỦ PHÁP LUẬT VIỆT NAM (5 HUY HIỆU QUỐC GIA) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                icon: ShieldCheck,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10 border-purple-500/20',
                title: 'Bảo Hộ Bản Quyền SHTT',
                law: 'Luật SHTT 2022 & NĐ 17/2023',
                id: 'intellectual-property'
              },
              {
                icon: Lock,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20',
                title: 'Bảo Vệ Dữ Liệu Cá Nhân',
                law: 'Nghị định 13/2023/NĐ-CP',
                id: 'privacy-data-protection'
              },
              {
                icon: ShieldAlert,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/20',
                title: 'An Ninh Mạng & A05',
                law: 'Luật An ninh mạng số 24/2018',
                id: 'cybersecurity-compliance'
              },
              {
                icon: Scale,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20',
                title: 'Smart Escrow Ký Quỹ',
                law: 'Luật TM & NĐ 52/2013, 85/2021',
                id: 'smart-escrow-contract'
              },
              {
                icon: Award,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/20',
                title: 'Bảo Vệ Người Tiêu Dùng',
                law: 'Luật BVNTD số 19/2023/QH15',
                id: 'consumer-protection-refund'
              }
            ].map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={idx}
                  onClick={() => openLegalPolicy(badge.id)}
                  className={`p-3 rounded-2xl border ${badge.bg} flex items-center gap-2.5 cursor-pointer hover:scale-[1.03] active:scale-95 transition-all group`}
                >
                  <div className="p-2 rounded-xl bg-black/40 shrink-0">
                    <IconComp className={`w-4 h-4 ${badge.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {badge.title}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      {badge.law}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BẢNG DANH MỤC TOÀN BỘ CHÍNH SÁCH DƯỚI CHÂN TRANG (4 CỘT CHUYÊN SÂU) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-white/5">
            {/* CỘT 1: BẢN QUYỀN & QUYỀN SỞ HỮU TRÍ TUỆ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase font-display">
                    Sở Hữu Trí Tuệ &amp; Bản Quyền
                  </h4>
                  <span className="text-[9px] text-purple-400 font-mono">Luật SHTT số 07/2022/QH15</span>
                </div>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 font-mono">
                <li>
                  <button
                    onClick={() => openLegalPolicy('intellectual-property')}
                    className="hover:text-purple-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quyền SHTT phần mềm &amp; logo AVA FOLLOW</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('intellectual-property')}
                    className="hover:text-purple-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quyền tác giả video của Creator &amp; KOC</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('intellectual-property')}
                    className="hover:text-purple-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Miễn trừ nhãn hiệu TikTok, Meta, Google</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('intellectual-property')}
                    className="hover:text-purple-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quy trình gỡ bỏ vi phạm bản quyền DMCA 24h</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('legal-disclaimer')}
                    className="hover:text-purple-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tuyên bố miễn trừ &amp; Sự cố bất khả kháng</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* CỘT 2: AN NINH MẠNG & BẢO VỆ DỮ LIỆU CÁ NHÂN */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase font-display">
                    An Ninh Mạng &amp; Dữ Liệu
                  </h4>
                  <span className="text-[9px] text-emerald-400 font-mono">Nghị định 13/2023/NĐ-CP</span>
                </div>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 font-mono">
                <li>
                  <button
                    onClick={() => openLegalPolicy('privacy-data-protection')}
                    className="hover:text-emerald-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bảo vệ dữ liệu cá nhân &amp; Quyền riêng tư</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('cybersecurity-compliance')}
                    className="hover:text-emerald-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Chính sách tuân thủ Luật An ninh mạng 2018</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('cybersecurity-compliance')}
                    className="hover:text-emerald-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer text-rose-300/90"
                  >
                    <span className="text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Chính sách Không Khoan Nhượng lừa đảo, cờ bạc</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('cybersecurity-compliance')}
                    className="hover:text-emerald-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Cơ chế trích xuất chứng cứ bàn giao A05</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('privacy-data-protection')}
                    className="hover:text-emerald-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tiêu chuẩn mã hóa AES-256 &amp; Quyền xóa dữ liệu</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* CỘT 3: ĐIỀU KHOẢN SÀN & HỢP ĐỒNG KÝ QUỸ SMART ESCROW */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase font-display">
                    Điều Khoản Sàn &amp; Escrow
                  </h4>
                  <span className="text-[9px] text-amber-400 font-mono">Luật TM &amp; NĐ 52/2013</span>
                </div>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 font-mono">
                <li>
                  <button
                    onClick={() => openLegalPolicy('terms-of-service')}
                    className="hover:text-amber-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Điều khoản dịch vụ &amp; Thỏa thuận điện tử</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('smart-escrow-contract')}
                    className="hover:text-amber-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Cơ chế Két Ký Quỹ Độc Lập Smart Escrow 3 bên</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('smart-escrow-contract')}
                    className="hover:text-amber-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Chính sách bảo hành 72h &amp; 02 lần sửa video</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('smart-escrow-contract')}
                    className="hover:text-amber-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quy trình hòa giải &amp; Trọng tài thương mại VIAC</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('terms-of-service')}
                    className="hover:text-amber-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quy tắc ứng xử văn minh &amp; Năng lực dân sự</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* CỘT 4: TIÊU DÙNG, THUẾ & CHỐNG GIAN LẬN */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase font-display">
                    Tiêu Dùng &amp; Chống Gian Lận
                  </h4>
                  <span className="text-[9px] text-cyan-400 font-mono">100% Người Thật Tương Tác</span>
                </div>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-400 font-mono">
                <li>
                  <button
                    onClick={() => openLegalPolicy('anti-fraud-policy')}
                    className="hover:text-cyan-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Chính sách chống gian lận (0% Bot / Tool ảo)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('affiliate-tax-policy')}
                    className="hover:text-cyan-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Chính sách cộng tác &amp; Nghĩa vụ thuế TNCN</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('consumer-protection-refund')}
                    className="hover:text-cyan-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bảo vệ quyền lợi người tiêu dùng (Luật BVNTD)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('consumer-protection-refund')}
                    className="hover:text-cyan-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Hoàn tiền 100% &amp; Bảo hành bù đắp tự động</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalPolicy('affiliate-tax-policy')}
                    className="hover:text-cyan-300 transition-colors text-left flex items-start gap-1.5 group cursor-pointer"
                  >
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Quy chuẩn rút tiền tài khoản ngân hàng chính chủ</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* THÔNG TIN PHÁP NHÂN VẬN HÀNH & KÊNH LIÊN HỆ PHÁP CHẾ */}
          <div className="p-6 rounded-3xl bg-[#070A11] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[11px]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white uppercase text-xs font-display">
                  {VIETNAMESE_LEGAL_OVERVIEW.platformName}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-bold">Ban Pháp Chế &amp; Giám Sát An Ninh Mạng Quốc Gia</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-sans">
                <strong>Trụ sở chính:</strong> {VIETNAMESE_LEGAL_OVERVIEW.headquarters}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono text-[10px]">
                <span>Tổng đài CSKH: <strong className="text-white">{VIETNAMESE_LEGAL_OVERVIEW.hotline}</strong></span>
                <span>Hotline Pháp chế 24/7: <strong className="text-amber-400">{VIETNAMESE_LEGAL_OVERVIEW.emergencyLegalHotline}</strong></span>
                <span>Email Pháp chế: <strong className="text-blue-400">{VIETNAMESE_LEGAL_OVERVIEW.legalEmail}</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${VIETNAMESE_LEGAL_OVERVIEW.legalEmail}?subject=Khieu-Nai-Ban-Quyen-Phap-Ly`}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs font-mono flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Khiếu Nại Bản Quyền</span>
              </a>
              <a
                href="tel:19008899"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Tổng Đài 1900.8899</span>
              </a>
            </div>
          </div>

          {/* COPYRIGHT & CERTIFICATIONS STRIP */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
            <div>
              © 2026 AVA FOLLOW Ecosystem. Toàn bộ quyền sở hữu trí tuệ được bảo lưu theo Pháp luật Nước CHXHCN Việt Nam. 100% Người Thật Tương Tác.
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400/90">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Mã Hóa SSL/TLS 256-Bit</span>
              </span>
              <span className="flex items-center gap-1 text-purple-400/90">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Bảo Hộ Bản Quyền SHTT</span>
              </span>
              <span className="flex items-center gap-1 text-blue-400/90">
                <Scale className="w-3 h-3 text-blue-400" />
                <span>Đa Nền Tảng 2026</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL TRA CỨU TOÀN BỘ VĂN BẢN CHÍNH SÁCH PHÁP LUẬT VIỆT NAM & SỞ HỮU TRÍ TUỆ */}
      <VietnameseLegalPolicyModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialPolicyId={selectedLegalPolicyId}
      />
    </div>
  );
};

export const LandingPage = React.memo(LandingPageCore);
