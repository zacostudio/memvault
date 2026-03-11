# Memvault

This repository hosts release artifacts and Claude Code plugins for [Memvault](https://github.com/zacostudio/memvault).

Download the latest version from the [Releases](https://github.com/zacostudio/memvault/releases) page.

## Claude Code Plugin

The **memvault-plugin** plugin lets you manage memvault notes directly from Claude Code.

### Install

In Claude Code, run:

```
/plugin marketplace add zacostudio/memvault
/plugin install memvault-plugin@memvault-marketplace
```

See [Plugin Documentation](./docs/README.md) for details.

## Available MCP Tools

The memvault plugin exposes the following tools through Claude Code's MCP integration:

### Note Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `create_note` | Create a new note with markdown, plain text, or code content | `title`, `content` |
| `get_note` | Retrieve full note content including metadata (title, mode, timestamps) | `id` |
| `update_note` | Update an existing note's title and/or content | `id` |
| `delete_note` | Permanently delete a note and its content file | `id` |
| `list_notes` | List notes with optional group filtering and pagination | _(none)_ |
| `search_notes` | Full-text search across note titles and content | `query` |

### Group Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `create_group` | Create a new folder/group with optional color, icon, and parent | `name` |
| `create_group_by_path` | Create groups from a slash-separated path (e.g. "Work/Projects/Frontend"). Missing intermediate groups are created automatically | `path` |
| `list_groups` | List all groups with their id, name, color, icon, and parent | _(none)_ |
| `assign_note_group` | Move a note into a group, or pass `null` to ungroup | `note_id` |

### Preview Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `preview_note` | Open a native popup window to preview a note's rendered markdown | `id` |
| `preview_markdown` | Open a native popup window to preview arbitrary markdown text | `content` |

### Note Modes

When creating notes, you can specify a `mode` parameter:

- **`markdown`** (default) — Rich text with markdown formatting
- **`plain`** — Plain text without formatting
- **`code`** — Code snippets with syntax highlighting

### Slash Commands

| Command | Description |
|---------|-------------|
| `/memvault-setup` | Configure MCP server connection (port, verify connectivity) |
| `/memvault-save` | Quick save a note with optional group path and mode |
| `/memvault-search` | Search notes by keyword and display results |
| `/memvault-preview` | Preview a note or markdown in a native popup window |
| `/memvault-list` | List notes or groups with optional filtering |

### Example Usage

```
"Create a note in memvault titled 'Meeting Notes' with today's action items"
"Search my notes for 'API design'"
"List all notes in the Projects group"
"Preview the deployment checklist note"
"Save this to memvault under Work/Projects/Frontend"
```
