export type ScreenId = 
  | 'home'              // 01 - Trang chủ Tăng trưởng Follow & Xây kênh
  | 'tasks'             // 02 - Nhiệm vụ Follow & Tương tác kiếm Xu
  | 'task_detail'       // Chi tiết nhiệm vụ
  | 'create_campaign'   // 03 - Tạo chiến dịch Follow, Tim, Comment, Booking
  | 'booking_escrow'    // 04 - Sàn Ký Quỹ Booking KOC Trung Gian 3 Bên
  | 'marketplace'       // 05 - Dịch vụ Booking & Xây kênh trọn gói (24 Gói)
  | 'business_portal'   // 06 - Cổng Dành Cho Doanh Nghiệp & Người Đã Mua Gói (Business Client Hub)
  | 'app_marketplace'   // 07 - Chợ Ứng Dụng & Phần Mềm Xây Kênh TikTok (App Marketplace)
  | 'affiliate'         // 08 - Trang Tiếp thị liên kết (Affiliate Hub)
  | 'community'         // 09 - Cộng đồng Xây kênh & Chia sẻ mẹo TikTok
  | 'profile_wallet'    // 10 - Hồ sơ người dùng & Ví Token
  | 'admin'             // 11 - Trang Admin Quản trị hệ thống
  | 'policy_guide'      // 12 - Bảng chính sách, cấp bậc & cẩm nang kiếm tiền
  | 'analytics'         // 13 - Báo cáo phân tích thu nhập & thời gian xem
  | 'tokenomics';       // 14 - Trung tâm Quản trị & Tiêu dùng Token Sàn

// Nhiệm vụ kiếm tiền (Follow, Xem video, Thả tim, Bình luận, Chia sẻ, Review, Affiliate, Livestream)
export type TaskType = 'follow' | 'watch' | 'like' | 'comment' | 'share' | 'review' | 'affiliate' | 'livestream';

export interface TikTokTaskItem {
  id: string;
  title: string;
  type: TaskType;
  rewardCoins: number;       // Số Xu nhận được
  rewardVND: string;          // Quy đổi VNĐ
  channelName: string;       // Tên kênh TikTok
  channelHandle: string;     // @handle
  channelAvatar: string;
  targetUrl: string;         // Link kênh hoặc video
  totalSlots: number;        // Tổng số lượng follow cần
  completedSlots: number;    // Đã hoàn thành
  remainingSlots: number;
  guide: string;             // Hướng dẫn thực hiện (vd: Bấm follow, chụp ảnh màn hình)
  requirements: string[];
  status: 'open' | 'running' | 'completed';
  createdAt: string;
  videoPreviewUrl?: string;
  requiresWatch?: boolean;
  sampleComments?: string[];
  tags?: string[];
  campaignCategory?: 'community' | 'partner'; // 'community': Xem tự do, cứ xem là có Xu | 'partner': Doanh nghiệp/Đối tác tài trợ, giới hạn suất, ai đến trước nhận trước
  partnerName?: string; // Tên doanh nghiệp / thương hiệu đối tác
  partnerBadge?: string; // e.g. 'Doanh Nghiệp Kim Cương', 'Shop Yêu Thích'
  platform?: 'tiktok' | 'facebook' | 'youtube';
  channelUrl?: string;       // Link trực tiếp đến kênh / Fanpage
  fanpageUrl?: string;       // Link Fanpage Facebook
  isUrgent?: boolean; // Vừa mới mở, suất có hạn
  isBoosted?: boolean; // Đã được ưu tiên Đẩy Top (-5.000 Xu phí về sàn)
  boostedAt?: string; // Thời điểm đẩy top
  boostCount?: number; // Số lần đẩy top
  isHot?: boolean; // Chiến dịch Hot
  audienceTargeting?: CampaignAudienceTargeting;
  targetMatchScore?: number; // Điểm số khớp với hồ sơ/hành vi người dùng (vd: 100 = Khớp 100%)
}

// Lịch sử hành động nhiệm vụ của người dùng (Chống trùng lặp & bảo vệ quyền lợi chủ shop)
export interface UserTaskActionHistory {
  taskId: string;
  taskTitle: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  viewed: boolean;
  followed: boolean;
  liked: boolean;
  commented: boolean;
  shared: boolean;
  totalCoinsEarned: number;
  completedAt: string;
  platform?: 'tiktok' | 'facebook' | 'youtube';
  performerAccount?: string;
  txHash?: string;
}

// Sổ cái ghi nhận nhiệm vụ đa nền tảng thời gian thực (TikTok, Facebook, YouTube)
export interface MultiPlatformTaskSyncRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  platform: 'tiktok' | 'facebook' | 'youtube';
  actionType: 'follow' | 'like' | 'comment' | 'share' | 'watch' | 'subscribe';
  actionLabel: string;
  targetHandleOrUrl: string;
  performerAccount: string; // Tên tài khoản thật của user trên nền tảng đó
  coinsEarned: number;
  amountVND: number;
  txHash: string;
  verifiedAt: string;
  status: 'verified' | 'success' | 'pending';
  syncMethod: 'api_direct' | 'oauth_realtime' | 'oembed_verified';
}

// Báo cáo hoạt động người dùng theo kỳ (Ngày, Tuần, Tháng)
export interface UserActivityPeriodReport {
  period: 'day' | 'week' | 'month';
  periodLabel: string;
  videosWatched: number;
  followsGiven: number;
  likesGiven: number;
  commentsGiven: number;
  sharesGiven: number;
  liveMinutesWatched: number;
  totalCoinsEarned: number;
  totalVND: string;
}

// Thông báo thời gian thực về tài khoản người dùng
export interface UserNotificationItem {
  id: string;
  type: 'hot_campaign' | 'boosted_campaign' | 'reward_claimed' | 'system';
  title: string;
  message: string;
  taskId?: string;
  rewardCoins?: number;
  timestamp: string;
  isRead: boolean;
}

export interface PartnerCampaignAnnouncement {
  id: string;
  partnerName: string;
  campaignTitle: string;
  channelHandle: string;
  totalSlots: number;
  remainingSlots: number;
  rewardCoins: number;
  taskType: TaskType;
  taskId: string;
  createdAt: string;
  isBoosted?: boolean;
}

// Hạng mục Booking KOC & Sản Xuất Video
export type BookingCategory = 
  | 'review'               // 01 - Video Review Trải Nghiệm Sản Phẩm (Gắn giỏ hàng TikTok Shop / Bio)
  | 'normal_video'         // 02 - Video Sáng Tạo Nội Dung Thông Thường (Brand Story, Giới thiệu sản phẩm)
  | 'viral_drama'          // 03 - Skit / Tiểu Phẩm Hài Tình Huống Viral (Diễn kịch, câu chuyện giữ chân 3s)
  | 'ugc_ads'              // 04 - Video UGC Cấp Quyền Spark Ads (Chạy quảng cáo chuyển đổi)
  | 'checkin'              // 05 - Check-in Trải Nghiệm Thực Tế Tại Điểm (Quán ăn, cafe, gym, spa, hotel)
  | 'livestream_cohost'    // 06 - KOC Livestream Cùng Chủ Shop (Kéo mắt & chốt đơn tại studio)
  | 'ai_multilingual'      // 07 - Video AI Đa Ngôn Ngữ (Xuất khẩu bán hàng TikTok Quốc Tế US/UK/SEA)
  | 'bio_link'             // 08 - Đặt Link Bio Kênh Triệu Follow
  | 'photo_graphic';       // 09 - Chụp Bộ Ảnh Sản Phẩm & Thiết Kế Banner TikTok Shop

// Phân loại hình thức sáng tạo: Người Thật (KOC Human) vs AI Creator
export type VideoCreatorType = 'human' | 'ai';

// Phân loại thời lượng video tiêu chuẩn TikTok
export type VideoDuration = '1_min' | '2_min' | '3_min' | '5_min' | '10_min';

// Bảng giá sàn thực tế thị trường (VNĐ) cho từng loại hình & thời lượng
export const BOOKING_MARKET_PRICING: Record<
  BookingCategory,
  Record<VideoCreatorType, Partial<Record<VideoDuration, number>>>
