/**
 * Écriture du contenu du site dans le dépôt GitHub.
 *
 * C'est ce qui remplace la base de données : chaque enregistrement fait dans
 * l'espace de gestion devient un commit, et l'hébergeur reconstruit le site
 * tout seul. Avantage : tout est daté, attribué et réversible.
 *
 * Les fichiers sont écrits en UN SEUL commit via l'API « git data » — l'API
 * « contents », plus simple, ne sait écrire qu'un fichier à la fois, ce qui
 * déclencherait autant de reconstructions que de photos.
 */

const API = 'https://api.github.com';

export interface FileChange {
  path: string;
  /** Contenu texte ; ignoré si `base64` est fourni. */
  content?: string;
  /** Contenu binaire déjà encodé (photos). */
  base64?: string;
  /** true = supprimer le fichier. */
  remove?: boolean;
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  return { token, repo, branch };
}

export function githubConfigured() {
  const { token, repo } = config();
  return Boolean(token && repo);
}

async function api(path: string, init?: RequestInit) {
  const { token } = config();
  const response = await fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub ${response.status} sur ${path} : ${detail.slice(0, 300)}`);
  }
  return response.json();
}

/** Lit un fichier texte du dépôt. `null` si le fichier n'existe pas. */
export async function readFile(path: string): Promise<string | null> {
  const { repo, branch } = config();
  try {
    const data = await api(`/repos/${repo}/contents/${encodeURI(path)}?ref=${branch}`);
    return Buffer.from(data.content, 'base64').toString('utf8');
  } catch (e) {
    if (`${e}`.includes('404')) return null;
    throw e;
  }
}

/** Liste les fichiers d'un dossier du dépôt. */
export async function listDir(path: string): Promise<string[]> {
  const { repo, branch } = config();
  try {
    const data = await api(`/repos/${repo}/contents/${encodeURI(path)}?ref=${branch}`);
    return Array.isArray(data) ? data.map((f: { name: string }) => f.name) : [];
  } catch (e) {
    if (`${e}`.includes('404')) return [];
    throw e;
  }
}

/** Écrit plusieurs fichiers en un seul commit. Renvoie l'identifiant du commit. */
export async function commitFiles(changes: FileChange[], message: string): Promise<string> {
  const { repo, branch } = config();
  if (!githubConfigured()) {
    throw new Error(
      "L'enregistrement n'est pas configuré : il manque GITHUB_TOKEN ou GITHUB_REPO."
    );
  }
  if (changes.length === 0) throw new Error('Aucune modification à enregistrer.');

  // 1. où en est la branche
  const ref = await api(`/repos/${repo}/git/ref/heads/${branch}`);
  const baseCommit = ref.object.sha;
  const base = await api(`/repos/${repo}/git/commits/${baseCommit}`);

  // 2. un blob par fichier ajouté ou modifié
  const tree = await Promise.all(
    changes.map(async (change) => {
      if (change.remove) {
        return { path: change.path, mode: '100644', type: 'blob', sha: null };
      }
      const blob = await api(`/repos/${repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify(
          change.base64
            ? { content: change.base64, encoding: 'base64' }
            : { content: change.content ?? '', encoding: 'utf-8' }
        )
      });
      return { path: change.path, mode: '100644', type: 'blob', sha: blob.sha };
    })
  );

  // 3. arbre, commit, puis avance de la branche
  const newTree = await api(`/repos/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: base.tree.sha, tree })
  });
  const commit = await api(`/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommit] })
  });
  await api(`/repos/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha })
  });

  return commit.sha;
}
