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
    const headers: { key: string; value: string }[] = [];

    if (mode === 'enforce') {
      headers.push({ key: 'Content-Security-Policy', value: CSP_REPORT_ONLY.replace('report-uri /api/csp-report;', '') });
    } else if (mode === 'report-only') {
      headers.push({ key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY });
    } else if (mode === 'dev') {
      headers.push({ key: 'Content-Security-Policy', value: CSP_DEV });
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
};

export default nextConfig;