> = {
  // 1. Video Review Sản Phẩm Trên Tay (Gắn giỏ hàng)
  review: {
    ai: {
      '1_min': 180000,
      '2_min': 300000,
      '3_min': 450000,
      '5_min': 750000,
      '10_min': 1200000
    },
    human: {
      '1_min': 650000,
      '2_min': 1100000,
      '3_min': 1500000,
      '5_min': 2400000,
      '10_min': 4200000
    }
  },
  // 2. Video Sáng Tạo Nội Dung Thông Thường
  normal_video: {
    ai: {
      '1_min': 150000,
      '2_min': 250000,
      '3_min': 350000,
      '5_min': 550000,
      '10_min': 950000
    },
    human: {
      '1_min': 500000,
      '2_min': 850000,
      '3_min': 1200000,
      '5_min': 1900000,
      '10_min': 3200000
    }
  },
  // 3. Skit / Tiểu Phẩm Kịch Hài Tình Huống Viral
  viral_drama: {
    ai: {
      '1_min': 220000,
      '2_min': 380000,
      '3_min': 550000,
      '5_min': 900000,
      '10_min': 1600000
    },
    human: {
      '1_min': 800000,
      '2_min': 1350000,
      '3_min': 1800000,
      '5_min': 3000000,
      '10_min': 5200000
    }
  },
  // 4. Video UGC Chạy Quảng Cáo Spark Ads
  ugc_ads: {
    ai: {
      '1_min': 250000,
      '2_min': 400000,
      '3_min': 600000,
      '5_min': 950000,
      '10_min': 1700000
    },
    human: {
      '1_min': 900000,
      '2_min': 1500000,
      '3_min': 2200000,
      '5_min': 3400000,
      '10_min': 5800000
    }
  },
  // 5. Check-in Trải Nghiệm Tại Điểm Bán / Quán Ăn
  checkin: {
    ai: {
      '1_min': 350000,
      '2_min': 550000,
      '3_min': 750000,
      '5_min': 1200000,
      '10_min': 2000000
    },
    human: {
      '1_min': 900000,
      '2_min': 1400000,
      '3_min': 1800000,
      '5_min': 2800000,
      '10_min': 4900000
    }
  },
  // 6. KOC Livestream Cùng Chủ Shop
  livestream_cohost: {
    ai: {
      '1_min': 500000,
      '2_min': 800000,
      '3_min': 1200000,
      '5_min': 1800000,
      '10_min': 2800000
    },
    human: {
      '1_min': 1500000,
      '2_min': 2200000,
      '3_min': 2800000,
      '5_min': 4000000,
      '10_min': 6500000
    }
  },
  // 7. Video AI Đa Ngôn Ngữ (Global AI)
  ai_multilingual: {
    ai: {
      '1_min': 290000,
      '2_min': 450000,
      '3_min': 590000,
      '5_min': 990000,
      '10_min': 1800000
    },
    human: {
      '1_min': 1200000,
      '2_min': 1900000,
      '3_min': 2500000,
      '5_min': 3800000,
      '10_min': 6200000
    }
  },
  // 8. Đặt Link Bio
  bio_link: {
    ai: {
      '1_min': 300000,
      '2_min': 400000,
      '3_min': 500000,
      '5_min': 700000,
      '10_min': 1000000
    },
    human: {
      '1_min': 600000,
      '2_min': 800000,
      '3_min': 1000000,
      '5_min': 1500000,
      '10_min': 2200000
    }
  },
  // 9. Chụp Ảnh Sản Phẩm & Thiết Kế Banner Gian Hàng
  photo_graphic: {
    ai: {
      '1_min': 90000,
      '2_min': 150000,
      '3_min': 220000,
      '5_min': 380000,
      '10_min': 600000
    },
    human: {
      '1_min': 300000,
      '2_min': 500000,
      '3_min': 750000,
      '5_min': 1200000,
      '10_min': 2000000
    }
  }
};

// Trạng thái Ký Quỹ Escrow 3 Bên
export type EscrowStatus = 
  | 'pending_escrow'       // Chờ bên thuê nạp tiền ký quỹ
  | 'escrow_locked'        // Tiền đã khóa an toàn trong két sàn, chờ KOC nhận
  | 'in_progress'          // KOC đang quay dựng video
  | 'demo_submitted'       // KOC đã nộp video demo, trong giai đoạn bảo hành & nghiệm thu 3 ngày (72h)
  | 'disbursed'            // Đã nghiệm thu thành công, tiền đã chuyển cho KOC
  | 'disputed'             // Đang khiếu nại, chờ Admin trọng tài phân xử
  | 'refunded';            // Đã hoàn tiền cho bên thuê

// Lịch sử đề xuất xin gia hạn thời gian bàn giao (Cần sự đồng thuận 2 bên)
export interface ContractExtensionHistory {
  requestedAt: string;
  days: number;
  reason: string;
  status: 'accepted' | 'rejected';
  resolvedAt?: string;
  responseNote?: string;
}

// Lịch sử tin nhắn trao đổi hợp đồng bảo mật (Lưu trữ vĩnh viễn không được xóa)
export interface EscrowChatMessage {
  id: string;
  contractId: string;
  sender: 'client' | 'koc' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAuditPinned?: boolean;
}

// Hợp Đồng Ký Quỹ Booking Trung Gian 3 Bên
export interface EscrowBookingContract {
  id: string;
  contractCode: string;       // vd: ESC-2026-8899
  clientName: string;         // Tên bên thuê (Brand / Shop)
  clientAvatar: string;
  kocName: string;            // Tên KOC được book
  kocHandle: string;          // @koc_handle kênh TikTok
  kocAvatar: string;
  title: string;
  category: BookingCategory;
  creatorType?: VideoCreatorType; // 'human' (Người Thật) | 'ai' (AI Creator)
  videoDuration?: VideoDuration;  // '1_min' | '2_min' | '3_min' | '5_min' | '10_min'
  videoQuantity: number;      // 1, 2, 3, 5, 10 video
  totalEscrowAmount: string;  // Tổng tiền ký quỹ đang khóa (vd: 1,500,000đ)
  pricePerVideo: string;
  productName: string;
  requirements: string;
  deadlineDays: number;
  warrantyDays?: number;      // Thời hạn bảo hành nghiệm thu: Mặc định 3 ngày (72 giờ)
  autoReleaseHoursLeft?: number; // Số giờ đếm ngược tự động giải ngân: Mặc định 72h
  industrySector?: string;         // Lĩnh vực ngành hàng (Mỹ phẩm, Thời trang, v.v.)
  deliverableType?: string;        // Thể loại bàn giao (Video review, Đánh giá, Giới thiệu, Bộ ảnh, Livestream)
  floorUnitPrice?: number;         // Giá sàn mặc định thị trường (VNĐ)
  agreedUnitPrice?: number;        // Giá deal thỏa thuận giữa 2 bên (VNĐ, >= floorUnitPrice)
  deliveryDeadlineDate?: string;   // Ngày giờ bàn giao cụ thể (VD: "2026-09-18 18:00")
  sampleTrackingCode?: string;     // Mã vận đơn gửi mẫu
  usageRightsDays?: number;        // Quyền sử dụng quảng cáo Spark Ads (30, 60, 90 ngày)
  status: EscrowStatus;
  demoVideoUrl?: string;
  demoNote?: string;
  demoSubmittedAt?: string;
  disbursedAt?: string;
  disputeReason?: string;
  createdAt: string;

  // ===== GIA HẠN THỜI GIAN BÀN GIAO (Đồng thuận 2 bên) =====
  extensionRequested?: boolean;
  extensionDays?: number;
  extensionReason?: string;
  extensionStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
  extensionHistory?: ContractExtensionHistory[];

  // ===== ĐÁNH GIÁ & NGHIỆM THU CỦA BÊN THUÊ =====
  clientRating?: number;           // 1 - 5 sao
  clientReview?: string;           // Lời nhận xét đánh giá
  clientApprovedAt?: string;       // Thời gian bấm nghiệm thu

  // ===== NIÊM PHONG KÉT & TRUNG TÂM XỬ LÝ SỰ CỐ / HOÀN TIỀN =====
  freezeStatus?: 'none' | 'frozen_by_client' | 'frozen_by_koc' | 'under_arbitration';
  freezeReason?: string;
  revisionCount?: number;          // Số lần yêu cầu sửa kịch bản (tối đa 2)
  revisionNote?: string;
  refundRequested?: boolean;
  refundReason?: string;
  refundRequestedBy?: 'client' | 'koc';

