// =========================================================================================
// HỆ THỐNG VĂN BẢN CHÍNH SÁCH PHÁP LUẬT, BẢN QUYỀN & QUYỀN SỞ HỮU TRÍ TUỆ
// CĂN CỨ THEO PHÁP LUẬT NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
// ÁP DỤNG TRÊN TOÀN BỘ NỀN TẢNG WEB APP AVA FOLLOW (AVA LIVE VIETNAM)
// =========================================================================================

export interface LegalClause {
  clauseId: string;
  clauseNumber: string;
  title: string;
  content: string;
  legalNote?: string;
  isStrict?: boolean;
}

export interface LegalPolicyCategory {
  id: string;
  categoryCode: string;
  title: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  legalBases: string[];
  effectiveDate: string;
  clauses: LegalClause[];
}

export const VIETNAMESE_LEGAL_POLICIES: LegalPolicyCategory[] = [
  {
    id: 'intellectual-property',
    categoryCode: 'CS-01/SHTT',
    title: 'Chính Sách Quyền Sở Hữu Trí Tuệ & Bản Quyền Tác Giả',
    shortDesc: 'Bảo hộ bản quyền phần mềm, nhãn hiệu AVA FOLLOW, quyền tác giả nội dung số và quy trình gỡ bỏ nội dung vi phạm.',
    badge: 'LUẬT SHTT 2022',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    iconName: 'ShieldCheck',
    legalBases: [
      'Luật Sở hữu trí tuệ số 50/2005/QH11',
      'Luật sửa đổi, bổ sung một số điều của Luật Sở hữu trí tuệ số 07/2022/QH15 (có hiệu lực từ 01/01/2023)',
      'Nghị định số 17/2023/NĐ-CP quy định chi tiết một số điều và biện pháp thi hành Luật Sở hữu trí tuệ về quyền tác giả, quyền liên quan',
      'Bộ luật Dân sự số 91/2015/QH13 về quyền sở hữu trí tuệ và quyền tài sản'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'shtt-1',
        clauseNumber: 'Điều 1.1',
        title: 'Bảo hộ quyền sở hữu trí tuệ đối với nền tảng AVA FOLLOW',
        content: 'Toàn bộ mã nguồn phần mềm, kiến trúc cơ sở dữ liệu, thuật toán đối soát chống gian lận, giao diện đồ họa người dùng (UI/UX), logo nhãn hiệu "AVA FOLLOW", "AVA LIVE", slogan và các tài liệu hướng dẫn vận hành đều thuộc quyền sở hữu trí tuệ hợp pháp duy nhất của AVA FOLLOW Ecosystem. Nghiêm cấm mọi hành vi sao chép, dịch ngược mã nguồn (reverse engineering), trích xuất dữ liệu trái phép (scraping), giả mạo thương hiệu dưới mọi hình thức.'
      },
      {
        clauseId: 'shtt-2',
        clauseNumber: 'Điều 1.2',
        title: 'Quyền tác giả đối với nội dung của Creator, KOC và Người dùng',
        content: 'Nhà sáng tạo nội dung (Creator, KOC), Chủ kênh và Người dùng khi đăng tải đường link, video, hình ảnh, kịch bản hoặc âm nhạc lên nền tảng phải cam kết sở hữu đầy đủ quyền tác giả hoặc có sự cho phép hợp pháp từ chủ sở hữu quyền. Người dùng tự chịu trách nhiệm dân sự và hình sự nếu nội dung đăng tải vi phạm bản quyền âm nhạc, bản quyền hình ảnh của cá nhân hoặc tổ chức khác.'
      },
      {
        clauseId: 'shtt-3',
        clauseNumber: 'Điều 1.3',
        title: 'Tuyên bố miễn trừ quyền sở hữu nhãn hiệu bên thứ ba',
        content: 'Các nhãn hiệu, biểu tượng thương mại bao gồm nhưng không giới hạn: "TikTok", "TikTok Shop", "ByteDance", "Facebook", "Meta", "YouTube", "Google" được trích dẫn trên trang web chỉ nhằm mục đích định danh kỹ thuật và tương thích dịch vụ. Toàn bộ quyền sở hữu trí tuệ đối với các nhãn hiệu này thuộc về các chủ sở hữu hợp pháp tương ứng. AVA FOLLOW là nền tảng công nghệ kết nối tương tác người dùng độc lập, không phải là đơn vị đại diện, ủy quyền hay chi nhánh của các tập đoàn nêu trên.'
      },
      {
        clauseId: 'shtt-4',
        clauseNumber: 'Điều 1.4',
        title: 'Quy trình tiếp nhận và xử lý vi phạm bản quyền (Notice & Takedown)',
        content: 'Khi phát hiện bất kỳ nội dung nào trên nền tảng có dấu hiệu xâm phạm quyền sở hữu trí tuệ, chủ sở hữu quyền có thể gửi Thông báo vi phạm kèm chứng cứ xác thực về Email: phapche@avafollow.vn. Ban Pháp chế AVA FOLLOW cam kết tiến hành xác minh và hạ gỡ nội dung vi phạm trong vòng 24 giờ kể từ thời điểm tiếp nhận theo quy định tại Nghị định 17/2023/NĐ-CP.'
      }
    ]
  },
  {
    id: 'terms-of-service',
    categoryCode: 'CS-02/DKDV',
    title: 'Điều Khoản Dịch Vụ & Thỏa Thuận Người Dùng Điện Tử',
    shortDesc: 'Xác lập quan hệ giao kết hợp đồng dịch vụ điện tử có giá trị pháp lý giữa người dùng và nền tảng.',
    badge: 'LUẬT GIAO DỊCH ĐIỆN TỬ 2023',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    iconName: 'FileText',
    legalBases: [
      'Luật Giao dịch điện tử số 20/2023/QH15',
      'Bộ luật Dân sự số 91/2015/QH13 về giao kết hợp đồng dân sự',
      'Nghị định số 52/2013/NĐ-CP và Nghị định số 85/2021/NĐ-CP về Thương mại điện tử',
      'Luật Công nghệ thông tin số 67/2006/QH11'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'dkdv-1',
        clauseNumber: 'Điều 2.1',
        title: 'Giá trị pháp lý của thỏa thuận điện tử',
        content: 'Bằng việc đăng ký tài khoản, bấm chọn xác nhận, kết nối kênh mạng xã hội hoặc tiếp tục truy cập và sử dụng dịch vụ trên website app.avafollow.vn, Người dùng đồng ý chịu sự ràng buộc vô điều kiện bởi Thỏa thuận Dịch vụ này. Căn cứ Luật Giao dịch điện tử 2023, thỏa thuận điện tử này có giá trị pháp lý tương đương văn bản ký kết truyền thống.'
      },
      {
        clauseId: 'dkdv-2',
        clauseNumber: 'Điều 2.2',
        title: 'Điều kiện tham gia và năng lực hành vi dân sự',
        content: 'Người dùng phải từ đủ 15 tuổi trở lên và có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật Việt Nam để tự chịu trách nhiệm về các hành vi kiếm tiền hoặc tạo chiến dịch. Trường hợp dưới 15 tuổi phải có sự đồng ý và giám sát trực tiếp từ cha mẹ hoặc người đại diện theo pháp luật.'
      },
      {
        clauseId: 'dkdv-3',
        clauseNumber: 'Điều 2.3',
        title: 'Quyền và nghĩa vụ của Người làm nhiệm vụ (Earners)',
        content: 'Người làm nhiệm vụ cam kết thực hiện đầy đủ, trung thực các hành động tương tác (theo dõi, xem livestream, thả tim, bình luận) bằng tài khoản thật và thiết bị thật. Nghiêm cấm hành vi hủy theo dõi (unfollow) ngay sau khi nhận Xu, sử dụng tài khoản ảo hoặc dùng phần mềm can thiệp tự động.'
      },
      {
        clauseId: 'dkdv-4',
        clauseNumber: 'Điều 2.4',
        title: 'Quyền và nghĩa vụ của Khách hàng tạo chiến dịch (Buyers / Brands)',
        content: 'Khách hàng có quyền yêu cầu hệ thống phân phối chính xác số lượng tương tác người thật theo gói đã thanh toán. Khách hàng cam kết chỉ tạo chiến dịch cho các nội dung lành mạnh, hợp pháp, không vi phạm thuần phong mỹ tục và không chứa từ khóa độc hại cấm theo pháp luật Việt Nam.'
      }
    ]
  },
  {
    id: 'privacy-data-protection',
    categoryCode: 'CS-03/BMDL',
    title: 'Chính Sách Bảo Mật Quyền Riêng Tư & Bảo Vệ Dữ Liệu Cá Nhân',
    shortDesc: 'Cam kết bảo mật dữ liệu người dùng tuyệt đối theo chuẩn Nghị định 13/2023/NĐ-CP và tiêu chuẩn mã hóa SSL/TLS 256-Bit.',
    badge: 'NGHỊ ĐỊNH 13/2023/NĐ-CP',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    iconName: 'Lock',
    legalBases: [
      'Nghị định số 13/2023/NĐ-CP của Chính phủ về Bảo vệ dữ liệu cá nhân',
      'Luật An toàn thông tin mạng số 86/2015/QH13',
      'Luật An ninh mạng số 24/2018/QH14',
      'Bộ luật Dân sự 2015 về quyền đối với đời sống riêng tư, bí mật cá nhân'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'bmdl-1',
        clauseNumber: 'Điều 3.1',
        title: 'Danh mục dữ liệu cá nhân thu thập hợp pháp',
        content: 'Nền tảng chỉ thu thập các dữ liệu cần thiết phục vụ vận hành: Họ và tên, Địa chỉ Email, Số điện thoại liên hệ, Địa chỉ IP truy cập, Thông tin nhận diện thiết bị (Device Fingerprint), Thông tin số tài khoản ngân hàng thụ hưởng giải ngân, và Ảnh thẻ CCCD/hộ chiếu đối với tài khoản yêu cầu xác minh danh tính nâng cao (KYC).'
      },
      {
        clauseId: 'bmdl-2',
        clauseNumber: 'Điều 3.2',
        title: 'Mục đích xử lý dữ liệu và nguyên tắc tối thiểu',
        content: 'Dữ liệu cá nhân chỉ được sử dụng cho các mục đích: (1) Xác thực danh tính chống gian lận và chống rửa tiền; (2) Đối soát giải ngân thu nhập hoa hồng về tài khoản ngân hàng chính chủ; (3) Hỗ trợ xử lý khiếu nại tranh chấp; (4) Cung cấp thông tin cho cơ quan nhà nước có thẩm quyền khi có văn bản yêu cầu chính thức theo luật định.'
      },
      {
        clauseId: 'bmdl-3',
        clauseNumber: 'Điều 3.3',
        title: 'Tiêu chuẩn an ninh kỹ thuật và cam kết không thương mại hóa',
        content: 'Mọi dữ liệu nhạy cảm được mã hóa đa tầng bằng tiêu chuẩn quốc tế AES-256 và truyền tải qua giao thức TLS/SSL 256-bit an toàn cao nhất. AVA FOLLOW cam kết tuyệt đối không bán, không cho thuê, không chia sẻ dữ liệu người dùng cho bất kỳ bên thứ ba quảng cáo thương mại nào.'
      },
      {
        clauseId: 'bmdl-4',
        clauseNumber: 'Điều 3.4',
        title: 'Quyền của chủ thể dữ liệu (Quyền kiểm soát & yêu cầu xóa)',
        content: 'Chủ thể dữ liệu có đầy đủ các quyền theo Điều 9 Nghị định 13/2023/NĐ-CP: Quyền được biết, quyền đồng ý, quyền truy cập, quyền chỉnh sửa và quyền yêu cầu xóa bỏ vĩnh viễn dữ liệu cá nhân khi ngừng tham gia nền tảng bằng cách gửi yêu cầu tới Ban Bảo mật dữ liệu.'
      }
    ]
  },
  {
    id: 'cybersecurity-compliance',
    categoryCode: 'CS-04/ANM',
    title: 'Chính Sách Tuân Thủ Luật An Ninh Mạng & Phòng Chống Tội Phạm',
    shortDesc: 'Quy tắc nghiêm ngặt phòng chống lừa đảo, cờ bạc, đa cấp bất chính, mã độc và cơ chế phối hợp với Cục An Ninh Mạng (A05).',
    badge: 'LUẬT AN NINH MẠNG 2018',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    iconName: 'ShieldAlert',
    legalBases: [
      'Luật An ninh mạng số 24/2018/QH14',
      'Nghị định số 53/2022/NĐ-CP quy định chi tiết một số điều của Luật An ninh mạng',
      'Bộ luật Hình sự số 100/2015/QH13 (sửa đổi, bổ sung 2017) Điều 174 (Tội lừa đảo chiếm đoạt tài sản) & Điều 290 (Tội sử dụng mạng máy tính, viễn thông thực hiện hành vi chiếm đoạt tài sản)',
      'Nghị định số 144/2021/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực an ninh trật tự'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'anm-1',
        clauseNumber: 'Điều 4.1',
        title: 'Chính sách Không Khoan Nhượng (Zero Tolerance) đối với lừa đảo',
        content: 'Nghiêm cấm tuyệt đối mọi hành vi lợi dụng nền tảng để: (1) Lập chiến dịch dẫn dụ người dùng vào các bẫy lừa đảo nạp tiền làm nhiệm vụ giật đơn Shopee/Tiki ảo; (2) Dẫn link đến các website cờ bạc, cá độ bóng đá, tài xỉu, lô đề trái phép; (3) Quảng bá mô hình Ponzi, huy động vốn đa cấp không phép, sàn tài chính ảo lừa đảo; (4) Giả mạo cơ quan nhà nước, Viện kiểm sát, Công an hoặc Ngân hàng.',
        isStrict: true
      },
      {
        clauseId: 'anm-2',
        clauseNumber: 'Điều 4.2',
        title: 'Cơ chế AI Anti-Fraud quét liên kết và phát hiện vi phạm 24/7',
        content: 'Hệ thống tự động sử dụng trí tuệ nhân tạo (AI Moderation Engine) quét theo thời gian thực tất cả các đường link, tiêu đề chiến dịch và bình luận mẫu. Bất kỳ nội dung nào trùng khớp với Danh mục từ khóa cấm hoặc danh sách đen (Blacklist) an ninh mạng quốc gia sẽ bị chặn ngay lập tức.'
      },
      {
        clauseId: 'anm-3',
        clauseNumber: 'Điều 4.3',
        title: 'Chế tài phong tỏa tức thời và trích xuất hồ sơ chuyển Cơ quan Điều tra',
        content: 'Tài khoản có hành vi vi phạm sẽ bị khóa vĩnh viễn trong vòng 3 phút, toàn bộ số dư phát sinh từ hành vi gian lận bị đóng băng vĩnh viễn. Hệ thống tự động trích xuất đầy đủ: Lịch sử IP, Thiết bị, Lịch sử nạp/rút ngân hàng và bàn giao cho Cục An Ninh Mạng A05 - Bộ Công An để xử lý truy cứu trách nhiệm hình sự.',
        isStrict: true
      }
    ]
  },
  {
    id: 'smart-escrow-contract',
    categoryCode: 'CS-05/ESCROW',
    title: 'Chính Sách Ký Quỹ Thông Minh Smart Escrow & Hợp Đồng Booking KOC',
    shortDesc: 'Cơ chế bảo vệ thanh toán 3 bên, khóa tiền ký quỹ an toàn, bảo hành nghiệm thu 72 giờ và giải quyết tranh chấp.',
    badge: 'LUẬT THƯƠNG MẠI 2005',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iconName: 'Scale',
    legalBases: [
      'Luật Thương mại số 36/2005/QH11 về hoạt động trung gian thương mại',
      'Bộ luật Dân sự 2015 về biện pháp bảo đảm thực hiện nghĩa vụ (ký quỹ, giữ tiền)',
      'Nghị định số 52/2013/NĐ-CP và Nghị định số 85/2021/NĐ-CP về Thương mại điện tử',
      'Quy chế trọng tài thương mại giải quyết tranh chấp hợp đồng'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'escrow-1',
        clauseNumber: 'Điều 5.1',
        title: 'Cơ chế Két Ký Quỹ Độc Lập Smart Vault 3 bên',
        content: 'Khi Nhãn hàng tạo đơn đặt hàng (Booking) KOC sáng tạo video hoặc livestream, 100% số tiền thù lao sẽ được tạm giữ trong Két Smart Escrow của AVA FOLLOW. KOC hoàn toàn yên tâm sáng tạo nội dung mà không sợ bị bùng tiền; Nhãn hàng hoàn toàn yên tâm tiền không bị thất thoát nếu KOC không hoàn thành công việc.'
      },
      {
        clauseId: 'escrow-2',
        clauseNumber: 'Điều 5.2',
        title: 'Chính sách bảo hành nghiệm thu 72 giờ (3 ngày) & 02 lần chỉnh sửa',
        content: 'Sau khi KOC nộp video demo hoàn chỉnh, Nhãn hàng có quyền nghiệm thu trong vòng 72 giờ và yêu cầu tối đa 02 lần chỉnh sửa miễn phí nếu video chưa đúng bản tóm tắt yêu cầu (Brief). Sau 72 giờ nếu Nhãn hàng không có phản hồi khiếu nại, hệ thống sẽ tự động đối soát giải ngân tiền cho KOC.'
      },
      {
        clauseId: 'escrow-3',
        clauseNumber: 'Điều 5.3',
        title: 'Quy trình giải quyết khiếu nại và trọng tài hòa giải',
        content: 'Trường hợp phát sinh tranh chấp chất lượng, quy trình xử lý gồm 3 bước: (1) Hòa giải trực tiếp trên hệ thống Chat Escrow; (2) Hội đồng Trọng tài AVA FOLLOW đối soát Brief và ra phán quyết hoàn tiền hoặc giải ngân trong 24h; (3) Đưa vụ việc ra Trung tâm Trọng tài Thương mại Quốc tế (VIAC) hoặc Tòa án Nhân dân có thẩm quyền nếu không đạt thỏa thuận.'
      }
    ]
  },
  {
    id: 'anti-fraud-policy',
    categoryCode: 'CS-06/ANTIFRAUD',
    title: 'Chính Sách Chống Gian Lận Tương Tác & Nguyên Tắc 100% Người Thật',
    shortDesc: 'Quy chuẩn công nghệ nghiêm cấm bot ảo, máy ảo giả lập, click farm và cơ chế bảo vệ kênh mạng xã hội an toàn tuyệt đối.',
    badge: '100% NGƯỜI THẬT',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    iconName: 'Zap',
    legalBases: [
      'Tiêu chuẩn Cộng đồng TikTok Shop 2026',
      'Chính sách An toàn Nền tảng Meta Facebook & Google YouTube',
      'Quy chuẩn kỹ thuật phát hiện hành vi tự động độc hại của Hiệp hội An toàn thông tin Việt Nam (VNISA)'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'fraud-1',
        clauseNumber: 'Điều 6.1',
        title: 'Nghiêm cấm tuyệt đối Auto Bot, Click Farm và Tool tự động',
        content: 'Hệ thống vận hành trên nguyên tắc 100% tương tác người thật. Nghiêm cấm tuyệt đối mọi hình thức can thiệp bằng script, botnet, máy ảo LDPlayer, Nox, farm điện thoại cắm tool tự động, sử dụng Proxy bẩn hoặc VPN thay đổi vị trí giả mạo.'
      },
      {
        clauseId: 'fraud-2',
        clauseNumber: 'Điều 6.2',
        title: 'Nguyên tắc ràng buộc duy nhất 1 Thiết bị - 1 IP - 1 Tài khoản',
        content: 'Mỗi cá nhân chỉ được kết nối 1 tài khoản Gmail và 1 kênh mạng xã hội duy nhất cho mỗi nền tảng. Hệ thống sử dụng công nghệ Device Fingerprint nhận diện phần cứng độc lập để phát hiện và ngăn chặn triệt để hành vi tạo tài khoản clone trục lợi điểm thưởng.'
      },
      {
        clauseId: 'fraud-3',
        clauseNumber: 'Điều 6.3',
        title: 'Chế tài thu hồi điểm thưởng và cấm vĩnh viễn',
        content: 'Người dùng có hành vi gian lận bị phát hiện sẽ bị trừ 100% số Xu tích lũy, hủy tư cách thành viên, cấm vĩnh viễn địa chỉ IP và địa chỉ MAC thiết bị trên toàn bộ mạng lưới hệ sinh thái.'
      }
    ]
  },
  {
    id: 'affiliate-tax-policy',
    categoryCode: 'CS-07/THUE',
    title: 'Chính Sách Tiếp Thị Liên Kết & Nghĩa Vụ Thuế Thu Nhập Cá Nhân',
    shortDesc: 'Cơ chế chi trả hoa hồng đại lý 20% - 35% minh bạch, quy định khấu trừ và kê khai nghĩa vụ thuế theo quy định pháp luật.',
    badge: 'LUẬT THUẾ TNCN',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    iconName: 'Coins',
    legalBases: [
      'Luật Thuế thu nhập cá nhân số 04/2007/QH12 (sửa đổi, bổ sung 2012, 2014)',
      'Thông tư số 111/2013/TT-BTC của Bộ Tài chính hướng dẫn thực hiện Luật Thuế TNCN',
      'Nghị định số 126/2020/NĐ-CP quy định chi tiết một số điều của Luật Quản lý thuế'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'thue-1',
        clauseNumber: 'Điều 7.1',
        title: 'Cơ cấu hoa hồng Tiếp thị liên kết (Affiliate Economics)',
        content: 'Người dùng tham gia chương trình Tiếp thị liên kết được hưởng mức hoa hồng trọn đời từ 20% đến 35% trên giá trị nạp của tuyến dưới, tùy thuộc vào Cấp bậc thành viên (Đồng, Bạc, Vàng, Kim Cương). Bảng tỷ lệ hoa hồng được công khai minh bạch trong mục Quản lý Đại lý.'
      },
      {
        clauseId: 'thue-2',
        clauseNumber: 'Điều 7.2',
        title: 'Trách nhiệm kê khai và thực hiện nghĩa vụ thuế của cá nhân',
        content: 'Người dùng có trách nhiệm tự kê khai và thực hiện đầy đủ nghĩa vụ thuế thu nhập cá nhân đối với các khoản thu nhập nhận được từ nền tảng theo quy định của pháp luật thuế Việt Nam. Đối với các khoản chi trả hoa hồng đạt ngưỡng chịu thuế theo quy định, AVA FOLLOW có thể hỗ trợ khấu trừ tại nguồn và cung cấp chứng từ khấu trừ thuế điện tử hợp lệ.'
      },
      {
        clauseId: 'thue-3',
        clauseNumber: 'Điều 7.3',
        title: 'Quy chuẩn giải ngân qua tài khoản ngân hàng chính chủ',
        content: 'Nhằm tuân thủ quy định phòng chống rửa tiền, tiền rút chỉ được giải ngân về tài khoản ngân hàng trùng khớp hoàn toàn với họ tên đã xác minh danh tính. Nền tảng từ chối giải ngân về ví ảo ẩn danh hoặc tài khoản của bên thứ ba không xác định.'
      }
    ]
  },
  {
    id: 'consumer-protection-refund',
    categoryCode: 'CS-08/BVNTD',
    title: 'Chính Sách Bảo Vệ Quyền Lợi Người Tiêu Dùng & Hoàn Tiền',
    shortDesc: 'Cam kết hoàn tiền 100% nếu chiến dịch không đạt số lượng và chính sách bảo hành tự động bù đắp tương tác.',
    badge: 'LUẬT BVNTD 2023',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    iconName: 'Award',
    legalBases: [
      'Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 (có hiệu lực từ 01/07/2024)',
      'Nghị định số 98/2020/NĐ-CP về xử phạt vi phạm hành chính trong hoạt động thương mại, bảo vệ quyền lợi người tiêu dùng',
      'Chính sách dịch vụ chất lượng cao AVA FOLLOW 2026'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'bvntd-1',
        clauseNumber: 'Điều 8.1',
        title: 'Cam kết hoàn tiền 100% nếu không đạt chỉ tiêu cam kết',
        content: 'Trường hợp khách hàng mua gói dịch vụ tăng trưởng hoặc chiến dịch tương tác mà hệ thống không thể hoàn thành đủ số lượng người thật đã cam kết trong khung thời gian quy định, AVA FOLLOW cam kết hoàn lại 100% số Xu hoặc số tiền chưa sử dụng về tài khoản khách hàng trong vòng 24 giờ.'
      },
      {
        clauseId: 'bvntd-2',
        clauseNumber: 'Điều 8.2',
        title: 'Chính sách bảo hành tự động bù đắp (Auto-Compensate)',
        content: 'Mọi gói dịch vụ tăng trưởng follow, like, mắt xem live đều được bảo hành bằng thuật toán bù đắp tự động. Nếu xuất hiện tỷ lệ hao hụt tự nhiên do người dùng mạng xã hội đổi ý, hệ thống sẽ tự động điều phối thêm 10% - 20% lượt tương tác mới hoàn toàn miễn phí để đảm bảo số lượng ổn định bền vững.'
      },
      {
        clauseId: 'bvntd-3',
        clauseNumber: 'Điều 8.3',
        title: 'Kênh tiếp nhận khiếu nại và đường dây nóng 24/7',
        content: 'Mọi thắc mắc, khiếu nại về chất lượng dịch vụ được tiếp nhận và phản hồi chậm nhất trong vòng 2 giờ qua Trung tâm Hỗ trợ trực tuyến, Zalo CSKH chính thức hoặc Tổng đài Chăm sóc khách hàng 1900.8899.'
      }
    ]
  },
  {
    id: 'legal-disclaimer',
    categoryCode: 'CS-09/MTTN',
    title: 'Tuyên Bố Miễn Trừ Trách Nhiệm Pháp Lý & Sự Cố Bất Khả Kháng',
    shortDesc: 'Xác định phạm vi giới hạn trách nhiệm công nghệ và các trường hợp bất khả kháng theo quy định của pháp luật.',
    badge: 'MIỄN TRỪ TRÁCH NHIỆM',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    iconName: 'AlertTriangle',
    legalBases: [
      'Bộ luật Dân sự số 91/2015/QH13 (Điều 156 về Sự kiện bất khả kháng)',
      'Luật Giao dịch điện tử 2023 về trách nhiệm của bên trung gian cung cấp dịch vụ mạng'
    ],
    effectiveDate: '01/01/2026',
    clauses: [
      {
        clauseId: 'mttn-1',
        clauseNumber: 'Điều 9.1',
        title: 'Tính chất trung gian công nghệ kết nối mở',
        content: 'AVA FOLLOW là nền tảng trung gian công nghệ cung cấp hạ tầng kết nối cung cầu giữa các bên. Nền tảng không kiểm soát và không chịu trách nhiệm về nội dung quan điểm cá nhân, tính xác thực của sản phẩm kinh doanh do người dùng và nhãn hàng tự tạo lập.'
      },
      {
        clauseId: 'mttn-2',
        clauseNumber: 'Điều 9.2',
        title: 'Giới hạn trách nhiệm đối với sự cố bất khả kháng',
        content: 'Nền tảng được miễn trừ trách nhiệm trong các trường hợp bất khả kháng theo quy định pháp luật: Thiên tai, dịch bệnh, chiến tranh, sự cố đứt cáp quang biển quốc tế, quyết định can thiệp kỹ thuật hoặc thay đổi chính sách đột ngột từ các mạng xã hội bên thứ ba (TikTok, Meta, Google) nằm ngoài tầm kiểm soát hợp lý của AVA FOLLOW.'
      }
    ]
  }
];

