import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Facebook, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Coins, 
  Users, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const ShareVideoModal: React.FC = () => {
  const { isShareModalOpen, shareVideoData, closeShareModal, showToast, affiliateData } = useTikTokApp();
  const [copiedLink, setCopiedLink] = useState<'video' | 'affiliate' | null>(null);

  if (!isShareModalOpen || !shareVideoData) return null;

  const videoUrl = shareVideoData.targetUrl || 'https://www.tiktok.com/@creator/video/example';
  const videoTitle = shareVideoData.title || 'Video chiến dịch TikTok';
  const affiliateRefLink = affiliateData?.refLink || `https://tiktokfollow.vn/ref/${affiliateData?.refCode || 'KOC888'}`;

  const copyToClipboard = (text: string, type: 'video' | 'affiliate') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    showToast(type === 'video' ? '✓ Đã copy link video chiến dịch!' : '✓ Đã copy link tiếp thị liên kết (+5.000 Xu/người)!');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleShareFacebook = (url: string) => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbShareUrl, '_blank', 'width=620,height=550');
    showToast('🚀 Đang mở cửa sổ đăng bài chia sẻ lên Facebook!');
  };

  const handleShareMessenger = (url: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(`fb-messenger://share?link=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(url)}`, '_blank', 'width=620,height=550');
    }
    showToast('💬 Đang mở Messenger gửi tin nhắn cho bạn bè!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/30">
        {/* Header decoration */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-400" />
        
        {/* Close Button */}
        <button 
          onClick={closeShareModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">CHIA SẺ CHIẾN DỊCH</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  1-CHẠM FB
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Đẩy lượt xem tự nhiên qua Facebook & Messenger bạn bè
              </p>
            </div>
          </div>

          {/* Section 1: Video Link being shared */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Video className="w-4 h-4 text-pink-400" />
                <span>LINK VIDEO / CHIẾN DỊCH NHIỆM VỤ</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Đang kích hoạt
              </span>
            </div>
            
            <p className="text-sm font-semibold text-white truncate mb-2">{videoTitle}</p>
            
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-zinc-400">
              <span className="truncate flex-1 text-cyan-300">{videoUrl}</span>
              <button
                onClick={() => copyToClipboard(videoUrl, 'video')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-bold transition-colors shrink-0"
              >
                {copiedLink === 'video' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Share to FB & Messenger buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <button
                onClick={() => handleShareFacebook(videoUrl)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-black tracking-wide shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>ĐĂNG FACEBOOK</span>
              </button>

              <button
                onClick={() => handleShareMessenger(videoUrl)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:opacity-95 text-white text-xs font-black tracking-wide shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>GỬI MESSENGER</span>
              </button>
            </div>
          </div>

          {/* Section 2: Distinction - Affiliate Link */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-pink-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Users className="w-4 h-4 text-amber-400" />
                <span>LINK TIẾP THỊ LIÊN KẾT (MỜI BẠN BÈ)</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Coins className="w-3 h-3" />
                <span>+5.000 XU/TÀI KHOẢN</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mb-2.5 leading-relaxed">
              Phân biệt: Link này để tuyển người làm nhiệm vụ nhận <strong className="text-amber-300">+5.000 Xu</strong> ngay và hưởng <strong className="text-pink-400">20% - 35% hoa hồng</strong> đại lý ghi nhận vào ví.
            </p>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
              <span className="truncate flex-1 text-amber-300">{affiliateRefLink}</span>
              <button
                onClick={() => copyToClipboard(affiliateRefLink, 'affiliate')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-sans text-xs font-bold transition-colors shrink-0"
              >
                {copiedLink === 'affiliate' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Đã copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Ref</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleShareFacebook(affiliateRefLink)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                <span>Share Ref lên FB</span>
              </button>

              <button
                onClick={() => handleShareMessenger(affiliateRefLink)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Gửi Ref Messenger</span>
              </button>
            </div>
          </div>

          {/* Anti-Spam guarantee note */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Thuật toán giãn cách 3s - 5s tự nhiên. An toàn 100% tài khoản TikTok & Facebook.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
