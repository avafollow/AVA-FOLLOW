import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfileWallet, 
  TikTokTaskItem, 
  CampaignItem, 
  GrowthServiceItem, 
  AffiliateStats, 
  AdminDashboardData,
  BankAccountInfo,
  TransactionRecord,
  LivestreamTaskItem,
  LiveWatchHistoryItem,
  TokenomicsData,
  UserAnalyticsData,
  EscrowBookingContract,
  EscrowChatMessage,
  AdminUserManagementItem,
  ServiceOrder,
  PlatformCommissionSettings,
  KocProfileApplication,
  LiveBroadcastNotification,
  TASK_ACTION_REWARDS,
  SoftwareAppItem,
  AppLicensePurchase,
  KycVerificationData,
  TokenLedgerRecord,
  REFERRAL_BONUS_COINS,
  FLEXIBLE_LIVESTREAM_TIERS,
  PartnerCampaignAnnouncement,
  UserNotificationItem,
  UserTaskActionHistory,
  UserActivityPeriodReport,
  CommunityFriendItem,
  ChatMessageItem,
  OpenChatUserInput,
  MultiTargetConfig,
  CampaignAudienceTargeting,
  UserWeeklyMission,
  MissionType,
  MissionStreakData,
  MissionRank,
  MarqueeTickerItem,
  MarqueeHistoryRecord
} from '../types';
import { CongratulationData } from '../components/modals/FireworksCongratulationModal';
import { SepayCheckoutItem } from '../components/modals/SepayUniversalCheckoutModal';
import { generateWeeklyMissions, STREAK_REWARDS, getRankTierConfig, getRankByTaskCount, getNextRankTier } from '../data/weeklyMissions';
import { 
  MARQUEE_BOOST_FEE_XU, 
  INITIAL_MARQUEE_ITEMS, 
  INITIAL_MARQUEE_HISTORY 
} from '../data/marqueeData';
import { 
  USER_PROFILE_WALLET, 
  TIKTOK_TASKS, 
  ACTIVE_CAMPAIGNS, 
  AFFILIATE_DATA, 
  ADMIN_DATA,
  LIVESTREAM_TASKS,
  TOKENOMICS_DATA,
  USER_ANALYTICS,
  ESCROW_BOOKINGS,
  ADMIN_USERS_LIST,
  SOFTWARE_APPS_CATALOG,
  INITIAL_TOKEN_LEDGER,
  PARTNER_ANNOUNCEMENTS,
  INITIAL_USER_NOTIFICATIONS,
  INITIAL_USER_COMPLETED_ACTIONS,
  INITIAL_FRIENDS,
  INITIAL_CHAT_CONVERSATIONS
} from '../data/mockData';
import { 
  COMPREHENSIVE_GROWTH_PACKAGES, 
  PLATFORM_COMMISSION_DEFAULTS 
} from '../data/growthPackages';
import { 
  supabase,
  signInWithGoogleOAuth,
  syncTokenLedgerToSupabase, 
  syncKycToSupabase, 
  syncOrderToSupabase,
  syncEscrowContractToSupabase,
  registerUserToSupabase,
  syncUserProfileToSupabase,
  syncCampaignsToSupabase,
  syncTasksToSupabase,
  syncAffiliateToSupabase,
  syncMasterSnapshotToSupabase
} from '../services/supabaseClient';
import { SecurityLayerDef } from '../types';
import { 
  MAX_TIKTOK_ACCOUNTS_PER_IP, 
  DEFAULT_CLIENT_IP, 
  INITIAL_IP_ACCOUNTS, 
  SECURITY_7_LAYERS,
  SECURITY_AUDIT_LOGS 
} from '../data/securityLayersData';
import { parseMediaUrl } from '../data/videoSources';

interface TaskActionDetails {
  followed: boolean;
  liked: boolean;
  commented: boolean;
  shared: boolean;
  commentText?: string;
}

interface TikTokAppContextType {
  user: UserProfileWallet;
  tasks: TikTokTaskItem[];
  livestreamTasks: LivestreamTaskItem[];
  campaigns: CampaignItem[];
  growthServices: GrowthServiceItem[];
  affiliateData: AffiliateStats;
  adminData: AdminDashboardData;
  tokenomics: TokenomicsData;
  analytics: UserAnalyticsData;
  escrowBookings: EscrowBookingContract[];
  adminUsers: AdminUserManagementItem[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Auth state
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: (customEmail?: string) => void;
  loginWithGoogleOAuth: () => Promise<void>;
  loginWithEmail: (email: string, name: string, handle?: string) => void;
  logout: () => void;

  // Platform Commission & Fee settings
  commissionSettings: PlatformCommissionSettings;
  updateCommissionSettings: (newSettings: Partial<PlatformCommissionSettings>) => void;

  // KOC Registration
  isKocModalOpen: boolean;
  openKocModal: () => void;
  closeKocModal: () => void;
  registerKocProfile: (data: Omit<KocProfileApplication, 'id' | 'status' | 'createdAt'>) => void;
  kocApplications: KocProfileApplication[];

  // Package Purchase & Fulfillment
  isOrderModalOpen: boolean;
  selectedPackageForOrder: GrowthServiceItem | null;
  openOrderModal: (pkg: GrowthServiceItem) => void;
  closeOrderModal: () => void;
  purchaseServicePackage: (pkg: GrowthServiceItem, targetUrl: string, instructions?: string, paymentMethod?: 'coins' | 'sepay') => boolean;

  // Modals state
  runnerTask: TikTokTaskItem | null;
  isRunnerOpen: boolean;
  openRunner: (task: TikTokTaskItem) => void;
  closeRunner: () => void;
  
  isFeedRunnerOpen: boolean;
  feedRunnerFilter: 'all' | 'cross_follow' | 'community' | 'partner' | 'live';
  feedRunnerTargetId: string | null;
  tasksActiveTab: "missions" | "watch_feed" | "livestreams" | "enterprise" | "cross_follow";
  setTasksActiveTab: (tab: "missions" | "watch_feed" | "livestreams" | "enterprise" | "cross_follow") => void;
  setFeedRunnerTargetId: (id: string | null) => void;
  setFeedRunnerFilter: (filter: 'all' | 'cross_follow' | 'community' | 'partner' | 'live') => void;
  openFeedRunner: (filterOrId?: 'all' | 'cross_follow' | 'community' | 'partner' | 'live' | string | any) => void;
  closeFeedRunner: () => void;

  activeLiveTask: LivestreamTaskItem | null;
  isLiveRunnerOpen: boolean;
  openLiveRunner: (task?: LivestreamTaskItem) => void;
  closeLiveRunner: () => void;

  isLuckyWheelOpen: boolean;
  openLuckyWheel: () => void;
  closeLuckyWheel: () => void;
  spinLuckyWheel: () => { prizeText: string; coins: number };
  deductSpinFee: () => boolean;
  consumeFreeSpin: () => void;
  grantFreeSpin: (count?: number) => void;
  awardLuckyWheelPrize: (prizeIdx: number) => { prizeText: string; coins: number; followers?: number; index: number };

  isConnectOpen: boolean;
  openConnect: () => void;
  closeConnect: () => void;
  
  isWithdrawOpen: boolean;
  openWithdraw: () => void;
  closeWithdraw: () => void;
  
  isDepositOpen: boolean;
  openDeposit: () => void;
  closeDeposit: () => void;

  // SePay Universal Checkout Modal
  isSepayModalOpen: boolean;
  sepayCheckoutItem: SepayCheckoutItem | null;
  openSepayModal: (item: SepayCheckoutItem) => void;
  closeSepayModal: () => void;

  isPolicyOpen: boolean;
  openPolicy: () => void;
  closePolicy: () => void;

  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;

  activeEscrowContract: EscrowBookingContract | null;
  isSubmitDemoModalOpen: boolean;
  openSubmitDemoModal: (contract: EscrowBookingContract) => void;
  closeSubmitDemoModal: () => void;

  // Share Video Modal (Facebook, Messenger & Friends)
  isShareModalOpen: boolean;
  shareVideoData: { targetUrl: string; title: string; taskId?: string } | null;
  openShareModal: (data: { targetUrl: string; title: string; taskId?: string }) => void;
  closeShareModal: () => void;
  updateConnectedTikTok: (handle: string) => void;

  // PWA Add to Home Screen Modal & Guide
  isPwaModalOpen: boolean;
  openPwaModal: () => void;
  closePwaModal: () => void;

  // Actions
  completeTask: (taskId: string, actions: TaskActionDetails) => { coinsEarned: number; vndEarned: number };
  watchLivestreamMinute: (taskId: string) => void;
  completeLivestreamSession: (
    taskId: string, 
    minutesWatched: number, 
    tapsCount: number, 
    passedCaptcha: boolean
  ) => { coinsEarned: number; milestoneBonus: number; nextUnlockedTaskTitle?: string };
  getUserLiveQuota: () => {
    rank: MissionRank | string;
    maxLivePerDay: number;
    completedToday: number;
    remainingToday: number;
    multiplier: number;
  };

  // Hệ Thống Tính Điểm Đơn Lẻ (Mỗi hành động tính 1 lượt duy nhất)
  claimTaskAction: (taskId: string, actionType: 'follow' | 'like' | 'comment' | 'share' | 'bookmark' | 'watch') => number;

  // Hệ Thống Phát Live Cộng Đồng & Giao Nhận Gói Dành Cho Người Mua Gói
  activeBroadcastNotification: LiveBroadcastNotification | null;
  dismissBroadcastNotification: () => void;
  broadcastLiveSession: (orderId: string, liveUrl: string, roomTitle: string) => boolean;
  interactWithLiveBroadcast: (broadcastId: string, action: 'eye' | 'heart' | 'comment' | 'share') => number;
  isBuyerPortalOpen: boolean;
  openBuyerPortal: () => void;
  closeBuyerPortal: () => void;

  // Bảng Điện LED Toàn Sàn (Marquee Horizontal Ticker)
  marqueeTickerList: MarqueeTickerItem[];
  marqueeHistoryList: MarqueeHistoryRecord[];
  isMarqueeBoostModalOpen: boolean;
  selectedMarqueeBoostTarget: any;
  openMarqueeBoostModal: (target?: any) => void;
  closeMarqueeBoostModal: () => void;
  isMarqueeHistoryModalOpen: boolean;
  openMarqueeHistoryModal: () => void;
  closeMarqueeHistoryModal: () => void;
  boostToMarquee: (
    targetId: string, 
    itemType: 'campaign' | 'livestream' | 'custom', 
    customData?: { title: string; handle: string; url: string; targetQuantity?: number; rewardText?: string }
  ) => boolean;
  endMarqueeItem: (id: string, reason?: 'livestream_ended' | 'campaign_completed' | 'user_ended') => void;

  checkInDaily: () => void;
  connectTikTok: (handle: string) => void;
  disconnectTikTok: () => void;
  connectFacebook: (urlOrHandle: string, fbType?: 'personal' | 'fanpage' | 'group') => void;
  disconnectFacebook: () => void;
  connectYoutube: (urlOrHandle: string) => void;
  disconnectYoutube: () => void;
  deposit: (amountVND: number, method: string) => void;
  withdraw: (amountVND: number, bankInfo: BankAccountInfo) => boolean;
  saveBankInfo: (bankInfo: BankAccountInfo) => void;
  createCampaign: (campaign: {
    title: string;
    type: CampaignItem['type'];
    channelHandle: string;
    targetUrl: string;
    targetQuantity: number;
    budgetTotal: string;
    budgetCoins?: number;
    pricePerAction: string;
    instructions: string;
    livestreamMinutes?: number;
    multiTargets?: MultiTargetConfig[];
    audienceTargeting?: CampaignAudienceTargeting;
    videoPreviewUrl?: string;
  }) => boolean;
  unlockCampaignAnalytics: (campaignId: string) => boolean;
  boostCampaignToTop: (campaignId: string) => boolean;
  approveCampaign: (campaignId: string) => void;
  rejectCampaign: (campaignId: string) => void;
  deleteCampaign: (campaignId: string) => void;
  endAndRefundLivestreamCampaign: (campaignId: string, reason?: string) => { refundedCoins: number; message: string };
  cancelCampaignWithRefund: (campaignId: string) => { refundedCoins: number; message: string };
  deleteAdminUser: (userId: string) => void;
  createGrowthService: (pkg: GrowthServiceItem) => void;
  updateGrowthService: (pkg: GrowthServiceItem) => void;
  deleteGrowthService: (pkgId: string) => void;
  orderService: (service: GrowthServiceItem) => void;
  convertTokenToCoins: (tokenAmount: number) => void;

  // Escrow Actions
  createEscrowBooking: (data: Omit<EscrowBookingContract, 'id' | 'contractCode' | 'status' | 'createdAt'>) => boolean;
  acceptEscrowBooking: (contractId: string) => void;
  submitEscrowDemo: (contractId: string, demoUrl: string, note: string) => void;
  approveEscrowDisburse: (contractId: string) => void;
  disputeEscrow: (contractId: string, reason: string) => void;
  adminResolveDispute: (contractId: string, resolution: 'release_to_koc' | 'refund_to_brand') => void;
  adminEnforceKocPenalty: (contractId: string, level: 1 | 2 | 3 | 4, reason: string, refundToBrand?: boolean) => void;

  // Escrow Advanced: Extension, Review, Freeze & Dispute Resolution
  requestContractExtension: (contractId: string, days: number, reason: string) => void;
  respondToContractExtension: (contractId: string, accept: boolean, responseNote?: string) => void;
  approveEscrowWithReview: (contractId: string, rating: number, review: string) => void;
  freezeEscrowContract: (contractId: string, reason: string, frozenBy: 'client' | 'koc') => void;
  requestVideoRevision: (contractId: string, revisionNotes: string) => void;
  requestRefundEscrow: (contractId: string, refundReason: string) => void;

  // Permanent Chat & Audit Trail (Không được xóa)
  contractChats: Record<string, EscrowChatMessage[]>;
  sendContractChatMessage: (contractId: string, sender: 'client' | 'koc' | 'system', senderName: string, text: string) => void;
  
  // KYC Verification
  isKycModalOpen: boolean;
  openKycModal: () => void;
  closeKycModal: () => void;
  submitKyc: (data: KycVerificationData) => void;
  adminApproveKyc: (userId: string) => void;
  adminRejectKyc: (userId: string, reason: string) => void;
  kycRequests: KycVerificationData[];

  // App Marketplace (App Kiếm Tiền)
  softwareApps: SoftwareAppItem[];
  addSoftwareApp: (app: Omit<SoftwareAppItem, 'id' | 'rating' | 'reviewCount' | 'downloadsCount'>) => void;
  updateSoftwareApp: (appId: string, updated: Partial<SoftwareAppItem>) => void;
  deleteSoftwareApp: (appId: string) => void;
  myAppLicenses: AppLicensePurchase[];
  buySoftwareApp: (appId: string, paymentMethod?: 'token' | 'coins' | 'vnd') => AppLicensePurchase | null;

  // Token Management & Sinks (Cung cấp bởi sàn)
  tokenLedger: TokenLedgerRecord[];
  tokenSupplyConfig: {
    initialSupply: number;
    mintedSupply: number;
    manualBurnedSupply: number;
  };
  adminMintTreasuryTokens: (amount: number, note?: string) => void;
  adminBurnTreasuryTokens: (amount: number, note?: string) => void;
  adminSetInitialSupply: (amount: number) => void;
  adminResetTokenLedgerAndSupply: () => void;
  convertVndToToken: (amountVND: number) => boolean;
  convertTokenToVnd: (tokenAmount: number) => boolean;
  orderServiceWithToken: (pkg: GrowthServiceItem, targetUrl: string) => boolean;

  // Admin Grant Actions
  adminToggleUserStatus: (userId: string) => void;
  adminAdjustUserCoins: (userId: string, amount: number) => void;
  adminGrantPackage: (userId: string, packageItem: GrowthServiceItem) => void;
  adminAdjustUserFollowers: (userId: string, count: number) => void;
  adminChangeUserRank: (userId: string, rank: string) => void;
  adminAddUser: (user: Partial<AdminUserManagementItem>) => AdminUserManagementItem;
  adminUpdateUser: (userId: string, data: Partial<AdminUserManagementItem>) => void;
  adminDeleteUser: (userId: string) => void;
  adminUpdateGrantedOrder: (userId: string, orderId: string, data: Partial<ServiceOrder>) => void;
  adminDeleteGrantedOrder: (userId: string, orderId: string) => void;

  // Referral & Anti-Spam Verification
  claimReferralReward: (refId: string) => boolean;
  simulateFriendTaskAction: (refId: string, taskType?: string) => void;

  // Partner Announcements (Public Ticker - Ai đến trước nhận trước)
  partnerAnnouncements: PartnerCampaignAnnouncement[];
  dismissPartnerAnnouncement: (id: string) => void;

  // Ưu tiên Đẩy Top Chiến Dịch (-5.000 Xu thu về sàn)
  boostCampaign: (taskId: string) => boolean;
  platformBoostRevenue: number;

  // Lịch sử nhiệm vụ đã làm & Chống trùng lặp (Bảo vệ quyền lợi chủ shop)
  userCompletedActions: Record<string, UserTaskActionHistory>;

  // Thông báo thời gian thực về tài khoản người dùng
  userNotifications: UserNotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<UserNotificationItem, 'id' | 'timestamp' | 'isRead'> & { timestamp?: string }) => void;

  // Báo cáo hoạt động Ngày - Tuần - Tháng chi tiết
  getActivityReport: (period: 'day' | 'week' | 'month') => UserActivityPeriodReport;

  // Mạng Xã Hội Facebook: Bạn bè & Nhắn tin Messenger
  friends: CommunityFriendItem[];
  chatConversations: Record<string, ChatMessageItem[]>;
  activeChatUser: CommunityFriendItem | null;
  openChatWithUser: (user: OpenChatUserInput) => void;
  closeChat: () => void;
  toggleFriendship: (handle: string, name?: string, avatar?: string, role?: string) => void;
  sendChatMessage: (recipientHandle: string, text: string) => void;

  // Hệ Thống Bảo Mật An Toàn Tuyệt Đối 7 Lớp & Giới Hạn 5 Tài Khoản / IP
  clientIp: string;
  maxAccountsPerIp: number;
  connectedAccountsOnIp: string[];
  canConnectMoreAccounts: boolean;
  security7Layers: SecurityLayerDef[];
  securityAuditLogs: typeof SECURITY_AUDIT_LOGS;
  switchActiveTikTokAccount: (handle: string) => void;
  removeAccountFromIp: (handle: string) => void;

  // Hệ Thống Nhiệm Vụ Sàn & Chuỗi Ngày - Tuần - Tháng (Streak)
  userMissions: UserWeeklyMission[];
  missionStreak: MissionStreakData;
  recordMissionProgress: (type: MissionType, count?: number) => void;
  claimMissionReward: (defId: string) => void;
  claimAllCategoryMissions: (category: 'daily' | 'weekly' | 'special') => void;
  claimStreakReward: (period: 'daily' | 'weekly' | 'monthly') => void;

  // Modal Pháo Hoa Chúc Mừng Toàn Hệ Thống (Nhiệm vụ, Chuỗi, Quyết toán hợp đồng, Thăng hạng)
  fireworksData: CongratulationData | null;
  isFireworksOpen: boolean;
  triggerFireworks: (data: CongratulationData) => void;
  closeFireworks: () => void;
}

const TikTokAppContext = createContext<TikTokAppContextType | undefined>(undefined);

