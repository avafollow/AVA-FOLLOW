import React, { useState, useMemo } from 'react';
import {
  Trophy, ChevronRight, Crown, CheckCircle2, Gift, Lock,
  UserPlus, Play, Heart, MessageSquare, Share2, Radio, Users,
  Flame, Sparkles, Star, TrendingUp, Check, Calendar, Award,
  Zap, Building2, Coins, Layers, Target, Clock, ShieldCheck,
  Compass, ArrowUpRight
} from 'lucide-react';
import { UserWeeklyMission, MissionType, MissionDifficulty } from '../../types';
import { RANK_MISSION_CONFIG, STREAK_REWARDS, TEN_TIERS_LIST, getRankTierConfig, getNextRankTier } from '../../data/weeklyMissions';
import { useTikTokApp } from '../../context/TikTokAppContext';

const TYPE_ICONS: Record<MissionType, React.ReactNode> = {
  follow:  <UserPlus className="w-4 h-4" />,
  watch:   <Play className="w-4 h-4" />,
  like:    <Heart className="w-4 h-4" />,
  comment: <MessageSquare className="w-4 h-4" />,
  share:   <Share2 className="w-4 h-4" />,
  live:    <Radio className="w-4 h-4" />,
  invite:  <Users className="w-4 h-4" />,
  profile: <Star className="w-4 h-4" />,
  post:    <Sparkles className="w-4 h-4" />,
  streak:  <Flame className="w-4 h-4" />,
};

const TYPE_COLORS: Record<MissionType, string> = {
  follow:  'text-rose-400   bg-rose-500/15   border-rose-500/30',
  watch:   'text-cyan-400   bg-cyan-500/15   border-cyan-500/30',
  like:    'text-pink-400   bg-pink-500/15   border-pink-500/30',
  comment: 'text-blue-400   bg-blue-500/15   border-blue-500/30',
  share:   'text-purple-400 bg-purple-500/15 border-purple-500/30',
  live:    'text-red-400    bg-red-500/15    border-red-500/30',
  invite:  'text-amber-400  bg-amber-500/15  border-amber-500/30',
  profile: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
  post:    'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  streak:  'text-orange-400 bg-orange-500/15 border-orange-500/30',
};

