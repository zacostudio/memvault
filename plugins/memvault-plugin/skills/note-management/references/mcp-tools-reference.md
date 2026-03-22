# Memvault MCP Tools Reference

## Note Tools

### create_note
```json
{ "title": "string (required)", "content": "string (required)", "mode": "string|null ('markdown'|'canvas'|'code', default: 'markdown')" }
```
Returns: `id`, `title`, `mode`, `file_name`

### get_note
```json
{ "id": "string (required)" }
```
Returns: `id`, `title`, `mode`, `content`, `updated_at`

### update_note
```json
{ "id": "string (required)", "title": "string|null", "content": "string|null" }
```
Returns: `id`, `title`, `updated_at`

### delete_note
```json
{ "id": "string (required)" }
```
Returns: `id`, `deleted`

### list_notes
```json
{ "group_id": "string|null" }
```
Returns: array of `id`, `title`, `mode`, `group_id`, `updated_at`

## Search Tools

### search
Unified search across all content types.
```json
{ "query": "string (required)", "scope": "string|null ('notes'|'links'|'todos'|'files'|'projects')", "content": "boolean|null (search file/note content)", "limit": "number|null (default: 20)" }
```
Returns: object with keys per scope, e.g. `{ "notes": [...], "links": [...], "files": [...] }`

### search_notes
Shortcut for `search` with `scope=notes`.
```json
{ "query": "string (required)" }
```
Returns: `{ "notes": [...] }`

## Group Tools

### list_groups
Input: none. Returns: array of `id`, `name`, `color`, `icon`, `parent_id`

## Project Tools

### list_projects
Input: none. Returns: array of `id`, `name`, `path`

### add_project
```json
{ "path": "string (required, absolute path)" }
```
Returns: `id`, `name`, `path`

## File Tools

### list_files
```json
{ "path": "string (required, absolute path to directory under a registered project)" }
```
Returns: array of `path` (relative), `is_dir`

### read_file
```json
{ "path": "string (required, absolute path)" }
```
Returns: `path`, `content`

### write_file
Creates a new file (fails if file already exists).
```json
{ "path": "string (required, absolute path)", "content": "string (required)" }
```
Returns: `path`, `written` (byte count)

### update_file
Overwrites an existing file (fails if file does not exist).
```json
{ "path": "string (required, absolute path)", "content": "string (required)" }
```
Returns: `path`, `written` (byte count)

## Tool Name Prefix

In Claude Code: `mcp__plugin_memvault-plugin_memvault__<tool_name>`
