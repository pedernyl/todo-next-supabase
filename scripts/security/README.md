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