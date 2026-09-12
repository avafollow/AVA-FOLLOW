import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Radio, 
  Video, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { MARQUEE_BOOST_FEE_XU } from '../../data/marqueeData';

export const MarqueeBoostModal: React.FC = () => {
  const { 
    isMarqueeBoostModalOpen, 
    closeMarqueeBoostModal, 
    user, 
    campaigns, 
    livestreamTasks, 
    boostToMarquee, 
    openDeposit,
    showToast 
  } = useTikTokApp();

  const [boostType, setBoostType] = useState<'livestream' | 'campaign' | 'custom'>('livestream');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('🔥 PHIÊN LIVE SIÊU GIẢM GIÁ TIKTOK SHOP - ĐẨY 500 MẮT XEM');
  const [customUrl, setCustomUrl] = useState<string>('https://tiktok.com/@' + (user.tiktokConnected || user.handle) + '/live');
  const [customHandle, setCustomHandle] = useState<string>('@' + (user.tiktokConnected || user.handle));
  const [targetQty, setTargetQty] = useState<number>(500);

  if (!isMarqueeBoostModalOpen) return null;

  const hasEnoughCoins = (user.avaliveCoins || 0) >= MARQUEE_BOOST_FEE_XU;

  const handleConfirmBoost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasEnoughCoins) {
      showToast(`❌ Bạn cần ${MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu để mua Bảng Điện LED. Vui lòng nạp thêm Xu!`);
      openDeposit();
      return;
    }

    if (boostType === 'custom') {
      if (!customTitle.trim() || !customUrl.trim()) {
        showToast('Vui lòng điền đầy đủ tiêu đề và liên kết!');
        return;
      }
      const success = boostToMarquee(`custom_${Date.now()}`, 'custom', {
        title: customTitle,
        handle: customHandle || '@' + user.handle,
        url: customUrl,
        targetQuantity: targetQty,
        rewardText: '👁️ +1,200 Xu/phút | ❤️ +200 Xu | 💬 +300 Xu'
      });
      if (success) closeMarqueeBoostModal();
    } else if (boostType === 'livestream') {
      const targetId = selectedTargetId || livestreamTasks[0]?.id || 'live_default';
      const success = boostToMarquee(targetId, 'livestream');
      if (success) closeMarqueeBoostModal();
    } else {
      const targetId = selectedTargetId || campaigns[0]?.id || 'camp_default';
      const success = boostToMarquee(targetId, 'campaign');
      if (success) closeMarqueeBoostModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0B0F19] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header LED Glow */}
        <div className="bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-purple-600/30 border-b border-white/10 p-5 sm:p-6 relative">
          <button 
            onClick={closeMarqueeBoostModal}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Zap className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                DỊCH VỤ ĐẨY TOP ĐẦU TRANG
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                Đăng Ký Bảng Điện LED Toàn Sàn
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Đưa phiên Livestream hoặc Video của bạn lên <strong className="text-amber-300">dải bảng điện LED chạy chữ từ phải qua trái liên tục 24/7</strong> đầu trang, tiếp cận tức thì 128.000+ thành viên đang online!
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleConfirmBoost} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Fee & Wallet Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Mức Phí Niêm Yết Sàn</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
                <Coins className="w-6 h-6 text-amber-400" />
                <span>{MARQUEE_BOOST_FEE_XU.toLocaleString()} Xu</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-mono font-bold">Số Dư Hiện Tại</div>
              <div className={`text-base sm:text-lg font-black font-mono ${hasEnoughCoins ? 'text-emerald-400' : 'text-rose-400'}`}>
                {(user.avaliveCoins || 0).toLocaleString()} Xu
              </div>
              {!hasEnoughCoins && (
                <button
                  type="button"
                  onClick={openDeposit}
                  className="text-[10px] text-cyan-400 underline font-bold mt-0.5 block"
                >
                  Nạp thêm Xu ngay +
                </button>
              )}
            </div>
          </div>

          {/* Select Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              1. Chọn Loại Nội Dung Muốn Đẩy Lên Bảng Điện
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBoostType('livestream')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  boostType === 'livestream'
                    ? 'border-rose-500 bg-rose-950/30 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-rose-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Livestream</span>
                </div>
                <div className="text-[10px] text-slate-400">Đẩy phòng Live đang phát sóng</div>
              </button>

              <button
                type="button"
                onClick={() => setBoostType('campaign')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  boostType === 'campaign'
                    ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-indigo-400">
                  <Video className="w-4 h-4" />
                  <span>Chiến Dịch</span>
                </div>
                <div className="text-[10px] text-slate-400">Đẩy video / nhiệm vụ hot</div>
              </button>

              <button
                type="button"
                onClick={() => setBoostType('custom')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  boostType === 'custom'
                    ? 'border-amber-500 bg-amber-950/30 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-xs text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Tùy Chỉnh</span>
                </div>
                <div className="text-[10px] text-slate-400">Nhập link TikTok trực tiếp</div>
              </button>
            </div>
          </div>

          {/* Form fields based on selection */}
          {boostType === 'custom' ? (
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tiêu Đề Dòng Chữ Chạy Bảng Điện:
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="Ví dụ: 🔥 ĐẠI TIỆC XẢ KHO 99K TIKTOK SHOP - BÃO MẮT XEM CỘNG ĐỒNG"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    TikTok Handle / ID Kênh:
                  </label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={e => setCustomHandle(e.target.value)}
                    placeholder="@kenh_cua_ban"
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Mục Tiêu Mắt Xem / Tương Tác:
                  </label>
                  <input
                    type="number"
                    value={targetQty}
                    onChange={e => setTargetQty(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Đường Dẫn Live / Video TikTok:
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                  placeholder="https://tiktok.com/@kenh/live"
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          ) : boostType === 'livestream' ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Chọn Phiên Live Trong Danh Sách Đang Chạy:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {livestreamTasks.slice(0, 5).map(live => (
                  <div
                    key={live.id}
                    onClick={() => setSelectedTargetId(live.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedTargetId === live.id || (!selectedTargetId && live === livestreamTasks[0])
                        ? 'border-rose-500 bg-rose-950/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span className="font-bold text-xs text-white truncate">{live.roomTitle}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {live.channelHandle} • Thưởng {live.rewardPerMinute} Xu/phút
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                        Đang Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Chọn Chiến Dịch Của Bạn Đang Phân Phối:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {campaigns.slice(0, 5).map(camp => (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedTargetId(camp.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedTargetId === camp.id || (!selectedTargetId && camp === campaigns[0])
                        ? 'border-indigo-500 bg-indigo-950/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">{camp.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {camp.channelHandle} • Mục tiêu: {camp.targetQuantity.toLocaleString()} lượt
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                        Đang chạy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Information Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5 text-[11px] text-amber-200/90 font-sans">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Chính Sách Hoạt Động Bảng Điện LED:
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-300 text-[10px]">
              <li>Bảng điện chạy từ <strong className="text-white">phải qua trái</strong> liên tục trên thanh thông báo toàn sàn.</li>
              <li>Chiến dịch/Live của bạn được xếp vào <strong className="text-white">TOP 1 ưu tiên</strong> hiển thị.</li>
              <li>Bảng điện hoạt động <strong className="text-white">cho đến khi hết phiên live</strong> (hoặc kết thúc chiến dịch).</li>
              <li>Khi kết thúc, phiên sẽ <strong className="text-white">tự động ẩn đi</strong> và lưu trữ vào mục Lịch Sử.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeMarqueeBoostModal}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={!hasEnoughCoins}
              className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                hasEnoughCoins 
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white shadow-amber-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>KÍCH HOẠT (-100.000 XU)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
