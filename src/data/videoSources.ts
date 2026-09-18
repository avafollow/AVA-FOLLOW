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

// Bộ nguồn video & stream tốc độ cao cho video nền và livestream
export const HIGH_SPEED_CDN_VIDEOS = {
  fyp: [
    '/videos/sample1.mp4',
    '/videos/sample2.mp4',
    '/videos/sample3.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
  ],
  livestream: [
    '/videos/sample2.mp4',
    '/videos/sample3.mp4',
    '/videos/sample1.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  ],
  product_review: [
    '/videos/sample3.mp4',
    '/videos/sample1.mp4',
    '/videos/sample2.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  ]
};

// Nhận diện nền tảng từ URL
export function detectPlatform(url: string): 'tiktok' | 'facebook' | 'youtube' | 'direct' {
  if (!url) return 'tiktok';
  const clean = url.toLowerCase().trim();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('facebook.com') || clean.includes('fb.watch') || clean.includes('fb.com')) return 'facebook';
  if (clean.includes('tiktok.com') || clean.includes('vt.tiktok.com')) return 'tiktok';
  if (/\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i.test(clean)) return 'direct';
  return 'tiktok';
}

// Hàm trích xuất @handle từ URL bất kỳ
export function extractTikTokHandle(rawUrlOrHandle: string): string {
  if (!rawUrlOrHandle) return '@creator_vietnam';
  const clean = rawUrlOrHandle.trim();
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    // 1. TikTok standard @username
    const match = clean.match(/tiktok\.com\/@([a-zA-Z0-9_\.\-]+)/i);
    if (match && match[1]) {
      return `@${match[1]}`;
    }

    // 2. TikTok short links (vt.tiktok.com or vm.tiktok.com)
    if (clean.includes('vt.tiktok.com') || clean.includes('vm.tiktok.com')) {
      const codeMatch = clean.match(/tiktok\.com\/([a-zA-Z0-9_\.\-]+)/i);
      if (codeMatch && codeMatch[1]) {
        return `@tiktok_${codeMatch[1].toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
      }
      return '@creator_tiktok';
    }

    // 3. YouTube @handle
    const ytMatch = clean.match(/youtube\.com\/@([a-zA-Z0-9_\.\-]+)/i);
    if (ytMatch && ytMatch[1]) {
      return `@${ytMatch[1]}`;
    }

    // 4. YouTube channel / user
    const ytChannelMatch = clean.match(/youtube\.com\/(?:c|channel|user)\/([a-zA-Z0-9_\.\-]+)/i);
    if (ytChannelMatch && ytChannelMatch[1]) {
      return `@${ytChannelMatch[1]}`;
    }

    // 5. Facebook page / user
    const fbMatch = clean.match(/facebook\.com\/([a-zA-Z0-9_\.\-]+)/i);
    if (fbMatch && fbMatch[1] && !['watch', 'reel', 'videos', 'share', 'groups', 'stories', 'events', 'photo'].includes(fbMatch[1].toLowerCase())) {
      return `@${fbMatch[1]}`;
    }

    return '@creator_vietnam';
  }

  // Nếu đã có dạng @username
  if (clean.startsWith('@')) {
    return clean.split(/[\/\?]/)[0];
  }

  return `@${clean}`;
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
  const match = clean.match(/\/(?:video|v|embed\/v2|embed|player\/v1|share\/video)\/(\d{10,24})/i);
  if (match && match[1]) {
    return match[1];
  }

  // 3. Query param ?item_id=123... hoặc ?video_id=123... hoặc &id=123...
  const paramMatch = clean.match(/[?&](?:item_id|video_id|mid|id)=(\d{10,24})/i);
  if (paramMatch && paramMatch[1]) {
    return paramMatch[1];
  }

  // 4. Fallback bất kỳ /video/ hoặc /v/ kèm chữ số
  const matchAny = clean.match(/\/(?:video|v)\/(\d+)/i);
  if (matchAny && matchAny[1] && matchAny[1].length >= 8) {
    return matchAny[1];
  }

  // 5. Chuỗi bất kỳ chứa dãy số 12-24 chữ số trong URL tiktok
  if (clean.includes('tiktok.com')) {
    const longDigits = clean.match(/(\d{12,24})/);
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
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i);
  if (match && match[1]) return match[1];
  const paramMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (paramMatch && paramMatch[1]) return paramMatch[1];
  const shortMatch = clean.match(/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  return null;
}

// Phân tích toàn diện URL dán vào để trả về bộ thông tin stream & embed
export function parseMediaUrl(inputUrl: string, defaultHandle?: string): ParsedMediaInfo {
  const url = (inputUrl || '').trim();
  const handle = extractTikTokHandle(url) || defaultHandle || '@creator_vietnam';
  const cleanHandle = handle.replace(/^@+/, '');

  const isLive = /\/(live|livestream)($|\/|\?)/i.test(url) || /tiktok\.com\/@[\w\.-]+\/live/i.test(url) || /youtube\.com\/.*\/live/i.test(url);
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isFacebook = url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com');
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
    channelName = cleanHandle ? `Kênh ${cleanHandle}` : 'Kênh YouTube';
    channelUrl = cleanHandle ? `https://www.youtube.com/@${cleanHandle}` : (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : url);
    if (youtubeId) {
      embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&playsinline=1&controls=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&enablejsapi=1`;
      sourceType = 'youtube_embed';
      streamUrl = url;
    }
  } else if (isFacebook) {
    actionCtaLabel = 'Theo Dõi Fanpage Facebook';
    channelName = cleanHandle ? `Fanpage ${cleanHandle}` : 'Fanpage Facebook';
    channelUrl = cleanHandle ? `https://www.facebook.com/${cleanHandle}` : url;
    fanpageUrl = channelUrl;
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&muted=0&allowfullscreen=true`;
    sourceType = 'facebook_embed';
    streamUrl = url;
  } else if (isTikTok) {
    actionCtaLabel = 'Follow TikTok';
    channelName = `@${cleanHandle}`;
    channelUrl = `https://www.tiktok.com/@${cleanHandle}`;
    if (videoId) {
      embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
      sourceType = 'tiktok_embed';
    } else if (isLive) {
      sourceType = 'live_stream';
    }
    streamUrl = url;
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

  const avatarUrl = getPlatformAvatar(platform, cleanHandle);

  return {
    platform,
    isTikTok,
    isLive,
    isYouTube,
    isFacebook,
    isDirectVideo,
    handle,
    channelName,
    channelUrl,
    fanpageUrl,
    avatarUrl,
    actionCtaLabel,
    videoId: videoId || undefined,
    youtubeId: youtubeId || undefined,
    embedUrl,
    streamUrl,
    title,
    sourceType
  };
}

// Lấy Avatar dựa trên Platform & Handle
export function getPlatformAvatar(platform: 'tiktok' | 'facebook' | 'youtube' | 'direct', handle?: string, fallback?: string): string {
  const clean = (handle || '').replace(/^@+/, '').trim();
  if (!clean) return fallback || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';
  
  if (platform === 'youtube') {
    return `https://unavatar.io/youtube/${clean}`;
  }
  if (platform === 'facebook') {
    return `https://unavatar.io/facebook/${clean}`;
  }
  return `https://unavatar.io/tiktok/${clean}`;
}

// Lấy Avatar TikTok thật 100% dựa trên Handle chính xác của tài khoản
export function getTikTokAvatar(handle?: string, fallback?: string): string {
  return getPlatformAvatar('tiktok', handle, fallback);
}

