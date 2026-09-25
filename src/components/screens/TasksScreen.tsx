import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Heart, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  BookOpen,
  Radio,
  Lock,
  Unlock,
  Users,
  Award,
  Zap,
  RefreshCw,
  Facebook,
  ExternalLink,
  X,
  Edit3,
  Play,
  LayoutGrid,
  Star,
  Bell,
  Rocket,
  Eye,
  Check,
  Building2,
  Tv,
  Film,
  PlusCircle,
  History
} from "lucide-react";
import { TikTokTaskItem, LivestreamTaskItem, CrossFollowItem } from "../../types";
import { useTikTokApp } from "../../context/TikTokAppContext";
import { FeatureGuideTooltip } from "../common/FeatureGuideTooltip";
import { WeeklyMissionsPanel } from "./WeeklyMissionsPanel";
import { INITIAL_CROSS_FOLLOW_ITEMS, TIER_CROSS_FOLLOW_QUOTAS } from "../../data/crossFollowData";
import { TokenSinkStrategyModal } from "../modals/TokenSinkStrategyModal";
import { parseMediaUrl, getTikTokAvatar } from "../../data/videoSources";
import { SmartMediaThumbnail } from "../common/SmartMediaThumbnail";
import { validateRealAccountName, verifyPlatformAccountForTask } from "../../services/platformProfileSyncService";

