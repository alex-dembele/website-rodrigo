# Rodrigo Services – Mobilité d'Exception au Cameroun 🏎️

![Rodrigo Services](https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80)

Bienvenue sur le dépôt officiel du site **Rodrigo Services**, une plateforme premium de location de véhicules et de services de transfert aéroport, basée à Douala au Cameroun.

Le projet a été intégralement pensé et réalisé avec une esthétique **Luxe / Brutaliste** (Inspiration Apple Store & Awwwards), en combinant le *glassmorphism*, les *grilles Bento* asymétriques et des typographies cinématiques.

## ✨ Caractéristiques Visuelles & Fonctionnalités

- **Thème "Midnight & Gold"** : Un fond d'écran obsidienne texturé, réchauffé par des halos dorés incandescents rappelant les phares de véhicules haut de gamme.
- **Grilles Bento & Typographie "Clash Display"** : Design asymétrique de l'information avec des en-têtes architecturaux colossaux.
- **Tunnel de Réservation Immersif** : Un composant d'encaissement luxueux à écran scindé (Layout Apple Store) avec "Floating Labels".
- **Composants "Awwwards-style"** : Carrousel de voitures infini, animations fluides (`mix-blend-screen`), et bordures ultra-fines (`border-white/[0.05]`).
- **Full Responsive** : L'expérience reste exceptionnelle, fluide et lisible, d'un écran 4K à un iPhone.

## 🚀 Technologies Embarquées

| Technologie | Description |
|---|---|
| **[Next.js 14](https://nextjs.org/)** | Framework React propulsé par l'App Router pour une navigation fluide et un SEO optimal. |
| **[Tailwind CSS](https://tailwindcss.com/)** | Styling utilitaire ultra-rapide, finement configuré avec notre propre *Design System*. |
| **[Framer Motion](https://www.framer.com/motion/)** | Animations interactives, fluides et professionnelles au défilement. |
| **[TypeScript](https://www.typescriptlang.org/)** | Typage statique robuste protégeant l'intégrité du code (`Vehicle` interfaces, etc). |

## 🛠️ Installation & Démarrage

### Pré-requis
- Node.js (version 18+ recommandée)
- Npm, Yarn, ou Pnpm

### Instructions

1. **Cloner le répertoire**
   ```bash
   git clone https://github.com/alex-dembele/website-rodrigo.git
   cd website-rodrigo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Allumer les moteurs**
   ```bash
   npm run dev
   ```

4. **Explorer**
   Ouvrez `http://localhost:3000` sur votre navigateur pour lancer l'expérience.

## 📁 Architecture du Projet

- `app/` : Définition des pages Next.js (`/`, `/vehicles`, `/services`, `/contact`, `/about`...).
- `components/` : Tous nos composants modulaires (Hero, Bento Grids, Formulaires de paiement...).
- `lib/` : Utilitaires et structure de données locale (La base de la flotte).
- `public/` : Assets statiques et iconographie.

---
*© 2026 Rodrigo Services. L'Élégance en Mouvement.*
