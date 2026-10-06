"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles, ExternalLink, Cpu, Shield, Layers, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function Projects({ projects, lang }: { projects: any[]; lang: "tr" | "en" }) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Görselleri diziye çevirme yardımcısı
  const getImages = (url: string | undefined): string[] => {
    if (!url) return [];
    return url.split(",").map((u) => u.trim()).filter(Boolean);
  };

  const openProjectModal = (project: any) => {
    setSelectedProject(project);
    setActiveImageIndex(0); // Her açılışta 1. fotoğraftan başla
  };

  return (
    <section id="projects" className="w-full py-12 scroll-mt-20">
      <div className="flex flex-col items-center text-center mb-12">
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 mb-3 px-3 py-1 shadow-sm">
          {lang === "tr" ? "Seçilmiş İşler & Mimariler" : "Featured Works & Architecture"}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {lang === "tr" ? "Öne Çıkan Projeler" : "Featured Projects"}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
          {lang === "tr"
            ? "Detayları, mimari kararları ve ekranları incelemek için kartların üzerine tıklayın."
            : "Click on any project to explore engineering architecture, security, and live previews."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id || project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={project.isLiveAppStore ? "md:col-span-2" : ""}
          >
            <Card 
              onClick={() => openProjectModal(project)}
              className="h-full bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 flex flex-col justify-between group overflow-hidden relative shadow-sm cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
                    {project.subtitle}
                  </span>

                  {project.isLiveAppStore ? (
                    <Badge className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 gap-1.5 px-2.5 py-0.5 text-xs font-medium">
                      <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                      {lang === "tr" ? "App Store'da Canlı" : "Live on App Store"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 text-xs">
                      Production / Git
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <span className="text-xs font-normal text-zinc-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    {lang === "tr" ? "Detaylar" : "Details"}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-grow">
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                  {project.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* İNTERAKTİF APPLE GALERİLİ DETAY MODALI */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (() => {
          const images = getImages(selectedProject.imageUrl);

          return (
            <DialogContent className="max-w-3xl w-[92vw] sm:w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 sm:p-10 max-h-[88vh] overflow-y-auto rounded-3xl shadow-2xl space-y-6">
              
              <DialogHeader className="text-left space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs">
                    {selectedProject.subtitle}
                  </Badge>
                  {selectedProject.isLiveAppStore && (
                    <Badge className="bg-blue-600 text-white text-[11px] gap-1 px-2.5 py-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> App Store
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed pt-1">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* İNTERAKTİF FOTOĞRAF GALERİSİ (APPLE CAROUSEL) */}
              {/* İNTERAKTİF, KORUMALI VE DOKUNMATİK FOTOĞRAF GALERİSİ */}
              {images.length > 0 ? (
                <div className="space-y-3 select-none">
                  {/* Ana Büyük Görsel Alanı (Korumalı & Parmakla Kaydırılabilir) */}
                  <div 
                    className="relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex items-center justify-center min-h-[220px] sm:min-h-[340px] shadow-lg group select-none touch-pan-x"
                    onContextMenu={(e) => e.preventDefault()} // Sağ tıkı engeller
                  >
                    {/* Şeffaf Güvenlik Katmanı: Tıklamalara izin verir ama sağ tıkla resmi kaydettirmez */}
                    <div 
                      className="absolute inset-0 z-10 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                    />

                    <img
                      src={images[activeImageIndex]}
                      alt={`${selectedProject.title} Ekran ${activeImageIndex + 1}`}
                      draggable="false" // Sürükleyip masaüstüne bırakmayı engeller
                      className="w-full h-auto max-h-[380px] object-contain transition-all duration-300 pointer-events-none select-none [-webkit-touch-callout:none]" // Mobilde basılı tutunca kaydet menüsünü engeller
                    />

                    {/* Sağ / Sol Okları */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100 shadow-md"
                          title="Önceki Görsel"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100 shadow-md"
                          title="Sonraki Görsel"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <span className="absolute bottom-3 right-3 z-20 text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/75 text-zinc-200 border border-white/10 backdrop-blur-sm">
                          {activeImageIndex + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Alttaki Küçük Önizleme Şeridi */}
                  {images.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin select-none" onContextMenu={(e) => e.preventDefault()}>
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all select-none ${
                            activeImageIndex === idx
                              ? "border-blue-500 scale-105 shadow-md"
                              : "border-zinc-300 dark:border-zinc-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Önizleme" draggable="false" className="w-full h-full object-cover pointer-events-none select-none [-webkit-touch-callout:none]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Görsel Yoksa Şık Placeholder */
                <div className="w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800/60 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
                  <div className="p-3 rounded-2xl bg-white/70 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-sm mb-2.5">
                    <ImageIcon className="w-7 h-7 text-zinc-500" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {selectedProject.isLiveAppStore ? "iOS Native UI & Ekran Görüntüleri" : "Web Dashboard & Mimari Akış"}
                  </p>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm">
                    (Admin panelinden fotoğraf yüklediğinde burada interaktif galeri belirecektir)
                  </span>
                </div>
              )}

              {/* Teknik Mimari & Güvenlik Kartları */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  {lang === "tr" ? "Teknik Mimari & Güvenlik Kararları" : "Architecture & Security Decisions"}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 leading-relaxed shadow-sm">
                    <span className="font-bold block text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      {lang === "tr" ? "Veri Güvenliği" : "Data Security"}
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {selectedProject.security || (lang === "tr" ? "CryptoKit (AES-256) şifreleme ve Keychain ile biyometrik (FaceID) koruma." : "CryptoKit (AES-256) encryption and Keychain biometric protection.")}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 leading-relaxed shadow-sm">
                    <span className="font-bold block text-zinc-900 dark:text-zinc-100 mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      {lang === "tr" ? "Sistem Mimarisi" : "System Architecture"}
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {selectedProject.architecture || (lang === "tr" ? "VisionKit OCR ve Core ML model pipeline'ı ile çevrimdışı işlem altyapısı." : "VisionKit OCR and Core ML on-device machine learning pipeline.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teknolojiler */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  {lang === "tr" ? "Kullanılan Teknolojiler" : "Tech Stack"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies?.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Aksiyon Butonu */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-2xl text-xs sm:text-sm gap-2 shadow-md">
                  <a href={selectedProject.link} target="_blank" rel="noreferrer">
                    {selectedProject.isLiveAppStore 
                      ? (lang === "tr" ? "App Store'da İncele" : "View on App Store")
                      : (lang === "tr" ? "Projeyi İncele / Git" : "View Project / Source")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
    </section>
  );
}