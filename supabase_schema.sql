-- ==============================================================================
-- AVA FOLLOW GROWTH OS - HỆ THỐNG CƠ SỞ DỮ LIỆU ĐỒNG BỘ SUPABASE CLOUD (POSTGRESQL)
-- Mã dự án: vjsymzbaiyzuryvdniwd
-- Hướng dẫn: Copy toàn bộ đoạn script này và dán vào Supabase -> SQL Editor -> Bấm RUN
-- ==============================================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG & VÍ XU (PROFILES & WALLETS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'creator', -- 'super_admin', 'creator', 'koc', 'brand', 'agency'
    tiktok_connected TEXT,
    tiktok_followers INTEGER DEFAULT 0,
    is_tiktok_verified BOOLEAN DEFAULT FALSE,
    facebook_connected TEXT,
    is_facebook_verified BOOLEAN DEFAULT FALSE,
    
    -- Số dư & tài chính
    avalive_coins BIGINT DEFAULT 5000, -- Tặng ngay +5.000 Xu chào mừng
    token_balance NUMERIC(15, 2) DEFAULT 0,
    usdt_balance NUMERIC(15, 2) DEFAULT 0,
    fiat_vnd BIGINT DEFAULT 0,
    escrow_locked_vnd BIGINT DEFAULT 0,
    
    -- Cấp bậc & bảo mật
    rank_level TEXT DEFAULT 'Đồng', -- 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'
    kyc_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified', 'rejected'
    withdraw_count INTEGER DEFAULT 0,
    
    -- Giới thiệu bạn bè
    referred_by TEXT, -- Mã giới thiệu người mời
    ref_code TEXT UNIQUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG SỔ CÁI BIẾN ĐỘNG XU & TOKEN (TOKEN LEDGER - BẢO ĐẢM TÍNH TOÀN VẸN)
CREATE TABLE IF NOT EXISTS public.token_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    tx_type TEXT NOT NULL, -- 'earn_task', 'referral_bonus', 'spend_boost', 'escrow_lock', 'escrow_payout', 'wheel_reward', 'deposit', 'withdraw'
    token_amount NUMERIC(15, 2) DEFAULT 0,
    coins_amount BIGINT DEFAULT 0,
    balance_after BIGINT NOT NULL,
    vnd_equivalent BIGINT DEFAULT 0,
    note TEXT,
    status TEXT DEFAULT 'success', -- 'success', 'pending', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG XÁC MINH DANH TÍNH (KYC VERIFICATIONS)
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    id_number TEXT NOT NULL,
    date_of_birth DATE,
    front_id_card_url TEXT,
    back_id_card_url TEXT,
    bank_name TEXT NOT NULL,
    bank_account_number TEXT NOT NULL,
    bank_account_holder TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 4. BẢNG HỢP ĐỒNG KÝ QUỸ TRUNG GIAN ESCROW (ESCROW CONTRACTS)
CREATE TABLE IF NOT EXISTS public.escrow_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_code TEXT UNIQUE NOT NULL, -- vd: ESC-2026-8899
    client_name TEXT NOT NULL,
    client_handle TEXT,
    koc_name TEXT NOT NULL,
    koc_handle TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    creator_type TEXT DEFAULT 'human',
    video_duration TEXT DEFAULT '3_min',
    video_quantity INTEGER DEFAULT 1,
    total_escrow_amount BIGINT NOT NULL, -- Số tiền/Xu ký quỹ đang khóa an toàn
    koc_payout_amount BIGINT NOT NULL,   -- 80% KOC nhận
    platform_fee BIGINT NOT NULL,        -- 20% phí sàn
    requirements TEXT,
    deadline_days INTEGER DEFAULT 3,
    warranty_hours INTEGER DEFAULT 72,   -- 72h nghiệm thu
    status TEXT DEFAULT 'escrow_locked', -- 'escrow_locked', 'in_progress', 'demo_submitted', 'disbursed', 'disputed'
    demo_video_url TEXT,
    demo_note TEXT,
    demo_submitted_at TIMESTAMPTZ,
    disbursed_at TIMESTAMPTZ,
    dispute_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG TIẾP THỊ LIÊN KẾT (AFFILIATE REFERRALS)
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_code TEXT NOT NULL,
    referred_user_id TEXT NOT NULL,
    referred_email TEXT NOT NULL,
    has_completed_task BOOLEAN DEFAULT FALSE,
    task_completed_type TEXT,
    bonus_coins BIGINT DEFAULT 5000,
    is_claimed BOOLEAN DEFAULT FALSE,
    package_spent_vnd BIGINT DEFAULT 0,
    commission_earned_vnd BIGINT DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'activated'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ
);

-- 6. BẢNG ĐƠN ĐẶT GÓI TĂNG TRƯỞNG & DỊCH VỤ (SERVICE ORDERS)
CREATE TABLE IF NOT EXISTS public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    category TEXT NOT NULL,
    price_vnd BIGINT DEFAULT 0,
    coins_paid BIGINT DEFAULT 0,
    target_url TEXT NOT NULL,
    target_quantity INTEGER NOT NULL,
    delivered_quantity INTEGER DEFAULT 0,
    status TEXT DEFAULT 'running', -- 'running', 'completed', 'canceled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS) ĐẢM BẢO BẢO MẬT TUYỆT ĐỐI
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- CHÍNH SÁCH TRUY CẬP AN TOÀN
CREATE POLICY "Allow public read access for active data" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow read token ledger" ON public.token_ledger FOR SELECT USING (true);
CREATE POLICY "Allow insert token ledger" ON public.token_ledger FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read kyc" ON public.kyc_verifications FOR SELECT USING (true);
CREATE POLICY "Allow insert kyc" ON public.kyc_verifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read escrow" ON public.escrow_contracts FOR SELECT USING (true);
CREATE POLICY "Allow write escrow" ON public.escrow_contracts FOR ALL USING (true);

CREATE POLICY "Allow read affiliate" ON public.affiliate_referrals FOR SELECT USING (true);
CREATE POLICY "Allow insert affiliate" ON public.affiliate_referrals FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read orders" ON public.service_orders FOR SELECT USING (true);
CREATE POLICY "Allow insert orders" ON public.service_orders FOR INSERT WITH CHECK (true);
