import { WeeklyMissionDef, WeeklyMissionConfig, UserWeeklyMission, MissionRank, MissionDifficulty, RankTierConfig } from '../types';

export const STREAK_REWARDS = {
  dailyAllClearBonus: 35000,
  weeklyStreakBonus: 350000,
  monthlyStreakBonus: 2000000,
};

// ===== CẤU HÌNH 10 CẤP BẬC THĂNG TIẾN TOÀN DIỆN (10 Rank Tiers System) =====
export const TEN_TIER_CONFIG: Record<string, RankTierConfig> = {
  'Cấp 1 - Tập Sự': {
    tierNumber: 1,
    name: 'Cấp 1 - Tập Sự',
    shortTitle: 'Tập Sự (Đồng I)',
    badge: '🥉 Cấp 1',
    color: 'border-orange-500/40 text-orange-300 bg-orange-950/20',
    dailyMissionsCount: 5,
    weeklyMissionsCount: 3,
    rewardMultiplier: 1.0,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 0,
    dailyEstimatedEarningsXu: 100000,
    dailyTaskRewardTotal: 65000,
    dailyBundleRewardXu: 35000,
    dailyTasksSummary: 'Lướt 5 video FYP (15s), follow 3 kênh đối soát, thả tim 5 video, bình luận 2 video, xem live 3 phút',
    description: 'Cấp khởi đầu cho mọi người mới: Hoàn thành 5 nhiệm vụ ngày nhận trung bình 100.000 Xu (≈100k VNĐ/ngày).'
  },
  'Cấp 2 - Khởi Nghiệp': {
    tierNumber: 2,
    name: 'Cấp 2 - Khởi Nghiệp',
    shortTitle: 'Khởi Nghiệp (Đồng II)',
    badge: '🥉 Cấp 2',
    color: 'border-amber-600/40 text-amber-300 bg-amber-950/20',
    dailyMissionsCount: 6,
    weeklyMissionsCount: 3,
    rewardMultiplier: 1.15,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 20,
    dailyEstimatedEarningsXu: 130000,
    dailyTaskRewardTotal: 85000,
    dailyBundleRewardXu: 45000,
    dailyTasksSummary: 'Lướt 8 video, follow 5 kênh, thả tim 10 video, bình luận 3 video, xem live 5 phút, chia sẻ 1 video',
    description: 'Thăng hạng khi tích lũy 20 nhiệm vụ: 6 nhiệm vụ ngày, kiếm trung bình 130.000 Xu/ngày.'
  },
  'Cấp 3 - Năng Động': {
    tierNumber: 3,
    name: 'Cấp 3 - Năng Động',
    shortTitle: 'Năng Động (Bạc I)',
    badge: '🥈 Cấp 3',
    color: 'border-slate-400/40 text-slate-200 bg-slate-800/30',
    dailyMissionsCount: 7,
    weeklyMissionsCount: 4,
    rewardMultiplier: 1.3,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 50,
    dailyEstimatedEarningsXu: 170000,
    dailyTaskRewardTotal: 110000,
    dailyBundleRewardXu: 60000,
    dailyTasksSummary: 'Lướt 12 video, follow 8 kênh, thả tim 15 video, bình luận 5 video, xem live 10 phút, chia sẻ 3 video',
    description: 'Thăng hạng khi tích lũy 50 nhiệm vụ: 7 nhiệm vụ ngày, kiếm trung bình 170.000 Xu/ngày.'
  },
  'Cấp 4 - Tương Tác': {
    tierNumber: 4,
    name: 'Cấp 4 - Tương Tác',
    shortTitle: 'Tương Tác (Bạc II)',
    badge: '🥈 Cấp 4',
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20',
    dailyMissionsCount: 8,
    weeklyMissionsCount: 4,
    rewardMultiplier: 1.5,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 100,
    dailyEstimatedEarningsXu: 220000,
    dailyTaskRewardTotal: 140000,
    dailyBundleRewardXu: 80000,
    dailyTasksSummary: 'Lướt 15 video liên tiếp, follow 10 kênh, thả tim 20 video, bình luận 6 video, xem live 15 phút, chia sẻ 5 video',
    description: 'Thăng hạng khi tích lũy 100 nhiệm vụ: 8 nhiệm vụ ngày, kiếm trung bình 220.000 Xu/ngày.'
  },
  'Cấp 5 - Tiên Phong': {
    tierNumber: 5,
    name: 'Cấp 5 - Tiên Phong',
    shortTitle: 'Tiên Phong (Vàng I)',
    badge: '🥇 Cấp 5',
    color: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20',
    dailyMissionsCount: 9,
    weeklyMissionsCount: 5,
    rewardMultiplier: 1.75,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 200,
    dailyEstimatedEarningsXu: 290000,
    dailyTaskRewardTotal: 185000,
    dailyBundleRewardXu: 105000,
    dailyTasksSummary: 'Lướt 20 video, follow 15 kênh VIP, thả tim 25 video, bình luận seeding 8 video, xem live 20 phút, chia sẻ 8 video',
    description: 'Thăng hạng khi tích lũy 200 nhiệm vụ: 9 nhiệm vụ ngày, kiếm trung bình 290.000 Xu/ngày + 2 Vòng quay.'
  },
  'Cấp 6 - Chuyên Nghiệp': {
    tierNumber: 6,
    name: 'Cấp 6 - Chuyên Nghiệp',
    shortTitle: 'Chuyên Nghiệp (Vàng II)',
    badge: '🥇 Cấp 6',
    color: 'border-amber-400/40 text-amber-300 bg-amber-950/30',
    dailyMissionsCount: 10,
    weeklyMissionsCount: 5,
    rewardMultiplier: 2.0,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 350,
    dailyEstimatedEarningsXu: 380000,
    dailyTaskRewardTotal: 240000,
    dailyBundleRewardXu: 140000,
    dailyTasksSummary: 'Lướt 25 video, follow 20 kênh Creator, thả tim 35 video, bình luận chuyên sâu 10 video, xem live 30 phút, chia sẻ 10 video',
    description: 'Thăng hạng khi tích lũy 350 nhiệm vụ: 10 nhiệm vụ ngày, kiếm trung bình 380.000 Xu/ngày + 2 Vòng quay.'
  },
  'Cấp 7 - Tinh Anh': {
    tierNumber: 7,
    name: 'Cấp 7 - Tinh Anh',
    shortTitle: 'Tinh Anh (Bạch Kim I)',
    badge: '💠 Cấp 7',
    color: 'border-blue-400/40 text-blue-300 bg-blue-950/30',
    dailyMissionsCount: 11,
    weeklyMissionsCount: 6,
    rewardMultiplier: 2.3,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 600,
    dailyEstimatedEarningsXu: 500000,
    dailyTaskRewardTotal: 320000,
    dailyBundleRewardXu: 180000,
    dailyTasksSummary: 'Lướt 30 video chiến dịch, follow 25 kênh, thả tim 45 video, bình luận 12 video, xem live 35 phút, chia sẻ 15 video',
    description: 'Thăng hạng khi tích lũy 600 nhiệm vụ: 11 nhiệm vụ ngày, kiếm trung bình 500.000 Xu/ngày (500k VNĐ).'
  },
  'Cấp 8 - Thủ Lĩnh': {
    tierNumber: 8,
    name: 'Cấp 8 - Thủ Lĩnh',
    shortTitle: 'Thủ Lĩnh (Bạch Kim II)',
    badge: '💠 Cấp 8',
    color: 'border-indigo-400/40 text-indigo-300 bg-indigo-950/30',
    dailyMissionsCount: 12,
    weeklyMissionsCount: 6,
    rewardMultiplier: 2.6,
    wheelSpinsBonus: 3,
    minCompletedTasksToUnlock: 1000,
    dailyEstimatedEarningsXu: 650000,
    dailyTaskRewardTotal: 420000,
    dailyBundleRewardXu: 230000,
    dailyTasksSummary: 'Lướt 40 video, follow 30 kênh, thả tim 60 video, bình luận 15 video, giữ mắt live 45 phút, chia sẻ 20 video',
    description: 'Thăng hạng khi tích lũy 1.000 nhiệm vụ: 12 nhiệm vụ ngày, kiếm trung bình 650.000 Xu/ngày + 3 Vòng quay.'
  },
  'Cấp 9 - Cao Thủ': {
    tierNumber: 9,
    name: 'Cấp 9 - Cao Thủ',
    shortTitle: 'Cao Thủ (Kim Cương I)',
    badge: '💎 Cấp 9',
    color: 'border-purple-400/40 text-purple-300 bg-purple-950/30',
    dailyMissionsCount: 14,
    weeklyMissionsCount: 7,
    rewardMultiplier: 3.0,
    wheelSpinsBonus: 3,
    minCompletedTasksToUnlock: 1500,
    dailyEstimatedEarningsXu: 850000,
    dailyTaskRewardTotal: 550000,
    dailyBundleRewardXu: 300000,
    dailyTasksSummary: 'Marathon 50 video, follow 40 kênh lớn, thả tim 80 video, bình luận 20 video, giữ mắt live 60 phút, chia sẻ 25 video',
    description: 'Thăng hạng khi tích lũy 1.500 nhiệm vụ: 14 nhiệm vụ ngày, kiếm trung bình 850.000 Xu/ngày + 3 Vòng quay.'
  },
  'Cấp 10 - Huyền Thoại': {
    tierNumber: 10,
    name: 'Cấp 10 - Huyền Thoại',
    shortTitle: 'Huyền Thoại (Kim Cương VIP)',
    badge: '👑 Cấp 10',
    color: 'border-pink-500/50 text-pink-300 bg-gradient-to-r from-pink-950/40 to-purple-950/40',
    dailyMissionsCount: 16,
    weeklyMissionsCount: 8,
    rewardMultiplier: 3.5,
    wheelSpinsBonus: 5,
    minCompletedTasksToUnlock: 2500,
    dailyEstimatedEarningsXu: 1200000,
    dailyTaskRewardTotal: 750000,
    dailyBundleRewardXu: 450000,
    dailyTasksSummary: 'Đại đội 60 video FYP, follow 50 kênh đối tác VIP, thả tim 100 video, bình luận 25 video, giữ mắt live 90 phút, chia sẻ 30 video',
    description: 'CẤP BẬC CAO NHẤT (Đạt 2.500 nhiệm vụ): 16 nhiệm vụ ngày, kiếm trên 1.200.000 Xu/ngày (1.2 triệu VNĐ/ngày) + 5 Vòng quay!'
  }
};

