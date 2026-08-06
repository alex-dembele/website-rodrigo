import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { site, waLink, fcfa } from '@/lib/site';
import { availableVehicles } from '@/lib/vehicles';

const cheapest = Math.min(...availableVehicles.map((v) => v.pricePerDay));

/** Encart de conversion affiché à côté des articles. */
export default function ArticleCta() {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Réserver</p>
      <p className="mt-2 font-display text-xl font-extrabold leading-snug text-brand-ink">
        Une voiture à Douala à partir de {fcfa(cheapest)}/jour
      </p>
      <p className="mt-2 text-sm leading-relaxed text-brand-gray">
        Avec ou sans chauffeur, acompte par Orange Money ou MTN MoMo. On confirme la disponibilité
        sur WhatsApp.
      </p>
      <Link
        href="/reservation"
        className="mt-4 flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
      >
        Voir les disponibilités
      </Link>
      <a
        href={waLink(`Bonjour ${site.name}, j’ai une question sur la location.`)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded-full border border-brand-line px-6 py-3 font-semibold text-brand-ink transition hover:border-brand-red/40"
      >
        <MessageCircle className="h-5 w-5 text-brand-red" /> Poser une question
      </a>
    </div>
  );
}
