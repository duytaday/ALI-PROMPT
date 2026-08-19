---
name: vertical-slice-implementation
description: Implement an approved feature or fix as the smallest coherent end-to-end slice with bounded paths, tests, documentation, evidence, and handoff. Use only after Definition of Ready passes.
---

1. Verify the active Task Contract and allowed write paths.
2. Ask a read-only explorer to trace current behavior.
3. Produce a file-level plan and acceptance-test map.
4. Assign exactly one writer per path/worktree.
5. Implement domain/server behavior before UI when authorization or entitlement is involved.
6. Add focused tests and update docs/telemetry required by the contract.
7. Run configured quality gates relevant to the change.
8. Request independent code/security review where applicable.
9. Return the standard handoff. Do not claim unrun checks.
