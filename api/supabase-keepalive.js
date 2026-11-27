import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vjsymzbaiyzuryvdniwd.supabase.co';
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_tcxsNyytQ_quQ6ODuWtF8w_j96MyTYq';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * API Keep-Alive tự động chống tạm dừng dịch vụ Supabase (Anti-Pause Heartbeat)
 * Được gọi định kỳ bởi Vercel Cron & GitHub Actions để đảm bảo database luôn có tương tác thực.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const source = (req.query?.source || 'vercel_cron').toString();
    const { data: current } = await supabase
      .from('system_keepalive')
      .select('ping_count')
      .eq('id', 1)
      .maybeSingle();

    const nextCount = Number(current?.ping_count || 0) + 1;
    const nowIso = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('system_keepalive')
      .upsert(
        {
          id: 1,
          service_name: 'AVA_FOLLOW_SUPABASE',
          status: 'ACTIVE',
          ping_count: nextCount,
          last_ping_source: source,
          last_ping_at: nowIso
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: nowIso
      });
    }

    return res.status(200).json({
      success: true,
      status: 'ACTIVE_HEALTHY',
      projectRef: 'vjsymzbaiyzuryvdniwd',
      keepalive: updated,
      timestamp: nowIso
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Keepalive failed',
      timestamp: new Date().toISOString()
    });
  }
}
