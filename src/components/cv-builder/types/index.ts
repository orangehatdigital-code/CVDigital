export type SectionId =
  | "summary"
  | "skills"
  | "experiences"
  | "projects"
  | "education"
  | "certificates"
  | "closing";

export type ThemeId =
  | "slate"
  | "navy"
  | "blue"
  | "indigo"
  | "teal"
  | "emerald"
  | "burgundy"
  | "rose"
  | "amber"
  | "violet";

export interface CvThemeTokens {
  id: string;
  name: string;
  desc: string;
  swatchHex: string;
  headerBorder: string;
  nameText: string;
  titleText: string;
  sectionHeaderBar: string;
  sectionHeaderText: string;
  sectionHeaderBorder: string;
  sectionHeaderBg: string;
  companyText: string;
  dateBadge: string;
  techText: string;
  linkText: string;
  bulletMarker: string;
  cardBorder: string;
  cardBg: string;
  page2BarBorder: string;
  customHex?: string;
}

export interface CvSettings {
  fontFamily: "sans" | "serif";
  density: "compact" | "normal";
  pageMarginMm: number;
  showPage2Header: boolean;
  page2HeaderLeftText: string;
  page2HeaderRightText: string;
  showFooter: boolean;
  showFooterOnSinglePage: boolean;
  footerLeftText: string;
  footerRightCustomText: string;
  showPageNumbers: boolean;
  pageNumberLabel: string;
  showContinuationLabel: boolean;
  continuationLabelText: string;
  sectionTitles: Record<SectionId, string>;
  showPhoto: boolean;
  photoUrl: string;
  photoPosition: "right" | "left";
  photoShape: "rounded" | "square" | "circle";
  photoSize: "sm" | "md" | "lg";
  photoZoom: number;
  photoOffsetY: number;
  accentColor: string;
  showLinksIcon: boolean;
  forcedBreaks: string[];
  sectionOrder: SectionId[];
  hiddenSections: SectionId[];
  skillsLayout?: "list" | "grid";
  projectsLayout?: "list" | "grid";
  sectionHeaderStyle?: "clean" | "accentBar" | "tinted";
  templateLayout?: "modern" | "classic";
}

export interface CvLinkItem {
  id: string;
  label: string;
  displayUrl: string;
  url: string;
  visible: boolean;
}

export interface CvPersonal {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  corpEmail: string;
  location: string;
  militaryLabel: string;
  military: string;
  website: string;
  github: string;
  linkedin: string;
  googlePlay: string;
  links: CvLinkItem[];
}

export interface CvSkill {
  id: string;
  category: string;
  items: string;
}

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  date: string;
  bullets: string[];
}

export interface CvProject {
  id: string;
  visible: boolean;
  name: string;
  tech: string;
  link: string;
  bullets: string[];
}

export interface CvEducation {
  id: string;
  degree: string;
  school: string;
  date: string;
  details: string;
}

export interface CvCertificate {
  id: string;
  name: string;
  detail: string;
}

export interface CvData {
  settings: CvSettings;
  personal: CvPersonal;
  summary: string;
  closingNote: string;
  skills: CvSkill[];
  experiences: CvExperience[];
  projects: CvProject[];
  education: CvEducation[];
  certificates: CvCertificate[];
}

export interface SavedCvDraft {
  id: string;
  name: string;
  updatedAt: string;
  cvData: CvData;
}

export type BlockType =
  | "header"
  | "summary"
  | "skills"
  | "experience"
  | "project"
  | "projectRow"
  | "education"
  | "certificates"
  | "closing";

export interface CvBlock {
  id: string;
  type: BlockType;
  sectionKey: string;
  sectionTitle?: string;
  isFirstInSection: boolean;
  isLastInSection: boolean;
  data?: unknown;
}

export interface PlacedBlock {
  block: CvBlock;
  showSectionHeader: boolean;
  isContinuation: boolean;
}

export interface RenderedCvPage {
  pageNumber: number;
  blocks: PlacedBlock[];
  hasMoreAfter: boolean;
}
