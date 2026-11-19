import React from "react";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import { CvData } from "../../types";

interface AtsTabProps {
  cvData: CvData;
  jobAdText: string;
  setJobAdText: (text: string) => void;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const AtsTab: React.FC<AtsTabProps> = ({
  cvData,
  jobAdText,
  setJobAdText,
  setCvData,
}) => {
  const importantTechKeywords = [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "React Native",
    "Python",
    "Docker",
    "Linux",
    "AWS",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "REST API",
    "Git",
    "CI/CD",
    "Tailwind",
    "Redux",
    "Agile",
    "Scrum",
    "Microservices",
    "Unit Test",
    "Firebase",
    "Supabase",
    "n8n",
    "AI",
    "LLM",
    "SEO",
    "DevOps",
  ];

  const fullCvString = JSON.stringify(cvData).toLowerCase();
  const adLower = jobAdText.toLowerCase();

  const mentionedInAd = importantTechKeywords.filter((kw) =>
    adLower.includes(kw.toLowerCase()),
  );
  const matched = mentionedInAd.filter((kw) =>
    fullCvString.includes(kw.toLowerCase()),
  );
  const missing = mentionedInAd.filter(
    (kw) => !fullCvString.includes(kw.toLowerCase()),
  );

  const addMissingKeywordToSkills = (keyword: string) => {
    setCvData((prev) => {
      const updatedSkills = [...prev.skills];
      if (updatedSkills.length > 0) {
        updatedSkills[0] = {
          ...updatedSkills[0],
          items: `${updatedSkills[0].items}, ${keyword}`,
        };
      }
      return { ...prev, skills: updatedSkills };
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-emerald-900">
          <Search className="w-3.5 h-3.5" />
          ATS & İlan Eşleştirici
        </div>
        <p className="text-[11px] text-emerald-800">
          Başvuracağın iş ilanının metnini aşağıya yapıştırarak CV&apos;nde geçen ve eksik olan kritik anahtar kelimeleri anında analiz edebilirsin.
        </p>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          İş İlanı Metni
        </label>
        <textarea
          rows={6}
          placeholder="Başvurulan iş ilanının gereksinimler, aranan nitelikler veya tech stack metnini buraya yapıştırın..."
          value={jobAdText}
          onChange={(e) => setJobAdText(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {jobAdText.trim() && (
        <div className="space-y-3 pt-2">
          {/* Eşleşenler */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              CV&apos;nizde Bulunan Eşleşmeler ({matched.length})
            </span>
            {matched.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matched.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-semibold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                İlanda listelenen popüler anahtar kelimelerden henüz hiçbiri CV&apos;de bulunamadı.
              </p>
            )}
          </div>

          {/* Eksik Kelimeler */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="font-bold text-xs text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              İlanda İstenen Ancak CV&apos;nizde Bulunmayan Kelimeler ({missing.length})
            </span>
            {missing.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missing.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => addMissingKeywordToSkills(kw)}
                    title="Bu yetkinliği ilk kategoriye ekle"
                    className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold transition cursor-pointer"
                  >
                    + {kw} (CV&apos;ye Ekle)
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700 font-medium">
                Tebrikler! İlanda tespit edilen tüm önemli teknolojiler CV&apos;nizde mevcut.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
