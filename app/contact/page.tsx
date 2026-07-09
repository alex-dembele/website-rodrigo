import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactForm from '@/components/ContactForm';
import MapEmbed from '@/components/MapEmbed';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Contact — Rodrigo Services Douala',
  description:
    'Contactez Rodrigo Services à Bonamoussadi, Douala pour louer une voiture : téléphone, WhatsApp et email. Réponse rapide.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-cream">
        <section className="border-b border-brand-line bg-white">
          <div className="container py-10 sm:py-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Contact</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
              Contacte-nous
            </h1>
            <p className="mt-2 max-w-2xl text-brand-gray">
              On est là pour répondre à tes questions et t’aider à réserver la bonne voiture.
            </p>
          </div>
        </section>
        <div className="py-10 sm:py-12">
          <ContactForm />
        </div>
        <div className="container pb-14">
          <Reveal>
            <h2 className="mb-5 font-display text-2xl font-extrabold text-brand-ink">Nous trouver</h2>
            <MapEmbed />
          </Reveal>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
