import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';

interface EscrowExtensionModalProps {
  contract: EscrowBookingContract | null;
  isOpen: boolean;
  onClose: () => void;
  // Mode: 'request' if KOC requests, 'respond' if Brand responds
  mode?: 'request' | 'respond';
  onRequestExtension?: (contractId: string, days: number, reason: string) => void;
  onRespondExtension?: (contractId: string, accept: boolean, responseNote?: string) => void;
}

const EXTENSION_REASONS = [
  'Mẫu sản phẩm từ Bên Thuê chuyển tới trễ hơn dự kiến',
  'Thời tiết ngoại cảnh không đảm bảo chất lượng góc quay',
  'Cần thêm 24h-48h dựng kỹ xảo AI & hiệu ứng âm thanh chuẩn TikTok FYP',
  'Kịch bản cần bổ sung thêm trải nghiệm chi tiết để đạt chuyển đổi cao hơn',
  'Lý do cá nhân đột xuất (đã trao đổi trước với bên thuê)'
];

export const EscrowExtensionModal: React.FC<EscrowExtensionModalProps> = ({
  contract,
  isOpen,
  onClose,
  mode = 'request',
  onRequestExtension,
  onRespondExtension
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(2);
  const [selectedReason, setSelectedReason] = useState<string>(EXTENSION_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [responseNote, setResponseNote] = useState<string>('');

  if (!isOpen || !contract) return null;

  const finalReason = customReason.trim() ? customReason : selectedReason;

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRequestExtension) {
      onRequestExtension(contract.id, selectedDays, finalReason);
    }
    onClose();
  };

  const handleRespond = (accept: boolean) => {
    if (onRespondExtension) {
      onRespondExtension(contract.id, accept, responseNote);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {contract.contractCode}
                </span>
                <span className="text-xs font-bold text-slate-300 font-display truncate max-w-[200px]">
                  {contract.title}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                {mode === 'request' ? 'Đề Xuất Xin Gia Hạn Thời Gian Bàn Giao' : 'Xác Nhận Đề Xuất Xin Gia Hạn Từ KOC'}
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

        {/* Legal Notice Banner */}
        <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300/90 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>QUY CHẾ SÀN ESCROW VỀ GIA HẠN TIẾN ĐỘ:</strong> Việc gia hạn <strong>bắt buộc phải có sự đồng thuận của cả 2 bên</strong> (KOC đề xuất $\leftrightarrow$ Bên Thuê chấp thuận). Nếu Bên Thuê từ chối hoặc KOC quá hạn không bàn giao, Sàn sẽ áp dụng <strong>khung chế tài phạt trễ hạn</strong> để bảo vệ quyền lợi Bên Thuê.
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* Mode 1: KOC gửi đề xuất gia hạn */}
          {mode === 'request' ? (
            <form onSubmit={handleSendRequest} className="space-y-4">
              {/* Chọn số ngày gia hạn */}
              <div className="space-y-2">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chọn số ngày đề xuất gia hạn thêm:</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { days: 1, label: '+1 Ngày (24h)', desc: 'Cần thêm 1 ngày quay bổ sung' },
                    { days: 2, label: '+2 Ngày (48h)', desc: 'Dựng kỹ xảo & lồng tiếng AI' },
                    { days: 3, label: '+3 Ngày (72h)', desc: 'Mẫu đến muộn / quay lại ngoại cảnh' }
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.days}
                      onClick={() => setSelectedDays(opt.days)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedDays === opt.days
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-900/30 ring-1 ring-purple-500'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-300 font-mono">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-snug">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chọn lý do xin gia hạn */}
              <div className="space-y-2">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chọn lý do gia hạn (Gợi ý sẵn):</span>
                </label>
                <div className="space-y-1.5">
                  {EXTENSION_REASONS.map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedReason === reason && !customReason.trim()
                          ? 'bg-purple-950/40 border-purple-500/60 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="extension_reason"
                        checked={selectedReason === reason && !customReason.trim()}
                        onChange={() => {
                          setSelectedReason(reason);
                          setCustomReason('');
                        }}
                        className="text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <span className="text-[11px]">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nhập lý do khác nếu có */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px]">Hoặc nhập lý do chi tiết khác:</label>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể và cam kết thời gian hoàn thành gửi Bên Thuê..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Cam kết nút gửi */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center gap-1.5 transition-all cursor-pointer font-display"
                >
                  <Clock className="w-4 h-4" />
                  <span>Gửi Đề Xuất Gia Hạn (+{selectedDays} Ngày)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Mode 2: Brand duyệt đề xuất gia hạn của KOC */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 font-mono text-[11px]">KOC Đề Xuất:</span>
                  <span className="font-bold text-emerald-400 font-mono">{contract.kocName} ({contract.kocHandle})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Số ngày xin gia hạn thêm:</span>
                  <strong className="text-amber-400 text-sm font-mono font-bold">
                    +{contract.extensionDays || 2} Ngày
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Lý do KOC trình bày:</span>
                  <p className="text-white text-xs font-mono bg-slate-800/80 p-2.5 rounded-xl border border-white/5 mt-1">
                    "{contract.extensionReason || 'KOC xin thêm thời gian để trau chuốt kịch bản và dựng video chất lượng cao nhất.'}"
                  </p>
                </div>
              </div>

              {/* Lời nhắn phản hồi tùy chọn */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold text-[11px]">
                  Lời nhắn gửi lại KOC (Không bắt buộc):
                </label>
                <input
                  type="text"
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder="Ví dụ: Shop đồng ý gia hạn nhé, bạn làm kỹ giúp shop kịch bản nha..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* 2 Lựa chọn: Đồng Ý hoặc Từ Chối */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRespond(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display"
                >
                  <X className="w-4 h-4" />
                  <span>Từ Chối Gia Hạn (Phạt nếu trễ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRespond(true)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-display"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đồng Ý Gia Hạn (+{contract.extensionDays || 2} Ngày)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
