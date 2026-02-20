# 🔧 Commandes Utiles - AZALIS V1

Guide de référence rapide pour toutes les commandes du projet.

---

## 📦 NPM - Gestion des Packages

### Installation

```bash
# Installer toutes les dépendances
npm install

# Installer une nouvelle dépendance
npm install nom-du-package

# Installer une dépendance de développement
npm install -D nom-du-package

# Installer une version spécifique
npm install nom-du-package@1.2.3

# Désinstaller un package
npm uninstall nom-du-package

# Mettre à jour les packages
npm update

# Vérifier les packages obsolètes
npm outdated

# Auditer les vulnérabilités
npm audit

# Corriger les vulnérabilités automatiquement
npm audit fix
```

### Informations

```bash
# Lister les packages installés
npm list

# Lister les packages de premier niveau
npm list --depth=0

# Voir les informations d'un package
npm info nom-du-package

# Voir la version de npm
npm --version
```

---

## 🚀 Next.js - Développement

### Serveur de Développement

```bash
# Lancer le serveur de développement (port 3000)
npm run dev

# Lancer sur un port spécifique
npm run dev -- -p 3001

# Lancer avec le mode turbo (plus rapide)
npm run dev -- --turbo
```

### Build et Production

```bash
# Compiler pour la production
npm run build

# Lancer le serveur de production
npm start

# Lancer sur un port spécifique
npm start -- -p 3001

# Analyser le bundle
npm run build -- --analyze
```

### Nettoyage

```bash
# Supprimer le dossier .next
Remove-Item -Path ".next" -Recurse -Force

# Supprimer node_modules et réinstaller
Remove-Item -Path "node_modules" -Recurse -Force
npm install

# Nettoyage complet
Remove-Item -Path ".next", "node_modules" -Recurse -Force
npm install
```

---

## 🧹 Linting et Formatage

### ESLint

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement les erreurs
npm run lint -- --fix

# Vérifier un fichier spécifique
npx eslint app/page.tsx

# Vérifier un dossier
npx eslint components/
```

### TypeScript

```bash
# Vérifier les types
npx tsc --noEmit

# Vérifier avec le mode watch
npx tsc --noEmit --watch

# Générer les fichiers de déclaration
npx tsc --declaration
```

---

## 🎨 Tailwind CSS

### Génération

```bash
# Générer le CSS (automatique avec Next.js)
npx tailwindcss -i ./app/globals.css -o ./output.css

# Mode watch
npx tailwindcss -i ./app/globals.css -o ./output.css --watch

# Mode minifié
npx tailwindcss -i ./app/globals.css -o ./output.css --minify
```

### Utilitaires

```bash
# Voir toutes les classes disponibles
npx tailwindcss --help

# Initialiser la config (déjà fait)
npx tailwindcss init
```

---

## 🗂️ Git - Gestion de Version

### Configuration Initiale

```bash
# Initialiser Git
git init

# Configurer l'utilisateur
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Voir la configuration
git config --list
```

### Commits et Branches

```bash
# Voir le statut
git status

# Ajouter des fichiers
git add .
git add fichier.tsx

# Commiter
git commit -m "feat: add new feature"

# Créer une branche
git checkout -b feature/nouvelle-feature

# Changer de branche
git checkout main

# Lister les branches
git branch

# Supprimer une branche
git branch -d feature/ancienne-feature
```

### Synchronisation

```bash
# Ajouter un remote
git remote add origin https://github.com/username/azalis-v1.git

# Pousser vers le remote
git push -u origin main

# Récupérer les modifications
git pull origin main

# Voir les remotes
git remote -v
```

### Historique

```bash
# Voir l'historique
git log

# Historique condensé
git log --oneline

# Historique avec graphe
git log --oneline --graph --all

# Voir les différences
git diff

# Voir les différences d'un fichier
git diff fichier.tsx
```

---

## 📁 PowerShell - Gestion des Fichiers

### Navigation

```bash
# Voir le répertoire courant
pwd

# Lister les fichiers
ls
Get-ChildItem

# Lister avec détails
ls -Force

# Changer de répertoire
cd app
cd ..
cd ~
```

### Création et Suppression

```bash
# Créer un dossier
New-Item -ItemType Directory -Path "nouveau-dossier"
mkdir nouveau-dossier

# Créer un fichier
New-Item -ItemType File -Path "fichier.txt"

# Supprimer un fichier
Remove-Item fichier.txt

# Supprimer un dossier
Remove-Item -Path "dossier" -Recurse -Force

