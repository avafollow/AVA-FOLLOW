import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  Gift, 
  Check, 
  RefreshCw, 
  Clock,
  ExternalLink,
  Flame,
  PlusCircle,
  Cpu,
  Wallet,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { 
  COIN_TOPUP_PACKAGES, 
  CoinTopupPackage, 
  SEPAY_BANK_CONFIG,
  generateSepayQrUrl,
  generateVietQrUrl 
} from '../../services/sepayService';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: string, referenceId: string) => void;
  onNavigate?: (screen: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
  onNavigate
}) => {
  const { user, addNotification, showToast, openFeedRunner } = useTikTokApp();

  const [selectedPackage, setSelectedPackage] = useState<CoinTopupPackage>(COIN_TOPUP_PACKAGES[0]);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customVnd, setCustomVnd] = useState<string>('500000');
  const [copied, setCopied] = useState<string | null>(null);
  const [qrProvider, setQrProvider] = useState<'sepay' | 'vietqr'>('sepay');

  // Quy trình xác thực an toàn tuyệt đối: 'form' -> 'verifying' -> 'success'
  const [stage, setStage] = useState<'form' | 'verifying' | 'success'>('form');
  const [checkCount, setCheckCount] = useState<number>(0);
  const [isCheckingApi, setIsCheckingApi] = useState<boolean>(false);
  const [checkErrorMsg, setCheckErrorMsg] = useState<string>('');
  const [confirmedRefId, setConfirmedRefId] = useState<string>('');

  const pollingRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setStage('form');
      setCheckCount(0);
      setIsCheckingApi(false);
      setCheckErrorMsg('');
      setConfirmedRefId('');
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(field);
    showToast(`Đã sao chép: ${text}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const parsedCustomAmount = Math.max(50000, parseInt(customVnd.replace(/\D/g, '') || '0', 10));
  const activeAmountVnd = isCustomAmount ? parsedCustomAmount : selectedPackage.amountVnd;
  const activeCoins = isCustomAmount 
    ? parsedCustomAmount + Math.round(parsedCustomAmount * 0.05)
    : selectedPackage.totalCoins;
  const bonusCoins = activeCoins - activeAmountVnd;

  const memoContent = `AVAXU${Math.round(activeAmountVnd / 1000)}K`;

  const sepayQrUrl = generateSepayQrUrl({
    amount: activeAmountVnd,
    orderCode: memoContent,
    accountNumber: SEPAY_BANK_CONFIG.accountNumber,
    bankName: SEPAY_BANK_CONFIG.bankName
  });

  const vietQrUrl = generateVietQrUrl({
    amount: activeAmountVnd,
    orderCode: memoContent,
    accountNumber: SEPAY_BANK_CONFIG.accountNumber,
    bankShortName: SEPAY_BANK_CONFIG.bankShortName,
    accountName: SEPAY_BANK_CONFIG.accountName
  });

  const activeQrUrl = qrProvider === 'sepay' ? sepayQrUrl : vietQrUrl;

  // Hàm kiểm tra giao dịch thực tế từ SePay
  const checkPaymentStatus = async (showFeedback = false) => {
    if (isCheckingApi) return;
    setIsCheckingApi(true);
    setCheckCount(prev => prev + 1);

    try {
      const res = await fetch(`/api/check-payment?orderCode=${memoContent}&amount=${activeAmountVnd}`);
      const data = await res.json();

      if (data && data.verified === true) {
        // SePay ĐÃ XÁC NHẬN NHẬN ĐƯỢC TIỀN VÀO TECHCOMBANK!
        if (pollingRef.current) clearInterval(pollingRef.current);
        const refId = data.transaction?.referenceCode || `SEPAY_TCB_${Date.now().toString().slice(-8)}`;
        setConfirmedRefId(refId);

        // 1. Mở khóa Xu vào ví
        onDepositSuccess(activeCoins, 'SePay VietQR 24/7 (Techcombank)', refId);

        // 2. Gửi thông báo vinh danh vào chuông thông báo
        addNotification({
          type: 'reward_claimed',
          title: `🎉 Nạp Thành Công +${activeCoins.toLocaleString()} Xu Qua SePay`,
          message: `Cổng SePay đã xác nhận biến động số dư Techcombank ${activeAmountVnd.toLocaleString()}đ (Mã: ${refId}). Đã mở khóa +${activeCoins.toLocaleString()} Xu vào ví an toàn!`,
          rewardCoins: activeCoins
        });

        // 3. Mở màn hình vinh danh
        setStage('success');
        showToast(`🎉 SePay xác nhận thành công! Đã cộng +${activeCoins.toLocaleString()} Xu vào ví.`);
      } else {
        // CHƯA NHẬN ĐƯỢC TIỀN: Giữ nguyên trạng thái chờ, thông báo cho khách hàng
        setCheckErrorMsg('Hệ thống chưa nhận được biến động số dư ghi có từ Techcombank (19035907828017). Vui lòng kiểm tra lại lệnh chuyển khoản.');
        if (showFeedback) {
          showToast('⏳ Chưa nhận được tiền. Đang tiếp tục kiểm tra...');
        }
      }
    } catch (err) {
      setCheckErrorMsg('Đang kiểm tra kết nối với cổng SePay VietQR...');
    } finally {
      setIsCheckingApi(false);
    }
  };

  // Bắt đầu quy trình kiểm tra SePay an toàn
  const handleStartVerification = () => {
    setStage('verifying');
    setCheckErrorMsg('');
    setCheckCount(1);

    // Kiểm tra ngay lần đầu
    checkPaymentStatus(true);

    // Bật polling kiểm tra mỗi 3.5 giây
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      checkPaymentStatus(false);
    }, 3500);
  };

  // Admin Manual Bypass (Chỉ dành riêng cho tài khoản Admin quocthiencr90@gmail.com kiểm thử hệ thống)
  const handleAdminTestApprove = () => {
    if (user?.email !== 'quocthiencr90@gmail.com') return;
    if (pollingRef.current) clearInterval(pollingRef.current);
    const refId = `ADMIN_TEST_${Date.now().toString().slice(-6)}`;
    setConfirmedRefId(refId);

    onDepositSuccess(activeCoins, 'Admin Test Bypass', refId);
    addNotification({
      type: 'reward_claimed',
      title: `👑 Admin Duyệt Thử Nghiệm: +${activeCoins.toLocaleString()} Xu`,
      message: `Đã duyệt thử nghiệm tài khoản Admin cho mã ${memoContent}.`,
      rewardCoins: activeCoins
    });
    setStage('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0C101A] shadow-2xl shadow-red-900/20 overflow-hidden text-slate-200 flex flex-col max-h-[94vh]"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-red-950/40 via-purple-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-md shadow-rose-900/30 flex items-center justify-center font-black text-white text-base">
              TCB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-display">
                  {stage === 'success' ? 'Xác Nhận Nạp Xu Thành Công' : 'Nạp Xu Tự Động Qua SePay VietQR (Techcombank)'}
                </h3>
                {stage !== 'success' && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                    TẶNG ĐẾN 10% XU
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Tài khoản nhận tiền: <strong className="text-white">Techcombank - 19035907828017 - NGUYEN QUOC THIEN</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STAGE 1: BẢNG CHỌN GÓI & QUÉT MÃ QR THANH TOÁN */}
        {stage === 'form' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Section 1: Gói Nạp Tiền Mua Xu */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-amber-400" />
                  <span>Chọn Gói Nạp Ưu Đãi (Tặng Thêm Đến +10% Xu)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomAmount(!isCustomAmount)}
                  className="text-[11px] font-mono font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  {isCustomAmount ? '← Chọn theo gói mẫu' : '✏️ Nhập số tiền tùy ý'}
                </button>
              </div>

              {!isCustomAmount ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COIN_TOPUP_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                            : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm font-mono">
                            HOT 🔥
                          </span>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white font-mono">{pkg.amountVnd.toLocaleString()}đ</div>
                          <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                            {pkg.totalCoins.toLocaleString()} <span className="text-[11px] font-normal text-amber-300">Xu</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400 font-bold">+{pkg.bonusCoins.toLocaleString()} Xu</span>
                          <span className="text-slate-400">({pkg.bonusPercent}%)</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white font-mono">Nhập số tiền VNĐ muốn nạp:</span>
                    <span className="text-[11px] text-amber-300 font-mono">Tối thiểu: 50.000đ • Thưởng +5% Xu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={50000}
                      step={10000}
                      value={customVnd}
                      onChange={(e) => setCustomVnd(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-rose-500"
                      placeholder="VD: 500000"
                    />
                    <span className="text-sm font-bold text-slate-400 font-mono">VNĐ</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Số Xu nhận được: <strong className="text-amber-400 text-sm">{activeCoins.toLocaleString()} Xu</strong> (đã gồm {bonusCoins.toLocaleString()} Xu thưởng)
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Khối Quét Mã QR SePay VietQR & Chi Tiết Chuyển Khoản */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#111628] to-[#0A0D18] border border-indigo-500/30 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
                    Mã QR Thanh Toán Tự Động (Techcombank)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQrProvider('sepay')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      qrProvider === 'sepay' ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    SePay QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrProvider('vietqr')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      qrProvider === 'vietqr' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    VietQR
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code */}
                <div className="p-2.5 bg-white rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
                  <img 
                    src={activeQrUrl} 
                    alt="SePay VietQR Techcombank"
                    className="w-36 h-36 object-contain rounded-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = vietQrUrl; }}
                  />
                  <span className="mt-1 text-[9px] font-bold text-slate-700 font-mono">Quét bằng mọi App Ngân Hàng</span>
                </div>

                {/* Account Details */}
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
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                        title="Sao chép số tài khoản"
                      >
                        {copied === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px]">Chủ tài khoản:</span>
                    <span className="font-bold text-white font-mono uppercase">{SEPAY_BANK_CONFIG.accountName}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[11px]">Số tiền:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-amber-400 text-sm">
                        {activeAmountVnd.toLocaleString()} VNĐ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeAmountVnd.toString(), 'amount')}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                        title="Sao chép số tiền"
                      >
                        {copied === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 text-[11px] font-bold">Nội dung CK (Bắt buộc):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-rose-400 text-sm tracking-wider">
                          {memoContent}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(memoContent, 'memo')}
                          className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          {copied === 'memo' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>Chép mã</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      * Chuyển khoản đúng nội dung để SePay nhận diện và mở khóa Xu tự động.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleStartVerification}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase font-mono tracking-wider shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Tôi Đã Chuyển Khoản Xong (Kiểm Tra Giao Dịch SePay)</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                ⚡ Hệ thống chỉ mở khóa Xu khi SePay xác nhận biến động số dư thực tế vào Techcombank 19035907828017.
              </p>
            </div>

          </div>
        )}

        {/* STAGE 2: TRẠNG THÁI CHỜ SEPAY DUYỆT (CHƯA NHẬN ĐƯỢC TIỀN THÌ PHẢI CHỜ, KHÔNG TỰ ĐỘNG THÀNH CÔNG) */}
        {stage === 'verifying' && (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-200">
            
            {/* Animated Radar Scanner */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-rose-500/30 animate-ping opacity-75" />
              <div className="absolute inset-1.5 rounded-full border border-amber-500/40 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-xl shadow-rose-950/80">
                <RefreshCw className={`w-8 h-8 text-white ${isCheckingApi ? 'animate-spin' : ''}`} />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>ĐANG CHỜ SEPAY &amp; TECHCOMBANK XÁC NHẬN</span>
              </span>
              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Đang Kiểm Tra Biến Động Số Dư Thực Tế...
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Mã đơn: <strong className="text-rose-400">{memoContent}</strong> • Số tiền: <strong className="text-amber-300">{activeAmountVnd.toLocaleString()}đ</strong>
              </p>
            </div>

            {/* Thông báo trạng thái an toàn */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left space-y-2 font-mono text-xs text-amber-200/90">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Trạng thái: Chưa nhận được giao dịch ghi có</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Hệ thống chỉ mở khóa Xu khi SePay ghi nhận tiền đã vào tài khoản Techcombank <strong>19035907828017</strong> (NGUYEN QUOC THIEN). Nếu bạn vừa chuyển tiền, vui lòng chờ 10-30 giây để ngân hàng gửi thông báo.
              </p>
              <div className="pt-1 text-[10px] text-slate-400 flex justify-between">
                <span>Số lần kiểm tra: {checkCount}</span>
                <span>{isCheckingApi ? 'Đang gửi truy vấn SePay...' : 'Tự động kiểm tra mỗi 3.5s'}</span>
              </div>
            </div>

            {/* Action Buttons Trong Trạng Thái Chờ */}
            <div className="w-full max-w-md space-y-2.5">
              <button
                type="button"
                disabled={isCheckingApi}
                onClick={() => checkPaymentStatus(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApi ? 'animate-spin' : ''}`} />
                <span>{isCheckingApi ? 'Đang truy vấn SePay...' : 'Kiểm Tra Lại Ngay'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (pollingRef.current) clearInterval(pollingRef.current);
                  setStage('form');
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại xem mã QR &amp; thông tin chuyển khoản</span>
              </button>

              {/* Admin Test Button (Chỉ Admin quocthiencr90@gmail.com mới thấy để thử nghiệm) */}
              {user?.email === 'quocthiencr90@gmail.com' && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleAdminTestApprove}
                    className="w-full py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/60 text-purple-200 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>👑 Admin Test: Bỏ qua kiểm tra thực tế (Chỉ dành cho Admin)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* STAGE 3: MÀN HÌNH CHÚC MỪNG & VINH DANH MỞ KHÓA XU (CHỈ KHI SEPAY ĐÃ XÁC NHẬN TIỀN VỀ THỰC TẾ) */}
        {stage === 'success' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Grand Celebration Header */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-2xl shadow-emerald-950/80">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-2 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  ✓ SEPAY ĐÃ XÁC NHẬN TIỀN VỀ TECHCOMBANK
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  🎉 Chúc Mừng Bạn Đã Mở Khóa Xu Thành Công!
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Giao dịch đã được ghi có an toàn vào tài khoản của bạn trên nền tảng AVA FOLLOW.
                </p>
              </div>
            </div>

            {/* Chi Tiết Mở Khóa Xu */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0E1528] to-purple-950/40 border border-emerald-500/40 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Số tiền thanh toán:</span>
                <span className="text-white font-bold">{activeAmountVnd.toLocaleString()} VNĐ (Techcombank)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Mã giao dịch SePay:</span>
                <span className="text-emerald-400 font-bold">{confirmedRefId}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-300 text-sm font-bold">TỔNG XU ĐÃ VÀO VÍ:</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">
                    +{activeCoins.toLocaleString()} Xu
                  </div>
                  {bonusCoins > 0 && (
                    <div className="text-[10px] text-emerald-400">Đã gồm +{bonusCoins.toLocaleString()} Xu thưởng ưu đãi</div>
                  )}
                </div>
              </div>
            </div>

            {/* GỢI Ý ĐIỀU HƯỚNG SỬ DỤNG XU */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gợi Ý Sử Dụng Xu Ngay Bây Giờ:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openFeedRunner('cross_follow');
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-teal-950/60 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Follow Chéo Kiếm Thêm Xu
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">Lướt video TikTok nhận Xu liên tục</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('create_campaign');
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 to-rose-950/40 border border-purple-500/40 hover:border-purple-400 hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Tạo Chiến Dịch Kéo Follow
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">Dùng Xu để tăng follow, tim thật</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('app_marketplace');
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-blue-950/40 border border-indigo-500/40 hover:border-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Kho App &amp; Tool Kiếm Tiền
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">Bản quyền phần mềm tự động</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('profile_wallet');
                  }}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Xem Lịch Sử Ví Xu
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">Kiểm tra số dư và sao kê SePay</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Hoàn Tất Đóng Modal */}
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
