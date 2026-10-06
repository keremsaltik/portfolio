"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Globe, 
  Cpu, 
  BookOpen, 
  FolderGit2, 
  User,
  ArrowLeft,
  CheckCircle2,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Upload,
  FileDown,
  X
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Aktif Sekmeler
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "profile" | "publications" | "skills">("projects");
  const [expSubTab, setExpSubTab] = useState<"work" | "education">("work");

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Status
  const [saveStatus, setSaveStatus] = useState("");

  // Düzenleme Modu Stateleri
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingExperience, setEditingExperience] = useState<any | null>(null);
  const [editingPublication, setEditingPublication] = useState<any | null>(null);

  // Görsel Yükleme Durumu
  const [uploadingImage, setUploadingImage] = useState(false);

  // Dile Özel CV İçin "Aynı CV'yi Kullan" Kontrolü
  const [sameCv, setSameCv] = useState(true);

  // Yeni Yayın Form State
  const [newPublication, setNewPublication] = useState({
    title: "",
    journal: "",
    year: "2025",
    type_tr: "Akademik Makale",
    type_en: "Research Paper",
    description_tr: "",
    description_en: "",
    link: "",
  });

  // Load Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadAllData();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadAllData();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadAllData() {
    const { data: prof } = await supabase.from("profile").select("*").single();
    const { data: proj } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
    const { data: pubs } = await supabase.from("publications").select("*").order("sort_order", { ascending: true });
    const { data: sks } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
    const { data: exps } = await supabase.from("experience").select("*").order("sort_order", { ascending: true });

    if (prof) {
      setProfile(prof);
      // Eğer TR ve EN linkleri farklıysa "Aynı CV" onay kutusunu kapalı başlat
      if (prof.cv_url_tr && prof.cv_url_en && prof.cv_url_tr !== prof.cv_url_en) {
        setSameCv(false);
      }
    }
    if (proj) setProjects(proj);
    if (pubs) setPublications(pubs);
    if (sks) setSkills(sks);
    if (exps) setExperiences(exps);
  }

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("Hatalı e-posta veya şifre!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- GENEL SIRALAMA (YUKARI / AŞAĞI TAŞIMA) ---
  const handleMoveItem = async (
    table: string,
    items: any[],
    setItems: Function,
    currentIndex: number,
    direction: "up" | "down"
  ) => {
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === items.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];

    const newItems = [...items];
    newItems[currentIndex] = targetItem;
    newItems[targetIndex] = currentItem;
    setItems(newItems);

    await supabase.from(table).update({ sort_order: targetIndex + 1 }).eq("id", currentItem.id);
    await supabase.from(table).update({ sort_order: currentIndex + 1 }).eq("id", targetItem.id);
  };

  // --- GALERİ YARDIMCILARI ---
  const getProjectImages = (url: string | undefined): string[] => {
    if (!url) return [];
    return url.split(",").map((u) => u.trim()).filter(Boolean);
  };

  const removeImageFromProject = (indexToRemove: number) => {
    if (!editingProject) return;
    const current = getProjectImages(editingProject.image_url);
    const updated = current.filter((_, idx) => idx !== indexToRemove);
    setEditingProject({
      ...editingProject,
      image_url: updated.join(", "),
    });
  };

  // --- PC'DEN FOTOĞRAF YÜKLEME (SUPABASE STORAGE) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("portfolio").upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
        if (data.publicUrl) uploadedUrls.push(data.publicUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      const existing = editingProject.image_url ? `${editingProject.image_url}, ` : "";
      setEditingProject({
        ...editingProject,
        image_url: `${existing}${uploadedUrls.join(", ")}`,
      });
    }

    setUploadingImage(false);
  };

  // --- PROFİL, ÇALIŞMA DURUMU & CV KAYDETME ---
  const handleSaveProfile = async () => {
    setSaveStatus("Kaydediliyor...");

    const cvFinalTr = sameCv ? (profile.cv_url_tr || profile.cv_url) : profile.cv_url_tr;
    const cvFinalEn = sameCv ? (profile.cv_url_tr || profile.cv_url) : profile.cv_url_en;

    const { error } = await supabase
      .from("profile")
      .update({
        name: profile.name,
        title_tr: profile.title_tr,
        title_en: profile.title_en,
        about_tr: profile.about_tr,
        about_en: profile.about_en,
        email: profile.email,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        meta_title: profile.meta_title,
        meta_description: profile.meta_description,
        is_available: profile.is_available ?? true,
        status_tr: profile.status_tr || "Yeni Projelere & Fırsatlara Açık",
        status_en: profile.status_en || "Open to New Roles & Projects",
        cv_url: cvFinalTr || null,
        cv_url_tr: cvFinalTr || null,
        cv_url_en: cvFinalEn || null,
        keywords: typeof profile.keywords === "string" 
          ? profile.keywords.split(",").map((k: string) => k.trim()) 
          : profile.keywords || [],
      })
      .eq("id", profile.id);

    if (!error) {
      setSaveStatus("Tüm profil, çalışma durumu ve CV ayarları başarıyla kaydedildi!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      console.error("Profil Kayıt Hatası:", error);
      setSaveStatus("Hata oluştu: " + error.message);
    }
  };

  // --- PROJE KAYDETME ---
  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaveStatus("Proje kaydediliyor...");

    const techArray = typeof editingProject.technologies === "string"
      ? editingProject.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : editingProject.technologies || [];

    const projectPayload = {
      title: editingProject.title,
      subtitle_tr: editingProject.subtitle_tr,
      subtitle_en: editingProject.subtitle_en,
      description_tr: editingProject.description_tr,
      description_en: editingProject.description_en,
      technologies: techArray,
      link: editingProject.link,
      image_url: editingProject.image_url || null,
      architecture_tr: editingProject.architecture_tr || null,
      architecture_en: editingProject.architecture_en || null,
      security_tr: editingProject.security_tr || null,
      security_en: editingProject.security_en || null,
      is_live_app_store: editingProject.is_live_app_store || false,
      sort_order: editingProject.sort_order || projects.length + 1,
    };

    if (editingProject.id) {
      const { error } = await supabase.from("projects").update(projectPayload).eq("id", editingProject.id);
      if (!error) {
        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...projectPayload } : p)));
        setSaveStatus("Proje güncellendi!");
        setTimeout(() => { setSaveStatus(""); setEditingProject(null); }, 1000);
      }
    } else {
      const { data, error } = await supabase.from("projects").insert([projectPayload]).select();
      if (!error && data) {
        setProjects([...projects, data[0]]);
        setSaveStatus("Yeni proje eklendi!");
        setTimeout(() => { setSaveStatus(""); setEditingProject(null); }, 1000);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects(projects.filter((p) => p.id !== id));
  };

  // --- DENEYİM & EĞİTİM KAYDETME ---
  const handleSaveExperienceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    setSaveStatus("Deneyim kaydediliyor...");

    const techArray = typeof editingExperience.technologies === "string"
      ? editingExperience.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : editingExperience.technologies || [];

    const payload = {
      title: editingExperience.title,
      subtitle_tr: editingExperience.subtitle_tr,
      subtitle_en: editingExperience.subtitle_en,
      period: editingExperience.period,
      description_tr: editingExperience.description_tr,
      description_en: editingExperience.description_en,
      technologies: techArray,
      type: editingExperience.type || "work",
      sort_order: editingExperience.sort_order || experiences.length + 1,
    };

    if (editingExperience.id) {
      const { error } = await supabase.from("experience").update(payload).eq("id", editingExperience.id);
      if (!error) {
        setExperiences(experiences.map((ex) => (ex.id === editingExperience.id ? { ...ex, ...payload } : ex)));
        setSaveStatus("Deneyim güncellendi!");
        setTimeout(() => { setSaveStatus(""); setEditingExperience(null); }, 1000);
      }
    } else {
      const { data, error } = await supabase.from("experience").insert([payload]).select();
      if (!error && data) {
        setExperiences([...experiences, data[0]]);
        setSaveStatus("Yeni deneyim eklendi!");
        setTimeout(() => { setSaveStatus(""); setEditingExperience(null); }, 1000);
      }
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Bu deneyimi/eğitimi silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (!error) setExperiences(experiences.filter((e) => e.id !== id));
  };

  // --- YAYIN KAYDETME & GÜNCELLEME ---
  const handleSavePublicationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPublication) return;

    const payload = {
      title: editingPublication.title,
      journal: editingPublication.journal,
      year: editingPublication.year,
      type_tr: editingPublication.type_tr,
      type_en: editingPublication.type_en,
      description_tr: editingPublication.description_tr,
      description_en: editingPublication.description_en,
      link: editingPublication.link || null,
      sort_order: editingPublication.sort_order || publications.length + 1,
    };

    if (editingPublication.id) {
      const { error } = await supabase.from("publications").update(payload).eq("id", editingPublication.id);
      if (!error) {
        setPublications(publications.map((pub) => (pub.id === editingPublication.id ? { ...pub, ...payload } : pub)));
        setSaveStatus("Yayın güncellendi!");
        setTimeout(() => { setSaveStatus(""); setEditingPublication(null); }, 1000);
      }
    } else {
      const { data, error } = await supabase.from("publications").insert([payload]).select();
      if (!error && data) {
        setPublications([...publications, data[0]]);
        setSaveStatus("Yeni yayın eklendi!");
        setTimeout(() => { setSaveStatus(""); setEditingPublication(null); }, 1000);
      }
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm("Bu yayını silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (!error) setPublications(publications.filter((pub) => pub.id !== id));
  };

  // --- YETENEK İŞLEMLERİ ---
  const handleAddSkillItem = async (skillId: string, currentItems: string[]) => {
    const newItem = prompt("Yeni teknoloji ekleyin (Örn: Redis, Docker):");
    if (!newItem) return;
    const updatedItems = [...currentItems, newItem.trim()];
    const { error } = await supabase.from("skills").update({ items: updatedItems }).eq("id", skillId);
    if (!error) {
      setSkills(skills.map((s) => (s.id === skillId ? { ...s, items: updatedItems } : s)));
    }
  };

  const handleDeleteSkillItem = async (skillId: string, currentItems: string[], itemToDelete: string) => {
    const updatedItems = currentItems.filter((i) => i !== itemToDelete);
    const { error } = await supabase.from("skills").update({ items: updatedItems }).eq("id", skillId);
    if (!error) {
      setSkills(skills.map((s) => (s.id === skillId ? { ...s, items: updatedItems } : s)));
    }
  };

  const handleAddSkillCategory = async () => {
    const catTr = prompt("Kategori Adı (Türkçe) - Örn: Muhasebe & ERP:");
    if (!catTr) return;
    const catEn = prompt("Kategori Adı (İngilizce) - Örn: Accounting & ERP:") || catTr;
    const itemsRaw = prompt("Teknolojiler (Virgülle) - Örn: SAP, Logo, CANIAS, Excel:") || "";
    const itemsArray = itemsRaw.split(",").map((i) => i.trim()).filter(Boolean);

    const { data, error } = await supabase.from("skills").insert([
      {
        category_tr: catTr,
        category_en: catEn,
        items: itemsArray,
        sort_order: skills.length + 1,
      },
    ]).select();

    if (!error && data) {
      setSkills([...skills, data[0]]);
    }
  };

  const handleDeleteSkillCategory = async (skillId: string) => {
    if (!confirm("Bu yetenek grubunu ve içindeki tüm teknolojileri tamamen silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", skillId);
    if (!error) {
      setSkills(skills.filter((s) => s.id !== skillId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-100" />
      </div>
    );
  }

  // --- LOGIN EKRANI ---
  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center pb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-zinc-100" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-100">Yönetim Konsolu</h2>
            <p className="text-sm text-zinc-300 mt-1">Devam etmek için yönetici kimliğinizle giriş yapın.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-zinc-200 block mb-1.5">E-posta Adresi</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-base sm:text-sm focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-200 block mb-1.5">Şifre</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-base sm:text-sm focus:border-blue-500"
                required
              />
            </div>

            {loginError && <p className="text-sm text-red-400 font-semibold">{loginError}</p>}

            <Button type="submit" className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 h-12 font-bold text-sm sm:text-base rounded-xl mt-2">
              Giriş Yap
            </Button>

            <div className="text-center pt-4">
              <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* SOL MENÜ */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/90 shrink-0 p-4 sm:p-5 flex flex-col justify-between">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between md:justify-start gap-3 px-1 pt-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                <LayoutDashboard className="w-5 h-5 text-zinc-100" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-zinc-100 leading-tight">Admin Studio</h1>
                <span className="text-xs text-emerald-400 font-mono font-medium">● Canlı Supabase</span>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 text-xs h-8">
                <Link href="/" target="_blank">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-400 text-xs h-8">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => { setActiveTab("projects"); setEditingProject(null); setEditingExperience(null); setEditingPublication(null); }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 md:w-full ${
                activeTab === "projects" && !editingProject && !editingExperience && !editingPublication
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                <span>Projeler</span>
              </div>
              <Badge className="ml-2 text-xs border-zinc-700 bg-zinc-800 text-zinc-200">
                {projects.length}
              </Badge>
            </button>

            <button
              onClick={() => { setActiveTab("experience"); setEditingProject(null); setEditingExperience(null); setEditingPublication(null); }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 md:w-full ${
                activeTab === "experience" && !editingProject && !editingExperience && !editingPublication
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Deneyim & Eğitim</span>
              </div>
              <Badge className="ml-2 text-xs border-zinc-700 bg-zinc-800 text-zinc-200">
                {experiences.length}
              </Badge>
            </button>

            <button
              onClick={() => { setActiveTab("profile"); setEditingProject(null); setEditingExperience(null); setEditingPublication(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 md:w-full ${
                activeTab === "profile" && !editingProject && !editingExperience && !editingPublication
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Profil & SEO</span>
            </button>

            <button
              onClick={() => { setActiveTab("publications"); setEditingProject(null); setEditingExperience(null); setEditingPublication(null); }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 md:w-full ${
                activeTab === "publications" && !editingProject && !editingExperience && !editingPublication
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Yayınlar</span>
              </div>
              <Badge className="ml-2 text-xs border-zinc-700 bg-zinc-800 text-zinc-200">
                {publications.length}
              </Badge>
            </button>

            <button
              onClick={() => { setActiveTab("skills"); setEditingProject(null); setEditingExperience(null); setEditingPublication(null); }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 md:w-full ${
                activeTab === "skills" && !editingProject && !editingExperience && !editingPublication
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-600"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Yetenekler</span>
              </div>
              <Badge className="ml-2 text-xs border-zinc-700 bg-zinc-800 text-zinc-200">
                {skills.length}
              </Badge>
            </button>
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-zinc-800 space-y-2 mt-6">
          <Button asChild variant="outline" className="w-full justify-start gap-2 border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-800 text-sm h-10 font-medium">
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4" /> Canlı Siteyi Gör
            </Link>
          </Button>

          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2 text-zinc-400 hover:text-red-400 text-sm h-10 font-medium">
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-5xl overflow-y-auto">

        {/* 1. PROJE DÜZENLEME EKRANI (PC'DEN YÜKLEME VE GALERİ ÖNİZLEMESİ) */}
        {editingProject ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <Button onClick={() => setEditingProject(null)} variant="ghost" size="sm" className="gap-2 text-zinc-300 hover:text-white text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Projeler Listesine Dön
              </Button>
              <div className="flex items-center gap-3">
                {saveStatus && <span className="text-sm text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {saveStatus}</span>}
                <Button onClick={handleSaveProjectForm} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-bold text-sm h-11 px-5 rounded-xl shadow-md">
                  <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 sm:p-8 space-y-8 shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-100">{editingProject.id ? `Projeyi Düzenle: ${editingProject.title}` : "Yeni Proje Ekle"}</h2>
              <form onSubmit={handleSaveProjectForm} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Proje Başlığı</label>
                    <Input value={editingProject.title || ""} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Alt Başlık (TR)</label>
                    <Input value={editingProject.subtitle_tr || ""} onChange={(e) => setEditingProject({ ...editingProject, subtitle_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Alt Başlık (EN)</label>
                    <Input value={editingProject.subtitle_en || ""} onChange={(e) => setEditingProject({ ...editingProject, subtitle_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Açıklama (Türkçe)</label>
                    <Textarea rows={3} value={editingProject.description_tr || ""} onChange={(e) => setEditingProject({ ...editingProject, description_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Açıklama (İngilizce - EN)</label>
                    <Textarea rows={3} value={editingProject.description_en || ""} onChange={(e) => setEditingProject({ ...editingProject, description_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                </div>

                {/* GALERİ YÖNETİCİSİ & PC'DEN DOSYA YÜKLEME */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block">
                        Proje Görselleri Galerisi ({getProjectImages(editingProject.image_url).length})
                      </label>
                      <p className="text-xs text-zinc-400">Birden fazla görsel yükleyebilirsiniz; sitede dokunmatik galeri olarak açılacaktır.</p>
                    </div>

                    <label className="cursor-pointer shrink-0">
                      <span className="inline-flex items-center justify-center px-4 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm font-bold text-white transition-colors gap-2 shadow-md">
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? "Yükleniyor..." : "📁 PC'den Fotoğraf Seç"}
                      </span>
                      <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>

                  {/* Yüklenen Fotoğrafların Küçük Önizleme Kartları ve Sil Butonları */}
                  {getProjectImages(editingProject.image_url).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      {getProjectImages(editingProject.image_url).map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 aspect-video shadow-sm">
                          <img src={imgUrl} alt="Proje Ekranı" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageFromProject(imgIdx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md transition-all opacity-90 hover:opacity-100"
                            title="Bu görseli sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 border border-dashed border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
                      Henüz görsel yüklenmedi. Yukarıdaki butonla bilgisayarınızdan ekran görüntüleri ekleyebilirsiniz.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Teknolojiler (Virgülle)</label>
                    <Input value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(", ") : editingProject.technologies || ""} onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm font-mono" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Proje Linki</label>
                    <Input value={editingProject.link || ""} onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })} placeholder="https://..." className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Sistem Mimarisi (Türkçe)</label>
                    <Textarea rows={3} value={editingProject.architecture_tr || ""} onChange={(e) => setEditingProject({ ...editingProject, architecture_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Sistem Mimarisi (İngilizce - EN)</label>
                    <Textarea rows={3} value={editingProject.architecture_en || ""} onChange={(e) => setEditingProject({ ...editingProject, architecture_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Veri Güvenliği (Türkçe)</label>
                    <Textarea rows={3} value={editingProject.security_tr || ""} onChange={(e) => setEditingProject({ ...editingProject, security_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Veri Güvenliği (İngilizce - EN)</label>
                    <Textarea rows={3} value={editingProject.security_en || ""} onChange={(e) => setEditingProject({ ...editingProject, security_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                  <label className="flex items-center gap-2 text-sm text-zinc-200 cursor-pointer">
                    <input type="checkbox" checked={editingProject.is_live_app_store || false} onChange={(e) => setEditingProject({ ...editingProject, is_live_app_store: e.target.checked })} className="w-5 h-5 rounded border-zinc-700 bg-zinc-800" />
                    App Store Rozeti Ekle
                  </label>
                  <div className="flex items-center gap-3">
                    <Button type="button" onClick={() => setEditingProject(null)} variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-11 px-5">İptal</Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-xl">Kaydet</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : editingExperience ? (
          /* 2. DENEYİM / EĞİTİM DÜZENLEME EKRANI */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <Button onClick={() => setEditingExperience(null)} variant="ghost" size="sm" className="gap-2 text-zinc-300 hover:text-white text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Deneyim Listesine Dön
              </Button>
              <div className="flex items-center gap-3">
                {saveStatus && <span className="text-sm text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {saveStatus}</span>}
                <Button onClick={handleSaveExperienceForm} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-bold text-sm h-11 px-5 rounded-xl shadow-md">
                  <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-100">
                {editingExperience.id ? `Deneyimi Düzenle: ${editingExperience.title}` : "Yeni Deneyim / Eğitim Ekle"}
              </h2>

              <form onSubmit={handleSaveExperienceForm} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Şirket veya Üniversite Adı</label>
                    <Input value={editingExperience.title || ""} onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })} placeholder="Örn: Ainos veya Beykent Üniversitesi" className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Tür</label>
                    <select value={editingExperience.type || "work"} onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 h-12 rounded-md px-3 text-sm">
                      <option value="work">💼 İş / Staj</option>
                      <option value="education">🎓 Üniversite / Eğitim</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Dönem / Yıl</label>
                    <Input value={editingExperience.period || ""} onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })} placeholder="Örn: 2024 - 2025" className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Pozisyon / Derece (Türkçe)</label>
                    <Input value={editingExperience.subtitle_tr || ""} onChange={(e) => setEditingExperience({ ...editingExperience, subtitle_tr: e.target.value })} placeholder="Yazılım Stajyeri (ERP)" className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Pozisyon / Derece (İngilizce - EN)</label>
                    <Input value={editingExperience.subtitle_en || ""} onChange={(e) => setEditingExperience({ ...editingExperience, subtitle_en: e.target.value })} placeholder="ERP Software Intern" className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Açıklama (Türkçe)</label>
                    <Textarea rows={3} value={editingExperience.description_tr || ""} onChange={(e) => setEditingExperience({ ...editingExperience, description_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Açıklama (İngilizce - EN)</label>
                    <Textarea rows={3} value={editingExperience.description_en || ""} onChange={(e) => setEditingExperience({ ...editingExperience, description_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Kullanılan Teknolojiler (Virgülle)</label>
                  <Input value={Array.isArray(editingExperience.technologies) ? editingExperience.technologies.join(", ") : editingExperience.technologies || ""} onChange={(e) => setEditingExperience({ ...editingExperience, technologies: e.target.value })} placeholder="CANIAS ERP, SQL veya 3.26 GPA" className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm font-mono" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                  <Button type="button" onClick={() => setEditingExperience(null)} variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-11 px-5">İptal</Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-xl">Kaydet ve Tamamla</Button>
                </div>
              </form>
            </div>
          </div>
        ) : editingPublication ? (
          /* 3. YAYIN / MAKALE DÜZENLEME EKRANI */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <Button onClick={() => setEditingPublication(null)} variant="ghost" size="sm" className="gap-2 text-zinc-300 hover:text-white text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Yayınlar Listesine Dön
              </Button>
              <div className="flex items-center gap-3">
                {saveStatus && <span className="text-sm text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {saveStatus}</span>}
                <Button onClick={handleSavePublicationForm} className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold text-sm h-11 px-5 rounded-xl shadow-md">
                  <Save className="w-4 h-4" /> Yayını Kaydet
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-100">
                {editingPublication.id ? `Yayını Düzenle: ${editingPublication.title}` : "Yeni Yayın Ekle"}
              </h2>

              <form onSubmit={handleSavePublicationForm} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Makale Başlığı</label>
                    <Input value={editingPublication.title || ""} onChange={(e) => setEditingPublication({ ...editingPublication, title: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Yıl</label>
                    <Input value={editingPublication.year || ""} onChange={(e) => setEditingPublication({ ...editingPublication, year: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Dergi / Konferans Adı</label>
                    <Input value={editingPublication.journal || ""} onChange={(e) => setEditingPublication({ ...editingPublication, journal: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Tür TR</label>
                    <Input value={editingPublication.type_tr || ""} onChange={(e) => setEditingPublication({ ...editingPublication, type_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Tür EN</label>
                    <Input value={editingPublication.type_en || ""} onChange={(e) => setEditingPublication({ ...editingPublication, type_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Geniş Özet (Türkçe)</label>
                    <Textarea rows={3} value={editingPublication.description_tr || ""} onChange={(e) => setEditingPublication({ ...editingPublication, description_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Geniş Özet (İngilizce - EN)</label>
                    <Textarea rows={3} value={editingPublication.description_en || ""} onChange={(e) => setEditingPublication({ ...editingPublication, description_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" required />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-zinc-100 block mb-1.5">DOI / Makale Linki</label>
                  <Input value={editingPublication.link || ""} onChange={(e) => setEditingPublication({ ...editingPublication, link: e.target.value })} placeholder="https://..." className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                  <Button type="button" onClick={() => setEditingPublication(null)} variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-11 px-5">İptal</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 rounded-xl">Kaydet ve Tamamla</Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* NORMAL SEKME LİSTELERİ */
          <div>
            {/* PROJELER LİSTESİ */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Projeler Yönetimi</h2>
                    <p className="text-xs text-zinc-400 mt-1">Portfolyondaki projeleri sırala, düzenle veya yeni ekle.</p>
                  </div>
                  <Button onClick={() => setEditingProject({})} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-sm font-bold h-11 px-5 rounded-xl shadow-md">
                    <Plus className="w-4 h-4" /> Yeni Proje Ekle
                  </Button>
                </div>

                <div className="space-y-3">
                  {projects.map((p, index) => (
                    <div key={p.id} className="p-5 bg-zinc-900 border border-zinc-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">#{index + 1}</span>
                          <h4 className="font-bold text-base text-zinc-100">{p.title}</h4>
                          {p.is_live_app_store && <Badge className="bg-blue-950 text-blue-300 text-xs px-2 py-0.5 border-blue-800">App Store</Badge>}
                          {getProjectImages(p.image_url).length > 0 && (
                            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                              {getProjectImages(p.image_url).length} Görsel
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1">{p.description_tr}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden bg-zinc-800">
                          <button type="button" onClick={() => handleMoveItem("projects", projects, setProjects, index, "up")} disabled={index === 0} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↑</button>
                          <div className="w-[1px] h-4 bg-zinc-700" />
                          <button type="button" onClick={() => handleMoveItem("projects", projects, setProjects, index, "down")} disabled={index === projects.length - 1} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↓</button>
                        </div>

                        <Button onClick={() => setEditingProject({ ...p })} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm gap-2 h-9 px-4 rounded-xl border border-zinc-700">
                          <Edit3 className="w-4 h-4 text-blue-400" /> Düzenle
                        </Button>
                        <Button onClick={() => handleDeleteProject(p.id)} variant="ghost" size="sm" className="text-zinc-400 hover:text-red-400 h-9 w-9 p-0 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DENEYİM & EĞİTİM LİSTESİ */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Deneyim & Eğitim Yönetimi</h2>
                    <p className="text-xs text-zinc-400 mt-1">İş/staj geçmişinizi ve üniversite derecelerinizi ayrı ayrı yönetin.</p>
                  </div>
                  <Button onClick={() => setEditingExperience({ type: expSubTab })} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-sm font-bold h-11 px-5 rounded-xl shadow-md w-fit">
                    <Plus className="w-4 h-4" /> {expSubTab === "work" ? "Yeni İş / Staj Ekle" : "Yeni Eğitim Ekle"}
                  </Button>
                </div>

                <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800 w-fit">
                  <button type="button" onClick={() => setExpSubTab("work")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${expSubTab === "work" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" : "text-zinc-400 hover:text-zinc-200"}`}>
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>İş & Stajlar ({experiences.filter((e) => e.type === "work").length})</span>
                  </button>
                  <button type="button" onClick={() => setExpSubTab("education")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${expSubTab === "education" ? "bg-zinc-800 text-white shadow-sm border border-zinc-700" : "text-zinc-400 hover:text-zinc-200"}`}>
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Eğitim Dereceleri ({experiences.filter((e) => e.type === "education").length})</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {experiences
                    .filter((e) => e.type === expSubTab)
                    .map((exp, index, currentList) => (
                      <div key={exp.id} className="p-5 bg-zinc-900 border border-zinc-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">#{index + 1}</span>
                            <h4 className="font-bold text-base text-zinc-100">{exp.title}</h4>
                            <Badge className={exp.type === "work" ? "bg-blue-950 text-blue-300 border-blue-800 text-xs" : "bg-purple-950 text-purple-300 border-purple-800 text-xs"}>
                              {exp.type === "work" ? "💼 Staj / İş" : "🎓 Üniversite"}
                            </Badge>
                          </div>
                          <p className="text-xs text-blue-400 font-semibold mt-1">{exp.subtitle_tr} • {exp.period}</p>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{exp.description_tr}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden bg-zinc-800">
                            <button type="button" onClick={() => handleMoveItem("experience", experiences, setExperiences, experiences.findIndex((e) => e.id === exp.id), "up")} disabled={index === 0} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↑</button>
                            <div className="w-[1px] h-4 bg-zinc-700" />
                            <button type="button" onClick={() => handleMoveItem("experience", experiences, setExperiences, experiences.findIndex((e) => e.id === exp.id), "down")} disabled={index === currentList.length - 1} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↓</button>
                          </div>

                          <Button onClick={() => setEditingExperience({ ...exp })} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm gap-2 h-9 px-4 rounded-xl border border-zinc-700">
                            <Edit3 className="w-4 h-4 text-emerald-400" /> Düzenle
                          </Button>
                          <Button onClick={() => handleDeleteExperience(exp.id)} variant="ghost" size="sm" className="text-zinc-400 hover:text-red-400 h-9 w-9 p-0 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PROFİL & SEO (DİLE ÖZEL CV YÖNETİMİ) */}
            {activeTab === "profile" && profile && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Profil & Arama Motoru (SEO / AEO)</h2>
                    <p className="text-xs text-zinc-400 mt-1">Google/ChatGPT başlıklarını ve dile duyarlı CV linklerini yönetin.</p>
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 gap-2 text-sm font-bold h-11 px-5 rounded-xl">
                    <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                  </Button>
                </div>
{/* ÇALIŞMA / FIRSAT DURUMU YÖNETİMİ */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${profile.is_available ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                          Çalışma & Fırsat Durumu Rozeti
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">Sitenin en tepesindeki durum rozetini yönetin.</p>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.is_available ?? true}
                          onChange={(e) => setProfile({ ...profile, is_available: e.target.checked })}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900"
                        />
                        Aktif / Fırsatlara Açık (Yeşil Işık)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-blue-400 block mb-1">Durum Metni (Türkçe)</label>
                        <Input
                          value={profile.status_tr || ""}
                          onChange={(e) => setProfile({ ...profile, status_tr: e.target.value })}
                          placeholder="Örn: Yeni Projelere & Fırsatlara Açık"
                          className="bg-zinc-900 border-zinc-700 text-zinc-100 h-11 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-purple-400 block mb-1">Durum Metni (İngilizce - EN)</label>
                        <Input
                          value={profile.status_en || ""}
                          onChange={(e) => setProfile({ ...profile, status_en: e.target.value })}
                          placeholder="Örn: Open to New Roles & Projects"
                          className="bg-zinc-900 border-zinc-700 text-zinc-100 h-11 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                {saveStatus && (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-sm font-semibold rounded-xl">
                    {saveStatus}
                  </div>
                )}

                <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  {/* DİLE DUYARLI CV ALANI */}
                  <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-800/60 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-5 h-5 text-blue-400" />
                        <h4 className="font-bold text-sm text-blue-200">Özgeçmiş / CV Linki Yönetimi</h4>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-blue-300 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameCv}
                          onChange={(e) => setSameCv(e.target.checked)}
                          className="w-4 h-4 rounded border-blue-800 bg-zinc-900"
                        />
                        Türkçe ve İngilizce için aynı CV linkini kullan
                      </label>
                    </div>

                    {sameCv ? (
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Genel CV Linki (Google Docs /export?format=pdf)</label>
                        <Input
                          value={profile.cv_url_tr || profile.cv_url || ""}
                          onChange={(e) => setProfile({ ...profile, cv_url_tr: e.target.value, cv_url_en: e.target.value, cv_url: e.target.value })}
                          placeholder="https://docs.google.com/.../export?format=pdf"
                          className="bg-zinc-950 border-blue-900 text-zinc-100 h-11 text-sm font-mono"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-blue-400 block mb-1">Türkçe CV Linki (Google Docs PDF)</label>
                          <Input
                            value={profile.cv_url_tr || ""}
                            onChange={(e) => setProfile({ ...profile, cv_url_tr: e.target.value })}
                            placeholder="Türkçe CV Linki..."
                            className="bg-zinc-950 border-zinc-700 text-zinc-100 h-11 text-sm font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-purple-400 block mb-1">İngilizce CV Linki (Google Docs PDF)</label>
                          <Input
                            value={profile.cv_url_en || ""}
                            onChange={(e) => setProfile({ ...profile, cv_url_en: e.target.value })}
                            placeholder="İngilizce CV Linki..."
                            className="bg-zinc-950 border-zinc-700 text-zinc-100 h-11 text-sm font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Ad Soyad</label>
                      <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block mb-1.5">İletişim E-posta</label>
                      <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block mb-1.5">GitHub Linki</label>
                      <Input value={profile.github_url} onChange={(e) => setProfile({ ...profile, github_url: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block mb-1.5">LinkedIn Linki</label>
                      <Input value={profile.linkedin_url} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                    <div>
                      <label className="text-sm font-semibold text-blue-400 block mb-1.5">Unvan (Türkçe)</label>
                      <Input value={profile.title_tr} onChange={(e) => setProfile({ ...profile, title_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-purple-400 block mb-1.5">Unvan (İngilizce - EN)</label>
                      <Input value={profile.title_en} onChange={(e) => setProfile({ ...profile, title_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-blue-400 block mb-1.5">Hakkında (Türkçe)</label>
                      <Textarea rows={4} value={profile.about_tr} onChange={(e) => setProfile({ ...profile, about_tr: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-purple-400 block mb-1.5">Hakkında (İngilizce - EN)</label>
                      <Textarea rows={4} value={profile.about_en} onChange={(e) => setProfile({ ...profile, about_en: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800 space-y-4">
                    <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> SEO / AEO Ayarları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Meta Title</label>
                        <Input value={profile.meta_title} onChange={(e) => setProfile({ ...profile, meta_title: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Anahtar Kelimeler</label>
                        <Input value={Array.isArray(profile.keywords) ? profile.keywords.join(", ") : profile.keywords} onChange={(e) => setProfile({ ...profile, keywords: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 h-12 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-zinc-100 block mb-1.5">Meta Description</label>
                      <Textarea rows={2} value={profile.meta_description} onChange={(e) => setProfile({ ...profile, meta_description: e.target.value })} className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm p-3.5 leading-relaxed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* YAYINLAR LİSTESİ */}
            {activeTab === "publications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Yayınlar ve Araştırmalar</h2>
                    <p className="text-xs text-zinc-400 mt-1">Akademik makalelerinizi düzenleyin, sıralayın veya yeni ekleyin.</p>
                  </div>
                  <Button onClick={() => setEditingPublication({})} className="bg-blue-600 hover:bg-blue-500 text-white gap-2 text-sm font-bold h-11 px-5 rounded-xl shadow-md">
                    <Plus className="w-4 h-4" /> Yeni Yayın Ekle
                  </Button>
                </div>

                <div className="space-y-3">
                  {publications.map((pub, index) => (
                    <div key={pub.id} className="p-5 bg-zinc-900 border border-zinc-700/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">#{index + 1}</span>
                          <h4 className="font-bold text-base text-zinc-100">{pub.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 italic mt-0.5">{pub.journal} ({pub.year})</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden bg-zinc-800">
                          <button type="button" onClick={() => handleMoveItem("publications", publications, setPublications, index, "up")} disabled={index === 0} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↑</button>
                          <div className="w-[1px] h-4 bg-zinc-700" />
                          <button type="button" onClick={() => handleMoveItem("publications", publications, setPublications, index, "down")} disabled={index === publications.length - 1} className="px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-25 transition-colors text-sm">↓</button>
                        </div>

                        <Button onClick={() => setEditingPublication({ ...pub })} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm gap-2 h-9 px-4 rounded-xl border border-zinc-700">
                          <Edit3 className="w-4 h-4 text-blue-400" /> Düzenle
                        </Button>
                        <Button onClick={() => handleDeletePublication(pub.id)} variant="ghost" size="sm" className="text-zinc-400 hover:text-red-400 h-9 w-9 p-0 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YETENEKLER LİSTESİ */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Yetenek Grupları</h2>
                    <p className="text-xs text-zinc-400 mt-1">Kategorileri ve teknolojileri yönet.</p>
                  </div>
                  <Button onClick={handleAddSkillCategory} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-sm font-bold h-11 px-5 rounded-xl shadow-md">
                    <Plus className="w-4 h-4" /> Yeni Grup Ekle
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((s) => (
                    <div key={s.id} className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                          <h4 className="text-lg font-bold text-zinc-100">{s.category_tr}</h4>
                          <span className="text-xs text-zinc-400 font-mono">{s.category_en}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button onClick={() => handleAddSkillItem(s.id, s.items || [])} size="sm" variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs gap-1.5 h-8 font-semibold">
                            <Plus className="w-3.5 h-3.5" /> Ekle
                          </Button>
                          <Button onClick={() => handleDeleteSkillCategory(s.id)} variant="ghost" size="sm" className="text-zinc-500 hover:text-red-400 h-8 w-8 p-0" title="Grubu Komple Sil">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {s.items?.map((item: string) => (
                          <span key={item} className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono flex items-center gap-2">
                            {item}
                            <button onClick={() => handleDeleteSkillItem(s.id, s.items || [], item)} className="text-zinc-400 hover:text-red-400 text-base font-bold ml-1 transition-colors" title="Sil">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}