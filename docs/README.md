# memvault-plugin

Claude Code plugin for managing notes and knowledge via [memvault](https://github.com/zacostudio/memvault) MCP server.

## Features

- **Note Management Skill** — Create, read, update, delete, and search notes in memvault
- **Group Organization** — Organize notes into groups (folders) with colors and icons
- **Streamable HTTP MCP** — Connects via Streamable HTTP (type `"sse"`)
- **Configurable Port** — Supports custom MCP server port via settings file

## Prerequisites

- memvault desktop app running with MCP server enabled
- Default MCP server port: **19836**

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

## Configuration

### MCP Server Port

The default port is **19836**. To change it:

1. Create `.claude/memvault-plugin.local.md` in your project:

```markdown
---
port: 19836
---
```

2. Update `.mcp.json` in the plugin directory to match:

```json
{
  "mcpServers": {
    "memvault": {
      "type": "sse",
      "url": "http://localhost:<YOUR_PORT>/mcp"
    }
  }
}
```

3. Restart Claude Code for changes to take effect.

Or use the setup command:

```
/memvault-plugin:memvault-setup [port]
```

## Usage

### Note Management

The note management skill activates automatically when you mention memvault notes:

```
"Create a note in memvault about today's meeting"
"Search my memvault notes for API design"
"List all notes in the 'Projects' group"
"Update the deployment checklist note"
```

### Setup Command

```
/memvault-plugin:memvault-setup         # Check connection with default port
/memvault-plugin:memvault-setup 8080    # Configure custom port
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `create_note` | Create a new note (markdown, plain, or code) |
| `get_note` | Read full note content by ID |
| `update_note` | Update note title and/or content |
| `delete_note` | Delete a note |
| `list_notes` | List notes with optional group filter |
| `search_notes` | Full-text search notes |
| `create_group` | Create a group/folder |
| `list_groups` | List all groups |
| `assign_note_group` | Assign note to group |

## Troubleshooting

### MCP server not connecting

1. Ensure memvault desktop app is running
2. Check that MCP server is enabled in memvault settings
3. Verify the port matches (default: 19836)
4. Run `/mcp` in Claude Code to check server status

### Plugin not loading

1. Confirm installation: `/plugin list`
2. Reload plugins: `/reload-plugins`
3. Restart Claude Code after configuration changes

## License

MIT
