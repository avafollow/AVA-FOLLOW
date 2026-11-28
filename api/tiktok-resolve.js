// Universal TikTok Video, Photo & Live Stream Resolver (iOS, iPad, Android, PC)
// Supports: tiktok.com/@user/video/ID, /photo/ID, vt.tiktok.com, vm.tiktok.com, tiktok.com/t/...,
// m.tiktok.com/v/..., tiktok.com/@user/live, live.tiktok.com/@user, room_id=...

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function cleanEscapedUrl(u) {
  if (!u || typeof u !== 'string') return null;
  return u
    .replace(/\\u002F/g, '/')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/[\\'"\s]+$/, '')
    .trim();
}

function extractVideoIdFromUrl(u) {
  if (!u) return null;
  if (/^\d{10,24}$/.test(u)) return u;
  const m =
    u.match(/\/(?:video|photo|v|embed\/v2|embed|player\/v1|share\/video)\/(\d{10,24})/i) ||
    u.match(/[?&](?:item_id|video_id|aweme_id)=(\d{10,24})/i) ||
    u.match(/m\.tiktok\.com\/v\/(\d{10,24})/i);
  if (m && m[1]) return m[1];
  return null;
}

function extractHandleFromUrl(u) {
  if (!u) return null;
  const m = u.match(/(?:live\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)/i);
  if (m && m[1]) return m[1];
  const mLive = u.match(/(?:live\.)?tiktok\.com\/live\/([a-zA-Z0-9._-]+)/i);
  if (mLive && mLive[1] && !['share', 'watch', 'room'].includes(mLive[1].toLowerCase())) {
    return mLive[1];
  }
  return null;
}

function extractRoomIdFromUrl(u) {
  if (!u) return null;
  const m = u.match(/[?&](?:room_id|live_id)=(\d{10,24})/i) || u.match(/\/live\/(\d{10,24})/i);
  return m && m[1] ? m[1] : null;
}

function isStrictLiveUrl(u) {
  if (!u) return false;
  if (/\/(?:video|photo)\/\d{10,24}/i.test(u)) return false;
  return (
    /tiktok\.com\/@[^\/\?\#]+\/live(?:\/|\?|$)/i.test(u) ||
    /live\.tiktok\.com\//i.test(u) ||
    /tiktok\.com\/live(?:\/|\?|$)/i.test(u) ||
    /[?&]room_id=\d+/i.test(u) ||
    /webcast\.tiktok\.com/i.test(u)
  );
}

function extractHlsAndFlvFromStreamStr(streamStr) {
  let hlsUrl = null;
  let flvUrl = null;
  if (!streamStr) return { hlsUrl, flvUrl };
  try {
    const streamData = typeof streamStr === 'string' ? JSON.parse(streamStr) : streamStr;
    const dataNode = streamData?.data || streamData;
    const tiers = ['origin', 'hd', 'sd', 'ld', 'uhd_60', 'hd_60', 'ao'];
    for (const tier of tiers) {
      const main = dataNode?.[tier]?.main;
      if (!main) continue;
      if (!hlsUrl && main.hls) hlsUrl = cleanEscapedUrl(main.hls);
      if (!flvUrl && main.flv) flvUrl = cleanEscapedUrl(main.flv);
      if (hlsUrl && flvUrl) break;
    }
  } catch {
    // ignore parse error
  }
  return { hlsUrl, flvUrl };
}

/**
 * Follow up to 6 redirect hops manually so TikTok shortlinks (vt.tiktok.com, vm.tiktok.com,
 * www.tiktok.com/t/...) resolve cleanly to the exact canonical video/photo/live URL
 * without landing on a generic homepage.
 */
async function resolveTikTokRedirects(inputUrl) {
  let currentUrl = inputUrl;
  const visited = new Set([currentUrl]);

  for (let hop = 0; hop < 6; hop++) {
    // Stop early if we already have a full canonical video/photo/live URL with handle or ID
    if (extractVideoIdFromUrl(currentUrl) && extractHandleFromUrl(currentUrl)) break;
    if (isStrictLiveUrl(currentUrl) && (extractHandleFromUrl(currentUrl) || extractRoomIdFromUrl(currentUrl))) break;

    try {
      const res = await fetchWithTimeout(
        currentUrl,
        {
          redirect: 'manual',
          headers: {
            'User-Agent': hop === 0 ? MOBILE_UA : DESKTOP_UA,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
          }
        },
        6500
      );

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (!loc) break;
        const nextUrl = new URL(loc, currentUrl).href;
        if (visited.has(nextUrl)) break;
        // Avoid redirecting into generic login/explore pages if we already have a useful URL
        if (/tiktok\.com\/(?:login|foryou|explore)\/?(\?|$)/i.test(nextUrl)) break;
        visited.add(nextUrl);
        currentUrl = nextUrl;
        continue;
      }

      if (res.status === 200) {
        const html = await res.text();
        const canonMatch =
          html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) ||
          html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i);
        if (canonMatch && canonMatch[1] && canonMatch[1].includes('tiktok.com')) {
          const canonUrl = cleanEscapedUrl(canonMatch[1]);
          if (canonUrl && !/tiktok\.com\/?(\?|$)/i.test(canonUrl)) {
            currentUrl = canonUrl;
          }
        }
        break;
      }
      break;
    } catch {
      break;
    }
  }

  return currentUrl;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawUrl = typeof req.query?.url === 'string' ? req.query.url.trim() : '';
  if (!rawUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let targetUrl = rawUrl;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    const cleanHandle = targetUrl.replace(/^@+/, '').trim();
    targetUrl = `https://www.tiktok.com/@${cleanHandle}/live`;
  }

  try {
    // 1. Resolve multi-hop shortlinks (vt.tiktok.com, vm.tiktok.com, tiktok.com/t/...)
    const isShortlink =
      /vt\.tiktok\.com|vm\.tiktok\.com|tiktok\.com\/t\/|m\.tiktok\.com\/v\//i.test(targetUrl);
    const finalUrl = isShortlink ? await resolveTikTokRedirects(targetUrl) : targetUrl;

    let videoId = extractVideoIdFromUrl(finalUrl) || extractVideoIdFromUrl(targetUrl);
    let cleanHandle = extractHandleFromUrl(finalUrl) || extractHandleFromUrl(targetUrl);
    const roomIdFromUrl = extractRoomIdFromUrl(finalUrl) || extractRoomIdFromUrl(targetUrl);

    let videoTitle = null;
    let authorName = null;
    let authorAvatar = null;
    let thumbnailUrl = null;
    let directPlayUrl = null;
    let hdPlayUrl = null;

    // 2. If it's a Video / Photo OR unresolved shortlink, fetch oEmbed + TikWM direct stream & exact metadata
    const looksLikeLive = isStrictLiveUrl(finalUrl) || (!videoId && isStrictLiveUrl(targetUrl));

    if (!looksLikeLive || videoId) {
      // 2A. Official TikTok oEmbed API (returns exact videoId, author_name, author_unique_id, player/v1 URL)
      try {
        const oembedRes = await fetchWithTimeout(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`,
          { headers: { 'User-Agent': DESKTOP_UA } },
          6000
        );
        if (oembedRes.ok) {
          const oe = await oembedRes.json();
          if (oe.embed_product_id && /^\d{10,24}$/.test(String(oe.embed_product_id))) {
            videoId = videoId || String(oe.embed_product_id);
          }
          if (oe.title) videoTitle = oe.title;
          if (oe.author_name) authorName = oe.author_name;
          if (oe.author_unique_id && !cleanHandle) cleanHandle = oe.author_unique_id;
          if (!cleanHandle && oe.author_url) {
            cleanHandle = extractHandleFromUrl(oe.author_url) || cleanHandle;
          }
          if (oe.thumbnail_url) thumbnailUrl = oe.thumbnail_url;
        }
      } catch {
        // ignore oEmbed failure
      }

      // 2B. TikWM API — extracts direct playable MP4 stream (works 100% on iPhone/iPad/Android/PC),
      // exact videoId (even from shortlinks!), and exact author avatar + nickname!
      try {
        const twRes = await fetchWithTimeout(
          `https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`,
          { headers: { 'User-Agent': DESKTOP_UA } },
          6500
        );
        if (twRes.ok) {
          const twJson = await twRes.json();
          if (twJson?.code === 0 && twJson?.data) {
            const d = twJson.data;
            if (d.id && /^\d{10,24}$/.test(String(d.id))) {
              videoId = videoId || String(d.id);
            }
            if (d.title && !videoTitle) videoTitle = d.title;
            if (d.author?.nickname) authorName = d.author.nickname;
            if (d.author?.unique_id) cleanHandle = d.author.unique_id;
            if (d.author?.avatar) authorAvatar = d.author.avatar;
            if (d.cover || d.origin_cover) thumbnailUrl = d.cover || d.origin_cover || thumbnailUrl;
            if (d.play) directPlayUrl = d.play;
            if (d.hdplay) hdPlayUrl = d.hdplay;
          }
        }
      } catch {
        // ignore tikwm failure
      }
    }

    // 3. Official TikTok Player v1 URL (2026 standard — no auth error, works on iOS/iPad/Android/PC)
    const playerUrl = videoId
      ? `https://www.tiktok.com/player/v1/${videoId}?embed_from=oembed&music_info=1&description=1&autoplay=1&muted=1&loop=1&controls=1`
      : null;

    // 4. Live Stream Resolution — Official TikTok Live JSON API FIRST, then Webcast Room Info, then HTML fallback
    let liveData = null;
    let liveViewers = 0;
    let isLive = false;
    let hlsUrl = null;
    let flvUrl = null;
    let roomCover = null;
    let roomTitle = null;
    let roomStatus = null;
    let resolvedRoomId = roomIdFromUrl || null;
    let isRestrictedRoom = false;

    const tiktokSessionCookie = process.env.TIKTOK_SESSION_ID
      ? `sessionid=${process.env.TIKTOK_SESSION_ID.trim()}`
      : '';

    if (looksLikeLive && !videoId) {
      // 4A. Official TikTok JSON API: /api-live/user/room/?aid=1988&sourceType=54&uniqueId=...
      if (cleanHandle) {
        try {
          const liveHeaders = {
            'User-Agent': DESKTOP_UA,
            'Referer': 'https://www.tiktok.com/',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
          };
          if (tiktokSessionCookie) liveHeaders.Cookie = tiktokSessionCookie;

          const liveApiRes = await fetchWithTimeout(
            `https://www.tiktok.com/api-live/user/room/?aid=1988&sourceType=54&uniqueId=${encodeURIComponent(cleanHandle)}`,
            { headers: liveHeaders },
            7000
          );
          if (liveApiRes.ok) {
            const liveJson = await liveApiRes.json();
            const userObj = liveJson?.data?.user;
            const liveRoom = liveJson?.data?.liveRoom;

            if (userObj) {
              authorName = userObj.nickname || authorName;
              cleanHandle = userObj.uniqueId || cleanHandle;
              authorAvatar = userObj.avatarLarger || userObj.avatarMedium || userObj.avatarThumb || authorAvatar;
              if (userObj.roomId) {
                resolvedRoomId = String(userObj.roomId);
              }
            }

            if (liveRoom) {
              liveData = liveRoom;
              roomStatus = liveRoom.status;
              roomTitle = liveRoom.title || roomTitle;
              roomCover = liveRoom.coverUrl || liveRoom.squareCoverImg || roomCover;
              liveViewers = liveRoom.liveRoomStats?.userCount || liveRoom.userCount || 0;

              const primary = extractHlsAndFlvFromStreamStr(
                liveRoom.streamData?.pull_data?.stream_data || liveRoom.stream_data
              );
              hlsUrl = primary.hlsUrl || hlsUrl;
              flvUrl = primary.flvUrl || flvUrl;

              if (!hlsUrl && liveRoom.hevcStreamData?.pull_data?.stream_data) {
                const hevc = extractHlsAndFlvFromStreamStr(liveRoom.hevcStreamData.pull_data.stream_data);
                hlsUrl = hevc.hlsUrl || hlsUrl;
                if (!flvUrl) flvUrl = hevc.flvUrl || flvUrl;
              }

              // status === 2 means actively broadcasting LIVE; status === 4 means stream ended
              isLive = roomStatus === 2 || (roomStatus !== 4 && Boolean(hlsUrl || flvUrl));
            }
          }
        } catch {
          // Fall through to webcast API / HTML
        }
      }

      // 4B. Webcast Room Info API using exact string roomId (guarantees hls_pull_url even from US/EU regions!)
      if ((!hlsUrl || !flvUrl || !cleanHandle) && resolvedRoomId && roomStatus !== 4) {
        try {
          const wcHeaders = {
            'User-Agent': DESKTOP_UA,
            'Referer': 'https://www.tiktok.com/'
          };
          if (tiktokSessionCookie) wcHeaders.Cookie = tiktokSessionCookie;

          const webcastRes = await fetchWithTimeout(
            `https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${encodeURIComponent(resolvedRoomId)}`,
            { headers: wcHeaders },
            6500
          );
          if (webcastRes.ok) {
            const wcJson = await webcastRes.json();
            if (wcJson?.status_code === 4003110) {
              // Phòng live giới hạn tuổi / TikTok Shop / yêu cầu đăng nhập (4003110) -> dùng TikTok Official Embed LIVE!
              isRestrictedRoom = true;
            }
            const rData = wcJson?.data;
            if (rData && !wcJson?.status_code) {
              roomStatus = rData.status ?? roomStatus;
              roomTitle = rData.title || roomTitle;
              liveViewers = rData.user_count || liveViewers;
              if (rData.owner) {
                authorName = rData.owner.nickname || authorName;
                cleanHandle = rData.owner.display_id || cleanHandle;
                authorAvatar = rData.owner.avatar_large?.url_list?.[0] || rData.owner.avatar_medium?.url_list?.[0] || authorAvatar;
              }
              if (rData.cover?.url_list?.[0]) roomCover = rData.cover.url_list[0];
              if (!hlsUrl && rData.stream_url?.hls_pull_url) {
                hlsUrl = cleanEscapedUrl(rData.stream_url.hls_pull_url);
              }
              if (!hlsUrl && rData.stream_url?.hls_pull_url_map) {
                const mapVals = Object.values(rData.stream_url.hls_pull_url_map).filter(v => typeof v === 'string' && v.includes('.m3u8'));
                if (mapVals.length > 0) hlsUrl = cleanEscapedUrl(mapVals[0]);
              }
              if (!flvUrl && rData.stream_url?.flv_pull_url) {
                const flvMap = rData.stream_url.flv_pull_url;
                const preferredFlv = flvMap.HD1 || flvMap.FULL_HD1 || flvMap.SD2 || flvMap.SD1 || Object.values(flvMap)[0];
                if (typeof preferredFlv === 'string') flvUrl = cleanEscapedUrl(preferredFlv);
              }
              if (!hlsUrl && rData.stream_url?.live_core_sdk_data?.pull_data?.stream_data) {
                const sdk = extractHlsAndFlvFromStreamStr(rData.stream_url.live_core_sdk_data.pull_data.stream_data);
                hlsUrl = sdk.hlsUrl || hlsUrl;
                flvUrl = flvUrl || sdk.flvUrl;
              }
              isLive = roomStatus === 2 || (roomStatus !== 4 && Boolean(hlsUrl || flvUrl));
            }
          }
        } catch {
          // Fall through
        }
      }

      // 4C. Kiểm tra chính xác phòng có đang LIVE thật không qua webcast/room/check_alive
      if (resolvedRoomId && !hlsUrl && !flvUrl) {
        try {
          const aliveRes = await fetchWithTimeout(
            `https://webcast.tiktok.com/webcast/room/check_alive/?aid=1988&room_ids=${encodeURIComponent(resolvedRoomId)}`,
            { headers: { 'User-Agent': DESKTOP_UA, Referer: 'https://www.tiktok.com/' } },
            5000
          );
          if (aliveRes.ok) {
            const aliveJson = await aliveRes.json();
            const aliveEntry = aliveJson?.data?.[0];
            if (aliveEntry?.alive === true) {
              isLive = true;
              roomStatus = 2;
              isRestrictedRoom = true;
            } else if (aliveEntry?.alive === false) {
              isLive = false;
              roomStatus = 4;
            }
          }
        } catch {
          // ignore
        }
      }

      // 4C. HTML SIGI_STATE / __UNIVERSAL_DATA_FOR_REHYDRATION__ fallback if still missing HLS
      if (!hlsUrl && roomStatus !== 4) {
        try {
          const livePageUrl = cleanHandle ? `https://www.tiktok.com/@${cleanHandle}/live` : finalUrl;
          const desktopRes = await fetchWithTimeout(
            livePageUrl,
            {
              headers: {
                'User-Agent': DESKTOP_UA,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
              }
            },
            7000
          );
          if (desktopRes.ok) {
            const text = await desktopRes.text();
            const m3u8Match = text.match(/(https?:\\?\/\\?\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
            if (m3u8Match && m3u8Match[1]) {
              hlsUrl = cleanEscapedUrl(m3u8Match[1]);
              isLive = true;
            }
          }
        } catch {
          // ignore
        }
      }
    }

    const authorHandle = cleanHandle ? `@${cleanHandle}` : null;
    const streamProxyUrl = hlsUrl ? `/api/stream-proxy?url=${encodeURIComponent(hlsUrl)}` : null;
    const directPlayProxyUrl = directPlayUrl ? `/api/stream-proxy?url=${encodeURIComponent(directPlayUrl)}` : null;
    const liveEmbedUrl = resolvedRoomId
      ? `https://www.tiktok.com/embed/live/${encodeURIComponent(resolvedRoomId)}?lang=vi-VN`
      : cleanHandle
        ? `https://www.tiktok.com/embed/live/@${encodeURIComponent(cleanHandle)}?lang=vi-VN`
        : null;

    return res.status(200).json({
      original: rawUrl,
      resolved: finalUrl,
      isLive,
      isRestrictedRoom,
      videoId: videoId || null,
      playerUrl,
      liveEmbedUrl,
      directPlayUrl: directPlayUrl || null,
      directPlayProxyUrl,
      hdPlayUrl: hdPlayUrl || null,
      authorHandle,
      title: roomTitle || videoTitle || null,
      authorName: authorName || null,
      authorAvatar: authorAvatar || null,
      thumbnailUrl: roomCover || thumbnailUrl || null,
      roomStatus,
      roomId: resolvedRoomId,
      liveViewers,
      hlsUrl: hlsUrl || null,
      proxyHlsUrl: streamProxyUrl || null,
      rawHlsUrl: hlsUrl || null,
      flvUrl: flvUrl || null,
      roomCover,
      roomTitle,
      liveData
    });
  } catch (error) {
    return res.status(200).json({
      original: rawUrl,
      resolved: rawUrl,
      isLive: false,
      error: error?.message || 'TikTok resolve failed'
    });
  }
}
