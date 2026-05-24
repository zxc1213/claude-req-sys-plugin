# CRS 插件改造方案

> **版本**: v1.0  
> **创建时间**: 2026-05-22  
> **目标**: 将 CRS 从 npm 全局包改造为 Claude Code 插件

---

## 📋 改造需求

### 1. 核心目标

- ✅ **简化安装**: 从 `npm install -g` 改为 `/plugin install`
- ✅ **原生集成**: 深度集成 Claude Code 插件生态
- ✅ **自动配置**: hooks 自动生效,无需手动合并配置
- ✅ **版本管理**: 支持插件版本控制和自动更新
- ✅ **团队共享**: 可通过插件市场与团队共享

### 2. 功能保留

**必须保留的核心功能**:

- 所有 17 个 skills (req-manager, req-brainstorm, req-priority 等)
- 所有 14 个 commands
- 2 个 hooks (PostToolUse, Stop)
- 3 个 CLI 工具 (claude-req-init, claude-req-update, kg-cli)
- 核心脚本逻辑 (scripts/ 目录)
- 知识图谱功能
- 需求管理器完整功能

### 3. 用户体验改进

**安装前** (npm 全局包):

```bash
npm install -g github:zxc1213/crs
# 运行 postinstall 脚本
# 复制文件到 ~/.claude/crs/
# 创建符号链接
# 手动合并 hooks 配置
```

**安装后** (插件):

```bash
/plugin install crs
# 自动加载所有 skills、commands、hooks
# CLI 工具自动添加到 PATH
```

---

## 🏗️ 改造方案

### 阶段 1: 结构重组

#### 1.1 创建插件清单

创建 `.claude-plugin/plugin.json`:

```json
{
  "name": "crs",
  "version": "0.6.0",
  "description": "智能需求管理系统 - 从需求到测试的全流程自动化",
  "author": "19944",
  "license": "MIT",
  "homepage": "https://github.com/zxc1213/crs",
  "repository": {
    "type": "git",
    "url": "https://github.com/zxc1213/crs-plugin.git"
  },
  "skills": [
    "req-manager",
    "req-brainstorm",
    "req-priority",
    "req-quality",
    "req-unify",
    "req-test-plan",
    "req-verify",
    "req-metrics",
    "req-init",
    "req-update",
    "req-change",
    "req-migrate"
  ],
  "commands": [
    "req",
    "req-init",
    "req-update",
    "req-priority",
    "req-quality",
    "req-test-plan",
    "req-verify",
    "req-brainstorm",
    "req-change",
    "req-migrate",
    "req-unify",
    "metrics"
  ],
  "hooks": {
    "PostToolUse": ["post-req-update"],
    "Stop": ["stop-req-summary"]
  },
  "bin": [
    "claude-req-init",
    "claude-req-update",
    "kg-search",
    "kg-stats",
    "kg-connections",
    "kg-recommend",
    "kg-rebuild"
  ],
  "settings": {
    "env": {
      "CLAUDE_REQ_SYS": "{{PLUGIN_DIR}}"
    }
  }
}
```

#### 1.2 扁平化目录结构

**当前结构** → **插件结构**:

```
src/claude/commands/    → commands/
src/claude/skills/      → skills/ (保持分类子目录)
src/config/hooks.json   → hooks/hooks.json
scripts/                → scripts/ (保持不变)
bin/                    → bin/ (保持不变)
```

**目录映射表**:

| 当前路径                                | 插件路径                           | 说明       |
| --------------------------------------- | ---------------------------------- | ---------- |
| `src/claude/commands/req.md`            | `commands/req.md`                  | 主命令     |
| `src/claude/skills/core/req-manager.md` | `skills/core/req-manager/SKILL.md` | 核心技能   |
| `src/config/hooks.json`                 | `hooks/hooks.json`                 | Hooks 配置 |
| `scripts/requirement-manager/`          | `scripts/requirement-manager/`     | 保持不变   |
| `bin/claude-req-init.js`                | `bin/claude-req-init`              | CLI 工具   |

### 阶段 2: Skills 迁移

#### 2.1 Skills 目录结构

