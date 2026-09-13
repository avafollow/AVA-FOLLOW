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
import { parseMediaUrl } from '../../data/videoSources';

interface UnifiedFeedItem {
  id: string;
  kind: 'video' | 'livestream';
  title: string;
  type: string;
  requiresWatch?: boolean;
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
    campaigns,
    isFeedRunnerOpen, 
    closeFeedRunner, 
    completeTask, 
    user,
    claimTaskAction,
    showToast,
    openShareModal,
    interactWithLiveBroadcast,
    feedRunnerFilter,
    feedRunnerTargetId
  } = useTikTokApp();

  const [filterMode, setFilterMode] = useState<'all' | 'cross_follow' | 'community' | 'partner' | 'live'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false); // GIỮ NGUYÊN VIDEO PHÁT HẾT ĐỘ DÀI, KHÔNG TỰ Ý CHUYỂN
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

  // 1. Toàn bộ Chiến Dịch Thật Tạo Mới & Đang Chạy (Đồng bộ chuỗi video ưu tiên hàng đầu)
  const createdCampaignFeedItems: UnifiedFeedItem[] = campaigns.map((c) => ({
    id: c.id,
    kind: (c.type === 'livestream' || c.type === 'livestream_viewers') ? 'livestream' : 'video',
    title: c.title,
    type: c.type,
    requiresWatch: c.type === 'watch' || c.type === 'livestream',
    channelName: c.channelHandle,
    channelHandle: c.channelHandle,
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    targetUrl: c.targetUrl,
    rewardCoins: 200,
    videoUrl: parseMediaUrl(c.targetUrl, c.channelHandle).streamUrl,
    sampleComments: [
      'Chiến dịch chất lượng quá!',
      'Ủng hộ kênh bạn nhé ❤️',
      'Đã tương tác đầy đủ cho kênh!'
    ],
    guide: c.instructions || 'Tương tác thật 100% để nhận Xu thưởng vào ví.',
    campaignCategory: 'partner',
    partnerName: 'Chiến Dịch Đang Chạy',
    partnerBadge: 'Chiến Dịch Thật',
    totalSlots: c.targetQuantity,
    remainingSlots: Math.max(1, c.targetQuantity - c.completedQuantity),
    isUrgent: true
  }));

  // 2. Build unified feed items combining ALL active campaigns from the website
  const videoFeedItems: UnifiedFeedItem[] = tasks.map(t => ({
    id: t.id,
    kind: 'video',
    title: t.title,
    type: t.type,
    requiresWatch: t.type === 'watch' || (t as any).requiresWatch === true,
    channelName: t.channelName,
    channelHandle: t.channelHandle,
    channelAvatar: t.channelAvatar,
    targetUrl: t.targetUrl,
    rewardCoins: t.rewardCoins || 200,
    videoUrl: t.videoPreviewUrl || parseMediaUrl(t.targetUrl, t.channelHandle).streamUrl,
    sampleComments: t.sampleComments,
    guide: t.guide,
    campaignCategory: t.campaignCategory || 'community',
    partnerName: t.partnerName,
    partnerBadge: t.partnerBadge,
    totalSlots: t.totalSlots,
    remainingSlots: t.remainingSlots,
    isUrgent: t.isUrgent
  }));

  // 3. Feed items từ kho Follow Chéo Cộng Đồng Creator (Không khống chế 15s)
  const crossFollowFeedItems: UnifiedFeedItem[] = INITIAL_CROSS_FOLLOW_ITEMS.map((cf) => ({
    id: cf.id,
    kind: 'video',
    title: cf.title,
    type: cf.type,
    requiresWatch: false,
    channelName: cf.channelName,
    channelHandle: cf.channelHandle,
    channelAvatar: cf.channelAvatar,
    targetUrl: cf.targetUrl,
    rewardCoins: cf.rewardXu || 200,
    videoUrl: parseMediaUrl(cf.targetUrl, cf.channelHandle).streamUrl,
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

  // 4. Feed items từ kho Livestream Mắt Xem Thật
  const liveFeedItems: UnifiedFeedItem[] = livestreamTasks.map(l => ({
    id: l.id,
    kind: 'livestream',
    title: l.roomTitle || `Phiên Live Bán Hàng: ${l.channelName}`,
    type: 'livestream',
    requiresWatch: true,
    channelName: l.channelName,
    channelHandle: l.channelHandle,
    channelAvatar: l.channelAvatar,
    targetUrl: l.targetUrl,
    rewardCoins: l.totalRewardCoins || 400,
    videoUrl: parseMediaUrl(l.targetUrl, l.channelHandle).streamUrl,
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

  // CHUỖI TOÀN BỘ VIDEO & CHIẾN DỊCH HỆ THỐNG LIÊN KẾT ĐỒNG BỘ
  const combinedFeed: UnifiedFeedItem[] = 
    filterMode === 'cross_follow' ? crossFollowFeedItems :
    filterMode === 'community' ? videoFeedItems.filter(i => i.campaignCategory === 'community') :
    filterMode === 'partner' ? [...createdCampaignFeedItems, ...videoFeedItems.filter(i => i.campaignCategory === 'partner')] :
    filterMode === 'live' ? [...createdCampaignFeedItems.filter(i => i.kind === 'livestream'), ...liveFeedItems] :
    [...createdCampaignFeedItems, ...videoFeedItems, ...crossFollowFeedItems, ...liveFeedItems];

  const currentItem = combinedFeed[currentIndex] || combinedFeed[0];
  const currentClaimed = currentItem ? (taskClaimedMap[currentItem.id] || {}) : {};

  // Kiểm tra xem chiến dịch hiện tại có bắt buộc xem video / live không
  const isWatchRequired = currentItem 
    ? (currentItem.kind === 'livestream' || currentItem.type === 'watch' || currentItem.requiresWatch === true)
    : false;

  // Sync filterMode when feed runner opens with a specific filter
  useEffect(() => {
    if (isFeedRunnerOpen && feedRunnerFilter) {
      setFilterMode(feedRunnerFilter);
    }
  }, [isFeedRunnerOpen, feedRunnerFilter]);

  // Sync with specific campaign ID if opened directly from campaign card
  useEffect(() => {
    if (isFeedRunnerOpen && feedRunnerTargetId) {
      const idx = combinedFeed.findIndex(item => 
        item.id === feedRunnerTargetId || 
        item.targetUrl === feedRunnerTargetId || 
        item.channelHandle === feedRunnerTargetId
      );
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [isFeedRunnerOpen, feedRunnerTargetId, combinedFeed.length]);

  // Reset timer on item change or open
  useEffect(() => {
    if (isFeedRunnerOpen && currentItem) {
      if (currentItem.kind === 'livestream') {
        setTimeLeft(currentItem.targetMinutes ? currentItem.targetMinutes * 60 : 180);
      } else if (currentItem.type === 'watch' || currentItem.requiresWatch === true) {
        setTimeLeft(15);
      } else {
        setTimeLeft(0);
      }
      setIsPlaying(true);
      setShowCommentInput(false);
      setCustomComment('');
      if (videoRef.current) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = isMuted;
        videoRef.current.playsInline = true;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isFeedRunnerOpen, currentIndex, filterMode, isMuted]);

  // Main timer countdown (chỉ đếm ngược khi có gói xem video / livestream)
  useEffect(() => {
    if (!isFeedRunnerOpen || !isWatchRequired || timeLeft <= 0 || !isPlaying) return;
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
  }, [isFeedRunnerOpen, isWatchRequired, timeLeft, isPlaying]);

  // When timer reaches 0 for video watch package, claim watch reward (+200 Xu) - KHÔNG TỰ Ý CHUYỂN VIDEO
  useEffect(() => {
    if (isWatchRequired && timeLeft === 0 && currentItem && currentItem.kind === 'video' && !currentClaimed.watch) {
      const reward = claimTaskAction(currentItem.id, 'watch');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: {
          ...(prev[currentItem.id] || {}),
          watch: true
        }
      }));

      // Báo nhận Xu thành công nhưng GIỮ NGUYÊN VIDEO PHÁT TRỌN VẸN
      showToast('🎉 Đã xem đủ 15s (+200 Xu vào ví)! Bạn có thể tiếp tục xem trọn vẹn video hoặc bấm nút để chuyển tiếp.');
    }
  }, [timeLeft, isWatchRequired, currentItem, currentClaimed.watch, claimTaskAction]);

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
          {/* YouTube Video or Live Player */}
          {(() => {
            const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
            if (itemMedia.isYouTube && itemMedia.youtubeId) {
              return (
                <iframe
                  key={currentItem.id + '_yt_' + itemMedia.youtubeId + '_' + isMuted}
                  src={`https://www.youtube.com/embed/${itemMedia.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&controls=1&loop=1&playlist=${itemMedia.youtubeId}&modestbranding=1&rel=0`}
                  title={currentItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
                />
              );
            }
            if (itemMedia.isFacebook && currentItem.targetUrl) {
              return (
                <iframe
                  key={currentItem.id + '_fb_' + encodeURIComponent(currentItem.targetUrl) + '_' + isMuted}
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentItem.targetUrl)}&show_text=0&autoplay=1&muted=${isMuted ? 1 : 0}&allowfullscreen=true`}
                  title={currentItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0 bg-black pointer-events-auto"
                />
              );
            }
            if (currentItem.videoUrl) {
              return (
                <video
                  key={currentItem.id + '_' + (currentItem.videoUrl || currentItem.targetUrl)}
                  ref={videoRef}
                  src={currentItem.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  muted={isMuted}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              );
            }
            return null;
          })()}

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />

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

          {/* Bottom-Left: Clean TikTok v2 Creator & Caption Info */}
          <div className="absolute left-3 bottom-14 z-30 space-y-2 max-w-[72%] pointer-events-auto text-left">
            {/* Creator Handle + Verified Badge */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-white font-black text-sm drop-shadow-md tracking-wide">
                {currentItem.channelHandle}
              </span>
              <CheckCircle2 className="h-4 w-4 text-[#20D5EC] fill-[#20D5EC]/20 shrink-0" />
              {currentItem.campaignCategory === 'partner' ? (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-[9px] font-bold text-amber-300 backdrop-blur-sm">
                  Đối tác VIP
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[9px] font-bold text-cyan-300 backdrop-blur-sm">
                  Chiến dịch thật
                </span>
              )}
            </div>

            {/* Campaign Caption */}
            <p className="text-white text-xs font-medium leading-relaxed drop-shadow-md line-clamp-2">
              {currentItem.title}
            </p>

            {/* Music Sound Tag */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
              <Music className="h-3.5 w-3.5 text-[#FE2C55] animate-spin-slow shrink-0" />
              <span className="truncate drop-shadow-md">
                Âm thanh gốc - {currentItem.channelName} • Nhạc xu hướng TikTok
              </span>
            </div>
          </div>

          {/* Right Action Bar (Authentic TikTok v2 Layout) */}
          <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center gap-4 pointer-events-auto">
            {/* Creator Avatar with Follow Plus Badge */}
            <div className="relative mb-1">
              <img 
                src={currentItem.channelAvatar} 
                alt="" 
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowAction();
                }}
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
                  currentClaimed.follow 
                    ? 'bg-emerald-500 ring-2 ring-emerald-400/50 scale-100' 
                    : 'bg-[#FE2C55] hover:scale-110 active:scale-90'
                }`}
                title={currentClaimed.follow ? 'Đã Follow' : 'Follow nhận Xu'}
              >
                {currentClaimed.follow ? <Check className="w-3 h-3 stroke-[3]" /> : <UserPlus className="w-3 h-3 stroke-[2.5]" />}
              </button>
            </div>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeAction();
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className={`p-2 rounded-full transition-transform duration-200 active:scale-125 ${
                currentClaimed.like ? 'text-[#FE2C55]' : 'text-white/90 hover:text-white'
              }`}>
                <Heart className={`h-7 w-7 drop-shadow-lg ${currentClaimed.like ? 'fill-[#FE2C55]' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {currentClaimed.like ? '128.5K' : '128.4K'}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentInput(!showCommentInput);
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-125">
                <MessageCircle className={`h-7 w-7 drop-shadow-lg ${currentClaimed.comment ? 'fill-cyan-400 text-cyan-400' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {currentClaimed.comment ? '3.2K' : '3.1K'}
              </span>
            </button>

            {/* Bookmark / Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkAction();
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-125">
                <Bookmark className={`h-7 w-7 drop-shadow-lg ${currentClaimed.bookmark ? 'fill-amber-400 text-amber-400' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {currentClaimed.bookmark ? '1.2K' : '1.1K'}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShareAction();
              }}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-125">
                <Share2 className="h-7 w-7 drop-shadow-lg" />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {currentClaimed.share ? '856' : '855'}
              </span>
            </button>

            {/* Spinning Music Vinyl Disc */}
            <div className="mt-1 w-9 h-9 rounded-full bg-slate-900/90 border-2 border-slate-700/80 p-1 flex items-center justify-center shadow-2xl animate-spin-slow">
              <img 
                src={currentItem.channelAvatar} 
                alt="" 
                className="w-5 h-5 rounded-full object-cover"
              />
            </div>
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
              {isWatchRequired ? (
                timeLeft > 0 ? (
                  <span>Đang xem: <strong className="text-rose-400 font-bold">{timeLeft}s</strong> còn lại</span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Đã đạt 15s (+200 Xu vào ví)!
                  </span>
                )
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-neonGold" /> Không khống chế 15s • Tự do follow &amp; lướt tiếp ngay!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isWatchRequired && (
                <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoAdvance} 
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="rounded accent-rose-500 w-3 h-3"
                  />
                  <span>Tự lướt tiếp</span>
                </label>
              )}

              <span className="text-neonGold font-bold text-[11px]">
                Phiên này: +{sessionCoinsEarned.toLocaleString()} Xu
              </span>
            </div>
          </div>

          {/* Progress line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-1000"
              style={{ width: isWatchRequired ? `${((15 - timeLeft) / 15) * 100}%` : '100%' }}
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

