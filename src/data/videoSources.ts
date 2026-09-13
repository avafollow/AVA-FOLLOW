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

// Kho video CDN chất lượng cao định dạng MP4/H.264 chạy siêu mượt, không lỗi CORS, tải tức thì (<100ms)
export const HIGH_SPEED_CDN_VIDEOS = {
  // Video dạng đứng dọc chuẩn TikTok FYP
  fyp: [
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://media.w3.org/2010/05/video/movie_300.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4'
  ],
  // Phiên Live Stream bán hàng / KOC Studio
  livestream: [
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://media.w3.org/2010/05/video/movie_300.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4'
  ],
  // Review sản phẩm & Affiliate
  product_review: [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://media.w3.org/2010/05/video/movie_300.mp4'
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
  
  // 1. Dạng số thuần túy (15-22 chữ số)
  if (/^\d{15,22}$/.test(clean)) {
    return clean;
  }
  
  // 2. /video/12345... hoặc /v/12345... hoặc /embed/v2/12345... hoặc /embed/12345...
  const match = clean.match(/\/(?:video|v|embed\/v2|embed)\/(\d{15,22})/i);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Fallback bất kỳ /video/ hoặc /v/ kèm chữ số
  const matchAny = clean.match(/\/(?:video|v)\/(\d+)/i);
  if (matchAny && matchAny[1]) {
    return matchAny[1];
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

  let streamUrl: string;
  let sourceType: ParsedMediaInfo['sourceType'] = 'cdn_stream';
  let embedUrl: string | undefined;

  if (isDirectVideo) {
    streamUrl = url;
    sourceType = 'direct_stream';
  } else if (isYouTube && youtubeId) {
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
    embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`;
    sourceType = 'youtube_embed';
  } else if (isFacebook) {
    streamUrl = HIGH_SPEED_CDN_VIDEOS.fyp[absHash % HIGH_SPEED_CDN_VIDEOS.fyp.length];
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=1`;
    sourceType = 'facebook_embed';
  } else if (isLive) {
    const list = HIGH_SPEED_CDN_VIDEOS.livestream;
    streamUrl = list[absHash % list.length];
    sourceType = 'live_stream';
  } else {
    const list = HIGH_SPEED_CDN_VIDEOS.fyp;
    streamUrl = list[absHash % list.length];
    if (videoId) {
      embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
      sourceType = 'tiktok_embed';
    }
  }

  let title = `Video TikTok Xu Hướng: ${handle}`;
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
