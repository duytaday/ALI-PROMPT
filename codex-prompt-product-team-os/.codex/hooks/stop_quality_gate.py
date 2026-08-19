import subprocess
from common import changed_files, continue_agent, emit, load_json, read_event, repo_root


def main() -> None:
    event = read_event()
    if event.get("stop_hook_active"):
        emit({"continue": True})
        return

    root = repo_root(event.get("cwd"))
    changed = changed_files(root)
    if not changed:
        emit({"continue": True})
        return

    project = load_json(root / ".ai/project.json", {})
    commands = project.get("quality_commands", {}) or {}
    configured = [(name, cmd) for name, cmd in commands.items() if isinstance(cmd, str) and cmd.strip()]
    if not configured:
        emit({
            "continue": True,
            "systemMessage": "Files changed, but no quality commands are configured in .ai/project.json. Completion evidence must explicitly state that automated gates were not configured."
        })
        return

    failures = []
    results = []
    for name, cmd in configured:
        proc = subprocess.run(cmd, cwd=root, shell=True, text=True, capture_output=True, timeout=900)
        tail = (proc.stdout + "\n" + proc.stderr)[-2500:]
        results.append(f"{name}: exit={proc.returncode}\n{tail}")
        if proc.returncode != 0:
            failures.append(name)

    if failures:
        continue_agent(
            "Quality gates failed: " + ", ".join(failures) + "\n" + "\n\n".join(results)
        )
        return

    emit({
        "continue": True,
        "systemMessage": "Configured quality gates passed before stop: " + ", ".join(name for name, _ in configured)
    })


if __name__ == "__main__":
    main()
