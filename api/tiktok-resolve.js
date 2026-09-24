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

  try {
    // 1. Dùng Mobile UA để resolve vt.tiktok.com (tránh bị redirect về trang chủ)
    const mobileResponse = await fetch(url, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });

    let finalUrl = url;
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

    const isLiveUrl = finalUrl.includes('/live') || url.includes('/live');
    const liveTargetUrl = isLiveUrl ? finalUrl : null; // Nếu không có /live, ta có thể không cần fetch lại

    if (liveTargetUrl) {
      const desktopRes = await fetch(liveTargetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const text = await desktopRes.text();

       // Parse SIGI_STATE for Live Room info
       const sigiMatch = text.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
       if (sigiMatch) {
         try {
           const state = JSON.parse(sigiMatch[1]);
           const liveRoom = state.LiveRoom?.liveRoomUserInfo?.liveRoom;
           if (liveRoom) {
             isLive = true;
             liveViewers = liveRoom.liveRoomStats?.userCount || 0;
             liveData = liveRoom;
             
             // Extract HLS URL if available
             try {
               const streamStr = liveRoom.streamData?.pull_data?.stream_data;
               if (streamStr) {
                 const streamData = JSON.parse(streamStr);
                 // Prioritize standard hd/sd over others, or just take the first hls
                 hlsUrl = streamData?.data?.hd?.main?.hls || streamData?.data?.sd?.main?.hls || streamData?.data?.ld?.main?.hls || streamData?.data?.origin?.main?.hls || null;
               }
             } catch (e) {}
           }
         } catch(e) {}
       }
    }

    return res.status(200).json({ 
      original: url, 
      resolved: finalUrl,
      isLive,
      liveViewers,
      hlsUrl,
      liveData
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
