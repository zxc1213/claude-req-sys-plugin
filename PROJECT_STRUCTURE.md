# ClaudeReqSys 项目结构说明

> **版本**: v0.6.0 Plugin  
> **分支**: feature/plugin-migration  
> **更新时间**: 2026-05-22

---

## 📋 项目概述

**ClaudeReqSys** 是一个智能需求管理系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。作为 Claude Code 插件，它提供了完整的的需求管理、知识图谱、质量门禁等功能。

### 核心特性

- 🧭 **智能路由**: 根据需求类型自动选择最优处理流程
- 🔍 **向量知识图谱**: 基于 Fuse.js 实现语义搜索，发现相似需求
- ✅ **质量门禁**: 4个关键阶段自动检查，确保交付质量
- 🤖 **技能集成**: 深度集成 brainstorming、systematic-debugging 等 Claude Code skills
- 🎯 **优先级评估**: 多维度科学评估需求优先级
- 📄 **统一文档**: 简化文档结构，降低维护成本

---

## 📁 目录结构

### 根目录文件

```
claude-req-sys/
├── README.md                  # 项目主文档（版本选择说明）
├── README_PLUGIN.md           # 插件版本完整文档 ⭐
├── INSTALL.md                 # 插件安装指南
├── VERSIONS.md                # 版本对比（插件 vs npm）
├── PROJECT_STRUCTURE.md       # 项目结构说明（本文档）
├── CLAUDE.md                  # Claude Code 项目指导
├── AGENTS.md                  # Agents 配置
├── COMMANDS.md                # Commands 说明
├── package.json               # npm 包配置
├── LICENSE                    # MIT 许可证
└── .gitignore                 # Git 忽略配置
```

| 文件               | 说明                                       |
| ------------------ | ------------------------------------------ |
| `README.md`        | 项目主入口，说明两个版本（插件/npm）的选择 |
| `README_PLUGIN.md` | 插件版本完整文档，包含所有功能说明         |
| `INSTALL.md`       | 插件安装指南，提供多种安装方式             |
| `VERSIONS.md`      | 插件版本和 npm 版本的详细对比              |
| `CLAUDE.md`        | Claude Code 工作指导，定义项目规范         |
| `AGENTS.md`        | 自定义 Agents 配置                         |
| `COMMANDS.md`      | Commands 命令参考                          |

---

## 🔧 核心目录

### `.claude-plugin/` - 插件清单

插件元数据和配置文件。

```
.claude-plugin/
└── plugin.json               # 插件配置清单
```

**plugin.json 结构**：

- `name`: 插件名称
- `version`: 版本号
- `skills`: 技能列表
- `commands`: 命令列表
- `hooks`: Hooks 配置
- `bin`: CLI 工具列表
- `settings.env`: 环境变量配置

---

### `skills/` - Skills 定义

Claude Code 技能定义，按功能分类组织。

```
skills/
├── core/                     # 核心需求管理
│   ├── req-manager/
│   │   └── SKILL.md         # 智能需求管理统一入口
│   ├── req-brainstorm/
│   │   └── SKILL.md         # 深度需求分析（四阶段）
│   └── req-init/
│       └── SKILL.md         # 需求系统初始化
├── quality/                  # 质量保证
│   ├── req-quality/
│   │   └── SKILL.md         # 质量门禁检查
│   ├── req-test-plan/
│   │   └── SKILL.md         # 测试策略生成
│   └── req-verify/
│       └── SKILL.md         # 需求验证
├── analysis/                 # 分析评估
│   ├── req-priority/
│   │   └── SKILL.md         # 优先级科学评估
│   └── req-metrics/
│       └── SKILL.md         # 需求度量分析
├── change/                   # 变更处理
│   ├── req-change/
│   │   └── SKILL.md         # 需求变更管理
│   └── req-migrate/
│       └── SKILL.md         # 需求迁移
└── utils/                    # 辅助工具
    └── req-unify/
        └── SKILL.md         # 文档结构统一
```

**Skills 数量**: 12 个

---

### `commands/` - Commands 定义

Claude Code 命令定义，提供用户交互入口。

```
commands/
├── req.md                    # 主命令（需求管理）
├── req-init.md               # 初始化命令
├── req-update.md             # 更新命令
├── req-priority.md           # 优先级评估
├── req-quality.md            # 质量检查
├── req-test-plan.md          # 测试计划
├── req-verify.md             # 需求验证
├── req-brainstorm.md         # 深度分析
├── req-change.md             # 变更管理
├── req-migrate.md            # 迁移工具
├── req-unify.md              # 文档统一
└── metrics.md                # 度量命令
```

**Commands 数量**: 12 个

---

### `hooks/` - Hooks 配置

