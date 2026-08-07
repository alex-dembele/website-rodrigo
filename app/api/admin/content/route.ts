import { NextResponse } from 'next/server';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isLoggedIn } from '@/lib/admin/session';
import { githubConfigured, listDir, readFile as readRepoFile } from '@/lib/admin/github';

export const dynamic = 'force-dynamic';

/**
 * Renvoie le contenu à afficher dans l'espace de gestion.
 *
 * On lit dans le dépôt GitHub plutôt que sur le disque : juste après un
 * enregistrement, le site en ligne tourne encore sur l'ancienne version, mais
 * le gérant doit voir ses modifications immédiatement.
 */
export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  try {
    if (githubConfigured()) {
      const names = (await listDir('content/vehicles')).filter((n) => n.endsWith('.json'));
      const vehicles = await Promise.all(
        names.map(async (name) => JSON.parse((await readRepoFile(`content/vehicles/${name}`)) ?? '{}'))
      );
      const settings = JSON.parse((await readRepoFile('content/settings.json')) ?? '{}');
      return NextResponse.json({ vehicles: sort(vehicles), settings, live: true });
    }

    // Pas de dépôt configuré (développement local) : lecture des fichiers.
    const dir = join(process.cwd(), 'content/vehicles');
    const names = (await readdir(dir)).filter((n) => n.endsWith('.json'));
    const vehicles = await Promise.all(
      names.map(async (name) => JSON.parse(await readFile(join(dir, name), 'utf8')))
    );
    const settings = JSON.parse(
      await readFile(join(process.cwd(), 'content/settings.json'), 'utf8')
    );
    return NextResponse.json({ vehicles: sort(vehicles), settings, live: false });
  } catch (e) {
    return NextResponse.json({ error: `Lecture impossible : ${e}` }, { status: 500 });
  }
}

function sort(vehicles: { order?: number; id: string }[]) {
  return vehicles.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id));
}
