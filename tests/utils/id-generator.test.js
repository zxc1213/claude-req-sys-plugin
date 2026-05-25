import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { generate, parse, reset } from '../../scripts/requirement-manager/utils/id-generator.js';

describe('ID Generator Utility', () => {
  beforeEach(async () => {
    await reset();
  });

  describe('generate(type)', () => {
    it('should generate feature ID with correct format', async () => {
      const id = await generate('feature');
      expect(id).to.match(/^FEAT-\d{8}-\d{3}$/);
    });

    it('should generate sequential IDs', async () => {
      const id1 = await generate('feature');
      const id2 = await generate('feature');
      const parts1 = id1.split('-');
      const parts2 = id2.split('-');
      expect(Number(parts2[2])).to.equal(Number(parts1[2]) + 1);
    });
  });

  describe('parse(id)', () => {
    it('should parse feature ID with date format correctly', async () => {
      const id = await generate('feature');
      const parsed = parse(id);
      expect(parsed).to.include({ type: 'feature', prefix: 'FEAT', number: 1 });
    });

    it('should return null for invalid format', () => {
      const parsed = parse('INVALID-ID');
      expect(parsed).to.be.null;
    });
  });
});
