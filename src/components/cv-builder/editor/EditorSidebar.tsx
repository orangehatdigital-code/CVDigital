import React from "react";
import {
  User,
  Sliders,
  Briefcase,
  FolderGit2,
  Code2,
  Sparkles,
  GraduationCap,
  Search,
} from "lucide-react";
import {
  CvData,
  CvPersonal,
  CvSettings,
  CvLinkItem,
  SectionId,
  SavedCvDraft,
} from "../types";
import { ProfileSwitcher } from "./ProfileSwitcher";
import { PersonalTab } from "./tabs/PersonalTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { SummaryTab } from "./tabs/SummaryTab";
import { ExperiencesTab } from "./tabs/ExperiencesTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { EducationTab } from "./tabs/EducationTab";
import { AtsTab } from "./tabs/AtsTab";

export type EditorTabId =
  | "personal"
  | "experiences"
  | "projects"
  | "skills"
  | "summary"
  | "education"
  | "settings"
  | "ats";

interface EditorSidebarProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
  activeTab: EditorTabId;
  setActiveTab: (tab: EditorTabId) => void;
  // Profil & Taslak Yönetimi
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
  // Düzenleme Fonksiyonları
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
  moveSection: (sectionId: SectionId, direction: "up" | "down") => void;
  toggleSectionVisibility: (sectionId: SectionId) => void;
  updateSectionTitle: (sectionId: SectionId, newTitle: string) => void;
  jobAdText: string;
  setJobAdText: (text: string) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  cvData,
  setCvData,
  activeTab,
  setActiveTab,
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
  updatePersonal,
  updateSettings,
  updateLinkItem,
  addLinkItem,
  removeLinkItem,
  onPhotoUpload,
  moveSection,
  toggleSectionVisibility,
  updateSectionTitle,
  jobAdText,
  setJobAdText,
}) => {
  const tabs = [
    {
      id: "personal" as EditorTabId,
      label: "Kişisel Bilgiler",
      title: "Kişisel & İletişim Bilgileri",
      description: "Ad, unvan, iletişim kanalları, sosyal bağlantılar ve profil fotoğrafı",
      icon: User,
      badge: null,
    },
    {
      id: "experiences" as EditorTabId,
      label: "İş Deneyimi",
      title: "Profesyonel İş Deneyimleri",
      description: "Şirketler, unvanlar, tarihler ve başarı odaklı mimari maddeler",
      icon: Briefcase,
      badge: cvData.experiences.length,
    },
    {
      id: "projects" as EditorTabId,
      label: "Projeler",
      title: "Üretim & Canlı Projeler",
      description: "Canlıda çalışan SaaS sistemleri, mobil uygulamalar veya araçlar",
      icon: FolderGit2,
      badge: cvData.projects.length,
    },
    {
      id: "skills" as EditorTabId,
      label: "Yetkinlikler",
      title: "Teknik Yetkinlikler & Stack",
      description: "Yazılım dilleri, framework'ler, bulut, DevOps ve AI teknolojileri",
      icon: Code2,
      badge: cvData.skills.length,
    },
    {
      id: "summary" as EditorTabId,
      label: "Özet",
      title: "Profesyonel Özet / Hakkında",
      description: "İlk bakışta dikkat çeken 3-4 satırlık kariyer ve vizyon özeti",
      icon: Sparkles,
      badge: null,
    },
    {
      id: "education" as EditorTabId,
      label: "Eğitim & Sertifika",
      title: "Eğitim, Sertifikalar & Kapanış",
      description: "Üniversite, tamamlanan programlar, sertifikalar ve referans notu",
      icon: GraduationCap,
      badge: cvData.education.length,
    },
    {
      id: "settings" as EditorTabId,
      label: "Tasarım & Düzen",
      title: "Görsel Tasarım & Bölüm Sıralaması",
      description: "Tema rengi, tipografi, sayfa boşlukları ve bölüm sırası",
      icon: Sliders,
      badge: null,
    },
    {
      id: "ats" as EditorTabId,
      label: "ATS Eşleştirici",
      title: "ATS & İş İlanı Analizi",
      description: "İş ilanını yapıştırın, eksik anahtar kelimeleri ve uyum puanını görün",
      icon: Search,
      badge: null,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="no-print bg-white rounded-2xl border border-slate-200/90 shadow-md flex flex-col md:flex-row overflow-hidden h-full">
      {/* 1. EN SOLDAN SABİT SİDEBAR (Profil Seçici & Dikey Sekmeler) */}
      <aside className="w-full md:w-56 lg:w-64 bg-slate-50/90 border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-full overflow-hidden">
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {/* Kompakt Profil Seçici */}
          <ProfileSwitcher
            drafts={drafts}
            activeDraftId={activeDraftId}
            selectDraft={selectDraft}
            deleteDraft={deleteDraft}
            renameActiveDraft={renameActiveDraft}
            showNewDraftForm={showNewDraftForm}
            setShowNewDraftForm={setShowNewDraftForm}
            newDraftName={newDraftName}
            setNewDraftName={setNewDraftName}
            createNewDraft={createNewDraft}
            handleSave={handleSave}
            savedNotice={savedNotice}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Dikey Menü Sekmeleri */}
          <nav className="p-2 space-y-1 overflow-y-auto flex-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white font-semibold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-orange-400" : "text-slate-500"
                      }`}
                    />
                    <span className="text-xs truncate">{tab.label}</span>
                  </div>

                  {tab.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-slate-800 text-orange-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Alt Footer / Yapımcı & Açık Kaynak Bilgisi */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50 flex flex-col gap-1.5 text-[10.5px]">
          <div className="flex items-center justify-between">
            <a
              href="https://orangehatdigital.com.tr"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>OrangeHat Digital</span>
            </a>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Açık Kaynak
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span>Geliştiriciler:</span>
            <a
              href="https://furkanaslan.orangehatdigital.com.tr"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-700 hover:text-slate-950 hover:underline"
            >
              Furkan Aslan
            </a>
            <span>·</span>
            <a
              href="https://kubrakara.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-700 hover:text-slate-950 hover:underline"
            >
              Kübra Kara
            </a>
          </div>
        </div>
      </aside>

      {/* 2. SİDEBARIN SAĞINDA AÇILAN AKTİF FORM ALANI */}
      <section className="flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden">
        {/* Form Başlık Çubuğu */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CurrentIcon className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="truncate">{currentTab.title}</span>
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              {currentTab.description}
            </p>
          </div>
        </div>

        {/* Form Gövdesi (Scrollable Form) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-300">
          {activeTab === "personal" && (
            <PersonalTab
              cvData={cvData}
              updatePersonal={updatePersonal}
              updateSettings={updateSettings}
              updateLinkItem={updateLinkItem}
              addLinkItem={addLinkItem}
              removeLinkItem={removeLinkItem}
              onPhotoUpload={onPhotoUpload}
            />
          )}

          {activeTab === "experiences" && (
            <ExperiencesTab cvData={cvData} setCvData={setCvData} />
          )}

          {activeTab === "projects" && (
            <ProjectsTab cvData={cvData} setCvData={setCvData} />
          )}

          {activeTab === "skills" && (
            <SkillsTab cvData={cvData} setCvData={setCvData} />
          )}

          {activeTab === "summary" && (
            <SummaryTab cvData={cvData} setCvData={setCvData} />
          )}

          {activeTab === "education" && (
            <EducationTab cvData={cvData} setCvData={setCvData} />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              cvData={cvData}
              updateSettings={updateSettings}
              moveSection={moveSection}
              toggleSectionVisibility={toggleSectionVisibility}
              updateSectionTitle={updateSectionTitle}
            />
          )}

          {activeTab === "ats" && (
            <AtsTab
              cvData={cvData}
              jobAdText={jobAdText}
              setJobAdText={setJobAdText}
              setCvData={setCvData}
            />
          )}
        </div>
      </section>
    </div>
  );
};
