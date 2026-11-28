import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  Building2,
  CreditCard,
  User,
  ArrowDownRight,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Clock,
  Coins,
  Share2,
  Lock
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
  const {
    user,
    affiliateData,
    isWithdrawOpen,
    closeWithdraw,
    withdraw,
    withdrawAffiliateCommission,
    openKycModal,
    commissionSettings
  } = useTikTokApp();

  const [withdrawTab, setWithdrawTab] = useState<'mission' | 'affiliate'>('mission');
  const [bankName, setBankName] = useState<string>(user.bankInfo?.bankName || 'MB Bank (Ngân Hàng Quân Đội)');
  const [accountNumber, setAccountNumber] = useState<string>(user.bankInfo?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState<string>(user.bankInfo?.accountHolder || (user.name || '').toUpperCase());
  const [amountStr, setAmountStr] = useState<string>('500000');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isWithdrawOpen) return;
    setBankName(user.bankInfo?.bankName || 'MB Bank (Ngân Hàng Quân Đội)');
    setAccountNumber(user.bankInfo?.accountNumber || '');
    setAccountHolder(user.bankInfo?.accountHolder || (user.name || '').toUpperCase());
    try {
      const preferred = localStorage.getItem('ava_withdraw_tab');
      if (preferred === 'affiliate') {
        setWithdrawTab('affiliate');
        setAmountStr('100000');
        localStorage.removeItem('ava_withdraw_tab');
      } else {
        setWithdrawTab('mission');
        setAmountStr('500000');
      }
    } catch {
      setWithdrawTab('mission');
      setAmountStr('500000');
    }
  }, [isWithdrawOpen, user.bankInfo, user.name]);

  if (!isWithdrawOpen) return null;

  const crossFollowCoins = user.crossFollowCoins ?? 0;
  const missionCoins = user.missionCoins ?? Math.max(0, (user.avaliveCoins || 0) - crossFollowCoins);
  const affiliateBalanceVND = user.affiliateBalanceVND ?? (affiliateData?.availableCommissionVND ?? 0);

  const isAffiliateTab = withdrawTab === 'affiliate';
  const MIN_WITHDRAW = isAffiliateTab ? 100000 : 500000;
  const currentMaxVND = isAffiliateTab ? affiliateBalanceVND : missionCoins;

  const amount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;
  const isKycVerified = user.kycStatus === 'verified';
  const withdrawCount = user.withdrawCount || 0;
  const isFirstWithdraw = withdrawCount === 0;
  const configuredFeePercent = isAffiliateTab ? 0 : (commissionSettings?.withdrawFeePercent ?? 5);
  const feeAmount = isAffiliateTab || isFirstWithdraw ? 0 : Math.round(amount * (configuredFeePercent / 100));
  const netReceived = Math.max(0, amount - feeAmount);
  const disbursementTime = '10:00 Sáng Thứ Hai hàng tuần';

  const handleSwitchTab = (tab: 'mission' | 'affiliate') => {
    setWithdrawTab(tab);
    setAmountStr(tab === 'affiliate' ? '100000' : '500000');
  };

  const handleWithdraw = () => {
    if (!isAffiliateTab && !isFirstWithdraw && !isKycVerified) {
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
      alert(
        isAffiliateTab
          ? 'Số tiền rút Hoa hồng Tiếp thị liên kết tối thiểu là 100.000đ!'
          : 'Số tiền rút từ Ví Xu Làm Nhiệm Vụ tối thiểu là 500.000đ (500.000 Xu)!'
      );
      return;
    }
    if (amount > currentMaxVND) {
      alert(
        isAffiliateTab
          ? `Số dư Hoa hồng Affiliate hiện tại (${currentMaxVND.toLocaleString()}đ) chưa đủ!`
          : `Số dư Ví Xu Làm Nhiệm Vụ (${currentMaxVND.toLocaleString()} Xu) chưa đủ! Lưu ý: Xu Follow Chéo (${crossFollowCoins.toLocaleString()} Xu) chỉ dùng để mua gói, không rút được tiền mặt.`
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const bankInfo: BankAccountInfo = {
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase()
      };
      const success = isAffiliateTab
        ? withdrawAffiliateCommission(amount, bankInfo)
        : withdraw(amount, bankInfo);
      setIsSubmitting(false);
      if (success) {
        closeWithdraw();
      }
    }, 500);
  };

  const QUICK_AMOUNTS = isAffiliateTab
    ? [100000, 200000, 500000, 1000000, 2000000]
    : [500000, 1000000, 2000000, 5000000];

  return (
    <div
      onClick={closeWithdraw}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] flex flex-col rounded-3xl bg-[#0D111E] border border-white/15 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 shrink-0 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <ArrowDownRight className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-white font-display truncate">
                Rút Tiền Về Ngân Hàng / MoMo
              </h3>
              <p className="text-[11px] text-slate-400">
                Giải ngân định kỳ: <strong className="text-amber-400">{disbursementTime}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeWithdraw}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 text-xs">
          {/* 2 Tabs chọn nguồn rút tiền */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => handleSwitchTab('mission')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                !isAffiliateTab
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>Xu Làm Nhiệm Vụ</span>
              </span>
              <span className="text-[10px] font-mono opacity-90">Min 500.000đ (500K Xu)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('affiliate')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                isAffiliateTab
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Hoa Hồng Affiliate</span>
              </span>
              <span className="text-[10px] font-mono opacity-90">Min 100.000đ</span>
            </button>
          </div>

          {/* Số dư nguồn rút */}
          {!isAffiliateTab ? (
            <div className="space-y-2.5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-black border border-emerald-500/35 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <span>Ví Xu Làm Nhiệm Vụ &amp; Thưởng</span>
                    <FeatureGuideTooltip
                      title="Quy Định Rút Từ Ví Xu Làm Nhiệm Vụ"
                      description="Chỉ số Xu kiếm từ Làm Nhiệm Vụ và Xu Thưởng (+500.000 Xu lần đầu) mới được quy đổi rút tiền mặt. Tối thiểu 500.000đ (= 500.000 Xu)."
                      size="xs"
                    />
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                    {missionCoins.toLocaleString()} Xu
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-mono">Quy đổi tiền mặt (1:1)</div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">
                    {missionCoins.toLocaleString()}đ
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-purple-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Ví Xu Follow Chéo (Chỉ dùng mua gói, không rút tiền):</span>
                </span>
                <strong className="text-purple-300 font-mono shrink-0">
                  {crossFollowCoins.toLocaleString()} Xu
                </strong>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-purple-950/30 to-black border border-amber-500/40 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-amber-200 font-mono">Hoa Hồng Tiếp Thị Liên Kết Khả Dụng</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {affiliateBalanceVND.toLocaleString()}đ
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-300">
                <div>Min rút: <strong className="text-white">100.000đ</strong></div>
                <div className="text-emerald-400">Trả 10:00 Sáng Thứ 2</div>
              </div>
            </div>
          )}

          {/* Policy Card */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-[11px] uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Quy Định Rút Tiền &amp; Giải Ngân</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 font-mono">
              <li>Lịch trả tiền hàng tuần: <strong className="text-white">{disbursementTime}</strong>.</li>
              <li>Rút từ Ví Xu Làm Nhiệm Vụ: <strong className="text-emerald-300">Tối thiểu 500.000đ (500.000 Xu)</strong>.</li>
              <li>Rút từ Hoa Hồng Affiliate: <strong className="text-amber-300">Tối thiểu 100.000đ</strong> (hoặc dùng mua bất kỳ gói nào).</li>
              <li>Xu Follow Chéo: <strong className="text-purple-300">Chỉ dùng mua gói, không quy đổi rút tiền</strong>.</li>
            </ul>
          </div>

          {/* KYC check for 2nd mission withdraw */}
          {!isAffiliateTab && !isFirstWithdraw && !isKycVerified && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-2">
              <div className="flex items-start gap-2 text-rose-300 text-[11px]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Từ lần rút thứ 2 trở đi cần cập nhật hồ sơ KYC đầy đủ.</span>
              </div>
              <button
                type="button"
                onClick={() => { closeWithdraw(); openKycModal(); }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] shrink-0 cursor-pointer"
              >
                KYC Ngay
              </button>
            </div>
          )}

          {/* Bank Form */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ngân hàng thụ hưởng / Ví MoMo</span>
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                {VIETNAM_BANKS.map((b) => (
                  <option key={b.id} value={b.name} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span>Số tài khoản ngân hàng / SĐT MoMo</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Nhập chính xác số tài khoản..."
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span>Tên chủ tài khoản</span>
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN A"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Số tiền rút (Min {MIN_WITHDRAW.toLocaleString()}đ)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAmountStr(currentMaxVND.toString())}
                  className="text-[11px] text-emerald-400 hover:underline font-mono cursor-pointer"
                >
                  Tối đa ({currentMaxVND.toLocaleString()}đ)
                </button>
              </div>
              <input
                type="number"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder={`Tối thiểu ${MIN_WITHDRAW.toLocaleString()}đ`}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt.toString())}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
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

          {/* Summary */}
          {amount > 0 && (
            <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Số tiền yêu cầu rút:</span>
                <span className="text-white font-mono font-bold">
                  {amount.toLocaleString()}đ {!isAffiliateTab && `(${amount.toLocaleString()} Xu)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Phí xử lý:</span>
                <span className={`font-mono font-bold ${feeAmount === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {feeAmount === 0 ? '0đ (Miễn phí)' : `-${feeAmount.toLocaleString()}đ (${configuredFeePercent}%)`}
                </span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Thực nhận về ngân hàng:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  +{netReceived.toLocaleString()}đ
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 shrink-0 space-y-1.5">
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isSubmitting || amount < MIN_WITHDRAW || amount > currentMaxVND || (!isAffiliateTab && !isFirstWithdraw && !isKycVerified)}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
              isSubmitting || amount < MIN_WITHDRAW || amount > currentMaxVND || (!isAffiliateTab && !isFirstWithdraw && !isKycVerified)
                ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
                : isAffiliateTab
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:brightness-110 cursor-pointer'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 cursor-pointer'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>
              {isSubmitting
                ? 'Đang tạo lệnh rút...'
                : amount < MIN_WITHDRAW
                  ? `Cần tối thiểu ${MIN_WITHDRAW.toLocaleString()}đ để rút`
                  : amount > currentMaxVND
                    ? 'Số dư khả dụng chưa đủ'
                    : `Tạo Lệnh Rút (+${netReceived.toLocaleString()}đ)`}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-500 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Giải ngân tự động lúc 10:00 Sáng Thứ Hai hàng tuần</span>
          </p>
        </div>
      </div>
    </div>
  );
};
