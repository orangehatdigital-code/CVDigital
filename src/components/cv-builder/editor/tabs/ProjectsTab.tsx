import React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, FolderGit2 } from "lucide-react";
import { CvData, CvProject } from "../../types";

interface ProjectsTabProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  cvData,
  setCvData,
}) => {
  const addProject = () => {
    const newProj: CvProject = {
      id: `proj-${Date.now()}`,
      visible: true,
      name: "Yeni Proje Başlığı",
      tech: "Next.js, TypeScript, PostgreSQL, Docker",
      link: "projeadresi.com",
      bullets: ["Projenin mimarisi, çözdüğü problem ve teknik özellikleri."],
    };
    setCvData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const updateProject = <K extends keyof CvProject>(
    id: string,
    field: K,
    value: CvProject[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj,
      ),
    }));
  };

  const deleteProject = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    setCvData((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.projects.length) return prev;
      const list = [...prev.projects];
      const [item] = list.splice(index, 1);
      list.splice(targetIndex, 0, item);
      return { ...prev, projects: list };
    });
  };

  const updateBullet = (projId: string, bulletIndex: number, text: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projId) return proj;
        const bullets = [...proj.bullets];
        bullets[bulletIndex] = text;
        return { ...proj, bullets };
      }),
    }));
  };

  const addBullet = (projId: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projId) return proj;
        return { ...proj, bullets: [...proj.bullets, ""] };
      }),
    }));
  };

  const removeBullet = (projId: string, bulletIndex: number) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => {
        if (proj.id !== projId) return proj;
        return {
          ...proj,
          bullets: proj.bullets.filter((_, idx) => idx !== bulletIndex),
        };
      }),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-700" />
            Üretim & Canlı Projeler ({cvData.projects.length})
          </h3>
          <p className="text-[11px] text-slate-500">
            Canlıda çalışan SaaS sistemleri, mobil uygulamalar veya araçlar
          </p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Proje Ekle
        </button>
      </div>

      <div className="space-y-4">
        {cvData.projects.map((proj, projIdx) => (
          <div
            key={proj.id}
            className={`p-4 rounded-xl border transition ${
              proj.visible
                ? "bg-white border-slate-200 shadow-xs"
                : "bg-slate-50/70 border-slate-200 opacity-60"
            } space-y-3`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={projIdx === 0}
                  onClick={() => moveProject(projIdx, "up")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={projIdx === cvData.projects.length - 1}
                  onClick={() => moveProject(projIdx, "down")}
                  className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs text-slate-800 ml-1 truncate max-w-xs">
                  #{projIdx + 1} {proj.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateProject(proj.id, "visible", !proj.visible)}
                  title={proj.visible ? "Proyeyi Gizle" : "Projeyi Göster"}
                  className={`p-1.5 rounded-lg border transition ${
                    proj.visible
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {proj.visible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Projeyi Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Proje Adı & Açıklayıcı Başlık
                </label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kullanılan Teknolojiler (Tech Stack)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Next.js, TypeScript, Docker, Nginx"
                  value={proj.tech}
                  onChange={(e) => updateProject(proj.id, "tech", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Canlı Link / GitHub URL (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="projeadresi.com veya github.com/..."
                  value={proj.link}
                  onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Madde İşaretleri */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">
                  Proje Detay ve Mimari Maddeleri
                </label>
                <button
                  type="button"
                  onClick={() => addBullet(proj.id)}
                  className="text-[11px] font-semibold text-slate-900 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Madde Ekle
                </button>
              </div>

              <div className="space-y-2">
                {proj.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(proj.id, bIdx, e.target.value)
                      }
                      placeholder="Projede çözülen mühendislik problemi, mimari detaylar..."
                      className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 resize-y"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet(proj.id, bIdx)}
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
