const fastify = require('fastify')({ logger: true });
const { config, validateConfig } = require('./config');
const actualClient = require('./actual-client');

async function startServer() {
  try {
    validateConfig();

    await fastify.register(require('@fastify/swagger'), {
      swagger: {
        info: {
          title: 'Actual Budget API Wrapper',
          description:
            'HTTP wrapper for Actual Budget API - exposes accounts, categories, and category groups',
          version: '1.0.0'
        },
        host: `${config.server.host}:${config.server.port}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'API', description: 'Actual Budget data endpoints' },
          { name: 'Health', description: 'Health check endpoints' }
        ]
      }
    });

    await fastify.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        }
      },
      staticCSP: true,
      transformStaticCSP: header => header
    });

    await fastify.register(require('./routes/api'), { prefix: '/api' });

    fastify.get(
      '/health',
      {
        schema: {
          description: 'Health check endpoint',
          tags: ['Health'],
          response: {
            200: {
              description: 'Service is healthy',
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['healthy'] },
                timestamp: { type: 'string', format: 'date-time' },
                services: {
                  type: 'object',
                  properties: {
                    actual_budget: { type: 'string', enum: ['connected', 'disconnected'] },
                    http_server: { type: 'string', enum: ['running'] }
                  }
                }
              }
            },
            503: {
              description: 'Service is unhealthy',
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['unhealthy'] },
                timestamp: { type: 'string', format: 'date-time' },
                error: { type: 'string' }
              }
            }
          }
        }
      },
      async (request, reply) => {
        try {
          const connectionStatus = await actualClient.getConnectionStatus();
          return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
              actual_budget: connectionStatus.initialized ? 'connected' : 'disconnected',
              http_server: 'running'
            }
          };
        } catch (error) {
          reply.code(503);
          return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
          };
        }
      }
    );

    fastify.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Endpoint not found'
        }
      });
    });

    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error);
      reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    });

    const gracefulShutdown = async signal => {
      console.log(`Received ${signal}. Shutting down gracefully...`);

      try {
        await actualClient.shutdown();
        await fastify.close();
        console.log('Server shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    await fastify.listen({
      host: config.server.host,
      port: config.server.port
    });

    console.log(`Server listening on ${config.server.host}:${config.server.port}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
