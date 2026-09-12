import { VideoDuration, VideoCreatorType } from '../types';

// ==============================================================================
// 1. LĨNH VỰC SẢN PHẨM / NGÀNH HÀNG (INDUSTRY SECTORS) & HỆ SỐ THỊ TRƯỜNG
// ==============================================================================
export interface IndustrySectorInfo {
  id: string;
  name: string;
  icon: string;
  rateMultiplier: number;
  description: string;
  sampleRequirements: string;
}

export const KOC_INDUSTRY_SECTORS: IndustrySectorInfo[] = [
  {
    id: 'beauty',
    name: 'Mỹ Phẩm & Chăm Sóc Da (Skincare)',
    icon: '💄',
    rateMultiplier: 1.0,
    description: 'Mỹ phẩm, đồ dưỡng da, trang điểm, kem chống nắng, son môi.',
    sampleRequirements: 'Bên thuê gửi mẫu nguyên seal chính hãng, hạn sử dụng trên 12 tháng.'
  },
  {
    id: 'fashion',
    name: 'Thời Trang, Phụ Kiện & OOTD',
    icon: '👗',
    rateMultiplier: 0.95,
    description: 'Quần áo, đầm váy, túi xách, giày dép, phụ kiện phối đồ.',
    sampleRequirements: 'Gửi đúng size, màu sắc theo số đo của KOC; kèm mác hướng dẫn giặt ủi.'
  },
  {
    id: 'tech',
    name: 'Đồ Công Nghệ & Thiết Bị Điện Tử',
    icon: '📱',
    rateMultiplier: 1.25,
    description: 'Điện thoại, tai nghe Bluetooth, pin dự phòng, đồ gia dụng thông minh.',
    sampleRequirements: 'Sản phẩm mới 100%, kèm phụ kiện sạc cáp và tài liệu thông số kỹ thuật.'
  },
  {
    id: 'home',
    name: 'Đồ Gia Dụng & Tiện Ích Đời Sống',
    icon: '🍳',
    rateMultiplier: 1.0,
    description: 'Nồi chiên không dầu, máy xay sinh tố, robot hút bụi, chăn ga gối đệm.',
    sampleRequirements: 'Sản phẩm hoàn chỉnh kèm sách hướng dẫn tiếng Việt.'
  },
  {
    id: 'food',
    name: 'Ẩm Thực, F&B & Quán Ăn',
    icon: '🍜',
    rateMultiplier: 0.9,
    description: 'Đồ ăn vặt đóng gói, trà sữa, cafe, voucher trải nghiệm nhà hàng.',
    sampleRequirements: 'Bảo đảm an toàn vệ sinh thực phẩm, bao bì ghi rõ ngày sản xuất & HSD.'
  },
  {
    id: 'baby',
    name: 'Mẹ & Bé, Đồ Chơi & Sữa Dinh Dưỡng',
    icon: '👶',
    rateMultiplier: 1.15,
    description: 'Bỉm sữa, máy hút sữa, đồ ăn dặm, xe đẩy, đồ chơi giáo dục.',
    sampleRequirements: 'Có giấy công bố chất lượng của Bộ Y Tế, chứng nhận an toàn cho trẻ sơ sinh.'
  },
  {
    id: 'health',
    name: 'Sức Khỏe, Thực Phẩm Chức Năng & Gym',
    icon: '🏋️',
    rateMultiplier: 1.3,
    description: 'Whey protein, collagen, vitamin, thực phẩm bổ sung, đồ tập gym.',
    sampleRequirements: 'Bắt buộc có giấy phép lưu hành của Cục An Toàn Thực Phẩm, tem chống giả.'
  },
  {
    id: 'other',
    name: 'Lĩnh Vực Ngành Hàng Khác (Tùy Chỉnh)',
    icon: '✨',
    rateMultiplier: 1.0,
    description: 'Doanh nghiệp nhập tên ngành hàng và đặc thù sản phẩm riêng để KOC đối soát.',
    sampleRequirements: 'Gửi mẫu hoặc thỏa thuận chi tiết theo yêu cầu bổ sung của nhãn hàng.'
  }
];

// ==============================================================================
// 2. THỂ LOẠI SẢN PHẨM BÀN GIAO CỦA KOC (DELIVERABLES)
// ==============================================================================
export interface KocDeliverableType {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  outputFormat: string;
  basePriceHuman1Min: number;
  basePriceAi1Min: number;
}