Claude Code 生命周期钩子配置。

```
hooks/
└── hooks.json                # Hooks 配置文件
```

**Hooks 类型**：

- `PostToolUse`: 工具调用后记录到需求日志
- `Stop`: 会话结束时生成需求执行总结

---

### `scripts/` - 核心脚本

系统的核心业务逻辑。

```
scripts/
├── requirement-manager/      # 需求管理器 ⭐
│   ├── core/                 # 核心功能
│   │   ├── processor.js      # 需求处理器
│   │   ├── router.js         # 路由器
│   │   └── scheduler.js      # 调度器
│   ├── features/             # 功能模块
│   │   ├── security.js       # 安全过滤
│   │   └── similarity.js     # 相似度检测
│   ├── optimization/         # 优化模块
│   │   ├── optimizer.js      # 优化器
│   │   ├── evaluator.js      # 评估器
│   │   └── upgrader.js       # 升级器
│   ├── integrations/         # 集成模块
│   │   └── git.js            # Git 集成
│   ├── ui/                   # UI 模块
│   │   └── dashboard.js      # 仪表板
│   ├── utils/                # 工具函数
│   │   ├── id-generator.js   # ID 生成器
│   │   ├── logger.js         # 日志工具
│   │   └── storage.js        # 存储工具
│   ├── index.js              # 入口文件
│   └── demo.js               # 演示脚本
├── knowledge-graph/          # 向量知识图谱 ⭐
│   └── index.js              # 知识图谱引擎
├── hooks/                    # Hooks 脚本
│   ├── post-req-update.js    # PostToolUse 钩子
│   └── stop-req-summary.js   # Stop 钩子
└── metrics/                  # 度量收集
    └── collect.js            # 度量收集器
```

**核心模块说明**：

| 模块                  | 说明                    | 文件数 |
| --------------------- | ----------------------- | ------ |
| `requirement-manager` | 需求管理器核心          | 15+    |
| `knowledge-graph`     | 向量知识图谱（Fuse.js） | 1      |
| `hooks`               | 生命周期钩子            | 2      |
| `metrics`             | 度量收集                | 1      |

---

### `bin/` - CLI 工具

命令行工具，提供系统初始化和知识图谱操作。

```
bin/
├── claude-req-init           # 初始化命令
├── claude-req-init.cmd       # Windows 批处理
├── claude-req-update         # 更新命令
├── claude-req-update.cmd     # Windows 批处理
├── kg-search                 # 知识图谱搜索
├── kg-search.cmd             # Windows 批处理
├── kg-stats                  # 知识图谱统计
├── kg-stats.cmd              # Windows 批处理
├── kg-connections            # 知识关联查询
├── kg-connections.cmd        # Windows 批处理
├── kg-recommend              # 智能推荐
├── kg-recommend.cmd          # Windows 批处理
├── kg-rebuild                # 重建索引
└── kg-rebuild.cmd            # Windows 批处理
```

**CLI 工具数量**: 7 个工具 × 2 平台 = 14 个文件

---

### `tests/` - 测试文件

完整的测试套件，确保代码质量。

```
tests/
├── test-import.test.js       # 导入测试（1个）
├── utils/                    # 工具函数测试
│   ├── id-generator.test.js  # ID 生成器（4个）
│   ├── logger.test.js        # 日志工具（4个）
│   └── storage.test.js       # 存储工具（4个）
├── core/                     # 核心功能测试
│   └── processor.test.js     # 需求处理器（32个）
├── knowledge-graph/          # 知识图谱测试 ⭐
│   └── index.test.js         # 知识图谱（19个）
├── optimization/             # 优化模块测试
│   ├── optimizer.test.js     # 优化器（12个）
│   ├── evaluator.test.js     # 评估器（21个）
│   └── upgrader.test.js      # 升级器（8个）
└── integration/              # 集成测试
    └── workflow.test.js      # 工作流（18个）
```

**测试统计**：

- 总测试用例: 142 个
- 测试文件: 11 个
- 覆盖率: 核心模块全覆盖

---

### `docs/` - 文档目录

项目文档和参考材料。

```
docs/
├── analysis/                 # 分析文档
├── guides/                   # 使用指南
│   └── user-guide.md         # 用户指南
├── research/                 # 研究文档
├── specs/                    # 规格文档
│   └── 2026-05-07-design.md  # 系统设计
├── superpowers/              # Superpowers 技能
└── plugin-migration-plan.md  # 插件改造方案
```

---

## 🗂️ 数据目录

### `.requirements/` - 需求数据（项目本地）

每个项目的需求数据存储在项目本地。

