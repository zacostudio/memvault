---
description: Save a note to memvault (title and content as arguments)
allowed-tools: ["mcp__plugin_memvault-plugin_memvault__create_note", "mcp__plugin_memvault-plugin_memvault__list_groups", "mcp__plugin_memvault-plugin_memvault__assign_note_group", "mcp__plugin_memvault-plugin_memvault__search_notes", "mcp__plugin_memvault-plugin_memvault__create_group_by_path"]
argument-hint: "<title> [--group <group_path>] [--mode markdown|plain|code]"
---

# Memvault Save

Save a note to memvault quickly from the command line.

## Steps

### 1. Parse Arguments

Extract from the argument string:
- **title** (required): The note title — everything before `--group` or `--mode` flags
- **--group <name>** (optional): Target group name to assign the note to
- **--mode <mode>** (optional): Note mode — `markdown` (default), `plain`, or `code`

If no title is provided, ask the user for a title.

### 2. Check for Duplicates

Use `search_notes` with the title to check if a similar note already exists.
If a match is found, ask the user whether to:
- Create a new note anyway
- Update the existing note instead

### 3. Collect Content

Ask the user for the note content. Accept markdown, plain text, or code depending on the mode.

If the user provides content inline with the command (after the title), use that directly.

### 4. Create the Note

Use `create_note` with:
- `title`: parsed title
- `content`: collected content
- `mode`: specified mode or `"markdown"` by default

### 5. Assign to Group (if specified)

If `--group` was provided:
1. The group value can be a slash-separated path (e.g. `Work/Projects/Frontend`)
2. Use `create_group_by_path` with the path — this finds existing groups or creates missing ones automatically
3. Use `assign_note_group` with the note ID and the returned `leaf_group_id`

### 6. Show Summary

Display:
- Note title and ID
- Mode used
- Group assignment (if any)
- Confirmation message
