# ClaudeReqSys 插件安装指南

> **快速安装 ClaudeReqSys 插件**

## 🚀 安装方法

### 方法 1: 从 GitHub 直接安装（推荐）

```bash
/plugin install https://github.com/zxc1213/claude-req-sys
```

### 方法 2: 使用 SSH 协议

如果你有 GitHub 仓库写权限：

```bash
/plugin install git+ssh://git@github.com/zxc1213/claude-req-sys.git
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

如果你的团队使用私有 GitHub 仓库：

```bash
# 替换为你的仓库地址
/plugin install https://github.com/your-org/claude-req-sys
```

## 📝 从 npm 版本迁移

如果你之前使用 `npm install -g` 安装：

```bash
# 1. 卸载 npm 版本
npm uninstall -g claude-req-sys

# 2. 安装 GitHub 插件版本
/plugin install https://github.com/zxc1213/claude-req-sys

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
/plugin install --force https://github.com/zxc1213/claude-req-sys
```

### Q: 如何卸载插件？

**A**:

```bash
/plugin uninstall claude-req-sys
```

## 📚 更多信息

- [完整文档](https://github.com/zxc1213/claude-req-sys/blob/main/README_PLUGIN.md)
- [问题反馈](https://github.com/zxc1213/claude-req-sys/issues)
