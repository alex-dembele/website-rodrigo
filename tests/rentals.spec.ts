import { test, expect } from '@playwright/test';
import { currentRental, nextDay, overlappingRental, rentalErrors, upcomingRentals } from '../lib/rentals';

/**
 * Règles des dates de location : une erreur ici laisserait réserver une
 * voiture déjà partie, ou bloquerait une voiture pourtant rendue.
 */
const locations = [
  { from: '2026-11-03', to: '2026-11-10' },
  { from: '2026-10-01', to: '2026-10-05' }
];

test.describe('Dates de location', () => {
  test('les deux bornes sont comprises', () => {
    expect(overlappingRental(locations, '2026-11-10', '2026-11-12')).toEqual(locations[0]);
    expect(overlappingRental(locations, '2026-11-01', '2026-11-03')).toEqual(locations[0]);
    expect(overlappingRental(locations, '2026-11-11', '2026-11-15')).toBeUndefined();
    expect(overlappingRental(locations, '2026-10-28', '2026-11-02')).toBeUndefined();
  });

  test('une demande qui englobe une location est refusée', () => {
    expect(overlappingRental(locations, '2026-11-01', '2026-11-20')).toEqual(locations[0]);
  });

  test('la voiture redevient libre le lendemain de la fin', () => {
    expect(currentRental(locations, '2026-11-10')).toEqual(locations[0]);
    expect(currentRental(locations, '2026-11-11')).toBeUndefined();
    expect(nextDay('2026-11-10')).toBe('2026-11-11');
    expect(nextDay('2026-12-31')).toBe('2027-01-01');
  });

  test('les locations terminées sont oubliées, les autres triées', () => {
    expect(upcomingRentals(locations, '2026-10-26')).toEqual([locations[0]]);
    expect(upcomingRentals(locations, '2026-09-01')).toEqual([locations[1], locations[0]]);
  });

  test('une période incohérente est signalée en clair', () => {
    expect(rentalErrors([{ from: '2026-11-10', to: '2026-11-03' }])[0]).toMatch(/avant de commencer/);
    expect(rentalErrors([{ from: '', to: '2026-11-03' }])[0]).toMatch(/date de début/);
    expect(rentalErrors(locations)).toEqual([]);
  });
});
