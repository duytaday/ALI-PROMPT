from pathlib import Path
from common import additional_context, load_json, read_event, repo_root


def main() -> None:
    event = read_event()
    root = repo_root(event.get("cwd"))
    project = load_json(root / ".ai/project.json", {})
    task = load_json(root / ".ai/active-task.json", {})
    state_path = root / ".ai/context/CURRENT_STATE.md"
    state = state_path.read_text(encoding="utf-8") if state_path.exists() else "Current-state file is missing."

    text = f"""
PROJECT CONTEXT
Project: {project.get('project_name', 'unknown')}
Phase: {project.get('phase', 'unknown')}
Enforcement: {project.get('enforcement_mode', 'warn')}
Active task: {task.get('task_id', 'UNSET')} — {task.get('title', '')}
Task status: {task.get('status', 'unknown')}
Task owner: {task.get('owner', 'unknown')}
Allowed write paths: {task.get('allowed_write_paths', [])}
Required approvals: {task.get('required_approvals', [])}

CURRENT STATE
{state[:9000]}

Before editing, verify Definition of Ready and ownership. Use one writer per path/worktree.
""".strip()
    additional_context("SessionStart", text)


if __name__ == "__main__":
    main()
