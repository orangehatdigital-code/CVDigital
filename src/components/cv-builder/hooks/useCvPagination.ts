import { useState, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { CvData, CvBlock, PlacedBlock, CvProject } from "../types";
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_TITLES } from "../constants";

export const useCvPagination = (cvData: CvData) => {
  const measureContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRulerRef = useRef<HTMLDivElement | null>(null);
  const [paginatedPages, setPaginatedPages] = useState<PlacedBlock[][]>([]);

  // Tüm CV'yi seçilen bölüm sırasına (sectionOrder) göre atomik bloklara ayırıyoruz
  const allBlocks = useMemo((): CvBlock[] => {
    const blocks: CvBlock[] = [];

    // 1. Üst Başlık her zaman en üstte
    blocks.push({
      id: "block-header",
      type: "header",
      sectionKey: "header",
      isFirstInSection: true,
      isLastInSection: true,
    });

    const sectionOrder = cvData.settings.sectionOrder || DEFAULT_SECTION_ORDER;
    const hiddenSections = cvData.settings.hiddenSections || [];
    const titles = cvData.settings.sectionTitles || DEFAULT_SECTION_TITLES;

    sectionOrder.forEach((sectionId) => {
      if (hiddenSections.includes(sectionId)) return;

      switch (sectionId) {
        case "summary":
          if (cvData.summary.trim()) {
            blocks.push({
              id: "block-summary",
              type: "summary",
              sectionKey: "summary",
              sectionTitle: titles.summary,
              isFirstInSection: true,
              isLastInSection: true,
            });
          }
          break;

        case "skills":
          if (cvData.skills.length > 0) {
            blocks.push({
              id: "block-skills",
              type: "skills",
              sectionKey: "skills",
              sectionTitle: titles.skills,
              isFirstInSection: true,
              isLastInSection: true,
            });
          }
          break;

        case "experiences":
          cvData.experiences.forEach((exp, idx) => {
            blocks.push({
              id: `block-exp-${exp.id}`,
              type: "experience",
              sectionKey: "experiences",
              sectionTitle: titles.experiences,
              isFirstInSection: idx === 0,
              isLastInSection: idx === cvData.experiences.length - 1,
              data: exp,
            });
          });
          break;

        case "projects": {
          const visibleProjects = cvData.projects.filter((p) => p.visible);
          if (cvData.settings.projectsLayout === "grid") {
            const pairs: CvProject[][] = [];
            for (let i = 0; i < visibleProjects.length; i += 2) {
              pairs.push(visibleProjects.slice(i, i + 2));
            }
            pairs.forEach((pair, idx) => {
              blocks.push({
                id: `block-proj-row-${pair.map((p) => p.id).join("-")}`,
                type: "projectRow",
                sectionKey: "projects",
                sectionTitle: titles.projects,
                isFirstInSection: idx === 0,
                isLastInSection: idx === pairs.length - 1,
                data: pair,
              });
            });
          } else {
            visibleProjects.forEach((proj, idx) => {
              blocks.push({
                id: `block-proj-${proj.id}`,
                type: "project",
                sectionKey: "projects",
                sectionTitle: titles.projects,
                isFirstInSection: idx === 0,
                isLastInSection: idx === visibleProjects.length - 1,
                data: proj,
              });
            });
          }
          break;
        }

        case "education":
          cvData.education.forEach((edu, idx) => {
            blocks.push({
              id: `block-edu-${edu.id}`,
              type: "education",
              sectionKey: "education",
              sectionTitle: titles.education,
              isFirstInSection: idx === 0,
              isLastInSection: idx === cvData.education.length - 1,
              data: edu,
            });
          });
          break;

        case "certificates":
          if (cvData.certificates.length > 0) {
            blocks.push({
              id: "block-certificates",
              type: "certificates",
              sectionKey: "certificates",
              sectionTitle: titles.certificates,
              isFirstInSection: true,
              isLastInSection: true,
            });
          }
          break;

        case "closing":
          if ((cvData.closingNote || "").trim()) {
            blocks.push({
              id: "block-closing",
              type: "closing",
              sectionKey: "closing",
              sectionTitle: titles.closing,
              isFirstInSection: true,
              isLastInSection: true,
            });
          }
          break;
      }
    });

    return blocks;
  }, [cvData]);

  // Akıllı A4 Sayfalama Hesaplaması:
  // Her bloğun gerçek yüksekliğini ölçer ve 1. sayfanın alt boşluğunu koruyarak
  // tam bir maddenin bittiği yerden 2. sayfaya geçirir.
  const recalculatePages = useCallback(() => {
    const container = measureContainerRef.current;
    const ruler = pageRulerRef.current;
    if (!container || !ruler) return;

    const a4HeightPx = ruler.getBoundingClientRect().height || 1122.5;
    const mmToPx = a4HeightPx / 297;

    const marginMm = cvData.settings.pageMarginMm || 14;
    const topBottomPaddingPx = marginMm * 2 * mmToPx;
    const footerReservePx = cvData.settings.showFooter !== false ? 8 * mmToPx : 0;
    const page2HeaderReservePx = cvData.settings.showPage2Header ? 11 * mmToPx : 0;
    const continuationHeaderExtraPx = 7 * mmToPx;

    const maxPage1ContentPx = a4HeightPx - topBottomPaddingPx - footerReservePx;
    const maxPageNContentPx =
      a4HeightPx - topBottomPaddingPx - footerReservePx - page2HeaderReservePx;

    const pages: PlacedBlock[][] = [];
    let currentPage: PlacedBlock[] = [];
    let currentHeight = 0;
    let currentPageIndex = 0;

    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      const el = container.querySelector<HTMLElement>(
        `[data-measure-id="${block.id}"]`,
      );
      const rawHeight = el ? el.getBoundingClientRect().height : 60;

      const isForcedBreak =
        currentPage.length > 0 &&
        cvData.settings.forcedBreaks.includes(block.id);

      const pageLimit =
        currentPageIndex === 0 ? maxPage1ContentPx : maxPageNContentPx;

      const wouldNeedContinuationHeader =
        !block.isFirstInSection && cvData.settings.showContinuationLabel;

      const fitsInCurrentPage =
        !isForcedBreak &&
        (currentPage.length === 0 || currentHeight + rawHeight <= pageLimit);

      if (!fitsInCurrentPage) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
        currentPageIndex++;
      }

      const isAtStartOfNewPage = currentPage.length === 0;
      const isSectionSplitAcrossPage =
        isAtStartOfNewPage && !block.isFirstInSection && currentPageIndex > 0;

      const showSectionHeader =
        block.isFirstInSection ||
        (isSectionSplitAcrossPage && cvData.settings.showContinuationLabel);

      currentPage.push({
        block,
        showSectionHeader,
        isContinuation: isSectionSplitAcrossPage,
      });

      currentHeight +=
        rawHeight +
        (isSectionSplitAcrossPage && wouldNeedContinuationHeader
          ? continuationHeaderExtraPx
          : 0);
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    setPaginatedPages((prev) => {
      if (
        prev.length === pages.length &&
        prev.every(
          (prevPage, pIdx) =>
            prevPage.length === pages[pIdx].length &&
            prevPage.every(
              (item, bIdx) =>
                item.block === pages[pIdx][bIdx].block &&
                item.showSectionHeader === pages[pIdx][bIdx].showSectionHeader &&
                item.isContinuation === pages[pIdx][bIdx].isContinuation,
            ),
        )
      ) {
        return prev;
      }
      return pages;
    });
  }, [
    allBlocks,
    cvData.settings.pageMarginMm,
    cvData.settings.showFooter,
    cvData.settings.showPageNumbers,
    cvData.settings.showPage2Header,
    cvData.settings.showContinuationLabel,
    cvData.settings.forcedBreaks,
  ]);

  useLayoutEffect(() => {
    recalculatePages();
    const container = measureContainerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      recalculatePages();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [recalculatePages]);

  const pagesToRender: PlacedBlock[][] =
    paginatedPages.length > 0
      ? paginatedPages
      : [
          allBlocks.map((block) => ({
            block,
            showSectionHeader: block.isFirstInSection,
            isContinuation: false,
          })),
        ];

  return {
    measureContainerRef,
    pageRulerRef,
    allBlocks,
    paginatedPages,
    pagesToRender,
    recalculatePages,
  };
};
