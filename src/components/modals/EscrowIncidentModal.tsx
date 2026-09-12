import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  DollarSign, 
  Clock, 
  FileText, 
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';

interface EscrowIncidentModalProps {
  contract: EscrowBookingContract | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestRevision: (contractId: string, revisionNotes: string) => void;
  onFreezeVault: (contractId: string, reason: string, frozenBy: 'client' | 'koc') => void;
  onRequestRefund: (contractId: string, refundReason: string) => void;
  onOpenExtension: (contract: EscrowBookingContract) => void;
}

const REVISION_REASONS = [
  'Kịch bản chưa làm rõ tính năng và điểm nổi bật của sản phẩm',
  'Chưa gắn link giỏ hàng TikTok Shop hoặc thiếu Hashtag cam kết trong brief',
  'Âm thanh bị rè / tiếng nhạc nền quá to át giọng nói KOC',
  'Chưa đúng thời lượng cam kết trong hợp đồng (ví dụ HĐ 3 phút nhưng video dưới 1 phút)',
  'Chất lượng hình ảnh mờ nét, ánh sáng tối cần quay bổ sung góc máy'
];

const REFUND_REASONS = [
  'KOC quá hạn cam kết bàn giao mà không xin gia hạn hoặc đã bị từ chối',
  'KOC không phản hồi tin nhắn trong cổng đối thoại quá 48 giờ',
  'KOC tự ý hủy kèo hoặc không thể hoàn thành theo thỏa thuận',
  'Video bàn giao sai lệch hoàn toàn so với cam kết và không chịu sửa đổi'
];

