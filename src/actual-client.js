const api = require('@actual-app/api');
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

  async shutdown() {
    if (this.initialized) {
      await api.shutdown();
      this.initialized = false;
      console.log('Actual Budget client shutdown');
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