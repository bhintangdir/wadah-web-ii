import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";
import content from "@/data/content.json";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${figtree.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
