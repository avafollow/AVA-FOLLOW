/**
 * DỊCH VỤ TÍCH HỢP & XÁC THỰC FACEBOOK GRAPH API & WEBHOOK (CHÍNH THỨC & THỜI GIAN THỰC)
 * 
 * Các chức năng cốt lõi:
 * 1. getFacebookConfig: Đọc cấu hình Meta Graph API (App ID, Client Token, Page Access Token)
 * 2. verifyFacebookPageFollow: Kiểm tra và xác thực lượt Theo dõi / Thích Trang Facebook của người dùng
 * 3. verifyFacebookPostLike: Kiểm tra và xác thực lượt Thích (Like/Thả Tim) bài viết Facebook
 * 4. verifyFacebookComment: Kiểm tra bình luận thực tế của người dùng trên bài viết / video Facebook
 * 5. verifyFacebookShare: Kiểm tra lượt chia sẻ bài viết công khai trên trang cá nhân
 * 6. verifyFacebookTaskAction: Điều phối toàn bộ quy trình xác thực nhiệm vụ Facebook trước khi cộng Xu
 */

export interface FacebookActionVerificationResult {
  success: boolean;
  actionType: 'follow' | 'like' | 'comment' | 'share';
  targetId: string;
  performerAccount: string;
  message: string;
  txHash?: string;
  verifiedAt?: string;
  details?: any;
}

export interface FacebookAppConfig {
  appId: string;
  clientToken: string;
  pageAccessToken: string;
  apiEndpoint: string;
}

// Lấy cấu hình Meta Facebook API từ LocalStorage hoặc Environment Variables
export const getFacebookAppConfig = (): FacebookAppConfig => {
  let customAppId = '';
  let customClientToken = '';
  let customPageToken = '';

  if (typeof window !== 'undefined') {
    customAppId = localStorage.getItem('ava_facebook_app_id') || '';
    customClientToken = localStorage.getItem('ava_facebook_client_token') || '';
    customPageToken = localStorage.getItem('ava_facebook_page_token') || '';
  }

  const env = (import.meta as any).env || {};
  return {
    appId: customAppId.trim() || env.VITE_FACEBOOK_APP_ID || '',
    clientToken: customClientToken.trim() || env.VITE_FACEBOOK_CLIENT_TOKEN || '',
    pageAccessToken: customPageToken.trim() || env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN || env.FB_PAGE_ACCESS_TOKEN || '',
    apiEndpoint: 'https://graph.facebook.com/v19.0'
  };
};

export const setCustomFacebookConfig = (appId: string, clientToken: string, pageToken?: string): void => {
  if (typeof window !== 'undefined') {
    if (appId.trim()) localStorage.setItem('ava_facebook_app_id', appId.trim());
    else localStorage.removeItem('ava_facebook_app_id');

    if (clientToken.trim()) localStorage.setItem('ava_facebook_client_token', clientToken.trim());
    else localStorage.removeItem('ava_facebook_client_token');

    if (pageToken && pageToken.trim()) localStorage.setItem('ava_facebook_page_token', pageToken.trim());
    else localStorage.removeItem('ava_facebook_page_token');
  }
};

export const getFacebookOAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('ava_facebook_oauth_token') || '').trim();
  }
  return '';
};

/**
 * Trích xuất định danh Facebook (Page Username, Video ID, Post ID) từ URL
 */
