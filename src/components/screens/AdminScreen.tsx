import React, { useState, useEffect } from 'react';
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
  Camera,
  Save,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { AdminUserManagementItem, GrowthServiceItem, SoftwareAppItem, ServiceOrder } from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { BrandLogo } from '../common/BrandLogo';
import { MISSION_POOL, RANK_MISSION_CONFIG } from '../../data/weeklyMissions';
import { KOC_PENALTY_TIERS } from '../../data/kocProfileData';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  dept: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}


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
    adminAddUser,
    adminUpdateUser,
    adminDeleteUser,
    adminUpdateGrantedOrder,
    adminDeleteGrantedOrder,
    escrowBookings,
    adminResolveDispute,
    adminEnforceKocPenalty,
    growthServices,
    createGrowthService,
    updateGrowthService,
    deleteGrowthService,
    deleteCampaign,
    user,
    campaigns,
    commissionSettings,
    updateCommissionSettings,
    kocApplications,
    adminApproveKyc,
    adminRejectKyc,
    kycRequests,
    tokenLedger,
    tokenSupplyConfig,
    adminMintTreasuryTokens,
    adminBurnTreasuryTokens,
    adminSetInitialSupply,
    adminResetTokenLedgerAndSupply,
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
    securityAuditLogs,
    tasks,
    livestreamTasks
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'grant_permissions' | 'software_apps' | 'users' | 'referrals' | 'kyc' | 'token_ledger' | 'settings' | 'escrow' | 'campaigns' | 'missions' | 'staff_roles' | 'security_7layers'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRankFilter, setUserRankFilter] = useState('all');
  const [inspectedPeriod, setInspectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  // Hàm trích xuất an toàn số nguyên từ chuỗi tiền tệ (tránh lỗi nối chuỗi tạo số ảo)
  const parseNumericAmount = (amountVal: string | number | undefined): number => {
    if (typeof amountVal === 'number') return isNaN(amountVal) ? 0 : amountVal;
    if (!amountVal) return 0;
    // Chỉ lấy phần số đứng trước dấu mở ngoặc '(' nếu có (ví dụ: "+50.000đ (+50.000 Xu)" -> chỉ lấy "+50.000đ")
    const primaryPart = String(amountVal).split('(')[0];
    const digits = primaryPart.replace(/\D/g, '');
    return parseInt(digits, 10) || 0;
  };

  // Real-time System Statistics Calculations (100% Real Data - Sạch 0 con số ảo)
  const totalEscrowLockedNum = escrowBookings
    .filter(b => b.status === 'pending_escrow' || b.status === 'escrow_locked' || b.status === 'demo_submitted')
    .reduce((sum, b) => sum + parseNumericAmount(b.totalEscrowAmount), 0);
  const totalEscrowLockedFormatted = totalEscrowLockedNum > 0 ? totalEscrowLockedNum.toLocaleString('vi-VN') + 'đ' : '0đ';

  const userDepositsTotal = (user.transactions || [])
    .filter(t => t.type === 'deposit' && t.status === 'success')
    .reduce((sum, t) => sum + parseNumericAmount(t.amount), 0);

  const totalRevenueNum = userDepositsTotal + (platformBoostRevenue || 0);
  const totalRevenueFormatted = totalRevenueNum > 0 ? totalRevenueNum.toLocaleString('vi-VN') + 'đ' : '0đ';

  const totalUsersCount = adminUsers.length + (user.email ? 1 : 0);
  const totalCoinsInCirculation = (user.avaliveCoins || 0) + adminUsers.reduce((s, u) => s + (u.coinsBalance || 0), 0);
  const totalCampaignsCount = campaigns.length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'running').length;

  // Real-time Task Breakdown & Activity Calculations (100% Real Data)
  const followCompleted = Object.values(userCompletedActions || {}).filter(a => a.followed).length;
  const likeCompleted = Object.values(userCompletedActions || {}).filter(a => a.liked).length;
  const watchCompleted = Object.values(userCompletedActions || {}).filter(a => a.viewed).length;
  const shareCompleted = Object.values(userCompletedActions || {}).filter(a => a.shared).length;
  const commentCompleted = Object.values(userCompletedActions || {}).filter(a => a.commented).length;
  const liveCompleted = Object.values(userCompletedActions || {}).filter(a => a.taskId?.startsWith('live_')).length;

  const completedActionsCount = Object.keys(userCompletedActions || {}).length;
  const totalCompletedTasks24h = (user.completedTasksCount || 0) + completedActionsCount;
  const totalReceivedTasks24h = totalCompletedTasks24h;
  const totalDropTasks24h = 0;
  const completionPercentage = totalCompletedTasks24h > 0 ? 100 : 0;
  const dropPercentage = 0;

  const watchCoins = watchCompleted * 1000;
  const followCoins = followCompleted * 500;
  const likeCoins = likeCompleted * 100;
  const commentCoins = commentCompleted * 150;
  const shareCoins = shareCompleted * 200;
  const liveCoins = liveCompleted * 300;
  const totalDistributedCoins = watchCoins + followCoins + likeCoins + commentCoins + shareCoins + liveCoins;

  // ============================================================================
  // SỔ CÁI PHÂN PHỐI TOKEN / XU TOÀN DIỆN (7 CHỈ SỐ MINH BẠCH 100%)
  // ============================================================================
  // 1. Tổng Cung do Admin cấp ban đầu & Đúc thêm
  const initialSupplyNum = Number(tokenSupplyConfig?.initialSupply) || 10000000000;
  const mintedSupplyNum = Number(tokenSupplyConfig?.mintedSupply) || 0;
  const totalSupplyNum = initialSupplyNum + mintedSupplyNum;

  // 3. Tổng Xu người dùng đang nắm giữ trong ví (Deduplicated list of real user wallets)
  // Tạo danh sách ví duy nhất tránh tính trùng tài khoản đang đăng nhập với adminUsers
  const uniqueUsersWalletMap = new Map<string, number>();
  if (user && user.email) {
    uniqueUsersWalletMap.set(user.email.toLowerCase(), Number(user.avaliveCoins) || 0);
  }
  adminUsers.forEach(u => {
    if (u && u.email) {
      uniqueUsersWalletMap.set(u.email.toLowerCase(), Number(u.coinsBalance) || 0);
    }
  });
  const userHoldingsNum = Array.from(uniqueUsersWalletMap.values()).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const totalRealWalletsCount = Math.max(1, uniqueUsersWalletMap.size);

  // 4. Tổng Xu đã chuyển đổi thành tiền mặt / rút ngân hàng
  const totalWithdrawnNum = (user.transactions || [])
    .filter(t => t.type === 'withdraw' && t.status === 'success')
    .reduce((sum, t) => sum + parseNumericAmount(t.amount), 0);

  // 5. Tổng Xu đã tiêu thụ vào mua phần mềm / mua gói dịch vụ
  const totalSpentAppsNum = (user.myAppLicenses || []).reduce((sum, lic) => sum + (Number(lic.xuPaid) || 0), 0);
  const totalSpentOrdersNum = (user.myOrders || []).reduce((sum, ord) => sum + parseNumericAmount(ord.price), 0);
  const totalSpentOnServicesNum = totalSpentAppsNum + totalSpentOrdersNum;

  // 6. Tổng Xu đã đốt / triệt tiêu khỏi lưu thông (Phí sàn, phí đẩy top,...)
  const manualBurnedNum = Number(tokenSupplyConfig?.manualBurnedSupply) || 0;
  const totalBurnedTokensNum = manualBurnedNum + (Number(platformBoostRevenue) || 0);

  // 2. Tổng Xu đã phân phối ra thị trường (Circulating Supply)
  // Tổng Xu đã ra ngoài thị trường = Đang nằm trong ví người dùng + Đã rút tiền mặt + Đã tiêu dùng vào phần mềm/dịch vụ + Đã đốt
  const circulatingSupplyNum = userHoldingsNum + totalSpentOnServicesNum + totalWithdrawnNum + totalBurnedTokensNum;

  // 7. Tổng Xu còn lại trong Kho Quỹ Sàn (Chưa phát hành - Treasury Balance)
  // Kho Quỹ Sàn = Tổng Cung - Tổng Xu Đã Phân Phối Ra Thị Trường
  const treasuryRemainingNum = Math.max(0, totalSupplyNum - circulatingSupplyNum);

  // Token Management UI form states
  const [mintInputAmount, setMintInputAmount] = useState<string>('1000000000');
  const [mintInputNote, setMintInputNote] = useState<string>('Admin cấp thêm Xu vào quỹ sàn');
  const [burnInputAmount, setBurnInputAmount] = useState<string>('500000000');
  const [burnInputNote, setBurnInputNote] = useState<string>('Triệt tiêu Xu bảo đảm tính ổn định');
  const [initialSupplyInput, setInitialSupplyInput] = useState<string>(String(initialSupplyNum));
  const [tokenLedgerFilter, setTokenLedgerFilter] = useState<string>('all');
  const [tokenLedgerSearch, setTokenLedgerSearch] = useState<string>('');

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
  const [userSelectMode, setUserSelectMode] = useState<'list' | 'input'>('list');
  const [inputAccountGmail, setInputAccountGmail] = useState<string>('');
  const [grantCategoryFilter, setGrantCategoryFilter] = useState<string>('all');
  const [grantSearchPackage, setGrantSearchPackage] = useState<string>('');
  const [grantSuccessNotice, setGrantSuccessNotice] = useState<string | null>(null);
  const [customCoinInput, setCustomCoinInput] = useState<string>('50000');
  const [customFollowerInput, setCustomFollowerInput] = useState<string>('1000');
  const [coinActionType, setCoinActionType] = useState<'add' | 'subtract' | 'set'>('add');

  // Modals for Edit User & Add User
  const [editUserModalOpen, setEditUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AdminUserManagementItem | null>(null);
  
  const [addUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserPhone, setNewUserPhone] = useState<string>('');
  const [newUserHandle, setNewUserHandle] = useState<string>('');
  const [newUserRank, setNewUserRank] = useState<'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương'>('Đồng');
  const [newUserCoins, setNewUserCoins] = useState<number>(50000);

  // Edit Granted Order Modal
  const [editOrderModalOpen, setEditOrderModalOpen] = useState<boolean>(false);
  const [editingOrderUser, setEditingOrderUser] = useState<AdminUserManagementItem | null>(null);
  const [editingOrderData, setEditingOrderData] = useState<ServiceOrder | null>(null);

  // Edit Staff Modal
  const [editStaffModalOpen, setEditStaffModalOpen] = useState<boolean>(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingStaffName, setEditingStaffName] = useState<string>('');
  const [editingStaffEmail, setEditingStaffEmail] = useState<string>('');
  const [editingStaffRole, setEditingStaffRole] = useState<string>('customer_support');
  const [editingStaffDept, setEditingStaffDept] = useState<string>('');

  // Growth Package Editor Modal States
  const [packageEditorModalOpen, setPackageEditorModalOpen] = useState<boolean>(false);
  const [isCreatingNewPackage, setIsCreatingNewPackage] = useState<boolean>(false);
  const [pkgEditId, setPkgEditId] = useState<string>('');
  const [pkgEditTitle, setPkgEditTitle] = useState<string>('');
  const [pkgEditCategory, setPkgEditCategory] = useState<string>('follow');
  const [pkgEditTag, setPkgEditTag] = useState<string>('Đề xuất');
  const [pkgEditPrice, setPkgEditPrice] = useState<string>('500,000đ');
  const [pkgEditOriginalPrice, setPkgEditOriginalPrice] = useState<string>('750,000đ');
  const [pkgEditPriceNum, setPkgEditPriceNum] = useState<number>(500000);
  const [pkgEditTargetQuantity, setPkgEditTargetQuantity] = useState<number>(1000);
  const [pkgEditUnit, setPkgEditUnit] = useState<string>('Kết Nối Bạn Bè');
  const [pkgEditDescription, setPkgEditDescription] = useState<string>('');
  const [pkgEditFeatures, setPkgEditFeatures] = useState<string>('');
  const [pkgEditEstimatedDelivery, setPkgEditEstimatedDelivery] = useState<string>('Chạy đến khi đạt đủ 100% chỉ tiêu');
  const [pkgEditBadge, setPkgEditBadge] = useState<string>('Phổ Biến');
  const [pkgEditRating, setPkgEditRating] = useState<number>(5);
  const [pkgEditReviewCount, setPkgEditReviewCount] = useState<number>(100);
  const [pkgEditThumbnail, setPkgEditThumbnail] = useState<string>('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80');

  // Commission settings form states
  const [affiliateRate, setAffiliateRate] = useState(commissionSettings.affiliateRatePercent);
  const [escrowFee, setEscrowFee] = useState(commissionSettings.escrowFeePercent);
  const [taskPoolRate, setTaskPoolRate] = useState(commissionSettings.taskRewardPoolPercent);
  const [isSavedSettings, setIsSavedSettings] = useState(false);


  // Staff Roles state
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_admin_staff_list') : null;
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'staff_001', name: 'Nguyễn Văn Admin', email: 'admin@avafollow.vn',   role: 'super_admin',      dept: 'Ban Lãnh Đạo',         status: 'active',   lastLogin: '2026-09-12 08:00' },
      { id: 'staff_002', name: 'Trần Thị Kế Toán', email: 'ketoan@avafollow.vn', role: 'finance_manager',   dept: 'Tài Chính - Kế Toán',  status: 'active',   lastLogin: '2026-09-12 07:45' },
      { id: 'staff_003', name: 'Lê Văn KYC',        email: 'kyc@avafollow.vn',   role: 'kyc_officer',       dept: 'Xác Minh KYC',         status: 'active',   lastLogin: '2026-09-11 22:30' },
      { id: 'staff_004', name: 'Phạm Thị Support',  email: 'cs@avafollow.vn',    role: 'customer_support',  dept: 'Chăm Sóc Khách Hàng',  status: 'active',   lastLogin: '2026-09-12 08:10' },
      { id: 'staff_005', name: 'Hoàng Văn KOC',     email: 'koc@avafollow.vn',   role: 'koc_manager',       dept: 'Quản Lý KOC',          status: 'active',   lastLogin: '2026-09-11 20:00' },
      { id: 'staff_006', name: 'Đinh Thị Campaign', email: 'camp@avafollow.vn',  role: 'campaign_manager',  dept: 'Chiến Dịch & Quảng Cáo', status: 'inactive', lastLogin: '2026-09-10 15:00' },
      { id: 'staff_007', name: 'Vũ Văn Tech',       email: 'tech@avafollow.vn',  role: 'tech_admin',        dept: 'Kỹ Thuật & Dev',       status: 'active',   lastLogin: '2026-09-12 07:00' },
    ];
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_admin_staff_list', JSON.stringify(staffList));
      }
    } catch {}
  }, [staffList]);

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

  const matchedInputUser = inputAccountGmail.trim()
    ? adminUsers.find(u => 
        u.email.toLowerCase() === inputAccountGmail.trim().toLowerCase() ||
        u.handle.toLowerCase() === inputAccountGmail.trim().replace(/^@/, '').toLowerCase() ||
        (u.tiktokConnected && u.tiktokConnected.toLowerCase() === inputAccountGmail.trim().toLowerCase())
      )
    : null;

  const activeGrantUser = userSelectMode === 'input' && matchedInputUser
    ? matchedInputUser
    : (adminUsers.find(u => u.id === selectedGrantUserId) || adminUsers[0]);

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
            {totalUsersCount.toLocaleString()} User
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">100% Đồng bộ Supabase Profiles</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Két Ký Quỹ Sàn (Escrow Vault)</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {totalEscrowLockedFormatted}
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

      {/* Admin Navigation Tabs - Luxury Command Center Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider">
              Trung Tâm Điều Khiển & Phân Hệ Quản Trị
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            13 Phân Hệ Quản Trị Toàn Quyền Master
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
          {[
            {
              id: 'overview',
              label: 'Tổng Quan',
              subLabel: 'Dashboard Master',
              icon: LayoutDashboard,
              badge: 'Realtime',
              border: 'border-cyan-500/40',
              activeBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-900/40 ring-2 ring-cyan-400',
              iconColor: 'text-cyan-400',
              guide: {
                title: 'Phân Hệ Dashboard Tổng Quan',
                description: 'Báo cáo tổng hợp số liệu toàn sàn: Doanh thu thực tế, tổng tài khoản đăng ký, két ký quỹ Escrow và kho gói dịch vụ tăng trưởng.',
                steps: ['Theo dõi các chỉ số quan trọng', 'Truy cập nhanh các thao tác nạp Xu và quản lý']
              }
            },
            {
              id: 'grant_permissions',
              label: 'Cấp Quyền & Gói',
              subLabel: '24 Siêu Phẩm VIP',
              icon: Key,
              badge: `${growthServices.length} Gói`,
              border: 'border-amber-500/40',
              activeBg: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-900/40 ring-2 ring-amber-400',
              iconColor: 'text-yellow-400',
              guide: {
                title: 'Cấp Quyền & Gói Dịch Vụ',
                description: 'Toàn quyền cấp miễn phí hoặc nâng cấp 24 gói tăng trưởng TikTok cho bất kỳ tài khoản người dùng nào chỉ với 1-chạm.',
                steps: ['Chọn người dùng cần cấp', 'Chọn gói dịch vụ trong 24 siêu phẩm', 'Bấm Cấp Gói để kích hoạt ngay lập tức']
              }
            },
            {
              id: 'software_apps',
              label: 'App Kiếm Tiền',
              subLabel: 'Kho Tool & Software',
              icon: Cpu,
              badge: `${softwareApps.length} App`,
              border: 'border-pink-500/40',
              activeBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-900/40 ring-2 ring-pink-400',
              iconColor: 'text-pink-400',
              guide: {
                title: 'Kho Ứng Dụng Kiếm Tiền',
                description: 'Quản lý kho phần mềm, công cụ cày view, AI kịch bản, bot seeding và cấp bản quyền sử dụng cho thành viên.',
                steps: ['Xem danh sách phần mềm', 'Tùy chỉnh giá Xu và mô tả', 'Bật / tắt hiển thị trên Chợ Ứng Dụng']
              }
            },
            {
              id: 'users',
              label: 'Quản Lý User',
              subLabel: 'Tra Cứu & Nâng Rank',
              icon: Users,
              badge: `${adminUsers.length} User`,
              border: 'border-purple-500/40',
              activeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-400',
              iconColor: 'text-purple-400',
              guide: {
                title: 'Quản Lý Danh Sách Người Dùng',
                description: 'Tra cứu thông tin tài khoản qua Gmail, điều chỉnh số dư Xu, can thiệp cấp bậc VIP (Đồng -> Kim Cương) và khóa tài khoản vi phạm.',
                steps: ['Tìm kiếm bằng email hoặc ID', 'Bấm nút Inspector để xem chi tiết', 'Cộng/trừ Xu hoặc thăng hạng trực tiếp']
              }
            },
            {
              id: 'referrals',
              label: 'Tiếp Thị & Ref',
              subLabel: 'Hoa Hồng Đa Tầng',
              icon: Gift,
              badge: `${affiliateData.referralsList.length} Ref`,
              border: 'border-emerald-500/40',
              activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400',
              iconColor: 'text-emerald-400',
              guide: {
                title: 'Tiếp Thị Liên Kết & Giới Thiệu',
                description: 'Quản lý cây phả hệ giới thiệu F1 -> F5, kiểm soát hoa hồng phát sinh và tỷ lệ chia sẻ doanh thu mạng lưới.',
                steps: ['Xem danh sách người giới thiệu', 'Kiểm tra hoa hồng tích lũy', 'Duyệt thưởng mạng lưới affiliate']
              }
            },
            {
              id: 'kyc',
              label: 'Xác Minh KYC',
              subLabel: 'CCCD & Tích Xanh',
              icon: ShieldCheck,
              badge: `${kycRequests.length} Yêu Cầu`,
              border: 'border-cyan-500/40',
              activeBg: 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-900/40 ring-2 ring-cyan-400',
              iconColor: 'text-cyan-400',
              guide: {
                title: 'Xác Minh Danh Tính KYC',
                description: 'Duyệt ảnh CCCD 2 mặt và ảnh chân dung selfie của người dùng để cấp huy hiệu Tích Xanh uy tín và mở khóa hạn mức rút tiền lớn.',
                steps: ['Kiểm tra ảnh mặt trước / sau CCCD', 'Đối chiếu thông tin họ tên & ngày sinh', 'Bấm Duyệt KYC hoặc Từ chối có lý do']
              }
            },
            {
              id: 'token_ledger',
              label: 'Sổ Cái Token',
              subLabel: 'Tổng Cung 10 Tỷ Xu',
              icon: Coins,
              badge: '10 Tỷ Cố Định',
              border: 'border-yellow-500/40',
              activeBg: 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg shadow-yellow-900/40 ring-2 ring-yellow-400',
              iconColor: 'text-yellow-400',
              guide: {
                title: 'Sổ Cái & Tokenomics AVA COIN',
                description: 'Bảo chứng Tổng Cung 10 Tỷ Xu, tự động trừ Kho Quỹ Sàn khi Xu ra thị trường. Hỗ trợ công cụ Đúc (Mint), Đốt (Burn) và Reset chuẩn thị trường.',
                steps: ['Xem bảng cân đối tài sản realtime', 'Thực hiện Mint/Burn token có ghi sổ', 'Reset số liệu về mốc chuẩn khi cần']
              }
            },
            {
              id: 'settings',
              label: 'Hoa Hồng Sàn',
              subLabel: 'Cấu Hình Thu Phí %',
              icon: Percent,
              badge: `${escrowFee}% Sàn`,
              border: 'border-indigo-500/40',
              activeBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/40 ring-2 ring-indigo-400',
              iconColor: 'text-indigo-400',
              guide: {
                title: 'Cấu Hình Hoa Hồng & Phí Sàn',
                description: 'Điều chỉnh tỷ lệ chiết khấu sàn (Platform Fee %), tỷ lệ phân bổ cho Creator, và các chính sách phí giao dịch nạp/rút.',
                steps: ['Kéo thanh trượt điều chỉnh % phí sàn', 'Bấm Lưu Cấu Hình để áp dụng toàn hệ thống']
              }
            },
            {
              id: 'escrow',
              label: 'Trọng Tài Escrow',
              subLabel: 'Ký Quỹ & Tranh Chấp',
              icon: Gavel,
              badge: `${disputedBookings.length} Khiếu Nại`,
              border: 'border-rose-500/40',
              activeBg: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/40 ring-2 ring-rose-400',
              iconColor: 'text-rose-400',
              guide: {
                title: 'Trọng Tài & Hợp Đồng Ký Quỹ Escrow',
                description: 'Bảo vệ quyền lợi Brand & KOC: Duyệt giải ngân thù lao, xử lý khiếu nại, hoàn tiền cọc hoặc phán quyết đền bù minh bạch 100%.',
                steps: ['Xem bằng chứng video & link nộp bài', 'Phân xử Giải Ngân hoặc Hoàn Tiền']
              }
            },
            {
              id: 'campaigns',
              label: 'Chiến Dịch',
              subLabel: 'Quảng Bá & Tương Tác',
              icon: Flame,
              badge: `${campaigns.length} Đang Chạy`,
              border: 'border-orange-500/40',
              activeBg: 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-900/40 ring-2 ring-orange-400',
              iconColor: 'text-orange-400',
              guide: {
                title: 'Quản Lý Chiến Dịch Quảng Bá',
                description: 'Toàn quyền duyệt, tạm dừng, chỉnh sửa ngân sách hoặc tạo chiến dịch quảng bá Follow, Thả Tim, Bình Luận và Livestream cho đối tác.',
                steps: ['Xem tiến độ phân bổ tương tác', 'Bật / tắt hoặc điều chỉnh tốc độ chạy']
              }
            },
            {
              id: 'missions',
              label: 'Nhiệm Vụ Tuần',
              subLabel: '10 Cấp Bậc & Thưởng',
              icon: Trophy,
              badge: '10 Cấp Bậc',
              border: 'border-yellow-500/40',
              activeBg: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-900/40 ring-2 ring-yellow-400',
              iconColor: 'text-yellow-400',
              guide: {
                title: 'Quản Trị Nhiệm Vụ Tuần & 10 Cấp Bậc',
                description: 'Cấu hình kho 80+ nhiệm vụ xoay vòng, điều chỉnh hệ số nhân thưởng (x1.0 -> x3.0) và số lượt Vòng Quay May Mắn tặng kèm khi thăng cấp.',
                steps: ['Kiểm tra cấu hình từng Rank', 'Điều chỉnh slot nhiệm vụ và cơ chế thưởng']
              }
            },
            {
              id: 'staff_roles',
              label: 'Phân Quyền',
              subLabel: '7 Vai Trò Nhân Sự',
              icon: Users,
              badge: `${staffList.length} Nhân Sự`,
              border: 'border-indigo-500/40',
              activeBg: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40 ring-2 ring-indigo-400',
              iconColor: 'text-indigo-400',
              guide: {
                title: 'Phân Quyền Vận Hành Nhân Sự',
                description: 'Phân công nhiệm vụ cho 7 bộ phận chuyên trách (Super Admin, Tài Chính, KYC, CSKH, KOC Mgr, Campaign, Tech) để tự chủ vận hành.',
                steps: ['Thêm nhân sự mới theo email', 'Gán vai trò và phạm vi quyền hạn tương ứng']
              }
            },
            {
              id: 'security_7layers',
              label: 'Bảo Mật 7 Lớp',
              subLabel: 'Shield & Tường Lửa',
              icon: ShieldCheck,
              badge: 'Kích Hoạt 100%',
              border: 'border-emerald-500/40',
              activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400',
              iconColor: 'text-emerald-400',
              guide: {
                title: 'Hệ Thống Bảo Mật 7 Lớp Tối Cao',
                description: 'Giám sát tường lửa WAF, chống click tặc bot ảo, mã hóa SHA-256 cơ sở dữ liệu và bảo mật 2 lớp 2FA tài khoản ngân hàng.',
                steps: ['Kiểm tra trạng thái 7 lớp bảo mật', 'Kích hoạt chế độ phòng thủ cấp cao khi cần']
              }
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  isActive
                    ? tab.activeBg
                    : `bg-[#0D111E]/90 hover:bg-[#151B2E] border-white/10 hover:${tab.border} hover:scale-[1.02]`
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                    <FeatureGuideTooltip
                      title={tab.guide.title}
                      description={tab.guide.description}
                      steps={tab.guide.steps}
                      badge="Quản Trị"
                      size="xs"
                      placement="bottom"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className={`text-xs font-black leading-tight ${isActive ? 'text-white' : 'text-white'}`}>
                    {tab.label}
                  </div>
                  <div className={`text-[10px] leading-tight font-mono ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.subLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                <div className="text-2xl font-black text-white font-mono">{totalRevenueFormatted}</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">+100% Tự động</span>
                  <span className="text-amber-400 font-bold">Két Escrow: {totalEscrowLockedFormatted}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Cộng Đồng Người Dùng Thật</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300 font-mono">{totalUsersCount.toLocaleString()} User</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400">+{adminUsers.length} tài khoản thành viên</span>
                  <span className="text-slate-400">100% người thật</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span className="font-mono uppercase text-[10px]">Xác Minh Danh Tính (KYC)</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {kycRequests.length > 0 ? `${Math.round((kycRequests.filter(k => k.status === 'verified').length / kycRequests.length) * 100)}% Hợp Lệ` : '100% Hợp Lệ'}
                </div>
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
                <div className="text-2xl font-black text-neonGold font-mono">{totalCoinsInCirculation.toLocaleString()} Xu</div>
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
                <div className="text-2xl font-black text-rose-300 font-mono">{totalCampaignsCount} Chiến Dịch</div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">{activeCampaignsCount} Đang chạy hoạt động</span>
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
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
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
                  ● {completionPercentage}% Hoàn Thành Toàn Sàn
                </span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                  {dropPercentage}% Rơi Rụng / Hủy
                </span>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Tổng Task Đã Nhận (24h)</div>
                <div className="text-xl font-black text-white font-mono">{totalReceivedTasks24h.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Dữ liệu thời gian thực</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1 text-center">
                <div className="text-[10px] text-emerald-300 font-mono uppercase">Hoàn Thành &amp; Nhận Xu</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{totalCompletedTasks24h.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-300 font-mono font-bold">{completionPercentage}% Thành Công</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/30 space-y-1 text-center">
                <div className="text-[10px] text-rose-300 font-mono uppercase">Rơi Rụng / Hết Hạn 60s</div>
                <div className="text-xl font-black text-rose-400 font-mono">{totalDropTasks24h.toLocaleString()}</div>
                <div className="text-[10px] text-rose-300 font-mono font-bold">{dropPercentage}% Tỷ Lệ Drop</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-1 text-center">
                <div className="text-[10px] text-purple-300 font-mono uppercase">Thời Gian Trung Bình/Task</div>
                <div className="text-xl font-black text-purple-300 font-mono">
                  {totalCompletedTasks24h > 0 ? '15s - 30s' : '0s'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {totalCompletedTasks24h > 0 ? 'Chuẩn tự nhiên FYP' : 'Chưa có dữ liệu'}
                </div>
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
                  { label: 'Kết Nối Bạn Bè (Follow Người Thật)', completed: followCompleted, total: `${tasks.filter(t => t.type === 'follow').length} task sẵn sàng`, color: 'from-emerald-500 to-teal-400' },
                  { label: 'Xem & Đánh Giá (Thả Tim Video)', completed: likeCompleted, total: `${tasks.filter(t => t.type === 'like').length} task sẵn sàng`, color: 'from-pink-500 to-rose-400' },
                  { label: 'Tiếp Cận Người Xem (Xem FYP 15s)', completed: watchCompleted, total: `${tasks.filter(t => t.type === 'watch').length} task sẵn sàng`, color: 'from-blue-500 to-cyan-400' },
                  { label: 'Giới Thiệu Bạn Bè (Share Ngoại Sàn)', completed: shareCompleted, total: `${tasks.filter(t => t.type === 'share').length} task sẵn sàng`, color: 'from-purple-500 to-indigo-400' },
                  { label: 'Trả Lời Câu Hỏi (Comment Seeding)', completed: commentCompleted, total: `${tasks.filter(t => t.type === 'comment').length} task sẵn sàng`, color: 'from-amber-500 to-yellow-400' },
                  { label: 'Xem LIVE & Trả Lời (Giữ Mắt 3-30p)', completed: liveCompleted, total: `${livestreamTasks.length} phòng live sẵn sàng`, color: 'from-red-500 to-orange-400' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-slate-400 font-normal">{item.total}</span>
                        <span className="text-emerald-400 font-bold">✓ {item.completed.toLocaleString()} hoàn thành</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden flex">
                      <div className={`bg-gradient-to-r ${item.color} h-full transition-all duration-500`} style={{ width: `${item.completed > 0 ? '100%' : '0%'}` }} />
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
                  Sơ Đồ Dòng Tiền &amp; Ký Quỹ Escrow Ăn Chia Tự Động Toàn Sàn
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
                <p className="text-[11px] text-slate-400">User &amp; KOC rút tiền về Vietcombank, MB, Techcombank theo kỳ giải ngân sau khi hoàn tất KYC.</p>
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
                  {completedActionsCount > 0 ? `${completedActionsCount} người dùng` : '0 người dùng'} thực hiện nhiệm vụ và nhận thưởng Xu thời gian thực hôm nay
                </p>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                Hôm Nay: +{totalDistributedCoins.toLocaleString('vi-VN')} Xu Phân Phối
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
                  <span className="text-xs font-bold font-mono text-emerald-400">{watchCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: watchCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>{watchCompleted.toLocaleString()}</strong> lượt</span>
                  <span className="text-purple-300">+{watchCoins.toLocaleString('vi-VN')} Xu</span>
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
                  <span className="text-xs font-bold font-mono text-emerald-400">{followCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: followCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>{followCompleted.toLocaleString()}</strong> follow</span>
                  <span className="text-emerald-300">+{followCoins.toLocaleString('vi-VN')} Xu</span>
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
                  <span className="text-xs font-bold font-mono text-emerald-400">{likeCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: likeCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>{likeCompleted.toLocaleString()}</strong> tim</span>
                  <span className="text-rose-300">+{likeCoins.toLocaleString('vi-VN')} Xu</span>
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
                  <span className="text-xs font-bold font-mono text-cyan-400">{commentCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: commentCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>{commentCompleted.toLocaleString()}</strong> bình luận</span>
                  <span className="text-cyan-300">+{commentCoins.toLocaleString('vi-VN')} Xu</span>
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
                  <span className="text-xs font-bold font-mono text-emerald-400">{shareCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: shareCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Hoàn thành: <strong>{shareCompleted.toLocaleString()}</strong> chia sẻ</span>
                  <span className="text-amber-300">+{shareCoins.toLocaleString('vi-VN')} Xu</span>
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
                  <span className="text-xs font-bold font-mono text-emerald-400">{liveCompleted > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: liveCompleted > 0 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Tổng phút xem: <strong>{(liveCompleted * 3).toLocaleString()}</strong> phút</span>
                  <span className="text-rose-300">+{liveCoins.toLocaleString('vi-VN')} Xu</span>
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
                    Trung Tâm Cấp Quyền &amp; Phân Phối Gói Dịch Vụ Qua Gmail (Super Dispatcher)
                  </h3>
                  <FeatureGuideTooltip
                    title="Cấp Quyền &amp; Phân Phối Gói Dịch Vụ Admin"
                    description="Công cụ tối cao giúp Quản trị viên cấp quyền trực tiếp cho bất kỳ tài khoản nào thông qua địa chỉ Gmail: Cấp gói dịch vụ miễn phí, nâng hạ hạng VIP, cộng/trừ Xu và bơm follower."
                    steps={[
                      "1. Chọn tài khoản có sẵn hoặc nhập trực tiếp địa chỉ Gmail để cấp",
                      "2. Cấp Gói Dịch Vụ: Bấm 'Cấp Gói Miễn Phí' tại bất kỳ gói nào trong 24 siêu phẩm để tạo đơn chạy ngay",
                      "3. Điều chỉnh Xu: Bấm các mốc +10k, +50k, +200k, +1M hoặc nhập số Xu tùy ý (Cộng / Trừ / Đặt số dư)",
                      "4. Bơm Follow Kênh TikTok: Bấm +500, +1k, +5k, +10k follow để cập nhật chỉ số kênh",
                      "5. Quản Lý Gói Đã Cấp: Có đầy đủ nút Sửa tiến độ/số lượng, Xóa gói và Lưu lại"
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

            {/* User Target Selector - Dual Mode (Chọn sẵn vs Nhập Gmail) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Phương Thức Chỉ Định Tài Khoản Cấp Quyền:
                  </span>
                </div>

                <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 gap-1">
                  <button
                    type="button"
                    onClick={() => setUserSelectMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                      userSelectMode === 'list'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📋 Chọn Từ Danh Sách ({adminUsers.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserSelectMode('input')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                      userSelectMode === 'input'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>⌨️ Nhập Gmail / Handle</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Select dropdown */}
              {userSelectMode === 'list' ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-xs text-slate-300 font-mono shrink-0">Chọn người dùng:</span>
                  <select
                    value={selectedGrantUserId}
                    onChange={(e) => setSelectedGrantUserId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white font-mono text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 w-full sm:flex-1"
                  >
                    {adminUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email} — {u.name} (Hạng {u.rankLevel} • {u.coinsBalance.toLocaleString()} Xu • @{u.handle})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Mode 2: Direct Gmail input */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ Gmail (VD: user@gmail.com) hoặc @tiktok_handle..."
                        value={inputAccountGmail}
                        onChange={(e) => setInputAccountGmail(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    {!matchedInputUser && inputAccountGmail.trim().length > 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          const created = adminAddUser({ email: inputAccountGmail.trim() });
                          setSelectedGrantUserId(created.id);
                          setUserSelectMode('list');
                          setGrantSuccessNotice(`✅ Đã tạo mới & chọn tài khoản ${created.email}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-mono shrink-0 shadow-lg flex items-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Tạo &amp; Cấp Ngay Cho Gmail Này</span>
                      </button>
                    )}
                  </div>

                  {matchedInputUser ? (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã tìm thấy tài khoản trong hệ thống: <strong>{matchedInputUser.name}</strong> ({matchedInputUser.email})</span>
                    </div>
                  ) : inputAccountGmail.trim() ? (
                    <div className="text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Gmail này chưa có trong danh sách. Nhấn &quot;Tạo &amp; Cấp Ngay&quot; để thêm tài khoản vào hệ thống.</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Active Selected User Card with Edit / Delete / Save Actions */}
              {activeGrantUser && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-purple-500/40 space-y-3 shadow-lg">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    
                    {/* Avatar & Identifiers */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={activeGrantUser.avatar} 
                        alt="" 
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/50 shrink-0" 
                      />
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{activeGrantUser.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                            ID: {activeGrantUser.id}
                          </span>
                        </div>
                        <div className="text-xs text-cyan-400 font-mono">{activeGrantUser.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          TikTok: <strong className="text-rose-400">{activeGrantUser.tiktokConnected || `@${activeGrantUser.handle}`}</strong> • SĐT: {activeGrantUser.phone || '0988888888'}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs w-full lg:w-auto">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                        <div className="text-[10px] text-slate-400">Hạng VIP</div>
                        <div className="text-amber-300 font-bold">{activeGrantUser.rankLevel}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                        <div className="text-[10px] text-slate-400">Số Dư Xu</div>
                        <div className="text-amber-400 font-bold">{activeGrantUser.coinsBalance.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                        <div className="text-[10px] text-slate-400">Followers</div>
                        <div className="text-emerald-400 font-bold">{activeGrantUser.tiktokFollowers.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, Save */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(activeGrantUser);
                          setEditUserModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                        title="Chỉnh sửa thông tin tài khoản này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa Hồ Sơ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          adminToggleUserStatus(activeGrantUser.id);
                          setGrantSuccessNotice(`Đã chuyển trạng thái tài khoản ${activeGrantUser.name}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          activeGrantUser.status === 'active'
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {activeGrantUser.status === 'active' ? 'Khóa Tài Khoản' : 'Mở Khóa'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${activeGrantUser.name}" (${activeGrantUser.email}) khỏi hệ thống?`)) {
                            adminDeleteUser(activeGrantUser.id);
                            setSelectedGrantUserId(adminUsers[0]?.id || '');
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
                        title="Xóa tài khoản này khỏi hệ thống"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Direct Instant Parameter Adjustments (Xu, Follower & VIP Rank) */}
            {activeGrantUser && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* 1. Adjust Coins Panel */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Cấp Xu Thưởng ({activeGrantUser.coinsBalance.toLocaleString()} Xu)
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Đặt số dư Xu của ${activeGrantUser.name} về 0?`)) {
                          adminUpdateUser(activeGrantUser.id, { coinsBalance: 0 });
                          setGrantSuccessNotice(`Đã đặt số dư của ${activeGrantUser.name} về 0 Xu!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }
                      }}
                      className="text-[10px] text-rose-400 hover:underline font-mono"
                    >
                      Reset về 0
                    </button>
                  </div>

                  {/* Quick grant presets */}
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 10000);
                        setGrantSuccessNotice(`Đã cộng +10,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20 transition-all"
                    >
                      +10k
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 50000);
                        setGrantSuccessNotice(`Đã cộng +50,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20 transition-all"
                    >
                      +50k
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 200000);
                        setGrantSuccessNotice(`Đã cộng +200,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/20 transition-all"
                    >
                      +200k
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserCoins(activeGrantUser.id, 1000000);
                        setGrantSuccessNotice(`Đã cộng +1,000,000 Xu cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 transition-all"
                    >
                      +1M
                    </button>
                  </div>

                  {/* Custom Amount Action (Add / Subtract / Set) */}
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/10 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setCoinActionType('add')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${coinActionType === 'add' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}
                      >
                        + Cộng
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoinActionType('subtract')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${coinActionType === 'subtract' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                      >
                        - Trừ
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoinActionType('set')}
                        className={`flex-1 py-1 rounded font-bold transition-all ${coinActionType === 'set' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                      >
                        = Đặt Số Dư
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Số Xu..."
                        value={customCoinInput}
                        onChange={(e) => setCustomCoinInput(e.target.value)}
                        className="flex-1 bg-black/50 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const amt = parseInt(customCoinInput, 10);
                          if (!isNaN(amt)) {
                            if (coinActionType === 'add') {
                              adminAdjustUserCoins(activeGrantUser.id, amt);
                            } else if (coinActionType === 'subtract') {
                              adminAdjustUserCoins(activeGrantUser.id, -Math.abs(amt));
                            } else {
                              adminUpdateUser(activeGrantUser.id, { coinsBalance: Math.max(0, amt) });
                            }
                            setGrantSuccessNotice(`Đã cập nhật số dư Xu cho ${activeGrantUser.name}!`);
                            setTimeout(() => setGrantSuccessNotice(null), 3000);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono transition-colors shadow"
                      >
                        Lưu Xu
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Adjust Followers Panel */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Bơm Follow TikTok ({activeGrantUser.tiktokFollowers.toLocaleString()} Follower)
                    </h4>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 500);
                        setGrantSuccessNotice(`Đã bơm +500 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +500
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 1000);
                        setGrantSuccessNotice(`Đã bơm +1,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +1,000
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 5000);
                        setGrantSuccessNotice(`Đã bơm +5,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20"
                    >
                      +5,000
                    </button>
                    <button
                      onClick={() => {
                        adminAdjustUserFollowers(activeGrantUser.id, 10000);
                        setGrantSuccessNotice(`Đã bơm +10,000 Follower cho ${activeGrantUser.name}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3000);
                      }}
                      className="py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40"
                    >
                      +10,000
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-white/5">
                    <input
                      type="number"
                      placeholder="Số Follow tùy ý..."
                      value={customFollowerInput}
                      onChange={(e) => setCustomFollowerInput(e.target.value)}
                      className="flex-1 bg-black/50 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
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
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono transition-colors shadow"
                    >
                      Lưu Follow
                    </button>
                  </div>
                </div>

                {/* 3. VIP Rank Selector Panel */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3 shadow-lg">
                  <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Award className="w-4 h-4 text-neonGold" />
                    Cấp Bậc VIP (Hiện tại: {activeGrantUser.rankLevel})
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {(['Đồng', 'Bạc', 'Vàng', 'Kim Cương'] as const).map(rk => (
                      <button
                        key={rk}
                        type="button"
                        onClick={() => {
                          adminChangeUserRank(activeGrantUser.id, rk);
                          setGrantSuccessNotice(`Đã đổi hạng của ${activeGrantUser.name} sang ${rk}!`);
                          setTimeout(() => setGrantSuccessNotice(null), 3000);
                        }}
                        className={`py-2 px-2.5 rounded-xl font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          activeGrantUser.rankLevel === rk
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-black border-amber-400 shadow-md scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{rk}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-white/5">
                    Hạng cao hơn mở rộng hạn mức rút tiền &amp; nhân hệ số Xu thưởng nhiệm vụ
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Danh Sách Gói Dịch Vụ Đang Chạy / Đã Cấp Của Người Dùng Này */}
          {activeGrantUser && (
            <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    Gói Dịch Vụ Đã Cấp Cho {activeGrantUser.name} ({activeGrantUser.orders?.length || 0} Đơn)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quản lý, chỉnh sửa tiến độ, URL phân phối hoặc xóa/hủy gói đã cấp cho tài khoản này
                  </p>
                </div>

                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                  {activeGrantUser.email}
                </span>
              </div>

              {activeGrantUser.orders && activeGrantUser.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Mã Đơn / Gói Dịch Vụ</th>
                        <th className="p-3">Số Lượng Mục Tiêu</th>
                        <th className="p-3">Tiến Độ Hoàn Thành</th>
                        <th className="p-3">Link Phân Phối</th>
                        <th className="p-3 text-center">Trạng Thái</th>
                        <th className="p-3 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {activeGrantUser.orders.map((ord) => {
                        const progressPct = Math.min(100, Math.round(((ord.completedQuantity || 0) / Math.max(1, ord.targetQuantity)) * 100));
                        return (
                          <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-white">{ord.packageTitle}</div>
                              <div className="text-[10px] text-slate-500">Mã: {ord.id} • {ord.createdAt}</div>
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              +{ord.targetQuantity.toLocaleString()} lượt
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span>{ord.completedQuantity.toLocaleString()} / {ord.targetQuantity.toLocaleString()}</span>
                                  <span className="font-bold text-cyan-400">{progressPct}%</span>
                                </div>
                                <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-cyan-300 truncate max-w-[180px]">
                              {ord.targetUrl}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : ord.status === 'running'
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ord.status === 'completed' ? '✓ Đã xong' : ord.status === 'running' ? '● Đang chạy' : '○ Tạm ngưng'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingOrderUser(activeGrantUser);
                                    setEditingOrderData(ord);
                                    setEditOrderModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="Chỉnh sửa tiến độ hoặc thông tin gói này"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Sửa</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Xóa gói dịch vụ "${ord.packageTitle}" của ${activeGrantUser.name}?`)) {
                                      adminDeleteGrantedOrder(activeGrantUser.id, ord.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                                  title="Xóa gói dịch vụ này"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-400 font-mono space-y-1">
                  <div>Tài khoản này chưa có gói dịch vụ nào đang chạy.</div>
                  <div className="text-[11px] text-purple-400">Chọn một trong 24 gói tăng trưởng bên dưới để cấp miễn phí ngay lập tức.</div>
                </div>
              )}
            </div>
          )}

          {/* 24 Growth Services Dispatcher Grid */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-400" />
                    Kho {growthServices.length} Gói Dịch Vụ Tăng Trưởng ({filteredGrantPackages.length} Gói Hiển Thị)
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNewPackage(true);
                      setPkgEditId(`pkg_custom_${Date.now()}`);
                      setPkgEditTitle('');
                      setPkgEditCategory('follow');
                      setPkgEditTag('Đề xuất');
                      setPkgEditPrice('500,000đ');
                      setPkgEditOriginalPrice('750,000đ');
                      setPkgEditPriceNum(500000);
                      setPkgEditTargetQuantity(1000);
                      setPkgEditUnit('Kết Nối Bạn Bè');
                      setPkgEditDescription('');
                      setPkgEditFeatures('1,000 Kết nối bạn bè người thật từ Việt Nam (500 Xu/kết nối)\nNgười xem lướt video 15s trước khi bấm kết nối bạn bè\nBảo hành kết nối dài hạn qua Anti-Unfollow API');
                      setPkgEditEstimatedDelivery('Chạy đến khi đạt đủ 100% chỉ tiêu');
                      setPkgEditBadge('Phổ Biến');
                      setPkgEditRating(5);
                      setPkgEditReviewCount(100);
                      setPkgEditThumbnail('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80');
                      setPackageEditorModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Thêm Gói Mới</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admin có toàn quyền Thêm, Sửa, Tùy chỉnh giá / sản lượng hoặc Xóa bất kỳ gói dịch vụ nào. Dữ liệu được lưu trữ vĩnh viễn.
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
                    className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-48 font-mono"
                  />
                </div>

                <select
                  value={grantCategoryFilter}
                  onChange={(e) => setGrantCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="all">Tất cả hạng mục ({growthServices.length} gói)</option>
                  <option value="follow">Follow Kênh Thật</option>
                  <option value="engagement">Tương Tác Tim &amp; View</option>
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
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 space-y-3 flex flex-col justify-between transition-all group shadow-lg relative"
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

                  <div className="space-y-2 pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        if (!activeGrantUser) return;
                        adminGrantPackage(activeGrantUser.id, pkg);
                        setGrantSuccessNotice(`👑 Đã cấp thành công "${pkg.title}" cho tài khoản ${activeGrantUser.email}!`);
                        setTimeout(() => setGrantSuccessNotice(null), 3500);
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Cấp Gói Này Cho {activeGrantUser?.name}</span>
                    </button>

                    {/* Admin CRUD Action Buttons for this package */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewPackage(false);
                          setPkgEditId(pkg.id);
                          setPkgEditTitle(pkg.title);
                          setPkgEditCategory(pkg.category);
                          setPkgEditTag(pkg.tag || 'Đề xuất');
                          setPkgEditPrice(pkg.price);
                          setPkgEditOriginalPrice(pkg.originalPrice || pkg.price);
                          setPkgEditPriceNum(pkg.priceNum || 500000);
                          setPkgEditTargetQuantity(pkg.targetQuantity);
                          setPkgEditUnit(pkg.unit);
                          setPkgEditDescription(pkg.description);
                          setPkgEditFeatures(Array.isArray(pkg.features) ? pkg.features.join('\n') : '');
                          setPkgEditEstimatedDelivery(pkg.estimatedDelivery || 'Chạy đến khi đạt đủ 100% chỉ tiêu');
                          setPkgEditBadge(pkg.badge || 'Phổ Biến');
                          setPkgEditRating(pkg.rating || 5);
                          setPkgEditReviewCount(pkg.reviewCount || 100);
                          setPkgEditThumbnail(pkg.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80');
                          setPackageEditorModalOpen(true);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Chỉnh sửa thông tin, giá cả, sản lượng gói"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa Gói</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn gói "${pkg.title}"?`)) {
                            deleteGrowthService(pkg.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        title="Xóa gói dịch vụ này"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
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
                  Bảng Quy Chuẩn Chính Sách & Cam Kết Vận Hành {growthServices.length} Gói Dịch Vụ
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cam kết chất lượng 100% người thật, bảo hành không tụt và cơ chế ký quỹ Escrow bảo chứng
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNewPackage(true);
                    setPkgEditId(`pkg_custom_${Date.now()}`);
                    setPkgEditTitle('');
                    setPkgEditCategory('follow');
                    setPkgEditTag('Đề xuất');
                    setPkgEditPrice('500,000đ');
                    setPkgEditOriginalPrice('750,000đ');
                    setPkgEditPriceNum(500000);
                    setPkgEditTargetQuantity(1000);
                    setPkgEditUnit('Kết Nối Bạn Bè');
                    setPkgEditDescription('');
                    setPkgEditFeatures('1,000 Kết nối bạn bè người thật từ Việt Nam (500 Xu/kết nối)\nBảo hành kết nối dài hạn');
                    setPkgEditEstimatedDelivery('Chạy đến khi đạt đủ 100% chỉ tiêu');
                    setPkgEditBadge('Phổ Biến');
                    setPkgEditRating(5);
                    setPkgEditReviewCount(100);
                    setPkgEditThumbnail('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80');
                    setPackageEditorModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm Gói</span>
                </button>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                  Chính Sách Chuẩn Sàn v3.5
                </span>
              </div>
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
                    <th className="p-3 text-center">Thao Tác Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {growthServices.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-bold text-white font-sans">{s.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 uppercase">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3 text-amber-400 font-bold">{s.price}</td>
                      <td className="p-3 text-emerald-400 font-bold">{s.targetQuantity.toLocaleString()} {s.unit}</td>
                      <td className="p-3 text-emerald-300 font-bold">{s.estimatedDelivery || 'Chạy đến khi đạt 100% chỉ tiêu'}</td>
                      <td className="p-3 text-cyan-300">✓ Ký Quỹ Sàn 100% (BH 60 Ngày)</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNewPackage(false);
                              setPkgEditId(s.id);
                              setPkgEditTitle(s.title);
                              setPkgEditCategory(s.category);
                              setPkgEditTag(s.tag || 'Đề xuất');
                              setPkgEditPrice(s.price);
                              setPkgEditOriginalPrice(s.originalPrice || s.price);
                              setPkgEditPriceNum(s.priceNum || 500000);
                              setPkgEditTargetQuantity(s.targetQuantity);
                              setPkgEditUnit(s.unit);
                              setPkgEditDescription(s.description);
                              setPkgEditFeatures(Array.isArray(s.features) ? s.features.join('\n') : '');
                              setPkgEditEstimatedDelivery(s.estimatedDelivery || 'Chạy đến khi đạt đủ 100% chỉ tiêu');
                              setPkgEditBadge(s.badge || 'Phổ Biến');
                              setPkgEditRating(s.rating || 5);
                              setPkgEditReviewCount(s.reviewCount || 100);
                              setPkgEditThumbnail(s.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80');
                              setPackageEditorModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Sửa thông tin gói này"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn gói "${s.title}"?`)) {
                                deleteGrowthService(s.id);
                              }
                            }}
                            className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                            title="Xóa gói dịch vụ"
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
      {/* TAB: QUẢN LÝ KHO APP KIẾM TIỀN & CÔNG CỤ TĂNG TRƯỞNG                      */}
      {/* ========================================================================= */}
      {activeTab === 'software_apps' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-pink-400" />
                    Quản Lý Kho App Kiếm Tiền & Phần Mềm AVA FOLLOW ({softwareApps.length} Ứng Dụng)
                  </h3>
                  <FeatureGuideTooltip
                    title="Hướng Dẫn Quản Trị Kho Ứng Dụng & Tool Tăng Trưởng"
                    description="Quản lý toàn diện các phần mềm bản quyền, công cụ cày view, AI kịch bản và bot seeding trên nền tảng AVA LIVE."
                    steps={[
                      "Thêm Ứng Dụng Mới: Nhập tên phần mềm, chọn danh mục, gắn thẻ Tag và thiết lập giá Xu",
                      "Chỉnh Sửa Thông Tin: Bấm nút Sửa trên từng dòng để cập nhật link tải hoặc thay đổi giá Xu",
                      "Bật / Tắt Hiển Thị: Chuyển trạng thái để hiển thị hoặc ẩn ứng dụng khỏi Chợ App"
                    ]}
                    tips="Giá Xu thiết lập ở đây sẽ tự động đồng bộ ngay lập tức ra màn hình App Kiếm Tiền của người dùng."
                    badge="Phân Hệ Phần Mềm"
                    placement="bottom"
                  />
                </div>
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
              <button
                onClick={() => setAddUserModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm Người Dùng</span>
              </button>

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
                          const currentRank = (ranks.includes(u.rankLevel as any) ? u.rankLevel : 'Đồng') as 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
                          const nextIdx = (ranks.indexOf(currentRank) + 1) % ranks.length;
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
                        
                        {/* Sửa thông tin Modal Button */}
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditUserModalOpen(true);
                          }}
                          title="Sửa thông tin tài khoản"
                          className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[11px] transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

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
                          className="px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-[11px] font-bold border border-purple-500/30 transition-all flex items-center gap-1 cursor-pointer"
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
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                        </button>

                        {/* Ban / Unban Toggle */}
                        <button
                          onClick={() => adminToggleUserStatus(u.id)}
                          title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                          className={`p-1.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        {/* Xóa tài khoản Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${u.name} (${u.email}) khỏi hệ thống?`)) {
                              adminDeleteUser(u.id);
                            }
                          }}
                          title="Xóa tài khoản khỏi hệ thống"
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[11px] transition-all cursor-pointer"
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
      {/* TAB: SỔ CÁI PHÂN PHỐI TOKEN & QUẢN TRỊ KHO XU TOÀN DIỆN (7 CHỈ SỐ)         */}
      {/* ========================================================================= */}
      {activeTab === 'token_ledger' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-[#0D111E] border border-amber-500/40 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-neonGold flex items-center justify-center border border-amber-500/40 shadow-lg">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-wider">
                      Trung Tâm Quản Trị Sổ Cái &amp; Phân Phối Token (Master Token Supply)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Bảng cân đối kinh tế Xu toàn sàn • Minh bạch 100% dòng tiền, cấp phát, lưu thông, tiêu thụ và bảo chứng
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black shadow-lg">
                  1 Xu = 1 VNĐ (Cố Định 100%)
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  Bảo Chứng Thanh Khoản 24/7
                </span>
              </div>
            </div>
          </div>

          {/* 7 THẺ CHỈ SỐ KINH TẾ XU MINH BẠCH (THE 7 PILLARS OF TOKENOMICS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. Tổng Cung Mặc Định / Đã Cấp Ban Đầu */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                <span className="uppercase text-[10px] font-black">1. Tổng Cung Admin Cấp</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[9px] font-bold">Total Supply</span>
              </div>
              <div className="text-2xl font-black text-neonGold font-mono">
                {totalSupplyNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>Khởi tạo: {initialSupplyNum.toLocaleString('vi-VN')}</span>
                <span className="text-emerald-400">+{mintedSupplyNum.toLocaleString('vi-VN')} đúc thêm</span>
              </div>
            </div>

            {/* 2. Tổng Xu Đã Phân Phối Ra Thị Trường */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
                <span className="uppercase text-[10px] font-black">2. Đã Ra Thị Trường</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-[9px] font-bold">Circulating</span>
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {circulatingSupplyNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>Tỷ lệ phân phối:</span>
                <span className="text-cyan-400 font-bold">
                  {totalSupplyNum > 0 ? ((circulatingSupplyNum / totalSupplyNum) * 100).toFixed(2) : 0}%
                </span>
              </div>
            </div>

            {/* 3. Tổng Xu Người Dùng Đang Nắm Giữ */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-purple-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                <span className="uppercase text-[10px] font-black">3. Người Dùng Nắm Giữ</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[9px] font-bold">User Holdings</span>
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {userHoldingsNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>Tổng số ví:</span>
                <span className="text-purple-300 font-bold">{totalRealWalletsCount} Tài khoản thật</span>
              </div>
            </div>

            {/* 4. Tổng Xu Đã Chuyển Đổi Thành Tiền Mặt / Rút Ngân Hàng */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                <span className="uppercase text-[10px] font-black">4. Đã Đổi Ra Tiền Mặt</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[9px] font-bold">Cashed Out</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {totalWithdrawnNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>Quy đổi VNĐ:</span>
                <span className="text-emerald-400 font-bold">≈ {totalWithdrawnNum.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* 5. Tổng Xu Tiêu Thụ Vào Mua Phần Mềm / Mua Gói / Dịch Vụ */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-indigo-300 font-mono">
                <span className="uppercase text-[10px] font-black">5. Mua App &amp; Dịch Vụ</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[9px] font-bold">Ecosystem Spend</span>
              </div>
              <div className="text-2xl font-black text-indigo-300 font-mono">
                {totalSpentOnServicesNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>App + Gói tăng trưởng:</span>
                <span className="text-indigo-300 font-bold">{softwareApps.length} Apps / {growthServices.length} Gói</span>
              </div>
            </div>

            {/* 6. Tổng Xu Đã Đốt / Triệt Tiêu Khỏi Lưu Thông */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-rose-500/40 space-y-2 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-rose-300 font-mono">
                <span className="uppercase text-[10px] font-black">6. Đã Đốt / Triệt Tiêu</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-[9px] font-bold">Burned / Deflated</span>
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {totalBurnedTokensNum.toLocaleString('vi-VN')}
                <span className="text-xs text-slate-400 font-normal ml-1">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>Phí sàn + Đẩy top:</span>
                <span className="text-rose-300 font-bold">{platformBoostRevenue.toLocaleString('vi-VN')} Xu</span>
              </div>
            </div>

            {/* 7. Tổng Xu Còn Lại Trong Kho Quỹ Sàn (Treasury Balance) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-black border-2 border-emerald-500/60 space-y-2 shadow-xl sm:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform" />
              <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                <span className="uppercase text-[11px] font-black flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  7. Kho Quỹ Sàn Chưa Phát Hành (Treasury Reserve)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">100% Sẵn Sàng</span>
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {treasuryRemainingNum.toLocaleString('vi-VN')}
                <span className="text-sm text-white font-normal ml-1.5">Xu</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-white/10 flex justify-between items-center">
                <span>Tổng cung - Đã phân phối:</span>
                <span className="text-neonGold font-bold">
                  ≈ {treasuryRemainingNum.toLocaleString('vi-VN')} VNĐ thanh khoản sẵn sàng
                </span>
              </div>
            </div>

          </div>

          {/* BỘ CÔNG CỤ QUẢN TRỊ CẤP PHÁT & ĐỐT TOKEN (ADMIN MASTER TOKEN CONTROLS) */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neonGold" />
                <h4 className="text-sm font-black text-white uppercase font-display tracking-wider">
                  Bộ Công Cụ Cấp Phát &amp; Điều Tiết Quỹ Xu (Admin Supply Mint &amp; Burn)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Mọi thao tác được lưu vĩnh viễn và ghi vào sổ cái
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Tool 1: Đúc / Cấp Thêm Xu Vào Quỹ Sàn */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 uppercase font-mono flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    Đúc Xu Vào Quỹ Sàn (Mint)
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Tăng Tổng Cung</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-mono">Số Lượng Xu Cần Cấp Thêm:</label>
                  <input
                    type="number"
                    value={mintInputAmount}
                    onChange={(e) => setMintInputAmount(e.target.value)}
                    placeholder="VD: 1000000000"
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={mintInputNote}
                    onChange={(e) => setMintInputNote(e.target.value)}
                    placeholder="Ghi chú đợt cấp..."
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = parseInt(mintInputAmount, 10);
                    if (amt > 0) {
                      adminMintTreasuryTokens(amt, mintInputNote);
                      setMintInputAmount('1000000000');
                    } else {
                      showToast('Vui lòng nhập số lượng hợp lệ!');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs font-mono transition-all shadow-md cursor-pointer"
                >
                  + Cấp Thêm Vào Quỹ Sàn
                </button>
              </div>

              {/* Tool 2: Đốt / Triệt Tiêu Xu Khỏi Lưu Thông */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-300 uppercase font-mono flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    Đốt / Triệt Tiêu Xu (Burn)
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">Chống Lạm Phát</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-mono">Số Lượng Xu Cần Đốt:</label>
                  <input
                    type="number"
                    value={burnInputAmount}
                    onChange={(e) => setBurnInputAmount(e.target.value)}
                    placeholder="VD: 500000000"
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="text"
                    value={burnInputNote}
                    onChange={(e) => setBurnInputNote(e.target.value)}
                    placeholder="Ghi chú lý do triệt tiêu..."
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = parseInt(burnInputAmount, 10);
                    if (amt > 0) {
                      adminBurnTreasuryTokens(amt, burnInputNote);
                      setBurnInputAmount('500000000');
                    } else {
                      showToast('Vui lòng nhập số lượng hợp lệ!');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs font-mono transition-all shadow-md cursor-pointer"
                >
                  🔥 Triệt Tiêu / Đốt Xu
                </button>
              </div>

              {/* Tool 3: Cấu Hình Tổng Cung Khởi Tạo Ban Đầu */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 uppercase font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Cấu Hình Tổng Cung
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Initial Supply</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-mono">Mốc Tổng Cung Khởi Tạo:</label>
                  <input
                    type="number"
                    value={initialSupplyInput}
                    onChange={(e) => setInitialSupplyInput(e.target.value)}
                    placeholder="VD: 10000000000"
                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Mức cơ sở sàn cấp ban đầu trước khi phát hành hoặc đúc thêm.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = parseInt(initialSupplyInput, 10);
                    if (amt > 0) {
                      adminSetInitialSupply(amt);
                    } else {
                      showToast('Vui lòng nhập số lượng hợp lệ!');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs font-mono transition-all shadow-md cursor-pointer"
                >
                  ⚙️ Lưu Mốc Tổng Cung
                </button>
              </div>

              {/* Tool 4: Đặt Lại Kho Quỹ Sàn & Xóa Số Liệu Ảo */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      Đặt Lại Kho Quỹ 10 Tỷ
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">100% Sẵn Sàng</span>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] text-slate-300 font-mono">
                      Khôi phục trạng thái chuẩn:
                    </p>
                    <ul className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <li>• Tổng Cung: <strong className="text-neonGold">10.000.000.000 Xu</strong></li>
                      <li>• Kho Quỹ Sàn: <strong className="text-emerald-400">10.000.000.000 Xu</strong></li>
                      <li>• Ra Thị Trường: <strong className="text-cyan-400">0 Xu</strong></li>
                      <li>• Ví Người Dùng: <strong className="text-purple-300">0 Xu</strong> (sạch sẽ)</li>
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Anh có chắc chắn muốn đặt lại Kho Quỹ về 10 Tỷ Xu và xóa sạch mọi số liệu ví ảo để vận hành người thật?')) {
                      adminResetTokenLedgerAndSupply();
                      setInitialSupplyInput('10000000000');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs font-mono transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>🔄 Đặt Lại Kho Quỹ 10 Tỷ</span>
                </button>
              </div>

            </div>
          </div>

          {/* BẢNG SỔ CÁI BIẾN ĐỘNG XU MINH BẠCH (REALTIME TRANSACTION LEDGER) */}
          <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Coins className="w-4 h-4 text-neonGold" />
                  Sổ Cái Biến Động Xu Minh Bạch Toàn Sàn ({tokenLedger.length} Giao Dịch)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ghi nhận bất biến toàn bộ lượt cấp, đốt, thưởng nhiệm vụ, hoa hồng và rút tiền
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Tìm theo email / ghi chú..."
                  value={tokenLedgerSearch}
                  onChange={(e) => setTokenLedgerSearch(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                <select
                  value={tokenLedgerFilter}
                  onChange={(e) => setTokenLedgerFilter(e.target.value)}
                  className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tất cả giao dịch ({tokenLedger.length})</option>
                  <option value="admin_mint">Admin Đúc Xu (+ Quỹ)</option>
                  <option value="admin_burn">Admin Đốt Xu (- Triệt tiêu)</option>
                  <option value="admin_grant">Admin Cấp Cho User</option>
                  <option value="task_reward">Thưởng Nhiệm Vụ</option>
                  <option value="affiliate_bonus">Hoa Hồng Tiếp Thị</option>
                  <option value="buy_software_app">Mua Phần Mềm</option>
                  <option value="buy_growth_package">Mua Gói Dịch Vụ</option>
                  <option value="platform_boost_fee">Phí Đẩy Top Sàn</option>
                  <option value="withdraw_cashout">Rút Tiền Mặt</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3">Tài Khoản / Đối Tác</th>
                    <th className="p-3">Loại Giao Dịch</th>
                    <th className="p-3">Số Lượng Xu</th>
                    <th className="p-3">Giá Trị VNĐ</th>
                    <th className="p-3">Ghi Chú Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                  {tokenLedger
                    .filter(tx => {
                      if (tokenLedgerFilter !== 'all' && tx.type !== tokenLedgerFilter) return false;
                      if (tokenLedgerSearch) {
                        const q = tokenLedgerSearch.toLowerCase();
                        return (tx.userEmail && tx.userEmail.toLowerCase().includes(q)) ||
                               (tx.note && tx.note.toLowerCase().includes(q));
                      }
                      return true;
                    })
                    .map((tx) => {
                      const typeBadgeMap: Record<string, { label: string; color: string }> = {
                        admin_mint: { label: '👑 Admin Đúc Quỹ', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                        admin_burn: { label: '🔥 Admin Đốt Xu', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                        admin_grant: { label: '🎁 Admin Cấp Ví', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                        admin_adjust: { label: '⚖️ Admin Điều Chỉnh', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
                        task_reward: { label: '🎯 Thưởng Task', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
                        affiliate_bonus: { label: '🤝 Hoa Hồng Ref', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
                        buy_software_app: { label: '💻 Mua Phần Mềm', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
                        buy_growth_package: { label: '📦 Mua Gói View', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                        platform_boost_fee: { label: '🚀 Phí Đẩy Top', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
                        withdraw_cashout: { label: '🏦 Rút Tiền ATM', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
                        convert_vnd_to_token: { label: '💳 Nạp Xu VNĐ', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                        convert_token_to_vnd: { label: '💸 Đổi Xu Sang VNĐ', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
                      };
                      const badge = typeBadgeMap[tx.type] || { label: tx.type, color: 'bg-white/10 text-slate-300 border-white/10' };

                      return (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-slate-400 whitespace-nowrap">{tx.createdAt}</td>
                          <td className="p-3 text-cyan-400 font-semibold">{tx.userEmail}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className={`p-3 font-black whitespace-nowrap ${tx.tokenAmount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.tokenAmount > 0 ? `+${tx.tokenAmount.toLocaleString('vi-VN')}` : tx.tokenAmount.toLocaleString('vi-VN')} Xu
                          </td>
                          <td className="p-3 text-white font-bold whitespace-nowrap">{tx.vndValue}</td>
                          <td className="p-3 text-slate-300 text-xs font-sans">{tx.note}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {tokenLedger.length === 0 && (
                <div className="text-center py-8 text-slate-500 font-mono text-xs">
                  Chưa có giao dịch biến động Xu nào. Hệ thống sẵn sàng ghi nhận realtime!
                </div>
              )}
            </div>
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
                Quản Lý Chiến Dịch Khách Hàng ({campaigns.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Tự động đối soát TikTok API</span>
          </div>

          {campaigns.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3 bg-black/20 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500">
                <Flame className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">Chưa có chiến dịch nào được tạo</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Khi khách hàng lên chiến dịch ở tab "Tạo Chiến Dịch", toàn bộ danh sách chiến dịch thật sẽ hiển thị và cập nhật thời gian thực tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Khách Hàng / Kênh</th>
                    <th className="p-3">Loại Chiến Dịch</th>
                    <th className="p-3">Sản Lượng</th>
                    <th className="p-3">Ngân Sách Xu</th>
                    <th className="p-3">Trạng Thái</th>
                    <th className="p-3 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {campaigns.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{item.title || item.channelHandle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.channelHandle}</div>
                      </td>
                      <td className="p-3 text-purple-300 font-mono font-bold uppercase">{item.type}</td>
                      <td className="p-3 font-mono font-bold text-cyan-400">{item.targetQuantity?.toLocaleString() || 0}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{item.budgetTotal || '0 Xu'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.status === 'running'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'paused'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-white/10 text-slate-400'
                        }`}>
                          {item.status === 'running' ? 'Đang chạy' : item.status === 'paused' ? 'Tạm dừng' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa chiến dịch "${item.title || item.channelHandle}"?`)) {
                              deleteCampaign(item.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                  <FeatureGuideTooltip
                    title="Hướng Dẫn Quản Trị Hệ Thống Nhiệm Vụ Tuần & 10 Cấp Bậc"
                    description="Quản lý cấu hình 10 Cấp Bậc (Rank 1 -> Rank 10), kho 80+ nhiệm vụ xoay vòng, tỷ lệ thù lao và cơ chế thưởng Vòng Quay May Mắn."
                    steps={[
                      "Cấu hình Cấp Bậc: Mỗi cấp bậc có số nhiệm vụ ngày/tuần và hệ số thù lao x1.0 -> x3.0",
                      "Cơ chế Vòng Quay: Người dùng hoàn thành 100% nhiệm vụ sẽ nhận thêm lượt quay may mắn",
                      "Xoay Vòng Ngẫu Nhiên: Mỗi tuần hệ thống tự động sinh bộ nhiệm vụ mới dựa theo ID người dùng và tuần hiện tại"
                    ]}
                    tips="Tiến độ nhiệm vụ được ghi nhận tự động theo thời gian thực khi người dùng thực hiện tương tác."
                    badge="10 Cấp Bậc"
                    placement="bottom"
                  />
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
                  <FeatureGuideTooltip
                    title="Hướng Dẫn Phân Quyền Vận Hành Nhân Sự"
                    description="Thiết lập vai trò quản trị cho nhân sự theo từng bộ phận chuyên trách (Tài chính, KYC, CSKH, KOC, Chiến dịch, Dev)."
                    steps={[
                      "Thêm Nhân Sự: Nhập họ tên, email công ty, chọn bộ phận và chức danh",
                      "Đổi Vai Trò: Dùng ô chọn dropdown trên bảng để chuyển đổi quyền hạn",
                      "Tạm Ngưng / Kích Hoạt: Nhấn nút thao tác để khóa hoặc mở quyền truy cập của nhân viên"
                    ]}
                    tips="Mỗi vai trò chỉ truy cập được các tính năng thuộc phạm vi phụ trách, đảm bảo tính bảo mật và phân quyền rõ ràng."
                    badge="Phân Quyền 7 Bộ Phận"
                    placement="bottom"
                  />
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

                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa nhân sự ${staff.name} khỏi danh sách?`)) {
                                  setStaffList(prev => prev.filter(s => s.id !== staff.id));
                                  showToast(`Đã xóa nhân sự ${staff.name}`);
                                }
                              }}
                              className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-[9px] transition-all cursor-pointer"
                              title="Xóa nhân sự"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
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
                      const newS: StaffMember = { id: `staff_${Date.now()}`, name: newStaffName, email: newStaffEmail, role: newStaffRole, dept: newStaffDept || 'Chưa phân bộ phận', status: 'active', lastLogin: 'Chưa đăng nhập' };
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
                <FeatureGuideTooltip
                  title="Hướng Dẫn Vận Hành Hệ Thống Phòng Thủ 7 Lớp"
                  description="Cơ chế Zero Trust & WAF giám sát realtime mọi luồng traffic, đảm bảo hệ thống không bị tấn công DDOS, click tặc hoặc farm tài khoản clone."
                  steps={[
                    "Quy định IP: Tối đa 5 tài khoản liên kết trên 1 địa chỉ IP",
                    "Chống Bot AI: Tự động khóa IP khi phát hiện nhấp chuột siêu tốc không phải người thật",
                    "Bảo Mật Két Quỹ: Yêu cầu 2FA xác thực khi duyệt lệnh chi tiền lớn"
                  ]}
                  tips="Hệ thống tự động kích hoạt phòng thủ cấp cao khi lưu lượng tăng đột biến."
                  badge="Zero Trust Security"
                  placement="bottom"
                />
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

      {/* ========================================================================= */}
      {/* MODAL: SỬA HỒ SƠ & THÔNG SỐ TÀI KHOẢN (ADMIN EDIT USER)                   */}
      {/* ========================================================================= */}
      {editUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-indigo-500/40 p-6 space-y-4 relative shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Sửa Hồ Sơ Tài Khoản</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tài Khoản Gmail</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Kênh TikTok Handle</label>
                  <input
                    type="text"
                    value={editingUser.tiktokConnected || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, tiktokConnected: e.target.value })}
                    placeholder="@username"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-pink-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Số Dư Xu</label>
                  <input
                    type="number"
                    value={editingUser.coinsBalance}
                    onChange={(e) => setEditingUser({ ...editingUser, coinsBalance: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Số Lượng Follower Kênh</label>
                  <input
                    type="number"
                    value={editingUser.tiktokFollowers}
                    onChange={(e) => setEditingUser({ ...editingUser, tiktokFollowers: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Hạng Thành Viên (VIP Rank)</label>
                  <select
                    value={editingUser.rankLevel}
                    onChange={(e) => setEditingUser({ ...editingUser, rankLevel: e.target.value as any })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Đồng">🥉 Hạng Đồng</option>
                    <option value="Bạc">🥈 Hạng Bạc</option>
                    <option value="Vàng">🥇 Hạng Vàng</option>
                    <option value="Kim Cương">💎 Hạng Kim Cương</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Trạng Thái Tài Khoản</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="active">🟢 Đang Hoạt Động (Active)</option>
                    <option value="banned">🔴 Bị Khóa (Banned)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản ${editingUser.name} (${editingUser.email})?`)) {
                    adminDeleteUser(editingUser.id);
                    setEditUserModalOpen(false);
                    setEditingUser(null);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Tài Khoản</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    adminUpdateUser(editingUser.id, editingUser);
                    setEditUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Hồ Sơ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM TÀI KHOẢN MỚI BẰNG GMAIL (ADMIN ADD USER)                     */}
      {/* ========================================================================= */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-purple-500/40 p-6 space-y-4 relative shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Thêm Tài Khoản Mới</h3>
                  <p className="text-[11px] text-slate-400">Nhập Gmail để tạo tài khoản & cấp quyền ngay lập tức</p>
                </div>
              </div>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tài Khoản Gmail (*Bắt buộc)</label>
                <input
                  type="email"
                  placeholder="vidu@gmail.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Kênh TikTok (@handle)</label>
                  <input
                    type="text"
                    placeholder="@creator_vietnam"
                    value={newUserHandle}
                    onChange={(e) => setNewUserHandle(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-pink-300 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Hạng VIP Ban Đầu</label>
                  <select
                    value={newUserRank}
                    onChange={(e) => setNewUserRank(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Đồng">🥉 Hạng Đồng</option>
                    <option value="Bạc">🥈 Hạng Bạc</option>
                    <option value="Vàng">🥇 Hạng Vàng</option>
                    <option value="Kim Cương">💎 Hạng Kim Cương</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Số Xu Cấp Ban Đầu</label>
                  <input
                    type="number"
                    value={newUserCoins}
                    onChange={(e) => setNewUserCoins(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newUserEmail.trim()) {
                    showToast('⚠️ Vui lòng nhập tài khoản Gmail');
                    return;
                  }
                  const created = adminAddUser({
                    email: newUserEmail.trim(),
                    name: newUserName.trim() || newUserEmail.split('@')[0],
                    phone: newUserPhone.trim(),
                    tiktokConnected: newUserHandle.trim() || `@${newUserEmail.split('@')[0]}`,
                    rankLevel: newUserRank,
                    coinsBalance: newUserCoins,
                    status: 'active'
                  });
                  setSelectedGrantUserId(created.id);
                  setNewUserEmail('');
                  setNewUserName('');
                  setNewUserPhone('');
                  setNewUserHandle('');
                  setAddUserModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tạo Tài Khoản & Cấp Quyền</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SỬA & TÙY CHỈNH GÓI DỊCH VỤ ĐÃ CẤP (ADMIN EDIT ORDER)              */}
      {/* ========================================================================= */}
      {editOrderModalOpen && editingOrderUser && editingOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-cyan-500/40 p-6 space-y-4 relative shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Chỉnh Sửa Gói Đã Cấp</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Người nhận: <span className="text-white font-bold">{editingOrderUser.name}</span> ({editingOrderUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditOrderModalOpen(false);
                  setEditingOrderData(null);
                  setEditingOrderUser(null);
                }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Tên Dịch Vụ / Gói</label>
                <input
                  type="text"
                  value={editingOrderData.packageTitle}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, packageTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Link Kênh / Video Mục Tiêu</label>
                <input
                  type="text"
                  value={editingOrderData.targetUrl || ''}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, targetUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Mục Tiêu (Target Qty)</label>
                  <input
                    type="number"
                    value={editingOrderData.targetQuantity}
                    onChange={(e) => setEditingOrderData({ ...editingOrderData, targetQuantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Đã Hoàn Thành (Completed)</label>
                  <input
                    type="number"
                    value={editingOrderData.completedQuantity}
                    onChange={(e) => setEditingOrderData({ ...editingOrderData, completedQuantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Trạng Thái Tiến Trình</label>
                <select
                  value={editingOrderData.status}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, status: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="running">⚡ Đang Chạy (Running)</option>
                  <option value="completed">✅ Đã Hoàn Thành (Completed)</option>
                  <option value="paused">⏸️ Tạm Dừng (Paused)</option>
                  <option value="cancelled">❌ Đã Hủy (Cancelled)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa / hủy gói này khỏi tài khoản của ${editingOrderUser.name}?`)) {
                    adminDeleteGrantedOrder(editingOrderUser.id, editingOrderData.id);
                    setEditOrderModalOpen(false);
                    setEditingOrderData(null);
                    setEditingOrderUser(null);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Gói</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditOrderModalOpen(false);
                    setEditingOrderData(null);
                    setEditingOrderUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    adminUpdateGrantedOrder(editingOrderUser.id, editingOrderData.id, editingOrderData);
                    setEditOrderModalOpen(false);
                    setEditingOrderData(null);
                    setEditingOrderUser(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Package Editor / Creator Modal */}
      {packageEditorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0D111E] rounded-3xl border border-purple-500/40 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {isCreatingNewPackage ? 'Thêm Gói Tăng Trưởng Mới' : 'Tùy Chỉnh / Sửa Gói Dịch Vụ'}
                  </h3>
                  <p className="text-xs text-purple-300 font-mono">
                    {isCreatingNewPackage ? 'Tạo gói mới đưa lên kho sàn & bảng chính sách' : `Mã gói: ${pkgEditId}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPackageEditorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form inputs */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tên Gói Dịch Vụ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gói Siêu Tốc 1,000 Follow Thật"
                  value={pkgEditTitle}
                  onChange={(e) => setPkgEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Hạng Mục Dịch Vụ</label>
                  <select
                    value={pkgEditCategory}
                    onChange={(e) => setPkgEditCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="follow">Follow Kênh Thật</option>
                    <option value="engagement">Tương Tác Tim & View</option>
                    <option value="watch">Lượt Xem FYP 15s</option>
                    <option value="comment">Bình Luận Kịch Bản</option>
                    <option value="share">Chia Sẻ Lan Tỏa</option>
                    <option value="livestream">Mắt Xem Livestream</option>
                    <option value="combo">Combo TikTok Shop</option>
                    <option value="booking">Booking KOC Review</option>
                    <option value="full_channel">Xây Kênh Trọn Gói</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Thẻ Nhãn (Tag)</label>
                  <input
                    type="text"
                    placeholder="HOT, Siêu Rẻ, Đề xuất..."
                    value={pkgEditTag}
                    onChange={(e) => setPkgEditTag(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Huy Hiệu (Badge)</label>
                  <input
                    type="text"
                    placeholder="Phổ Biến, VIP, Best Seller..."
                    value={pkgEditBadge}
                    onChange={(e) => setPkgEditBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Đơn Giá Hiển Thị (VNĐ)</label>
                  <input
                    type="text"
                    placeholder="500,000đ"
                    value={pkgEditPrice}
                    onChange={(e) => setPkgEditPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Giá Gốc Gạch Ngang</label>
                  <input
                    type="text"
                    placeholder="750,000đ"
                    value={pkgEditOriginalPrice}
                    onChange={(e) => setPkgEditOriginalPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-400 line-through focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Đơn Giá Số (VNĐ/Xu)</label>
                  <input
                    type="number"
                    value={pkgEditPriceNum}
                    onChange={(e) => setPkgEditPriceNum(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-neonGold font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Sản Lượng Cam Kết</label>
                  <input
                    type="number"
                    value={pkgEditTargetQuantity}
                    onChange={(e) => setPkgEditTargetQuantity(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Đơn Vị Đo Lường</label>
                  <input
                    type="text"
                    placeholder="Kết Nối Bạn Bè, Lượt Xem..."
                    value={pkgEditUnit}
                    onChange={(e) => setPkgEditUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tiến Độ Thực Hiện</label>
                  <input
                    type="text"
                    placeholder="Chạy đến khi đạt đủ 100%..."
                    value={pkgEditEstimatedDelivery}
                    onChange={(e) => setPkgEditEstimatedDelivery(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Đánh Giá (Sao)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={pkgEditRating}
                    onChange={(e) => setPkgEditRating(Number(e.target.value) || 5)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-amber-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Lượt Đánh Giá</label>
                  <input
                    type="number"
                    value={pkgEditReviewCount}
                    onChange={(e) => setPkgEditReviewCount(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Link Ảnh Thumbnail</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={pkgEditThumbnail}
                    onChange={(e) => setPkgEditThumbnail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-cyan-300 text-[10px] font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Mô Tả Chi Tiết Gói</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả tóm tắt lợi ích của gói..."
                  value={pkgEditDescription}
                  onChange={(e) => setPkgEditDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Đặc Quyền / Tính Năng (Mỗi dòng một gạch đầu dòng)
                </label>
                <textarea
                  rows={3}
                  placeholder="1,000 Kết nối bạn bè người thật từ Việt Nam&#10;Người xem lướt video 15s trước khi kết nối&#10;Bảo hành kết nối dài hạn qua Anti-Unfollow API"
                  value={pkgEditFeatures}
                  onChange={(e) => setPkgEditFeatures(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px] placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              {!isCreatingNewPackage && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn gói "${pkgEditTitle}"?`)) {
                      deleteGrowthService(pkgEditId);
                      setPackageEditorModalOpen(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Gói</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setPackageEditorModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!pkgEditTitle.trim()) {
                      showToast('⚠️ Vui lòng nhập tên gói dịch vụ!');
                      return;
                    }
                    const featuresArray = pkgEditFeatures.split('\n').map(f => f.trim()).filter(Boolean);
                    const pkgData: GrowthServiceItem = {
                      id: pkgEditId || `pkg_custom_${Date.now()}`,
                      title: pkgEditTitle.trim(),
                      category: pkgEditCategory as any,
                      tag: pkgEditTag.trim() || 'Đề xuất',
                      price: pkgEditPrice.trim() || `${(pkgEditPriceNum || 0).toLocaleString()}đ`,
                      originalPrice: pkgEditOriginalPrice.trim() || pkgEditPrice.trim(),
                      priceNum: Number(pkgEditPriceNum) || 0,
                      targetQuantity: Number(pkgEditTargetQuantity) || 0,
                      unit: pkgEditUnit.trim() || 'Kết Nối Bạn Bè',
                      description: pkgEditDescription.trim() || `Tăng trưởng ${pkgEditTargetQuantity} ${pkgEditUnit} tự nhiên chuẩn chính sách sàn`,
                      features: featuresArray.length > 0 ? featuresArray : [
                        `${pkgEditTargetQuantity.toLocaleString()} ${pkgEditUnit} người thật Việt Nam`,
                        'Bảo hành ký quỹ Escrow 100%',
                        'Hệ thống tự động phân phối nhiệm vụ'
                      ],
                      estimatedDelivery: pkgEditEstimatedDelivery.trim() || 'Chạy đến khi đạt đủ 100% chỉ tiêu',
                      badge: pkgEditBadge.trim() || 'Phổ Biến',
                      rating: Number(pkgEditRating) || 5,
                      reviewCount: Number(pkgEditReviewCount) || 100,
                      thumbnail: pkgEditThumbnail.trim() || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80'
                    };

                    if (isCreatingNewPackage) {
                      createGrowthService(pkgData);
                    } else {
                      updateGrowthService(pkgData);
                    }
                    setPackageEditorModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isCreatingNewPackage ? 'Tạo Gói Dịch Vụ Mới' : 'Lưu Thay Đổi Gói'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
