import React from "react";
import { CvData, PlacedBlock, CvBlock } from "../types";
import { CvPageSheet } from "./CvPageSheet";
import { CvPlacedBlockRenderer } from "./CvPlacedBlockRenderer";

interface CvPreviewContainerProps {
  cvData: CvData;
  pagesToRender: PlacedBlock[][];
  allBlocks: CvBlock[];
  measureContainerRef: React.RefObject<HTMLDivElement | null>;
  pageRulerRef: React.RefObject<HTMLDivElement | null>;
  viewMode: "split" | "preview";
  onPhotoClick?: () => void;
  onToggleForcedBreak?: (blockId: string) => void;
}

export const CvPreviewContainer: React.FC<CvPreviewContainerProps> = ({
  cvData,
  pagesToRender,
  allBlocks,
  measureContainerRef,
  pageRulerRef,
  viewMode,
  onPhotoClick,
  onToggleForcedBreak,
}) => {
  const isCompact = cvData.settings.density === "compact";
  const horizontalMarginMm = isCompact ? 15 : 18;
  const marginMm = cvData.settings.pageMarginMm || 14;

  return (
    <>
      {/* A4 Yüksekliğini (297mm) Tarayıcı DPI'ına Göre Hassas Ölçen Gizli Cetvel */}
      <div
        ref={pageRulerRef}
        aria-hidden="true"
        className="no-print pointer-events-none fixed top-0 left-0 -z-50 opacity-0"
        style={{ width: "210mm", height: "297mm" }}
      />

      {/* Blok Yüksekliklerini Gerçek Zamanlı Ölçen Gizli Katman */}
      <div
        ref={measureContainerRef}
        aria-hidden="true"
        className="no-print pointer-events-none fixed top-0 left-0 -z-50 opacity-0 bg-white"
        style={{
          width: "210mm",
          paddingLeft: `${horizontalMarginMm}mm`,
          paddingRight: `${horizontalMarginMm}mm`,
          paddingTop: `${marginMm}mm`,
          paddingBottom: `${marginMm}mm`,
          boxSizing: "border-box",
        }}
      >
        {allBlocks.map((block) => (
          <div key={block.id} data-measure-id={block.id} className="flow-root">
            <CvPlacedBlockRenderer
              placed={{
                block,
                showSectionHeader: block.isFirstInSection,
                isContinuation: false,
              }}
              cvData={cvData}
            />
          </div>
        ))}
      </div>

      {/* YAZDIRMA (PRINT) İÇİN ÖZEL A4 SAYFALAMA CSS */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          html, body {
            width: 210mm !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-root,
          .print-main,
          .print-preview-container,
          .print-pages-wrapper {
            display: block !important;
            position: static !important;
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 0 !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            gap: 0 !important;
          }
          .cv-page-wrapper {
            display: block !important;
            position: relative !important;
            width: 210mm !important;
            max-width: 210mm !important;
            height: 296.5mm !important;
            max-height: 296.5mm !important;
            min-height: 296.5mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .cv-page-wrapper:not(:last-child) {
            break-after: page !important;
            page-break-after: always !important;
          }
          .cv-page-wrapper:last-child {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          .cv-a4-page {
            width: 210mm !important;
            height: 296.5mm !important;
            min-height: 296.5mm !important;
            max-height: 296.5mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .page-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* SAĞ / MERKEZ PANEL: GERÇEK A4 SAYFALARINA BÖLÜNMÜŞ ÖNİZLEME */}
      <div
        className={`print-pages-wrapper ${
          viewMode === "split"
            ? "lg:col-span-7 xl:col-span-7 2xl:col-span-7"
            : "lg:col-span-12 max-w-4xl mx-auto w-full"
        } flex flex-col items-center gap-8 w-full`}
      >
        {pagesToRender.map((pageBlocks, pageIdx) => (
          <CvPageSheet
            key={`page-${pageIdx + 1}`}
            pageIndex={pageIdx}
            totalPages={pagesToRender.length}
            blocks={pageBlocks}
            cvData={cvData}
            onPhotoClick={onPhotoClick}
            onToggleForcedBreak={onToggleForcedBreak}
          />
        ))}
      </div>
    </>
  );
};
