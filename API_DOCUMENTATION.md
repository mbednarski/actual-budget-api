# Actual Budget API HTTP Wrapper - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
No authentication required as this wrapper runs on localhost only and connects to Actual Budget server internally.

## Endpoints

### 1. Get Accounts
Retrieves all accounts from the Actual Budget.

**Endpoint:** `GET /api/accounts`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "account_id",
      "name": "Account Name",
      "type": "checking|savings|credit|investment|mortgage|debt|other",
      "balance": 0,
      "closed": false,
      "offbudget": false
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/api/accounts
```

### 2. Get Categories
Retrieves all categories from the Actual Budget.

**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Category Name",
      "cat_group": "group_id",
      "is_income": false,
      "sort_order": 0,
      "hidden": false
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/api/categories
```

### 3. Get Category Groups
Retrieves all category groups from the Actual Budget.

**Endpoint:** `GET /api/category-groups`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "group_id",
      "name": "Group Name",
      "is_income": false,
      "sort_order": 0,
      "hidden": false
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/api/category-groups
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error
- `503` - Service Unavailable (Actual Budget connection issue)

### Common Error Codes
- `ACTUAL_CONNECTION_ERROR` - Cannot connect to Actual Budget server
- `ACTUAL_AUTH_ERROR` - Authentication failed with Actual Budget server
- `ACTUAL_BUDGET_NOT_FOUND` - Specified budget not found
- `INTERNAL_ERROR` - Unexpected server error

## Health Check

### Health Status
Check if the wrapper and Actual Budget connection are working.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "actual_budget": "connected",
    "http_server": "running"
  }
}
```

## Rate Limiting
- 100 requests per minute per IP
- Burst allowance of 10 requests

## CORS Policy
- Localhost origins only
- No cross-origin requests allowed

## Data Freshness
- Data is fetched in real-time from Actual Budget server
- No caching implemented (always fresh data)
- Response times depend on Actual Budget server performance