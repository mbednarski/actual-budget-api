const actualClient = require('../actual-client');
const { accountSchema, categorySchema, categoryGroupSchema, categoryWithNotesSchema } = require('../schemas');

async function apiRoutes(fastify) {
  fastify.get('/accounts', {
    schema: {
      description: 'Get all accounts from Actual Budget',
      tags: ['API'],
      response: {
        200: {
          description: 'Successfully retrieved accounts',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: accountSchema
            }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'ACTUAL_CONNECTION_ERROR' },
                message: { type: 'string', example: 'Failed to connect to Actual Budget server' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const accounts = await actualClient.getAccounts();
      return {
        success: true,
        data: accounts
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: {
          code: 'ACTUAL_CONNECTION_ERROR',
          message: error.message
        }
      };
    }
  });

  fastify.get('/categories', {
    schema: {
      description: 'Get all categories from Actual Budget',
      tags: ['API'],
      response: {
        200: {
          description: 'Successfully retrieved categories',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: categorySchema
            }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'ACTUAL_CONNECTION_ERROR' },
                message: { type: 'string', example: 'Failed to connect to Actual Budget server' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const categories = await actualClient.getCategories();
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: {
          code: 'ACTUAL_CONNECTION_ERROR',
          message: error.message
        }
      };
    }
  });

  fastify.get('/category-groups', {
    schema: {
      description: 'Get all category groups from Actual Budget',
      tags: ['API'],
      response: {
        200: {
          description: 'Successfully retrieved category groups',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: categoryGroupSchema
            }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'ACTUAL_CONNECTION_ERROR' },
                message: { type: 'string', example: 'Failed to connect to Actual Budget server' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const categoryGroups = await actualClient.getCategoryGroups();
      return {
        success: true,
        data: categoryGroups
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: {
          code: 'ACTUAL_CONNECTION_ERROR',
          message: error.message
        }
      };
    }
  });

  fastify.get('/categories-with-notes', {
    schema: {
      description: 'Get all categories with their notes from Actual Budget',
      tags: ['API'],
      querystring: {
        type: 'object',
        properties: {
          includeHidden: { 
            type: 'boolean', 
            description: 'Include hidden categories',
            default: false
          },
          incomeOnly: { 
            type: 'boolean', 
            description: 'Only return income categories',
            default: false
          },
          expenseOnly: { 
            type: 'boolean', 
            description: 'Only return expense categories',
            default: false
          }
        }
      },
      response: {
        200: {
          description: 'Successfully retrieved categories with notes',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: categoryWithNotesSchema
            }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'ACTUAL_CONNECTION_ERROR' },
                message: { type: 'string', example: 'Failed to connect to Actual Budget server' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const options = {
        includeHidden: request.query.includeHidden === 'true',
        incomeOnly: request.query.incomeOnly === 'true',
        expenseOnly: request.query.expenseOnly === 'true'
      };
      
      const categoriesWithNotes = await actualClient.getCategoriesWithNotes(options);
      return {
        success: true,
        data: categoriesWithNotes
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: {
          code: 'ACTUAL_CONNECTION_ERROR',
          message: error.message
        }
      };
    }
  });
}

module.exports = apiRoutes;