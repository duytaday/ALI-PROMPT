from common import additional_context, load_json, read_event, repo_root

ROLE_ALIASES = {
    "product_analyst": "product_hq",
    "prompt_domain_reviewer": "prompt_product_architect",
    "ux_reviewer": "product_ux",
    "implementation_worker": "implementation_lead",
    "frontend_specialist": "implementation_lead",
    "backend_data_specialist": "implementation_lead",
    "test_engineer": "qa_release",
    "code_reviewer": "qa_release",
    "release_auditor": "qa_release",
    "data_growth_analyst": "data_growth",
}


def main() -> None:
    event = read_event()
    root = repo_root(event.get("cwd"))
    ownership = load_json(root / ".ai/ownership.json", {})
    task = load_json(root / ".ai/active-task.json", {})
    agent_type = event.get("agent_type", "unknown")
    ownership_role = ROLE_ALIASES.get(agent_type, agent_type)

    role = ownership.get("roles", {}).get(ownership_role, {})
    text = f"""
SUBAGENT BOUNDARY
Agent type: {agent_type}
Ownership role: {ownership_role}
Active task: {task.get('task_id', 'UNSET')}
Task owner: {task.get('owner', 'unknown')}
Task allowed write paths: {task.get('allowed_write_paths', [])}
Role decision rights: {role.get('decision_rights', [])}
Role default write paths: {role.get('write_paths', [])}
Must consult: {role.get('must_consult', [])}
Must approve: {role.get('must_approve', [])}

Stay within the delegated scope. Do not make adjacent product/policy decisions. If writing, require exclusive paths or an isolated worktree. Return the standard handoff fields.
""".strip()
    additional_context("SubagentStart", text)


if __name__ == "__main__":
    main()