export const EscrowIncidentModal: React.FC<EscrowIncidentModalProps> = ({
  contract,
  isOpen,
  onClose,
  onRequestRevision,
  onFreezeVault,
  onRequestRefund,
  onOpenExtension
}) => {
  const [activeStep, setActiveStep] = useState<'menu' | 'revision' | 'freeze' | 'refund'>('menu');
  const [selectedRevisionReason, setSelectedRevisionReason] = useState<string>(REVISION_REASONS[0]);
  const [customRevisionNote, setCustomRevisionNote] = useState<string>('');

  const [selectedRefundReason, setSelectedRefundReason] = useState<string>(REFUND_REASONS[0]);
  const [customRefundNote, setCustomRefundNote] = useState<string>('');

  const [freezeReasonText, setFreezeReasonText] = useState<string>('Tạm dừng giải ngân để đối soát lại nội dung video demo với kịch bản cam kết.');

  if (!isOpen || !contract) return null;

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = customRevisionNote.trim()
      ? `${selectedRevisionReason}. Chi tiết: ${customRevisionNote}`
      : selectedRevisionReason;
    onRequestRevision(contract.id, finalNote);
    onClose();
  };

  const handleSendFreeze = () => {
    onFreezeVault(contract.id, freezeReasonText, 'client');
    onClose();
  };

  const handleSendRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customRefundNote.trim()
      ? `${selectedRefundReason}. Bằng chứng: ${customRefundNote}`
      : selectedRefundReason;
    onRequestRefund(contract.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-rose-950/50 via-slate-900 to-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {contract.contractCode}
                </span>
                <span className="text-xs font-bold text-slate-300 font-display truncate max-w-[220px]">
                  {contract.title}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                Trung Tâm Xử Lý Sự Cố &amp; Niêm Phong Quỹ Cọc Escrow
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Guided Explainer */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>HỆ THỐNG BẢO HỘ 3 BÊN TIÊU CHUẨN QUỐC TẾ:</strong> Toàn bộ 100% tiền cọc <strong>({contract.totalEscrowAmount})</strong> đang được khóa an toàn trong Smart Vault. Bạn có thể chọn quy trình xử lý phù hợp bên dưới để đảm bảo quyền lợi tối đa mà không lo mất tiền.
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* SCREEN 1: Main Menu of 4 Guided Steps */}
          {activeStep === 'menu' && (
            <div className="space-y-3">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                Chọn Quy Trình Giải Quyết Sự Cố Được Gợi Ý:
              </div>

              {/* Option 1: Request Revision */}
              <div 
                onClick={() => setActiveStep('revision')}
                className="p-4 rounded-2xl bg-slate-800/60 hover:bg-purple-950/30 border border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-display text-sm">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                    <span>Bước 1: Yêu Cầu Chỉnh Sửa Lại (Revision Request)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                    Miễn Phí 2 Lần
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-9">
                  Nếu video demo chưa đúng kịch bản, âm thanh chưa chuẩn hoặc thiếu giỏ hàng. KOC có nghĩa vụ sửa đổi trong 24h-48h theo đúng cam kết hợp đồng.
                </p>
              </div>

              {/* Option 2: Mutual Extension */}
              <div 
                onClick={() => {
                  onClose();
                  onOpenExtension(contract);
                }}
                className="p-4 rounded-2xl bg-slate-800/60 hover:bg-amber-950/30 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-display text-sm">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>Bước 2: Thỏa Thuận Xin Gia Hạn Bàn Giao</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    Đồng Thuận 2 Bên
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-9">
                  Nếu cần thêm thời gian để quay dựng kỹ xảo chất lượng cao, hai bên có thể thỏa thuận gia hạn (+1, +2, +3 ngày) mà không bị phạt trễ hạn.
                </p>
              </div>

              {/* Option 3: Freeze Escrow Vault */}
              <div 
                onClick={() => setActiveStep('freeze')}
                className="p-4 rounded-2xl bg-slate-800/60 hover:bg-blue-950/30 border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-display text-sm">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span>Bước 3: Niêm Phong Quỹ Cọc Khẩn Cấp (Freeze Vault)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                    Khóa Cứng 100%
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-9">
                  Tạm dừng ngay lập tức đồng hồ đếm ngược 72h tự động giải ngân. Tiền cọc được khóa cứng trong két Sàn để hai bên đối soát an toàn.
                </p>
              </div>

              {/* Option 4: Full Refund Request */}
              <div 
                onClick={() => setActiveStep('refund')}
                className="p-4 rounded-2xl bg-slate-800/60 hover:bg-rose-950/30 border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-display text-sm">
                    <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span>Bước 4: Yêu Cầu Hoàn Tiền 100% Cọc (Trọng Tài Phán Quyết)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                    Bồi Thường &amp; Chế Tài
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-9">
                  Áp dụng khi KOC quá hạn không nộp, không phản hồi quá 48h hoặc vi phạm cam kết nghiêm trọng. Sàn sẽ hoàn 100% cọc về ví Bên Thuê và chế tài KOC.
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 2: YÊU CẦU CHỈNH SỬA VIDEO */}
          {activeStep === 'revision' && (
            <form onSubmit={handleSendRevision} className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('menu')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold"
                >
                  ← Quay lại danh sách gợi ý
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  Lần sửa: {(contract.revisionCount || 0) + 1}/2
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chọn lý do yêu cầu chỉnh sửa (Gợi ý sẵn):</span>
                </label>
                <div className="space-y-1.5">
                  {REVISION_REASONS.map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedRevisionReason === reason
                          ? 'bg-purple-950/40 border-purple-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rev_reason"
                        checked={selectedRevisionReason === reason}
                        onChange={() => setSelectedRevisionReason(reason)}
                        className="text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <span className="text-[11px]">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold text-[11px]">
                  Ghi chú chi tiết yêu cầu KOC chỉnh sửa:
                </label>
                <textarea
                  rows={3}
                  value={customRevisionNote}
                  onChange={(e) => setCustomRevisionNote(e.target.value)}
                  placeholder="Mô tả cụ thể giây thứ mấy cần sửa, âm thanh ra sao, góc quay cần thêm..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveStep('menu')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center gap-1.5 cursor-pointer font-display"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Chỉnh Sửa Cho KOC</span>
                </button>
              </div>
            </form>
          )}

          {/* SCREEN 3: NIÊM PHONG KÉT CỌC */}
          {activeStep === 'freeze' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setActiveStep('menu')}
                className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold"
              >
                ← Quay lại danh sách gợi ý
              </button>

              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/40 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold font-display text-sm">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Xác Nhận Kích Hoạt Lệnh Niêm Phong Tiền Cọc</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Khi niêm phong: Số tiền <strong>{contract.totalEscrowAmount}</strong> sẽ bị khóa cứng trong két Sàn. Hệ thống <strong>tạm dừng hoàn toàn đồng hồ đếm ngược 72h tự động giải ngân</strong>. Tiền sẽ không thể xuất kho cho đến khi hai bên thống nhất hoặc Trọng tài Sàn phán quyết.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold text-[11px]">
                  Lý do niêm phong quỹ cọc (Ghi vào biên bản hệ thống):
                </label>
                <textarea
                  rows={3}
                  value={freezeReasonText}
                  onChange={(e) => setFreezeReasonText(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveStep('menu')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSendFreeze}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-1.5 cursor-pointer font-display"
                >
                  <Lock className="w-4 h-4" />
                  <span>Kích Hoạt Niêm Phong Quỹ Cọc 100%</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: YÊU CẦU HOÀN CỌC 100% */}
          {activeStep === 'refund' && (
            <form onSubmit={handleSendRefund} className="space-y-4">
              <button
                type="button"
                onClick={() => setActiveStep('menu')}
                className="text-xs text-purple-400 hover:text-purple-300 font-mono font-bold"
              >
                ← Quay lại danh sách gợi ý
              </button>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold font-display text-sm">
                  <DollarSign className="w-4 h-4 text-rose-400" />
                  <span>Yêu Cầu Trọng Tài Hoàn Lại 100% Tiền Ký Quỹ</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Căn cứ hợp đồng điện tử mã <strong>{contract.contractCode}</strong> và Luật Thương Mại, yêu cầu hoàn tiền <strong>{contract.totalEscrowAmount}</strong> sẽ được chuyển đến Hội Đồng Trọng Tài Sàn. KOC có 24h đối soát. Nếu KOC vi phạm trễ hẹn hoặc không bàn giao, tiền sẽ hoàn về ví của bạn 100%.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Căn cứ yêu cầu hoàn tiền (Gợi ý sẵn):</span>
                </label>
                <div className="space-y-1.5">
                  {REFUND_REASONS.map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedRefundReason === reason
                          ? 'bg-rose-950/40 border-rose-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ref_reason"
                        checked={selectedRefundReason === reason}
                        onChange={() => setSelectedRefundReason(reason)}
                        className="text-rose-600 focus:ring-rose-500 rounded"
                      />
                      <span className="text-[11px]">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold text-[11px]">
                  Bằng chứng đối soát kèm theo (Link tin nhắn, ảnh chụp):
                </label>
                <textarea
                  rows={2}
                  value={customRefundNote}
                  onChange={(e) => setCustomRefundNote(e.target.value)}
                  placeholder="Ghi rõ thời gian quá hạn, bằng chứng KOC không phản hồi..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveStep('menu')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 cursor-pointer font-display"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Hoàn Cọc 100% Tới Trọng Tài</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
