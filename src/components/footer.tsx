"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail, ArrowUpRight } from "lucide-react";

export function Footer({ email, name, lang }: { email: string; name: string; lang: "tr" | "en" }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="w-full pt-16 pb-12 border-t border-zinc-200 dark:border-zinc-900 scroll-mt-20">
      <div className="flex flex-col items-center text-center">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
          {lang === "tr" ? "Yeni Fırsatlar & İletişim" : "Opportunities & Inquiries"}
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-2xl leading-tight">
          {lang === "tr" ? (
            <>
              Birlikte çalışalım mı? <br />
              <span className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Hemen konuşalım.
              </span>
            </>
          ) : (
            <>
              Let's build together. <br />
              <span className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Get in touch.
              </span>
            </>
          )}
        </h2>

        <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-md">
          {lang === "tr"
            ? "İster full-stack bir web çözümü, ister kurumsal bir sistem veya akademik bir çalışma olsun; her zaman bir e-posta uzağındayım."
            : "Available for engineering roles, technical architecture, and collaborative research initiatives."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 p-2 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-zinc-700 dark:text-zinc-300">
            <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span>{email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={copyEmail}
              size="sm"
              variant="secondary"
              className="rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {lang === "tr" ? "Kopyalandı!" : "Copied!"}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {lang === "tr" ? "Kopyala" : "Copy"}
                </>
              )}
            </Button>

            <Button
              asChild
              size="sm"
              className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-medium text-xs gap-1"
            >
              <a href={`mailto:${email}`}>
                {lang === "tr" ? "Mail Aç" : "Send Email"}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-16 w-full pt-8 border-t border-zinc-200 dark:border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            <span>İstanbul Beykent Üniversitesi (Lisans) • 3.26 GPA</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}