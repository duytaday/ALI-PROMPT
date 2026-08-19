---
name: task-intake
description: Convert a product idea, bug, request, or risk into a reviewable Task Contract before code starts. Use for outcome, scope, owner, paths, acceptance, dependencies, risk, analytics, and approvals. Do not use to implement code.
---

1. Read `AGENTS.md`, `.ai/project.json`, `.ai/active-task.json`, `docs/PRODUCT_VISION.md`, and relevant approved docs.
2. Classify the request: discovery, feature, defect, risk, operation, or decision.
3. Separate facts, assumptions, open questions, and decisions required.
4. Define target user, problem, current workaround, desired measurable outcome, scope, and non-scope.
5. Identify affected domains, DRI, approver, consulted roles, allowed write paths, dependencies, and rollout risk.
6. Write acceptance criteria as observable behavior, including negative and permission cases.
7. Add analytics, security/privacy, migration, support, and rollback requirements where applicable.
8. Compare against `docs/DEFINITION_OF_READY.md`.
9. Produce a Task Contract using `.ai/templates/TASK_CONTRACT.md`.
10. Do not assign Build until every blocking readiness item is resolved or explicitly approved as a risk.
