import Image from 'next/image';
import Link from 'next/link';
import { Phone, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSearch from '@/components/HeroSearch';
import ServicesSection from '@/components/ServicesSection';
import PaymentSection from '@/components/PaymentSection';
import Testimonials from '@/components/Testimonials';
import BlogPreview from '@/components/BlogPreview';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import VehicleCard from '@/components/VehicleCard';
import Reveal from '@/components/Reveal';
import { availableVehicles } from '@/lib/vehicles';
import { site, fcfa, telLink } from '@/lib/site';

const heroPoints = ['Avec ou sans chauffeur', 'Paiement OM & MoMo', 'Réponse rapide'];
const cheapestPrice = Math.min(...availableVehicles.map((v) => v.pricePerDay));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft to-white">
          {/* Blobs décoratifs animés */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl animate-blob-drift" />
          <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-brand-ink/5 blur-3xl animate-blob-drift" style={{ animationDelay: '3s' }} />

          <div className="container relative grid gap-10 py-12 lg:grid-cols-2 lg:items-center lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-3 py-1 text-xs font-semibold text-brand-gray animate-fade-up">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                {site.city}, {site.country}
              </span>
              <h1 className="mt-4 max-w-lg font-display text-3xl font-extrabold leading-[1.15] text-brand-ink sm:text-4xl lg:text-[2.75rem] animate-fade-up" style={{ animationDelay: '0.08s' }}>
                Location de voiture à Douala,{' '}
                <span className="text-brand-red">avec ou sans chauffeur</span>
              </h1>
              <p className="mt-4 max-w-lg text-lg text-brand-gray animate-fade-up" style={{ animationDelay: '0.16s' }}>
                Des voitures fiables et abordables pour la ville et vos déplacements au Cameroun.
                Réservation simple et paiement Orange Money ou MTN MoMo.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 animate-fade-up" style={{ animationDelay: '0.24s' }}>
                {heroPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm font-medium text-brand-ink">
                    <Check className="h-4 w-4 text-brand-red" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.32s' }}>
                <Link href="/reservation" className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-red px-7 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5 sm:flex-none">
                  Réserver maintenant
                </Link>
                <a href={telLink()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-7 py-3.5 font-semibold text-brand-ink transition hover:border-brand-red/40 hover:-translate-y-0.5 sm:flex-none">
                  <Phone className="h-5 w-5 text-brand-red" /> Appeler
                </a>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-line bg-[#EDEDF0] shadow-card">
                <Image
                  src="/cars/rav4-2.jpg"
                  alt="Toyota RAV4 en location chez Rodrigo Services à Douala"
                  fill
                  priority
                  className="object-contain transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-4 left-4 rounded-xl border border-brand-line bg-white px-4 py-2.5 shadow-card sm:left-6">
                <p className="text-[11px] uppercase tracking-wider text-brand-gray">à partir de</p>
                <p className="font-display text-lg font-extrabold leading-tight text-brand-ink">
                  {fcfa(cheapestPrice)}<span className="text-sm font-medium text-brand-gray">/jour</span>
                </p>
              </div>
            </div>
          </div>

          <div className="container relative pb-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <HeroSearch />
          </div>
        </section>

        {/* Flotte */}
        <section className="container">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Nos voitures</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
                Choisis ta voiture
              </h2>
              <p className="mt-3 text-brand-gray">Des Toyota entretenues, prêtes à rouler.</p>
            </div>
            <Link href="/vehicles" className="text-sm font-semibold text-brand-red hover:underline">
              Voir toutes les voitures →
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableVehicles.map((v, idx) => (
              <Reveal key={v.id} delay={idx * 90} className="h-full">
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </section>

        <ServicesSection />
        <PaymentSection />
        <Testimonials />
        <BlogPreview />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
