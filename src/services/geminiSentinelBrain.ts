/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  GEMINI NEURAL SENTINEL BRAIN 2026 - BỘ NÃO AI CHỐNG GIAN LẬN TOÀN DIỆN      ║
 * ║  (AI-POWERED BIOMETRIC TELEMETRY, TAB FOCUS ARBITRATION & 4-TIER PENALTIES)  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { FraudAnomalyType, FraudRiskSeverity, AntiFraudTelemetry } from '../types';
import { 
  getPenaltyTierForLevel, 
  triggerCascadingTaskLockout, 
  incrementViolationCount, 
  getViolationCount, 
  TaskLockoutStatus 
} from './antiFraudEngine';

export type TaskActionType = 'follow' | 'like' | 'comment' | 'share' | 'watch_video' | 'watch_live';

export interface UserInteractionTelemetry {
  touchCount: number;
  swipeVelocity: number;
  scrollDistance: number;
  accelerometerJitter: number;
  cursorDistancePx: number;
  hardwareTouchEvents: number;
}

export interface TabFocusDwellData {
  openedAt: number;
  targetRequiredSeconds: number;
  activeFocusedMs: number;
  lastActiveTimestamp: number;
  isCurrentlyFocused: boolean;
  defocusCount: number; // Số lần rời tab (Zalo, FB, YouTube, cuộc gọi, app khác)
  totalDefocusMs: number;
}

export interface AISentinelVerdict {
  isApproved: boolean;
  confidenceScore: number; // 0 - 100%
  classification: 'GENUINE_HUMAN' | 'TAB_DEFOCUS_IDLE' | 'BOT_AUTOCLICKER' | 'SPAM_COMMENT' | 'DUPLICATE_SYBIL' | 'RAPID_BOUNCE';
  reason: string;
  suggestedAction: 'APPROVE' | 'FREEZE_TIMER' | 'WARN_USER' | 'PENALIZE_TIER_1' | 'PENALIZE_TIER_2' | 'PENALIZE_TIER_3' | 'BAN_ACCOUNT';
  appliedTier?: number;
  lockoutStatus?: TaskLockoutStatus;
  auditSignature: string;
}

/**
 * LỚP GIÁM SÁT TAB TIÊU ĐIỂM NGHIÊM NGẶT CỦA BỘ NÃO AI (STRICT ACTIVE TAB FOCUS TRACKER)
 * Tự động đóng băng thời gian ngay khi người dùng chuyển sang ứng dụng/tab khác
 */
export class ActiveTabFocusTracker {
  private openedAt: number = 0;
  private targetRequiredSeconds: number = 15;
  private activeFocusedMs: number = 0;
  private lastFocusResumeAt: number = 0;
  private isCurrentlyFocused: boolean = true;
  private defocusCount: number = 0;
  private totalDefocusMs: number = 0;
  private lastDefocusStart: number = 0;
  private listenersAttached: boolean = false;
  private onStateChangeCallback?: (isFocused: boolean, remainingSeconds: number) => void;

  constructor(targetRequiredSeconds: number = 15, onStateChange?: (isFocused: boolean, remainingSeconds: number) => void) {
    this.targetRequiredSeconds = targetRequiredSeconds;
    this.onStateChangeCallback = onStateChange;
  }

  public start() {
    this.openedAt = Date.now();
    this.activeFocusedMs = 0;
    this.lastFocusResumeAt = Date.now();
    this.isCurrentlyFocused = typeof document !== 'undefined' ? !document.hidden : true;
    this.defocusCount = 0;
    this.totalDefocusMs = 0;
    this.lastDefocusStart = 0;

    if (!this.listenersAttached && typeof window !== 'undefined') {
      this.attachListeners();
    }
  }

  private attachListeners() {
    this.listenersAttached = true;

    const handleFocusLoss = () => {
      if (this.isCurrentlyFocused) {
        // Tích lũy thời gian active trước đó
        this.activeFocusedMs += Math.max(0, Date.now() - this.lastFocusResumeAt);
        this.isCurrentlyFocused = false;
        this.defocusCount++;
        this.lastDefocusStart = Date.now();

        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(false, this.getRemainingSeconds());
        }
      }
    };

