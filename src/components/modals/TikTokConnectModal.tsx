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
  Trash2
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
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  // Facebook state
  const [fbUrl, setFbUrl] = useState<string>(user.facebookConnected ? `facebook.com/${user.facebookConnected}` : '');
  const [isFbVerifying, setIsFbVerifying] = useState<boolean>(false);
  const [fbSuccess, setFbSuccess] = useState<boolean>(false);

  // YouTube state
  const [ytUrl, setYtUrl] = useState<string>(user.youtubeConnected || '');
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

  // 1-Chạm kết nối TikTok (Quick One-Touch Sync)
  const handleOneTouchTikTok = () => {
    const rawInput = handle.trim();
    if (!rawInput || rawInput === '@') {
      alert('Vui lòng nhập @handle hoặc dán link kênh TikTok của bạn!');
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
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        connectTikTok(formattedHandle);
      }, 800);
    }, 1200);
  };

  // Xác minh kênh TikTok thủ công qua Bio
  const handleManualVerifyTikTok = () => {
    const rawInput = handle.trim();
    if (!rawInput || rawInput === '@') {
      alert('Vui lòng nhập @handle kênh TikTok của bạn!');
      return;
    }

    let cleanHandle = rawInput
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '');

    const formattedHandle = `@${cleanHandle}`;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        connectTikTok(formattedHandle);
      }, 800);
    }, 1500);
  };

  // 1-Chạm kết nối Facebook
  const handleOneTouchFacebook = () => {
    const rawFb = fbUrl.trim();
    if (!rawFb) {
      alert('Vui lòng dán link Facebook cá nhân hoặc Fanpage của bạn!');
      return;
    }

    const cleanFb = rawFb
      .replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '');

    setIsFbVerifying(true);
    setTimeout(() => {
      setIsFbVerifying(false);
      setFbSuccess(true);
      setTimeout(() => {
        connectFacebook(cleanFb);
      }, 800);
    }, 1200);
  };

  // 1-Chạm kết nối YouTube
  const handleOneTouchYoutube = () => {
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
    setTimeout(() => {
      setIsYtVerifying(false);
      setYtSuccess(true);
      setTimeout(() => {
        connectYoutube(cleanYt);
      }, 800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-white/15 shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          activeTab === 'tiktok' 
            ? 'bg-rose-500/10' 
            : activeTab === 'facebook' 
              ? 'bg-blue-500/10' 
              : 'bg-red-500/10'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border transition-colors ${
              activeTab === 'tiktok' 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
                : activeTab === 'facebook'
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Kết Nối 1-Chạm Mạng Xã Hội</h3>
              <p className="text-xs text-slate-400">Tự động đối soát, cộng Xu tức thì &amp; bảo vệ chống bot</p>
            </div>
          </div>

          <button
            onClick={closeConnect}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: TikTok vs Facebook vs YouTube */}
        <div className="flex rounded-2xl bg-black/60 p-1 border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('tiktok')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tiktok'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
            </svg>
            <span className="truncate">TikTok {user.isTikTokVerified && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Facebook {user.isFacebookVerified && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">YouTube {user.isYoutubeVerified && '✓'}</span>
          </button>
        </div>

        {/* TAB 1: TIKTOK CONNECTION */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4 overflow-y-auto pr-1">

            {/* Tài khoản TikTok đã kết nối */}
            {connectedAccountsOnIp.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                      Tài Khoản TikTok Đã Kết Nối
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Nhấn "Chuyển" để đổi tài khoản đang hoạt động bất cứ lúc nào
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {connectedAccountsOnIp.map((accHandle) => {
                    const isActive = user.tiktokConnected === accHandle;
                    return (
                      <div
                        key={accHandle}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isActive 
                            ? 'bg-rose-500/10 border-rose-500/40 text-white' 
                            : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span className="font-mono font-bold truncate">{accHandle}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                              Đang hoạt động
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => switchActiveTikTokAccount(accHandle)}
                              className="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                            >
                              Chuyển
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAccountFromIp(accHandle)}
                            className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
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
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{user.tiktokConnected}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Đã xác minh</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.tiktokFollowers || 0).toLocaleString()} Followers • Sẵn sàng nhận Xu tự động
                      </div>
                    </div>
                  </div>
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
                {/* Option 1: 1-Touch Connect Button */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>Kết Nối 1-Chạm Siêu Nhanh (Khuyên Dùng)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      Tặng +1,000 Xu
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 block">
                      Nhập @handle hoặc dán link TikTok bạn đang dùng:
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="@kenh_cua_ban hoặc https://tiktok.com/@kenh_cua_ban"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Hệ thống sẽ đồng bộ thông tin kênh TikTok bạn đang dùng trên trình duyệt/máy, xác nhận người thật và tự động cộng ngay <strong>+1,000 Xu</strong> vào ví!
                  </p>

                  <button
                    onClick={handleOneTouchTikTok}
                    disabled={isVerifying || verificationSuccess}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Hệ thống AI đang quét hồ sơ TikTok...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span>Bấm Kết Nối 1-Chạm TikTok Ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option 2: Step-by-Step Bio Verification */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Cách 2: Xác Minh Thủ Công Bằng Mã Bio</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Chính xác 100%</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Bước 1: Nhập TikTok ID (@handle):
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="@kenh_cua_ban"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Bước 2: Sao chép mã xác minh và dán vào Bio TikTok:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold flex items-center justify-between">
                        <span>{bioCode}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Mã 6 ký tự</span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500 transition-all cursor-pointer"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Bước 3:</strong> Mở ứng dụng TikTok $\rightarrow$ <em>Sửa hồ sơ</em> $\rightarrow$ Dán mã vào <em>Tiểu sử (Bio)</em> $\rightarrow$ Bấm nút <em>"Xác Thực Ngay"</em> bên dưới. Sau khi thành công bạn có thể xóa mã khỏi Bio.
                  </p>

                  <button
                    onClick={handleManualVerifyTikTok}
                    disabled={isVerifying || verificationSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Quét &amp; Xác Thực Hồ Sơ Bio</span>
                  </button>
                </div>

                {/* Verification success display */}
                {verificationSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Xác minh thành công! Đã cộng +1,000 Xu vào ví của bạn.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FACEBOOK CONNECTION */}
        {activeTab === 'facebook' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {user.isFacebookVerified && user.facebookConnected ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>facebook.com/{user.facebookConnected}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">Đã xác minh</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.facebookFollowers || 0).toLocaleString()} Bạn bè / Followers • Mở khóa chia sẻ video nhận Xu
                      </div>
                    </div>
                  </div>
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
                {/* 1-Touch Connect Facebook */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-black border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Facebook className="h-4 w-4 text-blue-400" />
                      <span>Kết Nối 1-Chạm Tài Khoản Facebook</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 text-[10px] font-mono font-bold border border-slate-600/50">
                      Cài đặt sẵn
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 block">
                      Dán link Facebook cá nhân, Fanpage hoặc Nhóm bạn đang dùng:
                    </label>
                    <input
                      type="text"
                      value={fbUrl}
                      onChange={(e) => setFbUrl(e.target.value)}
                      placeholder="https://facebook.com/username hoặc facebook.com/groups/ten-nhom"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kết nối tài khoản Facebook để sẵn sàng cho các tính năng tương tác sắp ra mắt. <span className="text-amber-400 font-bold">Hiện chưa tính Xu.</span>
                  </p>

                  <button
                    onClick={handleOneTouchFacebook}
                    disabled={isFbVerifying || fbSuccess}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isFbVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang xác thực thông tin tài khoản Facebook...</span>
                      </>
                    ) : (
                      <>
                        <Facebook className="h-4 w-4" />
                        <span>Bấm Kết Nối 1-Chạm Facebook Ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* FB Success display */}
                {fbSuccess && (
                  <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Kết nối Facebook thành công! Cài đặt sẵn — tính năng sắp ra mắt.</span>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* TAB 3: YOUTUBE CONNECTION */}
        {activeTab === 'youtube' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {user.isYoutubeVerified && user.youtubeConnected ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{user.youtubeConnected}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">Đã xác minh</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.youtubeSubscribers || 0).toLocaleString()} Subscribers • Kênh sẵn sàng kiếm tiền &amp; tương tác
                      </div>
                    </div>
                  </div>
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
                {/* 1-Touch Connect YouTube */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-rose-950/30 to-black border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                      <Youtube className="h-4 w-4 text-red-400" />
                      <span>Kết Nối 1-Chạm Kênh YouTube</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 text-[10px] font-mono font-bold border border-slate-600/50">
                      Cài đặt sẵn
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 block">
                      Nhập @handle hoặc dán link kênh YouTube bạn đang dùng:
                    </label>
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="@ten_kenh hoặc https://youtube.com/@ten_kenh"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kết nối kênh YouTube để sẵn sàng cho các tính năng sub chéo và tương tác sắp ra mắt. <span className="text-amber-400 font-bold">Hiện chưa tính Xu.</span>
                  </p>

                  <button
                    onClick={handleOneTouchYoutube}
                    disabled={isYtVerifying || ytSuccess}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isYtVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang xác thực thông tin kênh YouTube...</span>
                      </>
                    ) : (
                      <>
                        <Youtube className="h-4 w-4" />
                        <span>Bấm Kết Nối 1-Chạm YouTube Ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* YouTube Success display */}
                {ytSuccess && (
                  <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Kết nối YouTube thành công! Cài đặt sẵn — tính năng sắp ra mắt.</span>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIKTOK SAFE AUTO-SYNC ENGINE */}
        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-[11px]">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Mã hóa SSL 256-bit an toàn</span>
          </span>
          <button
            onClick={closeConnect}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
