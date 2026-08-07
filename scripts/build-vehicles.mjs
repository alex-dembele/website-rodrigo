#!/usr/bin/env node
/**
 * Lit les fiches de `content/vehicles/*.json`, les vérifie une par une, et
 * génère `lib/vehicles.data.ts`.
 *
 * Ce passage par un fichier généré permet aux composants du navigateur
 * (formulaire de réservation, recherche du hero) d'utiliser la flotte : ils ne
 * peuvent pas lire le disque, contrairement au serveur.
 *
 * Lancé automatiquement avant `npm run dev`, `npm run build` et `npm test`.
 * En cas de fiche invalide, le script échoue avec un message en clair plutôt
 * que de laisser passer une voiture cassée en ligne.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'content/vehicles');
const OUT = join(ROOT, 'lib/vehicles.data.ts');

const TYPES = ['Berline', 'SUV', 'Pick-up 4x4'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];

const errors = [];
const fail = (file, message) => errors.push(`  • ${file} : ${message}`);

function readVehicle(file) {
  const path = join(DIR, file);
  let raw;
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    fail(file, `le fichier n'est pas un JSON valide (${e.message})`);
    return null;
  }

  const text = (key, { required = true } = {}) => {
    const value = raw[key];
    if (value === undefined || value === '') {
      if (required) fail(file, `le champ « ${key} » est vide`);
      return undefined;
    }
    if (typeof value !== 'string') fail(file, `le champ « ${key} » doit être du texte`);
    return value;
  };

  const number = (key, { min = 0 } = {}) => {
    const value = raw[key];
    if (typeof value !== 'number' || Number.isNaN(value)) {
      fail(file, `le champ « ${key} » doit être un nombre (sans espace ni « FCFA »)`);
      return 0;
    }
    if (value < min) fail(file, `le champ « ${key} » doit être supérieur à ${min}`);
    return value;
  };

  const oneOf = (key, allowed) => {
    const value = raw[key];
    if (!allowed.includes(value)) {
      fail(file, `« ${key} » doit valoir ${allowed.map((v) => `« ${v} »`).join(' ou ')}`);
    }
    return value;
  };

  const id = text('id');
  if (id && !/^[a-z0-9-]+$/.test(id)) {
    fail(file, 'l’identifiant ne peut contenir que des minuscules, des chiffres et des tirets');
  }
  if (id && `${id}.json` !== file) {
    fail(file, `l’identifiant « ${id} » doit correspondre au nom du fichier (${id}.json)`);
  }

  const gallery = Array.isArray(raw.gallery) ? raw.gallery : [];
  if (!Array.isArray(raw.gallery)) fail(file, 'le champ « gallery » doit être une liste de photos');
  for (const photo of gallery) {
    if (typeof photo !== 'string' || !photo.startsWith('/')) {
      fail(file, `la photo « ${photo} » doit commencer par « / » (ex. /cars/ma-voiture-1.jpg)`);
      continue;
    }
    if (!existsSync(join(ROOT, 'public', photo))) {
      fail(file, `la photo « ${photo} » est introuvable dans public/`);
    }
  }
  const available = raw.available !== false;
  if (available && gallery.length === 0) {
    fail(file, 'une voiture proposée à la location doit avoir au moins une photo');
  }

  const features = Array.isArray(raw.features) ? raw.features : [];
  if (!Array.isArray(raw.features)) fail(file, 'le champ « features » doit être une liste');

  return {
    id,
    order: typeof raw.order === 'number' ? raw.order : 99,
    name: text('name'),
    variant: text('variant', { required: false }),
    type: oneOf('type', TYPES),
    pricePerDay: number('pricePerDay', { min: 1 }),
    seats: number('seats', { min: 1 }),
    doors: number('doors', { min: 1 }),
    transmission: oneOf('transmission', TRANSMISSIONS),
    fuel: text('fuel'),
    airConditioning: raw.airConditioning !== false,
    gallery,
    bestFor: text('bestFor'),
    description: text('description'),
    features,
    available,
    comingSoon: raw.comingSoon === true,
    hero: raw.hero === true
  };
}

const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.json')).sort() : [];
if (files.length === 0) {
  console.error(`✗ Aucune voiture dans content/vehicles/ — le site n'aurait rien à louer.`);
  process.exit(1);
}

const vehicles = files.map(readVehicle).filter(Boolean);

const seen = new Set();
for (const v of vehicles) {
  if (seen.has(v.id)) errors.push(`  • deux voitures portent l'identifiant « ${v.id} »`);
  seen.add(v.id);
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} problème(s) dans les fiches de content/vehicles/ :\n`);
  console.error(errors.join('\n'));
  console.error('\nCorrige les fiches puis relance la commande.\n');
  process.exit(1);
}

vehicles.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

const body = vehicles
  .map((v) => {
    const { order, variant, comingSoon, hero, ...rest } = v;
    const fields = { ...rest };
    if (variant) fields.variant = variant;
    if (comingSoon) fields.comingSoon = true;
    if (hero) fields.hero = true;
    return JSON.stringify(fields, null, 2)
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
  })
  .join(',\n');

writeFileSync(
  OUT,
  `// ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Source : content/vehicles/*.json — régénéré par \`npm run flotte:generer\`.
import type { Vehicle } from './vehicles';

export const vehiclesData: Vehicle[] = [
${body}
];
`
);

console.log(`✓ ${vehicles.length} voiture(s) → lib/vehicles.data.ts`);
