---
name: test-evidence
description: Create an acceptance-to-test matrix, run or inspect relevant checks, verify negative and permission paths, and return reproducible evidence. Use before handoff, merge, or release.
---

1. Map every acceptance criterion and invariant to evidence.
2. Select the smallest effective combination of unit, integration, E2E, migration, contract, and manual checks.
3. Include negative, boundary, authorization, idempotency, concurrency, and rollback paths where relevant.
4. Run configured commands and capture exact outcomes.
5. Distinguish passed, failed, skipped, unavailable, and not applicable.
6. Identify coverage gaps and residual risk.
7. Never claim a check ran without command evidence.
