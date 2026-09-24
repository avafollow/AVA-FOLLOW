import { WeeklyMissionDef, WeeklyMissionConfig, UserWeeklyMission, MissionRank, MissionType, MissionDifficulty, RankTierConfig } from '../types';

export const STREAK_REWARDS = {
  dailyAllClearBonus: 35000,
  weeklyStreakBonus: 350000,
  monthlyStreakBonus: 2000000,
};

// ===== CẤU HÌNH 10 CẤP BẬC THĂNG TIẾN TOÀN DIỆN (10 Rank Tiers System) =====
// subMissionRewardXu: Xu nhận được mỗi khi hoàn thành 1 nhiệm vụ con (tối thiểu 10.000 ở Cấp 1)
// subMissionCompleteBonusXu: Xu thưởng thêm khi hoàn thành TẤT CẢ nhiệm vụ con của 1 nhiệm vụ chính (tối thiểu 1.000 ở Cấp 1)
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
    description: 'Cấp khởi đầu cho mọi người mới: Hoàn thành 5 nhiệm vụ ngày nhận trung bình 100.000 Xu (≈100k VNĐ/ngày).',
    subMissionRewardXu: 10000,      // 10.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 1000  // +1.000 Xu thưởng thêm khi hoàn thành hết
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
    description: 'Thăng hạng khi tích lũy 20 nhiệm vụ: 6 nhiệm vụ ngày, kiếm trung bình 130.000 Xu/ngày.',
    subMissionRewardXu: 12000,       // 12.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 1500  // +1.500 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 50 nhiệm vụ: 7 nhiệm vụ ngày, kiếm trung bình 170.000 Xu/ngày.',
    subMissionRewardXu: 14000,       // 14.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 2000  // +2.000 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 100 nhiệm vụ: 8 nhiệm vụ ngày, kiếm trung bình 220.000 Xu/ngày.',
    subMissionRewardXu: 16000,       // 16.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 2500  // +2.500 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 200 nhiệm vụ: 9 nhiệm vụ ngày, kiếm trung bình 290.000 Xu/ngày + 2 Vòng quay.',
    subMissionRewardXu: 20000,       // 20.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 3000  // +3.000 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 350 nhiệm vụ: 10 nhiệm vụ ngày, kiếm trung bình 380.000 Xu/ngày + 2 Vòng quay.',
    subMissionRewardXu: 25000,       // 25.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 4000  // +4.000 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 600 nhiệm vụ: 11 nhiệm vụ ngày, kiếm trung bình 500.000 Xu/ngày (500k VNĐ).',
    subMissionRewardXu: 30000,       // 30.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 5000  // +5.000 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 1.000 nhiệm vụ: 12 nhiệm vụ ngày, kiếm trung bình 650.000 Xu/ngày + 3 Vòng quay.',
    subMissionRewardXu: 38000,       // 38.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 7000  // +7.000 Xu thưởng thêm
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
    description: 'Thăng hạng khi tích lũy 1.500 nhiệm vụ: 14 nhiệm vụ ngày, kiếm trung bình 850.000 Xu/ngày + 3 Vòng quay.',
    subMissionRewardXu: 46000,        // 46.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 9000   // +9.000 Xu thưởng thêm
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
    description: 'CẤP BẬC CAO NHẤT (Đạt 2.500 nhiệm vụ): 16 nhiệm vụ ngày, kiếm trên 1.200.000 Xu/ngày (1.2 triệu VNĐ/ngày) + 5 Vòng quay!',
    subMissionRewardXu: 56000,         // 56.000 Xu mỗi nhiệm vụ con
    subMissionCompleteBonusXu: 12000   // +12.000 Xu thưởng thêm
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

// ===== HÀM SINH CÁC TIỂU NHIỆM VỤ CON / CHẶNG TIẾN ĐỘ NHỎ (SUB-MILESTONES) =====
export function buildMissionSubMilestones(
  type: MissionType,
  targetCount: number,
  completedCount: number,
  subMissionRewardXu: number = 10000   // Xu thưởng mỗi nhiệm vụ con (mặc định 10.000)
): { step: number; label: string; targetCount: number; isDone: boolean; rewardXu: number; isClaimed: boolean }[] {
  if (targetCount <= 0) return [];

  // Nếu target nhỏ (<= 5): tách thành từng tiểu nhiệm vụ con chi tiết 1-by-1
  if (targetCount <= 5) {
    const list = [];
    for (let i = 1; i <= targetCount; i++) {
      let label = `Tiểu nhiệm vụ #${i}`;
      if (type === 'watch') label = `Video #${i}: Xem đủ 15s FYP`;
      else if (type === 'follow') label = `Kênh #${i}: Theo dõi kênh chỉ định`;
      else if (type === 'like') label = `Thả tim #${i}: Video chiến dịch`;
      else if (type === 'comment') label = `Bình luận #${i}: Nhận xét tích cực`;
      else if (type === 'live') label = `Mốc #${i}: Giữ mắt xem live 1 phút`;
      else if (type === 'share') label = `Chia sẻ #${i}: Lan tỏa ra ngoài`;
      else if (type === 'invite') label = `Mời #${i}: Bạn bè đăng ký`;
      else if (type === 'streak') label = `Ngày #${i}: Chuỗi tương tác`;
      else if (type === 'post') label = `Tác vụ #${i}: Khám phá shop`;

      list.push({
        step: i,
        label,
        targetCount: i,
        isDone: completedCount >= i,
        rewardXu: subMissionRewardXu,
        isClaimed: false
      });
    }
    return list;
  }

  // Nếu target lớn (> 5: ví dụ 8, 10, 15, 20, 30, 50, 100...):
  // Tự động phân bổ thành 3 đến 4 chặng con (Milestones) giúp người dùng dễ dàng hoàn thành từng chặng
  const numSteps = targetCount <= 10 ? 3 : 4;
  const list = [];
  const stepInterval = Math.ceil(targetCount / numSteps);

  for (let s = 1; s <= numSteps; s++) {
    const stepTarget = s === numSteps ? targetCount : Math.min(targetCount, s * stepInterval);
    let unit = 'lượt';
    if (type === 'watch') unit = 'video';
    else if (type === 'follow') unit = 'kênh';
    else if (type === 'like') unit = 'tim';
    else if (type === 'comment') unit = 'bình luận';
    else if (type === 'live') unit = 'phút live';
    else if (type === 'share') unit = 'lượt chia sẻ';

    const label = s === numSteps ? `Cán đích: Hoàn thành đủ ${targetCount} ${unit}` : `Chặng ${s}: Cán mốc ${stepTarget} ${unit}`;

    list.push({
      step: s,
      label,
      targetCount: stepTarget,
      isDone: completedCount >= stepTarget,
      rewardXu: subMissionRewardXu,
      isClaimed: false
    });
  }

  return list;
}

