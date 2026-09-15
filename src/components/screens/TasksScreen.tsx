import React, { useState } from "react";
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
  PlusCircle
} from "lucide-react";
import { TikTokTaskItem, LivestreamTaskItem, CrossFollowItem } from "../../types";
import { useTikTokApp } from "../../context/TikTokAppContext";
import { FeatureGuideTooltip } from "../common/FeatureGuideTooltip";
import { WeeklyMissionsPanel } from "./WeeklyMissionsPanel";
import { INITIAL_CROSS_FOLLOW_ITEMS, TIER_CROSS_FOLLOW_QUOTAS } from "../../data/crossFollowData";
import { TokenSinkStrategyModal } from "../modals/TokenSinkStrategyModal";
import { parseMediaUrl } from "../../data/videoSources";

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
    openDeposit,
    openShareModal,
    campaigns,
    tasksActiveTab,
    setTasksActiveTab
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Inline Quick Edit & Switch Account State (Thu gọn thanh trạng thái kết nối)
  const [editingTikTok, setEditingTikTok] = useState<boolean>(false);
  const [tempTikTokHandle, setTempTikTokHandle] = useState<string>(user.tiktokConnected || "@thienvuaapp_official");
  const [editingFacebook, setEditingFacebook] = useState<boolean>(false);
  const [tempFacebookUrl, setTempFacebookUrl] = useState<string>(user.facebookConnected || "fb.com/thienvuaapp");

  // Kiểm tra hoàn thành toàn bộ Nhiệm Vụ Ngày để mở khóa Live Stream & Follow Chéo
  const dailyMissions = userMissions?.filter(m => m.category === 'daily') || [];
  const dailyDoneCount = dailyMissions.filter(m => m.completedCount >= m.targetCount || m.status === 'claimed').length;
  const isDailyMissionsCompleted = dailyMissions.length === 0 || dailyDoneCount === dailyMissions.length;

  const currentTierQuota = TIER_CROSS_FOLLOW_QUOTAS[user.rankLevel] || TIER_CROSS_FOLLOW_QUOTAS["Đồng"];
  const quota = getUserLiveQuota();

  // Execute Cross Follow Action
  const handleExecuteCrossFollow = (item: CrossFollowItem) => {
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

  // Filtered & Sorted Partner Campaigns
  const filteredPartnerTasks = tasks
    .filter(t => t.campaignCategory === "partner")
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

  // Filtered Livestream Rooms (Chỉ hiển thị phòng Live đang phát sóng, tự động ẩn khi kết thúc)
  const filteredLiveTasks = livestreamTasks
    .filter(live => live.status === 'live' && (live.remainingSlots === undefined || live.remainingSlots > 0))
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

  // Video Campaigns (all tasks with watch type or with videos)
  const videoCampaignTasks = tasks.filter(t => t.type === "watch" || t.videoPreviewUrl || t.campaignCategory === "partner");

  // Map user created campaigns to feed cards (Tự động ẩn khi hoàn thành đủ số lượng đã mua)
  const createdFeedCards = (campaigns || [])
    .filter(c => c.status !== 'completed' && (c.completedQuantity || 0) < (c.targetQuantity || 100))
    .map(c => {
      const isLive = c.type === 'livestream' || c.type === 'livestream_viewers';
      const stream = parseMediaUrl(c.targetUrl, c.channelHandle);
      return {
        id: c.id,
        category: isLive ? ('live' as const) : ('partner' as const),
        taskType: c.type,
        title: c.title || `Chiến Dịch: ${c.channelHandle}`,
        channelName: c.channelHandle,
        channelHandle: c.channelHandle,
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        thumbnail: stream.streamUrl || '/videos/sample1.mp4',
        videoUrl: stream.streamUrl || '/videos/sample1.mp4',
        rewardXu: 200,
        durationBadge: isLive ? 'TRỰC TIẾP' : '15 GIÂY',
        remainingSlots: Math.max(1, (c.targetQuantity || 100) - (c.completedQuantity || 0)),
        isRealCampaign: true,
        isBoosted: c.isBoosted,
        targetUrl: c.targetUrl
      };
    });

  // Map task items to feed cards (Tự động ẩn khi hết suất)
  const missionFeedCards = tasks
    .filter(t => t.status !== 'completed' && (t.remainingSlots === undefined || t.remainingSlots > 0))
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
    targetUrl: t.targetUrl
  }));

  // Map live stream tasks to feed cards
  const liveFeedCards = livestreamTasks.map(l => ({
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
    targetUrl: l.targetUrl
  }));

  // Map cross follow items to feed cards
  const crossFeedCards = crossFollowItems.map(cf => ({
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
    targetUrl: cf.targetUrl
  }));

  // Hàm khử trùng lặp triệt để và sắp xếp: Đẩy TOP 1 (100.000 Xu) lên đầu tiên
  const deduplicateAndSortCards = <T extends { targetUrl?: string; channelHandle?: string; id: string; isBoosted?: boolean; isRealCampaign?: boolean }>(cards: T[]): T[] => {
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

  // Filtered cards according to feedCategoryFilter
  const filteredFeedCards = allUnifiedCards.filter(card => {
    if (feedCategoryFilter === 'all') return true;
    if (feedCategoryFilter === 'missions') return card.category === 'partner' && card.taskType !== 'livestream' && card.taskType !== 'livestream_viewers';
    if (feedCategoryFilter === 'live') return card.category === 'live' || card.taskType === 'livestream' || card.taskType === 'livestream_viewers';
    if (feedCategoryFilter === 'partner') return true;
    if (feedCategoryFilter === 'cross_follow') return false;
    return true;
  });

  // Filtered Cross Follow Items
  const filteredCrossFollowItems = crossFollowItems.filter(item => {
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

      {/* ========================================================================= */}
      {/* 2. THANH KẾT NỐI TÀI KHOẢN (TIKTOK & FACEBOOK) SIÊU GỌN GÀNG, DỄ NHÌN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* TIKTOK COMPACT CARD */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#090C16] border border-rose-500/40 hover:border-rose-400/80 transition-all shadow-md">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-black border border-rose-500/60 flex items-center justify-center text-pink-400 shrink-0 p-1.5 shadow">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.93-4.57V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76c-.31-.02-.62-.05-.94-.07z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-rose-300 uppercase">KÊNH TIKTOK:</span>
                {user.kycStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    ĐÃ DUYỆT KYC (KHÓA KÊNH)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ĐÃ KẾT NỐI
                  </span>
                )}
              </div>
              {editingTikTok && user.kycStatus !== 'verified' ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={tempTikTokHandle}
                    onChange={(e) => setTempTikTokHandle(e.target.value)}
                    placeholder="@ten_kenh"
                    className="px-2 py-0.5 rounded bg-black border border-rose-500/60 text-xs font-mono text-white focus:outline-none w-28 sm:w-36"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (tempTikTokHandle.trim()) {
                        connectTikTok(tempTikTokHandle.trim());
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-white truncate max-w-[130px] sm:max-w-[180px]">
                    {user.tiktokConnected || "@thienvuaapp_official"}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    ({(user.tiktokFollowers || 248500).toLocaleString()} fl)
                  </span>
                  {user.kycStatus !== 'verified' && (
                    <button
                      onClick={() => {
                        setTempTikTokHandle(user.tiktokConnected || "@thienvuaapp_official");
                        setEditingTikTok(true);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Đổi tên kênh TikTok"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {user.kycStatus !== 'verified' ? (
              <button
                onClick={() => {
                  setTempTikTokHandle(user.tiktokConnected || "@thienvuaapp_official");
                  setEditingTikTok(true);
                }}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer border border-white/10"
              >
                Đổi Kênh
              </button>
            ) : (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Cố Định
              </span>
            )}
            <a
              href={`https://www.tiktok.com/@${(user.tiktokConnected || "thienvuaapp").replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Mở kênh TikTok"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* FACEBOOK COMPACT CARD */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#090C16] border border-blue-500/40 hover:border-blue-400/80 transition-all shadow-md">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-black border border-blue-500/60 flex items-center justify-center text-blue-400 shrink-0 p-1.5 shadow">
              <Facebook className="w-full h-full fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase">FACEBOOK SHARE:</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SẴN SÀNG
                </span>
              </div>
              {editingFacebook && user.kycStatus !== 'verified' ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={tempFacebookUrl}
                    onChange={(e) => setTempFacebookUrl(e.target.value)}
                    placeholder="fb.com/ten_nick"
                    className="px-2 py-0.5 rounded bg-black border border-blue-500/60 text-xs font-mono text-white focus:outline-none w-28 sm:w-36"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (tempFacebookUrl.trim()) {
                        connectFacebook(tempFacebookUrl.trim());
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-white truncate max-w-[130px] sm:max-w-[180px]">
                    {user.facebookConnected || "fb.com/thienvuaapp"}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    ({(user.facebookFollowers || 18500).toLocaleString()} fl)
                  </span>
                  {user.kycStatus !== 'verified' && (
                    <button
                      onClick={() => {
                        setTempFacebookUrl(user.facebookConnected || "fb.com/thienvuaapp");
                        setEditingFacebook(true);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Đổi nick Facebook"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {user.kycStatus !== 'verified' ? (
              <button
                onClick={() => {
                  setTempFacebookUrl(user.facebookConnected || "fb.com/thienvuaapp");
                  setEditingFacebook(true);
                }}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono cursor-pointer border border-white/10"
              >
                Đổi Nick
              </button>
            ) : (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Cố Định
              </span>
            )}
            <a
              href={`https://${(user.facebookConnected || "facebook.com").startsWith("http") ? user.facebookConnected : (user.facebookConnected || "facebook.com")}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Mở Facebook"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

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
            onClick={() => setActiveTab("watch_feed")}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              activeTab === "watch_feed"
                ? "bg-gradient-to-b from-[#081e26] via-[#081318] to-[#0D111E] border-cyan-400 shadow-cyan-950/40 ring-2 ring-cyan-400/40 scale-[1.02]"
                : "bg-[#0A0D18] border-white/10 hover:border-cyan-400/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Play className="w-4 h-4 fill-cyan-400" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                activeTab === "watch_feed" ? "bg-cyan-500 text-black" : "bg-cyan-500/20 text-cyan-300"
              }`}>
                ESCROW &amp; FYP
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display">Lướt Video Chiến Dịch</div>
              <p className="text-[10px] text-slate-400 truncate">FYP &amp; Doanh Nghiệp • +200-400 Xu</p>
            </div>
            <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
              <span>{activeTab === "watch_feed" ? "● Đang mở" : "Bấm xem ➔"}</span>
            </div>
          </button>

          {/* TAB 3: XEM LIVESTREAM */}
          <button
            onClick={() => setActiveTab("livestreams")}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              activeTab === "livestreams"
                ? "bg-gradient-to-b from-[#240810] via-[#16060c] to-[#0D111E] border-pink-500 shadow-pink-950/40 ring-2 ring-pink-500/40 scale-[1.02]"
                : "bg-[#0A0D18] border-white/10 hover:border-pink-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-pink-500/20 border border-pink-500/40 text-pink-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                activeTab === "livestreams" 
                  ? "bg-pink-500 text-white" 
                  : "bg-pink-500/20 text-pink-300"
              }`}>
                {filteredLiveTasks.length} PHÒNG
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display flex items-center gap-1">
                <span>Xem Livestream</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Mắt Thật • TikTok Shop
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold flex items-center gap-1 text-pink-300">
              <span>{activeTab === "livestreams" ? "● Đang mở" : "Bấm xem ➔"}</span>
            </div>
          </button>

          {/* TAB 4: FOLLOW CHÉO CỘNG ĐỒNG */}
          <button
            onClick={() => setActiveTab("cross_follow")}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 cursor-pointer shadow-md ${
              activeTab === "cross_follow"
                ? "bg-gradient-to-b from-[#08201b] via-[#091714] to-[#0D111E] border-emerald-500 shadow-emerald-950/40 ring-2 ring-emerald-500/40 scale-[1.02]"
                : "bg-[#0A0D18] border-white/10 hover:border-emerald-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                activeTab === "cross_follow" 
                  ? "bg-emerald-500 text-black" 
                  : "bg-emerald-500/20 text-emerald-300"
              }`}>
                HẠNG {user.rankLevel}
              </span>
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase font-display flex items-center gap-1">
                <span>Follow Chéo</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Trao đổi kênh tự do
              </p>
            </div>
            <div className="text-[10px] font-mono font-bold flex items-center gap-1 text-emerald-300">
              <span>{activeTab === "cross_follow" ? "● Đang mở" : "Bấm xem ➔"}</span>
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
                      <img src={task.videoPreviewUrl || task.channelAvatar} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1">
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
                  onClick={() => openFeedRunner('all')}
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
                onClick={() => setFeedCategoryFilter(btn.id)}
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
                  const typeLabels: Record<string, string> = {
                    follow: '👤 Follow Kênh',
                    watch: '⏱️ Xem Video 15s',
                    like: '❤️ Thả Tim',
                    comment: '💬 Bình Luận',
                    share: '🚀 Chia Sẻ',
                    livestream: '🔴 Xem Live Giữ Mắt',
                    livestream_viewers: '🔴 Mắt Live Thật'
                  };
                  const taskLabel = typeLabels[card.taskType] || '⚡ Làm Nhiệm Vụ';
                  const isHorizontal = card.targetUrl?.includes('youtube.com/watch') || (card.targetUrl?.includes('youtu.be') && !card.targetUrl?.includes('/shorts/'));

                  return (
                    <div
                      key={card.id}
                      onClick={() => openFeedRunner(card.id)}
                      className="group p-3 sm:p-3.5 rounded-2xl bg-[#090C16] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-950/40 transition-all flex flex-row gap-3 shadow-lg cursor-pointer hover:scale-[1.01]"
                    >
                      {/* KHUNG MEDIA CHIẾM 1/4 CARD (TỰ ĐỘNG DỌC 9:16 HOẶC NGANG 16:9) */}
                      <div className={`relative w-[30%] sm:w-[28%] max-w-[120px] ${isHorizontal ? 'aspect-video self-center' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/80 border border-white/10 group-hover:border-cyan-400/60 shrink-0 transition-all shadow-inner`}>
                        {card.thumbnail && card.thumbnail.includes('.mp4') ? (
                          <video
                            src={card.thumbnail}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                            muted
                            playsInline
                            loop
                            autoPlay
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={card.thumbnail}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-cyan-300 font-mono text-[8px] font-bold border border-cyan-400/40">
                          {card.durationBadge}
                        </div>
                        {card.isBoosted ? (
                          <div className="absolute bottom-1 left-1 right-1 px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black text-center truncate">
                            TOP 1
                          </div>
                        ) : (
                          <div className="absolute bottom-1 left-1 right-1 px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-black text-center truncate">
                            +{card.rewardXu.toLocaleString()} XU
                          </div>
                        )}
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
                            onClick={(e) => { e.stopPropagation(); openFeedRunner(card.id); }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              completed
                                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                                : "bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-md"
                            }`}
                          >
                            {completed ? <Check className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                            <span>{completed ? "Đã Xem Xong" : "Xem & Nhận Xu"}</span>
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

            {/* Grid Live Rooms với Khung Live 1/4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayLiveTasks.map((live) => {
                const baseEarnings = Math.round((live.rewardPerMinute || 300) * live.targetMinutes * quota.multiplier);
                const milestoneBonus = Math.round((live.milestoneBonusCoins || 500) * quota.multiplier);
                const totalEstReward = baseEarnings + milestoneBonus;

                return (
                  <div
                    key={live.id}
                    onClick={() => openLiveRunner(live)}
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
                          onClick={(e) => { e.stopPropagation(); openLiveRunner(live); }}
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
                  onClick={() => openRunner(task)}
                  className={`p-3 sm:p-3.5 rounded-2xl transition-all flex flex-row gap-3 shadow-lg cursor-pointer group relative overflow-hidden ${
                    isBoosted
                      ? "bg-gradient-to-r from-[#24081c] via-[#0D111E] to-[#07131b] border-2 border-rose-500 shadow-rose-950/30"
                      : "bg-[#090C16] border border-amber-500/30 hover:border-amber-400"
                  }`}
                >
                  {/* KHUNG MEDIA CHIẾM 1/4 CARD */}
                  <div className={`relative w-[30%] sm:w-[28%] max-w-[120px] ${isHorizontal ? 'aspect-video self-center' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/80 border border-amber-500/40 shrink-0 shadow-inner group-hover:border-amber-400`}>
                    <img src={task.videoPreviewUrl || task.channelAvatar} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-1">
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
                        onClick={(e) => { e.stopPropagation(); openRunner(task); }}
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

          {/* LƯỚI CÁC KÊNH FOLLOW CHÉO (CHUẨN TỈ LỆ 1/4) */}
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
        </div>
      )}

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
