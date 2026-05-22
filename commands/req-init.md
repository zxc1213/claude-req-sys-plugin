---
description: 初始化 ClaudeReqSys 项目 - 创建目录结构和配置文件
---

# 需求管理系统初始化命令

初始化 ClaudeReqSys 项目，创建必要的目录结构和配置文件。

## 用法

```bash
/req:init
```

## 命令行为

当用户执行此命令时，系统将自动：

### 1. 首次运行检查

检查是否需要安装全局配置到 `~/.claude/`：

- 检查 `~/.claude/commands/req.md` 是否存在
- 如果不存在，执行全局配置安装

### 2. 全局配置安装（首次运行）

如果需要安装全局配置：

```
📁 创建全局目录...
  ✓ ~/.claude/commands
  ✓ ~/.claude/skills
  ✓ ~/.claude/scripts
  ✓ ~/.claude/scripts/hooks

📋 安装命令文件...
  ✓ req.md
  ✓ metrics.md

⚙️  安装 hooks 配置...
  ✓ hooks.json

🔧 安装 hooks 脚本...
  ✓ post-req-update.js
  ✓ stop-req-summary.js

🔗 链接技能文件...
  ✓ req-*.md 技能链接
```

### 3. 项目目录初始化

在当前项目创建以下目录结构：

```
.requirements/
├── features/              # 新功能需求
├── bugs/                  # Bug 修复
├── questions/             # 技术问题
├── adjustments/           # 需求调整
├── refactorings/          # 重构需求
├── metrics/               # 度量系统
│   ├── reports/           # 报告目录
│   ├── exports/           # 导出数据
│   └── trends/            # 趋势图
└── _system/               # 系统文件
    └── versions/          # 版本管理
```

### 4. 度量系统初始化

创建度量配置文件（如果不存在）：

**`.requirements/metrics/config.json`**

**`.requirements/metrics/data.json`**

## 输出示例

```markdown
🎯 ClaudeReqSys 项目初始化

📁 创建项目目录...
✓ .requirements/features
✓ .requirements/bugs
✓ .requirements/questions
✓ .requirements/adjustments
✓ .requirements/refactorings
✓ .requirements/metrics/reports
✓ .requirements/metrics/exports
✓ .requirements/metrics/trends
✓ .requirements/\_system/versions
✓ docs/specs
✓ docs/guides
✓ docs/analysis

📊 初始化度量系统...
✓ metrics/config.json
✓ metrics/data.json

✅ 项目初始化完成!

📊 ClaudeReqSys 已就绪

开始使用:
/req 添加你的第一个需求
/req --dashboard 查看仪表板
```

## 重要说明

**DO:**

- ✅ 在每个新项目首次使用时运行此命令
- ✅ 确保有足够的权限创建目录和文件
- ✅ 检查输出确认所有目录创建成功

**DON'T:**

- ❌ 在已初始化的项目中重复运行（已有目录会被跳过）
- ❌ 在非项目目录中运行

## 技术实现

此命令调用以下脚本：

- **主脚本**: `bin/claude-req-init.js`
- **包位置**: 通过 `require.resolve('claude-req-sys/package.json')` 定位
- **安装位置**: `~/.claude/claude-req-sys/`（独立安装架构）

## 版本历史

v0.6.0 - 初始版本

- ✅ 项目目录初始化
- ✅ 度量系统配置
- ✅ 全局配置自动安装
- ✅ 独立安装架构支持
