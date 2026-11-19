import React from "react";
import { CvCertificate, CvThemeTokens } from "../../types";

interface CertificateBlockProps {
  certificates: CvCertificate[];
  sectionTitle?: string;
  sectionHeaderClass: string;
  theme: CvThemeTokens;
  isCompact: boolean;
  isFirstOnPage?: boolean;
}

export const CertificateBlock: React.FC<CertificateBlockProps> = ({
  certificates,
  sectionTitle,
  sectionHeaderClass,
  theme,
  isCompact,
  isFirstOnPage = false,
}) => {
  return (
    <section
      className={`${
        isFirstOnPage ? "pt-0" : isCompact ? "pt-2.5 sm:pt-3" : "pt-3 sm:pt-3.5"
      } ${isCompact ? "mb-4 sm:mb-5" : "mb-5 sm:mb-6"}`}
    >
      <h2 className={sectionHeaderClass}>
        <span>{sectionTitle}</span>
      </h2>
      <ul
        className={`list-disc list-outside ml-4 ${theme.bulletMarker} ${
          isCompact ? "space-y-1 text-[11.5px]" : "space-y-1.5 text-xs"
        } text-slate-800`}
      >
        {certificates.map((cert) => (
          <li key={cert.id} className="page-break-avoid">
            <span className="font-bold text-slate-950">{cert.name}: </span>
            <span>{cert.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

interface ClosingBlockProps {
  closingNote: string;
  sectionTitle?: string;
  sectionHeaderClass: string;
  isCompact: boolean;
}

export const ClosingBlock: React.FC<ClosingBlockProps> = ({
  closingNote,
  sectionTitle,
  sectionHeaderClass,
  isCompact,
}) => {
  return (
    <section className={isCompact ? "mb-2" : "mb-3"}>
      <h2 className={sectionHeaderClass}>
        <span>{sectionTitle}</span>
      </h2>
      <p
        className={`border-l-2 border-slate-400 pl-3 py-0.5 ${
          isCompact ? "text-[11.5px] leading-[1.45]" : "text-xs leading-relaxed"
        } text-slate-800 text-justify whitespace-pre-line`}
      >
        {closingNote}
      </p>
    </section>
  );
};
