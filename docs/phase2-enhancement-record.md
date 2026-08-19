# ALIPROMPT — Phase 2 Enhancement Record

Phase 2 is locked until the Phase 1 baseline tag and independent QA approval exist. One record is required for every enhancement; it must demonstrate that no Phase 1 capability disappeared.

| ID | Baseline problem | Users affected | Proposed change | Before / after behavior | Success metric / acceptance | A11y, performance, security guardrails | Rollback | Parity regression evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 | _To be written after baseline QA_ |  |  |  |  |  |  |  | Proposed |

## Non-negotiable Phase 2 checks

* Re-run the complete Phase 1 route, flow, state, and viewport suite before merge.
* Keep an immutable Phase 1 git tag and Preview URL as rollback targets.
* Do not remove, silently hide, or replace a baseline function merely to simplify the interface.
* Any newly introduced third-party script, tracker, upload route, payment step, or data field gets a privacy/security review before Preview.
