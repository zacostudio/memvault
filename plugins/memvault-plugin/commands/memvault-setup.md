---
description: Configure memvault MCP server connection (port, verify connectivity)
allowed-tools: ["Bash", "Read", "Write"]
argument-hint: "[port]"
---

# Memvault Setup

Guide the user through configuring the memvault MCP server connection.

## Steps

### 1. Check Current Configuration

Check if `~/.claude/memvault-plugin.local.md` exists for port settings.
Default port is **19836**.

### 2. Determine Port

If an argument was provided, use it as the port number.
If no argument, check these sources in order:

1. `~/.claude/memvault-plugin.local.md` — `port` field in YAML frontmatter
2. Environment variable `MEMVAULT_MCP_PORT`
3. Default: **19836**

### 3. Verify Connectivity

Test the MCP server connection:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:<PORT>/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"claude-code","version":"1.0"}}}'
```

If HTTP 200: Connection successful.
If connection refused or other error: Inform user that memvault app may not be running or MCP is not enabled in Settings → Integration.

### 4. Save Configuration

Create or update `~/.claude/memvault-plugin.local.md`:

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
- Reminder: memvault app must be running with MCP enabled for tools to work
- If port was changed, remind user to restart Claude Code for the bridge to pick up the new port
