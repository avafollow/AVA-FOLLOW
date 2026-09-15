import React, { useState, useEffect } from 'react';
import { X, Smartphone, Apple, Sparkles, CheckCircle2, Share2, PlusSquare, Download, Layers, ShieldCheck } from 'lucide-react';

interface PwaInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallGuideModal: React.FC<PwaInstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect OS automatically
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0D111E] border border-cyan-500/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-rose-950/60 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <img src="/ava-full-logo.png" alt="AVA FOLLOW Logo" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-white font-display">Cài Đặt Ứng Dụng AVA FOLLOW</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold">1 CHẠM</span>
              </div>
              <p className="text-[11px] text-slate-300">Biến website thành icon App trên màn hình điện thoại</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: iOS vs Android */}
        <div className="p-3 bg-black/40 border-b border-white/5 flex gap-2 shrink-0">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              platform === 'ios'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              platform === 'android'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android / Chrome</span>
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Perks of PWA */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <Sparkles className="w-4 h-4 text-amber-400 mx-auto" />
              <div className="font-bold text-white text-[11px]">Mở Siêu Tốc</div>
              <div className="text-[9px] text-slate-400">1 chạm vào app ngay</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <Layers className="w-4 h-4 text-cyan-400 mx-auto" />
              <div className="font-bold text-white text-[11px]">Toàn Màn Hình</div>
              <div className="text-[9px] text-slate-400">Không dính thanh duyệt</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
              <div className="font-bold text-white text-[11px]">Duy Trì Phiên</div>
              <div className="text-[9px] text-slate-400">Không lo bị đăng xuất</div>
            </div>
          </div>

          {/* iOS Instructions */}
          {platform === 'ios' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3">
                <div className="font-bold text-blue-300 text-xs flex items-center gap-1.5 font-display">
                  <Apple className="w-4 h-4" /> Hướng dẫn cài trên Safari (iPhone / iPad):
                </div>

                {/* Step 1 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">1</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      Bấm nút <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[10px]"><Share2 className="w-3 h-3" /> Chia sẻ (Share)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Ở thanh công cụ phía dưới cùng của trình duyệt Safari trên iPhone.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">2</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      Chọn <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[10px]"><PlusSquare className="w-3 h-3" /> Thêm vào MH chính</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Cuộn xuống danh sách tùy chọn và nhấn vào dòng "Thêm vào MH chính" (Add to Home Screen).</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shrink-0">3</div>
                  <div className="space-y-1">
                    <div className="font-bold text-emerald-300 text-xs">
                      Nhấn "Thêm" (Add) ở góc trên bên phải
                    </div>
                    <p className="text-[11px] text-slate-400">Icon logo AVA FOLLOW sẽ lập tức xuất hiện trên màn hình chính như một app tải từ App Store!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {platform === 'android' && (
            <div className="space-y-3">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5 animate-bounce" />
                  <span>CÀI ĐẶT APP NGAY (1 CHẠM TỰ ĐỘNG)</span>
                </button>
              )}

              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div className="font-bold text-emerald-300 text-xs flex items-center gap-1.5 font-display">
                  <Smartphone className="w-4 h-4" /> Hướng dẫn cài trên Chrome Android:
                </div>

                {/* Step 1 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs shrink-0">1</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs">
                      Nhấn biểu tượng Menu (3 dấu chấm dọc) ở góc trên Chrome
                    </div>
                    <p className="text-[11px] text-slate-400">Hoặc bấm vào thanh thông báo "Thêm vào màn hình chính" hiển thị ở đáy trang.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs shrink-0">2</div>
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs">
                      Chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính"
                    </div>
                    <p className="text-[11px] text-slate-400">Trình duyệt sẽ tự động tải icon và tạo biểu tượng ứng dụng độc lập trên điện thoại.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shrink-0">3</div>
                  <div className="space-y-1">
                    <div className="font-bold text-emerald-300 text-xs">
                      Xác nhận "Cài đặt" / "Thêm"
                    </div>
                    <p className="text-[11px] text-slate-400">Ứng dụng hoạt động mượt mà, đầy đủ tính năng và không tốn dung lượng máy.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {isInstalled && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span className="font-bold text-xs">Bạn đang sử dụng phiên bản App PWA trên màn hình chính!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-black/60 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <span>Phiên bản: <strong>AVA App v3.0 Pro</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
