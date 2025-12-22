import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { HighlightProvider } from "@/context/HighlightContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AtLiTeG - Lemmario Interattivo",
  description: "Dashboard interattiva per la navigazione del lemmario gastronomico italiano",
  openGraph: {
    title: "AtLiTeG - Lemmario Interattivo",
    description: "Dashboard interattiva per la navigazione del lemmario gastronomico italiano",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
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
