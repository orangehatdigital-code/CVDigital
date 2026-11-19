import { CV_PROFILES } from "@/data/cvs";
import { CvData, SavedCvDraft } from "../types";
import { CURRENT_STORAGE_KEY, LEGACY_STORAGE_KEYS } from "../constants";
import { normalizeCvData } from "./normalizeCvData";

export const getInitialDrafts = (): SavedCvDraft[] => {
  return CV_PROFILES.map((profile) => ({
    id: profile.id,
    name: profile.name,
    updatedAt: profile.updatedAt,
    cvData: normalizeCvData(profile.data as Partial<CvData>),
  }));
};

export const loadStoredState = (
  defaultDrafts: SavedCvDraft[],
): {
  drafts: SavedCvDraft[];
  activeDraftId: string;
  cvData: CvData;
} => {
  if (typeof window === "undefined") {
    return {
      drafts: defaultDrafts,
      activeDraftId: defaultDrafts[0]?.id || "",
      cvData: defaultDrafts[0]?.cvData || ({} as CvData),
    };
  }

  try {
    let raw = window.localStorage.getItem(CURRENT_STORAGE_KEY);
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyVal = window.localStorage.getItem(legacyKey);
        if (legacyVal) {
          raw = legacyVal;
          break;
        }
      }
    }

    if (!raw) {
      return {
        drafts: defaultDrafts,
        activeDraftId: defaultDrafts[0]?.id || "",
        cvData: defaultDrafts[0]?.cvData || ({} as CvData),
      };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.drafts) || parsed.drafts.length === 0) {
      return {
        drafts: defaultDrafts,
        activeDraftId: defaultDrafts[0]?.id || "",
        cvData: defaultDrafts[0]?.cvData || ({} as CvData),
      };
    }

    const isMojibake = (text: string) => /[\u00C2\u00C3\u00C4\u00C5][\u0080-\u00BF]/.test(text);

    const storedDrafts: SavedCvDraft[] = parsed.drafts.map((d: SavedCvDraft) => {
      const matchingOfficial = defaultDrafts.find((def) => def.id === d.id);
      const isCorrupted =
        matchingOfficial &&
        (isMojibake(d.name || "") ||
          isMojibake(d.cvData?.summary || "") ||
          isMojibake(d.cvData?.personal?.fullName || ""));

      // Eğer tarayıcı önbelleğindeki taslak bozulmuşsa, temiz resmi profilden al
      const baseSource = isCorrupted ? matchingOfficial.cvData : d.cvData;

      return {
        id: d.id || `draft-${Date.now()}`,
        name: isCorrupted ? matchingOfficial.name : d.name || "İsimsiz CV",
        updatedAt: d.updatedAt || "",
        cvData: normalizeCvData(baseSource, matchingOfficial?.cvData),
      };
    });

    // Merge any official profile from CV_PROFILES that isn't in storedDrafts yet
    const mergedList = [...storedDrafts];
    defaultDrafts.forEach((defDraft) => {
      const exists = mergedList.some((d) => d.id === defDraft.id);
      if (!exists) {
        const officialEntry = CV_PROFILES.find((p) => p.id === defDraft.id);
        const pairedExisting = officialEntry
          ? mergedList.find((d) => {
              const pairOfficial = CV_PROFILES.find((p) => p.id === d.id);
              return pairOfficial?.personKey === officialEntry.personKey;
            })
          : null;

        const syncedDraft: SavedCvDraft =
          pairedExisting?.cvData.settings.photoUrl
            ? {
                ...defDraft,
                cvData: {
                  ...defDraft.cvData,
                  settings: {
                    ...defDraft.cvData.settings,
                    photoUrl: pairedExisting.cvData.settings.photoUrl,
                    photoZoom: pairedExisting.cvData.settings.photoZoom,
                    photoOffsetY: pairedExisting.cvData.settings.photoOffsetY,
                    photoShape: pairedExisting.cvData.settings.photoShape,
                    photoSize: pairedExisting.cvData.settings.photoSize,
                  },
                },
              }
            : defDraft;

        mergedList.push(syncedDraft);
      }
    });

    const activeId =
      parsed.activeDraftId && mergedList.some((d) => d.id === parsed.activeDraftId)
        ? parsed.activeDraftId
        : mergedList[0]?.id || defaultDrafts[0]?.id || "";

    const activeDraft =
      mergedList.find((d) => d.id === activeId) || mergedList[0] || defaultDrafts[0];

    const currentCvData = parsed.cvData
      ? normalizeCvData(parsed.cvData, activeDraft?.cvData)
      : activeDraft?.cvData || defaultDrafts[0].cvData;

    return {
      drafts: mergedList,
      activeDraftId: activeId,
      cvData: currentCvData,
    };
  } catch (err) {
    console.error("Failed to load CV drafts from storage:", err);
    return {
      drafts: defaultDrafts,
      activeDraftId: defaultDrafts[0]?.id || "",
      cvData: defaultDrafts[0]?.cvData || ({} as CvData),
    };
  }
};

export const persistState = (
  drafts: SavedCvDraft[],
  activeDraftId: string,
  cvData: CvData,
) => {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      version: 3,
      drafts,
      activeDraftId,
      cvData,
      savedAt: new Date().toISOString(),
    });
    window.localStorage.setItem(CURRENT_STORAGE_KEY, payload);
  } catch (err) {
    console.error("Failed to persist CV state:", err);
  }
};
