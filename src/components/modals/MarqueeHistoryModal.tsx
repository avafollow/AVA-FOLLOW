import React from 'react';
import { 
  X, 
  History, 
  Clock, 
  Coins, 
  Eye, 
  CheckCircle2, 
  Radio, 
  Video, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const MarqueeHistoryModal: React.FC = () => {
  const { 
    isMarqueeHistoryModalOpen, 
    closeMarqueeHistoryModal, 
    marqueeHistoryList,
    openLiveRunner,
    livestreamTasks
  } = useTikTokApp();

  if (!isMarqueeHistoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                Lịch Sử Bảng Điện LED & Các Phiên Đã Kết Thúc
              </h2>
              <p className="text-xs text-slate-400">
                Lưu trữ các phiên livestream và chiến dịch đã chạy bảng điện thành công ({marqueeHistoryList.length} phiên)
              </p>
            </div>
          </div>
          <button 
            onClick={closeMarqueeHistoryModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of history */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {marqueeHistoryList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Chưa có phiên bảng điện nào được lưu vào lịch sử.</p>
            </div>
          ) : (
            marqueeHistoryList.map(hist => (
              <div 
                key={hist.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-slate-700 text-slate-300">
                      {hist.item.type === 'livestream' ? '🔴 LIVESTREAM' : '🎬 CHIẾN DỊCH'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ĐÃ KẾT THÚC & LƯU TRỮ
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Thời điểm kết thúc: {hist.endedAt}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white font-display">
                    {hist.item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Kênh: <strong className="text-slate-200">{hist.item.channelHandle}</strong>
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">Lượt tiếp cận / Mắt xem</div>
                    <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{hist.totalReachedViewers.toLocaleString()} lượt</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">Tổng Xu đã phân phối</div>
                    <div className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{hist.totalXuDistributed.toLocaleString()} Xu</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400">Trạng thái Bảng Điện</div>
                    <div className="font-bold text-slate-300 mt-0.5">
                      Đã ẩn khỏi dải LED
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dữ liệu lưu trữ tự động minh bạch 100% trên nền tảng.</span>
          </div>
          <button
            onClick={closeMarqueeHistoryModal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
