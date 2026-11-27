import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Lock,
  Scale,
  Zap,
  Coins,
  Award,
  AlertTriangle,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  PhoneCall,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  VIETNAMESE_LEGAL_POLICIES,
  VIETNAMESE_LEGAL_OVERVIEW,
  LegalPolicyCategory
} from '../../data/vietnameseLegalPolicies';

export interface VietnameseLegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicyId?: string;
}

export const VietnameseLegalPolicyModal: React.FC<VietnameseLegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicyId = 'intellectual-property'
}) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(initialPolicyId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [hasAgreed, setHasAgreed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ava_vietnamese_legal_compliance_agreed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (initialPolicyId) {
      setSelectedPolicyId(initialPolicyId);
    }
  }, [initialPolicyId, isOpen]);

  if (!isOpen) return null;

  const currentPolicy = VIETNAMESE_LEGAL_POLICIES.find(p => p.id === selectedPolicyId) || VIETNAMESE_LEGAL_POLICIES[0];

  const getPolicyIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'Lock': return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Scale': return <Scale className="w-4 h-4 text-amber-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Coins': return <Coins className="w-4 h-4 text-emerald-400" />;
      case 'Award': return <Award className="w-4 h-4 text-indigo-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-slate-400" />;
      default: return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  const toggleClause = (clauseId: string) => {
    setExpandedClauses(prev => ({
      ...prev,
      [clauseId]: prev[clauseId] === undefined ? false : !prev[clauseId]
    }));
  };

  const handleCopyPolicy = () => {
    const text = `VĂN BẢN PHÁP LÝ CHÍNH THỨC: ${currentPolicy.title} (${currentPolicy.categoryCode})\n` +
      `Áp dụng tại: ${VIETNAMESE_LEGAL_OVERVIEW.platformName}\n` +
      `Căn cứ pháp lý: \n${currentPolicy.legalBases.map(b => `- ${b}`).join('\n')}\n\n` +
      `NỘI DUNG ĐIỀU KHOẢN:\n` +
      currentPolicy.clauses.map(c => `${c.clauseNumber} - ${c.title}:\n${c.content}`).join('\n\n') +
      `\n\nBan Pháp chế & An ninh mạng AVA FOLLOW - Hotline: ${VIETNAMESE_LEGAL_OVERVIEW.hotline} | Email: ${VIETNAMESE_LEGAL_OVERVIEW.legalEmail}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPolicy = () => {
    const text = `=================================================================================\n` +
      `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n` +
      `Độc lập - Tự do - Hạnh phúc\n` +
      `-----------------------------------------\n` +
      `VĂN BẢN CHÍNH SÁCH QUY CHUẨN PHÁP LUẬT VIỆT NAM & QUYỀN SỞ HỮU TRÍ TUỆ\n` +
      `HỆ SINH THÁI CÔNG NGHỆ AVA FOLLOW (app.avafollow.vn)\n` +
      `Mã chính sách: ${currentPolicy.categoryCode}\n` +
      `Tiêu đề: ${currentPolicy.title}\n` +
      `Ngày ban hành & áp dụng: ${currentPolicy.effectiveDate}\n` +
      `=================================================================================\n\n` +
      `I. CĂN CỨ PHÁP LUẬT NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM:\n` +
      currentPolicy.legalBases.map((b, idx) => `  ${idx + 1}. ${b}`).join('\n') +
      `\n\nII. NỘI DUNG ĐIỀU KHOẢN CHI TIẾT:\n` +
      currentPolicy.clauses.map(c => `  ${c.clauseNumber}: ${c.title.toUpperCase()}\n  ${c.content}\n`).join('\n') +
      `\nIII. TRÁCH NHIỆM THI HÀNH & KÊNH LIÊN HỆ PHÁP CHẾ:\n` +
      `  - Đơn vị chủ quản: ${VIETNAMESE_LEGAL_OVERVIEW.platformName}\n` +
      `  - Trụ sở: ${VIETNAMESE_LEGAL_OVERVIEW.headquarters}\n` +
      `  - Tổng đài CSKH: ${VIETNAMESE_LEGAL_OVERVIEW.hotline}\n` +
      `  - Hotline Pháp chế 24/7: ${VIETNAMESE_LEGAL_OVERVIEW.emergencyLegalHotline}\n` +
      `  - Email tiếp nhận tố giác vi phạm: ${VIETNAMESE_LEGAL_OVERVIEW.legalEmail}\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chinh-Sach-Phap-Ly-${currentPolicy.categoryCode.replace(/[\/\\]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAgreeCompliance = () => {
    try {
      localStorage.setItem('ava_vietnamese_legal_compliance_agreed', 'true');
      localStorage.setItem('ava_vietnamese_legal_compliance_agreed_at', new Date().toISOString());
    } catch {}
    setHasAgreed(true);
  };

  // Lọc theo từ khóa tìm kiếm nếu có
  const filteredPolicies = searchQuery.trim()
    ? VIETNAMESE_LEGAL_POLICIES.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clauses.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : VIETNAMESE_LEGAL_POLICIES;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl bg-[#080B11] border border-white/20 shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER WITH VIETNAMESE LEGAL BADGE */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-red-950/30 via-slate-900/60 to-blue-950/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/40 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  PHÁP CHẾ VIỆT NAM 2026
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  Áp dụng theo Pháp luật Nước CHXHCN Việt Nam
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display mt-0.5">
                Văn Bản Chính Sách Pháp Luật, Bản Quyền &amp; Quyền Sở Hữu Trí Tuệ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. SEARCH & QUICK SUMMARY STRIP */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm điều khoản, bản quyền, an ninh mạng..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 font-mono transition-colors"
            />
          </div>

          {/* Compliance Stats Badges */}
          <div className="flex items-center gap-2 text-[10px] font-mono overflow-x-auto w-full sm:w-auto">
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Nghị định 13/2023</span>
            </span>
            <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Luật SHTT 2022</span>
            </span>
            <span className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 whitespace-nowrap flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>An Ninh Mạng A05</span>
            </span>
          </div>
        </div>

        {/* 3. MAIN BODY (LEFT SIDEBAR TABS + RIGHT CONTENT) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* 3A. LEFT SIDEBAR: 9 POLICY CATEGORIES */}
          <div className="w-full md:w-72 bg-[#06080E] border-r border-white/5 p-2 overflow-y-auto space-y-1 shrink-0">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>9 Bộ Chính Sách Toàn Diện</span>
              <span className="text-[9px] text-slate-500">{filteredPolicies.length} mục</span>
            </div>

            {filteredPolicies.map((p) => {
              const isSelected = p.id === currentPolicy.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPolicyId(p.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/40 via-blue-950/40 to-slate-900 border-red-500/40 shadow-lg'
                      : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getPolicyIcon(p.iconName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {p.categoryCode}
                      </span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <div className={`text-xs font-bold truncate mt-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {p.shortDesc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3B. RIGHT CONTENT: DETAILED POLICY ARTICLES & CLAUSES */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-[#090D17] to-[#06080E]">
            {/* Policy Title Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">
                    {currentPolicy.categoryCode}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold ${currentPolicy.badgeColor}`}>
                    {currentPolicy.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Hiệu lực: {currentPolicy.effectiveDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPolicy}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    title="Sao chép văn bản chính sách"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                    <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPolicy}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-lg"
                    title="Tải văn bản chính sách pháp lý về máy"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tải Văn Bản (.txt)</span>
                    <span className="sm:hidden">Tải Về</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-xl font-black text-white font-display">
                  {currentPolicy.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentPolicy.shortDesc}
                </p>
              </div>

              {/* Legal Bases Strip */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                  <Scale className="w-3 h-3 text-amber-400" />
                  <span>CĂN CỨ PHÁP LUẬT NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM:</span>
                </div>
                <ul className="space-y-1">
                  {currentPolicy.legalBases.map((base, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 font-mono flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0">⚖</span>
                      <span>{base}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Clauses List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-1">
                <span>CÁC ĐIỀU KHOẢN QUY CHUẨN CHI TIẾT ({currentPolicy.clauses.length} ĐIỀU)</span>
                <span className="text-[10px] text-slate-500">Bắt buộc tuân thủ 100%</span>
              </div>

              {currentPolicy.clauses.map((clause) => {
                const isExpanded = expandedClauses[clause.clauseId] !== false; // Mặc định mở
                return (
                  <div
                    key={clause.clauseId}
                    className={`rounded-2xl border transition-all ${
                      clause.isStrict
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      onClick={() => toggleClause(clause.clauseId)}
                      className="p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                            {clause.clauseNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {clause.title}
                          </span>
                          {clause.isStrict && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[9px] font-mono font-bold flex items-center gap-1 animate-pulse">
                              <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                              <span>CHẾ TÀI HÌNH SỰ / PHONG TỎA</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-white/5 space-y-2">
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {clause.content}
                        </p>
                        {clause.legalNote && (
                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Ghi chú pháp chế: {clause.legalNote}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Department & Contact Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A101D] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Bộ Phận Pháp Chế &amp; An Ninh Mạng AVA FOLLOW 24/7</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Hotline khẩn cấp: <strong className="text-emerald-400">{VIETNAMESE_LEGAL_OVERVIEW.hotline}</strong> | Email: <strong className="text-blue-400">{VIETNAMESE_LEGAL_OVERVIEW.legalEmail}</strong>
                </div>
              </div>

              <a
                href={`mailto:${VIETNAMESE_LEGAL_OVERVIEW.legalEmail}?subject=Bao-Cao-Phap-Ly-AVA-FOLLOW`}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-white/20 transition-all shrink-0 active:scale-95"
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Báo Cáo Vi Phạm Bản Quyền</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM ACTION & COMPLIANCE AGREEMENT BAR */}
        <div className="p-3 sm:p-4 bg-[#05070B] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono text-center sm:text-left">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Việc tiếp tục sử dụng đồng nghĩa bạn đồng ý vô điều kiện với toàn bộ 9 bộ chính sách theo pháp luật Việt Nam.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleAgreeCompliance}
              disabled={hasAgreed}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                hasAgreed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-xl hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{hasAgreed ? 'Đã Cam Kết Tuân Thủ' : 'Tôi Cam Kết Tuân Thủ Pháp Luật'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
