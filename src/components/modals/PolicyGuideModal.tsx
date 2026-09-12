import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Flame, 
  Coins, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  ChevronRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  Zap,
  Users,
  Radio,
  Clock,
  ShieldCheck,
  MessageSquare,
  Heart
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { 
  LIVE_VIEWER_TIERS, 
  LIVE_MILESTONE_REWARDS, 
  LIVE_BUYER_PACKAGES_POLICY,
  LIVE_METERING_POLICY 
} from '../../data/livePolicyData';

export const PolicyGuideModal: React.FC = () => {
  const { isPolicyOpen, closePolicy, openRunner, tasks } = useTikTokApp();
  const [activeTab, setActiveTab] = useState<'rewards' | 'livestream' | 'tiers' | 'unfollow' | 'blueprint' | 'clients'>('rewards');

  if (!isPolicyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0D111E] border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold mb-1">
                <Sparkles className="h-3 w-3" /> CHÍNH SÁCH CHUẨN THUẬT TOÁN AVA FOLLOW 2026
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                Cẩm Nang Quy Chuẩn, Mắt Xem Live & Quyền Lợi Đôi Bên
              </h2>
            </div>
          </div>

          <button
            onClick={closePolicy}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-white/10 overflow-x-auto bg-black/30 text-xs font-mono">
          {[
            { id: 'rewards', label: 'Bảng Điểm Thưởng & Tỷ Giá' },
            { id: 'livestream', label: 'Mắt Xem Live (Win - Win)' },
            { id: 'tiers', label: 'Cấp Bậc & Tăng Cấp' },
            { id: 'unfollow', label: 'Chống Gian Lận (0% Bot)' },
            { id: 'blueprint', label: 'Lộ Trình Kiếm 1 Triệu/Ngày' },
            { id: 'clients', label: 'Dành Cho Khách Mua Gói' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 font-bold whitespace-nowrap transition-all border-b-2 rounded-t-xl ${
                activeTab === tab.id
                  ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm">
          {/* TAB 1: Bảng Điểm Thưởng & Tỷ Giá */}
          {activeTab === 'rewards' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black border border-rose-500/20">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Coins className="h-4 w-4 text-neonGold" />
                  <span>Quy ước Tỷ Giá Đổi 2 Chiều Minh Bạch Tuyệt Đối</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
                    <div className="text-[11px] text-slate-400 font-mono">1 Xu thưởng</div>
                    <div className="text-base font-black text-neonGold font-mono mt-0.5">= 1 VNĐ</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
                    <div className="text-[11px] text-slate-400 font-mono">1 Token Sàn</div>
                    <div className="text-base font-black text-neonGold font-mono mt-0.5">= 1,000 VNĐ (1,000 Xu)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-slate-400 font-mono">Hạn mức rút tối thiểu</div>
                    <div className="text-base font-black text-emerald-400 font-mono mt-0.5">50,000đ (KYC CCCD)</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-3">
                  Bảng Điểm Thưởng Từng Hành Động Tương Tác
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Hành động</th>
                        <th className="p-3">Yêu cầu chuẩn thuật toán</th>
                        <th className="p-3 text-right">Xu nhận được</th>
                        <th className="p-3 text-right">Quy đổi VNĐ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="p-1 rounded bg-rose-500/20 text-rose-400">👤</span> Follow Kênh TikTok
                        </td>
                        <td className="p-3 text-slate-400">Bấm theo dõi, giữ follow tối thiểu 30 ngày</td>
                        <td className="p-3 text-right font-mono font-bold text-neonGold">+500 Xu</td>
                        <td className="p-3 text-right font-mono text-emerald-400">500đ</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="p-1 rounded bg-purple-500/20 text-purple-400">⏱️</span> Xem Video 15 giây
                        </td>
                        <td className="p-3 text-slate-400">Xem hết 15s để TikTok ghi nhận lượt xem thật (Retention)</td>
                        <td className="p-3 text-right font-mono font-bold text-neonGold">+100 Xu</td>
                        <td className="p-3 text-right font-mono text-emerald-400">100đ</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="p-1 rounded bg-pink-500/20 text-pink-400">❤️</span> Thả Tim Video
                        </td>
                        <td className="p-3 text-slate-400">Thả tim sau khi đã xem tối thiểu 5s</td>
                        <td className="p-3 text-right font-mono font-bold text-neonGold">+100 Xu</td>
                        <td className="p-3 text-right font-mono text-emerald-400">100đ</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">💬</span> Bình Luận Seeding
                        </td>
                        <td className="p-3 text-slate-400">Viết bình luận có tâm trên 10 từ hoặc theo kịch bản giỏ hàng</td>
                        <td className="p-3 text-right font-mono font-bold text-neonGold">+350 Xu</td>
                        <td className="p-3 text-right font-mono text-emerald-400">350đ</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">🔴</span> Xem Livestream / Phút
                        </td>
                        <td className="p-3 text-slate-400">Xem live, tap tim và vượt qua mini-captcha chống bot</td>
                        <td className="p-3 text-right font-mono font-bold text-neonGold">300 - 600 Xu / phút</td>
                        <td className="p-3 text-right font-mono text-emerald-400">300đ - 600đ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUY CHUẨN MẮT XEM LIVE (WIN - WIN) */}
          {activeTab === 'livestream' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-cyan-950/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs uppercase">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span>Quy Chuẩn Vận Hành Mắt Xem Live TikTok Shop (Đôi Bên Cùng Có Lợi)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Mắt xem tại AVA FOLLOW là <strong>100% người dùng thật đang dùng điện thoại</strong>. Khách mua gói được bảo đảm mắt xem ổn định suốt phiên live và tự động hoàn tiền nếu live ngắt sớm. Người xem được trả thù lao chuẩn xác theo từng phút và các mốc thưởng giữ chân.
                </p>
              </div>

              {/* Part 1: Quyền lợi người mua gói */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>1. Quyền Lợi Dành Cho Người Mua Gói (Chủ Shop / Brand)</span>
                  </h4>
                  <span className="text-[10px] text-neonGold font-mono font-bold">Thanh Toán Token Giảm -10%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-bold text-white text-xs text-rose-400">Bắn Thông Báo Khẩn (Live Push)</div>
                    <p className="text-slate-400 text-xs">
                      Khi bắt đầu live, hệ thống gửi thông báo cho hơn 154,200+ tài khoản. Mắt xem tăng vọt trong 2-3 phút đầu tiên để bắt nhịp thuật toán TikTok.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-bold text-white text-xs text-emerald-400">Cam Kết Giữ Mắt (Retention Guarantee)</div>
                    <p className="text-slate-400 text-xs">
                      Đảm bảo giữ mắt đều đặn 60p, 120p, 180p. Nếu có người xem rớt mạng hoặc thoát sớm, hệ thống tự động bù mắt người thật khác trong 15 giây.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-bold text-white text-xs text-cyan-400">Trừ Token Chuẩn Theo Phút Thực Tế</div>
                    <p className="text-slate-400 text-xs">
                      Chỉ trừ tiền các phút phát sóng thực tế. Nếu shop hết hàng tắt live sớm, sàn tự động hoàn trả 100% số phút chưa dùng về ví ngay!
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-bold text-white text-xs text-amber-400">Kho Kịch Bản Seeding Giỏ Hàng Mẫu</div>
                    <p className="text-slate-400 text-xs">
                      Cung cấp sẵn các câu bình luận hỏi giá, hỏi size, chốt đơn theo 6 ngành hàng, kích thích khách hàng tranh nhau mua (FOMO).
                    </p>
                  </div>
                </div>
              </div>

              {/* Part 2: Quyền lợi người xem */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-neonGold" />
                  <span>2. Bảng Thù Lao & Thưởng Giữ Chân Cho Người Xem Live</span>
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Hạng Thành Viên</th>
                        <th className="p-3">Thù Lao / Phút</th>
                        <th className="p-3">Giới Hạn Phiên / Ngày</th>
                        <th className="p-3 text-right">Ước Tính Thu Nhập</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {LIVE_VIEWER_TIERS.map((tier) => (
                        <tr key={tier.rank} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white flex items-center gap-1.5">
                            <span>{tier.icon}</span>
                            <span>Hạng {tier.rank} ({tier.levelGiftCoinsFormatted} & {tier.levelGiftFollowersFormatted})</span>
                          </td>
                          <td className="p-3 font-mono text-neonGold">{tier.rewardPerMinuteVND}</td>
                          <td className="p-3 font-mono text-slate-400">{tier.maxSessionsPerDay === 999 ? 'Không giới hạn' : `${tier.maxSessionsPerDay} Live/ngày`}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">{tier.estimatedDailyVND}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Milestones chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                  {LIVE_MILESTONE_REWARDS.map((m) => (
                    <div key={m.minutes} className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center">
                      <div className="text-slate-400 text-[10px]">{m.label}</div>
                      <div className="text-sm font-black text-neonGold mt-0.5">+{m.bonusCoins.toLocaleString()} Xu</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cấp Bậc & Tăng Cấp */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Hệ thống thăng hạng cấp bậc dựa trên mức độ tích cực và độ uy tín. Cấp càng cao, phần thưởng thăng cấp (Xu tươi + Follower thật) và quà nhiệm vụ ngày càng lớn:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-500 font-mono text-xs">🥉 HẠNG ĐỒNG (TÂN THỦ)</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">+5,000 Xu & +50 Follow</span>
                  </div>
                  <p className="text-slate-400 text-xs">Tặng khởi nghiệp khi liên kết TikTok. Hạn mức 5 phiên live/ngày. Thưởng làm đủ live: +1,000 Xu/ngày.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 font-mono text-xs">🥈 HẠNG BẠC (ACTIVE CREATOR)</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">+20,000 Xu & +200 Follow</span>
                  </div>
                  <p className="text-slate-400 text-xs">Thưởng thăng cấp ngay +20k Xu & +200 Follow thật. Nâng hạn mức 12 phiên live/ngày. Thưởng hoàn thành nhiệm vụ ngày: +2,000 Xu & 1 Vé Vòng Quay May Mắn.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 font-mono text-xs">🥇 HẠNG VÀNG (PRO INFLUENCER)</span>
                    <span className="text-[10px] font-mono text-neonGold font-bold">+80,000 Xu & +1,000 Follow</span>
                  </div>
                  <p className="text-slate-400 text-xs">Thưởng thăng cấp +80k Xu & +1,000 Follow thật vào kênh. Hạn mức 25 live/ngày. Miễn phí KYC, ưu tiên duyệt hồ sơ giải ngân nhanh. Quà nhiệm vụ ngày: +8,000 Xu & +50 Follow.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 space-y-2 bg-gradient-to-br from-purple-950/20 to-black">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 font-mono text-xs">💎 HẠNG KIM CƯƠNG (ELITE VIP)</span>
                    <span className="text-[10px] font-mono text-purple-300 font-bold">+300,000 Xu & +3,000 Follow</span>
                  </div>
                  <p className="text-slate-400 text-xs">Thưởng thăng cấp khủng +300k Xu & +3,000 Follow thật. Xem KHÔNG GIỚI HẠN phiên live. Ưu tiên duyệt lệnh rút tiền và giải ngân sớm nhất. Quà nhiệm vụ ngày: +25,000 Xu & +100 Follow.</p>
                </div>
              </div>

              {/* BẢNG CHÍNH SÁCH CẤP BẬC HOA HỒNG AFFILIATE (20% - 35%) */}
              <div className="mt-6 p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-black border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold font-display text-sm">
                    <DollarSign className="w-5 h-5 text-neonGold" />
                    <span>BẢNG CHÍNH SÁCH CẤP BẬC HOA HỒNG AFFILIATE (20% - 35%)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Quy Mô Cộng Đồng
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Cấp Bậc Đại Lý</th>
                        <th className="p-3">Quy Mô F1 Giới Thiệu</th>
                        <th className="p-3 text-right">Tỷ Lệ Hoa Hồng</th>
                        <th className="p-3">Điều Kiện Áp Dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-slate-300">🥈 Hạng Bạc (Khởi Nghiệp)</td>
                        <td className="p-3">1 - 20 thành viên</td>
                        <td className="p-3 text-right font-black text-amber-400 font-mono-numbers">20%</td>
                        <td className="p-3 text-slate-400">Đơn mua / nạp đầu tiên của F1</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-amber-400">🥇 Hạng Vàng (Chuyên Nghiệp)</td>
                        <td className="p-3">21 - 50 thành viên</td>
                        <td className="p-3 text-right font-black text-amber-400 font-mono-numbers">25%</td>
                        <td className="p-3 text-slate-400">Đơn mua / nạp đầu tiên của F1</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-cyan-300">🏆 Hạng Bạch Kim (KOL / Leader)</td>
                        <td className="p-3">51 - 100 thành viên</td>
                        <td className="p-3 text-right font-black text-neonGold font-mono-numbers">30%</td>
                        <td className="p-3 text-slate-400">Đơn mua / nạp đầu tiên của F1</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] bg-purple-500/5">
                        <td className="p-3 font-bold text-purple-300">💎 Hạng Kim Cương (Cộng Đồng Lớn)</td>
                        <td className="p-3 text-purple-200">Trên 100 thành viên</td>
                        <td className="p-3 text-right font-black text-neonGold font-mono-numbers">35%</td>
                        <td className="p-3 text-purple-300">Đơn mua / nạp đầu tiên của F1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Chống Gian Lận */}
          {activeTab === 'unfollow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <div className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>Quy Chuẩn Chống Bỏ Theo Dõi (Anti-Unfollow API) & Chống Treo Máy Ảo</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Để bảo vệ quyền lợi tối đa cho các đối tác shop bỏ tiền ra mua dịch vụ, hệ thống quét ngầm 24/7 kiểm tra trạng thái tương tác của tài khoản:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="font-bold text-white">1. Cam kết giữ follow tối thiểu 30 ngày:</div>
                  <p className="text-slate-400">Nếu tài khoản bỏ follow trước thời hạn, hệ thống sẽ tự động trừ gấp đôi số Xu đã nhận và khóa quyền rút tiền.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="font-bold text-white">2. Mini-captcha chống bot khi xem Livestream:</div>
                  <p className="text-slate-400">Người xem live cần tap tim và xác thực hộp quà ngẫu nhiên trong 15s để chứng minh người thật, nhận thêm +200 Xu.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="font-bold text-white">3. Xác minh danh tính CCCD (KYC) chính chủ:</div>
                  <p className="text-slate-400">Mỗi công dân chỉ được sử dụng 1 tài khoản duy nhất tương ứng với số CCCD và tài khoản ngân hàng chính chủ để rút tiền.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Kế Hoạch 1 Triệu/Ngày */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Công thức kết hợp 4 nguồn thu nhập trên ứng dụng để đạt mục tiêu 1,000,000đ/ngày bền vững:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">1. Xem Video & Nhiệm Vụ Follow Đơn Lẻ</div>
                    <div className="text-[11px] text-slate-400">Lướt 60 - 80 video/ngày khi rảnh</div>
                  </div>
                  <div className="text-right font-mono font-bold text-neonGold">+150,000đ</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">2. Xem Livestream TikTok Shop (3 - 5 phiên)</div>
                    <div className="text-[11px] text-slate-400">Cắm xem live 15p + Thả tim + Seeding giỏ hàng</div>
                  </div>
                  <div className="text-right font-mono font-bold text-neonGold">+200,000đ</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">3. Nhận Hợp Đồng Booking KOC / Review</div>
                    <div className="text-[11px] text-slate-400">Quay 1 video review sản phẩm 60s cho Brand</div>
                  </div>
                  <div className="text-right font-mono font-bold text-neonGold">+500,000đ</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">4. Hoa Hồng Tiếp Thị Liên Kết (Affiliate 25%)</div>
                    <div className="text-[11px] text-slate-400">Giới thiệu 3 - 5 bạn bè hoặc shop nạp tiền</div>
                  </div>
                  <div className="text-right font-mono font-bold text-neonGold">+150,000đ</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono">
                  <div className="font-black text-white text-sm">TỔNG THU NHẬP MỤC TIÊU MỖI NGÀY</div>
                  <div className="font-black text-emerald-400 text-lg">1,000,000đ / ngày</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Dành Cho Khách Mua Gói */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Dành cho các chủ kênh, shop bán hàng online và các thương hiệu muốn xây dựng kênh TikTok uy tín, đẩy video vào tab For You Page (FYP):
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="font-bold text-white text-xs">1. Nạp tiền tự động qua SePay VietQR:</div>
                  <p className="text-slate-400 text-xs">
                    Quét mã QR chuyển khoản chính xác nội dung hiển thị. Hệ thống SePay khớp lệnh và cộng Xu tự động trong <strong>3 giây</strong>, hoạt động 24/7 kể cả ngày lễ và ban đêm.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="font-bold text-white text-xs">2. Tạo chiến dịch tăng trưởng tùy chỉnh:</div>
                  <p className="text-slate-400 text-xs">
                    Nhập link kênh TikTok, chọn số lượng follow mong muốn (từ 1,000 đến 50,000 follow). Bạn có thể yêu cầu người theo dõi phải xem video 15s trước khi bấm follow để tránh bị bóp tương tác.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                  <div className="font-bold text-white text-xs">3. Cam kết người dùng thật 100%:</div>
                  <p className="text-slate-400 text-xs">
                    Follow được phân phối trực tiếp cho hàng chục ngàn người dùng thật đang hoạt động trên hệ thống. Bảo hành tụt follow trong 60 ngày, bù follow miễn phí nếu phát hiện hao hụt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Hệ thống tuân thủ 100% chính sách cộng đồng TikTok Shop 2026
          </span>
          <button
            onClick={closePolicy}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all font-mono cursor-pointer"
          >
            Đã Hiểu, Bắt Đầu Vận Hành Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
