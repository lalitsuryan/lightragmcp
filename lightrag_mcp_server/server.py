"""LightRAG MCP Server implementation."""

import asyncio
import os
from typing import Any, Optional

import httpx
from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from pydantic import BaseModel, Field

from .client import LightRAGClient


class LightRAGMCPServer:
    """MCP Server for LightRAG integration."""

    def __init__(
        self,
        server_url: Optional[str] = None,
        api_key: Optional[str] = None,
        workspace: Optional[str] = None,
    ):
        """
        Initialize LightRAG MCP Server.

        Args:
            server_url: LightRAG server URL (default: from env LIGHTRAG_SERVER_URL)
            api_key: API key for authentication (default: from env LIGHTRAG_API_KEY)
            workspace: Workspace name for data isolation (default: from env LIGHTRAG_WORKSPACE)
        """
        self.server_url = server_url or os.getenv(
            "LIGHTRAG_SERVER_URL", "http://localhost:9621"
        )
        self.api_key = api_key or os.getenv("LIGHTRAG_API_KEY")
        self.workspace = workspace or os.getenv("LIGHTRAG_WORKSPACE", "default")

        # Initialize MCP server
        self.server = Server("lightrag-mcp-server")

        # Initialize LightRAG client
        self.client = LightRAGClient(
            base_url=self.server_url,
            api_key=self.api_key,
            workspace=self.workspace,
        )

        # Register tool handlers
        self._register_tools()

    def _register_tools(self):
        """Register all MCP tools."""
        # Document Management Tools
        self._register_document_tools()
        # Query Tools
        self._register_query_tools()
        # Knowledge Graph Tools
        self._register_graph_tools()
        # System Management Tools
        self._register_system_tools()

    def _register_document_tools(self):
        """Register document management tools."""

        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            """List all available tools."""
            return [
                # Document Management (10 tools)
                Tool(
                    name="insert_text",
                    description="Insert a single text document into LightRAG",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "text": {
                                "type": "string",
                                "description": "Text content to insert",
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional description of the text",
                            },
                        },
                        "required": ["text"],
                    },
                ),
                Tool(
                    name="insert_texts",
                    description="Insert multiple text documents into LightRAG in batch",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "texts": {
                                "type": "array",
                                "description": "Array of text documents with optional metadata",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "content": {"type": "string"},
                                        "title": {"type": "string"},
                                        "metadata": {"type": "object"},
                                    },
                                    "required": ["content"],
                                },
                            },
                        },
                        "required": ["texts"],
                    },
                ),
                Tool(
                    name="upload_document",
                    description="Upload a document file to LightRAG",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "Path to the file to upload",
                            },
                            "chunk_size": {
                                "type": "integer",
                                "description": "Custom chunk size for document splitting",
                            },
                            "chunk_overlap": {
                                "type": "integer",
                                "description": "Overlap size between chunks",
                            },
                        },
                        "required": ["file_path"],
                    },
                ),
                Tool(
                    name="upload_documents",
                    description="Upload multiple documents in batch",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "file_paths": {
                                "type": "array",
                                "description": "Array of file paths to upload",
                                "items": {"type": "string"},
                            },
                        },
                        "required": ["file_paths"],
                    },
                ),
                Tool(
                    name="scan_documents",
                    description="Scan for new documents in the configured input directory",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_documents",
                    description="Retrieve all documents from LightRAG",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_documents_paginated",
                    description="Retrieve documents with pagination support",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "page": {
                                "type": "integer",
                                "description": "Page number (1-based)",
                            },
                            "page_size": {
                                "type": "integer",
                                "description": "Number of documents per page (1-100)",
                            },
                        },
                        "required": ["page", "page_size"],
                    },
                ),
                Tool(
                    name="delete_document",
                    description="Delete a specific document by ID",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "document_id": {
                                "type": "string",
                                "description": "ID of the document to delete",
                            },
                        },
                        "required": ["document_id"],
                    },
                ),
                Tool(
                    name="clear_documents",
                    description="Clear all documents from LightRAG",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="document_status",
                    description="Get processing status for documents",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "document_id": {
                                "type": "string",
                                "description": "Optional specific document ID to check",
                            },
                        },
                    },
                ),
                # Query Tools (3 tools)
                Tool(
                    name="query_text",
                    description="Query LightRAG with text using various retrieval modes",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Query text",
                            },
                            "mode": {
                                "type": "string",
                                "description": "Query mode: naive, local, global, hybrid, or mix",
                                "enum": ["naive", "local", "global", "hybrid", "mix"],
                                "default": "hybrid",
                            },
                            "only_need_context": {
                                "type": "boolean",
                                "description": "Return only context without generation",
                                "default": False,
                            },
                            "top_k": {
                                "type": "integer",
                                "description": "Number of top results to retrieve",
                                "default": 60,
                            },
                            "max_tokens": {
                                "type": "integer",
                                "description": "Maximum tokens in response",
                            },
                        },
                        "required": ["query"],
                    },
                ),
                Tool(
                    name="query_text_stream",
                    description="Stream query results from LightRAG in real-time",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Query text",
                            },
                            "mode": {
                                "type": "string",
                                "description": "Query mode",
                                "enum": ["naive", "local", "global", "hybrid", "mix"],
                                "default": "hybrid",
                            },
                            "only_need_context": {
                                "type": "boolean",
                                "description": "Return only context",
                                "default": False,
                            },
                        },
                        "required": ["query"],
                    },
                ),
                Tool(
                    name="query_with_citation",
                    description="Query LightRAG and get results with source citations",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Query text",
                            },
                            "mode": {
                                "type": "string",
                                "description": "Query mode",
                                "enum": ["naive", "local", "global", "hybrid", "mix"],
                                "default": "hybrid",
                            },
                        },
                        "required": ["query"],
                    },
                ),
                # Knowledge Graph Tools (8 tools)
                Tool(
                    name="get_knowledge_graph",
                    description="Retrieve the complete knowledge graph from LightRAG",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_graph_structure",
                    description="Get the structure and statistics of the knowledge graph",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_entities",
                    description="Retrieve all entities from the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "limit": {
                                "type": "integer",
                                "description": "Maximum number of entities to retrieve",
                            },
                        },
                    },
                ),
                Tool(
                    name="get_relations",
                    description="Retrieve all relationships from the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "limit": {
                                "type": "integer",
                                "description": "Maximum number of relations to retrieve",
                            },
                        },
                    },
                ),
                Tool(
                    name="check_entity_exists",
                    description="Check if an entity exists in the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "entity_name": {
                                "type": "string",
                                "description": "Name of the entity to check",
                            },
                        },
                        "required": ["entity_name"],
                    },
                ),
                Tool(
                    name="update_entity",
                    description="Update properties of an entity in the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "entity_id": {
                                "type": "string",
                                "description": "ID of the entity to update",
                            },
                            "properties": {
                                "type": "object",
                                "description": "Properties to update",
                            },
                        },
                        "required": ["entity_id", "properties"],
                    },
                ),
                Tool(
                    name="delete_entity",
                    description="Delete an entity from the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "entity_id": {
                                "type": "string",
                                "description": "ID of the entity to delete",
                            },
                        },
                        "required": ["entity_id"],
                    },
                ),
                Tool(
                    name="delete_relation",
                    description="Delete a relationship from the knowledge graph",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "relation_id": {
                                "type": "string",
                                "description": "ID of the relation to delete",
                            },
                        },
                        "required": ["relation_id"],
                    },
                ),
                # System Management Tools (5 tools)
                Tool(
                    name="get_health",
                    description="Check LightRAG server health and status",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_status",
                    description="Get detailed system status and statistics",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="clear_cache",
                    description="Clear LightRAG's internal cache",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "cache_type": {
                                "type": "string",
                                "description": "Type of cache to clear (default: all)",
                                "enum": ["all", "llm", "embedding", "query"],
                                "default": "all",
                            },
                        },
                    },
                ),
                Tool(
                    name="get_config",
                    description="Get current LightRAG server configuration",
                    inputSchema={"type": "object", "properties": {}},
                ),
                Tool(
                    name="get_workspace_info",
                    description="Get information about the current workspace",
                    inputSchema={"type": "object", "properties": {}},
                ),
            ]

        @self.server.call_tool()
        async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
            """Handle tool calls."""
            try:
                # Document Management Tools
                if name == "insert_text":
                    result = await self.client.insert_text(
                        text=arguments["text"],
                        description=arguments.get("description"),
                    )
                elif name == "insert_texts":
                    result = await self.client.insert_texts(texts=arguments["texts"])
                elif name == "upload_document":
                    result = await self.client.upload_document(
                        file_path=arguments["file_path"],
                        chunk_size=arguments.get("chunk_size"),
                        chunk_overlap=arguments.get("chunk_overlap"),
                    )
                elif name == "upload_documents":
                    result = await self.client.upload_documents(
                        file_paths=arguments["file_paths"]
                    )
                elif name == "scan_documents":
                    result = await self.client.scan_documents()
                elif name == "get_documents":
                    result = await self.client.get_documents()
                elif name == "get_documents_paginated":
                    result = await self.client.get_documents_paginated(
                        page=arguments["page"],
                        page_size=arguments["page_size"],
                    )
                elif name == "delete_document":
                    result = await self.client.delete_document(
                        document_id=arguments["document_id"]
                    )
                elif name == "clear_documents":
                    result = await self.client.clear_documents()
                elif name == "document_status":
                    result = await self.client.document_status(
                        document_id=arguments.get("document_id")
                    )
                # Query Tools
                elif name == "query_text":
                    result = await self.client.query_text(
                        query=arguments["query"],
                        mode=arguments.get("mode", "hybrid"),
                        only_need_context=arguments.get("only_need_context", False),
                        top_k=arguments.get("top_k", 60),
                        max_tokens=arguments.get("max_tokens"),
                    )
                elif name == "query_text_stream":
                    result = await self.client.query_text_stream(
                        query=arguments["query"],
                        mode=arguments.get("mode", "hybrid"),
                        only_need_context=arguments.get("only_need_context", False),
                    )
                elif name == "query_with_citation":
                    result = await self.client.query_with_citation(
                        query=arguments["query"],
                        mode=arguments.get("mode", "hybrid"),
                    )
                # Knowledge Graph Tools
                elif name == "get_knowledge_graph":
                    result = await self.client.get_knowledge_graph()
                elif name == "get_graph_structure":
                    result = await self.client.get_graph_structure()
                elif name == "get_entities":
                    result = await self.client.get_entities(limit=arguments.get("limit"))
                elif name == "get_relations":
                    result = await self.client.get_relations(limit=arguments.get("limit"))
                elif name == "check_entity_exists":
                    result = await self.client.check_entity_exists(
                        entity_name=arguments["entity_name"]
                    )
                elif name == "update_entity":
                    result = await self.client.update_entity(
                        entity_id=arguments["entity_id"],
                        properties=arguments["properties"],
                    )
                elif name == "delete_entity":
                    result = await self.client.delete_entity(
                        entity_id=arguments["entity_id"]
                    )
                elif name == "delete_relation":
                    result = await self.client.delete_relation(
                        relation_id=arguments["relation_id"]
                    )
                # System Management Tools
                elif name == "get_health":
                    result = await self.client.get_health()
                elif name == "get_status":
                    result = await self.client.get_status()
                elif name == "clear_cache":
                    result = await self.client.clear_cache(
                        cache_type=arguments.get("cache_type", "all")
                    )
                elif name == "get_config":
                    result = await self.client.get_config()
                elif name == "get_workspace_info":
                    result = await self.client.get_workspace_info()
                else:
                    return [
                        TextContent(
                            type="text",
                            text=f"Unknown tool: {name}",
                        )
                    ]

                return [
                    TextContent(
                        type="text",
                        text=str(result),
                    )
                ]

            except Exception as e:
                return [
                    TextContent(
                        type="text",
                        text=f"Error executing {name}: {str(e)}",
                    )
                ]

    async def run(self):
        """Run the MCP server."""
        from mcp.server.stdio import stdio_server

        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                self.server.create_initialization_options(),
            )


def create_server(
    server_url: Optional[str] = None,
    api_key: Optional[str] = None,
    workspace: Optional[str] = None,
) -> LightRAGMCPServer:
    """
    Create a LightRAG MCP Server instance.

    Args:
        server_url: LightRAG server URL
        api_key: API key for authentication
        workspace: Workspace name for data isolation

    Returns:
        LightRAGMCPServer instance
    """
    return LightRAGMCPServer(
        server_url=server_url,
        api_key=api_key,
        workspace=workspace,
    )
