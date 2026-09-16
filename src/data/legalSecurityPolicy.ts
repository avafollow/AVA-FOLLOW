// ===== CHÍNH SÁCH PHÁP LÝ, BẢO MẬT & CHỐNG LỪA ĐẢO / VI PHẠM PHÁP LUẬT =====
// Áp dụng cho toàn bộ người dùng, đối tác, creator và doanh nghiệp trên nền tảng AVA LIVE / AVA FOLLOW

export interface LegalArticle {
  id: string;
  articleNumber: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  clauses: {
    clauseNumber: string;
    title: string;
    content: string;
    isCritical?: boolean;
  }[];
}

export const LEGAL_COMPLIANCE_DATA = {
  lastUpdated: '16/09/2026',
  legalBasis: [
    'Luật An ninh mạng Việt Nam số 24/2018/QH14',
    'Nghị định số 53/2022/NĐ-CP quy định chi tiết Luật An ninh mạng',
    'Nghị định số 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân',
    'Bộ luật Hình sự số 100/2015/QH13 (sửa đổi, bổ sung 2017) về tội phạm công nghệ cao và lừa đảo chiếm đoạt tài sản'
  ],
  warningStatement: 'NỀN TẢNG AVA LIVE / AVA FOLLOW LÀ CÔNG CỤ CÔNG NGHỆ TRUYỀN THÔNG HỢP PHÁP. NGHIÊM CẤM TUYỆT ĐỐI MỌI HÀNH VI LỢI DỤNG PHẦN MỀM ĐỂ LỪA ĐẢO, TỔ CHỨC ĐÁNH BẠC, RỬA TIỀN HOẶC THỰC HIỆN CÁC HÀNH VI VI PHẠM PHÁP LUẬT. MỌI TRƯỜNG HỢP CỐ TÌNH VI PHẠM SẼ BỊ KHÓA VĨNH VIỄN, PHONG TỎA TÀI SẢN VÀ CHUYỂN HỒ SƠ SANG CƠ QUAN CÔNG AN (A05 / CSĐT) XỬ LÝ HÌNH SỰ.',
  articles: [
    {
      id: 'dieu_1',
      articleNumber: 'ĐIỀU 1',
      title: 'Mục Đích Sử Dụng Hợp Pháp & Tuyên Bố Miễn Trừ Trách Nhiệm',
      badge: 'MỤC ĐÍCH CÔNG NGHỆ',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      summary: 'Nền tảng cung cấp giải pháp công nghệ kết nối tương tác hợp pháp giữa Nhà sáng tạo nội dung, Doanh nghiệp và Người dùng thực 100%.',
      clauses: [
        {
          clauseNumber: '1.1',
          title: 'Phạm vi cung ứng dịch vụ',
          content: 'Nền tảng chỉ phục vụ việc phát triển thương hiệu cá nhân, lan tỏa video sáng tạo, tiếp thị sản phẩm dịch vụ kinh doanh hợp pháp theo Giấy phép ĐKKD và pháp luật Việt Nam.'
        },
        {
          clauseNumber: '1.2',
          title: 'Trách nhiệm cá nhân của chủ tài khoản',
          content: 'Người dùng tự chịu 100% trách nhiệm trước pháp luật về tính hợp pháp của đường link, nội dung video, hình ảnh, bài đăng và thông tin chiến dịch do mình tải lên hoặc quảng bá.',
          isCritical: true
        },
        {
          clauseNumber: '1.3',
          title: 'Tuyên bố không ủy quyền / không cam kết tài chính',
          content: 'Nền tảng không phải là tổ chức tín dụng, không huy động vốn trả lãi, không ủy thác đầu tư, không kinh doanh chứng khoán hay tài sản ảo bất hợp pháp.'
        }
      ]
    },
    {
      id: 'dieu_2',
      articleNumber: 'ĐIỀU 2',
      title: 'Danh Mục Hành Vi Nghiêm Cấm Tuyệt Đối (Chính Sách Không Khoan Nhượng)',
      badge: 'NGHIÊM CẤM TUYỆT ĐỐI',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      summary: 'Bất kỳ hành vi nào dưới đây bị phát hiện sẽ lập tức bị khóa tài khoản vĩnh viễn, tịch thu số dư và khởi kiện/báo cáo hình sự.',
      clauses: [
        {
          clauseNumber: '2.1',
          title: 'Lừa đảo, chiếm đoạt tài sản & bẫy tuyển dụng nạp tiền',
          content: 'Cấm tạo chiến dịch, video hoặc bình luận dẫn dụ người dùng vào các hội nhóm lừa đảo (nhiệm vụ Shopee/Tiki ảo, nạp tiền giật đơn, cọc tiền nhận thưởng, lừa đảo việc làm online).',
          isCritical: true
        },
        {
          clauseNumber: '2.2',
          title: 'Quảng bá cờ bạc, cá độ bóng đá, game bài & tài xỉu',
          content: 'Cấm mọi hành vi đặt link, mã QR, logo hoặc kịch bản seeding cho các nhà cái, web cá cược cờ bạc, đá gà, tài xỉu, lô đề trực tuyến.',
          isCritical: true
        },
        {
          clauseNumber: '2.3',
          title: 'Mô hình Ponzi, đa cấp bất chính & sàn tài chính ảo lậu',
          content: 'Cấm quảng bá các mô hình huy động vốn đa cấp không phép, sàn quyền chọn nhị phân (BO), sàn forex lừa đảo, coin/token rác lừa đảo (rug pull).'
        },
        {
          clauseNumber: '2.4',
          title: 'Mạo danh cơ quan nhà nước, tổ chức ngân hàng & công an',
          content: 'Cấm giả mạo danh tính của cán bộ cơ quan nhà nước, Viện kiểm sát, Tòa án, Công an, Ngân hàng thương mại để dọa nạt hoặc chiếm đoạt thông tin người dùng.',
          isCritical: true
        },
        {
          clauseNumber: '2.5',
          title: 'Rửa tiền & mua bán tài khoản KYC bất hợp pháp',
          content: 'Cấm sử dụng nền tảng để luân chuyển dòng tiền phạm pháp, cấm sử dụng CCCD giả, giấy tờ của người khác để tạo tài khoản ảo hoặc nhận tiền bất chính.'
        },
        {
          clauseNumber: '2.6',
          title: 'Phát tán mã độc, link đánh cắp tài khoản (Phishing)',
          content: 'Cấm dán các đường link chứa mã độc đánh cắp Cookie, mã OTP, mật khẩu TikTok/Facebook/Email của người dùng.'
        }
      ]
    },
    {
      id: 'dieu_3',
      articleNumber: 'ĐIỀU 3',
      title: 'Cơ Chế Giám Sát, Phong Tỏa & Bàn Giao Cơ Quan An Ninh Mạng (A05)',
      badge: 'GIÁM SÁT 24/7',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      summary: 'Quy trình xử lý tức thì đối với các hành vi nghi vấn hoặc có dấu hiệu tội phạm công nghệ cao.',
      clauses: [
        {
          clauseNumber: '3.1',
          title: 'AI Anti-Fraud & Quét đường link thời gian thực',
          content: 'Mọi đường dẫn (URL), nội dung mô tả, bình luận mẫu khi tạo chiến dịch đều được hệ thống AI đối soát với danh sách đen (Blacklist) an ninh mạng quốc gia.'
        },
        {
          clauseNumber: '3.2',
          title: 'Khóa tài khoản tức thời & phong tỏa ví điện tử',
          content: 'Khi có cảnh báo vi phạm hoặc đơn tố giác có chứng cứ, tài khoản sẽ bị phong tỏa trong vòng 3 phút, toàn bộ số dư Xu phát sinh từ hoạt động phạm pháp bị đóng băng vĩnh viễn.',
          isCritical: true
        },
        {
          clauseNumber: '3.3',
          title: 'Bàn giao hồ sơ chứng cứ cho Cơ quan Cảnh sát Điều tra',
          content: 'Hệ thống tự động trích xuất đầy đủ: Địa chỉ IP thực, Device Fingerprint, Lịch sử nạp/rút ngân hàng, CMND/CCCD xác minh và nhật ký truy cập để bàn giao cho Cục An Ninh Mạng A05 - Bộ Công An xử lý theo Điều 174 & Điều 290 Bộ luật Hình sự.',
          isCritical: true
        }
      ]
    },
    {
      id: 'dieu_4',
      articleNumber: 'ĐIỀU 4',
      title: 'Chính Sách Bảo Mật Dữ Liệu & Bảo Vệ Quyền Riêng Tư (Nghị Định 13/2023/NĐ-CP)',
      badge: 'BẢO MẬT DỮ LIỆU',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      summary: 'Cam kết bảo mật dữ liệu người dùng tuân thủ đầy đủ chuẩn mực quốc gia.',
      clauses: [
        {
          clauseNumber: '4.1',
          title: 'Mã hóa thông tin cá nhân',
          content: 'Tất cả dữ liệu KYC, số CCCD, ảnh chân dung và thông tin ngân hàng được mã hóa nhiều lớp (End-to-End Encryption AES-256) trên máy chủ bảo mật độc lập.'
        },
        {
          clauseNumber: '4.2',
          title: 'Cam kết không chia sẻ dữ liệu thương mại',
          content: 'Nền tảng tuyệt đối không bán, cho thuê hay thương mại hóa dữ liệu người dùng cho bất kỳ bên thứ ba quảng cáo nào.'
        },
        {
          clauseNumber: '4.3',
          title: 'Quyền kiểm soát dữ liệu của người dùng',
          content: 'Người dùng có quyền yêu cầu tra cứu nhật ký hoạt động, cập nhật tài khoản hoặc yêu cầu xóa dữ liệu cá nhân khi ngừng tham gia nền tảng.'
        }
      ]
    },
    {
      id: 'dieu_5',
      articleNumber: 'ĐIỀU 5',
      title: 'Cam Kết Điện Tử Của Người Dùng & Kênh Tố Giác Tội Phạm',
      badge: 'CAM KẾT ĐIỆN TỬ',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      summary: 'Xác lập thỏa thuận điện tử có giá trị pháp lý giữa người dùng và nền tảng.',
      clauses: [
        {
          clauseNumber: '5.1',
          title: 'Giá trị chữ ký điện tử',
          content: 'Việc người dùng bấm đăng ký, kết nối tài khoản hoặc bấm "Tôi Cam Kết Tuân Thủ" có giá trị pháp lý tương đương văn bản thỏa thuận có chữ ký theo Luật Giao dịch điện tử.'
        },
        {
          clauseNumber: '5.2',
          title: 'Đường dây nóng tiếp nhận tố giác vi phạm lừa đảo',
          content: 'Mọi hành vi nghi vấn lừa đảo trên nền tảng được tiếp nhận xử lý khẩn cấp 24/7 qua Trung tâm Kháng cáo & Khiếu nại hoặc Email: phapche@avalive.vn | Hotline khẩn cấp: 1900-AVA-SECURE.'
        }
      ]
    }
  ]
};
