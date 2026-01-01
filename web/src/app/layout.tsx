import type { Metadata } from "next";
import { Nunito, Kosugi_Maru } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const kosugiMaru = Kosugi_Maru({
  variable: "--font-kosugi",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "キッズお出かけ情報 | 子どもと楽しむイベント・おでかけスポット",
  description: "週末のお出かけ先を探そう！キッズ向けイベント、体験教室、公園、ワークショップなど、お子様と一緒に楽しめるスポット情報が満載です。",
  keywords: ["キッズ", "お出かけ", "イベント", "子ども", "親子", "週末", "体験"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${nunito.variable} ${kosugiMaru.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
