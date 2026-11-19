import React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Briefcase } from "lucide-react";
import { CvData, CvExperience } from "../../types";

interface ExperiencesTabProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const ExperiencesTab: React.FC<ExperiencesTabProps> = ({
  cvData,
  setCvData,
}) => {
  const addExperience = () => {
    const newExp: CvExperience = {
      id: `exp-${Date.now()}`,
      role: "Pozisyon / Unvan",
      company: "Şirket Adı",
      location: "Şehir / Çalışma Modeli",
      date: "2024 – Günümüz",
      bullets: ["Gerçekleştirilen sorumluluk veya proje çıktısı."],
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const updateExperience = <K extends keyof CvExperience>(
    id: string,
    field: K,
    value: CvExperience[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const deleteExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    setCvData((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.experiences.length) return prev;
      const list = [...prev.experiences];
      const [item] = list.splice(index, 1);
      list.splice(targetIndex, 0, item);
      return { ...prev, experiences: list };
    });
  };

  const updateBullet = (expId: string, bulletIndex: number, text: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        const bullets = [...exp.bullets];
        bullets[bulletIndex] = text;
        return { ...exp, bullets };
      }),
    }));
  };

  const addBullet = (expId: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return { ...exp, bullets: [...exp.bullets, ""] };
      }),
    }));
  };

  const removeBullet = (expId: string, bulletIndex: number) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id !== expId) return exp;
        return {
          ...exp,
          bullets: exp.bullets.filter((_, idx) => idx !== bulletIndex),
        };
      }),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-700" />
            İş Deneyimleri ({cvData.experiences.length})
          </h3>
          <p className="text-[11px] text-slate-500">
            Roller, şirketler, süreler ve somut etki/çıktı maddeleri
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Deneyim Ekle
        </button>
      </div>

      <div className="space-y-4">
        {cvData.experiences.map((exp, expIdx) => (
          <div
            key={exp.id}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={expIdx === 0}
                  onClick={() => moveExperience(expIdx, "up")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={expIdx === cvData.experiences.length - 1}
                  onClick={() => moveExperience(expIdx, "down")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs text-slate-800 ml-1">
                  #{expIdx + 1} {exp.company || "Şirket Adı"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => deleteExperience(exp.id)}
                className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                title="Deneyimi Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Rol / Pozisyon
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) =>
                    updateExperience(exp.id, "role", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Şirket / Kurum Adı
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tarih Aralığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: 08/2025 – 08/2026 veya 2024 – Günümüz"
                  value={exp.date}
                  onChange={(e) =>
                    updateExperience(exp.id, "date", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Konum / Çalışma Şekli
                </label>
                <input
                  type="text"
                  placeholder="Örn: Samsun / Hibrit veya Uzaktan"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Madde İşaretleri (Bullets) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">
                  Sorumluluklar & Başarı Maddeleri (Bullets)
                </label>
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="text-[11px] font-semibold text-slate-900 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Madde Ekle
                </button>
              </div>

              <div className="space-y-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(exp.id, bIdx, e.target.value)
                      }
                      placeholder="Somut çıktı, kullanılan teknoloji veya mimari sorumluluk..."
                      className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 resize-y"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet(exp.id, bIdx)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0 mt-1"
                      title="Maddeyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
