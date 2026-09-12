import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { EscrowBookingContract } from '../../types';
import { useTikTokApp } from '../../context/TikTokAppContext';

interface EscrowChatModalProps {
  contract: EscrowBookingContract | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenExtensionModal?: (contract: EscrowBookingContract) => void;
  onOpenIncidentModal?: (contract: EscrowBookingContract) => void;
}

export const EscrowChatModal: React.FC<EscrowChatModalProps> = ({
  contract,
  isOpen,
  onClose,
  onOpenExtensionModal,
  onOpenIncidentModal
}) => {
  const { contractChats, sendContractChatMessage } = useTikTokApp();
  const [chatSenderRole, setChatSenderRole] = useState<'client' | 'koc'>('client');
  const [inputText, setInputText] = useState('');

  if (!isOpen || !contract) return null;

  const messages = contractChats[contract.id] || contractChats['default'] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderName = chatSenderRole === 'client' 
      ? `Bên Thuê (${contract.clientName})`
      : `KOC (${contract.kocName})`;

    sendContractChatMessage(contract.id, chatSenderRole, senderName, inputText.trim());
    setInputText('');
  };

  const handleQuickPill = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                {contract.contractCode}
              </span>
              <span className="text-xs font-bold text-white truncate font-display">
                {contract.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>Sản phẩm: <strong className="text-slate-200">{contract.productName}</strong></span>
              <span>•</span>
              <span>Ký quỹ sàn: <strong className="text-amber-400">{contract.totalEscrowAmount}</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permanent Audit Trail Security Notice */}
        <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2 text-[10px] font-mono text-emerald-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong>LƯU TRỮ VĨNH VIỄN:</strong> Toàn bộ lịch sử trò chuyện &amp; đề xuất được niêm phong Smart Vault, không thể xóa để bảo vệ quyền lợi 3 bên.
          </span>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Đang gửi tin nhắn dưới vai trò:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setChatSenderRole('client')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all font-display cursor-pointer ${
                chatSenderRole === 'client'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Bên Thuê ({contract.clientName})
            </button>
            <button
              type="button"
              onClick={() => setChatSenderRole('koc')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all font-display cursor-pointer ${
                chatSenderRole === 'koc'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              KOC ({contract.kocName})
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#0A0D17]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'system'
                  ? 'items-center'
                  : msg.sender === chatSenderRole
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              {msg.sender === 'system' ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center max-w-xl leading-relaxed space-y-1 my-1 shadow-lg">
                  <div className="font-bold flex items-center justify-center gap-1.5 font-display text-[11px] text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{msg.senderName}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 whitespace-pre-line font-mono">{msg.text}</p>
                  <div className="text-[9px] text-slate-500 font-mono pt-0.5">{msg.timestamp}</div>
                </div>
              ) : (
                <div className={`max-w-[85%] space-y-1 ${msg.sender === chatSenderRole ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                    <span className={`font-bold ${msg.sender === 'client' ? 'text-purple-300' : 'text-emerald-300'}`}>
                      {msg.senderName}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === chatSenderRole
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills & Actions */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 font-mono text-[10px]">Gợi ý nhanh:</span>
          {[
            '📍 Gửi địa chỉ nhận mẫu sản phẩm',
            '📝 Gửi link brief kịch bản chi tiết',
            '⏱️ Đề xuất xin gia hạn tiến độ',
            '🔄 Yêu cầu chỉnh sửa theo kịch bản',
            '⭐ Video rất tốt, shop duyệt nghiệm thu'
          ].map((pill, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleQuickPill(pill)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-slate-700 hover:border-purple-500/40 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Nhắn tin trao đổi bảo mật với ${chatSenderRole === 'client' ? contract.kocName : contract.clientName}...`}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
