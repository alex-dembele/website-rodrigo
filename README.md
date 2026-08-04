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
- `payment.depositPercent` : pourcentage d'acompte demandé (30 % par défaut).

### 2. Voitures et prix → `lib/vehicles.ts`

- `pricePerDay` : prix **par jour, en FCFA** (nombre, sans espace : `25000`).
- `variant` : précision affichée sous le nom (`Boîte manuelle`, `Boîte automatique`).
- `bestFor` : la phrase qui aide le client à choisir, affichée sur la carte.
- `DRIVER_PRICE_PER_DAY` : supplément chauffeur par jour.
- `available: false` + `comingSoon: true` : voiture pas encore dispo (ex. la Hilux).
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
- `sitemap.xml` et `robots.txt` générés automatiquement.
- **⚠️ Avant la mise en ligne**, change l'URL du site dans `lib/site.ts` (`url`) avec ton vrai domaine.

---

## 📁 Structure

- `app/` : pages (accueil, `/vehicles`, `/tarifs`, `/services`, `/reservation`, `/about`, `/contact`, `/blog`).
- `components/` : composants (Navbar, Footer, formulaire de réservation, cartes voitures…).
- `lib/site.ts` : **config à éditer** (contacts, paiement).
- `lib/vehicles.ts` : **flotte à éditer** (voitures, prix).
- `lib/booking.ts` : calcul des prix et génération du message WhatsApp/email.
- `public/` : images publiées (photos, logo, icônes).
- `assets-source/` : originaux fournis par le client (non publiés).
- `scripts/prepare-assets.py` : découpe des photos et génération des images de marque.
- `tests/` : tests Playwright du parcours de réservation et des pages.

---

© Rodrigo Services — Location de voiture à Douala.
