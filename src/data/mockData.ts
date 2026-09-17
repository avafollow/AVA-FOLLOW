import { 
  TikTokTaskItem, 
  GrowthServiceItem, 
  CampaignItem, 
  AffiliateStats, 
  AffiliateTierInfo,
  AdminDashboardData, 
  UserProfileWallet,
  LivestreamTaskItem,
  TokenomicsData,
  UserAnalyticsData,
  SoftwareAppItem,
  TokenLedgerRecord,
  PartnerCampaignAnnouncement,
  UserNotificationItem,
  UserTaskActionHistory,
  CommunityFriendItem,
  ChatMessageItem
} from '../types';

export const EMPTY_GUEST_USER: UserProfileWallet = {
  name: '',
  handle: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  email: '',
  role: 'Khách Vãng Lai',
  tiktokConnected: '',
  tiktokFollowers: 0,
  tiktokAvatar: '',
  isTikTokVerified: false,
  facebookConnected: '',
  isFacebookVerified: false,
  facebookFollowers: 0,
  facebookAvatar: '',
  youtubeConnected: '',
  isYoutubeVerified: false,
  youtubeSubscribers: 0,
  youtubeAvatar: '',
  bioVerificationCode: '',
  isNewUserBonusClaimed: false,
  avaliveCoins: 0,
  coinsValueVND: '0đ',
  tokenBalance: 0,
  usdtBalance: 0,
  fiatVND: '0đ',
  completedTasksCount: 0,
  dailyTasksCompleted: 0,
  dailyTasksLimit: 100,
  luckyWheelFreeSpins: 0,
  createdCampaignsCount: 0,
  rankLevel: 'Đồng',
  kycStatus: 'unverified',
  isAdmin: false,
  hasAllPermissions: false,
  isWhitelisted: false,
  canRunAnyCampaign: false,
  canFollowCrossUnrestricted: false,
  grantedCoinsTotal: 0,
  grantedPackagesTotal: 0,
  transactions: [],
  myOrders: [],
  myAppLicenses: []
};

export const USER_PROFILE_WALLET: UserProfileWallet = {
  name: 'Người Dùng AVA FOLLOW',
  handle: '@creator',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  email: '',
  role: 'Nhà Sáng Tạo AVA FOLLOW',
  tiktokConnected: '',
  tiktokFollowers: 0,
  tiktokAvatar: '',
  isTikTokVerified: false,
  facebookConnected: '',
  isFacebookVerified: false,
  facebookFollowers: 0,
  facebookAvatar: '',
  youtubeConnected: '',
  isYoutubeVerified: false,
  youtubeSubscribers: 0,
  youtubeAvatar: '',
  bioVerificationCode: 'AVA-VERIFY-8899',
  isNewUserBonusClaimed: false,
  avaliveCoins: 0,
  coinsValueVND: '0đ',
  tokenBalance: 0,
  usdtBalance: 0,
  fiatVND: '0đ',
  completedTasksCount: 0,
  dailyTasksCompleted: 0,
  dailyTasksLimit: 100,
  luckyWheelFreeSpins: 1,
  createdCampaignsCount: 0,
  rankLevel: 'Đồng',
  kycStatus: 'unverified',
  transactions: [],
  myOrders: [],
  myAppLicenses: []
};


// Danh sách nhiệm vụ Follow, Tim, Comment, Xem video kiếm Xu (100% chiến dịch thật từ nhà sáng tạo / đối tác)
export const TIKTOK_TASKS: TikTokTaskItem[] = [];

// Danh sách thông báo chiến dịch đối tác vừa public cho toàn cộng đồng
export const PARTNER_ANNOUNCEMENTS: PartnerCampaignAnnouncement[] = [];

// Danh sách phòng Livestream TikTok cần người xem & thả tim (Phân cấp bậc & Mở khóa tiến trình)
export const LIVESTREAM_TASKS: LivestreamTaskItem[] = [];

// Dữ liệu Báo cáo phân tích thu nhập & thời gian xem của người dùng (Realtime từ hoạt động thật)
export const USER_ANALYTICS: UserAnalyticsData = {
  todayWatchMinutes: 0,
  todayVideosWatched: 0,
  retentionScore: 100,
  completedToday: 0,
  todayEarningsCoins: 0,
  weeklyEarningsCoins: 0,
  monthlyEarningsCoins: 0,
  todayLiveMinutes: 0,
  todayLiveSessionsCompleted: 0,
  todayLiveCoinsEarned: 0,
  liveRetentionRate: 100,
  liveWatchHistory: [],
  incomeBreakdown: {
    followPercent: 0,
    likePercent: 0,
    commentPercent: 0,
    sharePercent: 0,
    livestreamPercent: 0,
    affiliatePercent: 0
  },
  dailyStreak: 0,
  checkedInToday: false
};

