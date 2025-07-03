# Actual Budget API HTTP Wrapper - Project Plan

## Overview
Create a minimal HTTP wrapper for Actual Budget API that exposes three core methods via REST endpoints on localhost. Designed for deployment on a small VPS with minimal resource overhead.

## Technical Stack

### Core Components
- **Runtime**: Node.js (required for @actual-app/api)
- **HTTP Framework**: Fastify (lightweight, high performance)
- **Process Manager**: PM2 (production reliability)
- **API Client**: @actual-app/api (official Actual Budget client)

### Architecture
```
Client HTTP Request → Fastify Server → @actual-app/api → Actual Budget Server
```

## Implementation Phases

### Phase 1: Project Setup
- [x] Initialize Node.js project
- [ ] Create package.json with dependencies
- [ ] Set up basic project structure
- [ ] Configure development environment

### Phase 2: Core Implementation
- [ ] Create configuration module
- [ ] Implement Actual Budget API client wrapper
- [ ] Build HTTP endpoints for three methods
- [ ] Add error handling and logging
- [ ] Implement proper connection management

### Phase 3: Production Deployment
- [ ] Add PM2 configuration
- [ ] Implement graceful shutdown
- [ ] Add health check endpoint
- [ ] Configure localhost-only binding
- [ ] Add basic monitoring/logging

## Project Structure
```
actual-budget-wrapper/
├── package.json
├── src/
│   ├── server.js          # Fastify HTTP server
│   ├── actual-client.js   # Actual Budget API wrapper
│   ├── config.js          # Configuration management
│   └── routes/
│       └── api.js         # API route handlers
├── ecosystem.config.js    # PM2 configuration
├── .env.example          # Environment variables template
└── README.md             # Usage documentation
```

## Configuration Requirements

### Environment Variables
```
ACTUAL_SERVER_URL=http://localhost:5006
ACTUAL_PASSWORD=your_server_password
ACTUAL_BUDGET_ID=your_budget_sync_id
ACTUAL_DATA_DIR=/path/to/data/cache
HTTP_PORT=3000
HTTP_HOST=127.0.0.1
```

### Actual Budget Connection
- Server URL (typically localhost:5006)
- Server password
- Budget sync ID
- Local data directory for caching

## Resource Requirements
- **Memory**: ~50MB runtime footprint
- **CPU**: Minimal (mostly I/O bound)
- **Storage**: ~100MB for dependencies + cache
- **Network**: Localhost HTTP + Actual Budget server connection

## Security Considerations
- Bind only to localhost (127.0.0.1)
- No external network exposure
- Secure Actual Budget server credentials
- Input validation on all endpoints
- Rate limiting for protection

## Monitoring & Maintenance
- PM2 process monitoring
- Basic health check endpoint
- Error logging to file/console
- Graceful restart capabilities
- Connection state monitoring