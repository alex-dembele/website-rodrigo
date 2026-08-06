import Link from 'next/link';
import Reveal from './Reveal';
import { articles } from '@/lib/articles';

const posts = articles.map((a) => ({
  title: a.title,
  excerpt: a.excerpt,
  href: `/blog/${a.slug}`
}));

export default function BlogPreview() {
  return (
    <section className="bg-brand-soft">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Conseils</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Bon à savoir avant de louer
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-brand-red hover:underline">
            Voir tous les articles →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {posts.map((post, idx) => (
            <Reveal key={post.title} delay={idx * 90} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <h3 className="font-display text-lg font-bold text-brand-ink">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-gray">{post.excerpt}</p>
                <Link href={post.href} className="mt-4 text-sm font-semibold text-brand-red hover:underline">
                  Lire l’article →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