export const KOC_DELIVERABLE_TYPES: KocDeliverableType[] = [
  {
    id: 'review',
    name: 'Video Review Trải Nghiệm Thực Tế',
    badge: 'Phổ Biến Nhất',
    icon: '📦',
    description: 'KOC trực tiếp cầm trên tay, dùng thử sản phẩm, chia sẻ cảm nhận chân thật, gắn giỏ hàng TikTok Shop.',
    outputFormat: 'Video dọc 9:16 Full HD/4K (1-10 phút), gắn giỏ hàng TikTok Shop',
    basePriceHuman1Min: 650000,
    basePriceAi1Min: 180000
  },
  {
    id: 'assessment_unboxing',
    name: 'Video Đánh Giá & Mở Hộp (Unboxing / Test)',
    badge: 'Chuyển Đổi Cao',
    icon: '🔬',
    description: 'Mở hộp bóc seal, soi chi tiết đường may / chất liệu / công năng, test độ bền hoặc so sánh với dòng cũ.',
    outputFormat: 'Video dọc 9:16 Full HD 60fps, quay cận cảnh Macro sắc nét',
    basePriceHuman1Min: 700000,
    basePriceAi1Min: 200000
  },
  {
    id: 'showcase_intro',
    name: 'Video Giới Thiệu Tính Năng & Brand Story',
    badge: 'Nhận Diện Thương Hiệu',
    icon: '🎬',
    description: 'Quay giới thiệu tổng quan bộ sưu tập, câu chuyện thương hiệu, các điểm bán hàng độc nhất (USP).',
    outputFormat: 'Video dọc 9:16 hoặc ngang 16:9, màu sắc điện ảnh Cinematic',
    basePriceHuman1Min: 600000,
    basePriceAi1Min: 160000
  },
  {
    id: 'viral_drama',
    name: 'Video Skit / Tiểu Phẩm Kịch Tình Huống Viral',
    badge: 'Giữ Chân 3s Đầu',
    icon: '🎭',
    description: 'Xây dựng kịch bản hài hước, drama tình huống đời sống lồng ghép khéo léo giải pháp của sản phẩm.',
    outputFormat: 'Video kịch bản 2-3 diễn viên, tiết tấu nhanh, cuốn hút triệu view',
    basePriceHuman1Min: 850000,
    basePriceAi1Min: 220000
  },
  {
    id: 'ugc_spark_ads',
    name: 'Video UGC Chạy Quảng Cáo Spark Ads',
    badge: 'Độc Quyền Ads 30-90 Ngày',
    icon: '📢',
    description: 'Định dạng UGC tự nhiên, cung cấp mã ủy quyền Spark Ads Code để Brand tự do vít ngân sách quảng cáo.',
    outputFormat: 'Video 4K chuẩn TikTok Ads Manager + Mã Spark Ads Code 30/60/90 ngày',
    basePriceHuman1Min: 950000,
    basePriceAi1Min: 260000
  },
  {
    id: 'photo_poster',
    name: 'Bộ Ảnh Chụp Cùng Sản Phẩm & Poster Gian Hàng',
    badge: 'Visual Cao Cấp',
    icon: '📸',
    description: 'KOC chụp ảnh lookbook cùng sản phẩm, cung cấp file gốc độ phân giải cao để làm banner, cover TikTok Shop.',
    outputFormat: 'Bộ 5-10 ảnh chất lượng cao 300dpi, đã qua hậu kỳ chỉnh màu da',
    basePriceHuman1Min: 500000,
    basePriceAi1Min: 150000
  },
  {
    id: 'livestream_session',
    name: 'Phiên KOC Livestream Đồng Hành Cùng Shop',
    badge: 'Chốt Đơn Trực Tiếp',
    icon: '🎙️',
    description: 'KOC xuất hiện trong phiên livestream của Brand hoặc mời Brand vào phiên live của KOC để đẩy doanh số.',
    outputFormat: 'Phiên live liên tục 60 - 90 phút, kêu gọi thả tim và chốt deal giỏ hàng',
    basePriceHuman1Min: 1500000,
    basePriceAi1Min: 500000
  },
  {
    id: 'checkin',
    name: 'Check-in Trải Nghiệm Thực Tế Tại Điểm Bán / Quán',
    badge: 'Kéo Khách Đến Quán',
    icon: '📍',
    description: 'KOC di chuyển trực tiếp đến nhà hàng, quán cafe, spa, phòng gym để ghi hình không gian và dịch vụ.',
    outputFormat: 'Video review không gian, món ăn, dịch vụ + Check-in vị trí trên TikTok',
    basePriceHuman1Min: 900000,
    basePriceAi1Min: 350000
  },
  {
    id: 'other',
    name: 'Thể Loại Bàn Giao Khác (Theo Yêu Cầu Riêng)',
    badge: 'Tùy Biến 100%',
    icon: '💡',
    description: 'Hình thức sản phẩm sáng tạo đặc thù do nhãn hàng yêu cầu riêng và được đưa vào Phụ lục Hợp đồng.',
    outputFormat: 'Bàn giao theo mô tả thỏa thuận chi tiết giữa 2 bên trong hợp đồng',
    basePriceHuman1Min: 650000,
    basePriceAi1Min: 180000
  }
];

