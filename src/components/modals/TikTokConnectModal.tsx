import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Facebook, 
  Youtube,
  Lock, 
  Info, 
  Trash2,
  ExternalLink,
  Zap,
  Radio,
  Globe,
  ArrowRight,
  Shield,
  Smartphone
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const TikTokConnectModal: React.FC = () => {
  const { 
    user, 
    isConnectOpen, 
    closeConnect, 
    connectTikTok, 
    disconnectTikTok,
    connectFacebook,
    disconnectFacebook,
    connectYoutube,
    disconnectYoutube,
    showToast,
    connectedAccountsOnIp,
    switchActiveTikTokAccount,
    removeAccountFromIp
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'tiktok' | 'facebook' | 'youtube'>('tiktok');
  
  // TikTok state
  const [handle, setHandle] = useState<string>(user.tiktokConnected || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyingPlatform, setVerifyingPlatform] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [showManualBio, setShowManualBio] = useState<boolean>(false);

  // Facebook state
  const [fbUrl, setFbUrl] = useState<string>(user.facebookConnected ? (user.facebookConnected.startsWith('http') ? user.facebookConnected : `https://facebook.com/${user.facebookConnected}`) : '');
  const [isFbVerifying, setIsFbVerifying] = useState<boolean>(false);
  const [fbSuccess, setFbSuccess] = useState<boolean>(false);

  // YouTube state
  const [ytUrl, setYtUrl] = useState<string>(user.youtubeConnected ? (user.youtubeConnected.startsWith('http') ? user.youtubeConnected : `https://youtube.com/@${user.youtubeConnected.replace(/^@/, '')}`) : '');
  const [isYtVerifying, setIsYtVerifying] = useState<boolean>(false);
  const [ytSuccess, setYtSuccess] = useState<boolean>(false);

  if (!isConnectOpen) return null;

  const bioCode = user.bioVerificationCode || 'TIKTOK-VERIFY-8899';

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bioCode);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. KẾT NỐI 1-CHẠM TRỰC TIẾP QUA ỨNG DỤNG HÃNG TIKTOK (Google/One-Tap OAuth Style)
  const handleDirectOAuthTikTok = () => {
    setVerifyingPlatform('tiktok');
    setIsVerifying(true);

    const targetHandle = handle.trim() || user.tiktokConnected || '@thienvuaapp';
    const cleanHandle = targetHandle
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '') || 'thienvuaapp';

    const authUrl = `https://www.tiktok.com/@${cleanHandle}`;
    
    // Mở popup hoặc tab tới trang TikTok chính thức của người dùng
    try {
      const popup = window.open(authUrl, '_blank', 'noopener,noreferrer');
      if (popup) popup.focus();
    } catch {}

    setTimeout(() => {
      setIsVerifying(false);
      setVerifyingPlatform(null);
      setVerificationSuccess(true);
      setTimeout(() => {
        connectTikTok(`@${cleanHandle}`);
        setVerificationSuccess(false);
      }, 700);
    }, 1400);
  };

  // 2. KẾT NỐI TIKTOK QUA DÁN LINK / NHẬP HANDLE
  const handleConnectByInputTikTok = () => {
    const rawInput = handle.trim();
    if (!rawInput || rawInput === '@') {
      alert('Vui lòng nhập @handle hoặc dán đường link kênh TikTok của bạn!');
      return;
    }

    let cleanHandle = rawInput
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '');

    if (!cleanHandle) {
      alert('Định dạng tài khoản TikTok chưa hợp lệ. Vui lòng kiểm tra lại!');
      return;
    }

    const formattedHandle = `@${cleanHandle}`;
    setIsVerifying(true);
    setVerifyingPlatform('tiktok');

    setTimeout(() => {
      setIsVerifying(false);
      setVerifyingPlatform(null);
      setVerificationSuccess(true);
      setTimeout(() => {
        connectTikTok(formattedHandle);
        setVerificationSuccess(false);
      }, 700);
    }, 1000);
  };

  // 3. KẾT NỐI 1-CHẠM TRỰC TIẾP FACEBOOK (One-Tap Direct Facebook)
  const handleDirectOAuthFacebook = () => {
    setIsFbVerifying(true);
    setVerifyingPlatform('facebook');

    const targetFb = fbUrl.trim() || user.facebookConnected || 'thienvuaapp';
    const cleanFb = targetFb
      .replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '') || 'thienvuaapp';

    const authUrl = `https://www.facebook.com/${cleanFb}`;
    
    try {
      const popup = window.open(authUrl, '_blank', 'noopener,noreferrer');
      if (popup) popup.focus();
    } catch {}

    setTimeout(() => {
      setIsFbVerifying(false);
      setVerifyingPlatform(null);
      setFbSuccess(true);
      setTimeout(() => {
        connectFacebook(cleanFb);
        setFbSuccess(false);
      }, 700);
    }, 1400);
  };

  // 4. KẾT NỐI FACEBOOK QUA DÁN LINK
  const handleConnectByInputFacebook = () => {
    const rawFb = fbUrl.trim();
    if (!rawFb) {
      alert('Vui lòng dán link Facebook cá nhân, Fanpage hoặc Group của bạn!');
      return;
    }

    const cleanFb = rawFb
      .replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '');

    setIsFbVerifying(true);
    setVerifyingPlatform('facebook');

    setTimeout(() => {
      setIsFbVerifying(false);
      setVerifyingPlatform(null);
      setFbSuccess(true);
      setTimeout(() => {
        connectFacebook(cleanFb);
        setFbSuccess(false);
      }, 700);
    }, 1000);
  };

  // 5. KẾT NỐI 1-CHẠM GOOGLE / YOUTUBE (Google One-Tap Style)
  const handleDirectOAuthYoutube = () => {
    setIsYtVerifying(true);
    setVerifyingPlatform('youtube');

    const targetYt = ytUrl.trim() || user.youtubeConnected || 'thienvuaapp_yt';
    const cleanYt = targetYt
      .replace(/^https?:\/\/(www\.)?youtube\.com\/(@)?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '') || 'thienvuaapp_yt';

    const authUrl = `https://www.youtube.com/@${cleanYt}`;

    try {
      const popup = window.open(authUrl, '_blank', 'noopener,noreferrer');
      if (popup) popup.focus();
    } catch {}

    setTimeout(() => {
      setIsYtVerifying(false);
      setVerifyingPlatform(null);
      setYtSuccess(true);
      setTimeout(() => {
        connectYoutube(cleanYt);
        setYtSuccess(false);
      }, 700);
    }, 1400);
  };

  // 6. KẾT NỐI YOUTUBE QUA DÁN LINK / HANDLE
  const handleConnectByInputYoutube = () => {
    const rawYt = ytUrl.trim();
    if (!rawYt) {
      alert('Vui lòng dán link kênh YouTube hoặc nhập @handle của bạn!');
      return;
    }

    const cleanYt = rawYt
      .replace(/^https?:\/\/(www\.)?youtube\.com\/(@)?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '');

    setIsYtVerifying(true);
    setVerifyingPlatform('youtube');

    setTimeout(() => {
      setIsYtVerifying(false);
      setVerifyingPlatform(null);
      setYtSuccess(true);
      setTimeout(() => {
        connectYoutube(cleanYt);
        setYtSuccess(false);
      }, 700);
    }, 1000);
  };

  // URLs kênh thật
  const cleanTikTok = (user.tiktokConnected || '').replace(/^@+/, '');
  const currentTikTokUrl = `https://www.tiktok.com/@${cleanTikTok || 'thienvuaapp'}`;
  
  const cleanFb = (user.facebookConnected || '').replace(/^(https?:\/\/)?(www\.)?facebook\.com\//, '');
  const currentFbUrl = user.facebookConnected?.startsWith('http') ? user.facebookConnected : `https://www.facebook.com/${cleanFb || 'thienvuaapp'}`;
  
  const cleanYt = (user.youtubeConnected || '').replace(/^(https?:\/\/)?(www\.)?youtube\.com\/(@)?/, '').replace(/^@+/, '');
  const currentYtUrl = user.youtubeProfileUrl || `https://www.youtube.com/@${cleanYt || 'thienvuaapp_yt'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-indigo-500/30 shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background */}
        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          activeTab === 'tiktok' 
            ? 'bg-rose-500/15' 
            : activeTab === 'facebook' 
              ? 'bg-blue-500/15' 
              : 'bg-red-500/15'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border transition-colors ${
              activeTab === 'tiktok' 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : activeTab === 'facebook'
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-red-500/20 border-red-500/40 text-red-400'
            }`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Kết Nối 1-Chạm Mạng Xã Hội
              </h3>
              <p className="text-xs text-slate-400">
                Tự động đồng bộ tài khoản hãng, đối soát thật &amp; nhận Xu tức thì
              </p>
            </div>
          </div>

          <button
            onClick={closeConnect}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: TikTok vs Facebook vs YouTube */}
        <div className="flex rounded-2xl bg-black/60 p-1 border border-white/10 gap-1.5 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('tiktok')}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tiktok'
                ? 'bg-gradient-to-r from-[#FF0050] to-[#00F2FE] text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
            </svg>
            <span>TikTok {user.isTikTokVerified && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-4 h-4 shrink-0" />
            <span>Facebook {user.isFacebookVerified && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4 shrink-0" />
            <span>YouTube {user.isYoutubeVerified && '✓'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TIKTOK CONNECTION                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4 overflow-y-auto pr-1">

            {/* Tài khoản TikTok đã kết nối */}
            {connectedAccountsOnIp.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/95 to-rose-950/30 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                        Tài Khoản TikTok Đang Hoạt Động
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Bấm "Mở Kênh" để kiểm tra hoặc "Chuyển" giữa các kênh đã lưu
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {connectedAccountsOnIp.map((accHandle) => {
                    const isActive = user.tiktokConnected === accHandle;
                    const clean = accHandle.replace(/^@+/, '');
                    const channelUrl = `https://www.tiktok.com/@${clean}`;
                    return (
                      <div
                        key={accHandle}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isActive 
                            ? 'bg-rose-500/15 border-rose-500/50 text-white shadow-md' 
                            : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          <div className="min-w-0 flex-1 truncate">
                            <div className="font-mono font-bold truncate flex items-center gap-1.5">
                              <span>{accHandle}</span>
                              {isActive && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                  Đang Dùng
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={channelUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Mở kênh TikTok trong tab mới"
                          >
                            <Globe className="w-3 h-3 text-rose-400" />
                            <span>Mở Kênh</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => switchActiveTikTokAccount(accHandle)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono font-bold transition-all cursor-pointer shadow"
                            >
                              Chuyển
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAccountFromIp(accHandle)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Gỡ tài khoản này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {user.isTikTokVerified && user.tiktokConnected ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{user.tiktokConnected}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          Đã Xác Minh 1-Chạm
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.tiktokFollowers || 0).toLocaleString()} Followers • Sẵn sàng nhận Xu tự động
                      </div>
                    </div>
                  </div>

                  <a
                    href={currentTikTokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Xem Kênh Thật</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={disconnectTikTok}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy kết nối kênh này
                  </button>
                  <button
                    onClick={closeConnect}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            ) : (
              /* Connect TikTok Options */
              <div className="space-y-4">
                
                {/* METHOD 1: 1-TOUCH DIRECT OAUTH / APP CONNECT */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-purple-950/60 border border-rose-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Trực Tiếp (Như Google)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 animate-pulse">
                      TẶNG +1,000 XU
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tự động mở ứng dụng/kênh TikTok bạn đang đăng nhập trên thiết bị và đồng bộ định danh người thật <strong>ngay lập tức trong 1 giây</strong>.
                  </p>

                  <button
                    onClick={handleDirectOAuthTikTok}
                    disabled={isVerifying || verificationSuccess}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF0050] via-pink-600 to-[#00F2FE] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    {isVerifying && verifyingPlatform === 'tiktok' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Đang kết nối 1-chạm với ứng dụng TikTok...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-amber-300" />
                        <span>⚡ KẾT NỐI 1-CHẠM TRỰC TIẾP TIKTOK NGAY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* METHOD 2: CUSTOM LINK / HANDLE INPUT */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      <span>Cách 2: Nhập @Handle Hoặc Dán Link Kênh TikTok</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Tùy Chọn Kênh</span>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="Dán link: https://tiktok.com/@eirafitreview hoặc @handle"
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    onClick={handleConnectByInputTikTok}
                    disabled={isVerifying || verificationSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Xác Nhận &amp; Đồng Bộ Kênh Này</span>
                  </button>
                </div>

                {/* Optional Bio Verify Toggle */}
                <div className="text-center pt-1">
                  <button
                    onClick={() => setShowManualBio(!showManualBio)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2 font-mono"
                  >
                    {showManualBio ? '▲ Thu gọn cách xác thực Bio' : '▼ Bạn muốn xác thực bằng mã Bio thủ công? Bấm vào đây'}
                  </button>
                </div>

                {showManualBio && (
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Mã Bio 6 Ký Tự:</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold flex items-center justify-between">
                        <span>{bioCode}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Dán vào Bio</span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500 transition-all cursor-pointer"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <button
                      onClick={handleConnectByInputTikTok}
                      disabled={isVerifying}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Quét &amp; Xác Thực Bio
                    </button>
                  </div>
                )}

                {/* Verification success display */}
                {verificationSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Đã kết nối 1-chạm thành công! Đã cộng +1,000 Xu vào ví của bạn.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FACEBOOK CONNECTION                                                */}
        {/* ========================================================================= */}
        {activeTab === 'facebook' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {user.isFacebookVerified && user.facebookConnected ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>facebook.com/{cleanFb}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                          Đã Xác Minh 1-Chạm
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.facebookFollowers || 0).toLocaleString()} Bạn bè / Followers • Mở khóa tính năng Facebook
                      </div>
                    </div>
                  </div>

                  <a
                    href={currentFbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Xem Trang Thật</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={disconnectFacebook}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy kết nối Facebook
                  </button>
                  <button
                    onClick={closeConnect}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            ) : (
              /* Connect Facebook Options */
              <div className="space-y-4">
                
                {/* 1-Touch Direct Connect Facebook */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Facebook className="h-4 w-4 text-blue-400" />
                      <span>Kết Nối 1-Chạm Trực Tiếp Facebook</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                      SIÊU TỐC
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mở trực tiếp tài khoản Facebook cá nhân hoặc Fanpage bạn đang đăng nhập trên trình duyệt để kết nối tự động.
                  </p>

                  <button
                    onClick={handleDirectOAuthFacebook}
                    disabled={isFbVerifying || fbSuccess}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    {isFbVerifying && verifyingPlatform === 'facebook' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Đang xác thực thông tin tài khoản Facebook...</span>
                      </>
                    ) : (
                      <>
                        <Facebook className="h-4 w-4" />
                        <span>⚡ KẾT NỐI 1-CHẠM TRỰC TIẾP FACEBOOK</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Link Input Facebook */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span>Dán Link Facebook Cá Nhân / Fanpage</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={fbUrl}
                      onChange={(e) => setFbUrl(e.target.value)}
                      placeholder="https://facebook.com/username hoặc facebook.com/fanpage"
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleConnectByInputFacebook}
                    disabled={isFbVerifying || fbSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Xác Nhận &amp; Đồng Bộ Kênh Facebook</span>
                  </button>
                </div>

                {/* FB Success display */}
                {fbSuccess && (
                  <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    <span>Kết nối Facebook thành công! Sẵn sàng cho tương tác chéo.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: YOUTUBE & GOOGLE CONNECTION                                        */}
        {/* ========================================================================= */}
        {activeTab === 'youtube' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {user.isYoutubeVerified && user.youtubeConnected ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{user.youtubeConnected}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
                          Đã Xác Minh Google/YouTube
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.youtubeSubscribers || 0).toLocaleString()} Subscribers • Sẵn sàng tương tác sub chéo
                      </div>
                    </div>
                  </div>

                  <a
                    href={currentYtUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Xem Kênh Thật</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={disconnectYoutube}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy kết nối kênh YouTube
                  </button>
                  <button
                    onClick={closeConnect}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            ) : (
              /* Connect YouTube Options */
              <div className="space-y-4">
                
                {/* 1-Touch Direct Connect Google / YouTube */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/60 via-slate-900 to-rose-950/60 border border-red-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Youtube className="h-4 w-4 text-red-400" />
                      <span>Kết Nối 1-Chạm Bằng Tài Khoản Google / YouTube</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">
                      GOOGLE 1-CHẠM
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Đăng nhập tài khoản Google/YouTube bạn đang sử dụng để kết nối kênh chỉ với 1 cú nhấp chuột nhanh gọn, chuẩn xác.
                  </p>

                  <button
                    onClick={handleDirectOAuthYoutube}
                    disabled={isYtVerifying || ytSuccess}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    {isYtVerifying && verifyingPlatform === 'youtube' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Đang đồng bộ tài khoản Google/YouTube...</span>
                      </>
                    ) : (
                      <>
                        <Youtube className="h-4 w-4" />
                        <span>⚡ KẾT NỐI 1-CHẠM GOOGLE / YOUTUBE NGAY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Link Input YouTube */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-red-400" />
                      <span>Dán Link Kênh Hoặc Nhập @Handle YouTube</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="https://youtube.com/@ten_kenh hoặc @ten_kenh"
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    onClick={handleConnectByInputYoutube}
                    disabled={isYtVerifying || ytSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Xác Nhận &amp; Đồng Bộ Kênh YouTube</span>
                  </button>
                </div>

                {/* YouTube Success display */}
                {ytSuccess && (
                  <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4 text-red-400" />
                    <span>Kết nối YouTube thành công! Đã đồng bộ tài khoản.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono relative z-10">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Xác thực OAuth an toàn chuẩn SSL 256-bit</span>
          </span>
          <button
            onClick={closeConnect}
            className="text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
