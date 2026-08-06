import Link from 'next/link';
import { CalendarCheck, Smartphone, KeyRound } from 'lucide-react';
import { site } from '@/lib/site';
import Reveal from './Reveal';

const steps = [
  {
    icon: CalendarCheck,
    title: '1. Choisis et réserve',
    text: "Sélectionne ta voiture et tes dates, puis envoie ta demande par WhatsApp ou email."
  },
  {
    icon: Smartphone,
    title: '2. Paie l’acompte',
    text: `Règle ${site.payment.depositPercent}% par Orange Money ou MTN MoMo pour bloquer le véhicule.`
  },
  {
    icon: KeyRound,
    title: '3. Récupère la voiture',
    text: "On te confirme, tu récupères la voiture et tu règles le reste sur place."
  }
];

export default function PaymentSection() {
  return (
    <section className="container">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Comment ça marche</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
            Réserver et payer, facilement
          </h2>
          <p className="mt-3 text-brand-gray">
            Pas besoin de carte bancaire. Tu paies avec ton téléphone, en Mobile Money, comme d’habitude.
          </p>

          <div className="mt-6 space-y-4">
            {steps.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 100} className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-ink">{s.title}</h3>
                  <p className="text-sm text-brand-gray">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            href="/reservation"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-red px-7 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
          >
            Commencer ma réservation
          </Link>
        </div>

        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-brand-ink">Moyens de paiement acceptés</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#FFCC00]/50 bg-[#FFCC00]/10 p-4">
              <p className="font-bold text-brand-ink">{site.payment.momo.label}</p>
              <p className="mt-1 font-semibold text-brand-ink">
                {site.payment.momo.number || 'Numéro communiqué à la confirmation'}
              </p>
              <p className="text-sm text-brand-gray">Bénéficiaire : {site.payment.momo.holder}</p>
              <p className="text-sm text-brand-gray">Code {site.payment.momo.ussd}</p>
            </div>
            <div className="rounded-xl border border-[#FF6600]/50 bg-[#FF6600]/10 p-4">
              <p className="font-bold text-brand-ink">{site.payment.orange.label}</p>
              <p className="mt-1 font-semibold text-brand-ink">
                {site.payment.orange.number || 'Numéro communiqué à la confirmation'}
              </p>
              <p className="text-sm text-brand-gray">Bénéficiaire : {site.payment.orange.holder}</p>
              <p className="text-sm text-brand-gray">Code {site.payment.orange.ussd}</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-brand-soft p-4 text-sm text-brand-gray">
            Vérifie le nom du bénéficiaire affiché par ton opérateur avant de valider. Après le
            transfert, garde ton SMS de confirmation et envoie-nous le numéro de transaction — on
            valide ta réservation tout de suite.
          </p>
        </div>
      </div>
    </section>
  );
}
