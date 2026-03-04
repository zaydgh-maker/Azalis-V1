'use client';

interface ProductDeleteConfirmProps {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProductDeleteConfirm({
  productName,
  onConfirm,
  onCancel,
  isLoading,
}: ProductDeleteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-azalis-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-azalis-white rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-azalis-green mb-2">Supprimer le produit</h3>
        <p className="text-azalis-black/80 mb-4">
          Êtes-vous sûr ? Cette action est irréversible.
        </p>
        <p className="text-sm text-azalis-black/60 mb-6">
          Le produit &quot;{productName}&quot; sera définitivement supprimé.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-azalis-beige text-azalis-black rounded-sm hover:bg-azalis-green/10 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
