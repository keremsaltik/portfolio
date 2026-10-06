import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://keremsaltik.dev",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          tr: "https://keremsaltik.dev/?lang=tr",
          en: "https://keremsaltik.dev/?lang=en",
        },
      },
    },
    {
      url: "https://keremsaltik.dev/?lang=en",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}