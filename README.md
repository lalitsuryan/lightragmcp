# LightRAG MCP Server

A comprehensive Model Context Protocol (MCP) server for LightRAG - Simple and Fast Retrieval-Augmented Generation. This server enables AI assistants to interact with LightRAG's powerful knowledge graph and RAG capabilities.

## Overview

LightRAG MCP Server provides complete integration with LightRAG's API, offering 30+ tools for document management, knowledge graph operations, querying, and system management. Build sophisticated RAG applications with knowledge graph capabilities through a simple MCP interface.

## Features

- **Complete LightRAG API Coverage**: Access all major LightRAG endpoints
- **30+ Tools**: Comprehensive toolset for RAG operations
- **Knowledge Graph Operations**: Full control over entities and relationships
- **Multiple Query Modes**: Support for naive, local, global, hybrid, and mix modes
- **Document Management**: Insert, upload, scan, and manage documents
- **Streaming Support**: Real-time streaming responses for queries
- **Easy Installation**: Install via uvx or npx
- **Dual Language Support**: Both Python and TypeScript implementations

## Installation

### Quick Start (Recommended)

```bash
npx @g99/lightrag-mcp-server
```

### Global Installation

```bash
npm install -g @g99/lightrag-mcp-server
```

### From Source

```bash
git clone https://github.com/lalitsuryan/lightragmcp.git
cd lightragmcp
npm install
```

## Prerequisites

You need a running LightRAG server instance. Install and start LightRAG:

```bash
# Install LightRAG
pip install "lightrag-hku[api]"

# Create .env file with your LLM and embedding configurations
cp env.example .env

# Start LightRAG server (default: http://localhost:9621)
lightrag-server
```

