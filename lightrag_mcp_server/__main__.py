"""Main entry point for LightRAG MCP Server."""

import asyncio
import sys
from .server import create_server


def main():
    """Main entry point."""
    try:
        # Create and run the server
        server = create_server()
        asyncio.run(server.run())
    except KeyboardInterrupt:
        print("\nShutting down LightRAG MCP Server...")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting LightRAG MCP Server: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
