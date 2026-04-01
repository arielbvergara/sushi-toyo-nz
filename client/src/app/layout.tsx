import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Sushi Toyo — Authentic Japanese Cuisine, Takapuna Auckland",
  description: "Handcrafted sushi & donburi on Auckland's North Shore. Fresh flavours, tradition in every bite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased pt-16" suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
