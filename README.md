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

---

## ✏️ Ce que tu peux modifier facilement (sans être développeur)

Tout est regroupé dans le dossier `lib/`. Change juste les valeurs.

### 1. Coordonnées, WhatsApp, numéros Orange Money / MoMo → `lib/site.ts`

- `phone`, `email`, `address` : tes coordonnées.
- `whatsapp` : ton numéro **au format international sans espaces ni +** (ex. `237676712191`).
- `payment.momo.number` et `payment.orange.number` : **⚠️ mets tes vrais numéros marchands.**
  > Le numéro Orange Money est un exemple (`+237 6XX…`) : remplace-le par le tien.
- `payment.depositPercent` : pourcentage d'acompte demandé (30 % par défaut).

### 2. Voitures et prix → `lib/vehicles.ts`

- `pricePerDay` : prix **par jour, en FCFA** (nombre, sans espace : `25000`).
- `DRIVER_PRICE_PER_DAY` : supplément chauffeur par jour.
- `available: false` + `comingSoon: true` : voiture pas encore dispo (ex. la Hilux).

### 3. Photos des voitures → dossier `public/cars/`

Les images actuelles sont des **provisoires**. Remplace-les par tes vraies photos
**en gardant exactement les mêmes noms de fichiers** :

| Fichier | Voiture |
|---|---|
| `public/cars/avensis-1.jpg` | Toyota Avensis (photo principale) |
| `public/cars/avensis-2.jpg` | Toyota Avensis (2e photo) |
| `public/cars/rav4-1.jpg` | Toyota RAV4 |
| `public/cars/hilux-1.jpg` | Toyota Hilux |
| `public/hero.jpg` | Grande photo d'accueil (optionnel) |

> Formats conseillés : `.jpg`, largeur ~1200 px, format paysage 4:3.
> Le logo est vectoriel (`components/Logo.tsx`). Pour utiliser ton logo image à la place,
> dépose-le dans `public/brand/logo.png`.

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
- `public/` : images, logo, favicon.

---

© Rodrigo Services — Location de voiture à Douala.
