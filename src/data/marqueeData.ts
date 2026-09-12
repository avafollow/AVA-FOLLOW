import { MarqueeTickerItem, MarqueeHistoryRecord } from '../types';

export const MARQUEE_BOOST_FEE_XU = 100000;

export const INITIAL_MARQUEE_ITEMS: MarqueeTickerItem[] = [
  {
    id: 'bcast_vip_initial',
    type: 'livestream',
    title: '🔥 ĐẠI TIỆC XẢ KHO 99K TIKTOK SHOP - BÃO MẮT XEM CỘNG ĐỒNG',
    channelHandle: '@thienvuaapp_official',
    targetUrl: 'https://tiktok.com/@thienvuaapp_official/live',
    targetQuantity: 500,
    deliveredQuantity: 340,
    rewardText: '👁️ +1,200 Xu/phút | ❤️ +200 Xu | 💬 +300 Xu | ↗️ +250 Xu',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'live',
    startTime: 'Đang phát sóng',
    priority: 1,
    orderId: 'ord_live_vip_1',
    badgeText: '🔴 TRỰC TIẾP TOP 1',
    actionText: 'Vào Xem Live Ngay'
  },
  {
    id: 'bcast_vip_beauty',
    type: 'livestream',
    title: '💄 FLASH SALE ĐỘC QUYỀN MỸ PHẨM CHÍNH HÃNG - ĐẨY 500 MẮT XEM',
    channelHandle: '@beauty_queen99',
    targetUrl: 'https://tiktok.com/@beauty_queen99/live',
    targetQuantity: 500,
    deliveredQuantity: 410,
    rewardText: '👁️ +1,000 Xu/phút | ❤️ +150 Xu | 💬 +250 Xu',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'live',
    startTime: 'Vừa phát sóng 12 phút trước',
    priority: 2,
    orderId: 'ord_live_vip_2',
    badgeText: '🔥 TRỰC TIẾP TOP 2',
    actionText: 'Vào Xem Live Ngay'
  },
  {
    id: 'bcast_camp_viral',
    type: 'campaign_video',
    title: '🚀 VIRAL VIDEO TIKTOK TRENDING HÈ 2026 - TĂNG 10,000 TIM & 2,000 CMT',
    channelHandle: '@vietnam_travel_vibes',
    targetUrl: 'https://tiktok.com/@vietnam_travel_vibes/video/7345678901234',
    targetQuantity: 10000,
    deliveredQuantity: 7420,
    rewardText: '❤️ +250 Xu / Tim | 💬 +500 Xu / Bình Luận Thật',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'running',
    startTime: 'Chiến dịch đang phân phối',
    priority: 3,
    badgeText: '⚡ VIDEO HOT TOP 3',
    actionText: 'Làm Nhiệm Vụ Ngay'
  },
  {
    id: 'bcast_vip_tech',
    type: 'livestream',
    title: '⚡ SALE BÙNG NỔ GIA DỤNG NHẬT BẢN - GIỮ MẮT XEM THƯỞNG XU LIÊN TỤC',
    channelHandle: '@giadung_nhatban',
    targetUrl: 'https://tiktok.com/@giadung_nhatban/live',
    targetQuantity: 300,
    deliveredQuantity: 285,
    rewardText: '👁️ +1,200 Xu/phút | ❤️ +200 Xu | ↗️ +250 Xu',
    hasMarqueeBoost: true,
    boostCostXu: 100000,
    isActive: true,
    status: 'live',
    startTime: 'Đang phát sóng',
    priority: 4,
    badgeText: '💎 VIP LIVE TOP 4',
    actionText: 'Vào Xem Live Ngay'
  }
];

export const INITIAL_MARQUEE_HISTORY: MarqueeHistoryRecord[] = [
  {
    id: 'hist_001',
    item: {
      id: 'bcast_old_01',
      type: 'livestream',
      title: 'Mega Live Khai Xuân Giáp Thìn - Bão Đơn Hàng Triệu View',
      channelHandle: '@shop_thoitrang_viet',
      targetUrl: 'https://tiktok.com/@shop_thoitrang_viet/live',
      targetQuantity: 1000,
      deliveredQuantity: 1000,
      rewardText: '👁️ +1,200 Xu/phút',
      hasMarqueeBoost: true,
      boostCostXu: 100000,
      isActive: false,
      status: 'ended',
      startTime: 'Hôm qua 19:30',
      endedAt: 'Hôm qua 21:30',
      priority: 1,
      badgeText: 'ĐÃ KẾT THÚC',
      actionText: 'Đã hoàn thành'
    },
    endedAt: '2026-09-11 21:30',
    totalReachedViewers: 1042,
    totalXuDistributed: 425000,
    reason: 'livestream_ended'
  },
  {
    id: 'hist_002',
    item: {
      id: 'bcast_old_02',
      type: 'campaign_video',
      title: 'Đẩy Trend Review Trà Sữa Size Khủng 1 Lít - TikTok Viral',
      channelHandle: '@foodie_saigon',
      targetUrl: 'https://tiktok.com/@foodie_saigon/video/73111222333',
      targetQuantity: 5000,
      deliveredQuantity: 5000,
      rewardText: '❤️ +250 Xu | 💬 +500 Xu',
      hasMarqueeBoost: true,
      boostCostXu: 100000,
      isActive: false,
      status: 'completed',
      startTime: '2 ngày trước',
      endedAt: 'Hôm qua 14:00',
      priority: 2,
      badgeText: 'ĐÃ KẾT THÚC',
      actionText: 'Đã hoàn thành'
    },
    endedAt: '2026-09-11 14:00',
    totalReachedViewers: 5200,
    totalXuDistributed: 1850000,
    reason: 'campaign_completed'
  }
];
