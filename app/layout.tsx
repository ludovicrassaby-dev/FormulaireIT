import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { QueryProvider } from "@/components/query-provider";
import { getCompanyName } from "@/lib/env";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const company = getCompanyName();

export const metadata: Metadata = {
  title: `Matériel inutilisé — ${company}`,
  description:
    "Formulaire destiné aux managers pour identifier et localiser les ordinateurs inutilisés dans chaque agence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
