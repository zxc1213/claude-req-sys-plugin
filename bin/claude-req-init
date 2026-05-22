#!/usr/bin/env node

/**
 * ClaudeReqSys 项目初始化命令
 * 使用: claude-req-init [--version|-v]
 *
 * 首次运行时自动安装全局配置到 ~/.claude/
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);

// 检查版本参数
if (process.argv.includes('--version') || process.argv.includes('-v')) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  console.log(`claude-req-sys v${packageJson.version}`);
  process.exit(0);
}

const GLOBAL_CLAUDE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');

// 检查是否需要安装全局配置
const needsGlobalSetup = !fs.existsSync(path.join(GLOBAL_CLAUDE, 'commands', 'req.md'));

if (needsGlobalSetup) {
  console.log('🚀 首次运行，正在安装全局配置...\n');

  try {
    // 获取包安装位置
    const packageJsonPath = require.resolve('claude-req-sys/package.json');
    const pkgDir = path.dirname(packageJsonPath);

    // 创建全局目录
    console.log('📁 创建全局目录...');
    fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'commands'), { recursive: true });
    fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'skills'), { recursive: true });
    fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(GLOBAL_CLAUDE, 'scripts', 'hooks'), { recursive: true });

    // 复制命令文件
    console.log('📋 安装命令文件...');
    const commandsDir = path.join(pkgDir, 'src', 'claude', 'commands');
    if (fs.existsSync(commandsDir)) {
      const files = fs.readdirSync(commandsDir);
      files.forEach((file) => {
        if (file.endsWith('.md')) {
          fs.copyFileSync(path.join(commandsDir, file), path.join(GLOBAL_CLAUDE, 'commands', file));
        }
      });
      console.log('  ✓ 命令文件');
    }

    // 复制 hooks 配置
    console.log('⚙️  安装 hooks 配置...');
    const hooksJson = path.join(pkgDir, 'src', 'config', 'hooks.json');
    if (fs.existsSync(hooksJson)) {
      fs.copyFileSync(hooksJson, path.join(GLOBAL_CLAUDE, 'hooks.json'));
      console.log('  ✓ hooks 配置');
    }

    // 复制 hooks 脚本
    console.log('🔧 安装 hooks 脚本...');
    const hooksDir = path.join(pkgDir, 'src', 'scripts', 'hooks');
    if (fs.existsSync(hooksDir)) {
      const files = fs.readdirSync(hooksDir);
      files.forEach((file) => {
        if (file.endsWith('.js')) {
          fs.copyFileSync(
            path.join(hooksDir, file),
            path.join(GLOBAL_CLAUDE, 'scripts', 'hooks', file)
          );
        }
      });
      console.log('  ✓ hooks 脚本');
    }

    // 创建技能符号链接
    console.log('🔗 链接技能文件...');
    const skillsDir = path.join(pkgDir, 'src', 'claude', 'skills');
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir, { withFileTypes: true });

      for (const skill of skills) {
        if (skill.isDirectory()) {
          const skillPath = path.join(skillsDir, skill.name);
          const skillFiles = fs.readdirSync(skillPath);

          for (const file of skillFiles) {
            if (file.startsWith('req-') && file.endsWith('.md')) {
              const sourceFile = path.join(skillPath, file);
              const targetFile = path.join(GLOBAL_CLAUDE, 'skills', file);

              if (fs.existsSync(targetFile)) {
                fs.unlinkSync(targetFile);
              }

              fs.symlinkSync(sourceFile, targetFile);
            }
          }
        }
      }
      console.log('  ✓ 技能链接');
    }

    console.log('\n✅ 全局配置安装完成!\n');
  } catch (error) {
    console.error('❌ 全局配置安装失败:', error.message);
    console.log('\n您可以手动运行安装脚本:');
    console.log('  cd claude-req-sys');
    console.log('  bash install.sh\n');
  }
}

console.log('🎯 ClaudeReqSys 项目初始化\n');

// 获取项目根目录
const projectRoot = process.cwd();

// 创建目录结构
const dirs = [
  '.requirements/features',
  '.requirements/bugs',
  '.requirements/questions',
  '.requirements/adjustments',
  '.requirements/refactorings',
  '.requirements/metrics',
  '.requirements/metrics/reports',
  '.requirements/metrics/exports',
  '.requirements/metrics/trends',
  '.requirements/_system/versions',
  'docs/specs',
  'docs/guides',
  'docs/analysis',
];

console.log('📁 创建项目目录...');
dirs.forEach((dir) => {
  const fullPath = path.join(projectRoot, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`  ✓ ${dir}`);
});

// 初始化度量系统
const metricsConfigPath = path.join(projectRoot, '.requirements/metrics/config.json');
if (!fs.existsSync(metricsConfigPath)) {
  const metricsConfig = {
    metrics: {
      collection: {
        enabled: true,
        interval: 'daily',
        retentionDays: 90,
      },
      targets: {
        cycle_time: 2.0,
        rework_rate: 0.15,
        quality_gate_pass_rate: 0.9,
        user_satisfaction: 4.0,
        completion_rate: 0.9,
      },
      alerts: {
        enabled: true,
        thresholds: {
          cycle_time: { warning: 2.5, critical: 3.0 },
          rework_rate: { warning: 0.15, critical: 0.2 },
        },
      },
      reporting: {
        frequency: 'weekly',
        autoGenerate: false,
        includeCharts: false,
      },
    },
  };
  fs.writeFileSync(metricsConfigPath, JSON.stringify(metricsConfig, null, 2));
  console.log('  ✓ metrics/config.json');
}

// 初始化度量数据
const metricsDataPath = path.join(projectRoot, '.requirements/metrics/data.json');
if (!fs.existsSync(metricsDataPath)) {
  const metricsData = {
    metrics: {
      cycle_time: [],
      rework_rate: [],
      quality_gate_pass_rate: [],
      completion_rate: [],
      user_satisfaction: [],
    },
    last_updated: new Date().toISOString(),
  };
  fs.writeFileSync(metricsDataPath, JSON.stringify(metricsData, null, 2));
  console.log('  ✓ metrics/data.json');
}

console.log('\n✅ 项目初始化完成!\n');
console.log('📊 ClaudeReqSys 已就绪\n');
console.log('开始使用:');
console.log('  /req 添加你的第一个需求');
console.log('  /req --dashboard 查看仪表板\n');
