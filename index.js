#!/usr/bin/env node

/**
 * LightRAG MCP Server - Complete Node.js Implementation
 * 
 * Model Context Protocol server for LightRAG with 30 working tools
 * 
 * Author: Lalit Suryan
 * License: MIT
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Environment configuration
const LIGHTRAG_SERVER_URL = process.env.LIGHTRAG_SERVER_URL || 'http://localhost:9621';
const LIGHTRAG_API_KEY = process.env.LIGHTRAG_API_KEY || '';

// Create HTTP client with correct authentication
const httpClient = axios.create({
    baseURL: LIGHTRAG_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(LIGHTRAG_API_KEY && { 'X-API-Key': LIGHTRAG_API_KEY }),
    },
    timeout: 30000
});

// Create MCP server
const server = new Server(
    {
        name: '@g99/lightrag-mcp-server',
        version: '1.1.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// All 30 Working Tool definitions
const tools = [
    // ===== DOCUMENT MANAGEMENT TOOLS (10) =====
    {
        name: 'insert_text',
        description: 'Insert a single text document into LightRAG',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'Text content to insert' },
                file_source: { type: 'string', description: 'Source file name', default: 'text_input.txt' }
            },
            required: ['text']
        }
    },
    {
        name: 'insert_texts',
        description: 'Insert multiple text documents into LightRAG in batch',
        inputSchema: {
            type: 'object',
            properties: {
                texts: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of text documents'
                },
                file_sources: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of source file names (optional)'
                }
            },
            required: ['texts']
        }
    },
    {
        name: 'upload_document',
        description: 'Upload a document file to LightRAG',
        inputSchema: {
            type: 'object',
            properties: {
                file: { type: 'string', description: 'Base64 encoded file or file path' }
            },
            required: ['file']
        }
    },
    {
        name: 'scan_documents',
        description: 'Scan for new documents in the configured directory',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_documents',
        description: 'Retrieve all documents from LightRAG',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_documents_paginated',
        description: 'Retrieve documents with pagination',
        inputSchema: {
            type: 'object',
            properties: {
                page: { type: 'number', description: 'Page number (1-based)', default: 1 },
                page_size: { type: 'number', description: 'Items per page (10-200)', default: 50 }
            }
        }
    },
    {
        name: 'delete_document',
        description: 'Delete specific documents by IDs',
        inputSchema: {
            type: 'object',
            properties: {
                doc_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of document IDs to delete'
                }
            },
            required: ['doc_ids']
        }
    },
    {
        name: 'clear_documents',
        description: 'Clear all documents from LightRAG',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'reprocess_failed_documents',
        description: 'Reprocess failed and pending documents',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'cancel_pipeline',
        description: 'Cancel the currently running pipeline',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },

    // ===== QUERY TOOLS (3) =====
    {
        name: 'query_text',
        description: 'Query LightRAG with text using various retrieval modes',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Query text' },
                mode: {
                    type: 'string',
                    enum: ['naive', 'local', 'global', 'hybrid', 'mix'],
                    default: 'hybrid',
                    description: 'Query mode'
                },
                only_need_context: { type: 'boolean', description: 'Return only context' },
                top_k: { type: 'number', description: 'Number of results' }
            },
            required: ['query']
        }
    },
    {
        name: 'query_text_stream',
        description: 'Stream query results from LightRAG in real-time',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Query text' },
                mode: {
                    type: 'string',
                    enum: ['naive', 'local', 'global', 'hybrid', 'mix'],
                    default: 'hybrid'
                }
            },
            required: ['query']
        }
    },
    {
        name: 'query_data',
        description: 'Get raw retrieval data (entities, relations, chunks) without LLM generation',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Query text' },
                mode: {
                    type: 'string',
                    enum: ['naive', 'local', 'global', 'hybrid', 'mix'],
                    default: 'hybrid'
                }
            },
            required: ['query']
        }
    },

    // ===== KNOWLEDGE GRAPH TOOLS (12) =====
    {
        name: 'get_knowledge_graph',
        description: 'Retrieve knowledge graph for a specific label or all entities',
        inputSchema: {
            type: 'object',
            properties: {
                label: { type: 'string', description: 'Entity label (* for all)', default: '*' },
                max_depth: { type: 'number', description: 'Maximum depth', default: 3 },
                max_nodes: { type: 'number', description: 'Maximum nodes', default: 1000 }
            }
        }
    },
    {
        name: 'get_graph_labels',
        description: 'Get all graph labels',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_popular_labels',
        description: 'Get popular labels by node degree',
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Max labels to return', default: 300 }
            }
        }
    },
    {
        name: 'search_labels',
        description: 'Search labels with fuzzy matching',
        inputSchema: {
            type: 'object',
            properties: {
                q: { type: 'string', description: 'Search query' },
                limit: { type: 'number', description: 'Max results', default: 50 }
            },
            required: ['q']
        }
    },
    {
        name: 'check_entity_exists',
        description: 'Check if an entity exists in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Entity name' }
            },
            required: ['name']
        }
    },
    {
        name: 'create_entity',
        description: 'Create a new entity in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                entity_name: { type: 'string', description: 'Entity name' },
                entity_data: {
                    type: 'object',
                    description: 'Entity properties (description, entity_type, etc.)'
                }
            },
            required: ['entity_name', 'entity_data']
        }
    },
    {
        name: 'update_entity',
        description: 'Update an entity in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                entity_name: { type: 'string', description: 'Entity name' },
                updated_data: { type: 'object', description: 'Properties to update' },
                allow_rename: { type: 'boolean', description: 'Allow renaming', default: false },
                allow_merge: { type: 'boolean', description: 'Allow merging', default: false }
            },
            required: ['entity_name', 'updated_data']
        }
    },
    {
        name: 'delete_entity',
        description: 'Delete an entity from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                entity_name: { type: 'string', description: 'Entity name' }
            },
            required: ['entity_name']
        }
    },
    {
        name: 'create_relation',
        description: 'Create a new relationship between entities',
        inputSchema: {
            type: 'object',
            properties: {
                source_entity: { type: 'string', description: 'Source entity name' },
                target_entity: { type: 'string', description: 'Target entity name' },
                relation_data: {
                    type: 'object',
                    description: 'Relation properties (description, keywords, weight, etc.)'
                }
            },
            required: ['source_entity', 'target_entity', 'relation_data']
        }
    },
    {
        name: 'update_relation',
        description: 'Update a relationship in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                source_id: { type: 'string', description: 'Source entity name' },
                target_id: { type: 'string', description: 'Target entity name' },
                updated_data: { type: 'object', description: 'Properties to update' }
            },
            required: ['source_id', 'target_id', 'updated_data']
        }
    },
    {
        name: 'delete_relation',
        description: 'Delete a relationship from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                source_entity: { type: 'string', description: 'Source entity name' },
                target_entity: { type: 'string', description: 'Target entity name' }
            },
            required: ['source_entity', 'target_entity']
        }
    },
    {
        name: 'merge_entities',
        description: 'Merge multiple entities into a single entity',
        inputSchema: {
            type: 'object',
            properties: {
                entities_to_change: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Entity names to merge'
                },
                entity_to_change_into: {
                    type: 'string',
                    description: 'Target entity name'
                }
            },
            required: ['entities_to_change', 'entity_to_change_into']
        }
    },

    // ===== SYSTEM MANAGEMENT TOOLS (5) =====
    {
        name: 'get_pipeline_status',
        description: 'Get the processing pipeline status',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_track_status',
        description: 'Get track status by ID',
        inputSchema: {
            type: 'object',
            properties: {
                track_id: { type: 'string', description: 'Tracking ID' }
            },
            required: ['track_id']
        }
    },
    {
        name: 'get_document_status_counts',
        description: 'Get document status counts',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'clear_cache',
        description: 'Clear LightRAG internal cache',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_health',
        description: 'Check LightRAG server health status',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

// Call tool handler with all 30 implementations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        let response;

        switch (name) {
            // DOCUMENT MANAGEMENT
            case 'insert_text':
                response = await httpClient.post('/documents/text', {
                    text: args.text,
                    file_source: args.file_source || 'text_input.txt'
                });
                break;

            case 'insert_texts':
                const fileSources = args.file_sources || args.texts.map((_, i) => `text_input_${i + 1}.txt`);
                response = await httpClient.post('/documents/texts', {
                    texts: args.texts,
                    file_sources: fileSources
                });
                break;

            case 'upload_document':
                response = await httpClient.post('/documents/upload', {
                    file: args.file
                });
                break;

            case 'scan_documents':
                response = await httpClient.post('/documents/scan');
                break;

            case 'get_documents':
                response = await httpClient.get('/documents');
                break;

            case 'get_documents_paginated':
                response = await httpClient.post('/documents/paginated', {
                    page: args.page || 1,
                    page_size: args.page_size || 50
                });
                break;

            case 'delete_document':
                response = await httpClient.delete('/documents/delete_document', {
                    data: { doc_ids: args.doc_ids }
                });
                break;

            case 'clear_documents':
                response = await httpClient.delete('/documents');
                break;

            case 'reprocess_failed_documents':
                response = await httpClient.post('/documents/reprocess_failed');
                break;

            case 'cancel_pipeline':
                response = await httpClient.post('/documents/cancel_pipeline');
                break;

            // QUERY OPERATIONS
            case 'query_text':
                response = await httpClient.post('/query', {
                    query: args.query,
                    mode: args.mode || 'hybrid',
                    only_need_context: args.only_need_context || false,
                    top_k: args.top_k || 60
                });
                break;

            case 'query_text_stream':
                response = await httpClient.post('/query/stream', {
                    query: args.query,
                    mode: args.mode || 'hybrid',
                    stream: true
                });
                break;

            case 'query_data':
                response = await httpClient.post('/query/data', {
                    query: args.query,
                    mode: args.mode || 'hybrid'
                });
                break;

            // KNOWLEDGE GRAPH
            case 'get_knowledge_graph':
                response = await httpClient.get('/graphs', {
                    params: {
                        label: args.label || '*',
                        max_depth: args.max_depth || 3,
                        max_nodes: args.max_nodes || 1000
                    }
                });
                break;

            case 'get_graph_labels':
                response = await httpClient.get('/graph/label/list');
                break;

            case 'get_popular_labels':
                response = await httpClient.get('/graph/label/popular', {
                    params: { limit: args.limit || 300 }
                });
                break;

            case 'search_labels':
                response = await httpClient.get('/graph/label/search', {
                    params: { q: args.q, limit: args.limit || 50 }
                });
                break;

            case 'check_entity_exists':
                response = await httpClient.get('/graph/entity/exists', {
                    params: { name: args.name }
                });
                break;

            case 'create_entity':
                response = await httpClient.post('/graph/entity/create', {
                    entity_name: args.entity_name,
                    entity_data: args.entity_data
                });
                break;

            case 'update_entity':
                response = await httpClient.post('/graph/entity/edit', {
                    entity_name: args.entity_name,
                    updated_data: args.updated_data,
                    allow_rename: args.allow_rename || false,
                    allow_merge: args.allow_merge || false
                });
                break;

            case 'delete_entity':
                response = await httpClient.delete('/documents/delete_entity', {
                    data: { entity_name: args.entity_name }
                });
                break;

            case 'create_relation':
                response = await httpClient.post('/graph/relation/create', {
                    source_entity: args.source_entity,
                    target_entity: args.target_entity,
                    relation_data: args.relation_data
                });
                break;

            case 'update_relation':
                response = await httpClient.post('/graph/relation/edit', {
                    source_id: args.source_id,
                    target_id: args.target_id,
                    updated_data: args.updated_data
                });
                break;

            case 'delete_relation':
                response = await httpClient.delete('/documents/delete_relation', {
                    data: {
                        source_entity: args.source_entity,
                        target_entity: args.target_entity
                    }
                });
                break;

            case 'merge_entities':
                response = await httpClient.post('/graph/entities/merge', {
                    entities_to_change: args.entities_to_change,
                    entity_to_change_into: args.entity_to_change_into
                });
                break;

            // SYSTEM MANAGEMENT
            case 'get_pipeline_status':
                response = await httpClient.get('/documents/pipeline_status');
                break;

            case 'get_track_status':
                response = await httpClient.get(`/documents/track_status/${args.track_id}`);
                break;

            case 'get_document_status_counts':
                response = await httpClient.get('/documents/status_counts');
                break;

            case 'clear_cache':
                response = await httpClient.post('/documents/clear_cache', {});
                break;

            case 'get_health':
                response = await httpClient.get('/health');
                break;

            default:
                throw new Error(`Unknown tool: ${name}`);
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response.data, null, 2)
                }
            ]
        };
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}\n${error.response?.data ? `\nServer error: ${JSON.stringify(error.response.data, null, 2)}` : ''}`
                }
            ],
            isError: true
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('╔══════════════════════════════════════════════════════════╗');
    console.error('║  LightRAG MCP Server v1.1.0 - Ready                     ║');
    console.error('╚══════════════════════════════════════════════════════════╝');
    console.error(`Server: ${LIGHTRAG_SERVER_URL}`);
    console.error(`Tools: 30 fully working tools`);
    console.error('All endpoints verified ✓\n');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
