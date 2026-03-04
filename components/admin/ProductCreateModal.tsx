'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  ingredients: string | null;
  benefits: string | null;
  usage_protocol?: string | null;
  faq?: Array<{ question: string; answer: string }> | null;
}

interface ProductCreateModalProps {
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

export default function ProductCreateModal({
  onClose,
  onSuccess,
}: ProductCreateModalProps) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
    ingredients: '',
    benefits: '',
    usage_protocol: '',
    faq: [{ question: '', answer: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = () => {
    setForm((p) => ({
      ...p,
      slug: p.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }],
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeFaq = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const slug =
        form.slug ||
        form.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

      const payload = {
        name: form.name.trim(),
        slug: slug || 'produit',
        description: form.description.trim() || null,
        price: form.price,
        stock: form.stock,
        image_url: form.image_url.trim() || null,
        ingredients: form.ingredients.trim() || null,
        benefits: form.benefits.trim() || null,
        usage_protocol: form.usage_protocol.trim() || null,
        faq: form.faq.filter((f) => f.question.trim() || f.answer.trim()),
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erreur lors de la création');
      }

      onSuccess(json.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-start justify-center bg-azalis-black/50"
      onClick={onClose}
    >
      <div
        className="bg-azalis-white rounded-lg shadow-lg max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-azalis-green/10">
          <h2 className="text-xl font-serif font-semibold text-azalis-green">
            Ajouter un produit
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-sm text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              onBlur={generateSlug}
              required
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-azalis-black mb-1">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price || ''}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))}
                required
                className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-azalis-black mb-1">Stock *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">URL image</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">
              Actifs clés
            </label>
            <textarea
              value={form.benefits}
              onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">
              Ingrédients INCI
            </label>
            <textarea
              value={form.ingredients}
              onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-azalis-black mb-1">
              Protocole d&apos;utilisation
            </label>
            <textarea
              value={form.usage_protocol}
              onChange={(e) => setForm((p) => ({ ...p, usage_protocol: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:ring-2 focus:ring-azalis-green/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-azalis-black">FAQ</label>
              <button
                type="button"
                onClick={addFaq}
                className="text-sm text-azalis-green hover:underline"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {form.faq.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-azalis-beige rounded-sm border border-azalis-green/10"
                >
                  <input
                    type="text"
                    placeholder="Question"
                    value={item.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    className="w-full px-3 py-2 mb-2 bg-white border border-azalis-green/20 rounded-sm text-sm"
                  />
                  <textarea
                    placeholder="Réponse"
                    value={item.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-azalis-green/20 rounded-sm text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="mt-1 text-xs text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-azalis-beige text-azalis-black rounded-sm hover:bg-azalis-green/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-azalis-green text-azalis-white rounded-sm hover:bg-azalis-green/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
