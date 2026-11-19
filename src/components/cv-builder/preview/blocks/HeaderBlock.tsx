import React from "react";
import { Upload, ExternalLink } from "lucide-react";
import { CvData, CvThemeTokens, CvLinkItem } from "../../types";

interface HeaderBlockProps {
  cvData: CvData;
  theme: CvThemeTokens;
  isCompact: boolean;
  templateLayout?: "modern" | "classic";
  onPhotoClick?: () => void;
}

const getShortLinkLabel = (link: CvLinkItem): string => {
  if (link.label && link.label.trim()) return link.label.trim();
  const lower = (link.url || link.displayUrl || "").toLowerCase();
  if (lower.includes("github.com")) return "GitHub";
  if (lower.includes("linkedin.com")) return "LinkedIn";
  if (lower.includes("play.google.com")) return "Google Play";
  if (link.displayUrl && link.displayUrl.length <= 22) return link.displayUrl;
  return "Web Sitesi";
};

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
  cvData,
  theme,
  isCompact,
  templateLayout = "modern",
  onPhotoClick,
}) => {
  const visibleLinks = cvData.personal.links.filter((l) => l.visible);
  const isClassic = templateLayout === "classic";

  const photoDimensions =
    cvData.settings.photoSize === "sm"
      ? { width: "78px", height: "96px" }
      : cvData.settings.photoSize === "lg"
        ? { width: "106px", height: "130px" }
        : { width: "92px", height: "114px" };

  if (isClassic) {
    return (
      <header className={`${isCompact ? "pb-2.5 mb-3" : "pb-3.5 mb-4"} flex items-start justify-between gap-4`}>
        <div className="flex-1 min-w-0">
          <h1 className={`${isCompact ? "text-2xl" : "text-[26px]"} font-bold tracking-tight text-slate-950 uppercase`}>
            {cvData.personal.fullName}
          </h1>
          {cvData.personal.title && (
            <p className={`${isCompact ? "text-xs mt-0.5" : "text-[13px] mt-0.5"} font-bold text-slate-900`}>
              {cvData.personal.title}
            </p>
          )}

          {/* İletişim Satırı - Klasik Pipe | Ayracı */}
          <div className={`mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 ${isCompact ? "text-[11px]" : "text-xs"} text-slate-800`}>
            {cvData.personal.email && (
              <a href={`mailto:${cvData.personal.email}`} className="hover:underline text-slate-900">
                {cvData.personal.email}
              </a>
            )}
            {cvData.personal.phone && (
              <>
                <span className="text-slate-400">|</span>
                <span>{cvData.personal.phone}</span>
              </>
            )}
            {cvData.personal.location && (
              <>
                <span className="text-slate-400">|</span>
                <span>{cvData.personal.location}</span>
              </>
            )}
          </div>

          {/* Linkler Satırı - Klasik Pipe | Ayracı & Kısa İkonlu Bağlantılar */}
          {visibleLinks.length > 0 && (
            <div className={`mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 ${isCompact ? "text-[10.5px]" : "text-[11.5px]"} text-slate-700`}>
              {visibleLinks.map((link, idx) => {
                const targetUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
                return (
                  <React.Fragment key={link.id}>
                    {idx > 0 && <span className="text-slate-400">|</span>}
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={targetUrl}
                      className="inline-flex items-center gap-0.5 font-semibold text-slate-900 hover:text-blue-700 hover:underline transition"
                    >
                      <span>{getShortLinkLabel(link)}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Klasik Şablonda İsteğe Bağlı Fotoğraf (Açık ve URL varsa) */}
        {cvData.settings.showPhoto && cvData.settings.photoUrl && (
          <div
            onClick={onPhotoClick}
            className="cursor-pointer shrink-0 border border-slate-300 rounded overflow-hidden"
            style={{ width: "70px", height: "86px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cvData.settings.photoUrl}
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>
    );
  }

  return (
    <header
      className={`border-b-2 ${theme.headerBorder} ${
        isCompact ? "pb-3 mb-3.5" : "pb-4 mb-5"
      } flex items-start justify-between gap-5 ${
        cvData.settings.photoPosition === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex-1 min-w-0">
        <h1
          className={`${
            isCompact ? "text-2xl sm:text-[26px]" : "text-3xl"
          } font-bold tracking-tight ${theme.nameText} uppercase`}
        >
          {cvData.personal.fullName}
        </h1>
        <p
          className={`${
            isCompact ? "text-sm mt-0.5" : "text-base mt-1"
          } font-semibold ${theme.titleText}`}
        >
          {cvData.personal.title}
        </p>

        {/* İletişim Satırı */}
        <div
          className={`mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
            isCompact ? "text-[11px]" : "text-xs"
          } text-slate-700`}
        >
          {cvData.personal.location && <span>{cvData.personal.location}</span>}
          {cvData.personal.phone && (
            <>
              <span className="text-slate-300">•</span>
              <span>{cvData.personal.phone}</span>
            </>
          )}
          {cvData.personal.email && (
            <>
              <span className="text-slate-300">•</span>
              <a
                href={`mailto:${cvData.personal.email}`}
                className={`underline ${theme.linkText}`}
              >
                {cvData.personal.email}
              </a>
            </>
          )}
          {cvData.personal.corpEmail && (
            <>
              <span className="text-slate-300">•</span>
              <a
                href={`mailto:${cvData.personal.corpEmail}`}
                className={`underline ${theme.linkText}`}
              >
                {cvData.personal.corpEmail}
              </a>
            </>
          )}
        </div>

        {/* Dinamik Linkler Alanı - Kısa & İkonlu Bağlantılar */}
        {visibleLinks.length > 0 && (
          <div
            className={`mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 ${
              isCompact ? "text-[10.5px]" : "text-[11.5px]"
            } font-medium text-slate-800`}
          >
            {visibleLinks.map((lnk, idx) => {
              const cleanHref = lnk.url.startsWith("http")
                ? lnk.url
                : `https://${lnk.url}`;
              return (
                <React.Fragment key={lnk.id}>
                  {idx > 0 && <span className="text-slate-300">|</span>}
                  <a
                    href={cleanHref}
                    target="_blank"
                    rel="noreferrer"
                    title={cleanHref}
                    className={`inline-flex items-center gap-1 font-semibold hover:underline ${theme.linkText} transition`}
                  >
                    <span>{getShortLinkLabel(lnk)}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {cvData.settings.showPhoto && (
        <div
          onClick={onPhotoClick}
          title="Fotoğraf yüklemek için tıklayın"
          className={`${
            !cvData.settings.photoUrl ? "no-print" : ""
          } group relative overflow-hidden shrink-0 border border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition hover:border-slate-500 ${
            cvData.settings.photoShape === "circle"
              ? "rounded-full aspect-square"
              : cvData.settings.photoShape === "square"
                ? "rounded-none"
                : "rounded-lg"
          }`}
          style={photoDimensions}
        >
          {cvData.settings.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cvData.settings.photoUrl}
              alt={cvData.personal.fullName}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${cvData.settings.photoZoom || 1}) translateY(${
                  cvData.settings.photoOffsetY || 0
                }px)`,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Upload className="w-4 h-4 text-slate-400 mb-1 group-hover:text-slate-700" />
              <span className="text-[10px] font-medium text-slate-500">
                Fotoğraf Ekle
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
