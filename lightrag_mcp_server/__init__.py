"""LightRAG MCP Server - Complete RAG and Knowledge Graph integration."""

__version__ = "1.0.0"
__author__ = "Lalit Suryan"
__description__ = "Model Context Protocol server for LightRAG"

from .server import create_server

__all__ = ["create_server", "__version__"]
