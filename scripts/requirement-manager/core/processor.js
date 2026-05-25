/**
 * 需求处理器 - 处理需求的核心逻辑
 */

import { generate } from '../utils/id-generator.js';
import { createRequirementDir, readMeta, writeMeta, exists } from '../utils/storage.js';
import { trackDocuments } from '../utils/document-tracker.js';
import { syncPlanStatus } from '../utils/plan-sync.js';
import path from 'path';
import fs from 'fs/promises';
import { getKnowledgeGraph } from '../../knowledge-graph/index.js';
import { fileURLToPath } from 'url';

/**
 * Templates directory path (resolved relative to this module)
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates');

/**
 * 类型到前缀的映射
 */
const TYPE_PREFIXES = {
  feature: 'FEAT',
  bug: 'BUG',
  question: 'QUES',
  adjustment: 'ADJU',
  refactor: 'REF',
};

/**
 * 类型到目录的映射
 */
const TYPE_DIRS = {
  feature: 'features',
  bug: 'bugs',
  question: 'questions',
  adjustment: 'adjustments',
  refactor: 'refactors',
};

/**
 * 命令标志到类型的映射
 */
const FLAG_MAPPING = {
  '--bug': 'bug',
  '-b': 'bug',
  '--question': 'question',
  '-q': 'question',
  '--adjust': 'adjustment',
  '-a': 'adjustment',
  '--adj': 'adjustment',
  '--refactor': 'refactor',
  '-r': 'refactor',
  '--ref': 'refactor',
  '--auto': 'auto',
  '--feature': 'feature',
  '-f': 'feature',
};


/**
 * Load template file and substitute ${KEY} placeholders
 */
async function loadTemplate(templateName, vars) {
  const tplPath = path.join(TEMPLATES_DIR, templateName);
  const tpl = await fs.readFile(tplPath, 'utf-8');
  let result = tpl;
  for (const [key, val] of Object.entries(vars)) {
    result = result.split(`\${${key}}`).join(String(val));
  }
  return result;
}

/**
 * 需求处理器类
 */
