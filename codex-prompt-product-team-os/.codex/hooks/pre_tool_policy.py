import re
from common import additional_context, block_pre_tool, load_json, match_any, read_event, repo_root

DANGEROUS_COMMANDS = [
    re.compile(r"(^|\s)rm\s+-rf\s+/(?:\s|$)"),
    re.compile(r"\bgit\s+reset\s+--hard\b"),
    re.compile(r"\bgit\s+clean\s+-[a-zA-Z]*f[a-zA-Z]*d[a-zA-Z]*x?\b"),
    re.compile(r"\bgit\s+push\b.*--force(?:-with-lease)?\b"),
    re.compile(r"\b(?:drop\s+database|truncate\s+table)\b", re.I),
]

PATCH_PATH = re.compile(r"\*\*\* (?:Update|Add|Delete) File:\s+(.+)")
SENSITIVE_TEXT = re.compile(r"(?i)(?:^|/)(?:\.env(?:\..*)?|secrets?|credentials?)(?:/|$)")


def main() -> None:
    event = read_event()
    root = repo_root(event.get("cwd"))
    project = load_json(root / ".ai/project.json", {})
    task = load_json(root / ".ai/active-task.json", {})
    mode = project.get("enforcement_mode", "warn")
    tool_name = event.get("tool_name", "")
    tool_input = event.get("tool_input", {}) or {}
    command = tool_input.get("command", "") if isinstance(tool_input, dict) else ""

    if tool_name == "Bash":
        for pattern in DANGEROUS_COMMANDS:
            if pattern.search(command):
                block_pre_tool("Destructive or irreversible command blocked by repository policy. Use a reviewed, reversible alternative.")
                return
        if re.search(r"(?i)(?:cat|type|print|get-content).*(?:\.env|secret|credential|private[_-]?key)", command):
            block_pre_tool("Command appears to read credential material. Use a safe secret-presence check without printing values.")
            return

    if tool_name == "apply_patch":
        paths = [m.group(1).strip().replace("\\", "/") for m in PATCH_PATH.finditer(command)]
        if any(SENSITIVE_TEXT.search(p) for p in paths):
            block_pre_tool("Direct edits to secret or credential files are blocked. Use documented secret-management procedures.")
            return

        allowed = task.get("allowed_write_paths", []) or []
        if paths and allowed:
            outside = [p for p in paths if not match_any(p, allowed)]
            if outside and mode == "strict":
                block_pre_tool(f"Write blocked outside active Task Contract paths: {outside}. Update the Task Contract or delegate to the correct owner.")
                return
            if outside:
                additional_context(
                    "PreToolUse",
                    f"Ownership warning: patch touches paths outside active task allowance: {outside}. Confirm scope and owner before continuing.",
                    "Write-path ownership warning",
                )
                return


if __name__ == "__main__":
    main()
