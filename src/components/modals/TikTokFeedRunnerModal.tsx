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
  Plus,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { TASK_ACTION_REWARDS, TikTokTaskItem, LivestreamTaskItem } from '../../types';
import { INITIAL_CROSS_FOLLOW_ITEMS } from '../../data/crossFollowData';
import { parseMediaUrl, getTikTokAvatar } from '../../data/videoSources';
import {
  TikTokVideoEmbedPlayer,
  TikTokLiveEmbedPlayer,
  TikTokLiveStudioPlayer,
  YouTubeEmbedPlayer,
  YouTubeLiveEmbedPlayer,
  FacebookEmbedPlayer,
  FacebookLiveEmbedPlayer,
  DirectVideoPlayer
} from '../common/players';
import {
  syncTikTokFollow,
  syncTikTokLike,
  syncTikTokComment,
  syncShareToFacebook
} from '../../services/tiktokActionSync';

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
  isBoosted?: boolean;
}

export const TikTokFeedRunnerModal: React.FC = () => {
  const { 
    tasks, 
    livestreamTasks,
    campaigns,
    isFeedRunnerOpen, 
    closeFeedRunner, 
    completeTask, 
    deleteCampaign,
    user,
    connectTikTok,
    claimTaskAction,
    showToast,
    openShareModal,
    interactWithLiveBroadcast,
    feedRunnerFilter,
    feedRunnerTargetId,
    userMissions
  } = useTikTokApp();

  const [filterMode, setFilterMode] = useState<'all' | 'missions' | 'cross_follow' | 'community' | 'partner' | 'live'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false); // Luôn phát video kèm âm thanh ngay lập tức
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false); // GIỮ NGUYÊN VIDEO PHÁT HẾT ĐỘ DÀI, KHÔNG TỰ Ý CHUYỂN
  const [sessionCoinsEarned, setSessionCoinsEarned] = useState<number>(0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [customComment, setCustomComment] = useState<string>('');
  const [playerMode, setPlayerMode] = useState<'stream' | 'embed'>('embed'); // Tự động phát TikTok embed khi có ID, hoặc stream HD

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Kiểm tra hoàn thành nhiệm vụ ngày (Bắt buộc xong nhiệm vụ ngày mới mở Live & Follow chéo)
  const dailyMissions = userMissions?.filter(m => m.category === 'daily') || [];
  const isDailyMissionsCompleted = dailyMissions.length === 0 || dailyMissions.every(m => m.status === 'claimed' || m.completedCount >= m.targetCount);

  // Per-task claimed actions tracking (Idempotent 1 time only)
  const [taskClaimedMap, setTaskClaimedMap] = useState<Record<string, {
    follow?: boolean;
    like?: boolean;
    comment?: boolean;
    share?: boolean;
    bookmark?: boolean;
    watch?: boolean;
  }>>({});

  // 1. Toàn bộ Chiến Dịch Thật Tạo Mới & Đang Chạy (Tự động ẩn khi hoàn thành đủ số lượng đã mua)
  const activeCampaigns = (campaigns || []).filter(c => c.status !== 'completed' && (c.completedQuantity || 0) < (c.targetQuantity || 100));
  const createdCampaignFeedItems: UnifiedFeedItem[] = activeCampaigns.map((c) => {
    const isLiveUrl = (c.targetUrl || '').toLowerCase().includes('/live');
    const isLiveType = c.type === 'livestream' || c.type === 'livestream_viewers';
    return {
      id: c.id,
      kind: (isLiveType || isLiveUrl) ? 'livestream' : 'video',
      title: c.title,
      type: c.type,
      requiresWatch: true,
      channelName: c.channelHandle,
      channelHandle: c.channelHandle,
      channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      targetUrl: c.targetUrl,
      rewardCoins: 200,
      videoUrl: c.videoPreviewUrl || parseMediaUrl(c.targetUrl, c.channelHandle).streamUrl,
      sampleComments: [
        'Chiến dịch chất lượng quá!',
        'Ủng hộ kênh bạn nhé ❤️',
        'Đã tương tác đầy đủ cho kênh!'
      ],
      guide: c.instructions || 'Tương tác thật 100% để nhận Xu thưởng vào ví.',
      campaignCategory: 'partner',
      partnerName: 'Chiến Dịch Đang Chạy',
      partnerBadge: c.isBoosted ? '🔥 TOP 1 TOÀN SÀN' : 'Chiến Dịch Thật',
      totalSlots: c.targetQuantity,
      remainingSlots: Math.max(1, c.targetQuantity - (c.completedQuantity || 0)),
      isUrgent: true,
      isBoosted: c.isBoosted
    };
  });

  // 2. Build unified feed items combining ALL active campaigns from the website (Tự động ẩn khi hết suất)
  const activeTasks = (tasks || []).filter(t => t.status !== 'completed' && (t.remainingSlots === undefined || t.remainingSlots > 0));
  const videoFeedItems: UnifiedFeedItem[] = activeTasks.map(t => {
    const isLiveUrl = (t.targetUrl || '').toLowerCase().includes('/live');
    return {
      id: t.id,
      kind: isLiveUrl ? 'livestream' : 'video',
      title: t.title,
      type: t.type,
      requiresWatch: true,
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
    };
  });

  // 3. Feed items từ kho Follow Chéo Cộng Đồng Creator (Không khống chế 15s)
  const crossFollowFeedItems: UnifiedFeedItem[] = INITIAL_CROSS_FOLLOW_ITEMS
    .filter(cf => (cf.followersCount || 1000) > (cf.completedByUsersCount || 0))
    .map((cf) => ({
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

  // Hàm loại bỏ hoàn toàn trùng lặp và đẩy TOP 1 lên đầu (Ưu tiên gói đẩy Top 100.000 Xu)
  const deduplicateAndSortFeed = (items: UnifiedFeedItem[]): UnifiedFeedItem[] => {
    const seen = new Set<string>();
    const unique: UnifiedFeedItem[] = [];

    for (const item of items) {
      const normUrl = (item.targetUrl || '').trim().toLowerCase().replace(/\/+$/, '');
      const normHandle = (item.channelHandle || '').trim().toLowerCase();
      const dedupKey = normUrl || normHandle || item.id;

      if (!seen.has(dedupKey)) {
        seen.add(dedupKey);
        unique.push(item);
      }
    }

    return unique.sort((a, b) => {
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;
      return 0;
    });
  };

  // Dynamic custom test feed item if targetUrl / handle is passed directly from CreateCampaign test
  const customTestItem: UnifiedFeedItem | null = (feedRunnerTargetId && (typeof feedRunnerTargetId === 'string') && (feedRunnerTargetId.startsWith('http') || feedRunnerTargetId.startsWith('@'))) ? {
    id: `test_top1_${feedRunnerTargetId}`,
    kind: (feedRunnerTargetId.includes('/live') || feedRunnerTargetId.toLowerCase().includes('live')) ? 'livestream' : 'video',
    title: `🔥 [ĐANG XEM THỬ #1] ${parseMediaUrl(feedRunnerTargetId).handle}`,
    type: (feedRunnerTargetId.includes('/live') || feedRunnerTargetId.toLowerCase().includes('live')) ? 'livestream' : 'watch',
    requiresWatch: false,
    channelName: parseMediaUrl(feedRunnerTargetId).handle,
    channelHandle: parseMediaUrl(feedRunnerTargetId).handle,
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    targetUrl: feedRunnerTargetId,
    rewardCoins: 500,
    videoUrl: parseMediaUrl(feedRunnerTargetId).streamUrl,
    sampleComments: [
      'Nội dung rất hay và chất lượng ❤️',
      'Đã tương tác đầy đủ cho phiên live/video của bạn!',
      'Kênh phát trực tiếp siêu nét và uy tín!'
    ],
    guide: 'Xem trước phiên live / video thực tế trên Feed người dùng.',
    campaignCategory: 'partner',
    partnerName: 'Xem Thử Chiến Dịch',
    partnerBadge: '🔥 TOP 1 ĐANG TEST',
    totalSlots: 1000,
    remainingSlots: 999,
    isUrgent: true,
    isBoosted: true
  } : null;

  const allFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem ? [customTestItem] : []),
    ...createdCampaignFeedItems,
    ...videoFeedItems,
    ...crossFollowFeedItems,
    ...liveFeedItems
  ]);

  const missionsFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem && customTestItem.kind === 'video' ? [customTestItem] : []),
    ...createdCampaignFeedItems.filter(i => i.kind === 'video'),
    ...videoFeedItems
  ]);

  const liveFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem && customTestItem.kind === 'livestream' ? [customTestItem] : []),
    ...createdCampaignFeedItems.filter(i => i.kind === 'livestream'),
    ...liveFeedItems
  ]);

  const partnerFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem ? [customTestItem] : []),
    ...createdCampaignFeedItems,
    ...videoFeedItems.filter(i => i.campaignCategory === 'partner')
  ]);

  const crossFeedDeduplicated = deduplicateAndSortFeed(crossFollowFeedItems);

  // CHUỖI TOÀN BỘ VIDEO & CHIẾN DỊCH HỆ THỐNG LIÊN KẾT ĐỒNG BỘ (ĐÃ LỌC SẠCH TRÙNG LẶP & ƯU TIÊN TOP 1)
  const combinedFeed: UnifiedFeedItem[] = 
    filterMode === 'missions' ? missionsFeedDeduplicated :
    filterMode === 'live' ? liveFeedDeduplicated :
    filterMode === 'partner' ? partnerFeedDeduplicated :
    filterMode === 'cross_follow' ? crossFeedDeduplicated :
    filterMode === 'community' ? deduplicateAndSortFeed(videoFeedItems.filter(i => i.campaignCategory === 'community')) :
    allFeedDeduplicated;

  // Counts for each category (chuẩn sau khử trùng lặp)
  const countAll = allFeedDeduplicated.length;
  const countMissions = missionsFeedDeduplicated.length;
  const countLive = liveFeedDeduplicated.length;
  const countPartner = partnerFeedDeduplicated.length;
  const countCross = crossFeedDeduplicated.length;
  // Kho video dự phòng an toàn tuyệt đối 100% (Đảm bảo luôn luôn có video để phát ngay lập tức trên mọi thiết bị)
  const fallbackTaskItem: UnifiedFeedItem = {
    id: 'task_1',
    kind: 'video',
    title: 'Follow Kênh TikTok Mỹ Phẩm Dưỡng Da ZenSkin',
    type: 'follow',
    requiresWatch: true,
    channelName: 'ZenSkin Official Store',
    channelHandle: '@zenskin_vietnam',
    channelAvatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@zenskin_vietnam',
    rewardCoins: 200,
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    sampleComments: [
      'Da mình nhạy cảm dùng dòng này êm ru luôn ạ!',
      'Shop tư vấn nhiệt tình, giao hàng nhanh đỉnh chóp ❤️',
      'Đã mua lần 2, dưỡng ẩm cực kỳ căng bóng!'
    ],
    guide: 'Bấm Follow kênh, xem video tối thiểu 15 giây. Hệ thống tự động xác minh và cộng Xu ngay lập tức.',
    campaignCategory: 'partner',
    partnerName: 'ZenSkin Vietnam (Official Brand)',
    partnerBadge: 'Thương Hiệu Kim Cương',
    totalSlots: 2000,
    remainingSlots: 580,
    isUrgent: true,
    isBoosted: true
  };

  const safeFeed = (combinedFeed && combinedFeed.length > 0)
    ? combinedFeed
    : (allFeedDeduplicated && allFeedDeduplicated.length > 0)
      ? allFeedDeduplicated
      : [fallbackTaskItem];

  const currentItem = safeFeed[currentIndex] || safeFeed[0] || fallbackTaskItem;
  const currentClaimed = currentItem ? (taskClaimedMap[currentItem.id] || {}) : {};

  // Kiểm tra xem chiến dịch hiện tại có bắt buộc xem video / live không
  const isWatchRequired = currentItem 
    ? (currentItem.kind === 'livestream' || currentItem.type === 'watch' || currentItem.requiresWatch === true)
    : false;

  // Sync filterMode when feed runner opens with a specific filter
  useEffect(() => {
    if (isFeedRunnerOpen && feedRunnerFilter) {
      if (feedRunnerFilter === 'community') {
        setFilterMode('missions');
      } else {
        setFilterMode(feedRunnerFilter as any);
      }
    }
  }, [isFeedRunnerOpen, feedRunnerFilter]);

  // Sync with specific campaign ID if opened directly from campaign card or test preview
  useEffect(() => {
    if (isFeedRunnerOpen) {
      if (feedRunnerTargetId) {
        const isLiveTarget = typeof feedRunnerTargetId === 'string' && (
          feedRunnerTargetId.includes('/live') || 
          feedRunnerTargetId.toLowerCase().includes('live') ||
          feedRunnerTargetId.startsWith('live_')
        );
        if (isLiveTarget && filterMode !== 'all' && filterMode !== 'live') {
          setFilterMode('live');
        }

        let idx = combinedFeed.findIndex(item => 
          item.id === feedRunnerTargetId || 
          item.targetUrl === feedRunnerTargetId || 
          item.channelHandle === feedRunnerTargetId ||
          item.id === `test_top1_${feedRunnerTargetId}`
        );

        // Nếu chưa tìm thấy trong tab hiện tại, tìm trong toàn bộ feed và chuyển sang tab 'all'
        if (idx === -1) {
          const allIdx = allFeedDeduplicated.findIndex(item => 
            item.id === feedRunnerTargetId || 
            item.targetUrl === feedRunnerTargetId || 
            item.channelHandle === feedRunnerTargetId ||
            item.id === `test_top1_${feedRunnerTargetId}`
          );
          if (allIdx !== -1) {
            setFilterMode('all');
            setCurrentIndex(allIdx);
            return;
          }
        } else {
          setCurrentIndex(idx);
          return;
        }
      }
      setCurrentIndex(0);
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
        videoRef.current.defaultMuted = false;
        videoRef.current.muted = isMuted;
        videoRef.current.playsInline = true;
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
      }
    }
  }, [isFeedRunnerOpen, currentIndex, filterMode, isMuted, currentItem?.id]);

  // Tự động kích hoạt chế độ nhúng TikTok Embed cho video TikTok thật
  useEffect(() => {
    if (currentItem) {
      const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
      if (itemMedia.isTikTok && itemMedia.videoId) {
        setPlayerMode('embed');
      }
    }
  }, [currentItem?.id, currentItem?.targetUrl]);

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

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) {
      setIsPlaying(prev => !prev);
      return;
    }
    if (videoRef.current.paused) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

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
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedRunnerOpen, currentIndex, combinedFeed.length]);

  if (!isFeedRunnerOpen) return null;

  // Cảm ứng vuốt chạm (Touch Swipe) cho điện thoại di động & máy tính bảng (Tablet)
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
    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        // Vuốt ngón tay lên trên -> chuyển sang video / phiên live tiếp theo
        handleNextItem();
      } else {
        // Vuốt ngón tay xuống dưới -> quay lại video / phiên live trước đó
        handlePrevItem();
      }
    }
  };

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
    if (!currentItem.channelHandle) return;
    showToast(`✨ Kênh chính thức: ${currentItem.channelHandle}`);
  };

  // 1-CLICK FOLLOW TRỰC TIẾP TRÊN WEB APP & ĐỒNG BỘ TIKTOK THẬT CHẠY NGẦM
  const handleFollowAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const userHandle = user.tiktokConnected || user.email || '@user';
    if (!user.tiktokConnected) {
      const handleToLink = currentItem.channelHandle.startsWith('@') ? currentItem.channelHandle : `@${currentItem.channelHandle}`;
      connectTikTok(handleToLink);
    }

    if (!currentClaimed.follow) {
      const reward = claimTaskAction(currentItem.id, 'follow');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), follow: true }
      }));
      await syncTikTokFollow(currentItem.channelHandle, userHandle);
      showToast(`✨ +${reward || 200} Xu! Đã Follow kênh ${currentItem.channelHandle} từ tài khoản @${userHandle.replace(/^@+/, '')}!`);
    } else {
      showToast(`✅ Tài khoản @${userHandle.replace(/^@+/, '')} đã Follow kênh ${currentItem.channelHandle}!`);
    }
  };

  // 1-CLICK LIKE / THẢ TIM TRỰC TIẾP TRÊN WEB APP & ĐỒNG BỘ CHẠY NGẦM
  const handleLikeAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const userHandle = user.tiktokConnected || user.email || '@user';
    if (!currentClaimed.like) {
      const reward = claimTaskAction(currentItem.id, 'like');
      setSessionCoinsEarned(prev => prev + (reward || 100));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), like: true }
      }));
      await syncTikTokLike(currentItem.id, userHandle);
      showToast(`❤️ +${reward || 100} Xu! Đã thả tim từ tài khoản @${userHandle.replace(/^@+/, '')}!`);
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

  // 1-CLICK BÌNH LUẬN SEEDING TRỰC TIẾP TRÊN WEB APP & ĐỒNG BỘ CHẠY NGẦM
  const handleCommentAction = async (commentText: string) => {
    const text = commentText.trim();
    if (!text) return;
    setCustomComment('');
    const userHandle = user.tiktokConnected || user.email || '@user';
    if (!currentClaimed.comment) {
      const reward = claimTaskAction(currentItem.id, 'comment');
      setSessionCoinsEarned(prev => prev + (reward || 200));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), comment: true }
      }));
      await syncTikTokComment(currentItem.id, text, userHandle);
      showToast(`💬 +${reward || 200} Xu! Đã gửi bình luận từ tài khoản @${userHandle.replace(/^@+/, '')}!`);
    } else {
      await syncTikTokComment(currentItem.id, text, userHandle);
      showToast(`💬 Đã gửi bình luận: "${text}"`);
    }
    setShowCommentInput(false);
  };

  // 1-CLICK CHIA SẺ VIDEO ĐẨY VỀ FACEBOOK
  const handleShareAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetUrl = currentItem.targetUrl || `https://www.tiktok.com/@${currentItem.channelHandle.replace('@', '')}`;
    syncShareToFacebook(targetUrl, currentItem.channelHandle);

    if (!currentClaimed.share) {
      const reward = claimTaskAction(currentItem.id, 'share');
      setSessionCoinsEarned(prev => prev + (reward || 240));
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), share: true }
      }));
      showToast(`🚀 +${reward || 240} Xu! Đã chia sẻ video về Facebook!`);
    } else {
      showToast(`🚀 Đã mở chia sẻ về Facebook!`);
    }
  };

  const handleBookmarkAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentClaimed.bookmark) {
      claimTaskAction(currentItem.id, 'bookmark');
      setTaskClaimedMap(prev => ({
        ...prev,
        [currentItem.id]: { ...(prev[currentItem.id] || {}), bookmark: true }
      }));
      showToast(`⭐ Đã lưu video vào danh sách yêu thích!`);
    }
  };

  const sampleComments = currentItem.sampleComments || [
    'Nội dung chia sẻ cuốn thực sự, mong bạn ra thêm nhiều clip nữa nhé ❤️',
    'Đã theo dõi kênh và ủng hộ, chúc bạn sớm đạt 100k follow!',
    'Sản phẩm này dùng êm ru luôn ạ, cho mình xin link bio với shop ơi!'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Phone Simulation Container: Vừa vặn chuẩn xác tỷ lệ điện thoại di động & tablet */}
      <div 
        className="relative w-full h-[100dvh] sm:h-[92vh] sm:max-h-[820px] sm:max-w-[390px] sm:aspect-[9/16] sm:rounded-3xl bg-black border-0 sm:border border-white/20 shadow-2xl overflow-hidden flex flex-col mx-auto pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Floating Controls */}
        <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:p-3 bg-gradient-to-b from-black/95 via-black/80 to-transparent space-y-2">
          {/* Top Row: Clean Minimal Header (Mute Toggle & Close) */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-white/80 backdrop-blur-md">
                <svg className="w-3 h-3 fill-rose-500 shrink-0" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
                </svg>
                <span className="font-bold text-white tracking-wide">TikTok Video Runner</span>
                <span className="text-slate-400 font-bold">({currentIndex + 1}/{combinedFeed.length})</span>
              </span>

              {(() => {
                const itemMedia = parseMediaUrl(currentItem?.targetUrl || currentItem?.videoUrl || '', currentItem?.channelHandle);
                if (itemMedia.isTikTok && itemMedia.videoId) {
                  return (
                    <button
                      onClick={() => setPlayerMode(playerMode === 'embed' ? 'stream' : 'embed')}
                      className="px-2.5 py-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-[9px] font-mono font-bold border border-rose-400/40 backdrop-blur-md transition-all flex items-center gap-1 shadow-md cursor-pointer"
                      title={playerMode === 'embed' ? 'Đang phát TikTok Gốc (Bấm để chuyển sang Stream HD)' : 'Đang phát Stream HD (Bấm để chuyển sang TikTok Gốc)'}
                    >
                      {playerMode === 'embed' ? '🎬 TikTok Gốc' : '⚡ Stream HD'}
                    </button>
                  );
                }
                return null;
              })()}
            </div>

            {/* Right Buttons: Mute Toggle & Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = nextMuted;
                  }
                  showToast(nextMuted ? '🔇 Đã tắt âm thanh' : '🔊 Đã bật âm thanh video sống động');
                }}
                className="p-1.5 rounded-full bg-black/70 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 active:scale-95"
                title={isMuted ? 'Bấm để bật âm thanh' : 'Bấm để tắt tiếng'}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={closeFeedRunner}
                className="p-1.5 rounded-full bg-black/70 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer border border-white/10 active:scale-95"
                title="Đóng trình lướt video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Row 2: CATEGORY TABS (TẤT CẢ, LÀM NHIỆM VỤ, LIVE STREAM, FOLLOW CHÉO) */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md text-[10px] font-mono overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => { setFilterMode('all'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                filterMode === 'all' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-1 ring-cyan-400/50' 
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
            >
              <span>⚡ Tất Cả ({countAll})</span>
            </button>

            <button
              onClick={() => { setFilterMode('missions'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                filterMode === 'missions' 
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md ring-1 ring-rose-400/50' 
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
            >
              <span>🎯 Làm Nhiệm Vụ ({countMissions})</span>
            </button>

            <button
              onClick={() => { 
                setFilterMode('live'); 
                setCurrentIndex(0); 
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                filterMode === 'live' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-400/50' 
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
            >
              <span>🔴 Live Stream ({countLive})</span>
            </button>

            <button
              onClick={() => { 
                setFilterMode('cross_follow'); 
                setCurrentIndex(0); 
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                filterMode === 'cross_follow' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-1 ring-emerald-400/50' 
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
            >
              <span>🔄 Follow Chéo ({countCross})</span>
            </button>
          </div>
        </div>

        {/* Video / Live Stream Stage */}
        <div 
          className="relative flex-1 bg-black flex items-center justify-center select-none overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
          onClick={togglePlay}
        >
          {/* TÁCH BIỆT CÁC TAB CODE PLAYER THEO YÊU CẦU: LIVE THẬT 100% & VIDEO THƯỜNG */}
          {(() => {
            const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
            const isLiveItem = currentItem.kind === 'livestream' || itemMedia.isLive;

            // 1. CÁC TRÌNH PHÁT LIVE STREAM THẬT (3 TAB RIÊNG BIỆT)
            if (isLiveItem) {
              if (itemMedia.isYouTube && itemMedia.youtubeId) {
                return (
                  <YouTubeLiveEmbedPlayer
                    key={currentItem.id + '_yt_live_' + itemMedia.youtubeId}
                    youtubeId={itemMedia.youtubeId}
                    title={currentItem.title}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                  />
                );
              }

              if (itemMedia.isFacebook) {
                return (
                  <FacebookLiveEmbedPlayer
                    key={currentItem.id + '_fb_live_' + encodeURIComponent(currentItem.targetUrl)}
                    url={currentItem.targetUrl}
                    title={currentItem.title}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                  />
                );
              }

              // TikTok Live Stream Thật 100%
              return (
                <TikTokLiveEmbedPlayer
                  key={currentItem.id + '_tt_live_' + currentItem.channelHandle}
                  channelHandle={currentItem.channelHandle}
                  targetUrl={currentItem.targetUrl}
                  channelName={currentItem.title}
                  viewersCount={currentItem.currentViewers || 1580}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  mode="feed"
                  hideHud={true}
                />
              );
            }

            // 2. CÁC TRÌNH PHÁT VIDEO THƯỜNG
            if (itemMedia.isYouTube && itemMedia.youtubeId) {
              return (
                <YouTubeEmbedPlayer
                  key={currentItem.id + '_yt_' + itemMedia.youtubeId}
                  youtubeId={itemMedia.youtubeId}
                  title={currentItem.title}
                  isMuted={isMuted}
                />
              );
            }

            if (itemMedia.isFacebook) {
              return (
                <FacebookEmbedPlayer
                  key={currentItem.id + '_fb_' + encodeURIComponent(currentItem.targetUrl)}
                  url={currentItem.targetUrl}
                  title={currentItem.title}
                  isMuted={isMuted}
                />
              );
            }

            // A. Ưu tiên phát video trực tiếp (MP4 / WebM / Stream) - Chạy mượt tức thì kèm âm thanh
            const directVideoSource = (currentItem.videoUrl && !currentItem.videoUrl.includes('tiktok.com')) 
              ? currentItem.videoUrl 
              : (itemMedia.isDirectVideo ? itemMedia.streamUrl : null) || (currentItem.targetUrl?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? currentItem.targetUrl : null);

            if (directVideoSource) {
              return (
                <DirectVideoPlayer
                  key={currentItem.id + '_' + directVideoSource}
                  src={directVideoSource}
                  autoPlay
                  isMuted={isMuted}
                  isPlaying={isPlaying}
                  onTogglePlay={togglePlay}
                />
              );
            }

            // B. TikTok Official Video Embed (Chỉ khi có Video ID chuẩn 18-21 chữ số)
            const hasValidTikTokVideoId = Boolean(itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId));
            if (itemMedia.isTikTok && hasValidTikTokVideoId) {
              return (
                <TikTokVideoEmbedPlayer
                  key={currentItem.id + '_tt_' + itemMedia.videoId}
                  videoId={itemMedia.videoId}
                  title={currentItem.title}
                />
              );
            }

            // C. Kênh TikTok không có file video mp4 trực tiếp: Hiển thị Profile Card đẹp mắt, tránh iframe SAMEORIGIN
            if (itemMedia.isTikTok) {
              const cleanHandle = (currentItem.channelHandle || itemMedia.handle || '@tiktok').replace(/^@+/, '');
              return (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-[#111827] to-black rounded-3xl w-full h-full select-none">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-rose-500 overflow-hidden shadow-2xl p-1 bg-gradient-to-tr from-rose-500 to-pink-500">
                      <img 
                        src={currentItem.channelAvatar || getTikTokAvatar(cleanHandle)} 
                        alt={cleanHandle}
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanHandle)}&background=E11D48&color=fff&bold=true`;
                        }}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 text-white shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-white font-black text-base font-display">@{cleanHandle}</h4>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                      ✓ Kênh TikTok Đối Tác Chính Thức
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono max-w-sm leading-relaxed">
                    {currentItem.guide || `Bấm Follow kênh @${cleanHandle} trên TikTok để nhận ngay ${currentItem.rewardCoins} Xu thưởng.`}
                  </p>

                  <a
                    href={currentItem.targetUrl || `https://www.tiktok.com/@${cleanHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>Mở Kênh & Follow Trên TikTok</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            }

            // D. Fallback cuối cùng
            const fallbackSrc = currentItem.videoUrl || itemMedia.streamUrl || 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
            return (
              <DirectVideoPlayer
                key={currentItem.id + '_fallback'}
                src={fallbackSrc}
                autoPlay
                isMuted={isMuted}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
              />
            );
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

          {/* Play/Pause Center Interactive Button */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute z-30 flex flex-col items-center justify-center p-4 cursor-pointer pointer-events-auto bg-black/40 backdrop-blur-[2px] rounded-3xl"
            >
              <div className="p-4 rounded-full bg-rose-600/95 hover:bg-rose-500 text-white backdrop-blur-md animate-in zoom-in-50 duration-150 shadow-2xl border-2 border-white/40 hover:scale-110 active:scale-95 transition-all">
                <Play className="h-10 w-10 fill-white ml-1" />
              </div>
              <span className="mt-2.5 px-3 py-1 rounded-full bg-black/80 text-white text-[10px] font-mono font-bold tracking-wide border border-white/20 shadow-lg">
                ▶️ BẤM ĐỂ PHÁT TIẾP
              </span>
            </div>
          )}

          {/* Bottom-Left: Clean TikTok v2 Creator & Caption Info */}
          <div className="absolute left-3 bottom-14 z-30 space-y-2 max-w-[72%] pointer-events-auto text-left">
            {/* TASK ACTION BADGE - Hiển thị rõ ràng nhiệm vụ cần làm */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-neonGold/60 shadow-lg animate-in fade-in">
              {currentItem.type === 'follow' ? (
                <>
                  <UserPlus className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-mono font-black text-neonGold uppercase">Nhiệm vụ: Follow Kênh (+200 Xu)</span>
                </>
              ) : currentItem.type === 'watch' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono font-black text-cyan-300 uppercase">Nhiệm vụ: Xem Đủ 15s (+200 Xu)</span>
                </>
              ) : currentItem.type === 'like' ? (
                <>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span className="text-[10px] font-mono font-black text-pink-300 uppercase">Nhiệm vụ: Thả Tim Video (+100 Xu)</span>
                </>
              ) : currentItem.type === 'comment' ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] font-mono font-black text-purple-300 uppercase">Nhiệm vụ: Viết Bình Luận (+200 Xu)</span>
                </>
              ) : currentItem.type === 'share' ? (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-mono font-black text-blue-300 uppercase">Nhiệm vụ: Chia Sẻ Video (+240 Xu)</span>
                </>
              ) : currentItem.kind === 'livestream' ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-rose-300 uppercase">Nhiệm vụ: Xem Live Giữ Mắt (+400 Xu)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-neonGold" />
                  <span className="text-[10px] font-mono font-black text-neonGold uppercase">Nhiệm vụ: Tương Tác Thật (+200 Xu)</span>
                </>
              )}
            </div>

            {/* Creator Handle + Verified Badge (Bấm để nhảy về đúng kênh TikTok của người dùng) */}
            <div 
              onClick={handleOpenTikTokApp}
              className="flex items-center gap-1.5 flex-wrap cursor-pointer group"
              title="Bấm để mở trang TikTok chính thức của kênh này"
            >
              <span className="text-white font-black text-sm drop-shadow-md tracking-wide group-hover:text-cyan-300 transition-colors">
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

            {/* Music Sound Tag (Chỉ hiện cho video thường) */}
            {currentItem.kind !== 'livestream' && (
              <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium">
                <Music className="h-3.5 w-3.5 text-[#FE2C55] animate-spin-slow shrink-0" />
                <span className="truncate drop-shadow-md">
                  Âm thanh gốc - {currentItem.channelName} • Nhạc xu hướng TikTok
                </span>
              </div>
            )}
          </div>

          {/* Right Action Bar (Chỉ hiển thị khi phát Video Stream HD, ẩn khi phát TikTok Embed để tránh trùng lặp 2 cột icon) */}
          {playerMode !== 'embed' && (
            <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center gap-3.5 pointer-events-auto">
              {/* Creator Avatar with Follow Plus Badge */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowAction();
                }}
                className="relative mb-2 cursor-pointer group"
                title="Bấm avatar để Follow kênh & nhận +200 Xu"
              >
                <img 
                  src={currentItem.channelAvatar} 
                  alt="" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white group-hover:border-rose-500 transition-all shadow-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowAction();
                  }}
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
                    currentClaimed.follow 
                      ? 'bg-emerald-500 ring-2 ring-emerald-400/60 scale-100' 
                      : 'bg-[#FE2C55] hover:scale-110 active:scale-95 shadow-red-500/50'
                  }`}
                  title={currentClaimed.follow ? 'Đã Follow trên hệ thống' : 'Bấm Follow & nhận +200 Xu'}
                >
                  {currentClaimed.follow ? (
                    <Check className="w-3.5 h-3.5 stroke-[3.5] text-white" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[3] text-white" />
                  )}
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
                <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-75">
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
          )}

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

          {/* Interactive In-App Comment Drawer */}
          {showCommentInput && (
            <div 
              className="absolute inset-x-0 bottom-0 z-40 p-4 rounded-t-3xl bg-[#0E1322] border-t border-white/20 space-y-3 animate-in slide-in-from-bottom duration-200 pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white font-display">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <MessageCircle className="w-4 h-4" /> Bình luận &amp; Đồng bộ TikTok (+200 Xu)
                </span>
                <button onClick={() => setShowCommentInput(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Custom Comment Input Field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customComment.trim()) {
                      handleCommentAction(customComment.trim());
                    }
                  }}
                  placeholder="Nhập nội dung bình luận thật của bạn..."
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customComment.trim()) {
                      handleCommentAction(customComment.trim());
                    } else {
                      handleCommentAction('Nội dung video rất hay và cuốn hút, mong bạn ra thêm clip nhé ❤️');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>

              {/* Seeding Presets */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                <span className="text-[10px] font-mono text-slate-400">Gợi ý bình luận nhanh:</span>
                {sampleComments.map((cmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCommentAction(cmt)}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer block truncate"
                  >
                    "{cmt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* QUICK IN-APP TASK INTERACTION DECK (4 Nút tương tác nhận Xu trực tiếp 1-chạm) */}
        <div className="flex items-center justify-between gap-1.5 p-2 bg-[#080B14] border-t border-white/10 text-[11px] font-mono shrink-0">
          <button 
            type="button"
            onClick={handleFollowAction} 
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 font-bold transition-all cursor-pointer select-none ${
              currentClaimed.follow 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                : 'bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 active:scale-95 shadow-sm'
            }`}
          >
            {currentClaimed.follow ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
            <span className="truncate">{currentClaimed.follow ? 'Đã Follow' : 'Follow (+200)'}</span>
          </button>
          
          <button 
            type="button"
            onClick={handleLikeAction} 
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 font-bold transition-all cursor-pointer select-none ${
              currentClaimed.like 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40 shadow-sm' 
                : 'bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 active:scale-95 shadow-sm'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${currentClaimed.like ? 'fill-pink-400 text-pink-400' : ''}`} />
            <span className="truncate">{currentClaimed.like ? 'Đã Tim' : 'Thả Tim (+100)'}</span>
          </button>

          <button 
            type="button"
            onClick={() => setShowCommentInput(!showCommentInput)} 
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 font-bold transition-all cursor-pointer select-none ${
              currentClaimed.comment 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm' 
                : 'bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 active:scale-95 shadow-sm'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="truncate">{currentClaimed.comment ? 'Đã Cmt' : 'Bình Luận (+200)'}</span>
          </button>

          <button 
            type="button"
            onClick={handleShareAction} 
            className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 font-bold transition-all cursor-pointer select-none ${
              currentClaimed.share 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm' 
                : 'bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 active:scale-95 shadow-sm'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="truncate">{currentClaimed.share ? 'Đã Share' : 'Chia Sẻ (+240)'}</span>
          </button>
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