```
skills/
├── core/
│   ├── req-manager/
│   │   └── SKILL.md
│   ├── req-brainstorm/
│   │   └── SKILL.md
│   └── req-init/
│       └── SKILL.md
├── quality/
│   ├── req-quality/
│   │   └── SKILL.md
│   ├── req-test-plan/
│   │   └── SKILL.md
│   └── req-verify/
│       └── SKILL.md
├── analysis/
│   ├── req-priority/
│   │   └── SKILL.md
│   └── req-metrics/
│       └── SKILL.md
├── change/
│   ├── req-change/
│   │   └── SKILL.md
│   └── req-migrate/
│       └── SKILL.md
└── utils/
    └── req-unify/
        └── SKILL.md
```

#### 2.2 SKILL.md 前置元数据

每个 SKILL.md 需要添加 frontmatter:

```markdown
---
description: 智能需求管理统一入口，根据需求类型自动路由到最优处理流程
---

[原有内容...]
```

### 阶段 3: Commands 迁移

#### 3.1 Commands 目录结构

```
commands/
├── req.md              # 主命令 (必选入口)
├── req-init.md
├── req-update.md
├── req-priority.md
├── req-quality.md
├── req-test-plan.md
├── req-verify.md
├── req-brainstorm.md
├── req-change.md
├── req-migrate.md
├── req-unify.md
└── metrics.md
```

#### 3.2 Command 引用路径更新

所有 commands 中的脚本引用路径需要更新:

**旧路径**:

```
node ~/.claude/crs/scripts/requirement-manager/index.js
```

**新路径** (使用插件环境变量):

```
node {{CLAUDE_REQ_SYS}}/scripts/requirement-manager/index.js
```

### 阶段 4: Hooks 配置

#### 4.1 Hooks 目录结构

```
hooks/
└── hooks.json
```

#### 4.2 Hooks 配置更新

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"{{CLAUDE_REQ_SYS}}/scripts/hooks/post-req-update.js\"",
            "timeout": 10
          }
        ],
        "description": "更新需求记录",
        "id": "post:req:update"
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"{{CLAUDE_REQ_SYS}}/scripts/hooks/stop-req-summary.js\"",
            "timeout": 10
          }
        ],
        "description": "生成需求执行总结",
        "id": "stop:req:summary"
      }
    ]
  }
}
```

**关键变化**: 使用 `{{CLAUDE_REQ_SYS}}` 环境变量,该变量由插件系统自动设置。

### 阶段 5: Scripts 适配

#### 5.1 环境变量支持

所有脚本需要支持 `{{CLAUDE_REQ_SYS}}` 环境变量:

```javascript
// 获取插件根目录
const PLUGIN_DIR = process.env.CLAUDE_REQ_SYS || process.cwd();
```

#### 5.2 路径引用更新

更新所有硬编码路径:

| 旧路径                      | 新路径                |
| --------------------------- | --------------------- |
| `~/.claude/crs/` | `{{CLAUDE_REQ_SYS}}/` |
| `process.env.HOME/.claude/` | `{{CLAUDE_DATA}}/`    |

### 阶段 6: Bin 工具适配

#### 6.1 Bin 目录结构

```
bin/
├── claude-req-init      # 无扩展名 (Unix)
├── claude-req-init.cmd  # Windows 批处理
├── claude-req-update
├── claude-req-update.cmd
├── kg-search
├── kg-search.cmd
└── ...
```

#### 6.2 Shebang 和路径

```bash
#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';

// 动态获取插件目录
const PLUGIN_DIR = process.env.CLAUDE_REQ_SYS ||
  path.dirname(path.dirname(fileURLToPath(import.meta.url)));
