import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  UserPlus, 
  UserCheck, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Flame, 
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  Radio,
  Eye,
  Send,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TASK_ACTION_REWARDS, TikTokTaskItem, LivestreamTaskItem } from '../../types';
import { INITIAL_CROSS_FOLLOW_ITEMS } from '../../data/crossFollowData';

interface UnifiedFeedItem {
  id: string;
  kind: 'video' | 'livestream';
  title: string;
  type: string;
  channelName: string;
  channelHandle: string;
  channelAvatar: string;
  targetUrl: string;
  rewardCoins: number;
  videoUrl?: string;
  sampleComments?: string[];
  guide?: string;
  currentViewers?: number;
  roomTitle?: string;
  targetMinutes?: number;
  campaignCategory?: 'community' | 'partner';
  partnerName?: string;
  partnerBadge?: string;
  totalSlots?: number;
  remainingSlots?: number;
  isUrgent?: boolean;
}

export const TikTokFeedRunnerModal: React.FC = () => {
  const { 
    tasks, 
    livestreamTasks,
    isFeedRunnerOpen, 
    closeFeedRunner, 
    completeTask, 
    user,
    claimTaskAction,
    showToast,
    openShareModal,
    interactWithLiveBroadcast,
    feedRunnerFilter
  } = useTikTokApp();

  const [filterMode, setFilterMode] = useState<'all' | 'cross_follow' | 'community' | 'partner' | 'live'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [sessionCoinsEarned, setSessionCoinsEarned] = useState<number>(0);

  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [customComment, setCustomComment] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Per-task claimed actions tracking (Idempotent 1 time only)
  const [taskClaimedMap, setTaskClaimedMap] = useState<Record<string, {
    follow?: boolean;
    like?: boolean;
    comment?: boolean;
    share?: boolean;
    bookmark?: boolean;
    watch?: boolean;
  }>>({});

  // Build unified feed items combining ALL active campaigns from the website
  const videoFeedItems: UnifiedFeedItem[] = tasks.map(t => ({
    id: t.id,
    kind: 'video',
    title: t.title,
    type: t.type,
    channelName: t.channelName,
    channelHandle: t.channelHandle,
    channelAvatar: t.channelAvatar,
    targetUrl: t.targetUrl,
    rewardCoins: t.rewardCoins || 200,
    videoUrl: t.videoPreviewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    sampleComments: t.sampleComments,
    guide: t.guide,
    campaignCategory: t.campaignCategory || 'community',
    partnerName: t.partnerName,
    partnerBadge: t.partnerBadge,
    totalSlots: t.totalSlots,
    remainingSlots: t.remainingSlots,
    isUrgent: t.isUrgent
  }));

  // Feed items từ kho Follow Chéo Cộng Đồng Creator
  const crossFollowFeedItems: UnifiedFeedItem[] = INITIAL_CROSS_FOLLOW_ITEMS.map((cf, idx) => ({
    id: cf.id,
    kind: 'video',
    title: cf.title,
    type: cf.type,
    channelName: cf.channelName,
    channelHandle: cf.channelHandle,
    channelAvatar: cf.channelAvatar,
    targetUrl: cf.targetUrl,
    rewardCoins: cf.rewardXu || 200,
    videoUrl: idx % 2 === 0 
      ? 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4' 
      : 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-42475-large.mp4',
    sampleComments: [
      'Đã follow chéo ủng hộ kênh bạn nhé!',
      'Nội dung hay quá, chúc kênh sớm triệu follow!',
      'Tương tác chéo uy tín nha bạn ơi!'
    ],
    guide: `Follow kênh & tương tác chéo với ${cf.channelHandle} để cùng nhận Xu thưởng.`,
    campaignCategory: 'community',
    partnerName: 'Follow Chéo Tự Do',
    partnerBadge: 'Cộng Đồng Chéo',
    totalSlots: cf.followersCount || 10000,
    remainingSlots: Math.max(10, (cf.followersCount || 10000) - (cf.completedByUsersCount || 0))
  }));

  const liveFeedItems: UnifiedFeedItem[] = livestreamTasks.map(l => ({
    id: l.id,
    kind: 'livestream',
    title: l.roomTitle || `Phiên Live Bán Hàng: ${l.channelName}`,
    type: 'livestream',
    channelName: l.channelName,
    channelHandle: l.channelHandle,
    channelAvatar: l.channelAvatar,
    targetUrl: l.targetUrl,
    rewardCoins: l.totalRewardCoins || 400,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42318-large.mp4',
    guide: `Xem trực tiếp phiên live đủ ${l.targetMinutes || 3} phút để xác thực mắt xem.`,
    currentViewers: l.currentViewers || 580,
    roomTitle: l.roomTitle,
    targetMinutes: l.targetMinutes || 3,
    campaignCategory: 'partner',
    partnerName: l.channelName,
    partnerBadge: 'Phòng Live Đối Tác',
    totalSlots: 1000,
    remainingSlots: 350
  }));

  const combinedFeed: UnifiedFeedItem[] = 
    filterMode === 'cross_follow' ? crossFollowFeedItems :
    filterMode === 'community' ? videoFeedItems.filter(i => i.campaignCategory === 'community') :
    filterMode === 'partner' ? videoFeedItems.filter(i => i.campaignCategory === 'partner') :
    filterMode === 'live' ? liveFeedItems :
    [...crossFollowFeedItems, ...videoFeedItems, ...liveFeedItems];

  const currentItem = combinedFeed[currentIndex] || combinedFeed[0];
  const currentClaimed = currentItem ? (taskClaimedMap[currentItem.id] || {}) : {};

  // Sync filterMode when feed runner opens with a specific filter
  useEffect(() => {
    if (isFeedRunnerOpen && feedRunnerFilter) {
      setFilterMode(feedRunnerFilter);
      setCurrentIndex(0);
    }
  }, [isFeedRunnerOpen, feedRunnerFilter]);

  // Reset timer on item change or open
  useEffect(() => {
    if (isFeedRunnerOpen && currentItem) {
      setTimeLeft(currentItem.kind === 'video' ? 15 : (currentItem.targetMinutes ? currentItem.targetMinutes * 60 : 180));
      setIsPlaying(true);
      setShowCommentInput(false);
      setCustomComment('');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isFeedRunnerOpen, currentIndex, filterMode]);

  // Main timer countdown
  useEffect(() => {
    if (!isFeedRunnerOpen || timeLeft <= 0 || !isPlaying) return;
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
  }, [isFeedRunnerOpen, timeLeft, isPlaying]);

  // When timer reaches 0 for video, claim watch reward (+200 Xu) and optionally auto-advance
  useEffect(() => {
    if (timeLeft === 0 && currentItem && currentItem.kind === 'video' && !currentClaimed.watch) {
      const reward = claimTaskAction(currentItem.id, 'watch');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: {
          ...(prev[currentItem.id] || {}),
          watch: true
        }
      }));

      // Auto advance to next video if enabled
      if (autoAdvance) {
        showToast('✓ Đã nhận +200 Xu! Tự động chuyển video tiếp theo sau 2 giây...');
        const autoTimer = setTimeout(() => {
          handleNextItem();
        }, 2200);
        return () => clearTimeout(autoTimer);
      }
    }
  }, [timeLeft, currentItem, currentClaimed.watch, autoAdvance, claimTaskAction]);

  // Keyboard navigation (ArrowDown / ArrowUp)
  useEffect(() => {
    if (!isFeedRunnerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevItem();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedRunnerOpen, currentIndex, combinedFeed.length]);

  if (!isFeedRunnerOpen || !currentItem) return null;

  const handleNextItem = () => {
    if (currentIndex < combinedFeed.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
      showToast('🔄 Đã lướt hết danh sách, quay lại chiến dịch đầu tiên!');
    }
  };

  const handlePrevItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(combinedFeed.length - 1);
    }
  };

  const handleOpenTikTokApp = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentItem.targetUrl) return;
    window.open(currentItem.targetUrl, '_blank');
    showToast(`🔗 Đang mở ${currentItem.channelHandle} trực tiếp trên ứng dụng TikTok!`);
  };

  const handleFollowAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentClaimed.follow) {
      const reward = claimTaskAction(currentItem.id, 'follow');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), follow: true }
      }));
    }
  };

  const handleLikeAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentClaimed.like) {
      const reward = claimTaskAction(currentItem.id, 'like');
      setSessionCoinsEarned(prev => prev + (reward || 100));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), like: true }
      }));
    }
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    handleLikeAction();
    setFloatingHearts(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => Date.now() - h.id < 1200));
    }, 1200);
  };

  const handleCommentAction = (commentText: string) => {
    setCustomComment(commentText);
    if (!currentClaimed.comment) {
      const reward = claimTaskAction(currentItem.id, 'comment');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), comment: true }
      }));
    }
    setShowCommentInput(false);
  };

  const handleShareAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentClaimed.share) {
      const reward = claimTaskAction(currentItem.id, 'share');
      setSessionCoinsEarned(prev => prev + (reward || 240));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), share: true }
      }));
    }
    openShareModal({
      targetUrl: currentItem.targetUrl,
      title: currentItem.title
    });
  };

  const handleBookmarkAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentClaimed.bookmark) {
      claimTaskAction(currentItem.id, 'bookmark');
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), bookmark: true }
      }));
    }
  };

  const sampleComments = currentItem.sampleComments || [
    'Nội dung chia sẻ cuốn thực sự, mong bạn ra thêm nhiều clip nữa nhé ❤️',
    'Đã theo dõi kênh và ủng hộ, chúc bạn sớm đạt 100k follow!',
    'Sản phẩm này dùng êm ru luôn ạ, cho mình xin link bio với shop ơi!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none">
      {/* Phone Simulation Container */}
      <div 
        className="relative w-full max-w-md h-full sm:h-[94vh] sm:max-h-[860px] sm:rounded-3xl bg-black border-0 sm:border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Floating Controls */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/90 via-black/60 to-transparent space-y-2">
          {/* Top Row: Feed Switcher & Close */}
          <div className="flex items-center justify-between">
            {/* Filter mode tabs */}
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full backdrop-blur-md text-[10px] font-mono overflow-x-auto max-w-[80%]">
              <button
                onClick={() => { setFilterMode('cross_follow'); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'cross_follow' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🔄 Follow Chéo ({crossFollowFeedItems.length})
              </button>
              <button
                onClick={() => { setFilterMode('community'); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'community' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🌐 Kênh Cộng Đồng ({videoFeedItems.filter(i => i.campaignCategory === 'community').length})
              </button>
              <button
                onClick={() => { setFilterMode('partner'); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'partner' ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                💎 Chiến Dịch Đối Tác ({videoFeedItems.filter(i => i.campaignCategory === 'partner').length})
              </button>
              <button
                onClick={() => { setFilterMode('live'); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'live' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                🔴 Live Stream ({livestreamTasks.length})
              </button>
              <button
                onClick={() => { setFilterMode('all'); setCurrentIndex(0); }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'all' ? 'bg-rose-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Tất Cả ({crossFollowFeedItems.length + tasks.length + livestreamTasks.length})
              </button>
            </div>

            {/* Right Buttons: Mute Toggle & Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
              </button>
              <button
                onClick={closeFeedRunner}
                className="p-1.5 rounded-full bg-black/60 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sub-Header: Realtime Campaign Info & Direct TikTok Link */}
          <div className="flex items-center justify-between text-xs backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 gap-2">
            <div className="flex items-center gap-2 truncate">
              {currentItem.campaignCategory === 'partner' ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black border border-amber-500/40 shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-400" /> ĐỐI TÁC (CÒN {currentItem.remainingSlots?.toLocaleString() || '580'} SUẤT)
                </span>
              ) : currentItem.kind === 'livestream' ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[10px] font-black animate-pulse shrink-0">
                  <Radio className="w-3 h-3" /> LIVE
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-black shrink-0">
                  <Play className="w-3 h-3 fill-white" /> CỘNG ĐỒNG
                </span>
              )}
              <span className="text-white font-bold truncate text-[11px]">
                {currentItem.channelHandle}
              </span>
              <span className="text-slate-400 text-[10px] font-mono shrink-0">
                ({currentIndex + 1}/{combinedFeed.length})
              </span>
            </div>

            {/* 1-Tap Open Directly on TikTok */}
            <button
              onClick={handleOpenTikTokApp}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 border border-white/20"
              title="Mở kênh hoặc video này trên ứng dụng TikTok thật"
            >
              <span>Mở TikTok</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Video / Live Stream Stage */}
        <div 
          className="relative flex-1 bg-black flex items-center justify-center select-none overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {/* HTML5 Video Player */}
          {currentItem.videoUrl && (
            <video
              ref={videoRef}
              src={currentItem.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

          {/* Floating Hearts from double taps */}
          {floatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute pointer-events-none z-40 text-rose-500 animate-out fade-out zoom-out duration-1000 -translate-x-1/2 -translate-y-1/2"
              style={{ left: heart.x, top: heart.y }}
            >
              <Heart className="h-16 w-16 fill-rose-500 drop-shadow-lg" />
            </div>
          ))}

          {/* Play/Pause Center Indicator */}
          {!isPlaying && (
            <div className="absolute z-30 p-4 rounded-full bg-black/60 text-white backdrop-blur-md animate-in zoom-in-50 duration-150 pointer-events-none">
              <Play className="h-10 w-10 fill-white" />
            </div>
          )}

          {/* Bottom-Left: Fanpage & Campaign Info (Exact TikTok Format) */}
          <div className="absolute left-3 bottom-14 z-30 space-y-2 max-w-[75%] pointer-events-auto">
            {/* Fanpage / Channel Header */}
            <div className="flex items-center gap-2">
              <img 
                src={currentItem.channelAvatar} 
                alt="" 
                className="w-9 h-9 rounded-full object-cover border border-white/30"
              />
              <div>
                <div className="flex items-center gap-1 text-white font-bold text-xs">
                  <span>{currentItem.channelName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/20" />
                </div>
                <div className="text-[10px] font-mono text-rose-300 font-bold">
                  {currentItem.channelHandle}
                </div>
              </div>

              {!currentClaimed.follow && (
                <button
                  onClick={handleFollowAction}
                  className="ml-1 px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer"
                >
                  + Follow
                </button>
              )}
            </div>

            {/* Category Distinction Badge */}
            <div>
              {currentItem.campaignCategory === 'partner' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/30 to-rose-500/30 border border-amber-500/50 backdrop-blur-md text-[10px] font-mono text-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  <span className="font-bold">Chiến Dịch Đối Tác:</span>
                  <span>{currentItem.partnerName || currentItem.channelName}</span>
                  <span className="text-amber-400 font-bold">• Còn {currentItem.remainingSlots?.toLocaleString() || '580'} suất</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-[10px] font-mono text-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold">Kênh Cộng Đồng:</span>
                  <span>Xem tự do • Cứ xem là có Xu (+200 Xu)</span>
                </div>
              )}
            </div>

            {/* Campaign Caption */}
            <div className="text-white text-xs font-medium leading-snug line-clamp-2">
              {currentItem.title}
            </div>

            {/* Guide & Music Tag */}
            <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
              <div className="flex items-center gap-1 truncate bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Music className="h-3 w-3 text-rose-400 animate-spin-slow shrink-0" />
                <span className="truncate">Nhạc xu hướng FYP • {currentItem.channelName}</span>
              </div>
            </div>
          </div>

          {/* Right Action Bar (TikTok Style) */}
          <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center gap-3 pointer-events-auto">
            {/* Follow Button */}
            <button
              onClick={handleFollowAction}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                currentClaimed.follow ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/30' : 'bg-black/60 text-white hover:bg-rose-600/80'
              }`}>
                {currentClaimed.follow ? <UserCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                currentClaimed.follow ? 'bg-emerald-500/20 text-emerald-300' : 'bg-black/60 text-white'
              }`}>
                {currentClaimed.follow ? '✓ +200' : '+200'}
              </span>
            </button>

            {/* Like Button */}
            <button
              onClick={handleLikeAction}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                currentClaimed.like ? 'bg-rose-500 text-white ring-4 ring-rose-500/30' : 'bg-black/60 text-white hover:bg-white/20'
              }`}>
                <Heart className={`h-5 w-5 ${currentClaimed.like ? 'fill-white' : ''}`} />
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                currentClaimed.like ? 'bg-rose-500/20 text-rose-300' : 'bg-black/60 text-white'
              }`}>
                {currentClaimed.like ? '✓ +100' : '+100'}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentInput(!showCommentInput);
              }}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                currentClaimed.comment ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30' : 'bg-black/60 text-white hover:bg-white/20'
              }`}>
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                currentClaimed.comment ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/60 text-white'
              }`}>
                {currentClaimed.comment ? '✓ +200' : '+200'}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareAction}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                currentClaimed.share ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' : 'bg-black/60 text-white hover:bg-white/20'
              }`}>
                <Share2 className="h-5 w-5" />
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                currentClaimed.share ? 'bg-amber-500/20 text-amber-300' : 'bg-black/60 text-white'
              }`}>
                {currentClaimed.share ? '✓ +240' : '+240'}
              </span>
            </button>

            {/* Bookmark (0 Xu) */}
            <button
              onClick={handleBookmarkAction}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className={`p-2.5 rounded-full transition-all shadow-lg ${
                currentClaimed.bookmark ? 'bg-purple-500 text-white ring-4 ring-purple-500/30' : 'bg-black/60 text-white hover:bg-white/20'
              }`}>
                <Bookmark className={`h-5 w-5 ${currentClaimed.bookmark ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-black/60 text-slate-300">
                {currentClaimed.bookmark ? 'Đã lưu' : '0 Xu'}
              </span>
            </button>
          </div>

          {/* Up / Down Navigation Controls (Lướt Lướt Liên Tục) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevItem(); }}
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/25 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-90"
              title="Chiến dịch trước (Mũi tên lên)"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNextItem(); }}
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/25 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-90"
              title="Chiến dịch kế tiếp (Mũi tên xuống)"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Comment Drawer */}
          {showCommentInput && (
            <div 
              className="absolute inset-x-0 bottom-0 z-40 p-4 rounded-t-3xl bg-[#0E1322] border-t border-white/20 space-y-2 animate-in slide-in-from-bottom duration-200 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white font-display">
                <span>Chọn nhanh bình luận seeding (+200 Xu):</span>
                <button onClick={() => setShowCommentInput(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {sampleComments.map((cmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCommentAction(cmt)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    "{cmt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar & Claim Button */}
        <div className="p-3 bg-[#0B0E17] border-t border-white/10 space-y-2">
          {/* Progress Timer Row */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-rose-500" />
              {timeLeft > 0 ? (
                <span>Đang xem: <strong className="text-rose-400 font-bold">{timeLeft}s</strong> còn lại</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đã đạt 15s (+200 Xu vào ví)!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoAdvance} 
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded accent-rose-500 w-3 h-3"
                />
                <span>Tự lướt tiếp</span>
              </label>

              <span className="text-neonGold font-bold text-[11px]">
                Phiên này: +{sessionCoinsEarned.toLocaleString()} Xu
              </span>
            </div>
          </div>

          {/* Progress line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
            />
          </div>

          {/* Big Next Button */}
          <button
            onClick={handleNextItem}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl bg-gradient-to-r from-rose-600 via-purple-600 to-emerald-500 hover:opacity-95 text-white cursor-pointer active:scale-98 font-display"
          >
            <Sparkles className="h-4 w-4 text-neonGold" />
            <span>LƯỚT SANG CHIẾN DỊCH TIẾP THEO (HOẶC BẤM PHÍM MŨI TÊN XUỐNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

