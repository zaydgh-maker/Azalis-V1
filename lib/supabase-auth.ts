/**
 * Helpers Supabase pour l'authentification admin
 * 
 * Fournit des fonctions pour gérer l'authentification et vérifier les rôles admin
 * 
 * Vérification admin : utilise supabaseAdmin (serviceRoleKey) pour lire admin_users
 * car la table admin_users a des politiques RLS - seul le client service role peut
 * lire sans restriction pour vérifier si un user.id existe.
 */

import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';

/**
 * Créer un client Supabase pour Server Components avec gestion des cookies
 */
export function createServerAuthClient() {
  const cookieStore = cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore errors in Server Components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignore errors in Server Components
          }
        },
      },
    }
  );
}

/**
 * Récupérer l'utilisateur connecté (Server Component)
 */
export async function getServerUser() {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Vérifier si l'utilisateur est admin (Server Component)
 * Utilise supabaseAdmin (serviceRoleKey) pour bypass RLS sur admin_users
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  return !!adminUser;
}

/**
 * Récupérer le rôle de l'utilisateur (Server Component)
 * Utilise supabaseAdmin (serviceRoleKey) pour bypass RLS sur admin_users
 */
export async function getUserRole(): Promise<'admin' | 'super_admin' | null> {
  const user = await getServerUser();
  if (!user) return null;

  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();

  return adminUser?.role || null;
}
