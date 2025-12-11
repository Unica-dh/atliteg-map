import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

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
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
