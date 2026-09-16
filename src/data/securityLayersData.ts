import { SecurityLayerDef } from '../types';

export const MAX_TIKTOK_ACCOUNTS_PER_IP = 5;
export const MAX_GMAIL_ACCOUNTS_PER_IP = 5;
export const MAX_FACEBOOK_ACCOUNTS_PER_IP = 5;
export const MAX_YOUTUBE_ACCOUNTS_PER_IP = 5;

export const DEFAULT_CLIENT_IP = '118.69.182.45';

export const INITIAL_IP_ACCOUNTS: Record<string, string[]> = {};

export const SECURITY_7_LAYERS: SecurityLayerDef[] = [
  {
    layer: 1,
    name: 'Giới Hạn IP & Chống Bot Sàn (Max 5 Acc / IP)',
    code: 'IP_RATE_LIMIT_5',
    description: 'Chỉ cho phép tối đa 5 tài khoản Gmail, 5 kênh TikTok, 5 Facebook, 5 YouTube trên 1 địa chỉ IP. 1 tài khoản Gmail gắn chặt 1 kênh TikTok duy nhất. Tự động phong tỏa hành vi farm clone bot hàng loạt.',
    shieldStatus: 'active',
    blockedCount: 0,
    icon: '🌐'
  },
  {
    layer: 2,
    name: 'Tường Lửa Web & Anti-Bot AI',
    code: 'WAF_BOT_DEFENSE',
    description: 'Cloudflare Enterprise WAF + Kiểm tra chữ ký trình duyệt (Browser Fingerprinting), chặn 100% headless crawler, selenium script và auto-clicker gian lận.',
    shieldStatus: 'active',
    blockedCount: 0,
    icon: '🛡️'
  },
  {
    layer: 3,
    name: 'Xác Minh KYC CCCD & Sinh Trắc Học',
    code: 'KYC_BIOMETRICS',
    description: 'Đối soát căn cước công dân gắn chip & nhận diện khuôn mặt thật. Mỗi công dân chỉ được xác thực 1 định danh duy nhất, chống clone nhiều tài khoản trục lợi.',
    shieldStatus: 'active',
    blockedCount: 0,
    icon: '🪪'
  },
  {
    layer: 4,
    name: 'Két Ký Quỹ Smart Escrow Vault 3 Bên',
    code: 'ESCROW_VAULT_3WAY',
    description: 'Ký quỹ trung gian 3 bên khóa tiền cọc an toàn 100%. Cơ chế bảo hành nghiệm thu 3 ngày trước khi giải ngân, chống bùng kèo, quỵt tiền và vi phạm hợp đồng.',
    shieldStatus: 'active',
    blockedCount: 0,
    icon: '🔒'
  },
  {
    layer: 5,
    name: 'AI Engine Chống Gian Lận (Anti-Fraud)',
    code: 'FRAUD_TOKEN_GUARD',
    description: 'Thuật toán theo dõi hành vi buff ảo, hủy follow sau khi nhận Xu, gian lận task tự động. Tự động đóng băng số dư Xu và cấm rút tiền đối với tài khoản gian lận.',
    shieldStatus: 'active',
    blockedCount: 0,
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
    blockedCount: 0,
    icon: '⚖️'
  }
];

export const SECURITY_AUDIT_LOGS: Array<{ id: string; timestamp: string; ip: string; type: string; detail: string; severity: string }> = [];
