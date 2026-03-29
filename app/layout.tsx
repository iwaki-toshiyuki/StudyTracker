import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyTracker",
  description: "学習時間を記録・可視化するアプリ",
  openGraph: {
    title: "StudyTracker",
    description: "学習時間を記録・可視化するアプリ",
    url: "https://study-tracker-ten-pi.vercel.app/",
    siteName: "StudyTracker",
    images: [
      {
        url: "/ogp.png", // publicフォルダに置く
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
