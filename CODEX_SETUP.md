# Codex Setup

This project expects a local Codex configuration at `~/.codex/config.toml` with:

- `model = "gpt-5.5"`
- `model_reasoning_effort = "low"`
- `approval_policy = "on-request"`
- `sandbox_mode = "workspace-write"`

It also expects a filesystem MCP server scoped to the workspace root:

```toml
[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/mnt/c/Users/Hp/codex-demo"]
startup_timeout_sec = 20
```

After loading the config, Codex should show filesystem tools such as:

- `read_text_file`
- `list_directory`
- `search_files`
- `directory_tree`

## Onboarding Agent

The workshop also includes a codebase onboarding agent that should be part of the submission context.

See [ONBOARDING_AGENT.md](./ONBOARDING_AGENT.md) for the summary of the expected workflow and subcommands.
