'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, MessageCircle, Mail, Smartphone, CarFront, ChevronDown } from 'lucide-react';
import { availableVehicles, vehicleLabel } from '@/lib/vehicles';
import { site, fcfa, waLink } from '@/lib/site';
import {
  PICKUP_LOCATIONS,
  quote,
  buildBookingMessage,
  mailtoLink,
  type BookingInput
} from '@/lib/booking';

/** yyyy-mm-dd, en heure locale (pas en UTC) */
function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const today = isoDate();

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
  // Les dates sont pré-remplies (aujourd'hui → demain) : le client voit
  // immédiatement un prix et n'a plus qu'à ajuster ce qui le concerne.
  const [form, setForm] = useState<BookingInput>({
    vehicleId:
      initialVehicleId && availableVehicles.some((v) => v.id === initialVehicleId)
        ? initialVehicleId
        : availableVehicles[0]?.id ?? '',
    pickupLocation:
      initialLocation && PICKUP_LOCATIONS.includes(initialLocation)
        ? initialLocation
        : PICKUP_LOCATIONS[0],
    pickupDate: initialPickupDate || isoDate(),
    returnDate: initialReturnDate || isoDate(1),
    withDriver: false,
    name: '',
    phone: '',
    notes: ''
  });
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const q = useMemo(() => quote(form), [form]);

  const fieldErrors = {
    name: form.name.trim() ? '' : 'Indique ton nom.',
    phone: form.phone.replace(/\D/g, '').length < 8 ? 'Indique un numéro joignable.' : '',
    pickupDate: form.pickupDate ? '' : 'Choisis la date de prise en charge.',
    returnDate: !form.returnDate
      ? 'Choisis la date de retour.'
      : form.returnDate < form.pickupDate
        ? 'Le retour doit être après la prise en charge.'
        : ''
  };
  const valid = Object.values(fieldErrors).every((e) => !e);

  function update<K extends keyof BookingInput>(key: K, value: BookingInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // le retour suit toujours la prise en charge
      if (key === 'pickupDate' && next.returnDate < next.pickupDate) {
        next.returnDate = next.pickupDate;
      }
      return next;
    });
  }

  function submitWhatsApp() {
    setTouched(true);
    if (!valid) {
      document.getElementById('coordonnees')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.open(waLink(buildBookingMessage(form)), '_blank');
    setSent(true);
  }

  function submitEmail() {
    setTouched(true);
    if (!valid) {
      document.getElementById('coordonnees')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    window.location.href = mailtoLink(form);
    setSent(true);
  }

  const inputCls =
    'w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15';
  const labelCls = 'mb-1.5 block text-sm font-semibold text-brand-ink';

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-[1fr_380px] lg:items-start lg:pb-0">
      <div className="space-y-5">
        {/* 1. Voiture */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-soft sm:p-6">
          <StepTitle n={1}>Choisis ta voiture</StepTitle>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {availableVehicles.map((v) => {
              const selected = form.vehicleId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update('vehicleId', v.id)}
                  className={`overflow-hidden rounded-xl border text-left transition ${
                    selected
                      ? 'border-brand-red ring-2 ring-brand-red/20'
                      : 'border-brand-line hover:border-brand-red/40'
                  }`}
                >
                  <span className="relative block aspect-[4/3] w-full bg-[#EDEDF0]">
                    {v.gallery[0] ? (
                      <Image
                        src={v.gallery[0]}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-contain"
                      />
                    ) : (
                      <CarFront className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-brand-gray/40" />
                    )}
                    {selected && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-red text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </span>
                  <span className="block p-3">
                    <span className="block text-sm font-semibold text-brand-ink sm:text-base">{v.name}</span>
                    <span className="block text-xs text-brand-gray sm:text-sm">{v.variant ?? v.type}</span>
                    <span className="mt-1 block text-sm font-bold text-brand-red">
                      {fcfa(v.pricePerDay)}<span className="font-medium text-brand-gray">/jour</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Dates & lieu */}
        <section className="rounded-2xl border border-brand-line bg-white p-5 shadow-soft sm:p-6">
          <StepTitle n={2}>Quand et où ?</StepTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pickupDate">Prise en charge</label>
              <input
                id="pickupDate"
                type="date"
                min={today}
                value={form.pickupDate}
                onChange={(e) => update('pickupDate', e.target.value)}
                className={inputCls}
              />
              <FieldError show={touched} message={fieldErrors.pickupDate} />
            </div>
            <div>
              <label className={labelCls} htmlFor="returnDate">Retour</label>
              <input
                id="returnDate"
                type="date"
                min={form.pickupDate || today}
                value={form.returnDate}
                onChange={(e) => update('returnDate', e.target.value)}
                className={inputCls}
              />
              <FieldError show={touched} message={fieldErrors.returnDate} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pickupLocation">Lieu de prise en charge</label>
              <select
                id="pickupLocation"
                value={form.pickupLocation}
                onChange={(e) => update('pickupLocation', e.target.value)}
                className={inputCls}
              >
                {PICKUP_LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Choice
              selected={!form.withDriver}
              onClick={() => update('withDriver', false)}
              title="Sans chauffeur"
              subtitle="Je conduis moi-même"
            />
            <Choice
              selected={form.withDriver}
              onClick={() => update('withDriver', true)}
              title="Avec chauffeur"
              subtitle={`+${fcfa(10000)}/jour`}
            />
          </div>
        </section>

        {/* 3. Coordonnées */}
        <section id="coordonnees" className="scroll-mt-24 rounded-2xl border border-brand-line bg-white p-5 shadow-soft sm:p-6">
          <StepTitle n={3}>Comment te joindre ?</StepTitle>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="name">Nom complet</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex. Jean Mbarga"
                className={inputCls}
              />
              <FieldError show={touched} message={fieldErrors.name} />
            </div>
            <div>
              <label className={labelCls} htmlFor="phone">Téléphone / WhatsApp</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="Ex. 6XX XX XX XX"
                className={inputCls}
              />
              <FieldError show={touched} message={fieldErrors.phone} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="notes">Un mot pour nous (facultatif)</label>
              <textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Heure de retrait, vol à récupérer, trajet prévu…"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {sent && <SentPanel deposit={q.deposit} />}

        <PaymentDetails deposit={q.total > 0 ? q.deposit : 0} open={sent} />
      </div>

      {/* Récapitulatif : colonne collante sur ordinateur */}
      <aside className="hidden lg:sticky lg:top-24 lg:block">
        <Summary
          days={q.days}
          vehicleName={q.vehicle ? vehicleLabel(q.vehicle) : '—'}
          withDriver={form.withDriver}
          base={q.base}
          driver={q.driver}
          total={q.total}
          deposit={q.deposit}
          onWa={submitWhatsApp}
          onMail={submitEmail}
        />
      </aside>

      {/* Barre d'action collante sur mobile : total + envoi en un geste */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-brand-gray">
              {q.days} jour{q.days > 1 ? 's' : ''} · acompte{' '}
              <span data-testid="deposit">{fcfa(q.deposit)}</span>
            </p>
            <p data-testid="total" className="font-display text-lg font-extrabold leading-tight text-brand-ink">
              {fcfa(q.total)}
            </p>
          </div>
          <button
            type="button"
            data-testid="submit-whatsapp"
            onClick={submitWhatsApp}
            className="ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 font-semibold text-white shadow-red"
          >
            <MessageCircle className="h-5 w-5" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red text-xs text-white">{n}</span>
      {children}
    </h2>
  );
}

function Choice({
  selected,
  onClick,
  title,
  subtitle
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20'
          : 'border-brand-line hover:border-brand-red/40'
      }`}
    >
      <span className="font-semibold text-brand-ink">{title}</span>
      <span className="mt-0.5 block text-sm text-brand-gray">{subtitle}</span>
    </button>
  );
}

function FieldError({ show, message }: { show: boolean; message: string }) {
  if (!show || !message) return null;
  return <p className="mt-1.5 text-sm font-medium text-brand-redDark">{message}</p>;
}

function Summary({
  days,
  vehicleName,
  withDriver,
  base,
  driver,
  total,
  deposit,
  onWa,
  onMail
}: {
  days: number;
  vehicleName: string;
  withDriver: boolean;
  base: number;
  driver: number;
  total: number;
  deposit: number;
  onWa: () => void;
  onMail: () => void;
}) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-brand-ink">Ta réservation</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <Row label="Voiture" value={vehicleName} />
        <Row label="Durée" value={`${days} jour${days > 1 ? 's' : ''}`} />
        <Row label="Chauffeur" value={withDriver ? 'Oui' : 'Non'} />
        <div className="my-2 h-px bg-brand-line" />
        <Row label="Location" value={fcfa(base)} />
        {driver > 0 && <Row label="Chauffeur" value={fcfa(driver)} />}
      </dl>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-brand-ink">Total estimé</span>
        <span data-testid="total" className="font-display text-2xl font-extrabold text-brand-ink">
          {fcfa(total)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-red/5 px-3 py-2">
        <span className="text-sm font-medium text-brand-redDark">
          Acompte {site.payment.depositPercent}%
        </span>
        <span data-testid="deposit" className="font-bold text-brand-red">{fcfa(deposit)}</span>
      </div>

      <button
        type="button"
        data-testid="submit-whatsapp"
        onClick={onWa}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 font-semibold text-white shadow-red transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle className="h-5 w-5" />
        Envoyer sur WhatsApp
      </button>
      <button
        type="button"
        onClick={onMail}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-brand-gray transition hover:text-brand-red"
      >
        <Mail className="h-4 w-4" />
        Plutôt par email
      </button>
      <p className="mt-3 text-center text-xs text-brand-gray">
        Aucun paiement n’est prélevé sur le site. On te confirme la disponibilité avant tout.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-brand-gray">{label}</dt>
      <dd className="text-right font-medium text-brand-ink">{value}</dd>
    </div>
  );
}

function SentPanel({ deposit }: { deposit: number }) {
  return (
    <div className="rounded-2xl border border-green-600/30 bg-green-50 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-ink">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-green-600 text-white">
          <Check className="h-4 w-4" />
        </span>
        Demande envoyée
      </h2>
      <p className="mt-2 text-sm text-brand-ink/80">
        On vérifie la disponibilité et on te répond sur WhatsApp. Pour bloquer la voiture tout de
        suite, envoie l’acompte de {fcfa(deposit)} avec les infos ci-dessous, puis transmets-nous le
        SMS de confirmation.
      </p>
    </div>
  );
}

/** Infos de paiement : repliées par défaut pour ne pas alourdir le formulaire. */
function PaymentDetails({ deposit, open }: { deposit: number; open: boolean }) {
  const methods = [site.payment.momo, site.payment.orange];
  return (
    <details
      open={open}
      className="group rounded-2xl border border-brand-line bg-white p-5 shadow-soft sm:p-6"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 font-display font-bold text-brand-ink">
        <Smartphone className="h-5 w-5 shrink-0 text-brand-red" />
        <span className="text-base sm:text-lg">
          Payer l’acompte {deposit > 0 && <span className="text-brand-red">({fcfa(deposit)})</span>}
        </span>
        <ChevronDown className="ml-auto h-5 w-5 shrink-0 text-brand-gray transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm text-brand-gray">
        L’acompte de {site.payment.depositPercent}% bloque la voiture ; le reste se règle à la remise
        du véhicule. Vérifie le nom du bénéficiaire avant de valider le transfert.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {methods.map((m) => (
          <div key={m.label} className="rounded-xl bg-brand-soft p-4">
            <p className="font-semibold text-brand-ink">{m.label}</p>
            <p className="mt-1 font-semibold tracking-wide text-brand-ink">
              {m.number || 'Numéro communiqué à la confirmation'}
            </p>
            <p className="text-sm text-brand-gray">Bénéficiaire : {m.holder}</p>
            <p className="text-sm text-brand-gray">Code {m.ussd}</p>
          </div>
        ))}
      </div>
    </details>
  );
}
