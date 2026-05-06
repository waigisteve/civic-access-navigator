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

## Working Principles

- keep the workspace scoped to the current capstone unless a change is clearly part of the submission setup
- prefer grounded summaries over broad abstraction
- keep the Codex layer lightweight and separate from the user-facing PeaceTech product
- use the onboarding scaffold to understand the repo before changing it
- trim side experiments that do not support the capstone story
- use Codex to accelerate the real project, not to replace product thinking or domain review
- preserve privacy, source quality, and citation discipline when handling public-interest content
- treat uncertainty as a signal to search, inspect, or ask rather than guess
- keep the audience in mind: the submission should show both technical work and responsible use of AI

## Onboarding Agent

The workshop also includes a codebase onboarding agent that should be part of the submission context.

See [ONBOARDING_AGENT.md](./ONBOARDING_AGENT.md) for the summary of the expected workflow and subcommands.
