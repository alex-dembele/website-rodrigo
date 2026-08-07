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
const DUREE_HEURES = 12;

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

export function createSession() {
  const expiration = Date.now() + DUREE_HEURES * 3600_000;
  return `${expiration}.${sign(String(expiration))}`;
}

export function validSession(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [expiration, signature] = value.split('.');
  if (!expiration || !signature) return false;
  if (Number(expiration) < Date.now()) return false;
  return equals(signature, sign(expiration));
}

/** À appeler au début de chaque route protégée. */
export async function isLoggedIn() {
  return validSession((await cookies()).get(COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: DUREE_HEURES * 3600
};
