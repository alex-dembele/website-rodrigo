'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { availableVehicles } from '@/lib/vehicles';
import { PICKUP_LOCATIONS } from '@/lib/booking';

const today = new Date().toISOString().split('T')[0];

export default function HeroSearch() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState(availableVehicles[0]?.id ?? '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [location, setLocation] = useState(PICKUP_LOCATIONS[0]);

  function search() {
    const params = new URLSearchParams();
    if (vehicle) params.set('vehicle', vehicle);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (location) params.set('location', location);
    router.push(`/reservation?${params.toString()}`);
  }

  const field = 'flex flex-col gap-1 px-4 py-3';
  const labelCls = 'text-[11px] font-semibold uppercase tracking-wider text-brand-gray';
  const controlCls = 'w-full bg-transparent text-sm font-medium text-brand-ink outline-none';

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-2 shadow-card">
      <div className="grid gap-1 divide-brand-line md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:divide-x">
        <div className={field}>
          <label className={labelCls} htmlFor="hs-loc">Lieu de départ</label>
          <select id="hs-loc" value={location} onChange={(e) => setLocation(e.target.value)} className={`${controlCls} cursor-pointer`}>
            {PICKUP_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-veh">Voiture</label>
          <select id="hs-veh" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={`${controlCls} cursor-pointer`}>
            {availableVehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-from">Retrait</label>
          <input id="hs-from" type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} className={controlCls} />
        </div>
        <div className={field}>
          <label className={labelCls} htmlFor="hs-to">Retour</label>
          <input id="hs-to" type="date" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} className={controlCls} />
        </div>
        <div className="p-1">
          <button
            onClick={search}
            className="flex h-full min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Search className="h-5 w-5" />
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}
