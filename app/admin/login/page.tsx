'use client';

/**
 * Page de Login Admin AZALIS
 * 
 * Authentification par email + mot de passe via Supabase Auth
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Container from '@/components/Container';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Vérifier si l'utilisateur est admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (adminUser) {
          // Rediriger vers le dashboard
          const redirect = searchParams.get('redirect') || '/admin/dashboard';
          router.push(redirect);
        }
      }
    };

    checkUser();
  }, [router, searchParams]);

  // Afficher les erreurs de l'URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('Vous n\'avez pas les droits d\'accès administrateur');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Connexion avec Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('Erreur de connexion');
      }

      // Vérifier si l'utilisateur est admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminUser) {
        // Déconnecter l'utilisateur s'il n'est pas admin
        await supabase.auth.signOut();
        throw new Error('Vous n\'avez pas les droits d\'accès administrateur');
      }

      // Rediriger vers le dashboard
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-azalis-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-semibold text-azalis-green mb-2">
            AZALIS
          </h1>
          <p className="text-azalis-black/60">Administration</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-azalis-white rounded-lg shadow-sm border border-azalis-green/10 p-8">
          <h2 className="text-2xl font-serif font-semibold text-azalis-green mb-6">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-azalis-black mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                placeholder="admin@azalis.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-azalis-black mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-azalis-beige border border-azalis-green/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-azalis-green/50 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 bg-azalis-green text-azalis-white font-medium rounded-sm hover:bg-azalis-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-azalis-black/60 hover:text-azalis-green transition-colors"
            >
              ← Retour au site
            </a>
          </div>
        </div>

        {/* Note de sécurité */}
        <p className="text-xs text-center text-azalis-black/50 mt-6">
          Accès réservé aux administrateurs AZALIS
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-azalis-beige flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azalis-green mx-auto mb-4"></div>
            <p className="text-azalis-black/60">Chargement...</p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
