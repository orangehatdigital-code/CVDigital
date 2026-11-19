import React from "react";
import { CvExperience, CvThemeTokens } from "../../types";
import { renderFormattedText } from "../../utils/formatText";

interface ExperienceBlockProps {
  experience: CvExperience;
  isFirstInSection: boolean;
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

export const ExperienceBlock: React.FC<ExperienceBlockProps> = ({
  experience,
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
      <div className={isLastInSection ? (isCompact ? "mb-4" : "mb-5") : (isCompact ? "mb-2.5" : "mb-3.5")}>
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
          {/* 1. Satır: Solda Rol / Unvan, Sağda Tarih */}
          <div className="flex items-baseline justify-between gap-3">
            <span className={`${isCompact ? "text-xs" : "text-[13px]"} font-bold text-slate-950 min-w-0`}>
              {experience.role}
            </span>
            <span className="text-slate-600 font-normal shrink-0 text-[11px]">
              {experience.date}
            </span>
          </div>

          {/* 2. Satır: Alt Satırda Şirket Adı & Konum */}
          <div className={`text-[11.5px] font-semibold text-slate-800 mt-0.5 leading-snug`}>
            <span>{experience.company}</span>
            {experience.location && (
              <span className="font-normal text-slate-600"> · {experience.location}</span>
            )}
          </div>

          {/* 3. Satır: Madde İmleri */}
          {experience.bullets.some((b) => b.trim() !== "") && (
            <ul
              className={`list-disc list-outside ml-4 mt-1 marker:text-slate-900 ${
                isCompact ? "space-y-0.5 text-[11px] leading-[1.38]" : "space-y-1 text-xs"
              } text-slate-800`}
            >
              {experience.bullets
                .filter((b) => b.trim() !== "")
                .map((bullet, bIdx) => (
                  <li key={bIdx}>{renderFormattedText(bullet)}</li>
                ))}
            </ul>
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
            ? "mb-4 sm:mb-5"
            : "mb-5 sm:mb-6"
          : isCompact
            ? "mb-2.5 pb-2 border-b border-slate-100"
            : "mb-3.5 pb-2.5 border-b border-slate-100"
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
        {/* 1. Satır: Solda Rol / Unvan, Sağda Tarih */}
        <div className="flex items-baseline justify-between gap-3">
          <span
            className={`${
              isCompact ? "text-xs" : "text-[13px]"
            } font-bold text-slate-950 min-w-0`}
          >
            {experience.role}
          </span>
          <span
            className={`${
              isCompact ? "text-[10.5px]" : "text-[11px]"
            } font-medium text-slate-600 shrink-0`}
          >
            {experience.date}
          </span>
        </div>

        {/* 2. Satır: Alt Satırda Şirket Adı & Konum */}
        <div
          className={`${
            isCompact ? "text-xs" : "text-[12.5px]"
          } font-semibold ${theme.companyText} mt-0.5 leading-snug`}
        >
          <span>{experience.company}</span>
          {experience.location && (
            <span className="font-normal text-slate-500">
              {" "}· {experience.location}
            </span>
          )}
        </div>

        {/* 3. Satır: Madde İmleri */}
        {experience.bullets.some((b) => b.trim() !== "") && (
          <ul
            className={`list-disc list-outside ml-4 mt-1 ${theme.bulletMarker} ${
              isCompact ? "space-y-0.5 text-[11.5px]" : "space-y-1 text-xs"
            } text-slate-800`}
          >
            {experience.bullets
              .filter((b) => b.trim() !== "")
              .map((bullet, i) => (
                <li key={i}>{renderFormattedText(bullet)}</li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
