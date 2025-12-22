"""Tests for LightRAG MCP Server."""

import pytest
from lightrag_mcp_server import create_server


class TestServer:
    """Tests for server creation and basic functionality."""

    def test_create_server(self):
        """Test server creation."""
        server = create_server(
            server_url="http://localhost:9621",
            api_key="test_key",
            workspace="test",
        )
        assert server is not None
        assert server.server_url == "http://localhost:9621"
        assert server.api_key == "test_key"
        assert server.workspace == "test"

    def test_create_server_with_defaults(self):
        """Test server creation with default values."""
        server = create_server()
        assert server is not None
        assert server.server_url == "http://localhost:9621"


class TestClient:
    """Tests for LightRAG client."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        from lightrag_mcp_server.client import LightRAGClient

        return LightRAGClient(
            base_url="http://localhost:9621",
            api_key="test_key",
            workspace="test",
        )

    def test_client_creation(self, client):
        """Test client creation."""
        assert client is not None
        assert client.base_url == "http://localhost:9621"
        assert client.api_key == "test_key"
        assert client.workspace == "test"

    def test_client_headers(self, client):
        """Test client headers."""
        headers = client._get_headers()
        assert "Content-Type" in headers
        assert headers["Content-Type"] == "application/json"
        assert "Authorization" in headers
        assert headers["Authorization"] == "Bearer test_key"
        assert "LIGHTRAG-WORKSPACE" in headers
        assert headers["LIGHTRAG-WORKSPACE"] == "test"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
