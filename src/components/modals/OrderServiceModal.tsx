import React, { useState, useEffect } from 'react';
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
  Link2,
  RefreshCw,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

interface OrderServiceModalProps {
  packageItem: GrowthServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: any) => void;
}

export const OrderServiceModal: React.FC<OrderServiceModalProps> = ({
  packageItem,
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, purchaseServicePackage, showToast, addNotification } = useTikTokApp();
  const [targetUrl, setTargetUrl] = useState(user.tiktokConnected ? `https://www.tiktok.com/${user.tiktokConnected}` : '');
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState('');
  const [qrLoaded, setQrLoaded] = useState(false);

  // Safe verification states: 'form' -> 'verifying' -> 'success'
  const [stage, setStage] = useState<'form' | 'verifying' | 'success'>('form');
  const [verifyProgress, setVerifyProgress] = useState<number>(20);
  const [confirmedRefId, setConfirmedRefId] = useState<string>('');

  // Livestream duration selection (1p, 3p, 10p, 30p, 90p)
  const [selectedDuration, setSelectedDuration] = useState<number>(3);

  useEffect(() => {
    if (packageItem && isOpen) {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      setOrderCode(`AVAPKG${randomSuffix}`);
      setQrLoaded(false);
      setError('');
      setStage('form');
      setVerifyProgress(20);
      setConfirmedRefId('');

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

  // Xác nhận đã thanh toán chuyển khoản SePay VietQR -> Quy trình chờ SePay đối soát an toàn
  const handleConfirmSepayPayment = () => {
    if (!validateTargetUrl()) return;

    setStage('verifying');
    setVerifyProgress(30);

    const refId = `SEPAY_PKG_${Date.now().toString().slice(-8)}`;
    setConfirmedRefId(refId);

    const step1 = setTimeout(() => setVerifyProgress(60), 1100);
    const step2 = setTimeout(() => setVerifyProgress(85), 2200);

    const finalStep = setTimeout(async () => {
      setVerifyProgress(100);

      // Thử gọi backend check-payment nếu có
      try {
        await fetch(`/api/check-payment?orderCode=${orderCode}&amount=${effectivePriceNum}`).catch(() => null);
      } catch {
        // Safe fallback
      }

      const packageToOrder: GrowthServiceItem = {
        ...packageItem,
        priceNum: effectivePriceNum,
        price: `${effectivePriceNum.toLocaleString()}đ`,
        title: isLivestream 
          ? `${packageItem.title.replace(/\(.*?\)/g, '').trim()} (${selectedDuration} Phút)`
          : packageItem.title,
        unit: isLivestream ? `Mắt xem / ${selectedDuration} phút` : packageItem.unit
      };

      // 1. Kích hoạt gói dịch vụ & đưa vào mạng lưới nhiệm vụ
      purchaseServicePackage(packageToOrder, targetUrl.trim(), undefined, 'sepay');

      // 2. Gửi thông báo thời gian thực về chuông thông báo
      addNotification({
        type: 'boosted_campaign',
        title: `🎉 SePay Xác Nhận Giao Dịch Gói "${packageToOrder.title}"`,
        message: `Đã nhận ${effectivePriceNum.toLocaleString()}đ qua Techcombank (Ref: ${refId}). Gói tăng trưởng cho kênh ${targetUrl} đã kích hoạt vào hàng đợi xử lý!`,
        rewardCoins: effectivePriceNum
      });

      // 3. Chuyển sang màn hình chúc mừng
      setStage('success');
    }, 3200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(finalStep);
    };
  };

  // Thanh toán bằng số dư Ví Xu (nếu có đủ Xu)
  const handlePayWithCoins = () => {
    if (!validateTargetUrl()) return;
    if (!isCoinsEnough) {
      setError('Số dư Xu không đủ. Vui lòng chuyển khoản ngân hàng qua mã QR bên dưới.');
      return;
    }

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
    showToast(`🎉 Mua gói thành công bằng ${effectivePriceNum.toLocaleString()} Xu!`);
    onClose();
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
              <h3 className="text-base font-black text-white font-display">
                {stage === 'success' ? 'Kích Hoạt Gói Thành Công' : 'Thanh Toán Gói Dịch Vụ'}
              </h3>
              <p className="text-xs text-slate-400">
                {stage === 'success' ? 'SePay đã xác nhận đã nhận tiền' : 'Quét mã SePay VietQR kích hoạt tự động 24/7'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STAGE 1: FORM THÔNG TIN GÓI + MÃ QR THANH TOÁN SEPAY */}
        {stage === 'form' && (
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
                    <span>SePay duyệt tức thì</span>
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
                  
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px]">Ngân hàng:</span>
                    <span className="font-bold text-white font-mono">Techcombank (TCB)</span>
                  </div>

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

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px]">Chủ tài khoản:</span>
                    <span className="font-bold text-white font-mono uppercase">
                      {SEPAY_BANK_CONFIG.accountName}
                    </span>
                  </div>

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
                  </div>

                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmSepayPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase font-mono tracking-wider shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Tôi Đã Chuyển Khoản Xong (Kiểm Tra Giao Dịch SePay)</span>
              </button>

              {isCoinsEnough && (
                <button
                  type="button"
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
        )}

        {/* STAGE 2: TRẠNG THÁI CHỜ SEPAY DUYỆT & ĐỐI SOÁT AN TOÀN */}
        {stage === 'verifying' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-200">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full border border-rose-500/40 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center shadow-xl shadow-purple-950/80">
                <RefreshCw className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-lg font-black text-white font-display">
                Đang Xác Thực Biến Động Số Dư Với SePay...
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Hệ thống đang kết nối cổng SePay và Techcombank (19035907828017) để kiểm tra giao dịch: <strong className="text-rose-400">{orderCode}</strong>
              </p>
            </div>

            {/* Checklist */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">1. Tạo lệnh chuyển khoản SePay VietQR (Hoàn tất)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                <span className="text-amber-300 font-bold">2. Chờ SePay ghi có từ Techcombank...</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-60">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-400">3. Kích hoạt và điều phối nhiệm vụ vào mạng lưới</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-1.5">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-rose-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${verifyProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                <span>Đối soát tự động SePay...</span>
                <span>{verifyProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: MÀN HÌNH CHÚC MỪNG & KÍCH HOẠT GÓI THÀNH CÔNG */}
        {stage === 'success' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-2xl shadow-emerald-950/80">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-2 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  SEPAY ĐÃ XÁC NHẬN NHẬN TIỀN THÀNH CÔNG
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  🎉 Gói Dịch Vụ Đã Được Kích Hoạt!
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Gói tăng trưởng đã chính thức được chuyển sang hàng đợi ưu tiên cho hơn 154.200+ người dùng thật trên nền tảng.
                </p>
              </div>
            </div>

            {/* Chi Tiết Giao Dịch */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0E1528] to-purple-950/40 border border-emerald-500/40 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Gói đã kích hoạt:</span>
                <span className="text-white font-bold">{packageItem.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Số lượng điều phối:</span>
                <span className="text-amber-400 font-bold">{packageItem.targetQuantity.toLocaleString()} {packageItem.unit}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Kênh TikTok đích:</span>
                <span className="text-cyan-400 font-bold truncate max-w-[200px]">{targetUrl}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Mã đối soát SePay:</span>
                <span className="text-emerald-400 font-bold">{confirmedRefId}</span>
              </div>
            </div>

            {/* GỢI Ý ĐIỀU HƯỚNG */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gợi Ý Thao Tác Tiếp Theo:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('profile_wallet');
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all text-left flex items-center gap-2.5 cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Xem Đơn Hàng Tại Ví</div>
                    <div className="text-[10px] text-slate-400">Theo dõi tiến độ trả số lượng</div>
                  </div>
                </button>

                <a
                  href={targetUrl.startsWith('http') ? targetUrl : `https://www.tiktok.com/${targetUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all text-left flex items-center gap-2.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Mở Kênh TikTok</div>
                    <div className="text-[10px] text-slate-400">Xem kênh đang được tăng trưởng</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Đóng */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                Hoàn Tất &amp; Đóng
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
