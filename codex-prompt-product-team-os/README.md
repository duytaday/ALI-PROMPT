# Codex Prompt Product Team OS

A repository-ready operating system for building a product that sells prompts, prompt packs, workflows, assistant blueprints, and later agent templates.

This kit separates five layers that should not be mixed:

1. **Persistent role chats** — long-lived decision context for Product HQ, Architecture, UX, Prompt Product, Build, and QA.
2. **Codex custom agents** — narrow, task-bounded subagents for exploration, implementation, testing, review, security, and release checks.
3. **Skills** — repeatable workflows stored under `.agents/skills/`.
4. **Hooks** — deterministic lifecycle checks stored under `.codex/hooks/`.
5. **Ownership** — decision rights, write boundaries, approvals, and escalation rules.

## Start here

1. Copy the contents of this folder into the root of your repository.
2. Edit `.ai/project.json` and replace all `TBD` values.
3. Complete `docs/PRODUCT_VISION.md` and `docs/DOMAIN_MODEL.md`.
4. Review `AGENTS.md` and remove rules that do not fit your stack.
5. Open Codex and inspect/trust project hooks with `/hooks`.
6. Ask Codex: `Summarize the active AGENTS.md instructions, custom agents, skills, and hooks for this repository.`
7. Start the first task with: `$task-intake Turn this idea into a Task Contract: ...`

## Recommended operating pattern

- Keep product decisions in the **Product HQ** chat.
- Keep architecture decisions in the **System Architect** chat.
- Keep prompt-domain semantics and eval policy in the **Prompt Product** chat.
- Use a **Build** chat for one coherent implementation unit.
- Delegate bounded read-heavy work to subagents.
- Allow only one write owner per path in a worktree.
- Run QA independently before release.

## Windows note

The hook configuration includes `commandWindows` entries using `py -3`. If Python is installed as `python` rather than `py`, replace `py -3` with `python` in `.codex/hooks.json`.

## Enforcement modes

Set `.ai/project.json` → `enforcement_mode` to:

- `warn`: hooks add warnings but block only clearly destructive or secret-related actions.
- `strict`: hooks also block writes outside the active task's allowed paths.

Begin with `warn`, stabilize the workflow, then move to `strict`.
