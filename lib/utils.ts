/**
 * Utilitaires généraux pour l'application AZALIS
 */

/**
 * Formate un prix en euros
 * @param price - Prix en centimes
 * @returns Prix formaté avec le symbole €
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price / 100);
}

/**
 * Formate une date en français
 * @param date - Date à formater (Date ou string)
 * @returns Date formatée
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Classe les noms de classes CSS de manière conditionnelle
 * @param classes - Classes CSS
 * @returns Classes CSS combinées
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
