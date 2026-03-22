# Memvault

[English](./README.md) | [한국어](./README.ko.md)

このリポジトリは [Memvault](https://github.com/zacostudio/memvault) のリリースアーティファクトと Claude Code プラグインをホストしています。

最新バージョンは [Releases](https://github.com/zacostudio/memvault/releases) ページからダウンロードしてください。

## Claude Code プラグイン

**memvault-plugin** を使用すると、Claude Code から memvault CLI を通じてノート、ファイル、プロジェクトを直接管理できます。

### マーケットプレイスからのインストール

Claude Code で以下のコマンドを実行してください:

```
/plugin marketplace add zacostudio/memvault
/plugin install memvault-plugin@memvault-marketplace
```

### マーケットプレイスなしでインストール

`.mcp.json` に MCP サーバーを直接追加して、プラグインなしで使用することもできます:

**オプション 1: プロジェクトレベル** — プロジェクトルートの `.mcp.json` に追加:

```json
{
  "mcpServers": {
    "memvault": {
      "command": "/Applications/Memvault.app/Contents/MacOS/memvault",
      "args": ["--json"]
    }
  }
}
```

> 注: これは memvault CLI を MCP サーバーとして直接登録します。スキルやスラッシュコマンドを含む完全なプラグインを使用するには、上記のマーケットプレイスインストールが必要です。

**オプション 2: グローバル** — `~/.claude/.mcp.json` に追加すると、全プロジェクトで使用可能です。

詳細は [プラグインドキュメント](./docs/README.md) を参照してください。

### 仕組み

プラグインは memvault の組み込み **CLI モード** を使用してボルトと対話します。MCP ツールを呼び出すと、プラグインがそれを CLI コマンド（例: `memvault notes list --json`）に変換して結果を返します。サーバーやネットワーク接続は不要です — memvault バイナリと直接通信します。

**必要条件:** Memvault が `/Applications/Memvault.app` にインストールされている必要があります。

### 利用可能な MCP ツール

#### ノート操作

| ツール | 説明 | 必須パラメータ |
|--------|------|----------------|
| `create_note` | マークダウン、キャンバス、またはコードのノートを作成 | `title`, `content` |
| `get_note` | ノートの全内容とメタデータを取得 | `id` |
| `update_note` | 既存のノートのタイトル/内容を更新 | `id` |
| `delete_note` | ノートとコンテンツファイルを完全に削除 | `id` |
| `list_notes` | グループフィルタリング付きのノート一覧 | _(なし)_ |

#### 検索

| ツール | 説明 | 必須パラメータ |
|--------|------|----------------|
| `search` | ノート、リンク、Todo、ファイル、プロジェクトを統合検索 | `query` |
| `search_notes` | ノートタイトルで検索 (search の scope=notes ショートカット) | `query` |

`search` ツールのオプションパラメータ: `scope` (notes/links/todos/files/projects)、`content` (内容検索)、`limit` (最大結果数)。

#### グループ・プロジェクト操作

| ツール | 説明 | 必須パラメータ |
|--------|------|----------------|
| `list_groups` | 全グループの ID、名前、色、アイコン、親を取得 | _(なし)_ |
| `list_projects` | 登録済みプロジェクト一覧 | _(なし)_ |
| `add_project` | プロジェクトディレクトリを memvault に登録 | `path` |

#### ファイル操作

| ツール | 説明 | 必須パラメータ |
|--------|------|----------------|
| `list_files` | 登録済みプロジェクトディレクトリのファイル一覧 | `path` |
| `read_file` | 登録済みプロジェクトのファイル内容を読む | `path` |
| `write_file` | 登録済みプロジェクトに新しいファイルを作成 | `path`, `content` |
| `update_file` | 登録済みプロジェクトの既存ファイルを上書き | `path`, `content` |

#### ノートモード

ノート作成時に `mode` パラメータを指定できます:

- **`markdown`** (デフォルト) — マークダウン書式のリッチテキスト
- **`canvas`** — キャンバススタイルのノート
- **`code`** — シンタックスハイライト付きのコードスニペット

### スラッシュコマンド

| コマンド | 説明 |
|----------|------|
| `/memvault-save` | ノートをすばやく保存 (モード選択可能) |
| `/memvault-search` | キーワードでノートを検索して結果を表示 |
| `/memvault-list` | ノートまたはグループの一覧を表示 (フィルタリング可能) |

### 使用例

```
"memvault に '議事録' というノートを作って"
"ボルト全体で 'API 設計' を検索して"
"Projects グループの全ノートを見せて"
"これを memvault に保存して"
"このプロジェクトを memvault に登録して"
"プロジェクトディレクトリのファイル一覧を見せて"
```
