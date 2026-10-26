import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Authentification de l'espace de gestion.
 *
 * Il n'y a pas de base de données : un seul mot de passe, rangé dans la
 * variable d'environnement ADMIN_PASSWORD, ouvre l'accès. La session est un
 * cookie signé — impossible à fabriquer sans connaître le mot de passe.
 */

export const COOKIE = 'rodrigo_session';

// Le gérant reste connecté sur son téléphone : la session n'expire pas. Les
// navigateurs plafonnent la durée de vie d'un cookie (400 jours pour Chrome),
// on la renouvelle donc à chaque ouverture de l'espace de gestion.
const DUREE_COOKIE_JOURS = 400;

function password() {
  return process.env.ADMIN_PASSWORD ?? '';
}

/** L'espace de gestion n'existe que si un mot de passe a été défini. */
export function adminConfigured() {
  return password().length > 0;
}

/** La clé de signature dérive du mot de passe : le changer déconnecte tout le monde. */
function secret() {
  return createHash('sha256').update(`session:${password()}`).digest();
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

function equals(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: string) {
  return adminConfigured() && equals(candidate, password());
}

/** Session sans date de fin : seul un changement de mot de passe l'annule. */
export function createSession() {
  const ouverture = String(Date.now());
  return `${ouverture}.${sign(`gerant:${ouverture}`)}`;
}

export function validSession(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [ouverture, signature] = value.split('.');
  if (!ouverture || !signature) return false;
  return equals(signature, sign(`gerant:${ouverture}`));
}

/** À appeler au début de chaque route protégée. */
export async function isLoggedIn() {
  return validSession((await cookies()).get(COOKIE)?.value);
}

/** Valeur actuelle du cookie, pour le renouveler sans reconnexion. */
export async function currentSession() {
  return (await cookies()).get(COOKIE)?.value;
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: DUREE_COOKIE_JOURS * 24 * 3600
};
