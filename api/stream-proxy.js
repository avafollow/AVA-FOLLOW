/**
 * API HLS STREAM PROXY CHO TIKTOK LIVE VÀ CÁC NỀN TẢNG
 * Xử lý CORS và định tuyến phân đoạn .ts trực tiếp cho mọi thiết bị (iOS Safari, Android, Web, PC)
 */

export default async function handler(req, res) {
  // Cấu hình CORS đầy đủ cho phép mọi client browser kết nối
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Range'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse query parameter
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
    const isM3U8 = targetUrl.includes('.m3u8') || targetUrl.toLowerCase().includes('m3u8');
    
    // Headers chuẩn mô phỏng trình duyệt để lấy luồng TikTok mượt mà
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Accept': '*/*',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://www.tiktok.com/'
    };

    if (req.headers?.range) {
      fetchHeaders['Range'] = req.headers.range;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers: fetchHeaders
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: `Lỗi kết nối máy chủ CDN TikTok: ${upstreamRes.status}`
      });
    }

    if (isM3U8) {
      // 1. Phân tích và viết lại Playlist M3U8 để tất cả chunk .ts đi qua proxy với CORS *
      const m3u8Content = await upstreamRes.text();
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      const lines = m3u8Content.split('\n');
      const rewrittenLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          // Xử lý URI trong tag #EXT-X-KEY hoặc #EXT-X-MAP nếu có
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
              const absUri = new URL(uri, targetUrl).href;
              return `URI="/api/stream-proxy?url=${encodeURIComponent(absUri)}"`;
            });
          }
          return line;
        }

        // Định tuyến segment URL tuyệt đối qua Stream Proxy
        try {
          const absoluteSegmentUrl = new URL(trimmed, targetUrl).href;
          return `/api/stream-proxy?url=${encodeURIComponent(absoluteSegmentUrl)}`;
        } catch {
          return line;
        }
      });

      return res.status(200).send(rewrittenLines.join('\n'));
    } else {
      // 2. Phân đoạn Video TS (MPEG-2 Transport Stream) hoặc dữ liệu nhị phân
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'video/mp2t');
      res.setHeader('Cache-Control', 'public, max-age=60');

      const arrayBuffer = await upstreamRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader('Content-Length', buffer.length.toString());
      return res.status(upstreamRes.status).end(buffer);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Lỗi proxy luồng trực tiếp' });
  }
}
