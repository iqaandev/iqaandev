import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "القرآن الكريم - Quran.com",
  description: "القرآن الكريم مترجم إلى العديد من اللغات في واجهة بسيطة وسهلة",
  keywords: ["القرآن", "Quran", "Islam", "قرآن", "إسلام"],
  authors: [{ name: "Quran.com" }],
  icons: {
    icon: "https://quran.com/images/logo/Logo@192x192.png",
  },
  openGraph: {
    title: "القرآن الكريم - Quran.com",
    description: "القرآن الكريم مترجم إلى العديد من اللغات في واجهة بسيطة وسهلة",
    siteName: "Quran.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
