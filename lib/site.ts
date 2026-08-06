/**
 * Configuration centrale de Rodrigo Auto Services.
 *
 * Les valeurs sont dans `content/settings.json` : c'est ce fichier que
 * l'espace d'administration modifie. On peut aussi l'éditer à la main.
 */
import settings from '@/content/settings.json';

export const site = settings;

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
  const n = new Intl.NumberFormat('fr-FR').format(Math.round(amount)).replace(/[  ]/g, ' ');
  return `${n} FCFA`;
}
