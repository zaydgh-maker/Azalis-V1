import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

// Métadonnées du site
export const metadata: Metadata = {
  title: "AZALIS - Le naturel sous contrôle",
  description: "E-commerce de produits naturels et éco-responsables",
  keywords: ["naturel", "bio", "éco-responsable", "cosmétiques", "bien-être"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
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