// ==============================================================================
// 3. THỜI LƯỢNG TIÊU CHUẨN & HỆ SỐ GIÁ (DURATION MULTIPLIERS)
// ==============================================================================
export const DURATION_FACTORS: Record<VideoDuration, { label: string; multiplier: number; desc: string }> = {
  '1_min':  { label: '1 Phút',  multiplier: 1.0,  desc: 'Hook nhanh 3s đầu, lướt FYP cực mượt' },
  '2_min':  { label: '2 Phút',  multiplier: 1.7,  desc: 'Nêu nỗi đau, phân tích thành phần & công năng' },
  '3_min':  { label: '3 Phút',  multiplier: 2.3,  desc: 'Kịch bản storytelling sâu, chốt đơn giỏ hàng' },
  '5_min':  { label: '5 Phút',  multiplier: 3.7,  desc: 'Đánh giá toàn diện, unbox và so sánh A-Z' },
  '10_min': { label: '10 Phút', multiplier: 6.5,  desc: 'Phóng sự trải nghiệm dài, đại tiệc unbox' }
};

// ==============================================================================
// 4. HÀM TÍNH TOÁN GIÁ SÀN THỊ TRƯỜNG (MARKET FLOOR PRICE)
// ==============================================================================
export interface FloorPriceCalculationParams {
  deliverableId: string;
  industryId: string;
  duration: VideoDuration;
  creatorType: VideoCreatorType;
}

export function calculateKocFloorPrice({
  deliverableId,
  industryId,
  duration,
  creatorType
}: FloorPriceCalculationParams): number {
  const deliverable = KOC_DELIVERABLE_TYPES.find(d => d.id === deliverableId) || KOC_DELIVERABLE_TYPES[0];
  const base1Min = creatorType === 'human' ? deliverable.basePriceHuman1Min : deliverable.basePriceAi1Min;
  const industry = KOC_INDUSTRY_SECTORS.find(i => i.id === industryId) || KOC_INDUSTRY_SECTORS[0];
  const industryMultiplier = industry.rateMultiplier;

  if (deliverableId === 'photo_poster') {
    return Math.round((base1Min * industryMultiplier) / 10000) * 10000;
  }
  if (deliverableId === 'livestream_session') {
    return Math.round((base1Min * industryMultiplier) / 50000) * 50000;
  }

  const durationMultiplier = DURATION_FACTORS[duration]?.multiplier || 1.0;
  const rawFloor = base1Min * industryMultiplier * durationMultiplier;
  return Math.round(rawFloor / 10000) * 10000;
}

// ==============================================================================
// 5. KIỂM TRA ĐIỀU KIỆN DEAL GIÁ: TUYỆT ĐỐI KHÔNG DƯỚI GIÁ SÀN
// ==============================================================================
export interface DealPriceValidationResult {
  isValid: boolean;
  floorPrice: number;
  dealPrice: number;
  difference: number;
  errorMessage?: string;
  warningNote?: string;
}

