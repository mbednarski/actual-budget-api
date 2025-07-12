require('dotenv').config();

const config = {
  actual: {
    serverURL: process.env.ACTUAL_SERVER_URL || 'http://localhost:5006',
    password: process.env.ACTUAL_PASSWORD || '',
    budgetId: process.env.ACTUAL_BUDGET_ID || '',
    dataDir: process.env.ACTUAL_DATA_DIR || './data'
  },
  server: {
    host: process.env.HTTP_HOST || '127.0.0.1',
    port: parseInt(process.env.HTTP_PORT) || 3000
  }
};

function validateConfig() {
  const required = ['ACTUAL_PASSWORD', 'ACTUAL_BUDGET_ID'];
  const missing = required.filter(key => {
    // eslint-disable-next-line security/detect-object-injection
    const envValue = process.env[key];
    return !envValue;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  config,
  validateConfig
};
