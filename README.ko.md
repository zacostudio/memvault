# Memvault

[English](./README.md) | [日本語](./README.ja.md)

이 저장소는 [Memvault](https://github.com/zacostudio/memvault)의 릴리스 아티팩트와 Claude Code 플러그인을 호스팅합니다.

최신 버전은 [Releases](https://github.com/zacostudio/memvault/releases) 페이지에서 다운로드하세요.

## Claude Code 플러그인

**memvault-plugin**을 사용하면 Claude Code에서 memvault CLI를 통해 노트, 파일, 프로젝트를 직접 관리할 수 있습니다.

### 마켓플레이스를 통한 설치

Claude Code에서 다음 명령을 실행하세요:

```
/plugin marketplace add zacostudio/memvault
/plugin install memvault-plugin@memvault-marketplace
```

### 마켓플레이스 없이 설치

`.mcp.json`에 MCP 서버를 직접 추가하여 플러그인 없이 사용할 수도 있습니다:

**옵션 1: 프로젝트 수준** — 프로젝트 루트의 `.mcp.json`에 추가:

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

> 참고: 이 방법은 memvault CLI를 MCP 서버로 직접 등록합니다. 스킬과 슬래시 커맨드가 포함된 전체 플러그인을 사용하려면 위의 마켓플레이스 설치가 필요합니다.

**옵션 2: 전역** — `~/.claude/.mcp.json`에 추가하면 모든 프로젝트에서 사용 가능합니다.

자세한 내용은 [플러그인 문서](./docs/README.md)를 참고하세요.

### 작동 방식

플러그인은 memvault의 내장 **CLI 모드**를 사용하여 볼트와 상호작용합니다. MCP 도구를 호출하면 플러그인이 이를 CLI 명령(예: `memvault notes list --json`)으로 변환하여 결과를 반환합니다. 별도의 서버나 네트워크 연결이 필요 없습니다 — memvault 바이너리와 직접 통신합니다.

**필수 조건:** Memvault가 `/Applications/Memvault.app`에 설치되어 있어야 합니다.

### 사용 가능한 MCP 도구

#### 노트 작업

| 도구 | 설명 | 필수 매개변수 |
|------|------|---------------|
| `create_note` | 마크다운, 캔버스 또는 코드 노트 생성 | `title`, `content` |
| `get_note` | 노트 전체 내용 및 메타데이터 조회 | `id` |
| `update_note` | 기존 노트의 제목/내용 수정 | `id` |
| `delete_note` | 노트 및 콘텐츠 파일 영구 삭제 | `id` |
| `list_notes` | 그룹별 필터링이 가능한 노트 목록 | _(없음)_ |

#### 검색

| 도구 | 설명 | 필수 매개변수 |
|------|------|---------------|
| `search` | 노트, 링크, 할일, 파일, 프로젝트를 통합 검색 | `query` |
| `search_notes` | 노트 제목으로 검색 (search의 scope=notes 단축키) | `query` |

`search` 도구의 선택적 매개변수: `scope` (notes/links/todos/files/projects), `content` (내용 검색), `limit` (최대 결과 수).

#### 그룹 및 프로젝트 작업

| 도구 | 설명 | 필수 매개변수 |
|------|------|---------------|
| `list_groups` | 모든 그룹의 ID, 이름, 색상, 아이콘, 상위 그룹 조회 | _(없음)_ |
| `list_projects` | 등록된 프로젝트 목록 | _(없음)_ |
| `add_project` | 프로젝트 디렉토리를 memvault에 등록 | `path` |

#### 파일 작업

| 도구 | 설명 | 필수 매개변수 |
|------|------|---------------|
| `list_files` | 등록된 프로젝트 디렉토리의 파일 목록 | `path` |
| `read_file` | 등록된 프로젝트의 파일 내용 읽기 | `path` |
| `write_file` | 등록된 프로젝트에 새 파일 생성 | `path`, `content` |
| `update_file` | 등록된 프로젝트의 기존 파일 덮어쓰기 | `path`, `content` |

#### 노트 모드

노트 생성 시 `mode` 매개변수를 지정할 수 있습니다:

- **`markdown`** (기본값) — 마크다운 서식의 리치 텍스트
- **`canvas`** — 캔버스 스타일 노트
- **`code`** — 구문 강조가 적용된 코드 스니펫

### 슬래시 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/memvault-save` | 노트를 빠르게 저장 (모드 선택 가능) |
| `/memvault-search` | 키워드로 노트 검색 및 결과 표시 |
| `/memvault-list` | 노트 또는 그룹 목록 표시 (필터링 가능) |

### 사용 예시

```
"memvault에 '회의록'이라는 노트를 만들어줘"
"내 볼트에서 'API 설계' 검색해줘"
"Projects 그룹의 모든 노트를 보여줘"
"이 내용을 memvault에 저장해줘"
"이 프로젝트를 memvault에 등록해줘"
"프로젝트 디렉토리의 파일 목록을 보여줘"
```
