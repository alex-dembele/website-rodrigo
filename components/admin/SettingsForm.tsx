'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

interface Settings {
  phone: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  city: string;
  driverPricePerDay: number;
  payment: {
    momo: { label: string; number: string; holder: string };
    orange: { label: string; number: string; holder: string };
    depositPercent: number;
  };
}

const champ =
  'w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15';
const etiquette = 'mb-1.5 block text-sm font-semibold text-brand-ink';
const aide = 'mt-1 text-xs text-brand-gray';

export default function SettingsForm({
  settings,
  onSaved
}: {
  settings: Settings;
  onSaved: (message: string) => void;
}) {
  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setPay(operateur: 'momo' | 'orange', key: 'number' | 'holder', value: string) {
    setForm((f) => ({
      ...f,
      payment: { ...f.payment, [operateur]: { ...f.payment[operateur], [key]: value } }
    }));
  }

  async function save() {
    setErrors([]);
    setSaving(true);
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setErrors(data.errors ?? [data.error ?? 'L’enregistrement a échoué. Réessaie.']);
      return;
    }
    onSaved('Informations enregistrées.');
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6">
        <h3 className="mb-1 font-display text-lg font-bold text-brand-ink">Contacts</h3>
        <p className="mb-4 text-sm text-brand-gray">
          Ces informations apparaissent en haut du site, dans le pied de page et sur la page contact.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={etiquette} htmlFor="s-phone">Téléphone (appels)</label>
            <input id="s-phone" className={champ} value={form.phone}
              onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className={etiquette} htmlFor="s-wa">WhatsApp (réservations)</label>
            <input id="s-wa" className={champ} value={form.whatsappDisplay}
              onChange={(e) => set('whatsappDisplay', e.target.value)} />
            <p className={aide}>C’est ce numéro qui reçoit les demandes de réservation.</p>
          </div>
          <div>
            <label className={etiquette} htmlFor="s-email">Email</label>
            <input id="s-email" type="email" className={champ} value={form.email}
              onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={etiquette} htmlFor="s-city">Ville</label>
            <input id="s-city" className={champ} value={form.city}
              onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={etiquette} htmlFor="s-address">Adresse de l’agence</label>
            <input id="s-address" className={champ} value={form.address}
              onChange={(e) => set('address', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6">
        <h3 className="mb-1 font-display text-lg font-bold text-brand-ink">Prix et acompte</h3>
        <p className="mb-4 text-sm text-brand-gray">
          Le prix de chaque voiture se modifie dans sa fiche, onglet « Voitures ».
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={etiquette} htmlFor="s-driver">Supplément chauffeur, par jour</label>
            <div className="relative">
              <input id="s-driver" inputMode="numeric" className={`${champ} pr-16`}
                value={String(form.driverPricePerDay)}
                onChange={(e) => set('driverPricePerDay', Number(e.target.value.replace(/\D/g, '')) || 0)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-gray">FCFA</span>
            </div>
          </div>
          <div>
            <label className={etiquette} htmlFor="s-deposit">Acompte demandé</label>
            <div className="relative">
              <input id="s-deposit" inputMode="numeric" className={`${champ} pr-10`}
                value={String(form.payment.depositPercent)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    payment: { ...f.payment, depositPercent: Number(e.target.value.replace(/\D/g, '')) || 0 }
                  }))
                } />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-gray">%</span>
            </div>
            <p className={aide}>Part du total à verser pour bloquer une voiture.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6">
        <h3 className="mb-1 font-display text-lg font-bold text-brand-ink">Comptes Mobile Money</h3>
        <p className="mb-4 text-sm text-brand-gray">
          Le nom du bénéficiaire doit être écrit exactement comme l’opérateur l’affiche au client
          avant qu’il valide son transfert.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {(['momo', 'orange'] as const).map((operateur) => (
            <div key={operateur} className="rounded-xl bg-brand-soft p-4">
              <p className="mb-3 font-bold text-brand-ink">{form.payment[operateur].label}</p>
              <label className={etiquette} htmlFor={`s-${operateur}-num`}>Numéro</label>
              <input id={`s-${operateur}-num`} className={champ} value={form.payment[operateur].number}
                onChange={(e) => setPay(operateur, 'number', e.target.value)} />
              <label className={`${etiquette} mt-3`} htmlFor={`s-${operateur}-holder`}>Bénéficiaire</label>
              <input id={`s-${operateur}-holder`} className={champ} value={form.payment[operateur].holder}
                onChange={(e) => setPay(operateur, 'holder', e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      {errors.length > 0 && (
        <ul className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-redDark">
          {errors.map((e) => <li key={e}>• {e}</li>)}
        </ul>
      )}

      <button onClick={save} disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 font-semibold text-white shadow-red transition disabled:opacity-60 sm:w-auto">
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
        {saving ? 'Enregistrement…' : 'Enregistrer les informations'}
      </button>
    </div>
  );
}
