import { ReactNode } from 'react';
import Container from '../Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'beige' | 'white' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Composant Section pour structurer les pages
 * Gère le background, padding et container automatiquement
 */
export default function Section({
  children,
  className = '',
  background = 'transparent',
  padding = 'lg',
  containerSize = 'lg',
}: SectionProps) {
  // Background classes
  const bgClasses = {
    beige: 'bg-azalis-beige',
    white: 'bg-azalis-white',
    transparent: 'bg-transparent',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'py-12',
    md: 'py-16 md:py-20',
    lg: 'py-20 md:py-28 lg:py-32',
  };

  return (
    <section className={`${bgClasses[background]} ${paddingClasses[padding]} ${className}`}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