export function validateKocDealPrice(dealPrice: number, floorPrice: number): DealPriceValidationResult {
  if (isNaN(dealPrice) || dealPrice <= 0) {
    return {
      isValid: false,
      floorPrice,
      dealPrice: 0,
      difference: -floorPrice,
      errorMessage: 'Vui lòng nhập mức giá thỏa thuận hợp lệ!'
    };
  }

  if (dealPrice < floorPrice) {
    return {
      isValid: false,
      floorPrice,
      dealPrice,
      difference: dealPrice - floorPrice,
      errorMessage: `⛔ GIÁ DEAL KHÔNG ĐƯỢC DƯỚI GIÁ SÀN: Giá sàn niêm yết theo thị trường cho gói này là ${floorPrice.toLocaleString('vi-VN')}đ. Bạn chỉ có thể thỏa thuận bằng hoặc cao hơn để đảm bảo thu nhập và quyền lợi tối thiểu cho Creator!`
    };
  }

  const difference = dealPrice - floorPrice;
  let warningNote: string | undefined;

  if (difference === 0) {
    warningNote = 'Mức giá bằng đúng giá sàn tiêu chuẩn thị trường.';
  } else {
    const percentHigher = Math.round((difference / floorPrice) * 100);
    warningNote = `Giá thỏa thuận cao hơn giá sàn +${difference.toLocaleString('vi-VN')}đ (+${percentHigher}%). Đây là mức deal hấp dẫn thu hút KOC ưu tiên làm nhanh và chau chuốt hơn!`;
  }

  return {
    isValid: true,
    floorPrice,
    dealPrice,
    difference,
    warningNote
  };
}

// ==============================================================================
// 6. MẪU VĂN BẢN HỢP ĐỒNG ĐIỆN TỬ ESCROW 3 BÊN ĐẦY ĐỦ PHÁP LÝ (MASTER CONTRACT)
// ==============================================================================
export interface ContractLegalParams {
  contractCode: string;
  createdDate: string;
  clientName: string;
  clientContact?: string;
  clientPhone?: string;
  clientAddress?: string;
  kocName: string;
  kocHandle: string;
  kocContact?: string;
  sampleReturnAddress?: string;
  productName: string;
  industrySectorName: string;
  deliverableTypeName: string;
  durationLabel: string;
  videoQuantity: number;
  floorPricePerUnit: number;
  agreedPricePerUnit: number;
  totalEscrowAmountVnd: number;
  kocEarnsAmountVnd: number;
  platformFeeVnd: number;
  deliveryDeadlineDate: string;
  warrantyDays: number;
  requirements: string;
  creatorType: VideoCreatorType;
  customAnnexTerms?: string;
  customDeliveryNotes?: string;
  kocSignedAt?: string;
  clientSignedAt?: string;
}

