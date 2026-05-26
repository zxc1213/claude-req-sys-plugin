#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 从package.json读取版本
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);
const version = packageJson.version;

// 定义需要同步的文件
const manifests = [
  {
    path: '.claude-plugin/plugin.json',
    key: 'version'
  },
  {
    path: '.codex-plugin/plugin.json',
    key: 'version'
  }
];

// 同步版本号
manifests.forEach(({ path, key }) => {
  const filePath = join(__dirname, '..', path);
  const manifest = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (manifest[key] !== version) {
    manifest[key] = version;
    writeFileSync(filePath, JSON.stringify(manifest, null, 2));
    console.log(`✓ Updated ${path} to ${version}`);
  } else {
    console.log(`- ${path} already at ${version}`);
  }
});

console.log(`\nVersion ${version} synced to all manifests.`);
