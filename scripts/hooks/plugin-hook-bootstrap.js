#!/usr/bin/env node
'use strict';

/**
 * Plugin Hook Bootstrap
 * 动态发现插件根目录并执行目标 hook 脚本。
 *
 * 用法: node plugin-hook-bootstrap.js <hook-script-path> [args...]
 */

import path from 'path';
import fs from 'fs';
import { homedir } from 'os';

const SENTINEL = 'scripts/hooks/plugin-hook-bootstrap.js';

function resolvePluginRoot() {
  const envRoot = process.env.CLAUDE_PLUGIN_ROOT || '';
  if (envRoot.trim()) {
    const candidate = path.resolve(envRoot.trim());
    if (fs.existsSync(path.join(candidate, SENTINEL))) {
      return candidate;
    }
  }

  const home = homedir();
  const claudeDir = path.join(home, '.claude');

  const searchPaths = [
    path.join(claudeDir, 'plugins', 'marketplaces', 'crs', 'plugins', 'crs'),
  ];

  for (const candidate of searchPaths) {
    if (fs.existsSync(path.join(candidate, SENTINEL))) {
      return candidate;
    }
  }

  try {
    const cacheBase = path.join(claudeDir, 'plugins', 'cache', 'crs');
    if (fs.existsSync(cacheBase)) {
      for (const org of fs.readdirSync(cacheBase, { withFileTypes: true })) {
        if (!org.isDirectory()) continue;
        const orgPath = path.join(cacheBase, org.name);
        for (const version of fs.readdirSync(orgPath, { withFileTypes: true })) {
          if (!version.isDirectory()) continue;
          const candidate = path.join(orgPath, version.name);
          if (fs.existsSync(path.join(candidate, SENTINEL))) {
            return candidate;
          }
        }
      }
    }
  } catch {}

  return path.resolve(__dirname, '..', '..');
}

async function main() {
  const [, , scriptPath, ...args] = process.argv;

  if (!scriptPath) {
    process.exit(0);
  }

  const root = resolvePluginRoot();
  process.env.CLAUDE_PLUGIN_ROOT = root;

  const resolvedScript = path.resolve(root, scriptPath);

  if (!resolvedScript.startsWith(root + path.sep) && resolvedScript !== root) {
    process.exit(0);
  }

  if (!fs.existsSync(resolvedScript)) {
    process.exit(0);
  }

  const raw = await new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });

  try {
    const mod = require(resolvedScript);
    if (mod && typeof mod.run === 'function') {
      const result = mod.run(raw);
      if (result && typeof result === 'object' && result.raw !== undefined) {
        process.stdout.write(result.raw);
      }
    } else {
      require(resolvedScript);
    }
  } catch (err) {
    // 静默失败
  }
}

main().catch(() => {
  // 静默失败
});
