"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CV_PROFILES } from "@/data/cvs";
import {
  CvData,
  CvPersonal,
  CvSettings,
  CvLinkItem,
  SavedCvDraft,
  SectionId,
} from "./cv-builder/types";
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_TITLES,
} from "./cv-builder/constants";
import { normalizeCvData } from "./cv-builder/utils/normalizeCvData";
import { createPersonTemplateCv } from "./cv-builder/utils/templateCv";
import { getInitialDrafts } from "./cv-builder/utils/storage";
import { useCvPagination } from "./cv-builder/hooks/useCvPagination";
import { CvNavbar } from "./cv-builder/navbar/CvNavbar";
import { EditorSidebar, EditorTabId } from "./cv-builder/editor/EditorSidebar";
import { CvPreviewContainer } from "./cv-builder/preview/CvPreviewContainer";

const INITIAL_DEFAULT_DRAFTS = getInitialDrafts();

export default function CvBuilder() {
  const [drafts, setDrafts] = useState<SavedCvDraft[]>(INITIAL_DEFAULT_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState<string>(
    INITIAL_DEFAULT_DRAFTS[0]?.id || "",
  );
  const [cvData, setCvData] = useState<CvData>(
    INITIAL_DEFAULT_DRAFTS[0]?.cvData || ({} as CvData),
  );

  const [activeTab, setActiveTab] = useState<EditorTabId>("personal");
  const [viewMode, setViewMode] = useState<"split" | "preview">("split");
  const [jobAdText, setJobAdText] = useState<string>("");
  const [newDraftName, setNewDraftName] = useState<string>("");
  const [showNewDraftForm, setShowNewDraftForm] = useState<boolean>(false);

  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const isInitialLoadDone = useRef<boolean>(false);
  const skipDirtyCheckRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sayfa ilk yüklendiğinde doğrudan JSON dosyalarından (/api/cv) oku
  useEffect(() => {
    // Eski LocalStorage önbelleğini temizle (artık doğrudan JSON dosyalarına yazılıyor)
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("antigravity_cv_state_v1");
        window.localStorage.removeItem("cv_drafts_v1");
      } catch {}
    }

    fetch("/api/cv")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.drafts) && res.drafts.length > 0) {
          skipDirtyCheckRef.current = true;
          setDrafts(res.drafts);
          setActiveDraftId(res.drafts[0].id);
          setCvData(res.drafts[0].cvData);
        }
      })
      .catch((err) => {
        console.error("Failed to load CVs from disk API:", err);
      })
      .finally(() => {
        isInitialLoadDone.current = true;
      });
  }, []);

  // Aktif taslağın adına göre sayfa ve indirilen PDF dosya adını güncelle
  useEffect(() => {
    const activeDraft = drafts.find((d) => d.id === activeDraftId);
    if (activeDraft?.name) {
      document.title = activeDraft.name;
    } else if (cvData?.personal?.fullName) {
      document.title = `${cvData.personal.fullName} - ${cvData.personal.title || "CV"}`;
    }
  }, [activeDraftId, drafts, cvData]);

  // Değişiklik olduğunda unsaved değişiklik bayrağını ayarla
  useEffect(() => {
    if (!isInitialLoadDone.current) return;
    if (skipDirtyCheckRef.current) {
      skipDirtyCheckRef.current = false;
      return;
    }
    setHasUnsavedChanges(true);
  }, [cvData]);

  // A4 Akıllı Sayfalama Motoru
  const { measureContainerRef, pageRulerRef, allBlocks, pagesToRender } =
    useCvPagination(cvData);

  // Güncelleme Fonksiyonları
  const updatePersonal = <K extends keyof CvPersonal>(
    field: K,
    value: CvPersonal[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSettings = <K extends keyof CvSettings>(
    field: K,
    value: CvSettings[K],
  ) => {
    setCvData((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  };

  const updateLinkItem = (
    id: string,
    field: keyof CvLinkItem,
    value: string | boolean,
  ) => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: prev.personal.links.map((lnk) =>
          lnk.id === id ? { ...lnk, [field]: value } : lnk,
        ),
      },
    }));
  };

  const addLinkItem = () => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: [
          ...prev.personal.links,
          {
            id: `lnk-${Date.now()}`,
            label: "Web / Link",
            displayUrl: "ornek-site.com",
            url: "https://ornek-site.com",
            visible: true,
          },
        ],
      },
    }));
  };

  const removeLinkItem = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: prev.personal.links.filter((lnk) => lnk.id !== id),
      },
    }));
  };

  const moveSection = (sectionId: SectionId, direction: "up" | "down") => {
    setCvData((prev) => {
      const currentOrder = prev.settings.sectionOrder || DEFAULT_SECTION_ORDER;
      const idx = currentOrder.indexOf(sectionId);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentOrder.length) return prev;
      const nextOrder = [...currentOrder];
      const [moved] = nextOrder.splice(idx, 1);
      nextOrder.splice(targetIdx, 0, moved);
      return {
        ...prev,
        settings: { ...prev.settings, sectionOrder: nextOrder },
      };
    });
  };

  const toggleSectionVisibility = (sectionId: SectionId) => {
    setCvData((prev) => {
      const currentHidden = prev.settings.hiddenSections || [];
      const isHidden = currentHidden.includes(sectionId);
      const nextHidden = isHidden
        ? currentHidden.filter((id) => id !== sectionId)
        : [...currentHidden, sectionId];
      return {
        ...prev,
        settings: { ...prev.settings, hiddenSections: nextHidden },
      };
    });
  };

  const updateSectionTitle = (sectionId: SectionId, newTitle: string) => {
    setCvData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionTitles: {
          ...(prev.settings.sectionTitles || DEFAULT_SECTION_TITLES),
          [sectionId]: newTitle,
        },
      },
    }));
  };

  const toggleForcedBreak = (blockId: string) => {
    setCvData((prev) => {
      const exists = prev.settings.forcedBreaks.includes(blockId);
      const nextBreaks = exists
        ? prev.settings.forcedBreaks.filter((id) => id !== blockId)
        : [...prev.settings.forcedBreaks, blockId];
      return {
        ...prev,
        settings: { ...prev.settings, forcedBreaks: nextBreaks },
      };
    });
  };

  // Fotoğraf Yükleme
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateSettings("photoUrl", result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Doğrudan JSON Dosyasına Kaydetme (/api/cv POST)
  const handleSave = async () => {
    const activeDraft = drafts.find((d) => d.id === activeDraftId);
    const now = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeDraftId,
          name: activeDraft?.name,
          cvData,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const nextDrafts = drafts.map((d) =>
          d.id === activeDraftId
            ? { ...d, cvData, updatedAt: result.updatedAt || now }
            : d,
        );
        setDrafts(nextDrafts);
        setLastSavedAt(result.updatedAt || now);
        setHasUnsavedChanges(false);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      } else {
        alert("Kaydetme hatası: " + (result.error || "Bilinmeyen hata"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Dosyaya kaydederken sunucu hatası oluştu.");
    }
  };

  const handleReset = async () => {
    const officialProfile = CV_PROFILES.find((p) => p.id === activeDraftId);
    if (!officialProfile) return;
    if (
      !window.confirm(
        `"${officialProfile.name}" taslağını ilk resmi verilerine sıfırlamak istediğinize emin misiniz?`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/cv");
      const data = await res.json();
      if (data.success && Array.isArray(data.drafts)) {
        const freshDraft = data.drafts.find(
          (d: SavedCvDraft) => d.id === activeDraftId,
        );
        if (freshDraft) {
          skipDirtyCheckRef.current = true;
          setCvData(freshDraft.cvData);
          setDrafts((prev) =>
            prev.map((d) => (d.id === activeDraftId ? freshDraft : d)),
          );
          setHasUnsavedChanges(false);
          setCopiedNotice(true);
          setTimeout(() => setCopiedNotice(false), 2000);
        }
      }
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  const handlePrint = () => {
    const activeDraft = drafts.find((d) => d.id === activeDraftId);
    const pdfFileName =
      activeDraft?.name ||
      `${cvData.personal.fullName || "CV"} - ${cvData.personal.title || "Yazilim Gelistirici"}`;
    document.title = pdfFileName;
    window.print();
  };

  // Taslak Seçimi & Oluşturma
  const selectDraft = (targetDraftId: string) => {
    if (targetDraftId === activeDraftId) return;
    const now = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const updatedDrafts = drafts.map((d) =>
      d.id === activeDraftId ? { ...d, cvData, updatedAt: now } : d,
    );
    const targetDraft = updatedDrafts.find((d) => d.id === targetDraftId);
    if (!targetDraft) return;

    skipDirtyCheckRef.current = true;
    setDrafts(updatedDrafts);
    setActiveDraftId(targetDraftId);
    setCvData(normalizeCvData(targetDraft.cvData));
    setHasUnsavedChanges(false);
  };

  const createNewDraft = async (mode: "blank" | "clone") => {
    const trimmedName = newDraftName.trim() || "Yeni CV Taslağı";
    const now = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newCv: CvData =
      mode === "blank"
        ? createPersonTemplateCv(trimmedName)
        : JSON.parse(JSON.stringify(cvData));

    const newDraftId = `draft-${Date.now()}`;
    const newDraft: SavedCvDraft = {
      id: newDraftId,
      name: trimmedName,
      updatedAt: now,
      cvData: newCv,
    };

    const nextDrafts = [...drafts, newDraft];
    skipDirtyCheckRef.current = true;
    setDrafts(nextDrafts);
    setActiveDraftId(newDraft.id);
    setCvData(newCv);
    setNewDraftName("");
    setShowNewDraftForm(false);
    setHasUnsavedChanges(false);

    // Yeni taslağı doğrudan diskteki custom klasörüne kaydet
    try {
      await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: newDraft.id,
          name: newDraft.name,
          cvData: newCv,
        }),
      });
    } catch (err) {
      console.error("Failed to persist new draft to disk:", err);
    }
  };

  const deleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (drafts.length <= 1) return;
    const nextDrafts = drafts.filter((d) => d.id !== draftId);
    let nextActiveId = activeDraftId;
    let nextCv = cvData;

    if (draftId === activeDraftId) {
      nextActiveId = nextDrafts[0].id;
      nextCv = normalizeCvData(nextDrafts[0].cvData);
      skipDirtyCheckRef.current = true;
      setActiveDraftId(nextActiveId);
      setCvData(nextCv);
    }

    setDrafts(nextDrafts);

    // Diskten de sil
    try {
      await fetch(`/api/cv?profileId=${encodeURIComponent(draftId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete draft from disk:", err);
    }
  };

  const renameActiveDraft = (newName: string) => {
    const nextDrafts = drafts.map((d) =>
      d.id === activeDraftId ? { ...d, name: newName } : d,
    );
    setDrafts(nextDrafts);
  };

  // Dil Değiştirme (TR <-> EN)
  const switchCvLanguage = (targetLang: "tr" | "en") => {
    const activeProfileMeta = CV_PROFILES.find((p) => p.id === activeDraftId);
    const currentPersonKey = activeProfileMeta?.personKey;
    if (!currentPersonKey || activeProfileMeta.lang === targetLang) return;

    const targetProfile = CV_PROFILES.find(
      (p) => p.personKey === currentPersonKey && p.lang === targetLang,
    );
    if (!targetProfile) return;

    const now = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const savedCurrentDrafts = drafts.map((d) =>
      d.id === activeDraftId ? { ...d, cvData, updatedAt: now } : d,
    );

    const existingTargetDraft = savedCurrentDrafts.find(
      (d) => d.id === targetProfile.id,
    );
    const baseTargetCv = normalizeCvData(
      existingTargetDraft
        ? existingTargetDraft.cvData
        : (targetProfile.data as Partial<CvData>),
    );

    // Kullanıcının görsel tercihlerini karşı dile aktar
    const syncedTargetCv: CvData = {
      ...baseTargetCv,
      settings: {
        ...baseTargetCv.settings,
        fontFamily: cvData.settings.fontFamily,
        density: cvData.settings.density,
        pageMarginMm: cvData.settings.pageMarginMm,
        showPage2Header: cvData.settings.showPage2Header,
        showFooter: cvData.settings.showFooter,
        showFooterOnSinglePage: cvData.settings.showFooterOnSinglePage,
        showPageNumbers: cvData.settings.showPageNumbers,
        showContinuationLabel: cvData.settings.showContinuationLabel,
        showPhoto: cvData.settings.showPhoto,
        photoUrl: cvData.settings.photoUrl || baseTargetCv.settings.photoUrl,
        photoPosition: cvData.settings.photoPosition,
        photoShape: cvData.settings.photoShape,
        photoSize: cvData.settings.photoSize,
        photoZoom: cvData.settings.photoZoom,
        photoOffsetY: cvData.settings.photoOffsetY,
        accentColor: cvData.settings.accentColor,
        skillsLayout: cvData.settings.skillsLayout,
        projectsLayout: cvData.settings.projectsLayout,
        sectionHeaderStyle: cvData.settings.sectionHeaderStyle,
        templateLayout: cvData.settings.templateLayout,
      },
    };

    const nextDrafts = existingTargetDraft
      ? savedCurrentDrafts.map((d) =>
          d.id === targetProfile.id ? { ...d, cvData: syncedTargetCv } : d,
        )
      : [
          ...savedCurrentDrafts,
          {
            id: targetProfile.id,
            name: targetProfile.name,
            updatedAt: targetProfile.updatedAt,
            cvData: syncedTargetCv,
          },
        ];

    skipDirtyCheckRef.current = true;
    setDrafts(nextDrafts);
    setActiveDraftId(targetProfile.id);
    setCvData(syncedTargetCv);
  };

  return (
    <div className="print-root min-h-screen lg:h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans lg:overflow-hidden">
      {/* Gizli Fotoğraf Yükleme Inputu */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Üst Bar */}
      <CvNavbar
        cvData={cvData}
        activeDraftId={activeDraftId}
        pagesCount={pagesToRender.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSave={handleSave}
        handleReset={handleReset}
        handlePrint={handlePrint}
        savedNotice={savedNotice}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedAt={lastSavedAt}
        copiedNotice={copiedNotice}
        switchCvLanguage={switchCvLanguage}
        onUpdateSettings={updateSettings}
      />

      {/* ANA RESPONSIVE ÇALIŞMA ALANI */}
      <main className="print-main flex-1 min-h-0 w-full max-w-[1920px] mx-auto p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-6 items-stretch lg:overflow-hidden">
        {/* SOL YÖNETİM ALANI (SABİT DİKEY SİDEBAR + AKTİF FORM ALANI) */}
        {viewMode === "split" && (
          <div className="no-print w-full lg:w-[620px] xl:w-[700px] 2xl:w-[760px] shrink-0 h-full flex flex-col">
            <EditorSidebar
              cvData={cvData}
              setCvData={setCvData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
              updatePersonal={updatePersonal}
              updateSettings={updateSettings}
              updateLinkItem={updateLinkItem}
              addLinkItem={addLinkItem}
              removeLinkItem={removeLinkItem}
              onPhotoUpload={handlePhotoUpload}
              moveSection={moveSection}
              toggleSectionVisibility={toggleSectionVisibility}
              updateSectionTitle={updateSectionTitle}
              jobAdText={jobAdText}
              setJobAdText={setJobAdText}
            />
          </div>
        )}

        {/* SAĞ ÖNİZLEME ALANI (A4 SAYFALAR - BAĞIMSIZ SCROLLABLE) */}
        <div className="print-preview-container flex-1 min-w-0 h-full overflow-y-auto px-1 sm:px-2 pb-16 flex flex-col items-center scrollbar-thin scrollbar-thumb-slate-300">
          <CvPreviewContainer
            cvData={cvData}
            pagesToRender={pagesToRender}
            allBlocks={allBlocks}
            measureContainerRef={measureContainerRef}
            pageRulerRef={pageRulerRef}
            viewMode={viewMode}
            onPhotoClick={() => fileInputRef.current?.click()}
            onToggleForcedBreak={toggleForcedBreak}
          />
        </div>
      </main>
    </div>
  );
}
