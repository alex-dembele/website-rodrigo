'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { site, waLink } from '@/lib/site';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function buildMessage() {
    return [
      `Bonjour ${site.name},`,
      name && `Je suis ${name}.`,
      phone && `Mon numéro : ${phone}.`,
      message
    ].filter(Boolean).join('\n');
  }

  function sendWhatsApp() {
    window.open(waLink(buildMessage()), '_blank');
  }
  function sendEmail() {
    const subject = `Message de ${name || 'un client'}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
  }

  const inputCls =
    'w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15';

  return (
    <section className="container" aria-labelledby="contact-title">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">Contact</p>
          <h2 id="contact-title" className="mt-2 font-display text-3xl font-extrabold text-brand-ink sm:text-4xl">
            Une question ? Écris-nous
          </h2>
          <p className="mt-3 max-w-md text-brand-gray">
            Le plus rapide, c’est WhatsApp ou l’appel direct. On te répond dans la journée.
          </p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red"><Phone className="h-5 w-5" /></span>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-ink hover:text-brand-red">{site.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red"><Mail className="h-5 w-5" /></span>
              <a href={`mailto:${site.email}`} className="font-semibold text-brand-ink hover:text-brand-red">{site.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red"><MapPin className="h-5 w-5" /></span>
              <span className="font-medium text-brand-ink">{site.address}, {site.city}</span>
            </li>
          </ul>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendWhatsApp(); }} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
          <div className="grid gap-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton nom" className={inputCls} />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ton téléphone" className={inputCls} />
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ton message" className={inputCls} />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5">
              <MessageCircle className="h-5 w-5" /> Envoyer sur WhatsApp
            </button>
            <button type="button" onClick={sendEmail} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-6 py-3.5 font-semibold text-brand-ink transition hover:border-brand-red/40">
              <Mail className="h-5 w-5" /> Par email
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
