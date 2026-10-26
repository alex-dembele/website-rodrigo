import { NextResponse } from 'next/server';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { COOKIE, cookieOptions, currentSession, isLoggedIn } from '@/lib/admin/session';
import { githubConfigured, listDir, readFile as readRepoFile } from '@/lib/admin/github';
import { messageOperateur } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

const DOSSIER = 'content/vehicles';

/** Lit les fiches dans le dépôt : c'est la version que le gérant vient d'enregistrer. */
async function depuisLeDepot() {
  const noms = (await listDir(DOSSIER)).filter((n) => n.endsWith('.json'));
  if (noms.length === 0) return null; // branche sans contenu : on retombe sur le disque
  const vehicles = await Promise.all(
    noms.map(async (nom) => JSON.parse((await readRepoFile(`${DOSSIER}/${nom}`)) ?? '{}'))
  );
  const settings = JSON.parse((await readRepoFile('content/settings.json')) ?? 'null');
  return settings ? { vehicles, settings } : null;
}

/** Lit les fiches livrées avec le site. */
async function depuisLeDisque() {
  const dir = join(process.cwd(), DOSSIER);
  const noms = (await readdir(dir)).filter((n) => n.endsWith('.json'));
  const vehicles = await Promise.all(
    noms.map(async (nom) => JSON.parse(await readFile(join(dir, nom), 'utf8')))
  );
  const settings = JSON.parse(await readFile(join(process.cwd(), 'content/settings.json'), 'utf8'));
  return { vehicles, settings };
}

/**
 * Renvoie le contenu à afficher dans l'espace de gestion.
 *
 * On lit d'abord dans le dépôt : juste après un enregistrement, le site en
 * ligne tourne encore sur l'ancienne version, mais le gérant doit voir ses
 * modifications tout de suite. Si la branche visée n'a pas encore de dossier
 * `content/`, on retombe sur les fiches livrées avec le site plutôt que
 * d'afficher une flotte vide.
 */
export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Session expirée.' }, { status: 401 });
  }

  try {
    const depot = githubConfigured() ? await depuisLeDepot() : null;
    const { vehicles, settings } = depot ?? (await depuisLeDisque());
    const response = NextResponse.json({
      vehicles: vehicles.sort(
        (a: { order?: number; id: string }, b: { order?: number; id: string }) =>
          (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id)
      ),
      settings,
      live: depot !== null
    });
    // chaque visite repousse la fin du cookie : le gérant n'a jamais à se reconnecter
    response.cookies.set(COOKIE, (await currentSession())!, cookieOptions);
    return response;
  } catch (e) {
    return NextResponse.json({ error: messageOperateur(e) }, { status: 500 });
  }
}
