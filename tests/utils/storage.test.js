import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import path from 'path';
import fs from 'fs/promises';
import {
  init,
  exists,
  createRequirementDir,
  readMeta,
  writeMeta,
  cleanup,
} from '../../scripts/requirement-manager/utils/storage.js';

const TEST_BASE_DIR = path.join(__dirname, '../temp-test-storage');

describe('Storage Utility', () => {
  beforeEach(async () => {
    await cleanup(TEST_BASE_DIR);
  });

  afterEach(async () => {
    await cleanup(TEST_BASE_DIR);
  });

  describe('init(baseDir)', () => {
    it('should create directory structure', async () => {
      await init(TEST_BASE_DIR);
      const dirExists = await exists(TEST_BASE_DIR);
      expect(dirExists).toBe(true);
    });
  });

  describe('createRequirementDir(baseDir, type, id)', () => {
    it('should create feature requirement directory', async () => {
      await init(TEST_BASE_DIR);
      const reqPath = await createRequirementDir(TEST_BASE_DIR, 'feature', 'FEAT-001');
      expect(reqPath).toContain('FEAT-001');
      const metaFile = path.join(reqPath, 'meta.yaml');
      const metaExists = await exists(metaFile);
      expect(metaExists).toBe(true);
    });
  });

  describe('readMeta(baseDir, reqPath)', () => {
    it('should read existing metadata', async () => {
      await init(TEST_BASE_DIR);
      const reqPath = await createRequirementDir(TEST_BASE_DIR, 'feature', 'FEAT-002');
      const meta = await readMeta(TEST_BASE_DIR, reqPath);
      expect(meta).toBeTruthy();
      expect(meta.id).toBe('FEAT-002');
      expect(meta.type).toBe('feature');
    });
  });

  describe('cleanup(testDir)', () => {
    it('should remove test directory', async () => {
      await init(TEST_BASE_DIR);
      const existsBefore = await exists(TEST_BASE_DIR);
      expect(existsBefore).toBe(true);
      await cleanup(TEST_BASE_DIR);
      const existsAfter = await exists(TEST_BASE_DIR);
      expect(existsAfter).toBe(false);
    });
  });
});
