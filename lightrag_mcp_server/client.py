"""HTTP client for LightRAG API."""

import json
from typing import Any, Optional, Dict, List
import httpx


class LightRAGClient:
    """Client for interacting with LightRAG API."""

    def __init__(
        self,
        base_url: str = "http://localhost:9621",
        api_key: Optional[str] = None,
        workspace: Optional[str] = None,
        timeout: float = 300.0,
    ):
        """
        Initialize LightRAG client.

        Args:
            base_url: Base URL of the LightRAG server
            api_key: Optional API key for authentication
            workspace: Optional workspace name for data isolation
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.workspace = workspace
        self.timeout = timeout

        # Create HTTP client
        self.client = httpx.AsyncClient(timeout=timeout)

    def _get_headers(self) -> Dict[str, str]:
        """Get request headers with authentication and workspace."""
        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        if self.workspace:
            headers["LIGHTRAG-WORKSPACE"] = self.workspace
        return headers

    async def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        stream: bool = False,
    ) -> Any:
        """
        Make HTTP request to LightRAG API.

        Args:
            method: HTTP method
            endpoint: API endpoint
            data: Request body data
            params: Query parameters
            stream: Whether to stream the response

        Returns:
            Response data

        Raises:
            httpx.HTTPError: If request fails
        """
        url = f"{self.base_url}{endpoint}"
        headers = self._get_headers()

        try:
            if stream:
                async with self.client.stream(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    headers=headers,
                ) as response:
                    response.raise_for_status()
                    chunks = []
                    async for chunk in response.aiter_text():
                        chunks.append(chunk)
                    return "".join(chunks)
            else:
                response = await self.client.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    headers=headers,
                )
                response.raise_for_status()
                return response.json()

        except httpx.HTTPError as e:
            raise Exception(f"LightRAG API request failed: {str(e)}")

    # Document Management Methods

    async def insert_text(
        self, text: str, description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Insert a single text document."""
        data = {"text": text}
        if description:
            data["description"] = description
        return await self._request("POST", "/documents/text", data=data)

    async def insert_texts(self, texts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Insert multiple text documents."""
        return await self._request("POST", "/documents/texts", data={"texts": texts})

    async def upload_document(
        self,
        file_path: str,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Upload a document file."""
        data = {"file_path": file_path}
        if chunk_size:
            data["chunk_size"] = chunk_size
        if chunk_overlap:
            data["chunk_overlap"] = chunk_overlap
        return await self._request("POST", "/documents/upload", data=data)

    async def upload_documents(self, file_paths: List[str]) -> Dict[str, Any]:
        """Upload multiple documents."""
        return await self._request(
            "POST", "/documents/upload/batch", data={"file_paths": file_paths}
        )

    async def scan_documents(self) -> Dict[str, Any]:
        """Scan for new documents."""
        return await self._request("POST", "/documents/scan")

    async def get_documents(self) -> Dict[str, Any]:
        """Get all documents."""
        return await self._request("GET", "/documents")

    async def get_documents_paginated(
        self, page: int, page_size: int
    ) -> Dict[str, Any]:
        """Get documents with pagination."""
        params = {"page": page, "page_size": page_size}
        return await self._request("GET", "/documents/paginated", params=params)

    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """Delete a document."""
        return await self._request("DELETE", f"/documents/{document_id}")

    async def clear_documents(self) -> Dict[str, Any]:
        """Clear all documents."""
        return await self._request("DELETE", "/documents")

    async def document_status(
        self, document_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get document processing status."""
        if document_id:
            return await self._request("GET", f"/documents/{document_id}/status")
        return await self._request("GET", "/documents/status")

    # Query Methods

    async def query_text(
        self,
        query: str,
        mode: str = "hybrid",
        only_need_context: bool = False,
        top_k: int = 60,
        max_tokens: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Query LightRAG."""
        data = {
            "query": query,
            "mode": mode,
            "only_need_context": only_need_context,
            "top_k": top_k,
        }
        if max_tokens:
            data["max_tokens"] = max_tokens
        return await self._request("POST", "/query", data=data)

    async def query_text_stream(
        self,
        query: str,
        mode: str = "hybrid",
        only_need_context: bool = False,
    ) -> str:
        """Query LightRAG with streaming response."""
        data = {
            "query": query,
            "mode": mode,
            "only_need_context": only_need_context,
            "stream": True,
        }
        return await self._request("POST", "/query", data=data, stream=True)

    async def query_with_citation(
        self, query: str, mode: str = "hybrid"
    ) -> Dict[str, Any]:
        """Query with source citations."""
        data = {
            "query": query,
            "mode": mode,
            "with_citation": True,
        }
        return await self._request("POST", "/query", data=data)

    # Knowledge Graph Methods

    async def get_knowledge_graph(self) -> Dict[str, Any]:
        """Get the complete knowledge graph."""
        return await self._request("GET", "/graph")

    async def get_graph_structure(self) -> Dict[str, Any]:
        """Get knowledge graph structure and statistics."""
        return await self._request("GET", "/graph/structure")

    async def get_entities(self, limit: Optional[int] = None) -> Dict[str, Any]:
        """Get all entities."""
        params = {"limit": limit} if limit else None
        return await self._request("GET", "/graph/entities", params=params)

    async def get_relations(self, limit: Optional[int] = None) -> Dict[str, Any]:
        """Get all relationships."""
        params = {"limit": limit} if limit else None
        return await self._request("GET", "/graph/relations", params=params)

    async def check_entity_exists(self, entity_name: str) -> Dict[str, Any]:
        """Check if an entity exists."""
        params = {"name": entity_name}
        return await self._request("GET", "/graph/entity/exists", params=params)

    async def update_entity(
        self, entity_id: str, properties: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an entity."""
        data = {"properties": properties}
        return await self._request("PUT", f"/graph/entity/{entity_id}", data=data)

    async def delete_entity(self, entity_id: str) -> Dict[str, Any]:
        """Delete an entity."""
        return await self._request("DELETE", f"/graph/entity/{entity_id}")

    async def delete_relation(self, relation_id: str) -> Dict[str, Any]:
        """Delete a relation."""
        return await self._request("DELETE", f"/graph/relation/{relation_id}")

    # System Management Methods

    async def get_health(self) -> Dict[str, Any]:
        """Get server health status."""
        return await self._request("GET", "/health")

    async def get_status(self) -> Dict[str, Any]:
        """Get system status and statistics."""
        return await self._request("GET", "/status")

    async def clear_cache(self, cache_type: str = "all") -> Dict[str, Any]:
        """Clear cache."""
        data = {"cache_type": cache_type}
        return await self._request("POST", "/cache/clear", data=data)

    async def get_config(self) -> Dict[str, Any]:
        """Get server configuration."""
        return await self._request("GET", "/config")

    async def get_workspace_info(self) -> Dict[str, Any]:
        """Get workspace information."""
        return await self._request("GET", "/workspace/info")

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
