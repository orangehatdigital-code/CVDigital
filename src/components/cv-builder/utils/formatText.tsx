import React from "react";

export const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return "";
  if (!text.includes("**") && !text.includes("](")) return text;

  // Split by [label](url) OR **bold**
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, rawUrl] = linkMatch;
      const href = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-slate-950 underline decoration-slate-400 hover:text-orange-600 hover:decoration-orange-600 underline-offset-2 transition-colors"
        >
          {label}
        </a>
      );
    }
    return part;
  });
};
