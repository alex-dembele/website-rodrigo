import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Conseils location de voiture à Douala',
  description:
    'Nos conseils pratiques pour louer une voiture à Douala : papiers, caution, chauffeur, paiement Orange Money et MTN MoMo.',
  alternates: { canonical: '/blog' }
};

const articles = [
  {
    title: 'Louer une voiture à Douala : comment ça marche',
    excerpt:
      'Papiers à prévoir, caution, prise en charge du véhicule et restitution : le déroulé complet d’une location chez Rodrigo Services.',
    date: '9 juillet 2026'
  },
  {
    title: 'Avec ou sans chauffeur : que choisir ?',
    excerpt:
      'Selon ton trajet, ton budget et ton habitude de conduite, on t’explique quelle formule est la plus intéressante.',
    date: '2 juillet 2026'
  },
  {
    title: 'Payer par Orange Money ou MTN MoMo',
    excerpt:
      'Comment régler ton acompte en Mobile Money simplement, et garder une preuve de paiement pour ta réservation.',
    date: '25 juin 2026'
  }
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Conseils</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Nos conseils pour louer sereinement
            </h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              Des articles simples pour t’aider à bien préparer ta location à Douala.
            </p>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <article key={a.title} className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">{a.date}</p>
                <h2 className="mt-2 font-display text-lg font-bold text-brand-ink">{a.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-gray">{a.excerpt}</p>
                <span className="mt-4 text-sm font-semibold text-brand-gray">Bientôt en ligne</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
