const stats = [
  { value: '500+', label: 'Clients VIP' },
  { value: '24/7', label: 'Assistance' },
  { value: '100%', label: 'Discrétion' },
];

export default function Testimonials() {
  return (
    <section className="container py-24 sm:py-32" aria-labelledby="testimonials-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        
        {/* Left column: Context & Stats */}
        <div className="space-y-16">
          <div className="space-y-6">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Confiance d'Élite</p>
            <h2 id="testimonials-title" className="font-display text-5xl font-medium uppercase leading-[0.9] tracking-tight text-white lg:text-6xl">
              Ils exigent le meilleur.
            </h2>
            <p className="font-sans text-base font-light leading-relaxed text-slate-400">
              Des dirigeants, diplomates et personnalités publiques choisissent Rodrigo Services pour la fiabilité de notre accompagnement au Cameroun.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="font-display text-4xl font-medium text-white">{stat.value}</p>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-gold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Testimonial Bento */}
        <div className="relative">
          {/* Decorative glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-[100px]" />
          
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="flex flex-col justify-between rounded-[2rem] border border-white/[0.05] bg-brand-dark p-8 min-h-[320px]">
              <p className="font-sans text-sm font-light italic leading-relaxed text-slate-300">
                "Un service impeccable. La prise en charge à l'aéroport de Douala par le chauffeur privé a été d'un confort absolu après mon vol depuis Paris."
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/[0.05] pt-6">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Client 1" className="h-10 w-10 rounded-full object-cover grayscale" />
                <div>
                  <p className="font-sans text-xs font-bold text-white uppercase tracking-wider">Paul M.</p>
                  <p className="font-sans text-[10px] text-brand-gold uppercase tracking-widest mt-1">Directeur Général</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-[2rem] border border-white/[0.05] bg-brand-dark p-8 min-h-[320px] sm:translate-y-12">
              <p className="font-sans text-sm font-light italic leading-relaxed text-slate-300">
                "La flotte est exceptionnelle. Mettre à disposition de tels véhicules avec un niveau de sécurité aussi strict est inédit dans la région."
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/[0.05] pt-6">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Client 2" className="h-10 w-10 rounded-full object-cover grayscale" />
                <div>
                  <p className="font-sans text-xs font-bold text-white uppercase tracking-wider">Sarah N.</p>
                  <p className="font-sans text-[10px] text-brand-gold uppercase tracking-widest mt-1">Diplomate</p>
                </div>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}
