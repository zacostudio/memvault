#!/usr/bin/env node

/**
 * CLI-based MCP bridge for memvault.
 * Reads JSON-RPC from stdin, maps MCP tool calls to memvault CLI commands,
 * writes responses to stdout.
 */

import { createInterface } from "node:readline";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const MEMVAULT_BIN = "/Applications/Memvault.app/Contents/MacOS/memvault";
const EXEC_TIMEOUT_MS = 30_000;

const SERVER_INFO = {
	name: "memvault",
	version: "0.7.0",
};

const TOOL_DEFINITIONS = [
	{
		name: "list_notes",
		description: "List notes with optional group filtering",
		inputSchema: {
			type: "object",
			properties: {
				group_id: { type: "string", description: "Filter by group ID" },
			},
		},
	},
	{
		name: "get_note",
		description: "Retrieve full note content including metadata",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Note ID" },
			},
			required: ["id"],
		},
	},
	{
		name: "create_note",
		description: "Create a new note with markdown, canvas, or code content",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string", description: "Note title" },
				content: { type: "string", description: "Note content" },
				mode: {
					type: "string",
					enum: ["markdown", "canvas", "code"],
					description: "Note mode (default: markdown)",
				},
			},
			required: ["title", "content"],
		},
	},
	{
		name: "update_note",
		description: "Update an existing note's title and/or content",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Note ID" },
				title: { type: "string", description: "New title" },
				content: { type: "string", description: "New content" },
			},
			required: ["id"],
		},
	},
	{
		name: "delete_note",
		description: "Permanently delete a note and its content file",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Note ID" },
			},
			required: ["id"],
		},
	},
	{
		name: "search",
		description:
			"Unified search across notes, links, todos, files, and projects. Returns results grouped by scope.",
		inputSchema: {
			type: "object",
			properties: {
				query: { type: "string", description: "Search query" },
				scope: {
					type: "string",
					enum: ["notes", "links", "todos", "files", "projects"],
					description:
						"Limit search to a specific scope (default: all scopes)",
				},
				content: {
					type: "boolean",
					description:
						"Also search file/note content, not just titles (default: false)",
				},
				limit: {
					type: "number",
					description: "Maximum results per scope (default: 20)",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "search_notes",
		description:
			"Search notes by title (shortcut for search with scope=notes). Use 'search' tool for multi-scope searches.",
		inputSchema: {
			type: "object",
			properties: {
				query: { type: "string", description: "Search query" },
			},
			required: ["query"],
		},
	},
	{
		name: "list_groups",
		description: "List all groups with their id, name, color, icon, and parent",
		inputSchema: { type: "object", properties: {} },
	},
	{
		name: "list_projects",
		description: "List registered projects",
		inputSchema: { type: "object", properties: {} },
	},
	{
		name: "add_project",
		description: "Register a project directory in memvault",
		inputSchema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "Absolute path to the project directory",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "list_files",
		description:
			"List files in a registered project directory (respects .gitignore)",
		inputSchema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "Absolute path to a directory under a registered project",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "read_file",
		description: "Read the content of a file under a registered project",
		inputSchema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "Absolute path to the file",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "write_file",
		description:
			"Create a new file under a registered project (fails if file already exists)",
		inputSchema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "Absolute path for the new file",
				},
				content: {
					type: "string",
					description: "File content to write",
				},
			},
			required: ["path", "content"],
		},
	},
	{
		name: "update_file",
		description:
			"Overwrite an existing file under a registered project (fails if file does not exist)",
		inputSchema: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "Absolute path to the existing file",
				},
				content: {
					type: "string",
					description: "New file content",
				},
			},
			required: ["path", "content"],
		},
	},
];

function writeOut(data) {
	process.stdout.write(typeof data === "string" ? data : JSON.stringify(data));
	process.stdout.write("\n");
}

function makeResult(id, result) {
	return { jsonrpc: "2.0", id, result };
}

function makeError(id, code, message) {
	return { jsonrpc: "2.0", id, error: { code, message } };
}

async function runCli(args, stdinData) {
	const options = { timeout: EXEC_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 };
	if (stdinData) {
		options.input = stdinData;
	}

	try {
		const { stdout, stderr } = await execFileAsync(MEMVAULT_BIN, args, options);
		if (stderr) process.stderr.write(`memvault stderr: ${stderr}\n`);
		return stdout.trim();
	} catch (err) {
		if (err.code === "ENOENT") {
			throw new Error(
				`memvault binary not found at ${MEMVAULT_BIN}. Is Memvault installed?`,
			);
		}
		if (err.killed) {
			throw new Error(`Command timed out after ${EXEC_TIMEOUT_MS / 1000}s`);
		}
		// CLI may write error to stderr and exit non-zero
		const msg = err.stderr?.trim() || err.stdout?.trim() || err.message;
		throw new Error(msg);
	}
}

