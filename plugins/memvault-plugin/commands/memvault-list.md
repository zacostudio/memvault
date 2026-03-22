---
description: List notes and groups in memvault
allowed-tools: ["mcp__plugin_memvault-plugin_memvault__list_notes", "mcp__plugin_memvault-plugin_memvault__list_groups", "mcp__plugin_memvault-plugin_memvault__get_note"]
argument-hint: "[notes|groups] [--group <id>]"
---

# Memvault List

List notes or groups stored in memvault.

## Steps

### 1. Parse Arguments

- **First argument** (optional): `notes` (default) or `groups`
- **--group <id>** (optional): Filter notes by group ID

### 2a. List Groups

If `groups` was specified:
1. Use `list_groups` to fetch all groups
2. Display as a formatted table:

```
## Groups

| Name | Color | Icon | ID |
|------|-------|------|----|
| Work | #FF5733 | 📁 | abc123 |
```

### 2b. List Notes

If `notes` was specified (or no argument):
1. Use `list_notes` with optional `group_id`
2. Display as a formatted list:

```
## Notes

| # | Title | Mode | Updated |
|---|-------|------|---------|
| 1 | My Note | markdown | 2025-03-10 |
```

### 3. Offer Actions

After listing, ask the user if they want to:
- **Read** a specific note
- **Search** for something specific
