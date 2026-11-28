import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Coins, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Award, 
  ShieldCheck,
  DollarSign,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ExternalLink,
  Building2,
  CreditCard,
  User as UserIcon,
  ShoppingBag,
  MousePointerClick,
  Globe,
  ShoppingCart,
  Activity
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { AFFILIATE_TIER_LEVELS } from '../../data/mockData';
import { ScreenId } from '../../types';

const AFFILIATE_BANKS = [
  'MB Bank (Ngân Hàng Quân Đội)',
  'Vietcombank (Ngoại Thương Việt Nam)',
  'Techcombank (Kỹ Thương Việt Nam)',
  'VPBank (Việt Nam Thịnh Vượng)',
  'ACB (Á Châu)',
  'BIDV (Đầu Tư & Phát Triển)',
  'TPBank (Tiên Phong)',
  'VIB (Quốc Tế Việt Nam)',
  'Sacombank (Sài Gòn Thương Tín)',
  'Ví Điện Tử MoMo (Rút qua SĐT)'
];

export const AffiliateScreen: React.FC<{
  darkMode: boolean;
  onOpenWithdraw?: () => void;
  onNavigate?: (screen: ScreenId) => void;
}> = ({ darkMode, onNavigate }) => {
  const { 
    affiliateData, 
    openWithdraw, 
    showToast,
    updateCustomRefCode,
    saveBankInfo,
    user
  } = useTikTokApp();
  const [copied, setCopied] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [affBankName, setAffBankName] = useState(user.bankInfo?.bankName || 'MB Bank (Ngân Hàng Quân Đội)');
  const [affAccountNumber, setAffAccountNumber] = useState(user.bankInfo?.accountNumber || '');
  const [affAccountHolder, setAffAccountHolder] = useState(user.bankInfo?.accountHolder || (user.name || '').toUpperCase());
  const [bankSaved, setBankSaved] = useState(false);

  const availableAffVND = user.affiliateBalanceVND ?? (affiliateData.availableCommissionVND ?? 0);
  const MIN_AFF_WITHDRAW = 100000;

  const handleOpenAffiliateWithdraw = () => {
    try { localStorage.setItem('ava_withdraw_tab', 'affiliate'); } catch {}
    openWithdraw();
  };

  const handleSaveAffiliateBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affAccountNumber.trim() || !affAccountHolder.trim()) {
      showToast('⚠️ Vui lòng nhập đầy đủ số tài khoản và tên chủ tài khoản ngân hàng!');
      return;
    }
    saveBankInfo({
      bankName: affBankName,
      accountNumber: affAccountNumber.trim(),
      accountHolder: affAccountHolder.trim().toUpperCase()
    });
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
  };
  
  // Mã Ref gắn liền trực tiếp với tài khoản Gmail của từng người dùng
  const userGmailRef = user.email ? user.email.split('@')[0].toUpperCase().replace(/[^A-Z0-9_-]/g, '') : '';
  const effectiveRefCode = (affiliateData.refCode && affiliateData.refCode !== 'THIENVUAAPP88' && affiliateData.refCode !== 'AVA_VIP')
    ? affiliateData.refCode
    : (userGmailRef || 'AVA2026');

  const [customSlugInput, setCustomSlugInput] = useState(effectiveRefCode);

  const originUrl = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://avafollow.vn';

  const currentRefLink = `${originUrl}/?ref=${effectiveRefCode}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentRefLink);
    }
    setCopied(true);
    showToast(`✓ Đã sao chép link tiếp thị liên kết cá nhân (?ref=${effectiveRefCode})!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomSlug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlugInput.trim()) {
      showToast('⚠️ Vui lòng nhập tên đuôi link tiếp thị!');
      return;
    }
    const res = updateCustomRefCode(customSlugInput.trim());
    if (res.success) {
      setIsEditingSlug(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-[#0D111E] border border-amber-500/30 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 font-mono">
              <Gift className="h-3.5 w-3.5 text-amber-400" />
              <span>TẶNG 5,000 XU/BẠN MỚI • HOA HỒNG BÁN GÓI 20% - 35%</span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-3xl font-black text-white font-display">
                Trung Tâm Tiếp Thị Liên Kết &amp; Cấp Bậc Hoa Hồng (Affiliate Hub)
              </h2>
              <FeatureGuideTooltip
                title="Hướng Dẫn Tiếp Thị Liên Kết & Hoa Hồng Bảo Trợ"
                description="Hệ thống tiếp thị liên kết 2 nguồn thu nhập: Tặng Xu giới thiệu (+5.000 Xu/bạn khi hoàn thành nhiệm vụ đầu) và Hoa hồng bán gói 20% - 35% theo cấp bậc."
                badge="LƯU COOKIE 30 NGÀY"
                steps={[
                  'Bước 1: Sao chép đường link giới thiệu cá nhân có chứa mã ref của bạn.',
                  'Bước 2: Gửi cho bạn bè qua Zalo, Facebook, TikTok hoặc Telegram.',
                  'Bước 3: Bạn bè đăng ký và kết nối tài khoản nhận ngay +5.000 Xu quà chào mừng.',
                  'Bước 4: Khi bạn bè hoàn thành nhiệm vụ đầu tiên, bạn nhận ngay +5.000 Xu tri ân.',
                  'Bước 5: Khi bạn bè mua bất kỳ gói dịch vụ nào, bạn nhận 20% - 35% hoa hồng tiền mặt rút ATM.'
                ]}
                tips="Cookie được lưu trữ 30 ngày trên trình duyệt của người dùng, đảm bảo bạn không bị mất quyền lợi bảo trợ."
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Hai nguồn thu nhập minh bạch: <strong>Tặng Xu giới thiệu (+5,000 Xu/bạn)</strong> khi bạn bè đăng ký và hoàn thành 1 nhiệm vụ xác thực, cùng <strong>Hoa hồng tiền mặt 20% - 35% theo quy mô cộng đồng</strong> cho các đơn hàng của thành viên trong hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAffiliateWithdraw}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition-all font-mono cursor-pointer active:scale-95"
            >
              💰 Rút Hoa Hồng (Min 100K)
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition-all font-mono flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Dùng Hoa Hồng Mua Gói</span>
              </button>
            )}
          </div>
        </div>

        {/* KHỐI TỔNG QUAN PHỄU TIẾP THỊ LIÊN KẾT REALTIME (CLICK • VÀO WEB • ĐĂNG KÝ • GIỎ HÀNG • MUA GÓI • SỐ DƯ KHẢ DỤNG) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/40 space-y-0.5 col-span-2 sm:col-span-3 lg:col-span-2">
            <span className="text-[10px] text-amber-300 font-mono font-bold uppercase">Số Dư Hoa Hồng Khả Dụng</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {availableAffVND.toLocaleString()}đ
            </div>
            <div className="text-[10px] text-emerald-300 font-mono">
              Min rút: 100.000đ • Trả 10:00 Sáng Thứ Hai • Mua được mọi gói
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <MousePointerClick className="w-3 h-3 text-cyan-400" /> Click Link
            </span>
            <div className="text-lg font-black text-cyan-400 font-mono">{(affiliateData.totalClicks || 0).toLocaleString()}</div>
            <span className="text-[9px] text-slate-500 font-mono">Bấm link ref</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-400" /> Vào Web
            </span>
            <div className="text-lg font-black text-blue-400 font-mono">{(affiliateData.totalVisits ?? affiliateData.totalClicks ?? 0).toLocaleString()}</div>
            <span className="text-[9px] text-slate-500 font-mono">Truy cập trang</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShoppingCart className="w-3 h-3 text-pink-400" /> Giỏ Hàng
            </span>
            <div className="text-lg font-black text-pink-400 font-mono">{(affiliateData.totalCartAdds || 0).toLocaleString()}</div>
            <span className="text-[9px] text-slate-500 font-mono">Thêm mua gói</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/45 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-emerald-400" /> Đơn Mua
            </span>
            <div className="text-lg font-black text-emerald-400 font-mono">{(affiliateData.totalPurchases || 0).toLocaleString()}</div>
            <span className="text-[9px] text-slate-500 font-mono">Đăng ký: {affiliateData.totalSignups}</span>
          </div>
        </div>

        {/* Ref Link Bar */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate flex-1 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-slate-400 font-mono shrink-0">Link ref của bạn:</span>
              <span className="font-mono text-amber-400 font-bold truncate select-all">{currentRefLink}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCustomSlugInput(affiliateData.refCode || '');
                  setIsEditingSlug(!isEditingSlug);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold shrink-0 transition-all font-mono cursor-pointer border border-white/10"
                title="Đổi tên đuôi link giới thiệu theo ý muốn"
              >
                <span>{isEditingSlug ? 'Đóng' : '✏️ Đổi Đuôi Link'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold shrink-0 transition-all font-mono cursor-pointer border border-amber-500/30"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Đã sao chép link' : 'Sao chép link ref'}</span>
              </button>
            </div>
          </div>

          {/* Form chỉnh sửa tên đuôi link tiếp thị */}
          {isEditingSlug && (
            <form onSubmit={handleSaveCustomSlug} className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 font-mono uppercase flex items-center gap-1.5">
                  <span>⚙️ TÙY CHỈNH ĐUÔI LINK TIẾP THỊ LIÊN KẾT:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Tự động gắn mã bảo lưu 30 ngày</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">?ref=</span>
                  <input
                    type="text"
                    value={customSlugInput}
                    onChange={(e) => setCustomSlugInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                    placeholder="VD: THIENVUA, KINGAPP, MMO2026..."
                    maxLength={25}
                    className="w-full bg-black/60 border border-white/20 rounded-xl pl-14 pr-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400 tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs font-mono transition-all shadow-md cursor-pointer"
                >
                  Lưu Đuôi Link
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                * Tên đuôi chỉ chứa chữ cái và số (3 - 25 ký tự). Khi bạn bè click vào link này, hệ thống sẽ lưu mã giới thiệu trong 30 ngày và tự động đồng bộ khi họ đăng ký &amp; mua gói.
              </p>
            </form>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thời hạn lưu Cookie: <strong>30 Ngày</strong> (30-day retention)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hoa hồng bán gói: <strong>20% - 35%</strong> (Áp dụng 1 lần duy nhất / người)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Thành viên F1: <strong>+5,000 Xu</strong> chào mừng khi đăng ký</span>
            </span>
          </div>
        </div>
      </div>

      {/* KHỐI 1: CHƯƠNG TRÌNH TẶNG XU GIỚI THIỆU BẠN BÈ (+5,000 XU) */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-amber-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider">
                1. Quỹ Xu Tặng Giới Thiệu Bạn Bè (Không Giới Hạn)
              </h3>
              <span className="text-xs text-amber-300 font-mono">
                Cơ chế Win - Win: Người mời nhận +5,000 Xu • Người được mời nhận +5,000 Xu
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Chống Bot / Spam 100%
            </span>
          </div>
        </div>

        {/* Explainer Steps */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-white font-display flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quy Trình Nhận Thưởng 5,000 Xu Chống Gian Lận:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-amber-400 font-bold block">Bước 1: Gửi Link Ref</span>
              <p className="text-slate-400">Bạn bè bấm vào link ref và tạo tài khoản liên kết kênh TikTok thật.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-amber-400 font-bold block">Bước 2: Bạn Bè Làm 1 Nhiệm Vụ</span>
              <p className="text-slate-400">Xem video 15s, follow 1 kênh, hoặc xem live để xác minh tài khoản hoạt động thật.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-emerald-400 font-bold block">Bước 3: Cả Hai Nhận 5,000 Xu</span>
              <p className="text-slate-400">Hệ thống cộng ngay +5,000 Xu vào ví khả dụng để rút tiền ATM hoặc chạy follow!</p>
            </div>
          </div>
        </div>

        {/* 4 Referral Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Tổng Xu Thưởng Đã Nhận</span>
            <div className="text-2xl font-black text-neonGold font-mono font-mono-numbers">
              {affiliateData.referralBonusCoinsTotal.toLocaleString()} Xu
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">Đã cộng vào ví khả dụng</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Số Bạn Đã Kích Hoạt (Người Thật)</span>
            <div className="text-2xl font-black text-emerald-400 font-mono font-mono-numbers">
              {affiliateData.referralActivatedCount} Người
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Đã hoàn thành 1 nhiệm vụ</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Xu Đang Chờ Kích Hoạt</span>
            <div className="text-2xl font-black text-slate-400 font-mono font-mono-numbers">
              {affiliateData.referralPendingCoins.toLocaleString()} Xu
            </div>
            <p className="text-[10px] text-amber-300 font-mono">Tạm giữ chờ bạn làm nhiệm vụ</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Số Bạn Đang Chờ Làm NV</span>
            <div className="text-2xl font-black text-amber-400 font-mono font-mono-numbers">
              {affiliateData.referralPendingCount} Người
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Chưa hoàn thành nhiệm vụ đầu</p>
          </div>
        </div>
      </div>

      {/* KHỐI 2: CHƯƠNG TRÌNH ĐẠI LÝ TIẾP THỊ BÁN GÓI (20% - 35% HOA HỒNG VNĐ) */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-purple-500/30 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider">
                2. Quỹ Hoa Hồng Mua Gói Theo Cấp Bậc (20% - 35%)
              </h3>
              <span className="text-xs text-purple-300 font-mono">
                Hạch toán bằng Tiền Mặt VNĐ • Rút tiền 10:00 Sáng Thứ Hai hàng tuần
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Cấp Bậc Hiện Tại: HẠNG {affiliateData.tier.toUpperCase()} ({affiliateData.commissionRate})
          </span>
        </div>

        {/* BẢNG CHÍNH SÁCH CẤP BẬC HOA HỒNG THEO QUY MÔ CỘNG ĐỒNG */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Bảng Chính Sách Cấp Bậc Hoa Hồng (Thấp nhất 20% - Cao nhất 35%)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Tự động nâng hạng theo số F1</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AFFILIATE_TIER_LEVELS.map((tier) => {
              const isCurrent = affiliateData.tier.toLowerCase() === tier.tierId || 
                                (tier.tierId === 'diamond' && affiliateData.tier === 'Kim Cương') ||
                                (tier.tierId === 'gold' && affiliateData.tier === 'Vàng') ||
                                (tier.tierId === 'silver' && affiliateData.tier === 'Bạc');
              return (
                <div 
                  key={tier.tierId} 
                  className={`p-4 rounded-2xl border transition-all space-y-2 relative overflow-hidden ${
                    isCurrent 
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/40' 
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.2 rounded text-[8px] font-black font-mono bg-purple-600 text-white uppercase">
                      ĐANG ÁP DỤNG
                    </div>
                  )}
                  <div className="font-bold text-white text-xs font-display flex items-center gap-1.5">
                    <span>{tier.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-neonGold">{tier.ratePercent}%</span>
                    <span className="text-[10px] text-slate-400 font-mono">hoa hồng đơn đầu</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Quy mô: <strong className="text-emerald-400">{tier.minMembers} - {tier.maxMembers >= 999999 ? 'Không giới hạn' : tier.maxMembers} F1</strong>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIÊU CHUẨN AN TOÀN, BẢO MẬT & CHỐNG SPAM */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-black border border-emerald-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-300 uppercase font-mono tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TIÊU CHUẨN BẢO MẬT, CHỐNG SPAM &amp; PHÁT TRIỂN HỆ THỐNG BỀN VỮNG</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-[11px] pt-1">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">1. Xác Thực Người Thật:</span>
              <p className="text-slate-400">Yêu cầu hoàn thành tối thiểu 1 nhiệm vụ hợp lệ để kích hoạt tài khoản, ngăn chặn triệt để nick ảo và công cụ tự động.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">2. Cập Nhật Hồ Sơ Chính Chủ:</span>
              <p className="text-slate-400">Thành viên cần cập nhật đầy đủ dữ liệu tài khoản TikTok và thông tin đối soát để bảo đảm quyền lợi khi nhận thưởng.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">3. Giãn Cách An Toàn Thuật Toán:</span>
              <p className="text-slate-400">Thuật toán điều phối lưu lượng tự nhiên giúp bảo vệ 100% tài khoản đối tác không bị đánh dấu spam trên TikTok.</p>
            </div>
          </div>
        </div>

        {/* 4 Commission Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Tổng Hoa Hồng Đã Nhận</span>
            <div className="text-2xl font-black text-neonGold font-mono font-mono-numbers">
              {affiliateData.totalCommissionVND}
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">Đã thanh toán đối soát 100%</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Hoa Hồng Tháng Này</span>
            <div className="text-2xl font-black text-white font-mono font-mono-numbers">
              {affiliateData.monthlyCommission}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Giải ngân 10:00 Sáng Thứ Hai</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Số Lượt Click Link Ref</span>
            <div className="text-2xl font-black text-cyan-400 font-mono font-mono-numbers">
              {affiliateData.totalClicks.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Tỷ lệ chuyển đổi: 12.5%</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Tổng Thành Viên F1</span>
            <div className="text-2xl font-black text-purple-400 font-mono font-mono-numbers">
              {affiliateData.totalSignups} Người
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Cấp Kim Cương (35% đơn đầu)</p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BẠN BÈ TUYẾN DƯỚI & HOA HỒNG PHÁT SINH */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Danh Sách Bạn Bè Được Giới Thiệu &amp; Trạng Thái Xác Thực (1 Nhiệm Vụ)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Chiết khấu tự động</span>
        </div>

        <div className="divide-y divide-white/5">
          {affiliateData.referralsList.map((ref) => (
            <div key={ref.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={ref.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ref.username}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({ref.tiktokHandle || '@tiktok_user'})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Tham gia: {ref.joinedDate} • {ref.packageSpentVND && ref.packageSpentVND !== '0đ' ? `Đã mua gói: ${ref.packageSpentVND}` : 'Chưa mua gói'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 font-mono">
                <div>
                  {ref.hasCompletedTask ? (
                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Đã Xác Thực</span>
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{ref.taskCompletedType}</span>
                    </div>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                      <span>Chờ hoàn thành 1 nhiệm vụ</span>
                    </span>
                  )}
                </div>

                <div className="text-right min-w-[90px]">
                  <div className="text-[10px] text-slate-400">Hoa hồng:</div>
                  <div className="font-mono font-black text-emerald-400 text-sm">
                    {ref.earnedVND}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI 3: TÀI KHOẢN NGÂN HÀNG NHẬN HOA HỒNG TIẾP THỊ LIÊN KẾT (ĐỒNG BỘ SUPABASE & ADMIN) */}
      <form
        onSubmit={handleSaveAffiliateBank}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/35 via-[#0D111E] to-black border border-emerald-500/35 space-y-4 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase font-display tracking-wide">
                Tài Khoản Ngân Hàng Nhận Chính Sách Hoa Hồng
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Tự động thanh toán vào <strong className="text-amber-300">10:00 Sáng Thứ Hai hàng tuần</strong> • Mức rút tối thiểu <strong className="text-emerald-300">100.000đ</strong>
              </p>
            </div>
          </div>
          {bankSaved && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
              ✓ Đã lưu &amp; đồng bộ Admin
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ngân hàng / Ví MoMo</span>
            </label>
            <select
              value={affBankName}
              onChange={(e) => setAffBankName(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
            >
              {AFFILIATE_BANKS.map(b => (
                <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Số tài khoản / SĐT MoMo</span>
            </label>
            <input
              type="text"
              value={affAccountNumber}
              onChange={(e) => setAffAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản nhận tiền..."
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tên chủ tài khoản</span>
            </label>
            <input
              type="text"
              value={affAccountHolder}
              onChange={(e) => setAffAccountHolder(e.target.value.toUpperCase())}
              placeholder="VD: NGUYEN VAN A"
              className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-400 font-mono">
            * Số tiền hoa hồng ({availableAffVND.toLocaleString()}đ) có thể rút về ngân hàng (từ {MIN_AFF_WITHDRAW.toLocaleString()}đ) hoặc dùng trực tiếp để mua bất kỳ gói dịch vụ nào.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase font-mono shadow-lg cursor-pointer active:scale-95 shrink-0"
          >
            💾 Lưu Tài Khoản Ngân Hàng
          </button>
        </div>
      </form>

      {/* KHỐI 4: NHẬT KÝ SỰ KIỆN TIẾP THỊ LIÊN KẾT REALTIME (CLICK • VÀO WEB • ĐĂNG KÝ • GIỎ HÀNG • MUA GÓI) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0D111E] border border-cyan-500/25 space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Nhật Ký Hoạt Động Tiếp Thị Liên Kết (Đồng Bộ Admin &amp; Supabase)</span>
          </h3>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-mono font-bold border border-cyan-500/30">
            {(affiliateData.eventsLog || []).length} Sự Kiện
          </span>
        </div>

        {(!affiliateData.eventsLog || affiliateData.eventsLog.length === 0) ? (
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-400 font-mono">
            Mọi lượt click link, vào trang web, đăng ký, thêm giỏ hàng và mua gói qua link <strong className="text-amber-300">?ref={effectiveRefCode}</strong> sẽ hiển thị chi tiết ngay tại đây theo thời gian thực.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(affiliateData.eventsLog || []).slice(0, 30).map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl bg-black/45 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      evt.type === 'purchase'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : evt.type === 'add_to_cart'
                          ? 'bg-pink-500/20 text-pink-300'
                          : evt.type === 'signup'
                            ? 'bg-purple-500/20 text-purple-300'
                            : evt.type === 'withdraw_commission' || evt.type === 'spend_commission'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {evt.type === 'click' ? 'CLICK LINK' : evt.type === 'visit' ? 'VÀO TRANG WEB' : evt.type === 'signup' ? 'ĐĂNG KÝ' : evt.type === 'add_to_cart' ? 'THÊM GIỎ HÀNG' : evt.type === 'purchase' ? 'MUA GÓI' : evt.type === 'spend_commission' ? 'DÙNG HOA HỒNG MUA GÓI' : 'RÚT HOA HỒNG'}
                    </span>
                    <span className="text-white font-bold">{evt.actorName}</span>
                    {evt.commissionVND ? (
                      <span className="text-emerald-400 font-black">+{evt.commissionVND.toLocaleString()}đ</span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-slate-300">{evt.note}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
