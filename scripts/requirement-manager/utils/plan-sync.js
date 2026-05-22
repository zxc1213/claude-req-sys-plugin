/**
 * Plan 同步模块 - 同步 meta.yaml 状态到 plan.md
 *
 * 解决问题：当需求状态更新时，plan.md 中的状态保持不变
 * 解决方案：在状态更新时自动同步进度信息到 plan.md
 *
 * 功能：
 * - syncPlanStatus() - 同步整体状态到进度区块
 * - syncAcceptanceCriteria() - 同步验收标准复选框
 */

import { readMeta } from './storage.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * 进度区块模板（精简版）
 */
const PROGRESS_BLOCK_TEMPLATE = `## 实时进度

> **状态**: \`{{STATUS}}\` | **完成度**: {{COMPLETION_PERCENT}}% | **更新**: {{UPDATED_AT}}

---

`;

/**
 * 同步 meta.yaml 状态到 plan.md
 * @param {string} baseDir - 基础目录
 * @param {string} reqPath - 需求路径
 * @returns {Promise<boolean>} 是否成功同步
 */
export async function syncPlanStatus(baseDir, reqPath) {
  try {
    const meta = await readMeta(baseDir, reqPath);
    const planPath = path.join(reqPath, 'plan.md');

    // 检查 plan.md 是否存在
    try {
      await fs.access(planPath);
    } catch {
      // plan.md 不存在，静默跳过
      return false;
    }

    const planContent = await fs.readFile(planPath, 'utf-8');
    const progressBlock = generateProgressBlock(meta);

    // 检查是否已有进度区块
    const hasProgressBlock = planContent.includes('## 实时进度');

    let updatedPlan;

    if (hasProgressBlock) {
      // 替换现有进度区块
      updatedPlan = planContent.replace(
        /## 实时进度[\s\S]*?(?=\n## |\n---|$)/,
        progressBlock.trim() + '\n\n'
      );
    } else {
      // 在文件顶部插入进度区块
      const titleMatch = planContent.match(/^#.*$/m);
      if (titleMatch) {
        const insertPosition = titleMatch.index + titleMatch[0].length;
        updatedPlan =
          planContent.slice(0, insertPosition) +
          '\n\n' +
          progressBlock +
          planContent.slice(insertPosition);
      } else {
        // 如果没有标题，直接在开头添加
        updatedPlan = progressBlock + planContent;
      }
    }

    // 同步验收标准章节（无论是否有进度区块）
    updatedPlan = syncAcceptanceCriteria(updatedPlan, meta.status);

    await fs.writeFile(planPath, updatedPlan, 'utf-8');
    return true;
  } catch (error) {
    // 静默处理错误，不影响主流程
    console.debug(`Plan sync skipped: ${error.message}`);
    return false;
  }
}

/**
 * 生成进度区块内容
 * @param {object} meta - 需求元数据
 * @returns {string} 进度区块 Markdown
 */
function generateProgressBlock(meta) {
  const completionPercent = calculateCompletion(meta);
  const updatedAt = meta.updatedAt || new Date().toISOString();

  return PROGRESS_BLOCK_TEMPLATE.replace('{{STATUS}}', meta.status)
    .replace('{{UPDATED_AT}}', formatDateTime(updatedAt))
    .replace('{{COMPLETION_PERCENT}}', completionPercent);
}

/**
 * 基于 status 计算完成度
 * @param {object} meta - 需求元数据
 * @returns {number} 完成百分比 (0-100)
 */
function calculateCompletion(meta) {
  switch (meta.status) {
    case 'open':
      return 0;
    case 'completed':
      return 100;
    case 'in_progress':
      return 50;
    case 'blocked':
      return 25;
    default:
      return 0;
  }
}

/**
 * 格式化日期时间
 * @param {string} isoString - ISO 8601 日期字符串
 * @returns {string} 格式化的日期时间
 */
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 批量同步多个需求的 plan.md
 * @param {string} baseDir - 基础目录
 * @param {string[]} reqPaths - 需求路径数组
 * @returns {Promise<object>} 同步结果统计
 */
export async function syncAllPlans(baseDir, reqPaths) {
  const results = {
    total: reqPaths.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
  };

  for (const reqPath of reqPaths) {
    const result = await syncPlanStatus(baseDir, reqPath);
    if (result) {
      results.succeeded++;
    } else {
      results.skipped++;
    }
  }

  return results;
}

/**
 * 同步验收标准章节的复选框状态
 * @param {string} planContent - plan.md 内容
 * @param {string} status - 需求状态
 * @returns {string} 更新后的 plan.md 内容
 */
function syncAcceptanceCriteria(planContent, status) {
  // 查找验收标准章节
  const acceptanceRegex = /## 验收标准[\s\S]*?(?=\n## |\n---|$)/;

  const match = planContent.match(acceptanceRegex);
  if (!match) {
    // 没有验收标准章节，返回原内容
    return planContent;
  }

  const acceptanceSection = match[0];
  let updatedSection = acceptanceSection;

  if (status === 'completed') {
    // 已完成：将所有未勾选项改为已勾选
    updatedSection = acceptanceSection.replace(/^- \[ \]/gm, '- [x]');
  } else if (status === 'open') {
    // 未开始：将所有已勾选项改为未勾选
    updatedSection = acceptanceSection.replace(/^- \[x\]/gm, '- [ ]');
  }
  // in_progress 状态保持原样

  // 替换验收标准章节
  return planContent.replace(acceptanceRegex, updatedSection);
}
