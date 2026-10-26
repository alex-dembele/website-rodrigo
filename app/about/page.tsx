import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import MapEmbed from '@/components/MapEmbed';
import { site, telLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'À propos de Rodrigo Auto Services',
  description:
    'Rodrigo Auto Services est une petite entreprise de location de voiture basée à Bonamoussadi, Douala. Des voitures fiables, des prix clairs et un service de proximité.',
  alternates: { canonical: '/about' }
};

const values = ['Prix honnêtes', 'Voitures entretenues', 'Proximité et écoute', 'Réponse rapide'];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">À propos</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Une location de voiture proche de vous
            </h1>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4 text-brand-gray">
              <p>
                Rodrigo Auto Services est une petite entreprise camerounaise de location de voiture, basée à
                <strong className="text-brand-ink"> {site.address}, {site.city}</strong>. Notre objectif est
                simple : vous proposer des voitures fiables à des prix clairs, sans complications.
              </p>
              <p>
                Que ce soit pour un rendez-vous en ville, un déplacement en famille, un transfert à
                l’aéroport ou une location de plusieurs jours, on s’adapte à votre besoin — avec ou sans
                chauffeur.
              </p>
              <p>
                On répond vite par WhatsApp et par téléphone, et le paiement se fait en Mobile Money
                (Orange Money ou MTN MoMo), comme vous en avez l’habitude.
              </p>
              <Link
                href="/reservation"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-red px-7 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
              >
                Réserver une voiture
              </Link>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
              <h2 className="font-display text-lg font-bold text-brand-ink">Ce qui compte pour nous</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {values.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-brand-ink">
                    <Check className="h-5 w-5 text-brand-red" /> {v}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-brand-soft p-4 text-sm text-brand-gray">
                <p><strong className="text-brand-ink">Adresse :</strong> {site.address}, {site.city}</p>
                <p className="mt-1">
                  <strong className="text-brand-ink">Téléphone :</strong>{' '}
                  <a href={telLink()} className="hover:text-brand-red">{site.phone}</a>
                  {site.phone2 && (
                    <>
                      {' · '}
                      <a href={telLink(site.phone2)} className="whitespace-nowrap hover:text-brand-red">{site.phone2}</a>
                    </>
                  )}
                </p>
                <p className="mt-1"><strong className="text-brand-ink">Email :</strong> {site.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-5 font-display text-2xl font-extrabold text-brand-ink">Où nous trouver</h2>
            <MapEmbed />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
