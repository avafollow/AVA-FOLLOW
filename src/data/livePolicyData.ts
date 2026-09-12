// ==============================================================================
// CHÍNH SÁCH TOÀN DIỆN MẮT XEM LIVESTREAM TIKTOK SHOP (WIN - WIN)
// ĐÔI BÊN CÙNG CÓ LỢI: NGƯỜI MUA GÓI & NGƯỜI XEM LIVE KIẾM TIỀN
// ==============================================================================

export interface LiveViewerTierBenefit {
  rank: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  icon: string;
  levelGiftCoins: number;
  levelGiftCoinsFormatted: string;
  levelGiftFollowers: number;
  levelGiftFollowersFormatted: string;
  dailyFullTaskBonus: string;
  multiplier: number; // Cố định chuẩn 1.0 để chống lạm phát
  rewardPerMinuteCoins: number;
  rewardPerMinuteVND: string;
  maxSessionsPerDay: number;
  estimatedDailyCoins: string;
  estimatedDailyVND: string;
  requiredCondition: string;
  specialPerks: string[];
}

export interface LiveMilestoneReward {
  minutes: number;
  bonusCoins: number;
  bonusVND: string;
  description: string;
  label: string;
}

export interface LiveSeedingScriptTemplate {
  id: string;
  categoryName: string;
  industry: 'fashion' | 'beauty' | 'home' | 'food' | 'tech' | 'course';
  comments: string[];
}

export interface LivePackageBuyerBenefit {
  id: string;
  title: string;
  eyesCount: number;
  durationMinutes: number;
  priceVND: string;
  tokenPrice: number;
  tokenDiscountPrice: number; // -10% khi dùng Token
  meteringRatePerMinuteVND: number;
  retentionCommitment: string;
  heartsCommitment: string;
  commentsCommitment: string;
  algorithmImpact: string;
  recommendedFor: string;
}

