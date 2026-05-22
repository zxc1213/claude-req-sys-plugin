# ClaudeReqSys 插件安装指南

> **快速安装 ClaudeReqSys 插件**

## 🚀 安装方法

### 方法 1: 从 GitHub 分支安装（推荐）

```bash
# 从 feature/plugin-migration 分支安装插件版本
/plugin install https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration

# 或使用 git+ 协议指定分支
/plugin install git+https://github.com/zxc1213/claude-req-sys.git#feature/plugin-migration
```

### 方法 2: 使用 SSH 协议

如果你有 GitHub 仓库写权限：

```bash
/plugin install git+ssh://git@github.com/zxc1213/claude-req-sys.git#feature/plugin-migration
```

### 方法 3: 本地安装

```bash
# 1. 克隆仓库
git clone https://github.com/zxc1213/claude-req-sys.git
cd claude-req-sys

# 2. 本地测试
claude --plugin-dir .

# 3. 确认无误后安装
claude --plugin-dir . --install
```

## ✅ 验证安装

安装完成后，运行以下命令验证：

```bash
# 测试主命令
/req --help

# 查看所有可用技能
/agents

# 测试知识图谱 CLI
kg-stats
```

## 🔧 团队私有安装

如果你的团队使用私有 GitHub 仓库或独立分支：

```bash
# 从特定分支安装
/plugin install https://github.com/your-org/claude-req-sys/tree/feature/plugin-migration

# 或考虑创建独立的插件仓库
/plugin install https://github.com/your-org/claude-req-sys-plugin
```

## 💡 建议：创建独立的插件仓库

为了避免版本冲突，建议考虑：

1. **创建独立的插件仓库**: `claude-req-sys-plugin`
   - 优点：清晰分离 npm 版本和插件版本
   - 缺点：需要维护两个仓库

2. **使用分支隔离**（当前方案）
   - 优点：单一仓库，便于管理
   - 缺点：安装时需要指定分支

3. **使用 Git Tag 标记插件版本**
   - 在 feature/plugin-migration 分支创建 tag
   - 安装时使用 tag：`git+https://github.com/zxc1213/claude-req-sys.git#v0.6.0-plugin`

## 📝 从 npm 版本迁移

如果你之前使用 `npm install -g` 安装：

```bash
# 1. 卸载 npm 版本
npm uninstall -g claude-req-sys

# 2. 从 feature/plugin-migration 分支安装插件版本
/plugin install https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration

# 3. 验证数据兼容性（现有 .requirements/ 目录无需迁移）
/req --dashboard
```

## 🐛 常见问题

### Q: 插件安装后找不到命令？

**A**: 运行 `/reload-plugins` 重新加载插件。

### Q: 如何更新插件？

**A**:

```bash
/plugin update claude-req-sys
# 或重新安装
/plugin install --force https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration
```

### Q: 如何卸载插件？

**A**:

```bash
/plugin uninstall claude-req-sys
```

## 📚 更多信息

- [完整文档](https://github.com/zxc1213/claude-req-sys/blob/main/README_PLUGIN.md)
- [问题反馈](https://github.com/zxc1213/claude-req-sys/issues)
