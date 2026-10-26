/**
 * Périodes de location d'une voiture.
 *
 * Le gérant indique « louée du 3 au 10 » dans l'espace de gestion. Le site
 * étant généré à l'avance, la comparaison avec la date du jour se fait dans
 * le navigateur du client : la voiture redevient libre toute seule, sans
 * nouvelle mise en ligne.
 *
 * Les dates sont au format aaaa-mm-jj et les deux bornes sont comprises :
 * louée du 3 au 10 = prise le 3, rendue le 10, libre le 11.
 */

export interface Rental {
  from: string;
  to: string;
}

export const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** aaaa-mm-jj du jour, en heure locale (pas en UTC). */
export function todayIso(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Lendemain d'une date aaaa-mm-jj. */
export function nextDay(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  return todayIso(new Date(y, m - 1, d + 1));
}

/** « 10 nov. » — court, pour un badge. */
export function shortDay(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** Locations pas encore terminées, de la plus proche à la plus lointaine. */
export function upcomingRentals(rentals: Rental[] | undefined, today: string) {
  return (rentals ?? []).filter((r) => r.to >= today).sort((a, b) => a.from.localeCompare(b.from));
}

/** Location en cours aujourd'hui, s'il y en a une. */
export function currentRental(rentals: Rental[] | undefined, today: string) {
  return upcomingRentals(rentals, today).find((r) => r.from <= today);
}

/** Location qui chevauche la période demandée par le client. */
export function overlappingRental(rentals: Rental[] | undefined, from: string, to: string) {
  if (!from || !to) return undefined;
  return (rentals ?? []).find((r) => r.from <= to && r.to >= from);
}

/** Problèmes d'une liste de périodes, en phrases pour le gérant. */
export function rentalErrors(rentals: Rental[] | undefined): string[] {
  const errors: string[] = [];
  for (const r of rentals ?? []) {
    if (!ISO_DAY.test(r.from ?? '') || !ISO_DAY.test(r.to ?? '')) {
      errors.push('Chaque location doit avoir une date de début et une date de fin.');
    } else if (r.to < r.from) {
      errors.push(`La location du ${shortDay(r.from)} se termine avant de commencer.`);
    }
  }
  return [...new Set(errors)];
}
