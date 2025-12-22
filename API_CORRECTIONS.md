# 🔍 API Endpoint Corrections

Based on the OpenAPI spec, here are the correct endpoints:

## ✅ Working Endpoints
- `/health` - ✅ Server health (works!)

## ❌ Issues Found

### Authentication Required
Most endpoints require authentication with either:
- **OAuth2PasswordBearer** (token)
- **APIKeyHeader** (X-API-Key header)

The 401 error on `get_documents` is because we're missing authentication.

### Correct Endpoint Mappings

| Our Tool | Correct Endpoint | Notes |
|----------|------------------|-------|
| `get_pipeline_status` | `/documents/pipeline_status` | ✅ Correct |
| `get_track_status` | `/documents/track_status/{track_id}` | ✅ Correct |
| `get_document_status_counts` | `/documents/status_counts` | ✅ Correct |
| `get_graph_labels` | `/graph/label/list` | ❌ Wrong - was `/graph/labels` |
| `update_relation` | `/graph/relation/edit` | ❌ Wrong - was `/graph/relation/{id}` |
| `get_workspace_info` | **Does not exist** | ❌ Not in API |
| `get_config` | **Does not exist** | ❌ Not in API |
| `get_status` | **Does not exist** | ❌ Use `/health` instead |

## 🔑 Authentication Fix

The client needs to send authentication headers. We're currently setting:
- `Authorization: Bearer {API_KEY}`  
- `X-Workspace: {WORKSPACE}`

But the API spec shows it should be:
- `Authorization: Bearer {TOKEN}` (OAuth2)
- `X-API-Key: {API_KEY}` (API Key)

## 📝 Action Plan

1. Fix endpoint paths
2. Fix authentication header
3. Remove non-existent endpoints (get_config, get_status, get_workspace_info)
4. Update tool descriptions

Creating fixed version now...
