# memvault-plugin

Claude Code plugin for managing notes and knowledge via [memvault](https://github.com/zacostudio/memvault) CLI.

## Features

- **Note Management** — Create, read, update, delete, and search notes in memvault
- **Group Listing** — View groups and their hierarchy
- **Project Listing** — View registered projects
- **CLI-based** — Uses memvault's built-in CLI mode, no server required

## Prerequisites

- Memvault desktop app installed at `/Applications/Memvault.app`

## Installation

### Step 1: Add marketplace

In Claude Code, run:

```
/plugin marketplace add zacostudio/memvault
```

### Step 2: Install plugin

```
/plugin install memvault-plugin@zacostudio-memvault
```

### Verify

After installation, run `/mcp` and check that the `memvault` server appears connected.

To reload after changes:

```
/reload-plugins
```

## How It Works

The plugin includes a `bridge.mjs` that acts as a stdio MCP server. When Claude Code calls an MCP tool (e.g. `create_note`), the bridge translates the call into a memvault CLI command:

```
create_note(title="X", content="Y")
  → memvault notes create --json -t "X" --stdin <<< "Y"
```

No HTTP server, no port configuration, no network — just direct CLI execution.

## Available MCP Tools

| Tool | CLI Command | Description |
|------|-------------|-------------|
| `list_notes` | `notes list --json` | List notes (optional: `group_id` filter) |
| `get_note` | `notes read --json ID` | Read full note content |
| `create_note` | `notes create --json -t TITLE --stdin` | Create a new note |
| `update_note` | `notes update --json ID` | Update note title/content |
| `delete_note` | `notes delete --json ID` | Delete a note |
| `search_notes` | `notes list --json` + filter | Search by title/content |
| `list_groups` | `groups list --json` | List all groups |
| `list_projects` | `projects list --json` | List registered projects |

## Usage

### Note Management

The note management skill activates automatically when you mention memvault notes:

```
"Create a note in memvault about today's meeting"
"Search my memvault notes for API design"
"List all notes in the 'Projects' group"
"Update the deployment checklist note"
```

## Troubleshooting

### "memvault binary not found"

Memvault must be installed at `/Applications/Memvault.app`. Download the latest version from [Releases](https://github.com/zacostudio/memvault/releases).

### Plugin not loading

1. Confirm installation: `/plugin list`
2. Reload plugins: `/reload-plugins`
3. Restart Claude Code after configuration changes

## License

MIT
