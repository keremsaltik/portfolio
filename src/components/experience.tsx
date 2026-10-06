"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export function Experience({ items, lang }: { items: any[]; lang: "tr" | "en" }) {
  const [filter, setFilter] = useState<"work" | "education">("work");

  if (!items || items.length === 0) return null;

  const filteredItems = items.filter((item) => item.type === filter);

  return (
    <section id="experience" className="w-full py-12 scroll-mt-20">
      <div className="flex flex-col items-center text-center mb-8">
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 mb-3 px-3.5 py-1 shadow-sm">
          {lang === "tr" ? "Kariyer & Geçmiş" : "Career & Background"}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          {lang === "tr" ? "Deneyim ve Eğitim" : "Experience & Education"}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
          {lang === "tr"
            ? "Kurumsal ERP süreçlerinden tam yığın mobil sistemlere ve mühendislik eğitimime uzanan yolculuk."
            : "Professional engineering journey across enterprise ERP environments, full-stack systems, and academia."}
        </p>

        {/* İKİ ŞIK GEÇİŞ BUTONU */}
        <div className="mt-8 flex items-center p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <button
            onClick={() => setFilter("work")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === "work"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-md border border-zinc-200/60 dark:border-zinc-700"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>{lang === "tr" ? "İş & Stajlar" : "Experience & Internships"}</span>
          </button>

          <button
            onClick={() => setFilter("education")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === "education"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-md border border-zinc-200/60 dark:border-zinc-700"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>{lang === "tr" ? "Eğitim Dereceleri" : "Education"}</span>
          </button>
        </div>
      </div>

      {/* Dikey Zaman Çizelgesi */}
      <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 sm:ml-8 space-y-8 mt-10">
        {filteredItems.map((item, index) => {
          const isWork = item.type === "work";

          return (
            <motion.div
              key={item.id || item.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-6 sm:pl-8 group"
            >
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all shadow-sm">
                {isWork ? (
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                )}
              </div>

              <Card className="p-5 sm:p-6 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.period}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {item.subtitle}
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                    {item.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}