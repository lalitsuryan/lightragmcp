# Usage Examples

Comprehensive examples of using LightRAG MCP Server.

## Example 1: Basic Document Indexing and Querying

Index documents and perform queries:

```python
# Insert a single document
await use_mcp_tool("lightrag", "insert_text", {
    "text": "LightRAG is an advanced RAG system that uses knowledge graphs to enhance retrieval accuracy.",
    "description": "LightRAG Introduction"
})

# Query the document
result = await use_mcp_tool("lightrag", "query_text", {
    "query": "What is LightRAG?",
    "mode": "hybrid"
})
```

## Example 2: Batch Document Upload

Upload multiple documents efficiently:

```python
# Upload multiple PDF files
await use_mcp_tool("lightrag", "upload_documents", {
    "file_paths": [
        "/docs/research-paper-1.pdf",
        "/docs/research-paper-2.pdf",
        "/docs/technical-manual.pdf"
    ]
})

# Check processing status
status = await use_mcp_tool("lightrag", "document_status", {})
```

## Example 3: Working with Knowledge Graph

Explore and manipulate the knowledge graph:

```python
# Get graph structure
structure = await use_mcp_tool("lightrag", "get_graph_structure", {})

# Get all entities
entities = await use_mcp_tool("lightrag", "get_entities", {
    "limit": 100
})

# Check if specific entity exists
exists = await use_mcp_tool("lightrag", "check_entity_exists", {
    "entity_name": "Machine Learning"
})

# Update entity properties
await use_mcp_tool("lightrag", "update_entity", {
    "entity_id": "entity_123",
    "properties": {
        "description": "A field of AI focused on learning from data",
        "category": "Technology",
        "importance": "high"
    }
})
```

## Example 4: Advanced Querying

Use different query modes for various scenarios:

```python
# Naive mode - simple vector search
naive_result = await use_mcp_tool("lightrag", "query_text", {
    "query": "Explain neural networks",
    "mode": "naive"
})

# Local mode - focus on local context
local_result = await use_mcp_tool("lightrag", "query_text", {
    "query": "What are the components of a transformer?",
    "mode": "local",
    "top_k": 20
})

# Global mode - use global knowledge
global_result = await use_mcp_tool("lightrag", "query_text", {
    "query": "What are the major trends in AI?",
    "mode": "global"
})

# Hybrid mode - combine local and global (recommended)
hybrid_result = await use_mcp_tool("lightrag", "query_text", {
    "query": "How does attention mechanism work?",
    "mode": "hybrid"
})

# Mix mode - advanced mixing of KG and vector retrieval
mix_result = await use_mcp_tool("lightrag", "query_text", {
    "query": "Compare different embedding models",
    "mode": "mix"
})
```

## Example 5: Streaming Queries

Get real-time streaming responses:

```python
# Stream query results
stream_result = await use_mcp_tool("lightrag", "query_text_stream", {
    "query": "Provide a comprehensive overview of retrieval-augmented generation",
    "mode": "hybrid"
})
```

## Example 6: Query with Citations

Get responses with source attribution:

```python
# Query with citations
result = await use_mcp_tool("lightrag", "query_with_citation", {
    "query": "What are the benefits of using knowledge graphs in RAG?",
    "mode": "hybrid"
})

# Result includes citations:
# {
#     "response": "Knowledge graphs enhance RAG by...",
#     "citations": [
#         {"source": "doc_1", "relevance": 0.95},
#         {"source": "doc_5", "relevance": 0.87}
#     ]
# }
```

## Example 7: Document Management Workflow

Complete workflow for managing documents:

```python
# 1. Insert multiple documents
await use_mcp_tool("lightrag", "insert_texts", {
    "texts": [
        {
            "content": "RAG systems combine retrieval with generation...",
            "title": "RAG Overview",
            "metadata": {"category": "concepts", "difficulty": "beginner"}
        },
        {
            "content": "Knowledge graphs represent entities and their relationships...",
            "title": "Knowledge Graphs Explained",
            "metadata": {"category": "concepts", "difficulty": "intermediate"}
        }
    ]
})

# 2. Get all documents
docs = await use_mcp_tool("lightrag", "get_documents", {})

# 3. Get documents with pagination
page1 = await use_mcp_tool("lightrag", "get_documents_paginated", {
    "page": 1,
    "page_size": 10
})

# 4. Delete specific document
await use_mcp_tool("lightrag", "delete_document", {
    "document_id": "doc_12345"
})

# 5. Clear all documents (use with caution!)
# await use_mcp_tool("lightrag", "clear_documents", {})
```

## Example 8: Knowledge Graph Manipulation

Advanced knowledge graph operations:

```python
# Get complete knowledge graph
kg = await use_mcp_tool("lightrag", "get_knowledge_graph", {})

# Get all relations
relations = await use_mcp_tool("lightrag", "get_relations", {
    "limit": 50
})

# Delete a specific entity
await use_mcp_tool("lightrag", "delete_entity", {
    "entity_id": "entity_789"
})

# Delete a specific relation
await use_mcp_tool("lightrag", "delete_relation", {
    "relation_id": "rel_456"
})
```

## Example 9: System Monitoring

Monitor and manage the system:

