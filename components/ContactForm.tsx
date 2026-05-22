export default function ContactForm() {
  return (
    <section className="container py-24 sm:py-32" aria-labelledby="contact-title">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Contact</p>
          <h2 id="contact-title" className="font-display text-4xl font-medium uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
            Prêt à dominer <br/> la route ?
          </h2>
          <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-slate-400">
            Discutez de votre projet de mobilité avec nos experts. Pour les requêtes urgentes ou la clientèle VIP, privilégiez le contact direct par téléphone ou WhatsApp.
          </p>
        </div>
        
        <form className="space-y-12">
          <div className="relative pt-4">
            <input type="text" id="contact-name" placeholder=" " className="peer w-full border-b border-white/[0.15] bg-transparent pb-4 font-sans text-lg font-light text-white outline-none transition-colors focus:border-brand-gold" />
            <label htmlFor="contact-name" className="pointer-events-none absolute left-0 top-4 origin-left font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-brand-gold">
              Nom Complet
            </label>
          </div>
          
          <div className="relative pt-4">
            <input type="email" id="contact-email" placeholder=" " className="peer w-full border-b border-white/[0.15] bg-transparent pb-4 font-sans text-lg font-light text-white outline-none transition-colors focus:border-brand-gold" />
            <label htmlFor="contact-email" className="pointer-events-none absolute left-0 top-4 origin-left font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-brand-gold">
              Adresse Email
            </label>
          </div>
          
          <div className="relative pt-4">
            <textarea id="contact-message" rows={4} placeholder=" " className="peer w-full resize-none border-b border-white/[0.15] bg-transparent pb-4 font-sans text-lg font-light text-white outline-none transition-colors focus:border-brand-gold" />
            <label htmlFor="contact-message" className="pointer-events-none absolute left-0 top-4 origin-left font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-brand-gold">
              Votre Demande
            </label>
          </div>
          
          <button type="submit" className="group flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-brand-gold px-12 font-sans text-[10px] font-bold uppercase tracking-widest text-brand-base transition-all hover:scale-[1.02] hover:bg-brand-goldLite hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <span className="relative z-10">Envoyer le message</span>
          </button>
        </form>
      </div>
    </section>
  );
}
