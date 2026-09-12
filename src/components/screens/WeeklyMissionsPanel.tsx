import React, { useState, useMemo } from 'react';
import {
  Trophy, ChevronRight, Crown, CheckCircle2, Gift, Lock,
  UserPlus, Play, Heart, MessageSquare, Share2, Radio, Users,
  Flame, Sparkles, Star, TrendingUp, Check, Calendar, Award,
  Zap, Building2, Coins, Layers, Target, Clock, ShieldCheck
} from 'lucide-react';
import { UserWeeklyMission, MissionType, MissionDifficulty } from '../../types';
import { RANK_MISSION_CONFIG, STREAK_REWARDS } from '../../data/weeklyMissions';
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

const RANK_STYLE: Record<string, { badge: string; bg: string; border: string; text: string; tierDesc: string }> = {
  'Dong':      { badge: '🥉 Đồng (Tài khoản Mới)',     bg: 'from-orange-950/40', border: 'border-orange-500/30', text: 'text-orange-300', tierDesc: 'Nhiệm vụ cơ bản, dễ làm quen' },
  'Bac':       { badge: '🥈 Bạc (Hoạt Động Đều)',      bg: 'from-slate-800/60',  border: 'border-slate-400/40',  text: 'text-slate-300',  tierDesc: 'Nhiệm vụ tương tác nâng cao' },
  'Vang':      { badge: '🥇 Vàng (Chuyên Nghiệp)',     bg: 'from-amber-950/50',  border: 'border-amber-500/40',  text: 'text-amber-300',  tierDesc: 'Nhiệm vụ số lượng lớn & Seeding' },
  'Kim Cuong': { badge: '💎 Kim Cương (VIP Cấp Cao)', bg: 'from-cyan-950/50',   border: 'border-cyan-400/40',   text: 'text-cyan-300',   tierDesc: 'Nhiệm vụ Marathon thưởng tới 100K Xu' },
};

function getRankKey(rank: string): string {
  if (rank === 'Đồng') return 'Dong';
  if (rank === 'Bạc') return 'Bac';
  if (rank === 'Vàng') return 'Vang';
  return 'Kim Cuong';
}

