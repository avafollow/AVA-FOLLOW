/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  AVA ANTI-FRAUD ENGINE v2.0 - HỆ THỐNG CHỐNG GIAN LẬN ĐA LỚP              ║
 * ║                                                                              ║
 * ║  5 LỚP BẢO VỆ:                                                              ║
 * ║  1. Minimum Time Lock       - Nút xác nhận bị khóa N giây                  ║
 * ║  2. Tab Visibility Tracking - Phát hiện user có thực sự chuyển tab không    ║
 * ║  3. Trust Score System      - Điểm tin cậy 0-100, trừ khi gian lận         ║
 * ║  4. 30-Day Follow Commitment - Cam kết không unfollow trong 30 ngày         ║
 * ║  5. Live Heartbeat          - Chỉ tính giờ khi tab đang active              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type FraudActionType = 'follow' | 'like' | 'comment' | 'share' | 'watch_video' | 'watch_live';

export interface ActionProof {
  action: FraudActionType;
  taskId: string;
  userHandle: string;
  tiktokUrl: string;
  openedAt: number;
  confirmedAt?: number;
  tabTimeSpentMs: number;
  tabLeftCount: number;
  fraudFlags: string[];
  isValid: boolean;
  fraudScore: number;
  txHash?: string;
}

export interface FraudCheckResult {
  allowed: boolean;
  reason: string;
  waitMoreMs?: number;
  fraudScore: number;
  flags: string[];
}

export interface TrustProfile {
  userHandle: string;
  trustScore: number;
  totalActions: number;
  fraudAttempts: number;
  lastFraudAt?: string;
  isBlocked: boolean;
  blockedUntil?: string;
  updatedAt: string;
}

export interface FollowCommitment {
  targetHandle: string;
  userHandle: string;
  followedAt: string;
  commitExpiresAt: string;
  coinsEarned: number;
  txHash: string;
  status: 'active' | 'expired' | 'violated';
  violatedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS - THỜI GIAN TỐI THIỂU (GIÂY)
// ─────────────────────────────────────────────────────────────

export const MIN_CONFIRM_SECONDS: Record<FraudActionType, number> = {
  follow:      45,
  like:        30,
  comment:     60,
  share:       20,
  watch_video: 15,
  watch_live:  180,
};

export const MIN_TAB_TIME_MS: Record<FraudActionType, number> = {
  follow:      20000,
  like:        15000,
  comment:     30000,
  share:       10000,
  watch_video: 14000,
  watch_live:  170000,
};

export const TRUST_THRESHOLD_HOLD = 60;
export const TRUST_THRESHOLD_BLOCK = 30;

const TRUST_PROFILE_KEY = (user: string) => `ava_trust_${user.replace(/^@+/, '')}`;
const FOLLOW_COMMITMENTS_KEY = (user: string) => `ava_commitments_${user.replace(/^@+/, '')}`;
const FRAUD_LOG_KEY = 'ava_fraud_log_v2';

// ─────────────────────────────────────────────────────────────
// 1. TAB VISIBILITY TRACKER
// ─────────────────────────────────────────────────────────────

export class TabVisibilityTracker {
  private hiddenAt: number | null = null;
  private totalHiddenMs: number = 0;
  private tabLeftCount: number = 0;
  private isTracking: boolean = false;
  private handler: (() => void) | null = null;

  start() {
    if (this.isTracking) return;
    this.isTracking = true;
    this.hiddenAt = null;
    this.totalHiddenMs = 0;
    this.tabLeftCount = 0;

    this.handler = () => {
      if (document.hidden) {
        this.hiddenAt = Date.now();
        this.tabLeftCount++;
      } else {
        if (this.hiddenAt !== null) {
          this.totalHiddenMs += Date.now() - this.hiddenAt;
          this.hiddenAt = null;
        }
      }
    };

    document.addEventListener('visibilitychange', this.handler);
  }

