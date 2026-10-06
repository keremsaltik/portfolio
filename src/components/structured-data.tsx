interface StructuredDataProps {
  profile: any;
  publications: any[];
  projects: any[];
  skills: any[];
}

export function StructuredData({ profile, publications, projects, skills }: StructuredDataProps) {
  if (!profile) return null;

  // Veritabanındaki tüm yetenekleri tek bir düz diziye çıkarıp AI'ya sunuyoruz
  const allSkills = skills.flatMap((s) => s.items || []);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. DİNAMİK MÜHENDİS PROFİLİ (Person)
      {
        "@type": "Person",
        "@id": "https://keremsaltik.dev/#person",
        "name": profile.name,
        "jobTitle": profile.title_en || profile.title_tr,
        "description": profile.about_en || profile.about_tr,
        "email": profile.email,
        "url": "https://keremsaltik.dev",
        "knowsAbout": allSkills, // Admin panelinden eklediğin her yeni teknoloji anında buraya girer!
        "sameAs": [profile.github_url, profile.linkedin_url].filter(Boolean),
        "alumniOf": [
          {
            "@type": "EducationalOrganization",
            "name": "İstanbul Beykent Üniversitesi",
          },
          {
            "@type": "EducationalOrganization",
            "name": "İstanbul Haliç Üniversitesi",
          }
        ]
      },

      // 2. DİNAMİK YAYINLAR (Admin'den ekledikçe çoğalır)
      ...publications.map((pub) => ({
        "@type": "ScholarlyArticle",
        "headline": pub.title,
        "publisher": {
          "@type": "Organization",
          "name": pub.journal,
        },
        "datePublished": pub.year,
        "description": pub.description_en || pub.description_tr,
        "author": {
          "@id": "https://keremsaltik.dev/#person"
        },
        ...(pub.link ? { "url": pub.link } : {})
      })),

      // 3. DİNAMİK PROJELER (App Store veya Web)
      ...projects.map((proj) => ({
        "@type": proj.is_live_app_store ? "SoftwareApplication" : "CreativeWork",
        "name": proj.title,
        "description": proj.description_en || proj.description_tr,
        "author": {
          "@id": "https://keremsaltik.dev/#person"
        },
        ...(proj.link ? { "url": proj.link } : {}),
        ...(proj.is_live_app_store ? { "operatingSystem": "iOS", "applicationCategory": "UtilitiesApplication" } : {})
      }))
    ]
  };

  return (
    <script
      id="json-ld-schema"
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}