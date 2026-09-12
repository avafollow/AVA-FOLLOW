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

export const VERIFIED_KOC_PROFILES: KocProfile[] = [
  {
    id: 'koc_huyenmy',
    name: 'Huyền My Review',
    handle: '@huyenmy.beauty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Mỹ Phẩm & Thời Trang Nữ',
    verifiedKyc: true,
    reputationScore: 100,
    rating: 4.99,
    totalReviews: 218,
    completedJobs: 312,
    experienceYears: '4+ năm Reviewer TikTok Shop',
    onTimeDeliveryRate: '100% Đúng Hạn Tuyệt Đối',
    bio: 'Chuyên gia review mỹ phẩm chính hãng, thời trang trend FYP. Kênh có hơn 480k follower tự nhiên, cam kết video kịch bản sâu, chuẩn giỏ hàng TikTok Shop, nói không với seeding ảo.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Chụp Ảnh Concept & Thiết Kế Banner',
        desc: 'Chụp hình lookbook sản phẩm, ảnh cầm tay da sáng tự nhiên, thiết kế thumbnail chuẩn tỷ lệ 9:16 thu hút click.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Người Thật 100% (Real Human)',
        desc: 'Xuất hiện trực tiếp trước ống kính, thử sản phẩm thực tế trên da mặt, giọng nói truyền cảm, chân thật.',
        specs: ['Camera Sony A7IV 4K HDR', 'Micro Rode thu âm chống ồn', 'Ánh sáng studio chuyên nghiệp', 'Nghiệm thu bản thô trong 48h']
      },
      aiVideo: {
        available: true,
        title: 'Video AI Sáng Tạo Siêu Tốc (AI Video)',
        desc: 'Sản xuất video bằng Avatar AI thông minh + Voice Clone tiếng Việt tự nhiên khi nhãn hàng cần test nhiều kịch bản.',
        specs: ['Bàn giao trong 12 - 24 giờ', 'Đa dạng kịch bản A/B Testing', 'Tự động chèn phụ đề động bắt trend']
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '500,000đ', priceNum: 500000, badge: 'Viral Hook', description: 'Video ngắn mở đầu giật gân, kêu gọi bấm giỏ hàng nhanh' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '950,000đ', priceNum: 950000, badge: 'Bán Chạy Nhất', description: 'Review chi tiết thành phần, test chất kem và so sánh đối thủ' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,400,000đ', priceNum: 1400000, badge: 'Đề Xuất FYP', description: 'Kịch bản câu chuyện giải quyết vấn đề, đẩy cảm xúc mua sắm' },
      { duration: '5 Phút', durationCode: '5_min', priceVnd: '2,200,000đ', priceNum: 2200000, badge: 'Chuyên Sâu', description: 'Đầy đủ unbox, hướng dẫn sử dụng sáng - tối và feedback' },
      { duration: '10 Phút', durationCode: '10_min', priceVnd: '4,000,000đ', priceNum: 4000000, badge: 'VIP Mega', description: 'Video dài chuẩn tài liệu kênh + Cắt 3 clip ngắn kéo traffic' }
    ],
    portfolioVideos: [
      {
        id: 'p1',
        title: 'Review Serum B5 Phục Hồi Da Đỉnh Cao',
        category: 'Skincare',
        views: '1.4M Lượt Xem',
        likes: '142K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@huyenmy.beauty/video/732101',
        thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'p2',
        title: 'Thử Thách 7 Ngày Dùng Kem Chống Nắng',
        category: 'Review Thực Tế',
        views: '890K Lượt Xem',
        likes: '78K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@huyenmy.beauty/video/732102',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Seoul Spa Official',
        stars: 5,
        date: '3 ngày trước',
        contractCode: 'ESC-260901',
        comment: 'Bạn My quay cực kỳ có tâm, chất lượng video 4K nét căng. Đơn hàng serum nổ gấp 4 lần ngay đêm đầu tiên gắn giỏ hàng!'
      },
      {
        brand: 'Mỹ Phẩm Thiên Nhiên Cocoon',
        stars: 5,
        date: '1 tuần trước',
        contractCode: 'ESC-260844',
        comment: 'Hợp đồng qua sàn Smart Escrow cực kỳ an tâm. Tiền giải ngân sòng phẳng sau 3 ngày nghiệm thu, đôi bên cùng có lợi.'
      }
    ],
    escrowGuarantees: [
      'Bảo chứng Smart Escrow Vault: Tiền cọc giữ trong két sàn, nghiệm thu 3 ngày mới giải ngân',
      'Được quyền yêu cầu sửa đổi kịch bản 02 lần miễn phí nếu chưa đạt brief',
      'Cam kết tỷ lệ giữ chân người xem video trên 45% (chuẩn thuật toán FYP)'
    ]
  },
  {
    id: 'koc_tuananh',
    name: 'Tuấn Anh TechReview',
    handle: '@tuananh.tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Công Nghệ, Gia Dụng & Phụ Kiện',
    verifiedKyc: true,
    reputationScore: 100,
    rating: 4.98,
    totalReviews: 184,
    completedJobs: 265,
    experienceYears: '5 năm Review Đồ Công Nghệ',
    onTimeDeliveryRate: '100% Đúng Hạn',
    bio: 'Chuyên gia bóc tách linh kiện, test độ bền sạc dự phòng, tai nghe, đồ gia dụng thông minh. Văn phong chân thật, khách quan, lượng fan trung thành cực lớn.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Chụp Macro Chi Tiết & Poster Đồ Công Nghệ',
        desc: 'Góc chụp macro cận cảnh góc cạnh máy, hiển thị sắc nét thông số kỹ thuật và cổng kết nối.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Người Thật 100% Unbox & Đo Đạc',
        desc: 'Sử dụng thiết bị đo dòng điện, kiểm tra nhiệt độ hồng ngoại, người thật thao tác 100% trung thực.',
        specs: ['Camera Sony FX3 Cine', 'Thiết bị đo công suất sạc USB Tester', 'Phòng thu cách âm chuyên dụng']
      },
      aiVideo: {
        available: true,
        title: 'Video AI Giới Thiệu Tính Năng 3D',
        desc: 'Mô phỏng đồ họa chuyển động AI giải thích nguyên lý hoạt động vi mạch và công nghệ sạc nhanh.',
        specs: ['Đồ họa mô phỏng 3D', 'Giọng đọc AI thuyết minh kỹ thuật số']
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '600,000đ', priceNum: 600000, badge: 'Đập Hộp Nhanh', description: 'Trải nghiệm trên tay nhanh điểm mạnh nhất của thiết bị' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '1,100,000đ', priceNum: 1100000, badge: 'Được Yêu Thích', description: 'Test tính năng cốt lõi, đo đạc thông số thực tế' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,650,000đ', priceNum: 1650000, badge: 'Khuyên Dùng', description: 'So sánh trực tiếp với 2 sản phẩm cùng tầm giá trên thị trường' },
      { duration: '5 Phút', durationCode: '5_min', priceVnd: '2,600,000đ', priceNum: 2600000, badge: 'Toàn Diện', description: 'Thử thách độ bền, ngâm nước, rơi rớt và trải nghiệm 48h' },
      { duration: '10 Phút', durationCode: '10_min', priceVnd: '4,800,000đ', priceNum: 4800000, badge: 'Đại Tiệc Review', description: 'Video Masterclass công nghệ chuyên sâu + Đăng kèm 2 clip ngắn' }
    ],
    portfolioVideos: [
      {
        id: 'p3',
        title: 'Mổ Bụng Củ Sạc 65W GaN Giá Rẻ Xem Có Đáng Mua',
        category: 'Công Nghệ',
        views: '2.1M Lượt Xem',
        likes: '190K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@tuananh.tech/video/732103',
        thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Baseus Vietnam',
        stars: 5,
        date: '5 ngày trước',
        contractCode: 'ESC-260892',
        comment: 'Tuấn Anh làm video rất kỹ tính, đo đạc số liệu thật nên khách hàng tin tưởng mua sắm cực kỳ mạnh mẽ.'
      }
    ],
    escrowGuarantees: [
      'Bảo chứng hợp đồng ký quỹ Sàn 100% không lo bùng kèo',
      'Thời gian nghiệm thu 3 ngày bảo hành trước khi giải ngân',
      'Hỗ trợ trả lời comment giải đáp thắc mắc khách hàng trong giỏ hàng 7 ngày'
    ]
  },
  {
    id: 'koc_aistudio',
    name: 'NextGen AI Video Studio',
    handle: '@nextgen.aivideo',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    category: 'Sản Xuất Video AI Siêu Thực & Viral Clip',
    verifiedKyc: true,
    reputationScore: 100,
    rating: 4.97,
    totalReviews: 142,
    completedJobs: 410,
    experienceYears: 'Chuyên gia AI Content TikTok Top 1',
    onTimeDeliveryRate: '100% Hoàn Thành Trong 24H',
    bio: 'Studio tiên phong ứng dụng công nghệ Deep Learning, Avatar AI người thật cử động môi khớp 100%, Voice Clone tiếng Việt cảm xúc cao. Giải pháp tối ưu chi phí cho các Shop muốn ra 10 - 20 video mỗi tuần.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Thiết Kế Poster & Banner AI Siêu Đẹp',
        desc: 'Tạo hình ảnh phối cảnh 3D siêu thực cho sản phẩm: phòng khách sang trọng, bãi biển nhiệt đới, phòng gym hiện đại.'
      },
      realHumanVideo: {
        available: false,
        title: 'Video Người Thật (Không cung cấp)',
        desc: 'Studio chuyên biệt 100% vào giải pháp AI để tối ưu tốc độ và chi phí rẻ hơn 60% so với thuê người thật.',
        specs: []
      },
      aiVideo: {
        available: true,
        title: 'Video AI Avatar Siêu Thực Thế Hệ Mới',
        desc: 'Avatar AI giống người thật 99.9%, cử động mắt, nụ cười và khẩu hình tự nhiên không bị đơ giật.',
        specs: ['Voice Clone tiếng Việt 3 miền Bắc - Trung - Nam', 'Bàn giao video hoàn thiện trong 12H', 'Chi phí tiết kiệm 60%', 'Dễ dàng scale 50 video/tháng']
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '350,000đ', priceNum: 350000, badge: 'AI Tiết Kiệm', description: '1 Video AI hoàn chỉnh kịch bản ngắn, phụ đề động bắt mắt' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '650,000đ', priceNum: 650000, badge: 'Siêu Tốc 12H', description: 'Video AI thuyết minh chi tiết tính năng, bối cảnh 3D siêu thực' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '950,000đ', priceNum: 950000, badge: 'Combo Đề Xuất', description: 'Avatar AI + Hiệu ứng đồ họa chuyển động bám sát kịch bản chốt đơn' },
      { duration: '5 Phút', durationCode: '5_min', priceVnd: '1,500,000đ', priceNum: 1500000, badge: 'Storytelling AI', description: 'Kịch bản câu chuyện tình huống kịch tính do AI biên tập và dựng' },
      { duration: '10 Phút', durationCode: '10_min', priceVnd: '2,800,000đ', priceNum: 2800000, badge: 'Gói Bản Quyền', description: 'Gói trọn gói 10 phút hoặc chia nhỏ thành 5 video ngắn test kênh' }
    ],
    portfolioVideos: [
      {
        id: 'p4',
        title: 'Demo Avatar AI Bán Máy Hút Bụi Cầm Tay Đạt 1.1M View',
        category: 'AI Video',
        views: '1.1M Lượt Xem',
        likes: '96K Tim',
        videoType: 'ai_video',
        videoUrl: 'https://tiktok.com/@nextgen.aivideo/video/732104',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Gia Dụng SmartHome',
        stars: 5,
        date: '2 ngày trước',
        contractCode: 'ESC-260910',
        comment: 'Video AI làm quá nhanh, đặt cọc trưa là tối có video gắn giỏ hàng rồi. Avatar chuyển động cực kỳ tự nhiên!'
      }
    ],
    escrowGuarantees: [
      'Giao video trong 12 - 24 giờ qua két Escrow sàn',
      'Chỉnh sửa giọng đọc và văn bản không giới hạn',
      'Được hoàn tiền 100% nếu video không đúng với mẫu cam kết'
    ]
  },
  {
    id: 'koc_linhdan',
    name: 'Linh Đan Fashion',
    handle: '@linhdan.ootd',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    category: 'Thời Trang & Phụ Kiện Nữ',
    verifiedKyc: true,
    reputationScore: 99,
    rating: 4.96,
    totalReviews: 165,
    completedJobs: 230,
    experienceYears: '3+ năm Fashion Creator',
    onTimeDeliveryRate: '100% Đúng Hạn',
    bio: 'Chuyên phối đồ OOTD, thử đồ công sở, đầm dạ hội, thời trang hot trend. Kênh hơn 620k followers nữ 18-35 tuổi, chuyên kéo chuyển đổi giỏ hàng TikTok Shop thời trang.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Bộ Ảnh Lookbook Thời Trang Studio & Ngoại Cảnh',
        desc: 'Chụp hình studio phông trắng hoặc đường phố, tôn dáng, màu sắc chân thực chuẩn màu vải.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Người Thật 100% Phối Đồ & Diễn Xuất',
        desc: 'Mặc thử trang phục, xoay góc 360 độ, phân tích chất liệu vải, đường may và gợi ý cách phối phụ kiện.',
        specs: ['Camera 4K Sony', 'Chỉnh màu da tự nhiên', 'Nhạc trend bản quyền thương mại TikTok']
      },
      aiVideo: {
        available: false,
        title: 'Video AI (Không áp dụng)',
        desc: 'Thời trang cần người thật mặc thử và cảm nhận form dáng thực tế.',
        specs: []
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '550,000đ', priceNum: 550000, badge: 'Mix & Match', description: 'Video biến hình trước & sau khi mặc trang phục' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '900,000đ', priceNum: 900000, badge: 'Best Seller', description: 'Thử 3 set đồ cùng 1 item, hướng dẫn phối phụ kiện' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,300,000đ', priceNum: 1300000, badge: 'Lookbook', description: 'Quay ngoại cảnh concept cao cấp, visual điện ảnh' }
    ],
    portfolioVideos: [
      {
        id: 'p5',
        title: 'Gợi Ý 5 Set Đồ Công Sở Hack Dáng Cho Nàng Nấm Lùn',
        category: 'Thời Trang',
        views: '1.8M Lượt Xem',
        likes: '160K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@linhdan.ootd/video/732105',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'ChicStyle Boutique',
        stars: 5,
        date: '4 ngày trước',
        contractCode: 'ESC-260888',
        comment: 'Linh Đan mặc đầm lên form quá đẹp, lượt mua trên livestream và giỏ hàng tăng đột biến. Rất đáng đồng tiền bát gạo!'
      },
      {
        brand: 'Túi Xách Vascara Partner',
        stars: 5,
        date: '2 tuần trước',
        contractCode: 'ESC-260812',
        comment: 'Hợp tác qua sàn rất an tâm, không lo trễ deadline. KOC nhiệt tình và hỗ trợ quay lại 1 phân cảnh theo ý brand.'
      }
    ],
    escrowGuarantees: [
      'Giao video đúng hạn hợp đồng qua két Escrow',
      'Được sửa bản thô 2 lần miễn phí',
      'Đảm bảo gắn giỏ hàng chuẩn link Shop 30 ngày'
    ]
  },
  {
    id: 'koc_khanhfood',
    name: 'Khánh Đi Đâu Ăn Đó',
    handle: '@khanh.foodie',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Ẩm Thực, Nhà Hàng & Đồ Ăn Vặt',
    verifiedKyc: true,
    reputationScore: 100,
    rating: 4.99,
    totalReviews: 245,
    completedJobs: 380,
    experienceYears: '4 năm Food Reviewer Hà Nội & Sài Gòn',
    onTimeDeliveryRate: '100% Hoàn Thành Chuẩn Chỉ',
    bio: 'Food Reviewer chuyên khám phá quán ăn, đồ ăn vặt đóng gói TikTok Shop, gia vị nấu ăn. Giọng văn hóm hỉnh, ASMR cắn giòn rụm kích thích vị giác người xem.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Chụp Món Ăn Tươi Ngon Chuẩn Menu',
        desc: 'Chụp hình món ăn bốc khói nghi ngút, cận cảnh thớ thịt, nước sốt óng ánh.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Review Người Thật Trực Tiếp Ăn Thử (ASMR)',
        desc: 'Ăn thử chân thực, biểu cảm tự nhiên, thu âm ASMR giòn tan thu hút hàng triệu view thèm ăn.',
        specs: ['Microphone thu âm ASMR chuyên dụng', 'Quay cận cảnh Slow-motion 120fps']
      },
      aiVideo: {
        available: false,
        title: 'Không áp dụng AI cho ẩm thực',
        desc: 'Món ăn bắt buộc người thật nếm thử để tạo niềm tin tuyệt đối.',
        specs: []
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '650,000đ', priceNum: 650000, badge: 'Thử Món Nhanh', description: 'Review nhanh đồ ăn vặt đóng gói hoặc 1 món đặc sản' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '1,200,000đ', priceNum: 1200000, badge: 'Được Đặt Nhiều', description: 'Review full combo món ăn tại quán hoặc set đồ ăn đóng hộp' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,800,000đ', priceNum: 1800000, badge: 'Đại Tiệc Buffet', description: 'Trải nghiệm không gian quán + phỏng vấn đầu bếp + thử 5 món' }
    ],
    portfolioVideos: [
      {
        id: 'p6',
        title: 'Thử Hết Menu Khô Bò Cay Tê Cháy Hàng TikTok Shop',
        category: 'Ẩm Thực',
        views: '2.5M Lượt Xem',
        likes: '210K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@khanh.foodie/video/732106',
        thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Ăn Vặt Bà Tuyết',
        stars: 5,
        date: '1 ngày trước',
        contractCode: 'ESC-260925',
        comment: 'Khánh quay âm thanh ASMR quá đỉnh, video lên xu hướng sau 4 tiếng, bán được hơn 2,000 hũ khô gà chỉ trong 1 tuần!'
      }
    ],
    escrowGuarantees: [
      'Cam kết ăn thử chân thật 100%, không nhận review láo',
      'Thanh toán an toàn qua Escrow, bảo vệ quyền lợi cả 2 bên',
      'Hỗ trợ đính kèm mã giảm giá độc quyền cho brand'
    ]
  },
  {
    id: 'koc_mebap',
    name: 'Mẹ Bắp Nuôi Con',
    handle: '@mebap.care',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    category: 'Mẹ & Bé, Sữa Bỉm & Đồ Gia Đình',
    verifiedKyc: true,
    reputationScore: 100,
    rating: 5.0,
    totalReviews: 198,
    completedJobs: 290,
    experienceYears: '3 năm chia sẻ kinh nghiệm mẹ bỉm',
    onTimeDeliveryRate: '100% Uy Tín',
    bio: 'Kênh chuyên review tã bỉm hữu cơ, sữa công thức, máy hút sữa, đồ ăn dặm cho bé. Tệp người theo dõi là các mẹ bỉm sữa 22-40 tuổi có sức mua cực kỳ cao.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Ảnh Mẹ Và Bé Tự Nhiên, Tươi Sáng',
        desc: 'Hình ảnh đời thường ấm áp, thân thiện, gắn kết tình mẫu tử tạo sự tin cậy cao.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Mẹ & Bé Trải Nghiệm Thực Tế',
        desc: 'Bé trực tiếp sử dụng sản phẩm (thử sữa, mặc bỉm vận động, dùng ghế ăn dặm), mẹ phân tích ưu nhược điểm khoa học.',
        specs: ['Bối cảnh gia đình ấm cúng', 'Phân tích thành phần y khoa dễ hiểu']
      },
      aiVideo: {
        available: false,
        title: 'Không áp dụng AI',
        desc: 'Ngành mẹ & bé bắt buộc trải nghiệm thực tế từ phụ huynh.',
        specs: []
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '600,000đ', priceNum: 600000, badge: 'Gợi Ý Nhanh', description: 'Review đồ chơi thông minh hoặc bình sữa cho bé' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '1,100,000đ', priceNum: 1100000, badge: 'Mẹ Bỉm Tin Dùng', description: 'Test độ thấm hút bỉm hoặc phân tích sữa dinh dưỡng' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,500,000đ', priceNum: 1500000, badge: 'Combo Đầy Đủ', description: 'Review chi tiết 3 phút trải nghiệm thực tế cùng bé' }
    ],
    portfolioVideos: [
      {
        id: 'p7',
        title: 'Top 3 Dòng Tã Bỉm Chống Hăm Được Các Mẹ Ưa Chuộng Nhất',
        category: 'Mẹ & Bé',
        views: '980K Lượt Xem',
        likes: '85K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@mebap.care/video/732107',
        thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Moony Baby Vietnam',
        stars: 5,
        date: '6 ngày trước',
        contractCode: 'ESC-260871',
        comment: 'Mẹ Bắp tư vấn rất có tâm, video ấm áp, các mẹ vào hỏi mua tã tới tấp. Sàn Escrow giao dịch rõ ràng, minh bạch!'
      }
    ],
    escrowGuarantees: [
      'Cam kết chỉ nhận sản phẩm an toàn có giấy kiểm định y tế',
      'Bảo chứng hợp đồng ký quỹ Sàn 100%',
      'Hỗ trợ duyệt kịch bản trước khi quay'
    ]
  },
  {
    id: 'koc_ducfitness',
    name: 'Đức Coach Fitness',
    handle: '@duc.coachgym',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Sức Khỏe, Gym & Thực Phẩm Thể Thao',
    verifiedKyc: true,
    reputationScore: 98,
    rating: 4.95,
    totalReviews: 120,
    completedJobs: 175,
    experienceYears: '6 năm HLV Cá Nhân & Vận Động Viên',
    onTimeDeliveryRate: '100% Đúng Hạn',
    bio: 'Huấn luyện viên Gym & Dinh dưỡng. Chuyên review Whey Protein, Creatine, đồ tập thể thao, thảm yoga, bình lắc thông minh.',
    capabilities: {
      photoGraphic: {
        available: true,
        title: 'Ảnh Body Thể Thao & Sản Phẩm Sức Khỏe',
        desc: 'Hình ảnh cơ bắp khỏe khoắn, góc chụp phòng gym chuyên nghiệp.'
      },
      realHumanVideo: {
        available: true,
        title: 'Video Người Thật Tập Luyện & Pha Uống Thực Tế',
        desc: 'Hướng dẫn bài tập kết hợp bổ sung dinh dưỡng thể thao đúng cách, nói không với quảng cáo thổi phồng.',
        specs: ['Phòng gym ánh sáng chuẩn', 'Camera 4K quay chuyển động mượt mà']
      },
      aiVideo: {
        available: false,
        title: 'Không áp dụng AI',
        desc: 'Ngành thể thao cần người thật có body chuẩn để tạo uy tín.',
        specs: []
      }
    },
    pricingTiers: [
      { duration: '1 Phút', durationCode: '1_min', priceVnd: '500,000đ', priceNum: 500000, badge: 'Động Lực Gym', description: 'Review bình lắc hoặc phụ kiện tập luyện' },
      { duration: '2 Phút', durationCode: '2_min', priceVnd: '950,000đ', priceNum: 950000, badge: 'Dinh Dưỡng Chuẩn', description: 'Phân tích thành phần Whey/Creatine và test độ tan' },
      { duration: '3 Phút', durationCode: '3_min', priceVnd: '1,350,000đ', priceNum: 1350000, badge: 'Gói Chuyên Nghiệp', description: 'Video review thực tế 3 phút hướng dẫn pha và tập luyện' }
    ],
    portfolioVideos: [
      {
        id: 'p8',
        title: 'Sai Lầm Khi Uống Whey Khiến Bạn Không Thể Tăng Cơ',
        category: 'Sức Khỏe',
        views: '1.2M Lượt Xem',
        likes: '110K Tim',
        videoType: 'real_human',
        videoUrl: 'https://tiktok.com/@duc.coachgym/video/732108',
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80'
      }
    ],
    reviews: [
      {
        brand: 'Rule 1 Protein VN',
        stars: 5,
        date: '1 tuần trước',
        contractCode: 'ESC-260833',
        comment: 'Đức làm nội dung rất chuẩn khoa học, khách hàng mua cực kỳ an tâm. Sàn bảo lãnh 100% không lo rủi ro.'
      }
    ],
    escrowGuarantees: [
      'Chỉ nhận sản phẩm chính hãng có hóa đơn VAT',
      'Ký quỹ Escrow bảo đảm tài chính 2 chiều',
      'Trả video demo đúng hạn cam kết'
    ]
  }
];

