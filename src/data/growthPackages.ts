import { GrowthServiceItem, PlatformCommissionSettings } from "../types";

export const PLATFORM_COMMISSION_DEFAULTS: PlatformCommissionSettings = {
  affiliateRatePercent: 25,
  escrowFeePercent: 20,
  taskRewardPoolPercent: 50,
  platformReservePercent: 15,
  disbursementTime: '10:00 Sáng Thứ Hai',
  processingTime: 'Trong vòng 24 giờ',
  minWithdrawAmount: 200000,
  withdrawFeePercent: 5
};

export const COMPREHENSIVE_GROWTH_PACKAGES: GrowthServiceItem[] = [
  // =========================================================================
  // 1. GÓI FOLLOW (KẾT NỐI BẠN BÈ NGƯỜI THẬT - 100% REAL USERS VIỆT NAM)
  // =========================================================================
  {
    "id": "pkg_fl_1000",
    "title": "Gói 1,000 Follower Thật Mở Khóa TikTok Shop & Bật Livestream Studio",
    "category": "follow",
    "tag": "Bán Chạy Nhất",
    "price": "500,000đ",
    "originalPrice": "750,000đ",
    "priceNum": 500000,
    "targetQuantity": 1000,
    "unit": "Follower Người Thật",
    "description": "Bạn đang bị chặn tính năng giỏ hàng TikTok Shop hoặc chưa đủ điều kiện Live? Gói 1,000 Follower người thật 100% hoạt động tại Việt Nam giúp tài khoản đạt chuẩn ngay lập tức, mở khóa Livestream Studio và giỏ hàng bán hàng trong 24h mà không lo vi phạm chính sách.",
    "features": [
      "1,000 Follower từ tài khoản người dùng thật có Avatar, Bio và Video hoạt động (500 Xu/kết nối)",
      "Người dùng thật lướt xem video 15s trước khi bấm Follow tạo tín hiệu tương tác tự nhiên",
      "Đủ điều kiện bật ngay tính năng TikTok Shop Creator và Livestream điện thoại",
      "Hệ thống tự động chống tụt với công nghệ Anti-Unfollow API độc quyền"
    ],
    "benefits": [
      "Mở khóa ngay giỏ hàng TikTok Shop và tính năng phát Livestream chuyên nghiệp",
      "TẶNG NGAY 1,000 Lượt Xem Video Tự Nhiên (1:1) giúp kênh có traffic lập tức",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu nhân đôi mỗi ngày",
      "Bảo hành Anti-Unfollow 30 ngày, đền bù bù đủ 100% tự động nếu phát sinh giảm",
      "An toàn tuyệt đối 100% cho kênh, chuẩn thuật toán phân phối TikTok 2026"
    ],
    "retentionRate": "98.5% Giữ Kênh Bền Vững",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 1,000 Lượt Xem Video Tự Nhiên (1:1)",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Bảo hành Anti-Unfollow 30 ngày tự động"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mở Shop Ngay",
    "rating": 5,
    "reviewCount": 1420,
    "thumbnail": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fl_2000",
    "title": "Gói 2,000 Follower Thật Định Vị Thương Hiệu & Tăng Tốc Click Bio",
    "category": "follow",
    "tag": "Đề Xuất Cao",
    "price": "1,000,000đ",
    "originalPrice": "1,500,000đ",
    "priceNum": 1000000,
    "targetQuantity": 2000,
    "unit": "Follower Người Thật",
    "description": "Kênh dưới 2,000 follow rất khó tạo niềm tin để khách hàng bấm mua sắm. Sở hữu ngay 2,000 kết nối bạn bè người thật để gia tăng độ uy tín (Trust Score), kích thích khách hàng nhấp vào link Bio, giỏ hàng sản phẩm và tăng tỷ lệ chuyển đổi đơn hàng lên gấp 3 lần.",
    "features": [
      "2,000 Follower người thật 100% lướt TikTok hàng ngày từ các thành phố lớn",
      "Phân phối tốc độ tự nhiên giãn cách thông minh theo thuật toán TikTok",
      "Tăng chỉ số uy tín tài khoản, giảm thiểu tỷ lệ khách thoát trang",
      "Cam kết bảo vệ tài khoản an toàn không dính án phạt"
    ],
    "benefits": [
      "Gia tăng độ tin cậy giúp tăng tỷ lệ nhấp link Bio và giỏ hàng sản phẩm",
      "TẶNG NGAY 2,000 Lượt Xem Video Tự Nhiên tạo tương tác chéo cho toàn kênh",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu liên tục",
      "Bảo hành chống tụt vĩnh viễn 30 ngày từ hệ thống đối soát",
      "Ưu tiên phân phối tốc độ cao trên sàn tiếp thị đối tác"
    ],
    "retentionRate": "98.8% Giữ Kênh Bền Vững",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 2,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Bảo hành Chống Tụt 30 ngày đền bù 100%"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Đề Xuất VIP",
    "rating": 4.9,
    "reviewCount": 890,
    "thumbnail": "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fl_5000",
    "title": "Gói 5,000 Follower Thật Đột Phá Uy Tín & Kéo Tương Tác Tự Nhiên",
    "category": "follow",
    "tag": "Chuyên Nghiệp",
    "price": "2,500,000đ",
    "originalPrice": "3,600,000đ",
    "priceNum": 2500000,
    "targetQuantity": 5000,
    "unit": "Follower Người Thật",
    "description": "Biến kênh cá nhân hoặc shop bán hàng thành một thương hiệu có tầm ảnh hưởng lớn trong ngành. 5,000 người theo dõi thực tế giúp kích hoạt thuật toán đề xuất gợi ý kênh cho người dùng mới, nâng tầm chuyên nghiệp khi kết nối nhãn hàng và nhận booking quảng cáo.",
    "features": [
      "5,000 Follower người thật tương tác đa dạng theo đúng tệp đối tượng Việt Nam",
      "Tự động điều phối theo biểu đồ tăng trưởng tự nhiên 1,500 - 2,000 kết nối/ngày",
      "Kích nổ cơ chế gợi ý kênh (Suggested Accounts) của thuật toán TikTok",
      "Bảo đảm an toàn tuyệt đối, tương thích 100% với chính sách bảo mật sàn"
    ],
    "benefits": [
      "Nâng vị thế kênh lên đẳng cấp KOC/KOL chuyên nghiệp được nhãn hàng săn đón",
      "TẶNG NGAY 5,000 Lượt Xem Video Tự Nhiên đẩy mạnh loạt clip mới nhất",
      "Mở khóa thêm +3 Slot Nhiệm Vụ Tuần nhận phần thưởng Xu khủng",
      "Nhận báo cáo đối soát nhân khẩu học khán giả chi tiết (Độ tuổi, giới tính)",
      "Bảo hành vĩnh viễn 30 ngày không rớt số lượng"
    ],
    "retentionRate": "99.1% Giữ Kênh Bền Vững",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 5,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "📊 Báo cáo phân tích nhân khẩu học TikTok Analytics độc quyền"
    ],
    "weeklySlotBonus": 3,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "KOC Chuyên Nghiệp",
    "rating": 5,
    "reviewCount": 960,
    "thumbnail": "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fl_10000",
    "title": "Gói 10,000 Follower Thật Chuẩn Tích Xanh & Bứt Phá Doanh Số Khủng",
    "category": "follow",
    "tag": "Doanh Nghiệp VIP",
    "price": "5,000,000đ",
    "originalPrice": "7,200,000đ",
    "priceNum": 5000000,
    "targetQuantity": 10000,
    "unit": "Follower Người Thật",
    "description": "Cột mốc 10,000 Followers là điều kiện bắt buộc để định vị kênh Top 1 ngành hàng, nộp hồ sơ xét duyệt Tích Xanh TikTok Creator và mở khóa mọi đặc quyền quảng cáo cao cấp. Đem lại sự tin tưởng tuyệt đối giúp khách hàng ra quyết định mua sắm ngay không cần đắn đo.",
    "features": [
      "10,000 Follower thật từ người dùng hoạt động thường xuyên trên TikTok App",
      "Tạo nền tảng vững chắc để hoàn thiện hồ sơ cấp Tích Xanh chính chủ",
      "Phân phối chiến dịch theo luồng ưu tiên cao nhất toàn hệ thống",
      "Cam kết bảo hành vĩnh viễn và đối soát báo cáo minh bạch 100%"
    ],
    "benefits": [
      "Đủ điều kiện xét duyệt Tích Xanh TikTok và gia nhập MCN Partner cao cấp",
      "TẶNG NGAY 10,000 Lượt Xem Video Tự Nhiên phủ sóng toàn bộ video trên kênh",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Hạng Kim Cương",
      "Đặc quyền có chuyên viên kỹ thuật 1-1 tối ưu kênh và hỗ trợ 24/7",
      "Xuất hóa đơn tài chính VAT và hợp đồng pháp lý bảo lãnh có dấu đỏ"
    ],
    "retentionRate": "99.5% Giữ Kênh Bền Vững",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 10,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Kim Cương",
      "👑 Chuyên viên kỹ thuật 1-1 hỗ trợ chiến dịch độc quyền"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Tích Xanh VIP",
    "rating": 5,
    "reviewCount": 650,
    "thumbnail": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 2. GÓI THẢ TIM / ĐÁNH GIÁ (ENGAGEMENT - KÍCH NỔ THUẬT TOÁN FYP)
  // =========================================================================
  {
    "id": "pkg_lk_1000",
    "title": "Gói 1,000 Tim Đánh Giá Thật - Kích Nổ Đề Xuất FYP Vượt Vòng Thuật Toán",
    "category": "engagement",
    "tag": "Kích Nổ FYP",
    "price": "250,000đ",
    "originalPrice": "380,000đ",
    "priceNum": 250000,
    "targetQuantity": 1000,
    "unit": "Lượt Tim Đánh Giá Thật",
    "description": "Video mới đăng không có tương tác sẽ bị thuật toán TikTok đánh giá là nội dung kém và chìm nghỉm dưới 200 view. Bơm ngay 1,000 lượt thả tim đánh giá từ người dùng thật để vượt qua bài test đầu tiên, kích hoạt phân phối đến hàng vạn người xem trên mục 'Dành Cho Bạn'.",
    "features": [
      "1,000 Lượt thả tim thật từ tài khoản người dùng Việt Nam (250 Xu/lượt)",
      "Người xem lướt video tối thiểu 15s trước khi thả tim để tối ưu hóa Rank Score",
      "Tốc độ phân bổ mượt mà, tự nhiên 100% không lo bị bóp reach",
      "Tăng 200% tỷ lệ video được TikTok đưa vào danh sách đề xuất FYP"
    ],
    "benefits": [
      "Vượt qua vòng kiểm duyệt thuật toán 24h đầu, kích nổ đề xuất For You Page",
      "TẶNG NGAY 1,000 Lượt Xem Video Tự Nhiên (1:1) song song",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu hấp dẫn",
      "Bảo hành tương tác 100% không rớt tim theo thời gian"
    ],
    "retentionRate": "97.5% Đề Xuất Tự Nhiên",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 1,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Bảo hành tương tác vĩnh viễn"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Bứt Phá FYP",
    "rating": 4.9,
    "reviewCount": 920,
    "thumbnail": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lk_5000",
    "title": "Gói 5,000 Tim Đánh Giá Thật - Phủ Sóng Video Triệu View Tạo Hiệu Ứng Bão Đơn",
    "category": "engagement",
    "tag": "Viral Triệu View",
    "price": "1,250,000đ",
    "originalPrice": "1,800,000đ",
    "priceNum": 1250000,
    "targetQuantity": 5000,
    "unit": "Lượt Tim Đánh Giá Thật",
    "description": "Tạo hiệu ứng tâm lý đám đông (Social Proof) cực mạnh: Khi người lướt thấy video có trên 5,000 tim, họ sẽ tự động dừng lại xem hết video và bấm vào giỏ hàng mua sắm. Cung cấp xung lực tương tác cực mạnh để biến video bán hàng thành thỏi nam châm hút khách.",
    "features": [
      "5,000 Lượt thả tim thật từ cộng đồng người dùng tích cực trên TikTok",
      "Tăng 250% tỷ lệ giữ chân người xem và tỷ lệ chuyển đổi giỏ hàng",
      "Hỗ trợ phân bổ linh hoạt cho tối đa 2 video chủ lực",
      "Bảo đảm an toàn tuyệt đối và duy trì tương tác bền vững"
    ],
    "benefits": [
      "Tạo hiệu ứng lan truyền đám đông, kích thích khách hàng mua sản phẩm ngay",
      "TẶNG NGAY 5,000 Lượt Xem Video Tự Nhiên chia đều các video chiến dịch",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Đưa video vào danh mục nội dung nổi bật trong ngành hàng",
      "Bảo hành vĩnh viễn không rớt số lượng"
    ],
    "retentionRate": "98.2% Đề Xuất Tự Nhiên",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 5,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🔥 Ưu tiên đẩy đề xuất khung giờ cao điểm"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Bão Đơn Hot",
    "rating": 4.9,
    "reviewCount": 710,
    "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lk_10000",
    "title": "Gói 10,000 Tim Đánh Giá Thật - Đưa Video Lên Top 1 Thịnh Hành TikTok",
    "category": "engagement",
    "tag": "Top 1 Trending",
    "price": "2,500,000đ",
    "originalPrice": "3,500,000đ",
    "priceNum": 2500000,
    "targetQuantity": 10000,
    "unit": "Lượt Tim Đánh Giá Thật",
    "description": "Chiến dịch đẩy tim quy mô lớn dành riêng cho các video ra mắt sản phẩm mới, video Flash Sale hoặc viral drama. Đưa video thẳng vào bảng xếp hạng Thịnh Hành TikTok, thu hút hàng trăm ngàn lượt tiếp cận tự nhiên miễn phí kéo dài suốt nhiều tuần liên tục.",
    "features": [
      "10,000 Lượt tim thật từ tài khoản người dùng thực tế tại Việt Nam",
      "Phân bổ dàn trải theo biểu đồ tăng trưởng tự nhiên chống spam",
      "Tối ưu toàn diện thuật toán Rank Score TikTok 2026",
      "Hỗ trợ kỹ thuật 24/7 và kiểm tra số liệu thời gian thực"
    ],
    "benefits": [
      "Đưa video bay thẳng vào Top Trending danh mục sản phẩm TikTok Shop",
      "TẶNG NGAY 10,000 Lượt Xem Video Tự Nhiên phủ rộng toàn bộ kênh",
      "Mở khóa thêm +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "Thu hút nguồn traffic khổng lồ từ mục Khám Phá không tốn phí ads",
      "Hỗ trợ chuyên viên tư vấn chiến lược nội dung viral 1-1"
    ],
    "retentionRate": "98.9% Đề Xuất Tự Nhiên",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 10,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "👑 Quyền lợi VIP Partner ưu tiên phân phối Top 1"
    ],
    "weeklySlotBonus": 3,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Top Thịnh Hành",
    "rating": 5,
    "reviewCount": 540,
    "thumbnail": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 3. GÓI XEM VIDEO GIỮ CHÂN 40S - 60S & 60S - 90S (WATCH PACKAGES)
  // BẮT BUỘC GIỮ CHÂN 40S - 60S CHUẨN THUẬT TOÁN FYP
  // =========================================================================
  {
    "id": "pkg_vw_500",
    "title": "Gói 500 View Giữ Chân 40s - 60s - Khởi Động Kênh Mới Thử Nghiệm FYP",
    "category": "watch",
    "tag": "Khởi Động 40s-60s",
    "price": "250,000đ",
    "originalPrice": "380,000đ",
    "priceNum": 250000,
    "targetQuantity": 500,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Thuật toán TikTok 2026 chỉ đánh giá cao các video có thời gian giữ chân (Watch Time) dài. 500 lượt xem người thật bắt buộc giữ chân đủ 40s - 60s là liều thuốc mồi hoàn hảo để kiểm tra độ hấp dẫn của nội dung mới và đưa video vượt qua ngưỡng lọc ban đầu.",
    "features": [
      "500 Lượt xem thật từ tài khoản người dùng Việt Nam (500 Xu/lượt)",
      "Bắt buộc người xem giữ chân cố định từ 40 đến 60 giây trên video",
      "Đẩy chỉ số Average Watch Time lên mức cao nhất trong nhóm cùng chủ đề",
      "Hoàn thành phân bổ an toàn, không lo bị đánh cờ spam"
    ],
    "benefits": [
      "Bắt buộc giữ chân 40s - 60s tạo tín hiệu nội dung chất lượng cao cho thuật toán",
      "Tăng tỷ lệ hoàn thành video (Completion Rate) lên trên 85%",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Bảo đảm 100% người dùng thật xem video trên ứng dụng TikTok"
    ],
    "retentionRate": "96.5% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Cam kết 100% xem đủ 40s - 60s"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mồi Kênh Mới",
    "rating": 4.9,
    "reviewCount": 420,
    "thumbnail": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_1000",
    "title": "Gói 1,000 View Giữ Chân 40s - 60s - Vượt Ải Thuật Toán Mồi Lực Đề Xuất",
    "category": "watch",
    "tag": "Mồi Lực FYP",
    "price": "500,000đ",
    "originalPrice": "720,000đ",
    "priceNum": 500000,
    "targetQuantity": 1000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Video của bạn hay nhưng bị kẹt ở mức 200 - 500 view? 1,000 người xem thật giữ chân liên tục 40s - 60s sẽ cung cấp tín hiệu giữ chân mạnh mẽ, giúp hệ thống phân loại nội dung vào nhóm chất lượng cao và mở van phân phối tự nhiên ra hàng chục ngàn người xem tiếp theo.",
    "features": [
      "1,000 Lượt xem thật từ tài khoản người dùng hoạt động thường xuyên",
      "Người xem xem cố định từ 40 đến 60 giây tối đa hóa chỉ số Retention",
      "Giúp video vượt qua bài test thuật toán FYP một cách thuyết phục",
      "Không tụt view, đối soát minh bạch từng lượt xem"
    ],
    "benefits": [
      "Tối đa hóa chỉ số Average Watch Time giúp video bay thẳng vào FYP",
      "Tạo đà để TikTok mở rộng phân phối ra 10,000+ view tự nhiên hoàn toàn miễn phí",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu gấp đôi",
      "Báo cáo đối soát lượt xem chuẩn xác theo thời gian thực"
    ],
    "retentionRate": "97.8% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🎯 Tối ưu điểm số phân phối FYP tự động"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mồi Thuật Toán",
    "rating": 4.9,
    "reviewCount": 880,
    "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_2000",
    "title": "Gói 2,000 View Giữ Chân 40s - 60s - Đẩy Điểm Completion Rate Kéo Bão Traffic",
    "category": "watch",
    "tag": "Bão Traffic",
    "price": "1,000,000đ",
    "originalPrice": "1,450,000đ",
    "priceNum": 1000000,
    "targetQuantity": 2000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Tối ưu hóa tuyệt đối tỷ lệ xem hết video (Completion Rate) với 2,000 lượt xem thực tế giữ chân 40s - 60s. Tạo nền tảng vững chắc để thuật toán TikTok phân phối video vào các nhóm khách hàng có khả năng chi tiêu cao trên TikTok Shop.",
    "features": [
      "2,000 Lượt người xem thật giữ chân cố định từ 40 đến 60 giây",
      "Tăng 250% điểm số chất lượng Rank Score của video",
      "Kéo traffic tự nhiên từ tab 'Dành Cho Bạn' (FYP) đổ về kênh",
      "Bảo đảm an toàn và không bao giờ bị tụt chỉ số"
    ],
    "benefits": [
      "Tối ưu tỷ lệ xem hết video đạt ngưỡng đề xuất cấp 2 của thuật toán",
      "Kéo hàng nghìn traffic tự nhiên vào trang cá nhân và giỏ hàng",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Đối soát số liệu theo thời gian thực trên hệ thống"
    ],
    "retentionRate": "98.2% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "📈 Tối ưu thuật toán Rank Score x2.5 lần"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Đề Xuất Cao",
    "rating": 5,
    "reviewCount": 650,
    "thumbnail": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_5000",
    "title": "Gói 5,000 View Giữ Chân 40s - 60s - Xung Lực Giờ Vàng Đưa Video Vào Top Ngành",
    "category": "watch",
    "tag": "Top Ngành Hàng",
    "price": "2,500,000đ",
    "originalPrice": "3,600,000đ",
    "priceNum": 2500000,
    "targetQuantity": 5000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Cung cấp xung lực xem giữ chân 40s - 60s mạnh mẽ ngay trong khung giờ vàng, biến video thành tâm điểm chú ý của toàn ngành hàng. Lượng tương tác dồi dào sẽ kích hoạt cơ chế tự động nhân bản đề xuất, mang về lượng khách hàng tiềm năng khổng lồ.",
    "features": [
      "5,000 Lượt xem thật giữ chân 40s - 60s từ người dùng hoạt động thực tế",
      "Phân bổ dàn trải thông minh theo biểu đồ giờ vàng mua sắm",
      "Kích nổ cơ chế đề xuất tự động lan tỏa theo cấp số nhân",
      "Đối soát minh bạch số liệu chuẩn TikTok Analytics"
    ],
    "benefits": [
      "Cung cấp xung lực giữ chân cực lớn đưa video vào Top 1 ngành hàng",
      "Tạo bước đệm hoàn hảo để video đạt mốc 100,000+ view tự nhiên",
      "Mở khóa thêm +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "Hỗ trợ chia đều cho 2 video nếu có yêu cầu từ khách hàng"
    ],
    "retentionRate": "98.7% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "🔥 Ưu tiên đẩy video trong khung giờ vàng"
    ],
    "weeklySlotBonus": 3,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Top Ngành Hàng",
    "rating": 4.9,
    "reviewCount": 520,
    "thumbnail": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_10000",
    "title": "Gói 10,000 View Giữ Chân 40s - 60s - Chiến Dịch Triệu View Bùng Nổ Doanh Thu",
    "category": "watch",
    "tag": "Triệu View Doanh Số",
    "price": "5,000,000đ",
    "originalPrice": "7,000,000đ",
    "priceNum": 5000000,
    "targetQuantity": 10000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Chiến dịch tăng lượt xem giữ chân 40s - 60s quy mô lớn dành riêng cho các video giới thiệu sản phẩm chủ lực, video khuyến mãi ngày đôi Mega Sale. Đưa video vào nhóm phân phối triệu view, giúp chủ shop chốt hàng trăm đơn hàng mỗi ngày.",
    "features": [
      "10,000 Lượt xem thật giữ chân 40 - 60 giây 100% từ ứng dụng TikTok",
      "Cho phép chia đều linh hoạt cho 2 - 3 video chiến dịch",
      "Đưa video vào nhóm phân phối triệu view chuẩn SEO TikTok",
      "Hỗ trợ chuyên gia tối ưu tiêu đề, thumbnail và thẻ hashtag"
    ],
    "benefits": [
      "Đẩy mạnh video bán hàng Flash Sale và chiến dịch Mega Sale ngày đôi",
      "Tạo bước đệm bùng nổ hàng trăm nghìn lượt tiếp cận tự nhiên",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Hạng Kim Cương",
      "Báo cáo nhân khẩu học khán giả chuyên sâu hỗ trợ chạy ads"
    ],
    "retentionRate": "99.1% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Kim Cương",
      "💎 Quyền lợi phân phối siêu ưu tiên toàn hệ thống"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Siêu Bão Đơn",
    "rating": 5,
    "reviewCount": 430,
    "thumbnail": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_20000",
    "title": "Gói 20,000 View Giữ Chân 40s - 60s - Phủ Sóng Chuỗi Video Thống Trị FYP",
    "category": "watch",
    "tag": "Chuỗi Triệu View",
    "price": "10,000,000đ",
    "originalPrice": "14,000,000đ",
    "priceNum": 10000000,
    "targetQuantity": 20000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Giải pháp xây dựng độ nhận diện thương hiệu đỉnh cao bằng chuỗi 3 - 5 video viral cùng lúc. 20,000 lượt xem người thật giữ chân 40s - 60s sẽ kích nổ cơ chế cộng hưởng thuật toán, khiến người xem lướt đâu cũng thấy video của bạn trên bảng tin.",
    "features": [
      "20,000 Lượt xem thật giữ chân 40s - 60s cam kết chuẩn 100%",
      "Cho phép phân bổ linh hoạt cho chuỗi tối đa 5 video chiến dịch",
      "Kích nổ thuật toán FYP đa luồng đồng thời trên nhiều video",
      "Chuyên viên kỹ thuật giám sát tiến độ chiến dịch 24/7"
    ],
    "benefits": [
      "Xây dựng chuỗi video viral phủ sóng toàn bộ danh mục ngành hàng",
      "Giữ chân 40s - 60s liên tục tạo độ uy tín cao nhất trên toàn sàn",
      "Mở khóa thêm +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "Hỗ trợ tối ưu SEO hashtag và tiêu đề clip chuẩn thuật toán"
    ],
    "retentionRate": "99.4% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "👑 Chuyên viên kỹ thuật 1-1 hỗ trợ chiến dịch",
      "🛡️ Cam kết hoàn thành 100% chỉ tiêu đề ra"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Thống Lĩnh FYP",
    "rating": 5,
    "reviewCount": 280,
    "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_50000",
    "title": "Gói 50,000 View Giữ Chân 40s - 60s - Đại Chiến Dịch Brand Thống Lĩnh Toàn Ngành",
    "category": "watch",
    "tag": "Brand Doanh Nghiệp",
    "price": "25,000,000đ",
    "originalPrice": "35,000,000đ",
    "priceNum": 25000000,
    "targetQuantity": 50000,
    "unit": "Lượt Xem Giữ Chân 40s-60s",
    "description": "Đại chiến dịch tăng trưởng dành riêng cho các tập đoàn, thương hiệu lớn và nhãn hàng đầu ngành muốn thống lĩnh thị trường TikTok. 50,000 lượt xem giữ chân chuyên sâu đảm bảo vị trí Top 1 tìm kiếm từ khóa ngành hàng và giữ chân khách hàng lâu dài.",
    "features": [
      "50,000 Lượt xem giữ chân 40s - 60s người thật 100% không bot",
      "Phân bổ chiến lược cho toàn bộ 10 video chiến dịch trên kênh",
      "Bảo đảm thứ hạng Top 1 tìm kiếm từ khóa chính trên TikTok Search",
      "Xuất hóa đơn tài chính VAT và hợp đồng bảo đảm có dấu đỏ"
    ],
    "benefits": [
      "Thống trị hoàn toàn lượt tìm kiếm và mục Dành Cho Bạn trong toàn ngành",
      "Duy trì điểm chất lượng kênh ở mức tuyệt đối (Rank Score > 98)",
      "Mở khóa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao và quà tặng độc quyền",
      "Ký quỹ Escrow bảo đảm an toàn ngân sách chiến dịch 100%"
    ],
    "retentionRate": "99.8% Completion Rate",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Tối Cao",
      "📑 Hợp đồng ký quỹ bảo lãnh và hóa đơn VAT",
      "👑 Đặc quyền Brand VIP phục vụ 24/7"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Giữ chân 40s - 60s bắt buộc chuẩn thuật toán TikTok FYP",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Enterprise VIP",
    "rating": 5,
    "reviewCount": 160,
    "thumbnail": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_vw_deep_1000",
    "title": "Gói 1,000 View Giữ Chân Sâu 60s - 90s - Chuyên Biệt Video Review & Giỏ Hàng TikTok Shop",
    "category": "watch",
    "tag": "Giữ Chân Sâu 60-90s",
    "price": "650,000đ",
    "originalPrice": "950,000đ",
    "priceNum": 650000,
    "targetQuantity": 1000,
    "unit": "Lượt Xem Giữ Chân Sâu 60s-90s",
    "description": "Video review sản phẩm dài trên 1 phút cần thời gian xem sâu để người xem hiểu rõ công năng và bấm mua. 1,000 lượt xem giữ chân cố định từ 60 đến 90 giây (650 Xu/lượt) giúp video đạt điểm đánh giá nội dung giá trị cao nhất, kích thích nhấp link giỏ hàng ngay lập tức.",
    "features": [
      "1,000 Lượt xem giữ chân sâu từ 60 đến 90 giây liên tục từ người dùng thật",
      "Người xem xem chi tiết toàn bộ phần giới thiệu và hướng dẫn sản phẩm",
      "Đẩy điểm Retention của video dài lên mức tối đa của thuật toán",
      "Tăng tỷ lệ nhấp vào Giỏ hàng TikTok Shop và đặt hàng gấp 3 lần"
    ],
    "benefits": [
      "Dành riêng cho video dài trên 1 phút và video Review sản phẩm trên tay",
      "Giữ chân 60s - 90s giúp video vượt qua thuật toán lọc nội dung chuyên sâu",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Tối ưu tỷ lệ nhấp vào link giỏ hàng TikTok Shop x3 lần"
    ],
    "retentionRate": "99.2% Deep Retention Rate",
    "bonusGifts": [
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛒 Tối ưu tỷ lệ chuyển đổi giỏ hàng TikTok Shop"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Giữ chân sâu 60s - 90s chuyên dụng cho Review Sản Phẩm",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Review Viral",
    "rating": 5,
    "reviewCount": 340,
    "thumbnail": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 4. GÓI COMMENT / SEEDING BÌNH LUẬN CHUYỂN ĐỔI CAO (COMMENT)
  // =========================================================================
  {
    "id": "pkg_cm_1000",
    "title": "Gói 1,000 Comment Seeding Người Thật - Đặt Câu Hỏi & Khen Sản Phẩm Đẩy Đơn",
    "category": "comment",
    "tag": "Seeding Chốt Đơn",
    "price": "500,000đ",
    "originalPrice": "750,000đ",
    "priceNum": 500000,
    "targetQuantity": 1000,
    "unit": "Bình Luận Seeding Thật",
    "description": "Khách hàng thường lướt đọc bình luận trước khi quyết định mua sắm. 1,000 câu hỏi giá, xin link mua hàng, khen ngợi chất lượng sản phẩm từ tài khoản có Avatar và Bio chuẩn sẽ xóa tan mọi nghi ngờ của khách thật, thúc đẩy họ chốt đơn ngay dưới phần bình luận.",
    "features": [
      "1,000 Bình luận người thật có Avatar, Bio và lịch sử hoạt động (500 Xu/lượt)",
      "Cho phép khách hàng tùy chỉnh 100% danh sách kịch bản nội dung câu hỏi/câu trả lời",
      "Giãn cách thời gian phân bổ tự nhiên tránh bị bộ lọc spam của TikTok chặn",
      "Đẩy tỷ lệ chuyển đổi đơn hàng tăng vọt ngay trong ngày"
    ],
    "benefits": [
      "Tùy biến 100% kịch bản nội dung seeding hỏi giá, đặt hàng, khen chất lượng",
      "TẶNG NGAY 1,000 Lượt Xem Video Tự Nhiên (1:1) song song",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Kích thích khách thật để lại thông tin đặt hàng và tương tác liên tục",
      "Bảo đảm 100% bình luận hiển thị công khai không bị ẩn"
    ],
    "retentionRate": "98.0% Bình Luận Hữu Ích",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 1,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "📝 Bộ kịch bản Seeding chuẩn tăng tỷ lệ chuyển đổi"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Seeding Chốt Đơn",
    "rating": 4.9,
    "reviewCount": 780,
    "thumbnail": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cm_2000",
    "title": "Gói 2,000 Comment Thảo Luận Sôi Nổi - Tạo Hiệu Ứng Đám Đông Kích Cầu",
    "category": "comment",
    "tag": "Hiệu Ứng Đám Đông",
    "price": "1,000,000đ",
    "originalPrice": "1,500,000đ",
    "priceNum": 1000000,
    "targetQuantity": 2000,
    "unit": "Bình Luận Seeding Thật",
    "description": "Tạo ra một diễn đàn thảo luận sôi nổi và tranh luận tích cực dưới video. Khán giả sẽ bị cuốn vào đọc hàng trăm bình luận, từ đó kéo dài thời gian ở lại trên video và thúc đẩy thuật toán TikTok tiếp tục phân phối video ra tệp người dùng rộng lớn hơn.",
    "features": [
      "2,000 Bình luận người thật thảo luận chân thực và dài 10 - 20 từ",
      "Nội dung gắn liền với bối cảnh sản phẩm và câu chuyện trong video",
      "Cho phép phân bổ linh hoạt cho từ 2 đến 4 video khác nhau",
      "Kích thích khách hàng thật nhảy vào tham gia bình luận và đặt mua"
    ],
    "benefits": [
      "Tạo chủ đề thảo luận sôi nổi kéo dài thời gian dừng lại của khách hàng",
      "TẶNG NGAY 2,000 Lượt Xem Video Tự Nhiên hỗ trợ đẩy kênh",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Phân bổ linh hoạt cho 2 - 4 video chiến dịch",
      "Bảo hành không bị xóa hoặc ẩn bình luận"
    ],
    "retentionRate": "98.5% Bình Luận Hữu Ích",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 2,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Thảo Luận Sôi Nổi",
    "rating": 5,
    "reviewCount": 590,
    "thumbnail": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cm_5000",
    "title": "Gói 5,000 Comment Chốt Đơn Trực Tiếp - Phủ Kín Video & Phòng Livestream",
    "category": "comment",
    "tag": "Bão Comment Chốt Đơn",
    "price": "2,500,000đ",
    "originalPrice": "3,700,000đ",
    "priceNum": 2500000,
    "targetQuantity": 5000,
    "unit": "Bình Luận Seeding Thật",
    "description": "Seeding dồn dập các thông điệp 'Đã đặt hàng', 'Shop giao nhanh nhé', 'Chất lượng quá ưng ý'... tạo cảm giác sản phẩm đang cực kỳ hot và sắp hết hàng. Áp dụng đồng thời cho video ngắn và chạy comment nhảy liên tục trong phòng Livestream để chốt đơn thần tốc.",
    "features": [
      "5,000 Bình luận từ tài khoản người dùng thật có tương tác",
      "Phản hồi thông minh linh hoạt theo từng mã sản phẩm đang bán",
      "Hỗ trợ phân bổ song song cho cả video clip và phòng livestream bán hàng",
      "Bảo đảm 100% an toàn và không bị dính án phạt spam"
    ],
    "benefits": [
      "Tạo hiệu ứng 'cháy hàng', 'đã đặt thành công' kích thích khách mua ngay lập tức",
      "TẶNG NGAY 5,000 Lượt Xem Video Tự Nhiên phủ rộng",
      "Mở khóa thêm +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "Áp dụng song song cho cả chuỗi video và phòng livestream bán hàng",
      "Bảo đảm 100% bình luận hiển thị công khai chuẩn xác"
    ],
    "retentionRate": "99.0% Bình Luận Hữu Ích",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 5,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "🛡️ Bảo đảm 100% không bị ẩn bình luận"
    ],
    "weeklySlotBonus": 3,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Bão Chốt Đơn",
    "rating": 4.9,
    "reviewCount": 460,
    "thumbnail": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cm_10000",
    "title": "Gói 10,000 Comment Seeding VIP Brand - Thống Lĩnh Bình Luận Khẳng Định Vị Thế",
    "category": "comment",
    "tag": "VIP Brand Leader",
    "price": "5,000,000đ",
    "originalPrice": "7,500,000đ",
    "priceNum": 5000000,
    "targetQuantity": 10000,
    "unit": "Bình Luận Seeding Thật",
    "description": "Giải pháp phủ kín bình luận cho toàn bộ kênh 10 - 20 video, định vị thương hiệu như một nhãn hàng dẫn đầu phân khúc với hàng ngàn phản hồi 5 sao từ khách hàng thực tế. Xây dựng uy tín tuyệt đối để đẩy mạnh chiến dịch mở rộng đại lý và nhượng quyền kinh doanh.",
    "features": [
      "10,000 Bình luận người thật đa dạng ngữ cảnh và ngôn phong tự nhiên",
      "Phân bổ dàn đều cho toàn bộ kênh từ 10 đến 20 video chiến dịch",
      "Hỗ trợ phân loại kịch bản feedback, hỏi đáp, hướng dẫn mua hàng",
      "Báo cáo thống kê tương tác chi tiết theo thời gian thực"
    ],
    "benefits": [
      "Phủ sóng bình luận toàn bộ các video trên kênh và chiến dịch lớn",
      "TẶNG NGAY 10,000 Lượt Xem Video Tự Nhiên",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Hạng Kim Cương",
      "Báo cáo đối soát thống kê tương tác 24/7",
      "Ưu tiên hỗ trợ kỹ thuật và tối ưu kịch bản chiến dịch lớn"
    ],
    "retentionRate": "99.3% Bình Luận Hữu Ích",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 10,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Kim Cương",
      "👑 Chuyên viên quản lý kịch bản Seeding độc quyền"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Thương Hiệu Lớn",
    "rating": 5,
    "reviewCount": 320,
    "thumbnail": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 5. GÓI CHIA SẺ & LAN TỎA ĐA NỀN TẢNG (SHARE)
  // =========================================================================
  {
    "id": "pkg_sh_1000",
    "title": "Gói 1,000 Share Người Thật - Lan Tỏa Facebook/Zalo Kích Hoạt Điểm Viral Cao Nhất",
    "category": "share",
    "tag": "Điểm Viral Cao Nhất",
    "price": "600,000đ",
    "originalPrice": "900,000đ",
    "priceNum": 600000,
    "targetQuantity": 1000,
    "unit": "Lượt Chia Sẻ Thật",
    "description": "Trong thuật toán TikTok, 1 lượt chia sẻ (Share) có trọng số viral cao gấp 5 lần lượt thả tim. 1,000 lượt chia sẻ thực tế lên trang cá nhân Facebook, Messenger và Zalo (600 Xu/lượt) sẽ gửi tín hiệu video có giá trị lan tỏa cao, kích nổ phân phối tự nhiên không giới hạn.",
    "features": [
      "1,000 Lượt chia sẻ thật từ tài khoản người dùng Việt Nam (600 Xu/lượt)",
      "Lan tỏa trực tiếp ra Facebook cá nhân, tin nhắn Messenger, nhóm Zalo và link trực tiếp",
      "Chỉ số Chia Sẻ được thuật toán TikTok tính điểm Viral Score cao nhất",
      "Kéo nguồn traffic cực lớn từ bên ngoài mạng xã hội về trang TikTok Shop"
    ],
    "benefits": [
      "Chỉ số Share được TikTok tính trọng số Viral cao nhất trong thuật toán",
      "TẶNG NGAY 1,000 Lượt Xem Video Tự Nhiên (1:1) song song",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Kéo nguồn traffic ngoại sàn có tỷ lệ mua sắm cực cao",
      "Bảo đảm an toàn tuyệt đối cho kênh"
    ],
    "retentionRate": "98.0% Tỷ Lệ Lan Tỏa",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 1,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Lan Tỏa Viral",
    "rating": 4.9,
    "reviewCount": 620,
    "thumbnail": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_sh_2000",
    "title": "Gói 2,000 Share Đa Nền Tảng - Kéo Lượng Traffic Khủng Ngoại Sàn Về Kênh",
    "category": "share",
    "tag": "Traffic Đa Kênh",
    "price": "1,200,000đ",
    "originalPrice": "1,750,000đ",
    "priceNum": 1200000,
    "targetQuantity": 2000,
    "unit": "Lượt Chia Sẻ Thật",
    "description": "Nhân đôi lượt chia sẻ giúp video cắn đề xuất thần tốc, lan tỏa mạnh mẽ vào các hội nhóm cộng đồng. Hàng ngàn người dùng từ các nền tảng khác sẽ bấm vào liên kết để truy cập kênh của bạn, biến video thành một làn sóng tiếp cận tự nhiên khổng lồ.",
    "features": [
      "2,000 Lượt chia sẻ người thật chất lượng cao đa kênh",
      "Tăng chỉ số Viral Score giúp video bay thẳng vào danh sách xu hướng",
      "Cho phép chia đều linh hoạt cho 2 video chủ lực",
      "Bảo hành đối soát số liệu minh bạch theo thời gian thực"
    ],
    "benefits": [
      "Lan tỏa vào hàng trăm hội nhóm cộng đồng Facebook & Zalo",
      "TẶNG NGAY 2,000 Lượt Xem Video Tự Nhiên",
      "Mở khóa thêm +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu",
      "Chia đều cho 2 video để tối ưu hóa hiệu quả chiến dịch",
      "Bảo đảm an toàn 100% cho kênh"
    ],
    "retentionRate": "98.5% Tỷ Lệ Lan Tỏa",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 2,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Traffic Bùng Nổ",
    "rating": 5,
    "reviewCount": 480,
    "thumbnail": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_sh_5000",
    "title": "Gói 5,000 Share Bứt Phá - Đưa Video Vào Top Nội Dung Lan Tỏa Toàn Quốc",
    "category": "share",
    "tag": "Bứt Phá Lan Tỏa",
    "price": "3,000,000đ",
    "originalPrice": "4,500,000đ",
    "priceNum": 3000000,
    "targetQuantity": 5000,
    "unit": "Lượt Chia Sẻ Thật",
    "description": "Đưa video vào danh sách nội dung được chia sẻ nhiều nhất trong ngày. 5,000 lượt chia sẻ thực tế sẽ tạo nên cơn sốt thảo luận, đưa thông điệp và hình ảnh sản phẩm của bạn đến với hàng chục ngàn khách hàng tiềm năng mà không tốn chi phí quảng cáo.",
    "features": [
      "5,000 Lượt chia sẻ thật đa nền tảng mạng xã hội",
      "Hàng chục ngàn người xem mới từ bên ngoài kéo về kênh",
      "Tăng uy tín thương hiệu và điểm số chất lượng kênh vượt bậc",
      "Bảo đảm an toàn tuyệt đối và chuẩn quy định sàn TikTok"
    ],
    "benefits": [
      "Đưa video vào bảng xếp hạng nội dung được share nhiều nhất ngày",
      "TẶNG NGAY 5,000 Lượt Xem Video Tự Nhiên",
      "Mở khóa thêm +3 Slot Nhiệm Vụ Tuần Hạng Vàng",
      "Kéo hàng chục nghìn traffic tự nhiên ngoại sàn",
      "Bảo đảm kênh phát triển an toàn bền vững"
    ],
    "retentionRate": "99.0% Tỷ Lệ Lan Tỏa",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 5,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +3 Slot Nhiệm Vụ Tuần Hạng Vàng"
    ],
    "weeklySlotBonus": 3,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Viral Quốc Gia",
    "rating": 4.9,
    "reviewCount": 390,
    "thumbnail": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_sh_10000",
    "title": "Gói 10,000 Share Mega Viral - Phủ Sóng Toàn Mạng Xã Hội Đột Phá Tiếp Cận",
    "category": "share",
    "tag": "Mega Viral Brand",
    "price": "6,000,000đ",
    "originalPrice": "8,800,000đ",
    "priceNum": 6000000,
    "targetQuantity": 10000,
    "unit": "Lượt Chia Sẻ Thật",
    "description": "Chiến dịch lan tỏa quy mô cực đại dành cho các nhãn hàng muốn phủ sóng thương hiệu trên toàn bộ không gian mạng xã hội Việt Nam. 10,000 lượt chia sẻ thực tế sẽ đưa sản phẩm xuất hiện trên hàng ngàn trang cá nhân, nhóm và diễn đàn lớn.",
    "features": [
      "10,000 Lượt chia sẻ người dùng thật 100% không bot ảo",
      "Phân bổ chiến lược thông minh cho chuỗi tối đa 5 video",
      "Hỗ trợ chuyên viên tư vấn tối ưu tỷ lệ chuyển đổi đơn hàng",
      "Báo cáo đối soát độc quyền theo từng nguồn liên kết chia sẻ"
    ],
    "benefits": [
      "Phủ sóng thương hiệu và sản phẩm trên quy mô toàn quốc",
      "TẶNG NGAY 10,000 Lượt Xem Video Tự Nhiên",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Hạng Kim Cương",
      "Báo cáo đối soát độc quyền theo từng liên kết chia sẻ",
      "Chuyên viên hỗ trợ giám sát chiến dịch riêng biệt"
    ],
    "retentionRate": "99.4% Tỷ Lệ Lan Tỏa",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 10,000 Lượt Xem Video Tự Nhiên",
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Kim Cương",
      "👑 Chuyên viên hỗ trợ chiến dịch độc quyền"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Tặng kèm 100% Lượt Xem Tự Nhiên (lướt tự do không ép giây)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Siêu Lan Tỏa",
    "rating": 5,
    "reviewCount": 290,
    "thumbnail": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 6. GÓI MẮT XEM LIVESTREAM THỰC TẾ (LIVESTREAM)
  // =========================================================================
  {
    "id": "pkg_lv_3min_1000",
    "title": "Gói 1,000 Mắt Live Giữ 3 Phút Đầu - Mồi Mắt Đẩy Phòng Live Lên Top Đề Xuất",
    "category": "livestream",
    "tag": "Mồi Mắt Live 3P",
    "price": "350,000đ",
    "originalPrice": "500,000đ",
    "priceNum": 350000,
    "targetQuantity": 1000,
    "unit": "Mắt Live Người Thật",
    "description": "Khi vừa bật Live, phòng live vắng người sẽ không được TikTok đề xuất và khách lướt qua sẽ lập tức rời đi. Bơm ngay 1,000 mắt xem người thật giữ liên tục 3 phút đầu (350 Xu/mắt) kết hợp tap tim màn hình để đẩy phòng live lên đầu mục Livestream và giữ chân khách thật.",
    "features": [
      "1,000 Mắt người thật cam kết xem đủ 3 phút đầu phiên live (350 Xu/mắt)",
      "Đẩy phòng Live bay thẳng lên đầu trang Livestream TikTok",
      "Tương tác tap-tap thả tim màn hình tạo không khí sôi nổi",
      "Tự động kích hoạt ngay khi bạn bấm phát sóng trực tiếp"
    ],
    "benefits": [
      "Kích hoạt thuật toán đẩy đề xuất phòng live ngay trong 3 phút đầu phát sóng",
      "Tap-tap thả tim màn hình tạo không khí náo nhiệt kích thích khách mua",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Bù mắt tự động ngay lập tức nếu phát sinh gián đoạn đường truyền"
    ],
    "retentionRate": "100% Xem Đủ 3 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "🔴 Bù mắt tự động tức thì 100%"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mồi Mắt Live",
    "rating": 4.9,
    "reviewCount": 1100,
    "thumbnail": "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_10min_1000",
    "title": "Gói 1,000 Mắt Live Giữ 10 Phút Giờ Vàng - Chốt Nhanh Trọn Bộ Đơn Flash Sale",
    "category": "livestream",
    "tag": "Live Shop 10P",
    "price": "1,000,000đ",
    "originalPrice": "1,450,000đ",
    "priceNum": 1000000,
    "targetQuantity": 1000,
    "unit": "Mắt Live Người Thật",
    "description": "1,000 mắt xem ổn định liên tục trong 10 phút giờ vàng (1,000 Xu/mắt), tạo hiệu ứng phòng live đông đúc nghẹt thở. Thời gian đủ dài để bạn tung deal sốc, giới thiệu sản phẩm chủ lực và chốt hàng loạt đơn hàng đầu tiên.",
    "features": [
      "1,000 Mắt xem liên tục đúng 10 phút cam kết không tụt",
      "Tương tác tự nhiên tap tim và gửi tín hiệu tích cực lên TikTok",
      "Thu hút hàng trăm khách thật bấm vào giỏ hàng mua sắm",
      "Bảo đảm không tụt mắt đột ngột làm gián đoạn mạch bán hàng"
    ],
    "benefits": [
      "Duy trì 1,000 mắt thật ổn định suốt 10 phút giờ vàng chốt đơn",
      "Tăng tỷ lệ nhấp vào giỏ hàng TikTok Shop và thanh toán đơn hàng",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Bảo hiểm mắt xem 100% không tụt, đối soát từng phút"
    ],
    "retentionRate": "100% Xem Đủ 10 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "🛡️ Bảo hiểm mắt xem không tụt"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Chốt Đơn Live",
    "rating": 5,
    "reviewCount": 950,
    "thumbnail": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_10min_1500",
    "title": "Gói 1,500 Mắt Live Giữ 10 Phút - Bùng Nổ Phòng Live Lọt Top 5 Ngành Hàng",
    "category": "livestream",
    "tag": "Top 5 Ngành Live",
    "price": "1,500,000đ",
    "originalPrice": "2,200,000đ",
    "priceNum": 1500000,
    "targetQuantity": 1500,
    "unit": "Mắt Live Người Thật",
    "description": "1,500 mắt xem thực tế trong 10 phút cao điểm giúp đẩy phòng live lọt ngay vào Top 5 phiên live nổi bật nhất của ngành hàng. Thu hút lượng traffic tự nhiên khổng lồ đổ về, đưa doanh số phiên bán hàng lên một tầm cao mới.",
    "features": [
      "1,500 Mắt xem chất lượng cao xem đủ 10 phút trọn vẹn",
      "Đưa phòng live lọt top 5 ngành hàng đang phát sóng cùng thời điểm",
      "Tăng tỷ lệ khách bấm thêm sản phẩm vào giỏ hàng và thanh toán",
      "Bảo hành đầy đủ thời lượng xem và đối soát minh bạch"
    ],
    "benefits": [
      "Đưa phòng live lọt Top 5 ngành hàng đang phát sóng trực tiếp",
      "Gia tăng độ tin cậy giúp chốt đơn Flash Sale nhanh gấp 3 lần",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Đầy đủ báo cáo đối soát từng phút live chi tiết"
    ],
    "retentionRate": "100% Xem Đủ 10 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "🏆 Đẩy Top 5 ngành hàng thời gian thực"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Top 5 Live",
    "rating": 4.9,
    "reviewCount": 780,
    "thumbnail": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_10min_3000",
    "title": "Gói 3,000 Mắt Live Giữ 10 Phút - Đại Tiệc Săn Sale Chiếm Lĩnh Top 1 Toàn Quốc",
    "category": "livestream",
    "tag": "Top 1 Toàn Quốc",
    "price": "3,000,000đ",
    "originalPrice": "4,300,000đ",
    "priceNum": 3000000,
    "targetQuantity": 3000,
    "unit": "Mắt Live Người Thật",
    "description": "Quy mô 3,000 mắt xem thật tạo hiệu ứng chấn động trên toàn sàn Livestream TikTok. Phòng live của bạn sẽ được ưu tiên hiển thị ở vị trí số 1 toàn quốc, thu hút hàng ngàn người xem tự nhiên nhảy vào săn deal hời và tạo nên doanh thu kỷ lục.",
    "features": [
      "3,000 Mắt xem người thật ổn định 10 phút cao điểm",
      "Phòng Live lọt top 1 xu hướng Live toàn quốc trên TikTok",
      "Kéo hàng nghìn mắt thật tự nhiên theo cấp số nhân",
      "Tối ưu hóa doanh số phiên Flash Sale và Mega Live ngày đôi"
    ],
    "benefits": [
      "Đưa phòng Live lọt Top 1 xu hướng Live toàn quốc",
      "Kéo hàng nghìn mắt xem tự nhiên theo cấp số nhân",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Giám sát kỹ thuật trực tiếp đảm bảo thông luồng 100%"
    ],
    "retentionRate": "100% Xem Đủ 10 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "👑 Chiếm lĩnh Top 1 Livestream thịnh hành"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Top 1 Livestream",
    "rating": 5,
    "reviewCount": 640,
    "thumbnail": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_30min_1000",
    "title": "Gói 1,000 Mắt Live Giữ Bền Bỉ 30 Phút - Tư Vấn Chuyên Sâu Tăng Tỷ Lệ Giữ Chân",
    "category": "livestream",
    "tag": "Bền Bỉ 30P",
    "price": "2,800,000đ",
    "originalPrice": "3,900,000đ",
    "priceNum": 2800000,
    "targetQuantity": 1000,
    "unit": "Mắt Live Người Thật",
    "description": "1,000 mắt xem duy trì liên tục trong suốt 30 phút (2,800 Xu/mắt), giúp phòng live luôn giữ vững lượng khán giả đông đảo. Giải pháp hoàn hảo cho các phiên livestream bán quần áo, mỹ phẩm hoặc đồ gia dụng cần thời gian thử đồ và tư vấn chi tiết.",
    "features": [
      "1,000 Mắt xem thật giữ suốt 30 phút liên tục không gián đoạn",
      "Đảm bảo duy trì vị thế đề xuất bền bỉ trên bảng xếp hạng Live",
      "Thích hợp tuyệt đối cho phiên bán hàng thời trang, mỹ phẩm, công nghệ",
      "Bảo hành đối soát từng phút rõ ràng minh bạch"
    ],
    "benefits": [
      "Giữ 1,000 mắt xem suốt 30 phút liên tục không bị tụt",
      "Tạo độ uy tín lớn giúp khách hàng chốt nhiều sản phẩm giá trị cao",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Đối soát số lượng và thời lượng chi tiết chuẩn xác"
    ],
    "retentionRate": "100% Xem Đủ 30 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "🛡️ Bảo hành duy trì mắt ổn định suốt 30 phút"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Live Bền Bỉ",
    "rating": 5,
    "reviewCount": 510,
    "thumbnail": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_30min_2000",
    "title": "Gói 2,000 Mắt Live Giữ 30 Phút Đỉnh Cao - Đạt Doanh Số Trăm Triệu Mỗi Phiên",
    "category": "livestream",
    "tag": "Đỉnh Cao 30P",
    "price": "5,600,000đ",
    "originalPrice": "7,800,000đ",
    "priceNum": 5600000,
    "targetQuantity": 2000,
    "unit": "Mắt Live Người Thật",
    "description": "2,000 mắt xem bền bỉ suốt nửa tiếng giúp shop thống lĩnh hoàn toàn phiên live, kích nổ hàng ngàn lượt nhấp vào giỏ hàng và mang về doanh số hàng trăm triệu đồng trong một buổi phát sóng.",
    "features": [
      "2,000 Mắt xem thật giữ trọn vẹn 30 phút cao điểm",
      "Tạo hiệu ứng chốt đơn không ngừng nghỉ trong toàn phiên live",
      "Chiếm lĩnh vị trí Top 1 đề xuất danh mục sản phẩm TikTok Shop",
      "Bảo hiểm mắt xem 100% không tụt dốc giữa chừng"
    ],
    "benefits": [
      "Thống lĩnh phiên live 30 phút doanh thu trăm triệu bùng nổ",
      "Top 1 đề xuất danh mục ngành hàng TikTok Shop",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Hỗ trợ kỹ thuật viên đồng hành trong suốt phiên live"
    ],
    "retentionRate": "100% Xem Đủ 30 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "💎 Kỹ thuật viên đồng hành giám sát phòng live"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mega Doanh Số",
    "rating": 5,
    "reviewCount": 380,
    "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_lv_60min_1000",
    "title": "Gói 1,000 Mắt Live Giữ Trọn 60 Phút - Bảo Hiểm Phòng Live Trọn Phiên Bán Hàng",
    "category": "livestream",
    "tag": "Trọn Phiên 60P",
    "price": "5,000,000đ",
    "originalPrice": "7,200,000đ",
    "priceNum": 5000000,
    "targetQuantity": 1000,
    "unit": "Mắt Live Người Thật",
    "description": "Duy trì 1,000 mắt xem bền bỉ suốt 1 tiếng đồng hồ (5,000 Xu/mắt). Đây là giải pháp hoàn hảo nhất cho các phiên livestream chính của nhãn hàng, bảo đảm phòng live luôn đông vui từ đầu đến cuối mà không lo vắng khách.",
    "features": [
      "1,000 Mắt xem duy trì bền bỉ đủ 60 phút trọn phiên live",
      "Không lo tụt mắt giữa chừng khi livestream kéo dài",
      "Thu hút liên tục dòng khách hàng mới ra vào mua sắm",
      "Kèm chuyên viên hỗ trợ giám sát phòng live theo thời gian thực"
    ],
    "benefits": [
      "Duy trì bền bỉ 1,000 mắt xem suốt 1 tiếng trọn phiên bán hàng",
      "Liên tục kéo khách mới vào phòng live mua sắm",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP Livestream",
      "Bảo hiểm mắt xem tuyệt đối không lo tụt dốc"
    ],
    "retentionRate": "100% Xem Đủ 60 Phút",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP Live",
      "👑 Bảo hiểm phòng live 60 phút trọn vẹn"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Đếm theo số phút xem Live thực tế (1P / 3P / 10P / 30P / 90P)",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Trọn Phiên 1H",
    "rating": 5,
    "reviewCount": 420,
    "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // 7. GÓI COMBO KẾT HỢP TOÀN NĂNG (COMBO)
  // =========================================================================
  {
    "id": "pkg_cb_1250_basic",
    "title": "Combo 1: Đẩy Xu Hướng Thần Tốc (1k FL + 1k View 40-60s + 1k Tim) - Tiết Kiệm 32%",
    "category": "combo",
    "tag": "Combo Khởi Đầu Hot",
    "price": "1,250,000đ",
    "originalPrice": "1,850,000đ",
    "priceNum": 1250000,
    "targetQuantity": 3000,
    "unit": "Combo 3 Mục Tiêu",
    "description": "Bộ 3 hoàn hảo đẩy kênh mới lên xu hướng nhanh nhất: 1,000 Follower thật (500k) + 1,000 View giữ chân 40s-60s (500k) + 1,000 Thả tim tương tác (250k) = 1,250,000 Xu. Tiết kiệm 32% so với mua lẻ từng dịch vụ và giúp kênh bật đề xuất ngay.",
    "features": [
      "+1,000 Follower kênh người thật 100% đủ mở TikTok Shop (500k Xu)",
      "+1,000 Lượt xem video giữ chân 40s - 60s kích nổ FYP (500k Xu)",
      "+1,000 Lượt thả tim đánh giá tương tác thật (250k Xu)",
      "Tổng ngân sách chuẩn: 1,250,000 Xu (Tiết kiệm 32% so với giá gốc)"
    ],
    "benefits": [
      "Bộ 3 toàn diện: Follower + View giữ chân + Tim kích hoạt thuật toán FYP",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Combo nhận thưởng Xu lớn",
      "Bảo hành Anti-Unfollow và tương tác 30 ngày đền bù 100%",
      "Tiết kiệm 32% so với mua từng dịch vụ riêng lẻ"
    ],
    "retentionRate": "98.5% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Combo VIP",
      "🛡️ Bảo hành trọn gói 30 ngày"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Bao gồm 1,000 View giữ chân 40s-60s và Follow thật",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Combo Khởi Nghiệp",
    "rating": 5,
    "reviewCount": 1540,
    "thumbnail": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_2500_shop",
    "title": "Combo 2: Tăng Tốc Kênh Mở Shop (1k FL + 2k View + 2k Tim + 1k Cmt) - Bật Shop & Bão Đơn",
    "category": "combo",
    "tag": "Mở Shop Bão Đơn",
    "price": "2,500,000đ",
    "originalPrice": "3,600,000đ",
    "priceNum": 2500000,
    "targetQuantity": 6000,
    "unit": "Combo 4 Mục Tiêu",
    "description": "Giải pháp toàn diện giúp bạn vừa mở khóa TikTok Shop ngay lập tức vừa có sẵn kịch bản seeding 1,000 bình luận khen ngợi, 2,000 view giữ chân và 2,000 tim. Tạo ra một kênh bán hàng uy tín chuyên nghiệp, sẵn sàng đón bão đơn hàng.",
    "features": [
      "+1,000 Follower đủ điều kiện mở TikTok Shop ngay (500k Xu)",
      "+2,000 Lượt xem video giữ chân 40s - 60s (1,000k Xu)",
      "+2,000 Lượt thả tim kích nổ đề xuất video sản phẩm (500k Xu)",
      "+1,000 Comment seeding hỏi mua hàng tích cực (500k Xu)",
      "Tổng cộng: 2,500,000 Xu (Tiết kiệm 30% so với giá gốc)"
    ],
    "benefits": [
      "Mở khóa TikTok Shop ngay lập tức với 1k Follower và seeding bán hàng",
      "TẶNG THÊM bộ kịch bản 1,000 comment seeding chuyển đổi cao",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Combo",
      "Tiết kiệm 30% ngân sách marketing kênh"
    ],
    "retentionRate": "98.8% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Combo VIP",
      "🛒 Bộ kịch bản Seeding TikTok Shop chuẩn Pro"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Bao gồm 2,000 View giữ chân 40s-60s và Seeding comment",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Mở Shop Hot",
    "rating": 5,
    "reviewCount": 1120,
    "thumbnail": "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_5350_viral",
    "title": "Combo 3: Đột Phá Đề Xuất FYP (2k FL + 5k View + 5k Tim + 1k Share) - Đưa Clip Triệu View",
    "category": "combo",
    "tag": "Đột Phá FYP Triệu View",
    "price": "5,350,000đ",
    "originalPrice": "7,600,000đ",
    "priceNum": 5350000,
    "targetQuantity": 13000,
    "unit": "Combo 4 Mục Tiêu",
    "description": "Tích hợp toàn diện 4 chỉ số cốt lõi mà thuật toán TikTok yêu cầu: Follow + View Giữ Chân + Thả Tim + Chia Sẻ. Cung cấp xung lực viral cực mạnh để đưa video bay thẳng vào danh sách triệu view thịnh hành.",
    "features": [
      "+2,000 Follower kênh chất lượng cao (1,000k Xu)",
      "+5,000 Lượt xem video FYP giữ chân sâu 40s - 60s (2,500k Xu)",
      "+5,000 Lượt thả tim tạo độ uy tín lớn (1,250k Xu)",
      "+1,000 Lượt chia sẻ lan tỏa đa mạng xã hội (600k Xu)",
      "Tổng cộng: 5,350,000 Xu (Tiết kiệm 30% ngân sách)"
    ],
    "benefits": [
      "Bứt phá chỉ số Viral toàn diện đưa video vào Top 1 thịnh hành",
      "Mở khóa thêm +4 Slot Nhiệm Vụ Tuần Combo",
      "Kéo traffic đa nền tảng Facebook, Messenger, Zalo",
      "Báo cáo đối soát chỉ số viral độc quyền"
    ],
    "retentionRate": "99.0% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần Combo VIP",
      "🚀 Ưu tiên hàng chờ phân phối nhanh toàn sàn"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Bao gồm 5,000 View giữ chân 40s-60s và Share lan tỏa",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Đột Phá Viral",
    "rating": 4.9,
    "reviewCount": 890,
    "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_6250_live",
    "title": "Combo 4: Chiến Binh Bán Hàng Toàn Diện (2k FL + 5k View + 5k Tim + 1k Cmt + 1k Mắt Live 10p)",
    "category": "combo",
    "tag": "Chiến Binh Shop & Live",
    "price": "6,250,000đ",
    "originalPrice": "8,900,000đ",
    "priceNum": 6250000,
    "targetQuantity": 14000,
    "unit": "Combo 5 Mục Tiêu",
    "description": "Vũ khí tối thượng cho các shop bán hàng chuyên nghiệp: Vừa có video clip lên xu hướng, vừa có 1,000 mắt live xem 10 phút giờ vàng để chốt đơn ngay trong phiên bán hàng. Đảm bảo doanh số bùng nổ từ mọi hướng tiếp cận.",
    "features": [
      "+2,000 Follower kênh người thật (1,000k Xu)",
      "+5,000 View video sản phẩm chủ lực giữ chân 40s-60s (2,500k Xu)",
      "+5,000 Tim kích hoạt thuật toán FYP (1,250k Xu)",
      "+1,000 Comment seeding giỏ hàng (500k Xu)",
      "+1,000 Mắt live giữ 10 phút giờ vàng chốt đơn (1,000k Xu)",
      "Tổng ngân sách: 6,250,000 Xu (Tiết kiệm 30%)"
    ],
    "benefits": [
      "Bộ công cụ bán hàng tối thượng: Video đề xuất + Phiên live chốt đơn",
      "Mở khóa thêm +5 Slot Nhiệm Vụ Tuần VIP",
      "Tăng vọt doanh số trong các ngày đôi Mega Sale",
      "Kèm chuyên viên kỹ thuật trực live hỗ trợ 100%"
    ],
    "retentionRate": "99.2% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +5 Slot Nhiệm Vụ Tuần VIP",
      "🔴 Hỗ trợ kỹ thuật phiên live trực tiếp"
    ],
    "weeklySlotBonus": 5,
    "watchDurationNote": "Bao gồm 5,000 View 40s-60s và 1,000 Mắt Live 10 phút",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Chiến Binh Bán Hàng",
    "rating": 5,
    "reviewCount": 760,
    "thumbnail": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_12200_leader",
    "title": "Combo 5: Thống Lĩnh Thị Trường Ngách (5k FL + 10k View + 10k Tim + 2k Cmt + 2k Share)",
    "category": "combo",
    "tag": "Thống Lĩnh Thị Trường",
    "price": "12,200,000đ",
    "originalPrice": "17,500,000đ",
    "priceNum": 12200000,
    "targetQuantity": 29000,
    "unit": "Combo 5 Mục Tiêu",
    "description": "Đưa kênh và thương hiệu của bạn chiếm lĩnh vị trí số 1 trong thị trường ngách. Trọn bộ 29,000 tương tác người thật đưa mọi video trên kênh lọt vào tầm ngắm của thuật toán đề xuất, tạo ra dòng khách hàng ổn định mỗi ngày.",
    "features": [
      "+5,000 Follower uy tín cho thương hiệu (2,500k Xu)",
      "+10,000 View video chuẩn mực ngành hàng giữ chân 40s-60s (5,000k Xu)",
      "+10,000 Tim kích nổ đề xuất lan rộng (2,500k Xu)",
      "+2,000 Comment seeding chuyên sâu giải đáp thắc mắc (1,000k Xu)",
      "+2,000 Share lan tỏa đa cộng đồng (1,200k Xu)",
      "Tổng cộng: 12,200,000 Xu (Tiết kiệm 30% ngân sách)"
    ],
    "benefits": [
      "Thống lĩnh hoàn toàn thị phần ngành hàng ngách trên TikTok",
      "Mở khóa thêm +6 Slot Nhiệm Vụ Tuần Kim Cương",
      "Bảo hành Anti-Drop và tương tác vĩnh viễn",
      "Báo cáo phân tích đối thủ và tệp khách hàng độc quyền"
    ],
    "retentionRate": "99.5% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Kim Cương",
      "📊 Báo cáo phân tích insight tệp khách hàng",
      "👑 Đặc quyền ưu tiên số 1 trên toàn sàn"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Bao gồm 10,000 View 40s-60s và trọn bộ seeding",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Thống Lĩnh Ngành",
    "rating": 5,
    "reviewCount": 520,
    "thumbnail": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_14300_megalive",
    "title": "Combo 6: Siêu Live Bùng Nổ Doanh Thu (5k FL + 10k View + 2k Share + 2k Mắt Live 30p)",
    "category": "combo",
    "tag": "Siêu Mega Live",
    "price": "14,300,000đ",
    "originalPrice": "20,500,000đ",
    "priceNum": 14300000,
    "targetQuantity": 19000,
    "unit": "Combo Mega Live",
    "description": "Chiến dịch toàn năng dành cho các phiên Mega Live lớn: 5,000 Follower xây kênh, 10,000 View teaser kéo sự chú ý, 2,000 Share lan tỏa giờ live và 2,000 Mắt live thật giữ suốt 30 phút đỉnh cao. Bảo đảm phiên live đạt doanh thu hàng trăm triệu đồng.",
    "features": [
      "+5,000 Follower gia tăng uy tín kênh (2,500k Xu)",
      "+10,000 View video teaser thông báo giờ live (5,000k Xu)",
      "+2,000 Share lan tỏa phiên live ra ngoài TikTok (1,200k Xu)",
      "+2,000 Mắt live giữ bền bỉ suốt 30 phút đỉnh cao (5,600k Xu)",
      "Tổng cộng: 14,300,000 Xu (Tiết kiệm 30%)"
    ],
    "benefits": [
      "Chiến dịch Mega Live bùng nổ doanh số hàng trăm triệu",
      "2,000 Mắt live thật giữ suốt 30 phút kích nổ giỏ hàng",
      "Mở khóa thêm +6 Slot Nhiệm Vụ Tuần Kim Cương",
      "Đội ngũ kỹ thuật túc trực 24/7 bảo đảm thông suốt"
    ],
    "retentionRate": "99.6% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Kim Cương",
      "🔴 Đội ngũ kỹ thuật túc trực hỗ trợ Mega Live"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Bao gồm 10,000 View teaser và 2,000 Mắt Live 30 phút",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Đại Tiệc Live",
    "rating": 5,
    "reviewCount": 430,
    "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_25500_diamond",
    "title": "Combo 7: Kim Cương Toàn Diện Triệu View (10k FL + 20k View + 20k Tim + 5k Cmt + 5k Share)",
    "category": "combo",
    "tag": "Kim Cương Triệu View",
    "price": "25,500,000đ",
    "originalPrice": "36,000,000đ",
    "priceNum": 25500000,
    "targetQuantity": 60000,
    "unit": "Combo Toàn Diện",
    "description": "Gói tăng trưởng tối cao đưa kênh TikTok đạt chuẩn triệu view toàn diện: 10,000 Follower chuẩn Tích Xanh, 20,000 View giữ chân 40s-60s, 20,000 Tim, 5,000 Comment và 5,000 Share. Xây dựng một cỗ máy bán hàng tự động hàng đầu.",
    "features": [
      "+10,000 Follower đưa kênh lên đẳng cấp mới (5,000k Xu)",
      "+20,000 View video FYP chất lượng cao (10,000k Xu)",
      "+20,000 Tim phủ sóng đề xuất liên tục (5,000k Xu)",
      "+5,000 Comment seeding điều hướng giỏ hàng (2,500k Xu)",
      "+5,000 Share lan tỏa mạnh mẽ đa nền tảng (3,000k Xu)",
      "Tổng cộng: 25,500,000 Xu (Tiết kiệm 29% ngân sách)"
    ],
    "benefits": [
      "Đưa toàn bộ kênh lên đẳng cấp Triệu View và Tích Xanh TikTok",
      "Mở khóa tối đa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "Bảo hành vĩnh viễn và cam kết đối soát 100% người thật",
      "Kèm hợp đồng pháp lý bảo lãnh có dấu đỏ doanh nghiệp"
    ],
    "retentionRate": "99.8% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Tối Cao",
      "📑 Hợp đồng pháp lý bảo lãnh có dấu đỏ",
      "👑 Quản lý tài khoản VIP chuyên biệt 1-1"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Bao gồm 20,000 View 40s-60s và trọn bộ tương tác khủng",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Kim Cương Tối Cao",
    "rating": 5,
    "reviewCount": 310,
    "thumbnail": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_cb_25000_brand",
    "title": "Combo 8: Độc Quyền Brand Doanh Nghiệp (1 Video KOC Review + 10k FL + 50k Tim + 10k Share + Escrow)",
    "category": "combo",
    "tag": "Độc Quyền Brand Doanh Nghiệp",
    "price": "25,000,000đ",
    "originalPrice": "35,000,000đ",
    "priceNum": 25000000,
    "targetQuantity": 70001,
    "unit": "Combo Brand KOC",
    "description": "Giải pháp xây dựng thương hiệu bùng nổ trọn gói dành riêng cho Doanh Nghiệp: Sản xuất 1 Video KOC Review chuyên nghiệp gắn giỏ hàng TikTok Shop + 10,000 Follower thật + 50,000 Tim + 10,000 Share. Ký hợp đồng Escrow 3 bên bảo lãnh tuyệt đối an toàn.",
    "features": [
      "+1 Video KOC sản xuất độc quyền gắn giỏ hàng (1,500k Xu)",
      "+10,000 Follower thật uy tín cho Brand (5,000k Xu)",
      "+50,000 Lượt tim kích hoạt chiến dịch viral lớn (12,500k Xu)",
      "+10,000 Lượt chia sẻ lan tỏa toàn quốc (6,000k Xu)",
      "Hợp đồng bảo đảm ký quỹ Escrow 3 bên có dấu đỏ pháp lý",
      "Tổng cộng: 25,000,000 Xu (Tiết kiệm 29% ngân sách)"
    ],
    "benefits": [
      "Sản xuất trọn gói 1 Video KOC Review chuyên nghiệp gắn giỏ hàng",
      "Mở khóa tối đa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "Ký quỹ Escrow 3 bên bảo lãnh an toàn tuyệt đối",
      "Xuất hóa đơn VAT tài chính và hợp đồng đóng dấu đỏ"
    ],
    "retentionRate": "99.9% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Tối Cao",
      "🎬 01 Video KOC Review sản xuất độc quyền",
      "📑 Hợp đồng ký quỹ Escrow 3 bên bảo lãnh"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "KOC Review chuyên sâu và trọn bộ chiến dịch Viral",
    "estimatedDelivery": "Chạy đến khi đạt đủ 100% chỉ tiêu",
    "badge": "Brand Enterprise",
    "rating": 5,
    "reviewCount": 195,
    "thumbnail": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // GÓI TĂNG TRƯỞNG FACEBOOK (FANPAGE, TRANG CÁ NHÂN, REELS, SEEDING, LIVE)
  // =========================================================================
  {
    "id": "pkg_fb_page_1000",
    "platform": "facebook",
    "title": "Gói 1,000 Like & Follow Fanpage Facebook Chuẩn SEO Xanh",
    "category": "follow",
    "tag": "Facebook Fanpage",
    "price": "350,000đ",
    "originalPrice": "500,000đ",
    "priceNum": 350000,
    "targetQuantity": 1000,
    "unit": "Like/Follow Fanpage",
    "description": "Tăng ngay 1,000 người thích và theo dõi Fanpage Facebook thật 100% tại Việt Nam. Giúp Fanpage trông chuyên nghiệp, đủ điều kiện chạy quảng cáo, tăng điểm chất lượng Page và tạo niềm tin vững chắc cho khách hàng mua hàng.",
    "features": [
      "1,000 Người thật theo dõi và thích Fanpage Facebook hoạt động thường xuyên",
      "Gia tăng điểm chất lượng Fanpage (Page Quality Score) và độ trust khi chạy Ads",
      "Tối ưu hóa thứ hạng tìm kiếm SEO trên thanh công cụ Facebook",
      "Bảo hành chống tụt 30 ngày, tự động bù đủ 100%"
    ],
    "benefits": [
      "Xây dựng Fanpage bán hàng uy tín ngay từ ngày đầu tiên",
      "TẶNG KÈM 500 Lượt tương tác like bài viết Fanpage miễn phí",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần nhận thưởng Xu liên tục",
      "Bảo hành không tụt 30 ngày từ sàn AVA-FOLLOW"
    ],
    "retentionRate": "99.2% Giữ Fanpage Bền Vững",
    "bonusGifts": [
      "🎁 TẶNG MIỄN PHÍ 500 Like bài viết Fanpage",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Bảo hành 30 ngày bù 100%"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tương tác người dùng thật 100% tại Việt Nam",
    "estimatedDelivery": "Hoàn thành trong 24h - 48h",
    "badge": "Hot Fanpage",
    "rating": 5,
    "reviewCount": 780,
    "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fb_profile_1000",
    "platform": "facebook",
    "title": "Gói 1,000 Follow Trang Cá Nhân Facebook Xây Thương Hiệu Chuyên Nghiệp",
    "category": "follow",
    "tag": "Facebook Profile",
    "price": "350,000đ",
    "originalPrice": "500,000đ",
    "priceNum": 350000,
    "targetQuantity": 1000,
    "unit": "Follower Cá Nhân",
    "description": "Xây dựng thương hiệu cá nhân uy tín, profile người bán hàng chuyên nghiệp với 1,000 người theo dõi thật. Tăng tương tác cho bài đăng cá nhân, thu hút khách hàng tiềm năng và gia tăng tỷ lệ chốt đơn qua tin nhắn Messenger.",
    "features": [
      "1,000 Follower trang cá nhân người thật có avatar và tương tác thật",
      "Tăng độ nhận diện thương hiệu cá nhân cho CEO, chuyên gia, người kinh doanh",
      "Tự nhiên, an toàn 100% cho tài khoản cá nhân",
      "Bảo hành chống tụt 30 ngày an tâm tuyệt đối"
    ],
    "benefits": [
      "Định vị hình ảnh chuyên nghiệp trong mắt đối tác và khách hàng",
      "TẶNG NGAY 500 Lượt thích bài viết gần nhất",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "Bảo hành chống tụt 30 ngày"
    ],
    "retentionRate": "99.0% Ổn Định",
    "bonusGifts": [
      "🎁 TẶNG 500 Like bài viết trang cá nhân",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "🛡️ Bảo hành 30 ngày"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tài khoản người dùng thật có lịch sử hoạt động",
    "estimatedDelivery": "Hoàn thành trong 24h - 48h",
    "badge": "Profile VIP",
    "rating": 4.9,
    "reviewCount": 620,
    "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fb_reels_view_10k",
    "platform": "facebook",
    "title": "Gói 10,000 Lượt Xem Facebook Reels Giữ Chân 60s Đẩy Xu Hướng",
    "category": "watch",
    "tag": "Reels Viral",
    "price": "300,000đ",
    "originalPrice": "500,000đ",
    "priceNum": 300000,
    "targetQuantity": 10000,
    "unit": "Lượt Xem Reels 60s",
    "description": "Kéo video Facebook Reels của bạn lên xu hướng đề xuất với 10,000 lượt xem chất lượng cao giữ chân 40-60 giây. Kích thích thuật toán Facebook phân phối video đến hàng trăm nghìn người dùng tự nhiên.",
    "features": [
      "10,000 Lượt xem thật giữ chân trung bình 40-60s cho Facebook Reels",
      "Tăng tỷ lệ xem hết (Completion Rate) kích hoạt đề xuất Facebook",
      "Tốc độ phân phối mượt mà tự nhiên, chuẩn chính sách Facebook 2026",
      "Tăng lượt tiếp cận không trả phí (Organic Reach)"
    ],
    "benefits": [
      "Đẩy video Reels vào luồng đề xuất khám phá Facebook",
      "TẶNG KÈM 1,000 Thả tim/like tương tác",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "Bảo hành lượt xem an toàn tuyệt đối"
    ],
    "retentionRate": "98.5% Giữ Chân 60s",
    "bonusGifts": [
      "🎁 TẶNG 1,000 Thả Like/Tym Reels",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "🛡️ Bảo hành an toàn 100%"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Xem đủ thời lượng 40s - 60s kích hoạt thuật toán Reels",
    "estimatedDelivery": "Hoàn thành trong 12h - 24h",
    "badge": "Reels Xu Hướng",
    "rating": 5,
    "reviewCount": 940,
    "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fb_cmt_500",
    "platform": "facebook",
    "title": "Gói 500 Bình Luận Seeding Kịch Bản Chốt Đơn Fanpage Facebook",
    "category": "comment",
    "tag": "Seeding Chốt Đơn",
    "price": "250,000đ",
    "originalPrice": "400,000đ",
    "priceNum": 250000,
    "targetQuantity": 500,
    "unit": "Bình Luận Kịch Bản",
    "description": "500 Bình luận người thật hỏi mua hàng, khen ngợi chất lượng sản phẩm, xin giá và review tốt theo đúng kịch bản của bạn. Tạo hiệu ứng đám đông (FOMO), kích thích khách hàng thật đặt đơn ngay trên bài viết.",
    "features": [
      "500 Bình luận từ nick thật có avatar, tên tiếng Việt tự nhiên",
      "Nhập kịch bản tùy ý hoặc để AI tạo bình luận chốt sale thông minh",
      "Khoảng cách thời gian ngẫu nhiên, không bị Facebook quét spam",
      "Tăng tỷ lệ chuyển đổi đơn hàng lên gấp 2 - 3 lần"
    ],
    "benefits": [
      "Tạo hiệu ứng mua hàng đông đúc giúp chốt đơn dễ dàng",
      "TẶNG NGAY 500 Thả Like cho bài viết",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "Bảo hành hiển thị vĩnh viễn"
    ],
    "retentionRate": "100% Comment Tự Nhiên",
    "bonusGifts": [
      "🎁 TẶNG 500 Like bài viết",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "🛡️ Bảo hành vĩnh viễn"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Nick thật bình luận theo kịch bản chốt đơn",
    "estimatedDelivery": "Chạy rải đều trong 24h",
    "badge": "Chốt Đơn Khủng",
    "rating": 4.9,
    "reviewCount": 510,
    "thumbnail": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fb_live_200",
    "platform": "facebook",
    "title": "Gói 200 Mắt Xem Livestream Facebook Bán Hàng Giữ Chân 60 Phút",
    "category": "livestream",
    "tag": "Mắt Live FB",
    "price": "600,000đ",
    "originalPrice": "900,000đ",
    "priceNum": 600000,
    "targetQuantity": 200,
    "unit": "Mắt Live Giữ Chân 60 Phút",
    "description": "Duy trì ổn định 200 mắt xem liên tục trong suốt 60 phút livestream bán hàng Facebook. Kéo phiên live lên đề xuất, tạo độ uy tín cao, kích thích người lướt Facebook dừng lại xem và đặt hàng.",
    "features": [
      "200 Mắt xem giữ chân liên tục 60 phút không bị rớt",
      "Tự động nhảy vào phòng livestream ngay sau khi bắt đầu phát sóng",
      "Kèm tương tác thả tim và chia sẻ live vào các hội nhóm",
      "Đẩy phiên live lên top đề xuất Facebook Watch & Facebook Live"
    ],
    "benefits": [
      "Tạo không khí phòng live sôi động, tăng tỷ lệ chốt đơn trực tiếp",
      "TẶNG KÈM 50 Bình luận hỏi mua hàng trong lúc live",
      "Mở khóa +4 Slot Nhiệm Vụ Tuần VIP",
      "Hỗ trợ kỹ thuật 24/7 trực tiếp phiên live"
    ],
    "retentionRate": "100% Giữ Mắt 60 Phút",
    "bonusGifts": [
      "🎁 TẶNG 50 Comment chốt đơn trong Live",
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần",
      "🛡️ Hỗ trợ kỹ thuật trực tiếp"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Duy trì ổn định 60 phút xuyên suốt buổi livestream",
    "estimatedDelivery": "Bắt đầu sau 1 phút phát live",
    "badge": "Bão Đơn Live",
    "rating": 5,
    "reviewCount": 430,
    "thumbnail": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_fb_combo_vip",
    "platform": "facebook",
    "title": "Combo Fanpage Doanh Nghiệp VIP (5k Follow Page + 10k Like + 1k Cmt Seeding + 500 Share)",
    "category": "combo",
    "tag": "Combo Doanh Nghiệp FB",
    "price": "2,800,000đ",
    "originalPrice": "4,500,000đ",
    "priceNum": 2800000,
    "targetQuantity": 16500,
    "unit": "Combo Doanh Nghiệp FB",
    "description": "Gói giải pháp toàn diện đưa Fanpage doanh nghiệp từ con số 0 trở thành thương hiệu uy tín hàng đầu: 5,000 Like/Follow Page + 10,000 Like bài viết + 1,000 Bình luận seeding chốt sale + 500 Lượt chia sẻ vào hội nhóm. Tiết kiệm 38% chi phí.",
    "features": [
      "+5,000 Like/Follow Fanpage chuẩn SEO xanh",
      "+10,000 Thả Like bài viết và video Reels",
      "+1,000 Bình luận seeding khen ngợi sản phẩm theo kịch bản",
      "+500 Lượt chia sẻ bài viết lan tỏa rộng rãi",
      "Bảo hành chống tụt 30 ngày cam kết chất lượng"
    ],
    "benefits": [
      "Xây dựng trọn gói Fanpage bán hàng uy tín chuẩn Doanh Nghiệp",
      "TẶNG KÈM 01 Buổi tư vấn tối ưu hóa quảng cáo Facebook Ads",
      "Mở khóa tối đa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "Bảo hành 30 ngày đền bù 100%"
    ],
    "retentionRate": "99.8% Toàn Diện",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Tối Cao",
      "📊 Tư vấn chiến lược chạy Facebook Ads hiệu quả",
      "🛡️ Bảo hành 30 ngày đền bù 100%"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Trọn bộ tương tác thật trên toàn bộ Fanpage",
    "estimatedDelivery": "Triển khai trong 3 - 5 ngày",
    "badge": "Doanh Nghiệp VIP",
    "rating": 5,
    "reviewCount": 380,
    "thumbnail": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80"
  },

  // =========================================================================
  // GÓI TĂNG TRƯỞNG YOUTUBE (SUBSCRIBERS, GIỜ XEM BẬT KIẾM TIỀN, VIEW, LIVE)
  // =========================================================================
  {
    "id": "pkg_yt_sub_1000",
    "platform": "youtube",
    "title": "Gói 1,000 Subscribers Kênh YouTube Thật Chuẩn Bật Kiếm Tiền",
    "category": "follow",
    "tag": "YouTube Subs",
    "price": "800,000đ",
    "originalPrice": "1,200,000đ",
    "priceNum": 800000,
    "targetQuantity": 1000,
    "unit": "Subscribers Người Thật",
    "description": "Đạt ngay cột mốc 1,000 Người đăng ký (Subscribers) người thật tại Việt Nam để đủ điều kiện tham gia Chương trình Đối tác YouTube (YPP - YouTube Partner Program), bật kiếm tiền và tạo uy tín lớn cho kênh.",
    "features": [
      "1,000 Subscribers người thật có tài khoản Google/YouTube hoạt động lâu năm",
      "Xem video từ 1-3 phút trước khi bấm Đăng ký kênh để chống tụt sub thuật toán",
      "Đủ điều kiện tiêu chuẩn 1,000 Sub bật kiếm tiền YouTube Partner",
      "Bảo hành Anti-Drop 30 ngày tự động đối soát"
    ],
    "benefits": [
      "Đạt chuẩn điều kiện bật kiếm tiền YouTube Partner",
      "TẶNG NGAY 2,000 Lượt xem video YouTube chất lượng cao 1080p",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "Bảo hành chống tụt vĩnh viễn 30 ngày"
    ],
    "retentionRate": "99.0% Không Tụt Sub",
    "bonusGifts": [
      "🎁 TẶNG 2,000 Lượt xem video YouTube 1080p",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "🛡️ Bảo hành 30 ngày đối soát tự động"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Tài khoản xem video trước khi bấm Đăng Ký chống tụt sub",
    "estimatedDelivery": "Hoàn thành trong 48h - 72h",
    "badge": "Bật Kiếm Tiền",
    "rating": 5,
    "reviewCount": 890,
    "thumbnail": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_yt_watch_4000h",
    "platform": "youtube",
    "title": "Gói 4,000 Giờ Xem Video Chuẩn YouTube Partner Bật Kiếm Tiền YPP",
    "category": "watch",
    "tag": "4000h Kiếm Tiền",
    "price": "1,800,000đ",
    "originalPrice": "2,800,000đ",
    "priceNum": 1800000,
    "targetQuantity": 4000,
    "unit": "Giờ Xem Chuẩn YPP",
    "description": "Vượt qua rào cản khó nhất của YouTube với 4,000 Giờ xem công khai hợp lệ từ người dùng thật. Giờ xem được cập nhật chính xác vào mục Kiếm tiền trong YouTube Studio, cam kết 100% duyệt đơn bật kiếm tiền.",
    "features": [
      "4,000 Giờ xem video người thật cập nhật chuẩn xác vào YouTube Studio Analytics",
      "Phân phối từ các thiết bị Desktop và Mobile tại Việt Nam với IP sạch",
      "Giữ chân trung bình từ 15 - 30 phút trên mỗi lượt xem",
      "Được bảo hành giờ xem đầy đủ trong suốt quá trình YouTube xét duyệt đơn"
    ],
    "benefits": [
      "Hoàn thành 100% điều kiện 4,000 giờ xem bật kiếm tiền YouTube",
      "TẶNG KÈM 500 Subscribers và 1,000 Thả Like",
      "Mở khóa +4 Slot Nhiệm Vụ Tuần VIP",
      "Hỗ trợ hướng dẫn gửi đơn bật kiếm tiền duyệt nhanh trong 24h"
    ],
    "retentionRate": "100% Cập Nhật Studio",
    "bonusGifts": [
      "🎁 TẶNG 500 Subs + 1,000 Like",
      "⚡ Mở khóa +4 Slot Nhiệm Vụ Tuần",
      "🛡️ Bảo hành xét duyệt kiếm tiền"
    ],
    "weeklySlotBonus": 4,
    "watchDurationNote": "Giờ xem công khai hợp lệ chuẩn tiêu chí YouTube Partner",
    "estimatedDelivery": "Hoàn thành trong 5 - 7 ngày",
    "badge": "YPP Partner",
    "rating": 5,
    "reviewCount": 740,
    "thumbnail": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_yt_view_10k",
    "platform": "youtube",
    "title": "Gói 10,000 Lượt Xem Video / Shorts 1080p Giữ Chân Cao Tăng Đề Xuất",
    "category": "watch",
    "tag": "YouTube View 1080p",
    "price": "450,000đ",
    "originalPrice": "700,000đ",
    "priceNum": 450000,
    "targetQuantity": 10000,
    "unit": "Lượt Xem 1080p",
    "description": "10,000 Lượt xem video YouTube chất lượng cao (Full HD 1080p) giữ chân từ 60s - 3 phút. Kích hoạt thuật toán YouTube Suggested Videos và Browse Features để video tiếp cận hàng chục nghìn khán giả tự nhiên.",
    "features": [
      "10,000 Lượt xem chất lượng cao từ người dùng thật tại Việt Nam",
      "Thời lượng giữ chân cao (High Audience Retention Rate)",
      "Nguồn xem đến từ Đề xuất YouTube (Suggested Videos) và Tìm kiếm",
      "An toàn 100% cho kênh đã bật hoặc chưa bật kiếm tiền"
    ],
    "benefits": [
      "Đẩy video lên trang chủ và cột đề xuất bên phải YouTube",
      "TẶNG NGAY 1,000 Thả Like YouTube",
      "Mở khóa +2 Slot Nhiệm Vụ Tuần VIP",
      "Bảo hành lượt xem vĩnh viễn"
    ],
    "retentionRate": "98.8% Giữ Chân Đề Xuất",
    "bonusGifts": [
      "🎁 TẶNG 1,000 Like video",
      "⚡ Mở khóa +2 Slot Nhiệm Vụ Tuần",
      "🛡️ Bảo hành vĩnh viễn"
    ],
    "weeklySlotBonus": 2,
    "watchDurationNote": "Xem giữ chân chất lượng cao kích hoạt đề xuất",
    "estimatedDelivery": "Hoàn thành trong 24h - 48h",
    "badge": "Đề Xuất YouTube",
    "rating": 4.9,
    "reviewCount": 1120,
    "thumbnail": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80"
  },
  {
    "id": "pkg_yt_combo_partner",
    "platform": "youtube",
    "title": "Combo Bật Kiếm Tiền YouTube Trọn Gói (1k Subs + 4000h Xem + 10k View + 2k Like)",
    "category": "combo",
    "tag": "Combo Bật Kiếm Tiền",
    "price": "2,900,000đ",
    "originalPrice": "4,800,000đ",
    "priceNum": 2900000,
    "targetQuantity": 17000,
    "unit": "Combo Kiếm Tiền YPP",
    "description": "Giải pháp chìa khóa trao tay đưa kênh YouTube của bạn đủ điều kiện và bật kiếm tiền thành công 100%: 1,000 Subscribers thật + 4,000 Giờ xem chuẩn YPP + 10,000 View video + 2,000 Like. Tiết kiệm 40% chi phí so với mua lẻ.",
    "features": [
      "+1,000 Subscribers thật chống tụt 100%",
      "+4,000 Giờ xem công khai hợp lệ cập nhật YouTube Studio",
      "+10,000 Lượt xem video chất lượng cao 1080p",
      "+2,000 Thả Like tương tác kênh",
      "Hỗ trợ trọn gói từ gửi đơn đến khi nút Bật kiếm tiền sáng xanh"
    ],
    "benefits": [
      "Bật kiếm tiền YouTube Partner thành công 100%",
      "Mở khóa tối đa +6 Slot Nhiệm Vụ Tuần Cấp Tối Cao",
      "TẶNG KHÓA HỌC Xây dựng kênh YouTube triệu view chuẩn 2026",
      "Hỗ trợ 1-1 qua Zalo chuyên viên cao cấp"
    ],
    "retentionRate": "100% Thành Công Bật Kiếm Tiền",
    "bonusGifts": [
      "⚡ Mở khóa +6 Slot Nhiệm Vụ Tuần Tối Cao",
      "📚 Khóa học xây kênh YouTube triệu view",
      "👨‍💼 Hỗ trợ chuyên viên 1-1 bật kiếm tiền"
    ],
    "weeklySlotBonus": 6,
    "watchDurationNote": "Trọn gói đủ chuẩn xét duyệt YouTube Partner Program",
    "estimatedDelivery": "Hoàn tất trong 5 - 7 ngày",
    "badge": "YPP Pro VIP",
    "rating": 5,
    "reviewCount": 540,
    "thumbnail": "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=300&auto=format&fit=crop&q=80"
  }
];
