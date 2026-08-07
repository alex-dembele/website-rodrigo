# Rodrigo Auto Services — Location de voiture à Douala

Site web de **Rodrigo Auto Services**, petite entreprise de location de voiture à Douala (Cameroun) :
location avec ou sans chauffeur, transfert aéroport, paiement **Orange Money & MTN Mobile Money**.

Site construit avec **Next.js 15** + **Tailwind CSS** + **TypeScript**.

---

## 🚀 Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Pour la version de production :

```bash
npm run build
npm start
```

Pour vérifier que tout marche encore (parcours de réservation, pages, images) :

```bash
npx playwright install chromium   # une seule fois
npm test                          # build + serveur + tests, sur ordinateur et mobile
```

---

## 🔑 L'espace de gestion — la façon la plus simple

Le gérant modifie le site lui-même depuis **`/admin`**, sans rien installer et depuis
son téléphone : ajouter une voiture avec ses photos, changer un prix, masquer une
voiture louée, corriger un numéro de téléphone ou un compte Mobile Money.

Chaque enregistrement écrit un commit dans ce dépôt et l'hébergeur reconstruit le
site : **compter 1 à 2 minutes** avant que la modification soit visible en ligne.

### Mise en service (une seule fois)

1. Créer un jeton GitHub **fine-grained** limité à ce dépôt, permission
   « Contents: Read and write ».
2. Sur Vercel → *Settings* → *Environment Variables*, définir les variables listées
   dans [`.env.example`](.env.example) : `ADMIN_PASSWORD`, `GITHUB_TOKEN`,
   `GITHUB_REPO`, `GITHUB_BRANCH`.
3. Redéployer. `/admin` est alors actif ; sans `ADMIN_PASSWORD`, la page affiche
   « pas encore activé » et refuse toute connexion.

Le mot de passe n'est jamais envoyé au navigateur : la page reçoit seulement
l'information qu'un mot de passe existe. La session est un cookie signé qui expire
au bout de 12 heures, et `/admin` est exclu des moteurs de recherche.

> Changer le mot de passe déconnecte automatiquement tout le monde.

---

## ✏️ Modifier le contenu à la main (développeur)

L'espace de gestion écrit dans `content/`. On peut aussi éditer ces fichiers
directement.

### 1. Coordonnées, WhatsApp, numéros Orange Money / MoMo → `content/settings.json`

- `phone`, `email`, `address` : tes coordonnées.
- `whatsapp` : le numéro qui **reçoit les réservations**, au format international sans
  espaces ni `+` (actuellement `4915772809304`). `whatsappDisplay` est la version
  lisible affichée sur le site.
- `payment.momo.number` et `payment.orange.number` : tes numéros marchands.
  > Laisse la valeur **vide** (`''`) tant que tu n'as pas le numéro : le site affiche
  > « Numéro communiqué à la confirmation » plutôt qu'un faux numéro.
- `payment.momo.holder` / `payment.orange.holder` : le nom du bénéficiaire tel que
  l'opérateur l'affiche avant validation. Il est montré au client pour qu'il vérifie
  avant d'envoyer l'argent — les deux comptes peuvent être à des noms différents.
- `payment.depositPercent` : pourcentage d'acompte demandé (30 % par défaut).
- `driverPricePerDay` : supplément chauffeur, par jour.

`lib/site.ts` se contente de relire ce fichier : il n'y a rien à changer dans le code.

### 2. Voitures et prix → `content/vehicles/`

Une voiture = un fichier `content/vehicles/<identifiant>.json`. Pour en **ajouter** une :

```bash
npm run voiture:ajouter
```

La commande pose les questions une par une, prépare les photos (redimensionnement,
compression, rognage du fond studio, renommage) et écrit la fiche. Il ne reste
qu'à relire, tester et pousser.

Pour **modifier** un prix ou retirer une voiture de la location, ouvre son fichier :

- `pricePerDay` : prix **par jour, en FCFA** (nombre, sans espace ni « FCFA » : `25000`).
- `variant` : précision affichée sous le nom (`Boîte manuelle`, `Boîte automatique`).
- `bestFor` : la phrase qui aide le client à choisir, affichée sur la carte.
- `order` : ordre d'affichage sur le site (le plus petit en premier).
- `available: false` : la voiture disparaît du formulaire de réservation.
  Avec `comingSoon: true`, elle reste visible avec le badge « Bientôt ».
- `gallery: []` : pas encore de photo → cadre « photos bientôt disponibles » au lieu
  d'une image trompeuse. Interdit si la voiture est disponible.

Le supplément chauffeur se règle dans `content/settings.json` (`driverPricePerDay`).

> Les fiches sont **vérifiées avant chaque `dev`, `build` et `test`** : prix numérique,
> type connu, identifiant unique, photos réellement présentes. Une erreur de saisie
> arrête la construction avec un message en clair — elle ne peut pas arriver en ligne.
> Pour vérifier sans rien lancer d'autre : `npm run flotte:generer`.
>
> `lib/vehicles.data.ts` est **généré** à partir de ces fiches : ne le modifie pas à la main.

