'use client';

import { useEffect, useState } from 'react';
import { currentRental, nextDay, shortDay, todayIso, type Rental } from '@/lib/rentals';

/**
 * Pastille « Disponible » d'une carte de voiture.
 *
 * La page est générée à l'avance : c'est le navigateur qui compare les
 * locations avec la date du jour, pour qu'une voiture rendue redevienne
 * « Disponible » sans nouvelle mise en ligne.
 */
export default function RentalBadge({ rentals, className = '' }: { rentals?: Rental[]; className?: string }) {
  const [libreLe, setLibreLe] = useState<string | null>(null);

  useEffect(() => {
    const enCours = currentRental(rentals, todayIso());
    setLibreLe(enCours ? nextDay(enCours.to) : null);
  }, [rentals]);

  return (
    <span
      data-testid="rental-badge"
      className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
        libreLe ? 'bg-brand-ink' : 'bg-green-600'
      } ${className}`}
    >
      {libreLe ? `Louée · libre le ${shortDay(libreLe)}` : 'Disponible'}
    </span>
  );
}