```
.requirements/
├── _system/                  # 系统数据
│   ├── index.json            # 知识图谱索引
│   └── metrics.json          # 系统指标
├── features/                 # 新功能
│   └── REQ-YYYYMMDD-XXX/
│       ├── meta.yaml         # 元数据
│       ├── spec.md           # 统一主文档
│       └── test-cases.md     # 测试用例（可选）
├── bugs/                     # Bug 修复
├── questions/                # 技术问题
├── adjustments/              # 需求调整
└── refactorings/             # 重构任务
```

---

## 🔧 配置目录

### `.github/` - GitHub 配置

GitHub Actions 工作流和模板。

```
.github/
└── workflows/               # GitHub Actions
    └── test.yml             # 测试工作流
```

### `.husky/` - Git Hooks

Git 钩子配置，自动化代码质量检查。

```
.husky/
├── pre-commit               # 提交前检查（lint + test）
├── commit-msg               # 提交信息格式检查
└── _/                       # Husky 内部文件
```

---

## 📊 技术栈

### 核心技术

| 技术       | 版本      | 用途     |
| ---------- | --------- | -------- |
| Node.js    | >= 18.0.0 | 运行环境 |
| npm        | >= 9.0.0  | 包管理   |
| ES Modules | -         | 模块系统 |
| Fuse.js    | latest    | 模糊搜索 |
| Vitest     | latest    | 测试框架 |

### 开发工具

| 工具        | 用途         |
| ----------- | ------------ |
| ESLint      | 代码检查     |
| Prettier    | 代码格式化   |
| Husky       | Git 钩子     |
| lint-staged | 暂存文件检查 |
| commitlint  | 提交信息检查 |

---

## 🔍 开发工具

### Code Review Graph - 代码知识图谱

项目集成了 **code-review-graph**，提供基于代码依赖关系的智能分析和可视化，减少 AI 编码时的 token 消耗。

#### 安装和配置

```bash
# 安装 code-review-graph
pip install code-review-graph

# 自动检测并配置所有支持的平台（Codex、Claude Code、Cursor 等）
code-review-graph install

# 仅配置特定平台
code-review-graph install --platform claude-code
```

#### 手动触发和更新

**首次构建**：

```bash
# 解析整个代码库（首次使用）
code-review-graph build

# 首次构建约 10 秒（500 个文件项目）
# 支持的语言：Python, TypeScript, JavaScript, Go, Rust, Java, C#, Ruby, PHP 等 23 种语言
```

**增量更新**（推荐，自动触发）：

```bash
# 增量更新（仅变更文件，不到 2 秒）
code-review-graph update

# 查看图统计信息
code-review-graph status
```

**监听模式**（持续更新）：

```bash
# 文件变更时自动更新
code-review-graph watch
```

**重新生成 Wiki**：

```bash
# 从社区结构生成 Markdown Wiki
code-review-graph wiki

# 强制重新生成
code-review-graph wiki --force
```

#### 查询和分析

**影响半径分析**：

```bash
# 变更文件的影响半径
code-review-graph detect-changes

# 查看受变更影响的执行流
code-review-graph affected-flows <file_path>
```

**可视化**：

```bash
# 生成交互式 HTML 图
code-review-graph visualize

# 导出为其他格式
code-review-graph visualize --format graphml    # GraphML (Gephi/yEd)
code-review-graph visualize --format svg        # SVG 静态图
code-review-graph visualize --format obsidian  # Obsidian 知识库
code-review-graph visualize --format cypher     # Neo4j Cypher
```

**架构分析**：

```bash
# 获取架构概览（自动生成架构图）
code-review-graph architecture

# 列出代码社区
code-review-graph communities

# 查找架构热点（连接最多的节点）
code-review-graph hubs

# 查找架构瓶颈（Bridge 节点）
code-review-graph bridges
```

**搜索和查询**：

```bash
# 语义搜索代码实体
code-review-graph search "需求处理器"

# 查找大型函数
code-review-graph large-functions --min-lines 50

# 列出执行流
code-review-graph flows

# 跨仓库搜索（需先注册多个仓库）
code-review-graph register <repo_path>
code-review-graph cross-repo "function_name"
```

#### 图谱统计

当前项目的代码图谱统计：

- 解析文件: 49 个
- 代码节点: 536 个
- 依赖关系: 3990 条边
- 代码社区: 11 个
- 执行流: 57 个
- Wiki 页面: 12 个

#### AI 助手集成

图构建完成后，在 AI 助手中直接使用：

```
Build the code review graph for this project
```

可用的 MCP 工具（28 个）：

