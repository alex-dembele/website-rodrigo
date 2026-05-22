import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plans = [
  { title: 'Économique', price: '55', description: 'Voiture compacte parfaite pour la ville et les courts trajets.' },
  { title: 'SUV', price: '115', description: 'Espace et confort pour la famille ou les groupes en déplacement.' },
  { title: 'Luxe', price: '150', description: 'Berline haut de gamme pour un voyage élégant et professionnel.' },
  { title: '4x4', price: '190', description: 'Robuste et polyvalent pour l’intérieur du Cameroun et les routes.' }
];

export default function TarifsPage() {
  return (
    <main className="bg-brand-base min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <section className="container py-32">
          <div className="space-y-6 text-center mb-24 mt-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Tarification</p>
            <h1 className="font-display text-5xl font-medium uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
              Le Prix <br/> de l'Élégance
            </h1>
            <p className="mx-auto max-w-2xl font-sans text-sm font-light leading-relaxed text-slate-400">
              Choisissez un forfait adapté à votre voyage avec des remises sur les locations longues durées et des options pack premium.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.title} className="group relative overflow-hidden rounded-[2.5rem] border border-white/[0.05] bg-brand-dark p-8 md:p-10 transition hover:-translate-y-2 hover:border-brand-gold/30 flex flex-col justify-between min-h-[400px]">
                <div className="absolute inset-x-0 -bottom-32 h-64 w-full bg-brand-gold/0 blur-3xl transition-all duration-700 group-hover:bg-brand-gold/5" />
                
                <div className="relative z-10">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-gold transition-colors">{plan.title}</p>
                  <p className="mt-8 font-display text-6xl font-medium text-white">${plan.price}</p>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mt-2">/ jour</p>
                  <p className="mt-8 font-sans text-sm font-light leading-relaxed text-slate-400">{plan.description}</p>
                </div>
                
                <button className="relative z-10 group/btn mt-12 flex h-14 w-full items-center justify-center overflow-hidden rounded-full border border-white/[0.1] bg-transparent font-sans text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-gold hover:border-brand-gold hover:text-brand-base">
                  <span className="relative z-10">Réserver cette classe</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
