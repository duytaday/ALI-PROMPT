import re
from common import additional_context, block_prompt, read_event

SECRET_PATTERNS = [
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"(?i)\b(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-/.+=]{16,}"),
]


def main() -> None:
    event = read_event()
    prompt = event.get("prompt", "") or ""
    for pattern in SECRET_PATTERNS:
        if pattern.search(prompt):
            block_prompt("Potential credential or private key detected. Remove or redact the secret before submitting the prompt.")
            return

    if not re.search(r"(?i)\bTASK[-_ ]?[A-Z0-9]+\b", prompt):
        additional_context(
            "UserPromptSubmit",
            "No Task ID was detected. For implementation work, verify or create a Task Contract before editing. Discovery and Q&A may continue without one.",
        )


if __name__ == "__main__":
    main()
