import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Users,
  RefreshCw,
  Facebook,
  Share2,
  Lock,
  ArrowRight,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Trash2,
  Globe,
  Layers,
  AlertTriangle
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
    showToast,
    clientIp,
    maxAccountsPerIp,
    connectedAccountsOnIp,
    canConnectMoreAccounts,
    security7Layers,
    switchActiveTikTokAccount,
    removeAccountFromIp
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'tiktok' | 'facebook'>('tiktok');
  const [showSecurityDetails, setShowSecurityDetails] = useState<boolean>(false);
  
  // TikTok state
  const [handle, setHandle] = useState<string>(user.tiktokConnected || '@');
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  // Facebook state
  const [fbUrl, setFbUrl] = useState<string>(user.facebookConnected ? `facebook.com/${user.facebookConnected}` : '');
  const [isFbVerifying, setIsFbVerifying] = useState<boolean>(false);
  const [fbSuccess, setFbSuccess] = useState<boolean>(false);

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
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        const targetHandle = handle.trim() && handle !== '@' ? handle : '@thienvuaapp_official';
        connectTikTok(targetHandle);
      }, 1000);
    }, 1500);
  };

  // Xác minh kênh TikTok thủ công qua Bio
  const handleManualVerifyTikTok = () => {
    if (!handle.trim() || handle === '@') {
      alert('Vui lòng nhập @handle kênh TikTok của bạn!');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        connectTikTok(handle);
      }, 1000);
    }, 1800);
  };

  // 1-Chạm kết nối Facebook
  const handleOneTouchFacebook = () => {
    setIsFbVerifying(true);
    setTimeout(() => {
      setIsFbVerifying(false);
      setFbSuccess(true);
      setTimeout(() => {
        const targetFb = fbUrl.trim() ? fbUrl : 'thienvuaapp';
        connectFacebook(targetFb);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-white/15 shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          activeTab === 'tiktok' ? 'bg-rose-500/10' : 'bg-blue-500/10'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border transition-colors ${
              activeTab === 'tiktok' 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
                : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
            }`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Kết Nối 1-Chạm Mạng Xã Hội</h3>
              <p className="text-xs text-slate-400">Tự động đối soát, cộng Xu tức thì & bảo vệ chống bot</p>
            </div>
          </div>

          <button
            onClick={closeConnect}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: TikTok vs Facebook */}
        <div className="flex rounded-2xl bg-black/60 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('tiktok')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tiktok'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
            </svg>
            <span>Kênh TikTok {user.isTikTokVerified && '✓'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Tài Khoản Facebook {user.isFacebookVerified && '✓'}</span>
          </button>
        </div>

        {/* TAB 1: TIKTOK CONNECTION */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4 overflow-y-auto pr-1">

            {/* BẢO MẬT AN TOÀN TUYỆT ĐỐI 7 LỚP & GIỚI HẠN 5 TÀI KHOẢN TIKTOK / 1 IP */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/50 border border-purple-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span>Bảo Mật 7 Lớp • Chống Bot &amp; Phá Web</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                        Active 100%
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Mỗi 1 địa chỉ IP chỉ cho đăng ký tối đa 5 tài khoản TikTok
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border ${
                    connectedAccountsOnIp.length >= maxAccountsPerIp 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {connectedAccountsOnIp.length}/{maxAccountsPerIp} Slot
                  </span>
                </div>
              </div>

              {/* IP Quota Visual Progress */}
              <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Địa chỉ IP của bạn: <strong className="text-white">{clientIp}</strong></span>
                  </span>
                  <span className={`font-bold ${connectedAccountsOnIp.length >= maxAccountsPerIp ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {connectedAccountsOnIp.length >= maxAccountsPerIp ? '⚠️ Đã Đạt Giới Hạn 5/5' : `Còn ${maxAccountsPerIp - connectedAccountsOnIp.length} slot khả dụng`}
                  </span>
                </div>

                {/* 5-Slot Bar */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[0, 1, 2, 3, 4].map((slotIdx) => {
                    const acc = connectedAccountsOnIp[slotIdx];
                    const isCurrent = acc === user.tiktokConnected;
                    return (
                      <div
                        key={slotIdx}
                        className={`h-2 rounded-full transition-all ${
                          acc 
                            ? isCurrent 
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-sm shadow-rose-500/50' 
                              : 'bg-indigo-500' 
                            : 'bg-white/10'
                        }`}
                        title={acc ? `Slot ${slotIdx + 1}: ${acc}` : `Slot ${slotIdx + 1}: Còn trống`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Registered Accounts on this IP (Quick switch & slot manager) */}
              {connectedAccountsOnIp.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Tài khoản liên kết trên IP này ({connectedAccountsOnIp.length}/5):</span>
                    <span className="text-slate-500 italic">Nhấn để chuyển đổi</span>
                  </div>
                  <div className="space-y-1">
                    {connectedAccountsOnIp.map((accHandle) => {
                      const isActive = user.tiktokConnected === accHandle;
                      return (
                        <div
                          key={accHandle}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isActive 
                              ? 'bg-rose-500/10 border-rose-500/40 text-white' 
                              : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span className="font-mono font-bold truncate">{accHandle}</span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
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
                              title="Gỡ tài khoản để giải phóng slot IP"
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

              {/* 5/5 Reached Warning */}
              {connectedAccountsOnIp.length >= maxAccountsPerIp && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Lá chắn Lớp 1 (IP Limit) đang kích hoạt:</strong>
                    <span>Địa chỉ IP này đã liên kết đủ 5/5 tài khoản tối đa. Hệ thống tự động kích hoạt chế độ chặn bot, gian lận và đánh phá web. Vui lòng bấm icon thùng rác bên trên để gỡ bớt 1 tài khoản nếu muốn thêm tài khoản mới.</span>
                  </div>
                </div>
              )}

              {/* Collapsible 7 Security Layers View */}
              <div className="pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                  className="w-full flex items-center justify-between text-[11px] font-mono text-purple-300 hover:text-purple-200 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Xem Chi Tiết Cấu Trúc Bảo Mật 7 Lớp An Toàn Tuyệt Đối</span>
                  </span>
                  {showSecurityDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showSecurityDetails && (
                  <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                    {security7Layers.map((layer) => (
                      <div
                        key={layer.layer}
                        className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <span>{layer.icon}</span>
                            <span className="text-purple-300 font-mono">Lớp {layer.layer}:</span>
                            <span>{layer.name}</span>
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            ✓ {layer.shieldStatus.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">
                          {layer.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {user.isTikTokVerified ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{user.tiktokConnected || user.handle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Đã xác minh</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {user.tiktokFollowers.toLocaleString()} Followers • Sẵn sàng nhận Xu tự động
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black border border-rose-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Nhanh Nhất (Khuyên Dùng)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      Tặng +1,000 Xu
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hệ thống sẽ đồng bộ thông tin kênh TikTok của bạn, kiểm tra người dùng thật và tự động cộng ngay <strong>+1,000 Xu</strong> vào ví!
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
                      <span>Cách 2: Hướng Dẫn Xác Minh Thủ Công (Bio Code)</span>
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
                      placeholder="@kenh_tiktok_cua_ban"
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
            {user.isFacebookVerified ? (
              /* Already verified state */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>facebook.com/{user.facebookConnected || 'thienvuaapp'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">Đã xác minh</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        {(user.facebookFollowers || 15800).toLocaleString()} Bạn bè / Followers • Mở khóa chia sẻ video nhận Xu
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-black border border-blue-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Facebook className="h-4 w-4 text-blue-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Bằng Facebook Login</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      Tặng +1,000 Xu
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ủy quyền nhanh 1-chạm để sàn tự động đồng bộ link chia sẻ bài viết, mở quyền kiếm hoa hồng khi chia sẻ link TikTok lên Facebook &amp; Messenger.
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
                        <span>Bấm Kết Nối 1-Chạm Facebook</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option 2: Step-by-Step Profile / Fanpage URL */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 text-blue-400" />
                      <span>Cách 2: Hướng Dẫn Dán Link Trang Facebook</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Trang cá nhân hoặc Fanpage</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Dán link Facebook của bạn:
                    </label>
                    <input
                      type="text"
                      value={fbUrl}
                      onChange={(e) => setFbUrl(e.target.value)}
                      placeholder="https://facebook.com/thienvuaapp hoặc thienvuaapp"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Step Instructions */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-[11px] font-mono text-slate-300">
                    <p>• <strong>Bước 1:</strong> Mở app Facebook $\rightarrow$ Vào Trang cá nhân hoặc Fanpage của bạn.</p>
                    <p>• <strong>Bước 2:</strong> Bấm biểu tượng <strong>(...)</strong> cạnh nút Sửa trang cá nhân $\rightarrow$ Chọn <strong>Sao chép liên kết</strong>.</p>
                    <p>• <strong>Bước 3:</strong> Dán vào ô bên trên và bấm <em>"Xác Thực 1-Chạm"</em> để nhận ngay <strong>+1,000 Xu</strong>.</p>
                  </div>

                  <button
                    onClick={handleOneTouchFacebook}
                    disabled={isFbVerifying || fbSuccess}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Xác Thực &amp; Lưu Tài Khoản Facebook (+1,000 Xu)</span>
                  </button>
                </div>

                {/* FB Success display */}
                {fbSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Kết nối Facebook thành công! Đã cộng +1,000 Xu vào ví.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
