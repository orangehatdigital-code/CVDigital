import React from "react";
import { FileText, Scissors } from "lucide-react";
import { CvData, PlacedBlock, ThemeId } from "../types";
import { CV_THEMES } from "../constants";
import { CvPlacedBlockRenderer } from "./CvPlacedBlockRenderer";

interface CvPageSheetProps {
  pageIndex: number;
  totalPages: number;
  blocks: PlacedBlock[];
  cvData: CvData;
  onPhotoClick?: () => void;
  onToggleForcedBreak?: (blockId: string) => void;
}

export const CvPageSheet: React.FC<CvPageSheetProps> = ({
  pageIndex,
  totalPages,
  blocks,
  cvData,
  onPhotoClick,
  onToggleForcedBreak,
}) => {
  const pageNumber = pageIndex + 1;
  const isCompact = cvData.settings.density === "compact";
  const fontClass =
    cvData.settings.fontFamily === "serif" ? "font-serif" : "font-sans";
  const themeKey = (cvData.settings.accentColor as ThemeId) || "slate";
  const theme = CV_THEMES[themeKey] || CV_THEMES.slate;

  const marginMm = cvData.settings.pageMarginMm || 14;
  const horizontalMarginMm = isCompact ? 15 : 18;

  const autoPage2Right = [cvData.personal.website, cvData.personal.email]
    .filter((v) => v && v.trim() !== "")
    .join(" • ");

  const page2RightDisplay =
    cvData.settings.page2HeaderRightText?.trim() !== ""
      ? cvData.settings.page2HeaderRightText
      : autoPage2Right;

  const shouldShowFooter =
    cvData.settings.showFooter !== false &&
    (totalPages > 1 || Boolean(cvData.settings.showFooterOnSinglePage));

  const pageNumPrefix = cvData.settings.pageNumberLabel ?? "Sayfa";
  const pageNumFormatted = cvData.settings.showPageNumbers
    ? `${pageNumPrefix ? `${pageNumPrefix} ` : ""}${pageNumber} / ${totalPages}`
    : "";
  const rightFooterDisplay = [
    cvData.settings.footerRightCustomText?.trim(),
    pageNumFormatted,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="cv-page-wrapper w-full flex flex-col items-center">
      {/* Ekranda Sayfa Bilgi Etiketi (Yazdırırken Gizlenir) */}
      <div className="no-print w-full max-w-[210mm] flex items-center justify-between mb-2 px-1 text-xs text-slate-500">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-orange-600" />
          A4 Sayfa {pageNumber} / {totalPages}
        </span>
        <span>
          Üst/Alt Güvenli Boşluk: {marginMm}mm • Tam Blok Hizalı Kesim
        </span>
      </div>

      {/* GERÇEK A4 SAYFASI (210mm x 297mm) */}
      <div
        className={`cv-a4-page bg-white text-slate-900 shadow-xl border border-slate-200/90 mx-auto flex flex-col justify-between transition-shadow hover:shadow-2xl ${fontClass}`}
        style={{
          width: "210mm",
          minHeight: "297mm",
          height: "297mm",
          paddingTop: `${marginMm}mm`,
          paddingBottom: `${marginMm}mm`,
          paddingLeft: `${horizontalMarginMm}mm`,
          paddingRight: `${horizontalMarginMm}mm`,
          boxSizing: "border-box",
        }}
      >
        {/* SAYFA İÇERİĞİ (ÜST + BLOKLAR) */}
        <div className="flex-1 flex flex-col">
          {/* 2. VE SONRAKİ SAYFALAR İÇİN ÖZEL ÜST BİLGİ ÇUBUĞU */}
          {pageIndex > 0 && cvData.settings.showPage2Header && (
            <div
              className={`mb-2 pb-1.5 border-b ${theme.page2BarBorder} flex items-center justify-between gap-4 text-[10.5px] text-slate-500`}
            >
              <div className="font-bold text-slate-800 uppercase tracking-wide min-w-0 truncate">
                {cvData.settings.page2HeaderLeftText?.trim() ? (
                  <span className="normal-case">
                    {cvData.settings.page2HeaderLeftText}
                  </span>
                ) : (
                  <>
                    {cvData.personal.fullName}
                    {cvData.personal.title && (
                      <>
                        <span className="font-normal text-slate-400 mx-1.5">|</span>
                        <span
                          className={`font-medium ${theme.titleText} normal-case`}
                        >
                          {cvData.personal.title.split(/\s*[·•|(]\s*/)[0].trim()}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              {page2RightDisplay && (
                <div className="text-slate-500 font-medium shrink-0 whitespace-nowrap">
                  {page2RightDisplay}
                </div>
              )}
            </div>
          )}

          {/* BU SAYFAYA YERLEŞTİRİLEN ATOMİK BLOKLAR */}
          <div>
            {blocks.map((placed, bIdx) => {
              const hasForcedBreak = cvData.settings.forcedBreaks.includes(
                placed.block.id,
              );
              return (
                <div key={placed.block.id} className="relative group/block">
                  {/* Blok üzerine gelindiğinde manuel sayfa sonu butonu */}
                  {onToggleForcedBreak && (
                    <button
                      type="button"
                      onClick={() => onToggleForcedBreak(placed.block.id)}
                      title={
                        hasForcedBreak
                          ? "Manuel sayfa kesmesini kaldır"
                          : "Bu bloktan itibaren yeni sayfaya geçir"
                      }
                      className={`no-print opacity-0 group-hover/block:opacity-100 transition-opacity absolute -right-6 top-0 p-1 rounded ${
                        hasForcedBreak
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Scissors className="w-3 h-3" />
                    </button>
                  )}
                  <CvPlacedBlockRenderer
                    placed={placed}
                    cvData={cvData}
                    onPhotoClick={onPhotoClick}
                    isFirstOnPage={bIdx === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ALT BİLGİ (FOOTER) ÇUBUĞU */}
        {shouldShowFooter && (
          <footer className="mt-auto pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span className="truncate max-w-[70%] font-medium">
              {cvData.settings.footerLeftText}
            </span>
            <span className="shrink-0">{rightFooterDisplay}</span>
          </footer>
        )}
      </div>
    </div>
  );
};
