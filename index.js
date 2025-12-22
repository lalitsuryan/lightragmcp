#!/usr/bin/env node

/**
 * LightRAG MCP Server - Complete Node.js Implementation
 * 
 * Model Context Protocol server for LightRAG with 31 tools
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
const LIGHTRAG_WORKSPACE = process.env.LIGHTRAG_WORKSPACE || 'default';

// Create HTTP client
const httpClient = axios.create({
    baseURL: LIGHTRAG_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(LIGHTRAG_API_KEY && { 'Authorization': `Bearer ${LIGHTRAG_API_KEY}` }),
        'X-Workspace': LIGHTRAG_WORKSPACE
    },
    timeout: 30000
});

// Create MCP server
const server = new Server(
    {
        name: '@g99/lightrag-mcp-server',
        version: '1.0.6',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// All 31 Tool definitions (10 Document + 3 Query + 10 Knowledge Graph + 8 System)
const tools = [
    // ===== DOCUMENT MANAGEMENT TOOLS (10) =====
    {
        name: 'insert_text',
        description: 'Insert a single text document into LightRAG',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'Text content to insert' },
                description: { type: 'string', description: 'Description of the text' }
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
                    description: 'Array of text documents',
                    items: {
                        type: 'object',
                        properties: {
                            content: { type: 'string' },
                            title: { type: 'string' },
                            metadata: { type: 'object' }
                        },
                        required: ['content']
                    }
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
                file_path: { type: 'string', description: 'Path to the file' },
                chunk_size: { type: 'number', description: 'Custom chunk size' },
                chunk_overlap: { type: 'number', description: 'Overlap between chunks' }
            },
            required: ['file_path']
        }
    },
    {
        name: 'upload_documents',
        description: 'Upload multiple documents in batch',
        inputSchema: {
            type: 'object',
            properties: {
                file_paths: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of file paths'
                }
            },
            required: ['file_paths']
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
                page: { type: 'number', description: 'Page number (1-based)' },
                page_size: { type: 'number', description: 'Items per page (1-100)' }
            },
            required: ['page', 'page_size']
        }
    },
    {
        name: 'delete_document',
        description: 'Delete a specific document by ID',
        inputSchema: {
            type: 'object',
            properties: {
                document_id: { type: 'string', description: 'ID of document to delete' }
            },
            required: ['document_id']
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
        name: 'document_status',
        description: 'Get processing status for documents',
        inputSchema: {
            type: 'object',
            properties: {
                document_id: { type: 'string', description: 'Specific document ID' }
            }
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
        name: 'query_with_citation',
        description: 'Query LightRAG and get results with source citations',
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

    // ===== KNOWLEDGE GRAPH TOOLS (10) =====
    {
        name: 'get_knowledge_graph',
        description: 'Retrieve the complete knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_graph_structure',
        description: 'Get knowledge graph structure and statistics',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_entities',
        description: 'Retrieve all entities from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Max entities to retrieve' }
            }
        }
    },
    {
        name: 'get_relations',
        description: 'Retrieve all relationships from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Max relations to retrieve' }
            }
        }
    },
    {
        name: 'check_entity_exists',
        description: 'Check if an entity exists in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                entity_name: { type: 'string', description: 'Name of the entity' }
            },
            required: ['entity_name']
        }
    },
    {
        name: 'update_entity',
        description: 'Update properties of an entity',
        inputSchema: {
            type: 'object',
            properties: {
                entity_id: { type: 'string', description: 'Entity ID' },
                properties: { type: 'object', description: 'Properties to update' }
            },
            required: ['entity_id', 'properties']
        }
    },
    {
        name: 'delete_entity',
        description: 'Delete an entity from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                entity_id: { type: 'string', description: 'Entity ID' }
            },
            required: ['entity_id']
        }
    },
    {
        name: 'delete_relation',
        description: 'Delete a relationship from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                relation_id: { type: 'string', description: 'Relation ID' }
            },
            required: ['relation_id']
        }
    },
    {
        name: 'get_graph_labels',
        description: 'Get labels from the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'update_relation',
        description: 'Update properties of a relationship in the knowledge graph',
        inputSchema: {
            type: 'object',
            properties: {
                relation_id: { type: 'string', description: 'Relation ID' },
                properties: { type: 'object', description: 'Properties to update' }
            },
            required: ['relation_id', 'properties']
        }
    },

    // ===== SYSTEM MANAGEMENT TOOLS (8) =====
    {
        name: 'get_pipeline_status',
        description: 'Get the processing pipeline status from LightRAG',
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
                track_id: { type: 'string', description: 'ID of the track' }
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
        name: 'get_health',
        description: 'Check LightRAG server health status',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_status',
        description: 'Get detailed system status and statistics',
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
            properties: {
                cache_type: { type: 'string', description: 'Type of cache to clear' }
            }
        }
    },
    {
        name: 'get_config',
        description: 'Get current LightRAG server configuration',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_workspace_info',
        description: 'Get information about the current workspace',
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

// Call tool handler with all 30+ implementations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        let response;

        switch (name) {
            // DOCUMENT MANAGEMENT
            case 'insert_text':
                response = await httpClient.post('/documents/text', {
                    text: args.text,
                    description: args.description
                });
                break;

            case 'insert_texts':
                response = await httpClient.post('/documents/texts', {
                    texts: args.texts
                });
                break;

            case 'upload_document':
                response = await httpClient.post('/documents/upload', {
                    file_path: args.file_path,
                    chunk_size: args.chunk_size,
                    chunk_overlap: args.chunk_overlap
                });
                break;

            case 'upload_documents':
                response = await httpClient.post('/documents/upload/batch', {
                    file_paths: args.file_paths
                });
                break;

            case 'scan_documents':
                response = await httpClient.post('/documents/scan');
                break;

            case 'get_documents':
                response = await httpClient.get('/documents');
                break;

            case 'get_documents_paginated':
                response = await httpClient.get('/documents/paginated', {
                    params: { page: args.page, page_size: args.page_size }
                });
                break;

            case 'delete_document':
                response = await httpClient.delete(`/documents/${args.document_id}`);
                break;

            case 'clear_documents':
                response = await httpClient.delete('/documents');
                break;

            case 'document_status':
                if (args.document_id) {
                    response = await httpClient.get(`/documents/${args.document_id}/status`);
                } else {
                    response = await httpClient.get('/documents/status');
                }
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
                response = await httpClient.post('/query', {
                    query: args.query,
                    mode: args.mode || 'hybrid',
                    stream: true
                });
                break;

            case 'query_with_citation':
                response = await httpClient.post('/query', {
                    query: args.query,
                    mode: args.mode || 'hybrid',
                    with_citation: true
                });
                break;

            // KNOWLEDGE GRAPH
            case 'get_knowledge_graph':
                response = await httpClient.get('/graph');
                break;

            case 'get_graph_structure':
                response = await httpClient.get('/graph/structure');
                break;

            case 'get_entities':
                response = await httpClient.get('/graph/entities', {
                    params: args.limit ? { limit: args.limit } : {}
                });
                break;

            case 'get_relations':
                response = await httpClient.get('/graph/relations', {
                    params: args.limit ? { limit: args.limit } : {}
                });
                break;

            case 'check_entity_exists':
                response = await httpClient.get('/graph/entity/exists', {
                    params: { name: args.entity_name }
                });
                break;

            case 'update_entity':
                response = await httpClient.put(`/graph/entity/${args.entity_id}`, {
                    properties: args.properties
                });
                break;

            case 'delete_entity':
                response = await httpClient.delete(`/graph/entity/${args.entity_id}`);
                break;

            case 'delete_relation':
                response = await httpClient.delete(`/graph/relation/${args.relation_id}`);
                break;

            case 'get_graph_labels':
                response = await httpClient.get('/graph/labels');
                break;

            case 'update_relation':
                response = await httpClient.put(`/graph/relation/${args.relation_id}`, {
                    properties: args.properties
                });
                break;

            // SYSTEM MANAGEMENT
            case 'get_pipeline_status':
                response = await httpClient.get('/pipeline/status');
                break;

            case 'get_track_status':
                response = await httpClient.get(`/track/${args.track_id}/status`);
                break;

            case 'get_document_status_counts':
                response = await httpClient.get('/documents/status/counts');
                break;

            case 'get_health':
                response = await httpClient.get('/health');
                break;

            case 'get_status':
                response = await httpClient.get('/status');
                break;

            case 'clear_cache':
                response = await httpClient.post('/cache/clear', {
                    cache_type: args.cache_type || 'all'
                });
                break;

            case 'get_config':
                response = await httpClient.get('/config');
                break;

            case 'get_workspace_info':
                response = await httpClient.get('/workspace/info');
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
    console.error('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
    console.error('â•‘  LightRAG MCP Server v1.0.6 - Started Successfully   â•‘');
    console.error('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    console.error(`Server: ${LIGHTRAG_SERVER_URL}`);
    console.error(`Workspace: ${LIGHTRAG_WORKSPACE}`);
    console.error(`Tools: 31 tools available (Most Complete!)`);
    console.error('Ready for connections...\n');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
