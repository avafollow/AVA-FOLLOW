// Client wrapper cho Bot Kiểm Soát Chống Gian Lận TikTok (Server-side HMAC T0 -> T1 Delta Verification)

export interface TikTokBotSnapshotResponse {
  ok: boolean;
  verificationToken?: string;
  error?: string;
  snapshot?: {
    action: string;
    userHandle: string;
    userAccountExists: boolean;
    targetHandle: string;
    userFollowing0: number | null;
    targetFollower0: number | null;
    videoLike0: number | null;
    videoComment0: number | null;
    videoShare0: number | null;
    t0: number;
  };
}

export interface TikTokBotVerifyResponse {
  verified: boolean;
  fraudDetected?: boolean;
  reason: string;
  botProofHash?: string;
  delta?: Record<string, any>;
}

export async function takeTikTokBotSnapshot(params: {
  action: 'follow' | 'like' | 'comment' | 'share';
  userHandle: string;
  targetHandle: string;
  targetUrl: string;
}): Promise<TikTokBotSnapshotResponse> {
  try {
    const res = await fetch('/api/tiktok-verify-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'snapshot',
        ...params
      })
    });
    if (!res.ok) {
      return { ok: false, error: `Lỗi kết nối Bot kiểm soát TikTok (HTTP ${res.status})` };
    }
    return await res.json();
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Không thể kết nối máy chủ Bot kiểm soát TikTok' };
  }
}

export async function verifyTikTokWithBot(params: {
  verificationToken?: string;
  commentText?: string;
}): Promise<TikTokBotVerifyResponse> {
  if (!params.verificationToken) {
    return {
      verified: false,
      fraudDetected: true,
      reason: '🤖 Bot Kiểm Soát TikTok: Không tìm thấy mã phiên đối soát T0. Vui lòng mở lại nhiệm vụ từ đầu để Bot ghi nhận dữ liệu trước khi xác nhận!'
    };
  }
  try {
    const res = await fetch('/api/tiktok-verify-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'verify',
        verificationToken: params.verificationToken,
        commentText: params.commentText || ''
      })
    });
    if (!res.ok) {
      return {
        verified: false,
        fraudDetected: false,
        reason: `🤖 Bot Kiểm Soát TikTok tạm gián đoạn (HTTP ${res.status}). Hệ thống giữ lại không cộng Xu để tránh gian lận!`
      };
    }
    return await res.json();
  } catch {
    return {
      verified: false,
      fraudDetected: false,
      reason: '🤖 Lỗi kết nối máy chủ Bot kiểm soát TikTok. Không cộng Xu khi chưa có xác nhận!'
    };
  }
}
