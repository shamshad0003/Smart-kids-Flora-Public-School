import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/admin/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Kids Flora Public School | Excellence in Education",
    template: "%s | Smart Kids Flora Public School",
  },
  description: "A leading educational institution providing world-class learning, holistic development, and a nurturing environment for the leaders of tomorrow.",
  keywords: ["school", "education", "flora public school", "smart kids", "best school", "learning", "academic excellence"],
  authors: [{ name: "Smart Kids Flora Public School" }],
  creator: "Smart Kids Flora Public School",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://florapublic.edu",
    siteName: "Smart Kids Flora Public School",
    title: "Smart Kids Flora Public School | Excellence in Education",
    description: "Empowering students through innovative learning and holistic development.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Kids Flora Public School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Kids Flora Public School",
    description: "Empowering students through innovative learning and holistic development.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
