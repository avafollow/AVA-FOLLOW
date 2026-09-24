import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Coins, 
  Calendar, 
  ExternalLink, 
  Hash, 
  User, 
  Share2, 
  Heart, 
  MessageSquare, 
  Play, 
  Radio, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getTikTokAvatar } from '../../data/videoSources';

export interface TaskHistoryItemDetail {
  id: string;
  taskId: string;
  taskTitle: string;
  channelHandle: string;
  channelName?: string;
  channelAvatar?: string;
  actionType: string;
  actionLabel: string;
  coinsEarned: number;
  amountVND?: number;
  txHash?: string;
  timestamp: string;
  userHandle?: string;
  status: string;
  followed?: boolean;
  liked?: boolean;
  commented?: boolean;
  shared?: boolean;
  viewed?: boolean;
  notes?: string;
}

interface TaskHistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TaskHistoryItemDetail | null;
}

export const TaskHistoryDetailModal: React.FC<TaskHistoryDetailModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  if (!isOpen || !item) return null;

  const cleanHandle = (item.channelHandle || '@creator').replace(/^@+/, '');

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#090C16] border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col cursor-default animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white font-display flex items-center gap-2">
                <span>BÁO CÁO ĐỐI SOÁT NHIỆM VỤ CHI TIẾT</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  HỢP LỆ 100%
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Bằng chứng xác thực thời gian thực & phân bổ Xu</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans">
          {/* Target Channel Banner Card */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={item.channelAvatar || getTikTokAvatar(cleanHandle)} 
                alt="" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50 shrink-0" 
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm truncate">@{cleanHandle}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 truncate">{item.taskTitle}</p>
                <span className="text-[10px] text-emerald-400 font-mono">Đã xác minh qua thuật toán chống gian lận</span>
              </div>
            </div>

            <a
              href={`https://www.tiktok.com/@${cleanHandle}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-mono font-bold border border-white/10 flex items-center gap-1 transition-all shrink-0"
            >
              <span>Xem Kênh</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          </div>

          {/* Reward Summary Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Xu Thưởng Tích Lũy Vào Gói:</span>
              <div className="text-2xl font-black text-neonGold font-mono">
                +{item.coinsEarned.toLocaleString()} Xu
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Quy Đổi VNĐ:</span>
              <div className="text-base font-bold text-emerald-400 font-mono">
                {((item.amountVND || item.coinsEarned * 10)).toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* Action Types Detail Grid */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
              Chi tiết các hành động đã thực hiện:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                item.followed ? 'bg-pink-500/10 border-pink-500/30 text-pink-300' : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${item.followed ? 'text-pink-400' : 'text-slate-600'}`} />
                <span>Theo dõi kênh</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                item.liked ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}>
                <Heart className={`w-3.5 h-3.5 ${item.liked ? 'text-rose-400' : 'text-slate-600'}`} />
                <span>Thả tim video</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                item.commented ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}>
                <MessageSquare className={`w-3.5 h-3.5 ${item.commented ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span>Bình luận</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                item.shared ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}>
                <Share2 className={`w-3.5 h-3.5 ${item.shared ? 'text-blue-400' : 'text-slate-600'}`} />
                <span>Chia sẻ</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                item.viewed ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-white/[0.02] border-white/5 text-slate-500'
              }`}>
                <Play className={`w-3.5 h-3.5 ${item.viewed ? 'text-purple-400' : 'text-slate-600'}`} />
                <span>Xem video 15s+</span>
              </div>

              <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-bot Pass</span>
              </div>
            </div>
          </div>

          {/* Audit Metadata Table */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Thời gian thực hiện:</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{item.timestamp}</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Mã giao dịch / Log ID:</span>
              <span className="text-amber-300 font-bold">{item.txHash || item.id}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Tài khoản thực hiện:</span>
              <span className="text-cyan-300">{item.userHandle || '@user_tiktok'}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Cơ chế nhận thưởng:</span>
              <span className="text-emerald-400 font-bold">Tích lũy vào Gói Nhiệm Vụ Ngày</span>
            </div>
          </div>

          {/* Note on Daily Bundle Claim Rule */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] font-mono text-purple-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p>
              Số Xu này được tạm tính và khóa an toàn trong <strong>Gói Nhiệm Vụ Ngày</strong>. Khi bạn hoàn thành 100% các nhiệm vụ trong ngày, toàn bộ Xu tổng sẽ được giải ngân trực tiếp vào ví khả dụng để rút tiền!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-lg cursor-pointer"
          >
            Đóng Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
};
