# memvault-marketplace

Claude Code plugin for managing notes and knowledge via [memvault](https://github.com/zacostudio/memvault) MCP server.

## Features

- **Note Management Skill** — Create, read, update, delete, and search notes in memvault
- **Group Organization** — Organize notes into groups (folders) with colors and icons
- **Streamable HTTP MCP** — Connects to memvault's Streamable HTTP MCP server
- **Configurable Port** — Supports custom MCP server port via settings file

## Prerequisites

- memvault desktop app running with MCP server enabled
- Default MCP server port: **19836**

## Installation

```bash
claude --plugin-dir /path/to/memvault-marketplace
```

Or add to your Claude Code plugins directory.

## Configuration

### MCP Server Port

The default port is **19836**. To change it:

1. Create `.claude/memvault-marketplace.local.md` in your project:

```markdown
---
port: 19836
---
```

2. Update `.mcp.json` in the plugin directory to match:

```json
{
  "memvault": {
    "type": "sse",
    "url": "http://localhost:<YOUR_PORT>/mcp"
  }
}
```

3. Restart Claude Code for changes to take effect.

Or use the setup command:

```
/memvault-marketplace:memvault-setup [port]
```

## Usage

### Note Management

The note management skill activates automatically when you ask about memvault notes:

- "Create a note in memvault about today's meeting"
- "Search my memvault notes for API design"
- "List all notes in the 'Projects' group"
- "Update the deployment checklist note"

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

## MCP Server Details

memvault uses **Streamable HTTP** transport (not classic SSE):

- **Endpoint**: `POST http://localhost:<PORT>/mcp`
- **Request**: JSON-RPC 2.0 with `Content-Type: application/json`
- **Response**: `text/event-stream` (SSE format)
- **Session**: `Mcp-Session-Id` header for session continuity

## License

MIT
