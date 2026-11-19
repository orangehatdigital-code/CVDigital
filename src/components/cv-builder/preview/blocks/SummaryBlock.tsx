import React from "react";
import { renderFormattedText } from "../../utils/formatText";

interface SummaryBlockProps {
  summary: string;
  sectionTitle?: string;
  sectionHeaderClass: string;
  isCompact: boolean;
  isFirstOnPage?: boolean;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({
  summary,
  sectionTitle,
  sectionHeaderClass,
  isCompact,
  isFirstOnPage = false,
}) => {
  return (
    <section
      className={`${
        isFirstOnPage ? "pt-0" : isCompact ? "pt-2" : "pt-2.5"
      } ${isCompact ? "mb-4 sm:mb-4.5" : "mb-5 sm:mb-5.5"}`}
    >
      <h2 className={sectionHeaderClass}>
        <span>{sectionTitle}</span>
      </h2>
      <p
        className={`${
          isCompact ? "text-[11.5px] leading-[1.45]" : "text-xs leading-relaxed"
        } text-slate-800 text-justify`}
      >
        {renderFormattedText(summary)}
      </p>
    </section>
  );
};