// Danh mục lĩnh vực KOC xếp theo thứ tự ưu tiên thị trường TikTok Shop
export interface KocIndustryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export const KOC_INDUSTRY_CATEGORIES: KocIndustryCategory[] = [
  { id: 'all',          name: 'Tất Cả Lĩnh Vực',         icon: '🌐', description: 'Toàn bộ KOC đã xác thực KYC trên sàn', count: VERIFIED_KOC_PROFILES.length },
  { id: 'beauty',       name: 'Mỹ Phẩm & Làm Đẹp',       icon: '💄', description: 'Skincare, Makeup, Chăm sóc cá nhân',  count: 1 },
  { id: 'fashion',      name: 'Thời Trang & Phụ Kiện',   icon: '👗', description: 'OOTD, Váy đầm, Quần áo nam nữ',       count: 1 },
  { id: 'tech',         name: 'Công Nghệ & Điện Tử',     icon: '📱', description: 'Smartphones, Tai nghe, Đồ điện tử',   count: 1 },
  { id: 'food',         name: 'Ẩm Thực & Nhà Hàng',      icon: '🍜', description: 'Food Review, Quán ăn, Đồ ăn vặt',     count: 1 },
  { id: 'baby',         name: 'Mẹ & Bé & Gia Đình',      icon: '👶', description: 'Sữa bỉm, Đồ chơi, Đồ dùng mẹ con',    count: 1 },
  { id: 'health',       name: 'Sức Khỏe & Thể Thao',     icon: '🏋️', description: 'Gym, Yoga, Thực phẩm bổ sung',        count: 1 },
  { id: 'ai_studio',    name: 'Video AI & Viral Clip',   icon: '🤖', description: 'Avatar AI siêu tốc, Tiết kiệm 60%',   count: 1 },
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


