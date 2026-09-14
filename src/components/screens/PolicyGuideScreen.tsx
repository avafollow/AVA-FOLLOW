import React, { useState } from 'react';
import { 
  Award, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  ChevronRight,
  BookOpen,
  Sparkles,
  Zap,
  Users,
  Radio,
  Clock,
  MessageSquare,
  Heart,
  UserPlus,
  Share2
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  LIVE_VIEWER_TIERS, 
  LIVE_MILESTONE_REWARDS 
} from '../../data/livePolicyData';
import { AFFILIATE_TIER_LEVELS } from '../../data/mockData';
import { TEN_TIERS_LIST, getRankTierConfig } from '../../data/weeklyMissions';
import { AffiliateTierInfo } from '../../types';

export const PolicyGuideScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { user } = useTikTokApp();
  const [activeTab, setActiveTab] = useState<'tiers' | 'affiliate_tiers' | 'rules' | 'three_task_types'>('three_task_types');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-[#0D111E] border border-purple-500/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold mb-1">
              <Sparkles className="h-3.5 w-3.5" /> CHÍNH SÁCH CẤP BẬC & QUYỀN LỢI THÀNH VIÊN
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Bảng Chính Sách Cấp Bậc & Tiêu Chuẩn Hoạt Động
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Phân biệt rõ ràng 3 luồng nhiệm vụ (Follow chéo, Chiến dịch, Nhiệm vụ sàn cấp), hệ số thưởng cấp bậc và tiêu chuẩn an toàn.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        {[
          { id: 'three_task_types' as const, label: '3 LOẠI TƯƠNG TÁC (FOLLOW CHÉO • CHIẾN DỊCH • NHIỆM VỤ DỰ ÁN)', icon: Sparkles },
          { id: 'tiers' as const, label: 'CẤP BẬC THÀNH VIÊN (ĐỒNG → KIM CƯƠNG)', icon: Award },
          { id: 'affiliate_tiers' as const, label: 'CẤP BẬC HOA HỒNG (20% - 35%)', icon: TrendingUp },
          { id: 'rules' as const, label: 'QUY CHUẨN AN TOÀN CHỐNG SPAM', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 font-black' 
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: 3 LOẠI TƯƠNG TÁC CHÍNH (CƠ CHẾ RẠCH RÒI DÒNG TIỀN & THƯỞNG) */}
      {activeTab === 'three_task_types' && (
        <div className="space-y-6">
          {/* Banner Giới Thiệu Tổng Quan */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-cyan-950/40 border-2 border-rose-500/40 shadow-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-black font-black font-mono text-xs uppercase tracking-wider">
                HƯỚNG DẪN ĐỘC QUYỀN
              </span>
              <span className="text-xs font-mono text-rose-300 font-bold">
                Phân Biệt Rạch Ròi 3 Cơ Chế Kiếm Tiền & Trả Thưởng
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Quy Chế Hoạt Động & Cơ Chế Phân Phối Dòng Tiền Giữa 3 Loại Nhiệm Vụ
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Nhằm đảm bảo tính minh bạch, công bằng và phát triển bền vững cho cộng đồng, Sàn quy định rõ ràng giữa 3 loại tương tác: 
              <strong className="text-cyan-300"> Follow Chéo</strong>, 
              <strong className="text-amber-300"> Chiến Dịch Trả Xu Trực Tiếp</strong> và 
              <strong className="text-rose-300"> Nhiệm Vụ Dự Án Sàn Cấp</strong>.
            </p>
          </div>

          {/* 3 Thẻ Trụ Cột Lớn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Cột 1: Follow Chéo (Trao Đổi Tương Tác) */}
            <div className="p-5 rounded-3xl bg-[#0D111E] border-2 border-cyan-500/40 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/30">
                    LOẠI 1 • CỘNG ĐỒNG
                  </span>
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-base font-black text-white">
                  1. FOLLOW CHÉO (TƯƠNG TÁC TỰ DO)
                </h4>
                <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-cyan-300">Cơ chế trao đổi:</div>
                  <p className="text-[11px] leading-relaxed">
                    • <strong>Người đi Follow/Xem:</strong> Nhận trực tiếp Xu cho từng lượt thực hiện (VD: +200 Xu/follow, +100 Xu/tim).<br />
                    • <strong>Người cần Follow:</strong> Đổi lại số lượt tương tác tương ứng cho kênh của mình mà không mất tiền mua gói.
                  </p>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-white text-[11px]">Dòng tiền:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Cộng thẳng vào ví người làm tương tác ngay sau khi hoàn thành.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-cyan-300">
                ✓ Phù hợp cho người mới bắt đầu kiếm vốn tiêu vặt
              </div>
            </div>

            {/* Cột 2: Chiến Dịch Doanh Nghiệp (Paid Campaigns) */}
            <div className="p-5 rounded-3xl bg-[#0D111E] border-2 border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
                    LOẠI 2 • TRẢ TIỀN MẶT
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-base font-black text-white">
                  2. CHIẾN DỊCH ĐỐI TÁC TRẢ XU TRỰC TIẾP
                </h4>
                <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-amber-300">Cơ chế ngân sách:</div>
                  <p className="text-[11px] leading-relaxed">
                    • Doanh nghiệp/Chủ shop nạp ngân sách trả trước để thuê người dùng tương tác.<br />
                    • Người dùng làm nhiệm vụ chiến dịch nào sẽ <strong>nhận trực tiếp số Xu của chiến dịch đó</strong> ngay lập tức (VD: Xem live 1p-60p nhận 300đ-7.200đ, xem video đối tác nhận 500đ).
                  </p>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-white text-[11px]">Dòng tiền:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Trừ từ ngân sách ký quỹ của bên thuê chuyển thẳng vào ví người làm. Có số lượng suất giới hạn (hết suất thì đóng chiến dịch).
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-amber-300">
                ✓ Thù lao cao • Cạnh tranh suất nhanh tay
              </div>
            </div>

            {/* Cột 3: Nhiệm Vụ Dự Án Bắt Buộc (Sàn Cấp) */}
            <div className="p-5 rounded-3xl bg-[#0D111E] border-2 border-rose-500/50 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden ring-1 ring-rose-500/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] border border-rose-500/30">
                    LOẠI 3 • DỰ ÁN SÀN CẤP
                  </span>
                  <Award className="w-5 h-5 text-rose-400" />
                </div>
                <h4 className="text-base font-black text-white">
                  3. NHIỆM VỤ DỰ ÁN & ĐỀ XUẤT CẤP BẬC
                </h4>
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-rose-300">Cơ chế dòng tiền & trả thưởng:</div>
                  <p className="text-[11px] leading-relaxed">
                    • <strong>Nguồn nhiệm vụ:</strong> Lấy từ các tài khoản cần follow số lượng nhỏ trong hệ thống.<br />
                    • <strong>Dòng tiền:</strong> Toàn bộ phí của người cần follow <strong className="text-rose-400">đẩy ngược về trả cho Dự Án & Sàn</strong>.<br />
                    • <strong>Không thưởng Xu lẻ:</strong> Bạn đi follow/tim/cmt trong nhiệm vụ này <strong className="text-rose-400">KHÔNG ĐƯỢC NHẬN XU LẺ</strong> cho từng click.<br />
                    • <strong>Chỉ thưởng tổng:</strong> Bạn phải <strong>hoàn thành đủ 100% nhiệm vụ</strong> thì mới được bấm nhận <strong>SỐ XU TỔNG</strong> từ quỹ Sàn cấp.
                  </p>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-emerald-400 text-[11px]">Lợi ích tối thượng:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Là điều kiện bắt buộc mỗi ngày để <strong>nâng cấp bậc (Đồng → Bạc → Vàng → Kim Cương)</strong>. Cấp bậc càng cao, tài khoản bạn càng <strong>được hệ thống đề xuất ưu tiên</strong> nhận nhiều chiến dịch lớn, mở nhiều slot nhiệm vụ và nhân hệ số thu nhập tới <strong>x3.0</strong>!
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-emerald-400">
                ★ Chìa khóa tăng trưởng tài khoản & thu nhập bền vững
              </div>
            </div>
          </div>

          {/* Bảng So Sánh Chi Tiết 3 Loại */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl overflow-x-auto">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> BẢNG SO SÁNH MINH BẠCH 3 HÌNH THỨC TƯƠNG TÁC
            </h4>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/5">
                  <th className="text-left py-2.5 px-3">Tiêu Chí</th>
                  <th className="text-left py-2.5 px-3 text-cyan-300">1. Follow Chéo Cộng Đồng</th>
                  <th className="text-left py-2.5 px-3 text-amber-300">2. Chiến Dịch Trả Xu Trực Tiếp</th>
                  <th className="text-left py-2.5 px-3 text-rose-300">3. Nhiệm Vụ Dự Án Sàn Cấp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">Nguồn Lấy Kênh</td>
                  <td className="py-2.5 px-3">Người dùng trong cộng đồng tự đăng</td>
                  <td className="py-2.5 px-3">Doanh nghiệp / Khách mua gói nạp ngân sách</td>
                  <td className="py-2.5 px-3">Hệ thống chọn lọc từ các yêu cầu follow sàn</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">Dòng Tiền Nạp Kênh</td>
                  <td className="py-2.5 px-3">Không có tiền nạp (trao đổi chéo)</td>
                  <td className="py-2.5 px-3">Khách nạp cọc vào két Smart Escrow</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">Đẩy ngược 100% về cho Sàn & Dự Án</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">Cách Nhận Xu</td>
                  <td className="py-2.5 px-3">Cộng lẻ từng thao tác (+200 Xu/follow)</td>
                  <td className="py-2.5 px-3">Cộng trực tiếp theo từng chiến dịch tham gia</td>
                  <td className="py-2.5 px-3 text-rose-400 font-bold">KHÔNG CỘNG LẺ • Chỉ nhận thưởng tổng khi đủ 100%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">Số Lượng Nhiệm Vụ</td>
                  <td className="py-2.5 px-3">Tùy nhu cầu người dùng lướt</td>
                  <td className="py-2.5 px-3">Có giới hạn suất (First-come, first-served)</td>
                  <td className="py-2.5 px-3">Cố định mỗi ngày/tuần theo Cấp Bậc tài khoản</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">Tác Dụng Chính</td>
                  <td className="py-2.5 px-3">Kiếm thêm Xu nhỏ & trao đổi follow</td>
                  <td className="py-2.5 px-3">Kiếm thu nhập tiền mặt trực tiếp</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">Tăng Rank Cấp Bậc, được Đề Xuất nhận việc VIP, x3.0 Thưởng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: CẤP BẬC THÀNH VIÊN (10 CẤP BẬC THĂNG TIẾN) */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          {/* Header 10 Cấp Bậc */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> HỆ THỐNG 10 CẤP BẬC NHIỆM VỤ & HỆ SỐ THÙ LAO
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Càng hoàn thành nhiều nhiệm vụ, cấp bậc càng tăng cao, mở rộng hạn mức ngày và nhân hệ số thưởng từ ×1.0 lên tới ×3.0 kèm Vòng Quay May Mắn!
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold shrink-0">
                Hạng hiện tại: {getRankTierConfig(user.rankLevel).badge}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TEN_TIERS_LIST.map((tier) => {
                const userTier = getRankTierConfig(user.rankLevel);
                const isCurrent = userTier.tierNumber === tier.tierNumber;
                return (
                  <div 
                    key={tier.name}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative ${
                      isCurrent 
                        ? 'bg-gradient-to-b from-rose-950/50 via-[#100a18] to-[#0D111E] border-rose-500 shadow-xl ring-1 ring-rose-400' 
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white font-display">{tier.badge}</span>
                      {isCurrent ? (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold font-mono">BẠN</span>
                      ) : (
                        <span className="text-[9px] text-amber-300 font-mono font-black">×{tier.rewardMultiplier} Thưởng</span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-white font-mono">
                      {tier.shortTitle}
                    </div>

                    <div className="text-[10px] text-emerald-400 font-mono space-y-0.5">
                      <div>📅 {tier.dailyMissionsCount} Ngày • 🏆 {tier.weeklyMissionsCount} Tuần</div>
                      <div className="text-pink-300 font-bold">🎡 +{tier.wheelSpinsBonus} Vòng Quay May Mắn</div>
                    </div>

                    <p className="text-[9px] text-slate-400 leading-tight">
                      {tier.description}
                    </p>

                    <div className="pt-1.5 border-t border-white/5 text-[9px] font-mono text-slate-400 flex justify-between">
                      <span>Mở khóa:</span>
                      <strong className="text-slate-300">{tier.minCompletedTasksToUnlock === 0 ? 'Mặc định' : `Tích lũy ${tier.minCompletedTasksToUnlock.toLocaleString('vi-VN')} nhiệm vụ`}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quyền Lợi Xem Livestream */}
          <div className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-white font-mono uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400" /> QUYỀN LỢI MẮT XEM LIVESTREAM THEO CẤP BẬC
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {LIVE_VIEWER_TIERS.map((tier) => {
                const isCurrent = user.rankLevel === tier.rank;
                return (
                  <div 
                    key={tier.rank}
                    className={`p-5 rounded-3xl border transition-all space-y-3 relative ${
                      isCurrent 
                        ? 'bg-gradient-to-b from-rose-950/40 to-black border-rose-500 shadow-xl shadow-rose-950/30' 
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white">
                        CẤP CỦA BẠN
                      </span>
                    )}
                    <div className="text-2xl font-black text-white">{tier.icon} Hạng {tier.rank}</div>
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/30 space-y-1">
                      <div className="text-[11px] font-mono text-amber-300 font-bold flex items-center justify-between">
                        <span>🎁 Thưởng Lên Cấp:</span>
                        <span className="text-neonGold font-black">{tier.levelGiftCoinsFormatted}</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                        <span>🚀 Tặng Follow Kênh:</span>
                        <span className="text-emerald-400 font-black">{tier.levelGiftFollowersFormatted}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
                      <div>• Hạn mức: <strong className="text-white">{tier.maxSessionsPerDay} Live/ngày</strong></div>
                      <div>• Thưởng/phút: <strong className="text-cyan-400">{tier.rewardPerMinuteVND}</strong> (chuẩn cố định)</div>
                      <div>• Quà nhiệm vụ ngày: <strong className="text-emerald-300">{tier.dailyFullTaskBonus}</strong></div>
                      <div>• Điều kiện: <span className="text-slate-400">{tier.requiredCondition}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CẤP BẬC HOA HỒNG */}
      {activeTab === 'affiliate_tiers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AFFILIATE_TIER_LEVELS.map((t: AffiliateTierInfo) => (
              <div key={t.tierId} className="p-5 rounded-3xl bg-[#0D111E] border border-white/10 space-y-3">
                <div className="text-xl font-black text-white">{t.name}</div>
                <div className="text-3xl font-black text-neonGold font-mono">{t.ratePercent}%</div>
                <div className="text-xs text-slate-300">
                  Quy mô F1: <strong className="text-emerald-400">{t.minMembers} - {t.maxMembers >= 999999 ? 'Không giới hạn' : t.maxMembers} thành viên</strong>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUY CHUẨN AN TOÀN */}
      {activeTab === 'rules' && (
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Tiêu Chuẩn Giữ An Toàn Kênh & Chống Spam 100%</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm">1. Giãn cách an toàn 3s - 5s</div>
              <p className="text-slate-400 leading-relaxed">
                Mỗi hành động đều có bộ đếm giờ tự nhiên, không dồn dập, giúp tài khoản TikTok hoàn toàn tự nhiên và không bị đánh dấu bất thường.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm">2. Xác thực 1 nhiệm vụ</div>
              <p className="text-slate-400 leading-relaxed">
                Tài khoản mới bắt buộc hoàn thành tối thiểu 1 nhiệm vụ xem video hoặc tương tác để kích hoạt quyền nhận thưởng Xu giới thiệu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm">3. Bảo hành chống tụt 15 - 30 ngày</div>
              <p className="text-slate-400 leading-relaxed">
                Hệ thống thuật toán tự động kiểm tra định kỳ 48h. Cam kết bảo hành chống tụt từ 15 đến 30 ngày, tự động bù đủ 100% nếu có hao hụt.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
