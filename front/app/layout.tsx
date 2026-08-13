import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import SecretAccess from "@/components/SecretAccess";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tax Advisory Consultants — Conseil fiscal & patrimonial",
  description:
    "Cabinet de conseil fiscal agréé CEMAC (N° SCF 027), basé à Douala. Fiscalité, douane, droit des affaires et droit social au Cameroun et dans l'espace CEMAC.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' text-anchor='middle' x='50' dominant-baseline='central' fill='%230F2647'>✳</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <SecretAccess />
      </body>
    </html>
  );
}