// ===== BỘ NGUỒN VIDEO & LIVESTREAM SIÊU MƯỢT (ULTRA-SMOOTH CDN, YOUTUBE, FACEBOOK & TIKTOK PARSER) =====

export interface ParsedMediaInfo {
  isTikTok: boolean;
  isLive: boolean;
  isYouTube: boolean;
  isFacebook: boolean;
  isDirectVideo: boolean;
  handle: string;
  videoId?: string;
  youtubeId?: string;
  embedUrl?: string;
  streamUrl: string;
  title: string;
  sourceType: 'tiktok_embed' | 'cdn_stream' | 'youtube_embed' | 'facebook_embed' | 'live_stream' | 'direct_stream';
}

// Bộ nguồn video & stream tốc độ cao cho video nền và livestream
export const HIGH_SPEED_CDN_VIDEOS = {
  fyp: [
    '/videos/sample1.mp4',
    '/videos/sample2.mp4',
    '/videos/sample3.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  ],
  livestream: [
    '/videos/sample2.mp4',
    '/videos/sample3.mp4',
    '/videos/sample1.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  ],
  product_review: [
    '/videos/sample3.mp4',
    '/videos/sample1.mp4',
    '/videos/sample2.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  ]
};

// Hàm trích xuất @handle từ URL bất kỳ
export function extractTikTokHandle(rawUrlOrHandle: string): string {
  if (!rawUrlOrHandle) return '@creator_tiktok';
  const clean = rawUrlOrHandle.trim();
  
  // Nếu đã có dạng @username
  if (clean.startsWith('@')) {
    return clean.split(/[\/\?]/)[0];
  }

  // Nếu là link tiktok.com/@username/video/...
  const match = clean.match(/tiktok\.com\/@([a-zA-Z0-9_\.\-]+)/i);
  if (match && match[1]) {
    return `@${match[1]}`;
  }

  // Nếu là link youtube.com/@username
  const ytMatch = clean.match(/youtube\.com\/@([a-zA-Z0-9_\.\-]+)/i);
  if (ytMatch && ytMatch[1]) {
    return `@${ytMatch[1]}`;
  }

  // Nếu là link facebook.com/username
  const fbMatch = clean.match(/facebook\.com\/([a-zA-Z0-9_\.\-]+)/i);
  if (fbMatch && fbMatch[1] && !['watch', 'reel', 'videos', 'share'].includes(fbMatch[1].toLowerCase())) {
    return `@${fbMatch[1]}`;
  }

  return clean.startsWith('@') ? clean : `@${clean}`;
}

// Hàm trích xuất Video ID từ TikTok URL
export function extractTikTokVideoId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  
  // 1. Dạng số thuần túy (10-24 chữ số)
  if (/^\d{10,24}$/.test(clean)) {
    return clean;
  }
  
  // 2. /video/12345... hoặc /v/12345... hoặc /embed/v2/12345... hoặc /embed/12345... hoặc /share/video/12345...
  const match = clean.match(/\/(?:video|v|embed\/v2|embed|share\/video)\/(\d{10,24})/i);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Query param ?item_id=123... hoặc ?video_id=123...
  const paramMatch = clean.match(/[?&](?:item_id|video_id|mid)=(\d{10,24})/i);
  if (paramMatch && paramMatch[1]) {
    return paramMatch[1];
  }

  // 4. Fallback bất kỳ /video/ hoặc /v/ kèm chữ số
  const matchAny = clean.match(/\/(?:video|v)\/(\d+)/i);
  if (matchAny && matchAny[1] && matchAny[1].length >= 8) {
    return matchAny[1];
  }

  // 5. Chuỗi bất kỳ chứa dãy số 18-20 chữ số trong URL tiktok
  if (clean.includes('tiktok.com')) {
    const longDigits = clean.match(/(\d{18,21})/);
    if (longDigits && longDigits[1]) {
      return longDigits[1];
    }
  }

  return null;
}

// Hàm trích xuất Video ID từ YouTube URL (watch, shorts, live, youtu.be, embed)
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i);
  if (match && match[1]) return match[1];
  const paramMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (paramMatch && paramMatch[1]) return paramMatch[1];
  return null;
}

// Phân tích toàn diện URL dán vào để trả về bộ thông tin stream & embed
export function parseMediaUrl(inputUrl: string, defaultHandle?: string): ParsedMediaInfo {
  const url = (inputUrl || '').trim();
  const handle = extractTikTokHandle(url) || defaultHandle || '@creator_tiktok';
  const isLive = url.includes('/live') || url.toLowerCase().includes('live');
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isFacebook = url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com');
  const isDirectVideo = /\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i.test(url);
  const isTikTok = !isYouTube && !isFacebook && (url.includes('tiktok.com') || url.includes('vt.tiktok.com') || url.startsWith('@') || !url.startsWith('http'));

  const videoId = extractTikTokVideoId(url);
  const youtubeId = extractYouTubeVideoId(url);

  // Hash handle/url để chọn stream ổn định cố định cho từng kênh/video
  let hash = 0;
  const seedStr = url || handle;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  let streamUrl = url;
  let sourceType: ParsedMediaInfo['sourceType'] = 'direct_stream';
  let embedUrl: string | undefined;

  if (isDirectVideo) {
    streamUrl = url;
    sourceType = 'direct_stream';
  } else if (isYouTube && youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`;
    sourceType = 'youtube_embed';
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
  } else if (isFacebook) {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=0&allowfullscreen=true`;
    sourceType = 'facebook_embed';
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
  } else if (isTikTok && videoId) {
    embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    sourceType = 'tiktok_embed';
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
  } else if (isLive) {
    sourceType = 'live_stream';
    streamUrl = HIGH_SPEED_CDN_VIDEOS.livestream[absHash % HIGH_SPEED_CDN_VIDEOS.livestream.length];
  } else {
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
  }

  let title = `Video TikTok: ${handle}`;
  if (isLive) {
    title = `🔴 LIVE STREAM: ${handle}`;
  } else if (isYouTube) {
    title = `▶️ YouTube Video: ${handle}`;
  } else if (isFacebook) {
    title = `🌐 Facebook Video: ${handle}`;
  }

  return {
    isTikTok,
    isLive,
    isYouTube,
    isFacebook,
    isDirectVideo,
    handle,
    videoId: videoId || undefined,
    youtubeId: youtubeId || undefined,
    embedUrl,
    streamUrl,
    title,
    sourceType
  };
}

// Lấy Avatar TikTok thật 100% dựa trên Handle chính xác của tài khoản
export function getTikTokAvatar(handle?: string, fallback?: string): string {
  const clean = (handle || '').replace(/^@+/, '').trim();
  if (!clean) return fallback || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';
  return `https://unavatar.io/tiktok/${clean}`;
}

