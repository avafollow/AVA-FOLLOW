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

export const USER_PROFILE_WALLET: UserProfileWallet = {
  name: 'Nguyễn Văn Minh (Thiện Vua App)',
  handle: '@thienvuaapp',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'thienvuaapp@gmail.com',
  role: 'Creator Pro • Chuyên Gia Xây Kênh TikTok',
  tiktokConnected: '',
  tiktokFollowers: 0,
  isTikTokVerified: false,
  facebookConnected: '',
  isFacebookVerified: false,
  facebookFollowers: 0,
  youtubeConnected: '',
  isYoutubeVerified: false,
  youtubeSubscribers: 0,
  bioVerificationCode: 'TIKTOK-VERIFY-8899',
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
  bankInfo: {
    bankName: 'MB Bank (Quân Đội)',
    accountNumber: '999988886666',
    accountHolder: 'NGUYEN VAN MINH',
    branch: 'Chi nhánh Hà Nội'
  },
  transactions: [],
  myOrders: [],

  myAppLicenses: []
};


// Danh sách nhiệm vụ Follow, Tim, Comment, Xem video kiếm Xu
export const TIKTOK_TASKS: TikTokTaskItem[] = [
  {
    id: 'task_1',
    title: 'Follow Kênh TikTok Mỹ Phẩm Dưỡng Da ZenSkin',
    type: 'follow',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'ZenSkin Official Store',
    channelHandle: '@zenskin_vietnam',
    channelAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@zenskin_vietnam',
    totalSlots: 2000,
    completedSlots: 1420,
    remainingSlots: 580,
    guide: 'Bấm Follow kênh, xem video tối thiểu 15 giây. Hệ thống tự động xác minh và cộng Xu ngay lập tức.',
    requirements: ['Tài khoản TikTok thật > 30 ngày tuổi', 'Không bỏ follow trong 30 ngày'],
    status: 'open',
    createdAt: '15 phút trước',
    videoPreviewUrl: '/videos/sample1.mp4',
    sampleComments: [
      'Da mình nhạy cảm dùng dòng này êm ru luôn ạ!',
      'Shop tư vấn nhiệt tình, giao hàng nhanh đỉnh chóp ❤️',
      'Đã mua lần 2, dưỡng ẩm cực kỳ căng bóng!'
    ],
    tags: ['Mỹ phẩm', 'Skincare', 'FYP'],
    campaignCategory: 'partner',
    partnerName: 'ZenSkin Vietnam (Official Brand)',
    partnerBadge: 'Thương Hiệu Kim Cương',
    isUrgent: true,
    isBoosted: true,
    isHot: true,
    boostCount: 2,
    boostedAt: '5 phút trước',
    audienceTargeting: {
      mode: 'niche_targeted',
      gender: 'female',
      ageRanges: ['18-24', '25-34'],
      regions: ['hcm', 'hanoi', 'mien_nam'],
      interests: ['Mỹ phẩm & Làm đẹp', 'Skincare'],
      viewingHabits: ['Reviewer TikTok Shop', 'ASMR Ăn uống'],
      targetCriteriaSummary: 'Nữ 18-34 tuổi • Quan tâm Mỹ phẩm & Skincare • Thường xem Review TikTok Shop'
    },
    targetMatchScore: 100
  },
  {
    id: 'task_2',
    title: 'Xem Video FYP 15s Kênh Thời Trang Aura Boutique (+200 Xu)',
    type: 'watch',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'Aura Boutique',
    channelHandle: '@auraboutique.vn',
    channelAvatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@auraboutique.vn/video/10293847',
    totalSlots: 5000,
    completedSlots: 3820,
    remainingSlots: 1180,
    guide: 'Xem hết tối thiểu 15 giây của video, thả tim và chia sẻ để đẩy video vào xu hướng FYP.',
    requirements: ['Xem trọn vẹn 15s để thuật toán TikTok ghi nhận tương tác hợp lệ'],
    status: 'open',
    createdAt: '30 phút trước',
    videoPreviewUrl: '/videos/sample2.mp4',
    sampleComments: [
      'Set đồ này phối nhìn sang chảnh quá chị ơi!',
      'Mẫu áo trắng còn size M không shop?',
      'Chất vải nhìn xịn đét, vừa chốt đơn xong!'
    ],
    tags: ['Thời trang', 'GenZ', 'Trend'],
    campaignCategory: 'partner',
    partnerName: 'Aura Boutique Fashion Hub',
    partnerBadge: 'Shop Xu Hướng TikTok',
    isUrgent: true,
    audienceTargeting: {
      mode: 'niche_targeted',
      gender: 'all',
      ageRanges: ['18-24', '25-34'],
      regions: ['all'],
      interests: ['Thời trang', 'Đời sống & Vlog'],
      viewingHabits: ['Reviewer TikTok Shop', 'Tips sáng tạo'],
      targetCriteriaSummary: 'Độ tuổi 18-34 • Thích Thời trang & Xu hướng Gen Z'
    },
    targetMatchScore: 95
  },
  {
    id: 'task_3',
    title: 'Bình Luận Seeding Đẩy Xu Hướng Cà Phê Chill Rooftop',
    type: 'comment',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'Skyline Coffee & Bar',
    channelHandle: '@skyline_saigon',
    channelAvatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@skyline_saigon/video/8827361',
    totalSlots: 1500,
    completedSlots: 890,
    remainingSlots: 610,
    guide: 'Viết bình luận tích cực dài hơn 10 từ liên quan đến không gian quán hoặc view hoàng hôn ngắm trọn thành phố.',
    requirements: ['Bình luận có tâm, không dùng icon spam, không sao chép'],
    status: 'open',
    createdAt: '1 giờ trước',
    videoPreviewUrl: '/videos/sample3.mp4',
    sampleComments: [
      'Hoàng hôn ở đây ngắm đỉnh thực sự, chụp ảnh góc nào cũng đẹp!',
      'Nước uống ngon giá hợp lý, cuối tuần dẫn người yêu đi chill là chuẩn bài!',
      'View Landmark 81 cực thoáng mát, nhân viên siêu dễ thương!'
    ],
    tags: ['Ẩm thực', 'Sài Gòn', 'Rooftop'],
    campaignCategory: 'partner',
    partnerName: 'Skyline F&B Vietnam Group',
    partnerBadge: 'Đối Tác Ký Quỹ Đảm Bảo',
    isUrgent: false
  },
  {
    id: 'task_4',
    title: 'Thả Tim Video Món Ăn Vặt Phố Đi Bộ Sài Gòn',
    type: 'like',
    rewardCoins: 100,
    rewardVND: '100đ',
    channelName: 'Ăn Vặt Sài Gòn Xịn',
    channelHandle: '@anvat_saigon',
    channelAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@anvat_saigon/video/33991122',
    totalSlots: 3000,
    completedSlots: 2100,
    remainingSlots: 900,
    guide: 'Thả tim video sau khi lướt xem, tương tác tự nhiên.',
    requirements: ['Tài khoản TikTok hoạt động thường xuyên'],
    status: 'open',
    createdAt: '1 giờ trước',
    videoPreviewUrl: '/videos/sample1.mp4',
    sampleComments: [
      'Nhìn thèm xỉu luôn á shop ơi!',
      'Bánh tráng trộn ở đây vị đậm đà ngon xuất sắc ❤️',
      'Cuối tuần ghé quán làm liền 2 phần!'
    ],
    tags: ['Ăn vặt', 'Food Tour', 'Sài Gòn'],
    campaignCategory: 'community',
    partnerName: 'Kênh Cộng Đồng TikToker'
  },
  {
    id: 'task_5',
    title: 'Chia Sẻ Video Phụ Kiện Điện Thoại & Đồ Công Nghệ',
    type: 'share',
    rewardCoins: 240,
    rewardVND: '240đ',
    channelName: 'TechZone Vietnam',
    channelHandle: '@techzone_vn',
    channelAvatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@techzone_vn/video/9918273',
    totalSlots: 2000,
    completedSlots: 1350,
    remainingSlots: 650,
    guide: 'Bấm nút chia sẻ video hoặc sao chép link gửi lên Facebook / tin nhắn bạn bè.',
    requirements: ['Chia sẻ hợp lệ tài khoản thật'],
    status: 'open',
    createdAt: '2 giờ trước',
    videoPreviewUrl: '/videos/sample2.mp4',
    sampleComments: [
      'Thiết kế đẹp mà giá hạt dẻ quá!',
      'Pin sạc dự phòng dùng được bao nhiêu lần vậy shop?',
      'Vừa nhận hàng sáng nay, đóng gói rất kỹ nha!'
    ],
    tags: ['Công nghệ', 'Tech', 'Phụ kiện'],
    campaignCategory: 'community',
    partnerName: 'Kênh Cộng Đồng Creator'
  },
  {
    id: 'task_6',
    title: 'Xem Video FYP 15s Bài Tập Gym Đốt Mỡ Cấp Tốc (+200 Xu)',
    type: 'watch',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'Fitness Pro Club',
    channelHandle: '@fitness_pro_vn',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@fitness_pro_vn/video/77112233',
    totalSlots: 4000,
    completedSlots: 2800,
    remainingSlots: 1200,
    guide: 'Xem trọn vẹn 15 giây bài tập gym để đẩy tương tác FYP và nhận 200 Xu ngay.',
    requirements: ['Xem đủ 15 giây video'],
    status: 'open',
    createdAt: '2 giờ trước',
    videoPreviewUrl: '/videos/sample3.mp4',
    sampleComments: [
      'Động tác này tập vào cơ bụng đã lắm!',
      'Hóng thêm video hướng dẫn lịch tập cho người mới ạ!',
      'Cảm ơn PT chia sẻ bài tập chuẩn chỉnh!'
    ],
    tags: ['Gym', 'Fitness', 'Sức khỏe'],
    campaignCategory: 'community',
    partnerName: 'Kênh Cộng Đồng Sức Khỏe'
  },
  {
    id: 'task_comm_1',
    title: 'Xem Video FYP 15s Mẹo Vặt Cuộc Sống Thông Minh (+200 Xu)',
    type: 'watch',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'Mẹo Hay Mỗi Ngày',
    channelHandle: '@meohay_genz',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@meohay_genz/video/66228811',
    totalSlots: 99999,
    completedSlots: 14200,
    remainingSlots: 85799,
    guide: 'Lướt xem video 15 giây, học mẹo vặt thông minh và nhận +200 Xu tự động.',
    requirements: ['Xem tối thiểu 15 giây'],
    status: 'open',
    createdAt: '1 giờ trước',
    videoPreviewUrl: '/videos/sample1.mp4',
    sampleComments: [
      'Mẹo này áp dụng ngay trong bếp quá tiện luôn!',
      'Nhờ clip này mà mình tiết kiệm được cả đống thời gian.',
      'Cảm ơn bạn đã chia sẻ kiến thức hữu ích!'
    ],
    tags: ['Mẹo Vặt', 'Đời Sống', 'Cộng Đồng'],
    campaignCategory: 'community',
    partnerName: 'Kênh Nhà Sáng Tạo Cộng Đồng'
  },
  {
    id: 'task_comm_2',
    title: 'Xem Video FYP 15s Tiếng Anh Giao Tiếp Siêu Nhanh (+200 Xu)',
    type: 'watch',
    rewardCoins: 200,
    rewardVND: '200đ',
    channelName: 'English Express 1 Min',
    channelHandle: '@englishexpress.vn',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@englishexpress.vn/video/55441199',
    totalSlots: 99999,
    completedSlots: 22150,
    remainingSlots: 77849,
    guide: 'Lướt xem 15 giây video học phát âm chuẩn bản xứ, nhận ngay +200 Xu.',
    requirements: ['Xem đủ 15 giây'],
    status: 'open',
    createdAt: '45 phút trước',
    videoPreviewUrl: '/videos/sample2.mp4',
    sampleComments: [
      'Thầy dạy phát âm đuôi ed cực kỳ dễ nhớ!',
      'Follow kênh ngay để học mỗi ngày 1 câu.',
      'Rất hay và thực tế ạ!'
    ],
    tags: ['Học Tập', 'Tiếng Anh', 'Cộng Đồng'],
    campaignCategory: 'community',
    partnerName: 'Kênh Nhà Sáng Tạo Cộng Đồng'
  },
  {
    id: 'task_7',
    title: 'Booking KOC Review Nồi Chiên Không Dầu Đa Năng',
    type: 'review',
    rewardCoins: 50000,
    rewardVND: '50,000đ',
    channelName: 'Gia Dụng Thông Minh Homie',
    channelHandle: '@homie_vietnam',
    channelAvatar: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@homie_vietnam',
    totalSlots: 20,
    completedSlots: 12,
    remainingSlots: 8,
    guide: 'Quay video trải nghiệm 45s - 60s, gắn giỏ hàng TikTok Shop và gắn hashtag theo yêu cầu.',
    requirements: ['Kênh TikTok có tối thiểu 10,000 followers', 'Chủ đề ẩm thực, đời sống, gia đình'],
    status: 'open',
    createdAt: '3 giờ trước',
    videoPreviewUrl: '/videos/sample3.mp4',
    tags: ['Gia dụng', 'KOC Review', 'TikTok Shop'],
    campaignCategory: 'partner',
    partnerName: 'Tập Đoàn Gia Dụng Homie',
    partnerBadge: 'Thương Hiệu Cao Cấp',
    isUrgent: true
  }
];

