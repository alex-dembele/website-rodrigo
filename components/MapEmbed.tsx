import { MapPin, Navigation } from 'lucide-react';
import { site } from '@/lib/site';

/** Carte Google Maps intégrée (sans clé API) + lien itinéraire. */
export default function MapEmbed() {
  const query = encodeURIComponent(site.mapsQuery);
  const embedSrc = `https://www.google.com/maps?q=${query}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-brand-ink">{site.address}</p>
            <p className="text-sm text-brand-gray">{site.city}, {site.country}</p>
          </div>
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
        >
          <Navigation className="h-4 w-4" /> Itinéraire
        </a>
      </div>
      <iframe
        title={`Localisation de ${site.name} à ${site.city}`}
        src={embedSrc}
        className="h-[320px] w-full sm:h-[400px]"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
