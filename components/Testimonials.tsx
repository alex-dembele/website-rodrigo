import { ShieldCheck, Wallet, Clock, MapPin } from 'lucide-react';
import Reveal from './Reveal';

const reasons = [
  { icon: Wallet, title: 'Prix clairs', text: "Des tarifs affichés en FCFA, sans mauvaise surprise. Tu sais ce que tu paies." },
  { icon: ShieldCheck, title: 'Voitures entretenues', text: "Des Toyota fiables, régulièrement contrôlées et propres à chaque location." },
  { icon: Clock, title: 'Réponse rapide', text: "On répond vite par WhatsApp ou par appel pour confirmer ta réservation." },
  { icon: MapPin, title: 'Basés à Douala', text: "Agence à Bonamoussadi, service partout dans la ville et au-delà." }
];

export default function Testimonials() {
  return (
    <section className="container">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Pourquoi nous choisir</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
          Une location simple et de confiance
        </h2>
        <p className="mt-3 text-brand-gray">
          Une petite équipe locale à Douala, à ton écoute pour te trouver la voiture qu’il te faut.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, idx) => (
          <Reveal key={r.title} delay={idx * 80}>
            <div className="group h-full rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/10 text-brand-red transition-transform duration-300 group-hover:scale-110">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-brand-ink">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">{r.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
