import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { HighlightProvider } from "@/context/HighlightContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { JsonLd } from "@/components/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B5FA5",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://atlante.atliteg.org'),
  title: {
    default: "AtLiTeG - Atlante Gastronomico Italiano",
    template: "%s | AtLiTeG"
  },
  description: "Esplora l'evoluzione della lingua gastronomica italiana dal Medioevo all'Unità. Mappe interattive, lemmario storico e visualizzazioni geolinguistiche del progetto VoSLIG.",
  keywords: [
    "AtLiTeG", "Atlante Gastronomico", "Lingua Italiana", "Storia della Gastronomia", 
    "VoSLIG", "Geolinguistica", "Mappe Storiche", "Vocabolario Storico", 
    "Cucina Medievale", "Cucina Rinascimentale"
  ],
  authors: [
    { name: "Università per Stranieri di Siena" },
    { name: "Labgeo Giuseppe Caraci" }
  ],
  creator: "AtLiTeG Research Group",
  publisher: "Università per Stranieri di Siena",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "AtLiTeG - Atlante Gastronomico Italiano",
    description: "Esplora l'evoluzione della lingua gastronomica italiana dal Medioevo all'Unità con mappe interattive e dati storici.",
    url: "https://atlante.atliteg.org",
    siteName: "AtLiTeG",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/immagine-testata.jpg",
        width: 1200,
        height: 630,
        alt: "AtLiTeG Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AtLiTeG - Atlante Gastronomico Italiano",
    description: "Esplora l'evoluzione della lingua gastronomica italiana dal Medioevo all'Unità.",
    images: ["/immagine-testata.jpg"],
  },
  alternates: {
    canonical: "https://atlante.atliteg.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="font-sans">
        <JsonLd />
        <GoogleAnalytics />
        <AccessibilityProvider />
        <AppProvider>
          <HighlightProvider>
            {children}
          </HighlightProvider>
        </AppProvider>
      </body>
    </html>
  );
}
