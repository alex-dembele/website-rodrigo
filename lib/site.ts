/**
 * Configuration centrale de Rodrigo Services.
 * ⚠️ MODIFIE UNIQUEMENT LES VALEURS CI-DESSOUS pour mettre à jour tout le site
 * (numéros de téléphone, WhatsApp, Orange Money / MTN MoMo, adresse, etc.).
 */

export const site = {
  name: 'Rodrigo Services',
  legalName: 'Rodrigo Services – Location de voiture',
  tagline: 'Location de voiture à Douala, avec ou sans chauffeur',
  description:
    "Rodrigo Services loue des voitures fiables et abordables à Douala : Toyota Avensis en boîte manuelle ou automatique, SUV Toyota RAV4 et bientôt un pick-up Hilux tout-terrain. Avec ou sans chauffeur, transfert aéroport, paiement Orange Money & MTN MoMo.",

  // URL du site en production (à mettre à jour quand tu auras ton domaine)
  url: 'https://www.rodrigoservices.cm',

  // --- Contacts ---
  // Numéro appelé depuis le site (agence de Douala)
  phone: '+237 676 71 21 91',
  // Numéro WhatsApp de l'agence — c'est lui qui reçoit les réservations
  whatsappDisplay: '+49 1577 2809304',
  // Même numéro au format wa.me : international, sans "+" ni espaces
  whatsapp: '4915772809304',
  email: 'rodrigoservices39@gmail.com',

  // --- Adresse ---
  address: 'Terminus Bonamoussadi, face Hôtel Merveille',
  city: 'Douala',
  country: 'Cameroun',
  // Coordonnées approximatives de Bonamoussadi (Douala) — pour le SEO local
  geo: { lat: 4.0921, lng: 9.7454 },
  mapsQuery: 'Rodrigo Services Terminus Bonamoussadi Douala',

  // --- Paiement Mobile Money ---
  // `holder` = nom exact du bénéficiaire affiché par l'opérateur avant validation ;
  // le client doit pouvoir le vérifier avant d'envoyer l'acompte.
  // ⚠️ Laisse `number` vide tant qu'un numéro n'est pas connu : le site affiche
  // alors « communiqué à la confirmation » au lieu d'un faux numéro.
  payment: {
    momo: {
      label: 'MTN Mobile Money',
      number: '+237 676 71 21 91',
      holder: 'Rodrigo Services',
      ussd: '*126#'
    },
    orange: {
      label: 'Orange Money',
      number: '+237 695 85 99 80',
      holder: 'Emmanuel Nations',
      ussd: '#150#'
    },
    // Acompte demandé pour valider une réservation (en %)
    depositPercent: 30
  },

  // --- Réseaux sociaux (laisse "#" si tu n'en as pas encore) ---
  social: {
    facebook: '#',
    instagram: '#',
    tiktok: '#'
  }
};

// Lien WhatsApp prêt à l'emploi avec message pré-rempli
export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Lien d'appel nettoyé : "+237 676 71 21 91" -> "tel:+237676712191"
export function telLink(number: string = site.phone) {
  return `tel:${number.replace(/[^\d+]/g, '')}`;
}

// Formatage des montants en francs CFA : 25000 -> "25 000 FCFA"
export function fcfa(amount: number) {
  const n = new Intl.NumberFormat('fr-FR').format(Math.round(amount)).replace(/[  ]/g, ' ');
  return `${n} FCFA`;
}