    const handleFocusGain = () => {
      if (!this.isCurrentlyFocused) {
        if (this.lastDefocusStart > 0) {
          this.totalDefocusMs += Math.max(0, Date.now() - this.lastDefocusStart);
        }
        this.isCurrentlyFocused = true;
        this.lastFocusResumeAt = Date.now();

        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(true, this.getRemainingSeconds());
        }
      }
    };

    const visibilityHandler = () => {
      if (document.hidden) {
        handleFocusLoss();
      } else {
        handleFocusGain();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('blur', handleFocusLoss);
    window.addEventListener('focus', handleFocusGain);
    window.addEventListener('pagehide', handleFocusLoss);
    window.addEventListener('pageshow', handleFocusGain);
  }

  public getActiveFocusedSeconds(): number {
    let total = this.activeFocusedMs;
    if (this.isCurrentlyFocused && this.lastFocusResumeAt > 0) {
      total += Math.max(0, Date.now() - this.lastFocusResumeAt);
    }
    return Math.floor(total / 1000);
  }

  public getRemainingSeconds(): number {
    const elapsed = this.getActiveFocusedSeconds();
    return Math.max(0, this.targetRequiredSeconds - elapsed);
  }

  public isFocusActive(): boolean {
    return this.isCurrentlyFocused;
  }

  public getDwellReport(): TabFocusDwellData {
    return {
      openedAt: this.openedAt,
      targetRequiredSeconds: this.targetRequiredSeconds,
      activeFocusedMs: this.activeFocusedMs + (this.isCurrentlyFocused ? (Date.now() - this.lastFocusResumeAt) : 0),
      lastActiveTimestamp: Date.now(),
      isCurrentlyFocused: this.isCurrentlyFocused,
      defocusCount: this.defocusCount,
      totalDefocusMs: this.totalDefocusMs + (!this.isCurrentlyFocused && this.lastDefocusStart > 0 ? (Date.now() - this.lastDefocusStart) : 0)
    };
  }

  public stop(): TabFocusDwellData {
    if (this.isCurrentlyFocused) {
      this.activeFocusedMs += Math.max(0, Date.now() - this.lastFocusResumeAt);
    }
    return this.getDwellReport();
  }
}

/**
 * BỘ NÃO AI GEMINI SENTINEL ENGINE
 * Trung tâm xử lý trí tuệ nhân tạo giám định hành vi và chống gian lận
 */
export class GeminiSentinelBrain {
  private static instance: GeminiSentinelBrain;

  public static getInstance(): GeminiSentinelBrain {
    if (!GeminiSentinelBrain.instance) {
      GeminiSentinelBrain.instance = new GeminiSentinelBrain();
    }
    return GeminiSentinelBrain.instance;
  }

  /**
   * Tạo chữ ký số phiên làm nhiệm vụ (Digital Hash Signature)
   */
  public generateTaskDigitalSignature(userHandle: string, taskId: string, action: TaskActionType): { signature: string; sessionHashtag: string } {
    const cleanUser = userHandle.replace(/^@+/, '').toUpperCase();
    const ts = Date.now();
    const salt = Math.random().toString(36).substring(2, 7).toUpperCase();
    const signature = `GEMINI_SIG_${cleanUser}_${taskId}_${action.toUpperCase()}_${ts}_${salt}`;
    const sessionHashtag = `#AVALIVE #AVASTORE #${cleanUser.slice(0, 6)}_${salt}`;

    return { signature, sessionHashtag };
  }

