from __future__ import annotations

import json
from pathlib import Path

REQUIRED = [
    "task_id", "title", "status", "owner", "approver",
    "allowed_write_paths", "required_approvals", "acceptance_criteria", "risk_level"
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / ".ai/active-task.json"
    task = json.loads(path.read_text(encoding="utf-8"))
    errors = []
    for key in REQUIRED:
        if key not in task:
            errors.append(f"missing field: {key}")
    if task.get("task_id") in (None, "", "UNSET"):
        errors.append("task_id is not set")
    if not task.get("acceptance_criteria"):
        errors.append("acceptance_criteria is empty")
    if not task.get("allowed_write_paths"):
        errors.append("allowed_write_paths is empty")
    if errors:
        print("Task is not ready:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("Active task has the required structural fields.")


if __name__ == "__main__":
    main()