- `build_or_update_graph_tool` - 构建或增量更新
- `get_minimal_context_tool` - 超紧凑上下文
- `get_impact_radius_tool` - 影响半径
- `get_review_context_tool` - 审查上下文
- `query_graph_tool` - 查询调用关系
- `traverse_graph_tool` - 图遍历
- `semantic_search_nodes_tool` - 语义搜索
- `list_communities_tool` - 代码社区
- `get_architecture_overview_tool` - 架构概览
- 等等...

#### Wiki 文档

生成的 Wiki 页面存储在 `.code-review-graph/wiki/` 目录：

```bash
# 查看所有 Wiki 页面
ls .code-review-graph/wiki/

# 查看特定社区的 Wiki
cat .code-review-graph/wiki/requirement-manager.md
```

#### 官方文档

详细使用说明：[https://github.com/tirth8205/code-review-graph/blob/main/README.zh-CN.md](https://github.com/tirth8205/code-review-graph/blob/main/README.zh-CN.md)

### ZRead - GitHub 代码阅读和 Wiki 生成

**ZRead** 是一个强大的 AI 驱动代码阅读和 Wiki 生成 CLI 工具。

#### 安装

```bash
# 全局安装 zread CLI（注意包名是 zread_cli）
npm install -g zread_cli

# 或使用 Homebrew（macOS/Linux）
brew install zread

# 验证安装
zread version
```

#### 手动触发和更新

**首次生成 Wiki**：

```bash
# 在项目根目录执行生成（自动确认）
zread generate -y

# 清除现有草稿重新生成
zread generate --draft=clear -y

# 选项说明：
# --draft=resume  恢复之前的草稿（默认）
# --draft=clear   清除现有草稿重新生成
# --draft=cancel  取消现有草稿
# -y, --yes        自动确认所有提示
```

**查看生成的 Wiki**：

```bash
# 在浏览器中打开 Wiki
zread browse

# 或直接访问生成的文档目录
# 文档存储位置：~/.zread/workspace/<project-name>/
```

**更新 Wiki**：

```bash
# 代码变更后重新生成
zread generate --clear

# 增量更新（保留已有内容）
zread generate --resume
```

#### GitHub 代码阅读

**获取仓库结构**：

```bash
# 列出仓库目录结构
zread ls zxc1213/claude-req-sys

# 查看特定目录
zread ls zxc1213/claude-req-sys:scripts/
```

**读取文件内容**：

```bash
# 读取单个文件
zread cat zxc1213/claude-req-sys:scripts/requirement-manager/core/processor.js

# 读取多个文件
zread cat zxc1213/claude-req-sys:package.json README.md
```

**搜索代码**：

```bash
# 在仓库中搜索关键词
zread search zxc1213/claude-req-sys "需求处理器"

# 搜索函数定义
zread search zxc1213/claude-req-sys "function.*create"
```

#### 配置管理

```bash
# 查看配置
zread config show

# 设置语言（中文/英文）
zread config set language zh

# 登录 Z.AI（使用高级功能）
zread login
```

#### 官方文档

详细使用说明：[https://zread.ai/cli](https://zread.ai/cli)

### 知识图谱 Wiki

项目使用 code-review-graph 生成了 **12 个 Wiki 页面**，存储在 `.code-review-graph/wiki/` 目录。

**查看 Wiki**：

```bash
# 列出所有 Wiki 页面
ls .code-review-graph/wiki/

# 查看特定社区的 Wiki
cat .code-review-graph/wiki/optimization-generate.md
```

**Wiki 内容**：

- 每个代码社区的详细说明
- 社区成员列表（类、函数）
- 社区内聚度和依赖关系
- 跨社区连接分析

---

## 🚀 快速导航

### 开发相关

- **项目规范**: [CLAUDE.md](CLAUDE.md)
- **Agents 配置**: [AGENTS.md](AGENTS.md)
- **Commands 参考**: [COMMANDS.md](COMMANDS.md)
- **插件改造方案**: [docs/plugin-migration-plan.md](docs/plugin-migration-plan.md)

### 用户文档

- **插件完整文档**: [README_PLUGIN.md](README_PLUGIN.md)
- **安装指南**: [INSTALL.md](INSTALL.md)
- **版本对比**: [VERSIONS.md](VERSIONS.md)
- **用户指南**: [docs/guides/user-guide.md](docs/guides/user-guide.md)

### 技术文档

- **系统设计**: [docs/specs/2026-05-07-design.md](docs/specs/2026-05-07-design.md)

---

## 📈 项目统计

| 指标     | 数量   |
| -------- | ------ |
| Skills   | 12 个  |
| Commands | 12 个  |
| Hooks    | 2 个   |
| CLI 工具 | 7 个   |
| 测试用例 | 142 个 |
| 核心脚本 | 20+ 个 |

---

**最后更新**: 2026-05-22  
**维护者**: 19944  
**许可证**: MIT