### 3. Photos des voitures → dossier `public/cars/`

Les photos viennent des planches fournies par le client, rangées dans `assets-source/`
(ce dossier n'est pas publié). Le script de préparation les découpe, rogne le fond
studio, détoure le logo et régénère l'image de partage :

```bash
python3 scripts/prepare-assets.py   # nécessite Pillow : pip install Pillow
```

Pour une nouvelle voiture, laisse plutôt `npm run voiture:ajouter` s'occuper des photos :
il accepte des photos de téléphone brutes et les prépare (1400 px max, ~50 Ko chacune).

| Fichier | Voiture |
|---|---|
| `public/cars/avensis-manuelle-*.jpg` | Toyota Avensis boîte manuelle |
| `public/cars/avensis-auto-*.jpg` | Toyota Avensis boîte automatique |
| `public/cars/rav4-*.jpg` | Toyota RAV4 |
| `public/cars/hilux-*.jpg` | Toyota Hilux double cabine |
| `public/brand/mark.png` | Monogramme du logo (en-tête, icônes) |
| `public/og.jpg` | Image affichée quand on partage le lien |

### 4. Articles de conseils → `lib/articles.ts`

Chaque article est un objet : `slug` (l'adresse `/blog/mon-article`), `title`,
`description` (pour Google), `excerpt`, `date`, et `body`, une liste de blocs.

| Bloc | Rendu |
|---|---|
| `{ p: '…' }` | un paragraphe |
| `{ h2: '…' }` | un titre de section |
| `{ ul: ['…', '…'] }` | une liste à puces |
| `{ ol: ['…', '…'] }` | une liste numérotée |
| `{ note: '…' }` | un encadré rouge (avertissement, astuce) |

Le champ `faq` alimente la rubrique « Questions fréquentes » **et** les données
structurées lues par Google. Les prix cités dans les articles sont calculés depuis
`lib/vehicles.ts` : ils se mettent à jour tout seuls quand un tarif change.

Pour ajouter un article, copie un objet existant et change le `slug` — la page, le
lien dans la liste, l'aperçu de l'accueil et le sitemap suivent automatiquement.

---

## 💳 Paiement (Orange Money & MTN MoMo)

Il n'y a **pas d'API de paiement** branchée (choix assumé, gratuit et immédiat) :

1. Le client remplit le formulaire de réservation.
2. Il envoie sa demande par **WhatsApp** (ou email) en un clic — le message contient
   voiture, dates, durée, total et acompte, déjà calculés.
3. Il paie l'**acompte** par Orange Money / MoMo au numéro affiché.
4. Tu confirmes la réservation à la main.

> 💡 Plus tard, si tu veux l'encaissement **automatique** OM+MoMo, on peut brancher un
> agrégateur camerounais (Fapshi, Campay, Notch Pay). Le code est déjà organisé pour ça.

---

## 🔎 Référencement (SEO)

- Métadonnées + Open Graph par page (`app/layout.tsx` et chaque page).
- Données structurées `AutoRental` (Google) dans `app/layout.tsx`.
- `BlogPosting`, `FAQPage` et `BreadcrumbList` sur chaque article de conseils.
- `sitemap.xml` et `robots.txt` générés automatiquement, articles compris.
- **⚠️ Avant la mise en ligne**, change l'URL du site dans `content/settings.json` (`url`) avec ton vrai domaine.

Le référencement technique ne suffit pas à sortir premier sur « location de voiture à
Douala » : il faut aussi une **fiche Google Business Profile** vérifiée à l'adresse de
l'agence, des avis clients réguliers et quelques liens depuis des sites camerounais.

---

## 📁 Structure

- `app/` : pages (accueil, `/vehicles`, `/tarifs`, `/services`, `/reservation`, `/about`,
  `/contact`, `/blog` et `/blog/[slug]` pour les articles).
- `components/` : composants (Navbar, Footer, formulaire de réservation, cartes voitures…).
- `content/settings.json` : **config à éditer** (contacts, paiement, acompte).
- `lib/admin/` : session, écriture GitHub et validation de l'espace de gestion.
- `app/admin/` + `components/admin/` : l'espace de gestion lui-même.
- `content/vehicles/` : **flotte à éditer** (une voiture = un fichier JSON).
- `lib/vehicles.ts` : types de la flotte et supplément chauffeur.
- `lib/vehicles.data.ts` : *généré* depuis `content/vehicles/` — ne pas modifier.
- `lib/articles.ts` : **articles à éditer** (conseils publiés sur `/blog`).
- `lib/booking.ts` : calcul des prix et génération du message WhatsApp/email.
- `public/` : images publiées (photos, logo, icônes).
- `assets-source/` : originaux fournis par le client (non publiés).
- `scripts/prepare-assets.py` : découpe des photos et génération des images de marque.
- `scripts/build-vehicles.mjs` : vérifie les fiches de voitures et génère `lib/vehicles.data.ts`.
- `scripts/add-vehicle.py` : la commande `npm run voiture:ajouter`.
- `tests/` : tests Playwright du parcours de réservation et des pages.

---

© Rodrigo Auto Services — Location de voiture à Douala.
