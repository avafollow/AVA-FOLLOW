import { WeeklyMissionDef, WeeklyMissionConfig, UserWeeklyMission, MissionRank, MissionType, MissionDifficulty, RankTierConfig } from '../types';

export const STREAK_REWARDS = {
  dailyAllClearBonus: 35000,
  weeklyStreakBonus: 350000,
  monthlyStreakBonus: 2000000,
};

// ===== CẤU HÌNH 10 CẤP BẬC THĂNG TIẾN TOÀN DIỆN (10 Rank Tiers System) =====
// subMissionRewardXu: Xu nhận được mỗi khi hoàn thành 1 nhiệm vụ con (tối thiểu 1.000 ở Cấp 1)
// subMissionCompleteBonusXu: Xu thưởng thêm khi hoàn thành TẤT CẢ nhiệm vụ con của 1 nhiệm vụ chính
// ⚡ CÀNG LÊN CẤP CÀNG KHÓ — Chỉ dành cho người kiên trì làm liên tục cả ngày!
export const TEN_TIER_CONFIG: Record<string, RankTierConfig> = {
  'Cấp 1 - Tập Sự': {
    tierNumber: 1,
    name: 'Cấp 1 - Tập Sự',
    shortTitle: 'Tập Sự (Đồng I)',
    badge: '🥉 Cấp 1',
    color: 'border-orange-500/40 text-orange-300 bg-orange-950/20',
    dailyMissionsCount: 2,
    weeklyMissionsCount: 2,
    rewardMultiplier: 1.0,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 0,
    dailyEstimatedEarningsXu: 10000,
    dailyTaskRewardTotal: 7000,
    dailyBundleRewardXu: 3000,
    dailyTasksSummary: '2 nhiệm vụ cực dễ: Xem 3 video FYP + Follow 1 kênh. Dành cho người mới bắt đầu, dễ hoàn thành trong 5-10 phút.',
    description: 'Cấp khởi đầu — 2 nhiệm vụ siêu đơn giản, kiếm 10.000 Xu/ngày (≈10.000 VNĐ). Làm xong trong 5 phút!',
    subMissionRewardXu: 1000,       // 1.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 500  // +500 Xu thưởng thêm khi xong hết
  },
  'Cấp 2 - Khởi Nghiệp': {
    tierNumber: 2,
    name: 'Cấp 2 - Khởi Nghiệp',
    shortTitle: 'Khởi Nghiệp (Đồng II)',
    badge: '🥉 Cấp 2',
    color: 'border-amber-600/40 text-amber-300 bg-amber-950/20',
    dailyMissionsCount: 3,
    weeklyMissionsCount: 2,
    rewardMultiplier: 1.2,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 10,
    dailyEstimatedEarningsXu: 20000,
    dailyTaskRewardTotal: 14000,
    dailyBundleRewardXu: 6000,
    dailyTasksSummary: '3 nhiệm vụ dễ: Xem 5 video, Follow 2 kênh, Thả tim 3 video. Hoàn thành trong 15-20 phút.',
    description: 'Cấp 2 — 3 nhiệm vụ đơn giản, kiếm 20.000 Xu/ngày. Bỏ 15 phút là xong!',
    subMissionRewardXu: 2000,       // 2.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 800  // +800 Xu thưởng thêm
  },
  'Cấp 3 - Năng Động': {
    tierNumber: 3,
    name: 'Cấp 3 - Năng Động',
    shortTitle: 'Năng Động (Bạc I)',
    badge: '🥈 Cấp 3',
    color: 'border-slate-400/40 text-slate-200 bg-slate-800/30',
    dailyMissionsCount: 4,
    weeklyMissionsCount: 3,
    rewardMultiplier: 1.4,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 25,
    dailyEstimatedEarningsXu: 40000,
    dailyTaskRewardTotal: 27000,
    dailyBundleRewardXu: 13000,
    dailyTasksSummary: '4 nhiệm vụ vừa: Xem 8 video, Follow 4 kênh, Thả tim 5 video, Bình luận 1 video. Cần ~30-40 phút.',
    description: 'Cấp 3 — 4 nhiệm vụ tăng dần, kiếm 40.000 Xu/ngày. Cần 30-40 phút kiên trì!',
    subMissionRewardXu: 3000,        // 3.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 1200  // +1.200 Xu thưởng thêm
  },
  'Cấp 4 - Tương Tác': {
    tierNumber: 4,
    name: 'Cấp 4 - Tương Tác',
    shortTitle: 'Tương Tác (Bạc II)',
    badge: '🥈 Cấp 4',
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20',
    dailyMissionsCount: 5,
    weeklyMissionsCount: 3,
    rewardMultiplier: 1.6,
    wheelSpinsBonus: 1,
    minCompletedTasksToUnlock: 50,
    dailyEstimatedEarningsXu: 60000,
    dailyTaskRewardTotal: 40000,
    dailyBundleRewardXu: 20000,
    dailyTasksSummary: '5 nhiệm vụ trung bình: Xem 12 video, Follow 6 kênh, Thả tim 10 video, Bình luận 2 video, Xem live 5 phút. Cần ~1 giờ.',
    description: 'Cấp 4 — 5 nhiệm vụ, kiếm 60.000 Xu/ngày. Cần ~1 giờ tập trung!',
    subMissionRewardXu: 4000,        // 4.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 1500  // +1.500 Xu thưởng thêm
  },
  'Cấp 5 - Tiên Phong': {
    tierNumber: 5,
    name: 'Cấp 5 - Tiên Phong',
    shortTitle: 'Tiên Phong (Vàng I)',
    badge: '🥇 Cấp 5',
    color: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20',
    dailyMissionsCount: 6,
    weeklyMissionsCount: 4,
    rewardMultiplier: 1.8,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 100,
    dailyEstimatedEarningsXu: 90000,
    dailyTaskRewardTotal: 60000,
    dailyBundleRewardXu: 30000,
    dailyTasksSummary: '6 nhiệm vụ khó hơn: Xem 20 video, Follow 10 kênh, Thả tim 15 video, Bình luận 3 video, Xem live 10 phút, Chia sẻ 2 video. Cần ~2 giờ.',
    description: 'Cấp 5 (Vàng) — 6 nhiệm vụ, kiếm 90.000 Xu/ngày + 2 Vòng Quay. Cần ~2 giờ kiên trì!',
    subMissionRewardXu: 5000,        // 5.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 2000  // +2.000 Xu thưởng thêm
  },
  'Cấp 6 - Chuyên Nghiệp': {
    tierNumber: 6,
    name: 'Cấp 6 - Chuyên Nghiệp',
    shortTitle: 'Chuyên Nghiệp (Vàng II)',
    badge: '🥇 Cấp 6',
    color: 'border-amber-400/40 text-amber-300 bg-amber-950/30',
    dailyMissionsCount: 7,
    weeklyMissionsCount: 4,
    rewardMultiplier: 2.0,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 200,
    dailyEstimatedEarningsXu: 120000,
    dailyTaskRewardTotal: 80000,
    dailyBundleRewardXu: 40000,
    dailyTasksSummary: '7 nhiệm vụ khó: Xem 25 video, Follow 15 kênh, Thả tim 20 video, Bình luận 5 video, Xem live 15 phút, Chia sẻ 5 video, Chuỗi tương tác 3 mốc. Cần ~3 giờ.',
    description: 'Cấp 6 (Chuyên Nghiệp) — 7 nhiệm vụ, kiếm 120.000 Xu/ngày + 2 Vòng Quay. Cần ~3 giờ tập trung!',
    subMissionRewardXu: 6000,        // 6.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 2500  // +2.500 Xu thưởng thêm
  },
  'Cấp 7 - Tinh Anh': {
    tierNumber: 7,
    name: 'Cấp 7 - Tinh Anh',
    shortTitle: 'Tinh Anh (Bạch Kim I)',
    badge: '💠 Cấp 7',
    color: 'border-blue-400/40 text-blue-300 bg-blue-950/30',
    dailyMissionsCount: 8,
    weeklyMissionsCount: 5,
    rewardMultiplier: 2.3,
    wheelSpinsBonus: 2,
    minCompletedTasksToUnlock: 400,
    dailyEstimatedEarningsXu: 160000,
    dailyTaskRewardTotal: 105000,
    dailyBundleRewardXu: 55000,
    dailyTasksSummary: '8 nhiệm vụ rất khó: Nhiều tác vụ xem video, follow, live, chia sẻ kết hợp. Cần ~4 giờ duy trì liên tục.',
    description: 'Cấp 7 (Bạch Kim) — 8 nhiệm vụ, kiếm 160.000 Xu/ngày + 2 Vòng Quay. Cần ~4 giờ kiên trì!',
    subMissionRewardXu: 7000,        // 7.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 3000  // +3.000 Xu thưởng thêm
  },
  'Cấp 8 - Thủ Lĩnh': {
    tierNumber: 8,
    name: 'Cấp 8 - Thủ Lĩnh',
    shortTitle: 'Thủ Lĩnh (Bạch Kim II)',
    badge: '💠 Cấp 8',
    color: 'border-indigo-400/40 text-indigo-300 bg-indigo-950/30',
    dailyMissionsCount: 9,
    weeklyMissionsCount: 5,
    rewardMultiplier: 2.6,
    wheelSpinsBonus: 3,
    minCompletedTasksToUnlock: 700,
    dailyEstimatedEarningsXu: 200000,
    dailyTaskRewardTotal: 130000,
    dailyBundleRewardXu: 70000,
    dailyTasksSummary: '9 nhiệm vụ thử thách cao: Combo xem live 30 phút, follow 20 kênh, bình luận seeding, chia sẻ nhiều. Cần ~5-6 giờ.',
    description: 'Cấp 8 (Thủ Lĩnh) — 9 nhiệm vụ, kiếm 200.000 Xu/ngày + 3 Vòng Quay. Cần cả buổi kiên trì!',
    subMissionRewardXu: 8000,        // 8.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 4000  // +4.000 Xu thưởng thêm
  },
  'Cấp 9 - Cao Thủ': {
    tierNumber: 9,
    name: 'Cấp 9 - Cao Thủ',
    shortTitle: 'Cao Thủ (Kim Cương I)',
    badge: '💎 Cấp 9',
    color: 'border-purple-400/40 text-purple-300 bg-purple-950/30',
    dailyMissionsCount: 10,
    weeklyMissionsCount: 6,
    rewardMultiplier: 3.0,
    wheelSpinsBonus: 3,
    minCompletedTasksToUnlock: 1200,
    dailyEstimatedEarningsXu: 250000,
    dailyTaskRewardTotal: 165000,
    dailyBundleRewardXu: 85000,
    dailyTasksSummary: '10 nhiệm vụ cực khó: Toàn bộ tác vụ nâng cao, live 45 phút, follow 30 kênh, bình luận seeding chuyên sâu... Cần làm liên tục 7-8 giờ.',
    description: 'Cấp 9 (Kim Cương) — 10 nhiệm vụ, kiếm 250.000 Xu/ngày + 3 Vòng Quay. Chỉ dành cho người kiên trì cả ngày!',
    subMissionRewardXu: 9000,        // 9.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 5000  // +5.000 Xu thưởng thêm
  },
  'Cấp 10 - Huyền Thoại': {
    tierNumber: 10,
    name: 'Cấp 10 - Huyền Thoại',
    shortTitle: 'Huyền Thoại (Kim Cương VIP)',
    badge: '👑 Cấp 10',
    color: 'border-pink-500/50 text-pink-300 bg-gradient-to-r from-pink-950/40 to-purple-950/40',
    dailyMissionsCount: 12,
    weeklyMissionsCount: 7,
    rewardMultiplier: 3.5,
    wheelSpinsBonus: 5,
    minCompletedTasksToUnlock: 2000,
    dailyEstimatedEarningsXu: 300000,
    dailyTaskRewardTotal: 200000,
    dailyBundleRewardXu: 100000,
    dailyTasksSummary: '12 nhiệm vụ huyền thoại: Mọi loại tác vụ ở cấp độ tối đa, live 60 phút, 50 follow, 100 thả tim, seeding chuyên nghiệp... Phải làm liên tục cả ngày 8-10 giờ!',
    description: '⚡ CẤP BẬC TỐI THƯỢNG — 12 nhiệm vụ, kiếm tới 300.000 Xu/ngày + 5 Vòng Quay! Chỉ dành cho những người thực sự kiên trì và cống hiến cả ngày!',
    subMissionRewardXu: 10000,       // 10.000 Xu/nhiệm vụ con
    subMissionCompleteBonusXu: 6000  // +6.000 Xu thưởng thêm
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

// ===== BẢNG PHÂN BỔ NHIỆM VỤ CHÍNH CHO TỪNG CẤP BẬC (10 CẤP BẬC) =====
// Cấp 1 = 2 nhiệm vụ cực dễ (10k Xu) → Cấp 10 = 12 nhiệm vụ cực khó (300k Xu)
// Càng lên cấp càng khó, yêu cầu thời gian và sự kiên trì nhiều hơn trong ngày
export const TIER_DAILY_MISSIONS_MAP: Record<number, WeeklyMissionDef[]> = {
  // 🥉 CẤP 1 - TẬP SỰ (2 NV cực dễ • Thu nhập: 10.000 Xu/ngày • Làm trong 5-10 phút)
  1: [
    { id: 't1_w3', title: 'Xem 3 video FYP (15s/video)', description: 'Xem đủ 15 giây 3 video trên For You Page. Siêu đơn giản, dành cho người mới.', category: 'daily', type: 'watch', difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 4000, targetCount: 3, icon: '🎬', tags: ['video', 'dễ'] },
    { id: 't1_f1', title: 'Theo dõi 1 kênh TikTok chỉ định', description: 'Follow 1 kênh TikTok được hệ thống phân công. Chỉ cần 1 cú bấm!', category: 'daily', type: 'follow', difficulty: 'easy', source: 'platform', minRank: 'Cấp 1 - Tập Sự', baseRewardXu: 3000, targetCount: 1, icon: '👤', tags: ['follow', 'dễ'] }
  ],

  // 🥉 CẤP 2 - KHỞI NGHIỆP (3 NV dễ • Thu nhập: 20.000 Xu/ngày • Làm trong 15-20 phút)
  2: [
    { id: 't2_w5',  title: 'Xem 5 video FYP đề xuất',      description: 'Xem đủ 15 giây 5 video trên dòng đề xuất sàn.',       category: 'daily', type: 'watch',  difficulty: 'easy', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 5000, targetCount: 5, icon: '🎬', tags: ['video'] },
    { id: 't2_f2',  title: 'Follow 2 kênh TikTok chất lượng', description: 'Theo dõi 2 kênh được hệ thống phân bổ hôm nay.',   category: 'daily', type: 'follow', difficulty: 'easy', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 5000, targetCount: 2, icon: '👥', tags: ['follow'] },
    { id: 't2_l3',  title: 'Thả tim 3 video chiến dịch',    description: 'Thả tim tương tác 3 video trên dòng tin hiện tại.', category: 'daily', type: 'like',   difficulty: 'easy', source: 'platform', minRank: 'Cấp 2 - Khởi Nghiệp', baseRewardXu: 4000, targetCount: 3, icon: '❤️', tags: ['tim'] }
  ],

  // 🥈 CẤP 3 - NĂNG ĐỘNG (4 NV vừa • Thu nhập: 40.000 Xu/ngày • Làm trong 30-40 phút)
  3: [
    { id: 't3_w8',  title: 'Xem 8 video FYP đề xuất',       description: 'Xem đủ 15 giây 8 video chiến dịch sàn.',            category: 'daily', type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 7000,  targetCount: 8, icon: '📺', tags: ['video'] },
    { id: 't3_f4',  title: 'Follow 4 kênh TikTok',          description: 'Theo dõi 4 kênh TikTok được phân công hôm nay.',    category: 'daily', type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 7000,  targetCount: 4, icon: '🌟', tags: ['follow'] },
    { id: 't3_l5',  title: 'Thả tim 5 video chiến dịch',    description: 'Thả tim 5 video TikTok trên bảng tin hôm nay.',     category: 'daily', type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 7000,  targetCount: 5, icon: '💖', tags: ['tim'] },
    { id: 't3_c1',  title: 'Bình luận 1 video tích cực',    description: 'Để lại 1 bình luận có nội dung tốt trên video.',   category: 'daily', type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 3 - Năng Động', baseRewardXu: 6000,  targetCount: 1, icon: '💬', tags: ['comment'] }
  ],

  // 🥈 CẤP 4 - TƯƠNG TÁC (5 NV trung bình • Thu nhập: 60.000 Xu/ngày • Làm trong ~1 giờ)
  4: [
    { id: 't4_w12', title: 'Xem 12 video FYP liên tiếp',    description: 'Xem đủ 15 giây 12 video chiến dịch sàn.',           category: 'daily', type: 'watch',   difficulty: 'easy',   source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 9000,  targetCount: 12, icon: '🔥', tags: ['video'] },
    { id: 't4_f6',  title: 'Follow 6 kênh TikTok',          description: 'Theo dõi 6 kênh đối soát sàn chỉ định hôm nay.',   category: 'daily', type: 'follow',  difficulty: 'easy',   source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 9000,  targetCount: 6,  icon: '🌟', tags: ['follow'] },
    { id: 't4_l10', title: 'Thả tim 10 video chiến dịch',   description: 'Thả tim tương tác 10 video trên luồng phân phối.', category: 'daily', type: 'like',    difficulty: 'easy',   source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 8000,  targetCount: 10, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't4_c2',  title: 'Bình luận 2 video tích cực',    description: 'Để lại 2 bình luận ý nghĩa trên video sàn.',       category: 'daily', type: 'comment', difficulty: 'easy',   source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 8000,  targetCount: 2,  icon: '💬', tags: ['comment'] },
    { id: 't4_v5',  title: 'Xem live giữ mắt 5 phút',       description: 'Xem ít nhất 1 phiên livestream liên tục 5 phút.',  category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 4 - Tương Tác', baseRewardXu: 8000,  targetCount: 5,  icon: '🔴', tags: ['live'] }
  ],

  // 🥇 CẤP 5 - TIÊN PHONG (6 NV khó hơn • Thu nhập: 90.000 Xu/ngày • Cần ~2 giờ kiên trì)
  5: [
    { id: 't5_w20', title: 'Xem 20 video FYP đề xuất',      description: 'Xem 20 video chiến dịch trọng điểm đủ thời lượng.',category: 'daily', type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 11000, targetCount: 20, icon: '🎬', tags: ['video'] },
    { id: 't5_f10', title: 'Follow 10 kênh TikTok chỉ định', description: 'Theo dõi 10 kênh đối tác của hệ thống hôm nay.',  category: 'daily', type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 11000, targetCount: 10, icon: '👑', tags: ['follow'] },
    { id: 't5_l15', title: 'Thả tim 15 video chiến dịch',   description: 'Thả tim tương tác 15 video chất lượng cao.',       category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 10000, targetCount: 15, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't5_c3',  title: 'Bình luận 3 video chất lượng',  description: 'Để lại 3 bình luận tích cực trên video chiến dịch.',category: 'daily', type: 'comment', difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 10000, targetCount: 3,  icon: '✍️', tags: ['comment'] },
    { id: 't5_v10', title: 'Xem live giữ mắt 10 phút',      description: 'Xem livestream liên tục đủ 10 phút.',              category: 'daily', type: 'live',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 10000, targetCount: 10, icon: '🎙️', tags: ['live'] },
    { id: 't5_s2',  title: 'Chia sẻ 2 video ra ngoài',      description: 'Chia sẻ 2 video tới bạn bè hoặc hội nhóm.',        category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 5 - Tiên Phong', baseRewardXu: 8000,  targetCount: 2,  icon: '📤', tags: ['share'] }
  ],

  // 🥇 CẤP 6 - CHUYÊN NGHIỆP (7 NV khó • Thu nhập: 120.000 Xu/ngày • Cần ~3 giờ)
  6: [
    { id: 't6_w25', title: 'Xem 25 video FYP chuyên sâu',   description: 'Xem 25 video FYP đủ 15 giây từ luồng sàn.',         category: 'daily', type: 'watch',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 13000, targetCount: 25, icon: '🎬', tags: ['video'] },
    { id: 't6_f15', title: 'Follow 15 kênh Creator',        description: 'Theo dõi 15 kênh Creator trong kho nhiệm vụ.',      category: 'daily', type: 'follow',  difficulty: 'medium', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 13000, targetCount: 15, icon: '👑', tags: ['follow'] },
    { id: 't6_l20', title: 'Thả tim 20 video cộng đồng',    description: 'Thả tim 20 video TikTok của cộng đồng sáng tạo.',   category: 'daily', type: 'like',    difficulty: 'medium', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 11000, targetCount: 20, icon: '💖', tags: ['tim'] },
    { id: 't6_c5',  title: 'Bình luận 5 video chuyên sâu',  description: 'Để lại 5 bình luận chất lượng chuyên sâu.',         category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 12000, targetCount: 5,  icon: '✍️', tags: ['comment'] },
    { id: 't6_v15', title: 'Xem live 15 phút liên tục',     description: 'Xem phiên livestream TikTok đủ 15 phút.',           category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 12000, targetCount: 15, icon: '🎙️', tags: ['live'] },
    { id: 't6_s5',  title: 'Chia sẻ 5 video ra cộng đồng',  description: 'Lan tỏa 5 video chiến dịch tới các nhóm.',          category: 'daily', type: 'share',   difficulty: 'medium', source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 10000, targetCount: 5,  icon: '📣', tags: ['share'] },
    { id: 't6_k3',  title: 'Chuỗi tương tác 3 mốc',        description: 'Tương tác liên tục không gián đoạn 3 mốc trong ngày.',category: 'daily', type: 'streak', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 6 - Chuyên Nghiệp', baseRewardXu: 9000,  targetCount: 3,  icon: '⚡', tags: ['streak'] }
  ],

  // 💠 CẤP 7 - TINH ANH (8 NV rất khó • Thu nhập: 160.000 Xu/ngày • Cần ~4 giờ)
  7: [
    { id: 't7_w30', title: 'Xem 30 video chiến dịch',        description: 'Xem đủ 15 giây 30 video chiến dịch doanh nghiệp.', category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 15000, targetCount: 30, icon: '🎬', tags: ['video'] },
    { id: 't7_f20', title: 'Follow 20 kênh đối tác',         description: 'Theo dõi 20 kênh thương hiệu đối tác lớn.',        category: 'daily', type: 'follow',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 15000, targetCount: 20, icon: '💎', tags: ['follow'] },
    { id: 't7_l30', title: 'Thả tim 30 video chiến dịch',    description: 'Thả tim 30 video được phân bổ trong ngày.',         category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 13000, targetCount: 30, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't7_c8',  title: 'Bình luận 8 video chất lượng',   description: 'Để lại 8 bình luận tích cực và đánh giá cao.',      category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 14000, targetCount: 8,  icon: '✍️', tags: ['comment'] },
    { id: 't7_v20', title: 'Giữ mắt live 20 phút',           description: 'Giữ mắt phiên livestream TikTok Shop 20 phút.',     category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 14000, targetCount: 20, icon: '🎙️', tags: ['live'] },
    { id: 't7_s8',  title: 'Chia sẻ 8 video ra mạng xã hội', description: 'Lan tỏa 8 video chiến dịch tới các nhóm cộng đồng.',category: 'daily', type: 'share',  difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 12000, targetCount: 8,  icon: '📣', tags: ['share'] },
    { id: 't7_g3',  title: 'Tương tác 3 giỏ hàng live',      description: 'Khám phá sản phẩm giỏ hàng trên 3 phiên live.',     category: 'daily', type: 'post',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 12000, targetCount: 3,  icon: '🛍️', tags: ['shop'] },
    { id: 't7_k5',  title: 'Chuỗi tương tác 5 mốc',          description: 'Duy trì luồng tương tác liên tục 5 mốc trong ngày.',category: 'daily', type: 'streak', difficulty: 'expert', source: 'platform', minRank: 'Cấp 7 - Tinh Anh', baseRewardXu: 10000, targetCount: 5,  icon: '⚡', tags: ['streak'] }
  ],

  // 💠 CẤP 8 - THỦ LĨNH (9 NV thử thách • Thu nhập: 200.000 Xu/ngày • Cần ~5-6 giờ)
  8: [
    { id: 't8_w40', title: 'Xem 40 video chiến dịch',        description: 'Xem trọn vẹn 40 video từ các đối tác lớn của sàn.', category: 'daily', type: 'watch',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 16000, targetCount: 40, icon: '🎬', tags: ['video'] },
    { id: 't8_f25', title: 'Follow 25 kênh Creator VIP',     description: 'Theo dõi 25 kênh Creator uy tín hạng cao.',          category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 16000, targetCount: 25, icon: '👑', tags: ['follow'] },
    { id: 't8_l40', title: 'Thả tim 40 video cộng đồng',     description: 'Thả tim 40 video cộng đồng phân phối.',              category: 'daily', type: 'like',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 14000, targetCount: 40, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't8_c10', title: 'Bình luận 10 video seeding',     description: 'Seeding 10 bình luận mang giá trị thảo luận cao.',   category: 'daily', type: 'comment', difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 15000, targetCount: 10, icon: '✍️', tags: ['comment'] },
    { id: 't8_v30', title: 'Giữ mắt live 30 phút',           description: 'Xem và giữ mắt phiên livestream liên tục 30 phút.', category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 15000, targetCount: 30, icon: '🎙️', tags: ['live'] },
    { id: 't8_s12', title: 'Chia sẻ 12 video ra ngoài',      description: 'Chia sẻ 12 video chiến dịch tới các hội nhóm lớn.', category: 'daily', type: 'share',   difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 13000, targetCount: 12, icon: '📣', tags: ['share'] },
    { id: 't8_lv3', title: 'Tương tác 3 phiên live shop',    description: 'Tham gia tương tác trên 3 phiên live trọng điểm.',  category: 'daily', type: 'live',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 13000, targetCount: 3,  icon: '👁️', tags: ['live'] },
    { id: 't8_g5',  title: 'Tương tác 5 sản phẩm giỏ hàng', description: 'Xem chi tiết và bấm quan tâm 5 sản phẩm live shop.',category: 'daily', type: 'post',    difficulty: 'hard',   source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 13000, targetCount: 5,  icon: '🛍️', tags: ['shop'] },
    { id: 't8_k8',  title: 'Chuỗi tương tác 8 mốc',         description: 'Duy trì chuỗi xem và tương tác 8 mốc liên tục.',    category: 'daily', type: 'streak',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 8 - Thủ Lĩnh', baseRewardXu: 12000, targetCount: 8,  icon: '⚡', tags: ['streak'] }
  ],

  // 💎 CẤP 9 - CAO THỦ (10 NV cực khó • Thu nhập: 250.000 Xu/ngày • Cần 7-8 giờ)
  9: [
    { id: 't9_w50',  title: 'Marathon xem 50 video FYP',     description: 'Xem 50 video For You Page chiến dịch sàn.',          category: 'daily', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 17000, targetCount: 50, icon: '🎬', tags: ['video'] },
    { id: 't9_f30',  title: 'Follow 30 kênh đối tác lớn',   description: 'Theo dõi 30 kênh đối tác chiến lược Kim Cương.',     category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 17000, targetCount: 30, icon: '💎', tags: ['follow'] },
    { id: 't9_l50',  title: 'Thả tim 50 video chiến dịch',  description: 'Thả tim 50 video TikTok trên hệ thống đối soát.',    category: 'daily', type: 'like',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 15000, targetCount: 50, icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't9_c12',  title: 'Bình luận 12 video chuyên sâu', description: 'Để lại 12 bình luận đánh giá chuyên sâu.',           category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 16000, targetCount: 12, icon: '✍️', tags: ['comment'] },
    { id: 't9_v45',  title: 'Giữ mắt live 45 phút',         description: 'Xem liên tục phiên livestream TikTok Shop 45 phút.', category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 16000, targetCount: 45, icon: '🎙️', tags: ['live'] },
    { id: 't9_s15',  title: 'Chia sẻ 15 video mạng xã hội', description: 'Lan tỏa 15 video ra các nền tảng Facebook, Zalo.',  category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 14000, targetCount: 15, icon: '📣', tags: ['share'] },
    { id: 't9_lv5',  title: 'Tương tác 5 phiên live VIP',   description: 'Tương tác trên 5 phiên livestream bán hàng VIP.',    category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 15000, targetCount: 5,  icon: '👁️', tags: ['live'] },
    { id: 't9_g8',   title: 'Tương tác 8 giỏ hàng live',   description: 'Khám phá gian hàng tại 8 phiên livestream lớn.',     category: 'daily', type: 'post',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 14000, targetCount: 8,  icon: '🛍️', tags: ['shop'] },
    { id: 't9_sh5',  title: 'Chia sẻ 5 phiên live ra nhóm', description: 'Chia sẻ 5 luồng livestream tới các hội nhóm.',       category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 13000, targetCount: 5,  icon: '📢', tags: ['share'] },
    { id: 't9_k10',  title: 'Chuỗi tương tác 10 mốc',      description: 'Đạt chuỗi tương tác liên tục không gián đoạn 10 mốc.',category: 'daily', type: 'streak', difficulty: 'expert', source: 'platform', minRank: 'Cấp 9 - Cao Thủ', baseRewardXu: 13000, targetCount: 10, icon: '👑', tags: ['streak'] }
  ],

  // 👑 CẤP 10 - HUYỀN THOẠI (12 NV siêu khó • Thu nhập: 300.000 Xu/ngày • Cần cả ngày 8-10 giờ)
  10: [
    { id: 't10_w60',  title: 'Đại đội xem 60 video FYP',     description: 'Xem 60 video chất lượng cao từ kho chiến dịch sàn.', category: 'daily', type: 'watch',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 18000, targetCount: 60, icon: '🎬', tags: ['video', 'legend'] },
    { id: 't10_f50',  title: 'Follow 50 kênh đối tác VIP',   description: 'Theo dõi 50 kênh đối tác VIP cấp cao nhất sàn.',    category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 18000, targetCount: 50, icon: '👑', tags: ['follow', 'legend'] },
    { id: 't10_l100', title: 'Thả tim 100 video chiến dịch', description: 'Thả tim 100 video TikTok trên hệ thống chiến dịch.', category: 'daily', type: 'like',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 16000, targetCount: 100,icon: '❤️‍🔥', tags: ['tim'] },
    { id: 't10_c20',  title: 'Bình luận 20 video đỉnh cao',  description: 'Viết 20 bình luận chất lượng đỉnh cao trên video.', category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 17000, targetCount: 20, icon: '✍️', tags: ['comment'] },
    { id: 't10_v60',  title: 'Giữ mắt live 60 phút',         description: 'Xem livestream giữ mắt liên tục đủ 60 phút.',       category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 17000, targetCount: 60, icon: '🎙️', tags: ['live', 'legend'] },
    { id: 't10_s20',  title: 'Chia sẻ 20 video ra cộng đồng', description: 'Lan tỏa 20 video chiến dịch ra các mạng xã hội.', category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 15000, targetCount: 20, icon: '📣', tags: ['share'] },
    { id: 't10_lv8',  title: 'Giữ mắt 8 phiên live VIP',    description: 'Tham gia tương tác trên 8 phiên live đối tác VIP.',  category: 'daily', type: 'live',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 16000, targetCount: 8,  icon: '👁️', tags: ['live'] },
    { id: 't10_g10',  title: 'Tương tác 10 sản phẩm live',   description: 'Khám phá và bấm theo dõi 10 sản phẩm giỏ hàng.',   category: 'daily', type: 'post',    difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 15000, targetCount: 10, icon: '🛍️', tags: ['shop'] },
    { id: 't10_sh10', title: 'Chia sẻ 10 phiên live ra nhóm', description: 'Chia sẻ 10 luồng livestream tới các group lớn.',   category: 'daily', type: 'share',   difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 14000, targetCount: 10, icon: '📢', tags: ['share'] },
    { id: 't10_c12',  title: 'Bình luận 12 video live chất lượng', description: 'Để lại 12 bình luận tư vấn tương tác trên live.', category: 'daily', type: 'comment', difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 15000, targetCount: 12, icon: '💬', tags: ['comment'] },
    { id: 't10_ds15', title: 'Đối soát 15 kênh cộng đồng',  description: 'Hỗ trợ đối soát dữ liệu 15 kênh cộng đồng.',        category: 'daily', type: 'follow',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 14000, targetCount: 15, icon: '⚔️', tags: ['follow'] },
    { id: 't10_k15',  title: 'Chuỗi tương tác 15 mốc',      description: 'Đại chiến chuỗi tương tác liên tục 15 mốc cả ngày.', category: 'daily', type: 'streak',  difficulty: 'expert', source: 'platform', minRank: 'Cấp 10 - Huyền Thoại', baseRewardXu: 15000, targetCount: 15, icon: '💎', tags: ['legend'] }
  ]
};

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

