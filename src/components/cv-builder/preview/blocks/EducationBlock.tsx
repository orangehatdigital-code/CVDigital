import React from "react";
import { CvEducation, CvThemeTokens } from "../../types";

interface EducationBlockProps {
  education: CvEducation;
  isLastInSection: boolean;
  showSectionHeader: boolean;
  isContinuation: boolean;
  sectionTitle?: string;
  contText?: string;
  sectionHeaderClass: string;
  theme: CvThemeTokens;
  isCompact: boolean;
  templateLayout?: "modern" | "classic";
  isFirstOnPage?: boolean;
}

export const EducationBlock: React.FC<EducationBlockProps> = ({
  education,
  isLastInSection,
  showSectionHeader,
  isContinuation,
  sectionTitle,
  contText,
  sectionHeaderClass,
  theme,
  isCompact,
  templateLayout = "modern",
  isFirstOnPage = false,
}) => {
  const isClassic = templateLayout === "classic";

  if (isClassic) {
    return (
      <div className={isLastInSection ? (isCompact ? "mb-4" : "mb-5") : (isCompact ? "mb-2" : "mb-3")}>
        {showSectionHeader && (
          <div className={isFirstOnPage ? "pt-0" : "pt-2.5 sm:pt-3.5"}>
            <h2 className={sectionHeaderClass}>
              <span>
                {sectionTitle}
                {isContinuation && contText && (
                  <span className="text-[10px] font-normal text-slate-500 ml-1.5 normal-case">
                    {contText}
                  </span>
                )}
              </span>
            </h2>
          </div>
        )}
        <div className="page-break-avoid">
          <div className={`${isCompact ? "text-xs" : "text-[13px]"} font-bold text-slate-950`}>
            {education.degree}
          </div>
          <div className={`flex items-baseline justify-between ${isCompact ? "text-[11px]" : "text-[11.5px]"} text-slate-800 mt-0.5`}>
            <span className="font-semibold text-slate-900">{education.school}</span>
            <span className="text-slate-600 font-normal shrink-0">{education.date}</span>
          </div>
          {education.details && (
            <p className={`${isCompact ? "text-[10.5px]" : "text-[11px]"} text-slate-600 mt-0.5`}>
              {education.details}
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={
        isLastInSection
          ? isCompact
            ? "mb-4"
            : "mb-5"
          : isCompact
            ? "mb-2"
            : "mb-3"
      }
    >
      {showSectionHeader && (
        <div className={isFirstOnPage ? "pt-0" : "pt-2.5 sm:pt-3.5"}>
          <h2 className={sectionHeaderClass}>
            <span>
              {sectionTitle}
              {isContinuation && contText && (
                <span className="text-[10px] font-normal text-slate-500 ml-1.5 normal-case">
                  {contText}
                </span>
              )}
            </span>
          </h2>
        </div>
      )}
      <div className="page-break-avoid">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span
              className={`${
                isCompact ? "text-xs" : "text-[13px]"
              } font-bold text-slate-950`}
            >
              {education.degree}
            </span>
            <span className="text-slate-400 mx-1.5">|</span>
            <span
              className={`${
                isCompact ? "text-xs" : "text-[13px]"
              } font-semibold ${theme.companyText}`}
            >
              {education.school}
            </span>
          </div>
          <span
            className={`${
              isCompact ? "text-[10.5px]" : "text-[11px]"
            } font-medium text-slate-600 shrink-0`}
          >
            {education.date}
          </span>
        </div>
        {education.details && (
          <p
            className={`${
              isCompact ? "text-[11px] mt-0.5" : "text-xs mt-1"
            } text-slate-700`}
          >
            {education.details}
          </p>
        )}
      </div>
    </div>
  );
};
