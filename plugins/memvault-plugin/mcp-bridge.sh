#!/bin/bash
# MCP Streamable HTTP → stdio bridge using curl

LOG="/tmp/mcp-bridge-debug.log"
echo "=== Bridge started at $(date) ===" > "$LOG"

# Read port from .claude/memvault-plugin.local.md if exists
LOCAL_CONFIG=".claude/memvault-plugin.local.md"
PORT=19836
if [ -f "$LOCAL_CONFIG" ]; then
  CUSTOM_PORT=$(grep -E '^port:' "$LOCAL_CONFIG" | sed 's/port:[[:space:]]*//')
  [ -n "$CUSTOM_PORT" ] && PORT="$CUSTOM_PORT"
fi

SERVER_URL="http://localhost:${PORT}/mcp"
SESSION_ID=""
HEADER_FILE="/tmp/mcp-bridge-$$.headers"

trap "rm -f '$HEADER_FILE'" EXIT

echo "SERVER_URL=$SERVER_URL" >> "$LOG"

while IFS= read -r line; do
  [ -z "$line" ] && continue

  echo ">>> RECV: $line" >> "$LOG"

  HEADERS=(-H "Content-Type: application/json" -H "Accept: application/json, text/event-stream")
  [ -n "$SESSION_ID" ] && HEADERS+=(-H "mcp-session-id: $SESSION_ID")

  # Check if this is a notification (no "id" field = no response expected)
  if echo "$line" | grep -q '"method"' && ! echo "$line" | grep -q '"id"'; then
    /usr/bin/curl -s -D "$HEADER_FILE" -X POST "$SERVER_URL" "${HEADERS[@]}" -d "$line" > /dev/null 2>&1
    NEW_SESSION=$(grep -i 'mcp-session-id' "$HEADER_FILE" 2>/dev/null | sed 's/.*: //' | tr -d '\r\n')
    [ -n "$NEW_SESSION" ] && SESSION_ID="$NEW_SESSION"
    echo ">>> NOTIFICATION (no response)" >> "$LOG"
    continue
  fi

  RESPONSE=$(/usr/bin/curl -s -D "$HEADER_FILE" -X POST "$SERVER_URL" "${HEADERS[@]}" -d "$line" 2>/dev/null)

  NEW_SESSION=$(grep -i 'mcp-session-id' "$HEADER_FILE" 2>/dev/null | sed 's/.*: //' | tr -d '\r\n')
  [ -n "$NEW_SESSION" ] && SESSION_ID="$NEW_SESSION"

  echo ">>> RAW RESPONSE: $RESPONSE" >> "$LOG"

  # Parse SSE response - extract only JSON data lines
  while IFS= read -r sse_line; do
    case "$sse_line" in
      data:\ \{*)
        json="${sse_line#data: }"
        echo ">>> SEND: $json" >> "$LOG"
        printf '%s\n' "$json"
        ;;
      \{*)
        echo ">>> SEND: $sse_line" >> "$LOG"
        printf '%s\n' "$sse_line"
        ;;
    esac
  done <<< "$RESPONSE"
done

echo "=== Bridge ended at $(date) ===" >> "$LOG"
