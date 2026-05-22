/**
 * 文档跟踪器 - 跟踪需求目录中的文档变化
 * 自动更新 meta.yaml 当新文档被添加时
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

/**
 * 扫描需求目录中的文档
 * @param {string} reqPath - 需求目录路径
 * @returns {Promise<string[]>} 文档文件列表
 */
export async function scanDocuments(reqPath) {
  try {
    const files = await fs.readdir(reqPath);
    return files.filter(
      (file) =>
        file.endsWith('.md') &&
        file !== 'raw.md' &&
        file !== '.claude-context.md' &&
        !file.startsWith('.')
    );
  } catch (error) {
    return [];
  }
}

/**
 * 更新需求元数据以反映文档变化
 * @param {string} baseDir - 基础目录
 * @param {string} reqPath - 需求目录路径
 * @returns {Promise<object>} 更新后的元数据
 */
export async function trackDocuments(baseDir, reqPath) {
  const metaPath = path.join(reqPath, 'meta.yaml');

  try {
    // 读取现有元数据
    const content = await fs.readFile(metaPath, 'utf-8');
    const meta = yaml.load(content);

    // 扫描文档
    const documents = await scanDocuments(reqPath);

    // 更新文档列表
    const updatedMeta = {
      ...meta,
      documents,
      documentCount: documents.length,
      updatedAt: new Date().toISOString(),
    };

    // 如果有文档且状态是 open，自动更新为 in_progress
    if (documents.length > 0 && meta.status === 'open') {
      updatedMeta.status = 'in_progress';
    }

    // 写回元数据
    const yamlContent = yaml.dump(updatedMeta, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
    await fs.writeFile(metaPath, yamlContent, 'utf-8');

    return updatedMeta;
  } catch (error) {
    throw new Error(`Failed to track documents: ${error.message}`);
  }
}

/**
 * 添加文档并自动更新元数据
 * @param {string} baseDir - 基础目录
 * @param {string} reqPath - 需求目录路径
 * @param {string} docName - 文档名称
 * @param {string} content - 文档内容
 * @returns {Promise<void>}
 */
export async function addDocument(baseDir, reqPath, docName, content) {
  const docPath = path.join(reqPath, docName);

  // 写入文档
  await fs.writeFile(docPath, content, 'utf-8');

  // 更新元数据
  await trackDocuments(baseDir, reqPath);
}

/**
 * 获取文档变化摘要
 * @param {string} reqPath - 需求目录路径
 * @returns {Promise<string>} 变化摘要
 */
export async function getDocumentSummary(reqPath) {
  const documents = await scanDocuments(reqPath);

  if (documents.length === 0) {
    return '暂无文档';
  }

  const summary = documents.map((doc) => `  - ${doc}`).join('\n');
  return `文档列表 (${documents.length}):\n${summary}`;
}

export default {
  scanDocuments,
  trackDocuments,
  addDocument,
  getDocumentSummary,
};
