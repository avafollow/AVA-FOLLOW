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
    const response = await fetch(url, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });

    let finalUrl = url;
    if (response.status >= 300 && response.status < 400) {
      finalUrl = response.headers.get('location') || url;
    } else {
      finalUrl = response.url;
    }
    
    // Đôi khi link là mobile html page, chứa link canon
    if (finalUrl === url && response.status === 200) {
       const text = await response.text();
       const canonMatch = text.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
       if (canonMatch && canonMatch[1]) {
           finalUrl = canonMatch[1];
       }
    }

    return res.status(200).json({ original: url, resolved: finalUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