  // ===== BỔ SUNG THÔNG TIN ĐỐI SOÁT & PHỤ LỤC HỢP ĐỒNG RIÊNG 2 BÊN =====
  clientPhone?: string;            // Số điện thoại / Zalo bên thuê
  clientAddress?: string;          // Địa chỉ doanh nghiệp / người gửi mẫu
  sampleReturnAddress?: string;    // Địa chỉ KOC nhận hàng mẫu hoặc trả hàng
  customIndustryName?: string;     // Tên ngành hàng tùy chỉnh (nếu chọn 'Khác')
  customDeliverableName?: string;  // Tên thể loại bàn giao tùy chỉnh (nếu chọn 'Khác')
  customAnnexTerms?: string;       // Điều khoản bổ sung riêng / Phụ lục hợp đồng do 2 bên thỏa thuận
  customDeliveryNotes?: string;    // Yêu cầu riêng về bàn giao, thiết bị quay, trang phục, kịch bản
  kocSignedAt?: string;            // Thời điểm KOC ký điện tử nhận hợp đồng
  clientSignedAt?: string;         // Thời điểm Bên Thuê ký điện tử khóa cọc
}

// Đơn giá bên Mua Chiến Dịch / Mua Gói (Buyer Cost Per Action - 100% Ngân Sách)
export const BUYER_ACTION_COSTS = {
  FOLLOW: 500,            // 1 Follower thật: 500 Xu
  LIKE: 250,              // 1 Lượt thả tim: 250 Xu
  COMMENT: 500,           // 1 Comment seeding giỏ hàng: 500 Xu
  SHARE: 600,             // 1 Lượt chia sẻ: 600 Xu
  BOOKMARK: 300,          // 1 Lượt lưu video: 300 Xu
  WATCH_15S: 250,         // 1 Lượt xem 15s chuẩn thuật toán: 250 Xu
  LIVE_SESSION_3M: 3000,  // 1 Mắt live 3-5 phút: 3,000 Xu
  LIVE_HEART: 250,        // 1 Lượt thả tim phòng live: 250 Xu
  LIVE_COMMENT: 500,      // 1 Lượt comment phòng live: 500 Xu
  LIVE_SHARE: 600         // 1 Lượt share phòng live: 600 Xu
};

// Phần thưởng bên Làm Nhiệm Vụ (Worker Pool: đúng 40% ngân sách chiến dịch)
// 60% còn lại dùng chi trả Tiếp thị liên kết (Affiliate 20%), Hệ thống & Bảo hành chống tụt (20%), Lợi nhuận sàn & Dự phòng rủi ro (20%)
export const TASK_ACTION_REWARDS = {
  FOLLOW: 200,            // 40% của 500 Xu (Bên mua trả 500 Xu)
  LIKE: 100,              // 40% của 250 Xu (Bên mua trả 250 Xu)
  COMMENT: 200,           // 40% của 500 Xu (Bên mua trả 500 Xu)
  SHARE: 240,             // 40% của 600 Xu (Bên mua trả 600 Xu)
  BOOKMARK: 0,            // 0 Xu (Lưu yêu thích không tính xu theo chính sách)
  WATCH_40S: 200,         // Xem video 40s trung bình (+200 Xu = 40% của ngân sách 500 Xu)
  WATCH_15S: 200,         // Tương thích ngược
  TOTAL_COMBO: 940,       // Trọn bộ video đầy đủ các hành động có thưởng Xu
  // Phần thưởng phòng Live (40%):
  LIVE_EYE_30S: 80,       // Gói xem Live 30s: 80 Xu (40% của 200 Xu)
  LIVE_EYE_SESSION: 400,  // 40% của 1,000 Xu (Mốc 3 phút)
  LIVE_HEART_TAP: 100,    // 40% của 250 Xu
  LIVE_COMMENT: 200,      // 40% của 500 Xu
  LIVE_SHARE: 240         // 40% của 600 Xu
};

// Bảng đơn giá mắt xem livestream linh hoạt theo thời gian (Bên mua trả trước 100% vs Worker nhận 40% khi xem đủ phút)
export interface LivestreamFlexibleDurationTier {
  minutes: number;
  label: string;
  description: string;
  buyerPricePerEye: number;    // Đơn giá bên mua trả cho 1 mắt xem (Xu)
  workerRewardPerEye: number;  // Số Xu người xem nhận được khi xem đủ 100% số phút (40%)
}

export const FLEXIBLE_LIVESTREAM_TIERS: LivestreamFlexibleDurationTier[] = [
  {
    minutes: 0.5,
    label: '30 Giây',
    description: 'Hook 30s siêu tốc, kích hoạt chỉ số giữ chân tức thì',
    buyerPricePerEye: 200,
    workerRewardPerEye: 80    // 200 * 0.4 = 80 Xu
  },
  {
    minutes: 1,
    label: '1 Phút',
    description: 'Hook 60s đầu, kéo mắt tức thì kích nổ đề xuất',
    buyerPricePerEye: 350,
    workerRewardPerEye: 140   // 350 * 0.4 = 140 Xu
  },
  {
    minutes: 3,
    label: '3 Phút',
    description: 'Đẩy thuật toán FYP Livestream đề xuất top ngành',
    buyerPricePerEye: 1000,
    workerRewardPerEye: 400   // 1,000 * 0.4 = 400 Xu
  },
  {
    minutes: 10,
    label: '10 Phút',
    description: 'Giữ chân khách chốt deal giỏ hàng TikTok Shop',
    buyerPricePerEye: 3000,
    workerRewardPerEye: 1200  // 3,000 * 0.4 = 1,200 Xu
  },
  {
    minutes: 30,
    label: '30 Phút',
    description: 'Bão mắt xem đại tiệc Flash Sale cao điểm',
    buyerPricePerEye: 9000,
    workerRewardPerEye: 3600  // 9,000 * 0.4 = 3,600 Xu
  },
  {
    minutes: 60,
    label: '60 Phút',
    description: 'Trọn vẹn ca live bán hàng chốt đơn tiền tỷ',
    buyerPricePerEye: 18000,
    workerRewardPerEye: 7200  // 18,000 * 0.4 = 7,200 Xu
  }
];

// Chính sách Tặng Thưởng Giới Thiệu Bạn Bè (Referral Economics)
// Tặng 5,000 Xu cho người mời và 5,000 Xu cho người được mời (chống spam: yêu cầu người mới hoàn thành 1 nhiệm vụ)
export const REFERRAL_BONUS_COINS = 5000; // 5,000 Xu (= 5,000 VNĐ)

// Thông báo Phát Live Cộng Đồng (Khi Người Mua Gói mở phòng Live & dán link)
export interface LiveBroadcastNotification {
  id: string;
  orderId: string;
  buyerName: string;
  buyerHandle: string;
  buyerAvatar: string;
  roomTitle: string;
  targetLiveUrl: string;
  packageTitle: string;
  targetEyes: number;
  deliveredEyes: number;
  targetHearts: number;
  deliveredHearts: number;
  targetComments: number;
  deliveredComments: number;
  rewardPerWatcherCoins: number;
  requiredMinutes: number;
  startTime: string;
  isActive: boolean;
}

// Đơn hàng mua gói dịch vụ từ Sàn
export interface ServiceOrder {
  id: string;
  packageId: string;
  packageTitle: string;
  category: string;
  price: string;
  targetUrl: string;          // Link kênh TikTok hoặc link video/live
  targetQuantity: number;
  completedQuantity: number;
  status: 'processing' | 'running' | 'completed' | 'refunded';
  createdAt: string;
  isAdminGrant?: boolean;
  // Live Broadcast Delivery Tracking (Dành cho người mua gói mắt xem live)
  isLivePackage?: boolean;
  liveBroadcastActive?: boolean;
  liveUrl?: string;
  broadcastRoomTitle?: string;
  deliveredEyes?: number;
  targetEyes?: number;
  deliveredHearts?: number;
  targetHearts?: number;
  deliveredComments?: number;
  targetComments?: number;
  refundedAmount?: number;
  refundedPercent?: number;
  refundReason?: string;
}

