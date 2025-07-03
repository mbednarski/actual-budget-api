# Actual Budget API HTTP Wrapper

## Project Overview
HTTP wrapper for Actual Budget API that exposes three core methods via REST endpoints on localhost.

## Tech Stack
- **Runtime**: Node.js
- **HTTP Framework**: Fastify
- **Process Manager**: PM2
- **API Client**: @actual-app/api (version 25.7.1)
- **Documentation**: OpenAPI/Swagger (auto-generated)

## Exposed Methods
- `GET /api/accounts` - Get all accounts
- `GET /api/categories` - Get all categories  
- `GET /api/category-groups` - Get all category groups
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive Swagger UI documentation
- `GET /docs/json` - Raw OpenAPI JSON specification

## Development Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production server
npm start

# Process management
pm2 start ecosystem.config.js
pm2 stop actual-budget-wrapper
pm2 restart actual-budget-wrapper
pm2 logs actual-budget-wrapper
```

## Configuration
Environment variables in `.env`:
- `ACTUAL_SERVER_URL` - Actual Budget server URL
- `ACTUAL_PASSWORD` - Server password
- `ACTUAL_BUDGET_ID` - Budget sync ID
- `ACTUAL_DATA_DIR` - Data cache directory
- `HTTP_PORT` - HTTP server port (default: 3000)
- `HTTP_HOST` - HTTP server host (default: 127.0.0.1)

## Project Structure
```
src/
├── server.js          # Fastify HTTP server with OpenAPI config
├── actual-client.js   # Actual Budget API wrapper
├── config.js          # Configuration management
├── schemas.js         # OpenAPI schemas for data models
└── routes/
    └── api.js         # API route handlers with OpenAPI schemas
```

## Testing
```bash
# Test endpoints
curl http://localhost:3000/api/accounts
curl http://localhost:3000/api/categories
curl http://localhost:3000/api/category-groups
curl http://localhost:3000/health

# View interactive documentation
open http://localhost:3000/docs
```

## Deployment
1. Configure environment variables
2. Install dependencies: `npm install`
3. Start with PM2: `pm2 start ecosystem.config.js`
4. Monitor: `pm2 monit`

## Resource Usage
- Memory: ~50MB
- CPU: Minimal (I/O bound)
- Storage: ~100MB for dependencies + cache

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