  stop(): { totalHiddenMs: number; tabLeftCount: number } {
    if (!this.isTracking) return { totalHiddenMs: this.totalHiddenMs, tabLeftCount: this.tabLeftCount };
    if (this.hiddenAt !== null) {
      this.totalHiddenMs += Date.now() - this.hiddenAt;
      this.hiddenAt = null;
    }
    if (this.handler) {
      document.removeEventListener('visibilitychange', this.handler);
      this.handler = null;
    }
    this.isTracking = false;
    return { totalHiddenMs: this.totalHiddenMs, tabLeftCount: this.tabLeftCount };
  }

  getStats(): { totalHiddenMs: number; tabLeftCount: number; currentlyHidden: boolean } {
    const currentHidden = this.hiddenAt !== null ? Date.now() - this.hiddenAt : 0;
    return {
      totalHiddenMs: this.totalHiddenMs + currentHidden,
      tabLeftCount: this.tabLeftCount,
      currentlyHidden: this.hiddenAt !== null
    };
  }

  reset() {
    this.stop();
    this.totalHiddenMs = 0;
    this.tabLeftCount = 0;
    this.hiddenAt = null;
    this.isTracking = false;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. FRAUD CHECK ENGINE
// ─────────────────────────────────────────────────────────────

export function checkFraudProof(proof: ActionProof): FraudCheckResult {
  const flags: string[] = [];
  let fraudScore = 0;
  const now = Date.now();
  const elapsedMs = now - proof.openedAt;
  const minMs = MIN_CONFIRM_SECONDS[proof.action] * 1000;
  const minTabMs = MIN_TAB_TIME_MS[proof.action];

  // Kiểm tra 1: Thời gian tối thiểu chưa đủ
  if (elapsedMs < minMs) {
    const waitMoreMs = minMs - elapsedMs;
    return {
      allowed: false,
      reason: `⏳ Vui lòng đợi thêm ${Math.ceil(waitMoreMs / 1000)}s nữa.`,
      waitMoreMs,
      fraudScore: 40,
      flags: ['TOO_FAST']
    };
  }

  // Kiểm tra 2: Phải rời tab ít nhất 1 lần
  if (proof.tabLeftCount === 0) {
    flags.push('NO_TAB_SWITCH');
    return {
      allowed: false,
      reason: `⚠️ Hệ thống chưa phát hiện bạn mở TikTok. Vui lòng bấm "Mở TikTok", thực hiện thao tác thật, rồi quay lại xác nhận.`,
      fraudScore: 60,
      flags
    };
  }

  // Kiểm tra 3: Thời gian ở tab TikTok đủ không?
  if (proof.tabTimeSpentMs < minTabMs * 0.5) {
    flags.push('INSUFFICIENT_TAB_TIME');
    fraudScore += 40;
    return {
      allowed: false,
      reason: `⚠️ Thời gian ở TikTok quá ngắn (${Math.ceil(proof.tabTimeSpentMs / 1000)}s / tối thiểu ${Math.ceil(minTabMs / 1000)}s). Vui lòng thực hiện thao tác thật.`,
      fraudScore,
      flags
    };
  }

  if (proof.tabTimeSpentMs < minTabMs) {
    flags.push('SHORT_TAB_TIME');
    fraudScore += 15;
  }

  const finalScore = Math.min(100, fraudScore);
  return {
    allowed: true,
    reason: finalScore > 0
      ? `⚠️ Xác minh OK (${flags.length} dấu hiệu nhỏ đã ghi nhận).`
      : `✅ Xác minh hợp lệ. Tương tác đã được ghi nhận.`,
    fraudScore: finalScore,
    flags
  };
}

// ─────────────────────────────────────────────────────────────
// 3. TRUST SCORE MANAGER
// ─────────────────────────────────────────────────────────────

export function getTrustProfile(userHandle: string): TrustProfile {
  const clean = userHandle.replace(/^@+/, '');
  if (typeof window === 'undefined') return createDefaultTrust(clean);
  try {
    const raw = localStorage.getItem(TRUST_PROFILE_KEY(clean));
    return raw ? JSON.parse(raw) : createDefaultTrust(clean);
  } catch { return createDefaultTrust(clean); }
}

function createDefaultTrust(userHandle: string): TrustProfile {
  return { userHandle, trustScore: 100, totalActions: 0, fraudAttempts: 0, isBlocked: false, updatedAt: new Date().toISOString() };
}

export function saveTrustProfile(profile: TrustProfile): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(TRUST_PROFILE_KEY(profile.userHandle), JSON.stringify(profile)); } catch { /**/ }
}

export function applyFraudPenalty(userHandle: string, fraudScore: number, flags: string[]): TrustProfile {
  const profile = getTrustProfile(userHandle);
  profile.trustScore = Math.max(0, profile.trustScore - Math.ceil(fraudScore * 0.3));
  profile.fraudAttempts++;
  profile.lastFraudAt = new Date().toISOString();
  profile.updatedAt = new Date().toISOString();
  if (profile.trustScore < TRUST_THRESHOLD_BLOCK) {
    profile.isBlocked = true;
    profile.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }
  saveTrustProfile(profile);
  appendFraudLog({ userHandle, action: 'fraud_detected', flags, fraudScore, trustScoreAfter: profile.trustScore, timestamp: new Date().toISOString() });
  return profile;
}

export function applySuccessReward(userHandle: string): TrustProfile {
  const profile = getTrustProfile(userHandle);
  profile.trustScore = Math.min(100, profile.trustScore + 1);
  profile.totalActions++;
  profile.updatedAt = new Date().toISOString();
  saveTrustProfile(profile);
  return profile;
}

export function isUserBlocked(userHandle: string): { blocked: boolean; reason?: string; unblockAt?: string } {
  const profile = getTrustProfile(userHandle);
  if (!profile.isBlocked) return { blocked: false };
  if (profile.blockedUntil && Date.now() > new Date(profile.blockedUntil).getTime()) {
    profile.isBlocked = false;
    profile.blockedUntil = undefined;
    profile.trustScore = Math.max(35, profile.trustScore);
    saveTrustProfile(profile);
    return { blocked: false };
  }
  return { blocked: true, reason: `Tài khoản bị tạm khóa do gian lận (${profile.fraudAttempts} lần).`, unblockAt: profile.blockedUntil };
}

// ─────────────────────────────────────────────────────────────
// 4. FOLLOW COMMITMENT (30 ngày)
// ─────────────────────────────────────────────────────────────

export function createFollowCommitment(userHandle: string, targetHandle: string, coinsEarned: number, txHash: string): FollowCommitment {
  const clean = userHandle.replace(/^@+/, '');
  const cleanTarget = targetHandle.replace(/^@+/, '');
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const commitment: FollowCommitment = {
    targetHandle: `@${cleanTarget}`, userHandle: `@${clean}`,
    followedAt: now.toISOString(), commitExpiresAt: expiry.toISOString(),
    coinsEarned, txHash, status: 'active'
  };
  if (typeof window !== 'undefined') {
    try {
      const key = FOLLOW_COMMITMENTS_KEY(clean);
      const existing: FollowCommitment[] = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(commitment);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch { /**/ }
  }
  return commitment;
}

export function getFollowCommitments(userHandle: string): FollowCommitment[] {
  const clean = userHandle.replace(/^@+/, '');
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FOLLOW_COMMITMENTS_KEY(clean)) || '[]'); }
  catch { return []; }
}

