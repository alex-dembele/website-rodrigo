'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Loader2, LogOut, Pencil, Plus, Trash2, CheckCircle2, AlertTriangle, Clock, ExternalLink,
  ChevronUp, ChevronDown, CalendarDays
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import VehicleModal, { type FicheVehicule } from './VehicleModal';
import SettingsForm from './SettingsForm';
import { fcfa } from '@/lib/site';
import { currentRental, shortDay, todayIso, upcomingRentals } from '@/lib/rentals';


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
  // nouvel ordre en cours de préparation, pas encore enregistré
  const [rangement, setRangement] = useState<FicheVehicule[] | null>(null);
  // voiture dont la mise en ligne est en cours d'enregistrement
  const [bascule, setBascule] = useState<string | null>(null);

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

  async function changerDisponibilite(vehicle: FicheVehicule) {
    const available = !vehicle.available;
    setBascule(vehicle.id);
    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vehicle.id, available })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        apresEnregistrement(available ? `${vehicle.name} est de nouveau en ligne.` : `${vehicle.name} est masquée.`);
      } else {
        setMessage({ ton: 'erreur', texte: data.error ?? 'Le changement n’a pas été enregistré.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      setMessage({ ton: 'erreur', texte: 'Pas de connexion : rien n’a été modifié.' });
    } finally {
      setBascule(null);
    }
  }

  function deplacer(index: number, sens: -1 | 1) {
    const liste = [...(rangement ?? vehicles)];
    const cible = index + sens;
    if (cible < 0 || cible >= liste.length) return;
    [liste[index], liste[cible]] = [liste[cible], liste[index]];
    // revenu à l'ordre enregistré : plus rien à enregistrer
    setRangement(liste.every((v, i) => v.id === vehicles[i].id) ? null : liste);
  }

  async function enregistrerOrdre() {
    if (!rangement) return;
    setOccupe(true);
    try {
      const response = await fetch('/api/admin/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: rangement.map((v) => v.id) })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setRangement(null);
        apresEnregistrement('Nouvel ordre des voitures enregistré.');
      } else {
        setMessage({ ton: 'erreur', texte: data.error ?? 'L’ordre n’a pas été enregistré.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      setMessage({ ton: 'erreur', texte: 'Pas de connexion : l’ordre n’a pas été enregistré.' });
    } finally {
      setOccupe(false);
    }
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
                  Masque une voiture d’un geste, range-les avec les flèches, ou ajoutes-en une nouvelle.
                </p>
              </div>
              <button onClick={() => setEdition({ open: true, vehicle: null })}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-red transition hover:-translate-y-0.5">
                <Plus className="h-5 w-5" /> Ajouter une voiture
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(rangement ?? vehicles).map((v, index, liste) => {
                const aujourdhui = todayIso();
                const enCours = currentRental(v.rentals, aujourdhui);
                const prochaine = enCours ? undefined : upcomingRentals(v.rentals, aujourdhui)[0];
                return (
                <article key={v.id} className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
                  <div className="relative aspect-[4/3] bg-[#EDEDF0]">
                    {v.gallery[0] ? (
                      <Image src={v.gallery[0]} alt="" fill className="object-contain" sizes="300px" />
                    ) : (
                      <p className="grid h-full place-items-center text-sm text-brand-gray">Aucune photo</p>
                    )}
                    <span className="absolute left-2.5 top-2.5 grid h-7 min-w-7 place-items-center rounded-full bg-white/95 px-2 text-xs font-bold text-brand-ink shadow-soft"
                      title="Place sur le site">
                      {index + 1}
                    </span>
                    <div className="absolute right-2.5 top-2.5 flex gap-1.5">
                      <button onClick={() => deplacer(index, -1)} disabled={index === 0 || occupe}
                        aria-label={`Monter ${v.name}${v.variant ? ` ${v.variant}` : ''}`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-brand-ink shadow-soft transition hover:text-brand-red disabled:opacity-40">
                        <ChevronUp className="h-5 w-5" />
                      </button>
                      <button onClick={() => deplacer(index, 1)} disabled={index === liste.length - 1 || occupe}
                        aria-label={`Descendre ${v.name}${v.variant ? ` ${v.variant}` : ''}`}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-brand-ink shadow-soft transition hover:text-brand-red disabled:opacity-40">
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
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
                    {(enCours || prochaine) && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-ink">
                        <CalendarDays className="h-4 w-4 shrink-0 text-brand-red" />
                        {enCours
                          ? `Louée jusqu’au ${shortDay(enCours.to)}`
                          : `Louée du ${shortDay(prochaine!.from)} au ${shortDay(prochaine!.to)}`}
                      </p>
                    )}

                    <button role="switch" aria-checked={v.available}
                      onClick={() => changerDisponibilite(v)} disabled={bascule !== null || rangement !== null}
                      aria-label={`${v.name}${v.variant ? ` ${v.variant}` : ''} visible sur le site`}
                      className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-brand-soft px-4 py-3 text-left transition disabled:opacity-60">
                      <span>
                        <span className="block text-sm font-semibold text-brand-ink">
                          {v.available ? 'En ligne' : 'Masquée'}
                        </span>
                        <span className="block text-xs text-brand-gray">
                          {v.available ? 'Les clients peuvent la réserver.' : 'Invisible pour les clients.'}
                        </span>
                      </span>
                      {bascule === v.id ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand-red" />
                      ) : (
                        <span aria-hidden="true" className={`relative h-7 w-12 shrink-0 rounded-full transition ${v.available ? 'bg-green-600' : 'bg-brand-gray/40'}`}>
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${v.available ? 'left-6' : 'left-1'}`} />
                        </span>
                      )}
                    </button>

                    <div className="mt-3 flex gap-2">
                      <button onClick={() => setEdition({ open: true, vehicle: v })} disabled={rangement !== null}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-line px-4 py-2.5 text-sm font-semibold text-brand-ink transition hover:border-brand-red/40 disabled:opacity-60">
                        <Pencil className="h-4 w-4" /> Modifier
                      </button>
                      <button onClick={() => setSuppression(v)} aria-label={`Supprimer ${v.name}`} disabled={rangement !== null}
                        className="grid h-10 w-10 place-items-center rounded-full border border-brand-line text-brand-gray transition hover:border-brand-red/40 hover:text-brand-red disabled:opacity-60">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>

            {rangement && (
              <div className="sticky bottom-4 z-30 mt-6 flex flex-col gap-3 rounded-2xl border border-brand-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-brand-ink">
                  Nouvel ordre pas encore enregistré.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setRangement(null)} disabled={occupe}
                    className="flex-1 rounded-full border border-brand-line px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-brand-soft sm:flex-none">
                    Annuler
                  </button>
                  <button onClick={enregistrerOrdre} disabled={occupe}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-red transition disabled:opacity-60 sm:flex-none">
                    {occupe && <Loader2 className="h-4 w-4 animate-spin" />}
                    Enregistrer l’ordre
                  </button>
                </div>
              </div>
            )}
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
                  louée en ce moment, ferme cette fenêtre et indique plutôt ses dates de location dans sa fiche.
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
