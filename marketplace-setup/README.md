# CRS Marketplace

这是 CRS 插件的 marketplace 仓库，用于分发和安装插件。

## 快速开始

### 安装 Marketplace

**使用 GitHub URL（推荐）**：

```bash
/plugin marketplace add https://github.com/zxc1213/crs-marketplace.git
```

**或使用 owner/repo 格式**：

```bash
/plugin marketplace add zxc1213/crs-marketplace
```

### 安装插件

添加 marketplace 后，安装插件：

```bash
/plugin install crs@crs
```

## 仓库结构

```
crs-marketplace/
└── .claude-plugin/
    └── marketplace.json    # Marketplace 配置文件
```

## 配置说明

`marketplace.json` 定义了：
- Marketplace 名称
- 可用的插件列表
- 每个插件的源仓库位置
- 插件元数据（版本、描述、作者等）

## 更新插件

当插件仓库有更新时：

```bash
# 更新 marketplace
/plugin marketplace update crs

# 更新已安装的插件
/plugin update crs@crs
```

## 移除 Marketplace

```bash
/plugin marketplace remove crs
```

## 相关链接

- **插件仓库**: https://github.com/zxc1213/crs-plugin
- **问题反馈**: https://github.com/zxc1213/crs-plugin/issues
