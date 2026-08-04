import Link from 'next/link';
import { LogoMark } from './Logo';
import { site, waLink, telLink } from '@/lib/site';

const nav = [
  { label: 'Nos voitures', href: '/vehicles' },
  { label: 'Services', href: '/services' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Réserver', href: '/reservation' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-line bg-brand-soft">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="font-display text-lg font-extrabold text-brand-ink">Rodrigo Services</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-brand-gray">
            Location de voiture à Douala, avec ou sans chauffeur. Des véhicules fiables et
            entretenus, à des prix clairs, pour la ville comme pour vos déplacements au Cameroun.
          </p>
          <div className="flex gap-3 pt-1">
            {site.social.facebook !== '#' && (
              <a href={site.social.facebook} className="text-sm font-medium text-brand-gray hover:text-brand-red">Facebook</a>
            )}
            <a href={waLink('Bonjour, je souhaite des informations.')} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-gray hover:text-brand-red">WhatsApp</a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray">Navigation</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-brand-ink transition-colors hover:text-brand-red">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray">Contact</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-ink">
            <li>
              <a href={telLink()} className="hover:text-brand-red">{site.phone}</a>
              <span className="ml-2 text-xs text-brand-gray">Appels</span>
            </li>
            <li>
              <a href={waLink('Bonjour, je souhaite louer une voiture.')} target="_blank" rel="noreferrer" className="hover:text-brand-red">
                {site.whatsappDisplay}
              </a>
              <span className="ml-2 text-xs text-brand-gray">WhatsApp</span>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-brand-red">{site.email}</a>
            </li>
            <li className="text-brand-gray">{site.address}</li>
            <li className="text-brand-gray">{site.city}, {site.country}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-line">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-gray sm:flex-row">
          <p>© {new Date().getFullYear()} Rodrigo Services — Location de voiture à Douala.</p>
          <p>Paiement Orange Money & MTN Mobile Money.</p>
        </div>
      </div>
    </footer>
  );
}
