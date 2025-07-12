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

const categoryWithNotesSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique category identifier' },
    name: { type: 'string', description: 'Category name' },
    is_income: { type: 'boolean', description: 'Whether this is an income category' },
    hidden: { type: 'boolean', description: 'Whether the category is hidden' },
    group: { type: 'string', description: 'Category group ID' },
    sort_order: { type: 'number', description: 'Sort order within group' },
    goal_def: { type: 'string', description: 'Goal definition' },
    note: { type: 'string', nullable: true, description: 'Category note' }
  }
};

const categoryWithNotesAndGroupSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique category identifier' },
    name: { type: 'string', description: 'Category name' },
    is_income: { type: 'boolean', description: 'Whether this is an income category' },
    hidden: { type: 'boolean', description: 'Whether the category is hidden' },
    group: { type: 'string', description: 'Category group ID' },
    sort_order: { type: 'number', description: 'Sort order within group' },
    goal_def: { type: 'string', description: 'Goal definition' },
    note: { type: 'string', nullable: true, description: 'Category note' },
    category_group: {
      type: 'object',
      nullable: true,
      description: 'Parent category group information',
      properties: {
        id: { type: 'string', description: 'Unique category group identifier' },
        name: { type: 'string', description: 'Category group name' },
        is_income: { type: 'boolean', description: 'Whether this is an income group' },
        sort_order: { type: 'number', description: 'Sort order' },
        hidden: { type: 'boolean', description: 'Whether the group is hidden' }
      }
    }
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

const transactionSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Unique transaction identifier' },
    account: { type: 'string', description: 'Account ID' },
    date: { type: 'string', format: 'date', description: 'Transaction date (YYYY-MM-DD)' },
    amount: { type: 'integer', description: 'Amount in cents (e.g., $12.00 = 1200)' },
    payee: { type: 'string', nullable: true, description: 'Payee ID' },
    payee_name: { type: 'string', nullable: true, description: 'Payee name' },
    imported_payee: {
      type: 'string',
      nullable: true,
      description: 'Raw payee description from import'
    },
    category: { type: 'string', nullable: true, description: 'Category ID' },
    notes: { type: 'string', nullable: true, description: 'Transaction notes' },
    imported_id: { type: 'string', nullable: true, description: 'Unique identifier from bank' },
    transfer_id: {
      type: 'string',
      nullable: true,
      description: 'ID for corresponding transfer transaction'
    },
    cleared: { type: 'boolean', nullable: true, description: 'Whether transaction is cleared' },
    subtransactions: {
      type: 'array',
      nullable: true,
      description: 'Sub-transactions for split transactions',
      items: {
        type: 'object',
        properties: {
          amount: { type: 'integer', description: 'Sub-transaction amount in cents' },
          category: { type: 'string', nullable: true, description: 'Sub-transaction category ID' },
          notes: { type: 'string', nullable: true, description: 'Sub-transaction notes' }
        }
      }
    }
  }
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

const addTransactionRequestSchema = {
  type: 'object',
  properties: {
    account_id: {
      type: 'string',
      minLength: 1,
      description: 'Account ID where the transaction will be added'
    },
    date: {
      type: 'string',
      format: 'date',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
      description: 'Transaction date in YYYY-MM-DD format'
    },
    amount: {
      type: 'integer',
      description: 'Transaction amount in cents (e.g., $120.30 = 12030)'
    },
    payee_name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      description: 'Payee name'
    },
    category_id: {
      type: 'string',
      minLength: 1,
      description: 'Category ID for the transaction'
    },
    notes: {
      type: 'string',
      maxLength: 1000,
      description: 'Optional transaction notes'
    },
    subtransactions: {
      type: 'array',
      description: 'Optional subtransactions for split transactions',
      minItems: 1,
      maxItems: 50,
      items: {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            description: 'Subtransaction amount in cents'
          },
          category_id: {
            type: 'string',
            minLength: 1,
            description: 'Subtransaction category ID'
          },
          notes: {
            type: 'string',
            maxLength: 1000,
            description: 'Optional subtransaction notes'
          }
        },
        required: ['amount', 'category_id'],
        additionalProperties: false
      }
    }
  },
  required: ['account_id', 'date', 'amount', 'payee_name', 'category_id'],
  additionalProperties: false
};

const addTransactionResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'object',
      properties: {
        added: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs of newly added transactions'
        },
        updated: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs of updated transactions'
        },
        errors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Any errors that occurred during import'
        }
      }
    }
  }
};

module.exports = {
  accountSchema,
  categorySchema,
  categoryGroupSchema,
  categoryWithNotesSchema,
  categoryWithNotesAndGroupSchema,
  transactionSchema,
  successResponseSchema,
  errorResponseSchema,
  healthResponseSchema,
  addTransactionRequestSchema,
  addTransactionResponseSchema
};
