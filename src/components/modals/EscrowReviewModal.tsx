import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Video, 
  ExternalLink,
  MessageSquare,
  Award,
  FileCheck2
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';

interface EscrowReviewModalProps {
  contract: EscrowBookingContract | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReview: (contractId: string, rating: number, reviewText: string) => void;
}

const QUICK_TAGS = [
  'Đúng kịch bản cam kết 100%',
  'Chất lượng video Full HD sắc nét',
  'Bàn giao đúng tiến độ',
  'Âm thanh & lồng tiếng bắt trend',
  'KOC giao tiếp nhiệt tình, chuyên nghiệp',
  'Giữ tương tác và gắn giỏ hàng chuẩn'
];

export const EscrowReviewModal: React.FC<EscrowReviewModalProps> = ({
  contract,
  isOpen,
  onClose,
  onConfirmReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([QUICK_TAGS[0], QUICK_TAGS[1], QUICK_TAGS[2]]);
  const [reviewComment, setReviewComment] = useState<string>('Video hoàn thành rất tốt, hình ảnh đẹp, giọng đọc tự nhiên và đúng cam kết ban đầu.');

  if (!isOpen || !contract) return null;

  const rawAmount = parseInt(contract.totalEscrowAmount.replace(/\D/g, ''), 10) || 0;
  const kocReceive = Math.round(rawAmount * 0.8);
  const sànFee = Math.round(rawAmount * 0.2);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleConfirm = () => {
    const fullReview = selectedTags.length > 0
      ? `${selectedTags.join(', ')}. ${reviewComment}`
      : reviewComment;

    onConfirmReview(contract.id, rating, fullReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {contract.contractCode}
                </span>
                <span className="text-xs font-bold text-slate-300 font-display truncate max-w-[200px]">
                  {contract.productName}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white font-display mt-0.5">
                Xác Nhận Nghiệm Thu &amp; Đánh Giá KOC
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

        {/* Demo Video Preview Reference */}
        {contract.demoVideoUrl && (
          <div className="px-5 py-3 bg-purple-950/30 border-b border-purple-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-purple-300">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Video Demo Nghiệm Thu:</span>
            </div>
            <a 
              href={contract.demoVideoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở Xem Video</span>
            </a>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* Star Rating Section */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-center space-y-2">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] font-mono">
              Mức Độ Hài Lòng Về Sản Phẩm &amp; Dịch Vụ
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-400 font-display">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Xuất sắc - Video hoàn hảo vượt mong đợi!' :
               rating === 4 ? '⭐⭐⭐⭐ Rất tốt - Đạt chuẩn cam kết chất lượng' :
               rating === 3 ? '⭐⭐⭐ Đạt yêu cầu - Cần cải thiện thêm một số chi tiết' :
               rating === 2 ? '⭐⭐ Dưới mức kỳ vọng' : '⭐ Không hài lòng'}
            </div>
          </div>

          {/* Quick Compliment Tags */}
          <div className="space-y-2">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gợi ý đánh giá nhanh:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Review Comment */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Lời nhận xét gửi tới KOC &amp; lưu vào hồ sơ đối tác:</span>
            </label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Nhận xét chi tiết về chất lượng video, diễn xuất, độ cuốn hút..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Financial Disbursement Transparency (80% KOC / 20% Sàn) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-black to-slate-900 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/5 pb-2">
              <span>Tổng Tiền Ký Quỹ Đang Khóa:</span>
              <strong className="text-amber-400 font-mono-numbers text-xs">{contract.totalEscrowAmount}</strong>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
              <span>💵 KOC Thực Nhận (80% Thù Lao):</span>
              <span className="text-sm font-mono-numbers">{kocReceive.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
              <span>🛡️ Phí Sàn Bảo Chứng (20% Dịch Vụ):</span>
              <span className="font-mono-numbers">{sànFee.toLocaleString('vi-VN')}đ</span>
            </div>
            <p className="text-[10px] text-slate-400 italic pt-1">
              * Ngay khi bạn bấm xác nhận, hệ thống Smart Escrow sẽ mở khóa két và tự động chuyển đúng 80% tiền thù lao vào ví KOC.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all cursor-pointer font-display"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác Nhận Nghiệm Thu &amp; Giải Ngân 80% KOC</span>
          </button>
        </div>

      </div>
    </div>
  );
};
