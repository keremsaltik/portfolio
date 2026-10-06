"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Code2, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Building2, 
  Cloud, 
  Sparkles, 
  Wrench 
} from "lucide-react";
import { motion } from "framer-motion";

// AKILLI DİNAMİK İKON EŞLEYİCİ
function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();

  if (cat.includes("muhasebe") || cat.includes("erp") || cat.includes("finans") || cat.includes("accounting")) {
    return <Building2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
  }
  if (cat.includes("bulut") || cat.includes("cloud") || cat.includes("devops") || cat.includes("docker")) {
    return <Cloud className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
  }
  if (cat.includes("yapay") || cat.includes("ai") || cat.includes("ml") || cat.includes("zeka")) {
    return <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
  }
  if (cat.includes("web") || cat.includes("full-stack") || cat.includes("frontend")) {
    return <Code2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
  }
  if (cat.includes("veritabanı") || cat.includes("database") || cat.includes("kurumsal")) {
    return <Database className="w-5 h-5 text-teal-500 dark:text-teal-400" />;
  }
  if (cat.includes("güvenlik") || cat.includes("security") || cat.includes("sistem") || cat.includes("kripto")) {
    return <ShieldCheck className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
  }
  if (cat.includes("mobil") || cat.includes("ios") || cat.includes("swift") || cat.includes("flutter")) {
    return <Smartphone className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
  }
  return <Wrench className="w-5 h-5 text-zinc-400" />;
}

export function Skills({ skills, lang }: { skills: any[]; lang: "tr" | "en" }) {
  return (
    <section id="skills" className="w-full py-12 scroll-mt-20">
      <div className="flex flex-col items-center text-center mb-12">
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 mb-3 px-3 py-1 gap-1.5 shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-zinc-500" />
          {lang === "tr" ? "Teknik Yetkinlikler" : "Technical Arsenal"}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          {lang === "tr" ? "Mühendislik Cephaneliği" : "Engineering Arsenal"}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
          {lang === "tr" 
            ? "Fikirleri güvenli, ölçeklenebilir ve sağlam ürünlere dönüştürürken kullandığım modern teknolojiler."
            : "Core technologies applied across web architectures, systems engineering, cryptography, and databases."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skillGroup, index) => (
          <motion.div
            key={skillGroup.id || skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 hover:shadow-xl dark:hover:shadow-black/50 group shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 group-hover:scale-105 transition-transform duration-200">
                    {getCategoryIcon(skillGroup.category)}
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {skillGroup.category}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}