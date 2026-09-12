import React, { useState, useEffect } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { GrowthServiceItem } from '../../types';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  Video,
  Layers,
  Link2,
  Clock,
  Radio
} from 'lucide-react';

interface OrderServiceModalProps {
  packageItem: GrowthServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderServiceModal: React.FC<OrderServiceModalProps> = ({
  packageItem,
  isOpen,
  onClose
}) => {
  const { user, purchaseServicePackage, openDeposit } = useTikTokApp();
  const [targetUrl, setTargetUrl] = useState(user.tiktokConnected ? `https://www.tiktok.com/${user.tiktokConnected}` : '');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Livestream duration selection state (1 phút, 3 phút, 10 phút, 30 phút, 90 phút)
  const [selectedDuration, setSelectedDuration] = useState<number>(3);

  useEffect(() => {
    if (packageItem) {
      if (packageItem.title.includes('1 Phút') || packageItem.unit.includes('1 phút')) setSelectedDuration(1);
      else if (packageItem.title.includes('10 Phút') || packageItem.unit.includes('10 phút')) setSelectedDuration(10);
      else if (packageItem.title.includes('30 Phút') || packageItem.unit.includes('30 phút')) setSelectedDuration(30);
      else if (packageItem.title.includes('90 Phút') || packageItem.unit.includes('90p')) setSelectedDuration(90);
      else setSelectedDuration(3);
    }
  }, [packageItem]);

  if (!isOpen || !packageItem) return null;

  const isLivestream = packageItem.category === 'livestream';

  // Dynamic price calculation if livestream
  let effectivePriceNum = packageItem.priceNum;
  if (isLivestream) {
    if (selectedDuration === 1) effectivePriceNum = Math.round(packageItem.targetQuantity * 350);
    else if (selectedDuration === 3) effectivePriceNum = Math.round(packageItem.targetQuantity * 500);
    else if (selectedDuration === 10) effectivePriceNum = Math.round(packageItem.targetQuantity * 900);
    else if (selectedDuration === 30) effectivePriceNum = Math.round(packageItem.targetQuantity * 1500);
    else if (selectedDuration === 90) effectivePriceNum = Math.round(packageItem.targetQuantity * 2500);
    // Ensure not 0
    effectivePriceNum = Math.max(35000, effectivePriceNum);
  }

  const isCoinsEnough = user.avaliveCoins >= effectivePriceNum;
  const workerRewardPool = Math.round(effectivePriceNum * 0.4); // 40% quỹ thợ làm nhiệm vụ
  const systemShare = effectivePriceNum - workerRewardPool; // 60% affiliate, hệ thống & sàn

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!targetUrl.trim()) {
      setError('Vui lòng nhập link kênh TikTok hoặc link video cần chạy');
      return;
    }

    if (!targetUrl.includes('tiktok.com') && !targetUrl.startsWith('@')) {
      setError('Đường link không hợp lệ. Vui lòng nhập link TikTok (VD: https://www.tiktok.com/@kenh hoặc @kenh)');
      return;
    }

