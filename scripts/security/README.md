# Quick Security Scan

This folder contains a script to run a basic OWASP ZAP security scan.

---

## Quick Start

1. Make sure your app is running:
```bash
npm run build && npm run start - dont forget csp settings

    Run the scan:

./security/security-scan.sh http://localhost:3000

    Open the report:

    HTML report: security/zap-report.html

    The scan checks for common web security issues like XSS and missing headers.
    No sensitive keys are included, and Docker is required.

ZAP Redirect Warning

Next.js App Router may trigger a ZAP warning about a redirect with body because server components and layouts start generating HTML before the page redirect executes. Even though the redirect happens early, no sensitive data is exposed, and the HTML body ZAP sees is internal Next.js content. This is a false positive, and the redirect is safe. Optionally, moving the redirect to a layout that wraps protected pages can remove the warning entirely.    