---
name: memvault-note-management
description: >
  This skill should be used when the user asks to "create a note in memvault",
  "search notes", "manage notes", "save to memvault", "find my notes",
  "update note", "delete note", "organize notes into groups",
  "list my notes", "preview note", "preview markdown",
  "memvault에 노트 저장", "노트 검색", "노트 관리", "미리보기",
  or mentions working with memvault notes or knowledge vault.
  Provides comprehensive guidance for managing notes via memvault's CLI-based MCP bridge.
---

# Memvault Note Management

Manage notes in memvault knowledge vault through its CLI-based MCP bridge. This skill covers
creating, reading, updating, deleting, searching notes, and viewing groups.

## How It Works

The plugin uses a **CLI bridge** (`bridge.mjs`) that translates MCP tool calls into
memvault CLI commands. No HTTP server or network connection required.

- **Transport**: stdio (bridge.mjs → memvault CLI binary)
- **Binary path**: `/Applications/Memvault.app/Contents/MacOS/memvault`
- **Requirement**: Memvault desktop app must be installed

### Connection Errors

If you see "memvault binary not found", the user needs to install Memvault from
[Releases](https://github.com/zacostudio/memvault/releases).

## Available MCP Tools

All tools are prefixed with `mcp__plugin_memvault-plugin_memvault__` when used in Claude Code.

### Note Operations

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `create_note` | Create a new note | `title`, `content` |
| `get_note` | Read full note content | `id` |
| `update_note` | Update title/content | `id` (+ `title` or `content`) |
| `delete_note` | Delete a note | `id` |
| `list_notes` | List notes (with optional filter) | none (optional: `group_id`) |
| `search_notes` | Full-text search | `query` |

### Group & Project Operations

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `list_groups` | List all groups | none |
| `list_projects` | List registered projects | none |

## Common Workflows

### Create a Note

1. Use `create_note` with title and markdown content
2. Optionally specify `mode`: `"markdown"` (default), `"plain"`, or `"code"`

### Search and Update

1. Use `search_notes` with query string to find target note
2. Use `get_note` with the found ID to read full content
3. Use `update_note` to modify title or content

### Browse Notes by Group

1. Use `list_groups` to see available groups
2. Use `list_notes` with `group_id` to filter notes in a specific group

## Note Modes

When creating notes, specify the `mode` parameter:
- `"markdown"` (default) — Markdown formatted notes
- `"plain"` — Plain text notes
- `"code"` — Code snippets with syntax highlighting

## Best Practices

- Always use `search_notes` before creating to avoid duplicates
- Use descriptive titles for better searchability
- When updating notes, read current content with `get_note` first to preserve existing data

## Troubleshooting

If MCP tools are unavailable:
1. Verify Memvault is installed at `/Applications/Memvault.app`
2. Run `/memvault-plugin:memvault-setup` to check connectivity
3. Run `/mcp` in Claude Code to verify server connection status

## Additional Resources

### Reference Files

For detailed MCP tool schemas and parameters:
- **`references/mcp-tools-reference.md`** — Complete tool input schemas and response formats
