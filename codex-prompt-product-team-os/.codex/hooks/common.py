from __future__ import annotations

import fnmatch
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any


def read_event() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    return json.loads(raw)


def repo_root(cwd: str | None = None) -> Path:
    base = Path(cwd or os.getcwd()).resolve()
    try:
        out = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], cwd=base, text=True, stderr=subprocess.DEVNULL
        ).strip()
        return Path(out)
    except Exception:
        return base


def load_json(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def emit(payload: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(payload))


def additional_context(event_name: str, text: str, system_message: str | None = None) -> None:
    payload: dict[str, Any] = {
        "hookSpecificOutput": {
            "hookEventName": event_name,
            "additionalContext": text,
        }
    }
    if system_message:
        payload["systemMessage"] = system_message
    emit(payload)


def block_pre_tool(reason: str) -> None:
    emit({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    })


def block_prompt(reason: str) -> None:
    emit({"decision": "block", "reason": reason})


def continue_agent(reason: str) -> None:
    emit({"decision": "block", "reason": reason})


def match_any(path: str, patterns: list[str]) -> bool:
    normalized = path.replace("\\", "/").lstrip("./")
    for pattern in patterns:
        p = pattern.replace("\\", "/").lstrip("./")
        if fnmatch.fnmatch(normalized, p) or fnmatch.fnmatch(normalized + "/", p.rstrip("*") + "*"):
            return True
        if p.endswith("/**") and (normalized == p[:-3] or normalized.startswith(p[:-2])):
            return True
    return False


def changed_files(root: Path) -> list[str]:
    try:
        out = subprocess.check_output(
            ["git", "status", "--porcelain"], cwd=root, text=True, stderr=subprocess.DEVNULL
        )
    except Exception:
        return []
    result: list[str] = []
    for line in out.splitlines():
        if len(line) < 4:
            continue
        path = line[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        result.append(path.replace("\\", "/"))
    return result
