import React from "react";
import { ExternalLink } from "lucide-react";
import { CvProject, CvThemeTokens } from "../../types";
import { renderFormattedText } from "../../utils/formatText";

interface SingleProjectBlockProps {
  project: CvProject;
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

const getProjectLinkLabel = (rawLink: string): string => {
  const l = rawLink.toLowerCase();
  if (l.includes("github.com")) return "GitHub";
  if (l.includes("play.google.com")) return "Google Play";
  if (l.includes("figma.com")) return "Figma";
  if (l.includes("youtube.com")) return "Demo Video";
  if (l.includes("drive.google.com")) return "Doküman";
  return "Canlı İncele";
};

const renderSectionTitle = (title?: string) => {
  if (!title) return null;
  const parenIdx = title.indexOf("(");
  if (parenIdx !== -1) {
    const mainTitle = title.slice(0, parenIdx).trim();
    const subNote = title.slice(parenIdx).trim();
    return (
      <span className="inline-flex items-baseline gap-1.5 flex-wrap">
        <span>{mainTitle}</span>
        <span className="text-[10.5px] sm:text-[11px] font-semibold text-slate-600 normal-case tracking-normal">
          {renderFormattedText(subNote)}
        </span>
      </span>
    );
  }
  return <span>{title}</span>;
};

export const ProjectBlock: React.FC<SingleProjectBlockProps> = ({
  project,
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
  const projHref = project.link
    ? project.link.startsWith("http")
      ? project.link
      : `https://${project.link}`
    : "";

  const linkLabel = project.link ? getProjectLinkLabel(project.link) : "";

  if (isClassic) {
    return (
      <div className={isLastInSection ? (isCompact ? "mb-4" : "mb-5") : (isCompact ? "mb-2" : "mb-3")}>
        {showSectionHeader && (
          <div className={isFirstOnPage ? "pt-0" : "pt-2.5 sm:pt-3.5"}>
            <h2 className={sectionHeaderClass}>
              <span>
                {renderSectionTitle(sectionTitle)}
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
          {/* 1. Satır: Solda Proje Adı, Sağda Buton */}
          <div className="flex items-baseline justify-between gap-3">
            <span className={`${isCompact ? "text-xs" : "text-[13px]"} font-bold text-slate-950 min-w-0`}>
              {project.name}
            </span>
            {project.link && (
              <a
                href={projHref}
                target="_blank"
                rel="noreferrer"
                title={projHref}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 hover:text-blue-700 hover:underline shrink-0 whitespace-nowrap transition"
              >
                <span>{linkLabel}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            )}
          </div>

          {/* 2. Satır: Bir alt satırdan başlayan Teknoloji Stack */}
          {project.tech && (
            <div className={`text-[11px] font-medium text-slate-700 italic mt-0.5 leading-snug`}>
              {project.tech}
            </div>
          )}

          {/* 3. Satır: Madde İmleri */}
          {project.bullets.some((b) => b.trim() !== "") && (
            <ul
              className={`list-disc list-outside ml-4 mt-1 marker:text-slate-900 ${
                isCompact ? "space-y-0.5 text-[11px] leading-[1.38]" : "space-y-1 text-xs"
              } text-slate-800`}
            >
              {project.bullets
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
            ? "mb-4"
            : "mb-5"
          : isCompact
            ? "mb-1.5"
            : "mb-2.5"
      }
    >
      {showSectionHeader && (
        <div className={isFirstOnPage ? "pt-0" : "pt-2.5 sm:pt-3.5"}>
          <h2 className={sectionHeaderClass}>
            <span>
              {renderSectionTitle(sectionTitle)}
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
        {/* 1. Satır: Solda Proje Adı, Sağda Buton */}
        <div className="flex items-baseline justify-between gap-3">
          <span
            className={`${
              isCompact ? "text-xs" : "text-[13px]"
            } font-bold text-slate-950 min-w-0`}
          >
            {project.name}
          </span>
          {project.link && (
            <a
              href={projHref}
              target="_blank"
              rel="noreferrer"
              title={projHref}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${theme.linkText} hover:underline shrink-0 whitespace-nowrap transition`}
            >
              <span>{linkLabel}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          )}
        </div>

        {/* 2. Satır: Bir alt satırdan başlayan Teknoloji Stack */}
        {project.tech && (
          <div
            className={`text-[11px] font-semibold ${theme.techText} italic mt-0.5 leading-snug`}
          >
            {project.tech}
          </div>
        )}

        {/* 3. Satır: Madde İmleri */}
        {project.bullets.some((b) => b.trim() !== "") && (
          <ul
            className={`list-disc list-outside ml-4 mt-1 ${theme.bulletMarker} ${
              isCompact
                ? "space-y-0.5 text-[11px] leading-[1.38]"
                : "space-y-1 text-xs"
            } text-slate-800`}
          >
            {project.bullets
              .filter((b) => b.trim() !== "")
              .map((b, idx) => (
                <li key={idx}>{renderFormattedText(b)}</li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface ProjectRowBlockProps {
  pair: CvProject[];
  isLastInSection: boolean;
  showSectionHeader: boolean;
  isContinuation: boolean;
  sectionTitle?: string;
  contText?: string;
  sectionHeaderClass: string;
  theme: CvThemeTokens;
  isCompact: boolean;
  isFirstOnPage?: boolean;
}

export const ProjectRowBlock: React.FC<ProjectRowBlockProps> = ({
  pair,
  isLastInSection,
  showSectionHeader,
  isContinuation,
  sectionTitle,
  contText,
  sectionHeaderClass,
  theme,
  isCompact,
  isFirstOnPage = false,
}) => {
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
              {renderSectionTitle(sectionTitle)}
              {isContinuation && contText && (
                <span className="text-[10px] font-normal text-slate-500 ml-1.5 normal-case">
                  {contText}
                </span>
              )}
            </span>
          </h2>
        </div>
      )}
      <div
        className={`page-break-avoid grid grid-cols-2 ${
          isCompact ? "gap-x-5 gap-y-2" : "gap-x-6 gap-y-2.5"
        }`}
      >
        {pair.map((proj) => {
          const projHref = proj.link
            ? proj.link.startsWith("http")
              ? proj.link
              : `https://${proj.link}`
            : "";
          const linkLabel = proj.link ? getProjectLinkLabel(proj.link) : "";

          return (
            <div
              key={proj.id}
              className={`${
                pair.length === 1 ? "col-span-2" : ""
              } min-w-0 flex flex-col`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`${
                    isCompact ? "text-[11.5px]" : "text-xs"
                  } font-bold text-slate-950 leading-snug min-w-0`}
                >
                  {proj.name}
                </span>
                {proj.link && (
                  <a
                    href={projHref}
                    target="_blank"
                    rel="noreferrer"
                    title={projHref}
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold ${theme.linkText} hover:underline shrink-0 whitespace-nowrap transition`}
                  >
                    <span>{linkLabel}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>
                )}
              </div>
              {proj.tech && (
                <div
                  className={`text-[10.5px] font-semibold ${theme.techText} italic leading-snug mt-0.5`}
                >
                  {proj.tech}
                </div>
              )}
              {proj.bullets.some((b) => b.trim() !== "") && (
                <ul
                  className={`list-disc list-outside ml-3.5 mt-0.5 ${theme.bulletMarker} ${
                    isCompact
                      ? "space-y-0.5 text-[10.8px] leading-[1.35]"
                      : "space-y-0.5 text-[11.5px]"
                  } text-slate-800`}
                >
                  {proj.bullets
                    .filter((b) => b.trim() !== "")
                    .map((b, idx) => (
                      <li key={idx}>{renderFormattedText(b)}</li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
