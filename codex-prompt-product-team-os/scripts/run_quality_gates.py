from __future__ import annotations

import json
import subprocess
from pathlib import Path


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    config = json.loads((root / ".ai/project.json").read_text(encoding="utf-8"))
    commands = config.get("quality_commands", {})
    configured = [(name, cmd) for name, cmd in commands.items() if isinstance(cmd, str) and cmd.strip()]
    if not configured:
        print("No quality commands configured in .ai/project.json")
        raise SystemExit(2)

    failed = False
    for name, command in configured:
        print(f"\n=== {name}: {command} ===")
        proc = subprocess.run(command, cwd=root, shell=True)
        if proc.returncode != 0:
            failed = True
            print(f"FAILED: {name} ({proc.returncode})")
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
