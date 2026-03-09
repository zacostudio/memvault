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
Returns: `id`, `title`, `mode`, `content`, `is_favorite`, `created_at`, `updated_at`

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
{ "group_id": "string|null", "limit": "integer|null (default: 100)", "offset": "integer|null (default: 0)" }
```
Returns: array of `id`, `title`, `mode`, `is_favorite`, `created_at`, `updated_at`

### search_notes
```json
{ "query": "string (required)" }
```
Returns: matching notes with `id`, `title`, content snippet

## Group Tools

### create_group
```json
{ "name": "string (required)", "color": "string|null (hex)", "icon": "string|null" }
```
Returns: `id`, `name`

### list_groups
Input: none. Returns: array of `id`, `name`, `color`, `icon`, `parent_id`

### assign_note_group
```json
{ "note_id": "string (required)", "group_id": "string|null (null to ungroup)" }
```

## Tool Name Prefix

In Claude Code: `mcp__plugin_memvault-noteman_memvault__<tool_name>`