export class Processor {
  /**
   * 构造函数
   * @param {string} baseDir - 基础目录路径
   */
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.requirementsDir = path.join(baseDir, '.requirements');
    this.index = new Map(); // ID 到路径的缓存索引
  }

  /**
   * 解析命令输入，提取类型、模式和描述
   * @param {string} input - 命令输入，例如 "/req --bug something is broken"
   * @returns {object} 包含 type, mode, description 的对象
   */
  static parseType(input) {
    // 移除 /req 前缀（如果存在）
    let cleanedInput = input.replace(/^\/req\s*/, '').trim();

    // 初始化默认值
    let type = 'feature';
    let mode = 'semi_auto';
    let description;

    // 检查是否是 --auto 模式
    if (cleanedInput.startsWith('--auto')) {
      mode = 'full_auto';
      cleanedInput = cleanedInput.replace(/^--auto\s*/, '').trim();
    }

    // 检查其他标志
    for (const [flag, flagType] of Object.entries(FLAG_MAPPING)) {
      if (flag === '--auto') continue; // 已经处理过

      if (cleanedInput.startsWith(flag)) {
        if (flagType !== 'auto') {
          type = flagType;
        }
        cleanedInput = cleanedInput.replace(new RegExp(`^${flag}\\s*`), '').trim();
        break;
      }
    }

    // 剩余部分作为描述
    description = cleanedInput;

    return {
      type,
      mode,
      description,
    };
  }

  /**
   * 创建新需求
   * @param {object} parsed - 解析后的需求对象 { type, mode, description }
   * @returns {Promise<object>} 包含 id 和 path 的对象
   */
  async create(parsed) {
    const { type, mode, description } = parsed;

    // 生成 ID (现在生成ID是异步操作)
    const id = await generate(type);
    const prefix = TYPE_PREFIXES[type];

    // 确定类型目录
    const typeDir = TYPE_DIRS[type] || `${type}s`;

    // 创建目录结构
    const reqPath = path.join(this.requirementsDir, typeDir, id);

    try {
      await fs.mkdir(reqPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create requirement directory: ${error.message}`, { cause: error });
    }

    // 创建元数据
    const now = new Date().toISOString();
    const meta = {
      id,
      type,
      title: description.split('\n')[0].substring(0, 100), // 第一行作为标题，限制长度
      description,
      created: now,
      status: 'open',
      priority: 'medium',
      mode,
      tags: [],
    };

    await writeMeta(this.baseDir, reqPath, meta);

    // 创建原始需求文件
    const rawPath = path.join(reqPath, 'raw.md');
    const rawContent = `# ${description}\n\n${description}`;
    await fs.writeFile(rawPath, rawContent, 'utf-8');

    // 创建 Claude 上下文文件，告诉 superpowers 技能应该将文档保存到这里
    const contextPath = path.join(reqPath, '.claude-context.md');
    const contextContent = `# Claude 上下文文件

## 当前需求

- **ID**: ${id}
- **类型**: ${type}
- **状态**: ${meta.status}
- **创建时间**: ${meta.created}

## 需求描述

${description}

## 文档保存指引

**重要**: 当使用 superpowers 技能（如 brainstorming、systematic-debugging、writing-plans 等）分析此需求时，请将生成的文档保存到当前目录（\`${reqPath}\`）。

### 推荐的文档文件名：

- **设计文档**: \`design.md\` 或 \`spec.md\`
- **分析报告**: \`analysis.md\` 或 \`report.md\`
- **实施计划**: \`plan.md\` 或 \`implementation-plan.md\`
- **测试计划**: \`test-plan.md\`
- **会议记录**: \`meeting-YYYY-MM-DD.md\`
- **决策记录**: \`decisions.md\`

### 更新 meta.yaml

在添加新文档后，请更新 \`meta.yaml\` 中的相关字段：
- \`status\`: 更新需求状态
- \`tags\`: 添加相关标签
- 其他相关元数据

---
*此文件由 req 系统自动生成，请勿删除*
`;
    await fs.writeFile(contextPath, contextContent, 'utf-8');

    // 预生成骨架文件，避免后续步骤遗漏
    const title = meta.title;
    const date = now.slice(0, 10);
    await fs.writeFile(
      path.join(reqPath, 'spec.md'),
      await loadTemplate('spec.md.tpl', { ID: id, TYPE: type, TITLE: title, DATE: date }),
      'utf-8'
    );
    await fs.writeFile(
      path.join(reqPath, 'plan.md'),
      await loadTemplate('plan.md.tpl', { ID: id, TITLE: title, DATE: date }),
      'utf-8'
    );
    await fs.writeFile(
      path.join(reqPath, 'test-cases.md'),
      await loadTemplate('test-cases.md.tpl', { ID: id, TITLE: title, DATE: date }),
      'utf-8'
    );

    // 更新索引
    this.index.set(id, reqPath);

    // 同步到知识图谱
    try {
      const graph = await getKnowledgeGraph(this.baseDir);
      await graph.addRequirement({
        id,
        type,
        title: meta.title,
        description: meta.description,
        priority: { level: meta.priority, score: 7.0 },
        status: meta.status,
        tags: meta.tags || [],
        keywords: [],
        createdAt: meta.created,
        updatedAt: meta.created,
      });
    } catch (_error) {
      // 知识图谱同步失败不影响主流程
    }

    return {
      id,
      path: reqPath,
    };
  }

  /**
   * 更新需求状态
   * @param {string} id - 需求 ID
   * @param {object} updates - 要更新的字段
   * @returns {Promise<void>}
   */
  async update(id, updates) {
    const reqPath = this.getRequirementPath(id);

    if (!reqPath) {
      throw new Error(`Requirement not found: ${id}`);
    }

    // 读取现有元数据
    const meta = await readMeta(this.baseDir, reqPath);

    if (!meta) {
      throw new Error(`Metadata not found for requirement: ${id}`);
    }

    // 更新字段
    const updatedMeta = {
      ...meta,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 写回元数据
    await writeMeta(this.baseDir, reqPath, updatedMeta);

    // 同步状态到 plan.md
    await syncPlanStatus(this.baseDir, reqPath);

    // 同步到知识图谱
    try {
      const graph = await getKnowledgeGraph(this.baseDir);
      await graph.updateRequirement(id, {
        status: updatedMeta.status,
        title: updatedMeta.title,
        description: updatedMeta.description,
      });
    } catch (_error) {
      // 知识图谱同步失败不影响主流程
    }
  }

  /**
   * 跟踪需求文档变化并更新元数据
   * @param {string} id - 需求 ID
   * @returns {Promise<object>} 更新后的元数据
   */
  async trackDocuments(id) {
    const reqPath = this.getRequirementPath(id);

    if (!reqPath) {
      throw new Error(`Requirement not found: ${id}`);
    }

    // 使用 document-tracker 更新元数据
    const updatedMeta = await trackDocuments(this.baseDir, reqPath);

    // 同步到知识图谱
    try {
      const graph = await getKnowledgeGraph(this.baseDir);
      await graph.updateRequirement(id, {
        status: updatedMeta.status,
        title: updatedMeta.title,
        description: updatedMeta.description,
      });
    } catch (_error) {
      // 知识图谱同步失败不影响主流程
    }

    return updatedMeta;
  }

  /**
   * 获取需求详情
   * @param {string} id - 需求 ID
   * @returns {Promise<object>} 需求详情对象
   */
  async get(id) {
    const reqPath = this.getRequirementPath(id);

    if (!reqPath) {
      throw new Error(`Requirement not found: ${id}`);
    }

    const meta = await readMeta(this.baseDir, reqPath);

    if (!meta) {
      throw new Error(`Metadata not found for requirement: ${id}`);
    }

    return meta;
  }

  /**
   * 获取需求路径
   * @param {string} id - 需求 ID
   * @returns {string|null} 需求路径，如果不存在则返回 null
   */
  getRequirementPath(id) {
    // 如果索引中有，直接返回
    if (this.index.has(id)) {
      return this.index.get(id);
    }

    // 否则，搜索文件系统
    // 从 ID 解析类型
    const prefix = id.split('-')[0];
    const type = Object.entries(TYPE_PREFIXES).find(([, p]) => p === prefix)?.[0];

    if (!type) {
      return null;
    }

    const typeDir = TYPE_DIRS[type] || `${type}s`;
    const reqPath = path.join(this.requirementsDir, typeDir, id);

    // 验证路径是否存在
    return reqPath;
  }

  /**
   * 删除需求
   * @param {string} id - 需求 ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const reqPath = this.getRequirementPath(id);

    if (!reqPath) {
      return false;
    }

    try {
      // 删除目录
      await fs.rm(reqPath, { recursive: true, force: true });

      // 从索引中移除
      this.index.delete(id);

      // 从知识图谱中移除
      try {
        const graph = await getKnowledgeGraph(this.baseDir);
        await graph.deleteRequirement(id);
      } catch (_error) {
        // 知识图谱同步失败不影响主流程
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete requirement: ${error.message}`, { cause: error });
    }
  }

  /**
   * 重建索引（扫描文件系统）
   * @returns {Promise<void>}
   */
  async rebuildIndex() {
    this.index.clear();

    for (const [type, dir] of Object.entries(TYPE_DIRS)) {
      const typePath = path.join(this.requirementsDir, dir);

      try {
        const entries = await fs.readdir(typePath, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            this.index.set(entry.name, path.join(typePath, entry.name));
          }
        }
      } catch (error) {
        // 忽略不存在的目录
        if (error.code !== 'ENOENT') {
          console.error(`Error scanning directory ${typePath}:`, error);
        }
      }
    }
  }
}

export default Processor;
