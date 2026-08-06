import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ArticleCta from '@/components/ArticleCta';
import { articles, findArticle, formatArticleDate, type Block } from '@/lib/articles';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  return {
    title: article.shortTitle,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `${site.url}/blog/${article.slug}`,
      publishedTime: article.date
    }
  };
}

function Prose({ block }: { block: Block }) {
  if ('h2' in block) {
    return (
      <h2 className="mt-10 font-display text-2xl font-extrabold text-brand-ink">{block.h2}</h2>
    );
  }
  if ('p' in block) {
    return <p className="mt-4 leading-relaxed text-brand-gray">{block.p}</p>;
  }
  if ('ul' in block) {
    return (
      <ul className="mt-4 space-y-2.5">
        {block.ul.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-brand-gray">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if ('ol' in block) {
    return (
      <ol className="mt-4 space-y-3">
        {block.ol.map((item, i) => (
          <li key={item} className="flex gap-3 leading-relaxed text-brand-gray">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-red text-xs font-bold text-white">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <p className="mt-5 flex gap-3 rounded-2xl border border-brand-red/20 bg-brand-red/5 p-4 text-sm leading-relaxed text-brand-ink">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
      <span>{block.note}</span>
    </p>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug);
  const url = `${site.url}/blog/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: 'fr-FR',
        mainEntityOfPage: url,
        image: `${site.url}/og.jpg`,
        author: { '@type': 'Organization', name: site.name, url: site.url },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          logo: { '@type': 'ImageObject', url: `${site.url}/brand/logo.png` }
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Conseils', item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: article.shortTitle, item: url }
        ]
      }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <article>
          <header className="border-b border-brand-line bg-white">
            <div className="container py-10 sm:py-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Tous les conseils
              </Link>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight text-brand-ink sm:text-4xl">
                {article.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-gray">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand-red" />
                  <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand-red" /> {article.readingMinutes} min de lecture
                </span>
              </div>
            </div>
          </header>

          <div className="container grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-lg font-medium leading-relaxed text-brand-ink">{article.excerpt}</p>
              {article.body.map((block, i) => (
                <Prose key={i} block={block} />
              ))}

              <section aria-labelledby="faq" className="mt-12">
                <h2 id="faq" className="font-display text-2xl font-extrabold text-brand-ink">
                  Questions fréquentes
                </h2>
                <dl className="mt-4 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
                  {article.faq.map((f) => (
                    <div key={f.q} className="p-5">
                      <dt className="font-semibold text-brand-ink">{f.q}</dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-brand-gray">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <ArticleCta />

              <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-brand-ink">À lire aussi</h2>
                <ul className="mt-4 space-y-4">
                  {others.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/blog/${a.slug}`} className="group block">
                        <p className="font-semibold text-brand-ink group-hover:text-brand-red">
                          {a.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-brand-gray">{a.excerpt}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
