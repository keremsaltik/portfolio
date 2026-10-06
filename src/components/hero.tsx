"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, Send, FileDown } from "lucide-react";
import { motion } from "framer-motion";

export function Hero({ profile, lang }: { profile: any; lang: "tr" | "en" }) {
  if (!profile) return null;

  return (
    <section id="hero" className="w-full pt-20 pb-12 flex flex-col items-center text-center">
      {/* SADECE AKTİFSE GÖRÜNÜR, KAPALIYSA ROZET KOMPLE GİZLENİR */}
      {profile.isAvailable && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Badge variant="outline" className="px-3.5 py-1 border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 backdrop-blur-sm gap-2 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {profile.statusText}
          </Badge>
        </motion.div>
      )}

      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-4xl">
        {profile.name}
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-3 text-lg sm:text-2xl font-medium text-zinc-600 dark:text-zinc-400">
        {profile.title}
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-6 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
        {profile.about}
      </motion.p>

      {/* Aksiyon Butonları (Projeler + CV İndir + İletişim) */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-full bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 px-6 font-medium shadow-sm h-11">
          <a href="#projects">
            {lang === "tr" ? "Projeleri İncele" : "Explore Projects"}
            <ArrowDownRight className="w-4 h-4 ml-1.5" />
          </a>
        </Button>

        {/* CV İNDİR BUTONU */}
        {profile.cv_url && (
          <Button asChild variant="outline" className="rounded-full border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-5 font-medium shadow-sm h-11 gap-2">
            <a href={profile.cv_url} target="_blank" rel="noreferrer">
              <FileDown className="w-4 h-4 text-blue-500" />
              {lang === "tr" ? "Özgeçmiş İndir (PDF)" : "Download Resume (PDF)"}
            </a>
          </Button>
        )}

        <Button asChild variant="ghost" className="rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-5 h-11">
          <a href={`mailto:${profile.email}`}>
            {lang === "tr" ? "İletişime Geç" : "Get in Touch"}
            <Send className="w-3.5 h-3.5 ml-2" />
          </a>
        </Button>
      </motion.div>
    </section>
  );
}