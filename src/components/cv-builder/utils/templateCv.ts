import { CvData } from "../types";
import {
  DEFAULT_SECTION_ORDER,
  GENERIC_SECTION_TITLES,
} from "../constants";

export const createPersonTemplateCv = (personName: string): CvData => {
  const cleanName = personName.trim() || "YENİ ADAY";
  const slug = cleanName
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "");

  const upperName = cleanName.toLocaleUpperCase("tr-TR");

  return {
    settings: {
      fontFamily: "sans",
      density: "compact",
      pageMarginMm: 14,
      showPage2Header: true,
      page2HeaderLeftText: "",
      page2HeaderRightText: "",
      showFooter: true,
      showFooterOnSinglePage: false,
      footerLeftText: upperName,
      footerRightCustomText: "",
      showPageNumbers: true,
      pageNumberLabel: "Sayfa",
      showContinuationLabel: true,
      continuationLabelText: "(Devamı)",
      sectionTitles: { ...GENERIC_SECTION_TITLES },
      showPhoto: true,
      photoUrl: "",
      photoPosition: "left",
      photoShape: "rounded",
      photoSize: "md",
      photoZoom: 1,
      photoOffsetY: 0,
      accentColor: "navy",
      showLinksIcon: true,
      forcedBreaks: [],
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      hiddenSections: [],
      skillsLayout: "list",
      projectsLayout: "list",
      sectionHeaderStyle: "accentBar",
      templateLayout: "modern",
    },
    personal: {
      fullName: upperName,
      title: "Uzmanlık Alanı / Unvan",
      phone: "+90 (5XX) XXX XX XX",
      email: `${slug || "iletisim"}@email.com`,
      corpEmail: "",
      location: "Ofiste / Hibrit / Uzaktan",
      militaryLabel: "",
      military: "",
      website: "",
      github: "",
      linkedin: `linkedin.com/in/${slug || "profil"}`,
      googlePlay: "",
      links: [
        {
          id: `lnk-${Date.now()}-1`,
          label: "LinkedIn",
          displayUrl: `linkedin.com/in/${slug || "profil"}`,
          url: `https://www.linkedin.com/in/${slug || "profil"}`,
          visible: true,
        },
      ],
    },
    summary:
      "Kariyer hedeflerinizi, uzmanlık alanlarınızı ve öne çıkan yetkinliklerinizi özetleyen profesyonel özet metnini buraya yazabilirsiniz.",
    closingNote: "",
    skills: [
      {
        id: "sk-1",
        category: "Mesleki Yetkinlikler",
        items: "Proje Yönetimi, Analitik Düşünme, Problem Çözme, İletişim",
      },
      {
        id: "sk-2",
        category: "Araçlar & Teknolojiler",
        items: "MS Office, Kurumsal Yazılımlar, Raporlama & Sunum",
      },
    ],
    experiences: [
      {
        id: "exp-1",
        role: "Pozisyon / Unvan",
        company: "Kurum veya Şirket Adı",
        location: "Şehir, Türkiye",
        date: "2024 – Günümüz",
        bullets: [
          "Gerçekleştirilen sorumlulukları, projeleri ve elde edilen başarıları maddeler halinde buraya ekleyebilirsiniz.",
        ],
      },
    ],
    projects: [
      {
        id: "proj-1",
        visible: true,
        name: "Örnek Proje / Çalışma Başlığı",
        tech: "Kullanılan Yöntem, Araç veya Teknolojiler",
        link: "",
        bullets: [
          "Projenin kapsamı, amacı ve ürettiği çıktıların kısa açıklaması.",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "Lisans / Ön Lisans Bölümü",
        school: "Üniversite Adı",
        date: "Mezuniyet: 2025",
        details: "GANO ve öne çıkan akademik çalışmalar / dersler",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        name: "Sertifika veya Eğitim Programı Adı",
        detail: "Veren kurum ve eğitim içeriği hakkında kısa açıklama.",
      },
    ],
  };
};
