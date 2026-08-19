---
name: security-review
description: Threat-model and review auth, payment, entitlement, prompt IP, PII, secrets, external tools, prompt execution, logging, analytics, and abuse controls. Use for high-risk changes and before release.
---

1. Identify assets, actors, trust boundaries, entry points, and attacker goals.
2. Review object-level authorization and server-side entitlement checks.
3. Review webhook signatures, idempotency, replay, fraud, audit, and reconciliation.
4. Check preview/full-content separation across API, client, cache, CDN, logs, analytics, support tools, and errors.
5. Check secrets, dependencies, external connectors, prompt injection, tool permissions, rate limits, scraping, and account sharing.
6. Check collection, consent, minimization, retention, deletion, and backup behavior for personal data.
7. Classify findings and give evidence plus required remediation.
8. Return approve, approve-with-conditions, or reject.