export function extractFacebookTargetIdentifier(urlOrHandle: string): { type: 'video' | 'post' | 'page' | 'unknown'; id: string } {
  const clean = (urlOrHandle || '').trim();
  if (!clean) return { type: 'unknown', id: '' };

  // Dạng video watch?v=123456789
  const watchMatch = clean.match(/[?&]v=(\d+)/);
  if (watchMatch && watchMatch[1]) {
    return { type: 'video', id: watchMatch[1] };
  }

  // Dạng /videos/123456789
  const videosMatch = clean.match(/\/videos\/(\d+)/);
  if (videosMatch && videosMatch[1]) {
    return { type: 'video', id: videosMatch[1] };
  }

  // Dạng /posts/123456789
  const postsMatch = clean.match(/\/posts\/([a-zA-Z0-9_-]+)/);
  if (postsMatch && postsMatch[1]) {
    return { type: 'post', id: postsMatch[1] };
  }

  // Dạng page/fanpage handle
  const pageMatch = clean.match(/facebook\.com\/([a-zA-Z0-9._-]+)/i);
  if (pageMatch && pageMatch[1] && !['watch', 'reel', 'videos', 'share', 'groups'].includes(pageMatch[1].toLowerCase())) {
    return { type: 'page', id: pageMatch[1].replace(/^@+/, '') };
  }

  return { type: 'page', id: clean.replace(/^@+/, '').replace(/^https?:\/\/(?:www\.)?facebook\.com\//, '') };
}

/**
 * 1. XÁC MINH THEO DÕI / THÍCH TRANG FACEBOOK
 */
export async function verifyFacebookPageFollow(
  targetUrlOrPage: string,
  userFacebookAccount: string,
  userAccessToken?: string
): Promise<FacebookActionVerificationResult> {
  const target = extractFacebookTargetIdentifier(targetUrlOrPage);
  const cleanAccount = userFacebookAccount.replace(/^@+/, '').trim();
  const config = getFacebookAppConfig();
  const userToken = (userAccessToken || getFacebookOAuthToken()).trim();

  if (!cleanAccount || cleanAccount === 'Chưa kết nối' || cleanAccount.includes('chưa_kết_nối')) {
    return {
      success: false,
      actionType: 'follow',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Bạn chưa kết nối tài khoản Facebook! Vui lòng vào Cài đặt để liên kết tài khoản Facebook chính chủ.'
    };
  }

  if (!userToken && !config.pageAccessToken) {
    return {
      success: false,
      actionType: 'follow',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Chưa thể xác minh từ Facebook Graph API: Chưa có Facebook OAuth Access Token (user_likes / pages_read_engagement). Hệ thống từ chối cộng Xu khi chưa có xác nhận từ Meta!',
      verifiedAt: new Date().toISOString()
    };
  }

  try {
    // 1. Nếu có User Access Token: kiểm tra trực tiếp me/likes/{page-id}
    if (userToken) {
      const pageRes = await fetch(`${config.apiEndpoint}/${encodeURIComponent(target.id)}?fields=id,name&access_token=${encodeURIComponent(userToken)}`);
      let resolvedPageId = target.id;
      let pageName = target.id;
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        if (pageData.id) resolvedPageId = pageData.id;
        if (pageData.name) pageName = pageData.name;
      }

      const likeCheckRes = await fetch(`${config.apiEndpoint}/me/likes/${encodeURIComponent(resolvedPageId)}?access_token=${encodeURIComponent(userToken)}`);
      if (likeCheckRes.ok) {
        const likeData = await likeCheckRes.json();
        const isFollowing = Array.isArray(likeData.data) && likeData.data.length > 0;
        return {
          success: isFollowing,
          actionType: 'follow',
          targetId: resolvedPageId,
          performerAccount: cleanAccount,
          message: isFollowing
            ? `Xác thực thành công từ Facebook Graph API: Tài khoản [${cleanAccount}] đã Theo Dõi Trang ${pageName}!`
            : `Chưa hoàn thành, vui lòng kiểm tra và làm lại: Facebook Graph API xác nhận [${cleanAccount}] CHƯA Theo Dõi/Thích Trang ${pageName}!`,
          txHash: isFollowing ? `FB_FOL_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` : undefined,
          verifiedAt: new Date().toISOString(),
          details: likeData
        };
      }
    }

    return {
      success: false,
      actionType: 'follow',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: `Facebook Graph API không xác nhận được lượt Theo Dõi của [${cleanAccount}] (cần User Access Token có quyền user_likes đã duyệt bởi Meta). Không cộng Xu!`,
      verifiedAt: new Date().toISOString()
    };
  } catch (e) {
    console.warn('[Facebook API] verifyPageFollow error:', e);
    return {
      success: false,
      actionType: 'follow',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Lỗi kết nối Facebook Graph API v19.0 khi kiểm tra Theo Dõi Fanpage. Hệ thống không cộng Xu!',
      verifiedAt: new Date().toISOString()
    };
  }
}

/**
 * 2. XÁC MINH THÍCH (LIKE) BÀI VIẾT / VIDEO FACEBOOK
 */
export async function verifyFacebookPostLike(
  targetUrl: string,
  userFacebookAccount: string,
  userAccessToken?: string
): Promise<FacebookActionVerificationResult> {
  const target = extractFacebookTargetIdentifier(targetUrl);
  const cleanAccount = userFacebookAccount.replace(/^@+/, '').trim();
  const config = getFacebookAppConfig();
  const token = (userAccessToken || getFacebookOAuthToken() || config.pageAccessToken).trim();

  if (!cleanAccount || cleanAccount === 'Chưa kết nối' || cleanAccount.includes('chưa_kết_nối')) {
    return {
      success: false,
      actionType: 'like',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Bạn chưa kết nối tài khoản Facebook! Vui lòng liên kết tài khoản Facebook trước khi thực hiện.'
    };
  }

  if (!token) {
    return {
      success: false,
      actionType: 'like',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Chưa thể xác minh Like từ Facebook Graph API: Chưa có Access Token hợp lệ từ Meta. Hệ thống tạm giữ không cộng Xu!',
      verifiedAt: new Date().toISOString()
    };
  }

  try {
    const endpoint = `${config.apiEndpoint}/${encodeURIComponent(target.id)}/likes?limit=100&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      const likesList = Array.isArray(data.data) ? data.data : [];
      const userLiked = likesList.find((u: any) =>
        (u.name || '').toLowerCase().includes(cleanAccount.toLowerCase()) ||
        (u.id || '') === cleanAccount
      );
      if (userLiked) {
        return {
          success: true,
          actionType: 'like',
          targetId: target.id,
          performerAccount: cleanAccount,
          message: `Xác thực thành công từ Facebook Graph API: Tài khoản [${cleanAccount}] đã Thích bài viết!`,
          txHash: `FB_LIKE_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          verifiedAt: new Date().toISOString(),
          details: userLiked
        };
      }
      return {
        success: false,
        actionType: 'like',
        targetId: target.id,
        performerAccount: cleanAccount,
        message: `Chưa hoàn thành, vui lòng kiểm tra và làm lại: Facebook Graph API chưa ghi nhận lượt Thích từ [${cleanAccount}] trên bài viết này!`,
        verifiedAt: new Date().toISOString()
      };
    }

    return {
      success: false,
      actionType: 'like',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: `Facebook Graph API từ chối truy vấn lượt Thích (HTTP ${res.status}). Chưa thể xác nhận để cộng Xu!`,
      verifiedAt: new Date().toISOString()
    };
  } catch (e) {
    console.warn('[Facebook API] verifyPostLike error:', e);
    return {
      success: false,
      actionType: 'like',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Lỗi kết nối Facebook Graph API khi kiểm tra lượt Thích. Hệ thống không cộng Xu!',
      verifiedAt: new Date().toISOString()
    };
  }
}

