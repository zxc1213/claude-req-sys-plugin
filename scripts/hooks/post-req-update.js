#!/usr/bin/env node

/**
 * PostToolUse Hook - 需求执行日志更新 + 阶段守卫
 *
 * 触发条件：
 * - toolName 为 Edit、Write 或 Bash
 * - 当前工作目录包含 .requirements
 *
 * 功能：
 * - 记录工具调用到 execution.log
 * - 阶段守卫：当活跃需求处于 planning/analyzed 时，警告编辑外部文件
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
 * 检查阶段守卫：活跃需求处于 planning/analyzed 时不允许编辑外部文件
 * @param {string} requirementsDir - .requirements 目录路径
 * @param {string} filePath - 被编辑的文件路径
 * @returns {object|null} 违规信息，或 null 表示未违规
 */
function checkPhaseGate(requirementsDir, filePath) {
  try {
    const activeLink = path.join(requirementsDir, 'ACTIVE');
    const target = fs.readlinkSync(activeLink);
    const reqPath = path.join(requirementsDir, target);

    const metaContent = fs.readFileSync(path.join(reqPath, 'meta.yaml'), 'utf-8');
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

/**
 * 主函数
 */
async function main() {
  try {
    const input = await readStdin();
    const { toolName, toolInput, cwd } = input;

    const targetTools = ['Edit', 'Write', 'Bash'];
    if (!toolName || !targetTools.includes(toolName)) {
      process.stdout.write(JSON.stringify(input));
      return;
    }

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

    // 阶段守卫：Edit/Write 时检查是否违规编辑外部文件
    if ((toolName === 'Edit' || toolName === 'Write') && toolInput) {
      const filePath = toolInput.file_path;
      if (filePath) {
        const violation = checkPhaseGate(requirementsDir, filePath);
        if (violation) {
          console.log();
          console.log(`⚠️ 阶段违规：活跃需求 ${violation.target} 状态为「${violation.status}」`);
          console.log(`  正在编辑: ${path.resolve(filePath)}`);
          console.log('  规则: 状态为 planning/analyzed 时，只能编辑 .requirements/ 内的文档文件');
          console.log('  请先完成 5 阶段文档流程（spec → test-cases → plan），再进行代码修改。');
          console.log();
        }
      }
    }

    process.stdout.write(JSON.stringify(input));
  } catch (error) {
    process.stdout.write(JSON.stringify({}));
  }
}

main();