// 1. QUYỀN LỢI NGƯỜI XEM LIVE THEO CẤP BẬC (THƯỞNG XU & FOLLOWER THẬT THAY VÌ HỆ SỐ)
export const LIVE_VIEWER_TIERS: LiveViewerTierBenefit[] = [
  {
    rank: 'Đồng',
    icon: '🥉',
    levelGiftCoins: 5000,
    levelGiftCoinsFormatted: '+5,000 Xu',
    levelGiftFollowers: 50,
    levelGiftFollowersFormatted: '+50 Follower thật',
    dailyFullTaskBonus: '+1,000 Xu khi hoàn thành 5/5 phiên live',
    multiplier: 1.0,
    rewardPerMinuteCoins: 300,
    rewardPerMinuteVND: '300đ / phút',
    maxSessionsPerDay: 5,
    estimatedDailyCoins: '15,000 - 35,000 Xu',
    estimatedDailyVND: '15,000đ - 35,000đ / ngày',
    requiredCondition: 'Tài khoản mới đăng ký, liên kết TikTok thành công',
    specialPerks: [
      'Tặng ngay 5.000 Xu & 50 Follower vào kênh TikTok khi kích hoạt',
      'Hạn mức 5 phiên live mở mỗi ngày (300đ/phút chuẩn)',
      'Thưởng mốc giữ mắt 3p (+1.200 Xu) & 5p (+2.400 Xu)',
      'Rút tiền về ngân hàng khi đạt 50,000đ'
    ]
  },
  {
    rank: 'Bạc',
    icon: '🥈',
    levelGiftCoins: 20000,
    levelGiftCoinsFormatted: '+20,000 Xu',
    levelGiftFollowers: 200,
    levelGiftFollowersFormatted: '+200 Follower thật',
    dailyFullTaskBonus: '+2,000 Xu & 1 Vé Vòng Quay May Mắn',
    multiplier: 1.0,
    rewardPerMinuteCoins: 300,
    rewardPerMinuteVND: '300đ / phút',
    maxSessionsPerDay: 12,
    estimatedDailyCoins: '45,000 - 90,000 Xu',
    estimatedDailyVND: '45,000đ - 90,000đ / ngày',
    requiredCondition: 'Hoàn thành 30 nhiệm vụ + Duy trì chuỗi 3 ngày',
    specialPerks: [
      'Thưởng thăng cấp: Tặng ngay +20.000 Xu & +200 Follower thật',
      'Nâng hạn mức lên 12 phiên live/ngày (tăng thu nhập gấp 2.4 lần)',
      'Thưởng làm đủ nhiệm vụ ngày: +2.000 Xu & Vé Vòng Quay May Mắn',
      'Ưu tiên nhận thông báo phiên live hot'
    ]
  },
  {
    rank: 'Vàng',
    icon: '🥇',
    levelGiftCoins: 80000,
    levelGiftCoinsFormatted: '+80,000 Xu',
    levelGiftFollowers: 1000,
    levelGiftFollowersFormatted: '+1,000 Follower thật',
    dailyFullTaskBonus: '+8,000 Xu & +50 Follower mỗi ngày',
    multiplier: 1.0,
    rewardPerMinuteCoins: 300,
    rewardPerMinuteVND: '300đ / phút',
    maxSessionsPerDay: 25,
    estimatedDailyCoins: '120,000 - 250,000 Xu',
    estimatedDailyVND: '120,000đ - 250,000đ / ngày',
    requiredCondition: 'Hoàn thành 150 nhiệm vụ + Đạt KYC CCCD',
    specialPerks: [
      'Thưởng thăng cấp: Tặng ngay +80.000 Xu & +1.000 Follower thật',
      'Nâng hạn mức lên 25 phiên live/ngày',
      'Thưởng làm đủ nhiệm vụ ngày: +8.000 Xu & +50 Follower',
      'Miễn phí xét duyệt KYC và ưu tiên duyệt hồ sơ giải ngân nhanh'
    ]
  },
  {
    rank: 'Kim Cương',
    icon: '💎',
    levelGiftCoins: 300000,
    levelGiftCoinsFormatted: '+300,000 Xu',
    levelGiftFollowers: 3000,
    levelGiftFollowersFormatted: '+3,000 Follower thật',
    dailyFullTaskBonus: '+25,000 Xu & +100 Follower mỗi ngày',
    multiplier: 1.0,
    rewardPerMinuteCoins: 300,
    rewardPerMinuteVND: '300đ / phút',
    maxSessionsPerDay: 999, // Không giới hạn
    estimatedDailyCoins: '250,000 - 500,000+ Xu',
    estimatedDailyVND: '250,000đ - 500,000đ+ / ngày',
    requiredCondition: 'Top 5% thành viên tích cực + Mời được 5 bạn bè F1',
    specialPerks: [
      'Thưởng thăng cấp: Tặng ngay +300.000 Xu & +3.000 Follower thật',
      'Xem KHÔNG GIỚI HẠN số lượng phiên live mỗi ngày',
      'Thưởng làm đủ nhiệm vụ ngày: +25.000 Xu & +100 Follower',
      'Ưu tiên duyệt lệnh rút tiền và giải ngân sớm nhất',
      'Mở khóa chiến dịch độc quyền từ Brand lớn & Cố vấn 1-1'
    ]
  }
];

