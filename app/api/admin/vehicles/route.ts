import { NextResponse } from 'next/server';
import { isLoggedIn } from '@/lib/admin/session';
import { commitFiles, listDir, readFile, type FileChange } from '@/lib/admin/github';
import { validateVehicle, toVehicleFile, type VehiclePayload } from '@/lib/admin/vehicle-form';

export const dynamic = 'force-dynamic';

const MAX_PHOTO_OCTETS = 3_000_000; // après réduction par le navigateur

/** Enregistre une voiture (création ou modification) et ses nouvelles photos. */
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as VehiclePayload | null;
  if (!payload) return NextResponse.json({ error: 'Requête illisible.' }, { status: 400 });

  const errors = validateVehicle(payload);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

  const nouvelles = payload.newPhotos ?? [];
  for (const photo of nouvelles) {
    if (Buffer.byteLength(photo, 'base64') > MAX_PHOTO_OCTETS) {
      return NextResponse.json(
        { errors: ['Une photo est trop lourde. Reprends-la ou choisis-en une autre.'] },
        { status: 413 }
      );
    }
  }

  try {
    // Les nouvelles photos prennent la suite des numéros déjà utilisés.
    const existants = await listDir('public/cars');
    let n = existants.filter((f) => f.startsWith(`${payload.id}-`)).length;
    const changes: FileChange[] = [];
    const ajoutees: string[] = [];

    for (const base64 of nouvelles) {
      n += 1;
      const path = `public/cars/${payload.id}-${n}.jpg`;
      changes.push({ path, base64 });
      ajoutees.push(`/cars/${payload.id}-${n}.jpg`);
    }

    const gallery = [...payload.gallery, ...ajoutees];
    changes.push({
      path: `content/vehicles/${payload.id}.json`,
      content: `${JSON.stringify(toVehicleFile(payload, gallery), null, 2)}\n`
    });

    // Une seule voiture peut occuper le hero de l'accueil : celle qu'on vient
    // de désigner retire la mise en avant des autres, dans le même commit.
    if (payload.hero) {
      const fiches = (await listDir('content/vehicles')).filter(
        (f) => f.endsWith('.json') && f !== `${payload.id}.json`
      );
      for (const fiche of fiches) {
        const contenu = await readFile(`content/vehicles/${fiche}`);
        if (!contenu) continue;
        const autre = JSON.parse(contenu);
        if (!autre.hero) continue;
        delete autre.hero;
        changes.push({
          path: `content/vehicles/${fiche}`,
          content: `${JSON.stringify(autre, null, 2)}\n`
        });
      }
    }

    const commit = await commitFiles(
      changes,
      `flotte: met à jour ${payload.name}${payload.variant ? ` (${payload.variant})` : ''}`
    );
    return NextResponse.json({ ok: true, commit, gallery });
  } catch (e) {
    return NextResponse.json({ error: `${e}` }, { status: 500 });
  }
}

/** Retire une voiture du site, avec ses photos. */
export async function DELETE(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  const { id, name } = await request.json().catch(() => ({ id: '', name: '' }));
  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: 'Voiture inconnue.' }, { status: 400 });
  }

  try {
    const photos = (await listDir('public/cars')).filter((f) => f.startsWith(`${id}-`));
    const changes: FileChange[] = [
      { path: `content/vehicles/${id}.json`, remove: true },
      ...photos.map((f) => ({ path: `public/cars/${f}`, remove: true }))
    ];
    const commit = await commitFiles(changes, `flotte: retire ${name || id}`);
    return NextResponse.json({ ok: true, commit });
  } catch (e) {
    return NextResponse.json({ error: `${e}` }, { status: 500 });
  }
}
