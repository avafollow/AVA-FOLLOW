// ===== BỘ NGUỒN VIDEO & LIVESTREAM ĐA NỀN TẢNG (TIKTOK, FACEBOOK, YOUTUBE & CDN STREAM) =====

export interface ParsedMediaInfo {
  platform: 'tiktok' | 'facebook' | 'youtube' | 'direct';
  isTikTok: boolean;
  isLive: boolean;
  isYouTube: boolean;
  isFacebook: boolean;
  isDirectVideo: boolean;
  handle: string;
  channelName: string;
  channelUrl: string;
  fanpageUrl?: string;
  avatarUrl: string;
  actionCtaLabel: string;
  videoId?: string;
  youtubeId?: string;
  embedUrl?: string;
  streamUrl: string;
  title: string;
  sourceType: 'tiktok_embed' | 'cdn_stream' | 'youtube_embed' | 'facebook_embed' | 'live_stream' | 'direct_stream';
}

// Bộ nguồn CDN trực tiếp siêu tốc đa nền tảng (iOS Safari, Android Chrome, Web, Desktop)
export const HIGH_SPEED_CDN_VIDEOS = {
  fyp: [
    '/videos/sample2.mp4',
    '/videos/sample3.mp4',
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4'
  ],
  livestream: [
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8'
  ],
  product_review: [
    '/videos/sample2.mp4',
    '/videos/sample3.mp4'
  ]
};

export function getFallbackLiveStreamUrl(channelHandle?: string): string {
  const clean = (channelHandle || 'live').replace(/[^a-zA-Z0-9]/g, '');
  const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pool = HIGH_SPEED_CDN_VIDEOS.livestream;
  return pool[hash % pool.length] || pool[0];
}

export function getFallbackVideoUrl(channelHandle?: string): string {
  const clean = (channelHandle || 'video').replace(/[^a-zA-Z0-9]/g, '');
  const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pool = HIGH_SPEED_CDN_VIDEOS.fyp;
  return pool[hash % pool.length] || pool[0];
}

/**
 * Làm sạch và chuẩn hóa đường link dán từ thiết bị di động / máy tính.
 * Xử lý hoàn hảo các trường hợp:
 * 1. Dán từ nút Share trên app điện thoại (kèm text giới thiệu phía trước/sau)
 * 2. Dán đè lên URL cũ
 * 3. Ký tự query parameters thừa
 */
