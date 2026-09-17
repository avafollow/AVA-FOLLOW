import React, { useState, useMemo } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Users, 
  TrendingUp, 
  Video, 
  Coins, 
  Award, 
  Share2, 
  DollarSign, 
  Lock, 
  Eye, 
  Zap, 
  ChevronDown, 
  Star, 
  HelpCircle, 
  Layers, 
  Tv, 
  MessageSquare, 
  Smartphone, 
  BarChart3, 
  Check, 
  Globe, 
  Radio, 
  ShieldAlert, 
  Headphones, 
  Calendar,
  Clock,
  Heart,
  X,
  Target,
  ShoppingBag,
  Gift,
  Rocket,
  Briefcase,
  GraduationCap,
  Store,
  Building2,
  CheckCheck,
  RefreshCw,
  Camera,
  Percent,
  Sliders,
  ExternalLink,
  ThumbsUp
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useTikTokApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Active Audience Tab (6 core segments)
  const [activeAudience, setActiveAudience] = useState<'student' | 'mom' | 'office' | 'koc' | 'shop' | 'enterprise'>('student');

  // Interactive Earnings & Business Calculator State
  const [dailyActions, setDailyActions] = useState<number>(35); // 10 - 150 actions/day
  const [affiliateFriends, setAffiliateFriends] = useState<number>(6); // 0 - 50 friends
  const [kocContracts, setKocContracts] = useState<number>(2); // 0 - 10 contracts/month

  // Dynamic calculated earnings
  const calculatedIncome = useMemo(() => {
    // 500 Xu per action average * dailyActions * 30 days
    const actionEarnings = dailyActions * 500 * 30;
    // Affiliate passive income: average 200.000đ per active referral per month
    const affiliateEarnings = affiliateFriends * 250000;
    // KOC brand deals: average 1.800.000đ per video/photo delivery deal
    const kocEarnings = kocContracts * 1800000;
    
    const totalMonthly = actionEarnings + affiliateEarnings + kocEarnings;
    const dailyEst = Math.round(totalMonthly / 30);
    return {
      actionEarnings,
      affiliateEarnings,
      kocEarnings,
      totalMonthly,
      dailyEst
    };
  }, [dailyActions, affiliateFriends, kocContracts]);

  // Modal Inspector for deep-dive cards
  const [inspectedCard, setInspectedCard] = useState<{
    title: string;
    subtitle: string;
    tag: string;
    badge: string;
    description: string;
    points: string[];
    metrics?: { label: string; value: string; color: string }[];
  } | null>(null);

  const faqs = [
    {
      q: 'Tại sao cam kết 100% Người Thật và nói KHÔNG với tool hay bot ảo?',
      a: 'AVA FOLLOW vận hành trên nguyên lý kết nối cộng đồng người dùng thật (Human-to-Human). Mỗi lượt follow, tim, comment, share và mắt xem livestream đều đến từ tài khoản người dùng thật có hoạt động hàng ngày, tuân thủ thuật toán giữ chân (Retention Rate) của TikTok. Tuyệt đối không dùng tool, bot hay VPS ảo nhằm bảo vệ kênh của bạn an toàn 100%, không bao giờ bị TikTok bóp reach hay shadowban.'
    },
    {
      q: 'Ai có thể kiếm tiền từ nền tảng này và cần chuẩn bị những gì?',
      a: 'BẤT KỲ AI có một chiếc điện thoại thông minh đều có thể tham gia kiếm tiền tại nhà: Học sinh sinh viên, mẹ bỉm sữa, nhân viên văn phòng đến Content Creator. Bạn không cần vốn, không cần ôm hàng, không cần kinh nghiệm. Chỉ cần làm các nhiệm vụ đơn giản như xem video 15s, thả tim, comment, follow hoặc tham gia tiếp thị liên kết (Affiliate hoa hồng đến 35%) và làm KOC nhận hợp đồng review sản phẩm.'
    },
    {
      q: 'Mắt xem Livestream hoạt động thế nào? Có đúng tệp khách hàng mua hàng không?',
      a: 'Mắt xem livestream của sàn là 100% NGƯỜI THẬT ĐÃ ĐƯỢC TARGET SẴN theo đúng ngành hàng của bạn (Thời trang, Mỹ phẩm, Ăn uống, Đồ gia dụng, Mẹ & Bé...). Người thật vào xem live từ 3-5 phút trở lên, thả tim, comment hỏi giá và kích thích tâm lý đám đông (Social Proof) để khách hàng vãng lai bấm mua hàng, giúp phiên live của chủ shop bùng nổ doanh số.'
    },
    {
      q: 'Doanh nghiệp hoặc Chủ Shop muốn book KOC review sản phẩm mới thì sao?',
      a: 'Hệ thống có sẵn danh mục hàng trăm KOC/KOL đã được xác minh KYC uy tín. Doanh nghiệp chỉ cần tạo đơn booking, gửi sản phẩm mẫu về địa chỉ KOC và tiền cọc được khóa an toàn trong Két Ký Quỹ Escrow 3 bên. KOC bàn giao video/ảnh đạt chuẩn brief, 2 bên nghiệm thu thì tiền mới được giải ngân tự động, bảo vệ quyền lợi đôi bên tuyệt đối.'
    },
    {
      q: 'Chính sách Tiếp Thị Liên Kết (Affiliate) hoa hồng lên đến 35% ra sao?',
      a: 'Khi bạn giới thiệu bạn bè, người dùng hoặc chủ shop tham gia nền tảng qua link độc quyền của mình, bạn sẽ nhận hoa hồng giới thiệu hấp dẫn từ 15% đến 35% cho mỗi giao dịch nạp tiền, nạp chiến dịch hoặc hoàn thành nhiệm vụ. Cấp bậc càng cao (Đồng, Bạc, Vàng, Kim Cương), hoa hồng và quyền lợi đại lý càng khủng, bảo lưu an toàn trong ví rút về bất kỳ lúc nào!'
    },
    {
      q: 'Rút tiền mặt về tài khoản ngân hàng mất bao lâu?',
      a: 'Tỷ giá quy đổi cố định: 1 XU = 1 VNĐ TIỀN MẶT THẬT. Khi đạt hạn mức rút, bạn chỉ cần nhập số tài khoản ngân hàng (Vietcombank, MB Bank, Techcombank, VietinBank, ACB, MoMo...). Lệnh rút tiền được hệ thống tự động đối soát và giải ngân về tài khoản của bạn nhanh chóng chỉ trong vài phút.'
    }
  ];

  return (
    <div className="min-h-[100dvh] max-w-full bg-[#07090E] text-slate-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      
      {/* 1. LUXURY STICKY NAVBAR */}
      <header className="sticky top-0 z-50 w-full pt-[env(safe-area-inset-top,0px)] bg-[#07090E]/90 backdrop-blur-2xl border-b border-white/10 transition-all shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo with Glowing Neon Aura */}
          <BrandLogo 
            size="md" 
            showSubtitle={false}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
          />

          {/* Desktop Nav Links - Đẳng cấp, sang trọng, nổi bật, ngắn gọn súc tích */}
          <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-lg shadow-black/40">
            <a 
              href="#human-network" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 whitespace-nowrap group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Người Thật</span>
            </a>
            <a 
              href="#ways-to-earn" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 whitespace-nowrap group"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Kiếm Tiền</span>
            </a>
            <a 
              href="#audiences" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 whitespace-nowrap group"
            >
              <Target className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Tệp Khách</span>
            </a>
            <a 
              href="#calculator" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap group shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Thu Nhập</span>
            </a>
            <a 
              href="#live-traffic" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap group shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Mắt Live</span>
            </a>
            <a 
              href="#escrow-koc" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 border border-purple-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap group shadow-sm"
            >
              <Video className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>KOC Ký Quỹ</span>
            </a>
            <a 
              href="#affiliate" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 hover:text-white hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-rose-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5 whitespace-nowrap group"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Hoa Hồng 35%</span>
            </a>
            <a 
              href="#roadmap" 
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap group shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Đa Nền Tảng</span>
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={openAuthModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0050] via-purple-600 to-[#00F2FE] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer font-display flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Đăng Ký Kiếm Tiền Ngay</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - CHỐT SALE THÔI MIÊN CỰC ĐỈNH */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#FF0050]/20 via-purple-600/20 to-[#00F2FE]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          
          {/* Top Security & Real Human Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-xl text-amber-300 text-xs font-bold backdrop-blur-md font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="uppercase">SÀN KẾT NỐI TƯƠNG TÁC NGƯỜI THẬT 100% • NÓI KHÔNG VỚI BOT VÀ VIEW ẢO</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Headline with Heavy Contrast */}
          <div className="space-y-4 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] font-display">
              BIẾN ĐIỆN THOẠI THÀNH{' '}
              <span className="bg-gradient-to-r from-[#FF0050] via-[#FF5E00] to-[#00F2FE] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,0,80,0.5)]">
                NGUỒN THU NHẬP ĐỘT PHÁ
              </span>{' '}
              &amp; BÙNG NỔ DOANH SỐ CHO MỌI NGƯỜI
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed font-normal">
              Nền tảng đầu tiên tại Việt Nam kết nối trực tiếp <strong className="text-white bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">NGƯỜI THẬT 100%</strong> với nhau! 
              Người dùng tự do <strong className="text-emerald-300">kiếm tiền tại nhà chỉ với điện thoại</strong> qua việc xem video, like, comment, follow, làm KOC review và tiếp thị liên kết hoa hồng tới <strong className="text-neonGold">35%</strong>. 
              Doanh nghiệp &amp; Chủ shop tiếp cận hàng ngàn <strong className="text-cyan-300">mắt xem livestream người thật đúng tệp</strong>, nổ đơn rầm rộ mà không lo bị bóp reach!
            </p>
          </div>

          {/* Dual Action CTA Buttons with micro-interactions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={openAuthModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF0050] via-purple-600 to-[#00F2FE] hover:scale-105 active:scale-95 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-rose-600/40 flex items-center justify-center gap-3 transition-all cursor-pointer font-display animate-neon-pulse"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>BẮT ĐẦU KIẾM TIỀN TẠI NHÀ (MIỄN PHÍ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('live-traffic');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 text-white border border-white/15 text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
            >
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>GIẢI PHÁP TĂNG DOANH SỐ CHO DOANH NGHIỆP</span>
            </button>
          </div>

          {/* Real-time Live Payouts Marquee (Social Proof & Dopamine Magnet) */}
          <div className="pt-3 max-w-4xl mx-auto overflow-hidden rounded-2xl bg-black/50 border border-white/10 p-2.5 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2">
              <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black flex items-center gap-1.5 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>VỪA GIAO DỊCH</span>
              </span>
              <div className="overflow-hidden whitespace-nowrap flex-1">
                <div className="inline-block animate-led-marquee text-xs font-mono text-slate-300">
                  <span className="mx-4 text-emerald-400 font-bold">🟢 Lê Hoàng Yến vừa rút 650.000đ về Vietcombank (1p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-amber-300 font-bold">⭐ Trần Minh Quân vừa nhận +2.000 Xu từ Vòng Quay May Mắn (2p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-purple-300 font-bold">💎 KOC Thùy Dương được giải ngân 4.500.000đ Hợp Đồng Escrow (4p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-cyan-300 font-bold">🚀 Shop ZenSkin vừa bật gói 500 Mắt Live, nổ 420 đơn TikTok Shop (2p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-rose-300 font-bold">🔥 Nguyễn Văn Thái nhận hoa hồng đại lý +1.400.000đ vào ví (3p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-emerald-400 font-bold">🟢 Phạm Thị Thảo vừa rút 1.200.000đ về MB Bank (5p trước)</span>
                  <span className="text-slate-600">•</span>
                  <span className="mx-4 text-amber-300 font-bold">⭐ Đặng Tuấn Kiệt hoàn thành 15/15 nhiệm vụ, nhận +3.800 Xu (6p trước)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live System Proof Ticker Bar */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-emerald-500/40 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">168.450+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Người Dùng Thật Hoạt Động</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-amber-500/40 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">2.850+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Doanh Nghiệp &amp; Chủ Shop</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-cyan-500/40 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">15.8 TỶ+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Xu Đã Thanh Toán Về ATM</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center hover:border-purple-500/40 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">0% BOT</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">100% An Toàn Kênh Tuyệt Đối</div>
            </div>
          </div>

          {/* 4 Trụ Cột Cam Kết & Bảo Chứng Uy Tín */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
              <Coins className="h-6 w-6 text-neonGold shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-black text-white font-mono">1 XU = 1 VNĐ</div>
                <div className="text-[10px] text-emerald-400 font-bold">Rút tiền thật 100% về ATM</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
              <ShieldCheck className="h-6 w-6 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-black text-white font-mono">BẢO MẬT 7 LỚP</div>
                <div className="text-[10px] text-slate-300">100% người thật • Không tụt</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
              <Lock className="h-6 w-6 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-black text-white font-mono">ESCROW MINH BẠCH</div>
                <div className="text-[10px] text-slate-300">Sàn giữ tiền, an toàn đôi bên</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg">
              <Users className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-black text-white font-mono">150.000+ THÀNH VIÊN</div>
                <div className="text-[10px] text-slate-300">Cộng đồng sôi động 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TUYÊN NGÔN BẢO CHỨNG: "NGƯỜI THẬT KẾT NỐI NGƯỜI THẬT" (REAL HUMAN VS BOT MATRIX) */}
      <section id="human-network" className="py-16 md:py-24 bg-gradient-to-b from-[#07090E] via-[#0B0E1B] to-[#07090E] border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold uppercase border border-rose-500/30">
              ⚡ SỰ KHÁC BIỆT CỐT LÕI MANG LẠI GIÁ TRỊ THẬT ⚡
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Đây Là Nền Tảng <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Kết Nối Người Thật</span>, Tuyệt Đối Không Phải Nơi Mua Bán Ảo!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Các dịch vụ mua like, mua follow truyền thống trên thị trường đều dùng tool ảo, VPS lậu khiến kênh bị TikTok gắn cờ spam, bóp tương tác vĩnh viễn. 
              Tại <strong>AVA FOLLOW</strong>, mọi hành động đều là <strong>sự trao đổi giá trị sòng phẳng giữa người thật và doanh nghiệp thật</strong>!
            </p>
          </div>

          {/* Matrix Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Column 1: Bot ảo truyền thống (Cảnh báo rủi ro) */}
            <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-5 hover:border-rose-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-display text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <span>DỊCH VỤ MUA VIEW / TOOL BOT ẢO NGOÀI THỊ TRƯỜNG</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">RỦI RO CAO</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Tài khoản ảo, avatar rác:</strong> Không có người dùng thực tế, bị tụt follow chỉ sau vài ngày.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Mắt livestream ảo:</strong> 0 tương tác, không bấm vào giỏ hàng, thuật toán TikTok nhận diện gian lận và bóp phân phối.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Nguy cơ khóa kênh &amp; tắt TikTok Shop:</strong> Vi phạm nghiêm trọng tiêu chuẩn cộng đồng của TikTok.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Mất tiền oan:</strong> Bỏ tiền ra mua các con số ảo vô nghĩa, không tạo ra bất kỳ đơn hàng nào.</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Hệ sinh thái AVA FOLLOW (Người thật 100%) */}
            <div className="p-6 rounded-3xl bg-emerald-950/25 border-2 border-emerald-500/60 space-y-5 shadow-2xl shadow-emerald-900/20 hover:border-emerald-400 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] font-mono uppercase tracking-wider rounded-bl-xl">
                BẢO HÀNH TRỌN ĐỜI
              </div>

              <div className="flex items-center gap-2 text-emerald-400 font-bold font-display text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>HỆ SINH THÁI TIKTOK PRO (NGƯỜI THẬT 100%)</span>
              </div>
              
              <ul className="space-y-3.5 text-xs text-slate-200 font-mono">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                  <span><strong>100% Người dùng thật có hoạt động:</strong> Lướt xem từ ứng dụng TikTok chính thức, giữ chân video từ 15s-30s.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                  <span><strong>Mắt xem livestream ĐÚNG TỆP TARGET:</strong> Người thật thả tim, bình luận hỏi sản phẩm, kích nổ đơn hàng thật cho shop.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                  <span><strong>Kích hoạt thuật toán Đề Xuất (FYP):</strong> TikTok nhận diện video có độ tương tác cao tự nhiên, chủ động đẩy lên xu hướng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                  <span><strong>Quyền lợi đôi bên sòng phẳng:</strong> Doanh nghiệp có đơn hàng &amp; traffic, Người dùng có thu nhập rút thẳng về ATM.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TẬP TRUNG TỪ KHÓA: 8 CON ĐƯỜNG KIẾM TIỀN TẠI NHÀ DÀNH CHO BẠN */}
      <section id="ways-to-earn" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase border border-amber-500/30">
            💰 ĐA DẠNG NGUỒN THU NHẬP • KHÔNG CẦN VỐN 💰
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            Kiếm Tiền Tại Nhà Dễ Dàng <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
              Chỉ Với Một Chiếc Điện Thoại Thông Minh
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mọi thao tác bạn vẫn làm hàng ngày trên TikTok như xem clip, thả tim, lướt live giờ đây đều tạo ra tiền mặt thật. 
            Dưới đây là <strong>8 hình thức kiếm tiền chủ lực</strong> bạn có thể bắt đầu ngay lập tức:
          </p>
        </div>

        {/* 8 Earning Cards Grid with Hover Scale Micro-Interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'watch',
              icon: Video,
              color: 'from-rose-500 to-pink-600',
              title: 'XEM VIDEO KIẾM TIỀN',
              sub: '500 Xu / Mỗi 15 Giây',
              desc: 'Xem đủ 15s các video trên For You Page chuẩn thuật toán giữ chân, nhận Xu tức thì vào ví.',
              badge: 'DỄ NHẤT'
            },
            {
              id: 'like',
              icon: Heart,
              color: 'from-pink-500 to-rose-600',
              title: 'THẢ TIM & LIKE VIDEO',
              sub: '250 Xu / Lượt Tim',
              desc: 'Thả tim tương tác cho các nhãn hàng và video mới ra mắt để hỗ trợ clip được đề xuất xu hướng.',
              badge: '1 CHẠM'
            },
            {
              id: 'comment',
              icon: MessageSquare,
              color: 'from-purple-500 to-indigo-600',
              title: 'BÌNH LUẬN & SEEDING',
              sub: '500 Xu / Bình Luận',
              desc: 'Để lại các bình luận có giá trị, tự nhiên theo nội dung clip, giúp tăng thảo luận sôi nổi.',
              badge: 'THƯỞNG CAO'
            },
            {
              id: 'share',
              icon: Share2,
              color: 'from-blue-500 to-cyan-600',
              title: 'CHIA SẺ VIDEO VIRAL',
              sub: '600 Xu / Lượt Chia Sẻ',
              desc: 'Chia sẻ video ra các mạng xã hội hoặc gửi cho bạn bè để lan tỏa thông điệp sản phẩm.',
              badge: 'NHANH GỌN'
            },
            {
              id: 'follow',
              icon: Users,
              color: 'from-emerald-500 to-teal-600',
              title: 'FOLLOW KÊNH ĐỐI TÁC',
              sub: '500 - 1.000 Xu / Kênh',
              desc: 'Bấm theo dõi các kênh TikTok doanh nghiệp, KOC mới ra mắt để nhận thù lao cộng thẳng vào số dư.',
              badge: 'ỔN ĐỊNH'
            },
            {
              id: 'live',
              icon: Eye,
              color: 'from-amber-500 to-orange-600',
              title: 'XEM LIVESTREAM SHOP',
              sub: '350 - 1.500 Xu / Phiên',
              desc: 'Vào xem các phiên live bán hàng từ 3-5 phút, hỗ trợ shop giữ mắt xem và kích thích chốt đơn.',
              badge: 'HOT TREND'
            },
            {
              id: 'koc_creator',
              icon: Camera,
              color: 'from-purple-600 to-pink-600',
              title: 'LÀM KOC / QUAY VIDEO & ẢNH',
              sub: '500K - 10 TRIỆU / Hợp Đồng',
              desc: 'Nhận sản phẩm mẫu miễn phí gửi về tận nhà, quay video hoặc chụp ảnh review cho nhãn hàng qua Ký Quỹ Escrow.',
              badge: 'THU NHẬP KHỦNG'
            },
            {
              id: 'affiliate',
              icon: Percent,
              color: 'from-yellow-500 to-amber-600',
              title: 'TIẾP THỊ LIÊN KẾT (35%)',
              sub: 'Hoa Hồng Đến 35% Trọn Đời',
              desc: 'Chia sẻ link mời bạn bè và doanh nghiệp cùng kiếm tiền, hưởng dòng tiền thu nhập thụ động bền vững.',
              badge: 'DÒNG TIỀN THỤ ĐỘNG'
            }
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.id}
                className="group relative p-5 rounded-3xl bg-[#0D111E] border border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between space-y-4 cursor-pointer"
                onClick={openAuthModal}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono font-bold group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white font-display group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {item.sub}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors font-mono">
                  <span>Bắt đầu ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PHÂN TÁCH 6 TỆP KHÁCH HÀNG AI CŨNG CÓ THỂ KIẾM TIỀN (INTERACTIVE AUDIENCE TABS) */}
      <section id="audiences" className="py-16 md:py-24 bg-gradient-to-b from-[#07090E] via-[#0D101E] to-[#07090E] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase border border-purple-500/30">
              👥 TỆP NGƯỜI DÙNG PHÙ HỢP 👥
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Bất Kỳ Ai Cũng Có Thể Bắt Đầu &amp; <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Tạo Dựng Nguồn Thu Nhập Bền Vững
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Chọn tệp phù hợp với bạn để xem lộ trình tạo thu nhập tối ưu nhất:
            </p>
          </div>

          {/* 6 Audience Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {[
              { id: 'student', label: '🎓 Học Sinh / Sinh Viên', range: '3 - 10 Triệu/tháng' },
              { id: 'mom', label: '🤱 Mẹ Bỉm & Nội Trợ', range: '5 - 20 Triệu/tháng' },
              { id: 'office', label: '💼 Dân Văn Phòng', range: '8 - 25 Triệu/tháng' },
              { id: 'koc', label: '🎬 Content Creator & KOC', range: '20 - 100+ Triệu/tháng' },
              { id: 'shop', label: '🏪 Chủ Shop TikTok Shop', range: 'X5 - X10 Doanh Số Live' },
              { id: 'enterprise', label: '🏢 Doanh Nghiệp & Nhãn Hàng', range: 'Tiết Kiệm 80% Chi Phí Ads' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAudience(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                  activeAudience === tab.id
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-900/40 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-80 font-normal">{tab.range}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0D18] border border-white/10 max-w-4xl mx-auto space-y-6 shadow-2xl animate-in fade-in duration-200">
            {activeAudience === 'student' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">🎓 Dành Cho Học Sinh, Sinh Viên</h3>
                    <p className="text-xs text-slate-400">Tận dụng 1 - 2 tiếng rảnh rỗi lướt điện thoại mỗi ngày</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Thu nhập mục tiêu:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">3.000.000đ - 10.000.000đ / tháng</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-amber-300 font-bold">1. Xem Video &amp; Tương Tác</div>
                    <p className="text-slate-400 text-[11px]">Xem 50 video 15s mỗi ngày, thả tim, comment nhận Xu đổi thẻ cào hoặc tiền mặt ATM.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-cyan-300 font-bold">2. Chia Sẻ Nhóm Bạn Bè</div>
                    <p className="text-slate-400 text-[11px]">Giới thiệu bạn cùng lớp đăng ký qua link Affiliate, nhận hoa hồng 25% trọn đời.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-purple-300 font-bold">3. Tham Gia Vòng Quay May Mắn</div>
                    <p className="text-slate-400 text-[11px]">Hoàn thành nhiệm vụ nhận lượt quay 100% trúng Xu và gói 50 Follow tăng uy tín nick cá nhân.</p>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'mom' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">🤱 Dành Cho Mẹ Bỉm Sữa &amp; Nội Trợ</h3>
                    <p className="text-xs text-slate-400">Ở nhà chăm con nhỏ vẫn chủ động tạo thu nhập mà không cần bỏ vốn</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Thu nhập mục tiêu:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">5.000.000đ - 20.000.000đ / tháng</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-pink-300 font-bold">1. Không Cần Vốn - Không Ôm Hàng</div>
                    <p className="text-slate-400 text-[11px]">Không lo nhập hàng tồn kho, không sợ lừa đảo. Mọi số Xu làm nhiệm vụ đều rút tiền thật về ngân hàng.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-amber-300 font-bold">2. Làm KOC Mẹ &amp; Bé</div>
                    <p className="text-slate-400 text-[11px]">Nhận bỉm, sữa, đồ gia dụng mẫu miễn phí gửi về tận nhà để quay review cho nhãn hàng.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-emerald-300 font-bold">3. Tiếp Thị Liên Kết Nhóm Bỉm</div>
                    <p className="text-slate-400 text-[11px]">Chia sẻ cơ hội kiếm tiền cho các mẹ bỉm khác cùng làm, tạo nguồn thu nhập thụ động ổn định.</p>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'office' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">💼 Dành Cho Dân Văn Phòng &amp; Công Sở</h3>
                    <p className="text-xs text-slate-400">Tận dụng giờ nghỉ trưa và buổi tối gia tăng thu nhập thứ hai an toàn</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Thu nhập mục tiêu:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">8.000.000đ - 25.000.000đ / tháng</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-cyan-300 font-bold">1. Kiếm Tiền Giờ Nghỉ Trưa</div>
                    <p className="text-slate-400 text-[11px]">Lướt các video nhiệm vụ và giữ mắt live TikTok trong 30-45 phút giờ nghỉ tạo thêm vài trăm ngàn mỗi ngày.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-indigo-300 font-bold">2. Xây Dựng Kênh TikTok Cá Nhân</div>
                    <p className="text-slate-400 text-[11px]">Dùng Xu nhận được để kéo follow người thật cho kênh cá nhân, xây dựng thương hiệu chuyên gia.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-amber-300 font-bold">3. Xây Mạng Lưới Đại Lý Affiliate</div>
                    <p className="text-slate-400 text-[11px]">Tận dụng mối quan hệ đối tác, kết nối chủ shop nạp chiến dịch để nhận hoa hồng 25% - 35% trọn đời.</p>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'koc' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">🎬 Dành Cho Content Creator &amp; KOC/KOL</h3>
                    <p className="text-xs text-slate-400">Nhận hàng trăm hợp đồng booking quay video, làm ảnh từ các nhãn hàng lớn</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Thu nhập mục tiêu:</span>
                    <div className="text-lg font-black text-emerald-400 font-mono">20.000.000đ - 100.000.000đ+ / tháng</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-purple-300 font-bold">1. Hợp Đồng Ký Quỹ Escrow 100%</div>
                    <p className="text-slate-400 text-[11px]">Tiền cọc của Brand được sàn khóa trung gian. Không bao giờ lo bị bùng tiền, quỵt công sức.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-rose-300 font-bold">2. Nhận Mẫu Sản Phẩm Free</div>
                    <p className="text-slate-400 text-[11px]">Hàng trăm Brand thời trang, mỹ phẩm, công nghệ gửi sản phẩm mẫu về tận nhà cho bạn trải nghiệm.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-amber-300 font-bold">3. Đẩy Video Lên Xu Hướng</div>
                    <p className="text-slate-400 text-[11px]">Sử dụng tệp người thật của sàn để kích nổ tương tác ban đầu, đưa video review lên top For You Page.</p>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'shop' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">🏪 Dành Cho Chủ Shop &amp; Nhà Bán Hàng TikTok Shop</h3>
                    <p className="text-xs text-slate-400">Bứt phá mắt xem livestream người thật đúng tệp, nổ đơn phiên live</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Mục tiêu tăng trưởng:</span>
                    <div className="text-lg font-black text-cyan-400 font-mono">X5 - X10 Doanh Số Bán Hàng</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-cyan-300 font-bold">1. Mắt Xem Live Người Thật</div>
                    <p className="text-slate-400 text-[11px]">Hàng ngàn người thật vào xem live, comment hỏi mua hàng, kích thích khách vãng lai chốt đơn thật rào rào.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-emerald-300 font-bold">2. Target Chuẩn Khách Tiềm Năng</div>
                    <p className="text-slate-400 text-[11px]">Target đúng độ tuổi, giới tính, sở thích phù hợp ngành hàng thời trang, mỹ phẩm, ăn uống, gia dụng.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-purple-300 font-bold">3. Xây Kênh Triệu View Bền Vững</div>
                    <p className="text-slate-400 text-[11px]">Tăng follow người thật không bao giờ tụt, đạt chuẩn mở tính năng TikTok Shop nhanh chóng.</p>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'enterprise' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white font-display">🏢 Dành Cho Doanh Nghiệp, Nhãn Hàng &amp; Startup</h3>
                    <p className="text-xs text-slate-400">Chiến dịch ra mắt sản phẩm mới (Product Launch) phủ sóng toàn mạng</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Hiệu quả ngân sách:</span>
                    <div className="text-lg font-black text-amber-400 font-mono">Tiết Kiệm 80% So Với Chạy Ads</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-amber-300 font-bold">1. Đội Ngũ KOC Đồng Loạt Lên Sóng</div>
                    <p className="text-slate-400 text-[11px]">Kết nối hàng trăm KOC review sản phẩm mới đồng loạt trong 72h, tạo hiệu ứng bùng nổ thương hiệu.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-purple-300 font-bold">2. Hợp Đồng Điện Tử 3 Bên Pháp Lý</div>
                    <p className="text-slate-400 text-[11px]">Điều khoản mẫu chuẩn hóa, khóa bảo vệ quyền lợi, phụ lục kịch bản riêng biệt, xuất hóa đơn VAT đầy đủ.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 space-y-1">
                    <div className="text-cyan-300 font-bold">3. Tối Ưu Hóa Chi Phí Chuyển Đổi</div>
                    <p className="text-slate-400 text-[11px]">Tương tác thật mang lại tỷ lệ chuyển đổi ROI thực tế cao gấp 5 lần so với đốt tiền vào quảng cáo thụ động.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom CTA for Audience section */}
            <div className="pt-2 text-center">
              <button
                onClick={openAuthModal}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-lg shadow-emerald-900/30 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>THAM GIA KIẾM TIỀN &amp; TĂNG TRƯỞNG NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BẢNG TÍNH THU NHẬP TƯƠNG TÁC THỜI GIAN THỰC (INTERACTIVE EARNING CALCULATOR) */}
      <section id="calculator" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase border border-emerald-500/30">
            📊 BẢNG TÍNH THU NHẬP MINH BẠCH 📊
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            Bạn Có Thể Kiếm Được Bao Nhiêu Tiền <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Mỗi Tháng Tại Nhà Với Chiếc Điện Thoại?
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Kéo các thanh trượt bên dưới để ước tính ngay thu nhập thực tế rút về tài khoản ngân hàng của bạn:
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0D111E] to-[#121729] border border-white/10 max-w-4xl mx-auto shadow-2xl space-y-8">
          
          <div className="space-y-6">
            
            {/* Slider 1: Nhiệm vụ xem video & tương tác hàng ngày */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>Số video xem &amp; tương tác mỗi ngày:</span>
                </span>
                <span className="text-rose-400 font-black text-sm bg-rose-500/15 px-3 py-1 rounded-xl border border-rose-500/30">
                  {dailyActions} nhiệm vụ / ngày
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={dailyActions}
                onChange={(e) => setDailyActions(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 nv (Dành cho người bận)</span>
                <span>75 nv (Trung bình)</span>
                <span>150 nv (Chuyên cần full-time)</span>
              </div>
            </div>

            {/* Slider 2: Số bạn bè tiếp thị liên kết (Affiliate) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>Số bạn bè giới thiệu tiếp thị liên kết:</span>
                </span>
                <span className="text-purple-400 font-black text-sm bg-purple-500/15 px-3 py-1 rounded-xl border border-purple-500/30">
                  {affiliateFriends} bạn bè
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={affiliateFriends}
                onChange={(e) => setAffiliateFriends(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 người</span>
                <span>25 người</span>
                <span>50 người (Hưởng hoa hồng 35%)</span>
              </div>
            </div>

            {/* Slider 3: Số hợp đồng KOC / Review sản phẩm nhận làm */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5 font-bold">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Số hợp đồng KOC review quay video/ảnh:</span>
                </span>
                <span className="text-amber-400 font-black text-sm bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-500/30">
                  {kocContracts} hợp đồng / tháng
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={kocContracts}
                onChange={(e) => setKocContracts(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 hợp đồng</span>
                <span>5 hợp đồng</span>
                <span>10 hợp đồng (Creator chuyên nghiệp)</span>
              </div>
            </div>

          </div>

          {/* Real-time Calculated Earnings Showcase */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-cyan-950/40 border-2 border-emerald-500/50 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                ƯỚC TÍNH THU NHẬP THỰC NHẬN CỦA BẠN
              </span>
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 font-mono tracking-tight">
                {calculatedIncome.totalMonthly.toLocaleString()} VNĐ
                <span className="text-xs sm:text-sm text-slate-400 font-normal ml-2">/ tháng</span>
              </div>
              <p className="text-xs text-emerald-300 font-mono">
                Tương đương khoảng <strong className="text-white">+{calculatedIncome.dailyEst.toLocaleString()}đ</strong> đều đặn mỗi ngày!
              </p>
            </div>

            {/* Income breakdown badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Từ Xem &amp; Tương Tác:</span>
                <span className="text-rose-300 font-bold">+{calculatedIncome.actionEarnings.toLocaleString()}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Từ Hoa Hồng Affiliate:</span>
                <span className="text-purple-300 font-bold">+{calculatedIncome.affiliateEarnings.toLocaleString()}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Từ Booking KOC Review:</span>
                <span className="text-amber-300 font-bold">+{calculatedIncome.kocEarnings.toLocaleString()}đ</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={openAuthModal}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs sm:text-sm font-display uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Nhận Tài Khoản &amp; Bắt Đầu Kiếm Số Tiền Này Ngay!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DÀNH CHO DOANH NGHIỆP: MẮT XEM LIVE ĐÚNG TỆP & PRODUCT LAUNCHING */}
      <section id="live-traffic" className="py-16 md:py-24 bg-gradient-to-b from-[#07090E] via-[#0D1020] to-[#07090E] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase border border-cyan-500/30">
              📡 ĐỘT PHÁ DOANH SỐ CHO NHÃN HÀNG 📡
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Giải Pháp Mắt Xem Livestream Người Thật <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Đúng Tệp Target &amp; Kích Nổ Đơn Hàng TikTok Shop
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn có sản phẩm chất lượng nhưng khi phát livestream chỉ có lẹt đẹt vài người xem? 
              Hệ thống của chúng tôi đưa ngay <strong>hàng ngàn người thật đúng tệp khách hàng</strong> vào phiên live của bạn:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-cyan-500/30 space-y-4 hover:border-cyan-400 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white font-display">
                Target Chuẩn Độ Tuổi &amp; Sở Thích
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Người xem live được lọc sẵn theo ngành hàng của shop: Thời trang Gen Z, Mỹ phẩm Skincare, Thực phẩm chức năng, Đồ gia dụng... Tạo sự tương đồng tối đa với chân dung khách hàng mua sắm.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D111E] border border-rose-500/30 space-y-4 hover:border-rose-400 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white font-display">
                Giữ Chân &amp; Hiệu Ứng Đám Đông Fomo
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hàng ngàn người thật vào xem liên tục từ 3-5 phút, thả tim triệu view, comment hỏi tư vấn size, hỏi giá giúp kích thích tâm lý đám đông để người xem vãng lai bấm chốt đơn ngay lập tức.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D111E] border border-amber-500/30 space-y-4 hover:border-amber-400 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white font-display">
                Kích Hoạt Thuật Toán Đề Xuất TikTok
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ thống nhận diện phiên live có chỉ số giữ chân (Retention) và tương tác cực mạnh, tự động phân phối phiên livestream của shop lên tab Thịnh Hành của hàng trăm ngàn người dùng khác.
              </p>
            </div>

          </div>

          {/* Launching Product Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950/40 border border-purple-500/30 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase">
                  🚀 KẾT NỐI KOC &amp; RA MẮT SẢN PHẨM MỚI
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Chi Phí Rẻ Hơn Thị Trường Rất Nhiều
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white font-display">
                Kết Nối Hàng Trăm KOC Lên Sóng Review Đồng Loạt — Đúng Tệp Khách Hàng Thật
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Trong nền tảng AVA FOLLOW chỉ toàn là con người thật có cùng đam mê kiếm tiền, thời gian và kiến thức. Đây chính là tệp khách hàng tiềm năng chuẩn xác của bạn. Không cần đốt tiền chạy ads ngoài đắt đỏ hay qua agency trung gian: Ký quỹ Smart Escrow an toàn 100%, bảo hành 3 ngày nghiệm thu, giá sàn gốc rẻ nhất thị trường.
              </p>
            </div>
            <button
              onClick={openAuthModal}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs font-mono uppercase tracking-wider shadow-xl shadow-purple-900/40 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              Kết Nối KOC &amp; Tạo Hợp Đồng Ngay
            </button>
          </div>
        </div>
      </section>

      {/* 8. TIẾP THỊ LIÊN KẾT (AFFILIATE) HOA HỒNG TỚI 35% */}
      <section id="affiliate" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-mono font-bold uppercase border border-yellow-500/30">
            👑 CHÍNH SÁCH ĐẠI LÝ TIẾP THỊ LIÊN KẾT 👑
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            Hưởng Hoa Hồng Cao Nhất Thị Trường <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-400">
              Lên Đến 35% Minh Bạch & Hấp Dẫn
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mỗi thành viên đều sở hữu một đường link chia sẻ độc quyền. Khi bạn bè hoặc doanh nghiệp nạp tiền tạo chiến dịch, bạn sẽ nhận được dòng tiền hoa hồng thụ động chảy thẳng vào ví mỗi ngày:
          </p>
        </div>

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            {
              rank: 'HẠNG ĐỒNG',
              rate: '15%',
              badge: 'Thành viên mới',
              sub: 'Dành cho mọi người',
              desc: 'Tự động mở khóa ngay khi đăng ký tài khoản. Hưởng 15% hoa hồng trên mọi giao dịch của bạn bè.',
              color: 'border-amber-700/40 bg-amber-950/20 text-amber-500'
            },
            {
              rank: 'HẠNG BẠC',
              rate: '20%',
              badge: 'Từ 10 bạn bè',
              sub: 'Thêm thưởng cấp bậc',
              desc: 'Mở khóa thêm slot nhiệm vụ ngày và hưởng 20% hoa hồng trực tiếp cho mỗi giao dịch nạp tiền.',
              color: 'border-slate-400/40 bg-slate-900/30 text-slate-300'
            },
            {
              rank: 'HẠNG VÀNG',
              rate: '28%',
              badge: 'Từ 30 bạn bè',
              sub: 'Đại lý khu vực VIP',
              desc: 'Hoa hồng 28% kèm quà tặng hiện vật, được ưu tiên duyệt lệnh rút tiền siêu tốc không mất phí.',
              color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-400'
            },
            {
              rank: 'HẠNG KIM CƯƠNG',
              rate: '35%',
              badge: 'Đối tác chiến lược',
              sub: 'Cấp bậc tối thượng',
              desc: 'Mức hoa hồng cao nhất toàn sàn: 35% bảo lưu an toàn trong ví! Quyền lợi phân phối nhượng quyền và đại lý độc quyền.',
              color: 'border-cyan-400/50 bg-cyan-950/30 text-cyan-300'
            },
          ].map((tier, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${tier.color} space-y-4 hover:scale-[1.03] transition-all flex flex-col justify-between`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono">{tier.rank}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-white">
                    {tier.badge}
                  </span>
                </div>
                <div className="text-4xl font-black font-mono text-white">
                  {tier.rate}
                  <span className="text-xs font-normal text-slate-400 ml-1">hoa hồng</span>
                </div>
                <div className="text-xs font-bold text-amber-300 font-mono">{tier.sub}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <button
                  onClick={openAuthModal}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono transition-colors"
                >
                  Đăng Ký Làm Đại Lý
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. LỘ TRÌNH MỞ RỘNG ĐA NỀN TẢNG (OMNICHANNEL MULTI-PLATFORM ROADMAP) */}
      <section id="roadmap" className="py-16 md:py-24 bg-gradient-to-b from-[#07090E] via-[#0A0D1A] to-[#07090E] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-blue-500/20 to-red-500/20 text-white text-xs font-mono font-bold uppercase border border-white/20">
              🚀 SIÊU HỆ SINH THÁI 3 TRONG 1: TIKTOK • FACEBOOK • YOUTUBE 🚀
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Đột Phá Doanh Thu &amp; Tăng Trưởng Toàn Diện: <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-blue-400 to-red-400">
                TikTok Shop, Fanpage Facebook &amp; Kênh YouTube Partner
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              AVA FOLLOW tích hợp trực tiếp 3 đại nền tảng mạng xã hội hàng đầu với 100% người dùng thật hoạt động hàng ngày, kích hoạt thuật toán đề xuất đa kênh:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0D111E] border-2 border-rose-500/60 space-y-4 relative overflow-hidden shadow-2xl shadow-rose-950/40 hover:border-rose-400 transition-all">
              <div className="absolute top-0 right-0 px-3 py-1 bg-rose-600 text-white text-[10px] font-mono font-black rounded-bl-xl shadow">
                ⚡ ĐANG HOẠT ĐỘNG
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black text-xl shadow-lg">
                🎵
              </div>
              <div>
                <h3 className="text-base font-black text-white font-display">TIKTOK &amp; TIKTOK SHOP</h3>
                <span className="text-[11px] font-mono text-rose-400 font-bold">Thuật Toán FYP &amp; Giỏ Hàng</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tăng Follow người thật không tụt mở TikTok Shop, mắt xem Livestream giữ chân 3-5 phút nổ đơn liên tục, đẩy video FYP xu hướng và Booking KOC Escrow bảo chứng.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Tốc độ: Siêu tốc 1-3p</span>
                <span className="text-rose-400 font-bold">100% User Thật</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D111E] border-2 border-blue-500/60 space-y-4 relative overflow-hidden shadow-2xl shadow-blue-950/40 hover:border-blue-400 transition-all">
              <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-mono font-black rounded-bl-xl shadow">
                ⚡ ĐANG HOẠT ĐỘNG
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-black text-xl shadow-lg">
                📘
              </div>
              <div>
                <h3 className="text-base font-black text-white font-display">FACEBOOK &amp; FANPAGE PRO</h3>
                <span className="text-[11px] font-mono text-blue-400 font-bold">Like Fanpage, Profile &amp; Reels</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tăng Like/Follow Fanpage chuẩn SEO doanh nghiệp, theo dõi trang cá nhân uy tín, cày View Reels 60s và giữ mắt Live Facebook kích thích khách chốt đơn inbox.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Nút bấm: Theo Dõi Fanpage</span>
                <span className="text-blue-400 font-bold">Chuẩn SEO 2026</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0D111E] border-2 border-red-500/60 space-y-4 relative overflow-hidden shadow-2xl shadow-red-950/40 hover:border-red-400 transition-all">
              <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[10px] font-mono font-black rounded-bl-xl shadow">
                ⚡ ĐANG HOẠT ĐỘNG
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-xl shadow-lg">
                🔴
              </div>
              <div>
                <h3 className="text-base font-black text-white font-display">YOUTUBE &amp; YPP PARTNER</h3>
                <span className="text-[11px] font-mono text-red-400 font-bold">Subscribers &amp; 4.000 Giờ Xem</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                1.000 Subscribers người thật chống tụt trọn đời, 4.000 giờ xem đạt chuẩn xét duyệt Bật Kiếm Tiền YouTube Partner, View Shorts &amp; Video 1080p retention cao.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Nút bấm: Đăng Ký Kênh</span>
                <span className="text-red-400 font-bold">Bật Kiếm Tiền YPP</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9B. KÊU GỌI HÀNH ĐỘNG GIA NHẬP CỘNG ĐỒNG CREATOR: AI ĐI TRƯỚC HƯỞNG QUYỀN LỢI TRƯỚC • TẶNG 5.000 XU ĐÔI */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#07090E] via-[#12081c] to-[#07090E] border-t border-white/10 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-r from-rose-600/20 via-amber-500/20 to-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-14">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-black uppercase tracking-wider shadow-lg animate-pulse">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>CƠ HỘI BÙNG NỔ • ĐẶC QUYỀN DÀNH CHO NGƯỜI ĐI TRƯỚC</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight font-display">
              Gia Nhập Cộng Đồng Creator Ngay Hôm Nay: <br />
              <span className="bg-gradient-to-r from-amber-300 via-rose-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                Ai Đi Trước Hưởng Quyền Lợi Trước!
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Đừng đứng ngoài nhìn người khác kéo view triệu người và tạo nguồn thu nhập khủng! 
              Càng tham gia sớm, kênh của bạn càng được <strong>ưu tiên phân phối lượt xem (view)</strong>, 
              <strong>kết nối follow chéo 100% người dùng thật</strong> và mở khóa các hợp đồng booking giá trị nhất.
            </p>
          </div>

          {/* Double 5.000 Xu Reward Box (Song Mã Đãi Ngộ 5.000 Xu + 5.000 Xu) */}
          <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c102b] via-[#101428] to-[#0a0d18] border-2 border-amber-400/60 shadow-[0_0_60px_rgba(245,158,11,0.25)] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase border border-amber-400/30 inline-flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-300" />
                <span>CHƯƠNG TRÌNH TRI ÂN WIN - WIN ĐỘC QUYỀN 2026</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                Đăng Ký Nhận Ngay 5.000 Xu • Người Được Giới Thiệu Cũng Nhận 5.000 Xu!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                Cả hai cùng nhận trọn vẹn số Xu này để lập tức <strong className="text-emerald-300">đặt đơn follow chéo</strong>, <strong className="text-cyan-300">kéo lượt xem video</strong> và <strong className="text-amber-300">xây kênh người thật</strong> mà không cần bỏ ra một đồng vốn!
              </p>
            </div>

            {/* 2 Symmetric Gift Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Box 1: Người Tham Gia */}
              <div className="p-6 rounded-2xl bg-black/40 border border-amber-400/40 relative space-y-3 hover:border-amber-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-black uppercase">
                    DÀNH CHO BẠN
                  </span>
                  <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                    +5.000 XU THƯỞNG
                  </div>
                  <div className="text-xs text-slate-300 font-bold">Kích hoạt ví tài khoản ngay lập tức</div>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-sans pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dùng đổi ngay <strong>50 lượt Follow người thật</strong> cho kênh của bạn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tặng kèm <strong>1 lượt Vòng Quay May Mắn</strong> tỷ lệ trúng 100%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kích hoạt quyền xem video đếm ngược nhận Xu rút về ATM</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Người Được Bạn Giới Thiệu */}
              <div className="p-6 rounded-2xl bg-black/40 border border-cyan-400/40 relative space-y-3 hover:border-cyan-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-black uppercase">
                    DÀNH CHO BẠN BÈ CỦA BẠN
                  </span>
                  <Users className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                    +5.000 XU SONG HÀNH
                  </div>
                  <div className="text-xs text-slate-300 font-bold">Bạn bè đăng ký cũng có vốn khởi nghiệp 0đ</div>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-sans pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Bạn bè nhận ngay <strong>5.000 Xu</strong> để bắt đầu xây dựng kênh</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Hai bạn có thể <strong>tương tác chéo, đẩy view chéo</strong> cho nhau</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Bạn nhận thêm <strong>hoa hồng đại lý lên đến 35%</strong> vào ví an toàn</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Scarcity / Early Bird Counter */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span>Số suất ưu tiên đặc quyền tiên phong hôm nay: <strong className="text-amber-300 text-sm">Chỉ còn 38 suất</strong></span>
              </div>
              <button
                onClick={openAuthModal}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:scale-105 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>NHẬN NGAY 5.000 XU &amp; GIA NHẬP CỘNG ĐỒNG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Showcase: 3 High Quality Community & Creator Photos */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                HÌNH ẢNH THỰC TẾ TỪ CỘNG ĐỒNG NHÀ SÁNG TẠO ĐANG HOẠT ĐỘNG
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0D111E] group relative shadow-2xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80" 
                    alt="Livestream TikTok Shop Triệu View" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D111E] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono font-black uppercase shadow-md flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE TRIỆU VIEW
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="text-base font-black text-white font-display">Xây Kênh Bứt Phá Lên Tab Xu Hướng (FYP)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nhờ lượng tương tác người thật ban đầu, video được thuật toán TikTok phân phối mạnh mẽ, tiếp cận hàng trăm ngàn khách hàng tiềm năng.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0D111E] group relative shadow-2xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" 
                    alt="Cộng Đồng Hợp Tác Kiếm Tiền" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D111E] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-black uppercase shadow-md flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    CỘNG ĐỒNG 168K+ THÀNH VIÊN
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="text-base font-black text-white font-display">Follow Chéo Người Thật • Không Sợ Tụt Hạng</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mạng lưới nhà sáng tạo chất lượng cao sẵn sàng hỗ trợ, tương tác và cùng nhau xây dựng kênh đạt tiêu chuẩn mở giỏ hàng TikTok Shop.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0D111E] group relative shadow-2xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80" 
                    alt="Kiếm Tiền Tại Nhà Với Điện Thoại" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D111E] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-600/90 text-white text-[10px] font-mono font-black uppercase shadow-md flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-300" />
                    RÚT TIỀN ATM TRONG 30 GIÂY
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="text-base font-black text-white font-display">Tạo Nguồn Thu Nhập Thực Tế Mỗi Ngày</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mọi lượt xem, like, comment, share hay đơn hàng giới thiệu đều tự động quy đổi thành tiền mặt minh bạch rút về mọi ngân hàng Việt Nam.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 4 Early Bird Privileges Cards */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                Tại Sao Bạn Phải Tham Gia NGAY BÂY GIỜ Mà Không Thể Chần Chừ?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#0D111E] border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  🥇
                </div>
                <h4 className="text-sm font-black text-white font-display">1. Ưu Tiên Phân Phối View</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kênh của các thành viên đăng ký sớm được thuật toán ưu tiên xếp vào danh sách nhiệm vụ xem hàng ngày của hơn 168.000 thành viên khác.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D111E] border border-rose-500/30 space-y-3 hover:border-rose-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                  🤝
                </div>
                <h4 className="text-sm font-black text-white font-display">2. Follow Chéo Tự Nhiên</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dễ dàng kết nối với các kênh chất lượng cao trong cùng ngành hàng, tạo độ uy tín vững chắc trước khi đăng video bán hàng.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D111E] border border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                  💎
                </div>
                <h4 className="text-sm font-black text-white font-display">3. Ưu Tiên Nhận Job KOC</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Được hệ thống gắn huy hiệu "Creator Tiên Phong", ưu tiên nhận các hợp đồng review trả phí 500k - 5M từ các chủ shop có cọc sẵn trong két Escrow.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D111E] border border-cyan-500/30 space-y-3 hover:border-cyan-400 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                  📚
                </div>
                <h4 className="text-sm font-black text-white font-display">4. Tặng Kho Kịch Bản Triệu View</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tặng miễn phí bộ 100+ mẫu kịch bản giữ chân người xem 3 giây đầu tiên và cẩm nang tránh vi phạm chính sách kiểm duyệt TikTok mới nhất.
                </p>
              </div>

            </div>
          </div>

          {/* Final Call to Action Strip */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FF0050] via-purple-700 to-[#00F2FE] text-white text-center space-y-4 shadow-2xl shadow-rose-900/40">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight">
              SẴN SÀNG ĐỔI MỚI KÊNH &amp; TẠO NGUỒN THU NHẬP NGAY HÔM NAY?
            </h3>
            <p className="text-xs sm:text-sm max-w-2xl mx-auto text-white/90 leading-relaxed">
              Mỗi giây phút bạn chần chừ là hàng ngàn lượt view và follow đang thuộc về đối thủ của bạn. Tham gia ngay để dẫn đầu xu thế!
            </p>
            <div className="pt-2">
              <button
                onClick={openAuthModal}
                className="px-10 py-4.5 rounded-2xl bg-slate-950 hover:bg-black text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-display inline-flex items-center gap-3 border border-white/20"
              >
                <Flame className="w-5 h-5 text-amber-400" />
                <span>BẤM VÀO ĐÂY ĐỂ ĐĂNG KÝ MIỄN PHÍ &amp; NHẬN 5.000 XU</span>
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 10. ĐÁNH GIÁ THỰC TẾ TỪ NGƯỜI THẬT (SOCIAL PROOF CASE STUDIES) */}
      <section id="feedback" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase border border-emerald-500/30">
            ⭐ NGƯỜI THẬT VIỆC THẬT ⭐
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            Cộng Đồng Nói Gì Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AVA FOLLOW</span>?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Hơn 168.000+ thành viên đã và đang tạo ra dòng tiền thật mỗi ngày:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" 
                alt="Phương KOC" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <div className="text-sm font-black text-white font-display">Đặng Mai Phương (@phuongbeauty)</div>
                <div className="text-xs text-amber-300 font-mono">KOC Mỹ Phẩm • Thu Nhập 48M/tháng</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Trước đây nhận booking của các shop nhỏ rất sợ bị bùng tiền cọc. Từ ngày có Két Ký Quỹ Escrow của sàn, mình hoàn toàn yên tâm sáng tạo video. Vừa quay xong nộp demo là tiền về ví ngay, hợp đồng 3 bên cực kỳ rõ ràng!"
            </p>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" 
                alt="Thanh Thảo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
              />
              <div>
                <div className="text-sm font-black text-white font-display">Nguyễn Thanh Thảo (Hà Nội)</div>
                <div className="text-xs text-cyan-300 font-mono">Mẹ Bỉm Sữa • Thu Nhập 14.5M/tháng</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Ở nhà chăm con nhỏ không đi làm được, nhờ nền tảng này mà mỗi tối rảnh rỗi mình lướt xem video và giới thiệu thêm vài mẹ bỉm khác. Tiền rút về Vietcombank chỉ mất 3 phút, đúng là cứu cánh tài chính cho gia đình mình!"
            </p>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" 
                alt="Trần Minh Vũ" 
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
              />
              <div>
                <div className="text-sm font-black text-white font-display">Trần Minh Vũ (ZenSkin Shop)</div>
                <div className="text-xs text-emerald-300 font-mono">Chủ Shop Thời Trang • 1.200 Đơn/Live</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Gói mắt xem livestream người thật của sàn quá đỉnh! Đúng tệp khách hỏi mua áo khoác và mỹ phẩm. Phiên live hôm qua từ lẹt đẹt 20 người nhảy vọt lên 1.800 người xem thật, nổ liền 1.200 đơn hàng TikTok Shop!"
            </p>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 11. BỘ CÂU HỎI THƯỜNG GẶP (FAQ CHỐT SALE) */}
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-[#07090E] via-[#090C17] to-[#07090E] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase border border-cyan-500/30">
              ❓ THẮC MẮC PHỔ BIẾN ❓
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Giải Đáp Mọi Thắc Mắc Của Bạn
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-[#0D111E] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-black text-white font-display">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-rose-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed font-mono border-t border-white/5 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. CHỐT SALE CUỐI TRANG - CALL TO ACTION BÙNG NỔ */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#07090E] via-[#14081E] to-[#07090E]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-rose-600/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>ĐỪNG ĐỂ THỜI GIAN LƯỚT ĐIỆN THOẠI TRÔI QUA LÃNG PHÍ!</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight font-display max-w-4xl mx-auto">
            Gia Nhập Ngay Hôm Nay Để Nhận{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0050] via-[#FF5E00] to-[#00F2FE]">
              +1.000 Xu Thưởng Chào Mừng
            </span>{' '}
            &amp; 1 Lượt Vòng Quay May Mắn!
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hàng trăm ngàn người đang biến những giây phút rảnh rỗi thành nguồn thu nhập hàng triệu đồng mỗi tuần. Bạn đã sẵn sàng thay đổi tương lai tài chính của mình?
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openAuthModal}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF0050] via-purple-600 to-[#00F2FE] hover:scale-105 active:scale-95 text-white font-black text-base uppercase tracking-wider shadow-2xl shadow-rose-600/50 flex items-center justify-center gap-3 transition-all cursor-pointer font-display"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>TẠO TÀI KHOẢN MIỄN PHÍ TRONG 30 GIÂY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Không Cần Vốn Ban Đầu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Rút Tiền Về Mọi Ngân Hàng VN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Hỗ Trợ Trực Tiếp 24/7 Qua Zalo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 13. LUXURY FOOTER */}
      <footer className="bg-[#05070B] border-t border-white/10 py-12 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <BrandLogo size="sm" showSubtitle={false} />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Siêu nền tảng công nghệ kết nối tương tác người dùng thật, phát triển kênh TikTok Shop và hệ sinh thái KOC Ký Quỹ Escrow hàng đầu Việt Nam.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase font-display">Dành Cho Người Dùng</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#ways-to-earn" className="hover:text-white transition-colors">Xem Video Kiếm Tiền</a></li>
              <li><a href="#ways-to-earn" className="hover:text-white transition-colors">Thả Tim &amp; Bình Luận Seeding</a></li>
              <li><a href="#affiliate" className="hover:text-white transition-colors">Tiếp Thị Liên Kết 35%</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Bảng Tính Thu Nhập Online</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase font-display">Dành Cho Doanh Nghiệp</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><a href="#live-traffic" className="hover:text-white transition-colors">Mắt Xem Livestream Người Thật</a></li>
              <li><a href="#live-traffic" className="hover:text-white transition-colors">Chiến Dịch Launching Sản Phẩm</a></li>
              <li><a href="#human-network" className="hover:text-white transition-colors">Ký Quỹ Smart Escrow 3 Bên</a></li>
              <li><a href="#human-network" className="hover:text-white transition-colors">Booking KOC Đã Xác Minh KYC</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase font-display">Hỗ Trợ &amp; Pháp Lý</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Hotline CSKH: 1900.8899</li>
              <li>Email: hotro@avafollow.vn</li>
              <li>Chính sách bảo mật &amp; Quyền riêng tư</li>
              <li>Điều khoản dịch vụ Sàn Ký Quỹ</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <div>© 2026 AVA FOLLOW Ecosystem. Toàn bộ quyền được bảo lưu. 100% Người Thật Tương Tác.</div>
          <div className="flex items-center gap-4">
            <span>Tiêu Chuẩn Thuật Toán TikTok 2026</span>
            <span>Bảo Mật SSL 256-Bit</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
