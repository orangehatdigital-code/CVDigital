import React from "react";
import { CvSkill, CvThemeTokens } from "../../types";

interface SkillsBlockProps {
  skills: CvSkill[];
  sectionTitle?: string;
  sectionHeaderClass: string;
  theme: CvThemeTokens;
  isCompact: boolean;
  skillsLayout?: "list" | "grid";
  templateLayout?: "modern" | "classic";
  isFirstOnPage?: boolean;
}

export const SkillsBlock: React.FC<SkillsBlockProps> = ({
  skills,
  sectionTitle,
  sectionHeaderClass,
  theme,
  isCompact,
  skillsLayout,
  templateLayout = "modern",
  isFirstOnPage = false,
}) => {
  const isGridSkills = skillsLayout === "grid";
  const isClassic = templateLayout === "classic";
  const totalSkills = skills.length;

  return (
    <section
      className={`${
        isFirstOnPage ? "pt-0" : isCompact ? "pt-2.5 sm:pt-3" : "pt-3 sm:pt-3.5"
      } ${isCompact ? "mb-4 sm:mb-4.5" : "mb-5 sm:mb-5.5"}`}
    >
      <h2 className={sectionHeaderClass}>
        <span>{sectionTitle}</span>
      </h2>
      <div
        className={
          isGridSkills
            ? `grid grid-cols-2 ${
                isCompact ? "gap-x-5 gap-y-1.5" : "gap-x-6 gap-y-2"
              }`
            : isCompact
              ? "space-y-1"
              : "space-y-1.5"
        }
      >
        {skills.map((sk, idx) => {
          const isLastOdd =
            isGridSkills && totalSkills % 2 === 1 && idx === totalSkills - 1;
          return (
            <div
              key={sk.id}
              className={`${isLastOdd ? "col-span-2" : ""} ${
                isCompact
                  ? "text-[11px] leading-[1.38]"
                  : "text-xs leading-snug"
              } text-slate-800 min-w-0`}
            >
              <span
                className={`font-bold ${
                  isClassic ? "text-slate-950" : theme.sectionHeaderText
                }`}
              >
                {sk.category}:{" "}
              </span>
              <span>{sk.items}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
