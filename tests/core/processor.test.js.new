/**
 * processor.test.js - 需求处理器测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Processor } from '../../core/processor.js';
import { reset as resetIdGenerator } from '../../utils/id-generator.js';
import { init, cleanup, readMeta, exists } from '../../utils/storage.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试基础目录
const testBaseDir = path.join(__dirname, '..', '..', '..', '..', '.test-requirements');

describe('Processor - parseType', () => {
  it('should parse bug command with short flag', () => {
    const result = Processor.parseType('/req -b something is broken');
    expect(result).toEqual({
      type: 'bug',
      mode: 'semi_auto',
      description: 'something is broken'
    });
  });

  it('should parse bug command with long flag', () => {
    const result = Processor.parseType('/req --bug login error');
    expect(result).toEqual({
      type: 'bug',
      mode: 'semi_auto',
      description: 'login error'
    });
  });

  it('should parse question command with short flag', () => {
    const result = Processor.parseType('/req -q how to use router?');
    expect(result).toEqual({
      type: 'question',
      mode: 'semi_auto',
      description: 'how to use router?'
    });
  });

  it('should parse question command with long flag', () => {
    const result = Processor.parseType('/req --question what is this?');
    expect(result).toEqual({
      type: 'question',
      mode: 'semi_auto',
      description: 'what is this?'
    });
  });

  it('should parse adjustment command with -a flag', () => {
    const result = Processor.parseType('/req -a fix the layout');
    expect(result).toEqual({
      type: 'adjustment',
      mode: 'semi_auto',
      description: 'fix the layout'
    });
  });

  it('should parse adjustment command with --adjust flag', () => {
    const result = Processor.parseType('/req --adjust change color');
    expect(result).toEqual({
      type: 'adjustment',
      mode: 'semi_auto',
      description: 'change color'
    });
  });

  it('should parse adjustment command with --adj flag', () => {
    const result = Processor.parseType('/req --adj update text');
    expect(result).toEqual({
      type: 'adjustment',
      mode: 'semi_auto',
      description: 'update text'
    });
  });

  it('should parse refactor command with short flag', () => {
    const result = Processor.parseType('/req -r cleanup code');
    expect(result).toEqual({
      type: 'refactor',
      mode: 'semi_auto',
      description: 'cleanup code'
    });
  });

  it('should parse refactor command with --refactor flag', () => {
    const result = Processor.parseType('/req --refactor optimize');
    expect(result).toEqual({
      type: 'refactor',
      mode: 'semi_auto',
      description: 'optimize'
    });
  });

  it('should parse refactor command with --ref flag', () => {
    const result = Processor.parseType('/req --ref simplify');
    expect(result).toEqual({
      type: 'refactor',
      mode: 'semi_auto',
      description: 'simplify'
    });
  });

  it('should parse feature command with --auto flag (full_auto mode)', () => {
    const result = Processor.parseType('/req --auto create new feature');
    expect(result).toEqual({
      type: 'feature',
      mode: 'full_auto',
      description: 'create new feature'
    });
  });

  it('should parse feature command with -f flag', () => {
    const result = Processor.parseType('/req -f add button');
    expect(result).toEqual({
      type: 'feature',
      mode: 'semi_auto',
      description: 'add button'
    });
  });

  it('should parse feature command with --feature flag', () => {
    const result = Processor.parseType('/req --feature add component');
    expect(result).toEqual({
      type: 'feature',
      mode: 'semi_auto',
      description: 'add component'
    });
  });

  it('should default to feature type when no flag provided', () => {
    const result = Processor.parseType('/req build something new');
    expect(result).toEqual({
      type: 'feature',
      mode: 'semi_auto',
      description: 'build something new'
    });
  });

  it('should handle empty description', () => {
    const result = Processor.parseType('/req --bug');
    expect(result).toEqual({
      type: 'bug',
      mode: 'semi_auto',
      description: ''
    });
  });

  it('should handle command without /req prefix', () => {
    const result = Processor.parseType('--bug broken');
    expect(result).toEqual({
      type: 'bug',
      mode: 'semi_auto',
      description: 'broken'
    });
  });
});

describe('Processor - create', () => {
  let processor;

  beforeEach(async () => {
    await init(testBaseDir);
    resetIdGenerator();
    processor = new Processor(testBaseDir);
  });

  afterEach(async () => {
    await cleanup(testBaseDir);
  });

  it('should create a bug requirement', async () => {
    const parsed = {
      type: 'bug',
      mode: 'semi_auto',
      description: 'login page crashes'
    };

    const result = await processor.create(parsed);

    expect(result.id).toBe('BUG-0001');
    expect(result.path).toContain('BUG-0001');

    // 验证元数据
    const metaPath = path.join(result.path, 'meta.yaml');
    const metaExists = await exists(metaPath);
    expect(metaExists).toBe(true);

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.id).toBe('BUG-0001');
    expect(meta.type).toBe('bug');
    expect(meta.description).toBe('login page crashes');
    expect(meta.status).toBe('open');
    expect(meta.mode).toBe('semi_auto');
  });

  it('should create a feature requirement', async () => {
    const parsed = {
      type: 'feature',
      mode: 'semi_auto',
      description: 'add user profile page'
    };

    const result = await processor.create(parsed);

    expect(result.id).toBe('FEAT-0001');
    expect(result.path).toContain('FEAT-0001');

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.type).toBe('feature');
    expect(meta.description).toBe('add user profile page');
  });

  it('should create multiple requirements with incrementing IDs', async () => {
    const bug1 = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'bug 1'
    });

    const bug2 = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'bug 2'
    });

    const feature1 = await processor.create({
      type: 'feature',
      mode: 'semi_auto',
      description: 'feature 1'
    });

    expect(bug1.id).toBe('BUG-0001');
    expect(bug2.id).toBe('BUG-0002');
    expect(feature1.id).toBe('FEAT-0001');
  });

  it('should create raw requirement file', async () => {
    const parsed = {
      type: 'bug',
      mode: 'semi_auto',
      description: 'critical error'
    };

    const result = await processor.create(parsed);

    const rawPath = path.join(result.path, 'raw.md');
    const rawExists = await exists(rawPath);
    expect(rawExists).toBe(true);
  });

  it('should create directory structure based on type', async () => {
    const bug = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'bug'
    });

    const feature = await processor.create({
      type: 'feature',
      mode: 'semi_auto',
      description: 'feature'
    });

    expect(bug.path).toContain(path.join('requirements', 'bugs'));
    expect(feature.path).toContain(path.join('requirements', 'features'));
  });

  it('should handle question type', async () => {
    const parsed = {
      type: 'question',
      mode: 'semi_auto',
      description: 'how does this work?'
    };

    const result = await processor.create(parsed);

    expect(result.id).toBe('QUES-0001');
    expect(result.path).toContain('QUES-0001');

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.type).toBe('question');
  });

  it('should handle adjustment type', async () => {
    const parsed = {
      type: 'adjustment',
      mode: 'semi_auto',
      description: 'tweak the layout'
    };

    const result = await processor.create(parsed);

    expect(result.id).toBe('ADJU-0001');

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.type).toBe('adjustment');
  });

  it('should handle refactor type', async () => {
    const parsed = {
      type: 'refactor',
      mode: 'semi_auto',
      description: 'clean up code'
    };

    const result = await processor.create(parsed);

    expect(result.id).toBe('REF-0001');

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.type).toBe('refactor');
  });

  it('should set full_auto mode when --auto is used', async () => {
    const parsed = {
      type: 'feature',
      mode: 'full_auto',
      description: 'automated feature'
    };

    const result = await processor.create(parsed);

    const meta = await readMeta(testBaseDir, result.path);
    expect(meta.mode).toBe('full_auto');
  });
});

describe('Processor - update', () => {
  let processor;

  beforeEach(async () => {
    await init(testBaseDir);
    resetIdGenerator();
    processor = new Processor(testBaseDir);
  });

  afterEach(async () => {
    await cleanup(testBaseDir);
  });

  it('should update requirement status', async () => {
    const created = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'test bug'
    });

    await processor.update(created.id, { status: 'in_progress' });

    const meta = await readMeta(testBaseDir, created.path);
    expect(meta.status).toBe('in_progress');
  });

  it('should update multiple fields', async () => {
    const created = await processor.create({
      type: 'feature',
      mode: 'semi_auto',
      description: 'test feature'
    });

    await processor.update(created.id, {
      status: 'completed',
      priority: 'high',
      title: 'Updated Title'
    });

    const meta = await readMeta(testBaseDir, created.path);
    expect(meta.status).toBe('completed');
    expect(meta.priority).toBe('high');
    expect(meta.title).toBe('Updated Title');
  });

  it('should update tags', async () => {
    const created = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'test bug'
    });

    await processor.update(created.id, {
      tags: ['urgent', 'frontend']
    });

    const meta = await readMeta(testBaseDir, created.path);
    expect(meta.tags).toEqual(['urgent', 'frontend']);
  });

  it('should throw error for non-existent requirement', async () => {
    await expect(
      processor.update('NONEXISTENT-0001', { status: 'completed' })
    ).rejects.toThrow();
  });
});

describe('Processor - get', () => {
  let processor;

  beforeEach(async () => {
    await init(testBaseDir);
    resetIdGenerator();
    processor = new Processor(testBaseDir);
  });

  afterEach(async () => {
    await cleanup(testBaseDir);
  });

  it('should get requirement details', async () => {
    const created = await processor.create({
      type: 'bug',
      mode: 'semi_auto',
      description: 'test bug'
    });

    const result = await processor.get(created.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(created.id);
    expect(result.type).toBe('bug');
    expect(result.description).toBe('test bug');
    expect(result.status).toBe('open');
  });

  it('should throw error for non-existent requirement', async () => {
    await expect(
      processor.get('NONEXISTENT-0001')
    ).rejects.toThrow();
  });

  it('should return complete requirement with all metadata', async () => {
    const created = await processor.create({
      type: 'feature',
      mode: 'full_auto',
      description: 'test feature'
    });

    await processor.update(created.id, {
      title: 'Feature Title',
      tags: ['api', 'backend']
    });

    const result = await processor.get(created.id);

    expect(result.title).toBe('Feature Title');
    expect(result.tags).toEqual(['api', 'backend']);
    expect(result.mode).toBe('full_auto');
    expect(result.created).toBeDefined();
    expect(result.priority).toBe('medium');
  });
});
