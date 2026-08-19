from datetime import datetime, timezone
import json
from common import read_event, repo_root


def main() -> None:
    event = read_event()
    root = repo_root(event.get("cwd"))
    log_dir = root / ".ai/logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "session_id": event.get("session_id"),
        "reason": event.get("reason"),
        "model": event.get("model"),
        "cwd": event.get("cwd"),
    }
    with (log_dir / "session-events.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")


if __name__ == "__main__":
    main()
