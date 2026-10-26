'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Plus, Star, Trash2, Loader2, ImagePlus, CalendarPlus } from 'lucide-react';
import { TYPES, TRANSMISSIONS, slugify, type VehiclePayload } from '@/lib/admin/vehicle-form';
import { preparePhoto, type PhotoPreparee } from '@/lib/admin/resize-image';
import type { Vehicle } from '@/lib/vehicles';
import { todayIso, upcomingRentals, type Rental } from '@/lib/rentals';

/** `order` fixe la place de la voiture sur le site ; il n'est pas modifiable ici. */
export type FicheVehicule = Vehicle & { order?: number };

interface Props {
  vehicle: FicheVehicule | null; // null = nouvelle voiture
  existingIds: string[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

const champ =
  'w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15';
const etiquette = 'mb-1.5 block text-sm font-semibold text-brand-ink';
const aide = 'mt-1 text-xs text-brand-gray';

export default function VehicleModal({ vehicle, existingIds, onClose, onSaved }: Props) {
  const nouvelle = vehicle === null;
  const [form, setForm] = useState({
    name: vehicle?.name ?? '',
    variant: vehicle?.variant ?? '',
    type: vehicle?.type ?? TYPES[0],
    transmission: vehicle?.transmission ?? TRANSMISSIONS[0],
    fuel: vehicle?.fuel ?? 'Essence',
    pricePerDay: vehicle?.pricePerDay ? String(vehicle.pricePerDay) : '',
    seats: String(vehicle?.seats ?? 5),
    doors: String(vehicle?.doors ?? 5),
    airConditioning: vehicle?.airConditioning ?? true,
    bestFor: vehicle?.bestFor ?? '',
    description: vehicle?.description ?? '',
    features: (vehicle?.features ?? []).join('\n'),
    available: vehicle?.available ?? true,
    hero: vehicle?.hero ?? false
  });
  const [gallery, setGallery] = useState<string[]>(vehicle?.gallery ?? []);
  // les locations terminées ne servent plus : on ne montre que celles à venir
  const [locations, setLocations] = useState<Rental[]>(() => upcomingRentals(vehicle?.rentals, todayIso()));
  const [photos, setPhotos] = useState<PhotoPreparee[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setPreparing(true);
    try {
      const prepared = await Promise.all(Array.from(files).map(preparePhoto));
      setPhotos((p) => [...p, ...prepared]);
    } catch {
      setErrors(['Une photo n’a pas pu être préparée. Essaie une autre photo.']);
    } finally {
      setPreparing(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  async function save() {
    setErrors([]);
    setSaving(true);
    const id = vehicle?.id ?? slugify(`${form.name} ${form.variant}`);

    if (nouvelle && existingIds.includes(id)) {
      setErrors([`Une voiture nommée « ${form.name} ${form.variant} » existe déjà. Ajoute une précision pour la distinguer.`]);
      setSaving(false);
      return;
    }

    const payload: VehiclePayload = {
      id,
      order: vehicle?.order, // conserve la place de la voiture sur le site
      name: form.name,
      variant: form.variant || undefined,
      type: form.type,
      transmission: form.transmission,
      fuel: form.fuel,
      pricePerDay: Number(form.pricePerDay.replace(/\D/g, '')),
      seats: Number(form.seats),
      doors: Number(form.doors),
      airConditioning: form.airConditioning,
      bestFor: form.bestFor,
      description: form.description,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      available: form.available,
      comingSoon: vehicle?.comingSoon, // l'annonce « Bientôt » ne se règle pas ici
      hero: form.hero,
      rentals: locations,
      gallery,
      newPhotos: photos.map((p) => p.base64)
    };

    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.errors ?? [data.error ?? 'L’enregistrement a échoué. Réessaie.']);
        return;
      }
      onSaved(`${form.name} enregistrée.`);
    } catch {
      // sans ce filet, le bouton restait bloqué sur « Enregistrement… »
      setErrors(['Pas de connexion. Rien n’a été enregistré — vérifie ton réseau et réessaie.']);
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/50 p-0 backdrop-blur-sm sm:p-6">
      <div className="mx-auto w-full max-w-3xl rounded-none bg-brand-cream shadow-card sm:rounded-3xl">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-brand-line bg-white px-5 py-4">
          <h2 className="font-display text-lg font-extrabold text-brand-ink sm:text-xl">
            {nouvelle ? 'Ajouter une voiture' : `Modifier ${vehicle.name}`}
          </h2>
          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-brand-gray transition hover:bg-brand-soft"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="rounded-2xl border border-brand-line bg-white p-5">
            <h3 className="mb-4 font-display font-bold text-brand-ink">La voiture</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={etiquette} htmlFor="v-name">Modèle</label>
                <input id="v-name" className={champ} value={form.name}
                  onChange={(e) => set('name', e.target.value)} placeholder="Ex. Toyota Corolla" />
              </div>
              <div>
                <label className={etiquette} htmlFor="v-variant">Précision (facultatif)</label>
                <input id="v-variant" className={champ} value={form.variant}
                  onChange={(e) => set('variant', e.target.value)} placeholder="Ex. Boîte automatique" />
                <p className={aide}>À remplir si tu as deux voitures du même modèle.</p>
              </div>
              <div>
                <label className={etiquette} htmlFor="v-type">Type</label>
                <select id="v-type" className={champ} value={form.type}
                  onChange={(e) => set('type', e.target.value as (typeof TYPES)[number])}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={etiquette} htmlFor="v-boite">Boîte de vitesses</label>
                <select id="v-boite" className={champ} value={form.transmission}
                  onChange={(e) => set('transmission', e.target.value as (typeof TRANSMISSIONS)[number])}>
                  {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={etiquette} htmlFor="v-fuel">Carburant</label>
                <input id="v-fuel" className={champ} value={form.fuel}
                  onChange={(e) => set('fuel', e.target.value)} placeholder="Essence ou Diesel" />
              </div>
              <div>
                <label className={etiquette} htmlFor="v-price">Prix par jour, sans chauffeur</label>
                <div className="relative">
                  <input id="v-price" className={`${champ} pr-16`} inputMode="numeric" value={form.pricePerDay}
                    onChange={(e) => set('pricePerDay', e.target.value)} placeholder="25000" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-gray">FCFA</span>
                </div>
                <p className={aide}>Juste le nombre, sans espace.</p>
              </div>
              <div>
                <label className={etiquette} htmlFor="v-seats">Places</label>
                <input id="v-seats" className={champ} inputMode="numeric" value={form.seats}
                  onChange={(e) => set('seats', e.target.value)} />
              </div>
              <div>
                <label className={etiquette} htmlFor="v-doors">Portes</label>
                <input id="v-doors" className={champ} inputMode="numeric" value={form.doors}
                  onChange={(e) => set('doors', e.target.value)} />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-3 rounded-xl bg-brand-soft p-4">
              <input type="checkbox" className="h-5 w-5 accent-brand-red" checked={form.airConditioning}
                onChange={(e) => set('airConditioning', e.target.checked)} />
              <span className="font-medium text-brand-ink">La voiture est climatisée</span>
            </label>
          </section>

          <section className="rounded-2xl border border-brand-line bg-white p-5">
            <h3 className="mb-4 font-display font-bold text-brand-ink">Photos</h3>

            {gallery.length + photos.length === 0 && (
              <p className="mb-4 rounded-xl bg-brand-soft p-4 text-sm text-brand-gray">
                Aucune photo pour l’instant. Prends la voiture de face, de côté, de l’arrière et
                l’intérieur : ce sont les photos qui décident le client.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallery.map((src, index) => (
                <figure key={src} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-line bg-brand-soft">
                  <Image src={src} alt="" fill className="object-contain" sizes="200px" />
                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">
                      Principale
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                    {index !== 0 && (
                      <button
                        onClick={() => setGallery((g) => [src, ...g.filter((p) => p !== src)])}
                        className="rounded-full bg-white/90 p-1.5 text-brand-ink"
                        title="Mettre en photo principale"
                        aria-label="Mettre en photo principale"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setGallery((g) => g.filter((p) => p !== src))}
                      className="rounded-full bg-white/90 p-1.5 text-brand-red"
                      title="Retirer cette photo"
                      aria-label="Retirer cette photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </figure>
              ))}

              {photos.map((photo, index) => (
                <figure key={photo.preview.slice(-40)} className="group relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-dashed border-brand-red/40 bg-brand-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.preview} alt="" className="h-full w-full object-contain" />
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-ink px-2 py-0.5 text-[10px] font-bold text-white">
                    Nouvelle · {photo.poidsKo} Ko
                  </span>
                  <button
                    onClick={() => setPhotos((p) => p.filter((_, i) => i !== index))}
                    className="absolute bottom-1.5 right-1.5 rounded-full bg-white/90 p-1.5 text-brand-red opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                    aria-label="Retirer cette photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </figure>
              ))}

              <button
                onClick={() => fileInput.current?.click()}
                disabled={preparing}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-line text-brand-gray transition hover:border-brand-red hover:text-brand-red disabled:opacity-60"
              >
                {preparing ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                <span className="text-xs font-semibold">{preparing ? 'Préparation…' : 'Ajouter'}</span>
              </button>
            </div>

            <input ref={fileInput} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
            <p className={aide}>
              Les photos sont réduites automatiquement : tu peux envoyer celles de ton téléphone.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-line bg-white p-5">
            <h3 className="mb-4 font-display font-bold text-brand-ink">Ce que voit le client</h3>
            <div className="space-y-4">
              <div>
                <label className={etiquette} htmlFor="v-bestfor">Phrase qui aide à choisir</label>
                <input id="v-bestfor" className={champ} value={form.bestFor}
                  onChange={(e) => set('bestFor', e.target.value)}
                  placeholder="Ex. Routes dégradées, familles et bagages" />
                <p className={aide}>Une ligne, affichée sur la carte de la voiture.</p>
              </div>
              <div>
                <label className={etiquette} htmlFor="v-desc">Description</label>
                <textarea id="v-desc" rows={3} className={champ} value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Deux ou trois phrases sur la voiture et ses usages." />
              </div>
              <div>
                <label className={etiquette} htmlFor="v-features">Points forts</label>
                <textarea id="v-features" rows={4} className={champ} value={form.features}
                  onChange={(e) => set('features', e.target.value)}
                  placeholder={'Climatisation\n5 places\nGrand coffre'} />
                <p className={aide}>Un point fort par ligne.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-brand-line p-4">
              <p className="font-medium text-brand-ink">Dates déjà louées</p>
              <p className="text-sm text-brand-gray">
                Les clients ne peuvent pas réserver ces jours-là. La voiture redevient libre toute
                seule le lendemain de la fin.
              </p>
              {locations.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {locations.map((l, i) => (
                    <li key={i} className="flex items-end gap-2">
                      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                        <div className="min-w-0">
                          <label className="mb-1 block text-xs font-semibold text-brand-gray" htmlFor={`v-from-${i}`}>Du</label>
                          <input id={`v-from-${i}`} type="date" className={`${champ} px-3`} value={l.from}
                            onChange={(e) => setLocations((ls) => ls.map((x, j) => (j === i
                              ? { from: e.target.value, to: x.to && x.to < e.target.value ? e.target.value : x.to }
                              : x)))} />
                        </div>
                        <div className="min-w-0">
                          <label className="mb-1 block text-xs font-semibold text-brand-gray" htmlFor={`v-to-${i}`}>Au</label>
                          <input id={`v-to-${i}`} type="date" className={`${champ} px-3`} value={l.to} min={l.from || undefined}
                            onChange={(e) => setLocations((ls) => ls.map((x, j) => (j === i ? { ...x, to: e.target.value } : x)))} />
                        </div>
                      </div>
                      <button type="button" onClick={() => setLocations((ls) => ls.filter((_, j) => j !== i))}
                        aria-label="Retirer cette location"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-brand-line text-brand-gray transition hover:text-brand-red">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button"
                onClick={() => setLocations((ls) => [...ls, { from: todayIso(), to: todayIso() }])}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-red/40">
                <CalendarPlus className="h-4 w-4 text-brand-red" /> Ajouter une location
              </button>
            </div>

            <label className="mt-3 flex items-start gap-3 rounded-xl bg-brand-soft p-4">
              <input type="checkbox" className="mt-0.5 h-5 w-5 accent-brand-red" checked={form.available}
                onChange={(e) => set('available', e.target.checked)} />
              <span>
                <span className="font-medium text-brand-ink">En ligne</span>
                <span className="block text-sm text-brand-gray">
                  Décoche pour la masquer du site (garage, vente…) sans la supprimer. Pour une
                  location, indique plutôt les dates ci-dessus.
                </span>
              </span>
            </label>

            <label className="mt-3 flex items-start gap-3 rounded-xl bg-brand-soft p-4">
              <input type="checkbox" className="mt-0.5 h-5 w-5 accent-brand-red" checked={form.hero}
                onChange={(e) => set('hero', e.target.checked)} />
              <span>
                <span className="font-medium text-brand-ink">Mettre en avant sur l’accueil</span>
                <span className="block text-sm text-brand-gray">
                  Sa photo s’affiche en grand tout en haut de la page d’accueil. Une seule voiture
                  à la fois : cocher ici la retire de l’autre.
                </span>
              </span>
            </label>
          </section>

          {errors.length > 0 && (
            <ul className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-redDark">
              {errors.map((e) => <li key={e}>• {e}</li>)}
            </ul>
          )}
        </div>

        <footer className="sticky bottom-0 flex flex-col-reverse gap-3 rounded-b-3xl border-t border-brand-line bg-white p-5 sm:flex-row sm:justify-end">
          <button onClick={onClose}
            className="rounded-full border border-brand-line px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-soft">
            Annuler
          </button>
          <button onClick={save} disabled={saving || preparing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 font-semibold text-white shadow-red transition disabled:opacity-60">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
