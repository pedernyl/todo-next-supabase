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

  // Note: avoid broad 'https:' wildcards. Keep style-src limited to 'self' or
  // specific allowed stylesheet hosts (add explicit hosts if you need fonts.css
  // from Google). The project currently serves styles from the same origin
  // (/_next/static/*), so 'self' is sufficient.
  return (
    "default-src 'none'; " +
    "base-uri 'self'; " +
    "script-src 'self'; " +
    // Tighten style-src by removing the generic https: wildcard
    "style-src 'self'; " +
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

  // Make the nonce available to server components via cookie.
  // Set secure cookie attributes to satisfy security scanners (HttpOnly,
  // SameSite). The cookie is intended for server-side consumption (SSR) when
  // generating nonce attributes, so it should not be readable by client JS.
  const cookieOptions: {
    httpOnly: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path: string;
    secure?: boolean;
  } = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  };
  // Only mark secure in production where HTTPS is expected
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookies.set('csp-nonce', nonce, cookieOptions);

  // Add several common security headers flagged by scanners
  // Prevent MIME sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Restrict powerful browser features
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  // Improve site isolation for resource fetching
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  // Reasonable referrer policy
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Remove framework fingerprint header
  res.headers.delete('x-powered-by');

  return res;
}

export const config = {
  // Skip all Next.js internal routes entirely to avoid impacting HMR/dev overlay
  matcher: '/((?!_next/|favicon.ico).*)',
};