// Người Dùng Dành Cho Trang Quản Trị Admin Toàn Diện
export interface AdminUserManagementItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email: string;
  phone: string;
  tiktokConnected: string;
  tiktokFollowers: number;
  isTikTokVerified: boolean;
  rankLevel: MissionRank | string;
  coinsBalance: number;
  tokenBalance: number;
  completedTasksCount: number;
  createdCampaignsCount: number;
  purchasedPackagesCount: number;
  escrowLockedAmountVND: string;
  status: 'active' | 'banned';
  hasAllPermissions?: boolean;        // Toàn quyền hệ thống, không bao giờ bị khóa, làm mọi nhiệm vụ không giới hạn
  isWhitelisted?: boolean;           // Tài khoản đặc cách VIP từ Admin
  grantedCoinsTotal?: number;        // Tổng số Xu đã được Admin cấp riêng
  grantedPackagesTotal?: number;     // Tổng số gói dịch vụ Admin đã cấp riêng
  grantedByAdminAt?: string;         // Thời điểm Admin cấp quyền
  canRunAnyCampaign?: boolean;       // Quyền tạo và chạy bất kỳ chiến dịch nào
  canFollowCrossUnrestricted?: boolean; // Quyền lướt follow chéo không giới hạn
  kycStatus: KycStatus;
  kycData?: KycVerificationData;
  joinedDate: string;
  registrationSource?: 'direct' | 'link';
  referredBy?: string;
  firstTaskCompleted?: boolean;
  facebookConnected?: string;
  facebookProfileUrl?: string;
  facebookName?: string;
  facebookBio?: string;
  facebookLastSyncedAt?: string;
  isFacebookVerified?: boolean;
  facebookFollowers?: number;
  facebookAvatar?: string;
  youtubeConnected?: string;
  youtubeProfileUrl?: string;
  youtubeChannelTitle?: string;
  youtubeVideoCount?: number;
  youtubeLastSyncedAt?: string;
  isYoutubeVerified?: boolean;
  youtubeSubscribers?: number;
  youtubeAvatar?: string;
  tiktokAvatar?: string;
  tiktokNickname?: string;
  tiktokLikes?: number;
  tiktokFollowing?: number;
  tiktokVideoCount?: number;
  tiktokBio?: string;
  tiktokLastSyncedAt?: string;
  orders?: ServiceOrder[];
  referralCount?: number;
  referralEarningsVND?: string;
}

// Cấu hình tỷ lệ hoa hồng & ăn chia toàn hệ thống
export interface PlatformCommissionSettings {
  affiliateRatePercent: number;      // Mặc định 25% (0-100%)
  escrowFeePercent: number;          // Mặc định 20% (0-100%)
  taskRewardPoolPercent: number;     // Mặc định 80% (0-100%)
  platformReservePercent: number;    // Mặc định 15% (0-100%)
  disbursementTime?: string;         // e.g. "10:00 Sáng Thứ Hai"
  processingTime?: string;           // e.g. "Trong vòng 24 giờ"
  minWithdrawAmount?: number;        // e.g. 200000
  withdrawFeePercent?: number;       // e.g. 5
}

