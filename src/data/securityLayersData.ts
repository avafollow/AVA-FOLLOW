import { SecurityLayerDef } from '../types';

export const MAX_TIKTOK_ACCOUNTS_PER_IP = 5;

export const DEFAULT_CLIENT_IP = '118.69.182.45';

export const INITIAL_IP_ACCOUNTS: Record<string, string[]> = {
  '118.69.182.45': [
    '@vietnam_creator_master',
    '@phuongbeauty_koc',
    '@zen_skincare_vn'
  ],
  '14.161.42.108': [
    '@linhdan.vlog',
    '@streetwear_genz'
  ],
  '171.244.38.92': [
    '@aivideo_procreator',
    '@foody_saigonreview',
    '@mebap.care',
    '@duc.coachgym'
  ]
};

export const SECURITY_7_LAYERS: SecurityLayerDef[] = [
  {
    layer: 1,
    name: 'Giới Hạn IP & Chống Bot Sàn',
    code: 'IP_RATE_LIMIT_5',
    description: 'Chỉ cho phép tối đa 5 tài khoản TikTok / 1 địa chỉ IP. Tự động phong tỏa mọi hành vi tạo clone bot hàng loạt, spam tool và đánh phá hạ tầng web.',
    shieldStatus: 'active',
    blockedCount: 1420,
    icon: '🌐'
  },
  {
    layer: 2,
    name: 'Tường Lửa Web & Anti-Bot AI',
    code: 'WAF_BOT_DEFENSE',
    description: 'Cloudflare Enterprise WAF + Kiểm tra chữ ký trình duyệt (Browser Fingerprinting), chặn 100% headless crawler, selenium script và auto-clicker gian lận.',
    shieldStatus: 'active',
    blockedCount: 3890,
    icon: '🛡️'
  },
  {
    layer: 3,
    name: 'Xác Minh KYC CCCD & Sinh Trắc Học',
    code: 'KYC_BIOMETRICS',
    description: 'Đối soát căn cước công dân gắn chip & nhận diện khuôn mặt thật. Mỗi công dân chỉ được xác thực 1 định danh duy nhất, chống clone nhiều tài khoản trục lợi.',
    shieldStatus: 'active',
    blockedCount: 215,
    icon: '🪪'
  },
  {
    layer: 4,
    name: 'Két Ký Quỹ Smart Escrow Vault 3 Bên',
    code: 'ESCROW_VAULT_3WAY',
    description: 'Ký quỹ trung gian 3 bên khóa tiền cọc an toàn 100%. Cơ chế bảo hành nghiệm thu 3 ngày trước khi giải ngân, chống bùng kèo, quỵt tiền và vi phạm hợp đồng.',
    shieldStatus: 'active',
    blockedCount: 48,
    icon: '🔒'
  },
  {
    layer: 5,
    name: 'AI Engine Chống Gian Lận (Anti-Fraud)',
    code: 'FRAUD_TOKEN_GUARD',
    description: 'Thuật toán theo dõi hành vi buff ảo, hủy follow sau khi nhận Xu, gian lận task tự động. Tự động đóng băng số dư Xu và cấm rút tiền đối với tài khoản gian lận.',
    shieldStatus: 'active',
    blockedCount: 560,
    icon: '⚡'
  },
  {
    layer: 6,
    name: 'Mã Hóa 256-bit AES & SSL/TLS End-to-End',
    code: 'AES_256_ENCRYPTION',
    description: 'Toàn bộ thông tin tài khoản ngân hàng, lịch sử giao dịch và token đều được mã hóa chuẩn quân sự AES-256 bits, ngăn chặn đánh cắp dữ liệu đường truyền.',
    shieldStatus: 'active',
    blockedCount: 0,
    icon: '🔑'
  },
  {
    layer: 7,
    name: 'Hội Đồng Trọng Tài & Phân Quyền RBAC 7 Cấp',
    code: 'RBAC_ARBITRATION_BOARD',
    description: 'Phân quyền nhân sự quản trị 7 cấp bậc độc lập (Super Admin, Tài Chính, KYC, CSKH, KOC Mgr, Campaign Mgr, Tech Admin), cùng Hội Đồng Trọng Tài phân xử tranh chấp 24h.',
    shieldStatus: 'active',
    blockedCount: 12,
    icon: '⚖️'
  }
];

export const SECURITY_AUDIT_LOGS = [
  { id: 'sec_1', timestamp: '10:14:22 - Hôm nay', ip: '42.118.23.19', type: 'BLOCKED_IP_LIMIT', detail: 'Chặn IP đăng ký tài khoản thứ 6 (đã đạt giới hạn 5/5 tài khoản)', severity: 'high' },
  { id: 'sec_2', timestamp: '09:45:11 - Hôm nay', ip: '113.190.88.2', type: 'WAF_BOT_DETECTED', detail: 'Phát hiện headless puppeteer bot cố tình spam task TikTok follow', severity: 'critical' },
  { id: 'sec_3', timestamp: '08:30:05 - Hôm nay', ip: '118.69.182.45', type: 'IP_CHECK_PASSED', detail: 'Kiểm tra địa chỉ IP an toàn (3/5 tài khoản hợp lệ)', severity: 'info' },
  { id: 'sec_4', timestamp: '07:12:44 - Hôm nay', ip: '27.72.61.15', type: 'KYC_DUPLICATE_ALERT', detail: 'Phát hiện số CCCD đã được sử dụng ở tài khoản khác', severity: 'medium' },
  { id: 'sec_5', timestamp: '06:05:19 - Hôm nay', ip: '171.244.11.8', type: 'ESCROW_SHIELD_ACTIVE', detail: 'Khóa quỹ cọc 4,500,000đ trong két an toàn 3 ngày bảo hành', severity: 'info' },
];
