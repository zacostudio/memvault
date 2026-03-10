#!/usr/bin/env node

/**
 * stdio-to-HTTP MCP bridge for memvault.
 * Reads JSON-RPC from stdin, forwards to memvault's HTTP MCP server,
 * writes responses to stdout.
 */

import { createInterface } from "node:readline";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DEFAULT_PORT = 19836;
const FETCH_TIMEOUT_MS = 30_000;

async function resolvePort() {
    try {
        const configPath = join(
            process.env.HOME || process.env.USERPROFILE || ".",
            ".claude",
            "memvault-plugin.local.md",
        );
        const content = await readFile(configPath, "utf-8");
        const match = content.match(/^port:\s*(\d+)/m);
        if (match) return Number(match[1]);
    } catch {
        // Config file not found — use default
    }
    return Number(process.env.MEMVAULT_MCP_PORT) || DEFAULT_PORT;
}

function writeOut(data) {
    process.stdout.write(typeof data === "string" ? data : JSON.stringify(data));
    process.stdout.write("\n");
}

function makeError(id, code, message) {
    return { jsonrpc: "2.0", id, error: { code, message } };
}

async function main() {
    const port = await resolvePort();
    const mcpUrl = `http://127.0.0.1:${port}/mcp`;
    let sessionId = null;

    const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

    async function sendRequest(msg, headers) {
        return fetch(mcpUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(msg),
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
    }

    async function reinitializeSession() {
        const initMsg = {
            jsonrpc: "2.0",
            id: `_bridge_reinit_${Date.now()}`,
            method: "initialize",
            params: {
                protocolVersion: "2025-06-18",
                capabilities: {},
                clientInfo: { name: "memvault-bridge", version: "1.0" },
            },
        };
        const initHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
        };

        try {
            const res = await fetch(mcpUrl, {
                method: "POST",
                headers: initHeaders,
                body: JSON.stringify(initMsg),
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });

            const sid = res.headers.get("mcp-session-id");
            if (sid) {
                sessionId = sid;
                // Consume the response body
                await res.text();
                // Send initialized notification
                const notifHeaders = { ...initHeaders };
                notifHeaders["Mcp-Session-Id"] = sessionId;
                await fetch(mcpUrl, {
                    method: "POST",
                    headers: notifHeaders,
                    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
                    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
                }).then((r) => r.text()).catch(() => {});
                return true;
            }
        } catch {
            // Re-init failed
        }
        return false;
    }

    for await (const line of rl) {
        if (!line.trim()) continue;

        let msg;
        try {
            msg = JSON.parse(line);
        } catch {
            process.stderr.write(`bridge: malformed JSON from stdin: ${line.slice(0, 120)}\n`);
            continue;
        }

        const isRequest = msg.id !== undefined;
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
        };
        if (sessionId) headers["Mcp-Session-Id"] = sessionId;

        let res;
        try {
            res = await sendRequest(msg, headers);
        } catch (err) {
            if (isRequest) {
                const reason =
                    err.name === "TimeoutError"
                        ? `요청 시간이 초과되었습니다 (${FETCH_TIMEOUT_MS / 1000}초).`
                        : `memvault 앱에 연결할 수 없습니다 (port ${port}). 앱을 실행하고 설정에서 MCP 서버를 활성화하세요.`;
                writeOut(makeError(msg.id, -32000, reason));
            }
            continue;
        }

        // Capture session ID
        const sid = res.headers.get("mcp-session-id");
        if (sid) sessionId = sid;

        // Session expired or server restarted — auto re-initialize and retry
        if (res.status === 404) {
            const body = await res.text().catch(() => "");
            if (body.includes("Session not found")) {
                process.stderr.write("bridge: session expired, re-initializing...\n");
                sessionId = null;
                const recovered = await reinitializeSession();
                if (recovered && isRequest) {
                    // Retry the original request with new session
                    const retryHeaders = {
                        "Content-Type": "application/json",
                        Accept: "application/json, text/event-stream",
                        "Mcp-Session-Id": sessionId,
                    };
                    try {
                        res = await sendRequest(msg, retryHeaders);
                        const retrySid = res.headers.get("mcp-session-id");
                        if (retrySid) sessionId = retrySid;
                    } catch (retryErr) {
                        writeOut(
                            makeError(
                                msg.id,
                                -32000,
                                `세션 복구 후 재시도 실패: ${retryErr.message}`,
                            ),
                        );
                        continue;
                    }
                } else if (isRequest) {
                    writeOut(
                        makeError(
                            msg.id,
                            -32000,
                            "세션이 만료되었고 재연결에 실패했습니다. memvault 앱이 실행 중인지 확인하세요.",
                        ),
                    );
                    continue;
                } else {
                    continue;
                }
            } else {
                // Non-session 404 error
                if (isRequest) {
                    writeOut(
                        makeError(
                            msg.id,
                            -32000,
                            `memvault MCP 서버 에러 (HTTP 404): ${body.slice(0, 200) || res.statusText}`,
                        ),
                    );
                }
                continue;
            }
        }

        // HTTP 202: notification accepted — no output
        if (res.status === 202) continue;

        // Handle HTTP errors
        if (!res.ok) {
            if (isRequest) {
                const body = await res.text().catch(() => "");
                writeOut(
                    makeError(
                        msg.id,
                        -32000,
                        `memvault MCP 서버 에러 (HTTP ${res.status}): ${body.slice(0, 200) || res.statusText}`,
                    ),
                );
            }
            continue;
        }

        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("text/event-stream")) {
            // Parse SSE: split by double-newline into blocks, extract data lines
            const text = await res.text();
            for (const block of text.split("\n\n")) {
                const dataLines = [];
                for (const line of block.split("\n")) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("data:")) {
                        const payload = trimmed.slice(5).trim();
                        if (payload && payload !== "[DONE]") {
                            dataLines.push(payload);
                        }
                    }
                }
                if (dataLines.length > 0) {
                    writeOut(dataLines.join(""));
                }
            }
        } else {
            // JSON response
            const body = await res.text();
            if (body.trim()) {
                writeOut(body.trim());
            }
        }
    }
}

main().catch((err) => {
    process.stderr.write(`bridge fatal: ${err.message}\n`);
    process.exit(1);
});