// Hồ sơ đăng ký KOC nhận booking
export interface KocProfileApplication {
  id: string;
  kocName: string;
  tiktokHandle: string;
  avatar: string;
  followersCount: number;
  category: string;                  // Review, Mỹ phẩm, Thời trang...
  pricePerVideoVND: string;
  sampleVideoUrl: string;
  bioDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Nhiệm vụ xem Livestream TikTok
export interface LivestreamTaskItem {
  id: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  roomTitle: string;
  platform?: 'tiktok' | 'youtube' | 'facebook';
  currentViewers: number;
  targetMinutes: number;         // 3, 5, 10, 15 phút
  rewardPerMinute: number;       // Xu/phút
  milestoneBonusCoins: number;   // Thưởng hoàn thành mốc (vd: 300, 500, 1500 Xu)
  totalRewardCoins: number;      // Tổng Xu nhận được
  targetUrl: string;
  status: 'live' | 'ended';
  remainingSlots?: number;
  tags: string[];
  category?: string;             // 'TikTok Shop Flash Sale' | 'KOC Review' | 'Thời Trang' | 'Công Nghệ'
  hostFollowers?: string;        // '250K followers'
  requiredRank?: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  isLocked?: boolean;            // Trạng thái khóa lũy tiến
  unlockedAfterTaskId?: string;  // ID nhiệm vụ cần hoàn thành trước để mở khóa
  dailyTierLevel?: number;       // Mức cấp độ thử thách (1, 2, 3, 4, 5, 6, 7)
}

// 24+ Gói dịch vụ Booking & Xây kênh
export interface GrowthServiceItem {
  id: string;
  title: string;
  platform?: 'tiktok' | 'facebook' | 'youtube';
  category: 'follow' | 'engagement' | 'watch' | 'comment' | 'share' | 'livestream' | 'combo' | 'booking' | 'full_channel' | 'like';
  tag: string;
  price: string;
  originalPrice?: string;
  priceNum: number;
  targetQuantity: number;
  unit: string;
  description: string;
  features: string[];
  benefits?: string[];            // Danh sách đặc quyền & quyền lợi VIP khi kích hoạt gói
  retentionRate?: string;         // Tỷ lệ giữ chân thuật toán (vd: "95% - 98% Retention Rate")
  bonusGifts?: string[];          // Quà tặng đính kèm (vd: Tặng 100% Lượt Xem Tự Nhiên)
  weeklySlotBonus?: number;       // Số slot nhiệm vụ tuần được cộng thêm (+2, +4, +6)
  watchDurationNote?: string;     // Ghi chú thời lượng xem (40s-60s hoặc Tự nhiên)
  estimatedDelivery: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  thumbnail: string;
}

export type CampaignType = 
  | 'follow' 
  | 'watch' 
  | 'like' 
  | 'comment' 
  | 'share' 
  | 'livestream' 
  | 'booking_review'
  | 'like_comment'
  | 'livestream_viewers'
  | 'affiliate_sales'
  | 'product_launch'     // Chiến dịch Tung Sản Phẩm Mới (Launch Viral)
  | 'mega_live'          // Đại Tiệc Mega Livestream Doanh Nghiệp
  | 'multi_target';

// Báo cáo đo lường chi tiết tệp khán giả chiến dịch (Mở khóa tốn 200,000 Xu, Admin xem miễn phí)
export interface CampaignDemographicsReport {
  totalViewers: number;
  realUserScore: number; // Điểm số tài khoản thật 100% người dùng KYC (vd: 98.7)
  genderDistribution: {
    male: number;      // % Nam
    female: number;    // % Nữ
    other: number;     // % Khác
  };
  ageGroups: {
    '18-24': number;   // %
    '25-34': number;   // %
    '35-44': number;   // %
    '45+': number;     // %
  };
  topLocations: {
    province: string;
    percentage: number;
    viewerCount: number;
  }[];
  interestNiches: {
    niche: string;
    percentage: number;
  }[];
  engagementRate: number;       // % Tỷ lệ tương tác thực
  avgWatchSeconds: number;      // Thời gian xem trung bình
  peakLiveViewers?: number;     // Đỉnh mắt xem đồng thời (với Mega Live)
  generatedRevenueEstimateVND?: string; // Ước tính GMV tạo ra
  accuracyLevel: string;        // 'Chuẩn xác 100% đối soát từ KYC'
  lastUpdatedAt: string;
}

export interface MultiTargetConfig {
  type: 'follow' | 'watch' | 'like' | 'comment' | 'share' | 'livestream';
  label: string;
  targetQuantity: number;
  completedQuantity: number;
  unitPriceXu: number;
  totalXu: number;
  livestreamMinutes?: number;
}

// Cấu hình định vị tệp khách hàng mục tiêu cho chiến dịch
export type CampaignTargetDeliveryMode = 'mass_broad' | 'niche_targeted';

export interface CampaignAudienceTargeting {
  mode: CampaignTargetDeliveryMode; // 'mass_broad': Phủ toàn sàn, 'niche_targeted': Đúng ngách thị trường
  gender?: 'all' | 'male' | 'female';
  ageRanges?: string[]; // ['18-24', '25-34', '35-44', '45+']
  regions?: string[]; // ['all', 'mien_bac', 'mien_trung', 'mien_nam', 'hanoi', 'hcm', ...]
  interests?: string[]; // ['Mỹ phẩm & Làm đẹp', 'Thời trang', 'Công nghệ', 'Ẩm thực', 'Gia dụng', 'Sức khỏe', ...]
  viewingHabits?: string[]; // ['Reviewer TikTok Shop', 'Livestream bán hàng', 'ASMR Ăn uống', 'Drama giải trí', 'Tips công nghệ']
  targetCriteriaSummary?: string;
  estimatedAudienceSize?: number; // Ước tính quy mô tệp phù hợp
  productName?: string;          // Tên sản phẩm tung ra
  productPrice?: string;         // Giá niêm yết
  scheduledBroadcastTime?: string; // Ngày & giờ phát sóng Mega Live
  pinnedOffer?: string;          // Ưu đãi ghim trong phiên live
}

// Chiến dịch do khách hàng tạo
export interface CampaignItem {
  id: string;
  title: string;
  platform?: 'tiktok' | 'facebook' | 'youtube';
  type: CampaignType;
  channelName?: string;
  channelHandle: string;
  channelAvatar?: string;
  channelUrl?: string;
  fanpageUrl?: string;
  targetUrl: string;
  targetQuantity: number;
  completedQuantity: number;
  budgetTotal: string;
  pricePerAction: string;
  status: 'pending' | 'running' | 'completed' | 'paused';
  createdAt: string;
  instructions: string;
  livestreamMinutes?: number;
  multiTargets?: MultiTargetConfig[];
  audienceTargeting?: CampaignAudienceTargeting;
  videoPreviewUrl?: string;
  demographicsReport?: CampaignDemographicsReport;
  isAnalyticsUnlocked?: boolean; // True nếu người dùng đã trả 200,000 Xu để xem phân tích chi tiết
  isBoosted?: boolean; // True nếu chiến dịch được đẩy lên Top sàn (100.000 Xu)
  boostedAt?: string; // Thời điểm đẩy Top
  boostCount?: number; // Số lần đẩy Top
  creatorEmail?: string; // Email người tạo chiến dịch (cách ly quyền riêng tư)
  creatorId?: string; // User ID người tạo
  creatorHandle?: string; // Handle người tạo
}

// Bảng khung hình phạt & chế tài xử lý vi phạm hợp đồng KOC Escrow
export interface KocContractPenaltyTier {
  level: 1 | 2 | 3 | 4;
  title: string;
  severity: 'Nhẹ' | 'Trung Bình' | 'Nghiêm Trọng' | 'Đặc Biệt Nghiêm Trọng';
  badgeColor: string;
  violationDescription: string;
  penaltyAction: string;
  financialPenalty: string;
  accountConsequence: string;
}


// Mục bạn bè được giới thiệu (Referral Item)
export interface ReferralItem {
  id: string;
  username: string;
  avatar: string;
  joinedDate: string;
  tiktokHandle?: string;
  hasCompletedTask: boolean; // Đã hoàn thành ít nhất 1 nhiệm vụ để kích hoạt chống spam
  taskCompletedType?: string; // vd: 'Follow kênh', 'Xem video 15s', 'Xem live 3m'
  status: string;
  bonusCoins: number; // 5,000 Xu
  isClaimed: boolean;
  packageSpentVND?: string; // Tổng tiền bạn bè đã mua gói / nạp tiền
  earnedVND: string; // Hoa hồng 25% tiền mặt nhận được từ đơn hàng
}

// Cấp bậc hoa hồng Affiliate theo quy mô cộng đồng (20% - 35% • Nhận 1 lần duy nhất)
export interface AffiliateTierInfo {
  tierId: string;
  name: string;
  badge: string;
  minMembers: number;
  maxMembers: number;
  ratePercent: number;
  description: string;
}

// Dữ liệu Tiếp thị liên kết & Giới thiệu bạn bè (Affiliate & Referral Hub)
export interface AffiliateStats {
  refCode: string;
  refLink: string;
  totalClicks: number;
  totalSignups: number;
  // 1. Quỹ Xu Giới Thiệu (5,000 Xu / bạn kích hoạt nhiệm vụ)
  referralBonusCoinsTotal: number; // Tổng số Xu đã nhận từ giới thiệu
  referralPendingCoins: number;   // Số Xu đang chờ bạn bè làm nhiệm vụ
  referralActivatedCount: number; // Số người đã kích hoạt làm nhiệm vụ
  referralPendingCount: number;   // Số người đang chờ làm nhiệm vụ
  // 2. Quỹ Hoa Hồng Mua Gói (20% - 35% VNĐ, nhận 1 lần duy nhất)
  totalCommissionVND: string;
  commissionRate: string;
  tier: 'Bạc' | 'Vàng' | 'Bạch Kim' | 'Kim Cương';
  monthlyCommission: string;
  referralsList: ReferralItem[];
}

// Bảng điều khiển Admin
export interface AdminDashboardData {
  totalFollowsDelivered: number;
  activeCampaignsCount: number;
  totalTokensCirculating: number;
  totalRevenueVND: string;
  pendingApprovalsCount: number;
  fraudAlertsCount: number;
  totalTokensBurned: number;
  totalEscrowLockedVND: string;
  totalRegisteredUsers: number;
  campaignsQueue: {
    id: string;
    client: string;
    type: string;
    quantity: number;
    amount: string;
    status: 'Chờ duyệt' | 'Đang chạy' | 'Hoàn thành';
    date: string;
  }[];
}

export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'earn' | 'deposit' | 'withdraw' | 'spend' | 'burn' | 'wheel' | 'escrow_lock' | 'escrow_payout' | 'admin_grant';
  title: string;
  amount: string;
  isPositive: boolean;
  date: string;
  exactTime?: string;
  balanceAfter?: number;
  missionType?: string;
  missionName?: string;
  method?: string;
  status?: 'success' | 'pending' | 'rejected';
}

// Báo cáo phân tích thu nhập & thời gian xem
export interface LiveWatchHistoryItem {
  id: string;
  roomTitle: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  minutesWatched: number;
  coinsEarned: number;
  timestamp: string;
  verifiedHuman: boolean;
  tapsCount: number;
}

export interface UserAnalyticsData {
  todayWatchMinutes: number;
  todayVideosWatched: number;
  retentionScore: number;
  completedToday: number;
  todayEarningsCoins: number;
  weeklyEarningsCoins: number;
  monthlyEarningsCoins: number;
  todayLiveMinutes: number;
  todayLiveSessionsCompleted: number;
  todayLiveCoinsEarned: number;
  liveRetentionRate: number;
  liveWatchHistory: LiveWatchHistoryItem[];
  incomeBreakdown: {
    followPercent: number;
    likePercent: number;
    commentPercent: number;
    sharePercent: number;
    livestreamPercent: number;
    affiliatePercent: number;
  };
  dailyStreak: number;
  checkedInToday: boolean;
}

// Cơ chế Tokenomics & Đốt Token
export interface TokenomicsData {
  tokenPriceVND: number;
  priceChange24h: number;
  totalCirculation: number;
  totalBurned: number;
  burnRatePercent: number;
  deflationRate: string;
  marketCapVND: string;
  burnHistory: {
    id: string;
    campaignTitle: string;
    tokensBurned: number;
    timestamp: string;
  }[];
  priceHistory: {
    time: string;
    price: number;
  }[];
}

// Trạng Thái Xác Minh Danh Tính (KYC Verification)
export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KycVerificationData {
  userId: string;
  userEmail: string;
  fullName: string;
  idNumber: string;               // Số CCCD / Hộ chiếu (12 số)
  dateOfBirth: string;
  frontIdCardUrl: string;         // Link ảnh mặt trước CCCD
  backIdCardUrl: string;          // Link ảnh mặt sau CCCD
  selfiePhotoUrl?: string;        // Link ảnh chụp selfie khuôn mặt cá nhân (cầm CCCD / chụp rõ nét)
  bankName: string;               // Tên ngân hàng nhận tiền
  bankAccountNumber: string;      // Số tài khoản ngân hàng
  bankAccountHolder: string;      // Tên chủ tài khoản (phải trùng tên CCCD)
  submittedAt: string;
  reviewedAt?: string;
  status: KycStatus;
  rejectionReason?: string;
  isCitizenIdUnique?: boolean;    // Chống trùng lặp CCCD, mỗi người chỉ 1 tài khoản
}

