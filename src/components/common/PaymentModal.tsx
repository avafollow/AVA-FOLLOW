import React, { useState } from 'react';
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
  CheckCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import { 
  COIN_TOPUP_PACKAGES, 
  CoinTopupPackage, 
  SEPAY_BANK_CONFIG,
  generateSepayQrUrl,
  generateVietQrUrl
} from '../../services/sepayService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: string, referenceId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CoinTopupPackage>(COIN_TOPUP_PACKAGES[0]);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customVnd, setCustomVnd] = useState<string>('500000');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrProvider, setQrProvider] = useState<'sepay' | 'vietqr'>('sepay');

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const parsedCustomAmount = Math.max(50000, parseInt(customVnd.replace(/\D/g, '') || '0', 10));
  const activeAmountVnd = isCustomAmount ? parsedCustomAmount : selectedPackage.amountVnd;
  const activeCoins = isCustomAmount 
    ? parsedCustomAmount + Math.round(parsedCustomAmount * 0.05) // 5% bonus for custom
    : selectedPackage.totalCoins;

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

  const handleConfirmTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const refId = `DEP_SEPAY_${Date.now().toString().slice(-6)}`;
      onDepositSuccess(activeCoins, 'SePay VietQR 24/7 (Techcombank)', refId);
      onClose();
    }, 1200);
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
                  Nạp Xu Tự Động Qua SePay VietQR (Techcombank)
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                  TẶNG ĐẾN 10% XU
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Tỷ giá chuẩn: <strong className="text-white">1 Xu = 1 VNĐ Tiền Mặt Cố Định</strong> • Cộng tự động trong 3 giây
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

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Section 1: Gói Nạp Tiền Mua Xu (500k - 10M) + Tùy Chọn */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-amber-400" />
                <span>Chọn Gói Nạp Ưu Đãi (Tặng Thêm Đến +10% Xu)</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomAmount(!isCustomAmount)}
                className="text-[11px] text-amber-400 hover:underline font-mono cursor-pointer"
              >
                {isCustomAmount ? '← Chọn Gói Mặc Định' : '+ Nhập Số Tiền Tùy Ý'}
              </button>
            </div>

            {isCustomAmount ? (
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2">
                <label className="text-xs text-slate-300 font-mono block">Nhập số tiền VNĐ muốn nạp:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="50000"
                    step="10000"
                    value={customVnd}
                    onChange={e => setCustomVnd(e.target.value)}
                    placeholder="VD: 500000"
                    className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-mono text-emerald-400 font-black text-sm">VNĐ</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Số Xu nhận được (thưởng +5%):</span>
                  <strong className="text-neonGold text-sm">+{activeCoins.toLocaleString()} Xu</strong>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {COIN_TOPUP_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-900/40 to-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      {/* Top badge */}
                      <div className="flex items-center justify-between pb-1">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'
                        }`}>
                          +{pkg.bonusPercent}% Xu
                        </span>
                        {pkg.isPopular && (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>

                      {/* Price and bonus */}
                      <div className="my-1 text-left">
                        <div className="font-mono font-black text-white text-xs sm:text-sm">
                          {(pkg.amountVnd / 1000).toLocaleString()}k
                        </div>
                        <div className="text-[10px] font-mono text-neonGold font-bold mt-0.5">
                          +{pkg.totalCoins.toLocaleString()} Xu
                        </div>
                      </div>

                      {/* Sub bonus detail */}
                      <div className="text-[9px] text-slate-400 border-t border-white/5 pt-1 text-left flex items-center justify-between">
                        <span className="text-emerald-400 font-bold">+{pkg.bonusCoins.toLocaleString()} Xu</span>
                        <span className="text-slate-500 font-mono">{(pkg.tokenEquivalent).toLocaleString()} T</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Selected Package Summary Card */}
          <div className="p-4 rounded-2xl bg-[#090D16] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-neonGold border border-amber-500/30 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Gói nạp bạn đang chọn:</div>
                <div className="text-white font-black text-sm">
                  {activeAmountVnd.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
              <div>
                <div className="text-slate-400 text-[10px]">Xu Gốc + Thưởng Nạp:</div>
                <div className="text-base font-black text-neonGold">
                  +{activeCoins.toLocaleString()} Xu
                </div>
              </div>
              <div className="border-l border-white/10 pl-3">
                <div className="text-slate-400 text-[10px]">Quy Đổi Token:</div>
                <div className="text-cyan-400 font-black text-sm">
                  {Math.round(activeAmountVnd / 1000).toLocaleString()} TOKEN
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: VietQR Code & Bank Transfer Information */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row items-center gap-5">
            {/* VietQR Code Box */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl mb-2 text-[10px] font-mono border border-white/10">
                <button
                  type="button"
                  onClick={() => setQrProvider('sepay')}
                  className={`px-2 py-1 rounded-lg font-bold ${qrProvider === 'sepay' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
                >
                  ⚡ SePay QR
                </button>
                <button
                  type="button"
                  onClick={() => setQrProvider('vietqr')}
                  className={`px-2 py-1 rounded-lg font-bold ${qrProvider === 'vietqr' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  🏦 VietQR Napas
                </button>
              </div>

              <div className="relative p-2.5 rounded-2xl bg-white text-black shadow-xl text-center border-2 border-red-600">
                <img
                  src={activeQrUrl}
                  alt="SePay VietQR Code Techcombank"
                  className="w-40 h-40 mx-auto rounded-xl object-contain"
                />
                <div className="mt-1 text-[9px] font-mono font-black uppercase tracking-wider text-slate-800 flex items-center justify-center gap-1">
                  <span className="text-red-600">TECHCOMBANK</span> • <span>NAPAS 247</span>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details (Techcombank - NGUYEN QUOC THIEN - 19035907828017) */}
            <div className="space-y-2.5 w-full text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Ngân hàng thụ hưởng:</span>
                <span className="font-bold text-white">Techcombank (TCB)</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-400 text-base">{SEPAY_BANK_CONFIG.accountNumber}</span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(SEPAY_BANK_CONFIG.accountNumber, 'stk')}
                    className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sao chép STK"
                  >
                    {copied === 'stk' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Chủ tài khoản:</span>
                <span className="font-bold text-white uppercase">{SEPAY_BANK_CONFIG.accountName}</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Số tiền chính xác:</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400 text-sm">
                    {activeAmountVnd.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(activeAmountVnd.toString(), 'amount')}
                    className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-slate-400">Nội dung chuyển khoản (Bắt buộc):</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40 text-sm">
                    {memoContent}
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(memoContent, 'memo')}
                    className="p-1.5 hover:text-white text-amber-300 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied === 'memo' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 font-sans">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Hệ thống kết nối trực tiếp cổng SePay VietQR Napas 24/7 tới tài khoản Techcombank chính chủ của <strong>NGUYEN QUOC THIEN</strong>. Ngay khi chuyển khoản thành công, tài khoản của bạn sẽ tự động được cộng đủ <strong>+{activeCoins.toLocaleString()} Xu</strong> trong vòng 3 giây.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Mã QR có hiệu lực trong 10 phút</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmTransfer}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>ĐANG KIỂM TRA SEPAY...</span>
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
  );
};
