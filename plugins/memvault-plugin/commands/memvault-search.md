---
description: Search notes in memvault by keyword
allowed-tools: ["mcp__plugin_memvault-plugin_memvault__search_notes", "mcp__plugin_memvault-plugin_memvault__get_note"]
argument-hint: "<query>"
---

# Memvault Search

Search for notes in memvault and display results.

## Steps

### 1. Parse Query

The entire argument string is the search query.

If no query is provided, ask the user what they want to search for.

### 2. Execute Search

Use `search_notes` with the query string.

### 3. Display Results

Format results as a numbered list:

```
## Search Results for "<query>"

1. **Note Title** (id: abc123)
   > Content snippet...

2. **Note Title** (id: def456)
   > Content snippet...

Found N notes matching "<query>".
```

If no results found, inform the user and suggest:
- Trying different keywords
- Using `list_notes` to browse all notes

### 4. Offer Actions

After displaying results, ask the user if they want to:
- **Read** a specific note (use `get_note`)
