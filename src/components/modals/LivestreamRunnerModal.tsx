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
  ArrowUpRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TASK_ACTION_REWARDS, LivestreamTaskItem } from '../../types';
import { LIVE_MILESTONE_REWARDS } from '../../data/livePolicyData';
import { parseMediaUrl, getTikTokAvatar } from '../../data/videoSources';
import {
  syncTikTokFollow,
  syncTikTokLike,
  syncTikTokComment,
  syncShareToFacebook
} from '../../services/tiktokActionSync';
import {
  TikTokLiveEmbedPlayer,
  YouTubeLiveEmbedPlayer,
  FacebookLiveEmbedPlayer
} from '../common/players';

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
  const [chatMessages, setChatMessages] = useState<string[]>([]);
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

  const activeLiveRooms = (livestreamTasks || []).filter(t => t.status === 'live' && (t.remainingSlots === undefined || t.remainingSlots > 0));

  const handleNextLiveRoom = () => {
    if (!activeLiveTask || activeLiveRooms.length === 0) return;
    const currentIdx = activeLiveRooms.findIndex(t => t.id === activeLiveTask.id);
    const nextIdx = currentIdx < activeLiveRooms.length - 1 ? currentIdx + 1 : 0;
    handleSwitchRoom(activeLiveRooms[nextIdx]);
  };

  const handlePrevLiveRoom = () => {
    if (!activeLiveTask || activeLiveRooms.length === 0) return;
    const currentIdx = activeLiveRooms.findIndex(t => t.id === activeLiveTask.id);
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : activeLiveRooms.length - 1;
    handleSwitchRoom(activeLiveRooms[prevIdx]);
  };

  // Cảm ứng vuốt chạm (Touch Swipe) chuyển phòng Live trên Mobile & Tablet
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.targetTouches && e.targetTouches.length > 0) {
      touchStartY.current = e.targetTouches[0].clientY;
      touchEndY.current = e.targetTouches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches && e.targetTouches.length > 0) {
      touchEndY.current = e.targetTouches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        handleNextLiveRoom();
      } else {
        handlePrevLiveRoom();
      }
    }
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
      syncTikTokLike(activeLiveTask.id, user.tiktokConnected || user.email || '@user');
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
    const msg = inputMsg.trim();
    setChatMessages(prev => [...prev, `${user.name}: ${msg}`]);
    setInputMsg('');
    setIdleSeconds(0);
    syncTikTokComment(activeLiveTask.id, msg, user.tiktokConnected || user.email || '@user');

    if (!claimedCommentReward) {
      setClaimedCommentReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'comment');
      showToast('💬 Đã gửi bình luận seeding! Nhận ngay +350 Xu thưởng.');
    }
  };


  const handleShareLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    syncShareToFacebook(activeLiveTask.targetUrl, activeLiveTask.channelHandle);

    if (!claimedShareReward) {
      setClaimedShareReward(true);
      interactWithLiveBroadcast(activeLiveTask.id, 'share');
      showToast('🚀 Đã chia sẻ phòng Live về Facebook! Nhận ngay +300 Xu.');
    } else {
      showToast('🚀 Đã mở chia sẻ phòng Live về Facebook!');
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


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-sans select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-h-[780px] sm:max-w-[380px] sm:aspect-[9/16] sm:rounded-3xl bg-[#090C16] border-0 sm:border-2 border-rose-500/40 shadow-2xl overflow-hidden select-none pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Up/Down Live Room Navigation Controls */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevLiveRoom(); }}
            className="p-2.5 rounded-full bg-black/70 hover:bg-white/25 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-90 border border-white/10"
            title="Phòng Live trước (Vuốt xuống)"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNextLiveRoom(); }}
            className="p-2.5 rounded-full bg-black/70 hover:bg-white/25 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-90 border border-white/10"
            title="Phòng Live kế tiếp (Vuốt lên)"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* FULL-BLEED REAL LIVE VIDEO STREAM (CHẠY FULL TOÀN BỘ KHUNG 9:16 NHƯ ẢNH 2) */}
        <div 
          className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col justify-end"
          onClick={handleScreenTap}
        >
          {/* 3 TRÌNH PHÁT LIVE THẬT 100% (TAB CODE RIÊNG BIỆT CHO YOUTUBE, FACEBOOK, TIKTOK) */}
          {isYouTube && mediaInfo?.youtubeId ? (
            <YouTubeLiveEmbedPlayer
              key={activeLiveTask.id + '_yt_live_' + mediaInfo.youtubeId}
              youtubeId={mediaInfo.youtubeId}
              title={activeLiveTask.roomTitle}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          ) : mediaInfo?.isFacebook ? (
            <FacebookLiveEmbedPlayer
              key={activeLiveTask.id + '_fb_live_' + encodeURIComponent(activeLiveTask.targetUrl)}
              url={activeLiveTask.targetUrl}
              title={activeLiveTask.roomTitle}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          ) : (
            <TikTokLiveEmbedPlayer
              key={activeLiveTask.id + '_tt_live_' + activeLiveTask.channelHandle}
              channelHandle={activeLiveTask.channelHandle}
              targetUrl={activeLiveTask.targetUrl}
              channelName={activeLiveTask.roomTitle || activeLiveTask.channelName}
              viewersCount={activeLiveTask.currentViewers || 1420}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              mode="feed"
              hideHud={true}
            />
          )}

          {/* Floating Tap Hearts */}
          {heartsBurst.map(h => (
            <div
              key={h.id}
              className="absolute pointer-events-none animate-bounce"
              style={{
                left: `${h.x}px`,
                bottom: '160px',
                color: h.color,
                transition: 'all 1.2s ease-out',
                transform: 'translateY(-100px) scale(1.4)',
                opacity: 0
              }}
            >
              <Heart className="w-8 h-8 fill-current drop-shadow-lg" />
            </div>
          ))}

          {/* Pinned TikTok Shop Cart Bag Button */}
          <div 
            onClick={(e) => { e.stopPropagation(); setShowShopProduct(!showShopProduct); }}
            className="absolute bottom-36 left-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all font-display"
          >
            <ShoppingBag className="h-4 w-4 text-black" />
            <div className="text-left leading-tight font-bold">
              <div className="text-[7px] uppercase tracking-wider text-black/70 font-mono">TikTok Shop</div>
              <div className="text-[9px] font-extrabold">Deal Ghim 🔥</div>
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
                <img 
                  src={getTikTokAvatar(activeLiveTask.channelHandle, activeLiveTask.channelAvatar)} 
                  alt="" 
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/40 shrink-0" 
                />
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
                    CHỌN PHÒNG LIVE ĐANG PHÁT SÓNG ({activeLiveRooms.length})
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
                {activeLiveRooms.map((t) => {
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
                          <img 
                            src={getTikTokAvatar(t.channelHandle, t.channelAvatar)} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20" 
                          />
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

          {/* ANTI-BOT CAPTCHA POPUP MODAL (Chỉ hiện khi cần xác thực) */}

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
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xl font-bold transition-all active:scale-90 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span>{btn.icon}</span>
                    <span className="text-[9px] text-slate-300 font-mono">{btn.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-[9px] text-slate-400">
                Bảo vệ người mua gói 0% bot • Tặng thêm +200 Xu khi xác thực thành công!
              </p>
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

        {/* UNIFIED SINGLE TOP HEADER OVERLAY: DUY NHẤT 1 THANH, KHÔNG TRÙNG LẶP */}
        <div className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-black/90 via-black/40 to-transparent p-2 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Avatar & Channel Info */}
          <div className="flex items-center gap-1.5 min-w-0 bg-black/75 backdrop-blur-md px-2 py-1 rounded-full border border-white/15 pointer-events-auto">
            <img
              src={getTikTokAvatar(activeLiveTask.channelHandle, activeLiveTask.channelAvatar)}
              alt=""
              onError={(e) => {
                const clean = (activeLiveTask.channelHandle || '').replace(/^@+/, '');
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(clean || 'Live')}&background=E11D48&color=fff&bold=true`;
              }}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-rose-500 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-white text-[10px] truncate max-w-[90px] sm:max-w-[110px]">
                  {activeLiveTask.channelHandle || activeLiveTask.channelName}
                </span>
                <span className="px-1 py-0.2 rounded bg-rose-600 text-white text-[7px] font-black font-mono animate-pulse">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Unified Controls: Bật/Tắt Âm Thanh & Nút Đóng */}
          <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
            {/* Nút Bật/Tắt Âm Thanh */}
            <button
              type="button"
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                showToast(next ? '🔇 Đã tắt tiếng phiên live' : '🔊 Đã bật âm thanh livestream sống động');
              }}
              className={`py-1 px-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5 ${
                isMuted 
                  ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40' 
                  : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/35'
              }`}
              title={isMuted ? 'Bấm để Bật Âm Thanh Live' : 'Bấm để Tắt Tiếng'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />}
              <span className="text-[10px] font-mono font-bold whitespace-nowrap">
                {isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
              </span>
            </button>

            {/* Nút Đóng */}
            <button
              onClick={closeLiveRunner}
              className="p-1 rounded-full bg-black/75 hover:bg-white/20 backdrop-blur-md border border-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Đóng phiên live"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MISSION COMPLETE BANNER OR BOTTOM WATCH PROGRESS & CHAT BAR (OVERLAY TRÊN VIDEO) */}
        <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-auto">
          {isTargetReached ? (
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-purple-950/95 backdrop-blur-md border-t border-emerald-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
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
            <div className="p-2.5 bg-[#0B0E17]/95 backdrop-blur-md border-t border-white/10 space-y-2">
              {/* WATCH PROGRESS BAR AT THE BOTTOM (GỌN GÀNG, ĐẸP MẮT) */}
              <div className="px-1 py-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-rose-400" />
                    <span>Tiến độ: <strong className="text-white">{totalMinutesWatched}/{targetMinutes} phút</strong></span>
                  </span>
                  <span className="text-neonGold font-bold">
                    +{baseRewardPerMinute * quota.multiplier} Xu/phút • Còn {secondsInMinute}s
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, ((totalMinutesWatched * 60 + (60 - secondsInMinute)) / (targetMinutes * 60)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Custom Input Chat Form */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Nhập bình luận gửi vào phiên live..."
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
    </div>
  );
};
