import Image from 'next/image';
import Link from 'next/link';
import type { Vehicle } from '@/lib/vehicles';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0A0A0E] min-h-[450px]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent transition-opacity duration-1000 group-hover:opacity-80 z-10" />
      
      {/* Background Image */}
      <Image
        src={vehicle.image}
        alt={vehicle.name}
        fill
        className="object-cover px-6 pt-6 saturate-50 transition-all duration-[2s] ease-out group-hover:scale-105 group-hover:saturate-100"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      
      {/* Simulated Headlight / Gold glow effect on hover */}
      <div className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-brand-gold/0 mix-blend-screen blur-3xl transition-all duration-1000 group-hover:bg-brand-gold/30 z-20" />

      {/* Content Overlay */}
      <div className="relative z-30 mt-auto flex flex-col justify-end p-8">
        <div className="flex items-center gap-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
            {vehicle.type}
          </p>
          {vehicle.available && (
            <span className="rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
              Disponible
            </span>
          )}
        </div>
        
        <h3 className="mt-4 font-display text-4xl font-medium uppercase tracking-tight text-white mb-2">
          {vehicle.name}
        </h3>
        
        <p className="font-sans text-xs font-light text-slate-400 line-clamp-2 max-w-sm mb-6">
          {vehicle.description}
        </p>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end justify-between border-t border-white/[0.08] pt-6">
          <div className="flex gap-6 font-sans text-xs font-light text-slate-400">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Sièges</p>
              <p className="text-white font-medium">{vehicle.seats}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Boîte</p>
              <p className="text-white font-medium">{vehicle.transmission}</p>
            </div>
          </div>
          
          <Link href={`/vehicles`} className="group/btn flex items-center gap-4 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-brand-gold hover:text-brand-base hover:border-brand-gold">
            <span className="relative z-10">Réserver - ${vehicle.pricePerDay}/j</span>
            <span className="text-brand-gold transition-colors group-hover/btn:text-brand-base">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
