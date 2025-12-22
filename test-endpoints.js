// Quick test to check actual LightRAG API endpoints
const axios = require('axios');

const LIGHTRAG_SERVER_URL = process.env.LIGHTRAG_SERVER_URL || 'http://localhost:9621';
const LIGHTRAG_API_KEY = process.env.LIGHTRAG_API_KEY || '';

const httpClient = axios.create({
    baseURL: LIGHTRAG_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(LIGHTRAG_API_KEY && { 'Authorization': `Bearer ${LIGHTRAG_API_KEY}` }),
    },
    timeout: 30000
});

async function testEndpoints() {
    console.log('Testing LightRAG API endpoints...\n');
    console.log(`Server: ${LIGHTRAG_SERVER_URL}\n`);

    const endpoints = [
        { method: 'GET', path: '/health', name: 'Health Check' },
        { method: 'GET', path: '/status', name: 'Status' },
        { method: 'GET', path: '/config', name: 'Config' },
        { method: 'GET', path: '/documents', name: 'Get Documents' },
        { method: 'GET', path: '/workspace/info', name: 'Workspace Info' },
        { method: 'GET', path: '/graph', name: 'Knowledge Graph' },
        { method: 'GET', path: '/graph/structure', name: 'Graph Structure' },
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await httpClient.request({
                method: endpoint.method,
                url: endpoint.path
            });
            console.log(`✅ ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Response keys: ${Object.keys(response.data).join(', ')}\n`);
        } catch (error) {
            console.log(`❌ ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
            console.log(`   Status: ${error.response?.status || 'No response'}`);
            console.log(`   Error: ${error.response?.data?.detail || error.message}\n`);
        }
    }
}

testEndpoints().catch(console.error);