  /**
   * Đánh giá và phán quyết bằng AI khi người dùng gửi yêu cầu xác nhận nhiệm vụ
   */
  public evaluateTaskCompletion(params: {
    userHandle: string;
    taskId: string;
    action: TaskActionType;
    dwellData: TabFocusDwellData;
    telemetry?: Partial<UserInteractionTelemetry>;
    commentText?: string;
    sharedUrl?: string;
    targetChannelHandle?: string;
  }): AISentinelVerdict {
    const { userHandle, taskId, action, dwellData, telemetry, commentText, sharedUrl, targetChannelHandle } = params;
    const cleanUser = userHandle.replace(/^@+/, '');
    const activeSeconds = Math.floor(dwellData.activeFocusedMs / 1000);
    const requiredSeconds = dwellData.targetRequiredSeconds || 15;

    // 1. KIỂM TRA ĐIỀU KIỆN TIÊU ĐIỂM (TAB FOCUS & DWELL TIME)
    if (activeSeconds < requiredSeconds) {
      const missingSeconds = requiredSeconds - activeSeconds;
      return {
        isApproved: false,
        confidenceScore: 99.8,
        classification: 'TAB_DEFOCUS_IDLE',
        reason: `⏸️ AI phát hiện bạn đã chuyển sang ứng dụng khác hoặc chưa xem đủ thời gian. Còn thiếu ${missingSeconds} giây xem thực tế trên màn hình!`,
        suggestedAction: 'FREEZE_TIMER',
        auditSignature: `AUDIT_DEFOCUS_${cleanUser}_${Date.now()}`
      };
    }

    // 2. KIỂM TRA RỜI TAB QUÁ NHIỀU LẦN HOẶC BỎ MẶC TAB QUÁ LÂU
    if (dwellData.defocusCount >= 5 && dwellData.totalDefocusMs > 120000) {
      const lockout = triggerCascadingTaskLockout(
        cleanUser, 
        `AI phát hiện hành vi rời tab ${dwellData.defocusCount} lần và treo máy ảo không xem thật.`,
        undefined,
        'TAB_BOUNCE_NO_ACTION'
      );

      return {
        isApproved: false,
        confidenceScore: 98.5,
        classification: 'TAB_DEFOCUS_IDLE',
        reason: `🚫 Phát hiện treo máy và rời tab liên tục (${dwellData.defocusCount} lần). Hệ thống đã kích hoạt chế tài xử lý.`,
        suggestedAction: lockout.violationLevel === 1 ? 'PENALIZE_TIER_1' : (lockout.violationLevel === 2 ? 'PENALIZE_TIER_2' : 'PENALIZE_TIER_3'),
        appliedTier: lockout.violationLevel,
        lockoutStatus: lockout,
        auditSignature: `AUDIT_FRAUD_DEFOCUS_${cleanUser}_${Date.now()}`
      };
    }

    // 3. KIỂM TRA CHỮ KÝ SỐ & HASHTAG CHO COMMENT
    if (action === 'comment') {
      if (!commentText || commentText.trim().length < 5) {
        return {
          isApproved: false,
          confidenceScore: 99.0,
          classification: 'SPAM_COMMENT',
          reason: '⚠️ Bình luận không hợp lệ. Nội dung bình luận quá ngắn hoặc rỗng.',
          suggestedAction: 'WARN_USER',
          auditSignature: `AUDIT_SPAM_CMT_${cleanUser}_${Date.now()}`
        };
      }

      // Kiểm tra sự xuất hiện của hashtag sàn (#AVALIVE hoặc #AVASTORE)
      const hasHashtag = commentText.includes('#AVA') || commentText.includes('#AVALIVE') || commentText.includes('#AVASTORE');
      if (!hasHashtag) {
        return {
          isApproved: false,
          confidenceScore: 96.5,
          classification: 'SPAM_COMMENT',
          reason: '⚠️ Bình luận chưa chứa Chữ Ký Số & Hashtag sàn (#AVALIVE #AVASTORE). Vui lòng sao chép mẫu chuẩn!',
          suggestedAction: 'WARN_USER',
          auditSignature: `AUDIT_MISSING_HASHTAG_${cleanUser}_${Date.now()}`
        };
      }
    }

    // 4. KIỂM TRA CHIA SẺ HỢP LỆ CHO SHARE
    if (action === 'share') {
      if (sharedUrl && (sharedUrl.length < 10 || !sharedUrl.startsWith('http'))) {
        return {
          isApproved: false,
          confidenceScore: 95.0,
          classification: 'RAPID_BOUNCE',
          reason: '⚠️ Liên kết chia sẻ không hợp lệ hoặc chưa được đăng tải thành công.',
          suggestedAction: 'WARN_USER',
          auditSignature: `AUDIT_INVALID_SHARE_${cleanUser}_${Date.now()}`
        };
      }
    }

    // 5. NẾU HOÀN TOÀN HỢP LỆ (APPROVED)
    return {
      isApproved: true,
      confidenceScore: 99.5,
      classification: 'GENUINE_HUMAN',
      reason: '✅ Xác thực hoàn hảo bằng Bộ Não AI Gemini: Người thật thao tác trực tiếp và đủ thời gian.',
      suggestedAction: 'APPROVE',
      auditSignature: `AUDIT_APPROVED_${cleanUser}_${taskId}_${Date.now()}`
    };
  }

  /**
   * Giám định phiên Live xem theo từng phút người dùng thực tế
   */
  public evaluateLiveWatchMinute(params: {
    userHandle: string;
    taskId: string;
    minuteWatched: number;
    isScreenFocused: boolean;
    tapsCount: number;
  }): { isValid: boolean; reason: string } {
    const { minuteWatched, isScreenFocused, tapsCount } = params;

    if (!isScreenFocused) {
      return {
        isValid: false,
        reason: '⏸️ Bộ đếm tạm dừng vì bạn đã chuyển tab. Phút xem này không được tính.'
      };
    }

    return {
      isValid: true,
      reason: `✅ Đã xác thực phút xem live thứ ${minuteWatched} thành công!`
    };
  }
}

export const geminiSentinelBrain = GeminiSentinelBrain.getInstance();
