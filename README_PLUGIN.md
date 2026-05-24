# CRS Plugin

> **⚠️ 注意**: 此插件未发布到 Claude Code 官方市场。请通过 GitHub 仓库安装。

> **Claude Code 插件** - 智能需求管理系统，从需求到测试的全流程自动化

[![Version](https://img.shields.io/badge/version-0.8.0-blue)](https://github.com/zxc1213/crs-plugin)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 🚀 快速开始

### 安装

**方式一：通过 Marketplace 安装（推荐）**:

```bash
# 添加 marketplace
/plugin marketplace add https://github.com/zxc1213/crs-marketplace.git

# 安装插件
/plugin install crs@crs
```

**方式二：本地开发模式**:

```bash
# 克隆仓库到本地
git clone https://github.com/zxc1213/crs-plugin.git
cd crs-plugin

# 使用 cc 命令加载插件
cc --plugin-dir .
```

**方式三：从指定分支安装**:

```bash
# 克隆指定分支
git clone -b feature/plugin-migration https://github.com/zxc1213/crs-plugin.git
cd crs-plugin

# 加载插件
cc --plugin-dir .
```

**团队内私有安装**:

如果你们使用私有的 GitHub 仓库：

```bash
# 克隆私有仓库
git clone https://github.com/your-org/crs-plugin.git
cd crs-plugin

# 加载插件
cc --plugin-dir .
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

- `/crs:req-manager` - 智能需求管理统一入口
- `/crs:req-brainstorm` - 深度需求分析
- `/crs:req-init` - 初始化需求系统

**质量保证**:

- `/crs:req-quality` - 质量门禁检查
- `/crs:req-test-plan` - 测试策略生成
- `/crs:req-verify` - 需求验证

**分析评估**:

- `/crs:req-priority` - 优先级科学评估
- `/crs:req-metrics` - 需求度量分析

**变更处理**:

- `/crs:req-change` - 需求变更管理
- `/crs:req-migrate` - 需求迁移

**工具**:

- `/crs:req-unify` - 文档结构统一

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
   npm uninstall -g crs
   ```

2. **安装插件版本**:

   ```bash
   /plugin install https://github.com/zxc1213/crs-plugin/tree/feature/plugin-migration
   ```

3. **数据兼容性**: 现有的 `.requirements/` 目录完全兼容，无需迁移

## 🔧 开发者安装

如果你想从源码开发或测试：

```bash
# 克隆仓库
git clone https://github.com/zxc1213/crs-plugin.git
cd crs

# 本地测试
claude --plugin-dir .

# 或者安装到本地
claude --plugin-dir . --install
```

## 📁 插件结构

```
crs/
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

Marketplace 安装后即可使用，无需额外配置。

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🔗 相关链接

- [GitHub 仓库](https://github.com/zxc1213/crs-plugin)
- [问题反馈](https://github.com/zxc1213/crs-plugin/issues)
- [更新日志](./CHANGELOG.md)

---

**Made with ❤️ by Claude Code Plugin System**