const DIFFICULTY_CONFIG: Record<MissionDifficulty, { label: string; bg: string; text: string; border: string }> = {
  easy:   { label: '🟢 DỄ',        bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  medium: { label: '🟡 TRUNG BÌNH', bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40' },
  hard:   { label: '🟠 KHÓ',       bg: 'bg-orange-500/20',  text: 'text-orange-300',  border: 'border-orange-500/40' },
  expert: { label: '🟣 CỰC KHÓ',   bg: 'bg-purple-500/20',  text: 'text-purple-300',  border: 'border-purple-500/40' },
};

export const WeeklyMissionsPanel: React.FC<{ darkMode?: boolean }> = () => {
  const { 
    user, 
    showToast, 
    openDeposit, 
    openFeedRunner,
    userMissions,
    missionStreak,
    claimAllCategoryMissions,
    claimMissionReward,
    claimSubMissionReward,
    claimStreakReward
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const currentTierCfg = getRankTierConfig(user.rankLevel);
  const nextTierCfg = getNextRankTier(user.rankLevel);
  const hasPkg = !!(user.myOrders && user.myOrders.length > 0);

  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const daysLeft = 8 - dayOfWeek;

  // Tính giờ còn lại tới 00:00 ngày mai
  const hoursLeftToday = 23 - now.getHours();
  const minutesLeftToday = 59 - now.getMinutes();

  const dailyMissions   = useMemo(() => userMissions.filter(m => m.category === 'daily'),   [userMissions]);
  const weeklyMissions  = useMemo(() => userMissions.filter(m => m.category === 'weekly'),  [userMissions]);
  const specialMissions = useMemo(() => userMissions.filter(m => m.category === 'special'), [userMissions]);

  // Daily Pool Stats
  const totalDailyPoolXu = useMemo(() => dailyMissions.reduce((s, m) => s + m.rewardXu, 0), [dailyMissions]);
  const dailyDoneCount = useMemo(() => dailyMissions.filter(m => m.completedCount >= m.targetCount).length, [dailyMissions]);
  const isDailyAllFinished = dailyMissions.length > 0 && dailyDoneCount === dailyMissions.length;
  const isDailyAllClaimed = dailyMissions.length > 0 && dailyMissions.every(m => m.status === 'claimed');

  // Weekly Pool Stats
  const totalWeeklyPoolXu = useMemo(() => weeklyMissions.reduce((s, m) => s + m.rewardXu, 0), [weeklyMissions]);
  const weeklyDoneCount = useMemo(() => weeklyMissions.filter(m => m.completedCount >= m.targetCount).length, [weeklyMissions]);
  const isWeeklyAllFinished = weeklyMissions.length > 0 && weeklyDoneCount === weeklyMissions.length;
  const isWeeklyAllClaimed = weeklyMissions.length > 0 && weeklyMissions.every(m => m.status === 'claimed');

  // Special Pool Stats
  const totalSpecialPoolXu = useMemo(() => specialMissions.reduce((s, m) => s + m.rewardXu, 0), [specialMissions]);
  const specialDoneCount = useMemo(() => specialMissions.filter(m => m.completedCount >= m.targetCount).length, [specialMissions]);
  const isSpecialAllFinished = specialMissions.length > 0 && specialDoneCount === specialMissions.length;
  const isSpecialAllClaimed = specialMissions.length > 0 && specialMissions.every(m => m.status === 'claimed');

  const currentCategoryMissions =
    activeTab === 'daily'  ? dailyMissions  :
    activeTab === 'weekly' ? weeklyMissions :
                             specialMissions;

  const currentPoolXu =
    activeTab === 'daily'  ? totalDailyPoolXu :
    activeTab === 'weekly' ? totalWeeklyPoolXu :
                             totalSpecialPoolXu;

  const currentDoneCount =
    activeTab === 'daily'  ? dailyDoneCount :
    activeTab === 'weekly' ? weeklyDoneCount :
                             specialDoneCount;

  const isCurrentAllFinished =
    activeTab === 'daily'  ? isDailyAllFinished :
    activeTab === 'weekly' ? isWeeklyAllFinished :
                             isSpecialAllFinished;

  const isCurrentAllClaimed =
    activeTab === 'daily'  ? isDailyAllClaimed :
    activeTab === 'weekly' ? isWeeklyAllClaimed :
                             isSpecialAllClaimed;

  const displayMissions = useMemo(() => {
    if (filterDifficulty === 'all') return currentCategoryMissions;
    return currentCategoryMissions.filter(m => m.difficulty === filterDifficulty);
  }, [currentCategoryMissions, filterDifficulty]);

  const totalClaimed   = userMissions.filter(m => m.status === 'claimed').reduce((s, m) => s + m.rewardXu, 0);
  const totalPending   = userMissions.filter(m => m.status === 'completed').reduce((s, m) => s + m.rewardXu, 0);
  const completedCount = userMissions.filter(m => m.status !== 'active').length;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0D111E] via-[#0A0D18] to-black border-2 border-rose-500/30 shadow-2xl overflow-hidden space-y-4">
      {/* 1. Header Banner */}
      <div className={`px-5 py-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-transparent border-b border-white/10`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-base font-black text-white uppercase font-display tracking-wider">
                HỆ THỐNG PHÂN BỔ NHIỆM VỤ SÀN (10 CẤP BẬC)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border border-amber-500/40 text-amber-300 bg-amber-950/30">
                {currentTierCfg.badge} • {currentTierCfg.shortTitle}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                Tuần #{weekNum % 52 + 1}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/30">
                Hệ số: ×{currentTierCfg.rewardMultiplier}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold border border-pink-500/30 flex items-center gap-1">
                🎡 Thưởng +{currentTierCfg.wheelSpinsBonus} Vòng Quay / chuỗi
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono text-[10px]">
                🏛️ DỮ LIỆU REALTIME TỪ TẤT CẢ CHIẾN DỊCH SÀN
              </span>
              <p className="text-[11px] text-slate-300">
                Tự động lọc &amp; phân bổ theo 10 cấp bậc • Hoàn thành 100% nhận Xu tổng + Tặng Lượt Quay May Mắn!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
            <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="font-black text-emerald-400">{completedCount}/{userMissions.length}</div>
              <div className="text-slate-400">Hoàn thành</div>
            </div>
            {totalClaimed > 0 && (
              <div className="text-center px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="font-black text-amber-400">+{totalClaimed.toLocaleString()}</div>
                <div className="text-slate-400">Xu đã nhận</div>
              </div>
            )}
            {totalPending > 0 && (
              <div className="text-center px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 animate-pulse">
                <div className="font-black text-purple-400">+{totalPending.toLocaleString()}</div>
                <div className="text-slate-300 font-bold">Chờ nhận Xu</div>
              </div>
            )}
          </div>
        </div>

        {/* Khối giải thích cơ chế dòng tiền & chỉ nhận thưởng tổng */}
        <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-amber-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-black font-mono uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>📋 HƯỚNG DẪN NHẬN THƯỞNG — {currentTierCfg.badge} {currentTierCfg.shortTitle}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
            {/* Bước 1 */}
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-emerald-400 font-black mb-1">① HOÀN THÀNH TỪNG CHẶNG NHỎ</div>
              <p className="text-slate-300 leading-relaxed">
                Mỗi nhiệm vụ chính gồm <strong>các chặng nhỏ</strong>. Làm xong từng chặng → bấm <strong>🎁 NHẬN NGAY +{currentTierCfg.subMissionRewardXu?.toLocaleString()} XU</strong> vào ví tức thì!
              </p>
            </div>
            {/* Bước 2 */}
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <div className="text-cyan-400 font-black mb-1">② THƯỞNG THÊM KHI XONG HẾT CHẶNG</div>
              <p className="text-slate-300 leading-relaxed">
                Hoàn thành <strong>TẤT CẢ chặng nhỏ</strong> của 1 nhiệm vụ chính → nhận thêm <strong>+{currentTierCfg.subMissionCompleteBonusXu?.toLocaleString()} Xu thưởng tất toán</strong> trực tiếp vào ví!
              </p>
            </div>
            {/* Bước 3 */}
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30">
              <div className="text-pink-400 font-black mb-1">③ THƯỞNG GÓI NGÀY (100%)</div>
              <p className="text-slate-300 leading-relaxed">
                Hoàn thành <strong>100% tất cả nhiệm vụ ngày</strong> → nhận thêm <strong>+{currentTierCfg.dailyBundleRewardXu.toLocaleString()} Xu</strong> + <strong>+{currentTierCfg.wheelSpinsBonus} lượt Vòng Quay May Mắn</strong> miễn phí!
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-[10px] font-mono">
            <span className="text-red-400 font-black">⚠️ LƯU Ý: </span>
            <span className="text-slate-300">Không hoàn thành hết chặng trong ngày → <strong className="text-red-300">KHÔNG nhận được Thưởng Gói Ngày</strong> và <strong className="text-red-300">KHÔNG có lượt Vòng Quay</strong>. Reset lúc 00:00 hàng ngày. Nhiệm vụ hết hạn sẽ không được tính!</span>
          </div>
        </div>

        {!hasPkg && (
          <button
            onClick={openDeposit}
            className="mt-3 w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600/30 via-purple-600/30 to-blue-600/30 border border-rose-500/40 text-xs font-mono text-rose-200 hover:bg-rose-600/40 transition-all flex items-center justify-between gap-2 cursor-pointer shadow-md"
          >
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <strong>Nâng cấp cấp bậc hoặc mua gói để mở thêm slot nhiệm vụ và nhân thưởng lên tới ×3.0!</strong>
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>

      {/* 2. KHỐI RƯƠNG THƯỞNG CHUỖI LIÊN TIẾP: NGÀY • TUẦN (7 NGÀY) • THÁNG (30 NGÀY) */}
      <div className="px-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#0E1324] to-indigo-950/30 border border-purple-500/30 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white uppercase font-display flex items-center gap-2">
                  RƯƠNG THƯỞNG CHUỖI LIÊN TIẾP (STREAK REWARDS)
                </h4>
                <p className="text-[10px] text-slate-400">
                  Hoàn thành chuỗi nhiệm vụ mỗi ngày để mở rương Xu siêu khủng!
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neonGold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Tổng thưởng chuỗi: +{(missionStreak.dailyBonusXu + missionStreak.weeklyBonusXu + missionStreak.monthlyBonusXu).toLocaleString()} Xu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Rương 1: Ngày */}
            <div className={`p-3 rounded-xl border transition-all space-y-2 ${
              missionStreak.isDailyAllClear ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-black/40 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">HOÀN TẤT TRONG NGÀY</span>
                </div>
                <span className="text-[10px] font-mono font-black text-emerald-400">+{missionStreak.dailyBonusXu.toLocaleString()} Xu</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Tiến độ ngày:</span>
                  <span>{missionStreak.dailyCompletedCount}/{missionStreak.dailyTotalCount} nhiệm vụ</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (missionStreak.dailyCompletedCount / Math.max(1, missionStreak.dailyTotalCount)) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => claimStreakReward('daily')}
                disabled={!missionStreak.isDailyAllClear || missionStreak.dailyBonusClaimed}
                className={`w-full py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  missionStreak.dailyBonusClaimed
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : missionStreak.isDailyAllClear
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:scale-[1.02] cursor-pointer animate-pulse'
                      : 'bg-white/5 text-slate-400 cursor-not-allowed'
                }`}
              >
                {missionStreak.dailyBonusClaimed ? '✓ Đã Mở Rương Ngày' : missionStreak.isDailyAllClear ? `🎁 MỞ RƯƠNG NGÀY (+${(missionStreak.dailyBonusXu / 1000).toFixed(0)}K XU)` : 'Chưa Hoàn Tất Ngày'}
              </button>
            </div>

            {/* Rương 2: 7 Ngày liên tiếp */}
            <div className={`p-3 rounded-xl border transition-all space-y-2 ${
              missionStreak.weeklyStreakDays >= 7 ? 'bg-amber-950/30 border-amber-500/50' : 'bg-black/40 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">CHUỖI 7 NGÀY TUẦN</span>
                </div>
                <span className="text-[10px] font-mono font-black text-amber-400">+{missionStreak.weeklyBonusXu.toLocaleString()} Xu</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Chuỗi ngày liên tiếp:</span>
                  <span>{missionStreak.weeklyStreakDays}/7 ngày</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (missionStreak.weeklyStreakDays / 7) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => claimStreakReward('weekly')}
                disabled={missionStreak.weeklyStreakDays < 7 || missionStreak.weeklyBonusClaimed}
                className={`w-full py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  missionStreak.weeklyBonusClaimed
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : missionStreak.weeklyStreakDays >= 7
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-md hover:scale-[1.02] cursor-pointer animate-pulse font-black'
                      : 'bg-white/5 text-slate-400 cursor-not-allowed'
                }`}
              >
                {missionStreak.weeklyBonusClaimed ? '✓ Đã Mở Rương Tuần' : missionStreak.weeklyStreakDays >= 7 ? `🏆 MỞ RƯƠNG TUẦN (+${(missionStreak.weeklyBonusXu / 1000).toFixed(0)}K XU)` : `Cần thêm ${Math.max(0, 7 - missionStreak.weeklyStreakDays)} ngày`}
              </button>
            </div>

            {/* Rương 3: 30 Ngày liên tiếp (Huyền thoại) */}
            <div className={`p-3 rounded-xl border transition-all space-y-2 ${
              missionStreak.monthlyStreakDays >= 30 ? 'bg-cyan-950/30 border-cyan-500/50' : 'bg-black/40 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">HUYỀN THOẠI 30 NGÀY</span>
                </div>
                <span className="text-[10px] font-mono font-black text-cyan-400">+{missionStreak.monthlyBonusXu.toLocaleString()} Xu</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Chuỗi cả tháng:</span>
                  <span>{missionStreak.monthlyStreakDays}/30 ngày</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (missionStreak.monthlyStreakDays / 30) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => claimStreakReward('monthly')}
                disabled={missionStreak.monthlyStreakDays < 30 || missionStreak.monthlyBonusClaimed}
                className={`w-full py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  missionStreak.monthlyBonusClaimed
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                    : missionStreak.monthlyStreakDays >= 30
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-[1.02] cursor-pointer animate-pulse font-black'
                      : 'bg-white/5 text-slate-400 cursor-not-allowed'
                }`}
              >
                {missionStreak.monthlyBonusClaimed ? '✓ Đã Mở Rương Tháng' : missionStreak.monthlyStreakDays >= 30 ? `💎 MỞ RƯƠNG THÁNG (+${(missionStreak.monthlyBonusXu >= 1000000 ? (missionStreak.monthlyBonusXu / 1000000).toFixed(1) + ' TRIỆU' : (missionStreak.monthlyBonusXu / 1000).toFixed(0) + 'K')} XU)` : `Cần thêm ${Math.max(0, 30 - missionStreak.monthlyStreakDays)} ngày`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MẸO ĐA TÁC VỤ ĐỒNG THỜI TRÊN 1 VIDEO */}
      <div className="px-4">
        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <div className="text-white font-bold flex items-center gap-1.5">
              <span>ĐA TÁC VỤ ĐỒNG THỜI TRÊN MỘT VIDEO (MULTI-TASK AUTO SYNC)</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px]">TỰ ĐỘNG NHẬN DIỆN</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Khi mở trình lướt video, bạn có thể <strong>xem 15s</strong>, <strong>thả tim</strong>, <strong>theo dõi kênh</strong>, <strong>bình luận</strong> và <strong>chia sẻ</strong> cùng một lúc trên một video. Hệ thống sẽ <strong>tự động nhận diện và cộng dồn tiến độ</strong> cho tất cả các nhiệm vụ tương ứng!
            </p>
          </div>
        </div>
      </div>

      {/* 4. CHUYỂN ĐỔI KHUNG: NGÀY (DAILY) vs TUẦN (WEEKLY) vs ĐẶC BIỆT (SPECIAL) */}
      <div className="px-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
          {/* Category Tabs: KHUNG NGÀY VS KHUNG TUẦN */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>📅 NHIỆM VỤ NGÀY</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
                {dailyDoneCount}/{dailyMissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>🏆 NHIỆM VỤ TUẦN</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
                {weeklyDoneCount}/{weeklyMissions.length}
              </span>
            </button>

            {specialMissions.length > 0 && (
              <button
                onClick={() => setActiveTab('special')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'special'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg ring-1 ring-purple-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>💎 ĐẶC BIỆT VIP</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
                  {specialDoneCount}/{specialMissions.length}
                </span>
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
            <span className="text-slate-400 pr-1">Độ khó:</span>
            {[
              { key: 'all',    label: 'TẤT CẢ' },
              { key: 'easy',   label: '🟢 DỄ' },
              { key: 'medium', label: '🟡 VỪA' },
              { key: 'hard',   label: '🟠 KHÓ' },
              { key: 'expert', label: '🟣 CỰC KHÓ' },
            ].map(df => (
              <button
                key={df.key}
                onClick={() => setFilterDifficulty(df.key as any)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterDifficulty === df.key
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-black/30 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. KHUNG NHIỆM VỤ ĐƯỢC CHỌN VỚI HERO BANNER QUYẾT TOÁN THƯỞNG TỔNG (ALL-OR-NOTHING POOL) */}
        <div className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-4 shadow-xl ${
          activeTab === 'daily'
            ? 'bg-gradient-to-b from-[#1b0a16] via-[#100713] to-[#0D111E] border-rose-500/40'
            : activeTab === 'weekly'
              ? 'bg-gradient-to-b from-[#1f1305] via-[#120b04] to-[#0D111E] border-amber-500/40'
              : 'bg-gradient-to-b from-[#170a24] via-[#0e0717] to-[#0D111E] border-purple-500/40'
        }`}>
          {/* Header Thông Tin Khung */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                  activeTab === 'daily' ? 'bg-rose-500' : activeTab === 'weekly' ? 'bg-amber-500' : 'bg-purple-500'
                }`}>
                  {activeTab === 'daily' ? <Calendar className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-wider flex items-center gap-2">
                    {activeTab === 'daily' && 'KHUNG NHIỆM VỤ HÀNG NGÀY (DAILY POOL)'}
                    {activeTab === 'weekly' && 'KHUNG NHIỆM VỤ TRONG TUẦN (WEEKLY POOL)'}
                    {activeTab === 'special' && 'KHUNG NHIỆM VỤ ĐẶC BIỆT DÀNH CHO VIP'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {activeTab === 'daily' && `Tự động reset và cấp danh sách nhiệm vụ mới sau: ${hoursLeftToday} giờ ${minutesLeftToday} phút (00:00 hàng ngày)`}
                    {activeTab === 'weekly' && `Chu kỳ tính theo tuần. Tự động reset và làm mới sau: ${daysLeft} ngày (Thứ Hai tuần tới)`}
                    {activeTab === 'special' && 'Dành riêng cho cấp bậc cao với số lượng chỉ tiêu lớn và thù lao siêu khủng.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quỹ Xu Tổng & Nút Nhận Thưởng 100% */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-black/60 border border-white/10 text-center sm:text-right">
                <div className="text-[10px] font-mono text-slate-400">
                  {activeTab === 'daily' ? 'TỔNG THU NHẬP NGÀY' : 'TỔNG QUỸ THƯỞNG XU'}
                </div>
                <div className="text-base sm:text-lg font-black text-neonGold font-mono">
                  +{activeTab === 'daily' ? currentTierCfg.dailyEstimatedEarningsXu.toLocaleString() : currentPoolXu.toLocaleString()} XU
                </div>
                <div className="text-[9px] font-mono text-pink-300 font-bold">
                  {activeTab === 'daily' 
                    ? `(NV: +${currentTierCfg.dailyTaskRewardTotal.toLocaleString()} + Gói: +${currentTierCfg.dailyBundleRewardXu.toLocaleString()} Xu)`
                    : `+ ${currentTierCfg.wheelSpinsBonus} Lượt Quay May Mắn`}
                </div>
              </div>

              {/* Nút Nhận Thưởng All-or-Nothing / Gộp Tất Toán */}
              {isCurrentAllFinished && !isCurrentAllClaimed ? (
                <button
                  onClick={() => claimAllCategoryMissions(activeTab)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs font-mono shadow-xl shadow-emerald-950/60 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/50 animate-pulse"
                >
                  <Gift className="w-5 h-5" />
                  <span>
                    {activeTab === 'daily' 
                      ? `🎁 TẤT TOÁN TRỌN GÓI NGÀY (+${currentTierCfg.dailyBundleRewardXu.toLocaleString()} XU & +${currentTierCfg.wheelSpinsBonus} VÒNG QUAY)`
                      : `🎁 NHẬN TRỌN BỘ +${currentPoolXu.toLocaleString()} XU & +${currentTierCfg.wheelSpinsBonus} VÒNG QUAY`}
                  </span>
                </button>
              ) : isCurrentAllClaimed ? (
                <div className="px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs font-mono flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>
                    {activeTab === 'daily'
                      ? `✓ ĐÃ TẤT TOÁN TRỌN GÓI NGÀY (+${currentTierCfg.dailyEstimatedEarningsXu.toLocaleString()} XU)`
                      : `✓ ĐÃ NHẬN TRỌN BỘ (+${currentPoolXu.toLocaleString()} XU & +${currentTierCfg.wheelSpinsBonus} LƯỢT QUAY)`}
                  </span>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-mono text-xs flex items-center justify-center gap-2 text-center">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Chưa hoàn tất (Còn {currentCategoryMissions.length - currentDoneCount} nhiệm vụ)</span>
                </div>
              )}
            </div>
          </div>

          {/* Thanh Tiến Độ Hoàn Thành Khung */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">
                Tiến độ chuỗi {activeTab === 'daily' ? 'ngày' : 'tuần'}: {currentDoneCount}/{currentCategoryMissions.length} nhiệm vụ đạt chỉ tiêu ({currentCategoryMissions.length > 0 ? Math.round((currentDoneCount / currentCategoryMissions.length) * 100) : 0}%)
              </span>
              <span className={`font-bold ${isCurrentAllFinished ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isCurrentAllFinished ? '✓ 100% ĐẠT CHỈ TIÊU' : `Cần hoàn thành thêm ${currentCategoryMissions.length - currentDoneCount} nhiệm vụ`}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCurrentAllFinished
                    ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 shadow-md shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400'
                }`}
                style={{ width: `${currentCategoryMissions.length > 0 ? Math.min(100, (currentDoneCount / currentCategoryMissions.length) * 100) : 0}%` }}
              />
            </div>
          </div>

          {/* Danh Sách Nhiệm Vụ Trong Khung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {displayMissions.length === 0 && (
              <div className="col-span-full py-10 text-center space-y-2">
                <Lock className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400 font-mono">
                  {activeTab === 'special' 
                    ? 'Nâng cấp lên hạng cao để mở kho nhiệm vụ đặc biệt!' 
                    : 'Không có nhiệm vụ nào trong bộ lọc này.'}
                </p>
              </div>
            )}

            {displayMissions.map((mission) => {
              const pct = mission.targetCount > 0 ? Math.round((mission.completedCount / mission.targetCount) * 100) : 0;
              const typeStyle = TYPE_COLORS[mission.type] || 'text-rose-400 bg-rose-500/15 border-rose-500/30';
              const diffCfg = DIFFICULTY_CONFIG[mission.difficulty] || DIFFICULTY_CONFIG.easy;
              const isClaimed = mission.status === 'claimed' || isCurrentAllClaimed;
              const isDone = mission.completedCount >= mission.targetCount;

              return (
                <div 
                  key={mission.defId} 
                  className={`relative rounded-2xl p-3.5 border transition-all space-y-3 ${
                    isClaimed 
                      ? 'bg-white/[0.02] border-white/5 opacity-60' 
                      : isDone    
                        ? 'bg-gradient-to-br from-emerald-950/40 via-black to-[#0C101B] border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40' 
                        : 'bg-[#0C101B] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black border ${diffCfg.bg} ${diffCfg.text} ${diffCfg.border}`}>
                        {diffCfg.label}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[9px]">
                        🏛️ Sàn Cấp
                      </span>
                    </div>

                    {isClaimed && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Đã Quyết Toán Xu
                      </div>
                    )}
                    {isDone && !isClaimed && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/60 flex items-center gap-1 animate-pulse shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> OK • ĐẠT CHỈ TIÊU
                      </div>
                    )}
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${typeStyle}`}>
                      {TYPE_ICONS[mission.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs font-bold text-white leading-tight">{mission.title}</span>
                        {mission.category === 'special' && <span className="text-[8px] px-1 py-px rounded bg-purple-500/20 text-purple-300 font-mono">VIP</span>}
                        {mission.category === 'weekly'  && <span className="text-[8px] px-1 py-px rounded bg-amber-500/20 text-amber-300 font-mono">TUẦN</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{mission.description}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold">
                        Tiến độ: {mission.completedCount}/{mission.targetCount} ({pct}%)
                      </span>
                      <span className="font-black text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Thù lao: +{mission.rewardXu.toLocaleString()} Xu
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 100 ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-sm' : 'bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Danh sách nhiệm vụ con / chặng nhỏ - Mỗi chặng có nút nhận xu riêng */}
                  {mission.subMilestones && mission.subMilestones.length > 0 && (
                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-slate-300">
                          <Target className="w-3 h-3 text-cyan-400" />
                          Chặng nhiệm vụ con:
                        </span>
                        <span className="text-slate-400">
                          {mission.subMilestones.filter(s => s.isDone && s.isClaimed).length}/{mission.subMilestones.length} đã nhận xu
                        </span>
                      </div>
                      <div className="space-y-1">
                        {mission.subMilestones.map((sub, sIdx) => {
                          const isLastSub = sIdx === mission.subMilestones!.length - 1;
                          const allPrevClaimed = sIdx === 0 || mission.subMilestones!.slice(0, sIdx).every(s => !s.isDone || s.isClaimed);
                          return (
                            <div key={sIdx} className={`rounded-xl p-2 border transition-all ${
                              sub.isClaimed
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : sub.isDone
                                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-400/30'
                                  : 'bg-black/30 border-white/5'
                            }`}>
                              <div className="flex items-center gap-2">
                                {sub.isClaimed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : sub.isDone ? (
                                  <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-500/50 shrink-0 flex items-center justify-center text-[8px] text-slate-500 font-bold">
                                    {sub.step}
                                  </div>
                                )}
                                <span className={`text-[9px] font-mono flex-1 truncate ${sub.isClaimed ? 'text-emerald-400' : sub.isDone ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                                  {sub.label}
                                  {isLastSub && !sub.isClaimed && <span className="ml-1 text-pink-400">(+{currentTierCfg.subMissionCompleteBonusXu?.toLocaleString()} Xu bonus!)</span>}
                                </span>
                                {sub.isClaimed ? (
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0">✓ +{sub.rewardXu.toLocaleString()}</span>
                                ) : sub.isDone && allPrevClaimed ? (
                                  <button
                                    onClick={() => claimSubMissionReward(mission.defId, sub.step)}
                                    className="shrink-0 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[9px] font-mono font-black hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400 animate-pulse"
                                  >
                                    🎁 +{isLastSub ? (sub.rewardXu + (currentTierCfg.subMissionCompleteBonusXu ?? 1000)).toLocaleString() : sub.rewardXu.toLocaleString()} Xu
                                  </button>
                                ) : !sub.isDone ? (
                                  <span className="text-[9px] font-mono text-slate-500 shrink-0">+{sub.rewardXu.toLocaleString()} Xu</span>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  <div>
                    {isDone && !isClaimed ? (
                      <button
                        onClick={() => claimMissionReward(mission.defId)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-mono font-black bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/50 animate-pulse"
                      >
                        <Gift className="w-4 h-4" />
                        <span>🎁 NHẬN NGAY +{mission.rewardXu.toLocaleString()} XU VÀO VÍ</span>
                      </button>
                    ) : isClaimed ? (
                      <div className="w-full py-2 rounded-xl text-[11px] font-mono text-center text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>✓ Đã nhận +{mission.rewardXu.toLocaleString()} Xu vào ví</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openFeedRunner('all')}
                        className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Thực Hiện Nhiệm Vụ ({mission.completedCount}/{mission.targetCount})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. BẢNG 10 CẤP BẬC THĂNG TIẾN TOÀN HỆ THỐNG */}
      <div className="px-4 pb-4 space-y-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="text-xs sm:text-sm font-mono font-black text-purple-300 flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-4 h-4 text-purple-400" /> BẢNG THU NHẬP 10 CẤP BẬC TỪ NHIỆM VỤ NGÀY
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Cấp 1 khởi đầu nhận trung bình <strong>100.000 Xu/ngày</strong> • Tăng dần đều qua 10 cấp lên tới <strong>1.200.000 Xu/ngày</strong> ở Cấp 10 (Huyền Thoại).
              </p>
            </div>
            {nextTierCfg && (
              <div className="px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>Cấp kế tiếp: <strong>{nextTierCfg.shortTitle}</strong> (Cần {nextTierCfg.minCompletedTasksToUnlock.toLocaleString()} NV • Bạn có: {user.completedTasksCount})</span>
              </div>
            )}
          </div>

          {/* Grid 10 Card Cấp Bậc Chi Tiết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {TEN_TIERS_LIST.map((tier) => {
              const isCurrent = currentTierCfg.tierNumber === tier.tierNumber;
              const isUnlocked = user.completedTasksCount >= tier.minCompletedTasksToUnlock;
              return (
                <div 
                  key={tier.name} 
                  className={`p-3.5 rounded-2xl border text-left transition-all space-y-2.5 relative flex flex-col justify-between ${
                    isCurrent 
                      ? 'bg-gradient-to-b from-rose-950/60 via-purple-950/40 to-[#0D111E] border-rose-500 shadow-xl shadow-rose-950/50 ring-2 ring-rose-400' 
                      : isUnlocked
                        ? 'bg-[#0D111E] border-white/15 hover:border-purple-500/40'
                        : 'bg-black/50 border-white/5 opacity-75'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white font-display">{tier.badge}</span>
                      {isCurrent ? (
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-black font-mono">BẠN ĐANG Ở ĐÂY</span>
                      ) : (
                        <span className="text-[9px] text-amber-300 font-mono font-black">Hệ số ×{tier.rewardMultiplier}</span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white font-mono leading-tight">
                        {tier.shortTitle}
                      </div>
                      {/* Thu nhập ngày nổi bật */}
                      <div className="mt-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <div className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Thu nhập trung bình/ngày:</div>
                        <div className="text-sm font-black font-mono text-emerald-300">
                          {tier.dailyEstimatedEarningsXu.toLocaleString()} Xu
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          ≈ {tier.dailyEstimatedEarningsXu.toLocaleString()} VNĐ/ngày
                        </div>
                      </div>
                    </div>

                    {/* Chi tiết thù lao + thưởng gói */}
                    <div className="space-y-1 text-[10px] font-mono bg-black/40 p-2 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>• Thù lao NV:</span>
                        <strong className="text-amber-300">+{tier.dailyTaskRewardTotal.toLocaleString()} Xu</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>• Thưởng gói ngày:</span>
                        <strong className="text-pink-300">+{tier.dailyBundleRewardXu.toLocaleString()} Xu</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>• Số NV ngày:</span>
                        <strong className="text-cyan-300">{tier.dailyMissionsCount} nhiệm vụ</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>• Vòng quay:</span>
                        <strong className="text-yellow-300">+{tier.wheelSpinsBonus} lượt</strong>
                      </div>
                    </div>

                    {/* Tóm tắt nhiệm vụ làm gì */}
                    <div className="text-[9px] text-slate-300 leading-snug line-clamp-3 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                      <strong className="text-purple-300">Nhiệm vụ:</strong> {tier.dailyTasksSummary}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Điều kiện lên cấp:</span>
                    <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {tier.minCompletedTasksToUnlock === 0 ? 'Mặc định' : `${tier.minCompletedTasksToUnlock.toLocaleString('vi-VN')} NV`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
