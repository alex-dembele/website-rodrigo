'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Loader2, LogOut, Pencil, Plus, Trash2, CheckCircle2, AlertTriangle, Clock, ExternalLink
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import VehicleModal, { type FicheVehicule } from './VehicleModal';
import SettingsForm from './SettingsForm';
import { fcfa } from '@/lib/site';


type Onglet = 'voitures' | 'infos';

export default function AdminApp({ configured }: { configured: boolean }) {
  const [state, setState] = useState<'chargement' | 'connexion' | 'pret'>('chargement');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [vehicles, setVehicles] = useState<FicheVehicule[]>([]);
  const [settings, setSettings] = useState<Parameters<typeof SettingsForm>[0]['settings'] | null>(null);
  const [onglet, setOnglet] = useState<Onglet>('voitures');
  const [edition, setEdition] = useState<{ open: boolean; vehicle: FicheVehicule | null }>({ open: false, vehicle: null });
  const [suppression, setSuppression] = useState<FicheVehicule | null>(null);
  // Un seul message à l'écran, réussite comme échec : le gérant doit toujours
  // savoir si son enregistrement est passé.
  const [message, setMessage] = useState<{ ton: 'succes' | 'erreur'; texte: string } | null>(null);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.status === 401) {
        setState('connexion');
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Lecture impossible.');
      setVehicles(data.vehicles ?? []);
      setSettings(data.settings ?? null);
      setState('pret');
    } catch (e) {
      setMessage({
        ton: 'erreur',
        texte: e instanceof Error && e.message ? e.message : 'Impossible de charger tes voitures.'
      });
      setState('pret');
    }
  }, []);

  useEffect(() => {
    if (configured) charger();
    else setState('connexion');
  }, [configured, charger]);

  async function connexion(e: React.FormEvent) {
    e.preventDefault();
    setErreur('');
    setOccupe(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErreur(data.error ?? 'Connexion impossible.');
        return;
      }
      setPassword('');
      setState('chargement');
      charger();
    } catch {
      setErreur('Pas de connexion. Vérifie ton réseau et réessaie.');
    } finally {
      setOccupe(false);
    }
  }

  async function deconnexion() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setState('connexion');
  }

  function apresEnregistrement(texte: string) {
    setEdition({ open: false, vehicle: null });
    setMessage({ ton: 'succes', texte });
    // le message est en haut de page : on y ramène le gérant, sinon il ne le
    // voit pas après avoir rempli un long formulaire sur téléphone
    window.scrollTo({ top: 0, behavior: 'smooth' });
    charger();
  }

  async function supprimer(vehicle: FicheVehicule) {
    setOccupe(true);
    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vehicle.id, name: vehicle.name })
      });
      const data = await response.json().catch(() => ({}));
      setSuppression(null);
      if (response.ok) {
        apresEnregistrement(`${vehicle.name} retirée du site.`);
      } else {
        setMessage({
          ton: 'erreur',
          texte: `${vehicle.name} n’a pas pu être supprimée. ${data.error ?? ''}`.trim()
        });
      }
    } catch {
      setSuppression(null);
      setMessage({ ton: 'erreur', texte: 'Pas de connexion : rien n’a été supprimé.' });
    } finally {
      setOccupe(false);
    }
  }

  if (state === 'chargement') {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-cream">
        <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (state === 'connexion') {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-cream p-5">
        <form onSubmit={connexion} className="w-full max-w-sm rounded-3xl border border-brand-line bg-white p-7 shadow-card">
          <LogoMark className="mx-auto h-14 w-14" />
          <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-brand-ink">
            Espace de gestion
          </h1>
          <p className="mt-2 text-center text-sm text-brand-gray">
            Pour modifier les voitures et les informations du site.
          </p>

          {!configured ? (
            <p className="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/5 p-4 text-sm text-brand-redDark">
              L’espace de gestion n’est pas encore activé sur ce site. Demande à ton développeur de
              définir le mot de passe.
            </p>
          ) : (
            <>
              <label className="mt-6 mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="mdp">
                Mot de passe
              </label>
              <input
                id="mdp"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-line px-4 py-3 text-brand-ink outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              />
              {erreur && <p className="mt-3 text-sm font-medium text-brand-red">{erreur}</p>}
              <button type="submit" disabled={occupe}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 font-semibold text-white shadow-red transition disabled:opacity-60">
                {occupe && <Loader2 className="h-5 w-5 animate-spin" />}
                Entrer
              </button>
            </>
          )}

          <Link href="/" className="mt-5 block text-center text-sm font-medium text-brand-gray hover:text-brand-red">
            ← Revenir au site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-40 border-b border-brand-line bg-white/95 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <div>
              <p className="font-display font-extrabold leading-tight text-brand-ink">Espace de gestion</p>
              <p className="text-xs text-brand-gray">Rodrigo Auto Services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-soft sm:inline-flex">
              Voir le site <ExternalLink className="h-4 w-4" />
            </a>
            <button onClick={deconnexion}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-brand-gray transition hover:bg-brand-soft hover:text-brand-red">
              <LogOut className="h-4 w-4" /> Quitter
            </button>
          </div>
        </div>
        <div className="container flex gap-1 pb-1">
          {([['voitures', 'Voitures'], ['infos', 'Mes informations']] as const).map(([cle, libelle]) => (
            <button key={cle} onClick={() => setOnglet(cle)}
              className={`rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${
                onglet === cle ? 'bg-brand-red/10 text-brand-red' : 'text-brand-gray hover:text-brand-ink'
              }`}>
              {libelle}
            </button>
          ))}
        </div>
      </header>

      <main className="container py-6 sm:py-8">
        {message && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 ${
              message.ton === 'succes'
                ? 'border-green-600/25 bg-green-50'
                : 'border-brand-red/30 bg-brand-red/5'
            }`}
          >
            {message.ton === 'succes' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
            )}
            <div className="min-w-0">
              <p className={`font-semibold ${message.ton === 'succes' ? 'text-green-900' : 'text-brand-redDark'}`}>
                {message.texte}
              </p>
              {message.ton === 'succes' ? (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-green-800">
                  <Clock className="h-4 w-4 shrink-0" />
                  C’est enregistré. Le site public se met à jour tout seul dans 1 à 2 minutes.
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-brand-redDark/80">
                  Rien n’a été modifié sur le site. Réessaie, et si ça persiste, préviens ton
                  développeur.
                </p>
              )}
            </div>
            <button
              onClick={() => setMessage(null)}
              className={`ml-auto shrink-0 text-sm font-semibold ${
                message.ton === 'succes' ? 'text-green-800' : 'text-brand-red'
              }`}
            >
              Fermer
            </button>
          </div>
        )}

        {onglet === 'voitures' && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-brand-ink">
                  {vehicles.length} voiture{vehicles.length > 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-brand-gray">
                  Modifie un prix, masque une voiture louée, ou ajoutes-en une nouvelle.
                </p>
              </div>
              <button onClick={() => setEdition({ open: true, vehicle: null })}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-red transition hover:-translate-y-0.5">
                <Plus className="h-5 w-5" /> Ajouter une voiture
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <article key={v.id} className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
                  <div className="relative aspect-[4/3] bg-[#EDEDF0]">
                    {v.gallery[0] ? (
                      <Image src={v.gallery[0]} alt="" fill className="object-contain" sizes="300px" />
                    ) : (
                      <p className="grid h-full place-items-center text-sm text-brand-gray">Aucune photo</p>
                    )}
                    <span className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-xs font-bold text-white ${
                      v.available ? 'bg-green-600' : 'bg-brand-ink'
                    }`}>
                      {v.available ? 'En ligne' : 'Masquée'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display font-bold text-brand-ink">{v.name}</h3>
                    {v.variant && <p className="text-sm font-semibold text-brand-red">{v.variant}</p>}
                    <p className="mt-1 text-sm text-brand-gray">
                      {v.type} · {v.transmission} · {v.seats} places
                    </p>
                    <p className="mt-2 font-display text-lg font-extrabold text-brand-ink">
                      {fcfa(v.pricePerDay)}<span className="text-sm font-medium text-brand-gray">/jour</span>
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setEdition({ open: true, vehicle: v })}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-line px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-red/40">
                        <Pencil className="h-4 w-4" /> Modifier
                      </button>
                      <button onClick={() => setSuppression(v)} aria-label={`Supprimer ${v.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-brand-line text-brand-gray transition hover:border-brand-red/40 hover:text-brand-red">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {onglet === 'infos' && settings && (
          <SettingsForm settings={settings} onSaved={apresEnregistrement} />
        )}
      </main>

      {edition.open && (
        <VehicleModal
          vehicle={edition.vehicle}
          existingIds={vehicles.map((v) => v.id)}
          onClose={() => setEdition({ open: false, vehicle: null })}
          onSaved={apresEnregistrement}
        />
      )}

      {suppression && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-brand-ink">
                  Supprimer {suppression.name} ?
                </h2>
                <p className="mt-1.5 text-sm text-brand-gray">
                  La voiture et ses photos disparaissent du site. Si c’est juste parce qu’elle est
                  louée en ce moment, ferme cette fenêtre et décoche « Disponible » dans sa fiche.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => setSuppression(null)}
                className="rounded-full border border-brand-line px-6 py-3 font-semibold text-brand-ink transition hover:bg-brand-soft">
                Annuler
              </button>
              <button onClick={() => supprimer(suppression)} disabled={occupe}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 font-semibold text-white transition disabled:opacity-60">
                {occupe && <Loader2 className="h-5 w-5 animate-spin" />}
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
