import type { Metadata } from "next";
import { Space_Grotesk, Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Webstability — Professionele websites en webshops op abonnement",
    template: "%s | Webstability",
  },
  description:
    "Van domein tot analytics. Gratis design, altijd support en transparante prijzen. Websites vanaf €65/maand, webshops vanaf €120/maand.",
  keywords: [
    "website laten maken",
    "webshop laten maken",
    "website abonnement",
    "webdevelopment",
    "Nederland",
  ],
  authors: [{ name: "Webstability" }],
  creator: "Webstability",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://webstability.nl",
    siteName: "Webstability",
    title: "Webstability — Professionele websites en webshops op abonnement",
    description:
      "Van domein tot analytics. Gratis design, altijd support en transparante prijzen.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webstability — Professionele websites en webshops op abonnement",
    description:
      "Van domein tot analytics. Gratis design, altijd support en transparante prijzen.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${spaceGrotesk.variable} ${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
