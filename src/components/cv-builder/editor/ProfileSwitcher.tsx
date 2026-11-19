import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  User,
  Plus,
  Trash2,
  Save,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";
import { SavedCvDraft } from "../types";

interface ProfileSwitcherProps {
  drafts: SavedCvDraft[];
  activeDraftId: string;
  selectDraft: (id: string) => void;
  deleteDraft: (id: string, e: React.MouseEvent) => void;
  renameActiveDraft: (newName: string) => void;
  showNewDraftForm: boolean;
  setShowNewDraftForm: React.Dispatch<React.SetStateAction<boolean>>;
  newDraftName: string;
  setNewDraftName: (name: string) => void;
  createNewDraft: (mode: "blank" | "clone") => void;
  handleSave: () => void;
  savedNotice?: boolean;
  hasUnsavedChanges?: boolean;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  drafts,
  activeDraftId,
  selectDraft,
  deleteDraft,
  renameActiveDraft,
  showNewDraftForm,
  setShowNewDraftForm,
  newDraftName,
  setNewDraftName,
  createNewDraft,
  handleSave,
  savedNotice,
  hasUnsavedChanges,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="p-3 border-b border-slate-200/80 bg-slate-50/80 flex flex-col gap-2 relative">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Aktif CV Profili
        </span>
        {hasUnsavedChanges && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
            Kaydedilmedi
          </span>
        )}
      </div>

      {/* Profil Seçici Butonu (Dropdown Tetikleyici) */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition shadow-sm text-left cursor-pointer"
        >
          <div className="min-w-0 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              {activeDraft?.cvData?.personal?.fullName
                ? activeDraft.cvData.personal.fullName.charAt(0)
                : "C"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {activeDraft?.name || "Profil Seçin"}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {activeDraft?.cvData?.personal?.fullName || "İsimsiz"}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Açılır Dropdown Menüsü */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700">
                Kayıtlı Profiller ({drafts.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowNewDraftForm(true);
                  setIsOpen(false);
                }}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Yeni Ekle
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {drafts.map((draft) => {
                const isActive = draft.id === activeDraftId;
                return (
                  <div
                    key={draft.id}
                    onClick={() => {
                      selectDraft(draft.id);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between p-2.5 hover:bg-slate-50 cursor-pointer transition text-left ${
                      isActive ? "bg-orange-50/60 font-medium" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs truncate ${
                            isActive
                              ? "font-bold text-orange-950"
                              : "text-slate-800"
                          }`}
                        >
                          {draft.name}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {draft.cvData.personal.fullName || "İsimsiz"}
                      </div>
                    </div>

                    {drafts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDraft(draft.id, e);
                        }}
                        title={`${draft.name} taslağını sil`}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Taslak Adı Düzenleme & Hızlı Kaydet Satırı */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <input
          type="text"
          value={activeDraft?.name || ""}
          onChange={(e) => renameActiveDraft(e.target.value)}
          placeholder="Profil Adı"
          title="Profil / Taslak Adı"
          className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
        />
        <button
          type="button"
          onClick={handleSave}
          title="Değişiklikleri Kaydet"
          className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 cursor-pointer ${
            savedNotice
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 hover:bg-slate-800 text-white"
          }`}
        >
          {savedNotice ? (
            <>
              <Check className="w-3 h-3" />
              <span>Kaydedildi</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              <span>Kaydet</span>
            </>
          )}
        </button>
      </div>

      {/* Yeni Profil Formu Modalı / Açılır Paneli */}
      {showNewDraftForm && (
        <div className="p-2.5 mt-1 rounded-xl bg-orange-50/80 border border-orange-200/90 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-950">
              Yeni Taslak Oluştur
            </span>
            <button
              type="button"
              onClick={() => setShowNewDraftForm(false)}
              className="text-[10px] text-slate-500 hover:text-slate-700"
            >
              Vazgeç
            </button>
          </div>
          <input
            type="text"
            value={newDraftName}
            onChange={(e) => setNewDraftName(e.target.value)}
            placeholder="Örn: Yeni CV TR"
            className="w-full rounded-lg border border-orange-300 bg-white px-2.5 py-1 text-xs"
          />
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => createNewDraft("clone")}
              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-semibold transition cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              Klonla
            </button>
            <button
              type="button"
              onClick={() => createNewDraft("blank")}
              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[10.5px] font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Sıfırdan Aç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
