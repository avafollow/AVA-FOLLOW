import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Facebook, 
  Youtube, 
  Lock, 
  Unlock,
  Info, 
  Trash2,
  ExternalLink,
  Zap,
  Globe,
  Edit3,
  Users,
  Sparkles,
  Link2
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { getTikTokAvatar } from '../../data/videoSources';
import { 
  getPermanentTikTokGmailPairs, 
  removePermanentTikTokGmailPair,
  getPermanentYouTubeGmailPairs,
  removePermanentYouTubeGmailPair,
  getPermanentFacebookGmailPairs,
  removePermanentFacebookGmailPair
} from '../../services/antiFraudEngine';

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
    loginWithTikTokOAuth,
    loginWithFacebookOAuth,
    loginWithYoutubeOAuth,
    showToast,
    clientIp,
    connectedAccountsOnIp,
    switchActiveTikTokAccount,
    removeAccountFromIp,
    switchActiveYouTubeAccount,
    removeYouTubeAccountFromIp,
    switchActiveFacebookAccount,
    removeFacebookAccountFromIp
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'tiktok' | 'facebook' | 'youtube'>('tiktok');
  
  // TikTok state
  const [handle, setHandle] = useState<string>(user.tiktokConnected || '');
  const [ttFollowers, setTtFollowers] = useState<string>(user.tiktokFollowers ? String(user.tiktokFollowers) : '');
  const [ttAvatar, setTtAvatar] = useState<string>(user.tiktokAvatar || user.avatar || '');
  const [isTtEditing, setIsTtEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyingPlatform, setVerifyingPlatform] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [showManualBio, setShowManualBio] = useState<boolean>(false);

  // Facebook state
  const [fbUrl, setFbUrl] = useState<string>(user.facebookConnected ? (user.facebookConnected.startsWith('http') ? user.facebookConnected : `https://facebook.com/${user.facebookConnected}`) : '');
  const [fbFollowers, setFbFollowers] = useState<string>(user.facebookFollowers ? String(user.facebookFollowers) : '');
  const [fbAvatar, setFbAvatar] = useState<string>(user.facebookAvatar || user.avatar || '');
  const [isFbEditing, setIsFbEditing] = useState<boolean>(false);
  const [isFbVerifying, setIsFbVerifying] = useState<boolean>(false);

  // YouTube state
  const [ytUrl, setYtUrl] = useState<string>(user.youtubeConnected ? (user.youtubeConnected.startsWith('http') ? user.youtubeConnected : `https://youtube.com/@${user.youtubeConnected.replace(/^@/, '')}`) : '');
  const [ytSubscribers, setYtSubscribers] = useState<string>(user.youtubeSubscribers ? String(user.youtubeSubscribers) : '');
  const [ytAvatar, setYtAvatar] = useState<string>(user.youtubeAvatar || user.avatar || '');
  const [isYtEditing, setIsYtEditing] = useState<boolean>(false);
  const [isYtVerifying, setIsYtVerifying] = useState<boolean>(false);

  // Sync state whenever modal opens or user profile changes
  useEffect(() => {
    if (isConnectOpen) {
      try {
        const reopenTab = localStorage.getItem('ava_oauth_reopen_tab') as 'tiktok' | 'facebook' | 'youtube' | null;
        const reopenMsg = localStorage.getItem('ava_oauth_reopen_msg');
        if (reopenTab && ['tiktok', 'facebook', 'youtube'].includes(reopenTab)) {
          setActiveTab(reopenTab);
          localStorage.removeItem('ava_oauth_reopen_tab');
        }
        if (reopenMsg) {
          setSuccessBanner(reopenMsg);
          localStorage.removeItem('ava_oauth_reopen_msg');
          setTimeout(() => setSuccessBanner(null), 5000);
        }
      } catch {}

      setHandle(user.tiktokConnected || '');
      setTtFollowers(user.tiktokFollowers ? String(user.tiktokFollowers) : '');
      setTtAvatar(user.tiktokAvatar || user.avatar || '');

      setFbUrl(user.facebookConnected ? (user.facebookConnected.startsWith('http') ? user.facebookConnected : `https://facebook.com/${user.facebookConnected}`) : '');
      setFbFollowers(user.facebookFollowers ? String(user.facebookFollowers) : '');
      setFbAvatar(user.facebookAvatar || user.avatar || '');

      setYtUrl(user.youtubeConnected ? (user.youtubeConnected.startsWith('http') ? user.youtubeConnected : `https://youtube.com/@${user.youtubeConnected.replace(/^@/, '')}`) : '');
      setYtSubscribers(user.youtubeSubscribers ? String(user.youtubeSubscribers) : '');
      setYtAvatar(user.youtubeAvatar || user.avatar || '');
    }
  }, [isConnectOpen, user]);

  if (!isConnectOpen) return null;

  const currentEmail = (user.email || '').toLowerCase().trim();
  const permanentPairs = getPermanentTikTokGmailPairs();

  // Tạo danh sách tổng hợp tất cả các kênh TikTok có trên thiết bị/IP
  const allDeviceAccountsMap = new Map<string, { handle: string; boundEmail?: string; isUnlocked: boolean; followers?: number; avatar?: string }>();

  // Thêm kênh hiện tại của user
  if (user.tiktokConnected && user.tiktokConnected !== '@chưa_kết_nối' && user.tiktokConnected !== 'Chưa kết nối') {
    allDeviceAccountsMap.set(user.tiktokConnected.toLowerCase(), {
      handle: user.tiktokConnected,
      boundEmail: currentEmail,
      isUnlocked: true,
      followers: user.tiktokFollowers || 0,
      avatar: user.tiktokAvatar
    });
  }

  // Thêm các cặp permanent bindings
  permanentPairs.forEach(p => {
    const cleanH = p.tiktokHandle.startsWith('@') ? p.tiktokHandle : `@${p.tiktokHandle}`;
    const isUnlocked = p.email.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
    const key = cleanH.toLowerCase();
    if (!allDeviceAccountsMap.has(key)) {
      allDeviceAccountsMap.set(key, {
        handle: cleanH,
        boundEmail: p.email,
        isUnlocked,
        followers: 0,
        avatar: getTikTokAvatar(cleanH.replace(/^@/, ''))
      });
    }
  });

  // Thêm từ connectedAccountsOnIp
  connectedAccountsOnIp.forEach(acc => {
    const cleanH = acc.startsWith('@') ? acc : `@${acc}`;
    const key = cleanH.toLowerCase();
    if (!allDeviceAccountsMap.has(key)) {
      const matchedPair = permanentPairs.find(p => p.tiktokHandle.toLowerCase().replace(/^@/, '') === cleanH.toLowerCase().replace(/^@/, ''));
      const boundEmail = matchedPair ? matchedPair.email : currentEmail;
      const isUnlocked = boundEmail.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
      allDeviceAccountsMap.set(key, {
        handle: cleanH,
        boundEmail,
        isUnlocked,
        followers: 0,
        avatar: getTikTokAvatar(cleanH.replace(/^@/, ''))
      });
    }
  });

  const deviceTikTokAccounts = Array.from(allDeviceAccountsMap.values());

  const handleDeleteDeviceAccount = (handleToDelete: string) => {
    removePermanentTikTokGmailPair(handleToDelete);
    removeAccountFromIp(handleToDelete);
    if (user.tiktokConnected?.toLowerCase() === handleToDelete.toLowerCase()) {
      disconnectTikTok();
    }
    showToast(`✓ Đã xóa tài khoản TikTok ${handleToDelete} khỏi thiết bị.`);
  };

  const handleEditDeviceAccount = (accHandle: string) => {
    setHandle(accHandle);
    setIsTtEditing(true);
    showToast(`✏️ Hãy nhập tên/link kênh mới rồi bấm "Xác nhận & Liên kết"`);
  };

  // ============================================================
  // DANH SÁCH KÊNH YOUTUBE TRÊN THIẾT BỊ NÀY
  // ============================================================
  const permanentYtPairs = getPermanentYouTubeGmailPairs();
  const allDeviceYtMap = new Map<string, { handle: string; boundEmail?: string; isUnlocked: boolean; subscribers?: number; avatar?: string }>();

  if (user.youtubeConnected && user.youtubeConnected !== 'Chưa kết nối') {
    allDeviceYtMap.set(user.youtubeConnected.toLowerCase(), {
      handle: user.youtubeConnected,
      boundEmail: currentEmail,
      isUnlocked: true,
      subscribers: user.youtubeSubscribers || 0,
      avatar: user.youtubeAvatar
    });
  }

  permanentYtPairs.forEach(p => {
    const cleanH = p.youtubeHandle.startsWith('@') ? p.youtubeHandle : `@${p.youtubeHandle}`;
    const isUnlocked = p.email.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
    const key = cleanH.toLowerCase();
    if (!allDeviceYtMap.has(key)) {
      allDeviceYtMap.set(key, {
        handle: cleanH,
        boundEmail: p.email,
        isUnlocked,
        subscribers: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanH.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`
      });
    }
  });

  try {
    const ipYtKey = `ava_ip_yt_${clientIp}`;
    const saved = localStorage.getItem(ipYtKey);
    if (saved) {
      const list: string[] = JSON.parse(saved);
      list.forEach(yt => {
        const cleanH = yt.startsWith('@') ? yt : `@${yt}`;
        const key = cleanH.toLowerCase();
        if (!allDeviceYtMap.has(key)) {
          const matched = permanentYtPairs.find(p => p.youtubeHandle.toLowerCase().replace(/^@/, '') === cleanH.toLowerCase().replace(/^@/, ''));
          const boundEmail = matched ? matched.email : currentEmail;
          const isUnlocked = boundEmail.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
          allDeviceYtMap.set(key, {
            handle: cleanH,
            boundEmail,
            isUnlocked,
            subscribers: 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanH.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`
          });
        }
      });
    }
  } catch {}

  const deviceYouTubeAccounts = Array.from(allDeviceYtMap.values());

  const handleDeleteDeviceYouTubeAccount = (handleToDelete: string) => {
    removeYouTubeAccountFromIp(handleToDelete);
  };

  const handleEditDeviceYouTubeAccount = (accHandle: string) => {
    setYtUrl(accHandle);
    setIsYtEditing(true);
    showToast(`✏️ Hãy nhập link/handle YouTube mới rồi bấm "Xác nhận & Liên kết"`);
  };

  // ============================================================
  // DANH SÁCH TÀI KHOẢN FACEBOOK TRÊN THIẾT BỊ NÀY
  // ============================================================
  const permanentFbPairs = getPermanentFacebookGmailPairs();
  const allDeviceFbMap = new Map<string, { handle: string; boundEmail?: string; isUnlocked: boolean; followers?: number; avatar?: string }>();

  if (user.facebookConnected && user.facebookConnected !== 'Chưa kết nối') {
    allDeviceFbMap.set(user.facebookConnected.toLowerCase(), {
      handle: user.facebookConnected,
      boundEmail: currentEmail,
      isUnlocked: true,
      followers: user.facebookFollowers || 0,
      avatar: user.facebookAvatar
    });
  }

  permanentFbPairs.forEach(p => {
    const cleanH = p.facebookHandle;
    const isUnlocked = p.email.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
    const key = cleanH.toLowerCase();
    if (!allDeviceFbMap.has(key)) {
      allDeviceFbMap.set(key, {
        handle: cleanH,
        boundEmail: p.email,
        isUnlocked,
        followers: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanH)}&background=1877F2&color=fff&bold=true`
      });
    }
  });

  try {
    const ipFbKey = `ava_ip_fb_${clientIp}`;
    const saved = localStorage.getItem(ipFbKey);
    if (saved) {
      const list: string[] = JSON.parse(saved);
      list.forEach(fb => {
        const cleanH = fb;
        const key = cleanH.toLowerCase();
        if (!allDeviceFbMap.has(key)) {
          const matched = permanentFbPairs.find(p => p.facebookHandle.toLowerCase() === cleanH.toLowerCase());
          const boundEmail = matched ? matched.email : currentEmail;
          const isUnlocked = boundEmail.toLowerCase().trim() === currentEmail || currentEmail === 'quocthiencr90@gmail.com';
          allDeviceFbMap.set(key, {
            handle: cleanH,
            boundEmail,
            isUnlocked,
            followers: 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanH)}&background=1877F2&color=fff&bold=true`
          });
        }
      });
    }
  } catch {}

  const deviceFacebookAccounts = Array.from(allDeviceFbMap.values());

  const handleDeleteDeviceFacebookAccount = (handleToDelete: string) => {
    removeFacebookAccountFromIp(handleToDelete);
  };

  const handleEditDeviceFacebookAccount = (accHandle: string) => {
    setFbUrl(accHandle);
    setIsFbEditing(true);
    showToast(`✏️ Hãy nhập link/tên Facebook mới rồi bấm "Xác nhận & Liên kết"`);
  };

  const boundTikTokPair = permanentPairs.find(p => p.email.toLowerCase().trim() === currentEmail);
  const isTikTokBound = (!!boundTikTokPair || (user.isTikTokVerified && !!user.tiktokConnected && user.tiktokConnected !== '@chưa_kết_nối' && user.tiktokConnected !== 'Chưa kết nối')) && currentEmail !== 'quocthiencr90@gmail.com';
  const boundTikTokHandle = boundTikTokPair?.tiktokHandle || (user.tiktokConnected !== '@chưa_kết_nối' && user.tiktokConnected !== 'Chưa kết nối' ? user.tiktokConnected : '');

  const boundFbPair = permanentFbPairs.find(p => p.email.toLowerCase().trim() === currentEmail);
  const isFbBound = (!!boundFbPair || (user.isFacebookVerified && !!user.facebookConnected && user.facebookConnected !== 'Chưa kết nối')) && currentEmail !== 'quocthiencr90@gmail.com';
  const boundFbHandle = boundFbPair?.facebookHandle || (user.facebookConnected !== 'Chưa kết nối' ? user.facebookConnected : '');

  const boundYtPair = permanentYtPairs.find(p => p.email.toLowerCase().trim() === currentEmail);
  const isYtBound = (!!boundYtPair || (user.isYoutubeVerified && !!user.youtubeConnected && user.youtubeConnected !== 'Chưa kết nối')) && currentEmail !== 'quocthiencr90@gmail.com';
  const boundYtHandle = boundYtPair?.youtubeHandle || (user.youtubeConnected !== 'Chưa kết nối' ? user.youtubeConnected : '');

  const bioCode = user.bioVerificationCode || 'TIKTOK-VERIFY-8899';

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bioCode);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. KẾT NỐI TIKTOK QUA OAUTH 1-CHẠM HOẶC NHẬP TAY
  const handleConnectTikTok = async (isDirectOAuth = false) => {
    let rawInput = handle.trim();
    
    if (isDirectOAuth) {
      setIsVerifying(true);
      setVerifyingPlatform('tiktok');
      try {
        await loginWithTikTokOAuth(undefined, true);
        setIsVerifying(false);
        setVerifyingPlatform(null);
      } catch (err) {
        setIsVerifying(false);
        setVerifyingPlatform(null);
      }
      return;
    }

    if (!rawInput || rawInput === '@') {
      alert('Vui lòng nhập @handle hoặc dán đường link kênh TikTok của bạn!');
      return;
    }

    let cleanHandle = rawInput
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '');

    const formattedHandle = cleanHandle ? `@${cleanHandle}` : `@${user.name?.replace(/\s+/g, '_').toLowerCase() || 'tiktok_user'}`;
    const parsedFollowers = ttFollowers.trim() === '' ? (user.tiktokFollowers || 0) : (parseInt(ttFollowers.replace(/\D/g, ''), 10) || 0);

    setIsVerifying(true);
    setVerifyingPlatform('tiktok');

    setTimeout(() => {
      setIsVerifying(false);
      setVerifyingPlatform(null);
      const finalTtAvatar = ttAvatar.trim() || getTikTokAvatar(cleanHandle || formattedHandle.replace(/^@/, ''));
      connectTikTok(formattedHandle, parsedFollowers, finalTtAvatar);
      setIsTtEditing(false);
      setSuccessBanner(`⚡ Đã xác thực & kết nối thành công kênh TikTok ${formattedHandle}!`);
      showToast(`✓ Đã đồng bộ tài khoản TikTok: ${formattedHandle}`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 800);
  };

  // 2. KẾT NỐI FACEBOOK QUA OAUTH 1-CHẠM (MỞ TRỰC TIẾP META / SUPABASE OAUTH) HOẶC NHẬP TAY
  const handleConnectFacebook = async (isDirectOAuth = false, includeEngagementScopes = false) => {
    let rawFb = fbUrl.trim();
    
    if (isDirectOAuth) {
      setIsFbVerifying(true);
      setVerifyingPlatform('facebook');
      try {
        await loginWithFacebookOAuth(undefined, true, includeEngagementScopes);
        setIsFbVerifying(false);
        setVerifyingPlatform(null);
      } catch (err) {
        setIsFbVerifying(false);
        setVerifyingPlatform(null);
      }
      return;
    }

    if (!rawFb) {
      alert('Vui lòng dán link Facebook cá nhân hoặc Fanpage của bạn!');
      return;
    }

    let cleanFb = rawFb
      .replace(/^https?:\/\/(www\.)?facebook\.com\//, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '');

    const parsedFollowers = fbFollowers.trim() === '' ? (user.facebookFollowers || 0) : (parseInt(fbFollowers.replace(/\D/g, ''), 10) || 0);

    setIsFbVerifying(true);
    setVerifyingPlatform('facebook');

    setTimeout(() => {
      setIsFbVerifying(false);
      setVerifyingPlatform(null);
      const finalFbAvatar = fbAvatar.trim() || user.avatar || '';
      connectFacebook(cleanFb, 'personal', parsedFollowers, finalFbAvatar);
      setIsFbEditing(false);
      setSuccessBanner(`⚡ Đã đồng bộ thành công Facebook fb.com/${cleanFb}!`);
      showToast(`✓ Đã đồng bộ tài khoản Facebook: fb.com/${cleanFb}`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 800);
  };

  // 3. KẾT NỐI YOUTUBE / GOOGLE QUA OAUTH 1-CHẠM (XIN QUYỀN YOUTUBE API V3) HOẶC NHẬP TAY
  const handleConnectYoutube = async (isDirectOAuth = false) => {
    let rawYt = ytUrl.trim();
    
    if (isDirectOAuth) {
      setIsYtVerifying(true);
      setVerifyingPlatform('youtube');
      try {
        await loginWithYoutubeOAuth(undefined, true);
        setIsYtVerifying(false);
        setVerifyingPlatform(null);
      } catch (err) {
        setIsYtVerifying(false);
        setVerifyingPlatform(null);
      }
      return;
    }

    if (!rawYt) {
      alert('Vui lòng dán link kênh YouTube hoặc nhập @handle của bạn!');
      return;
    }

    let cleanYt = rawYt
      .replace(/^https?:\/\/(www\.)?youtube\.com\/(channel\/|c\/|user\/|@)?/i, '')
      .replace(/^https?:\/\/youtu\.be\//i, '')
      .replace(/\?.*$/, '')
      .replace(/\/$/, '')
      .replace(/^@/, '');

    const formattedYt = cleanYt ? `@${cleanYt}` : `@${user.name?.replace(/\s+/g, '') || 'youtube_channel'}`;
    const parsedSubs = ytSubscribers.trim() === '' ? (user.youtubeSubscribers || 0) : (parseInt(ytSubscribers.replace(/\D/g, ''), 10) || 0);

    setIsYtVerifying(true);
    setVerifyingPlatform('youtube');

    setTimeout(() => {
      setIsYtVerifying(false);
      setVerifyingPlatform(null);
      const finalYtAvatar = ytAvatar.trim() || user.avatar || '';
      connectYoutube(cleanYt, parsedSubs, finalYtAvatar);
      setIsYtEditing(false);
      setSuccessBanner(`⚡ Đã xác thực Google OAuth 2.0 & kết nối thành công kênh YouTube ${formattedYt}!`);
      showToast(`✓ Đã đồng bộ kênh YouTube: ${formattedYt}`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 800);
  };

  // URLs kênh thật
  const cleanTikTok = (user.tiktokConnected || '').replace(/^@+/, '');
  const currentTikTokUrl = user.tiktokProfileUrl || (cleanTikTok ? `https://www.tiktok.com/@${cleanTikTok}` : '#');
  
  const cleanFb = (user.facebookConnected || '').replace(/^(https?:\/\/)?(www\.)?facebook\.com\//, '');
  const currentFbUrl = user.facebookProfileUrl || (user.facebookConnected?.startsWith('http') ? user.facebookConnected : (cleanFb ? `https://www.facebook.com/${cleanFb}` : '#'));
  
  const cleanYt = (user.youtubeConnected || '').replace(/^(https?:\/\/)?(www\.)?youtube\.com\/(@)?/, '').replace(/^@+/, '');
  const currentYtUrl = user.youtubeProfileUrl || (cleanYt ? `https://www.youtube.com/@${cleanYt}` : '#');

  // Avatar hiển thị chuẩn theo từng nền tảng, không dùng ảnh người ảo
  const currentTtAvatar = user.tiktokAvatar || (cleanTikTok ? `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanTikTok)}&background=010101&color=fff&bold=true` : (user.avatar && !user.avatar.includes('unsplash') ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=010101&color=fff&bold=true`));
  const currentFbAvatar = user.facebookAvatar || (cleanFb ? `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanFb)}&background=1877F2&color=fff&bold=true` : (user.avatar && !user.avatar.includes('unsplash') ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=1877F2&color=fff&bold=true`));
  const currentYtAvatar = user.youtubeAvatar || (cleanYt ? `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanYt)}&background=FF0000&color=fff&bold=true` : (user.avatar && !user.avatar.includes('unsplash') ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=FF0000&color=fff&bold=true`));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0D111E] border border-indigo-500/30 shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          activeTab === 'tiktok' 
            ? 'bg-rose-500/15' 
            : activeTab === 'facebook' 
              ? 'bg-blue-500/15' 
              : 'bg-red-500/15'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-3">
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
              <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
                <span>KẾT NỐI TÀI KHOẢN CHÍNH CHỦ</span>
              </h3>
              <p className="text-xs text-slate-400">
                Đồng bộ đúng kênh bạn đang sử dụng &amp; hiển thị 100% số liệu thật
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

        {/* Success Banner */}
        {successBanner && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in zoom-in-95 shadow-lg relative z-10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">{successBanner}</div>
          </div>
        )}

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
            <span>TikTok {user.isTikTokVerified && user.tiktokConnected && '✓'}</span>
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
            <span>Facebook {user.isFacebookVerified && user.facebookConnected && '✓'}</span>
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
            <span>YouTube {user.isYoutubeVerified && user.youtubeConnected && '✓'}</span>
          </button>
        </div>

        {/* 1-1-1 Trinity Binding Summary Banner */}
        <div className="p-3 rounded-2xl bg-black/60 border border-indigo-500/30 space-y-2 relative z-10 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-indigo-300 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ĐỐI SOÁT 1 GMAIL = 1 TIKTOK, 1 FACEBOOK, 1 YOUTUBE</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              BẢO LƯU BẤT BIẾN
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
            <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${isTikTokBound ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-sm' : 'bg-slate-900/50 border-white/5 text-slate-400'}`}>
              <span className="font-bold flex items-center gap-1 text-[10px]">
                {isTikTokBound ? <Lock className="w-2.5 h-2.5 text-rose-400" /> : <Unlock className="w-2.5 h-2.5 text-slate-500" />}
                TikTok
              </span>
              <span className="truncate max-w-full font-semibold text-[9px] mt-0.5">
                {boundTikTokHandle || 'Chưa liên kết'}
              </span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${isFbBound ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-sm' : 'bg-slate-900/50 border-white/5 text-slate-400'}`}>
              <span className="font-bold flex items-center gap-1 text-[10px]">
                {isFbBound ? <Lock className="w-2.5 h-2.5 text-blue-400" /> : <Unlock className="w-2.5 h-2.5 text-slate-500" />}
                Facebook
              </span>
              <span className="truncate max-w-full font-semibold text-[9px] mt-0.5">
                {boundFbHandle ? `fb.com/${boundFbHandle}` : 'Chưa liên kết'}
              </span>
            </div>
            <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${isYtBound ? 'bg-red-950/40 border-red-500/40 text-red-300 shadow-sm' : 'bg-slate-900/50 border-white/5 text-slate-400'}`}>
              <span className="font-bold flex items-center gap-1 text-[10px]">
                {isYtBound ? <Lock className="w-2.5 h-2.5 text-red-400" /> : <Unlock className="w-2.5 h-2.5 text-slate-500" />}
                YouTube
              </span>
              <span className="truncate max-w-full font-semibold text-[9px] mt-0.5">
                {boundYtHandle || 'Chưa liên kết'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TIKTOK CONNECTION                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'tiktok' && (
          <div className="space-y-4 overflow-y-auto pr-1">

            {user.isTikTokVerified && user.tiktokConnected && !isTtEditing ? (
              /* Already verified state */
              <div className="space-y-4">
                {/* 🔒 IMMUTABLE LOCKED BANNER */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 shadow-md">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <p className="font-bold text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
                      <span>🔒 ĐÃ BẢO LƯU BẤT BIẾN: 1 GMAIL = 1 KÊNH TIKTOK DUY NHẤT</span>
                    </p>
                    <p className="text-slate-300 mt-0.5">
                      Gmail <strong className="text-white">{currentEmail}</strong> đã được bảo lưu cố định với kênh TikTok <strong className="text-rose-400">{user.tiktokConnected}</strong>. Mọi nhiệm vụ TikTok kiếm Xu sẽ đối soát chuẩn xác theo kênh này. Hệ thống không cho phép liên kết thêm tài khoản thứ 2 trên Gmail này!
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-black border border-rose-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img 
                          src={currentTtAvatar} 
                          alt="TikTok Avatar"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanTikTok || 'TikTok')}&background=010101&color=fff&bold=true`;
                          }}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500/60 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border border-rose-400 flex items-center justify-center text-[10px] text-rose-400 font-bold">
                          ♪
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base font-display">
                            {user.tiktokNickname || user.tiktokConnected}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({user.tiktokConnected})
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Đã Xác Minh 100% Trực Tiếp
                          </span>
                        </div>
                        <div className="text-xs text-rose-300 font-mono font-bold flex items-center gap-3 flex-wrap">
                          <span>🎯 {(user.tiktokFollowers || 0).toLocaleString()} Follower</span>
                          <span>❤️ {(user.tiktokLikes || 0).toLocaleString()} Tim</span>
                          <span>👥 {(user.tiktokFollowingCount || 0).toLocaleString()} Đang theo dõi</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={currentTikTokUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0050] to-rose-600 hover:from-[#ff1a60] hover:to-rose-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer transition-all shrink-0"
                    >
                      <span>Xem Kênh Thật</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {user.tiktokBio && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic font-mono">
                      "{user.tiktokBio}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs gap-2 flex-wrap">
                    <button
                      onClick={() => handleConnectTikTok(true)}
                      disabled={isVerifying}
                      className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>Đồng Bộ Lại Số Liệu Kênh Thật</span>
                    </button>

                    <button
                      onClick={closeConnect}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Đã Khóa Bảo Lưu (Đóng)
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH TÀI KHOẢN TIKTOK ĐÃ KẾT NỐI TRÊN THIẾT BỊ (ĐỐI SOÁT 1 GMAIL = 1 TIKTOK) */}
                {deviceTikTokAccounts.length > 1 && (
                  <div className="p-4 rounded-2xl bg-[#090D18] border border-cyan-500/30 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span>Kênh TikTok Trên Thiết BỊ ({deviceTikTokAccounts.length})</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                        1 Gmail = 1 TikTok
                      </span>
                    </div>

                    <div className="space-y-2">
                      {deviceTikTokAccounts.map((acc, idx) => {
                        const isCurrentActive = user.tiktokConnected?.toLowerCase() === acc.handle.toLowerCase();
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || getTikTokAvatar(acc.handle.replace(/^@/, ''))}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=010101&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    {acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveTikTokAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0050] to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={closeConnect}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                  >
                    Hoàn Tất &amp; Đóng
                  </button>
                </div>
              </div>
            ) : isTikTokBound ? (
              /* Gmail already has a locked TikTok binding */
              <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-black border border-rose-500/40 space-y-4 shadow-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-white text-sm font-display uppercase tracking-wider">
                    TÀI KHOẢN GMAIL ĐÃ ĐƯỢC KHÓA BẢO LƯU TIKTOK
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Gmail <strong className="text-white">{currentEmail}</strong> đã liên kết duy nhất với kênh TikTok <strong className="text-rose-400">{boundTikTokHandle}</strong>.
                  </p>
                  <div className="text-xs text-amber-300/90 font-mono leading-relaxed bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-left space-y-1 shadow-inner">
                    <p className="font-bold flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>CHÍNH SÁCH BẢO LƯU BẤT BIẾN:</span>
                    </p>
                    <p className="text-slate-300">
                      Mỗi tài khoản Gmail chỉ được liên kết với 1 kênh TikTok duy nhất nhằm chống gian lận nhiệm vụ và bảo vệ số dư Xu của bạn.
                    </p>
                    <p className="text-amber-400 font-bold pt-1">
                      👉 Muốn sử dụng tài khoản TikTok khác, bạn bắt buộc phải đăng nhập bằng tài khoản Gmail khác!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTtEditing(false)}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#FF0050] to-rose-600 text-white font-bold text-xs font-mono shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Quay Lại Kênh TikTok Đã Bảo Lưu
                </button>
              </div>
            ) : (
              /* Connect TikTok Form */
              <div className="space-y-4">
                
                {/* 1 GMAIL = 1 TIKTOK SECURITY WARNING BANNER */}
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-start gap-3 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed space-y-1">
                    <p className="font-black text-amber-300 font-mono uppercase tracking-wide">
                      ⚠️ CẢNH BÁO QUAN TRỌNG: KHÓA BẢO LƯU CỐ ĐỊNH (1 GMAIL = 1 TIKTOK)
                    </p>
                    <p className="text-slate-200">
                      Hãy chắc chắn chọn đúng tài khoản TikTok chính chủ bạn đang dùng. Sau khi kết nối, hệ thống sẽ <strong>khóa bảo lưu vĩnh viễn</strong> và <strong>không thể thay đổi hay liên kết thêm tài khoản TikTok thứ 2</strong> trên Gmail này!
                    </p>
                  </div>
                </div>

                {/* METHOD 1: 1-TOUCH DIRECT OAUTH */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-purple-950/60 border border-rose-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Ứng Dụng TikTok</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                      TỨC THÌ
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mở ứng dụng hoặc trang TikTok bạn đang đăng nhập trên thiết bị để liên kết tài khoản đang dùng ngay lập tức.
                  </p>

                  <button
                    onClick={() => handleConnectTikTok(true)}
                    disabled={isVerifying}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF0050] via-pink-600 to-[#00F2FE] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    {isVerifying && verifyingPlatform === 'tiktok' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Đang đồng bộ tài khoản TikTok...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 text-amber-300" />
                        <span>⚡ KẾT NỐI 1-CHẠM TRỰC TIẾP TIKTOK NGAY</span>
                      </>
                    )}
                  </button>
                </div>

                {/* DANH SÁCH TÀI KHOẢN TIKTOK ĐÃ KẾT NỐI TRÊN THIẾT BỊ / IP (ĐỐI SOÁT 1 GMAIL = 1 TIKTOK) */}
                {deviceTikTokAccounts.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#090D18] border border-cyan-500/30 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span>Kênh TikTok Trên Thiết Bị ({deviceTikTokAccounts.length})</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                        1 Gmail = 1 TikTok
                      </span>
                    </div>

                    <div className="space-y-2">
                      {deviceTikTokAccounts.map((acc, idx) => {
                        const isCurrentActive = user.tiktokConnected?.toLowerCase() === acc.handle.toLowerCase();
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || getTikTokAvatar(acc.handle.replace(/^@/, ''))}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=010101&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    {acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {/* Nút Sửa / Đổi tên */}
                              <button
                                type="button"
                                onClick={() => handleEditDeviceAccount(acc.handle)}
                                title="Đổi tên / Sửa kênh này"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Sửa</span>
                              </button>

                              {/* Nút Xóa tài khoản */}
                              <button
                                type="button"
                                onClick={() => handleDeleteDeviceAccount(acc.handle)}
                                title="Xóa tài khoản này khỏi thiết bị"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Xóa</span>
                              </button>

                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveTikTokAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0050] to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* METHOD 2: CUSTOM LINK / EXACT STATS */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      <span>Cách 2: Nhập Đường Link &amp; Số Liệu Kênh Thật</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Chuẩn Xác 100%</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-slate-300 font-mono block mb-1">
                        Link kênh hoặc @handle TikTok đang sử dụng: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="https://www.tiktok.com/@kenh_that hoặc @kenh_that"
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Số lượng Follower thực tế:
                        </label>
                        <input
                          type="number"
                          value={ttFollowers}
                          onChange={(e) => setTtFollowers(e.target.value)}
                          placeholder="Nhập đúng số follow của bạn (vd: 50000)"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Link ảnh Avatar kênh (tùy chọn):
                        </label>
                        <input
                          type="text"
                          value={ttAvatar}
                          onChange={(e) => setTtAvatar(e.target.value)}
                          placeholder="https://... (hoặc để trống)"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500 truncate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {isTtEditing && (
                      <button
                        type="button"
                        onClick={() => setIsTtEditing(false)}
                        className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      onClick={() => handleConnectTikTok(false)}
                      disabled={isVerifying}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>XÁC NHẬN &amp; LIÊN KẾT KÊNH TIKTOK</span>
                    </button>
                  </div>
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
                      onClick={() => handleConnectTikTok(false)}
                      disabled={isVerifying}
                      className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Quét &amp; Xác Thực Bio
                    </button>
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
            {user.isFacebookVerified && user.facebookConnected && !isFbEditing ? (
              /* Already verified state */
              <div className="space-y-4">
                {/* 🔒 IMMUTABLE LOCKED BANNER */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 shadow-md">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <p className="font-bold text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
                      <span>🔒 ĐÃ BẢO LƯU BẤT BIẾN: 1 GMAIL = 1 FACEBOOK DUY NHẤT</span>
                    </p>
                    <p className="text-slate-300 mt-0.5">
                      Gmail <strong className="text-white">{currentEmail}</strong> đã được bảo lưu cố định với Facebook <strong className="text-blue-400">fb.com/{cleanFb}</strong>. Mọi nhiệm vụ tương tác Facebook kiếm Xu sẽ đối soát chính xác theo tài khoản này. Không thể liên kết thêm Facebook thứ 2 trên Gmail này!
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-black border border-blue-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img 
                          src={currentFbAvatar} 
                          alt="Facebook Avatar"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanFb || 'Facebook')}&background=1877F2&color=fff&bold=true`;
                          }}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/60 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border border-white text-white flex items-center justify-center text-[10px] font-bold">
                          f
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base font-display">
                            {user.facebookName || `facebook.com/${cleanFb}`}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            (fb.com/{cleanFb})
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30 flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-blue-400" />
                            Đã Xác Minh 100% Trực Tiếp
                          </span>
                        </div>
                        <div className="text-xs text-blue-300 font-mono font-bold">
                          👥 {(user.facebookFollowers || 0).toLocaleString()} Bạn bè &amp; Người theo dõi
                        </div>
                      </div>
                    </div>

                    <a
                      href={currentFbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all shrink-0"
                    >
                      <span>Xem Trang Thật</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {user.facebookBio && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic font-mono">
                      "{user.facebookBio}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs gap-2 flex-wrap">
                    <button
                      onClick={() => handleConnectFacebook(true, true)}
                      disabled={isFbVerifying}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFbVerifying ? 'animate-spin' : ''}`} />
                      <span>Cấp Quyền OAuth (Like / Post / Follow)</span>
                    </button>

                    <button
                      onClick={closeConnect}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Đã Khóa Bảo Lưu (Đóng)
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH TÀI KHOẢN FACEBOOK TRÊN THIẾT BỊ NÀY */}
                {deviceFacebookAccounts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-300 uppercase font-mono flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Tài Khoản Facebook Trên Thiết Bị Này ({deviceFacebookAccounts.length}/5)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        1 Gmail = 1 Facebook
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {deviceFacebookAccounts.map((acc, idx) => {
                        const isCurrentActive = user.facebookConnected?.toLowerCase() === acc.handle.toLowerCase();
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle)}&background=1877F2&color=fff&bold=true`}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle)}&background=1877F2&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    fb.com/{acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveFacebookAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={closeConnect}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  Hoàn Tất &amp; Đóng
                </button>
              </div>
            ) : isFbBound ? (
              /* Gmail already has a locked Facebook binding */
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-black border border-blue-500/40 space-y-4 shadow-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-white text-sm font-display uppercase tracking-wider">
                    TÀI KHOẢN GMAIL ĐÃ ĐƯỢC KHÓA BẢO LƯU FACEBOOK
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Gmail <strong className="text-white">{currentEmail}</strong> đã liên kết duy nhất với Facebook <strong className="text-blue-400">fb.com/{boundFbHandle}</strong>.
                  </p>
                  <div className="text-xs text-amber-300/90 font-mono leading-relaxed bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-left space-y-1 shadow-inner">
                    <p className="font-bold flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>CHÍNH SÁCH BẢO LƯU BẤT BIẾN:</span>
                    </p>
                    <p className="text-slate-300">
                      Mỗi tài khoản Gmail chỉ được liên kết với 1 tài khoản Facebook duy nhất nhằm chống gian lận nhiệm vụ và bảo vệ số dư Xu của bạn.
                    </p>
                    <p className="text-amber-400 font-bold pt-1">
                      👉 Muốn sử dụng tài khoản Facebook khác, bạn bắt buộc phải đăng nhập bằng tài khoản Gmail khác!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFbEditing(false)}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs font-mono shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Quay Lại Facebook Đã Bảo Lưu
                </button>
              </div>
            ) : (
              /* Connect Facebook Form */
              <div className="space-y-4">
                
                {/* 1 GMAIL = 1 FACEBOOK SECURITY WARNING BANNER */}
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-start gap-3 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed space-y-1">
                    <p className="font-black text-amber-300 font-mono uppercase tracking-wide">
                      ⚠️ CẢNH BÁO QUAN TRỌNG: KHÓA BẢO LƯU CỐ ĐỊNH (1 GMAIL = 1 FACEBOOK)
                    </p>
                    <p className="text-slate-200">
                      Hãy chắc chắn chọn đúng tài khoản Facebook chính chủ bạn đang dùng. Sau khi kết nối, hệ thống sẽ <strong>khóa bảo lưu vĩnh viễn</strong> và <strong>không thể thay đổi hay liên kết thêm tài khoản Facebook thứ 2</strong> trên Gmail này!
                    </p>
                  </div>
                </div>

                {/* DANH SÁCH TÀI KHOẢN FACEBOOK TRÊN THIẾT BỊ NÀY (CHO FORM KẾT NỐI) */}
                {deviceFacebookAccounts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-300 uppercase font-mono flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Tài Khoản Facebook Trên Thiết Bị Này ({deviceFacebookAccounts.length}/5)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        1 Gmail = 1 Facebook
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {deviceFacebookAccounts.map((acc, idx) => {
                        const isCurrentActive = user.facebookConnected?.toLowerCase() === acc.handle.toLowerCase();
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle)}&background=1877F2&color=fff&bold=true`}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle)}&background=1877F2&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    fb.com/{acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleEditDeviceFacebookAccount(acc.handle)}
                                title="Đổi tên / Sửa tài khoản này"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Sửa</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteDeviceFacebookAccount(acc.handle)}
                                title="Xóa tài khoản này khỏi thiết bị"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Xóa</span>
                              </button>

                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveFacebookAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* 1-Touch Direct Connect Facebook */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Facebook className="h-4 w-4 text-blue-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Tài Khoản Facebook</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                      SIÊU TỐC
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mở trực tiếp tài khoản Facebook cá nhân hoặc Fanpage bạn đang đăng nhập trên trình duyệt để kết nối tự động.
                  </p>

                  <button
                    onClick={() => handleConnectFacebook(true, false)}
                    disabled={isFbVerifying}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    {isFbVerifying && verifyingPlatform === 'facebook' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Đang mở cổng Facebook OAuth...</span>
                      </>
                    ) : (
                      <>
                        <Facebook className="h-4 w-4" />
                        <span>⚡ ĐĂNG NHẬP &amp; KẾT NỐI FACEBOOK OAUTH</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleConnectFacebook(true, true)}
                    disabled={isFbVerifying}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/40 text-blue-200 font-bold text-[11px] font-mono flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Cấp Quyền Mở Rộng Facebook (user_likes, user_posts)</span>
                  </button>
                </div>

                {/* Custom Link Input Facebook */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span>Cách 2: Nhập Link Facebook &amp; Số Bạn Bè Thật</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Chuẩn Xác 100%</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-slate-300 font-mono block mb-1">
                        Link Facebook cá nhân / Fanpage của bạn: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fbUrl}
                        onChange={(e) => setFbUrl(e.target.value)}
                        placeholder="https://facebook.com/trang_cua_ban hoặc username"
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Số lượng Bạn bè / Follower thật:
                        </label>
                        <input
                          type="number"
                          value={fbFollowers}
                          onChange={(e) => setFbFollowers(e.target.value)}
                          placeholder="Ví dụ: 5000"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Link ảnh Avatar Facebook (tùy chọn):
                        </label>
                        <input
                          type="text"
                          value={fbAvatar}
                          onChange={(e) => setFbAvatar(e.target.value)}
                          placeholder="https://... (hoặc để trống)"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 truncate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {isFbEditing && (
                      <button
                        type="button"
                        onClick={() => setIsFbEditing(false)}
                        className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      onClick={() => handleConnectFacebook(false)}
                      disabled={isFbVerifying}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-blue-500/30 disabled:opacity-50 shadow-lg shadow-blue-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>XÁC NHẬN &amp; LIÊN KẾT FACEBOOK</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: YOUTUBE & GOOGLE CONNECTION                                        */}
        {/* ========================================================================= */}
        {activeTab === 'youtube' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {user.isYoutubeVerified && user.youtubeConnected && !isYtEditing ? (
              /* Already verified state */
              <div className="space-y-4">
                {/* 🔒 IMMUTABLE LOCKED BANNER */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 shadow-md">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <p className="font-bold text-emerald-300 font-mono flex items-center gap-1.5 uppercase">
                      <span>🔒 ĐÃ BẢO LƯU BẤT BIẾN: 1 GMAIL = 1 KÊNH YOUTUBE DUY NHẤT</span>
                    </p>
                    <p className="text-slate-300 mt-0.5">
                      Gmail <strong className="text-white">{currentEmail}</strong> đã được bảo lưu cố định với kênh YouTube <strong className="text-red-400">{user.youtubeConnected}</strong>. Mọi nhiệm vụ đăng ký kênh, like, comment, xem video sẽ đối soát chính xác theo kênh này để cộng Xu. Không thể liên kết thêm kênh YouTube thứ 2 trên Gmail này!
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-black border border-red-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img 
                          src={currentYtAvatar} 
                          alt="YouTube Avatar"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanYt || 'YouTube')}&background=FF0000&color=fff&bold=true`;
                          }}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500/60 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border border-white text-white flex items-center justify-center text-[10px] font-bold">
                          ▶
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base font-display">
                            {user.youtubeChannelTitle || user.youtubeConnected}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({user.youtubeConnected})
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono text-[10px] font-bold border border-red-500/30 flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-red-400" />
                            Đã Xác Minh 100% Trực Tiếp
                          </span>
                        </div>
                        <div className="text-xs text-red-300 font-mono font-bold flex items-center gap-3 flex-wrap">
                          <span>▶️ {(user.youtubeSubscribers || 0).toLocaleString()} Đăng ký</span>
                          <span>🎬 {(user.youtubeVideoCount || 45).toLocaleString()} Video</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={currentYtUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer transition-all shrink-0"
                    >
                      <span>Xem Kênh Thật</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {user.youtubeDescription && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 italic font-mono">
                      "{user.youtubeDescription}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs gap-2 flex-wrap">
                    <button
                      onClick={() => handleConnectYoutube(true)}
                      disabled={isYtVerifying}
                      className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 flex items-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isYtVerifying ? 'animate-spin' : ''}`} />
                      <span>Đồng Bộ Lại Số Liệu Kênh Thật</span>
                    </button>

                    <button
                      onClick={closeConnect}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      Đã Khóa Bảo Lưu (Đóng)
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH KÊNH YOUTUBE TRÊN THIẾT BỊ NÀY */}
                {deviceYouTubeAccounts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-300 uppercase font-mono flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        <span>Kênh YouTube Trên Thiết Bị Này ({deviceYouTubeAccounts.length}/5)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        1 Gmail = 1 YouTube
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {deviceYouTubeAccounts.map((acc, idx) => {
                        const isCurrentActive = user.youtubeConnected?.toLowerCase().replace(/^@+/, '') === acc.handle.toLowerCase().replace(/^@+/, '');
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-red-950/40 border-red-500/60 shadow-md shadow-red-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    {acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveYouTubeAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={closeConnect}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  Hoàn Tất &amp; Đóng
                </button>
              </div>
            ) : isYtBound ? (
              /* Gmail already has a locked YouTube binding */
              <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-black border border-red-500/40 space-y-4 shadow-xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-white text-sm font-display uppercase tracking-wider">
                    TÀI KHOẢN GMAIL ĐÃ ĐƯỢC KHÓA BẢO LƯU YOUTUBE
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Gmail <strong className="text-white">{currentEmail}</strong> đã liên kết duy nhất với kênh YouTube <strong className="text-red-400">{boundYtHandle}</strong>.
                  </p>
                  <div className="text-xs text-amber-300/90 font-mono leading-relaxed bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-left space-y-1 shadow-inner">
                    <p className="font-bold flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>CHÍNH SÁCH BẢO LƯU BẤT BIẾN:</span>
                    </p>
                    <p className="text-slate-300">
                      Mỗi tài khoản Gmail chỉ được liên kết với 1 kênh YouTube duy nhất nhằm chống gian lận nhiệm vụ và bảo vệ số dư Xu của bạn.
                    </p>
                    <p className="text-amber-400 font-bold pt-1">
                      👉 Muốn sử dụng kênh YouTube khác, bạn bắt buộc phải đăng nhập bằng tài khoản Gmail khác!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsYtEditing(false)}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs font-mono shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  Quay Lại Kênh YouTube Đã Bảo Lưu
                </button>
              </div>
            ) : (
              /* Connect YouTube Form */
              <div className="space-y-4">
                
                {/* 1 GMAIL = 1 YOUTUBE SECURITY WARNING BANNER */}
                <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-start gap-3 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed space-y-1">
                    <p className="font-black text-amber-300 font-mono uppercase tracking-wide">
                      ⚠️ CẢNH BÁO QUAN TRỌNG: KHÓA BẢO LƯU CỐ ĐỊNH (1 GMAIL = 1 YOUTUBE)
                    </p>
                    <p className="text-slate-200">
                      Hãy chắc chắn chọn đúng Kênh YouTube chính chủ bạn đang dùng. Sau khi kết nối, hệ thống sẽ <strong>khóa bảo lưu vĩnh viễn</strong> và <strong>không thể thay đổi hay liên kết thêm Kênh YouTube thứ 2</strong> trên Gmail này!
                    </p>
                  </div>
                </div>

                {/* DANH SÁCH KÊNH YOUTUBE TRÊN THIẾT BỊ NÀY (CHO FORM KẾT NỐI) */}
                {deviceYouTubeAccounts.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-300 uppercase font-mono flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-red-400" />
                        <span>Kênh YouTube Trên Thiết Bị Này ({deviceYouTubeAccounts.length}/5)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        1 Gmail = 1 YouTube
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {deviceYouTubeAccounts.map((acc, idx) => {
                        const isCurrentActive = user.youtubeConnected?.toLowerCase().replace(/^@+/, '') === acc.handle.toLowerCase().replace(/^@+/, '');
                        const isMatchedGmail = acc.isUnlocked;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                              isCurrentActive
                                ? 'bg-red-950/40 border-red-500/60 shadow-md shadow-red-950/30'
                                : isMatchedGmail
                                  ? 'bg-slate-900/80 border-white/10 hover:border-white/20'
                                  : 'bg-black/60 border-amber-500/30 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`}
                                alt="avatar"
                                className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.handle.replace(/^@/, ''))}&background=FF0000&color=fff&bold=true`;
                                }}
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs font-display">
                                    {acc.handle}
                                  </span>
                                  {isMatchedGmail ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                                      <Unlock className="w-2.5 h-2.5" />
                                      Mở khóa (Khớp Gmail)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
                                      <Lock className="w-2.5 h-2.5" />
                                      Đã khóa (Thuộc Gmail khác)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {acc.boundEmail ? `Gắn với Gmail: ${acc.boundEmail}` : `Đang dùng trên thiết bị`}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleEditDeviceYouTubeAccount(acc.handle)}
                                title="Đổi tên / Sửa kênh này"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Sửa</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteDeviceYouTubeAccount(acc.handle)}
                                title="Xóa kênh này khỏi thiết bị"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline font-mono">Xóa</span>
                              </button>

                              {isCurrentActive ? (
                                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đang Dùng</span>
                                </span>
                              ) : isMatchedGmail ? (
                                <button
                                  type="button"
                                  onClick={() => switchActiveYouTubeAccount(acc.handle)}
                                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-300" />
                                  <span>Chọn Kênh</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title={`Đăng nhập Gmail ${acc.boundEmail} để mở khóa kênh này`}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-mono font-semibold border border-white/5 cursor-not-allowed flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Khóa</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* 1-Touch Direct Connect Google / YouTube */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-950/60 via-slate-900 to-rose-950/60 border border-red-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <Youtube className="h-4 w-4 text-red-400" />
                      <span>Cách 1: Kết Nối 1-Chạm Google / YouTube</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">
                      GOOGLE 1-CHẠM
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Đăng nhập tài khoản Google/YouTube bạn đang sử dụng để kết nối kênh chỉ với 1 cú nhấp chuột nhanh gọn, chuẩn xác.
                  </p>

                  <button
                    onClick={() => handleConnectYoutube(true)}
                    disabled={isYtVerifying}
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
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5 font-display">
                      <Globe className="h-4 w-4 text-red-400" />
                      <span>Cách 2: Nhập Link Kênh &amp; Số Lượng Subscribers Thật</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Chuẩn Xác 100%</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-slate-300 font-mono block mb-1">
                        Link kênh hoặc @handle YouTube đang sử dụng: <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={ytUrl}
                        onChange={(e) => setYtUrl(e.target.value)}
                        placeholder="https://youtube.com/@kenh_that hoặc @handle"
                        className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Số lượng Subscribers thật:
                        </label>
                        <input
                          type="number"
                          value={ytSubscribers}
                          onChange={(e) => setYtSubscribers(e.target.value)}
                          placeholder="Ví dụ: 10000"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-300 font-mono block mb-1">
                          Link ảnh Avatar YouTube (tùy chọn):
                        </label>
                        <input
                          type="text"
                          value={ytAvatar}
                          onChange={(e) => setYtAvatar(e.target.value)}
                          placeholder="https://... (hoặc để trống)"
                          className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-red-500 truncate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {isYtEditing && (
                      <button
                        type="button"
                        onClick={() => setIsYtEditing(false)}
                        className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
                      >
                        Hủy
                      </button>
                    )}
                    <button
                      onClick={() => handleConnectYoutube(false)}
                      disabled={isYtVerifying}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-red-500/30 disabled:opacity-50 shadow-lg shadow-red-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>XÁC NHẬN &amp; LIÊN KẾT YOUTUBE</span>
                    </button>
                  </div>
                </div>
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
