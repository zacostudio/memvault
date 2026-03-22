---
description: Verify memvault CLI connectivity
allowed-tools: ["Bash"]
---

# Memvault Setup

Verify that the memvault CLI binary is accessible and working.

## Steps

### 1. Check Binary Exists

```bash
ls -la /Applications/Memvault.app/Contents/MacOS/memvault
```

If not found, inform the user to install Memvault from [Releases](https://github.com/zacostudio/memvault/releases).

### 2. Test CLI

```bash
/Applications/Memvault.app/Contents/MacOS/memvault --version
```

### 3. Test Note Listing

```bash
/Applications/Memvault.app/Contents/MacOS/memvault notes list --json 2>&1 | head -5
```

### 4. Show Summary

Display:
- Binary path and version
- Whether CLI is working
- Number of notes found (if successful)
