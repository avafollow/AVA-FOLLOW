/**
 * API HLS & MP4 STREAM PROXY CHO TIKTOK, FACEBOOK, YOUTUBE ĐA THIẾT BỊ
 * Xử lý CORS, HTTP Range (206 Partial Content cho iOS Safari / iPadOS) & định tuyến playlist .m3u8/.ts/.m4s
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Range'
  );
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let targetUrl = req.query?.url;
  if (!targetUrl && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      targetUrl = parsedUrl.searchParams.get('url');
    } catch {}
  }

  if (!targetUrl) {
    return res.status(400).json({ error: 'Thiếu tham số url stream' });
  }

  try {
    const lowerTarget = targetUrl.toLowerCase();
    const isM3U8 = lowerTarget.includes('.m3u8') || lowerTarget.includes('m3u8');

    const fetchHeaders = {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://www.tiktok.com/'
    };

    if (req.headers?.range && !isM3U8) {
      fetchHeaders['Range'] = req.headers.range;
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      redirect: 'follow',
      headers: fetchHeaders
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return res.status(upstreamRes.status).json({
        error: `Lỗi kết nối máy chủ CDN: ${upstreamRes.status}`
      });
    }

    const effectiveUrl = upstreamRes.url || targetUrl;

    if (isM3U8) {
      const m3u8Content = await upstreamRes.text();
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      const lines = m3u8Content.split('\n');
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (_match, uri) => {
              try {
                const absUri = new URL(uri, effectiveUrl).href;
                return `URI="/api/stream-proxy?url=${encodeURIComponent(absUri)}"`;
              } catch {
                return `URI="${uri}"`;
              }
            });
          }
          return line;
        }

        try {
          const targetObj = new URL(effectiveUrl);
          const segObj = new URL(trimmed, effectiveUrl);
          if (!segObj.search && targetObj.search) {
            segObj.search = targetObj.search;
          }
          return `/api/stream-proxy?url=${encodeURIComponent(segObj.href)}`;
        } catch {
          return line;
        }
      });

      return res.status(200).send(rewrittenLines.join('\n'));
    }

    // Binary video/audio/TS/M4S/MP4 with full iOS Safari Range (206) support
    const contentType = upstreamRes.headers.get('content-type') || (lowerTarget.includes('.mp4') ? 'video/mp4' : 'video/mp2t');
    const contentRange = upstreamRes.headers.get('content-range');
    const acceptRanges = upstreamRes.headers.get('accept-ranges') || 'bytes';
    const upstreamLen = upstreamRes.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', acceptRanges);
    if (contentRange) res.setHeader('Content-Range', contentRange);
    res.setHeader('Cache-Control', 'public, max-age=120');

    if (req.method === 'HEAD') {
      if (upstreamLen) res.setHeader('Content-Length', upstreamLen);
      return res.status(upstreamRes.status).end();
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Length', buffer.length.toString());
    return res.status(upstreamRes.status).end(buffer);
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Lỗi proxy luồng video/live' });
  }
}
