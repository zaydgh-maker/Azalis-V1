import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

// Configuration des polices Google
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: 'Azalis — Le naturel sous contrôle',
    template: '%s | Azalis',
  },
  description:
    "Soins naturels formulés en laboratoire agréé au Maroc. Sérum Hydratant Figue de Barbarie et Sérum Anti-Acné Purifiant. 98% d'origine naturelle. Livraison partout au Maroc, paiement à la réception.",
  keywords: [
    'soin naturel maroc',
    'sérum visage maroc',
    'cosmétique naturel maroc',
    'sérum figue de barbarie',
    'sérum anti acné maroc',
    'soin peau sensible maroc',
    'sérum hydratant maroc',
    'azalis',
  ],
  authors: [{ name: 'Azalis' }],
  creator: 'Azalis',
  publisher: 'Azalis',
  metadataBase: new URL('https://azalis.ma'),
  alternates: { canonical: 'https://azalis.ma' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const },
  },
  openGraph: {
    title: 'Azalis — Le naturel sous contrôle',
    description:
      'Soins naturels formulés en laboratoire agréé au Maroc. Livraison partout au Maroc, paiement à la réception.',
    url: 'https://azalis.ma',
    siteName: 'Azalis',
    locale: 'fr_MA',
    type: 'website',
    images: [
      {
        url: '/images/serum-hydratant.png',
        width: 1200,
        height: 630,
        alt: 'Azalis Sérum Hydratant Figue de Barbarie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azalis — Le naturel sous contrôle',
    description: 'Soins naturels formulés en laboratoire agréé au Maroc.',
    images: ['/images/serum-hydratant.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DPW0MT2V4P"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DPW0MT2V4P');
        `}
      </Script>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-azalis-beige text-azalis-black`}
      >
        {/* Provider du panier pour toute l'application */}
        <CartProvider>
          {/* Structure globale avec Header et Footer */}
          <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
          </div>

          {/* Drawer du panier (overlay global) */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