/**
 * 3. XÁC MINH BÌNH LUẬN TRÊN FACEBOOK
 */
export async function verifyFacebookComment(
  targetUrl: string,
  userFacebookAccount: string,
  commentText: string,
  userAccessToken?: string
): Promise<FacebookActionVerificationResult> {
  const target = extractFacebookTargetIdentifier(targetUrl);
  const cleanAccount = userFacebookAccount.replace(/^@+/, '').trim();
  const config = getFacebookAppConfig();
  const token = (userAccessToken || getFacebookOAuthToken() || config.pageAccessToken).trim();

  if (!cleanAccount || cleanAccount === 'Chưa kết nối') {
    return {
      success: false,
      actionType: 'comment',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Bạn chưa liên kết tài khoản Facebook!'
    };
  }

  if (!commentText || commentText.trim().length < 5) {
    return {
      success: false,
      actionType: 'comment',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Nội dung bình luận quá ngắn hoặc rỗng! Vui lòng viết bình luận có ý nghĩa (tối thiểu 5 ký tự).'
    };
  }

  if (!token) {
    return {
      success: false,
      actionType: 'comment',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Chưa thể xác minh Bình luận từ Facebook Graph API: Chưa có Page/User Access Token hợp lệ từ Meta!',
      verifiedAt: new Date().toISOString()
    };
  }

  try {
    const endpoint = `${config.apiEndpoint}/${encodeURIComponent(target.id)}/comments?limit=50&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      const comments = data.data || [];
      const snippetNorm = commentText.trim().toLowerCase().slice(0, 15);
      const match = comments.find((c: any) => 
        (c.from?.name || '').toLowerCase().includes(cleanAccount.toLowerCase()) ||
        (snippetNorm.length >= 6 && (c.message || '').toLowerCase().includes(snippetNorm))
      );

      if (match) {
        return {
          success: true,
          actionType: 'comment',
          targetId: target.id,
          performerAccount: cleanAccount,
          message: `Đã xác thực bình luận thật của [${cleanAccount}] qua Facebook Graph API!`,
          txHash: `FB_CMT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          verifiedAt: new Date().toISOString(),
          details: match
        };
      }
      return {
        success: false,
        actionType: 'comment',
        targetId: target.id,
        performerAccount: cleanAccount,
        message: `Chưa hoàn thành, vui lòng kiểm tra và làm lại: Facebook Graph API chưa tìm thấy bình luận của [${cleanAccount}] trên bài viết này!`,
        verifiedAt: new Date().toISOString()
      };
    }

    return {
      success: false,
      actionType: 'comment',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: `Facebook Graph API trả về lỗi HTTP ${res.status} khi đọc bình luận. Không cộng Xu!`,
      verifiedAt: new Date().toISOString()
    };
  } catch (e) {
    console.warn('[Facebook API] verifyComment error:', e);
    return {
      success: false,
      actionType: 'comment',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Lỗi kết nối Facebook Graph API khi kiểm tra bình luận!',
      verifiedAt: new Date().toISOString()
    };
  }
}

