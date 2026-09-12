// Danh sách 100 Người Dùng Tham Gia Mới (Social Proof 100% Không Trùng Lặp)
export interface RecentJoinedUser {
  id: string;
  name: string;
  handle: string;
  location: string;
  action: string;
  timeAgo: string;
  initial: string;
  colorClass: string;
}

export const RECENT_JOINED_USERS_100: RecentJoinedUser[] = [
  {
    "id": "join_usr_001",
    "name": "Nguyễn Hoàng Long",
    "handle": "@hoanglong.creator",
    "location": "Hà Nội",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "Vừa xong",
    "initial": "L",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_002",
    "name": "Trần Thị Bích Ngọc",
    "handle": "@bichngoc.beauty",
    "location": "TP. Hồ Chí Minh",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "12 giây trước",
    "initial": "N",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_003",
    "name": "Lê Văn Hùng",
    "handle": "@hungreview.tech",
    "location": "Đà Nẵng",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "25 giây trước",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_004",
    "name": "Phạm Thanh Thảo",
    "handle": "@thaotho.live",
    "location": "Cần Thơ",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_005",
    "name": "Vũ Minh Tuấn",
    "handle": "@tuanminh.store",
    "location": "Hải Phòng",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_006",
    "name": "Hoàng Diệu Linh",
    "handle": "@linh_official",
    "location": "Bình Dương",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "1 phút trước",
    "initial": "L",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_007",
    "name": "Đỗ Khánh An",
    "handle": "@khanhan.daily",
    "location": "Đồng Nai",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "Vừa xong",
    "initial": "A",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_008",
    "name": "Bùi Gia Hưng",
    "handle": "@giahung_koc",
    "location": "Bắc Ninh",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "12 giây trước",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_009",
    "name": "Ngô Phương Thúy",
    "handle": "@thuyphuong.style",
    "location": "Quảng Ninh",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "25 giây trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_010",
    "name": "Dương Minh Triết",
    "handle": "@trietminh.vlog",
    "location": "Thanh Hóa",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_011",
    "name": "Võ Ngọc Hân",
    "handle": "@ngochan.bap",
    "location": "Nghệ An",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "45 giây trước",
    "initial": "H",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_012",
    "name": "Đinh Quang Huy",
    "handle": "@quanghuy.media",
    "location": "Thừa Thiên Huế",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "1 phút trước",
    "initial": "H",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_013",
    "name": "Lý Quốc Bảo",
    "handle": "@baoquoc.travel",
    "location": "Khánh Hòa",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "Vừa xong",
    "initial": "B",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_014",
    "name": "Trịnh Thu Trang",
    "handle": "@trangthu.farm",
    "location": "Lâm Đồng",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "12 giây trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_015",
    "name": "Mai Văn Phúc",
    "handle": "@phucmai.real",
    "location": "Bà Rịa - Vũng Tàu",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "25 giây trước",
    "initial": "P",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_016",
    "name": "Hồ Cẩm Tú",
    "handle": "@camtu.food",
    "location": "Kiên Giang",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_017",
    "name": "Lương Đức Trọng",
    "handle": "@trongduc.live",
    "location": "An Giang",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_018",
    "name": "Phan Thị Yến Nhi",
    "handle": "@yennhi_koc",
    "location": "Tiền Giang",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "1 phút trước",
    "initial": "N",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_019",
    "name": "Tạ Minh Đức",
    "handle": "@minhduc.review",
    "location": "Tây Ninh",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "Vừa xong",
    "initial": "Đ",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_020",
    "name": "Cao Hoàng Yến",
    "handle": "@hoangyen.glow",
    "location": "Bình Thuận",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "12 giây trước",
    "initial": "Y",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_021",
    "name": "Trương Thành Đạt",
    "handle": "@thanhdat.auto",
    "location": "Bình Phước",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "25 giây trước",
    "initial": "Đ",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_022",
    "name": "Đặng Ngọc Trâm",
    "handle": "@ngoctram.coco",
    "location": "Bến Tre",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_023",
    "name": "Nguyễn Văn Khang",
    "handle": "@khangvan.vlog",
    "location": "Đồng Tháp",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "45 giây trước",
    "initial": "K",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_024",
    "name": "Trần Quốc Tuấn",
    "handle": "@quoctuan.shop",
    "location": "Vĩnh Long",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "1 phút trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_025",
    "name": "Lê Thúy Kiều",
    "handle": "@thuykieu.cre",
    "location": "Trà Vinh",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "Vừa xong",
    "initial": "K",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_026",
    "name": "Phạm Minh Khôi",
    "handle": "@khoiminh.tech",
    "location": "Sóc Trăng",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "12 giây trước",
    "initial": "K",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_027",
    "name": "Vũ Quỳnh Nga",
    "handle": "@quynhnga.skin",
    "location": "Bạc Liêu",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "25 giây trước",
    "initial": "N",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_028",
    "name": "Hoàng Tiến Đạt",
    "handle": "@tiendat.sea",
    "location": "Cà Mau",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "38 giây trước",
    "initial": "Đ",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_029",
    "name": "Đỗ Mai Anh",
    "handle": "@maianh.decor",
    "location": "Hà Nam",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "45 giây trước",
    "initial": "A",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_030",
    "name": "Bùi Văn Hậu",
    "handle": "@vanhau.gym",
    "location": "Nam Định",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "1 phút trước",
    "initial": "H",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_031",
    "name": "Ngô Thị Thu Hà",
    "handle": "@thuha.baking",
    "location": "Thái Bình",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "Vừa xong",
    "initial": "H",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_032",
    "name": "Dương Đình Trọng",
    "handle": "@dinhtrong.reel",
    "location": "Ninh Bình",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "12 giây trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_033",
    "name": "Võ Thanh Tùng",
    "handle": "@thanhtung.digital",
    "location": "Hải Dương",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "25 giây trước",
    "initial": "T",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_034",
    "name": "Đinh Cẩm Ly",
    "handle": "@camly.fashion",
    "location": "Hưng Yên",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "38 giây trước",
    "initial": "L",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_035",
    "name": "Lý Gia Khiêm",
    "handle": "@giakhiem.play",
    "location": "Vĩnh Phúc",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "45 giây trước",
    "initial": "K",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_036",
    "name": "Trịnh Bích Phương",
    "handle": "@bichphuong.cosmetic",
    "location": "Bắc Giang",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "1 phút trước",
    "initial": "P",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_037",
    "name": "Mai Tiến Dũng",
    "handle": "@tiendung.koc",
    "location": "Thái Nguyên",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "Vừa xong",
    "initial": "D",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_038",
    "name": "Hồ Thị Thảo",
    "handle": "@thaothao.vibe",
    "location": "Phú Thọ",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "12 giây trước",
    "initial": "T",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_039",
    "name": "Lương Hoàng Nam",
    "handle": "@hoangnam.border",
    "location": "Lạng Sơn",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "25 giây trước",
    "initial": "N",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_040",
    "name": "Phan Quốc Việt",
    "handle": "@quocviet.tea",
    "location": "Tuyên Quang",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "38 giây trước",
    "initial": "V",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_041",
    "name": "Tạ Phương Thảo",
    "handle": "@phuongthao.trek",
    "location": "Hòa Bình",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_042",
    "name": "Cao Minh Hiếu",
    "handle": "@minhhieu.cloud",
    "location": "Yên Bái",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "1 phút trước",
    "initial": "H",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_043",
    "name": "Trương Mỹ Duyên",
    "handle": "@myduyen.sapa",
    "location": "Lào Cai",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "Vừa xong",
    "initial": "D",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_044",
    "name": "Đặng Tuấn Kiệt",
    "handle": "@tuankiet.mobi",
    "location": "Sơn La",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "12 giây trước",
    "initial": "K",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_045",
    "name": "Nguyễn Thu Uyên",
    "handle": "@thuuyen.flower",
    "location": "Điện Biên",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "25 giây trước",
    "initial": "U",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_046",
    "name": "Trần Bảo Long",
    "handle": "@baolong.peak",
    "location": "Lai Châu",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "38 giây trước",
    "initial": "L",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_047",
    "name": "Lê Hải Yến",
    "handle": "@haiyen.explore",
    "location": "Hà Giang",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "45 giây trước",
    "initial": "Y",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_048",
    "name": "Phạm Thành Long",
    "handle": "@thanhlong.geo",
    "location": "Cao Bằng",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "1 phút trước",
    "initial": "L",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_049",
    "name": "Vũ Đình Hưng",
    "handle": "@dinhhung.forest",
    "location": "Bắc Kạn",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "Vừa xong",
    "initial": "H",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_050",
    "name": "Hoàng Yến Nhi",
    "handle": "@yennhi.cave",
    "location": "Quảng Bình",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "12 giây trước",
    "initial": "N",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_051",
    "name": "Đỗ Anh Tuấn",
    "handle": "@anhtuan.river",
    "location": "Quảng Trị",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "25 giây trước",
    "initial": "T",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_052",
    "name": "Bùi Phương Linh",
    "handle": "@phuonglinh.hoi_an",
    "location": "Quảng Nam",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "38 giây trước",
    "initial": "L",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_053",
    "name": "Ngô Tấn Tài",
    "handle": "@tantai.stone",
    "location": "Quảng Ngãi",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_054",
    "name": "Dương Hoài Nam",
    "handle": "@hoainam.martial",
    "location": "Bình Định",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "1 phút trước",
    "initial": "N",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_055",
    "name": "Võ Bích Trâm",
    "handle": "@bichtram.yellow",
    "location": "Phú Yên",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "Vừa xong",
    "initial": "T",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_056",
    "name": "Đinh Trọng Nghĩa",
    "handle": "@trongnghia.coffee",
    "location": "Gia Lai",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "12 giây trước",
    "initial": "N",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_057",
    "name": "Lý Thảo Vy",
    "handle": "@thaovy.wood",
    "location": "Kon Tum",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "25 giây trước",
    "initial": "V",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_058",
    "name": "Trịnh Văn Quyết",
    "handle": "@vanquyet.bmt",
    "location": "Đắk Lắk",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "38 giây trước",
    "initial": "Q",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_059",
    "name": "Mai Thùy Chi",
    "handle": "@thuychi.waterfall",
    "location": "Đắk Nông",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "45 giây trước",
    "initial": "C",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_060",
    "name": "Hồ Thanh Sơn",
    "handle": "@thanhson.rice",
    "location": "Hậu Giang",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "1 phút trước",
    "initial": "S",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_061",
    "name": "Lương Gia Huy",
    "handle": "@giahuy.stream",
    "location": "Hà Nội",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "Vừa xong",
    "initial": "H",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_062",
    "name": "Phan Thị Minh Hằng",
    "handle": "@minhhang.studio",
    "location": "TP. Hồ Chí Minh",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "12 giây trước",
    "initial": "H",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_063",
    "name": "Tạ Quốc Cường",
    "handle": "@cuongquoc.design",
    "location": "Đà Nẵng",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "25 giây trước",
    "initial": "C",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_064",
    "name": "Cao Bích Thủy",
    "handle": "@bichthuy.babe",
    "location": "Cần Thơ",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_065",
    "name": "Trương Văn Lâm",
    "handle": "@vanlam.port",
    "location": "Hải Phòng",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "45 giây trước",
    "initial": "L",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_066",
    "name": "Đặng Kim Ngân",
    "handle": "@kimngan.shine",
    "location": "Bình Dương",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "1 phút trước",
    "initial": "N",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_067",
    "name": "Nguyễn Trọng Tín",
    "handle": "@trongtin.biz",
    "location": "Đồng Nai",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "Vừa xong",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_068",
    "name": "Trần Diệu Huyền",
    "handle": "@dieuhuyen.sing",
    "location": "Bắc Ninh",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "12 giây trước",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_069",
    "name": "Lê Hữu Đạt",
    "handle": "@huudat.miner",
    "location": "Quảng Ninh",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "25 giây trước",
    "initial": "Đ",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_070",
    "name": "Phạm Bích Thảo",
    "handle": "@bichthao.sun",
    "location": "Thanh Hóa",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_071",
    "name": "Vũ Hoàng Sơn",
    "handle": "@hoangson.lotus",
    "location": "Nghệ An",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "45 giây trước",
    "initial": "S",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_072",
    "name": "Hoàng Thu Trang",
    "handle": "@thutrang.palace",
    "location": "Thừa Thiên Huế",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "1 phút trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_073",
    "name": "Đỗ Trọng Hiếu",
    "handle": "@tronghieu.pearl",
    "location": "Khánh Hòa",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "Vừa xong",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_074",
    "name": "Bùi Mỹ Linh",
    "handle": "@mylinh.fog",
    "location": "Lâm Đồng",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "12 giây trước",
    "initial": "L",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_075",
    "name": "Ngô Văn Cường",
    "handle": "@vancuong.ship",
    "location": "Bà Rịa - Vũng Tàu",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "25 giây trước",
    "initial": "C",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_076",
    "name": "Dương Thanh Mai",
    "handle": "@thanhmai.island",
    "location": "Kiên Giang",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "38 giây trước",
    "initial": "M",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_077",
    "name": "Võ Đức Thắng",
    "handle": "@ducthang.border",
    "location": "An Giang",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_078",
    "name": "Đinh Lan Hương",
    "handle": "@lanhuong.fruit",
    "location": "Tiền Giang",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "1 phút trước",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_079",
    "name": "Lý Tuấn Vũ",
    "handle": "@tuanvu.sunworld",
    "location": "Tây Ninh",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "Vừa xong",
    "initial": "V",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_080",
    "name": "Trịnh Phương Nam",
    "handle": "@phuongnam.sand",
    "location": "Bình Thuận",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "12 giây trước",
    "initial": "N",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_081",
    "name": "Mai Ngọc Bích",
    "handle": "@ngocbich.cashew",
    "location": "Bình Phước",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "25 giây trước",
    "initial": "B",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_082",
    "name": "Hồ Quang Vinh",
    "handle": "@quangvinh.river",
    "location": "Bến Tre",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "38 giây trước",
    "initial": "V",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_083",
    "name": "Lương Ánh Dương",
    "handle": "@anhduong.lotus",
    "location": "Đồng Tháp",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "45 giây trước",
    "initial": "D",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_084",
    "name": "Phan Bảo Trân",
    "handle": "@baotran.clay",
    "location": "Vĩnh Long",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "1 phút trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_085",
    "name": "Tạ Duy Mạnh",
    "handle": "@duymanh.temple",
    "location": "Trà Vinh",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "Vừa xong",
    "initial": "M",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_086",
    "name": "Cao Thị Kim Oanh",
    "handle": "@kimoanh.moon",
    "location": "Sóc Trăng",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "12 giây trước",
    "initial": "O",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_087",
    "name": "Trương Thành Trung",
    "handle": "@thanhtrung.wind",
    "location": "Bạc Liêu",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "25 giây trước",
    "initial": "T",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_088",
    "name": "Đặng Thúy Nga",
    "handle": "@thuynga.cape",
    "location": "Cà Mau",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "38 giây trước",
    "initial": "N",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_089",
    "name": "Nguyễn Phúc Thịnh",
    "handle": "@phucthinh.techlab",
    "location": "Hà Nội",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "45 giây trước",
    "initial": "T",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_090",
    "name": "Trần Mai Phương",
    "handle": "@maiphuong.koc",
    "location": "TP. Hồ Chí Minh",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "1 phút trước",
    "initial": "P",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_091",
    "name": "Lê Hoàng Bách",
    "handle": "@hoangbach.dev",
    "location": "Đà Nẵng",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "Vừa xong",
    "initial": "B",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_092",
    "name": "Phạm Hồng Nhung",
    "handle": "@hongnhung.river",
    "location": "Cần Thơ",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "12 giây trước",
    "initial": "N",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_093",
    "name": "Vũ Đức Thịnh",
    "handle": "@ducthinh.flame",
    "location": "Hải Phòng",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "25 giây trước",
    "initial": "T",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_094",
    "name": "Hoàng Ngọc Diệp",
    "handle": "@ngocdiep.glow",
    "location": "Bình Dương",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "38 giây trước",
    "initial": "D",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_095",
    "name": "Đỗ Văn Quân",
    "handle": "@vanquan.rider",
    "location": "Đồng Nai",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "45 giây trước",
    "initial": "Q",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  },
  {
    "id": "join_usr_096",
    "name": "Bùi Thị Mai",
    "handle": "@thimai.folk",
    "location": "Bắc Ninh",
    "action": "Vừa đăng ký nhận +5.000 Xu & 1 lượt quay",
    "timeAgo": "1 phút trước",
    "initial": "M",
    "colorClass": "from-rose-500 to-amber-500 text-rose-300 border-rose-500/30"
  },
  {
    "id": "join_usr_097",
    "name": "Ngô Tuấn Anh",
    "handle": "@tuananh.bay",
    "location": "Quảng Ninh",
    "action": "Vừa liên kết TikTok nhận 50 follow chéo đầu tiên",
    "timeAgo": "Vừa xong",
    "initial": "A",
    "colorClass": "from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30"
  },
  {
    "id": "join_usr_098",
    "name": "Dương Thúy Hằng",
    "handle": "@thuyhang.model",
    "location": "Thanh Hóa",
    "action": "Vừa nhận 5.000 Xu làm nhiệm vụ xây kênh người thật",
    "timeAgo": "12 giây trước",
    "initial": "H",
    "colorClass": "from-purple-500 to-pink-500 text-purple-300 border-purple-500/30"
  },
  {
    "id": "join_usr_099",
    "name": "Võ Thành Nam",
    "handle": "@thanhnam.creator",
    "location": "Nghệ An",
    "action": "Vừa kích hoạt tài khoản kiếm tiền tại nhà 24/7",
    "timeAgo": "25 giây trước",
    "initial": "N",
    "colorClass": "from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30"
  },
  {
    "id": "join_usr_100",
    "name": "Đinh Kiều Trinh",
    "handle": "@kieutrinh.trend",
    "location": "TP. Hồ Chí Minh",
    "action": "Vừa tham gia cộng đồng follow chéo đẩy view thật",
    "timeAgo": "38 giây trước",
    "initial": "T",
    "colorClass": "from-amber-400 to-orange-500 text-amber-300 border-amber-500/30"
  }
];
