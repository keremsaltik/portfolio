"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Home, 
  FolderGit2, 
  BookOpen, 
  Layers, 
  Mail, 
  Sun, 
  Moon,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2" />
    </svg>
  );
}

interface FloatingDockProps {
  lang?: "tr" | "en";
  onToggleLang?: () => void;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export function FloatingDock({
  lang = "tr",
  onToggleLang,
  githubUrl = "https://github.com/keremsaltik",
  linkedinUrl = "https://www.linkedin.com/in/kerem-saltik/",
  email = "keremsaltikbusiness@gmail.com",
}: FloatingDockProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: lang === "tr" ? "Giriş" : "Home", href: "#hero", icon: Home },
    { name: lang === "tr" ? "Projeler" : "Projects", href: "#projects", icon: FolderGit2 },
    { name: lang === "tr" ? "Yayınlar" : "Research", href: "#publications", icon: BookOpen },
    { name: lang === "tr" ? "Yetenekler" : "Skills", href: "#skills", icon: Layers },
  ];

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-auto flex items-center gap-0.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-400/20 dark:shadow-black/60 max-w-[95vw] overflow-x-auto scrollbar-none"
      >
        {/* Sayfa içi bölümler */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="p-2 sm:p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-200"
              title={item.name}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          );
        })}

        <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* GitHub */}
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 sm:p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-200"
          title="GitHub"
        >
          <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 sm:p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-200"
          title="LinkedIn"
        >
          <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>

        {/* Mail */}
        <a
          href={`mailto:${email}`}
          className="p-2 sm:p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-200"
          title="E-posta Gönder"
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>

        <div className="w-[1px] h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Dil Değiştirici Buton (TR / EN) */}
        {onToggleLang && (
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-1 border border-zinc-200 dark:border-zinc-800"
            title="Dili Değiştir"
          >
            <Globe className="w-3 h-3 text-zinc-500" />
            <span>{lang.toUpperCase()}</span>
          </button>
        )}

        {/* Tema Değiştirici Buton */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-200 relative overflow-hidden"
            title="Temayı Değiştir"
          >
            <motion.div
              key={resolvedTheme}
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
              )}
            </motion.div>
          </button>
        )}
      </motion.div>
    </div>
  );
}