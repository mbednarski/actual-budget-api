const api = require('@actual-app/api');
const { q } = require('@actual-app/api');
const { config } = require('./config');

class ActualBudgetClient {
  constructor() {
    this.initialized = false;
    this.connecting = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    if (this.connecting) {
      await this.waitForConnection();
      return;
    }

    this.connecting = true;

    try {
      await api.init({
        dataDir: config.actual.dataDir,
        serverURL: config.actual.serverURL,
        password: config.actual.password
      });

      await api.downloadBudget(config.actual.budgetId);
      
      this.initialized = true;
      this.connecting = false;
      
      console.log('Successfully connected to Actual Budget server');
    } catch (error) {
      this.connecting = false;
      console.error('Failed to initialize Actual Budget client:', error.message);
      throw new Error(`Actual Budget connection failed: ${error.message}`);
    }
  }

  async waitForConnection() {
    while (this.connecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getAccounts() {
    await this.ensureInitialized();
    
    try {
      const accounts = await api.getAccounts();
      return accounts || [];
    } catch (error) {
      console.error('Failed to get accounts:', error.message);
      throw new Error(`Failed to retrieve accounts: ${error.message}`);
    }
  }

  async getCategories() {
    await this.ensureInitialized();
    
    try {
      const categories = await api.getCategories();
      return categories || [];
    } catch (error) {
      console.error('Failed to get categories:', error.message);
      throw new Error(`Failed to retrieve categories: ${error.message}`);
    }
  }

  async getCategoryGroups() {
    await this.ensureInitialized();
    
    try {
      const categoryGroups = await api.getCategoryGroups();
      return categoryGroups || [];
    } catch (error) {
      console.error('Failed to get category groups:', error.message);
      throw new Error(`Failed to retrieve category groups: ${error.message}`);
    }
  }

  async getCategoriesWithNotes(options = {}) {
    await this.ensureInitialized();
    
    const {
      includeHidden = false,
      incomeOnly = false,
      expenseOnly = false
    } = options;
    
    try {
      // Build category query with filters
      let categoryQuery = q('categories')
        .select([
          'id',
          'name',
          'is_income',
          'hidden',
          'group',
          'sort_order',
          'goal_def'
        ])
        .filter({ tombstone: false });
      
      // Apply optional filters
      if (!includeHidden) {
        categoryQuery = categoryQuery.filter({ hidden: false });
      }
      
      if (incomeOnly) {
        categoryQuery = categoryQuery.filter({ is_income: true });
      } else if (expenseOnly) {
        categoryQuery = categoryQuery.filter({ is_income: false });
      }
      
      categoryQuery = categoryQuery.orderBy('sort_order');
      
      // Notes query
      const notesQuery = q('notes').select(['id', 'note']);
      
      // Execute both queries in parallel
      const [categoriesResult, notesResult] = await Promise.all([
        api.aqlQuery(categoryQuery),
        api.aqlQuery(notesQuery)
      ]);
      
      // Validate results
      if (!categoriesResult?.data || !notesResult?.data) {
        throw new Error('Invalid query results received');
      }
      
      // Create notes lookup map
      const notesMap = notesResult.data.reduce((acc, note) => {
        if (note.id && note.note) {
          acc[note.id] = note.note;
        }
        return acc;
      }, {});
      
      // Join categories with notes
      const categoriesWithNotes = categoriesResult.data.map(category => ({
        ...category,
        note: notesMap[category.id] || null,
        // Convert database integers to booleans for consistency
        is_income: Boolean(category.is_income),
        hidden: Boolean(category.hidden)
      }));
      
      return categoriesWithNotes;
      
    } catch (error) {
      console.error('Failed to get categories with notes:', error.message);
      throw new Error(`Failed to retrieve categories with notes: ${error.message}`);
    }
  }

  async getCategoriesWithNotesAndGroups(options = {}) {
    await this.ensureInitialized();
    
    const {
      includeHidden = false,
      incomeOnly = false,
      expenseOnly = false
    } = options;
    
    try {
      // Build category query with filters
      let categoryQuery = q('categories')
        .select([
          'id',
          'name',
          'is_income',
          'hidden',
          'group',
          'sort_order',
          'goal_def'
        ])
        .filter({ tombstone: false });
      
      // Apply optional filters
      if (!includeHidden) {
        categoryQuery = categoryQuery.filter({ hidden: false });
      }
      
      if (incomeOnly) {
        categoryQuery = categoryQuery.filter({ is_income: true });
      } else if (expenseOnly) {
        categoryQuery = categoryQuery.filter({ is_income: false });
      }
      
      categoryQuery = categoryQuery.orderBy('sort_order');
      
      // Notes query
      const notesQuery = q('notes').select(['id', 'note']);
      
      // Category groups query
      const categoryGroupsQuery = q('category_groups')
        .select([
          'id',
          'name',
          'is_income',
          'sort_order',
          'hidden'
        ])
        .filter({ tombstone: false });
      
      // Execute all queries in parallel
      const [categoriesResult, notesResult, categoryGroupsResult] = await Promise.all([
        api.aqlQuery(categoryQuery),
        api.aqlQuery(notesQuery),
        api.aqlQuery(categoryGroupsQuery)
      ]);
      
      // Validate results
      if (!categoriesResult?.data || !notesResult?.data || !categoryGroupsResult?.data) {
        throw new Error('Invalid query results received');
      }
      
      // Create lookup maps
      const notesMap = notesResult.data.reduce((acc, note) => {
        if (note.id && note.note) {
          acc[note.id] = note.note;
        }
        return acc;
      }, {});
      
      const categoryGroupsMap = categoryGroupsResult.data.reduce((acc, group) => {
        acc[group.id] = {
          ...group,
          is_income: Boolean(group.is_income),
          hidden: Boolean(group.hidden)
        };
        return acc;
      }, {});
      
      // Join categories with notes and groups
      const categoriesWithNotesAndGroups = categoriesResult.data.map(category => ({
        ...category,
        note: notesMap[category.id] || null,
        category_group: categoryGroupsMap[category.group] || null,
        // Convert database integers to booleans for consistency
        is_income: Boolean(category.is_income),
        hidden: Boolean(category.hidden)
      }));
      
      return categoriesWithNotesAndGroups;
      
    } catch (error) {
      console.error('Failed to get categories with notes and groups:', error.message);
      throw new Error(`Failed to retrieve categories with notes and groups: ${error.message}`);
    }
  }

  async shutdown() {
    if (this.initialized) {
      await api.shutdown();
      this.initialized = false;
      console.log('Actual Budget client shutdown');
    }
  }

  async getTransactions(accountId, startDate, endDate) {
    await this.ensureInitialized();
    
    // Input validation
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error('Dates must be in YYYY-MM-DD format');
    }
    
    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date cannot be after end date');
    }
    
    try {
      const transactions = await api.getTransactions(accountId, startDate, endDate);
      return transactions || [];
    } catch (error) {
      console.error('Failed to get transactions:', error.message);
      throw new Error(`Failed to retrieve transactions: ${error.message}`);
    }
  }

