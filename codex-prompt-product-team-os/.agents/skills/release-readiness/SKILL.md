---
name: release-readiness
description: Audit whether a change is ready to merge or release based on acceptance, tests, review findings, security, migration, rollback, observability, documentation, analytics, and support readiness.
---

1. Verify the approved release scope and Task Contracts.
2. Confirm acceptance criterion evidence.
3. Confirm configured tests and explain skips.
4. Confirm unresolved defects and risk acceptance.
5. Confirm migration, backfill, rollback, feature flag, and compatibility plan.
6. Confirm security/privacy approval for high-risk surfaces.
7. Confirm observability, alerting, analytics, documentation, and support notes.
8. Return `GO`, `CONDITIONAL_GO`, or `NO_GO` with conditions, owners, and deadlines.
9. Production release still requires the human approver.
