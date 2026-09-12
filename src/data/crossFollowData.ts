import { CrossFollowItem, DailyTierCrossFollowQuota, TokenSinkStrategyDef } from '../types';

// ===== HẠN MỨC FOLLOW CHÉO MỖI NGÀY THEO CẤP BẬC (TIER LIMITS) =====
// Ngăn cản cày xu vô hạn - bảo vệ nền kinh tế sàn không bị lạm phát
export const TIER_CROSS_FOLLOW_QUOTAS: Record<string, DailyTierCrossFollowQuota> = {
  'Đồng': {
    rank: 'Đồng',
    dailyLimit: 20, // 20 lượt / ngày
    rewardMultiplier: 1.0,
    extraExpansionCostXu: 5000 // Chi 5.000 Xu để mở thêm 20 lượt (Triệt tiêu 100% Xu)
  },
  'Bạc': {
    rank: 'Bạc',
    dailyLimit: 50, // 50 lượt / ngày
    rewardMultiplier: 1.5,
    extraExpansionCostXu: 10000
  },
  'Vàng': {
    rank: 'Vàng',
    dailyLimit: 100, // 100 lượt / ngày
    rewardMultiplier: 2.0,
    extraExpansionCostXu: 20000
  },
  'Kim Cương': {
    rank: 'Kim Cương',
    dailyLimit: 200, // 200 lượt / ngày
    rewardMultiplier: 3.0,
    extraExpansionCostXu: 35000
  }
};

// ===== KHO NGUYÊN LIỆU FOLLOW CHÉO CỘNG ĐỒNG (Cung cấp cho Nhiệm Vụ Ngày & Trao Đổi) =====
export const INITIAL_CROSS_FOLLOW_ITEMS: CrossFollowItem[] = [
  // --- FOLLOW CHÉO KÊNH THẬT ---
  {
    id: 'cf_follow_01',
    type: 'follow',
    title: 'Follow Kênh Review Mỹ Phẩm Chính Hãng',
    channelName: 'Phương Beauty Skin',
    channelHandle: '@phuongbeauty_koc',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    targetUrl: 'https://tiktok.com/@phuongbeauty_koc',
    rewardXu: 200,
    category: 'Mỹ Phẩm & Làm Đẹp',
    followersCount: 124500,
    completedByUsersCount: 840,
    isCompleted: false
  },
  {
    id: 'cf_follow_02',
    type: 'follow',
    title: 'Follow Kênh Thời Trang Xu Hướng GenZ',
    channelName: 'Minh Thư Outfit',
    channelHandle: '@minhthu_style',
    channelAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
    targetUrl: 'https://tiktok.com/@minhthu_style',
    rewardXu: 200,
    category: 'Thời Trang & Phụ Kiện',
    followersCount: 89300,
    completedByUsersCount: 620,
    isCompleted: false
  },
  {
    id: 'cf_follow_03',
    type: 'follow',
    title: 'Follow Kênh Đồ Ăn Đường Phố Sài Gòn',
    channelName: 'Sài Gòn Ăn Gì',
    channelHandle: '@foodie_saigon99',
    channelAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
    targetUrl: 'https://tiktok.com/@foodie_saigon99',
    rewardXu: 200,
    category: 'Ẩm Thực & Đời Sống',
    followersCount: 340200,
    completedByUsersCount: 1540,
    isCompleted: false
  },
  {
    id: 'cf_follow_04',
    type: 'follow',
    title: 'Follow Kênh Review Đồ Công Nghệ Thông Minh',
    channelName: 'Tuấn Tech Review',
    channelHandle: '@tuantech_smart',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    targetUrl: 'https://tiktok.com/@tuantech_smart',
    rewardXu: 200,
    category: 'Công Nghệ & Tiện Ích',
    followersCount: 215000,
    completedByUsersCount: 920,
    isCompleted: false
  },
  {
    id: 'cf_follow_05',
    type: 'follow',
    title: 'Follow Kênh Học Nấu Ăn Cơm Nhà 15 Phút',
    channelName: 'Bếp Của Mẹ Lan',
    channelHandle: '@bepme_lan',
    channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
    targetUrl: 'https://tiktok.com/@bepme_lan',
    rewardXu: 200,
    category: 'Nấu Ăn & Gia Đình',
    followersCount: 67800,
    completedByUsersCount: 510,
    isCompleted: false
  },

  // --- XEM VIDEO FYP 15S CHÉO ---
  {
    id: 'cf_watch_01',
    type: 'watch',
    title: 'Xem 15 Giây Clip Trend Phối Đồ Mùa Hè 2026',
    channelName: 'Hà Linh Fashion',
    channelHandle: '@halinh_ootd',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    targetUrl: 'https://tiktok.com/@halinh_ootd/video/7391827361',
    rewardXu: 200,
    category: 'Thời Trang',
    followersCount: 45000,
    completedByUsersCount: 1200,
    isCompleted: false
  },
  {
    id: 'cf_watch_02',
    type: 'watch',
    title: 'Xem 15 Giây Hướng Dẫn Làm Trà Sữa Đậm Vị Tại Nhà',
    channelName: 'Pha Chế Tại Gia',
    channelHandle: '@phache_taigia',
    channelAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120',
    targetUrl: 'https://tiktok.com/@phache_taigia/video/7382718293',
    rewardXu: 200,
    category: 'Đồ Uống',
    followersCount: 78000,
    completedByUsersCount: 980,
    isCompleted: false
  },

  // --- THẢ TIM CHÉO ---
  {
    id: 'cf_like_01',
    type: 'like',
    title: 'Thả Tim Video Mở Hộp Son Kem Lì Kháng Nước',
    channelName: 'Mai Anh Makeup',
    channelHandle: '@maianh_cosmetics',
    channelAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120',
    targetUrl: 'https://tiktok.com/@maianh_cosmetics/video/7371829301',
    rewardXu: 100,
    category: 'Làm Đẹp',
    followersCount: 156000,
    completedByUsersCount: 2300,
    isCompleted: false
  },
  {
    id: 'cf_like_02',
    type: 'like',
    title: 'Thả Tim Video Top 5 Tai Nghe Bluetooth Chống Ồn Ngon Bổ Rẻ',
    channelName: 'Audio Geek VN',
    channelHandle: '@audiogeek_vn',
    channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    targetUrl: 'https://tiktok.com/@audiogeek_vn/video/7361928374',
    rewardXu: 100,
    category: 'Công Nghệ',
    followersCount: 52000,
    completedByUsersCount: 1450,
    isCompleted: false
  },

  // --- BÌNH LUẬN SEEDING CHÉO ---
  {
    id: 'cf_cmt_01',
    type: 'comment',
    title: 'Bình Luận Hỏi Mua Giày Sneaker Retro Cổ Điển',
    channelName: 'Sneaker Head Sài Thành',
    channelHandle: '@sneakerhead_saigon',
    channelAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    targetUrl: 'https://tiktok.com/@sneakerhead_saigon/video/7351928301',
    rewardXu: 200,
    category: 'Giày Dép & Streetwear',
    followersCount: 189000,
    completedByUsersCount: 420,
    isCompleted: false
  },

  // --- CHIA SẺ CHÉO ---
  {
    id: 'cf_share_01',
    type: 'share',
    title: 'Chia Sẻ Video Công Thức Giảm Cân Khoa Học Trong 14 Ngày',
    channelName: 'Huấn Luyện Viên Huy',
    channelHandle: '@coach_huy_fit',
    channelAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120',
    targetUrl: 'https://tiktok.com/@coach_huy_fit/video/7341928302',
    rewardXu: 240,
    category: 'Fitness & Sức Khỏe',
    followersCount: 94000,
    completedByUsersCount: 310,
    isCompleted: false
  }
];

