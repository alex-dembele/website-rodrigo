'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface Props {
  images: string[];
  alt: string;
  className?: string;
}

/**
 * Image de véhicule + galerie plein écran (lightbox).
 * Affichage en object-contain pour ne jamais couper une photo (idéal pour les collages).
 *
 * La galerie est rendue dans un portal sur <body> : les cartes qui l'entourent
 * sont animées (`transform`), et un ancêtre transformé enferme les éléments
 * `position: fixed` — la galerie se retrouvait alors coincée dans la carte,
 * l'image débordante passant par-dessus le bouton de fermeture.
 */
export default function VehicleMedia({ images, alt, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [mounted, setMounted] = useState(false);
  const count = images.length;

  useEffect(() => setMounted(true), []);

  const next = useCallback(() => setI((v) => (v + 1) % count), [count]);
  const prev = useCallback(() => setI((v) => (v - 1 + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, next, prev]);

  return (
    <>
      <button
        type="button"
        onClick={() => { setI(0); setOpen(true); }}
        className={`group relative block w-full overflow-hidden bg-[#EDEDF0] ${className}`}
        aria-label={`Voir les photos — ${alt}`}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {count > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <Images className="h-3.5 w-3.5" /> {count} photos
          </span>
        )}
      </button>

      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[82vh] w-full max-w-5xl grow" onClick={(e) => e.stopPropagation()}>
            <Image src={images[i]} alt={`${alt} — photo ${i + 1}`} fill className="object-contain" sizes="100vw" />
          </div>

          {/* les commandes passent au-dessus de la photo, quelle que soit sa taille */}
          <button
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            <X className="h-6 w-6" />
          </button>

          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
              <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
                {i + 1} / {count}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
