---
name: database-change
description: Design and implement a safe database/schema change with invariant analysis, migration, compatibility window, backfill, indexes, concurrency, rollback, and verification. Use for any persistent data shape change.
---

1. Identify existing data, invariants, reads/writes, and blast radius.
2. Prefer expand-migrate-contract over breaking one-step migrations.
3. Define forward migration, backfill, dual-read/write if needed, verification query, and rollback.
4. Analyze nullability, defaults, uniqueness, foreign keys, indexes, locking, and concurrency.
5. Protect payment, entitlement, license, and prompt-version audit history.
6. Avoid storing unnecessary prompt content or sensitive user input.
7. Add migration and application tests.
8. Require architecture approval for irreversible or high-volume changes.
