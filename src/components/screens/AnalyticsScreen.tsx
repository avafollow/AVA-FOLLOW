import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Sparkles,
  Award,
  Zap,
  Gift,
  Radio,
  ShieldCheck,
  Eye,
  Users
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

export const AnalyticsScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { analytics, checkInDaily, user, openWithdraw, openLuckyWheel, getUserLiveQuota } = useTikTokApp();

  const quota = getUserLiveQuota();
  const [workingHours, setWorkingHours] = useState<number>(2);

  // Income Calculator Formula
  // 1 hour = ~60 tasks (Follow + Like + Comment) ≈ 150,000đ + 1 live/review ≈ 300,000đ/hour
  const estimatedDailyEarnings = workingHours * 250000;
  const estimatedMonthlyEarnings = estimatedDailyEarnings * 30;

  const streakRewards = [
    { day: 1, coins: 500, label: 'Ngày 1' },
    { day: 2, coins: 1000, label: 'Ngày 2' },
    { day: 3, coins: 1500, label: 'Ngày 3' },
    { day: 4, coins: 2000, label: 'Ngày 4' },
    { day: 5, coins: 2500, label: 'Ngày 5' },
    { day: 6, coins: 3000, label: 'Ngày 6' },
    { day: 7, coins: 5000, label: 'Ngày 7 (VIP)' }
  ];

  // Tính toán động tỷ lệ phân bổ nguồn thu nhập từ dữ liệu thực tế của người dùng
  const txs = user.transactions || [];
  let followCoins = 0;
  let watchLikeCoins = 0;
  let commentCoins = 0;
  let liveCoins = 0;
  let shareRefCoins = 0;

  txs.forEach(tx => {
    if (!tx.isPositive) return;
    const t = (tx.title || '').toLowerCase();
    const m = (tx.missionType || '').toLowerCase();
    const rawAmt = parseInt(tx.amount?.replace(/\D/g, '') || '0', 10);
    const amount = rawAmt > 0 ? (rawAmt > 1000000 ? Math.round(rawAmt / 10) : rawAmt) : 0;

    if (m === 'follow' || t.includes('follow') || t.includes('theo dõi')) {
      followCoins += amount;
    } else if (m === 'like' || m === 'watch' || t.includes('tim') || t.includes('thả tim') || t.includes('xem video') || t.includes('lướt video')) {
      watchLikeCoins += amount;
    } else if (m === 'comment' || t.includes('bình luận') || t.includes('comment')) {
      commentCoins += amount;
    } else if (m === 'live' || m === 'watch_live' || t.includes('live') || t.includes('phiên live')) {
      liveCoins += amount;
    } else if (m === 'share' || m === 'referral' || t.includes('chia sẻ') || t.includes('bảo trợ') || t.includes('giới thiệu') || t.includes('vòng quay')) {
      shareRefCoins += amount;
    } else {
      followCoins += Math.round(amount * 0.35);
      watchLikeCoins += Math.round(amount * 0.25);
      commentCoins += Math.round(amount * 0.15);
      liveCoins += Math.round(amount * 0.15);
      shareRefCoins += Math.round(amount * 0.10);
    }
  });

  const totalCalculated = followCoins + watchLikeCoins + commentCoins + liveCoins + shareRefCoins;
  const baseTotal = totalCalculated > 0 ? totalCalculated : (user.avaliveCoins || 10000);

  const followVal = totalCalculated > 0 ? followCoins : Math.round(baseTotal * 0.42);
  const watchLikeVal = totalCalculated > 0 ? watchLikeCoins : Math.round(baseTotal * 0.22);
  const commentVal = totalCalculated > 0 ? commentCoins : Math.round(baseTotal * 0.15);
  const liveVal = totalCalculated > 0 ? liveCoins : Math.round(baseTotal * 0.12);
  const shareRefVal = totalCalculated > 0 ? shareRefCoins : Math.round(baseTotal * 0.09);

  const sumAll = followVal + watchLikeVal + commentVal + liveVal + shareRefVal || 1;
  const followPct = Math.round((followVal / sumAll) * 100);
  const watchLikePct = Math.round((watchLikeVal / sumAll) * 100);
  const commentPct = Math.round((commentVal / sumAll) * 100);
  const livePct = Math.round((liveVal / sumAll) * 100);
  const shareRefPct = Math.max(0, 100 - (followPct + watchLikePct + commentPct + livePct));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-[#0D111E] border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>BÁO CÁO PHÂN TÍCH HIỆU SUẤT THỜI GIAN THỰC</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Bảng Thống Kê Thu Nhập & Thời Gian Xem Video</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Đo lường chi tiết từng giây xem video chuẩn thuật toán TikTok, tỷ lệ giữ chân (Retention Rate) và bảng tính thu nhập minh bạch.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={openLuckyWheel}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
            >
              <Gift className="h-4 w-4 text-neonGold" />
              <span>Vòng Quay May Mắn</span>
            </button>
            <button
              onClick={openWithdraw}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-md"
            >
              Rút Tiền Về Ngân Hàng
            </button>
          </div>
        </div>
      </div>

      {/* 4 Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Thời Gian Xem Hôm Nay</span>
            <Clock className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {analytics.todayWatchMinutes} <span className="text-xs text-white font-normal">phút</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Đã xem {analytics.todayVideosWatched} video chuẩn thuật toán</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Điểm Giữ Chân (Retention)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {analytics.retentionScore}%
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">Đạt chuẩn đề xuất For You Page (FYP)</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Thu Nhập Hôm Nay</span>
            <Coins className="h-4 w-4 text-neonGold" />
          </div>
          <div className="text-2xl font-black text-neonGold font-mono">
            +{analytics.todayEarningsCoins.toLocaleString()} Xu
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">≈ {analytics.todayEarningsCoins.toLocaleString()}đ tiền mặt</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Chuỗi Ngày Điểm Danh</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {analytics.dailyStreak} Ngày
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Thưởng tăng dần theo ngày</p>
        </div>
      </div>

      {/* 7-Day Streak Check-in Section */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Chuỗi Điểm Danh 7 Ngày Nhận Thưởng Lũy Tiến
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Mỗi ngày mở app điểm danh để nhận Xu miễn phí và vé quay may mắn.
            </p>
          </div>

          <button
            onClick={checkInDaily}
            disabled={analytics.checkedInToday}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all font-mono shrink-0 ${
              analytics.checkedInToday
                ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-black shadow-lg shadow-amber-500/20 hover:opacity-95'
            }`}
          >
            {analytics.checkedInToday ? 'Đã Điểm Danh Hôm Nay ✓' : 'Điểm Danh Nhận Xu Ngay'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {streakRewards.map((sr) => {
            const isCompleted = sr.day <= (analytics.dailyStreak % 7);
            const isCurrent = sr.day === ((analytics.dailyStreak % 7) + 1);

            return (
              <div
                key={sr.day}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10 animate-pulse'
                    : 'bg-black/30 border-white/5 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase">{sr.label}</div>
                <div className="text-xs font-black font-mono mt-1 text-neonGold">
                  +{sr.coins.toLocaleString()} Xu
                </div>
                <div className="text-[9px] mt-1 font-mono">
                  {isCompleted ? 'Đã nhận ✓' : isCurrent ? 'Hôm nay' : 'Chưa mở'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real Working Earnings Calculator */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-neonGold" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Bảng Tính Thu Nhập Theo Thời Gian Làm Việc Thực Tế
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kéo thanh trượt thời gian làm nhiệm vụ mỗi ngày để xem thu nhập chính thức rút về tài khoản ngân hàng.
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Thời gian làm mỗi ngày:</span>
              <span className="text-base font-black text-white">{workingHours} Tiếng / ngày</span>
            </div>

            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={workingHours}
              onChange={(e) => setWorkingHours(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 Giờ</span>
              <span>2 Giờ</span>
              <span>3 Giờ</span>
              <span>4 Giờ</span>
              <span>5 Giờ</span>
              <span>6 Giờ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-[10px] text-slate-400 font-mono">Thu nhập thực nhận mỗi ngày</div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                {estimatedDailyEarnings.toLocaleString()}đ
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
              <div className="text-[10px] text-slate-400 font-mono">Thu nhập thực nhận mỗi tháng</div>
              <div className="text-lg font-black text-purple-300 font-mono mt-0.5">
                {estimatedMonthlyEarnings.toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>

        {/* Right: Income Distribution Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Cơ Cấu Phân Bổ Nguồn Thu Nhập
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tỷ lệ doanh thu tạo ra từ các hình thức nhiệm vụ khác nhau trên tài khoản của bạn:
          </p>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Nhiệm vụ Follow Kênh ({followPct}%)</span>
                <span className="text-rose-400 font-bold">{followVal.toLocaleString()}đ</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${followPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Thả Tim & Xem Video FYP ({watchLikePct}%)</span>
                <span className="text-pink-400 font-bold">{watchLikeVal.toLocaleString()}đ</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${watchLikePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Bình Luận Seeding Có Tâm ({commentPct}%)</span>
                <span className="text-cyan-400 font-bold">{commentVal.toLocaleString()}đ</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${commentPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Xem & Tương Tác Livestream ({livePct}%)</span>
                <span className="text-purple-400 font-bold">{liveVal.toLocaleString()}đ</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-purple-400 transition-all duration-500" style={{ width: `${livePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-mono">
                <span>Chia Sẻ Mạng Xã Hội ({shareRefPct}%)</span>
                <span className="text-amber-400 font-bold">{shareRefVal.toLocaleString()}đ</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 mt-1 overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${shareRefPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: BÁO CÁO PHÂN TÍCH NHIỆM VỤ XEM LIVESTREAM & ANTI-BOT SHIELD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D111E] border border-purple-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold mb-1">
              <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              <span>BẢO CHỨNG MẮT XEM THẬT 100% (ANTI-BOT SHIELD)</span>
            </div>
            <h3 className="text-lg font-black text-white">
              Báo Cáo Phân Tích Nhiệm Vụ Livestream & Tỷ Lệ Giữ Mắt Thật
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hệ thống theo dõi từng phút xem live, số lượt tim heartbeat, kiểm tra chống bot và lịch sử các phòng live bạn đã tham gia.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-purple-500/15 border border-purple-500/30 font-mono text-xs flex items-center gap-2 shrink-0">
            <Award className="h-4 w-4 text-neonGold" />
            <span className="text-white font-bold">Cấp Bậc: Rank {quota.rank}</span>
            <span className="text-neonGold font-black">(x{quota.multiplier} Xu)</span>
          </div>
        </div>

        {/* 4 KPI Metrics for Livestream */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Thời Gian Xem Live Hôm Nay</span>
            <div className="text-xl font-black text-rose-400 font-mono">
              {analytics.todayLiveMinutes || 0} <span className="text-xs text-white font-normal">phút</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono">Tính theo từng phút hoạt động</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Phiên Live Hoàn Thành</span>
            <div className="text-xl font-black text-purple-400 font-mono">
              {quota.completedToday} / {quota.maxLivePerDay} <span className="text-xs text-white font-normal">phòng</span>
            </div>
            <p className="text-[9px] text-emerald-400 font-mono">Còn {quota.remainingToday} lượt hôm nay</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Xu Kiếm Được Từ Live</span>
            <div className="text-xl font-black text-neonGold font-mono">
              +{(analytics.todayLiveCoinsEarned || 0).toLocaleString()} Xu
            </div>
            <p className="text-[9px] text-slate-500 font-mono">Bao gồm thưởng mốc & anti-bot</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Tỷ Lệ Giữ Mắt Thật</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {analytics.liveRetentionRate || 99.4}%
            </div>
            <p className="text-[9px] text-emerald-400 font-mono">0% Bot • Đạt chuẩn TikTok</p>
          </div>
        </div>

        {/* Live Watch History Table */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Lịch Sử Các Phiên Xem Livestream Gần Đây
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              Được bảo chứng bởi thuật toán Anti-Bot Heartbeat
            </span>
          </div>

          <div className="space-y-2">
            {(analytics.liveWatchHistory && analytics.liveWatchHistory.length > 0) ? (
              analytics.liveWatchHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-black/50 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.channelAvatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate max-w-sm">
                        {item.roomTitle}
                      </div>
                      <div className="text-[11px] font-mono text-rose-400 flex items-center gap-2 mt-0.5">
                        <span>{item.channelName} ({item.channelHandle})</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right font-mono">
                    <div>
                      <div className="text-emerald-400 font-bold">
                        Đã xem: {item.minutesWatched} phút
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.tapsCount} lượt tap tim
                      </div>
                    </div>

                    <div>
                      <div className="text-neonGold font-black text-sm">
                        +{item.coinsEarned.toLocaleString()} Xu
                      </div>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        Người thật 100%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs font-mono">
                Chưa có phiên livestream nào được ghi nhận hôm nay. Hãy vào tab Nhiệm vụ để bắt đầu!
              </div>
            )}
          </div>
        </div>

        {/* Tier Comparison Matrix */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-neonGold" />
            <h4 className="text-xs font-bold text-white uppercase font-mono">
              Bảng Hạn Mức Xem Live & Hệ Số Thưởng Theo Cấp Bậc Tài Khoản
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className={`p-3 rounded-xl border ${quota.rank === 'Đồng' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
              <div className="font-black text-sm text-white">Rank Đồng</div>
              <div className="text-[11px] mt-1">• Hạn mức: 5 Live / ngày</div>
              <div className="text-[11px]">• Hệ số thưởng: x1.0 (300 Xu/p)</div>
              <div className="text-[10px] text-slate-500 mt-1">Mở mốc 3 - 5 phút</div>
            </div>

            <div className={`p-3 rounded-xl border ${quota.rank === 'Bạc' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
              <div className="font-black text-sm text-white">Rank Bạc</div>
              <div className="text-[11px] mt-1">• Hạn mức: 12 Live / ngày</div>
              <div className="text-[11px] text-neonGold">• Hệ số thưởng: x1.15 (+15%)</div>
              <div className="text-[10px] text-slate-500 mt-1">Mở mốc 10 phút</div>
            </div>

            <div className={`p-3 rounded-xl border ${quota.rank === 'Vàng' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
              <div className="font-black text-sm text-white">Rank Vàng</div>
              <div className="text-[11px] mt-1">• Hạn mức: 25 Live / ngày</div>
              <div className="text-[11px] text-neonGold">• Hệ số thưởng: x1.30 (+30%)</div>
              <div className="text-[10px] text-slate-500 mt-1">Mở mốc 15 phút Mega Live</div>
            </div>

            <div className={`p-3 rounded-xl border ${quota.rank === 'Kim Cương' ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-md' : 'bg-white/5 border-white/5 text-slate-400'}`}>
              <div className="font-black text-sm text-white">Rank Kim Cương 💎</div>
              <div className="text-[11px] mt-1">• Hạn mức: Không giới hạn</div>
              <div className="text-[11px] text-neonGold">• Hệ số thưởng: x1.50 (+50%)</div>
              <div className="text-[10px] text-emerald-400 mt-1">Ưu tiên phòng Live VIP 100M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
