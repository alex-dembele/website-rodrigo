import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import ServicesSection from '@/components/ServicesSection';
import Testimonials from '@/components/Testimonials';
import BlogPreview from '@/components/BlogPreview';
import ReservationFlow from '@/components/ReservationFlow';
import PayPalSection from '@/components/PayPalSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { vehicles } from '@/lib/vehicles';

export default function Home() {
  const featured = vehicles.slice(0, 3);

  return (
    <main>
      <Navbar />
      <section className="relative flex min-h-screen flex-col overflow-hidden pb-12">
        {/* Full screen cinématique background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2000&q=100"
            alt="Porsche sur fond sombre"
            fill
            className="object-cover object-center scale-[1.02] transform transition-transform duration-[20s] hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-base/80 via-transparent to-brand-base/80" />
        </div>

        <div className="container relative z-10 mt-auto flex flex-col items-center pt-48 pb-32 text-center text-white">
          <div className="max-w-5xl space-y-8 mix-blend-lighten">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">
              Rodrigo Services Elite
            </p>
            <h1 className="font-display text-6xl font-medium uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl md:text-[8rem]">
              Réservez <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">votre véhicule</span>
            </h1>
            <p className="font-sans mx-auto max-w-xl text-sm sm:text-base font-light leading-relaxed text-slate-300">
              Une collection exclusive de véhicules pour dominer l'asphalte et les pistes du Cameroun. Prestations VIP, discrétion absolue, excellence mécanique.
            </p>
          </div>
        </div>

        <div className="container relative z-20 mt-auto w-full transform translate-y-6">
          <HeroSearch />
        </div>
      </section>

      <section className="py-32" aria-labelledby="featured-title">
        <div className="container mb-24 grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">
              Notre Collection
            </p>
            <h2 id="featured-title" className="font-display text-5xl font-medium uppercase leading-[0.95] tracking-[-0.02em] text-white lg:text-7xl">
              Domptez <br /> <span className="text-slate-500">l'Asphalte</span>.
            </h2>
          </div>
          <div className="space-y-4 lg:border-l lg:border-white/[0.05] lg:pl-16">
            <p className="font-sans text-base font-light leading-relaxed text-slate-400">
              Chaque modèle est méticuleusement choisi pour allier confort suprême et performance absolue sur le terrain exigeant de Douala.
            </p>
            <Link href="/vehicles" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:text-brand-gold">
              Voir la flotte complète <span className="ml-4 text-brand-gold">→</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Slider Layout */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-12 sm:px-12 lg:gap-12 lg:px-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="group relative flex w-[85vw] flex-none snap-center flex-col overflow-hidden rounded-[2.5rem] md:w-[65vw] lg:w-[45vw]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-[#0A0A0E]">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover px-8 pt-8 saturate-50 transition-all duration-[2s] ease-out group-hover:scale-105 group-hover:saturate-100"
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 65vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent transition-opacity duration-1000 group-hover:opacity-80" />

                {/* Simulated Headlight / Gold glow effect on hover */}
                <div className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-brand-gold/0 mix-blend-screen blur-3xl transition-all duration-1000 group-hover:bg-brand-gold/40" />

                <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-8 sm:p-12">
                  <div className="flex items-center gap-4">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
                      {vehicle.type}
                    </p>
                    {vehicle.tags && vehicle.tags.length > 0 && (
                      <span className="rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 font-sans text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                        {vehicle.tags[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-4xl font-medium uppercase tracking-tight text-white sm:text-5xl">
                    {vehicle.name}
                  </h3>
                  <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-end justify-between border-t border-white/[0.08] pt-6">
                    <div className="flex gap-8 font-sans text-xs font-light text-slate-400">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Sièges</p>
                        <p className="text-white font-medium">{vehicle.seats}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Boîte</p>
                        <p className="text-white font-medium">{vehicle.transmission}</p>
                      </div>
                    </div>
                    <Link href={`/vehicles`} className="group/btn flex items-center gap-4 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-brand-gold hover:text-brand-base hover:border-brand-gold">
                      <span className="relative z-10">Réserver - ${vehicle.pricePerDay}/j</span>
                      <span className="text-brand-gold transition-colors group-hover/btn:text-brand-base">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ServicesSection />
      <ReservationFlow />
      <PayPalSection />
      <Testimonials />
      <BlogPreview />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
