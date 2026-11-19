import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CV_PROFILES } from "@/data/cvs";
import { CvData, SavedCvDraft } from "@/components/cv-builder/types";
import { normalizeCvData } from "@/components/cv-builder/utils/normalizeCvData";

const BASE_CVS_DIR = path.join(process.cwd(), "src", "data", "cvs");
const CUSTOM_CVS_DIR = path.join(BASE_CVS_DIR, "custom");

// Güvenli klasör kontrolü
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// GET: Tüm CV profillerini doğrudan diskteki JSON dosyalarından oku
export async function GET() {
  try {
    ensureDir(CUSTOM_CVS_DIR);

    const drafts: SavedCvDraft[] = [];

    // 1. Resmi profilleri diskten oku
    for (const profile of CV_PROFILES) {
      const fullPath = path.join(BASE_CVS_DIR, profile.filePath);
      if (fs.existsSync(fullPath)) {
        try {
          const raw = fs.readFileSync(fullPath, "utf8");
          const parsed = JSON.parse(raw);
          drafts.push({
            id: profile.id,
            name: profile.name,
            updatedAt: profile.updatedAt,
            cvData: normalizeCvData(parsed as Partial<CvData>),
          });
        } catch (err) {
          console.error(`Error reading ${profile.filePath}:`, err);
        }
      }
    }

    // 2. Varsa custom klasöründeki kullanıcı taslaklarını oku
    if (fs.existsSync(CUSTOM_CVS_DIR)) {
      const customFiles = fs.readdirSync(CUSTOM_CVS_DIR).filter((f) => f.endsWith(".json"));
      for (const f of customFiles) {
        try {
          const fullPath = path.join(CUSTOM_CVS_DIR, f);
          const raw = fs.readFileSync(fullPath, "utf8");
          const parsed = JSON.parse(raw);
          const id = path.basename(f, ".json");
          drafts.push({
            id,
            name: parsed._metaName || parsed?.personal?.fullName || "Özel Taslak",
            updatedAt: parsed._metaUpdatedAt || "Özel",
            cvData: normalizeCvData(parsed as Partial<CvData>),
          });
        } catch (err) {
          console.error(`Error reading custom file ${f}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      drafts,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// POST: Gelen CV verisini doğrudan ilgili JSON dosyasına yaz
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, name, cvData } = body as {
      profileId: string;
      name?: string;
      cvData: CvData;
    };

    if (!profileId || !cvData) {
      return NextResponse.json(
        { success: false, error: "Geçersiz parametreler" },
        { status: 400 },
      );
    }

    const nowStr = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Resmi profil eşleşmesi var mı?
    const officialProfile = CV_PROFILES.find((p) => p.id === profileId);

    if (officialProfile) {
      const targetFilePath = path.join(BASE_CVS_DIR, officialProfile.filePath);
      ensureDir(path.dirname(targetFilePath));

      const cleanJson = JSON.stringify(cvData, null, 2);
      fs.writeFileSync(targetFilePath, cleanJson, { encoding: "utf8" });

      // Furkan TR için cv.json dosyasını da güncel tut
      if (officialProfile.id === "furkan-tr") {
        const mirrorPath = path.join(BASE_CVS_DIR, "furkan", "cv.json");
        fs.writeFileSync(mirrorPath, cleanJson, { encoding: "utf8" });
      }

      // Kübra TR için cv.json dosyasını da güncel tut
      if (officialProfile.id === "kubra-tr") {
        const mirrorPath = path.join(BASE_CVS_DIR, "kubra", "cv.json");
        fs.writeFileSync(mirrorPath, cleanJson, { encoding: "utf8" });
      }

      return NextResponse.json({
        success: true,
        message: `${officialProfile.name} dosyası başarıyla güncellendi.`,
        updatedAt: nowStr,
        filePath: officialProfile.filePath,
      });
    }

    // 2. Özel / Yeni Taslak ise custom klasörüne kaydet
    ensureDir(CUSTOM_CVS_DIR);
    const safeFileName = `${profileId.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
    const targetFilePath = path.join(CUSTOM_CVS_DIR, safeFileName);

    const payloadToWrite = {
      _metaName: name || "Özel Taslak",
      _metaUpdatedAt: nowStr,
      ...cvData,
    };

    fs.writeFileSync(targetFilePath, JSON.stringify(payloadToWrite, null, 2), {
      encoding: "utf8",
    });

    return NextResponse.json({
      success: true,
      message: `Taslak başarıyla kaydedildi: ${safeFileName}`,
      updatedAt: nowStr,
      filePath: `custom/${safeFileName}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Kayıt sırasında hata oluştu";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// DELETE: Özel taslak dosyasını diskten sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { success: false, error: "profileId eksik" },
        { status: 400 },
      );
    }

    const safeFileName = `${profileId.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
    const targetFilePath = path.join(CUSTOM_CVS_DIR, safeFileName);

    if (fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
      return NextResponse.json({
        success: true,
        message: "Dosya başarıyla silindi.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Resmi profil diskten silinemez ancak arayüzden gizlendi.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Silme hatası";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
