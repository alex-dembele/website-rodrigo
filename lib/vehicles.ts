import { vehiclesData } from './vehicles.data';

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

// Les fiches sont dans content/vehicles/*.json et sont vérifiées puis
// converties en lib/vehicles.data.ts avant chaque build. Pour ajouter une
// voiture : `npm run voiture:ajouter`.
export const vehicles: Vehicle[] = vehiclesData;

export const availableVehicles = vehicles.filter((v) => v.available);

/** Nom complet affiché : « Toyota Avensis — Boîte automatique » */
export function vehicleLabel(v: Vehicle) {
  return v.variant ? `${v.name} — ${v.variant}` : v.name;
}

export function findVehicle(id: string | undefined) {
  return id ? vehicles.find((v) => v.id === id) : undefined;
}