export function reportUnfollowViolation(userHandle: string, targetHandle: string): { violated: boolean; coinsDeducted: number; message: string } {
  const clean = userHandle.replace(/^@+/, '');
  const cleanTarget = targetHandle.replace(/^@+/, '');
  const commitments = getFollowCommitments(clean);
  const idx = commitments.findIndex(c => c.targetHandle === `@${cleanTarget}` && c.status === 'active');
  if (idx === -1) return { violated: false, coinsDeducted: 0, message: 'Không tìm thấy cam kết.' };
  const commitment = commitments[idx];
  commitments[idx] = { ...commitment, status: 'violated', violatedAt: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(FOLLOW_COMMITMENTS_KEY(clean), JSON.stringify(commitments)); } catch { /**/ }
  }
  applyFraudPenalty(clean, 40, ['UNFOLLOW_VIOLATION']);
  return { violated: true, coinsDeducted: commitment.coinsEarned, message: `⚠️ Vi phạm cam kết Follow 30 ngày kênh @${cleanTarget}. Trừ ${commitment.coinsEarned} Xu.` };
}

// ─────────────────────────────────────────────────────────────
// 5. LIVE WATCH HEARTBEAT
// ─────────────────────────────────────────────────────────────

export class LiveWatchHeartbeat {
  private startTime: number = 0;
  private activeTimeMs: number = 0;
  private lastActiveAt: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private visibilityHandler: (() => void) | null = null;
  private isRunning: boolean = false;

