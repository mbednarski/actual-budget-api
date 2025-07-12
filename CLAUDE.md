# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Actual Budget API HTTP Wrapper

## Project Overview
HTTP wrapper for Actual Budget API that exposes account, category, and category group data via REST endpoints on localhost.

## Tech Stack
- **Runtime**: Node.js
- **HTTP Framework**: Fastify
- **Process Manager**: PM2
- **API Client**: @actual-app/api (version 25.7.1)
- **Documentation**: OpenAPI/Swagger (auto-generated)

## API Endpoints
All available endpoints are documented in the auto-generated OpenAPI specification:
- **Interactive documentation**: `GET /docs` - Swagger UI with live testing
- **Raw specification**: `GET /docs/json` - OpenAPI JSON schema
- **Health check**: `GET /health` - Service status

## Development Commands
```bash
# Install dependencies
npm install

# Development server (with watch mode)
npm run dev

# Production server
npm start

# Process management
npm run pm2:start     # or pm2 start ecosystem.config.js
npm run pm2:stop      # or pm2 stop actual-budget-wrapper
npm run pm2:restart   # or pm2 restart actual-budget-wrapper
npm run pm2:logs      # or pm2 logs actual-budget-wrapper
```

## Configuration
Environment variables (create `.env` file):
- `ACTUAL_SERVER_URL` - Actual Budget server URL (default: http://localhost:5006)
- `ACTUAL_PASSWORD` - Server password (required)
- `ACTUAL_BUDGET_ID` - Budget sync ID (required)
- `ACTUAL_DATA_DIR` - Data cache directory (default: ./data)
- `HTTP_PORT` - HTTP server port (default: 3000)
- `HTTP_HOST` - HTTP server host (default: 127.0.0.1)

## Architecture Overview

### Core Components
1. **ActualBudgetClient** (`src/actual-client.js`): Singleton wrapper around @actual-app/api
   - Handles connection initialization and state management
   - Implements lazy initialization with connection pooling
   - Provides all data access methods (accounts, categories, category groups)
   - Includes advanced query methods for categories with notes using client-side joins

2. **Fastify Server** (`src/server.js`): HTTP server with OpenAPI integration
   - Auto-registers Swagger UI at `/docs`
   - Implements graceful shutdown handling
   - Centralizes error handling and logging

3. **API Routes** (`src/routes/api.js`): Route handlers with full OpenAPI schemas
   - All endpoints return consistent `{success: boolean, data: any}` format
   - Query parameters for filtering (includeHidden, incomeOnly, expenseOnly)
   - Complete OpenAPI documentation for auto-generated docs

4. **Schema Definitions** (`src/schemas.js`): OpenAPI/JSON schemas for all data models
   - Provides type safety and validation
   - Enables auto-generated documentation
   - Supports complex nested objects (categories with groups)

### Data Flow
1. Client request → Fastify routes → ActualBudgetClient → @actual-app/api → Actual Budget server
2. ActualBudgetClient uses AQL (Actual Query Language) for complex queries
3. Client-side joins performed for categories-with-notes endpoints using lookup maps
4. Responses normalized (booleans, consistent field names)

### Query Architecture
- Simple endpoints (accounts, categories, category-groups) use direct API calls
- Complex endpoints (categories-with-notes) use parallel AQL queries with client-side joins:
  - Categories query with filters
  - Notes query for all notes
  - Category groups query (for full endpoint)
  - Efficient lookup maps for O(1) joins

## Testing
**Testing Protocol**: 
- **User responsibility**: Run `npm run dev` to start development server on port 3002
- **Claude responsibility**: Run curl commands to test endpoints

```bash
# Test endpoints (development server on port 3002)
curl http://localhost:3002/api/accounts
curl http://localhost:3002/api/categories
curl http://localhost:3002/api/category-groups
curl http://localhost:3002/api/categories-with-notes
curl http://localhost:3002/api/categories-with-notes-and-groups
curl http://localhost:3002/health

# View interactive documentation
open http://localhost:3002/docs
```

## Documentation Strategy
**IMPORTANT**: This project implements OpenAPI/Swagger for automatic documentation generation. All endpoints MUST have OpenAPI schemas defined in their route handlers. This ensures:

1. **Always up-to-date documentation** - Changes to endpoints require schema updates
2. **Interactive testing** - Swagger UI at `/docs` allows direct API testing
3. **Type safety** - Request/response validation based on schemas
4. **Auto-generated specs** - OpenAPI JSON available at `/docs/json`

When adding new endpoints:
- Define schemas in `src/schemas.js`
- Add OpenAPI schema to route handler in `src/routes/api.js`
- Include proper descriptions, tags, and response codes
- Test documentation at `http://localhost:3000/docs`