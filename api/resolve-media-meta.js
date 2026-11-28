// Universal Real Media Metadata Resolver (YouTube, TikTok, Facebook)
// Extracts exact Channel Name, Channel Handle, Channel URL, and Real Channel Logo/Avatar.

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\//g, '/')
    .trim();
}

function safeDecodeURIComponent(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function extractYouTubeVideoId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const m1 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (m2) return m2[1];
  const m3 = url.match(/\/(?:shorts|live|embed|v)\/([a-zA-Z0-9_-]{11})/i);
  if (m3) return m3[1];
  return null;
}

function extractYouTubeHandleFromUrl(url) {
  if (!url) return null;
  const m = url.match(/youtube\.com\/@([^\/\?\#]+)/i);
  if (m && m[1]) {
    const decoded = safeDecodeURIComponent(m[1]).trim();
    return decoded ? `@${decoded}` : null;
  }
  return null;
}

function extractYouTubeChannelIdFromUrl(url) {
  if (!url) return null;
  const m = url.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/i);
  return m ? m[1] : null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveYouTube(targetUrl) {
  const videoId = extractYouTubeVideoId(targetUrl);
  let channelId = extractYouTubeChannelIdFromUrl(targetUrl);
  let channelHandle = extractYouTubeHandleFromUrl(targetUrl);
  let channelName = null;
  let channelUrl = null;
  let channelAvatar = null;
  let videoTitle = null;
  let followerCount = 0;

  const parseHumanCount = (str) => {
    if (!str) return 0;
    const clean = String(str).replace(/,/g, '.').trim().toUpperCase();
    const m = clean.match(/([\d.]+)\s*(K|M|B|TR|N|NGHÌN|TRIỆU)?/i);
    if (!m) return 0;
    const num = parseFloat(m[1]);
    if (Number.isNaN(num)) return 0;
    const unit = (m[2] || '').toUpperCase();
    if (unit === 'B') return Math.round(num * 1_000_000_000);
    if (unit === 'M' || unit === 'TR' || unit === 'TRIỆU') return Math.round(num * 1_000_000);
    if (unit === 'K' || unit === 'N' || unit === 'NGHÌN') return Math.round(num * 1_000);
    return Math.round(num);
  };

  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || '';

  // 1. Official YouTube Data API v3 (100% accurate channel title, logo & subscriberCount)
  if (apiKey) {
    try {
      if (videoId) {
        const vidRes = await fetchWithTimeout(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`
        );
        if (vidRes.ok) {
          const vidJson = await vidRes.json();
          const snippet = vidJson?.items?.[0]?.snippet;
          if (snippet) {
            channelId = snippet.channelId || channelId;
            channelName = snippet.channelTitle || channelName;
            videoTitle = snippet.title || videoTitle;
          }
        }
      }

      let channelApiUrl = null;
      if (channelId) {
        channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
      } else if (channelHandle) {
        const cleanForHandle = channelHandle.replace(/^@+/, '');
        channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(cleanForHandle)}&key=${encodeURIComponent(apiKey)}`;
      }

      if (channelApiUrl) {
        const chRes = await fetchWithTimeout(channelApiUrl);
        if (chRes.ok) {
          const chJson = await chRes.json();
          const chItem = chJson?.items?.[0];
          const chSnippet = chItem?.snippet;
          if (chItem?.statistics?.subscriberCount) {
            followerCount = parseInt(chItem.statistics.subscriberCount, 10) || followerCount;
          }
          if (chSnippet) {
            channelId = chItem.id || channelId;
            channelName = chSnippet.title || channelName;
            if (chSnippet.customUrl) {
              const decodedCustom = safeDecodeURIComponent(chSnippet.customUrl);
              channelHandle = decodedCustom.startsWith('@') ? decodedCustom : `@${decodedCustom}`;
              channelUrl = `https://www.youtube.com/${channelHandle}`;
            } else if (channelId) {
              channelUrl = `https://www.youtube.com/channel/${channelId}`;
            }
            channelAvatar =
              chSnippet.thumbnails?.high?.url ||
              chSnippet.thumbnails?.medium?.url ||
              chSnippet.thumbnails?.default?.url ||
              channelAvatar;
          }
        }
      }
    } catch {
      // Fall through to oEmbed + HTML scraping fallback
    }
  }

  // 2. Fallback: YouTube oEmbed (always works without API key for videos/shorts/lives)
  if ((!channelName || !channelUrl) && videoId) {
    try {
      const canonicalWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const oembedRes = await fetchWithTimeout(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalWatchUrl)}&format=json`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        }
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        if (oembed.author_name && !channelName) {
          channelName = decodeHtmlEntities(oembed.author_name);
        }
        if (oembed.title && !videoTitle) {
          videoTitle = decodeHtmlEntities(oembed.title);
        }
        if (oembed.author_url) {
          channelUrl = channelUrl || oembed.author_url;
          const parsedHandle = extractYouTubeHandleFromUrl(oembed.author_url);
          if (parsedHandle && !channelHandle) {
            channelHandle = parsedHandle;
          }
          const parsedCid = extractYouTubeChannelIdFromUrl(oembed.author_url);
          if (parsedCid && !channelId) {
            channelId = parsedCid;
          }
        }
      }
    } catch {
      // Ignore oEmbed failure
    }
  }

  // 3. Fallback: Fetch channel page HTML to get exact yt3.googleusercontent.com avatar logo & real channel name
  const pageToFetch = channelUrl || (channelHandle ? `https://www.youtube.com/${channelHandle}` : targetUrl);
  if (!channelAvatar || !channelName) {
    try {
      const pageRes = await fetchWithTimeout(pageToFetch, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cookie': 'CONSENT=YES+cb'
        }
      });
      if (pageRes.ok) {
        const html = await pageRes.text();

        // Extract exact YouTube channel avatar (yt3.googleusercontent.com or yt3.ggpht.com)
        if (!channelAvatar) {
          const ogImgMatch = html.match(/<meta\s+property="og:image"\s+content="(https:\/\/yt3\.[^"]+)"/i) ||
                             html.match(/<link\s+rel="image_src"\s+href="(https:\/\/yt3\.[^"]+)"/i) ||
                             html.match(/"avatar":\{"thumbnails":\[\{"url":"(https:\/\/yt3\.[^"]+)"/i) ||
                             html.match(/"channelThumbnail":\{"thumbnails":\[\{"url":"(https:\/\/yt3\.[^"]+)"/i) ||
                             html.match(/(https:\/\/yt3\.(?:googleusercontent\.com|ggpht\.com)\/[a-zA-Z0-9_\-\/=]+)/);
          if (ogImgMatch && ogImgMatch[1]) {
            channelAvatar = decodeHtmlEntities(ogImgMatch[1]);
          }
        }

        // Extract channel title if missing
        if (!channelName) {
          const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                          html.match(/"ownerChannelName":"([^"]+)"/i) ||
                          html.match(/"author":"([^"]+)"/i);
          if (ogTitle && ogTitle[1]) {
            channelName = decodeHtmlEntities(ogTitle[1]);
          }
        }

        // Extract YouTube UC... channelId if missing (required for /embed/live_stream?channel=UC...)
        if (!channelId) {
          const cidMatch =
            html.match(/"externalId":"(UC[a-zA-Z0-9_-]{20,})"/i) ||
            html.match(/"channelId":"(UC[a-zA-Z0-9_-]{20,})"/i) ||
            html.match(/<meta\s+itemprop="identifier"\s+content="(UC[a-zA-Z0-9_-]{20,})"/i);
          if (cidMatch && cidMatch[1]) {
            channelId = cidMatch[1];
          }
        }

        // Extract channel canonical handle if missing
        if (!channelHandle) {
          const handleInHtml = html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/i);
          if (handleInHtml && handleInHtml[1]) {
            channelHandle = safeDecodeURIComponent(decodeHtmlEntities(handleInHtml[1]));
          }
        }

        // Extract subscriber count from YouTube page HTML if missing
        if (!followerCount) {
          const subMatch =
            html.match(/"subscriberCountText":\{"(?:accessibility":\{[^}]+\},"?)?simpleText":"([^"]+)"/i) ||
            html.match(/"subscriberCountText":\{"runs":\[\{"text":"([^"]+)"/i) ||
            html.match(/([\d.,]+\s*(?:K|M|B|N|Tr|nghìn|triệu)?)\s*(?:subscribers|người đăng ký)/i);
          if (subMatch && subMatch[1]) {
            followerCount = parseHumanCount(subMatch[1]);
          }
        }
      }
    } catch {
      // Ignore HTML fetch error
    }
  }

  // Ensure clean display values (NEVER truncate Unicode Vietnamese names!)
  const finalChannelName = channelName || (channelHandle ? channelHandle.replace(/^@+/, '') : 'Kênh YouTube');
  const finalHandle = channelHandle || (channelName ? `@${channelName.trim()}` : '@YouTube');
  const finalChannelUrl = channelUrl || (channelId ? `https://www.youtube.com/channel/${channelId}` : targetUrl);

  return {
    success: true,
    platform: 'youtube',
    channelId: channelId || null,
    channelName: finalChannelName,
    channelHandle: finalHandle,
    channelUrl: finalChannelUrl,
    channelAvatar: channelAvatar || null,
    followerCount: followerCount || 0,
    videoTitle: videoTitle || null,
    resolvedUrl: targetUrl
  };
}

async function resolveTikTok(targetUrl) {
  let finalUrl = targetUrl;
  let channelHandle = null;
  let channelName = null;
  let channelUrl = null;
  let channelAvatar = null;
  let videoTitle = null;
  let videoId = null;

  // 1. Follow multi-hop redirects for mobile shortlinks (vt.tiktok.com, vm.tiktok.com, tiktok.com/t/, m.tiktok.com/v/)
  if (/vt\.tiktok\.com|vm\.tiktok\.com|tiktok\.com\/t\/|m\.tiktok\.com\/v\//i.test(targetUrl)) {
    let curr = targetUrl;
    const seen = new Set([curr]);
    for (let hop = 0; hop < 6; hop++) {
      try {
        const res = await fetchWithTimeout(curr, {
          redirect: 'manual',
          headers: {
            'User-Agent': hop === 0
              ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
              : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        }, 6000);
        if (res.status >= 300 && res.status < 400) {
          const loc = res.headers.get('location');
          if (!loc) break;
          const next = new URL(loc, curr).href;
          if (seen.has(next) || /tiktok\.com\/(?:login|foryou|explore)\/?(\?|$)/i.test(next)) break;
          seen.add(next);
          curr = next;
          continue;
        }
        break;
      } catch {
        break;
      }
    }
    finalUrl = curr;
  }

  const vidMatch =
    finalUrl.match(/\/(?:video|photo|v|embed\/v2|embed|player\/v1)\/(\d{10,24})/i) ||
    finalUrl.match(/[?&](?:item_id|video_id)=(\d{10,24})/i);
  if (vidMatch && vidMatch[1]) videoId = vidMatch[1];

  const handleMatch = finalUrl.match(/(?:live\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)/i);
  if (handleMatch && handleMatch[1]) {
    channelHandle = `@${handleMatch[1]}`;
    channelUrl = `https://www.tiktok.com/@${handleMatch[1]}`;
  }

  // 2. TikTok official oEmbed API (returns exact author_name, author_unique_id, embed_product_id)
  try {
    const oembedRes = await fetchWithTimeout(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      },
      6000
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      if (oembed.embed_product_id && /^\d{10,24}$/.test(String(oembed.embed_product_id))) {
        videoId = videoId || String(oembed.embed_product_id);
      }
      if (oembed.author_name) channelName = decodeHtmlEntities(oembed.author_name);
      if (oembed.author_unique_id) {
        channelHandle = `@${oembed.author_unique_id}`;
        channelUrl = `https://www.tiktok.com/@${oembed.author_unique_id}`;
      } else if (oembed.author_url) {
        channelUrl = oembed.author_url;
        const m = oembed.author_url.match(/@([a-zA-Z0-9._-]+)/i);
        if (m && m[1]) channelHandle = `@${m[1]}`;
      }
      if (oembed.title) videoTitle = decodeHtmlEntities(oembed.title);
    }
  } catch {
    // Continue
  }

  // 3. TikWM API (reliable direct author avatar, nickname, unique_id & videoId even for shortlinks)
  if (!channelAvatar || !channelName || !channelHandle) {
    try {
      const twRes = await fetchWithTimeout(
        `https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          }
        },
        6000
      );
      if (twRes.ok) {
        const tw = await twRes.json();
        if (tw?.code === 0 && tw?.data) {
          if (tw.data.id && !videoId) videoId = String(tw.data.id);
          if (tw.data.title && !videoTitle) videoTitle = tw.data.title;
          if (tw.data.author?.nickname) channelName = tw.data.author.nickname;
          if (tw.data.author?.unique_id) {
            channelHandle = `@${tw.data.author.unique_id}`;
            channelUrl = `https://www.tiktok.com/@${tw.data.author.unique_id}`;
          }
          if (tw.data.author?.avatar) channelAvatar = tw.data.author.avatar;
        }
      }
    } catch {
      // Continue
    }
  }

  // 4. Official TikTok Live/User JSON API (/api-live/user/room) — returns exact 1080px avatarLarger, nickname & followerCount!
  let followerCount = 0;
  const cleanHandleForApi = (channelHandle || '').replace(/^@+/, '').trim();
  if (cleanHandleForApi) {
    try {
      const apiRes = await fetchWithTimeout(
        `https://www.tiktok.com/api-live/user/room/?aid=1988&sourceType=54&uniqueId=${encodeURIComponent(cleanHandleForApi)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://www.tiktok.com/'
          }
        },
        6000
      );
      if (apiRes.ok) {
        const j = await apiRes.json();
        const u = j?.data?.user;
        const st = j?.data?.stats;
        if (st && typeof st.followerCount === 'number') {
          followerCount = st.followerCount;
        }
        if (u) {
          if (u.nickname) channelName = u.nickname;
          if (u.uniqueId) {
            channelHandle = `@${u.uniqueId}`;
            channelUrl = `https://www.tiktok.com/@${u.uniqueId}`;
          }
          if (u.avatarLarger || u.avatarMedium || u.avatarThumb) {
            channelAvatar = u.avatarLarger || u.avatarMedium || u.avatarThumb;
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  const cleanHandle = (channelHandle || '').replace(/^@+/, '');
  const finalChannelName = channelName || (cleanHandle ? `@${cleanHandle}` : 'Kênh TikTok');
  const finalHandle = channelHandle || '@tiktok_creator';

  return {
    success: true,
    platform: 'tiktok',
    videoId: videoId || null,
    channelName: finalChannelName,
    channelHandle: finalHandle,
    channelUrl: channelUrl || finalUrl,
    channelAvatar: channelAvatar || (cleanHandle ? `https://unavatar.io/tiktok/${encodeURIComponent(cleanHandle)}` : null),
    followerCount: followerCount || 0,
    videoTitle: videoTitle || null,
    resolvedUrl: finalUrl
  };
}

async function resolveFacebook(targetUrl) {
  let finalUrl = targetUrl.replace(/https?:\/\/(?:m|mobile|web)\.facebook\.com/i, 'https://www.facebook.com');
  let channelName = null;
  let channelHandle = null;
  let channelUrl = null;
  let channelAvatar = null;
  let videoTitle = null;
  let ownerId = null;
  let fbFollowerCount = 0;

  // Extract slug from URL if it's a direct page/profile URL
  const reservedPaths = ['watch', 'reel', 'reels', 'videos', 'video.php', 'share', 'groups', 'stories', 'events', 'photo', 'photo.php', 'profile.php', 'permalink.php', 'story.php', 'live'];
  const slugMatch = targetUrl.match(/facebook\.com\/([^\/\?\#]+)/i);
  if (slugMatch && slugMatch[1] && !reservedPaths.includes(slugMatch[1].toLowerCase())) {
    const slug = safeDecodeURIComponent(slugMatch[1]);
    channelHandle = `@${slug}`;
    channelUrl = `https://www.facebook.com/${slug}`;
  }
  const profileIdMatch = targetUrl.match(/[?&]id=(\d{5,})/i);
  if (profileIdMatch && profileIdMatch[1]) {
    ownerId = profileIdMatch[1];
  }

  // Fetch Facebook HTML (desktop UA first, then crawler UA for OpenGraph tags)
  const uaCandidates = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
  ];

  for (const ua of uaCandidates) {
    if (channelName && channelAvatar) break;
    try {
      const res = await fetchWithTimeout(finalUrl, {
        redirect: 'follow',
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
          'Sec-Fetch-Mode': 'navigate'
        }
      });
      if (res.url && res.url.includes('facebook.com')) {
        let candidateUrl = res.url;
        // Nếu Facebook redirect sang /login/?next=..., giải mã lại tham số next để lấy đúng link gốc!
        if (/facebook\.com\/login/i.test(candidateUrl)) {
          try {
            const nextParam = new URL(candidateUrl).searchParams.get('next');
            if (nextParam && nextParam.includes('facebook.com') && !/facebook\.com\/login/i.test(nextParam)) {
              candidateUrl = nextParam;
            } else {
              candidateUrl = '';
            }
          } catch {
            candidateUrl = '';
          }
        }
        if (candidateUrl) {
          finalUrl = candidateUrl.replace(/https?:\/\/(?:m|mobile|web)\.facebook\.com/i, 'https://www.facebook.com');
          const resolvedSlug = finalUrl.match(/facebook\.com\/([^\/\?\#]+)/i);
          if (resolvedSlug && resolvedSlug[1] && !reservedPaths.includes(resolvedSlug[1].toLowerCase()) && !channelHandle) {
            const slug = safeDecodeURIComponent(resolvedSlug[1]);
            channelHandle = `@${slug}`;
            channelUrl = `https://www.facebook.com/${slug}`;
          }
        }
      }

      if (res.ok) {
        const html = await res.text();

        // 0. Extract canonical og:url so /share/v/, /share/r/, fb.watch resolve cleanly for plugins/video.php
        const ogUrlMatch =
          html.match(/<meta\s+property="og:url"\s+content="(https?:\/\/[^"]+)"/i) ||
          html.match(/<link\s+rel="canonical"\s+href="(https?:\/\/[^"]+)"/i);
        if (ogUrlMatch && ogUrlMatch[1] && ogUrlMatch[1].includes('facebook.com')) {
          const decodedOgUrl = decodeHtmlEntities(ogUrlMatch[1])
            .replace(/https?:\/\/(?:m|mobile|web)\.facebook\.com/i, 'https://www.facebook.com');
          if (!/facebook\.com\/(?:login|share\/)/i.test(decodedOgUrl)) {
            finalUrl = decodedOgUrl;
          }
        }

        // 1. Extract real Facebook Page/User owner name from embedded JSON
        if (!channelName) {
          const ownerMatch =
            html.match(/"owner":\{"__typename":"(?:User|Page)","id":"(\d+)"[^}]*?"name":"([^"]+)"/i) ||
            html.match(/"owning_profile":\{"__typename":"(?:User|Page)","name":"([^"]+)","id":"(\d+)"/i) ||
            html.match(/"pageName":"([^"]+)"/i) ||
            html.match(/"actor":\{"__typename":"(?:User|Page)"[^}]*?"name":"([^"]+)"/i);

          if (ownerMatch) {
            if (ownerMatch[2] && /^\d+$/.test(ownerMatch[1])) {
              ownerId = ownerId || ownerMatch[1];
              channelName = decodeHtmlEntities(ownerMatch[2]);
            } else if (ownerMatch[1]) {
              channelName = decodeHtmlEntities(ownerMatch[1]);
              if (ownerMatch[2] && /^\d+$/.test(ownerMatch[2])) {
                ownerId = ownerId || ownerMatch[2];
              }
            }
          }
        }

        // 2. Extract real Facebook Page/User profile picture logo
        if (!channelAvatar) {
          const picMatch =
            html.match(/"profile_picture":\{"uri":"(https:[^"]+)"/i) ||
            html.match(/"profilePicLarge":\{"uri":"(https:[^"]+)"/i) ||
            html.match(/"profilePicMedium":\{"uri":"(https:[^"]+)"/i) ||
            html.match(/"actor_photo":\{"uri":"(https:[^"]+)"/i);
          if (picMatch && picMatch[1]) {
            channelAvatar = decodeHtmlEntities(picMatch[1]);
          }
        }

        // 3. Extract og:title & og:image as fallback
        const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                             html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          const cleaned = decodeHtmlEntities(ogTitleMatch[1])
            .replace(/\s*[\|\-–—]\s*Facebook.*$/i, '')
            .replace(/^Facebook$/i, '')
            .trim();
          if (cleaned && !/^(log in|đăng nhập|watch|video|reels?)$/i.test(cleaned)) {
            if (!videoTitle) videoTitle = cleaned;
            if (!channelName) {
              // Facebook video og:title often looks like "Video Title | Page Name" or "Page Name - Video Title"
              const parts = cleaned.split(/\s*\|\s*/);
              if (parts.length >= 2) {
                channelName = parts[parts.length - 1].trim();
              } else {
                channelName = cleaned;
              }
            }
          }
        }

        if (!channelAvatar) {
          const isProfileOrPageUrl = channelHandle && !/\/(videos|reel|watch|posts|photo)/i.test(finalUrl);
          const ogImg = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
          if (ogImg && ogImg[1] && (isProfileOrPageUrl || ogImg[1].includes('scontent'))) {
            channelAvatar = decodeHtmlEntities(ogImg[1]);
          }
        }

        // Extract owner ID & followerCount if present
        if (!ownerId) {
          const idMatch = html.match(/"(?:pageID|entity_id|owner_id|actor_id|profile_id)":"?(\d{6,})"?/i);
          if (idMatch && idMatch[1]) ownerId = idMatch[1];
        }
        if (!fbFollowerCount) {
          const flMatch =
            html.match(/"followers_count":(\d+)/i) ||
            html.match(/"follower_count":(\d+)/i) ||
            html.match(/"subscribers_count":(\d+)/i);
          if (flMatch && flMatch[1]) {
            fbFollowerCount = parseInt(flMatch[1], 10) || 0;
          }
        }
      }
    } catch {
      // Try next UA
    }
  }

  // Fallback avatar using Facebook Graph picture or unavatar/facebook (NEVER tiktok!)
  if (!channelAvatar) {
    if (ownerId) {
      channelAvatar = `https://graph.facebook.com/${ownerId}/picture?type=large`;
    } else if (channelHandle) {
      const slug = channelHandle.replace(/^@+/, '');
      channelAvatar = `https://unavatar.io/facebook/${encodeURIComponent(slug)}`;
    }
  }

  const finalChannelName = channelName || (channelHandle ? channelHandle.replace(/^@+/, '') : 'Fanpage Facebook');
  const finalHandle = channelHandle || (channelName ? `@${channelName.trim()}` : '@Facebook');

  return {
    success: true,
    platform: 'facebook',
    channelName: finalChannelName,
    channelHandle: finalHandle,
    channelUrl: channelUrl || (ownerId ? `https://www.facebook.com/${ownerId}` : finalUrl),
    channelAvatar: channelAvatar || null,
    followerCount: fbFollowerCount || 0,
    videoTitle: videoTitle || null,
    resolvedUrl: finalUrl
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawUrl = typeof req.query?.url === 'string' ? req.query.url.trim() : '';
  if (!rawUrl) {
    return res.status(400).json({ success: false, error: 'Missing url parameter' });
  }

  const lower = rawUrl.toLowerCase();

  try {
    if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('m.youtube.com')) {
      const data = await resolveYouTube(rawUrl);
      return res.status(200).json(data);
    }

    if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com') || lower.includes('fb.gg') || lower.includes('m.facebook.com')) {
      const data = await resolveFacebook(rawUrl);
      return res.status(200).json(data);
    }

    if (lower.includes('tiktok.com') || lower.includes('vt.tiktok.com') || lower.includes('vm.tiktok.com') || lower.includes('m.tiktok.com')) {
      const data = await resolveTikTok(rawUrl);
      return res.status(200).json(data);
    }

    return res.status(200).json({
      success: false,
      platform: 'direct',
      channelName: null,
      channelHandle: null,
      channelUrl: rawUrl,
      channelAvatar: null,
      videoTitle: null,
      resolvedUrl: rawUrl
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err?.message || 'Failed to resolve media metadata',
      resolvedUrl: rawUrl
    });
  }
}