// 2. CÁC MỐC THƯỞNG GIỮ CHÂN PHÒNG LIVE
export const LIVE_MILESTONE_REWARDS: LiveMilestoneReward[] = [
  {
    minutes: 3,
    bonusCoins: 1200,
    bonusVND: '1,200đ',
    label: 'Mốc 3 Phút (Khởi Động)',
    description: 'Vượt qua mốc giữ chân quan trọng đầu tiên của thuật toán TikTok. Tự động kích hoạt điểm tương tác.'
  },
  {
    minutes: 5,
    bonusCoins: 2500,
    bonusVND: '2,500đ',
    label: 'Mốc 5 Phút (Giữ Mắt Vàng)',
    description: 'Giúp phòng live được hệ thống TikTok xếp hạng ưu tiên hiển thị trên tab Khám phá.'
  },
  {
    minutes: 10,
    bonusCoins: 6000,
    bonusVND: '6,000đ',
    label: 'Mốc 10 Phút (Siêu Giữ Chân)',
    description: 'Thưởng lớn cho sự đồng hành lâu dài. Tạo chỉ số Average Watch Time cực kỳ cao cho phiên live.'
  },
  {
    minutes: 15,
    bonusCoins: 10000,
    bonusVND: '10,000đ',
    label: 'Mốc 15 Phút (Đồng Hành Chốt Đơn)',
    description: 'Thưởng cao nhất cho phiên live. Đạt chuẩn người xem trung thành đẩy chuyển đổi giỏ hàng.'
  }
];

// 3. THƯỞNG TƯƠNG TÁC TÍCH CỰC TRONG PHÒNG LIVE
export const LIVE_ACTION_REWARDS = {
  PER_MINUTE_BASE: 300,        // 300 Xu / phút
  HEART_TAP_20: 200,           // 200 Xu khi tap đủ 20 tim
  SEEDING_COMMENT: 350,        // 350 Xu khi bình luận đúng kịch bản giỏ hàng
  SHARE_STREAM: 300,           // 300 Xu khi chia sẻ link live
  CAPTCHA_HUMAN_VERIFY: 200    // 200 Xu khi vượt qua mini-captcha chống bot
};

