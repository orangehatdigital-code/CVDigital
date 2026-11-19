import ornekTrCv from "./ornek/cvtr.json";
import ornekEnCv from "./ornek/cven.json";

export interface CvProfileEntry {
  id: string;
  name: string;
  updatedAt: string;
  lang: "tr" | "en";
  personKey: string;
  filePath: string;
  data: unknown;
}

export const CV_PROFILES: CvProfileEntry[] = [
  {
    id: "ornek-tr",
    name: "Örnek Profil - Yazılım Geliştirici",
    updatedAt: "TR",
    lang: "tr",
    personKey: "ornek",
    filePath: "ornek/cvtr.json",
    data: ornekTrCv,
  },
  {
    id: "ornek-en",
    name: "Sample Profile - Software Developer",
    updatedAt: "EN",
    lang: "en",
    personKey: "ornek",
    filePath: "ornek/cven.json",
    data: ornekEnCv,
  },
];
