# Tools Summary

Quick reference guide for all LightRAG MCP Server tools.

## Document Management (10 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `insert_text` | Insert single text document | text, description |
| `insert_texts` | Insert multiple documents | texts[] |
| `upload_document` | Upload a file | file_path, chunk_size |
| `upload_documents` | Upload multiple files | file_paths[] |
| `scan_documents` | Scan input directory | None |
| `get_documents` | Get all documents | None |
| `get_documents_paginated` | Get documents with pagination | page, page_size |
| `delete_document` | Delete specific document | document_id |
| `clear_documents` | Clear all documents | None |
| `document_status` | Get processing status | document_id (optional) |

## Query Tools (3 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `query_text` | Query with text | query, mode, top_k |
| `query_text_stream` | Stream query results | query, mode |
| `query_with_citation` | Query with citations | query, mode |

**Query Modes:** naive, local, global, hybrid, mix

## Knowledge Graph Tools (8 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get_knowledge_graph` | Get complete KG | None |
| `get_graph_structure` | Get KG structure/stats | None |
| `get_entities` | Get all entities | limit (optional) |
| `get_relations` | Get all relations | limit (optional) |
| `check_entity_exists` | Check entity exists | entity_name |
| `update_entity` | Update entity properties | entity_id, properties |
| `delete_entity` | Delete entity | entity_id |
| `delete_relation` | Delete relation | relation_id |

## System Management (5 tools)

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `get_health` | Check server health | None |
| `get_status` | Get system status | None |
| `clear_cache` | Clear cache | cache_type |
| `get_config` | Get configuration | None |
| `get_workspace_info` | Get workspace info | None |

**Cache Types:** all, llm, embedding, query

## Quick Start Commands

### Basic Usage
```bash
# Check health
get_health

# Insert document
insert_text {"text": "Your content"}

# Query
query_text {"query": "Your question", "mode": "hybrid"}
```

### Common Workflows

**Index and Query:**
```
1. upload_documents
2. document_status
3. query_text
```

**Knowledge Graph Analysis:**
```
1. get_graph_structure
2. get_entities
3. get_relations
```

**System Monitoring:**
```
1. get_health
2. get_status
3. get_config
```

## Tool Categories by Use Case

### Data Ingestion
- insert_text
- insert_texts
- upload_document
- upload_documents
- scan_documents

### Information Retrieval
- query_text
- query_text_stream
- query_with_citation

### Knowledge Management
- get_knowledge_graph
- get_entities
- get_relations
- check_entity_exists
- update_entity

### Content Management
- get_documents
- get_documents_paginated
- delete_document
- clear_documents
- document_status

### System Administration
- get_health
- get_status
- clear_cache
- get_config
- get_workspace_info

### Graph Manipulation
- delete_entity
- delete_relation
- update_entity

## Parameter Quick Reference

### Common Parameters

- **query** (string): Search query text
- **mode** (string): Query mode (naive|local|global|hybrid|mix)
- **file_path** (string): Path to document file
- **document_id** (string): Unique document identifier
- **entity_id** (string): Unique entity identifier
- **limit** (integer): Maximum results to return
- **page** (integer): Page number (1-based)
- **page_size** (integer): Results per page
- **top_k** (integer): Number of top results

### Optional Parameters

- **description** (string): Document description
- **metadata** (object): Additional metadata
- **chunk_size** (integer): Document chunk size
- **chunk_overlap** (integer): Chunk overlap size
- **only_need_context** (boolean): Return context only
- **max_tokens** (integer): Maximum response tokens
- **cache_type** (string): Type of cache to clear

## Response Formats

All tools return JSON responses with:

```json
{
  "status": "success|error",
  "data": {...},
  "message": "Description",
  "metadata": {...}
}
```

## Error Codes

- `CONNECTION_ERROR`: Cannot connect to server
- `AUTH_ERROR`: Authentication failed
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid parameters
- `SERVER_ERROR`: Internal server error

## Performance Tips

1. **Batch Operations**: Use `insert_texts` and `upload_documents` for multiple items
2. **Pagination**: Use `get_documents_paginated` for large datasets
3. **Top K**: Set appropriate `top_k` values (default: 60)
4. **Cache Management**: Clear cache periodically
5. **Query Mode**: Use `hybrid` for best general results

## Best Practices

### For Document Management
- Use batch operations for efficiency
- Monitor document status after uploads
- Use pagination for large document sets

### For Querying
- Start with `hybrid` mode
- Adjust `top_k` based on needs
- Use streaming for long responses

### For Knowledge Graph
- Check entity exists before operations
- Use limits to avoid overwhelming responses
- Update entities to improve accuracy

### For System Management
- Regular health checks
- Monitor status for resource usage
- Clear cache when needed