// 4. KHO KỊCH BẢN SEEDING GIỎ HÀNG MẪU THEO 6 NGÀNH HÀNG
export const LIVE_SEEDING_TEMPLATES: LiveSeedingScriptTemplate[] = [
  {
    id: 'script_fashion',
    categoryName: 'Thời Trang & Phụ Kiện',
    industry: 'fashion',
    comments: [
      'Mẫu áo khoác nỉ này còn size L không shop ơi?',
      'Chất vải sờ vào êm không ạ, có bị xù lông không shop?',
      'Em cao 1m65 nặng 58kg mặc size nào vừa đẹp vậy chị?',
      'Vừa nhận hàng hôm qua xong, form chuẩn xịn đẹp mê li luôn!',
      'Shop ơi ghim mã số 03 lên giỏ hàng giúp em với nha!',
      'Màu kem be này tôn da dã man, chốt luôn 2 chiếc ạ ❤️',
      'Có được kiểm tra hàng trước khi thanh toán không shop ơi?',
      'Mọi người nhanh tay săn deal đi kẻo hết size đó ạ!'
    ]
  },
  {
    id: 'script_beauty',
    categoryName: 'Mỹ Phẩm & Skincare',
    industry: 'beauty',
    comments: [
      'Da dầu mụn dùng dòng serum B5 này có bị bí tắc không shop?',
      'Kem chống nắng này nâng tone tự nhiên hay trắng bệch vậy ạ?',
      'Em đã dùng sang lọ thứ 3 rồi, mờ thâm căng bóng thấy rõ luôn!',
      'Shop ơi son mã 05 đỏ gạch còn hàng không em chốt liền?',
      'Hàng chính hãng có tem phụ tiếng Việt đầy đủ không chị?',
      'Săn được voucher giảm 50k trong live mừng quá!',
      'Chất kem thấm nhanh, không bết dính chút nào luôn nha cả nhà.',
      'Ghim combo dưỡng trắng da mờ nám lên giỏ hàng đi shop ơi!'
    ]
  },
  {
    id: 'script_home',
    categoryName: 'Đồ Gia Dụng & Tiện Ích',
    industry: 'home',
    comments: [
      'Nồi chiên không dầu này bảo hành chính hãng bao lâu vậy shop?',
      'Công suất bao nhiêu Watt vậy ạ, dùng có tốn điện không shop?',
      'Đã chốt đơn mã 01 nhé, shop đóng gói cẩn thận giúp em nha!',
      'Dùng máy hút bụi này êm re, hút sạch lông thú cưng thích lắm!',
      'Shop ơi ship về Đà Nẵng thì mấy ngày nhận được vậy ạ?',
      'Bộ dao kéo inox nhìn bén và đầm tay ghê, xứng đáng 5 sao!',
      'Giá trong live hôm nay hời hơn mua ngoài sàn nhiều luôn á!'
    ]
  },
  {
    id: 'script_food',
    categoryName: 'Ăn Vặt & Ẩm Thực Nông Sản',
    industry: 'food',
    comments: [
      'Khô gà cay này có lá chanh không shop ơi, có cay lắm không?',
      'Bánh tráng phơi sương dẻo không ạ, kèm bơ hay muối tôm vậy?',
      'Vừa ăn thử đợt trước ngon quá nay phải vào rủ bạn mua chung!',
      'Shop tặng thêm quà kèm đơn combo 3 hũ đúng không ạ?',
      'Hạn sử dụng bao lâu vậy shop, để được ngoài nhiệt độ thường không?',
      'Ghim lại mã khô bò miếng giúp em với em chưa kịp bấm mua!',
      'Chốt đơn 2 set ăn vặt nha shop, giao nhanh ăn Tết nhé ạ!'
    ]
  },
  {
    id: 'script_tech',
    categoryName: 'Công Nghệ & Phụ Kiện Điện Thoại',
    industry: 'tech',
    comments: [
      'Tai nghe bluetooth này pin trâu không shop, nghe được mấy tiếng?',
      'Có tương thích tốt với iPhone 15 và Android không ạ?',
      'Âm bass nghe đầm không shop, mic đàm thoại có lọc ồn không?',
      'Đã nhận củ sạc nhanh 65W, sạc vèo cái đầy pin cực kỳ hài lòng!',
      'Bảo hành 1 đổi 1 trong 12 tháng nếu có lỗi đúng không shop?',
      'Ghim mã sạc dự phòng không dây 20.000mAh lên giỏ hàng đi ạ!'
    ]
  },
  {
    id: 'script_course',
    categoryName: 'Khóa Học & Dịch Vụ Số',
    industry: 'course',
    comments: [
      'Người mới chưa biết gì có học được khóa xây kênh này không thầy?',
      'Học xong có được hỗ trợ vào nhóm kín giải đáp 1-1 không ạ?',
      'Em đã áp dụng bài học đầu tiên và video đã cắn xu hướng 50k view!',
      'Tài liệu kịch bản tải ở đâu vậy thầy, khóa học học trọn đời đúng không?',
      'Giá khóa học hôm nay ưu đãi bao nhiêu phần trăm vậy thầy ơi?',
      'Đã thanh toán thành công, mong được thầy duyệt vào lớp sớm ạ!'
    ]
  }
];

