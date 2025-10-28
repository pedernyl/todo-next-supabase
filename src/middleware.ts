import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function buildBaseCsp(): string {
  // Allow connections to Supabase project URL (https) and its realtime websocket endpoint (wss)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let connectExtras = '';
  try {
    if (supabaseUrl) {
      const u = new URL(supabaseUrl);
      // e.g., https://xyz.supabase.co
      const httpsOrigin = `${u.protocol}//${u.host}`;
      const wssOrigin = `wss://${u.host}`;
      connectExtras = ` ${httpsOrigin} ${wssOrigin}`;
    }
  } catch {
    // ignore malformed env
  }

  return (
    "default-src 'none'; " +
    "base-uri 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' https:; " +
    "img-src 'self' data:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    `connect-src 'self'${connectExtras}; ` +
    "object-src 'none'; " +
    "frame-ancestors 'none'; " +
    "form-action 'self'; " +
    'report-uri /api/csp-report;'
  );
}

function buildCsp(mode: string, nonce: string) {
  const CSP_BASE = buildBaseCsp();
  const nonceToken = ` 'nonce-${nonce}'`;
  const withNonce = CSP_BASE.replace("script-src 'self'", `script-src 'self'${nonceToken}`);
  if (mode === 'enforce') return withNonce.replace('report-uri /api/csp-report;', '');
  if (mode === 'report-only') return withNonce;
  if (mode === 'dev') return "default-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob:; connect-src 'self' ws: wss: http://localhost:3000; font-src 'self' data:";
  return '';
}

export function middleware(request: NextRequest) {
  // Mark request as intentionally unused to satisfy linting rules.
  void request;
  let mode = (process.env.NEXT_CSP_MODE || 'report-only').toLowerCase();
  // In development, default to permissive 'dev' mode unless explicitly enforcing
  if (process.env.NODE_ENV === 'development' && mode !== 'enforce') {
    mode = 'dev';
  }
  // generate a short random nonce (base64) using Web Crypto (Edge runtime)
  let nonce = '';
  try {
    const arr = globalThis.crypto.getRandomValues(new Uint8Array(12));
    let binary = '';
    for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
    // btoa should be available in Edge runtime
    nonce = typeof btoa === 'function' ? btoa(binary) : '';
  } catch {
    // fallback: empty nonce
    nonce = '';
  }

  const csp = buildCsp(mode, nonce);

  const res = NextResponse.next();
  if (csp) {
    if (mode === 'enforce') res.headers.set('Content-Security-Policy', csp);
    else if (mode === 'report-only') res.headers.set('Content-Security-Policy-Report-Only', csp);
    else if (mode === 'dev') res.headers.set('Content-Security-Policy', csp);
  }

  // Make the nonce available to server components via cookie
  // Cookie is not strictly necessary for client code, but server components
  // can read cookies() during SSR to inject nonce attributes into inline tags.
  res.cookies.set('csp-nonce', nonce);

  return res;
}

export const config = {
  // Skip all Next.js internal routes entirely to avoid impacting HMR/dev overlay
  matcher: '/((?!_next/|favicon.ico).*)',
};
