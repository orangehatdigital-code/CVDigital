import React, { useRef } from "react";
import { User, Upload, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { CvData, CvLinkItem, CvPersonal, CvSettings } from "../../types";

interface PersonalTabProps {
  cvData: CvData;
  updatePersonal: <K extends keyof CvPersonal>(
    field: K,
    value: CvPersonal[K],
  ) => void;
  updateSettings: <K extends keyof CvSettings>(
    field: K,
    value: CvSettings[K],
  ) => void;
  updateLinkItem: (
    id: string,
    field: keyof CvLinkItem,
    value: string | boolean,
  ) => void;
  addLinkItem: () => void;
  removeLinkItem: (id: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({
  cvData,
  updatePersonal,
  updateSettings,
  updateLinkItem,
  addLinkItem,
  removeLinkItem,
  onPhotoUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-5">
      {/* Gizli file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPhotoUpload}
        className="hidden"
      />

      {/* Fotoğraf Kutusu */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm block">
                CV Fotoğrafı & Hizalama
              </span>
              <span className="text-[11px] text-slate-500">
                Vesikalık fotoğrafını yükle, boyutlandır veya çerçeve stilini seç
              </span>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={cvData.settings.showPhoto}
              onChange={(e) => updateSettings("showPhoto", e.target.checked)}
              className="rounded border-slate-300 text-slate-900"
            />
            Fotoğrafı Göster
          </label>
        </div>

        {cvData.settings.showPhoto && (
          <div className="space-y-3 pt-2 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {cvData.settings.photoUrl ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
              </button>
              {cvData.settings.photoUrl && (
                <button
                  type="button"
                  onClick={() => updateSettings("photoUrl", "")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-medium text-xs hover:bg-red-100 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kaldır
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Hizalama
                </label>
                <select
                  value={cvData.settings.photoPosition || "left"}
                  onChange={(e) =>
                    updateSettings(
                      "photoPosition",
                      e.target.value as "right" | "left",
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="left">Sol Üst</option>
                  <option value="right">Sağ Üst</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Çerçeve
                </label>
                <select
                  value={cvData.settings.photoShape || "rounded"}
                  onChange={(e) =>
                    updateSettings(
                      "photoShape",
                      e.target.value as "rounded" | "square" | "circle",
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="rounded">Köşeli (Hafif Yuvarlatılmış)</option>
                  <option value="square">Tam Kare</option>
                  <option value="circle">Yuvarlak (Daire)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Boyut
                </label>
                <select
                  value={cvData.settings.photoSize || "md"}
                  onChange={(e) =>
                    updateSettings("photoSize", e.target.value as "sm" | "md" | "lg")
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="sm">Küçük</option>
                  <option value="md">Standart</option>
                  <option value="lg">Büyük</option>
                </select>
              </div>
            </div>

            {cvData.settings.photoUrl && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Zoom: {Math.round((cvData.settings.photoZoom || 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="1.8"
                    step="0.05"
                    value={cvData.settings.photoZoom || 1}
                    onChange={(e) =>
                      updateSettings("photoZoom", parseFloat(e.target.value))
                    }
                    className="w-full accent-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Dikey Konum: {cvData.settings.photoOffsetY || 0}px
                  </label>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="2"
                    value={cvData.settings.photoOffsetY || 0}
                    onChange={(e) =>
                      updateSettings("photoOffsetY", parseInt(e.target.value, 10))
                    }
                    className="w-full accent-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Temel Kişisel Bilgiler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            value={cvData.personal.fullName}
            onChange={(e) => updatePersonal("fullName", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            Unvan / Rol
          </label>
          <input
            type="text"
            value={cvData.personal.title}
            onChange={(e) => updatePersonal("title", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            Telefon
          </label>
          <input
            type="text"
            value={cvData.personal.phone}
            onChange={(e) => updatePersonal("phone", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            E-Posta
          </label>
          <input
            type="text"
            value={cvData.personal.email}
            onChange={(e) => updatePersonal("email", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            İkinci E-Posta (Opsiyonel)
          </label>
          <input
            type="text"
            placeholder="Boş bırakılabilir"
            value={cvData.personal.corpEmail}
            onChange={(e) => updatePersonal("corpEmail", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            Web Sitesi (2. Sayfa Üst Bilgisi İçin)
          </label>
          <input
            type="text"
            placeholder="Örn: siteadresi.com"
            value={cvData.personal.website}
            onChange={(e) => updatePersonal("website", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-700 text-xs mb-1">
            Konum / Çalışma Modeli
          </label>
          <input
            type="text"
            value={cvData.personal.location}
            onChange={(e) => updatePersonal("location", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Sosyal Linkler Yönetimi */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs">
              Header Sosyal Linkleri & Portfolyo
            </h3>
            <p className="text-[11px] text-slate-500">
              CV üst başlığında görünen tıklanabilir linkler
            </p>
          </div>
          <button
            type="button"
            onClick={addLinkItem}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Link Ekle
          </button>
        </div>

        <div className="space-y-2">
          {cvData.personal.links.map((lnk) => (
            <div
              key={lnk.id}
              className={`p-3 rounded-xl border transition ${
                lnk.visible
                  ? "bg-white border-slate-200"
                  : "bg-slate-50/70 border-slate-200 opacity-60"
              } flex flex-wrap sm:flex-nowrap items-center gap-2`}
            >
              <input
                type="text"
                value={lnk.label}
                onChange={(e) => updateLinkItem(lnk.id, "label", e.target.value)}
                placeholder="Etiket (GitHub, LinkedIn...)"
                className="w-full sm:w-32 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
              />
              <input
                type="text"
                value={lnk.displayUrl}
                onChange={(e) =>
                  updateLinkItem(lnk.id, "displayUrl", e.target.value)
                }
                placeholder="Görünen Metin (github.com/...)"
                className="w-full sm:flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
              />
              <input
                type="text"
                value={lnk.url}
                onChange={(e) => updateLinkItem(lnk.id, "url", e.target.value)}
                placeholder="Tıklanma URL (https://...)"
                className="w-full sm:flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => updateLinkItem(lnk.id, "visible", !lnk.visible)}
                  title={lnk.visible ? "Gizle" : "Göster"}
                  className={`p-1.5 rounded-lg border transition ${
                    lnk.visible
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {lnk.visible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => removeLinkItem(lnk.id)}
                  title="Linki Sil"
                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
