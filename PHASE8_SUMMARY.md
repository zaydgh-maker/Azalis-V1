# 🔐 Phase 8 : Admin Panel Sécurisé - Documentation Complète

## ✅ Objectifs de la Phase 8

Créer un **panel admin sécurisé** pour gérer les commandes et les produits avec authentification Supabase Auth.

### Fonctionnalités implémentées

- ✅ Authentification admin avec Supabase Auth
- ✅ Protection des routes admin côté serveur (middleware)
- ✅ Dashboard avec statistiques
- ✅ Gestion des commandes (liste, détails, changement de statut)
- ✅ Filtres et recherche de commandes
- ✅ Export CSV des commandes
- ✅ Gestion des produits (modifier stock, supprimer)
- ✅ Interface minimaliste et fonctionnelle

---

## 📁 Fichiers Créés

### 1. `/middleware.ts`

**Middleware Next.js pour protéger les routes admin.**

#### Fonctionnalités

- Vérifie l'authentification avant d'accéder aux routes `/admin/*`
- Exclut la page de login (`/admin/login`)
- Vérifie le rôle admin dans la table `admin_users`
- Redirige vers login si non authentifié ou non admin

#### Code clé

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const supabase = createServerClient(/* ... */);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Rediriger vers login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Vérifier si l'utilisateur est admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

### 2. `/lib/supabase-auth.ts`

**Helpers pour l'authentification admin.**

#### Fonctions

- `createServerAuthClient()` : Créer un client Supabase pour Server Components
- `getServerUser()` : Récupérer l'utilisateur connecté
- `isAdmin()` : Vérifier si l'utilisateur est admin
- `getUserRole()` : Récupérer le rôle de l'utilisateur

---

### 3. `/app/admin/login/page.tsx`

**Page de connexion admin.**

#### Fonctionnalités

- Formulaire email + mot de passe
- Validation côté client
- Connexion via Supabase Auth
- Vérification du rôle admin
- Redirection vers dashboard si succès
- Messages d'erreur clairs
- Suspense boundary pour `useSearchParams()`

---

### 4. `/app/admin/dashboard/page.tsx`

**Page dashboard admin.**

#### Fonctionnalités