// ===== 8 CHIẾN LƯỢC TRIỆT TIÊU & TÁI HẤP THỤ XU (TOKEN SINK / BURN ENGINE) =====
// Giúp chống lạm phát, giữ vững tỷ giá 1 Xu = 1 VNĐ, đảm bảo không bao giờ bị "lủng hệ thống"
export const TOKEN_SINK_STRATEGIES: TokenSinkStrategyDef[] = [
  {
    id: 'sink_campaign_recycle',
    title: '1. Tái Đầu Tư Tạo Chiến Dịch Tăng Kênh Cá Nhân',
    category: 'campaign_creation',
    burnRatePercentage: 10, // Đốt vĩnh viễn 10% phí sàn
    description: 'Người làm kiếm được Xu sẽ dùng chính số Xu đó để tự tạo chiến dịch tăng Follow / Tim / View cho kênh của mình (tối thiểu 5.000 Xu). 90% ngân sách dùng trả thù lao cho cộng đồng, 10% phí nền tảng bị ĐỐT TRIỆT TIÊU VĨNH VIỄN.',
    benefitForUser: 'Có ngay tương tác thật và follower thật cho kênh TikTok của mình mà không cần nạp thêm tiền mặt.',
    benefitForPlatform: 'Giữ dòng tiền tuần hoàn nội bộ, triệt tiêu 10% tổng lượng Xu tạo chiến dịch, ngăn rút tiền mặt ồ ạt.',
    icon: '🔄'
  },
  {
    id: 'sink_marquee_boost',
    title: '2. Đẩy Bảng Điện LED Toàn Sàn (100.000 Xu / Lượt)',
    category: 'marquee_boost',
    burnCostXu: 100000,
    description: 'Bất kỳ người dùng, chủ shop hay KOC nào muốn xuất hiện trên dải Bảng Điện LED chạy chữ từ phải qua trái 24/7 đầu trang phải trả phí 100.000 Xu.',
    benefitForUser: 'Tiếp cận tức thì 128.000+ thành viên đang online, nổ mắt xem live và tương tác video ngay lập tức.',
    benefitForPlatform: 'Hấp thụ và triệt tiêu một lượng Xu cực lớn (100.000 Xu/lượt) ra khỏi lưu thông thị trường.',
    icon: '⚡'
  },
  {
    id: 'sink_quota_expansion',
    title: '3. Mua Thẻ Nâng Hạn Mức Tương Tác Ngày (5.000 - 35.000 Xu)',
    category: 'quota_expansion',
    burnCostXu: 5000,
    description: 'Người dùng đạt kịch trần hạn mức tương tác trong ngày (ví dụ Hạng Đồng chỉ 20 lượt/ngày) nếu muốn cày thêm phải chi Xu để mua thêm gói hạn mức. 100% số Xu này bị tiêu biến.',
    benefitForUser: 'Được làm thêm nhiều nhiệm vụ và kiếm thêm tiền nếu chăm chỉ cày cuốc.',
    benefitForPlatform: 'Khống chế triệt để hiện tượng spam bot cày token vô tội vạ, triệt tiêu Xu liên tục mỗi ngày.',
    icon: '📈'
  },
  {
    id: 'sink_vip_pass',
    title: '4. Nâng Cấp Thẻ Thành Viên VIP (50.000 - 300.000 Xu / Tháng)',
    category: 'vip_pass',
    burnCostXu: 50000,
    description: 'Gia hạn cấp bậc VIP (Bạc, Vàng, Kim Cương) bằng Xu để hưởng hệ số nhân thù lao x1.5 đến x3.0 và tăng hạn mức ngày.',
    benefitForUser: 'Nhân đôi thu nhập, ưu tiên nhận các chiến dịch thù lao cao nhất sàn.',
    benefitForPlatform: 'Khóa chặt lượng Xu lớn trong chu kỳ 30 ngày, triệt tiêu Xu tự động.',
    icon: '👑'
  },
  {
    id: 'sink_lucky_wheel',
    title: '5. Vòng Quay May Mắn & Hộp Quà Bí Ẩn (1.000 - 2.000 Xu / Lượt)',
    category: 'lucky_wheel',
    burnCostXu: 2000,
    description: 'Dùng Xu lẻ để quay thưởng săn các phần quà giá trị cao (Voucher TikTok Shop, quà tặng thương hiệu, phụ kiện công nghệ).',
    benefitForUser: 'Cơ hội trúng phần thưởng giá trị gấp 50-100 lần số Xu bỏ ra.',
    benefitForPlatform: 'Tỷ lệ RTP (Return to Player) được tính toán 85%, sàn triệt tiêu 15% tổng Xu người chơi đặt cược.',
    icon: '🎰'
  },
  {
    id: 'sink_withdraw_fee',
    title: '6. Phí Rút Tiền Chuyển Đổi Về Ngân Hàng (5% Burn & Reserve)',
    category: 'withdraw_fee',
    burnRatePercentage: 5,
    description: 'Mỗi lệnh rút tiền mặt về thẻ ATM / ngân hàng VietQR bị trừ 5% phí chuyển đổi. Trong đó 2.5% là phí cổng đối soát, 2.5% đưa vào Quỹ Đốt Token Bảo Chứng.',
    benefitForUser: 'Rút tiền thật 100% về mọi ngân hàng Việt Nam theo kỳ giải ngân định kỳ minh bạch.',
    benefitForPlatform: 'Giảm áp lực quỹ tiền mặt, triệt tiêu Xu tỷ lệ thuận theo khối lượng rút tiền.',
    icon: '🏦'
  },
  {
    id: 'sink_koc_escrow',
    title: '7. Phí Ký Quỹ & Hợp Đồng Bảo Hiểm KOC (20% Escrow Fee)',
    category: 'koc_escrow',
    burnRatePercentage: 20,
    description: 'Các hợp đồng thuê KOC quay video review / livestream qua sàn Avalive Escrow được khấu trừ đúng 20% phí dịch vụ bảo chứng ký quỹ và công nghệ (KOC thực nhận 80% giá trị hợp đồng). Phí 20% này giúp đảm bảo 100% quyền lợi, bảo hiểm rủi ro cho cả Doanh Nghiệp, Khách Hàng và KOC.',
    benefitForUser: 'Chủ shop và KOC được bảo vệ 100% tiền cọc, cam kết deadline và chất lượng video chuẩn cam kết, có bảo hành nghiệm thu 3 ngày (72h).',
    benefitForPlatform: 'Tạo nguồn thu Xu dịch vụ vững mạnh từ các giao dịch doanh nghiệp lớn, triệt tiêu Xu hiệu quả để bảo vệ thanh khoản rút tiền mặt của sàn.',
    icon: '🤝'
  },
  {
    id: 'sink_live_gifting',
    title: '8. Tặng Quà Ảo Trong Livestream (Live Gifting Sink - 20%)',
    category: 'live_gifting',
    burnRatePercentage: 20,
    description: 'Người xem Live có thể dùng Xu tặng hoa hồng (50 Xu), vương miện (1.000 Xu) cổ vũ idol TikTok. Sàn thu 20% phí nền tảng đốt vĩnh viễn, 80% chuyển cho Host live.',
    benefitForUser: 'Tạo niềm vui giải trí, tương tác sôi nổi và gắn kết cộng đồng người xem.',
    benefitForPlatform: 'Triệt tiêu ngay lập tức 20% lượng Xu qua mỗi món quà được trao tặng.',
    icon: '🎁'
  }
];
