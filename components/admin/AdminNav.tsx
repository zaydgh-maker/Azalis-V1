'use client';

/**
 * Navigation Admin AZALIS
 * 
 * Barre de navigation pour le panel admin
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AdminNavProps {
  user: User;
  role: 'admin' | 'super_admin';
}

export default function AdminNav({ user, role }: AdminNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Commandes', icon: '📦' },
    { href: '/admin/products', label: 'Produits', icon: '🛍️' },
  ];

  return (
    <nav className="bg-azalis-white border-b border-azalis-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-azalis-green">
                AZALIS
              </span>
              <span className="text-xs bg-azalis-green text-azalis-white px-2 py-1 rounded">
                Admin
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-azalis-beige text-azalis-green'
                      : 'text-azalis-black/70 hover:bg-azalis-beige hover:text-azalis-green'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Lien vers le site */}
            <Link
              href="/"
              className="text-sm text-azalis-black/60 hover:text-azalis-green transition-colors"
            >
              Voir le site →
            </Link>

            {/* Utilisateur */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-azalis-black">
                  {user.email}
                </p>
                <p className="text-xs text-azalis-black/60">
                  {role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>

              {/* Bouton déconnexion */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-azalis-green/10 text-azalis-green rounded-sm hover:bg-azalis-green/20 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden pb-4 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === item.href
                  ? 'bg-azalis-beige text-azalis-green'
                  : 'text-azalis-black/70 hover:bg-azalis-beige hover:text-azalis-green'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
