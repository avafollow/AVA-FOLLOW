import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Building2, 
  CreditCard, 
  User, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { BankAccountInfo } from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';

const VIETNAM_BANKS = [
  { id: 'MB', name: 'MB Bank (Ngân Hàng Quân Đội)', short: 'MB' },
  { id: 'VCB', name: 'Vietcombank (Ngoại Thương Việt Nam)', short: 'VCB' },
  { id: 'TCB', name: 'Techcombank (Kỹ Thương Việt Nam)', short: 'TCB' },
  { id: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', short: 'VPB' },
  { id: 'ACB', name: 'ACB (Á Châu)', short: 'ACB' },
  { id: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', short: 'BIDV' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)', short: 'TPB' },
  { id: 'VIB', name: 'VIB (Quốc Tế Việt Nam)', short: 'VIB' },
  { id: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', short: 'STB' },
  { id: 'MOMO', name: 'Ví Điện Tử MoMo (Rút qua SĐT)', short: 'MOMO' }
];

export const BankWithdrawModal: React.FC = () => {
  const { user, isWithdrawOpen, closeWithdraw, withdraw, openKycModal } = useTikTokApp();

  const [bankName, setBankName] = useState<string>(user.bankInfo?.bankName || 'MB Bank (Ngân Hàng Quân Đội)');
  const [accountNumber, setAccountNumber] = useState<string>(user.bankInfo?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState<string>(user.bankInfo?.accountHolder || user.name.toUpperCase());
  const [amountStr, setAmountStr] = useState<string>('200000');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isWithdrawOpen) return null;

  const currentCoins = user.avaliveCoins;
  const currentMaxVND = currentCoins; // 1 Xu = 1 VNĐ
  const amount = parseInt(amountStr.replace(/\D/g, '')) || 0;
  const isKycVerified = user.kycStatus === 'verified';
  const withdrawCount = user.withdrawCount || 0;
  const isFirstWithdraw = withdrawCount === 0;
  const feePercent = isFirstWithdraw ? 0 : 5;
  const feeAmount = isFirstWithdraw ? 0 : Math.round(amount * 0.05);
  const netReceived = amount - feeAmount;
  const MIN_WITHDRAW = 200000;

  const handleWithdraw = () => {
    // Rút tiền lần 2 trở đi BẮT BUỘC phải cập nhật thông tin hồ sơ KYC đầy đủ mới rút được tiền
    if (!isFirstWithdraw && !isKycVerified) {
      alert('Từ lần rút thứ 2 trở đi, BẮT BUỘC phải cập nhật thông tin hồ sơ KYC đầy đủ mới được rút tiền!');
      openKycModal();
      return;
    }
    if (!accountNumber.trim()) {
      alert('Vui lòng nhập số tài khoản ngân hàng hoặc số điện thoại MoMo!');
      return;
    }
    if (!accountHolder.trim()) {
      alert('Vui lòng nhập tên chủ tài khoản!');
      return;
    }
    if (amount < MIN_WITHDRAW) {
      alert(`Số tiền rút tối thiểu là ${MIN_WITHDRAW.toLocaleString()}đ (${MIN_WITHDRAW.toLocaleString()} Xu)!`);
      return;
    }
    if (amount > currentMaxVND) {
      alert(`Số dư Xu khả dụng không đủ! Hiện tại bạn có ${currentMaxVND.toLocaleString()}đ.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const bankInfo: BankAccountInfo = {
        bankName,
        accountNumber,
        accountHolder: accountHolder.toUpperCase()
      };
      const success = withdraw(amount, bankInfo);
      setIsSubmitting(false);
      if (success) {
        closeWithdraw();
      }
    }, 600);
  };

  const QUICK_AMOUNTS = [200000, 500000, 1000000, 2000000, 5000000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-[#0D111E] border border-white/15 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header (Fixed) */}
        <div className="p-5 sm:p-6 border-b border-white/10 shrink-0 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white font-display">Rút Tiền Về Ngân Hàng / MoMo</h3>
                {isFirstWithdraw ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    🎁 LẦN 1: MIỄN PHÍ 0%
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    LẦN {withdrawCount + 1}: PHÍ 5%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Lịch giải ngân: <strong className="text-amber-400">10:00 Sáng Thứ Hai hàng tuần</strong> (xử lý trong 24h)
              </p>
            </div>
          </div>

          <button
            onClick={closeWithdraw}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* First withdraw vs Second withdraw banner */}
          {isFirstWithdraw ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border border-amber-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-amber-300">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-base">🎁</div>
                <div>
                  <strong className="block text-white text-xs">Ưu Đãi Đặc Biệt: Rút Tiền Lần Đầu Miễn Phí 0%!</strong>
                  <span className="text-[11px] text-amber-200/90 font-mono">
                    Bạn được miễn 100% phí sàn cho lần rút đầu tiên. Từ lần 2 sẽ áp dụng phí 5% & bắt buộc KYC.
                  </span>
                </div>
              </div>
            </div>
          ) : isKycVerified ? (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Đã cập nhật KYC CCCD đầy đủ • Đủ điều kiện giải ngân lần {withdrawCount + 1}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                KYC HỢP LỆ ✓
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Yêu Cầu Bắt Buộc: Cập Nhật KYC Để Rút Lần {withdrawCount + 1}</strong>
                  <span className="text-[11px] text-rose-200">
                    Theo quy định hệ thống, từ lần rút thứ 2 trở đi bạn bắt buộc phải cập nhật thông tin hồ sơ KYC đầy đủ mới rút được tiền.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeWithdraw();
                  openKycModal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow-md transition-colors"
              >
                Cập Nhật KYC Ngay
              </button>
            </div>
          )}

          {/* Withdrawal Policy & Timing Card */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-[11px] uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Chính Sách Rút Tiền &amp; Thời Gian Giải Ngân</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 font-mono">
              <li>Lần rút đầu tiên: <strong className="text-emerald-400">MIỄN PHÍ 0% PHÍ SÀN</strong>.</li>
              <li>Từ lần thứ 2 trở đi: <strong className="text-amber-400">Phí xử lý 5%</strong> và <strong className="text-rose-400">Bắt buộc cập nhật KYC đầy đủ</strong>.</li>
              <li>Cơ chế bảo chứng: <strong className="text-emerald-300">Xu nhiệm vụ được bảo lưu 7 ngày</strong> chống gian lận &amp; hủy tương tác. Sau 7 ngày tự động mở khóa rút tiền mặt.</li>
              <li>Lịch giải ngân: <strong className="text-white">10:00 Sáng Thứ Hai hàng tuần</strong> (xử lý giao dịch trong 24 giờ).</li>
              <li>Số tiền rút tối thiểu: <strong className="text-white">200,000 VNĐ</strong> (200,000 Xu).</li>
            </ul>
          </div>



          {/* Current Balance Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-black border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Số dư Xu khả dụng</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {currentCoins.toLocaleString()} <span className="text-xs text-neonGold font-normal">Xu</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-mono">Quy đổi tiền mặt (1:1)</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {currentMaxVND.toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* Bank Form */}
          <div className="space-y-3.5">
            {/* Bank Selection */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ngân hàng thụ hưởng / Ví MoMo</span>
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                {VIETNAM_BANKS.map((b) => (
                  <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span>Số tài khoản ngân hàng hoặc SĐT MoMo</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Nhập chính xác số tài khoản..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Account Holder */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span>Tên chủ tài khoản (Trùng khớp với CCCD)</span>
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN MINH"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Amount to Withdraw */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Số tiền muốn rút (Tối thiểu 200,000đ)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAmountStr(currentMaxVND.toString())}
                  className="text-[11px] text-emerald-400 hover:underline font-mono"
                >
                  Rút tất cả ({currentMaxVND.toLocaleString()}đ)
                </button>
              </div>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Tối thiểu 200,000đ"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              {/* Quick chips (200k, 500k, 1M, 2M, 5M) */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt.toString())}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                      amount === amt
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {amt.toLocaleString()}đ
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Fee & Net Payout Calculation */}
          {amount > 0 && (
            <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Số Xu chuyển đổi rút:</span>
                <span className="text-white font-mono font-bold">{amount.toLocaleString()} Xu</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <span>Phí sàn chuyển đổi hệ thống:</span>
                  {isFirstWithdraw ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      MIỄN PHÍ LẦN ĐẦU (0%)
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                      5%
                    </span>
                  )}
                </span>
                <span className={`font-mono font-bold ${isFirstWithdraw ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isFirstWithdraw ? '0đ (Miễn phí)' : `-${feeAmount.toLocaleString()}đ`}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Thực nhận về tài khoản ATM / MoMo:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  +{netReceived.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Fixed Footer with Submit Button */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 shrink-0 space-y-2">
          <button
            onClick={handleWithdraw}
            disabled={isSubmitting || amount < MIN_WITHDRAW || amount > currentMaxVND || (!isFirstWithdraw && !isKycVerified)}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
              !isFirstWithdraw && !isKycVerified
                ? 'bg-slate-800 text-rose-300 border border-rose-500/30 cursor-pointer'
                : isSubmitting || amount < MIN_WITHDRAW || amount > currentMaxVND
                ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 shadow-emerald-600/25 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <span>Đang tiếp nhận lệnh rút...</span>
            ) : !isFirstWithdraw && !isKycVerified ? (
              <span>Bắt Buộc Cập Nhật KYC Để Rút Lần {withdrawCount + 1}</span>
            ) : (
              <>
                <Zap className="h-4 w-4 text-neonGold" />
                <span>
                  Tạo Lệnh Rút {amount >= MIN_WITHDRAW ? `(+${netReceived.toLocaleString()}đ)` : ''} • Thứ Hai 10:00 AM
                </span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-slate-500 font-mono">
            Lịch giải ngân: 10:00 sáng Thứ Hai hàng tuần • Thời gian xử lý trong 24 giờ qua Napas247
          </p>
        </div>
      </div>
    </div>
  );
};
