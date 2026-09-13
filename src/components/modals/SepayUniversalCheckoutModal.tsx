import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  ExternalLink,
  Coins,
  Key,
  Package,
  Award,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  SEPAY_BANK_CONFIG, 
  generateSepayQrUrl, 
  generateVietQrUrl 
} from '../../services/sepayService';

export interface SepayCheckoutItem {
  id: string; // Order reference code (e.g. "XU93821", "APP4821", "PKG8172", "ESC1204")
  title: string;
  category: 'topup_xu' | 'software_app' | 'growth_package' | 'escrow_deposit' | 'custom';
  amountVnd: number;
  xuEquivalent?: number;
  bonusXu?: number;
  badge?: string;
  metadata?: Record<string, any>;
}

interface SepayUniversalCheckoutModalProps {
  isOpen: boolean;
  item: SepayCheckoutItem | null;
  onClose: () => void;
  onSuccess: (item: SepayCheckoutItem, referenceId: string) => void;
}

export const SepayUniversalCheckoutModal: React.FC<SepayUniversalCheckoutModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrProvider, setQrProvider] = useState<'sepay' | 'vietqr'>('sepay');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Generate unique memo code for this checkout session
  const [memoCode, setMemoCode] = useState<string>('');

  useEffect(() => {
    if (isOpen && item) {
      const prefix = 
        item.category === 'topup_xu' ? 'AVAXU' :
        item.category === 'software_app' ? 'AVAAPP' :
        item.category === 'growth_package' ? 'AVAPKG' :
        item.category === 'escrow_deposit' ? 'AVAESC' : 'AVA';
      
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const cleanItemId = item.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase();
      setMemoCode(`${prefix}${cleanItemId || randomSuffix}`);
      setTimeLeft(600);
      setIsVerifying(false);
      setIsPaid(false);
    }
  }, [isOpen, item]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || isPaid) return;
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
  }, [isOpen, timeLeft, isPaid]);

  if (!isOpen || !item) return null;

  const handleCopy = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
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

  // Simulating payment confirmation check
  const handleConfirmPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaid(true);
      const refId = `SEPAY_${Date.now().toString().slice(-8)}`;
      setTimeout(() => {
        onSuccess(item, refId);
        onClose();
      }, 1500);
    }, 1200);
  };

  const categoryLabels = {
    topup_xu: { icon: Coins, text: 'Nạp Xu Vào Ví', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
    software_app: { icon: Key, text: 'Mua License Phần Mềm', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
    growth_package: { icon: Package, text: 'Gói Dịch Vụ Tăng Trưởng', color: 'text-rose-400 bg-rose-500/20 border-rose-500/30' },
    escrow_deposit: { icon: Award, text: 'Ký Quỹ Escrow KOC', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
    custom: { icon: Sparkles, text: 'Thanh Toán Đơn Hàng', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' }
  };

  const CatConfig = categoryLabels[item.category] || categoryLabels.custom;
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
                  Cổng Thanh Toán Tự Động SePay VietQR
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

        {/* Modal Body */}
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
              <h4 className="text-base font-black text-white font-display">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Mã giao dịch SePay: <span className="text-amber-400 font-bold">{memoCode}</span>
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-white/10 sm:pl-4 self-start sm:self-center">
              <span className="text-[10px] text-slate-400 font-mono block">Số tiền cần thanh toán:</span>
              <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                {item.amountVnd.toLocaleString('vi-VN')} <span className="text-sm">đ</span>
              </div>
              {item.xuEquivalent && (
                <div className="text-[11px] text-amber-300 font-mono font-bold mt-0.5">
                  ≈ {item.xuEquivalent.toLocaleString()} Xu
                </div>
              )}
            </div>
          </div>

          {/* Section 2: QR Code & Bank Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Left QR Column (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center">
              
              {/* QR Provider switcher */}
              <div className="w-full flex items-center justify-center p-1 bg-black/50 border border-white/10 rounded-xl mb-3 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setQrProvider('sepay')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                    qrProvider === 'sepay'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ SePay VietQR Pro
                </button>
                <button
                  type="button"
                  onClick={() => setQrProvider('vietqr')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                    qrProvider === 'vietqr'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏦 VietQR NAPAS 247
                </button>
              </div>

              {/* QR Code Container with laser scanning animation */}
              <div className="relative p-3 rounded-2xl bg-white text-black shadow-2xl border-4 border-amber-400/80 group">
                <img
                  src={activeQrUrl}
                  alt={`SePay QR ${memoCode}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto rounded-lg"
                />

                {/* Corner accent marks */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-600" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-600" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-600" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-600" />

                {/* Brand watermark below QR */}
                <div className="mt-1 flex items-center justify-center gap-2 pt-1 border-t border-slate-200">
                  <span className="font-bold text-[10px] text-red-600 font-mono tracking-wider">TECHCOMBANK</span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="font-bold text-[10px] text-blue-700 font-mono">napas 247</span>
                </div>
              </div>

              <div className="mt-2 text-center text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mở bất kỳ App ngân hàng nào để quét</span>
              </div>
            </div>

            {/* Right Bank Transfer Details (7 cols) */}
            <div className="md:col-span-7 space-y-3 font-mono text-xs">
              
              {/* Bank Name */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Ngân Hàng Thụ Hưởng:</span>
                <span className="font-bold text-white text-right">
                  Techcombank (TCB)
                </span>
              </div>

              {/* Account Number */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Số Tài Khoản:</span>
                  <span className="text-base font-black text-amber-400 tracking-wider">
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

              {/* Account Holder Name */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Chủ Tài Khoản:</span>
                <span className="font-black text-white uppercase text-sm">
                  {SEPAY_BANK_CONFIG.accountName}
                </span>
              </div>

              {/* Amount */}
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

              {/* Memo Content (Critical!) */}
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
                <p className="text-[10px] text-amber-200/80 leading-relaxed font-sans">
                  * Hệ thống nhận diện tự động qua SePay Webhook. Quý khách vui lòng giữ nguyên nội dung chuyển khoản để dịch vụ được kích hoạt ngay lập tức.
                </p>
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
                disabled={isVerifying || isPaid}
                onClick={handleConfirmPaid}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
              >
                {isPaid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>ĐÃ THANH TOÁN THÀNH CÔNG!</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>ĐANG ĐỐI SOÁT SEPAY...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
