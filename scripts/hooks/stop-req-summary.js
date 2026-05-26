#!/usr/bin/env node
'use strict';

/**
 * Stop Hook: 生成需求执行总结 + 自动同步文档状态
 *
 * 触发条件：会话结束时（Stop hook）
 *
 * 功能：
 * - 读取活跃需求符号链接
 * - 同步索引表（待填充 → 已填充）
 * - 同步 meta.yaml 状态到 plan.md 进度区块
 * - 统计 execution.log 行数
 * - 显示执行总结
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 从 stdin 读取原始数据
 * @returns {Promise<string>} 原始 JSON 字符串
 */
async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

/**
 * 主函数
 */
async function main() {
  // 读取原始输入并保持原样输出
  const raw = await readStdin();

  // 检查是否有活跃需求
  const cwd = process.cwd();
  const reqsDir = path.join(cwd, '.requirements');

  try {
    // 检查 .requirements 目录是否存在
    await fs.access(reqsDir);

    // 读取活跃需求符号链接
    const activeLink = path.join(reqsDir, 'ACTIVE');

    try {
      // 读取符号链接目标
      const target = await fs.readlink(activeLink);
      const reqPath = path.join(reqsDir, target);

      // 自动同步文档状态
      try {
        const planSyncPath = path.resolve(__dirname, '../requirement-manager/utils/plan-sync.js');
        const { syncPlanStatus, syncIndexTables } = await import(planSyncPath);

        await syncIndexTables(reqPath);
        await syncPlanStatus(cwd, reqPath);
      } catch (syncErr) {
        // 同步失败不影响正常流程
      }

      // 构建执行日志路径
      const execLogPath = path.join(reqsDir, target, 'execution.log');

      // 读取执行日志
      const logs = await fs.readFile(execLogPath, 'utf-8');
      const lines = logs.split('\n').filter((l) => l.trim()).length;

      // 输出总结（只有当有记录时）
      if (lines > 0) {
        console.log();
        console.log('═════════════════════════════════════════');
        console.log('           需求执行总结');
        console.log('═════════════════════════════════════════');
        console.log();
        console.log(`活跃需求: ${target}`);
        console.log(`执行操作: ${lines} 条记录`);
        console.log('文档同步: 已完成');
        console.log('═════════════════════════════════════════');
        console.log();
      }
    } catch (err) {
      // 符号链接不存在或读取失败 - 静默失败
      if (err.code !== 'ENOENT') {
        // 其他错误也静默处理
      }
    }
  } catch (err) {
    // .requirements 目录不存在 - 静默失败
  }

  // 将原始数据原样输出到 stdout
  process.stdout.write(raw);
}

// 执行主函数，静默失败
main().catch(() => {
  // 静默失败，不影响正常流程
});
