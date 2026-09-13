import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  MessageSquare,
  Share2, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ExternalLink,
  Coins,
  ShieldCheck,
  Play, 
  Pause,
  Zap,
  Music,
  Wifi,
  Battery,
  Check,
  Send,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TASK_ACTION_REWARDS } from '../../types';
import { parseMediaUrl } from '../../data/videoSources';

export const TikTokTaskRunnerModal: React.FC = () => {
  const { 
    runnerTask, 
    isRunnerOpen, 
    closeRunner, 
    completeTask, 
    claimTaskAction, 
    openShareModal, 
    openFeedRunner,
    userCompletedActions
  } = useTikTokApp();

  const previousCompletion = runnerTask ? userCompletedActions[runnerTask.id] : undefined;

  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaInfo = runnerTask ? parseMediaUrl(runnerTask.targetUrl || runnerTask.videoPreviewUrl || '', runnerTask.channelHandle) : null;
  const isYouTube = Boolean(mediaInfo?.isYouTube && mediaInfo?.youtubeId);
  const isTikTokEmbed = Boolean(mediaInfo?.isTikTok && mediaInfo?.videoId);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) {
      setIsPlaying(prev => !prev);
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Track claimed actions for this specific video session (Idempotent 1 time only)
  const [claimedActions, setClaimedActions] = useState<{
    follow: boolean;
    like: boolean;
    comment: boolean;
    share: boolean;
    watch: boolean;
  }>({
    follow: false,
    like: false,
    comment: false,
    share: false,
    watch: false
  });

  const [selectedComment, setSelectedComment] = useState<string>('');
  const [customComment, setCustomComment] = useState<string>('');
  const [showCommentSheet, setShowCommentSheet] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (isRunnerOpen && runnerTask) {
      const prev = userCompletedActions[runnerTask.id];
      setTimeLeft(prev?.viewed ? 0 : 15);
      setIsPlaying(true);
      setClaimedActions({
        follow: !!prev?.followed,
        like: !!prev?.liked,
        comment: !!prev?.commented,
        share: !!prev?.shared,
        watch: !!prev?.viewed
      });
      setSelectedComment('');
      setCustomComment('');
      setShowCommentSheet(false);
      setIsSubmitting(false);
      setFloatingHearts([]);

      if (videoRef.current && !isYouTube && !isTikTokEmbed) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = isMuted;
        videoRef.current.playsInline = true;
        videoRef.current.currentTime = 0;
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true)).catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
              setIsPlaying(false);
            }
          });
        }
      }
    }
  }, [isRunnerOpen, runnerTask, userCompletedActions, isMuted, isYouTube, isTikTokEmbed]);

  // 15-second countdown timer
  useEffect(() => {
    if (!isRunnerOpen || timeLeft <= 0 || !isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunnerOpen, timeLeft, isPlaying]);

  // When timer hits 0, auto claim watch reward (+200 Xu) once
  useEffect(() => {
    if (timeLeft === 0 && !claimedActions.watch && runnerTask) {
      claimTaskAction(runnerTask.id, 'watch');
      setClaimedActions(prev => ({ ...prev, watch: true }));
    }
  }, [timeLeft, claimedActions.watch, runnerTask, claimTaskAction]);

  if (!isRunnerOpen || !runnerTask) return null;

  // Trigger Like & Floating hearts effect
  const triggerLikeEffect = (clientX?: number, clientY?: number) => {
    if (!claimedActions.like) {
      claimTaskAction(runnerTask.id, 'like');
      setClaimedActions(prev => ({ ...prev, like: true }));
    }
    const id = Date.now() + Math.random();
    const x = clientX ?? (180 + (Math.random() * 60 - 30));
    const y = clientY ?? (300 + (Math.random() * 60 - 30));
    setFloatingHearts(prev => [...prev.slice(-8), { id, x, y }]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== id));
    }, 1200);
  };

  // Double tap video stage to like / single tap to play/pause
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_THRESHOLD = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_THRESHOLD) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerLikeEffect(x, y);
    } else {
      togglePlay();
    }
    lastTapRef.current = now;
  };

  // Single-action handlers with 1-time-only strict enforcement
  const handleFollowAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!claimedActions.follow) {
      claimTaskAction(runnerTask.id, 'follow');
      setClaimedActions(prev => ({ ...prev, follow: true }));
    }
  };

  const handleCommentAction = (commentText: string) => {
    setSelectedComment(commentText);
    if (!claimedActions.comment) {
      claimTaskAction(runnerTask.id, 'comment');
      setClaimedActions(prev => ({ ...prev, comment: true }));
    }
    setShowCommentSheet(false);
  };

  const handleShareAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!claimedActions.share) {
      claimTaskAction(runnerTask.id, 'share');
      setClaimedActions(prev => ({ ...prev, share: true }));
    }
    openShareModal({
      targetUrl: runnerTask.targetUrl,
      title: runnerTask.title
    });
  };

  const sampleComments = runnerTask.sampleComments || [
    'Sản phẩm dùng đỉnh chóp quá bạn ơi! Cho mình xin link bio với ❤️',
    'Nội dung làm cuốn thực sự, mong bạn ra thêm nhiều clip như này nhé!',
    'Đã theo dõi kênh và ủng hộ, chúc kênh sớm đạt 100k follow!'
  ];

  // Calculate session total earned
  const totalEarnedInSession = 
    (claimedActions.follow ? TASK_ACTION_REWARDS.FOLLOW : 0) +
    (claimedActions.like ? TASK_ACTION_REWARDS.LIKE : 0) +
    (claimedActions.comment ? TASK_ACTION_REWARDS.COMMENT : 0) +
    (claimedActions.share ? TASK_ACTION_REWARDS.SHARE : 0) +
    (claimedActions.watch ? TASK_ACTION_REWARDS.WATCH_15S : 0);

  const handleCompleteAndClose = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      completeTask(runnerTask.id, {
        followed: claimedActions.follow,
        liked: claimedActions.like,
        commented: claimedActions.comment,
        shared: claimedActions.share,
        commentText: selectedComment || customComment
      });
      setIsSubmitting(false);
      closeRunner();
    }, 400);
  };

  const handleOpenTikTok = () => {
    window.open(runnerTask.targetUrl, '_blank');
    handleFollowAction();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* SMARTPHONE FRAME CONTAINER (CHÂN THỰC 100% GIAO DIỆN TIKTOK) */}
      <div 
        className="relative w-full max-w-[420px] h-[96vh] max-h-[860px] rounded-[36px] sm:rounded-[42px] bg-black border-2 border-white/20 shadow-[0_0_60px_rgba(255,0,80,0.35)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IPHONE DYNAMIC ISLAND / STATUS BAR NOTCH */}
        <div className="absolute top-0 inset-x-0 z-40 h-7 flex items-center justify-between px-6 pt-1 text-[11px] font-mono text-white/80 select-none pointer-events-none">
          <span className="font-bold">21:30</span>
          <div className="w-20 h-4 rounded-full bg-black/90 border border-white/10 shadow-inner flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse mr-1.5" />
            <span className="text-[8px] font-mono text-rose-400 font-black">FYP LIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* TIKTOK HEADER BAR (TABS: ĐANG FOLLOW | DÀNH CHO BẠN) */}
        <div className="absolute top-7 inset-x-0 z-30 px-4 py-2 flex items-center justify-between select-none bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Left: Lướt Feed */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                closeRunner();
                openFeedRunner();
              }}
              className="px-2 py-0.5 rounded-full bg-black/60 border border-rose-500/40 text-[10px] font-mono text-rose-300 font-bold hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Chuyển sang chế độ lướt feed"
            >
              <Zap className="w-3 h-3 text-yellow-300 fill-current" />
              <span>Lướt Feed</span>
            </button>
          </div>

          {/* Center Tabs: Bạn Bè | Dành Cho Bạn */}
          <div className="flex items-center gap-4 text-xs font-bold font-display">
            <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
              Bạn bè
            </span>
            <span className="text-white relative pb-0.5 cursor-pointer font-black">
              Dành cho bạn
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-white rounded-full" />
            </span>
          </div>

          {/* Right Controls: Âm thanh, Phát/Dừng, Mở App & Đóng */}
          <div className="flex items-center gap-1.5">
            {!isYouTube && (
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát video'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
              </button>
            )}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={handleOpenTikTok}
              className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Mở trên ứng dụng TikTok"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={closeRunner}
              className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* THÔNG BÁO NHIỆM VỤ NHẬN XU ĐANG CHẠY */}
        <div className="absolute top-18 inset-x-3 z-30 px-3 py-1.5 rounded-2xl bg-black/75 border border-rose-500/50 backdrop-blur-md flex items-center justify-between text-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-white font-bold truncate">
            <Flame className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
            <span className="truncate text-[11px] sm:text-xs">{runnerTask.title}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-mono font-black text-[10px] shrink-0 shadow">
            +{runnerTask.rewardCoins.toLocaleString()} Xu
          </span>
        </div>

        {/* THÔNG BÁO BẢO VỆ QUYỀN LỢI KHÁCH HÀNG (ANTI-DUPLICATION) NẾU ĐÃ TỪNG LÀM */}
        {previousCompletion && (
          <div className="absolute top-28 inset-x-3 z-30 px-3 py-2 rounded-2xl bg-amber-950/90 border border-amber-500/60 backdrop-blur-md flex items-center gap-2 shadow-xl animate-in slide-in-from-top-1">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[10px] text-amber-200 leading-tight">
              <strong>Bảo vệ khách hàng:</strong> Bạn đã từng hoàn thành kênh này (+{previousCompletion.totalCoinsEarned.toLocaleString()} Xu). Lượt tương tác lại sẽ không tính thêm Xu.
            </div>
          </div>
        )}

        {/* MAIN VIDEO PLAYER STAGE (MÔ PHỎNG VIDEO TIKTOK THỰC TẾ SIÊU MƯỢT) */}
        <div 
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleStageClick}
        >
          {/* Vignette Gradients for authentic TikTok viewability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none z-[1]" />

          {/* Real Video Player or TikTok Embed or YouTube Embed */}
          {isTikTokEmbed && mediaInfo?.videoId ? (
            <iframe
              key={runnerTask.id + '_tt_' + mediaInfo.videoId}
              src={`https://www.tiktok.com/embed/v2/${mediaInfo.videoId}?lang=vi-VN`}
              title={runnerTask.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
            />
          ) : isYouTube && mediaInfo?.youtubeId ? (
            <iframe
              key={runnerTask.id + '_yt_' + mediaInfo.youtubeId}
              src={`https://www.youtube.com/embed/${mediaInfo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${mediaInfo.youtubeId}&modestbranding=1&rel=0`}
              title={runnerTask.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
            />
          ) : (
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el) {
                  el.defaultMuted = true;
                  el.muted = isMuted;
                  el.playsInline = true;
                  el.play().then(() => setIsPlaying(true)).catch(() => {
                    el.muted = true;
                    el.play().catch(() => {});
                  });
                }
              }}
              src={mediaInfo?.streamUrl || '/videos/sample1.mp4'}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => {
                if (videoRef.current && videoRef.current.src !== '/videos/sample1.mp4') {
                  videoRef.current.src = '/videos/sample1.mp4';
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Floating Hearts Animation when double-tapping */}
          {floatingHearts.map(heart => (
            <div
              key={heart.id}
              style={{ left: heart.x, top: heart.y }}
              className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping text-rose-500"
            >
              <Heart className="w-16 h-16 fill-[#FE2C55] stroke-white stroke-[2] drop-shadow-[0_0_20px_rgba(254,44,85,0.8)]" />
            </div>
          ))}

          {/* Central Play/Pause Bubble Indicator when paused */}
          {!isPlaying && !isYouTube && (
            <div 
              onClick={togglePlay}
              className="relative z-20 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-3xl animate-in zoom-in-50 duration-150 cursor-pointer shadow-2xl border border-white/20"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FE2C55] to-amber-500 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform animate-pulse">
                <Play className="w-8 h-8 fill-current ml-1 text-white" />
              </div>
              <span className="mt-2 text-white font-mono font-bold text-[11px] uppercase tracking-wide">
                ▶ Bấm để phát video
              </span>
            </div>
          )}

          {/* RIGHT FLOATING TIKTOK ACTION COLUMN (100% CHUẨN NÚT TIKTOK) */}
          <div className="absolute right-3.5 bottom-6 z-30 flex flex-col items-center gap-3.5 select-none">
            {/* 1. Creator Avatar & Red Plus (+) Follow Button */}
            <div className="relative group flex flex-col items-center">
              <div 
                onClick={handleFollowAction}
                className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#FE2C55] via-white to-[#25F4EE] shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={runnerTask.channelAvatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* TikTok Iconic Red Plus Button (+) */}
              <button
                onClick={handleFollowAction}
                className={`absolute -bottom-2 w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  claimedActions.follow
                    ? 'bg-emerald-500 text-white ring-2 ring-black scale-90'
                    : 'bg-[#FE2C55] text-white hover:bg-rose-500 hover:scale-110 ring-2 ring-black'
                }`}
                title={claimedActions.follow ? 'Đã Follow (+200 Xu)' : 'Follow Kênh (+200 Xu)'}
              >
                {claimedActions.follow ? (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                ) : (
                  <span className="text-xs font-black leading-none mb-0.5">+</span>
                )}
              </button>
            </div>

            {/* 2. TikTok Like Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerLikeEffect();
              }}
              className="flex flex-col items-center gap-0.5 cursor-pointer group mt-2"
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                claimedActions.like
                  ? 'text-[#FE2C55] scale-110'
                  : 'text-white/90 hover:text-white hover:scale-105'
              }`}>
                <Heart className={`w-7 h-7 drop-shadow-md transition-transform ${claimedActions.like ? 'fill-[#FE2C55] stroke-[#FE2C55] animate-bounce' : 'stroke-white stroke-[2.2]'}`} />
              </div>
              <span className="text-[10.5px] font-bold text-white drop-shadow font-mono">
                {claimedActions.like ? '88.6K' : '88.5K'}
              </span>
              <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                claimedActions.like ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' : 'bg-black/60 text-slate-300'
              }`}>
                {claimedActions.like ? '✓ +100' : '+100 Xu'}
              </span>
            </button>

            {/* 3. TikTok Comment Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentSheet(true);
              }}
              className="flex flex-col items-center gap-0.5 cursor-pointer group"
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                claimedActions.comment
                  ? 'text-[#25F4EE] scale-110'
                  : 'text-white/90 hover:text-white hover:scale-105'
              }`}>
                <MessageCircle className={`w-7 h-7 drop-shadow-md ${claimedActions.comment ? 'fill-[#25F4EE]/20 stroke-[#25F4EE]' : 'stroke-white stroke-[2.2]'}`} />
              </div>
              <span className="text-[10.5px] font-bold text-white drop-shadow font-mono">
                1,420
              </span>
              <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                claimedActions.comment ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-black/60 text-slate-300'
              }`}>
                {claimedActions.comment ? '✓ +200' : '+200 Xu'}
              </span>
            </button>

            {/* 4. TikTok Share Action */}
            <button
              onClick={handleShareAction}
              className="flex flex-col items-center gap-0.5 cursor-pointer group"
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                claimedActions.share
                  ? 'text-[#38bdf8] scale-110'
                  : 'text-white/90 hover:text-white hover:scale-105'
              }`}>
                <Share2 className={`w-7 h-7 drop-shadow-md ${claimedActions.share ? 'stroke-[#38bdf8]' : 'stroke-white stroke-[2.2]'}`} />
              </div>
              <span className="text-[10.5px] font-bold text-white drop-shadow font-mono">
                580
              </span>
              <span className={`text-[8.5px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                claimedActions.share ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' : 'bg-black/60 text-slate-300'
              }`}>
                {claimedActions.share ? '✓ +240' : '+240 Xu'}
              </span>
            </button>

            {/* 5. TikTok Spinning Vinyl Record */}
            <div className="relative flex items-center justify-center mt-1">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 p-1.5 border border-white/20 shadow-xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <div className="w-full h-full rounded-full overflow-hidden border border-white/30">
                  <img src={runnerTask.channelAvatar} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              {isPlaying && (
                <>
                  <span className="absolute -top-3 -left-1 text-[10px] text-white/90 animate-bounce pointer-events-none">🎵</span>
                  <span className="absolute -top-5 right-0 text-[9px] text-rose-300 animate-pulse pointer-events-none">🎶</span>
                </>
              )}
            </div>
          </div>

          {/* LEFT-BOTTOM OVERLAY: CREATOR NAME, CAPTION & MUSIC TICKER */}
          <div className="absolute left-3.5 bottom-4 z-20 max-w-[240px] sm:max-w-[270px] space-y-1.5 text-left pointer-events-none">
            {/* Channel Handle & Verified Badge */}
            <div className="flex items-center gap-1.5 font-display font-black text-white text-sm drop-shadow">
              <span>{runnerTask.channelHandle}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#25F4EE] fill-[#25F4EE]/20" />
            </div>

            {/* Video Caption & Hashtags */}
            <p className="text-xs text-white/90 line-clamp-2 leading-relaxed drop-shadow">
              {runnerTask.title} <strong className="text-rose-400">#fyp #viral #trending #tiktokshop</strong>
            </p>

            {/* Music Ticker Marquee */}
            <div className="flex items-center gap-2 text-[10.5px] font-mono text-white/80 drop-shadow">
              <Music className="w-3 h-3 text-rose-400 animate-spin-slow shrink-0" />
              <div className="overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-marquee">
                  ♫ Âm thanh gốc - {runnerTask.channelName} • Nhạc xu hướng TikTok FYP
                </span>
              </div>
            </div>
          </div>

          {/* COMMENT SHEET DRAWER (CHUẨN TIKTOK BOTTOM SHEET) */}
          {showCommentSheet && (
            <div 
              className="absolute inset-x-0 bottom-0 z-40 p-4 rounded-t-3xl bg-[#12141E]/95 border-t border-white/20 shadow-2xl space-y-3 animate-in slide-in-from-bottom duration-200 backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                  <MessageSquare className="h-4 w-4 text-[#25F4EE]" />
                  <span>Chọn bình luận seeding (+200 Xu)</span>
                </span>
                <button 
                  onClick={() => setShowCommentSheet(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {sampleComments.map((comment, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCommentAction(comment)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${
                      selectedComment === comment
                        ? 'bg-[#25F4EE]/20 border-[#25F4EE] text-[#25F4EE] font-medium'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    "{comment}"
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Gõ bình luận chân thực..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#25F4EE]"
                />
                <button
                  onClick={() => {
                    if (customComment.trim()) {
                      handleCommentAction(customComment);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-[#25F4EE] text-black text-xs font-black hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: 5 Ô VUÔNG HIỂN THỊ CHỨC NĂNG DẠNG LƯỚI & TIẾN TRÌNH XU */}
        <div className="relative z-30 p-3 sm:p-4 bg-[#0B0E17] border-t border-white/10 space-y-3">
          {/* 5 Ô VUÔNG CHỨC NĂNG SIÊU ĐẸP (ASPECT-SQUARE - ĐỒNG BỘ 100%) */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {/* Ô 1: Xem 15s FYP */}
            <div
              className={`aspect-square rounded-2xl p-1.5 sm:p-2 border flex flex-col items-center justify-between transition-all select-none ${
                claimedActions.watch
                  ? 'bg-gradient-to-b from-blue-600/30 to-emerald-600/20 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-white/[0.04] border-white/10'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-slate-400">Xem 15s</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                claimedActions.watch ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/10 text-cyan-400'
              }`}>
                {claimedActions.watch ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <span className={`text-[9px] font-mono font-black ${claimedActions.watch ? 'text-emerald-300' : 'text-slate-300'}`}>
                {claimedActions.watch ? '✓ +200' : `${timeLeft}s`}
              </span>
            </div>

            {/* Ô 2: Follow Kênh */}
            <button
              onClick={handleFollowAction}
              className={`aspect-square rounded-2xl p-1.5 sm:p-2 border flex flex-col items-center justify-between transition-all cursor-pointer group ${
                claimedActions.follow
                  ? 'bg-gradient-to-b from-emerald-600/30 to-teal-600/20 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-slate-400">Follow</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                claimedActions.follow ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/10 text-purple-400'
              }`}>
                {claimedActions.follow ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </div>
              <span className={`text-[9px] font-mono font-black ${claimedActions.follow ? 'text-emerald-300' : 'text-slate-300'}`}>
                {claimedActions.follow ? '✓ +200' : '+200 Xu'}
              </span>
            </button>

            {/* Ô 3: Thả Tim */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerLikeEffect();
              }}
              className={`aspect-square rounded-2xl p-1.5 sm:p-2 border flex flex-col items-center justify-between transition-all cursor-pointer group ${
                claimedActions.like
                  ? 'bg-gradient-to-b from-rose-600/30 to-red-600/20 border-rose-500/60 shadow-lg shadow-rose-950/40'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-slate-400">Thả Tim</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                claimedActions.like ? 'bg-rose-600 text-white shadow-md' : 'bg-white/10 text-rose-400'
              }`}>
                <Heart className={`w-4 h-4 ${claimedActions.like ? 'fill-white' : ''}`} />
              </div>
              <span className={`text-[9px] font-mono font-black ${claimedActions.like ? 'text-rose-300' : 'text-slate-300'}`}>
                {claimedActions.like ? '✓ +100' : '+100 Xu'}
              </span>
            </button>

            {/* Ô 4: Bình Luận */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentSheet(true);
              }}
              className={`aspect-square rounded-2xl p-1.5 sm:p-2 border flex flex-col items-center justify-between transition-all cursor-pointer group ${
                claimedActions.comment
                  ? 'bg-gradient-to-b from-cyan-600/30 to-blue-600/20 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-slate-400">Bình Luận</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                claimedActions.comment ? 'bg-cyan-600 text-white shadow-md' : 'bg-white/10 text-cyan-400'
              }`}>
                {claimedActions.comment ? <CheckCircle2 className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </div>
              <span className={`text-[9px] font-mono font-black ${claimedActions.comment ? 'text-cyan-300' : 'text-slate-300'}`}>
                {claimedActions.comment ? '✓ +200' : '+200 Xu'}
              </span>
            </button>

            {/* Ô 5: Chia Sẻ */}
            <button
              onClick={handleShareAction}
              className={`aspect-square rounded-2xl p-1.5 sm:p-2 border flex flex-col items-center justify-between transition-all cursor-pointer group ${
                claimedActions.share
                  ? 'bg-gradient-to-b from-blue-600/30 to-indigo-600/20 border-blue-500/60 shadow-lg shadow-blue-950/40'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[9px] font-mono font-bold text-slate-400">Chia Sẻ</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                claimedActions.share ? 'bg-blue-600 text-white shadow-md' : 'bg-white/10 text-blue-400'
              }`}>
                {claimedActions.share ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </div>
              <span className={`text-[9px] font-mono font-black ${claimedActions.share ? 'text-blue-300' : 'text-slate-300'}`}>
                {claimedActions.share ? '✓ +240' : '+240 Xu'}
              </span>
            </button>
          </div>

          {/* 15-SECOND NEON TIKTOK TIMER PROGRESS BAR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-rose-400" />
                {timeLeft > 0 ? (
                  <span>Xem giữ chân FYP: <strong className="text-rose-400 font-bold">{timeLeft}s</strong> còn lại</span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Đã đạt 15s xem thật (+200 Xu đã vào ví)!
                  </span>
                )}
              </span>
              <span className="font-black text-neonGold font-mono-numbers">
                Đã thu: +{totalEarnedInSession.toLocaleString()} Xu / Tối đa 940 Xu
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[#FE2C55] via-purple-500 to-[#25F4EE] transition-all duration-1000 shadow-[0_0_12px_rgba(254,44,85,0.6)]"
                style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* FINISH & NEXT TASK BUTTON (CHUẨN NÚT ĐỎ HỒNG TIKTOK) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              onClick={handleCompleteAndClose}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-950/40 bg-gradient-to-r from-[#FE2C55] via-[#FF0050] to-[#E00045] hover:opacity-95 text-white cursor-pointer active:scale-98 font-display"
            >
              {isSubmitting ? (
                <span>Đang lưu tiến trình...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>HOÀN THÀNH & CHUYỂN SANG NHIỆM VỤ TIẾP THEO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