```

### 阶段 7: 移除 npm 特定代码

#### 7.1 移除的文件

- ❌ `scripts/postinstall.js` - 不需要 npm postinstall
- ❌ `scripts/merge-settings.js` - hooks 自动合并
- ❌ `scripts/npx-install.js` - 不需要 npx 安装

#### 7.2 简化 package.json

```json
{
  "name": "crs-plugin",
  "version": "0.6.0",
  "description": "CRS Plugin - 智能需求管理系统",
  "type": "module",
  "files": [".claude-plugin/", "skills/", "commands/", "hooks/", "scripts/", "bin/", "README.md"],
  "keywords": ["claude-code", "plugin", "requirement-management"],
  "author": "19944",
  "license": "MIT"
}
```

**移除**:

- ❌ `bin` 字段 (CLI 由插件系统管理)
- ❌ `scripts` 字段 (不需要 npm scripts)
- ❌ `dependencies` (依赖由插件系统加载)
- ❌ `postinstall` 钩子

---

## 🔄 迁移对比表

### 安装方式对比

| 特性        | npm 全局包                  | 插件                                |
| ----------- | --------------------------- | ----------------------------------- |
| 安装命令    | `npm install -g`            | `/plugin install`                   |
| 更新方式    | `npm install -g @latest`    | `/plugin update`                    |
| 卸载命令    | `npm uninstall -g`          | `/plugin uninstall`                 |
| 配置合并    | 手动合并 hooks.json         | 自动合并                            |
| Skills 调用 | `/req-manager`              | `/crs:req-manager`       |
| 环境变量    | 手动设置                    | 自动设置                            |
| 文件位置    | `~/.claude/crs/` | `~/.claude/plugins/crs/` |

### 目录结构对比

```
npm 全局包:
crs/
├── src/
│   ├── claude/
│   │   ├── commands/
│   │   └── skills/
│   ├── scripts/
│   └── config/
├── bin/
├── scripts/
│   ├── postinstall.js
│   └── merge-settings.js
└── package.json

插件:
crs/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── core/
│   ├── quality/
│   ├── analysis/
│   ├── change/
│   └── utils/
├── commands/
├── hooks/
│   └── hooks.json
├── scripts/
├── bin/
└── README.md
```

---

## ✅ 验收标准

### 功能完整性

- ✅ 所有 17 个 skills 正常工作
- ✅ 所有 14 个 commands 正常工作
- ✅ 2 个 hooks 正常触发
- ✅ 3 个 CLI 工具正常执行
- ✅ 知识图谱功能正常

### 安装体验

- ✅ `/plugin install` 一键安装
- ✅ hooks 自动生效
- ✅ 环境变量自动设置
- ✅ CLI 工具自动添加到 PATH

### 兼容性

- ✅ 向后兼容现有需求数据 (`.requirements/`)
- ✅ 支持从 npm 版本迁移
- ✅ 不影响已有项目

---

## 📝 实施步骤

### Step 1: 创建插件结构

- [ ] 创建 `.claude-plugin/` 目录
- [ ] 创建 `plugin.json` 清单
- [ ] 创建 `skills/`, `commands/`, `hooks/` 目录

### Step 2: 迁移 Skills

- [ ] 扁平化 skills 目录结构
- [ ] 重命名为 `SKILL.md`
- [ ] 添加 frontmatter 元数据
- [ ] 更新内部引用路径

### Step 3: 迁移 Commands

- [ ] 复制所有 commands 到 `commands/`
- [ ] 更新脚本引用路径
- [ ] 测试所有 commands

### Step 4: 迁移 Hooks

- [ ] 创建 `hooks/hooks.json`
- [ ] 更新路径引用
- [ ] 测试 hooks 触发

### Step 5: 适配 Scripts

- [ ] 添加环境变量支持
- [ ] 更新路径引用
- [ ] 测试所有脚本

### Step 6: 适配 Bin 工具

- [ ] 创建 Windows 批处理文件
- [ ] 更新 shebang 和路径
- [ ] 测试 CLI 工具

### Step 7: 清理和文档

- [ ] 移除 npm 特定文件
- [ ] 更新 README.md
- [ ] 创建迁移指南

### Step 8: 测试和发布

- [ ] 本地测试 (`--plugin-dir`)
- [ ] 发布到市场
- [ ] 验证安装流程

---

## 🚀 后续优化

### 可选增强

1. **Agents 支持**: 创建自定义 agents 用于自动化流程
2. **MCP Server**: 集成外部工具和 API
3. **Monitors**: 后台监视需求状态变化
4. **LSP Server**: 为需求文件提供代码智能

### 文档完善

1. **用户指南**: 插件使用说明
2. **开发指南**: 贡献指南
3. **API 文档**: Skills 和 Commands API
4. **迁移指南**: 从 npm 版本迁移

---

## 📚 参考资料

- [Claude Code 插件文档](https://code.claude.com/docs/zh-CN/plugins)
- [插件技术规范](https://code.claude.com/docs/zh-CN/plugins/plugin-reference)
- [Skill 开发指南](https://code.claude.com/docs/zh-CN/agent-skills)
- [Hooks 配置](https://code.claude.com/docs/zh-CN/hooks)

---

**状态**: 📝 规划中  
**下一步**: Step 1 - 创建插件结构