// Ứng dụng & Phần mềm Xây Kênh TikTok (Chợ Marketplace Phần Mềm)
export interface SoftwareAppItem {
  id: string;
  title: string;
  category: 'ai_script' | 'video_tools' | 'analytics' | 'growth_auto' | 'tiktok_shop';
  tag: string;
  priceXu: number;                // Giá Xu (1 Xu = 1 VNĐ, vd: 500,000 Xu = 500k)
  tokenPrice?: number;            // Hỗ trợ tương thích cũ
  fiatPriceVND?: string;          // vd: "500,000đ"
  rating: number;
  reviewCount: number;
  downloadsCount: number;
  description: string;
  highlights: string[];
  features: string[];
  thumbnail: string;
  version: string;
  developer: string;
  platformCompatibility: string[];
  badge?: string;
  downloadUrl?: string;           // Link tải / trải nghiệm phần mềm
}

// Đơn hàng mua bản quyền Phần mềm / App
export interface AppLicensePurchase {
  id: string;
  appId: string;
  appTitle: string;
  licenseKey: string;
  xuPaid: number;                 // Số Xu đã thanh toán
  tokenPaid?: number;             // Hỗ trợ tương thích cũ
  purchasedAt: string;
  expiryDate: string;             // 'Trọn đời (Lifetime)' | '1 Năm'
  status: 'active' | 'revoked';
  downloadUrl: string;
}

// Sổ Cái Biến Động Token Minh Bạch (Token Ledger Record)
export interface TokenLedgerRecord {
  id: string;
  userId: string;
  userEmail: string;
  type: 
    | 'task_reward'          // Thưởng làm nhiệm vụ (Sàn cấp)
    | 'affiliate_bonus'      // Hoa hồng giới thiệu
    | 'buy_software_app'     // Mua phần mềm / app xây kênh
    | 'buy_growth_package'   // Mua gói dịch vụ (Follow, Tim, Live)
    | 'convert_vnd_to_token' // Nạp tiền VNĐ đổi lấy Token
    | 'convert_token_to_vnd' // Rút tiền: Đổi Token sang VNĐ
    | 'withdraw_cashout'     // Rút tiền mặt về tài khoản ngân hàng
    | 'platform_boost_fee'   // Phí dịch vụ đẩy top sàn (+50.000 Xu)
    | 'escrow_lock'          // Khóa ký quỹ hợp đồng KOC
    | 'admin_mint'           // Admin đúc / cấp thêm Xu vào quỹ sàn
    | 'admin_burn'           // Admin triệt tiêu / đốt Xu
    | 'admin_grant'          // Admin cấp token trực tiếp cho user
    | 'admin_adjust';        // Admin điều chỉnh
  tokenAmount: number;       // Số token (+ hoặc -)
  vndValue: string;          // Giá trị quy đổi VNĐ tương ứng
  note: string;
  createdAt: string;
}

// Bảng Sổ Cái & Phân Phối Token Toàn Diện (7 Chỉ Số Minh Bạch)
export interface TokenSupplyLedger {
  initialSupply: number;        // 1. Tổng Cung do Admin cấp ban đầu
  circulatingSupply: number;    // 2. Tổng Xu đã phân phối ra thị trường
  userHoldings: number;         // 3. Tổng Xu người dùng đang nắm giữ trong ví
  withdrawnVND: number;         // 4. Tổng Xu đã chuyển đổi thành tiền mặt / rút ATM
  spentOnAppsPackages: number;  // 5. Tổng Xu đã tiêu thụ vào mua phần mềm, gói & dịch vụ
  burnedTokens: number;         // 6. Tổng Xu đã đốt / triệt tiêu khỏi lưu thông
  treasuryRemaining: number;    // 7. Tổng Xu còn lại trong Kho Quỹ Sàn (Chưa phát hành)
}

// Hồ sơ người dùng & Ví Token
export interface UserProfileWallet {
  name: string;
  handle: string;
  avatar: string;
  email?: string;
  phone?: string;
  isAdmin?: boolean;
  role: string;
  tiktokConnected: string;
  tiktokHandle?: string;
  tiktokProfileUrl?: string; // Link trực tiếp trang TikTok
  tiktokFollowers: number;
  tiktokFollowingCount?: number; // Số lượng Đang theo dõi (Phục vụ đối soát delta 2 chiều)
  tiktokAvatar?: string;
  tiktokNickname?: string;
  tiktokLikes?: number;
  tiktokBio?: string;
  tiktokLastSyncedAt?: string;
  isTikTokVerified: boolean;
  facebookConnected?: string;
  facebookProfileUrl?: string;
  facebookType?: 'personal' | 'fanpage' | 'group';
  facebookAvatar?: string;
  facebookName?: string;
  facebookBio?: string;
  facebookLastSyncedAt?: string;
  isFacebookVerified?: boolean;
  facebookFollowers?: number;
  youtubeConnected?: string;
  youtubeProfileUrl?: string;
  youtubeAvatar?: string;
  youtubeChannelTitle?: string;
  youtubeVideoCount?: number;
  youtubeDescription?: string;
  youtubeLastSyncedAt?: string;
  isYoutubeVerified?: boolean;
  youtubeSubscribers?: number;
  bioVerificationCode: string;
  isNewUserBonusClaimed?: boolean;
  withdrawCount?: number; // Số lần đã rút tiền (Lần 1 miễn phí, lần 2 trở đi phí 5% & bắt buộc KYC)
  avaliveCoins: number;
  totalEarnedCoins?: number;
  coinsValueVND: string;
  tokenBalance: number;
  usdtBalance: number;
  fiatVND: string;
  completedTasksCount: number;
  dailyTasksCompleted: number;
  dailyTasksLimit: number;
  luckyWheelFreeSpins?: number;
  createdCampaignsCount: number;
  rankLevel: MissionRank | string;
  kycStatus: KycStatus;
  kycData?: KycVerificationData;
  citizenId?: string;
  selfiePhotoUrl?: string;
  id?: string;
  status?: 'active' | 'banned';
  hasAllPermissions?: boolean;        // Toàn quyền hệ thống, không bao giờ bị khóa, làm mọi nhiệm vụ không giới hạn
  isWhitelisted?: boolean;           // Tài khoản đặc cách VIP từ Admin
  grantedCoinsTotal?: number;        // Tổng số Xu đã được Admin cấp riêng
  grantedPackagesTotal?: number;     // Tổng số gói dịch vụ Admin đã cấp riêng
  grantedByAdminAt?: string;         // Thời điểm Admin cấp quyền
  canRunAnyCampaign?: boolean;       // Quyền tạo và chạy bất kỳ chiến dịch nào
  canFollowCrossUnrestricted?: boolean; // Quyền lướt follow chéo không giới hạn
  registrationSource?: 'direct' | 'link';
  referredBy?: string;
  firstTaskCompleted?: boolean;
  purchasedPackagesCount?: number;
  bankInfo?: BankAccountInfo;
  transactions: TransactionRecord[];
  myOrders?: ServiceOrder[];
  myAppLicenses?: AppLicensePurchase[];
}

// Bạn bè mạng xã hội Facebook & Tin nhắn Messenger
export interface CommunityFriendItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  tiktokFollowers?: number;
  status: 'none' | 'pending' | 'friends';
  isOnline: boolean;
  lastActive: string;
}