async function handleToolCall(name, args) {
	switch (name) {
		case "list_notes": {
			const cliArgs = ["notes", "list", "--json"];
			if (args.group_id) cliArgs.push("-g", args.group_id);
			const out = await runCli(cliArgs);
			return [{ type: "text", text: out }];
		}

		case "get_note": {
			const out = await runCli(["notes", "read", "--json", args.id]);
			return [{ type: "text", text: out }];
		}

		case "create_note": {
			const cliArgs = ["notes", "create", "--json", "-t", args.title];
			if (args.mode) cliArgs.push("-m", args.mode);
			cliArgs.push("--stdin");
			const out = await runCli(cliArgs, args.content);
			return [{ type: "text", text: out }];
		}

		case "update_note": {
			const cliArgs = ["notes", "update", "--json", args.id];
			if (args.title) cliArgs.push("-t", args.title);
			if (args.content) {
				cliArgs.push("--stdin");
				const out = await runCli(cliArgs, args.content);
				return [{ type: "text", text: out }];
			}
			const out = await runCli(cliArgs);
			return [{ type: "text", text: out }];
		}

		case "delete_note": {
			const out = await runCli(["notes", "delete", "--json", args.id]);
			return [{ type: "text", text: out }];
		}

		case "search": {
			const cliArgs = ["search", "--json", args.query];
			if (args.scope) cliArgs.push("--scope", args.scope);
			if (args.content) cliArgs.push("--content");
			if (args.limit) cliArgs.push("--limit", String(args.limit));
			const out = await runCli(cliArgs);
			return [{ type: "text", text: out }];
		}

		case "search_notes": {
			const cliArgs = ["search", "--json", "--scope", "notes", args.query];
			const out = await runCli(cliArgs);
			return [{ type: "text", text: out }];
		}

		case "list_groups": {
			const out = await runCli(["groups", "list", "--json"]);
			return [{ type: "text", text: out }];
		}

		case "list_projects": {
			const out = await runCli(["projects", "list", "--json"]);
			return [{ type: "text", text: out }];
		}

		case "add_project": {
			const out = await runCli(["projects", "add", "--json", args.path]);
			return [{ type: "text", text: out }];
		}

		case "list_files": {
			const out = await runCli(["files", "list", "--json", args.path]);
			return [{ type: "text", text: out }];
		}

		case "read_file": {
			const out = await runCli(["files", "read", "--json", args.path]);
			return [{ type: "text", text: out }];
		}

		case "write_file": {
			const cliArgs = ["files", "write", "--json", args.path, "--stdin"];
			const out = await runCli(cliArgs, args.content);
			return [{ type: "text", text: out }];
		}

		case "update_file": {
			const cliArgs = ["files", "update", "--json", args.path, "--stdin"];
			const out = await runCli(cliArgs, args.content);
			return [{ type: "text", text: out }];
		}

		default:
			throw new Error(`Tool "${name}" is not supported. Available tools: ${TOOL_DEFINITIONS.map((t) => t.name).join(", ")}`);
	}
}

async function main() {
	const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

	for await (const line of rl) {
		if (!line.trim()) continue;

		let msg;
		try {
			msg = JSON.parse(line);
		} catch {
			process.stderr.write(`bridge: malformed JSON: ${line.slice(0, 120)}\n`);
			continue;
		}

		const isRequest = msg.id !== undefined;

		switch (msg.method) {
			case "initialize":
				if (isRequest) {
					writeOut(
						makeResult(msg.id, {
							protocolVersion: "2025-06-18",
							capabilities: { tools: { listChanged: false } },
							serverInfo: SERVER_INFO,
						}),
					);
				}
				break;

			case "notifications/initialized":
				// No response needed for notifications
				break;

			case "tools/list":
				if (isRequest) {
					writeOut(makeResult(msg.id, { tools: TOOL_DEFINITIONS }));
				}
				break;

			case "tools/call":
				if (isRequest) {
					const { name, arguments: toolArgs } = msg.params || {};
					try {
						const content = await handleToolCall(name, toolArgs || {});
						writeOut(makeResult(msg.id, { content, isError: false }));
					} catch (err) {
						writeOut(
							makeResult(msg.id, {
								content: [{ type: "text", text: err.message }],
								isError: true,
							}),
						);
					}
				}
				break;

			case "ping":
				if (isRequest) {
					writeOut(makeResult(msg.id, {}));
				}
				break;

			default:
				if (isRequest) {
					writeOut(makeError(msg.id, -32601, `Method not found: ${msg.method}`));
				}
				break;
		}
	}
}

main().catch((err) => {
	process.stderr.write(`bridge fatal: ${err.message}\n`);
	process.exit(1);
});
