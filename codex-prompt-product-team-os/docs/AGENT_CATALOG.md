# Agent catalog

| Agent | Default mode | Primary use | May write? | Typical caller |
|---|---|---|---|---|
| repo_explorer | Read-only | Trace current behavior and tests | No | Any role |
| product_analyst | Read-only | Clarify problem, scope, acceptance | No | Product HQ |
| solution_architect | Read-only | Options, invariants, contracts, migration | No | HQ / Architect |
| prompt_domain_reviewer | Read-only | Prompt schema, version, preview, eval | No | Prompt Product / HQ |
| ux_reviewer | Read-only | Journey, states, accessibility | No | UX / QA |
| implementation_worker | Workspace write | Bounded vertical slice | Yes, exclusive paths | Build lead |
| frontend_specialist | Workspace write | UI implementation | Yes, exclusive paths/worktree | Build lead |
| backend_data_specialist | Workspace write | API/data/migration | Yes, exclusive paths/worktree | Build lead |
| test_engineer | Workspace write | Test paths and fixtures | Yes, assigned paths | Build / QA |
| security_reviewer | Read-only | Security/privacy/abuse | No | Architect / QA |
| code_reviewer | Read-only | Correctness and regressions | No | Build / QA |
| data_growth_analyst | Read-only | Metrics and events | No | HQ / Data |
| release_auditor | Read-only | Go/no-go evidence | No | QA / HQ |

## Recommended model allocation

- Deep ambiguity, architecture, security, or integration: `gpt-5.6` with high or xhigh reasoning.
- Read-heavy exploration, QA scans, analytics, and release audit: `gpt-5.6-terra` with medium/high reasoning.
- Narrow repetitive tasks may be moved to a faster model after the workflow is stable and evaluated.
