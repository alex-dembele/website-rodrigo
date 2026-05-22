'use client';

import { useState } from 'react';
import Image from 'next/image';

const steps = ['Véhicule', 'Dates & lieu', 'Options', 'Paiement'];

export default function ReservationFlow() {
  const [step, setStep] = useState(1);

  return (
    <section className="container py-24 sm:py-32" aria-labelledby="booking-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1fr] xl:grid-cols-[1fr_1.2fr] lg:items-start">
        
        {/* Left Sticky Column: Résumé Produit (Apple Style) */}
        <div className="sticky top-32 overflow-hidden rounded-[2.5rem] bg-brand-dark min-h-[60vh] lg:min-h-[75vh] border border-white/[0.05] p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black">
            <Image 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80" 
              alt="Vehicule" 
              fill 
              className="object-cover opacity-60 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                Votre Sélection
              </p>
              <h3 className="mt-4 font-display text-4xl font-medium uppercase text-white sm:text-5xl">
                Toyota RAV4 <br /> Hybrid
              </h3>
              
              <div className="mt-8 space-y-2 border-l border-brand-gold/30 pl-4 font-sans text-xs font-light text-slate-300">
                <p>Dates : 12 mai - 17 mai</p>
                <p>Options : Chauffeur VIP</p>
              </div>
              
              <div className="mt-8 flex items-end justify-between border-t border-white/[0.08] pt-6">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">Total estimé</p>
                <p className="font-display text-3xl font-medium text-white">$575</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Scrollable Column: Form & Stepper */}
        <div className="lg:py-12 lg:pl-12">
          <div className="space-y-4">
            <h2 id="booking-title" className="font-display text-4xl font-medium uppercase tracking-tight text-white md:text-5xl">
              Finaliser <br/> la réservation
            </h2>
            <p className="font-sans text-sm font-light leading-relaxed text-slate-400">
              Complétez vos informations pour garantir la disponibilité de votre véhicule.
            </p>
          </div>

          {/* Minimalist Stepper */}
          <div className="relative mt-16 max-w-xl">
            <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 bg-white/5" />
            <div 
              className="absolute top-1/2 left-0 h-[1px] -translate-y-1/2 bg-brand-gold transition-all duration-700 ease-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {steps.map((label, index) => {
                const active = step >= index + 1;
                const current = step === index + 1;
                return (
                  <div key={label} className="flex flex-col items-center">
                    <div className={`relative z-10 flex h-2 w-2 rounded-full transition-colors duration-700 ${active ? 'bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,1)]' : 'bg-brand-dark border border-white/20'}`} />
                    <span className={`absolute top-6 w-16 text-center sm:w-auto font-sans text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ${current ? 'text-brand-gold' : active ? 'text-white' : 'text-slate-600'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content (Dynamic based on step) */}
          <div className="mt-24 min-h-[300px]">
            <h3 className="font-display text-2xl font-medium uppercase text-white">
              {step}. {steps[step - 1]}
            </h3>
            
            <div className="mt-12 space-y-8">
              {/* Floating label inputs */}
              <div className="relative pt-6">
                <input type="text" id="name" placeholder=" " className="peer w-full border-b border-white/[0.15] bg-transparent pb-4 font-sans text-lg font-light text-white outline-none transition-colors focus:border-brand-gold" />
                <label htmlFor="name" className="pointer-events-none absolute left-0 top-6 origin-left font-sans text-sm font-light text-slate-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-brand-gold peer-focus:uppercase peer-focus:tracking-widest">
                  Nom Complet
                </label>
              </div>
              
              <div className="relative pt-6">
                <input type="email" id="email" placeholder=" " className="peer w-full border-b border-white/[0.15] bg-transparent pb-4 font-sans text-lg font-light text-white outline-none transition-colors focus:border-brand-gold" />
                <label htmlFor="email" className="pointer-events-none absolute left-0 top-6 origin-left font-sans text-sm font-light text-slate-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-bold peer-focus:text-brand-gold peer-focus:uppercase peer-focus:tracking-widest">
                  Adresse Email
                </label>
              </div>
              
              {/* Big option selectors */}
              <div className="mt-16 space-y-6">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">Service de Chauffeur</p>
                <div className="grid grid-cols-2 gap-4">
                  <button className="rounded-[1.5rem] border border-brand-gold/40 bg-brand-gold/5 p-6 text-left transition-all hover:bg-brand-gold/10">
                    <span className="block font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">Inclus</span>
                    <span className="mt-2 block font-display text-xl font-medium text-white">Oui</span>
                  </button>
                  <button className="rounded-[1.5rem] border border-white/[0.05] bg-white/[0.02] p-6 text-left transition-all hover:bg-white/[0.05]">
                    <span className="block font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Auto-conduite</span>
                    <span className="mt-2 block font-display text-xl font-medium text-slate-300">Non</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex items-center justify-between border-t border-white/[0.05] pt-8">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))} 
              disabled={step === 1}
              className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
            >
              ← Retour
            </button>
            <button 
              onClick={() => setStep(Math.min(4, step + 1))} 
              className="group flex h-14 items-center justify-center overflow-hidden rounded-full bg-brand-gold px-12 font-sans text-[10px] font-bold uppercase tracking-widest text-brand-base transition-all hover:scale-[1.02] hover:bg-brand-goldLite hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              {step < 4 ? 'Continuer' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
