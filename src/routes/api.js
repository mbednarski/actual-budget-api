const actualClient = require('../actual-client');
const { accountSchema, categorySchema, categoryGroupSchema, categoryWithNotesSchema, categoryWithNotesAndGroupSchema, transactionSchema } = require('../schemas');

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

  fastify.get('/categories-with-notes-and-groups', {
    schema: {
      description: 'Get all categories with their notes and parent category groups from Actual Budget',
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
          description: 'Successfully retrieved categories with notes and groups',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: categoryWithNotesAndGroupSchema
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
      
      const categoriesWithNotesAndGroups = await actualClient.getCategoriesWithNotesAndGroups(options);
      return {
        success: true,
        data: categoriesWithNotesAndGroups
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

  fastify.get('/transactions', {
    schema: {
      description: 'Get transactions from Actual Budget for a specific account and date range',
      tags: ['API'],
      querystring: {
        type: 'object',
        properties: {
          accountId: { 
            type: 'string', 
            description: 'Account ID to retrieve transactions from',
            minLength: 1
          },
          startDate: { 
            type: 'string', 
            format: 'date',
            description: 'Start date for transaction retrieval (YYYY-MM-DD)',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          },
          endDate: { 
            type: 'string', 
            format: 'date',
            description: 'End date for transaction retrieval (YYYY-MM-DD)',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          }
        },
        required: ['accountId', 'startDate', 'endDate']
      },
      response: {
        200: {
          description: 'Successfully retrieved transactions',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: transactionSchema
            }
          }
        },
        400: {
          description: 'Bad request - invalid parameters',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'INVALID_PARAMETERS' },
                message: { type: 'string', example: 'Account ID is required' }
              }
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
      const { accountId, startDate, endDate } = request.query;
      
      // Enhanced parameter validation with specific error messages
      const missingParams = [];
      if (!accountId) missingParams.push('accountId');
      if (!startDate) missingParams.push('startDate');
      if (!endDate) missingParams.push('endDate');
      
      if (missingParams.length > 0) {
        reply.code(400);
        return {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_PARAMETERS',
            message: `Missing required parameters: ${missingParams.join(', ')}. Expected format: ?accountId=<id>&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
          }
        };
      }
      
      const transactions = await actualClient.getTransactions(accountId, startDate, endDate);
      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      // Handle validation errors as 400 Bad Request
      if (error.message.includes('required') || 
          error.message.includes('format') || 
          error.message.includes('after end date')) {
        reply.code(400);
        return {
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: error.message
          }
        };
      }
      
      // Handle other errors as 500 Internal Server Error
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