For detailed LightRAG server setup, visit [LightRAG GitHub](https://github.com/HKUDS/LightRAG).

## Configuration

### Environment Variables

Create a `.env` file or set the following environment variables:

```env
# Required: Your LightRAG server URL
LIGHTRAG_SERVER_URL=http://localhost:9621

# Optional: Authentication token if your LightRAG server requires it
LIGHTRAG_API_KEY=your_api_key_here

# Optional: Custom workspace name for data isolation
LIGHTRAG_WORKSPACE=default
```

### Getting Your API Key

If your LightRAG server has authentication enabled:

1. Check your LightRAG server's `.env` file for `LIGHTRAG_API_KEY`
2. Alternatively, check the startup logs for the API key
3. Use that key in your MCP configuration

## MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

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

### Cline (VS Code Extension)

Add to your MCP settings:

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

## Available Tools

### Document Management Tools (10 tools)

#### insert_text
Insert a single text document into LightRAG.

**Parameters:**
- `text` (required): Text content to insert
- `description` (optional): Description of the text

**Example:**
```json
{
  "text": "LightRAG is a powerful retrieval-augmented generation system that uses knowledge graphs.",
  "description": "Introduction to LightRAG"
}
```

#### insert_texts
Insert multiple text documents into LightRAG in batch.

**Parameters:**
- `texts` (required): Array of text documents with optional metadata

**Example:**
```json
{
  "texts": [
    {
      "content": "LightRAG uses knowledge graphs for enhanced retrieval.",
      "title": "LightRAG Overview",
      "metadata": {"category": "documentation"}
    },
    {
      "content": "Knowledge graphs connect entities and relationships.",
      "title": "Knowledge Graphs"
    }
  ]
}
```

#### upload_document
Upload a document file to LightRAG.

**Parameters:**
- `file_path` (required): Path to the file to upload
- `chunk_size` (optional): Custom chunk size for document splitting
- `chunk_overlap` (optional): Overlap size between chunks

**Example:**
```json
{
  "file_path": "/path/to/document.pdf",
  "chunk_size": 1200,
  "chunk_overlap": 100
}
```

#### upload_documents
Upload multiple documents in batch.

**Parameters:**
- `file_paths` (required): Array of file paths to upload

**Example:**
```json
{
  "file_paths": [
    "/path/to/doc1.pdf",
    "/path/to/doc2.txt",
    "/path/to/doc3.docx"
  ]
}
```

#### scan_documents
Scan for new documents in the configured input directory.

**Parameters:** None

**Example:**
```json
{}
```

#### get_documents
Retrieve all documents from LightRAG.

**Parameters:** None

**Example:**
```json
{}
```

#### get_documents_paginated
Retrieve documents with pagination support.

**Parameters:**
- `page` (required): Page number (1-based)
- `page_size` (required): Number of documents per page (1-100)

**Example:**
```json
{
  "page": 1,
  "page_size": 20
}
```

#### delete_document
Delete a specific document by ID.

**Parameters:**
- `document_id` (required): ID of the document to delete

**Example:**
```json
{
  "document_id": "doc_12345"
}
```

#### clear_documents
Clear all documents from LightRAG.

**Parameters:** None

**Example:**
```json
{}
```

#### document_status
Get processing status for documents.

**Parameters:**
- `document_id` (optional): Specific document ID to check

**Example:**
```json
{
  "document_id": "doc_12345"
}
```

### Query Tools (3 tools)

#### query_text
Query LightRAG with text using various retrieval modes.

**Parameters:**
- `query` (required): Query text
- `mode` (optional): Query mode - "naive", "local", "global", "hybrid", or "mix" (default: "hybrid")
- `only_need_context` (optional): Return only context without generation (default: false)
- `top_k` (optional): Number of top results to retrieve (default: 60)
- `max_tokens` (optional): Maximum tokens in response

**Example:**
```json
{
  "query": "What are the main concepts in machine learning?",
  "mode": "hybrid",
  "top_k": 20
}
```

#### query_text_stream
Stream query results from LightRAG in real-time.

**Parameters:**
- `query` (required): Query text
- `mode` (optional): Query mode (default: "hybrid")
- `only_need_context` (optional): Return only context (default: false)

**Example:**
```json
{
  "query": "Explain the evolution of artificial intelligence",
  "mode": "global"
}
```

#### query_with_citation
Query LightRAG and get results with source citations.

**Parameters:**
- `query` (required): Query text
- `mode` (optional): Query mode (default: "hybrid")

**Example:**
```json
{
  "query": "What is retrieval-augmented generation?",
  "mode": "hybrid"
}
```

### Knowledge Graph Tools (8 tools)

#### get_knowledge_graph
Retrieve the complete knowledge graph from LightRAG.

**Parameters:** None

**Example:**
```json
{}
```

#### get_graph_structure
Get the structure and statistics of the knowledge graph.

**Parameters:** None

**Example:**
```json
{}
```

#### get_entities
Retrieve all entities from the knowledge graph.

**Parameters:**
- `limit` (optional): Maximum number of entities to retrieve

**Example:**
```json
{
  "limit": 100
}
```

#### get_relations
Retrieve all relationships from the knowledge graph.

**Parameters:**
- `limit` (optional): Maximum number of relations to retrieve

**Example:**
```json
{
  "limit": 100
}
```

#### check_entity_exists
Check if an entity exists in the knowledge graph.

**Parameters:**
- `entity_name` (required): Name of the entity to check

**Example:**
```json
{
  "entity_name": "Machine Learning"
}
```

#### update_entity
Update properties of an entity in the knowledge graph.

**Parameters:**
- `entity_id` (required): ID of the entity to update
- `properties` (required): Properties to update

**Example:**
```json
{
  "entity_id": "entity_123",
  "properties": {
    "description": "Updated description",
    "category": "AI Technology"
  }
}
```

#### delete_entity
Delete an entity from the knowledge graph.

**Parameters:**
- `entity_id` (required): ID of the entity to delete

**Example:**
```json
{
  "entity_id": "entity_789"
}
```

#### delete_relation
Delete a relationship from the knowledge graph.

**Parameters:**
- `relation_id` (required): ID of the relation to delete

**Example:**
```json
{
  "relation_id": "rel_456"
}
```

### System Management Tools (5 tools)

#### get_health
Check LightRAG server health and status.

**Parameters:** None

**Example:**
```json
{}
```

#### get_status
Get detailed system status and statistics.

**Parameters:** None

**Example:**
```json
{}
```

#### clear_cache
Clear LightRAG's internal cache.

**Parameters:**
- `cache_type` (optional): Type of cache to clear (default: "all")

**Example:**
```json
{
  "cache_type": "llm"
}
```

#### get_config
Get current LightRAG server configuration.

**Parameters:** None

**Example:**
```json
{}
```

#### get_workspace_info
Get information about the current workspace.

**Parameters:** None

**Example:**
```json
{}
```

## Usage Examples

### Example 1: Index and Query Documents

```typescript
// Insert documents
await use_mcp_tool("lightrag", "insert_texts", {
  texts: [
    {
      content: "LightRAG is an advanced RAG system with knowledge graph capabilities.",
      title: "LightRAG Introduction"
    },
    {
      content: "Knowledge graphs enhance retrieval by capturing entity relationships.",
      title: "Knowledge Graphs"
    }
  ]
});

// Query the indexed content
await use_mcp_tool("lightrag", "query_text", {
  query: "How does LightRAG use knowledge graphs?",
  mode: "hybrid"
});
```

### Example 2: Upload and Process Documents

```typescript
// Upload a PDF document
await use_mcp_tool("lightrag", "upload_document", {
  file_path: "/path/to/research-paper.pdf"
});

// Check document status
await use_mcp_tool("lightrag", "document_status", {
  document_id: "doc_12345"
});

// Query the document
await use_mcp_tool("lightrag", "query_text", {
  query: "What are the key findings in the research?",
  mode: "local"
});
```

### Example 3: Work with Knowledge Graph

```typescript
// Get knowledge graph structure
await use_mcp_tool("lightrag", "get_graph_structure", {});

// Check if entity exists
await use_mcp_tool("lightrag", "check_entity_exists", {
  entity_name: "Artificial Intelligence"
});

// Get all entities
await use_mcp_tool("lightrag", "get_entities", {
  limit: 50
});

// Update an entity
await use_mcp_tool("lightrag", "update_entity", {
  entity_id: "entity_123",
  properties: {
    description: "A comprehensive field of computer science",
    category: "Technology"
  }
});
```

### Example 4: Advanced Query with Citation

```typescript
// Query with source citations
await use_mcp_tool("lightrag", "query_with_citation", {
  query: "Explain the benefits of RAG systems",
  mode: "hybrid"
});
```

## Query Modes Explained

LightRAG supports multiple query modes for different use cases:

- **naive**: Simple vector similarity search without knowledge graph
- **local**: Focus on local context and nearby entities
- **global**: Use global knowledge graph understanding
- **hybrid**: Combine local and global retrieval (recommended)
- **mix**: Advanced mode mixing knowledge graph and vector retrieval

## Development

### Prerequisites

- Python 3.10 or higher (for Python implementation)
- Node.js 18 or higher (for TypeScript implementation)
- Running LightRAG server instance

### Setup for Development

```bash
# Clone the repository
git clone https://github.com/lalitsuryan/lightragmcp.git
cd lightragmcp

# For Python development
pip install -e ".[dev]"

# For TypeScript development
npm install
npm run build
```

### Running Tests

```bash
# Python tests
pytest tests/

# TypeScript tests
npm test
```

## API Reference

This MCP server implements the LightRAG API. For detailed API documentation, visit:

- Official Documentation: [LightRAG GitHub](https://github.com/HKUDS/LightRAG)
- API Documentation: [LightRAG API Docs](https://github.com/HKUDS/LightRAG/tree/main/lightrag/api)

## Requirements

- **LightRAG Server**: Running instance of LightRAG (version 1.4.9+)
- **Python**: Version 3.10 or higher (for Python MCP)
- **Node.js**: Version 18.0.0 or higher (for TypeScript MCP)
- **MCP Client**: Compatible MCP client (Claude Desktop, Cline, etc.)

## Architecture

The LightRAG MCP Server is built with:

- **Python MCP**: Using the MCP SDK for Python
- **TypeScript MCP**: Using the @modelcontextprotocol/sdk
- **REST API Client**: HTTP client for LightRAG server communication
- **Error Handling**: Comprehensive error handling and validation
- **Type Safety**: Full typing support in both implementations

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive credentials
3. **Run LightRAG server** on localhost or secure network
4. **Enable authentication** on LightRAG server for production
5. **Monitor API usage** through server logs

## Troubleshooting

### Error: Cannot connect to LightRAG server

Verify that:
1. Your LightRAG server is running (`lightrag-server`)
2. The server URL is correct (default: `http://localhost:9621`)
3. No firewall is blocking the connection

### Error: Authentication failed

Verify that:
1. Your API key matches the LightRAG server configuration
2. Authentication is properly configured in both server and client
3. The API key is correctly set in environment variables

### Error: Tool not found

Ensure you're using the correct tool name. All available tools are listed in the documentation above.

### Error: Document upload failed

Check that:
1. The file path is correct and accessible
2. The file format is supported (PDF, TXT, DOCX, etc.)
3. You have sufficient permissions to read the file

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/lalitsuryan/lightragmcp/issues)
- **Documentation**: [GitHub README](https://github.com/lalitsuryan/lightragmcp#readme)
- **LightRAG Support**: [LightRAG GitHub](https://github.com/HKUDS/LightRAG)
- **Discord**: [LightRAG Discord Community](https://discord.gg/yF2MmDJyGJ)

## Acknowledgments

- **Author**: [Lalit Suryan](https://github.com/lalitsuryan) - Creator and maintainer
- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Powered by [LightRAG](https://github.com/HKUDS/LightRAG)
- Inspired by the MCP community

## Changelog

### Version 1.0.0 (Initial Release)

- Complete LightRAG API integration
- 30+ management tools
- Support for all query modes
- Knowledge graph operations
- Document management
- Streaming support
- Full TypeScript and Python support
- Comprehensive documentation
- UVX and NPX installation support

## Related Projects

- [LightRAG](https://github.com/HKUDS/LightRAG) - The core LightRAG library
- [MiniRAG](https://github.com/HKUDS/MiniRAG) - RAG with small models
- [VideoRAG](https://github.com/HKUDS/VideoRAG) - RAG for long-context videos
- [RAG-Anything](https://github.com/HKUDS/RAG-Anything) - All-in-One Multimodal RAG

Made with ❤️ by **Lalit Suryan** for the LightRAG and MCP communities
