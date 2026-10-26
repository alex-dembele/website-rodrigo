import { NextResponse } from 'next/server';
import { isLoggedIn } from '@/lib/admin/session';
import { commitFiles, readFile } from '@/lib/admin/github';
import { messageOperateur } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

/** Champs que le gérant peut modifier depuis l'espace de gestion. */
interface Modifiables {
  phone: string;
  phone2?: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  city: string;
  driverPricePerDay: number;
  payment: {
    momo: { number: string; holder: string };
    orange: { number: string; holder: string };
    depositPercent: number;
  };
}

function validate(s: Partial<Modifiables>): string[] {
  const errors: string[] = [];
  if (!s.phone?.trim()) errors.push('Le numéro de téléphone est vide.');
  if (s.phone2?.trim() && s.phone2.replace(/\D/g, '').length < 8) {
    errors.push('Le second numéro de téléphone est trop court pour être valable.');
  }
  if (!s.whatsappDisplay?.trim()) errors.push('Le numéro WhatsApp est vide.');
  else if (s.whatsappDisplay.replace(/\D/g, '').length < 8) {
    errors.push('Le numéro WhatsApp est trop court pour être valable.');
  }
  if (!s.email?.includes('@')) errors.push("L'adresse email n'est pas valable.");
  if (!s.address?.trim()) errors.push("L'adresse de l'agence est vide.");
  const acompte = s.payment?.depositPercent;
  if (typeof acompte !== 'number' || acompte < 0 || acompte > 100) {
    errors.push("L'acompte doit être un pourcentage entre 0 et 100.");
  }
  if (typeof s.driverPricePerDay !== 'number' || s.driverPricePerDay < 0) {
    errors.push('Le supplément chauffeur doit être un montant en FCFA.');
  }
  return errors;
}

export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as Partial<Modifiables> | null;
  if (!payload) return NextResponse.json({ error: 'Requête illisible.' }, { status: 400 });

  const errors = validate(payload);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

  try {
    const actuel = JSON.parse((await readFile('content/settings.json')) ?? '{}');

    // On ne réécrit que les champs modifiables : le reste du fichier
    // (URL du site, coordonnées GPS, textes de référencement) reste intact.
    const settings = {
      ...actuel,
      phone: payload.phone!.trim(),
      phone2: payload.phone2?.trim() ?? '',
      whatsappDisplay: payload.whatsappDisplay!.trim(),
      whatsapp: payload.whatsappDisplay!.replace(/\D/g, ''),
      email: payload.email!.trim(),
      address: payload.address!.trim(),
      city: payload.city?.trim() || actuel.city,
      driverPricePerDay: Number(payload.driverPricePerDay),
      payment: {
        ...actuel.payment,
        momo: {
          ...actuel.payment.momo,
          number: payload.payment!.momo.number.trim(),
          holder: payload.payment!.momo.holder.trim()
        },
        orange: {
          ...actuel.payment.orange,
          number: payload.payment!.orange.number.trim(),
          holder: payload.payment!.orange.holder.trim()
        },
        depositPercent: Number(payload.payment!.depositPercent)
      }
    };

    const commit = await commitFiles(
      [{ path: 'content/settings.json', content: `${JSON.stringify(settings, null, 2)}\n` }],
      'réglages: met à jour les informations de l’agence'
    );
    return NextResponse.json({ ok: true, commit });
  } catch (e) {
    return NextResponse.json({ error: messageOperateur(e) }, { status: 500 });
  }
}
