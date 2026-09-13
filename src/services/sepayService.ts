/**
 * SePay & VietQR Payment Service Adapter
 * Cổng thanh toán quét mã QR tự động SePay cho AVA FOLLOW
 * Tài khoản nhận tiền chính thức Techcombank: NGUYEN QUOC THIEN - 19035907828017
 */

export const SEPAY_BANK_CONFIG = {
  bankShortName: 'TCB',
  bankName: 'Techcombank',
  bankFullName: 'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)',
  bin: '970407',
  accountNumber: '19035907828017',
  accountName: 'NGUYEN QUOC THIEN',
  logoUrl: 'https://api.vietqr.io/img/TCB.png'
};

export interface SepayQrConfig {
  bankShortName?: string;   // TCB
  bankName?: string;        // Techcombank
  accountNumber?: string;   // 19035907828017
  accountName?: string;     // NGUYEN QUOC THIEN
  amount: number;           // VNĐ
  orderCode: string;        // Mã giao dịch độc nhất (vd: AVAXU8821, AVAAPP102)
  description?: string;
}

const SEPAY_API_KEY = (import.meta as any).env?.VITE_SEPAY_API_KEY || '';

export const isSepayConfigured = (): boolean => {
  return true;
};

/**
 * Sinh link mã QR thanh toán chuẩn SePay VietQR tự động
 */
export function generateSepayQrUrl(config: SepayQrConfig): string {
  const acc = config.accountNumber || SEPAY_BANK_CONFIG.accountNumber;
  const bank = config.bankName || SEPAY_BANK_CONFIG.bankName;
  const amount = Math.round(config.amount);
  const memo = encodeURIComponent(config.orderCode.toUpperCase());
  return `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${amount}&des=${memo}&template=compact`;
}

/**
 * Sinh link mã QR chuẩn VietQR Napas 24/7 dự phòng
 */
export function generateVietQrUrl(config: SepayQrConfig): string {
  const bankShort = config.bankShortName || SEPAY_BANK_CONFIG.bankShortName;
  const acc = config.accountNumber || SEPAY_BANK_CONFIG.accountNumber;
  const accName = encodeURIComponent(config.accountName || SEPAY_BANK_CONFIG.accountName);
  const amount = Math.round(config.amount);
  const memo = encodeURIComponent(config.orderCode.toUpperCase());
  return `https://img.vietqr.io/image/${bankShort}-${acc}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accName}`;
}

/**
 * Tính số lượng Token quy đổi từ số tiền VNĐ nạp vào (1 Token = 1,000đ = 1,000 Xu cố định)
 */
export function calculateTokensFromVND(amountVND: number): number {
  const TOKEN_PRICE_VND = 1000;
  return Math.floor(amountVND / TOKEN_PRICE_VND);
}

/**
 * Tính số tiền VNĐ cần nạp để mua lượng Token mong muốn (1 Token = 1,000đ)
 */
export function calculateVNDFromTokens(tokenCount: number): number {
  const TOKEN_PRICE_VND = 1000;
  return tokenCount * TOKEN_PRICE_VND;
}

/**
 * 5 Gói nạp tiền mua thêm Xu (Thấp nhất 500.000đ, Tặng thêm tối đa 10% Xu)
 */
export interface CoinTopupPackage {
  id: string;
  amountVnd: number;
  baseCoins: number;
  bonusPercent: number; // 2%, 4%, 6%, 8%, 10%
  bonusCoins: number;
  totalCoins: number;
  tokenEquivalent: number;
  badge?: string;
  isPopular?: boolean;
}

export const COIN_TOPUP_PACKAGES: CoinTopupPackage[] = [
  {
    id: 'topup_500k',
    amountVnd: 500000,
    baseCoins: 500000,
    bonusPercent: 2,
    bonusCoins: 10000,
    totalCoins: 510000,
    tokenEquivalent: 500,
    badge: 'Khởi Đầu 500K'
  },
  {
    id: 'topup_1m',
    amountVnd: 1000000,
    baseCoins: 1000000,
    bonusPercent: 4,
    bonusCoins: 40000,
    totalCoins: 1040000,
    tokenEquivalent: 1000,
    badge: 'Bán Chạy Nhất',
    isPopular: true
  },
  {
    id: 'topup_2m',
    amountVnd: 2000000,
    baseCoins: 2000000,
    bonusPercent: 6,
    bonusCoins: 120000,
    totalCoins: 2120000,
    tokenEquivalent: 2000,
    badge: 'Tiết Kiệm +6%'
  },
  {
    id: 'topup_5m',
    amountVnd: 5000000,
    baseCoins: 5000000,
    bonusPercent: 8,
    bonusCoins: 400000,
    totalCoins: 5400000,
    tokenEquivalent: 5000,
    badge: 'Shop Lớn +8%'
  },
  {
    id: 'topup_10m',
    amountVnd: 10000000,
    baseCoins: 10000000,
    bonusPercent: 10,
    bonusCoins: 1000000,
    totalCoins: 11000000,
    tokenEquivalent: 10000,
    badge: 'Thưởng Max +10%'
  }
];
