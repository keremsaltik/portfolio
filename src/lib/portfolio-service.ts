import { supabase } from "./supabase";
import { DATA } from "@/data/portfolio-data";

export type Language = "tr" | "en";

export async function getPortfolioData(lang: Language = "tr") {
  try {
    // 1. Profil
    const { data: profileData } = await supabase.from("profile").select("*").limit(1).maybeSingle();

    // 2. Projeler
    const { data: projectsData } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });

    // 3. Yayınlar
    const { data: publicationsData } = await supabase.from("publications").select("*").order("sort_order", { ascending: true });

    // 4. Yetenekler
    const { data: skillsData } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });

    // 5. Deneyimler & Eğitim
    const { data: experienceData } = await supabase.from("experience").select("*").order("sort_order", { ascending: true });

    const profile = profileData
      ? {
          name: profileData.name,
          title: lang === "tr" ? profileData.title_tr : profileData.title_en,
          about: lang === "tr" ? profileData.about_tr : profileData.about_en,
          email: profileData.email,
          github: profileData.github_url,
          linkedin: profileData.linkedin_url,
          cv_url: lang === "tr" 
            ? (profileData.cv_url_tr || profileData.cv_url) 
            : (profileData.cv_url_en || profileData.cv_url_tr || profileData.cv_url),
          isAvailable: profileData.is_available ?? true,
          statusText: lang === "tr" 
            ? (profileData.status_tr || "Yeni Projelere & Fırsatlara Açık") 
            : (profileData.status_en || "Open to New Roles & Projects"),
          metaTitle: profileData.meta_title,
          metaDescription: profileData.meta_description,
          keywords: profileData.keywords || [],
        }
      : {
          name: DATA.name,
          title: DATA.title,
          about: DATA.about,
          email: DATA.contact.email,
          github: DATA.contact.social.github.url,
          linkedin: DATA.contact.social.linkedin.url,
          cv_url: "#",
          isAvailable: true,
          statusText: lang === "tr" ? "Yeni Projelere & Fırsatlara Açık" : "Open to New Roles & Projects",
        };

    const projects = (projectsData || []).map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: lang === "tr" ? p.subtitle_tr : p.subtitle_en,
      description: lang === "tr" ? p.description_tr : p.description_en,
      technologies: p.technologies || [],
      link: p.link,
      isLiveAppStore: p.is_live_app_store,
      imageUrl: p.image_url,
      architecture: lang === "tr" ? p.architecture_tr : p.architecture_en,
      security: lang === "tr" ? p.security_tr : p.security_en,
    }));

    const publications = (publicationsData || []).map((pub) => ({
      id: pub.id,
      title: pub.title,
      journal: pub.journal,
      year: pub.year,
      type: lang === "tr" ? pub.type_tr : pub.type_en,
      description: lang === "tr" ? pub.description_tr : pub.description_en,
      link: pub.link,
    }));

    const skills = (skillsData || []).map((s) => ({
      id: s.id,
      category: lang === "tr" ? s.category_tr : s.category_en,
      items: s.items || [],
    }));

    const experience = (experienceData || []).map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: lang === "tr" ? e.subtitle_tr : e.subtitle_en,
      period: e.period,
      description: lang === "tr" ? e.description_tr : e.description_en,
      technologies: e.technologies || [],
      type: e.type,
    }));

    return { profile, projects, publications, skills, experience };
  } catch (error) {
    console.error("Veri Çekme Hatası:", error);
    return {
      profile: { 
        name: DATA.name, 
        title: DATA.title, 
        about: DATA.about, 
        email: DATA.contact.email,
        isAvailable: true,
        statusText: lang === "tr" ? "Yeni Projelere & Fırsatlara Açık" : "Open to New Roles & Projects"
      },
      projects: [],
      publications: [],
      skills: [],
      experience: [],
    };
  }
}