# Configuration Git - AZALIS V1

## 📦 Installation de Git

Si Git n'est pas encore installé sur votre système :

### Windows
1. Télécharger Git depuis [git-scm.com](https://git-scm.com/download/win)
2. Installer avec les options par défaut
3. Redémarrer le terminal

### Vérification
```bash
git --version
```

## 🚀 Initialisation du Repository

### 1. Initialiser Git

```bash
git init
```

### 2. Configurer Git (première fois)

```bash
# Configurer votre nom
git config --global user.name "Votre Nom"

# Configurer votre email
git config --global user.email "votre.email@example.com"

# Configurer l'éditeur par défaut (optionnel)
git config --global core.editor "code --wait"
```

### 3. Premier Commit

```bash
# Ajouter tous les fichiers
git add .

# Créer le commit initial
git commit -m "chore: initial project setup with Next.js 14"
```

### 4. Créer la branche main (si nécessaire)

```bash
# Renommer la branche en main si elle s'appelle master
git branch -M main
```

## 🌐 Connexion à un Repository Distant

### GitHub

```bash
# Créer un nouveau repository sur GitHub (via l'interface web)
# Puis connecter le repository local

git remote add origin https://github.com/votre-username/azalis-v1.git
git push -u origin main
```

### GitLab

```bash
git remote add origin https://gitlab.com/votre-username/azalis-v1.git
git push -u origin main
```

### Bitbucket

```bash
git remote add origin https://bitbucket.org/votre-username/azalis-v1.git
git push -u origin main
```

## 📝 Workflow Git Recommandé

### Créer une nouvelle branche

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/ma-nouvelle-feature

# Ou avec la nouvelle syntaxe
git switch -c feature/ma-nouvelle-feature
```

### Développer et Commiter

```bash
# Voir les fichiers modifiés
git status

# Ajouter des fichiers spécifiques
git add app/page.tsx components/Button.tsx

# Ou ajouter tous les fichiers modifiés
git add .

# Commiter avec un message descriptif
git commit -m "feat(products): add product listing page"
```

### Pousser les Changements

```bash
# Première fois sur une nouvelle branche
git push -u origin feature/ma-nouvelle-feature

# Fois suivantes
git push
```

### Fusionner dans main

```bash
# Revenir sur main
git checkout main

# Récupérer les dernières modifications
git pull origin main

# Fusionner la branche feature
git merge feature/ma-nouvelle-feature

# Pousser sur le remote
git push origin main

# Supprimer la branche locale (optionnel)
git branch -d feature/ma-nouvelle-feature
```

## 🔧 Commandes Git Utiles

### Voir l'historique

```bash
# Historique complet
git log

# Historique condensé
git log --oneline

# Historique avec graphe
git log --oneline --graph --all
```

### Annuler des Changements

```bash
# Annuler les modifications d'un fichier (non stagé)
git checkout -- fichier.tsx

# Retirer un fichier du staging
git reset HEAD fichier.tsx

# Annuler le dernier commit (garder les modifications)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les modifications)
git reset --hard HEAD~1
```

### Branches

```bash
# Lister les branches
git branch

# Lister toutes les branches (locales et distantes)
git branch -a

# Supprimer une branche locale
git branch -d nom-branche

# Supprimer une branche distante
git push origin --delete nom-branche
```

### Stash (Mettre de côté des modifications)

```bash
# Mettre de côté les modifications
git stash

# Lister les stash
git stash list

# Réappliquer le dernier stash
git stash pop

# Réappliquer un stash spécifique
git stash apply stash@{0}
```

## 🔒 Fichiers à Ignorer

Le fichier `.gitignore` est déjà configuré pour ignorer :

- `node_modules/` - Dépendances npm
- `.next/` - Build Next.js
- `.env*.local` - Variables d'environnement locales
- `*.log` - Fichiers de log
- `.DS_Store` - Fichiers macOS

## 📋 Bonnes Pratiques

### Messages de Commit

✅ **Bon :**
```bash
git commit -m "feat(cart): add item quantity update functionality"
git commit -m "fix(checkout): correct shipping cost calculation"
git commit -m "docs(readme): update installation instructions"
```

❌ **Mauvais :**
```bash
git commit -m "update"
git commit -m "fix bug"
git commit -m "wip"
```

### Fréquence des Commits

- Commiter souvent (petits commits logiques)
- Un commit = une fonctionnalité/fix
- Ne pas commiter du code qui ne compile pas

### Branches

- `main` : Code stable et déployable
- `develop` : Code en développement (optionnel)
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production

## 🚨 En Cas de Problème

### Conflit de Merge

```bash
# 1. Git indiquera les fichiers en conflit
git status

# 2. Ouvrir les fichiers et résoudre les conflits
# Chercher les marqueurs <<<<<<< ======= >>>>>>>

# 3. Marquer comme résolu
git add fichier-resolu.tsx

# 4. Finaliser le merge
git commit
```

### Récupérer un Commit Supprimé

```bash
# Voir l'historique complet (même les commits supprimés)
git reflog

# Récupérer un commit spécifique
git checkout <commit-hash>
```

### Synchroniser avec le Remote

```bash
# Récupérer les modifications sans fusionner
git fetch origin

# Récupérer et fusionner
git pull origin main

# En cas de divergence
git pull --rebase origin main
```

## 📚 Ressources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Note :** Ce guide couvre les bases de Git. Pour des cas d'usage avancés, consulter la documentation officielle.
