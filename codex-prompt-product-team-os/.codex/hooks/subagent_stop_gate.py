from common import continue_agent, emit, read_event

REQUIRED = [
    "OUTCOME",
    "SCOPE",
    "ACCEPTANCE_EVIDENCE",
    "TEST_EVIDENCE",
    "RISKS",
    "UNRESOLVED",
    "NEXT_OWNER",
]


def main() -> None:
    event = read_event()
    if event.get("stop_hook_active"):
        emit({"continue": True})
        return
    message = event.get("last_assistant_message") or ""
    missing = [x for x in REQUIRED if x not in message.upper()]
    if missing:
        continue_agent(
            "Before stopping, return a structured handoff. Missing sections: " + ", ".join(missing)
        )
        return
    emit({"continue": True})


if __name__ == "__main__":
    main()
