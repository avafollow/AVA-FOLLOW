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
import {
  TabVisibilityTracker,
  LiveWatchHeartbeat,
  checkFraudProof,
  applyFraudPenalty,
  applySuccessReward,
  isUserBlocked,
  createFollowCommitment,
  formatCountdown,
  getTrustScoreBadge,
  getTrustProfile,
  MIN_CONFIRM_SECONDS,
  MIN_TAB_TIME_MS,
  type FraudActionType
} from '../../services/antiFraudEngine';


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
    userCompletedActions,
    connectTikTok,
    claimTaskAction,
    showToast,
    openShareModal,
    interactWithLiveBroadcast,
    feedRunnerFilter,
    feedRunnerTargetId,
    userMissions,
    openFraudAppealModal
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
  const [playerMode, setPlayerMode] = useState<'stream' | 'embed'>('stream'); // Mặc định stream siêu mượt kèm âm thanh
  const [syncingAction, setSyncingAction] = useState<string | null>(null);
  const [inModalAlert, setInModalAlert] = useState<{ message: string; sub?: string; icon?: string } | null>(null);
  // Trạng thái chờ xác minh (tích hợp Anti-Fraud Engine)
  const [pendingVerification, setPendingVerification] = useState<{
    action: 'follow' | 'like' | 'comment' | 'share';
    itemId: string;
    tiktokUrl: string;
    commentText?: string;
    coinsToEarn: number;
    label: string;
    openedAt: number;               // Timestamp khi mở TikTok
    minConfirmAt: number;           // Thời điểm sớm nhất được bấm Confirm
  } | null>(null);
  // Countdown cho nút Confirm
  const [confirmCountdown, setConfirmCountdown] = useState<number>(0);
  // Tab visibility tracking - theo dõi user có rời tab không
  const tabTrackerRef = useRef<TabVisibilityTracker>(new TabVisibilityTracker());
  // Live watch heartbeat - chỉ tính giờ khi tab đang active
  const liveHeartbeatRef = useRef<LiveWatchHeartbeat>(new LiveWatchHeartbeat());
  const [liveActiveSeconds, setLiveActiveSeconds] = useState<number>(0);
  const [liveIsTabActive, setLiveIsTabActive] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Cảm ứng vuốt chạm (Touch Swipe) cho điện thoại di động & máy tính bảng (Tablet)
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);


  // Kiểm tra hoàn thành nhiệm vụ ngày (Bắt buộc xong nhiệm vụ ngày mới mở Live & Follow chéo - Admin & Whitelisted được toàn quyền)
  const dailyMissions = userMissions?.filter(m => m.category === 'daily') || [];
  const isDailyMissionsCompleted = (user.isAdmin || user.hasAllPermissions || user.isWhitelisted || user.canFollowCrossUnrestricted)
    ? true
    : (dailyMissions.length > 0 
        ? dailyMissions.every(m => m.status === 'claimed' || m.completedCount >= m.targetCount)
        : true);

  // Per-task claimed actions tracking (Idempotent 1 time only)
  const [taskClaimedMap, setTaskClaimedMap] = useState<Record<string, {
    follow?: boolean;
    like?: boolean;
    comment?: boolean;
    share?: boolean;
    bookmark?: boolean;
    watch?: boolean;
  }>>({});

  // 1. Toàn bộ Chiến Dịch Thật Tạo Mới & Đang Chạy (Tự động ẩn khi hoàn thành đủ số lượng đã mua hoặc user đã làm xong)
  const activeCampaigns = (campaigns || []).filter(c => 
    c.status !== 'completed' && 
    (c.completedQuantity || 0) < (c.targetQuantity || 100) &&
    !userCompletedActions?.[c.id]
  );

  const createdCampaignFeedItems: UnifiedFeedItem[] = activeCampaigns.map((c) => {
    const titleLower = (c.title || '').toLowerCase();
    const targetUrlLower = (c.targetUrl || '').toLowerCase();

    const isMulti = c.type === 'multi_target' || titleLower.includes('combo');
    const isFollow = !isMulti && (c.type === 'follow' || titleLower.includes('follow') || titleLower.includes('follower'));
    const isLike = !isMulti && (c.type === 'like' || titleLower.includes('thả tim') || titleLower.includes('like'));
    const isComment = !isMulti && (c.type === 'comment' || titleLower.includes('bình luận') || titleLower.includes('comment'));
    const isShare = !isMulti && (c.type === 'share' || titleLower.includes('chia sẻ') || titleLower.includes('share'));
    const isPaidWatchOnly = !isMulti && (c.type === 'watch' || titleLower.includes('giữ chân') || titleLower.includes('lượt xem')) && !titleLower.includes('tặng');
    
    // Livestream CHỈ KHI không phải là combo/follow/like/comment/share
    const isLive = !isMulti && !isFollow && !isLike && !isComment && !isShare && (
      c.type === 'livestream' || 
      c.type === 'livestream_viewers' || 
      c.type === 'mega_live' || 
      (targetUrlLower.includes('tiktok.com/@') && targetUrlLower.includes('/live'))
    );
    
    const avatar = getTikTokAvatar(c.channelHandle);
    const reward = isMulti ? 400 : (isLive ? 400 : (isFollow ? 200 : (isLike ? 100 : (isComment ? 200 : (isShare ? 240 : 200)))));

    return {
      id: c.id,
      kind: isLive ? 'livestream' : 'video',
      title: c.title,
      type: isMulti ? 'combo' : c.type,
      requiresWatch: isLive || isPaidWatchOnly,
      channelName: c.channelHandle,
      channelHandle: c.channelHandle,
      channelAvatar: avatar,
      targetUrl: c.targetUrl,
      rewardCoins: reward,
      videoUrl: c.videoPreviewUrl || parseMediaUrl(c.targetUrl, c.channelHandle).streamUrl,
      sampleComments: [
        'Chiến dịch chất lượng quá!',
        'Ủng hộ kênh bạn nhé ❤️',
        'Đã tương tác đầy đủ cho kênh!'
      ],
      guide: c.instructions || 'Tương tác thật 100% để nhận Xu thưởng vào ví.',
      campaignCategory: 'partner',
      partnerName: 'Chiến Dịch Đang Chạy',
      partnerBadge: c.isBoosted ? '🔥 TOP 1 TOÀN SÀN' : (isMulti ? '⭐ Combo Đa Tương Tác' : (isLive ? '🔴 Live Thật' : 'Chiến Dịch Thật')),
      totalSlots: c.targetQuantity,
      remainingSlots: Math.max(1, c.targetQuantity - (c.completedQuantity || 0)),
      isUrgent: true,
      isBoosted: c.isBoosted
    };
  });

  // Thứ tự ưu tiên sắp xếp nhiệm vụ theo chuỗi tuần tự chuẩn: follow -> like -> comment -> share -> watch -> livestream
  const TASK_TYPE_ORDER: Record<string, number> = {
    follow: 1,
    like: 2,
    comment: 3,
    share: 4,
    watch: 5,
    livestream: 6,
    livestream_viewers: 6
  };

  // Hàm loại bỏ hoàn toàn trùng lặp và phân nhóm tuần tự nghiêm ngặt theo loại nhiệm vụ
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
      // 1. Ưu tiên hàng đầu cho các chiến dịch được đẩy TOP (isBoosted)
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;

      // 2. Sắp xếp tuần tự nghiêm ngặt theo nhóm chuỗi nhiệm vụ: Follow -> Like -> Comment -> Share -> Watch -> Live
      const orderA = TASK_TYPE_ORDER[a.type || (a.kind === 'livestream' ? 'livestream' : 'watch')] || 99;
      const orderB = TASK_TYPE_ORDER[b.type || (b.kind === 'livestream' ? 'livestream' : 'watch')] || 99;
      if (orderA !== orderB) return orderA - orderB;

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

  // CHỈ HIỂN THỊ 100% CHIẾN DỊCH THẬT ĐANG CHẠY (ĐÃ XÓA TOÀN BỘ VIDEO & LIVE DEMO ẢO)
  const allFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem ? [customTestItem] : []),
    ...createdCampaignFeedItems
  ]);

  const missionsFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem && customTestItem.kind === 'video' ? [customTestItem] : []),
    ...createdCampaignFeedItems.filter(i => i.kind === 'video')
  ]);

  const liveFeedDeduplicated = deduplicateAndSortFeed([
    ...(customTestItem && customTestItem.kind === 'livestream' ? [customTestItem] : []),
    ...createdCampaignFeedItems.filter(i => i.kind === 'livestream')
  ]);

  const partnerFeedDeduplicated = allFeedDeduplicated;
  const crossFeedDeduplicated = allFeedDeduplicated.filter(i => i.type === 'follow');

  // CHUỖI TOÀN BỘ VIDEO & CHIẾN DỊCH HỆ THỐNG LIÊN KẾT ĐỒNG BỘ
  const combinedFeed: UnifiedFeedItem[] = 
    filterMode === 'missions' ? missionsFeedDeduplicated :
    filterMode === 'live' ? liveFeedDeduplicated :
    filterMode === 'partner' ? partnerFeedDeduplicated :
    filterMode === 'cross_follow' ? crossFeedDeduplicated :
    allFeedDeduplicated;

  // Counts for each category
  const countAll = allFeedDeduplicated.length;
  const countMissions = missionsFeedDeduplicated.length;
  const countLive = liveFeedDeduplicated.length;
  const countPartner = partnerFeedDeduplicated.length;
  const countCross = crossFeedDeduplicated.length;

  const emptyPlaceholderItem: UnifiedFeedItem = {
    id: 'empty_campaign_placeholder',
    kind: 'video',
    title: 'Hệ thống đã dọn sạch các phiên live & video demo',
    type: 'follow',
    requiresWatch: false,
    channelName: 'Hệ Thống AVA FOLLOW',
    channelHandle: '@avalive_official',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    targetUrl: 'https://tiktok.com/@avalive_official',
    rewardCoins: 0,
    videoUrl: '',
    sampleComments: [],
    guide: 'Tạo chiến dịch mới để xuất hiện trên Feed người dùng.',
    campaignCategory: 'partner',
    partnerName: 'AVA FOLLOW System',
    partnerBadge: 'Hệ Thống Thật 100%',
    totalSlots: 0,
    remainingSlots: 0
  };

  const safeFeed = combinedFeed.length > 0 ? combinedFeed : allFeedDeduplicated;
  const currentItem = safeFeed[currentIndex] || safeFeed[0] || emptyPlaceholderItem;
  const currentClaimed = currentItem ? (taskClaimedMap[currentItem.id] || {}) : {};

  const currentMediaInfo = parseMediaUrl(currentItem?.targetUrl || currentItem?.videoUrl || '', currentItem?.channelHandle);
  const isLiveItem = currentItem?.kind === 'livestream' || currentItem?.type === 'livestream' || currentMediaInfo.isLive;
  const targetCampaignAction = currentItem?.type || 'follow';

  // Kiểm tra xem chiến dịch hiện tại có bắt buộc xem video / live không
  const isWatchRequired = currentItem 
    ? (isLiveItem || currentItem.type === 'watch' || currentItem.requiresWatch === true)
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

  // Reset timer on item change or open (Mặc định video có gói view là 40 giây trung bình, live theo số phút chiến dịch)
  useEffect(() => {
    if (isFeedRunnerOpen && currentItem) {
      if (currentItem.kind === 'livestream') {
        const liveSecs = currentItem.targetMinutes ? Math.round(currentItem.targetMinutes * 60) : 180;
        setTimeLeft(liveSecs);
      } else if (currentItem.type === 'watch' && currentItem.requiresWatch === true && !currentItem.title?.toLowerCase().includes('tặng')) {
        // GÓI MUA XEM VIEW CHUYÊN DỤNG: Cố định 45s - 60s (mặc định 45s) để tối ưu chỉ số giữ chân retention
        setTimeLeft(45);
      } else {
        // GÓI TẶNG KÈM LƯỢT XEM HOẶC NHIỆM VỤ KHÁC: View tự nhiên, không bắt buộc xem giây
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

  // Tự động chuyển đổi chế độ phát video phù hợp từng loại chiến dịch
  useEffect(() => {
    if (currentItem) {
      const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
      if (itemMedia.isTikTok && itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId)) {
        setPlayerMode('embed');
      } else {
        setPlayerMode('stream');
      }
    }
  }, [currentItem?.id, currentItem?.targetUrl]);

  // Main timer countdown (chỉ đếm ngược khi có gói xem video / livestream - Live bắt buộc Tab Active)
  useEffect(() => {
    if (!isFeedRunnerOpen || !isWatchRequired || timeLeft <= 0 || !isPlaying) return;
    const timer = setInterval(() => {
      // Đối với livestream, nếu user ẩn tab (document.hidden), tạm dừng đếm để chống treo máy AFK
      if (currentItem?.kind === 'livestream' && document.hidden) {
        return;
      }
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFeedRunnerOpen, isWatchRequired, timeLeft, isPlaying, currentItem?.kind]);


  // ────────── ANTI-FRAUD: Countdown cho nút Confirm ──────────
  // Cập nhật mỗi giây khi đang chờ xác minh
  useEffect(() => {
    if (!pendingVerification) { setConfirmCountdown(0); return; }
    const tick = () => {
      const remaining = pendingVerification.minConfirmAt - Date.now();
      setConfirmCountdown(Math.max(0, remaining));
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [pendingVerification]);

  // ────────── ANTI-FRAUD: Live Watch Heartbeat ──────────
  // Chỉ tính giờ khi user đang focus vào tab (tránh gian lận AFK)
  useEffect(() => {
    if (!isFeedRunnerOpen) return;
    const isLiveItem = currentItem?.kind === 'livestream';
    if (!isLiveItem) {
      liveHeartbeatRef.current.stop();
      return;
    }

    liveHeartbeatRef.current = new LiveWatchHeartbeat();
    liveHeartbeatRef.current.start((activeSeconds, _total, isActive) => {
      setLiveActiveSeconds(activeSeconds);
      setLiveIsTabActive(isActive);
    });

    return () => {
      liveHeartbeatRef.current.stop();
    };
  }, [isFeedRunnerOpen, currentItem?.id, currentItem?.kind]);

  // When timer reaches 0 for video watch package, claim watch reward (+200 Xu) - KHÔNG TỰ Ý CHUYỂN VIDEO
  useEffect(() => {
    if (isWatchRequired && timeLeft === 0 && currentItem && !currentClaimed.watch) {
      if (currentItem.kind === 'video') {
        const reward = claimTaskAction(currentItem.id, 'watch');
        setSessionCoinsEarned(prev => prev + (reward || 200));
        setTaskClaimedMap(prev => ({
          ...prev,
          [currentItem.id]: {
            ...(prev[currentItem.id] || {}),
            watch: true
          }
        }));
        showToast('🎉 Đã xem đủ thời gian giữ chân 40s - 60s (+200 Xu vào ví)! Bạn có thể tiếp tục xem trọn vẹn video hoặc bấm nút để chuyển tiếp.');
      } else if (currentItem.kind === 'livestream') {
        // Nhận thưởng xem live stream thật (30s, 1p, 3p...)
        const reward = claimTaskAction(currentItem.id, 'watch');
        const liveCoins = reward || currentItem.rewardCoins || 400;
        setSessionCoinsEarned(prev => prev + liveCoins);
        setTaskClaimedMap(prev => ({
          ...prev,
          [currentItem.id]: {
            ...(prev[currentItem.id] || {}),
            watch: true
          }
        }));
        applySuccessReward(user.tiktokConnected || user.email || '@user');
        setInModalAlert({
          message: `🔴 Hoàn thành phiên live! (+${liveCoins} Xu)`,
          sub: `Đã xác thực mắt xem thật & tính thời gian thực 100%. Cảm ơn bạn!`
        });
        showToast(`🔴 Đã xem trọn vẹn phiên live & cộng +${liveCoins} Xu vào ví!`);
      }
    }
  }, [timeLeft, isWatchRequired, currentItem, currentClaimed.watch, claimTaskAction, user]);


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
    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const url = currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com')
      ? currentItem.targetUrl
      : `https://www.tiktok.com/@${cleanHandle}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    showToast(`🌐 Đang mở kênh TikTok chính thức: @${cleanHandle}`);
  };

  // 1-CLICK FOLLOW TRỰC TIẾP TRÊN WEB APP & ĐỒNG BỘ TIKTOK THẬT (CHUẨN ANTI-FRAUD)
  const handleFollowAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (syncingAction) return;

    const userHandle = user.tiktokConnected || user.email || '@user';

    // ── Kiểm tra tài khoản có bị khóa không? ──
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      const unblockTime = blockStatus.unblockAt ? new Date(blockStatus.unblockAt).toLocaleTimeString('vi-VN') : 'sau 24h';
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận. Mở lại lúc ${unblockTime}.`, sub: blockStatus.reason });
      return;
    }

    if (!user.tiktokConnected) {
      const handleToLink = currentItem.channelHandle.startsWith('@') ? currentItem.channelHandle : `@${currentItem.channelHandle}`;
      connectTikTok(handleToLink);
    }

    if (currentClaimed.follow) {
      showToast(`✅ Bạn đã Follow kênh ${currentItem.channelHandle} rồi!`);
      return;
    }

    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const realTikTokChannelUrl = currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com/@')
      ? currentItem.targetUrl
      : `https://www.tiktok.com/@${cleanHandle}`;

    // ── Bắt đầu theo dõi tab (phát hiện user có rời tab không) ──
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();

    if (typeof window !== 'undefined') {
      try { window.open(realTikTokChannelUrl, '_blank'); } catch (err) { console.warn('Could not open popup:', err); }
    }

    const openedAt = Date.now();
    const minConfirmAt = openedAt + MIN_CONFIRM_SECONDS['follow'] * 1000;

    setSyncingAction('follow');
    try {
      const res = await syncTikTokFollow(currentItem.channelHandle, userHandle);
      if (res.success) {
        // Follow lập tức cộng Xu (mở TikTok, đợi xác nhận về sau)
        const reward = claimTaskAction(currentItem.id, 'follow');
        const earned = reward || res.coinsEarned || 200;
        setSessionCoinsEarned(prev => prev + earned);
        setTaskClaimedMap(prev => ({
          ...prev,
          [currentItem.id]: { ...(prev[currentItem.id] || {}), follow: true }
        }));
        // Tạo cam kết 30 ngày
        createFollowCommitment(userHandle, cleanHandle, earned, res.txHash || 'TT_FOLLOW');
        applySuccessReward(userHandle);
        setInModalAlert({
          message: `✅ Đã mở kênh @${cleanHandle} & ghi nhận Follow! (+${earned} Xu)`,
          sub: `📌 Cam kết 30 ngày: Không unfollow trong 30 ngày để giữ Xu • Mã: ${res.txHash || 'TT-FOLLOW'}`
        });
        showToast(`✅ Mở TikTok → Follow @${cleanHandle} → nhận +${earned} Xu! (Cam kết 30 ngày)`);
      } else {
        setInModalAlert({ message: res.message, sub: 'Thông báo từ hệ thống đồng bộ' });
        showToast(res.message);
      }
    } finally {
      setSyncingAction(null);
    }
  };


  // 1-CLICK LIKE / THẢ TIM THẬT - MỞ TIKTOK THẬT + XÁC MINH ANTI-FRAUD + CỘNG XU
  const handleLikeAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (syncingAction) return;

    const userHandle = user.tiktokConnected || user.email || '@user';
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận.`, sub: blockStatus.reason });
      return;
    }

    if (currentClaimed.like) {
      setInModalAlert({ message: '❤️ Bạn đã thả tim video này rồi!' });
      showToast('❤️ Bạn đã thả tim video này rồi!');
      return;
    }

    const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const videoTikTokUrl = (currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com'))
      ? currentItem.targetUrl
      : (itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId))
        ? `https://www.tiktok.com/@${cleanHandle}/video/${itemMedia.videoId}`
        : `https://www.tiktok.com/@${cleanHandle}`;

    // Bắt đầu Tab Tracker trước khi mở TikTok
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();

    if (typeof window !== 'undefined') {
      try { window.open(videoTikTokUrl, '_blank'); } catch (err) { console.warn('Could not open TikTok video tab:', err); }
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'like',
      itemId: currentItem.id,
      tiktokUrl: videoTikTokUrl,
      coinsToEarn: 100,
      label: `Thả ❤️ tim video @${cleanHandle} trên TikTok`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['like'] * 1000
    });
    showToast('❤️ Đã mở video TikTok! Thả tim xong (đợi 30s), bấm XÁC NHẬN để nhận +100 Xu.');
  };


  // ═══════════════════════════════════════════════════════════════
  // XÁC MINH ANTI-FRAUD: Kiểm tra bằng chứng trước khi cộng Xu
  // ═══════════════════════════════════════════════════════════════
  const handleConfirmVerification = async () => {
    if (!pendingVerification) return;
    if (confirmCountdown > 0) {
      showToast(`⏳ Chờ thêm ${formatCountdown(confirmCountdown)} nữa mới được xác nhận!`);
      return;
    }

    const pv = pendingVerification;
    const userHandle = user.tiktokConnected || user.email || '@user';

    // ── LẤY BẰNG CHỨNG TỪ TAB TRACKER ──
    const tabStats = tabTrackerRef.current.stop();
    const proof = {
      action: pv.action as FraudActionType,
      taskId: pv.itemId,
      userHandle,
      tiktokUrl: pv.tiktokUrl,
      openedAt: pv.openedAt,
      confirmedAt: Date.now(),
      tabTimeSpentMs: tabStats.totalHiddenMs,
      tabLeftCount: tabStats.tabLeftCount,
      fraudFlags: [] as string[],
      isValid: false,
      fraudScore: 0
    };

    // ── KIỂM TRA CHỐNG GIAN LẬN ──
    const fraudCheck = checkFraudProof(proof);

    if (!fraudCheck.allowed) {
      // Gian lận phát hiện → từ chối, trừ điểm tin cậy
      if (fraudCheck.flags.length > 0 && !fraudCheck.waitMoreMs) {
        applyFraudPenalty(userHandle, fraudCheck.fraudScore, fraudCheck.flags);
      }
      setInModalAlert({
        message: fraudCheck.reason,
        sub: fraudCheck.waitMoreMs
          ? `🔒 Nút xác nhận sẽ mở sau: ${formatCountdown(fraudCheck.waitMoreMs)}`
          : `⚠️ Điểm tin cậy bị trừ. Hãy thực hiện thao tác thật trên TikTok.`
      });
      // Không đóng banner - để user có thể thử lại sau
      return;
    }

    // ── XÁC MINH HỢP LỆ - TIẾN HÀNH CỘP XU ──
    setPendingVerification(null);
    setSyncingAction(pv.action);
    try {
      let res: { success: boolean; coinsEarned?: number; txHash?: string; message: string };
      if (pv.action === 'like') {
        res = await syncTikTokLike(pv.itemId, userHandle);
      } else if (pv.action === 'comment') {
        res = await syncTikTokComment(pv.itemId, pv.commentText || '', userHandle);
      } else if (pv.action === 'share') {
        res = syncShareToFacebook(pv.tiktokUrl, currentItem.channelHandle, userHandle);
      } else {
        res = { success: true, coinsEarned: pv.coinsToEarn, message: '✅ Xác nhận thành công!', txHash: 'VERIFIED' };
      }

      if (res.success) {
        const actionKey = pv.action as 'like' | 'comment' | 'share';
        const alreadyClaimed = taskClaimedMap[pv.itemId]?.[actionKey];
        if (!alreadyClaimed) {
          const reward = claimTaskAction(pv.itemId, actionKey);
          const earned = reward || res.coinsEarned || pv.coinsToEarn;
          setSessionCoinsEarned(prev => prev + earned);
          setTaskClaimedMap(prev => ({
            ...prev,
            [pv.itemId]: { ...(prev[pv.itemId] || {}), [actionKey]: true }
          }));
          // Tăng điểm tin cậy sau hành động hợp lệ
          applySuccessReward(userHandle);
          const trustProfile = getTrustProfile(userHandle);
          const badge = getTrustScoreBadge(trustProfile.trustScore);
          const actionEmoji = pv.action === 'like' ? '❤️' : pv.action === 'comment' ? '💬' : '🔗';
          setInModalAlert({
            message: `${actionEmoji} Xác minh thành công! Đã cộng +${earned} Xu vào ví!`,
            sub: `${pv.label} • ${badge.emoji} Tin cậy: ${trustProfile.trustScore}/100 • Mã: ${res.txHash || 'VERIFIED-OK'}`
          });
          showToast(`${actionEmoji} +${earned} Xu! Tin cậy: ${trustProfile.trustScore}/100 ${badge.emoji}`);
        } else {
          showToast('✅ Đã xác minh! (Bạn đã nhận thưởng trước đó rồi)');
        }
      } else {
        setInModalAlert({ message: res.message });
        showToast(res.message);
      }
    } finally {
      setSyncingAction(null);
    }
  };

  const handleCancelVerification = () => {
    tabTrackerRef.current.stop();
    setPendingVerification(null);
    showToast('❌ Đã huỷ xác minh. Bạn cần thực hiện thao tác thật trên TikTok trước.');
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

  // 1-CLICK BÌNH LUẬN THẬT - COPY VÀO CLIPBOARD + MỞ VIDEO TIKTOK + XÁC MINH ANTI-FRAUD
  const handleCommentAction = async (commentText: string) => {
    const text = commentText.trim();
    if (!text) return;
    if (syncingAction) return;

    const userHandle = user.tiktokConnected || user.email || '@user';
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận.`, sub: blockStatus.reason });
      return;
    }

    setCustomComment('');
    setShowCommentInput(false);

    const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const videoTikTokUrl = (currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com'))
      ? currentItem.targetUrl
      : (itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId))
        ? `https://www.tiktok.com/@${cleanHandle}/video/${itemMedia.videoId}`
        : `https://www.tiktok.com/@${cleanHandle}`;

    // 1. Tự động đính kèm Hashtag Sàn #AVALIVE + Hashtag Chiến Dịch để xác thực nguồn tương tác thật
    const cleanHandleTag = cleanHandle.replace(/[^a-zA-Z0-9_]/g, '');
    const requiredHashtags = `#AVALIVE #${cleanHandleTag}`;
    const fullCommentText = text.includes('#AVALIVE') ? text : `${text} ${requiredHashtags}`;

    // 2. Copy bình luận hoàn chỉnh kèm hashtag vào clipboard để user dán thẳng trên TikTok
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullCommentText);
        showToast('📋 Đã sao chép bình luận & Hashtag xác thực! Đang mở TikTok để dán...');
      }
    } catch {
      showToast('📋 Hãy dán bình luận: "' + fullCommentText.slice(0, 30) + '..."');
    }


    // 2. Bắt đầu Tab Tracker + Mở TikTok
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();
    if (typeof window !== 'undefined') {
      try { window.open(videoTikTokUrl, '_blank'); } catch (err) { console.warn('Could not open TikTok tab:', err); }
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'comment',
      itemId: currentItem.id,
      tiktokUrl: videoTikTokUrl,
      commentText: text,
      coinsToEarn: 200,
      label: `Bình luận thật trên video @${cleanHandle}`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['comment'] * 1000
    });
  };


  // 1-CLICK CHIA SẺ THẬT - WEB SHARE API + MỞ FACEBOOK/TIKTOK + XÁC MINH ANTI-FRAUD
  const handleShareAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const userHandle = user.tiktokConnected || user.email || '@user';
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận.`, sub: blockStatus.reason });
      return;
    }

    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const targetUrl = (currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com'))
      ? currentItem.targetUrl
      : `https://www.tiktok.com/@${cleanHandle}`;
    const shareTitle = currentItem.title || `Kênh TikTok @${cleanHandle}`;
    const shareText = `🔥 Xem video hot của @${cleanHandle} trên TikTok! ${targetUrl}`;

    // 1. Bắt đầu Tab Tracker
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();

    // 2. Thử dùng Web Share API thật (hỗ trợ trên mobile)
    let sharedNatively = false;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: targetUrl });
        sharedNatively = true;
      } catch (err) { console.warn('Web Share cancelled or failed:', err); }
    }

    // 3. Nếu không share native được, mở Facebook share URL
    if (!sharedNatively) {
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}&quote=${encodeURIComponent(shareText)}`;
      if (typeof window !== 'undefined') {
        try { window.open(fbShareUrl, '_blank', 'width=600,height=450'); } catch (err) { console.warn('Could not open Facebook share:', err); }
      }
    }

    if (currentClaimed.share) {
      tabTrackerRef.current.stop();
      showToast('🔗 Bạn đã chia sẻ video này rồi!');
      return;
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'share',
      itemId: currentItem.id,
      tiktokUrl: targetUrl,
      coinsToEarn: 240,
      label: `Chia sẻ video @${cleanHandle} lên mạng xã hội`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['share'] * 1000
    });
    showToast('🔗 Đã mở chia sẻ! Đợi 20s rồi xác nhận để nhận +240 Xu.');
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

  if (!isFeedRunnerOpen) return null;

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
        {/* Realtime TikTok Safe Sync Floating Badge */}
        {syncingAction && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-black/90 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-150">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
            <span>Đang đồng bộ {syncingAction === 'follow' ? 'Follow kênh' : syncingAction === 'like' ? 'Thả tim' : syncingAction === 'comment' ? 'Bình luận' : 'Chia sẻ'} TikTok...</span>
          </div>
        )}

        {/* In-Modal Alert Notification (Hiển thị to rõ ngay trên điện thoại) */}
        {inModalAlert && (
          <div className="absolute top-14 inset-x-3 z-50 p-3 rounded-2xl bg-black/95 border border-emerald-500/80 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2.5 animate-in slide-in-from-top-3 duration-200 pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white leading-tight truncate">{inModalAlert.message}</div>
                {inModalAlert.sub && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inModalAlert.sub}</div>}
              </div>
            </div>
            <button
              onClick={() => setInModalAlert(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white shrink-0 active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ===== PENDING VERIFICATION BANNER - Xác Minh Tương Tác Thật TikTok ===== */}
        {pendingVerification && (
          <div className="absolute inset-x-0 bottom-0 z-[60] animate-in slide-in-from-bottom duration-300 pointer-events-auto">
            <div className="mx-2 mb-2 p-4 rounded-3xl bg-gradient-to-b from-[#0E1322] to-[#06080F] border border-amber-400/60 shadow-2xl backdrop-blur-xl space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 animate-pulse">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-300 font-display flex items-center gap-1.5">
                      ⏳ Chờ Xác Minh Thật Trên TikTok
                    </span>
                    {confirmCountdown > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold">
                        🔒 Đợi: {formatCountdown(confirmCountdown)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {pendingVerification.label}
                  </div>
                </div>
              </div>

              {/* Instruction */}
              <div className="text-xs text-slate-300 font-mono leading-relaxed bg-black/40 rounded-2xl p-3 border border-white/10 space-y-1.5">
                {pendingVerification.action === 'like' && (
                  <div>❤️ Thả <strong className="text-rose-400">tim</strong> vào video trên TikTok vừa mở, đợi tối thiểu <strong className="text-amber-300">30s</strong> rồi quay lại bấm <strong className="text-emerald-400">Xác Nhận</strong> để nhận <strong className="text-neonGold">+100 Xu</strong>.</div>
                )}
                {pendingVerification.action === 'comment' && (
                  <div>💬 Dán bình luận đã copy kèm hashtag <strong className="text-cyan-400">#AVALIVE</strong> (<strong className="text-cyan-300">Ctrl+V</strong>) vào ô bình luận TikTok → gửi. Chờ tối thiểu <strong className="text-amber-300">60s</strong> rồi quay lại bấm <strong className="text-emerald-400">Xác Nhận</strong> (+200 Xu).</div>
                )}
                {pendingVerification.action === 'share' && (
                  <div>🔗 Chia sẻ video lên <strong className="text-blue-400">Facebook</strong> hoặc mạng xã hội. Chờ tối thiểu <strong className="text-amber-300">20s</strong> rồi bấm <strong className="text-emerald-400">Xác Nhận</strong> (+240 Xu).</div>
                )}
                <div className="text-[9px] text-slate-400 flex flex-col gap-0.5 pt-1 border-t border-white/5">
                  <span className="text-emerald-300 font-bold">🛡️ Cơ chế Bảo Chứng 7 Ngày (7-Day Escrow):</span>
                  <span>Xu nhiệm vụ được bảo lưu trong ví bảo chứng 7 ngày để đảm bảo tính minh bạch & tự động thanh toán.</span>
                </div>
              </div>


              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancelVerification(); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  ✕ Huỷ
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleConfirmVerification(); }}
                  disabled={!!syncingAction || confirmCountdown > 0}
                  className={`flex-[2] py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                    confirmCountdown > 0
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white active:scale-[0.98]'
                  }`}
                >
                  {syncingAction ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xác minh...</span>
                    </>
                  ) : confirmCountdown > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Mở khóa sau {formatCountdown(confirmCountdown)}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✅ Tôi đã làm xong → Nhận +{pendingVerification.coinsToEarn} Xu</span>
                    </>
                  )}
                </button>
              </div>


              {/* Re-open TikTok link */}
              <button
                onClick={(e) => { e.stopPropagation(); window.open(pendingVerification.tiktokUrl, '_blank'); }}
                className="w-full text-center text-[10px] text-slate-500 hover:text-amber-400 font-mono transition-colors cursor-pointer"
              >
                🔗 Mở lại TikTok: {pendingVerification.tiktokUrl.replace('https://', '')}
              </button>
            </div>
          </div>
        )}

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
                const userHandle = user.tiktokConnected || user.email || '@user';
                const trust = getTrustProfile(userHandle);
                const badge = getTrustScoreBadge(trust.trustScore);
                return (
                  <div 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono backdrop-blur-md cursor-pointer hover:border-white/30 transition-all"
                    title={`Điểm uy tín: ${trust.trustScore}/100 - Đã hoàn thành ${trust.totalActions} nhiệm vụ hợp lệ`}
                  >
                    <span>{badge.emoji}</span>
                    <span className="font-bold text-white font-mono">{trust.trustScore}</span>
                    <span className={`text-[9px] font-bold ${
                      badge.colorClass === 'emerald' ? 'text-emerald-400' :
                      badge.colorClass === 'cyan' ? 'text-cyan-400' :
                      badge.colorClass === 'yellow' ? 'text-yellow-400' :
                      badge.colorClass === 'orange' ? 'text-orange-400' : 'text-rose-400'
                    }`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })()}

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
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = nextMuted;
                  }
                  showToast(nextMuted ? '🔇 Đã tắt âm thanh' : '🔊 Đã bật âm thanh video sống động');
                }}
                className="w-10 h-10 rounded-full bg-black/80 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 active:scale-90 flex items-center justify-center shadow-lg shrink-0"
                title={isMuted ? 'Bấm để bật âm thanh' : 'Bấm để tắt tiếng'}
              >
                {isMuted ? <VolumeX className="h-4.5 w-4.5 text-rose-400" /> : <Volume2 className="h-4.5 w-4.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={closeFeedRunner}
                className="w-10 h-10 rounded-full bg-black/80 hover:bg-rose-600 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20 active:scale-90 flex items-center justify-center shadow-lg shrink-0"
                title="Thoát khỏi trình lướt video"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
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
            if (safeFeed.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm select-none">
                  <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white font-display">Chưa Có Chiến Dịch Nào Đang Chạy</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Toàn bộ video &amp; phiên live demo đã được làm sạch. Bạn có thể tạo chiến dịch mới để phát trên Feed hoặc quay lại sau!
                    </p>
                  </div>
                </div>
              );
            }

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
                  poster={currentItem.channelAvatar}
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

            // C. Kênh TikTok: Phát video nền sắc nét kèm Card kênh chính thức (Không bị màn hình đen/tĩnh)
            if (itemMedia.isTikTok) {
              const cleanHandle = (currentItem.channelHandle || itemMedia.handle || '@tiktok').replace(/^@+/, '');
              const localSamples = ['/videos/sample1.mp4', '/videos/sample2.mp4', '/videos/sample3.mp4'];
              const sampleSrc = currentItem.videoUrl || localSamples[Math.abs(cleanHandle.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % localSamples.length];

              return (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <DirectVideoPlayer
                    key={currentItem.id + '_video_bg'}
                    src={sampleSrc}
                    poster={currentItem.channelAvatar}
                    autoPlay
                    isMuted={isMuted}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />
                </div>
              );
            }

            // D. Fallback cuối cùng
            const fallbackSrc = currentItem.videoUrl || itemMedia.streamUrl || '/videos/sample1.mp4';
            return (
              <DirectVideoPlayer
                key={currentItem.id + '_fallback'}
                src={fallbackSrc}
                poster={currentItem.channelAvatar}
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
              {currentItem.type === 'multi_target' || currentItem.type === 'combo' || (currentItem.title || '').toLowerCase().includes('combo') ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono font-black text-amber-300 uppercase">Nhiệm vụ: Combo Đa Tương Tác (+400 Xu)</span>
                </>
              ) : currentItem.type === 'follow' ? (
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
              ) : isLiveItem ? (
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
            <div className="flex items-center gap-2 flex-wrap">
              <div 
                onClick={handleOpenTikTokApp}
                className="flex items-center gap-1.5 cursor-pointer group"
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

              <button
                type="button"
                onClick={handleOpenTikTokApp}
                className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Mở ứng dụng hoặc trang web TikTok thật của kênh này"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Mở TikTok</span>
              </button>
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

          {/* Right Action Bar (Chỉ hiển thị trên Video Thường, ẩn khi Livestream hoặc Embed để không đè màn hình, chỉ hiện DUY NHẤT 1 nút tương ứng với loại chiến dịch) */}
          {playerMode !== 'embed' && !isLiveItem && (
            <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center gap-3.5 pointer-events-auto animate-in fade-in duration-300">
              {/* Creator Avatar with Follow Plus Badge (Hiện khi Follow hoặc Combo) */}
              {(targetCampaignAction === 'follow' || targetCampaignAction === 'combo' || targetCampaignAction === 'multi_target') && (
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
              )}

              {/* Like Button (Hiện khi Like hoặc Combo) */}
              {(targetCampaignAction === 'like' || targetCampaignAction === 'combo' || targetCampaignAction === 'multi_target') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeAction();
                  }}
                  className="flex flex-col items-center gap-0.5 group cursor-pointer"
                  title="Thả tim video nhận +100 Xu"
                >
                  <div className={`p-2 rounded-full transition-transform duration-200 active:scale-125 ${
                    currentClaimed.like ? 'text-[#FE2C55]' : 'text-white/90 hover:text-white'
                  }`}>
                    <Heart className={`h-7 w-7 drop-shadow-lg ${currentClaimed.like ? 'fill-[#FE2C55]' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/90 drop-shadow-md">
                    {currentClaimed.like ? 'Đã Tim' : '+100'}
                  </span>
                </button>
              )}

              {/* Comment Button (Hiện khi Comment hoặc Combo) */}
              {(targetCampaignAction === 'comment' || targetCampaignAction === 'combo' || targetCampaignAction === 'multi_target') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommentInput(!showCommentInput);
                  }}
                  className="flex flex-col items-center gap-0.5 group cursor-pointer"
                  title="Bình luận video nhận +200 Xu"
                >
                  <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-125">
                    <MessageCircle className={`h-7 w-7 drop-shadow-lg ${currentClaimed.comment ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/90 drop-shadow-md">
                    {currentClaimed.comment ? 'Đã Cmt' : '+200'}
                  </span>
                </button>
              )}

              {/* Share Button (Chỉ hiện khi chiến dịch là Share / Chia sẻ) */}
              {targetCampaignAction === 'share' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareAction();
                  }}
                  className="flex flex-col items-center gap-0.5 group cursor-pointer"
                  title="Chia sẻ video nhận +240 Xu"
                >
                  <div className="p-2 rounded-full text-white/90 hover:text-white transition-transform duration-200 active:scale-125">
                    <Share2 className="h-7 w-7 drop-shadow-lg" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/90 drop-shadow-md">
                    {currentClaimed.share ? 'Đã Share' : '+240'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Quick Comment Input Drawer */}
          {showCommentInput && (
            <div 
              className="absolute inset-x-0 bottom-0 z-40 p-4 bg-black/95 border-t border-cyan-500/40 backdrop-blur-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> Gửi Bình Luận TikTok Thật (+200 Xu)
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowCommentInput(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Nhập nội dung bình luận..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCommentAction(customComment);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleCommentAction(customComment)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1 shadow-lg active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </div>

              {/* Gợi ý bình luận nhanh */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {sampleComments.map((cmt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomComment(cmt);
                      handleCommentAction(cmt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 text-[10px] font-mono whitespace-nowrap transition-all"
                  >
                    "{cmt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* QUICK IN-APP TASK INTERACTION DECK (TẬP TRUNG 1 HÀNH ĐỘNG DUY NHẤT THEO LOẠI CHIẾN DỊCH) */}
        <div className="p-2.5 bg-[#080B14] border-t border-white/10 text-xs font-mono shrink-0">
          {/* COMBO ĐA MỤC TIÊU: Render cụm nút Follow + Thả Tim + Bình Luận */}
          {(targetCampaignAction === 'combo' || targetCampaignAction === 'multi_target' || (currentItem.title || '').toLowerCase().includes('combo')) && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-neonGold font-bold px-1">
                <span>⭐ NHIỆM VỤ COMBO: HOÀN THÀNH CÁC BƯỚC ĐỂ NHẬN ĐỦ XU</span>
                <span>+{currentItem.rewardCoins || 400} Xu</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={handleFollowAction}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer shadow-md ${
                    currentClaimed.follow
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95'
                  }`}
                >
                  {currentClaimed.follow ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 stroke-[3]" />}
                  <span>{currentClaimed.follow ? 'Đã Follow' : 'Follow (+200)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLikeAction}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer shadow-md ${
                    currentClaimed.like
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:opacity-90 active:scale-95'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${currentClaimed.like ? 'fill-pink-400' : ''}`} />
                  <span>{currentClaimed.like ? 'Đã Tim' : 'Thả Tim (+100)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentInput(!showCommentInput)}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer shadow-md ${
                    currentClaimed.comment
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 active:scale-95'
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>{currentClaimed.comment ? 'Đã Cmt' : 'Bình Luận (+200)'}</span>
                </button>
              </div>
            </div>
          )}

          {targetCampaignAction === 'follow' && !(currentItem.title || '').toLowerCase().includes('combo') && (
            <button 
              type="button"
              onClick={handleFollowAction} 
              className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer select-none text-xs shadow-lg ${
                currentClaimed.follow 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white active:scale-98'
              }`}
            >
              {currentClaimed.follow ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
              <span>{currentClaimed.follow ? '✓ ĐÃ FOLLOW KÊNH (+200 XU VÀO VÍ)' : 'THEO DÕI / FOLLOW KÊNH NÀY (+200 XU)'}</span>
            </button>
          )}

          {targetCampaignAction === 'like' && !(currentItem.title || '').toLowerCase().includes('combo') && (
            <button 
              type="button"
              onClick={handleLikeAction} 
              className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer select-none text-xs shadow-lg ${
                currentClaimed.like 
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40' 
                  : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white active:scale-98'
              }`}
            >
              <Heart className={`w-4 h-4 ${currentClaimed.like ? 'fill-pink-400 text-pink-400' : ''}`} />
              <span>{currentClaimed.like ? '✓ ĐÃ THẢ TIM VIDEO (+100 XU VÀO VÍ)' : 'THẢ TIM VIDEO NÀY (+100 XU)'}</span>
            </button>
          )}

          {targetCampaignAction === 'comment' && !(currentItem.title || '').toLowerCase().includes('combo') && (
            <button 
              type="button"
              onClick={() => setShowCommentInput(!showCommentInput)} 
              className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer select-none text-xs shadow-lg ${
                currentClaimed.comment 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white active:scale-98'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{currentClaimed.comment ? '✓ ĐÃ GỬI BÌNH LUẬN (+200 XU VÀO VÍ)' : 'BÌNH LUẬN VIDEO NÀY (+200 XU)'}</span>
            </button>
          )}

          {targetCampaignAction === 'share' && !(currentItem.title || '').toLowerCase().includes('combo') && (
            <button 
              type="button"
              onClick={handleShareAction} 
              className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all cursor-pointer select-none text-xs shadow-lg ${
                currentClaimed.share 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white active:scale-98'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>{currentClaimed.share ? '✓ ĐÃ CHIA SẺ VIDEO (+240 XU VÀO VÍ)' : 'CHIA SẺ VIDEO NÀY (+240 XU)'}</span>
            </button>
          )}

          {(targetCampaignAction === 'watch' || isLiveItem) && (
            <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-300 text-xs">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {isLiveItem ? 'Phiên Livestream Trực Tiếp' : 'Xem Video Kiếm Xu'}
              </span>
              <span className="text-neonGold font-bold">+{currentItem.rewardCoins || 200} Xu khi xem đủ</span>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar & Compact Next Button */}
        <div className="p-2.5 bg-[#0B0E17] border-t border-white/10 space-y-2">
          {/* Progress Timer Row */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-rose-500" />
              {isWatchRequired ? (
                timeLeft > 0 ? (
                  isLiveItem ? (
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>Xem Live Thật: <strong className="text-rose-400 font-bold">{Math.floor(timeLeft / 60)}p {timeLeft % 60}s</strong></span>
                      {!liveIsTabActive && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 animate-pulse">
                          ⚠️ Tạm dừng (Ẩn Tab)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      {currentItem.type === 'watch' && !currentItem.title?.toLowerCase().includes('tặng')
                        ? <>Xem Giữ Chân (40-60s): <strong className="text-rose-400 font-bold">{timeLeft}s</strong> còn lại</>
                        : <>Đang xem: <strong className="text-rose-400 font-bold">{timeLeft}s</strong> còn lại</>
                      }
                    </span>
                  )
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {isLiveItem ? 'Đã xem đủ phiên live (+Xu vào ví)!' : 'Đã đạt chỉ tiêu xem video (+200 Xu vào ví)!'}
                  </span>
                )
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-neonGold" /> Tự do làm nhiệm vụ &amp; lướt tiếp ngay!
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
                  <span>Tự lướt</span>
                </label>
              )}

              <span className="text-neonGold font-bold text-[11px]">
                +{sessionCoinsEarned.toLocaleString()} Xu
              </span>
            </div>
          </div>

          {/* Progress line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-1000"
              style={{ 
                width: isWatchRequired 
                  ? `${((Math.max(0, (isLiveItem ? (currentItem?.targetMinutes ? Math.round(currentItem.targetMinutes * 60) : 180) : 40) - timeLeft)) / Math.max(1, (isLiveItem ? (currentItem?.targetMinutes ? Math.round(currentItem.targetMinutes * 60) : 180) : 40))) * 100}%` 
                  : '100%' 
              }}
            />
          </div>

          {/* Sleek Compact Next Button */}
          <button
            onClick={handleNextItem}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-slate-800 hover:from-slate-700 to-slate-900 border border-white/15 text-white cursor-pointer active:scale-98 font-mono"
          >
            <span>Chiến dịch tiếp theo</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};


