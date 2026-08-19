# AI team operating model

## 1. Persistent chats versus subagents

Use persistent role chats when the value comes from durable decision context:

- Product HQ
- System Architect
- Product UX
- Prompt Product Architect
- Full-Stack Build for one coherent feature
- QA/Release Assurance

Use Codex subagents for bounded work that can return a concise result:

- codebase exploration
- product ambiguity analysis
- architecture option review
- prompt-domain review
- frontend/backend implementation in exclusive paths
- test construction
- code/security review
- analytics specification
- release audit

Do not create a new long-lived chat for every small ticket. Keep one chat per coherent decision or implementation unit, and delegate noisy bounded work to subagents.

## 2. Orchestration graph

Founder / human approver
→ Product HQ
→ Product UX + Prompt Product + System Architect
→ Product HQ readiness gate
→ Build / implementation lead
→ independent Code Review + Security + QA
→ Product HQ acceptance
→ Founder production-release approval

## 3. Parallelism policy

Safe to parallelize by default:
- repository exploration
- documentation verification
- test-gap analysis
- security review
- UX review
- analytics design

Parallelize write work only when:
- each agent has an isolated worktree,
- paths do not overlap,
- contracts are stable,
- one integration owner is named.

## 4. Entry/exit gates

### Discovery exit
Problem, user, outcome, evidence, scope, and major policy decisions are explicit.

### Design exit
UX contract, prompt-product contract, architecture/invariants, analytics, and security requirements are approved.

### Build entry
Definition of Ready passes and allowed paths are assigned.

### Build exit
Implementation, tests, docs, telemetry, migration, and handoff evidence are complete.

### Release exit
Independent QA and security status are clear; human release approval is recorded.
