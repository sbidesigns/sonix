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
  title: "Sonix AI - Professional Music Generator",
  description: "AI-powered music generation with full song vocals, instrumental tracks, and professional-grade controls. Generate music in seconds.",
  keywords: ["Sonix", "AI Music", "Music Generator", "Vocals", "Instrumental", "Audio AI"],
  authors: [{ name: "Sonix AI" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Sonix AI - Professional Music Generator",
    description: "Generate full songs with vocals or instrumental tracks using AI",
    siteName: "Sonix AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonix AI - Professional Music Generator",
    description: "AI-powered music generation with vocals & instrumental",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
