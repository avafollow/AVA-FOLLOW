import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  X, 
  ShieldCheck, 
  Flame,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithGoogleOAuth, 
    loginWithTikTokOAuth,
    loginWithFacebookOAuth
  } = useTikTokApp();

  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [showTikTokInput, setShowTikTokInput] = useState<boolean>(false);
  const [tiktokHandleInput, setTiktokHandleInput] = useState<string>('');
  const [tiktokError, setTiktokError] = useState<string>('');

  if (!isAuthModalOpen) return null;

  const hasTikTokClientKey = Boolean(((import.meta as any).env?.VITE_TIKTOK_CLIENT_KEY || '').trim());

  const handleConnectTikTok = async () => {
    if (hasTikTokClientKey) {
      setLoadingPlatform('tiktok');
      try {
        await loginWithTikTokOAuth(undefined, true);
        setTimeout(() => setLoadingPlatform(null), 800);
      } catch (err) {
        console.warn('TikTok login exception:', err);
        setLoadingPlatform(null);
      }
      return;
    }
    // Chưa có TikTok Client Key -> mở form xác thực tài khoản TikTok trực tiếp ngay trong AuthModal
    setShowTikTokInput(prev => !prev);
    setTiktokError('');
  };

  const handleSubmitTikTokDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tiktokHandleInput.trim();
    if (!trimmed || trimmed === '@') {
      setTiktokError('Vui lòng nhập @username hoặc dán đường link kênh TikTok của bạn!');
      return;
    }
    setTiktokError('');
    setLoadingPlatform('tiktok');
    try {
      await loginWithTikTokOAuth(trimmed, false);
      setLoadingPlatform(null);
      closeAuthModal();
    } catch (err) {
      console.warn('TikTok direct login exception:', err);
      setLoadingPlatform(null);
    }
  };

  const handleConnectGoogle = async () => {
    setLoadingPlatform('google');
    try {
      await loginWithGoogleOAuth();
      setTimeout(() => {
        setLoadingPlatform(null);
      }, 800);
    } catch (err) {
      console.warn('Google login exception:', err);
      setLoadingPlatform(null);
    }
  };

  const handleConnectFacebook = async () => {
    setLoadingPlatform('facebook');
    try {
      await loginWithFacebookOAuth(undefined, true, false);
      setTimeout(() => {
        setLoadingPlatform(null);
      }, 800);
    } catch (err) {
      console.warn('Facebook login exception:', err);
      setLoadingPlatform(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0F1424] to-[#0A0D18] border border-amber-500/40 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col p-6 sm:p-7 space-y-5 max-h-[95vh] overflow-y-auto">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Header with Brand Logo */}
        <div className="text-center space-y-2.5 pt-1">
          <div className="flex justify-center">
            <BrandLogo size="md" showSubtitle={false} />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white uppercase font-display tracking-wide">
              Đăng Nhập 1-Chạm Đa Nền Tảng
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Xác thực tức thì tài khoản trên thiết bị, bảo lưu tiến độ &amp; ghi nhận nhiệm vụ tự động
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-600/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>TẶNG +5,000 XU KHI KẾT NỐI TÀI KHOẢN ĐẦU TIÊN</span>
          </div>
        </div>

        {/* 2. 3 One-Touch OAuth Action Buttons */}
        <div className="space-y-3 pt-1">
          
          {/* TIKTOK 1-TOUCH OAUTH */}
          <button
            type="button"
            onClick={handleConnectTikTok}
            disabled={!!loadingPlatform}
            className="w-full py-3.5 px-5 rounded-2xl bg-black hover:bg-slate-900 border-2 border-[#25F4EE]/60 hover:border-[#FE2C55] text-white font-black text-sm flex items-center justify-between shadow-xl shadow-cyan-950/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer font-display disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-[#FE2C55]/20 transition-colors">
                <svg className="w-5 h-5 fill-current text-[#25F4EE] group-hover:text-[#FE2C55] transition-colors" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.91 1.63V6.89a4.85 4.85 0 0 1-1-.2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  ĐĂNG NHẬP 1-CHẠM TIKTOK
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#25F4EE]/20 text-[#25F4EE] font-mono">OAuth</span>
                </div>
                <div className="text-[11px] text-slate-400 font-normal">Tự động kết nối tài khoản TikTok thiết bị</div>
              </div>
            </div>
            <Zap className="w-4 h-4 text-cyan-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {showTikTokInput && (
            <form
              onSubmit={handleSubmitTikTokDirect}
              className="p-4 rounded-2xl bg-black/70 border border-[#25F4EE]/40 space-y-3 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#25F4EE] font-mono">XÁC THỰC TÀI KHOẢN TIKTOK CHÍNH CHỦ</span>
                <a
                  href="https://www.tiktok.com/login"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-amber-300 underline hover:text-amber-200"
                >
                  Mở TikTok Đăng Nhập ↗
                </a>
              </div>
              <input
                type="text"
                value={tiktokHandleInput}
                onChange={(e) => {
                  setTiktokHandleInput(e.target.value);
                  setTiktokError('');
                }}
                placeholder="Nhập @username hoặc dán link kênh TikTok của bạn..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#25F4EE] font-mono"
              />
              {tiktokError && (
                <div className="text-[11px] text-rose-400 font-mono">{tiktokError}</div>
              )}
              <button
                type="submit"
                disabled={!!loadingPlatform}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25F4EE] via-cyan-500 to-[#FE2C55] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                {loadingPlatform === 'tiktok' ? 'Đang đồng bộ kênh TikTok...' : '⚡ Xác Thực & Vào Phần Mềm Ngay'}
              </button>
            </form>
          )}

          {/* GOOGLE / YOUTUBE 1-TOUCH OAUTH */}
          <button
            type="button"
            onClick={handleConnectGoogle}
            disabled={!!loadingPlatform}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-between shadow-xl shadow-white/10 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer font-display disabled:opacity-50 group border border-white/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                  ĐĂNG NHẬP GOOGLE / YOUTUBE
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 font-mono">1 Chạm</span>
                </div>
                <div className="text-[11px] text-slate-600 font-normal">Đồng bộ Gmail &amp; Kênh YouTube làm nhiệm vụ</div>
              </div>
            </div>
            <Zap className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* FACEBOOK 1-TOUCH OAUTH */}
          <button
            type="button"
            onClick={handleConnectFacebook}
            disabled={!!loadingPlatform}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] border border-blue-400/40 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-blue-900/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer font-display disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  ĐĂNG NHẬP 1-CHẠM FACEBOOK
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">Meta</span>
                </div>
                <div className="text-[11px] text-blue-100 font-normal">Bảo lưu tài khoản cá nhân &amp; Fanpage làm nhiệm vụ</div>
              </div>
            </div>
            <Zap className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* 3. Security & Mission Sync Guarantee */}
        <div className="pt-3 border-t border-white/10 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Đăng nhập trực tiếp lưu tài khoản đi làm nhiệm vụ nhận Xu</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Mã hóa SSL 256-bit qua OAuth 2.0 &amp; Cơ sở dữ liệu Supabase</span>
          </div>
        </div>

      </div>
    </div>
  );
};
