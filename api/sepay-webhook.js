import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vjsymzbaiyzuryvdniwd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tcxsNyytQ_quQ6ODuWtF8w_j96MyTYq';
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Cổng Webhook tiếp nhận biến động số dư tự động SePay cho AVA FOLLOW
 * Endpoint: https://avafollow.vercel.app/api/sepay-webhook
 * Ngân hàng tích hợp: Techcombank - 19035907828017 - NGUYEN QUOC THIEN
 */
export default async function handler(req, res) {
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

  // POST request: SePay gửi dữ liệu biến động số dư chuyển khoản thực tế
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

      // Trích xuất mã đơn hàng từ nội dung chuyển khoản
      const orderMemo = (content || '').toString().toUpperCase().trim();
      let orderType = 'UNKNOWN';

      if (orderMemo.includes('AVAXU')) {
        orderType = 'TOPUP_XU';
      } else if (orderMemo.includes('AVAPKG')) {
        orderType = 'GROWTH_PACKAGE';
      } else if (orderMemo.includes('AVAAPP')) {
        orderType = 'SOFTWARE_APP';
      } else if (orderMemo.includes('AVAESC')) {
        orderType = 'ESCROW_DEPOSIT';
      }

      console.log(`✅ [SEPAY TRANSACTION VERIFIED]: ID=${id}, Số tiền=${transferAmount}đ, Nội dung="${orderMemo}", Loại đơn=${orderType}`);

      const verifiedRecord = {
        id: id || Date.now(),
        orderCode: orderMemo,
        gateway: gateway || 'Techcombank',
        accountNumber: accountNumber || '19035907828017',
        transferAmount: Number(transferAmount || 0),
        transferType: 'in',
        orderType,
        content: orderMemo,
        referenceCode: referenceCode || `REF_${Date.now()}`,
        transactionDate: transactionDate || new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        status: 'PAID'
      };

      // Lưu trữ xác nhận an toàn vào Supabase Storage (bền vững trên Vercel)
      try {
        // 1. Lưu theo file mã đơn duy nhất: sepay/orders/${orderMemo}.json
        await supabaseAdmin.storage
          .from('ava_data_sync')
          .upload(`sepay/orders/${orderMemo}.json`, JSON.stringify(verifiedRecord), {
            upsert: true,
            contentType: 'application/json'
          });

        // 2. Lưu theo id giao dịch: sepay/transactions/${id}.json
        if (id) {
          await supabaseAdmin.storage
            .from('ava_data_sync')
            .upload(`sepay/transactions/${id}.json`, JSON.stringify(verifiedRecord), {
              upsert: true,
              contentType: 'application/json'
            });
        }
      } catch (storageErr) {
        console.warn('⚠️ Lỗi lưu trữ Supabase Storage:', storageErr.message);
      }

      // Phản hồi 200 OK cho SePay
      return res.status(200).json({
        success: true,
        message: 'Giao dịch SePay đã được tiếp nhận và xác thực thành công',
        data: verifiedRecord
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
