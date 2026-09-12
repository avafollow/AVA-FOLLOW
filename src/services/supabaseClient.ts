/**
 * Supabase Client & Data Synchronization Service
 * Đồng bộ toàn bộ dữ liệu người dùng, ví Xu, hợp đồng Escrow, KYC và tiếp thị liên kết
 * Nền tảng AVA FOLLOW GROWTH OS
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cấu hình kết nối từ biến môi trường hoặc cấu hình mặc định an toàn
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://bsmslbccqkvgiikrghpg.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbXNsYmNjcWt2Z2lpa3JnaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTg4MjQsImV4cCI6MjEwNDc5NDgyNH0.NStpjXimOgkvMzeU41m0sM-dJHYMi_yrzs3RfrZOh_0';
const SUPABASE_SERVICE_ROLE_KEY = (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbXNsYmNjcWt2Z2lpa3JnaHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxODgyNCwiZXhwIjoyMTA0Nzk0ODI0fQ.aDqrt6nyeC8REYJS_AWe2xv6yOr3LEotxcNBKh5yQ2s';

// Khởi tạo Supabase client chính thức
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Supabase Admin client dùng cho các tác vụ đồng bộ hệ thống & bảo mật
export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && (SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY));
};

export const getSupabaseConfig = () => {
  return {
    url: SUPABASE_URL,
    isReady: isSupabaseConfigured(),
    projectRef: 'bsmslbccqkvgiikrghpg'
  };
};

/**
 * 1. ĐỒNG BỘ SỔ CÁI XU & TOKEN (TOKEN LEDGER)
 */
export async function syncTokenLedgerToSupabase(record: {
  userId: string;
  txType: string;
  tokenAmount: number;
  tokenBalanceAfter: number;
  vndEquivalent: number;
  note: string;
}) {
  try {
    // 1. Thử gửi tới bảng Postgres token_ledger
    const { error: dbError } = await supabaseAdmin.from('token_ledger').insert([{
      user_id: record.userId,
      user_email: (record as any).userEmail || 'creator@avafollow.vn',
      tx_type: record.txType,
      token_amount: record.tokenAmount,
      balance_after: record.tokenBalanceAfter,
      vnd_equivalent: record.vndEquivalent,
      note: record.note
    }]);

    if (!dbError) return { success: true };

    // 2. Fallback lưu trữ an toàn vào Storage bucket ava_data_sync
    const logId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload(`transactions/${logId}.json`, JSON.stringify(record, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu sổ cái biến động Xu:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. ĐỒNG BỘ HỒ SƠ KYC LÊN SUPABASE
 */
export async function syncKycToSupabase(kycData: {
  userId: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  frontIdCardUrl: string;
  backIdCardUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  userEmail?: string;
}) {
  try {
    const payload = {
      user_id: kycData.userId,
      user_email: kycData.userEmail || `${kycData.userId}@avafollow.vn`,
      full_name: kycData.fullName,
      id_number: kycData.idNumber,
      date_of_birth: kycData.dateOfBirth,
      front_id_card_url: kycData.frontIdCardUrl,
      back_id_card_url: kycData.backIdCardUrl,
      bank_name: kycData.bankName,
      bank_account_number: kycData.bankAccountNumber,
      bank_account_holder: kycData.bankAccountHolder,
      status: 'pending'
    };

    const { error: dbError } = await supabaseAdmin.from('kyc_verifications').insert([payload]);
    if (!dbError) return { success: true };

    // Fallback sync to Storage
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload(`kyc/${kycData.userId}.json`, JSON.stringify(payload, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu hồ sơ KYC:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 3. ĐỒNG BỘ HỢP ĐỒNG KÝ QUỸ ESCROW (KHÓA XU BẢO VỆ 2 BÊN)
 */
export async function syncEscrowContractToSupabase(contract: {
  contractCode: string;
  clientName: string;
  kocName: string;
  kocHandle: string;
  title: string;
  category: string;
  totalEscrowAmount: string;
  requirements: string;
  deadlineDays: number;
  status: string;
}) {
  try {
    const rawAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, '')) || 0;
    const platformFee = Math.round(rawAmount * 0.20);
    const kocPayout = rawAmount - platformFee;

    const payload = {
      contract_code: contract.contractCode,
      client_name: contract.clientName,
      koc_name: contract.kocName,
      koc_handle: contract.kocHandle,
      title: contract.title,
      category: contract.category,
      total_escrow_amount: rawAmount,
      koc_payout_amount: kocPayout,
      platform_fee: platformFee,
      requirements: contract.requirements,
      deadline_days: contract.deadlineDays,
      status: contract.status
    };

    const { error: dbError } = await supabaseAdmin.from('escrow_contracts').insert([payload]);
    if (!dbError) return { success: true };

    // Fallback Storage sync
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload(`escrow/${contract.contractCode}.json`, JSON.stringify(payload, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu hợp đồng Escrow:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 4. ĐỒNG BỘ ĐƠN ĐẶT MUA GÓI TĂNG TRƯỞNG DỊCH VỤ
 */
export async function syncOrderToSupabase(order: {
  userId: string;
  packageId: string;
  packageTitle: string;
  category: string;
  priceVnd: number;
  tokenPaid: number;
  paymentCurrency: string;
  targetUrl: string;
  targetQuantity: number;
}) {
  try {
    const payload = {
      user_id: order.userId,
      package_id: order.packageId,
      package_title: order.packageTitle,
      category: order.category,
      price_vnd: order.priceVnd,
      coins_paid: order.tokenPaid,
      target_url: order.targetUrl,
      target_quantity: order.targetQuantity,
      status: 'running'
    };

    const { error: dbError } = await supabaseAdmin.from('service_orders').insert([payload]);
    if (!dbError) return { success: true };

    const orderId = `order_${Date.now()}`;
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload(`orders/${orderId}.json`, JSON.stringify(payload, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu đơn hàng:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 5. TẠO HOẶC ĐỒNG BỘ TÀI KHOẢN NGƯỜI DÙNG MỚI LÊN SUPABASE AUTH
 * Tự động cấp 5.000 Xu chào mừng và lưu mã giới thiệu người mời
 */
export async function registerUserToSupabase(user: {
  email: string;
  password?: string;
  name: string;
  tiktokHandle?: string;
  referredBy?: string;
}) {
  try {
    const defaultPassword = user.password || 'Password123@#$';
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: defaultPassword,
      options: {
        data: {
          name: user.name,
          tiktokHandle: user.tiktokHandle || '',
          coins: 5000, // +5.000 Xu chào mừng gia nhập
          referredBy: user.referredBy || 'THIENVUAAPP88'
        }
      }
    });

    if (error) {
      // Nếu email đã tồn tại, tiến hành đăng nhập
      if (error.message.includes('already')) {
        const loginRes = await supabase.auth.signInWithPassword({
          email: user.email,
          password: defaultPassword
        });
        return { success: true, user: loginRes.data.user };
      }
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
