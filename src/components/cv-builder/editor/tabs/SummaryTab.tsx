import React from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import { CvData } from "../../types";

interface SummaryTabProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  cvData,
  setCvData,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Profesyonel Özet */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Profesyonel Özet (Executive Summary)
            </h3>
            <p className="text-[11px] text-slate-500">
              İK ve teknik liderlerin ilk 6 saniyede okuduğu mühendislik profili
            </p>
          </div>
          <span className="text-[10.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {cvData.summary.length} karakter
          </span>
        </div>

        <textarea
          rows={5}
          value={cvData.summary}
          onChange={(e) =>
            setCvData((prev) => ({ ...prev, summary: e.target.value }))
          }
          placeholder="Mühendislik deneyiminizi, ana uzmanlık ekseninizi ve kurduğunuz sistemlerin getirdiği değeri anlatan özet metin..."
          className="w-full rounded-lg border border-slate-300 p-3 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-200/70 text-[11px] text-orange-950">
          💡 <strong>İpucu:</strong> &quot;Merhaba, kendimi geliştirmek istiyorum&quot; gibi junior kalıplar yerine; kaç yıldır üretim yaptığınızı, ana uzmanlık odağınızı (Frontend, Backend, AI, DevOps) ve uçtan uca sistem sahiplenme refleksinizi vurgulayın.
        </div>
      </div>

      {/* 2. Kapanış & Çalışma Yaklaşımı Notu */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
              Çalışma Yaklaşımı & Kapanış Notu (Opsiyonel)
            </h3>
            <p className="text-[11px] text-slate-500">
              CV sonunda yer alan mühendislik vizyonu ve samimi ekip mesajı
            </p>
          </div>
          <span className="text-[10.5px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {cvData.closingNote.length} karakter
          </span>
        </div>

        <textarea
          rows={4}
          value={cvData.closingNote}
          onChange={(e) =>
            setCvData((prev) => ({ ...prev, closingNote: e.target.value }))
          }
          placeholder="CV'nin en altında yer alacak ek mühendislik yaklaşımı ve iletişim notu (Boş bırakırsanız gizlenir)..."
          className="w-full rounded-lg border border-slate-300 p-3 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
    </div>
  );
};
