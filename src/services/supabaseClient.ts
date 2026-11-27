/**
 * Supabase Client & Data Synchronization Service
 * Đồng bộ toàn bộ dữ liệu người dùng, ví Xu, hợp đồng Escrow, KYC và tiếp thị liên kết
 * Nền tảng AVA FOLLOW GROWTH OS
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cấu hình kết nối từ biến môi trường hoặc cấu hình mặc định an toàn
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vjsymzbaiyzuryvdniwd.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_tcxsNyytQ_quQ6ODuWtF8w_j96MyTYq';
const SUPABASE_SERVICE_ROLE_KEY = (import.meta as any).env?.VITE_SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

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
    projectRef: 'vjsymzbaiyzuryvdniwd'
  };
};

/**
 * 0. KEEP-ALIVE HEARTBEAT: Tự động ghi nhận hoạt động thực để Supabase không bao giờ bị tạm dừng
 */
export async function pingSupabaseKeepAlive(source = 'web_client') {
  try {
    const { data: existing } = await supabase
      .from('system_keepalive')
      .select('ping_count')
      .eq('id', 1)
      .maybeSingle();

    const nextCount = Number(existing?.ping_count || 0) + 1;
    await supabase.from('system_keepalive').upsert({
      id: 1,
      service_name: 'AVA_FOLLOW_SUPABASE',
      status: 'ACTIVE',
      ping_count: nextCount,
      last_ping_source: source,
      last_ping_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch {}
}

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

/**
 * 6. KẾT NỐI ĐĂNG NHẬP OAUTH CÁC NỀN TẢNG QUA SUPABASE & DIRECT LOGIN
 */
export async function signInWithGoogleOAuth(includeYouTubeScopes = false) {
  const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  try {
    const options: any = {
      redirectTo: redirectOrigin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    };
    if (includeYouTubeScopes) {
      options.scopes = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl';
    }
    const res = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options
    });
    return res;
  } catch (err: any) {
    console.warn('Google OAuth error:', err);
    return { data: null, error: err };
  }
}

export async function signInWithTikTokOAuth() {
  const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5050';
  const clientKey = 'aw4178gvdksjfkse';
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,user.info.profile,video.list&response_type=code&redirect_uri=${encodeURIComponent(redirectOrigin)}&state=tiktok_auth_state`;
  return { data: { url: authUrl, isDirectProvider: true }, error: null };
}

export async function signInWithFacebookOAuth() {
  const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5050';
  const fbAppId = '1088492089381928';
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(redirectOrigin)}&scope=email,public_profile`;
  return { data: { url: authUrl, isDirectProvider: true }, error: null };
}

/**
 * 7. ĐỒNG BỘ TOÀN BỘ HỒ SƠ & VÍ TIỀN NGƯỜI DÙNG LÊN SUPABASE
 */
export async function syncUserProfileToSupabase(userProfile: any) {
  try {
    if (!userProfile || !userProfile.email) return { success: false };
    
    // Thử lưu vào bảng profiles nếu có
    const payload = {
      id: userProfile.id || userProfile.email,
      email: userProfile.email,
      name: userProfile.name,
      avatar: userProfile.avatar,
      phone: userProfile.phone,
      bio: userProfile.bio,
      tiktok_connected: userProfile.tiktokConnected,
      facebook_connected: userProfile.facebookConnected,
      avalive_coins: userProfile.avaliveCoins !== undefined ? userProfile.avaliveCoins : (userProfile.coinsBalance !== undefined ? userProfile.coinsBalance : (userProfile.tokenBalance || 0)),
      coins_value_vnd: userProfile.coinsValueVND || `${((userProfile.avaliveCoins ?? userProfile.coinsBalance ?? 0) * 10).toLocaleString()}đ`,
      granted_coins_total: userProfile.grantedCoinsTotal || 0,
      locked_escrow_coins: userProfile.lockedEscrowCoins,
      pending_commission_vnd: userProfile.pendingCommissionVND,
      total_commission_withdrawn_vnd: userProfile.totalCommissionWithdrawnVND,
      rank_level: userProfile.rankLevel,
      kyc_status: userProfile.kycStatus,
      bank_info: userProfile.bankInfo,
      transactions: userProfile.transactions,
      updated_at: new Date().toISOString()
    };

    const { error: dbError } = await supabaseAdmin
      .from('user_profiles')
      .upsert([payload], { onConflict: 'email' });

    if (!dbError) return { success: true };

    // Fallback lưu file an toàn lên Supabase Storage bucket ava_data_sync
    const cleanEmail = userProfile.email.replace(/[^a-zA-Z0-9_.-]/g, '_');
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload(`profiles/${cleanEmail}.json`, JSON.stringify(userProfile, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu hồ sơ người dùng lên Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 8. ĐỒNG BỘ TOÀN BỘ CHIẾN DỊCH THẬT LÊN SUPABASE
 */
export async function syncCampaignsToSupabase(campaigns: any[]) {
  try {
    if (!Array.isArray(campaigns)) return { success: false };

    // Lưu vào bảng campaigns
    if (campaigns.length > 0) {
      const dbPayload = campaigns.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        channel_handle: c.channelHandle,
        target_url: c.targetUrl,
        target_quantity: c.targetQuantity,
        completed_quantity: c.completedQuantity || 0,
        budget_total: c.budgetTotal,
        price_per_action: c.pricePerAction,
        instructions: c.instructions,
        status: c.status,
        is_boosted: c.isBoosted || false,
        created_at: c.createdAt,
        updated_at: new Date().toISOString()
      }));

      const { error: dbError } = await supabaseAdmin
        .from('campaigns')
        .upsert(dbPayload, { onConflict: 'id' });

      if (!dbError) return { success: true };
    }

    // Fallback lưu snapshot toàn bộ chiến dịch lên Storage
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload('campaigns/all_campaigns.json', JSON.stringify(campaigns, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true, fallback: true };
  } catch (err: any) {
    console.warn('Lưu chiến dịch lên Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 9. ĐỒNG BỘ TOÀN BỘ NHIỆM VỤ LÊN SUPABASE
 */
export async function syncTasksToSupabase(tasks: any[], livestreamTasks: any[]) {
  try {
    const payload = {
      tasks,
      livestreamTasks,
      updatedAt: new Date().toISOString()
    };

    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload('tasks/all_tasks.json', JSON.stringify(payload, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true };
  } catch (err: any) {
    console.warn('Lưu danh sách nhiệm vụ lên Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 10. ĐỒNG BỘ HOA HỒNG & MẠNG LƯỚI AFFILIATE LÊN SUPABASE
 */
export async function syncAffiliateToSupabase(affiliateData: any) {
  try {
    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload('affiliate/affiliate_stats.json', JSON.stringify(affiliateData, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true };
  } catch (err: any) {
    console.warn('Lưu dữ liệu Affiliate lên Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 11. ĐỒNG BỘ BẢN SAO LƯU MASTER SNAPSHOT TOÀN HỆ THỐNG
 */
export async function syncMasterSnapshotToSupabase(snapshot: {
  user?: any;
  adminUsers?: any[];
  campaigns?: any[];
  tasks?: any[];
  livestreamTasks?: any[];
  escrowBookings?: any[];
  affiliateData?: any;
  adminData?: any;
  [key: string]: any;
}) {
  try {
    const masterPayload = {
      ...snapshot,
      backupTimestamp: new Date().toISOString(),
      systemVersion: 'AVA_GROWTH_OS_3.0_PERMANENT'
    };

    await supabaseAdmin.storage
      .from('ava_data_sync')
      .upload('system/master_snapshot.json', JSON.stringify(masterPayload, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    return { success: true };
  } catch (err: any) {
    console.warn('Lưu Master Snapshot lên Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 12. TẢI TOÀN BỘ MASTER SNAPSHOT TỪ CLOUD (ĐỒNG BỘ ĐA THIẾT BỊ MÁY TÍNH & ĐIỆN THOẠI)
 */
export async function fetchMasterSnapshotFromSupabase(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('ava_data_sync')
      .download('system/master_snapshot.json');

    if (error || !data) {
      return { success: false, error: error?.message || 'Chưa có bản sao lưu trên Cloud' };
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 13. TẢI HỒ SƠ NGƯỜI DÙNG CỤ THỂ TỪ SUPABASE CLOUD THEO EMAIL
 */
export async function fetchUserProfileFromSupabase(email: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!email) return { success: false, error: 'Email trống' };
    const cleanEmail = email.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, '_');

    // 1. Tải từ Storage
    const { data: storageData, error: storageErr } = await supabaseAdmin.storage
      .from('ava_data_sync')
      .download(`profiles/${cleanEmail}.json`);

    if (storageData) {
      const text = await storageData.text();
      const parsed = JSON.parse(text);
      return { success: true, data: parsed };
    }

    // 2. Thử truy vấn bảng user_profiles Postgres
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (dbData) {
      return { success: true, data: dbData };
    }

    return { success: false, error: storageErr?.message || dbError?.message || 'Không tìm thấy hồ sơ trên Cloud' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * 14. TẢI TẤT CẢ HỒ SƠ NGƯỜI DÙNG TỪ SUPABASE CLOUD (ĐỒNG BỘ ĐẦY ĐỦ CHO TRANG QUẢN TRỊ ADMIN)
 */
export async function fetchAllProfilesFromSupabase(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const profiles: any[] = [];
    const seenEmails = new Set<string>();

    // 1. Lấy từ bảng Postgres user_profiles
    try {
      const { data: dbUsers, error: dbErr } = await supabaseAdmin
        .from('user_profiles')
        .select('*');
      if (!dbErr && dbUsers && Array.isArray(dbUsers)) {
        for (const u of dbUsers) {
          const email = (u.email || '').toLowerCase();
          if (email && !seenEmails.has(email)) {
            seenEmails.add(email);
            profiles.push(u);
          }
        }
      }
    } catch (_) {}

    // 2. Liệt kê toàn bộ file JSON trong bucket ava_data_sync/profiles/
    try {
      const { data: fileList, error: listErr } = await supabaseAdmin.storage
        .from('ava_data_sync')
        .list('profiles', { limit: 1000 });

      if (!listErr && fileList && Array.isArray(fileList)) {
        for (const file of fileList) {
          if (file.name && file.name.endsWith('.json')) {
            try {
              const { data: fileData } = await supabaseAdmin.storage
                .from('ava_data_sync')
                .download(`profiles/${file.name}`);
              if (fileData) {
                const text = await fileData.text();
                const parsed = JSON.parse(text);
                const email = (parsed.email || '').toLowerCase();
                if (email) {
                  if (!seenEmails.has(email)) {
                    seenEmails.add(email);
                    profiles.push(parsed);
                  } else {
                    // Cập nhật thông tin mới nhất
                    const existingIdx = profiles.findIndex(p => p.email?.toLowerCase() === email);
                    if (existingIdx >= 0) {
                      profiles[existingIdx] = { ...profiles[existingIdx], ...parsed };
                    }
                  }
                }
              }
            } catch (_) {}
          }
        }
      }
    } catch (_) {}

    return { success: true, data: profiles };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 10. REALTIME SYNCHRONIZATION BUS (BROADCASTCHANNEL & SUPABASE REALTIME)
// ==============================================================================

export type RealtimeEventType =
  | 'ADMIN_GRANT_COINS'
  | 'ADMIN_GRANT_PACKAGE'
  | 'ADMIN_GRANT_PERMISSIONS'
  | 'ADMIN_GRANT_FOLLOWERS'
  | 'ADMIN_UPDATE_RANK'
  | 'ADMIN_UPDATE_USER'
  | 'ADMIN_DELETE_USER'
  | 'COMMISSION_SETTINGS_UPDATED'
  | 'TASK_COMPLETED'
  | 'USER_PURCHASE_PACKAGE'
  | 'USER_PROFILE_SYNC'
  | 'USER_LOGGED_OUT'
  | 'MASTER_SNAPSHOT_SYNC'
  | 'FORCE_FULL_SYNC';

export interface RealtimeMessage {
  id: string;
  type: RealtimeEventType;
  senderId: string;
  timestamp: number;
  payload: any;
}

const CHANNEL_NAME = 'ava_realtime_sync_v3';
let broadcastChannel: BroadcastChannel | null = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (err) {
  console.warn('[RealtimeSyncBus] BroadcastChannel not supported:', err);
}

const realtimeListeners: Array<(msg: RealtimeMessage) => void> = [];

if (broadcastChannel) {
  broadcastChannel.onmessage = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      realtimeListeners.forEach((fn) => {
        try {
          fn(event.data);
        } catch (e) {
          console.error('[RealtimeSyncBus] Listener error:', e);
        }
      });
    }
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'ava_realtime_event_signal' && e.newValue) {
      try {
        const msg: RealtimeMessage = JSON.parse(e.newValue);
        realtimeListeners.forEach((fn) => {
          try {
            fn(msg);
          } catch (err) {
            console.error('[RealtimeSyncBus] Storage event error:', err);
          }
        });
      } catch {}
    }
  });
}

export function subscribeToRealtimeEvents(callback: (msg: RealtimeMessage) => void): () => void {
  realtimeListeners.push(callback);
  return () => {
    const idx = realtimeListeners.indexOf(callback);
    if (idx >= 0) realtimeListeners.splice(idx, 1);
  };
}

export function broadcastRealtimeEvent(type: RealtimeEventType, payload: any): void {
  const msg: RealtimeMessage = {
    id: `rt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    type,
    senderId: typeof window !== 'undefined' ? (localStorage.getItem('ava_user_email') || 'system') : 'system',
    timestamp: Date.now(),
    payload
  };

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(msg);
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ava_realtime_event_signal', JSON.stringify(msg));
    } catch {}
  }

  try {
    const channel = supabase.channel('public:ava_live_events');
    channel.send({
      type: 'broadcast',
      event: 'app_event',
      payload: msg
    }).catch(() => {});
  } catch {}
}

export function initSupabaseRealtimeListener(onEventReceived: (msg: RealtimeMessage) => void) {
  try {
    const channel = supabase.channel('public:ava_live_events');
    channel
      .on('broadcast', { event: 'app_event' }, ({ payload }) => {
        if (payload && payload.type) {
          onEventReceived(payload as RealtimeMessage);
        }
      })
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  } catch (err) {
    console.warn('[RealtimeSyncBus] Supabase Realtime subscription error:', err);
    return () => {};
  }
}

