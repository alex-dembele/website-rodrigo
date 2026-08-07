import { NextResponse } from 'next/server';
import { COOKIE, checkPassword, createSession, cookieOptions, adminConfigured } from '@/lib/admin/session';

/** Petit garde-fou contre les essais en rafale (par instance du serveur). */
const attempts = new Map<string, { count: number; until: number }>();

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "L'espace de gestion n'est pas encore activé sur ce site." },
      { status: 503 }
    );
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'inconnu';
  const state = attempts.get(ip);
  if (state && state.count >= 5 && Date.now() < state.until) {
    return NextResponse.json(
      { error: 'Trop d’essais. Patiente une minute avant de réessayer.' },
      { status: 429 }
    );
  }

  const { password } = await request.json().catch(() => ({ password: '' }));

  if (!checkPassword(String(password ?? ''))) {
    attempts.set(ip, { count: (state?.count ?? 0) + 1, until: Date.now() + 60_000 });
    await new Promise((r) => setTimeout(r, 700)); // ralentit les essais automatiques
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  attempts.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, createSession(), cookieOptions);
  return response;
}
