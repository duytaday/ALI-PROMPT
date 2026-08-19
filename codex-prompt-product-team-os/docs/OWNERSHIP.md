# Ownership and decision rights

Ownership is not “who gives suggestions.” Ownership means who is accountable for the correctness and maintenance of an artifact or decision.

| Artifact / decision | DRI | Approver | Mandatory consultation | Veto / block condition |
|---|---|---|---|---|
| Vision, roadmap, scope, acceptance | Product HQ | Founder for material change | UX, Architect, Prompt Product, Data | Founder for business-model change |
| UX journey and interaction contract | Product UX | Product HQ | Prompt Product, Security, Build | Security for harmful disclosure |
| Domain model and ADRs | System Architect | Founder for irreversible/high-cost change | Security, Prompt Product, Build | Security for critical risk |
| Prompt taxonomy/schema/version/eval | Prompt Product Architect | Product HQ; Founder for license | Architect, Security, Data | Security for leakage/privacy; QA for no evidence |
| Application code integration | Implementation Lead | Architect for contract changes | UX, Prompt Product, QA | QA/Security for blockers |
| Database schema/migration | Backend/Data owner | System Architect | Security, QA, Release | Architect for unsafe migration |
| Auth, payment, entitlement | Backend owner | Architect + Security | Product HQ, QA | Security for unresolved P0/P1 |
| Test strategy and release evidence | QA | Product HQ accepts product outcome | Build, Security | QA for unmet acceptance/P0/P1 |
| Analytics taxonomy | Data/Growth | Product HQ | Security, Build | Security for sensitive logging |
| Production release | Release owner | Founder | Product HQ, QA, Security | Any unresolved release blocker |

## One-writer rule

At any moment, each path in a worktree has one write owner. Other agents may review or propose. Parallel writers require isolated worktrees and non-overlapping paths.

## Change-control rule

When implementation discovers a missing product, architecture, prompt-domain, security, or data decision, the implementation agent opens a decision request and returns ownership. It does not silently choose.