export const WeeklyMissionsPanel: React.FC<{ darkMode?: boolean }> = () => {
  const { 
    user, 
    showToast, 
    openDeposit, 
    openFeedRunner,
    userMissions,
    missionStreak,
    recordMissionProgress,
    claimMissionReward,
    claimStreakReward
  } = useTikTokApp();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const rankCfg = RANK_MISSION_CONFIG.rankSlots[user.rankLevel];
  const hasPkg = !!(user.myOrders && user.myOrders.length > 0);
  const pkgBonus = hasPkg ? (RANK_MISSION_CONFIG.packageBonusSlots[user.myOrders?.[0]?.category || 'combo'] || 2) : 0;
  const rKey = getRankKey(user.rankLevel);
  const rStyle = RANK_STYLE[rKey] || RANK_STYLE['Dong'];

  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const daysLeft = 8 - dayOfWeek;

  const dailyMissions   = useMemo(() => userMissions.filter(m => m.category === 'daily'),   [userMissions]);
  const weeklyMissions  = useMemo(() => userMissions.filter(m => m.category === 'weekly'),  [userMissions]);
  const specialMissions = useMemo(() => userMissions.filter(m => m.category === 'special'), [userMissions]);

  const currentCategoryMissions =
    activeTab === 'daily'  ? dailyMissions  :
    activeTab === 'weekly' ? weeklyMissions :
                             specialMissions;

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
      <div className={`px-5 py-4 bg-gradient-to-r ${rStyle.bg} to-transparent border-b border-white/10`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-base font-black text-white uppercase font-display tracking-wider">
                HỆ THỐNG NHIỆM VỤ SÀN CẤP
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${rStyle.border} ${rStyle.text} bg-black/40`}>
                {rStyle.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                Tuần #{weekNum % 52 + 1}
              </span>
            </div>
            
            {/* Phân biệt rạch ròi nhiệm vụ sàn vs chiến dịch đối tác vs follow chéo */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono text-[10px]">
                🏛️ CHIẾN DỊCH ĐỘC QUYỀN SÀN AVALIVE
              </span>
              <p className="text-[11px] text-slate-300">
                Chỉ tính khi xem & tương tác các kênh hệ thống sàn cấp • Thưởng Xu nhận thẳng vào ví • Còn <strong className="text-rose-400">{daysLeft} ngày</strong> reset
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
        <div className="mt-3 p-3 rounded-2xl bg-black/50 border border-amber-500/30 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 font-black font-mono uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>QUY TẮC NHIỆM VỤ DỰ ÁN: CHỈ NHẬN THƯỞNG XU TỔNG KHI HOÀN THÀNH 100% NHIỆM VỤ</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            • <strong>Nguồn nhiệm vụ từ đâu?</strong> Hệ thống lấy kênh & video từ các thành viên có nhu cầu cần follow/view/tim trên sàn đưa vào danh sách nhiệm vụ.<br />
            • <strong>Cơ chế trả thưởng:</strong> Khi bạn thực hiện từng thao tác (follow, tim, cmt, share), <strong className="text-rose-400">KHÔNG CỘNG XU LẺ TỪNG TÁC VỤ</strong>. Toàn bộ tiền từ người cần follow được nạp sẽ <strong className="text-amber-300">đẩy về Sàn & Dự Án</strong>.<br />
            • <strong>Sàn trả thưởng tổng:</strong> Khi bạn làm <strong>đủ 100% số lượng chỉ tiêu</strong> của nhiệm vụ, bạn bấm <strong className="text-emerald-400">[BẤM HOÀN THÀNH]</strong> để nhận trọn vẹn <strong className="text-neonGold">SỐ XU TỔNG</strong> từ quỹ Sàn cấp, đồng thời được <strong>tích điểm nâng cấp bậc tài khoản</strong> để mở khóa nhiều quyền lợi và đề xuất nhận thêm chiến dịch lớn!
          </p>
        </div>

        {!hasPkg && (
          <button
            onClick={openDeposit}
            className="mt-3 w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600/30 via-purple-600/30 to-blue-600/30 border border-rose-500/40 text-xs font-mono text-rose-200 hover:bg-rose-600/40 transition-all flex items-center justify-between gap-2 cursor-pointer shadow-md"
          >
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <strong>Nâng cấp cấp bậc hoặc mua gói để mở thêm slot nhiệm vụ và nhân thưởng x1.5 – x3.0!</strong>
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
              Tổng thưởng chuỗi: +1.225.000 Xu
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
                {missionStreak.dailyBonusClaimed ? '✓ Đã Mở Rương Ngày' : missionStreak.isDailyAllClear ? '🎁 MỞ RƯƠNG NGÀY (+25K XU)' : 'Chưa Hoàn Tất Ngày'}
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
                {missionStreak.weeklyBonusClaimed ? '✓ Đã Mở Rương Tuần' : missionStreak.weeklyStreakDays >= 7 ? '🏆 MỞ RƯƠNG TUẦN (+200K XU)' : `Cần thêm ${Math.max(0, 7 - missionStreak.weeklyStreakDays)} ngày`}
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
                {missionStreak.monthlyBonusClaimed ? '✓ Đã Mở Rương Tháng' : missionStreak.monthlyStreakDays >= 30 ? '💎 MỞ RƯƠNG THÁNG (+1 TRIỆU XU)' : `Cần thêm ${Math.max(0, 30 - missionStreak.monthlyStreakDays)} ngày`}
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

      {/* 4. Bộ Lọc Tabs & Độ Khó (DỄ -> TRUNG BÌNH -> KHÓ -> CỰC KHÓ) */}
      <div className="px-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10">
            {([
              { key: 'daily',   label: '📅 Hàng Ngày', count: dailyMissions.length  },
              { key: 'weekly',  label: '🏆 Tuần Này',  count: weeklyMissions.length  },
              { key: 'special', label: '💎 Đặc Biệt',  count: specialMissions.length },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px]">{tab.count}</span>
              </button>
            ))}
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
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
      </div>

      {/* 5. Mission Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayMissions.length === 0 && (
          <div className="col-span-full py-10 text-center space-y-2">
            <Lock className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs text-slate-400 font-mono">
              {activeTab === 'special' 
                ? 'Nâng cấp lên hạng Vàng hoặc Kim Cương để mở kho nhiệm vụ đặc biệt!' 
                : 'Không có nhiệm vụ nào trong bộ lọc này.'}
            </p>
          </div>
        )}

        {displayMissions.map((mission) => {
          const pct = mission.targetCount > 0 ? Math.round((mission.completedCount / mission.targetCount) * 100) : 0;
          const typeStyle = TYPE_COLORS[mission.type] || 'text-rose-400 bg-rose-500/15 border-rose-500/30';
          const diffCfg = DIFFICULTY_CONFIG[mission.difficulty] || DIFFICULTY_CONFIG.easy;
          const isClaimed = mission.status === 'claimed';
          const isDone    = mission.status === 'completed';

          return (
            <div 
              key={mission.defId} 
              className={`relative rounded-2xl p-3.5 border transition-all space-y-3 ${
                isClaimed 
                  ? 'bg-white/[0.02] border-white/5 opacity-55' 
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
                    <Check className="w-3 h-3" /> Đã Nhận Xu
                  </div>
                )}
                {isDone && !isClaimed && (
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-black border border-emerald-500/60 flex items-center gap-1 animate-pulse shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> OK • HOÀN THÀNH
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
                    Thưởng Tổng: +{mission.rewardXu.toLocaleString()} Xu (Đủ 100%)
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

              {/* Action button: Bấm hoàn thành để nhận Xu riêng từng nhiệm vụ */}
              <div>
                {isDone && !isClaimed ? (
                  <button
                    onClick={() => claimMissionReward(mission.defId)}
                    className="w-full py-2 rounded-xl text-xs font-black font-mono bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-900/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/40 animate-pulse"
                  >
                    <Gift className="w-4 h-4" />
                    <span>BẤM HOÀN THÀNH (+{mission.rewardXu.toLocaleString()} XU)</span>
                  </button>
                ) : isClaimed ? (
                  <div className="w-full py-1.5 rounded-xl text-[11px] font-mono text-center text-slate-500 bg-white/[0.03] border border-white/5">
                    ✓ Đã nhận +{mission.rewardXu.toLocaleString()} Xu vào ví
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      onClick={openFeedRunner}
                      className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Thực Hiện Tương Tác Kênh Ngay</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Cấp Bậc Tài Khoản & Lợi Ích Nhân Xu */}
      <div className="px-4 pb-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 space-y-2">
          <div className="text-[11px] font-mono font-bold text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" /> PHÂN CẤP BẬC TÀI KHOẢN & HỆ SỐ THƯỞNG XU
            </span>
            <span className="text-[10px] text-slate-400">Cấp bậc càng cao, nhiệm vụ càng khó, tiền thưởng càng nhiều!</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Đồng', 'Bạc', 'Vàng', 'Kim Cương'] as const).map(rank => {
              const cfg = RANK_MISSION_CONFIG.rankSlots[rank];
              const isCurrent = rank === user.rankLevel;
              return (
                <div 
                  key={rank} 
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isCurrent 
                      ? 'bg-rose-500/20 border-rose-500/50 shadow-md ring-1 ring-rose-400' 
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-white">{rank}</span>
                    {isCurrent && <span className="text-[8px] px-1 rounded bg-rose-500 text-white font-bold">BẠN</span>}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-bold pt-0.5">
                    {cfg.dailyMissionsCount} ngày + {cfg.weeklyMissionsCount} tuần
                  </div>
                  <div className="text-[9px] text-amber-300 font-mono font-bold">
                    Hệ số: ×{cfg.rewardMultiplier} Thưởng
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
