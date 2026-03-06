import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://azalis.ma', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://azalis.ma/produits', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://azalis.ma/produit/serum-hydratant-figue', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://azalis.ma/produit/serum-anti-acne', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://azalis.ma/a-propos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://azalis.ma/mentions-legales', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://azalis.ma/confidentialite', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://azalis.ma/livraison', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];
}
