import { describe, it, before, beforeEach, expect } from 'vitest';
import { generate, parse, reset } from '../../scripts/requirement-manager/utils/id-generator.js';

describe('ID Generator Utility', () => {
  beforeEach(async () => {
    reset();
  });

  beforeEach(() => {
    reset();
  });

  describe('generate(type)', () => {
    it('should generate feature ID with correct format', () => {
      const id = generate('feature');
      expect(id).toMatch(/^FEAT-\d{4}$/);
    });

    it('should generate sequential IDs', () => {
      const id1 = generate('feature');
      const id2 = generate('feature');
      const num1 = parseInt(id1.split('-')[1]);
      const num2 = parseInt(id2.split('-')[1]);
      expect(num2).toBe(num1 + 1);
    });
  });

  describe('parse(id)', () => {
    it('should parse feature ID correctly', () => {
      const parsed = parse('FEAT-0001');
      expect(parsed).toEqual({
        type: 'feature',
        number: 1,
        prefix: 'FEAT',
      });
    });

    it('should return null for invalid format', () => {
      const parsed = parse('INVALID-ID');
      expect(parsed).toBeNull();
    });
  });
});
