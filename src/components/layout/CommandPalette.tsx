import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight, 
  X, 
  UserCheck, 
  PlusCircle, 
  ShoppingBag, 
  Share2, 
  Wallet, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onScopeWork?: (prompt: string) => void;
  onSelectMode?: (mode: any) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchAction = (screen: ScreenId) => {
    onNavigate(screen);
    onClose();
  };

  const { user } = useTikTokApp();

  const QUICK_ACTIONS = [
    { label: 'Tạo chiến dịch tăng 10,000 Follow thật', screen: 'create_campaign' as ScreenId, icon: PlusCircle, badge: 'Hot' },
    { label: 'Nhận nhiệm vụ Follow & Tương tác nhận Xu', screen: 'tasks' as ScreenId, icon: UserCheck, badge: '+500 Xu' },
    { label: 'Xem bảng giá Gói Xây Kênh & Booking KOC', screen: 'marketplace' as ScreenId, icon: ShoppingBag, badge: 'Ưu đãi' },
    { label: 'Lấy link Tiếp thị liên kết (Hoa hồng 25%)', screen: 'affiliate' as ScreenId, icon: Share2, badge: 'Passive' },
    { label: 'Ví Xu & Rút tiền tự động về Ngân hàng / MoMo', screen: 'profile_wallet' as ScreenId, icon: Wallet, badge: 'Rút Thật 100%' },
    ...(user.email === 'quocthiencr90@gmail.com' ? [
      { label: 'Quản trị hệ thống & Giám sát phân phối Follow', screen: 'admin' as ScreenId, icon: ShieldCheck, badge: 'Admin' }
    ] : [])
  ];

  const filteredActions = QUICK_ACTIONS.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0E131F] shadow-2xl shadow-rose-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="h-5 w-5 text-rose-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm kênh, chiến dịch follow, gói dịch vụ tăng trưởng (hoặc ⌘K)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded bg-black/50 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Action Suggestions */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3">
          {query.trim() && (
            <div 
              onClick={() => handleSearchAction('create_campaign')}
              className="cursor-pointer group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-600/20 to-cyan-500/20 border border-rose-500/30 hover:border-rose-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Tạo chiến dịch tăng trưởng cho: "{query}"</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Phân bổ Follow, Tim & Seeding ngay lập tức
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 font-mono">
              Truy cập nhanh các tính năng TikTok Follow OS
            </div>
            <div className="space-y-1">
              {filteredActions.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSearchAction(item.screen)}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="h-4 w-4 text-rose-400 group-hover:text-rose-300" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 group-hover:bg-rose-500/20 group-hover:text-rose-300">
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Chọn hành động để chuyển màn hình ngay</span>
          <span>Esc để đóng</span>
        </div>
      </div>
    </div>
  );
};
