import { WeeklyMissionDef, WeeklyMissionConfig, UserWeeklyMission, MissionRank, MissionDifficulty } from '../types';

export const STREAK_REWARDS = {
  dailyAllClearBonus: 25000,
  weeklyStreakBonus: 200000,
  monthlyStreakBonus: 1000000,
};

// ===== KHO NHIỆM VỤ (Đa dạng DỄ -> TRUNG BÌNH -> KHÓ -> CHUYÊN GIA) =====
export const MISSION_POOL: WeeklyMissionDef[] = [
  // ---- DAILY MISSIONS (DỄ & TRUNG BÌNH) ----
  { id: 'daily_follow_3',    title: 'Theo Dõi 3 Kênh Mới',      description: 'Follow 3 kênh TikTok bất kỳ từ kho hệ thống sàn.',           category: 'daily',   type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 600,    targetCount: 3,   icon: '👤', tags: ['follow', 'dễ'] },
  { id: 'daily_follow_5',    title: 'Theo Dõi 5 Kênh Mới',      description: 'Follow 5 kênh TikTok chất lượng cao do sàn chỉ định.',       category: 'daily',   type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 1000,   targetCount: 5,   icon: '👥', tags: ['follow'] },
  { id: 'daily_follow_10',   title: 'Theo Dõi 10 Kênh',          description: 'Follow 10 kênh TikTok nhanh trong ngày.',                    category: 'daily',   type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Bạc',        baseRewardXu: 2000,   targetCount: 10,  icon: '🌟', tags: ['follow', 'trung bình'] },
  { id: 'daily_watch_5',     title: 'Xem 5 Video 15 Giây',       description: 'Xem đủ 15 giây 5 video sàn trên For You Page.',              category: 'daily',   type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 1000,   targetCount: 5,   icon: '🎬', tags: ['video', 'dễ'] },
  { id: 'daily_watch_10',    title: 'Xem 10 Video FYP',          description: 'Xem đủ 15 giây 10 video từ chiến dịch sàn cung cấp.',        category: 'daily',   type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 2000,   targetCount: 10,  icon: '📺', tags: ['video'] },
  { id: 'daily_watch_20',    title: 'Xem 20 Video Liên Tiếp',    description: 'Xem đủ 15 giây 20 video hệ thống, không ngắt quãng.',        category: 'daily',   type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 4000,   targetCount: 20,  icon: '🔥', tags: ['video', 'streak'] },
  { id: 'daily_like_10',     title: 'Thả Tim 10 Video',          description: 'Thả tim 10 video TikTok sàn cung cấp.',                      category: 'daily',   type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 1000,   targetCount: 10,  icon: '❤️', tags: ['tim'] },
  { id: 'daily_like_20',     title: 'Thả Tim 20 Video',          description: 'Thả tim 20 video TikTok trong ngày.',                        category: 'daily',   type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Bạc',        baseRewardXu: 2000,   targetCount: 20,  icon: '💖', tags: ['tim'] },
  { id: 'daily_comment_3',   title: 'Bình Luận 3 Video',         description: 'Để lại bình luận tích cực trên 3 video sàn.',                category: 'daily',   type: 'comment', difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 600,    targetCount: 3,   icon: '💬', tags: ['comment'] },
  { id: 'daily_comment_5',   title: 'Bình Luận 5 Video',         description: 'Để lại 5 bình luận chất lượng trên video hệ thống.',         category: 'daily',   type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Bạc',        baseRewardXu: 1000,   targetCount: 5,   icon: '🗣️', tags: ['comment'] },
  { id: 'daily_share_3',     title: 'Chia Sẻ 3 Video',           description: 'Chia sẻ 3 video TikTok của sàn ra ngoài.',                   category: 'daily',   type: 'share',   difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 720,    targetCount: 3,   icon: '📤', tags: ['share'] },
  { id: 'daily_share_5',     title: 'Chia Sẻ 5 Video',           description: 'Chia sẻ 5 video TikTok ra ngoài các nền tảng.',             category: 'daily',   type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Bạc',        baseRewardXu: 1200,   targetCount: 5,   icon: '🚀', tags: ['share'] },
  { id: 'daily_live_5m',     title: 'Xem Live 5 Phút',           description: 'Xem ít nhất 1 livestream liên tục 5 phút từ hệ thống.',      category: 'daily',   type: 'live',    difficulty: 'easy',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 500,    targetCount: 1,   icon: '📡', tags: ['live'] },
  { id: 'daily_live_15m',    title: 'Xem Live 15 Phút',          description: 'Xem 1 phiên livestream liên tục 15 phút từ sàn.',            category: 'daily',   type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Bạc',        baseRewardXu: 1300,   targetCount: 1,   icon: '🔴', tags: ['live'] },
  { id: 'daily_streak_3',    title: 'Duy Trì 3 Ngày Liên Tiếp', description: 'Đăng nhập và làm ít nhất 1 nhiệm vụ 3 ngày liên tục.',     category: 'daily',   type: 'streak',  difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 1500,   targetCount: 3,   icon: '⚡', tags: ['streak', 'bonus'] },
  { id: 'daily_invite_1',    title: 'Mời 1 Bạn Bè Mới',         description: 'Chia sẻ link giới thiệu, có 1 bạn đăng ký thành công.',     category: 'daily',   type: 'invite',  difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 5000,   targetCount: 1,   icon: '🎁', tags: ['invite', 'bonus'] },

  // ---- WEEKLY MISSIONS (TRUNG BÌNH & KHÓ) ----
  { id: 'weekly_follow_30',  title: 'Theo Dõi 30 Kênh Tuần',    description: 'Follow 30 kênh trong tuần từ kho hệ thống sàn.',             category: 'weekly',  type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 6000,   targetCount: 30,  icon: '🏆', tags: ['follow', 'tuần'] },
  { id: 'weekly_follow_50',  title: 'Theo Dõi 50 Kênh Tuần',    description: 'Follow 50 kênh trong tuần, phần thưởng hạng Bạc.',           category: 'weekly',  type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 10000,  targetCount: 50,  icon: '🥈', tags: ['follow', 'tuần'] },
  { id: 'weekly_follow_100', title: 'Follow Huyền Thoại 100',   description: 'Follow 100 kênh trong tuần, thử thách Vàng.',                category: 'weekly',  type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Vàng',       baseRewardXu: 20000,  targetCount: 100, icon: '💎', tags: ['follow', 'khó'] },
  { id: 'weekly_watch_100',  title: 'Xem 100 Video Trong Tuần', description: 'Xem đủ 15s 100 video trong 7 ngày từ sàn cung cấp.',       category: 'weekly',  type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 20000,  targetCount: 100, icon: '🎯', tags: ['video', 'tuần'] },
  { id: 'weekly_watch_200',  title: 'Marathon Xem 200 Video',   description: 'Xem 200 video trong tuần, danh hiệu Marathon Creator.',     category: 'weekly',  type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 40000,  targetCount: 200, icon: '🏅', tags: ['video', 'tuần', 'khó'] },
  { id: 'weekly_like_50',    title: 'Thả Tim 50 Video Tuần',    description: 'Thả tim 50 video hệ thống trong tuần.',                      category: 'weekly',  type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 5000,   targetCount: 50,  icon: '❤️🔥', tags: ['tim', 'tuần'] },
  { id: 'weekly_like_100',   title: 'Vua Thả Tim 100 Tim',      description: 'Thả tim 100 video trong tuần từ sàn cung cấp.',              category: 'weekly',  type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 10000,  targetCount: 100, icon: '👑', tags: ['tim', 'tuần'] },
  { id: 'weekly_comment_20', title: 'Seeding 20 Bình Luận',     description: 'Để lại 20 bình luận có giá trị trong tuần.',               category: 'weekly',  type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 4000,   targetCount: 20,  icon: '✍️', tags: ['comment', 'tuần'] },
  { id: 'weekly_comment_50', title: 'Chuyên Gia Seeding 50',    description: 'Để lại 50 bình luận chất lượng trong tuần.',              category: 'weekly',  type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 10000,  targetCount: 50,  icon: '🎖️', tags: ['comment', 'tuần'] },
  { id: 'weekly_share_20',   title: 'Lan Tỏa 20 Video',         description: 'Chia sẻ 20 video trong tuần ra ngoài.',                      category: 'weekly',  type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 4800,   targetCount: 20,  icon: '📣', tags: ['share', 'tuần'] },
  { id: 'weekly_share_50',   title: 'Đại Sứ Lan Tỏa 50 Share',  description: 'Chia sẻ 50 video ra ngoài trong tuần.',                    category: 'weekly',  type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 12000,  targetCount: 50,  icon: '🦅', tags: ['share', 'tuần'] },
  { id: 'weekly_live_60m',   title: 'Xem Live 60 Phút Tuần',    description: 'Xem tổng cộng 60 phút livestream trong tuần.',             category: 'weekly',  type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Đồng',       baseRewardXu: 4200,   targetCount: 60,  icon: '🎙️', tags: ['live', 'tuần'] },
  { id: 'weekly_live_180m',  title: 'Giữ Mắt 3 Giờ Live',       description: 'Xem tổng cộng 3 giờ livestream sàn trong tuần.',           category: 'weekly',  type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 12600,  targetCount: 180, icon: '🌐', tags: ['live', 'tuần'] },
  { id: 'weekly_streak_7',   title: 'Streak 7 Ngày Liên Tiếp',  description: 'Đăng nhập làm nhiệm vụ đủ 7 ngày liên tục trong tuần.',    category: 'weekly',  type: 'streak',  difficulty: 'hard',   source: 'platform', minRank: 'Đồng',       baseRewardXu: 10000,  targetCount: 7,   icon: '🔥', tags: ['streak', 'tuần'] },
  { id: 'weekly_invite_3',   title: 'Mời 3 Người Mới Tuần',     description: 'Mời 3 người đăng ký thành công trong tuần.',               category: 'weekly',  type: 'invite',  difficulty: 'hard',   source: 'platform', minRank: 'Bạc',        baseRewardXu: 15000,  targetCount: 3,   icon: '🤝', tags: ['invite', 'tuần'] },

  // ---- SPECIAL & EXPERT MISSIONS (VÀNG & KIM CƯƠNG • CỰC KHÓ) ----
  { id: 'special_follow_200',  title: 'Đại Chiến Follow 200',      description: 'Follow 200 kênh trong 7 ngày — chỉ dành cho hạng Vàng+.', category: 'special', type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Vàng',       baseRewardXu: 40000,  targetCount: 200, icon: '⚔️', tags: ['follow', 'khó', 'vàng'] },
  { id: 'special_watch_500',   title: 'Huyền Thoại 500 Video',     description: 'Xem 500 video trong tuần — chỉ dành cho Kim Cương.',     category: 'special', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Kim Cương',  baseRewardXu: 100000, targetCount: 500, icon: '💎', tags: ['video', 'kim cương'] },
  { id: 'special_live_300m',   title: 'Vua Livestream 5 Giờ',      description: 'Xem 5 giờ livestream trong tuần — Kim Cương.',            category: 'special', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Kim Cương',  baseRewardXu: 63000,  targetCount: 300, icon: '👁️', tags: ['live', 'kim cương'] },
  { id: 'special_comment_100', title: 'Seeding Chuyên Nghiệp',     description: 'Để lại 100 bình luận chất lượng trong tuần.',              category: 'special', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Vàng',       baseRewardXu: 20000,  targetCount: 100, icon: '🎙️', tags: ['comment', 'vàng'] },
  { id: 'special_invite_10',   title: 'Đại Lý Chiêu Mộ 10 Người', description: 'Mời 10 người đăng ký thành công trong tuần.',              category: 'special', type: 'invite',  difficulty: 'expert', source: 'platform', minRank: 'Vàng',       baseRewardXu: 50000,  targetCount: 10,  icon: '🌟', tags: ['invite', 'vàng'] },
];

// ===== CẤU HÌNH THEO RANK & PACKAGE =====
export const RANK_MISSION_CONFIG: WeeklyMissionConfig = {
  weekNumber: Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)),
  rankSlots: {
    'Đồng':       { dailyMissionsCount: 3,  weeklyMissionsCount: 2, rewardMultiplier: 1.0 },
    'Bạc':        { dailyMissionsCount: 5,  weeklyMissionsCount: 3, rewardMultiplier: 1.5 },
    'Vàng':       { dailyMissionsCount: 8,  weeklyMissionsCount: 5, rewardMultiplier: 2.0 },
    'Kim Cương':  { dailyMissionsCount: 12, weeklyMissionsCount: 7, rewardMultiplier: 3.0 },
  },
  // Bonus slots theo gói đã mua (key là category gói)
  packageBonusSlots: {
    'none':         0,
    'follow':       2,
    'engagement':   2,
    'watch':        2,
    'comment':      2,
    'share':        2,
    'combo':        4,
    'livestream':   5,
    'full_channel': 6,
  },
};

// ===== HÀM SINH NHIỆM VỤ TUẦN (seeded shuffle theo tuần + userId) =====
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = seededRandom(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateWeeklyMissions(
  rank: MissionRank,
  userId: string,
  hasPaidPackage: boolean,
  packageCategory?: string
): UserWeeklyMission[] {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const rankConfig = RANK_MISSION_CONFIG.rankSlots[rank];
  const multiplier = rankConfig.rewardMultiplier;

  // Package bonus slots
  const pkgKey = packageCategory || 'none';
  const bonusSlots = hasPaidPackage ? (RANK_MISSION_CONFIG.packageBonusSlots[pkgKey] ?? 2) : 0;
  const totalDailySlots = rankConfig.dailyMissionsCount + bonusSlots;
  const totalWeeklySlots = rankConfig.weeklyMissionsCount + Math.floor(bonusSlots / 2);

  // Rank hierarchy for filtering
  const rankOrder: Record<string, number> = { 'Đồng': 1, 'Bạc': 2, 'Vàng': 3, 'Kim Cương': 4 };
  const userRankOrder = rankOrder[rank];

  // Filter eligible missions
  const eligibleMissions = MISSION_POOL.filter(
    (m) => rankOrder[m.minRank] <= userRankOrder
  );

  // Separate daily, weekly, special
  const dailyPool   = eligibleMissions.filter(m => m.category === 'daily');
  const weeklyPool  = eligibleMissions.filter(m => m.category === 'weekly');
  const specialPool = eligibleMissions.filter(m => m.category === 'special');

  // Seeded shuffle based on (weekNum * 997 + userId hashcode)
  const userHash = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = (weekNum * 997 + userHash) >>> 0;

  const shuffledDaily   = shuffleWithSeed(dailyPool,   seed + 1);
  const shuffledWeekly  = shuffleWithSeed(weeklyPool,  seed + 2);
  const shuffledSpecial = shuffleWithSeed(specialPool, seed + 3);

  // Pick top N
  const pickedDaily   = shuffledDaily.slice(0, totalDailySlots);
  const pickedWeekly  = shuffledWeekly.slice(0, totalWeeklySlots);
  const pickedSpecial = hasPaidPackage ? shuffledSpecial.slice(0, Math.floor(bonusSlots / 3)) : [];

  // Week end timestamp (next Monday 00:00)
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const daysToMonday = 8 - dayOfWeek;
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + daysToMonday);
  weekEnd.setHours(0, 0, 0, 0);
  const weekEndIso = weekEnd.toISOString();

  const toUserMission = (def: WeeklyMissionDef): UserWeeklyMission => ({
    defId: def.id,
    title: def.title,
    description: def.description,
    type: def.type,
    category: def.category,
    difficulty: def.difficulty,
    source: 'platform',
    rewardXu: Math.round(def.baseRewardXu * multiplier),
    targetCount: def.targetCount,
    completedCount: 0,
    status: 'active',
    expiresAt: weekEndIso,
    icon: def.icon,
    tags: def.tags,
  });

  return [
    ...pickedDaily.map(toUserMission),
    ...pickedWeekly.map(toUserMission),
    ...pickedSpecial.map(toUserMission),
  ];
}
