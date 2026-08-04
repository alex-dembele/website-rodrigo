export type VehicleType = 'Berline' | 'SUV' | 'Pick-up 4x4';

export interface Vehicle {
  id: string;
  name: string;
  /** Précision affichée sous le nom (ex. « Boîte automatique ») */
  variant?: string;
  type: VehicleType;
  /** Prix par jour en FCFA, sans chauffeur */
  pricePerDay: number;
  seats: number;
  doors: number;
  transmission: 'Manuelle' | 'Automatique';
  fuel: string;
  airConditioning: boolean;
  /** Photos du véhicule (extérieur d'abord). Vide = photos à venir. */
  gallery: string[];
  /** Une phrase qui aide le client à choisir */
  bestFor: string;
  description: string;
  features: string[];
  available: boolean;
  /** true = pas encore en service ("bientôt disponible") */
  comingSoon?: boolean;
}

// Supplément journalier si le client choisit un chauffeur (FCFA / jour)
export const DRIVER_PRICE_PER_DAY = 10000;

/**
 * ⚠️ Ajuste les PRIX (pricePerDay) selon tes tarifs réels.
 * Les photos viennent des planches du client, découpées par
 * `scripts/prepare-assets.py` dans /public/cars/.
 */
export const vehicles: Vehicle[] = [
  {
    id: 'avensis-manuelle',
    name: 'Toyota Avensis',
    variant: 'Boîte manuelle',
    type: 'Berline',
    pricePerDay: 25000,
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    airConditioning: true,
    gallery: [
      '/cars/avensis-manuelle-1.jpg',
      '/cars/avensis-manuelle-2.jpg',
      '/cars/avensis-manuelle-3.jpg',
      '/cars/avensis-manuelle-4.jpg',
      '/cars/avensis-manuelle-5.jpg'
    ],
    bestFor: 'Le meilleur rapport qualité-prix pour la ville',
    description:
      "Berline confortable et économique, parfaite pour la ville, les rendez-vous professionnels et les trajets en famille à Douala.",
    features: ['Climatisation', '5 places', 'Grand coffre', 'Faible consommation'],
    available: true
  },
  {
    id: 'avensis-auto',
    name: 'Toyota Avensis',
    variant: 'Boîte automatique',
    type: 'Berline',
    pricePerDay: 25000,
    seats: 5,
    doors: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    airConditioning: true,
    gallery: [
      '/cars/avensis-auto-1.jpg',
      '/cars/avensis-auto-2.jpg',
      '/cars/avensis-auto-3.jpg',
      '/cars/avensis-auto-4.jpg'
    ],
    bestFor: 'Confortable dans les embouteillages de Douala',
    description:
      "La même berline en boîte automatique : plus reposante à conduire en ville, avec la même consommation raisonnable.",
    features: ['Climatisation', 'Boîte automatique', '5 places', 'Grand coffre'],
    available: true
  },
  {
    id: 'rav4',
    name: 'Toyota RAV4',
    type: 'SUV',
    pricePerDay: 40000,
    seats: 5,
    doors: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    airConditioning: true,
    gallery: [
      '/cars/rav4-2.jpg',
      '/cars/rav4-1.jpg',
      '/cars/rav4-3.jpg',
      '/cars/rav4-4.jpg',
      '/cars/rav4-5.jpg',
      '/cars/rav4-6.jpg'
    ],
    bestFor: 'Routes dégradées, familles et bagages',
    description:
      "SUV robuste et surélevé, idéal pour la ville comme pour les sorties hors de Douala. Confortable pour 5 personnes avec bagages.",
    features: ['Climatisation', 'Boîte automatique', 'Position de conduite haute', 'Grand volume'],
    available: true
  },
  {
    id: 'hilux',
    name: 'Toyota Hilux',
    type: 'Pick-up 4x4',
    pricePerDay: 60000,
    seats: 5,
    doors: 4,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    airConditioning: true,
    gallery: [],
    bestFor: 'Chantiers, transport et longues routes',
    description:
      "Pick-up tout-terrain double cabine pour les chantiers, le transport et les longues routes. Bientôt disponible à la location.",
    features: ['4x4', 'Double cabine', 'Benne de chargement', 'Tout-terrain'],
    available: false,
    comingSoon: true
  }
];

export const availableVehicles = vehicles.filter((v) => v.available);

/** Nom complet affiché : « Toyota Avensis — Boîte automatique » */
export function vehicleLabel(v: Vehicle) {
  return v.variant ? `${v.name} — ${v.variant}` : v.name;
}

export function findVehicle(id: string | undefined) {
  return id ? vehicles.find((v) => v.id === id) : undefined;
}
