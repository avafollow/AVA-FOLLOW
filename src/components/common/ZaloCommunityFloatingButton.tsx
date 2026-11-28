import React, { useState } from 'react';
import { Sparkles, MessageCircle, X, Check, Copy, ExternalLink, Users, Coins, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const ZaloCommunityFloatingButton: React.FC = () => {
  const {
    openAuthModal,
    showToast,
    isAuthenticated,
    openLuckyWheel,
    isAuthModalOpen,
    isConnectOpen,
    isFeedRunnerOpen,
    isRunnerOpen,
    isLiveRunnerOpen
  } = useTikTokApp();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Ẩn nút Zalo nổi khi đang mở bảng Đăng nhập / Kết nối / Xem Video để không bao giờ che giao diện trên điện thoại
  if (isAuthModalOpen || isConnectOpen || isFeedRunnerOpen || isRunnerOpen || isLiveRunnerOpen) {
    return null;
  }

  const zaloGroupLink = 'https://zalo.me/g/avafull_growth_os_2026';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(zaloGroupLink).then(() => {
      setIsCopied(true);
      showToast('✓ Đã sao chép link nhóm Zalo! Gửi cho bạn bè để cùng nhận 5.000 Xu!');
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const handleOpenZalo = () => {
    window.open(zaloGroupLink, '_blank', 'noopener,noreferrer');
    showToast('🚀 Đang mở nhóm Zalo Cộng Đồng Creator AVA FOLLOW...');
  };

  return (
    <>
      {/* Floating Button at Bottom Right — Gọn gàng trên Mobile, không che nút chính */}
      <div className="fixed bottom-[76px] md:bottom-6 right-2.5 sm:right-6 z-30 flex items-center gap-2 pointer-events-auto">
        
        {/* Zalo Icon Button with Official Styling */}
        <button
          onClick={() => setIsOpenModal(true)}
          className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#0068FF] hover:bg-[#0055d4] p-0.5 shadow-[0_0_20px_rgba(0,104,255,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          title="Kết nối cộng đồng qua Zalo - Nhận 5.000 Xu"
        >
          {/* Official Zalo Icon Graphics */}
          <div className="w-full h-full rounded-[14px] bg-[#0068FF] flex flex-col items-center justify-center text-white relative overflow-hidden">
            <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7 fill-current">
              <path d="M24 4C12.95 4 4 12.06 4 22c0 5.48 2.76 10.38 7.15 13.73-.31 3.51-1.77 7.02-3.86 9.47 4.95-.54 9.43-2.61 12.44-5.22 1.4.34 2.86.52 4.27.52 11.05 0 20-8.06 20-18S35.05 4 24 4z" fill="#FFFFFF"/>
              <path d="M14 26.5h4.2l-4.2-7.5V17h6.5v2.5h-4.2l4.2 7.5V29H14v-2.5zm10.5-9.5c-2.8 0-4.5 2-4.5 4.5s1.7 4.5 4.5 4.5c2.8 0 4.5-2 4.5-4.5s-1.7-4.5-4.5-4.5zm0 6.5c-1.2 0-2-1-2-2s.8-2 2-2 2 1 2 2-.8 2-2 2zm7.5-6.5h2.5v9.5H32V17z" fill="#0068FF"/>
            </svg>
            <span className="text-[8px] sm:text-[9px] font-black tracking-tighter text-white font-mono uppercase mt-[-2px]">
              ZALO
            </span>
          </div>

          {/* Top Badge: 5.000 Xu */}
          <span className="hidden sm:inline-block absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[9px] font-mono font-black border border-white/50 shadow-md">
            +5K
          </span>
        </button>
      </div>

      {/* Modal: Kết Nối Cộng Đồng Zalo & Nhận 5.000 Xu */}
      {isOpenModal && (
        <div
          onClick={() => setIsOpenModal(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0c1328] via-[#090d1a] to-[#060810] border-2 border-blue-500/50 shadow-[0_0_80px_rgba(0,104,255,0.4)] p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient blue top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpenModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0068FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0 font-bold">
                <svg viewBox="0 0 48 48" className="w-8 h-8 fill-current">
                  <path d="M24 4C12.95 4 4 12.06 4 22c0 5.48 2.76 10.38 7.15 13.73-.31 3.51-1.77 7.02-3.86 9.47 4.95-.54 9.43-2.61 12.44-5.22 1.4.34 2.86.52 4.27.52 11.05 0 20-8.06 20-18S35.05 4 24 4z" fill="#FFFFFF"/>
                  <path d="M14 26.5h4.2l-4.2-7.5V17h6.5v2.5h-4.2l4.2 7.5V29H14v-2.5zm10.5-9.5c-2.8 0-4.5 2-4.5 4.5s1.7 4.5 4.5 4.5c2.8 0 4.5-2 4.5-4.5s-1.7-4.5-4.5-4.5zm0 6.5c-1.2 0-2-1-2-2s.8-2 2-2 2 1 2 2-.8 2-2 2zm7.5-6.5h2.5v9.5H32V17z" fill="#0068FF"/>
                </svg>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase border border-blue-500/30">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>CỘNG ĐỒNG CREATOR AVA FOLLOW</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display mt-0.5">
                  Gia Nhập Nhóm Zalo • Nhận 5.000 Xu
                </h3>
              </div>
            </div>

            {/* Special 5.000 Xu Incentive Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-blue-950/40 to-amber-500/20 border border-amber-400/50 space-y-1.5 text-center">
              <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>ĐẶC QUYỀN THÀNH VIÊN MỚI GIA NHẬP</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                TẶNG NGAY +5.000 XU
              </div>
              <p className="text-xs text-slate-200">
                Đổi lấy <strong>50 lượt follow người thật đầu tiên</strong> để bắt đầu xây kênh TikTok vững chắc!
              </p>
            </div>

            {/* Core Benefits */}
            <div className="space-y-2.5 text-xs text-slate-200 font-sans">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Follow chéo &amp; Đẩy view 100% người thật:</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Tương tác qua lại 2 chiều trong cộng đồng hơn 168.000+ thành viên, giúp kênh bứt phá lên tab Xu Hướng (FYP).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Kiếm tiền 24/7 từ chiếc điện thoại của bạn:</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Ai cũng có thể kiếm tiền! Chỉ cần rảnh rỗi ngồi lướt video 15s, thả tim, comment là có tiền cộng vào ví rút về ngân hàng.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Hỗ trợ admin trực tiếp 24/7 &amp; Chia sẻ kịch bản:</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Nhận tài liệu bí kíp giữ chân người xem 3 giây đầu, hỗ trợ kỹ thuật và xét duyệt KOC ưu tiên.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleOpenZalo}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0068FF] via-blue-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-blue-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
              >
                <span>THAM GIA NHÓM ZALO CHÍNH THỨC NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã copy link nhóm' : 'Copy link nhóm Zalo'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpenModal(false);
                    if (!isAuthenticated && openAuthModal) {
                      openAuthModal();
                    } else if (openLuckyWheel) {
                      openLuckyWheel();
                    }
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 border border-amber-500/30 transition-colors"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAuthenticated ? '🎁 Quay Vòng May Mắn' : 'Đăng ký nhận 5K Xu'}</span>
                </button>
              </div>
            </div>

            {/* Safe note */}
            <p className="text-[10px] text-center text-slate-500 font-mono">
              Nhóm Zalo kiểm duyệt tự động • Hoàn toàn miễn phí • Không thu bất kỳ khoản phí tham gia nào
            </p>
          </div>
        </div>
      )}
    </>
  );
};
