CSP workflow (report-only)

This project includes a conservative, report-only CSP you can enable while we iterate.

- Default mode: `report-only` (set via `NEXT_CSP_MODE`, default is `report-only`). The header is added in `next.config.ts`.
- CSP reports are POSTed to `/api/csp-report` and logged to the server console.

Basic commands

Build and start in report-only:

```bash
NEXT_CSP_MODE=report-only npm run build
NEXT_CSP_MODE=report-only npm run start
```

Dev mode (relaxed):

```bash
NEXT_CSP_MODE=dev npm run dev
```

Notes

- This is intentionally conservative. After collecting reports, we'll tighten policies (replace wildcards, add only needed external hosts, consider hashes/nonces).
- Don't flip to `enforce` until you've reviewed and remedied report-only violations.
