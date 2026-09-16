import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  PhoneCall, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  AlertOctagon,
  Flame,
  Radio,
  Gavel
} from 'lucide-react';
import { LEGAL_COMPLIANCE_DATA, LegalArticle } from '../../data/legalSecurityPolicy';

export const LegalSecurityComplianceView: React.FC<{
  userName?: string;
  userEmail?: string;
  onOpenAppealModal?: () => void;
  showToast: (msg: string) => void;
}> = ({
  userName = 'Người Dùng Hệ Thống',
  userEmail = 'user@avalive.vn',
  onOpenAppealModal,
  showToast
}) => {
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    dieu_1: true,
    dieu_2: true,
    dieu_3: true,
    dieu_4: false,
    dieu_5: false
  });

  const [hasAgreed, setHasAgreed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ava_legal_compliance_agreed') === 'true';
    } catch {
      return false;
    }
  });

  const [copiedPolicy, setCopiedPolicy] = useState<boolean>(false);

  const toggleArticle = (id: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAgreePolicy = () => {
    try {
      localStorage.setItem('ava_legal_compliance_agreed', 'true');
      localStorage.setItem('ava_legal_compliance_agreed_at', new Date().toISOString());
    } catch {}
    setHasAgreed(true);
    showToast('✅ Đã ghi nhận cam kết tuân thủ pháp luật & quy định an ninh mạng của bạn!');
  };

  const handleCopyPolicySummary = () => {
    const text = `VĂN BẢN CHÍNH SÁCH BẢO MẬT & CHỐNG VI PHẠM PHÁP LUẬT AVA LIVE / AVA FOLLOW\n` +
      `Căn cứ: ${LEGAL_COMPLIANCE_DATA.legalBasis.join(', ')}\n\n` +
      `CẢNH BÁO: ${LEGAL_COMPLIANCE_DATA.warningStatement}\n\n` +
      `Chi tiết 5 Điều Khoản:\n` +
      LEGAL_COMPLIANCE_DATA.articles.map(a => `${a.articleNumber}: ${a.title}\n${a.clauses.map(c => `- ${c.clauseNumber} ${c.title}: ${c.content}`).join('\n')}`).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedPolicy(true);
    showToast('📋 Đã sao chép toàn bộ văn bản điều khoản pháp lý vào bộ nhớ tạm!');
    setTimeout(() => setCopiedPolicy(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HERO BANNER: THÔNG ĐIỆP PHÁP LÝ & AN NINH TỐI CAO */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-red-950/60 via-[#0E1222] to-slate-950 border-2 border-red-500/50 shadow-2xl shadow-red-950/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 font-mono text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                CHÍNH SÁCH AN NINH &amp; PHÁP LUẬT CHÍNH THỨC
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                Hiệu Lực: 2026
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-red-400 shrink-0" />
              <span>Chính Sách Bảo Mật, Chống Lừa Đảo &amp; Tuân Thủ Pháp Luật</span>
            </h3>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Văn bản quy định bắt buộc đối với 100% người dùng, đối tác kinh doanh, KOC và doanh nghiệp. Hệ thống áp dụng chính sách <strong>Không Khoan Nhượng (Zero Tolerance)</strong> đối với mọi hành vi lừa đảo, cờ bạc, đa cấp bất chính, rửa tiền hoặc lợi dụng phần mềm để vi phạm pháp luật.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={handleCopyPolicySummary}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono font-bold border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              {copiedPolicy ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedPolicy ? 'Đã Sao Chép' : 'Sao Chép Văn Bản'}</span>
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([
                  `VĂN BẢN CHÍNH SÁCH BẢO MẬT & PHÁP LUẬT AVA LIVE\nNgày ban hành: ${LEGAL_COMPLIANCE_DATA.lastUpdated}\n\n` +
                  `CĂN CỨ PHÁP LÝ:\n${LEGAL_COMPLIANCE_DATA.legalBasis.map((b, i) => `${i+1}. ${b}`).join('\n')}\n\n` +
                  `TUYÊN BỐ:\n${LEGAL_COMPLIANCE_DATA.warningStatement}\n\n` +
                  `CHI TIẾT ĐIỀU KHOẢN:\n` +
                  LEGAL_COMPLIANCE_DATA.articles.map(a => `\n${a.articleNumber}: ${a.title}\n${a.clauses.map(c => `  ${c.clauseNumber}. ${c.title}: ${c.content}`).join('\n')}`).join('\n')
                ], { type: 'text/plain;charset=utf-8' });
                element.href = URL.createObjectURL(file);
                element.download = 'CHINH_SACH_PHAP_LY_VA_BAO_MAT_AVALIVE.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                showToast('📥 Đã tải văn bản chính sách pháp lý về máy của bạn!');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Chính Sách</span>
            </button>
          </div>
        </div>

        {/* CĂN CỨ PHÁP LÝ HỘP NHỎ */}
        <div className="mt-4 pt-4 border-t border-red-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px] font-mono text-slate-400">
          {LEGAL_COMPLIANCE_DATA.legalBasis.map((basis, idx) => (
            <div key={idx} className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
              <Gavel className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{basis}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. HỘP CẢNH BÁO ĐỎ TỐI KHẨN: TUYÊN BỐ PHÒNG CHỐNG TỘI PHẠM */}
      <div className="p-4 sm:p-5 rounded-3xl bg-red-950/40 border-2 border-red-600/80 space-y-3 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0 mt-0.5 shadow-lg shadow-red-600/50">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-red-400 uppercase tracking-wide font-display">
              Cảnh Báo Nghiêm Cấm Hành Vi Lừa Đảo &amp; Vi Phạm Pháp Luật
            </h4>
            <p className="text-xs text-slate-200 font-mono leading-relaxed">
              {LEGAL_COMPLIANCE_DATA.warningStatement}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-black/60 border border-red-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-red-300">
            <Flame className="w-4 h-4 text-red-400" />
            <span>Phát hiện vi phạm? Báo cáo ngay cho Đội Ngũ Pháp Chế:</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:phapche@avalive.vn" 
              className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>phapche@avalive.vn</span>
            </a>
            {onOpenAppealModal && (
              <button
                onClick={onOpenAppealModal}
                className="px-3 py-1 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold border border-red-500/40 cursor-pointer"
              >
                Gửi Tố Giác Khẩn Cấp ➔
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. CHI TIẾT 5 ĐIỀU KHOẢN CHÍNH SÁCH BẢO MẬT & PHÁP LÝ */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-black text-white uppercase font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Nội Dung Chi Tiết 5 Điều Khoản Chính Sách</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            Bấm vào từng điều để mở rộng
          </span>
        </div>

        {LEGAL_COMPLIANCE_DATA.articles.map((art: LegalArticle) => {
          const isExpanded = expandedArticles[art.id];

          return (
            <div 
              key={art.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-[#0B0E1B] border-white/20 shadow-xl' 
                  : 'bg-[#080B14] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Header điều khoản */}
              <div 
                onClick={() => toggleArticle(art.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white font-mono font-black text-xs shrink-0">
                    {art.articleNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-black text-white truncate font-display">
                        {art.title}
                      </h5>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${art.badgeColor}`}>
                        {art.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white shrink-0"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Nội dung chi tiết các khoản */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-white/5 space-y-3 bg-black/20">
                  <div className="space-y-2.5 mt-3">
                    {art.clauses.map((clause, cIdx) => (
                      <div 
                        key={cIdx} 
                        className={`p-3.5 rounded-2xl border text-xs font-mono space-y-1.5 ${
                          clause.isCritical 
                            ? 'bg-red-950/20 border-red-500/40 text-red-200' 
                            : 'bg-white/2 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-white flex items-center gap-1.5">
                            {clause.isCritical ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                            <span>Khoản {clause.clauseNumber}: {clause.title}</span>
                          </span>
                          {clause.isCritical && (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase shrink-0">
                              Nghiêm cấm
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                          {clause.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. HỘP CAM KẾT ĐIỆN TỬ CỦA NGƯỜI DÙNG */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0A121E] to-cyan-950/40 border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-black text-white font-display">
                Xác Nhận &amp; Cam Kết Tuân Thủ Pháp Luật Của Chủ Tài Khoản
              </h4>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Tài khoản: <strong>{userName}</strong> ({userEmail}) • Đã định danh điện tử
            </p>
          </div>

          <button
            onClick={handleAgreePolicy}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shrink-0 ${
              hasAgreed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
            }`}
          >
            {hasAgreed ? <Check className="w-4 h-4 stroke-[3]" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{hasAgreed ? '✓ ĐÃ KÝ CAM KẾT ĐIỆN TỬ' : 'TÔI CAM KẾT TUÂN THỦ PHÁP LUẬT'}</span>
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400 space-y-1">
          <p>
            * Bằng việc sử dụng nền tảng, bạn xác nhận hiểu rõ và đồng ý 100% với các điều khoản bảo mật, phòng chống lừa đảo nêu trên. Mọi hành vi vi phạm sẽ bị xử lý nghiêm minh theo quy định của pháp luật nước CHXHCN Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
};