export const TasksScreen: React.FC<{ 
  darkMode: boolean; 
  onTaskCompleted?: (task: TikTokTaskItem) => void;
  onNavigate?: (screen: any) => void;
  onOpenCreateCampaign?: () => void;
}> = ({
  darkMode,
  onNavigate,
  onOpenCreateCampaign
}) => {
  const { 
    tasks, 
    livestreamTasks, 
    openRunner, 
    openLiveRunner, 
    openPolicy, 
    getUserLiveQuota,
    openFeedRunner,
    partnerAnnouncements,
    dismissPartnerAnnouncement,
    connectTikTok,
    connectFacebook,
    connectYoutube,
    user,
    boostCampaign,
    userCompletedActions,
    userNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    showToast,
    userMissions,
    recordMissionProgress,
    claimTaskAction,
    dailyBundle,
    claimDailyBundle,
    openTaskDetail,
    openDeposit,
    openShareModal,
    openOrderModal,
    openConnect,
    growthServices,
    campaigns,
    tasksActiveTab,
    setTasksActiveTab,
    isChannelFollowed,
    triggerImmediateFraudAlert,
    isUserTaskLocked,
    taskLockoutDetails
  } = useTikTokApp();

  // 5 TAB CHỨC NĂNG DẠNG LƯỚI HÀNG TRÊN CÙNG
  // 1. "missions": Làm nhiệm vụ ngày & tuần (tập trung toàn bộ nhiệm vụ)
  // 2. "watch_feed": Lướt video FYP liên tục tự động + lưới video ô vuông
  // 3. "livestreams": Xem livestream TikTok mắt thật
  // 4. "enterprise": Chiến dịch Doanh nghiệp ký quỹ Escrow
  // 5. "cross_follow": Follow chéo cộng đồng theo hạn mức cấp bậc
  const activeTab = tasksActiveTab;
  const setActiveTab = setTasksActiveTab;

  const [isTokenSinkModalOpen, setIsTokenSinkModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [boostConfirmTask, setBoostConfirmTask] = useState<TikTokTaskItem | null>(null);

  // Cross follow states & limits
  const [crossFollowItems, setCrossFollowItems] = useState<CrossFollowItem[]>(INITIAL_CROSS_FOLLOW_ITEMS);
  const [crossFollowUsedCount, setCrossFollowUsedCount] = useState<number>(12);
  const [crossFollowTypeFilter, setCrossFollowTypeFilter] = useState<"all" | "follow" | "watch" | "like" | "comment" | "share">("all");
  const [enterpriseFilter, setEnterpriseFilter] = useState<"all" | "follow" | "watch" | "like" | "comment" | "targeted">("all");
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'all' | 'missions' | 'live' | 'partner' | 'cross_follow'>('all');
  const [feedPlatformFilter, setFeedPlatformFilter] = useState<'all' | 'tiktok' | 'facebook' | 'youtube'>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showHistorySection, setShowHistorySection] = useState<boolean>(false);

  // Inline Quick Edit & Switch Account State (Thu gọn thanh trạng thái kết nối TikTok, Facebook, YouTube)
  const [editingTikTok, setEditingTikTok] = useState<boolean>(false);
  const [tempTikTokHandle, setTempTikTokHandle] = useState<string>(user.tiktokConnected || "");
  const [tempTikTokFollowers, setTempTikTokFollowers] = useState<number | string>(user.tiktokFollowers || 0);

  const [editingFacebook, setEditingFacebook] = useState<boolean>(false);
  const [tempFacebookUrl, setTempFacebookUrl] = useState<string>(user.facebookConnected || "");
  const [tempFacebookFollowers, setTempFacebookFollowers] = useState<number | string>(user.facebookFollowers || 0);

  const [editingYoutube, setEditingYoutube] = useState<boolean>(false);
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState<string>(user.youtubeConnected || "");
  const [tempYoutubeSubscribers, setTempYoutubeSubscribers] = useState<number | string>(user.youtubeSubscribers || 0);

  useEffect(() => {
    setTempTikTokHandle(user.tiktokConnected || "");
    setTempTikTokFollowers(user.tiktokFollowers || 0);
    setTempFacebookUrl(user.facebookConnected || "");
    setTempFacebookFollowers(user.facebookFollowers || 0);
    setTempYoutubeUrl(user.youtubeConnected || "");
    setTempYoutubeSubscribers(user.youtubeSubscribers || 0);
  }, [user.tiktokConnected, user.tiktokFollowers, user.facebookConnected, user.facebookFollowers, user.youtubeConnected, user.youtubeSubscribers]);

  // Kiểm tra hoàn thành toàn bộ Nhiệm Vụ Ngày để mở khóa Live Stream, Lướt Video & Follow Chéo
  const dailyMissions = userMissions?.filter(m => m.category === 'daily') || [];
  const dailyDoneCount = dailyMissions.filter(m => m.completedCount >= m.targetCount || m.status === 'claimed').length;
  const isDailyMissionsCompleted = dailyMissions.length > 0 ? (dailyDoneCount >= dailyMissions.length) : true;

  const handleOpenFeedRunner = (initialTaskId?: string) => {
    const platCheck = verifyPlatformAccountForTask('tiktok', user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI TIKTOK: Bạn cần liên kết kênh TikTok thật chính chủ trước khi làm nhiệm vụ kiếm Xu!`);
      openConnect();
      return;
    }
    if (!isDailyMissionsCompleted) {
      showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 'Làm Nhiệm Vụ' trước.`);
      setActiveTab("missions");
      return;
    }
    openFeedRunner(initialTaskId);
  };

  const handleOpenRunner = (task: TikTokTaskItem) => {
    const taskPlatform = task.platform || 'tiktok';
    const platCheck = verifyPlatformAccountForTask(taskPlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${taskPlatform.toUpperCase()}: Bạn cần liên kết tài khoản thật chính chủ trước khi làm nhiệm vụ kiếm Xu!`);
      openConnect();
      return;
    }
    if (!isDailyMissionsCompleted) {
      showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 'Làm Nhiệm Vụ' trước.`);
      setActiveTab("missions");
      return;
    }
    openRunner(task);
  };

  const handleOpenLiveRunner = (live: LivestreamTaskItem) => {
    const livePlatform = live.platform || 'tiktok';
    const platCheck = verifyPlatformAccountForTask(livePlatform, user);
    if (!platCheck.canExecute) {
      showToast(platCheck.reason || `⚠️ BẮT BUỘC KẾT NỐI ${livePlatform.toUpperCase()}: Bạn cần liên kết tài khoản thật chính chủ trước khi xem livestream nhận Xu!`);
      openConnect();
      return;
    }
    if (!isDailyMissionsCompleted) {
      showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 'Làm Nhiệm Vụ' trước.`);
      setActiveTab("missions");
      return;
    }
    openLiveRunner(live);
  };

  const currentTierQuota = TIER_CROSS_FOLLOW_QUOTAS[user.rankLevel] || TIER_CROSS_FOLLOW_QUOTAS["Đồng"];
  const quota = getUserLiveQuota();

  // Execute Cross Follow Action
  const handleExecuteCrossFollow = (item: CrossFollowItem) => {
    const ttValid = validateRealAccountName(user.tiktokConnected || '');
    if (!user.tiktokConnected || !user.tiktokConnected.trim() || user.tiktokConnected === '@chưa_kết_nối' || !ttValid.isValid) {
      showToast(ttValid.reason || `⚠️ BẮT BUỘC KẾT NỐI TIKTOK: Bạn cần liên kết kênh TikTok thật chính chủ trước khi tham gia Follow chéo!`);
      openConnect();
      return;
    }
    if (!isDailyMissionsCompleted) {
      showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 'Làm Nhiệm Vụ' trước.`);
      setActiveTab("missions");
      return;
    }
    if (item.type === 'follow' && isChannelFollowed(item.channelHandle)) {
      showToast(`ℹ️ Bạn đã từng theo dõi kênh ${item.channelHandle} trên hệ thống rồi.`);
      return;
    }

    if (crossFollowUsedCount >= currentTierQuota.dailyLimit) {
      showToast(`⚠️ KỊCH TRẦN HẠN MỨC: Bạn đã dùng ${currentTierQuota.dailyLimit}/${currentTierQuota.dailyLimit} lượt của Hạng ${user.rankLevel}! Hãy mua thêm hạn mức (+20 lượt = ${currentTierQuota.extraExpansionCostXu.toLocaleString()} Xu) để cày tiếp.`);
      return;
    }

    setCrossFollowUsedCount(prev => prev + 1);
    setCrossFollowItems(prev => prev.map(i => i.id === item.id ? { ...i, isCompleted: true, completedByUsersCount: i.completedByUsersCount + 1 } : i));

    if (recordMissionProgress) {
      recordMissionProgress(item.type, 1);
    }

    if (claimTaskAction) {
      claimTaskAction("cross_" + item.id, item.type);
    }

    showToast(`✓ +${item.rewardXu} Xu! Đã hoàn thành tương tác kênh ${item.channelHandle}. (Còn lại: ${currentTierQuota.dailyLimit - crossFollowUsedCount - 1} lượt hôm nay).`);
  };

  // Buy more quota
  const handleBuyMoreQuota = () => {
    if ((user.avaliveCoins || 0) < currentTierQuota.extraExpansionCostXu) {
      showToast(`❌ Số dư không đủ! Bạn cần ${currentTierQuota.extraExpansionCostXu.toLocaleString()} Xu để mua thêm hạn mức.`);
      openDeposit();
      return;
    }
    setCrossFollowUsedCount(prev => Math.max(0, prev - 20));
    showToast(`🎉 ĐÃ MUA THÊM +20 LƯỢT TƯƠNG TÁC! Đã triệt tiêu -${currentTierQuota.extraExpansionCostXu.toLocaleString()} Xu vào Quỹ Đốt Token.`);
  };

  // Hàm kiểm tra nhiệm vụ đã hoàn thành toàn bộ yêu cầu chưa (Hỗ trợ Combo & Đa hành động & Tự động ẩn khi đã làm)
  const isTaskFinishedByUser = (taskId: string, type: string, channelHandle?: string) => {
    if (channelHandle && isChannelFollowed(channelHandle) && (type === 'follow' || type === 'cross_follow')) {
      return true;
    }
    const history = userCompletedActions?.[taskId];
    if (!history) return false;

    if (type === 'follow') {
      return !!history.followed || (channelHandle ? isChannelFollowed(channelHandle) : false);
    }
    if (type === 'like') return !!history.liked;
    if (type === 'comment') return !!history.commented;
    if (type === 'share') return !!history.shared;
    if (type === 'watch') return !!history.viewed;
    if (type === 'livestream' || type === 'livestream_viewers') {
      return !!history.viewed || (history.totalCoinsEarned !== undefined && history.totalCoinsEarned > 0);
    }
    if (type === 'multi_target') {
      return !!(history.followed && history.liked && history.commented);
    }

    return !!(history.followed || history.viewed || history.liked || history.commented || history.shared || ((history as any).totalCoinsEarned && (history as any).totalCoinsEarned > 0));
  };

  // Filtered & Sorted Partner Campaigns (Ẩn các nhiệm vụ đã hoàn thành toàn bộ hoặc hết suất)
  const filteredPartnerTasks = tasks
    .filter(t => {
      if (t.type === 'follow' && isChannelFollowed(t.channelHandle)) return false;
      return t.campaignCategory === "partner" && t.status !== 'completed' && (t.remainingSlots === undefined || t.remainingSlots > 0) && !isTaskFinishedByUser(t.id, t.type, t.channelHandle);
    })
    .filter(t => {
      if (enterpriseFilter === "targeted" && t.audienceTargeting?.mode !== "niche_targeted") return false;
      if (enterpriseFilter !== "all" && enterpriseFilter !== "targeted" && t.type !== enterpriseFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.channelName.toLowerCase().includes(q) ||
          t.channelHandle.toLowerCase().includes(q) ||
          (t.partnerName && t.partnerName.toLowerCase().includes(q))
        );
      }
      return true;
    });

  const TASK_TYPE_ORDER: Record<string, number> = {
    follow: 1,
    like: 2,
    comment: 3,
    share: 4,
    watch: 5,
    livestream: 6,
    livestream_viewers: 6
  };

  const sortedPartnerTasks = [...filteredPartnerTasks].sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    const orderA = TASK_TYPE_ORDER[a.type] || 99;
    const orderB = TASK_TYPE_ORDER[b.type] || 99;
    if (orderA !== orderB) return orderA - orderB;
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return 0;
  });

  // Filtered Livestream Rooms (Chỉ hiển thị phòng Live đang phát sóng, tự động ẩn khi kết thúc hoặc đã xem)
  const filteredLiveTasks = livestreamTasks
    .filter(live => live.status === 'live' && (live.remainingSlots === undefined || live.remainingSlots > 0) && !isTaskFinishedByUser(live.id, 'livestream', live.channelHandle))
    .filter((live) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          live.roomTitle.toLowerCase().includes(q) ||
          live.channelName.toLowerCase().includes(q) ||
          live.channelHandle.toLowerCase().includes(q) ||
          (live.category && live.category.toLowerCase().includes(q))
        );
      }
      return true;
    });

  // Video Campaigns (all tasks with watch type or with videos, chưa làm và còn hiệu lực)
  const videoCampaignTasks = tasks
    .filter(t => {
      if (t.type === 'follow' && isChannelFollowed(t.channelHandle)) return false;
      return t.status !== 'completed' && (t.remainingSlots === undefined || t.remainingSlots > 0) && !isTaskFinishedByUser(t.id, t.type, t.channelHandle);
    })
    .filter(t => t.type === "watch" || t.videoPreviewUrl || t.campaignCategory === "partner");

  // Map user created campaigns to feed cards (Tự động ẩn 100% khi đã làm xong hoặc hết suất/kết thúc)
  const createdFeedCards = (campaigns || [])
    .filter(c => {
      if (c.status === 'completed') return false;
      if ((c.completedQuantity || 0) >= (c.targetQuantity || 100)) return false;
      if (isTaskFinishedByUser(c.id, c.type, c.channelHandle)) return false;
      if ((c.type === 'follow' || (c.title || '').toLowerCase().includes('follow')) && isChannelFollowed(c.channelHandle)) return false;
      return true;
    })
    .map(c => {
      const titleLower = (c.title || '').toLowerCase();
      const targetUrlLower = (c.targetUrl || '').toLowerCase();

      // Ưu tiên phân loại chính xác: Combo -> Follow -> Like -> Comment -> Share -> Watch -> KOC -> Live
      const isMulti = c.type === 'multi_target' || titleLower.includes('combo');
      const isFollow = !isMulti && (c.type === 'follow' || titleLower.includes('follow') || titleLower.includes('follower'));
      const isLike = !isMulti && (c.type === 'like' || titleLower.includes('thả tim') || titleLower.includes('like'));
      const isComment = !isMulti && (c.type === 'comment' || titleLower.includes('bình luận') || titleLower.includes('comment'));
      const isShare = !isMulti && (c.type === 'share' || titleLower.includes('chia sẻ') || titleLower.includes('share'));
      const isWatch = !isMulti && (c.type === 'watch' || titleLower.includes('lượt xem') || titleLower.includes('xem video') || titleLower.includes('15s') || titleLower.includes('15 giây'));
      const isKoc = !isMulti && c.type === 'booking_review';

      // Livestream chỉ khi đúng là live stream và không phải combo/follow
      const isLive = !isMulti && !isFollow && !isLike && !isComment && !isShare && (
        c.type === 'livestream' || 
        c.type === 'livestream_viewers' || 
        c.type === 'mega_live' || 
        (targetUrlLower.includes('tiktok.com/@') && targetUrlLower.includes('/live'))
      );

      let computedType = c.type;
      let badge = 'NHẬN XU';
      let reward = 200;

      if (isMulti) {
        computedType = 'multi_target';
        badge = 'COMBO';
        reward = 400;
      } else if (isLive) {
        computedType = 'livestream';
        badge = 'TRỰC TIẾP';
        reward = 400;
      } else if (isFollow) {
        computedType = 'follow';
        badge = 'FOLLOW';
        reward = 200;
      } else if (isWatch) {
        computedType = 'watch';
        badge = '15 GIÂY';
        reward = 200;
      } else if (isLike) {
        computedType = 'like';
        badge = 'THẢ TIM';
        reward = 100;
      } else if (isComment) {
        computedType = 'comment';
        badge = 'COMMENT';
        reward = 200;
      } else if (isShare) {
        computedType = 'share';
        badge = 'CHIA SẺ';
        reward = 240;
      } else if (isKoc) {
        computedType = 'booking_review';
        badge = 'KOC VIP';
        reward = 500;
      }

      const stream = parseMediaUrl(c.targetUrl, c.channelHandle);
      const cardPlatform = c.platform || stream.platform || (c.targetUrl?.toLowerCase().includes('facebook.com') ? 'facebook' : (c.targetUrl?.toLowerCase().includes('youtube.com') || c.targetUrl?.toLowerCase().includes('youtu.be')) ? 'youtube' : 'tiktok');
      const avatar = getTikTokAvatar(c.channelHandle);
      const thumbnailMedia = c.videoPreviewUrl || stream.streamUrl || avatar;

      return {
        id: c.id,
        category: isLive ? ('live' as const) : ('partner' as const),
        taskType: computedType,
        title: c.title || `Chiến Dịch: ${c.channelHandle}`,
        channelName: c.channelHandle,
        channelHandle: c.channelHandle,
        channelAvatar: avatar,
        thumbnail: thumbnailMedia,
        videoUrl: c.videoPreviewUrl || stream.streamUrl,
        rewardXu: reward,
        durationBadge: badge,
        remainingSlots: Math.max(1, (c.targetQuantity || 100) - (c.completedQuantity || 0)),
        isRealCampaign: true,
        isBoosted: c.isBoosted,
        targetUrl: c.targetUrl,
        platform: cardPlatform
      };
    });

  // Map task items to feed cards (Tự động ẩn khi hết suất hoặc đã hoàn thành)
  const missionFeedCards = tasks
    .filter(t => {
      if (t.type === 'follow' && isChannelFollowed(t.channelHandle)) return false;
      return t.status !== 'completed' && (t.remainingSlots === undefined || t.remainingSlots > 0) && !userCompletedActions?.[t.id];
    })
    .map(t => ({
      id: t.id,
      category: (t.campaignCategory === 'partner' ? 'partner' : 'missions') as 'partner' | 'missions',
      taskType: t.type,
      title: t.title,
      channelName: t.channelName,
      channelHandle: t.channelHandle,
      channelAvatar: t.channelAvatar,
      thumbnail: t.videoPreviewUrl || t.channelAvatar,
    rewardXu: t.rewardCoins || 200,
    durationBadge: t.type === 'watch' ? '15 GIÂY' : 'NHẬN XU',
    remainingSlots: t.remainingSlots || 50,
    isRealCampaign: false,
    isBoosted: false,
    targetUrl: t.targetUrl,
    platform: t.platform || 'tiktok'
  }));

  // Map live stream tasks to feed cards (Tự động ẩn phòng live đã hoàn thành)
  const liveFeedCards = livestreamTasks
    .filter(l => !userCompletedActions?.[l.id])
    .map(l => ({
      id: l.id,
      category: 'live' as const,
      taskType: 'livestream',
      title: l.roomTitle || `Live: ${l.channelName}`,
      channelName: l.channelName,
      channelHandle: l.channelHandle,
      channelAvatar: l.channelAvatar,
      thumbnail: l.channelAvatar,
      rewardXu: l.totalRewardCoins || 400,
      durationBadge: `${l.targetMinutes || 3} PHÚT`,
      remainingSlots: 350,
      isRealCampaign: false,
      isBoosted: false,
      targetUrl: l.targetUrl,
      platform: (l as any).platform || 'tiktok'
    }));

  // Map cross follow items to feed cards (Tự động ẩn kênh chéo đã follow / hoàn thành)
  const crossFeedCards = crossFollowItems
    .filter(cf => !userCompletedActions?.[cf.id] && !isChannelFollowed(cf.channelHandle))
    .map(cf => ({
      id: cf.id,
      category: 'cross_follow' as const,
      taskType: cf.type,
      title: cf.title,
      channelName: cf.channelName,
      channelHandle: cf.channelHandle,
      channelAvatar: cf.channelAvatar,
      thumbnail: cf.channelAvatar,
      rewardXu: cf.rewardXu || 200,
      durationBadge: 'CHÉO KÊNH',
      remainingSlots: Math.max(10, (cf.followersCount || 1000) - (cf.completedByUsersCount || 0)),
      isRealCampaign: false,
      isBoosted: false,
      targetUrl: cf.targetUrl,
      platform: 'tiktok'
    }));

  // Hàm khử trùng lặp triệt để và sắp xếp: Đẩy TOP 1 (100.000 Xu) lên đầu tiên
  const deduplicateAndSortCards = <T extends { targetUrl?: string; channelHandle?: string; id: string; isBoosted?: boolean; isRealCampaign?: boolean; platform?: string }>(cards: T[]): T[] => {
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const card of cards) {
      const normUrl = (card.targetUrl || '').trim().toLowerCase().replace(/\/+$/, '');
      const normHandle = (card.channelHandle || '').trim().toLowerCase();
      const dedupKey = normUrl || normHandle || card.id;

      if (!seen.has(dedupKey)) {
        seen.add(dedupKey);
        unique.push(card);
      }
    }

    return unique.sort((a, b) => {
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;
      if (a.isRealCampaign && !b.isRealCampaign) return -1;
      if (!a.isRealCampaign && b.isRealCampaign) return 1;
      return 0;
    });
  };

  // Unified all feed cards: CHỈ HIỂN THỊ 100% CHIẾN DỊCH THẬT ĐÃ TẠO & ĐANG CHẠY
  const allUnifiedCards = deduplicateAndSortCards(createdFeedCards);

  // Counts for watch_feed categories
  const feedCountAll = allUnifiedCards.length;
  const feedCountMissions = allUnifiedCards.filter(c => c.category === 'partner' && c.taskType !== 'livestream' && c.taskType !== 'livestream_viewers').length;
  const feedCountLive = allUnifiedCards.filter(c => c.category === 'live' || c.taskType === 'livestream' || c.taskType === 'livestream_viewers').length;
  const feedCountPartner = allUnifiedCards.length;
  const feedCountCross = 0;

  // Filtered cards according to feedCategoryFilter & feedPlatformFilter (Tự động ẩn 100% nhiệm vụ đã làm xong hoặc kênh đã follow)
  const filteredFeedCards = allUnifiedCards.filter(card => {
    if (userCompletedActions?.[card.id]) return false;
    if (card.channelHandle && isChannelFollowed(card.channelHandle) && (card.taskType === 'follow' || (card.taskType as any) === 'combo' || card.taskType === 'multi_target')) return false;
    if (feedPlatformFilter !== 'all' && (card as any).platform && (card as any).platform !== feedPlatformFilter) return false;
    if (feedCategoryFilter === 'all') return true;
    if (feedCategoryFilter === 'missions') return card.category === 'partner' && card.taskType !== 'livestream' && card.taskType !== 'livestream_viewers';
    if (feedCategoryFilter === 'live') return card.category === 'live' || card.taskType === 'livestream' || card.taskType === 'livestream_viewers';
    if (feedCategoryFilter === 'partner') return true;
    if (feedCategoryFilter === 'cross_follow') return false;
    return true;
  });

  // Filtered Cross Follow Items (Tự động ẩn kênh đã follow hoặc nhiệm vụ đã hoàn thành)
  const filteredCrossFollowItems = crossFollowItems.filter(item => {
    if (item.isCompleted || userCompletedActions?.[item.id] || isChannelFollowed(item.channelHandle)) return false;
    if (crossFollowTypeFilter !== "all" && item.type !== crossFollowTypeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.channelName.toLowerCase().includes(q) ||
        item.channelHandle.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Hiển thị đầy đủ toàn bộ video chiến dịch và phòng live đồng bộ trên mọi thiết bị (máy tính & điện thoại)
  const displayVideoTasks = videoCampaignTasks;
  const displayLiveTasks = filteredLiveTasks;
  const displayEnterpriseTasks = sortedPartnerTasks;
  const displayCrossFollow = filteredCrossFollowItems;

  return (
    <div className="space-y-5">
      {/* CẢNH BÁO TẠM KHÓA CHUỖI NHIỆM VỤ DO PHÁT HIỆN GIAN LẬN */}
      {isUserTaskLocked && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/95 via-rose-950/90 to-red-900/95 border-2 border-red-500/80 text-white shadow-xl shadow-red-950/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 shrink-0 text-xl font-black">
              🚫
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-black text-red-300 uppercase font-display tracking-wider">
                  CHUỖI NHIỆM VỤ ĐANG TẠM KHÓA PHÒNG VỆ
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-black text-[9px] font-mono font-black">
                  ĐÓNG BĂNG {taskLockoutDetails?.durationMinutes || 30} PHÚT
                </span>
              </div>
              <p className="text-[11px] text-red-200/90 mt-1 leading-relaxed">
                {taskLockoutDetails?.reason || 'Hệ thống AVA Sentinel phát hiện hành vi thoát ra vào lại không thao tác hoặc giả lập bot. Toàn bộ chuỗi nhiệm vụ tiếp theo đã bị tạm dừng để bảo vệ ngân sách các chiến dịch.'}
              </p>
              <div className="mt-2 text-[10px] text-red-300/80 font-mono flex items-center gap-1.5">
                <span>⏱️ Thời gian tự động mở khóa:</span>
                <span className="font-bold text-white">
                  {taskLockoutDetails?.lockedUntil ? new Date(taskLockoutDetails.lockedUntil).toLocaleTimeString('vi-VN') : 'Đang xử lý'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER ROW: TIÊU ĐỀ & CÁC CÔNG CỤ ĐIỀU HƯỚNG NHANH */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-mono mb-1">
            <Sparkles className="h-3 w-3" />
            <span>TRUNG TÂM KIẾM TIỀN &amp; TƯƠNG TÁC THẬT</span>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Nhiệm Vụ Follow &amp; Tương Tác Kiếm Xu
            </h2>
            <FeatureGuideTooltip
              title="Quy Định Tương Tác & Cộng Xu Tự Động"
              description="Mỗi hành động trên kênh TikTok/Facebook được đối soát tự động và cộng Xu trực tiếp vào ví:"
              steps={[
                "Follow Kênh TikTok: +200 Xu / lượt",
                "Xem Video Đủ 15s FYP: +200 Xu / lượt (Tự động lướt)",
                "Thả Tim Video: +100 Xu / lượt",
                "Bình Luận Seeding: +200 Xu / lượt",
                "Xem Live Giữ Mắt Thật: +300 đến +1,500 Xu / phiên",
                "1 Xu = 1 VNĐ (Rút về ngân hàng chỉ 5% phí sàn)"
              ]}
              tips="Không được hủy follow sau khi nhận Xu. Bot kiểm duyệt 48h tự động khóa tài khoản vi phạm."
              badge="Cộng Xu Tức Thì"
              placement="bottom"
            />
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Chọn chức năng bên dưới để bắt đầu. Hệ thống đối soát 100% tự động, rút tiền về tài khoản ngân hàng nhanh chóng.
          </p>
        </div>

      </div>

      {/* ====================================================== */}
      {/* 💡 CTA DÙNG XU LÀM CHIẾN DỊCH — VỊ TRÍ ĐẸP NHẤT */}
      {/* ====================================================== */}
      {(() => {
        const coinBalance = user.avaliveCoins || 0;
        if (coinBalance < 500) return null; // Chỉ hiện nếu có Xu
        const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
        const totalTasksToday = campaigns.filter(c => c.status === 'running').length * 10;
        return (
          <button
            type="button"
            onClick={onOpenCreateCampaign || (() => onNavigate?.('create_campaign'))}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-violet-950/60 via-pink-950/50 to-purple-950/60 border border-pink-500/40 hover:border-pink-400 hover:bg-pink-950/30 transition-all cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              📣
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white font-display group-hover:text-pink-200 transition-colors">
                  Dùng {coinBalance >= 1000000 ? `${(coinBalance/1000000).toFixed(1)}M` : coinBalance >= 1000 ? `${Math.floor(coinBalance/1000)}K` : coinBalance} Xu — Tạo chiến dịch, kéo Follow • Like • View • Live ngay!
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {activeCampaigns > 0 
                  ? `✅ ${activeCampaigns} chiến dịch đang chạy — Cộng đồng ${totalTasksToday}+ người đang làm nhiệm vụ của bạn!`
                  : '💡 Chưa có chiến dịch → Ít nhiệm vụ → Cộng đồng ít việc. Tạo ngay để cùng nhau phát triển!'}
              </p>
            </div>
            <PlusCircle className="w-5 h-5 text-pink-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
          </button>
        );
      })()}

      {/* ========================================================================= */}
      {/* 2. THANH KẾT NỐI TÀI KHOẢN (TIKTOK, FACEBOOK & YOUTUBE) MỞ TRỰC TIẾP KÊNH THẬT */}
      {/* ========================================================================= */}
      {(() => {
        const isTikTokConnected = Boolean(user.tiktokConnected && user.tiktokConnected.trim() && user.tiktokConnected !== '@chưa_kết_nối' && user.tiktokConnected !== 'Chưa kết nối');
        const cleanTikTokHandle = (user.tiktokConnected || '').replace(/^@+/, '').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '').split('?')[0].split('/')[0];
        const tiktokChannelUrl = user.tiktokProfileUrl || `https://www.tiktok.com/@${cleanTikTokHandle || 'user'}`;

        const isFacebookConnected = Boolean(user.facebookConnected && user.facebookConnected.trim() && user.facebookConnected !== 'Chưa kết nối');
        const cleanFacebook = (user.facebookConnected || '').replace(/^(https?:\/\/)?(www\.)?facebook\.com\//, '').replace(/^@+/, '').split('?')[0].split('/')[0];
        const facebookUrl = user.facebookProfileUrl || (user.facebookConnected?.startsWith('http') ? user.facebookConnected : `https://www.facebook.com/${cleanFacebook || 'user'}`);

        const isYoutubeConnected = Boolean(user.youtubeConnected && user.youtubeConnected.trim() && user.youtubeConnected !== 'Chưa kết nối');
        const cleanYoutube = (user.youtubeConnected || '').replace(/^(https?:\/\/)?(www\.)?youtube\.com\//, '').replace(/^@+/, '').split('?')[0].split('/')[0];
        const youtubeUrl = user.youtubeProfileUrl || `https://www.youtube.com/@${cleanYoutube || 'user'}`;

        const formatFollowerBadge = (num: number, unit = 'fl'): string => {
          if (!num || num <= 0) return `0 ${unit}`;
          if (num >= 1_000_000) {
            const val = (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '');
            return `${val}M ${unit}`;
          }
          if (num >= 10_000) {
            const val = (num / 1_000).toFixed(1).replace(/\.?0+$/, '');
            return `${val}K ${unit}`;
          }
          return `${num.toLocaleString('vi-VN')} ${unit}`;
        };

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {/* TIKTOK COMPACT CARD */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#090C16] border border-rose-500/40 hover:border-rose-400/80 transition-all shadow-md">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <a
                  href={tiktokChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-black border border-rose-500/60 flex items-center justify-center text-pink-400 shrink-0 p-1.5 shadow hover:scale-105 transition-transform cursor-pointer"
                  title="Mở kênh TikTok"
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
                  </svg>
                </a>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-rose-300 uppercase">KÊNH TIKTOK:</span>
                    {user.kycStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        ĐÃ DUYỆT KYC
                      </span>
                    ) : isTikTokConnected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ĐÃ KẾT NỐI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                        CHƯA KẾT NỐI
                      </span>
                    )}
                  </div>
                  {editingTikTok ? (
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={tempTikTokHandle}
                        onChange={(e) => setTempTikTokHandle(e.target.value)}
                        placeholder="@ten_kenh"
                        className="px-2 py-0.5 rounded bg-black border border-rose-500/60 text-xs font-mono text-white focus:outline-none w-28 sm:w-32"
                        autoFocus
                      />
                      <input
                        type="number"
                        value={tempTikTokFollowers}
                        onChange={(e) => setTempTikTokFollowers(e.target.value)}
                        placeholder="Số fl"
                        className="px-1.5 py-0.5 rounded bg-black border border-rose-500/60 text-[11px] font-mono text-white focus:outline-none w-16"
                        title="Số lượng người theo dõi (Followers)"
                      />
                      <button
                        onClick={() => {
                          if (tempTikTokHandle.trim()) {
                            const flNum = typeof tempTikTokFollowers === 'string' ? parseInt(tempTikTokFollowers.replace(/\D/g, '') || '0', 10) : tempTikTokFollowers;
                            connectTikTok(tempTikTokHandle.trim(), flNum);
                            setEditingTikTok(false);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Lưu
                      </button>
                      <button onClick={() => setEditingTikTok(false)} className="p-0.5 text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <a
                        href={tiktokChannelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-white hover:text-rose-400 transition-colors truncate cursor-pointer max-w-[120px] sm:max-w-[150px]"
                        title={isTikTokConnected ? `Mở https://tiktok.com/@${cleanTikTokHandle}` : 'Chưa kết nối'}
                      >
                        {isTikTokConnected ? user.tiktokConnected : "Chưa kết nối"}
                      </a>
                      {isTikTokConnected && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                      <span 
                        className="px-1.5 py-0.2 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300 font-mono whitespace-nowrap shrink-0"
                        title={`${(user.tiktokFollowers || 0).toLocaleString('vi-VN')} người theo dõi`}
                      >
                        {formatFollowerBadge(user.tiktokFollowers || 0, 'fl')}
                      </span>
                      <button
                        onClick={() => {
                          setTempTikTokHandle(user.tiktokConnected || "");
                          setTempTikTokFollowers(user.tiktokFollowers || 0);
                          setEditingTikTok(true);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                        title="Đổi tên kênh & cập nhật số fl TikTok"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => {
                    setTempTikTokHandle(user.tiktokConnected || "");
                    setTempTikTokFollowers(user.tiktokFollowers || 0);
                    setEditingTikTok(true);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer border border-white/10 whitespace-nowrap"
                >
                  {isTikTokConnected ? 'Đổi Kênh' : '+ Nối Kênh'}
                </button>
                <a
                  href={tiktokChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Mở trực tiếp kênh TikTok"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* FACEBOOK COMPACT CARD */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#090C16] border border-blue-500/40 hover:border-blue-400/80 transition-all shadow-md">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-black border border-blue-500/60 flex items-center justify-center text-blue-400 shrink-0 p-1.5 shadow hover:scale-105 transition-transform cursor-pointer"
                  title="Mở Facebook"
                >
                  <Facebook className="w-full h-full fill-current" />
                </a>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-300 uppercase">FACEBOOK:</span>
                    {isFacebookConnected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ĐÃ KẾT NỐI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                        CHƯA KẾT NỐI
                      </span>
                    )}
                  </div>
                  {editingFacebook ? (
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={tempFacebookUrl}
                        onChange={(e) => setTempFacebookUrl(e.target.value)}
                        placeholder="fb.com/ten_nick"
                        className="px-2 py-0.5 rounded bg-black border border-blue-500/60 text-xs font-mono text-white focus:outline-none w-28 sm:w-32"
                        autoFocus
                      />
                      <input
                        type="number"
                        value={tempFacebookFollowers}
                        onChange={(e) => setTempFacebookFollowers(e.target.value)}
                        placeholder="Số fl"
                        className="px-1.5 py-0.5 rounded bg-black border border-blue-500/60 text-[11px] font-mono text-white focus:outline-none w-16"
                        title="Số lượng bạn bè / fl Facebook"
                      />
                      <button
                        onClick={() => {
                          if (tempFacebookUrl.trim()) {
                            const flNum = typeof tempFacebookFollowers === 'string' ? parseInt(tempFacebookFollowers.replace(/\D/g, '') || '0', 10) : tempFacebookFollowers;
                            connectFacebook(tempFacebookUrl.trim(), 'personal', flNum);
                            setEditingFacebook(false);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Lưu
                      </button>
                      <button onClick={() => setEditingFacebook(false)} className="p-0.5 text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-white hover:text-blue-400 transition-colors truncate cursor-pointer max-w-[120px] sm:max-w-[150px]"
                        title={isFacebookConnected ? `Mở ${facebookUrl}` : 'Chưa kết nối'}
                      >
                        {isFacebookConnected ? user.facebookConnected : "Chưa kết nối"}
                      </a>
                      {isFacebookConnected && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                      <span 
                        className="px-1.5 py-0.2 rounded-full bg-blue-500/15 border border-blue-500/30 text-[10px] text-blue-300 font-mono whitespace-nowrap shrink-0"
                        title={`${(user.facebookFollowers || 0).toLocaleString('vi-VN')} người theo dõi`}
                      >
                        {formatFollowerBadge(user.facebookFollowers || 0, 'fl')}
                      </span>
                      <button
                        onClick={() => {
                          setTempFacebookUrl(user.facebookConnected || "");
                          setTempFacebookFollowers(user.facebookFollowers || 0);
                          setEditingFacebook(true);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                        title="Đổi nick Facebook & cập nhật số fl"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => {
                    setTempFacebookUrl(user.facebookConnected || "");
                    setTempFacebookFollowers(user.facebookFollowers || 0);
                    setEditingFacebook(true);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer border border-white/10 whitespace-nowrap"
                >
                  {isFacebookConnected ? 'Đổi Nick' : '+ Kết Nối'}
                </button>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Mở trực tiếp Facebook"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* YOUTUBE / GOOGLE COMPACT CARD */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#090C16] border border-red-500/40 hover:border-red-400/80 transition-all shadow-md">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-black border border-red-500/60 flex items-center justify-center text-red-500 shrink-0 p-1.5 shadow hover:scale-105 transition-transform cursor-pointer"
                  title="Mở kênh YouTube"
                >
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-red-300 uppercase">YOUTUBE / GOOGLE:</span>
                    {isYoutubeConnected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ĐÃ KẾT NỐI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                        CHƯA KẾT NỐI
                      </span>
                    )}
                  </div>
                  {editingYoutube ? (
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={tempYoutubeUrl}
                        onChange={(e) => setTempYoutubeUrl(e.target.value)}
                        placeholder="@ten_kenh_youtube"
                        className="px-2 py-0.5 rounded bg-black border border-red-500/60 text-xs font-mono text-white focus:outline-none w-28 sm:w-32"
                        autoFocus
                      />
                      <input
                        type="number"
                        value={tempYoutubeSubscribers}
                        onChange={(e) => setTempYoutubeSubscribers(e.target.value)}
                        placeholder="Số subs"
                        className="px-1.5 py-0.5 rounded bg-black border border-red-500/60 text-[11px] font-mono text-white focus:outline-none w-16"
                        title="Số lượng người đăng ký (Subscribers)"
                      />
                      <button
                        onClick={() => {
                          if (tempYoutubeUrl.trim()) {
                            const subNum = typeof tempYoutubeSubscribers === 'string' ? parseInt(tempYoutubeSubscribers.replace(/\D/g, '') || '0', 10) : tempYoutubeSubscribers;
                            connectYoutube(tempYoutubeUrl.trim(), subNum);
                            setEditingYoutube(false);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Lưu
                      </button>
                      <button onClick={() => setEditingYoutube(false)} className="p-0.5 text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-white hover:text-red-400 transition-colors truncate cursor-pointer max-w-[120px] sm:max-w-[150px]"
                        title={isYoutubeConnected ? `Mở ${youtubeUrl}` : 'Chưa kết nối'}
                      >
                        {isYoutubeConnected ? user.youtubeConnected : "Chưa kết nối"}
                      </a>
                      {isYoutubeConnected && <CheckCircle2 className="w-3 h-3 text-red-400 shrink-0" />}
                      <span 
                        className="px-1.5 py-0.2 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] text-red-300 font-mono whitespace-nowrap shrink-0"
                        title={`${(user.youtubeSubscribers || 0).toLocaleString('vi-VN')} người đăng ký`}
                      >
                        {formatFollowerBadge(user.youtubeSubscribers || 0, 'subs')}
                      </span>
                      <button
                        onClick={() => {
                          setTempYoutubeUrl(user.youtubeConnected || "");
                          setTempYoutubeSubscribers(user.youtubeSubscribers || 0);
                          setEditingYoutube(true);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                        title="Đổi kênh YouTube & cập nhật số subs"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => {
                    setTempYoutubeUrl(user.youtubeConnected || "");
                    setTempYoutubeSubscribers(user.youtubeSubscribers || 0);
                    setEditingYoutube(true);
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer border border-white/10 whitespace-nowrap"
                >
                  {isYoutubeConnected ? 'Đổi Nick' : '+ Kết Nối'}
                </button>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Mở trực tiếp YouTube"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* BANNER CẢNH BÁO BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY KHI CHƯA XONG          */}
      {/* ========================================================================= */}
      {!isDailyMissionsCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-red-950/40 to-[#0D111E] border-2 border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-amber-300 uppercase font-mono tracking-wide">
                  🔒 KHÓA TÍNH NĂNG • BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-mono font-black shadow">
                  {dailyDoneCount}/{dailyMissions.length} ĐÃ HOÀN THÀNH
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Người dùng phải hoàn thành và nhận thưởng toàn bộ nhiệm vụ trong ngày tại Tab <strong>"Làm Nhiệm Vụ"</strong> để mở khóa Lướt Video Chiến Dịch, Xem Livestream và Follow Chéo!
              </p>
            </div>
          </div>
          {activeTab !== 'missions' && (
            <button
              onClick={() => setActiveTab('missions')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono shrink-0 shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Vào Làm Nhiệm Vụ Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HÀNG CÁC TAB CHỨC NĂNG DẠNG LƯỚI Ở PHÍA TRÊN (THE TOP FUNCTION GRID)   */}
      {/* BẤM VÀO TAB NÀO -> CHỈ HIỂN THỊ NỘI DUNG NHÁNH CỦA TAB ĐÓ                */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-rose-400" />
              CHỌN TÁC VỤ KIẾM TIỀN (BẤM VÀO ĐỂ XEM CHI TIẾT)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Tách biệt từng chức năng • Dễ nhìn &amp; Dễ quản lý
          </span>
        </div>

        {/* LƯỚI 4 Ô TAB CHỨC NĂNG QUAN TRỌNG NẰM THÀNH MỘT HÀNG GỌN GÀNG */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* TAB 1: LÀM NHIỆM VỤ */}
          <button
            onClick={() => setActiveTab("missions")}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              activeTab === "missions"
                ? "bg-gradient-to-b from-[#240b17] via-[#160814] to-[#0D111E] border-rose-500 shadow-rose-950/40 ring-2 ring-rose-500/40 scale-[1.02]"
                : "bg-[#0A0D18] border-white/10 hover:border-rose-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                activeTab === "missions" ? "bg-rose-500 text-white" : "bg-white/10 text-slate-300"
              }`}>
                ƯU TIÊN
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display">Làm Nhiệm Vụ</div>
              <p className="text-[10px] text-slate-400 truncate">Ngày &amp; Tuần • Xu Tổng</p>
            </div>
            <div className="text-[10px] font-mono text-rose-300 font-bold flex items-center gap-1">
              <span>{activeTab === "missions" ? "● Đang mở" : "Bấm xem ➔"}</span>
            </div>
          </button>

          {/* TAB 2: LƯỚT VIDEO CHIẾN DỊCH (GỘP FYP + DOANH NGHIỆP ESCROW) */}
          <button
            onClick={() => {
              if (!isDailyMissionsCompleted) {
                showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 1 trước.`);
                setActiveTab("missions");
                return;
              }
              setActiveTab("watch_feed");
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              !isDailyMissionsCompleted
                ? "bg-[#0A0D18]/80 border-amber-500/30 opacity-75 hover:border-amber-400/50"
                : activeTab === "watch_feed"
                  ? "bg-gradient-to-b from-[#081e26] via-[#081318] to-[#0D111E] border-cyan-400 shadow-cyan-950/40 ring-2 ring-cyan-400/40 scale-[1.02]"
                  : "bg-[#0A0D18] border-white/10 hover:border-cyan-400/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                {!isDailyMissionsCompleted ? <Lock className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 fill-cyan-400" />}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                !isDailyMissionsCompleted
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : activeTab === "watch_feed"
                    ? "bg-cyan-500 text-black"
                    : "bg-cyan-500/20 text-cyan-300"
              }`}>
                {!isDailyMissionsCompleted ? "🔒 KHÓA" : "ESCROW & FYP"}
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display flex items-center gap-1">
                <span>Lướt Video Chiến Dịch</span>
                {!isDailyMissionsCompleted && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {!isDailyMissionsCompleted ? "Cần xong nhiệm vụ ngày" : "FYP & Doanh Nghiệp • +200-400 Xu"}
              </p>
            </div>
            <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
              <span>
                {!isDailyMissionsCompleted ? "🔒 Cần mở khóa" : activeTab === "watch_feed" ? "● Đang mở" : "Bấm xem ➔"}
              </span>
            </div>
          </button>

          {/* TAB 3: XEM LIVESTREAM */}
          <button
            onClick={() => {
              if (!isDailyMissionsCompleted) {
                showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 1 trước.`);
                setActiveTab("missions");
                return;
              }
              setActiveTab("livestreams");
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              !isDailyMissionsCompleted
                ? "bg-[#0A0D18]/80 border-amber-500/30 opacity-75 hover:border-amber-400/50"
                : activeTab === "livestreams"
                  ? "bg-gradient-to-b from-[#240810] via-[#16060c] to-[#0D111E] border-pink-500 shadow-pink-950/40 ring-2 ring-pink-500/40 scale-[1.02]"
                  : "bg-[#0A0D18] border-white/10 hover:border-pink-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-pink-500/20 border border-pink-500/40 text-pink-400">
                {!isDailyMissionsCompleted ? <Lock className="w-4 h-4 text-amber-400" /> : <Radio className="w-4 h-4 animate-pulse" />}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                !isDailyMissionsCompleted
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : activeTab === "livestreams"
                    ? "bg-pink-500 text-white" 
                    : "bg-pink-500/20 text-pink-300"
              }`}>
                {!isDailyMissionsCompleted ? "🔒 KHÓA" : `${filteredLiveTasks.length} PHÒNG`}
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display flex items-center gap-1">
                <span>Xem Livestream</span>
                {!isDailyMissionsCompleted && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {!isDailyMissionsCompleted ? "Cần xong nhiệm vụ ngày" : "Mắt Thật • TikTok Shop"}
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold flex items-center gap-1 text-pink-300">
              <span>
                {!isDailyMissionsCompleted ? "🔒 Cần mở khóa" : activeTab === "livestreams" ? "● Đang mở" : "Bấm xem ➔"}
              </span>
            </div>
          </button>

          {/* TAB 4: FOLLOW CHÉO CỘNG ĐỒNG */}
          <button
            onClick={() => {
              if (!isDailyMissionsCompleted) {
                showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 1 trước.`);
                setActiveTab("missions");
                return;
              }
              setActiveTab("cross_follow");
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              !isDailyMissionsCompleted
                ? "bg-[#0A0D18]/80 border-amber-500/30 opacity-75 hover:border-amber-400/50"
                : activeTab === "cross_follow"
                  ? "bg-gradient-to-b from-[#08201b] via-[#091714] to-[#0D111E] border-emerald-500 shadow-emerald-950/40 ring-2 ring-emerald-500/40 scale-[1.02]"
                  : "bg-[#0A0D18] border-white/10 hover:border-emerald-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                {!isDailyMissionsCompleted ? <Lock className="w-4 h-4 text-amber-400" /> : <RefreshCw className="w-4 h-4" />}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                !isDailyMissionsCompleted
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : activeTab === "cross_follow" 
                    ? "bg-emerald-500 text-black" 
                    : "bg-emerald-500/20 text-emerald-300"
              }`}>
                {!isDailyMissionsCompleted ? "🔒 KHÓA" : `HẠNG ${user.rankLevel}`}
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display flex items-center gap-1">
                <span>Follow Chéo</span>
                {!isDailyMissionsCompleted && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {!isDailyMissionsCompleted ? "Cần xong nhiệm vụ ngày" : "Trao đổi kênh tự do"}
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold flex items-center gap-1 text-emerald-300">
              <span>
                {!isDailyMissionsCompleted ? "🔒 Cần mở khóa" : activeTab === "cross_follow" ? "● Đang mở" : "Bấm xem ➔"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. NỘI DUNG NHÁNH TÁCH BIỆT THEO TAB ĐƯỢC CHỌN (CHỈ HIỂN THỊ CÁI ĐƯỢC BẤM)*/}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* NHÁNH 1: LÀM NHIỆM VỤ NGÀY & TUẦN (WEEKLY & DAILY MISSIONS)               */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "missions" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-[#0D111E] border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  BẢNG NHIỆM VỤ NGÀY &amp; TUẦN CHÍNH THỨC
                </h4>
                <FeatureGuideTooltip
                  title="Hướng Dẫn Làm Nhiệm Vụ Ngày & Tuần"
                  description="Hoàn thành các chỉ tiêu tương tác TikTok hàng ngày và hàng tuần để tích lũy Xu Tổng, nhận thưởng mốc và thăng hạng tài khoản."
                  steps={[
                    "Làm nhiệm vụ: Xem video 15s, follow kênh, thả tim, bình luận hoặc xem livestream",
                    "Cộng dồn tự động: Khi bạn lướt video, hệ thống tự động ghi nhận tiến độ cho tất cả nhiệm vụ đủ điều kiện",
                    "Nhận thưởng Xu: Bấm nút 'Nhận Thưởng' ngay khi đạt chỉ tiêu để Xu cộng trực tiếp vào ví",
                    "Chu kỳ reset: Nhiệm vụ ngày reset vào 00:00 mỗi ngày, nhiệm vụ tuần reset vào thứ 2 hàng tuần"
                  ]}
                  tips="Hạng tài khoản càng cao (Bạc, Vàng, Kim Cương) thì hệ số nhân thưởng Xu càng lớn!"
                  badge="Nhiệm Vụ"
                  placement="bottom"
                />
              </div>
              <p className="text-xs text-slate-300">
                Làm nhiệm vụ theo chỉ tiêu để nhận Xu Tổng và nâng hạng tài khoản. Tự động reset hàng ngày và hàng tuần.
              </p>
            </div>
            <button
              onClick={() => openFeedRunner('all')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:opacity-95 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>Mở Trình Lướt Làm Tự Động</span>
            </button>
          </div>

          {/* Panel nhiệm vụ tuần & ngày toàn diện */}
          <WeeklyMissionsPanel darkMode={darkMode} />

          {/* Lưới nhiệm vụ tương tác trực tiếp với khung video 1/4 */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  NHIỆM VỤ TƯƠNG TÁC ĐANG MỞ ({displayVideoTasks.length} Nhiệm Vụ)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-rose-300">
                Làm ngay • Nhận Xu tức thì
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayVideoTasks.map((task) => {
                const completed = userCompletedActions[task.id];
                const isHorizontal = task.targetUrl?.includes('youtube.com/watch') || (task.targetUrl?.includes('youtu.be') && !task.targetUrl?.includes('/shorts/'));

                return (
                  <div
                    key={task.id}
                    onClick={() => openFeedRunner(task.id)}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#090C16] border border-rose-500/30 hover:border-rose-400 transition-all flex flex-row gap-3 shadow-lg cursor-pointer group hover:scale-[1.01]"
                  >
                    {/* KHUNG MEDIA CHIẾM 1/4 CARD (DỌC 9:16 HOẶC NGANG 16:9) */}
                    <div className={`relative w-[30%] sm:w-[28%] max-w-[120px] ${isHorizontal ? 'aspect-video self-center' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/80 border border-rose-500/40 shrink-0 shadow-inner group-hover:border-rose-400`}>
                      <SmartMediaThumbnail
                        targetUrl={task.targetUrl}
                        videoPreviewUrl={task.videoPreviewUrl}
                        channelAvatar={task.channelAvatar}
                        channelHandle={task.channelHandle}
                        badgeText={task.type}
                        className="w-full h-full"
                        showPlayIcon={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1 pointer-events-none">
                        <span className="self-start px-1.5 py-0.2 rounded bg-rose-600 text-white text-[8px] font-black font-mono uppercase">
                          {task.type}
                        </span>
                        <div className="px-1 py-0.2 rounded bg-amber-500 text-black font-mono text-[8px] font-black text-center truncate">
                          +{task.rewardCoins.toLocaleString()} Xu
                        </div>
                      </div>
                    </div>

                    {/* THÔNG TIN VÀ NÚT BẤM 1 CHẠM */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-rose-300 truncate">
                            {task.title}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">
                            Còn {task.remainingSlots.toLocaleString()} suất
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <img src={task.channelAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-rose-400/50 shrink-0" />
                          <div className="min-w-0 flex-1 truncate">
                            <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                              {task.channelName}
                            </div>
                            <div className="text-[10px] font-mono text-rose-400 truncate">{task.channelHandle}</div>
                          </div>
                        </div>

                        <h5 className="text-[11px] text-slate-200 line-clamp-2 font-medium leading-snug">
                          {task.title}
                        </h5>
                      </div>

                      <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-black text-amber-400">
                          +{task.rewardCoins.toLocaleString()} Xu
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); openFeedRunner(task.id); }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            completed
                              ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                              : "bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-90 text-white font-black shadow-md"
                          }`}
                        >
                          {completed ? <Check className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                          <span>{completed ? "Đã Xong" : "Làm Ngay"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* NHÁNH 2: LƯỚT VIDEO FYP LIÊN TỤC & LƯỚI VIDEO Ô VUÔNG                     */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "watch_feed" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* HERO BANNER: TRÌNH LƯỚT VIDEO LIÊN TỤC KIỂU TIKTOK */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#170a24] via-[#091522] to-[#0a1f1a] border-2 border-cyan-400/50 p-5 sm:p-6 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                    <Play className="w-3.5 h-3.5 fill-cyan-400" />
                    <span>CỖ MÁY LƯỚT VIDEO FYP TỰ ĐỘNG CHUẨN TIKTOK</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <FeatureGuideTooltip
                    title="Hướng Dẫn Lướt Video Kiếm Tiền"
                    description="Trình lướt video liên tục chuẩn giao diện TikTok For You Page. Tự động chuyển video sau 15 giây và cộng Xu thưởng trực tiếp."
                    steps={[
                      "Xem đủ 15 giây: Đồng hồ đếm ngược 15s bắt đầu khi video phát",
                      "Tự động cộng Xu: Đủ 15 giây hệ thống tự động cộng +200 Xu vào số dư của bạn",
                      "Tự động chuyển tiếp: Hệ thống tự lướt sang video tiếp theo như đang lướt TikTok",
                      "Tương tác tự do: Bạn có thể thả tim, comment hoặc mua sắm TikTok Shop trực tiếp trên video"
                    ]}
                    tips="Bật loa hoặc tai nghe để có trải nghiệm xem video mượt mà và nhận thưởng liên tục không giới hạn!"
                    badge="Lướt Video"
                    placement="bottom"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 font-display">
                  Lướt Video Liên Tiếp • Tự Động Chuyển Sau 15s • Nhận +200 Xu / Video
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tất cả các video của các chiến dịch được tổng kết lại trong một luồng lướt duy nhất. Cứ xem đủ 15 giây là hệ thống tự động cộng Xu và chuyển sang video tiếp theo (y hệt lướt TikTok), hoặc bạn có thể chủ động bấm lướt ngay khi làm xong nhiệm vụ. Bạn cũng có thể ở lại xem video, bấm giỏ hàng TikTok Shop để mua sắm tự do!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  onClick={() => handleOpenFeedRunner('all')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-cyan-400 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-mono flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>BẬT TRÌNH LƯỚT VIDEO TIKTOK NGAY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] font-mono text-center text-cyan-300">
                  ⚡ 100% video người thật • Không cần tải ứng dụng
                </div>
              </div>
            </div>
          </div>

          {/* SMART SUB-FILTER MENU: CHỌN DANH MỤC CHIẾN DỊCH ĐỂ LƯỚT / LÀM NHIỆM VỤ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all' as const, label: '⚡ Tất Cả', count: feedCountAll, color: 'from-cyan-500 to-blue-500' },
              { id: 'missions' as const, label: '🎯 Làm Nhiệm Vụ', count: feedCountMissions, color: 'from-rose-500 to-pink-500' },
              { id: 'live' as const, label: '🔴 Xem LiveStream', count: feedCountLive, color: 'from-pink-500 to-red-500' },
              { id: 'partner' as const, label: '💎 Chiến Dịch Đối Tác', count: feedCountPartner, color: 'from-purple-500 to-indigo-500' },
              { id: 'cross_follow' as const, label: '🔄 Follow Chéo', count: feedCountCross, color: 'from-emerald-500 to-teal-500' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  if (btn.id !== 'missions' && !isDailyMissionsCompleted) {
                    showToast(`🔒 BẮT BUỘC HOÀN THÀNH NHIỆM VỤ NGÀY: Bạn còn ${dailyMissions.length - dailyDoneCount} nhiệm vụ ngày chưa hoàn thành! Hãy hoàn thành ở Tab 1 trước.`);
                    return;
                  }
                  setFeedCategoryFilter(btn.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  feedCategoryFilter === btn.id
                    ? `bg-gradient-to-r ${btn.color} text-white shadow-lg shadow-cyan-500/20 scale-[1.02]`
                    : "bg-[#0A0D18] text-slate-300 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                <span>{btn.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  feedCategoryFilter === btn.id ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"
                }`}>
                  {btn.count}
                </span>
              </button>
            ))}
          </div>

          {/* PLATFORM FILTER: LỌC THEO NỀN TẢNG (TẤT CẢ, TIKTOK, FACEBOOK, YOUTUBE) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 font-mono uppercase mr-1">Nền Tảng:</span>
            {[
              { id: 'all' as const, label: '🌐 Tất Cả Nền Tảng', color: 'border-slate-500/40 bg-slate-800/60 text-white' },
              { id: 'tiktok' as const, label: '🎵 TikTok', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
              { id: 'facebook' as const, label: '📘 Facebook & Fanpage', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
              { id: 'youtube' as const, label: '🔴 YouTube & Shorts', color: 'border-red-500/40 bg-red-500/10 text-red-300' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setFeedPlatformFilter(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                  feedPlatformFilter === p.id
                    ? `${p.color} ring-2 ring-cyan-400 shadow-md font-black`
                    : 'border-white/10 bg-[#0A0D18] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          {/* LƯỚI CÁC Ô VIDEO CHIẾN DỊCH (CHUẨN TỈ LỆ 1/4 LAYOUT) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  DANH SÁCH CHIẾN DỊCH &amp; VIDEO ĐANG CHẠY ({filteredFeedCards.length} Mục)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">
                +200 - 400 Xu / Lượt
              </span>
            </div>

            {/* Grid 1-2-3 cột các ô video hoặc Empty State sạch sẽ */}
            {filteredFeedCards.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#090C16] border border-cyan-500/20 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg">
                  <Film className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-white font-display">
                    Chưa có chiến dịch nào đang chạy
                  </h4>
                  <p className="text-xs text-slate-400 font-mono max-w-md mx-auto leading-relaxed">
                    Hệ thống chỉ hiển thị 100% chiến dịch thật đã thanh toán và đang hoạt động. Các chiến dịch demo ảo và phiên live kết thúc đều được tự động dọn sạch.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCreateCampaign) onOpenCreateCampaign();
                      else if (onNavigate) onNavigate('create_campaign');
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95 font-display flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tạo Chiến Dịch Ngay</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredFeedCards.map((card) => {
                  const completed = userCompletedActions[card.id];
                  const cardPlat = (card as any).platform || 'tiktok';
                  const typeLabels: Record<string, string> = {
                    follow: cardPlat === 'youtube' ? '🔔 Đăng Ký Kênh' : cardPlat === 'facebook' ? '👥 Theo Dõi Trang' : '👤 Follow Kênh',
                    watch: cardPlat === 'youtube' ? '▶️ Xem YouTube' : cardPlat === 'facebook' ? '▶️ Xem Video Facebook' : '⏱️ Xem Video 15s',
                    like: cardPlat === 'youtube' ? '👍 Thích Video' : cardPlat === 'facebook' ? '👍 Thích Bài Viết' : '❤️ Thả Tim',
                    comment: cardPlat === 'youtube' ? '💬 Bình Luận YouTube' : cardPlat === 'facebook' ? '💬 Bình Luận Facebook' : '💬 Bình Luận',
                    share: cardPlat === 'youtube' ? '↗️ Chia Sẻ YouTube' : cardPlat === 'facebook' ? '↗️ Chia Sẻ Facebook' : '🚀 Chia Sẻ',
                    livestream: cardPlat === 'youtube' ? '🔴 Live YouTube' : cardPlat === 'facebook' ? '🔴 Live Facebook' : '🔴 Xem Live Giữ Mắt',
                    livestream_viewers: cardPlat === 'youtube' ? '🔴 Mắt Live YouTube' : cardPlat === 'facebook' ? '🔴 Mắt Live Facebook' : '🔴 Mắt Live Thật',
                    mega_live: '🔴 Mega Live VIP',
                    multi_target: '⭐ Combo Đa Mục Tiêu',
                    combo: '⭐ Combo Đa Mục Tiêu',
                    booking_review: '✨ Booking KOC'
                  };
                  const taskLabel = typeLabels[card.taskType] || '⚡ Làm Nhiệm Vụ';
                  const isHorizontal = card.targetUrl?.includes('youtube.com/watch') || (card.targetUrl?.includes('youtu.be') && !card.targetUrl?.includes('/shorts/'));

                  const actionButtonText = completed 
                    ? "Đã Xong" 
                    : card.taskType === 'follow' 
                      ? (cardPlat === 'youtube' ? "Đăng Ký & Nhận Xu" : cardPlat === 'facebook' ? "Theo Dõi & Nhận Xu" : "Follow & Nhận Xu")
                      : card.taskType === 'like' 
                        ? (cardPlat === 'youtube' ? "Thích & Nhận Xu" : cardPlat === 'facebook' ? "Thích & Nhận Xu" : "Thả Tim & Nhận Xu")
                        : card.taskType === 'comment' 
                          ? (cardPlat === 'youtube' ? "Bình Luận YouTube" : cardPlat === 'facebook' ? "Bình Luận Facebook" : "Bình Luận & Nhận Xu")
                          : card.taskType === 'share' 
                            ? (cardPlat === 'youtube' ? "Chia Sẻ YouTube" : cardPlat === 'facebook' ? "Chia Sẻ Facebook" : "Chia Sẻ & Nhận Xu")
                            : card.taskType === 'livestream' || card.taskType === 'livestream_viewers' 
                              ? "Vào Live & Nhận Xu" 
                              : card.taskType === 'multi_target' 
                                ? "Làm Combo & Nhận Xu" 
                                : (cardPlat === 'youtube' ? "Xem YouTube" : cardPlat === 'facebook' ? "Xem Facebook" : "Xem & Nhận Xu");

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleOpenFeedRunner(card.id)}
                      className="group p-3 sm:p-3.5 rounded-2xl bg-[#090C16] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-950/40 transition-all flex flex-row gap-3 shadow-lg cursor-pointer hover:scale-[1.01]"
                    >
                      {/* KHUNG MEDIA CHIẾM 1/4 CARD (TỰ ĐỘNG DỌC 9:16 HOẶC NGANG 16:9) */}
                      <div className={`relative w-[30%] sm:w-[28%] max-w-[120px] ${isHorizontal ? 'aspect-video self-center' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/80 border border-white/10 group-hover:border-cyan-400/60 shrink-0 transition-all shadow-inner`}>
                        <SmartMediaThumbnail
                          targetUrl={card.targetUrl}
                          videoPreviewUrl={card.thumbnail}
                          channelAvatar={card.channelAvatar}
                          channelHandle={card.channelHandle}
                          isLive={card.taskType === 'livestream' || card.taskType === 'livestream_viewers' || card.taskType === 'mega_live'}
                          isBoosted={card.isBoosted}
                          badgeText={card.durationBadge}
                          className="w-full h-full"
                          showPlayIcon={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1 pointer-events-none">
                          <div className="self-start px-1.5 py-0.2 rounded bg-black/80 text-cyan-300 font-mono text-[8px] font-bold border border-cyan-400/40">
                            {card.durationBadge}
                          </div>
                          {card.isBoosted ? (
                            <div className="px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black text-center truncate">
                              TOP 1
                            </div>
                          ) : (
                            <div className="px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black text-center truncate">
                              +{card.rewardXu.toLocaleString()} XU
                            </div>
                          )}
                        </div>
                      </div>

                      {/* NỘI DUNG THÔNG TIN CHIẾN DỊCH & NÚT BẤM 1 CHẠM */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-cyan-300 truncate">
                              {taskLabel}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 shrink-0">
                              Còn {card.remainingSlots.toLocaleString()} suất
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <img src={card.channelAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400/50 shrink-0" />
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {card.channelHandle || card.channelName}
                            </span>
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          </div>

                          <h5 className="text-[11px] text-slate-200 line-clamp-2 font-medium leading-snug">
                            {card.title}
                          </h5>
                        </div>

                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-black text-amber-400">
                            +{card.rewardXu.toLocaleString()} Xu
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenFeedRunner(card.id); }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              completed
                                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                                : "bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-md"
                            }`}
                          >
                            {completed ? <Check className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                            <span>{actionButtonText}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* NHÁNH 3: XEM LIVESTREAM TIKTOK MẮT THẬT */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "livestreams" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Quota bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#0D111E] to-rose-950/30 border border-pink-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 shrink-0">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white font-mono uppercase">
                    MẮT XEM LIVE TIKTOK SHOP (100% NGƯỜI THẬT)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    Chống Bot Tuyệt Đối
                  </span>
                  <FeatureGuideTooltip
                    title="Hướng Dẫn Xem Livestream Kiếm Xu"
                    description="Xem livestream TikTok để hỗ trợ phiên bán hàng của các nhãn hàng và nhận Xu thưởng định kỳ theo thời gian xem thực tế."
                    steps={[
                      "Chọn phòng live: Bấm vào phiên livestream đang phát trực tiếp",
                      "Duy trì mắt xem: Xem liên tục trong phòng live tối thiểu 30 giây đến vài phút",
                      "Nhận Xu định kỳ: Hệ thống tự động bắn Xu thưởng vào tài khoản theo các mốc thời gian xem",
                      "Tương tác phiên live: Thả tim và bình luận giúp tăng uy tín cho tài khoản của bạn"
                    ]}
                    tips="Xem live vừa giúp bạn giải trí, săn deal TikTok Shop giá rẻ, vừa kiếm thêm thu nhập đều đặn!"
                    badge="Livestream"
                    placement="bottom"
                  />
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Hạn mức: <strong>{quota.completedToday}/{quota.maxLivePerDay} Live</strong> • Cấp bậc: <strong className="text-amber-400">{quota.rank} (x{quota.multiplier})</strong>
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono">
              <span className="text-slate-400">Còn lại hôm nay:</span>
              <div className="text-sm font-black text-emerald-400">{quota.remainingToday} Phiên Live</div>
            </div>
          </div>

          {/* LƯỚI CÁC PHÒNG LIVE TIKTOK (CHUẨN TỈ LỆ 1/4 KHUNG LIVE DỌC 9:16) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  PHÒNG LIVE ĐANG CẦN MẮT XEM ({displayLiveTasks.length} Phòng Trực Tiếp)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-pink-300">
                Xem theo phút • Bấm 1 phát vào xem ngay
              </span>
            </div>

            {/* Grid Live Rooms với Khung Live 1/4 hoặc Empty State */}
            {displayLiveTasks.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#090C16] border border-pink-500/20 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-lg">
                  <Radio className="w-8 h-8 text-pink-400 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-white font-display">
                    Hiện chưa có phiên livestream nào đang phát sóng
                  </h4>
                  <p className="text-xs text-slate-400 font-mono max-w-md mx-auto leading-relaxed">
                    Tất cả phiên livestream cũ đã kết thúc và được lưu vào lịch sử. Hệ thống chỉ hiển thị 100% phiên live thật khi có người dùng hoặc đối tác phát sóng trực tiếp.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCreateCampaign) onOpenCreateCampaign();
                      else if (onNavigate) onNavigate('create_campaign');
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95 font-display flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tạo Chiến Dịch Mắt Live Mới</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {displayLiveTasks.map((live) => {
                  const baseEarnings = Math.round((live.rewardPerMinute || 300) * live.targetMinutes * quota.multiplier);
                  const milestoneBonus = Math.round((live.milestoneBonusCoins || 500) * quota.multiplier);
                  const totalEstReward = baseEarnings + milestoneBonus;

                  return (
                    <div
                      key={live.id}
                      onClick={() => handleOpenLiveRunner(live)}
                      className="p-3 sm:p-3.5 rounded-2xl bg-[#090C16] border border-pink-500/30 hover:border-pink-400 transition-all flex flex-row gap-3 shadow-lg cursor-pointer group hover:scale-[1.01]"
                    >
                      {/* KHUNG LIVESTREAM DỌC 9:16 CHIẾM 1/4 CARD */}
                      <div className="relative w-[30%] sm:w-[28%] max-w-[120px] aspect-[9/16] rounded-xl overflow-hidden bg-black/80 border border-pink-500/40 shrink-0 shadow-inner group-hover:border-pink-400">
                        <img src={live.channelAvatar} alt="" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-1.5">
                          <span className="self-start px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-black uppercase font-mono animate-pulse flex items-center gap-0.5">
                            <Radio className="w-2.5 h-2.5" /> LIVE
                          </span>
                          <div className="text-center">
                            <div className="w-8 h-8 mx-auto rounded-full bg-pink-500/80 group-hover:bg-pink-400 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                              <Radio className="w-4 h-4 animate-pulse" />
                            </div>
                          </div>
                          <div className="px-1 py-0.2 rounded bg-black/80 text-pink-300 font-mono text-[8px] font-bold text-center truncate">
                            {live.currentViewers.toLocaleString()} mắt
                          </div>
                        </div>
                      </div>

                      {/* NỘI DUNG PHÒNG LIVE & NÚT BẤM 1 CHẠM */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-[9px] font-mono font-bold truncate">
                              {live.category || "TikTok Shop"}
                            </span>
                            <span className="text-[9px] font-mono text-amber-400 font-bold">
                              +{totalEstReward.toLocaleString()} Xu
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <img src={live.channelAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-pink-500/60 shrink-0" />
                            <div className="min-w-0 flex-1 truncate">
                              <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate flex items-center gap-1">
                                <span>{live.channelName}</span>
                                <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                              </div>
                              <div className="text-[10px] font-mono text-pink-400 truncate">{live.channelHandle}</div>
                            </div>
                          </div>

                          <h5 className="text-[11px] text-slate-200 line-clamp-2 font-medium leading-snug">
                            {live.roomTitle}
                          </h5>
                        </div>

                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            ⏱️ {live.targetMinutes} phút
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenLiveRunner(live); }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-black text-[10px] font-mono flex items-center gap-1 shadow-md cursor-pointer shrink-0"
                          >
                            <Radio className="w-3 h-3 animate-pulse" />
                            <span>Vào Xem Live</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* NHÁNH 4: CHIẾN DỊCH DOANH NGHIỆP (KÝ QUỸ ESCROW 100%)                      */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "enterprise" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#090C16] border border-amber-500/30 shadow-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  CHIẾN DỊCH DOANH NGHIỆP KÝ QUỸ ESCROW
                </h4>
                <FeatureGuideTooltip
                  title="Hướng Dẫn Chiến Dịch Doanh Nghiệp"
                  description="Các chiến dịch quảng bá do các Doanh nghiệp & Thương hiệu lớn đặt hàng, ngân sách trả thưởng đã được ký quỹ 100% trong két bảo chứng sàn."
                  steps={[
                    "Lọc nhiệm vụ: Chọn các nhiệm vụ Follow, Thả tim, Bình luận hoặc theo tệp KYC",
                    "Thực hiện tương tác: Bấm 'Làm Ngay' để mở kênh hoặc video của doanh nghiệp",
                    "Xác nhận hoàn thành: Hệ thống tự đối soát và cộng Xu vào tài khoản trong vòng 3 giây",
                    "Ưu đãi cấp bậc: Tài khoản hạng cao được nhận các nhiệm vụ độc quyền trả thưởng cao gấp nhiều lần"
                  ]}
                  tips="Nhiệm vụ doanh nghiệp có số lượng có hạn, bạn nên làm sớm để không bị hết suất!"
                  badge="Doanh Nghiệp"
                  placement="bottom"
                />
              </div>
              <p className="text-xs text-slate-300">
                100% ngân sách đã ký quỹ trong Két Sàn AvaLive. Thù lao cao, trả thưởng ngay lập tức.
              </p>
            </div>

            {/* Search Box */}
            <div className="w-full sm:w-64 relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhãn hàng, kênh..."
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Sub Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "Tất Cả" },
              { id: "follow", label: "👤 Follow" },
              { id: "like", label: "❤️ Thả Tim" },
              { id: "comment", label: "💬 Bình Luận" },
              { id: "targeted", label: "🎯 Khớp KYC" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEnterpriseFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  enterpriseFilter === tab.id
                    ? "bg-amber-500 text-black border-amber-400 font-black shadow"
                    : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* LƯỚI CHIẾN DỊCH DOANH NGHIỆP (CHUẨN TỈ LỆ 1/4 MEDIA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayEnterpriseTasks.map((task) => {
              const completed = userCompletedActions[task.id];
              const isBoosted = !!task.isBoosted;
              const isHorizontal = task.targetUrl?.includes('youtube.com/watch') || (task.targetUrl?.includes('youtu.be') && !task.targetUrl?.includes('/shorts/'));

              return (
                <div
                  key={task.id}
                  onClick={() => handleOpenRunner(task)}
                  className={`p-3 sm:p-3.5 rounded-2xl transition-all flex flex-row gap-3 shadow-lg cursor-pointer group relative overflow-hidden ${
                    isBoosted
                      ? "bg-gradient-to-r from-[#24081c] via-[#0D111E] to-[#07131b] border-2 border-rose-500 shadow-rose-950/30"
                      : "bg-[#090C16] border border-amber-500/30 hover:border-amber-400"
                  }`}
                >
                  {/* KHUNG MEDIA CHIẾM 1/4 CARD */}
                  <div className={`relative w-[30%] sm:w-[28%] max-w-[120px] ${isHorizontal ? 'aspect-video self-center' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/80 border border-amber-500/40 shrink-0 shadow-inner group-hover:border-amber-400`}>
                    <SmartMediaThumbnail
                      targetUrl={task.targetUrl}
                      videoPreviewUrl={task.videoPreviewUrl}
                      channelAvatar={task.channelAvatar}
                      channelHandle={task.channelHandle}
                      isBoosted={isBoosted}
                      badgeText="ESCROW"
                      className="w-full h-full"
                      showPlayIcon={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1 pointer-events-none">
                      <span className="self-start px-1.5 py-0.2 rounded bg-amber-500 text-black text-[8px] font-black font-mono">
                        ESCROW
                      </span>
                      <div className="px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black text-center truncate">
                        +{task.rewardCoins.toLocaleString()} Xu
                      </div>
                    </div>
                  </div>

                  {/* NỘI DUNG CHIẾN DỊCH & NÚT BẤM 1 CHẠM */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold truncate">
                          {task.partnerName || "Doanh Nghiệp Ký Quỹ"}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0">
                          {task.remainingSlots.toLocaleString()} suất
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <img src={task.channelAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/50 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                            {task.channelName}
                          </div>
                          <div className="text-[10px] font-mono text-amber-400 truncate">{task.channelHandle}</div>
                        </div>
                      </div>

                      <h5 className="text-[11px] text-slate-200 line-clamp-2 font-medium leading-snug">
                        {task.title}
                      </h5>

                      {/* Progress */}
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${Math.min(100, (task.completedSlots / task.totalSlots) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoostConfirmTask(task);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold cursor-pointer"
                      >
                        🚀 Đẩy Top
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenRunner(task); }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black flex items-center gap-1 cursor-pointer transition-all ${
                          completed
                            ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                            : "bg-amber-500 hover:bg-amber-400 text-black shadow"
                        }`}
                      >
                        {completed ? <Check className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        <span>{completed ? "Đã Xong" : "Làm Ngay"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* NHÁNH 5: FOLLOW CHÉO CỘNG ĐỒNG */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === "cross_follow" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Quota Bar */}
          <div className="p-4 rounded-2xl bg-[#090C16] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-black text-white font-mono uppercase">
                  FOLLOW CHÉO CỘNG ĐỒNG CREATOR
                </h4>
                <FeatureGuideTooltip
                  title="Hướng Dẫn Follow Chéo Kênh"
                  description="Cộng đồng tương tác kênh TikTok tự nguyện. Bạn theo dõi kênh của thành viên khác và kênh của bạn sẽ được hiển thị cho các thành viên khác theo dõi lại."
                  steps={[
                    "Chọn kênh muốn follow: Bấm nút 'Follow Chéo' để mở kênh TikTok",
                    "Thực hiện bấm Theo dõi: Bấm Follow trên TikTok và quay lại xác nhận",
                    "Cộng lượt trao đổi: Mỗi lượt follow thành công sẽ tăng cơ hội cho kênh bạn được người khác follow lại",
                    "Mở rộng hạn mức: Mua thêm hạn mức lượt follow chéo mỗi ngày bằng Xu kiếm được"
                  ]}
                  tips="Tài khoản hoạt động uy tín và tương tác thật sẽ nhận được điểm chất lượng kênh cao hơn!"
                  badge="Follow Chéo"
                  placement="bottom"
                />
              </div>
              <p className="text-xs text-slate-300">
                Trao đổi tương tác kênh tự do. Hạn mức Hạng ${user.rankLevel}: <strong>${crossFollowUsedCount}/${currentTierQuota.dailyLimit} lượt</strong>.
              </p>
            </div>

            <button
              onClick={handleBuyMoreQuota}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono text-xs font-bold shadow-md cursor-pointer hover:opacity-95 shrink-0"
            >
              +20 Lượt (${currentTierQuota.extraExpansionCostXu.toLocaleString()} Xu)
            </button>
          </div>

          {/* LƯỚI CÁC KÊNH FOLLOW CHÉO (CHUẨN TỈ LỆ 1/4) HOẶC EMPTY STATE */}
          {displayCrossFollow.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-[#090C16] border border-emerald-500/20 rounded-3xl space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-display">Hiện chưa có kênh chéo tương tác nào</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Tất cả nhiệm vụ chéo follow và tương tác do cộng đồng người dùng tự tạo. Hãy tạo chiến dịch để nhận follow chéo thật ngay!
                </p>
              </div>
              <button
                onClick={() => openOrderModal(growthServices[0])}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-display cursor-pointer inline-flex items-center gap-2 shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo Chiến Dịch Follow Chéo Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayCrossFollow.map((item) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#090C16] border border-emerald-500/20 hover:border-emerald-400 transition-all flex flex-row gap-3 shadow-lg group hover:scale-[1.01]"
                >
                  {/* KHUNG KÊNH CHIẾM 1/4 CARD */}
                  <div className="relative w-[30%] sm:w-[28%] max-w-[120px] aspect-[9/16] rounded-xl overflow-hidden bg-black/80 border border-emerald-500/40 shrink-0 shadow-inner group-hover:border-emerald-400">
                    <img src={item.channelAvatar} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1">
                      <span className="self-start px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[8px] font-black font-mono">
                        CHÉO
                      </span>
                      <div className="px-1 py-0.2 rounded bg-emerald-600 text-white font-mono text-[8px] font-black text-center truncate">
                        +{item.rewardXu} Xu
                      </div>
                    </div>
                  </div>

                  {/* NỘI DUNG KÊNH & NÚT BẤM 1 CHẠM */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold truncate">
                          {item.category || "TikTok Creator"}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">
                          +{item.rewardXu} Xu
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <img src={item.channelAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/40 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {item.channelName}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400 truncate">{item.channelHandle}</div>
                        </div>
                      </div>

                      <h5 className="text-[11px] text-slate-200 line-clamp-2 font-medium leading-snug">
                        {item.title}
                      </h5>

                      <div className="text-[9px] font-mono text-slate-400">
                        Đã làm: <strong className="text-emerald-400">{item.completedByUsersCount}/{item.followersCount}</strong>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/5">
                      <button
                        onClick={() => handleExecuteCrossFollow(item)}
                        disabled={item.isCompleted}
                        className={`w-full py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                          item.isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md"
                        }`}
                      >
                        {item.isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã Tương Tác Kênh</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>Tương Tác Chéo (+{item.rewardXu} Xu)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4.5. KHU VỰC LƯU TRỮ: LỊCH SỬ NHIỆM VỤ & CHIẾN DỊCH ĐÃ HOÀN THÀNH          */}
      {/* Tách biệt hoàn toàn, không hiển thị lẫn vào danh sách chiến dịch đang chạy */}
      {/* ========================================================================= */}
      {(() => {
        const completedActionList = Object.values(userCompletedActions || {});
        const completedCampaignsList = (campaigns || []).filter(c => c.status === 'completed' || (c.completedQuantity || 0) >= (c.targetQuantity || 100));
        const totalCompletedCount = completedActionList.length + completedCampaignsList.length;

        return (
          <div className="pt-2">
            <div className="p-4 rounded-3xl bg-[#090C16] border border-white/10 hover:border-white/20 transition-all space-y-3">
              <div 
                onClick={() => setShowHistorySection(!showHistorySection)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white font-display flex items-center gap-2">
                      <span>Lịch Sử Nhiệm Vụ &amp; Chiến Dịch Đã Hoàn Thành</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                        {totalCompletedCount} Đã Xong
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Tự động lưu trữ các chiến dịch/nhiệm vụ đã kết thúc hoặc đã nhận Xu đủ
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold border border-white/10 flex items-center gap-1"
                >
                  <span>{showHistorySection ? 'Thu Gọn ▲' : 'Xem Lịch Sử ▼'}</span>
                </button>
              </div>

              {showHistorySection && (
                <div className="pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                  {totalCompletedCount === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs font-mono">
                      Chưa có nhiệm vụ hoặc chiến dịch nào hoàn thành. Khi bạn làm xong nhiệm vụ, thông tin sẽ được lưu trữ tại đây!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                      {completedActionList.map((action, idx) => (
                        <div 
                          key={action.taskId || idx} 
                          onClick={() => {
                            openTaskDetail({
                              id: `audit_${action.taskId}_${idx}`,
                              taskId: action.taskId,
                              taskTitle: action.taskTitle || 'Nhiệm vụ tương tác TikTok',
                              channelHandle: action.channelHandle || action.channelName || '@creator',
                              channelName: action.channelName,
                              channelAvatar: action.channelAvatar,
                              actionType: 'task_completion',
                              actionLabel: 'Tương tác TikTok',
                              coinsEarned: action.totalCoinsEarned || 200,
                              amountVND: (action.totalCoinsEarned || 200) * 10,
                              txHash: `LOG-${(action.taskId || 'TASK').toUpperCase()}`,
                              timestamp: action.completedAt || 'Vừa xong',
                              userHandle: user.tiktokConnected || user.handle || '@user',
                              status: 'success',
                              followed: action.followed,
                              liked: action.liked,
                              commented: action.commented,
                              shared: action.shared,
                              viewed: action.viewed
                            });
                          }}
                          className="p-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-emerald-500/20 hover:border-emerald-500/50 flex items-center justify-between gap-2.5 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img 
                              src={action.channelAvatar || getTikTokAvatar(action.channelHandle)} 
                              alt="" 
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-400/50 shrink-0 group-hover:scale-105 transition-transform" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white truncate">{action.channelHandle || action.channelName}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{action.taskTitle || 'Nhiệm vụ tương tác TikTok'}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {action.followed && <span className="text-[8px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono">Follow</span>}
                                {action.liked && <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">Tim</span>}
                                {action.commented && <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Cmt</span>}
                                {action.viewed && <span className="text-[8px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">Xem</span>}
                                {action.shared && <span className="text-[8px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">Share</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-black text-emerald-400">+{action.totalCoinsEarned || 200} Xu</span>
                            <span className="block text-[9px] font-mono text-slate-500">{action.completedAt || 'Đã hoàn thành'}</span>
                            <span className="text-[8px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Xem Chi Tiết 🔍</span>
                          </div>
                        </div>
                      ))}

                      {completedCampaignsList.map((camp, idx) => (
                        <div 
                          key={camp.id} 
                          onClick={() => {
                            openTaskDetail({
                              id: `audit_camp_${camp.id}_${idx}`,
                              taskId: camp.id,
                              taskTitle: camp.title || 'Chiến dịch tăng trưởng',
                              channelHandle: camp.channelHandle || '@creator',
                              channelAvatar: camp.videoPreviewUrl,
                              actionType: 'campaign_complete',
                              actionLabel: camp.title,
                              coinsEarned: parseInt(camp.budgetTotal.replace(/\D/g, '') || '10000', 10),
                              amountVND: parseInt(camp.budgetTotal.replace(/\D/g, '') || '10000', 10) * 10,
                              txHash: `CAMP-${camp.id.toUpperCase()}`,
                              timestamp: camp.createdAt || 'Hôm nay',
                              userHandle: user.tiktokConnected || user.handle || '@user',
                              status: 'success'
                            });
                          }}
                          className="p-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-purple-500/20 hover:border-purple-500/50 flex items-center justify-between gap-2.5 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img 
                              src={camp.videoPreviewUrl || getTikTokAvatar(camp.channelHandle)} 
                              alt="" 
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-400/50 shrink-0 group-hover:scale-105 transition-transform" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white truncate">{camp.channelHandle}</span>
                                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  ĐÃ ĐỦ CHỈ TIÊU
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{camp.title}</p>
                              <span className="text-[9px] font-mono text-slate-500">Đạt {camp.completedQuantity || camp.targetQuantity}/{camp.targetQuantity} lượt</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">100% Hoàn Thành</span>
                            <span className="block text-[9px] font-mono text-emerald-400">✓ Đã Lưu Trữ</span>
                            <span className="text-[8px] text-purple-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">Xem Chi Tiết 🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 5. CÁC MODAL HỆ THỐNG: ĐẨY TOP, THÔNG BÁO, TRIỆT TIÊU XU                  */}
      {/* ========================================================================= */}

      {/* MODAL XÁC NHẬN ĐẨY TOP CHIẾN DỊCH (50.000 XU) */}
      {boostConfirmTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111E] border-2 border-rose-500/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <Rocket className="w-5 h-5 text-rose-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Đẩy Top Chiến Dịch Lên Đầu Bảng</h3>
                  <p className="text-[11px] font-mono text-rose-400">Phí dịch vụ: 50.000 Xu</p>
                </div>
              </div>
              <button
                onClick={() => setBoostConfirmTask(null)}
                className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <div className="text-xs text-slate-400">Chiến dịch được chọn:</div>
              <div className="font-bold text-white text-sm">{boostConfirmTask.title}</div>
              <div className="text-xs font-mono text-rose-400">{boostConfirmTask.channelHandle}</div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Phí Đẩy Top:</span>
                <span className="font-black text-amber-400 font-mono">50,000 Xu</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Số dư ví của bạn:</span>
                <span className="font-bold text-white font-mono">{user.avaliveCoins.toLocaleString()} Xu</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setBoostConfirmTask(null)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const success = boostCampaign(boostConfirmTask.id);
                  if (success) setBoostConfirmTask(null);
                }}
                disabled={user.avaliveCoins < 50000}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs disabled:opacity-40"
              >
                Xác Nhận Đẩy Top
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÔNG BÁO THỜI GIAN THỰC */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111E] border border-white/15 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-black text-white">Hộp Thư Thông Báo</h3>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotificationsCount > 0 && (
                  <button onClick={clearAllNotifications} className="text-[10px] text-cyan-400 underline">
                    Đã xem tất cả
                  </button>
                )}
                <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1">
              {userNotifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-mono">
                  Chưa có thông báo mới nào.
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white">{notif.title}</div>
                    <p className="text-[11px] text-slate-300 mt-1">{notif.message}</p>
                    <span className="text-[9px] font-mono text-slate-400 mt-1 block">{notif.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8 CHIẾN LƯỢC TRIỆT TIÊU XU */}
      <TokenSinkStrategyModal
        isOpen={isTokenSinkModalOpen}
        onClose={() => setIsTokenSinkModalOpen(false)}
      />
    </div>
  );
};
