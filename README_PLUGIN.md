# ClaudeReqSys Plugin

> **⚠️ 注意**: 此插件未发布到 Claude Code 官方市场。请通过 GitHub 仓库安装。

> **Claude Code 插件** - 智能需求管理系统，从需求到测试的全流程自动化

[![Version](https://img.shields.io/badge/version-0.6.0-blue)](https://github.com/zxc1213/claude-req-sys-plugin)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 🚀 快速开始

### 安装

**从 GitHub 分支安装**（推荐）:

```bash
# 从 feature/plugin-migration 分支安装插件版本
/plugin install https://github.com/zxc1213/claude-req-sys-plugin/tree/feature/plugin-migration

# 或者使用 git+ 协议指定分支
/plugin install git+https://github.com/zxc1213/claude-req-sys-plugin.git#feature/plugin-migration

# 或者使用 ssh 协议（如果你有写权限）
/plugin install git+ssh://git@github.com/zxc1213/claude-req-sys-plugin.git#feature/plugin-migration
```

**本地测试**:

```bash
# 克隆仓库后本地测试
git clone https://github.com/zxc1213/claude-req-sys-plugin.git
cd claude-req-sys
claude --plugin-dir .
```

**团队内私有安装**:

如果你们使用私有的 GitHub 仓库：

```bash
# 从私有仓库安装
/plugin install https://github.com/your-org/claude-req-sys
```

### 核心功能

- **智能需求管理**: 统一入口，自动路由到最优流程
- **深度需求分析**: 集成 req-brainstorm 进行四阶段分析
- **优先级评估**: 多维度科学评估需求优先级
- **质量门禁**: 四个关键阶段自动检查
- **知识图谱**: 基于 Fuse.js 的语义搜索

## 📖 使用指南

### 基本命令

```bash
# 创建新需求（默认深度分析）
/req 添加用户登录功能

# 快速创建（跳过深度分析）
/req --quick 修复登录页面样式

# Bug 报告
/req --bug 登录页面崩溃

# 查看仪表板
/req --dashboard

# 查看活跃需求
/req --active
```

### Skills

插件提供以下 skills：

**核心 Skills**:

- `/claude-req-sys:req-manager` - 智能需求管理统一入口
- `/claude-req-sys:req-brainstorm` - 深度需求分析
- `/claude-req-sys:req-init` - 初始化需求系统

**质量保证**:

- `/claude-req-sys:req-quality` - 质量门禁检查
- `/claude-req-sys:req-test-plan` - 测试策略生成
- `/claude-req-sys:req-verify` - 需求验证

**分析评估**:

- `/claude-req-sys:req-priority` - 优先级科学评估
- `/claude-req-sys:req-metrics` - 需求度量分析

**变更处理**:

- `/claude-req-sys:req-change` - 需求变更管理
- `/claude-req-sys:req-migrate` - 需求迁移

**工具**:

- `/claude-req-sys:req-unify` - 文档结构统一

### CLI 工具

插件提供以下 CLI 工具：

```bash
# 初始化需求系统
claude-req-init

# 更新需求
claude-req-update

# 知识图谱搜索
kg-search "用户登录"

# 知识图谱统计
kg-stats

# 知识图谱连接
kg-connections REQ-001

# 知识图谱推荐
kg-recommend

# 重建知识图谱
kg-rebuild
```

## 🔄 从 npm 版本迁移

如果你之前使用 npm 全局包版本：

1. **卸载 npm 版本**:

   ```bash
   npm uninstall -g claude-req-sys
   ```

2. **安装插件版本**:

   ```bash
   /plugin install https://github.com/zxc1213/claude-req-sys-plugin/tree/feature/plugin-migration
   ```

3. **数据兼容性**: 现有的 `.requirements/` 目录完全兼容，无需迁移

## 🔧 开发者安装

如果你想从源码开发或测试：

```bash
# 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys-plugin.git
cd claude-req-sys

# 本地测试
claude --plugin-dir .

# 或者安装到本地
claude --plugin-dir . --install
```

## 📁 插件结构

```
claude-req-sys/
├── .claude-plugin/
│   └── plugin.json      # 插件清单
├── skills/              # Skills (12个)
│   ├── core/
│   ├── quality/
│   ├── analysis/
│   ├── change/
│   └── utils/
├── commands/            # Commands (13个)
├── hooks/               # Hooks 配置
├── scripts/             # 核心脚本
├── bin/                 # CLI 工具
└── README.md
```

## ⚙️ 配置

插件会自动设置以下环境变量：

- `CLAUDE_REQ_SYS`: 插件根目录路径

Hooks 自动生效：

- `PostToolUse`: 记录工具调用到需求日志
- `Stop`: 生成需求执行总结

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🔗 相关链接

- [GitHub 仓库](https://github.com/zxc1213/claude-req-sys-plugin)
- [问题反馈](https://github.com/zxc1213/claude-req-sys-plugin/issues)
- [更新日志](./CHANGELOG.md)

---

**Made with ❤️ by Claude Code Plugin System**
