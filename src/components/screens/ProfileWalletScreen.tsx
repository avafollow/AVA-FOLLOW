import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  QrCode, 
  Building2, 
  CreditCard, 
  Sparkles, 
  BookOpen,
  ShoppingBag,
  Clock,
  Award,
  Layers,
  Users,
  Cpu,
  Video,
  Key,
  ExternalLink,
  Lock,
  Unlock,
  MessageSquare,
  Gift,
  Copy,
  Check,
  Radio,
  Play,
  Heart,
  Share2,
  FileText,
  Search,
  FileCheck,
  Star,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { EscrowContractModal } from '../modals/EscrowContractModal';
import { ContractCompletionTimeline } from '../common/ContractCompletionTimeline';
import { EscrowExtensionModal } from '../modals/EscrowExtensionModal';
import { EscrowReviewModal } from '../modals/EscrowReviewModal';
import { EscrowIncidentModal } from '../modals/EscrowIncidentModal';
import { EscrowChatModal } from '../modals/EscrowChatModal';
import { EscrowBookingContract } from '../../types';

export const ProfileWalletScreen: React.FC<{
  darkMode: boolean;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
}> = ({ darkMode }) => {
  const { 
    user, 
    openDeposit, 
    openWithdraw, 
    openConnect, 
    openPolicy,
    saveBankInfo,
    affiliateData,
    myAppLicenses,
    escrowBookings,
    openBuyerPortal,
    openSubmitDemoModal,
    claimReferralReward,
    simulateFriendTaskAction,
    showToast,
    getActivityReport,
    userCompletedActions,
    tasks,
    requestContractExtension,
    respondToContractExtension,
    approveEscrowWithReview,
    freezeEscrowContract,
    requestVideoRevision,
    requestRefundEscrow,
    acceptEscrowBooking
  } = useTikTokApp();

  const [bankName, setBankName] = useState(user.bankInfo?.bankName || 'MB Bank (Ngân Hàng Quân Đội)');
  const [accountNumber, setAccountNumber] = useState(user.bankInfo?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(user.bankInfo?.accountHolder || user.name.toUpperCase());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'kyc_profile' | 'packages' | 'software' | 'escrow' | 'affiliate' | 'transactions' | 'bank' | 'activity'>('kyc_profile');
  const [activityPeriod, setActivityPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);

  const handleCopyContractLink = (contract: EscrowBookingContract) => {
    const url = `https://avalive.vn/escrow/${contract.contractCode}`;
    navigator.clipboard.writeText(url);
    setCopiedContractId(contract.id);
    showToast(`Đã sao chép link hợp đồng ${contract.contractCode}: ${url}`);
    setTimeout(() => setCopiedContractId(null), 2500);
  };

  // Escrow Contracts View Modal & Filters state
  const [viewingContract, setViewingContract] = useState<EscrowBookingContract | null>(null);
  const [escrowFilterTab, setEscrowFilterTab] = useState<'all' | 'in_progress' | 'demo_submitted' | 'disbursed' | 'escrow_locked'>('all');
  const [escrowSearchTerm, setEscrowSearchTerm] = useState('');

  // Escrow Advanced Dialogs: Extension, Review, Incident & Permanent Chat
  const [extensionModalContract, setExtensionModalContract] = useState<EscrowBookingContract | null>(null);
  const [extensionModalMode, setExtensionModalMode] = useState<'request' | 'respond'>('request');
  const [reviewModalContract, setReviewModalContract] = useState<EscrowBookingContract | null>(null);
  const [incidentModalContract, setIncidentModalContract] = useState<EscrowBookingContract | null>(null);
  const [chatModalContract, setChatModalContract] = useState<EscrowBookingContract | null>(null);

  // KYC & Personal Info state
  const [kycFullName, setKycFullName] = useState(user.name || '');
  const [kycEmail, setKycEmail] = useState(user.email || '');
  const [kycPhone, setKycPhone] = useState('');
  const [kycDob, setKycDob] = useState('');
  const [kycGender, setKycGender] = useState<'male' | 'female' | 'other'>('male');
  const [kycProvince, setKycProvince] = useState('');
  const [kycDistrict, setKycDistrict] = useState('');
  const [kycJob, setKycJob] = useState('');
  const [kycBio, setKycBio] = useState('');
  const [kycBioLink, setKycBioLink] = useState('');
  const [kycTiktokUrl, setKycTiktokUrl] = useState(
    user.tiktokProfileUrl || `https://www.tiktok.com/${(user.tiktokConnected || '@creator').startsWith('@') ? user.tiktokConnected : '@' + user.tiktokConnected}`
  );
  const [kycSaved, setKycSaved] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'unsubmitted'>('unsubmitted');

  // Media Album state (stored locally)
  const [albumImages, setAlbumImages] = useState<Array<{ id: string; url: string; name: string; type: 'image' | 'video' }>>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar);

  const handleKycSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycFullName || !kycEmail || !kycDob || !kycProvince || !kycJob) {
      showToast('⚠️ Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    setKycSaved(true);
    setKycStatus('pending');
    showToast('✅ Đã gửi thông tin KYC! Hệ thống sẽ xác minh trong 24h.');
    setTimeout(() => setKycSaved(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('⚠️ Chỉ hỗ trợ tải ảnh lên'); return; }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    showToast('✅ Đã cập nhật ảnh đại diện');
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems = Array.from(files).map(file => ({
      id: `media_${Date.now()}_${Math.random()}`,
      url: URL.createObjectURL(file),
      name: file.name,
      type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video',
    }));
    setAlbumImages(prev => [...prev, ...newItems]);
    showToast(`✅ Đã thêm ${newItems.length} file vào album công việc (lưu trên máy bạn)`);
  };

  const handleCopyKey = (key: string) => {
    if (navigator.clipboard) navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast(`Đã sao chép License Key: ${key}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyRef = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(affiliateData.refLink);
    setCopiedRef(true);
    showToast('Đã sao chép link tiếp thị liên kết vào bộ nhớ tạm!');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    saveBankInfo({
      bankName,
      accountNumber,
      accountHolder
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner: User Profile Header + Wallet Balance */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D111E] border border-white/10 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-rose-500 shrink-0"
              />
              {user.isTikTokVerified && (
                <div className="absolute -bottom-1 -right-1 p-1 bg-cyan-500 rounded-full text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Hạng {user.rankLevel}
                </span>
                <button
                  onClick={openPolicy}
                  className="text-[10px] text-amber-400 hover:underline font-mono flex items-center gap-1"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Quyền lợi cấp bậc</span>
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">
                  Kênh TikTok: <strong className="text-rose-400">{user.tiktokConnected || '@chưa_kết_nối'}</strong>
                </span>
                <a
                  href={kycTiktokUrl.startsWith('http') ? kycTiktokUrl : `https://${kycTiktokUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-[10px] text-rose-300 font-mono border border-rose-500/30 transition-colors"
                  title="Mở kênh TikTok"
                >
                  <span>Mở TikTok</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button
                  onClick={openConnect}
                  className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 font-mono"
                >
                  {user.isTikTokVerified ? 'Đổi kênh' : 'Kết nối (+1k Xu)'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openDeposit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 font-mono transition-all flex items-center gap-1.5"
            >
              <QrCode className="h-4 w-4" />
              <span>Nạp Tiền VietQR</span>
            </button>
            <button
              onClick={openWithdraw}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs border border-white/10 transition-all font-mono flex items-center gap-1.5"
            >
              <CreditCard className="h-4 w-4" />
              <span>Rút Về ATM</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Số Dư Xu Hiện Có</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {user.avaliveCoins.toLocaleString()} Xu
            </div>
            <p className="text-[10px] text-slate-400 font-mono">≈ {user.coinsValueVND}</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Nhiệm Vụ Đã Làm</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {user.completedTasksCount} Hoàn thành
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Hôm nay: +{user.dailyTasksCompleted} nhiệm vụ</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Kênh TikTok Tăng Trưởng</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {user.tiktokFollowers.toLocaleString()} Follow
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Đạt chuẩn đề xuất FYP</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs — lưới ô vuông 2 cột */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* 0 — KYC & Hồ Sơ */}
        <button
          onClick={() => setActiveProfileTab('kyc_profile')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'kyc_profile'
              ? 'bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <User className="w-5 h-5 shrink-0 text-rose-400" />
          <span className="text-center leading-tight text-[10px]">Hồ Sơ & KYC</span>
          {kycStatus === 'verified' && <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">✓ XÁC MINH</span>}
          {kycStatus === 'pending' && <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono">Đang xét</span>}
          {kycStatus === 'unsubmitted' && <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono">Cần cập nhật</span>}
        </button>

        {/* 1 */}
        <button
          onClick={() => setActiveProfileTab('packages')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'packages'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <ShoppingBag className="w-5 h-5 shrink-0" />
          <span className="text-center leading-tight text-[10px]">Gói Đang Chạy</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-mono">{user.myOrders?.length || 2}</span>
        </button>

        {/* 2 */}
        <button
          onClick={() => setActiveProfileTab('software')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'software'
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Cpu className="w-5 h-5 shrink-0 text-cyan-400" />
          <span className="text-center leading-tight text-[10px]">Phần Mềm AI</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">MỞ KHÓA</span>
        </button>

        {/* 3 */}
        <button
          onClick={() => setActiveProfileTab('escrow')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'escrow'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Video className="w-5 h-5 shrink-0 text-pink-400" />
          <span className="text-center leading-tight text-[10px]">Hợp Đồng KOC</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-mono">{escrowBookings.length}</span>
        </button>

        {/* 4 */}
        <button
          onClick={() => setActiveProfileTab('affiliate')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'affiliate'
              ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Gift className="w-5 h-5 shrink-0 text-amber-300" />
          <span className="text-center leading-tight text-[10px]">Giới Thiệu & Hoa Hồng</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono">+5,000 Xu</span>
        </button>

        {/* 5 */}
        <button
          onClick={() => setActiveProfileTab('transactions')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'transactions'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Wallet className="w-5 h-5 shrink-0" />
          <span className="text-center leading-tight text-[10px]">Lịch Sử Giao Dịch</span>
        </button>

        {/* 6 */}
        <button
          onClick={() => setActiveProfileTab('bank')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'bank'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Building2 className="w-5 h-5 shrink-0" />
          <span className="text-center leading-tight text-[10px]">Tài Khoản Rút Tiền</span>
        </button>

        {/* 7 */}
        <button
          onClick={() => setActiveProfileTab('activity')}
          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl font-bold transition-all aspect-square sm:aspect-auto sm:py-3 ${
            activeProfileTab === 'activity'
              ? 'bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
          }`}
        >
          <Award className="w-5 h-5 shrink-0 text-yellow-300" />
          <span className="text-center leading-tight text-[10px]">Báo Cáo Hoạt Động</span>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono">NEW</span>
        </button>
      </div>


      {/* TAB 0: HỒ SƠ CÁ NHÂN & KYC XÁC MINH */}
      {activeProfileTab === 'kyc_profile' && (
        <div className="space-y-5 animate-in fade-in duration-200">

          {/* KYC status banner */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            kycStatus === 'verified'    ? 'bg-emerald-950/30 border-emerald-500/40' :
            kycStatus === 'pending'     ? 'bg-amber-950/30  border-amber-500/40' :
                                          'bg-rose-950/30   border-rose-500/40'
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg ${
              kycStatus === 'verified' ? 'bg-emerald-500/20' : kycStatus === 'pending' ? 'bg-amber-500/20' : 'bg-rose-500/20'
            }`}>
              {kycStatus === 'verified' ? '✅' : kycStatus === 'pending' ? '⏳' : '⚠️'}
            </div>
            <div>
              <div className={`text-xs font-black font-mono ${
                kycStatus === 'verified' ? 'text-emerald-400' : kycStatus === 'pending' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {kycStatus === 'verified' ? '✓ TÀI KHOẢN ĐÃ XÁC MINH KYC' :
                 kycStatus === 'pending'  ? '⏳ ĐANG CHỜ XÁC MINH (24H)' :
                                            '⚠️ CẦN CẬP NHẬT THÔNG TIN KYC ĐỂ THAM GIA'}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {kycStatus === 'verified' ? 'Bạn đã xác minh đầy đủ, có thể đăng ký KOL/KOC và rút tiền không giới hạn.' :
                 kycStatus === 'pending'  ? 'Thông tin đang được đội ngũ xét duyệt. Kết quả trong 24h.' :
                                            'Điền đầy đủ thông tin bên dưới và gửi KYC để mở khóa toàn bộ tính năng.'}
              </p>
            </div>
          </div>

          {/* Avatar + Cover upload */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-rose-400" /> Ảnh Đại Diện & Hồ Sơ Công Khai
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img src={avatarPreview} alt="" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-rose-500" />
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-rose-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-500 transition-all shadow-md">
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div>
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{user.email || 'Chưa có email Gmail'}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-rose-400 font-mono">{user.tiktokConnected || '@chưa kết nối'}</span>
                    <a 
                      href={kycTiktokUrl.startsWith('http') ? kycTiktokUrl : `https://${kycTiktokUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 font-mono underline flex items-center gap-1 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{kycTiktokUrl}</span>
                    </a>
                  </div>
                </div>
                {kycBioLink && (
                  <a href={kycBioLink.startsWith('http') ? kycBioLink : `https://${kycBioLink}`} target="_blank" rel="noreferrer"
                     className="text-[10px] text-amber-400 font-mono underline flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {kycBioLink}
                  </a>
                )}
                {kycBio && <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-2">{kycBio}</p>}
              </div>
            </div>
          </div>

          {/* KYC Form */}
          <form onSubmit={handleKycSave} className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Cập Nhật Thông Tin Cá Nhân (KYC)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Họ tên */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Họ & Tên <span className="text-rose-400">*</span></label>
                <input type="text" value={kycFullName} onChange={e => setKycFullName(e.target.value)} required
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Email (Gmail) <span className="text-rose-400">*</span></label>
                <input type="email" value={kycEmail} onChange={e => setKycEmail(e.target.value)} required
                  placeholder="example@gmail.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>

              {/* SĐT */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Số Điện Thoại</label>
                <input type="tel" value={kycPhone} onChange={e => setKycPhone(e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>

              {/* Ngày sinh & Tuổi */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 font-mono font-bold">Ngày Sinh & Tuổi <span className="text-rose-400">*</span></label>
                  {kycDob && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {Math.max(0, new Date().getFullYear() - new Date(kycDob).getFullYear())} tuổi
                    </span>
                  )}
                </div>
                <input type="date" value={kycDob} onChange={e => setKycDob(e.target.value)} required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>

              {/* Giới tính */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Giới Tính <span className="text-rose-400">*</span></label>
                <select value={kycGender} onChange={e => setKycGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Nghề nghiệp */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Nghề Nghiệp / Công Việc <span className="text-rose-400">*</span></label>
                <select value={kycJob} onChange={e => setKycJob(e.target.value)} required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
                >
                  <option value="">-- Chọn nghề nghiệp --</option>
                  <option>Content Creator / KOL / KOC</option>
                  <option>Reviewer Sản Phẩm TikTok Shop</option>
                  <option>Livestreamer Bán Hàng</option>
                  <option>Học sinh / Sinh viên</option>
                  <option>Nhân viên văn phòng</option>
                  <option>Freelancer / Tự kinh doanh</option>
                  <option>Chủ shop / Doanh nghiệp</option>
                  <option>Nhân viên sale / Marketing</option>
                  <option>Khác</option>
                </select>
              </div>

              {/* Tỉnh/Thành */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Tỉnh / Thành Phố Đang Sống <span className="text-rose-400">*</span></label>
                <input type="text" value={kycProvince} onChange={e => setKycProvince(e.target.value)} required
                  placeholder="Hồ Chí Minh / Hà Nội / Đà Nẵng..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>

              {/* Quận/Huyện */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Quận / Huyện / Thị Xã</label>
                <input type="text" value={kycDistrict} onChange={e => setKycDistrict(e.target.value)}
                  placeholder="Quận 1 / Huyện Bình Chánh..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Bio & Link */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono font-bold">Giới Thiệu Bản Thân (Bio Giới Thiệu Với Đối Tác & Nhãn Hàng)</label>
                <textarea value={kycBio} onChange={e => setKycBio(e.target.value)} rows={3}
                  placeholder="Mô tả phong cách, thế mạnh review (mỹ phẩm, công nghệ, ẩm thực...), lượng tương tác kênh để đối tác doanh nghiệp dễ dàng booking..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono resize-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 font-mono font-bold">Tạo Link Bio Kết Nối Đối Tác</label>
                  <button
                    type="button"
                    onClick={() => {
                      const autoBio = `avalive.vn/bio/${(user.tiktokConnected || user.name || 'creator').replace('@', '').toLowerCase().replace(/\s+/g, '_')}`;
                      setKycBioLink(autoBio);
                      showToast('✅ Đã tạo link Bio đối tác tự động!');
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-mono font-bold cursor-pointer"
                  >
                    ⚡ Tự động tạo link Bio
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={kycBioLink} onChange={e => setKycBioLink(e.target.value)}
                    placeholder="linktr.ee/username hoặc avalive.vn/bio/your_name"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                  />
                  {kycBioLink && (
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) navigator.clipboard.writeText(kycBioLink);
                        showToast('Đã sao chép link Bio vào bộ nhớ tạm!');
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-mono"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>

              {/* Đường link TikTok */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 font-mono font-bold">Đường Link Kênh TikTok Cá Nhân</label>
                  <a
                    href={kycTiktokUrl.startsWith('http') ? kycTiktokUrl : `https://${kycTiktokUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1"
                  >
                    <span>Mở Kênh Thử Nghiệm</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={kycTiktokUrl}
                    onChange={e => setKycTiktokUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@your_channel"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) navigator.clipboard.writeText(kycTiktokUrl);
                      showToast('Đã sao chép đường link TikTok!');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-mono"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit"
                className={`flex-1 py-3 rounded-2xl font-black text-sm font-mono transition-all ${
                  kycSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-rose-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-rose-600/20 cursor-pointer'
                }`}
              >
                {kycSaved ? '✅ Đã Lưu Thông Tin KYC Thành Công!' : '📋 Cập Nhật Thông Tin KYC'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!kycFullName || !kycProvince) {
                    showToast('⚠️ Vui lòng cập nhật đầy đủ họ tên và nơi sống trước khi đăng ký');
                    return;
                  }
                  showToast('🎉 Đã nộp đơn đăng ký KOL/KOC Đối Tác! Hồ sơ của bạn đã được đưa lên sàn Kết Nối KOC.');
                }}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:opacity-90 text-white font-black text-sm font-mono transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Đăng Ký Làm KOL / KOC Đối Tác</span>
              </button>
            </div>
          </form>

          {/* Album Công Việc */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Album Công Việc (Ảnh & Video)
              </h3>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold cursor-pointer hover:bg-purple-600/40 transition-all flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Tải Ảnh / Video Lên
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
                </label>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-mono">
              📁 Nội dung lưu trên máy bạn (local). Dùng để showcase portfolio khi đăng ký KOL/KOC với đối tác.
            </p>

            {albumImages.length === 0 ? (
              <label className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-purple-500/50 transition-all group">
                <Layers className="w-8 h-8 text-slate-600 group-hover:text-purple-400 transition-colors mb-2" />
                <span className="text-xs text-slate-500 font-mono">Nhấn để tải ảnh / video lên album công việc</span>
                <span className="text-[10px] text-slate-600 font-mono mt-1">Hỗ trợ JPG, PNG, MP4, MOV</span>
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
              </label>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {albumImages.map(item => (
                  <div key={item.id} className="relative rounded-2xl overflow-hidden aspect-square bg-black/40 border border-white/10 group">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                      <span className="text-[9px] text-white font-mono text-center px-1 line-clamp-2">{item.name}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">{item.type === 'video' ? '🎬 Video' : '🖼️ Ảnh'}</span>
                    </div>
                    <button
                      onClick={() => setAlbumImages(prev => prev.filter(m => m.id !== item.id))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white text-[10px] font-bold"
                    >×</button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-white/10 cursor-pointer hover:border-purple-500/50 transition-all text-slate-600 hover:text-purple-400">
                  <span className="text-2xl">+</span>
                  <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaUpload} />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: Gói đã mua & Tiến độ trả gói */}
      {activeProfileTab === 'packages' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>Tiến Độ Trả Gói Tự Động Từ Sàn Về Kênh TikTok Của Bạn</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bảo hành giữ chân 60 ngày không lo tụt follow/view/mắt xem. 100% người dùng thật từ cộng đồng.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openBuyerPortal}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-90 font-display"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Kích Hoạt Live (Dành Cho Chủ Shop)</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Live streaming package */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black text-white font-display">Gói 500 Mắt Xem Live 2 Tiếng Chốt Đơn Đỉnh Cao</span>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 font-mono">ĐANG PHÁT LIVE</span>
                  </div>
                  <div className="text-[11px] text-rose-300 font-mono mt-0.5">Phòng live: {user.tiktokConnected}/live • Mục tiêu: 500 mắt</div>
                </div>
                <div className="text-right font-mono">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Đã Giao: 340 / 500 Mắt (68%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 h-full w-[68%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>❤️ Thả tim: 4,250 / 5,000</span>
                <span>💬 Comment: 186 / 200</span>
                <span className="text-emerald-400">● 100% Người Thật Lướt Live</span>
              </div>
            </div>

            {/* Follow package */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-xs font-bold text-white">Gói 1,000 Follower Mở Khóa TikTok Shop</span>
                  <div className="text-[11px] text-cyan-400 font-mono">Kênh nhận: {user.tiktokConnected || '@kenh_chinh'}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    Đang Trả Gói: 820 / 1,000 Follow (82%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full w-[82%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Bảo hành chống tụt: 60 ngày</span>
                <span className="text-emerald-400">Tự động bù follow nếu tụt</span>
              </div>
            </div>

            {/* Dynamic Orders from purchaseServicePackage */}
            {user.myOrders && user.myOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-900/80 border border-purple-800/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-white">{ord.packageTitle}</span>
                    <div className="text-[11px] text-cyan-400 font-mono">Kênh/Video: {ord.targetUrl}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                      Đang Trả Gói: {ord.completedQuantity || 0} / {ord.targetQuantity.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[25%] animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Đã chuyển thành công sang hàng đợi nhiệm vụ cho cộng đồng lướt video thực hiện.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bản quyền Phần mềm AI đã mua (Mở khóa toàn bộ) */}
      {activeProfileTab === 'software' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300 mb-1">
                <Unlock className="w-3 h-3 text-emerald-400" />
                <span>TẤT CẢ PHẦN MỀM ĐÃ ĐƯỢC MỞ KHÓA TOÀN BỘ BẢN QUYỀN TRỌN ĐỜI</span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Kho Phần Mềm &amp; Công Cụ AI Xây Kênh Của Bạn ({myAppLicenses.length})</span>
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Kích hoạt vĩnh viễn</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {myAppLicenses.map((lic) => (
              <div key={lic.id} className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 relative overflow-hidden group hover:border-cyan-400 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors font-display">
                        {lic.appTitle}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Ngày mua: {lic.purchasedAt} • {lic.expiryDate}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ĐÃ MỞ KHÓA
                  </span>
                </div>

                {/* License Key box */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-[9px] text-slate-400 font-mono">License Key Kích Hoạt:</div>
                    <span className="font-mono font-black text-neonGold text-xs tracking-wider truncate block">
                      {lic.licenseKey}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyKey(lic.licenseKey)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
                    title="Sao chép mã bản quyền"
                  >
                    {copiedKey === lic.licenseKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={lic.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-900/30"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Công Cụ Ngay</span>
                  </a>
                  <button
                    onClick={() => showToast(`Hướng dẫn sử dụng ${lic.appTitle} đã được gửi vào hòm thư tài khoản!`)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-mono transition-colors"
                  >
                    Tài Liệu Hướng Dẫn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Hợp đồng Ký quỹ Escrow Booking (Brand ↔ KOC ↔ Sàn 20%) */}
      {activeProfileTab === 'escrow' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0b101f] to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KÉT SÀN ESCROW BẢO VỆ 100% TIỀN CỌC • BẢO HÀNH 3 NGÀY (72H) ĐỐI SOÁT</span>
                </div>
                <h3 className="text-base font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span>Quản Lý Hợp Đồng Điện Tử Booking KOC &amp; Ký Quỹ Sàn ({escrowBookings.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Bảo hộ quyền lợi 3 bên minh bạch: Bên Thuê (Brand) an toàn 100% tiền vốn • KOC nhận 80% thù lao sau 72h nghiệm thu • Sàn giữ 20% phí bảo chứng &amp; trọng tài trực tuyến.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-amber-400 font-mono font-bold block">Tỷ Lệ Pháp Lý: KOC 80% • Sàn 20%</span>
                <span className="text-[10px] text-cyan-300 font-mono">Bảo mật chữ ký số điện tử SHA-256</span>
              </div>
            </div>

            {/* Filter Tabs & Search Box */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: `Tất Cả (${escrowBookings.length})` },
                  { id: 'in_progress', label: `Đang Sản Xuất (${escrowBookings.filter(b => b.status === 'in_progress').length})` },
                  { id: 'demo_submitted', label: `Bảo Hành 72H (${escrowBookings.filter(b => b.status === 'demo_submitted').length})` },
                  { id: 'disbursed', label: `Đã Hoàn Thành (${escrowBookings.filter(b => b.status === 'disbursed').length})` },
                  { id: 'escrow_locked', label: `Chờ KOC (${escrowBookings.filter(b => b.status === 'escrow_locked').length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setEscrowFilterTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                      escrowFilterTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo mã HĐ, KOC, tên sản phẩm..."
                  value={escrowSearchTerm}
                  onChange={(e) => setEscrowSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Contracts List */}
          <div className="space-y-4 pt-1">
            {(() => {
              const filteredList = escrowBookings.filter(contract => {
                if (escrowFilterTab !== 'all' && contract.status !== escrowFilterTab) return false;
                if (escrowSearchTerm.trim()) {
                  const q = escrowSearchTerm.toLowerCase();
                  return (
                    contract.contractCode.toLowerCase().includes(q) ||
                    contract.title.toLowerCase().includes(q) ||
                    contract.kocHandle.toLowerCase().includes(q) ||
                    contract.kocName.toLowerCase().includes(q) ||
                    contract.productName.toLowerCase().includes(q) ||
                    contract.clientName.toLowerCase().includes(q)
                  );
                }
                return true;
              });

              if (filteredList.length === 0) {
                return (
                  <div className="p-10 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
                    <Video className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">Không tìm thấy hợp đồng nào phù hợp bộ lọc</p>
                    <p className="text-xs text-slate-500 font-mono">Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc "Tất Cả".</p>
                  </div>
                );
              }

              return filteredList.map((contract) => {
                const rawAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, ''), 10) || 0;
                const kocReceive = Math.round(rawAmount * 0.8);
                const sànFee = Math.round(rawAmount * 0.2);

                return (
                  <div 
                    key={contract.id} 
                    className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 hover:border-purple-500/50 transition-all shadow-xl relative overflow-hidden group"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-amber-400 text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            {contract.contractCode}
                          </span>
                          <span className="text-sm font-black text-white font-display">{contract.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                            {contract.creatorType === 'ai' ? '🤖 AI Video Creator' : '👤 KOC Người Thật'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                            {contract.videoDuration || '3 Phút'} • {contract.videoQuantity} Video
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-3">
                          <span>Bên Thuê: <strong className="text-white">{contract.clientName}</strong></span>
                          <span>•</span>
                          <span>KOC: <strong className="text-emerald-400">{contract.kocName} ({contract.kocHandle})</strong></span>
                          <span>•</span>
                          <span>Sản phẩm: <strong className="text-slate-300">{contract.productName}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                          contract.status === 'disbursed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : contract.status === 'demo_submitted'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse'
                            : contract.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {contract.status === 'disbursed'
                            ? '✓ Đã Hoàn Thành (Giải Ngân)'
                            : contract.status === 'demo_submitted'
                            ? '🛡️ Bảo Hành Nghiệm Thu 72H'
                            : contract.status === 'in_progress'
                            ? '⏳ KOC Đang Sản Xuất'
                            : '🔒 Đã Khóa Cọc Trong Két'}
                        </span>
                      </div>
                    </div>

                    {/* Financial Details Box (3 Parties Split: Vault 100%, KOC 80%, Platform 20%) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/5 text-xs font-mono">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[10px]">🔒 Tiền Ký Quỹ Sàn Khóa (100%):</span>
                        <strong className="text-amber-400 font-mono-numbers text-sm">{contract.totalEscrowAmount}</strong>
                        <span className="text-[10px] text-slate-500 block">Két an toàn Smart Vault</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[10px]">💵 KOC Thực Nhận (80% Thù Lao):</span>
                        <strong className="text-emerald-400 font-mono-numbers text-sm">{kocReceive.toLocaleString('vi-VN')}đ</strong>
                        <span className="text-[10px] text-emerald-500/80 block">Tự động chuyển sau 72h nghiệm thu</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-slate-400 block text-[10px]">🛡️ Phí Sàn Bảo Chứng (20% Dịch Vụ):</span>
                        <strong className="text-purple-300 font-mono-numbers text-sm">{sànFee.toLocaleString('vi-VN')}đ</strong>
                        <span className="text-[10px] text-purple-400/80 block">Bảo hiểm cọc &amp; trọng tài minh bạch</span>
                      </div>
                    </div>

                    {/* THANH THÔNG BÁO THỜI GIAN HOÀN THÀNH CHO TỪNG HỢP ĐỒNG (COMPLETION TIMELINE & PROGRESS) */}
                    <ContractCompletionTimeline 
                      contract={contract} 
                      onOpenExtensionModal={(c) => {
                        setExtensionModalContract(c);
                        setExtensionModalMode(c.extensionStatus === 'pending' ? 'respond' : 'request');
                      }}
                      onOpenIncidentModal={(c) => setIncidentModalContract(c)}
                    />

                    {/* Demo link, SHA-256 seal & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300 text-[10px]">
                          SHA256: {contract.contractCode.replace(/[^A-Za-z0-9]/g, '')}-VERIFIED
                        </span>
                        <span className="hidden md:inline text-slate-500">•</span>
                        <span className="hidden md:inline text-slate-400 text-[10px]">
                          Lịch sử hợp đồng &amp; hội thoại lưu vĩnh viễn không được xóa
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Nút Xem Lại File Hợp Đồng Điện Tử Đầy Đủ */}
                        <button
                          onClick={() => setViewingContract(contract)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-900/20 cursor-pointer font-display"
                          title="Bấm vào để kiểm tra toàn bộ nội dung hợp đồng pháp lý, điều khoản 3 bên, chữ ký số điện tử và xuất PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-300" />
                          <span>Xem Lại Hợp Đồng</span>
                          <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-[9px] font-mono font-bold">
                            3 Bên
                          </span>
                        </button>

                        {/* Nút Sao Chép Link Hợp Đồng Trực Tiếp */}
                        <button
                          onClick={() => handleCopyContractLink(contract)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer font-display ${
                            copiedContractId === contract.id
                              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                              : 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border-indigo-500/30'
                          }`}
                          title="Sao chép link chia sẻ hợp đồng trực tuyến cho đối tác"
                        >
                          {copiedContractId === contract.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Đã Copy Link!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Sao Chép Link HĐ</span>
                            </>
                          )}
                        </button>

                        {/* Nếu KOC đang xin gia hạn -> Bên Thuê bấm phản hồi */}
                        {contract.extensionStatus === 'pending' && (
                          <button
                            onClick={() => {
                              setExtensionModalContract(contract);
                              setExtensionModalMode('respond');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow-md shadow-amber-900/30 font-display cursor-pointer animate-pulse"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Phản Hồi Gia Hạn (+{contract.extensionDays}N)</span>
                          </button>
                        )}

                        {/* Nếu đang sản xuất -> KOC có thể xin gia hạn nếu gặp sự cố */}
                        {contract.status === 'in_progress' && contract.extensionStatus !== 'pending' && (
                          <button
                            onClick={() => {
                              setExtensionModalContract(contract);
                              setExtensionModalMode('request');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1 font-display cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Xin Gia Hạn</span>
                          </button>
                        )}

                        {/* Nếu đã nộp demo -> Bên Thuê có nút Nghiệm Thu & Đánh Giá sao (Giải ngân 80%) */}
                        {contract.status === 'demo_submitted' && (
                          <button
                            onClick={() => setReviewModalContract(contract)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-900/30 flex items-center gap-1.5 font-display cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Nghiệm Thu &amp; Đánh Giá (80%)</span>
                          </button>
                        )}

                        {/* Xử lý sự cố / Niêm phong / Hoàn tiền */}
                        {contract.status !== 'disbursed' && (
                          <button
                            onClick={() => setIncidentModalContract(contract)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1 font-display cursor-pointer"
                            title="Xử lý sự cố, yêu cầu sửa kịch bản, niêm phong cọc hoặc hoàn tiền"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Sự Cố &amp; Hoàn Cọc</span>
                          </button>
                        )}

                        {/* Demo Link button if available */}
                        {contract.demoVideoUrl && (
                          <a
                            href={contract.demoVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs transition-colors flex items-center gap-1.5 font-display"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Xem Video Demo</span>
                          </a>
                        )}

                        {/* Trao Đổi Đối Tác (Lưu trữ vĩnh viễn) */}
                        <button
                          onClick={() => setChatModalContract(contract)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs transition-colors flex items-center gap-1.5 font-display cursor-pointer"
                          title="Mở nhật ký đối thoại lưu trữ vĩnh viễn không thể xóa"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                          <span>Trao Đổi Đối Tác</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: Tiếp thị liên kết & Giới thiệu bạn bè (TÁCH BIỆT XU vs HOA HỒNG VNĐ) */}
      {activeProfileTab === 'affiliate' && (
        <div className="space-y-5">
          {/* Top Banner with Ref link */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-[#0D111E] border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>TẶNG 5,000 XU CHO MỖI BẠN KÍCH HOẠT • HOA HỒNG BÁN GÓI 25% TRỌN ĐỜI</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  Chương Trình Giới Thiệu Bạn Bè &amp; Tiếp Thị Đại Lý
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  <strong>Cơ chế Win - Win chống spam</strong>: Bạn chia sẻ link $\rightarrow$ Bạn bè đăng ký và <strong>làm 1 nhiệm vụ bất kỳ</strong> (xác thực người dùng thật) $\rightarrow$ Cả hai cùng nhận ngay <strong>+5,000 Xu</strong>! Nếu bạn bè mua gói dịch vụ, bạn hưởng thêm <strong>25% hoa hồng tiền mặt ghi nhận bảo lưu an toàn trong ví</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openWithdraw}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md hover:opacity-90 font-mono transition-all"
                >
                  Rút Hoa Hồng Về ATM
                </button>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 truncate w-full">
                <span className="text-slate-400 font-mono shrink-0">Link ref của bạn:</span>
                <span className="font-mono text-amber-400 font-bold truncate">{affiliateData.refLink}</span>
              </div>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold shrink-0 transition-all font-mono"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRef ? 'Đã sao chép link' : 'Sao chép link ref'}</span>
              </button>
            </div>
          </div>

          {/* 2 SEPARATED STREAMS: XU TẶNG GIỚI THIỆU vs HOA HỒNG MUA GÓI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* STREAM 1: Quỹ Xu Giới Thiệu Bạn Bè */}
            <div className="p-5 rounded-3xl bg-[#0D111E] border border-amber-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase font-mono">1. Quỹ Xu Tặng Giới Thiệu</h4>
                    <span className="text-[10px] text-amber-300 font-mono">+5,000 Xu / bạn kích hoạt</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 font-mono">
                  KHÔNG GIỚI HẠN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Xu Đã Nhận (Ví Khả Dụng):</span>
                  <div className="text-xl font-black text-amber-400 font-mono font-mono-numbers mt-0.5">
                    {affiliateData.referralBonusCoinsTotal.toLocaleString()} Xu
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {affiliateData.referralActivatedCount} bạn đã kích hoạt
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Xu Chờ Kích Hoạt (Tạm Giữ):</span>
                  <div className="text-xl font-black text-slate-400 font-mono font-mono-numbers mt-0.5">
                    {affiliateData.referralPendingCoins.toLocaleString()} Xu
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {affiliateData.referralPendingCount} bạn chưa làm nhiệm vụ
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                💡 Cứ mỗi bạn bè vào xem 1 video hoặc follow 1 kênh là cả hai cùng nhận ngay 5,000 Xu (tương đương 5,000đ rút ATM).
              </p>
            </div>

            {/* STREAM 2: Quỹ Hoa Hồng Mua Gói (20% - 35% VNĐ) */}
            <div className="p-5 rounded-3xl bg-[#0D111E] border border-purple-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase font-mono">2. Quỹ Hoa Hồng Mua Gói</h4>
                    <span className="text-[10px] text-purple-300 font-mono">20% - 35% cho đơn hàng của cấp dưới</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 font-mono">
                  HẠNG {affiliateData.tier.toUpperCase()} ({affiliateData.commissionRate})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Tổng Hoa Hồng Đã Nhận:</span>
                  <div className="text-xl font-black text-emerald-400 font-mono font-mono-numbers mt-0.5">
                    {affiliateData.totalCommissionVND}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Giải ngân Thứ Hai 10:00 AM</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono block">Doanh Số Tháng Này:</span>
                  <div className="text-xl font-black text-white font-mono font-mono-numbers mt-0.5">
                    {affiliateData.monthlyCommission}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">Chiết khấu tức thì</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                💰 Nhận hoa hồng 20% - 35% cho đơn nạp hoặc kích hoạt gói dịch vụ của thành viên F1 được ghi nhận thành công.
              </p>
            </div>

          </div>

          {/* Referral Friends List Table */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Danh Sách Bạn Bè Được Giới Thiệu &amp; Trạng Thái Xác Thực Chống Spam</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Tự động đối soát</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Bạn Bè Tuyến Dưới</th>
                    <th className="p-2.5">Ngày Đăng Ký</th>
                    <th className="p-2.5">Trạng Thái Xác Thực (1 Nhiệm Vụ)</th>
                    <th className="p-2.5 text-center">Xu Tặng (+5k)</th>
                    <th className="p-2.5 text-right">Hoa Hồng Đơn Hàng (25%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {affiliateData.referralsList.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/[0.02]">
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <img src={ref.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{ref.username}</span>
                            <span className="text-[10px] text-slate-400">{ref.tiktokHandle || '@tiktok_user'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-400 text-[11px]">{ref.joinedDate}</td>
                      <td className="p-2.5">
                        {ref.hasCompletedTask ? (
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Đã Xác Thực Người Thật</span>
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{ref.taskCompletedType}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                              <span>Chờ làm 1 nhiệm vụ</span>
                            </span>
                            {/* Simulation test button */}
                            <button
                              onClick={() => simulateFriendTaskAction(ref.id)}
                              className="px-2 py-0.5 rounded bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-bold transition-all"
                              title="Bấm để mô phỏng bạn bè vừa vào làm nhiệm vụ xem video 15s để nhận +5,000 Xu ngay"
                            >
                              Mô phỏng làm nv
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        {ref.hasCompletedTask ? (
                          <span className="font-bold text-amber-400 font-mono-numbers">+5,000 Xu</span>
                        ) : (
                          <span className="text-slate-500 font-mono-numbers">Chờ (+5,000 Xu)</span>
                        )}
                      </td>
                      <td className="p-2.5 font-bold text-emerald-400 text-right font-mono-numbers">
                        {ref.earnedVND}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Lịch sử biến động số dư */}
      {activeProfileTab === 'transactions' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Wallet className="h-4 w-4 text-rose-500" />
              <span>Biến Động Số Dư & Lịch Sử Giao Dịch</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Tự động cập nhật</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {user.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    tx.isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    {tx.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-white leading-snug">{tx.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {tx.date} {tx.method ? `• ${tx.method}` : ''}
                    </div>
                  </div>
                </div>

                <div className={`font-mono font-black text-sm shrink-0 ${
                  tx.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Tài Khoản Rút Tiền */}
      {activeProfileTab === 'bank' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl max-w-xl">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Tài Khoản Ngân Hàng Thụ Hưởng
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống Napas247 tự động chuyển tiền thưởng vào tài khoản này khi bạn bấm rút Xu.
          </p>

          <form onSubmit={handleSaveBank} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">Ngân Hàng / Ví</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: MB Bank, Vietcombank, Techcombank"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">Số Tài Khoản</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Nhập số tài khoản ngân hàng..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase font-bold">Tên Chủ Tài Khoản (Không dấu)</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN A"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            {saveSuccess && (
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
                Đã lưu thông tin ngân hàng thành công!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all font-mono"
            >
              Lưu Thông Tin Ngân Hàng
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: BÁO CÁO HOẠT ĐỘNG & THU NHẬP (NGÀY, TUẦN, THÁNG) */}
      {activeProfileTab === 'activity' && (() => {
        const report = getActivityReport(activityPeriod);
        const actionHistoryList = Object.values(userCompletedActions);

        return (
          <div className="space-y-6">
            {/* Header & Period Switcher */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono mb-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>ĐỐI SOÁT & MINH BẠCH 100%</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Báo Cáo Hoạt Động & Thu Nhập Chi Tiết
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Thống kê chuẩn xác số lượng video đã xem, follow, tim, comment, share và tổng Xu đã nhận vào ví.
                  </p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 shrink-0">
                  <button
                    onClick={() => setActivityPeriod('day')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activityPeriod === 'day'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hôm Nay (24h)
                  </button>
                  <button
                    onClick={() => setActivityPeriod('week')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activityPeriod === 'week'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tuần Này (7 Ngày)
                  </button>
                  <button
                    onClick={() => setActivityPeriod('month')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activityPeriod === 'month'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tháng Này (30 Ngày)
                  </button>
                </div>
              </div>

              {/* 6 Stats Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>Xem Video</span>
                  </span>
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {report.videosWatched.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">+200 Xu/lượt</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Users className="w-3 h-3 text-rose-400" />
                    <span>Follow Kênh</span>
                  </span>
                  <div className="text-xl font-black text-rose-400 font-mono">
                    {report.followsGiven.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">+200 Xu/lượt</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-400" />
                    <span>Thả Tim</span>
                  </span>
                  <div className="text-xl font-black text-pink-400 font-mono">
                    {report.likesGiven.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">+100 Xu/lượt</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-purple-400" />
                    <span>Bình Luận</span>
                  </span>
                  <div className="text-xl font-black text-purple-400 font-mono">
                    {report.commentsGiven.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">+200 Xu/lượt</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-blue-400" />
                    <span>Chia Sẻ</span>
                  </span>
                  <div className="text-xl font-black text-blue-400 font-mono">
                    {report.sharesGiven.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">+240 Xu/lượt</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-black border border-amber-500/30 space-y-1">
                  <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>Tổng Xu Nhận</span>
                  </span>
                  <div className="text-xl font-black text-neonGold font-mono">
                    +{report.totalCoinsEarned.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">≈ {report.totalVND}</div>
                </div>
              </div>
            </div>

            {/* Anti-Duplication History Table */}
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Nhật Ký Kênh Đã Làm (Bảo Vệ Quyền Lợi & Chống Trùng Lặp)
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {actionHistoryList.length} kênh đã ghi nhận
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Các kênh trong danh sách dưới đây đã được đối soát hoàn thành. Bạn xem lại các kênh này sẽ không được tính thêm Xu để bảo vệ ngân sách cho chủ shop.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                      <th className="py-2.5 px-3">Chiến Dịch / Kênh</th>
                      <th className="py-2.5 px-3">Thời Gian</th>
                      <th className="py-2.5 px-3">Hành Động Đã Làm</th>
                      <th className="py-2.5 px-3 text-right">Xu Nhận Được</th>
                      <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {actionHistoryList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          Chưa có lịch sử nhiệm vụ nào. Hãy ra tab "Nhiệm Vụ" để kiếm Xu ngay!
                        </td>
                      </tr>
                    ) : (
                      actionHistoryList.map((item) => {
                        const targetTask = tasks.find(t => t.id === item.taskId);
                        const channelTitle = targetTask ? targetTask.channelName : item.taskId;

                        return (
                          <tr key={item.taskId} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-3">
                              <div className="font-bold text-white text-xs">{channelTitle}</div>
                              <div className="text-[10px] text-slate-500">{targetTask?.title || item.taskId}</div>
                            </td>
                            <td className="py-3 px-3 text-slate-400 text-[11px]">
                              {item.completedAt}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                {item.viewed && (
                                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">
                                    ✓ Xem FYP
                                  </span>
                                )}
                                {item.followed && (
                                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px]">
                                    ✓ Follow
                                  </span>
                                )}
                                {item.liked && (
                                  <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px]">
                                    ✓ Tim
                                  </span>
                                )}
                                {item.commented && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                                    ✓ CMT
                                  </span>
                                )}
                                {item.shared && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px]">
                                    ✓ Share
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right font-black text-neonGold">
                              +{item.totalCoinsEarned.toLocaleString()} Xu
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Chống trùng OK</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== KINH TẾ XU — Moved from Tab Ví & Kinh Tế Xu ===== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Coins className="h-3.5 w-3.5 text-yellow-400" />
              <span>HỆ THỐNG KINH TẾ XU • 1 XU = 1 VNĐ TIỀN MẶT CỐ ĐỊNH</span>
            </div>
            <h3 className="text-base font-black text-white font-display">Trung Tâm Ví Xu &amp; Quản Lý Số Dư Minh Bạch</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Toàn bộ hệ thống hoạt động thống nhất bằng <strong>Xu (1 Xu = 1 VNĐ)</strong>. Bạn tích lũy Xu từ việc làm nhiệm vụ và toàn quyền rút tiền mặt về ngân hàng theo kỳ hạch toán định kỳ hoặc tạo chiến dịch kéo tương tác cho kênh của mình.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/40 text-center shrink-0 min-w-[180px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Tỷ Giá Quy Đổi Chuẩn</div>
            <div className="text-xl font-black text-yellow-400 font-mono mt-1">1 XU = 1 VNĐ</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Rút tiền thật 100%</div>
          </div>
        </div>

        {/* 4 Cách Dùng Xu */}
        <div className="pt-3 border-t border-white/10">
          <h4 className="text-xs font-black text-white mb-3">Toàn Quyền Sử Dụng Xu Của Bạn</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 aspect-square sm:aspect-auto flex flex-col justify-center">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">1</div>
              <div className="font-bold text-white text-[11px]">Rút Tiền Ngân Hàng</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Quy đổi 1 Xu = 1 VNĐ rút về tài khoản ngân hàng theo kỳ hạch toán.</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 aspect-square sm:aspect-auto flex flex-col justify-center">
              <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">2</div>
              <div className="font-bold text-white text-[11px]">Tăng Follow Thật</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Khởi chiến dịch kéo follower thật 100% người dùng hoạt động.</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 aspect-square sm:aspect-auto flex flex-col justify-center">
              <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">3</div>
              <div className="font-bold text-white text-[11px]">Tim &amp; Seeding Video</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Xem 15s, thả tim, comment kích nổ đề xuất For You Page.</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 aspect-square sm:aspect-auto flex flex-col justify-center">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">4</div>
              <div className="font-bold text-white text-[11px]">Mắt Xem Livestream</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Kéo hàng trăm mắt xem giữ live 3-5 phút, chốt đơn TikTok Shop.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT HỢP ĐỒNG ĐIỆN TỬ ĐÃ KÝ */}
      <EscrowContractModal
        contract={viewingContract}
        isOpen={!!viewingContract}
        onClose={() => setViewingContract(null)}
        onSignContract={(id) => {
          acceptEscrowBooking(id);
          if (viewingContract && viewingContract.id === id) {
            setViewingContract(prev => prev ? { 
              ...prev, 
              status: 'in_progress', 
              kocSignedAt: new Date().toLocaleDateString('vi-VN') 
            } : null);
          }
        }}
        currentRole={user?.role === 'admin' ? 'admin' : (user?.role === 'kol' ? 'koc' : 'client')}
      />

      {/* MODAL XIN GIA HẠN / ĐỒNG THUẬN GIA HẠN THỜI GIAN BÀN GIAO */}
      <EscrowExtensionModal
        contract={extensionModalContract}
        isOpen={!!extensionModalContract}
        onClose={() => setExtensionModalContract(null)}
        mode={extensionModalMode}
        onRequestExtension={requestContractExtension}
        onRespondExtension={respondToContractExtension}
      />

      {/* MODAL NGHIỆM THU & ĐÁNH GIÁ 1-5 SAO (GIẢI NGÂN 80% KOC) */}
      <EscrowReviewModal
        contract={reviewModalContract}
        isOpen={!!reviewModalContract}
        onClose={() => setReviewModalContract(null)}
        onConfirmReview={approveEscrowWithReview}
      />

      {/* MODAL TRUNG TÂM XỬ LÝ SỰ CỐ & NIÊM PHONG / HOÀN CỌC 100% */}
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

      {/* MODAL NHẬT KÝ ĐỐI THOẠI LƯU TRỮ VĨNH VIỄN (AUDIT TRAIL) */}
      <EscrowChatModal
        contract={chatModalContract}
        isOpen={!!chatModalContract}
        onClose={() => setChatModalContract(null)}
        onOpenExtensionModal={(c) => {
          setExtensionModalContract(c);
          setExtensionModalMode('request');
        }}
        onOpenIncidentModal={(c) => setIncidentModalContract(c)}
      />

    </div>
  );
};
