import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  Users, 
  ShoppingBag, 
  Send, 
  Sparkles, 
  Clock, 
  Flame,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Award,
  BarChart3,
  Share2,
  Coins,
  MessageSquare,
  Copy,
  TrendingUp,
  ThumbsUp,
  ExternalLink,
  Radio,
  RefreshCw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Tv,
  Check,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TASK_ACTION_REWARDS, LivestreamTaskItem } from '../../types';
import { LIVE_SEEDING_TEMPLATES, LIVE_MILESTONE_REWARDS } from '../../data/livePolicyData';
import { parseMediaUrl } from '../../data/videoSources';

export const LivestreamRunnerModal: React.FC = () => {
  const { 
    activeLiveTask, 
    livestreamTasks,
    openLiveRunner,
    isLiveRunnerOpen, 
    closeLiveRunner, 
    watchLivestreamMinute, 
    completeLivestreamSession,
    getUserLiveQuota,
    interactWithLiveBroadcast,
    showToast,
    user 
  } = useTikTokApp();

  const quota = getUserLiveQuota();

  const [secondsInMinute, setSecondsInMinute] = useState<number>(60);
  const [totalMinutesWatched, setTotalMinutesWatched] = useState<number>(0);
  const [tapsCount, setTapsCount] = useState<number>(0);
  const [idleSeconds, setIdleSeconds] = useState<number>(0);
  const [passedCaptcha, setPassedCaptcha] = useState<boolean>(false);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaSecondsLeft, setCaptchaSecondsLeft] = useState<number>(15);
  const [targetCaptchaIcon, setTargetCaptchaIcon] = useState<{ id: string; name: string; icon: string }>({ id: 'gift', name: 'Hộp Quà', icon: '🎁' });
  const [isCompletedMission, setIsCompletedMission] = useState<boolean>(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState<boolean>(false);
  const [showSeedingDrawer, setShowSeedingDrawer] = useState<boolean>(false);
  const [isOpenedOnTikTok, setIsOpenedOnTikTok] = useState<boolean>(false);
  const [showRoomSwitcher, setShowRoomSwitcher] = useState<boolean>(false);
  const [showShopProduct, setShowShopProduct] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaInfo = activeLiveTask ? parseMediaUrl(activeLiveTask.targetUrl, activeLiveTask.channelHandle) : null;
  const isYouTube = Boolean(mediaInfo?.isYouTube && mediaInfo?.youtubeId);

  const togglePlayLive = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) {
      setIsPlaying(p => !p);
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Idempotent rewards for live actions
  const [claimedHeartReward, setClaimedHeartReward] = useState<boolean>(false);
  const [claimedCommentReward, setClaimedCommentReward] = useState<boolean>(false);
  const [claimedShareReward, setClaimedShareReward] = useState<boolean>(false);

  const [heartsBurst, setHeartsBurst] = useState<{ id: number; x: number; color: string }[]>([]);
  const [chatMessages, setChatMessages] = useState<string[]>([
    'Shop ơi áo này còn size L không ạ?',
    'Đã chốt đơn 2 chiếc màu be nhé chủ shop ❤️',
    'Review chất vải đỉnh thực sự, vừa nhận hàng hôm qua!',
    'Mọi người thả tim nhiệt tình để shop tung mã giảm giá 50k nhé!',
    'Mắt xem đang lên nhanh quá shop ơi, chuẩn bị bão đơn nhé 🔥'
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  const targetMinutes = activeLiveTask?.targetMinutes || 3;
  const isTargetReached = totalMinutesWatched >= targetMinutes;

  // Calculate live earnings so far
  const baseRewardPerMinute = activeLiveTask?.rewardPerMinute || 300;
  const currentEarnedCoins = Math.round(
    (totalMinutesWatched * baseRewardPerMinute +
      (claimedHeartReward ? 200 : 0) +
      (claimedCommentReward ? 350 : 0) +
      (claimedShareReward ? 300 : 0) +
      (passedCaptcha ? 200 : 0)) * quota.multiplier
  );

  // Reset state on open and auto-play
  useEffect(() => {
    if (isLiveRunnerOpen && activeLiveTask) {
      setSecondsInMinute(60);
      setTotalMinutesWatched(0);
      setTapsCount(0);
      setIdleSeconds(0);
      setPassedCaptcha(false);
      setShowCaptcha(false);
      setIsCompletedMission(false);
      setShowStatsDrawer(false);
      setShowSeedingDrawer(false);
      setShowRoomSwitcher(false);
      setShowShopProduct(false);
      setIsOpenedOnTikTok(false);
      setClaimedHeartReward(false);
      setClaimedCommentReward(false);
      setClaimedShareReward(false);
      setIsPlaying(true);

      if (videoRef.current && !isYouTube) {
        videoRef.current.defaultMuted = false;
        videoRef.current.muted = isMuted;
        videoRef.current.playsInline = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
              } else {
                setIsPlaying(false);
              }
            });
        }
      }
    }
  }, [isLiveRunnerOpen, activeLiveTask?.id, isMuted, isYouTube]);

  const handleOpenTikTokApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeLiveTask?.channelHandle) return;
    setIsOpenedOnTikTok(true);
    showToast(`🔴 Đang xem phiên live của ${activeLiveTask.channelHandle}. Hệ thống tự động đếm phút và cộng Xu.`);
  };

  const handleSwitchRoom = (task: LivestreamTaskItem) => {
    openLiveRunner(task);
    setShowRoomSwitcher(false);
    setIsOpenedOnTikTok(false);
    showToast(`🔴 Đã chuyển sang phòng live: ${task.channelName}`);
  };

  // Main tick loop
  useEffect(() => {
    if (!isLiveRunnerOpen || !activeLiveTask || isCompletedMission) return;

    const timer = setInterval(() => {
      if (showCaptcha) {
        setCaptchaSecondsLeft(prev => {
          if (prev <= 1) {
            setShowCaptcha(false);
            return 15;
          }
          return prev - 1;
        });
        return;
      }

      setIdleSeconds(prev => prev + 1);

      if (!passedCaptcha && Math.random() < 0.03 && !showCaptcha) {
        const icons = [
          { id: 'gift', name: 'Hộp Quà', icon: '🎁' },
          { id: 'gem', name: 'Kim Cương', icon: '💎' },
          { id: 'fire', name: 'Ngọn Lửa', icon: '🔥' },
          { id: 'rocket', name: 'Tên Lửa', icon: '🚀' }
        ];
        const selected = icons[Math.floor(Math.random() * icons.length)];
        setTargetCaptchaIcon(selected);
        setCaptchaSecondsLeft(15);
        setShowCaptcha(true);
      }

      setSecondsInMinute(prev => {
        if (prev <= 1) {
          watchLivestreamMinute(activeLiveTask.id);
          setTotalMinutesWatched(m => {
            const nextMin = m + 1;
            if (nextMin >= targetMinutes) {
              setIsCompletedMission(true);
            }
            return nextMin;
          });
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLiveRunnerOpen, activeLiveTask, isCompletedMission, showCaptcha, passedCaptcha, targetMinutes]);

  if (!isLiveRunnerOpen || !activeLiveTask) return null;

  // Tap-tap Heartbeat Handler
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    setIdleSeconds(0);
    const nextTaps = tapsCount + 1;
    setTapsCount(nextTaps);

    if (nextTaps >= 20 && !claimedHeartReward) {
      setClaimedHeartReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'heart');
      showToast('💖 Đã tap đủ 20 tim! Nhận ngay +200 Xu thưởng.');
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colors = ['#FF0050', '#00F2FE', '#FFD700', '#FF69B4', '#A855F7', '#10B981'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setHeartsBurst(prev => [...prev, { id: Date.now(), x, color: randomColor }]);
    setTimeout(() => {
      setHeartsBurst(prev => prev.filter(h => Date.now() - h.id < 1500));
    }, 1500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [...prev, `${user.name}: ${inputMsg}`]);
    setInputMsg('');
    setIdleSeconds(0);

    if (!claimedCommentReward) {
      setClaimedCommentReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'comment');
      showToast('💬 Đã gửi bình luận seeding! Nhận ngay +350 Xu thưởng.');
    }
  };

  const handleSelectQuickComment = (commentText: string) => {
    // Copy to clipboard for instant pasting on real TikTok Live
    navigator.clipboard?.writeText(commentText).catch(() => {});
    setChatMessages(prev => [...prev, `${user.name}: ${commentText}`]);
    setIdleSeconds(0);
    setShowSeedingDrawer(false);

    if (!claimedCommentReward) {
      setClaimedCommentReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'comment');
      showToast('💬 Đã sao chép & gửi bình luận seeding giỏ hàng! (+350 Xu)');
    } else {
      showToast('✓ Đã sao chép & gửi bình luận vào phiên live!');
    }
  };

  const handleShareLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!claimedShareReward) {
      setClaimedShareReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'share');
      showToast('🚀 Đã chia sẻ phòng Live! Nhận ngay +300 Xu.');
    } else {
      showToast('Đã sao chép link chia sẻ phòng Live!');
    }
  };

  const handleSolveCaptcha = (iconId: string) => {
    if (iconId === targetCaptchaIcon.id) {
      setPassedCaptcha(true);
      setShowCaptcha(false);
      setIdleSeconds(0);
      showToast('🛡️ Xác minh người thật thành công! +200 Xu thưởng may mắn.');
    } else {
      setShowCaptcha(false);
    }
  };

  const handleFinishMission = () => {
    interactWithLiveBroadcast(activeLiveTask.id, 'eye');
    completeLivestreamSession(activeLiveTask.id, totalMinutesWatched, tapsCount, passedCaptcha);
    closeLiveRunner();
  };

  // Mock Active Real Watchers
  const activeWatchers = [
    { id: '#USR-90218', name: 'Minh Hoàng', device: 'iPhone 15 Pro', watchMins: '14p', status: 'Active' },
    { id: '#USR-18239', name: 'Thanh Thảo', device: 'Galaxy S24', watchMins: '28p', status: 'Active' },
    { id: '#USR-88210', name: 'Tuấn Anh', device: 'Xiaomi 13T', watchMins: '9p', status: 'Active' },
    { id: '#USR-33419', name: 'Ngọc Lan', device: 'iPhone 14', watchMins: '41p', status: 'Active' },
    { id: '#USR-55102', name: 'Hải Đăng', device: 'Oppo Reno 11', watchMins: '18p', status: 'Active' }
  ];

  // Quick comments suggestions for this live
  const quickComments = LIVE_SEEDING_TEMPLATES[0].comments.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-sans">
      <div 
        className="relative w-full max-w-md h-[92vh] max-h-[850px] rounded-3xl bg-[#090C16] border border-white/20 shadow-2xl overflow-hidden flex flex-col select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP STATUS BAR: Live Earning Ticker & Rank Multiplier */}
        <div className="bg-[#0D111E] px-3.5 py-2 border-b border-white/10 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-neonGold font-bold">
              <Award className="h-3.5 w-3.5" />
              <span>Hạng {quota.rank} (x{quota.multiplier})</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Hôm nay: {quota.completedToday}/{quota.maxLivePerDay} Live
            </span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-black font-mono-numbers bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <Coins className="h-3.5 w-3.5" />
            <span>+{currentEarnedCoins.toLocaleString()} Xu</span>
          </div>
        </div>

        {/* LIVE TOP HEADER: Host Info & Live Counters */}
        <div className="bg-gradient-to-b from-black/80 to-transparent p-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <img
              src={activeLiveTask.channelAvatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-rose-500 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xs truncate max-w-[150px]">
                  {activeLiveTask.channelName}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black font-mono uppercase tracking-wider animate-pulse">
                  LIVE 🔴
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <Users className="h-3 w-3 text-rose-400" />
                <span>{(activeLiveTask.currentViewers + totalMinutesWatched * 12).toLocaleString()} mắt xem thật</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowStatsDrawer(!showStatsDrawer)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors cursor-pointer"
              title="Xem báo cáo người xem thật"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleShareLive}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                claimedShareReward ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Chia sẻ phòng Live (+300 Xu)"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeLiveRunner}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* LIVE CONNECTION SUB-BAR: Exact TikTok Live Link & Controls */}
        <div className="bg-[#080B14] px-3 py-1.5 border-y border-white/10 flex items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 min-w-0 text-slate-300">
            <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse shrink-0" />
            <span className="text-white font-bold truncate max-w-[130px] sm:max-w-[170px]">
              {activeLiveTask.channelHandle}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-cyan-400 text-[10px] truncate hidden sm:inline max-w-[110px]">
              {activeLiveTask.targetUrl.replace('https://', '')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Open in TikTok App Button */}
            <button
              type="button"
              onClick={handleOpenTikTokApp}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer font-display"
              title="Mở trực tiếp trên App TikTok để xem phòng live thật"
            >
              <ArrowUpRight className="h-3 w-3" />
              <span>Mở App TikTok</span>
            </button>

            {/* Room Switcher Drawer Button */}
            <button
              type="button"
              onClick={() => setShowRoomSwitcher(!showRoomSwitcher)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Chuyển đổi phòng live khác"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Đổi Phòng ({livestreamTasks.length})</span>
            </button>
          </div>
        </div>

        {/* WATCH PROGRESS & MILESTONES BAR */}
        <div className="bg-[#0B0F19] px-3.5 py-2 border-b border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-rose-400" />
              <span>Tiến độ: <strong className="text-white">{totalMinutesWatched} / {targetMinutes} phút</strong></span>
            </span>
            <span className="text-neonGold font-bold">
              +{baseRewardPerMinute * quota.multiplier} Xu/phút • Còn {secondsInMinute}s
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, ((totalMinutesWatched * 60 + (60 - secondsInMinute)) / (targetMinutes * 60)) * 100)}%` }}
            />
          </div>

          {/* 4 Quick Milestone Badges */}
          <div className="grid grid-cols-4 gap-1 pt-0.5 text-center text-[9px] font-mono">
            <div className={`py-0.5 rounded ${totalMinutesWatched >= 3 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>
              Mốc 3p (+1.2k)
            </div>
            <div className={`py-0.5 rounded ${totalMinutesWatched >= 5 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>
              Mốc 5p (+2.5k)
            </div>
            <div className={`py-0.5 rounded ${totalMinutesWatched >= 10 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>
              Mốc 10p (+6k)
            </div>
            <div className={`py-0.5 rounded ${totalMinutesWatched >= 15 ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>
              Mốc 15p (+10k)
            </div>
          </div>
        </div>

        {/* MAIN VIDEO STREAM CONTAINER (SIMULATOR WITH REAL INTERACTIONS) */}
        <div 
          className="flex-1 relative bg-slate-950 overflow-hidden cursor-pointer flex flex-col justify-end p-4"
          onClick={handleScreenTap}
        >
          {/* Vignette overlay for readable text while keeping live video bright */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none z-[1]" />

          {/* Real Live Video Player: YouTube Live, Facebook Live, TikTok Live or Native HD Stream */}
          {isYouTube && mediaInfo?.youtubeId ? (
            <iframe
              key={activeLiveTask.id + '_yt_' + mediaInfo.youtubeId}
              src={`https://www.youtube.com/embed/${mediaInfo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${mediaInfo.youtubeId}&modestbranding=1&rel=0&enablejsapi=1`}
              title={activeLiveTask.roomTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
            />
          ) : mediaInfo?.isFacebook ? (
            <iframe
              key={activeLiveTask.id + '_fb_' + encodeURIComponent(activeLiveTask.targetUrl)}
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeLiveTask.targetUrl)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
              title={activeLiveTask.roomTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
            />
          ) : mediaInfo?.embedUrl ? (
            <iframe
              key={activeLiveTask.id + '_tt_live_' + (mediaInfo.videoId || mediaInfo.handle)}
              src={mediaInfo.embedUrl}
              title={activeLiveTask.roomTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
            />
          ) : (
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.defaultMuted = false;
                  el.muted = isMuted;
                  el.playsInline = true;
                  el.play().then(() => setIsPlaying(true)).catch(() => {
                    el.muted = true;
                    el.play().catch(() => {});
                  });
                }
              }}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={activeLiveTask.channelAvatar}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
              src={mediaInfo?.streamUrl || activeLiveTask.targetUrl}
            />
          )}

          {/* Sound & Play Toggle Buttons */}
          <div className="absolute top-14 right-3 z-20 flex items-center gap-1.5">
            {!isYouTube && (
              <button
                type="button"
                onClick={togglePlayLive}
                className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                title={isPlaying ? 'Tạm dừng live' : 'Tiếp tục phát live'}
              >
                {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
          </div>

          {/* Large Center Play Button when Paused */}
          {!isPlaying && !isYouTube && (
            <div 
              onClick={togglePlayLive}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
            >
              <div className="p-5 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-2xl shadow-rose-600/60 border-2 border-white/40 hover:scale-110 active:scale-95 transition-all animate-pulse">
                <Play className="h-12 w-12 fill-white ml-1" />
              </div>
              <div className="mt-3 px-4 py-1.5 rounded-full bg-black/85 border border-white/20 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-xl">
                ▶️ BẤM ĐỂ PHÁT PHIÊN LIVE
              </div>
            </div>
          )}

          {/* Active TikTok Sync Banner (if user opened on TikTok) */}
          {isOpenedOnTikTok && (
            <div className="absolute top-14 inset-x-3 z-20 p-2 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-left flex items-center justify-between gap-2 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-300 text-[10px] font-mono min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="truncate">Đang đồng bộ xem trên App TikTok: <strong>{activeLiveTask.channelHandle}</strong></span>
              </div>
              <span className="text-[10px] font-mono font-bold text-neonGold shrink-0">
                +{currentEarnedCoins} Xu
              </span>
            </div>
          )}

          {/* Floating Tap Hearts Animation */}
          {heartsBurst.map((h) => (
            <div
              key={h.id}
              className="absolute bottom-16 pointer-events-none animate-bounce z-20"
              style={{
                left: `${h.x}px`,
                animation: 'floatHeart 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards'
              }}
            >
              <Heart className="h-6 w-6 fill-current drop-shadow-md" style={{ color: h.color }} />
            </div>
          ))}

          {/* Room Title Floating Banner */}
          <div className="absolute top-3 inset-x-3 p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-left pointer-events-none z-10">
            <div className="text-[10px] text-neonGold font-mono font-bold flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              <span>TIKTOK SHOP GIỎ HÀNG CHÍNH HÃNG</span>
            </div>
            <p className="text-white text-xs font-bold line-clamp-1 mt-0.5">
              {activeLiveTask.roomTitle}
            </p>
          </div>

          {/* Pinned TikTok Shop Cart Bag Button */}
          <div 
            onClick={(e) => { e.stopPropagation(); setShowShopProduct(!showShopProduct); }}
            className="absolute bottom-20 left-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag className="h-4 w-4 text-black" />
            <div className="text-left leading-tight font-bold">
              <div className="text-[8px] uppercase tracking-wider text-black/70 font-mono">TikTok Shop</div>
              <div className="text-[10px] font-extrabold">Deal Ghim 🔥</div>
            </div>
          </div>

          {/* Pinned Product Modal Popover */}
          {showShopProduct && (
            <div 
              className="absolute inset-x-3 bottom-24 z-30 p-3.5 rounded-2xl bg-[#090C16]/95 backdrop-blur-xl border border-amber-500/40 text-left shadow-2xl space-y-2.5 animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 font-display">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>SẢN PHẨM ĐANG GHIM TRONG PHIÊN LIVE</span>
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowShopProduct(false)} 
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img src={activeLiveTask.channelAvatar} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/40 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white line-clamp-1">{activeLiveTask.roomTitle}</h5>
                  <div className="flex items-center gap-2 mt-0.5 font-mono">
                    <span className="text-rose-400 font-black text-xs">89,000đ</span>
                    <span className="text-[10px] text-slate-500 line-through">189,000đ</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">-52%</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenTikTokApp}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-95 text-black font-black text-[11px] font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Vào Mua Giỏ Hàng Trên TikTok Live</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* ROOM SWITCHER DRAWER */}
          {showRoomSwitcher && (
            <div 
              className="absolute inset-0 z-40 bg-[#090C16]/98 backdrop-blur-xl p-4 overflow-y-auto space-y-3 text-left animate-in fade-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-400" />
                  <span className="font-bold text-white text-xs font-mono uppercase">
                    CHỌN PHÒNG LIVE ĐANG PHÁT SÓNG ({livestreamTasks.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoomSwitcher(false)}
                  className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {livestreamTasks.map((t) => {
                  const isCurrent = t.id === activeLiveTask.id;
                  const isBuyerBroadcast = t.id.startsWith('live_bcast_') || t.tags?.includes('Gói Đang Chạy');
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSwitchRoom(t)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500/50' 
                          : isBuyerBroadcast
                          ? 'bg-rose-500/10 border-rose-500/40 text-slate-300 hover:border-rose-500'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img src={t.channelAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20" />
                          <span className="absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded-full bg-rose-600 text-white text-[7px] font-black font-mono">
                            LIVE
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white truncate max-w-[140px]">{t.channelName}</span>
                            {isBuyerBroadcast && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-600/30 text-rose-300 text-[8px] font-mono font-bold border border-rose-500/40">
                                GÓI ĐANG CHẠY
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{t.roomTitle}</p>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                            <span className="text-rose-400 font-bold">{t.currentViewers.toLocaleString()} mắt xem</span>
                            <span>•</span>
                            <span className="text-neonGold font-bold">+{t.rewardPerMinute * quota.multiplier} Xu/p</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="px-2.5 py-1 rounded-lg bg-purple-500 text-white font-mono font-bold text-[10px]">
                            Đang Xem
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono text-[10px]">
                            Vào Xem
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Action Icons Column */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 z-10">
            {/* Heart Tap Button */}
            <div 
              onClick={handleScreenTap}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-75 ${
                claimedHeartReward 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-black/60 text-rose-400 border border-white/10 hover:border-rose-500'
              }`}>
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className="text-[10px] font-mono text-white font-bold mt-0.5 drop-shadow">
                {tapsCount} / 20
              </span>
              <span className="text-[8px] font-mono text-rose-300">
                {claimedHeartReward ? '✓ +200 Xu' : 'Tap +200 Xu'}
              </span>
            </div>

            {/* Quick Seeding Script Opener */}
            <div 
              onClick={(e) => { e.stopPropagation(); setShowSeedingDrawer(true); }}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="p-3 rounded-full bg-cyan-600/80 hover:bg-cyan-500 text-white backdrop-blur-md shadow-lg transition-transform active:scale-75">
                <MessageSquare className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-mono text-cyan-300 mt-0.5">
                {claimedCommentReward ? '✓ +350 Xu' : 'Mồi +350 Xu'}
              </span>
            </div>

            {/* Human Verification Badge */}
            <div className="flex flex-col items-center">
              <div className={`p-2.5 rounded-full backdrop-blur-md ${
                passedCaptcha ? 'bg-emerald-600 text-white' : 'bg-black/60 text-slate-400 border border-white/10'
              }`}>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[8px] font-mono text-slate-300 mt-0.5">
                {passedCaptcha ? '100% Người thật' : 'Anti-bot'}
              </span>
            </div>
          </div>

          {/* Left Live Chat Messages Feed */}
          <div className="w-4/5 space-y-1.5 text-left pointer-events-none z-10 max-h-48 overflow-hidden flex flex-col justify-end pb-2">
            {chatMessages.slice(-4).map((msg, i) => (
              <div 
                key={i} 
                className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-white/5 text-[11px] text-white inline-block max-w-full leading-snug drop-shadow"
              >
                {msg}
              </div>
            ))}
          </div>

          {/* ANTI-BOT CAPTCHA POPUP MODAL */}
          {showCaptcha && (
            <div 
              className="absolute inset-x-4 top-24 z-40 p-4 rounded-3xl bg-black/95 backdrop-blur-xl border border-rose-500/50 shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inline-flex p-2 rounded-2xl bg-rose-500/20 text-rose-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Xác Thực Người Thật Xem Live</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vui lòng chạm vào biểu tượng: <strong className="text-neonGold text-base">"{targetCaptchaIcon.name}" {targetCaptchaIcon.icon}</strong>
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Thời gian còn lại: <span className="text-rose-400 font-bold">{captchaSecondsLeft}s</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { id: 'gift', name: 'Hộp Quà', icon: '🎁' },
                  { id: 'gem', name: 'Kim Cương', icon: '💎' },
                  { id: 'fire', name: 'Ngọn Lửa', icon: '🔥' },
                  { id: 'rocket', name: 'Tên Lửa', icon: '🚀' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleSolveCaptcha(btn.id)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>

              <p className="text-[9px] text-slate-400">
                Bảo vệ người mua gói 0% bot • Tặng thêm +200 Xu khi xác thực thành công!
              </p>
            </div>
          )}

          {/* QUICK SEEDING SCRIPTS DRAWER */}
          {showSeedingDrawer && (
            <div 
              className="absolute inset-x-0 bottom-0 z-30 bg-[#090C16]/98 backdrop-blur-xl p-4 rounded-t-3xl border-t border-cyan-500/40 space-y-3 text-left shadow-2xl animate-in slide-in-from-bottom duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs font-display">
                  <Sparkles className="h-4 w-4" />
                  <span>Chọn Câu Seeding Giỏ Hàng 1-Chạm (+350 Xu)</span>
                </div>
                <button
                  onClick={() => setShowSeedingDrawer(false)}
                  className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                Chạm vào bất kỳ câu nào để gửi ngay vào live chat của shop và nhận thưởng:
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {LIVE_SEEDING_TEMPLATES[0].comments.map((cmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuickComment(cmt)}
                    className="w-full p-2.5 rounded-xl bg-black/60 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500 text-left text-xs text-slate-200 transition-all flex items-center justify-between gap-2 group"
                  >
                    <span>{cmt}</span>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0 group-hover:underline">
                      Gửi +350 Xu
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REAL-TIME AUDIENCE ANALYTICS DRAWER */}
          {showStatsDrawer && (
            <div 
              className="absolute inset-x-0 top-0 bottom-16 z-30 bg-[#090C16]/95 backdrop-blur-xl p-4 overflow-y-auto border-b border-white/10 space-y-3.5 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs font-mono">BÁO CÁO MẮT XEM THỜI GIAN THỰC</span>
                </div>
                <button
                  onClick={() => setShowStatsDrawer(false)}
                  className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-slate-400">Mắt Xem Thật</div>
                  <div className="text-sm font-black text-rose-400 mt-0.5">
                    {(activeLiveTask.currentViewers + totalMinutesWatched * 14).toLocaleString()}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-slate-400">Tỷ Lệ Giữ Chân</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">99.6%</div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-slate-400">Tổng Lượt Tim</div>
                  <div className="text-sm font-black text-amber-400 mt-0.5">
                    {(tapsCount * 25 + 4200).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Verified Audience List */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Danh sách người xem thật đang kết nối:
                </div>
                <div className="space-y-1">
                  {activeWatchers.map((w) => (
                    <div key={w.id} className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-white font-bold">{w.name}</span>
                        <span className="text-slate-500">({w.device})</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>Đã xem {w.watchMins}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px]">
                          {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MISSION COMPLETE BANNER OR BOTTOM CHAT & QUICK COMMENT BAR */}
        {isTargetReached ? (
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-purple-950/80 border-t border-emerald-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
            <div className="text-left">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5 font-display">
                <Sparkles className="h-4 w-4 text-neonGold" />
                <span>ĐÃ ĐẠT ĐỊNH MỨC {targetMinutes} PHÚT!</span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                Thưởng mốc: +{Math.round((activeLiveTask.milestoneBonusCoins || 500) * quota.multiplier)} Xu • Mở khóa Live mới
              </div>
            </div>

            <button
              onClick={handleFinishMission}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-black text-xs font-mono shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
            >
              Nhận Thưởng Ngay
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-[#0B0E17] border-t border-white/10 space-y-2">
            {/* 3 Quick Seeding Pills for 1-click comment */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {quickComments.map((cmt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuickComment(cmt)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[10px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all flex items-center gap-1"
                >
                  <span>{cmt}</span>
                  <span className="text-[9px] text-neonGold">+350 Xu</span>
                </button>
              ))}
            </div>

            {/* Custom Input Chat Form */}
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Nhập bình luận seeding giỏ hàng..."
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-all shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
