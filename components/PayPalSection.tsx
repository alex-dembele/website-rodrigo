'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalSection() {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [activeMethod, setActiveMethod] = useState<'momo' | 'paypal'>('momo');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
      script.async = true;
      script.onload = () => {
        window.paypal?.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: '1.00' } }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order?.capture();
            alert('Paiement simulé réussi. Merci pour votre réservation.');
          }
        }).render(paypalRef.current!);
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="container py-24" aria-labelledby="payment-title">
      <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-gold">Paiement ultra-sécurisé</p>
          <h2 id="payment-title" className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Réglez en toute sérénité.
          </h2>
          <p className="mt-6 max-w-xl text-lg font-light leading-8 text-slate-300">
            Nous adaptons nos moyens de paiement à vos préférences. Optez pour la facilité du Mobile Money omniprésent au Cameroun ou la sécurité internationale de PayPal.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-gold"></div>
              Paiement crypté SSL
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-gold"></div>
              Acompte en ligne
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-gold"></div>
              Solde au retrait
            </span>
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] shadow-glass backdrop-blur-xl">
          <div className="flex border-b border-white/5">
            <button 
              onClick={() => setActiveMethod('momo')}
              className={`flex-1 py-5 text-xs font-semibold uppercase tracking-wider transition-colors ${activeMethod === 'momo' ? 'bg-brand-gold text-brand-base' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              Mobile Money
            </button>
            <button 
              onClick={() => setActiveMethod('paypal')}
              className={`flex-1 py-5 text-xs font-semibold uppercase tracking-wider transition-colors ${activeMethod === 'paypal' ? 'bg-brand-gold text-brand-base' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              PayPal / Carte
            </button>
          </div>
          
          <div className="relative p-8 sm:p-10">
            <div className={`space-y-6 text-center transition-all duration-500 ${activeMethod === 'momo' ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none scale-95'}`}>
              <div className="flex justify-center gap-4 sm:gap-6">
                <div className="flex items-center rounded-2xl border border-[#FF6600]/30 bg-[#FF6600]/10 px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-xs font-bold text-[#FF6600] sm:text-sm">Orange Money</span>
                </div>
                <div className="flex items-center rounded-2xl border border-[#FFCC00]/30 bg-[#FFCC00]/10 px-4 py-3 sm:px-6 sm:py-4">
                  <span className="text-xs font-bold text-[#FFCC00] sm:text-sm">MTN MoMo</span>
                </div>
              </div>
              <div className="mx-auto max-w-sm space-y-4 pt-4 text-sm font-light text-slate-300">
                <p>Composez le <strong className="font-semibold text-white">#150#</strong> ou <strong className="font-semibold text-white">*126#</strong> sur votre téléphone.</p>
                <div className="rounded-xl border border-white/10 bg-black/40 py-4">
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-brand-gold">Numéro de caisse</p>
                  <p className="text-2xl font-bold tracking-widest text-white">6X X X X X X</p>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-500 ${activeMethod === 'paypal' ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none scale-95'}`}>
              <div ref={paypalRef} className="min-h-[200px]" />
              <p className="mt-5 text-center text-[10px] uppercase tracking-widest text-slate-500">
                Transaction sécurisée via l'infrastructure PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
