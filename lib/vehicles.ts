export type VehicleType = 'Berline' | 'SUV' | 'Pick-up 4x4';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  /** Prix par jour en FCFA, sans chauffeur */
  pricePerDay: number;
  seats: number;
  doors: number;
  transmission: 'Manuelle' | 'Automatique';
  fuel: string;
  airConditioning: boolean;
  /** Image principale (dans /public/cars/) */
  image: string;
  gallery: string[];
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
 * Les photos sont dans /public/cars/ — remplace les images provisoires
 * par tes vraies photos en gardant les mêmes noms de fichiers.
 */
export const vehicles: Vehicle[] = [
  {
    id: 'toyota-avensis',
    name: 'Toyota Avensis',
    type: 'Berline',
    pricePerDay: 25000,
    seats: 5,
    doors: 4,
    transmission: 'Manuelle',
    fuel: 'Essence',
    airConditioning: true,
    image: '/cars/avensis-1.jpg',
    gallery: ['/cars/avensis-1.jpg', '/cars/avensis-2.jpg'],
    description:
      "Berline confortable et économique, parfaite pour la ville, les rendez-vous professionnels et les trajets en famille à Douala.",
    features: ['Climatisation', '5 places', 'Coffre spacieux', 'Faible consommation'],
    available: true
  },
  {
    id: 'toyota-rav4',
    name: 'Toyota RAV4',
    type: 'SUV',
    pricePerDay: 40000,
    seats: 5,
    doors: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    airConditioning: true,
    image: '/cars/rav4-1.jpg',
    gallery: ['/cars/rav4-1.jpg'],
    description:
      "SUV robuste et surélevé, idéal pour les routes de la ville comme pour les sorties hors de Douala. Confortable pour 5 personnes avec bagages.",
    features: ['Climatisation', '5 places', 'Boîte automatique', 'Position de conduite haute'],
    available: true
  },
  {
    id: 'toyota-hilux',
    name: 'Toyota Hilux',
    type: 'Pick-up 4x4',
    pricePerDay: 60000,
    seats: 5,
    doors: 4,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    airConditioning: true,
    image: '/cars/hilux-1.jpg',
    gallery: ['/cars/hilux-1.jpg'],
    description:
      "Pick-up tout-terrain double cabine pour les chantiers, le transport et les longues routes. Bientôt disponible à la location.",
    features: ['4x4', 'Double cabine', 'Benne de chargement', 'Tout-terrain'],
    available: false,
    comingSoon: true
  }
];

export const availableVehicles = vehicles.filter((v) => v.available);
