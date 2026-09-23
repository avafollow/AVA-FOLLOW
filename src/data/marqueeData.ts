import { MarqueeTickerItem, MarqueeHistoryRecord } from '../types';

export const MARQUEE_BOOST_FEE_XU = 100000;

export const INITIAL_MARQUEE_ITEMS: MarqueeTickerItem[] = [
  // ── 1. CẢNH BÁO PHÁP LÝ & CHỐNG LỪA ĐẢO / VI PHẠM PHÁP LUẬT ──
  {
    id: 'marq_legal_warning_1',
    type: 'security_warning',
    title: '⚖️ CẢNH BÁO PHÁP LÝ: Nghiêm cấm mọi hành vi lừa đảo, giả mạo, sử dụng tài khoản sai mục đích. Vi phạm bị xử phạt theo Nghị định 15/2020/NĐ-CP và khóa vĩnh viễn!',
    channelHandle: '@phaply.avalive',
    targetUrl: 'https://avalive.app/policy',
    rewardText: 'Nghị Định 15/2020/NĐ-CP',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T00:00:00.000Z',
    priority: 1,
    badgeText: '⚖️ PHÁP LÝ & AN TOÀN',
    actionText: 'Xem Cảnh Báo',
    detailedContent: 'Nền tảng AvaLive hoạt động tuân thủ 100% quy định pháp luật Việt Nam. Mọi hành vi tạo tài khoản ảo, can thiệp mã nguồn, sử dụng công cụ gian lận để chiếm đoạt tài sản của sàn hoặc của chủ shop đều bị nghiêm cấm.',
    legalReference: 'Căn cứ Điều 101, 102 Nghị định 15/2020/NĐ-CP quy định xử phạt vi phạm hành chính trong lĩnh vực bưu chính, viễn thông, tần số vô tuyến điện, CNTT và an toàn thông tin mạng; Điều 174 Bộ luật Hình sự về tội Lừa đảo chiếm đoạt tài sản.',
    tips: 'Người dùng cần bảo vệ thông tin cá nhân, không chia sẻ mã OTP/Mật khẩu cho bất kỳ ai. Mọi giao dịch nạp rút chỉ thực hiện qua tài khoản ngân hàng chính chủ.'
  },
  {
    id: 'marq_anti_fraud_2',
    type: 'security_warning',
    title: '🛡️ BẢO VỆ TỰ ĐỘNG: Thoát ra vào lại không thao tác thật sẽ nhận 0 Xu & tự động đóng băng chuỗi nhiệm vụ 30 phút để bảo vệ ngân sách chiến dịch!',
    channelHandle: '@sentinel.system',
    targetUrl: 'https://avalive.app/security',
    rewardText: 'Phòng Vệ Tự Động',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T00:00:00.000Z',
    priority: 1,
    badgeText: '🛡️ CHỐNG GIAN LẬN',
    actionText: 'Tìm Hiểu',
    detailedContent: 'Hệ thống tự động phát hiện và ngăn chặn các hành vi bấm xác nhận nhận Xu khi chưa thực hiện tương tác thật trên kênh (chưa follow, chưa like, chưa xem video hoặc dùng phần mềm click ảo).',
    legalReference: 'Quy định bảo vệ ngân sách nhà quảng cáo và cam kết chất lượng người dùng thật 100% của hệ sinh thái AvaLive.',
    tips: 'Hãy mở TikTok/Facebook và thực hiện đầy đủ thao tác thật để được cộng Xu tức thì vào ví.'
  },
  // ── 2. PHIÊN LIVESTREAM SẢN PHẨM & FLASH SALE HOT ──
  {
    id: 'marq_live_1',
    type: 'livestream',
    title: '🔴 ĐẠI TIỆC LIVE STREAM: Mỹ Phẩm & Chăm Sóc Da Cao Cấp (Flash Sale Giảm 50% - Xem Live Nhận Xu)',
    channelHandle: '@phuongthao_beauty',
    targetUrl: 'https://www.tiktok.com/@phuongthao_beauty/live',
    targetQuantity: 2500,
    deliveredQuantity: 1840,
    rewardText: '+400 Xu / phút',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'live',
    startTime: '2026-09-23T10:00:00.000Z',
    priority: 1,
    badgeText: '🔴 LIVE HOT #1',
    actionText: 'Vào Xem Live'
  },
  {
    id: 'marq_live_2',
    type: 'livestream',
    title: '🔥 MEGA LIVE PK: Trực Tiếp Giao Lưu Cùng KOC Hàng Đầu & Tặng Quà Khủng Cho Fan Cứng',
    channelHandle: '@vietnam_creator_hub',
    targetUrl: 'https://www.tiktok.com/@vietnam_creator_hub/live',
    targetQuantity: 3000,
    deliveredQuantity: 2450,
    rewardText: '+500 Xu / phút',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'live',
    startTime: '2026-09-23T11:30:00.000Z',
    priority: 1,
    badgeText: '🔥 MEGA PK',
    actionText: 'Xem Ngay'
  },
  // ── 3. CHIẾN DỊCH SẢN PHẨM TĂNG TRƯỞNG & ĐẨY TOP ──
  {
    id: 'marq_camp_1',
    type: 'campaign_video',
    title: '🚀 CHIẾN DỊCH SẢN PHẨM: Đẩy Top Video Thời Trang 1 Triệu View (Xem 15s + Thả Tim + Follow Nhận Combo Xu)',
    channelHandle: '@thoitrang_genz_official',
    targetUrl: 'https://www.tiktok.com/@thoitrang_genz_official/video/7391827461928374829',
    targetQuantity: 5000,
    deliveredQuantity: 3920,
    rewardText: '+1.200 Xu Combo',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T08:00:00.000Z',
    priority: 2,
    badgeText: '💎 CHIẾN DỊCH TOP',
    actionText: 'Làm Nhiệm Vụ'
  },
  // ── 4. THÔNG BÁO GIAO DỊCH QUYẾT TOÁN TIỀN MẶT THÀNH CÔNG ──
  {
    id: 'marq_payout_1',
    type: 'transaction_alert',
    title: '💸 QUYẾT TOÁN THÀNH CÔNG: Thành viên @hoang_nam vừa rút 3.500.000đ về Ngân Hàng Vietcombank qua SePay VietQR 24/7!',
    channelHandle: '@hoang_nam_koc',
    targetUrl: 'https://avalive.app/wallet',
    rewardText: 'Đã Nhận 3.500.000đ',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T13:00:00.000Z',
    priority: 3,
    badgeText: '💸 RÚT TIỀN 24/7',
    actionText: 'Xem Chi Tiết',
    detailedContent: 'Lệnh rút tiền 3.500.000đ từ tài khoản @hoang_nam_koc đã được hệ thống quyết toán tự động 100% qua cổng SePay VietQR với mã đối soát công khai.',
    tips: 'Tiền mặt được chuyển trực tiếp vào tài khoản ngân hàng chính chủ của người dùng trong vòng 30 giây.'
  },
  // ── 5. VINH DANH THÀNH VIÊN THĂNG HẠNG KIM CƯƠNG ──
  {
    id: 'marq_rank_1',
    type: 'rank_up',
    title: '👑 VINH DANH BẢNG VÀNG: Chúc mừng @koc_linh_dan vừa xuất sắc hoàn thành 2.000 nhiệm vụ và đạt Cấp Bậc Kim Cương (+300.000 Xu Thưởng)!',
    channelHandle: '@koc_linh_dan',
    targetUrl: 'https://avalive.app/rank',
    rewardText: '+300.000 Xu Thưởng',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T14:00:00.000Z',
    priority: 3,
    badgeText: '👑 THĂNG HẠNG',
    actionText: 'Xem Bảng Vàng',
    detailedContent: 'Thành viên @koc_linh_dan đã xuất sắc vượt qua mốc 2.000 nhiệm vụ với điểm uy tín 100/100, chính thức thăng cấp bậc Kim Cương và nhận thưởng nóng +300.000 Xu cùng đặc quyền tối đa của sàn!',
    tips: 'Hãy duy trì chất lượng tương tác thật để thăng cấp và nhận thêm nhiều phần thưởng hấp dẫn.'
  }
];

export const INITIAL_MARQUEE_HISTORY: MarqueeHistoryRecord[] = [
  {
    id: 'hist_1',
    item: INITIAL_MARQUEE_ITEMS[2],
    endedAt: '2026-09-22T23:00:00.000Z',
    totalReachedViewers: 12500,
    totalXuDistributed: 4800000,
    reason: 'campaign_completed'
  }
];
