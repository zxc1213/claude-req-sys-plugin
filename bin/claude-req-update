#!/usr/bin/env node

/**
 * ClaudeReqSys 更新命令
 * 使用: claude-req-update [--version|-v]
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

console.log('🔄 ClaudeReqSys 更新\n');

try {
  // 检查是否在 git 仓库中
  const repoRoot = path.resolve(ROOT);

  console.log('📥 拉取最新代码...');
  execSync('git pull', { cwd: repoRoot, stdio: 'inherit' });

  console.log('\n🔗 重新链接技能文件...');
  const linkScript = path.join(repoRoot, 'scripts/link-skills.sh');
  execSync(`bash "${linkScript}"`, { cwd: repoRoot, stdio: 'inherit' });

  console.log('\n✅ 更新完成!\n');
  console.log('ClaudeReqSys 已更新到最新版本\n');

} catch (error) {
  console.error('\n❌ 更新失败:', error.message);
  process.exit(1);
}
