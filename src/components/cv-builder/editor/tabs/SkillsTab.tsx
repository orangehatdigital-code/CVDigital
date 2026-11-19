import React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Code2 } from "lucide-react";
import { CvData, CvSkill } from "../../types";

interface SkillsTabProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  cvData,
  setCvData,
}) => {
  const addSkillCategory = () => {
    const newSkill: CvSkill = {
      id: `sk-${Date.now()}`,
      category: "Yeni Kategori",
      items: "Teknoloji 1, Teknoloji 2, Araç 3",
    };
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (
    id: string,
    field: keyof CvSkill,
    value: string,
  ) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((sk) =>
        sk.id === id ? { ...sk, [field]: value } : sk,
      ),
    }));
  };

  const deleteSkill = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((sk) => sk.id !== id),
    }));
  };

  const moveSkill = (index: number, direction: "up" | "down") => {
    setCvData((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.skills.length) return prev;
      const list = [...prev.skills];
      const [item] = list.splice(index, 1);
      list.splice(targetIndex, 0, item);
      return { ...prev, skills: list };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-slate-700" />
            Teknik Yetkinlikler ({cvData.skills.length} Kategori)
          </h3>
          <p className="text-[11px] text-slate-500">
            Frontend, Backend, AI Orkestrasyon, DevOps ve Mühendislik pratikleri
          </p>
        </div>
        <button
          type="button"
          onClick={addSkillCategory}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Kategori Ekle
        </button>
      </div>

      <div className="space-y-3">
        {cvData.skills.map((sk, idx) => (
          <div
            key={sk.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSkill(idx, "up")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === cvData.skills.length - 1}
                  onClick={() => moveSkill(idx, "down")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={sk.category}
                  onChange={(e) => updateSkill(sk.id, "category", e.target.value)}
                  placeholder="Kategori Adı (Örn: Frontend & Mobil)"
                  className="w-full sm:w-64 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-900"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteSkill(sk.id)}
                className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                title="Kategoriyi Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Yetkinlikler / Teknolojiler (Virgülle ayrılmış liste)
              </label>
              <textarea
                rows={2}
                value={sk.items}
                onChange={(e) => updateSkill(sk.id, "items", e.target.value)}
                placeholder="TypeScript, React, Next.js, TailwindCSS..."
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