export interface ChatMessageItem {
  id: string;
  senderHandle: string;
  senderName: string;
  recipientHandle: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export type OpenChatUserInput = CommunityFriendItem | {
  id?: string;
  name: string;
  handle: string;
  avatar: string;
  role?: string;
  tiktokFollowers?: number;
  status?: 'none' | 'pending' | 'friends';
  isOnline?: boolean;
  lastActive?: string;
};

// ===== HỆ THỐNG 10 CẤP BẬC NHIỆM VỤ (10-Tier Mission & Rank System) =====

export type MissionRank = 
  | 'Cấp 1 - Tập Sự'
  | 'Cấp 2 - Khởi Nghiệp'
  | 'Cấp 3 - Năng Động'
  | 'Cấp 4 - Tương Tác'
  | 'Cấp 5 - Tiên Phong'
  | 'Cấp 6 - Chuyên Nghiệp'
  | 'Cấp 7 - Tinh Anh'
  | 'Cấp 8 - Thủ Lĩnh'
  | 'Cấp 9 - Cao Thủ'
  | 'Cấp 10 - Huyền Thoại'
  | 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';

export type MissionType = 'follow' | 'watch' | 'like' | 'comment' | 'share' | 'live' | 'invite' | 'profile' | 'post' | 'streak';
export type MissionCategory = 'daily' | 'weekly' | 'special';

export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface WeeklyMissionDef {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  difficulty: MissionDifficulty;  // 'easy' (Dễ), 'medium' (Trung bình), 'hard' (Khó), 'expert' (Chuyên gia)
  source: 'platform';             // Chiến dịch sàn Avalive độc quyền cấp
  minRank: MissionRank | string;  // Rank tối thiểu để nhận nhiệm vụ này
  accountAgeLevel?: 'newbie' | 'active' | 'veteran'; // Tài khoản mới, hoạt động thường xuyên, thâm niên
  baseRewardXu: number;           // Reward cơ bản (nhân hệ số rank)
  targetCount: number;            // Số lần cần thực hiện
  icon: string;                   // emoji icon
  tags?: string[];
}

export interface MissionSubMilestone {
  step: number;
  label: string;
  targetCount: number;
  isDone: boolean;
  rewardXu: number;    // Xu thưởng riêng cho nhiệm vụ con này (tối thiểu 10.000 Xu ở Cấp 1)
  isClaimed: boolean;  // Đã nhận xu chưa
}

export interface UserWeeklyMission {
  defId: string;                  // ref to WeeklyMissionDef.id
  title: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  source: 'platform';
  rewardXu: number;               // Sau khi nhân hệ số rank + package
  targetCount: number;
  completedCount: number;
  status: 'active' | 'completed' | 'claimed';
  expiresAt: string;              // ISO timestamp
  icon: string;
  tags?: string[];
  subMilestones?: MissionSubMilestone[];
}

export interface RankTierConfig {
  tierNumber: number;             // 1 -> 10
  name: string;                   // 'Cấp 1 - Tập Sự',...
  shortTitle: string;             // 'Tập Sự', 'Tân Binh',...
  badge: string;                  // '🥉 Cấp 1'
  color: string;                  // Tailwind classes
  dailyMissionsCount: number;     // Số lượng nhiệm vụ daily tối đa
  weeklyMissionsCount: number;    // Số lượng nhiệm vụ weekly tối đa
  rewardMultiplier: number;       // Hệ số nhân reward (1.0 -> 3.0)
  wheelSpinsBonus: number;        // Thưởng lượt quay may mắn khi hoàn thành 100%
  minCompletedTasksToUnlock: number; // Điều kiện thăng hạng
  description: string;
  dailyEstimatedEarningsXu: number; // Mức kiếm được trung bình/ngày (tối thiểu từ 100.000 Xu ở Cấp 1)
  dailyTaskRewardTotal: number;      // Thù lao từ các nhiệm vụ trong ngày
  dailyBundleRewardXu: number;       // Thưởng trọn gói hoàn thành 100% nhiệm vụ ngày
  dailyTasksSummary: string;         // Tóm tắt công việc nhiệm vụ ngày
  subMissionRewardXu: number;        // Xu thưởng cho mỗi nhiệm vụ con (sub-milestone), tối thiểu 10.000 ở Cấp 1
  subMissionCompleteBonusXu: number; // Xu thưởng thêm khi hoàn thành TẤT CẢ nhiệm vụ con của 1 nhiệm vụ chính
}

export interface WeeklyMissionConfig {
  weekNumber: number;             // tuần hiện tại
  rankSlots: Record<string, RankTierConfig>;
  packageBonusSlots: Record<string, number>; // gói -> thêm bao nhiêu slot
}

export interface MissionClaimResult {
  success: boolean;
  xuwEarned: number;
  message: string;
}

export interface MissionStreakData {
  dailyCompletedCount: number;
  dailyTotalCount: number;
  isDailyAllClear: boolean;
  dailyBonusClaimed: boolean;
  dailyBonusXu: number;

  weeklyStreakDays: number; // 1-7
  isWeeklyStreakDone: boolean;
  weeklyBonusClaimed: boolean;
  weeklyBonusXu: number;

