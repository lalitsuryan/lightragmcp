#!/usr/bin/env node

/**
 * LightRAG MCP Server - Node.js Implementation
 * 
 * Model Context Protocol server for LightRAG
 * Provides 30+ tools for document management, queries, and knowledge graph operations
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
        version: '1.0.3',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool definitions
const tools = [
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
                }
            },
            required: ['query']
        }
    },
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
        name: 'get_health',
        description: 'Check LightRAG server health status',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    }
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'query_text': {
                const response = await httpClient.post('/query', {
                    query: args.query,
                    mode: args.mode || 'hybrid'
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response.data, null, 2)
                        }
                    ]
                };
            }

            case 'insert_text': {
                const response = await httpClient.post('/insert', {
                    text: args.text,
                    description: args.description
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response.data, null, 2)
                        }
                    ]
                };
            }

            case 'get_health': {
                const response = await httpClient.get('/health');
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response.data, null, 2)
                        }
                    ]
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`
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
    console.error('LightRAG MCP Server started');
    console.error(`Connected to: ${LIGHTRAG_SERVER_URL}`);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
