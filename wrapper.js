#!/usr/bin/env node

/**
 * LightRAG MCP Server - Node.js Wrapper
 * 
 * This is a wrapper script that runs the Python-based LightRAG MCP Server.
 * The actual implementation is in Python. This wrapper helps with npx execution.
 * 
 * Author: Lalit Suryan
 * License: MIT
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('LightRAG MCP Server');
console.log('===================\n');

// Check if Python is available
const checkPython = () => {
    return new Promise((resolve) => {
        const python = spawn('python', ['--version']);

        python.on('error', () => {
            const python3 = spawn('python3', ['--version']);
            python3.on('error', () => resolve(false));
            python3.on('close', (code) => resolve(code === 0 ? 'python3' : false));
        });

        python.on('close', (code) => resolve(code === 0 ? 'python' : false));
    });
};

const main = async () => {
    const pythonCmd = await checkPython();

    if (!pythonCmd) {
        console.error('Error: Python 3.10+ is required but not found.');
        console.error('\nPlease install Python from: https://www.python.org/downloads/');
        console.error('\nOr use uvx directly:');
        console.error('  uvx lightrag-mcp-server');
        process.exit(1);
    }

    console.log(`Found Python: ${pythonCmd}`);
    console.log('\nAttempting to run LightRAG MCP Server...\n');

    // Try to run the installed Python package
    const server = spawn(pythonCmd, ['-m', 'lightrag_mcp_server'], {
        stdio: 'inherit',
        shell: true
    });

    server.on('error', (error) => {
        console.error('\nError: LightRAG MCP Server Python package not found.');
        console.error('\nPlease install it first:');
        console.error('  pip install lightrag-mcp-server');
        console.error('\nOr use uvx (recommended):');
        console.error('  uvx lightrag-mcp-server');
        process.exit(1);
    });

    server.on('close', (code) => {
        process.exit(code);
    });
};

main();
