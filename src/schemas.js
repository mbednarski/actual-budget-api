const accountSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique account identifier' },
    name: { type: 'string', description: 'Account name' },
    type: { 
      type: 'string', 
      enum: ['checking', 'savings', 'credit', 'investment', 'mortgage', 'debt', 'other'],
      description: 'Account type' 
    },
    balance: { type: 'number', description: 'Current account balance' },
    closed: { type: 'boolean', description: 'Whether the account is closed' },
    offbudget: { type: 'boolean', description: 'Whether the account is off-budget' }
  }
};

const categorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique category identifier' },
    name: { type: 'string', description: 'Category name' },
    cat_group: { type: 'string', description: 'Category group ID' },
    is_income: { type: 'boolean', description: 'Whether this is an income category' },
    sort_order: { type: 'number', description: 'Sort order within group' },
    hidden: { type: 'boolean', description: 'Whether the category is hidden' }
  }
};

const categoryGroupSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique category group identifier' },
    name: { type: 'string', description: 'Category group name' },
    is_income: { type: 'boolean', description: 'Whether this is an income group' },
    sort_order: { type: 'number', description: 'Sort order' },
    hidden: { type: 'boolean', description: 'Whether the group is hidden' }
  }
};

const successResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: { type: 'array' }
  },
  required: ['success', 'data']
};

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Error code' },
        message: { type: 'string', description: 'Error message' }
      },
      required: ['code', 'message']
    }
  },
  required: ['success', 'error']
};

const healthResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['healthy', 'unhealthy'] },
    timestamp: { type: 'string', format: 'date-time' },
    services: {
      type: 'object',
      properties: {
        actual_budget: { type: 'string', enum: ['connected', 'disconnected'] },
        http_server: { type: 'string', enum: ['running'] }
      }
    }
  }
};

module.exports = {
  accountSchema,
  categorySchema,
  categoryGroupSchema,
  successResponseSchema,
  errorResponseSchema,
  healthResponseSchema
};