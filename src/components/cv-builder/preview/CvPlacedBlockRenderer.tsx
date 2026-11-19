import React from "react";
import {
  CvData,
  PlacedBlock,
  CvThemeTokens,
  CvExperience,
  CvProject,
  CvEducation,
  ThemeId,
} from "../types";
import { CV_THEMES, getThemeTokens } from "../constants";
import { HeaderBlock } from "./blocks/HeaderBlock";
import { SummaryBlock } from "./blocks/SummaryBlock";
import { SkillsBlock } from "./blocks/SkillsBlock";
import { ExperienceBlock } from "./blocks/ExperienceBlock";
import { ProjectBlock, ProjectRowBlock } from "./blocks/ProjectBlock";
import { EducationBlock } from "./blocks/EducationBlock";
import { CertificateBlock, ClosingBlock } from "./blocks/CertificateBlock";

interface CvPlacedBlockRendererProps {
  placed: PlacedBlock;
  cvData: CvData;
  onPhotoClick?: () => void;
  isFirstOnPage?: boolean;
}

export const CvPlacedBlockRenderer: React.FC<CvPlacedBlockRendererProps> = ({
  placed,
  cvData,
  onPhotoClick,
  isFirstOnPage = false,
}) => {
  const { block, showSectionHeader, isContinuation } = placed;
  const isClassic = cvData.settings.templateLayout === "classic";
  const isCompact = cvData.settings.density === "compact";
  const theme: CvThemeTokens = getThemeTokens(cvData.settings.accentColor);
  const headerStyleMode = cvData.settings.sectionHeaderStyle || "accentBar";

  const sectionHeaderVariantClass =
    headerStyleMode === "tinted"
      ? `${theme.sectionHeaderBar} ${theme.sectionHeaderBg} ${theme.sectionHeaderBorder} px-2 py-1 rounded-r`
      : headerStyleMode === "accentBar"
        ? `${theme.sectionHeaderBar} ${theme.sectionHeaderBorder} pl-2 pb-0.5`
        : `${theme.sectionHeaderBorder} pb-0.5`;

  const sectionHeaderClass = isClassic
    ? `${
        isCompact ? "text-xs" : "text-[13px]"
      } font-bold uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-0.5 mb-2 flex items-center justify-between`
    : `${
        isCompact ? "text-[11.5px]" : "text-sm"
      } font-bold uppercase tracking-wider ${theme.sectionHeaderText} ${sectionHeaderVariantClass} mb-2 flex items-center justify-between`;

  const contText = cvData.settings.continuationLabelText ?? "(Devamı)";

  switch (block.type) {
    case "header":
      return (
        <HeaderBlock
          cvData={cvData}
          theme={theme}
          isCompact={isCompact}
          templateLayout={cvData.settings.templateLayout}
          onPhotoClick={onPhotoClick}
        />
      );

    case "summary":
      return (
        <SummaryBlock
          summary={cvData.summary}
          sectionTitle={block.sectionTitle}
          sectionHeaderClass={sectionHeaderClass}
          isCompact={isCompact}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "skills":
      return (
        <SkillsBlock
          skills={cvData.skills}
          sectionTitle={block.sectionTitle}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          skillsLayout={cvData.settings.skillsLayout}
          templateLayout={cvData.settings.templateLayout}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "experience":
      return (
        <ExperienceBlock
          experience={block.data as CvExperience}
          isFirstInSection={block.isFirstInSection}
          isLastInSection={block.isLastInSection}
          showSectionHeader={showSectionHeader}
          isContinuation={isContinuation}
          sectionTitle={block.sectionTitle}
          contText={contText}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          templateLayout={cvData.settings.templateLayout}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "project":
      return (
        <ProjectBlock
          project={block.data as CvProject}
          isLastInSection={block.isLastInSection}
          showSectionHeader={showSectionHeader}
          isContinuation={isContinuation}
          sectionTitle={block.sectionTitle}
          contText={contText}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          templateLayout={cvData.settings.templateLayout}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "projectRow":
      return (
        <ProjectRowBlock
          pair={block.data as CvProject[]}
          isLastInSection={block.isLastInSection}
          showSectionHeader={showSectionHeader}
          isContinuation={isContinuation}
          sectionTitle={block.sectionTitle}
          contText={contText}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "education":
      return (
        <EducationBlock
          education={block.data as CvEducation}
          isLastInSection={block.isLastInSection}
          showSectionHeader={showSectionHeader}
          isContinuation={isContinuation}
          sectionTitle={block.sectionTitle}
          contText={contText}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          templateLayout={cvData.settings.templateLayout}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "certificates":
      return (
        <CertificateBlock
          certificates={cvData.certificates}
          sectionTitle={block.sectionTitle}
          sectionHeaderClass={sectionHeaderClass}
          theme={theme}
          isCompact={isCompact}
          isFirstOnPage={isFirstOnPage}
        />
      );

    case "closing":
      return (
        <ClosingBlock
          closingNote={cvData.closingNote}
          sectionTitle={block.sectionTitle}
          sectionHeaderClass={sectionHeaderClass}
          isCompact={isCompact}
        />
      );

    default:
      return null;
  }
};