export const TEN_TIERS_LIST: RankTierConfig[] = Object.values(TEN_TIER_CONFIG);

export function getRankTierConfig(rank: string = 'Đồng'): RankTierConfig {
  if (!rank) return TEN_TIER_CONFIG['Cấp 1 - Tập Sự'];
  if (rank.includes('10') || rank === 'Kim Cương') return TEN_TIER_CONFIG['Cấp 10 - Huyền Thoại'];
  if (rank.includes('9')) return TEN_TIER_CONFIG['Cấp 9 - Cao Thủ'];
  if (rank.includes('8')) return TEN_TIER_CONFIG['Cấp 8 - Thủ Lĩnh'];
  if (rank.includes('7')) return TEN_TIER_CONFIG['Cấp 7 - Tinh Anh'];
  if (rank.includes('6') || rank === 'Vàng') return TEN_TIER_CONFIG['Cấp 6 - Chuyên Nghiệp'];
  if (rank.includes('5')) return TEN_TIER_CONFIG['Cấp 5 - Tiên Phong'];
  if (rank.includes('4')) return TEN_TIER_CONFIG['Cấp 4 - Tương Tác'];
  if (rank.includes('3') || rank === 'Bạc') return TEN_TIER_CONFIG['Cấp 3 - Năng Động'];
  if (rank.includes('2')) return TEN_TIER_CONFIG['Cấp 2 - Khởi Nghiệp'];
  if (rank.includes('1') || rank === 'Đồng') return TEN_TIER_CONFIG['Cấp 1 - Tập Sự'];
  return TEN_TIER_CONFIG['Cấp 1 - Tập Sự'];
}

