import React from "react";
import { ArrowUpDown, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { CvData, CvSettings, SectionId, ThemeId } from "../../types";
import { CV_THEMES, SECTION_LABELS, DEFAULT_SECTION_ORDER } from "../../constants";

interface SettingsTabProps {
  cvData: CvData;
  updateSettings: <K extends keyof CvSettings>(
    field: K,
    value: CvSettings[K],
  ) => void;
  moveSection: (sectionId: SectionId, direction: "up" | "down") => void;
  toggleSectionVisibility: (sectionId: SectionId) => void;
  updateSectionTitle: (sectionId: SectionId, newTitle: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  cvData,
  updateSettings,
  moveSection,
  toggleSectionVisibility,
  updateSectionTitle,
}) => {
  const currentOrder = cvData.settings.sectionOrder || DEFAULT_SECTION_ORDER;
  const hiddenSections = cvData.settings.hiddenSections || [];
  const currentLayout = cvData.settings.templateLayout || "modern";

  return (
    <div className="space-y-6">
      {/* 0. CV Tasarım Şablonu (Layout) */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs">CV Tasarım Şablonu (Layout)</h3>
            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              Tek Tıkla Değiştir
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            CV'nin genel görsel yapısı ve bölüm yerleşim stili
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Şablon: Modern Tech */}
          <button
            type="button"
            onClick={() => updateSettings("templateLayout", "modern")}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
              currentLayout === "modern"
                ? "bg-white border-slate-950 shadow-sm ring-2 ring-slate-900/10"
                : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>🌟</span> Modern Tech (Vurgulu)
              </span>
              {currentLayout === "modern" && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Renkli sol ayrık çubuklar, dinamik unvan ve etiketler. Yazılım & SaaS odaklı modern görünüm.
            </p>
            {/* Minyatür Önizleme Çizgileri */}
            <div className="w-full pt-1 border-t border-slate-100 flex items-center gap-1.5">
              <div className="w-1 h-3 bg-blue-600 rounded-xs" />
              <div className="h-1.5 w-16 bg-slate-800 rounded-xs" />
              <div className="h-1 flex-1 bg-slate-200 rounded-xs" />
            </div>
          </button>

          {/* 2. Şablon: Klasik Harvard / ATS Minimal */}
          <button
            type="button"
            onClick={() => updateSettings("templateLayout", "classic")}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer ${
              currentLayout === "classic"
                ? "bg-white border-slate-950 shadow-sm ring-2 ring-slate-900/10"
                : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>🎓</span> Klasik Harvard / ATS (Minimal)
              </span>
              {currentLayout === "classic" && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Attığın görseldeki sade format. Uçtan uca altı çizgili başlıklar, pipe | ayraçları, %100 ATS ve kurumsal uyum.
            </p>
            {/* Minyatür Önizleme Çizgileri */}
            <div className="w-full pt-1 border-t border-slate-100 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-14 bg-slate-900 rounded-xs" />
                <div className="h-1 w-10 bg-slate-400 rounded-xs" />
              </div>
              <div className="h-0.5 w-full bg-slate-900" />
            </div>
          </button>
        </div>
      </div>

      {/* 1. Renk Teması & Palet Seçici */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Kurumsal Vurgu Rengi</h3>
            <p className="text-[11px] text-slate-500">
              Başlıklar, linkler ve vurgu öğeleri için hazır palet veya özel renk
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
              style={{
                backgroundColor:
                  CV_THEMES[cvData.settings.accentColor as ThemeId]?.swatchHex ||
                  (cvData.settings.accentColor?.startsWith("#")
                    ? cvData.settings.accentColor
                    : "#0f172a"),
              }}
            />
            <span className="text-[11px] font-bold text-slate-800">
              {CV_THEMES[cvData.settings.accentColor as ThemeId]?.name ||
                cvData.settings.accentColor ||
                "Seçili"}
            </span>
          </div>
        </div>

        {/* Hazır 10 Kurumsal Renk Paleti */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(CV_THEMES) as ThemeId[]).map((themeKey) => {
            const t = CV_THEMES[themeKey];
            const isSelected = cvData.settings.accentColor === themeKey;
            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => updateSettings("accentColor", themeKey)}
                className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-white border-slate-900 shadow-xs ring-2 ring-slate-900/10 font-bold"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10 shadow-2xs"
                  style={{ backgroundColor: t.swatchHex }}
                />
                <span className="text-[11px] text-slate-800 truncate">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Özel Renk Seçici (Color Picker / HEX) */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
            <span>🎨</span>
            <span>Özel Renk Seç (Color Picker):</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Native Renk Paleti Butonu */}
            <div className="relative flex items-center">
              <input
                type="color"
                value={
                  cvData.settings.accentColor?.startsWith("#")
                    ? cvData.settings.accentColor
                    : CV_THEMES[cvData.settings.accentColor as ThemeId]?.swatchHex || "#1e3a8a"
                }
                onChange={(e) => updateSettings("accentColor", e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                title="Renk Paletini Aç"
              />
            </div>

            {/* HEX Kodu Girişi */}
            <input
              type="text"
              placeholder="#1e3a8a"
              value={cvData.settings.accentColor || ""}
              onChange={(e) => updateSettings("accentColor", e.target.value)}
              className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 2. Bölüm Başlığı & Sayfa Yerleşimi */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-xs">Tipografi & Başlık Stili</h3>
          <p className="text-[11px] text-slate-500">
            Yazı tipi, bölüm ayracı stili ve sayfa yoğunluğu
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Yazı Tipi (Font)
            </label>
            <select
              value={cvData.settings.fontFamily || "sans"}
              onChange={(e) =>
                updateSettings("fontFamily", e.target.value as "sans" | "serif")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="sans">Modern Sans-Serif (Inter / Clean)</option>
              <option value="serif">Klasik Serif (Academic / Editorial)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Bölüm Başlığı Stili
            </label>
            <select
              value={cvData.settings.sectionHeaderStyle || "accentBar"}
              onChange={(e) =>
                updateSettings(
                  "sectionHeaderStyle",
                  e.target.value as "accentBar" | "clean" | "tinted",
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="accentBar">Vurgulu Sol Çizgi (Önerilen)</option>
              <option value="clean">Yalnızca Alt Çizgi (Sade)</option>
              <option value="tinted">Hafif Renkli Arka Plan</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              İçerik Yoğunluğu
            </label>
            <select
              value={cvData.settings.density || "compact"}
              onChange={(e) =>
                updateSettings("density", e.target.value as "compact" | "normal")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="compact">Kompakt (2 Sayfa İçin İdeal)</option>
              <option value="normal">Geniş (Ferah Boşluklar)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Yetkinlikler Düzeni
            </label>
            <select
              value={cvData.settings.skillsLayout || "list"}
              onChange={(e) =>
                updateSettings("skillsLayout", e.target.value as "list" | "grid")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="list">Tek Sütun Liste (Önerilen)</option>
              <option value="grid">2 Sütunlu Grid (Yer Tasarrufu)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Projeler Düzeni
            </label>
            <select
              value={cvData.settings.projectsLayout || "list"}
              onChange={(e) =>
                updateSettings("projectsLayout", e.target.value as "list" | "grid")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="list">Tek Sütun Detaylı Liste (Önerilen)</option>
              <option value="grid">2 Sütunlu Grid (Modern Kartlar)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Sayfa Üst/Alt Boşluğu (mm): {cvData.settings.pageMarginMm || 14}mm
            </label>
            <input
              type="range"
              min="10"
              max="22"
              step="1"
              value={cvData.settings.pageMarginMm || 14}
              onChange={(e) =>
                updateSettings("pageMarginMm", parseInt(e.target.value, 10))
              }
              className="w-full accent-slate-900 mt-2"
            />
          </div>
        </div>
      </div>

      {/* 3. Bölüm Sıralaması & Görünürlük */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Bölüm Sıralaması & Başlık Düzenleme
            </h3>
            <p className="text-[11px] text-slate-500">
              Bölümleri yukarı/aşağı taşıyabilir, adını değiştirebilir veya gizleyebilirsiniz
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {currentOrder.map((sectionId, idx) => {
            const isHidden = hiddenSections.includes(sectionId);
            const labelInfo = SECTION_LABELS[sectionId] || {
              title: sectionId,
              desc: "",
            };
            const currentTitle =
              cvData.settings.sectionTitles?.[sectionId] || labelInfo.title;

            return (
              <div
                key={sectionId}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                  isHidden
                    ? "bg-slate-100/70 border-slate-200 opacity-55"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(sectionId, "up")}
                      className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => moveSection(sectionId, "down")}
                      className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">
                      {labelInfo.title}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {labelInfo.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) =>
                      updateSectionTitle(sectionId, e.target.value)
                    }
                    placeholder="CV'deki Başlık"
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-800 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sectionId)}
                    title={isHidden ? "Bölümü Göster" : "Bölümü Gizle"}
                    className={`p-1.5 rounded-lg border transition ${
                      !isHidden
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {!isHidden ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sayfa Başlığı ve Alt Bilgi (Header & Footer) */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-xs">
            2. Sayfa Üst Bilgisi & Alt Bilgi (Footer)
          </h3>
          <p className="text-[11px] text-slate-500">
            Çok sayfalı çıktılarda kurumsal üst ve alt bilgi satırları
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={cvData.settings.showPage2Header}
              onChange={(e) =>
                updateSettings("showPage2Header", e.target.checked)
              }
              className="rounded border-slate-300 text-slate-900"
            />
            2. ve sonraki sayfalarda üst bilgi çubuğunu göster
          </label>

          {cvData.settings.showPage2Header && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  2. Sayfa Sol Metin (Boşsa: Ad Soyad | Unvan)
                </label>
                <input
                  type="text"
                  placeholder="Otomatik (Ad Soyad | Unvan)"
                  value={cvData.settings.page2HeaderLeftText}
                  onChange={(e) =>
                    updateSettings("page2HeaderLeftText", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  2. Sayfa Sağ Metin (Boşsa: Web • E-Posta)
                </label>
                <input
                  type="text"
                  placeholder="Otomatik (Web Sitesi • E-Posta)"
                  value={cvData.settings.page2HeaderRightText}
                  onChange={(e) =>
                    updateSettings("page2HeaderRightText", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/80 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={cvData.settings.showFooter}
                onChange={(e) => updateSettings("showFooter", e.target.checked)}
                className="rounded border-slate-300 text-slate-900"
              />
              Sayfa alt bilgi (footer) çubuğunu göster
            </label>

            {cvData.settings.showFooter && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Alt Bilgi Sol Metin
                  </label>
                  <input
                    type="text"
                    value={cvData.settings.footerLeftText}
                    onChange={(e) =>
                      updateSettings("footerLeftText", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Sayfa Numarası Ön Eki
                  </label>
                  <input
                    type="text"
                    value={cvData.settings.pageNumberLabel}
                    onChange={(e) =>
                      updateSettings("pageNumberLabel", e.target.value)
                    }
                    placeholder="Örn: Sayfa veya Page"
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
