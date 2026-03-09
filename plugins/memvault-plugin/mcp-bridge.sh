#!/bin/bash
# MCP Streamable HTTP → stdio bridge using curl
# Reads JSON-RPC from stdin, POSTs to server, returns parsed response to stdout

# Read port from .claude/memvault-plugin.local.md if exists
LOCAL_CONFIG=".claude/memvault-plugin.local.md"
PORT=19836
if [ -f "$LOCAL_CONFIG" ]; then
  CUSTOM_PORT=$(grep -E '^port:' "$LOCAL_CONFIG" | sed 's/port:[[:space:]]*//')
  [ -n "$CUSTOM_PORT" ] && PORT="$CUSTOM_PORT"
fi

SERVER_URL="http://localhost:${PORT}/mcp"
SESSION_ID=""

while IFS= read -r line; do
  [ -z "$line" ] && continue

  HEADERS=(-H "Content-Type: application/json" -H "Accept: application/json, text/event-stream")
  [ -n "$SESSION_ID" ] && HEADERS+=(-H "mcp-session-id: $SESSION_ID")

  RESPONSE=$(/usr/bin/curl -s -D /tmp/mcp-headers -X POST "$SERVER_URL" "${HEADERS[@]}" -d "$line" 2>/dev/null)

  NEW_SESSION=$(grep -i 'mcp-session-id' /tmp/mcp-headers 2>/dev/null | sed 's/.*: //' | tr -d '\r\n')
  [ -n "$NEW_SESSION" ] && SESSION_ID="$NEW_SESSION"

  echo "$RESPONSE" | while IFS= read -r sse_line; do
    case "$sse_line" in
      data:\ *)
        json="${sse_line#data: }"
        [ -n "$json" ] && echo "$json"
        ;;
      {*)
        echo "$sse_line"
        ;;
    esac
  done
done
