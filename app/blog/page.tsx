import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const articles = [
  {
    title: '5 conseils pour conduire en toute sérénité à Douala',
    excerpt: 'Optimisez votre trajet dans la métropole avec des recommandations de sécurité et des astuces locales.',
    date: '15 mai 2026'
  },
  {
    title: 'Transfert aéroport : l’expérience premium avec Rodrigo',
    excerpt: 'Préparez votre arrivée à Douala avec nos conseils pour un transfert fluide et confortable.',
    date: '10 mai 2026'
  },
  {
    title: 'Pourquoi choisir un 4x4 pour les routes du Cameroun',
    excerpt: 'Découvrez les avantages d’une voiture tout-terrain pour explorer les routes intérieures et les destinations touristiques.',
    date: '5 mai 2026'
  }
];

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <section className="container py-24">
        <div className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-300">Blog</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Conseils de voyage et actualités</h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300">
            Informations utiles pour vos déplacements à Douala et le Cameroun, avec un ton local et professionnel.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-card transition hover:-translate-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">{article.date}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{article.title}</h2>
              <p className="mt-4 text-slate-300 leading-7">{article.excerpt}</p>
              <button className="mt-6 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                Lire l’article
              </button>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