export function generateLegalContractText(p: ContractLegalParams): string {
  return `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------------------------

HỢP ĐỒNG ĐIỆN TỬ DỊCH VỤ SÁNG TẠO NỘI DUNG KOC & BẢO CHỨNG KÝ QUỸ ESCROW 3 BÊN
(Áp dụng theo Luật Thương mại 2005, Luật Giao dịch điện tử 2023 & Quy chế Sàn Giao Dịch Ký Quỹ AVA FOLLOW)

Mã số hợp đồng điện tử: ${p.contractCode}
Thời điểm thiết lập ký kết: ${p.createdDate}
Phương thức bảo chứng tài chính: Ký quỹ thông minh 100% qua Smart Escrow Vault

CÁC BÊN THAM GIA KÝ KẾT:

1. BÊN A (BÊN THUÊ DỊCH VỤ / THƯƠNG HIỆU):
- Tên pháp nhân / Cá nhân đại diện: ${p.clientName}
- Kênh liên hệ / Tài khoản định danh trên Sàn: ${p.clientContact || 'Đã xác thực danh tính KYC trên AVA FOLLOW'}
${p.clientPhone ? `- Số điện thoại / Zalo đối soát: ${p.clientPhone}` : ''}
${p.clientAddress ? `- Địa chỉ gửi hàng mẫu: ${p.clientAddress}` : ''}
- Vai trò: Chủ sở hữu sản phẩm / Đơn vị đặt hàng sản xuất nội dung video & hình ảnh.

2. BÊN B (BÊN CUNG CẤP DỊCH VỤ / KOC / CREATOR):
- Họ và tên người thực hiện / Studio: ${p.kocName}
- Kênh TikTok chính thức: ${p.kocHandle}
${p.sampleReturnAddress ? `- Địa chỉ nhận sản phẩm mẫu: ${p.sampleReturnAddress}` : ''}
- Hình thức sáng tạo: ${p.creatorType === 'human' ? 'KOC Người Thật 100% (Gương mặt, giọng nói thật)' : 'AI Video Creator Studio (Avatar & Voice Clone AI)'}
- Vai trò: Trực tiếp sáng tạo kịch bản, quay dựng, hoàn thiện và bàn giao sản phẩm.

3. BÊN C (ĐƠN VỊ QUẢN LÝ SÀN & TRUNG GIAN KÝ QUỸ ESCROW):
- Nền tảng Công nghệ & Sàn Ký Quỹ Escrow AVA FOLLOW
- Địa chỉ hệ thống: Hệ thống bảo chứng thanh toán thông minh Escrow Gateway
- Vai trò: Bên thứ ba độc lập giữ 100% tiền cọc, giám sát tiến độ bàn giao, kiểm soát chất lượng kỹ thuật, điều hành thời hạn bảo hành 3 ngày và phân xử tranh chấp công bằng.

HAI BÊN THỐNG NHẤT KÝ KẾT CÁC ĐIỀU KHOẢN SAU ĐÂY:

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG & DANH MỤC SẢN PHẨM BÀN GIAO
1.1. Bên A thuê Bên B thực hiện sản xuất gói nội dung truyền thông cho sản phẩm: "${p.productName}".
1.2. Lĩnh vực sản phẩm / Ngành hàng: ${p.industrySectorName}.
1.3. Thể loại sản phẩm bàn giao: ${p.deliverableTypeName}.
1.4. Quy cách kỹ thuật bàn giao:
   - Số lượng: ${p.videoQuantity} ${p.deliverableTypeName.includes('Ảnh') ? 'Bộ ảnh' : 'Video'}.
   - Thời lượng tiêu chuẩn: ${p.durationLabel} / sản phẩm.
   - Định dạng: Tỷ lệ dọc chuẩn TikTok 9:16, độ phân giải tối thiểu Full HD 1080p (hoặc 4K), âm thanh chống ồn lọc tạp âm rõ ràng.
   - Yêu cầu kịch bản & triển khai: ${p.requirements}.

ĐIỀU 2: GIÁ SÀN QUY ĐỊNH, GIÁ THỎA THUẬN DEAL & CƠ CHẾ KÝ QUỸ ESCROW
2.1. NGUYÊN TẮC GIÁ SÀN:
   - Giá sàn thị trường quy định tối thiểu cho gói này: ${p.floorPricePerUnit.toLocaleString('vi-VN')} VNĐ / sản phẩm.
   - Hai bên cam kết không được thỏa thuận mức giá dưới giá sàn nhằm bảo vệ chất lượng sản phẩm và thu nhập chính đáng của người sáng tạo nội dung.
2.2. GIÁ THỎA THUẬN (DEAL PRICE):
   - Đơn giá hai bên đã thống nhất: ${p.agreedPricePerUnit.toLocaleString('vi-VN')} VNĐ / sản phẩm (>= Giá sàn).
   - Tổng giá trị hợp đồng: ${p.totalEscrowAmountVnd.toLocaleString('vi-VN')} VNĐ.
2.3. CƠ CHẾ PHÂN PHỐI & GIẢI NGÂN (80% / 20%):
   - Thù lao thực nhận của Bên B (KOC) sau khi hoàn thành: ${p.kocEarnsAmountVnd.toLocaleString('vi-VN')} VNĐ (Tương đương 80% giá trị hợp đồng).
   - Phí dịch vụ bảo chứng Sàn Ký Quỹ Escrow & Công nghệ: ${p.platformFeeVnd.toLocaleString('vi-VN')} VNĐ (Tương đương 20% giá trị hợp đồng).
2.4. BẢO CHỨNG TÀI CHÍNH 100%:
   - Toàn bộ số tiền ${p.totalEscrowAmountVnd.toLocaleString('vi-VN')} VNĐ được Bên A nạp và khóa an toàn 100% trong Két Escrow của Bên C trước khi Bên B bắt đầu sản xuất. Bên B hoàn toàn yên tâm không lo rủi ro bị bùng tiền.

ĐIỀU 3: THỜI HẠN BÀN GIAO, NGÀY GIỜ BÀN GIAO & QUY TRÌNH GỬI MẪU
3.1. Ngày giờ bàn giao cam kết: ${p.deliveryDeadlineDate}.
3.2. Mốc thời gian được tính chính thức kể từ thời điểm Bên B xác nhận đã nhận được sản phẩm mẫu nguyên seal từ Bên A (đối với sản phẩm vật lý) hoặc tính từ lúc hợp đồng ký quỹ thành công (đối với dịch vụ/AI).
3.3. Trách nhiệm gửi mẫu của Bên A:
   - Bên A có trách nhiệm gửi sản phẩm mẫu nguyên seal miễn phí kèm mã vận đơn đối soát cho Bên B trong vòng 48 giờ sau khi hợp đồng được xác lập.
3.4. Trách nhiệm trả bản nháp của Bên B:
   - Bên B phải nộp bản video demo duyệt lên Sàn trước ngày giờ bàn giao ít nhất 24-48 giờ để Bên A nghiệm thu.

ĐIỀU 4: TIÊU CHUẨN NGHIỆM THU, CHÍNH SÁCH BẢO HÀNH 3 NGÀY (72 GIỜ) & QUYỀN SỬA ĐỔI
4.1. CHÍNH SÁCH BẢO HÀNH 3 NGÀY (72 GIỜ):
   - Ngay sau khi Bên B nộp link video demo hoàn chỉnh lên hệ thống, đồng hồ bảo hành 3 ngày (72 giờ) sẽ tự động kích hoạt.
   - Trong suốt 72 giờ này, tiền vẫn được Sàn giữ an toàn 100%. Bên A có toàn quyền đối soát, kiểm tra chất lượng hình ảnh, phát âm tên sản phẩm, góc quay và đường link gắn giỏ hàng.
4.2. QUYỀN CHỈNH SỬA MIỄN PHÍ:
   - Bên A được yêu cầu Bên B chỉnh sửa tối đa 02 (hai) lần miễn phí đối với các lỗi liên quan đến kịch bản brief đã cam kết, âm lượng nhạc nền hoặc các chi tiết kỹ thuật chưa đạt chuẩn.
   - Bên B có trách nhiệm hoàn tất chỉnh sửa trong vòng 24 - 48 giờ kể từ khi nhận phản hồi.
4.3. TỰ ĐỘNG GIẢI NGÂN (AUTO-RELEASE):
   - Nếu kết thúc thời hạn 72 giờ mà Bên A không có phản hồi khiếu nại hoặc không yêu cầu chỉnh sửa, hệ thống Sàn sẽ tự động giải ngân toàn bộ số tiền vào ví của Bên B theo đúng quy định.

ĐIỀU 5: QUYỀN TÁC GIẢ, BẢN QUYỀN HÌNH ẢNH & ỦY QUYỀN TIKTOK ADS
5.1. Bên B đảm bảo nội dung video không vi phạm bản quyền âm nhạc, hình ảnh hoặc chính sách cộng đồng của TikTok.
5.2. Bên A được toàn quyền sử dụng video/hình ảnh bàn giao để quảng bá trên các kênh truyền thông chính thức của nhãn hàng.
5.3. Đối với gói có ủy quyền chạy quảng cáo: Bên B cung cấp mã Spark Ads Code với thời hạn tối thiểu 30 ngày (hoặc theo thỏa thuận) để Bên A chạy chiến dịch quảng cáo TikTok Ads hợp lệ.

ĐIỀU 6: CAM KẾT BẢO MẬT THÔNG TIN (NDA) & ĐẠO ĐỨC NGHỀ NGHIỆP
6.1. Cả Bên A và Bên B cam kết giữ bí mật tuyệt đối về chiến lược ra mắt sản phẩm, mức giá deal riêng tư, công thức sản phẩm hoặc các tài liệu mật do đối tác cung cấp.
6.2. Bên B tuyệt đối không được nhận tiền của đối thủ cạnh tranh để đăng tải video chê bai, dìm hàng hoặc tạo thông tin sai sự thật về sản phẩm của Bên A.

ĐIỀU 7: CHẾ TÀI PHẠT VI PHẠM, CHẬM TIẾN ĐỘ & ĐỀN BÙ BÙNG KÈO
7.1. Chậm trễ bàn giao không có lý do chính đáng:
   - Phạt trừ 5% giá trị hợp đồng cho mỗi 24 giờ trễ hạn, số tiền phạt được khấu trừ chuyển hoàn lại cho Bên A.
   - Trễ quá 03 (ba) ngày: Bên A có quyền đơn phương hủy hợp đồng, nhận lại 100% tiền cọc từ Két Escrow, đồng thời Bên B bị hạ điểm uy tín.
7.2. Hành vi bùng kèo sau khi nhận sản phẩm mẫu:
   - Nếu Bên B nhận sản phẩm mẫu nhưng cố tình không thực hiện nghĩa vụ quay video và không hoàn trả sản phẩm, Bên B phải đền bù 200% giá trị sản phẩm mẫu và bị khóa tài khoản vĩnh viễn trên toàn hệ sinh thái Sàn.

ĐIỀU 8: ĐIỀU KHOẢN CHỐNG GIAO DỊCH NGOÀI SÀN (ANTI-BYPASS ESCROW)
8.1. Cả hai bên cam kết 100% giao dịch, trao đổi kịch bản, nghiệm thu và đối soát thanh toán đều thực hiện qua cổng quản lý hợp đồng của Sàn.
8.2. Mọi hành vi chủ động lôi kéo đối tác giao dịch ngầm ngoài sàn nhằm trốn tránh phí dịch vụ sẽ dẫn đến việc: Khóa vĩnh viễn tài khoản của cả 2 bên, tịch thu số dư vi phạm và Sàn miễn trừ 100% trách nhiệm bảo hiểm tài chính khi phát sinh rủi ro lừa đảo ngoài sàn.

ĐIỀU 9: CƠ CHẾ GIẢI QUYẾT TRANH CHẤP & TRỌNG TÀI SÀN
9.1. Khi có bất đồng về chất lượng hoặc tiến độ mà hai bên không tự thương lượng được, một trong hai bên có quyền kích hoạt nút "Yêu Cầu Khiếu Nại Escrow".
9.2. Hội đồng Trọng tài Sàn AVA FOLLOW sẽ kiểm tra hồ sơ, đối chiếu brief ban đầu, bằng chứng video và đưa ra phán quyết chung thẩm có giá trị thi hành trong vòng 24 - 48 giờ.

ĐIỀU 10: HIỆU LỰC & CHỮ KÝ SỐ ĐIỆN TỬ
10.1. Hợp đồng này được xác lập dưới hình thức chứng từ điện tử có giá trị pháp lý tương đương bản gốc bằng văn bản theo Luật Giao dịch điện tử.
10.2. Hợp đồng tự động có hiệu lực ngay khi Bên A hoàn tất khóa ký quỹ Escrow và Bên B bấm xác nhận nhận đơn.

PHỤ LỤC HỢP ĐỒNG 01: THỎA THUẬN BỔ SUNG & YÊU CẦU RIÊNG BIỆT (ANNEX):
(Các điều khoản bổ sung dưới đây do hai bên trực tiếp nhập và thống nhất, có giá trị pháp lý ràng buộc kèm theo Hợp đồng chính)
- Yêu cầu riêng về kịch bản / trang phục / thiết bị quay: ${p.customDeliveryNotes || 'Thực hiện theo brief tiêu chuẩn đã cam kết.'}
- Điều khoản bổ sung riêng do hai bên thỏa thuận: ${p.customAnnexTerms || 'Hai bên cam kết tuân thủ đầy đủ các điều khoản hợp đồng chính, không có yêu cầu sửa đổi nào khác.'}

CHỮ KÝ XÁC THỰC ĐIỆN TỬ CỦA CÁC BÊN:

[BÊN A: BÊN THUÊ]
Ký điện tử bởi: ${p.clientName}
Xác thực: OTP Mã hóa phiên giao dịch Smart Contract
Thời gian ký: ${p.createdDate}

[BÊN B: KOC / CREATOR]
Ký điện tử bởi: ${p.kocName} (${p.kocHandle})
Xác thực: Chữ ký số danh tính KYC
Thời gian ký: Khi nhận hợp đồng

[BÊN C: ĐƠN VỊ BẢO CHỨNG SÀN AVA FOLLOW]
ĐÃ CHỨNG THỰC BẢO VỆ TÀI CHÍNH KÝ QUỸ ESCROW 100%
Dấu kiểm định: [CERTIFIED SMART ESCROW VAULT - AVA FOLLOW]
Mã Hash đối soát: SHA256-${p.contractCode.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}
`.trim();
}
