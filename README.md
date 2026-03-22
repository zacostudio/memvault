# Memvault

This repository hosts release artifacts and Claude Code plugins for [Memvault](https://github.com/zacostudio/memvault).

Download the latest version from the [Releases](https://github.com/zacostudio/memvault/releases) page.

## Claude Code Plugin

The **memvault-plugin** plugin lets you manage memvault notes directly from Claude Code via the memvault CLI.

### Install via Marketplace

In Claude Code, run:

```
/plugin marketplace add zacostudio/memvault
/plugin install memvault-plugin@memvault-marketplace
```

### Install without Marketplace

You can use the plugin without the marketplace by adding the MCP server directly to your `.mcp.json`:

**Option 1: Project-level** — add to `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "memvault": {
      "command": "/Applications/Memvault.app/Contents/MacOS/memvault",
      "args": ["--json"]
    }
  }
}
```

> Note: This registers the memvault CLI directly as an MCP server. The full plugin (with skills and slash commands) requires the marketplace install above.

**Option 2: Global** — add to `~/.claude/.mcp.json` for all projects.

See [Plugin Documentation](./docs/README.md) for details.

### How It Works

The plugin uses memvault's built-in **CLI mode** to interact with your vault. When you call an MCP tool, the plugin translates it into a CLI command (e.g. `memvault notes list --json`) and returns the result. No separate server or network connection is required — the plugin talks directly to the memvault binary.

**Requirement:** Memvault must be installed at `/Applications/Memvault.app`.

### Available MCP Tools

#### Note Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `create_note` | Create a new note with markdown, plain text, or code content | `title`, `content` |
| `get_note` | Retrieve full note content including metadata (title, mode, timestamps) | `id` |
| `update_note` | Update an existing note's title and/or content | `id` |
| `delete_note` | Permanently delete a note and its content file | `id` |
| `list_notes` | List notes with optional group filtering | _(none)_ |
| `search_notes` | Full-text search across note titles and content | `query` |

#### Group & Project Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_groups` | List all groups with their id, name, color, icon, and parent | _(none)_ |
| `list_projects` | List registered projects | _(none)_ |

#### Note Modes

When creating notes, you can specify a `mode` parameter:

- **`markdown`** (default) — Rich text with markdown formatting
- **`plain`** — Plain text without formatting
- **`code`** — Code snippets with syntax highlighting

### Slash Commands

| Command | Description |
|---------|-------------|
| `/memvault-save` | Quick save a note with optional mode |
| `/memvault-search` | Search notes by keyword and display results |
| `/memvault-list` | List notes or groups with optional filtering |

### Example Usage

```
"Create a note in memvault titled 'Meeting Notes' with today's action items"
"Search my notes for 'API design'"
"List all notes in the Projects group"
"Save this to memvault"
```
