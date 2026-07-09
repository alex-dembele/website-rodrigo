'use client';

import { useMemo, useState } from 'react';
import { Check, MessageCircle, Mail, Info } from 'lucide-react';
import { availableVehicles } from '@/lib/vehicles';
import { site, fcfa, waLink } from '@/lib/site';
import {
  PICKUP_LOCATIONS,
  quote,
  buildBookingMessage,
  mailtoLink,
  type BookingInput
} from '@/lib/booking';

const today = new Date().toISOString().split('T')[0];

interface Props {
  initialVehicleId?: string;
  initialPickupDate?: string;
  initialReturnDate?: string;
  initialLocation?: string;
}

export default function ReservationForm({
  initialVehicleId,
  initialPickupDate,
  initialReturnDate,
  initialLocation
}: Props) {
  const [form, setForm] = useState<BookingInput>({
    vehicleId: initialVehicleId && availableVehicles.some((v) => v.id === initialVehicleId)
      ? initialVehicleId
      : availableVehicles[0]?.id ?? '',
    pickupLocation: initialLocation && PICKUP_LOCATIONS.includes(initialLocation)
      ? initialLocation
      : PICKUP_LOCATIONS[0],
    pickupDate: initialPickupDate ?? '',
    returnDate: initialReturnDate ?? '',
    withDriver: false,
    name: '',
    phone: '',
    notes: ''
  });
  const [payMethod, setPayMethod] = useState<'momo' | 'orange'>('momo');
  const [touched, setTouched] = useState(false);

  const q = useMemo(() => quote(form), [form]);

  const errors: string[] = [];
  if (!form.vehicleId) errors.push('Choisis une voiture.');
  if (!form.pickupDate) errors.push('Indique la date de prise en charge.');
  if (!form.returnDate) errors.push('Indique la date de retour.');
  if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate)
    errors.push('La date de retour doit être après la prise en charge.');
  if (!form.name.trim()) errors.push('Indique ton nom.');
  if (!form.phone.trim()) errors.push('Indique ton numéro de téléphone.');
  const valid = errors.length === 0;

  function update<K extends keyof BookingInput>(key: K, value: BookingInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submitWhatsApp() {
    setTouched(true);
    if (!valid) return;
    window.open(waLink(buildBookingMessage(form)), '_blank');
  }
  function submitEmail() {
    setTouched(true);
    if (!valid) return;
    window.location.href = mailtoLink(form);
  }

  const activePay = payMethod === 'momo' ? site.payment.momo : site.payment.orange;

  const inputCls =
    'w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15';
  const labelCls = 'mb-1.5 block text-sm font-semibold text-brand-ink';

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* Colonne formulaire */}
      <div className="space-y-6">
        {/* 1. Voiture */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red text-xs text-white">1</span>
            Choisis ta voiture
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {availableVehicles.map((v) => {
              const selected = form.vehicleId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => update('vehicleId', v.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? 'border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20'
                      : 'border-brand-line bg-white hover:border-brand-red/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-ink">{v.name}</span>
                    {selected && <Check className="h-4 w-4 text-brand-red" />}
                  </div>
                  <p className="mt-0.5 text-sm text-brand-gray">{v.type}</p>
                  <p className="mt-2 text-sm font-bold text-brand-red">{fcfa(v.pricePerDay)}/jour</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Dates & lieu */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red text-xs text-white">2</span>
            Dates et lieu
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pickupDate">Prise en charge</label>
              <input id="pickupDate" type="date" min={today} value={form.pickupDate}
                onChange={(e) => update('pickupDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="returnDate">Retour</label>
              <input id="returnDate" type="date" min={form.pickupDate || today} value={form.returnDate}
                onChange={(e) => update('returnDate', e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pickupLocation">Lieu de prise en charge</label>
              <select id="pickupLocation" value={form.pickupLocation}
                onChange={(e) => update('pickupLocation', e.target.value)} className={inputCls}>
                {PICKUP_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => update('withDriver', false)}
              className={`rounded-xl border p-4 text-left transition ${!form.withDriver ? 'border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20' : 'border-brand-line hover:border-brand-red/40'}`}>
              <span className="font-semibold text-brand-ink">Sans chauffeur</span>
              <p className="mt-0.5 text-sm text-brand-gray">Je conduis moi-même</p>
            </button>
            <button type="button" onClick={() => update('withDriver', true)}
              className={`rounded-xl border p-4 text-left transition ${form.withDriver ? 'border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20' : 'border-brand-line hover:border-brand-red/40'}`}>
              <span className="font-semibold text-brand-ink">Avec chauffeur</span>
              <p className="mt-0.5 text-sm text-brand-gray">+{fcfa(10000)}/jour</p>
            </button>
          </div>
        </section>

        {/* 3. Coordonnées */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red text-xs text-white">3</span>
            Tes coordonnées
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="name">Nom complet</label>
              <input id="name" type="text" value={form.name}
                onChange={(e) => update('name', e.target.value)} placeholder="Ex. Jean Mbarga" className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="phone">Téléphone / WhatsApp</label>
              <input id="phone" type="tel" value={form.phone}
                onChange={(e) => update('phone', e.target.value)} placeholder="Ex. 6XX XX XX XX" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="notes">Message (facultatif)</label>
              <textarea id="notes" rows={3} value={form.notes}
                onChange={(e) => update('notes', e.target.value)} placeholder="Précisions sur ton besoin…" className={inputCls} />
            </div>
          </div>
        </section>

        {/* 4. Paiement */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6 shadow-soft">
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red text-xs text-white">4</span>
            Paiement de l’acompte
          </h2>
          <p className="mb-4 text-sm text-brand-gray">
            Pour bloquer la voiture, envoie un acompte de{' '}
            <strong className="text-brand-ink">{site.payment.depositPercent}%</strong>
            {q.total > 0 && <> (soit <strong className="text-brand-ink">{fcfa(q.deposit)}</strong>)</>} par Mobile
            Money. Le reste se règle à la remise du véhicule.
          </p>

          <div className="mb-4 flex gap-2">
            <button type="button" onClick={() => setPayMethod('momo')}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${payMethod === 'momo' ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-brand-ink' : 'border-brand-line text-brand-gray'}`}>
              MTN MoMo
            </button>
            <button type="button" onClick={() => setPayMethod('orange')}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${payMethod === 'orange' ? 'border-[#FF6600] bg-[#FF6600]/10 text-brand-ink' : 'border-brand-line text-brand-gray'}`}>
              Orange Money
            </button>
          </div>

          <div className="rounded-xl bg-brand-soft p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-gray">{activePay.label} — numéro</span>
              <span className="font-bold tracking-wide text-brand-ink">{activePay.number}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-brand-gray">Code USSD</span>
              <span className="font-semibold text-brand-ink">{activePay.ussd}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-brand-gray">Nom du bénéficiaire</span>
              <span className="font-semibold text-brand-ink">Rodrigo Services</span>
            </div>
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs text-brand-gray">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
            Après le transfert, garde le SMS de confirmation. Envoie-nous ta réservation ci-dessous : nous
            confirmerons la disponibilité et l’acompte reçu par WhatsApp ou appel.
          </p>
        </section>

        {/* Erreurs */}
        {touched && !valid && (
          <ul className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-redDark">
            {errors.map((e) => <li key={e}>• {e}</li>)}
          </ul>
        )}

        {/* Actions (mobile) */}
        <div className="flex flex-col gap-3 lg:hidden">
          <SubmitButtons onWa={submitWhatsApp} onMail={submitEmail} />
        </div>
      </div>

      {/* Récapitulatif sticky */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-brand-ink">Récapitulatif</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Voiture" value={q.vehicle?.name ?? '—'} />
            <Row label="Durée" value={`${q.days} jour${q.days > 1 ? 's' : ''}`} />
            <Row label="Chauffeur" value={form.withDriver ? 'Oui' : 'Non'} />
            <div className="my-2 h-px bg-brand-line" />
            <Row label="Location" value={fcfa(q.base)} />
            {q.driver > 0 && <Row label="Chauffeur" value={fcfa(q.driver)} />}
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-brand-ink">Total estimé</span>
              <span className="font-display text-2xl font-extrabold text-brand-ink">{fcfa(q.total)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-brand-red/5 px-3 py-2">
              <span className="text-sm font-medium text-brand-redDark">Acompte {site.payment.depositPercent}%</span>
              <span className="font-bold text-brand-red">{fcfa(q.deposit)}</span>
            </div>
          </div>

          <div className="mt-5 hidden flex-col gap-3 lg:flex">
            <SubmitButtons onWa={submitWhatsApp} onMail={submitEmail} />
          </div>
          <p className="mt-3 text-center text-xs text-brand-gray">
            Aucun paiement n’est prélevé sur le site. Tu confirmes avec nous avant tout.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-brand-gray">{label}</span>
      <span className="font-medium text-brand-ink">{value}</span>
    </div>
  );
}

function SubmitButtons({ onWa, onMail }: { onWa: () => void; onMail: () => void }) {
  return (
    <>
      <button type="button" onClick={onWa}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5">
        <MessageCircle className="h-5 w-5" />
        Envoyer via WhatsApp
      </button>
      <button type="button" onClick={onMail}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-6 py-3.5 font-semibold text-brand-ink transition hover:border-brand-red/40">
        <Mail className="h-5 w-5" />
        Envoyer par email
      </button>
    </>
  );
}
