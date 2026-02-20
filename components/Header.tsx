'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';
import { useCart } from '@/context/CartContext';

/**
 * Header global avec navigation responsive
 * Design minimaliste et élégant
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/produits' },
    { name: 'À propos', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F4EFE7]/95 backdrop-blur-sm border-b border-[rgba(79,103,88,0.08)]">
      <Container>
        <nav className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl md:text-3xl font-bold text-[#2E2E2E] hover:text-[#2E2E2E]/80 transition-colors tracking-wide"
          >
            AZALIS
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[#2E2E2E]/70 hover:text-[#4F6758] transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Bouton Panier Desktop */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#4F6758] hover:bg-azalis-beige rounded-full transition-colors"
              aria-label="Ouvrir le panier"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {/* Badge compteur */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4F6758] text-azalis-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Actions Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {/* Bouton Panier Mobile */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#4F6758]"
              aria-label="Ouvrir le panier"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4F6758] text-azalis-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Bouton Menu Mobile */}
            <button
              type="button"
              className="p-2 text-[#4F6758]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(79,103,88,0.08)]">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[#2E2E2E]/70 hover:text-[#4F6758] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
