# Memvault

[한국어](./README.ko.md) | [日本語](./README.ja.md)

This repository hosts release artifacts and Claude Code plugins for [Memvault](https://github.com/zacostudio/memvault).

Download the latest version from the [Releases](https://github.com/zacostudio/memvault/releases) page.

## Claude Code Plugin

The **memvault-plugin** plugin lets you manage memvault notes, files, and projects directly from Claude Code via the memvault CLI.

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
| `create_note` | Create a new note with markdown, canvas, or code content | `title`, `content` |
| `get_note` | Retrieve full note content including metadata (title, mode, timestamps) | `id` |
| `update_note` | Update an existing note's title and/or content | `id` |
| `delete_note` | Permanently delete a note and its content file | `id` |
| `list_notes` | List notes with optional group filtering | _(none)_ |

#### Search

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `search` | Unified search across notes, links, todos, files, and projects | `query` |
| `search_notes` | Search notes by title (shortcut for search with scope=notes) | `query` |

The `search` tool supports optional parameters: `scope` (notes/links/todos/files/projects), `content` (search inside content), `limit` (max results).

#### Group & Project Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_groups` | List all groups with their id, name, color, icon, and parent | _(none)_ |
| `list_projects` | List registered projects | _(none)_ |
| `add_project` | Register a project directory in memvault | `path` |

#### File Operations

| Tool | Description | Required Parameters |
|------|-------------|---------------------|
| `list_files` | List files in a registered project directory | `path` |
| `read_file` | Read the content of a file under a registered project | `path` |
| `write_file` | Create a new file under a registered project | `path`, `content` |
| `update_file` | Overwrite an existing file under a registered project | `path`, `content` |

#### Note Modes

When creating notes, you can specify a `mode` parameter:

- **`markdown`** (default) — Rich text with markdown formatting
- **`canvas`** — Canvas-style notes
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
"Search across my vault for 'API design'"
"List all notes in the Projects group"
"Save this to memvault"
"Register this project in memvault"
"List files in my project directory"
```
