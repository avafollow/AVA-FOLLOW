import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  Facebook,
  Youtube,
  ExternalLink,
  RefreshCw,
  Edit3,
  Loader2,
  Link2
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { getTikTokAvatar, resolveRealMediaChannelMeta } from '../../data/videoSources';

type PlatformTab = 'tiktok' | 'facebook' | 'youtube';

export const TikTokConnectModal: React.FC = () => {
  const {
    user,
    isConnectOpen,
    closeConnect,
    connectTikTok,
    connectFacebook,
    connectYoutube,
    loginWithTikTokOAuth,
    loginWithFacebookOAuth,
    loginWithYoutubeOAuth,
    showToast
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<PlatformTab>('tiktok');
  const [inputVal, setInputVal] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnectOpen) return;
    setIsEditing(false);
    setInputVal('');
    try {
      const reopenTab = localStorage.getItem('ava_oauth_reopen_tab');
      const reopenMsg = localStorage.getItem('ava_oauth_reopen_msg');
      if (reopenTab === 'facebook' || reopenTab === 'youtube' || reopenTab === 'tiktok') {
        setActiveTab(reopenTab);
        localStorage.removeItem('ava_oauth_reopen_tab');
      }
      if (reopenMsg) {
        setSuccessBanner(reopenMsg);
        localStorage.removeItem('ava_oauth_reopen_msg');
        setTimeout(() => setSuccessBanner(null), 5000);
      }
    } catch {}
  }, [isConnectOpen]);

  // Reset edit input when switching tab
  useEffect(() => {
    setIsEditing(false);
    setInputVal('');
  }, [activeTab]);

  if (!isConnectOpen) return null;

  const isTtConnected = Boolean(user.isTikTokVerified && user.tiktokConnected && user.tiktokConnected !== 'Chưa kết nối' && user.tiktokConnected !== '@chưa_kết_nối');
  const isFbConnected = Boolean(user.isFacebookVerified && user.facebookConnected && user.facebookConnected !== 'Chưa kết nối');
  const isYtConnected = Boolean(user.isYoutubeVerified && user.youtubeConnected && user.youtubeConnected !== 'Chưa kết nối');

  const cleanTikTok = (user.tiktokConnected || '').replace(/^@+/, '');
  const currentTikTokUrl = user.tiktokProfileUrl || (cleanTikTok ? `https://www.tiktok.com/@${cleanTikTok}` : 'https://www.tiktok.com');
  const cleanFb = (user.facebookConnected || '').replace(/^(https?:\/\/)?(www\.|m\.)?facebook\.com\//i, '').replace(/\/$/, '');
  const currentFbUrl = user.facebookProfileUrl || (cleanFb ? `https://www.facebook.com/${cleanFb}` : 'https://www.facebook.com');
  const cleanYt = (user.youtubeConnected || '').replace(/^(https?:\/\/)?(www\.|m\.)?youtube\.com\/(@)?/i, '').replace(/^@+/, '');
  const currentYtUrl = user.youtubeProfileUrl || (cleanYt ? `https://www.youtube.com/@${cleanYt}` : 'https://www.youtube.com');

  const currentTtAvatar =
    user.tiktokAvatar ||
    (cleanTikTok
      ? getTikTokAvatar(cleanTikTok)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'TT')}&background=010101&color=fff&bold=true`);
  const currentFbAvatar =
    user.facebookAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanFb || user.name || 'FB')}&background=1877F2&color=fff&bold=true`;
  const currentYtAvatar =
    user.youtubeAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanYt || user.name || 'YT')}&background=FF0000&color=fff&bold=true`;

  const hasTikTokClientKey = Boolean(((import.meta as any).env?.VITE_TIKTOK_CLIENT_KEY || '').trim());

  // 1-Tap Direct OAuth Handler
  const handleOneTapOAuth = async (platform: PlatformTab) => {
    setIsBusy(true);
    try {
      if (platform === 'youtube') {
        await loginWithYoutubeOAuth(undefined, true);
      } else if (platform === 'facebook') {
        await loginWithFacebookOAuth(undefined, true, false);
      } else if (platform === 'tiktok') {
        if (hasTikTokClientKey) {
          await loginWithTikTokOAuth(undefined, true);
        } else if (cleanTikTok && !isEditing) {
          await loginWithTikTokOAuth(`@${cleanTikTok}`, false);
          setSuccessBanner(`⚡ Đã đồng bộ lại kênh TikTok @${cleanTikTok}!`);
        } else {
          showToast('⚡ Dán link hoặc nhập @username kênh TikTok của bạn vào ô bên dưới để kết nối tức thì!');
        }
      }
    } catch (err) {
      console.warn('One-tap connect error:', err);
    } finally {
      setTimeout(() => setIsBusy(false), 600);
    }
  };

  // Quick 1-Line Link / @Handle Connect with Real Avatar & Name Auto-Resolution
  const handleQuickLinkConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw || raw === '@') {
      showToast('Vui lòng nhập @username hoặc dán đường link kênh của bạn!');
      return;
    }
    setIsBusy(true);

    try {
      let resolvedName = '';
      let resolvedHandle = '';
      let resolvedAvatar = '';

      // Thử tự động lấy đúng tên kênh & logo thật nếu người dùng dán URL
      if (/^https?:\/\//i.test(raw)) {
        try {
          const meta = await resolveRealMediaChannelMeta(raw);
          if (meta) {
            resolvedName = meta.channelName || '';
            resolvedHandle = meta.channelHandle || '';
            resolvedAvatar = meta.channelAvatar || '';
          }
        } catch {}
      }

      if (activeTab === 'tiktok') {
        const clean = (resolvedHandle || raw)
          .replace(/^https?:\/\/(www\.|m\.)?tiktok\.com\/@?/i, '')
          .replace(/\/(video|photo|live)\/.*$/i, '')
          .replace(/\?.*$/, '')
          .replace(/\/$/, '')
          .replace(/^@+/, '')
          .trim();
        const finalHandle = clean ? `@${clean}` : `@${(user.name || 'tiktok_user').replace(/\s+/g, '_').toLowerCase()}`;
        const finalAvatar = resolvedAvatar || getTikTokAvatar(clean || finalHandle.replace(/^@/, ''));
        connectTikTok(finalHandle, user.tiktokFollowers || 0, finalAvatar);
        setSuccessBanner(`⚡ Đã kết nối 1-chạm TikTok ${resolvedName ? `${resolvedName} (${finalHandle})` : finalHandle}!`);
      } else if (activeTab === 'facebook') {
        const clean = (resolvedHandle || raw)
          .replace(/^https?:\/\/(www\.|m\.|mbasic\.)?facebook\.com\//i, '')
          .replace(/\?.*$/, '')
          .replace(/\/$/, '')
          .replace(/^@+/, '')
          .trim();
        const finalFb = clean || raw;
        const finalAvatar =
          resolvedAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName || finalFb)}&background=1877F2&color=fff&bold=true`;
        connectFacebook(finalFb, 'personal', user.facebookFollowers || 0, finalAvatar);
        setSuccessBanner(`⚡ Đã kết nối 1-chạm Facebook ${resolvedName || `fb.com/${finalFb}`}!`);
      } else if (activeTab === 'youtube') {
        const clean = (resolvedHandle || raw)
          .replace(/^https?:\/\/(www\.|m\.)?youtube\.com\/(channel\/|c\/|user\/|@)?/i, '')
          .replace(/^https?:\/\/youtu\.be\//i, '')
          .replace(/\?.*$/, '')
          .replace(/\/$/, '')
          .replace(/^@+/, '')
          .trim();
        const finalYt = clean || (user.name || 'youtube_channel').replace(/\s+/g, '');
        const finalAvatar =
          resolvedAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName || finalYt)}&background=FF0000&color=fff&bold=true`;
        connectYoutube(finalYt, user.youtubeSubscribers || 0, finalAvatar);
        setSuccessBanner(`⚡ Đã kết nối 1-chạm YouTube ${resolvedName ? `${resolvedName} (@${finalYt})` : `@${finalYt}`}!`);
      }

      setIsEditing(false);
      setInputVal('');
    } finally {
      setIsBusy(false);
    }
  };

  const isCurrentConnected =
    activeTab === 'tiktok' ? isTtConnected : activeTab === 'facebook' ? isFbConnected : isYtConnected;

  return (
    <div
      onClick={closeConnect}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md sm:max-w-lg rounded-3xl bg-gradient-to-b from-[#101628] via-[#0B0F1D] to-[#080B14] border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.85)] relative overflow-hidden max-h-[90dvh] flex flex-col"
      >
        {/* Dynamic Ambient Glow */}
        <div
          className={`absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            activeTab === 'tiktok'
              ? 'bg-rose-500/20'
              : activeTab === 'facebook'
                ? 'bg-blue-500/20'
                : 'bg-red-500/20'
          }`}
        />

        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl border shrink-0 transition-colors ${
                activeTab === 'tiktok'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : activeTab === 'facebook'
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}
            >
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-wide truncate">
                Kết Nối 1-Chạm Tài Khoản
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                Kết nối dễ dàng TikTok • Facebook • YouTube
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeConnect}
            aria-label="Đóng"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain relative z-10">
          {/* Success Banner */}
          {successBanner && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1">{successBanner}</span>
            </div>
          )}

          {/* 3-Platform Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('tiktok')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'tiktok'
                  ? 'bg-gradient-to-r from-[#FF0050] to-[#00F2FE] text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
              </svg>
              <span>TikTok</span>
              {isTtConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('facebook')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'facebook'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Facebook className="w-3.5 h-3.5 shrink-0" />
              <span>Facebook</span>
              {isFbConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('youtube')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'youtube'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 shrink-0" />
              <span>YouTube</span>
              {isYtConnected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
            </button>
          </div>

          {/* Connected Card View */}
          {isCurrentConnected && !isEditing ? (
            <div
              className={`p-4 sm:p-5 rounded-3xl border space-y-4 shadow-xl ${
                activeTab === 'tiktok'
                  ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-black border-rose-500/40'
                  : activeTab === 'facebook'
                    ? 'bg-gradient-to-br from-blue-950/40 via-slate-900 to-black border-blue-500/40'
                    : 'bg-gradient-to-br from-red-950/40 via-slate-900 to-black border-red-500/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={
                    activeTab === 'tiktok'
                      ? currentTtAvatar
                      : activeTab === 'facebook'
                        ? currentFbAvatar
                        : currentYtAvatar
                  }
                  alt="Channel Avatar"
                  onError={(e) => {
                    const bg = activeTab === 'facebook' ? '1877F2' : activeTab === 'youtube' ? 'FF0000' : '010101';
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeTab === 'tiktok' ? cleanTikTok || 'TT' : activeTab === 'facebook' ? cleanFb || 'FB' : cleanYt || 'YT'
                    )}&background=${bg}&color=fff&bold=true`;
                  }}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shrink-0 shadow-lg"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-white text-sm sm:text-base font-display truncate">
                      {activeTab === 'tiktok'
                        ? user.tiktokNickname || user.tiktokConnected
                        : activeTab === 'facebook'
                          ? user.facebookName || `fb.com/${cleanFb}`
                          : user.youtubeChannelTitle || user.youtubeConnected}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Đã kết nối
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">
                    {activeTab === 'tiktok'
                      ? user.tiktokConnected
                      : activeTab === 'facebook'
                        ? `fb.com/${cleanFb}`
                        : user.youtubeConnected}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                <a
                  href={
                    activeTab === 'tiktok'
                      ? currentTikTokUrl
                      : activeTab === 'facebook'
                        ? currentFbUrl
                        : currentYtUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Mở Kênh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOneTapOAuth(activeTab)}
                  disabled={isBusy}
                  className="py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                  <span>Đồng Bộ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setInputVal(
                      activeTab === 'tiktok'
                        ? user.tiktokConnected || ''
                        : activeTab === 'facebook'
                          ? cleanFb
                          : user.youtubeConnected || ''
                    );
                  }}
                  className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Đổi Kênh</span>
                </button>
              </div>
            </div>
          ) : (
            /* Connect / Edit View — Clean 1-Tap + Instant Link */
            <div className="space-y-3.5">
              {/* Option 1: 1-Tap OAuth */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  activeTab === 'tiktok'
                    ? 'bg-gradient-to-br from-rose-950/50 via-slate-900 to-black border-rose-500/40'
                    : activeTab === 'facebook'
                      ? 'bg-gradient-to-br from-blue-950/50 via-slate-900 to-black border-blue-500/40'
                      : 'bg-gradient-to-br from-red-950/50 via-slate-900 to-black border-red-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5 font-display uppercase">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {activeTab === 'tiktok'
                        ? 'Kết Nối 1-Chạm TikTok'
                        : activeTab === 'facebook'
                          ? 'Kết Nối 1-Chạm Facebook'
                          : 'Kết Nối 1-Chạm Google / YouTube'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 shrink-0">
                    SIÊU TỐC
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTab === 'tiktok'
                    ? 'Tự động kết nối tài khoản TikTok đã đăng nhập sẵn trên thiết bị — không yêu cầu bước xác minh phức tạp.'
                    : activeTab === 'facebook'
                      ? 'Tự động dùng tài khoản Facebook đã đăng nhập trên điện thoại hoặc máy tính của bạn chỉ với 1 chạm.'
                      : 'Tự động dùng tài khoản Google / YouTube sẵn có trên thiết bị chỉ với 1 chạm — không bị chặn bảo mật.'}
                </p>

                <button
                  type="button"
                  onClick={() => handleOneTapOAuth(activeTab)}
                  disabled={isBusy}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 ${
                    activeTab === 'tiktok'
                      ? 'bg-gradient-to-r from-[#FF0050] via-pink-600 to-[#00F2FE] shadow-rose-600/30'
                      : activeTab === 'facebook'
                        ? 'bg-gradient-to-r from-[#1877F2] to-indigo-600 shadow-blue-600/30'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-600/30'
                  }`}
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang kết nối 1 chạm...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-200" />
                      <span>
                        {activeTab === 'tiktok'
                          ? '⚡ Kết Nối 1-Chạm TikTok Ngay'
                          : activeTab === 'facebook'
                            ? '⚡ Kết Nối 1-Chạm Facebook Ngay'
                            : '⚡ Kết Nối 1-Chạm Google / YouTube Ngay'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Ultra-Clean 1-Line Link / @username Input */}
              <form
                onSubmit={handleQuickLinkConnect}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 font-display">
                    <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Hoặc Dán Link / @Tên Kênh (Tự Nhận Logo Thật)</span>
                  </span>
                </div>

                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    activeTab === 'tiktok'
                      ? 'Dán link tiktok.com/@kenh hoặc nhập @username...'
                      : activeTab === 'facebook'
                        ? 'Dán link facebook.com/... hoặc tên trang...'
                        : 'Dán link youtube.com/@kenh hoặc @handle...'
                  }
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>Xác Nhận Liên Kết Ngay</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono relative z-10 shrink-0 bg-black/30">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Kết nối an toàn • Tự động lưu trên thiết bị</span>
          </span>
          <button
            type="button"
            onClick={closeConnect}
            className="text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
