import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Dijital — Açık Kaynak Akıllı A4 CV Oluşturucu | OrangeHat Digital",
  description:
    "OrangeHat Digital tarafından geliştirilen; akıllı A4 sayfalama, ATS uyumu ve çoklu profil desteği sunan açık kaynak, ücretsiz CV oluşturma aracı. Geliştiriciler: Furkan Aslan & Kübra Kara.",
  authors: [
    { name: "OrangeHat Digital", url: "https://orangehatdigital.com.tr" },
    { name: "Furkan Aslan", url: "https://furkanaslan.orangehatdigital.com.tr" },
    { name: "Kübra Kara", url: "https://kubrakara.vercel.app" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
