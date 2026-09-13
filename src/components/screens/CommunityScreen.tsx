import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Image as ImageIcon, 
  X, 
  UserPlus, 
  Users, 
  UserCheck, 
  MessageCircle, 
  Camera, 
  Check, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  time: string;
}

interface CommunityPostItem {
  id: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatar: string;
    verified: boolean;
    isKycVerified: boolean;
  };
  time: string;
  tag: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  isLiked?: boolean;
  commentsList: CommentItem[];
  status: 'published' | 'pending_approval';
}

const INITIAL_POSTS: CommunityPostItem[] = [
  {
    id: 'post_1',
    author: {
      name: 'Vũ Đức Thành',
      handle: '@thanh_tiktokgrowth',
      role: 'Top Creator (850K Follow)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      verified: true,
      isKycVerified: true
    },
    time: '25 phút trước',
    tag: 'Thuật toán FYP',
    content: '🔥 BÍ QUYẾT LÊN XU HƯỚNG TIKTOK 2026 CHO KÊNH MỚI:\nXây kênh chuẩn bền vững: Hãy dùng nhiệm vụ người dùng thật xem video 15s đầu kết hợp follow tự nhiên. Kênh mình vừa cán mốc 850k follow và video nào cũng cắn đề xuất For You Page (FYP)! Anh em nào cần trao đổi kinh nghiệm cứ bấm kết bạn và nhắn tin riêng với mình nhé!',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    likes: 342,
    commentsCount: 3,
    shares: 89,
    isLiked: true,
    status: 'published',
    commentsList: [
      {
        id: 'c1',
        authorName: 'Hồng Ánh',
        authorHandle: '@anhhong_99',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        content: 'Chuẩn luôn anh ơi, kéo follow thật tỷ lệ giữ chân xem video cao hơn hẳn!',
        time: '15 phút trước'
      },
      {
        id: 'c2',
        authorName: 'Trần Tuấn',
        authorHandle: '@tuan_media',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        content: 'Cho em hỏi thời gian xem live giữ mắt 3-5 phút có đẩy kênh bán hàng TikTok Shop tốt không ạ?',
        time: '8 phút trước'
      },
      {
        id: 'c3',
        authorName: 'Vũ Đức Thành',
        authorHandle: '@thanh_tiktokgrowth',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        content: '@tuan_media Rất tốt em nhé, mắt xem thật giúp TikTok phân phối live vào top ngành hàng ngay!',
        time: '2 phút trước'
      }
    ]
  },
  {
    id: 'post_2',
    author: {
      name: 'Đặng Mai Phương',
      handle: '@phuongbeauty_koc',
      role: 'KOC Review Mỹ Phẩm (120K Follow)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      verified: true,
      isKycVerified: true
    },
    time: '2 giờ trước',
    tag: 'Kinh nghiệm Booking',
    content: '🎉 Khoe nhẹ với cả nhà bill rút 5.000.000 VNĐ tiền nhiệm vụ và hoa hồng booking vừa về tài khoản MB Bank trong 30 giây! Các bạn làm KOC chú ý: Khi nhận hợp đồng booking video ký quỹ Escrow 3 bên trên app, video nộp lên được bảo hành nghiệm thu 72h. Yên tâm 100% không lo brand bùng tiền vì tiền đã khóa sẵn trong két sàn rồi nhé!',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    likes: 215,
    commentsCount: 1,
    shares: 41,
    status: 'published',
    commentsList: [
      {
        id: 'c4',
        authorName: 'Linh Nga',
        authorHandle: '@linga_review',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        content: 'Cơ chế ký quỹ này văn minh thực sự, làm video xong yên tâm nhận tiền!',
        time: '1 giờ trước'
      }
    ]
  },
  {
    id: 'post_3',
    author: {
      name: 'Lê Hoàng Nam',
      handle: '@namtiktok_ads',
      role: 'Chủ Shop Thời Trang (320K Follow)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      verified: true,
      isKycVerified: true
    },
    time: '4 giờ trước',
    tag: 'Mắt Xem Live',
    content: '🔥 Vừa kích hoạt chiến dịch Đẩy Top 50.000 Xu trên sàn, phòng Live vọt lên 1.200 mắt xem thật trong 10 phút đầu! Doanh số chốt đơn tăng gấp 3 lần phiên live trước. Ae nào đang chạy live bán hàng nên tận dụng gói Đẩy Top này nhé!',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    likes: 184,
    commentsCount: 2,
    shares: 28,
    status: 'published',
    commentsList: [
      {
        id: 'c5',
        authorName: 'Vũ Đức Thành',
        authorHandle: '@thanh_tiktokgrowth',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        content: 'Phí đẩy 50k xu vào thẳng két sàn mà hiệu quả gom mắt thật cực đỉnh bác ơi!',
        time: '3 giờ trước'
      }
    ]
  }
];

