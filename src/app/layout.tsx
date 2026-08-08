import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Kopi Tenang Jiwa — Seduh perlahan, nikmati detik ini.",
  description: "Coffee shop minimalis dengan nuansa menenangkan di Bandung. Pesan kopi susu, matcha, croissant, dan pastry premium. Buka 24 jam setiap hari.",
  keywords: ["Kopi Tenang Jiwa", "Coffee Shop", "Bandung", "Kopi Susu", "Matcha", "Croissant", "Kopi Bandung", "Cafe 24 Jam"],
  robots: "index, follow",
  openGraph: {
    title: "Kopi Tenang Jiwa — Seduh perlahan, nikmati detik ini.",
    description: "Coffee shop minimalis dengan nuansa menenangkan di Bandung. Pesan kopi susu, matcha, croissant, dan pastry premium. Buka 24 jam.",
    type: "website",
    locale: "id_ID",
    siteName: "Kopi Tenang Jiwa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
