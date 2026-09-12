import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Building2, 
  UserCheck, 
  Clock, 
  Lock, 
  AlertCircle, 
  Award,
  Calendar,
  DollarSign,
  Video,
  Sparkles,
  Layers,
  CheckCircle2,
  Link,
  Share2,
  Phone,
  MapPin,
  Edit3
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';
import { 
  KOC_INDUSTRY_SECTORS, 
  KOC_DELIVERABLE_TYPES, 
  DURATION_FACTORS, 
  generateLegalContractText 
} from '../../data/kocPricingAndContract';

interface EscrowContractModalProps {
  contract: EscrowBookingContract | null;
  isOpen: boolean;
  onClose: () => void;
  isDraftPreview?: boolean;
  onSignContract?: (contractId: string) => void;
  currentRole?: 'client' | 'koc' | 'admin';
}

export const EscrowContractModal: React.FC<EscrowContractModalProps> = ({
  contract,
  isOpen,
  onClose,
  isDraftPreview = false,
  onSignContract,
  currentRole = 'client'
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw_legal'>('formatted');

  if (!isOpen || !contract) return null;

  // Resolve industry sector label
  const industry = KOC_INDUSTRY_SECTORS.find(i => i.id === contract.industrySector) || {
    id: 'general',
    name: contract.industrySector || 'Mỹ Phẩm & Tiêu Dùng',
    icon: '📦',
    rateMultiplier: 1.0,
    description: '',
    sampleRequirements: 'Gửi mẫu nguyên seal chính hãng'
  };

  // Resolve deliverable type label
  const deliverable = KOC_DELIVERABLE_TYPES.find(d => d.id === contract.deliverableType) || {
    id: contract.category || 'review',
    name: contract.deliverableType || 'Video Review Trải Nghiệm Thực Tế (Gắn Giỏ Hàng)',
    badge: 'Tiêu Chuẩn',
    icon: '🎬',
    description: '',
    outputFormat: 'Video dọc 9:16 Full HD 1080p',
    basePriceHuman1Min: 650000,
    basePriceAi1Min: 180000
  };

  // Resolve duration label
  const durationInfo = contract.videoDuration ? DURATION_FACTORS[contract.videoDuration] : DURATION_FACTORS['3_min'];
  const durationLabel = durationInfo?.label || '3 Phút';

  const rawTotalAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, '')) || 1500000;
  const rawFloorPerUnit = contract.floorUnitPrice || Math.round(rawTotalAmount / Math.max(1, contract.videoQuantity));
  const rawAgreedPerUnit = contract.agreedUnitPrice || Math.round(rawTotalAmount / Math.max(1, contract.videoQuantity));
  const kocEarnings = Math.round(rawTotalAmount * 0.8);
  const platformFee = Math.round(rawTotalAmount * 0.2);

  const deliveryDeadlineDisplay = contract.deliveryDeadlineDate || `${contract.deadlineDays || 5} ngày kể từ ngày nhận mẫu nguyên seal`;

  const fullLegalText = generateLegalContractText({
    contractCode: contract.contractCode,
    createdDate: contract.createdAt || 'Hôm nay',
    clientName: contract.clientName,
    clientPhone: contract.clientPhone,
    clientAddress: contract.clientAddress,
    kocName: contract.kocName,
    kocHandle: contract.kocHandle,
    sampleReturnAddress: contract.sampleReturnAddress,
    productName: contract.productName,
    industrySectorName: contract.customIndustryName ? `Khác: ${contract.customIndustryName}` : industry.name,
    deliverableTypeName: contract.customDeliverableName ? `Khác: ${contract.customDeliverableName}` : deliverable.name,
    durationLabel: durationLabel,
    videoQuantity: contract.videoQuantity,
    floorPricePerUnit: rawFloorPerUnit,
    agreedPricePerUnit: rawAgreedPerUnit,
    totalEscrowAmountVnd: rawTotalAmount,
    kocEarnsAmountVnd: kocEarnings,
    platformFeeVnd: platformFee,
    deliveryDeadlineDate: deliveryDeadlineDisplay,
    warrantyDays: contract.warrantyDays || 3,
    requirements: contract.requirements,
    creatorType: contract.creatorType || 'human',
    customAnnexTerms: contract.customAnnexTerms,
    customDeliveryNotes: contract.customDeliveryNotes,
    kocSignedAt: contract.kocSignedAt,
    clientSignedAt: contract.clientSignedAt
  });

  const contractShareableUrl = `https://avalive.vn/escrow/${contract.contractCode}`;

  const handleCopyContractLink = () => {
    navigator.clipboard.writeText(contractShareableUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopyLegalText = () => {
    navigator.clipboard.writeText(fullLegalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[95vh] rounded-3xl bg-[#0b0f19] border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-slate-900 via-[#0D111E] to-purple-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>BẢO CHỨNG KÝ QUỸ ESCROW 100%</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 font-bold">
                  Mã HĐ: {contract.contractCode}
                </span>
                {isDraftPreview && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Bản Dự Thảo Ký Kết
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                Hợp Đồng Điện Tử Dịch Vụ KOC & Ký Quỹ Escrow 3 Bên
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setViewMode('formatted')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'formatted' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Giao Diện Chuẩn
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw_legal')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'raw_legal' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Văn Bản Pháp Lý
              </button>
            </div>

            {/* Nút Sao Chép Đường Link Hợp Đồng Để Chia Sẻ Cả Hai Bên Cùng Xem */}
            <button
              type="button"
              onClick={handleCopyContractLink}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
              title="Sao chép đường link hợp đồng để gửi cho đối tác hoặc KOC cùng mở xem thời gian thực"
            >
              {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="hidden sm:inline font-bold">{linkCopied ? 'Đã chép link HĐ' : 'Sao chép link HĐ'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLegalText}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Sao chép toàn bộ văn bản hợp đồng"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Sao chép HĐ'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all"
              title="In hoặc lưu file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 text-xs text-slate-300">

          {viewMode === 'raw_legal' ? (
            /* Raw Legal Text View */
            <div className="p-5 sm:p-8 rounded-2xl bg-[#070a12] border border-white/10 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-200 selection:bg-purple-600 selection:text-white">
              {fullLegalText}
            </div>
          ) : (
            /* Formatted Visual Document View */
            <div className="space-y-6">

              {/* Legal Header Emblems */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-2 relative overflow-hidden">
                <div className="text-[11px] uppercase tracking-widest font-serif text-slate-400 font-bold">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-xs uppercase tracking-wider font-serif text-white font-bold pb-1 border-b border-white/10 inline-block">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <h1 className="text-base sm:text-xl font-black text-white font-display pt-2 tracking-wide uppercase">
                  HỢP ĐỒNG ĐIỆN TỬ DỊCH VỤ KOC & BẢO CHỨNG KÝ QUỸ ESCROW 3 BÊN
                </h1>
                <p className="text-[11px] text-slate-400 font-mono max-w-2xl mx-auto">
                  Xác lập tự động trên Cổng Giao Dịch Ký Quỹ AVA FOLLOW theo Luật Thương Mại 2005 & Luật Giao Dịch Điện Tử 2023.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                  <span className="text-slate-400">Số HĐ: <strong className="text-purple-300">{contract.contractCode}</strong></span>
                  <span>•</span>
                  <span className="text-slate-400">Ngày lập: <strong className="text-white">{contract.createdAt || 'Hôm nay'}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">✓ Đã Khóa Ký Quỹ Escrow 100%</span>
                </div>
              </div>

              {/* 3 Parties Identification Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* BÊN A */}
                <div className="p-4 rounded-2xl bg-[#0D111E] border border-purple-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-purple-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> BÊN A (BÊN THUÊ)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                      Khách Hàng
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{contract.clientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Vai trò: Doanh nghiệp / Chủ shop thuê KOC</div>
                    {contract.clientPhone && (
                      <div className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-purple-400" /> SĐT/Zalo: <strong>{contract.clientPhone}</strong>
                      </div>
                    )}
                    {contract.clientAddress && (
                      <div className="text-[10px] text-slate-400 font-mono flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" /> <span>Kho gửi mẫu: {contract.clientAddress}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-emerald-400 font-mono">✓ Đã nạp 100% tiền ký quỹ vào két Sàn</div>
                  </div>
                </div>

                {/* BÊN B */}
                <div className="p-4 rounded-2xl bg-[#0D111E] border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> BÊN B (BÊN LÀM)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {contract.creatorType === 'ai' ? 'AI Studio' : 'KOC Người Thật'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{contract.kocName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Kênh TikTok: <strong className="text-emerald-400">{contract.kocHandle}</strong></div>
                    {contract.sampleReturnAddress && (
                      <div className="text-[10px] text-slate-400 font-mono flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> <span>Nhận mẫu tại: {contract.sampleReturnAddress}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-cyan-300 font-mono">✓ Định danh KYC CCCD trên sàn</div>
                  </div>
                </div>

                {/* BÊN C */}
                <div className="p-4 rounded-2xl bg-[#0D111E] border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> BÊN C (TRUNG GIAN ESCROW)
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      Trọng Tài Sàn
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">Sàn Giao Dịch Ký Quỹ AVA FOLLOW</div>
                    <div className="text-[10px] text-slate-400 font-mono">Két bảo chứng: Smart Escrow Vault v3.5</div>
                    <div className="text-[10px] text-amber-300 font-mono">✓ Giám sát 72h bảo hành & thanh toán</div>
                  </div>
                </div>

              </div>

              {/* Product Deliverables & Floor Price Guarantee Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/20 via-black to-[#0D111E] border-2 border-purple-500/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{industry.icon}</span>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase font-mono">
                        Bảng Kê Chi Tiết Sản Phẩm Bàn Giao & Quy Định Giá Sàn
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Ngành hàng: <strong className="text-purple-300">{industry.name}</strong> • Thể loại: <strong className="text-white">{deliverable.name}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ✓ Tuân Thủ Nguyên Tắc Giá Sàn Thị Trường
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Sản Phẩm Cần Review:</span>
                    <strong className="text-white text-xs block truncate">{contract.productName}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Số Lượng & Thời Lượng:</span>
                    <strong className="text-purple-300 text-xs block">
                      {contract.videoQuantity} {deliverable.id === 'photo_poster' ? 'Bộ ảnh' : 'Video'} • {durationLabel}
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Giá Sàn Mặc Định (Thị Trường):</span>
                    <strong className="text-amber-400 text-xs block font-mono-numbers">
                      {rawFloorPerUnit.toLocaleString('vi-VN')}đ / video
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Giá Thỏa Thuận (Deal Price):</span>
                    <strong className="text-emerald-400 text-xs block font-mono-numbers">
                      {rawAgreedPerUnit.toLocaleString('vi-VN')}đ / video
                    </strong>
                  </div>
                </div>

                {/* Requirements display */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                  <strong className="text-slate-300 font-mono text-[10px] uppercase block">
                    Yêu Cầu Brief Kịch Bản & Gắn Giỏ Hàng TikTok Shop:
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {contract.requirements}
                  </p>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-purple-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
                  <div>
                    <div className="text-slate-400 text-[11px]">Tổng Tiền Ký Quỹ Escrow (Bên Thuê Trả 100%):</div>
                    <div className="text-2xl font-black text-neonGold font-mono-numbers mt-0.5">
                      {rawTotalAmount.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">
                        💵 KOC Thực Nhận (80%): {kocEarnings.toLocaleString('vi-VN')}đ
                      </span>
                      <span>•</span>
                      <span className="text-purple-300">
                        🛡️ Phí Bảo Chứng Sàn (20%): {platformFee.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1 text-xs">
                    <div className="text-slate-400 text-[11px]">Ngày Giờ Bàn Giao Cam Kết:</div>
                    <div className="font-bold text-amber-300 text-sm flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{deliveryDeadlineDisplay}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      🛡️ Kích hoạt 3 Ngày (72h) Bảo Hành Đối Soát sau khi nộp
                    </div>
                  </div>
                </div>
              </div>

              {/* 10 Detailed Legal Articles */}
              <div className="p-5 rounded-2xl bg-[#0D111E] border border-white/10 space-y-4">
                <h3 className="text-xs font-black text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Các Điều Khoản Pháp Lý Ràng Buộc & Bảo Vệ Quyền Lợi Hai Bên</span>
                </h3>

                <div className="space-y-3.5 text-xs text-slate-300 font-sans leading-relaxed divide-y divide-white/5">
                  
                  {/* Điều 1 */}
                  <div className="pt-2 first:pt-0 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 1: NGUYÊN TẮC GIÁ SÀN & QUYỀN DEAL THỎA THUẬN GIÁ
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Sàn quy định mức <strong>Giá Sàn Niêm Yết</strong> dựa trên khảo sát thị trường chuẩn theo từng ngành hàng ({industry.name}) và thời lượng video ({durationLabel}). 
                      Hai bên được tự do thương lượng, thống nhất mức giá nhưng <strong>tuyệt đối không được dưới Giá Sàn</strong> ({rawFloorPerUnit.toLocaleString('vi-VN')}đ). Mọi hành vi ép giá dưới giá sàn sẽ bị hệ thống tự động từ chối giao dịch nhằm bảo đảm thu nhập tối thiểu cho người sáng tạo nội dung.
                    </p>
                  </div>

                  {/* Điều 2 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 2: AN TOÀN TÀI CHÍNH KÝ QUỸ ESCROW 100% TRUNG GIAN
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Bên A có nghĩa vụ thanh toán và ký quỹ 100% giá trị hợp đồng ({rawTotalAmount.toLocaleString('vi-VN')}đ) vào Két Thông Minh Escrow của Sàn. Tiền cọc được niêm phong an toàn tuyệt đối. Bên B an tâm sản xuất không lo bị bùng tiền. Bên A an tâm không lo bị mất tiền nếu KOC không bàn giao sản phẩm đúng cam kết.
                    </p>
                  </div>

                  {/* Điều 3 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 3: NGÀY GIỜ BÀN GIAO & QUY TRÌNH GỬI NHẬN MẪU SẢN PHẨM
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Thời hạn bàn giao cam kết trước <strong>{deliveryDeadlineDisplay}</strong>. 
                      Đối với sản phẩm vật lý: Mốc thời gian được tính chính thức từ ngày Bên B ký nhận kiện hàng mẫu nguyên seal qua bưu điện. Bên A phải gửi mẫu kèm mã vận đơn trong vòng 48 giờ sau khi hợp đồng được ký kết. Bên B phải nộp video demo trước deadline tối thiểu 24 giờ.
                    </p>
                  </div>

                  {/* Điều 4 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 4: CHÍNH SÁCH BẢO HÀNH 3 NGÀY (72H) & 02 LẦN CHỈNH SỬA MIỄN PHÍ
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Sau khi Bên B nộp link video demo, Sàn kích hoạt <strong>72 giờ bảo hành nghiệm thu</strong>. Bên A được yêu cầu chỉnh sửa tối đa <strong>02 lần miễn phí</strong> nếu video sai thông tin brief kịch bản, phát âm sai tên sản phẩm hoặc góc quay mờ. Quá 72 giờ không có khiếu nại, tiền sẽ tự động giải ngân thẳng về ví Bên B.
                    </p>
                  </div>

                  {/* Điều 5 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 5: BẢN QUYỀN NỘI DUNG & ỦY QUYỀN TIKTOK SPARK ADS
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Bên A được toàn quyền sử dụng video/hình ảnh bàn giao trên các kênh truyền thông chính hãng. Bên B cấp mã ủy quyền Spark Ads Code (thời hạn 30 - 90 ngày) để Bên A chạy quảng cáo tăng trưởng doanh số. Bên B cam kết giữ video công khai trên kênh tối thiểu 30 ngày.
                    </p>
                  </div>

                  {/* Điều 6 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 6: CAM KẾT BẢO MẬT THÔNG TIN (NDA) & ĐẠO ĐỨC TRUYỀN THÔNG
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Cả hai bên cam kết bảo mật 100% tài liệu nội bộ, chiến lược kinh doanh, giá deal riêng tư và công thức sản phẩm. Bên B không được nhận tiền của đối thủ cạnh tranh để dìm hàng hoặc bôi nhọ nhãn hàng của Bên A.
                    </p>
                  </div>

                  {/* Điều 7 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 7: CHẾ TÀI PHẠT CHẬM TIẾN ĐỘ & BỒI THƯỜNG BÙNG KÈO
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Giao trễ hạn không lý do chính đáng: Phạt trừ <strong>5% giá trị hợp đồng / 24h trễ hạn</strong> bồi hoàn cho Bên A. 
                      Trễ quá 3 ngày: Bên A được quyền hủy hợp đồng nhận lại 100% tiền cọc. Nếu KOC nhận mẫu nhưng cố tình chiếm đoạt và bùng kèo không quay video: Phải đền bù <strong>200% giá trị sản phẩm mẫu</strong> và khóa tài khoản vĩnh viễn.
                    </p>
                  </div>

                  {/* Điều 8 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 8: ĐIỀU KHOẢN CHỐNG GIAO DỊCH NGOÀI SÀN (ANTI-BYPASS ESCROW)
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Hai bên cam kết 100% giao dịch, trao đổi và đối soát qua cổng Sàn. Tuyệt đối không giao dịch "đi đêm" ngoài sàn. Sàn miễn trừ 100% trách nhiệm bảo hiểm tài chính đối với các thỏa thuận ngoài sàn và sẽ khóa vĩnh viễn tài khoản vi phạm.
                    </p>
                  </div>

                  {/* Điều 9 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 9: HỘI ĐỒNG TRỌNG TÀI SÀN PHÁN QUYẾT TRANH CHẤP
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Trường hợp phát sinh bất đồng không tự thương lượng được, một trong hai bên có quyền gửi yêu cầu giải quyết khiếu nại. Hội đồng Trọng tài Sàn AVA FOLLOW sẽ thẩm định bằng chứng, video và brief để ra phán quyết cuối cùng trong vòng 24 - 48 giờ.
                    </p>
                  </div>

                  {/* Điều 10 */}
                  <div className="pt-3 space-y-1">
                    <strong className="text-white font-mono block text-xs">
                      ĐIỀU 10: HIỆU LỰC & CHỮ KÝ XÁC THỰC ĐIỆN TỬ
                    </strong>
                    <p className="text-[11px] text-slate-400">
                      Hợp đồng điện tử có giá trị pháp lý ràng buộc ngay từ thời điểm Bên A hoàn tất khóa ký quỹ Escrow và Bên B xác nhận nhận công việc.
                    </p>
                  </div>

                  {/* KHỐI KHÓA ĐIỀU KHOẢN MẪU - CHỈ ĐỌC */}
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[10px] font-mono text-purple-300 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>
                      <strong>TIÊU CHUẨN BẢO MẬT:</strong> 10 Điều khoản trên là khung pháp lý chuẩn của Sàn, được niêm phong bảo vệ và người dùng không thể tự ý sửa đổi nhằm triệt tiêu tranh chấp rủi ro.
                    </span>
                  </div>

                </div>
              </div>

              {/* PHỤ LỤC HỢP ĐỒNG 01: THỎA THUẬN BỔ SUNG & YÊU CẦU RIÊNG DO 2 BÊN THIẾT LẬP */}
              {(contract.customAnnexTerms || contract.customDeliveryNotes || contract.sampleReturnAddress || contract.clientPhone) && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-[#0D111E] border-2 border-indigo-500/40 space-y-3.5 shadow-xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-black text-white uppercase font-mono tracking-wide">
                        PHỤ LỤC HỢP ĐỒNG 01: THỎA THUẬN BỔ SUNG &amp; YÊU CẦU RIÊNG BIỆT (ANNEX)
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      Hiệu Lực Song Hành Cùng HĐ Chính
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono">
                    Các điều khoản và thông tin đối soát bổ sung dưới đây do hai bên trực tiếp nhập và thống nhất, cấu thành một phần không thể tách rời của Hợp đồng điện tử:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    {contract.customDeliveryNotes && (
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] text-indigo-300 font-bold uppercase block flex items-center gap-1">
                          <Edit3 className="w-3 h-3 text-indigo-400" /> Yêu Cầu Riêng Về Kịch Bản &amp; Góc Quay:
                        </span>
                        <p className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">
                          {contract.customDeliveryNotes}
                        </p>
                      </div>
                    )}

                    {contract.customAnnexTerms && (
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] text-indigo-300 font-bold uppercase block flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-indigo-400" /> Thỏa Thuận Riêng Giữa Hai Bên:
                        </span>
                        <p className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line">
                          {contract.customAnnexTerms}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Digital Signature Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                {/* Sign A */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                  <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">BÊN THUÊ (BÊN A)</div>
                  <div className="h-16 flex items-center justify-center">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold">
                      ✓ ĐÃ KÝ ĐIỆN TỬ (OTP)
                      <div className="text-[9px] text-slate-400 font-normal">{contract.clientName}</div>
                      <div className="text-[8px] text-emerald-400 font-mono">{contract.clientSignedAt || 'Đã ký lúc đặt cọc'}</div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Đã xác thực danh tính chủ shop</div>
                </div>

                {/* Sign B */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                  <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">KOC / CREATOR (BÊN B)</div>
                  <div className="h-16 flex items-center justify-center">
                    {contract.status === 'escrow_locked' && !isDraftPreview ? (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                        ⏳ Chờ KOC Xác Nhận &amp; Ký Số
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                        ✓ ĐÃ KÝ ĐIỆN TỬ (KYC)
                        <div className="text-[9px] text-slate-400 font-normal">{contract.kocName}</div>
                        <div className="text-[8px] text-emerald-400 font-mono">{contract.kocSignedAt || 'Đã ký nhận việc'}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Đã xác thực kênh {contract.kocHandle}</div>
                </div>

                {/* Sign C */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2 relative overflow-hidden">
                  <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold">BẢO CHỨNG SÀN AVA FOLLOW (BÊN C)</div>
                  <div className="h-16 flex items-center justify-center">
                    <div className="p-1.5 rounded-full border-2 border-rose-500/60 bg-rose-950/20 text-rose-400 text-[9px] font-mono font-bold rotate-[-6deg] shadow-lg">
                      ★ CHỨNG THỰC ESCROW ★
                      <div className="text-[8px] text-white font-black uppercase">ĐÃ KHÓA 100% TIỀN CỌC</div>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">SHA256: {contract.contractCode.replace(/[^A-Za-z0-9]/g, '')}-SECURE</div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hợp đồng được mã hóa SHA-256 và lưu trữ vĩnh viễn trên sổ cái Escrow Sàn.</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleCopyContractLink}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{linkCopied ? 'Đã sao chép link' : 'Sao Chép Link HĐ'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLegalText}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép văn bản' : 'Sao Chép Văn Bản'}</span>
            </button>

            {/* If KOC views contract while pending -> Allow direct signing */}
            {contract.status === 'escrow_locked' && !isDraftPreview && onSignContract && (
              <button
                type="button"
                onClick={() => {
                  onSignContract(contract.id);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold font-display shadow-md shadow-emerald-900/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ký Nhận Hợp Đồng Này</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-display shadow-md transition-all cursor-pointer"
            >
              Đóng Cửa Sổ Hợp Đồng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
