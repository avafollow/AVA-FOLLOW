export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    platform: 'AVA FOLLOW',
    domain: 'https://avafollow.vercel.app',
    paymentUrl: 'https://avafollow.vercel.app',
    webhookUrl: 'https://avafollow.vercel.app/api/sepay-webhook',
    returnUrl: 'https://avafollow.vercel.app/?payment=success',
    cancelUrl: 'https://avafollow.vercel.app/?payment=cancel',
    bank: {
      bankName: 'Techcombank',
      bankCode: 'TCB',
      bin: '970407',
      accountNumber: '19035907828017',
      accountName: 'NGUYEN QUOC THIEN'
    },
    message: 'Cổng thanh toán SePay VietQR cho AVA FOLLOW sẵn sàng hoạt động.'
  });
}
