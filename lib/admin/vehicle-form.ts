import type { Vehicle, VehicleType } from '@/lib/vehicles';

export const TYPES: VehicleType[] = ['Berline', 'SUV', 'Pick-up 4x4'];
export const TRANSMISSIONS: Vehicle['transmission'][] = ['Manuelle', 'Automatique'];

/** Ce que le formulaire de l'espace de gestion envoie au serveur. */
export interface VehiclePayload extends Omit<Vehicle, 'gallery'> {
  order?: number;
  /** Photos déjà en ligne, conservées telles quelles. */
  gallery: string[];
  /** Nouvelles photos, encodées en base64 par le navigateur. */
  newPhotos?: string[];
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Vérifie une fiche avant enregistrement. Les messages sont écrits pour être
 * lus par le gérant, pas par un développeur.
 */
export function validateVehicle(v: Partial<VehiclePayload>): string[] {
  const errors: string[] = [];
  const photos = [...(v.gallery ?? []), ...(v.newPhotos ?? [])];

  if (!v.name?.trim()) errors.push('Indique le modèle de la voiture.');
  if (!v.id?.trim()) errors.push("L'identifiant de la voiture est vide.");
  else if (!/^[a-z0-9-]+$/.test(v.id)) {
    errors.push("L'identifiant ne peut contenir que des lettres minuscules, des chiffres et des tirets.");
  }
  if (!TYPES.includes(v.type as VehicleType)) errors.push('Choisis le type de véhicule.');
  if (!TRANSMISSIONS.includes(v.transmission as Vehicle['transmission'])) {
    errors.push('Choisis la boîte de vitesses.');
  }
  if (!v.fuel?.trim()) errors.push('Indique le carburant.');
  if (!v.pricePerDay || v.pricePerDay < 1000) {
    errors.push('Indique un prix par jour en FCFA (au moins 1 000).');
  }
  if (!v.seats || v.seats < 1) errors.push('Indique le nombre de places.');
  if (!v.doors || v.doors < 1) errors.push('Indique le nombre de portes.');
  if (!v.bestFor?.trim()) errors.push('Écris la phrase qui aide le client à choisir.');
  if (!v.description?.trim()) errors.push('Écris la description de la voiture.');
  if (v.available !== false && photos.length === 0) {
    errors.push('Ajoute au moins une photo, ou marque la voiture comme non disponible.');
  }
  return errors;
}

/** Ne garde que les champs publiés, dans un ordre stable et lisible. */
export function toVehicleFile(v: VehiclePayload, gallery: string[]) {
  return {
    id: v.id,
    order: v.order ?? 99,
    name: v.name.trim(),
    ...(v.variant?.trim() ? { variant: v.variant.trim() } : {}),
    type: v.type,
    pricePerDay: Number(v.pricePerDay),
    seats: Number(v.seats),
    doors: Number(v.doors),
    transmission: v.transmission,
    fuel: v.fuel.trim(),
    airConditioning: v.airConditioning !== false,
    gallery,
    bestFor: v.bestFor.trim(),
    description: v.description.trim(),
    features: (v.features ?? []).map((f) => f.trim()).filter(Boolean),
    available: v.available !== false,
    ...(v.comingSoon ? { comingSoon: true } : {}),
    ...(v.hero ? { hero: true } : {})
  };
}
