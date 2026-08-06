# Rodrigo Services — Location de voiture à Douala

Site web de **Rodrigo Services**, petite entreprise de location de voiture à Douala (Cameroun) :
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

## ✏️ Ce que tu peux modifier facilement (sans être développeur)

Tout est regroupé dans le dossier `lib/`. Change juste les valeurs.

### 1. Coordonnées, WhatsApp, numéros Orange Money / MoMo → `lib/site.ts`

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

### 2. Voitures et prix → `lib/vehicles.ts`

- `pricePerDay` : prix **par jour, en FCFA** (nombre, sans espace : `25000`).
- `variant` : précision affichée sous le nom (`Boîte manuelle`, `Boîte automatique`).
- `bestFor` : la phrase qui aide le client à choisir, affichée sur la carte.
- `DRIVER_PRICE_PER_DAY` : supplément chauffeur par jour.
- `available: false` + `comingSoon: true` : voiture annoncée mais pas encore en service.
  Elle apparaît avec le badge « Bientôt » et sans bouton de réservation.
- `gallery: []` : pas encore de photo → le site affiche un cadre « photos bientôt
  disponibles » au lieu d'une image trompeuse.

### 3. Photos des voitures → dossier `public/cars/`

Les photos viennent des planches fournies par le client, rangées dans `assets-source/`
(ce dossier n'est pas publié). Le script de préparation les découpe, rogne le fond
studio, détoure le logo et régénère l'image de partage :

```bash
python3 scripts/prepare-assets.py   # nécessite Pillow : pip install Pillow
```

Pour ajouter une voiture : dépose ses photos dans `public/cars/` (`.jpg`, ~1200 px de
large) et liste-les dans le champ `gallery` du véhicule.

| Fichier | Voiture |
|---|---|
| `public/cars/avensis-manuelle-*.jpg` | Toyota Avensis boîte manuelle |
| `public/cars/avensis-auto-*.jpg` | Toyota Avensis boîte automatique |
| `public/cars/rav4-*.jpg` | Toyota RAV4 |
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
- **⚠️ Avant la mise en ligne**, change l'URL du site dans `lib/site.ts` (`url`) avec ton vrai domaine.

Le référencement technique ne suffit pas à sortir premier sur « location de voiture à
Douala » : il faut aussi une **fiche Google Business Profile** vérifiée à l'adresse de
l'agence, des avis clients réguliers et quelques liens depuis des sites camerounais.

---

## 📁 Structure

- `app/` : pages (accueil, `/vehicles`, `/tarifs`, `/services`, `/reservation`, `/about`,
  `/contact`, `/blog` et `/blog/[slug]` pour les articles).
- `components/` : composants (Navbar, Footer, formulaire de réservation, cartes voitures…).
- `lib/site.ts` : **config à éditer** (contacts, paiement).
- `lib/vehicles.ts` : **flotte à éditer** (voitures, prix).
- `lib/articles.ts` : **articles à éditer** (conseils publiés sur `/blog`).
- `lib/booking.ts` : calcul des prix et génération du message WhatsApp/email.
- `public/` : images publiées (photos, logo, icônes).
- `assets-source/` : originaux fournis par le client (non publiés).
- `scripts/prepare-assets.py` : découpe des photos et génération des images de marque.
- `tests/` : tests Playwright du parcours de réservation et des pages.

---

© Rodrigo Services — Location de voiture à Douala.
