#!/usr/bin/env node
/**
 * claude-req-sync-plans - 同步需求状态到 plan.md
 *
 * 用法：
 *   claude-req-sync-plans [选项]
 *
 * 选项：
 *   --all, -a       同步所有需求的 plan.md
 *   <需求ID>       同步指定需求的 plan.md
 *   --help, -h     显示帮助信息
 *
 * 示例：
 *   claude-req-sync-plans --all
 *   claude-req-sync-plans BUG-20260523-001
 *   claude-req-sync-plans -a
 */

import { Processor } from '../scripts/requirement-manager/core/processor.js';
import { syncPlanStatus, syncAllPlans } from '../scripts/requirement-manager/utils/plan-sync.js';

async function main() {
  const args = process.argv.slice(2);
  const baseDir = process.cwd();

  // 显示帮助
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
claude-req-sync-plans - 同步需求状态到 plan.md

用法:
  claude-req-sync-plans [选项]

选项:
  --all, -a       同步所有需求的 plan.md
  <需求ID>       同步指定需求的 plan.md
  --help, -h     显示帮助信息

示例:
  claude-req-sync-plans --all          # 同步所有需求
  claude-req-sync-plans BUG-001       # 同步指定需求
  claude-req-sync-plans -a             # 同步所有需求（简写）
`);
    return;
  }

  try {
    const processor = new Processor(baseDir);
    await processor.rebuildIndex();

    // 同步所有需求
    if (args.includes('--all') || args.includes('-a')) {
      console.log('🔄 同步所有需求的 plan.md...');

      const reqPaths = [];
      for (const [_id, reqPath] of processor.index) {
        reqPaths.push(reqPath);
      }

      const results = await syncAllPlans(baseDir, reqPaths);

      console.log(`✓ 同步完成`);
      console.log(`  总计: ${results.total}`);
      console.log(`  成功: ${results.succeeded}`);
      console.log(`  跳过: ${results.skipped}`);
      console.log(`  失败: ${results.failed}`);
      return;
    }

    // 同步单个需求
    const reqId = args[0];
    console.log(`🔄 同步需求 ${reqId} 的 plan.md...`);

    const reqPath = processor.getRequirementPath(reqId);

    if (!reqPath) {
      console.error(`✗ 需求不存在: ${reqId}`);
      process.exit(1);
    }

    const result = await syncPlanStatus(baseDir, reqPath);

    if (result) {
      console.log(`✓ 同步完成`);
    } else {
      console.log(`ℹ️  跳过（plan.md 不存在）`);
    }
  } catch (error) {
    console.error(`✗ 同步失败: ${error.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('系统错误:', error);
  process.exit(1);
});