export function getNextRankTier(rank: string): RankTierConfig | null {
  const current = getRankTierConfig(rank);
  const nextNum = current.tierNumber + 1;
  const next = TEN_TIERS_LIST.find(t => t.tierNumber === nextNum);
  return next || null;
}

export function getRankByTaskCount(count: number): RankTierConfig {
  for (let i = TEN_TIERS_LIST.length - 1; i >= 0; i--) {
    if (count >= TEN_TIERS_LIST[i].minCompletedTasksToUnlock) {
      return TEN_TIERS_LIST[i];
    }
  }
  return TEN_TIERS_LIST[0];
}

// ===== KHO NHIỆM VỤ PHÂN BỔ THEO 10 CẤP BẬC =====
export const MISSION_POOL: WeeklyMissionDef[] = [
  // ---- DAILY MISSIONS (CẤP 1 -> CẤP 4: DỄ & TRUNG BÌNH) ----
  { id: 'daily_follow_3',    title: 'Theo Dõi 3 Kênh Mới',       description: 'Follow 3 kênh TikTok bất kỳ từ kho hệ thống sàn.',           category: 'daily',   type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 13000,  targetCount: 3,   icon: '👤', tags: ['follow', 'dễ'] },
  { id: 'daily_follow_5',    title: 'Theo Dõi 5 Kênh Mới',       description: 'Follow 5 kênh TikTok chất lượng cao do sàn chỉ định.',       category: 'daily',   type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 15000,  targetCount: 5,   icon: '👥', tags: ['follow'] },
  { id: 'daily_watch_5',     title: 'Xem 5 Video 15 Giây',        description: 'Xem đủ 15 giây 5 video sàn trên For You Page.',              category: 'daily',   type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 13000,  targetCount: 5,   icon: '🎬', tags: ['video', 'dễ'] },
  { id: 'daily_like_10',     title: 'Thả Tim 10 Video',           description: 'Thả tim 10 video TikTok sàn cung cấp.',                      category: 'daily',   type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 12000,  targetCount: 10,  icon: '❤️', tags: ['tim'] },
  { id: 'daily_comment_3',   title: 'Bình Luận 3 Video',          description: 'Để lại bình luận tích cực trên 3 video sàn.',                category: 'daily',   type: 'comment', difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 14000,  targetCount: 3,   icon: '💬', tags: ['comment'] },
  { id: 'daily_share_3',     title: 'Chia Sẻ 3 Video',            description: 'Chia sẻ 3 video TikTok của sàn ra ngoài.',                   category: 'daily',   type: 'share',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 13000,  targetCount: 3,   icon: '📤', tags: ['share'] },
  { id: 'daily_live_5m',     title: 'Xem Live 5 Phút',            description: 'Xem ít nhất 1 livestream liên tục 5 phút từ hệ thống.',      category: 'daily',   type: 'live',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 13000,  targetCount: 1,   icon: '📡', tags: ['live'] },
  
  // Cấp 2 - Khởi Nghiệp
  { id: 'daily_follow_8',    title: 'Theo Dõi 8 Kênh Nhanh',      description: 'Follow 8 kênh TikTok được đề xuất trong ngày.',              category: 'daily',   type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 15000,  targetCount: 8,   icon: '🌟', tags: ['follow'] },
  { id: 'daily_watch_8',     title: 'Xem 8 Video 15 Giây',        description: 'Xem đủ 15 giây 8 video từ chiến dịch đang chạy.',            category: 'daily',   type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 14000,  targetCount: 8,   icon: '📺', tags: ['video'] },
  { id: 'daily_like_15',     title: 'Thả Tim 15 Video',           description: 'Thả tim 15 video trên dòng tin chiến dịch.',                 category: 'daily',   type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 13000,  targetCount: 15,  icon: '💖', tags: ['tim'] },
  { id: 'daily_streak_3',    title: 'Duy Trì 3 Ngày Liên Tiếp',  description: 'Đăng nhập và làm ít nhất 1 nhiệm vụ 3 ngày liên tục.',     category: 'daily',   type: 'streak',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 15000,  targetCount: 3,   icon: '⚡', tags: ['streak', 'bonus'] },
  
  // Cấp 3 - Năng Động & Cấp 4 - Tương Tác
  { id: 'daily_follow_10',   title: 'Theo Dõi 10 Kênh',           description: 'Follow 10 kênh TikTok nhanh trong ngày.',                    category: 'daily',   type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 17000,  targetCount: 10,  icon: '🌟', tags: ['follow', 'trung bình'] },
  { id: 'daily_watch_15',    title: 'Xem 15 Video FYP',           description: 'Xem đủ 15 giây 15 video từ chiến dịch sàn cung cấp.',        category: 'daily',   type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 16000,  targetCount: 15,  icon: '📺', tags: ['video'] },
  { id: 'daily_comment_5',   title: 'Bình Luận 5 Video',          description: 'Để lại 5 bình luận chất lượng trên video hệ thống.',         category: 'daily',   type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 15000,  targetCount: 5,   icon: '🗣️', tags: ['comment'] },
  { id: 'daily_live_15m',    title: 'Xem Live 15 Phút',           description: 'Xem 1 phiên livestream liên tục 15 phút từ sàn.',            category: 'daily',   type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 16000,  targetCount: 1,   icon: '🔴', tags: ['live'] },
  { id: 'daily_share_5',     title: 'Chia Sẻ 5 Video',            description: 'Chia sẻ 5 video TikTok ra ngoài các nền tảng.',             category: 'daily',   type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 18000,  targetCount: 5,   icon: '🚀', tags: ['share'] },
  { id: 'daily_watch_20',    title: 'Xem 20 Video Liên Tiếp',     description: 'Xem đủ 15 giây 20 video hệ thống, không ngắt quãng.',        category: 'daily',   type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 19000,  targetCount: 20,  icon: '🔥', tags: ['video', 'streak'] },
  { id: 'daily_like_25',     title: 'Thả Tim 25 Video',           description: 'Thả tim 25 video TikTok trong ngày.',                        category: 'daily',   type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 16000,  targetCount: 25,  icon: '❤️‍🔥', tags: ['tim'] },

  // ---- DAILY MISSIONS (CẤP 5 -> CẤP 10: NÂNG CAO & CHUYÊN GIA) ----
  { id: 'daily_follow_15',   title: 'Follow Siêu Tốc 15 Kênh',    description: 'Theo dõi 15 kênh đối tác VIP của sàn.',                     category: 'daily',   type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 22000,  targetCount: 15,  icon: '⚡', tags: ['follow', 'vip'] },
  { id: 'daily_comment_8',   title: 'Seeding 8 Bình Luận Sâu',    description: 'Bình luận trên 8 video chiến dịch trọng điểm.',              category: 'daily',   type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 21000,  targetCount: 8,   icon: '✍️', tags: ['comment'] },
  { id: 'daily_live_30m',    title: 'Giữ Mắt Live 30 Phút',       description: 'Xem phiên livestream TikTok Shop liên tục 30 phút.',         category: 'daily',   type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 25000, targetCount: 1, icon: '🎙️', tags: ['live'] },
  { id: 'daily_follow_20',   title: 'Follow 20 Kênh Creator',     description: 'Follow 20 kênh Creator trong kho nhiệm vụ ngày.',            category: 'daily',   type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 24000, targetCount: 20, icon: '👑', tags: ['follow'] },
  { id: 'daily_watch_30',    title: 'Marathon 30 Video Ngày',     description: 'Xem đủ thời lượng 30 video chiến dịch sàn cung cấp.',        category: 'daily',   type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 30000,  targetCount: 30,  icon: '🎬', tags: ['video'] },
  { id: 'daily_share_10',    title: 'Lan Tỏa 10 Video Sàn',       description: 'Chia sẻ 10 video chiến dịch tới các hội nhóm mạng xã hội.', category: 'daily',   type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh',     baseRewardXu: 35000,  targetCount: 10,  icon: '📣', tags: ['share'] },
  { id: 'daily_live_45m',    title: 'Gắn Bó 45 Phút Live',        description: 'Xem livestream và tương tác giỏ hàng TikTok Shop 45 phút.',  category: 'daily',   type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ',      baseRewardXu: 40000,  targetCount: 1,   icon: '👁️', tags: ['live'] },
  { id: 'daily_follow_30',   title: 'Đại Đội Follow 30 Kênh',     description: 'Follow 30 kênh đối tác chỉ tiêu cấp 10.',                    category: 'daily',   type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 47000, targetCount: 30, icon: '💎', tags: ['follow', 'legend'] },

  // ---- WEEKLY MISSIONS (CẤP 1 -> CẤP 10) ----
  { id: 'weekly_follow_30',  title: 'Theo Dõi 30 Kênh Tuần',     description: 'Follow 30 kênh trong tuần từ kho hệ thống sàn.',             category: 'weekly',  type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 6000,   targetCount: 30,  icon: '🏆', tags: ['follow', 'tuần'] },
  { id: 'weekly_watch_50',   title: 'Xem 50 Video Trong Tuần',    description: 'Xem đủ 15s 50 video trong 7 ngày từ sàn cung cấp.',          category: 'weekly',  type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 10000,  targetCount: 50,  icon: '🎯', tags: ['video', 'tuần'] },
  { id: 'weekly_like_50',    title: 'Thả Tim 50 Video Tuần',     description: 'Thả tim 50 video hệ thống trong tuần.',                      category: 'weekly',  type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 5000,   targetCount: 50,  icon: '❤️‍🔥', tags: ['tim', 'tuần'] },
  { id: 'weekly_comment_20', title: 'Seeding 20 Bình Luận',      description: 'Để lại 20 bình luận có giá trị trong tuần.',                category: 'weekly',  type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 4000,   targetCount: 20,  icon: '✍️', tags: ['comment', 'tuần'] },
  { id: 'weekly_follow_50',  title: 'Theo Dõi 50 Kênh Tuần',     description: 'Follow 50 kênh trong tuần, phần thưởng nâng cấp.',           category: 'weekly',  type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 10000,  targetCount: 50,  icon: '🥈', tags: ['follow', 'tuần'] },
  { id: 'weekly_watch_100',  title: 'Xem 100 Video Tuần',         description: 'Xem đủ 15s 100 video trong tuần từ sàn cung cấp.',           category: 'weekly',  type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 20000,  targetCount: 100, icon: '🎯', tags: ['video', 'tuần'] },
  { id: 'weekly_share_20',   title: 'Lan Tỏa 20 Video',          description: 'Chia sẻ 20 video trong tuần ra ngoài.',                      category: 'weekly',  type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 4800,   targetCount: 20,  icon: '📣', tags: ['share', 'tuần'] },
  { id: 'weekly_live_60m',   title: 'Xem Live 60 Phút Tuần',     description: 'Xem tổng cộng 60 phút livestream trong tuần.',             category: 'weekly',  type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 4200,   targetCount: 60,  icon: '🎙️', tags: ['live', 'tuần'] },
  { id: 'weekly_like_100',   title: 'Vua Thả Tim 100 Tim',       description: 'Thả tim 100 video trong tuần từ sàn cung cấp.',              category: 'weekly',  type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 10000,  targetCount: 100, icon: '👑', tags: ['tim', 'tuần'] },
  { id: 'weekly_comment_50', title: 'Chuyên Gia Seeding 50',     description: 'Để lại 50 bình luận chất lượng trong tuần.',              category: 'weekly',  type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 10000,  targetCount: 50,  icon: '🎖️', tags: ['comment', 'tuần'] },
  { id: 'weekly_follow_100', title: 'Follow Huyền Thoại 100',    description: 'Follow 100 kênh trong tuần, thử thách Vàng.',                category: 'weekly',  type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 20000, targetCount: 100, icon: '💎', tags: ['follow', 'khó'] },
  { id: 'weekly_watch_200',  title: 'Marathon Xem 200 Video',    description: 'Xem 200 video trong tuần, danh hiệu Marathon Creator.',      category: 'weekly',  type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 40000, targetCount: 200, icon: '🏅', tags: ['video', 'tuần', 'khó'] },
  { id: 'weekly_share_50',   title: 'Đại Sứ Lan Tỏa 50 Share',   description: 'Chia sẻ 50 video ra ngoài trong tuần.',                    category: 'weekly',  type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 12000,  targetCount: 50,  icon: '🦅', tags: ['share', 'tuần'] },
  { id: 'weekly_live_180m',  title: 'Giữ Mắt 3 Giờ Live',        description: 'Xem tổng cộng 3 giờ livestream sàn trong tuần.',            category: 'weekly',  type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh',     baseRewardXu: 12600,  targetCount: 180, icon: '🌐', tags: ['live', 'tuần'] },
  { id: 'weekly_follow_200', title: 'Đại Chiến Follow 200',      description: 'Follow 200 kênh trong 7 ngày — chỉ dành cho Cao Thủ.',       category: 'weekly',  type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ',      baseRewardXu: 40000,  targetCount: 200, icon: '⚔️', tags: ['follow', 'khó'] },
  { id: 'weekly_watch_300',  title: 'Bất Khả Chiến Bại 300 Video', description: 'Xem đủ 300 video chiến dịch sàn trong tuần.',           category: 'weekly',  type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 60000, targetCount: 300, icon: '👑', tags: ['video', 'legend'] },

  // ---- SPECIAL & VIP MISSIONS (DÀNH CHO CẤP 7 -> CẤP 10) ----
  { id: 'special_follow_250',  title: 'Siêu Chiến Dịch 250 Follow', description: 'Theo dõi 250 kênh đối tác lớn trong tuần.',               category: 'special', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 50000,  targetCount: 250, icon: '⚔️', tags: ['follow', 'vip'] },
  { id: 'special_watch_500',   title: 'Huyền Thoại 500 Video',      description: 'Xem 500 video trong tuần — chỉ dành cho Kim Cương.',      category: 'special', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ',      baseRewardXu: 100000, targetCount: 500, icon: '💎', tags: ['video', 'kim cương'] },
  { id: 'special_live_300m',   title: 'Vua Livestream 5 Giờ',       description: 'Xem 5 giờ livestream trong tuần — Kim Cương VIP.',        category: 'special', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 63000,  targetCount: 300, icon: '👁️', tags: ['live', 'kim cương'] },
  { id: 'special_comment_100', title: 'Seeding Chuyên Nghiệp 100',  description: 'Để lại 100 bình luận chất lượng trong tuần.',              category: 'special', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh',     baseRewardXu: 25000,  targetCount: 100, icon: '🎙️', tags: ['comment', 'vip'] },
  { id: 'special_invite_10',   title: 'Đại Lý Chiêu Mộ 10 Người',  description: 'Mời 10 người đăng ký thành công trong tuần.',              category: 'special', type: 'invite',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 50000,  targetCount: 10,  icon: '🌟', tags: ['invite', 'vip'] },
];

// ===== CẤU HÌNH THEO RANK & PACKAGE (Tương thích 10 bậc và hệ thống cũ) =====
export const RANK_MISSION_CONFIG: WeeklyMissionConfig = {
  weekNumber: Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)),
  rankSlots: {
    ...TEN_TIER_CONFIG,
    // Legacy compatibility keys:
    'Đồng':       TEN_TIER_CONFIG['Cấp 1 - Tập Sự'],
    'Bạc':        TEN_TIER_CONFIG['Cấp 3 - Năng Động'],
    'Vàng':       TEN_TIER_CONFIG['Cấp 6 - Chuyên Nghiệp'],
    'Kim Cương':  TEN_TIER_CONFIG['Cấp 10 - Huyền Thoại'],
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

// ===== HÀM SINH NHIỆM VỤ (Seeded shuffle theo ngày & tuần + userId) =====
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
  rank: MissionRank | string = 'Đồng',
  userId: string = 'user_default',
  hasPaidPackage: boolean = false,
  packageCategory?: string
): UserWeeklyMission[] {
  const tierCfg = getRankTierConfig(rank);
  const multiplier = tierCfg.rewardMultiplier;

  // Package bonus slots
  const pkgKey = packageCategory || 'none';
  const bonusSlots = hasPaidPackage ? (RANK_MISSION_CONFIG.packageBonusSlots[pkgKey] ?? 2) : 0;
  const totalDailySlots = tierCfg.dailyMissionsCount + bonusSlots;
  const totalWeeklySlots = tierCfg.weeklyMissionsCount + Math.floor(bonusSlots / 2);

  // Lọc nhiệm vụ hợp lệ theo cấp bậc
  const userTierNum = tierCfg.tierNumber;
  const eligibleMissions = MISSION_POOL.filter((m) => {
    const minTier = getRankTierConfig(m.minRank);
    return minTier.tierNumber <= userTierNum;
  });

  // Tách daily, weekly, special
  const dailyPool   = eligibleMissions.filter(m => m.category === 'daily');
  const weeklyPool  = eligibleMissions.filter(m => m.category === 'weekly');
  const specialPool = eligibleMissions.filter(m => m.category === 'special');

  // Seeded shuffle:
  // - Daily missions thay đổi theo ngày (dayNumber)
  // - Weekly missions thay đổi theo tuần (weekNumber)
  const now = new Date();
  const dayNum = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));

  const userHash = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const dailySeed = (dayNum * 997 + userHash) >>> 0;
  const weeklySeed = (weekNum * 997 + userHash) >>> 0;

  const shuffledDaily   = shuffleWithSeed(dailyPool.length > 0 ? dailyPool : MISSION_POOL.filter(m => m.category === 'daily'), dailySeed);
  const shuffledWeekly  = shuffleWithSeed(weeklyPool.length > 0 ? weeklyPool : MISSION_POOL.filter(m => m.category === 'weekly'), weeklySeed);
  const shuffledSpecial = shuffleWithSeed(specialPool, weeklySeed + 7);

  // Chọn đúng số lượng slot
  const pickedDaily   = shuffledDaily.slice(0, totalDailySlots);
  const pickedWeekly  = shuffledWeekly.slice(0, totalWeeklySlots);
  const pickedSpecial = (userTierNum >= 7 || hasPaidPackage) ? shuffledSpecial.slice(0, Math.max(1, Math.floor(bonusSlots / 2))) : [];

  // Timestamp kết thúc tuần
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