// Dữ liệu Cơ chế Tokenomics & Đốt Token
export const TOKENOMICS_DATA: TokenomicsData = {
  tokenPriceVND: 1000, // 1 Token = 1 VNĐ
  priceChange24h: 0,
  totalCirculation: 0,
  totalBurned: 0,
  burnRatePercent: 10,
  deflationRate: '0%',
  marketCapVND: '0đ',
  burnHistory: [],
  priceHistory: []
};

// Danh sách các gói dịch vụ tăng trưởng TikTok (Được đồng bộ từ COMPREHENSIVE_GROWTH_PACKAGES)
import { COMPREHENSIVE_GROWTH_PACKAGES } from './growthPackages';
export const GROWTH_SERVICES: GrowthServiceItem[] = COMPREHENSIVE_GROWTH_PACKAGES;

// Danh sách chiến dịch đang chạy trong hệ thống
export const ACTIVE_CAMPAIGNS: CampaignItem[] = [];

// Bảng cấp bậc hoa hồng Affiliate theo quy mô cộng đồng (20% - 35% • Nhận 1 lần duy nhất)
export const AFFILIATE_TIER_LEVELS: AffiliateTierInfo[] = [
  {
    tierId: 'silver',
    name: 'Hạng Bạc (Affiliate Khởi Nghiệp)',
    badge: '🥈 BẠC (20%)',
    minMembers: 1,
    maxMembers: 20,
    ratePercent: 20,
    description: 'Dành cho người mới bắt đầu (1 - 20 thành viên F1). Nhận 20% hoa hồng cho đơn mua đầu tiên của mỗi tài khoản.'
  },
  {
    tierId: 'gold',
    name: 'Hạng Vàng (Affiliate Chuyên Nghiệp)',
    badge: '🥇 VÀNG (25%)',
    minMembers: 21,
    maxMembers: 50,
    ratePercent: 25,
    description: 'Cộng đồng vừa và nhỏ (21 - 50 thành viên F1). Nhận 25% hoa hồng cho đơn mua đầu tiên của mỗi tài khoản.'
  },
  {
    tierId: 'platinum',
    name: 'Hạng Bạch Kim (KOL / Leader)',
    badge: '🏆 BẠCH KIM (30%)',
    minMembers: 51,
    maxMembers: 100,
    ratePercent: 30,
    description: 'Leader cộng đồng năng động (51 - 100 thành viên F1). Nhận 30% hoa hồng cho đơn mua đầu tiên của mỗi tài khoản.'
  },
  {
    tierId: 'diamond',
    name: 'Hạng Kim Cương (Thủ Lĩnh Cộng Đồng Lớn)',
    badge: '💎 KIM CƯƠNG (35%)',
    minMembers: 101,
    maxMembers: 999999,
    ratePercent: 35,
    description: 'Dành cho thủ lĩnh có cộng đồng lớn (trên 100 thành viên F1). Nhận mức hoa hồng cao nhất 35% cho đơn mua đầu tiên của mỗi tài khoản.'
  }
];

// Hàm lấy Link giới thiệu động theo domain hiện tại
export const getDynamicRefLink = (refCode: string = 'THIENVUAAPP88'): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/?ref=${refCode}`;
  }
  return `https://avafollow.vn/?ref=${refCode}`;
};

// Dữ liệu Tiếp thị liên kết (Affiliate Hub)
export const AFFILIATE_DATA: AffiliateStats = {
  refCode: 'THIENVUAAPP88',
  refLink: getDynamicRefLink('THIENVUAAPP88'),
  totalClicks: 0,
  totalSignups: 0,
  // 1. Quỹ Xu Tặng Giới Thiệu (5,000 Xu / bạn kích hoạt làm 1 nhiệm vụ)
  referralBonusCoinsTotal: 0,
  referralPendingCoins: 0,
  referralActivatedCount: 0,
  referralPendingCount: 0,
  // 2. Quỹ Hoa Hồng Mua Gói (35% VNĐ cấp Kim Cương - Nhận 1 lần duy nhất / người)
  totalCommissionVND: '0đ',
  commissionRate: '20%',
  tier: 'Bạc',
  monthlyCommission: '0đ',
  referralsList: []
};

