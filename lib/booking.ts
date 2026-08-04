import { site, fcfa } from './site';
import { findVehicle, vehicleLabel, DRIVER_PRICE_PER_DAY, type Vehicle } from './vehicles';

export const PICKUP_LOCATIONS = [
  'Agence — Terminus Bonamoussadi',
  'Aéroport international de Douala',
  'Akwa',
  'Bonanjo',
  'Bonapriso',
  'Deido',
  'Autre (à préciser)'
];

export interface BookingInput {
  vehicleId: string;
  pickupLocation: string;
  pickupDate: string; // yyyy-mm-dd
  returnDate: string; // yyyy-mm-dd
  withDriver: boolean;
  name: string;
  phone: string;
  notes?: string;
}

export interface Quote {
  vehicle?: Vehicle;
  days: number;
  base: number;
  driver: number;
  total: number;
  deposit: number;
}

/** Nombre de jours de location (au moins 1). */
export function countDays(pickup: string, ret: string): number {
  if (!pickup || !ret) return 1;
  const d1 = new Date(pickup).getTime();
  const d2 = new Date(ret).getTime();
  if (Number.isNaN(d1) || Number.isNaN(d2) || d2 <= d1) return 1;
  return Math.max(1, Math.round((d2 - d1) / 86_400_000));
}

/** Calcule le devis à partir des choix du client. */
export function quote(input: Pick<BookingInput, 'vehicleId' | 'pickupDate' | 'returnDate' | 'withDriver'>): Quote {
  const vehicle = findVehicle(input.vehicleId);
  const days = countDays(input.pickupDate, input.returnDate);
  const base = vehicle ? vehicle.pricePerDay * days : 0;
  const driver = input.withDriver ? DRIVER_PRICE_PER_DAY * days : 0;
  const total = base + driver;
  const deposit = Math.round((total * site.payment.depositPercent) / 100);
  return { vehicle, days, base, driver, total, deposit };
}

function formatDate(d: string): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
}

/** Message texte structuré, utilisé pour WhatsApp ET pour l'email. */
export function buildBookingMessage(input: BookingInput): string {
  const q = quote(input);
  const lines = [
    `Nouvelle demande de réservation — ${site.name}`,
    '',
    `Voiture : ${q.vehicle ? `${vehicleLabel(q.vehicle)} (${q.vehicle.type})` : '—'}`,
    `Prise en charge : ${input.pickupLocation || '—'}`,
    `Du : ${formatDate(input.pickupDate)}`,
    `Au : ${formatDate(input.returnDate)}`,
    `Durée : ${q.days} jour${q.days > 1 ? 's' : ''}`,
    `Chauffeur : ${input.withDriver ? 'Oui' : 'Non (auto-conduite)'}`,
    '',
    `Location : ${fcfa(q.base)}`,
    ...(q.driver ? [`Chauffeur : ${fcfa(q.driver)}`] : []),
    `TOTAL estimé : ${fcfa(q.total)}`,
    `Acompte (${site.payment.depositPercent}%) : ${fcfa(q.deposit)}`,
    '',
    `Client : ${input.name || '—'}`,
    `Téléphone : ${input.phone || '—'}`,
    ...(input.notes ? ['', `Message : ${input.notes}`] : [])
  ];
  return lines.join('\n');
}

export function mailtoLink(input: BookingInput): string {
  const v = quote(input).vehicle;
  const subject = `Réservation ${v ? vehicleLabel(v) : ''} — ${input.name}`.trim();
  const body = buildBookingMessage(input);
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
