import type { NextConfig } from "next";

// Minimal CSP strings. We'll start in report-only mode so violations are reported
// without blocking behavior. Tweak these directives later as you inventory external hosts.
const CSP_REPORT_ONLY =
  "default-src 'none'; base-uri 'self'; script-src 'self'; style-src 'self' https:; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; report-uri /api/csp-report;";

const CSP_DEV =
  "default-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob:; connect-src 'self' ws: wss: http://localhost:3000; font-src 'self' data:";

const nextConfig: NextConfig = {
  async headers() {
    const mode = (process.env.NEXT_CSP_MODE || 'report-only').toLowerCase();
    // Only emit a header in report-only mode; middleware handles dev/enforce. 'off' returns nothing.
    if (mode !== 'report-only') return [];

    // Dynamically include Supabase origins in connect-src for accurate reporting.
    let value = CSP_REPORT_ONLY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      try {
        const u = new URL(supabaseUrl);
        const httpsOrigin = `${u.protocol}//${u.host}`; // e.g. https://xyz.supabase.co
        const wssOrigin = `wss://${u.host}`;
        value = value.replace(
          "connect-src 'self';",
          `connect-src 'self' ${httpsOrigin} ${wssOrigin};`
        );
      } catch {
        // ignore malformed URL
      }
    }

    return [{
      source: '/(.*)',
      headers: [{ key: 'Content-Security-Policy-Report-Only', value }],
    }];
  },
};

export default nextConfig;
