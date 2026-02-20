import { supabase, getProductsInStock } from '@/lib/supabase';
import Container from '@/components/Container';
import Section from '@/components/ui/Section';

/**
 * Page de test de connexion Supabase
 * 
 * Cette page vérifie :
 * 1. La connexion à Supabase
 * 2. La lecture des produits
 * 3. Les politiques RLS
 * 
 * À supprimer en production
 */
export default async function TestDBPage() {
  // Test 1 : Connexion de base
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');

  // Test 2 : Helper function
  const { data: productsInStock, error: stockError } = await getProductsInStock();

  // Test 3 : Tentative de lecture des commandes (devrait échouer avec anon key)
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*');

  return (
    <Section background="white" padding="lg">
      <Container size="md">
        <div className="space-y-8">
          {/* Titre */}
          <div className="text-center">
            <h1 className="text-4xl font-serif font-semibold text-azalis-green mb-4">
              Test Connexion Supabase
            </h1>
            <p className="text-azalis-black/70">
              Vérification de la configuration de la base de données
            </p>
          </div>

          {/* Test 1 : Connexion */}
          <div className="bg-azalis-beige p-6 rounded-lg">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              1️⃣ Test de Connexion
            </h2>
            
            {productsError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">❌ Erreur de connexion</p>
                <p className="text-sm mt-2">{productsError.message}</p>
                <p className="text-xs mt-2 text-red-600">
                  Vérifiez vos variables d&apos;environnement dans .env.local
                </p>
              </div>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-semibold">✅ Connexion réussie !</p>
                <p className="text-sm mt-2">
                  Base de données accessible
                </p>
              </div>
            )}
          </div>

          {/* Test 2 : Lecture des produits */}
          <div className="bg-azalis-beige p-6 rounded-lg">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              2️⃣ Lecture des Produits
            </h2>
            
            {products && products.length > 0 ? (
              <div>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p className="font-semibold">✅ {products.length} produit(s) trouvé(s)</p>
                </div>
                
                <div className="space-y-3">
                  {products.map((product: any) => (
                    <div key={product.id} className="bg-white p-4 rounded border border-azalis-green/20">
                      <p className="font-semibold text-azalis-green">{product.name}</p>
                      <p className="text-sm text-azalis-black/70">Prix : {product.price}€</p>
                      <p className="text-sm text-azalis-black/70">Stock : {product.stock}</p>
                      <p className="text-xs text-azalis-black/50 mt-2">ID : {product.id}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p className="font-semibold">⚠️ Aucun produit trouvé</p>
                <p className="text-sm mt-2">
                  La table products est vide. Ajoutez des produits via le dashboard Supabase.
                </p>
              </div>
            )}
          </div>

          {/* Test 3 : Helper function */}
          <div className="bg-azalis-beige p-6 rounded-lg">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              3️⃣ Test Helper Function
            </h2>
            
            {stockError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">❌ Erreur</p>
                <p className="text-sm mt-2">{stockError.message}</p>
              </div>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-semibold">✅ Helper function fonctionne</p>
                <p className="text-sm mt-2">
                  Produits en stock : {productsInStock?.length || 0}
                </p>
              </div>
            )}
          </div>

          {/* Test 4 : RLS (Row Level Security) */}
          <div className="bg-azalis-beige p-6 rounded-lg">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              4️⃣ Test Row Level Security (RLS)
            </h2>
            
            {ordersError ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-semibold">✅ RLS fonctionne correctement</p>
                <p className="text-sm mt-2">
                  La lecture des commandes est bloquée avec la clé publique (anon key).
                </p>
                <p className="text-xs mt-2 text-green-600">
                  Erreur attendue : {ordersError.message}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="font-semibold">⚠️ Attention : RLS non configuré</p>
                <p className="text-sm mt-2">
                  Les commandes sont accessibles publiquement. Vérifiez les politiques RLS.
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-azalis-white p-6 rounded-lg border border-azalis-green/20">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              📚 Prochaines Étapes
            </h2>
            
            <div className="space-y-3 text-sm text-azalis-black/70">
              <p>
                <strong className="text-azalis-green">1.</strong> Si tous les tests sont verts, votre configuration est correcte !
              </p>
              <p>
                <strong className="text-azalis-green">2.</strong> Ajoutez des produits via le dashboard Supabase ou via une API Route
              </p>
              <p>
                <strong className="text-azalis-green">3.</strong> Consultez <code className="bg-azalis-beige px-2 py-1 rounded">SUPABASE_SETUP.md</code> pour plus d&apos;informations
              </p>
              <p>
                <strong className="text-azalis-green">4.</strong> Supprimez cette page en production
              </p>
            </div>
          </div>

          {/* Variables d'environnement */}
          <div className="bg-azalis-beige p-6 rounded-lg">
            <h2 className="text-xl font-serif font-semibold text-azalis-green mb-4">
              🔐 Variables d&apos;Environnement
            </h2>
            
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}
                </span>
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}
                </span>
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={process.env.SUPABASE_SERVICE_ROLE_KEY ? 'text-green-600' : 'text-yellow-600'}>
                  {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '⚠️'}
                </span>
                <span>SUPABASE_SERVICE_ROLE_KEY</span>
                {!process.env.SUPABASE_SERVICE_ROLE_KEY && (
                  <span className="text-xs text-yellow-600">(optionnel pour les tests)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
