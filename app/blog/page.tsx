import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Reveal from '@/components/Reveal';
import { articles, formatArticleDate } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Conseils location de voiture à Douala',
  description:
    'Nos conseils pratiques pour louer une voiture à Douala : papiers à prévoir, location avec ou sans chauffeur, paiement Orange Money et MTN MoMo.',
  alternates: { canonical: '/blog' }
};

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
            {articles.map((a, idx) => (
              <Reveal key={a.slug} delay={idx * 90} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-gray">
                    <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-brand-red">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {a.readingMinutes} min
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-bold text-brand-ink">
                    <Link href={`/blog/${a.slug}`} className="hover:text-brand-red">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-gray">{a.excerpt}</p>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
                  >
                    Lire l’article <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
