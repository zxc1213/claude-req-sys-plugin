import { describe, it, beforeEach, afterEach } from 'mocha';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DIR = path.join(__dirname, '../temp-test-phase-gate');

/**
 * Inline copy of checkPhaseGate logic for unit testing
 * (the hook file doesn't export this function)
 */
function checkPhaseGate(requirementsDir, filePath) {
  try {
    const activeLink = path.join(requirementsDir, 'ACTIVE');
    const target = fsSync.readlinkSync(activeLink);
    const reqPath = path.join(requirementsDir, target);

    const metaContent = fsSync.readFileSync(path.join(reqPath, 'meta.yaml'), 'utf-8');
    const statusMatch = metaContent.match(/^status:\s*(.+)$/m);
    if (!statusMatch) return null;

    const status = statusMatch[1].trim().replace(/^["']|["']$/g, '');
    if (!['planning', 'analyzed'].includes(status)) return null;

    const absReqsDir = path.resolve(requirementsDir);
    const absFilePath = path.resolve(filePath);

    if (absFilePath.startsWith(absReqsDir + path.sep) || absFilePath.startsWith(absReqsDir + '/')) {
      return null;
    }

    return { status, target };
  } catch (_err) {
    return null;
  }
}

describe('Phase Gate - checkPhaseGate', () => {
  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it('should return null when no ACTIVE symlink exists', () => {
    const reqsDir = path.join(TEST_DIR, '.requirements-noactive');
    const result = checkPhaseGate(reqsDir, '/some/file.js');
    expect(result).to.be.null;
  });

  it('should return null when editing files inside .requirements/', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-001');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-001'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(
      path.join(reqPath, 'meta.yaml'),
      'id: BUG-001\ntype: bug\nstatus: planning\n',
      'utf-8'
    );

    const result = checkPhaseGate(reqsDir, path.join(reqsDir, 'bugs', 'BUG-001', 'spec.md'));
    expect(result).to.be.null;
  });

  it('should return violation when editing external file with planning status', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-002');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-002'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(
      path.join(reqPath, 'meta.yaml'),
      'id: BUG-002\ntype: bug\nstatus: planning\n',
      'utf-8'
    );

    const result = checkPhaseGate(reqsDir, path.join(TEST_DIR, 'src', 'index.js'));
    expect(result).to.not.be.null;
    expect(result.status).to.equal('planning');
    expect(result.target).to.equal(path.join('bugs', 'BUG-002'));
  });

  it('should return violation when status is analyzed', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-003');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-003'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(
      path.join(reqPath, 'meta.yaml'),
      'id: BUG-003\ntype: bug\nstatus: analyzed\n',
      'utf-8'
    );

    const result = checkPhaseGate(reqsDir, '/some/src/app.js');
    expect(result).to.not.be.null;
    expect(result.status).to.equal('analyzed');
  });

  it('should return null when status is implementing (no lock)', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-004');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-004'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(
      path.join(reqPath, 'meta.yaml'),
      'id: BUG-004\ntype: bug\nstatus: implementing\n',
      'utf-8'
    );

    const result = checkPhaseGate(reqsDir, '/some/src/app.js');
    expect(result).to.be.null;
  });

  it('should return null when meta.yaml has no status field', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-005');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-005'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(path.join(reqPath, 'meta.yaml'), 'id: BUG-005\ntype: bug\n', 'utf-8');

    const result = checkPhaseGate(reqsDir, '/some/src/app.js');
    expect(result).to.be.null;
  });

  it('should handle quoted status values', async () => {
    const reqsDir = path.join(TEST_DIR, '.requirements');
    const reqPath = path.join(reqsDir, 'bugs', 'BUG-006');
    await fs.mkdir(reqPath, { recursive: true });
    await fs.symlink(path.join('bugs', 'BUG-006'), path.join(reqsDir, 'ACTIVE'));
    await fs.writeFile(
      path.join(reqPath, 'meta.yaml'),
      'id: BUG-006\ntype: bug\nstatus: "planning"\n',
      'utf-8'
    );

    const result = checkPhaseGate(reqsDir, '/some/src/app.js');
    expect(result).to.not.be.null;
    expect(result.status).to.equal('planning');
  });
});
