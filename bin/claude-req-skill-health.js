#!/usr/bin/env node

/**
 * claude-req-skill-health - 技能健康检查命令
 * 检查 Superpowers 技能的可用性和版本
 */

import { fullCheck, quickCheck } from '../scripts/requirement-manager/utils/skills-health.js';
import path from 'path';
import fs from 'fs/promises';

/**
 * 获取当前项目基础目录
 * @returns {string} 基础目录路径
 */
async function getBaseDir() {
  // 从当前工作目录开始向上查找 .claude 目录
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const claudeDir = path.join(currentDir, '.claude');
    try {
      const stat = await fs.stat(claudeDir);
      if (stat.isDirectory()) {
        return currentDir;
      }
    } catch (_error) {
      // 继续向上查找
    }
    currentDir = path.dirname(currentDir);
  }

  // 如果找不到，使用当前目录
  return process.cwd();
}

/**
 * 解析命令行参数
 * @returns {object} 解析后的参数
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    json: false,
    quiet: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--json' || arg === '-j') {
      options.json = true;
    } else if (arg === '--quiet' || arg === '-q') {
      options.quiet = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
claude-req-skill-health - 技能健康检查工具

用法:
  claude-req-skill-health [选项]

选项:
  -j, --json       以 JSON 格式输出
  -q, --quiet      仅显示摘要
  -h, --help       显示帮助信息

示例:
  claude-req-skill-health           # 完整健康检查
  claude-req-skill-health --quiet   # 仅显示摘要
  claude-req-skill-health --json    # JSON 格式输出

报告类型:
  - analysis:   分析类技能 (brainstorming)
  - debugging:  调试类技能 (systematic-debugging)
  - research:   研究类技能 (research)
  - exploration: 探索类技能 (code-explorer)
  - planning:   计划类技能 (writing-plans)
`);
}

/**
 * 主函数
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  try {
    const baseDir = await getBaseDir();

    if (options.quiet) {
      // 快速检查模式
      const summary = await quickCheck(baseDir);
      console.log(summary);
    } else if (options.json) {
      // JSON 输出模式
      const { SkillsHealthChecker } =
        await import('../scripts/requirement-manager/utils/skills-health.js');
      const checker = new SkillsHealthChecker(baseDir);
      const results = await checker.checkAllSkills();
      const report = checker.generateJsonReport(results);
      console.log(JSON.stringify(report, null, 2));
    } else {
      // 完整报告模式
      const report = await fullCheck(baseDir);
      console.log(report);
    }

    process.exit(0);
  } catch (error) {
    console.error(`❌ 错误: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
main();
