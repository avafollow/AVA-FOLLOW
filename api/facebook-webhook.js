/**
 * Cổng tiếp nhận Webhook Meta Facebook cho AVA FOLLOW
 * Endpoint: https://<domain-vercel>/api/facebook-webhook
 * Hỗ trợ các đối tượng: Page (feed, comments, mentions, live_videos), User, Permissions
 */

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'THIENVUAAPP';
const ACCEPTED_VERIFY_TOKENS = new Set([
  FB_VERIFY_TOKEN,
  'THIENVUAAPP',
  'ava_facebook_webhook_2026_secure',
  'avafollow'
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Hub-Signature, X-Hub-Signature-256');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET Request: Meta Webhook Handshake / Xác minh mã
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = (req.query['hub.verify_token'] || '').toString().trim();
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && ACCEPTED_VERIFY_TOKENS.has(token)) {
      console.log('✅ [FACEBOOK WEBHOOK VERIFIED SUCCESSFULLY]', { token });
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(String(challenge || ''));
    } else {
      console.warn('❌ [FACEBOOK WEBHOOK VERIFY FAILED]: Invalid verify token', { token, expected: FB_VERIFY_TOKEN });
      return res.status(403).json({ error: 'Verification failed: invalid token' });
    }
  }

  // 2. POST Request: Meta gửi sự kiện thay đổi tương tác (Like, Comment, Share, Page, Feed)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      console.log('🔔 [FACEBOOK WEBHOOK EVENT RECEIVED]:', JSON.stringify(body));

      if (body.object === 'page' || body.object === 'user' || body.object === 'permissions') {
        if (Array.isArray(body.entry)) {
          for (const entry of body.entry) {
            const changes = entry.changes || [];
            for (const change of changes) {
              const field = change.field;
              const value = change.value;
              console.log(`📌 [FB Change Event] Field: ${field}`, value);
            }
          }
        }
        return res.status(200).send('EVENT_RECEIVED');
      }

      return res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
      console.error('⚠️ [FACEBOOK WEBHOOK ERROR]:', err);
      return res.status(200).send('EVENT_RECEIVED');
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
