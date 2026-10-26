import { site } from './site';
import { vehiclesData } from './vehicles.data';
import type { Rental } from './rentals';

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
  /** true = voiture mise en avant dans le hero de l'accueil (une seule) */
  hero?: boolean;
  /** Périodes où la voiture est déjà louée (dates comprises) */
  rentals?: Rental[];
}

// Supplément journalier si le client choisit un chauffeur (FCFA / jour).
// Modifiable depuis l'espace d'administration (content/settings.json).
export const DRIVER_PRICE_PER_DAY = site.driverPricePerDay;

// Les fiches sont dans content/vehicles/*.json et sont vérifiées puis
// converties en lib/vehicles.data.ts avant chaque build. Pour ajouter une
// voiture : `npm run voiture:ajouter`.
export const vehicles: Vehicle[] = vehiclesData;

export const availableVehicles = vehicles.filter((v) => v.available);

/** Ce que le public voit : les voitures en ligne et celles annoncées « bientôt ». */
export const listedVehicles = vehicles.filter((v) => v.available || v.comingSoon);

/** Nom complet affiché : « Toyota Avensis — Boîte automatique » */
export function vehicleLabel(v: Vehicle) {
  return v.variant ? `${v.name} — ${v.variant}` : v.name;
}

/** La voiture affichée dans le hero de l'accueil, à défaut la première. */
export const heroVehicle = availableVehicles.find((v) => v.hero) ?? availableVehicles[0];

export function findVehicle(id: string | undefined) {
  return id ? vehicles.find((v) => v.id === id) : undefined;
}
