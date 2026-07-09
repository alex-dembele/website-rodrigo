import { Car, UserRound, Plane, CalendarRange } from 'lucide-react';
import Reveal from './Reveal';

const services = [
  {
    icon: Car,
    title: 'Location sans chauffeur',
    text: "Prends le volant toi-même. Voiture propre, entretenue et prête à rouler, avec des papiers en règle."
  },
  {
    icon: UserRound,
    title: 'Location avec chauffeur',
    text: "Un chauffeur qui connaît bien Douala te conduit où tu veux, en toute tranquillité."
  },
  {
    icon: Plane,
    title: 'Transfert aéroport',
    text: "On vient te chercher ou te déposer à l’aéroport de Douala à l’heure, sans stress."
  },
  {
    icon: CalendarRange,
    title: 'À la journée ou longue durée',
    text: "Une journée, une semaine ou plus : tarifs adaptés pour les particuliers et les entreprises."
  }
];

export default function ServicesSection() {
  return (
    <section className="bg-brand-soft">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Nos services</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
            Ce que nous proposons
          </h2>
          <p className="mt-3 text-brand-gray">
            Des solutions simples pour vos déplacements à Douala et partout au Cameroun.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 80}>
              <div className="group h-full rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/10 text-brand-red transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-brand-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