    if (!isCoinsEnough) {
      setError('Số dư Xu trong ví không đủ. Vui lòng nạp thêm Xu để thanh toán gói!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const packageToOrder: GrowthServiceItem = {
        ...packageItem,
        priceNum: effectivePriceNum,
        price: `${effectivePriceNum.toLocaleString()}đ`,
        title: isLivestream 
          ? `${packageItem.title.replace(/\(.*?\)/g, '').trim()} (${selectedDuration} Phút)`
          : packageItem.title,
        unit: isLivestream ? `Mắt xem / ${selectedDuration} phút` : packageItem.unit
      };
      purchaseServicePackage(packageToOrder, targetUrl.trim(), instructions.trim());
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kích Hoạt Gói Tăng Trưởng Bằng Xu</h3>
              <p className="text-xs text-slate-400">Tự động điều phối sang hàng đợi cộng đồng người dùng thật</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Package Summary Card */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {packageItem.badge || packageItem.tag}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {isLivestream ? `${packageItem.title.replace(/\(.*?\)/g, '').trim()} (${selectedDuration} Phút)` : packageItem.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Số lượng: <strong className="text-white font-mono">{packageItem.targetQuantity.toLocaleString()} {isLivestream ? `Mắt xem (${selectedDuration} phút)` : packageItem.unit}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Giá thanh toán</span>
                <div className="text-base font-black text-amber-400 font-mono">{effectivePriceNum.toLocaleString()} Xu</div>
                <div className="text-[11px] text-slate-400 font-mono">≈ {effectivePriceNum.toLocaleString()}đ</div>
              </div>
            </div>

            {/* If Livestream: Select Target Minutes */}
            {isLivestream && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Chọn Mốc Thời Gian Cam Kết Xem Live Của Mỗi Người:</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono font-bold">
                    Trừ Xu theo mốc
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { mins: 1, label: '1 Phút', desc: 'Hook 60s đầu' },
                    { mins: 3, label: '3 Phút', desc: 'Kéo đề xuất FYP' },
                    { mins: 10, label: '10 Phút', desc: 'Chốt deal giỏ hàng' },
                    { mins: 30, label: '30 Phút', desc: 'Đại tiệc Flash Sale' },
                    { mins: 90, label: '90 Phút', desc: 'Trọn vẹn ca live' },
                  ].map(tier => (
                    <button
                      key={tier.mins}
                      type="button"
                      onClick={() => setSelectedDuration(tier.mins)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedDuration === tier.mins
                          ? 'bg-rose-600/30 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{tier.label}</div>
                      <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{tier.desc}</div>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  💡 Người dùng làm nhiệm vụ bắt buộc phải xem đủ <strong>{selectedDuration} phút</strong> thì hệ thống mới xác thực và cộng Xu. Nếu thoát sớm trước {selectedDuration} phút, sàn tự động điều phối mắt xem khác bù vào ngay.
                </p>
              </div>
            )}



            {/* Balance Check */}
            <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Số dư Ví Xu hiện tại của bạn:</span>
              <span className={`font-bold ${isCoinsEnough ? 'text-emerald-400' : 'text-rose-400'}`}>
                {user.avaliveCoins.toLocaleString()} Xu
              </span>
            </div>

            {!isCoinsEnough && (
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-rose-300">
                  Thiếu: {(effectivePriceNum - user.avaliveCoins).toLocaleString()} Xu
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openDeposit();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer"
                >
                  + Nạp Xu Ngay (VietQR)
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Input Target URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-purple-400" />
                Link Kênh TikTok Hoặc Link Video Cần Chạy <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="https://www.tiktok.com/@tentaikhoan hoặc link video..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Gợi ý: Nếu chạy follow hãy dán link kênh (@handle). Nếu chạy tim / comment / share hãy dán link video cụ thể.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Ghi Chú Hoặc Kịch Bản Seeding Đặc Biệt (Tùy chọn)
              </label>
              <textarea
                rows={2}
                placeholder="VD: Nhờ các bạn comment hỏi giá áo thun nam, hỏi ship Hà Nội bao lâu tới nhé..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* How fulfillment works */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1.5 text-xs text-blue-200">
            <div className="font-bold flex items-center gap-1.5 text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Quy trình trả gói minh bạch tự động:
            </div>
            <p className="text-[11px] text-blue-200/90 leading-relaxed">
              Ngay sau khi bạn thanh toán, hệ thống sẽ tự động chuyển đổi gói của bạn thành các nhiệm vụ mở cho hơn <strong>154,200+ người dùng</strong> đang lướt video trên ứng dụng. Tiến độ tăng trưởng được đối soát và cập nhật thời gian thực vào mục Hồ sơ & Đơn hàng của bạn.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isCoinsEnough}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang điều phối nhiệm vụ...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Xác Nhận Mua Gói & Kích Hoạt Ngay</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
