#!/usr/bin/env node
/**
 * claude-req-track - 跟踪需求文档并更新元数据
 *
 * 用法：
 *   claude-req-track <需求ID>
 *
 * 示例：
 *   claude-req-track BUG-20260522-001
 */

import { Processor } from '../scripts/requirement-manager/core/processor.js';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('用法: claude-req-track <需求ID>');
    console.error('示例: claude-req-track BUG-20260522-001');
    process.exit(1);
  }

  const reqId = args[0];
  const baseDir = process.cwd();

  try {
    const processor = new Processor(baseDir);

    console.log(`📋 跟踪需求文档: ${reqId}`);
    console.log('扫描文档并更新元数据...');

    const updatedMeta = await processor.trackDocuments(reqId);

    console.log(`✓ 更新完成`);
    console.log(`  状态: ${updatedMeta.status}`);
    console.log(`  文档数: ${updatedMeta.documentCount || 0}`);

    if (updatedMeta.documents && updatedMeta.documents.length > 0) {
      console.log(`  文档列表:`);
      updatedMeta.documents.forEach((doc) => console.log(`    - ${doc}`));
    }

    console.log(`  更新时间: ${updatedMeta.updatedAt}`);
  } catch (error) {
    console.error(`✗ 更新失败: ${error.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('系统错误:', error);
  process.exit(1);
});
