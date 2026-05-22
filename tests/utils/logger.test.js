import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import { info, warn, error, success } from '../../scripts/requirement-manager/utils/logger.js';

const TEST_BASE_DIR = path.join(__dirname, '../temp-test-logger');

describe('Logger Utility', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_BASE_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_BASE_DIR, { recursive: true, force: true });
  });

  describe('info(reqId, message)', () => {
    it('should log info message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'info.log');
      await info('REQ-004', 'Info test', logPath);
      const content = await fs.readFile(logPath, 'utf-8');
      expect(content).toContain('Info test');
      expect(content).toContain('[INFO]');
    });
  });

  describe('warn(reqId, message)', () => {
    it('should log warning message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'warn.log');
      await warn('REQ-005', 'Warning test', logPath);
      const content = await fs.readFile(logPath, 'utf-8');
      expect(content).toContain('Warning test');
      expect(content).toContain('[WARN]');
    });
  });

  describe('error(reqId, message)', () => {
    it('should log error message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'error2.log');
      await error('REQ-006', 'Error test', logPath);
      const content = await fs.readFile(logPath, 'utf-8');
      expect(content).toContain('Error test');
      expect(content).toContain('[ERROR]');
    });
  });

  describe('success(reqId, message)', () => {
    it('should log success message', async () => {
      const logPath = path.join(TEST_BASE_DIR, 'success.log');
      await success('REQ-007', 'Success test', logPath);
      const content = await fs.readFile(logPath, 'utf-8');
      expect(content).toContain('Success test');
      expect(content).toContain('[SUCCESS]');
    });
  });
});
