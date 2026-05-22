"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos véhicules', href: '/vehicles' },
  { label: 'Services', href: '/services' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/10 bg-brand-base/90 backdrop-blur-xl"
    >
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="text-lg font-semibold tracking-[0.18em] text-white">
          RODRIGO SERVICES
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.22em] text-slate-300 transition hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex">
          <Link
            href="https://wa.me/237XXXXXXXX?text=Bonjour"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/10 px-5 py-3 text-xs font-semibold tracking-wider text-brand-gold transition hover:bg-brand-gold/20"
          >
            WhatsApp
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 lg:hidden p-2"
          aria-label="Menu principal"
        >
          <span className={`block h-[2px] w-6 bg-white transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-brand-base"
          >
            <nav className="container flex flex-col gap-4 py-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.22em] text-slate-300 transition hover:text-brand-gold"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="https://wa.me/237XXXXXXXX"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-gold px-5 py-4 text-xs font-semibold uppercase tracking-wider text-brand-base"
              >
                Contacter sur WhatsApp
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
