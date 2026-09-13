import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bsmslbccqkvgiikrghpg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbXNsYmNjcWt2Z2lpa3JnaHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxODgyNCwiZXhwIjoyMTA0Nzk0ODI0fQ.aDqrt6nyeC8REYJS_AWe2xv6yOr3LEotxcNBKh5yQ2s';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const orderCode = (req.query.orderCode || req.body?.orderCode || '').toString().toUpperCase().trim();
  const amount = Number(req.query.amount || req.body?.amount || 0);

  if (!orderCode) {
    return res.status(400).json({ success: false, error: 'Thiếu mã đơn orderCode' });
  }

  try {
    // Kiểm tra trong cơ sở dữ liệu Supabase xem webhook SePay đã ghi có chưa
    const { data, error } = await supabaseAdmin
      .from('token_ledger')
      .select('*')
      .ilike('note', `%${orderCode}%`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      return res.status(200).json({
        success: true,
        verified: true,
        status: 'PAID',
        orderCode,
        amount: data[0].vnd_equivalent || amount,
        coinsEarned: data[0].coins_amount || amount,
        transaction: data[0],
        message: 'Đã nhận tiền thành công từ SePay VietQR (Techcombank)'
      });
    }

    return res.status(200).json({
      success: true,
      verified: false,
      status: 'PENDING',
      orderCode,
      message: 'Đang chờ biến động số dư từ ngân hàng Techcombank...'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
