import { CvData, SectionId } from "../types";
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_TITLES,
  GENERIC_SECTION_TITLES,
} from "../constants";

export const normalizeCvData = (
  raw?: Partial<CvData>,
  fallbackCv?: CvData,
): CvData => {
  const baseCv = fallbackCv || ({} as CvData);

  const savedOrder: SectionId[] = Array.isArray(raw?.settings?.sectionOrder)
    ? raw!.settings!.sectionOrder
    : baseCv.settings?.sectionOrder || DEFAULT_SECTION_ORDER;

  const normalizedOrder: SectionId[] = [
    ...savedOrder.filter((s) => DEFAULT_SECTION_ORDER.includes(s)),
    ...DEFAULT_SECTION_ORDER.filter((s) => !savedOrder.includes(s)),
  ];

  const fullName = raw?.personal?.fullName ?? baseCv.personal?.fullName ?? "";
  const website = raw?.personal?.website ?? baseCv.personal?.website ?? "";
  const defaultFooterLeft = [fullName, website].filter(Boolean).join(" — ");

  const baseSectionTitles =
    baseCv.settings?.sectionTitles ||
    raw?.settings?.sectionTitles ||
    DEFAULT_SECTION_TITLES;

  return {
    summary: raw?.summary ?? baseCv.summary ?? "",
    closingNote: raw?.closingNote ?? baseCv.closingNote ?? "",
    skills: Array.isArray(raw?.skills) ? raw!.skills : baseCv.skills || [],
    experiences: Array.isArray(raw?.experiences)
      ? raw!.experiences
      : baseCv.experiences || [],
    projects: Array.isArray(raw?.projects)
      ? raw!.projects
      : baseCv.projects || [],
    education: Array.isArray(raw?.education)
      ? raw!.education
      : baseCv.education || [],
    certificates: Array.isArray(raw?.certificates)
      ? raw!.certificates
      : baseCv.certificates || [],
    settings: {
      fontFamily: raw?.settings?.fontFamily || baseCv.settings?.fontFamily || "sans",
      density: raw?.settings?.density || baseCv.settings?.density || "compact",
      pageMarginMm:
        typeof raw?.settings?.pageMarginMm === "number"
          ? raw.settings.pageMarginMm
          : baseCv.settings?.pageMarginMm || 14,
      showPage2Header:
        typeof raw?.settings?.showPage2Header === "boolean"
          ? raw.settings.showPage2Header
          : baseCv.settings?.showPage2Header ?? true,
      page2HeaderLeftText:
        typeof raw?.settings?.page2HeaderLeftText === "string"
          ? raw.settings.page2HeaderLeftText
          : baseCv.settings?.page2HeaderLeftText || "",
      page2HeaderRightText:
        typeof raw?.settings?.page2HeaderRightText === "string"
          ? raw.settings.page2HeaderRightText
          : baseCv.settings?.page2HeaderRightText || "",
      showFooter:
        typeof raw?.settings?.showFooter === "boolean"
          ? raw.settings.showFooter
          : baseCv.settings?.showFooter ?? true,
      showFooterOnSinglePage:
        typeof raw?.settings?.showFooterOnSinglePage === "boolean"
          ? raw.settings.showFooterOnSinglePage
          : baseCv.settings?.showFooterOnSinglePage ?? false,
      footerLeftText:
        typeof raw?.settings?.footerLeftText === "string"
          ? raw.settings.footerLeftText
          : baseCv.settings?.footerLeftText || defaultFooterLeft,
      footerRightCustomText:
        typeof raw?.settings?.footerRightCustomText === "string"
          ? raw.settings.footerRightCustomText
          : baseCv.settings?.footerRightCustomText || "",
      showPageNumbers:
        typeof raw?.settings?.showPageNumbers === "boolean"
          ? raw.settings.showPageNumbers
          : baseCv.settings?.showPageNumbers ?? true,
      pageNumberLabel:
        typeof raw?.settings?.pageNumberLabel === "string"
          ? raw.settings.pageNumberLabel
          : baseCv.settings?.pageNumberLabel || "Sayfa",
      showContinuationLabel:
        typeof raw?.settings?.showContinuationLabel === "boolean"
          ? raw.settings.showContinuationLabel
          : baseCv.settings?.showContinuationLabel ?? true,
      continuationLabelText:
        typeof raw?.settings?.continuationLabelText === "string"
          ? raw.settings.continuationLabelText
          : baseCv.settings?.continuationLabelText || "(Devamı)",
      sectionTitles: {
        ...GENERIC_SECTION_TITLES,
        ...baseSectionTitles,
        ...(raw?.settings?.sectionTitles || {}),
      },
      showPhoto:
        typeof raw?.settings?.showPhoto === "boolean"
          ? raw.settings.showPhoto
          : baseCv.settings?.showPhoto ?? true,
      photoUrl: raw?.settings?.photoUrl ?? baseCv.settings?.photoUrl ?? "",
      photoPosition:
        raw?.settings?.photoPosition || baseCv.settings?.photoPosition || "left",
      photoShape:
        raw?.settings?.photoShape || baseCv.settings?.photoShape || "rounded",
      photoSize: raw?.settings?.photoSize || baseCv.settings?.photoSize || "md",
      photoZoom:
        typeof raw?.settings?.photoZoom === "number"
          ? raw.settings.photoZoom
          : baseCv.settings?.photoZoom ?? 1,
      photoOffsetY:
        typeof raw?.settings?.photoOffsetY === "number"
          ? raw.settings.photoOffsetY
          : baseCv.settings?.photoOffsetY ?? 0,
      accentColor:
        raw?.settings?.accentColor || baseCv.settings?.accentColor || "navy",
      showLinksIcon:
        typeof raw?.settings?.showLinksIcon === "boolean"
          ? raw.settings.showLinksIcon
          : baseCv.settings?.showLinksIcon ?? true,
      forcedBreaks: Array.isArray(raw?.settings?.forcedBreaks)
        ? raw!.settings!.forcedBreaks
        : baseCv.settings?.forcedBreaks || [],
      sectionOrder: normalizedOrder,
      hiddenSections: Array.isArray(raw?.settings?.hiddenSections)
        ? raw!.settings!.hiddenSections
        : baseCv.settings?.hiddenSections || [],
      skillsLayout: raw?.settings?.skillsLayout === "grid" ? "grid" : "list",
      projectsLayout: raw?.settings?.projectsLayout === "grid" ? "grid" : "list",
      sectionHeaderStyle:
        raw?.settings?.sectionHeaderStyle === "clean" ||
        raw?.settings?.sectionHeaderStyle === "tinted"
          ? raw.settings.sectionHeaderStyle
          : "accentBar",
      templateLayout:
        raw?.settings?.templateLayout === "classic" ? "classic" : "modern",
    },
    personal: {
      fullName,
      title: raw?.personal?.title ?? baseCv.personal?.title ?? "",
      phone: raw?.personal?.phone ?? baseCv.personal?.phone ?? "",
      email: raw?.personal?.email ?? baseCv.personal?.email ?? "",
      corpEmail: raw?.personal?.corpEmail ?? baseCv.personal?.corpEmail ?? "",
      location: raw?.personal?.location ?? baseCv.personal?.location ?? "",
      militaryLabel:
        typeof raw?.personal?.militaryLabel === "string"
          ? raw.personal.militaryLabel
          : baseCv.personal?.militaryLabel ?? "",
      military: raw?.personal?.military ?? baseCv.personal?.military ?? "",
      website,
      github: raw?.personal?.github ?? baseCv.personal?.github ?? "",
      linkedin: raw?.personal?.linkedin ?? baseCv.personal?.linkedin ?? "",
      googlePlay: raw?.personal?.googlePlay ?? baseCv.personal?.googlePlay ?? "",
      links: raw?.personal?.links || baseCv.personal?.links || [],
    },
  };
};
