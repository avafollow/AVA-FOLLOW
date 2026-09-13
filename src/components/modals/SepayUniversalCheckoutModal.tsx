import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  Coins, 
  Check, 
  RefreshCw, 
  Clock,
  Key,
  Package,
  Award,
  Flame,
  PlusCircle,
  Cpu,
  Wallet
} from 'lucide-react';
import { 
  SEPAY_BANK_CONFIG, 
  generateSepayQrUrl, 
  generateVietQrUrl 
} from '../../services/sepayService';
export interface SepayCheckoutItem {
  id: string;
  title: string;
  category: 'topup_xu' | 'software_app' | 'growth_package' | 'escrow_deposit' | 'custom' | any;
  amountVnd: number;
  xuEquivalent?: number;
  badge?: string;
  metadata?: any;
}
import { useTikTokApp } from '../../context/TikTokAppContext';

interface SepayUniversalCheckoutModalProps {
  isOpen: boolean;
  item: SepayCheckoutItem | null;
  onClose: () => void;
  onSuccess: (item: SepayCheckoutItem, referenceId: string) => void;
  onNavigate?: (screen: any) => void;
}

export const SepayUniversalCheckoutModal: React.FC<SepayUniversalCheckoutModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
  onNavigate
}) => {
  const { addNotification, showToast, openFeedRunner } = useTikTokApp();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrProvider, setQrProvider] = useState<'sepay' | 'vietqr'>('sepay');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes countdown
  const [memoCode, setMemoCode] = useState<string>('');

  // 3-stage safe flow: 'form' -> 'verifying' -> 'success'
  const [stage, setStage] = useState<'form' | 'verifying' | 'success'>('form');
  const [verifyProgress, setVerifyProgress] = useState<number>(25);
  const [confirmedRefId, setConfirmedRefId] = useState<string>('');

  useEffect(() => {
    if (isOpen && item) {
      const prefix = item.category === 'topup_xu' ? 'AVAXU'
        : item.category === 'software_app' ? 'AVAAPP'
        : item.category === 'growth_package' ? 'AVAPKG'
        : item.category === 'escrow_deposit' ? 'AVAESC'
        : 'AVAPAY';
      
      const uniqueSuffix = Math.floor(10000 + Math.random() * 90000);
      setMemoCode(`${prefix}${uniqueSuffix}`);
      setTimeLeft(600);
      setStage('form');
      setVerifyProgress(25);
      setConfirmedRefId('');
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || stage === 'success') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, stage]);

  if (!isOpen || !item) return null;

  const handleCopy = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    showToast(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sepayQrUrl = generateSepayQrUrl({
    amount: item.amountVnd,
    orderCode: memoCode,
    accountNumber: SEPAY_BANK_CONFIG.accountNumber,
    bankName: SEPAY_BANK_CONFIG.bankName
  });

  const vietQrUrl = generateVietQrUrl({
    amount: item.amountVnd,
    orderCode: memoCode,
    accountNumber: SEPAY_BANK_CONFIG.accountNumber,
    bankShortName: SEPAY_BANK_CONFIG.bankShortName,
    accountName: SEPAY_BANK_CONFIG.accountName
  });

  const activeQrUrl = qrProvider === 'sepay' ? sepayQrUrl : vietQrUrl;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Polling check SePay payment status
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [checkErrorMsg, setCheckErrorMsg] = useState('');
  const pollingRef = React.useRef<any>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const checkPaymentStatus = async (showFeedback = false) => {
    if (isCheckingApi) return;
    setIsCheckingApi(true);
    setCheckCount(prev => prev + 1);

    try {
      const res = await fetch(`/api/check-payment?orderCode=${memoCode}&amount=${item.amountVnd}`);
      const data = await res.json();

      if (data && data.verified === true) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        const refId = data.transaction?.referenceCode || `SEPAY_TCB_${Date.now().toString().slice(-8)}`;
        setConfirmedRefId(refId);

        // 1. Phê duyệt giao dịch
        onSuccess(item, refId);

        // 2. Gửi thông báo đẩy vào chuông thông báo
        addNotification({
          type: 'reward_claimed',
          title: `🎉 SePay Đã Xác Nhận Thanh Toán: ${item.title}`,
          message: `Đã nhận ${item.amountVnd.toLocaleString()}đ qua Techcombank (Ref: ${refId}). Đơn hàng đã được kích hoạt thành công!`,
          rewardCoins: item.xuEquivalent
        });

        // 3. Mở màn hình vinh danh & chúc mừng
        setStage('success');
        showToast(`🎉 SePay xác nhận thành công! Đã kích hoạt đơn hàng.`);
      } else {
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

  // Bắt đầu đối soát an toàn SePay
  const handleConfirmPaid = () => {
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

  // Admin Manual Bypass cho quocthiencr90@gmail.com
  const { user } = useTikTokApp();
  const handleAdminTestApprove = () => {
    if (user?.email !== 'quocthiencr90@gmail.com') return;
    if (pollingRef.current) clearInterval(pollingRef.current);
    const refId = `ADMIN_TEST_${Date.now().toString().slice(-6)}`;
    setConfirmedRefId(refId);

    onSuccess(item, refId);
    addNotification({
      type: 'reward_claimed',
      title: `👑 Admin Duyệt Thử Nghiệm: ${item.title}`,
      message: `Đã duyệt thử nghiệm tài khoản Admin cho mã ${memoCode}.`,
      rewardCoins: item.xuEquivalent
    });
    setStage('success');
  };

  const categoryLabels = {
    topup_xu: { icon: Coins, text: 'Nạp Xu Vào Ví', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    software_app: { icon: Key, text: 'Mua License Phần Mềm', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
    growth_package: { icon: Package, text: 'Gói Dịch Vụ Tăng Trưởng', color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' },
    escrow_deposit: { icon: Award, text: 'Ký Quỹ Escrow KOC', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
    custom: { icon: Sparkles, text: 'Thanh Toán Đơn Hàng', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' }
  };

  const CatConfig = (categoryLabels as any)[item.category] || categoryLabels.custom;
  const CategoryIcon = CatConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0C101A] shadow-2xl shadow-purple-950/40 overflow-hidden text-slate-200 flex flex-col max-h-[94vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-red-950/40 via-purple-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-md shadow-rose-900/30 flex items-center justify-center font-black text-white text-base">
              TCB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-display">
                  {stage === 'success' ? 'Xác Nhận Đã Nhận Tiền Thành Công' : 'Cổng Thanh Toán Tự Động SePay VietQR'}
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  REALTIME 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Khớp lệnh tự động trong 3 giây • Chuyển tiền tới <strong className="text-white">NGUYEN QUOC THIEN</strong>
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

        {/* STAGE 1: CHI TIẾT ĐƠN HÀNG + MÃ QR SEPAY */}
        {stage === 'form' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* Section 1: Order Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-purple-950/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold font-mono ${CatConfig.color}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{CatConfig.text}</span>
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-white font-display">
                  {item.title}
                </h4>
                {item.xuEquivalent && (
                  <div className="text-xs text-amber-300 font-mono flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Quy đổi: <strong>{item.xuEquivalent.toLocaleString('vi-VN')} Xu</strong> vào ví</span>
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-mono">Số tiền cần thanh toán</span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {item.amountVnd.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            {/* Section 2: QR Code & Bank Transfer Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Left Column: QR Image */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
                <div className="relative p-3 bg-white rounded-2xl shadow-2xl">
                  <img 
                    src={activeQrUrl} 
                    alt="SePay VietQR Code" 
                    className="w-48 h-48 object-contain rounded-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = vietQrUrl; }}
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold uppercase shadow">
                    Techcombank 24/7
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">Quét mã bằng app ngân hàng bất kỳ</p>
                  <p className="text-[11px] text-slate-400 font-mono">Số tiền &amp; nội dung đã được nhúng sẵn chính xác 100%</p>
                </div>
              </div>

              {/* Right Column: Bank Details Table */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Ngân Hàng:</span>
                  <span className="font-black text-white">{SEPAY_BANK_CONFIG.bankName} (TCB)</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số Tài Khoản:</span>
                    <span className="text-sm font-black text-emerald-400 tracking-wider">
                      {SEPAY_BANK_CONFIG.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(SEPAY_BANK_CONFIG.accountNumber, 'acc')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Chủ Tài Khoản:</span>
                  <span className="font-black text-white uppercase text-sm">{SEPAY_BANK_CONFIG.accountName}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số Tiền Chuyển:</span>
                    <span className="text-base font-black text-emerald-400">
                      {item.amountVnd.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.amountVnd.toString(), 'amount')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Nội dung chuyển khoản (Bắt buộc):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(memoCode, 'memo')}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'memo' ? 'Đã chép mã' : 'Sao chép mã'}</span>
                    </button>
                  </div>
                  <div className="text-lg font-black text-amber-300 tracking-wider select-all bg-black/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                    {memoCode}
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Status & Action Bar */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">Hiệu lực mã QR:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                >
                  <Check className="w-4 h-4" />
                  <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STAGE 2: TRẠNG THÁI CHỜ SEPAY DUYỆT & ĐỐI SOÁT AN TOÀN (CHƯA NHẬN TIỀN THÌ PHẢI CHỜ) */}
        {stage === 'verifying' && (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-200">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full border border-teal-500/40 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-950/80">
                <RefreshCw className={`w-8 h-8 text-white ${isCheckingApi ? 'animate-spin' : ''}`} />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>ĐANG CHỜ SEPAY &amp; TECHCOMBANK XÁC NHẬN</span>
              </span>
              <h3 className="text-base sm:text-lg font-black text-white font-display">
                Đang Kiểm Tra Biến Động Số Dư Thực Tế...
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Mã đơn hàng: <strong className="text-amber-400">{memoCode}</strong> • Số tiền: <strong className="text-emerald-400">{item.amountVnd.toLocaleString()}đ</strong>
              </p>
            </div>

            {/* Thông báo trạng thái an toàn */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left space-y-2 font-mono text-xs text-amber-200/90">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Trạng thái: Chưa nhận được giao dịch ghi có</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Hệ thống chỉ phê duyệt khi SePay xác nhận tiền đã vào tài khoản Techcombank <strong>19035907828017</strong> (NGUYEN QUOC THIEN). Nếu bạn vừa chuyển tiền, vui lòng đợi vài giây để hệ thống nhận webhook.
              </p>
              <div className="pt-1 text-[10px] text-slate-400 flex justify-between">
                <span>Số lần kiểm tra: {checkCount}</span>
                <span>{isCheckingApi ? 'Đang gửi truy vấn SePay...' : 'Tự động kiểm tra mỗi 3.5s'}</span>
              </div>
            </div>

            {/* Thao tác khi chờ */}
            <div className="w-full max-w-md flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStage('form')}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                ← Quay Lại Mã QR
              </button>
              <button
                type="button"
                disabled={isCheckingApi}
                onClick={() => checkPaymentStatus(true)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApi ? 'animate-spin' : ''}`} />
                <span>Kiểm Tra Lại Ngay</span>
              </button>
            </div>

            {/* Admin Manual Test Button */}
            {user?.email === 'quocthiencr90@gmail.com' && (
              <div className="w-full max-w-md p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-[11px] font-mono">
                <span className="text-purple-300 font-bold">👑 Admin Test Mode:</span>
                <button
                  type="button"
                  onClick={handleAdminTestApprove}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all"
                >
                  Duyệt Thử Nghiệm Ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: MÀN HÌNH CHÚC MỪNG & VINH DANH MỞ KHÓA THÀNH CÔNG */}
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
                  SEPAY ĐÃ PHÊ DUYỆT & NHẬN TIỀN THÀNH CÔNG
                </span>
                <h3 className="text-xl font-black text-white font-display">
                  🎉 Thanh Toán Đơn Hàng Thành Công!
                </h3>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  Cổng SePay đã xác nhận biến động số dư Techcombank. Dịch vụ của bạn đã được mở khóa an toàn trên toàn hệ sinh thái.
                </p>
              </div>
            </div>

            {/* Chi Tiết Giao Dịch */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0E1528] to-purple-950/40 border border-emerald-500/40 shadow-xl space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Đơn hàng / Sản phẩm:</span>
                <span className="text-white font-bold">{item.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Số tiền thanh toán:</span>
                <span className="text-white font-bold">{item.amountVnd.toLocaleString()} VNĐ (Techcombank)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Mã giao dịch SePay:</span>
                <span className="text-emerald-400 font-bold">{confirmedRefId}</span>
              </div>
              {item.xuEquivalent && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-300 text-sm font-bold">XU ĐÃ MỞ KHÓA VÀO VÍ:</span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-400">
                      +{item.xuEquivalent.toLocaleString()} Xu
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gợi Ý Sử Dụng */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gợi Ý Sử Dụng Ngay:</span>
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
                      Tạo Chiến Dịch Tăng Trưởng
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">Kéo follow và seeding kênh</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Nút Hoàn Tất */}
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