// Danh sách thông báo chiến dịch đối tác vừa public cho toàn cộng đồng
export const PARTNER_ANNOUNCEMENTS: PartnerCampaignAnnouncement[] = [
  {
    id: 'ann_1',
    partnerName: 'ZenSkin Official Store',
    campaignTitle: 'Follow Kênh TikTok Mỹ Phẩm Dưỡng Da ZenSkin',
    channelHandle: '@zenskin_vietnam',
    totalSlots: 2000,
    remainingSlots: 580,
    rewardCoins: 200,
    taskType: 'follow',
    taskId: 'task_1',
    createdAt: 'Vừa xong'
  },
  {
    id: 'ann_2',
    partnerName: 'Aura Boutique',
    campaignTitle: 'Xem Video FYP 15s Kênh Thời Trang Aura Boutique (+200 Xu)',
    channelHandle: '@auraboutique.vn',
    totalSlots: 5000,
    remainingSlots: 1180,
    rewardCoins: 200,
    taskType: 'watch',
    taskId: 'task_2',
    createdAt: '15 phút trước'
  },
  {
    id: 'ann_3',
    partnerName: 'Skyline F&B Group',
    campaignTitle: 'Bình Luận Seeding Đẩy Xu Hướng Cà Phê Chill Rooftop',
    channelHandle: '@skyline_saigon',
    totalSlots: 1500,
    remainingSlots: 610,
    rewardCoins: 200,
    taskType: 'comment',
    taskId: 'task_3',
    createdAt: '1 giờ trước'
  }
];

