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
import { verifyPlatformAccountForTask } from '../../services/platformProfileSyncService';
import { verifyYouTubeSubscription, verifyYouTubeVideoLike, verifyYouTubeComment } from '../../services/youtubeApiService';
import { verifyFacebookTaskAction } from '../../services/facebookApiService';


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
  platform?: 'tiktok' | 'youtube' | 'facebook';
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
    openFraudAppealModal,
    openConnect,
    isChannelFollowed,
    triggerImmediateFraudAlert
  } = useTikTokApp();

  const [filterMode, setFilterMode] = useState<'all' | 'missions' | 'cross_follow' | 'community' | 'partner' | 'live'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Khởi động muted=true để autoplay 100% trên Safari/Chrome Mobile & Desktop
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
    openedAt: number;               // Timestamp khi mở TikTok / Facebook / YouTube
    minConfirmAt: number;           // Thời điểm sớm nhất được bấm Confirm
    platform?: 'tiktok' | 'youtube' | 'facebook';
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
    !userCompletedActions?.[c.id] &&
    !(c.type === 'follow' && isChannelFollowed(c.channelHandle))
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
    
    const parsedInfo = parseMediaUrl(c.targetUrl, c.channelHandle);
    
    // Livestream: Nhận diện toàn diện mọi định dạng link live (TikTok / YouTube / Facebook Live / Mắt xem live)
    const isLive = !isMulti && !isFollow && !isLike && !isComment && !isShare && (
      c.type === 'livestream' || 
      c.type === 'livestream_viewers' || 
      c.type === 'mega_live' || 
      Boolean(c.livestreamMinutes) ||
      targetUrlLower.includes('/live') ||
      targetUrlLower.includes('livestream') ||
      parsedInfo.isLive
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
      isBoosted: c.isBoosted,
      platform: c.platform || (parsedInfo.platform as any) || (targetUrlLower.includes('facebook.com') ? 'facebook' : (targetUrlLower.includes('youtube.com') || targetUrlLower.includes('youtu.be')) ? 'youtube' : 'tiktok')
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
      // 0. Test item xem thử luôn đứng TOP #1
      if (a.id.startsWith('test_top1_') && !b.id.startsWith('test_top1_')) return -1;
      if (!a.id.startsWith('test_top1_') && b.id.startsWith('test_top1_')) return 1;

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
    channelAvatar: getTikTokAvatar(parseMediaUrl(feedRunnerTargetId).handle),
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
    isBoosted: true,
    platform: (parseMediaUrl(feedRunnerTargetId).platform as any) || 'tiktok'
  } : null;

  // 2. Toàn bộ Nhiệm Vụ Thật Từ Tasks & Livestream Tasks (Đồng bộ tức thì lên Feed, tự động ẩn khi đã làm)
  const tasksFeedItems: UnifiedFeedItem[] = (tasks || [])
    .filter(t => t.status === 'open' && (t.remainingSlots || 0) > 0 && !userCompletedActions?.[t.id] && !(t.type === 'follow' && isChannelFollowed(t.channelHandle)))
    .map(t => {
      const parsed = parseMediaUrl(t.targetUrl || t.videoPreviewUrl || '', t.channelHandle);
      const isLive = t.type === 'livestream' || parsed.isLive;
      return {
        id: t.id,
        kind: isLive ? 'livestream' : 'video',
        title: t.title,
        type: t.type,
        requiresWatch: t.requiresWatch || isLive,
        channelName: t.channelName || t.channelHandle,
        channelHandle: t.channelHandle,
        channelAvatar: t.channelAvatar || getTikTokAvatar(t.channelHandle),
        targetUrl: t.targetUrl,
        rewardCoins: t.rewardCoins,
        videoUrl: t.videoPreviewUrl || parsed.streamUrl,
        sampleComments: t.sampleComments || [
          'Ủng hộ kênh bạn nhé ❤️',
          'Nội dung rất hay và chất lượng!',
          'Đã tương tác đầy đủ cho kênh!'
        ],
        guide: t.guide || 'Tương tác thật 100% để nhận Xu thưởng vào ví.',
        campaignCategory: t.campaignCategory || 'partner',
        partnerName: t.partnerName || 'Chiến Dịch Đối Tác',
        partnerBadge: t.partnerBadge || (isLive ? '🔴 Live Thật' : 'Nhiệm Vụ Thật'),
        totalSlots: t.totalSlots,
        remainingSlots: t.remainingSlots,
        isUrgent: t.isUrgent,
        isBoosted: false,
        platform: t.platform || (parsed.platform as any) || (t.targetUrl?.includes('facebook.com') ? 'facebook' : (t.targetUrl?.includes('youtube.com') || t.targetUrl?.includes('youtu.be')) ? 'youtube' : 'tiktok')
      };
    });

  const liveTasksFeedItems: UnifiedFeedItem[] = (livestreamTasks || [])
    .filter(l => l.status === 'live' && !l.isLocked && !userCompletedActions?.[l.id])
    .map(l => ({
      id: l.id,
      kind: 'livestream',
      title: l.roomTitle || `🔴 LIVE STREAM: ${l.channelHandle}`,
      type: 'livestream',
      requiresWatch: true,
      channelName: l.channelName || l.channelHandle,
      channelHandle: l.channelHandle,
      channelAvatar: l.channelAvatar || getTikTokAvatar(l.channelHandle),
      targetUrl: l.targetUrl || `https://www.tiktok.com/@${(l.channelHandle || '').replace(/^@+/, '')}/live`,
      rewardCoins: l.totalRewardCoins || 500,
      videoUrl: l.targetUrl,
      sampleComments: [
        'Livestream cuốn quá bạn ơi!',
        'Đã thả tim và ủng hộ phiên live ❤️',
        'Chúc phiên live bùng nổ doanh số!'
      ],
      guide: `Xem phiên live ${l.targetMinutes || 3} phút để nhận +${(l.totalRewardCoins || 500).toLocaleString()} Xu.`,
      currentViewers: l.currentViewers || 1420,
      roomTitle: l.roomTitle,
      targetMinutes: l.targetMinutes || 3,
      campaignCategory: 'partner',
      partnerName: l.channelName || l.channelHandle,
      partnerBadge: '🔴 Live Thật 100%',
      totalSlots: 1000,
      remainingSlots: 999,
      isUrgent: true,
      isBoosted: true,
      platform: (l as any).platform || 'tiktok'
    }));

  const allRawFeedItems: UnifiedFeedItem[] = [
    ...(customTestItem ? [customTestItem] : []),
    ...createdCampaignFeedItems,
    ...tasksFeedItems,
    ...liveTasksFeedItems
  ].filter(i => {
    if (userCompletedActions?.[i.id]) return false;
    if (i.type === 'follow' && isChannelFollowed(i.channelHandle)) return false;
    return true;
  });

  // CHỈ HIỂN THỊ 100% CHIẾN DỊCH & NHIỆM VỤ THẬT ĐANG CHẠY (ĐỒNG BỘ 100% TỪ MỌI NỀN TẢNG)
  const allFeedDeduplicated = deduplicateAndSortFeed(allRawFeedItems);

  const missionsFeedDeduplicated = deduplicateAndSortFeed(
    allRawFeedItems.filter(i => i.kind === 'video')
  );

  const liveFeedDeduplicated = deduplicateAndSortFeed(
    allRawFeedItems.filter(i => i.kind === 'livestream')
  );

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
    channelAvatar: getTikTokAvatar('@avalive_official'),
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

  const isYouTubeItem = Boolean(currentItem?.type === 'youtube' || (currentItem as any)?.platform === 'youtube' || currentMediaInfo?.isYouTube);
  const isFacebookItem = Boolean(currentItem?.type === 'facebook' || (currentItem as any)?.platform === 'facebook' || currentMediaInfo?.isFacebook);
  const itemPlatform: 'youtube' | 'facebook' | 'tiktok' = isYouTubeItem ? 'youtube' : isFacebookItem ? 'facebook' : 'tiktok';
  const itemPlatformDisplayName = isYouTubeItem ? 'YouTube' : isFacebookItem ? 'Facebook' : 'TikTok';
  const itemPerformerAccount = itemPlatform === 'youtube'
    ? (user.youtubeConnected || 'Chưa kết nối')
    : itemPlatform === 'facebook'
      ? (user.facebookConnected || 'Chưa kết nối')
      : (user.tiktokConnected || 'Chưa kết nối');
  const isItemAccountConnected = Boolean(itemPerformerAccount && itemPerformerAccount !== 'Chưa kết nối' && !itemPerformerAccount.includes('chưa_kết_nối'));

  // Kiểm tra xem chiến dịch hiện tại có bắt buộc xem video / live không (Chỉ phiên live hoặc gói thuần xem view)
  const isWatchRequired = currentItem 
    ? (isLiveItem || (currentItem.type === 'watch' && currentItem.requiresWatch === true))
    : false;

  const isComboItem = targetCampaignAction === 'combo' || targetCampaignAction === 'multi_target' || (currentItem?.title || '').toLowerCase().includes('combo');

  // Xác định danh sách hành động người dùng cần thực hiện cho chiến dịch này
  const requiredActions: ('follow' | 'like' | 'comment' | 'share' | 'watch')[] = [];
  if (isLiveItem || currentItem?.type === 'watch') {
    requiredActions.push('watch');
  }
  if (isComboItem) {
    requiredActions.push('follow', 'like', 'comment');
  } else if (targetCampaignAction === 'follow') {
    requiredActions.push('follow');
  } else if (targetCampaignAction === 'like') {
    requiredActions.push('like');
  } else if (targetCampaignAction === 'comment') {
    requiredActions.push('comment');
  } else if (targetCampaignAction === 'share') {
    requiredActions.push('share');
  }

  const completedActionsCount = requiredActions.filter(act => currentClaimed[act]).length;
  const isAllActionsCompleted = requiredActions.length > 0 && completedActionsCount === requiredActions.length;

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

  const [isTabInactive, setIsTabInactive] = useState<boolean>(false);

  // Lắng nghe trạng thái Tab để đóng băng bộ đếm ngay khi user chuyển sang ứng dụng khác
  useEffect(() => {
    if (!isFeedRunnerOpen) return;
    const handleVisibilityChange = () => {
      const isHidden = typeof document !== 'undefined' && (document.hidden || (typeof document.hasFocus === 'function' && !document.hasFocus()));
      setIsTabInactive(isHidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isFeedRunnerOpen]);

  // Main timer countdown (chỉ đếm ngược khi có gói xem video / livestream - ĐÓNG BĂNG 100% KHI ẨN TAB HOẶC RỜI APP)
  useEffect(() => {
    if (!isFeedRunnerOpen || !isWatchRequired || timeLeft <= 0 || !isPlaying) return;
    const timer = setInterval(() => {
      // Đóng băng đếm ngược ngay lập tức nếu tab bị ẩn, chuyển tab, nhận cuộc gọi, đọc tin nhắn hoặc chuyển ứng dụng khác
      const isHidden = typeof document !== 'undefined' && (document.hidden || (typeof document.hasFocus === 'function' && !document.hasFocus()));
      if (isHidden) {
        setIsTabInactive(true);
        return;
      }
      setIsTabInactive(false);

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

  // When timer reaches 0 for pure video watch or livestream package, claim watch reward
  useEffect(() => {
    if (isWatchRequired && timeLeft === 0 && currentItem && !currentClaimed.watch && (isLiveItem || currentItem.type === 'watch')) {
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
        applySuccessReward(itemPerformerAccount || user.email || '@user');
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
    // Nếu chiến dịch có nhiệm vụ tương tác và người dùng chưa làm bất kỳ hành động nào
    if (!isWatchRequired && requiredActions.length > 0 && completedActionsCount === 0) {
      setInModalAlert({
        message: '⚠️ Chưa hoàn thành nhiệm vụ!',
        sub: `Vui lòng thực hiện ${isComboItem ? 'Đăng ký, Thích hoặc Bình luận' : (itemPlatform === 'youtube' ? 'Đăng Ký Kênh' : itemPlatform === 'facebook' ? 'Theo Dõi Fanpage' : 'Follow Kênh')} và bấm Nghiệm thu để nhận Xu trước khi chuyển tiếp!`
      });
      showToast('⚠️ Chưa hoàn thành, vui lòng kiểm tra và làm lại nhiệm vụ!');
      return;
    }

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
    let url = currentItem.targetUrl || currentItem.videoUrl || '';
    const cleanHandle = (currentItem.channelHandle || '').replace(/^@+/, '');

    if (itemPlatform === 'youtube') {
      if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        url = cleanHandle && !cleanHandle.includes('user') ? `https://www.youtube.com/@${cleanHandle}` : 'https://www.youtube.com';
      }
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
      showToast('🌐 Đang mở video/kênh YouTube chính thức...');
      return;
    }

    if (itemPlatform === 'facebook') {
      if (!url || (!url.includes('facebook.com') && !url.includes('fb.watch'))) {
        url = cleanHandle ? `https://www.facebook.com/${cleanHandle}` : 'https://www.facebook.com';
      }
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
      showToast('🌐 Đang mở bài viết/trang Facebook chính thức...');
      return;
    }

    if (!url || !url.includes('tiktok.com')) {
      url = `https://www.tiktok.com/@${cleanHandle}`;
    }
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    showToast(`🌐 Đang mở kênh TikTok chính thức: @${cleanHandle}`);
  };

  // 1-CLICK FOLLOW TRỰC TIẾP TRÊN WEB APP & ĐỒNG BỘ TIKTOK THẬT (CHUẨN ANTI-FRAUD)
  const handleFollowAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (syncingAction) return;

    const platCheck = verifyPlatformAccountForTask(itemPlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${itemPlatformDisplayName.toUpperCase()}: Vui lòng kết nối tài khoản chính chủ của bạn để nhận Xu!`);
      openConnect();
      return;
    }

    const userHandle = itemPerformerAccount;

    // ── Kiểm tra tài khoản có bị khóa không? ──
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      const unblockTime = blockStatus.unblockAt ? new Date(blockStatus.unblockAt).toLocaleTimeString('vi-VN') : 'sau 24h';
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận. Mở lại lúc ${unblockTime}.`, sub: blockStatus.reason });
      return;
    }

    if (currentClaimed.follow) {
      showToast(`✅ Bạn đã Follow kênh ${currentItem.channelHandle} rồi!`);
      return;
    }

    if (isChannelFollowed(currentItem.channelHandle)) {
      showToast(`ℹ️ Bạn đã từng theo dõi kênh ${currentItem.channelHandle} rồi. Tự động chuyển video tiếp theo!`);
      handleNextItem();
      return;
    }

    const cleanHandle = (currentItem.channelHandle || '').replace(/^@+/, '');
    let realChannelUrl = currentItem.targetUrl || '';
    if (itemPlatform === 'youtube') {
      if (currentItem.targetUrl && (currentItem.targetUrl.includes('youtube.com') || currentItem.targetUrl.includes('youtu.be'))) {
        realChannelUrl = currentItem.targetUrl;
      } else if (cleanHandle && !cleanHandle.includes('user') && !cleanHandle.includes('creator')) {
        realChannelUrl = `https://www.youtube.com/@${cleanHandle}`;
      } else {
        realChannelUrl = 'https://www.youtube.com';
      }
    } else if (itemPlatform === 'facebook') {
      if (currentItem.targetUrl && (currentItem.targetUrl.includes('facebook.com') || currentItem.targetUrl.includes('fb.watch'))) {
        realChannelUrl = currentItem.targetUrl;
      } else if (cleanHandle) {
        realChannelUrl = `https://www.facebook.com/${cleanHandle}`;
      } else {
        realChannelUrl = 'https://www.facebook.com';
      }
    } else {
      realChannelUrl = currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com/@')
        ? currentItem.targetUrl
        : `https://www.tiktok.com/@${cleanHandle}`;
    }

    // ── Bắt đầu theo dõi tab (phát hiện user có rời tab không) ──
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();

    if (typeof window !== 'undefined') {
      try { window.open(realChannelUrl, '_blank'); } catch (err) { console.warn('Could not open popup:', err); }
      if (itemPlatform === 'youtube') {
        const cleanTargetHandle = cleanHandle.trim();
        const cleanAccount = (user.youtubeConnected || '').replace(/^@+/, '').trim();
        if (cleanAccount) {
          localStorage.setItem(`yt_audit_${cleanAccount}_${cleanTargetHandle}_sub`, Date.now().toString());
          if (realChannelUrl) {
            const urlSlug = realChannelUrl.replace(/^https?:\/\/(www\.)?youtube\.com\//, '').replace(/^@+/, '').split('?')[0];
            localStorage.setItem(`yt_audit_${cleanAccount}_${urlSlug}_sub`, Date.now().toString());
            const vMatch = realChannelUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/i) || realChannelUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
            if (vMatch && vMatch[1]) {
              localStorage.setItem(`yt_audit_${cleanAccount}_${vMatch[1]}_sub`, Date.now().toString());
            }
          }
        }
      } else if (itemPlatform === 'facebook') {
        const cleanFbAccount = (user.facebookConnected || '').replace(/^@+/, '').trim();
        const targetClean = (realChannelUrl || currentItem.channelHandle || '').replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/^@+/, '').split('?')[0].split('/')[0];
        if (cleanFbAccount) {
          localStorage.setItem(`fb_audit_${cleanFbAccount}_${targetClean}_follow`, Date.now().toString());
          if (cleanHandle) {
            localStorage.setItem(`fb_audit_${cleanFbAccount}_${cleanHandle}_follow`, Date.now().toString());
          }
        }
      }
    }

    const openedAt = Date.now();
    const minConfirmAt = openedAt + MIN_CONFIRM_SECONDS['follow'] * 1000;

    setPendingVerification({
      action: 'follow',
      itemId: currentItem.id,
      tiktokUrl: realChannelUrl,
      platform: itemPlatform,
      coinsToEarn: 200,
      label: `${itemPlatform === 'youtube' ? 'Đăng Ký Kênh' : itemPlatform === 'facebook' ? 'Theo Dõi Kênh' : 'Follow Kênh'} @${cleanHandle} trên ${itemPlatformDisplayName}`,
      openedAt,
      minConfirmAt
    });

    showToast(`🌐 Đang mở ${itemPlatformDisplayName}! Bấm ${itemPlatform === 'youtube' ? 'Đăng Ký' : itemPlatform === 'facebook' ? 'Theo Dõi' : 'Follow'} kênh, đợi ${MIN_CONFIRM_SECONDS['follow']}s rồi bấm XÁC NHẬN để đối soát và nhận +200 Xu.`);
  };


  // 1-CLICK LIKE / THẢ TIM THẬT - MỞ ỨNG DỤNG THẬT + XÁC MINH ANTI-FRAUD + CỘNG XU
  const handleLikeAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (syncingAction) return;

    const platCheck = verifyPlatformAccountForTask(itemPlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${itemPlatformDisplayName.toUpperCase()}: Vui lòng kết nối tài khoản chính chủ của bạn để nhận Xu!`);
      openConnect();
      return;
    }

    const userHandle = itemPerformerAccount;
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
    
    let videoTargetUrl = currentItem.targetUrl || '';
    if (itemPlatform === 'youtube') {
      videoTargetUrl = (itemMedia.isYouTube && itemMedia.youtubeId)
        ? `https://www.youtube.com/watch?v=${itemMedia.youtubeId}`
        : (currentItem.targetUrl || 'https://www.youtube.com');
    } else if (itemPlatform === 'facebook') {
      videoTargetUrl = currentItem.targetUrl || (currentItem.channelHandle ? `https://www.facebook.com/${currentItem.channelHandle}` : 'https://www.facebook.com');
    } else {
      videoTargetUrl = (currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com'))
        ? currentItem.targetUrl
        : (itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId))
          ? `https://www.tiktok.com/@${cleanHandle}/video/${itemMedia.videoId}`
          : `https://www.tiktok.com/@${cleanHandle}`;
    }

    // Bắt đầu Tab Tracker trước khi mở ứng dụng
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();

    if (typeof window !== 'undefined') {
      try { window.open(videoTargetUrl, '_blank'); } catch (err) { console.warn('Could not open video tab:', err); }
      if (itemPlatform === 'youtube') {
        const cleanTargetVid = (videoTargetUrl || currentItem.targetUrl || currentItem.id).replace(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/, '').replace(/^https?:\/\/youtu\.be\//, '').split('&')[0];
        const cleanAccount = (user.youtubeConnected || '').replace(/^@+/, '').trim();
        if (cleanAccount) {
          localStorage.setItem(`yt_audit_like_${cleanAccount}_${cleanTargetVid}`, Date.now().toString());
        }
      } else if (itemPlatform === 'facebook') {
        const cleanFbAccount = (user.facebookConnected || '').replace(/^@+/, '').trim();
        const targetClean = (videoTargetUrl || currentItem.channelHandle || '').replace(/^https?:\/\/(www\.)?facebook\.com\//, '').replace(/^@+/, '').split('?')[0].split('/')[0];
        if (cleanFbAccount) {
          localStorage.setItem(`fb_audit_like_${cleanFbAccount}_${targetClean}`, Date.now().toString());
        }
      }
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'like',
      itemId: currentItem.id,
      tiktokUrl: videoTargetUrl,
      platform: itemPlatform,
      coinsToEarn: 100,
      label: `Thích / Thả ❤️ video @${cleanHandle} trên ${itemPlatformDisplayName}`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['like'] * 1000
    });
    showToast(`❤️ Đã mở video ${itemPlatformDisplayName}! Thả tim xong (đợi 30s), bấm XÁC NHẬN để nhận +100 Xu.`);
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
    const currentPlatform = pv.platform || itemPlatform;
    const userHandle = currentPlatform === 'youtube'
      ? (user.youtubeConnected || '@user')
      : currentPlatform === 'facebook'
        ? (user.facebookConnected || '@user')
        : (user.tiktokConnected || user.email || '@user');

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
      // Gian lận phát hiện → từ chối, trừ điểm tin cậy & hiển thị cảnh báo ngay lập tức
      if (fraudCheck.flags.length > 0 && !fraudCheck.waitMoreMs) {
        applyFraudPenalty(userHandle, fraudCheck.fraudScore, fraudCheck.flags);
        triggerImmediateFraudAlert({
          title: 'CẢNH BÁO PHÁT HIỆN GIAN LẬN',
          reason: fraudCheck.reason || 'Hệ thống phát hiện bạn vừa chuyển tab hoặc không thực hiện thao tác tương tác thực tế.',
          anomalyType: 'TAB_SWITCH_BOUNCE',
          channelHandle: currentItem.channelHandle,
          penaltyPoints: fraudCheck.fraudScore || 15
        });
      }
      setInModalAlert({
        message: `Chưa hoàn thành, vui lòng kiểm tra và làm lại: ${fraudCheck.reason}`,
        sub: fraudCheck.waitMoreMs
          ? `🔒 Nút xác nhận sẽ mở sau: ${formatCountdown(fraudCheck.waitMoreMs)}`
          : `⚠️ Điểm tin cậy bị trừ. Hãy thực hiện thao tác thật trên ứng dụng ${itemPlatformDisplayName}.`
      });
      showToast(`❌ Chưa hoàn thành, vui lòng kiểm tra và làm lại!`);
      // Không đóng banner - để user có thể thử lại sau
      return;
    }

    // ── XÁC MINH HỢP LỆ - TIẾN HÀNH CỘP XU ──
    setPendingVerification(null);
    setSyncingAction(pv.action);
    try {
      let res: { success: boolean; coinsEarned?: number; txHash?: string; message: string };
      if (currentPlatform === 'youtube') {
        const targetToVerify = pv.tiktokUrl || currentItem.targetUrl || currentItem.channelHandle;
        if (pv.action === 'follow') {
          const ytRes = await verifyYouTubeSubscription(targetToVerify, undefined, user.youtubeConnected);
          res = { success: ytRes.success, coinsEarned: 200, txHash: ytRes.txHash || 'YT_SUB', message: ytRes.message };
        } else if (pv.action === 'like') {
          const ytRes = await verifyYouTubeVideoLike(targetToVerify, undefined, user.youtubeConnected);
          res = { success: ytRes.success, coinsEarned: 100, txHash: ytRes.txHash || 'YT_LIKE', message: ytRes.message };
        } else if (pv.action === 'comment') {
          const ytRes = await verifyYouTubeComment(targetToVerify, user.youtubeConnected || '', 5, pv.commentText);
          res = { success: ytRes.success, coinsEarned: 200, txHash: ytRes.txHash || 'YT_CMT', message: ytRes.message };
        } else if (pv.action === 'share') {
          res = { success: true, coinsEarned: 240, txHash: 'YT_SHR', message: '✅ Đã xác nhận chia sẻ video YouTube!' };
        } else {
          res = { success: true, coinsEarned: pv.coinsToEarn, message: '✅ Xác nhận thành công!', txHash: 'VERIFIED' };
        }
      } else if (currentPlatform === 'facebook') {
        const targetToVerify = pv.tiktokUrl || currentItem.targetUrl || currentItem.channelHandle;
        const fbRes = await verifyFacebookTaskAction(pv.action, targetToVerify, user.facebookConnected || '', { commentText: pv.commentText });
        res = { success: fbRes.success, coinsEarned: pv.coinsToEarn, txHash: fbRes.txHash || 'FB_ACT', message: fbRes.message };
      } else {
        if (pv.action === 'follow') {
          res = await syncTikTokFollow(currentItem.channelHandle, userHandle);
        } else if (pv.action === 'like') {
          res = await syncTikTokLike(pv.itemId, userHandle);
        } else if (pv.action === 'comment') {
          res = await syncTikTokComment(pv.itemId, pv.commentText || '', userHandle);
        } else if (pv.action === 'share') {
          res = syncShareToFacebook(pv.tiktokUrl, currentItem.channelHandle, userHandle);
        } else {
          res = { success: true, coinsEarned: pv.coinsToEarn, message: '✅ Xác nhận thành công!', txHash: 'VERIFIED' };
        }
      }

      if (!res.success) {
        setInModalAlert({
          message: `❌ ${res.message.includes('Chưa hoàn thành') ? res.message : `Chưa hoàn thành, vui lòng kiểm tra và làm lại: ${res.message}`}`,
          sub: `Hệ thống kiểm tra chưa thấy tương tác từ tài khoản chính chủ [${userHandle}] trên ${itemPlatformDisplayName}!`
        });
        showToast(`❌ Chưa hoàn thành, vui lòng kiểm tra và làm lại!`);
        return;
      }

      const actionKey = pv.action as 'follow' | 'like' | 'comment' | 'share';
      const alreadyClaimed = taskClaimedMap[pv.itemId]?.[actionKey];
      if (!alreadyClaimed) {
        const reward = claimTaskAction(pv.itemId, actionKey);
        const earned = reward || res.coinsEarned || pv.coinsToEarn;
        setSessionCoinsEarned(prev => prev + earned);
        setTaskClaimedMap(prev => ({
          ...prev,
          [pv.itemId]: { ...(prev[pv.itemId] || {}), [actionKey]: true }
        }));
        if (pv.action === 'follow') {
          const cleanChannel = currentItem.channelHandle.replace(/^@+/, '');
          createFollowCommitment(userHandle, cleanChannel, earned, res.txHash || `${currentPlatform.toUpperCase()}_FOLLOW`);
        }
        // Tăng điểm tin cậy sau hành động hợp lệ
        applySuccessReward(userHandle);
        const trustProfile = getTrustProfile(userHandle);
        const badge = getTrustScoreBadge(trustProfile.trustScore);
        const actionEmoji = pv.action === 'follow' ? '👤' : pv.action === 'like' ? '❤️' : pv.action === 'comment' ? '💬' : '🔗';
        setInModalAlert({
          message: `${actionEmoji} Xác minh thành công! Đã cộng +${earned} Xu vào ví!`,
          sub: `${pv.label} • Tài khoản: ${userHandle} • ${badge.emoji} Tin cậy: ${trustProfile.trustScore}/100`
        });
        showToast(`${actionEmoji} +${earned} Xu! (Tài khoản: ${userHandle})`);
      } else {
        showToast('✅ Đã xác minh! (Bạn đã nhận thưởng trước đó rồi)');
      }
    } finally {
      setSyncingAction(null);
    }
  };

  // CƠ CHẾ BÙ NHIỆM VỤ ĐA THIẾT BỊ (XỬ LÝ KHI THIẾT BỊ GẶP HẠN CHẾ PHÁT VIDEO NỀN PHIÊN LIVE)
  const handleCompensateLiveTask = () => {
    if (!currentItem) return;
    const reward = claimTaskAction(currentItem.id, 'watch');
    const earned = reward || currentItem.rewardCoins || 300;
    setSessionCoinsEarned(prev => prev + earned);
    setTaskClaimedMap(prev => ({
      ...prev,
      [currentItem.id]: { ...(prev[currentItem.id] || {}), watch: true }
    }));
    showToast(`⚡ ĐÃ BÙ TIẾN ĐỘ NHIỆM VỤ: Bảo lưu & cộng +${earned} Xu vào ví thành công!`);
    setInModalAlert({
      message: `⚡ Đã bù nhiệm vụ phiên live (+${earned} Xu)`,
      sub: `Hệ thống đã nhận diện thiết bị và bảo lưu tiến độ cho tài khoản [${itemPerformerAccount}].`
    });
    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const liveUrl = currentItem.targetUrl && currentItem.targetUrl.startsWith('http')
      ? currentItem.targetUrl
      : `https://www.tiktok.com/@${cleanHandle}/live`;
    if (typeof window !== 'undefined') {
      window.open(liveUrl, '_blank');
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

  // 1-CLICK BÌNH LUẬN THẬT - COPY VÀO CLIPBOARD + MỞ ỨNG DỤNG THẬT + XÁC MINH ANTI-FRAUD
  const handleCommentAction = async (commentText: string) => {
    const text = commentText.trim();
    if (!text) return;
    if (syncingAction) return;

    const platCheck = verifyPlatformAccountForTask(itemPlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${itemPlatformDisplayName.toUpperCase()}: Vui lòng kết nối tài khoản chính chủ của bạn để nhận Xu!`);
      openConnect();
      return;
    }

    const userHandle = itemPerformerAccount;
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận.`, sub: blockStatus.reason });
      return;
    }

    setCustomComment('');
    setShowCommentInput(false);

    const itemMedia = parseMediaUrl(currentItem.targetUrl || currentItem.videoUrl || '', currentItem.channelHandle);
    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    
    let videoTargetUrl = currentItem.targetUrl || '';
    if (itemPlatform === 'youtube') {
      videoTargetUrl = (itemMedia.isYouTube && itemMedia.youtubeId)
        ? `https://www.youtube.com/watch?v=${itemMedia.youtubeId}`
        : (currentItem.targetUrl || 'https://www.youtube.com');
    } else if (itemPlatform === 'facebook') {
      videoTargetUrl = currentItem.targetUrl || (currentItem.channelHandle ? `https://www.facebook.com/${currentItem.channelHandle}` : 'https://www.facebook.com');
    } else {
      videoTargetUrl = (currentItem.targetUrl && currentItem.targetUrl.includes('tiktok.com'))
        ? currentItem.targetUrl
        : (itemMedia.videoId && /^\d{18,21}$/.test(itemMedia.videoId))
          ? `https://www.tiktok.com/@${cleanHandle}/video/${itemMedia.videoId}`
          : `https://www.tiktok.com/@${cleanHandle}`;
    }

    // 1. Tự động đính kèm Hashtag Sàn #AVALIVE + Hashtag Chiến Dịch để xác thực nguồn tương tác thật
    const cleanHandleTag = cleanHandle.replace(/[^a-zA-Z0-9_]/g, '');
    const requiredHashtags = `#AVALIVE #${cleanHandleTag}`;
    const fullCommentText = text.includes('#AVALIVE') ? text : `${text} ${requiredHashtags}`;

    // 2. Copy bình luận hoàn chỉnh kèm hashtag vào clipboard để user dán thẳng trên ứng dụng
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullCommentText);
        showToast(`📋 Đã sao chép bình luận & Hashtag xác thực! Đang mở ${itemPlatformDisplayName} để dán...`);
      }
    } catch {
      showToast('📋 Hãy dán bình luận: "' + fullCommentText.slice(0, 30) + '..."');
    }

    // 3. Bắt đầu Tab Tracker + Mở ứng dụng
    tabTrackerRef.current.reset();
    tabTrackerRef.current.start();
    if (typeof window !== 'undefined') {
      try { window.open(videoTargetUrl, '_blank'); } catch (err) { console.warn('Could not open tab:', err); }
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'comment',
      itemId: currentItem.id,
      tiktokUrl: videoTargetUrl,
      commentText: text,
      platform: itemPlatform,
      coinsToEarn: 200,
      label: `Bình luận thật trên ${itemPlatformDisplayName} @${cleanHandle}`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['comment'] * 1000
    });
  };


  // 1-CLICK CHIA SẺ THẬT - WEB SHARE API + MỞ NỀN TẢNG + XÁC MINH ANTI-FRAUD
  const handleShareAction = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const platCheck = verifyPlatformAccountForTask(itemPlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${itemPlatformDisplayName.toUpperCase()}: Vui lòng kết nối tài khoản chính chủ của bạn để nhận Xu!`);
      openConnect();
      return;
    }

    const userHandle = itemPerformerAccount;
    const blockStatus = isUserBlocked(userHandle);
    if (blockStatus.blocked) {
      setInModalAlert({ message: `🚫 Tài khoản bị tạm khóa do gian lận.`, sub: blockStatus.reason });
      return;
    }

    const cleanHandle = currentItem.channelHandle.replace(/^@+/, '');
    const targetUrl = currentItem.targetUrl || `https://www.tiktok.com/@${cleanHandle}`;
    const shareTitle = currentItem.title || `Nội dung ${itemPlatformDisplayName} @${cleanHandle}`;
    const shareText = `🔥 Xem nội dung hot của @${cleanHandle} trên ${itemPlatformDisplayName}! ${targetUrl}`;

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
      showToast('🔗 Bạn đã chia sẻ nội dung này rồi!');
      return;
    }

    const openedAt = Date.now();
    setPendingVerification({
      action: 'share',
      itemId: currentItem.id,
      tiktokUrl: targetUrl,
      platform: itemPlatform,
      coinsToEarn: 240,
      label: `Chia sẻ nội dung ${itemPlatformDisplayName} @${cleanHandle}`,
      openedAt,
      minConfirmAt: openedAt + MIN_CONFIRM_SECONDS['share'] * 1000
    });
    showToast(`🔗 Đã mở chia sẻ ${itemPlatformDisplayName}! Đợi 20s rồi xác nhận để nhận +240 Xu.`);
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


  const defaultFeedComments: Record<string, string[]> = {
    youtube: [
      'Nội dung video YouTube rất bổ ích và chất lượng! Đã Đăng ký kênh và Like ủng hộ bạn ❤️',
      'Video làm rất chỉn chu, âm thanh hình ảnh sắc nét. Chúc kênh YouTube sớm đạt Nút Vàng!',
      'Đã xem trọn vẹn và ủng hộ kênh! Mong bạn ra thêm nhiều video hay như này nhé.'
    ],
    facebook: [
      'Bài viết / Video rất ý nghĩa và giá trị! Đã Thích và Theo dõi Fanpage để cập nhật bài mới ❤️',
      'Nội dung chia sẻ rất thực tế và hữu ích. Chúc Trang ngày càng phát triển và nhiều tương tác!',
      'Đã like và chia sẻ bài viết! Fanpage đầu tư nội dung chất lượng quá.'
    ],
    tiktok: [
      'Nội dung chia sẻ cuốn thực sự, mong bạn ra thêm nhiều clip nữa nhé ❤️',
      'Đã theo dõi kênh và ủng hộ, chúc bạn sớm đạt 100k follow!',
      'Sản phẩm này dùng êm ru luôn ạ, cho mình xin link bio với shop ơi!'
    ]
  };

  const sampleComments = currentItem.sampleComments?.length 
    ? currentItem.sampleComments 
    : (defaultFeedComments[itemPlatform] || defaultFeedComments.tiktok);

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
        className="relative w-full h-[100dvh] sm:h-[92vh] sm:max-h-[820px] sm:max-w-[390px] sm:aspect-[9/16] sm:rounded-3xl bg-black border-0 sm:border border-white/20 shadow-2xl overflow-hidden flex flex-col mx-auto pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Realtime TikTok Safe Sync Floating Badge */}
        {syncingAction && (
          <div className="absolute top-[max(env(safe-area-inset-top,0px),4rem)] left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-black/90 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-150">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
            <span>Đang đồng bộ {syncingAction === 'follow' ? 'Follow kênh' : syncingAction === 'like' ? 'Thả tim' : syncingAction === 'comment' ? 'Bình luận' : 'Chia sẻ'} TikTok...</span>
          </div>
        )}

        {/* In-Modal Alert Notification (Hiển thị to rõ ngay trên điện thoại) */}
        {inModalAlert && (
          <div className="absolute top-[max(env(safe-area-inset-top,0px),3.5rem)] inset-x-3 z-50 p-3 rounded-2xl bg-black/95 border border-emerald-500/80 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-2.5 animate-in slide-in-from-top-3 duration-200 pointer-events-auto">
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
          <div className="absolute inset-x-0 bottom-0 z-[60] animate-in slide-in-from-bottom duration-300 pointer-events-auto pb-[max(env(safe-area-inset-bottom,0px),0.5rem)]">
            <div className="mx-2 mb-2 p-4 rounded-3xl bg-gradient-to-b from-[#0E1322] to-[#06080F] border border-amber-400/60 shadow-2xl backdrop-blur-xl space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 animate-pulse">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-300 font-display flex items-center gap-1.5">
                      ⏳ Chờ Xác Minh Thật Trên {itemPlatformDisplayName}
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
                {pendingVerification.action === 'follow' && (
                  <div>👤 Bấm <strong className="text-cyan-400">{itemPlatform === 'youtube' ? 'Đăng Ký' : itemPlatform === 'facebook' ? 'Theo Dõi' : 'Follow'}</strong> kênh trên {itemPlatformDisplayName} vừa mở, đợi tối thiểu <strong className="text-amber-300">10s</strong> rồi quay lại bấm <strong className="text-emerald-400">Xác Nhận</strong> (+200 Xu).</div>
                )}
                {pendingVerification.action === 'like' && (
                  <div>❤️ Thả <strong className="text-rose-400">tim / like</strong> vào video trên {itemPlatformDisplayName} vừa mở, đợi tối thiểu <strong className="text-amber-300">30s</strong> rồi quay lại bấm <strong className="text-emerald-400">Xác Nhận</strong> để nhận <strong className="text-neonGold">+100 Xu</strong>.</div>
                )}
                {pendingVerification.action === 'comment' && (
                  <div>💬 Dán bình luận đã copy {itemPlatform === 'tiktok' ? 'kèm hashtag #AVALIVE ' : ''}vào ô bình luận {itemPlatformDisplayName} → gửi. Chờ tối thiểu <strong className="text-amber-300">60s</strong> rồi quay lại bấm <strong className="text-emerald-400">Xác Nhận</strong> (+200 Xu).</div>
                )}
                {pendingVerification.action === 'share' && (
                  <div>🔗 Chia sẻ video / bài viết lên mạng xã hội. Chờ tối thiểu <strong className="text-amber-300">20s</strong> rồi bấm <strong className="text-emerald-400">Xác Nhận</strong> (+240 Xu).</div>
                )}
                <div className="text-[9px] text-slate-400 flex flex-col gap-0.5 pt-1 border-t border-white/5">
                  <span className="text-emerald-300 font-bold">🛡️ Cơ chế Nghiệm Thu Thật 100%:</span>
                  <span>Chỉ khi hệ thống kiểm tra và xác nhận tương tác thực tế từ tài khoản chính chủ, Xu mới được cộng vào ví.</span>
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


              {/* Re-open platform link */}
              <button
                onClick={(e) => { e.stopPropagation(); window.open(pendingVerification.tiktokUrl, '_blank'); }}
                className="w-full text-center text-[10px] text-slate-500 hover:text-amber-400 font-mono transition-colors cursor-pointer"
              >
                🔗 Mở lại {itemPlatformDisplayName}: {pendingVerification.tiktokUrl.replace('https://', '')}
              </button>
            </div>
          </div>
        )}

        {/* Top Header Floating Controls (Safe Area Notch / Dynamic Island) */}
        <div className="absolute top-0 inset-x-0 z-30 pt-[max(env(safe-area-inset-top,0px),0.75rem)] px-2.5 pb-2.5 sm:p-3 bg-gradient-to-b from-black/95 via-black/80 to-transparent space-y-2">
          {/* Top Row: Clean Minimal Header (Mute Toggle & Close) */}
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-white/80 backdrop-blur-md">
                {itemPlatform === 'youtube' ? (
                  <svg className="w-3.5 h-3.5 fill-red-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ) : itemPlatform === 'facebook' ? (
                  <svg className="w-3.5 h-3.5 fill-blue-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                ) : (
                  <svg className="w-3 h-3 fill-rose-500 shrink-0" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
                  </svg>
                )}
                <span className="font-bold text-white tracking-wide">{itemPlatformDisplayName} Video Runner</span>
                <span className="text-slate-400 font-bold">({currentIndex + 1}/{combinedFeed.length})</span>
              </span>

              {(() => {
                const userHandle = itemPerformerAccount || user.email || '@user';
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

          {/* Row 3: BADGE TÀI KHOẢN THỰC HIỆN NHIỆM VỤ THEO NỀN TẢNG (CHỐNG DÙNG SAI TÀI KHOẢN) */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-black/80 border border-cyan-500/40 backdrop-blur-md text-[11px] font-mono shadow-md">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                itemPlatform === 'youtube' ? 'bg-red-600 text-white' :
                itemPlatform === 'facebook' ? 'bg-blue-600 text-white' :
                'bg-zinc-800 text-pink-400 border border-pink-500/40'
              }`}>
                {itemPlatformDisplayName}
              </span>
              <span className="text-zinc-300 truncate">
                Tài khoản: <strong className={isItemAccountConnected ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{itemPerformerAccount}</strong>
              </span>
            </div>
            {!isItemAccountConnected ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openConnect(); }}
                className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shrink-0 animate-pulse cursor-pointer shadow"
              >
                Kết nối ngay
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 shrink-0 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Chính chủ
              </span>
            )}
          </div>
        </div>

        {/* Floating Inactive Tab Pause Alert Banner */}
        {isTabInactive && (
          <div className="absolute top-36 inset-x-3 z-40 p-3 rounded-2xl bg-amber-950/95 border-2 border-amber-500 shadow-2xl flex items-center gap-3 animate-pulse pointer-events-auto backdrop-blur-xl">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white font-black text-xs">⏸️ BỘ ĐẾM TẠM DỪNG (BẠN ĐÃ RỜI ỨNG DỤNG)</div>
              <div className="text-[10px] text-amber-200 mt-0.5 leading-tight">
                Thời gian làm nhiệm vụ chỉ được tính khi bạn mở trực tiếp trên màn hình. Hãy giữ ứng dụng mở để tiếp tục đếm giờ nhận Xu!
              </div>
            </div>
          </div>
        )}

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
                  onCompensate={handleCompensateLiveTask}
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

            // B. Kênh TikTok & Video TikTok: Phát video TikTok chính thức thật 100%
            if (itemMedia.isTikTok) {
              return (
                <TikTokVideoEmbedPlayer
                  key={currentItem.id + '_tt_' + (itemMedia.videoId || currentItem.channelHandle || currentItem.id)}
                  videoId={itemMedia.videoId}
                  directUrl={currentItem.targetUrl || currentItem.videoUrl}
                  title={currentItem.title}
                  isMuted={isMuted}
                />
              );
            }

            // C. Fallback cuối cùng: Trình phát TikTok thật hoặc Direct
            if (currentItem.targetUrl?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || currentItem.videoUrl?.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
              return (
                <DirectVideoPlayer
                  key={currentItem.id + '_fallback_direct'}
                  src={currentItem.videoUrl || currentItem.targetUrl}
                  poster={currentItem.channelAvatar}
                  autoPlay
                  isMuted={isMuted}
                  isPlaying={isPlaying}
                  onTogglePlay={togglePlay}
                />
              );
            }

            return (
              <TikTokVideoEmbedPlayer
                key={currentItem.id + '_fallback_tt'}
                videoId={itemMedia.videoId}
                directUrl={currentItem.targetUrl || currentItem.videoUrl}
                title={currentItem.title}
                isMuted={isMuted}
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
                  <span className="text-[10px] font-mono font-black text-neonGold uppercase">Nhiệm vụ: {itemPlatform === 'youtube' ? 'Đăng Ký Kênh' : itemPlatform === 'facebook' ? 'Theo Dõi Kênh' : 'Follow Kênh'} (+200 Xu)</span>
                </>
              ) : currentItem.type === 'watch' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono font-black text-cyan-300 uppercase">Nhiệm vụ: {itemPlatform === 'youtube' ? 'Xem Video YouTube' : itemPlatform === 'facebook' ? 'Xem Video Facebook' : 'Xem Đủ 15s'} (+200 Xu)</span>
                </>
              ) : currentItem.type === 'like' ? (
                <>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span className="text-[10px] font-mono font-black text-pink-300 uppercase">Nhiệm vụ: {itemPlatform === 'youtube' ? 'Thích Video' : itemPlatform === 'facebook' ? 'Thích Bài Viết' : 'Thả Tim Video'} (+100 Xu)</span>
                </>
              ) : currentItem.type === 'comment' ? (
                <>
                  <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] font-mono font-black text-purple-300 uppercase">Nhiệm vụ: {itemPlatform === 'youtube' ? 'Bình Luận YouTube' : itemPlatform === 'facebook' ? 'Bình Luận Facebook' : 'Viết Bình Luận'} (+200 Xu)</span>
                </>
              ) : currentItem.type === 'share' ? (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-mono font-black text-blue-300 uppercase">Nhiệm vụ: {itemPlatform === 'youtube' ? 'Chia Sẻ YouTube' : itemPlatform === 'facebook' ? 'Chia Sẻ Facebook' : 'Chia Sẻ Video'} (+240 Xu)</span>
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

            {/* Creator Handle + Verified Badge (Bấm để nhảy về đúng kênh TikTok/YouTube/Facebook của người dùng) */}
            <div className="flex items-center gap-2 flex-wrap">
              <div 
                onClick={handleOpenTikTokApp}
                className="flex items-center gap-1.5 cursor-pointer group"
                title={`Bấm để mở trang ${itemPlatform === 'youtube' ? 'YouTube' : itemPlatform === 'facebook' ? 'Facebook' : 'TikTok'} chính thức của kênh này`}
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
                title={`Mở ứng dụng hoặc trang web ${itemPlatform === 'youtube' ? 'YouTube' : itemPlatform === 'facebook' ? 'Facebook' : 'TikTok'} thật của kênh này`}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Mở {itemPlatform === 'youtube' ? 'YouTube' : itemPlatform === 'facebook' ? 'Facebook' : 'TikTok'}</span>
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
                  title={`Bấm avatar để ${itemPlatform === 'youtube' ? 'Đăng Ký' : itemPlatform === 'facebook' ? 'Theo Dõi' : 'Follow'} & nhận +200 Xu`}
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
                    title={currentClaimed.follow ? `Đã ${itemPlatform === 'youtube' ? 'Đăng ký' : itemPlatform === 'facebook' ? 'Theo dõi' : 'Follow'} trên hệ thống` : `Bấm ${itemPlatform === 'youtube' ? 'Đăng Ký' : itemPlatform === 'facebook' ? 'Theo Dõi' : 'Follow'} & nhận +200 Xu`}
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
                  title={`${itemPlatform === 'youtube' ? 'Thích video' : itemPlatform === 'facebook' ? 'Thích bài viết' : 'Thả tim video'} nhận +100 Xu`}
                >
                  <div className={`p-2 rounded-full transition-transform duration-200 active:scale-125 ${
                    currentClaimed.like ? 'text-[#FE2C55]' : 'text-white/90 hover:text-white'
                  }`}>
                    <Heart className={`h-7 w-7 drop-shadow-lg ${currentClaimed.like ? 'fill-[#FE2C55]' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white/90 drop-shadow-md">
                    {currentClaimed.like ? (itemPlatform === 'tiktok' ? 'Đã Tim' : 'Đã Thích') : '+100'}
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
                  title={`Bình luận ${itemPlatform === 'youtube' ? 'video YouTube' : itemPlatform === 'facebook' ? 'bài viết Facebook' : 'video TikTok'} nhận +200 Xu`}
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
                  title={`Chia sẻ ${itemPlatform === 'youtube' ? 'video YouTube' : itemPlatform === 'facebook' ? 'bài viết Facebook' : 'video TikTok'} nhận +240 Xu`}
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
                  <MessageCircle className="w-3.5 h-3.5" /> Gửi Bình Luận {itemPlatform === 'youtube' ? 'YouTube' : itemPlatform === 'facebook' ? 'Facebook' : 'TikTok'} Thật (+200 Xu)
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
                  <span>{currentClaimed.follow ? (itemPlatform === 'youtube' ? 'Đã Đăng Ký' : itemPlatform === 'facebook' ? 'Đã Theo Dõi' : 'Đã Follow') : (itemPlatform === 'youtube' ? 'Đăng Ký (+200)' : itemPlatform === 'facebook' ? 'Theo Dõi (+200)' : 'Follow (+200)')}</span>
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
                  <span>{currentClaimed.like ? (itemPlatform === 'tiktok' ? 'Đã Tim' : 'Đã Thích') : (itemPlatform === 'tiktok' ? 'Thả Tim (+100)' : 'Thích (+100)')}</span>
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
              <span>{currentClaimed.follow ? `✓ ĐÃ ${itemPlatform === 'youtube' ? 'ĐĂNG KÝ KÊNH' : itemPlatform === 'facebook' ? 'THEO DÕI TRANG' : 'FOLLOW KÊNH'} (+200 XU VÀO VÍ)` : `${itemPlatform === 'youtube' ? 'ĐĂNG KÝ KÊNH YOUTUBE NÀY' : itemPlatform === 'facebook' ? 'THEO DÕI FANPAGE / TRANG NÀY' : 'THEO DÕI / FOLLOW KÊNH NÀY'} (+200 XU)`}</span>
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
              <span>{currentClaimed.like ? `✓ ĐÃ ${itemPlatform === 'tiktok' ? 'THẢ TIM VIDEO' : itemPlatform === 'facebook' ? 'THÍCH BÀI VIẾT' : 'THÍCH VIDEO'} (+100 XU VÀO VÍ)` : `${itemPlatform === 'tiktok' ? 'THẢ TIM VIDEO NÀY' : itemPlatform === 'facebook' ? 'THÍCH BÀI VIẾT NÀY' : 'THÍCH VIDEO YOUTUBE NÀY'} (+100 XU)`}</span>
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
              <span>{currentClaimed.comment ? `✓ ĐÃ GỬI BÌNH LUẬN (+200 XU VÀO VÍ)` : `BÌNH LUẬN ${itemPlatform === 'youtube' ? 'VIDEO YOUTUBE' : itemPlatform === 'facebook' ? 'BÀI VIẾT FACEBOOK' : 'VIDEO NÀY'} (+200 XU)`}</span>
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
              <span>{currentClaimed.share ? `✓ ĐÃ CHIA SẺ (+240 XU VÀO VÍ)` : `CHIA SẺ ${itemPlatform === 'youtube' ? 'VIDEO YOUTUBE' : itemPlatform === 'facebook' ? 'BÀI VIẾT FACEBOOK' : 'VIDEO NÀY'} (+240 XU)`}</span>
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
              ) : isAllActionsCompleted ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Đã nghiệm thu &amp; hoàn thành nhiệm vụ!
                </span>
              ) : completedActionsCount > 0 ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Đã nghiệm thu {completedActionsCount}/{requiredActions.length} bước - Tiếp tục để nhận đủ Xu
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-neonGold" /> ⚠️ Chưa hoàn thành: Hãy làm nhiệm vụ &amp; bấm Nghiệm thu để nhận Xu
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
                  : `${requiredActions.length > 0 ? (completedActionsCount / requiredActions.length) * 100 : 0}%` 
              }}
            />
          </div>

          {/* Sleek Compact Next Button */}
          <button
            onClick={handleNextItem}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md border cursor-pointer active:scale-98 font-mono ${
              isAllActionsCompleted || (isWatchRequired && timeLeft === 0)
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 border-emerald-500/40 text-emerald-200 hover:brightness-110'
                : 'bg-gradient-to-r from-slate-800 hover:from-slate-700 to-slate-900 border-white/15 text-white'
            }`}
          >
            <span>Chiến dịch tiếp theo</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};


