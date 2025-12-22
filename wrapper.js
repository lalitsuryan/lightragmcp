#!/usr/bin/env node

/**
 * LightRAG MCP Server - npm Package
 * 
 * This package provides easy installation via npm/npx for the LightRAG MCP Server.
 * The actual implementation requires a running LightRAG server.
 * 
 * Author: Lalit Suryan
 * License: MIT
 */

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║        LightRAG MCP Server - @g99/lightrag-mcp-server        ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');
console.log('📦 Package Information:');
console.log('  • Version: 1.0.1');
console.log('  • Author: Lalit Suryan');
console.log('  • Repository: https://github.com/lalitsuryan/lightragmcp');
console.log('');
console.log('⚠️  Installation Notice:');
console.log('');
console.log('This is an npm wrapper package for the LightRAG MCP Server.');
console.log('To use this server, you need:');
console.log('');
console.log('1. A running LightRAG server');
console.log('   Install: pip install "lightrag-hku[api]"');
console.log('   Run: lightrag-server');
console.log('');
console.log('2. Configure your MCP client (e.g., Claude Desktop):');
console.log('');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "lightrag": {');
console.log('         "command": "npx",');
console.log('         "args": ["@g99/lightrag-mcp-server"],');
console.log('         "env": {');
console.log('           "LIGHTRAG_SERVER_URL": "http://localhost:9621"');
console.log('         }');
console.log('       }');
console.log('     }');
console.log('   }');
console.log('');
console.log('📚 Documentation:');
console.log('  • https://github.com/lalitsuryan/lightragmcp#readme');
console.log('');
console.log('❓ Support:');
console.log('  • Issues: https://github.com/lalitsuryan/lightragmcp/issues');
console.log('');
console.log('════════════════════════════════════════════════════════');
console.log('');
console.log('⚠️  This package is currently in setup mode.');
console.log('   Please configure it in your MCP client to use it.');
console.log('');

process.exit(0);