// ===== BẢNG PHÂN BỔ NHIỆM VỤ CHÍNH CHO TỪNG CẤP BẬC (10 CẤP BẬC - THÙ LAO >= 10.000 XU/NV) =====
export const TIER_DAILY_MISSIONS_MAP: Record<number, WeeklyMissionDef[]> = {
  // 🥉 CẤP 1 - TẬP SỰ (5 NV • Thù lao: 65.000 Xu • Thưởng gói: +35.000 Xu = 100.000 Xu/ngày)
  1: [
    { id: 't1_w5',   title: 'Lướt xem 5 video đề xuất FYP (15s/video)', description: 'Xem đủ 15 giây 5 video sàn trên For You Page.', category: 'daily', type: 'watch',   difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 13000, targetCount: 5, icon: '🎬', tags: ['video', 'dễ'] },
    { id: 't1_f3',   title: 'Theo dõi 3 kênh TikTok đối soát',          description: 'Follow 3 kênh TikTok chỉ định từ hệ thống sàn.',  category: 'daily', type: 'follow',  difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 15000, targetCount: 3, icon: '👤', tags: ['follow', 'dễ'] },
    { id: 't1_l5',   title: 'Thả tim 5 video chiến dịch',               description: 'Thả tim 5 video TikTok đang có trên dòng tin.',  category: 'daily', type: 'like',    difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 12000, targetCount: 5, icon: '❤️', tags: ['tim'] },
    { id: 't1_c2',   title: 'Bình luận 2 video tích cực',               description: 'Để lại bình luận có nội dung tốt trên 2 video.', category: 'daily', type: 'comment', difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 12000, targetCount: 2, icon: '💬', tags: ['comment'] },
    { id: 't1_v3',   title: 'Giữ mắt xem live tối thiểu 3 phút',        description: 'Xem 1 livestream liên tục từ 3 phút trở lên.',   category: 'daily', type: 'live',    difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 13000, targetCount: 3, icon: '📡', tags: ['live'] }
  ],

  // 🥉 CẤP 2 - KHỞI NGHIỆP (6 NV • Thù lao: 85.000 Xu • Thưởng gói: +45.000 Xu = 130.000 Xu/ngày)
  2: [
    { id: 't2_w8',   title: 'Lướt 8 video đề xuất FYP (15s/video)',     description: 'Xem đủ 15 giây 8 video chiến dịch sàn.',          category: 'daily', type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 15000, targetCount: 8,  icon: '🎬', tags: ['video'] },
    { id: 't2_f5',   title: 'Follow 5 kênh TikTok chất lượng',          description: 'Follow 5 kênh được hệ thống phân bổ trong ngày.',category: 'daily', type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 16000, targetCount: 5,  icon: '👥', tags: ['follow'] },
    { id: 't2_l10',  title: 'Thả tim 10 video chiến dịch',              description: 'Thả tim tương tác 10 video trên luồng phân phối.',category: 'daily', type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 14000, targetCount: 10, icon: '💖', tags: ['tim'] },
    { id: 't2_c3',   title: 'Bình luận 3 video tích cực',               description: 'Để lại bình luận ý nghĩa trên 3 video sàn.',     category: 'daily', type: 'comment', difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 14000, targetCount: 3,  icon: '💬', tags: ['comment'] },
    { id: 't2_v5',   title: 'Xem live giữ mắt 5 phút',                  description: 'Xem ít nhất 1 phiên livestream liên tục 5 phút.', category: 'daily', type: 'live',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 14000, targetCount: 5,  icon: '🔴', tags: ['live'] },
    { id: 't2_s1',   title: 'Chia sẻ 1 video ra ngoài',                 description: 'Chia sẻ 1 video sàn tới bạn bè hoặc hội nhóm.',  category: 'daily', type: 'share',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 12000, targetCount: 1,  icon: '📤', tags: ['share'] }
  ],

  // 🥈 CẤP 3 - NĂNG ĐỘNG (7 NV • Thù lao: 110.000 Xu • Thưởng gói: +60.000 Xu = 170.000 Xu/ngày)
  3: [
    { id: 't3_w12',  title: 'Lướt 12 video đề xuất FYP',                description: 'Xem đủ 15 giây 12 video chiến dịch sàn.',         category: 'daily', type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 17000, targetCount: 12, icon: '📺', tags: ['video'] },
    { id: 't3_f8',   title: 'Follow 8 kênh TikTok uy tín',              description: 'Follow 8 kênh TikTok nhanh và chuẩn xác.',       category: 'daily', type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 18000, targetCount: 8,  icon: '🌟', tags: ['follow'] },
    { id: 't3_l15',  title: 'Thả tim 15 video chiến dịch',              description: 'Thả tim 15 video cộng đồng trên sàn.',          category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 15000, targetCount: 15, icon: '💖', tags: ['tim'] },
    { id: 't3_c5',   title: 'Bình luận 5 video chất lượng',             description: 'Gửi 5 bình luận tương tác có ý nghĩa trên video.',category: 'daily', type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 15000, targetCount: 5,  icon: '🗣️', tags: ['comment'] },
    { id: 't3_v10',  title: 'Xem live giữ mắt 10 phút',                 description: 'Xem 1 phiên livestream liên tục 10 phút.',        category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 16000, targetCount: 10, icon: '📡', tags: ['live'] },
    { id: 't3_s3',   title: 'Chia sẻ 3 video ra mạng xã hội',           description: 'Chia sẻ 3 video TikTok ra các nền tảng ngoài.',  category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 14000, targetCount: 3,  icon: '🚀', tags: ['share'] },
    { id: 't3_k3',   title: 'Duy trì chuỗi tương tác 3 mốc',           description: 'Tương tác liên tục không gián đoạn trong ngày.',  category: 'daily', type: 'streak',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 15000, targetCount: 3,  icon: '⚡', tags: ['streak'] }
  ],

  // 🥈 CẤP 4 - TƯƠNG TÁC (8 NV • Thù lao: 140.000 Xu • Thưởng gói: +80.000 Xu = 220.000 Xu/ngày)
  4: [
    { id: 't4_w15',  title: 'Lướt 15 video FYP liên tiếp',              description: 'Xem đủ 15 giây 15 video hệ thống liên tục.',      category: 'daily', type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 20000, targetCount: 15, icon: '🔥', tags: ['video'] },
    { id: 't4_f10',  title: 'Follow 10 kênh TikTok nhanh',              description: 'Theo dõi 10 kênh đối soát sàn chỉ định.',         category: 'daily', type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 20000, targetCount: 10, icon: '🌟', tags: ['follow'] },
    { id: 't4_l20',  title: 'Thả tim 20 video chiến dịch',              description: 'Thả tim 20 video TikTok trong ngày.',            category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 17000, targetCount: 20, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't4_c6',   title: 'Bình luận 6 video chất lượng',             description: 'Để lại 6 bình luận tương tác có tâm trên video.', category: 'daily', type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 17000, targetCount: 6,  icon: '💬', tags: ['comment'] },
    { id: 't4_v15',  title: 'Xem live giữ mắt 15 phút',                 description: 'Xem 1 phiên livestream liên tục 15 phút từ sàn.', category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 18000, targetCount: 15, icon: '🔴', tags: ['live'] },
    { id: 't4_s5',   title: 'Chia sẻ 5 video ra ngoài',                 description: 'Chia sẻ 5 video TikTok ra các nền tảng khác.',   category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 16000, targetCount: 5,  icon: '📣', tags: ['share'] },
    { id: 't4_lv5',  title: 'Tương tác 5 phiên live sàn',               description: 'Thả tim tương tác trên 5 phiên live đang diễn ra.',category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 16000, targetCount: 5,  icon: '🎙️', tags: ['live'] },
    { id: 't4_sh1',  title: 'Ghé thăm gian hàng TikTok Shop',           description: 'Bấm khám phá giỏ hàng 1 phiên livestream đối tác.',category: 'daily', type: 'post',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 16000, targetCount: 1,  icon: '🛍️', tags: ['shop'] }
  ],

  // 🥇 CẤP 5 - TIÊN PHONG (9 NV • Thù lao: 185.000 Xu • Thưởng gói: +105.000 Xu = 290.000 Xu/ngày + 2 Vòng quay)
  5: [
    { id: 't5_w20',  title: 'Lướt 20 video chiến dịch sàn',             description: 'Xem 20 video chiến dịch trọng điểm đủ thời lượng.',category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 22000, targetCount: 20, icon: '🎬', tags: ['video'] },
    { id: 't5_f15',  title: 'Follow 15 kênh VIP sàn chỉ định',          description: 'Theo dõi 15 kênh đối tác VIP của hệ thống.',      category: 'daily', type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 23000, targetCount: 15, icon: '👑', tags: ['follow', 'vip'] },
    { id: 't5_l25',  title: 'Thả tim 25 video chiến dịch',              description: 'Thả tim tương tác 25 video chất lượng cao.',      category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 20000, targetCount: 25, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't5_c8',   title: 'Bình luận seeding 8 video',                description: 'Bình luận seeding sâu trên 8 video chiến dịch.',  category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 21000, targetCount: 8,  icon: '✍️', tags: ['comment'] },
    { id: 't5_v20',  title: 'Xem live giữ mắt 20 phút',                 description: 'Xem livestream bán hàng liên tục 20 phút.',       category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 21000, targetCount: 20, icon: '🎙️', tags: ['live'] },
    { id: 't5_s8',   title: 'Chia sẻ 8 video ra ngoài',                 description: 'Chia sẻ 8 video tới các hội nhóm mạng xã hội.',   category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 19000, targetCount: 8,  icon: '🚀', tags: ['share'] },
    { id: 't5_g3',   title: 'Tương tác 3 giỏ hàng live shop',           description: 'Khám phá sản phẩm giỏ hàng trên 3 phiên live.',   category: 'daily', type: 'post',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 20000, targetCount: 3,  icon: '🛍️', tags: ['shop'] },
    { id: 't5_lv5',  title: 'Thả tim 5 phiên live VIP',                 description: 'Thả tim tương tác trên 5 phiên live Creator.',    category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 19000, targetCount: 5,  icon: '✨', tags: ['live'] },
    { id: 't5_sh2',  title: 'Chia sẻ livestream vào hội nhóm',          description: 'Chia sẻ 2 link livestream tới các group Facebook.',category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 20000, targetCount: 2,  icon: '📢', tags: ['share'] }
  ],

  // 🥇 CẤP 6 - CHUYÊN NGHIỆP (10 NV • Thù lao: 240.000 Xu • Thưởng gói: +140.000 Xu = 380.000 Xu/ngày + 2 Vòng quay)
  6: [
    { id: 't6_w25',  title: 'Lướt 25 video FYP chuyên sâu',             description: 'Xem 25 video FYP đủ 15 giây từ luồng sàn.',       category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 26000, targetCount: 25, icon: '🎬', tags: ['video'] },
    { id: 't6_f20',  title: 'Follow 20 kênh Creator đối tác',           description: 'Theo dõi 20 kênh Creator trong kho nhiệm vụ.',     category: 'daily', type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 27000, targetCount: 20, icon: '👑', tags: ['follow'] },
    { id: 't6_l35',  title: 'Thả tim 35 video cộng đồng',               description: 'Thả tim 35 video TikTok của cộng đồng sáng tạo.', category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 24000, targetCount: 35, icon: '💖', tags: ['tim'] },
    { id: 't6_c10',  title: 'Bình luận chuyên sâu 10 video',            description: 'Để lại 10 bình luận chất lượng chuyên sâu.',       category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 25000, targetCount: 10, icon: '✍️', tags: ['comment'] },
    { id: 't6_v30',  title: 'Xem live 30 phút TikTok Shop',             description: 'Xem phiên livestream TikTok Shop đủ 30 phút.',     category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 25000, targetCount: 30, icon: '🎙️', tags: ['live'] },
    { id: 't6_s10',  title: 'Chia sẻ 10 video ra cộng đồng',            description: 'Lan tỏa 10 video chiến dịch tới các nhóm.',       category: 'daily', type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 22000, targetCount: 10, icon: '📣', tags: ['share'] },
    { id: 't6_k10',  title: 'Tương tác chuỗi 10 video liên tục',        description: 'Xem liên tiếp không ngắt quãng 10 video.',        category: 'daily', type: 'streak',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 24000, targetCount: 10, icon: '⚡', tags: ['streak'] },
    { id: 't6_lv3',  title: 'Tương tác 3 phiên live Creator',           description: 'Tham gia tương tác trên 3 phòng live đối tác.',   category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 23000, targetCount: 3,  icon: '👁️', tags: ['live'] },
    { id: 't6_l50',  title: 'Thả tim 50 lượt trong live',               description: 'Gõ màn hình thả 50 tim trong livestream.',        category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 22000, targetCount: 50, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't6_g5',   title: 'Bình luận hỏi giá 5 giỏ hàng live',        description: 'Tương tác hỏi tư vấn sản phẩm trên 5 giỏ hàng.',   category: 'daily', type: 'post',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 22000, targetCount: 5,  icon: '🛍️', tags: ['shop'] }
  ],

  // 💠 CẤP 7 - TINH ANH (11 NV • Thù lao: 320.000 Xu • Thưởng gói: +180.000 Xu = 500.000 Xu/ngày + 2 Vòng quay)
  7: [
    { id: 't7_w30',  title: 'Lướt 30 video chiến dịch sàn',             description: 'Xem đủ 15 giây 30 video chiến dịch doanh nghiệp.',category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 31000, targetCount: 30, icon: '🎬', tags: ['video'] },
    { id: 't7_f25',  title: 'Follow 25 kênh đối tác VIP',               description: 'Theo dõi 25 kênh thương hiệu đối tác lớn.',        category: 'daily', type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 32000, targetCount: 25, icon: '💎', tags: ['follow'] },
    { id: 't7_l45',  title: 'Thả tim 45 video chiến dịch',              description: 'Thả tim 45 video được phân bổ trong ngày.',       category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 29000, targetCount: 45, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't7_c12',  title: 'Bình luận 12 video chất lượng',            description: 'Để lại 12 bình luận tích cực và đánh giá cao.',    category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 30000, targetCount: 12, icon: '✍️', tags: ['comment'] },
    { id: 't7_v35',  title: 'Xem live 35 phút liên tục',                description: 'Giữ mắt phiên livestream TikTok Shop 35 phút.',   category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 30000, targetCount: 35, icon: '🎙️', tags: ['live'] },
    { id: 't7_s15',  title: 'Chia sẻ 15 video ra mạng xã hội',          description: 'Lan tỏa 15 video chiến dịch tới các nhóm cộng đồng.',category: 'daily', type: 'share', difficulty: 'hard', source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 15, icon: '📣', tags: ['share'] },
    { id: 't7_lv5',  title: 'Tương tác 5 phiên live Shop',              description: 'Tham gia tương tác trên 5 phòng live bán hàng.',  category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 5,  icon: '👁️', tags: ['live'] },
    { id: 't7_l60',  title: 'Thả tim 60 lượt trong live',               description: 'Gõ màn hình thả tim 60 lần trong phiên live.',    category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 60, icon: '💖', tags: ['tim'] },
    { id: 't7_g5',   title: 'Ghé thăm 5 gian hàng TikTok Shop',         description: 'Khám phá sản phẩm giỏ hàng tại 5 phiên live.',    category: 'daily', type: 'post',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 5,  icon: '🛍️', tags: ['shop'] },
    { id: 't7_dg5',  title: 'Đánh giá 5 sản phẩm trên live',            description: 'Để lại câu hỏi và đánh giá 5 mặt hàng trên live.', category: 'daily', type: 'post',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 5,  icon: '⭐', tags: ['shop'] },
    { id: 't7_inv1', title: 'Mời 1 bạn bè mới tham gia',               description: 'Chia sẻ mã giới thiệu, có 1 bạn đăng ký làm NV.', category: 'daily', type: 'invite',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 28000, targetCount: 1,  icon: '🎁', tags: ['invite'] }
  ],

  // 💠 CẤP 8 - THỦ LĨNH (12 NV • Thù lao: 420.000 Xu • Thưởng gói: +230.000 Xu = 650.000 Xu/ngày + 3 Vòng quay)
  8: [
    { id: 't8_w40',  title: 'Lướt xem 40 video chiến dịch',             description: 'Xem trọn vẹn 40 video từ các đối tác lớn của sàn.',category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 38000, targetCount: 40, icon: '🎬', tags: ['video'] },
    { id: 't8_f30',  title: 'Follow 30 kênh Creator VIP',               description: 'Theo dõi 30 kênh Creator uy tín hạng Bạch Kim.',  category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 40000, targetCount: 30, icon: '👑', tags: ['follow'] },
    { id: 't8_l60',  title: 'Thả tim 60 video trên bảng tin',           description: 'Thả tim 60 video cộng đồng phân phối.',           category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 35000, targetCount: 60, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't8_c15',  title: 'Bình luận seeding 15 video',               description: 'Seeding 15 bình luận mang giá trị thảo luận cao.', category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 36000, targetCount: 15, icon: '✍️', tags: ['comment'] },
    { id: 't8_v45',  title: 'Giữ mắt livestream 45 phút',               description: 'Xem và giữ mắt phiên livestream liên tục 45 phút.',category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 36000, targetCount: 45, icon: '🎙️', tags: ['live'] },
    { id: 't8_s20',  title: 'Chia sẻ 20 video ra ngoài',                description: 'Chia sẻ 20 video chiến dịch tới các hội nhóm lớn.',category: 'daily', type: 'share',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 33000, targetCount: 20, icon: '📣', tags: ['share'] },
    { id: 't8_k15',  title: 'Tương tác chuỗi 15 video liên tiếp',       description: 'Duy trì luồng xem và tương tác 15 video liền mạch.',category: 'daily', type: 'streak', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 34000, targetCount: 15, icon: '⚡', tags: ['streak'] },
    { id: 't8_lv5',  title: 'Theo dõi 5 phiên live đối tác',            description: 'Tham gia tương tác trên 5 phiên live trọng điểm.',category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 34000, targetCount: 5,  icon: '👁️', tags: ['live'] },
    { id: 't8_lt80', title: 'Thả tim 80 lượt trong live',               description: 'Gõ màn hình gửi 80 lượt tim cho Creator phát live.',category: 'daily', type: 'like',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 34000, targetCount: 80, icon: '💖', tags: ['tim'] },
    { id: 't8_g5',   title: 'Tương tác 5 sản phẩm giỏ hàng',            description: 'Xem chi tiết và bấm quan tâm 5 sản phẩm live shop.',category: 'daily', type: 'post',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 34000, targetCount: 5,  icon: '🛍️', tags: ['shop'] },
    { id: 't8_sh5',  title: 'Chia sẻ livestream ra 5 nhóm',             description: 'Chia sẻ luồng live tới 5 cộng đồng mạng xã hội.', category: 'daily', type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 33000, targetCount: 5,  icon: '📢', tags: ['share'] },
    { id: 't8_sec1', title: 'Duy trì kết nối an toàn hệ thống',         description: 'Hoàn thành đối soát IP và tài khoản thật 100%.',   category: 'daily', type: 'profile', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 33000, targetCount: 1,  icon: '🛡️', tags: ['security'] }
  ],

  // 💎 CẤP 9 - CAO THỦ (14 NV • Thù lao: 550.000 Xu • Thưởng gói: +300.000 Xu = 850.000 Xu/ngày + 3 Vòng quay)
  9: [
    { id: 't9_w50',  title: 'Marathon xem 50 video FYP',                description: 'Xem 50 video For You Page chiến dịch sàn.',        category: 'daily', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 42000, targetCount: 50, icon: '🎬', tags: ['video'] },
    { id: 't9_f40',  title: 'Follow 40 kênh đối tác lớn',               description: 'Theo dõi 40 kênh đối tác chiến lược Kim Cương.',  category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 44000, targetCount: 40, icon: '💎', tags: ['follow'] },
    { id: 't9_l80',  title: 'Thả tim 80 video chiến dịch',              description: 'Thả tim 80 video TikTok trên hệ thống đối soát.',  category: 'daily', type: 'like',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 39000, targetCount: 80, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't9_c20',  title: 'Bình luận 20 video chuyên sâu',            description: 'Để lại 20 bình luận đánh giá chuyên sâu.',         category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 40000, targetCount: 20, icon: '✍️', tags: ['comment'] },
    { id: 't9_v60',  title: 'Giữ mắt livestream 60 phút',               description: 'Xem liên tục phiên livestream TikTok Shop 60 phút.',category: 'daily', type: 'live',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 41000, targetCount: 60, icon: '🎙️', tags: ['live'] },
    { id: 't9_s25',  title: 'Chia sẻ 25 video mạng xã hội',             description: 'Lan tỏa 25 video ra các nền tảng Facebook, Zalo.',category: 'daily', type: 'share',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 38000, targetCount: 25, icon: '📣', tags: ['share'] },
    { id: 't9_mul20',title: 'Tương tác đa tác vụ 20 video',             description: 'Thực hiện xem + tim + follow trên 20 video.',      category: 'daily', type: 'streak', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 40000, targetCount: 20, icon: '⚡', tags: ['streak'] },
    { id: 't9_lt100',title: 'Thả tim 100 lượt trong live',              description: 'Gửi 100 lượt tim trong phiên livestream đối tác.',category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 39000, targetCount: 100,icon: '💖', tags: ['tim'] },
    { id: 't9_lv8',  title: 'Tương tác 8 phiên live Shop',              description: 'Tương tác trên 8 phiên livestream bán hàng VIP.',  category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 40000, targetCount: 8,  icon: '👁️', tags: ['live'] },
    { id: 't9_ch10', title: 'Bình luận hỏi hàng 10 phiên live',         description: 'Bình luận tương tác sản phẩm trên 10 phiên live.', category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 39000, targetCount: 10, icon: '💬', tags: ['comment'] },
    { id: 't9_sh8',  title: 'Ghé thăm 8 shop đối tác',                  description: 'Khám phá gian hàng tại 8 phiên livestream lớn.',   category: 'daily', type: 'post',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 38000, targetCount: 8,  icon: '🛍️', tags: ['shop'] },
    { id: 't9_sh10', title: 'Chia sẻ 10 phiên live ra nhóm',            description: 'Chia sẻ 10 luồng live đối tác tới các hội nhóm.',  category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 38000, targetCount: 10, icon: '📢', tags: ['share'] },
    { id: 't9_ds10', title: 'Hỗ trợ đối soát chéo 10 kênh',            description: 'Xác thực chéo 10 kênh TikTok đảm bảo tỷ lệ tương tác.',category: 'daily', type: 'follow', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 36000, targetCount: 10, icon: '⚔️', tags: ['follow'] },
    { id: 't9_str1', title: 'Chuỗi tương tác ngày hoàn hảo',           description: 'Đạt chuỗi tương tác không đứt quãng trong ngày.', category: 'daily', type: 'streak',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 36000, targetCount: 1,  icon: '👑', tags: ['streak'] }
  ],

  // 👑 CẤP 10 - HUYỀN THOẠI (16 NV • Thù lao: 750.000 Xu • Thưởng gói: +450.000 Xu = 1.200.000 Xu/ngày + 5 Vòng quay)
  10: [
    { id: 't10_w60',  title: 'Đại đội lướt 60 video FYP',               description: 'Lướt xem 60 video chất lượng cao từ kho sàn.',    category: 'daily', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 50000, targetCount: 60, icon: '🎬', tags: ['video', 'legend'] },
    { id: 't10_f50',  title: 'Follow 50 kênh đối tác VIP',              description: 'Theo dõi 50 kênh đối tác VIP cấp cao nhất sàn.',  category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 52000, targetCount: 50, icon: '👑', tags: ['follow', 'legend'] },
    { id: 't10_l100', title: 'Thả tim 100 video chiến dịch',            description: 'Thả tim 100 video TikTok trên hệ thống chiến dịch.',category: 'daily', type: 'like',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 47000, targetCount: 100,icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't10_c25',  title: 'Bình luận 25 video đỉnh cao',             description: 'Viết 25 bình luận chất lượng đỉnh cao trên video.', category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 48000, targetCount: 25, icon: '✍️', tags: ['comment'] },
    { id: 't10_v90',  title: 'Giữ mắt live 90 phút TikTok Shop',        description: 'Xem livestream giữ mắt liên tục đủ 90 phút.',     category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 49000, targetCount: 90, icon: '🎙️', tags: ['live', 'legend'] },
    { id: 't10_s30',  title: 'Chia sẻ 30 video ra cộng đồng',           description: 'Lan tỏa 30 video chiến dịch ra các mạng xã hội.',  category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 45000, targetCount: 30, icon: '📣', tags: ['share'] },
    { id: 't10_mul30',title: 'Tương tác đa tác vụ 30 video',            description: 'Lướt, thả tim và theo dõi đồng thời 30 video.',   category: 'daily', type: 'streak',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 47000, targetCount: 30, icon: '⚡', tags: ['streak'] },
    { id: 't10_lt150',title: 'Thả tim 150 lượt trong live',             description: 'Gõ màn hình ủng hộ 150 tim trên phòng livestream.',category: 'daily', type: 'like',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 46000, targetCount: 150,icon: '💖', tags: ['tim'] },
    { id: 't10_lv10', title: 'Giữ mắt 10 phiên live VIP',              description: 'Tham gia tương tác trên 10 phiên live đối tác VIP.',category: 'daily', type: 'live',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 48000, targetCount: 10, icon: '👁️', tags: ['live'] },
    { id: 't10_g15',  title: 'Tương tác 15 sản phẩm giỏ hàng',           description: 'Khám phá và bấm theo dõi 15 sản phẩm giỏ hàng.',  category: 'daily', type: 'post',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 46000, targetCount: 15, icon: '🛍️', tags: ['shop'] },
    { id: 't10_cl12', title: 'Bình luận chất lượng trên 12 live',       description: 'Để lại 12 bình luận tư vấn tương tác trên live.',   category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 46000, targetCount: 12, icon: '💬', tags: ['comment'] },
    { id: 't10_sh15', title: 'Chia sẻ 15 phiên live ra nhóm lớn',       description: 'Chia sẻ 15 luồng livestream tới các group lớn.',   category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 45000, targetCount: 15, icon: '📢', tags: ['share'] },
    { id: 't10_m10',  title: 'Khám phá 10 gian hàng TikTok Mall',       description: 'Truy cập trải nghiệm 10 gian hàng Mall uy tín.',   category: 'daily', type: 'post',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 45000, targetCount: 10, icon: '🏬', tags: ['shop'] },
    { id: 't10_ds15', title: 'Đối soát bảo an 15 kênh uy tín',          description: 'Hỗ trợ đối soát dữ liệu 15 kênh cộng đồng.',       category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 45000, targetCount: 15, icon: '⚔️', tags: ['follow'] },
    { id: 't10_cr10', title: 'Tương tác 10 Creator hàng đầu',           description: 'Ủng hộ tương tác toàn diện cho 10 Top Creator.',  category: 'daily', type: 'profile', difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 45000, targetCount: 10, icon: '🌟', tags: ['creator'] },
    { id: 't10_leg1', title: 'Huyền Thoại Tương Tác trọn gói',          description: 'Cán đích gói 16 nhiệm vụ ngày nhận 1.2 Triệu Xu.', category: 'daily', type: 'streak',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 46000, targetCount: 1,  icon: '💎', tags: ['legend'] }
  ]
};

