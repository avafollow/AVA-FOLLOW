import React, { useState, useEffect, useMemo } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { GrowthServiceItem } from '../../types';
import { 
  SEPAY_BANK_CONFIG, 
  generateSepayQrUrl, 
  generateVietQrUrl 
} from '../../services/sepayService';
import { 
  X, 
  Check, 
  Copy, 
  AlertTriangle, 
  Clock, 
  QrCode,
  Sparkles,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Link2
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
  const { user, purchaseServicePackage, showToast } = useTikTokApp();
  const [targetUrl, setTargetUrl] = useState(user.tiktokConnected ? `https://www.tiktok.com/${user.tiktokConnected}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState('');
  const [qrLoaded, setQrLoaded] = useState(false);

  // Livestream duration selection (1p, 3p, 10p, 30p, 90p)
  const [selectedDuration, setSelectedDuration] = useState<number>(3);

  useEffect(() => {
    if (packageItem && isOpen) {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setOrderCode(`AVAPKG${randomSuffix}`);
      setQrLoaded(false);
      setError('');

      if (packageItem.title.includes('1 Phút') || packageItem.unit.includes('1 phút')) setSelectedDuration(1);
      else if (packageItem.title.includes('10 Phút') || packageItem.unit.includes('10 phút')) setSelectedDuration(10);
      else if (packageItem.title.includes('30 Phút') || packageItem.unit.includes('30 phút')) setSelectedDuration(30);
      else if (packageItem.title.includes('90 Phút') || packageItem.unit.includes('90p')) setSelectedDuration(90);
      else setSelectedDuration(3);
    }
  }, [packageItem, isOpen]);

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
    effectivePriceNum = Math.max(35000, effectivePriceNum);
  }

  const isCoinsEnough = user.avaliveCoins >= effectivePriceNum;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validateTargetUrl = (): boolean => {
    if (!targetUrl.trim()) {
      setError('Vui lòng nhập link kênh TikTok hoặc link video cần chạy');
      return false;
    }
    if (!targetUrl.includes('tiktok.com') && !targetUrl.startsWith('@')) {
      setError('Link không hợp lệ. Vui lòng nhập link TikTok (VD: https://www.tiktok.com/@kenh hoặc @kenh)');
      return false;
    }
    setError('');
    return true;
  };

  // Xác nhận đã thanh toán chuyển khoản SePay VietQR -> Kích hoạt đơn
  const handleConfirmSepayPayment = () => {
    if (!validateTargetUrl()) return;

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

      purchaseServicePackage(packageToOrder, targetUrl.trim(), undefined, 'sepay');
      setIsSubmitting(false);
      showToast(`🎉 Kích hoạt thành công gói "${packageToOrder.title}"! Đang điều phối nhiệm vụ vào mạng lưới.`);
      onClose();
    }, 600);
  };

  // Thanh toán bằng số dư Ví Xu (nếu có đủ Xu)
  const handlePayWithCoins = () => {
    if (!validateTargetUrl()) return;
    if (!isCoinsEnough) {
      setError('Số dư Xu không đủ. Vui lòng chuyển khoản ngân hàng qua mã QR bên dưới.');
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

      purchaseServicePackage(packageToOrder, targetUrl.trim(), undefined, 'coins');
      setIsSubmitting(false);
      showToast(`🎉 Mua gói thành công bằng ${effectivePriceNum.toLocaleString()} Xu!`);
      onClose();
    }, 600);
  };

  const sepayQrUrl = generateSepayQrUrl({
    amount: effectivePriceNum,
    orderCode: orderCode || 'AVAPKG'
  });

  const fallbackVietQrUrl = generateVietQrUrl({
    amount: effectivePriceNum,
    orderCode: orderCode || 'AVAPKG'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D111E] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Tối Giản, Sang Trọng */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-[#0D111E] to-[#0D111E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-display">Thanh Toán Gói Dịch Vụ</h3>
              <p className="text-xs text-slate-400">Quét mã SePay VietQR kích hoạt tự động 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* THÔNG TIN GÓI DỊCH VỤ */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {packageItem.badge || packageItem.tag || 'GÓI TĂNG TRƯỞNG'}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">
                  {isLivestream 
                    ? `${packageItem.title.replace(/\(.*?\)/g, '').trim()} (${selectedDuration} Phút)` 
                    : packageItem.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Số lượng: <strong className="text-white font-mono">{packageItem.targetQuantity.toLocaleString()} {isLivestream ? `Mắt xem (${selectedDuration} phút)` : packageItem.unit}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-mono">Giá thanh toán</span>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {effectivePriceNum.toLocaleString()}đ
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Kích hoạt tức thì</span>
                </div>
              </div>
            </div>

            {/* Nếu là Livestream: Chọn mốc thời gian */}
            {isLivestream && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mốc thời gian xem Live:</span>
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { mins: 1, label: '1P' },
                    { mins: 3, label: '3P' },
                    { mins: 10, label: '10P' },
                    { mins: 30, label: '30P' },
                    { mins: 90, label: '90P' },
                  ].map(tier => (
                    <button
                      key={tier.mins}
                      type="button"
                      onClick={() => setSelectedDuration(tier.mins)}
                      className={`py-1.5 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                        selectedDuration === tier.mins
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ô NHẬP LINK TIKTOK */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-purple-400" />
              Link Kênh TikTok Hoặc Link Video Cần Chạy <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: https://www.tiktok.com/@tentaikhoan hoặc @tentaikhoan..."
              value={targetUrl}
              onChange={(e) => {
                setTargetUrl(e.target.value);
                if (error) setError('');
              }}
              required
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* KHỐI THANH TOÁN SEPAY VIETQR */}
          <div className="p-4 bg-gradient-to-b from-[#111628] to-[#0A0D18] rounded-2xl border border-indigo-500/30 space-y-3.5 shadow-lg">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
                  Mã QR SePay VietQR (Techcombank)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tự động nhận diện
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* QR Image */}
              <div className="relative shrink-0 p-2.5 bg-white rounded-2xl shadow-xl flex flex-col items-center">
                <img
                  src={sepayQrUrl}
                  alt="SePay VietQR Techcombank"
                  className="w-36 h-36 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to VietQR
                    (e.target as HTMLImageElement).src = fallbackVietQrUrl;
                  }}
                  onLoad={() => setQrLoaded(true)}
                />
                <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-slate-700 font-mono">
                  <span>Quét bằng mọi App Ngân Hàng</span>
                </div>
              </div>

              {/* Chi tiết tài khoản Techcombank & Nội dung chuyển khoản */}
              <div className="flex-1 w-full space-y-2 text-xs">
                
                {/* Ngân hàng */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-[11px]">Ngân hàng:</span>
                  <span className="font-bold text-white font-mono">Techcombank (TCB)</span>
                </div>

                {/* Số tài khoản */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-[11px]">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {SEPAY_BANK_CONFIG.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(SEPAY_BANK_CONFIG.accountNumber, 'acc')}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Chủ tài khoản */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-[11px]">Chủ tài khoản:</span>
                  <span className="font-bold text-white font-mono uppercase">
                    {SEPAY_BANK_CONFIG.accountName}
                  </span>
                </div>

                {/* Số tiền */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-[11px]">Số tiền:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {effectivePriceNum.toLocaleString()} VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(effectivePriceNum.toString(), 'amount')}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                      title="Sao chép số tiền"
                    >
                      {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Nội dung CK */}
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-[11px] font-bold">Nội dung CK (Bắt buộc):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-rose-400 text-sm tracking-wider">
                        {orderCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(orderCode, 'code')}
                        className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        {copiedField === 'code' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                        <span>Chép mã</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    * Vui lòng điền đúng nội dung để SePay nhận diện và kích hoạt ngay.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            
            {/* Nút Kích Hoạt SePay */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmSepayPayment}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase font-mono tracking-wider shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{isSubmitting ? 'Đang xác thực giao dịch...' : 'Tôi Đã Chuyển Khoản Xong (Kích Hoạt Gói)'}</span>
            </button>

            {/* Nút phụ: Dùng Ví Xu nếu tài khoản có đủ */}
            {isCoinsEnough && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePayWithCoins}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Hoặc Trừ Bằng Số Dư Ví Xu ({effectivePriceNum.toLocaleString()} Xu)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer"
            >
              Đóng lại
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
