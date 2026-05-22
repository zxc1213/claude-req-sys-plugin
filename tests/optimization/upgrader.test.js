import { describe, it, beforeEach, afterEach } from 'vitest';
import { expect } from 'vitest';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import { Upgrader } from '../../scripts/requirement-manager/optimization/upgrader.js';

describe('Upgrader', () => {
  const testDir = '.test-upgrader';

  beforeEach(async () => {
    await fs.mkdir(`${testDir}/.requirements/_system`, { recursive: true });
    await fs.mkdir(`${testDir}/.requirements/_system/versions`, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('#applyUpgrade', () => {
    it('应该应用优化升级', async () => {
      const upgrader = new Upgrader(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            changes: { cache_ttl: 7200 },
          },
        ],
      };

      const result = await upgrader.applyUpgrade(decision);

      expect(result.success).toBeTruthy();
      expect(result.version).toBeTruthy();
      expect(result.applied_actions.length > 0).toBeTruthy();
    });

    it('应该创建升级版本快照', async () => {
      const upgrader = new Upgrader(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            changes: { enable_feature_x: true },
          },
        ],
      };

      const result = await upgrader.applyUpgrade(decision);

      // 验证版本文件已创建
      const versionPath = `${testDir}/.requirements/_system/versions/${result.version}.yaml`;
      const exists = await fs
        .access(versionPath)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBeTruthy();
    });

    it('应该在升级前备份配置', async () => {
      const upgrader = new Upgrader(testDir);

      // 创建初始配置
      const configPath = `${testDir}/.requirements/_system/optimization_config.yaml`;
      await fs.writeFile(configPath, yaml.dump({ key1: 'value1' }));

      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            changes: { key2: 'value2' },
          },
        ],
      };

      const result = await upgrader.applyUpgrade(decision);

      // 验证备份已创建（result.backup 已经包含完整文件名）
      const backupPath = `${testDir}/.requirements/_system/versions/${result.backup}`;
      const backupExists = await fs
        .access(backupPath)
        .then(() => true)
        .catch(() => false);
      expect(backupExists).toBeTruthy();
    });
  });

  describe('#rollback', () => {
    it('应该回滚到指定版本', async () => {
      const upgrader = new Upgrader(testDir);

      // 应用升级
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            changes: { new_setting: true },
          },
        ],
      };

      const upgradeResult = await upgrader.applyUpgrade(decision);
      const version = upgradeResult.version;

      // 回滚
      const rollbackResult = await upgrader.rollback(version);

      expect(rollbackResult.success).toBeTruthy();
      expect(rollbackResult.rollback_to).toBe(version);
    });

    it('应该恢复升级前的配置', async () => {
      const upgrader = new Upgrader(testDir);

      // 创建初始配置
      const configPath = `${testDir}/.requirements/_system/optimization_config.yaml`;
      const originalConfig = { setting: 'original' };
      await fs.writeFile(configPath, yaml.dump(originalConfig));

      // 应用升级
      const decision = {
        id: 'OPT-001',
        actions: [
          {
            id: 'act-1',
            type: 'config_change',
            category: 'cost',
            changes: { setting: 'modified' },
          },
        ],
      };

      const upgradeResult = await upgrader.applyUpgrade(decision);

      // 回滚
      await upgrader.rollback(upgradeResult.version);

      // 验证配置已恢复
      const restoredConfig = yaml.load(await fs.readFile(configPath, 'utf8'));
      expect(restoredConfig).toEqual(originalConfig);
    });
  });

  describe('#getVersion', () => {
    it('应该返回当前版本', async () => {
      const upgrader = new Upgrader(testDir);
      const version = await upgrader.getVersion();

      expect(version).toBeTruthy();
      expect(typeof version === 'string').toBeTruthy();
    });

    it('应该返回系统版本历史', async () => {
      const upgrader = new Upgrader(testDir);

      // 创建几个版本
      await upgrader.applyUpgrade({
        id: 'OPT-001',
        actions: [{ id: 'act-1', type: 'config_change', changes: {} }],
      });
      await upgrader.applyUpgrade({
        id: 'OPT-002',
        actions: [{ id: 'act-2', type: 'config_change', changes: {} }],
      });

      const versions = await upgrader.getVersions();

      expect(Array.isArray(versions)).toBeTruthy();
      expect(versions.length >= 2).toBeTruthy();
    });
  });

  describe('#validateUpgrade', () => {
    it('应该验证升级安全性', async () => {
      const upgrader = new Upgrader(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [{ id: 'act-1', type: 'config_change', category: 'cost' }],
      };

      const validation = await upgrader.validateUpgrade(decision);

      expect(validation.valid).toBeTruthy();
    });

    it('应该拒绝危险升级', async () => {
      const upgrader = new Upgrader(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [{ id: 'act-1', type: 'destructive', category: 'dangerous' }],
      };

      const validation = await upgrader.validateUpgrade(decision);

      expect(!validation.valid).toBeTruthy();
      expect(validation.errors.length > 0).toBeTruthy();
    });

    it('应该检查升级前置条件', async () => {
      const upgrader = new Upgrader(testDir);
      const decision = {
        id: 'OPT-001',
        actions: [
          { id: 'act-1', type: 'config_change', category: 'cost', requires: ['feature_x'] },
        ],
      };

      const validation = await upgrader.validateUpgrade(decision);

      // 缺少前置条件
      expect(!validation.valid).toBeTruthy();
    });
  });

  describe('#createVersion', () => {
    it('应该创建版本快照', async () => {
      const upgrader = new Upgrader(testDir);
      const version = await upgrader.createVersion('test-upgrade', {
        config: { key: 'value' },
        changes: ['change1', 'change2'],
      });

      expect(version).toBeTruthy();
      expect(version.version_number).toBeTruthy();
      expect(version.timestamp).toBeTruthy();
    });

    it('应该保存版本元数据', async () => {
      const upgrader = new Upgrader(testDir);
      const version = await upgrader.createVersion('test-upgrade', {
        config: { key: 'value' },
        changes: ['change1'],
      });

      const versionPath = `${testDir}/.requirements/_system/versions/${version.version_number}.yaml`;
      const versionData = yaml.load(await fs.readFile(versionPath, 'utf8'));

      expect(versionData.name).toBe('test-upgrade');
      expect(versionData.config).toBeTruthy();
      expect(versionData.changes).toBeTruthy();
    });
  });

  describe('#getUpgradeHistory', () => {
    it('应该返回升级历史', async () => {
      const upgrader = new Upgrader(testDir);

      await upgrader.applyUpgrade({
        id: 'OPT-001',
        actions: [{ id: 'act-1', type: 'config_change', changes: {} }],
      });

      const history = await upgrader.getUpgradeHistory();

      expect(Array.isArray(history)).toBeTruthy();
      expect(history.length > 0).toBeTruthy();
      expect(history[0].decision_id).toBe('OPT-001');
    });
  });
});
