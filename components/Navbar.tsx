'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { site, waLink } from '@/lib/site';

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos voitures', href: '/vehicles' },
  { label: 'Services', href: '/services' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white/90 backdrop-blur-md">
      <div className="container flex items-center justify-between py-3.5">
        <Link href="/" aria-label="Rodrigo Services — accueil">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-underline text-sm font-medium text-brand-gray transition-colors hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className="text-sm font-semibold text-brand-ink transition-colors hover:text-brand-red"
          >
            {site.phone}
          </a>
          <Link
            href="/reservation"
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
          >
            Réserver
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          aria-label="Menu principal"
          aria-expanded={isOpen}
        >
          <span className={`block h-[2px] w-6 bg-brand-ink transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-[2px] w-6 bg-brand-ink transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-6 bg-brand-ink transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-brand-line bg-white lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-brand-ink transition-colors hover:bg-brand-soft"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-brand-red px-5 py-3.5 text-base font-semibold text-white"
            >
              Réserver une voiture
            </Link>
            <a
              href={waLink(`Bonjour ${site.name}, je souhaite louer une voiture.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-line px-5 py-3.5 text-base font-semibold text-brand-ink"
            >
              Écrire sur WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
