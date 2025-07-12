#!/usr/bin/env node

/**
 * Test script that validates the application can start without errors
 * Used in CI to catch startup issues before deployment
 */

const { spawn } = require('child_process');
const path = require('path');

const STARTUP_TIMEOUT = 15000; // 15 seconds
const SUCCESS_INDICATORS = ['Server listening on', 'server started'];

function testStartup() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Testing application startup...');

    const serverPath = path.join(__dirname, '..', 'src', 'server.js');
    const serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        HTTP_PORT: '0', // Use random available port
        ACTUAL_SERVER_URL: process.env.ACTUAL_SERVER_URL || 'http://localhost:5006',
        ACTUAL_PASSWORD: process.env.ACTUAL_PASSWORD || 'test-password',
        ACTUAL_BUDGET_ID: process.env.ACTUAL_BUDGET_ID || 'test-budget-id',
        ACTUAL_DATA_DIR: './data'
      }
    });

    // let _output = '';
    let errorOutput = '';
    let startupSuccessful = false;

    // Capture stdout
    serverProcess.stdout.on('data', data => {
      const text = data.toString();
      // _output += text;
      console.log(text.trim());

      // Check for success indicators
      if (SUCCESS_INDICATORS.some(indicator => text.includes(indicator))) {
        startupSuccessful = true;
        console.log('✅ Server started successfully');
        serverProcess.kill('SIGTERM');
        resolve();
      }
    });

    // Capture stderr
    serverProcess.stderr.on('data', data => {
      const text = data.toString();
      errorOutput += text;
      console.error(text.trim());
    });

    // Handle process exit
    serverProcess.on('close', code => {
      if (!startupSuccessful) {
        if (code !== 0) {
          reject(new Error(`Server exited with code ${code}. Error output: ${errorOutput}`));
        } else {
          reject(new Error('Server started but did not emit success indicators'));
        }
      }
    });

    // Handle startup timeout
    setTimeout(() => {
      if (!startupSuccessful) {
        serverProcess.kill('SIGKILL');
        reject(new Error(`Server startup timed out after ${STARTUP_TIMEOUT}ms`));
      }
    }, STARTUP_TIMEOUT);

    // Handle process errors
    serverProcess.on('error', error => {
      reject(new Error(`Failed to start server process: ${error.message}`));
    });
  });
}

// Run the test
testStartup()
  .then(() => {
    console.log('🎉 Startup test passed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Startup test failed:', error.message);
    process.exit(1);
  });
