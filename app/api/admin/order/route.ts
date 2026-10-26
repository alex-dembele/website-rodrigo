import { NextResponse } from 'next/server';
import { isLoggedIn } from '@/lib/admin/session';
import { commitFiles, listDir, readFile, type FileChange } from '@/lib/admin/github';
import { messageOperateur } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

/**
 * Range les voitures dans l'ordre choisi par le gérant : la première de la
 * liste s'affiche en premier sur le site. Un seul commit pour tout l'ordre.
 */
export async function POST(request: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  const { ids } = await request.json().catch(() => ({ ids: null }));
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id))) {
    return NextResponse.json({ error: 'Ordre illisible.' }, { status: 400 });
  }

  try {
    const fiches = (await listDir('content/vehicles')).filter((f) => f.endsWith('.json'));
    const connues = fiches.map((f) => f.replace(/\.json$/, '')).sort();
    if (ids.length !== connues.length || [...ids].sort().join() !== connues.join()) {
      // une voiture a été ajoutée ou retirée entre-temps
      return NextResponse.json(
        { error: 'La liste des voitures a changé. Recharge la page et recommence.' },
        { status: 409 }
      );
    }

    const changes: FileChange[] = [];
    for (const [index, id] of ids.entries()) {
      const path = `content/vehicles/${id}.json`;
      const fiche = JSON.parse((await readFile(path)) ?? '{}');
      if (fiche.order === index + 1) continue;
      fiche.order = index + 1;
      changes.push({ path, content: `${JSON.stringify(fiche, null, 2)}\n` });
    }
    if (changes.length === 0) return NextResponse.json({ ok: true, commit: null });

    const commit = await commitFiles(changes, 'flotte: change l’ordre des voitures');
    return NextResponse.json({ ok: true, commit });
  } catch (e) {
    return NextResponse.json({ error: messageOperateur(e) }, { status: 500 });
  }
}
