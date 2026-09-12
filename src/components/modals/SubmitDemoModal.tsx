import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  X, 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink,
  AtSign,
  FileText
} from 'lucide-react';

export const SubmitDemoModal: React.FC = () => {
  const { 
    isSubmitDemoModalOpen, 
    closeSubmitDemoModal, 
    activeEscrowContract,
    submitEscrowDemo 
  } = useTikTokApp();

  const [videoUrl, setVideoUrl] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isSubmitDemoModalOpen || !activeEscrowContract) return null;

  const currentBooking = activeEscrowContract;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!videoUrl.trim()) {
      setError('Vui lòng cung cấp link video TikTok hoặc Drive bản nháp demo');
      return;
    }

    if (!videoUrl.includes('tiktok.com') && !videoUrl.includes('drive.google.com') && !videoUrl.includes('http')) {
      setError('Đường link video không hợp lệ. Vui lòng nhập link URL đầy đủ (https://...)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitEscrowDemo(currentBooking.id, videoUrl.trim(), notes.trim());
      setIsSubmitting(false);
      closeSubmitDemoModal();
      setVideoUrl('');
      setNotes('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Nộp Video Demo & Báo Cáo Nghiệm Thu
              </h3>
              <p className="text-xs text-slate-400">Hợp đồng: <span className="font-mono text-purple-400 font-semibold">{currentBooking.contractCode}</span></p>
            </div>
          </div>
          <button 
            onClick={closeSubmitDemoModal}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Booking Info Card */}
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {currentBooking.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{currentBooking.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Bên thuê (Brand): <span className="text-slate-200 font-semibold">{currentBooking.clientName}</span></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Giá trị hợp đồng</span>
                <p className="text-sm font-bold text-amber-400">{currentBooking.totalEscrowAmount}</p>
                <p className="text-[11px] text-slate-400 font-mono">({currentBooking.pricePerVideo}/video)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-xs">
              <div className="text-slate-400">
                Kênh KOC đăng tải: <span className="text-emerald-400 font-semibold">{currentBooking.kocHandle || '@koc_official'}</span>
              </div>
              <div className="text-slate-400 text-right">
                Gói video: <span className="text-white font-semibold">{currentBooking.videoQuantity} Video</span>
              </div>
            </div>
          </div>

          {/* Tri-party Security Notice */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-200/90 leading-relaxed">
              <strong className="text-blue-300">Chính Sách Bảo Hành Nghiệm Thu 3 Ngày (72 Giờ):</strong> Tiền đã được Brand ký quỹ an toàn trong <strong>Két Smart Vault Sàn</strong> ({currentBooking.totalEscrowAmount}). 
              Sau khi bạn nộp video demo, hai bên có đúng <strong>3 ngày (72 giờ)</strong> để đối soát chất lượng. Sau 3 ngày nếu Bên Thuê không khiếu nại, hệ thống sẽ <strong>tự động giải ngân 100%</strong> vào ví của bạn.
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-400" />
                Link Video TikTok (Hoặc Link Drive Demo/Draft) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.tiktok.com/@koc/video/... hoặc link Google Drive"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Gợi ý: Nếu video chưa public, hãy upload video ở chế độ "Chỉ mình tôi" trên TikTok hoặc share Drive link có quyền xem.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-purple-400" />
                Xác nhận tài khoản TikTok đăng bài
              </label>
              <input
                type="text"
                placeholder={currentBooking.kocHandle || '@koc_channel'}
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Hệ thống AI sẽ đối soát kênh đăng trùng khớp với tài khoản được booking để phòng chống gian lận.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Ghi chú gửi Brand (Hashtag, Âm thanh bản quyền, Lịch hẹn đăng chính thức)
              </label>
              <textarea
                rows={3}
                placeholder="VD: Em đã quay xong video review theo đúng kịch bản, đã gắn hashtag #brandname #tiktokshop. Anh chị check giúp em để em set lịch đăng 20h tối nay nhé!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 text-[11px] text-slate-300 space-y-1.5">
            <div className="font-semibold text-slate-200 mb-1">Checklist trước khi nộp:</div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Độ phân giải video tối thiểu 1080p, âm thanh rõ ràng, không dính logo nền tảng khác.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Đã gắn đúng hashtag và link sản phẩm TikTok Shop theo yêu cầu hợp đồng.</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeSubmitDemoModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-900/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang xử lý nghiệm thu...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Xác Nhận Nộp Demo & Kích Hoạt 48h</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
