---
description: Configure memvault MCP server connection (port, verify connectivity)
allowed-tools: ["Bash", "Read", "Write"]
argument-hint: "[port]"
---

# Memvault Setup

Guide the user through configuring the memvault MCP server connection.

## Steps

### 1. Check Current Configuration

Read the current `.mcp.json` in the plugin directory to see the configured URL.
Check if `.claude/memvault-marketplace.local.md` exists for port settings.

### 2. Determine Port

If an argument was provided, use it as the port number.
If no argument, check these sources in order:

1. `.claude/memvault-marketplace.local.md` — `port` field in YAML frontmatter
2. Default: **19836**

### 3. Verify Connectivity

Test the MCP server connection:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:<PORT>/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"claude-code","version":"1.0"}}}'
```

If HTTP 200: Connection successful.
If connection refused or other error: Inform user that memvault app may not be running or port is incorrect.

### 4. Save Configuration

Create or update `.claude/memvault-marketplace.local.md`:

```markdown
---
port: <PORT>
---

# Memvault MCP Configuration

Connected to memvault MCP server at port <PORT>.
```

### 5. Show Summary

Display:

- Configured port
- Connection status
- Available MCP tools (if connected)
- Reminder to restart Claude Code if port was changed
