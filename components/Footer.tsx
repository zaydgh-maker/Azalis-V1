import Link from 'next/link';
import Container from './Container';

/**
 * Footer minimaliste et élégant
 * Contient copyright et liens essentiels
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Mentions légales', href: '/legal' },
    { name: 'Confidentialité', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-azalis-white border-t border-azalis-green/10 mt-auto">
      <Container>
        <div className="py-12">
          {/* Logo et tagline */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif font-semibold text-azalis-green mb-2">
              AZALIS
            </h3>
            <p className="text-sm text-azalis-black/60">
              Le naturel sous contrôle
            </p>
          </div>

          {/* Liens */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-azalis-black/60 hover:text-azalis-green transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Ligne décorative */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-azalis-green/20"></div>
            <div className="h-1 w-1 rounded-full bg-azalis-green/30"></div>
            <div className="h-px w-12 bg-azalis-green/20"></div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-azalis-black/50">
              © {currentYear} AZALIS. Tous droits réservés.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
