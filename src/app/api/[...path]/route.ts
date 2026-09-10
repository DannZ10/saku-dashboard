import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { IDLE_SECONDS, SESSION_COOKIE } from '@/lib/session';

// Allow a free Render instance to wake up. Keep the upstream timeout below
// the Vercel Fluid Compute function limit; never auto-retry a mutation here.
export const maxDuration = 120;
const UPSTREAM_TIMEOUT_MS = 90_000;

const paths: Record<string, string> = { login: 'POST', register: 'POST', logout: 'POST', wallet: 'GET', transactions: 'GET', topup: 'POST', transfer: 'POST' };

type Jar = Awaited<ReturnType<typeof cookies>>;

// APP_ORIGIN holds one origin or a comma-separated list. With none configured we
// fall back to the origin this request arrived on, which is same-origin by
// definition and keeps the check meaningful without any setup.
function allowedOrigins(request: NextRequest) {
  const configured = (process.env.APP_ORIGIN ?? '').split(',').map(value => value.trim()).filter(Boolean);
  return configured.length ? configured : [request.nextUrl.origin];
}

// The cookie carries its own idle window: every proxied request renews it, so a
// session that sees no traffic for IDLE_SECONDS simply stops existing. The
// Sanctum token's own 8-hour expiry remains the absolute cap on top of this.
function keepAlive(jar: Jar, token: string) {
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: IDLE_SECONDS,
  });
}

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const path = (await context.params).path.join('/');
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  // Local keep-alive: renews the idle window on user activity without waking the API.
  if (path === 'session') {
    if (request.method !== 'GET') return NextResponse.json({ message: 'Endpoint tidak ditemukan.' }, { status: 404 });
    if (!token) return NextResponse.json({ message: 'Sesi telah berakhir.' }, { status: 401 });
    keepAlive(jar, token);
    return NextResponse.json({ authenticated: true, idle_seconds: IDLE_SECONDS }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const allowedMethod = /^transactions\/\d+$/.test(path) ? 'GET' : paths[path];
  if (!allowedMethod || allowedMethod !== request.method) return NextResponse.json({ message: 'Endpoint tidak ditemukan.' }, { status: 404 });
  // Exact origin matching protects every cookie-authenticated mutation, including
  // login. The app answers on both 127.0.0.1 and localhost, so the allowlist holds
  // every address it is actually served from rather than a single spelling of one.
  if (request.method === 'POST' && !allowedOrigins(request).includes(request.headers.get('origin') ?? '')) {
    return NextResponse.json({ message: 'Asal permintaan tidak diizinkan. Buka aplikasi melalui alamat yang terdaftar pada APP_ORIGIN.' }, { status: 403 });
  }
  const isAuth = path === 'login' || path === 'register';
  if (!isAuth && !token) return NextResponse.json({ message: 'Sesi telah berakhir. Silakan masuk lagi.' }, { status: 401 });
  try {
    const upstream = await fetch(`${process.env.API_URL ?? 'http://127.0.0.1:8000/api'}/${path}${request.nextUrl.search}`, {
      method: request.method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(token && !isAuth ? { Authorization: `Bearer ${token}` } : {}), ...(request.headers.get('idempotency-key') ? { 'Idempotency-Key': request.headers.get('idempotency-key')! } : {}) },
      ...(request.method === 'POST' ? { body: await request.text() } : {}),
      cache: 'no-store', signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const payload = await upstream.json();
    if (isAuth && upstream.ok) {
      keepAlive(jar, payload.token);
      delete payload.token; delete payload.token_type;
    }
    if ((path === 'logout' && upstream.ok) || (!isAuth && upstream.status === 401)) jar.delete(SESSION_COOKIE);
    else if (!isAuth && token) keepAlive(jar, token);
    return NextResponse.json(upstream.status >= 500 ? { message: 'Layanan sementara bermasalah. Coba kembali dengan transaksi yang sama.' } : payload, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.' }, { status: 503 });
  }
}
export const GET = handle;
export const POST = handle;
