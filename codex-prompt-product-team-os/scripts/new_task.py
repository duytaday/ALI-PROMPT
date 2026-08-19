from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("task_id", help="Example: TASK-001")
    parser.add_argument("title")
    parser.add_argument("--owner", default="product_hq")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    safe = re.sub(r"[^A-Za-z0-9_-]+", "-", args.title).strip("-").lower()
    task_dir = root / ".ai/tasks"
    task_dir.mkdir(parents=True, exist_ok=True)
    template = (root / ".ai/templates/TASK_CONTRACT.md").read_text(encoding="utf-8")
    path = task_dir / f"{args.task_id}-{safe}.md"
    path.write_text(template.replace("TASK-[ID]", args.task_id).replace("[Title]", args.title), encoding="utf-8")

    active = {
        "task_id": args.task_id,
        "title": args.title,
        "status": "draft",
        "owner": args.owner,
        "approver": "Founder",
        "allowed_write_paths": [],
        "required_approvals": [],
        "acceptance_criteria": [],
        "quality_gate_profile": "standard",
        "risk_level": "unknown",
        "contract_path": str(path.relative_to(root)).replace("\\", "/"),
    }
    (root / ".ai/active-task.json").write_text(json.dumps(active, indent=2) + "\n", encoding="utf-8")
    print(path)


if __name__ == "__main__":
    main()
