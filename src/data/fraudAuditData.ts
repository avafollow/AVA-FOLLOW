import { FraudAppealRecord, CampaignAuditTrailItem } from '../types';

export const INITIAL_FRAUD_APPEALS: FraudAppealRecord[] = [
  {
    id: 'appeal_171000101',
    userId: 'usr_ava_99',
    userEmail: 'quocthiencr90@gmail.com',
    userHandle: '@thienvuaapp',
    taskId: 'task_001',
    taskTitle: 'Follow Kênh TikTok Shop Thời Trang Ruby',
    taskType: 'follow',
    reasonCategory: 'network_lag',
    reasonLabel: 'Mạng chập chờn / Độ trễ TikTok API',
    customNote: 'Tôi đã bấm Follow trên điện thoại iPhone nhưng lúc đó mạng 4G yếu, sau đó hệ thống báo lỗi không nhận diện được. Tôi đã đính kèm ảnh chụp màn hình đang Follow.',
    proofImageUrls: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'approved',
    submittedAt: '2026-09-14T09:30:00Z',
    reviewedAt: '2026-09-14T10:15:00Z',
    reviewerNote: 'Kỹ thuật đã kiểm tra log API TikTok xác nhận kênh @thienvuaapp đã Follow @rubyshop. Đã hoàn 200 Xu và phục hồi 100 điểm uy tín.',
    compensationXu: 200,
    restoredTrustScore: 100
  },
  {
    id: 'appeal_171000102',
    userId: 'usr_linh_dan',
    userEmail: 'linhdan@gmail.com',
    userHandle: '@linhdan_creator',
    taskId: 'task_003',
    taskTitle: 'Thả Tim & Bình Luận Video Review Mỹ Phẩm',
    taskType: 'like',
    reasonCategory: 'browser_restriction',
    reasonLabel: 'Trình duyệt chặn Cookie / Tracking',
    customNote: 'Dùng Safari bật chế độ chặn cookie chéo nên không đồng bộ được. Đã mở lại bằng Chrome bình thường.',
    proofImageUrls: [],
    status: 'approved',
    submittedAt: '2026-09-15T08:00:00Z',
    reviewedAt: '2026-09-15T08:30:00Z',
    reviewerNote: 'Chấp thuận khiếu nại. Hoàn 300 Xu.',
    compensationXu: 300,
    restoredTrustScore: 100
  }
];

export const INITIAL_CAMPAIGN_AUDIT_TRAIL: CampaignAuditTrailItem[] = [
  {
    id: 'audit_88901',
    timestamp: '2026-09-15T13:40:12Z',
    taskId: 'task_001',
    campaignTitle: 'Follow Kênh TikTok Shop Thời Trang Ruby',
    creatorHandle: '@rubyshop_official',
    workerHandle: '@thienvuaapp',
    actionType: 'follow',
    rewardXu: 200,
    workerFollowingDelta: { before: 142, after: 143, delta: 1, verified: true },
    creatorFollowersDelta: { before: 12500, after: 12501, delta: 1, verified: true },
    status: 'verified_success',
    notes: 'Đối soát 2 chiều thành công qua webhook API TikTok.'
  },
  {
    id: 'audit_88902',
    timestamp: '2026-09-15T13:42:55Z',
    taskId: 'task_002',
    campaignTitle: 'Xem FYP 15s & Thả Tim Video Top 1',
    creatorHandle: '@tech_master_vn',
    workerHandle: '@linhdan_creator',
    actionType: 'like',
    rewardXu: 300,
    workerFollowingDelta: { before: 88, after: 88, delta: 0, verified: true },
    creatorFollowersDelta: { before: 45200, after: 45200, delta: 0, verified: true },
    status: 'verified_success',
    notes: 'Tương tác like đã được xác nhận qua token id.'
  },
  {
    id: 'audit_88903',
    timestamp: '2026-09-15T13:45:10Z',
    taskId: 'task_005',
    campaignTitle: 'Chiến Dịch Livestream Bán Hàng Trực Tiếp',
    creatorHandle: '@shop_me_be',
    workerHandle: '@hoang_anh_99',
    actionType: 'live',
    rewardXu: 400,
    workerFollowingDelta: { before: 310, after: 310, delta: 0, verified: true },
    creatorFollowersDelta: { before: 3200, after: 3200, delta: 0, verified: true },
    status: 'verified_success',
    notes: 'Xem trực tiếp phiên live 3 phút với tương tác tim liên tục.'
  }
];
