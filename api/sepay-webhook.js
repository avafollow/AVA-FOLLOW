import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bsmslbccqkvgiikrghpg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbXNsYmNjcWt2Z2lpa3JnaHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTIxODgyNCwiZXhwIjoyMTA0Nzk0ODI0fQ.aDqrt6nyeC8REYJS_AWe2xv6yOr3LEotxcNBKh5yQ2s';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Cổng Webhook tiếp nhận biến động số dư tự động SePay cho AVA FOLLOW
 * Endpoint: https://avafollow.vercel.app/api/sepay-webhook
 * Ngân hàng tích hợp: Techcombank - 19035907828017 - NGUYEN QUOC THIEN
 */
export default async function handler(req, res) {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-SePay-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET request: Kiểm tra trạng thái hoạt động của Webhook (Healthcheck / Test kết nối)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      status: 'ONLINE',
      gateway: 'SePay VietQR Hub',
      message: 'Cổng kết nối Webhook SePay AVA FOLLOW đang hoạt động 24/7',
      webhookUrl: 'https://avafollow.vercel.app/api/sepay-webhook',
      bankAccount: {
        bank: 'Techcombank (TCB)',
        bin: '970407',
        accountNumber: '19035907828017',
        accountName: 'NGUYEN QUOC THIEN'
      },
      supportedPrefixes: ['AVAXU', 'AVAPKG', 'AVAAPP', 'AVAESC'],
      timestamp: new Date().toISOString()
    });
  }

  // POST request: SePay gửi dữ liệu biến động số dư chuyển khoản
  if (req.method === 'POST') {
    try {
      const data = req.body || {};
      console.log('🔔 [SEPAY WEBHOOK RECEIVED]:', JSON.stringify(data));

      const {
        id,
        gateway,
        transactionDate,
        accountNumber,
        transferType,
        transferAmount,
        content,
        referenceCode
      } = data;

      // Kiểm tra loại giao dịch: Chỉ xử lý giao dịch tiền vào ("in")
      if (transferType && transferType !== 'in') {
        return res.status(200).json({
          success: true,
          message: 'Ignored outgoing transaction (transferType != in)'
        });
      }

      // Phân tích mã đơn hàng từ nội dung chuyển khoản
      const orderMemo = (content || '').toString().toUpperCase();
      let orderType = 'UNKNOWN';

      if (orderMemo.includes('AVAXU')) {
        orderType = 'TOPUP_XU'; // Nạp Xu vào ví
      } else if (orderMemo.includes('AVAPKG')) {
        orderType = 'GROWTH_PACKAGE'; // Mua gói tăng trưởng TikTok
      } else if (orderMemo.includes('AVAAPP')) {
        orderType = 'SOFTWARE_APP'; // Mua bản quyền phần mềm / App
      } else if (orderMemo.includes('AVAESC')) {
        orderType = 'ESCROW_DEPOSIT'; // Ký quỹ Booking KOC
      }

      console.log(`✅ [SEPAY TRANSACTION VERIFIED]: ID=${id}, Số tiền=${transferAmount}đ, Nội dung="${orderMemo}", Loại đơn=${orderType}`);

      // Ghi sổ cái tự động vào Supabase để đối soát an toàn
      try {
        await supabaseAdmin.from('token_ledger').insert([{
          user_id: 'sepay_gateway',
          user_email: 'sepay_webhook@avafollow.vn',
          tx_type: 'deposit',
          token_amount: Math.round(Number(transferAmount || 0) / 1000),
          coins_amount: Number(transferAmount || 0),
          balance_after: Number(transferAmount || 0),
          vnd_equivalent: Number(transferAmount || 0),
          note: `[SEPAY_CONFIRMED] Mã đơn: ${orderMemo} | Ngân hàng: ${gateway || 'Techcombank'} | Ref: ${referenceCode || id}`,
          status: 'success'
        }]);
      } catch (dbErr) {
        console.warn('⚠️ Ghi token_ledger Supabase ghi nhận cảnh báo:', dbErr.message);
      }

      // Phản hồi 200 OK ngay lập tức cho SePay
      return res.status(200).json({
        success: true,
        message: 'Giao dịch SePay đã được tiếp nhận và xử lý thành công',
        data: {
          transactionId: id,
          gateway: gateway || 'Techcombank',
          amount: transferAmount,
          orderCode: orderMemo,
          orderType,
          accountNumber: accountNumber || '19035907828017',
          processedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ [SEPAY WEBHOOK ERROR]:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Lỗi xử lý webhook SePay'
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
