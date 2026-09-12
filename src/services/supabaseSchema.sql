-- ==============================================================================
-- TIKTOK PRO ECOSYSTEM - DATABASE SCHEMA CHO SUPABASE
-- Kiến trúc lưu trữ chuẩn xác tuyệt đối cho Người Dùng, Token, Gói & KYC
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum trạng thái KYC
DO $$ BEGIN
  CREATE TYPE kyc_status_enum AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum hạng VIP người dùng
DO $$ BEGIN
  CREATE TYPE user_rank_enum AS ENUM ('Đồng', 'Bạc', 'Vàng', 'Kim Cương');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum loại biến động token
DO $$ BEGIN
  CREATE TYPE token_tx_type_enum AS ENUM (
    'task_reward', 
    'affiliate_bonus', 
    'buy_software_app', 
    'buy_growth_package', 
    'convert_vnd_to_token', 
    'convert_token_to_vnd', 
    'escrow_lock', 
    'admin_grant', 
    'admin_adjust'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES) - ĐỒNG BỘ AUTH.USERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  handle TEXT UNIQUE,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  phone TEXT,
  role TEXT DEFAULT 'user',
  
  -- Kênh TikTok liên kết (Chống bot 1-chạm)
  tiktok_handle TEXT,
  tiktok_followers INT DEFAULT 0,
  is_tiktok_verified BOOLEAN DEFAULT FALSE,
  bio_verification_code TEXT,

  -- Số dư tài chính (Chuẩn xác 100%)
  avalive_coins BIGINT DEFAULT 0,
  token_balance NUMERIC(14, 2) DEFAULT 0,
  usdt_balance NUMERIC(10, 2) DEFAULT 0,

  -- Cấp bậc & Thống kê
  rank_level user_rank_enum DEFAULT 'Đồng',
  completed_tasks_count INT DEFAULT 0,
  created_campaigns_count INT DEFAULT 0,
  purchased_packages_count INT DEFAULT 0,
  
  -- Trạng thái KYC xác minh người thật
  kyc_status kyc_status_enum DEFAULT 'unverified',
  status TEXT DEFAULT 'active',
  
  -- Thông tin ngân hàng rút tiền
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_holder TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. BẢNG SỔ CÁI BIẾN ĐỘNG TOKEN (TOKEN_LEDGER) - LƯU VẾT CHÍNH XÁC TUYỆT ĐỐI
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.token_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tx_type token_tx_type_enum NOT NULL,
  token_amount NUMERIC(14, 2) NOT NULL,
  token_balance_after NUMERIC(14, 2) NOT NULL,
  vnd_equivalent BIGINT NOT NULL,
  note TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_token_ledger_user ON public.token_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_token_ledger_created_at ON public.token_ledger(created_at DESC);

-- ==============================================================================
-- 4. BẢNG XÁC MINH DANH TÍNH (KYC_VERIFICATIONS) - BẮT BUỘC KHI RÚT TIỀN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  front_id_card_url TEXT NOT NULL,
  back_id_card_url TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_account_holder TEXT NOT NULL,
  status kyc_status_enum DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.kyc_verifications(status);

-- ==============================================================================
-- 5. BẢNG ĐƠN HÀNG MUA GÓI DỊCH VỤ (SERVICE_ORDERS) - PHÂN PHỐI TỰ ĐỘNG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL,
  package_title TEXT NOT NULL,
  category TEXT NOT NULL,
  price_vnd BIGINT NOT NULL,
  token_paid NUMERIC(14, 2) DEFAULT 0,
  payment_currency TEXT DEFAULT 'VND',
  
  target_url TEXT NOT NULL,
  target_quantity INT NOT NULL,
  completed_quantity INT DEFAULT 0,
  
  is_live_package BOOLEAN DEFAULT FALSE,
  live_url TEXT,
  delivered_eyes INT DEFAULT 0,
  delivered_hearts INT DEFAULT 0,
  delivered_comments INT DEFAULT 0,
  
  status TEXT DEFAULT 'running',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. BẢNG MUA BẢN QUYỀN PHẦN MỀM / APP (SOFTWARE_APP_LICENSES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.software_app_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  app_title TEXT NOT NULL,
  license_key TEXT UNIQUE NOT NULL,
  token_paid NUMERIC(14, 2) NOT NULL,
  expiry_type TEXT DEFAULT 'lifetime',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. BẢNG HỢP ĐỒNG KÝ QUỸ ESCROW 3 BÊN (ESCROW_CONTRACTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.escrow_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_code TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id),
  koc_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  creator_type TEXT DEFAULT 'human',
  video_duration TEXT DEFAULT '3_min',
  video_quantity INT DEFAULT 1,
  total_escrow_vnd BIGINT NOT NULL,
  warranty_days INT DEFAULT 3,
  auto_release_countdown_hours INT DEFAULT 72,
  status TEXT DEFAULT 'escrow_locked',
  demo_video_url TEXT,
  demo_submitted_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) - BẢO MẬT TUYỆT ĐỐI THEO USER
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_app_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_contracts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own token ledger" ON public.token_ledger;
  CREATE POLICY "Users can view own token ledger" ON public.token_ledger FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage own KYC" ON public.kyc_verifications;
  CREATE POLICY "Users can manage own KYC" ON public.kyc_verifications FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN undefined_object THEN null;
END $$;
