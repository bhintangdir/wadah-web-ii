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
  metadataBase: new URL(content.meta.siteUrl || "https://wadahweb.com"),
  title: {
    default: content.meta.title,
    template: `%s | ${content.meta.siteName}`,
  },
  description: content.meta.description,
  keywords: content.meta.keywords,
  authors: [{ name: content.meta.siteName, url: content.meta.siteUrl }],
  creator: content.meta.siteName,
  publisher: content.meta.siteName,
  applicationName: content.meta.siteName,
  alternates: {
    canonical: content.meta.siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: content.meta.siteUrl,
    title: content.meta.title,
    description: content.meta.description,
    siteName: content.meta.siteName,
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: `${content.meta.siteName} - Jasa Pembuatan Website Profesional`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.title,
    description: content.meta.description,
    images: ["/logo.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.webp",
  },
  category: "technology",
  classification: "Jasa Pembuatan Website, Web Development, SEO, Digital Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${content.meta.siteUrl}/#website`,
        "url": content.meta.siteUrl,
        "name": content.meta.siteName,
        "description": content.meta.description,
        "inLanguage": "id-ID",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${content.meta.siteUrl}/#organization`,
        "name": content.meta.siteName,
        "url": content.meta.siteUrl,
        "logo": `${content.meta.siteUrl}/logo.webp`,
        "image": `${content.meta.siteUrl}/logo.webp`,
        "description": content.meta.description,
        "telephone": content.brand.whatsappNumber,
        "email": content.brand.email,
        "priceRange": "Rp 899.000 - Rp 1.199.000+",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lombok",
          "addressRegion": "Nusa Tenggara Barat",
          "addressCountry": "ID",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-8.5833",
          "longitude": "116.1167",
        },
        "areaServed": [
          { "@type": "Country", "name": "Indonesia" },
          { "@type": "AdministrativeArea", "name": "Seluruh Indonesia" }
        ],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Paket Pembuatan Website",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Jasa Pembuatan Landing Page",
                "description": "Pembuatan 1 halaman landing page profesional untuk promosi dan iklan WhatsApp."
              },
              "price": "899000",
              "priceCurrency": "IDR"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Jasa Pembuatan Website Company Profile & Multi-Halaman",
                "description": "Website multi-halaman profesional, bebas jumlah halaman, standar Google, aktivasi Google Search Console & garansi maintenance selamanya."
              },
              "price": "1199000",
              "priceCurrency": "IDR"
            }
          ]
        }
      }
    ]
  };

  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${figtree.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
