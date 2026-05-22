import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="bg-brand-base min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <section className="container py-32">
          {/* Header */}
          <div className="space-y-6 text-center mb-32 mt-12">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Notre Maison</p>
            <h1 className="font-display text-5xl font-medium uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
              L'Héritage <br/> Rodrigo
            </h1>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-8 pr-8">
              <h2 className="font-display text-3xl font-medium uppercase leading-tight text-white">
                Redéfinir le Standard de l'Excellence au Cameroun
              </h2>
              <p className="font-sans text-sm font-light leading-relaxed text-slate-400">
                Basée à Douala, Rodrigo Services s'est imposée comme la référence absolue en matière de mobilité de prestige. Nous ne louons pas de simples véhicules ; nous orchestons des expériences de conduite sans le moindre compromis sur la sécurité, le confort et l'esthétique.
              </p>
            </div>
            
            <div className="space-y-12 rounded-[2.5rem] border border-white/[0.05] bg-brand-dark p-12">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-4">Notre mission</p>
                <p className="font-sans text-xl font-light leading-relaxed text-white">Offrir une expérience de mobilité sûre, élégante et absolue aux clients locaux et internationaux de passage sur nos terres.</p>
              </div>
              
              <div className="border-t border-white/[0.05] pt-8">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-6">Nos Valeurs Cardinales</p>
                <ul className="grid grid-cols-2 gap-4 font-sans text-sm font-light text-slate-400">
                  <li className="flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-brand-gold"></span> Sécurité Absolue
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-brand-gold"></span> Confiance
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-brand-gold"></span> Fierté Camerounaise
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-brand-gold"></span> Confort Ultime
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-32 grid gap-12 md:grid-cols-2 lg:gap-24">
            <article className="space-y-6">
              <h2 className="font-display text-2xl font-medium uppercase text-white">Pourquoi nous choisir ?</h2>
              <p className="font-sans text-sm font-light leading-relaxed text-slate-400">
                Une flotte méticuleusement entretenue, des chauffeurs familiers des codes du luxe et formés à la conduite défensive. Une assistance locale 24/7 pour que votre esprit soit dédié à votre voyage, pas à votre trajet.
              </p>
            </article>
            <article className="space-y-6">
              <h2 className="font-display text-2xl font-medium uppercase text-white">Notre engagement</h2>
              <p className="font-sans text-sm font-light leading-relaxed text-slate-400">
                L'intégrité avant tout. Des tarifs transparents, un service courtois et professionnel avec une communication bilingue impeccable (Français/Anglais). L'attente de nos clients est le niveau minimum que nous devions dépasser.
              </p>
            </article>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
