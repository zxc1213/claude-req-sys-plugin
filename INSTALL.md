# CRS 插件安装指南

> **通过 Marketplace 快速安装 CRS 插件**

## 🚀 安装方法

### 方法 1: Marketplace 安装（推荐）⭐

```bash
# 1. 添加 Marketplace
/plugin marketplace add zxc1213/crs-marketplace

# 2. 安装插件
/plugin install crs/crs

# 3. 验证安装
/r --help
```

### 方法 2: 直接从 GitHub 安装

```bash
/plugin install https://github.com/zxc1213/crs-plugin
```

## ✅ 验证安装

安装完成后，运行以下命令验证：

```bash
# 查看帮助信息
/r --help

# 查看仪表板
/r --dashboard

# 列出所有需求
/r --list
```

## 🔄 更新插件

```bash
# 更新到最新版本
/plugin update crs@crs
```

## 🗑️ 卸载插件

```bash
# 卸载插件
/plugin remove crs@crs

# 移除 Marketplace（可选）
/plugin marketplace remove crs
```

## 📝 快速命令参考

### 主命令

```bash
/r <描述>              # 创建新需求
/r --quick <描述>       # 快速创建
/r --bug <描述>         # Bug 报告
/r --dashboard          # 查看仪表板
/r --list               # 列出需求
/r --active             # 活跃需求
```

### 子命令

```bash
/r:pri                 # 优先级评估
/r:q                   # 质量检查
/r:init                # 初始化项目
/r:unify               # 统一文档
```

### 知识图谱 CLI

```bash
kg-search "用户登录" 10  # 搜索相似需求
kg-stats                 # 统计信息
kg-connections REQ-001   # 查看关联
kg-recommend             # 智能推荐
kg-rebuild               # 重建索引
```

## 🐛 常见问题

### Q: 插件安装后找不到命令？

**A**: 运行 `/reload` 或重新加载 Claude Code。

### Q: 如何查看插件状态？

**A**:
```bash
/plugin list                    # 查看所有插件
/plugin list crs      # 查看插件详情
```

### Q: 安装失败怎么办？

**A**: 检查网络连接，或尝试：
```bash
/plugin marketplace update crs
/plugin install crs/crs
```

### Q: hooks 不工作？

**A**: hooks 需要手动配置到项目的 `.claude/settings.json` 中。

## 📚 更多信息

- [完整文档](README.md)
- [Marketplace 配置](marketplace-setup/INSTALL.md)
- [问题反馈](https://github.com/zxc1213/crs-plugin/issues)
