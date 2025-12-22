# 🔧 API Endpoint Debugging Guide

## Issue: Most tools returning 404 or 401 errors

Only `get_health` works, other endpoints fail with:
- `401 Invalid token` 
- `404 Not Found`

## Root Cause

The LightRAG server API endpoints may vary by version. We need to find the actual endpoints your server uses.

## Solution: Test Your Server's Actual Endpoints

### Step 1: Find Your Server URL

Check your MCP configuration to find your `LIGHTRAG_SERVER_URL`. It should be something like:
- `http://localhost:9621` (local)
- `https://your-server.com` (remote)

### Step 2: Test the Health Endpoint

Since `get_health` works, test it directly:

```bash
curl -X GET "YOUR_SERVER_URL/health"
```

### Step 3: Check API Documentation

Visit your LightRAG server's API docs:
```
YOUR_SERVER_URL/docs
```

This will show all available endpoints.

### Step 4: Common Endpoint Patterns

Different LightRAG versions use different endpoint patterns:

#### Pattern 1: Direct endpoints
```
/health
/query
/insert
/graph
```

#### Pattern 2: Prefixed endpoints  
```
/api/health
/api/query
/api/documents/text
/api/graph
```

#### Pattern 3: Router-based
```
/health
/documents/text
/documents/texts
/query
/graph/entities
/graph/relations
```

### Step 5: Test Actual Endpoints

Use the test script:

```bash
# Set your actual server URL
$env:LIGHTRAG_SERVER_URL="YOUR_URL_HERE"

# Run test
node test-endpoints.js
```

### Step 6: Update index.js

Once you know the correct endpoints, we'll update the Node.js implementation to match.

## Quick Fix

For now, you can:

1. **Check the Swagger docs** at `YOUR_SERVER_URL/docs`
2. **Note which endpoints exist**
3. **Report back** which patterns match

Then we'll update the code to use the correct endpoints!

---

**Need help?** Share your server URL and we'll test it together!
