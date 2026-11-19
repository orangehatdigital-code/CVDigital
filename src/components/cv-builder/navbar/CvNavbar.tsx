import React from "react";
import {
  FileText,
  Edit3,
  Eye,
  Save,
  Check,
  RotateCcw,
  Printer,
  Sparkles,
} from "lucide-react";
import { CV_PROFILES } from "@/data/cvs";
import { CvData, CvSettings, SavedCvDraft } from "../types";

interface CvNavbarProps {
  cvData: CvData;
  activeDraftId: string;
  pagesCount: number;
  viewMode: "split" | "preview";
  setViewMode: (mode: "split" | "preview") => void;
  handleSave: () => void;
  handleReset: () => void;
  handlePrint: () => void;
  savedNotice: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: string | null;
  copiedNotice: boolean;
  switchCvLanguage: (targetLang: "tr" | "en") => void;
  onUpdateSettings?: <K extends keyof CvSettings>(
    field: K,
    value: CvSettings[K],
  ) => void;
}

export const CvNavbar: React.FC<CvNavbarProps> = ({
  cvData,
  activeDraftId,
  pagesCount,
  viewMode,
  setViewMode,
  handleSave,
  handleReset,
  handlePrint,
  savedNotice,
  hasUnsavedChanges,
  lastSavedAt,
  copiedNotice,
  switchCvLanguage,
  onUpdateSettings,
}) => {
  const activeProfileMeta = CV_PROFILES.find((p) => p.id === activeDraftId);
  const currentPersonKey = activeProfileMeta?.personKey || null;
  const currentCvLang: "tr" | "en" =
    activeProfileMeta?.lang ||
    (cvData.settings.pageNumberLabel?.toLowerCase() === "page" ||
    cvData.settings.sectionTitles?.experiences?.toUpperCase().includes("WORK")
      ? "en"
      : "tr");

  const hasLangPair = Boolean(
    currentPersonKey &&
      CV_PROFILES.some((p) => p.personKey === currentPersonKey && p.lang === "tr") &&
      CV_PROFILES.some((p) => p.personKey === currentPersonKey && p.lang === "en"),
  );

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-3 shadow-xs">
      <div className="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Sol Logo & Marka Başlığı */}
        <div className="flex items-center gap-3">
          <a
            href="https://orangehatdigital.com.tr"
            target="_blank"
            rel="noreferrer"
            title="OrangeHat Digital"
            className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center font-black text-xs shadow-sm tracking-wider transition"
          >
            OHD
          </a>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>CV Dijital</span>
                <span className="text-xs font-normal text-slate-400">/ CV Digital</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {pagesCount} Sayfa A4
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Açık Kaynak
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap pt-0.5">
              <a
                href="https://orangehatdigital.com.tr"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-orange-600 hover:underline"
              >
                OrangeHat Digital
              </a>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Geliştiriciler:</span>
              <a
                href="https://furkanaslan.orangehatdigital.com.tr"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-700 hover:text-slate-950 hover:underline"
              >
                Furkan Aslan
              </a>
              <span className="text-slate-300">&</span>
              <a
                href="https://kubrakara.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-700 hover:text-slate-950 hover:underline"
              >
                Kübra Kara
              </a>
            </div>
          </div>
        </div>

        {/* Sağ Butonlar & Aksiyonlar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TR / EN Dil Seçimi */}
          {hasLangPair && (
            <div
              className="inline-flex rounded-xl border border-blue-200 bg-blue-50/70 p-0.5"
              title="CV Dilini Değiştir (Görsel ayarlarınız korunur)"
            >
              <button
                type="button"
                onClick={() => switchCvLanguage("tr")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentCvLang === "tr"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => switchCvLanguage("en")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentCvLang === "en"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                EN
              </button>
            </div>
          )}

          {/* Görünüm Modu: Düzenle / Tam Önizleme */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "split"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Düzenle & Önizle
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Tam Önizleme
            </button>
          </div>

          {/* Şablon / Tasarım Seçici (Tek Tıkla Modern / Klasik Harvard ATS) */}
          {onUpdateSettings && (
            <div
              className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
              title="CV Şablonunu Değiştir"
            >
              <button
                type="button"
                onClick={() => onUpdateSettings("templateLayout", "modern")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  (cvData.settings.templateLayout || "modern") === "modern"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🌟</span> Modern
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings("templateLayout", "classic")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  cvData.settings.templateLayout === "classic"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🎓</span> Klasik ATS
              </button>
            </div>
          )}

          {/* Kaydet Butonu */}
          <button
            type="button"
            onClick={handleSave}
            title={
              lastSavedAt
                ? `Son kayıt: ${lastSavedAt}`
                : "Mevcut taslağı tarayıcı hafızasına kaydet"
            }
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border shadow-xs transition cursor-pointer ${
              savedNotice
                ? "bg-emerald-600 text-white border-emerald-600"
                : hasUnsavedChanges
                  ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
            }`}
          >
            {savedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Kaydedildi!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {hasUnsavedChanges
                  ? "Kaydet *"
                  : lastSavedAt
                    ? `Kayıtlı (${lastSavedAt})`
                    : "Kaydet"}
              </>
            )}
          </button>

          {/* Sıfırla Butonu */}
          <button
            type="button"
            onClick={handleReset}
            title="Varsayılan resmi CV verilerine geri dön"
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-600 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {copiedNotice ? "Sıfırlandı!" : "Sıfırla"}
          </button>

          {/* PDF Yazdır Butonu */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            PDF Kaydet / Yazdır
          </button>
        </div>
      </div>
    </header>
  );
};
