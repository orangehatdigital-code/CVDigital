import React from "react";
import { Plus, Trash2, GraduationCap, Award } from "lucide-react";
import { CvData, CvEducation, CvCertificate } from "../../types";

interface EducationTabProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  cvData,
  setCvData,
}) => {
  // Eğitim İşlemleri
  const addEducation = () => {
    const newEdu: CvEducation = {
      id: `edu-${Date.now()}`,
      degree: "Lisans Bölümü Adı",
      school: "Üniversite Adı",
      date: "Mezuniyet: 2025",
      details: "Odak Alanları: Yazılım Mimarisi, Veritabanları, Ağ Sistemleri",
    };
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = <K extends keyof CvEducation>(
    id: string,
    field: K,
    value: CvEducation[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
  };

  const deleteEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Sertifika İşlemleri
  const addCertificate = () => {
    const newCert: CvCertificate = {
      id: `cert-${Date.now()}`,
      name: "Sertifika veya Eğitim Programı",
      detail: "Eğitim içeriği, kazanılan yetkinlikler ve kurum adı.",
    };
    setCvData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, newCert],
    }));
  };

  const updateCertificate = <K extends keyof CvCertificate>(
    id: string,
    field: K,
    value: CvCertificate[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const deleteCertificate = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((cert) => cert.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Eğitim Bilgileri */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
              Eğitim Bilgileri ({cvData.education.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Lisans, ön lisans, bitirme projeleri ve akademik odak alanları
            </p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Eğitim Ekle
          </button>
        </div>

        <div className="space-y-3">
          {cvData.education.map((edu) => (
            <div
              key={edu.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800">
                  {edu.school || "Üniversite"}
                </span>
                <button
                  type="button"
                  onClick={() => deleteEducation(edu.id)}
                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Eğitimi Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bölüm & Derece
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tarih / Mezuniyet
                  </label>
                  <input
                    type="text"
                    value={edu.date}
                    onChange={(e) =>
                      updateEducation(edu.id, "date", e.target.value)
                    }
                    placeholder="Örn: Mezuniyet: 06/2025"
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Üniversite Adı
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(edu.id, "school", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Bitirme Projesi & Odak Alanları Açıklaması
                  </label>
                  <input
                    type="text"
                    value={edu.details}
                    onChange={(e) =>
                      updateEducation(edu.id, "details", e.target.value)
                    }
                    placeholder="Bitirme Projesi: ... · Odak Alanları: ..."
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sertifikalar & Eğitim Programları */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              Sertifikalar, Bootcampler & Ar-Ge ({cvData.certificates.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Siber Vatan, girişimcilik maratonları ve teknik sertifikalar
            </p>
          </div>
          <button
            type="button"
            onClick={addCertificate}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Sertifika Ekle
          </button>
        </div>

        <div className="space-y-3">
          {cvData.certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertificate(cert.id, "name", e.target.value)
                  }
                  placeholder="Program veya Sertifika Adı"
                  className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => deleteCertificate(cert.id)}
                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title="Sertifikayı Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Program Detayı & Kapsamı
                </label>
                <textarea
                  rows={2}
                  value={cert.detail}
                  onChange={(e) =>
                    updateCertificate(cert.id, "detail", e.target.value)
                  }
                  placeholder="Eğitim modülleri, CTF, kriz yönetimi veya sertifika kodu..."
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
