---
description: Preview markdown content or a note in memvault's native popup window
allowed-tools: ["mcp__plugin_memvault-plugin_memvault__preview_markdown", "mcp__plugin_memvault-plugin_memvault__preview_note", "mcp__plugin_memvault-plugin_memvault__search_notes", "mcp__plugin_memvault-plugin_memvault__get_note"]
argument-hint: "[note title or ID | --markdown]"
---

# Memvault Preview

Open a native preview popup window via memvault.

## Steps

### 1. Determine Preview Mode

Parse the argument:
- If `--markdown` flag: preview arbitrary markdown content (prompt for content)
- If an argument looks like a UUID/ID: use it as a note ID directly
- If text is provided: search for matching notes by title
- If no argument: ask what to preview

### 2a. Preview a Note

If previewing a note:
1. If a title was given, use `search_notes` to find matching notes
2. If multiple matches, show the list and ask the user to pick one
3. Use `preview_note` with the note ID to open the native popup

### 2b. Preview Markdown

If `--markdown` flag was used:
1. Ask the user for the markdown content to preview
2. Optionally ask for a title
3. Use `preview_markdown` with the content and title

### 3. Confirmation

Display:
- What was previewed (note title or "custom markdown")
- Confirmation that the preview window was opened
