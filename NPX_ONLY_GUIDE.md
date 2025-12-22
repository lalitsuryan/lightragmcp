# ✅ Final Configuration - npx Only

**Package**: @g99/lightrag-mcp-server  
**Author**: Lalit Suryan  
**Installation**: npx only (no PyPI/uvx)

---

## 🚀 How to Use

### Quick Start
```bash
npx @g99/lightrag-mcp-server
```

### Global Installation
```bash
npm install -g @g99/lightrag-mcp-server
lightrag-mcp-server
```

---

## 🔧 MCP Configuration

### Claude Desktop

File: `claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lightrag": {
      "command": "npx",
      "args": ["@g99/lightrag-mcp-server"],
      "env": {
        "LIGHTRAG_SERVER_URL": "http://localhost:9621",
        "LIGHTRAG_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Cline (VS Code)

```json
{
  "mcpServers": {
    "lightrag": {
      "command": "npx",
      "args": ["@g99/lightrag-mcp-server"],
      "env": {
        "LIGHTRAG_SERVER_URL": "http://localhost:9621"
      }
    }
  }
}
```

---

## 📦 Package Info

- **npm**: https://www.npmjs.com/package/@g99/lightrag-mcp-server
- **GitHub**: https://github.com/lalitsuryan/lightragmcp
- **Version**: 1.0.0
- **License**: MIT

---

## ✅ What's Published

- ✅ **npm** - @g99/lightrag-mcp-server
- ✅ **GitHub** - lalitsuryan/lightragmcp
- ❌ **PyPI** - Not published (npx only)

---

## 📝 Updated Documentation

All references to `uvx` and `pip install` have been removed from:
- ✅ README.md
- ✅ Installation section
- ✅ MCP configuration examples

The package is **npm-only** and uses **npx** for execution.

---

**Users install with:**
```bash
npx @g99/lightrag-mcp-server
```

Simple and clean! 🎯
