#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { homedir } = require('os');

const SENTINEL = path.join('scripts', 'hooks', 'plugin-hook-bootstrap.cjs');

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
  const searchPaths = [path.join(claudeDir, 'plugins', 'marketplaces', 'crs', 'plugins', 'crs')];

  for (const candidate of searchPaths) {
    if (fs.existsSync(path.join(candidate, SENTINEL))) {
      return candidate;
    }
  }

  try {
    const cacheBase = path.join(claudeDir, 'plugins', 'cache', 'crs', 'crs');
    if (fs.existsSync(cacheBase)) {
      for (const version of fs.readdirSync(cacheBase, { withFileTypes: true })) {
        if (!version.isDirectory()) continue;
        const candidate = path.join(cacheBase, version.name);
        if (fs.existsSync(path.join(candidate, SENTINEL))) {
          return candidate;
        }
      }
    }
  } catch {}

  return path.resolve(__dirname, '..', '..');
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

const [, , scriptPath] = process.argv;

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

const raw = readStdin();

const result = spawnSync(process.execPath, [resolvedScript], {
  input: raw,
  encoding: 'utf8',
  env: process.env,
  cwd: process.cwd(),
  timeout: 30000,
});

const stdout = typeof result.stdout === 'string' ? result.stdout : '';
if (stdout) {
  process.stdout.write(stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

process.exit(Number.isInteger(result.status) ? result.status : 0);
