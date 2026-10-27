import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "./lib/LangContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lestroiscoins.ch";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Les Trois Coins SARL — Débarras, Nettoyage & Services à domicile à Lausanne",
    template: "%s | Les Trois Coins SARL — Lausanne",
  },
  description:
    "Les Trois Coins SARL : débarras d'appartement, nettoyage fin de bail, vide maison, menuiserie et bricolage à Lausanne et dans le canton de Vaud. Devis gratuit sous 24h. ☎ +41 76 823 89 10",
  keywords: [
    // ── Débarras (top competitor terms in Vaud) ──
    "débarras Lausanne",
    "débarras appartement Lausanne",
    "débarras maison Lausanne",
    "débarras cave Lausanne",
    "débarras Vaud",
    "vide maison Lausanne",
    "évacuation encombrants Lausanne",
    "débarras après décès Lausanne",
    "débarras succession Vaud",
    "débarrasseur professionnel Lausanne",
    // ── Nettoyage ──
    "nettoyage Lausanne",
    "nettoyage professionnel Lausanne",
    "entreprise nettoyage Lausanne",
    "nettoyage fin de bail Lausanne",
    "nettoyage fin de bail Vaud",
    "nettoyage appartement Lausanne",
    "nettoyage après travaux Lausanne",
    "nettoyage bureau Lausanne",
    "entreprise nettoyage Vaud",
    // ── Menuiserie / Bricolage / Aménagement ──
    "menuiserie Lausanne",
    "menuiserie intérieure Lausanne",
    "bricolage Lausanne",
    "petits travaux Lausanne",
    "aménagement intérieur Lausanne",
    "rénovation appartement Lausanne",
    "montage meubles Lausanne",
    // ── Multiservices / Local ──
    "multiservices Lausanne",
    "services à domicile Lausanne",
    "services à domicile Vaud",
    "entreprise multiservices Lausanne",
    "devis gratuit Lausanne",
    "intervention rapide Lausanne",
    "Les Trois Coins SARL",
    "Lausanne",
    "canton de Vaud",
    "Renens",
    "Prilly",
    "Pully",
    "Morges",
    "Nyon",
  ],
  authors: [{ name: "Les Trois Coins SARL" }],
  creator: "Les Trois Coins SARL",
  publisher: "Les Trois Coins SARL",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: SITE_URL,
    siteName: "Les Trois Coins SARL",
    title: "Les Trois Coins SARL — Débarras & Nettoyage à Lausanne",
    description:
      "Débarras d'appartement, nettoyage fin de bail, vide maison, menuiserie et bricolage à Lausanne et dans le canton de Vaud. Devis gratuit sous 24h.",
    images: [
      {
        url: "/assets/slider/nettoyage.webp",
        width: 1200,
        height: 630,
        alt: "Les Trois Coins SARL — Services à domicile Lausanne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Les Trois Coins SARL — Débarras & Nettoyage à Lausanne",
    description:
      "Débarras appartement, nettoyage fin de bail, vide maison à Lausanne et Vaud. Devis gratuit sous 24h.",
    images: ["/assets/slider/nettoyage.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE_URL,
  name: "Les Trois Coins SARL",
  description:
    "Débarras, nettoyage, aménagement, menuiserie et bricolage à Lausanne et dans le canton de Vaud.",
  url: SITE_URL,
  telephone: "+41768238910",
  email: "Lestroiscoins@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenue de la Chablière 21",
    addressLocality: "Lausanne",
    postalCode: "1004",
    addressCountry: "CH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 46.5197,
    longitude: 6.6323,
  },
  areaServed: [
    { "@type": "City", name: "Lausanne" },
    { "@type": "City", name: "Renens" },
    { "@type": "City", name: "Prilly" },
    { "@type": "City", name: "Pully" },
    { "@type": "City", name: "Morges" },
    { "@type": "City", name: "Nyon" },
    { "@type": "City", name: "Vevey" },
    { "@type": "City", name: "Montreux" },
    { "@type": "City", name: "Yverdon-les-Bains" },
    { "@type": "State", name: "Canton de Vaud" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services Les Trois Coins SARL",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Débarras d'appartement et maison" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nettoyage professionnel et fin de bail" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aménagement intérieur" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Menuiserie intérieure" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bricolage et petits travaux" } },
    ],
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    opens: "08:00",
    closes: "20:00",
  },
  priceRange: "$$",
  image: `${SITE_URL}/assets/logo/logo-les-trois-coins.png`,
  sameAs: [`https://wa.me/41768238910`],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased grain">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