# Copier un fichier
Copy-Item source.txt destination.txt

# Déplacer un fichier
Move-Item source.txt destination.txt
```

### Recherche

```bash
# Rechercher un fichier
Get-ChildItem -Recurse -Filter "*.tsx"

# Rechercher dans le contenu
Select-String -Path "*.tsx" -Pattern "Button"

# Compter les lignes d'un fichier
(Get-Content fichier.tsx).Count
```

---

## 🔍 Debugging et Logs

### Next.js

```bash
# Lancer avec les logs détaillés
npm run dev -- --debug

# Voir les variables d'environnement
$env:NODE_ENV

# Définir une variable d'environnement
$env:NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Node.js

```bash
# Voir la version de Node
node --version

# Voir la version de npm
npm --version

# Nettoyer le cache npm
npm cache clean --force

# Vérifier l'intégrité des packages
npm cache verify
```

---

## 📊 Analyse et Performance

### Bundle Analyzer

```bash
# Installer le bundle analyzer
npm install -D @next/bundle-analyzer

# Analyser le bundle
ANALYZE=true npm run build
```

### Lighthouse

```bash
# Installer Lighthouse
npm install -g lighthouse

# Analyser une page
lighthouse http://localhost:3000 --view
```

---

## 🧪 Tests (À configurer)

### Jest

```bash
# Installer Jest
npm install -D jest @testing-library/react @testing-library/jest-dom

# Lancer les tests
npm test

# Lancer en mode watch
npm test -- --watch

# Voir la couverture
npm test -- --coverage
```

### Playwright

```bash
# Installer Playwright
npm install -D @playwright/test

# Lancer les tests E2E
npx playwright test

# Lancer en mode UI
npx playwright test --ui
```

---

## 🔐 Variables d'Environnement

### Gestion

```bash
# Copier le template
Copy-Item .env.example .env.local

# Éditer les variables
notepad .env.local

# Voir les variables (PowerShell)
Get-Content .env.local
```

### Variables Next.js

```bash
# Variables publiques (accessibles côté client)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Variables privées (serveur uniquement)
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret123
```

---

## 📦 Déploiement

### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Build Local

```bash
# Build complet
npm run build

# Tester le build localement
npm start

# Vérifier la taille du build
Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum
```

---

## 🛠️ Maintenance

### Mise à Jour

```bash
# Mettre à jour Next.js
npm install next@latest react@latest react-dom@latest

# Mettre à jour TypeScript
npm install -D typescript@latest

# Mettre à jour Tailwind
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Mettre à jour toutes les dépendances (attention)
npm update --save
```

### Nettoyage

```bash
# Nettoyer les fichiers temporaires
Remove-Item -Path ".next", "node_modules/.cache" -Recurse -Force

# Réinstaller les dépendances
Remove-Item -Path "node_modules", "package-lock.json" -Recurse -Force
npm install
```

---

## 📝 Utilitaires Rapides

### Création Rapide

```bash
# Créer un nouveau composant
@"
interface Props {
  children: React.ReactNode;
}

export default function Component({ children }: Props) {
  return <div>{children}</div>;
}
"@ | Out-File -FilePath "components/Component.tsx"
```

### Statistiques

```bash
# Compter les lignes de code TypeScript
(Get-ChildItem -Recurse -Filter "*.tsx" | Get-Content).Count

# Compter les fichiers TypeScript
(Get-ChildItem -Recurse -Filter "*.tsx").Count

# Taille du projet
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum
```

---

## 🆘 Dépannage

### Problèmes Courants

```bash
# Port déjà utilisé
# Solution : Utiliser un autre port
npm run dev -- -p 3001

# Erreur de cache
# Solution : Nettoyer le cache
Remove-Item -Path ".next" -Recurse -Force
npm run dev

# Erreur de dépendances
# Solution : Réinstaller
Remove-Item -Path "node_modules" -Recurse -Force
npm install

# Erreur TypeScript
# Solution : Vérifier les types
npx tsc --noEmit

# Erreur ESLint
# Solution : Corriger automatiquement
npm run lint -- --fix
```

---

## 📚 Références

- [Next.js CLI](https://nextjs.org/docs/app/api-reference/next-cli)
- [npm Documentation](https://docs.npmjs.com/)
- [Git Documentation](https://git-scm.com/doc)
- [PowerShell Documentation](https://docs.microsoft.com/powershell/)

---

**Dernière mise à jour :** Février 2026
