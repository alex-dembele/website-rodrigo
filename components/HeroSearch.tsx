'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { availableVehicles, vehicleLabel } from '@/lib/vehicles';
import { PICKUP_LOCATIONS } from '@/lib/booking';

/** yyyy-mm-dd en heure locale */
function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function HeroSearch() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState(availableVehicles[0]?.id ?? '');
  const [from, setFrom] = useState(isoDate());
  const [to, setTo] = useState(isoDate(1));
  const [location, setLocation] = useState(PICKUP_LOCATIONS[0]);

  function search() {
    const params = new URLSearchParams({ vehicle, from, to, location });
    router.push(`/reservation?${params.toString()}`);
  }

  const field = 'flex min-w-0 flex-col gap-1 px-4 py-3';
  const labelCls = 'text-[11px] font-semibold uppercase tracking-wider text-brand-gray';
  const controlCls = 'w-full min-w-0 bg-transparent text-sm font-medium text-brand-ink outline-none';

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-2 shadow-card">
      <div className="grid gap-1 divide-brand-line sm:grid-cols-2 md:grid-cols-[1.3fr_1.1fr_1fr_1fr_auto] md:divide-x">
        <div className={field}>
          <label className={labelCls} htmlFor="hs-loc">Lieu de départ</label>
          <select
            id="hs-loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`${controlCls} cursor-pointer truncate`}
          >
            {PICKUP_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-veh">Voiture</label>
          <select
            id="hs-veh"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className={`${controlCls} cursor-pointer truncate`}
          >
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>{vehicleLabel(v)}</option>
            ))}
          </select>
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-from">Retrait</label>
          <input
            id="hs-from"
            type="date"
            min={isoDate()}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (to < e.target.value) setTo(e.target.value);
            }}
            className={controlCls}
          />
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-to">Retour</label>
          <input
            id="hs-to"
            type="date"
            min={from}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={controlCls}
          />
        </div>
        <div className="p-1 sm:col-span-2 md:col-span-1">
          <button
            type="button"
            onClick={search}
            className="flex h-full min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Search className="h-5 w-5" />
            Voir le prix
          </button>
        </div>
      </div>
    </div>
  );
}