export const TikTokAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileWallet>(() => {
    try {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('ava_user_profile') : null;
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const savedEmail = (typeof window !== 'undefined' ? localStorage.getItem('ava_user_email') : null) || parsed.email;
        const savedTiktok = (typeof window !== 'undefined' ? localStorage.getItem('ava_tiktok_connected') : null) || parsed.tiktokConnected;
        const isAdmin = savedEmail === 'quocthiencr90@gmail.com' || parsed.isAdmin;
        // Khử số dư ảo hàng tỷ xu từ dữ liệu test cũ
        const cleanCoins = (Number(parsed.avaliveCoins) >= 1000000000 || isNaN(Number(parsed.avaliveCoins))) ? 0 : (Number(parsed.avaliveCoins) || 0);
        return {
          ...USER_PROFILE_WALLET,
          ...parsed,
          avaliveCoins: cleanCoins,
          coinsValueVND: `${cleanCoins.toLocaleString('vi-VN')}đ`,
          email: savedEmail || parsed.email || USER_PROFILE_WALLET.email,
          tiktokConnected: savedTiktok !== null ? savedTiktok : parsed.tiktokConnected,
          isAdmin
        };
      }
      const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('ava_user_email') : null;
      const savedTiktok = typeof window !== 'undefined' ? localStorage.getItem('ava_tiktok_connected') : null;
      const baseTiktok = savedTiktok !== null ? savedTiktok : USER_PROFILE_WALLET.tiktokConnected;
      const isVerified = Boolean(baseTiktok && baseTiktok.trim().length > 0);

      if (savedEmail) {
        const isAdmin = savedEmail === 'quocthiencr90@gmail.com';
        return {
          ...USER_PROFILE_WALLET,
          email: savedEmail,
          name: isAdmin ? 'Nguyễn Quốc Thiện (Admin)' : USER_PROFILE_WALLET.name,
          role: isAdmin ? 'Super Admin • Quản Trị Hệ Thống' : 'Nhà Sáng Tạo AVA FOLLOW',
          isAdmin,
          tiktokConnected: baseTiktok,
          isTikTokVerified: isVerified,
          avatar: isAdmin 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : USER_PROFILE_WALLET.avatar
        };
      }
      return {
        ...USER_PROFILE_WALLET,
        tiktokConnected: baseTiktok,
        isTikTokVerified: isVerified,
        isAdmin: false
      };
    } catch {}
    return {
      ...USER_PROFILE_WALLET,
      isAdmin: false
    };
  });

  const [tasks, setTasks] = useState<TikTokTaskItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_tasks') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const localSamples = ['/videos/sample1.mp4', '/videos/sample2.mp4', '/videos/sample3.mp4'];
          return parsed.map((t: TikTokTaskItem, i: number) => {
            if (!t.videoPreviewUrl || t.videoPreviewUrl.includes('test-videos.co.uk') || t.videoPreviewUrl.includes('interactive-examples') || t.videoPreviewUrl.includes('vjs.zencdn.net')) {
              return { ...t, videoPreviewUrl: localSamples[i % localSamples.length] };
            }
            return t;
          });
        }
      }
    } catch {}
    return TIKTOK_TASKS;
  });

  const [livestreamTasks, setLivestreamTasks] = useState<LivestreamTaskItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_livestream_tasks') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return LIVESTREAM_TASKS;
  });

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_campaigns') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ACTIVE_CAMPAIGNS;
  });

  const [growthServices, setGrowthServices] = useState<GrowthServiceItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_growth_packages') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return COMPREHENSIVE_GROWTH_PACKAGES;
  });

  const [affiliateData, setAffiliateData] = useState<AffiliateStats>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_affiliate_data') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch {}
    return AFFILIATE_DATA;
  });

  const [adminData, setAdminData] = useState<AdminDashboardData>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_admin_data') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch {}
    return ADMIN_DATA;
  });

  const [tokenomics, setTokenomics] = useState<TokenomicsData>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_tokenomics_data') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch {}
    return TOKENOMICS_DATA;
  });

  const [analytics, setAnalytics] = useState<UserAnalyticsData>(USER_ANALYTICS);

  const [escrowBookings, setEscrowBookings] = useState<EscrowBookingContract[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_escrow_bookings') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Lọc sạch 100% hợp đồng mock / demo cũ
          const realOnly = parsed.filter((c: EscrowBookingContract) => 
            c && c.id && 
            !c.id.startsWith('mock_') && 
            !c.id.startsWith('esc_') &&
            !c.id.startsWith('escrow_demo') &&
            !c.id.startsWith('escrow_mock') &&
            !c.id.startsWith('koc_contract_') &&
            !c.id.startsWith('demo_') &&
            !c.id.includes('sample') &&
            !c.id.includes('demo') &&
            !c.id.includes('mock')
          );
          return realOnly;
        }
      }
    } catch {}
    return [];
  });

  const [adminUsers, setAdminUsers] = useState<AdminUserManagementItem[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_admin_users') : null;
      if (saved) {
        const parsed: AdminUserManagementItem[] = JSON.parse(saved);
        // Loại bỏ hoàn toàn các tài khoản demo cũ
        const filtered = parsed.filter(u => 
          u && u.id && 
          !u.id.startsWith('usr_') && 
          !u.id.startsWith('mock_') && 
          !u.id.startsWith('demo_') &&
          !u.id.includes('demo') &&
          !['phuongbeauty.koc@gmail.com', 'thanhgrowth@tiktok.com', 'contact@zenskin.vn', 'long@agencyvip.com', 'demo@avalive.vn', 'nguyenvana@gmail.com', 'tranthib@gmail.com', 'lequangc@gmail.com'].includes(u.email)
        );
        return filtered;
      }
    } catch {}
    return ADMIN_USERS_LIST;
  });

  // TỰ ĐỘNG LƯU VĨNH VIỄN VÀO LOCALSTORAGE VÀ ĐỒNG BỘ SUPABASE CLOUD (KHÔNG MẤT DỮ LIỆU)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_user_profile', JSON.stringify(user));
        if (user.email) {
          localStorage.setItem('ava_user_email', user.email);
        }
        if (user.tiktokConnected) {
          localStorage.setItem('ava_tiktok_connected', user.tiktokConnected);
        }
      }
      syncUserProfileToSupabase(user);
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_campaigns', JSON.stringify(campaigns));
      }
      syncCampaignsToSupabase(campaigns);
    } catch {}
  }, [campaigns]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_tasks', JSON.stringify(tasks));
        localStorage.setItem('ava_livestream_tasks', JSON.stringify(livestreamTasks));
      }
      syncTasksToSupabase(tasks, livestreamTasks);
    } catch {}
  }, [tasks, livestreamTasks]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_growth_packages', JSON.stringify(growthServices));
      }
    } catch {}
  }, [growthServices]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_admin_users', JSON.stringify(adminUsers));
      }
    } catch {}
  }, [adminUsers]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_affiliate_data', JSON.stringify(affiliateData));
      }
      syncAffiliateToSupabase(affiliateData);
    } catch {}
  }, [affiliateData]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_escrow_bookings', JSON.stringify(escrowBookings));
      }
    } catch {}
  }, [escrowBookings]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_admin_data', JSON.stringify(adminData));
      }
    } catch {}
  }, [adminData]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_tokenomics_data', JSON.stringify(tokenomics));
      }
    } catch {}
  }, [tokenomics]);

  // Master Snapshot Backup Định kỳ lên Supabase
  useEffect(() => {
    const backupTimer = setTimeout(() => {
      syncMasterSnapshotToSupabase({
        user,
        adminUsers,
        campaigns,
        tasks,
        livestreamTasks,
        escrowBookings,
        affiliateData,
        adminData
      });
    }, 4000);
    return () => clearTimeout(backupTimer);
  }, [user, adminUsers.length, campaigns.length, tasks.length]);

  // Escrow Permanent Audit Chat History (Lưu trữ vĩnh viễn không thể xóa trên LocalStorage & Smart Vault)
  const [contractChats, setContractChats] = useState<Record<string, EscrowChatMessage[]>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('tiktok_pro_escrow_chats_permanent') : null;
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'default': [
        {
          id: 'm1',
          contractId: 'default',
          sender: 'system',
          senderName: 'Sàn TikTok Pro Escrow (Audit Vault)',
          text: '🛡️ Hệ thống Ký Quỹ Escrow đã kích hoạt hợp đồng và khóa an toàn 100% tiền cọc. Toàn bộ lịch sử đối thoại, đề xuất gia hạn, và nghiệm thu được bảo mật và lưu trữ vĩnh viễn không thể xóa để làm bằng chứng pháp lý bảo vệ 3 bên.',
          timestamp: 'Hôm nay lúc 09:15',
          isAuditPinned: true
        },
        {
          id: 'm2',
          contractId: 'default',
          sender: 'client',
          senderName: 'Bên Thuê (Brand)',
          text: 'Chào bạn, bên mình đã gửi brief sản phẩm và mong muốn video tập trung vào chất liệu và giỏ hàng nhé! Bạn check và báo thời gian dự kiến lên demo nha.',
          timestamp: 'Hôm nay lúc 09:20'
        },
        {
          id: 'm3',
          contractId: 'default',
          sender: 'koc',
          senderName: 'KOC / Studio Sáng Tạo',
          text: 'Dạ em chào shop! Em đã xem kỹ brief rồi ạ. Shop gửi mẫu về giúp em nhé. Dự kiến chiều mai em bấm máy và nộp link video demo cho shop duyệt trong 72h!',
          timestamp: 'Hôm nay lúc 09:35'
        }
      ]
    };
  });

  const sendContractChatMessage = (
    contractId: string,
    sender: 'client' | 'koc' | 'system',
    senderName: string,
    text: string
  ) => {
    const key = contractId || 'default';
    const newMsg: EscrowChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      contractId: key,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay'
    };
    setContractChats(prev => {
      const prevList = prev[key] || prev['default'] || [];
      const updated = {
        ...prev,
        [key]: [...prevList, newMsg]
      };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('tiktok_pro_escrow_chats_permanent', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
  };
  
  // Commission & Fee state
  const [commissionSettings, setCommissionSettings] = useState<PlatformCommissionSettings>(PLATFORM_COMMISSION_DEFAULTS);

  // 7-Layer Security & IP Account Limit state (Tối đa 5 tài khoản / 1 IP)
  const [clientIp] = useState<string>(DEFAULT_CLIENT_IP);
  const [ipAccountsMap, setIpAccountsMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('tiktok_pro_ip_accounts') : null;
      return saved ? JSON.parse(saved) : INITIAL_IP_ACCOUNTS;
    } catch {
      return INITIAL_IP_ACCOUNTS;
    }
  });

  const connectedAccountsOnIp = ipAccountsMap[clientIp] || ['@vietnam_creator_master'];
  const canConnectMoreAccounts = connectedAccountsOnIp.length < MAX_TIKTOK_ACCOUNTS_PER_IP;

  const saveIpAccounts = (newMap: Record<string, string[]>) => {
    setIpAccountsMap(newMap);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tiktok_pro_ip_accounts', JSON.stringify(newMap));
      }
    } catch {}
  };

  const switchActiveTikTokAccount = (handle: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_tiktok_connected', handle);
      }
    } catch {}
    setUser(prev => ({
      ...prev,
      tiktokConnected: handle,
      isTikTokVerified: true
    }));
    showToast(`Đã chuyển hoạt động sang tài khoản TikTok ${handle}`);
  };

  const removeAccountFromIp = (handleToRemove: string) => {
    const currentList = ipAccountsMap[clientIp] || [];
    const updated = currentList.filter(h => h !== handleToRemove);
    const newMap = { ...ipAccountsMap, [clientIp]: updated };
    saveIpAccounts(newMap);
    if (user.tiktokConnected === handleToRemove) {
      const nextAcc = updated[0] || '';
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ava_tiktok_connected', nextAcc);
        }
      } catch {}
      setUser(prev => ({
        ...prev,
        tiktokConnected: nextAcc,
        isTikTokVerified: updated.length > 0
      }));
    }
    showToast(`Đã xóa tài khoản ${handleToRemove} khỏi IP này (${updated.length}/${MAX_TIKTOK_ACCOUNTS_PER_IP} tài khoản)`);
  };

  // Hệ Thống Nhiệm Vụ Sàn Cung Cấp & Chuỗi Streak (Ngày - Tuần - Tháng)
  const [userMissions, setUserMissions] = useState<UserWeeklyMission[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('avalive_user_missions') : null;
      if (saved) return JSON.parse(saved);
    } catch {}
    return generateWeeklyMissions(
      USER_PROFILE_WALLET.rankLevel,
      USER_PROFILE_WALLET.handle || 'user_default',
      !!(USER_PROFILE_WALLET.myOrders && USER_PROFILE_WALLET.myOrders.length > 0),
      USER_PROFILE_WALLET.myOrders?.[0]?.category
    );
  });

  const [missionStreak, setMissionStreak] = useState<MissionStreakData>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('avalive_mission_streak') : null;
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      dailyCompletedCount: 3,
      dailyTotalCount: 8,
      isDailyAllClear: false,
      dailyBonusClaimed: false,
      dailyBonusXu: STREAK_REWARDS.dailyAllClearBonus,

      weeklyStreakDays: 5,
      isWeeklyStreakDone: false,
      weeklyBonusClaimed: false,
      weeklyBonusXu: STREAK_REWARDS.weeklyStreakBonus,

      monthlyStreakDays: 18,
      isMonthlyStreakDone: false,
      monthlyBonusClaimed: false,
      monthlyBonusXu: STREAK_REWARDS.monthlyStreakBonus,
    };
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('avalive_user_missions', JSON.stringify(userMissions));
      }
    } catch {}
  }, [userMissions]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('avalive_mission_streak', JSON.stringify(missionStreak));
      }
    } catch {}
  }, [missionStreak]);

  // Tự động nhận diện & làm đầy tiến độ nhiệm vụ sàn (Đa tác vụ đồng thời: xem, thả tim, follow, comment, share...)
  const recordMissionProgress = (type: MissionType, count: number = 1) => {
    setUserMissions(prev => {
      let newlyCompletedMission: UserWeeklyMission | null = null;
      const updated = prev.map(m => {
        if (m.type !== type || m.status !== 'active') return m;
        const next = Math.min(m.completedCount + count, m.targetCount);
        const isDone = next >= m.targetCount;
        if (isDone) {
          newlyCompletedMission = { ...m, completedCount: next, status: 'completed' as const };
        }
        return {
          ...m,
          completedCount: next,
          status: isDone ? ('completed' as const) : ('active' as const)
        };
      });

      // Update daily all-clear streak
      const dailyActive = updated.filter(m => m.category === 'daily');
      const dailyDone = dailyActive.filter(m => m.status !== 'active').length;
      const allDailyDone = dailyActive.length > 0 && dailyDone >= dailyActive.length;

      setMissionStreak(s => ({
        ...s,
        dailyCompletedCount: dailyDone,
        dailyTotalCount: dailyActive.length,
        isDailyAllClear: allDailyDone
      }));

      // Khi hoàn thành nhiệm vụ: Thông báo nhẹ nhàng hướng dẫn bấm Nhận Thưởng, chỉ chúc mừng khi nhận thưởng hoặc hoàn thành tất cả
      if (newlyCompletedMission) {
        const targetMission = newlyCompletedMission as UserWeeklyMission;
        showToast(`🎯 Đã hoàn thành chỉ tiêu "${targetMission.title}"! Bấm "Nhận Thưởng" để cộng +${targetMission.rewardXu.toLocaleString()} Xu.`);
      }

      return updated;
    });
  };

  // Người dùng bấm vào nút "Hoàn Thành" để nhận Xu của từng nhiệm vụ
  const claimMissionReward = (defId: string) => {
    const mission = userMissions.find(m => m.defId === defId);
    if (!mission || mission.status !== 'completed') return;

    setUserMissions(prev => prev.map(m => m.defId === defId ? { ...m, status: 'claimed' as const } : m));

    const reward = mission.rewardXu;
    const newCoins = user.avaliveCoins + reward;
    const newTx: TransactionRecord = {
      id: `tx_mission_${Date.now()}`,
      type: 'earn',
      title: `Thưởng Hoàn Thành Nhiệm Vụ Sàn: ${mission.title}`,
      amount: `+${reward.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      todayEarningsCoins: prev.todayEarningsCoins + reward,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + reward
    }));

    triggerFireworks({
      type: 'mission',
      badge: '🎁 TẤT TOÁN THÙ LAO NHIỆM VỤ',
      title: `CHÚC MỪNG BẠN ĐÃ NHẬN THƯỞNG!`,
      subtitle: `${mission.title}`,
      rewardText: `+${reward.toLocaleString()} XU VÀO VÍ`,
      message: `Chúc mừng bạn đã nỗ lực hoàn thành xuất sắc nhiệm vụ được giao. Từng lượt tương tác của bạn là một bước tiến vững chắc đưa tài khoản thăng cấp bứt phá!`
    });
  };

  // Nhận toàn bộ thưởng Xu khi hoàn thành 100% tất cả nhiệm vụ trong danh mục (All-or-Nothing Pool)
  const claimAllCategoryMissions = (category: 'daily' | 'weekly' | 'special') => {
    const categoryMissions = userMissions.filter(m => m.category === category);
    if (categoryMissions.length === 0) return;

    const allCompleted = categoryMissions.every(m => m.completedCount >= m.targetCount);
    const alreadyClaimed = categoryMissions.every(m => m.status === 'claimed');

    if (alreadyClaimed) {
      showToast('⚠️ Bạn đã nhận trọn bộ quỹ thưởng này rồi!');
      return;
    }

    if (!allCompleted) {
      const remaining = categoryMissions.filter(m => m.completedCount < m.targetCount).length;
      showToast(`⚠️ Bạn chưa hoàn thành tất cả nhiệm vụ! Còn lại ${remaining} nhiệm vụ cần hoàn tất để nhận thưởng.`);
      return;
    }

    // Lấy thông tin tier cấp bậc hiện tại của người dùng (10 cấp bậc)
    const tierCfg = getRankTierConfig(user.rankLevel);
    const spinsBonus = tierCfg.wheelSpinsBonus || 1;

    // Tính tổng Xu thưởng của tất cả nhiệm vụ trong danh mục
    const totalReward = categoryMissions.reduce((sum, m) => sum + m.rewardXu, 0);

    // Cập nhật tất cả mission trong danh mục thành 'claimed'
    setUserMissions(prev => prev.map(m => m.category === category ? { ...m, status: 'claimed' as const } : m));

    // Cộng Xu & Vòng Quay May Mắn vào tài khoản và ghi sổ giao dịch
    const newCoins = user.avaliveCoins + totalReward;
    const categoryLabels = {
      daily: 'Chuỗi Nhiệm Vụ Ngày',
      weekly: 'Chuỗi Nhiệm Vụ Tuần',
      special: 'Chuỗi Nhiệm Vụ Đặc Biệt VIP'
    };
    const catLabel = categoryLabels[category] || 'Nhiệm Vụ';

    const newTx: TransactionRecord = {
      id: `tx_missions_all_${category}_${Date.now()}`,
      type: 'earn',
      title: `Nhận Trọn Bộ Quỹ Thưởng ${catLabel} (${tierCfg.badge} • 100% Hoàn Tất)`,
      amount: `+${totalReward.toLocaleString()} Xu & +${spinsBonus} Vòng Quay May Mắn`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      luckyWheelFreeSpins: (prev.luckyWheelFreeSpins || 0) + spinsBonus,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      todayEarningsCoins: prev.todayEarningsCoins + totalReward,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + totalReward
    }));

    // Tự động kích hoạt rương ngày nếu là daily
    if (category === 'daily') {
      setMissionStreak(prev => ({
        ...prev,
        isDailyAllClear: true,
        dailyCompletedCount: categoryMissions.length,
        dailyTotalCount: categoryMissions.length
      }));
    }

    showToast(`🎁 Đã tất toán trọn bộ +${totalReward.toLocaleString()} Xu & tặng +${spinsBonus} lượt quay may mắn!`);

    triggerFireworks({
      type: 'mission',
      badge: `🎁 NHẬN TRỌN BỘ QUỸ THƯỞNG ${catLabel.toUpperCase()} (${tierCfg.badge})`,
      title: `XUẤT SẮC HOÀN THÀNH 100% TẤT CẢ NHIỆM VỤ!`,
      subtitle: `${categoryMissions.length}/${categoryMissions.length} Nhiệm vụ hoàn tất • ${tierCfg.name}`,
      rewardText: `+${totalReward.toLocaleString()} XU & +${spinsBonus} LƯỢT QUAY MAY MẮN 🎡`,
      message: `Tuyệt vời! Bạn đã hoàn thành trọn vẹn 100% toàn bộ nhiệm vụ ${catLabel.toLowerCase()} được giao ở ${tierCfg.shortTitle}. Quỹ thưởng Xu tổng đã được giải ngân và sàn tặng thêm cho bạn +${spinsBonus} lượt quay vòng quay may mắn!`
    });
  };

  // Nhận thưởng Rương Chuỗi Ngày, Tuần, Tháng (Streaks)
  const claimStreakReward = (period: 'daily' | 'weekly' | 'monthly') => {
    let reward = 0;
    let label = '';

    if (period === 'daily') {
      if (!missionStreak.isDailyAllClear || missionStreak.dailyBonusClaimed) {
        showToast('⚠️ Bạn chưa hoàn thành tất cả nhiệm vụ ngày hôm nay hoặc đã nhận thưởng rồi!');
        return;
      }
      reward = missionStreak.dailyBonusXu;
      label = 'Rương Hoàn Tất Nhiệm Vụ Trong Ngày';
      setMissionStreak(prev => ({ ...prev, dailyBonusClaimed: true }));
    } else if (period === 'weekly') {
      if (missionStreak.weeklyStreakDays < 7 || missionStreak.weeklyBonusClaimed) {
        showToast(`⚠️ Bạn cần hoàn thành đủ 7 ngày liên tiếp để mở rương tuần (Hiện tại: ${missionStreak.weeklyStreakDays}/7 ngày)!`);
        return;
      }
      reward = missionStreak.weeklyBonusXu;
      label = 'Rương Thần Kỳ 7 Ngày Liên Tiếp';
      setMissionStreak(prev => ({ ...prev, weeklyBonusClaimed: true }));
    } else if (period === 'monthly') {
      if (missionStreak.monthlyStreakDays < 30 || missionStreak.monthlyBonusClaimed) {
        showToast(`⚠️ Bạn cần hoàn thành chuỗi 30 ngày liên tiếp để mở rương tháng (Hiện tại: ${missionStreak.monthlyStreakDays}/30 ngày)!`);
        return;
      }
      reward = missionStreak.monthlyBonusXu;
      label = 'Rương Huyền Thoại 30 Ngày Liên Tiếp';
      setMissionStreak(prev => ({ ...prev, monthlyBonusClaimed: true }));
    }

    if (reward > 0) {
      const newCoins = user.avaliveCoins + reward;
      const newTx: TransactionRecord = {
        id: `tx_streak_${Date.now()}`,
        type: 'earn',
        title: `Phần thưởng Streak: ${label}`,
        amount: `+${reward.toLocaleString()} Xu`,
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        transactions: [newTx, ...prev.transactions]
      }));

      triggerFireworks({
        type: 'streak',
        badge: '🏆 THƯỞNG CHUỖI HUYỀN THOẠI',
        title: `MỞ KHÓA THÀNH CÔNG: ${label.toUpperCase()}!`,
        subtitle: `Duy trì kỷ luật thép và hoàn thành xuất sắc chuỗi nhiệm vụ!`,
        rewardText: `+${reward.toLocaleString()} XU THƯỞNG NÓNG`,
        message: `Kỷ luật và sự kiên trì là chìa khóa mở ra cánh cửa thành công vượt bậc. Bạn là tấm gương sáng tiêu biểu của cộng đồng Creator AvaLive!`
      });
    }
  };

  // Partner Announcements (Public Ticker - Ai đến trước nhận trước)
  const [partnerAnnouncements, setPartnerAnnouncements] = useState<PartnerCampaignAnnouncement[]>(PARTNER_ANNOUNCEMENTS);
  const dismissPartnerAnnouncement = (id: string) => {
    setPartnerAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Platform Boost Revenue & Campaign Priority (100% Real Time)
  const [platformBoostRevenue, setPlatformBoostRevenue] = useState<number>(0);

  // User Completed Actions Map (Chống trùng lặp & bảo vệ ngân sách chủ shop)
  const [userCompletedActions, setUserCompletedActions] = useState<Record<string, UserTaskActionHistory>>(INITIAL_USER_COMPLETED_ACTIONS);

  // In-App Notifications for all accounts
  const [userNotifications, setUserNotifications] = useState<UserNotificationItem[]>(INITIAL_USER_NOTIFICATIONS);
  const unreadNotificationsCount = userNotifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setUserNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setUserNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: Omit<UserNotificationItem, 'id' | 'timestamp' | 'isRead'> & { timestamp?: string }) => {
    const newNotif: UserNotificationItem = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: notif.timestamp || 'Vừa xong',
      isRead: false,
      ...notif
    };
    setUserNotifications(prev => [newNotif, ...prev]);
  };
  
  // KOC applications (100% Real, persisted)
  const [kocApplications, setKocApplications] = useState<KocProfileApplication[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_koc_applications') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_koc_applications', JSON.stringify(kocApplications));
      }
    } catch {}
  }, [kocApplications]);
  const [isKocModalOpen, setIsKocModalOpen] = useState(false);

  // Package order modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<GrowthServiceItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Auth state: check localStorage or default to false to show Landing Page first
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      return (
        localStorage.getItem('tiktok_pro_auth') === 'true' ||
        !!localStorage.getItem('ava_user_email') ||
        !!localStorage.getItem('ava_user_profile')
      );
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modal states
  const [runnerTask, setRunnerTask] = useState<TikTokTaskItem | null>(null);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [isFeedRunnerOpen, setIsFeedRunnerOpen] = useState(false);
  const [feedRunnerFilter, setFeedRunnerFilter] = useState<'all' | 'cross_follow' | 'community' | 'partner' | 'live'>('all');
  const [feedRunnerTargetId, setFeedRunnerTargetId] = useState<string | null>(null);
  const [tasksActiveTab, setTasksActiveTab] = useState<"missions" | "watch_feed" | "livestreams" | "enterprise" | "cross_follow">("missions");
  const [activeLiveTask, setActiveLiveTask] = useState<LivestreamTaskItem | null>(null);
  const [isLiveRunnerOpen, setIsLiveRunnerOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isSepayModalOpen, setIsSepayModalOpen] = useState(false);
  const [sepayCheckoutItem, setSepayCheckoutItem] = useState<SepayCheckoutItem | null>(null);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeEscrowContract, setActiveEscrowContract] = useState<EscrowBookingContract | null>(null);
  const [isSubmitDemoModalOpen, setIsSubmitDemoModalOpen] = useState(false);
  const [isBuyerPortalOpen, setIsBuyerPortalOpen] = useState(false);

  // Modal Pháo Hoa Chúc Mừng Toàn Hệ Thống (Mỗi lần hoàn thành nhiệm vụ, mở rương, tất toán hợp đồng)
  const [fireworksData, setFireworksData] = useState<CongratulationData | null>(null);
  const [isFireworksOpen, setIsFireworksOpen] = useState<boolean>(false);

  const triggerFireworks = (data: CongratulationData) => {
    setFireworksData(data);
    setIsFireworksOpen(true);
  };

  const closeFireworks = () => {
    setIsFireworksOpen(false);
    setFireworksData(null);
  };

  // Share Video Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareVideoData, setShareVideoData] = useState<{ targetUrl: string; title: string; taskId?: string } | null>(null);

  const openShareModal = (data: { targetUrl: string; title: string; taskId?: string }) => {
    setShareVideoData(data);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareVideoData(null);
  };

  const updateConnectedTikTok = (handle: string) => {
    const formatted = handle.startsWith('@') ? handle : `@${handle}`;
    setUser(prev => ({
      ...prev,
      tiktokConnected: formatted,
      handle: formatted
    }));
    showToast(`✓ Đã kết nối 1-chạm tài khoản TikTok ${formatted}!`);
  };

  // PWA Add to Home Screen Modal
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const openPwaModal = () => setIsPwaModalOpen(true);
  const closePwaModal = () => setIsPwaModalOpen(false);

  // KYC Verification state (100% Real, persisted)
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycRequests, setKycRequests] = useState<KycVerificationData[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_kyc_requests') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_kyc_requests', JSON.stringify(kycRequests));
      }
    } catch {}
  }, [kycRequests]);

  // App Marketplace (App Kiếm Tiền) state
  const [softwareApps, setSoftwareApps] = useState<SoftwareAppItem[]>(() => {
    try {
      const saved = localStorage.getItem('tiktok_software_apps_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load apps from localStorage', e);
    }
    return SOFTWARE_APPS_CATALOG;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tiktok_software_apps_catalog', JSON.stringify(softwareApps));
    } catch (e) {
      console.error('Failed to save apps to localStorage', e);
    }
  }, [softwareApps]);

  const [myAppLicenses, setMyAppLicenses] = useState<AppLicensePurchase[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_app_licenses') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_app_licenses', JSON.stringify(myAppLicenses));
      }
    } catch {}
  }, [myAppLicenses]);

  // Token Ledger state (Sàn quản trị minh bạch - 100% Realtime)
  const [tokenLedger, setTokenLedger] = useState<TokenLedgerRecord[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_token_ledger') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_TOKEN_LEDGER;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_token_ledger', JSON.stringify(tokenLedger));
      }
    } catch {}
  }, [tokenLedger]);

  // Cấu hình Tổng Cung & Quỹ Sàn (Token Supply Ledger)
  const [tokenSupplyConfig, setTokenSupplyConfig] = useState<{
    initialSupply: number;
    mintedSupply: number;
    manualBurnedSupply: number;
  }>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ava_token_supply_config') : null;
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      initialSupply: 10000000000, // 10 Tỷ Xu mặc định ban đầu do Admin cấp
      mintedSupply: 0,
      manualBurnedSupply: 0
    };
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_token_supply_config', JSON.stringify(tokenSupplyConfig));
      }
    } catch {}
  }, [tokenSupplyConfig]);

  const openKycModal = () => setIsKycModalOpen(true);
  const closeKycModal = () => setIsKycModalOpen(false);

  // Live Broadcast Notification state (100% Real)
  const [activeBroadcastNotification, setActiveBroadcastNotification] = useState<LiveBroadcastNotification | null>(null);

  const openBuyerPortal = () => setIsBuyerPortalOpen(true);
  const closeBuyerPortal = () => setIsBuyerPortalOpen(false);
  const dismissBroadcastNotification = () => setActiveBroadcastNotification(null);

  // Marquee Ticker states (Bảng điện LED chạy chữ)
  const [marqueeTickerList, setMarqueeTickerList] = useState<MarqueeTickerItem[]>(INITIAL_MARQUEE_ITEMS);
  const [marqueeHistoryList, setMarqueeHistoryList] = useState<MarqueeHistoryRecord[]>(INITIAL_MARQUEE_HISTORY);
  const [isMarqueeBoostModalOpen, setIsMarqueeBoostModalOpen] = useState(false);
  const [selectedMarqueeBoostTarget, setSelectedMarqueeBoostTarget] = useState<any>(null);
  const [isMarqueeHistoryModalOpen, setIsMarqueeHistoryModalOpen] = useState(false);

  const openMarqueeBoostModal = (target?: any) => {
    setSelectedMarqueeBoostTarget(target || null);
    setIsMarqueeBoostModalOpen(true);
  };
  const closeMarqueeBoostModal = () => {
    setIsMarqueeBoostModalOpen(false);
    setSelectedMarqueeBoostTarget(null);
  };

  const openMarqueeHistoryModal = () => setIsMarqueeHistoryModalOpen(true);
  const closeMarqueeHistoryModal = () => setIsMarqueeHistoryModalOpen(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Quản lý Cookie Tiếp thị liên kết (30 Days Cookie Retention Window)
  const REFERRAL_COOKIE_KEY = 'ava_referral_cookie';
  const REFERRAL_COOKIE_DAYS = 30;

  const saveReferralCookie = (refCode: string) => {
    if (typeof window === 'undefined' || !refCode) return;
    try {
      const cleanCode = refCode.trim().toUpperCase();
      const data = {
        code: cleanCode,
        expiresAt: Date.now() + REFERRAL_COOKIE_DAYS * 24 * 60 * 60 * 1000,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(REFERRAL_COOKIE_KEY, JSON.stringify(data));
      document.cookie = `${REFERRAL_COOKIE_KEY}=${cleanCode}; max-age=${REFERRAL_COOKIE_DAYS * 24 * 60 * 60}; path=/`;
    } catch (err) {
      console.warn('Cannot save referral cookie:', err);
    }
  };

  const getReferralCookie = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(REFERRAL_COOKIE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed.code;
        } else {
          localStorage.removeItem(REFERRAL_COOKIE_KEY);
        }
      }
      const match = document.cookie.match(new RegExp('(^| )' + REFERRAL_COOKIE_KEY + '=([^;]+)'));
      if (match && match[2]) return match[2];
    } catch {}
    return null;
  };

  // Supabase Realtime Auth listener: auto-sync session if user logs in via Supabase OAuth redirect
  useEffect(() => {
    // Ghi nhận mã giới thiệu từ URL params (?ref=... hoặc ?refCode=...) & đồng bộ link ref động
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const refQuery = searchParams.get('ref') || searchParams.get('refCode') || searchParams.get('r');
      if (refQuery) {
        saveReferralCookie(refQuery);
        showToast(`🤝 Đã ghi nhận mã bảo trợ "${refQuery.toUpperCase()}" (Lưu trữ cookie 30 ngày)`);
      }

      // Cập nhật refLink động theo đúng origin hiện tại (local hoặc production)
      setAffiliateData(prev => ({
        ...prev,
        refLink: `${window.location.origin}/?ref=${prev.refCode}`
      }));
    }

    // 1. Kiểm tra session hiện tại từ Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || 'user@gmail.com';
        const isAdmin = email === 'quocthiencr90@gmail.com';
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || (isAdmin ? 'Nguyễn Quốc Thiện (Admin)' : 'Người Dùng Google');
        const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || (isAdmin 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

        setUser(prev => ({
          ...prev,
          email,
          name: fullName,
          avatar: avatarUrl,
          isAdmin,
          role: isAdmin ? 'Super Admin • Quản Trị Hệ Thống' : 'Nhà Sáng Tạo AVA FOLLOW'
        }));
        setIsAuthenticated(true);
        try {
          localStorage.setItem('tiktok_pro_auth', 'true');
          localStorage.setItem('ava_user_email', email);
        } catch {}
      }
    });

    // 2. Lắng nghe thay đổi trạng thái Auth từ Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || 'user@gmail.com';
        const isAdmin = email === 'quocthiencr90@gmail.com';
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || (isAdmin ? 'Nguyễn Quốc Thiện (Admin)' : 'Người Dùng Google');
        const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || (isAdmin 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

        setUser(prev => ({
          ...prev,
          email,
          name: fullName,
          avatar: avatarUrl,
          isAdmin,
          role: isAdmin ? 'Super Admin • Quản Trị Hệ Thống' : 'Nhà Sáng Tạo AVA FOLLOW'
        }));
        setIsAuthenticated(true);
        try {
          localStorage.setItem('tiktok_pro_auth', 'true');
          localStorage.setItem('ava_user_email', email);
        } catch {}
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogleOAuth = async () => {
    try {
      showToast('Đang kết nối cổng xác thực Google OAuth qua Supabase...');
      const { data, error } = await signInWithGoogleOAuth();
      if (error) {
        console.warn('Google OAuth error:', error);
        showToast(`Lỗi kết nối Google: ${error.message}. Chuyển sang chế độ kết nối nội bộ.`);
        loginWithGoogle();
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.warn('OAuth redirect exception:', err);
      loginWithGoogle();
    }
  };

  const loginWithGoogle = (customEmail?: string) => {
    const targetEmail = customEmail || 'quocthiencr90@gmail.com';
    const isAdmin = targetEmail === 'quocthiencr90@gmail.com';

    setUser(prev => ({
      ...prev,
      email: targetEmail,
      name: isAdmin ? 'Nguyễn Quốc Thiện (Admin)' : (prev.name || 'Người Dùng Google'),
      role: isAdmin ? 'Super Admin • Quản Trị Hệ Thống' : 'Nhà Sáng Tạo AVA FOLLOW',
      isAdmin: isAdmin,
      avatar: isAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    }));

    setIsAuthenticated(true);
    try {
      localStorage.setItem('tiktok_pro_auth', 'true');
      localStorage.setItem('ava_user_email', targetEmail);
    } catch {}

    // Đồng bộ user lên Supabase Cloud
    const activeRefSponsor = getReferralCookie() || 'THIENVUAAPP88';
    registerUserToSupabase({
      email: targetEmail,
      name: isAdmin ? 'Nguyễn Quốc Thiện (Admin)' : 'Người Dùng Google',
      tiktokHandle: user.tiktokConnected,
      referredBy: activeRefSponsor
    });

    if (isAdmin) {
      showToast('👑 Chào mừng Admin Nguyễn Quốc Thiện! Toàn quyền quản trị hệ thống đã kích hoạt.');
    } else {
      showToast('🚀 Đăng nhập Google 1 chạm thành công! Chào mừng bạn đến với AVA FOLLOW.');
    }
  };

  const loginWithEmail = (email: string, name: string, handle?: string) => {
    const formattedHandle = handle ? (handle.startsWith('@') ? handle : `@${handle}`) : user.tiktokConnected;
    const isAdmin = email === 'quocthiencr90@gmail.com';
    const activeRefSponsor = getReferralCookie() || 'THIENVUAAPP88';
    setUser(prev => {
      const bonusWelcome = 5000;
      const nextCoins = prev.avaliveCoins + bonusWelcome;
      return {
        ...prev,
        email: email,
        name: name || prev.name,
        role: isAdmin ? 'Super Admin • Quản Trị Hệ Thống' : prev.role,
        isAdmin: isAdmin,
        tiktokConnected: formattedHandle,
        avaliveCoins: nextCoins,
        coinsValueVND: `${nextCoins.toLocaleString()}đ`
      };
    });
    setIsAuthenticated(true);
    try {
      localStorage.setItem('tiktok_pro_auth', 'true');
      localStorage.setItem('ava_user_email', email);
    } catch {}

    // Đồng bộ tài khoản và quà chào mừng 5.000 Xu lên Supabase
    registerUserToSupabase({
      email,
      name,
      tiktokHandle: formattedHandle,
      referredBy: activeRefSponsor
    });

    syncTokenLedgerToSupabase({
      userId: email,
      txType: 'signup_bonus',
      tokenAmount: 0,
      tokenBalanceAfter: user.avaliveCoins + 5000,
      vndEquivalent: 5000,
      note: 'Thưởng chào mừng thành viên mới gia nhập AVA FOLLOW (+5.000 Xu)'
    });

    showToast(`🎉 Xin chào ${name}! Đăng ký thành công, nhận ngay +5.000 Xu chào mừng và đồng bộ Supabase Cloud.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('tiktok_pro_auth');
      localStorage.removeItem('ava_user_email');
    } catch {}
    showToast('Đã đăng xuất an toàn khỏi hệ thống.');
  };

  const updateCommissionSettings = (newSettings: Partial<PlatformCommissionSettings>) => {
    setCommissionSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Đã cập nhật cấu hình hoa hồng & tỷ lệ ăn chia toàn sàn!');
  };

  const openKocModal = () => setIsKocModalOpen(true);
  const closeKocModal = () => setIsKocModalOpen(false);

  const registerKocProfile = (data: Omit<KocProfileApplication, 'id' | 'status' | 'createdAt'>) => {
    const newApp: KocProfileApplication = {
      id: `koc_app_${Date.now()}`,
      ...data,
      status: 'approved',
      createdAt: 'Vừa xong'
    };
    setKocApplications(prev => [newApp, ...prev]);
    showToast('🎉 Đăng ký KOC thành công! Kênh của bạn đã sẵn sàng nhận hợp đồng booking.');
  };

  const openOrderModal = (pkg: GrowthServiceItem) => {
    setSelectedPackageForOrder(pkg);
    setIsOrderModalOpen(true);
  };
  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedPackageForOrder(null);
  };

  // Mua gói dịch vụ & Trả gói tự động sang hàng đợi nhiệm vụ
  const purchaseServicePackage = (pkg: GrowthServiceItem, targetUrl: string, instructions?: string, paymentMethod: 'coins' | 'sepay' = 'coins'): boolean => {
    if (paymentMethod === 'coins' && user.avaliveCoins < pkg.priceNum) {
      showToast('❌ Số dư Xu không đủ để kích hoạt gói này!');
      return false;
    }

    const newCoins = paymentMethod === 'coins' ? user.avaliveCoins - pkg.priceNum : user.avaliveCoins + pkg.priceNum;
    const isLive = pkg.category === 'livestream';
    const newOrder: ServiceOrder = {
      id: `ord_${Date.now()}`,
      packageId: pkg.id,
      packageTitle: pkg.title,
      category: pkg.category,
      price: pkg.price,
      targetUrl,
      targetQuantity: pkg.targetQuantity,
      completedQuantity: 0,
      status: 'running',
      createdAt: 'Vừa xong',
      isLivePackage: isLive,
      targetEyes: isLive ? pkg.targetQuantity : undefined,
      deliveredEyes: isLive ? 0 : undefined
    };

    if (isLive) {
      let targetMins = 3;
      if (pkg.title.includes('1 Phút') || pkg.unit.includes('1 phút')) targetMins = 1;
      else if (pkg.title.includes('3 Phút') || pkg.unit.includes('3 phút')) targetMins = 3;
      else if (pkg.title.includes('10 Phút') || pkg.unit.includes('10 phút')) targetMins = 10;
      else if (pkg.title.includes('30 Phút') || pkg.unit.includes('30 phút')) targetMins = 30;

      const workerPerViewer = Math.max(400, Math.round((pkg.priceNum * 0.4) / Math.max(1, pkg.targetQuantity)));

      const newLiveTask: LivestreamTaskItem = {
        id: `live_pkg_${Date.now()}`,
        channelName: user.name,
        channelHandle: targetUrl.includes('@') ? '@' + targetUrl.split('@')[1].split('/')[0].split('?')[0] : (user.tiktokConnected || user.handle),
        channelAvatar: user.avatar,
        roomTitle: instructions || `🔥 PHÒNG LIVE TIKTOK SHOP: ${pkg.title}`,
        currentViewers: Math.round(pkg.targetQuantity * 0.5),
        targetMinutes: targetMins,
        rewardPerMinute: Math.max(100, Math.round(workerPerViewer / targetMins)),
        milestoneBonusCoins: Math.round(workerPerViewer * 0.3),
        totalRewardCoins: workerPerViewer,
        targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://tiktok.com/${targetUrl}/live`,
        status: 'live',
        category: `Nhiệm Vụ ${targetMins} Phút`,
        hostFollowers: 'TikTok Shop Live',
        requiredRank: 'Đồng',
        isLocked: false,
        dailyTierLevel: 1,
        tags: [`Xem ${targetMins} Phút`, 'Gói Mới Mua', 'TikTok Shop']
      };

      setLivestreamTasks(prev => [newLiveTask, ...prev]);

      setActiveBroadcastNotification({
        id: `bcast_${Date.now()}`,
        orderId: newOrder.id,
        buyerName: user.name,
        buyerHandle: user.tiktokConnected || user.handle,
        buyerAvatar: user.avatar,
        roomTitle: instructions || `🔥 PHÒNG LIVE TIKTOK SHOP: ${pkg.title}`,
        targetLiveUrl: targetUrl.startsWith('http') ? targetUrl : `https://tiktok.com/${targetUrl}/live`,
        packageTitle: pkg.title,
        targetEyes: pkg.targetQuantity,
        deliveredEyes: 0,
        targetHearts: pkg.targetQuantity * 10,
        deliveredHearts: 0,
        targetComments: Math.round(pkg.targetQuantity * 0.1),
        deliveredComments: 0,
        rewardPerWatcherCoins: workerPerViewer,
        requiredMinutes: targetMins,
        startTime: 'Vừa kích hoạt',
        isActive: true
      });
      // Tạo nhiệm vụ chính (Follow / Like / Comment / Share / Combo)
      let taskActionType: TikTokTaskItem['type'] = 'follow';
      let rewardPerTask = 200;
      if (pkg.category === 'engagement') { taskActionType = 'like'; rewardPerTask = 100; }
      else if (pkg.category === 'comment') { taskActionType = 'comment'; rewardPerTask = 200; }
      else if (pkg.category === 'share') { taskActionType = 'share'; rewardPerTask = 240; }
      else if (pkg.category === 'watch') { taskActionType = 'watch'; rewardPerTask = 200; }
      else if (pkg.category === 'combo') { taskActionType = 'follow'; rewardPerTask = 600; }

      const cleanChan = targetUrl.startsWith('@') ? targetUrl : (user.tiktokConnected || '@tiktok_channel');

      const newTask: TikTokTaskItem = {
        id: `task_pkg_${Date.now()}`,
        title: `${pkg.title} (${targetUrl})`,
        type: taskActionType,
        rewardCoins: rewardPerTask,
        rewardVND: `${rewardPerTask}đ`,
        channelName: cleanChan,
        channelHandle: cleanChan,
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        targetUrl,
        totalSlots: pkg.targetQuantity,
        completedSlots: 0,
        remainingSlots: pkg.targetQuantity,
        requiresWatch: true, // Bắt buộc ở lại xem video 40s
        guide: instructions || `Vào kênh thực hiện ${pkg.unit} và ở lại xem video tối thiểu 40s để nhận Xu thưởng.`,
        requirements: ['Tài khoản TikTok thật', 'Ở lại xem video tối thiểu 40s', 'Giữ tương tác tối thiểu 30 ngày'],
        status: 'open',
        createdAt: 'Vừa xong'
      };

      // 🎁 CHÍNH SÁCH MUA 1 TẶNG 1: Tặng thêm 100% lượt LƯỢT XEM VIDEO (VIEW 40S) cho 100 người mua đầu tiên!
      const bonusViewTask: TikTokTaskItem = {
        id: `task_bonus_view_${Date.now()}`,
        title: `🎁 [MUA 1 TẶNG 1] Tặng ${pkg.targetQuantity.toLocaleString()} Lượt Xem 40s cho ${cleanChan}`,
        type: 'watch',
        rewardCoins: 200,
        rewardVND: `200đ`,
        channelName: cleanChan,
        channelHandle: cleanChan,
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        targetUrl,
        totalSlots: pkg.targetQuantity,
        completedSlots: 0,
        remainingSlots: pkg.targetQuantity,
        requiresWatch: true,
        guide: `Xem trọn vẹn video tối thiểu 40 giây trên FYP. Thưởng +200 Xu vào ví tài khoản của bạn.`,
        requirements: ['Xem đủ 40 giây', 'Không tắt màn hình'],
        status: 'open',
        createdAt: 'Vừa xong',
        isBoosted: true
      };

      setTasks(prev => [bonusViewTask, newTask, ...prev]);
    }

    const newTx: TransactionRecord = {
      id: `tx_pkg_${Date.now()}`,
      type: paymentMethod === 'sepay' ? 'deposit' : 'spend',
      title: paymentMethod === 'sepay'
        ? `Nạp Xu SePay VietQR gói "${pkg.title}"`
        : `Kích hoạt gói "${pkg.title}" cho ${targetUrl}`,
      amount: paymentMethod === 'sepay' ? `+${pkg.priceNum.toLocaleString()} Xu` : `-${pkg.priceNum.toLocaleString()} Xu`,
      isPositive: paymentMethod === 'sepay',
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      fiatVND: paymentMethod === 'sepay'
        ? `${(parseInt(prev.fiatVND.replace(/\D/g, '') || '0') + pkg.priceNum).toLocaleString()}đ`
        : prev.fiatVND,
      transactions: [newTx, ...prev.transactions],
      myOrders: [newOrder, ...(prev.myOrders || [])]
    }));

    // Hoa hồng Tiếp thị liên kết (Affiliate Commission): Trích 20% - 35% cho đơn mua ĐẦU TIÊN của người được giới thiệu
    const firstPurchaseKey = `ava_affiliate_awarded_${user.email || 'guest'}`;
    const isFirstPurchase = !localStorage.getItem(firstPurchaseKey);

    if (isFirstPurchase) {
      try {
        localStorage.setItem(firstPurchaseKey, 'true');
        const activeRefCode = getReferralCookie() || affiliateData.refCode || 'THIENVUAAPP88';

        // Tỷ lệ hoa hồng: Kim Cương: 35%, Vàng: 25%, Bạc: 20%, Đồng: 20%
        let ratePercent = 35;
        if (affiliateData.tier === 'Bạc') ratePercent = 20;
        else if (affiliateData.tier === 'Vàng') ratePercent = 25;
        else if (affiliateData.tier === 'Kim Cương') ratePercent = 35;

        const commissionVND = Math.round((pkg.priceNum * ratePercent) / 100);

        setAffiliateData(prev => {
          const currentTotal = parseInt(prev.totalCommissionVND.replace(/\D/g, '') || '0', 10);
          const currentMonth = parseInt(prev.monthlyCommission.replace(/\D/g, '') || '0', 10);
          return {
            ...prev,
            totalCommissionVND: `${(currentTotal + commissionVND).toLocaleString()}đ`,
            monthlyCommission: `${(currentMonth + commissionVND).toLocaleString()}đ`,
            referralsList: [
              {
                id: `ref_order_${Date.now()}`,
                username: user.name || 'Thành viên F1',
                avatar: user.avatar,
                tiktokHandle: user.tiktokConnected || '@f1_user',
                joinedDate: 'Hôm nay',
                hasCompletedTask: true,
                taskCompletedType: `Đơn mua đầu tiên: ${pkg.title}`,
                status: `Đã trả hoa hồng ${ratePercent}% (${commissionVND.toLocaleString()}đ)`,
                bonusCoins: 5000,
                isClaimed: true,
                packageSpentVND: `${pkg.priceNum.toLocaleString()}đ`,
                earnedVND: `+${commissionVND.toLocaleString()}đ`
              },
              ...prev.referralsList
            ]
          };
        });

        // Đồng bộ lên Supabase token_ledger
        syncTokenLedgerToSupabase({
          userId: activeRefCode,
          txType: 'affiliate_commission',
          tokenAmount: 0,
          tokenBalanceAfter: 0,
          vndEquivalent: commissionVND,
          note: `Hoa hồng tiếp thị liên kết ${ratePercent}% (đơn đầu) từ người dùng F1 mua gói ${pkg.title} (+${commissionVND.toLocaleString()}đ)`
        });

        setTimeout(() => {
          showToast(`💎 [HOA HỒNG BẢO TRỢ]: Đã tự động cộng ${ratePercent}% hoa hồng (+${commissionVND.toLocaleString()}đ) cho người giới thiệu (${activeRefCode})!`);
        }, 1200);
      } catch (err) {
        console.warn('Affiliate commission calculation error:', err);
      }
    }

    showToast(`🎉 Kích hoạt thành công gói "${pkg.title}"! Đã đẩy ${pkg.targetQuantity.toLocaleString()} ${pkg.unit} lên hàng đợi cộng đồng trả gói.`);
    return true;
  };

  const openRunner = (task: TikTokTaskItem) => {
    setRunnerTask(task);
    setIsRunnerOpen(true);
  };
  const closeRunner = () => {
    setIsRunnerOpen(false);
    setRunnerTask(null);
  };

  const openFeedRunner = (filterOrId?: 'all' | 'cross_follow' | 'community' | 'partner' | 'live' | string | any) => {
    setTasksActiveTab('watch_feed');
    if (typeof filterOrId === 'string') {
      if (['all', 'cross_follow', 'community', 'partner', 'live'].includes(filterOrId)) {
        setFeedRunnerFilter(filterOrId as any);
        setFeedRunnerTargetId(null);
      } else {
        setFeedRunnerTargetId(filterOrId);
      }
    } else {
      setFeedRunnerFilter('all');
      setFeedRunnerTargetId(null);
    }
    setIsFeedRunnerOpen(true);
  };
  const closeFeedRunner = () => setIsFeedRunnerOpen(false);

  const openLiveRunner = (task?: LivestreamTaskItem) => {
    setActiveLiveTask(task || livestreamTasks[0] || null);
    setIsLiveRunnerOpen(true);
  };
  const closeLiveRunner = () => {
    setIsLiveRunnerOpen(false);
    setActiveLiveTask(null);
  };

  const openLuckyWheel = () => setIsLuckyWheelOpen(true);
  const closeLuckyWheel = () => setIsLuckyWheelOpen(false);

  const openConnect = () => setIsConnectOpen(true);
  const closeConnect = () => setIsConnectOpen(false);

  const openWithdraw = () => setIsWithdrawOpen(true);
  const closeWithdraw = () => setIsWithdrawOpen(false);

  const openDeposit = () => setIsDepositOpen(true);
  const closeDeposit = () => setIsDepositOpen(false);

  const openSepayModal = (item: SepayCheckoutItem) => {
    setSepayCheckoutItem(item);
    setIsSepayModalOpen(true);
  };
  const closeSepayModal = () => {
    setIsSepayModalOpen(false);
    setSepayCheckoutItem(null);
  };

  const openPolicy = () => setIsPolicyOpen(true);
  const closePolicy = () => setIsPolicyOpen(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  const openSubmitDemoModal = (contract: EscrowBookingContract) => {
    setActiveEscrowContract(contract);
    setIsSubmitDemoModalOpen(true);
  };
  const closeSubmitDemoModal = () => {
    setIsSubmitDemoModalOpen(false);
    setActiveEscrowContract(null);
  };

  // Complete task
  const completeTask = (taskId: string, actions: TaskActionDetails) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { coinsEarned: 0, vndEarned: 0 };

    let baseCoins = task.rewardCoins;
    if (actions.liked) baseCoins += 100;
    // Bỏ hệ số nhân để chống lạm phát (Chuẩn minh bạch 1:1)
    const totalCoins = baseCoins;
    const totalVND = totalCoins;

    let newRank = user.rankLevel;
    let rankUpBonusCoins = 0;
    let rankUpBonusFollowers = 0;

    const newCompletedCount = user.completedTasksCount + 1;
    const newDailyCompleted = user.dailyTasksCompleted + 1;

    if (newCompletedCount >= 2000 && user.rankLevel !== 'Kim Cương') {
      newRank = 'Kim Cương';
      rankUpBonusCoins = 300000;
      rankUpBonusFollowers = 3000;
      triggerFireworks({
        type: 'rank_up',
        badge: '👑 ĐỈNH CAO DANH VỌNG',
        title: 'CHÚC MỪNG BẠN ĐÃ THĂNG HẠNG KIM CƯƠNG!',
        subtitle: 'Vị thế tối cao trên toàn nền tảng AvaLive Creator!',
        rewardText: '+300.000 XU & +3.000 FOLLOWER',
        message: 'Bạn đã xuất sắc vượt qua mốc 2.000 nhiệm vụ để bước chân vào hàng ngũ Tinh Hoa Kim Cương. Mọi đặc quyền cao nhất và hệ số nhân thù lao tối đa giờ đã thuộc về bạn!'
      });
    } else if (newCompletedCount >= 500 && (user.rankLevel === 'Đồng' || user.rankLevel === 'Bạc')) {
      newRank = 'Vàng';
      rankUpBonusCoins = 80000;
      rankUpBonusFollowers = 1000;
      triggerFireworks({
        type: 'rank_up',
        badge: '🥇 THĂNG CẤP VƯỢT BẬC',
        title: 'CHÚC MỪNG BẠN ĐÃ THĂNG HẠNG VÀNG!',
        subtitle: 'Creator Uy Tín Chuyên Nghiệp của Hệ Thống!',
        rewardText: '+80.000 XU & +1.000 FOLLOWER',
        message: 'Sự kiên trì không ngừng nghỉ của bạn đã đơm hoa kết trái. Chúc bạn tiếp tục giữ vững phong độ đỉnh cao trên con đường sáng tạo nội dung!'
      });
    } else if (newCompletedCount >= 100 && user.rankLevel === 'Đồng') {
      newRank = 'Bạc';
      rankUpBonusCoins = 20000;
      rankUpBonusFollowers = 200;
      triggerFireworks({
        type: 'rank_up',
        badge: '🥈 BƯỚC NGOẶT ĐẦU TIÊN',
        title: 'CHÚC MỪNG BẠN ĐÃ THĂNG HẠNG BẠC!',
        subtitle: 'Vượt qua mốc 100 nhiệm vụ đầu tiên!',
        rewardText: '+20.000 XU & +200 FOLLOWER',
        message: 'Bước khởi đầu vững chắc cho hành trình chinh phục thu nhập và khẳng định giá trị bản thân. Chặng đường kế tiếp đang chờ đón bạn tỏa sáng!'
      });
    }

    const newCoins = user.avaliveCoins + totalCoins + rankUpBonusCoins;
    const newFollowers = (user.tiktokFollowers || 248500) + rankUpBonusFollowers;

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'earn',
      title: `Thưởng hoàn thành nhiệm vụ ${task.channelHandle}`,
      amount: `+${totalCoins.toLocaleString()} Xu (+${totalVND.toLocaleString()}đ)`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    // Thưởng làm đủ 100% nhiệm vụ ngày
    let dailyFullBonusCoins = 0;
    if (newDailyCompleted === user.dailyTasksLimit) {
      if (newRank === 'Kim Cương') dailyFullBonusCoins = 25000;
      else if (newRank === 'Vàng') dailyFullBonusCoins = 8000;
      else if (newRank === 'Bạc') dailyFullBonusCoins = 2000;
      else dailyFullBonusCoins = 1000;
      triggerFireworks({
        type: 'all_clear',
        badge: '⚡ ALL-CLEAR HOÀN HẢO',
        title: 'HOÀN THÀNH 100% NHIỆM VỤ NGÀY!',
        subtitle: `Hoàn tất trọn vẹn ${user.dailyTasksLimit}/${user.dailyTasksLimit} nhiệm vụ hôm nay!`,
        rewardText: `+${dailyFullBonusCoins.toLocaleString()} XU THƯỞNG NÓNG`,
        message: 'Tuyệt vời! Bạn đã hoàn thành toàn bộ chỉ tiêu công việc trong ngày hôm nay. Hãy duy trì chuỗi thành tích này để mở tiếp các rương quà tặng chuỗi tuần và tháng!'
      });
    }

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins + dailyFullBonusCoins,
      coinsValueVND: `${(newCoins + dailyFullBonusCoins).toLocaleString()}đ`,
      completedTasksCount: newCompletedCount,
      dailyTasksCompleted: newDailyCompleted,
      tiktokFollowers: newFollowers,
      rankLevel: newRank,
      transactions: [newTx, ...prev.transactions]
    }));

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = t.completedSlots + 1;
        return {
          ...t,
          completedSlots: nextCompleted,
          remainingSlots: Math.max(0, t.totalSlots - nextCompleted),
          status: nextCompleted >= t.totalSlots ? 'completed' : t.status
        };
      }
      return t;
    }));

    setAnalytics(prev => ({
      ...prev,
      completedToday: prev.completedToday + 1,
      todayVideosWatched: prev.todayVideosWatched + 1,
      todayEarningsCoins: prev.todayEarningsCoins + totalCoins,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + totalCoins,
      monthlyEarningsCoins: prev.monthlyEarningsCoins + totalCoins
    }));

    // Ghi nhận nhiệm vụ đã hoàn thành vào lịch sử người dùng (Chống trùng lặp & bảo vệ ngân sách chủ shop)
    setUserCompletedActions(prev => {
      const current = prev[taskId] || {
        taskId,
        taskTitle: task.title,
        channelName: task.channelName,
        channelHandle: task.channelHandle,
        channelAvatar: task.channelAvatar,
        viewed: true,
        followed: actions.followed || false,
        liked: actions.liked || false,
        commented: actions.commented || false,
        shared: actions.shared || false,
        totalCoinsEarned: 0,
        completedAt: 'Vừa xong'
      };
      return {
        ...prev,
        [taskId]: {
          ...current,
          viewed: true,
          followed: actions.followed ? true : current.followed,
          liked: actions.liked ? true : current.liked,
          commented: actions.commented ? true : current.commented,
          shared: actions.shared ? true : current.shared,
          totalCoinsEarned: current.totalCoinsEarned + totalCoins,
          completedAt: 'Vừa xong'
        }
      };
    });

    showToast(`+${totalCoins.toLocaleString()} Xu! Đã cộng vào ví.`);
    return { coinsEarned: totalCoins, vndEarned: totalVND };
  };

  // Hạn mức và tỷ lệ thưởng theo cấp bậc người dùng (Đồng -> Bạc -> Vàng -> Kim Cương)
  const getUserLiveQuota = () => {
    const rank = user.rankLevel;
    let maxLivePerDay = 5;
    const multiplier = 1.0; // Chuẩn cố định 1.0, không dùng hệ số nhân
    if (rank === 'Bạc') {
      maxLivePerDay = 12;
    } else if (rank === 'Vàng') {
      maxLivePerDay = 25;
    } else if (rank === 'Kim Cương') {
      maxLivePerDay = 999;
    }
    const completedToday = analytics.todayLiveSessionsCompleted || 0;
    const remainingToday = Math.max(0, maxLivePerDay - completedToday);
    return {
      rank,
      maxLivePerDay,
      completedToday,
      remainingToday,
      multiplier
    };
  };

  // Watch livestream per minute (Tính theo hệ số cấp bậc)
  const watchLivestreamMinute = (taskId: string) => {
    const live = livestreamTasks.find(l => l.id === taskId);
    if (!live) return;

    const quota = getUserLiveQuota();
    const baseReward = live.rewardPerMinute || 300;
    const reward = Math.round(baseReward * quota.multiplier);
    const newCoins = user.avaliveCoins + reward;

    const newTx: TransactionRecord = {
      id: `tx_live_${Date.now()}`,
      type: 'earn',
      title: `Thưởng xem Livestream ${live.channelHandle} (1 phút • x${quota.multiplier})`,
      amount: `+${reward.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      todayWatchMinutes: prev.todayWatchMinutes + 1,
      todayLiveMinutes: (prev.todayLiveMinutes || 0) + 1,
      todayLiveCoinsEarned: (prev.todayLiveCoinsEarned || 0) + reward,
      todayEarningsCoins: prev.todayEarningsCoins + reward,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + reward
    }));

    recordMissionProgress('live', 1);

    showToast(`+${reward} Xu (1 phút xem Live - Rank ${quota.rank})!`);
  };

  // Hoàn thành phiên xem Live & Mở khóa nhiệm vụ tiếp theo (Progressive Task Unlock)
  const completeLivestreamSession = (
    taskId: string,
    minutesWatched: number,
    tapsCount: number,
    passedCaptcha: boolean
  ) => {
    const live = livestreamTasks.find(l => l.id === taskId);
    if (!live) return { coinsEarned: 0, milestoneBonus: 0 };

    const quota = getUserLiveQuota();
    const baseMilestone = live.milestoneBonusCoins || 500;
    const milestoneBonus = Math.round(baseMilestone * quota.multiplier);
    const captchaBonus = passedCaptcha ? 200 : 0;
    const totalBonus = milestoneBonus + captchaBonus;

    const newCoins = user.avaliveCoins + totalBonus;

    const newTx: TransactionRecord = {
      id: `tx_live_comp_${Date.now()}`,
      type: 'earn',
      title: `Thưởng Mốc xem phòng Live ${live.channelHandle} (${minutesWatched}p • Thưởng Mốc + Anti-bot)`,
      amount: `+${totalBonus.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    const newHistoryItem: LiveWatchHistoryItem = {
      id: `lwh_${Date.now()}`,
      roomTitle: live.roomTitle,
      channelName: live.channelName,
      channelHandle: live.channelHandle,
      channelAvatar: live.channelAvatar,
      minutesWatched,
      coinsEarned: totalBonus + Math.round((live.rewardPerMinute || 300) * minutesWatched * quota.multiplier),
      timestamp: 'Vừa xong',
      verifiedHuman: passedCaptcha && tapsCount >= 20,
      tapsCount
    };

    // Mở khóa nhiệm vụ tiến trình tiếp theo trong danh sách nếu có
    let nextUnlockedTitle: string | undefined;
    setLivestreamTasks(prev => {
      return prev.map(item => {
        if (item.unlockedAfterTaskId === taskId && item.isLocked) {
          nextUnlockedTitle = item.channelName;
          return { ...item, isLocked: false };
        }
        return item;
      });
    });

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      completedTasksCount: prev.completedTasksCount + 1,
      dailyTasksCompleted: prev.dailyTasksCompleted + 1,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      todayLiveSessionsCompleted: (prev.todayLiveSessionsCompleted || 0) + 1,
      todayLiveCoinsEarned: (prev.todayLiveCoinsEarned || 0) + totalBonus,
      completedToday: prev.completedToday + 1,
      todayEarningsCoins: prev.todayEarningsCoins + totalBonus,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + totalBonus,
      liveWatchHistory: [newHistoryItem, ...(prev.liveWatchHistory || [])]
    }));

    showToast(`🎉 Thưởng Mốc +${totalBonus.toLocaleString()} Xu! Xác thực người thật thành công.`);
    if (nextUnlockedTitle) {
      setTimeout(() => {
        showToast(`🔓 Đã mở khóa phòng Live mới: ${nextUnlockedTitle}!`);
      }, 1600);
    }

    return { 
      coinsEarned: totalBonus, 
      milestoneBonus, 
      nextUnlockedTaskTitle: nextUnlockedTitle 
    };
  };

  // 1. Tính điểm từng hành động đơn lẻ (Chính sách chuẩn xác 100% - Mỗi hành động tính 1 lượt duy nhất chống trùng lặp)
  const claimTaskAction = (taskId: string, actionType: 'follow' | 'like' | 'comment' | 'share' | 'bookmark' | 'watch') => {
    // Kiểm tra lịch sử người dùng đã làm hành động này trên kênh chưa (Chống trùng lặp & bảo vệ ngân sách chủ shop)
    const existingHistory = userCompletedActions[taskId];
    if (existingHistory) {
      if (actionType === 'watch' && existingHistory.viewed) {
        showToast(`⚠️ Bạn đã nhận Xu xem video 15s kênh ${existingHistory.channelHandle} rồi! Không tính trùng lặp để bảo vệ ngân sách khách hàng.`);
        return 0;
      }
      if (actionType === 'follow' && existingHistory.followed) {
        showToast(`⚠️ Bạn đã Follow và nhận Xu kênh ${existingHistory.channelHandle} rồi!`);
        return 0;
      }
      if (actionType === 'like' && existingHistory.liked) {
        showToast(`⚠️ Bạn đã thả tim video này rồi! Không tính trùng lặp.`);
        return 0;
      }
      if (actionType === 'comment' && existingHistory.commented) {
        showToast(`⚠️ Bạn đã bình luận video này rồi! Không tính trùng lặp.`);
        return 0;
      }
      if (actionType === 'share' && existingHistory.shared) {
        showToast(`⚠️ Bạn đã chia sẻ video này rồi! Không tính trùng lặp.`);
        return 0;
      }
    }

    let baseReward = 100;
    let label = 'Tương tác video';
    if (actionType === 'follow') {
      baseReward = TASK_ACTION_REWARDS.FOLLOW; // 200
      label = 'Follow kênh TikTok';
    } else if (actionType === 'like') {
      baseReward = TASK_ACTION_REWARDS.LIKE; // 100
      label = 'Thả tim video';
    } else if (actionType === 'comment') {
      baseReward = TASK_ACTION_REWARDS.COMMENT; // 200
      label = 'Bình luận seeding';
    } else if (actionType === 'share') {
      baseReward = TASK_ACTION_REWARDS.SHARE; // 240
      label = 'Chia sẻ video';
    } else if (actionType === 'bookmark') {
      baseReward = TASK_ACTION_REWARDS.BOOKMARK; // 0 Xu (Không tính điểm)
      label = 'Lưu vào yêu thích';
    } else if (actionType === 'watch') {
      baseReward = TASK_ACTION_REWARDS.WATCH_15S; // 200 Xu
      label = 'Xem đủ 15s FYP';
    }

    if (actionType === 'bookmark' || baseReward === 0) {
      showToast(`✓ Đã lưu video vào danh sách yêu thích! (Lưu ý: Hành động lưu yêu thích không tính thưởng xu).`);
      return 0;
    }

    const quota = getUserLiveQuota();
    const finalReward = Math.round(baseReward * quota.multiplier);
    const newCoins = user.avaliveCoins + finalReward;

    const newTx: TransactionRecord = {
      id: `tx_act_${Date.now()}`,
      type: 'earn',
      title: `${label} (Tính 1 lượt • x${quota.multiplier})`,
      amount: `+${finalReward.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      todayVideosWatched: (actionType === 'watch' || actionType === 'like' || actionType === 'comment' || actionType === 'share') 
        ? prev.todayVideosWatched + 1 
        : prev.todayVideosWatched,
      todayEarningsCoins: prev.todayEarningsCoins + finalReward,
      weeklyEarningsCoins: prev.weeklyEarningsCoins + finalReward,
      monthlyEarningsCoins: (prev.monthlyEarningsCoins || 25000) + finalReward,
      completedToday: prev.completedToday + 1
    }));

    // Tự động nhận diện hành động & cập nhật tiến độ vào Nhiệm Vụ Sàn (xem video, tim, follow, comment, share)
    recordMissionProgress(actionType, 1);
    if (actionType === 'like' || actionType === 'comment' || actionType === 'share') {
      recordMissionProgress('watch', 1); // Thả tim, comment, share cũng tính là 1 lượt xem video
    }

    // Cập nhật lịch sử hành động người dùng (Anti-Fraud & Báo cáo)
    const task = tasks.find(t => t.id === taskId);
    setUserCompletedActions(prev => {
      const current = prev[taskId] || {
        taskId,
        taskTitle: task?.title || 'Nhiệm vụ TikTok',
        channelName: task?.channelName || '',
        channelHandle: task?.channelHandle || '',
        channelAvatar: task?.channelAvatar || '',
        viewed: false,
        followed: false,
        liked: false,
        commented: false,
        shared: false,
        totalCoinsEarned: 0,
        completedAt: 'Vừa xong'
      };
      return {
        ...prev,
        [taskId]: {
          ...current,
          viewed: (actionType === 'watch' || actionType === 'like' || actionType === 'comment' || actionType === 'share') ? true : current.viewed,
          followed: actionType === 'follow' ? true : current.followed,
          liked: actionType === 'like' ? true : current.liked,
          commented: actionType === 'comment' ? true : current.commented,
          shared: actionType === 'share' ? true : current.shared,
          totalCoinsEarned: current.totalCoinsEarned + finalReward,
          completedAt: 'Vừa xong'
        }
      };
    });

    // Cập nhật tiến độ hoàn thành nhiệm vụ & trừ slot của người tạo chiến dịch
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = t.completedSlots + 1;
        return {
          ...t,
          completedSlots: nextCompleted,
          remainingSlots: Math.max(0, t.totalSlots - nextCompleted),
          status: nextCompleted >= t.totalSlots ? 'completed' : t.status
        };
      }
      return t;
    }));

    // Cập nhật tiến độ và tự động ẩn chiến dịch khi hoàn thành đủ số lượng đã mua
    setCampaigns(prev => prev.map(c => {
      if (c.id === taskId || taskId.includes(c.id)) {
        const nextDone = (c.completedQuantity || 0) + 1;
        const isDone = nextDone >= (c.targetQuantity || 1);
        return {
          ...c,
          completedQuantity: nextDone,
          status: isDone ? 'completed' : c.status
        };
      }
      return c;
    }));

    showToast(`✓ +${finalReward.toLocaleString()} Xu! Đã ghi nhận 1 lượt ${label}.`);
    return finalReward;
  };

  // 2. Ưu tiên Đẩy Top Chiến Dịch (-50.000 Xu phí về Sàn & Ghim lên TOP 1)
  const boostCampaign = (taskId: string): boolean => {
    const BOOST_FEE = 50000;
    if (user.avaliveCoins < BOOST_FEE) {
      showToast(`❌ Số dư không đủ 50.000 Xu để Đẩy Top Chiến Dịch! Vui lòng nạp thêm Xu hoặc làm nhiệm vụ.`);
      return false;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    // 1. Trừ 50.000 Xu từ ví người dùng
    const newCoins = user.avaliveCoins - BOOST_FEE;
    const boostTx: TransactionRecord = {
      id: `tx_boost_${Date.now()}`,
      type: 'spend',
      title: `Phí Đẩy Top Ưu Tiên Chiến Dịch "${task.channelHandle}" (Phí về Sàn)`,
      amount: `-50,000 Xu (-50,000đ)`,
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [boostTx, ...prev.transactions]
    }));

    // 2. Cộng vào doanh thu phí sàn của Admin
    setPlatformBoostRevenue(prev => prev + BOOST_FEE);

    // 3. Ghim chiến dịch lên vị trí đầu tiên của mảng tasks
    setTasks(prev => {
      const target = prev.find(t => t.id === taskId);
      if (!target) return prev;
      const updated: TikTokTaskItem = {
        ...target,
        isBoosted: true,
        isHot: true,
        boostCount: (target.boostCount || 0) + 1,
        boostedAt: 'Vừa xong'
      };
      return [updated, ...prev.filter(t => t.id !== taskId)];
    });

    // 4. Phát thông báo công khai cho toàn thể cộng đồng (Public Announcement)
    const boostAnnouncement: PartnerCampaignAnnouncement = {
      id: `ann_boost_${Date.now()}`,
      partnerName: task.partnerName || task.channelName,
      campaignTitle: `🚀 ĐẨY TOP: ${task.title}`,
      channelHandle: task.channelHandle,
      totalSlots: task.totalSlots,
      remainingSlots: task.remainingSlots,
      rewardCoins: task.rewardCoins,
      taskType: task.type,
      taskId: task.id,
      createdAt: 'Vừa đẩy top',
      isBoosted: true
    };
    setPartnerAnnouncements(prev => [boostAnnouncement, ...prev]);

    // 5. Gửi thông báo đến tài khoản của tất cả người dùng
    const boostNotif: UserNotificationItem = {
      id: `notif_boost_${Date.now()}`,
      type: 'boosted_campaign',
      title: `🚀 Chiến Dịch Vừa Được Đẩy Top (+${task.rewardCoins} Xu)`,
      message: `Chủ kênh ${task.channelHandle} vừa chi 50.000 Xu đẩy top "${task.title}". Vào xem video & nhận Xu ngay trước khi hết suất!`,
      taskId: task.id,
      rewardCoins: task.rewardCoins,
      timestamp: 'Vừa xong',
      isRead: false
    };
    setUserNotifications(prev => [boostNotif, ...prev]);

    showToast(`🚀 Đã trừ 50.000 Xu và ĐẨY TOP THÀNH CÔNG chiến dịch "${task.title}" lên đầu sàn!`);
    return true;
  };

  // 3. Báo cáo hoạt động chi tiết (Ngày, Tuần, Tháng)
  const getActivityReport = (period: 'day' | 'week' | 'month'): UserActivityPeriodReport => {
    const completedList = Object.values(userCompletedActions);

    if (period === 'day') {
      const videosWatched = completedList.filter(c => c.viewed).length + 12;
      const followsGiven = completedList.filter(c => c.followed).length + 8;
      const likesGiven = completedList.filter(c => c.liked).length + 15;
      const commentsGiven = completedList.filter(c => c.commented).length + 6;
      const sharesGiven = completedList.filter(c => c.shared).length + 4;
      const liveMinutesWatched = 45;
      const totalCoinsEarned = analytics.todayEarningsCoins || 9400;
      return {
        period: 'day',
        periodLabel: 'Hôm Nay (24 Giờ)',
        videosWatched,
        followsGiven,
        likesGiven,
        commentsGiven,
        sharesGiven,
        liveMinutesWatched,
        totalCoinsEarned,
        totalVND: `${totalCoinsEarned.toLocaleString()}đ`
      };
    } else if (period === 'week') {
      const videosWatched = completedList.filter(c => c.viewed).length + 85;
      const followsGiven = completedList.filter(c => c.followed).length + 54;
      const likesGiven = completedList.filter(c => c.liked).length + 110;
      const commentsGiven = completedList.filter(c => c.commented).length + 38;
      const sharesGiven = completedList.filter(c => c.shared).length + 26;
      const liveMinutesWatched = 280;
      const totalCoinsEarned = analytics.weeklyEarningsCoins || 68500;
      return {
        period: 'week',
        periodLabel: 'Tuần Này (7 Ngày Qua)',
        videosWatched,
        followsGiven,
        likesGiven,
        commentsGiven,
        sharesGiven,
        liveMinutesWatched,
        totalCoinsEarned,
        totalVND: `${totalCoinsEarned.toLocaleString()}đ`
      };
    } else {
      const videosWatched = completedList.filter(c => c.viewed).length + 320;
      const followsGiven = completedList.filter(c => c.followed).length + 180;
      const likesGiven = completedList.filter(c => c.liked).length + 450;
      const commentsGiven = completedList.filter(c => c.commented).length + 120;
      const sharesGiven = completedList.filter(c => c.shared).length + 85;
      const liveMinutesWatched = 980;
      const totalCoinsEarned = analytics.monthlyEarningsCoins || 245000;
      return {
        period: 'month',
        periodLabel: 'Tháng Này (30 Ngày Qua)',
        videosWatched,
        followsGiven,
        likesGiven,
        commentsGiven,
        sharesGiven,
        liveMinutesWatched,
        totalCoinsEarned,
        totalVND: `${totalCoinsEarned.toLocaleString()}đ`
      };
    }
  };

  // =========================================================================
  // 4. MẠNG XÃ HỘI FACEBOOK: BẠN BÈ & NHẮN TIN MESSENGER THỜI GIAN THỰC
  // =========================================================================
  const [friends, setFriends] = useState<CommunityFriendItem[]>(INITIAL_FRIENDS);
  const [chatConversations, setChatConversations] = useState<Record<string, ChatMessageItem[]>>(INITIAL_CHAT_CONVERSATIONS);
  const [activeChatUser, setActiveChatUser] = useState<CommunityFriendItem | null>(null);

  const openChatWithUser = (chatTarget: OpenChatUserInput) => {
    setActiveChatUser({
      id: chatTarget.id || `friend_${Date.now()}`,
      name: chatTarget.name,
      handle: chatTarget.handle,
      avatar: chatTarget.avatar,
      role: chatTarget.role || 'Creator',
      tiktokFollowers: chatTarget.tiktokFollowers ?? 1000,
      status: chatTarget.status || 'friends',
      isOnline: chatTarget.isOnline ?? true,
      lastActive: chatTarget.lastActive || 'Vừa xong'
    });
  };

  const closeChat = () => {
    setActiveChatUser(null);
  };

  const toggleFriendship = (handle: string, name?: string, avatar?: string, role?: string) => {
    setFriends(prev => {
      const existing = prev.find(f => f.handle === handle);
      if (!existing) {
        const newFriend: CommunityFriendItem = {
          id: `friend_${Date.now()}`,
          name: name || handle,
          handle,
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          role: role || 'Creator',
          status: 'pending',
          isOnline: true,
          lastActive: 'Vừa xong'
        };
        showToast(`✓ Đã gửi lời mời kết bạn tới ${name || handle}!`);
        return [...prev, newFriend];
      }

      if (existing.status === 'none') {
        showToast(`✓ Đã gửi lời mời kết bạn tới ${existing.name}!`);
        return prev.map(f => f.handle === handle ? { ...f, status: 'pending' as const } : f);
      } else if (existing.status === 'pending') {
        showToast(`🎉 ${existing.name} đã đồng ý kết bạn! Hai bạn hiện là bạn bè.`);
        return prev.map(f => f.handle === handle ? { ...f, status: 'friends' as const } : f);
      } else {
        showToast(`Đã hủy kết bạn với ${existing.name}.`);
        return prev.map(f => f.handle === handle ? { ...f, status: 'none' as const } : f);
      }
    });
  };

  const sendChatMessage = (recipientHandle: string, text: string) => {
    if (!text.trim()) return;
    const myMsg: ChatMessageItem = {
      id: `msg_${Date.now()}`,
      senderHandle: user.tiktokConnected || '@thienvuaapp_official',
      senderName: user.name,
      recipientHandle,
      text: text.trim(),
      timestamp: 'Vừa xong',
      isMe: true
    };

    setChatConversations(prev => ({
      ...prev,
      [recipientHandle]: [...(prev[recipientHandle] || []), myMsg]
    }));

    // Auto simulated response from friend after 1.5s
    setTimeout(() => {
      const friendObj = friends.find(f => f.handle === recipientHandle);
      const friendName = friendObj ? friendObj.name : recipientHandle;
      const responses = [
        `Chào bạn ${user.name}! Cảm ơn bạn đã nhắn nhé, mình rất vui được kết nối cùng bạn! ❤️`,
        `Ok bạn nha! Mình vừa ghé qua kênh bạn xem rồi, tương tác rất tốt, cùng đẩy kênh lên xu hướng nhé! 🚀`,
        `Chào bạn! Chiều nay mình có phiên live làm nhiệm vụ giữ mắt, bạn nhớ ghé qua ủng hộ nha! 🔥`,
        `Cảm ơn bạn! Để mình xem và trao đổi kinh nghiệm booking video nhé!`
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: ChatMessageItem = {
        id: `msg_reply_${Date.now()}`,
        senderHandle: recipientHandle,
        senderName: friendName,
        recipientHandle: user.tiktokConnected || '@thienvuaapp_official',
        text: randomReply,
        timestamp: 'Vừa xong',
        isMe: false
      };

      setChatConversations(prev => ({
        ...prev,
        [recipientHandle]: [...(prev[recipientHandle] || []), replyMsg]
      }));
    }, 1500);
  };

  // 2. Kích hoạt phiên phát Live dành cho Người Mua Gói (Broadcast to all users)
  const broadcastLiveSession = (orderId: string, liveUrl: string, roomTitle: string) => {
    const order = user.myOrders?.find(o => o.id === orderId);
    if (!order) {
      showToast('Không tìm thấy gói dịch vụ Live tương ứng!');
      return false;
    }

    // Update buyer order
    setUser(prev => ({
      ...prev,
      myOrders: prev.myOrders?.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            liveBroadcastActive: true,
            liveUrl,
            broadcastRoomTitle: roomTitle,
            status: 'running' as const
          };
        }
        return o;
      })
    }));

    // Extract channel handle from TikTok live URL if present
    const extractedHandle = liveUrl.includes('@')
      ? '@' + liveUrl.split('@')[1].split('/')[0].split('?')[0]
      : (user.tiktokConnected || user.handle);

    // Inject into livestreamTasks list as top priority live mission
    const newLiveTask: LivestreamTaskItem = {
      id: `live_bcast_${orderId}`,
      channelName: user.name + ' (Kênh phát sóng)',
      channelHandle: extractedHandle,
      channelAvatar: user.avatar,
      roomTitle: roomTitle || '🔥 PHIÊN LIVE CỘNG ĐỒNG: TIKTOK SHOP SIÊU GIẢM GIÁ',
      currentViewers: order.deliveredEyes || 340,
      targetMinutes: 3,
      rewardPerMinute: 400,
      milestoneBonusCoins: 600,
      totalRewardCoins: 1800,
      targetUrl: liveUrl,
      status: 'live',
      category: 'TikTok Shop Flash Sale',
      hostFollowers: '250K+ Followers',
      requiredRank: 'Đồng',
      isLocked: false,
      dailyTierLevel: 1,
      tags: ['Gói Đang Chạy', 'TikTok Shop', 'Ưu Tiên Sàn']
    };

    setLivestreamTasks(prev => [newLiveTask, ...prev.filter(l => l.id !== newLiveTask.id && l.targetUrl !== liveUrl)]);

    // Create system-wide broadcast notification
    const bcastNotice: LiveBroadcastNotification = {
      id: `bcast_${Date.now()}`,
      orderId,
      buyerName: user.name,
      buyerHandle: user.tiktokConnected || user.handle,
      buyerAvatar: user.avatar,
      roomTitle: roomTitle || '🔴 PHÒNG LIVE TIKTOK SHOP ĐANG PHÁT SÓNG TRỰC TIẾP',
      targetLiveUrl: liveUrl,
      packageTitle: order.packageTitle,
      targetEyes: order.targetQuantity || 500,
      deliveredEyes: order.deliveredEyes || 0,
      targetHearts: order.targetHearts || 5000,
      deliveredHearts: order.deliveredHearts || 0,
      targetComments: order.targetComments || 200,
      deliveredComments: order.deliveredComments || 0,
      rewardPerWatcherCoins: 1200,
      requiredMinutes: 3,
      startTime: 'Vừa phát sóng',
      isActive: true
    };
    setActiveBroadcastNotification(bcastNotice);

    showToast('🔴 ĐÃ PHÁT ĐỘNG PHIÊN LIVE CHO TOÀN BỘ CỘNG ĐỒNG! Đã gửi thông báo cho hơn 154,200+ người dùng.');
    return true;
  };

  // 3. Tương tác với phòng Live cộng đồng & Cập nhật tiến độ gói của Người Mua
  const interactWithLiveBroadcast = (broadcastId: string, action: 'eye' | 'heart' | 'comment' | 'share') => {
    let reward = 200;
    let actionLabel = 'Thả tim phòng Live';
    if (action === 'eye') {
      reward = TASK_ACTION_REWARDS.LIVE_EYE_SESSION; // 1200
      actionLabel = 'Mắt xem Live đủ chuẩn';
    } else if (action === 'heart') {
      reward = TASK_ACTION_REWARDS.LIVE_HEART_TAP; // 200
      actionLabel = 'Thả tim tương tác';
    } else if (action === 'comment') {
      reward = TASK_ACTION_REWARDS.LIVE_COMMENT; // 300
      actionLabel = 'Bình luận giỏ hàng';
    } else if (action === 'share') {
      reward = TASK_ACTION_REWARDS.LIVE_SHARE; // 250
      actionLabel = 'Chia sẻ phòng Live';
    }

    const quota = getUserLiveQuota();
    const finalReward = Math.round(reward * quota.multiplier);
    const newCoins = user.avaliveCoins + finalReward;

    // Increment Buyer's package delivery progress
    setActiveBroadcastNotification(prev => {
      if (!prev) return null;
      const updated = { ...prev };
      if (action === 'eye') updated.deliveredEyes = (updated.deliveredEyes || 0) + 1;
      if (action === 'heart') updated.deliveredHearts = (updated.deliveredHearts || 0) + 25;
      if (action === 'comment') updated.deliveredComments = (updated.deliveredComments || 0) + 1;
      return updated;
    });

    // Update Buyer's order counters in user state if owned by current user
    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      myOrders: prev.myOrders?.map(o => {
        if (o.isLivePackage) {
          const newDelivered = action === 'eye' ? (o.deliveredEyes || 0) + 1 : (o.deliveredEyes || 0);
          const newHearts = action === 'heart' ? (o.deliveredHearts || 0) + 25 : (o.deliveredHearts || 0);
          const newComments = action === 'comment' ? (o.deliveredComments || 0) + 1 : (o.deliveredComments || 0);
          return {
            ...o,
            deliveredEyes: newDelivered,
            deliveredHearts: newHearts,
            deliveredComments: newComments,
            completedQuantity: newDelivered
          };
        }
        return o;
      })
    }));

    showToast(`✓ +${finalReward.toLocaleString()} Xu! Đã tính 1 lượt ${actionLabel}.`);
    return finalReward;
  };

  // 4. Đẩy phiên Livestream hoặc Chiến dịch lên Bảng Điện LED Toàn Sàn (Phí 100.000 Xu)
  const boostToMarquee = (
    targetId: string, 
    itemType: 'campaign' | 'livestream' | 'custom', 
    customData?: { title: string; handle: string; url: string; targetQuantity?: number; rewardText?: string }
  ): boolean => {
    if ((user.avaliveCoins || 0) < MARQUEE_BOOST_FEE_XU) {
      showToast(`❌ Số dư không đủ! Bạn cần ${MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu để đẩy lên Bảng Điện LED toàn sàn.`);
      openDeposit();
      return false;
    }

    // Trừ 100.000 Xu
    const newCoins = (user.avaliveCoins || 0) - MARQUEE_BOOST_FEE_XU;
    const newTx: TransactionRecord = {
      id: `tx_marquee_${Date.now()}`,
      type: 'spend',
      title: `Đăng ký Bảng Điện LED Toàn Sàn (${MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu)`,
      amount: `-${MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu`,
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    let title = customData?.title || '🔥 CHIẾN DỊCH HOT VIP ĐẨY TOP BẢNG ĐIỆN';
    let handle = customData?.handle || user.tiktokConnected || user.handle;
    let targetUrl = customData?.url || 'https://tiktok.com';
    let targetQty = customData?.targetQuantity || 500;
    let rewardText = customData?.rewardText || '👁️ +1,200 Xu/phút | ❤️ +200 Xu | 💬 +300 Xu';
    let badgeText = '⚡ VIP LED 100K XU';
    let actionText = itemType === 'livestream' ? 'Vào Xem Live Ngay' : 'Làm Nhiệm Vụ Ngay';

    if (itemType === 'campaign') {
      const camp = campaigns.find(c => c.id === targetId);
      if (camp) {
        title = camp.title;
        handle = camp.channelHandle;
        targetUrl = camp.targetUrl;
        targetQty = camp.targetQuantity;
        rewardText = `Thưởng: ${camp.pricePerAction}`;
        badgeText = '🔥 TOP CHIẾN DỊCH';
        actionText = 'Làm Nhiệm Vụ Ngay';
      }
    } else if (itemType === 'livestream') {
      const live = livestreamTasks.find(l => l.id === targetId || l.id === `live_bcast_${targetId}`);
      if (live) {
        title = live.roomTitle;
        handle = live.channelHandle;
        targetUrl = live.targetUrl;
        targetQty = 500;
        rewardText = `👁️ +${live.rewardPerMinute} Xu/phút | Bonus +${live.milestoneBonusCoins} Xu`;
        badgeText = '🔴 TRỰC TIẾP TOP 1';
        actionText = 'Vào Xem Live Ngay';
      }
    }

    const newItem: MarqueeTickerItem = {
      id: `marquee_${Date.now()}`,
      type: itemType === 'livestream' ? 'livestream' : 'campaign_video',
      title,
      channelHandle: handle,
      targetUrl,
      targetQuantity: targetQty,
      deliveredQuantity: 0,
      rewardText,
      hasMarqueeBoost: true,
      boostCostXu: MARQUEE_BOOST_FEE_XU,
      isActive: true,
      status: itemType === 'livestream' ? 'live' : 'running',
      startTime: 'Vừa kích hoạt',
      priority: 1,
      badgeText,
      actionText
    };

    // Đưa lên vị trí Top 1 của Bảng Điện
    setMarqueeTickerList(prev => [newItem, ...prev.filter(item => item.id !== newItem.id)]);

    // Cập nhật thông báo trực tiếp
    if (itemType === 'livestream') {
      setActiveBroadcastNotification({
        id: newItem.id,
        orderId: targetId,
        buyerName: user.name,
        buyerHandle: handle,
        buyerAvatar: user.avatar,
        roomTitle: title,
        targetLiveUrl: targetUrl,
        packageTitle: 'Gói Bảng Điện LED Toàn Sàn',
        targetEyes: targetQty,
        deliveredEyes: 0,
        targetHearts: 5000,
        deliveredHearts: 0,
        targetComments: 200,
        deliveredComments: 0,
        rewardPerWatcherCoins: 1200,
        requiredMinutes: 3,
        startTime: 'Vừa kích hoạt',
        isActive: true
      });
    }

    showToast(`🎉 CHÚC MỪNG! Đã kích hoạt Bảng Điện LED Toàn Sàn thành công (-${MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu). Phiên của bạn đang chạy ở vị trí TOP 1!`);
    return true;
  };

  // 5. Kết thúc phiên Livestream/Chiến dịch -> Tự động ẩn khỏi Bảng Điện và lưu Lịch Sử
  const endMarqueeItem = (id: string, reason: 'livestream_ended' | 'campaign_completed' | 'user_ended' = 'livestream_ended') => {
    const itemToEnd = marqueeTickerList.find(i => i.id === id);
    if (!itemToEnd) return;

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
    
    // Lưu vào Lịch Sử
    const historyRecord: MarqueeHistoryRecord = {
      id: `hist_${Date.now()}`,
      item: {
        ...itemToEnd,
        isActive: false,
        status: 'ended',
        endedAt: nowStr,
        badgeText: 'ĐÃ KẾT THÚC'
      },
      endedAt: nowStr,
      totalReachedViewers: itemToEnd.deliveredQuantity || (itemToEnd.targetQuantity ? Math.round(itemToEnd.targetQuantity * 0.95) : 380),
      totalXuDistributed: (itemToEnd.deliveredQuantity || 350) * 1200,
      reason
    };

    setMarqueeHistoryList(prev => [historyRecord, ...prev]);
    // Ẩn / gỡ khỏi Bảng Điện active
    setMarqueeTickerList(prev => prev.filter(i => i.id !== id));

    // Đóng broadcast notice nếu đang trỏ tới phiên này
    if (activeBroadcastNotification && (activeBroadcastNotification.id === id || activeBroadcastNotification.orderId === itemToEnd.orderId)) {
      setActiveBroadcastNotification(null);
    }

    showToast(`⏹️ Phiên "${itemToEnd.title.slice(0, 30)}..." đã kết thúc và được đưa vào Lịch Sử Bảng Điện LED!`);
  };

  // Check-in Daily
  const checkInDaily = () => {
    if (analytics.checkedInToday) {
      showToast('Hôm nay bạn đã điểm danh rồi. Hãy quay lại vào ngày mai nhé!');
      return;
    }

    const rewardCoins = 500 * (analytics.dailyStreak + 1);
    const newCoins = user.avaliveCoins + rewardCoins;

    const newTx: TransactionRecord = {
      id: `tx_streak_${Date.now()}`,
      type: 'earn',
      title: `Điểm danh chuỗi Ngày ${analytics.dailyStreak + 1}`,
      amount: `+${rewardCoins.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    setAnalytics(prev => ({
      ...prev,
      dailyStreak: prev.dailyStreak + 1,
      checkedInToday: true,
      todayEarningsCoins: prev.todayEarningsCoins + rewardCoins
    }));

    showToast(`🔥 Điểm danh thành công! Nhận +${rewardCoins.toLocaleString()} Xu cho chuỗi ngày ${analytics.dailyStreak + 1}!`);
  };

  // Trừ 1.000 Xu chi phí tham gia vòng quay (khi người dùng tự nguyện quay bằng Xu)
  const deductSpinFee = (): boolean => {
    const SPIN_COST = 1000;
    if (user.avaliveCoins < SPIN_COST) {
      showToast(`⚠️ Số dư hiện tại (${user.avaliveCoins.toLocaleString()} Xu) không đủ 1.000 Xu để quay! Hãy làm thêm nhiệm vụ hoặc nạp Xu.`);
      return false;
    }
    const newCoins = user.avaliveCoins - SPIN_COST;
    const feeTx: TransactionRecord = {
      id: `tx_spin_fee_${Date.now()}`,
      type: 'spend',
      title: 'Chi phí tham gia Vòng Quay May Mắn (-1,000 Xu)',
      amount: '-1,000 Xu',
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };
    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [feeTx, ...prev.transactions]
    }));
    return true;
  };

  const consumeFreeSpin = () => {
    setUser(prev => ({
      ...prev,
      luckyWheelFreeSpins: Math.max(0, (prev.luckyWheelFreeSpins || 1) - 1)
    }));
  };

  const grantFreeSpin = (count: number = 1) => {
    setUser(prev => ({
      ...prev,
      luckyWheelFreeSpins: (prev.luckyWheelFreeSpins || 0) + count
    }));
    showToast(`🎁 Đã cộng thêm ${count} lượt quay may mắn miễn phí vào tài khoản!`);
  };

  // Trao quà nổ thưởng 100% tự động theo đúng tỷ lệ:
  // 500 Xu (40%), 1.000 Xu (35%), 2.000 Xu (15%), Gói 50 Follow = 5.000 Xu (10%)
  const awardLuckyWheelPrize = (prizeIdx: number) => {
    if (prizeIdx === 3) {
      // Gói Follow: Tổng quà là 5.000 Xu, từ Xu đổi thành 50 Follower thật (100 Xu/follow)
      const prizeXu = 5000;
      const followGain = 50;
      const newCoins = user.avaliveCoins + prizeXu;
      const newFollowers = user.tiktokFollowers + followGain;

      const prizeTx: TransactionRecord = {
        id: `tx_wheel_${Date.now()}`,
        type: 'wheel',
        title: 'Jackpot Vòng Quay: +5,000 Xu (Đổi Gói 50 Follow Thật)',
        amount: '+5,000 Xu & +50 Follow',
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        tiktokFollowers: newFollowers,
        transactions: [prizeTx, ...prev.transactions]
      }));

      triggerFireworks({
        type: 'lucky_wheel',
        badge: '💥 JACKPOT ĐỈNH CAO • NỔ QUÀ KHỦNG',
        title: 'TRÚNG GÓI 50 FOLLOW (5.000 XU)!',
        subtitle: '100% Nổ Quà! Hệ thống đã cộng 5.000 Xu và tự động quy đổi thành 50 Follower thật được nạp thẳng vào kênh TikTok của bạn!',
        rewardText: '+5.000 XU & +50 FOLLOW',
        message: 'Chúc mừng bạn đã quay trúng phần quà cao nhất của Vòng Quay May Mắn! Kênh TikTok của bạn đã được tiếp thêm 50 Follower thật cùng 5.000 Xu quà tặng.'
      });

      showToast('🎰 JACKPOT: Đã nổ quà +5.000 Xu và tự động quy đổi thành 50 Follower thật vào kênh!');
      return { prizeText: 'Gói 50 Follow (5.000 Xu)', coins: 5000, followers: 50, index: 3 };
    } else {
      const prizeCoinsMap = [500, 1000, 2000];
      const coinsWon = prizeCoinsMap[prizeIdx] || 500;
      const newCoins = user.avaliveCoins + coinsWon;

      const isBreakEven = coinsWon === 1000;
      const isProfit = coinsWon === 2000;

      const prizeTx: TransactionRecord = {
        id: `tx_wheel_${Date.now()}`,
        type: 'wheel',
        title: `Trúng thưởng Vòng Quay May Mắn (+${coinsWon.toLocaleString()} Xu)${isBreakEven ? ' [Hoàn vốn 1.000 Xu]' : isProfit ? ' [Lãi x2 vốn]' : ''}`,
        amount: `+${coinsWon.toLocaleString()} Xu`,
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        transactions: [prizeTx, ...prev.transactions]
      }));

      triggerFireworks({
        type: 'lucky_wheel',
        badge: isProfit ? '🔥 LÃI GẤP ĐÔI X2 • VÒNG QUAY MAY MẮN' : isBreakEven ? '⚡ HOÀN VỐN 100% • VÒNG QUAY MAY MẮN' : '🎉 NỔ QUÀ MAY MẮN TIKTOK',
        title: `NỔ QUÀ: +${coinsWon.toLocaleString()} XU!`,
        subtitle: `Số Xu thưởng +${coinsWon.toLocaleString()} Xu đã được hệ thống tự động cộng trực tiếp vào số dư ví của bạn!`,
        rewardText: `+${coinsWon.toLocaleString()} XU`,
        message: isProfit 
          ? 'Quá may mắn! Bạn đã nhân đôi số Xu của mình chỉ sau một lượt quay may mắn.' 
          : isBreakEven 
          ? 'Hoàn vốn 100%! Bạn bảo toàn nguyên vẹn số Xu và sẵn sàng cho lượt quay bùng nổ tiếp theo.'
          : 'Chúc mừng bạn đã nhận được quà tặng Xu tri ân từ hệ thống Vòng Quay May Mắn!'
      });

      showToast(`🎰 Nổ quà +${coinsWon.toLocaleString()} Xu đã được cộng trực tiếp vào số dư ví của bạn!`);
      return { prizeText: `+${coinsWon.toLocaleString()} Xu`, coins: coinsWon, index: prizeIdx };
    }
  };

  // Spin Lucky Wheel (Quà tặng sau khi hoàn thành nhiệm vụ mỗi ngày hoặc quay bằng Xu)
  const spinLuckyWheel = () => {
    const rand = Math.random();
    let idx = 0;
    if (rand < 0.40) idx = 0;       // 500 Xu (40%)
    else if (rand < 0.75) idx = 1;  // 1,000 Xu (35%)
    else if (rand < 0.90) idx = 2;  // 2,000 Xu (15%)
    else idx = 3;                   // Gói 50 Follow = 5,000 Xu (10%)
    const res = awardLuckyWheelPrize(idx);
    return { prizeText: res.prizeText, coins: res.coins };
  };

  // Convert Token to Coins / VNĐ
  const convertTokenToCoins = (tokenAmount: number) => {
    if (user.tokenBalance < tokenAmount) {
      showToast('❌ Số dư Token không đủ!');
      return;
    }

    const coinsToAdd = tokenAmount * tokenomics.tokenPriceVND;
    setUser(prev => ({
      ...prev,
      tokenBalance: prev.tokenBalance - tokenAmount,
      avaliveCoins: prev.avaliveCoins + coinsToAdd,
      coinsValueVND: `${(prev.avaliveCoins + coinsToAdd).toLocaleString()}đ`
    }));

    showToast(`Đã quy đổi ${tokenAmount} Token thành ${coinsToAdd.toLocaleString()} Xu theo giá thị trường!`);
  };

  // Connect TikTok (Lưu danh sách tài khoản liên kết & linh hoạt chuyển đổi)
  const connectTikTok = (handle: string) => {
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
    
    const currentList = ipAccountsMap[clientIp] || [];
    const isAlreadyConnected = currentList.includes(cleanHandle);

    if (!isAlreadyConnected) {
      const updatedList = [...currentList, cleanHandle];
      saveIpAccounts({ ...ipAccountsMap, [clientIp]: updatedList });
    }

    const bonusCoins = 1000;
    const newCoins = user.avaliveCoins + bonusCoins;

    const newTx: TransactionRecord = {
      id: `tx_connect_${Date.now()}`,
      type: 'earn',
      title: `Thưởng kết nối kênh TikTok thật ${cleanHandle}`,
      amount: `+${bonusCoins.toLocaleString()} Xu`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_tiktok_connected', cleanHandle);
      }
    } catch {}

    setUser(prev => ({
      ...prev,
      tiktokConnected: cleanHandle,
      tiktokHandle: cleanHandle,
      tiktokProfileUrl: `https://www.tiktok.com/${cleanHandle}`,
      isTikTokVerified: true,
      tiktokFollowers: prev.tiktokFollowers > 0 ? prev.tiktokFollowers : 248500,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    showToast(`✅ Đã kết nối & xác thực tài khoản TikTok ${cleanHandle} thành công! Nhận ngay +1,000 Xu.`);
    closeConnect();
  };

  const disconnectTikTok = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_tiktok_connected', '');
      }
    } catch {}
    setUser(prev => ({
      ...prev,
      tiktokConnected: '',
      isTikTokVerified: false
    }));
    showToast('Đã ngắt kết nối tài khoản TikTok.');
  };

  // Connect Facebook (Trang cá nhân, Fanpage, Hội nhóm - Cài đặt sẵn, chưa cộng Xu)
  const connectFacebook = (urlOrHandle: string, fbType: 'personal' | 'fanpage' | 'group' = 'personal') => {
    const clean = urlOrHandle.trim()
      .replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
      .replace(/\/$/, '');

    setUser(prev => ({
      ...prev,
      facebookConnected: clean,
      facebookProfileUrl: urlOrHandle.startsWith('http') ? urlOrHandle : `https://facebook.com/${clean}`,
      facebookType: fbType,
      isFacebookVerified: true,
      facebookFollowers: prev.facebookFollowers && prev.facebookFollowers > 0 ? prev.facebookFollowers : 15800
    }));

    const typeName = fbType === 'fanpage' ? 'Fanpage' : fbType === 'group' ? 'Hội nhóm' : 'Trang cá nhân';
    showToast(`✅ Đã ghi nhận ${typeName} Facebook: fb.com/${clean}! (Cài đặt sẵn • Chưa tính Xu).`);
    closeConnect();
  };

  const disconnectFacebook = () => {
    setUser(prev => ({
      ...prev,
      facebookConnected: '',
      facebookProfileUrl: '',
      isFacebookVerified: false
    }));
    showToast('Đã ngắt kết nối tài khoản Facebook.');
  };

  // Connect YouTube (Kênh YouTube - Cài đặt sẵn, chưa cộng Xu)
  const connectYoutube = (urlOrHandle: string) => {
    const clean = urlOrHandle
      .replace(/^https?:\/\/(www\.)?youtube\.com\/(@)?/, '')
      .replace(/^@/, '')
      .replace(/\/$/, '');

    setUser(prev => ({
      ...prev,
      youtubeConnected: `@${clean}`,
      youtubeProfileUrl: urlOrHandle.startsWith('http') ? urlOrHandle : `https://youtube.com/@${clean}`,
      isYoutubeVerified: true,
      youtubeSubscribers: prev.youtubeSubscribers && prev.youtubeSubscribers > 0 ? prev.youtubeSubscribers : 12500
    }));

    showToast(`✅ Đã ghi nhận kênh YouTube @${clean}! (Cài đặt sẵn • Chưa tính Xu).`);
    closeConnect();
  };

  const disconnectYoutube = () => {
    setUser(prev => ({
      ...prev,
      youtubeConnected: '',
      youtubeProfileUrl: '',
      isYoutubeVerified: false
    }));
    showToast('Đã ngắt kết nối kênh YouTube.');
  };

  // Deposit
  const deposit = (amountVND: number, method: string) => {
    const addedCoins = amountVND;
    const newCoins = user.avaliveCoins + addedCoins;

    const newTx: TransactionRecord = {
      id: `tx_dep_${Date.now()}`,
      type: 'deposit',
      title: `Nạp tiền thành công qua ${method}`,
      amount: `+${amountVND.toLocaleString()}đ (+${addedCoins.toLocaleString()} Xu)`,
      isPositive: true,
      date: 'Vừa xong',
      method: method,
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      fiatVND: `${(parseInt(prev.fiatVND.replace(/\D/g, '')) + amountVND).toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    showToast(`💳 Nạp thành công ${amountVND.toLocaleString()}đ qua ${method}!`);
  };

  // Withdraw (Lần 1 miễn phí 0% • Từ lần 2 trở đi: Phí 5% & Bắt buộc KYC đầy đủ • Giải ngân 10:00 sáng Thứ Hai trong 24h)
  const withdraw = (amountVND: number, bankInfo: BankAccountInfo): boolean => {
    const currentWithdrawCount = user.withdrawCount || 0;
    const isFirstWithdraw = currentWithdrawCount === 0;

    // Rút tiền lần 2 trở đi BẮT BUỘC phải cập nhật thông tin hồ sơ KYC đầy đủ mới rút được tiền
    if (!isFirstWithdraw && user.kycStatus !== 'verified') {
      showToast('⚠️ Từ lần rút thứ 2 trở đi, BẮT BUỘC phải cập nhật thông tin hồ sơ KYC đầy đủ mới được rút tiền! Vui lòng hoàn thành KYC.');
      setIsKycModalOpen(true);
      return false;
    }

    if (amountVND < 200000) {
      showToast('❌ Mức rút tiền tối thiểu quy định là 200,000 VNĐ (200,000 Xu)!');
      return false;
    }

    if (user.avaliveCoins < amountVND) {
      showToast('❌ Số dư Xu không đủ để rút số tiền này!');
      return false;
    }

    // Lần đầu miễn phí (0%), lần 2 trở đi phí 5%
    const feeRate = isFirstWithdraw ? 0 : 0.05;
    const platformFee = Math.round(amountVND * feeRate);
    const netReceivedVND = amountVND - platformFee;
    const newCoins = user.avaliveCoins - amountVND;

    const newTx: TransactionRecord = {
      id: `tx_wd_${Date.now()}`,
      type: 'withdraw',
      title: `Rút tiền về ${bankInfo.bankName} (${bankInfo.accountNumber})`,
      amount: isFirstWithdraw
        ? `-${amountVND.toLocaleString()} Xu (RÚT LẦN ĐẦU MIỄN PHÍ 0% • Thực nhận: +${netReceivedVND.toLocaleString()}đ)`
        : `-${amountVND.toLocaleString()} Xu (Thực nhận: +${netReceivedVND.toLocaleString()}đ, Phí sàn 5%: -${platformFee.toLocaleString()}đ)`,
      isPositive: false,
      date: 'Vừa xong',
      method: bankInfo.bankName,
      status: 'pending' // Chờ giải ngân vào 10:00 sáng Thứ Hai trong 24h
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      bankInfo: bankInfo,
      withdrawCount: currentWithdrawCount + 1,
      transactions: [newTx, ...prev.transactions]
    }));

    if (isFirstWithdraw) {
      showToast(`🎉 RÚT TIỀN LẦN ĐẦU MIỄN PHÍ 100%! Lệnh rút ${amountVND.toLocaleString()} Xu không mất phí (thực nhận +${netReceivedVND.toLocaleString()}đ). Tiền sẽ được chuyển tự động vào 10:00 Sáng Thứ Hai (xử lý trong 24h).`);
    } else {
      showToast(`💸 Lệnh rút ${amountVND.toLocaleString()} Xu đã tiếp nhận! Phí sàn 5% (-${platformFee.toLocaleString()}đ). Thực nhận ${netReceivedVND.toLocaleString()}đ sẽ được chuyển tự động vào 10:00 Sáng Thứ Hai (xử lý trong 24h).`);
    }
    return true;
  };

  // ============================================================================
  // KYC VERIFICATION ACTIONS (XÁC MINH DANH TÍNH)
  // ============================================================================
  const submitKyc = (data: KycVerificationData) => {
    setUser(prev => ({
      ...prev,
      kycStatus: 'pending',
      kycData: data,
      bankInfo: {
        bankName: data.bankName,
        accountNumber: data.bankAccountNumber,
        accountHolder: data.bankAccountHolder
      }
    }));

    setKycRequests(prev => [data, ...prev.filter(r => r.userId !== data.userId)]);
    syncKycToSupabase(data);
    showToast('🛡️ Hồ sơ KYC đã được gửi thành công! Hệ thống và Admin đang xét duyệt trong 5-15 phút.');
  };

  const adminApproveKyc = (userId: string) => {
    setKycRequests(prev => prev.map(r => r.userId === userId ? { ...r, status: 'verified', reviewedAt: 'Vừa xong' } : r));
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'verified' } : u));
    
    // Nếu là user hiện tại
    if (userId === 'usr_001' || user.email === 'thienvuaapp@gmail.com') {
      setUser(prev => ({ ...prev, kycStatus: 'verified' }));
    }

    showToast('✓ Đã phê duyệt hồ sơ KYC thành công! Tài khoản đã mở khóa quyền rút tiền về ngân hàng.');
  };

  const adminRejectKyc = (userId: string, reason: string) => {
    setKycRequests(prev => prev.map(r => r.userId === userId ? { ...r, status: 'rejected', rejectionReason: reason, reviewedAt: 'Vừa xong' } : r));
    setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'rejected' } : u));

    if (userId === 'usr_001' || user.email === 'thienvuaapp@gmail.com') {
      setUser(prev => ({ ...prev, kycStatus: 'rejected' }));
    }

    showToast(`⚠️ Đã từ chối hồ sơ KYC: ${reason}`);
  };

  // ============================================================================
  // APP MARKETPLACE ACTIONS (QUẢN TRỊ & MUA APP KIẾM TIỀN BẰNG XU)
  // ============================================================================
  const addSoftwareApp = (appData: Omit<SoftwareAppItem, 'id' | 'rating' | 'reviewCount' | 'downloadsCount'>) => {
    const newApp: SoftwareAppItem = {
      ...appData,
      id: `app_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      downloadsCount: 1,
      fiatPriceVND: `${(appData.priceXu || 0).toLocaleString('vi-VN')}đ`,
      downloadUrl: appData.downloadUrl || 'https://drive.google.com'
    };
    setSoftwareApps(prev => [newApp, ...prev]);
    showToast(`✅ Đã thêm ứng dụng "${newApp.title}" thành công!`);
  };

  const updateSoftwareApp = (appId: string, updated: Partial<SoftwareAppItem>) => {
    setSoftwareApps(prev => prev.map(app => {
      if (app.id === appId) {
        const nextPrice = updated.priceXu !== undefined ? updated.priceXu : app.priceXu;
        return {
          ...app,
          ...updated,
          fiatPriceVND: `${nextPrice.toLocaleString('vi-VN')}đ`
        };
      }
      return app;
    }));
    showToast(`✅ Đã lưu cập nhật ứng dụng thành công!`);
  };

  const deleteSoftwareApp = (appId: string) => {
    setSoftwareApps(prev => prev.filter(app => app.id !== appId));
    showToast(`🗑️ Đã xóa ứng dụng khỏi danh sách!`);
  };

  const buySoftwareApp = (appId: string, paymentMethod: 'token' | 'coins' | 'vnd' = 'coins'): AppLicensePurchase | null => {
    const app = softwareApps.find(a => a.id === appId) || SOFTWARE_APPS_CATALOG.find(a => a.id === appId);
    if (!app) return null;

    const costXu = app.priceXu || (app.tokenPrice ? app.tokenPrice * 1000 : 500000);

    if (user.avaliveCoins < costXu) {
      showToast(`❌ Số dư Xu không đủ! Bạn cần ${costXu.toLocaleString()} Xu (Hiện có: ${user.avaliveCoins.toLocaleString()} Xu).`);
      return null;
    }

    const newCoins = user.avaliveCoins - costXu;
    const cleanKey = `TKPRO-${app.category.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newLicense: AppLicensePurchase = {
      id: `lic_${Date.now()}`,
      appId: app.id,
      appTitle: app.title,
      licenseKey: cleanKey,
      xuPaid: costXu,
      tokenPaid: Math.round(costXu / 1000),
      purchasedAt: 'Vừa xong',
      expiryDate: 'Trọn đời (Lifetime)',
      status: 'active',
      downloadUrl: app.downloadUrl || 'https://drive.google.com'
    };

    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      type: 'spend',
      title: `Mua bản quyền: ${app.title}`,
      amount: `-${costXu.toLocaleString()} Xu`,
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString('vi-VN')}đ`,
      myAppLicenses: [newLicense, ...(prev.myAppLicenses || [])],
      transactions: [newTx, ...(prev.transactions || [])]
    }));

    setMyAppLicenses(prev => [newLicense, ...prev]);

    showToast(`🎉 Mua bản quyền phần mềm "${app.title}" thành công! Đã cấp License Key.`);
    return newLicense;
  };

  // ============================================================================
  // TOKEN MANAGEMENT & SINKS (CUNG CẤP & HẤP THỤ BỞI SÀN)
  // ============================================================================
  const orderServiceWithToken = (pkg: GrowthServiceItem, targetUrl: string): boolean => {
    // Chiết khấu 10% khi dùng Token: 1 Token = 1,000đ (1,000 Xu)
    const tokenRequired = Math.round((pkg.priceNum * 0.9) / 1000);

    if (user.tokenBalance < tokenRequired) {
      showToast(`❌ Số dư Token không đủ! Bạn cần ${tokenRequired} Token (Hiện có: ${user.tokenBalance} Token).`);
      return false;
    }

    const newTokenBalance = user.tokenBalance - tokenRequired;

    const newOrder: ServiceOrder = {
      id: `ord_tok_${Date.now().toString().slice(-6)}`,
      packageId: pkg.id,
      packageTitle: `${pkg.title} (Thanh toán bằng Token - Giảm 10%)`,
      category: pkg.category,
      price: `${tokenRequired} TOKEN (≈ ${(tokenRequired * 1000).toLocaleString()}đ)`,
      targetUrl: targetUrl,
      targetQuantity: pkg.targetQuantity,
      completedQuantity: 0,
      status: 'running',
      createdAt: 'Vừa xong',
      isLivePackage: pkg.category === 'livestream',
      deliveredEyes: 0,
      targetEyes: pkg.category === 'livestream' ? pkg.targetQuantity : undefined,
      deliveredHearts: 0,
      deliveredComments: 0
    };

    const newLedgerRecord: TokenLedgerRecord = {
      id: `tled_${Date.now()}`,
      userId: 'usr_001',
      userEmail: user.email || 'thienvuaapp@gmail.com',
      type: 'buy_growth_package',
      tokenAmount: -tokenRequired,
      vndValue: `-${(tokenRequired * 1000).toLocaleString()}đ`,
      note: `Dùng Token mua gói: ${pkg.title}`,
      createdAt: 'Vừa xong'
    };

    setUser(prev => ({
      ...prev,
      tokenBalance: newTokenBalance,
      myOrders: [newOrder, ...(prev.myOrders || [])]
    }));

    setTokenLedger(prev => [newLedgerRecord, ...prev]);

    syncTokenLedgerToSupabase({
      userId: 'usr_001',
      txType: 'buy_growth_package',
      tokenAmount: -tokenRequired,
      tokenBalanceAfter: newTokenBalance,
      vndEquivalent: tokenRequired * 1000,
      note: `Dùng Token mua gói: ${pkg.title}`
    });

    syncOrderToSupabase({
      userId: 'usr_001',
      packageId: pkg.id,
      packageTitle: pkg.title,
      category: pkg.category,
      priceVnd: tokenRequired * 1000,
      tokenPaid: tokenRequired,
      paymentCurrency: 'TOKEN',
      targetUrl,
      targetQuantity: pkg.targetQuantity
    });

    showToast(`🚀 Kích hoạt gói "${pkg.title}" bằng Token thành công! Tiết kiệm 10% chi phí.`);
    return true;
  };

  const convertVndToToken = (amountVND: number): boolean => {
    if (user.avaliveCoins < amountVND) {
      showToast('❌ Số dư Xu không đủ để đổi lượng Token này!');
      return false;
    }

    const tokenReceived = Math.floor(amountVND / 1000);
    const newCoins = user.avaliveCoins - amountVND;
    const newTokenBalance = user.tokenBalance + tokenReceived;

    const newLedgerRecord: TokenLedgerRecord = {
      id: `tled_${Date.now()}`,
      userId: 'usr_001',
      userEmail: user.email || 'thienvuaapp@gmail.com',
      type: 'convert_vnd_to_token',
      tokenAmount: tokenReceived,
      vndValue: `+${amountVND.toLocaleString()}đ`,
      note: `Quy đổi ${amountVND.toLocaleString()} Xu sang ${tokenReceived} Token`,
      createdAt: 'Vừa xong'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      tokenBalance: newTokenBalance
    }));

    setTokenLedger(prev => [newLedgerRecord, ...prev]);
    showToast(`💎 Quy đổi thành công +${tokenReceived} Token từ ${amountVND.toLocaleString()} Xu!`);
    return true;
  };

  const convertTokenToVnd = (tokenAmount: number): boolean => {
    if (user.kycStatus !== 'verified') {
      showToast('⚠️ Bạn bắt buộc phải hoàn thành Xác Minh Danh Tính (KYC) trước khi đổi Token sang tiền mặt!');
      setIsKycModalOpen(true);
      return false;
    }

    if (user.tokenBalance < tokenAmount) {
      showToast('❌ Số dư Token không đủ!');
      return false;
    }

    const vndReceived = tokenAmount * 1000;
    const newTokenBalance = user.tokenBalance - tokenAmount;
    const newCoins = user.avaliveCoins + vndReceived;

    const newLedgerRecord: TokenLedgerRecord = {
      id: `tled_${Date.now()}`,
      userId: 'usr_001',
      userEmail: user.email || 'thienvuaapp@gmail.com',
      type: 'convert_token_to_vnd',
      tokenAmount: -tokenAmount,
      vndValue: `+${vndReceived.toLocaleString()}đ`,
      note: `Đổi ${tokenAmount} Token sang ${vndReceived.toLocaleString()} Xu/VNĐ`,
      createdAt: 'Vừa xong'
    };

    setUser(prev => ({
      ...prev,
      tokenBalance: newTokenBalance,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`
    }));

    setTokenLedger(prev => [newLedgerRecord, ...prev]);
    showToast(`💸 Đổi thành công ${tokenAmount} Token lấy +${vndReceived.toLocaleString()}đ vào ví Xu!`);
    return true;
  };

  // MASTER ADMIN TOKEN SUPPLY CONTROLS (QUẢN TRỊ KHO TỔNG XU SÀN)
  const adminMintTreasuryTokens = (amount: number, note?: string) => {
    if (amount <= 0) return;
    setTokenSupplyConfig(prev => ({
      ...prev,
      mintedSupply: prev.mintedSupply + amount
    }));
    const newLedger: TokenLedgerRecord = {
      id: `tled_mint_${Date.now()}`,
      userId: 'admin_master',
      userEmail: 'admin@avalive.vn',
      type: 'admin_mint',
      tokenAmount: amount,
      vndValue: `+${amount.toLocaleString('vi-VN')}đ`,
      note: note || `Admin đúc / cấp thêm +${amount.toLocaleString('vi-VN')} Xu vào Quỹ Sàn`,
      createdAt: 'Vừa xong'
    };
    setTokenLedger(prev => [newLedger, ...prev]);
    showToast(`✅ Đã cấp thêm +${amount.toLocaleString('vi-VN')} Xu vào Quỹ Sàn thành công!`);
  };

  const adminBurnTreasuryTokens = (amount: number, note?: string) => {
    if (amount <= 0) return;
    setTokenSupplyConfig(prev => ({
      ...prev,
      manualBurnedSupply: prev.manualBurnedSupply + amount
    }));
    const newLedger: TokenLedgerRecord = {
      id: `tled_burn_${Date.now()}`,
      userId: 'admin_master',
      userEmail: 'admin@avalive.vn',
      type: 'admin_burn',
      tokenAmount: -amount,
      vndValue: `-${amount.toLocaleString('vi-VN')}đ`,
      note: note || `Admin triệt tiêu / đốt -${amount.toLocaleString('vi-VN')} Xu khỏi lưu thông`,
      createdAt: 'Vừa xong'
    };
    setTokenLedger(prev => [newLedger, ...prev]);
    showToast(`🔥 Đã đốt thành công -${amount.toLocaleString('vi-VN')} Xu khỏi lưu thông!`);
  };

  const adminSetInitialSupply = (amount: number) => {
    if (amount <= 0) return;
    setTokenSupplyConfig(prev => ({
      ...prev,
      initialSupply: amount
    }));
    showToast(`⚙️ Đã cấu hình Tổng Cung Ban Đầu thành ${amount.toLocaleString('vi-VN')} Xu!`);
  };

  const adminResetTokenLedgerAndSupply = () => {
    // 1. Reset user wallet to 0 clean real balance
    setUser(prev => ({
      ...prev,
      avaliveCoins: 0,
      coinsValueVND: '0đ',
      tokenBalance: 0,
      completedTasksCount: 0,
      dailyTasksCompleted: 0,
      transactions: [],
      myOrders: [],
      myAppLicenses: []
    }));

    // 2. Reset admin users list balances to 0
    setAdminUsers(prev => prev.map(u => ({
      ...u,
      coinsBalance: 0,
      tokenBalance: 0
    })));

    // 3. Reset token supply config to default 10 billion
    setTokenSupplyConfig({
      initialSupply: 10000000000,
      mintedSupply: 0,
      manualBurnedSupply: 0
    });

    // 4. Clear token ledger records & reset platform boost revenue
    setTokenLedger([]);
    setPlatformBoostRevenue(0);

    // 5. Clean localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ava_token_ledger');
        localStorage.setItem('ava_token_supply_config', JSON.stringify({
          initialSupply: 10000000000,
          mintedSupply: 0,
          manualBurnedSupply: 0
        }));
      }
    } catch {}

    showToast('✅ Đã reset toàn bộ số liệu ví thị trường về 0! Tổng cung 10 Tỷ Xu và Kho Quỹ Sàn 100% sẵn sàng.');
  };

  const saveBankInfo = (bankInfo: BankAccountInfo) => {
    setUser(prev => ({
      ...prev,
      bankInfo: bankInfo
    }));
    showToast('Đã lưu thông tin tài khoản ngân hàng thụ hưởng!');
  };

  // Create Campaign
  const createCampaign = (campaignData: {
    title: string;
    type: CampaignItem['type'];
    channelHandle: string;
    targetUrl: string;
    targetQuantity: number;
    budgetTotal: string;
    budgetCoins?: number;
    pricePerAction: string;
    instructions: string;
    livestreamMinutes?: number;
    multiTargets?: MultiTargetConfig[];
    audienceTargeting?: CampaignAudienceTargeting;
  }): boolean => {
    // Trích xuất an toàn số Xu ngân sách thực tế (từ budgetCoins trực tiếp hoặc chỉ lấy phần số đầu tiên trước chữ Xu/VND)
    let rawBudget = campaignData.budgetCoins || 0;
    if (!rawBudget && campaignData.budgetTotal) {
      const firstChunk = campaignData.budgetTotal.split(/Xu|\(|đ/i)[0];
      rawBudget = parseInt(firstChunk.replace(/\D/g, ''), 10) || 0;
    }

    if ((user.avaliveCoins || 0) < rawBudget) {
      showToast(`❌ Số dư Xu không đủ (${(user.avaliveCoins || 0).toLocaleString()} Xu < ${rawBudget.toLocaleString()} Xu). Vui lòng nạp thêm Xu để chạy chiến dịch!`);
      setIsDepositOpen(true);
      return false;
    }
    const newCoins = Math.max(0, (user.avaliveCoins || 0) - rawBudget);
    let singleNewTask: TikTokTaskItem | null = null;

    // Phân bổ chuẩn xác 40% ngân sách cho thợ làm nhiệm vụ
    const workerRewardPool = Math.round(rawBudget * 0.4);
    const workerRewardPerAction = Math.max(100, Math.round((rawBudget / Math.max(1, campaignData.targetQuantity)) * 0.4));

    const newCampaign: CampaignItem = {
      id: `camp_${Date.now()}`,
      ...campaignData,
      completedQuantity: 0,
      status: 'running',
      createdAt: 'Vừa xong'
    };

    // Nếu là chiến dịch kết hợp đa mục tiêu (Multi-Target Combined Campaign)
    if (campaignData.multiTargets && campaignData.multiTargets.length > 0) {
      campaignData.multiTargets.forEach((tgt, idx) => {
        if (tgt.type === 'livestream') {
          const mins = tgt.livestreamMinutes || 3;
          const tier = FLEXIBLE_LIVESTREAM_TIERS.find(t => t.minutes === mins) || {
            buyerPricePerEye: 1000,
            workerRewardPerEye: 400
          };
          const newLiveTask: LivestreamTaskItem = {
            id: `live_camp_${Date.now()}_${idx}`,
            channelName: campaignData.channelHandle + ' (Chiến Dịch Đang Chạy)',
            channelHandle: campaignData.channelHandle,
            channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            roomTitle: `🔴 ${tgt.label.toUpperCase()}: ${campaignData.channelHandle}`,
            currentViewers: 0,
            targetMinutes: mins,
            rewardPerMinute: Math.round(tier.workerRewardPerEye / mins),
            milestoneBonusCoins: tier.workerRewardPerEye,
            totalRewardCoins: tier.workerRewardPerEye,
            targetUrl: campaignData.targetUrl,
            status: 'live',
            category: 'TikTok Shop Flash Sale',
            hostFollowers: '100K+ Followers',
            requiredRank: 'Đồng',
            isLocked: false,
            dailyTierLevel: 1,
            tags: ['Mắt Xem Thật', `${mins} Phút`, 'Ưu Tiên Sàn']
          };
          setLivestreamTasks(prev => [newLiveTask, ...prev]);
        } else {
          const workerReward = Math.round(tgt.unitPriceXu * 0.4);
          const tType: TikTokTaskItem['type'] = 
            tgt.type === 'follow' ? 'follow' :
            tgt.type === 'watch' ? 'watch' :
            tgt.type === 'like' ? 'like' :
            tgt.type === 'comment' ? 'comment' :
            tgt.type === 'share' ? 'share' : 'like';

          const parsedMedia = parseMediaUrl(campaignData.targetUrl, campaignData.channelHandle);
          const subTask: TikTokTaskItem = {
            id: `task_dyn_${Date.now()}_${idx}`,
            title: `${tgt.label} - ${campaignData.channelHandle} (${tgt.targetQuantity.toLocaleString()} lượt)`,
            type: tType,
            rewardCoins: workerReward,
            rewardVND: `${workerReward.toLocaleString()}đ`,
            channelName: campaignData.channelHandle,
            channelHandle: campaignData.channelHandle,
            channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            targetUrl: campaignData.targetUrl,
            videoPreviewUrl: parsedMedia.streamUrl,
            requiresWatch: tType === 'watch',
            sampleComments: [
              'Ủng hộ kênh bạn nhé!',
              'Nội dung rất hay và chất lượng!',
              'Đã tương tác ủng hộ kênh!'
            ],
            totalSlots: tgt.targetQuantity,
            completedSlots: 0,
            remainingSlots: tgt.targetQuantity,
            guide: `Bấm thực hiện ${tgt.label.toLowerCase()} để nhận ngay +${workerReward.toLocaleString()} Xu vào ví.`,
            requirements: ['Tài khoản TikTok thật', 'Giữ tương tác tối thiểu 30 ngày'],
            status: 'open',
            createdAt: 'Vừa xong',
            campaignCategory: 'partner',
            partnerName: user.name || campaignData.channelHandle,
            partnerBadge: 'Combo Đa Mục Tiêu',
            isUrgent: true,
            audienceTargeting: campaignData.audienceTargeting,
            targetMatchScore: campaignData.audienceTargeting?.mode === 'niche_targeted' ? 100 : undefined
          };
          setTasks(prev => [subTask, ...prev]);

          const newAnn: PartnerCampaignAnnouncement = {
            id: `ann_${Date.now()}_${idx}`,
            partnerName: user.name || campaignData.channelHandle,
            campaignTitle: subTask.title,
            channelHandle: campaignData.channelHandle,
            totalSlots: tgt.targetQuantity,
            remainingSlots: tgt.targetQuantity,
            rewardCoins: workerReward,
            taskType: tType,
            taskId: subTask.id,
            createdAt: 'Vừa xong'
          };
          setPartnerAnnouncements(prev => [newAnn, ...prev]);
        }
      });
    } else {
      // Phân loại nhiệm vụ người làm rõ ràng
      const taskType: TikTokTaskItem['type'] = 
        campaignData.type === 'follow' ? 'follow' :
        campaignData.type === 'watch' ? 'watch' :
        campaignData.type === 'like' ? 'like' :
        campaignData.type === 'comment' ? 'comment' :
        campaignData.type === 'share' ? 'share' :
        campaignData.type === 'booking_review' ? 'review' : 'like';

      const parsedSingleMedia = parseMediaUrl(campaignData.targetUrl, campaignData.channelHandle);
      const newTask: TikTokTaskItem = {
        id: `task_dyn_${Date.now()}`,
        title: campaignData.title,
        type: taskType,
        rewardCoins: workerRewardPerAction,
        rewardVND: `${workerRewardPerAction.toLocaleString()}đ`,
        channelName: campaignData.channelHandle,
        channelHandle: campaignData.channelHandle,
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        targetUrl: campaignData.targetUrl,
        videoPreviewUrl: parsedSingleMedia.streamUrl,
        requiresWatch: taskType === 'watch',
        sampleComments: [
          'Ủng hộ video bạn nhé!',
          'Kênh làm nội dung rất đỉnh!',
          'Đã theo dõi và ủng hộ nhiệt tình!'
        ],
        totalSlots: campaignData.targetQuantity,
        completedSlots: 0,
        remainingSlots: campaignData.targetQuantity,
        guide: campaignData.instructions || `Bấm thực hiện nhiệm vụ để nhận ngay +${workerRewardPerAction.toLocaleString()} Xu vào ví.`,
        requirements: ['Tài khoản TikTok thật', 'Giữ tương tác tối thiểu 30 ngày'],
        status: 'open',
        createdAt: 'Vừa xong',
        campaignCategory: 'partner',
        partnerName: user.name || campaignData.channelHandle,
        partnerBadge: 'Doanh Nghiệp Đang Chạy',
        isUrgent: true,
        audienceTargeting: campaignData.audienceTargeting,
        targetMatchScore: campaignData.audienceTargeting?.mode === 'niche_targeted' ? 100 : undefined
      };
      setTasks(prev => [newTask, ...prev]);

      // Tạo thông báo công khai cho toàn bộ cộng đồng
      const newAnn: PartnerCampaignAnnouncement = {
        id: `ann_${Date.now()}`,
        partnerName: user.name || campaignData.channelHandle,
        campaignTitle: campaignData.title,
        channelHandle: campaignData.channelHandle,
        totalSlots: campaignData.targetQuantity,
        remainingSlots: campaignData.targetQuantity,
        rewardCoins: workerRewardPerAction,
        taskType: taskType,
        taskId: newTask.id,
        createdAt: 'Vừa xong'
      };
      setPartnerAnnouncements(prev => [newAnn, ...prev]);

      // Nếu là chiến dịch Livestream, đưa ngay vào danh sách Livestream Tasks
      const isLiveCampaign = 
        campaignData.type === 'livestream' || 
        campaignData.type === 'livestream_viewers' ||
        campaignData.type === 'mega_live' ||
        Boolean(campaignData.livestreamMinutes) ||
        (campaignData.targetUrl && campaignData.targetUrl.toLowerCase().includes('/live'));

      if (isLiveCampaign) {
        const mins = campaignData.livestreamMinutes || 3;
        const tier = FLEXIBLE_LIVESTREAM_TIERS.find(t => t.minutes === mins) || {
          buyerPricePerEye: 1000,
          workerRewardPerEye: 400
        };

        const newLiveTask: LivestreamTaskItem = {
          id: `live_camp_${Date.now()}`,
          channelName: campaignData.channelHandle + ' (Chiến Dịch Đang Chạy)',
          channelHandle: campaignData.channelHandle,
          channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          roomTitle: campaignData.title || `🔴 PHÒNG LIVE TIKTOK SHOP: ${campaignData.channelHandle}`,
          currentViewers: 0,
          targetMinutes: mins,
          rewardPerMinute: Math.round(tier.workerRewardPerEye / mins),
          milestoneBonusCoins: tier.workerRewardPerEye,
          totalRewardCoins: tier.workerRewardPerEye,
          targetUrl: campaignData.targetUrl,
          status: 'live',
          category: 'TikTok Shop Flash Sale',
          hostFollowers: '100K+ Followers',
          requiredRank: 'Đồng',
          isLocked: false,
          dailyTierLevel: 1,
          tags: ['Mắt Xem Thật', `${mins} Phút`, 'Ưu Tiên Sàn']
        };

        setLivestreamTasks(prev => [newLiveTask, ...prev]);
      }
    }

    const newTx: TransactionRecord = {
      id: `tx_camp_${Date.now()}`,
      type: 'spend',
      title: `Tạo chiến dịch "${campaignData.title}"`,
      amount: `-${rawBudget.toLocaleString()} Xu (-${rawBudget.toLocaleString()}đ)`,
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      createdCampaignsCount: prev.createdCampaignsCount + 1,
      transactions: [newTx, ...prev.transactions]
    }));

    setAdminData(prev => ({
      ...prev,
      activeCampaignsCount: prev.activeCampaignsCount + 1,
      campaignsQueue: [
        {
          id: newCampaign.id,
          client: user.name,
          type: `${newCampaign.targetQuantity} ${campaignData.type.toUpperCase()}`,
          quantity: newCampaign.targetQuantity,
          amount: newCampaign.budgetTotal,
          status: 'Đang chạy',
          date: 'Vừa xong'
        },
        ...prev.campaignsQueue
      ]
    }));

    showToast(`✅ Chiến dịch "${campaignData.title}" đã kích hoạt thành công và đưa vào hệ thống phân phối!`);
    return true;
  };

  // Mở khóa báo cáo đo lường chi tiết tệp khán giả chiến dịch (200.000 Xu cho người dùng, Miễn phí cho Admin)
  const unlockCampaignAnalytics = (campaignId: string): boolean => {
    const UNLOCK_FEE_XU = 200000;
    const isUserAdmin = user.isAdmin || user.email === 'quocthiencr90@gmail.com' || user.email === 'thienvuaapp@gmail.com';

    if (!isUserAdmin && user.avaliveCoins < UNLOCK_FEE_XU) {
      showToast(`⚠️ Bạn cần tối thiểu ${UNLOCK_FEE_XU.toLocaleString()} Xu để mở khóa Báo Cáo Đo Lường Chi Tiết!`);
      openDeposit();
      return false;
    }

    if (!isUserAdmin) {
      const newCoins = user.avaliveCoins - UNLOCK_FEE_XU;
      const newTx: TransactionRecord = {
        id: `tx_unlock_data_${Date.now()}`,
        type: 'spend',
        title: 'Mở khóa Báo Cáo Đo Lường Tệp Khán Giả Chiến Dịch (200.000 Xu)',
        amount: `-${UNLOCK_FEE_XU.toLocaleString()} Xu (-200.000đ)`,
        isPositive: false,
        date: 'Vừa xong',
        status: 'success'
      };
      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        transactions: [newTx, ...prev.transactions]
      }));
    }

    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          isAnalyticsUnlocked: true,
          demographicsReport: c.demographicsReport || {
            totalViewers: c.completedQuantity || 5000,
            realUserScore: 98.7,
            genderDistribution: { male: 38, female: 59, other: 3 },
            ageGroups: { '18-24': 45, '25-34': 38, '35-44': 12, '45+': 5 },
            topLocations: [
              { province: 'Hồ Chí Minh', percentage: 41, viewerCount: Math.round((c.completedQuantity || 5000) * 0.41) },
              { province: 'Hà Nội', percentage: 32, viewerCount: Math.round((c.completedQuantity || 5000) * 0.32) },
              { province: 'Đà Nẵng & Miền Trung', percentage: 15, viewerCount: Math.round((c.completedQuantity || 5000) * 0.15) },
              { province: 'Miền Tây & Tỉnh Khác', percentage: 12, viewerCount: Math.round((c.completedQuantity || 5000) * 0.12) }
            ],
            interestNiches: [
              { niche: 'Mỹ phẩm & Chăm sóc cá nhân', percentage: 84 },
              { niche: 'Thời trang & Mua sắm TikTok Shop', percentage: 78 },
              { niche: 'Công nghệ & Đời sống', percentage: 62 }
            ],
            engagementRate: 22.4,
            avgWatchSeconds: 38,
            peakLiveViewers: c.type === 'mega_live' || c.type === 'livestream' ? 3850 : undefined,
            generatedRevenueEstimateVND: '85.000.000đ',
            accuracyLevel: 'Chuẩn xác 100% đối soát từ KYC',
            lastUpdatedAt: 'Vừa xong'
          }
        };
      }
      return c;
    }));

    showToast(isUserAdmin ? '👑 [Admin] Đã mở khóa Báo Cáo Đo Lường Chi Tiết miễn phí!' : '✅ Đã mở khóa Báo Cáo Đo Lường Dữ Liệu Tệp Khán Giả (-200.000 Xu)!');
    return true;
  };

  // Đẩy chiến dịch lên TOP sàn (Phí 100.000 Xu để hoàn thành sớm)
  const boostCampaignToTop = (campaignId: string): boolean => {
    const BOOST_FEE_XU = 100000;
    const isUserAdmin = user.isAdmin || user.email === 'quocthiencr90@gmail.com' || user.email === 'thienvuaapp@gmail.com';

    if (!isUserAdmin && user.avaliveCoins < BOOST_FEE_XU) {
      showToast(`⚠️ Bạn cần tối thiểu ${BOOST_FEE_XU.toLocaleString()} Xu để Đẩy Top Chiến Dịch lên đầu sàn!`);
      openDeposit();
      return false;
    }

    if (!isUserAdmin) {
      const newCoins = user.avaliveCoins - BOOST_FEE_XU;
      const newTx: TransactionRecord = {
        id: `tx_boost_top_${Date.now()}`,
        type: 'spend',
        title: 'Phí Đẩy Top Chiến Dịch Lên Đầu Sàn (-100.000 Xu)',
        amount: `-${BOOST_FEE_XU.toLocaleString()} Xu (-100.000đ)`,
        isPositive: false,
        date: 'Vừa xong',
        status: 'success'
      };
      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        transactions: [newTx, ...prev.transactions]
      }));
    }

    // Đưa chiến dịch lên đầu danh sách campaigns và gán cờ isBoosted
    setCampaigns(prev => {
      const targetCamp = prev.find(c => c.id === campaignId);
      if (!targetCamp) return prev;
      const updatedCamp: CampaignItem = {
        ...targetCamp,
        isBoosted: true,
        boostedAt: 'Vừa xong',
        boostCount: (targetCamp.boostCount || 0) + 1
      };
      const remaining = prev.filter(c => c.id !== campaignId);
      return [updatedCamp, ...remaining];
    });

    // Đồng thời đẩy task tương ứng lên đầu danh sách tasks
    setTasks(prev => {
      const relatedTasks = prev.filter(t => t.id.includes(campaignId) || t.channelHandle === campaignId);
      const otherTasks = prev.filter(t => !t.id.includes(campaignId) && t.channelHandle !== campaignId);
      return [...relatedTasks.map(t => ({ ...t, isBoosted: true, isUrgent: true })), ...otherTasks];
    });

    showToast(`🚀 Chiến dịch đã được đẩy lên TOP 1 toàn sàn thành công (-100.000 Xu)! Tốc độ nhận tương tác sẽ tăng vọt.`);
    return true;
  };

  const approveCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'running' } : c));
    setAdminData(prev => ({
      ...prev,
      campaignsQueue: prev.campaignsQueue.map(q => q.id === campaignId ? { ...q, status: 'Đang chạy' } : q),
      pendingApprovalsCount: Math.max(0, prev.pendingApprovalsCount - 1)
    }));
    showToast(`✅ Đã phê duyệt và kích hoạt chiến dịch ${campaignId}!`);
  };

  const rejectCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'paused' } : c));
    setAdminData(prev => ({
      ...prev,
      campaignsQueue: prev.campaignsQueue.map(q => q.id === campaignId ? { ...q, status: 'Hoàn thành' } : q),
      pendingApprovalsCount: Math.max(0, prev.pendingApprovalsCount - 1)
    }));
    showToast(`Đã tạm dừng / từ chối chiến dịch ${campaignId}.`);
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    setTasks(prev => prev.filter(t => !t.id.includes(campaignId)));
    setLivestreamTasks(prev => prev.filter(l => !l.id.includes(campaignId)));
    showToast(`🗑️ Đã xóa vĩnh viễn chiến dịch ${campaignId} theo lệnh Admin!`);
  };

  // Hệ Thống Tự Động Hoàn Xu Cho Chiến Dịch Livestream Kết Thúc Sớm Hoặc Hủy
  const endAndRefundLivestreamCampaign = (campaignId: string, reason: string = 'Phiên live đã kết thúc'): { refundedCoins: number; message: string } => {
    const camp = campaigns.find(c => c.id === campaignId);
    if (!camp) return { refundedCoins: 0, message: 'Không tìm thấy chiến dịch' };

    const totalTarget = camp.targetQuantity || 1;
    const completed = camp.completedQuantity || 0;
    const remaining = Math.max(0, totalTarget - completed);

    // Tính đơn giá Xu mỗi lượt
    const totalBudgetXu = parseInt(camp.budgetTotal?.replace(/\D/g, '') || '0') || 0;
    const unitPriceXu = totalTarget > 0 ? Math.round(totalBudgetXu / totalTarget) : 0;
    const refundCoins = remaining * unitPriceXu;

    if (refundCoins > 0) {
      const newCoins = user.avaliveCoins + refundCoins;
      const newTx: TransactionRecord = {
        id: `tx_refund_live_${Date.now()}`,
        type: 'earn',
        title: `Hoàn Xu phiên Live kết thúc (${completed}/${totalTarget} mắt): +${refundCoins.toLocaleString()} Xu`,
        amount: `+${refundCoins.toLocaleString()} Xu`,
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => ({
        ...prev,
        avaliveCoins: newCoins,
        coinsValueVND: `${newCoins.toLocaleString()}đ`,
        transactions: [newTx, ...prev.transactions]
      }));
    }

    // Đánh dấu chiến dịch kết thúc
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: 'completed' } : c));
    setLivestreamTasks(prev => prev.map(l => l.id.includes(campaignId) ? { ...l, status: 'ended' } : l));

    const msg = refundCoins > 0 
      ? `✅ Đã kết thúc chiến dịch & tự động hoàn +${refundCoins.toLocaleString()} Xu còn dư (${remaining} mắt chưa nhận) về ví của bạn!`
      : `✅ Chiến dịch Livestream đã kết thúc toàn bộ mục tiêu!`;

    showToast(msg);
    return { refundedCoins: refundCoins, message: msg };
  };

  const cancelCampaignWithRefund = (campaignId: string): { refundedCoins: number; message: string } => {
    return endAndRefundLivestreamCampaign(campaignId, 'Người dùng hủy chiến dịch');
  };

  const deleteAdminUser = (userId: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
    showToast(`🗑️ Đã xóa vĩnh viễn tài khoản người dùng ${userId} theo lệnh Admin!`);
  };

  const createGrowthService = (pkg: GrowthServiceItem) => {
    setGrowthServices(prev => [pkg, ...prev]);
    showToast(`✅ Đã thêm mới gói dịch vụ "${pkg.title}" thành công!`);
  };

  const updateGrowthService = (pkg: GrowthServiceItem) => {
    setGrowthServices(prev => prev.map(p => p.id === pkg.id ? pkg : p));
    showToast(`✅ Đã cập nhật thông tin gói dịch vụ "${pkg.title}" thành công!`);
  };

  const deleteGrowthService = (pkgId: string) => {
    setGrowthServices(prev => prev.filter(p => p.id !== pkgId));
    showToast(`🗑️ Đã xóa gói dịch vụ ${pkgId} khỏi toàn bộ hệ thống!`);
  };

  const orderService = (service: GrowthServiceItem) => {
    openOrderModal(service);
  };

  // ==============================================================================
  // ESCROW SMART VAULT ACTIONS
  // ==============================================================================

  const createEscrowBooking = (data: Omit<EscrowBookingContract, 'id' | 'contractCode' | 'status' | 'createdAt'>): boolean => {
    const rawAmount = parseInt(data.totalEscrowAmount.replace(/\D/g, '')) || 0;

    if (user.avaliveCoins < rawAmount) {
      showToast(`❌ Số dư Xu không đủ để ký quỹ ${data.totalEscrowAmount}! Vui lòng nạp thêm Xu.`);
      return false;
    }

    const contractCode = `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newContract: EscrowBookingContract = {
      id: `esc_${Date.now()}`,
      contractCode,
      warrantyDays: 3,
      autoReleaseHoursLeft: 72,
      ...data,
      status: 'escrow_locked',
      createdAt: 'Vừa xong'
    };

    const newCoins = user.avaliveCoins - rawAmount;
    const newTx: TransactionRecord = {
      id: `tx_esc_${Date.now()}`,
      type: 'escrow_lock',
      title: `Khóa ký quỹ Escrow hợp đồng ${contractCode} (${data.kocHandle})`,
      amount: `-${data.totalEscrowAmount}`,
      isPositive: false,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    setEscrowBookings(prev => [newContract, ...prev]);

    setAdminData(prev => ({
      ...prev,
      totalEscrowLockedVND: `${(parseInt(prev.totalEscrowLockedVND.replace(/\D/g, '')) + rawAmount).toLocaleString()}đ`
    }));

    // Đồng bộ hợp đồng và biến động khóa Xu vào Supabase Cloud
    syncEscrowContractToSupabase(newContract);
    syncTokenLedgerToSupabase({
      userId: user.email || user.name,
      txType: 'escrow_lock',
      tokenAmount: 0,
      tokenBalanceAfter: newCoins,
      vndEquivalent: rawAmount,
      note: `Khóa ký quỹ bảo chứng Escrow hợp đồng ${contractCode} (${data.kocHandle})`
    });

    showToast(`🔒 Đã khóa ký quỹ an toàn ${data.totalEscrowAmount} vào Két Sàn Escrow & đồng bộ Supabase! Bảo hành nghiệm thu 3 ngày (72h) đảm bảo an toàn tuyệt đối cho đôi bên.`);
    return true;
  };

  const acceptEscrowBooking = (contractId: string) => {
    const signedDate = new Date().toLocaleDateString('vi-VN');
    setEscrowBookings(prev => prev.map(c => c.id === contractId ? { ...c, status: 'in_progress', kocSignedAt: signedDate } : c));
    showToast('Đã xác nhận ký điện tử và nhận hợp đồng Booking! Hợp đồng chính thức có hiệu lực 3 bên.');
  };

  const submitEscrowDemo = (contractId: string, demoUrl: string, note: string) => {
    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'demo_submitted',
          demoVideoUrl: demoUrl,
          demoNote: note,
          demoSubmittedAt: 'Vừa xong',
          warrantyDays: 3,
          autoReleaseHoursLeft: 72 // Thời gian bảo hành & nghiệm thu 3 ngày (72 giờ)
        };
      }
      return c;
    }));

    showToast('🎉 Đã nộp sản phẩm video demo lên sàn! Thời gian bảo hành & nghiệm thu 3 ngày (72h) bắt đầu tính.');
    closeSubmitDemoModal();
  };

  const approveEscrowDisburse = (contractId: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    const rawAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, '')) || 0;
    // Phí sàn trung gian 20% - KOC nhận 80%
    const platformFee = Math.round(rawAmount * 0.20);
    const kocPayout = rawAmount - platformFee;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'disbursed',
          disbursedAt: 'Vừa xong'
        };
      }
      return c;
    }));

    const newCoins = user.avaliveCoins + kocPayout;
    const newTx: TransactionRecord = {
      id: `tx_payout_${Date.now()}`,
      type: 'escrow_payout',
      title: `Thanh toán hợp đồng ${contract.contractCode} từ ${contract.clientName} (KOC nhận 80%)`,
      amount: `+${kocPayout.toLocaleString()} Xu (+${kocPayout.toLocaleString()}đ)`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    // Đồng bộ tất toán giải ngân lên Supabase Cloud
    syncEscrowContractToSupabase({
      ...contract,
      status: 'disbursed'
    });

    syncTokenLedgerToSupabase({
      userId: contract.kocHandle,
      txType: 'escrow_payout',
      tokenAmount: 0,
      tokenBalanceAfter: newCoins,
      vndEquivalent: kocPayout,
      note: `Tất toán giải ngân 80% hợp đồng ${contract.contractCode} (Phí sàn 20%: -${platformFee.toLocaleString()}đ)`
    });

    showToast(`💰 Nghiệm thu thành công & đồng bộ Supabase! KOC thực nhận 80% (+${kocPayout.toLocaleString()}đ). Phí sàn trung gian bảo chứng 20% (-${platformFee.toLocaleString()}đ).`);
  };

  const disputeEscrow = (contractId: string, reason: string) => {
    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'disputed',
          disputeReason: reason
        };
      }
      return c;
    }));

    showToast('Đã gửi yêu cầu khiếu nại tới Ban Trọng Tài Admin. Tiền ký quỹ đang được đóng băng an toàn!');
  };

  const adminResolveDispute = (contractId: string, resolution: 'release_to_koc' | 'refund_to_brand') => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    if (resolution === 'release_to_koc') {
      approveEscrowDisburse(contractId);
      showToast(`Admin đã phân xử: Giải ngân hợp đồng ${contract.contractCode} cho KOC!`);
    } else {
      setEscrowBookings(prev => prev.map(c => c.id === contractId ? { ...c, status: 'refunded' } : c));
      showToast(`Admin đã phân xử: Hoàn lại tiền ký quỹ hợp đồng ${contract.contractCode} cho bên thuê!`);
    }
  };

  const adminEnforceKocPenalty = (
    contractId: string, 
    level: 1 | 2 | 3 | 4, 
    reason: string, 
    refundToBrand: boolean = true
  ) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    setEscrowBookings(prev => prev.map(c => c.id === contractId ? {
      ...c,
      status: refundToBrand ? 'refunded' : c.status,
      disputeReason: `[CHẾ TÀI CẤP ${level}] ${reason}`
    } : c));

    if (level === 4) {
      showToast(`⛔ CHẾ TÀI CẤP 4: Khóa vĩnh viễn KOC ${contract.kocName}, tịch thu 100% số dư Xu bồi thường cho bên thuê!`);
    } else if (level === 3) {
      showToast(`🚨 CHẾ TÀI CẤP 3: Phạt gian lận mẫu KOC ${contract.kocName}! Đóng băng ví, bồi thường 100% mẫu + 100% hợp đồng.`);
    } else if (level === 2) {
      showToast(`⚠️ CHẾ TÀI CẤP 2: KOC ${contract.kocName} làm sơ sài, đình chỉ 14 ngày, phạt 50%-100% thù lao hợp đồng.`);
    } else {
      showToast(`⚠️ CHẾ TÀI CẤP 1: KOC ${contract.kocName} vi phạm nhẹ, yêu cầu sửa trong 48h, trừ 20% thù lao hợp đồng.`);
    }
  };

  // ==============================================================================
  // ESCROW ADVANCED: EXTENSION, REVIEW & RATING, FREEZE VAULT, DISPUTE & REFUND
  // ==============================================================================

  // 1. KOC Đề xuất xin gia hạn thời gian bàn giao (Yêu cầu sự đồng thuận 2 bên)
  const requestContractExtension = (contractId: string, days: number, reason: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          extensionRequested: true,
          extensionDays: days,
          extensionReason: reason,
          extensionStatus: 'pending'
        };
      }
      return c;
    }));

    sendContractChatMessage(
      contractId,
      'system',
      'Sàn TikTok Pro Escrow (Biên Bản Đề Xuất Gia Hạn)',
      `⏱️ [YÊU CẦU XIN GIA HẠN]: KOC (${contract.kocHandle}) đã gửi đề xuất xin gia hạn thêm +${days} ngày. Lý do: "${reason}".\n⚠️ LƯU Ý PHÁP LÝ: Quy định Sàn yêu cầu sự đồng thuận từ Bên Thuê (${contract.clientName}). Nếu Bên Thuê không đồng thuận, KOC phải bàn giao đúng hạn ban đầu, nếu không sẽ bị phạt trễ hẹn theo quy chế Sàn!`
    );

    showToast(`⏱️ Đã gửi yêu cầu gia hạn +${days} ngày cho Bên Thuê xác nhận!`);
  };

  // 2. Bên Thuê Phản hồi yêu cầu gia hạn (Đồng ý hoặc Từ chối)
  const respondToContractExtension = (contractId: string, accept: boolean, responseNote?: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract || !contract.extensionDays) return;

    const days = contract.extensionDays;

    if (accept) {
      setEscrowBookings(prev => prev.map(c => {
        if (c.id === contractId) {
          const newDeadlineDays = (c.deadlineDays || 3) + days;
          return {
            ...c,
            deadlineDays: newDeadlineDays,
            deliveryDeadlineDate: `Đã gia hạn +${days} ngày (Tổng ${newDeadlineDays} ngày)`,
            extensionRequested: false,
            extensionStatus: 'accepted',
            extensionHistory: [
              ...(c.extensionHistory || []),
              {
                requestedAt: 'Hôm nay',
                days: days,
                reason: c.extensionReason || 'Xin thêm thời gian hoàn thiện sản phẩm',
                status: 'accepted',
                resolvedAt: 'Vừa xong',
                responseNote: responseNote || 'Bên Thuê đã chấp thuận đồng thuận'
              }
            ]
          };
        }
        return c;
      }));

      sendContractChatMessage(
        contractId,
        'system',
        'Sàn TikTok Pro Escrow (Đồng Thuận Gia Hạn)',
        `✅ [ĐỒNG THUẬN GIA HẠN THÀNH CÔNG]: Bên Thuê (${contract.clientName}) đã CHẤP THUẬN gia hạn thêm +${days} ngày. Hạn chót mới đã được hệ thống cập nhật hợp lệ. KOC tiếp tục sản xuất đúng cam kết không bị phạt.`
      );

      showToast(`✅ Bạn đã chấp thuận gia hạn thêm +${days} ngày cho KOC!`);
    } else {
      setEscrowBookings(prev => prev.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            extensionRequested: false,
            extensionStatus: 'rejected',
            extensionHistory: [
              ...(c.extensionHistory || []),
              {
                requestedAt: 'Hôm nay',
                days: days,
                reason: c.extensionReason || '',
                status: 'rejected',
                resolvedAt: 'Vừa xong',
                responseNote: responseNote || 'Bên Thuê từ chối gia hạn, yêu cầu đúng tiến độ ban đầu'
              }
            ]
          };
        }
        return c;
      }));

      sendContractChatMessage(
        contractId,
        'system',
        'Sàn TikTok Pro Escrow (Từ Chối Gia Hạn)',
        `⚠️ [TỪ CHỐI GIA HẠN]: Bên Thuê (${contract.clientName}) KHÔNG ĐỒNG Ý gia hạn thời gian. Lý do: "${responseNote || 'Yêu cầu giữ đúng tiến độ hợp đồng'}". KOC phải bàn giao đúng hạn để tránh bị phạt trễ hạn.`
      );

      showToast(`⚠️ Đã từ chối gia hạn. KOC được yêu cầu bàn giao đúng hạn.`);
    }
  };

  // 3. Bên Thuê Nghiệm Thu & Đánh Giá 1-5 Sao trước khi tự động giải ngân 80% KOC
  const approveEscrowWithReview = (contractId: string, rating: number, review: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    const rawAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, '')) || 0;
    const platformFee = Math.round(rawAmount * 0.20);
    const kocPayout = rawAmount - platformFee;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'disbursed',
          disbursedAt: 'Vừa xong',
          clientRating: rating,
          clientReview: review,
          clientApprovedAt: 'Vừa xong'
        };
      }
      return c;
    }));

    const newCoins = user.avaliveCoins + kocPayout;
    const newTx: TransactionRecord = {
      id: `tx_payout_${Date.now()}`,
      type: 'escrow_payout',
      title: `Nghiệm thu hợp đồng ${contract.contractCode} từ ${contract.clientName} (KOC nhận 80% • Đánh giá ${rating}⭐)`,
      amount: `+${kocPayout.toLocaleString()} Xu (+${kocPayout.toLocaleString()}đ)`,
      isPositive: true,
      date: 'Vừa xong',
      status: 'success'
    };

    setUser(prev => ({
      ...prev,
      avaliveCoins: newCoins,
      coinsValueVND: `${newCoins.toLocaleString()}đ`,
      transactions: [newTx, ...prev.transactions]
    }));

    sendContractChatMessage(
      contractId,
      'system',
      'Sàn TikTok Pro Escrow (Nghiệm Thu & Tất Toán 80/20)',
      `🎉 [NGHIỆM THU & ĐÁNH GIÁ THÀNH CÔNG]: Bên Thuê (${contract.clientName}) đã bấm XÁC NHẬN NGHIỆM THU và đánh giá ${rating}⭐ ("${review}"). Két Sàn đã tự động giải ngân 80% (${kocPayout.toLocaleString()}đ) về ví KOC và thu 20% (${platformFee.toLocaleString()}đ) phí bảo chứng trung gian. Hợp đồng hoàn tất mỹ mãn!`
    );

    triggerFireworks({
      type: 'escrow_payout',
      badge: `🤝 TẤT TOÁN HỢP ĐỒNG ESCROW 3 BÊN • ${contract.contractCode}`,
      title: 'CHÚC MỪNG QUYẾT TOÁN THÀNH CÔNG HỢP ĐỒNG!',
      subtitle: `${contract.title}`,
      rewardText: `+${kocPayout.toLocaleString()} XU THÙ LAO (80%)`,
      message: `Hợp đồng giữa Bên Thuê (${contract.clientName}) và KOC (${contract.kocName}) đã được nghiệm thu và đánh giá ${rating}⭐ xuất sắc. Két Smart Vault đã giải ngân chuẩn xác 80% cho KOC và 20% phí sàn bảo chứng. Chúc mối quan hệ hợp tác của 3 bên ngày càng phát triển bền vững!`
    });
  };

  // 4. Niêm Phong Két Cọc Tạm Thời (Freeze Escrow Vault)
  const freezeEscrowContract = (contractId: string, reason: string, frozenBy: 'client' | 'koc') => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          freezeStatus: frozenBy === 'client' ? 'frozen_by_client' : 'frozen_by_koc',
          freezeReason: reason
        };
      }
      return c;
    }));

    sendContractChatMessage(
      contractId,
      'system',
      'Sàn TikTok Pro Escrow (Niêm Phong Khẩn Cấp)',
      `🔒 [NIÊM PHONG KÉT CỌC]: ${frozenBy === 'client' ? 'Bên Thuê' : 'KOC'} đã kích hoạt lệnh NIÊM PHONG TIỀN CỌC. Toàn bộ tiền cọc ${contract.totalEscrowAmount} được khóa cứng trong két Sàn, tạm ngưng đếm ngược 72h tự động giải ngân để xử lý sự cố: "${reason}". Hồ sơ đã chuyển đến Hội đồng Trọng tài Sàn.`
    );

    showToast(`🔒 Đã niêm phong tiền cọc hợp đồng ${contract.contractCode}! Tiền được khóa an toàn 100%.`);
  };

  // 5. Yêu Cầu Chỉnh Sửa Video (Revision Request - Tối đa 2 lần)
  const requestVideoRevision = (contractId: string, revisionNotes: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    const revNum = (contract.revisionCount || 0) + 1;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'in_progress',
          revisionCount: revNum,
          revisionNote: revisionNotes,
          autoReleaseHoursLeft: 72
        };
      }
      return c;
    }));

    sendContractChatMessage(
      contractId,
      'system',
      'Sàn TikTok Pro Escrow (Yêu Cầu Chỉnh Sửa)',
      `🔄 [YÊU CẦU CHỈNH SỬA VIDEO (Lần ${revNum}/2)]: Bên Thuê đã gửi yêu cầu chỉnh sửa: "${revisionNotes}". KOC vui lòng chỉnh sửa theo kịch bản và nộp lại link demo mới.`
    );

    showToast(`🔄 Đã gửi yêu cầu chỉnh sửa (Lần ${revNum}/2) cho KOC!`);
  };

  // 6. Yêu Cầu Hoàn Tiền 100% Cọc (Refund Request)
  const requestRefundEscrow = (contractId: string, refundReason: string) => {
    const contract = escrowBookings.find(c => c.id === contractId);
    if (!contract) return;

    setEscrowBookings(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'disputed',
          refundRequested: true,
          refundReason: refundReason,
          disputeReason: `Yêu cầu hoàn tiền 100%: ${refundReason}`
        };
      }
      return c;
    }));

    sendContractChatMessage(
      contractId,
      'system',
      'Sàn TikTok Pro Escrow (Trọng Tài Hoàn Tiền)',
      `🚨 [YÊU CẦU HOÀN TIỀN CỌC 100%]: Bên Thuê yêu cầu hoàn cọc với lý do: "${refundReason}". Hồ sơ đã chuyển đến Hội đồng Trọng tài Sàn. KOC có 24h để gửi phản hồi đối soát. Toàn bộ tiền cọc đang được bảo toàn an toàn 100%.`
    );

    showToast(`🚨 Đã gửi yêu cầu hoàn tiền 100% tới Hội Đồng Trọng Tài Sàn!`);
  };

  // ==============================================================================
  // ADMIN GRANT CAPABILITIES
  // ==============================================================================

  const isCurrentUser = (targetIdOrEmail: string, targetUser?: AdminUserManagementItem) => {
    const cleanTarget = targetIdOrEmail.toLowerCase().replace(/^@/, '');
    const userEmail = (user.email || '').toLowerCase();
    const userHandle = (user.handle || '').toLowerCase().replace(/^@/, '');
    const userTiktok = (user.tiktokConnected || '').toLowerCase().replace(/^@/, '');
    
    if (targetUser) {
      const tEmail = (targetUser.email || '').toLowerCase();
      const tHandle = (targetUser.handle || '').toLowerCase().replace(/^@/, '');
      if (tEmail && (tEmail === userEmail || tEmail === userHandle)) return true;
      if (tHandle && (tHandle === userHandle || tHandle === userTiktok)) return true;
    }
    return cleanTarget === userEmail || cleanTarget === userHandle || cleanTarget === userTiktok || targetIdOrEmail === user.id;
  };

  const adminToggleUserStatus = (userId: string) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        const nextStatus = u.status === 'active' ? 'banned' : 'active';
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    if (matched) {
      setUser(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'banned' : 'active'
      }));
    }
    showToast('Đã cập nhật trạng thái tài khoản người dùng!');
  };

  const adminAdjustUserCoins = (userId: string, amount: number) => {
    let matchedUser: AdminUserManagementItem | null = null;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        const newBalance = Math.max(0, u.coinsBalance + amount);
        if (isCurrentUser(userId, u)) matchedUser = u;
        return { ...u, coinsBalance: newBalance };
      }
      return u;
    }));

    if (matchedUser || isCurrentUser(userId)) {
      setUser(prev => {
        const newCoins = Math.max(0, prev.avaliveCoins + amount);
        const newTx: TransactionRecord = {
          id: `tx_admin_${Date.now()}`,
          type: amount >= 0 ? 'deposit' : 'spend',
          title: `Quản Trị Viên (Admin) điều chỉnh: ${amount >= 0 ? '+' : ''}${amount.toLocaleString()} Xu`,
          amount: `${amount >= 0 ? '+' : ''}${amount.toLocaleString()} Xu (${Math.abs(amount).toLocaleString()}đ)`,
          isPositive: amount >= 0,
          date: 'Vừa xong',
          status: 'success'
        };
        return {
          ...prev,
          avaliveCoins: newCoins,
          coinsValueVND: `${newCoins.toLocaleString()}đ`,
          transactions: [newTx, ...prev.transactions]
        };
      });
    }

    showToast(`Đã điều chỉnh ${amount > 0 ? '+' : ''}${amount.toLocaleString()} Xu cho tài khoản!`);
  };

  const adminGrantPackage = (userId: string, packageItem: GrowthServiceItem) => {
    let matchedUser: AdminUserManagementItem | null = null;
    let createdOrder: ServiceOrder | null = null;

    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        const newOrder: ServiceOrder = {
          id: `ord_grant_${Date.now()}`,
          packageId: packageItem.id,
          packageTitle: packageItem.title,
          category: packageItem.category,
          price: packageItem.price,
          targetUrl: u.tiktokConnected || `@${u.handle}`,
          targetQuantity: packageItem.targetQuantity,
          completedQuantity: 0,
          status: 'running',
          createdAt: 'Vừa xong'
        };
        createdOrder = newOrder;
        if (isCurrentUser(userId, u)) matchedUser = u;
        return {
          ...u,
          purchasedPackagesCount: (u.purchasedPackagesCount || 0) + 1,
          orders: [newOrder, ...(u.orders || [])]
        };
      }
      return u;
    }));

    if ((matchedUser || isCurrentUser(userId)) && createdOrder) {
      setUser(prev => {
        const newTx: TransactionRecord = {
          id: `tx_grant_${Date.now()}`,
          type: 'deposit',
          title: `🎁 Admin cấp đặc quyền: ${packageItem.title} (Miễn Phí)`,
          amount: `0đ (Giá gốc: ${packageItem.price})`,
          isPositive: true,
          date: 'Vừa xong',
          status: 'success'
        };
        return {
          ...prev,
          purchasedPackagesCount: (prev.purchasedPackagesCount || 0) + 1,
          myOrders: [createdOrder!, ...(prev.myOrders || [])],
          transactions: [newTx, ...prev.transactions]
        };
      });
    }

    showToast(`👑 Admin đã cấp đặc quyền gói "${packageItem.title}" miễn phí cho tài khoản!`);
  };

  const adminAdjustUserFollowers = (userId: string, count: number) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, tiktokFollowers: Math.max(0, u.tiktokFollowers + count) };
      }
      return u;
    }));

    if (matched || isCurrentUser(userId)) {
      setUser(prev => ({
        ...prev,
        tiktokFollowers: Math.max(0, (prev.tiktokFollowers || 0) + count)
      }));
    }

    showToast(`Đã cộng +${count.toLocaleString()} Follower cho kênh của người dùng!`);
  };

  const adminChangeUserRank = (userId: string, rank: string) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, rankLevel: rank };
      }
      return u;
    }));

    if (matched || isCurrentUser(userId)) {
      setUser(prev => ({
        ...prev,
        rankLevel: rank
      }));
    }

    showToast(`Đã nâng hạng tài khoản lên bậc ${rank}!`);
  };

  const adminAddUser = (userData: Partial<AdminUserManagementItem>): AdminUserManagementItem => {
    const newId = userData.id || `usr_admin_${Date.now()}`;
    const email = (userData.email || `user_${Date.now()}@gmail.com`).trim();
    const handleClean = (userData.handle || email.split('@')[0]).replace(/^@/, '');
    const newUser: AdminUserManagementItem = {
      id: newId,
      name: userData.name || email.split('@')[0],
      handle: handleClean,
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      email,
      phone: userData.phone || '0988888888',
      tiktokConnected: userData.tiktokConnected || `@${handleClean}`,
      tiktokFollowers: userData.tiktokFollowers || 1000,
      isTikTokVerified: userData.isTikTokVerified ?? true,
      rankLevel: userData.rankLevel || 'Đồng',
      coinsBalance: userData.coinsBalance || 50000,
      tokenBalance: userData.tokenBalance || 50,
      completedTasksCount: userData.completedTasksCount || 0,
      createdCampaignsCount: userData.createdCampaignsCount || 0,
      purchasedPackagesCount: userData.purchasedPackagesCount || 0,
      escrowLockedAmountVND: userData.escrowLockedAmountVND || '0đ',
      status: userData.status || 'active',
      kycStatus: userData.kycStatus || 'verified',
      joinedDate: 'Vừa xong',
      orders: userData.orders || []
    };
    setAdminUsers(prev => [newUser, ...prev]);
    showToast(`✅ Đã thêm tài khoản "${newUser.email}" vào hệ thống!`);
    return newUser;
  };

  const adminUpdateUser = (userId: string, data: Partial<AdminUserManagementItem>) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, ...data };
      }
      return u;
    }));

    if (matched || isCurrentUser(userId)) {
      setUser(prev => ({
        ...prev,
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.handle ? { handle: data.handle } : {}),
        ...(data.tiktokConnected ? { tiktokConnected: data.tiktokConnected } : {}),
        ...(data.tiktokFollowers !== undefined ? { tiktokFollowers: data.tiktokFollowers } : {}),
        ...(data.rankLevel ? { rankLevel: data.rankLevel } : {}),
        ...(data.coinsBalance !== undefined ? { avaliveCoins: data.coinsBalance, coinsValueVND: `${data.coinsBalance.toLocaleString()}đ` } : {}),
        ...(data.kycStatus ? { kycStatus: data.kycStatus } : {}),
        ...(data.status ? { status: data.status } : {})
      }));
    }

    showToast('✅ Đã lưu cập nhật thông tin tài khoản!');
  };

  const adminDeleteUser = (userId: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== userId && u.email.toLowerCase() !== userId.toLowerCase()));
    showToast('🗑️ Đã xóa tài khoản khỏi hệ thống!');
  };

  const adminUpdateGrantedOrder = (userId: string, orderId: string, data: Partial<ServiceOrder>) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        const updatedOrders = (u.orders || []).map(ord => ord.id === orderId ? { ...ord, ...data } : ord);
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, orders: updatedOrders };
      }
      return u;
    }));

    if (matched || isCurrentUser(userId)) {
      setUser(prev => ({
        ...prev,
        myOrders: (prev.myOrders || []).map(ord => ord.id === orderId ? { ...ord, ...data } : ord)
      }));
    }

    showToast('✅ Đã cập nhật gói dịch vụ của người dùng!');
  };

  const adminDeleteGrantedOrder = (userId: string, orderId: string) => {
    let matched = false;
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
        const updatedOrders = (u.orders || []).filter(ord => ord.id !== orderId);
        if (isCurrentUser(userId, u)) matched = true;
        return { ...u, orders: updatedOrders, purchasedPackagesCount: Math.max(0, (u.purchasedPackagesCount || 1) - 1) };
      }
      return u;
    }));

    if (matched || isCurrentUser(userId)) {
      setUser(prev => ({
        ...prev,
        purchasedPackagesCount: Math.max(0, (prev.purchasedPackagesCount || 1) - 1),
        myOrders: (prev.myOrders || []).filter(ord => ord.id !== orderId)
      }));
    }

    showToast('🗑️ Đã xóa gói dịch vụ được cấp!');
  };



  // Referral bonus claim & task verification
  const claimReferralReward = (refId: string): boolean => {
    let claimed = false;
    setAffiliateData(prev => {
      const item = prev.referralsList.find(r => r.id === refId);
      if (!item || !item.hasCompletedTask || item.isClaimed) return prev;

      claimed = true;
      const updatedList = prev.referralsList.map(r => r.id === refId ? { ...r, isClaimed: true } : r);
      return {
        ...prev,
        referralBonusCoinsTotal: prev.referralBonusCoinsTotal + REFERRAL_BONUS_COINS,
        referralsList: updatedList
      };
    });

    if (claimed) {
      const newTx: TransactionRecord = {
        id: `tx_ref_${Date.now()}`,
        type: 'earn',
        title: `Nhận thưởng Xu giới thiệu bạn bè hoàn thành nhiệm vụ`,
        amount: `+${REFERRAL_BONUS_COINS.toLocaleString()} Xu (+${REFERRAL_BONUS_COINS.toLocaleString()}đ)`,
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => {
        const nextCoins = prev.avaliveCoins + REFERRAL_BONUS_COINS;
        return {
          ...prev,
          avaliveCoins: nextCoins,
          coinsValueVND: `${nextCoins.toLocaleString()}đ`,
          transactions: [newTx, ...prev.transactions]
        };
      });

      // Đồng bộ biến động thưởng giới thiệu vào Supabase Cloud
      syncTokenLedgerToSupabase({
        userId: user.email || user.name,
        txType: 'referral_bonus',
        tokenAmount: 0,
        tokenBalanceAfter: user.avaliveCoins + REFERRAL_BONUS_COINS,
        vndEquivalent: REFERRAL_BONUS_COINS,
        note: `Nhận thưởng Xu giới thiệu bạn bè (${refId}) hoàn thành nhiệm vụ (+${REFERRAL_BONUS_COINS.toLocaleString()} Xu)`
      });

      showToast(`🎉 Nhận thành công +${REFERRAL_BONUS_COINS.toLocaleString()} Xu thưởng giới thiệu & đồng bộ Supabase!`);
      return true;
    }
    return false;
  };

  const simulateFriendTaskAction = (refId: string, taskType = 'Follow kênh @zenskin & Xem video 15s') => {
    let activated = false;
    setAffiliateData(prev => {
      const item = prev.referralsList.find(r => r.id === refId);
      if (!item || item.hasCompletedTask) return prev;

      activated = true;
      const updatedList = prev.referralsList.map(r => {
        if (r.id === refId) {
          return {
            ...r,
            hasCompletedTask: true,
            taskCompletedType: taskType,
            status: 'Đã kích hoạt • Đã nhận +5,000 Xu',
            isClaimed: true
          };
        }
        return r;
      });

      return {
        ...prev,
        referralBonusCoinsTotal: prev.referralBonusCoinsTotal + REFERRAL_BONUS_COINS,
        referralPendingCoins: Math.max(0, prev.referralPendingCoins - REFERRAL_BONUS_COINS),
        referralActivatedCount: prev.referralActivatedCount + 1,
        referralPendingCount: Math.max(0, prev.referralPendingCount - 1),
        referralsList: updatedList
      };
    });

    if (activated) {
      const newTx: TransactionRecord = {
        id: `tx_ref_auto_${Date.now()}`,
        type: 'earn',
        title: `Thưởng giới thiệu: Bạn bè đã hoàn thành nhiệm vụ (${taskType})`,
        amount: `+${REFERRAL_BONUS_COINS.toLocaleString()} Xu (+${REFERRAL_BONUS_COINS.toLocaleString()}đ)`,
        isPositive: true,
        date: 'Vừa xong',
        status: 'success'
      };

      setUser(prev => {
        const nextCoins = prev.avaliveCoins + REFERRAL_BONUS_COINS;
        return {
          ...prev,
          avaliveCoins: nextCoins,
          coinsValueVND: `${nextCoins.toLocaleString()}đ`,
          transactions: [newTx, ...prev.transactions]
        };
      });

      // Đồng bộ biến động vào Supabase Cloud
      syncTokenLedgerToSupabase({
        userId: user.email || user.name,
        txType: 'referral_activated',
        tokenAmount: 0,
        tokenBalanceAfter: user.avaliveCoins + REFERRAL_BONUS_COINS,
        vndEquivalent: REFERRAL_BONUS_COINS,
        note: `Bạn bè kích hoạt nhiệm vụ (${taskType}) -> Nhận thưởng +${REFERRAL_BONUS_COINS.toLocaleString()} Xu`
      });

      showToast(`🎉 Xác thực thành công: Bạn bè đã làm 1 nhiệm vụ thật! Cộng ngay +${REFERRAL_BONUS_COINS.toLocaleString()} Xu vào ví & đồng bộ Supabase!`);
    }
  };

  return (
    <TikTokAppContext.Provider
      value={{
        user,
        tasks,
        livestreamTasks,
        campaigns,
        growthServices,
        affiliateData,
        adminData,
        tokenomics,
        analytics,
        escrowBookings,
        adminUsers,
        toastMessage,
        showToast,
        isAuthenticated,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithGoogleOAuth,
        loginWithEmail,
        logout,
        commissionSettings,
        updateCommissionSettings,
        isKocModalOpen,
        openKocModal,
        closeKocModal,
        registerKocProfile,
        kocApplications,
        isOrderModalOpen,
        selectedPackageForOrder,
        openOrderModal,
        closeOrderModal,
        purchaseServicePackage,
        runnerTask,
        isRunnerOpen,
        openRunner,
        closeRunner,
        isFeedRunnerOpen,
        feedRunnerFilter,
        feedRunnerTargetId,
        tasksActiveTab,
        setTasksActiveTab,
        setFeedRunnerTargetId,
        setFeedRunnerFilter,
        openFeedRunner,
        closeFeedRunner,
        activeLiveTask,
        isLiveRunnerOpen,
        openLiveRunner,
        closeLiveRunner,
        isLuckyWheelOpen,
        openLuckyWheel,
        closeLuckyWheel,
        spinLuckyWheel,
        deductSpinFee,
        consumeFreeSpin,
        grantFreeSpin,
        awardLuckyWheelPrize,
        isConnectOpen,
        openConnect,
        closeConnect,
        isWithdrawOpen,
        openWithdraw,
        closeWithdraw,
        isDepositOpen,
        openDeposit,
        closeDeposit,
        isSepayModalOpen,
        sepayCheckoutItem,
        openSepayModal,
        closeSepayModal,
        isPolicyOpen,
        openPolicy,
        closePolicy,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        activeEscrowContract,
        isSubmitDemoModalOpen,
        openSubmitDemoModal,
        closeSubmitDemoModal,
        isShareModalOpen,
        shareVideoData,
        openShareModal,
        closeShareModal,
        updateConnectedTikTok,
        isPwaModalOpen,
        openPwaModal,
        closePwaModal,
        completeTask,
        watchLivestreamMinute,
        completeLivestreamSession,
        getUserLiveQuota,
        claimTaskAction,
        activeBroadcastNotification,
        dismissBroadcastNotification,
        broadcastLiveSession,
        interactWithLiveBroadcast,
        isBuyerPortalOpen,
        openBuyerPortal,
        closeBuyerPortal,
        // Bảng Điện LED Toàn Sàn (Horizontal Marquee Ticker)
        marqueeTickerList,
        marqueeHistoryList,
        isMarqueeBoostModalOpen,
        selectedMarqueeBoostTarget,
        openMarqueeBoostModal,
        closeMarqueeBoostModal,
        isMarqueeHistoryModalOpen,
        openMarqueeHistoryModal,
        closeMarqueeHistoryModal,
        boostToMarquee,
        endMarqueeItem,
        checkInDaily,
        connectTikTok,
        disconnectTikTok,
        connectFacebook,
        disconnectFacebook,
        connectYoutube,
        disconnectYoutube,
        deposit,
        withdraw,
        saveBankInfo,
        createCampaign,
        unlockCampaignAnalytics,
        boostCampaignToTop,
        approveCampaign,
        rejectCampaign,
        deleteCampaign,
        endAndRefundLivestreamCampaign,
        cancelCampaignWithRefund,
        deleteAdminUser,
        createGrowthService,
        updateGrowthService,
        deleteGrowthService,
        orderService,
        convertTokenToCoins,
        createEscrowBooking,
        acceptEscrowBooking,
        submitEscrowDemo,
        approveEscrowDisburse,
        disputeEscrow,
        adminResolveDispute,
        adminEnforceKocPenalty,
        // Escrow Advanced
        requestContractExtension,
        respondToContractExtension,
        approveEscrowWithReview,
        freezeEscrowContract,
        requestVideoRevision,
        requestRefundEscrow,
        contractChats,
        sendContractChatMessage,
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
        // KYC Verification
        isKycModalOpen,
        openKycModal,
        closeKycModal,
        submitKyc,
        adminApproveKyc,
        adminRejectKyc,
        kycRequests,
        // App Marketplace (App Kiếm Tiền)
        softwareApps,
        addSoftwareApp,
        updateSoftwareApp,
        deleteSoftwareApp,
        myAppLicenses,
        buySoftwareApp,
        // Token Management & Sinks (Cung cấp bởi sàn)
        tokenLedger,
        tokenSupplyConfig,
        adminMintTreasuryTokens,
        adminBurnTreasuryTokens,
        adminSetInitialSupply,
        adminResetTokenLedgerAndSupply,
        convertVndToToken,
        convertTokenToVnd,
        orderServiceWithToken,
        // Referral & Anti-Spam Verification
        claimReferralReward,
        simulateFriendTaskAction,
        // Partner Announcements
        partnerAnnouncements,
        dismissPartnerAnnouncement,
        // Ưu tiên Đẩy Top Chiến Dịch (-50.000 Xu thu về sàn)
        boostCampaign,
        platformBoostRevenue,
        // Facebook Community Friends & Messenger Chat
        friends,
        chatConversations,
        activeChatUser,
        openChatWithUser,
        closeChat,
        toggleFriendship,
        sendChatMessage,
        // Lịch sử nhiệm vụ & Chống trùng lặp
        userCompletedActions,
        // Thông báo tài khoản người dùng
        userNotifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        // Báo cáo hoạt động chi tiết
        getActivityReport,
        // Hệ Thống Bảo Mật An Toàn Tuyệt Đối 7 Lớp & Giới Hạn 5 Tài Khoản / IP
        clientIp,
        maxAccountsPerIp: MAX_TIKTOK_ACCOUNTS_PER_IP,
        connectedAccountsOnIp,
        canConnectMoreAccounts,
        security7Layers: SECURITY_7_LAYERS,
        securityAuditLogs: SECURITY_AUDIT_LOGS,
        switchActiveTikTokAccount,
        removeAccountFromIp,
        // Hệ Thống Nhiệm Vụ Sàn & Chuỗi Streak (Ngày - Tuần - Tháng)
        userMissions,
        missionStreak,
        recordMissionProgress,
        claimMissionReward,
        claimAllCategoryMissions,
        claimStreakReward,
        // Modal Pháo Hoa Chúc Mừng Toàn Hệ Thống
        fireworksData,
        isFireworksOpen,
        triggerFireworks,
        closeFireworks
      }}
    >
      {children}
    </TikTokAppContext.Provider>
  );
};

export const useTikTokApp = () => {
  const context = useContext(TikTokAppContext);
  if (!context) {
    throw new Error('useTikTokApp must be used within a TikTokAppProvider');
  }
  return context;
};
