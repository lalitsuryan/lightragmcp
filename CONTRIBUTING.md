# Contributing to LightRAG MCP Server

Thank you for your interest in contributing to LightRAG MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear Title**: Descriptive title summarizing the issue
2. **Description**: Detailed description of the bug
3. **Steps to Reproduce**: Step-by-step instructions
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened
6. **Environment**: OS, Python version, LightRAG version
7. **Logs**: Relevant error messages or logs

### Suggesting Features

For feature requests, please open an issue with:

1. **Clear Title**: Descriptive title for the feature
2. **Use Case**: Why this feature would be useful
3. **Proposed Solution**: How you envision it working
4. **Alternatives**: Other approaches you've considered

### Pull Requests

We welcome pull requests! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/lalitsuryan/lightragmcp.git
   cd lightragmcp
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Install development dependencies
   pip install -e ".[dev]"
   
   # Run tests
   pytest tests/
   
   # Run linters
   black lightrag_mcp_server/
   ruff check lightrag_mcp_server/
   mypy lightrag_mcp_server/
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   Use conventional commit messages:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `test:` test additions/changes
   - `refactor:` code refactoring
   - `chore:` maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a pull request on GitHub.

### PR Guidelines

- **One Feature Per PR**: Keep PRs focused on a single feature or fix
- **Descriptive Title**: Clear title describing the change
- **Description**: Explain what changed and why
- **Tests**: Include tests for new features
- **Documentation**: Update relevant documentation
- **Clean History**: Use meaningful commit messages

## Development Setup

### Prerequisites

- Python 3.10 or higher
- Git
- A running LightRAG server instance

### Local Development

1. **Clone and Setup**
   ```bash
   git clone https://github.com/lalitsuryan/lightragmcp.git
   cd lightragmcp
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -e ".[dev]"
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run Tests**
   ```bash
   pytest tests/ -v
   ```

4. **Run Linters**
   ```bash
   black lightrag_mcp_server/
   ruff check lightrag_mcp_server/
   mypy lightrag_mcp_server/
   ```

## Code Style

### Python

We follow these style guidelines:

- **PEP 8**: Standard Python style guide
- **Black**: Code formatting (line length: 100)
- **Type Hints**: Use type hints throughout
- **Docstrings**: Document all public functions/classes
- **Ruff**: Linting for code quality

### Example

```python
"""Module docstring explaining purpose."""

from typing import Optional, Dict, Any


class ExampleClass:
    """Class docstring explaining purpose.
    
    Args:
        param1: Description of param1
        param2: Description of param2
    """
    
    def __init__(self, param1: str, param2: Optional[int] = None):
        """Initialize ExampleClass."""
        self.param1 = param1
        self.param2 = param2
    
    async def example_method(self, arg: str) -> Dict[str, Any]:
        """Method docstring explaining purpose.
        
        Args:
            arg: Description of argument
            
        Returns:
            Dictionary with results
            
        Raises:
            ValueError: When arg is invalid
        """
        if not arg:
            raise ValueError("arg cannot be empty")
        
        return {"result": arg}
```

## Testing

### Writing Tests

- Use `pytest` for testing
- Write tests for new features
- Ensure existing tests pass
- Aim for high code coverage

### Test Structure

```python
import pytest
from lightrag_mcp_server import create_server


class TestExampleFeature:
    """Tests for example feature."""
    
    @pytest.fixture
    async def server(self):
        """Create test server."""
        return create_server(
            server_url="http://localhost:9621",
            api_key="test_key"
        )
    
    async def test_example(self, server):
        """Test example functionality."""
        result = await server.client.get_health()
        assert result["status"] == "healthy"
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=lightrag_mcp_server

# Run specific test
pytest tests/test_server.py::TestExampleFeature::test_example

# Run with verbose output
pytest -v
```

## Documentation

### Updating Documentation

When making changes, update relevant documentation:

- **README.md**: Main documentation
- **API_REFERENCE.md**: API endpoints
- **EXAMPLES.md**: Usage examples
- **TOOLS_SUMMARY.md**: Tools reference
- **CHANGELOG.md**: Version changes

### Documentation Style

- Use clear, concise language
- Provide code examples
- Keep formatting consistent
- Test all code examples

## Release Process

Releases are managed by maintainers:

1. Update version in `pyproject.toml`
2. Update `CHANGELOG.md`
3. Create git tag
4. Build and publish to PyPI

## Questions?

If you have questions about contributing:

- Open a GitHub Discussion
- Ask in the LightRAG Discord
- Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CHANGELOG.md acknowledgments
- Project documentation

Thank you for contributing to LightRAG MCP Server!
