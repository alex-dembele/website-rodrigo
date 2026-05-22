"use client";

import { motion } from 'framer-motion';

export default function ServicesSection() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="services-title">
      <div className="container">
        <div className="mb-20 text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Prestations</p>
          <h2 id="services-title" className="mt-6 font-display text-4xl font-medium uppercase leading-tight tracking-tight text-white md:text-6xl">
            L'excellence <br className="hidden md:block" /> Sans Compromis.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2 lg:gap-6">
          {/* Card 1: Large Span */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-brand-dark p-8 md:col-span-2 md:row-span-1 min-h-[350px] border border-white/[0.05]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-base via-transparent to-brand-gold/[0.02]" />
            <div className="relative z-10">
              <span className="mb-4 inline-block font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">01</span>
              <h3 className="font-display text-3xl font-medium text-white sm:text-4xl">Chauffeur Privé</h3>
              <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-slate-400">
                Discrétion absolue et professionnalisme. Nos chauffeurs formés à la conduite VIP maîtrisent parfaitement les itinéraires de Douala et ses environs pour des déplacements fluides et sécurisés.
              </p>
            </div>
            {/* Minimalist icon / glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/5 blur-3xl transition-all duration-700 group-hover:bg-brand-gold/10" />
          </motion.article>

          {/* Card 2: Small Square */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-brand-dark p-8 border border-white/[0.05] min-h-[350px]"
          >
            <div className="relative z-10">
              <span className="mb-4 inline-block font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">02</span>
              <h3 className="font-display text-2xl font-medium text-white">Transfert <br/> Aéroport</h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-slate-400">
                Accueil personnalisé dès votre sortie du terminal avec logistique bagages et accueil VIP intégré.
              </p>
            </div>
          </motion.article>

          {/* Card 3: Small Square */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-brand-dark p-8 border border-white/[0.05] min-h-[350px]"
          >
            <div className="relative z-10">
              <span className="mb-4 inline-block font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">03</span>
              <h3 className="font-display text-2xl font-medium text-white">Location <br/> Longue Durée</h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-slate-400">
                Contrats élites sur-mesure pour les exigences des entreprises et diplomates.
              </p>
            </div>
          </motion.article>

          {/* Card 4: Large Span horizontal */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-[#0A0A0E] p-8 md:col-span-2 md:row-span-1 border border-white/[0.05] min-h-[350px]"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 grayscale mix-blend-luminosity transition-all duration-700 group-hover:opacity-25 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/80 to-transparent" />
            <div className="relative z-10">
              <span className="mb-4 inline-block font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">04</span>
              <h3 className="font-display text-3xl font-medium text-white sm:text-4xl">Sécurité <br /> Absolue</h3>
              <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-slate-400">
                L'ensemble de notre flotte exclusive bénéficie d'un suivi millimétré et d'une couverture "tous risques" intégrale pour garantir votre sérénité totale peu importe la route.
              </p>
            </div>
          </motion.article>

        </div>
      </div>
    </section>
  );
}
