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
  Flame,
  Gift,
  Check,
  CheckCheck
} from 'lucide-react';
import { COIN_TOPUP_PACKAGES, CoinTopupPackage } from '../../services/sepayService';

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
  const [activeTab, setActiveTab] = useState<'sepay_qr' | 'banking'>('sepay_qr');
  const [selectedPackage, setSelectedPackage] = useState<CoinTopupPackage>(COIN_TOPUP_PACKAGES[0]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const refId = `DEP_SEPAY_${Date.now().toString().slice(-6)}`;
      onDepositSuccess(selectedPackage.totalCoins, 'SePay VietQR 24/7', refId);
      onClose();
    }, 1200);
  };

  const memoContent = `NAPXU ${selectedPackage.amountVnd / 1000}K`;
  const qrUrl = `https://img.vietqr.io/image/MB-88888888-compact2.png?amount=${selectedPackage.amountVnd}&addInfo=${encodeURIComponent(memoContent)}&accountName=NGUYEN%20THIEN`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0C101A] shadow-2xl shadow-purple-900/30 overflow-hidden text-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-950/50 via-slate-900 to-rose-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-neonGold">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-display">
                  Nạp Tiền Mua Thêm Xu • Khớp Lệnh Tự Động 24/7
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                  TẶNG ĐẾN 10% XU
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Tỷ giá chuẩn: <strong className="text-white">1 Xu = 1 VNĐ Tiền Mặt Cố Định</strong>
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
          
          {/* Section 1: 5 Gợi Ý Gói Nạp Tiền Mua Xu (499k - 10M) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-neonGold" />
                <span>Gợi Ý 5 Gói Nạp Mua Thêm Xu (Tặng Thêm Lên Đến +10%)</span>
              </label>
              <span className="text-[11px] text-neonGold font-mono">
                Thấp nhất 500.000đ
              </span>
            </div>

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
                  {selectedPackage.amountVnd.toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
              <div>
                <div className="text-slate-400 text-[10px]">Xu Gốc + Thưởng (+{selectedPackage.bonusPercent}%):</div>
                <div className="text-base font-black text-neonGold">
                  +{selectedPackage.totalCoins.toLocaleString()} Xu
                </div>
              </div>
              <div className="border-l border-white/10 pl-3">
                <div className="text-slate-400 text-[10px]">Quy Đổi Token:</div>
                <div className="text-cyan-400 font-black text-sm">
                  {selectedPackage.tokenEquivalent.toLocaleString()} TOKEN
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: VietQR Code & Bank Transfer Information */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row items-center gap-5">
            {/* VietQR Code Box */}
            <div className="relative p-2.5 rounded-2xl bg-white text-black shadow-xl text-center shrink-0">
              <img
                src={qrUrl}
                alt="SePay VietQR Code"
                className="w-40 h-40 mx-auto rounded-xl object-contain"
              />
              <div className="mt-1 text-[9px] font-mono font-black uppercase tracking-wider text-slate-800">
                Quét Bằng Mọi App Ngân Hàng
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="space-y-2.5 w-full text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Ngân hàng thụ hưởng:</span>
                <span className="font-bold text-white">MB Bank (Ngân Hàng Quân Đội)</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300 text-sm">88888888</span>
                  <button 
                    onClick={() => handleCopy('88888888', 'stk')}
                    className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/10 transition-colors"
                    title="Sao chép STK"
                  >
                    {copied === 'stk' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Chủ tài khoản:</span>
                <span className="font-bold text-white">NGUYEN THIEN (TIKTOK PRO)</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-slate-400">Số tiền chính xác:</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-neonGold text-sm">
                    {selectedPackage.amountVnd.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <button 
                    onClick={() => handleCopy(selectedPackage.amountVnd.toString(), 'amount')}
                    className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/10 transition-colors"
                  >
                    {copied === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <span className="text-slate-400">Nội dung chuyển khoản (Memo):</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    {memoContent}
                  </span>
                  <button 
                    onClick={() => handleCopy(memoContent, 'memo')}
                    className="p-1 hover:text-white text-slate-400 rounded hover:bg-white/10 transition-colors"
                  >
                    {copied === 'memo' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 font-sans">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Hệ thống kết nối trực tiếp SePay VietQR NAPAS 24/7. Ngay khi chuyển khoản thành công, tài khoản của bạn sẽ tự động được cộng đủ <strong>+{selectedPackage.totalCoins.toLocaleString()} Xu</strong> trong vòng 10-30 giây.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#090D15] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono text-center sm:text-left">
            Thanh toán: <strong className="text-white font-bold">{selectedPackage.amountVnd.toLocaleString()} VNĐ</strong>
            <span className="text-emerald-400 ml-2">→ Nhận +{selectedPackage.totalCoins.toLocaleString()} Xu</span>
          </div>

          <button
            onClick={handleConfirmTransfer}
            disabled={isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white font-black text-xs font-mono shadow-xl shadow-rose-900/30 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Đang Khớp Lệnh VietQR...</span>
              </>
            ) : (
              <>
                <span>XÁC NHẬN NẠP +{selectedPackage.totalCoins.toLocaleString()} XU NGAY</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
