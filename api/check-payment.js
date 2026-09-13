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
    // 1. Kiểm tra trực tiếp trong Supabase Storage xem webhook SePay đã gửi file xác nhận chưa
    const download = await supabaseAdmin.storage
      .from('ava_data_sync')
      .download(`sepay/orders/${orderCode}.json`);

    if (download.data) {
      const text = await download.data.text();
      const verifiedRecord = JSON.parse(text);

      return res.status(200).json({
        success: true,
        verified: true,
        status: 'PAID',
        orderCode,
        amount: verifiedRecord.transferAmount || amount,
        transaction: verifiedRecord,
        message: 'SePay đã xác nhận nhận tiền thành công từ ngân hàng Techcombank!'
      });
    }

    // 2. Nếu chưa tìm thấy file chính xác, tìm trong danh sách các giao dịch SePay gần nhất
    const { data: fileList } = await supabaseAdmin.storage
      .from('ava_data_sync')
      .list('sepay/orders', { limit: 50 });

    if (fileList && fileList.length > 0) {
      for (const file of fileList) {
        if (file.name.toUpperCase().includes(orderCode) || orderCode.includes(file.name.replace('.json', '').toUpperCase())) {
          const matchedDownload = await supabaseAdmin.storage
            .from('ava_data_sync')
            .download(`sepay/orders/${file.name}`);
          
          if (matchedDownload.data) {
            const matchedText = await matchedDownload.data.text();
            const record = JSON.parse(matchedText);
            return res.status(200).json({
              success: true,
              verified: true,
              status: 'PAID',
              orderCode,
              amount: record.transferAmount || amount,
              transaction: record,
              message: 'SePay đã xác nhận nhận tiền thành công!'
            });
          }
        }
      }
    }

    // 3. Nếu tiền chưa về tài khoản Techcombank: Trả về trạng thái PENDING an toàn tuyệt đối
    return res.status(200).json({
      success: true,
      verified: false,
      status: 'PENDING',
      orderCode,
      message: 'Hệ thống chưa nhận được biến động số dư từ Techcombank (19035907828017). Vui lòng hoàn tất chuyển khoản đúng nội dung.'
    });
  } catch (err) {
    console.error('Lỗi check-payment:', err);
    return res.status(200).json({
      success: true,
      verified: false,
      status: 'PENDING',
      orderCode,
      message: 'Đang kiểm tra biến động số dư từ SePay...'
    });
  }
}