export const CommunityScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { 
    user, 
    openKycModal, 
    showToast, 
    openShareModal,
    friends,
    chatConversations,
    activeChatUser,
    openChatWithUser,
    closeChat,
    toggleFriendship,
    sendChatMessage
  } = useTikTokApp();

  const [activeTag, setActiveTag] = useState<string>('Tất cả');
  const [posts, setPosts] = useState<CommunityPostItem[]>(INITIAL_POSTS);
  const [newContent, setNewContent] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Kinh nghiệm');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ post_1: true });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [chatInputText, setChatInputText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUserKycVerified = user.kycStatus === 'verified';

  const tags = ['Tất cả', 'Thuật toán FYP', 'Kinh nghiệm Booking', 'Bí quyết Hook 3s', 'Mắt Xem Live', 'Chiến Dịch'];

  // Handle local image file upload (STRICTLY IMAGES ONLY - NO VIDEOS)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Hệ thống chỉ hỗ trợ tải ảnh (PNG/JPG/WebP). Nghiêm cấm tải video theo chuẩn Facebook Feed!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ Ảnh vượt quá kích thước cho phép (tối đa 5MB). Vui lòng chọn ảnh khác!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedImage(event.target.result);
        showToast('📸 Đã đính kèm ảnh thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick preset photos
  const handleSelectPresetImage = (url: string, label: string) => {
    setUploadedImage(url);
    showToast(`✓ Đã đính kèm ảnh: ${label}`);
  };

  const handleCreatePost = () => {
    if (!newContent.trim() && !uploadedImage) return;

    if (isUserKycVerified) {
      // KYC Verified: Auto-publish immediately
      const newPost: CommunityPostItem = {
        id: `post_${Date.now()}`,
        author: {
          name: user.name,
          handle: user.tiktokHandle || user.tiktokConnected || '@creator',
          role: `${user.rankLevel} Creator`,
          avatar: user.avatar,
          verified: true,
          isKycVerified: true
        },
        time: 'Vừa xong',
        tag: selectedTag,
        content: newContent,
        image: uploadedImage || undefined,
        likes: 1,
        commentsCount: 0,
        shares: 0,
        isLiked: true,
        commentsList: [],
        status: 'published'
      };
      setPosts([newPost, ...posts]);
      setNewContent('');
      setUploadedImage(null);
      showToast('🎉 Bài viết của bạn đã được đăng công khai lên Bảng Tin Facebook Cộng đồng!');
    } else {
      // Unverified KYC: Send to Admin approval queue
      const pendingPost: CommunityPostItem = {
        id: `post_${Date.now()}`,
        author: {
          name: user.name,
          handle: user.tiktokHandle || user.tiktokConnected || '@creator',
          role: 'Thành viên mới',
          avatar: user.avatar,
          verified: false,
          isKycVerified: false
        },
        time: 'Đang chờ duyệt',
        tag: selectedTag,
        content: newContent,
        image: uploadedImage || undefined,
        likes: 0,
        commentsCount: 0,
        shares: 0,
        commentsList: [],
        status: 'pending_approval'
      };
      setPosts([pendingPost, ...posts]);
      setNewContent('');
      setUploadedImage(null);
      showToast('🛡️ Bài viết đã gửi phê duyệt! Vì tài khoản chưa KYC CCCD, bài sẽ được Admin duyệt trước khi hiển thị công khai để chống spam.');
    }
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newCmt: CommentItem = {
      id: `c_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.tiktokHandle || user.tiktokConnected || '@ban',
      authorAvatar: user.avatar,
      content: text,
      time: 'Vừa xong'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          commentsList: [...p.commentsList, newCmt]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    showToast('✓ Đã gửi bình luận của bạn!');
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim() || !activeChatUser) return;
    sendChatMessage(activeChatUser.handle, chatInputText.trim());
    setChatInputText('');
  };

  const filteredPosts = activeTag === 'Tất cả' 
    ? posts 
    : posts.filter(p => p.tag === activeTag);

  // Find active chat messages
  const currentChatMessages = activeChatUser ? (chatConversations[activeChatUser.handle] || []) : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Banner Chuẩn Facebook Creator Community */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-blue-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold mb-2 border border-blue-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BẢNG TIN CỘNG ĐỒNG CREATOR • GIAO DIỆN CHUẨN FACEBOOK</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Mạng Xã Hội Giao Lưu, Kết Bạn &amp; Nhắn Tin Trực Tiếp
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Đăng ảnh chia sẻ thành tích, kết bạn trực tiếp, trao đổi chéo follow và chat Messenger thời gian thực giữa 150,000+ KOC, Creator và Chủ shop TikTok.
            </p>
          </div>

          {/* KYC Status Badge in Header */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3 shrink-0">
            {isUserKycVerified ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-white text-xs font-black">TÀI KHOẢN ĐÃ KYC</div>
                  <div className="text-[10px] text-emerald-400">Đăng ảnh &amp; bài viết tức thì</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-300 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-white text-xs font-black">CHƯA KYC CCCD</div>
                  <div className="text-[10px] text-amber-300">Bài viết qua kiểm duyệt chống spam</div>
                </div>
                <button
                  onClick={openKycModal}
                  className="ml-1 px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[10px] font-black hover:bg-amber-400 transition-colors"
                >
                  KYC Ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Feed, Right is Friends & Chat Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* FACEBOOK STYLE CREATE POST BOX */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0D111E] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt=""
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-xs">{user.name}</span>
                  {isUserKycVerified && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> KYC
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Công khai với toàn bộ cộng đồng Creator
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Bạn có kinh nghiệm gì hay muốn chia sẻ? Tải ảnh chụp kênh TikTok, bill nhận xu hoặc bằng chứng cắn đề xuất tại đây..."
              className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-sans leading-relaxed resize-none"
            />

            {/* Image Preview Banner if selected (Co giãn thông minh theo ảnh ngang, dọc, vuông) */}
            {uploadedImage && (
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/40 bg-black/60 flex items-center justify-center p-2 group">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="w-auto h-auto max-h-[550px] max-w-full object-contain rounded-xl shadow-2xl mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 hover:bg-rose-600 text-white transition-colors shadow-lg cursor-pointer"
                  title="Gỡ ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-md">
                  <span>✓ Khung hình co giãn thông minh (Ngang / Dọc 9:16 / Vuông) — Hiển thị 100% trọn vẹn</span>
                </div>
              </div>
            )}

            {/* Quick Upload & Preset Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
              {/* Hidden file input for uploading images */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2 flex-wrap">
                {/* Upload Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Tải ảnh lên</span>
                </button>

                {/* Quick preset photo buttons */}
                <button
                  type="button"
                  onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80', 'Ảnh Tăng Follow')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono border border-white/5"
                >
                  📸 Kênh TikTok
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80', 'Ảnh Bill Rút Tiền')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono border border-white/5"
                >
                  💰 Bill Rút Tiền
                </button>
              </div>

              {/* Tag Selection and Submit Button */}
              <div className="flex items-center gap-2">
                {!isUserKycVerified && (
                  <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Chờ duyệt
                  </span>
                )}
                <button
                  onClick={handleCreatePost}
                  disabled={!newContent.trim() && !uploadedImage}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all hover:scale-102"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Đăng Bài</span>
                </button>
              </div>
            </div>

            {/* Note strictly images only */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-blue-500/5 px-3 py-1.5 rounded-xl border border-blue-500/10">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Hệ thống hỗ trợ tải ảnh (PNG/JPG/WebP) tự động co giãn thông minh theo tỷ lệ thực tế (ngang, dọc TikTok 9:16, vuông 1:1), hiển thị trọn vẹn 100% không cắt xén.</span>
            </div>
          </div>

          {/* FILTER TAGS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTag === t
                    ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/30'
                    : 'bg-[#0D111E] border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'Tất cả' ? t : `#${t}`}
              </button>
            ))}
          </div>

          {/* POSTS FEED */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isPending = post.status === 'pending_approval';
              const isExpanded = expandedComments[post.id];
              const friendRecord = friends.find(f => f.handle === post.author.handle);
              const isFriend = friendRecord?.status === 'friends';
              const isSentInvite = friendRecord?.status === 'pending';
              const isSelf = post.author.handle === (user.tiktokHandle || user.tiktokConnected || '@creator');

              return (
                <div
                  key={post.id}
                  className={`p-5 sm:p-6 rounded-3xl bg-[#0D111E] border transition-all space-y-4 shadow-xl ${
                    isPending ? 'border-amber-500/40 bg-amber-950/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Post Header with Friend & Chat Action Buttons */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.author.avatar}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                        />
                        {friendRecord?.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0D111E]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white text-xs">{post.author.name}</span>
                          {post.author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                          {post.author.isKycVerified && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20 font-bold">
                              KYC
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            • {post.author.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {post.author.handle} • <span className="text-slate-500">{post.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Friend & Chat Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isSelf && (
                        <>
                          {/* Friendship Toggle Button */}
                          <button
                            onClick={() => toggleFriendship(post.author.handle, post.author.name, post.author.avatar, post.author.role)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                              isFriend
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                                : isSentInvite
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                            }`}
                            title={isFriend ? 'Bấm để hủy kết bạn' : isSentInvite ? 'Đã gửi lời mời' : 'Kết bạn'}
                          >
                            {isFriend ? (
                              <>
                                <UserCheck className="w-3 h-3 text-emerald-400" />
                                <span>Bạn bè</span>
                              </>
                            ) : isSentInvite ? (
                              <>
                                <Check className="w-3 h-3 text-amber-400" />
                                <span>Đã mời</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3" />
                                <span>Kết bạn</span>
                              </>
                            )}
                          </button>

                          {/* Direct Message (Chat) Button */}
                          <button
                            onClick={() => openChatWithUser({
                              name: post.author.name,
                              handle: post.author.handle,
                              avatar: post.author.avatar,
                              role: post.author.role
                            })}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-blue-500/20 hover:text-blue-400 text-slate-300 text-[10px] font-bold flex items-center gap-1 border border-white/10 transition-colors"
                            title="Nhắn tin Messenger"
                          >
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span>Nhắn tin</span>
                          </button>
                        </>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-cyan-300">
                        #{post.tag}
                      </span>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Chờ Admin Duyệt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {post.content}
                  </p>

                  {/* Attached Image (Co giãn thông minh theo khung hình ảnh - Ngang / Dọc / Vuông không cắt xén) */}
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center p-1.5">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="w-auto h-auto max-h-[580px] max-w-full object-contain rounded-xl mx-auto hover:scale-[1.01] transition-transform duration-300 shadow-md"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Actions Row (Like, Comment, Share) */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 font-bold transition-colors ${
                          post.isLiked ? 'text-blue-400' : 'hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comment toggle button */}
                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center gap-1.5 font-bold hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Bình luận</span>
                      </button>

                      {/* Share button */}
                      <button
                        onClick={() => openShareModal({
                          targetUrl: `https://tiktokfollow.vn/community/${post.id}`,
                          title: post.content.slice(0, 60) + '...'
                        })}
                        className="flex items-center gap-1.5 font-bold hover:text-cyan-400 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Chia sẻ</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      {post.shares} lượt chia sẻ
                    </div>
                  </div>

                  {/* COMMENTS SECTION */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-white/5 space-y-3">
                      {/* List of comments */}
                      <div className="space-y-2.5">
                        {post.commentsList.map((c) => (
                          <div key={c.id} className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs">
                            <img
                              src={c.authorAvatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                            />
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">{c.authorName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                              </div>
                              <p className="text-slate-300 leading-snug">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Comment input form */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Viết câu trả lời hoặc thảo luận..."
                          className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Facebook Friends & Messenger Online Sidebar */}
        <div className="space-y-6">

          {/* Box 1: Bạn Bè Trực Tuyến (Online Friends & Messenger Direct Chat) */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Bạn Bè Trực Tuyến ({friends.filter(f => f.isOnline).length})</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                Online
              </span>
            </div>

            <div className="divide-y divide-white/5 space-y-2.5 pt-1">
              {friends.map((friend) => (
                <div key={friend.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                      />
                      {friend.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0D111E]" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-slate-500 ring-2 ring-[#0D111E]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-xs font-bold truncate flex items-center gap-1">
                        <span>{friend.name}</span>
                        {friend.status === 'friends' && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {friend.role} • {(friend.tiktokFollowers ?? 0).toLocaleString()} FL
                      </div>
                    </div>
                  </div>

                  {/* Quick Action: Chat / Friend Toggle */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openChatWithUser(friend)}
                      className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors"
                      title="Mở Messenger chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleFriendship(friend.handle, friend.name, friend.avatar, friend.role)}
                      className={`p-1.5 rounded-lg transition-colors text-[10px] font-bold ${
                        friend.status === 'friends'
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-rose-500/20 hover:text-rose-400'
                          : friend.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-white/10 hover:bg-blue-600 text-white'
                      }`}
                      title={friend.status === 'friends' ? 'Đã là bạn bè' : friend.status === 'pending' ? 'Đã gửi kết bạn' : 'Kết bạn'}
                    >
                      {friend.status === 'friends' ? (
                        <UserCheck className="w-3.5 h-3.5" />
                      ) : friend.status === 'pending' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <UserPlus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Quy Tắc Trao Đổi Follow & Chat Văn Minh */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase font-mono flex items-center gap-1.5 text-blue-400">
              <TrendingUp className="w-4 h-4" />
              <span>Cơ Chế Trao Đổi Kênh Văn Minh</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Chỉ hỗ trợ <strong className="text-white">tải ảnh lên</strong> (chụp phân tích kênh TikTok, bill nhận tiền), nghiêm cấm tải video.</li>
              <li>Kết bạn để cùng nhau lập đội xem live giữ mắt 3-5 phút, kéo thuật toán TikTok.</li>
              <li>Nhắn tin Messenger trực tiếp để trao đổi chéo follow thật 100% không tụt.</li>
              <li>Hệ thống tự động trừ <strong className="text-neonGold">50.000 Xu</strong> khi kích hoạt Đẩy Top chiến dịch lên trang nhất.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* FLOATING FACEBOOK MESSENGER CHAT POPUP (Direct 1-on-1 Realtime Chat) */}
      {activeChatUser && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 rounded-2xl bg-[#0f172a] border border-blue-500/40 shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Messenger Header */}
          <div className="p-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={activeChatUser.avatar}
                  alt={activeChatUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-black" />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>{activeChatUser.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-cyan-200" />
                </div>
                <div className="text-[10px] text-blue-100 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Đang hoạt động • {activeChatUser.handle}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={closeChat}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
                title="Đóng cửa sổ chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Chat Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-900/90 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            {[
              '👋 Chào bạn!',
              '🤝 Trao đổi follow TikTok nha!',
              '🔥 Kênh bạn cắn FYP đỉnh quá!',
              '💰 Nhận tiền xong chưa bạn?'
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  sendChatMessage(activeChatUser.handle, chip);
                }}
                className="px-2 py-1 rounded-full bg-white/5 hover:bg-blue-600/30 text-slate-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="p-3.5 space-y-3 h-64 overflow-y-auto bg-[#0a0f1d]/95 font-sans">
            {currentChatMessages.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="text-white text-xs font-bold">Bắt đầu trò chuyện với {activeChatUser.name}</div>
                <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Gửi lời chào hoặc đề xuất trao đổi follow, phối hợp xem live TikTok trực tiếp ngay tại đây!
                </div>
              </div>
            ) : (
              currentChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isMe
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Messenger Input Form */}
          <form onSubmit={handleSendChat} className="p-2.5 bg-slate-900 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder={`Nhắn tin cho ${activeChatUser.name}...`}
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 font-sans"
              autoFocus
            />
            <button
              type="submit"
              disabled={!chatInputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