  monthlyStreakDays: number; // 1-30
  isMonthlyStreakDone: boolean;
  monthlyBonusClaimed: boolean;
  monthlyBonusXu: number;
}

// ===== HỆ THỐNG BẢO MẬT AN TOÀN TUYỆT ĐỐI 7 LỚP (7-Layer Security Architecture) =====
export interface SecurityLayerDef {
  layer: number;
  name: string;
  code: string;
  description: string;
  shieldStatus: 'active' | 'monitoring' | 'blocked';
  blockedCount: number;
  icon: string;
}

export type MarqueeItemType = 'livestream' | 'campaign_video' | 'koc_booking' | 'news_update' | 'security_warning' | 'transaction_alert' | 'rank_up';

export interface MarqueeTickerItem {
  id: string;
  type: MarqueeItemType;
  title: string;
  channelHandle: string;
  targetUrl: string;
  targetQuantity?: number;
  deliveredQuantity?: number;
  rewardText: string;
  hasMarqueeBoost: boolean; // Trả phí 100.000 Xu để lên Bảng Điện LED
  boostCostXu: number;      // 100,000 Xu
  isActive: boolean;
  status: 'live' | 'running' | 'completed' | 'ended';
  startTime: string;
  endedAt?: string;
  priority: number;         // Rank ưu tiên (1 = cao nhất)
  orderId?: string;
  badgeText: string;        // '🔴 TRỰC TIẾP' | '🔥 TOP 1 TRENDING' | '⚡ VIDEO HOT' | '💎 ĐỐI TÁC VIP'
  actionText: string;       // 'Vào Xem Live' | 'Làm Nhiệm Vụ'
  detailedContent?: string; // Nội dung chi tiết hiển thị trong pop-up khi bấm vào
  legalReference?: string;  // Căn cứ pháp lý (Nghị định 15/2020/NĐ-CP...)
  tips?: string;            // Lời khuyên & hướng dẫn thực hiện
}

export interface MarqueeHistoryRecord {
  id: string;
  item: MarqueeTickerItem;
  endedAt: string;
  totalReachedViewers: number;
  totalXuDistributed: number;
  reason: 'livestream_ended' | 'campaign_completed' | 'user_ended';
}

// ===== HỆ THỐNG PHÂN ĐỊNH 3 Ô CHỨC NĂNG & FOLLOW CHÉO CỘNG ĐỒNG =====
export interface CrossFollowItem {
  id: string;
  type: 'follow' | 'like' | 'watch' | 'comment' | 'share';
  title: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  targetUrl: string;
  rewardXu: number;
  category: string;
  followersCount: number;
  completedByUsersCount: number;
  isCompleted?: boolean;
}

export interface DailyTierCrossFollowQuota {
  rank: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  dailyLimit: number;
  rewardMultiplier: number;
  extraExpansionCostXu: number; // Phí mua thêm 20 lượt để triệt tiêu xu
}

// ===== CƠ CHẾ TRIỆT TIÊU & TÁI HẤP THỤ TOKEN XU (TOKEN SINK / BURN) =====
export interface TokenSinkStrategyDef {
  id: string;
  title: string;
  description: string;
  burnRatePercentage?: number;
  burnCostXu?: number;
  category: 'campaign_creation' | 'marquee_boost' | 'quota_expansion' | 'vip_pass' | 'lucky_wheel' | 'withdraw_fee' | 'koc_escrow' | 'live_gifting';
  benefitForUser: string;
  benefitForPlatform: string;
  icon: string;
}

// ===== HỆ THỐNG KHÁNG CÁO GIAN LẬN & MINH BẠCH 2 CHIỀU (Fraud Appeal & 2-Way Audit) =====
export type FraudAppealStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface FraudAppealRecord {
  id: string;
  userId: string;
  userEmail: string;
  userHandle: string;
  taskId?: string;
  taskTitle?: string;
  taskType?: string;
  reasonCategory: 'network_lag' | 'private_account' | 'false_unfollow' | 'browser_restriction' | 'other' | string;
  reasonLabel: string;
  customNote: string;
  proofImageUrls: string[];
  status: FraudAppealStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
  compensationXu?: number;
  restoredTrustScore?: number;
}

export interface CampaignAuditTrailItem {
  id: string;
  timestamp: string;
  taskId: string;
  campaignTitle: string;
  creatorHandle: string;
  workerHandle: string;
  actionType: 'follow' | 'like' | 'comment' | 'share' | 'watch' | 'live';
  rewardXu: number;
  workerFollowingDelta: { before: number; after: number; delta: number; verified: boolean };
  creatorFollowersDelta: { before: number; after: number; delta: number; verified: boolean };
  status: 'verified_success' | 'escrow_hold' | 'disputed' | 'refunded';
  proofUrl?: string;
  notes?: string;
}

// ===== HỆ THỐNG 40 CHIẾN LƯỢC CHỐNG GIAN LẬN TOÀN DIỆN (AVA SENTINEL 40-LAYER TITAN ANTI-FRAUD) =====
export type FraudRiskSeverity = 'low' | 'medium' | 'high' | 'critical' | 'blacklisted';

export type FraudAnomalyType = 
  | 'TAB_BOUNCE_NO_ACTION'           // Thoát ra vào lại dưới 5s không thao tác
  | 'ZERO_TELEMETRY_CLICK'           // Không có chuyển động chuột, vuốt chạm người thật
  | 'CLIPBOARD_NONCE_MISMATCH'       // Không copy hoặc sai mã băm Challenge Nonce
  | 'DYNAMIC_HASHTAG_MISSING'        // Thiếu hashtag định danh phiên comment
  | 'SPEED_RUNNER_BURST'             // Làm >3 nhiệm vụ / phút (vượt ngưỡng sinh học người)
  | 'MULTI_ACC_DEVICE_COLLISION'     // 1 thiết bị/IP vượt quá hạn mức tài khoản
  | 'HONEYPOT_TRAP_TRIGGERED'        // Bấm vào task bẫy dành riêng cho bot/crawler
  | 'UNFOLLOW_BREACH_30D'            // Hủy follow trước 30 ngày cam kết
  | 'CANVAS_BOT_FINGERPRINT'         // Phát hiện headless browser / Puppeteer / Playwright
  | 'SIMULATED_SCREENSHOT_REJECT'    // Ảnh chụp màn hình trùng lặp hoặc giả mạo
  | 'MICRO_INTERACTION_ANOMALY'      // Tốc độ phản xạ < 200ms vô lý
  | 'ESCROW_CHARGEBACK_DISPUTE'      // Tranh chấp rút xu khi đang giữ trong két 7 ngày
  | 'IP_PROXY_TOR_DETECTED'          // Dùng Proxy/VPN/Tor để spam nhiệm vụ
  | 'TOKEN_TAMPERING_ATTEMPT'        // Sửa đổi payload hoặc số dư client-side
  | 'LIVE_HEARTBEAT_FROZEN'          // Tab livestream bị ẩn hoặc pause video
  | 'BACKGROUND_INTERRUPT_BYPASS'    // Rời app nghe gọi/nhắn tin/chơi game mà đòi nhận xu
  | 'CASCADING_TASK_LOCKOUT'         // Khóa chuỗi nhiệm vụ tiếp theo sau khi phát hiện gian lận
  | 'FLOATING_PIP_IDLE'              // Gian lận thu nhỏ video chạy nền không tương tác
  | 'ACCESSIBILITY_AUTOCLICK'        // Phát hiện công cụ tự động click qua quyền trợ năng
  | 'MULTI_TAB_RACE'                 // Mở nhiều tab cùng lúc để cày xu đa luồng trái phép
  | 'TIME_DRIFT_MANIPULATION'        // Gian lận chỉnh lùi đồng hồ hệ thống client
  | 'DUPLICATE_CHANNEL_FOLLOW'       // Follow trùng kênh đã nhận xu trước đó
  | 'DUPLICATE_TASK_ACTION'          // Claim lặp lại hành vi đã hoàn thành
  | 'PERMANENT_BINDING_VIOLATION';   // Hủy liên kết rồi liên kết lại để trục lợi bonus

export interface AntiFraudStrategyDef {
  id: number;
  code: string;
  name: string;
  layerCategory: 'Biometrics' | 'Cryptographic' | 'Network' | 'Temporal' | 'Economic' | 'AI_Heuristic' | 'Legal';
  description: string;
  mechanism: string;
  autoAction: 'warning' | 'penalty_score' | 'freeze_wallet' | 'lock_account' | 'legal_dossier';
  efficiencyRate: string;
  status: 'active' | 'enforcing' | 'standby';
  icon: string;
}

export interface AntiFraudTelemetry {
  touchCount: number;
  mouseDistancePx: number;
  scrollCount: number;
  keyStrokeCount: number;
  reactionTimeMs: number;
  canvasHash: string;
  webglRenderer: string;
  screenResolution: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  batteryLevel?: number;
  isHeadless: boolean;
}

export interface FraudIncidentLog {
  id: string;
  timestamp: string;
  userId: string;
  userHandle: string;
  userEmail: string;
  userAvatar?: string;
  anomalyType: FraudAnomalyType;
  severity: FraudRiskSeverity;
  fraudScore: number;
  trustScoreBefore: number;
  trustScoreAfter: number;
  taskId?: string;
  taskTitle?: string;
  actionType?: string;
  detail: string;
  telemetrySnapshot?: Partial<AntiFraudTelemetry>;
  actionTaken: 'FLAGGED' | 'SCORE_DEDUCTED' | 'WALLET_FROZEN' | 'ACCOUNT_LOCKED' | 'LEGAL_ESCALATED';
  evidenceUrls?: string[];
  isImmutable: boolean;           // Không thể xóa trừ Super Admin
  ip: string;
  location?: string;
  dossierCode?: string;           // Mã hồ sơ pháp chế nếu chuyển sang cơ quan chức năng
}

export interface HoneypotTrapItem {
  id: string;
  name: string;
  type: 'hidden_button' | 'fake_high_reward_task' | 'invisible_dom_link' | 'zero_sec_confirm';
  rewardXuFake: number;
  triggerCount: number;
  lastTriggeredAt?: string;
  botIpsCaught: string[];
}

// ===== HỆ THỐNG BANNER QUẢNG CÁO LIVESTREAM (100.000 XU • HIỂN THỊ 3 GIÂY • KHUNG 50%) =====
export interface LivestreamBannerCampaign {
  id: string;
  userId: string;
  userHandle: string;
  userName: string;
  creatorEmail?: string;
  bannerImageUrl: string;
  targetLiveUrl: string;
  liveTitle: string;
  costCoins: number; // 100.000 Xu
  status: 'pending_moderation' | 'approved' | 'active' | 'completed' | 'rejected';
  moderationDurationMinutes: number; // Tối đa 5 phút
  moderationRemainingSeconds: number;
  moderationResult?: {
    passed: boolean;
    reason: string;
    checkedBy: string;
    checkedAt: string;
  };
  durationSeconds: number; // 3s
  createdAt: string;
  expiresAt?: string;
  totalDisplays?: number;
  impressionsCount?: number;
  clicksCount?: number;
}

// ===== GÓI NHIỆM VỤ NGÀY (DAILY MISSION PACKAGE BUNDLE) =====
export interface DailyMissionBundleItem {
  id: string;
  title: string;
  description: string;
  actionType: 'watch' | 'follow' | 'like' | 'comment' | 'share' | 'live';
  targetCount: number;
  completedCount: number;
  rewardXu: number;
  isCompleted: boolean;
}

export interface DailyMissionPackageBundle {
  dateKey: string;
  title: string;
  description: string;
  totalRewardCoins: number;
  pendingAccumulatedCoins: number;
  isFullyCompleted: boolean;
  isClaimed: boolean;
  expiresAt: string;
  items: DailyMissionBundleItem[];
}



