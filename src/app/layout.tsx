import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/structured-data";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// DİNAMİK METADATA (Admin panelinde ne yazdıysan Google onu görür)
export async function generateMetadata(): Promise<Metadata> {
  const { data: profile } = await supabase.from("profile").select("*").maybeSingle();

  const title = profile?.meta_title || "Kerem SALTIK | Software Engineer";
  const description = profile?.meta_description || "Software Engineer specializing in Full-Stack, Enterprise Systems & Security.";
  const keywords = profile?.keywords || ["Kerem Saltık", "Software Engineer", "Next.js", "PostgreSQL"];

  return {
    metadataBase: new URL("https://keremsaltik.dev"),
    title: {
      default: title,
      template: `%s | ${profile?.name || "Kerem SALTIK"}`,
    },
    description: description,
    keywords: keywords,
    alternates: {
      canonical: "https://keremsaltik.dev",
      languages: {
        "tr-TR": "https://keremsaltik.dev/?lang=tr",
        "en-US": "https://keremsaltik.dev/?lang=en",
      },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: "https://keremsaltik.dev",
      title: title,
      description: description,
      siteName: `${profile?.name || "Kerem Saltık"} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sunucu tarafında en güncel verileri çekip doğrudan Yapay Zeka Şemasına (AEO/GEO) veriyoruz
  const { data: profile } = await supabase.from("profile").select("*").maybeSingle();
  const { data: publications } = await supabase.from("publications").select("*");
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: skills } = await supabase.from("skills").select("*");

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Admin panelinden beslenen %100 Dinamik Yapay Zeka Şeması */}
        <StructuredData 
          profile={profile}
          publications={publications || []}
          projects={projects || []}
          skills={skills || []}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-zinc-800 selection:text-zinc-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}