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
  RotateCcw
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

  const handleUpdateTargetUrl = (orderId: string) => {
    if (!editingTargetUrl.trim()) return;
    updateOrderTargetUrl(orderId, editingTargetUrl);
    setSelectedOrderForEdit(null);
    setEditingTargetUrl('');
  };

  const handleRefundLive = (orderId: string, orderTitle: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn yêu cầu hoàn tiền 100% cho gói livestream "${orderTitle}" do không đạt target cam kết?`)) {
      refundLivestreamOrder(orderId, 'Phiên live không đạt đủ chỉ tiêu mắt xem cam kết');
    }
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
                CỔNG DOANH NGHIỆP & KẾT NỐI KOC
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3 text-amber-300" />
                Tiết Kiệm 70% Chi Phí
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                Hoàn Tiền 100% Nếu Không Đạt
              </span>
              <FeatureGuideTooltip
                title="Hướng Dẫn Cổng Doanh Nghiệp & Booking KOC"
                description="Giải pháp tăng trưởng doanh số và review sản phẩm toàn diện cho Chủ shop & Doanh nghiệp với chi phí rẻ hơn thị trường rất nhiều."
                steps={[
                  "Đúng tệp khách hàng thật: Tiếp cận người dùng thực tế đang hoạt động hàng ngày",
                  "Booking KOC ký quỹ: Hợp đồng Escrow bảo vệ 100% tiền cọc, nghiệm thu 3 ngày mới giải ngân",
                  "Phân bổ link linh hoạt: Thay đổi kênh TikTok, link video hoặc live bất cứ lúc nào",
                  "Chính sách over-delivery +2%: Tự động chạy dôi dư 2% bù đắp hao hụt (ví dụ 100 -> 102 follow, 1000 -> 1020 follow)",
                  "Hoàn tiền 100% Livestream: Nếu phiên live không đạt đủ mắt xem/thời lượng cam kết, hệ thống hoàn tiền 100% ngay tức thì"
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
              Quản lý và theo dõi <strong>100% gói dịch vụ thật</strong> đang phân bổ. Tự động áp dụng cơ chế <strong>chạy dư +2% bù trừ hao hụt</strong> cho video/follow và <strong>cam kết hoàn tiền 100%</strong> nếu phiên livestream không đạt đủ chỉ tiêu.
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
              <span>Cam Kết Hoàn Tiền 100% Live</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Nếu phiên live không đạt đủ mắt xem/target cam kết, hoàn 100% tiền vào số dư tức thì.
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
              Thay đổi đường link đích, kiểm tra tiến độ trả gói theo thời gian thực và tự động hoàn tiền nếu phiên live không đạt target
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
                Tất cả các gói tăng trưởng follow, video, mắt livestream hoặc booking KOC của bạn sẽ xuất hiện tại đây với đầy đủ thông số thời gian thực và chính sách hoàn tiền 100%.
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
              const percent = Math.min(100, Math.round(((ord.completedQuantity || 0) / effectiveTarget) * 100));
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
                          {isRefunded ? '💰 Đã Hoàn Tiền 100%' : ord.status === 'running' ? '⚡ Đang Phân Phối' : '✓ Hoàn Tất'}
                        </span>
                        
                        {!isLive && bufferOverDelivery > 0 && !isRefunded && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                            +2% Bù Hao Hụt (+{bufferOverDelivery.toLocaleString()})
                          </span>
                        )}

                        {isLive && !isRefunded && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                            🛡️ Bảo Hiểm Hoàn Tiền 100%
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
                        {(ord.completedQuantity || 0).toLocaleString()} / {effectiveTarget.toLocaleString()} {!isLive && `(Gốc: ${ord.targetQuantity.toLocaleString()})`}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">
                        {isRefunded ? 'Trạng thái hoàn trả:' : 'Tiến độ thực tế (kèm +2% bù trừ):'}
                      </span>
                      <span className={`font-bold ${isRefunded ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {isRefunded ? 'Đã hoàn tiền 100% vào số dư' : `${percent}%`}
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
                              onClick={() => handleRefundLive(ord.id, ord.packageTitle)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                              title="Bấm để nhận hoàn tiền 100% nếu phiên live không đạt chỉ tiêu cam kết"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Hoàn Tiền 100% Gói Live</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                            ✓ Đã hoàn trả vào số dư ví
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
              "2. Gói Mắt Live: Bảo hành hoàn tiền 100% nếu phiên live gặp lỗi hoặc không đạt mắt xem cam kết",
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
              Chính Sách Hoàn Tiền 100% Mắt Livestream
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Nếu vì bất kỳ lý do gì mà phiên live của bạn không nhận đủ mắt xem hay tương tác cam kết, bạn chỉ cần bấm nút <strong>Hoàn Tiền 100% Gói Live</strong> ngay trên bảng điều khiển. Số tiền sẽ được hoàn trả tự động vào số dư của bạn.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
