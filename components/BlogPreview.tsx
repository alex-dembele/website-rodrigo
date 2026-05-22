import Link from 'next/link';

const posts = [
  {
    title: '5 conseils pour conduire en toute sérénité à Douala',
    excerpt: 'Découvrez nos astuces pour éviter le trafic, choisir le bon véhicule et préparer votre trajet localement.',
    href: '/blog'
  },
  {
    title: 'Transfert aéroport : l’expérience premium avec Rodrigo',
    excerpt: 'Guide complet pour votre arrivée à Douala : options de prise en charge, documents et attentes.',
    href: '/blog'
  },
  {
    title: 'Pourquoi louer un 4x4 pour l’intérieur du Cameroun',
    excerpt: 'Explorez les routes intérieures avec confort et sécurité grâce à nos 4x4 adaptés aux voyages.',
    href: '/blog'
  }
];

export default function BlogPreview() {
  return (
    <section className="container py-24 sm:py-32" aria-labelledby="blog-title">
      <div className="space-y-6 text-center mb-16">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Journal</p>
        <h2 id="blog-title" className="font-display text-4xl font-medium uppercase leading-tight tracking-tight text-white md:text-5xl">
          L'art de maîtriser <br className="hidden sm:block"/> le goudron.
        </h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.title} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.05] bg-brand-dark p-8 min-h-[300px] transition-all hover:border-brand-gold/30">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-medium uppercase text-white leading-tight">{post.title}</h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-slate-400">{post.excerpt}</p>
            </div>
            <Link href={post.href} className="relative z-10 mt-8 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-brand-gold transition-transform group-hover:translate-x-2">
              Lire l'article <span className="text-xl leading-none">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
