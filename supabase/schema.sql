-- ==============================================================================
-- TIKTOK FOLLOW OS - SUPABASE POSTGRES PRODUCTION SCHEMA
-- Hệ thống Ký Quỹ Booking 3 Bên (Escrow Smart Vault), Quản Trị Người Dùng & Sổ Cái
-- ==============================================================================

-- Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG & VÍ TOKEN (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  tiktok_handle VARCHAR(100) UNIQUE,
  tiktok_followers INT DEFAULT 0,
  is_tiktok_verified BOOLEAN DEFAULT FALSE,
  bio_verification_code VARCHAR(50),
  role VARCHAR(50) DEFAULT 'creator', -- 'creator', 'brand', 'koc', 'admin'
  rank_level VARCHAR(50) DEFAULT 'Đồng', -- 'Đồng', 'Bạc', 'Vàng', 'Kim Cương'
  
  -- Ví & Tiền tệ
  coins_balance BIGINT DEFAULT 0,       -- 1 Xu = 1 VNĐ
  token_balance NUMERIC(18, 4) DEFAULT 0, -- Token hệ thống
  usdt_balance NUMERIC(18, 2) DEFAULT 0,
  escrow_locked_balance BIGINT DEFAULT 0, -- Tiền đang ký quỹ trong két
  
  -- Thông tin ngân hàng nhận tiền Napas247
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(100),
  bank_account_holder VARCHAR(255),
  
  -- Thống kê
  completed_tasks_count INT DEFAULT 0,
  created_campaigns_count INT DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG HỢP ĐỒNG KÝ QUỸ BOOKING TRUNG GIAN 3 BÊN (ESCROW_BOOKINGS)
CREATE TABLE IF NOT EXISTS public.escrow_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_code VARCHAR(50) UNIQUE NOT NULL, -- vd: ESC-2026-9988
  client_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  koc_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'review', 'ugc_ads', 'checkin', 'livestream_cohost', 'bio_link', 'viral_drama'
  video_quantity INT DEFAULT 1,  -- 1, 2, 3, 5, 10 video
  total_escrow_amount BIGINT NOT NULL, -- Số tiền ký quỹ khóa trong sàn
  price_per_video BIGINT NOT NULL,
  
  product_name VARCHAR(255),
  product_link TEXT,
  requirements TEXT NOT NULL,
  target_tiktok_handle VARCHAR(100) NOT NULL, -- Kênh KOC được book
  deadline_days INT DEFAULT 5,
  
  -- Trạng thái Escrow
  status VARCHAR(50) DEFAULT 'escrow_locked', -- 'pending_escrow', 'escrow_locked', 'in_progress', 'demo_submitted', 'disbursed', 'disputed', 'refunded'
  demo_video_url TEXT,
  demo_submitted_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  auto_release_deadline TIMESTAMPTZ, -- Sau 48h tự động giải ngân nếu khách không khiếu nại
  
  dispute_reason TEXT,
  dispute_status VARCHAR(50), -- 'open', 'resolved_koc', 'resolved_client'
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG NHIỆM VỤ FOLLOW & TƯƠNG TÁC (TIKTOK_TASKS)
CREATE TABLE IF NOT EXISTS public.tiktok_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'follow', 'like', 'comment', 'review', 'livestream'
  reward_coins INT NOT NULL,
  reward_vnd BIGINT NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  channel_handle VARCHAR(100) NOT NULL,
  channel_avatar TEXT,
  target_url TEXT NOT NULL,
  total_slots INT NOT NULL,
  completed_slots INT DEFAULT 0,
  guide TEXT,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'running', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG SỔ CÁI GIAO DỊCH MINH BẠCH (TRANSACTIONS)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'earn', 'deposit', 'withdraw', 'escrow_lock', 'escrow_payout', 'burn'
  title TEXT NOT NULL,
  amount_vnd BIGINT NOT NULL,
  coins_amount BIGINT NOT NULL,
  is_positive BOOLEAN NOT NULL,
  method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'success', -- 'success', 'pending', 'rejected'
  reference_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG LỊCH SỬ ĐỐT TOKEN (TOKENOMICS_BURN_LOG)
CREATE TABLE IF NOT EXISTS public.tokenomics_burn_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID,
  campaign_title TEXT NOT NULL,
  tokens_burned BIGINT NOT NULL,
  token_price_vnd INT NOT NULL,
  total_burned_after BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS) để bảo mật
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách xem dữ liệu
CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read for tasks" ON public.tiktok_tasks FOR SELECT USING (true);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
