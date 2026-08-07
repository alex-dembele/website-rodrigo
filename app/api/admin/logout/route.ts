import { NextResponse } from 'next/server';
import { COOKIE, cookieOptions } from '@/lib/admin/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, '', { ...cookieOptions, maxAge: 0 });
  return response;
}
