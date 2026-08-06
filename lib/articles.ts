import { site, fcfa } from './site';
import { DRIVER_PRICE_PER_DAY, findVehicle } from './vehicles';

/** Blocs de contenu d'un article. Un seul champ par bloc. */
export type Block =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { note: string };

export interface Article {
  slug: string;
  title: string;
  /** Titre court pour la balise <title> et les listes */
  shortTitle: string;
  description: string;
  excerpt: string;
  /** Date de publication au format ISO (yyyy-mm-dd) */
  date: string;
  readingMinutes: number;
  body: Block[];
  faq: { q: string; a: string }[];
}

const avensis = findVehicle('avensis-manuelle');
const rav4 = findVehicle('rav4');
const avensisPrice = avensis?.pricePerDay ?? 25000;
const rav4Price = rav4?.pricePerDay ?? 40000;

export const articles: Article[] = [
  {
    slug: 'louer-une-voiture-a-douala',
    title: 'Louer une voiture à Douala : comment ça marche',
    shortTitle: 'Louer une voiture à Douala',
    description:
      'Papiers à prévoir, acompte, remise du véhicule, carburant, restitution : le déroulé complet d’une location de voiture à Douala chez Rodrigo Services.',
    excerpt:
      'Papiers à prévoir, caution, prise en charge du véhicule et restitution : le déroulé complet d’une location chez Rodrigo Services.',
    date: '2026-07-09',
    readingMinutes: 5,
    body: [
      {
        p: `Louer une voiture à Douala n’a rien de compliqué quand on sait à quoi s’attendre. Voici, étape par étape, comment se déroule une location chez ${site.name}, de la demande jusqu’au retour de la voiture.`
      },
      { h2: '1. Ce qu’il faut prévoir avant de réserver' },
      {
        p: 'Trois choses suffisent pour démarrer : une pièce d’identité, un moyen de paiement Mobile Money et, si tu conduis toi-même, un permis de conduire en cours de validité.'
      },
      {
        ul: [
          'Une pièce d’identité (CNI ou passeport) — une photo lisible envoyée sur WhatsApp suffit pour la réservation, l’original est présenté à la remise des clés.',
          'Ton permis de conduire, uniquement si tu prends la voiture sans chauffeur.',
          'Un compte Orange Money ou MTN MoMo pour l’acompte.',
          'Tes dates et ton lieu de prise en charge : agence, aéroport, ou une adresse dans Douala.'
        ]
      },
      {
        note: 'Une caution peut être demandée selon la durée et le véhicule. Son montant t’est annoncé au moment où l’on confirme ta réservation — jamais après.'
      },
      { h2: '2. Choisir la bonne voiture' },
      {
        p: `La flotte est volontairement simple : deux Toyota Avensis (berline, en boîte manuelle ou automatique) à ${fcfa(
          avensisPrice
        )} par jour, et un Toyota RAV4 (SUV) à ${fcfa(rav4Price)} par jour.`
      },
      {
        ul: [
          `L’Avensis en boîte manuelle : le meilleur rapport qualité-prix pour la ville, les rendez-vous professionnels et les trajets en famille.`,
          `L’Avensis en boîte automatique : la même berline, beaucoup plus reposante dans les embouteillages de Douala.`,
          `Le RAV4 : surélevé et robuste, à privilégier pour les routes dégradées, les sorties hors de Douala et les gros bagages.`
        ]
      },
      { h2: '3. Réserver et bloquer la voiture' },
      {
        p: 'Depuis la page de réservation, tu choisis la voiture, tes dates, le lieu de prise en charge et la formule (avec ou sans chauffeur). Le total et l’acompte s’affichent immédiatement, avant tout engagement.'
      },
      {
        ol: [
          'Tu envoies ta demande : elle arrive sur notre WhatsApp avec toutes les informations déjà remplies.',
          'On vérifie la disponibilité réelle du véhicule sur tes dates et on te répond.',
          `Tu envoies l’acompte de ${site.payment.depositPercent} % par Orange Money ou MTN MoMo : la voiture est bloquée à ton nom.`,
          'Tu gardes le SMS de confirmation de l’opérateur, c’est ta preuve de paiement.'
        ]
      },
      {
        p: 'Tant que l’acompte n’est pas envoyé, la voiture reste disponible pour d’autres clients. C’est le seul moyen de la réserver vraiment, surtout en fin de semaine et pendant les fêtes.'
      },
      { h2: '4. La remise du véhicule' },
      {
        p: `Tu récupères la voiture à l’agence, ${site.address}, ou on te la livre à l’endroit convenu — l’aéroport international de Douala, ton hôtel ou ton bureau. On fait ensemble le tour du véhicule avant le départ.`
      },
      {
        ul: [
          'État de la carrosserie, des pneus et de l’intérieur, photos à l’appui.',
          'Niveau de carburant au départ : la voiture se rend avec le même niveau.',
          'Vérification des papiers du véhicule, qui restent dans la voiture.',
          'Le solde de la location se règle à ce moment-là.'
        ]
      },
      { h2: '5. Pendant la location' },
      {
        p: 'Le carburant est à ta charge, comme partout. Si tu prévois de sortir de Douala — Kribi, Yaoundé, Buea, Bafoussam — préviens-nous à la réservation : le trajet se discute selon la distance, et certaines routes se font mieux en RAV4 qu’en berline.'
      },
      {
        p: 'En cas de souci mécanique, de crevaison ou d’accident, appelle-nous tout de suite. On règle le problème avec toi ; ne fais jamais réparer sans nous prévenir.'
      },
      { h2: '6. La restitution' },
      {
        p: 'Tu ramènes la voiture à la date convenue, au même endroit, avec le même niveau de carburant. On refait le tour du véhicule et la caution éventuelle t’est rendue dans la foulée.'
      },
      {
        p: 'Besoin de prolonger ? Envoie un message avant la fin de ta location : si la voiture n’est pas déjà réservée, on prolonge sans refaire toute la procédure.'
      },
      { h2: 'Combien ça coûte, concrètement' },
      {
        p: `Trois jours en Avensis sans chauffeur : ${fcfa(avensisPrice * 3)}, dont ${fcfa(
          Math.round((avensisPrice * 3 * site.payment.depositPercent) / 100)
        )} d’acompte. Les mêmes trois jours avec chauffeur : ${fcfa(
          (avensisPrice + DRIVER_PRICE_PER_DAY) * 3
        )}, le chauffeur étant facturé ${fcfa(DRIVER_PRICE_PER_DAY)} par jour. Aucun frais de dossier, aucune commission cachée.`
      }
    ],
    faq: [
      {
        q: 'Quels documents faut-il pour louer une voiture à Douala ?',
        a: 'Une pièce d’identité (CNI ou passeport) et, pour conduire soi-même, un permis de conduire valide. Une caution peut être demandée selon la durée et le véhicule.'
      },
      {
        q: 'Faut-il payer la totalité à l’avance ?',
        a: `Non. Un acompte de ${site.payment.depositPercent} % par Orange Money ou MTN MoMo bloque la voiture, et le solde se règle à la remise du véhicule.`
      },
      {
        q: 'Peut-on récupérer la voiture à l’aéroport de Douala ?',
        a: 'Oui. La prise en charge à l’aéroport international de Douala se choisit directement dans le formulaire de réservation, comme la livraison à une adresse en ville.'
      }
    ]
  },

  {
    slug: 'avec-ou-sans-chauffeur',
    title: 'Avec ou sans chauffeur : que choisir à Douala ?',
    shortTitle: 'Avec ou sans chauffeur',
    description:
      'Location avec chauffeur ou auto-conduite à Douala : le vrai coût, les cas où le chauffeur fait gagner du temps, et comment choisir selon ton trajet.',
    excerpt:
      'Selon ton trajet, ton budget et ton habitude de conduite, on t’explique quelle formule est la plus intéressante.',
    date: '2026-07-02',
    readingMinutes: 4,
    body: [
      {
        p: `C’est la question qu’on nous pose le plus souvent. La réponse dépend moins du budget que du type de déplacement : à Douala, un chauffeur fait surtout gagner du temps et de la sérénité. Le supplément est de ${fcfa(
          DRIVER_PRICE_PER_DAY
        )} par jour, quel que soit le véhicule.`
      },
      { h2: 'Les deux formules en un coup d’œil' },
      {
        ul: [
          `Sans chauffeur (auto-conduite) : tu prends le volant, tu gères ton programme comme tu veux. Permis de conduire obligatoire. À partir de ${fcfa(
            avensisPrice
          )} par jour.`,
          `Avec chauffeur : un chauffeur qui connaît Douala conduit pour toi. Pas besoin de permis, pas de stress de stationnement. ${fcfa(
            avensisPrice + DRIVER_PRICE_PER_DAY
          )} par jour en Avensis.`
        ]
      },
      { h2: 'Prends un chauffeur si…' },
      {
        ul: [
          'Tu arrives de l’étranger et tu ne connais pas la ville : la circulation à Akwa, Bonanjo ou au carrefour Ndokotti se dompte avec l’habitude.',
          'Tu enchaînes les rendez-vous professionnels : tu travailles pendant les trajets et tu ne cherches jamais où te garer.',
          'Tu as un transfert aéroport tôt le matin ou tard le soir.',
          'Tu ne veux pas conduire après un événement, un mariage ou un dîner.',
          'Tu ne connais pas la route pour sortir de la ville et tu préfères quelqu’un qui la fait régulièrement.'
        ]
      },
      { h2: 'Conduis toi-même si…' },
      {
        ul: [
          'Tu vis à Douala ou tu y viens souvent : tu connais déjà les axes et les heures à éviter.',
          'Ton programme change tout le temps et tu veux une liberté totale, y compris la nuit.',
          'Tu loues sur plusieurs jours et tu veux garder le budget au plus juste.',
          'Tu es à l’aise avec la conduite en ville dense — et, pour la boîte manuelle, avec les démarrages en côte dans les embouteillages.'
        ]
      },
      {
        note: `Si la conduite en ville te fatigue mais que tu veux rester autonome, l’Avensis en boîte automatique est un bon compromis : même prix que la manuelle, beaucoup moins d’efforts dans les bouchons.`
      },
      { h2: 'Le calcul, sur trois jours' },
      {
        ul: [
          `Avensis sans chauffeur : ${fcfa(avensisPrice * 3)}.`,
          `Avensis avec chauffeur : ${fcfa((avensisPrice + DRIVER_PRICE_PER_DAY) * 3)}.`,
          `RAV4 sans chauffeur : ${fcfa(rav4Price * 3)}.`,
          `RAV4 avec chauffeur : ${fcfa((rav4Price + DRIVER_PRICE_PER_DAY) * 3)}.`
        ]
      },
      {
        p: `L’écart entre les deux formules est de ${fcfa(
          DRIVER_PRICE_PER_DAY * 3
        )} sur trois jours. Comparé au prix de plusieurs courses de taxi par jour, ou d’un rendez-vous manqué à cause des embouteillages, le calcul est souvent vite fait pour un déplacement professionnel.`
      },
      { h2: 'Les questions à se poser avant de trancher' },
      {
        ol: [
          'Combien de trajets par jour, et à quelles heures ?',
          'Est-ce que je connais les quartiers où je dois me rendre ?',
          'Est-ce que je vais sortir de Douala ?',
          'Est-ce que je préfère travailler ou me reposer pendant les trajets ?'
        ]
      },
      {
        p: 'Dans le doute, dis-nous simplement ton programme sur WhatsApp : on te conseille la formule la plus adaptée, quitte à te dire que le chauffeur n’est pas nécessaire.'
      }
    ],
    faq: [
      {
        q: 'Combien coûte un chauffeur en plus de la location ?',
        a: `${fcfa(DRIVER_PRICE_PER_DAY)} par jour, quel que soit le véhicule choisi.`
      },
      {
        q: 'Le carburant est-il compris avec le chauffeur ?',
        a: 'Non, le carburant reste à la charge du client dans les deux formules. Le supplément chauffeur couvre uniquement le service de conduite.'
      },
      {
        q: 'Peut-on prendre un chauffeur seulement pour une journée ?',
        a: 'Oui, la formule avec chauffeur se choisit jour par jour au moment de la réservation.'
      }
    ]
  },

  {
    slug: 'payer-orange-money-mtn-momo',
    title: 'Payer ta location par Orange Money ou MTN MoMo',
    shortTitle: 'Payer par Orange Money ou MTN MoMo',
    description:
      'Comment régler l’acompte d’une location de voiture à Douala en Mobile Money : étapes Orange Money et MTN MoMo, vérification du bénéficiaire, preuve de paiement.',
    excerpt:
      'Comment régler ton acompte en Mobile Money simplement, et garder une preuve de paiement pour ta réservation.',
    date: '2026-06-25',
    readingMinutes: 4,
    body: [
      {
        p: `Pas besoin de carte bancaire pour louer chez ${site.name}. Tout se règle en Mobile Money, depuis ton téléphone, avec l’opérateur que tu utilises déjà. Voici comment ça se passe, et les précautions à prendre.`
      },
      { h2: 'Ce que tu paies, et quand' },
      {
        ul: [
          `À la réservation : un acompte de ${site.payment.depositPercent} % du total. C’est lui qui bloque la voiture à ton nom.`,
          'À la remise du véhicule : le solde, en Mobile Money ou en espèces.',
          'Aucun paiement n’est prélevé automatiquement sur le site : c’est toi qui envoies le transfert, quand la disponibilité est confirmée.'
        ]
      },
      {
        p: `Exemple : trois jours en Avensis à ${fcfa(avensisPrice)} par jour font ${fcfa(
          avensisPrice * 3
        )}, soit ${fcfa(
          Math.round((avensisPrice * 3 * site.payment.depositPercent) / 100)
        )} d’acompte et le reste à la remise des clés. Le formulaire de réservation calcule ce montant pour toi.`
      },
      { h2: 'Payer avec MTN Mobile Money' },
      {
        ol: [
          `Compose ${site.payment.momo.ussd} sur ton téléphone.`,
          'Choisis « Transfert d’argent », puis « Vers un numéro MTN ».',
          `Saisis le numéro ${site.payment.momo.number}.`,
          'Entre le montant exact de l’acompte, puis ton code secret.',
          `Vérifie que le nom affiché est bien ${site.payment.momo.holder} avant de valider.`
        ]
      },
      { h2: 'Payer avec Orange Money' },
      {
        ol: [
          `Compose ${site.payment.orange.ussd} sur ton téléphone.`,
          'Choisis « Transfert d’argent », puis « Vers un numéro Orange ».',
          `Saisis le numéro ${site.payment.orange.number}.`,
          'Entre le montant exact de l’acompte, puis ton code secret.',
          `Vérifie que le nom affiché est bien ${site.payment.orange.holder} avant de valider.`
        ]
      },
      {
        note: `Le compte Orange Money est au nom de ${site.payment.orange.holder} et le compte MTN au nom de ${site.payment.momo.holder}. C’est normal : ce sont les comptes de l’agence. Si un autre nom s’affiche, n’envoie rien et appelle-nous au ${site.phone}.`
      },
      { h2: 'Garde ta preuve de paiement' },
      {
        p: 'Après le transfert, l’opérateur t’envoie un SMS avec un numéro de transaction. Ne le supprime pas : envoie-le nous sur WhatsApp, c’est ce qui déclenche la confirmation définitive de ta réservation.'
      },
      {
        ul: [
          'Le SMS fait foi en cas de désaccord sur un montant.',
          'Il permet de retrouver ton paiement immédiatement si tu réserves pour quelqu’un d’autre.',
          'Une capture d’écran suffit, pas besoin de reçu papier.'
        ]
      },
      { h2: 'Les erreurs les plus fréquentes' },
      {
        ul: [
          'Envoyer le montant total au lieu de l’acompte : ce n’est pas un problème, le solde est simplement déduit à la remise du véhicule.',
          'Se tromper d’opérateur : vérifie bien que tu utilises le numéro MTN pour MoMo et le numéro Orange pour Orange Money.',
          'Payer avant notre confirmation de disponibilité : attends notre réponse, surtout en période de fêtes.',
          'Oublier les frais de transfert de l’opérateur, qui s’ajoutent au montant envoyé selon ton forfait.'
        ]
      },
      { h2: 'Et si tu dois annuler ?' },
      {
        p: 'Préviens-nous le plus tôt possible sur WhatsApp. Une annulation se règle au cas par cas, et un report de dates est presque toujours possible si tu nous laisses le temps de reproposer la voiture.'
      }
    ],
    faq: [
      {
        q: 'Peut-on payer une location de voiture à Douala en Mobile Money ?',
        a: `Oui. Chez ${site.name}, l’acompte comme le solde se règlent par Orange Money ou MTN Mobile Money, sans carte bancaire.`
      },
      {
        q: 'Quel acompte faut-il verser pour bloquer une voiture ?',
        a: `${site.payment.depositPercent} % du montant total de la location. Le reste se paie à la remise du véhicule.`
      },
      {
        q: 'Le site prélève-t-il de l’argent automatiquement ?',
        a: 'Non. Aucun paiement n’est prélevé sur le site : le client envoie lui-même le transfert Mobile Money après confirmation de la disponibilité.'
      }
    ]
  }
];

export function findArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** « 9 juillet 2026 » à partir d'une date ISO. */
export function formatArticleDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
