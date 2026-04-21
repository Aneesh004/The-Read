import type { Metadata } from "next";
import { Playfair_Display, Fraunces, Source_Serif_4, DM_Sans, Literata } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const literata = Literata({ subsets: ["latin"], variable: "--font-literata" });

export const metadata: Metadata = {
  title: "Reading & Rambles",
  description: "The Ultimate Social Book Platform. Where Every Page Turns Into a Conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${fraunces.variable} ${sourceSerif.variable} ${dmSans.variable} ${literata.variable}`}>
      <body className="antialiased selection:bg-accent-gold/30 selection:text-text-primary overflow-x-hidden min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
