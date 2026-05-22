#!/usr/bin/env node

/**
 * PostToolUse Hook - 需求执行日志更新
 *
 * 触发条件：
 * - toolName 为 Edit、Write 或 Bash
 * - 当前工作目录包含 .requirements
 *
 * 功能：
 * - 记录工具调用到 execution.log
 * - 格式：[timestamp] Tool: {toolName}
 */

import fs from 'fs';
import path from 'path';

/**
 * 从 stdin 读取 JSON 数据
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    process.stdin.on('error', reject);
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    // 读取 stdin 数据
    const input = await readStdin();
    const { toolName, cwd } = input;

    // 检查触发条件
    const targetTools = ['Edit', 'Write', 'Bash'];
    if (!toolName || !targetTools.includes(toolName)) {
      process.stdout.write(JSON.stringify(input));
      return;
    }

    // 检查是否在包含 .requirements 的目录中
    const requirementsDir = path.join(cwd || process.cwd(), '.requirements');
    if (!fs.existsSync(requirementsDir)) {
      process.stdout.write(JSON.stringify(input));
      return;
    }

    // 记录到 execution.log
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Tool: ${toolName}\n`;
    const logPath = path.join(requirementsDir, 'execution.log');

    fs.appendFileSync(logPath, logEntry, 'utf8');

    // 将原样输出到 stdout
    process.stdout.write(JSON.stringify(input));
  } catch (error) {
    // 静默失败，不影响正常流程
    process.stdout.write(JSON.stringify({}));
  }
}

// 执行
main();