// Danh sách phòng Livestream TikTok cần người xem & thả tim (Phân cấp bậc & Mở khóa tiến trình)
export const LIVESTREAM_TASKS: LivestreamTaskItem[] = [
  {
    id: 'live_1min',
    channelName: 'Xưởng Sỉ Thời Trang GenZ',
    channelHandle: '@xuongsi_genz',
    channelAvatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80',
    roomTitle: '⚡ XEM NHANH 1 PHÚT: FLASH SALE ÁO NỈ 49K - XEM ĐỦ 60S NHẬN 500 XU',
    currentViewers: 850,
    targetMinutes: 1,
    rewardPerMinute: 400,
    milestoneBonusCoins: 100,
    totalRewardCoins: 500,
    targetUrl: 'https://tiktok.com/@xuongsi_genz/live',
    status: 'live',
    category: 'Nhiệm Vụ 1 Phút',
    hostFollowers: '120K Followers',
    requiredRank: 'Đồng',
    isLocked: false,
    dailyTierLevel: 1,
    tags: ['Xem 1 Phút', 'Nhanh Gọn', '+500 Xu']
  },
  {
    id: 'live_bcast_ord_live_vip_1',
    channelName: 'Thiên Vũ Official (Kênh của bạn)',
    channelHandle: '@thienvuaapp_official',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roomTitle: '🔥 ĐẠI TIỆC XẢ KHO 99K TIKTOK SHOP - BÃO MẮT XEM CỘNG ĐỒNG (GÓI 3 PHÚT)',
    currentViewers: 340,
    targetMinutes: 3,
    rewardPerMinute: 400,
    milestoneBonusCoins: 600,
    totalRewardCoins: 1800,
    targetUrl: 'https://tiktok.com/@thienvuaapp_official/live',
    status: 'live',
    category: 'Nhiệm Vụ 3 Phút',
    hostFollowers: '250K Followers',
    requiredRank: 'Đồng',
    isLocked: false,
    dailyTierLevel: 1,
    tags: ['Xem 3 Phút', 'Gói Đang Chạy', 'TikTok Shop']
  },
  {
    id: 'live_1',
    channelName: 'Mỹ Phẩm Cao Cấp Glow Cosmetics',
    channelHandle: '@glow_cosmetics.live',
    channelAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    roomTitle: '🔴 LIVE ĐẠI TIỆC XẢ KHO 99K - SĂN DEAL ĐỘC QUYỀN TIKTOK SHOP',
    currentViewers: 1420,
    targetMinutes: 3,
    rewardPerMinute: 300,
    milestoneBonusCoins: 300,
    totalRewardCoins: 1200,
    targetUrl: 'https://tiktok.com/@glow_cosmetics.live/live',
    status: 'live',
    category: 'TikTok Shop Flash Sale',
    hostFollowers: '185K Followers',
    requiredRank: 'Đồng',
    isLocked: false,
    dailyTierLevel: 1,
    tags: ['Mỹ phẩm', 'Flash Sale', 'TikTok Shop']
  },
  {
    id: 'live_2',
    channelName: 'Thế Giới Thời Trang Nam Aristino',
    channelHandle: '@aristino_menswear',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    roomTitle: '🔥 LIVESTREAM RA MẮT BST ÁO POLO XUÂN HÈ - TẶNG QUÀ CHO 100 NGƯỜI XEM ĐẦU',
    currentViewers: 2850,
    targetMinutes: 5,
    rewardPerMinute: 350,
    milestoneBonusCoins: 500,
    totalRewardCoins: 2250,
    targetUrl: 'https://tiktok.com/@aristino_menswear/live',
    status: 'live',
    category: 'Thời Trang & Quà Tặng',
    hostFollowers: '420K Followers',
    requiredRank: 'Đồng',
    isLocked: false,
    dailyTierLevel: 2,
    tags: ['Thời trang nam', 'Quà tặng', 'Livestream']
  },
  {
    id: 'live_3',
    channelName: 'Food Review Sài Gòn Ăn Gì',
    channelHandle: '@saigon_angi.official',
    channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    roomTitle: '🍜 TRẢI NGHIỆM QUÁN BÚN BÒ GIA TRUYỀN 40 NĂM - TƯƠNG TÁC THẢ TIM NHẬN VOUCHER',
    currentViewers: 980,
    targetMinutes: 5,
    rewardPerMinute: 350,
    milestoneBonusCoins: 500,
    totalRewardCoins: 2250,
    targetUrl: 'https://tiktok.com/@saigon_angi.official/live',
    status: 'live',
    category: 'Ẩm Thực Review',
    hostFollowers: '310K Followers',
    requiredRank: 'Đồng',
    isLocked: false,
    dailyTierLevel: 3,
    tags: ['Ẩm thực', 'Voucher', 'Ăn gì']
  },
  {
    id: 'live_4',
    channelName: 'Vua Đồ Da & Phụ Kiện Luxury',
    channelHandle: '@vuadoda_official',
    channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    roomTitle: '⚡ PHIÊN LIVE BÙNG NỔ: ĐẤU GIÁ VÍ DA & BALO HÀNG HIỆU - GIÁ CHỈ TỪ 1K',
    currentViewers: 3450,
    targetMinutes: 10,
    rewardPerMinute: 450,
    milestoneBonusCoins: 1500,
    totalRewardCoins: 6000,
    targetUrl: 'https://tiktok.com/@vuadoda_official/live',
    status: 'live',
    category: 'Phụ Kiện Da Cao Cấp',
    hostFollowers: '680K Followers',
    requiredRank: 'Bạc',
    isLocked: false,
    dailyTierLevel: 4,
    tags: ['Đồ da', 'Đấu giá 1K', 'TikTok Shop']
  },
  {
    id: 'live_5',
    channelName: 'Review Công Nghệ Smart Home',
    channelHandle: '@smarthome_techlab',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    roomTitle: '🤖 TRÊN TAY ROBOT HÚT BỤI & ĐÈN LED RGB - TẶNG TAI NGHE BLUETOOTH MỖI 10 PHÚT',
    currentViewers: 4120,
    targetMinutes: 10,
    rewardPerMinute: 450,
    milestoneBonusCoins: 1800,
    totalRewardCoins: 6300,
    targetUrl: 'https://tiktok.com/@smarthome_techlab/live',
    status: 'live',
    category: 'Thiết Bị Công Nghệ',
    hostFollowers: '890K Followers',
    requiredRank: 'Bạc',
    isLocked: false,
    unlockedAfterTaskId: 'live_4',
    dailyTierLevel: 5,
    tags: ['Công nghệ', 'Smart Home', 'Giveaway']
  },
  {
    id: 'live_6',
    channelName: 'Siêu Đại Siêu Thị Điện Máy E-Zone',
    channelHandle: '@ezone_mall_official',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    roomTitle: '👑 MEGA LIVE ĐÓN SIÊU BÃO ĐƠN HÀNG TOÀN QUỐC - TRỢ GIÁ TRỰC TIẾP TỪ BRAND',
    currentViewers: 7890,
    targetMinutes: 15,
    rewardPerMinute: 500,
    milestoneBonusCoins: 3000,
    totalRewardCoins: 10500,
    targetUrl: 'https://tiktok.com/@ezone_mall_official/live',
    status: 'live',
    category: 'Mega Live Toàn Sàn',
    hostFollowers: '1.4M Followers',
    requiredRank: 'Vàng',
    isLocked: false,
    unlockedAfterTaskId: 'live_5',
    dailyTierLevel: 6,
    tags: ['Mega Live', 'Thương Hiệu', 'Trợ giá']
  },
  {
    id: 'live_7',
    channelName: 'Hội Thảo KOC Triệu View & Doanh Nghiệp',
    channelHandle: '@koc_master_summit',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    roomTitle: '💎 PHÒNG LIVE VIP KIM CƯƠNG: KẾT NỐI HỢP ĐỒNG BOOKING 100 TRIỆU ĐỒNG',
    currentViewers: 12500,
    targetMinutes: 15,
    rewardPerMinute: 600,
    milestoneBonusCoins: 5000,
    totalRewardCoins: 14000,
    targetUrl: 'https://tiktok.com/@koc_master_summit/live',
    status: 'live',
    category: 'VIP Booking Sàn',
    hostFollowers: '2.8M Followers',
    requiredRank: 'Kim Cương',
    isLocked: false,
    unlockedAfterTaskId: 'live_6',
    dailyTierLevel: 7,
    tags: ['VIP Kim Cương', 'Booking 100M', 'Độc Quyền']
  },
  {
    id: 'live_30min',
    channelName: 'Thương Hiệu Gia Dụng Thông Minh Lock&Lock',
    channelHandle: '@locknlock_vietnam.live',
    channelAvatar: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=120&auto=format&fit=crop&q=80',
    roomTitle: '🔥 ĐẠI TIỆC XẢ KHO 30 PHÚT: XEM ĐỦ 30P NHẬN NGAY 20,000 XU VÀO VÍ',
    currentViewers: 6420,
    targetMinutes: 30,
    rewardPerMinute: 500,
    milestoneBonusCoins: 5000,
    totalRewardCoins: 20000,
    targetUrl: 'https://tiktok.com/@locknlock_vietnam.live/live',
    status: 'live',
    category: 'Nhiệm Vụ 30 Phút VIP',
    hostFollowers: '1.2M Followers',
    requiredRank: 'Bạc',
    isLocked: false,
    dailyTierLevel: 4,
    tags: ['Xem 30 Phút', 'Nhận 20K Xu', 'TikTok Shop VIP']
  }
];

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
export const INITIAL_FRIENDS: CommunityFriendItem[] = [
  {
    id: 'friend_1',
    name: 'Vũ Đức Thành',
    handle: '@thanh_tiktokgrowth',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Top Creator (850K Follow)',
    tiktokFollowers: 850000,
    status: 'friends',
    isOnline: true,
    lastActive: 'Đang hoạt động'
  },
  {
    id: 'friend_2',
    name: 'Đặng Mai Phương',
    handle: '@phuongbeauty_koc',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    role: 'KOC Review Mỹ Phẩm (320K Follow)',
    tiktokFollowers: 320000,
    status: 'friends',
    isOnline: true,
    lastActive: 'Đang hoạt động'
  },
  {
    id: 'friend_3',
    name: 'Trần Hoàng Nam',
    handle: '@nam_livestreampro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Host Live Chốt Đơn (190K Follow)',
    tiktokFollowers: 190000,
    status: 'pending',
    isOnline: false,
    lastActive: '15 phút trước'
  },
  {
    id: 'friend_4',
    name: 'Lê Thùy Dung',
    handle: '@thuydung_fashion',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Fashion KOC (450K Follow)',
    tiktokFollowers: 450000,
    status: 'none',
    isOnline: true,
    lastActive: 'Đang hoạt động'
  }
];

