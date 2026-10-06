export const DATA = {
  name: "Kerem SALTIK",
  initials: "KS",
  title: "Software Engineer | Full-Stack & Systems",
  location: "İstanbul, Türkiye",
  about:
    "Güvenli, yüksek performanslı web sistemleri ve kurumsal çözümler geliştiren yazılım mühendisi. Kriptografik veri güvenliği, full-stack mimariler ve kurumsal ERP süreçleri üzerine odaklanıyorum. Ayrıca akademik düzeyde yapay zeka ve şifreleme teknolojileri üzerine araştırmalar yürütüyorum.",
  contact: {
    email: "keremsaltikbusiness@gmail.com",
    tel: "+90 535 398 77 93",
    social: {
      github: {
        name: "GitHub",
        url: "https://github.com/keremsaltik",
      },
      linkedin: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/kerem-saltik/",
      },
    },
  },
  skills: [
    {
      category: "Full-Stack & Web",
      items: ["Next.js", "React", "TypeScript", "Node.js", "RESTful API", "Tailwind CSS"],
    },
    {
      category: "Veritabanı & Kurumsal Sistemler",
      items: ["PostgreSQL", "MongoDB", "SQL", "CANIAS ERP", "TROIA IDE"],
    },
    {
      category: "Sistem, Güvenlik & Mimari",
      items: ["Kriptografi (AES-256)", "JWT / Auth", "Bcrypt", "Git / GitHub", "Docker"],
    },
    {
      category: "Mobil & Diğer",
      items: ["Swift", "SwiftUI", "UIKit", "SwiftData", "Core ML", "Vapor"],
    },
  ],
  projects: [
    {
      title: "Docura - Smart Archive",
      subtitle: "App Store'da Yayında",
      isLiveAppStore: true,
      description:
        "Cihaz içi VisionKit OCR ve özel Core ML modelleriyle çalışan, CryptoKit (AES-256) ve Keychain ile uçtan uca şifreli yerel belge yönetim uygulaması. Güvenli Share Extension entegrasyonu içerir.",
      technologies: ["SwiftUI", "SwiftData", "Core ML", "CryptoKit (AES-256)", "VisionKit"],
      link: "https://apps.apple.com", // Buraya kendi App Store linkini yapıştırırsın
      featured: true,
    },
    {
      title: "Full-Stack Web & Kurumsal Çözüm",
      subtitle: "Aktif Geliştirme",
      isLiveAppStore: false,
      description:
        "Modern web teknolojileriyle geliştirilen; rol tabanlı yetkilendirme, veri akışı ve analitik tabloları barındıran tam yığın web uygulaması.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Prisma/Drizzle"],
      link: "https://github.com/keremsaltik",
      featured: true,
    },
    {
      title: "TodyApp - End-to-End Swift Platform",
      subtitle: "Full-Stack Swift Mimarisi",
      isLiveAppStore: false,
      description:
        "Backend tarafında Swift Vapor ve Fluent ORM, veritabanında PostgreSQL, mobil arayüzde SwiftUI kullanılarak uçtan uca geliştirilmiş full-stack sistem. JWT ve Bcrypt tabanlı oturum altyapısı.",
      technologies: ["Vapor (Backend)", "SwiftUI", "PostgreSQL", "Fluent ORM", "JWT"],
      link: "https://github.com/keremsaltik",
      featured: false,
    },
  ],
  publications: [
    {
      title: "Encryption from Past to Future",
      journal: "International Journal of Applied Physics",
      year: "2025 (Volume 10)",
      description:
        "Şifreleme yöntemlerinin tarihsel gelişimi, simetrik ve asimetrik şifreleme teknikleri ile kuantum kriptografisinin geleceğini analiz eden araştırma.",
      type: "Akademik Makale",
    },
    {
      title: "Smell Therapy with Augmented Reality",
      journal: "WSEAS Transactions on Computers",
      year: "2025 (Volume 24)",
      description:
        "Artırılmış gerçeklik (AR) ve dijital koku teknolojilerinin entegrasyonuyla TSSB ve anksiyete tedavisinde kişiselleştirilmiş, çok duyulu dijital terapi modeli.",
      type: "Akademik Makale",
    },
  ],
  education: [
    {
      school: "İstanbul Beykent Üniversitesi",
      degree: "Yazılım Mühendisliği (Lisans)",
      date: "2022 – 2025",
      gpa: "3.26 / 4.00",
    },
    {
      school: "İstanbul Haliç Üniversitesi",
      degree: "Bilgisayar Programcılığı (Ön Lisans)",
      date: "2020 – 2022",
      gpa: "3.41 / 4.00",
    },
  ],
};