  async addTransaction(transactionData) {
    await this.ensureInitialized();
    
    // Validate required fields
    const { account_id, date, amount, payee_name, category_id, notes = '', subtransactions } = transactionData;
    
    if (!account_id) {
      throw new Error('Account ID is required');
    }
    
    if (!date || !amount || !payee_name || !category_id) {
      throw new Error('Date, amount, payee_name, and category_id are required');
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }
    
    // Validate amount is integer
    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (in cents)');
    }
    
    // Validate subtransactions if provided
    if (subtransactions && Array.isArray(subtransactions)) {
      if (subtransactions.length === 0) {
        throw new Error('If subtransactions are provided, the array cannot be empty');
      }
      
      // Validate each subtransaction
      for (const subtx of subtransactions) {
        if (!Number.isInteger(subtx.amount)) {
          throw new Error('Subtransaction amounts must be integers (in cents)');
        }
        if (!subtx.category_id) {
          throw new Error('Subtransaction category_id is required');
        }
      }
      
      // Validate that subtransaction amounts sum to main transaction amount
      const subtotalAmount = subtransactions.reduce((sum, subtx) => sum + subtx.amount, 0);
      if (subtotalAmount !== amount) {
        throw new Error(`Subtransaction amounts (${subtotalAmount}) must sum to transaction amount (${amount})`);
      }
    }
    
    try {
      // Translate to Actual Budget API format
      const transaction = {
        date,
        amount,
        payee_name,
        category: category_id,
        notes: notes || ''
      };
      
      // Add subtransactions if provided
      if (subtransactions && subtransactions.length > 0) {
        transaction.subtransactions = subtransactions.map(subtx => ({
          amount: subtx.amount,
          category: subtx.category_id,
          notes: subtx.notes || ''
        }));
      }
      
      // Import the transaction using Actual Budget API
      const result = await api.importTransactions(account_id, [transaction]);
      
      return result;
      
    } catch (error) {
      console.error('Failed to add transaction:', error.message);
      throw new Error(`Failed to add transaction: ${error.message}`);
    }
  }

  async getConnectionStatus() {
    return {
      initialized: this.initialized,
      connecting: this.connecting
    };
  }
}

module.exports = new ActualBudgetClient();