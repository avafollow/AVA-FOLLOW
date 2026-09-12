import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Users, 
  Radio, 
  Heart, 
  MessageSquare, 
  Layers, 
  Award, 
  FileText, 
  Headphones, 
  ArrowRight,
  TrendingUp,
  Sliders,
  Check,
  Zap,
  HelpCircle,
  Handshake,
  Target,
  Video,
  PlusCircle
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { ServiceOrder } from '../../types';

export const BusinessPortalScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { user, openOrderModal, growthServices, openLiveRunner, openBuyerPortal, openBookingModal } = useTikTokApp();

  // Mock enterprise active orders
  const [activeOrders, setActiveOrders] = useState<ServiceOrder[]>([
    {
      id: 'ord_ent_001',
      packageId: 'pkg_follow_4',
      packageTitle: 'Gói 10,000 Follower Bứt Phá Doanh Số Shop',
      category: 'follow',
      price: '1,800,000đ',
      targetUrl: 'https://tiktok.com/@zenskin_vietnam',
      targetQuantity: 10000,
      completedQuantity: 7420,
      status: 'running',
      createdAt: 'Hôm qua, 09:15'
    },
    {
      id: 'ord_ent_002',
      packageId: 'pkg_live_3',
      packageTitle: 'Gói 1,000 Mắt Xem Live 3 Tiếng Mega Sale',
      category: 'livestream',
      price: '1,200,000đ',
      targetUrl: 'https://tiktok.com/@zenskin_vietnam/live',
      targetQuantity: 1000,
      completedQuantity: 650,
      status: 'running',
      createdAt: 'Hôm nay, 10:00',
      isLivePackage: true,
      deliveredEyes: 840,
      targetEyes: 1000,
      deliveredHearts: 4200,
      deliveredComments: 310
    },
    {
      id: 'ord_ent_003',
      packageId: 'pkg_comment_3',
      packageTitle: 'Gói 500 Comment Khách Hỏi Mua Tranh Nhau (FOMO)',
      category: 'comment',
      price: '380,000đ',
      targetUrl: 'https://tiktok.com/@zenskin_vietnam/video/739123456',
      targetQuantity: 500,
      completedQuantity: 500,
      status: 'completed',
      createdAt: '2 ngày trước'
    }
  ]);

  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<string | null>(null);
  const [editingTargetUrl, setEditingTargetUrl] = useState<string>('');

  const handleUpdateTargetUrl = (orderId: string) => {
    if (!editingTargetUrl.trim()) return;
    setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, targetUrl: editingTargetUrl } : o));
    setSelectedOrderForEdit(null);
    setEditingTargetUrl('');
    alert('Đã cập nhật đường link TikTok đích thành công! Hệ thống đang điều phối nhiệm vụ mới.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* KHỐI GỘP DUY NHẤT: TRUNG TÂM TĂNG TRƯỞNG DOANH NGHIỆP & BOOKING KOC KÝ QUỸ */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold font-mono uppercase">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                CỔNG DOANH NGHIỆP & KẾT NỐI KOC
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3 text-amber-300" />
                Tiết Kiệm 70% Chi Phí
              </span>
              <FeatureGuideTooltip
                title="Hướng Dẫn Cổng Doanh Nghiệp & Booking KOC"
                description="Giải pháp tăng trưởng doanh số và review sản phẩm toàn diện cho Chủ shop & Doanh nghiệp với chi phí rẻ hơn thị trường rất nhiều."
                steps={[
                  "Đúng tệp khách hàng thật: Tiếp cận người dùng thực tế đang hoạt động hàng ngày",
                  "Booking KOC ký quỹ: Hợp đồng Escrow bảo vệ 100% tiền cọc, nghiệm thu 3 ngày mới giải ngân",
                  "Phân bổ link linh hoạt: Thay đổi kênh TikTok, link video hoặc live bất cứ lúc nào",
                  "Bảo hành chống tụt: Cam kết bù số lượng nếu có hao hụt trong 30-60 ngày"
                ]}
                tips="Chi phí booking chỉ từ 160.000đ/video, không qua trung gian môi giới."
                badge="Doanh Nghiệp VIP"
                placement="bottom"
              />
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight font-display">
              Tăng Trưởng Doanh Số &amp; Kết Nối Mạng Lưới KOC Uy Tín
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Kết nối trực tiếp <strong>KOC người thật</strong> review sản phẩm &amp; bán hàng đúng tệp khách hàng tiềm năng. Tiết kiệm <strong>70% chi phí</strong>, an toàn tuyệt đối với <strong>Hợp đồng Ký quỹ Escrow</strong> bảo vệ 100% tiền cọc.
            </p>
          </div>

          {/* Quick CTA Actions & Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center flex items-center justify-between lg:justify-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Gói Hoạt Động:</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {activeOrders.filter(o => o.status === 'running').length} Đang Chạy (100% Thật)
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openBookingModal()}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center gap-1.5 transition-all font-display cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-amber-300" />
                <span>Thuê KOC Ký Quỹ</span>
              </button>

              <button
                onClick={() => openOrderModal(growthServices[0])}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all font-display whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Gói Tăng Trưởng</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Value Highlights in 1 Compact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-display text-xs">
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Đúng Tệp Khách Thật</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              100% người thật trong nền tảng sẵn sàng trải nghiệm sản phẩm và ra đơn.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 font-display text-xs">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Giá Rẻ Hơn 70%</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Chỉ từ 160.000đ/video, không qua trung gian môi giới ăn hoa hồng kênh.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="font-bold text-purple-400 flex items-center gap-1.5 font-display text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Ký Quỹ Escrow An Toàn</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Sàn giữ cọc, nghiệm thu video đạt chuẩn sau 3 ngày mới thanh toán cho KOC.
            </p>
          </div>
        </div>
      </div>



      {/* Section: Danh Sách Gói Doanh Nghiệp Đang Hoạt Động & Bộ Điều Khiển Phân Bổ */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase font-display flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Bảng Điều Khiển Phân Bổ & Trả Gói Tự Động ({activeOrders.length} Gói Đã Mua)
              </h3>
              <FeatureGuideTooltip
                title="Hướng Dẫn Phân Bổ Đường Link Đích"
                description="Bạn có thể thay đổi đường link kênh TikTok hoặc link video/livestream bất kỳ lúc nào để hệ thống dồn mắt xem và lượt tương tác vào đúng nội dung bạn mong muốn."
                steps={[
                  "Bước 1: Bấm 'Thay Đổi Link Đích' tại gói dịch vụ bạn muốn cập nhật",
                  "Bước 2: Dán đường link kênh TikTok (nếu là gói Follow) hoặc link video/live",
                  "Bước 3: Bấm 'Xác Nhận Cập Nhật'. Hệ thống sẽ tự động chuyển hướng người dùng ngay trong 30 giây"
                ]}
                tips="Đối với gói Livestream, hãy cập nhật link phòng live trước khi lên sóng 5 - 10 phút để hệ thống gom sẵn người xem."
                badge="Linh Hoạt 100%"
                placement="right"
              />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Thay đổi đường link đích, kiểm tra tiến độ trả gói theo thời gian thực và xem báo cáo tương tác
            </p>
          </div>

          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tự Động Kết Nối API TikTok 24/7</span>
          </span>
        </div>

        {/* Orders Cards Grid */}
        <div className="space-y-4">
          {activeOrders.map((ord) => {
            const percent = Math.min(100, Math.round((ord.completedQuantity / ord.targetQuantity) * 100));
            const isEditing = selectedOrderForEdit === ord.id;

            return (
              <div 
                key={ord.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        ord.status === 'running'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {ord.status === 'running' ? '⚡ Đang Phân Phối' : '✓ Hoàn Tất'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Mã đơn: #{ord.id}</span>
                      <span className="text-xs font-mono text-slate-400">• Đặt lúc: {ord.createdAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display">{ord.packageTitle}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-amber-400 font-mono">{ord.price}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {ord.completedQuantity.toLocaleString()} / {ord.targetQuantity.toLocaleString()} hoàn thành
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Tiến độ thực tế:</span>
                    <span className="text-indigo-400 font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Target URL & Dispatch Controller */}
                <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <span className="text-slate-400 shrink-0 font-semibold">Link Đích Nhận Tương Tác:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingTargetUrl}
                          onChange={(e) => setEditingTargetUrl(e.target.value)}
                          placeholder="Dán link TikTok mới..."
                          className="flex-1 bg-black/80 border border-indigo-500 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateTargetUrl(ord.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setSelectedOrderForEdit(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 truncate">
                        <a 
                          href={ord.targetUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-cyan-400 underline font-mono truncate max-w-sm hover:text-cyan-300"
                        >
                          {ord.targetUrl}
                        </a>
                        <button
                          onClick={() => {
                            setSelectedOrderForEdit(ord.id);
                            setEditingTargetUrl(ord.targetUrl);
                          }}
                          className="text-[11px] text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30"
                        >
                          Đổi Link
                        </button>
                      </div>
                    )}
                  </div>

                  {ord.isLivePackage && (
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                      <span>👁️ {ord.deliveredEyes || 0} mắt</span>
                      <span>❤️ {ord.deliveredHearts || 0} tim</span>
                      <span>💬 {ord.deliveredComments || 0} cmt</span>
                      <button
                        onClick={openBuyerPortal}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold transition-all ml-1 flex items-center gap-1"
                      >
                        <Radio className="h-3 w-3 animate-pulse" />
                        <span>Điều Phối Mắt Live & Seeding</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Hướng Dẫn Sử Dụng Từng Gói Dịch Vụ Chuẩn AVA FOLLOW */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30 border border-purple-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white font-display">
            Cẩm Nang Hướng Dẫn Tối Ưu Từng Gói Dành Cho Doanh Nghiệp
          </h3>
          <FeatureGuideTooltip
            title="Chiến Lược Tăng Trưởng Toàn Diện 2026"
            description="Quy chuẩn vận hành dịch vụ giúp kênh doanh nghiệp bứt phá mà không vi phạm chính sách của TikTok Shop."
            steps={[
              "1. Gói Follower: Nên kết hợp đăng 2-3 video chất lượng cao mỗi tuần để giữ chân người theo dõi mới",
              "2. Gói Mắt Live: Đảm bảo ánh sáng, âm thanh rõ nét và có bảng giá Flash Sale hấp dẫn để chốt đơn",
              "3. Gói Comment Seeding: Chuẩn bị sẵn 10-20 câu hỏi về công dụng, giá cả để kích thích khách hàng thật bình luận theo",
              "4. Gói Booking KOC: Nghiệm thu kỹ video demo trong vòng 72 giờ bảo hành trước khi video lên xu hướng"
            ]}
            tips="Tận dụng Token của sàn để mua gói combo giúp giảm tới 30% chi phí so với mua lẻ từng dịch vụ."
            badge="Bí Quyết Triệu View"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Cách Tối Ưu Gói Tăng Follower Thật
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dán đúng đường link trang chủ kênh TikTok của bạn (dạng `https://tiktok.com/@handle`). Đảm bảo kênh đang ở chế độ Công khai (Public) và không bật chế độ duyệt người theo dõi thủ công.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Cách Kích Hoạt Gói Mắt Xem Livestream
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Khi bạn bắt đầu bấm phát trực tiếp trên TikTok, sao chép ngay đường link phòng live (hoặc vào mục Kích Hoạt Live Chủ Shop trên Header) và dán link vào hệ thống. Mắt xem sẽ vào phòng đều đặn trong vòng 2 - 3 phút.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