// Dữ liệu Bảng điều khiển Admin (100% Thực Tế)
export const ADMIN_DATA: AdminDashboardData = {
  totalFollowsDelivered: 0,
  activeCampaignsCount: 0,
  totalTokensCirculating: 0,
  totalTokensBurned: 0,
  totalRevenueVND: '0đ',
  totalEscrowLockedVND: '0đ',
  totalRegisteredUsers: 0,
  pendingApprovalsCount: 0,
  fraudAlertsCount: 0,
  campaignsQueue: []
};

// ==============================================================================
// DANH SÁCH HỢP ĐỒNG KÝ QUỸ BOOKING TRUNG GIAN 3 BÊN (ESCROW SMART VAULT)
// ==============================================================================
import { EscrowBookingContract, AdminUserManagementItem } from '../types';

export const ESCROW_BOOKINGS: EscrowBookingContract[] = [];

// ==============================================================================
// DANH SÁCH TOÀN BỘ NGƯỜI DÙNG QUẢN TRỊ ADMIN (SUPABASE USER DATABASE)
// ==============================================================================
export const ADMIN_USERS_LIST: AdminUserManagementItem[] = [];


// ==============================================================================
// KHO ỨNG DỤNG & PHẦN MỀM XÂY KÊNH TIKTOK (CHỢ APP KIẾM TIỀN - MUA BẰNG XU)
// ==============================================================================
export const SOFTWARE_APPS_CATALOG: SoftwareAppItem[] = [
  {
    id: 'app_01',
    title: 'AI Viral Script Master Pro 2026',
    category: 'ai_script',
    tag: 'Bán Chạy Nhất',
    priceXu: 500000,
    tokenPrice: 200,
    fiatPriceVND: '500,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Tự động tạo kịch bản video TikTok giữ chân 3 giây đầu, phân cảnh chuyên sâu, bùng nổ hàng triệu lượt xem và tối ưu giỏ hàng.',
    highlights: [
      'Công thức Hook 3s giữ chân người xem 85%',
      'Tạo 50 kịch bản ngách chỉ trong 10 giây',
      'Định dạng xuất kịch bản chuẩn CapCut & Teleprompter'
    ],
    features: [
      'Tích hợp GPT-4o & Claude 3.5 Sonnet chuyên văn phong TikTok Việt Nam',
      'Kho 500+ mẫu mở đầu kích thích tò mò',
      'Tự động gợi ý từ khóa SEO xu hướng',
      'Bản quyền trọn đời không giới hạn số lượng tạo'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    version: 'v3.5 Pro',
    developer: 'TikTok Pro Dev Labs',
    platformCompatibility: ['Web App', 'Windows', 'MacOS', 'iOS / Android'],
    badge: 'HOT AI TOOL',
    downloadUrl: 'https://tools.tiktokpro.vn/ai-script-master'
  },
  {
    id: 'app_02',
    title: 'TikTok HD No-Watermark Downloader Suite',
    category: 'video_tools',
    tag: 'Tiện Ích 4K',
    priceXu: 300000,
    tokenPrice: 120,
    fiatPriceVND: '300,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Tải hàng loạt video TikTok chuẩn 4K siêu nét không dính logo (Watermark), tự động tải theo kênh đối thủ hoặc thẻ hashtag.',
    highlights: [
      'Tải cả kênh đối thủ 500 video chỉ trong 2 phút',
      'Chất lượng gốc Original Bitrate không nén vỡ hình',
      'Tự động phân loại theo lượng xem cao nhất'
    ],
    features: [
      'Hỗ trợ xuất file âm thanh MP3 riêng biệt',
      'Chạy ngầm không tốn băng thông máy',
      'Tự động lưu thẻ mô tả và hashtag đi kèm',
      'Cập nhật thuật toán TikTok mới nhất 2026'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    version: 'v4.1 Ultra',
    developer: 'Vua App Media Group',
    platformCompatibility: ['Windows', 'MacOS', 'Web Browser Extension'],
    badge: 'TIỆN ÍCH TOP 1',
    downloadUrl: 'https://tools.tiktokpro.vn/tiktok-hd-downloader'
  },
  {
    id: 'app_03',
    title: 'TikTok Audio Extractor & AI Voice Cloner',
    category: 'ai_script',
    tag: 'Giọng Đọc Triệu View',
    priceXu: 600000,
    tokenPrice: 240,
    fiatPriceVND: '600,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Tách nhạc nền trending, lọc tạp âm và clone giọng đọc MC truyền cảm, giọng kể chuyện Drama chuẩn bản quyền không bị tắt tiếng.',
    highlights: [
      'Kho 60 giọng đọc MC AI tự nhiên như người thật',
      'Chống đánh gậy bản quyền âm thanh TikTok 100%',
      'Lọc sạch tạp âm tiếng ồn môi trường chỉ 1 click'
    ],
    features: [
      'Công nghệ ElevenLabs Neural Voice thế hệ mới',
      'Nhận diện ngữ điệu vui, buồn, kịch tính, châm biếm',
      'Xuất file WAV Lossless chuẩn phòng thu',
      'Hỗ trợ đa ngôn ngữ: Việt, Anh, Trung, Hàn, Thái'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    version: 'v2.8 Studio',
    developer: 'SoundWave AI',
    platformCompatibility: ['Web App', 'Windows', 'MacOS'],
    badge: 'MC AI TRIỆU VIEW',
    downloadUrl: 'https://tools.tiktokpro.vn/voice-cloner'
  },
  {
    id: 'app_04',
    title: 'Competitor Spy & Trend Radar Pro 2026',
    category: 'analytics',
    tag: 'Phân Tích Đối Thủ',
    priceXu: 700000,
    tokenPrice: 280,
    fiatPriceVND: '700,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Ra-đa quét tự động kênh đối thủ: Xem khung giờ đăng video nhiều view nhất, tỷ lệ giữ chân, âm thanh họ dùng và doanh thu TikTok Shop ước tính.',
    highlights: [
      'Bắt bài chiến lược nội dung của top 10 đối thủ cùng ngách',
      'Dự báo bài hát và trào lưu sắp lên xu hướng trước 48h',
      'Ước tính doanh thu sản phẩm giỏ hàng đối thủ chính xác 92%'
    ],
    features: [
      'Biểu đồ tăng trưởng follower và view theo từng giờ',
      'Thông báo tức thì khi đối thủ có video cán mốc 100k view',
      'Trích xuất danh sách khách hàng hay bình luận mua hàng',
      'Dữ liệu đồng bộ trực tiếp từ BigData TikTok'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    version: 'v5.0 Enterprise',
    developer: 'DataMetrics Pro',
    platformCompatibility: ['Web Dashboard', 'Chrome Extension'],
    badge: 'VŨ KHÍ CHIẾN LƯỢC',
    downloadUrl: 'https://tools.tiktokpro.vn/spy-trend-radar'
  },
  {
    id: 'app_05',
    title: 'TikTok Shop Auto Keyword & SEO Ranker',
    category: 'tiktok_shop',
    tag: 'SEO Top 1 Giỏ Hàng',
    priceXu: 800000,
    tokenPrice: 320,
    fiatPriceVND: '800,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Tối ưu tiêu đề, thẻ mô tả sản phẩm và bộ từ khóa tìm kiếm đưa gian hàng TikTok Shop của bạn lên vị trí số 1 tab Tìm Kiếm & Đề Xuất.',
    highlights: [
      'Gấp 3 lần lượt xem tự nhiên từ thanh tìm kiếm TikTok',
      'Quét 1,000+ từ khóa mua hàng có tỷ lệ chuyển đổi cao',
      'Kiểm tra và loại bỏ từ khóa cấm / vi phạm chính sách'
    ],
    features: [
      'Tự động viết mô tả sản phẩm chuẩn thuật toán ASO TikTok',
      'Chấm điểm chuẩn SEO sản phẩm trước khi đăng bán',
      'Gợi ý hashtag ngách ít cạnh tranh nhưng nhiều người tìm',
      'Hỗ trợ quản lý hàng nghìn mã SKU cùng lúc'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80',
    version: 'v3.2 Commerce',
    developer: 'ShopBoost Technologies',
    platformCompatibility: ['Web App', 'TikTok Seller Center Integration'],
    badge: 'BÙNG NỔ ĐƠN HÀNG',
    downloadUrl: 'https://tools.tiktokpro.vn/seo-ranker'
  },
  {
    id: 'app_06',
    title: 'CapCut Template Auto Batch Render Engine',
    category: 'growth_auto',
    tag: 'Sản Xuất Hàng Loạt',
    priceXu: 900000,
    tokenPrice: 360,
    fiatPriceVND: '900,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Tự động ghép hàng trăm video/hình ảnh vào các mẫu CapCut thịnh hành chỉ bằng 1 nút bấm, xuất hàng loạt không dính logo kết thúc.',
    highlights: [
      'Render 100 video chuẩn trend chỉ trong 15 phút',
      'Tự động thay đổi góc quay, hiệu ứng tránh thuật toán quét trùng lặp',
      'Khung hình 9:16 chuẩn TikTok không đen viền'
    ],
    features: [
      'Kho hơn 2,000 template CapCut thịnh hành cập nhật mỗi ngày',
      'Tự động khớp nhạc beat drop chính xác từng mili-giây',
      'Chèn logo bản quyền và watermark thương hiệu tự động',
      'Hỗ trợ GPU Acceleration xuất file 4K cực nhanh'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    version: 'v2.6 RenderMax',
    developer: 'VideoAuto Studio',
    platformCompatibility: ['Windows', 'MacOS'],
    badge: 'XÂY KÊNH SỐ LƯỢNG LỚN',
    downloadUrl: 'https://tools.tiktokpro.vn/batch-render'
  },
  {
    id: 'app_07',
    title: 'Livestream Auto Assistant & Comment Pinning Pro',
    category: 'tiktok_shop',
    tag: 'Trợ Lý Phòng Live',
    priceXu: 1000000,
    tokenPrice: 400,
    fiatPriceVND: '1,000,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Trợ lý AI thông minh trong phiên Live: Tự động ghim sản phẩm giỏ hàng, ghim bình luận mồi, gửi tin nhắn chào mừng và trả lời câu hỏi tự động.',
    highlights: [
      'Tự động ghim Deal 1k, mã giảm giá kích thích mua hàng',
      'Trả lời thắc mắc về size số, phí ship, thời gian giao hàng',
      'Bắn thông báo tri ân người xem thả tim và tặng quà'
    ],
    features: [
      'Cơ chế chống spam chuẩn quy định TikTok Live Studio',
      'Thiết lập kịch bản trả lời tự động bằng AI thông minh',
      'Báo cáo số người xem đã bấm vào xem giỏ hàng',
      'Hỗ trợ kết nối máy tính bảng hoặc laptop điều khiển từ xa'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    version: 'v4.0 LivePro',
    developer: 'LiveStream Hub Vietnam',
    platformCompatibility: ['Windows', 'MacOS', 'Web Control Panel'],
    badge: 'TRỢ LÝ LIVE VIP',
    downloadUrl: 'https://tools.tiktokpro.vn/live-assistant'
  },
  {
    id: 'app_08',
    title: 'TikTok Multi-Account Antidetect Safe Manager',
    category: 'growth_auto',
    tag: 'Quản Lý Đa Tài Khoản',
    priceXu: 1200000,
    tokenPrice: 480,
    fiatPriceVND: '1,200,000đ',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    description: 'Trình duyệt cô lập vân tay trình duyệt (Antidetect Browser) an toàn tuyệt đối, cho phép nuôi và quản lý 100 tài khoản TikTok không bao giờ bị bóp view hay khóa liên đới.',
    highlights: [
      'Cô lập IP, Canvas, WebGL, Cookie riêng biệt 100%',
      'Chống thuật toán TikTok phát hiện tài khoản trùng lặp',
      'Đăng nhập 1 chạm không cần nhập lại mã OTP'
    ],
    features: [
      'Tích hợp sẵn proxy xoay IP dân cư Việt Nam & Quốc tế',
      'Phân quyền cho nhân viên quản lý không lộ mật khẩu gốc',
      'Sao lưu dữ liệu tự động lên đám mây mã hóa bảo mật',
      'Hỗ trợ tự động lướt video tương tác như người thật'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    version: 'v6.2 Antidetect',
    developer: 'CyberShield SafeTech',
    platformCompatibility: ['Windows', 'MacOS', 'Linux'],
    badge: 'BẢO VỆ DÀN KÊNH',
    downloadUrl: 'https://tools.tiktokpro.vn/antidetect-manager'
  }
];

// Sổ cái biến động Token chính thức
export const INITIAL_TOKEN_LEDGER: TokenLedgerRecord[] = [];


// Danh sách thông báo thời gian thực gửi đến tài khoản người dùng
export const INITIAL_USER_NOTIFICATIONS: UserNotificationItem[] = [];

// Lịch sử nhiệm vụ đã làm của người dùng (Chống trùng lặp & bảo vệ ngân sách chủ shop)
export const INITIAL_USER_COMPLETED_ACTIONS: Record<string, UserTaskActionHistory> = {};

// Danh sách Bạn Bè Mạng Xã Hội (Facebook Style)
export const INITIAL_FRIENDS: CommunityFriendItem[] = [];

// Lịch sử tin nhắn Messenger Facebook
export const INITIAL_CHAT_CONVERSATIONS: Record<string, ChatMessageItem[]> = {};