```python
# Check system health
health = await use_mcp_tool("lightrag", "get_health", {})

# Get detailed status
status = await use_mcp_tool("lightrag", "get_status", {})

# Get current configuration
config = await use_mcp_tool("lightrag", "get_config", {})

# Get workspace information
workspace = await use_mcp_tool("lightrag", "get_workspace_info", {})

# Clear cache to free memory
await use_mcp_tool("lightrag", "clear_cache", {
    "cache_type": "llm"
})
```

## Example 10: Multi-Workspace Usage

Work with multiple workspaces:

```python
# Configure client to use specific workspace
# Set LIGHTRAG_WORKSPACE environment variable before starting

# Workspace A operations
# LIGHTRAG_WORKSPACE=project_a
await use_mcp_tool("lightrag", "insert_text", {
    "text": "Project A data..."
})

# Workspace B operations
# LIGHTRAG_WORKSPACE=project_b
await use_mcp_tool("lightrag", "insert_text", {
    "text": "Project B data..."
})

# Get workspace info
workspace_info = await use_mcp_tool("lightrag", "get_workspace_info", {})
```

## Example 11: Research Paper Analysis

Analyze research papers:

```python
# Upload research papers
await use_mcp_tool("lightrag", "upload_documents", {
    "file_paths": [
        "/papers/attention-is-all-you-need.pdf",
        "/papers/bert-paper.pdf",
        "/papers/gpt-3-paper.pdf"
    ]
})

# Wait for processing
import time
time.sleep(10)

# Query for insights
insights = await use_mcp_tool("lightrag", "query_text", {
    "query": "Compare the architectural innovations in these papers",
    "mode": "hybrid",
    "top_k": 30
})

# Get entities related to the papers
entities = await use_mcp_tool("lightrag", "get_entities", {
    "limit": 200
})

# Query with citations for verification
cited_result = await use_mcp_tool("lightrag", "query_with_citation", {
    "query": "What are the key contributions of the transformer architecture?",
    "mode": "global"
})
```

## Example 12: Context-Only Retrieval

Retrieve context without generation:

```python
# Get only the context for further processing
context = await use_mcp_tool("lightrag", "query_text", {
    "query": "machine learning algorithms",
    "mode": "hybrid",
    "only_need_context": True,
    "top_k": 10
})

# Use the context in your own processing pipeline
# context contains the relevant text chunks without LLM generation
```

## Example 13: Error Handling

Handle errors gracefully:

```python
try:
    result = await use_mcp_tool("lightrag", "query_text", {
        "query": "What is AI?",
        "mode": "hybrid"
    })
except Exception as e:
    if "connection" in str(e).lower():
        print("Cannot connect to LightRAG server. Is it running?")
    elif "authentication" in str(e).lower():
        print("Authentication failed. Check your API key.")
    else:
        print(f"Error: {e}")
```

## Example 14: Incremental Document Updates

Update knowledge base incrementally:

```python
# Add new information
await use_mcp_tool("lightrag", "insert_text", {
    "text": "New research shows that...",
    "description": "Latest findings"
})

# Query immediately (new information is available)
result = await use_mcp_tool("lightrag", "query_text", {
    "query": "What does the latest research show?",
    "mode": "hybrid"
})
```

## Example 15: Complete RAG Workflow

End-to-end RAG application:

```python
# 1. Initialize - check health
health = await use_mcp_tool("lightrag", "get_health", {})
if health.get("status") != "healthy":
    raise Exception("LightRAG server is not healthy")

# 2. Upload knowledge base
await use_mcp_tool("lightrag", "upload_documents", {
    "file_paths": [
        "/knowledge-base/doc1.pdf",
        "/knowledge-base/doc2.pdf",
        "/knowledge-base/doc3.pdf"
    ]
})

# 3. Wait for processing
status = await use_mcp_tool("lightrag", "document_status", {})
while status.get("processing_count", 0) > 0:
    time.sleep(5)
    status = await use_mcp_tool("lightrag", "document_status", {})

# 4. Verify knowledge graph
entities = await use_mcp_tool("lightrag", "get_entities", {})
print(f"Extracted {len(entities.get('entities', []))} entities")

# 5. Perform queries
answer = await use_mcp_tool("lightrag", "query_with_citation", {
    "query": "What are the main topics covered?",
    "mode": "hybrid"
})

# 6. Get detailed stats
stats = await use_mcp_tool("lightrag", "get_status", {})
print(f"Total documents: {stats.get('statistics', {}).get('documents', 0)}")
```

## Tips and Best Practices

### Choosing the Right Query Mode

- **naive**: Best for simple keyword matching
- **local**: Best for specific, detailed questions
- **global**: Best for broad, summary questions
- **hybrid**: Best general-purpose mode (recommended)
- **mix**: Best for complex multi-aspect queries

### Optimizing Performance

1. Use batch operations (`insert_texts`, `upload_documents`) for multiple documents
2. Set appropriate `top_k` values (lower for faster queries)
3. Clear cache periodically to free memory
4. Use pagination for large result sets

### Working with Large Documents

```python
# Upload with custom chunking
await use_mcp_tool("lightrag", "upload_document", {
    "file_path": "/large-document.pdf",
    "chunk_size": 1500,  # Larger chunks for context
    "chunk_overlap": 200  # More overlap for continuity
})
```

### Monitoring System Health

```python
# Regular health checks
health = await use_mcp_tool("lightrag", "get_health", {})
status = await use_mcp_tool("lightrag", "get_status", {})

if status.get("statistics", {}).get("documents", 0) > 10000:
    # Consider clearing old documents or archiving
    pass
```