  start(onTick: (activeSeconds: number, totalSeconds: number, isActive: boolean) => void) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastActiveAt = Date.now();
    this.activeTimeMs = 0;

    this.visibilityHandler = () => {
      if (document.hidden) {
        if (this.lastActiveAt > 0) { this.activeTimeMs += Date.now() - this.lastActiveAt; this.lastActiveAt = 0; }
      } else {
        this.lastActiveAt = Date.now();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.intervalId = setInterval(() => {
      const isActive = !document.hidden && this.lastActiveAt > 0;
      const currentActive = isActive ? this.activeTimeMs + (Date.now() - this.lastActiveAt) : this.activeTimeMs;
      onTick(Math.floor(currentActive / 1000), Math.floor((Date.now() - this.startTime) / 1000), isActive);
    }, 1000);
  }

  stop(): { activeSeconds: number; totalSeconds: number; attentionPercent: number } {
    if (!this.isRunning) return { activeSeconds: 0, totalSeconds: 0, attentionPercent: 0 };
    if (!document.hidden && this.lastActiveAt > 0) this.activeTimeMs += Date.now() - this.lastActiveAt;
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.isRunning = false;
    const a = Math.floor(this.activeTimeMs / 1000);
    const t = Math.floor((Date.now() - this.startTime) / 1000);
    return { activeSeconds: a, totalSeconds: t, attentionPercent: t > 0 ? Math.round((a / t) * 100) : 0 };
  }

  getActiveSeconds(): number {
    const extra = (!document.hidden && this.lastActiveAt > 0) ? (Date.now() - this.lastActiveAt) : 0;
    return Math.floor((this.activeTimeMs + extra) / 1000);
  }
}

// ─────────────────────────────────────────────────────────────
// FRAUD LOG & UTILITIES
// ─────────────────────────────────────────────────────────────

interface FraudLogEntry {
  userHandle: string;
  action: string;
  flags: string[];
  fraudScore: number;
  trustScoreAfter: number;
  timestamp: string;
  extra?: Record<string, unknown>;
}

export function appendFraudLog(entry: FraudLogEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const existing: FraudLogEntry[] = JSON.parse(localStorage.getItem(FRAUD_LOG_KEY) || '[]');
    existing.unshift(entry);
    localStorage.setItem(FRAUD_LOG_KEY, JSON.stringify(existing.slice(0, 200)));
  } catch { /**/ }
}

export function getFraudLog(): FraudLogEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FRAUD_LOG_KEY) || '[]'); }
  catch { return []; }
}

export function formatCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return '0s';
  const s = Math.ceil(remainingMs / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60), rem = s % 60;
  return rem > 0 ? `${m}p ${rem}s` : `${m} phút`;
}

export function getTrustScoreBadge(score: number): { label: string; colorClass: string; emoji: string } {
  if (score >= 90) return { label: 'Uy Tín Cao', colorClass: 'emerald', emoji: '🌟' };
  if (score >= 80) return { label: 'Đáng Tin', colorClass: 'cyan', emoji: '✅' };
  if (score >= 60) return { label: 'Bình Thường', colorClass: 'yellow', emoji: '⚠️' };
  if (score >= 30) return { label: 'Nghi Ngờ', colorClass: 'orange', emoji: '⚡' };
  return { label: 'Bị Khóa', colorClass: 'red', emoji: '🚫' };
}
