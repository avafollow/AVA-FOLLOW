import React, { useState, useEffect } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import {
  X,
  ShieldCheck,
  Flame,
  Zap,
  CheckCircle2,
  Loader2,
  Link2
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogleOAuth,
    loginWithTikTokOAuth,
    loginWithFacebookOAuth,
    loginWithYoutubeOAuth
  } = useTikTokApp();

  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [quickInputPlatform, setQuickInputPlatform] = useState<'tiktok' | 'facebook' | 'youtube' | null>(null);
  const [quickInputValue, setQuickInputValue] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [rememberedTikTok, setRememberedTikTok] = useState<string>('');

  useEffect(() => {
    if (!isAuthModalOpen) return;
    try {
      const savedTt = (localStorage.getItem('ava_tiktok_connected') || '').trim();
      if (savedTt && savedTt !== 'Chưa kết nối' && savedTt !== '@chưa_kết_nối') {
        setRememberedTikTok(savedTt.startsWith('@') ? savedTt : `@${savedTt}`);
      } else {
        setRememberedTikTok('');
      }
    } catch {
      setRememberedTikTok('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const hasTikTokClientKey = Boolean(((import.meta as any).env?.VITE_TIKTOK_CLIENT_KEY || '').trim());

  const handleConnectGoogle = async () => {
    setLoadingPlatform('google');
    try {
      await loginWithGoogleOAuth();
      setTimeout(() => setLoadingPlatform(null), 1500);
    } catch (err) {
      console.warn('Google login exception:', err);
      setLoadingPlatform(null);
    }
  };

  const handleConnectFacebook = async () => {
    setLoadingPlatform('facebook');
    try {
      await loginWithFacebookOAuth(undefined, true, false);
      setTimeout(() => setLoadingPlatform(null), 1500);
    } catch (err) {
      console.warn('Facebook login exception:', err);
      setLoadingPlatform(null);
    }
  };

  const handleConnectTikTok = async () => {
    if (hasTikTokClientKey) {
      setLoadingPlatform('tiktok');
      try {
        await loginWithTikTokOAuth(undefined, true);
        setTimeout(() => setLoadingPlatform(null), 1500);
      } catch (err) {
        console.warn('TikTok login exception:', err);
        setLoadingPlatform(null);
      }
      return;
    }

    // Nếu thiết bị đã từng kết nối 1 kênh TikTok -> vào ngay 1 chạm!
    if (rememberedTikTok && quickInputPlatform !== 'tiktok') {
      setLoadingPlatform('tiktok');
      try {
        await loginWithTikTokOAuth(rememberedTikTok, false);
        setLoadingPlatform(null);
        closeAuthModal();
      } catch {
        setLoadingPlatform(null);
      }
      return;
    }

    // Nếu lần đầu -> hiện ô nhập 1 dòng gọn gàng ngay trong modal
    setQuickInputPlatform(prev => (prev === 'tiktok' ? null : 'tiktok'));
    setQuickInputValue(rememberedTikTok || '');
    setInputError('');
  };

  const handleSubmitQuickLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInputPlatform) return;
    const trimmed = quickInputValue.trim();
    if (!trimmed || trimmed === '@') {
      setInputError('Vui lòng nhập @username hoặc dán đường link tài khoản của bạn!');
      return;
    }
    setInputError('');
    setLoadingPlatform(quickInputPlatform);
    try {
      if (quickInputPlatform === 'tiktok') {
        await loginWithTikTokOAuth(trimmed, false);
      } else if (quickInputPlatform === 'facebook') {
        await loginWithFacebookOAuth(trimmed, false, false);
      } else if (quickInputPlatform === 'youtube') {
        await loginWithYoutubeOAuth(trimmed, false);
      }
      setLoadingPlatform(null);
      closeAuthModal();
    } catch (err) {
      console.warn('Quick connect exception:', err);
      setLoadingPlatform(null);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-b from-[#101628] via-[#0B0F1D] to-[#080B14] border border-white/15 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90dvh]"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Đóng cửa sổ đăng nhập"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/15 text-slate-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-5 relative z-10">
          {/* 1. Header */}
          <div className="text-center space-y-2.5 pt-1">
            <div className="flex justify-center">
              <BrandLogo size="sm" showSubtitle={false} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase font-display tracking-wide">
                Kết Nối 1-Chạm Đa Nền Tảng
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Chọn tài khoản đã đăng nhập sẵn trên thiết bị — vào ứng dụng ngay không qua bước xác minh rườm rà
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-600/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-bold font-mono">
              <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>TẶNG +5.000 XU KHI KẾT NỐI LẦN ĐẦU</span>
            </div>
          </div>

          {/* 2. Three Frictionless 1-Tap Buttons */}
          <div className="space-y-2.5">
            {/* GOOGLE / YOUTUBE 1-TAP */}
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={!!loadingPlatform}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-between shadow-xl shadow-white/10 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer font-display disabled:opacity-50 group border border-white/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-black text-slate-950 flex items-center gap-1.5 flex-wrap">
                    <span>Google / YouTube</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-mono">1 Chạm</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-normal truncate">
                    Tự động dùng Gmail &amp; YouTube trên thiết bị
                  </div>
                </div>
              </div>
              {loadingPlatform === 'google' ? (
                <Loader2 className="w-4 h-4 text-slate-700 animate-spin shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-amber-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>

            {/* FACEBOOK 1-TAP */}
            <button
              type="button"
              onClick={handleConnectFacebook}
              disabled={!!loadingPlatform}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] border border-blue-400/40 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-blue-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer font-display disabled:opacity-50 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                    <span>Facebook</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono">1 Chạm</span>
                  </div>
                  <div className="text-[11px] text-blue-100 font-normal truncate">
                    Kết nối tức thì Facebook cá nhân &amp; Fanpage
                  </div>
                </div>
              </div>
              {loadingPlatform === 'facebook' ? (
                <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>

            {/* TIKTOK 1-TAP */}
            <button
              type="button"
              onClick={handleConnectTikTok}
              disabled={!!loadingPlatform}
              className="w-full py-3.5 px-4 rounded-2xl bg-black hover:bg-slate-900 border-2 border-[#25F4EE]/55 hover:border-[#FE2C55] text-white font-black text-sm flex items-center justify-between shadow-xl shadow-cyan-950/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer font-display disabled:opacity-50 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15 group-hover:bg-[#FE2C55]/20 transition-colors">
                  <svg className="w-5 h-5 fill-current text-[#25F4EE] group-hover:text-[#FE2C55] transition-colors" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.91 1.63V6.89a4.85 4.85 0 0 1-1-.2z" />
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 flex-wrap">
                    <span>{rememberedTikTok ? `TikTok (${rememberedTikTok})` : 'TikTok'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#25F4EE]/20 text-[#25F4EE] font-mono">1 Chạm</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal truncate">
                    {rememberedTikTok ? 'Chạm để vào ngay kênh đã lưu trên máy' : 'Đồng bộ nhanh kênh TikTok của bạn'}
                  </div>
                </div>
              </div>
              {loadingPlatform === 'tiktok' ? (
                <Loader2 className="w-4 h-4 text-[#25F4EE] animate-spin shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-[#25F4EE] group-hover:text-[#FE2C55] shrink-0 group-hover:translate-x-0.5 transition-all" />
              )}
            </button>

            {/* Quick 1-Line Link Fallback Bar (cho điện thoại / trình duyệt chặn popup OAuth) */}
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Link2 className="w-3 h-3 text-cyan-400" />
                <span>Hoặc vào nhanh bằng link:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuickInputPlatform(quickInputPlatform === 'tiktok' ? null : 'tiktok');
                  setQuickInputValue('');
                  setInputError('');
                }}
                className="text-cyan-300 hover:text-white underline underline-offset-2 font-semibold cursor-pointer"
              >
                TikTok
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setQuickInputPlatform(quickInputPlatform === 'facebook' ? null : 'facebook');
                  setQuickInputValue('');
                  setInputError('');
                }}
                className="text-blue-300 hover:text-white underline underline-offset-2 font-semibold cursor-pointer"
              >
                Facebook
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setQuickInputPlatform(quickInputPlatform === 'youtube' ? null : 'youtube');
                  setQuickInputValue('');
                  setInputError('');
                }}
                className="text-red-300 hover:text-white underline underline-offset-2 font-semibold cursor-pointer"
              >
                YouTube
              </button>
            </div>

            {quickInputPlatform && (
              <form
                onSubmit={handleSubmitQuickLink}
                className="p-3.5 rounded-2xl bg-black/75 border border-cyan-500/35 space-y-2.5 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-300 font-mono uppercase">
                    {quickInputPlatform === 'tiktok'
                      ? 'Vào nhanh bằng kênh TikTok'
                      : quickInputPlatform === 'facebook'
                        ? 'Vào nhanh bằng Facebook'
                        : 'Vào nhanh bằng kênh YouTube'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickInputPlatform(null)}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
                <input
                  type="text"
                  autoFocus
                  value={quickInputValue}
                  onChange={(e) => {
                    setQuickInputValue(e.target.value);
                    setInputError('');
                  }}
                  placeholder={
                    quickInputPlatform === 'tiktok'
                      ? 'Nhập @username hoặc dán link TikTok...'
                      : quickInputPlatform === 'facebook'
                        ? 'Nhập tên hoặc dán link facebook.com/...'
                        : 'Nhập @handle hoặc dán link youtube.com/...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
                {inputError && (
                  <div className="text-[11px] text-rose-400 font-mono">{inputError}</div>
                )}
                <button
                  type="submit"
                  disabled={!!loadingPlatform}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#25F4EE] via-cyan-500 to-[#FE2C55] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loadingPlatform ? 'Đang kết nối...' : '⚡ Kết Nối & Vào Ứng Dụng Ngay'}
                </button>
              </form>
            )}
          </div>

          {/* 3. Clean Footer */}
          <div className="pt-3 border-t border-white/10 space-y-1.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Tự động đồng bộ trên mọi điện thoại &amp; máy tính</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Bảo mật chuẩn SSL 256-bit • Không lưu mật khẩu cá nhân</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
