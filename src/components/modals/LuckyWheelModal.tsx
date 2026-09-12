import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Gift, 
  Coins, 
  Trophy, 
  Flame, 
  Share2,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
  Info,
  HelpCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const LuckyWheelModal: React.FC = () => {
  const { 
    isLuckyWheelOpen, 
    closeLuckyWheel, 
    deductSpinFee,
    consumeFreeSpin,
    grantFreeSpin,
    awardLuckyWheelPrize,
    user, 
    showToast, 
    completeTask, 
    tasks,
    openDeposit
  } = useTikTokApp();

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<{ text: string; coins: number; followers?: number; isJackpot?: boolean } | null>(null);
  const [showOddsDetails, setShowOddsDetails] = useState<boolean>(false);

  if (!isLuckyWheelOpen) return null;

  // Constants
  const DAILY_TASK_GOAL = 15;
  const SPIN_COST = 1000; // 1.000 Xu / lượt quay
  const isDailyCompleted = user.dailyTasksCompleted >= DAILY_TASK_GOAL;
  const freeSpinsAvailable = (user.luckyWheelFreeSpins || 0) + (isDailyCompleted ? 1 : 0);
  const tasksRemaining = Math.max(0, DAILY_TASK_GOAL - user.dailyTasksCompleted);
  const canAffordWithCoins = user.avaliveCoins >= SPIN_COST;

  // Prize Definitions & Exact Target Angles
  // 4 Quadrants:
  // Index 0: 500 Xu (Top-Left) -> 45 deg
  // Index 1: 1,000 Xu (Top-Right) -> 315 deg
  // Index 2: 2,000 Xu (Bottom-Left) -> 135 deg
  // Index 3: Gói 50 Follow (5.000 Xu) (Bottom-Right) -> 225 deg
  const PRIZES = [
    { index: 0, text: '+500 Xu', targetAngle: 45, type: 'coins' as const, value: 500, odds: '40%' },
    { index: 1, text: '+1,000 Xu', targetAngle: 315, type: 'coins' as const, value: 1000, odds: '35%' },
    { index: 2, text: '+2,000 Xu', targetAngle: 135, type: 'coins' as const, value: 2000, odds: '15%' },
    { index: 3, text: 'Gói 50 Follow (5.000 Xu)', targetAngle: 225, type: 'follow' as const, value: 5000, followers: 50, odds: '10%' },
  ];

  const handleSpin = (isFree: boolean) => {
    if (isSpinning) return;

    if (isFree) {
      if (freeSpinsAvailable <= 0) {
        showToast('⚠️ Bạn đã hết lượt quay miễn phí! Bạn có thể chọn quay bằng 1.000 Xu.');
        return;
      }
      consumeFreeSpin();
    } else {
      if (!canAffordWithCoins) {
        showToast(`⚠️ Số dư hiện tại (${user.avaliveCoins.toLocaleString()} Xu) không đủ 1.000 Xu để quay!`);
        return;
      }
      const success = deductSpinFee();
      if (!success) return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Weighted RNG according to user specification:
    // 500 Xu: 40% (0.00 .. 0.40)
    // 1,000 Xu: 35% (0.40 .. 0.75)
    // 2,000 Xu: 15% (0.75 .. 0.90)
    // Gói 50 Follow (5.000 Xu): 10% (0.90 .. 1.00)
    const rand = Math.random();
    let chosenIdx = 0;
    if (rand < 0.40) chosenIdx = 0;
    else if (rand < 0.75) chosenIdx = 1;
    else if (rand < 0.90) chosenIdx = 2;
    else chosenIdx = 3;

    const chosenPrize = PRIZES[chosenIdx];

    // Compute angle to ensure pointer lands 100% accurately on chosen quadrant
    const fullTurns = 360 * 5; // 1800 deg
    const currentMod = rotation % 360;
    let angleDiff = chosenPrize.targetAngle - currentMod;
    if (angleDiff < 0) angleDiff += 360;
    const nextRotation = rotation + fullTurns + angleDiff;

    setRotation(nextRotation);

    // After 4s animation, execute prize payout & trigger celebration
    setTimeout(() => {
      setIsSpinning(false);
      const result = awardLuckyWheelPrize(chosenIdx);
      setWonPrize({
        text: result.prizeText,
        coins: result.coins,
        followers: result.followers,
        isJackpot: chosenIdx === 3
      });
    }, 4000);
  };

  const handleShareToGetSpin = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://avalive.vn/ref/' + (user.handle || 'thienvuaapp'));
    }
    grantFreeSpin(1);
    showToast('🎉 Đã sao chép link giới thiệu! Tặng ngay +1 lượt quay may mắn miễn phí!');
  };

  const handleSimulateFinishDailyTasks = () => {
    const openTask = tasks.find(t => t.status === 'open') || tasks[0];
    if (openTask) {
      completeTask(openTask.id, {
        followed: true,
        liked: true,
        commented: true,
        shared: false
      });
    }
    showToast(`✅ Đã hoàn thành thêm nhiệm vụ! Tiến độ hôm nay: ${Math.min(DAILY_TASK_GOAL, user.dailyTasksCompleted + 1)}/${DAILY_TASK_GOAL}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-md my-auto rounded-3xl bg-[#0D111E] border border-amber-500/30 shadow-2xl p-5 sm:p-6 text-center space-y-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeLuckyWheel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all z-20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>VÒNG QUAY MAY MẮN TIKTOK 2026</span>
          </div>
          <h3 className="text-xl font-black text-white font-display">
            Quà Tặng Tri Ân &amp; Nổ Quà 100%
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            100% các lượt quay đều trúng thưởng! Tự động nổ quà và cộng Xu trực tiếp vào tài khoản của bạn.
          </p>
        </div>

        {/* Transparent Policy & Pricing Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-amber-950/30 border border-amber-500/30 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold font-display">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>MINH BẠCH CHI PHÍ &amp; QUYỀN LỢI</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOddsDetails(!showOddsDetails)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showOddsDetails ? 'Ẩn tỷ lệ' : 'Xem tỷ lệ nổ quà'}</span>
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <div className="text-slate-400 text-[10px]">🎟️ Lượt Miễn Phí</div>
              <div className="text-emerald-400 font-bold text-xs">
                {freeSpinsAvailable > 0 ? `${freeSpinsAvailable} Lượt Free` : '0 Lượt (Làm đủ NV)'}
              </div>
              <div className="text-[9px] text-slate-500">Tặng khi đủ 15 nv ngày</div>
            </div>

            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <div className="text-slate-400 text-[10px]">🪙 Chi Phí Quay Bằng Xu</div>
              <div className="text-amber-300 font-bold text-xs">
                1.000 Xu / Lượt
              </div>
              <div className="text-[9px] text-slate-500">Tùy chọn tự nguyện</div>
            </div>
          </div>

          {/* Current Balance Bar */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Số dư của bạn:</span>
            </span>
            <span className="text-white font-bold">
              {user.avaliveCoins.toLocaleString()} Xu{' '}
              <span className="text-slate-400 text-[10px]">
                ({Math.floor(user.avaliveCoins / SPIN_COST)} lượt quay)
              </span>
            </span>
          </div>

          {/* Odds breakdown dropdown */}
          {showOddsDetails && (
            <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-1.5 text-[10px] font-mono animate-in fade-in duration-150">
              <div className="text-amber-300 font-bold">🎯 CƠ CẤU GIẢI THƯỞNG (100% NỔ QUÀ):</div>
              <div className="grid grid-cols-2 gap-1 text-slate-300">
                <div>• 500 Xu: <span className="text-amber-400 font-bold">40%</span></div>
                <div>• 1.000 Xu: <span className="text-emerald-400 font-bold">35%</span> (Hoàn vốn)</div>
                <div>• 2.000 Xu: <span className="text-purple-400 font-bold">15%</span> (Lãi x2)</div>
                <div>• Gói 50 Follow: <span className="text-neonGold font-bold">10%</span> (Jackpot)</div>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight pt-1">
                * Khi trúng Gói Follow: Tổng quà 5.000 Xu được cộng vào tài khoản và tự động quy đổi thành 50 Follower thật đẩy thẳng vào kênh TikTok (1 Follow = 100 Xu).
              </p>
            </div>
          )}
        </div>

        {/* Daily Mission Completion Status Banner */}
        <div className={`p-3 rounded-2xl border text-xs text-left space-y-2 transition-all ${
          isDailyCompleted 
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center justify-between font-mono font-bold">
            <span className="flex items-center gap-1.5">
              {isDailyCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              {isDailyCompleted ? 'ĐÃ HOÀN THÀNH NHIỆM VỤ HÔM NAY' : 'TIẾN ĐỘ NHẬN LƯỢT QUAY FREE'}
            </span>
            <span className="text-white">
              {user.dailyTasksCompleted}/{DAILY_TASK_GOAL} NV
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-500 ${
                isDailyCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(100, (user.dailyTasksCompleted / DAILY_TASK_GOAL) * 100)}%` }}
            />
          </div>

          {!isDailyCompleted ? (
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Thiếu {tasksRemaining} nv để nhận lượt Free (hoặc quay ngay bằng 1.000 Xu)</span>
              <button
                type="button"
                onClick={handleSimulateFinishDailyTasks}
                className="text-amber-400 hover:underline font-bold font-mono inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Làm 1 nv</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-300 font-mono">
              ✓ Hoàn thành 100% nhiệm vụ hôm nay! Nhận ngay 1 lượt quay miễn phí tri ân.
            </p>
          )}
        </div>

        {/* Wheel Disc Container */}
        <div className="relative mx-auto w-64 h-64 flex items-center justify-center my-2">
          {/* Wheel Pointer Pin at 12 o'clock */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-rose-500 drop-shadow-[0_4px_8px_rgba(244,63,94,0.6)]" />

          {/* Rotating Wheel Disc with 4 requested prizes */}
          <div 
            className="w-full h-full rounded-full border-4 border-amber-400 p-1 shadow-2xl shadow-amber-500/25 transition-all ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '4000ms' : '0ms'
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-purple-700 to-rose-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 divide-x divide-y divide-white/20 text-[10px] font-black text-white font-mono">
                {/* Quadrant 1: Top-Left -> 500 Xu (Target 45 deg) */}
                <div className="flex flex-col items-center justify-center p-2 bg-rose-500/15">
                  <Coins className="w-4 h-4 text-amber-300 mb-0.5" />
                  <span>500 Xu</span>
                  <span className="text-[8px] text-rose-300/80 font-normal">Tỷ lệ 40%</span>
                </div>

                {/* Quadrant 2: Top-Right -> 1,000 Xu (Target 315 deg) */}
                <div className="flex flex-col items-center justify-center p-2 bg-amber-500/15">
                  <Coins className="w-4 h-4 text-amber-300 mb-0.5" />
                  <span>1,000 Xu</span>
                  <span className="text-[8px] text-emerald-300/80 font-normal">Hoàn vốn (35%)</span>
                </div>

                {/* Quadrant 3: Bottom-Left -> 2,000 Xu (Target 135 deg) */}
                <div className="flex flex-col items-center justify-center p-2 bg-purple-500/15">
                  <Coins className="w-4 h-4 text-amber-300 mb-0.5" />
                  <span>2,000 Xu</span>
                  <span className="text-[8px] text-purple-300/80 font-normal">Lãi x2 (15%)</span>
                </div>

                {/* Quadrant 4: Bottom-Right -> Gói 50 Follow (5.000 Xu) (Target 225 deg) */}
                <div className="flex flex-col items-center justify-center p-2 bg-emerald-500/25 text-amber-300 font-bold">
                  <UserCheck className="w-4 h-4 text-emerald-400 mb-0.5" />
                  <span>Gói 50 Follow</span>
                  <span className="text-[8px] text-amber-300/90 font-normal">Jackpot 5K (10%)</span>
                </div>
              </div>

              {/* Center Hub */}
              <div className="z-10 w-16 h-16 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center shadow-lg">
                <Gift className="h-7 w-7 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Won Prize Celebration Notice */}
        {wonPrize && (
          <div className={`p-3.5 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1.5 animate-in zoom-in-95 ${
            wonPrize.isJackpot
              ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border-amber-400 text-amber-200'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-center gap-1.5 font-black text-sm text-white font-display">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>🎉 NỔ QUÀ THÀNH CÔNG: {wonPrize.text}!</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono text-center">
              {wonPrize.isJackpot ? (
                <>
                  Hệ thống đã tự động cộng <strong className="text-amber-300">+{wonPrize.coins.toLocaleString()} Xu</strong> vào ví và quy đổi thành <strong className="text-emerald-300">+{wonPrize.followers} Follower thật</strong> đẩy thẳng vào kênh TikTok của bạn!
                </>
              ) : (
                <>
                  Số tiền thưởng <strong className="text-amber-300">+{wonPrize.coins.toLocaleString()} Xu</strong> đã được cộng tự động và trực tiếp vào số dư ví của bạn!
                </>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Priority 1: Free Spin Button (if available) */}
          {freeSpinsAvailable > 0 && (
            <button
              onClick={() => handleSpin(true)}
              disabled={isSpinning}
              className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/30 hover:opacity-95 cursor-pointer font-display'
              }`}
            >
              {isSpinning ? (
                <span>Vòng quay đang quay...</span>
              ) : (
                <>
                  <Gift className="h-4 w-4" />
                  <span>QUAY MIỄN PHÍ (0 XU • CÒN {freeSpinsAvailable} LƯỢT)</span>
                </>
              )}
            </button>
          )}

          {/* Option 2: Spin using 1.000 Xu (Self-choice / Voluntary) */}
          <button
            onClick={() => handleSpin(false)}
            disabled={isSpinning || (!canAffordWithCoins && freeSpinsAvailable <= 0)}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
                : canAffordWithCoins
                ? freeSpinsAvailable > 0
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer font-display'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-black shadow-amber-500/25 hover:opacity-95 cursor-pointer font-display'
                : 'bg-slate-800 text-slate-500 border border-white/10 cursor-not-allowed'
            }`}
          >
            {isSpinning ? (
              <span>Vòng quay đang quay...</span>
            ) : canAffordWithCoins ? (
              <>
                <Coins className="h-4 w-4 fill-current" />
                <span>
                  {freeSpinsAvailable > 0 
                    ? 'Hoặc Quay Bằng 1.000 Xu (Tùy Chọn)' 
                    : 'QUAY NGAY BẰNG 1.000 XU (100% NỔ QUÀ)'}
                </span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Số Dư Không Đủ 1.000 Xu (Hiện Có {user.avaliveCoins.toLocaleString()} Xu)</span>
              </>
            )}
          </button>

          {/* Secondary Actions: Deposit if not enough coins + Share link for free spin */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {!canAffordWithCoins && freeSpinsAvailable <= 0 ? (
              <button
                onClick={() => {
                  closeLuckyWheel();
                  openDeposit();
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Nạp Xu Ngay</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateFinishDailyTasks}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                <span>+1 NV Ngày ({user.dailyTasksCompleted}/15)</span>
              </button>
            )}

            <button
              onClick={handleShareToGetSpin}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
              title="Chia sẻ link mời bạn bè để nhận thêm 1 lượt quay may mắn miễn phí"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Chia Sẻ Nhận 1 Lượt Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
