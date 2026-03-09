---
name: memvault-note-management
description: >
  This skill should be used when the user asks to "create a note in memvault",
  "search notes", "manage notes", "save to memvault", "find my notes",
  "update note", "delete note", "organize notes into groups",
  "list my notes", "memvault에 노트 저장", "노트 검색", "노트 관리",
  or mentions working with memvault notes or knowledge vault.
  Provides comprehensive guidance for managing notes via memvault's MCP server.
---

# Memvault Note Management

Manage notes in memvault knowledge vault through its MCP server. This skill covers
creating, reading, updating, deleting, searching notes, and organizing them into groups.

## MCP Server Connection

Memvault uses a **stdio bridge** (`bridge.mjs`) that proxies requests to the memvault app's
HTTP MCP server. The bridge is automatically started by Claude Code — no manual setup needed.

- **Transport**: stdio (via bridge.mjs → HTTP to memvault app)
- **Default port**: 19836 (configurable)
- **Requirement**: memvault desktop app must be running with MCP server enabled

### Port Configuration

Custom port can be set in `~/.claude/memvault-plugin.local.md`:

```yaml
---
port: 19836
---
```

Or via environment variable `MEMVAULT_MCP_PORT`.

### Connection Errors

If you see an error like "memvault 앱에 연결할 수 없습니다", the user needs to:
1. Open the memvault desktop app
2. Go to Settings → Integration
3. Enable the MCP server

## Available MCP Tools

All tools are prefixed with `mcp__plugin_memvault-plugin_memvault__` when used in Claude Code.

### Note Operations

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `create_note` | Create a new note | `title`, `content` |
| `get_note` | Read full note content | `id` |
| `update_note` | Update title/content | `id` (+ `title` or `content`) |
| `delete_note` | Delete a note | `id` |
| `list_notes` | List notes (with optional filter) | none (optional: `group_id`, `limit`, `offset`) |
| `search_notes` | Full-text search | `query` |

### Group Operations

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `create_group` | Create a folder/group | `name` (optional: `color`, `icon`) |
| `list_groups` | List all groups | none |
| `assign_note_group` | Move note to group | `note_id` (optional: `group_id`, null to ungroup) |

## Common Workflows

### Create and Organize a Note

1. Use `list_groups` to check existing groups
2. Create group if needed with `create_group`
3. Use `create_note` with title and markdown content
4. Assign to group with `assign_note_group`

### Search and Update

1. Use `search_notes` with query string to find target note
2. Use `get_note` with the found ID to read full content
3. Use `update_note` to modify title or content

### Bulk Note Management

1. Use `list_notes` with `limit` and `offset` for pagination
2. Process notes in batches
3. Use `assign_note_group` to reorganize as needed

## Note Modes

When creating notes, specify the `mode` parameter:
- `"markdown"` (default) — Markdown formatted notes
- `"plain"` — Plain text notes
- `"code"` — Code snippets with syntax highlighting

## Best Practices

- Always use `search_notes` before creating to avoid duplicates
- Use descriptive titles for better searchability
- Organize related notes into groups using `create_group` and `assign_note_group`
- When updating notes, read current content with `get_note` first to preserve existing data
- Use markdown mode for rich content, code mode for snippets

## Troubleshooting

If MCP tools are unavailable:
1. Verify memvault app is running
2. Check MCP server is enabled in memvault app Settings → Integration
3. Check port matches configuration (`~/.claude/memvault-plugin.local.md`)
4. Run `/mcp` in Claude Code to verify server connection status

## Additional Resources

### Reference Files

For detailed MCP tool schemas and parameters:
- **`references/mcp-tools-reference.md`** — Complete tool input schemas and response formats