// 5. BẢNG QUYỀN LỢI CHI TIẾT DÀNH CHO NGƯỜI MUA GÓI MẮT XEM
export const LIVE_BUYER_PACKAGES_POLICY: LivePackageBuyerBenefit[] = [
  {
    id: 'live_pkg_200',
    title: 'Gói 200 Mắt Xem Live Duy Trì 60 Phút',
    eyesCount: 200,
    durationMinutes: 60,
    priceVND: '250,000đ',
    tokenPrice: 100, // 100 Token = 250,000đ
    tokenDiscountPrice: 90, // Giảm 10% khi dùng Token
    meteringRatePerMinuteVND: 4166, // ~4,166đ / phút
    retentionCommitment: 'Cam kết duy trì đều đặn 200 mắt trong suốt 60 phút. Tự động bù mắt trong 15s nếu có người xem thoát sớm.',
    heartsCommitment: 'Tối thiểu 15,000 - 25,000 lượt tim tap tự nhiên.',
    commentsCommitment: 'Phân bổ 50 - 100 comment seeding mồi giỏ hàng theo kịch bản.',
    algorithmImpact: 'Tạo đà khởi động phiên live, giúp TikTok nhận diện phòng live có sức hút để đưa vào luồng đề xuất khám phá.',
    recommendedFor: 'Kênh mới bắt đầu live, shop bán hàng nhỏ cần tạo uy tín ban đầu.'
  },
  {
    id: 'live_pkg_500',
    title: 'Gói 500 Mắt Xem Live Duy Trì 120 Phút (Chốt Đơn)',
    eyesCount: 500,
    durationMinutes: 120,
    priceVND: '550,000đ',
    tokenPrice: 220,
    tokenDiscountPrice: 198,
    meteringRatePerMinuteVND: 4583,
    retentionCommitment: 'Giữ mắt xem ổn định 500 mắt suốt 2 tiếng. Tỷ lệ giữ chân người xem trung bình đạt 6.8 phút/người.',
    heartsCommitment: 'Tối thiểu 50,000 - 80,000 lượt tim tap liên tục.',
    commentsCommitment: 'Phân bổ 150 - 300 comment hỏi giá, giục chốt đơn, feedback mồi.',
    algorithmImpact: 'Đẩy phòng live vào Top 20 ngành hàng. Tỷ lệ click vào giỏ hàng tăng 350%.',
    recommendedFor: 'Shop thời trang, mỹ phẩm đang chạy phiên live bán hàng chốt đơn.'
  },
  {
    id: 'live_pkg_1000',
    title: 'Gói 1,000 Mắt Xem Live Duy Trì 180 Phút (Mega Sale)',
    eyesCount: 1000,
    durationMinutes: 180,
    priceVND: '1,200,000đ',
    tokenPrice: 480,
    tokenDiscountPrice: 432,
    meteringRatePerMinuteVND: 6666,
    retentionCommitment: 'Duy trì 1,000 mắt xem thật trong 3 tiếng liên tục. Đảm bảo phòng live luôn sôi sục năng lượng.',
    heartsCommitment: 'Tối thiểu 150,000 - 250,000 lượt tim tap bùng nổ.',
    commentsCommitment: 'Phân bổ 500 - 800 comment seeding đa dạng, tạo hiệu ứng đám đông tranh mua cực mạnh.',
    algorithmImpact: 'Chiếm lĩnh Top 5 Trending Livestream. Kéo theo hàng ngàn mắt xem tự nhiên vãng lai miễn phí.',
    recommendedFor: 'Sự kiện Siêu Sale ngày đôi (9/9, 11/11, 12/12), Brand tung BST mới.'
  },
  {
    id: 'live_pkg_2000',
    title: 'Gói 2,000 Mắt Xem Live Đại Tiệc Doanh Số (180 Phút)',
    eyesCount: 2000,
    durationMinutes: 180,
    priceVND: '2,200,000đ',
    tokenPrice: 880,
    tokenDiscountPrice: 792,
    meteringRatePerMinuteVND: 12222,
    retentionCommitment: 'Cấp đủ 2,000 mắt xem thật cao cấp từ tài khoản người dùng hoạt động lâu năm. Trực kỹ thuật 1-1.',
    heartsCommitment: 'Trên 500,000 lượt tim tap mãnh liệt.',
    commentsCommitment: 'Phân bổ 1,500+ comment chuyên sâu, tag bạn bè, chia sẻ phòng live.',
    algorithmImpact: 'Đưa phòng live lên vị trí số 1 toàn sàn. Phá đảo doanh số hàng trăm triệu đồng trong phiên.',
    recommendedFor: 'Doanh nghiệp lớn, Chuỗi thương hiệu, Phiên live kết hợp cùng KOC/KOL nổi tiếng.'
  }
];

