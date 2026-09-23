import { MarqueeTickerItem, MarqueeHistoryRecord } from '../types';

export const MARQUEE_BOOST_FEE_XU = 100000;

export const INITIAL_MARQUEE_ITEMS: MarqueeTickerItem[] = [
  // ── 1. CẢNH BÁO BẢO MẬT & PHÁP LÝ NGHỊ ĐỊNH 15/2020/NĐ-CP ──
  {
    id: 'marq_legal_warning_1',
    type: 'security_warning',
    title: '⚖️ CẢNH BÁO PHÁP LÝ: Nghiêm cấm mọi hành vi gian lận, dùng bot, cheat Xu. Vi phạm sẽ bị xử phạt theo Nghị định 15/2020/NĐ-CP và khóa ví vĩnh viễn!',
    channelHandle: '@phaply.avalive',
    targetUrl: 'https://avalive.app/policy',
    rewardText: 'Bảo Mật 40 Lớp Titan',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T00:00:00.000Z',
    priority: 1,
    badgeText: '⚖️ PHÁP LÝ',
    actionText: 'Xem Quy Định'
  },
  {
    id: 'marq_anti_fraud_2',
    type: 'security_warning',
    title: '🛡️ AVA SENTINEL 2026: Thoát ra vào lại không thao tác hoặc dùng script giả lập sẽ nhận 0 Xu và tự động khóa chuỗi nhiệm vụ trong 30-60 phút!',
    channelHandle: '@sentinel.system',
    targetUrl: 'https://avalive.app/security',
    rewardText: 'Zero-Trust Engine',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: '2026-09-23T00:00:00.000Z',
    priority: 1,
    badgeText: '🛡️ PHÒNG VỆ 40 LỚP',
    actionText: 'Tìm Hiểu'
  },
  // ── 2. PHIÊN LIVESTREAM HOT ĐANG PHÁT TRỰC TIẾP ──
  {
    id: 'marq_live_1',
    type: 'livestream',
    title: '🔴 ĐẠI TIỆC LIVE STREAM: Mỹ Phẩm & Chăm Sóc Da Cao Cấp (Flash Sale Giảm 50%)',
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
    title: '🔥 MEGA LIVE PK: Trực Tiếp Giao Lưu Cùng KOC Hàng Đầu & Tặng Quà Fan Cứng',
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
  // ── 3. CHIẾN DỊCH TĂNG TRƯỞNG & ĐẨY TOP MỚI NHẤT ──
  {
    id: 'marq_camp_1',
    type: 'campaign_video',
    title: '🚀 CHIẾN DỊCH VIP: Đẩy Top Video TikTok 1 Triệu View (Xem 15s + Thả Tim + Follow)',
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
  // ── 4. THÔNG BÁO GIAO DỊCH QUYẾT TOÁN & RÚT TIỀN THÀNH CÔNG ──
  {
    id: 'marq_payout_1',
    type: 'transaction_alert',
    title: '💸 QUYẾT TOÁN THÀNH CÔNG: Người dùng @hoang_nam vừa rút 3.500.000đ về Ngân Hàng Vietcombank qua cổng SePay!',
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
    actionText: 'Rút Tiền Ngay'
  },
  // ── 5. VINH DANH THÀNH VIÊN THĂNG HẠNG KIM CƯƠNG ──
  {
    id: 'marq_rank_1',
    type: 'rank_up',
    title: '👑 VINH DANH BẢNG VÀNG: Chúc mừng @koc_linh_dan vừa hoàn thành 2.000 nhiệm vụ và đạt Cấp Bậc Kim Cương (+300.000 Xu)!',
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
    actionText: 'Xem Bảng Vàng'
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
