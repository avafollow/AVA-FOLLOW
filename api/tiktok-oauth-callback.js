/**
 * TikTok Login Kit OAuth v2 Callback Handler
 * Đổi mã authorization `code` lấy `access_token` và đồng bộ hồ sơ TikTok chính chủ từ Open API v2.
 * Biến môi trường cần trên Vercel:
 * - VITE_TIKTOK_CLIENT_KEY (hoặc TIKTOK_CLIENT_KEY)
 * - TIKTOK_CLIENT_SECRET
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const code = (req.query?.code || req.body?.code || '').toString().trim();
  const redirectUri = (req.query?.redirect_uri || req.body?.redirect_uri || 'https://avafollowpro.vercel.app/?tiktok_oauth=1').toString().trim();

  const clientKey = (process.env.VITE_TIKTOK_CLIENT_KEY || process.env.TIKTOK_CLIENT_KEY || '').trim();
  const clientSecret = (process.env.TIKTOK_CLIENT_SECRET || process.env.VITE_TIKTOK_CLIENT_SECRET || '').trim();

  if (!clientKey || !clientSecret) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_TIKTOK_CREDENTIALS',
      message: 'Chưa cấu hình VITE_TIKTOK_CLIENT_KEY và TIKTOK_CLIENT_SECRET trên máy chủ Vercel.'
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_CODE',
      message: 'Thiếu mã xác thực (authorization code) từ TikTok Login Kit.'
    });
  }

  try {
    // 1. Đổi authorization code lấy access_token
    const tokenParams = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: tokenParams.toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return res.status(400).json({
        success: false,
        error: tokenData.error || 'TOKEN_EXCHANGE_FAILED',
        message: tokenData.error_description || 'TikTok từ chối đổi mã đăng nhập OAuth.',
        details: tokenData
      });
    }

    const accessToken = tokenData.access_token;

    // 2. Lấy thông tin hồ sơ thật của người dùng từ TikTok Display API v2
    const profileFields = 'open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count';
    const userRes = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${encodeURIComponent(profileFields)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    const userData = await userRes.json();
    const userInfo = userData?.data?.user || {};

    return res.status(200).json({
      success: true,
      accessToken,
      openId: tokenData.open_id || userInfo.open_id || '',
      expiresIn: tokenData.expires_in || 86400,
      profile: {
        username: userInfo.username || '',
        displayName: userInfo.display_name || userInfo.username || 'TikTok Creator',
        avatarUrl: userInfo.avatar_url || '',
        followerCount: Number(userInfo.follower_count || 0),
        followingCount: Number(userInfo.following_count || 0),
        likesCount: Number(userInfo.likes_count || 0),
        videoCount: Number(userInfo.video_count || 0)
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'TIKTOK_OAUTH_EXCEPTION',
      message: err?.message || 'Lỗi kết nối máy chủ TikTok Open API.'
    });
  }
}
