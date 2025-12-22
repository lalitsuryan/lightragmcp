# API Reference

Complete API reference for LightRAG MCP Server tools.

## Document Management Tools

### insert_text

Insert a single text document into LightRAG.

**Request:**
```json
{
  "text": "Your text content here",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "status": "success",
  "document_id": "doc_12345",
  "message": "Document inserted successfully"
}
```

### insert_texts

Insert multiple text documents in batch.

**Request:**
```json
{
  "texts": [
    {
      "content": "First document content",
      "title": "Document 1",
      "metadata": {"category": "tech"}
    },
    {
      "content": "Second document content",
      "title": "Document 2"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "inserted_count": 2,
  "document_ids": ["doc_1", "doc_2"]
}
```

### upload_document

Upload a document file to LightRAG.

**Request:**
```json
{
  "file_path": "/path/to/document.pdf",
  "chunk_size": 1200,
  "chunk_overlap": 100
}
```

**Response:**
```json
{
  "status": "success",
  "document_id": "doc_789",
  "chunks_created": 15
}
```

### upload_documents

Upload multiple documents in batch.

**Request:**
```json
{
  "file_paths": [
    "/path/to/doc1.pdf",
    "/path/to/doc2.txt"
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "uploaded_count": 2,
  "document_ids": ["doc_1", "doc_2"]
}
```

### scan_documents

Scan for new documents in the configured input directory.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "scanned_count": 5,
  "new_documents": 3
}
```

### get_documents

Retrieve all documents.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "total_count": 100,
  "documents": [...]
}
```

### get_documents_paginated

Retrieve documents with pagination.

**Request:**
```json
{
  "page": 1,
  "page_size": 20
}
```

**Response:**
```json
{
  "status": "success",
  "page": 1,
  "page_size": 20,
  "total_pages": 5,
  "total_count": 100,
  "documents": [...]
}
```

### delete_document

Delete a specific document.

**Request:**
```json
{
  "document_id": "doc_12345"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Document deleted successfully"
}
```

### clear_documents

Clear all documents.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "deleted_count": 100
}
```

### document_status

Get document processing status.

**Request:**
```json
{
  "document_id": "doc_12345"
}
```

**Response:**
```json
{
  "status": "success",
  "document_id": "doc_12345",
  "processing_status": "completed",
  "progress": 100
}
```

## Query Tools

### query_text

Query LightRAG with text.

**Request:**
```json
{
  "query": "What are the main concepts?",
  "mode": "hybrid",
  "only_need_context": false,
  "top_k": 60
}
```

**Response:**
```json
{
  "status": "success",
  "response": "The main concepts are...",
  "context": [...],
  "metadata": {
    "mode": "hybrid",
    "tokens_used": 500
  }
}
```

### query_text_stream

Stream query results in real-time.

**Request:**
```json
{
  "query": "Explain AI",
  "mode": "global"
}
```

**Response:**
Stream of text chunks

### query_with_citation

Query with source citations.

**Request:**
```json
{
  "query": "What is RAG?",
  "mode": "hybrid"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "RAG is...",
  "citations": [
    {
      "source": "doc_1",
      "relevance": 0.95
    }
  ]
}
```

## Knowledge Graph Tools

### get_knowledge_graph

Get the complete knowledge graph.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "entities": [...],
  "relations": [...],
  "statistics": {
    "entity_count": 500,
    "relation_count": 1000
  }
}
```

### get_graph_structure

Get graph structure and statistics.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "entity_types": [...],
  "relation_types": [...],
  "statistics": {...}
}
```

### get_entities

Get all entities.

**Request:**
```json
{
  "limit": 100
}
```

**Response:**
```json
{
  "status": "success",
  "entities": [
    {
      "id": "entity_1",
      "name": "Machine Learning",
      "type": "concept",
      "properties": {...}
    }
  ]
}
```

### get_relations

Get all relationships.

**Request:**
```json
{
  "limit": 100
}
```

**Response:**
```json
{
  "status": "success",
  "relations": [
    {
      "id": "rel_1",
      "source": "entity_1",
      "target": "entity_2",
      "type": "related_to"
    }
  ]
}
```

### check_entity_exists

Check if entity exists.

**Request:**
```json
{
  "entity_name": "Machine Learning"
}
```

**Response:**
```json
{
  "status": "success",
  "exists": true,
  "entity_id": "entity_123"
}
```

### update_entity

Update entity properties.

**Request:**
```json
{
  "entity_id": "entity_123",
  "properties": {
    "description": "Updated description",
    "category": "AI"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Entity updated successfully"
}
```

### delete_entity

Delete an entity "**Request:**
```json
{
  "entity_id": "entity_123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Entity deleted successfully"
}
```

### delete_relation

Delete a relation.

**Request:**
```json
{
  "relation_id": "rel_456"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Relation deleted successfully"
}
```

## System Management Tools

### get_health

Check server health.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.4.9",
  "uptime": 3600
}
```

### get_status

Get system status.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "statistics": {
    "documents": 100,
    "entities": 500,
    "relations": 1000
  }
}
```

### clear_cache

Clear system cache.

**Request:**
```json
{
  "cache_type": "all"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Cache cleared successfully"
}
```

### get_config

Get server configuration.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "config": {
    "llm_model": "gpt-4",
    "embedding_model": "text-embedding-3-large"
  }
}
```

### get_workspace_info

Get workspace information.

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "success",
  "workspace": "default",
  "documents": 100,
  "entities": 500
}
```

## Error Responses

All tools may return error responses in the following format:

```json
{
  "status": "error",
  "message": "Error description",
  "error_code": "ERROR_CODE"
}
```

Common error codes:
- `CONNECTION_ERROR`: Cannot connect to LightRAG server
- `AUTH_ERROR`: Authentication failed
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request parameters
- `SERVER_ERROR`: Internal server error
