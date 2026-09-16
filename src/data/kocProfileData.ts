export interface KocReview {
  brand: string;
  avatar?: string;
  stars: number;
  date: string;
  comment: string;
  contractCode: string;
}

export interface KocPortfolioVideo {
  id: string;
  title: string;
  category: string;
  views: string;
  likes: string;
  videoType: 'real_human' | 'ai_video' | 'mixed';
  videoUrl: string;
  thumbnail: string;
}

export interface KocPricingTier {
  duration: string;
  durationCode: '1_min' | '2_min' | '3_min' | '5_min' | '10_min';
  priceVnd: string;
  priceNum: number;
  badge: string;
  description: string;
}

export interface KocProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  verifiedKyc: boolean;
  reputationScore: number;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  experienceYears: string;
  onTimeDeliveryRate: string;
  bio: string;
  capabilities: {
    photoGraphic: {
      available: boolean;
      title: string;
      desc: string;
    };
    realHumanVideo: {
      available: boolean;
      title: string;
      desc: string;
      specs: string[];
    };
    aiVideo: {
      available: boolean;
      title: string;
      desc: string;
      specs: string[];
    };
  };
  pricingTiers: KocPricingTier[];
  portfolioVideos: KocPortfolioVideo[];
  reviews: KocReview[];
  escrowGuarantees: string[];
}

// 100% Hồ sơ KOC thật (Khởi tạo rỗng, người dùng đăng ký qua form KOC sẽ xuất hiện tại đây)
export const VERIFIED_KOC_PROFILES: KocProfile[] = [];

// Danh mục lĩnh vực KOC xếp theo thứ tự ưu tiên thị trường TikTok Shop
export interface KocIndustryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export const KOC_INDUSTRY_CATEGORIES: KocIndustryCategory[] = [
  { id: 'all',          name: 'Tất Cả Lĩnh Vực',         icon: '🌐', description: 'Toàn bộ KOC đã xác thực KYC trên sàn', count: 0 },
  { id: 'beauty',       name: 'Mỹ Phẩm & Làm Đẹp',       icon: '💄', description: 'Skincare, Makeup, Chăm sóc cá nhân',  count: 0 },
  { id: 'fashion',      name: 'Thời Trang & Phụ Kiện',   icon: '👗', description: 'OOTD, Váy đầm, Quần áo nam nữ',       count: 0 },
  { id: 'tech',         name: 'Công Nghệ & Điện Tử',     icon: '📱', description: 'Smartphones, Tai nghe, Đồ điện tử',   count: 0 },
  { id: 'food',         name: 'Ẩm Thực & Nhà Hàng',      icon: '🍜', description: 'Food Review, Quán ăn, Đồ ăn vặt',     count: 0 },
  { id: 'baby',         name: 'Mẹ & Bé & Gia Đình',      icon: '👶', description: 'Sữa bỉm, Đồ chơi, Đồ dùng mẹ con',    count: 0 },
  { id: 'health',       name: 'Sức Khỏe & Thể Thao',     icon: '🏋️', description: 'Gym, Yoga, Thực phẩm bổ sung',        count: 0 },
  { id: 'ai_studio',    name: 'Video AI & Viral Clip',   icon: '🤖', description: 'Avatar AI siêu tốc, Tiết kiệm 60%',   count: 0 },
];

// Khung chế tài xử phạt & bồi thường vi phạm hợp đồng KOC Escrow (4 Cấp Độ)
export const KOC_PENALTY_TIERS = [
  {
    level: 1,
    title: 'Cấp Độ 1: Vi Phạm Tiến Độ / Video Sơ Sài Nhẹ',
    severity: 'Nhẹ',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    violationDescription: 'Trả video demo trễ < 24 giờ so với deadline cam kết, hoặc video thiếu một số góc quay theo brief, thời lượng chưa đạt chuẩn.',
    penaltyAction: 'Bắt buộc quay dựng lại video miễn phí trong vòng 48 giờ để bên thuê duyệt lại.',
    financialPenalty: 'Phạt trừ 20% thù lao hợp đồng bồi hoàn cho đối tác; trừ 15 điểm uy tín Escrow.',
    accountConsequence: 'Cảnh cáo lần 1 trên hệ thống sàn.'
  },
  {
    level: 2,
    title: 'Cấp Độ 2: Cố Tình Làm Sơ Sài / Vi Phạm Cam Kết Đăng Bài',
    severity: 'Trung Bình',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    violationDescription: 'Từ chối chỉnh sửa kịch bản theo brief đã ký kết, video chất lượng quá thấp gây ảnh hưởng hình ảnh brand, hoặc tự ý xóa/ẩn video trước 30 ngày.',
    penaltyAction: 'Đình chỉ quyền nhận booking mới trong 14 ngày; công khai vi phạm trên hồ sơ KOC.',
    financialPenalty: 'Bồi thường 50% - 100% giá trị hợp đồng cho nhãn hàng từ két Escrow; trừ 40 điểm uy tín.',
    accountConsequence: 'Hạ cấp bậc KOC xuống mức thử việc.'
  },
  {
    level: 3,
    title: 'Cấp Độ 3: Trục Lợi Sản Phẩm Mẫu / Bùng Kèo Nhận Hàng',
    severity: 'Nghiêm Trọng',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    violationDescription: 'Nhận sản phẩm mẫu của nhãn hàng nhưng cố tình không quay video, chiếm đoạt sản phẩm mẫu làm của riêng, bùng kèo sau khi nhận bưu phẩm.',
    penaltyAction: 'Đóng băng ngay lập tức toàn bộ số dư ví Xu; cấm nhận job trong 30 ngày.',
    financialPenalty: 'Bồi thường 100% giá trị sản phẩm mẫu + phạt 100% giá trị hợp đồng trích từ ví Xu của KOC chuyển thẳng cho đối tác.',
    accountConsequence: 'Gắn cờ đen "Gian Lận Mẫu" trên toàn hệ thống sàn.'
  },
  {
    level: 4,
    title: 'Cấp Độ 4: Thông Đồng "Đi Đêm" / Phá Hoại Nhãn Hàng',
    severity: 'Đặc Biệt Nghiêm Trọng',
    badgeColor: 'bg-red-600/30 text-red-200 border-red-500/50',
    violationDescription: 'Chủ động lôi kéo đối tác đi đêm ngoài sàn, gian lận số liệu, phát ngôn sai lệch về sản phẩm gây khủng hoảng truyền thông hoặc lừa đảo chiếm đoạt tài sản.',
    penaltyAction: 'KHÓA TÀI KHOẢN VĨNH VIỄN NGAY LẬP TỨC KHÔNG CẦN BÁO TRƯỚC.',
    financialPenalty: 'TỊCH THU 100% TOÀN BỘ SỐ DƯ XU VÀ TIỀN CÓ TRONG SÀN để bồi thường thiệt hại cho đối tác; hủy bỏ mọi quyền lợi.',
    accountConsequence: 'Cấm vĩnh viễn CCCD/KYC & Kênh TikTok tham gia hệ thống; chuyển hồ sơ cho cơ quan pháp luật.'
  }
];
