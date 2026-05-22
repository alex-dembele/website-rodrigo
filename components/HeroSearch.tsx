"use client";

import { motion } from 'framer-motion';

const locations = ['DLA Aéroport', 'Akwa VIP', 'Bonanjo', 'Limbe Marina'];

export default function HeroSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-4xl rounded-full border border-white/[0.08] bg-black/20 p-2 shadow-premium backdrop-blur-3xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/0 via-brand-gold/5 opacity-50 to-brand-gold/0" />
      
      <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <div className="group relative px-6 py-3 transition-colors hover:bg-white/[0.03] rounded-l-full">
          <label className="block font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:text-brand-gold">
            Départ
          </label>
          <select className="mt-1 w-full cursor-pointer appearance-none bg-transparent font-sans text-sm font-light text-white outline-none">
            {locations.map((location) => (
              <option key={location} value={location} className="bg-brand-dark text-white">
                {location}
              </option>
            ))}
          </select>
        </div>
        
        <div className="group relative border-white/[0.08] px-6 py-3 transition-colors hover:bg-white/[0.03] sm:border-l">
          <label className="block font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:text-brand-gold">
            Retrait
          </label>
          <input 
            type="date" 
            className="mt-1 w-full cursor-pointer appearance-none bg-transparent font-sans text-sm font-light text-white outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50" 
          />
        </div>
        
        <div className="group relative border-white/[0.08] px-6 py-3 transition-colors hover:bg-white/[0.03] sm:border-l">
          <label className="block font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:text-brand-gold">
            Restitution
          </label>
          <input 
            type="date" 
            className="mt-1 w-full cursor-pointer appearance-none bg-transparent font-sans text-sm font-light text-white outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50" 
          />
        </div>
        
        <div className="flex h-full items-center p-1">
          <button className="relative flex h-full w-full min-h-[48px] items-center justify-center overflow-hidden rounded-full bg-brand-gold px-10 font-sans text-[11px] font-bold uppercase tracking-widest text-brand-base transition-all duration-500 hover:scale-[1.02] hover:bg-brand-goldLite hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] sm:w-auto">
            <span className="relative z-10">Réserver</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