- Statistiques clés (commandes, chiffre d'affaires, stock faible)
- Liste des commandes récentes
- Navigation admin
- Protection serveur-side

---

### 5. `/app/admin/orders/page.tsx`

**Page liste des commandes.**

#### Fonctionnalités

- Liste complète des commandes
- Filtres (statut, mode de paiement, recherche)
- Export CSV
- Protection serveur-side

---

### 6. `/app/admin/orders/[id]/page.tsx`

**Page détail d'une commande.**

#### Fonctionnalités

- Informations client complètes
- Informations paiement
- Changement de statut
- Métadonnées (ID, dates)
- Protection serveur-side

---

### 7. `/app/admin/products/page.tsx`

**Page liste des produits.**

#### Fonctionnalités

- Liste complète des produits
- Modifier le stock
- Supprimer un produit
- Protection serveur-side

---

## 🎨 Composants Admin

### 1. `AdminNav`

Navigation admin avec :
- Logo AZALIS + badge "Admin"
- Liens vers Dashboard, Commandes, Produits
- Lien vers le site
- Informations utilisateur (email, rôle)
- Bouton déconnexion

### 2. `StatsCards`

Cartes de statistiques :
- Total commandes
- En attente
- Payées
- Chiffre d'affaires
- Stock faible

### 3. `OrdersTable`

Tableau des commandes :
- ID, Client, Ville, Total, Paiement, Statut, Date
- Badges colorés pour les statuts
- Lien vers détails

### 4. `OrdersListClient`

Liste avec filtres :
- Recherche (nom, téléphone, ville, ID)
- Filtre par statut
- Filtre par mode de paiement
- Export CSV

### 5. `OrderDetailClient`

Détail commande :
- Informations client
- Informations paiement
- Changement de statut (boutons)
- Métadonnées

### 6. `ProductsListClient`

Liste produits :
- Grille responsive
- Modifier le stock (inline)
- Supprimer

---

## 🔒 Sécurité

### Protection Multi-Niveaux

1. **Middleware** : Vérifie l'authentification et le rôle avant d'accéder aux routes
2. **Server Components** : Vérification côté serveur dans chaque page
3. **Supabase RLS** : Row Level Security sur la table `admin_users`

### Table `admin_users`

```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Politiques RLS

- **Lecture** : Seuls les admins peuvent lire la table `admin_users`
- **Modification** : Seuls les super_admins peuvent modifier la table

### Fonction Helper

```sql
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users WHERE id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📊 Fonctionnalités Détaillées

### Dashboard

**Statistiques** :
- Total commandes
- Commandes en attente
- Commandes payées
- Chiffre d'affaires total
- Produits avec stock faible (< 10)

**Commandes récentes** :
- 10 dernières commandes
- Tableau avec toutes les infos
- Lien vers détails

---

### Gestion des Commandes

**Liste** :
- Toutes les commandes triées par date (plus récentes en premier)
- Filtres :
  - Recherche : nom, téléphone, ville, ID
  - Statut : tous, pending, paid, confirmed, preparing, shipped, delivered, cancelled, payment_failed
  - Paiement : tous, carte, à la livraison
- Export CSV avec toutes les colonnes

**Détail** :
- Informations client : nom, email, téléphone, ville, adresse
- Informations paiement : mode, total, IDs Stripe
- Changement de statut : boutons pour chaque statut
- Métadonnées : ID, créée le, modifiée le

**Statuts disponibles** :
- `pending` : En attente
- `paid` : Payée
- `confirmed` : Confirmée
- `preparing` : En préparation
- `shipped` : Expédiée
- `delivered` : Livrée
- `cancelled` : Annulée

---

### Gestion des Produits

**Liste** :
- Grille responsive (1/2/3 colonnes)
- Image, nom, description, prix, stock
- Badge coloré pour le stock :
  - Rouge : stock = 0
  - Jaune : stock < 10
  - Vert : stock >= 10

**Actions** :
- **Modifier le stock** : Inline avec input number + boutons ✓/✕
- **Supprimer** : Confirmation avant suppression

---

### Export CSV

**Colonnes exportées** :
- ID
- Client
- Email
- Téléphone
- Ville
- Adresse
- Total
- Paiement
- Statut
- Date

**Format** :
- CSV avec séparateur virgule
- Guillemets autour des valeurs
- Encodage UTF-8
- Nom du fichier : `azalis-commandes-YYYY-MM-DD.csv`

---

## 🎨 Design

### Palette

- **Fond** : `azalis-beige` (#F4EFE7)
- **Cartes** : `azalis-white` (#FAF9F7)
- **Texte** : `azalis-black` (#1C1C1C)
- **Accent** : `azalis-green` (#6B7D6D)

### Badges Statuts

| Statut | Couleur |
|--------|---------|
| pending | Jaune |
| paid | Vert |
| confirmed | Bleu |
| preparing | Violet |
| shipped | Indigo |
| delivered | Vert |
| cancelled | Rouge |
| payment_failed | Rouge |

### Responsive

- **Mobile** : Navigation en bas, grille 1 colonne
- **Tablet** : Grille 2 colonnes
- **Desktop** : Grille 3 colonnes, navigation en haut

---

## 🧪 Tests Manuels

### Scénario 1 : Connexion Admin

1. Créer un utilisateur dans Supabase Auth
2. Ajouter son ID dans la table `admin_users`
3. Aller sur `/admin/login`
4. Entrer email + mot de passe
5. ✅ Redirection vers `/admin/dashboard`

### Scénario 2 : Protection des Routes

1. Aller sur `/admin/dashboard` sans être connecté
2. ✅ Redirection vers `/admin/login`
3. Se connecter avec un utilisateur non-admin
4. ✅ Redirection vers `/admin/login?error=unauthorized`

### Scénario 3 : Gestion des Commandes

1. Aller sur `/admin/orders`
2. ✅ Liste des commandes affichée
3. Filtrer par statut "pending"
4. ✅ Seules les commandes en attente affichées
5. Cliquer sur "Exporter en CSV"
6. ✅ Fichier CSV téléchargé

### Scénario 4 : Changement de Statut

1. Aller sur `/admin/orders/[id]`
2. ✅ Détails de la commande affichés
3. Cliquer sur "Confirmée"
4. ✅ Statut mis à jour
5. ✅ Message de succès affiché

### Scénario 5 : Gestion des Produits

1. Aller sur `/admin/products`
2. ✅ Liste des produits affichée
3. Cliquer sur "Modifier le stock"
4. Entrer une nouvelle valeur
5. Cliquer sur ✓
6. ✅ Stock mis à jour

---

## 📚 Configuration Supabase

### 1. Créer un utilisateur admin

Dans Supabase Dashboard :

1. Aller dans "Authentication" > "Users"
2. Cliquer sur "Add user"
3. Entrer email + mot de passe
4. Copier l'ID de l'utilisateur

### 2. Ajouter dans `admin_users`

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    'uuid-de-l-utilisateur',
    'admin@azalis.com',
    'super_admin'
);
```

### 3. Tester la connexion

1. Aller sur `/admin/login`
2. Se connecter avec l'email et le mot de passe
3. ✅ Accès au dashboard

---

## 🚀 Prochaines Étapes

### Phase 9 : Emails & Notifications

- [ ] Email de confirmation de commande
- [ ] Email de changement de statut
- [ ] Email de livraison

### Phase 10 : Optimisation & SEO

- [ ] Performance (images, code splitting)
- [ ] SEO (metadata, sitemap)
- [ ] Accessibilité (ARIA, keyboard)

### Phase 11 : Tests & Qualité

- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Playwright)
- [ ] Qualité (Husky, Prettier)

### Phase 12 : Déploiement

- [ ] Vercel/Netlify
- [ ] CI/CD
- [ ] Monitoring

---

## 🎯 Résumé

La **Phase 8** est **complète et fonctionnelle** ! 🎉

Vous disposez maintenant d'un **panel admin sécurisé** permettant de :

1. ✅ Se connecter avec email + mot de passe
2. ✅ Voir les statistiques clés
3. ✅ Gérer les commandes (liste, détails, changement de statut)
4. ✅ Filtrer et rechercher les commandes
5. ✅ Exporter les commandes en CSV
6. ✅ Gérer les produits (modifier stock, supprimer)

Le système est **prêt pour la production** avec :

- Authentification sécurisée
- Protection des routes côté serveur
- Row Level Security (RLS)
- Interface minimaliste et fonctionnelle
- Code propre et maintenable

**Prochaine étape recommandée** : Phase 9 (Emails & Notifications) pour améliorer la communication avec les clients.
