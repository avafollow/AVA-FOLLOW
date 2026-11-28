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

  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || '';

  // 1. Official YouTube Data API v3 (100% accurate channel title & channel logo)
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
        channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
      } else if (channelHandle) {
        const cleanForHandle = channelHandle.replace(/^@+/, '');
        channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${encodeURIComponent(cleanForHandle)}&key=${encodeURIComponent(apiKey)}`;
      }

      if (channelApiUrl) {
        const chRes = await fetchWithTimeout(channelApiUrl);
        if (chRes.ok) {
          const chJson = await chRes.json();
          const chItem = chJson?.items?.[0];
          const chSnippet = chItem?.snippet;
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

        // Extract channel canonical handle if missing
        if (!channelHandle) {
          const handleInHtml = html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/i);
          if (handleInHtml && handleInHtml[1]) {
            channelHandle = safeDecodeURIComponent(decodeHtmlEntities(handleInHtml[1]));
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
    channelName: finalChannelName,
    channelHandle: finalHandle,
    channelUrl: finalChannelUrl,
    channelAvatar: channelAvatar || null,
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

  // 1. Follow redirects for mobile shortlinks (vt.tiktok.com, vm.tiktok.com, tiktok.com/t/)
  if (/vt\.tiktok\.com|vm\.tiktok\.com|tiktok\.com\/t\//i.test(targetUrl)) {
    try {
      const mobileRes = await fetchWithTimeout(targetUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        }
      });
      if (mobileRes.status >= 300 && mobileRes.status < 400) {
        const loc = mobileRes.headers.get('location');
        if (loc) finalUrl = loc;
      } else if (mobileRes.url && mobileRes.url !== targetUrl) {
        finalUrl = mobileRes.url;
      }
    } catch {
      // Keep original URL
    }
  }

  const handleMatch = finalUrl.match(/tiktok\.com\/@([a-zA-Z0-9._-]+)/i);
  if (handleMatch && handleMatch[1]) {
    channelHandle = `@${handleMatch[1]}`;
    channelUrl = `https://www.tiktok.com/@${handleMatch[1]}`;
  }

  // 2. TikTok official oEmbed API (returns exact author_name & author_unique_id)
  try {
    const oembedRes = await fetchWithTimeout(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      }
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
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
    // Continue to HTML extraction
  }

  // 3. Fetch TikTok profile / video page HTML to extract REAL channel avatar (avatarLarger / avatarMedium)
  const profileToFetch = channelUrl || finalUrl;
  try {
    const pageRes = await fetchWithTimeout(profileToFetch, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
      }
    });
    if (pageRes.ok) {
      const html = await pageRes.text();

      // Try __UNIVERSAL_DATA_FOR_REHYDRATION__ JSON first for exact user avatar & nickname
      const uniMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
      if (uniMatch && uniMatch[1]) {
        try {
          const json = JSON.parse(uniMatch[1]);
          const scope = json['__DEFAULT_SCOPE__'] || json;
          const userInfo =
            scope?.['webapp.user-detail']?.userInfo?.user ||
            scope?.['webapp.video-detail']?.itemInfo?.itemStruct?.author ||
            scope?.['webapp.live-detail']?.liveRoomInfo?.owner;
          if (userInfo) {
            channelAvatar = userInfo.avatarLarger || userInfo.avatarMedium || userInfo.avatarThumb || channelAvatar;
            channelName = userInfo.nickname || channelName;
            if (userInfo.uniqueId) {
              channelHandle = `@${userInfo.uniqueId}`;
              channelUrl = `https://www.tiktok.com/@${userInfo.uniqueId}`;
            }
          }
        } catch {
          // Fallback to regex
        }
      }

      if (!channelAvatar) {
        const avatarMatch =
          html.match(/"avatarLarger":"(https:[^"]+)"/i) ||
          html.match(/"avatarMedium":"(https:[^"]+)"/i) ||
          html.match(/"avatarThumb":"(https:[^"]+)"/i);
        if (avatarMatch && avatarMatch[1]) {
          channelAvatar = decodeHtmlEntities(avatarMatch[1]);
        }
      }

      if (!channelName) {
        const nickMatch = html.match(/"nickname":"([^"]+)"/i);
        if (nickMatch && nickMatch[1]) {
          channelName = decodeHtmlEntities(nickMatch[1]);
        }
      }
    }
  } catch {
    // Ignore HTML error
  }

  const cleanHandle = (channelHandle || '').replace(/^@+/, '');
  const finalChannelName = channelName || (cleanHandle ? `@${cleanHandle}` : 'Kênh TikTok');
  const finalHandle = channelHandle || '@tiktok_creator';

  return {
    success: true,
    platform: 'tiktok',
    channelName: finalChannelName,
    channelHandle: finalHandle,
    channelUrl: channelUrl || finalUrl,
    channelAvatar: channelAvatar || (cleanHandle ? `https://unavatar.io/tiktok/${encodeURIComponent(cleanHandle)}` : null),
    videoTitle: videoTitle || null,
    resolvedUrl: finalUrl
  };
}

async function resolveFacebook(targetUrl) {
  let finalUrl = targetUrl;
  let channelName = null;
  let channelHandle = null;
  let channelUrl = null;
  let channelAvatar = null;
  let videoTitle = null;
  let ownerId = null;

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
        finalUrl = res.url;
        const resolvedSlug = finalUrl.match(/facebook\.com\/([^\/\?\#]+)/i);
        if (resolvedSlug && resolvedSlug[1] && !reservedPaths.includes(resolvedSlug[1].toLowerCase()) && !channelHandle) {
          const slug = safeDecodeURIComponent(resolvedSlug[1]);
          channelHandle = `@${slug}`;
          channelUrl = `https://www.facebook.com/${slug}`;
        }
      }

      if (res.ok) {
        const html = await res.text();

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

        // Extract owner ID if still missing
        if (!ownerId) {
          const idMatch = html.match(/"(?:pageID|entity_id|owner_id|actor_id|profile_id)":"?(\d{6,})"?/i);
          if (idMatch && idMatch[1]) ownerId = idMatch[1];
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
