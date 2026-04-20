import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Crimson_Text } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0c1f28',
}

export const metadata: Metadata = {
  title: "Backstories — Digital Game Engine",
  description: "A real-time multiplayer digital engine for the Backstories cooperative narrative card game. Drag and drop action cards onto panoramas to interact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${crimson.variable} antialiased`}
    >
      <body className="flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