export const VIETNAMESE_LEGAL_OVERVIEW = {
  platformName: 'AVA FOLLOW ECOSYSTEM (AVA LIVE VIETNAM)',
  governingLaw: 'Pháp luật Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam',
  headquarters: 'Tòa nhà AVA Innovation Tower, Khu Công nghệ cao TP. Thủ Đức, TP. Hồ Chí Minh & Chi nhánh Cầu Giấy, Hà Nội',
  hotline: '1900.8899',
  emergencyLegalHotline: '0988.123.456 (Ban Pháp chế & An ninh mạng 24/7)',
  legalEmail: 'phapche@avafollow.vn',
  supportEmail: 'hotro@avafollow.vn',
  complianceCertifications: [
    { title: 'Tuân thủ Nghị định 13/2023/NĐ-CP', desc: 'Bảo vệ dữ liệu cá nhân & Mã hóa AES-256' },
    { title: 'Tuân thủ Luật An ninh mạng 2018', desc: 'Giám sát phòng chống tội phạm công nghệ cao' },
    { title: 'Tuân thủ Luật SHTT 2022', desc: 'Bảo hộ quyền tác giả & quyền sở hữu trí tuệ' },
    { title: 'Tuân thủ Nghị định 52/2013/NĐ-CP & 85/2021/NĐ-CP', desc: 'Thương mại điện tử & Ký quỹ an toàn' },
    { title: 'Chứng nhận SSL/TLS 256-Bit', desc: 'Mã hóa kết nối an toàn tuyệt đối' }
  ]
};
