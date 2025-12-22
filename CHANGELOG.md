# Changelog

All notable changes to the LightRAG MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-23

### Added

#### Core Features
- Complete MCP server implementation for LightRAG
- 30+ tools for comprehensive LightRAG integration
- Support for Python 3.10+ with full type hints
- Async/await architecture for optimal performance

#### Document Management (10 tools)
- `insert_text` - Insert single text document
- `insert_texts` - Batch insert multiple documents
- `upload_document` - Upload single file with custom chunking
- `upload_documents` - Batch upload multiple files
- `scan_documents` - Scan input directory for new documents
- `get_documents` - Retrieve all documents
- `get_documents_paginated` - Get documents with pagination
- `delete_document` - Delete specific document
- `clear_documents` - Clear all documents
- `document_status` - Get document processing status

#### Query Tools (3 tools)
- `query_text` - Query with multiple modes (naive, local, global, hybrid, mix)
- `query_text_stream` - Stream query results in real-time
- `query_with_citation` - Query with source attribution

#### Knowledge Graph Tools (8 tools)
- `get_knowledge_graph` - Retrieve complete knowledge graph
- `get_graph_structure` - Get graph structure and statistics
- `get_entities` - Get all entities with optional limit
- `get_relations` - Get all relationships with optional limit
- `check_entity_exists` - Check entity existence
- `update_entity` - Update entity properties
- `delete_entity` - Delete entity from graph
- `delete_relation` - Delete relationship from graph

#### System Management Tools (5 tools)
- `get_health` - Check server health and status
- `get_status` - Get detailed system statistics
- `clear_cache` - Clear caches (all, llm, embedding, query)
- `get_config` - Get current server configuration
- `get_workspace_info` - Get workspace information

#### Documentation
- Comprehensive README with setup instructions
- API Reference with all endpoints documented
- Usage Examples covering 15+ real-world scenarios
- Tools Summary quick reference guide
- Contributing guidelines
- MIT License

#### Configuration
- Environment variable support for all settings
- Workspace isolation for multi-tenant use
- API key authentication support
- Configurable LightRAG server URL

#### Development
- Full Python package structure with pyproject.toml
- Type hints throughout codebase
- Async HTTP client with proper error handling
- Modular architecture for easy extension

### Security
- API key authentication support
- Secure environment variable handling
- No hardcoded credentials

### Documentation
- Complete README with installation and usage
- API reference documentation
- Comprehensive examples
- Tools summary and quick reference
- Contributing guidelines

## [Unreleased]

### Planned Features
- TypeScript/Node.js implementation
- Additional query modes
- Batch operations optimization
- Enhanced error handling
- Metrics and monitoring tools
- Integration tests
- Performance benchmarks

## Version History

### Legend
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to contribute to this project.

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/lightrag-mcp-server/issues
- LightRAG Discord: https://discord.gg/yF2MmDJyGJ

## Acknowledgments

- **Author & Creator**: Lalit Suryan
- Built on [LightRAG](https://github.com/HKUDS/LightRAG) by HKUDS
- Powered by [Model Context Protocol](https://github.com/modelcontextprotocol)
- Inspired by the MCP community