/**
 * 4. XÁC MINH CHIA SẺ BÀI VIẾT FACEBOOK
 */
export async function verifyFacebookShare(
  targetUrl: string,
  userFacebookAccount: string,
  userAccessToken?: string
): Promise<FacebookActionVerificationResult> {
  const target = extractFacebookTargetIdentifier(targetUrl);
  const cleanAccount = userFacebookAccount.replace(/^@+/, '').trim();
  const config = getFacebookAppConfig();
  const token = (userAccessToken || getFacebookOAuthToken()).trim();

  if (!cleanAccount || cleanAccount === 'Chưa kết nối') {
    return {
      success: false,
      actionType: 'share',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Chưa hoàn thành, vui lòng kiểm tra và làm lại: Bạn cần kết nối tài khoản Facebook chính chủ trước khi chia sẻ!'
    };
  }

  if (!token) {
    return {
      success: false,
      actionType: 'share',
      targetId: target.id,
      performerAccount: cleanAccount,
      message: 'Chưa thể xác minh Chia sẻ từ Facebook Graph API: Cần User Access Token có quyền user_posts từ Meta để đối soát bài chia sẻ công khai!',
      verifiedAt: new Date().toISOString()
    };
  }

  try {
    const endpoint = `${config.apiEndpoint}/me/posts?fields=id,link,permalink_url,message&limit=15&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      const posts = Array.isArray(data.data) ? data.data : [];
      const matched = posts.find((p: any) =>
        (p.link && p.link.includes(target.id)) ||
        (p.permalink_url && p.permalink_url.includes(target.id)) ||
        (p.message && p.message.includes(target.id))
      );
      if (matched) {
        return {
          success: true,
          actionType: 'share',
          targetId: target.id,
          performerAccount: cleanAccount,
          message: `Đã xác thực bài chia sẻ công khai của [${cleanAccount}] qua Facebook Graph API!`,
          txHash: `FB_SHR_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          verifiedAt: new Date().toISOString(),
          details: matched
        };
      }
      return {
        success: false,
        actionType: 'share',
        targetId: target.id,
        performerAccount: cleanAccount,
        message: `Chưa hoàn thành, vui lòng kiểm tra và làm lại: Chưa tìm thấy bài Chia Sẻ công khai nào chứa liên kết này trên trang cá nhân [${cleanAccount}]!`,
        verifiedAt: new Date().toISOString()
      };
    }
  } catch (e) {
    console.warn('[Facebook API] verifyShare error:', e);
  }

  return {
    success: false,
    actionType: 'share',
    targetId: target.id,
    performerAccount: cleanAccount,
    message: `Chưa thể xác nhận lượt Chia Sẻ từ Facebook Graph API cho tài khoản [${cleanAccount}]. Hệ thống không cộng Xu khi chưa có xác thực!`,
    verifiedAt: new Date().toISOString()
  };
}

/**
 * 5. BỘ ĐIỀU PHỐI XÁC THỰC NHIỆM VỤ FACEBOOK TỔNG HỢP
 */
export async function verifyFacebookTaskAction(
  actionType: 'follow' | 'like' | 'comment' | 'share',
  targetUrl: string,
  userFacebookAccount: string,
  options?: { commentText?: string; userAccessToken?: string }
): Promise<FacebookActionVerificationResult> {
  if (actionType === 'follow') {
    return verifyFacebookPageFollow(targetUrl, userFacebookAccount, options?.userAccessToken);
  }
  if (actionType === 'like') {
    return verifyFacebookPostLike(targetUrl, userFacebookAccount, options?.userAccessToken);
  }
  if (actionType === 'comment') {
    return verifyFacebookComment(targetUrl, userFacebookAccount, options?.commentText || '', options?.userAccessToken);
  }
  if (actionType === 'share') {
    return verifyFacebookShare(targetUrl, userFacebookAccount, options?.userAccessToken);
  }

  return {
    success: false,
    actionType,
    targetId: targetUrl,
    performerAccount: userFacebookAccount,
    message: 'Hành động không xác định!'
  };
}
