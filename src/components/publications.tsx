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
import { FileCheck2, GraduationCap, ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export function Publications({ publications, lang }: { publications: any[]; lang: "tr" | "en" }) {
  const [selectedPub, setSelectedPub] = useState<any>(null);

  return (
    <section id="publications" className="w-full py-12 scroll-mt-20">
      <div className="flex flex-col items-center text-center mb-12">
        <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 mb-3 px-3 py-1 gap-1.5 shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          {lang === "tr" ? "Ar-Ge & Literatür" : "R&D & Research"}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {lang === "tr" ? "Yayınlar ve Araştırmalar" : "Publications & Research"}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
          {lang === "tr"
            ? "Akademik özetleri ve metodolojik kapsamı incelemek için makalelerin üzerine tıklayın."
            : "Click on any paper to review abstract, scientific methodology, and citations."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publications.map((pub, index) => (
          <motion.div
            key={pub.id || pub.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card 
              onClick={() => setSelectedPub(pub)}
              className="h-full bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 flex flex-col justify-between group shadow-sm cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="outline" className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs gap-1">
                    <FileCheck2 className="w-3 h-3" />
                    {pub.type}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-500">
                    {pub.year}
                  </span>
                </div>

                <CardTitle className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{pub.title}</span>
                  <span className="text-xs font-normal text-zinc-400 flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                    {lang === "tr" ? "İncele" : "Review"}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </CardTitle>
                
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 italic mt-1">
                  {pub.journal}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {pub.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* MAKALE DETAY MODALI */}
      <Dialog open={!!selectedPub} onOpenChange={(open) => !open && setSelectedPub(null)}>
        {selectedPub && (
          <DialogContent className="max-w-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <DialogHeader className="text-left pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs">
                  {selectedPub.type}
                </Badge>
                <span className="text-xs font-mono text-zinc-500">{selectedPub.year}</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                {selectedPub.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-zinc-500 dark:text-zinc-400 italic mt-1">
                {selectedPub.journal}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  {lang === "tr" ? "Geniş Özet (Abstract)" : "Extended Abstract"}
                </h4>
                <p className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {selectedPub.description}
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-blue-700 dark:text-blue-300 text-xs">
                💡 {lang === "tr" 
                  ? "Bu araştırma, akademik hakem değerlendirmesinden (peer-reviewed) geçmiş ve uluslararası bilimsel indekslerde listelenmiştir." 
                  : "This paper is peer-reviewed and indexed in international scientific literature."}
              </div>

              {selectedPub.link && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <Button asChild size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-xl text-xs gap-1.5">
                    <a href={selectedPub.link} target="_blank" rel="noreferrer">
                      {lang === "tr" ? "Yayını Görüntüle / DOI" : "View Paper / DOI"}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}