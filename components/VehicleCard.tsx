import Link from 'next/link';
import { Users, Cog, Fuel, Snowflake } from 'lucide-react';
import type { Vehicle } from '@/lib/vehicles';
import { fcfa } from '@/lib/site';
import VehicleMedia from './VehicleMedia';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const soon = vehicle.comingSoon;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
      <div className="relative aspect-[4/3] w-full">
        <VehicleMedia images={vehicle.gallery} alt={`${vehicle.name} — location de voiture à Douala`} className="h-full" />
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-ink shadow-soft">
          {vehicle.type}
        </span>
        <span
          className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold text-white ${
            soon ? 'bg-brand-ink' : 'bg-green-600'
          }`}
        >
          {soon ? 'Bientôt' : 'Disponible'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-brand-ink">{vehicle.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-brand-gray line-clamp-2">{vehicle.description}</p>

        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-brand-gray">
          <li className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-red" /> {vehicle.seats} places</li>
          <li className="flex items-center gap-2"><Cog className="h-4 w-4 text-brand-red" /> {vehicle.transmission}</li>
          <li className="flex items-center gap-2"><Fuel className="h-4 w-4 text-brand-red" /> {vehicle.fuel}</li>
          {vehicle.airConditioning && (
            <li className="flex items-center gap-2"><Snowflake className="h-4 w-4 text-brand-red" /> Climatisation</li>
          )}
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-brand-line pt-4">
          <div>
            <p className="text-xs text-brand-gray">à partir de</p>
            <p className="font-display text-lg font-extrabold text-brand-ink">
              {fcfa(vehicle.pricePerDay)}<span className="text-sm font-medium text-brand-gray">/jour</span>
            </p>
          </div>
          {soon ? (
            <span className="rounded-full bg-brand-soft px-5 py-2.5 text-sm font-semibold text-brand-gray">
              Bientôt dispo
            </span>
          ) : (
            <Link
              href={`/reservation?vehicle=${vehicle.id}`}
              className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
            >
              Réserver
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