// 6. NGUYÊN TẮC KHẤU TRỪ TOKEN VÀ HOÀN TIỀN TỰ ĐỘNG THEO PHÚT (METERING & REFUND ENGINE)
export const LIVE_METERING_POLICY = {
  EXPLANATION: 'Hệ thống áp dụng công nghệ đo đạc theo từng phút phát sóng thực tế (Real-Time Live Metering).',
  RULES: [
    {
      step: '1. Khóa Ngân Sách Ban Đầu',
      detail: 'Khi bạn kích hoạt phiên live, hệ thống tạm khóa số Token/Xu tương ứng với gói đã chọn trong Két Sàn Escrow.'
    },
    {
      step: '2. Khấu Trừ Chuẩn Theo Từng Phút',
      detail: 'Mỗi phút trôi qua khi phòng live đang phát sóng và có mắt xem thật tham gia, hệ thống mới tiến hành trừ tiền theo công thức: (Tổng tiền gói / Tổng số phút gói).'
    },
    {
      step: '3. Cam Kết Giữ Mắt (Live Retention Guarantee)',
      detail: 'Nếu có bất kỳ người xem nào thoát ra trước mốc tối thiểu (3 phút), hệ thống lập tức điều phối một người dùng thật khác vào lấp đầy vị trí trong vòng 15 giây mà không phát sinh thêm chi phí.'
    },
    {
      step: '4. Tự Động Hoàn Trả 100% Phút Thừa Nếu Tắt Live Sớm',
      detail: 'Ví dụ bạn mua gói 120 phút nhưng chỉ live 80 phút rồi nghỉ sớm do hết hàng: Hệ thống tự động hoàn trả 40 phút tiền còn lại (33.3% giá trị gói) về ngay ví của bạn trong 30 giây!'
    }
  ]
};

// 7. LỊCH PHÁT SÓNG LIVE SẮP TỚI & ĐĂNG KÝ TRƯỚC (RSVP)
export interface ScheduledLiveSession {
  id: string;
  shopName: string;
  shopHandle: string;
  shopAvatar: string;
  roomTitle: string;
  scheduledTime: string;
  category: string;
  targetEyes: number;
  rewardPerViewer: string;
  registeredCount: number;
  isRegistered: boolean;
}

export const INITIAL_SCHEDULED_LIVES: ScheduledLiveSession[] = [
  {
    id: 'sched_1',
    shopName: 'Mỹ Phẩm Cao Cấp ZenSkin',
    shopHandle: '@zenskin_vietnam',
    shopAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120',
    roomTitle: '🔥 MEGA LIVE 20H00: ĐẠI TIỆC SERUM B5 MUA 1 TẶNG 1 - TẶNG MÁY RỬA MẶT CHO 100 ĐƠN ĐẦU',
    scheduledTime: '20:00 Tối Nay',
    category: 'Mỹ Phẩm Skincare',
    targetEyes: 1000,
    rewardPerViewer: '+8,500 Xu / 15 phút',
    registeredCount: 428,
    isRegistered: false
  },
  {
    id: 'sched_2',
    shopName: 'Thời Trang Nam Aristino',
    shopHandle: '@aristino_menswear',
    shopAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    roomTitle: '⚡ XẢ KHO ĐỒNG GIÁ 199K: ÁO POLO VÀ SƠ MI CÔNG SỞ CAO CẤP',
    scheduledTime: '12:00 Trưa Mai',
    category: 'Thời Trang Nam',
    targetEyes: 500,
    rewardPerViewer: '+4,500 Xu / 10 phút',
    registeredCount: 312,
    isRegistered: true
  },
  {
    id: 'sched_3',
    shopName: 'Gia Dụng Thông Minh Homie',
    shopHandle: '@homie_smarthome',
    shopAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
    roomTitle: '🤖 TRÊN TAY NỒI CHIÊN KHÔNG DẦU ĐIỆN TỬ - TẶNG CHẢO CHỐNG DÍNH MỖI 15 PHÚT',
    scheduledTime: '19:30 Ngày Mai',
    category: 'Đồ Gia Dụng',
    targetEyes: 800,
    rewardPerViewer: '+6,200 Xu / 12 phút',
    registeredCount: 195,
    isRegistered: false
  }
];
