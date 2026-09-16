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
  PlusCircle,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  X,
  DollarSign,
  PieChart,
  Eye
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';
import { ServiceOrder } from '../../types';

export const BusinessPortalScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { 
    user, 
    campaigns,
    openOrderModal, 
    growthServices, 
    openLiveRunner, 
    openBuyerPortal, 
    openBookingModal,
    refundLivestreamOrder,
    updateOrderTargetUrl,
    showToast
  } = useTikTokApp();

  // 100% Genuine User Orders from State + Campaigns
  const genuineOrders: ServiceOrder[] = React.useMemo(() => {
    const userOrders = user.myOrders || [];
    if (userOrders.length > 0) return userOrders;

    // Convert active campaigns to ServiceOrders if user has created campaigns
    const userCampaigns = (campaigns || []).filter(c => c.targetUrl && c.targetUrl.length > 0);
    return userCampaigns.map(c => {
      const isLive = c.type === 'livestream' || c.type === 'livestream_viewers' || (c.targetUrl || '').includes('/live');
      return {
        id: c.id,
        packageId: `pkg_${c.type}_custom`,
        packageTitle: c.title,
        category: c.type,
        price: c.budgetTotal || `${((c.targetQuantity * 200)).toLocaleString()}đ`,
        targetUrl: c.targetUrl,
        targetQuantity: c.targetQuantity,
        completedQuantity: c.completedQuantity || 0,
        status: c.status === 'completed' ? 'completed' : 'running',
        createdAt: 'Vừa tạo',
        isLivePackage: isLive,
        deliveredEyes: isLive ? (c.completedQuantity || 0) : undefined,
        targetEyes: isLive ? c.targetQuantity : undefined,
        deliveredHearts: isLive ? Math.round((c.completedQuantity || 0) * 4.2) : undefined,
        deliveredComments: isLive ? Math.round((c.completedQuantity || 0) * 0.3) : undefined
      } as ServiceOrder;
    });
  }, [user.myOrders, campaigns]);

  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<string | null>(null);
  const [editingTargetUrl, setEditingTargetUrl] = useState<string>('');

  // State cho Pop-up Đối Soát Hoàn Tiền Phần Thiếu
  const [auditModalOrder, setAuditModalOrder] = useState<ServiceOrder | null>(null);

  // State cho Pop-up Thông Báo Hoàn Tiền Thành Công
  const [refundSuccessPopup, setRefundSuccessPopup] = useState<{
    open: boolean;
    orderTitle: string;
    orderId: string;
    refundAmount: number;
    completedPercent: number;
    remainingPercent: number;
    targetQty: number;
    completedQty: number;
    usedPrice: number;
  } | null>(null);

  const handleUpdateTargetUrl = (orderId: string) => {
    if (!editingTargetUrl.trim()) return;
    updateOrderTargetUrl(orderId, editingTargetUrl);
    setSelectedOrderForEdit(null);
    setEditingTargetUrl('');
  };

  // Mở modal đối soát chi tiết trước khi hoàn tiền
  const handleOpenAuditModal = (ord: ServiceOrder) => {
    setAuditModalOrder(ord);
  };

  // Thực hiện hoàn tiền phần thiếu sau khi khách xác nhận
  const handleConfirmRefund = () => {
    if (!auditModalOrder) return;
    const res = refundLivestreamOrder(auditModalOrder.id, `Đối soát hoàn tiền phần thiếu gói Live #${auditModalOrder.id}`);
    
    if (res.success) {
      setRefundSuccessPopup({
        open: true,
        orderTitle: auditModalOrder.packageTitle,
        orderId: auditModalOrder.id,
        refundAmount: res.refundAmount,
        completedPercent: res.completedPercent,
        remainingPercent: res.remainingPercent,
        targetQty: res.targetQty,
        completedQty: res.completedQty,
        usedPrice: res.usedPrice
      });
    }
    setAuditModalOrder(null);
  };

  const activeOrdersCount = genuineOrders.filter(o => o.status === 'running').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* KHỐI GỘP DUY NHẤT: TRUNG TÂM TĂNG TRƯỞNG DOANH NGHIỆP & BOOKING KOC KÝ QUỸ */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold font-mono uppercase">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                QUẢN LÝ CHIẾN DỊCH & PHÂN PHỐI GÓI
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3 text-amber-300" />
                Tiết Kiệm 70% Chi Phí
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                Đối Soát Hoàn Tiền Phần Thiếu
              </span>
              <FeatureGuideTooltip
                title="Hướng Dẫn Cổng Doanh Nghiệp & Booking KOC"
                description="Giải pháp tăng trưởng doanh số và review sản phẩm toàn diện cho Chủ shop & Doanh nghiệp với chi phí rẻ hơn thị trường rất nhiều."
                steps={[
                  "Đúng tệp khách hàng thật: Tiếp cận người dùng thực tế đang hoạt động hàng ngày",
                  "Booking KOC ký quỹ: Hợp đồng Escrow bảo vệ 100% tiền cọc, nghiệm thu 3 ngày mới giải ngân",
                  "Phân bổ link linh hoạt: Thay đổi kênh TikTok, link video hoặc live bất cứ lúc nào",
                  "Chính sách over-delivery +2%: Tự động chạy dôi dư 2% bù đắp hao hụt cho video và follow",
                  "Đối soát hoàn tiền minh bạch Livestream: Hệ thống chỉ tính phí cho số mắt live người dùng đã vào xem thực tế và hoàn trả chính xác 100% số tiền của phần chưa đạt chỉ tiêu"
                ]}
                tips="Chi phí booking chỉ từ 160.000đ/video, không qua trung gian môi giới."
                badge="Doanh Nghiệp VIP"
                placement="bottom"
              />
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight font-display">
              Tăng Trưởng Doanh Số &amp; Bảng Điều Khiển Trả Gói Tự Động
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Quản lý và theo dõi <strong>100% gói dịch vụ thật</strong> đang phân bổ. Tự động áp dụng cơ chế <strong>chạy dư +2% bù trừ hao hụt</strong> cho video/follow và <strong>đối soát hoàn tiền phần thiếu minh bạch</strong> nếu phiên livestream chưa đạt đủ chỉ tiêu.
            </p>
          </div>

          {/* Quick CTA Actions & Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center flex items-center justify-between lg:justify-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Gói Đang Phân Phối:</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {activeOrdersCount} Đang Chạy (100% Thật)
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
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all font-display whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Mua Gói Tăng Trưởng</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Value Highlights in 1 Compact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-display text-xs">
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Chạy Dư +2% Bù Trừ Hao Hụt</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              100 follow chạy đến 102, 1000 follow chạy đến 1020 để cam kết đủ 100% sau hao hụt.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5 font-display text-xs">
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Đối Soát Hoàn Tiền Phần Thiếu</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Chỉ tính phí số lượng mắt xem đã vào thực tế, hoàn trả 100% số tiền của phần chưa đạt.
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
                Bảng Điều Khiển Phân Bổ & Trả Gói Tự Động ({genuineOrders.length} Gói Đang Xử Lý)
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
              Thay đổi đường link đích, kiểm tra tiến độ trả gói theo thời gian thực và đối soát hoàn tiền phần thiếu minh bạch
            </p>
          </div>

          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tự Động Kết Nối API TikTok 24/7</span>
          </span>
        </div>

        {/* Empty State when no orders exist */}
        {genuineOrders.length === 0 ? (
          <div className="py-12 px-6 text-center space-y-4 rounded-2xl bg-black/30 border border-dashed border-white/10">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-8 h-8 opacity-70" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white font-display">Chưa Có Gói Dịch Vụ Nào Đang Chạy</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Tất cả các gói tăng trưởng follow, video, mắt livestream hoặc booking KOC của bạn sẽ xuất hiện tại đây với đầy đủ thông số thời gian thực và chính sách đối soát hoàn tiền minh bạch.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openOrderModal(growthServices[0])}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Chọn Mua Gói Tăng Trưởng</span>
              </button>
              <button
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-pink-400" />
                <span>Thuê KOC Review</span>
              </button>
            </div>
          </div>
        ) : (
          /* Orders Cards Grid */
          <div className="space-y-4">
            {genuineOrders.map((ord) => {
              // Quy tắc +2% over-delivery cho video / follow (100 -> 102, 1000 -> 1020)
              const isLive = ord.isLivePackage || ord.category === 'livestream' || (ord.targetUrl || '').includes('/live');
              const bufferOverDelivery = !isLive ? Math.round((ord.targetQuantity || 100) * 0.02) : 0;
              const effectiveTarget = (ord.targetQuantity || 100) + bufferOverDelivery;
              const completedCount = ord.completedQuantity || ord.deliveredEyes || 0;
              const percent = Math.min(100, Math.round((completedCount / effectiveTarget) * 100));
              const isEditing = selectedOrderForEdit === ord.id;
              const isRefunded = ord.status === 'refunded';

              return (
                <div 
                  key={ord.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    isRefunded 
                      ? 'bg-red-950/20 border-red-500/30' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isRefunded
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : ord.status === 'running'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {isRefunded ? `💰 Đã Hoàn Phần Thiếu (+${(ord.refundedAmount || 0).toLocaleString()}đ)` : ord.status === 'running' ? '⚡ Đang Phân Phối' : '✓ Hoàn Tất'}
                        </span>
                        
                        {!isLive && bufferOverDelivery > 0 && !isRefunded && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                            +2% Bù Hao Hụt (+{bufferOverDelivery.toLocaleString()})
                          </span>
                        )}

                        {isLive && !isRefunded && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                            🛡️ Bảo Hiểm Hoàn Tiền Phần Thiếu
                          </span>
                        )}

                        <span className="text-xs font-mono text-slate-400">Mã đơn: #{ord.id}</span>
                        <span className="text-xs font-mono text-slate-400">• Đặt lúc: {ord.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-display">{ord.packageTitle}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-amber-400 font-mono">{ord.price}</span>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {completedCount.toLocaleString()} / {effectiveTarget.toLocaleString()} {!isLive && `(Gốc: ${ord.targetQuantity.toLocaleString()})`}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">
                        {isRefunded ? 'Trạng thái đối soát:' : 'Tiến độ thực tế (kèm +2% bù trừ):'}
                      </span>
                      <span className={`font-bold ${isRefunded ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {isRefunded 
                          ? `Đã hoàn trả ${ord.refundedPercent || (100 - percent)}% phần chưa đạt (+${(ord.refundedAmount || 0).toLocaleString()} Xu)` 
                          : `${percent}%`}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isRefunded 
                            ? 'bg-rose-500' 
                            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
                        }`}
                        style={{ width: `${isRefunded ? 100 : percent}%` }}
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
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 cursor-pointer"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setSelectedOrderForEdit(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
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
                          {!isRefunded && (
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(ord.id);
                                setEditingTargetUrl(ord.targetUrl);
                              }}
                              className="text-[11px] text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 cursor-pointer transition-all"
                            >
                              Đổi Link
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Livestream Controls & Refund Action */}
                    {isLive && (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <span>👁️ {ord.deliveredEyes || 0} mắt</span>
                        <span>❤️ {ord.deliveredHearts || 0} tim</span>
                        <span>💬 {ord.deliveredComments || 0} cmt</span>
                        
                        {!isRefunded ? (
                          <>
                            <button
                              onClick={openBuyerPortal}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold transition-all ml-1 flex items-center gap-1 cursor-pointer"
                            >
                              <Radio className="h-3 w-3 animate-pulse" />
                              <span>Điều Phối Mắt Live</span>
                            </button>

                            <button
                              onClick={() => handleOpenAuditModal(ord)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                              title="Kiểm tra đối soát & nhận lại tiền phần mắt xem chưa đạt"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Đối Soát &amp; Hoàn Tiền Phần Thiếu</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                            ✓ Đã đối soát và hoàn tiền phần thiếu vào ví
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
              "1. Gói Follower: Hệ thống tự động bù +2% số lượng để đảm bảo sau hao hụt tự nhiên vẫn đạt 100% mục tiêu",
              "2. Gói Mắt Live: Bảo hiểm đối soát minh bạch - chỉ tính phí số lượng người thật đã xem, hoàn trả 100% phần chưa đạt",
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
              Cách Tối Ưu Gói Tăng Follower Thật (+2% Dôi Dư)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dán đúng đường link trang chủ kênh TikTok của bạn (dạng `https://tiktok.com/@handle`). Đảm bảo kênh đang ở chế độ Công khai (Public). Hệ thống sẽ chạy dôi dư 2% (ví dụ 1000 follow sang 1020 follow) để đảm bảo không bị hụt.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Chính Sách Đối Soát Hoàn Tiền Phần Thiếu Mắt Live
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hệ thống bảo vệ quyền lợi 2 chiều: Người tham gia làm nhiệm vụ xem live đã nhận đủ Xu cho phần đã xem; Chủ phòng live được nhận lại 100% số tiền của phần chưa đạt chỉ tiêu. Bấm nút <strong>Đối Soát &amp; Hoàn Tiền Phần Thiếu</strong> để kiểm tra báo cáo và nhận tiền hoàn ngay.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: BẢNG BÁO CÁO ĐỐI SOÁT & XÁC NHẬN HOÀN TIỀN PHẦN THIẾU */}
      {auditModalOrder && (() => {
        const targetQty = auditModalOrder.targetQuantity || 1000;
        const completedQty = auditModalOrder.completedQuantity || auditModalOrder.deliveredEyes || 0;
        const remainingQty = Math.max(0, targetQty - completedQty);
        const completedPercent = Math.min(100, Math.round((completedQty / targetQty) * 100));
        const remainingPercent = 100 - completedPercent;

        const totalPriceNumeric = parseInt((auditModalOrder.price || '0').replace(/[^0-9]/g, ''), 10) || (targetQty * 200);
        const usedPrice = Math.round(totalPriceNumeric * (completedPercent / 100));
        const refundAmount = Math.max(0, totalPriceNumeric - usedPrice);

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#0D111E] rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-7 space-y-5">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white font-display">
                        Bảng Đối Soát Hoàn Tiền Gói Livestream
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        Mã đơn: #{auditModalOrder.id} • {auditModalOrder.packageTitle}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setAuditModalOrder(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Đã xem &amp; Trả Xu: {completedPercent}% ({completedQty.toLocaleString()} mắt)
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Chưa đạt &amp; Hoàn trả: {remainingPercent}% ({remainingQty.toLocaleString()} mắt)
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-black/80 overflow-hidden flex border border-white/10">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${completedPercent}%` }}
                    title={`Đã hoàn thành ${completedPercent}%`}
                  />
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${remainingPercent}%` }}
                    title={`Hoàn trả phần thiếu ${remainingPercent}%`}
                  />
                </div>
              </div>

              {/* Detailed Financial Audit Grid */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">1. Tổng Ngân Sách Đã Thanh Toán:</span>
                  <span className="text-white font-bold">{totalPriceNumeric.toLocaleString()}đ ({targetQty.toLocaleString()} mắt)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                  <span className="text-slate-300">2. Đã Phân Phối (Đã Trả Thưởng Cho Người Dùng):</span>
                  <span className="font-bold">-{usedPrice.toLocaleString()}đ ({completedQty.toLocaleString()} mắt - {completedPercent}%)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300">
                  <span className="text-slate-300">3. Phần Chưa Phân Phối / Còn Thiếu:</span>
                  <span className="font-bold">{remainingQty.toLocaleString()} mắt ({remainingPercent}%)</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-sm">
                  <span className="font-bold text-white font-sans flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Số Tiền Hoàn Trả Vào Ví:
                  </span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    +{refundAmount.toLocaleString()} Xu
                  </span>
                </div>
              </div>

              {/* Transparency Guarantee Note */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200/90 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Cam kết bảo vệ 2 chiều:</strong> Người dùng tham gia xem phiên live đã nhận đủ Xu cho phần đã xem ({completedQty.toLocaleString()} mắt). Phần ngân sách chưa phân phối ({remainingQty.toLocaleString()} mắt) được hoàn trả ngay lập tức vào số dư ví của bạn.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setAuditModalOrder(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Đóng / Xem Lại
                </button>
                <button
                  onClick={handleConfirmRefund}
                  disabled={refundAmount <= 0}
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    refundAmount > 0
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-amber-900/40 active:scale-95'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Xác Nhận Nhận Tiền Hoàn (+{refundAmount.toLocaleString()} Xu)</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL 2: POP-UP THÔNG BÁO HOÀN TIỀN THÀNH CÔNG RÕ RÀNG */}
      {refundSuccessPopup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md bg-[#0D111E] rounded-3xl border border-emerald-500/40 shadow-2xl p-6 sm:p-7 text-center space-y-4">
            
            {/* Success Badge */}
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40 animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white font-display">
                Đối Soát &amp; Hoàn Tiền Thành Công!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Đã hoàn trả chính xác số tiền phần mắt livestream chưa đạt vào số dư ví của bạn.
              </p>
            </div>

            {/* Financial Summary Card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span>Gói dịch vụ:</span>
                <span className="text-white font-bold truncate max-w-[180px]">{refundSuccessPopup.orderTitle}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Đã trả cho người dùng:</span>
                <span className="text-emerald-400 font-bold">{refundSuccessPopup.completedQty.toLocaleString()}/{refundSuccessPopup.targetQty.toLocaleString()} mắt ({refundSuccessPopup.completedPercent}%)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tỷ lệ hoàn trả:</span>
                <span className="text-amber-400 font-bold">{refundSuccessPopup.remainingPercent}% (Phần chưa phân phối)</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-white font-bold">Số tiền đã cộng vào ví:</span>
                <span className="text-base font-black text-emerald-400">+{refundSuccessPopup.refundAmount.toLocaleString()} Xu</span>
              </div>
            </div>

            <button
              onClick={() => setRefundSuccessPopup(null)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
            >
              Đã Hiểu &amp; Đóng Thông Báo
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
