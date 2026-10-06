import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"], // Yönetim panelini arama motorlarına kapatıyoruz (Güvenlik)
      },
    ],
    sitemap: "https://keremsaltik.dev/sitemap.xml",
  };
}