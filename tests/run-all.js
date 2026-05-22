#!/usr/bin/env node

/**
 * 测试运行脚本
 * 运行所有测试套件并生成汇总报告
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * 运行单个测试文件
 */
async function runTest(testPath) {
  try {
    const startTime = Date.now();
    const output = execSync(`node ${testPath}`, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    const duration = Date.now() - startTime;

    // 解析测试结果
    const lines = output.split('\n');
    const resultLine = lines.find((l) => l.includes('# pass') && l.includes('# fail'));

    let pass = 0,
      fail = 0;
    if (resultLine) {
      const match = resultLine.match(/# pass (\d+)/);
      if (match) pass = parseInt(match[1]);
      const matchFail = resultLine.match(/# fail (\d+)/);
      if (matchFail) fail = parseInt(matchFail[1]);
    }

    return {
      file: path.basename(testPath),
      pass,
      fail,
      duration,
      success: true,
      output,
    };
  } catch (error) {
    return {
      file: path.basename(testPath),
      pass: 0,
      fail: 1,
      duration: 0,
      success: false,
      output: error.stdout || error.message,
    };
  }
}

/**
 * 查找所有测试文件
 */
async function findTests() {
  const tests = [];

  // 递归查找测试文件
  async function findInDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await findInDir(fullPath);
      } else if (entry.name.endsWith('.test.js') && !entry.name.includes('.integration.')) {
        // 单元测试
        tests.push({ type: 'unit', path: fullPath });
      }
    }
  }

  await findInDir(path.join(rootDir, 'tests'));

  return tests;
}

/**
 * 主函数
 */
async function main() {
  console.log(`${colors.cyan}${colors.bright}🧪 运行测试套件${colors.reset}\n`);

  // 查找所有测试
  const tests = await findTests();

  if (tests.length === 0) {
    console.log(`${colors.yellow}未找到测试文件${colors.reset}`);
    process.exit(0);
  }

  console.log(`找到 ${tests.length} 个测试文件\n`);

  // 运行所有测试
  const results = [];
  for (const test of tests) {
    process.stdout.write(`运行 ${colors.dim}${test.file}${colors.reset} ... `);

    const result = await runTest(test.path);
    results.push(result);

    if (result.success && result.fail === 0) {
      console.log(`\r${colors.green}✓${colors.reset} ${result.file} (${result.duration}ms)`);
    } else if (result.success) {
      console.log(
        `\r${colors.yellow}⚠${colors.reset} ${result.file} (${result.pass}✓ ${result.fail}✗ ${result.duration}ms)`
      );
    } else {
      console.log(`\r${colors.red}✗${colors.reset} ${result.file} (错误)`);
    }
  }

  // 生成汇总报告
  console.log(`\n${colors.bright}📊 测试汇总${colors.reset}\n`);

  const totalPass = results.reduce((sum, r) => sum + r.pass, 0);
  const totalFail = results.reduce((sum, r) => sum + r.fail, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`  测试文件: ${results.length}`);
  console.log(`  通过: ${colors.green}${totalPass}${colors.reset}`);
  console.log(`  失败: ${totalFail > 0 ? colors.red : ''}${totalFail}${colors.reset}`);
  console.log(`  总耗时: ${totalDuration}ms`);

  // 详细结果
  if (totalFail > 0) {
    console.log(`\n${colors.yellow}失败的测试:${colors.reset}`);
    results
      .filter((r) => r.fail > 0)
      .forEach((r) => {
        console.log(`  - ${r.file}`);
      });
  }

  // 退出码
  const exitCode = totalFail > 0 ? 1 : 0;
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(`${colors.red}错误: ${error.message}${colors.reset}`);
  process.exit(1);
});
