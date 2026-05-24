# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**文档版本**: v1.0 | **最后更新**: 2026-05-14 | **适用版本**: v0.6.0

## 项目概述

**CRS** 是一个智能需求管理系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。作为 npm 全局包安装，一次安装所有项目共享。

**核心特性**：

- 智能路由：根据需求类型自动选择最优处理流程
- 向量知识图谱：基于 Fuse.js 实现语义搜索，发现相似需求
- 质量门禁：4个关键阶段自动检查，确保交付质量
- 技能集成：深度集成 brainstorming、systematic-debugging 等 Claude Code skills

## 常用命令

### 开发命令

```bash
# 测试（142个测试用例）
npm test                      # 运行所有测试
npm run test:watch            # 监视模式
npm run test:coverage         # 查看覆盖率
npm run test:verbose          # 详细输出

# 代码质量
npm run lint                  # ESLint 检查
npm run lint:fix              # 自动修复
npm run format                # Prettier 格式化
npm run format:check          # 检查格式

# 安装与更新
npm install -g .              # 本地开发时全局安装
npm install -g github:zxc1213/crs  # 从 GitHub 安装
```

### 知识图谱 CLI

```bash
kg-search "用户登录" 10       # 搜索相似需求
kg-stats                      # 查看统计信息
kg-connections REQ-001        # 查看知识关联
kg-recommend                  # 智能推荐
kg-rebuild                    # 重建索引
```

## 核心架构

### 需求处理流程

```
用户输入 → req-manager (智能路由)
    ↓
[创建需求] → req-brainstorm → req-priority → req-quality
    ↓
需求存储 (.requirements/)
    ↓
知识图谱自动同步
```

### 关键模块

**需求处理器** (`scripts/requirement-manager/core/processor.js`)

- `Processor.create()` - 创建新需求，生成 ID（如 FEAT-20260514-001）
- `Processor.update()` - 更新需求状态
- `Processor.parseType()` - 解析命令输入，自动推断类型和模式

**路由器** (`scripts/requirement-manager/core/router.js`)

- 管理 5 种需求类型的路由配置：feature、bug、question、adjustment、refactor
- 每种类型对应不同的 primarySkill 和 phases

**知识图谱** (`scripts/knowledge-graph/index.js`)

- `KnowledgeGraph.initialize()` - 扫描所有需求目录构建索引
- `KnowledgeGraph.findSimilarRequirements()` - 基于 Fuse.js 的语义搜索
- `KnowledgeGraph.getKnowledgeConnections()` - BFS 算法遍历需求关系网络

**Hooks 集成** (`scripts/hooks/`)

- `post-req-update.js` - PostToolUse 钩子，记录工具调用到 execution.log
- `stop-req-summary.js` - Stop 钩子，生成需求执行总结

## 文件结构

```
scripts/                       # 核心脚本工具
├── requirement-manager/       # 需求管理器核心
│   ├── core/                  # processor.js, router.js, scheduler.js
│   ├── optimization/          # optimizer.js, evaluator.js, upgrader.js
│   └── utils/                 # storage.js, logger.js, id-generator.js
├── knowledge-graph/           # 向量知识图谱
├── hooks/                     # 自动化钩子
└── metrics/                   # 度量收集

skills/                        # Claude Code 技能定义
├── core/                      # 核心需求管理
│   ├── req-manager/           # 智能需求管理
│   ├── req-brainstorm/        # 深度需求分析
│   └── req-init/              # 需求系统初始化
├── quality/                   # 质量保证
│   ├── req-quality/           # 质量门禁
│   ├── req-test-plan/         # 测试策略
│   └── req-verify/            # 需求验证
├── analysis/                  # 分析评估
│   ├── req-priority/          # 优先级评估
│   └── req-metrics/           # 度量分析
├── change/                    # 变更处理
│   ├── req-change/            # 变更管理
│   └── req-migrate/           # 需求迁移
└── utils/                     # 辅助工具
    └── req-unify/             # 文档统一

commands/                      # Claude Code 命令定义
├── req.md                     # 主命令
├── req-init.md                # 初始化命令
├── req-update.md              # 更新命令
├── req-priority.md            # 优先级评估
├── req-quality.md             # 质量检查
└── ...                        # 其他命令

bin/                           # CLI 工具
├── claude-req-init            # 初始化命令
├── claude-req-update          # 更新命令
└── kg-cli.js                  # 知识图谱 CLI

hooks/                         # Hooks 配置
└── hooks.json                 # hooks 配置文件

tests/                         # 测试套件（142个测试用例）
├── test-import.test.js        # 导入测试
├── utils/                     # 工具函数测试
├── core/                      # 核心功能测试
├── knowledge-graph/           # 知识图谱测试
├── optimization/              # 优化模块测试
└── integration/               # 集成测试
```

## 开发规范

### Git 提交规范

遵循 Conventional Commits：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `test:` 添加测试
- `refactor:` 重构
- `chore:` 构建/工具变更

**自动化**：husky 配置了 pre-commit（运行 lint 和测试）和 commit-msg（检查格式）钩子。

### 代码风格

- **ESLint**: 项目配置，`npm run lint:fix` 自动修复
- **Prettier**: 代码格式化，`npm run format`
- **ES Modules**: 使用 `import/export`，`type: "module"`

### 测试要求

- 新功能必须添加对应测试用例
- 运行 `npm test` 确保所有测试通过
- 知识图谱模块有 19 个专项测试

## 技术决策

### 为什么使用 Fuse.js 而不是向量数据库？

Fuse.js 提供轻量级的模糊搜索能力，对于需求管理场景足够：

- 无需外部依赖，安装简单
- 性能良好（中小规模需求集）
- 支持中英文混合搜索
- 可配置权重和阈值

### 为什么使用 npm 全局安装？

- **一次安装，全局使用**：所有项目自动共享
- **项目更干净**：项目只包含数据（`.requirements/`），不包含系统文件
- **快速更新**：重新安装即可更新
- **跨平台支持**：npm 标准流程

### 需求 ID 生成规则

格式：`{前缀}-{日期}-{序号}`

- 前缀：FEAT（功能）、BUG（缺陷）、QUES（问题）、ADJU（调整）、REF（重构）
- 日期：YYYYMMDD
- 序号：三位数字，从 001 开始

示例：`FEAT-20260514-001`

## 重要提示

### Hooks 配置

项目提供 hooks 配置模板（`hooks/hooks.json`），但**不会自动合并到用户 settings.json**。

如需启用自动化功能（需求跟踪、会话总结），需手动将 hooks 配置合并到 `.claude/settings.json`。

### 知识图谱同步

需求创建/更新/删除时会自动同步到知识图谱，失败不影响主流程（静默处理）。

### 独立安装架构

v0.6.0 起，文件复制到独立位置（`~/.claude/crs/`），避免依赖 npm 缓存。
