# TODO - Projet site "Aliénor & Nova"

## 🟣 Préparatifs (à faire une seule fois)

-   [x] Configurer VS Code : extensions utiles (Live Server, Prettier…)
-   [x] Installer Node.js et NPM
-   [x] Installer Git + GitHub Desktop
-   [x] Créer un dépôt GitHub pour le projet
-   [x] Initialiser le projet localement + commit de base
-   [x] Vérifier que Live Reload fonctionne avec Live Server dans le navigateur cible

---

## 🌸 Étape 1 – Structure & Design de base

-   [ ] Créer l’arborescence HTML de base (header / main / footer)
-   [x] Ajouter Bootstrap (via Sass personnalisé)
-   [ ] Définir les couleurs dominantes : violet (fond), rose (éléments), gris clair + noir (texte)
-   [ ] Créer les fichiers CSS personnalisés (via compilation Sass)
-   [ ] Marquage couleur des dialogues Aliénor / Nova + mots-clés
-   [ ] Vérifier la sémantique HTML pour l’accessibilité (screen reader, etc.)
-   [ ] Préparer la portabilité (responsive design pour mobile / tablette / desktop)
-   [x] Live reload actif à cette étape
-   [ ] Choisir les typos et tester leur rendu sur site
-   [ ] Ajouter un favicon / logo perso

---

## 📋 Étape 2 – Questionnaire à choix multiples

-   [ ] Implémenter le QCM en HTML + JS
-   [ ] Réactions dynamiques : vert si bon, rouge si faux
-   [ ] Pas de base de données requise à ce stade
-   [ ] Ajouter une page de correction ou des explications après validation (si souhaité)

---

## 🧁 Étape 3 – Camembert interactif (votes utilisateurs)

-   [ ] Créer une version statique du camembert avec Chart.js
-   [ ] Relier aux boutons cliquables (choix utilisateur)
-   [ ] Utiliser LocalStorage pour stocker le vote côté utilisateur
-   [ ] Masquer la légende jusqu’à ce que le vote soit soumis
-   [ ] Afficher la version mise à jour du camembert après vote
-   [ ] Installer Express (npm) et créer un serveur Node.js
-   [ ] Installer MongoDB (ou version cloud gratuite)
-   [ ] Connecter Express à MongoDB avec Mongoose
-   [ ] Créer une API (GET/POST) pour récupérer et enregistrer les votes
-   [ ] Remplacer les données factices du camembert par celles issues de la base
-   [ ] Déployer l’API (si hébergement distant)

---

## 🎨 Étape 4 – Design & Animation

-   [ ] Ajouter des animations JS : reflets dynamiques sur les boutons, transitions douces
-   [ ] Ajouter une animation visuelle discrète sur le camembert lors de la mise à jour

---

## 🚀 Étape 5 – Déploiement

-   [ ] Choisir un hébergeur (GitHub Pages, Netlify, Vercel…)
-   [ ] Vérifier le bon affichage sur différents navigateurs (Chrome, Firefox, Edge…)
-   [ ] Vérifier le rendu sur différentes tailles d’écran (desktop, tablette, smartphone)
-   [ ] Mettre en place les balises meta SEO (titre, description, opengraph…)

---

## 🛠️ Maintenance

-   [ ] Migrer les `@import` Sass vers `@use` (préparer compatibilité Dart Sass >= 3.0.0)

---

## 🧹 À fignoler

-   Remplacer le bouton d’entrée par un SVG animé de livre qui s’ouvre
-   Choisir définitivement la police pour la narration (Poiret One vs Bellota Text)
-   Title sur les icônes footer

## 💭 Réflexions en cours / à décider

### B. Structure modulaire

-   Réutiliser header / footer via `fetch()` ou templating dynamique ?
-   Faut-il envisager un moteur de template côté backend (si le site s’agrandit) ?

### C. Tests et portabilité

-   Utiliser un site externe (type Screenfly / Responsively App) pour tester responsive ?
-   Faut-il que le site soit déjà déployé pour ces outils ? (→ Oui, souvent)

### D. Stockage / vie privée / accessibilité

-   Politique de confidentialité à rédiger si données stockées ?
-   Faut-il anonymiser les votes (IP/logs) ?

### F. Gestion des assets

-   Où stocker les icônes personnalisées ? (GitHub ? Dossier local ?)
-   Faut-il prévoir une nomenclature stricte pour les fichiers visuels ?

✅ Mise à jour automatique du camembert depuis la base de données sur toutes les pages : à gérer avec Chart.js + appel API centralisé.
