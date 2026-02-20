/**
 * Layout Admin AZALIS
 * 
 * Layout spécifique pour les pages admin
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - AZALIS',
  description: 'Panel d\'administration AZALIS',
  robots: 'noindex, nofollow', // Pas d'indexation par les moteurs de recherche
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
