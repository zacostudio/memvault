# Memvault MCP Tools Reference

## Note Tools

### create_note
```json
{ "title": "string (required)", "content": "string (required)", "mode": "string|null ('markdown'|'plain'|'code', default: 'markdown')" }
```
Returns: `id`, `title`

### get_note
```json
{ "id": "string (required)" }
```
Returns: `id`, `title`, `mode`, `content`, `created_at`, `updated_at`

### update_note
```json
{ "id": "string (required)", "title": "string|null", "content": "string|null" }
```

### delete_note
```json
{ "id": "string (required)" }
```

### list_notes
```json
{ "group_id": "string|null" }
```
Returns: array of `id`, `title`, `mode`, `group_id`, `created_at`, `updated_at`

### search_notes
```json
{ "query": "string (required)" }
```
Returns: matching notes filtered by title/content containing query

## Group Tools

### list_groups
Input: none. Returns: array of `id`, `name`, `color`, `icon`, `parent_id`

## Project Tools

### list_projects
Input: none. Returns: array of registered projects

## Tool Name Prefix

In Claude Code: `mcp__plugin_memvault-plugin_memvault__<tool_name>`
