import React, { useState } from 'react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  X, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  AtSign, 
  Layers, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface KocRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KocRegistrationModal: React.FC<KocRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, registerKocProfile } = useTikTokApp();
  const [tiktokHandle, setTiktokHandle] = useState(user.tiktokConnected || '');
  const [category, setCategory] = useState('Review Sản Phẩm');
  const [followers, setFollowers] = useState(user.tiktokFollowers > 0 ? user.tiktokFollowers : 15000);
  const [pricePerVideo, setPricePerVideo] = useState('500,000đ');
  const [sampleUrl, setSampleUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      registerKocProfile({
        kocName: user.name,
        tiktokHandle: tiktokHandle.startsWith('@') ? tiktokHandle : `@${tiktokHandle}`,
        avatar: user.avatar,
        followersCount: Number(followers),
        category,
        pricePerVideoVND: pricePerVideo,
        sampleVideoUrl: sampleUrl,
        bioDescription: bio
      });
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đăng Ký Hồ Sơ KOC / Nhận Booking</h3>
              <p className="text-xs text-slate-400">Đưa kênh lên sàn để các Brand book review có tiền cọc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Đăng Ký Thành Công!</h4>
            <p className="text-xs text-slate-300">
              Hồ sơ KOC của bạn đã được đưa vào danh sách đối tác nhận booking được bảo đảm qua Sàn Ký Quỹ Escrow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
            
            <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs text-purple-200">
                Khi nhận job quay video qua sàn, tiền của Brand đã được <strong>khóa 100%</strong> trong Két Escrow. Bạn hoàn toàn không lo bị bùng tiền!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Kênh TikTok (@handle) *</label>
                <input
                  type="text"
                  placeholder="@kenhcua_ban"
                  value={tiktokHandle}
                  onChange={(e) => setTiktokHandle(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số Lượng Follow Hiện Có *</label>
                <input
                  type="number"
                  placeholder="15000"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Chủ Đề Thế Mạnh</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Review Sản Phẩm">Review Sản Phẩm / Gia dụng</option>
                  <option value="Mỹ Phẩm / Skincare">Mỹ Phẩm / Skincare</option>
                  <option value="Thời Trang / OOTD">Thời Trang / OOTD</option>
                  <option value="Ẩm Thực / Quán Ăn">Ẩm Thực / Quán Ăn</option>
                  <option value="Công Nghệ / Đồ Điện Tử">Công Nghệ / Đồ Điện Tử</option>
                  <option value="Livestream Co-host">Livestream Bán Hàng Co-host</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Giá Dự Kiến Cho 1 Video</label>
                <select
                  value={pricePerVideo}
                  onChange={(e) => setPricePerVideo(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono font-bold text-amber-400"
                >
                  <option value="500,000đ">500,000đ / Video</option>
                  <option value="800,000đ">800,000đ / Video</option>
                  <option value="1,200,000đ">1,200,000đ / Video</option>
                  <option value="2,000,000đ">2,000,000đ / Video</option>
                  <option value="3,500,000đ">3,500,000đ / Video</option>
                  <option value="5,000,000đ">5,000,000đ / Video</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Link 1 Video Tiêu Biểu Nhất Của Kênh</label>
              <input
                type="url"
                placeholder="https://www.tiktok.com/@kenh/video/..."
                value={sampleUrl}
                onChange={(e) => setSampleUrl(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mô Tả Ngắn Về Phong Cách Kênh & Lời Nhắn Đến Brand</label>
              <textarea
                rows={2}
                placeholder="VD: Kênh em chuyên review đồ gia dụng thực tế, tỉ lệ chuyển đổi giỏ hàng TikTok Shop trung bình 15%..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/30 flex items-center gap-2"
              >
                {isSubmitting ? 'Đang gửi hồ sơ...' : 'Xác Nhận Đăng Ký KOC'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