// ===== KHO NHIỆM VỤ TUẦN & ĐẶC BIỆT DÀNH CHO CẢ 10 CẤP =====
export const MISSION_POOL: WeeklyMissionDef[] = [
  // ---- WEEKLY MISSIONS (CẤP 1 -> CẤP 10) ----
  { id: 'weekly_follow_30',  title: 'Theo Dõi 30 Kênh Tuần',     description: 'Follow 30 kênh trong tuần từ kho hệ thống sàn.',             category: 'weekly',  type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 15000,  targetCount: 30,  icon: '🏆', tags: ['follow', 'tuần'] },
  { id: 'weekly_watch_50',   title: 'Xem 50 Video Trong Tuần',    description: 'Xem đủ 15s 50 video trong 7 ngày từ sàn cung cấp.',          category: 'weekly',  type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 1 - Tập Sự',       baseRewardXu: 20000,  targetCount: 50,  icon: '🎯', tags: ['video', 'tuần'] },
  { id: 'weekly_like_50',    title: 'Thả Tim 50 Video Tuần',     description: 'Thả tim 50 video hệ thống trong tuần.',                      category: 'weekly',  type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 18000,  targetCount: 50,  icon: '❤️‍🔥', tags: ['tim', 'tuần'] },
  { id: 'weekly_comment_20', title: 'Seeding 20 Bình Luận',      description: 'Để lại 20 bình luận có giá trị trong tuần.',                category: 'weekly',  type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp',   baseRewardXu: 18000,  targetCount: 20,  icon: '✍️', tags: ['comment', 'tuần'] },
  { id: 'weekly_follow_50',  title: 'Theo Dõi 50 Kênh Tuần',     description: 'Follow 50 kênh trong tuần, phần thưởng nâng cấp.',           category: 'weekly',  type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 25000,  targetCount: 50,  icon: '🥈', tags: ['follow', 'tuần'] },
  { id: 'weekly_watch_100',  title: 'Xem 100 Video Tuần',         description: 'Xem đủ 15s 100 video trong tuần từ sàn cung cấp.',           category: 'weekly',  type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động',     baseRewardXu: 35000,  targetCount: 100, icon: '🎯', tags: ['video', 'tuần'] },
  { id: 'weekly_share_20',   title: 'Lan Tỏa 20 Video',          description: 'Chia sẻ 20 video trong tuần ra ngoài.',                      category: 'weekly',  type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 22000,  targetCount: 20,  icon: '📣', tags: ['share', 'tuần'] },
  { id: 'weekly_live_60m',   title: 'Xem Live 60 Phút Tuần',     description: 'Xem tổng cộng 60 phút livestream trong tuần.',             category: 'weekly',  type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác',   baseRewardXu: 24000,  targetCount: 60,  icon: '🎙️', tags: ['live', 'tuần'] },
  { id: 'weekly_like_100',   title: 'Vua Thả Tim 100 Tim',       description: 'Thả tim 100 video trong tuần từ sàn cung cấp.',              category: 'weekly',  type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 30000,  targetCount: 100, icon: '👑', tags: ['tim', 'tuần'] },
  { id: 'weekly_comment_50', title: 'Chuyên Gia Seeding 50',     description: 'Để lại 50 bình luận chất lượng trong tuần.',              category: 'weekly',  type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 5 - Tiên Phong',   baseRewardXu: 30000,  targetCount: 50,  icon: '🎖️', tags: ['comment', 'tuần'] },
  { id: 'weekly_follow_100', title: 'Follow Huyền Thoại 100',    description: 'Follow 100 kênh trong tuần, thử thách Vàng.',                category: 'weekly',  type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 50000, targetCount: 100, icon: '💎', tags: ['follow', 'khó'] },
  { id: 'weekly_watch_200',  title: 'Marathon Xem 200 Video',    description: 'Xem 200 video trong tuần, danh hiệu Marathon Creator.',      category: 'weekly',  type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 65000, targetCount: 200, icon: '🏅', tags: ['video', 'tuần', 'khó'] },
  { id: 'weekly_share_50',   title: 'Đại Sứ Lan Tỏa 50 Share',   description: 'Chia sẻ 50 video ra ngoài trong tuần.',                    category: 'weekly',  type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 35000,  targetCount: 50,  icon: '🦅', tags: ['share', 'tuần'] },
  { id: 'weekly_live_180m',  title: 'Giữ Mắt 3 Giờ Live',        description: 'Xem tổng cộng 3 giờ livestream sàn trong tuần.',            category: 'weekly',  type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh',     baseRewardXu: 40000,  targetCount: 180, icon: '🌐', tags: ['live', 'tuần'] },
  { id: 'weekly_follow_200', title: 'Đại Chiến Follow 200',      description: 'Follow 200 kênh trong 7 ngày — chỉ dành cho Cao Thủ.',       category: 'weekly',  type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ',      baseRewardXu: 80000,  targetCount: 200, icon: '⚔️', tags: ['follow', 'khó'] },
  { id: 'weekly_watch_300',  title: 'Bất Khả Chiến Bại 300 Video', description: 'Xem đủ 300 video chiến dịch sàn trong tuần.',           category: 'weekly',  type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 100000,targetCount: 300, icon: '👑', tags: ['video', 'legend'] },

  // ---- SPECIAL & VIP MISSIONS (DÀNH CHO CẤP 7 -> CẤP 10) ----
  { id: 'special_follow_250',  title: 'Siêu Chiến Dịch 250 Follow', description: 'Theo dõi 250 kênh đối tác lớn trong tuần.',               category: 'special', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 60000,  targetCount: 250, icon: '⚔️', tags: ['follow', 'vip'] },
  { id: 'special_watch_500',   title: 'Huyền Thoại 500 Video',      description: 'Xem 500 video trong tuần — chỉ dành cho Kim Cương.',      category: 'special', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ',      baseRewardXu: 120000, targetCount: 500, icon: '💎', tags: ['video', 'kim cương'] },
  { id: 'special_live_300m',   title: 'Vua Livestream 5 Giờ',       description: 'Xem 5 giờ livestream trong tuần — Kim Cương VIP.',        category: 'special', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 80000,  targetCount: 300, icon: '👁️', tags: ['live', 'kim cương'] },
  { id: 'special_comment_100', title: 'Seeding Chuyên Nghiệp 100',  description: 'Để lại 100 bình luận chất lượng trong tuần.',              category: 'special', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh',     baseRewardXu: 40000,  targetCount: 100, icon: '🎙️', tags: ['comment', 'vip'] },
  { id: 'special_invite_10',   title: 'Đại Lý Chiêu Mộ 10 Người',  description: 'Mời 10 người đăng ký thành công trong tuần.',              category: 'special', type: 'invite',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh',     baseRewardXu: 70000,  targetCount: 10,  icon: '🌟', tags: ['invite', 'vip'] },
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

// ===== HÀM SINH NHIỆM VỤ (TÁCH BIỆT THEO 10 CẤP BẬC VÀ TIỂU NHIỆM VỤ CON) =====
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
  const userTierNum = tierCfg.tierNumber;

  // Package bonus slots
  const pkgKey = packageCategory || 'none';
  const bonusSlots = hasPaidPackage ? (RANK_MISSION_CONFIG.packageBonusSlots[pkgKey] ?? 2) : 0;
  const totalWeeklySlots = tierCfg.weeklyMissionsCount + Math.floor(bonusSlots / 2);

  // Lọc nhiệm vụ tuần và đặc biệt hợp lệ theo cấp bậc
  const eligibleWeekly = MISSION_POOL.filter((m) => {
    const minTier = getRankTierConfig(m.minRank);
    return minTier.tierNumber <= userTierNum;
  });

  const weeklyPool  = eligibleWeekly.filter(m => m.category === 'weekly');
  const specialPool = eligibleWeekly.filter(m => m.category === 'special');

  const now = new Date();
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const userHash = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const weeklySeed = (weekNum * 997 + userHash) >>> 0;

  const shuffledWeekly  = shuffleWithSeed(weeklyPool.length > 0 ? weeklyPool : MISSION_POOL.filter(m => m.category === 'weekly'), weeklySeed);
  const shuffledSpecial = shuffleWithSeed(specialPool, weeklySeed + 7);

  // Chọn đúng số lượng slot tuần & đặc biệt
  const pickedWeekly  = shuffledWeekly.slice(0, totalWeeklySlots);
  const pickedSpecial = (userTierNum >= 7 || hasPaidPackage) ? shuffledSpecial.slice(0, Math.max(1, Math.floor(bonusSlots / 2))) : [];

  // LẤY CHUẨN XÁC DANH SÁCH NHIỆM VỤ NGÀY CỦA CẤP BẬC HIỆN TẠI (KHÔNG RANDOM BỪA BÃI)
  const tierDailyDefs = TIER_DAILY_MISSIONS_MAP[userTierNum] || TIER_DAILY_MISSIONS_MAP[1];

  // Timestamp kết thúc tuần
  const dayOfWeek = now.getDay() || 7;
  const daysToMonday = 8 - dayOfWeek;
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + daysToMonday);
  weekEnd.setHours(0, 0, 0, 0);
  const weekEndIso = weekEnd.toISOString();

  // Timestamp kết thúc ngày (23:59:59)
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const todayEndIso = todayEnd.toISOString();

  // Mapper chuyển đổi sang UserWeeklyMission kèm mảng tiểu nhiệm vụ con (subMilestones)
  const toUserMission = (def: WeeklyMissionDef, isDaily: boolean = false): UserWeeklyMission => {
    const rewardXu = isDaily ? def.baseRewardXu : Math.max(10000, Math.round(def.baseRewardXu * tierCfg.rewardMultiplier));
    return {
      defId: def.id,
      title: def.title,
      description: def.description,
      type: def.type,
      category: def.category,
      difficulty: def.difficulty,
      source: 'platform',
      rewardXu,
      targetCount: def.targetCount,
      completedCount: 0,
      status: 'active',
      expiresAt: isDaily ? todayEndIso : weekEndIso,
      icon: def.icon,
      tags: def.tags,
      subMilestones: buildMissionSubMilestones(def.type, def.targetCount, 0, tierCfg.subMissionRewardXu ?? 10000)
    };
  };

  return [
    ...tierDailyDefs.map(d => toUserMission(d, true)),
    ...pickedWeekly.map(w => toUserMission(w, false)),
    ...pickedSpecial.map(s => toUserMission(s, false)),
  ];
}

