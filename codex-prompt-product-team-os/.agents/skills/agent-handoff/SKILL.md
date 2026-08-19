---
name: agent-handoff
description: Produce a strict, low-noise handoff between AI roles or agents. Use whenever ownership changes, a subagent finishes, implementation completes, or review returns findings.
---

Return exactly these sections:

- `OUTCOME`: what was achieved or concluded.
- `SCOPE`: what was and was not handled.
- `FILES_CHANGED` or `FILES_REVIEWED`: paths and purpose.
- `ACCEPTANCE_EVIDENCE`: criterion → evidence.
- `TEST_EVIDENCE`: command/check → observed result.
- `DECISIONS`: approved decisions only, with owner/reference.
- `ASSUMPTIONS`: assumptions still in use.
- `RISKS`: severity, impact, mitigation.
- `UNRESOLVED`: blockers/questions with required owner.
- `NEXT_OWNER`: one DRI and requested action.

Do not paste raw logs unless needed for a finding. Do not say “done” when unresolved release blockers remain.
