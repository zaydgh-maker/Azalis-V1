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
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/admin/orders',
      label: 'Commandes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      href: '/admin/products',
      label: 'Produits',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
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
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
                    pathname === item.href
                      ? 'bg-azalis-beige text-[#3D5A47]'
                      : 'text-azalis-black/70 hover:bg-azalis-beige hover:text-[#3D5A47]'
                  }`}
                >
                  <span className="text-[#3D5A47]">{item.icon}</span>
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
              className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                pathname === item.href
                  ? 'bg-azalis-beige text-[#3D5A47]'
                  : 'text-azalis-black/70 hover:bg-azalis-beige hover:text-[#3D5A47]'
              }`}
            >
              <span className="text-[#3D5A47]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
