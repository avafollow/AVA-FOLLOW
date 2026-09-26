export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    const cleanHandle = targetUrl.replace(/^@+/, '').trim();
    targetUrl = `https://www.tiktok.com/@${cleanHandle}/live`;
  }

  try {
    // 1. Dùng Mobile UA để resolve vt.tiktok.com (tránh bị redirect về trang chủ)
    const mobileResponse = await fetch(targetUrl, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });

    let finalUrl = targetUrl;
    if (mobileResponse.status >= 300 && mobileResponse.status < 400) {
      finalUrl = mobileResponse.headers.get('location') || url;
    } else {
      finalUrl = mobileResponse.url;
    }
    
    if (finalUrl === url && mobileResponse.status === 200) {
       const text = await mobileResponse.text();
       const canonMatch = text.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
       if (canonMatch && canonMatch[1]) {
           finalUrl = canonMatch[1];
       }
    }

    // 2. Nếu URL (sau khi resolve) là một link Live, ta gọi bằng Desktop UA để cào SIGI_STATE
    let liveData = null;
    let liveViewers = 0;
    let isLive = false;
    let hlsUrl = null;
    let flvUrl = null;
    let roomCover = null;
    let roomTitle = null;

    const isLiveUrl = finalUrl.includes('/live') || url.includes('/live');
    const liveTargetUrl = isLiveUrl ? finalUrl : null;

    if (liveTargetUrl) {
      const desktopRes = await fetch(liveTargetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      const text = await desktopRes.text();

      // 1. Parse SIGI_STATE
      const sigiMatch = text.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
      let liveRoom = null;
      if (sigiMatch) {
        try {
          const state = JSON.parse(sigiMatch[1]);
          liveRoom = state.LiveRoom?.liveRoomUserInfo?.liveRoom || state.CurrentRoom || null;
        } catch(e) {}
      }

      // 2. Parse __UNIVERSAL_DATA_FOR_REHYDRATION__ if SIGI_STATE failed
      if (!liveRoom) {
        const uniMatch = text.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/) ||
                         text.match(/window\.__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*([\s\S]*?);<\/script>/);
        if (uniMatch) {
          try {
            const uData = JSON.parse(uniMatch[1]);
            const defScope = uData['__DEFAULT_SCOPE__'] || uData;
            liveRoom = defScope['webapp.live-detail']?.liveRoomInfo || defScope['liveRoom'] || null;
          } catch(e) {}
        }
      }

      if (liveRoom) {
        isLive = true;
        liveViewers = liveRoom.liveRoomStats?.userCount || liveRoom.userCount || 0;
        roomTitle = liveRoom.title || null;
        roomCover = liveRoom.cover?.url_list?.[0] || liveRoom.cover || null;
        liveData = liveRoom;
        
        try {
          const streamStr = liveRoom.streamData?.pull_data?.stream_data;
          if (streamStr) {
            const streamData = JSON.parse(streamStr);
            hlsUrl = streamData?.data?.hd?.main?.hls || streamData?.data?.sd?.main?.hls || streamData?.data?.ld?.main?.hls || streamData?.data?.origin?.main?.hls || null;
            flvUrl = streamData?.data?.hd?.main?.flv || streamData?.data?.sd?.main?.flv || streamData?.data?.ld?.main?.flv || streamData?.data?.origin?.main?.flv || null;
          }
        } catch (e) {}
      }

      // 3. Fallback regex tìm m3u8 hoặc flv trực tiếp trong HTML
      if (!hlsUrl && !flvUrl) {
        const m3u8Regex = /(https?:\\?\/\\?\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i;
        const m3u8Match = text.match(m3u8Regex);
        if (m3u8Match && m3u8Match[1]) {
          hlsUrl = m3u8Match[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
          isLive = true;
        }

        const flvRegex = /(https?:\\?\/\\?\/[^\s"'<>]+\.flv[^\s"'<>]*)/i;
        const flvMatch = text.match(flvRegex);
        if (flvMatch && flvMatch[1]) {
          flvUrl = flvMatch[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
          isLive = true;
        }
      }
    }

    return res.status(200).json({ 
      original: url, 
      resolved: finalUrl,
      isLive,
      liveViewers,
      hlsUrl: hlsUrl || null,
      flvUrl: flvUrl || null,
      roomCover,
      roomTitle,
      liveData
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