export function sanitizeMediaUrl(rawInput: string): string {
  if (!rawInput) return '';
  let text = rawInput.trim();

  // 1. Nếu chuỗi chứa URL http/https, trích xuất URL cuối cùng
  const urlMatches = text.match(/https?:\/\/[^\s<>"'{}|\^~\[\]`]+/gi);
  if (urlMatches && urlMatches.length > 0) {
    text = urlMatches[urlMatches.length - 1].trim();
  }

  // 2. Loại bỏ dấu ngoặc đơn, chấm câu thừa ở đuôi URL
  text = text.replace(/[\)\]\>\"\'\,\.\;\:\!\?]+$/, '');

  return text;
}

// Nhận diện nền tảng từ URL (hỗ trợ đầy đủ link di động)
export function detectPlatform(rawUrl: string): 'tiktok' | 'facebook' | 'youtube' | 'direct' {
  if (!rawUrl) return 'tiktok';
  const clean = sanitizeMediaUrl(rawUrl).toLowerCase();
  
  if (
    clean.includes('youtube.com') || 
    clean.includes('youtu.be') || 
    clean.includes('m.youtube.com')
  ) {
    return 'youtube';
  }

  if (
    clean.includes('facebook.com') || 
    clean.includes('fb.watch') || 
    clean.includes('fb.com') || 
    clean.includes('fb.gg') ||
    clean.includes('m.facebook.com') ||
    clean.includes('mobile.facebook.com') ||
    clean.includes('web.facebook.com')
  ) {
    return 'facebook';
  }

  if (
    clean.includes('tiktok.com') || 
    clean.includes('vt.tiktok.com') || 
    clean.includes('vm.tiktok.com') ||
    clean.includes('m.tiktok.com')
  ) {
    return 'tiktok';
  }

  if (/\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i.test(clean)) {
    return 'direct';
  }

  return 'tiktok';
}

// Hàm trích xuất @handle từ URL bất kỳ (bao gồm link chia sẻ từ điện thoại & link Live đa thiết bị)
export function extractTikTokHandle(rawUrlOrHandle: string): string {
  if (!rawUrlOrHandle) return '@creator_vietnam';
  const clean = sanitizeMediaUrl(rawUrlOrHandle);
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    // 1. TikTok live link dạng live.tiktok.com/@username hoặc live.tiktok.com/username hoặc tiktok.com/live/username
    const liveMatch = clean.match(/(?:live\.)?tiktok\.com\/(?:@|live\/)([a-zA-Z0-9_\.\-]+)/i);
    if (liveMatch && liveMatch[1] && !['live', 'watch', 'share'].includes(liveMatch[1].toLowerCase())) {
      return `@${liveMatch[1]}`;
    }

    // 2. TikTok standard @username
    const match = clean.match(/tiktok\.com\/@([a-zA-Z0-9_\.\-]+)/i);
    if (match && match[1]) {
      return `@${match[1]}`;
    }

    // 3. TikTok short links từ app điện thoại (vt.tiktok.com, vm.tiktok.com, tiktok.com/t)
    if (clean.includes('vt.tiktok.com') || clean.includes('vm.tiktok.com') || clean.includes('tiktok.com/t/')) {
      const codeMatch = clean.match(/tiktok\.com\/(?:t\/)?([a-zA-Z0-9_\.\-]+)/i);
      if (codeMatch && codeMatch[1]) {
        const tag = codeMatch[1].toLowerCase().replace(/[^a-z0-9_]/g, '');
        return `@tiktok_${tag || 'creator'}`;
      }
      return '@creator_tiktok';
    }

    // 4. YouTube @handle (hỗ trợ đầy đủ Unicode Tiếng Việt & ký tự percent-encoded)
    const ytMatch = clean.match(/youtube\.com\/@([^\/\?\#]+)/i);
    if (ytMatch && ytMatch[1]) {
      try {
        return `@${decodeURIComponent(ytMatch[1])}`;
      } catch {
        return `@${ytMatch[1]}`;
      }
    }

    // 5. YouTube channel / user / c
    const ytChannelMatch = clean.match(/youtube\.com\/(?:c|channel|user)\/([^\/\?\#]+)/i);
    if (ytChannelMatch && ytChannelMatch[1]) {
      try {
        return `@${decodeURIComponent(ytChannelMatch[1])}`;
      } catch {
        return `@${ytChannelMatch[1]}`;
      }
    }

    // 6. Facebook page / user / profile
    const fbMatch = clean.match(/facebook\.com\/([^\/\?\#]+)/i);
    if (fbMatch && fbMatch[1] && !['watch', 'reel', 'reels', 'videos', 'video.php', 'share', 'groups', 'stories', 'events', 'photo', 'photo.php', 'profile.php', 'permalink.php', 'story.php', 'live'].includes(fbMatch[1].toLowerCase())) {
      try {
        return `@${decodeURIComponent(fbMatch[1])}`;
      } catch {
        return `@${fbMatch[1]}`;
      }
    }

    return '@creator_vietnam';
  }

  // Nếu đã có dạng @username
  if (clean.startsWith('@')) {
    return clean.split(/[\/\?\#]/)[0];
  }

  return `@${clean}`;
}

// Nhận diện chính xác link Livestream thật (TUYỆT ĐỐI KHÔNG nhận nhầm username chứa chữ 'live' như @avalive, @oliver...)
export function isLiveMediaUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  const clean = sanitizeMediaUrl(rawUrl);
  // Nếu rõ ràng là link video hoặc photo TikTok -> KHÔNG phải live
  if (/tiktok\.com\/.*\/(?:video|photo)\/\d{8,24}/i.test(clean) || /m\.tiktok\.com\/v\/\d+/i.test(clean)) {
    return false;
  }
  return (
    /tiktok\.com\/@[^\/\?\#]+\/live(?:\/|\?|$)/i.test(clean) ||
    /live\.tiktok\.com\//i.test(clean) ||
    /tiktok\.com\/live(?:\/|\?|$)/i.test(clean) ||
    /[?&]room_id=\d+/i.test(clean) ||
    /webcast\.tiktok\.com/i.test(clean) ||
    /youtube\.com\/live\/[a-zA-Z0-9_-]{11}/i.test(clean) ||
    /youtube\.com\/(?:@[^\/\?\#]+|channel\/[^\/\?\#]+)\/live(?:\/|\?|$)/i.test(clean) ||
    /facebook\.com\/[^\/\?\#]+\/live(?:\/|\?|$)/i.test(clean) ||
    /facebook\.com\/watch\/live/i.test(clean) ||
    /facebook\.com\/live\/producer/i.test(clean) ||
    /\/livestream(?:\/|\?|$)/i.test(clean) ||
    /\.m3u8(?:\?.*)?$/i.test(clean)
  );
}

// Hàm trích xuất Video ID từ TikTok URL (hỗ trợ tất cả định dạng di động, tablet & máy tính: /video/, /photo/, /v/, /player/v1/)
export function extractTikTokVideoId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const clean = sanitizeMediaUrl(rawUrl);

  // Bỏ qua nếu là link live stream thật (room_id / livestream không phải là video_id)
  if (isLiveMediaUrl(clean)) {
    return null;
  }

  // 1. Dạng số thuần túy (10-24 chữ số)
  if (/^\d{10,24}$/.test(clean)) {
    return clean;
  }

  // 2. /video/12345..., /photo/12345..., /v/12345..., /embed/v2/..., /player/v1/..., /share/video/...
  const match = clean.match(/\/(?:video|photo|v|embed\/v2|embed|player\/v1|share\/video)\/(\d{10,24})/i);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Query param ?item_id=123... hoặc ?video_id=123... hoặc ?aweme_id=123...
  const paramMatch = clean.match(/[?&](?:item_id|video_id|aweme_id|mid|id)=(\d{10,24})/i);
  if (paramMatch && paramMatch[1]) {
    return paramMatch[1];
  }

  // 4. m.tiktok.com/v/12345.html
  const mobileMatch = clean.match(/m\.tiktok\.com\/v\/(\d+)/i);
  if (mobileMatch && mobileMatch[1]) {
    return mobileMatch[1];
  }

  // 5. Fallback bất kỳ /video/ hoặc /photo/ hoặc /v/ kèm chữ số
  const matchAny = clean.match(/\/(?:video|photo|v)\/(\d+)/i);
  if (matchAny && matchAny[1] && matchAny[1].length >= 8) {
    return matchAny[1];
  }

  // 6. Chuỗi bất kỳ chứa dãy số 15-24 chữ số trong URL tiktok
  if (clean.includes('tiktok.com')) {
    const longDigits = clean.match(/(\d{15,24})/);
    if (longDigits && longDigits[1]) {
      return longDigits[1];
    }
  }

  return null;
}

// Hàm trích xuất Video ID từ YouTube URL (watch, shorts, live, youtu.be, embed, mobile)
export function extractYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const clean = sanitizeMediaUrl(rawUrl);
  
  // 1. ID 11 ký tự thuần
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  
  // 2. youtu.be/ID (có thể có ?si=...)
  const youtuBeMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];
  
  // 3. /watch?v=ID hoặc ?v=ID hoặc &v=ID
  const vMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (vMatch && vMatch[1]) return vMatch[1];

  // 4. /shorts/ID, /live/ID, /embed/ID, /v/ID
  const pathMatch = clean.match(/\/(?:shorts|live|embed|v)\/([a-zA-Z0-9_-]{11})/i);
  if (pathMatch && pathMatch[1]) return pathMatch[1];

  return null;
}

// Phân tích toàn diện URL dán vào để trả về bộ thông tin stream & embed
export function parseMediaUrl(inputUrl: string, defaultHandle?: string): ParsedMediaInfo {
  const url = sanitizeMediaUrl(inputUrl || '');
  const handle = extractTikTokHandle(url) || defaultHandle || '@creator_vietnam';
  const cleanHandle = handle.replace(/^@+/, '');

  const lowerUrl = url.toLowerCase();
  const isLive = isLiveMediaUrl(url);
  const isYouTube = lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
  const isFacebook = lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.gg');
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i.test(url);
  const isTikTok = !isYouTube && !isFacebook && !isDirectVideo;

  const platform: ParsedMediaInfo['platform'] = isYouTube ? 'youtube' : (isFacebook ? 'facebook' : (isDirectVideo ? 'direct' : 'tiktok'));

  const videoId = extractTikTokVideoId(url);
  const youtubeId = extractYouTubeVideoId(url);

  let streamUrl = url;
  let sourceType: ParsedMediaInfo['sourceType'] = 'direct_stream';
  let embedUrl: string | undefined;

  let channelName = cleanHandle;
  let channelUrl = url;
  let fanpageUrl: string | undefined = undefined;
  let actionCtaLabel = 'Follow TikTok';

  if (isYouTube) {
    actionCtaLabel = 'Đăng Ký Kênh YouTube';
    const ytHandleMatch = url.match(/(?:youtube\.com\/|youtu\.be\/)@([^\/\?\#]+)/i);
    let rawYtHandle = '';
    if (ytHandleMatch && ytHandleMatch[1]) {
      try { rawYtHandle = decodeURIComponent(ytHandleMatch[1]); } catch { rawYtHandle = ytHandleMatch[1]; }
    }
    const resolvedYtHandle = rawYtHandle || (defaultHandle && !defaultHandle.toLowerCase().includes('tiktok') && !defaultHandle.includes('creator_vietnam') && !defaultHandle.includes('user') ? cleanHandle : '');
    channelName = resolvedYtHandle ? resolvedYtHandle : 'Kênh YouTube';
    channelUrl = resolvedYtHandle ? `https://www.youtube.com/@${encodeURIComponent(resolvedYtHandle)}` : (url.includes('youtube.com') || url.includes('youtu.be') ? url : (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : url));
    if (youtubeId) {
      embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`;
      sourceType = 'youtube_embed';
      streamUrl = url;
    }
  } else if (isFacebook) {
    actionCtaLabel = 'Theo Dõi Fanpage Facebook';
    const fbHandleMatch = url.match(/facebook\.com\/([^\/\?\#]+)/i);
    let rawFbSlug = '';
    if (fbHandleMatch && fbHandleMatch[1] && !['watch', 'reel', 'reels', 'videos', 'video.php', 'share', 'groups', 'stories', 'events', 'photo', 'photo.php', 'profile.php', 'permalink.php', 'story.php', 'live'].includes(fbHandleMatch[1].toLowerCase())) {
      try { rawFbSlug = decodeURIComponent(fbHandleMatch[1]); } catch { rawFbSlug = fbHandleMatch[1]; }
    }
    const resolvedFbHandle = rawFbSlug || (defaultHandle && !defaultHandle.toLowerCase().includes('tiktok') && !defaultHandle.includes('creator_vietnam') && !defaultHandle.includes('user') ? cleanHandle : '');
    channelName = resolvedFbHandle ? resolvedFbHandle : 'Fanpage Facebook';
    channelUrl = resolvedFbHandle ? `https://www.facebook.com/${resolvedFbHandle}` : url;
    fanpageUrl = channelUrl;
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=0&allowfullscreen=true`;
    sourceType = 'facebook_embed';
    streamUrl = url;
  } else if (isTikTok) {
    actionCtaLabel = 'Follow TikTok';
    channelName = `@${cleanHandle}`;
    channelUrl = `https://www.tiktok.com/@${cleanHandle}`;
    if (videoId) {
      embedUrl = `https://www.tiktok.com/player/v1/${videoId}?embed_from=oembed&music_info=1&description=1&autoplay=1&muted=1&loop=1&controls=1`;
      sourceType = 'tiktok_embed';
      streamUrl = url;
    } else if (isLive) {
      sourceType = 'live_stream';
      embedUrl = `https://www.tiktok.com/@${cleanHandle}/live`;
      streamUrl = url;
    } else {
      sourceType = 'tiktok_embed';
      streamUrl = url;
    }
  } else if (isDirectVideo) {
    streamUrl = url;
    sourceType = 'direct_stream';
    actionCtaLabel = 'Theo Dõi Kênh';
  }

  let title = `Video TikTok: @${cleanHandle}`;
  if (isLive) {
    title = `🔴 LIVE STREAM: ${channelName}`;
  } else if (isYouTube) {
    title = `▶️ YouTube Video: ${channelName}`;
  } else if (isFacebook) {
    title = `🌐 Facebook Video: ${channelName}`;
  }

  // Sử dụng metadata thật đã cache nếu có để hiển thị tức thì đúng tên kênh & logo kênh
  const cachedMeta = getCachedMediaChannelMeta(url);
  const resolvedChannelName = cachedMeta?.channelName || channelName;
  const resolvedHandle = cachedMeta?.channelHandle || (isYouTube || isFacebook ? (handle === '@creator_vietnam' ? resolvedChannelName : handle) : handle);
  const resolvedChannelUrl = cachedMeta?.channelUrl || channelUrl;
  const avatarUrl = cachedMeta?.channelAvatar || getPlatformAvatar(platform, resolvedHandle);

  return {
    platform,
    isTikTok,
    isLive,
    isYouTube,
    isFacebook,
    isDirectVideo,
    handle: resolvedHandle,
    channelName: resolvedChannelName,
    channelUrl: resolvedChannelUrl,
    fanpageUrl: isFacebook ? resolvedChannelUrl : fanpageUrl,
    avatarUrl,
    actionCtaLabel,
    videoId: videoId || undefined,
    youtubeId: youtubeId || undefined,
    embedUrl,
    streamUrl,
    title: cachedMeta?.videoTitle || title,
    sourceType
  };
}

// ===== BỘ PHÂN GIẢI TÊN KÊNH & LOGO KÊNH THẬT 100% ĐA NỀN TẢNG (YOUTUBE, FACEBOOK, TIKTOK) =====
export interface ResolvedMediaChannelMeta {
  platform: 'tiktok' | 'facebook' | 'youtube' | 'direct';
  channelId?: string | null;
  videoId?: string | null;
  channelName: string;
  channelHandle: string;
  channelUrl: string;
  channelAvatar: string | null;
  followerCount?: number;
  videoTitle: string | null;
  resolvedUrl: string;
}

const mediaMetaCache = new Map<string, ResolvedMediaChannelMeta>();
const mediaMetaPending = new Map<string, Promise<ResolvedMediaChannelMeta | null>>();

export function getCachedMediaChannelMeta(rawUrl: string): ResolvedMediaChannelMeta | null {
  const clean = sanitizeMediaUrl(rawUrl || '');
  if (!clean) return null;
  return mediaMetaCache.get(clean) || null;
}

export function isGenericPlaceholderHandle(handle?: string): boolean {
  if (!handle) return true;
  const clean = handle.replace(/^@+/, '').trim().toLowerCase();
  return (
    !clean ||
    clean === 'creator_vietnam' ||
    clean === 'creator.vietnam' ||
    clean === 'creator_tiktok' ||
    clean === 'tiktok_creator' ||
    clean === 'youtubecreator' ||
    clean === 'youtube' ||
    clean === 'facebook' ||
    clean === 'kênh youtube' ||
    clean === 'fanpage facebook'
  );
}

export async function resolveRealMediaChannelMeta(rawUrl: string): Promise<ResolvedMediaChannelMeta | null> {
  const cleanUrl = sanitizeMediaUrl(rawUrl || '');
  if (!cleanUrl || (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))) {
    return null;
  }

  const cached = mediaMetaCache.get(cleanUrl);
  if (cached) return cached;

  const existingPromise = mediaMetaPending.get(cleanUrl);
  if (existingPromise) return existingPromise;

  const task = (async (): Promise<ResolvedMediaChannelMeta | null> => {
    const platform = detectPlatform(cleanUrl);
    let result: ResolvedMediaChannelMeta | null = null;

    // 1. Gọi Serverless API `/api/resolve-media-meta` (hỗ trợ cả YouTube Data API v3, TikTok oEmbed+HTML, Facebook OpenGraph+JSON)
    try {
      const apiRes = await fetch(`/api/resolve-media-meta?url=${encodeURIComponent(cleanUrl)}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.success && (data.channelName || data.channelHandle || data.channelAvatar || data.resolvedUrl)) {
          result = {
            platform: data.platform || platform,
            channelId: data.channelId || null,
            videoId: data.videoId || null,
            channelName: data.channelName || data.channelHandle || '',
            channelHandle: data.channelHandle || (data.channelName ? `@${data.channelName}` : ''),
            channelUrl: data.channelUrl || cleanUrl,
            channelAvatar: data.channelAvatar || null,
            followerCount: typeof data.followerCount === 'number' ? data.followerCount : 0,
            videoTitle: data.videoTitle || null,
            resolvedUrl: data.resolvedUrl || cleanUrl
          };
        }
      }
    } catch {
      // Fallback sang gọi trực tiếp YouTube API / oEmbed phía client nếu backend tạm không phản hồi
    }

    // 2. Fallback chuyên biệt phía Client cho YouTube (nếu thiếu avatar hoặc tên kênh)
    if (platform === 'youtube' && (!result || !result.channelAvatar || !result.channelName)) {
      const ytId = extractYouTubeVideoId(cleanUrl);
      const ytApiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_YOUTUBE_API_KEY) || '';
      let chId: string | null = null;
      let chName = result?.channelName || '';
      let chHandle = result?.channelHandle || '';
      let chUrl = result?.channelUrl || cleanUrl;
      let chAvatar = result?.channelAvatar || null;
      let vidTitle = result?.videoTitle || null;

      if (ytApiKey) {
        try {
          if (ytId) {
            const vRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(ytId)}&key=${encodeURIComponent(ytApiKey)}`);
            if (vRes.ok) {
              const vJson = await vRes.json();
              const snip = vJson?.items?.[0]?.snippet;
              if (snip) {
                chId = snip.channelId || null;
                chName = snip.channelTitle || chName;
                vidTitle = snip.title || vidTitle;
              }
            }
          }
          const handleMatch = cleanUrl.match(/youtube\.com\/@([^\/\?\#]+)/i);
          const urlHandle = handleMatch?.[1] ? decodeURIComponent(handleMatch[1]) : null;
          const channelEndpoint = chId
            ? `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${encodeURIComponent(chId)}&key=${encodeURIComponent(ytApiKey)}`
            : urlHandle
              ? `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${encodeURIComponent(urlHandle)}&key=${encodeURIComponent(ytApiKey)}`
              : null;
          if (channelEndpoint) {
            const cRes = await fetch(channelEndpoint);
            if (cRes.ok) {
              const cJson = await cRes.json();
              const cSnip = cJson?.items?.[0]?.snippet;
              if (cSnip) {
                chName = cSnip.title || chName;
                if (cSnip.customUrl) {
                  let decoded = cSnip.customUrl;
                  try { decoded = decodeURIComponent(decoded); } catch {}
                  chHandle = decoded.startsWith('@') ? decoded : `@${decoded}`;
                  chUrl = `https://www.youtube.com/${chHandle}`;
                }
                chAvatar = cSnip.thumbnails?.high?.url || cSnip.thumbnails?.medium?.url || cSnip.thumbnails?.default?.url || chAvatar;
              }
            }
          }
        } catch {
          // Ignore client YouTube API error
        }
      }

      // YouTube oEmbed fallback (hỗ trợ đầy đủ Unicode, không cắt cụt tên tiếng Việt!)
      if (!chName) {
        try {
          const oeRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(ytId ? `https://www.youtube.com/watch?v=${ytId}` : cleanUrl)}&format=json`);
          if (oeRes.ok) {
            const oe = await oeRes.json();
            if (oe?.author_name) chName = oe.author_name;
            if (oe?.title && !vidTitle) vidTitle = oe.title;
            if (oe?.author_url) {
              chUrl = oe.author_url;
              const m = oe.author_url.match(/@([^\/\?\#]+)/i);
              if (m && m[1]) {
                try { chHandle = `@${decodeURIComponent(m[1])}`; } catch { chHandle = `@${m[1]}`; }
              }
            }
          }
        } catch {
          // Ignore oEmbed error
        }
      }

      if (chName || chHandle || chAvatar) {
        result = {
          platform: 'youtube',
          channelName: chName || chHandle.replace(/^@+/, '') || 'Kênh YouTube',
          channelHandle: chHandle || (chName ? `@${chName}` : '@YouTube'),
          channelUrl: chUrl,
          channelAvatar: chAvatar,
          videoTitle: vidTitle,
          resolvedUrl: cleanUrl
        };
      }
    }

    if (result) {
      mediaMetaCache.set(cleanUrl, result);
      if (result.resolvedUrl && result.resolvedUrl !== cleanUrl) {
        mediaMetaCache.set(result.resolvedUrl, result);
      }
    }
    return result;
  })();

  mediaMetaPending.set(cleanUrl, task);
  try {
    return await task;
  } finally {
    mediaMetaPending.delete(cleanUrl);
  }
}

// Lấy Avatar dựa trên Platform & Handle (TUYỆT ĐỐI KHÔNG lấy nhầm avatar TikTok cho YouTube / Facebook hoặc handle chung)
export function getPlatformAvatar(platform: 'tiktok' | 'facebook' | 'youtube' | 'direct', handle?: string, fallback?: string): string {
  const clean = (handle || '').replace(/^@+/, '').trim();
  const bg = platform === 'facebook' ? '1877F2' : (platform === 'youtube' ? 'FF0000' : '010101');
  const displayInitial = clean && !isGenericPlaceholderHandle(clean) ? clean : (platform === 'youtube' ? 'YT' : platform === 'facebook' ? 'FB' : 'TT');
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayInitial)}&background=${bg}&color=fff&bold=true&size=128`;

  if (!clean || isGenericPlaceholderHandle(clean)) {
    return fallback || defaultAvatar;
  }

  // Chỉ gọi unavatar với handle ASCII hợp lệ; handle Unicode có dấu (vd NGUYỄN...) tránh unavatar trả sai người lạ
  const isCleanAsciiSlug = /^[a-zA-Z0-9._-]+$/.test(clean);
  if (!isCleanAsciiSlug) {
    return fallback || defaultAvatar;
  }

  if (platform === 'youtube') {
    return `https://unavatar.io/youtube/${encodeURIComponent(clean)}?fallback=${encodeURIComponent(defaultAvatar)}`;
  }
  if (platform === 'facebook') {
    return `https://unavatar.io/facebook/${encodeURIComponent(clean)}?fallback=${encodeURIComponent(defaultAvatar)}`;
  }
  return `https://unavatar.io/tiktok/${encodeURIComponent(clean)}?fallback=${encodeURIComponent(defaultAvatar)}`;
}

// Lấy Avatar TikTok thật 100% dựa trên Handle chính xác của tài khoản
export function getTikTokAvatar(handle?: string, fallback?: string): string {
  return getPlatformAvatar('tiktok', handle, fallback);
}


