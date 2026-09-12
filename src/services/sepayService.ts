/**
 * SePay & VietQR Payment Service Adapter
 * Cổng thanh toán quét mã QR tự động SePay cho Việt Nam
 */

export interface SepayQrConfig {
  bankShortName: string;   // MB, VCB, TCB, ACB, TPB
  accountNumber: string;   // 999988886666
  accountName: string;     // NGUYEN VAN MINH
  amount: number;          // VNĐ
  orderCode: string;       // Mã nạp tiền (vd: NAP8899)
  description?: string;
}

const SEPAY_API_KEY = (import.meta as any).env?.VITE_SEPAY_API_KEY || '';

export const isSepayConfigured = (): boolean => {
  return Boolean(SEPAY_API_KEY);
};

/**
 * Sinh link mã QR thanh toán chuẩn VietQR tự động
 */
export function generateVietQrUrl(config: SepayQrConfig): string {
  const { bankShortName, accountNumber, accountName, amount, orderCode } = config;
  const memo = encodeURIComponent(`${orderCode}`);
  const accNameEncoded = encodeURIComponent(accountName);
  return `https://img.vietqr.io/image/${bankShortName}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accNameEncoded}`;
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
