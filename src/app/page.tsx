"use client";

import { useEffect, useState } from "react";
import { getPortfolioData, Language } from "@/lib/portfolio-service";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Publications } from "@/components/publications";
import { Skills } from "@/components/skills";
import { Footer } from "@/components/footer";
import { FloatingDock } from "@/components/navbar";
import { Experience } from "@/components/experience";

export default function Home() {
  const [lang, setLang] = useState<Language>("tr");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. CİHAZ DİLİNİ OTOMATİK ALGILA VEYA HAFIZADAN AL
  useEffect(() => {
    // Kullanıcı daha önce dili elle seçtiyse hafızadan al
    const savedLang = localStorage.getItem("portfolio_lang") as Language | null;
    
    if (savedLang) {
      setLang(savedLang);
    } else {
      // İlk kez giriyorsa tarayıcı diline bak: Türkçe ise 'tr', dünyanın geri kalanı 'en'
      const browserLang = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "tr";
      const detectedLang: Language = browserLang.startsWith("tr") ? "tr" : "en";
      setLang(detectedLang);
    }
  }, []);

  // 2. VERİLERİ DİLE GÖRE ÇEK
   useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getPortfolioData(lang);
      setData(res);
      
      // Admin'de belirlediğin SEO başlığını tarayıcı sekmesine bas (TypeScript güvenli)
      const pageTitle = (res?.profile as any)?.metaTitle || (res?.profile as any)?.title || "Kerem SALTIK";
      if (typeof document !== "undefined") {
        document.title = pageTitle;
      }

      setLoading(false);
    }
    loadData();
  }, [lang]);

  // DİLİ DEĞİŞTİR VE HAFIZAYA KAYDET
  const toggleLanguage = () => {
    setLang((prev) => {
      const nextLang: Language = prev === "tr" ? "en" : "tr";
      localStorage.setItem("portfolio_lang", nextLang);
      return nextLang;
    });
  };

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 relative pb-32 transition-colors duration-300 overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        <Hero profile={data?.profile} lang={lang} />
        <Projects projects={data?.projects || []} lang={lang} />
        <Experience items={data?.experience || []} lang={lang} />
        <Publications publications={data?.publications || []} lang={lang} />
        <Skills skills={data?.skills || []} lang={lang} />
        <Footer 
          email={data?.profile?.email} 
          name={data?.profile?.name} 
          lang={lang} 
          isAvailable={data?.profile?.isAvailable} 
        />
      </div>

      <FloatingDock 
        lang={lang} 
        onToggleLang={toggleLanguage}
        githubUrl={data?.profile?.github}
        linkedinUrl={data?.profile?.linkedin}
        email={data?.profile?.email}
      />
    </main>
  );
}