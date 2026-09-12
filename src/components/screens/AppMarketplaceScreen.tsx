import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Download, 
  Check, 
  Coins, 
  Key, 
  Layers, 
  Cpu, 
  Video, 
  TrendingUp, 
  Search, 
  Copy,
  CheckCircle2,
  X,
  QrCode
} from 'lucide-react';
import { useTikTokApp } from '../../context/TikTokAppContext';
import { SoftwareAppItem, AppLicensePurchase } from '../../types';
import { FeatureGuideTooltip } from '../common/FeatureGuideTooltip';

export const AppMarketplaceScreen: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const { 
    user, 
    softwareApps, 
    buySoftwareApp, 
    myAppLicenses,
    openDeposit 
  } = useTikTokApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppForPurchase, setSelectedAppForPurchase] = useState<SoftwareAppItem | null>(null);
  const [purchasedLicenseResult, setPurchasedLicenseResult] = useState<AppLicensePurchase | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_licenses'>('catalog');

  const CATEGORIES = [
    { id: 'all', label: `Tất Cả (${softwareApps.length})`, icon: Sparkles },
    { id: 'ai_script', label: 'AI Kịch Bản & Giọng Đọc', icon: Cpu },
    { id: 'video_tools', label: 'Xử Lý Video 4K & Audio', icon: Video },
    { id: 'analytics', label: 'Soi Đối Thủ & Trend', icon: TrendingUp },
    { id: 'tiktok_shop', label: 'TikTok Shop & Live', icon: ShoppingBag },
    { id: 'growth_auto', label: 'Tự Động Hóa & Đa Kênh', icon: Layers }
  ];

  const filteredApps = softwareApps.filter((app) => {
    if (activeCategory !== 'all' && app.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.title.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmPurchase = (app: SoftwareAppItem) => {
    if (user.avaliveCoins < app.priceXu) {
      alert(`Số dư Xu không đủ! Bạn cần ${app.priceXu.toLocaleString()} Xu (Hiện có: ${user.avaliveCoins.toLocaleString()} Xu). Bạn có thể bấm nút "Nạp Tiền Qua SePay VietQR" để nạp thêm Xu.`);
      return;
    }

    const license = buySoftwareApp(app.id, 'coins');
    if (license) {
      setSelectedAppForPurchase(null);
      setPurchasedLicenseResult(license);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-purple-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                CHỢ APP KIẾM TIỀN & CÔNG CỤ TĂNG TRƯỞNG TIKTOK
              </span>
              <FeatureGuideTooltip
                title="Chợ App Kiếm Tiền & Thanh Toán Bằng Xu"
                description="Hệ sinh thái công cụ hỗ trợ xây kênh đỉnh cao: Sử dụng số Xu kiếm được từ các nhiệm vụ hoặc nạp trực tiếp qua SePay VietQR để sở hữu trọn đời các phần mềm chuyên nghiệp."
                steps={[
                  "Bước 1: Khám phá các phần mềm AI, tiện ích 4K, công cụ phân tích kênh đối thủ",
                  "Bước 2: Bấm 'Mua Bằng Xu' hoặc thanh toán nạp qua cổng SePay VietQR tự động",
                  "Bước 3: Nhận ngay License Key bản quyền trọn đời và link tải phần mềm trực tiếp",
                  "Bước 4: Nhập License Key để kích hoạt và sử dụng vĩnh viễn"
                ]}
                tips="1 Xu = 1 VNĐ cố định. Bạn có thể kiếm thêm Xu từ các nhiệm vụ follow, tương tác hoặc chia sẻ affiliate."
                badge="Thanh Toán Bằng Xu"
                placement="bottom"
              />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-display">
              Kho App Kiếm Tiền & Phần Mềm Xây Kênh TikTok Tự Động
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Dùng Xu tích lũy để sở hữu trọn đời các phần mềm tạo kịch bản AI, tải video không logo, lọc âm thanh, soi kênh đối thủ và quản lý đa tài khoản an toàn tuyệt đối.
            </p>

            {/* Quick action bar for users */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openDeposit}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Nạp Tiền Qua SePay VietQR (Cộng Xu Tự Động 24/7)</span>
              </button>
            </div>
          </div>

          {/* User Xu Balance Box */}
          <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/40 space-y-2.5 text-center shrink-0 min-w-[220px]">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Số Dư Xu Của Bạn</span>
            <div className="text-3xl font-black text-neonGold font-mono">
              {user.avaliveCoins.toLocaleString()} <span className="text-base text-amber-400 font-sans">Xu</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              ≈ <strong className="text-emerald-400">{user.coinsValueVND}</strong>
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
              <button
                onClick={openDeposit}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nạp Thêm Xu</span>
              </button>
              <span className="text-[9px] text-slate-400 font-mono">Tỷ giá 1 Xu = 1 VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Catalog vs My Licenses */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Kho Phần Mềm ({softwareApps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_licenses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my_licenses'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Bản Quyền Đã Mua Của Tôi ({myAppLicenses.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="space-y-6">
          {/* Categories Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm phần mềm, tiện ích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Software Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredApps.map((app) => {
              const isOwned = myAppLicenses.some(lic => lic.appId === app.id);

              return (
                <div
                  key={app.id}
                  className="rounded-3xl bg-slate-900/95 border border-slate-800 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl hover:-translate-y-1 duration-200 relative"
                >
                  <div>
                    {/* Thumbnail Banner */}
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={app.thumbnail} 
                        alt={app.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                          {app.tag}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {app.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-md text-[9px] font-mono font-bold text-white">
                              {app.badge}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/80 backdrop-blur-md text-[9px] font-mono font-bold text-white">
                            {app.version}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {app.rating} ({app.reviewCount})
                        </span>
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Download className="w-3 h-3" /> {app.downloadsCount.toLocaleString()} lượt tải
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase">{app.developer}</span>
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 font-display">
                          {app.title}
                        </h3>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {app.description}
                      </p>

                      {/* Key Highlights */}
                      <ul className="space-y-1 text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                        {(app.highlights || []).slice(0, 2).map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price & Purchase Action */}
                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 space-y-3">
                    <div className="flex items-baseline justify-between pt-2 font-mono">
                      <div>
                        <span className="text-base font-black text-neonGold">{app.priceXu.toLocaleString()} Xu</span>
                        <span className="text-[10px] text-slate-400 ml-2">≈ {app.fiatPriceVND || `${app.priceXu.toLocaleString()}đ`}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Trọn đời
                      </span>
                    </div>

                    {/* Action button for user */}
                    {isOwned ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Đã Sở Hữu Bản Quyền</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('my_licenses')}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Xem mã key và tải bộ cài"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAppForPurchase(app)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center justify-center gap-1.5 transition-all font-display active:scale-98"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Mua Bằng Xu Ngay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* My Licenses Tab */
        <div className="p-6 rounded-3xl bg-[#0D111E] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            Danh Sách License Key Bản Quyền Của Bạn ({myAppLicenses.length} Phần Mềm)
          </h3>

          {myAppLicenses.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <Key className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">Bạn chưa mua bản quyền phần mềm nào</h4>
              <p className="text-xs text-slate-400 mt-1">Dùng Xu kiếm được từ các nhiệm vụ để mua các công cụ hỗ trợ xây kênh trên chợ ứng dụng.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Khám Phá Kho Phần Mềm
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAppLicenses.map((lic) => (
                <div 
                  key={lic.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-display">{lic.appTitle}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                        {lic.licenseKey}
                      </span>
                      <button
                        onClick={() => copyToClipboard(lic.licenseKey)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div>Thời hạn: <strong className="text-emerald-400">{lic.expiryDate}</strong></div>
                      <div>Đã thanh toán: {(lic.xuPaid || (lic.tokenPaid ? lic.tokenPaid * 1000 : 500000)).toLocaleString()} Xu</div>
                    </div>

                    <a
                      href={lic.downloadUrl || 'https://tools.tiktokpro.vn'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Phần Mềm</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Confirm Purchase with Xu */}
      {selectedAppForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#0D111E] border border-purple-500/30 p-6 space-y-5 relative shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                Xác Nhận Mua Bản Quyền Phần Mềm
              </h3>
              <button 
                onClick={() => setSelectedAppForPurchase(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-mono text-[10px] uppercase">Phần mềm lựa chọn:</span>
                <h4 className="text-sm font-bold text-white font-display">{selectedAppForPurchase.title}</h4>
                <p className="text-[11px] text-slate-400">{selectedAppForPurchase.version} • {selectedAppForPurchase.developer}</p>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Giá thanh toán Xu:</span>
                  <strong className="text-neonGold text-sm">{selectedAppForPurchase.priceXu.toLocaleString()} Xu</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số dư ví Xu hiện có:</span>
                  <strong className="text-white">{user.avaliveCoins.toLocaleString()} Xu</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-slate-400">Số dư Xu còn lại sau mua:</span>
                  <strong className={user.avaliveCoins >= selectedAppForPurchase.priceXu ? "text-emerald-400" : "text-rose-400"}>
                    {user.avaliveCoins >= selectedAppForPurchase.priceXu 
                      ? `${(user.avaliveCoins - selectedAppForPurchase.priceXu).toLocaleString()} Xu`
                      : `Thiếu ${(selectedAppForPurchase.priceXu - user.avaliveCoins).toLocaleString()} Xu`}
                  </strong>
                </div>
              </div>

              {user.avaliveCoins < selectedAppForPurchase.priceXu && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-2">
                  <p>⚠️ Số dư ví Xu của bạn hiện không đủ để thanh toán phần mềm này. Bạn có thể nạp tiền tự động qua SePay VietQR để nhận đủ Xu ngay trong 3 giây.</p>
                  <button
                    onClick={() => {
                      setSelectedAppForPurchase(null);
                      openDeposit();
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Nạp Tiền Qua SePay VietQR Ngay</span>
                  </button>
                </div>
              )}

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300">
                ✓ Cấp License Key bản quyền trọn đời ngay lập tức kèm link tải phần mềm trực tiếp.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedAppForPurchase(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => handleConfirmPurchase(selectedAppForPurchase)}
                disabled={user.avaliveCoins < selectedAppForPurchase.priceXu}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 ${
                  user.avaliveCoins >= selectedAppForPurchase.priceXu
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 shadow-purple-900/40'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Xác Nhận Trừ Xu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: License Key Success Result */}
      {purchasedLicenseResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#0D111E] border border-emerald-500/40 p-6 space-y-5 text-center relative shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-display">Kích Hoạt Bản Quyền Thành Công!</h3>
              <p className="text-xs text-slate-300">
                Chúc mừng bạn đã sở hữu bản quyền phần mềm <strong>{purchasedLicenseResult.appTitle}</strong>.
              </p>
            </div>

            {/* License Key Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">License Key Bản Quyền Của Bạn</span>
              <div className="text-base font-black text-cyan-400 font-mono tracking-wider select-all">
                {purchasedLicenseResult.licenseKey}
              </div>
              <button
                onClick={() => copyToClipboard(purchasedLicenseResult.licenseKey)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedKey ? 'Đã Sao Chép!' : 'Sao Chép Mã Key'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={purchasedLicenseResult.downloadUrl || 'https://tools.tiktokpro.vn'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Tải Bộ Cài Ngay</span>
              </a>
              <button
                onClick={() => setPurchasedLicenseResult(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