// Lịch sử tin nhắn Messenger Facebook
export const INITIAL_CHAT_CONVERSATIONS: Record<string, ChatMessageItem[]> = {
  '@thanh_tiktokgrowth': [
    {
      id: 'msg_1',
      senderHandle: '@thanh_tiktokgrowth',
      senderName: 'Vũ Đức Thành',
      recipientHandle: '@thienvuaapp_official',
      text: 'Chào bạn! Mình thấy bạn vừa làm nhiệm vụ follow kênh mình, cảm ơn bạn nhiều nhé!',
      timestamp: '10:30',
      isMe: false
    },
    {
      id: 'msg_2',
      senderHandle: '@thienvuaapp_official',
      senderName: 'Nguyễn Văn Minh (Thiện Vua App)',
      recipientHandle: '@thanh_tiktokgrowth',
      text: 'Chào bạn Thành! Nội dung clip chia sẻ thuật toán FYP của bạn cuốn lắm, cùng phát triển nhé!',
      timestamp: '10:32',
      isMe: true
    },
    {
      id: 'msg_3',
      senderHandle: '@thanh_tiktokgrowth',
      senderName: 'Vũ Đức Thành',
      recipientHandle: '@thienvuaapp_official',
      text: 'Ok bạn! Chiều nay mình có phiên live kéo mắt giữ chân, bạn vào ủng hộ nha!',
      timestamp: '10:33',
      isMe: false
    }
  ],
  '@phuongbeauty_koc': [
    {
      id: 'msg_4',
      senderHandle: '@phuongbeauty_koc',
      senderName: 'Đặng Mai Phương',
      recipientHandle: '@thienvuaapp_official',
      text: 'Chào anh Minh! Bên anh có nhận hợp đồng Escrow booking video review sản phẩm không ạ?',
      timestamp: 'Hôm qua',
      isMe: false
    },
    {
      id: 'msg_5',
      senderHandle: '@thienvuaapp_official',
      senderName: 'Nguyễn Văn Minh (Thiện Vua App)',
      recipientHandle: '@phuongbeauty_koc',
      text: 'Có em nhé, tiền cọc đã khóa sẵn trong két Escrow sàn, em cứ yên tâm nhận job!',
      timestamp: 'Hôm qua',
      isMe: true
    }
  ]
};

