# 🔐 Configuration Admin - À FAIRE MAINTENANT

## ⚡ 5 Minutes pour Configurer l'Admin

---

## 📍 Étape 1 : Ouvrir Supabase

1. Aller sur : **https://app.supabase.com**
2. Cliquer sur votre projet **AZALIS**

---

## 📍 Étape 2 : Exécuter le SQL

1. Cliquer sur **"SQL Editor"** (menu de gauche)
2. Cliquer sur **"New query"**
3. Ouvrir le fichier **`supabase/admin-setup.sql`**
4. **Copier tout le contenu**
5. **Coller** dans l'éditeur SQL
6. Cliquer sur **"Run"**

✅ Vous devriez voir "Success"

---

## 📍 Étape 3 : Créer un Utilisateur

1. Cliquer sur **"Authentication"** (menu de gauche)
2. Cliquer sur **"Users"**
3. Cliquer sur **"Add user"**
4. Remplir :
   - Email : `admin@azalis.com`
   - Password : Votre mot de passe
   - ✅ **Cocher "Auto Confirm User"**
5. Cliquer sur **"Create user"**
6. **Copier l'UUID** (colonne "ID")

---

## 📍 Étape 4 : Lier l'Utilisateur

1. Retourner dans **"SQL Editor"**
2. **"New query"**
3. Copier ce SQL (remplacer l'UUID) :

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
    'VOTRE-UUID-ICI',
    'admin@azalis.com',
    'super_admin'
);
```

4. **Run**

✅ Vous devriez voir "Success. No rows returned"

---

## 📍 Étape 5 : Tester

Dans PowerShell :

```powershell
cd "C:\AZALIS V1"
npm run dev
```

Dans votre navigateur :

1. Aller sur : **http://localhost:3000/admin/login**
2. Se connecter avec l'email et le mot de passe
3. ✅ Vous êtes redirigé vers le dashboard

---

## 🎉 C'est Prêt !

Vous avez maintenant accès au panel admin ! 🚀

### Que Faire Maintenant ?

1. **Dashboard** : http://localhost:3000/admin/dashboard
2. **Commandes** : http://localhost:3000/admin/orders
3. **Produits** : http://localhost:3000/admin/products

---

## 🐛 Problème ?

### "Vous n'avez pas les droits"

Vérifier dans SQL Editor :

```sql
SELECT * FROM admin_users WHERE email = 'admin@azalis.com';
```

Si vide, réexécuter l'INSERT de l'étape 4.

### "Invalid login credentials"

Vérifier l'email et le mot de passe dans Authentication > Users.

---

## 📚 Plus d'Aide ?

Consultez **`ADMIN_SETUP.md`** pour un guide détaillé.

---

## ✅ Checklist

- [ ] SQL exécuté dans Supabase
- [ ] Utilisateur créé dans Authentication
- [ ] UUID copié
- [ ] INSERT exécuté
- [ ] Connexion testée
- [ ] Dashboard accessible

---

**Tout est prêt !** 🎊
