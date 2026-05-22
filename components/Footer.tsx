import Link from 'next/link';

const footerLinks = [
  { label: 'La Flotte', href: '/vehicles' },
  { label: 'Prestations', href: '/services' },
  { label: 'Tarification', href: '/tarifs' },
  { label: 'Journal', href: '/blog' }
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-base pt-24 text-slate-300 border-t border-white/[0.05]">
      {/* Glow décoratif */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/5 blur-[120px]" />
      
      <div className="container relative z-10 mb-24 grid gap-16 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Rodrigo Services</p>
          <p className="max-w-md font-sans text-sm font-light leading-relaxed text-slate-400">
            L'excellence automobile à Douala. Des véhicules prestigieux, une sécurité absolue et un service sur-mesure pour vous accompagner lors de tous vos déplacements.
          </p>
          
          <div className="mt-8 flex gap-4">
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.02] text-sm transition-colors hover:border-brand-gold hover:text-brand-gold">
              <span className="sr-only">Instagram</span>
              IG
            </a>
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.02] text-sm transition-colors hover:border-brand-gold hover:text-brand-gold">
              <span className="sr-only">LinkedIn</span>
              IN
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 lg:ml-auto">
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-600">Navigation</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-xs font-light text-slate-300 transition-colors hover:text-brand-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-600">Contact</h3>
            <ul className="mt-6 flex flex-col gap-4 font-sans text-xs font-light text-slate-300">
              <li>+237 6 77 77 77 77</li>
              <li>contact@rodrigoservices.cm</li>
              <li>Douala, Cameroun</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Massive Typography Footer */}
      <div className="w-full flex items-center justify-center overflow-hidden flex-col">
        <h2 className="font-display text-[15vw] leading-[0.75] font-medium uppercase text-white/[0.02] select-none pointer-events-none whitespace-nowrap overflow-hidden">
          RODRIGO
        </h2>
        <div className="w-full border-t border-white/[0.05] py-6 text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © 2026 Rodrigo Services. L'Élégance en mouvement.
          </p>
        </div>
      </div>
    </footer>
  );
}
