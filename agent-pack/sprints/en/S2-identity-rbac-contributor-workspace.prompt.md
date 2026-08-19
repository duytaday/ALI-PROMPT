# [EN] S2 Prompt — Identity, RBAC, and Contributor Workspace

`prompt_version: 1.2.0`  
`run_only: S2`
`canonical_envelope: sprintId=S2; predecessorSprintId=S1; predecessorAcceptance=S1_ACCEPTED; applicableGates=[G2,G3,G5]; exitAcceptance=S2_ACCEPTED; evidenceRefs=required; reviewerAcceptance=independent-required`

```text
You are the ALIPROMPT S2 lead. Implement only identity/RBAC/member workspace outcomes, then stop.

ENTRY AND SAFETY
- Read instructions, verified predecessor S1 handoff/evidence, master/domain/Vercel contracts, gates and handoff schema. Require S1 overallStatus=passed and re-run critical foundation checks.
- Snapshot dirty/concurrent work and claim exact files. Preserve unrelated changes; no destructive Git/file operations.
- Use an approved adapter or safe local/test auth/email implementation. Never fake credentials, send live email, install a live provider, deploy Production or migrate Production without explicit approval.

SCOPE
Register/login/logout/forgot/reset; secure session lifecycle; deterministic server-side RBAC + resource ownership + audit; member public-profile consent/handle; authenticated contributor workspace to create/list/read/edit/discard/submit and track owned free-prompt drafts. Submission creates the contracted non-public state; media processing/moderation UI is S4. ALIPROMPT remains the only seller.

NON-GOALS
No public catalog redesign, Blob byte pipeline, moderation decision/publish UI, engagement/leaderboard/blog, checkout/payment/entitlement, guest submission enablement, social login or multi-vendor roles.

ORDERED WORK
1. Return an execution packet with S1 evidence, owned paths, auth/data trust boundaries, acceptance, migration risk and rollback.
2. Implement provider-neutral identity/session/recovery interfaces and local/test delivery. Normalize identifiers; hash passwords/tokens with approved policies; non-enumerating responses; rotate/revoke sessions.
3. Enforce CSRF for cookie-auth unsafe methods, secure cookie settings, rate limits and redirect allowlists. Keep authorization server-side.
4. Implement roles and ownership matrix for member, buyer, moderator and owner/admin. Contributor ID/handle never implies seller ID or privilege.
5. Implement member profile opt-in and the canonical five-state owned submission lifecycle: draft fields/limits, optimistic concurrency or equivalent stale-write protection, submit to pending_moderation, changes_requested -> draft, rejected/published terminal visibility and truthful history/UI. Internal processing events must not create extra visible states.
6. Audit privileged and denied actions with redaction. Add minimum schema/migrations through the S1-safe process and independent review.

BRANCHES AND EDGE CASES
- Existing identity system vs adapter; duplicate/confusable/reserved handle; email/account enumeration; login fixation; password reset expired/reused/concurrent; logout/session revocation; open redirect; CSRF.
- Anonymous/wrong-member draft access, IDOR, stale edit/submit, double submit, edit after state transition, deleted account, role change mid-session, contributor attempts price/publish/payment/refund/payout/admin.

TESTS AND EVIDENCE
- Run and record repo-native format/lint/type/unit/integration/build plus schema/migration checks.
- Contract/integration tests: register/login/logout/forgot/reset success and non-enumeration; hash/expiry/single-use; session rotation/revocation; cookie/CSRF/rate/redirect boundaries.
- Authorization matrix tests for every role/action, anonymous/wrong-owner IDOR, cross-draft access, stale/double submit and all contributor commerce/privileged denials with audit evidence.
- UI/E2E tests for loading/empty/validation/error/retry and keyboard/focus on auth and workspace. Secret scan and client-bundle/env inspection. Validate exact 19-key handoff.

EXIT GATE
Pass only when identity/recovery/session and owned draft journeys work with isolated data, negative authz/IDOR tests fail closed, member submit cannot publish or price, migrations/rollback are reviewed and independent QA accepts. Do not start S3.

OUTPUT CONTRACT
Return exact evidence and a schema-valid JSON with only: schemaVersion, handoffVersion, handoffId, createdAt, objective, scope, repository, repoEvidence, ownership, decisions, trustBoundaries, changes, tests, acceptance, security, risks, rollback, nextOwner, approvals. Encode S2 and gates within allowed fields; no sprintId, secret or raw PII.
```
