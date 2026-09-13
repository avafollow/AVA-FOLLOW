import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Coins, 
  Users, 
  RefreshCw, 
  Lock, 
  UserX, 
  UserCheck, 
  Search, 
  Sliders, 
  DollarSign, 
  Gavel, 
  ExternalLink, 
  ShieldAlert,
  Gift,
  Award,
  PlusCircle,
  Percent,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Settings,
  LayoutDashboard,
  Key,
  Activity,
  Video,
  Heart,
  MessageSquare,
  Share2,
  Radio,
  Clock,
  CheckSquare,
  Zap,
  Layers,
  Filter,
  Edit3,
  Trash2,
  Globe,
  Cpu,
  Rocket,
  Trophy,
  Target,
  BarChart3,
  Calendar,
  UserPlus,
  Play,
  Camera
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { AdminUserManagementItem, GrowthServiceItem, SoftwareAppItem } from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { BrandLogo } from '../common/BrandLogo';
import { MISSION_POOL, RANK_MISSION_CONFIG } from '../../data/weeklyMissions';
import { KOC_PENALTY_TIERS } from '../../data/kocProfileData';

export const AdminScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { 
    adminData, 
    approveCampaign, 
    rejectCampaign,
    adminUsers,
    adminToggleUserStatus,
    adminAdjustUserCoins,
    adminGrantPackage,
    adminAdjustUserFollowers,
    adminChangeUserRank,
    escrowBookings,
    adminResolveDispute,
    adminEnforceKocPenalty,
    growthServices,
    commissionSettings,
    updateCommissionSettings,
    kocApplications,
    adminApproveKyc,
    adminRejectKyc,
    kycRequests,
    tokenLedger,
    affiliateData,
    simulateFriendTaskAction,
    softwareApps,
    addSoftwareApp,
    updateSoftwareApp,
    deleteSoftwareApp,
    showToast,
    platformBoostRevenue,
    userCompletedActions,
    getActivityReport,
    clientIp,
    maxAccountsPerIp,
    connectedAccountsOnIp,
    security7Layers,
    securityAuditLogs
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'grant_permissions' | 'software_apps' | 'users' | 'referrals' | 'kyc' | 'token_ledger' | 'settings' | 'escrow' | 'campaigns' | 'missions' | 'staff_roles' | 'security_7layers'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRankFilter, setUserRankFilter] = useState('all');
  const [inspectedPeriod, setInspectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Software Apps Management states
  const [adminAppModalOpen, setAdminAppModalOpen] = useState(false);
  const [editingAdminAppId, setEditingAdminAppId] = useState<string | null>(null);
  const [adminAppTitle, setAdminAppTitle] = useState('');
  const [adminAppCategory, setAdminAppCategory] = useState<SoftwareAppItem['category']>('ai_script');
  const [adminAppTag, setAdminAppTag] = useState('Bán Chạy');
  const [adminAppPriceXu, setAdminAppPriceXu] = useState(500000);
  const [adminAppThumbnail, setAdminAppThumbnail] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80');
  const [adminAppVersion, setAdminAppVersion] = useState('v3.5 Pro');
  const [adminAppDeveloper, setAdminAppDeveloper] = useState('AVA FOLLOW Dev Labs');
  const [adminAppBadge, setAdminAppBadge] = useState('HOT TOOL');
  const [adminAppDownloadUrl, setAdminAppDownloadUrl] = useState('https://tools.tiktokpro.vn');
  const [adminAppDescription, setAdminAppDescription] = useState('');
  const [adminAppHighlights, setAdminAppHighlights] = useState('');
  const [adminAppFeatures, setAdminAppFeatures] = useState('');
  const [adminAppSearch, setAdminAppSearch] = useState('');
  
  // Selected user for detailed inspector modal
  const [inspectedUser, setInspectedUser] = useState<AdminUserManagementItem | null>(null);

  // States for Dedicated Grant Permissions Tab
  const [selectedGrantUserId, setSelectedGrantUserId] = useState<string>(adminUsers[0]?.id || '');
  const [grantCategoryFilter, setGrantCategoryFilter] = useState<string>('all');
  const [grantSearchPackage, setGrantSearchPackage] = useState<string>('');
  const [grantSuccessNotice, setGrantSuccessNotice] = useState<string | null>(null);
  const [customCoinInput, setCustomCoinInput] = useState<string>('50000');
  const [customFollowerInput, setCustomFollowerInput] = useState<string>('1000');

  // Commission settings form states
  const [affiliateRate, setAffiliateRate] = useState(commissionSettings.affiliateRatePercent);
  const [escrowFee, setEscrowFee] = useState(commissionSettings.escrowFeePercent);
  const [taskPoolRate, setTaskPoolRate] = useState(commissionSettings.taskRewardPoolPercent);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  // Staff Roles state
  const [staffList, setStaffList] = useState([
    { id: 'staff_001', name: 'Nguyễn Văn Admin', email: 'admin@avafollow.vn',   role: 'super_admin',      dept: 'Ban Lãnh Đạo',         status: 'active',   lastLogin: '2026-09-12 08:00' },
    { id: 'staff_002', name: 'Trần Thị Kế Toán', email: 'ketoan@avafollow.vn', role: 'finance_manager',   dept: 'Tài Chính - Kế Toán',  status: 'active',   lastLogin: '2026-09-12 07:45' },
    { id: 'staff_003', name: 'Lê Văn KYC',        email: 'kyc@avafollow.vn',   role: 'kyc_officer',       dept: 'Xác Minh KYC',         status: 'active',   lastLogin: '2026-09-11 22:30' },
    { id: 'staff_004', name: 'Phạm Thị Support',  email: 'cs@avafollow.vn',    role: 'customer_support',  dept: 'Chăm Sóc Khách Hàng',  status: 'active',   lastLogin: '2026-09-12 08:10' },
    { id: 'staff_005', name: 'Hoàng Văn KOC',     email: 'koc@avafollow.vn',   role: 'koc_manager',       dept: 'Quản Lý KOC',          status: 'active',   lastLogin: '2026-09-11 20:00' },
    { id: 'staff_006', name: 'Đinh Thị Campaign', email: 'camp@avafollow.vn',  role: 'campaign_manager',  dept: 'Chiến Dịch & Quảng Cáo', status: 'inactive', lastLogin: '2026-09-10 15:00' },
    { id: 'staff_007', name: 'Vũ Văn Tech',       email: 'tech@avafollow.vn',  role: 'tech_admin',        dept: 'Kỹ Thuật & Dev',       status: 'active',   lastLogin: '2026-09-12 07:00' },
  ]);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('customer_support');
  const [newStaffDept, setNewStaffDept] = useState('');

  // KOC Penalty modal state
  const [penaltyModalBooking, setPenaltyModalBooking] = useState<any>(null);
  const [selectedPenaltyLevel, setSelectedPenaltyLevel] = useState<1 | 2 | 3 | 4>(3);
  const [penaltyReason, setPenaltyReason] = useState('');


  // Weekly Monday 10:00 AM Withdrawal Sync Settings
  const [withdrawMinLimit, setWithdrawMinLimit] = useState(200000);
  const [withdrawScheduleDay, setWithdrawScheduleDay] = useState('Thứ Hai (10:00 Sáng)');
  const [withdrawProcessingWindow, setWithdrawProcessingWindow] = useState('24 giờ');
  const [withdrawFeeRate, setWithdrawFeeRate] = useState(5);
  const [requireKycCccd, setRequireKycCccd] = useState(true);

  // Admin Pending Withdrawal Requests Queue
  const [adminWithdrawals, setAdminWithdrawals] = useState([
    {
      id: 'wd_req_101',
      userId: 'usr_02',
      userName: 'Trần Phương KOC',
      userHandle: '@phuongkoc_beauty',
      amountVND: 450000,
      feePlatform: 22500,
      netPayoutVND: 427500,
      bankName: 'Vietcombank',
      accountNumber: '1012389948',
      accountHolder: 'TRAN PHUONG',
      kycVerified: true,
      requestDate: 'Hôm nay, 08:30',
      status: 'pending' as 'pending' | 'approved' | 'rejected'
    },
    {
      id: 'wd_req_102',
      userId: 'usr_03',
      userName: 'Hoàng Long Media',
      userHandle: '@longmedia_agency',
      amountVND: 1200000,
      feePlatform: 60000,
      netPayoutVND: 1140000,
      bankName: 'Techcombank',
      accountNumber: '19033882910',
      accountHolder: 'HOANG LONG',
      kycVerified: true,
      requestDate: 'Hôm nay, 09:15',
      status: 'pending' as 'pending' | 'approved' | 'rejected'
    },
    {
      id: 'wd_req_103',
      userId: 'usr_05',
      userName: 'Duy Anh Creator',
      userHandle: '@duyanh_vlog',
      amountVND: 250000,
      feePlatform: 12500,
      netPayoutVND: 237500,
      bankName: 'MB Bank',
      accountNumber: '9988221199',
      accountHolder: 'NGUYEN DUY ANH',
      kycVerified: false,
      requestDate: 'Hôm nay, 09:40',
      status: 'pending' as 'pending' | 'approved' | 'rejected'
    }
  ]);

  const handleApproveWithdrawal = (id: string) => {
    setAdminWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } : w));
    showToast('✅ Đã duyệt lệnh rút tiền và xếp lịch giải ngân vào 10:00 Sáng Thứ Hai!');
  };

  const handleRejectWithdrawal = (id: string) => {
    setAdminWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' } : w));
    showToast('❌ Đã từ chối lệnh rút tiền và hoàn Xu về ví thành viên.');
  };

  const activeGrantUser = adminUsers.find(u => u.id === selectedGrantUserId) || adminUsers[0];

  const filteredGrantPackages = growthServices.filter(pkg => {
    if (grantCategoryFilter !== 'all' && pkg.category !== grantCategoryFilter) return false;
    if (grantSearchPackage.trim()) {
      const q = grantSearchPackage.toLowerCase();
      return pkg.title.toLowerCase().includes(q) || pkg.description.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredUsers = adminUsers.filter(u => {
    if (userRankFilter !== 'all' && u.rankLevel !== userRankFilter) return false;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || 
             u.handle.toLowerCase().includes(q) || 
             u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const disputedBookings = escrowBookings.filter(b => b.status === 'disputed');

  const handleSaveCommissionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommissionSettings({
      affiliateRatePercent: Number(affiliateRate),
      escrowFeePercent: Number(escrowFee),
      taskRewardPoolPercent: Number(taskPoolRate)
    });
    setIsSavedSettings(true);
    setTimeout(() => setIsSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-[#0D111E] border border-purple-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Trung Tâm Quản Trị Hệ Thống (Master Admin Hub)</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              FULL CONTROL v3.5
            </span>
            <FeatureGuideTooltip
              title="Hướng Dẫn Quản Trị Hệ Thống Master Admin"
              description="Bảng điều khiển tối cao dành cho Quản trị viên để quản lý toàn diện người dùng, cấp gói dịch vụ, cộng Xu, điều chỉnh tỷ lệ hoa hồng và trọng tài hợp đồng ký quỹ."
              steps={[
                "Tra cứu tài khoản qua Gmail: Click vào email người dùng để mở bảng điều khiển chi tiết (Inspector)",
                "Cấp gói dịch vụ 1-chạm: Chọn gói dịch vụ bất kỳ từ 24 siêu phẩm và bấm Cấp Gói Miễn Phí",
                "Điều chỉnh Xu & Follower: Bấm [+] / [-] để nạp Xu thưởng hoặc can thiệp số follower của kênh",
                "Nâng / Hạ hạng VIP: Click vào huy hiệu hạng để luân chuyển Đồng -> Bạc -> Vàng -> Kim Cương",
                "Trọng tài Escrow: Xem video demo, bảo hành 3 ngày và bấm Giải Ngân Cho KOC hoặc Hoàn Tiền Cho Brand"
              ]}
              tips="Mọi thay đổi từ Admin đều được đồng bộ ngay lập tức vào cơ sở dữ liệu và hiển thị thời gian thực trên giao diện người dùng."
              badge="Quyền Hạn Tối Cao"
              placement="bottom"
            />
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Quản trị toàn quyền: Kiểm tra người dùng qua Gmail, cấp gói dịch vụ 1-chạm, cộng Xu, cấu hình hoa hồng ăn chia sàn và phân xử tranh chấp.
          </p>
        </div>
      </div>

      {/* 4 Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Tổng Tài Khoản Đăng Ký</span>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {adminUsers.length.toLocaleString()} User
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">100% Đồng bộ Supabase Profiles</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Két Ký Quỹ Sàn (Escrow Vault)</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {adminData.totalEscrowLockedVND || '18,500,000đ'}
          </div>
          <p className="text-[10px] text-amber-400 font-mono">Khóa an toàn trong Smart Vault</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Kho Gói Dịch Vụ Sẵn Sàng</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {growthServices.length} Gói Dịch Vụ
          </div>
          <p className="text-[10px] text-cyan-400 font-mono">Follow, Like, Comment, Live</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Hồ Sơ KOC Đăng Ký</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {kocApplications.length} KOC Đối Tác
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">Sẵn sàng nhận hợp đồng booking</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
          <span>Dashboard Toàn Bộ</span>
        </button>

        <button
          onClick={() => setActiveTab('grant_permissions')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'grant_permissions'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4 text-neonGold" />
          <span>Cấp Quyền & Gói</span>
        </button>

        <button
          onClick={() => setActiveTab('software_apps')}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'software_apps'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4 text-pink-400" />
          <span>App Kiếm Tiền ({softwareApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'referrals'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" />
          <span>Tiếp Thị & Ref ({affiliateData.referralsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'kyc'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Xác Minh KYC ({kycRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('token_ledger')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'token_ledger'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 text-neonGold" />
          <span>Sổ Cái Token ({tokenLedger.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Hoa Hồng Sàn</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'escrow'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Trọng Tài ({disputedBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'campaigns'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Chiến Dịch ({adminData.campaignsQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('missions')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'missions'
              ? 'bg-rose-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Nhiệm Vụ Tuần</span>
        </button>

        <button
          onClick={() => setActiveTab('staff_roles')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'staff_roles'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Phân Quyền</span>
        </button>

        <button
          onClick={() => setActiveTab('security_7layers')}
          className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'security_7layers'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bảo Mật 7 Lớp</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: DASHBOARD QUẢN TRỊ TOÀN BỘ & GIÁM SÁT THỜI GIAN THỰC              */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Executive Overview Header */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    Bảng Giám Sát Toàn Cảnh Hoạt Động Hệ Thống (Master Overview)
                  </h3>
                  <FeatureGuideTooltip
                    title="Bảng Điều Khiển Master Admin Tổng Quan"
                    description="Tổng hợp dữ liệu thời gian thực của toàn bộ hệ thống: Dòng tiền ký quỹ, người dùng hoạt động, tiến độ nhiệm vụ hàng ngày và tỷ giá Token bảo chứng."
                    steps={[
                      "1. Giám sát két ký quỹ Escrow: Toàn bộ tiền giao dịch KOC và mua gói được bảo toàn an toàn",
                      "2. Đối soát nhiệm vụ hàng ngày: Xem số lượng video 15s, lượt follow, tim, comment và phút xem live đang vận hành",
                      "3. Kiểm soát phân bổ dòng tiền: Xem tỷ lệ hoa hồng đại lý và quỹ trả thưởng nhiệm vụ",
                      "4. Điều hướng thao tác nhanh: Cấp gói, duyệt KYC và giải quyết tranh chấp với 1 click"
                    ]}
                    tips="Dữ liệu dashboard được làm mới liên tục và đồng bộ tức thì với cơ sở dữ liệu Supabase."
                    badge="Tổng Quan Toàn Sàn"
                    placement="bottom"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dữ liệu trực quan toàn bộ giao dịch, két ký quỹ, người dùng thật và luồng nhiệm vụ hàng ngày
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Hệ thống hoạt động 99.99%
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono">
                  TikTok API v4.2
                </span>
              </div>
            </div>

            {/* 6 Rich KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Doanh Thu & Két Ký Quỹ</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">185,420,000đ</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">+18.4% tuần này</span>
                  <span className="text-amber-400 font-bold">Két Escrow: {adminData.totalEscrowLockedVND || '18,500,000đ'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Cộng Đồng Người Dùng Thật</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300 font-mono">154,200 User</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400">+{adminUsers.length} tài khoản VIP</span>
                  <span className="text-slate-400">100% người thật</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Xác Minh Danh Tính (KYC)</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-300 font-mono">98.6% Hợp Lệ</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">{kycRequests.filter(k => k.status === 'verified').length} Đã duyệt CCCD</span>
                  <span className="text-amber-400">{kycRequests.filter(k => k.status === 'pending').length} Đang chờ</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Tổng Lưu Thông Xu Thưởng Sàn</span>
                  <Coins className="w-4 h-4 text-neonGold" />
                </div>
                <div className="text-2xl font-black text-neonGold font-mono">2,450,000,000 Xu</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-300">1 Xu = 1 VNĐ (Bảo chứng 100%)</span>
                  <span className="text-slate-400">Giải ngân theo kỳ hạch toán</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Chiến Dịch Nhiệm Vụ Đang Chạy</span>
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-300 font-mono">{adminData.campaignsQueue.length + 128} Chiến Dịch</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">Tỷ lệ hoàn thành 99.2%</span>
                  <span className="text-slate-400">Tự động hóa 100%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Kho Gói & Hợp Đồng KOC</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{growthServices.length} Gói / {kocApplications.length} KOC</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-400">Sẵn sàng phân phối</span>
                  <span className="text-emerald-400">0 Lỗi hệ thống</span>
                </div>
              </div>

              {/* Doanh Thu Phí Đẩy Top Sàn (+50.000 Xu/lượt) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900 border border-rose-500/40 space-y-2 shadow-lg shadow-rose-950/30">
                <div className="flex items-center justify-between text-rose-300 text-xs">
                  <span className="font-mono uppercase text-[10px] font-bold flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    <span>Doanh Thu Đẩy Top Sàn (+50k/lượt)</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold">100% SÀN</span>
                </div>
                <div className="text-2xl font-black text-neonGold font-mono">
                  {platformBoostRevenue.toLocaleString()} Xu
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">≈ {platformBoostRevenue.toLocaleString()} VNĐ</span>
                  <span className="text-slate-400">Trừ tự động từ ví chủ shop</span>
                </div>
              </div>

            </div>
          </div>

          {/* Thống Kê Tiến Độ Hoàn Thành & Tỷ Lệ Rơi Rụng Nhiệm Vụ Hàng Ngày */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Thống Kê Tiến Độ Hoàn Thành &amp; Tỷ Lệ Rơi Rụng Nhiệm Vụ (Daily Task Analytics)
                  </h3>
                  <FeatureGuideTooltip
                    title="Phân Tích Hoàn Thành & Rơi Rụng Nhiệm Vụ"
                    description="Giám sát tỷ lệ thành công của các nhiệm vụ trong ngày, tỷ lệ rơi rụng (drop-off), thời gian hoàn thành trung bình để phát hiện sớm các chiến dịch có vấn đề hoặc hành vi bất thường."
                    steps={[
                      "1. Tỷ lệ hoàn thành (Completion Rate): Đo lường % người dùng thực hiện đủ yêu cầu và nhận Xu thưởng thành công",
                      "2. Tỷ lệ rơi rụng (Drop-off Rate): Người nhận task nhưng thoát giữa chừng hoặc không bấm nút xác nhận",
                      "3. Phân bổ theo loại hình: So sánh hiệu quả giữa Follow, Xem FYP 15s, Like, Comment, Share và Livestream",
                      "4. Xu hướng 7 ngày: Đánh giá độ ổn định của hệ sinh thái và cộng đồng người dùng thật"
                    ]}
                    badge="Hiệu Suất Task Real-Time"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Báo cáo trực quan % nhiệm vụ hoàn thành nhận Xu vs tỷ lệ bỏ dở theo từng khung giờ và loại tương tác
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  ● 89.4% Hoàn Thành Toàn Sàn
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                  10.6% Rơi Rụng / Hủy
                </span>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Tổng Task Đã Nhận (24h)</div>
                <div className="text-xl font-black text-white font-mono">24,850</div>
                <div className="text-[10px] text-emerald-400 font-mono">+12.4% so với hôm qua</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1 text-center">
                <div className="text-[10px] text-emerald-300 font-mono uppercase">Hoàn Thành &amp; Nhận Xu</div>
                <div className="text-xl font-black text-emerald-400 font-mono">22,215</div>
                <div className="text-[10px] text-emerald-300 font-mono font-bold">89.4% Thành Công</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/30 space-y-1 text-center">
                <div className="text-[10px] text-rose-300 font-mono uppercase">Rơi Rụng / Hết Hạn 60s</div>
                <div className="text-xl font-black text-rose-400 font-mono">2,635</div>
                <div className="text-[10px] text-rose-300 font-mono font-bold">10.6% Tỷ Lệ Drop</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-1 text-center">
                <div className="text-[10px] text-purple-300 font-mono uppercase">Thời Gian Trung Bình/Task</div>
                <div className="text-xl font-black text-purple-300 font-mono">18.2s</div>
                <div className="text-[10px] text-slate-400 font-mono">Chuẩn tự nhiên FYP</div>
              </div>
            </div>

            {/* Breakdown by Interaction Type */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
              <div className="text-xs font-bold text-white uppercase font-mono flex items-center justify-between">
                <span>Chi Tiết Theo Từng Loại Tương Tác:</span>
                <span className="text-[10px] text-slate-400 font-normal">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Kết Nối Bạn Bè (Follow Người Thật)', completed: 92.5, drop: 7.5, total: '8,420 task', color: 'from-emerald-500 to-teal-400' },
                  { label: 'Xem & Đánh Giá (Thả Tim Video)', completed: 94.2, drop: 5.8, total: '7,150 task', color: 'from-pink-500 to-rose-400' },
                  { label: 'Tiếp Cận Người Xem (Xem FYP 15s)', completed: 91.0, drop: 9.0, total: '4,890 task', color: 'from-blue-500 to-cyan-400' },
                  { label: 'Giới Thiệu Bạn Bè (Share Ngoại Sàn)', completed: 86.8, drop: 13.2, total: '1,840 task', color: 'from-purple-500 to-indigo-400' },
                  { label: 'Trả Lời Câu Hỏi (Comment Seeding)', completed: 84.6, drop: 15.4, total: '1,450 task', color: 'from-amber-500 to-yellow-400' },
                  { label: 'Xem LIVE & Trả Lời (Giữ Mắt 3-30p)', completed: 81.3, drop: 18.7, total: '1,100 task', color: 'from-red-500 to-orange-400' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-slate-400 font-normal">{item.total}</span>
                        <span className="text-emerald-400 font-bold">✓ {item.completed}% hoàn thành</span>
                        <span className="text-rose-400 font-bold">✗ {item.drop}% drop</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden flex">
                      <div className={`bg-gradient-to-r ${item.color} h-full transition-all duration-500`} style={{ width: `${item.completed}%` }} />
                      <div className="bg-rose-500/40 h-full transition-all duration-500" style={{ width: `${item.drop}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Cashflow & Revenue Split Pipeline */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Sơ Đồ Dòng Tiền & Ký Quỹ Escrow Ăn Chia Tự Động Toàn Sàn
                </h3>
                <FeatureGuideTooltip
                  title="Luồng Phân Bổ Dòng Tiền Sàn"
                  description="Cơ chế ký quỹ 3 bên đảm bảo an toàn tuyệt đối. Tiền được nạp qua VietQR, khóa trong két sàn trung gian và phân bổ tự động theo tỷ lệ đã cấu hình."
                  steps={[
                    "Khách hàng nạp tiền: Quét mã VietQR tự động khớp lệnh trong 3 giây",
                    "Két Sàn Escrow Vault: Khóa tiền bảo chứng 100%, bảo vệ Brand & KOC",
                    "Quỹ Trả Thưởng Nhiệm Vụ (" + commissionSettings.taskRewardPoolPercent + "%): Quy đổi thành Xu trả cho người làm nhiệm vụ",
                    "Hoa Hồng Tiếp Thị (" + commissionSettings.affiliateRatePercent + "%): Trả ngay lập tức cho đại lý giới thiệu",
                    "Phí Duy Trì Sàn (" + commissionSettings.escrowFeePercent + "%): Duy trì máy chủ, API TikTok và tòa trọng tài"
                  ]}
                  badge="Dòng Tiền Minh Bạch"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quy trình khép kín: Nạp tiền VietQR &gt; Khóa két Escrow &gt; Phân bổ Quỹ Trả Thưởng &gt; Rút tiền ngân hàng theo kỳ hạch toán
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">1</div>
                <h4 className="font-bold text-white">Khách Hàng Nạp Tiền</h4>
                <p className="text-[11px] text-slate-400">Quét mã VietQR chuẩn xác, hệ thống cộng số dư tức thì 24/7.</p>
                <div className="pt-2 text-[10px] font-mono text-blue-300 font-bold">100% Tự động ngân hàng</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 relative overflow-hidden shadow-lg shadow-amber-950/20">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">2</div>
                <h4 className="font-bold text-amber-300">Két Ký Quỹ Escrow</h4>
                <p className="text-[11px] text-slate-400">Khóa tiền bảo chứng an toàn. Không ai có thể can thiệp rút tiền trước hạn.</p>
                <div className="pt-2 text-[10px] font-mono text-amber-400 font-bold">Bảo chứng 100% giao dịch</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-2 relative overflow-hidden">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">3</div>
                <h4 className="font-bold text-purple-300">Phân Bổ Thuật Toán</h4>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-cyan-300">
                    <span>Quỹ Task:</span> <strong className="font-mono">{commissionSettings.taskRewardPoolPercent}%</strong>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>Affiliate:</span> <strong className="font-mono">{commissionSettings.affiliateRatePercent}%</strong>
                  </div>
                  <div className="flex justify-between text-purple-300">
                    <span>Phí Sàn:</span> <strong className="font-mono">{commissionSettings.escrowFeePercent}%</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2 relative overflow-hidden">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">4</div>
                <h4 className="font-bold text-emerald-300">Rút Tiền Ngân Hàng</h4>
                <p className="text-[11px] text-slate-400">User & KOC rút tiền về Vietcombank, MB, Techcombank theo kỳ giải ngân sau khi hoàn tất KYC.</p>
                <div className="pt-2 text-[10px] font-mono text-emerald-400 font-bold">Bảo chứng thanh khoản</div>
              </div>

            </div>
          </div>

          {/* Daily Task Campaigns Realtime Tracker */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    Báo Cáo Hoạt Động Chiến Dịch Nhiệm Vụ Hàng Ngày (Realtime Tasks)
                  </h3>
                  <FeatureGuideTooltip
                    title="Theo Dõi Nhiệm Vụ Người Dùng Thật"
                    description="Hiển thị chi tiết số lượt hoàn thành từng loại nhiệm vụ hôm nay. Mọi hành động đều được kiểm tra qua hệ thống chống gian lận và chống unfollow."
                    steps={[
                      "Xem video 15s: Đạt chuẩn thời lượng xem tối thiểu mới cộng Xu",
                      "Follow kênh: Kiểm tra trạng thái follow thật từ tài khoản người dùng",
                      "Thả tim & Comment: Tương tác tự nhiên theo kịch bản giỏ hàng",
                      "Chia sẻ: Lan tỏa video lên Zalo, Facebook và tin nhắn TikTok",
                      "Xem Livestream: Đo đếm chính xác từng phút xem và giữ chân phòng live"
                    ]}
                    badge="100% Người Dùng Thật"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  154,200+ người dùng hoàn thành nhiệm vụ và nhận thưởng Xu thời gian thực hôm nay
                </p>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                Hôm Nay: +75.36M Xu Phân Phối
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Task 1: Xem Video 15s */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Xem Video 15 Giây</h4>
                      <p className="text-[10px] text-slate-400">+1,000 Xu / lượt</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">99.4%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '99.4%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>24,850</strong> lượt</span>
                  <span className="text-purple-300">+24.85M Xu</span>
                </div>
              </div>

              {/* Task 2: Follow Kênh */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Follow Kênh Thật</h4>
                      <p className="text-[10px] text-slate-400">+500 Xu / follow</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">98.3%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '98.3%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>18,200</strong> follow</span>
                  <span className="text-emerald-300">+9.10M Xu</span>
                </div>
              </div>

              {/* Task 3: Thả Tim */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Thả Tim Video FYP</h4>
                      <p className="text-[10px] text-slate-400">+100 Xu / tim</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">99.1%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full" style={{ width: '99.1%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>45,600</strong> tim</span>
                  <span className="text-rose-300">+4.56M Xu</span>
                </div>
              </div>

              {/* Task 4: Comment Seeding */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Comment Kịch Bản</h4>
                      <p className="text-[10px] text-slate-400">+150 Xu / comment</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-cyan-400">94.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full" style={{ width: '94%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>9,400</strong> bình luận</span>
                  <span className="text-cyan-300">+1.41M Xu</span>
                </div>
              </div>

              {/* Task 5: Chia Sẻ */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Chia Sẻ Lan Tỏa</h4>
                      <p className="text-[10px] text-slate-400">+200 Xu / share</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">97.1%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full" style={{ width: '97.1%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>6,800</strong> chia sẻ</span>
                  <span className="text-amber-300">+1.36M Xu</span>
                </div>
              </div>

              {/* Task 6: Mắt Xem Livestream */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Mắt Xem Livestream</h4>
                      <p className="text-[10px] text-slate-400">+300 - 600 Xu / phút</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400">94.6%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '94.6%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Tổng phút xem: <strong>85,200</strong> phút</span>
                  <span className="text-rose-300">+34.08M Xu</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Actions Navigator Bar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-neonGold" />
              Lối Tắt Điều Hành Admin 1-Chạm:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('grant_permissions')}
                className="p-3 rounded-2xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-left transition-all group"
              >
                <Key className="w-5 h-5 text-neonGold mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white text-xs">Cấp Quyền & Gói</div>
                <p className="text-[10px] text-slate-400">Cấp 24 gói qua Gmail</p>
              </button>

              <button
                onClick={() => setActiveTab('kyc')}
                className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-left transition-all group"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white text-xs">Duyệt KYC Khẩn Cấp</div>
                <p className="text-[10px] text-slate-400">{kycRequests.filter(k => k.status === 'pending').length} hồ sơ chờ xử lý</p>
              </button>

              <button
                onClick={() => setActiveTab('escrow')}
                className="p-3 rounded-2xl bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-left transition-all group"
              >
                <Gavel className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white text-xs">Trọng Tài Escrow</div>
                <p className="text-[10px] text-slate-400">{disputedBookings.length} tranh chấp cần phân xử</p>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-left transition-all group"
              >
                <Percent className="w-5 h-5 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-white text-xs">Hoa Hồng Sàn</div>
                <p className="text-[10px] text-slate-400">Chỉnh tỷ lệ chia sẻ %</p>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: CẤP QUYỀN TOÀN DIỆN & PHÂN PHỐI 24 GÓI DỊCH VỤ QUA GMAIL            */}
      {/* ========================================================================= */}
      {activeTab === 'grant_permissions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4 text-neonGold" />
                    Trung Tâm Cấp Quyền & Phân Phối Gói Dịch Vụ Qua Gmail (Super Dispatcher)
                  </h3>
                  <FeatureGuideTooltip
                    title="Cấp Quyền & Phân Phối Gói Dịch Vụ Admin"
                    description="Công cụ tối cao giúp Quản trị viên cấp quyền trực tiếp cho bất kỳ tài khoản nào thông qua địa chỉ Gmail: Cấp gói dịch vụ miễn phí, nâng hạ hạng VIP, cộng/trừ Xu và bơm follower."
                    steps={[
                      "1. Chọn tài khoản Gmail của người dùng cần can thiệp",
                      "2. Cấp Gói Dịch Vụ: Bấm 'Cấp Gói Miễn Phí' tại bất kỳ gói nào trong 24 siêu phẩm để tạo đơn chạy ngay lập tức",
                      "3. Điều chỉnh Xu: Bấm các mốc +10k, +50k, +200k, +1M hoặc nhập số Xu tùy ý",
                      "4. Bơm Follow Kênh TikTok: Bấm +500, +1k, +5k, +10k follow để cập nhật chỉ số kênh",
                      "5. Nâng Hạng VIP: Luân chuyển cấp bậc Đồng > Bạc > Vàng > Kim Cương",
                      "6. Khóa / Mở Khóa: Ngăn chặn tài khoản có dấu hiệu gian lận"
                    ]}
                    tips="Gói được Admin cấp miễn phí sẽ được gắn cờ Admin Grant và không bị trừ bất kỳ khoản phí nào từ tài khoản người nhận."
                    badge="Đặc Quyền Tối Cao"
                    placement="bottom"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cấp trọn bộ 24 gói tăng trưởng, nạp Xu, tăng follow kênh TikTok và nâng hạng VIP tức thì cho người dùng qua Gmail
                </p>
              </div>

              {grantSuccessNotice && (
                <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{grantSuccessNotice}</span>
                </div>
              )}
            </div>

            {/* User Target Selector */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Chọn Tài Khoản Gmail Cần Thao Tác Cấp Quyền:</span>
                </label>

                <select
                  value={selectedGrantUserId}
                  onChange={(e) => setSelectedGrantUserId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 w-full sm:w-80"
                >
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email} ({u.name} - Hạng {u.rankLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Selected User Card */}
              {activeGrantUser && (
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeGrantUser.avatar} 
                      alt="" 
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/50" 
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{activeGrantUser.name}</div>
                      <div className="text-xs text-cyan-400 font-mono">{activeGrantUser.email}</div>
                      <div className="text-[11px] text-slate-400">{activeGrantUser.tiktokConnected || `@${activeGrantUser.handle}`}</div>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-slate-400">Hạng VIP Hiện Tại:</div>
                    <button
                      onClick={() => {
                        const ranks: ('Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương')[] = ['Đồng', 'Bạc', 'Vàng', 'Kim Cương'];
                        const nextIdx = (ranks.indexOf(activeGrantUser.rankLevel) + 1) % ranks.length;
                        adminChangeUserRank(activeGrantUser.id, ranks[nextIdx]);
                        setGrantSuccessNotice(`Đã đổi hạng ${activeGrantUser.name} thành ${ranks[nextIdx]}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-neonGold" />
                      <span>{activeGrantUser.rankLevel} (Bấm Để Đổi)</span>
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-slate-400">Số Dư Xu / Follower:</div>
                    <div className="text-amber-400 font-bold">{activeGrantUser.coinsBalance.toLocaleString()} Xu</div>
                    <div className="text-emerald-400 font-bold">{activeGrantUser.tiktokFollowers.toLocaleString()} Follower</div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-400">Trạng Thái Tài Khoản:</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        activeGrantUser.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {activeGrantUser.status === 'active' ? '✓ Đang hoạt động' : '✕ Đang bị khóa'}
                      </span>
                      <button
                        onClick={() => {
                          adminToggleUserStatus(activeGrantUser.id);
                          setGrantSuccessNotice(`Đã chuyển trạng thái tài khoản ${activeGrantUser.name}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-bold text-white transition-colors"
                      >
                        {activeGrantUser.status === 'active' ? 'Khóa' : 'Mở Khóa'}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Direct Instant Parameter Adjustments (Xu & Follower) */}
            {activeGrantUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Adjust Coins Panel */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Điều Chỉnh Số Dư Xu Thưởng (Hiện Có: {activeGrantUser.coinsBalance.toLocaleString()} Xu)
                    </h4>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 10000);
                        setGrantSuccessNotice(`Đã cộng +10,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20"
                    >
                      +10,000 Xu
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 50000);
                        setGrantSuccessNotice(`Đã cộng +50,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20"
                    >
                      +50,000 Xu
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 200000);
                        setGrantSuccessNotice(`Đã cộng +200,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20"
                    >
                      +200,000 Xu
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 1000000);
                        setGrantSuccessNotice(`Đã cộng +1,000,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black border border-amber-500/40"
                    >
                      +1,000,000 Xu
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Nhập số Xu tùy ý (VD: 150000 hoặc -50000)"
                      value={customCoinInput}
                      onChange={(e) => setCustomCoinInput(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => {
                        const amt = parseInt(customCoinInput, 10);
                        if (!isNaN(amt)) {
                          adminAdjustUserCoins(activeGrantUser.id, amt);
                          setGrantSuccessNotice(`Đã cập nhật ${amt > 0 ? '+' : ''}${amt.toLocaleString()} Xu cho ${activeGrantUser.name}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-colors"
                    >
                      Áp Dụng
                    </button>
                  </div>
                </div>

                {/* Adjust Followers Panel */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Bơm Follow Kênh TikTok (Hiện Có: {activeGrantUser.tiktokFollowers.toLocaleString()} Follower)
                    </h4>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 500);
                        setGrantSuccessNotice(`Đã bơm +500 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +500 Follow
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 1000);
                        setGrantSuccessNotice(`Đã bơm +1,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +1,000 Follow
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 5000);
                        setGrantSuccessNotice(`Đã bơm +5,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +5,000 Follow
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 10000);
                        setGrantSuccessNotice(`Đã bơm +10,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-black border border-emerald-500/40"
                    >
                      +10,000 Follow
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="number"
                      placeholder="Nhập số Follow tùy ý (VD: 2500 hoặc 50000)"
                      value={customFollowerInput}
                      onChange={(e) => setCustomFollowerInput(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => {
                        const amt = parseInt(customFollowerInput, 10);
                        if (!isNaN(amt)) {
                          adminAdjustUserFollowers(activeGrantUser.id, amt);
                          setGrantSuccessNotice(`Đã bơm +${amt.toLocaleString()} Follower cho ${activeGrantUser.name}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-colors"
                    >
                      Áp Dụng
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 24 Growth Services Dispatcher Grid */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-400" />
                  Kho 24 Gói Dịch Vụ Tăng Trưởng - Cấp Miễn Phí 1-Chạm ({filteredGrantPackages.length} Gói)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bấm &quot;Cấp Gói Ngay&quot; để gửi đặc quyền gói dịch vụ trực tiếp vào tài khoản {activeGrantUser?.name} ({activeGrantUser?.email})
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên gói, mô tả..."
                    value={grantSearchPackage}
                    onChange={(e) => setGrantSearchPackage(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-48"
                  />
                </div>

                <select
                  value={grantCategoryFilter}
                  onChange={(e) => setGrantCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">Tất cả hạng mục (24 gói)</option>
                  <option value="follow">Follow Kênh Thật</option>
                  <option value="engagement">Tương Tác Tim & View</option>
                  <option value="comment">Comment Kịch Bản</option>
                  <option value="share">Chia Sẻ Lan Tỏa</option>
                  <option value="livestream">Mắt Xem Livestream</option>
                  <option value="combo">Combo TikTok Shop</option>
                  <option value="booking">Booking KOC Review</option>
                  <option value="full_channel">Xây Kênh Trọn Gói</option>
                </select>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGrantPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 space-y-3 flex flex-col justify-between transition-all group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                        {pkg.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">★ {pkg.rating} ({pkg.reviewCount})</span>
                    </div>

                    <h4 className="font-bold text-white text-xs group-hover:text-purple-300 transition-colors line-clamp-1">
                      {pkg.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-white font-bold">{pkg.price}</span>
                        <span className="text-[10px] text-slate-400"> / {pkg.unit}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">+{pkg.targetQuantity.toLocaleString()} {pkg.unit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!activeGrantUser) return;
                      adminGrantPackage(activeGrantUser.id, pkg);
                      setGrantSuccessNotice(`👑 Đã cấp thành công "${pkg.title}" cho tài khoản ${activeGrantUser.email}!`);
                      setTimeout(() => setGrantSuccessNotice(null), 3500);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Cấp Gói Này Cho {activeGrantUser?.name}</span>
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Full Platform Service Policy Inspector Table */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Bảng Quy Chuẩn Chính Sách & Cam Kết Vận Hành 24 Gói Dịch Vụ
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cam kết chất lượng 100% người thật, bảo hành không tụt và cơ chế ký quỹ Escrow bảo chứng
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                Chính Sách Chuẩn Sàn v3.5
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Gói Dịch Vụ</th>
                    <th className="p-3">Hạng Mục</th>
                    <th className="p-3">Đơn Giá Niêm Yết</th>
                    <th className="p-3">Sản Lượng Cam Kết</th>
                    <th className="p-3">Tiến Độ Thực Hiện</th>
                    <th className="p-3">Bảo Hành / Ký Quỹ Escrow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {growthServices.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-bold text-white font-sans">{s.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3 text-amber-400 font-bold">{s.price}</td>
                      <td className="p-3 text-emerald-400 font-bold">{s.targetQuantity.toLocaleString()} {s.unit}</td>
                      <td className="p-3 text-emerald-300 font-bold">Chạy đến khi đạt 100% chỉ tiêu</td>
                      <td className="p-3 text-cyan-300">✓ Ký Quỹ Sàn 100% (BH 60 Ngày)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: QUẢN LÝ KHO APP KIẾM TIỀN & CÔNG CỤ TĂNG TRƯỞNG                      */}
      {/* ========================================================================= */}
      {activeTab === 'software_apps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-pink-400" />
                  Quản Lý Kho App Kiếm Tiền & Phần Mềm AVA FOLLOW ({softwareApps.length} Ứng Dụng)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thêm, sửa hình ảnh thumbnail, tiêu đề, tính năng và giá Xu cho từng phần mềm. Đồng bộ tức thì ra Chợ App Kiếm Tiền.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAdminAppId(null);
                  setAdminAppTitle('');
                  setAdminAppCategory('ai_script');
                  setAdminAppTag('Mới Ra Mắt');
                  setAdminAppPriceXu(500000);
                  setAdminAppThumbnail('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80');
                  setAdminAppVersion('v1.0 Pro');
                  setAdminAppDeveloper('AVA FOLLOW Labs');
                  setAdminAppBadge('NEW');
                  setAdminAppDownloadUrl('https://tools.tiktokpro.vn');
                  setAdminAppDescription('Phần mềm hỗ trợ xây kênh và tối ưu video tự động.');
                  setAdminAppHighlights('Tự động hóa toàn diện\nTăng tốc độ xây kênh x3\nAn toàn tuyệt đối');
                  setAdminAppFeatures('Hỗ trợ Windows, Mac\nCập nhật trọn đời\nHỗ trợ kỹ thuật 1-1');
                  setAdminAppModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/30 shrink-0 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Thêm Ứng Dụng Mới</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên app, tag hoặc nhà phát triển..."
                  value={adminAppSearch}
                  onChange={(e) => setAdminAppSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Software Apps Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3">Ứng Dụng & Thumbnail</th>
                    <th className="p-3">Danh Mục</th>
                    <th className="p-3">Tag & Badge</th>
                    <th className="p-3">Giá Bán (Xu)</th>
                    <th className="p-3">Lượt Tải / Đánh Giá</th>
                    <th className="p-3">Link Tải</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {softwareApps
                    .filter(app => {
                      if (!adminAppSearch.trim()) return true;
                      const q = adminAppSearch.toLowerCase();
                      return app.title.toLowerCase().includes(q) || app.tag.toLowerCase().includes(q) || app.developer.toLowerCase().includes(q);
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.thumbnail}
                              alt={app.title}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{app.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {app.version} • {app.developer}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 font-mono">
                            {app.category}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20 font-mono">
                              {app.tag}
                            </span>
                            {app.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                                {app.badge}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-mono">
                            <span className="font-black text-neonGold text-sm">{app.priceXu.toLocaleString()} Xu</span>
                            <div className="text-[10px] text-slate-400">≈ {app.priceXu.toLocaleString()}đ</div>
                          </div>
                        </td>

                        <td className="p-3 font-mono text-[11px]">
                          <div className="text-cyan-300">⬇ {app.downloadsCount.toLocaleString()} tải</div>
                          <div className="text-amber-400">★ {app.rating} ({app.reviewCount})</div>
                        </td>

                        <td className="p-3">
                          <a
                            href={app.downloadUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline line-clamp-1 font-mono text-[10px] max-w-[140px]"
                          >
                            {app.downloadUrl || 'Chưa cập nhật'}
                          </a>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingAdminAppId(app.id);
                                setAdminAppTitle(app.title);
                                setAdminAppCategory(app.category);
                                setAdminAppTag(app.tag);
                                setAdminAppPriceXu(app.priceXu);
                                setAdminAppThumbnail(app.thumbnail);
                                setAdminAppVersion(app.version);
                                setAdminAppDeveloper(app.developer);
                                setAdminAppBadge(app.badge || 'HOT');
                                setAdminAppDownloadUrl(app.downloadUrl || 'https://tools.tiktokpro.vn');
                                setAdminAppDescription(app.description);
                                setAdminAppHighlights((app.highlights || []).join('\n'));
                                setAdminAppFeatures((app.features || []).join('\n'));
                                setAdminAppModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                              title="Sửa thông tin"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc chắn muốn xóa ứng dụng "${app.title}" không?`)) {
                                  deleteSoftwareApp(app.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Xóa ứng dụng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: Quản Lý & Cấp Quyền Người Dùng Siêu Cấp                             */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Danh Sách Hồ Sơ Người Dùng (Click vào Gmail để quản trị toàn quyền)
                </h3>
                <FeatureGuideTooltip
                  title="Quản Trị Người Dùng & Cấp Quyền Trực Tiếp"
                  description="Quản trị viên có thể tìm kiếm bất kỳ thành viên nào qua tài khoản Gmail và can thiệp toàn bộ thông số trong tài khoản của họ."
                  steps={[
                    "Click vào Gmail hoặc Họ tên: Mở bảng thanh tra Inspector chi tiết",
                    "Cấp Gói: Tặng ngay 1 trong 24 gói tăng trưởng mà không cần user trả tiền",
                    "Cộng / Trừ Xu: Nạp Xu thưởng khuyến khích hoặc phạt trừ Xu vi phạm",
                    "Follow Kênh: Cập nhật chỉ số follower thực tế hiển thị trên hồ sơ",
                    "Khóa / Mở Khóa: Vô hiệu hóa tài khoản gian lận hoặc bot tự động"
                  ]}
                  tips="Cấp gói cho user qua admin sẽ tự động tạo đơn hàng trong hệ thống và kích hoạt mạng lưới phân phối nhiệm vụ ngay lập tức."
                  badge="Toàn Quyền Can Thiệp"
                  placement="right"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấp gói dịch vụ miễn phí, cộng Xu, điều chỉnh follower kênh, nâng hạng VIP và khóa tài khoản vi phạm.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm Gmail, tên, @handle..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-56"
                />
              </div>

              <select
                value={userRankFilter}
                onChange={(e) => setUserRankFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">Hạng: Tất cả</option>
                <option value="Kim Cương">Kim Cương</option>
                <option value="Vàng">Vàng</option>
                <option value="Bạc">Bạc</option>
                <option value="Đồng">Đồng</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Họ Tên / Tài Khoản Gmail</th>
                  <th className="p-3">Hạng VIP</th>
                  <th className="p-3">Kênh TikTok & Follow</th>
                  <th className="p-3">Số Dư (Xu)</th>
                  <th className="p-3">Gói Đã Mua / Ký Quỹ</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Cấp Quyền & Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3">
                      <div 
                        onClick={() => setInspectedUser(u)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          className="w-8 h-8 rounded-full border border-purple-500/30 object-cover group-hover:ring-2 group-hover:ring-purple-400" 
                        />
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-purple-300 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <Eye className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-cyan-400 font-mono underline decoration-cyan-500/40">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      <button
                        onClick={() => {
                          const ranks: ('Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương')[] = ['Đồng', 'Bạc', 'Vàng', 'Kim Cương'];
                          const nextIdx = (ranks.indexOf(u.rankLevel) + 1) % ranks.length;
                          adminChangeUserRank(u.id, ranks[nextIdx]);
                        }}
                        title="Bấm để đổi hạng VIP"
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                      >
                        {u.rankLevel} ✎
                      </button>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="text-white font-semibold">{u.tiktokConnected}</div>
                      <div className="text-[11px] text-emerald-400 font-bold">
                        {u.tiktokFollowers.toLocaleString()} Follow
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {u.coinsBalance.toLocaleString()} Xu
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      <span className="text-purple-300 font-bold">{u.purchasedPackagesCount || 1} Gói</span>
                      <div className="text-[10px] text-slate-400">{u.escrowLockedAmountVND || '0đ'} Ký quỹ</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {u.status === 'active' ? 'Hoạt động' : 'Bị Khóa'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Báo Cáo Hoạt Động & Chống Gian Lận Button */}
                        <button
                          onClick={() => setInspectedUser(u)}
                          title="Xem Báo Cáo Hoạt Động (Ngày/Tuần/Tháng) & Đối Soát"
                          className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 text-[11px] font-bold border border-rose-500/40 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Activity className="w-3 h-3 text-rose-300" />
                          <span>Báo Cáo</span>
                        </button>

                        {/* Cấp Gói Button */}
                        <button
                          onClick={() => setInspectedUser(u)}
                          title="Cấp Gói Dịch Vụ Miễn Phí"
                          className="px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-[11px] font-bold border border-purple-500/30 transition-all flex items-center gap-1"
                        >
                          <Gift className="w-3 h-3" />
                          <span>Cấp Gói</span>
                        </button>

                        {/* Adjust Coins Button */}
                        <button
                          onClick={() => {
                            const amountStr = prompt(`Cộng / trừ Xu cho ${u.name} (VD: 50000 hoặc -10000):`);
                            if (amountStr) {
                              const amount = parseInt(amountStr, 10);
                              if (!isNaN(amount)) {
                                adminAdjustUserCoins(u.id, amount);
                              }
                            }
                          }}
                          title="Cộng/Trừ Xu"
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px]"
                        >
                          <Coins className="w-3.5 h-3.5" />
                        </button>

                        {/* Ban / Unban Toggle */}
                        <button
                          onClick={() => adminToggleUserStatus(u.id)}
                          title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                          className={`p-1.5 rounded-lg text-[11px] border transition-all ${
                            u.status === 'active'
                              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: Xác Minh Danh Tính KYC CCCD                                          */}
      {/* ========================================================================= */}
      {activeTab === 'kyc' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Quản Trị Hồ Sơ Xác Minh Danh Tính (KYC CCCD) ({kycRequests.length})
                </h3>
                <FeatureGuideTooltip
                  title="Quy Chuẩn Duyệt Hồ Sơ KYC Admin"
                  description="Quản trị viên đối soát ảnh thẻ CCCD/Hộ chiếu với họ tên và số tài khoản ngân hàng thụ hưởng trước khi cấp quyền rút tiền."
                  steps={[
                    "1. Kiểm tra ảnh chụp mặt trước & mặt sau CCCD (rõ nét, không cắt góc)",
                    "2. Đối chiếu họ tên trên CCCD với tên chủ tài khoản ngân hàng",
                    "3. Bấm 'Phê Duyệt KYC' để mở khóa tính năng rút tiền về ngân hàng",
                    "4. Nếu thông tin giả mạo hoặc dùng bot, bấm 'Từ Chối' và nhập lý do"
                  ]}
                  tips="Tài khoản đã KYC sẽ được gắn huy hiệu xanh lá 'Verified' và ưu tiên giải ngân tức thì."
                  badge="Kiểm Soát Người Thật"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bảo vệ tài sản người dùng, phòng chống rửa tiền và loại bỏ hoàn toàn bot spam trước khi rút tiền.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kycRequests.map((req) => (
              <div 
                key={req.userId}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.fullName}</span>
                      <span className="text-cyan-400 font-mono">({req.userEmail})</span>
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      Số CCCD: <strong className="text-white">{req.idNumber}</strong> • Ngày sinh: {req.dateOfBirth} • Nộp lúc: {req.submittedAt}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    req.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : req.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {req.status === 'verified' ? '✓ ĐÃ DUYỆT KYC' : req.status === 'pending' ? '⏳ CHỜ DUYỆT' : '✕ ĐÃ TỪ CHỐI'}
                  </span>
                </div>

                {/* Bank Details & Photos (Front, Back, Selfie) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Bank Info */}
                  <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                    <span className="text-slate-400 block font-semibold text-[11px]">Tài Khoản Ngân Hàng:</span>
                    <p className="text-white font-bold">{req.bankName}</p>
                    <p className="text-cyan-400 font-mono font-bold text-[12px]">{req.bankAccountNumber}</p>
                    <p className="text-slate-300 text-[11px]">Chủ tài khoản: <strong>{req.bankAccountHolder}</strong></p>
                    <div className="pt-1">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        ✓ 1 CCCD / 1 Tài khoản duy nhất
                      </span>
                    </div>
                  </div>

                  {/* Front Photo */}
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[11px] font-semibold font-mono">1. Mặt Trước CCCD:</span>
                    <a href={req.frontIdCardUrl} target="_blank" rel="noreferrer" className="block h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                      <img src={req.frontIdCardUrl} alt="Front ID" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </a>
                  </div>

                  {/* Back Photo */}
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[11px] font-semibold font-mono">2. Mặt Sau CCCD:</span>
                    <a href={req.backIdCardUrl} target="_blank" rel="noreferrer" className="block h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                      <img src={req.backIdCardUrl} alt="Back ID" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </a>
                  </div>

                  {/* Selfie Photo */}
                  <div className="space-y-1">
                    <span className="text-purple-300 block text-[11px] font-semibold font-mono flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-pink-400" />
                      <span>3. Ảnh Chụp Selfie:</span>
                    </span>
                    <a href={req.selfiePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} target="_blank" rel="noreferrer" className="block h-28 rounded-xl overflow-hidden border border-purple-500/40 bg-black/40 group">
                      <img src={req.selfiePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} alt="Selfie" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                {req.status !== 'verified' && (
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const reason = prompt('Nhập lý do từ chối hồ sơ KYC:', 'Ảnh CCCD không rõ nét hoặc tên ngân hàng không trùng khớp');
                        if (reason) adminRejectKyc(req.userId, reason);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-bold"
                    >
                      Từ Chối KYC
                    </button>
                    <button
                      onClick={() => adminApproveKyc(req.userId)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg"
                    >
                      Phê Duyệt KYC (Mở Khóa Rút Tiền)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: Sổ Cái Biến Động Token Minh Bạch (Sàn Quản Trị)                     */}
      {/* ========================================================================= */}
      {activeTab === 'token_ledger' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-neonGold" />
                  Sổ Cái Biến Động Xu Minh Bạch ({tokenLedger.length} Giao Dịch)
                </h3>
                <FeatureGuideTooltip
                  title="Cơ Chế Kinh Tế Xu Minh Bạch 100%"
                  description="Sàn quản trị phần Xu thưởng cho người dùng. Người dùng làm nhiệm vụ để tích lũy Xu, sau đó rút sang tiền mặt, nạp tiền lấy Xu hoặc dùng Xu tạo chiến dịch đẩy kênh. 1 Xu = 1 VNĐ tiền mặt."
                  steps={[
                    "Tỷ giá cố định: 1 Xu = 1 VNĐ (Bảo chứng tài chính minh bạch 100%)",
                    "Cấp phát: Sàn tự động cấp Xu khi user làm nhiệm vụ hoặc qua quản trị Admin",
                    "Tiêu thụ hấp thụ: Tạo chiến dịch kéo Follow, Tim, Mắt Live hoặc mua gói dịch vụ",
                    "Quy đổi tiền mặt: Rút về ngân hàng sau khi hoàn tất KYC"
                  ]}
                  tips="Mọi giao dịch cộng/trừ Xu đều được ghi nhận vào sổ cái không thể chỉnh sửa."
                  badge="Sổ Cái Bất Biến"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Theo dõi chính xác tuyệt đối từng lượt cộng/trừ Xu cho từng tài khoản trên hệ thống
              </p>
            </div>

            <div className="text-right font-mono text-xs text-neonGold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              1 Xu = 1 VNĐ (Cố Định 100%)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Thời Gian</th>
                  <th className="p-3">Tài Khoản Gmail</th>
                  <th className="p-3">Loại Giao Dịch</th>
                  <th className="p-3">Số Lượng Token</th>
                  <th className="p-3">Giá Trị VNĐ</th>
                  <th className="p-3">Ghi Chú Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                {tokenLedger.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 text-slate-400">{tx.createdAt}</td>
                    <td className="p-3 text-cyan-400 font-semibold">{tx.userEmail}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.tokenAmount > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-3 font-black ${tx.tokenAmount > 0 ? 'text-emerald-400' : 'text-neonGold'}`}>
                      {tx.tokenAmount > 0 ? `+${tx.tokenAmount}` : tx.tokenAmount} TOKEN
                    </td>
                    <td className="p-3 text-white font-bold">{tx.vndValue}</td>
                    <td className="p-3 text-slate-300 text-xs font-sans">{tx.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Cấu Hình Hoa Hồng & Ăn Chia Sàn Tự Động                           */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-6 shadow-xl max-w-4xl">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Cấu Hình Tỷ Lệ Hoa Hồng & Phí Sàn Ăn Chia Tự Động
              </h3>
              <FeatureGuideTooltip
                title="Chính Sách Phân Chia Doanh Thu Sàn"
                description="Thiết lập tỷ lệ ăn chia tự động minh bạch giữa Sàn, Người giới thiệu (Affiliate) và Quỹ trả thưởng người dùng (Task Pool)."
                steps={[
                  "Hoa Hồng Affiliate (Mặc định 10%): Trích trả ngay cho người giới thiệu khi F1 nạp tiền hoặc mua gói",
                  "Phí Dịch Vụ Ký Quỹ Escrow (Mặc định 20%): Phí sàn trung gian bảo chứng giữ tiền an toàn 100% cho hợp đồng KOC, khách hàng & đối tác",
                  "Quỹ Trả Thưởng Nhiệm Vụ (Mặc định 70%): Tỷ lệ tiền gói dịch vụ được phân bổ thành Xu chia cho 154,200+ user làm nhiệm vụ",
                  "Lợi Nhuận Thuần Của Sàn: Phần còn lại sau khi trừ các chi phí duy trì máy chủ và cổng thanh toán"
                ]}
                tips="Điều chỉnh Quỹ trả thưởng cao hơn sẽ kích thích user hoàn thành nhiệm vụ nhanh gấp 3 lần."
                badge="Thuật Toán Phân Bổ Tiền"
                placement="right"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống tự động phân chia doanh thu mỗi khi phát sinh giao dịch mua gói hoặc booking KOC.
            </p>
          </div>

          <form onSubmit={handleSaveCommissionSettings} className="space-y-5">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white">
                  Tỷ Lệ Hoa Hồng Tiếp Thị Liên Kết (Affiliate Commission):
                </label>
                <span className="text-base font-black font-mono text-emerald-400">{affiliateRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={affiliateRate}
                onChange={(e) => setAffiliateRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Người giới thiệu sẽ nhận được {affiliateRate}% trên tổng số tiền khách hàng được giới thiệu nạp vào sàn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white">
                  Phí Dịch Vụ Sàn Ký Quỹ Booking Escrow (Platform Escrow Fee):
                </label>
                <span className="text-base font-black font-mono text-purple-400">{escrowFee}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={0.5}
                value={escrowFee}
                onChange={(e) => setEscrowFee(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Sàn sẽ trích giữ {escrowFee}% trên giá trị mỗi hợp đồng booking KOC thành công để duy trì két an toàn, bảo hiểm rủi ro và tòa trọng tài phân xử đảm bảo 100% quyền lợi cho Khách hàng, Đối tác và KOC.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-white">
                  Ngân Sách Chia Thưởng Cho Người Làm Nhiệm Vụ (Task Pool):
                </label>
                <span className="text-base font-black font-mono text-cyan-400">{taskPoolRate}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={taskPoolRate}
                onChange={(e) => setTaskPoolRate(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Khi khách hàng mua gói follow/tim, {taskPoolRate}% ngân sách được quy đổi thành Xu trả thưởng trực tiếp cho cộng đồng người dùng lướt video.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSavedSettings && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình mới thành công!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
                >
                  Lưu & Áp Dụng Toàn Sàn
                </button>
              </div>
            </div>

          </form>

          {/* ========================================================================= */}
          {/* ĐỒNG BỘ QUẢN TRỊ RÚT TIỀN: 10:00 SÁNG THỨ HAI • MIN 200,000đ • KYC CCCD  */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Cấu Hình Lịch Rút Tiền Định Kỳ (Thứ Hai 10:00 AM • Min 200,000đ)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Đồng bộ toàn bộ cổng rút tiền người dùng với hệ thống đối soát ngân hàng
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LỊCH: THỨ HAI 10:00 SÁNG
              </span>
            </div>

            {/* 4 Config cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Thời Gian Giải Ngân:</span>
                <div className="text-sm font-black text-amber-400">10:00 Sáng Thứ Hai</div>
                <p className="text-[10px] text-slate-500">Định kỳ hàng tuần</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Thời Gian Xử Lý:</span>
                <div className="text-sm font-black text-emerald-400">Trong vòng 24 giờ</div>
                <p className="text-[10px] text-slate-500">Qua Napas247</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Mức Rút Tối Thiểu:</span>
                <div className="text-sm font-black text-white">200,000 VNĐ</div>
                <p className="text-[10px] text-slate-500">Tương đương 200,000 Xu</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px]">Phí Rút Sàn:</span>
                <div className="text-sm font-black text-neonGold">5% (Thực nhận 95%)</div>
                <p className="text-[10px] text-slate-500">Bắt buộc KYC CCCD</p>
              </div>
            </div>

            {/* Admin Withdrawal Approval Queue Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Hàng Đợi Xét Duyệt Rút Tiền Đợt Thứ Hai ({adminWithdrawals.length} Lệnh)</span>
                </h5>
                <span className="text-[10px] text-slate-400 font-mono">Duyệt trước 10:00 Thứ Hai</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Mã Lệnh / Thành Viên</th>
                      <th className="p-3">Ngân Hàng &amp; STK Thụ Hưởng</th>
                      <th className="p-3 text-right">Số Tiền Rút</th>
                      <th className="p-3 text-right">Thực Nhận (95%)</th>
                      <th className="p-3 text-center">Xác Minh CCCD</th>
                      <th className="p-3 text-center">Trạng Thái / Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                    {adminWithdrawals.map((req) => (
                      <tr key={req.id} className="hover:bg-white/[0.02]">
                        <td className="p-3">
                          <div className="font-bold text-white">{req.userName}</div>
                          <div className="text-[10px] text-slate-400">{req.userHandle} • {req.requestDate}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-white font-bold">{req.bankName}</div>
                          <div className="text-[11px] text-slate-400">{req.accountNumber} ({req.accountHolder})</div>
                        </td>
                        <td className="p-3 text-right font-black text-white">
                          {req.amountVND.toLocaleString()}đ
                        </td>
                        <td className="p-3 text-right font-black text-emerald-400">
                          {req.netPayoutVND.toLocaleString()}đ
                          <span className="block text-[9px] text-slate-500 font-normal">Phí 5%: -{req.feePlatform.toLocaleString()}đ</span>
                        </td>
                        <td className="p-3 text-center">
                          {req.kycVerified ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ĐÃ KYC ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              CHƯA KYC ⚠️
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {req.status === 'approved' ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              ĐÃ DUYỆT (CHỜ THỨ HAI)
                            </span>
                          ) : req.status === 'rejected' ? (
                            <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                              ĐÃ TỪ CHỐI
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleApproveWithdrawal(req.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shadow-sm"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(req.id)}
                                className="px-2 py-1 rounded-lg bg-rose-600/40 hover:bg-rose-600 text-rose-200 hover:text-white text-[10px] font-bold transition-all"
                              >
                                Từ Chối
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: Quản Trị Tiếp Thị Liên Kết & Chống Spam Thưởng Giới Thiệu           */}
      {/* ========================================================================= */}
      {activeTab === 'referrals' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Trung Tâm Kiểm Soát Tiếp Thị &amp; Chống Gian Lận Thưởng Xu (+5,000 Xu)
                </h3>
                <FeatureGuideTooltip
                  title="Cơ Chế Chống Gian Lận Giới Thiệu Của Admin"
                  description="Để tránh tình trạng tạo nick ảo trục lợi Xu, người mới đăng ký BẮT BUỘC phải hoàn thành ít nhất 1 nhiệm vụ thật (follow hoặc xem video 15s) thì hệ thống mới cộng 5,000 Xu cho người mời."
                  steps={[
                    "Hệ thống kiểm tra ID thiết bị và liên kết kênh TikTok thật",
                    "Người mới hoàn thành nhiệm vụ -> Trạng thái chuyển thành 'Đã Xác Thực Người Thật'",
                    "Admin có quyền duyệt tay hoặc hủy bỏ các tài khoản bot nghi vấn"
                  ]}
                  badge="Chống Spam Bot 100%"
                  placement="bottom"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Giám sát toàn bộ lưu lượng mời bạn bè, trạng thái hoàn thành nhiệm vụ xác minh người thật và dòng tiền hoa hồng 25%.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/20">
                Tỷ Giá Thưởng: 5,000 Xu / User Thật
              </span>
            </div>
          </div>

          {/* 4 Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono">Tổng Xu Thưởng Đã Cấp</span>
              <div className="text-2xl font-black text-neonGold font-mono font-mono-numbers">
                {affiliateData.referralBonusCoinsTotal.toLocaleString()} Xu
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">100% Cấp cho user thật</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono">Tài Khoản Đã Kích Hoạt (Làm NV)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono font-mono-numbers">
                {affiliateData.referralActivatedCount} User
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Đã xác minh người thật</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono">Tài Khoản Chờ Làm Nhiệm Vụ</span>
              <div className="text-2xl font-black text-amber-400 font-mono font-mono-numbers">
                {affiliateData.referralPendingCount} User
              </div>
              <span className="text-[10px] text-amber-300 font-mono">Chưa cộng Xu (Tạm giữ)</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono">Tổng Hoa Hồng 25% Chi Trả</span>
              <div className="text-2xl font-black text-purple-400 font-mono font-mono-numbers">
                {affiliateData.totalCommissionVND}
              </div>
              <span className="text-[10px] text-purple-300 font-mono">Từ đơn nạp/mua gói</span>
            </div>
          </div>

          {/* Referral List Table */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white font-mono uppercase tracking-wider">
                Danh Sách Tuyến Dưới Cần Giám Sát Đối Soát
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Tự động đối soát API</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Thành Viên Tuyến Dưới</th>
                    <th className="p-2.5">Ngày Tham Gia</th>
                    <th className="p-2.5">Trạng Thái Xác Minh (1 Nhiệm Vụ)</th>
                    <th className="p-2.5 text-center">Xu Tặng (+5,000)</th>
                    <th className="p-2.5 text-right">Hoa Hồng Đơn Hàng</th>
                    <th className="p-2.5 text-center">Hành Động Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {affiliateData.referralsList.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/[0.02]">
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <img src={ref.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
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
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Đã Xác Thực (Người Thật)</span>
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{ref.taskCompletedType}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                              <span>Chưa làm nhiệm vụ (Chờ)</span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        {ref.hasCompletedTask ? (
                          <span className="font-bold text-amber-400 font-mono-numbers">+5,000 Xu</span>
                        ) : (
                          <span className="text-slate-500 font-mono-numbers">Tạm giữ</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-emerald-400 font-mono-numbers">
                        {ref.earnedVND}
                      </td>
                      <td className="p-2.5 text-center">
                        {!ref.hasCompletedTask ? (
                          <button
                            onClick={() => simulateFriendTaskAction(ref.id, 'Admin duyệt tay xác minh')}
                            className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[10px] font-bold transition-all"
                            title="Admin duyệt tay và cộng +5,000 Xu cho tài khoản"
                          >
                            Duyệt Thưởng Tay
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">✓ Đã Hoàn Tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Trọng Tài Escrow & Phán Quyết Khiếu Nại Booking                    */}
      {/* ========================================================================= */}
      {activeTab === 'escrow' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-amber-400" />
                  Hội Đồng Trọng Tài Sàn - Phân Xử Khiếu Nại Booking Escrow
                </h3>
                <FeatureGuideTooltip
                  title="Quy Trình Phán Quyết Trọng Tài Sàn Escrow"
                  description="Khi có khiếu nại trong giai đoạn bảo hành 3 ngày (72 giờ) sau khi KOC nộp video demo, Admin sẽ đứng ra phân xử công minh dựa trên thỏa thuận ban đầu."
                  steps={[
                    "Xem lại hợp đồng: Thể loại video, thời lượng (1-10 phút), yêu cầu gắn giỏ hàng hay MC AI",
                    "Kiểm tra link video demo: Xem xét chất lượng hình ảnh, kịch bản, âm thanh có đúng cam kết",
                    "Phán quyết 1: Hoàn 100% tiền lại ví cho Brand nếu KOC làm sai yêu cầu hoặc trễ hạn",
                    "Phán quyết 2: Giải ngân tiền về tài khoản KOC nếu video đạt chuẩn và Brand vô cớ khiếu nại"
                  ]}
                  tips="Cả 2 bên đều có 72 giờ bảo hành để phản hồi trước khi tiền tự động được giải phóng."
                  badge="Trọng Tài Minh Bạch"
                  placement="right"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin giải phóng tiền cọc cho KOC nếu Brand khiếu nại sai, hoặc hoàn tiền lại cho Brand nếu KOC vi phạm cam kết video.
              </p>
            </div>
            <span className="text-xs text-rose-400 font-mono font-bold bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/30">
              {disputedBookings.length} Hợp đồng cần xử lý
            </span>
          </div>

          {/* Quy Chuẩn 4 Cấp Độ Chế Tài Xử Phạt KOC */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-rose-950/20 to-black border border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Khung Chế Tài Xử Phạt KOC Vi Phạm (Căn Cứ Phán Quyết Trọng Tài)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Bảo hộ 100% Bên Thuê</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[10px] font-mono">
              {KOC_PENALTY_TIERS.map((tier) => (
                <div key={tier.level} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Cấp {tier.level} ({tier.severity})</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${tier.badgeColor}`}>{tier.level === 4 ? 'VĨNH VIỄN' : 'PHẠT'}</span>
                  </div>
                  <p className="text-slate-400 text-[9px] line-clamp-2">{tier.violationDescription}</p>
                  <div className="text-rose-300 text-[9px] font-bold">{tier.financialPenalty}</div>
                </div>
              ))}
            </div>
          </div>

          {disputedBookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">Không có vụ tranh chấp nào đang chờ xử lý</h4>
              <p className="text-xs text-slate-400 mt-1">Toàn bộ hợp đồng booking đều diễn ra suôn sẻ hoặc đã được tất toán.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputedBookings.map((b) => (
                <div key={b.id} className="p-5 bg-slate-900 border border-rose-500/40 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                        {b.contractCode}
                      </span>
                      <span className="text-xs font-bold text-white">{b.title}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      Tiền đang giữ: {b.totalEscrowAmount}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 block font-semibold">Bên Thuê (Brand):</span>
                      <p className="text-white font-bold">{b.clientName}</p>
                      <p className="text-rose-300 text-[11px] pt-1">
                        <strong>Lý do khiếu nại:</strong> {b.disputeReason || 'Không hài lòng với video demo'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-800/60 rounded-xl space-y-1">
                      <span className="text-slate-400 block font-semibold">Bên KOC Thực Hiện:</span>
                      <p className="text-emerald-400 font-bold">{b.kocName} ({b.kocHandle})</p>
                      {b.demoVideoUrl && (
                        <div className="pt-1">
                          <a 
                            href={b.demoVideoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-blue-400 underline font-mono text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Link Video Demo Đã Nộp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => adminResolveDispute(b.id, 'refund_to_brand')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      Hoàn Tiền Cho Brand
                    </button>
                    <button
                      onClick={() => adminResolveDispute(b.id, 'release_to_koc')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      KOC Đạt Chuẩn - Giải Ngân
                    </button>
                    <button
                      onClick={() => {
                        setPenaltyModalBooking(b);
                        setPenaltyReason(b.disputeReason || 'KOC vi phạm hợp đồng Escrow');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-900/40 flex items-center gap-1.5 transition-all cursor-pointer font-mono"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>ÁP DỤNG CHẾ TÀI PHẠT KOC</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODAL THI HÀNH CHẾ TÀI XỬ PHẠT KOC */}
          {penaltyModalBooking && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-[#090D1A] rounded-3xl border-2 border-rose-500/40 shadow-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white font-mono">
                        Quyết Định Thi Hành Chế Tài Xử Phạt KOC
                      </h3>
                      <p className="text-xs text-slate-400">
                        Hợp đồng {penaltyModalBooking.contractCode} • KOC: <strong className="text-emerald-400">{penaltyModalBooking.kocName}</strong> ({penaltyModalBooking.kocHandle})
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setPenaltyModalBooking(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chọn cấp độ vi phạm */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">
                    Chọn Cấp Độ Vi Phạm Cần Thi Hành:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {KOC_PENALTY_TIERS.map((tier) => (
                      <button
                        key={tier.level}
                        type="button"
                        onClick={() => setSelectedPenaltyLevel(tier.level as 1 | 2 | 3 | 4)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                          selectedPenaltyLevel === tier.level
                            ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30 text-white'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border font-mono ${tier.badgeColor}`}>
                            CẤP {tier.level}: {tier.severity.toUpperCase()}
                          </span>
                          {selectedPenaltyLevel === tier.level && (
                            <CheckCircle2 className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {tier.title}
                        </div>
                        <div className="text-[10px] text-rose-300 font-mono">
                          {tier.financialPenalty}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chi tiết chế tài áp dụng */}
                {(() => {
                  const currentTier = KOC_PENALTY_TIERS.find(t => t.level === selectedPenaltyLevel) || KOC_PENALTY_TIERS[0];
                  return (
                    <div className="p-3.5 rounded-2xl bg-black/50 border border-rose-500/30 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-rose-300 font-bold">
                        <span>⚡ Biện Pháp Xử Lý: {currentTier.penaltyAction}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        <strong>Hậu quả tài khoản:</strong> {currentTier.accountConsequence}
                      </div>
                      <div className="text-amber-300 text-[11px]">
                        <strong>Bồi hoàn Bên Thuê:</strong> Hoàn 100% tiền cọc ({penaltyModalBooking.totalEscrowAmount}) về ví bên thuê.
                      </div>
                    </div>
                  );
                })()}

                {/* Ghi chú biên bản phán quyết */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono">
                    Ghi Chú Biên Bản Phán Quyết Của Ban Trọng Tài:
                  </label>
                  <textarea
                    rows={2}
                    value={penaltyReason}
                    onChange={(e) => setPenaltyReason(e.target.value)}
                    placeholder="Nhập chi tiết vi phạm, link đối soát video hoặc hành vi chiếm đoạt sản phẩm mẫu..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPenaltyModalBooking(null)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    onClick={() => {
                      adminEnforceKocPenalty(penaltyModalBooking.id, selectedPenaltyLevel, penaltyReason, true);
                      setPenaltyModalBooking(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>XÁC NHẬN THI HÀNH CHẾ TÀI CẤP {selectedPenaltyLevel}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Hàng Đợi Duyệt Chiến Dịch Khách Hàng                              */}
      {/* ========================================================================= */}
      {activeTab === 'campaigns' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-500" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Hàng Đợi Duyệt Chiến Dịch Khách Hàng ({adminData.campaignsQueue.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Tự động đối soát TikTok API</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Khách Hàng / Thương Hiệu</th>
                  <th className="p-3">Loại Chiến Dịch</th>
                  <th className="p-3">Số Lượng</th>
                  <th className="p-3">Ngân Sách</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {adminData.campaignsQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-bold text-white">{item.client}</td>
                    <td className="p-3 text-slate-300 font-mono">{item.type}</td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{item.quantity.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-amber-400">{item.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === 'Chờ duyệt'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.status === 'Đang chạy'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {item.status === 'Chờ duyệt' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveCampaign(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => rejectCampaign(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px]"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Đã kích hoạt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: HỒ SƠ CHI TIẾT USER & CẤP QUYỀN TOÀN DIỆN                         */}
      {/* ========================================================================= */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <img 
                  src={inspectedUser.avatar} 
                  alt="" 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500" 
                />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{inspectedUser.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                      Hạng {inspectedUser.rankLevel}
                    </span>
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">{inspectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectedUser(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-mono">Số Dư Xu</span>
                  <div className="text-base font-black text-amber-400 font-mono">
                    {inspectedUser.coinsBalance.toLocaleString()} Xu
                  </div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-mono">Follow Kênh TikTok</span>
                  <div className="text-base font-black text-cyan-400 font-mono">
                    {inspectedUser.tiktokFollowers.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-mono">Gói Đã Sở Hữu</span>
                  <div className="text-base font-black text-purple-400 font-mono">
                    {inspectedUser.purchasedPackagesCount || 1} Gói
                  </div>
                </div>
              </div>

              {/* Action 1: Cấp Gói Trực Tiếp Cho User */}
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-400" />
                    Cấp Gói Dịch Vụ Miễn Phí Cho Tài Khoản Này (24 Gói):
                  </h4>
                  <span className="text-[10px] text-purple-300 font-mono">100% Miễn Phí</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {growthServices.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        adminGrantPackage(inspectedUser.id, pkg);
                        setInspectedUser({
                          ...inspectedUser,
                          purchasedPackagesCount: (inspectedUser.purchasedPackagesCount || 0) + 1
                        });
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 text-left text-xs transition-colors flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-white line-clamp-1">{pkg.title}</div>
                        <div className="text-[10px] text-slate-400">{pkg.price} ({pkg.unit}) • +{pkg.targetQuantity.toLocaleString()}</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] shrink-0">
                        Cấp
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action 2: Cộng Trừ Xu & Cộng Follow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Cộng Xu */}
                <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> Điều Chỉnh Số Dư Xu
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(inspectedUser.id, 50000);
                        setInspectedUser({ ...inspectedUser, coinsBalance: inspectedUser.coinsBalance + 50000 });
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px]"
                    >
                      +50,000 Xu
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(inspectedUser.id, 200000);
                        setInspectedUser({ ...inspectedUser, coinsBalance: inspectedUser.coinsBalance + 200000 });
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px]"
                    >
                      +200,000 Xu
                    </button>
                  </div>
                </div>

                {/* Cộng Follow */}
                <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> Bơm Follow Kênh TikTok
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(inspectedUser.id, 1000);
                        setInspectedUser({ ...inspectedUser, tiktokFollowers: inspectedUser.tiktokFollowers + 1000 });
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px]"
                    >
                      +1,000 Follow
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(inspectedUser.id, 5000);
                        setInspectedUser({ ...inspectedUser, tiktokFollowers: inspectedUser.tiktokFollowers + 5000 });
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px]"
                    >
                      +5,000 Follow
                    </button>
                  </div>
                </div>

              </div>

              {/* Action 3: Báo Cáo Hoạt Động (Ngày, Tuần, Tháng) & Đối Soát Chống Trùng */}
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-400" />
                    Báo Cáo Hoạt Động & Kiểm Tra Chống Gian Lận:
                  </h4>

                  {/* Period filter buttons */}
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-mono">
                    <button
                      onClick={() => setInspectedPeriod('day')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        inspectedPeriod === 'day' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Hôm Nay
                    </button>
                    <button
                      onClick={() => setInspectedPeriod('week')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        inspectedPeriod === 'week' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tuần Này
                    </button>
                    <button
                      onClick={() => setInspectedPeriod('month')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        inspectedPeriod === 'month' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tháng Này
                    </button>
                  </div>
                </div>

                {(() => {
                  const report = getActivityReport(inspectedPeriod);
                  const actionsList = Object.values(userCompletedActions);

                  return (
                    <div className="space-y-3">
                      {/* 6 stats cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-mono">Xem Video FYP</span>
                          <div className="text-sm font-bold text-cyan-400 font-mono">{report.videosWatched} lượt</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-mono">Follow Kênh</span>
                          <div className="text-sm font-bold text-rose-400 font-mono">{report.followsGiven} lượt</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-mono">Thả Tim Video</span>
                          <div className="text-sm font-bold text-pink-400 font-mono">{report.likesGiven} lượt</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-mono">Bình Luận Seeding</span>
                          <div className="text-sm font-bold text-purple-400 font-mono">{report.commentsGiven} lượt</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-mono">Chia Sẻ Clip</span>
                          <div className="text-sm font-bold text-blue-400 font-mono">{report.sharesGiven} lượt</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
                          <span className="text-[10px] text-amber-300 font-mono">Tổng Xu Nhận</span>
                          <div className="text-sm font-black text-neonGold font-mono">+{report.totalCoinsEarned.toLocaleString()} Xu</div>
                        </div>
                      </div>

                      {/* Anti-fraud details */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-300 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Nhật Ký Chống Trùng Lặp ({actionsList.length} kênh):</span>
                          </span>
                          <span className="text-emerald-400">100% Khách Hàng Được Bảo Vệ</span>
                        </div>
                        <div className="max-h-36 overflow-y-auto space-y-1 text-[10px] font-mono text-slate-400 pr-1">
                          {actionsList.map((action, idx) => (
                            <div key={action.taskId || idx} className="flex items-center justify-between py-1 border-b border-slate-800 last:border-0">
                              <span className="text-white font-bold">{action.taskId}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-emerald-400">
                                  {action.followed ? 'Follow ' : ''}
                                  {action.viewed ? 'Xem ' : ''}
                                  {action.liked ? 'Tim ' : ''}
                                  {action.commented ? 'CMT ' : ''}
                                </span>
                                <span className="text-amber-300 font-bold">+{action.totalCoinsEarned.toLocaleString()} Xu</span>
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Khóa trùng OK</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM / SỬA APP KIẾM TIỀN (ADMIN CRUD)                             */}
      {/* ========================================================================= */}
      {adminAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D111E] border border-purple-500/40 p-6 space-y-5 relative shadow-2xl no-scrollbar"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sticky top-0 bg-[#0D111E] z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  {editingAdminAppId ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-display">
                    {editingAdminAppId ? 'Admin: Chỉnh Sửa Thông Tin Ứng Dụng' : 'Admin: Thêm Ứng Dụng Mới Vào Kho'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Thay đổi ảnh thumbnail, tiêu đề, tính năng và giá Xu</p>
                </div>
              </div>
              <button 
                onClick={() => setAdminAppModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminAppTitle.trim()) {
                  showToast('❌ Vui lòng nhập tên ứng dụng!');
                  return;
                }

                const highlightsArr = adminAppHighlights
                  .split('\n')
                  .map(s => s.trim())
                  .filter(Boolean);

                const featuresArr = adminAppFeatures
                  .split('\n')
                  .map(s => s.trim())
                  .filter(Boolean);

                if (editingAdminAppId) {
                  updateSoftwareApp(editingAdminAppId, {
                    title: adminAppTitle,
                    category: adminAppCategory,
                    tag: adminAppTag,
                    priceXu: Number(adminAppPriceXu),
                    thumbnail: adminAppThumbnail,
                    version: adminAppVersion,
                    developer: adminAppDeveloper,
                    badge: adminAppBadge,
                    downloadUrl: adminAppDownloadUrl,
                    description: adminAppDescription,
                    highlights: highlightsArr.length > 0 ? highlightsArr : ['Tính năng cao cấp'],
                    features: featuresArr.length > 0 ? featuresArr : ['Bản quyền trọn đời']
                  });
                } else {
                  addSoftwareApp({
                    title: adminAppTitle,
                    category: adminAppCategory,
                    tag: adminAppTag,
                    priceXu: Number(adminAppPriceXu),
                    thumbnail: adminAppThumbnail,
                    version: adminAppVersion,
                    developer: adminAppDeveloper,
                    platformCompatibility: ['Windows', 'MacOS', 'Web App'],
                    badge: adminAppBadge,
                    downloadUrl: adminAppDownloadUrl,
                    description: adminAppDescription,
                    highlights: highlightsArr.length > 0 ? highlightsArr : ['Tính năng cao cấp'],
                    features: featuresArr.length > 0 ? featuresArr : ['Bản quyền trọn đời']
                  });
                }

                setAdminAppModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Tên Ứng Dụng / Phần Mềm *</label>
                  <input
                    type="text"
                    required
                    value={adminAppTitle}
                    onChange={(e) => setAdminAppTitle(e.target.value)}
                    placeholder="VD: TikTok HD Video Downloader Pro"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Danh Mục Phân Loại *</label>
                  <select
                    value={adminAppCategory}
                    onChange={(e) => setAdminAppCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ai_script">AI Kịch Bản & Giọng Đọc</option>
                    <option value="video_tools">Xử Lý Video 4K & Audio</option>
                    <option value="analytics">Soi Kênh Đối Thủ & Trend</option>
                    <option value="tiktok_shop">TikTok Shop & Live</option>
                    <option value="growth_auto">Tự Động Hóa & Đa Kênh</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price Xu & Tag */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Giá Bán Bằng Xu (1 Xu = 1 VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={10000}
                    value={adminAppPriceXu}
                    onChange={(e) => setAdminAppPriceXu(Number(e.target.value))}
                    placeholder="VD: 500000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-neonGold font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">≈ {adminAppPriceXu.toLocaleString()}đ</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Tag Hiển Thị *</label>
                  <input
                    type="text"
                    value={adminAppTag}
                    onChange={(e) => setAdminAppTag(e.target.value)}
                    placeholder="VD: Bán Chạy, Tiện Ích 4K..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Badge Nổi Bật</label>
                  <input
                    type="text"
                    value={adminAppBadge}
                    onChange={(e) => setAdminAppBadge(e.target.value)}
                    placeholder="VD: HOT AI TOOL, TOP 1..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 3: Thumbnail URL & Download URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">URL Ảnh Thumbnail Thu Nhỏ *</label>
                  <input
                    type="url"
                    required
                    value={adminAppThumbnail}
                    onChange={(e) => setAdminAppThumbnail(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                  {adminAppThumbnail && (
                    <div className="mt-1 h-16 w-32 rounded-lg overflow-hidden border border-slate-700">
                      <img src={adminAppThumbnail} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Link Tải Phần Mềm / URL Trải Nghiệm *</label>
                  <input
                    type="url"
                    required
                    value={adminAppDownloadUrl}
                    onChange={(e) => setAdminAppDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-cyan-400 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Row 4: Version & Developer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Phiên Bản</label>
                  <input
                    type="text"
                    value={adminAppVersion}
                    onChange={(e) => setAdminAppVersion(e.target.value)}
                    placeholder="VD: v3.5 Pro"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Nhà Phát Triển / Tác Giả</label>
                  <input
                    type="text"
                    value={adminAppDeveloper}
                    onChange={(e) => setAdminAppDeveloper(e.target.value)}
                    placeholder="VD: AVA FOLLOW Dev Labs"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Mô Tả Giới Thiệu Ngắn Gọn *</label>
                <textarea
                  rows={2}
                  required
                  value={adminAppDescription}
                  onChange={(e) => setAdminAppDescription(e.target.value)}
                  placeholder="Mô tả công dụng và lợi ích chính của ứng dụng..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Highlights & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Điểm Nổi Bật (Mỗi dòng 1 ý)</label>
                  <textarea
                    rows={3}
                    value={adminAppHighlights}
                    onChange={(e) => setAdminAppHighlights(e.target.value)}
                    placeholder="Hook 3s giữ chân người xem&#10;Tự động tạo 50 kịch bản&#10;Xuất file chuẩn CapCut"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Tính Năng Chi Tiết (Mỗi dòng 1 ý)</label>
                  <textarea
                    rows={3}
                    value={adminAppFeatures}
                    onChange={(e) => setAdminAppFeatures(e.target.value)}
                    placeholder="Tích hợp GPT-4o & Claude 3.5&#10;Gợi ý từ khóa SEO trend&#10;Bản quyền trọn đời"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>
              </div>

              {/* Footer Save button */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAdminAppModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold shadow-lg shadow-purple-900/40"
                >
                  {editingAdminAppId ? 'Lưu Cập Nhật Ứng Dụng' : 'Xác Nhận Thêm Vào Kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB: QUẢN LÝ NHIỆM VỤ TUẦN (Admin Mission Config)                      */}
      {/* ====================================================================== */}
      {activeTab === 'missions' && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* Header */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 to-purple-950/40 border border-rose-500/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-base font-black text-white font-display">Quản Lý Nhiệm Vụ Hàng Tuần</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Cấu hình số lượng nhiệm vụ, phần thưởng và chính sách theo từng cấp bậc và gói dịch vụ. Nhiệm vụ sẽ tự động xào trộn ngẫu nhiên mỗi tuần cho từng tài khoản.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
                <div className="text-xs font-mono text-amber-300 font-bold">Tuần Hiện Tại</div>
                <div className="text-xl font-black text-amber-400 font-mono">#{Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 52 + 1}</div>
                <div className="text-[10px] text-slate-400 font-mono">Reset mỗi thứ 2</div>
              </div>
            </div>
          </div>

          {/* 3 LOẠI NHIỆM VỤ CHÍNH TRONG HỆ THỐNG (CƠ CHẾ THIẾT LẬP & DÒNG TIỀN) */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border-2 border-indigo-500/40 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                    THIẾT LẬP & QUẢN TRỊ 3 LOẠI NHIỆM VỤ CỐT LÕI CỦA SÀN
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Phân tách dòng tiền minh bạch: Follow Chéo (User-to-User) • Chiến Dịch (Paid Direct) • Nhiệm Vụ Dự Án (Dòng tiền về Sàn, Trả thưởng tổng)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                ● 3/3 Luồng Đang Hoạt Động Ổn Định
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Loại 1: Follow Chéo */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 font-mono flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" /> 1. FOLLOW CHÉO NHAU
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">Tự Do</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Người đi follow:</span>
                    <strong className="text-emerald-400">Nhận Xu lẻ từng lượt (+200đ)</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Người được follow:</span>
                    <strong className="text-cyan-300">Nhận follow/tim về kênh</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dòng tiền ví:</span>
                    <span className="text-slate-300 font-mono">User ⇄ User</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * Tương tác mở không giới hạn. Dành cho người dùng mới tích lũy vốn và kéo tương tác kênh tự nhiên.
                </p>
              </div>

              {/* Loại 2: Chiến Dịch Paid */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> 2. CHẠY CHIẾN DỊCH (PAID)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">Trực Tiếp</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Bên tạo chiến dịch:</span>
                    <strong className="text-white">Nạp 100% cọc Smart Escrow</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Người làm chiến dịch:</span>
                    <strong className="text-neonGold">Nhận Xu trực tiếp từng job</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số lượng suất:</span>
                    <span className="text-amber-300 font-mono">Có hạn • Ai nhanh được trước</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * Gồm xem video ngắn, mắt live 1p-60p, seeding giỏ hàng, booking KOC. Tiền cọc bảo hành 3 ngày.
                </p>
              </div>

              {/* Loại 3: Nhiệm Vụ Dự Án */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/50 space-y-3 ring-1 ring-rose-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-300 font-mono flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-rose-400" /> 3. NHIỆM VỤ DỰ ÁN (SÀN CẤP)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 text-[9px] font-mono font-bold">Bắt Buộc</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Nguồn kênh:</span>
                    <strong className="text-white">Lấy từ các tài khoản cần follow</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Dòng tiền nạp kênh:</span>
                    <strong className="text-amber-400">ĐẨY NGƯỢC 100% VỀ SÀN</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Quy tắc thưởng:</span>
                    <strong className="text-rose-400">KHÔNG THƯỞNG XU LẺ</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thưởng hoàn thành:</span>
                    <strong className="text-emerald-400">Chỉ nhận SỐ XU TỔNG khi đủ 100%</strong>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-300/90 italic pt-1">
                  * Bắt buộc mỗi ngày: Tài khoản làm đủ sẽ được tăng cấp bậc (Đồng→Kim Cương) và được ĐỀ XUẤT NHIỀU HƠN để nhận chiến dịch lớn & nhân x3.0 thù lao!
                </p>
              </div>
            </div>
          </div>

          {/* Rank Config Table */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Target className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">Cấu Hình Slot Nhiệm Vụ Theo Cấp Bậc</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['Đồng', 'Bạc', 'Vàng', 'Kim Cương'] as const).map((rank) => {
                const cfg = RANK_MISSION_CONFIG.rankSlots[rank];
                const colors: Record<string, string> = {
                  'Đồng': 'border-orange-500/40 bg-orange-950/20',
                  'Bạc': 'border-slate-400/40 bg-slate-800/20',
                  'Vàng': 'border-amber-500/40 bg-amber-950/20',
                  'Kim Cương': 'border-cyan-400/40 bg-cyan-950/20',
                };
                const icons: Record<string, string> = { 'Đồng': '🥉', 'Bạc': '🥈', 'Vàng': '🥇', 'Kim Cương': '💎' };
                return (
                  <div key={rank} className={`p-4 rounded-2xl border space-y-3 ${colors[rank]}`}>
                    <div className="text-sm font-black text-white">{icons[rank]} {rank}</div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily missions:</span>
                        <span className="font-bold text-cyan-400">{cfg.dailyMissionsCount} slot</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weekly missions:</span>
                        <span className="font-bold text-amber-400">{cfg.weeklyMissionsCount} slot</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reward ×:</span>
                        <span className="font-bold text-emerald-400">×{cfg.rewardMultiplier}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2">
                      Tổng tối đa: <strong className="text-white">{cfg.dailyMissionsCount + cfg.weeklyMissionsCount}</strong> nhiệm vụ/tuần
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Package bonus table */}
            <div className="pt-4 border-t border-white/5">
              <h5 className="text-xs font-bold text-white font-mono uppercase mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Bonus Slot Theo Gói Đã Mua
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.entries(RANK_MISSION_CONFIG.packageBonusSlots).map(([pkg, bonus]) => (
                  <div key={pkg} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                    <div className="text-[10px] font-mono font-bold text-white capitalize">{pkg}</div>
                    <div className="text-lg font-black text-purple-400 font-mono">+{bonus}</div>
                    <div className="text-[9px] text-slate-400">slot thêm</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Pool Table */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">Kho Nhiệm Vụ ({MISSION_POOL.length} Nhiệm Vụ)</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Tự động xào trộn mỗi tuần theo seed ngẫu nhiên
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-white/5">
                    <th className="text-left py-2 px-2">Nhiệm Vụ</th>
                    <th className="text-left py-2 px-2">Loại</th>
                    <th className="text-left py-2 px-2">Phân Loại</th>
                    <th className="text-center py-2 px-2">Min Rank</th>
                    <th className="text-right py-2 px-2">Reward Cơ Bản</th>
                    <th className="text-right py-2 px-2">Mục Tiêu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/3">
                  {MISSION_POOL.map((m) => {
                    const rankColors: Record<string, string> = {
                      'Đồng': 'text-orange-400 bg-orange-500/10',
                      'Bạc': 'text-slate-300 bg-slate-500/10',
                      'Vàng': 'text-amber-400 bg-amber-500/10',
                      'Kim Cương': 'text-cyan-400 bg-cyan-500/10',
                    };
                    const catColors: Record<string, string> = {
                      'daily': 'text-cyan-300 bg-cyan-500/10',
                      'weekly': 'text-amber-300 bg-amber-500/10',
                      'special': 'text-purple-300 bg-purple-500/10',
                    };
                    return (
                      <tr key={m.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-2.5 px-2">
                          <span className="mr-1.5">{m.icon}</span>
                          <span className="text-white font-bold">{m.title}</span>
                          <div className="text-[9px] text-slate-500 mt-0.5">{m.description.slice(0, 60)}...</div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-400">{m.type}</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${catColors[m.category]}`}>
                            {m.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${rankColors[m.minRank]}`}>
                            {m.minRank}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-black text-emerald-400">
                          +{m.baseRewardXu.toLocaleString()} Xu
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-300">
                          {m.targetCount}×
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Earning potential summary */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Thu Nhập Tối Đa Mỗi Tuần Theo Cấp Bậc
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { rank: 'Đồng',      mult: 1.0, daily: 3, weekly: 2, color: 'from-orange-950/30 border-orange-500/30', icon: '🥉' },
                { rank: 'Bạc',       mult: 1.5, daily: 5, weekly: 3, color: 'from-slate-800/40  border-slate-400/30',  icon: '🥈' },
                { rank: 'Vàng',      mult: 2.0, daily: 8, weekly: 5, color: 'from-amber-950/40  border-amber-500/30',  icon: '🥇' },
                { rank: 'Kim Cương', mult: 3.0, daily:12, weekly: 7, color: 'from-cyan-950/50   border-cyan-400/30',   icon: '💎' },
              ]).map(({ rank, mult, daily, weekly, color, icon }) => {
                const avgMission = 2000;
                const weeklyMax = Math.round((daily * 7 + weekly) * avgMission * mult);
                return (
                  <div key={rank} className={`p-3 rounded-2xl bg-gradient-to-b ${color} border space-y-2`}>
                    <div className="text-sm font-black text-white">{icon} {rank}</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      ~{(weeklyMax / 1000).toFixed(0)}K
                    </div>
                    <div className="text-[10px] text-slate-400">Xu/tuần (ước tính)</div>
                    <div className="text-[10px] font-mono text-slate-300">
                      {daily * 7 + weekly} nhiệm vụ × ×{mult}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              * Ước tính dựa trên reward trung bình 2,000 Xu/nhiệm vụ. Thực tế phụ thuộc vào các nhiệm vụ được xào trộn ngẫu nhiên trong tuần và gói dịch vụ đã mua.
            </p>
          </div>

        </div>
      )}

      {/* STAFF ROLES TAB */}
      {activeTab === 'staff_roles' && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* Header */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white font-display">Phân Quyền Nhân Sự Quản Lý</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Thiết lập vai trò và quyền hạn cho từng nhân sự theo bộ phận. Khi giao việc, nhân sự tự chủ quản lý công việc trong phạm vi quyền hạn được cấp.
                </p>
              </div>
              <button
                onClick={() => setAddStaffOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Thêm Nhân Sự
              </button>
            </div>
          </div>

          {/* Role definitions */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Bảng Phân Quyền Theo Vai Trò
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {([
                { role: 'super_admin',     label: '👑 Super Admin',       color: 'border-rose-500/40 bg-rose-950/20',     text: 'text-rose-300',    perms: ['Toàn quyền hệ thống','Phân quyền nhân sự','Duyệt mọi giao dịch','Cấu hình nền tảng'] },
                { role: 'finance_manager', label: '💰 Quản Lý Tài Chính', color: 'border-amber-500/40 bg-amber-950/20',  text: 'text-amber-300',   perms: ['Duyệt rút tiền','Xem báo cáo doanh thu','Điều chỉnh Xu người dùng','Xuất sao kê'] },
                { role: 'kyc_officer',     label: '🪪 Nhân Viên KYC',    color: 'border-cyan-500/40 bg-cyan-950/20',    text: 'text-cyan-300',    perms: ['Duyệt/từ chối KYC','Xem hồ sơ người dùng','Gắn cờ tài khoản nghi vấn'] },
                { role: 'customer_support',label: '🎧 CSKH',              color: 'border-blue-500/40 bg-blue-950/20',    text: 'text-blue-300',    perms: ['Tra cứu tài khoản','Xem lịch sử giao dịch','Gửi thông báo người dùng','Xử lý khiếu nại'] },
                { role: 'koc_manager',     label: '🎬 Quản Lý KOC',      color: 'border-pink-500/40 bg-pink-950/20',    text: 'text-pink-300',    perms: ['Duyệt đơn booking','Xem hợp đồng Escrow','Quản lý KOC/KOL profile','Xét duyệt đối tác'] },
                { role: 'campaign_manager',label: '📣 Quản Lý Chiến Dịch',color: 'border-purple-500/40 bg-purple-950/20',text: 'text-purple-300', perms: ['Tạo/sửa chiến dịch','Duyệt chiến dịch đối tác','Quản lý ngân sách quảng bá','Theo dõi hiệu quả'] },
                { role: 'tech_admin',      label: '⚙️ Kỹ Thuật',         color: 'border-emerald-500/40 bg-emerald-950/20', text: 'text-emerald-300', perms: ['Quản lý App Marketplace','Cập nhật cấu hình hệ thống','Xem log kỹ thuật'] },
              ]).map(({ role, label, color, text, perms }) => (
                <div key={role} className={`p-3.5 rounded-2xl border space-y-2 ${color}`}>
                  <div className={`text-sm font-black ${text}`}>{label}</div>
                  <ul className="space-y-1">
                    {perms.map(p => (
                      <li key={p} className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Staff table */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Danh Sách Nhân Sự ({staffList.length} người)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-white/5">
                    <th className="text-left py-2 px-2">Nhân Sự</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Bộ Phận</th>
                    <th className="text-center py-2 px-2">Vai Trò</th>
                    <th className="text-center py-2 px-2">Trạng Thái</th>
                    <th className="text-right py-2 px-2">Đăng Nhập Gần Nhất</th>
                    <th className="text-center py-2 px-2">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/3">
                  {staffList.map(staff => {
                    const roleColors: Record<string, string> = {
                      super_admin: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                      finance_manager: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                      kyc_officer: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                      customer_support: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                      koc_manager: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
                      campaign_manager: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                      tech_admin: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    };
                    const roleLabels: Record<string, string> = {
                      super_admin: '👑 Super Admin', finance_manager: '💰 Tài Chính',
                      kyc_officer: '🪪 KYC', customer_support: '🎧 CSKH',
                      koc_manager: '🎬 KOC Mgr', campaign_manager: '📣 Campaign',
                      tech_admin: '⚙️ Tech',
                    };
                    return (
                      <tr key={staff.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-[10px]">
                              {staff.name.charAt(0)}
                            </div>
                            <span className="text-white font-bold">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-400">{staff.email}</td>
                        <td className="py-3 px-2 text-slate-300">{staff.dept}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${roleColors[staff.role] || 'bg-white/10 text-slate-300 border-white/10'}`}>
                            {roleLabels[staff.role] || staff.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                            staff.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {staff.status === 'active' ? '● Đang hoạt động' : '○ Tạm ngưng'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-slate-400">{staff.lastLogin}</td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
                                showToast(`Đã ${staff.status === 'active' ? 'tạm ngưng' : 'kích hoạt'} tài khoản ${staff.name}`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                                staff.status === 'active'
                                  ? 'bg-red-500/20 hover:bg-red-500/40 text-red-300'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300'
                              }`}
                            >
                              {staff.status === 'active' ? 'Ngưng' : 'Kích hoạt'}
                            </button>
                            <select
                              value={staff.role}
                              onChange={(e) => {
                                setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, role: e.target.value } : s));
                                showToast(`Đã cập nhật vai trò cho ${staff.name}`);
                              }}
                              className="bg-slate-900 border border-white/10 text-slate-300 text-[9px] rounded-lg px-1.5 py-1 cursor-pointer"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="finance_manager">Tài Chính</option>
                              <option value="kyc_officer">KYC</option>
                              <option value="customer_support">CSKH</option>
                              <option value="koc_manager">KOC Mgr</option>
                              <option value="campaign_manager">Campaign</option>
                              <option value="tech_admin">Tech</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add staff modal */}
          {addStaffOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-[#0D111E] rounded-3xl border border-indigo-500/30 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Thêm Nhân Sự Mới</h3>
                  <button onClick={() => setAddStaffOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text" placeholder="Họ và tên" value={newStaffName}
                    onChange={e => setNewStaffName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email" placeholder="Email công ty" value={newStaffEmail}
                    onChange={e => setNewStaffEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text" placeholder="Bộ phận" value={newStaffDept}
                    onChange={e => setNewStaffDept(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="super_admin">👑 Super Admin</option>
                    <option value="finance_manager">💰 Quản Lý Tài Chính</option>
                    <option value="kyc_officer">🪪 Nhân Viên KYC</option>
                    <option value="customer_support">🎧 CSKH</option>
                    <option value="koc_manager">🎬 Quản Lý KOC</option>
                    <option value="campaign_manager">📣 Quản Lý Chiến Dịch</option>
                    <option value="tech_admin">⚙️ Kỹ Thuật</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setAddStaffOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold">Hủy</button>
                  <button
                    onClick={() => {
                      if (!newStaffName || !newStaffEmail) { showToast('Vui lòng điền đầy đủ thông tin'); return; }
                      const newS = { id: `staff_${Date.now()}`, name: newStaffName, email: newStaffEmail, role: newStaffRole, dept: newStaffDept || 'Chưa phân bộ phận', status: 'active', lastLogin: 'Chưa đăng nhập' };
                      setStaffList(prev => [...prev, newS]);
                      showToast(`✅ Đã thêm nhân sự ${newStaffName} với vai trò ${newStaffRole}`);
                      setNewStaffName(''); setNewStaffEmail(''); setNewStaffDept('');
                      setAddStaffOpen(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold"
                  >
                    Thêm Nhân Sự
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 12: HỆ THỐNG BẢO MẬT AN TOÀN TUYỆT ĐỐI 7 LỚP & GIÁM SÁT IP           */}
      {/* ========================================================================= */}
      {activeTab === 'security_7layers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-500/40 space-y-3 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>HỆ THỐNG PHÒNG THỦ AN TOÀN TUYỆT ĐỐI 7 LỚP (ZERO TRUST ARCHITECTURE)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  Giám Sát Địa Chỉ IP, Chống Bot, Ngăn Chặn Gian Lận &amp; Đánh Phá Web
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Quy định kiểm soát nghiêm ngặt: <strong>Tối đa 5 tài khoản TikTok / 1 địa chỉ IP</strong>. Tự động phát hiện bot tự động, click farm ảo, DDOS và đóng băng các hành vi xâm nhập trái phép.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>7/7 Lá Chắn Hoạt Động</span>
                </span>
              </div>
            </div>

            {/* 4 Stats Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Quy Định Hạn Mức IP</span>
                <div className="text-lg font-black text-emerald-400 font-mono">Tối đa 5 Acc / IP</div>
                <span className="text-[10px] text-slate-500 font-mono">Chống clone farm hàng loạt</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Tổng Lượt Bot Đã Chặn</span>
                <div className="text-lg font-black text-rose-400 font-mono">6,145 Lượt</div>
                <span className="text-[10px] text-emerald-400 font-mono">100% Chặn thành công</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Tiêu Chuẩn Mã Hóa</span>
                <div className="text-lg font-black text-cyan-400 font-mono">AES 256-bit</div>
                <span className="text-[10px] text-slate-500 font-mono">SSL/TLS End-to-End</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">Thời Gian Uptime An Toàn</span>
                <div className="text-lg font-black text-amber-400 font-mono">99.99%</div>
                <span className="text-[10px] text-slate-500 font-mono">Zero Vulnerability</span>
              </div>
            </div>
          </div>

          {/* Chi Tiết 7 Lớp Bảo Mật Grid */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Cấu Trúc Chi Tiết 7 Lớp Phòng Thủ Sàn AVA FOLLOW
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {security7Layers.map((layer) => (
                <div
                  key={layer.layer}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        LỚP {layer.layer}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Đã chặn: <strong className="text-rose-400">{layer.blockedCount.toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl">{layer.icon}</span>
                      <h5 className="text-xs font-black text-white font-display">
                        {layer.name}
                      </h5>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {layer.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Mã: {layer.code}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Trực tuyến
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bảng Nhật Ký Bảo Mật & Giám Sát IP Realtime */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" /> Nhật Ký Giám Sát &amp; Ngăn Chặn IP Bất Thường
              </h4>
              <span className="text-xs font-mono text-slate-400">
                Hiển thị các sự kiện an ninh mới nhất
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3">Địa Chỉ IP</th>
                    <th className="p-3">Mã Sự Kiện</th>
                    <th className="p-3">Hành Vi &amp; Chi Tiết Xử Lý</th>
                    <th className="p-3 text-right">Mức Độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {securityAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 font-bold text-cyan-300">{log.ip}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/10 font-bold">
                          {log.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{log.detail}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                          log.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          log.severity === 'high' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                          log.severity === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
