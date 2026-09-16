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

// ===== KHO NGUYÊN LIỆU FOLLOW CHÉO CỘNG ĐỒNG (100% Chiến dịch do người dùng tạo) =====
export const INITIAL_CROSS_FOLLOW_ITEMS: CrossFollowItem[] = [];

// ==============================================================================
// 8 CƠ CHẾ TRIỆT TIÊU & ĐỐT TOKEN TỰ ĐỘNG (TOKEN SINK & DEFLATION ENGINE)
// ==============================================================================
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
